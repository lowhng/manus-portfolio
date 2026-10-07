import * as THREE from "three";
import type { AyannaRoomId } from "./rooms";

export type CameraKeyframe = {
  stopId: string;
  sectionId: AyannaRoomId | null;
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
};

const B = (x: number, y: number, z = 0) => new THREE.Vector3(x, z, -y);

export const CAMERA_PATH: CameraKeyframe[] = [
  {
    stopId: "overview",
    sectionId: null,
    position: B(0.6, -10.5, 15.5),
    target: B(5.8, 5, 0),
    fov: 40,
  },
  {
    stopId: "arrival",
    sectionId: "foyer",
    position: new THREE.Vector3(2.6, 1.55, 1.45),
    target: new THREE.Vector3(2.6, 0.9, -1.45),
    fov: 55,
  },
  {
    stopId: "master-bath",
    sectionId: "bathroom",
    position: new THREE.Vector3(2.45, 1.65, -11.4),
    target: new THREE.Vector3(2.45, 0.9, -8.45),
    fov: 57,
  },
  {
    stopId: "master-bedroom",
    sectionId: "master",
    position: new THREE.Vector3(2.3, 1.55, -3),
    target: new THREE.Vector3(0.58, 0.83, -5.35),
    fov: 76,
  },
  {
    stopId: "bedroom-1",
    sectionId: "bedroom1",
    position: new THREE.Vector3(7.35, 1.55, -6.35),
    target: new THREE.Vector3(9.94, 0.95, -7.74),
    fov: 76,
  },
  {
    stopId: "bedroom-2",
    sectionId: "bedroom2",
    position: new THREE.Vector3(11.35, 1.6, -3.9),
    target: new THREE.Vector3(9.4, 0.95, -4.15),
    fov: 68,
  },
  {
    stopId: "living",
    sectionId: "living",
    position: new THREE.Vector3(5.55, 1.45, -5.35),
    target: new THREE.Vector3(4.97, 1.14, -8.28),
    fov: 76,
  },
  {
    stopId: "kitchen",
    sectionId: "kitchen",
    position: new THREE.Vector3(5.75, 1.6, -6.5),
    target: new THREE.Vector3(5.82, 1.24, -3.52),
    fov: 76,
  },
  {
    stopId: "outdoor",
    sectionId: "yard",
    position: new THREE.Vector3(5.5, 3.8, -15),
    target: new THREE.Vector3(5.5, 0.35, -10.4),
    fov: 50,
  },
  {
    stopId: "departure",
    sectionId: "contact",
    position: new THREE.Vector3(2.6, 1.55, -1.6),
    target: new THREE.Vector3(2.6, 0.9, 1.1),
    fov: 55,
  },
];

export function keyframeForSection(id: AyannaRoomId) {
  return CAMERA_PATH.find((frame) => frame.sectionId === id) ?? CAMERA_PATH[0];
}

export function interpolatePath(progress: number) {
  const clamped = THREE.MathUtils.clamp(progress, 0, 1);
  const scaled = clamped * (CAMERA_PATH.length - 1);
  const index = Math.floor(scaled);
  const amount = scaled - index;
  const ease = amount * amount * (3 - 2 * amount);
  const from = CAMERA_PATH[index];
  const to = CAMERA_PATH[Math.min(index + 1, CAMERA_PATH.length - 1)];
  return {
    position: from.position.clone().lerp(to.position, ease),
    target: from.target.clone().lerp(to.target, ease),
    fov: THREE.MathUtils.lerp(from.fov, to.fov, ease),
  };
}

export function scrollProgressFromSections(
  sections: { id: AyannaRoomId; element: HTMLElement }[],
  scrollY: number,
  viewportHeight: number,
) {
  if (!sections.length) return 0;
  const anchors = sections.map(({ id, element }, index) => ({
    scrollY:
      index === 0
        ? Math.max(viewportHeight * 0.55, element.offsetTop)
        : element.offsetTop + element.offsetHeight * 0.35 - viewportHeight * 0.35,
    pathIndex: CAMERA_PATH.indexOf(keyframeForSection(id)),
  }));
  if (scrollY <= anchors[0].scrollY) {
    const amount = scrollY / Math.max(1, anchors[0].scrollY);
    return THREE.MathUtils.clamp(amount, 0, 1) *
      (anchors[0].pathIndex / (CAMERA_PATH.length - 1));
  }
  for (let index = 0; index < anchors.length - 1; index += 1) {
    if (scrollY <= anchors[index + 1].scrollY) {
      const local =
        (scrollY - anchors[index].scrollY) /
        Math.max(1, anchors[index + 1].scrollY - anchors[index].scrollY);
      return (
        anchors[index].pathIndex / (CAMERA_PATH.length - 1) +
        local *
          ((anchors[index + 1].pathIndex - anchors[index].pathIndex) /
            (CAMERA_PATH.length - 1))
      );
    }
  }
  return 1;
}
