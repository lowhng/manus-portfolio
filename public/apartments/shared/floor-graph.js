/**
 * Continuous floors for a unit whose walls are centreline runs.
 *
 * The exterior wall runs form one outline. The base slab is that outline
 * pushed out to the outer face of the walls, so the floor meets the wall
 * base with nothing see-through. Each room is a face of the wall graph.
 * Its finish reaches the centrelines of the walls around it, and continues
 * to the outer face where the wall is exterior. Neighbouring finishes meet
 * on the centreline, including through a doorway, so the threshold is filled.
 * An open span with no wall (kitchen into the dining room) is split on the
 * midline between the authored floor boxes, so wet tile and timber still meet
 * with no bare strip.
 */

import { buildWallGraph, unitUsesRuns } from './wall-graph.js';

const EPS = 1e-6;

function quant(v) {
  return Math.round(v * 1000) / 1000;
}

function keyOf(x, y) {
  return `${quant(x)},${quant(y)}`;
}

function signedArea(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

function centroid(poly) {
  const a = signedArea(poly);
  if (Math.abs(a) < 1e-8) {
    let x = 0;
    let y = 0;
    for (const p of poly) { x += p.x; y += p.y; }
    const n = poly.length || 1;
    return { x: x / n, y: y / n };
  }
  let x = 0;
  let y = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const c = p.x * q.y - q.x * p.y;
    x += (p.x + q.x) * c;
    y += (p.y + q.y) * c;
  }
  return { x: x / (6 * a), y: y / (6 * a) };
}

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi + 0) + xi) inside = !inside;
  }
  return inside;
}

function dedupePoly(poly) {
  const out = [];
  for (const p of poly) {
    const q = { x: quant(p.x), y: quant(p.y) };
    const prev = out[out.length - 1];
    if (prev && Math.hypot(prev.x - q.x, prev.y - q.y) < 0.004) continue;
    out.push(q);
  }
  if (out.length > 1 && Math.hypot(out[0].x - out[out.length - 1].x, out[0].y - out[out.length - 1].y) < 0.004) out.pop();
  return out.length >= 3 ? out : poly;
}

function segIntersect(a, b) {
  const dax = a.x1 - a.x0;
  const day = a.y1 - a.y0;
  const dbx = b.x1 - b.x0;
  const dby = b.y1 - b.y0;
  const den = dax * dby - day * dbx;
  const lenA = Math.hypot(dax, day);
  const lenB = Math.hypot(dbx, dby);
  if (lenA < 1e-6 || lenB < 1e-6) return null;
  if (Math.abs(den) < 1e-9) return null;
  const dx = b.x0 - a.x0;
  const dy = b.y0 - a.y0;
  const ta = (dx * dby - dy * dbx) / den;
  const tb = (dx * day - dy * dax) / den;
  const epsA = 0.02 / lenA;
  const epsB = 0.02 / lenB;
  if (ta < -epsA || ta > 1 + epsA || tb < -epsB || tb > 1 + epsB) return null;
  return {
    ta: Math.min(1, Math.max(0, ta)),
    tb: Math.min(1, Math.max(0, tb)),
  };
}

function buildAtomicEdges(runs) {
  const segs = runs
    .map((r) => ({
      x0: r.x0, y0: r.y0, x1: r.x1, y1: r.y1,
      len: r.len, t: r.t || 0.2,
    }))
    .filter((s) => s.len > 0.02);
  // Split points are coordinates shared by both walls. Rounding a parameter
  // and projecting it back misses the other wall's vertex by a millimetre
  // and opens every T-junction.
  const splits = segs.map((s) => [
    { x: quant(s.x0), y: quant(s.y0) },
    { x: quant(s.x1), y: quant(s.y1) },
  ]);
  for (let i = 0; i < segs.length; i++) {
    for (let j = i + 1; j < segs.length; j++) {
      const hit = segIntersect(segs[i], segs[j]);
      if (!hit) continue;
      const a = segs[i];
      let x = a.x0 + (a.x1 - a.x0) * hit.ta;
      let y = a.y0 + (a.y1 - a.y0) * hit.ta;
      let bestD = 0.008;
      for (const s of [segs[i], segs[j]]) {
        for (const p of [[s.x0, s.y0], [s.x1, s.y1]]) {
          const d = Math.hypot(p[0] - x, p[1] - y);
          if (d < bestD) {
            bestD = d;
            x = p[0];
            y = p[1];
          }
        }
      }
      const point = { x: quant(x), y: quant(y) };
      splits[i].push(point);
      splits[j].push(point);
    }
  }
  const edges = [];
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    const dx = s.x1 - s.x0;
    const dy = s.y1 - s.y0;
    const len2 = dx * dx + dy * dy || 1;
    const pts = splits[i]
      .map((p) => ({ x: p.x, y: p.y, t: ((p.x - s.x0) * dx + (p.y - s.y0) * dy) / len2 }))
      .filter((p) => p.t >= -0.002 && p.t <= 1.002)
      .sort((p, q) => p.t - q.t);
    const uniq = [];
    for (const p of pts) {
      const prev = uniq[uniq.length - 1];
      if (prev && Math.hypot(prev.x - p.x, prev.y - p.y) < 0.004) continue;
      uniq.push(p);
    }
    for (let k = 0; k < uniq.length - 1; k++) {
      const a = uniq[k];
      const b = uniq[k + 1];
      if (Math.hypot(b.x - a.x, b.y - a.y) < 0.015) continue;
      edges.push({ x0: a.x, y0: a.y, x1: b.x, y1: b.y, t: s.t });
    }
  }
  return edges;
}

