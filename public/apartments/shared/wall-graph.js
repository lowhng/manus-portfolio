/**
 * Continuous wall runs.
 *
 * A run is one centreline from (x0, y0) to (x1, y1). Openings sit on it by
 * distance `at` from the start and width `w`:
 *   { at, w, type: 'door' | 'window' | 'opening',
 *     sill, head,          // windows
 *     hinge: 'start'|'end', swing: 1|-1, kind }  // doors
 *
 * `hackable: true` tints the whole run (a wall the plan marks with a hammer,
 * removable). `hackable: [{ at, w }]` tints only those stretches of the run.
 *
 * Ends within SNAP_M of another run are slid along their own centreline onto
 * that run. Solids then extend half the joined thickness past the joint so
 * the boxes overlap and close corners and T-junctions. Door leaves are cut
 * from the opening, so the leaf width is the opening width.
 *
 * Array segments ([x0, y0, x1, y1]) are the legacy format (Types B–D) and
 * are left untouched.
 */

export const SNAP_M = 0.05;
const ATTACH_M = 0.01;

export function unitUsesRuns(unit) {
  const walls = unit?.walls || [];
  return walls.length > 0 && walls.every((w) => w && !Array.isArray(w) && typeof w.x0 === 'number');
}

function lineHit(a, b) {
  const det = a.ux * b.uy - a.uy * b.ux;
  if (Math.abs(det) < 1e-9) return null;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return {
    sa: (dx * b.uy - dy * b.ux) / det,
    sb: (dx * a.uy - dy * a.ux) / det,
  };
}

function pointToSeg(px, py, run) {
  const vx = run.x1 - run.x0;
  const vy = run.y1 - run.y0;
  const len2 = vx * vx + vy * vy;
  if (len2 < 1e-12) return Math.hypot(px - run.x0, py - run.y0);
  let t = ((px - run.x0) * vx + (py - run.y0) * vy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (run.x0 + vx * t), py - (run.y0 + vy * t));
}

function cloneRuns(unit) {
  const tDefault = unit.wallT || 0.2;
  return unit.walls.map((w, index) => {
    const dx = w.x1 - w.x0;
    const dy = w.y1 - w.y0;
    const len = Math.hypot(dx, dy);
    return {
      index,
      x0: w.x0,
      y0: w.y0,
      x1: w.x1,
      y1: w.y1,
      t: w.t || tDefault,
      ux: len > 1e-9 ? dx / len : 1,
      uy: len > 1e-9 ? dy / len : 0,
      len,
      // Openings stay tied to the authored start until ends have been snapped.
      openings: (w.openings || []).map((o) => ({ ...o })),
      hackable: w.hackable === true ? true : (w.hackable || []).map((h) => ({ ...h })),
      anchorX: w.x0,
      anchorY: w.y0,
      s0: 0,
      s1: len,
      join0: null,
      join1: null,
      moved: 0,
    };
  });
}

function applyParams(run) {
  run.x0 = run.anchorX + run.ux * run.s0;
  run.y0 = run.anchorY + run.uy * run.s0;
  run.x1 = run.anchorX + run.ux * run.s1;
  run.y1 = run.anchorY + run.uy * run.s1;
  run.len = run.s1 - run.s0;
}

