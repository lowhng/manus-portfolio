import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type PatchSettings = {
  c: number[][];
  stops?: number[];
  map?: number[];
  scale?: number;
  warp?: number;
  oct?: number;
  brick?: number[];
  mortar?: number[];
  plane?: number;
  grain?: number;
};

type PatchSpec = ["noise" | "brick", PatchSettings];

const GLSL_COMMON = `
varying vec3 vWP; varying vec3 vWN;
uniform vec3 uC0,uC1,uC2,uC3; uniform vec4 uStops; uniform vec3 uMap; uniform float uScale,uWarp; uniform int uOct,uNStops;
uniform vec4 uBrick; uniform vec3 uMortar; uniform int uPlane; uniform float uGrain;
float h13(vec3 p){p=fract(p*0.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(h13(i),h13(i+vec3(1,0,0)),f.x),mix(h13(i+vec3(0,1,0)),h13(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h13(i+vec3(0,0,1)),h13(i+vec3(1,0,1)),f.x),mix(h13(i+vec3(0,1,1)),h13(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.,n=0.;for(int i=0;i<8;i++){if(i>=uOct)break;s+=a*vn(p);n+=a;p*=2.02;a*=.5;}return s/n;}
float bnoise(vec3 p){if(uWarp>0.){p+=uWarp*(vec3(vn(p+3.1),vn(p+7.7),vn(p+13.3))-.5);}return fbm(p);}
vec3 ramp(float t){
  if(uNStops==2)return mix(uC0,uC1,smoothstep(uStops.x,uStops.y,t));
  if(t<uStops.y)return mix(uC0,uC1,smoothstep(uStops.x,uStops.y,t));
  if(t<uStops.z)return mix(uC1,uC2,smoothstep(uStops.y,uStops.z,t));
  if(uNStops==3)return uC2;
  return mix(uC2,uC3,smoothstep(uStops.z,uStops.w,t));
}
vec3 toB(vec3 w){return vec3(w.x,-w.z,w.y);}
`;

const NOISE_FRAGMENT = `
#include <color_fragment>
{vec3 p=toB(vWP)*uMap*uScale;diffuseColor.rgb=ramp(bnoise(p));}
`;

const BRICK_FRAGMENT = `
#include <color_fragment>
{
  vec2 uv;
  if(uPlane==0){uv=vec2(vWP.x,-vWP.z);}
  else{vec3 n=abs(vWN);uv=n.x>n.z?vec2(-vWP.z,vWP.y):vec2(vWP.x,vWP.y);}
  float w=uBrick.x,hh=uBrick.y,off=uBrick.z,freq=uBrick.w;
  float row=floor(uv.y/hh),o=(mod(row,freq)<.5)?off*w:0.,col=floor((uv.x+o)/w);
  float fx=fract((uv.x+o)/w)*w,fy=fract(uv.y/hh)*hh;
  float dx=min(fx,w-fx),dy=min(fy,hh-fy);
  float aw=max(fwidth(uv.x),1e-4),ah=max(fwidth(uv.y),1e-4);
  float m=max(1.-smoothstep(.002,.002+aw,dx),1.-smoothstep(.002,.002+ah,dy));
  vec3 c=mix(uC0,uC1,h13(vec3(col,row,7.)));
  if(uGrain>0.){float g=fbm(vec3(uv.x*3.,uv.y*75.,col*1.7));c*=mix(.78,1.,smoothstep(.3,.7,g));}
  diffuseColor.rgb=mix(c,uMortar,m*.85);
}
`;

const wood = (dark: number[], light: number[]): PatchSpec => [
  "noise",
  { c: [dark, light], stops: [0.3, 0.7], map: [1, 12, 12], scale: 2.5, warp: 1.5, oct: 5 },
];
const art = (c: number[][]): PatchSpec => [
  "noise",
  { c, stops: [0, 0.42, 0.52, 0.62], scale: 2.5, warp: 3.5, oct: 1 },
];

