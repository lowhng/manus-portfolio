/**
 * Physical-plausibility audit. check_walls.mjs runs this on every unit.
 *
 *   node scripts/check_realism.mjs --self-test
 *   node scripts/check_realism.mjs public/apartments/sunway-cochrane/data/type-a.js
 *   node scripts/check_realism.mjs public/apartments/sunway-cochrane
 *
 * A unit with a floor-plan image needs `plan: { file, ox, oy, mx, my }`
 * so a drawn quarter-circle can be matched to a door leaf. Image +y is down;
 * (ox, oy) is the pixel of world (0, 0) and mx, my are metres per pixel.
 * Arc detection uses Python, Pillow, and numpy.
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { checkRealism } from '../public/apartments/shared/realism.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arcScript = path.join(root, 'scripts', 'find_door_arcs.py');

export function planImages(condoDir, id) {
  if (!id || !fs.existsSync(condoDir)) return [];
  return fs.readdirSync(condoDir).filter((name) => {
    if (!/\.(png|jpe?g)$/i.test(name)) return false;
    if (!name.startsWith(id)) return false;
    const next = name[id.length];
    return !next || !/[a-z0-9]/i.test(next);
  });
}

function readArcs(imagePath, plan, unit) {
  if (!fs.existsSync(imagePath)) return { error: `plan image ${imagePath} is missing`, arcs: [] };
  const walls = (unit.walls || []).filter((w) => !Array.isArray(w)).map((w) => [w.x0, w.y0, w.x1, w.y1]);
  const res = spawnSync('python3', [
    arcScript,
    imagePath,
    String(plan.ox),
    String(plan.oy),
    String(plan.mx),
    String(plan.my),
  ], { input: JSON.stringify(walls), encoding: 'utf8' });
  if (res.status !== 0) {
    const detail = (res.stderr || res.stdout || 'no output').trim().split('\n').slice(-3).join(' ');
    return { error: `drawn-arc check failed (${detail})`, arcs: [] };
  }
  try {
    return { arcs: JSON.parse(res.stdout || '[]'), error: null };
  } catch (err) {
    return { error: `drawn-arc check returned invalid JSON (${err.message})`, arcs: [] };
  }
}

export function auditRealism(unit, file) {
  const issues = [];
  const ambiguous = [];
  const condoDir = path.resolve(path.dirname(file), '..');
  const images = planImages(condoDir, unit.id);
  const plan = unit.plan;
  let arcs = [];
  if (images.length && !plan) {
    issues.push(`floor plan ${images[0]} has no plan registration, so a drawn arc cannot be checked`);
  } else if (plan) {
    const imagePath = path.resolve(condoDir, plan.file || images[0] || '');
    const read = readArcs(imagePath, plan, unit);
    if (read.error) issues.push(read.error);
    arcs = read.arcs;
  }
  const real = checkRealism(unit, { arcs });
  return { issues: [...issues, ...real.issues], ambiguous: [...ambiguous, ...real.ambiguous] };
}

function selfTest() {
  const shell = [
    { x0: 0, y0: 0, x1: 4, y1: 0, openings: [{ at: 1.5, w: 0.9, type: 'door', hinge: 'start', swing: 1, kind: 'entry' }] },
    { x0: 4, y0: 0, x1: 4, y1: 4, openings: [{ at: 1.2, w: 1.4, type: 'window', sill: 0.9, head: 2.1 }] },
    { x0: 0, y0: 4, x1: 4, y1: 4, openings: [{ at: 0.5, w: 1.6, type: 'slider' }] },
    { x0: 0, y0: 0, x1: 0, y1: 4 },
    { x0: 0, y0: 4, x1: 0, y1: 6 },
    { x0: 0, y0: 6, x1: 3, y1: 6, rail: 1.05 },
    { x0: 3, y0: 4, x1: 3, y1: 6, rail: 1.05 },
    { x0: 1.2, y0: 0, x1: 1.2, y1: 2.2, openings: [{ at: 0.4, w: 0.8, type: 'door', hinge: 'end', swing: 1 }] },
  ];
  const good = {
    wallT: 0.2,
    wallH: 2.5,
    doorH: 2,
    windowHead: 2.1,
    floors: [
      { name: 'Bedroom', box: [1.4, 0.3, 3.7, 3.7] },
      { name: 'Hall', box: [0.3, 0.3, 1.1, 2.0] },
      { name: 'Balcony', box: [0.3, 4.3, 2.7, 5.7] },
    ],
    rooms: [
      { name: 'Bedroom', box: [1.4, 0.3, 3.7, 3.7] },
      { name: 'Hall', box: [0.3, 0.3, 1.1, 2.0] },
      { name: 'Balcony', box: [0.3, 4.3, 2.7, 5.7] },
    ],
    walls: shell,
    // Back edge of the wardrobe is 2 cm off the west wall's inner face (x = 0.10).
    // Wardrobe back faces the east wall. Mirror back faces the south wall.
    furniture: [
      ['Master_Wardrobe', 3.568, 2.4, 2, 1, 0.7],
      ['Foyer_Mirror', 2.4, 0.129, 0],
    ],
  };
  const ok = checkRealism(good);
  if (ok.issues.length) {
    console.error('self-test rejected a sound unit');
    for (const issue of ok.issues) console.error('  ' + issue);
    return 1;
  }
  const expect = [
    [patch(good, { walls: hole(shell) }), /exposes an indoor room/],
    [patch(good, { walls: bareBalcony(shell) }), /without a railing/],
    [patch(good, { floors: good.floors.filter((f) => f.name !== 'Balcony'), rooms: good.rooms }), /Balcony has no floor/],
    [patch(good, { furniture: [['Master_Wardrobe', 2.0, 2.6, 0, 1, 0.7]] }), /not back to a wall/],
    [patch(good, { furniture: [['Master_Wardrobe', 0.30, 2.6, 0, 1, 0.7]] }), /intersects wall/],
    [patch(good, { furniture: [['Foyer_Mirror', 2.2, 2.0, 0]] }), /not on a wall/],
    [patch(good, { furniture: [['Sofa', 2.4, 2.2, 0], ['Sofa', 2.5, 2.3, 0]] }), /overlaps/],
    [patch(good, { walls: missingLeaf(shell) }), /has no door leaf/],
    [patch(good, { furniture: [['Not_A_Piece', 2, 2, 0]] }), /no furniture category/],
  ];
  for (const [unit, re] of expect) {
    const found = checkRealism(unit).issues;
    if (!found.some((issue) => re.test(issue))) {
      console.error('self-test did not catch ' + re);
      for (const issue of found) console.error('  ' + issue);
      return 1;
    }
  }
  const arches = checkRealism(patch(good, { walls: twoArches(shell) }));
  if (!arches.issues.some((issue) => /no door/.test(issue))) {
    console.error('self-test allowed two arches', arches.issues);
    return 1;
  }
  const oneArch = checkRealism(patch(good, { walls: oneArchWalls(shell) }));
  if (oneArch.issues.some((issue) => /room opening|no door/.test(issue))) {
    console.error('self-test rejected one open-plan arch', oneArch.issues);
    return 1;
  }
  console.log('self-test OK');
  return 0;
}

function patch(unit, extra) {
  return { ...unit, ...extra };
}

function hole(walls) {
  return walls.map((w, i) => (i === 0 ? { ...w, openings: [{ at: 1.5, w: 0.9, type: 'opening' }] } : w));
}

function bareBalcony(walls) {
  return walls.map((w) => (w.rail ? { ...w, rail: undefined, openings: [{ at: 0.2, w: Math.max(0.4, (w.x1 - w.x0) - 0.4), type: 'opening' }] } : w));
}

function missingLeaf(walls) {
  return walls.map((w) => (w.x0 === 1.2 && w.x1 === 1.2
    ? { ...w, openings: [{ at: 0.4, w: 0.8, type: 'opening' }] }
    : w));
}

function oneArchWalls(walls) {
  return walls.map((w) => (w.x0 === 1.2 && w.x1 === 1.2
    ? { ...w, openings: [{ at: 0.3, w: 1.4, type: 'opening', noDoor: 'open-plan arch' }] }
    : w));
}

function twoArches(walls) {
  return [
    ...oneArchWalls(walls),
    { x0: 1.2, y0: 2.2, x1: 4, y1: 2.2, openings: [{ at: 0.4, w: 0.9, type: 'opening' }] },
  ];
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const arg = process.argv[2];
  if (arg === '--self-test') process.exit(selfTest());
  const { report } = await import('./check_walls.mjs');
  const target = path.resolve(root, arg || 'public/apartments/sunway-cochrane/data/type-a.js');
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    const files = fs.readdirSync(path.join(target, 'data')).filter((name) => name.endsWith('.js')).sort();
    let failed = 0;
    for (const name of files) failed |= report(path.join(target, 'data', name));
    process.exit(failed ? 1 : 0);
  }
  process.exit(report(target));
}
