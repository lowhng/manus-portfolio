/**
 * Shared apartment unit viewer — Ayanna-style lighting/UI + furniture from /shared/furniture.txt
 * Expects window.UNIT to be set before this module runs.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildWallGraph, unitUsesRuns } from './wall-graph.js';

const U = window.UNIT;
if (!U) throw new Error('UNIT data missing');

const params = new URLSearchParams(location.search);
const B = (x, y, z = 0) => new THREE.Vector3(x, z, -y);

// ---------- materials (Ayanna patches) ----------
const GLSL_COMMON = `
varying vec3 vWP; varying vec3 vWN;
uniform vec3 uC0,uC1,uC2,uC3; uniform vec4 uStops; uniform vec3 uMap; uniform float uScale,uWarp; uniform int uOct,uNStops;
uniform vec4 uBrick; uniform vec3 uMortar; uniform int uPlane; uniform float uGrain;
float h13(vec3 p){p=fract(p*0.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(h13(i),h13(i+vec3(1,0,0)),f.x),mix(h13(i+vec3(0,1,0)),h13(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h13(i+vec3(0,0,1)),h13(i+vec3(1,0,1)),f.x),mix(h13(i+vec3(0,1,1)),h13(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.,n=0.;for(int i=0;i<8;i++){if(i>=uOct)break;s+=a*vn(p);n+=a;p*=2.02;a*=.5;}return s/n;}
float bnoise(vec3 p){ if(uWarp>0.){ p+=uWarp*(vec3(vn(p+3.1),vn(p+7.7),vn(p+13.3))-.5); } return fbm(p);}
vec3 ramp(float t){
  if(uNStops==2) return mix(uC0,uC1,smoothstep(uStops.x,uStops.y,t));
  if(t<uStops.y) return mix(uC0,uC1,smoothstep(uStops.x,uStops.y,t));
  if(t<uStops.z) return mix(uC1,uC2,smoothstep(uStops.y,uStops.z,t));
  if(uNStops==3) return uC2;
  return mix(uC2,uC3,smoothstep(uStops.z,uStops.w,t));
}
vec3 toB(vec3 w){return vec3(w.x,-w.z,w.y);}
`;
const FRAG_NOISE = `#include <color_fragment>
{ vec3 p=toB(vWP)*uMap*uScale; diffuseColor.rgb = ramp(bnoise(p)); }`;
const FRAG_BRICK = `#include <color_fragment>
{
  vec2 uv;
  if(uPlane==0){ uv=vec2(vWP.x,-vWP.z); }
  else { vec3 n=abs(vWN); uv = n.x>n.z ? vec2(-vWP.z,vWP.y) : vec2(vWP.x,vWP.y); }
  float w=uBrick.x,hh=uBrick.y,off=uBrick.z,freq=uBrick.w;
  float row=floor(uv.y/hh);
  float o = (mod(row,freq)<0.5) ? off*w : 0.;
  float col=floor((uv.x+o)/w);
  float fx=fract((uv.x+o)/w)*w, fy=fract(uv.y/hh)*hh;
  float dx=min(fx,w-fx), dy=min(fy,hh-fy);
  float aw=max(fwidth(uv.x),1e-4), ah=max(fwidth(uv.y),1e-4);
  float m=max(1.-smoothstep(0.002,0.002+aw,dx),1.-smoothstep(0.002,0.002+ah,dy));
  vec3 c=mix(uC0,uC1,h13(vec3(col,row,7.)));
  if(uGrain>0.){ float g=fbm(vec3(uv.x*3.,uv.y*75.,col*1.7)); c*=mix(0.78,1.0,smoothstep(.3,.7,g)); }
  diffuseColor.rgb = mix(c,uMortar,m*0.85);
}`;
function patch(mat, kind, u) {
  const uniforms = {
    uC0: { value: new THREE.Vector3(...(u.c[0] || [1, 1, 1])) }, uC1: { value: new THREE.Vector3(...(u.c[1] || [1, 1, 1])) },
    uC2: { value: new THREE.Vector3(...(u.c[2] || [1, 1, 1])) }, uC3: { value: new THREE.Vector3(...(u.c[3] || [1, 1, 1])) },
    uStops: { value: new THREE.Vector4(...(u.stops || [0, 1, 1, 1])) }, uNStops: { value: u.c.length },
    uMap: { value: new THREE.Vector3(...(u.map || [1, 1, 1])) }, uScale: { value: u.scale || 1 }, uWarp: { value: u.warp || 0 }, uOct: { value: u.oct || 3 },
    uBrick: { value: new THREE.Vector4(...(u.brick || [1, 1, 0, 1])) }, uMortar: { value: new THREE.Vector3(...(u.mortar || [0, 0, 0])) },
    uPlane: { value: u.plane || 0 }, uGrain: { value: u.grain || 0 },
  };
  mat.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, uniforms);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWP=(modelMatrix*vec4(transformed,1.0)).xyz; vWN=normalize(mat3(modelMatrix)*objectNormal);');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\n' + GLSL_COMMON)
      .replace('#include <color_fragment>', kind === 'noise' ? FRAG_NOISE : FRAG_BRICK);
  };
  mat.customProgramCacheKey = () => kind + mat.name;
  mat.color.set(0xffffff);
  mat.needsUpdate = true;
}
const WOOD = (dark, light) => ['noise', { c: [dark, light], stops: [0.3, 0.7], map: [1, 12, 12], scale: 2.5, warp: 1.5, oct: 5 }];
const PATCHES = {
  'Oak': WOOD([0.48, 0.33, 0.2], [0.66, 0.49, 0.32]),
  'Teak': WOOD([0.34, 0.21, 0.1], [0.5, 0.33, 0.18]),
  'Walnut': WOOD([0.18, 0.11, 0.06], [0.33, 0.21, 0.13]),
  'Rug Bedroom': ['noise', { c: [[0.6, 0.56, 0.48], [0.7, 0.66, 0.58]], stops: [0, 1], scale: 6, oct: 3 }],
  'Rug Living': ['noise', { c: [[0.42, 0.37, 0.31], [0.52, 0.47, 0.4]], stops: [0, 1], scale: 6, oct: 3 }],
  'Quartz': ['noise', { c: [[0.93, 0.92, 0.9], [0.62, 0.61, 0.6], [0.93, 0.92, 0.9]], stops: [0.46, 0.5, 0.54, 1], scale: 1.8, warp: 5, oct: 6 }],
  'Floor Tile': ['brick', { c: [[0.76, 0.73, 0.68], [0.73, 0.7, 0.65]], mortar: [0.55, 0.53, 0.5], brick: [1.2, 0.6, 0, 1] }],
  'Floor Wet Tile': ['brick', { c: [[0.55, 0.56, 0.55], [0.52, 0.53, 0.52]], mortar: [0.35, 0.35, 0.35], brick: [0.3, 0.3, 0, 1] }],
  'Floor Outdoor': ['brick', { c: [[0.48, 0.46, 0.43], [0.45, 0.43, 0.4]], mortar: [0.3, 0.3, 0.3], brick: [0.6, 0.3, 0.5, 2] }],
  'Floor Timber': ['brick', { c: [[0.6, 0.44, 0.29], [0.52, 0.37, 0.23]], mortar: [0.25, 0.18, 0.12], brick: [1.2, 0.19, 0.5, 2], grain: 1 }],
  'Subway Tile': ['brick', { c: [[0.93, 0.93, 0.91], [0.9, 0.9, 0.88]], mortar: [0.75, 0.74, 0.72], brick: [0.15, 0.075, 0.5, 2], plane: 1 }],
};

// ---------- renderer / scene ----------
const stage = document.getElementById('stage');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch (err) {
  const el = document.getElementById('loadtxt');
  if (el) el.textContent = 'WebGL is not available in this browser — cannot render the 3D model.';
  console.error(err);
  throw err;
}
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

const CENTER = B(U.width / 2, U.depth / 2, 0);
const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.495;
controls.maxDistance = 50;

const e = new THREE.Euler(0.8726646, 0.1745329, -2.7925267, 'XYZ');
const d = new THREE.Vector3(0, 0, -1).applyEuler(e);
const sunDir = new THREE.Vector3(d.x, d.z, -d.y).normalize();
const sun = new THREE.DirectionalLight(0xfff3e2, 3.2);
sun.position.copy(CENTER).addScaledVector(sunDir, -25);
sun.target.position.copy(CENTER);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const ext = Math.max(U.width, U.depth) * 0.7;
Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: 80 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight(0xdbe6ff, 0xb9ab95, 0.9));

const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.18 }));
ground.rotation.x = -Math.PI / 2;
ground.position.set(CENTER.x, -0.052, CENTER.z);
ground.receiveShadow = true;
scene.add(ground);

// ---------- build shell ----------
const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ed, roughness: 0.9, metalness: 0 });
// Hammer on the plan: the wall can be removed. A warm tint, still plaster.
const wallMatHack = new THREE.MeshStandardMaterial({ color: 0xecd3b4, roughness: 0.88, metalness: 0 });
const floorDry = new THREE.MeshStandardMaterial({ color: 0xd4c8b0, roughness: 0.85 });
const floorWet = new THREE.MeshStandardMaterial({ color: 0xb8b9b8, roughness: 0.5 });
const floorOut = new THREE.MeshStandardMaterial({ color: 0x8a8680, roughness: 0.9 });
patch(floorDry, ...PATCHES['Floor Timber']);
patch(floorWet, ...PATCHES['Floor Wet Tile']);
patch(floorOut, ...PATCHES['Floor Outdoor']);

const wallGroup = new THREE.Group();
const glassGroup = new THREE.Group();
const doorGroup = new THREE.Group();
scene.add(wallGroup, glassGroup, doorGroup);
const matLeaf = new THREE.MeshStandardMaterial({ color: 0xd4c4ae, roughness: 0.7 });
const matHandle = new THREE.MeshStandardMaterial({ color: 0x2c2e32, roughness: 0.35, metalness: 0.65 });
const matEntry = new THREE.MeshStandardMaterial({ color: 0xb4532a, roughness: 0.58 });
const doorPivots = [];
// Full ceiling is the default. walls=low (or walls=cut) drops to cutH.
// walls=full is accepted and stays at the ceiling.
let wallsLow = U.cutH != null && (params.get('walls') === 'low' || params.get('walls') === 'cut');
let doorsShown = params.get('doors') !== '0';
let doorsOpen = params.get('doors') !== 'closed';
doorGroup.visible = doorsShown;

function emptyGroup(g) {
  for (const child of [...g.children]) {
    child.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    g.remove(child);
  }
}
function ceilingNow() {
  return wallsLow && U.cutH != null ? U.cutH : U.wallH;
}
function addWallSeg(x0, y0, x1, y1, h, t = U.wallT, yBase = 0, hackable = false) {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
  if (len < 0.02 || h < 0.02) return;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, h, t), hackable ? wallMatHack : wallMat);
  mesh.position.set((x0 + x1) / 2, yBase + h / 2, -(y0 + y1) / 2);
  mesh.rotation.y = -Math.atan2(dy, dx);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  wallGroup.add(mesh);
}

const glassMat = new THREE.MeshStandardMaterial({
  color: 0xb7d4e4, transparent: true, opacity: 0.32, roughness: 0.08, metalness: 0, depthWrite: false,
});
function addGlass(x0, y0, x1, y1, sill, head) {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
  if (len < 0.05 || head - sill < 0.05) return;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, head - sill, 0.02), glassMat);
  mesh.position.set((x0 + x1) / 2, (sill + head) / 2, -(y0 + y1) / 2);
  mesh.rotation.y = -Math.atan2(dy, dx);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  glassGroup.add(mesh);
}
function floorMatFor(name) {
  const out = /balcony|a\/?c|ledge/i.test(name);
  const wet = /bath|kitchen|yard|foyer/i.test(name);
  return out ? floorOut : wet ? floorWet : floorDry;
}
function addFloor(box, name) {
  const [x0, y0, x1, y1] = box;
  if (x1 - x0 < 0.05 || y1 - y0 < 0.05) return;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, y1 - y0), floorMatFor(name));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set((x0 + x1) / 2, 0.001, -(y0 + y1) / 2);
  floor.receiveShadow = true;
  scene.add(floor);
}
function addHeader(x0, y0, x1, y1, ceiling) {
  const head = U.windowHead ?? 2.1;
  if (ceiling <= head + 0.02) return;
  addWallSeg(x0, y0, x1, y1, ceiling - head, U.wallT, head);
}
function addDoorLeaf(d, ceiling, withLintel) {
  const w = d.w;
  const doorH = U.doorH ?? 2;
  // Flush with the cut. A taller leaf reads as floating above the dollhouse walls.
  const leafH = Math.min(doorH, ceiling);
  const theta = Math.atan2(d.dy, d.dx);
  // 65° rather than Ayanna's interior 80°: from the dollhouse camera an 80° leaf is edge-on.
  const swing = (d.swing || 1) * THREE.MathUtils.degToRad(65);
  const pivot = new THREE.Group();
  pivot.position.set(d.x, 0, -d.y);
  const leaf = new THREE.Mesh(new THREE.BoxGeometry(w, leafH, 0.04), d.kind === 'entry' ? matEntry : matLeaf);
  leaf.position.set(w / 2, leafH / 2, 0);
  leaf.castShadow = true;
  leaf.receiveShadow = true;
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.025, Math.min(0.14, leafH * 0.18), 0.025), matHandle);
  handle.position.set(Math.max(0.08, w - 0.07), leafH * 0.52, 0.028);
  handle.castShadow = true;
  pivot.add(leaf, handle);
  pivot.userData.closed = theta;
  pivot.userData.open = theta + swing;
  pivot.rotation.y = doorsOpen ? pivot.userData.open : pivot.userData.closed;
  doorGroup.add(pivot);
  doorPivots.push(pivot);
  if (withLintel && ceiling > doorH + 0.02) {
    addWallSeg(d.x, d.y, d.x + d.dx * w, d.y + d.dy * w, ceiling - doorH, U.wallT, doorH);
  }
}
let shellBuilt = false;
function buildShell() {
  const ceiling = ceilingNow();
  emptyGroup(wallGroup);
  emptyGroup(glassGroup);
  emptyGroup(doorGroup);
  doorPivots.length = 0;
  const W = U.width, D = U.depth;
  if (unitUsesRuns(U)) {
    const graph = buildWallGraph(U, { ceiling, doorH: U.doorH, windowHead: U.windowHead });
    if (graph.issues.length) console.warn(graph.issues.join('\n'));
    for (const seg of graph.segments) addWallSeg(seg.x0, seg.y0, seg.x1, seg.y1, seg.h, seg.t, seg.yBase || 0, !!seg.hackable);
    for (const g of graph.glass) addGlass(g.x0, g.y0, g.x1, g.y1, g.sill, g.head);
    for (const d of graph.leaves) addDoorLeaf(d, ceiling, false);
  } else {
    // Rectangular outer shell unless the unit supplies its own footprint.
    if (!U.explicitWalls) {
      addWallSeg(0, 0, W, 0, ceiling);
      addWallSeg(0, D, W, D, ceiling);
      addWallSeg(0, 0, 0, D, ceiling);
      addWallSeg(W, 0, W, D, ceiling);
    }
    for (const seg of U.walls || []) {
      const explicit = seg[4];
      const h = explicit != null ? Math.min(explicit, ceiling) : ceiling;
      addWallSeg(seg[0], seg[1], seg[2], seg[3], h);
      if (explicit != null) addHeader(seg[0], seg[1], seg[2], seg[3], ceiling);
    }
    for (const win of U.windows || []) {
      const [x0, y0, x1, y1, sill] = win;
      const h0 = sill != null ? sill : 0.12;
      const head = Math.min(U.windowHead ?? ceiling, ceiling);
      addGlass(x0, y0, x1, y1, h0, head);
      if (sill == null) addHeader(x0, y0, x1, y1, ceiling);
    }
    for (const d of U.doors || []) addDoorLeaf(d, ceiling, true);
  }
  if (shellBuilt) return;
  shellBuilt = true;
  const floorRects = U.floors || U.rooms.map((r) => ({ box: r.box, name: r.name }));
  for (const r of floorRects) addFloor(r.box, r.name || '');
}
buildShell();

// ---------- procedural furniture (Ayanna style, no matching asset) ----------
function makeKitchenCabinet(p) {
  const g = new THREE.Group();
  const carcass = new THREE.MeshStandardMaterial({ color: 0xe8e6e0, roughness: 0.7 });
  const sage = new THREE.MeshStandardMaterial({ color: 0x6b7a5e, roughness: 0.65 }); // Kitchen Sage-ish
  const quartz = new THREE.MeshStandardMaterial({ color: 0xeeeeea, roughness: 0.35, metalness: 0.05 });
  patch(quartz, ...PATCHES['Quartz']);
  const body = new THREE.Mesh(new THREE.BoxGeometry(p.w, 0.9, p.d), carcass);
  body.position.y = 0.45;
  const top = new THREE.Mesh(new THREE.BoxGeometry(p.w + 0.02, 0.04, p.d + 0.02), quartz);
  top.position.y = 0.92;
  const front = new THREE.Mesh(new THREE.BoxGeometry(p.w - 0.04, 0.7, 0.02), sage);
  front.position.set(0, 0.45, p.d / 2 - 0.01);
  g.add(body, top, front);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  placeGroup(g, p.x, p.y, p.rot || 0);
  scene.add(g);
}
function makeKitchenIsland(p) {
  makeKitchenCabinet({ ...p, kind: 'kitchen_cabinet' });
}
function makeOttoman(p) {
  const g = new THREE.Group();
  const boucle = new THREE.MeshStandardMaterial({ color: 0xc9c2b4, roughness: 0.9 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5a3d24, roughness: 0.7 });
  patch(wood, ...WOOD([0.34, 0.21, 0.1], [0.5, 0.33, 0.18]));
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.28, 0.55), boucle);
  seat.position.y = 0.28;
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.14, 8), wood);
  for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
    const l = leg.clone();
    l.position.set(x, 0.07, z);
    g.add(l);
  }
  g.add(seat);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  placeGroup(g, p.x, p.y, p.rot || 0);
  scene.add(g);
}
function placeGroup(g, x, y, rot) {
  g.position.set(x, 0, -y);
  g.rotation.y = -rot * Math.PI / 2;
}

for (const p of U.procedural || []) {
  if (p.skip) continue;
  if (p.kind === 'kitchen_cabinet') makeKitchenCabinet(p);
  else if (p.kind === 'kitchen_island') makeKitchenIsland(p);
  else if (p.kind === 'ottoman') makeOttoman(p);
}

// ---------- furniture load ----------
const templates = {};
function centreOnFootprint(node) {
  const fp = new THREE.Box3();
  node.traverse((o) => {
    if (o.isMesh && !/_(Leaves|Stems)$/.test(o.name)) fp.expandByObject(o);
  });
  if (fp.isEmpty()) fp.setFromObject(node);
  const cx = (fp.min.x + fp.max.x) / 2, cz = (fp.min.z + fp.max.z) / 2;
  node.position.x -= cx;
  node.position.z -= cz;
  return { hx: (fp.max.x - fp.min.x) / 2, hz: (fp.max.z - fp.min.z) / 2 };
}
function applyPatches(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    let transparent = false;
    for (const m of mats) {
      const p = PATCHES[m.name];
      if (p && !m.userData.patched) { patch(m, p[0], p[1]); m.userData.patched = true; }
      if (m.transparent || m.transmission > 0) transparent = true;
      if (m.name === 'Glass') { m.depthWrite = false; }
    }
    // Clone, so the shared Black Metal / Brushed Steel materials on other pieces stay as authored.
    if (/Shower_Glass$/.test(o.name)) {
      const m = o.material.clone();
      m.transmission = 0; m.transparent = true; m.opacity = 0.28; m.roughness = 0.04;
      m.metalness = 0; m.color.set(0xe4f1f6); m.depthWrite = false; m.name = 'Shower Glass Clear';
      o.material = m;
    }
    if (/Shower_(Profile|RainHead)$/.test(o.name)) {
      const m = o.material.clone();
      m.color.set(0x8d9399); m.metalness = 0.72; m.roughness = 0.32; m.name = 'Shower Frame';
      o.material = m;
    }
    if (o.name === 'Fridge_Body' || o.name === 'Fridge_Doors') {
      const m = o.material.clone();
      m.color.set(o.name === 'Fridge_Doors' ? 0xd7dde4 : 0xb4bcc4);
      m.metalness = 0.94; m.roughness = o.name === 'Fridge_Doors' ? 0.16 : 0.28;
      o.material = m;
    }
    if (o.name === 'Fridge_Handles') {
      const m = o.material.clone();
      m.color.set(0x141618); m.metalness = 0.88; m.roughness = 0.22;
      o.material = m;
    }
    o.castShadow = !transparent;
    o.receiveShadow = true;
  });
}
function spawn(name, x, y, rot = 0, sx = 1, sz = 1) {
  const tpl = templates[name];
  if (!tpl) { console.warn('Missing furniture:', name); return; }
  const pivot = new THREE.Group();
  const clone = tpl.node.clone(true);
  // Scale a wrapper. The template centres itself with a translation; scaling
  // that same object multiplies the offset. Kitchen_Run's mesh sits 6.55 m
  // off the node origin, so sx 0.32 used to walk it several metres off the pivot.
  if (sx !== 1 || sz !== 1) {
    const scaled = new THREE.Group();
    scaled.scale.set(sx, 1, sz);
    scaled.add(clone);
    pivot.add(scaled);
  } else {
    pivot.add(clone);
  }
  pivot.position.set(x, 0, -y);
  pivot.rotation.y = -rot * Math.PI / 2;
  scene.add(pivot);
}

function onFurniture(gltf) {
  const root = gltf.scene;
  applyPatches(root);
  // Detach each root piece as a template (already at world origin relative to Ayanna scene —
  // we re-centre on footprint so pivot sits at floor centre)
  const kids = [...root.children];
  for (const node of kids) {
    root.remove(node);
    centreOnFootprint(node);
    templates[node.name] = { node, name: node.name };
  }
  for (const row of U.furniture || []) {
    const [name, x, y, rot = 0, sx = 1, sz = 1] = row;
    spawn(name, x, y, rot, sx, sz);
  }
  document.getElementById('loader').hidden = true;
}

const loadtxt = document.getElementById('loadtxt');
const loaderEl = document.getElementById('loader');
function furnitureFailed(err) {
  console.error(err);
  if (loadtxt) loadtxt.textContent = 'Furniture failed to load. Walls still shown — refresh to retry.';
  // Keep the banner visible briefly so the failure is obvious, then clear it
  setTimeout(() => { if (loaderEl) loaderEl.hidden = true; }, 2500);
}
// Resolve furniture relative to the site root; also try a path relative to this page as fallback
// Prefer site-root absolute path; fall back to a path relative to this HTML page
const furnitureUrls = [
  '/shared/furniture.txt',
  new URL('../../shared/furniture.txt', location.href).pathname,
];
function loadFurniture(urls) {
  const url = urls[0];
  if (!url) { furnitureFailed(new Error('no furniture url')); return; }
  fetch(url)
    .then((r) => { if (!r.ok) throw new Error(`${r.status} ${url}`); return r.text(); })
    .then((b64) => {
      const bin = atob(b64.trim());
      const buf = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      new GLTFLoader().parse(buf.buffer, '', onFurniture, furnitureFailed);
    })
    .catch((e) => {
      console.warn(e);
      if (urls.length > 1) loadFurniture(urls.slice(1));
      else furnitureFailed(e);
    });
}
loadFurniture(furnitureUrls);
// Safety: never leave the loader up forever (e.g. hung network)
setTimeout(() => {
  if (loaderEl && !loaderEl.hidden && loadtxt?.textContent?.includes('Loading')) {
    furnitureFailed(new Error('furniture load timed out'));
  }
}, 20000);
// ---------- labels / views / UI ----------
const labelsEl = document.getElementById('labels');
const labelNodes = U.rooms.map((r) => {
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
      L.el.style.left = `${(tmp.x * .5 + .5) * w}px`;
      L.el.style.top = `${(-tmp.y * .5 + .5) * h}px`;
    }
  }
}

const VIEWS = U.views.map((v) => ({
  ...v,
  pos: B(v.pos[0], v.pos[1], v.pos[2]),
  tgt: B(v.tgt[0], v.tgt[1], v.tgt[2] || 0),
}));

let anim = null, interior = false, showLabels = true, currentView = VIEWS[0];
function vfovFrom(v) {
  if (v.hfov) {
    const vf = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(v.hfov) / 2) / camera.aspect);
    return Math.min(THREE.MathUtils.radToDeg(vf), 95);
  }
  return camera.aspect < 0.8 ? v.fov * 1.5 : v.fov;
}
function flyTo(pos, tgt, fov, instant = false) {
  if (instant || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    camera.position.copy(pos); controls.target.copy(tgt); camera.fov = fov;
    camera.updateProjectionMatrix(); controls.update(); return;
  }
  anim = { t0: performance.now(), dur: 1100, p0: camera.position.clone(), t0v: controls.target.clone(), f0: camera.fov, p1: pos.clone(), t1: tgt.clone(), f1: fov };
}
function stepAnim(now) {
  if (!anim) return;
  let k = Math.min(1, (now - anim.t0) / anim.dur);
  const s = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  camera.position.lerpVectors(anim.p0, anim.p1, s);
  controls.target.lerpVectors(anim.t0v, anim.t1, s);
  camera.fov = anim.f0 + (anim.f1 - anim.f0) * s;
  camera.updateProjectionMatrix();
  if (k >= 1) anim = null;
}
controls.addEventListener('start', () => { anim = null; setActive(null); });

const viewsEl = document.getElementById('views');
const chipEls = {};
function setActive(id) { for (const k in chipEls) chipEls[k].setAttribute('aria-pressed', String(k === id)); }
function syncLabels() { labelsEl.classList.toggle('off', !showLabels || interior); }
function goView(v, instant) {
  currentView = v; setActive(v.id); interior = !!v.hfov; syncLabels();
  controls.maxPolarAngle = v.hfov ? Math.PI * 0.95 : Math.PI * 0.495;
  flyTo(v.pos, v.tgt, vfovFrom(v), instant);
}
for (const v of VIEWS) {
  const b = document.createElement('button');
  b.className = 'chip'; b.textContent = v.name; b.setAttribute('aria-pressed', 'false');
  b.onclick = () => goView(v);
  chipEls[v.id] = b; viewsEl.appendChild(b);
}

function roomMetrics(r) {
  const parts = (U.floors || []).filter((f) => f.name === r.name);
  if (parts.length > 1) {
    const area = parts.reduce((s, f) => {
      const [x0, y0, x1, y1] = f.box;
      return s + Math.max(0, x1 - x0) * Math.max(0, y1 - y0);
    }, 0);
    return { label: `${area.toFixed(1)} m²` };
  }
  const box = parts.length === 1 ? parts[0].box : r.box;
  const [x0, y0, x1, y1] = box;
  const w = x1 - x0, h = y1 - y0;
  return { label: `${w.toFixed(1)} × ${h.toFixed(1)} m · ${(w * h).toFixed(1)} m²`, w, h };
}
const roomsEl = document.getElementById('rooms');
for (const r of U.rooms) {
  const [x0, y0, x1, y1] = r.box;
  const w = x1 - x0, h = y1 - y0;
  const metrics = roomMetrics(r);
  const li = document.createElement('li');
  const b = document.createElement('button');
  b.innerHTML = `<span>${r.name}</span><span class="dim">${metrics.label}</span>`;
  b.onclick = () => {
    const m = Math.max(w, h);
    const tgt = B(r.c[0], r.c[1], 0.3);
    const pos = B(r.c[0] - m * 0.15, r.c[1] - (m * 0.9 + 2.2), m * 1.2 + 3.2);
    controls.maxPolarAngle = Math.PI * 0.495; setActive(null); interior = false; syncLabels();
    flyTo(pos, tgt, camera.aspect < 0.8 ? 60 : 45);
  };
  li.appendChild(b); roomsEl.appendChild(li);
}

document.getElementById('showLabels')?.addEventListener('change', (ev) => { showLabels = ev.target.checked; syncLabels(); });
const showDoorsEl = document.getElementById('showDoors');
const openDoorsEl = document.getElementById('openDoors');
const cutawayEl = document.getElementById('lowWalls') || document.getElementById('cutaway');
const hasDoors = unitUsesRuns(U)
  ? (U.walls || []).some((w) => (w.openings || []).some((o) => o.type === 'door'))
  : (U.doors || []).length > 0;
if (showDoorsEl) {
  if (!hasDoors) showDoorsEl.closest('label').hidden = true;
  showDoorsEl.checked = doorsShown;
  showDoorsEl.addEventListener('change', () => {
    doorsShown = showDoorsEl.checked;
    doorGroup.visible = doorsShown;
  });
}
if (openDoorsEl) {
  if (!hasDoors) openDoorsEl.closest('label').hidden = true;
  openDoorsEl.checked = doorsOpen;
  openDoorsEl.addEventListener('change', () => { doorsOpen = openDoorsEl.checked; });
}
if (cutawayEl) {
  if (U.cutH == null) cutawayEl.closest('label').hidden = true;
  cutawayEl.checked = wallsLow;
  cutawayEl.addEventListener('change', () => {
    wallsLow = cutawayEl.checked;
    buildShell();
  });
}
const hackNote = document.getElementById('hackNote');
if (hackNote) {
  const hack = unitUsesRuns(U) && (U.walls || []).some((w) => w.hackable);
  hackNote.hidden = !hack;
}
const panel = document.getElementById('panel');
const collapseBtn = document.getElementById('collapse');
collapseBtn?.addEventListener('click', () => {
  const c = panel.classList.toggle('collapsed');
  collapseBtn.textContent = c ? 'Show' : 'Hide';
  collapseBtn.setAttribute('aria-expanded', String(!c));
  resize();
});

function panelDocked() {
  return matchMedia('(max-width: 640px), (max-height: 620px)').matches;
}
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  const panelOpen = !document.documentElement.classList.contains('noui') && !panel.classList.contains('collapsed');
  const s = w > 640 && panelOpen && !panelDocked() ? Math.min(165, w * 0.15) : 0;
  camera.aspect = (w + 2 * s) / h;
  if (s) camera.setViewOffset(w + 2 * s, h, 0, 0, w, h); else camera.clearViewOffset();
  if (!anim && currentView && chipEls[currentView.id]?.getAttribute('aria-pressed') === 'true') camera.fov = vfovFrom(currentView);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();
const startView = VIEWS.find((v) => v.id === params.get('view')) || VIEWS[0];
goView(startView, true);
const camSpec = params.get('cam');
if (camSpec) {
  const n = camSpec.split(',').map(Number);
  if (n.length >= 6 && n.every((v) => Number.isFinite(v))) {
    interior = false;
    syncLabels();
    setActive(null);
    camera.position.copy(B(n[0], n[1], n[2]));
    controls.target.copy(B(n[3], n[4], n[5]));
    if (n[6]) camera.fov = n[6];
    camera.updateProjectionMatrix();
    controls.update();
  }
}

// embed mode
const root = document.documentElement;
if (root.classList.contains('embed')) {
  const gate = document.getElementById('gate'), fsBtn = document.getElementById('fsBtn');
  if (gate && matchMedia('(pointer:coarse)').matches) gate.querySelector('span').textContent = 'Tap to explore in 3D';
  gate?.addEventListener('click', () => root.classList.remove('locked'));
  new IntersectionObserver(([en]) => {
    if (!en.isIntersecting && !document.fullscreenElement) root.classList.add('locked');
  }).observe(stage);
  if (params.get('panel') !== 'open') collapseBtn?.click();
  fsBtn?.addEventListener('click', () => {
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (document.fullscreenEnabled) { root.classList.remove('locked'); root.requestFullscreen(); return; }
    const u = new URL(location.href); u.searchParams.delete('embed');
    window.open(u.href, '_blank', 'noopener');
  });
}

let doorClock = performance.now();
renderer.setAnimationLoop((now) => {
  const dt = Math.min(0.05, (now - doorClock) / 1000);
  doorClock = now;
  for (const pivot of doorPivots) {
    const target = doorsOpen ? pivot.userData.open : pivot.userData.closed;
    pivot.rotation.y = THREE.MathUtils.damp(pivot.rotation.y, target, 8, dt);
  }
  stepAnim(now);
  controls.update();
  renderer.render(scene, camera);
  placeLabels();
});
