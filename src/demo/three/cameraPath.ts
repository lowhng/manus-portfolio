import * as THREE from "three";
import { CX, CZ, getRoomByGeometryName } from "./apartmentGeometry";
import type { StoryRoomId } from "./apartmentGeometry";

export type CameraKeyframe = {
  id: StoryRoomId;
  position: THREE.Vector3;
  target: THREE.Vector3;
  wallHeight: number;
};

function roomFocus(geometryName: string, height = 3.2, pull = 2.4): CameraKeyframe["position"] {
  const room = getRoomByGeometryName(geometryName);
  if (!room?.label) return new THREE.Vector3(CX - 4, height, CZ + 6);
  const [x, z] = room.label;
  return new THREE.Vector3(x - pull * 0.4, height, z + pull);
}

function roomTarget(geometryName: string): THREE.Vector3 {
  const room = getRoomByGeometryName(geometryName);
  if (!room?.label) return new THREE.Vector3(CX, 0.4, CZ);
  return new THREE.Vector3(room.label[0], 0.5, room.label[1]);
}

/** Top-down opener → hallway → rooms → exit at front door. */
export const CAMERA_PATH: CameraKeyframe[] = [
  {
    id: "hallway",
    position: new THREE.Vector3(CX, 18, CZ + 0.01),
    target: new THREE.Vector3(CX, 0, CZ),
    wallHeight: 0.35,
  },
  {
    id: "hallway",
    position: new THREE.Vector3(7.6, 3.4, 5.2),
    target: new THREE.Vector3(8.8, 0.8, 1.2),
    wallHeight: 2.5,
  },
  {
    id: "study",
    position: roomFocus("Study", 2.6, 2.0),
    target: roomTarget("Study"),
    wallHeight: 2.5,
  },
  {
    id: "living",
    position: roomFocus("Living / Dining", 3.0, 3.2),
    target: roomTarget("Living / Dining"),
    wallHeight: 2.5,
  },
  {
    id: "bedroom2",
    position: roomFocus("Bedroom 2", 2.8, 2.4),
    target: roomTarget("Bedroom 2"),
    wallHeight: 2.5,
  },
  {
    id: "kitchen",
    position: roomFocus("Kitchen", 2.6, 2.0),
    target: roomTarget("Kitchen"),
    wallHeight: 2.5,
  },
  {
    id: "storage",
    position: roomFocus("Storage", 2.4, 1.6),
    target: roomTarget("Storage"),
    wallHeight: 2.5,
  },
  {
    id: "contact",
    // Front door / entry looking outward
    position: new THREE.Vector3(7.2, 1.8, 1.4),
    target: new THREE.Vector3(6.2, 1.0, 0.6),
    wallHeight: 2.5,
  },
];

/** Unique section order for scroll (one keyframe per section after opener). */
export const SECTION_ORDER: StoryRoomId[] = [
  "hallway",
  "study",
  "living",
  "bedroom2",
  "kitchen",
  "storage",
  "contact",
];

export function keyframeForSection(id: StoryRoomId): CameraKeyframe {
  // Prefer the later (non-topdown) hallway frame
  const matches = CAMERA_PATH.filter((k) => k.id === id);
  return matches[matches.length - 1] ?? CAMERA_PATH[0];
}

export function interpolatePath(
  progress: number,
): { position: THREE.Vector3; target: THREE.Vector3; wallHeight: number } {
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
  };
}

/** Map scroll through section elements to 0–1 path progress. */
export function scrollProgressFromSections(
  sectionEls: HTMLElement[],
  scrollY: number,
  viewportH: number,
): number {
  if (sectionEls.length === 0) return 0;
  const centers = sectionEls.map(
    (el) => el.offsetTop + el.offsetHeight * 0.35,
  );
  const focus = scrollY + viewportH * 0.35;
  if (focus <= centers[0]) {
    // Opener: first screen scrolls walls up before leaving hallway
    const start = 0;
    const end = centers[0];
    const t = end <= start ? 1 : (focus - start) / (end - start);
    return Math.min(1, Math.max(0, t)) * (1 / (CAMERA_PATH.length - 1));
  }
  for (let i = 0; i < centers.length - 1; i++) {
    if (focus <= centers[i + 1]) {
      const local =
        (focus - centers[i]) / Math.max(1, centers[i + 1] - centers[i]);
      // Map section i → path index i+1 (skip pure top-down as section 0 end)
      const pathStart = (i + 1) / (CAMERA_PATH.length - 1);
      const pathEnd = (i + 2) / (CAMERA_PATH.length - 1);
      return pathStart + local * (pathEnd - pathStart);
    }
  }
  return 1;
}