function snapRuns(runs) {
  for (let iter = 0; iter < 6; iter++) {
    for (const run of runs) {
      for (const which of [0, 1]) {
        const sEnd = which === 0 ? run.s0 : run.s1;
        let best = null;
        for (const other of runs) {
          if (other === run || other.len < 1e-6) continue;
          const hit = lineHit(
            { x: run.anchorX, y: run.anchorY, ux: run.ux, uy: run.uy },
            { x: other.anchorX, y: other.anchorY, ux: other.ux, uy: other.uy },
          );
          if (!hit) continue;
          if (Math.abs(hit.sa - sEnd) > SNAP_M) continue;
          if (hit.sb < other.s0 - SNAP_M || hit.sb > other.s1 + SNAP_M) continue;
          // Keep the end on its own side of the run.
          if (which === 0 && hit.sa > run.s1 - 0.02) continue;
          if (which === 1 && hit.sa < run.s0 + 0.02) continue;
          const dist = Math.abs(hit.sa - sEnd);
          if (!best || dist < best.dist) best = { dist, sa: hit.sa, other };
        }
        if (!best) continue;
        const before = sEnd;
        if (which === 0) run.s0 = best.sa;
        else run.s1 = best.sa;
        const join = { t: best.other.t, index: best.other.index };
        if (which === 0) run.join0 = join;
        else run.join1 = join;
        run.moved = Math.max(run.moved, Math.abs(best.sa - before));
        applyParams(run);
      }
    }
  }
  for (const run of runs) {
    const shift = run.s0;
    for (const op of run.openings) op.at -= shift;
    applyParams(run);
  }
}

function pointAt(run, s) {
  // s is distance along the snapped run, 0 at the snapped start.
  return {
    x0: run.x0 + run.ux * s,
    y0: run.y0 + run.uy * s,
  };
}

function spanHackable(run, a, b) {
  if (run.hackable === true) return true;
  const ranges = Array.isArray(run.hackable) ? run.hackable : [];
  const mid = (Math.max(a, 0) + Math.min(b, run.len)) / 2;
  return ranges.some((h) => mid >= h.at - 1e-3 && mid <= h.at + h.w + 1e-3);
}

function spanEnds(run, a, b) {
  const p = pointAt(run, a);
  const q = pointAt(run, b);
  return { x0: p.x0, y0: p.y0, x1: q.x0, y1: q.y0, t: run.t };
}

export function buildWallGraph(unit, opts = {}) {
  const ceiling = opts.ceiling ?? unit.wallH ?? 2.5;
  const doorH = opts.doorH ?? unit.doorH ?? 2;
  const windowHead = opts.windowHead ?? unit.windowHead ?? 2.1;
  if (!unitUsesRuns(unit)) {
    return { legacy: true, runs: [], segments: [], glass: [], leaves: [], openings: [], issues: [] };
  }
  const runs = cloneRuns(unit);
  snapRuns(runs);

  const segments = [];
  const glass = [];
  const leaves = [];
  const openings = [];

  for (const run of runs) {
    const ops = [...run.openings].sort((a, b) => a.at - b.at);
    const spans = [];
    let cursor = 0;
    for (const op of ops) {
      openings.push({ run: run.index, ...op });
      if (op.at > cursor + 1e-4) spans.push({ a: cursor, b: op.at, kind: 'solid' });
      spans.push({ a: op.at, b: op.at + op.w, kind: op.type, op });
      cursor = op.at + op.w;
    }
    if (run.len - cursor > 1e-4) spans.push({ a: cursor, b: run.len, kind: 'solid' });

    for (const span of spans) {
      let a = span.a;
      let b = span.b;
      if (span.kind === 'solid') {
        if (a <= 1e-4 && run.join0) a -= run.join0.t / 2;
        if (b >= run.len - 1e-4 && run.join1) b += run.join1.t / 2;
        const seg = spanEnds(run, a, b);
        if (Math.hypot(seg.x1 - seg.x0, seg.y1 - seg.y0) > 0.01) {
          segments.push({ ...seg, h: ceiling, yBase: 0, role: 'solid', hackable: spanHackable(run, a, b) });
        }
        continue;
      }
      const box = spanEnds(run, a, b);
      const hackable = spanHackable(run, a, b);
      if (span.kind === 'window') {
        const sill = span.op.sill ?? 0.12;
        const head = span.op.head ?? windowHead;
        if (sill > 0.02) {
          segments.push({ ...box, h: Math.min(sill, ceiling), yBase: 0, role: 'sill', hackable });
        }
        const g1 = Math.min(head, ceiling);
        if (g1 > sill + 0.02) glass.push({ ...box, sill, head: g1 });
        if (ceiling > head + 0.02) {
          segments.push({ ...box, h: ceiling - head, yBase: head, role: 'header', hackable });
        }
      } else if (span.kind === 'door' || span.kind === 'opening' || span.kind === 'open') {
        if (span.kind === 'door') {
          const hingeAtEnd = span.op.hinge === 'end';
          const hx = hingeAtEnd ? box.x1 : box.x0;
          const hy = hingeAtEnd ? box.y1 : box.y0;
          const dx = hingeAtEnd ? -run.ux : run.ux;
          const dy = hingeAtEnd ? -run.uy : run.uy;
          leaves.push({
            x: hx,
            y: hy,
            dx,
            dy,
            w: span.op.w,
            swing: span.op.swing ?? 1,
            kind: span.op.kind || 'room',
            run: run.index,
          });
        }
        if (ceiling > doorH + 0.02) {
          segments.push({ ...box, h: ceiling - doorH, yBase: doorH, role: 'lintel', hackable });
        }
      }
    }
  }

  const graph = { legacy: false, runs, segments, glass, leaves, openings, issues: [] };
  graph.issues = checkWallGraph(graph);
  return graph;
}

