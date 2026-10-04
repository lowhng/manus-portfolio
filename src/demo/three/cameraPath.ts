import * as THREE from "three";
import { CX, CZ } from "./apartmentGeometry";
import type { StoryRoomId } from "./apartmentGeometry";

export type CameraKeyframe = {
  stopId: string;
  sectionId: StoryRoomId | null;
  position: THREE.Vector3;
  target: THREE.Vector3;
  wallHeight: number;
  fov: number;
};

/** Floorplan opener → entry → a clockwise room tour → entry/exit. */
export const CAMERA_PATH: CameraKeyframe[] = [
  {
    stopId: "overview",
    sectionId: null,
    position: new THREE.Vector3(CX, 27, CZ + 0.01),
    target: new THREE.Vector3(CX, 0, CZ),
    wallHeight: 0.35,
    fov: 39,
  },
  {
    stopId: "entry-arrival",
    sectionId: "hallway",
    position: new THREE.Vector3(1.2, 2.8, 0.7),
    target: new THREE.Vector3(6.8, 0.75, 0.8),
    wallHeight: 2.5,
    fov: 48,
  },
  {
    stopId: "bathroom",
    sectionId: "bathroom",
    position: new THREE.Vector3(5.7, 5.8, 0.3),
    target: new THREE.Vector3(1.35, 0.45, 2.8),
    wallHeight: 1.05,
    fov: 45,
  },
  {
    stopId: "bedroom-1",
    sectionId: "bedroom1",
    position: new THREE.Vector3(6.2, 6.5, 2.2),
    target: new THREE.Vector3(1.85, 0.45, 5.65),
    wallHeight: 1.05,
    fov: 45,
  },
  {
    stopId: "bedroom-2",
    sectionId: "bedroom2",
    position: new THREE.Vector3(10.2, 6.5, 2.5),
    target: new THREE.Vector3(6.5, 0.45, 5.5),
    wallHeight: 1.05,
    fov: 45,
  },
  {
    stopId: "study",
    sectionId: "study",
    position: new THREE.Vector3(12.2, 5.8, 8.8),
    target: new THREE.Vector3(9.6, 0.5, 6.25),
    wallHeight: 1.1,
    fov: 44,
  },
  {
    stopId: "living-dining",
    sectionId: "living",
    position: new THREE.Vector3(18, 6.5, 3.65),
    target: new THREE.Vector3(13.0, 0.45, 3.6),
    wallHeight: 1.1,
    fov: 48,
  },
  {
    stopId: "kitchen",
    sectionId: "kitchen",
    position: new THREE.Vector3(13.4, 5.8, 1.2),
    target: new THREE.Vector3(9.6, 0.5, 3.5),
    wallHeight: 1.05,
    fov: 44,
  },
  {
    stopId: "storage",
    sectionId: "storage",
    position: new THREE.Vector3(10.5, 5.5, 0.5),
    target: new THREE.Vector3(7.4, 0.35, 3.1),
    wallHeight: 0.95,
    fov: 43,
  },
  {
    stopId: "entry-departure",
    sectionId: "contact",
    position: new THREE.Vector3(1.2, 2.8, 0.7),
    target: new THREE.Vector3(6.8, 0.75, 0.8),
    wallHeight: 2.5,
    fov: 48,
  },
];

/** Content order. Camera stops are looked up by section rather than array offset. */
export const SECTION_ORDER: StoryRoomId[] = [
  "hallway",
  "bathroom",
  "bedroom1",
  "bedroom2",
  "study",
  "living",
  "kitchen",
  "storage",
  "contact",
];

export function keyframeForSection(id: StoryRoomId): CameraKeyframe {
  return CAMERA_PATH.find((keyframe) => keyframe.sectionId === id) ?? CAMERA_PATH[0];
}

export function interpolatePath(
  progress: number,
): {
  position: THREE.Vector3;
  target: THREE.Vector3;
  wallHeight: number;
  fov: number;
} {
  const path = CAMERA_PATH;
  const clamped = Math.min(1, Math.max(0, progress));
  const scaled = clamped * (path.length - 1);
  const i = Math.floor(scaled);
  const t = scaled - i;
  const a = path[i];
  const b = path[Math.min(i + 1, path.length - 1)];
  const ease = t * t * (3 - 2 * t);
  return {
    position: a.position.clone().lerp(b.position, ease),
    target: a.target.clone().lerp(b.target, ease),
    wallHeight: THREE.MathUtils.lerp(a.wallHeight, b.wallHeight, ease),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, ease),
  };
}

/** Map scroll through section elements to 0–1 path progress. */
export function scrollProgressFromSections(
  sections: { id: StoryRoomId; element: HTMLElement }[],
  scrollY: number,
  viewportH: number,
): number {
  if (sections.length === 0) return 0;
  const anchors = sections.map(({ id, element }, index) => ({
    scrollY:
      index === 0
        ? Math.max(viewportH * 0.55, element.offsetTop)
        : element.offsetTop + element.offsetHeight * 0.35 - viewportH * 0.35,
    pathIndex: CAMERA_PATH.indexOf(keyframeForSection(id)),
  }));
  if (scrollY <= anchors[0].scrollY) {
    const end = anchors[0].scrollY;
    const t = end <= 0 ? 1 : scrollY / end;
    const firstStop = anchors[0].pathIndex / (CAMERA_PATH.length - 1);
    return Math.min(1, Math.max(0, t)) * firstStop;
  }
  for (let i = 0; i < anchors.length - 1; i++) {
    if (scrollY <= anchors[i + 1].scrollY) {
      const local =
        (scrollY - anchors[i].scrollY) /
        Math.max(1, anchors[i + 1].scrollY - anchors[i].scrollY);
      const pathStart = anchors[i].pathIndex / (CAMERA_PATH.length - 1);
      const pathEnd = anchors[i + 1].pathIndex / (CAMERA_PATH.length - 1);
      return pathStart + local * (pathEnd - pathStart);
    }
  }
  return 1;
}
