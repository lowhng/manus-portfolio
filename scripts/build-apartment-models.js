#!/usr/bin/env node
/**
 * Build apartment 3D models from floor plans
 * Generates HTML pages with three.js models based on the Ayanna style
 */

const fs = require('fs');
const path = require('path');

// Unit specifications from the floor plans and CSV data
const UNITS = {
  'type-a': {
    name: 'Type A',
    beds: '1+1',
    baths: 1,
    sqft: 650,
    rooms: [
      { name: 'Living / Dining / Kitchen', type: 'living', dims: [5.8, 4.2], pos: [2.9, 2.1] },
      { name: 'Bedroom', type: 'bedroom', dims: [3.5, 3.2], pos: [1.75, 6.7] },
      { name: 'Study', type: 'study', dims: [2.2, 2.0], pos: [4.8, 7.0] },
      { name: 'Bathroom', type: 'bathroom', dims: [2.0, 1.8], pos: [4.0, 4.9] }
    ],
    totalDims: [6.5, 8.5]
  },
  'type-b': {
    name: 'Type B',
    beds: 2,
    baths: 2,
    sqft: 732,
    rooms: [
      { name: 'Living / Dining / Kitchen', type: 'living', dims: [6.2, 4.5], pos: [3.1, 2.25] },
      { name: 'Master Bedroom', type: 'master', dims: [3.8, 3.5], pos: [1.9, 7.0] },
      { name: 'Bedroom 2', type: 'bedroom', dims: [3.2, 3.0], pos: [5.0, 7.2] },
      { name: 'Master Bath', type: 'bathroom', dims: [2.0, 1.8], pos: [1.0, 5.0] },
      { name: 'Bathroom', type: 'bathroom', dims: [1.8, 1.6], pos: [5.2, 5.2] }
    ],
    totalDims: [6.8, 9.0]
  },
  'type-c': {
    name: 'Type C',
    beds: '2+1',
    baths: 2,
    sqft: 872,
    rooms: [
      { name: 'Living / Dining / Kitchen', type: 'living', dims: [6.8, 4.8], pos: [3.4, 2.4] },
      { name: 'Master Bedroom', type: 'master', dims: [4.0, 3.8], pos: [2.0, 7.5] },
      { name: 'Bedroom 2', type: 'bedroom', dims: [3.4, 3.2], pos: [5.5, 7.6] },
      { name: 'Study', type: 'study', dims: [2.4, 2.2], pos: [6.2, 4.8] },
      { name: 'Master Bath', type: 'bathroom', dims: [2.2, 2.0], pos: [1.0, 5.5] },
      { name: 'Bathroom', type: 'bathroom', dims: [2.0, 1.8], pos: [5.4, 5.4] }
    ],
    totalDims: [7.5, 9.5]
  },
  'type-d': {
    name: 'Type D',
    beds: 3,
    baths: 2,
    sqft: 1001,
    rooms: [
      { name: 'Living / Dining / Kitchen', type: 'living', dims: [7.2, 5.2], pos: [3.6, 2.6] },
      { name: 'Master Bedroom', type: 'master', dims: [4.2, 4.0], pos: [2.1, 8.0] },
      { name: 'Bedroom 2', type: 'bedroom', dims: [3.6, 3.4], pos: [5.8, 8.2] },
      { name: 'Bedroom 3', type: 'bedroom', dims: [3.2, 3.0], pos: [8.0, 6.5] },
      { name: 'Master Bath', type: 'bathroom', dims: [2.4, 2.2], pos: [1.0, 6.0] },
      { name: 'Bathroom', type: 'bathroom', dims: [2.2, 2.0], pos: [6.0, 5.8] }
    ],
    totalDims: [8.5, 10.5]
  }
};

const PROJECT_INFO = {
  name: 'Sunway Cochrane',
  location: 'Cheras, Kuala Lumpur',
  developer: 'Sunway Property',
  sourceUrl: 'https://assets.sunwayproperty.com/2026/03/Sunway-Cochrane-Brochure.pdf'
};

