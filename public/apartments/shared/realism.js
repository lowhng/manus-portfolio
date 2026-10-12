/**
 * Physical-plausibility checks for a unit whose walls are centreline runs.
 *
 * Envelope. An opening with the open world on one side must be a window,
 * a sliding glass door, or a hinged door. A large walk-out onto a balcony
 * or yard is a slider, a hinged door, or full-height glazing (sill at the
 * floor). A bare hole is only legal on the outer edge of a balcony, yard,
 * or other outdoor room, and that edge has to be a railing or parapet
 * (0.90–1.25 m). Indoor rooms are never left open to the sky.
 *
 * Floors. The existing floor graph already rejects an uncovered 2 cm sample.
 * Every balcony, yard, and A/C ledge must also sit inside that slab, on an
 * outdoor finish.
 *
 * Furniture. Each piece has a category (see furniture-categories.js). Its
 * footprint may overlap a wall by at most 1 cm. Wall-backed pieces sit back
 * to a wall, within 3 cm of the face. Mirrors and wall TVs are on a wall,
 * with the vertical centre in a standing or seated range. Pieces do not
 * overlap each other (a rug, a chair tucked under a table, a bedside against
 * a bed, and decor on a counter are the exceptions) and stay inside one room.
 *
 * Doors. A hole between two indoor rooms needs a leaf, or `noDoor` set to an
 * open-plan arch. At most one such arch, and never more than 5% of the
 * passages. A drawn quarter-circle that matches no leaf is reported by
 * unmatchedArcs.
 */

import { buildWallGraph } from './wall-graph.js';
import { buildFloorGraph } from './floor-graph.js';
import { FURNITURE, PROCEDURAL, MOUNT_RANGE } from './furniture-categories.js';

const WALL_OVERLAP_M = 0.01;
const BACK_GAP_M = 0.03;
const BACK_COS = Math.cos(25 * Math.PI / 180);
const PARALLEL_SIN = Math.sin(25 * Math.PI / 180);
const WALKOUT_M = 1.2;

export function isOutdoorName(name) {
  const n = String(name || '');
  if (/kitchen|bed|bath|living|dining|foyer|study|store|hall|stair|passage|master/i.test(n)) return false;
  return /balcony|patio|terrace|\byard\b|a\/?c|ledge|planter/i.test(n);
}

function walkableOutdoor(name) {
  return isOutdoorName(name) && !/a\/?c|ledge|planter/i.test(name);
}

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-12) + xi) inside = !inside;
  }
  return inside;
}

function classify(x, y, floor) {
  if (!floor.slab || floor.slab.length < 3 || !pointInPoly(x, y, floor.slab)) return { where: 'world', name: '' };
  for (const zone of floor.zones || []) {
    if (pointInPoly(x, y, zone.poly)) {
      return { where: isOutdoorName(zone.name) ? 'outdoor' : 'indoor', name: zone.name || '' };
    }
  }
  return { where: 'indoor', name: '' };
}

function sidePoint(run, s, sign, reach) {
  const x = run.x0 + run.ux * s;
  const y = run.y0 + run.uy * s;
  const nx = -run.uy;
  const ny = run.ux;
  return { x: x + nx * sign * reach, y: y + ny * sign * reach };
}

function openingSides(run, op, floor) {
  const mid = op.at + op.w / 2;
  const reach = (run.t || 0.2) / 2 + 0.18;
  const left = sidePoint(run, mid, 1, reach);
  const right = sidePoint(run, mid, -1, reach);
  return [classify(left.x, left.y, floor), classify(right.x, right.y, floor)];
}

function runSides(run, floor) {
  const mid = run.len / 2;
  const reach = (run.t || 0.2) / 2 + 0.18;
  return [classify(sidePoint(run, mid, 1, reach).x, sidePoint(run, mid, 1, reach).y, floor),
    classify(sidePoint(run, mid, -1, reach).x, sidePoint(run, mid, -1, reach).y, floor)];
}

function isFilled(op, unit) {
  const type = op.type === 'open' ? 'opening' : op.type;
  if (type === 'door' || type === 'slider' || type === 'rail') return true;
  if (type === 'window') return true;
  return false;
}

function isFullHeightGlazing(op, unit) {
  if (op.type !== 'window' && op.type !== 'slider') return false;
  const sill = op.sill ?? (op.type === 'slider' ? 0 : 0.12);
  const head = op.head ?? unit.windowHead ?? 2.1;
  return sill <= 0.05 && head >= 1.95;
}