function walkFaces(edges) {
  const verts = new Map();
  function vid(x, y) {
    const k = keyOf(x, y);
    if (!verts.has(k)) verts.set(k, { id: k, x: quant(x), y: quant(y) });
    return verts.get(k);
  }
  const out = new Map();
  function addOut(from, to, t) {
    const ang = Math.atan2(to.y - from.y, to.x - from.x);
    if (!out.has(from.id)) out.set(from.id, []);
    const list = out.get(from.id);
    if (list.some((e) => e.to.id === to.id)) return;
    list.push({ to, ang, t });
  }
  for (const e of edges) {
    const a = vid(e.x0, e.y0);
    const b = vid(e.x1, e.y1);
    addOut(a, b, e.t);
    addOut(b, a, e.t);
  }
  for (const list of out.values()) list.sort((p, q) => p.ang - q.ang);

  const used = new Set();
  const faces = [];
  for (const [fromId, list] of out) {
    for (const edge of list) {
      const startKey = `${fromId}>${edge.to.id}`;
      if (used.has(startKey)) continue;
      const poly = [];
      const faceEdges = [];
      let from = verts.get(fromId);
      let curr = edge;
      let guard = 0;
      let closed = false;
      while (guard++ < 4000) {
        const k = `${from.id}>${curr.to.id}`;
        if (used.has(k)) break;
        used.add(k);
        poly.push({ x: from.x, y: from.y });
        faceEdges.push({
          a: from.id,
          b: curr.to.id,
          p: { x: from.x, y: from.y },
          t: curr.t,
        });
        const head = curr.to;
        const outs = out.get(head.id) || [];
        const back = outs.findIndex((e) => e.to.id === from.id);
        if (back < 0 || !outs.length) break;
        // Clockwise neighbour of the reverse edge keeps the room on the left (CCW).
        const next = outs[(back - 1 + outs.length) % outs.length];
        from = head;
        curr = next;
        if (from.id === verts.get(fromId).id && curr.to.id === edge.to.id && poly.length > 2) {
          closed = true;
          break;
        }
      }
      if (!closed || poly.length < 3) continue;
      const area = signedArea(poly);
      if (area < 0.02) continue;
      faces.push({ poly, edges: faceEdges, area });
    }
  }
  return faces;
}

function boxDist(x, y, box) {
  const [x0, y0, x1, y1] = box;
  const dx = x < x0 ? x0 - x : x > x1 ? x - x1 : 0;
  const dy = y < y0 ? y0 - y : y > y1 ? y - y1 : 0;
  return Math.hypot(dx, dy);
}

function boxCenter(box) {
  return { x: (box[0] + box[2]) / 2, y: (box[1] + box[3]) / 2 };
}

export function finishKind(name) {
  if (/balcony|a\/?c|ledge/i.test(name)) return 'outdoor';
  if (/bath|kitchen|yard|foyer/i.test(name)) return 'wet';
  return 'timber';
}

function lineOf(p, q, dist) {
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (dy / len) * dist;
  const ny = (-dx / len) * dist;
  return { px: p.x + nx, py: p.y + ny, dx, dy };
}

function intersectLines(a, b) {
  const den = a.dx * b.dy - a.dy * b.dx;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((b.px - a.px) * b.dy - (b.py - a.py) * b.dx) / den;
  return { x: a.px + a.dx * t, y: a.py + a.dy * t };
}

function rightShift(p, dx, dy, dist) {
  const len = Math.hypot(dx, dy) || 1;
  return { x: p.x + (dy / len) * dist, y: p.y - (dx / len) * dist };
}