function generateModelHTML(unitKey, unit) {
  const roomsData = unit.rooms.map(r => ({
    name: r.name,
    c: r.pos,
    box: [r.pos[0] - r.dims[0]/2, r.pos[1] - r.dims[1]/2, r.pos[0] + r.dims[0]/2, r.pos[1] + r.dims[1]/2],
    rect: true
  }));

  const center = [unit.totalDims[0]/2, unit.totalDims[1]/2];
  const views = [
    { id: 'overview', name: 'Overview', pos: [center[0] - 3, center[1] - 8, 12], tgt: center, fov: 40 },
    { id: 'plan', name: 'Plan', pos: [center[0], center[1], 18], tgt: center, fov: 35 },
    { id: 'living', name: 'Living area', pos: [center[0], 1.6, center[1] * 0.3], tgt: [center[0], 1.2, center[1] * 0.6], hfov: 96 }
  ];

  return `<!doctype html>
<html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${PROJECT_INFO.name} ${unit.name} — 3D Model</title>
<style>
/* Reuse Ayanna's styling */
:root{color-scheme:light;box-sizing:border-box}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#faf9f5;color:#141413;overflow:hidden}
:root{
  --sky-top:#dfe7ee; --sky-bottom:#f3f2ee;
  --panel:rgba(252,251,248,.86); --panel-line:rgba(60,66,56,.14);
  --ink:#23271f; --ink-soft:#5b6154; --ink-faint:#8a8f82;
  --accent:#5f6b55; --accent-ink:#fbfaf6; --chip:#eceae3; --chip-hover:#e1ded5;
  --label-bg:rgba(35,39,31,.78); --label-ink:#f7f5ef;
  --sans:"Manrope",system-ui,-apple-system,sans-serif;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  color-scheme:dark;
  --sky-top:#1d2226; --sky-bottom:#2b2d2a;
  --panel:rgba(30,33,29,.86); --panel-line:rgba(230,232,220,.12);
  --ink:#ecebe4; --ink-soft:#b3b6aa; --ink-faint:#80847a;
  --accent:#a3b394; --accent-ink:#1b1e19; --chip:#353933; --chip-hover:#41463e;
  --label-bg:rgba(248,246,240,.9); --label-ink:#23271f;
}}
html,body{height:100%}
body{background:linear-gradient(180deg,var(--sky-top),var(--sky-bottom));color:var(--ink);font-family:var(--sans)}
#stage{position:fixed;inset:0}
#stage canvas{display:block;width:100%;height:100%;touch-action:none}
#labels{position:fixed;inset:0;pointer-events:none}
.lbl{position:absolute;transform:translate(-50%,-50%);background:var(--label-bg);color:var(--label-ink);font:600 11px/1 var(--sans);padding:5px 8px;border-radius:999px;white-space:nowrap}
#panel{position:fixed;top:calc(16px + env(safe-area-inset-top,0px));left:16px;width:290px;background:var(--panel);backdrop-filter:blur(14px);border:1px solid var(--panel-line);border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:16px}
.eyebrow{font:500 10.5px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint)}
h1{margin:6px 0 4px;font-size:22px;font-weight:700}
.meta{font-size:12.5px;color:var(--ink-soft);line-height:1.5}
.sec{display:flex;flex-direction:column;gap:8px}
.sec h2{margin:0;font:500 10.5px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint)}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:0;background:var(--chip);border-radius:8px;padding:7px 10px;font-size:12.5px;font-weight:600;cursor:pointer}
.chip:hover{background:var(--chip-hover)}
.chip[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink)}
.rooms{margin:0;padding:0;list-style:none}
.rooms button{width:100%;display:flex;justify-content:space-between;border:0;background:none;padding:7px 4px;border-top:1px solid var(--panel-line);text-align:left;cursor:pointer}
.rooms li:first-child button{border-top:0}
.rooms button:hover{color:var(--accent)}
.dim{font:400 11.5px var(--mono);color:var(--ink-faint);white-space:nowrap}
#hint{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));font:400 11px var(--mono);color:var(--ink-soft);background:var(--panel);border:1px solid var(--panel-line);padding:8px 10px;border-radius:8px}
#loader{position:fixed;inset:0;display:grid;place-items:center;pointer-events:none}
#loader div{font:500 12px var(--mono);color:var(--ink-soft)}
#loader[hidden]{display:none}
@media (max-width:640px){
  #panel{top:auto;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));width:auto;max-height:50%;padding:14px}
  h1{font-size:18px}
  #hint{display:none}
}
.embed #hint{display:none}
.embed #panel{max-width:calc(100% - 32px)}
</style>
<script>
{
  const q = new URLSearchParams(location.search);
  if (q.get('embed') === '1') document.documentElement.classList.add('embed');
  const t = q.get('theme');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
}
</script>
</head>
<body>

<div id="stage"></div>
<div id="labels"></div>
<div id="loader"><div>Loading model…</div></div>

<aside id="panel">
  <div>
    <div class="eyebrow">${PROJECT_INFO.name} · ${PROJECT_INFO.location}</div>
    <h1>${unit.name} unit</h1>
    <div class="meta">${unit.beds} bedroom${unit.beds !== 1 ? 's' : ''} · ${unit.baths} bathroom${unit.baths !== 1 ? 's' : ''} · ${unit.sqft} sqft built-up. Model based on developer floor plan.</div>
  </div>
  <div class="sec">
    <h2>Views</h2>
    <div class="chips" id="views"></div>
  </div>
  <div class="sec">
    <h2>Rooms · approx. from plan</h2>
    <ul class="rooms" id="rooms"></ul>
  </div>
  <div class="meta" style="font-size:11px">Dimensions estimated from floor plan. Furniture placement conceptual. Source: <a href="${PROJECT_INFO.sourceUrl}" target="_blank" style="color:var(--accent)">developer brochure</a></div>
</aside>
<div id="hint">Drag to orbit · scroll to zoom · right‑drag to pan</div>

<script type="importmap">
{"imports":{
  "three":"https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",
  "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/"
}}
</script>
<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const B = (x, y, z = 0) => new THREE.Vector3(x, z, -y);

const ROOMS = ${JSON.stringify(roomsData, null, 2)};
const CENTER = B(${center[0]}, ${center[1]}, 0);
const VIEWS = ${JSON.stringify(views.map(v => ({
  ...v,
  pos: \`B(\${v.pos[0]}, \${v.pos[1]}, \${v.pos[2]})\`,
  tgt: \`B(\${v.tgt[0]}, \${v.tgt[1]}, 0)\`
})), null, 2).replace(/"B\(([^)]+)\)"/g, 'B($1)')};

const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
scene.environmentIntensity = 0.55;

const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.495;
controls.maxDistance = 45;

// Lighting
const e = new THREE.Euler(0.8726646, 0.1745329, -2.7925267, 'XYZ');
const d = new THREE.Vector3(0, 0, -1).applyEuler(e);
const sunDir = new THREE.Vector3(d.x, d.z, -d.y).normalize();
const sun = new THREE.DirectionalLight(0xfff3e2, 3.2);
sun.position.copy(CENTER).addScaledVector(sunDir, -25);
sun.target.position.copy(CENTER);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 60 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight(0xdbe6ff, 0xb9ab95, 0.9));

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.ShadowMaterial({ opacity: 0.18 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(CENTER.x, -0.052, CENTER.z);
ground.receiveShadow = true;
scene.add(ground);

// Build geometry from room data
function buildApartment() {
  const group = new THREE.Group();
  
  // Floor
  const floorGeom = new THREE.PlaneGeometry(${unit.totalDims[0]}, ${unit.totalDims[1]});
  const floorMat = new THREE.MeshStandardMaterial({ 
    color: 0xd4c8b0,
    roughness: 0.8,
    metalness: 0.0
  });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(CENTER.x, 0, CENTER.z);
  floor.receiveShadow = true;
  group.add(floor);

  // Walls (simplified - just outer perimeter for now)
  const wallHeight = 2.8;
  const wallThickness = 0.15;
  const wallMat = new THREE.MeshStandardMaterial({ 
    color: 0xf5f3ed,
    roughness: 0.9,
    metalness: 0.0
  });

  // Create perimeter walls
  const [w, d] = [${unit.totalDims[0]}, ${unit.totalDims[1]}];
  const walls = [
    { pos: [w/2, wallHeight/2, -wallThickness/2], size: [w, wallHeight, wallThickness] }, // front
    { pos: [w/2, wallHeight/2, d + wallThickness/2], size: [w, wallHeight, wallThickness] }, // back
    { pos: [-wallThickness/2, wallHeight/2, d/2], size: [wallThickness, wallHeight, d] }, // left
    { pos: [w + wallThickness/2, wallHeight/2, d/2], size: [wallThickness, wallHeight, d] } // right
  ];

  walls.forEach(({ pos, size }) => {
    const geom = new THREE.BoxGeometry(...size);
    const wall = new THREE.Mesh(geom, wallMat);
    wall.position.set(...pos);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);
  });

  return group;
}

const apartment = buildApartment();
scene.add(apartment);

// Labels
const labelsEl = document.getElementById('labels');
const labelNodes = ROOMS.map((r) => {
  const el = document.createElement('div');
  el.className = 'lbl';
  el.textContent = r.name;
  labelsEl.appendChild(el);
  return { el, p: B(r.c[0], r.c[1], 0.1) };
});

function placeLabels() {
  const w = stage.clientWidth, h = stage.clientHeight;
  for (const L of labelNodes) {
    const tmp = L.p.clone().project(camera);
    const vis = tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1;
    L.el.style.display = vis ? '' : 'none';
    if (vis) {
      L.el.style.left = \`\${(tmp.x * .5 + .5) * w}px\`;
      L.el.style.top = \`\${(-tmp.y * .5 + .5) * h}px\`;
    }
  }
}

// Views
const viewsEl = document.getElementById('views');
const chipEls = {};
let currentView = VIEWS[0];

function goView(v) {
  currentView = v;
  for (const k in chipEls) chipEls[k].setAttribute('aria-pressed', String(k === v.id));
  camera.position.copy(v.pos);
  controls.target.copy(v.tgt);
  camera.fov = v.hfov ? Math.atan(Math.tan(THREE.MathUtils.degToRad(v.hfov) / 2) / camera.aspect) * 360 / Math.PI : v.fov;
  camera.updateProjectionMatrix();
  controls.update();
}

for (const v of VIEWS) {
  const b = document.createElement('button');
  b.className = 'chip';
  b.textContent = v.name;
  b.onclick = () => goView(v);
  chipEls[v.id] = b;
  viewsEl.appendChild(b);
}

// Room list
const roomsEl = document.getElementById('rooms');
for (const r of ROOMS) {
  const [x0, y0, x1, y1] = r.box;
  const w = x1 - x0, h = y1 - y0;
  const li = document.createElement('li');
  const b = document.createElement('button');
  const dim = \`\${w.toFixed(1)} × \${h.toFixed(1)} m · \${(w * h).toFixed(1)} m²\`;
  b.innerHTML = \`<span>\${r.name}</span><span class="dim">\${dim}</span>\`;
  b.onclick = () => {
    const tgt = B(r.c[0], r.c[1], 0.3);
    const pos = B(r.c[0] - w * 0.15, r.c[1] - (Math.max(w, h) * 0.9 + 2.2), Math.max(w, h) * 1.2 + 3.2);
    camera.position.copy(pos);
    controls.target.copy(tgt);
    camera.fov = 45;
    camera.updateProjectionMatrix();
    controls.update();
  };
  li.appendChild(b);
  roomsEl.appendChild(li);
}

// Resize
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();
goView(VIEWS[0]);

document.getElementById('loader').hidden = true;

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
  placeLabels();
});
</script>
</body></html>`;
}

// Generate all unit HTML files
console.log('Building apartment models for Sunway Cochrane...');
const outputDir = path.join(__dirname, '..', 'public', 'apartments', 'sunway-cochrane');

for (const [key, unit] of Object.entries(UNITS)) {
  const html = generateModelHTML(key, unit);
  const filename = `${key}.html`;
  fs.writeFileSync(path.join(outputDir, filename), html);
  console.log(`✓ Generated ${filename}`);
}

console.log('✓ All models generated');
