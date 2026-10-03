export type Vec2 = [number, number];

export type RoomKind = "room" | "wet" | "hall" | "store";

export type DoorKind = "room" | "store" | "entry";

export interface RoomPoly {
  name: string;
  poly: Vec2[];
  kind: RoomKind;
  label: Vec2 | null;
  area: number;
}

export interface DoorSpec {
  h: Vec2;
  e: Vec2;
  into: Vec2;
  kind: DoorKind;
}

export interface ApartmentData {
  H: number;
  door_h: number;
  sill: number;
  head: number;
  bar_h: number;
  walls: [Vec2, Vec2][];
  openings: [Vec2, Vec2][];
  bars: [Vec2, Vec2][];
  windows: [Vec2, Vec2, number, number, string][];
  slides: [Vec2, Vec2, number][];
  doors: DoorSpec[];
  rooms: RoomPoly[];
}