function expandFace(poly, dists) {
  const n = poly.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    const prev = poly[(i + n - 1) % n];
    const curr = poly[i];
    const next = poly[(i + 1) % n];
    const d0 = dists[(i + n - 1) % n] || 0;
    const d1 = dists[i] || 0;
    const a = lineOf(prev, curr, d0);
    const b = lineOf(curr, next, d1);
    const hit = intersectLines(a, b);
    const limit = Math.max(d0, d1, 0.001) * 1.8;
    if (!hit || Math.hypot(hit.x - curr.x, hit.y - curr.y) > limit) {
      // Parallel edges, or a spike miter. Step off each edge at this corner.
      const p0 = rightShift(curr, curr.x - prev.x, curr.y - prev.y, d0);
      const p1 = rightShift(curr, next.x - curr.x, next.y - curr.y, d1);
      out.push(p0);
      if (Math.hypot(p0.x - p1.x, p0.y - p1.y) > 0.004) out.push(p1);
    } else {
      out.push(hit);
    }
  }
  return dedupePoly(out);
}

function chainLoops(directed) {
  const from = new Map();
  for (const e of directed) {
    if (!from.has(e.a)) from.set(e.a, []);
    from.get(e.a).push(e);
  }
  const seen = new Set();
  const loops = [];
  for (const start of directed) {
    if (seen.has(start)) continue;
    const poly = [];
    const dists = [];
    let cursor = start;
    let guard = 0;
    while (cursor && guard++ < 8000 && !seen.has(cursor)) {
      seen.add(cursor);
      poly.push(cursor.p);
      dists.push((cursor.t || 0.2) / 2);
      const outs = (from.get(cursor.b) || []).filter((n) => !seen.has(n));
      cursor = outs[0] || null;
    }
    if (poly.length >= 3) loops.push({ poly, dists, area: signedArea(poly) });
  }
  return loops;
}

function bboxOf(poly) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of poly) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY };
}

function splitByFinish(expanded, specs, bb) {
  const kinds = new Set(specs.map((s) => finishKind(s.name || '')));
  if (kinds.size <= 1) return null;
  const xs = new Set([bb.minX, bb.maxX]);
  const ys = new Set([bb.minY, bb.maxY]);
  for (const s of specs) {
    const [x0, y0, x1, y1] = s.box;
    if (x0 > bb.minX && x0 < bb.maxX) xs.add(quant(x0));
    if (x1 > bb.minX && x1 < bb.maxX) xs.add(quant(x1));
    if (y0 > bb.minY && y0 < bb.maxY) ys.add(quant(y0));
    if (y1 > bb.minY && y1 < bb.maxY) ys.add(quant(y1));
  }
  const X = [...xs].sort((a, b) => a - b);
  const Y = [...ys].sort((a, b) => a - b);
  const pieces = [];
  for (let j = 0; j < Y.length - 1; j++) {
    let run = null;
    for (let i = 0; i < X.length - 1; i++) {
      const cx = (X[i] + X[i + 1]) / 2;
      const cy = (Y[j] + Y[j + 1]) / 2;
      let best = specs[0];
      let bestD = Infinity;
      for (const s of specs) {
        const d = boxDist(cx, cy, s.box);
        if (d < bestD - 1e-6) {
          bestD = d;
          best = s;
        }
      }
      const kind = finishKind(best.name || '');
      if (run && run.kind === kind) run.x1 = X[i + 1];
      else {
        if (run) pieces.push(run);
        run = { spec: best, kind, x0: X[i], x1: X[i + 1], y0: Y[j], y1: Y[j + 1] };
      }
    }
    if (run) pieces.push(run);
  }
  const lip = 0.3;
  const zones = [];
  for (const p of pieces) {
    let { x0, y0, x1, y1 } = p;
    if (x0 <= bb.minX + 1e-6) x0 -= lip;
    if (x1 >= bb.maxX - 1e-6) x1 += lip;
    if (y0 <= bb.minY + 1e-6) y0 -= lip;
    if (y1 >= bb.maxY - 1e-6) y1 += lip;
    const poly = clipPolyToRect(expanded, [x0, y0, x1, y1]);
    if (poly.length < 3 || Math.abs(signedArea(poly)) < 1e-4) continue;
    zones.push({ name: p.spec.name || '', kind: p.kind, poly });
  }
  return zones;
}

function clipEdge(a, b, axis, limit) {
  const av = axis === 'x' ? a.x : a.y;
  const bv = axis === 'x' ? b.x : b.y;
  const t = (limit - av) / ((bv - av) || EPS);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function clipHalf(poly, axis, limit, keepGreater) {
  if (poly.length < 3) return [];
  const coord = (p) => (axis === 'x' ? p.x : p.y);
  const inside = (p) => (keepGreater ? coord(p) >= limit - 1e-8 : coord(p) <= limit + 1e-8);
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const ain = inside(a);
    const bin = inside(b);
    if (ain && bin) out.push(b);
    else if (ain && !bin) out.push(clipEdge(a, b, axis, limit));
    else if (!ain && bin) {
      out.push(clipEdge(a, b, axis, limit));
      out.push(b);
    }
  }
  return out;
}