const PATCHES: Record<string, PatchSpec> = {
  Oak: wood([0.48, 0.33, 0.2], [0.66, 0.49, 0.32]),
  Teak: wood([0.34, 0.21, 0.1], [0.5, 0.33, 0.18]),
  Walnut: wood([0.18, 0.11, 0.06], [0.33, 0.21, 0.13]),
  "Art Sage": art([[0.9, 0.87, 0.8], [0.44, 0.5, 0.38], [0.8, 0.66, 0.46], [0.25, 0.28, 0.24]]),
  "Art Earth": art([[0.88, 0.84, 0.76], [0.55, 0.4, 0.28], [0.85, 0.75, 0.6], [0.3, 0.22, 0.16]]),
  "Art Warm": art([[0.92, 0.88, 0.8], [0.7, 0.36, 0.2], [0.44, 0.5, 0.38], [0.15, 0.14, 0.13]]),
  "Rug Bedroom": ["noise", { c: [[0.6, 0.56, 0.48], [0.7, 0.66, 0.58]], scale: 6, oct: 3 }],
  "Rug Living": ["noise", { c: [[0.42, 0.37, 0.31], [0.52, 0.47, 0.4]], scale: 6, oct: 3 }],
  Quartz: ["noise", { c: [[0.93, 0.92, 0.9], [0.62, 0.61, 0.6], [0.93, 0.92, 0.9]], stops: [0.46, 0.5, 0.54, 1], scale: 1.8, warp: 5, oct: 6 }],
  "Floor Tile": ["brick", { c: [[0.76, 0.73, 0.68], [0.73, 0.7, 0.65]], mortar: [0.55, 0.53, 0.5], brick: [1.2, 0.6, 0, 1] }],
  "Floor Wet Tile": ["brick", { c: [[0.55, 0.56, 0.55], [0.52, 0.53, 0.52]], mortar: [0.35, 0.35, 0.35], brick: [0.3, 0.3, 0, 1] }],
  "Floor Outdoor": ["brick", { c: [[0.48, 0.46, 0.43], [0.45, 0.43, 0.4]], mortar: [0.3, 0.3, 0.3], brick: [0.6, 0.3, 0.5, 2] }],
  "Floor Timber": ["brick", { c: [[0.6, 0.44, 0.29], [0.52, 0.37, 0.23]], mortar: [0.25, 0.18, 0.12], brick: [1.2, 0.19, 0.5, 2], grain: 1 }],
  "Subway Tile": ["brick", { c: [[0.93, 0.93, 0.91], [0.9, 0.9, 0.88]], mortar: [0.75, 0.74, 0.72], brick: [0.15, 0.075, 0.5, 2], plane: 1 }],
};

function vec3(values = [1, 1, 1]) {
  return new THREE.Vector3(values[0], values[1], values[2]);
}

function patchMaterial(material: THREE.Material, [kind, settings]: PatchSpec) {
  if (!(material instanceof THREE.MeshStandardMaterial)) return;
  const colors = settings.c;
  const uniforms = {
    uC0: { value: vec3(colors[0]) },
    uC1: { value: vec3(colors[1] ?? colors[0]) },
    uC2: { value: vec3(colors[2] ?? colors[1] ?? colors[0]) },
    uC3: { value: vec3(colors[3] ?? colors[2] ?? colors[0]) },
    uStops: { value: new THREE.Vector4(...(settings.stops ?? [0, 1, 1, 1]) as [number, number, number, number]) },
    uNStops: { value: colors.length },
    uMap: { value: vec3(settings.map) },
    uScale: { value: settings.scale ?? 1 },
    uWarp: { value: settings.warp ?? 0 },
    uOct: { value: settings.oct ?? 3 },
    uBrick: { value: new THREE.Vector4(...(settings.brick ?? [1, 1, 0, 1]) as [number, number, number, number]) },
    uMortar: { value: vec3(settings.mortar ?? [0, 0, 0]) },
    uPlane: { value: settings.plane ?? 0 },
    uGrain: { value: settings.grain ?? 0 },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWP; varying vec3 vWN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvWP=(modelMatrix*vec4(transformed,1.0)).xyz;vWN=normalize(mat3(modelMatrix)*objectNormal);");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${GLSL_COMMON}`)
      .replace("#include <color_fragment>", kind === "noise" ? NOISE_FRAGMENT : BRICK_FRAGMENT);
  };
  material.customProgramCacheKey = () => `${kind}-${material.name}`;
  material.color.set(0xffffff);
  material.needsUpdate = true;
}

