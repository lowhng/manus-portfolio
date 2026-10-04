export type AyannaRoomId =
  | "foyer"
  | "bathroom"
  | "master"
  | "bedroom1"
  | "bedroom2"
  | "living"
  | "kitchen"
  | "yard"
  | "contact";

export type AyannaRoom = {
  id: AyannaRoomId;
  label: string;
  shortLabel: string;
  box: [x0: number, y0: number, x1: number, y1: number];
  center: [number, number];
  isExit?: boolean;
};

export const AYANNA_ROOMS: AyannaRoom[] = [
  { id: "foyer", label: "Foyer", shortLabel: "Foyer", box: [1.92, 0, 3.29, 2.74], center: [2.6, 1.45] },
  { id: "bathroom", label: "Master bathroom", shortLabel: "Bath", box: [1.65, 7.06, 3.29, 9.8], center: [2.47, 8.43] },
  { id: "master", label: "Master bedroom", shortLabel: "Master", box: [0, 2.74, 3.29, 7.84], center: [1.65, 5.25] },
  { id: "bedroom1", label: "Bedroom 1", shortLabel: "Bed 1", box: [6.99, 5.83, 10, 9.8], center: [8.5, 7.8] },
  { id: "bedroom2", label: "Bedroom 2", shortLabel: "Bed 2", box: [8.51, 2.17, 11.5, 5.83], center: [10, 4] },
  { id: "living", label: "Living and dining", shortLabel: "Living", box: [3.29, 4.84, 9.07, 9.8], center: [5.55, 7.25] },
  { id: "kitchen", label: "Kitchen", shortLabel: "Kitchen", box: [3.29, 0, 6.99, 4.84], center: [5.15, 2.5] },
  { id: "yard", label: "Balcony and yard", shortLabel: "Outdoor", box: [2.36, 9.8, 8.69, 11.43], center: [5.5, 10.62] },
  { id: "contact", label: "Front door", shortLabel: "Exit", box: [1.92, 0, 3.29, 0.92], center: [2.6, 0.46], isExit: true },
];

export const SECTION_ORDER = AYANNA_ROOMS.map((room) => room.id);

export function roomById(id: AyannaRoomId) {
  return AYANNA_ROOMS.find((room) => room.id === id)!;
}