function clipPolyToRect(poly, rect) {
  const [x0, y0, x1, y1] = rect;
  let out = poly;
  out = clipHalf(out, 'x', x0, true);
  out = clipHalf(out, 'x', x1, false);
  out = clipHalf(out, 'y', y0, true);
  out = clipHalf(out, 'y', y1, false);
  return dedupePoly(out);
}

function specsForFace(face, specs) {
  const inside = [];
  for (const spec of specs) {
    const c = boxCenter(spec.box);
    if (pointInPoly(c.x, c.y, face.poly)) inside.push(spec);
  }
  if (inside.length) return inside;
  const c = centroid(face.poly);
  let best = null;
  let bestD = Infinity;
  for (const spec of specs) {
    const d = boxDist(c.x, c.y, spec.box);
    if (d < bestD) {
      bestD = d;
      best = spec;
    }
  }
  if (best && bestD <= 0.22) return [best];
  return [];
}

export function buildFloorGraph(unit) {
  if (!unitUsesRuns(unit)) {
    return { legacy: true, slab: [], zones: [], issues: [] };
  }
  const graph = buildWallGraph(unit);
  const edges = buildAtomicEdges(graph.runs);
  const faces = walkFaces(edges);
  const specs = (unit.floors && unit.floors.length ? unit.floors : unit.rooms) || [];
  const wallT = unit.wallT || 0.2;

  const included = [];
  for (const face of faces) {
    const mine = specsForFace(face, specs);
    if (!mine.length) continue;
    included.push({ face, specs: mine });
  }

  const count = new Map();
  const directed = [];
  for (const item of included) {
    for (const e of item.face.edges) {
      const undirected = e.a < e.b ? `${e.a}|${e.b}` : `${e.b}|${e.a}`;
      count.set(undirected, (count.get(undirected) || 0) + 1);
      directed.push({ ...e, undirected, t: e.t || wallT });
    }
  }
  const boundary = directed.filter((e) => count.get(e.undirected) === 1);
  const boundarySet = new Set(boundary.map((e) => `${e.a}>${e.b}`));
  const loops = chainLoops(boundary);
  loops.sort((a, b) => b.area - a.area);
  const outer = loops.find((l) => l.area > 0.05) || null;
  const slab = outer ? expandFace(outer.poly, outer.dists) : [];

  const zones = [];
  for (const item of included) {
    const { face } = item;
    const dists = face.edges.map((e) => (boundarySet.has(`${e.a}>${e.b}`) ? (e.t || wallT) / 2 : 0));
    const expanded = expandFace(face.poly, dists);
    const bb = bboxOf(face.poly);
    const split = splitByFinish(expanded, item.specs, bb);
    if (!split) {
      const spec = item.specs[0];
      zones.push({ name: spec.name || '', kind: finishKind(spec.name || ''), poly: expanded });
    } else {
      zones.push(...split);
    }
  }

  const floor = {
    legacy: false,
    slab,
    zones,
    issues: [],
  };
  if (!slab.length) floor.issues.push('floor outline is missing');
  if (!zones.length) floor.issues.push('floor has no finish zones');
  if (slab.length >= 3 && zones.length) floor.issues.push(...checkFloorCoverage(floor));
  return floor;
}

export function checkFloorCoverage(floor, step = 0.02) {
  if (!floor || floor.legacy) return [];
  const slab = floor.slab || [];
  const zones = floor.zones || [];
  if (slab.length < 3) return ['floor outline is missing'];
  const bb = bboxOf(slab);
  let inside = 0;
  let uncovered = 0;
  const holes = [];
  for (let x = bb.minX + step / 2; x < bb.maxX; x += step) {
    for (let y = bb.minY + step / 2; y < bb.maxY; y += step) {
      if (!pointInPoly(x, y, slab)) continue;
      inside++;
      const covered = zones.some((z) => pointInPoly(x, y, z.poly));
      if (!covered) {
        uncovered++;
        if (holes.length < 8) holes.push({ x, y });
      }
    }
  }
  const area = uncovered * step * step;
  floor.sampleM = step;
  floor.insideCells = inside;
  floor.uncoveredCells = uncovered;
  floor.uncoveredArea = area;
  if (uncovered === 0) return [];
  const where = holes.map((h) => `(${h.x.toFixed(2)}, ${h.y.toFixed(2)})`).join(', ');
  return [
    `floor has ${uncovered} uncovered samples (${area.toFixed(3)} m² at ${Math.round(step * 100)} cm). First: ${where}`,
  ];
}
