/**
 * Check a unit's wall graph.
 *
 *   node scripts/check_walls.mjs
 *   node scripts/check_walls.mjs public/apartments/sunway-cochrane/data/type-a.js
 *   node scripts/check_walls.mjs --self-test
 *
 * Fails when a run end is not on another wall, an opening has no
 * door/window/opening type, a door leaf width differs from its opening,
 * or openings overlap or run past the wall.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { buildWallGraph } from '../public/apartments/shared/wall-graph.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadUnit(file) {
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: file });
  if (!sandbox.window.UNIT) throw new Error(`No window.UNIT in ${file}`);
  return sandbox.window.UNIT;
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
  if (graph.issues.length) {
    for (const issue of graph.issues) console.error(`  ${issue}`);
    return 1;
  }
  console.log('OK');
  return 0;
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
  console.log('self-test OK');
  return 0;
}

const arg = process.argv[2];
if (arg === '--self-test') process.exit(selfTest());
const file = path.resolve(root, arg || 'public/apartments/sunway-cochrane/data/type-a.js');
process.exit(report(file));
