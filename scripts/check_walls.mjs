/**
 * Check a unit's wall graph.
 *
 *   node scripts/check_walls.mjs
 *   node scripts/check_walls.mjs public/apartments/sunway-cochrane/data/type-a.js
 *   node scripts/check_walls.mjs --self-test
 *
 * Fails when a run end is not on another wall, an opening has no
 * door/window/opening type, a door leaf width differs from its opening,
 * or openings overlap or run past the wall. Also fails when a 2 cm
 * sample inside the floor slab is not covered by a finish zone, when a
 * door opening overlaps a window opening, or when a door sits on an
 * exterior wall without kind "entry" or "service".
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { buildWallGraph } from '../public/apartments/shared/wall-graph.js';
import { buildFloorGraph, checkFloorCoverage } from '../public/apartments/shared/floor-graph.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadUnit(file) {
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: file });
  if (!sandbox.window.UNIT) throw new Error(`No window.UNIT in ${file}`);
  return sandbox.window.UNIT;
}

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const cross = (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (cross) inside = !inside;
  }
  return inside;
}

// A door may share a run with a window only when their intervals do not meet.
// On the outer shell the door must be flagged entry (front door) or service
// (yard, balcony). Interior room doors are not flagged.
export function checkDoorPlacement(graph, slab) {
  const issues = [];
  if (!graph || graph.legacy) return issues;
  for (const run of graph.runs) {
    const ops = [...run.openings].sort((a, b) => a.at - b.at);
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      if (op.type !== 'door') continue;
      for (let k = 0; k < ops.length; k++) {
        if (k === i || ops[k].type !== 'window') continue;
        const a0 = op.at;
        const a1 = op.at + op.w;
        const b0 = ops[k].at;
        const b1 = ops[k].at + ops[k].w;
        if (a0 < b1 - 1e-3 && b0 < a1 - 1e-3) {
          issues.push(
            `wall ${run.index} door at ${a0.toFixed(2)} overlaps a window at ${b0.toFixed(2)}`,
          );
        }
      }
      if (!slab || slab.length < 3) continue;
      const mid = op.at + op.w / 2;
      const x = run.x0 + run.ux * mid;
      const y = run.y0 + run.uy * mid;
      const nx = -run.uy;
      const ny = run.ux;
      const reach = 0.4;
      const left = pointInPoly(x + nx * reach, y + ny * reach, slab);
      const right = pointInPoly(x - nx * reach, y - ny * reach, slab);
      if (left === right) continue;
      const kind = op.kind;
      if (kind !== 'entry' && kind !== 'service') {
        issues.push(
          `wall ${run.index} door at ${op.at.toFixed(2)} sits on an exterior wall without kind entry or service`,
        );
      }
    }
  }
  return issues;
}

function report(file) {
  const unit = loadUnit(file);
  const graph = buildWallGraph(unit, {
    ceiling: unit.wallH,
    doorH: unit.doorH,
    windowHead: unit.windowHead,
  });
  if (graph.legacy) {
    console.log(`${path.relative(root, file)}: legacy segment list, run check skipped`);
    return 0;
  }
  const moved = Math.max(0, ...graph.runs.map((r) => r.moved));
  console.log(
    `${unit.id}: ${graph.runs.length} walls, ${graph.openings.length} openings, ${graph.leaves.length} doors, largest snap ${(moved * 100).toFixed(1)} cm`,
  );
  let failed = 0;
  if (graph.issues.length) {
    for (const issue of graph.issues) console.error(`  ${issue}`);
    failed = 1;
  }
  const floor = buildFloorGraph(unit);
  if (!floor.legacy) {
    const area = floor.uncoveredArea || 0;
    console.log(
      `  floors: ${floor.zones.length} finish zones, uncovered ${area.toFixed(3)} m² (${floor.uncoveredCells || 0} of ${floor.insideCells || 0} samples at 2 cm)`,
    );
    if (floor.issues.length) {
      for (const issue of floor.issues) console.error(`  ${issue}`);
      failed = 1;
    }
    const placed = checkDoorPlacement(graph, floor.slab);
    if (placed.length) {
      for (const issue of placed) console.error(`  ${issue}`);
      failed = 1;
    }
  }
  if (!failed) console.log('OK');
  return failed;
}

function selfTest() {
  const bad = {
    wallT: 0.2,
    wallH: 2.5,
    doorH: 2,
    windowHead: 2.1,
    walls: [
      { x0: 0, y0: 0, x1: 2, y1: 0, openings: [{ at: 0.2, w: 0.4, type: 'door', hinge: 'start', swing: 1 }] },
      { x0: 0, y0: 0, x1: 0, y1: 2 },
      // Far end of the first wall is left hanging, and a second opening overlaps.
      {
        x0: 0, y0: 1, x1: 1.5, y1: 1,
        openings: [
          { at: 0.1, w: 0.5, type: 'gap' },
          { at: 0.4, w: 2, type: 'window' },
        ],
      },
    ],
  };
  const graph = buildWallGraph(bad);
  const text = graph.issues.join('\n');
  const expect = [
    /unattached/,
    /no door, window, or opening type/,
    /overlap/,
    /runs past the wall/,
  ];
  const missing = expect.filter((re) => !re.test(text));
  if (missing.length) {
    console.error('self-test did not catch:\n' + missing.join('\n'));
    console.error('issues were:\n' + text);
    return 1;
  }
  // A clean corner passes, and the leaf matches the opening.
  const good = buildWallGraph({
    wallT: 0.2,
    wallH: 2.5,
    walls: [
      { x0: 0, y0: 0, x1: 2, y1: 0, openings: [{ at: 0.4, w: 0.8, type: 'door', hinge: 'start', swing: 1 }] },
      { x0: 0, y0: 0, x1: 0, y1: 2 },
      { x0: 2, y0: 0, x1: 2, y1: 2 },
      { x0: 0, y0: 2, x1: 2, y1: 2 },
    ],
  });
  if (good.issues.length || Math.abs(good.leaves[0].w - 0.8) > 1e-6) {
    console.error('self-test clean corner failed', good.issues, good.leaves);
    return 1;
  }
  const covered = buildFloorGraph({
    wallT: 0.2,
    floors: [{ name: 'Living', box: [0.3, 0.3, 1.7, 1.7] }],
    walls: [
      { x0: 0, y0: 0, x1: 2, y1: 0 },
      { x0: 2, y0: 0, x1: 2, y1: 2 },
      { x0: 2, y0: 2, x1: 0, y1: 2 },
      { x0: 0, y0: 2, x1: 0, y1: 0 },
    ],
  });
  if (covered.issues.length || !covered.slab.length) {
    console.error('self-test floor coverage failed', covered.issues);
    return 1;
  }
  const hole = checkFloorCoverage({
    slab: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }],
    zones: [{ poly: [{ x: 0, y: 0 }, { x: 0.4, y: 0 }, { x: 0.4, y: 1 }, { x: 0, y: 1 }] }],
  });
  if (!hole.length) {
    console.error('self-test did not catch an uncovered floor');
    return 1;
  }
  const bareExterior = {
    wallT: 0.2,
    floors: [{ name: 'Living', box: [0.4, 0.4, 1.6, 1.6] }],
    walls: [
      { x0: 0, y0: 0, x1: 2, y1: 0, openings: [{ at: 0.4, w: 0.8, type: 'door', hinge: 'start', swing: 1 }] },
      { x0: 2, y0: 0, x1: 2, y1: 2 },
      { x0: 2, y0: 2, x1: 0, y1: 2 },
      { x0: 0, y0: 2, x1: 0, y1: 0 },
    ],
  };
  const bareIssues = checkDoorPlacement(buildWallGraph(bareExterior), buildFloorGraph(bareExterior).slab);
  if (!bareIssues.some((issue) => /exterior wall/.test(issue))) {
    console.error('self-test did not catch an unflagged exterior door', bareIssues);
    return 1;
  }
  const flagged = {
    ...bareExterior,
    walls: [
      { x0: 0, y0: 0, x1: 2, y1: 0, openings: [{ at: 0.4, w: 0.8, type: 'door', hinge: 'start', swing: 1, kind: 'entry' }] },
      { x0: 2, y0: 0, x1: 2, y1: 2 },
      { x0: 2, y0: 2, x1: 0, y1: 2 },
      { x0: 0, y0: 2, x1: 0, y1: 0 },
    ],
  };
  const flaggedIssues = checkDoorPlacement(buildWallGraph(flagged), buildFloorGraph(flagged).slab);
  if (flaggedIssues.length) {
    console.error('self-test flagged an entry door', flaggedIssues);
    return 1;
  }
  const mixed = buildWallGraph({
    wallT: 0.2,
    walls: [
      {
        x0: 0, y0: 0, x1: 3, y1: 0,
        openings: [
          { at: 0.2, w: 0.8, type: 'door', hinge: 'start', swing: 1, kind: 'entry' },
          { at: 0.6, w: 0.8, type: 'window' },
        ],
      },
      { x0: 0, y0: 0, x1: 0, y1: 2 },
      { x0: 3, y0: 0, x1: 3, y1: 2 },
      { x0: 0, y0: 2, x1: 3, y1: 2 },
    ],
  });
  const mixedIssues = checkDoorPlacement(mixed, null);
  if (!mixedIssues.some((issue) => /overlaps a window/.test(issue))) {
    console.error('self-test did not catch a door on a window', mixedIssues);
    return 1;
  }
  console.log('self-test OK');
  return 0;
}

const arg = process.argv[2];
if (arg === '--self-test') process.exit(selfTest());
const file = path.resolve(root, arg || 'public/apartments/sunway-cochrane/data/type-a.js');
process.exit(report(file));
