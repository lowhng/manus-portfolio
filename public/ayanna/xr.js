import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

// Locomotion is a rig that parents the camera only while an immersive session is
// presenting. WebXR writes the headset pose into the camera's local matrix;
// moving the rig moves the player. Unparenting on exit leaves desktop orbit alone.
// Controllers live on the same rig so they stay in the hands after a teleport.

const TURN = Math.PI / 4;
const UP = new THREE.Vector3(0, 1, 0);
const PICTURE_W = 1.1;
const PICTURE_H = PICTURE_W * 0.75;

const MENU_ITEMS = [
  { label: 'Living', action: 'view:living' },
  { label: 'Dining & kitchen', action: 'view:dining' },
  { label: 'Master bedroom', action: 'view:master' },
  { label: 'Bedroom 1', action: 'view:bed1' },
  { label: 'Overview', action: 'pic:overview' },
  { label: 'Plan', action: 'pic:plan' },
  { label: 'Exit VR', action: 'exit' },
];

export function setupXR({
  renderer,
  scene,
  camera,
  controls,
  views,
  rooms,
  getFloorMeshes,
  getModelRoot,
  hideForCapture,
  onSuspend,
  onResume,
}) {
  renderer.xr.enabled = true;

  const rig = new THREE.Group();
  rig.name = 'XRRig';

  const raycaster = new THREE.Raycaster();
  raycaster.far = 20;
  const head = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const aimMatrix = new THREE.Matrix4();

  let eyeOffset = 0;
  let attached = false;
  let snapshot = null;
  let busy = false;
  let supported = false;
  let modelReady = false;
  let poseTicks = 0;
  let livingView = null;

  const vrBtn = document.getElementById('vrBtn');
  if (vrBtn) vrBtn.addEventListener('click', () => { enter(); });

  function syncButton() {
    if (!vrBtn) return;
    vrBtn.hidden = !(supported && modelReady);
  }

  if (navigator.xr?.isSessionSupported) {
    navigator.xr.isSessionSupported('immersive-vr').then((ok) => {
      supported = !!ok;
      syncButton();
    }).catch(() => { supported = false; });
  }

  // ---------- capture of Overview and Plan (flat pictures, not viewpoints) ----------
  const labelGroup = new THREE.Group();
  labelGroup.name = 'XRCaptureLabels';
  labelGroup.visible = false;
  for (const room of rooms) {
    const sprite = makeRoomSprite(room.name);
    sprite.position.copy(room.position);
    labelGroup.add(sprite);
  }
  scene.add(labelGroup);

  const captureCam = new THREE.PerspectiveCamera(40, PICTURE_W / PICTURE_H, 0.05, 200);
  let overviewTarget = null;
  let planTarget = null;

  function ensureTargets() {
    if (overviewTarget) return;
    overviewTarget = makeTarget();
    planTarget = makeTarget();
    pictureMat.map = overviewTarget.texture;
  }

  function capturePictures() {
    ensureTargets();
    hideForCapture(true);
    labelGroup.visible = true;
    const prev = renderer.getRenderTarget();
    try {
      for (const view of views) {
        if (view.id !== 'overview' && view.id !== 'plan') continue;
        captureCam.fov = view.fov || 40;
        captureCam.aspect = PICTURE_W / PICTURE_H;
        captureCam.position.copy(view.pos);
        captureCam.up.set(0, 1, 0);
        captureCam.lookAt(view.tgt);
        captureCam.updateProjectionMatrix();
        captureCam.updateMatrixWorld(true);
        const target = view.id === 'overview' ? overviewTarget : planTarget;
        renderer.setRenderTarget(target);
        renderer.clear();
        renderer.render(scene, captureCam);
      }
    } finally {
      renderer.setRenderTarget(prev);
      labelGroup.visible = false;
      hideForCapture(false);
    }
  }

  // ---------- picture that pops out in front of the player ----------
  const pictureMat = new THREE.MeshBasicMaterial({ toneMapped: false });
  const picture = new THREE.Group();
  picture.name = 'XRPicture';
  picture.visible = false;
  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(PICTURE_W + 0.08, PICTURE_H + 0.08),
    new THREE.MeshBasicMaterial({ color: 0x2a2e26, toneMapped: false }),
  );
  frame.position.z = -0.008;
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(PICTURE_W, PICTURE_H), pictureMat);
  picture.add(frame, photo);
  scene.add(picture);

  let pictureId = null;
  let pictureClosing = false;
  let pop = null;

  function showPicture(id) {
    const target = id === 'plan' ? planTarget : overviewTarget;
    if (!target) return;
    pictureMat.map = target.texture;
    pictureMat.needsUpdate = true;
    pictureId = id;
    pictureClosing = false;
    picture.visible = true;
    picture.scale.setScalar(0.12);
    const end = new THREE.Vector3();
    placeInFront(picture, 1.4, -0.18, end);
    const start = end.clone().lerp(head, 0.5);
    picture.position.copy(start);
    pop = { fromScale: 0.12, toScale: 1, from: start, to: end, t0: performance.now(), dur: 420, hide: false };
    menu.visible = false;
  }

  function dismissPicture() {
    if (!picture.visible) { pictureId = null; return; }
    pictureClosing = true;
    pop = {
      fromScale: picture.scale.x,
      toScale: 0.08,
      from: picture.position.clone(),
      to: picture.position.clone().lerp(camera.getWorldPosition(head), 0.35),
      t0: performance.now(),
      dur: 220,
      hide: true,
    };
  }

  function togglePicture(id) {
    if (pictureId === id && picture.visible && !pictureClosing) dismissPicture();
    else showPicture(id);
  }

  function stepPop(now) {
    if (!pop) return;
    const k = Math.min(1, (now - pop.t0) / pop.dur);
    const s = 1 - (1 - k) ** 3;
    picture.scale.setScalar(pop.fromScale + (pop.toScale - pop.fromScale) * s);
    picture.position.lerpVectors(pop.from, pop.to, s);
    if (k < 1) return;
    pop = null;
    if (pictureClosing) {
      picture.visible = false;
      pictureId = null;
      pictureClosing = false;
    }
  }

  // ---------- in-headset menu ----------
  const menu = new THREE.Group();
  menu.name = 'XRMenu';
  menu.visible = false;
  const buttons = [];
  {
    const buttonH = 0.058;
    const gap = 0.012;
    const extra = 0.018;
    let span = 0.08;
    for (let i = 0; i < MENU_ITEMS.length; i++) {
      span += buttonH;
      if (i < MENU_ITEMS.length - 1) span += gap;
      if (MENU_ITEMS[i + 1] && (MENU_ITEMS[i + 1].action === 'pic:overview' || MENU_ITEMS[i + 1].action === 'exit')) span += extra;
    }
    const backing = new THREE.Mesh(
      new THREE.PlaneGeometry(0.52, span),
      new THREE.MeshBasicMaterial({ color: 0xf4f1ea, toneMapped: false }),
    );
    menu.add(backing);
    let y = span / 2 - 0.04 - buttonH / 2;
    for (let i = 0; i < MENU_ITEMS.length; i++) {
      const item = MENU_ITEMS[i];
      const normal = makeButtonTexture(item.label, false);
      const hot = makeButtonTexture(item.label, true);
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.44, buttonH),
        new THREE.MeshBasicMaterial({ map: normal, toneMapped: false }),
      );
      mesh.position.set(0, y, 0.012);
      mesh.userData.action = item.action;
      mesh.userData.textures = { normal, hot };
      menu.add(mesh);
      buttons.push(mesh);
      y -= buttonH + gap;
      const next = MENU_ITEMS[i + 1];
      if (next && (next.action === 'pic:overview' || next.action === 'exit')) y -= extra;
    }
  }
  scene.add(menu);

  function setHot(action) {
    for (const mesh of buttons) {
      const on = mesh.userData.action === action;
      const next = on ? mesh.userData.textures.hot : mesh.userData.textures.normal;
      if (mesh.material.map !== next) mesh.material.map = next;
    }
  }

  function toggleMenu() {
    if (!attached || fadeJob) return;
    menu.visible = !menu.visible;
    if (menu.visible) placeInFront(menu, 1.15, -0.02);
    setHot(null);
  }

  // ---------- teleport marker, fade, controllers ----------
  const marker = new THREE.Mesh(
    new THREE.RingGeometry(0.11, 0.18, 40).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x7d9a72, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }),
  );
  marker.name = 'XRTeleportMarker';
  marker.visible = false;
  marker.renderOrder = 5;
  scene.add(marker);

  const fade = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.BackSide, depthWrite: false, depthTest: false }),
  );
  fade.name = 'XRFade';
  fade.renderOrder = 999;
  fade.visible = false;
  fade.frustumCulled = false;

  let fadeJob = null;
  const factory = new XRControllerModelFactory();
  const controllers = [0, 1].map((index) => addController(index));

  function addController(index) {
    const controller = renderer.xr.getController(index);
    const line = makeRay();
    line.visible = false;
    controller.add(line);
    controller.userData.line = line;
    controller.addEventListener('connected', function onConnected() { this.userData.line.visible = true; });
    controller.addEventListener('disconnected', function onDisconnected() { this.userData.line.visible = false; });
    controller.userData.selecting = false;
    controller.userData.hit = null;
    controller.userData.menuAction = null;
    controller.userData.stickLatched = false;
    controller.userData.faceLatched = false;
    controller.addEventListener('selectstart', function onSelectStart() { this.userData.selecting = true; });
    controller.addEventListener('selectend', onSelectEnd);
    controller.addEventListener('squeezestart', () => toggleMenu());
    rig.add(controller);

    const grip = renderer.xr.getControllerGrip(index);
    grip.add(factory.createControllerModel(grip));
    rig.add(grip);
    return controller;
  }

  function onSelectEnd() {
    const was = this.userData.selecting;
    this.userData.selecting = false;
    this.userData.line.scale.z = 2.5;
    if (!was || !attached || fadeJob) return;
    rig.updateMatrixWorld(true);
    const menuHit = menuPointer(this);
    if (menuHit) {
      if (menuHit.action) runAction(menuHit.action);
      return;
    }
    const hit = floorHitFrom(this);
    if (hit) beginMove(hit, null);
  }

  function runAction(action) {
    if (action === 'exit') {
      const session = renderer.xr.getSession();
      if (session) session.end();
      return;
    }
    if (action.startsWith('pic:')) {
      togglePicture(action.slice(4));
      return;
    }
    if (action.startsWith('view:')) {
      const view = views.find((v) => v.id === action.slice(5));
      if (!view || view.hfov == null) return;
      beginMove({ x: view.pos.x, y: floorYAt(view.pos.x, view.pos.z), z: view.pos.z }, view.tgt);
      menu.visible = false;
    }
  }

  function beginMove(dest, lookTarget) {
    if (fadeJob) return;
    fadeJob = {
      phase: 'out',
      t0: performance.now(),
      dest: { x: dest.x, y: dest.y, z: dest.z },
      lookTarget: lookTarget ? lookTarget.clone() : null,
    };
    fade.visible = true;
  }

  function stepFade(now) {
    if (!fadeJob) {
      if (fade.material.opacity !== 0) fade.material.opacity = 0;
      fade.visible = false;
      return;
    }
    fade.visible = true;
    const k = (now - fadeJob.t0) / (fadeJob.phase === 'out' ? 160 : 240);
    if (fadeJob.phase === 'out') {
      fade.material.opacity = Math.min(1, k);
      if (k < 1) return;
      teleportTo(fadeJob.dest.x, fadeJob.dest.y, fadeJob.dest.z);
      if (fadeJob.lookTarget) faceToward(fadeJob.lookTarget);
      fadeJob.phase = 'in';
      fadeJob.t0 = now;
      return;
    }
    fade.material.opacity = Math.max(0, 1 - k);
    if (k >= 1) fadeJob = null;
  }

  // ---------- session lifecycle ----------
  renderer.xr.addEventListener('sessionstart', attach);
  renderer.xr.addEventListener('sessionend', detach);

  function attach() {
    if (attached) return;
    snapshot = onSuspend();
    controls.enabled = false;
    camera.position.set(0, 0, 0);
    camera.quaternion.identity();
    camera.scale.set(1, 1, 1);
    camera.updateMatrix();
    rig.add(camera);
    camera.add(fade);
    scene.add(rig);
    livingView = views.find((v) => v.id === 'living') || views.find((v) => v.hfov);
    const y = floorYAt(livingView.pos.x, livingView.pos.z);
    rig.position.set(livingView.pos.x, y + eyeOffset, livingView.pos.z);
    rig.rotation.set(0, 0, 0);
    rig.rotation.y = yawToward(livingView.pos.x, livingView.pos.z, livingView.tgt.x, livingView.tgt.z);
    rig.updateMatrixWorld(true);
    attached = true;
    poseTicks = 0;
    menu.visible = false;
    picture.visible = false;
    pictureId = null;
    marker.visible = false;
    fade.material.opacity = 1;
    fade.visible = true;
    fadeJob = { phase: 'in', t0: performance.now(), dest: null, lookTarget: null };
  }

  function detach() {
    if (!attached) return;
    attached = false;
    poseTicks = 0;
    camera.remove(fade);
    fade.material.opacity = 0;
    fade.visible = false;
    fadeJob = null;
    rig.remove(camera);
    scene.remove(rig);
    menu.visible = false;
    marker.visible = false;
    picture.visible = false;
    pictureId = null;
    pop = null;
    for (const controller of controllers) {
      controller.userData.selecting = false;
      controller.userData.hit = null;
      controller.userData.menuAction = null;
    }
    const saved = snapshot;
    snapshot = null;
    onResume(saved);
  }

  async function enter() {
    if (busy || renderer.xr.isPresenting || !modelReady) return;
    if (!getFloorMeshes().length) return;
    busy = true;
    try {
      capturePictures();
      const session = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor'],
      });
      const features = session.enabledFeatures;
      const floor = Array.isArray(features) ? features.includes('local-floor') : true;
      eyeOffset = floor ? 0 : 1.6;
      renderer.xr.setReferenceSpaceType(floor ? 'local-floor' : 'local');
      try {
        await renderer.xr.setSession(session);
      } catch (err) {
        try { session.end(); } catch { /* session may already be ending */ }
        throw err;
      }
    } catch (err) {
      // A cancelled headset prompt is expected; anything else is a failed start.
      if (!err || (err.name !== 'AbortError' && err.name !== 'NotAllowedError')) console.error(err);
    } finally {
      busy = false;
    }
  }

  function tick() {
    if (!renderer.xr.isPresenting || !attached) return;
    const now = performance.now();
    rig.updateMatrixWorld(true);
    // Tick 1 still has the pre-pose camera. Correct facing on tick 2, while the
    // opening fade is still dark, including when `local` keeps the head at the origin.
    poseTicks += 1;
    if (poseTicks === 2 && livingView) faceToward(livingView.tgt);
    pollGamepad();
    updateAim();
    stepFade(now);
    stepPop(now);
  }

  // ---------- aiming ----------
  function aim(controller) {
    aimMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(aimMatrix);
  }

  // A hit on the panel consumes the trigger. Only a button runs an action,
  // so a click on the padding does not fall through to a teleport.
  function menuPointer(controller) {
    if (!menu.visible) return null;
    aim(controller);
    const hits = raycaster.intersectObject(menu, true);
    if (!hits.length) return null;
    return { action: hits[0].object.userData.action || null, distance: hits[0].distance };
  }

  function floorHitFrom(controller) {
    const root = getModelRoot();
    const floors = getFloorMeshes();
    if (!root || !floors.length) return null;
    aim(controller);
    const hits = raycaster.intersectObject(root, true);
    if (!hits.length) return null;
    const hit = hits[0];
    if (!hit.object.userData.isFloor) return null;
    if (hit.distance < 0.35) return null;
    return { x: hit.point.x, y: hit.point.y, z: hit.point.z, distance: hit.distance };
  }

  function updateAim() {
    let markerHit = null;
    let hover = null;
    for (const controller of controllers) {
      const menuHit = menuPointer(controller);
      controller.userData.menuAction = menuHit ? menuHit.action : null;
      if (menuHit?.action && !hover) hover = menuHit.action;
      const selecting = controller.userData.selecting && !menuHit;
      const hit = selecting ? floorHitFrom(controller) : null;
      controller.userData.hit = hit;
      const line = controller.userData.line;
      if (menuHit) line.scale.z = menuHit.distance;
      else if (hit) {
        line.scale.z = hit.distance;
        markerHit = hit;
      } else line.scale.z = 2.5;
    }
    setHot(hover);
    if (markerHit && !fadeJob) {
      marker.position.set(markerHit.x, markerHit.y + 0.02, markerHit.z);
      marker.visible = true;
    } else {
      marker.visible = false;
    }
  }

  function pollGamepad() {
    const session = renderer.xr.getSession();
    if (!session) return;
    let index = 0;
    for (const source of session.inputSources) {
      const controller = controllers[index];
      index += 1;
      if (!controller) continue;
      if (fadeJob) {
        controller.userData.stickLatched = true;
        continue;
      }
      const gamepad = source.gamepad;
      if (!gamepad) continue;
      const x = stickX(gamepad);
      if (Math.abs(x) < 0.6) controller.userData.stickLatched = false;
      else if (!controller.userData.stickLatched) {
        controller.userData.stickLatched = true;
        snapTurn(x > 0 ? -TURN : TURN);
      }
      const buttonsGp = gamepad.buttons || [];
      const face = (buttonsGp[4] && buttonsGp[4].pressed) || (buttonsGp[5] && buttonsGp[5].pressed);
      if (!face) controller.userData.faceLatched = false;
      else if (!controller.userData.faceLatched) {
        controller.userData.faceLatched = true;
        toggleMenu();
      }
    }
  }

  function stickX(gamepad) {
    const axes = gamepad.axes;
    if (!axes || axes.length < 2) return 0;
    const primary = axes[0] || 0;
    const secondary = axes.length > 2 ? (axes[2] || 0) : 0;
    return Math.abs(secondary) > Math.abs(primary) ? secondary : primary;
  }

  // ---------- movement ----------
  function floorYAt(x, z) {
    const floors = getFloorMeshes();
    if (!floors.length) return 0;
    raycaster.set(new THREE.Vector3(x, 6, z), new THREE.Vector3(0, -1, 0));
    const hits = raycaster.intersectObjects(floors, false);
    return hits.length ? hits[0].point.y : 0;
  }

  function teleportTo(x, floorY, z) {
    camera.getWorldPosition(head);
    rig.position.x += x - head.x;
    rig.position.z += z - head.z;
    rig.position.y = floorY + eyeOffset;
    rig.updateMatrixWorld(true);
  }

  function snapTurn(angle) {
    if (!angle) return;
    camera.getWorldPosition(head);
    const offset = new THREE.Vector3().subVectors(rig.position, head);
    offset.applyAxisAngle(UP, angle);
    rig.position.copy(head).add(offset);
    rig.rotation.y += angle;
    rig.updateMatrixWorld(true);
  }

  function faceToward(target) {
    camera.getWorldPosition(head);
    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 1e-8) return;
    forward.normalize();
    desired.set(target.x - head.x, 0, target.z - head.z);
    if (desired.lengthSq() < 1e-6) return;
    desired.normalize();
    const dot = THREE.MathUtils.clamp(forward.dot(desired), -1, 1);
    const crossY = forward.z * desired.x - forward.x * desired.z;
    const angle = Math.atan2(crossY, dot);
    if (Math.abs(angle) > 0.01) snapTurn(angle);
  }

  function placeInFront(object, distance, yOffset, storeEnd) {
    camera.getWorldPosition(head);
    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 1e-6) forward.set(0, 0, -1);
    else forward.normalize();
    let dist = distance;
    const root = getModelRoot();
    if (root) {
      raycaster.set(head, forward);
      const hits = raycaster.intersectObject(root, true);
      if (hits.length && hits[0].distance < dist + 0.2) dist = Math.max(0.65, hits[0].distance - 0.28);
    }
    object.position.copy(head).addScaledVector(forward, dist);
    object.position.y = head.y + yOffset;
    object.lookAt(head.x, object.position.y, head.z);
    object.rotateY(Math.PI);
    if (storeEnd) storeEnd.copy(object.position);
    return dist;
  }

  function yawToward(x, z, tx, tz) {
    return Math.atan2(-(tx - x), -(tz - z));
  }

  return {
    tick,
    setModelReady() {
      modelReady = true;
      syncButton();
    },
  };
}

