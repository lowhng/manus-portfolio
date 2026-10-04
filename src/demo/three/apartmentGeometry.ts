import type { ApartmentData } from './types';
import raw from './apartmentGeometry.json';

/** LiDAR-derived apartment geometry. Privacy: no unit/street names, no m² shown in UI. */
export const APARTMENT = raw as ApartmentData;

export const CX = 7.5;
export const CZ = 3.7;
export const CEILING_H = APARTMENT.H;

/** Rooms used as portfolio sections (privacy-scrubbed display names). */
export const STORY_ROOMS = [
  { id: 'hallway', geometryName: 'Hallway', label: 'Hallway' },
  { id: 'bathroom', geometryName: 'Bathroom', label: 'Bathroom' },
  { id: 'bedroom1', geometryName: 'Bedroom 1', label: 'Bedroom 1' },
  { id: 'bedroom2', geometryName: 'Bedroom 2', label: 'Bedroom 2' },
  { id: 'study', geometryName: 'Study', label: 'Study' },
  { id: 'living', geometryName: 'Living / Dining', label: 'Living / Dining' },
  { id: 'kitchen', geometryName: 'Kitchen', label: 'Kitchen' },
  { id: 'storage', geometryName: 'Storage', label: 'Storage' },
  { id: 'contact', geometryName: 'Hallway', label: 'Front door', isExit: true },
] as const;

export type StoryRoomId = (typeof STORY_ROOMS)[number]["id"];

export function getRoomByGeometryName(name: string) {
  return APARTMENT.rooms.find((r) => r.name === name);
}