export function checkWallGraph(graph) {
  if (!graph || graph.legacy) return [];
  const issues = [];
  for (const run of graph.runs) {
    if (run.len < 0.02) {
      issues.push(`wall ${run.index} is shorter than 2 cm`);
      continue;
    }
    for (const which of [0, 1]) {
      const x = which === 0 ? run.x0 : run.x1;
      const y = which === 0 ? run.y0 : run.y1;
      let nearest = Infinity;
      for (const other of graph.runs) {
        if (other === run) continue;
        nearest = Math.min(nearest, pointToSeg(x, y, other));
      }
      if (nearest > ATTACH_M) {
        issues.push(
          `wall ${run.index} ${which === 0 ? 'start' : 'end'} (${x.toFixed(3)}, ${y.toFixed(3)}) is unattached (${(nearest * 100).toFixed(1)} cm from the nearest wall)`,
        );
      }
    }
    const ops = [...run.openings].sort((a, b) => a.at - b.at);
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      const type = op.type === 'open' ? 'opening' : op.type;
      if (type !== 'door' && type !== 'window' && type !== 'opening') {
        issues.push(`wall ${run.index} opening ${i} has no door, window, or opening type`);
      }
      if (!(op.w > 0)) issues.push(`wall ${run.index} opening ${i} has no width`);
      if (op.at < -1e-3 || op.at + op.w > run.len + 1e-3) {
        issues.push(
          `wall ${run.index} opening ${i} runs past the wall (at ${op.at.toFixed(3)} width ${op.w.toFixed(3)}, wall ${run.len.toFixed(3)})`,
        );
      }
      if (i > 0 && ops[i - 1].at + ops[i - 1].w > op.at + 1e-3) {
        issues.push(`wall ${run.index} openings ${i - 1} and ${i} overlap`);
      }
    }
  }
  // Pair each door opening with one leaf of the same width. Two doors on one
  // wall (the bath) can share a width, so a leaf is consumed once.
  const pool = [...graph.leaves];
  for (const op of graph.openings) {
    if (op.type !== 'door') continue;
    const i = pool.findIndex((l) => l.run === op.run && Math.abs(l.w - op.w) <= 1e-3);
    if (i < 0) {
      issues.push(`wall ${op.run} door opening width ${op.w.toFixed(3)} has no matching leaf`);
    } else {
      pool.splice(i, 1);
    }
  }
  for (const leaf of pool) {
    issues.push(`wall ${leaf.run} door leaf width ${leaf.w.toFixed(3)} differs from its opening`);
  }
  return issues;
}