export type AyannaScene = {
  resize: (width: number, height: number) => void;
  setCamera: (position: THREE.Vector3, target: THREE.Vector3, fov: number, immediate?: boolean) => void;
  render: () => void;
  dispose: () => void;
};

export async function createAyannaScene(canvas: HTMLCanvasElement): Promise<AyannaScene> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xe8e6df, 1);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200);
  const currentPosition = new THREE.Vector3(0.6, 15.5, 10.5);
  const currentTarget = new THREE.Vector3(5.8, 0, -5);
  const goalPosition = currentPosition.clone();
  const goalTarget = currentTarget.clone();
  let currentFov = 40;
  let goalFov = 40;
  camera.position.copy(currentPosition);
  camera.lookAt(currentTarget);

  const center = new THREE.Vector3(5.8, 0, -5.8);
  const euler = new THREE.Euler(0.8726646, 0.1745329, -2.7925267, "XYZ");
  const blenderDirection = new THREE.Vector3(0, 0, -1).applyEuler(euler);
  const sunDirection = new THREE.Vector3(
    blenderDirection.x,
    blenderDirection.z,
    -blenderDirection.y,
  ).normalize();
  const sun = new THREE.DirectionalLight(0xfff3e2, 3.2);
  sun.position.copy(center).addScaledVector(sunDirection, -25);
  sun.target.position.copy(center);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 60 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target, new THREE.HemisphereLight(0xdbe6ff, 0xb9ab95, 0.9));

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.ShadowMaterial({ opacity: 0.18 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(center.x, -0.052, center.z);
  ground.receiveShadow = true;
  scene.add(ground);

  const response = await fetch("/ayanna/ayanna_model.txt");
  if (!response.ok) throw new Error(`Ayanna model request failed (${response.status})`);
  const encoded = (await response.text()).trim();
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const gltf = await new GLTFLoader().parseAsync(bytes.buffer, "");
  gltf.scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    let transparent = false;
    for (const material of materials) {
      const patch = PATCHES[material.name];
      if (patch) patchMaterial(material, patch);
      if (material.transparent) transparent = true;
      if (material instanceof THREE.MeshPhysicalMaterial && material.transmission > 0) transparent = true;
      if (material.name === "Curtain Sheer") {
        material.transparent = true;
        material.opacity = 0.55;
        material.side = THREE.DoubleSide;
        if (material instanceof THREE.MeshPhysicalMaterial) material.transmission = 0;
      }
      if (material.name === "Shower Glass") {
        material.transparent = true;
        material.opacity = 0.12;
        if (material instanceof THREE.MeshStandardMaterial) material.roughness = 0.05;
        if (material instanceof THREE.MeshPhysicalMaterial) material.transmission = 0;
      }
      if (material.name === "Glass") material.depthWrite = false;
    }
    object.castShadow = !transparent;
    object.receiveShadow = true;
  });
  scene.add(gltf.scene);
  await renderer.compileAsync(gltf.scene, camera, scene);

  return {
    resize(width, height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },
    setCamera(position, target, fov, immediate = false) {
      goalPosition.copy(position);
      goalTarget.copy(target);
      goalFov = fov;
      if (immediate) {
        currentPosition.copy(position);
        currentTarget.copy(target);
        currentFov = fov;
      }
    },
    render() {
      currentPosition.lerp(goalPosition, 0.075);
      currentTarget.lerp(goalTarget, 0.075);
      currentFov = THREE.MathUtils.lerp(currentFov, goalFov, 0.075);
      camera.position.copy(currentPosition);
      camera.lookAt(currentTarget);
      if (Math.abs(camera.fov - currentFov) > 0.01) {
        camera.fov = currentFov;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
    },
    dispose() {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
        objectMaterials.forEach((material) => materials.add(material));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
