// Aster Residence Type C — 953 sqft, 3 bedrooms, 3 bathrooms.
// Upper plan on the shared C/C1 sheet. No millimetre arrow. Outer
// wall-centre polygon scaled to 953 sqft (s = 0.0113 m/px). Origin is
// the south-west outer centre. +y toward the balcony end of the sheet.
// No pink hammer. A hinged leaf is placed only where a quarter-circle
// swing was measured on the ink.
window.UNIT = {
  id: 'type-c',
  project: 'Aster Residence',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type C',
  beds: 3,
  baths: 3,
  sqft: 953,
  sourceUrl: 'https://www.amberhomes.com.my/home/project/aster-residence/',
  width: 9.80,
  depth: 9.50,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.20,
  explicitWalls: true,
  plan: {
    file: 'type-c-953sf.jpg',
    ox: 61,
    oy: 982,
    mx: 9.80 / 864,
    my: 9.80 / 864,
  },
  rooms: [
    { name: 'Bedroom 2', c: [1.50, 7.80], box: [0.20, 6.20, 2.95, 9.30] },
    { name: 'Living', c: [4.80, 7.70], box: [3.30, 6.20, 6.35, 9.30] },
    { name: 'Master Bedroom', c: [8.10, 7.60], box: [6.75, 6.20, 9.60, 9.30] },
    { name: 'Bath 2', c: [1.50, 5.30], box: [0.20, 4.70, 2.95, 6.00] },
    { name: 'Dining', c: [4.80, 5.20], box: [3.30, 4.00, 6.35, 6.20] },
    { name: 'Master Bath', c: [8.10, 5.55], box: [6.75, 5.05, 9.60, 6.10] },
    { name: 'Bath 3', c: [1.50, 3.80], box: [0.20, 3.30, 2.95, 4.50] },
    { name: 'Kitchen', c: [8.10, 4.00], box: [6.75, 3.30, 9.60, 4.80] },
    { name: 'Bedroom 3', c: [1.50, 1.60], box: [0.20, 0.20, 2.95, 3.00] },
    { name: 'Foyer', c: [4.80, 1.40], box: [3.30, 0.20, 6.35, 2.90] },
    { name: 'Utility', c: [6.00, 0.70], box: [5.20, 0.15, 7.00, 1.40] },
  ],
  floors: [
    { name: 'Bedroom 2', box: [0, 6.03, 3.13, 9.50] },
    { name: 'Living', box: [3.13, 6.20, 6.55, 9.50] },
    { name: 'Master Bedroom', box: [6.55, 6.20, 9.80, 9.50] },
    { name: 'Bath 2', box: [0, 4.55, 3.13, 6.03] },
    { name: 'Dining', box: [3.13, 3.15, 6.55, 6.20] },
    { name: 'Bath 3', box: [0, 3.15, 3.13, 4.55] },
    { name: 'Kitchen', box: [6.55, 3.15, 9.80, 4.92] },
    { name: 'Bedroom 3', box: [0, 0, 3.13, 3.15] },
    { name: 'Foyer', box: [3.13, 0, 7.16, 3.15] },
    { name: 'Master Bath', box: [6.55, 4.92, 9.80, 6.20] },
  ],
  walls: [
    { x0: 0, y0: 0, x1: 0, y1: 9.50, openings: [
      { at: 1.22, w: 1.20, type: 'window', sill: 0.9, head: 2.1 },
      { at: 3.14, w: 0.62, type: 'window', sill: 0.9, head: 2.1 },
      { at: 5.37, w: 0.60, type: 'window', sill: 0.9, head: 2.1 },
    ] },
    { x0: 0, y0: 0, x1: 7.16, y1: 0, openings: [
      { at: 3.23, w: 1.60, type: 'door', hinge: 'end', swing: -1, kind: 'entry' },
    ] },
    { x0: 7.16, y0: 0, x1: 7.16, y1: 3.15 },
    { x0: 0, y0: 3.15, x1: 9.80, y1: 3.15, openings: [
      // Bath 3 south wall. West jamb, swing south into Bedroom 3.
      { at: 2.20, w: 0.72, type: 'door', hinge: 'start', swing: -1 },
      { at: 3.23, w: 3.24, type: 'opening', noDoor: 'open-plan arch' },
      { at: 7.24, w: 0.75, type: 'window', sill: 0.9, head: 2.1 },
    ] },
    { x0: 9.80, y0: 3.15, x1: 9.80, y1: 9.50 },
    { x0: 0, y0: 9.50, x1: 9.80, y1: 9.50, openings: [
      { at: 3.80, w: 2.40, type: 'window' },
      { at: 7.06, w: 2.00, type: 'window' },
    ] },
    { x0: 3.13, y0: 0, x1: 3.13, y1: 9.50, openings: [
      // Bedroom 3 east wall. Hinge on the south jamb, swing east into the foyer.
      { at: 2.01, w: 0.90, type: 'door', hinge: 'start', swing: -1 },
      // Bedroom 2 east wall. Hinge on the south jamb, swing west into the room.
      { at: 6.21, w: 0.89, type: 'door', hinge: 'start', swing: 1 },
    ] },
    { x0: 6.55, y0: 3.15, x1: 6.55, y1: 9.50, openings: [
      // Master Bedroom west wall, hinge on the north jamb, swing west out to the living side.
      { at: 3.05, w: 0.90, type: 'door', hinge: 'end', swing: 1 },
    ] },
    // Bath 2 north wall. East jamb, swing south into the bath.
    { x0: 0, y0: 6.03, x1: 3.13, y1: 6.03, openings: [
      { at: 2.20, w: 0.72, type: 'door', hinge: 'end', swing: 1 },
    ] },
    { x0: 0, y0: 4.55, x1: 3.13, y1: 4.55 },
    { x0: 6.55, y0: 4.92, x1: 9.80, y1: 4.92, openings: [
      // Hinge on the east jamb, swing north into the master bath.
      { at: 0.76, w: 0.80, type: 'door', hinge: 'end', swing: -1 },
    ] },
    { x0: 6.55, y0: 6.20, x1: 9.80, y1: 6.20 },
  ],
  furniture: [
    // Bedroom 2 — head on the west wall, wardrobe along the south wall
    ['Bed2_Bed', 1.050, 7.90, 2, 0.85, 0.80],
    ['Bed2_Wardrobe', 1.80, 6.322, 0, 0.85, 0.55],
    // Living — TV on the west side, sofa opposite facing west
    ['TV_Unit', 3.390, 7.80, 2, 0.70, 0.85],
    ['Coffee_Table', 4.70, 7.70, 0, 0.60, 0.60],
    ['Sofa', 5.70, 7.85, 0, 0.80, 0.85],
    // Master Bedroom — head north, wardrobe on the east wall, desk on the south wall
    ['Master_Bed', 8.05, 8.504, 1, 0.80, 0.80],
    // East wall, long north-south, front west.
    ['Master_Wardrobe', 9.508, 7.60, 2, 0.55, 0.80],
    ['Master_Desk', 8.00, 6.57, 2],
    ['Master_DeskChair', 8.00, 7.15, 2],
    // Bath 2
    ['Bath1_Shower', 0.55, 5.688, 0, 0.50, 0.60],
    ['Bath1_Vanity', 2.40, 4.814, 1, 0.60, 0.50],
    ['Bath1_Toilet', 2.850, 5.15, 0, 0.45, 0.50],
    // Dining — table long east-west, three chairs each side
    ['Dining_Table', 4.80, 5.15, 1, 0.80, 1.00],
    ['Dining_Chair_L1', 4.10, 5.65, 1],
    ['Dining_Chair_L2', 4.80, 5.65, 1],
    ['Dining_Chair_L3', 5.50, 5.65, 1],
    ['Dining_Chair_R1', 4.10, 4.65, 1],
    ['Dining_Chair_R2', 4.80, 4.65, 1],
    ['Dining_Chair_R3', 5.50, 4.65, 1],
    // Bath 3
    ['Bath1_Shower', 0.55, 4.226, 2, 0.50, 0.55],
    ['Bath1_Vanity', 2.40, 3.414, 1, 0.60, 0.50],
    ['Bath1_Toilet', 2.850, 3.60, 0, 0.45, 0.50],
    // Kitchen L, fridge at the north end of the east run
    ['Kitchen_Run', 9.525, 3.85, 3, 0.207, 0.50],
    ['Kitchen_Run', 7.90, 3.409, 0, 0.456, 0.45],
    ['Fridge', 9.460, 4.58, 3, 0.60, 0.60],
    // Master bath — shower north-west, toilet south-west, vanity on the east wall
    ['MBath_Shower', 7.40, 5.867, 0, 0.50, 0.55],
    ['MBath_Toilet', 6.830, 5.25, 2, 0.45, 0.50],
    ['MBath_Vanity', 9.548, 5.35, 0, 0.55, 0.50],
    // Bedroom 3 — head west, wardrobe on the south wall
    ['Bed1_Bed', 1.050, 1.70, 2, 0.85, 0.80],
    ['Bed1_Wardrobe', 1.70, 0.276, 0, 0.80, 0.50],
    ['Shoe_Cabinet', 5.50, 0.216, 0, 0.70, 0.55],
    ['Yard_Washer', 6.50, 0.295, 0, 0.55, 0.55],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-2.0, -2.4, 14], tgt: [4.8, 4.6, 0.4], fov: 36 },
    { id: 'plan', name: 'Plan', pos: [4.9, 4.8, 18], tgt: [4.9, 4.8, 0], fov: 36 },
  ],
};
