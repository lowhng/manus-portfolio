import * as THREE from "three";
import { APARTMENT, CX, CZ } from "./apartmentGeometry";
import type { DoorSpec, Vec2 } from "./types";

type WallSpec = [
  a: Vec2,
  b: Vec2,
  y0: number,
  y1: number,
  mat: THREE.Material,
  thick: number,
  extend: number,
  tag: string,
];

const T = 0.1;

function M(color: number, opts: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...opts });
}

export type ApartmentScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  setWallHeight: (cut: number) => void;
  setCamera: (
    position: THREE.Vector3,
    target: THREE.Vector3,
    immediate?: boolean,
  ) => void;
  getCamera: () => THREE.PerspectiveCamera;
  resize: (width: number, height: number) => void;
  render: () => void;
  dispose: () => void;
  addProp: (mesh: THREE.Object3D) => void;
};

export function createApartmentScene(
  canvas: HTMLCanvasElement,
): ApartmentScene {
  const D = APARTMENT;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xe6e9eb, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8378, 1.4));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(CX - 6, 14, CZ + 8);
  sun.target.position.set(CX, 0, CZ);
  scene.add(sun, sun.target);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {
    left: -11,
    right: 11,
    top: 8,
    bottom: -8,
    near: 1,
    far: 40,
  });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;

  const matWall = M(0xf7f5f0);
  const matLeaf = M(0xe9e3d6);
  const matEntry = M(0xb4532a);
  const matTimber = M(0xd9c7a6);
  const matBench = M(0xcfd2d0, { roughness: 0.5 });
  const matFrost = M(0xdfe6e8, { transparent: true, opacity: 0.8, roughness: 0.6 });
  const matMirror = M(0xc9d3d8, { metalness: 0.6, roughness: 0.15 });
  const matGlass = M(0x9cc7dc, { transparent: true, opacity: 0.35, roughness: 0.1 });

  const specs: WallSpec[] = [];
  const wallGroup = new THREE.Group();
  scene.add(wallGroup);
  const propGroup = new THREE.Group();
  scene.add(propGroup);

  function box(
    a: Vec2,
    b: Vec2,
    y0: number,
    y1: number,
    mat: THREE.Material,
    thick = T,
    extend = 0,
    tag = "",
  ) {
    specs.push([a, b, y0, y1, mat, thick, extend, tag]);
  }

  function mk(
    a: Vec2,
    b: Vec2,
    y0: number,
    y1: number,
    mat: THREE.Material,
    thick: number,
    extend: number,
  ) {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const L = Math.hypot(dx, dz);
    if (L < 1e-3 || y1 <= y0 + 1e-3) return;
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(L + extend, y1 - y0, thick),
      mat,
    );
    m.position.set((a[0] + b[0]) / 2, (y0 + y1) / 2, (a[1] + b[1]) / 2);
    m.rotation.y = -Math.atan2(dz, dx);
    m.castShadow = m.receiveShadow = true;
    wallGroup.add(m);
  }

  function build(cut: number) {
    wallGroup.clear();
    for (const [a, b, y0, y1, mat, thick, extend] of specs) {
      mk(a, b, y0, Math.min(y1, cut), mat, thick, extend);
    }
  }

  D.walls.forEach(([a, b]) => box(a, b, 0, D.H, matWall, T, T));
  D.openings.forEach(([a, b]) => box(a, b, D.door_h, D.H, matWall, T, T));
  D.windows.forEach(([a, b, s, hd, t]) => {
    box(a, b, 0, s, matWall, T, T);
    box(a, b, hd, D.H, matWall, T, T);
    box(a, b, s, hd, t === "frosted" ? matFrost : matGlass, 0.02);
  });
  D.slides.forEach(([a, b, hd]) => {
    box(a, b, hd, D.H, matWall, T, T);
    box(a, b, 0, hd, matMirror, 0.04, 0, "door");
  });
  D.bars.forEach(([a, b]) => {
    box(a, b, 0, D.bar_h, matWall, T, T);
    const off = 0.2;
    box(
      [a[0] + off, a[1] - 0.05],
      [b[0] + off, b[1] + 0.05],
      D.bar_h,
      D.bar_h + 0.04,
      matBench,
      0.42,
    );
  });
  D.doors.forEach((d: DoorSpec) => {
    const { h, e, into } = d;
    box(h, e, D.door_h, D.H, matWall, T, T);
    let dx = e[0] - h[0];
    let dz = e[1] - h[1];
    const L = Math.hypot(dx, dz);
    dx /= L;
    dz /= L;
    let nx = -dz;
    let nz = dx;
    if ((into[0] - h[0]) * nx + (into[1] - h[1]) * nz < 0) {
      nx = -nx;
      nz = -nz;
    }
    const th = THREE.MathUtils.degToRad(80);
    const ox = Math.cos(th) * dx + Math.sin(th) * nx;
    const oz = Math.cos(th) * dz + Math.sin(th) * nz;
    box(
      h,
      [h[0] + ox * (L - 0.02), h[1] + oz * (L - 0.02)],
      0,
      D.door_h - 0.02,
      d.kind === "entry" ? matEntry : matLeaf,
      0.04,
      0,
      "door",
    );
  });

  const fcol: Record<string, number> = {
    room: 0xd8d2c6,
    wet: 0xcdd8de,
    hall: 0xe5e0d6,
    store: 0xb9b2a5,
  };
  D.rooms.forEach((r) => {
    const s = new THREE.Shape(r.poly.map((p) => new THREE.Vector2(p[0], -p[1])));
    const m = new THREE.Mesh(
      new THREE.ShapeGeometry(s),
      new THREE.MeshStandardMaterial({ color: fcol[r.kind], roughness: 1 }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.001;
    m.receiveShadow = true;
    scene.add(m);
  });

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(16.6, 0.08, 8.6),
    new THREE.MeshStandardMaterial({ color: 0x9a958c, roughness: 1 }),
  );
  base.position.set(CX + 0.25, -0.041, CZ + 0.1);
  base.receiveShadow = true;
  scene.add(base);

  // Soft desk block in Study (prop)
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.72, 0.55),
    matTimber,
  );
  desk.position.set(9.4, 0.36, 6.35);
  desk.castShadow = true;
  propGroup.add(desk);
  const laptop = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.02, 0.22),
    M(0x2a2e32, { roughness: 0.4, metalness: 0.3 }),
  );
  laptop.position.set(9.4, 0.74, 6.35);
  propGroup.add(laptop);

  // Small bowl / cake stand hint in Kitchen
  const cake = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.08, 16),
    M(0xf2d6c9, { roughness: 0.7 }),
  );
  cake.position.set(9.6, 1.04, 3.2);
  propGroup.add(cake);

  let curPos = new THREE.Vector3(CX, 22, CZ + 0.01);
  let curTarget = new THREE.Vector3(CX, 0, CZ);
  let goalPos = curPos.clone();
  let goalTarget = curTarget.clone();
  camera.position.copy(curPos);
  camera.lookAt(curTarget);

  function setWallHeight(cut: number) {
    build(Math.max(0.02, Math.min(D.H, cut)));
  }

  function setCamera(
    position: THREE.Vector3,
    target: THREE.Vector3,
    immediate = false,
  ) {
    goalPos.copy(position);
    goalTarget.copy(target);
    if (immediate) {
      curPos.copy(position);
      curTarget.copy(target);
      camera.position.copy(curPos);
      camera.lookAt(curTarget);
    }
  }

  function resize(width: number, height: number) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render() {
    curPos.lerp(goalPos, 0.08);
    curTarget.lerp(goalTarget, 0.08);
    camera.position.copy(curPos);
    camera.lookAt(curTarget);
    renderer.render(scene, camera);
  }

  function dispose() {
    renderer.dispose();
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mat = obj.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
  }

  setWallHeight(0.35);

  return {
    scene,
    camera,
    renderer,
    setWallHeight,
    setCamera,
    getCamera: () => camera,
    resize,
    render,
    dispose,
    addProp: (mesh) => propGroup.add(mesh),
  };
}