function archReason(op) {
  return typeof op.noDoor === 'string' && /open-plan|arch/i.test(op.noDoor);
}

function checkEnvelope(graph, floor, unit, issues) {
  for (const run of graph.runs) {
    if (run.rail == null) continue;
    const h = Number(run.rail);
    if (!(h >= 0.9 && h <= 1.25)) {
      issues.push(`wall ${run.index} railing is ${Number.isFinite(h) ? h.toFixed(2) : run.rail} m; a parapet is 0.90–1.25 m`);
    }
    const [a, b] = runSides(run, floor);
    const indoor = a.where === 'indoor' || b.where === 'indoor';
    const world = a.where === 'world' || b.where === 'world';
    if (indoor && world) {
      issues.push(`wall ${run.index} railing opens an indoor room to the outside`);
    }
  }
  for (const run of graph.runs) {
    for (const op of run.openings) {
      const [a, b] = openingSides(run, op, floor);
      const sides = [a.where, b.where];
      const world = sides.includes('world');
      const indoor = sides.includes('indoor');
      const outdoor = sides.includes('outdoor');
      const type = op.type === 'open' ? 'opening' : op.type;
      if (world && indoor) {
        if (!isFilled(op, unit) || type === 'opening' || type === 'rail') {
          issues.push(
            `wall ${run.index} opening at ${op.at.toFixed(2)} (${op.w.toFixed(2)} m) exposes an indoor room to the open world`,
          );
        }
      } else if (world && outdoor && !indoor) {
        if (type === 'opening' || type === 'door' || type === 'window' || type === 'slider') {
          if (type === 'opening') {
            issues.push(
              `wall ${run.index} opening at ${op.at.toFixed(2)} leaves ${a.name || b.name || 'an outdoor space'} open to the world without a railing`,
            );
          }
        } else if (type === 'rail') {
          const h = Number(op.h ?? op.rail ?? 1.05);
          if (!(h >= 0.9 && h <= 1.25)) {
            issues.push(`wall ${run.index} rail opening at ${op.at.toFixed(2)} is not a 0.90–1.25 m parapet`);
          }
        }
      } else if (indoor && outdoor) {
        const outdoorName = a.where === 'outdoor' ? a.name : b.name;
        if (type === 'opening' || type === 'rail' || !isFilled(op, unit)) {
          issues.push(
            `wall ${run.index} opening at ${op.at.toFixed(2)} (${op.w.toFixed(2)} m) onto ${outdoorName || 'outdoors'} is not a window, sliding door, or door`,
          );
        } else if (walkableOutdoor(outdoorName) && op.w >= WALKOUT_M && type === 'window' && !isFullHeightGlazing(op, unit)) {
          issues.push(
            `wall ${run.index} opening at ${op.at.toFixed(2)} (${op.w.toFixed(2)} m) onto ${outdoorName} needs a sliding door, a hinged door, or full-height glazing`,
          );
        }
      }
    }
  }
}

