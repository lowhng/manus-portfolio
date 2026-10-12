// Sunway Alishan Type B — 1496 sqft
// Scale: printed 15550 mm arrow is 1358 px,
//   s = 15.550 / 1358 m/px, used for both axes.
// Origin is the non-balcony end of that arrow. +x right, +y toward the balcony.
// Walls are centrelines of the filled strokes. A black dashed quarter-arc is a hinged door. Orange marks are shower screens, not doors.
// Other gaps on the outer face are windows; interior gaps without an arc stay openings.
// This plan has no pink hammer, so no wall is hackable.
// Variant Ba draws a window at the powder room. Built-up is 1,496 sqft.
// Width follows the 15550 mm arrow. The 19050 mm figure is the brochure overall
// and is longer than the wall box on this crop, so depth is the traced outer centrelines.
window.UNIT = {
  id: 'type-b',
  project: 'Sunway Alishan',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type B',
  beds: 4,
  baths: 3,
  sqft: 1496,
  sourceUrl: 'https://sunwayproperty.com/sunway-alishan/',
  width: 15.49,
  depth: 11.56,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.20,
  explicitWalls: true,
  // Balcony is at the top of the sheet, so world +y is decreasing image y.
  plan: {
    file: 'type-b-1496sf.png',
    ox: 1142,
    oy: 1338,
    mx: 15.550 / 1358,
    my: 15.550 / 1358,
  },
  rooms: [
    { name: 'Master Bedroom', c: [1.55, 5.80], box: [0.11, 2.94, 3.16, 9.45] },
    { name: 'Bedroom 3', c: [4.50, 5.70], box: [3.16, 4.74, 5.93, 9.45] },
    { name: 'Bedroom 4', c: [7.30, 7.70], box: [5.93, 6.08, 8.69, 9.45] },
    { name: 'Living', c: [10.80, 9.45], box: [8.69, 5.40, 12.50, 9.95] },
    { name: 'Dining', c: [9.70, 4.70], box: [9.30, 2.15, 12.55, 5.15] },
    { name: 'Pantry', c: [7.40, 3.20], box: [6.45, 2.15, 8.70, 5.20] },
    { name: 'Junior Bedroom', c: [14.05, 6.60], box: [12.65, 5.24, 15.49, 9.45] },
    { name: 'Junior Bath', c: [14.35, 3.60], box: [13.23, 2.02, 15.49, 5.24] },
    { name: 'Master Bath', c: [3.95, 3.20], box: [3.16, 1.67, 4.80, 4.74] },
    { name: 'Bath 3', c: [5.55, 3.40], box: [4.80, 2.02, 6.38, 4.74] },
    // Yard and Kitchen are one enclosed room on the sheet, with no dividing wall.
    { name: 'Kitchen', c: [5.80, 1.05], box: [3.20, 0.20, 8.70, 1.90] },
    { name: 'A/C', c: [2.73, 1.50], box: [2.31, 0.15, 3.10, 2.85] },
    { name: 'Foyer', c: [9.76, 0.70], box: [8.85, 0.09, 10.68, 2.02] },
    { name: 'Balcony', c: [10.67, 10.80], box: [8.69, 10.05, 12.65, 11.56] },
  ],
  floors: [
    { name: 'Master Bedroom', box: [0.20, 3.05, 3.05, 9.35] },
    { name: 'Bedroom 3', box: [3.25, 4.85, 5.85, 9.35] },
    { name: 'Bedroom 4', box: [6.05, 6.20, 8.55, 9.35] },
    { name: 'Living', box: [8.80, 5.50, 12.45, 9.90] },
    { name: 'Dining', box: [9.40, 2.20, 12.50, 5.10] },
    { name: 'Pantry', box: [6.50, 2.20, 8.80, 5.30] },
    { name: 'Junior Bedroom', box: [12.75, 5.35, 15.35, 9.35] },
    { name: 'Junior Bath', box: [13.35, 2.15, 15.35, 5.10] },
    { name: 'Master Bath', box: [3.25, 1.80, 4.70, 4.60] },
    { name: 'Bath 3', box: [4.90, 2.15, 6.25, 4.60] },
    { name: 'Kitchen', box: [3.30, 0.25, 8.70, 1.85] },
    { name: 'A/C', box: [2.40, 0.25, 3.05, 2.80] },
    { name: 'Foyer', box: [8.95, 0.20, 10.55, 1.15] },
    { name: 'Foyer', box: [8.95, 1.40, 10.55, 1.90] },
    { name: 'Balcony', box: [8.80, 10.15, 12.50, 11.45] },
  ],
  walls: [
    { x0: 2.31, y0: 0.09, x1: 8.85, y1: 0.09 },
    { x0: 8.85, y0: 1.28, x1: 10.68, y1: 1.28, openings: [{ at: 0.46, w: 1.05, type: 'door', hinge: 'start', swing: 1 }] },
    { x0: 3.16, y0: 1.67, x1: 4.80, y1: 1.67 },
    // The west gap is a sliding panel (blue bar and arrow). The hinged leaf is the door further east.
    { x0: 4.80, y0: 2.02, x1: 15.49, y1: 2.02, openings: [{ at: 2.45, w: 0.87, type: 'slider' }, { at: 4.15, w: 0.42, type: 'opening' }, { at: 4.62, w: 0.84, type: 'door', hinge: 'start', swing: 1 }, { at: 5.49, w: 0.30, type: 'opening' }] },
    { x0: 0.11, y0: 2.94, x1: 3.16, y1: 2.94 },
    { x0: 3.16, y0: 4.74, x1: 6.38, y1: 4.74, openings: [{ at: 2.34, w: 0.66, type: 'door', hinge: 'end', swing: 1 }] },
    { x0: 12.54, y0: 5.24, x1: 15.49, y1: 5.24, openings: [{ at: 0.25, w: 0.70, type: 'door', hinge: 'end', swing: 1 }, { at: 0.96, w: 0.94, type: 'door', hinge: 'start', swing: -1 }] },
    { x0: 4.17, y0: 6.08, x1: 8.69, y1: 6.08, openings: [{ at: 1.96, w: 0.78, type: 'door', hinge: 'start', swing: 1 }] },
    { x0: 0.11, y0: 9.45, x1: 8.69, y1: 9.45, openings: [{ at: 0.25, w: 2.50, type: 'window', sill: 0.9, head: 2.1 }, { at: 3.30, w: 2.20, type: 'window', sill: 0.9, head: 2.1 }, { at: 6.02, w: 2.20, type: 'window', sill: 0.9, head: 2.1 }] },
    { x0: 12.65, y0: 9.45, x1: 15.49, y1: 9.45, openings: [{ at: 0.25, w: 2.20, type: 'window', sill: 0.9, head: 2.1 }] },
    { x0: 8.69, y0: 10.05, x1: 12.65, y1: 10.05, openings: [{ at: 0.52, w: 2.94, type: 'slider' }] },
    { x0: 0.11, y0: 2.94, x1: 0.11, y1: 9.45 },
    { x0: 3.16, y0: 0.09, x1: 3.16, y1: 9.45, openings: [{ at: 0.96, w: 0.80, type: 'door', hinge: 'start', swing: 1 }, { at: 4.99, w: 0.79, type: 'door', hinge: 'start', swing: 1 }, { at: 6.14, w: 0.78, type: 'door', hinge: 'start', swing: -1 }] },
    { x0: 4.80, y0: 1.67, x1: 4.80, y1: 4.74 },
    { x0: 5.93, y0: 6.08, x1: 5.93, y1: 9.45 },
    { x0: 6.38, y0: 2.02, x1: 6.38, y1: 6.08 },
    { x0: 8.69, y0: 6.08, x1: 8.69, y1: 10.05 },
    { x0: 8.69, y0: 10.05, x1: 8.69, y1: 11.56, rail: 1.05 },
    { x0: 8.85, y0: 0.09, x1: 8.85, y1: 2.02 },
    { x0: 10.68, y0: 0.09, x1: 10.68, y1: 2.02 },
    { x0: 12.65, y0: 5.24, x1: 12.65, y1: 10.05, openings: [{ at: 0.27, w: 0.95, type: 'door', hinge: 'start', swing: -1 }] },
    { x0: 12.65, y0: 10.05, x1: 12.65, y1: 11.56, rail: 1.05 },
    { x0: 13.23, y0: 2.02, x1: 13.23, y1: 5.24 },
    { x0: 15.49, y0: 2.02, x1: 15.49, y1: 9.45 },
    { x0: 2.31, y0: 0.09, x1: 3.16, y1: 0.09 },
    // West wall of the A/C bay, between the setback and the yard door.
    { x0: 2.31, y0: 0.09, x1: 2.31, y1: 2.94 },
    { x0: 8.85, y0: 0.09, x1: 8.85, y1: 1.28 },
    { x0: 3.16, y0: 1.67, x1: 3.16, y1: 2.94 },
    { x0: 4.80, y0: 1.67, x1: 4.80, y1: 2.02 },
    { x0: 3.16, y0: 4.74, x1: 4.80, y1: 4.74 },
    { x0: 12.54, y0: 5.24, x1: 13.23, y1: 5.24 },
    { x0: 4.17, y0: 6.08, x1: 5.93, y1: 6.08 },
    { x0: 8.69, y0: 9.45, x1: 8.69, y1: 10.05 },
    { x0: 12.65, y0: 9.45, x1: 12.65, y1: 10.05 },
    { x0: 8.85, y0: 0.09, x1: 10.68, y1: 0.09, openings: [{ at: 0.08, w: 1.67, type: 'window', sill: 0.9, head: 2.1 }] },
    { x0: 8.69, y0: 11.56, x1: 12.65, y1: 11.56, rail: 1.05 },
  ],
  // Heads / fronts, after footprint centering (see Cochrane Type A):
  // Master_Bed head -X. Bed1/Bed2 head +X. Sofa back +X, length Z.
  // TV screen -X. Master_Wardrobe long Z, front +X. Bed2_Wardrobe long X, front -Z.
  // Kitchen_Run backsplash +Z. Dining table long Z. Fridge back +Z.
  furniture: [
    // Symbol centres from the plan. Master bed 1.27 x 1.94, head north; wardrobe on the west wall.
    ['Master_Bed', 1.60, 8.40, 1, 0.85, 0.70],
    ['Master_Bedside_L', 1.00, 8.60, 1],
    ['Master_Wardrobe', 0.543, 4.11, 0, 1, 0.80],
    // Bedroom 3 — head north; desk back to the south wall of the bay
    ['Bed2_Bed', 4.55, 8.454, 3, 0.80, 0.85],
    ['Master_Desk', 5.12, 6.45, 2],
    ['Master_DeskChair', 5.12, 6.95, 2],
    // Bedroom 4 — same pair, east of the bedroom door
    ['Bed1_Bed', 7.30, 8.454, 3, 0.80, 0.85],
    ['Master_Desk', 7.90, 6.45, 2],
    ['Master_DeskChair', 7.90, 6.95, 2],
    // Junior bedroom — head on the east wall, wardrobe below it
    ['Bed2_Bed', 14.549, 8.00, 0, 0.75, 0.80],
    ['Bed2_Wardrobe', 15.057, 6.15, 3, 0.90, 1],
    // Living — sofa on the west, chairs toward the balcony, TV on the east wall
    ['Rug_Living', 10.70, 7.60, 0, 0.85, 0.80],
    ['Sofa', 9.40, 7.60, 2],
    ['Armchair', 10.20, 9.35, 2],
    ['Armchair', 11.30, 9.35, 2],
    ['Coffee_Table', 10.70, 7.60, 0],
    ['TV_Unit', 12.36, 7.80, 0, 0.85, 0.80],
    // Dining — table 0.80 x 2.14, three chairs each long side
    ['Dining_Table', 11.40, 3.77, 0, 0.89, 1.19],
    ['Dining_Chair_L1', 10.81, 4.48, 0],
    ['Dining_Chair_L2', 10.81, 3.79, 0],
    ['Dining_Chair_L1', 10.81, 3.09, 0],
    ['Dining_Chair_R1', 11.99, 4.48, 0],
    ['Dining_Chair_R2', 11.99, 3.79, 0],
    ['Dining_Chair_R1', 11.99, 3.09, 0],
    // Pantry counter on the west wall, 2.75 m
    ['Kitchen_Run', 6.81, 3.60, 1, 0.57, 1],
    // Kitchen along the south wall, fridge on the east wall
    ['Kitchen_Run', 6.48, 0.52, 0, 0.55, 1],
    ['Fridge', 8.363, 1.30, 3],
    ['Yard_Washer', 3.90, 0.527, 0],
    ['Shoe_Cabinet', 9.70, 0.385, 0, 0.80, 1],
    ['Balcony_Chair_1', 9.85, 10.85, 2],
    ['Balcony_SideTable', 10.55, 10.85, 0],
    ['Balcony_Chair_2', 11.25, 10.85, 2],
    ['Balcony_Plant_2', 12.10, 10.85, 0, 0.45, 0.45],
    // Master bath: vanity on the north wall, toilet on the west, shower on the south
    ['MBath_Vanity', 3.80, 4.38, 3],
    ['MBath_Toilet', 3.635, 3.40, 2],
    ['MBath_Shower', 3.70, 2.18, 0],
    // Bath 3: vanity north, toilet on the west wall, shower south
    ['Bath1_Vanity', 5.50, 4.38, 3],
    ['Bath1_Toilet', 5.275, 3.30, 2],
    ['Bath1_Shower', 5.40, 2.51, 0],
    // Junior bath: shower stays in the stall, toilet on the east wall, vanity south
    ['Bath1_Shower', 14.98, 4.51, 0],
    ['Bath1_Toilet', 15.015, 3.60, 0],
    ['Bath1_Vanity', 14.00, 2.38, 1],
  ],
  procedural: [
    // Island drawn 1.01 x 1.75, long north–south, stools on the west side
    { kind: 'kitchen_island', x: 8.63, y: 3.93, w: 1.01, d: 1.75, rot: 0 },
    { kind: 'stool', x: 7.90, y: 3.40 },
    { kind: 'stool', x: 7.90, y: 3.93 },
    { kind: 'stool', x: 7.90, y: 4.46 },
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-1.8, -3.4, 17.8], tgt: [7.75, 4.16, 0.4], fov: 32 },
    { id: 'plan', name: 'Plan', pos: [7.75, 5.78, 19.8], tgt: [7.75, 5.78, 0], fov: 38 },
  ],
};