function makeTarget() {
  const target = new THREE.WebGLRenderTarget(1024, 768);
  target.texture.colorSpace = THREE.SRGBColorSpace;
  target.texture.minFilter = THREE.LinearFilter;
  target.texture.magFilter = THREE.LinearFilter;
  target.texture.generateMipmaps = false;
  return target;
}

function makeRay() {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1),
  ]);
  const material = new THREE.LineBasicMaterial({ color: 0xd7d4cb, transparent: true, opacity: 0.85 });
  const line = new THREE.Line(geometry, material);
  line.scale.z = 2.5;
  line.frustumCulled = false;
  return line;
}

function makeButtonTexture(label, hot) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const g = canvas.getContext('2d');
  g.clearRect(0, 0, 512, 96);
  g.fillStyle = hot ? '#5f6b55' : '#e7e4db';
  fillRoundRect(g, 6, 6, 500, 84, 18);
  g.fillStyle = hot ? '#fbfaf6' : '#23271f';
  g.font = '600 36px Manrope, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(label, 256, 48);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeRoomSprite(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 128;
  const g = canvas.getContext('2d');
  g.clearRect(0, 0, 640, 128);
  g.fillStyle = 'rgba(35,39,31,0.82)';
  fillRoundRect(g, 12, 28, 616, 72, 36);
  g.fillStyle = '#f7f5ef';
  g.font = '600 34px Manrope, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(name, 320, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  const width = Math.min(4.2, Math.max(1.6, name.length * 0.145));
  sprite.scale.set(width, width * 0.2, 1);
  return sprite;
}

function fillRoundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
  g.fill();
}