function checkOutdoorFloors(floor, unit, issues) {
  const specs = [];
  for (const room of unit.rooms || []) if (isOutdoorName(room.name)) specs.push(room);
  for (const patch of unit.floors || []) if (isOutdoorName(patch.name)) specs.push(patch);
  const seen = new Set();
  for (const spec of specs) {
    const key = `${spec.name}:${(spec.box || []).join(',')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const box = spec.box;
    if (!box) continue;
    const x = (box[0] + box[2]) / 2;
    const y = (box[1] + box[3]) / 2;
    const at = classify(x, y, floor);
    if (at.where === 'world' || !floor.slab.length) {
      issues.push(`${spec.name} has no floor inside the envelope (centre ${x.toFixed(2)}, ${y.toFixed(2)} is outside the slab)`);
      continue;
    }
    const covered = (floor.zones || []).some((z) => isOutdoorName(z.name) && pointInPoly(x, y, z.poly));
    if (!covered) {
      issues.push(`${spec.name} centre (${x.toFixed(2)}, ${y.toFixed(2)}) is not on an outdoor floor`);
    }
  }
}

function rotParts(rot) {
  const theta = (rot || 0) * Math.PI / 2;
  return { c: Math.cos(theta), s: Math.sin(theta) };
}

function toPlan(item, lx, lz, cs) {
  return {
    x: item.x + lx * cs.c + lz * (-cs.s),
    y: item.y + lx * (-cs.s) + lz * (-cs.c),
  };
}

function axisDir(axis, cs) {
  if (axis === '+x') return { x: cs.c, y: -cs.s };
  if (axis === '-x') return { x: -cs.c, y: cs.s };
  if (axis === '+z') return { x: -cs.s, y: -cs.c };
  if (axis === '-z') return { x: cs.s, y: cs.c };
  return null;
}

function itemSpec(item) {
  const base = item.procedural ? PROCEDURAL[item.kind] : FURNITURE[item.name];
  if (!base && !(item.meta && item.meta.category)) return null;
  const spec = { ...(base || {}), ...(item.meta || {}) };
  if (item.procedural && (item.w || item.d)) {
    spec.w = item.w || spec.w;
    spec.d = item.d || spec.d;
  }
  if (item.meta && item.meta.category) spec.category = item.meta.category;
  return spec;
}

function footprintOf(item, spec) {
  const sx = item.sx ?? 1;
  const sz = item.sz ?? 1;
  const hx = (spec.w / 2) * sx;
  const hz = (spec.d / 2) * sz;
  const cs = rotParts(item.rot);
  const corners = [
    toPlan(item, hx, hz, cs),
    toPlan(item, -hx, hz, cs),
    toPlan(item, -hx, -hz, cs),
    toPlan(item, hx, -hz, cs),
  ];
  return { corners, hx, hz, cs };
}

function wallQuad(run) {
  const nx = -run.uy * run.t / 2;
  const ny = run.ux * run.t / 2;
  return [
    { x: run.x0 + nx, y: run.y0 + ny },
    { x: run.x1 + nx, y: run.y1 + ny },
    { x: run.x1 - nx, y: run.y1 - ny },
    { x: run.x0 - nx, y: run.y0 - ny },
  ];
}

function axesOf(poly) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    out.push({ x: -dy / len, y: dx / len });
  }
  return out;
}

function project(poly, axis) {
  let min = Infinity;
  let max = -Infinity;
  for (const p of poly) {
    const d = p.x * axis.x + p.y * axis.y;
    if (d < min) min = d;
    if (d > max) max = d;
  }
  return { min, max };
}

function penetration(a, b) {
  let min = Infinity;
  for (const axis of [...axesOf(a), ...axesOf(b)]) {
    const pa = project(a, axis);
    const pb = project(b, axis);
    const overlap = Math.min(pa.max, pb.max) - Math.max(pa.min, pb.min);
    if (overlap <= 0) return 0;
    if (overlap < min) min = overlap;
  }
  return min;
}

function nearestFace(px, py, runs) {
  let best = null;
  for (const run of runs) {
    const vx = run.x1 - run.x0;
    const vy = run.y1 - run.y0;
    const len2 = vx * vx + vy * vy || 1;
    let t = ((px - run.x0) * vx + (py - run.y0) * vy) / len2;
    t = Math.max(0, Math.min(1, t));
    const qx = run.x0 + vx * t;
    const qy = run.y0 + vy * t;
    const dx = px - qx;
    const dy = py - qy;
    const dist = Math.hypot(dx, dy);
    const face = dist - run.t / 2;
    if (!best || face < best.face) best = { face, dist, dx, dy, run };
  }
  return best;
}

function extentAlong(dir, fp) {
  const localX = Math.abs(dir.x * fp.cs.c + dir.y * (-fp.cs.s));
  return localX > 0.5 ? fp.hx : fp.hz;
}

function backAgainstWall(item, spec, fp, runs, dir) {
  const half = extentAlong(dir, fp);
  const edge = half === fp.hx ? fp.hz : fp.hx;
  const tx = -dir.y;
  const ty = dir.x;
  let worst = -Infinity;
  let aligned = false;
  for (const u of [-0.85, 0, 0.85]) {
    const px = item.x + dir.x * half + tx * edge * u;
    const py = item.y + dir.y * half + ty * edge * u;
    const face = nearestFace(px, py, runs);
    if (!face) return false;
    worst = Math.max(worst, face.face);
    if (u === 0) {
      const len = face.dist || 1;
      const towardX = -face.dx / len;
      const towardY = -face.dy / len;
      const dot = dir.x * towardX + dir.y * towardY;
      const parallel = Math.abs(dir.x * face.run.ux + dir.y * face.run.uy);
      aligned = dot >= BACK_COS && parallel <= PARALLEL_SIN;
    }
  }
  return aligned && worst <= BACK_GAP_M && worst >= -WALL_OVERLAP_M;
}

function collectItems(unit) {
  const items = [];
  for (const row of unit.furniture || []) {
    if (!Array.isArray(row)) continue;
    const meta = row.length > 6 && row[6] && typeof row[6] === 'object' ? row[6] : null;
    const [name, x, y, rot = 0, sx = 1, sz = 1] = row;
    items.push({ name, x, y, rot, sx: Number(sx) || 1, sz: Number(sz) || 1, meta, procedural: false });
  }
  for (const p of unit.procedural || []) {
    if (!p || p.skip) continue;
    items.push({
      name: p.kind,
      kind: p.kind,
      x: p.x,
      y: p.y,
      rot: p.rot || 0,
      sx: 1,
      sz: 1,
      w: p.w,
      d: p.d,
      meta: p.category ? { category: p.category, height: p.height } : (p.height ? { height: p.height } : null),
      procedural: true,
    });
  }
  return items;
}

function labelOf(item) {
  const name = item.procedural ? item.kind : item.name;
  return `${name} at (${item.x.toFixed(2)}, ${item.y.toFixed(2)})`;
}

function zoneNameAt(x, y, zones) {
  for (const zone of zones) {
    if (pointInPoly(x, y, zone.poly)) return zone.name || '';
  }
  return null;
}

function crossesWall(a, b, runs) {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const n = Math.max(2, Math.ceil(len / 0.02));
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    for (const run of runs) {
      if (pointInPoly(x, y, wallQuad(run))) return true;
    }
  }
  return false;
}

function overlapAllowed(a, b) {
  const ga = a.spec.overlap;
  const gb = b.spec.overlap;
  if (ga === 'rug' || gb === 'rug') return true;
  if ((ga === 'ontop' && gb === 'counter') || (gb === 'ontop' && ga === 'counter')) return true;
  if (ga === 'chair' && (gb === 'table' || gb === 'desk')) return true;
  if (gb === 'chair' && (ga === 'table' || ga === 'desk')) return true;
  if (ga === 'bedside' && gb === 'bed') return true;
  if (gb === 'bedside' && ga === 'bed') return true;
  if (ga === 'counter' && gb === 'counter') return true;
  return false;
}

function checkFurniture(graph, floor, unit, issues) {
  const placed = [];
  for (const item of collectItems(unit)) {
    const spec = itemSpec(item);
    const name = labelOf(item);
    if (!spec || !spec.category || !spec.w || !spec.d) {
      issues.push(`${name} has no furniture category`);
      continue;
    }
    const fp = footprintOf(item, spec);
    placed.push({ item, spec, fp, name });
    for (const run of graph.runs) {
      const depth = penetration(fp.corners, wallQuad(run));
      if (depth > WALL_OVERLAP_M) {
        issues.push(`${name} intersects wall ${run.index} by ${(depth * 100).toFixed(1)} cm`);
        break;
      }
    }
    const ceiling = unit.wallH || 2.5;
    const top = spec.maxY ?? 0;
    if (top > ceiling + 0.05) {
      issues.push(`${name} is ${(top - ceiling).toFixed(2)} m taller than the ${ceiling.toFixed(2)} m ceiling`);
    }
    if (spec.category === 'wall-backed' || spec.category === 'fixture' || spec.category === 'wall-mounted') {
      const dirs = [];
      if (spec.back) dirs.push(axisDir(spec.back, fp.cs));
      if (spec.thin) {
        dirs.push(axisDir(spec.thin === 'x' ? '+x' : '+z', fp.cs));
        dirs.push(axisDir(spec.thin === 'x' ? '-x' : '-z', fp.cs));
      }
      if (spec.category === 'fixture') {
        for (const axis of ['+x', '-x', '+z', '-z']) dirs.push(axisDir(axis, fp.cs));
      }
      const ok = dirs.some((dir) => dir && backAgainstWall(item, spec, fp, graph.runs, dir));
      if (!ok) {
        const how = spec.category === 'wall-mounted' ? 'is not on a wall' : 'is not back to a wall within 3 cm';
        issues.push(`${name} ${how}`);
      }
    }
    if (spec.category === 'wall-mounted') {
      const range = MOUNT_RANGE[spec.mount] || MOUNT_RANGE.mirror;
      const center = (item.meta && Number.isFinite(item.meta.height)) ? item.meta.height : spec.centerY;
      if (!Number.isFinite(center) || center < range[0] || center > range[1]) {
        issues.push(`${name} centre is ${Number.isFinite(center) ? center.toFixed(2) : '?'} m; a ${spec.mount || 'mirror'} sits between ${range[0]} and ${range[1]} m`);
      }
    }
    if (floor.zones && floor.zones.length) {
      const home = zoneNameAt(item.x, item.y, floor.zones);
      if (home == null) {
        issues.push(`${name} is not inside a room`);
      } else if (spec.category !== 'rug') {
        for (const corner of fp.corners) {
          const there = zoneNameAt(corner.x, corner.y, floor.zones);
          // An open-plan finish line is not a wall. Crossing it is still one room.
          if (there != null && there !== home && crossesWall({ x: item.x, y: item.y }, corner, graph.runs)) {
            issues.push(`${name} leaves ${home} and enters ${there}`);
            break;
          }
        }
      }
    }
  }
  for (let i = 0; i < placed.length; i++) {
    for (let k = i + 1; k < placed.length; k++) {
      if (overlapAllowed(placed[i], placed[k])) continue;
      const depth = penetration(placed[i].fp.corners, placed[k].fp.corners);
      if (depth > WALL_OVERLAP_M) {
        issues.push(`${placed[i].name} overlaps ${placed[k].name} by ${(depth * 100).toFixed(1)} cm`);
      }
    }
  }
}

function checkDoors(graph, floor, unit, issues, ambiguous) {
  const passages = [];
  for (const run of graph.runs) {
    for (const op of run.openings) {
      const type = op.type === 'open' ? 'opening' : op.type;
      if (type !== 'opening' && type !== 'door') continue;
      const [a, b] = openingSides(run, op, floor);
      if (op.ambiguous) {
        const where = `${a.name || a.where} / ${b.name || b.where}`;
        ambiguous.push(`wall ${run.index} opening at ${op.at.toFixed(2)} (${where}) has no drawn swing`);
      }
      if (a.where !== 'indoor' || b.where !== 'indoor') continue;
      if (op.w < 0.45) continue;
      passages.push({ run, op, type });
      if (type === 'door') continue;
      if (!op.noDoor) {
        issues.push(`wall ${run.index} room opening at ${op.at.toFixed(2)} (${op.w.toFixed(2)} m) has no door leaf`);
      } else if (!archReason(op)) {
        issues.push(`wall ${run.index} opening at ${op.at.toFixed(2)} has noDoor "${op.noDoor}"; the only reason is an open-plan arch`);
      }
      if (op.ambiguous || archReason(op)) {
        ambiguous.push(`wall ${run.index} opening at ${op.at.toFixed(2)} (${a.name || 'room'} / ${b.name || 'room'}) has no door leaf${op.noDoor ? `: ${op.noDoor}` : ''}`);
      }
    }
  }
  const open = passages.filter((p) => p.type !== 'door');
  const cap = Math.max(1, Math.floor(passages.length * 0.05));
  if (passages.length && open.length > cap) {
    issues.push(`${open.length} of ${passages.length} room openings have no door; at most ${cap} open-plan arch is allowed`);
  }
}

export function unmatchedArcs(graph, arcs) {
  const issues = [];
  for (const arc of arcs || []) {
    const matched = graph.openings.some((op) => {
      if (op.type !== 'door') return false;
      if (Math.abs(op.w - arc.r) > 0.35) return false;
      const run = graph.runs[op.run];
      if (!run) return false;
      for (const s of [op.at, op.at + op.w]) {
        const x = run.x0 + run.ux * s;
        const y = run.y0 + run.uy * s;
        if (Math.hypot(x - arc.x, y - arc.y) <= 0.45) return true;
      }
      return false;
    });
    if (!matched) {
      issues.push(`drawn arc at (${arc.x.toFixed(2)}, ${arc.y.toFixed(2)}) radius ${arc.r.toFixed(2)} m has no door leaf`);
    }
  }
  return issues;
}

export function checkRealism(unit, opts = {}) {
  const issues = [];
  const ambiguous = [];
  const graph = buildWallGraph(unit, {
    ceiling: unit.wallH,
    doorH: unit.doorH,
    windowHead: unit.windowHead,
  });
  if (graph.legacy) return { issues, ambiguous, graph, floor: null };
  const floor = buildFloorGraph(unit);
  if (!floor.legacy && floor.slab.length >= 3) {
    checkEnvelope(graph, floor, unit, issues);
    checkOutdoorFloors(floor, unit, issues);
    checkFurniture(graph, floor, unit, issues);
    checkDoors(graph, floor, unit, issues, ambiguous);
  }
  if (opts.arcs) issues.push(...unmatchedArcs(graph, opts.arcs));
  return { issues, ambiguous, graph, floor };
}
