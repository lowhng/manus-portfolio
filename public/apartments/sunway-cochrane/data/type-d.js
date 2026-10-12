// Sunway Cochrane Type D — 1001 sqft / 93 m²
// Rebuilt from type-d-1001sf.png.
//
// The printed 13130 mm arrow is centred on the outer side walls
// (stroke centres x=925 and x=2075). Depth uses the same scale from the
// north centre (image y=156) to the south centre (image y=925): 8.78 m.
//   sx = 13.130 / (2075 - 925)
// Origin is the south-west outer centre line. +y toward the balcony.
// The hammer is on bedroom 2's south wall, to the right of the wardrobe.
// That run is hackable. The quarter-circle on its left is bedroom 2's door.
// Bedroom 3's door is the arc on its west wall. Kitchen & Yard is one indoor room.
window.UNIT = {
  id: 'type-d',
  project: 'Sunway Cochrane',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type D',
  beds: 3,
  baths: 2,
  sqft: 1001,
  sourceUrl: 'https://assets.sunwayproperty.com/2026/03/Sunway-Cochrane-Brochure.pdf',
  width: 13.13,
  depth: 8.78,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.20,
  explicitWalls: true,
  // Image pixel of world (0, 0). Both axes use the 13130 mm arrow. Image +y is down.
  plan: {
    file: 'type-d-1001sf.png',
    ox: 925,
    oy: 925,
    mx: 13.130 / (2075 - 925),
    my: 13.130 / (2075 - 925),
  },
  rooms: [
    { name: 'Master Bedroom', c: [1.45, 5.80], box: [0.12, 2.99, 2.78, 8.66] },
    { name: 'Master Bath', c: [2.05, 1.40], box: [1.32, 0.12, 2.78, 2.75] },
    { name: 'Living', c: [5.40, 6.20], box: [3.02, 4.20, 7.70, 7.66] },
    { name: 'Dining', c: [6.40, 3.40], box: [4.97, 2.20, 7.75, 4.60] },
    { name: 'Kitchen', c: [6.40, 1.10], box: [4.90, 0.12, 8.10, 2.10] },
    { name: 'Foyer', c: [3.70, 0.50], box: [3.00, 0.12, 4.70, 1.00] },
    { name: 'Balcony', c: [5.40, 8.25], box: [3.10, 7.90, 7.75, 8.66] },
    { name: 'A/C ledge', c: [8.20, 8.25], box: [7.95, 7.90, 8.47, 8.66] },
    { name: 'Bedroom 2', c: [10.20, 6.80], box: [8.69, 5.18, 11.23, 8.66] },
    { name: 'Bedroom 3', c: [12.20, 3.70], box: [11.47, 2.54, 13.01, 4.94] },
    { name: 'Bath 2', c: [9.00, 3.70], box: [8.30, 2.52, 9.75, 4.90] },
  ],
  floors: [
    { name: 'Master Bedroom', box: [0.12, 2.99, 2.78, 8.66] },
    { name: 'Master Bath', box: [1.32, 0.12, 2.78, 2.75] },
    { name: 'Living', box: [3.02, 4.20, 7.70, 7.66] },
    { name: 'Dining', box: [4.97, 2.20, 7.75, 4.60] },
    { name: 'Kitchen', box: [4.90, 0.12, 8.10, 2.10] },
    { name: 'Foyer', box: [3.00, 0.12, 4.70, 1.00] },
    { name: 'Balcony', box: [3.10, 7.90, 7.75, 8.66] },
    { name: 'A/C ledge', box: [7.95, 7.90, 8.47, 8.66] },
    { name: 'Bedroom 2', box: [8.69, 5.18, 11.23, 8.66] },
    { name: 'Bedroom 3', box: [11.47, 2.54, 13.01, 4.94] },
    { name: 'Bath 2', box: [8.30, 2.52, 9.75, 4.90] },
  ],
  walls: [
    { x0: 0, y0: 2.87, x1: 0, y1: 8.78 },
    // Master window, balcony and A/C railing, then bedroom 2's window.
    { x0: 0, y0: 8.78, x1: 2.90, y1: 8.78, openings: [
      { at: 0.45, w: 2.25, type: 'window', sill: 0.12, head: 2.1 },
    ] },
    { x0: 2.90, y0: 8.78, x1: 8.57, y1: 8.78, rail: 1.05 },
    { x0: 8.57, y0: 8.78, x1: 11.35, y1: 8.78, openings: [
      { at: 0.38, w: 2.10, type: 'window', sill: 0.12, head: 2.1 },
    ] },
    { x0: 11.35, y0: 5.06, x1: 11.35, y1: 8.78 },
    { x0: 11.35, y0: 5.06, x1: 13.13, y1: 5.06, openings: [
      { at: 0.45, w: 1.00, type: 'window', sill: 0.12, head: 2.1 },
    ] },
    { x0: 13.13, y0: 2.42, x1: 13.13, y1: 5.06 },
    { x0: 9.85, y0: 2.42, x1: 13.13, y1: 2.42 },
    // Entry, with a narrow glazed sidelight on the kitchen side of the leaf.
    { x0: 1.20, y0: 0, x1: 8.20, y1: 0, openings: [
      { at: 2.29, w: 0.90, type: 'door', hinge: 'start', swing: 1, kind: 'entry' },
      { at: 3.19, w: 0.36, type: 'window', sill: 0, head: 2.1 },
    ] },
    { x0: 1.20, y0: 0, x1: 1.20, y1: 2.87 },
    { x0: 0, y0: 2.87, x1: 2.90, y1: 2.87, openings: [
      { at: 2.00, w: 0.75, type: 'door', hinge: 'end', swing: 1 },
    ] },
    { x0: 2.90, y0: 0, x1: 2.90, y1: 8.78, openings: [
      // Foyer door, hinged on this wall. The swing is the arc above the foyer.
      { at: 0.31, w: 0.90, type: 'door', hinge: 'end', swing: 1 },
      { at: 3.15, w: 0.77, type: 'door', hinge: 'start', swing: 1 },
    ] },
    // Living / balcony slider. The A/C ledge to its right stays solid.
    { x0: 2.90, y0: 7.80, x1: 8.57, y1: 7.80, openings: [
      { at: 1.00, w: 3.80, type: 'slider' },
    ] },
    { x0: 7.85, y0: 7.80, x1: 7.85, y1: 8.78, rail: 1.05 },
    { x0: 8.57, y0: 5.06, x1: 8.57, y1: 8.78 },
    // Bedroom 2's south wall. Door on the left; the hammer length is hackable.
    { x0: 8.20, y0: 5.06, x1: 11.35, y1: 5.06, openings: [
      { at: 0.15, w: 0.90, type: 'door', hinge: 'start', swing: 1 },
    ], hackable: [{ at: 1.65, w: 1.50 }] },
    { x0: 4.80, y0: 0, x1: 4.80, y1: 2.20 },
    { x0: 4.80, y0: 2.20, x1: 8.20, y1: 2.20, openings: [
      { at: 1.21, w: 0.90, type: 'door', hinge: 'start', swing: -1 },
    ] },
    // Passage beside bath 2. The dashed swing is a door, not an open hole.
    { x0: 8.20, y0: 2.42, x1: 9.85, y1: 2.42 },
    { x0: 8.20, y0: 0, x1: 8.20, y1: 5.06, openings: [
      { at: 3.89, w: 1.17, type: 'door', hinge: 'end', swing: 1 },
    ] },
    // Bedroom 3 door, swinging into the room.
    { x0: 9.85, y0: 2.42, x1: 9.85, y1: 5.06, openings: [
      { at: 1.62, w: 1.02, type: 'door', hinge: 'end', swing: 1 },
    ] },
  ],
  furniture: [
    // Master — head on the west wall; wardrobe along the bath wall.
    ['Master_Bed', 1.05, 6.20, 0, 0.85, 0.90],
    ['Master_Wardrobe', 1.05, 3.302, 3, 1, 0.75],
    // Master bath — vanity and toilet on the west wall, shower in the south stall.
    ['MBath_Vanity', 1.56, 2.32, 2],
    ['MBath_Toilet', 1.675, 1.55, 2],
    ['MBath_Shower', 1.762, 0.508, 0],
    // Living — TV on the west wall, sofa facing it.
    ['TV_Unit', 3.18, 6.20, 2, 0.8, 1],
    ['Coffee_Table', 3.90, 6.15, 0],
    ['Sofa', 4.85, 6.15, 0, 0.95, 0.85],
    ['Dining_Table', 6.30, 3.40, 3, 0.9, 0.75],
    ['Dining_Chair_L1', 5.95, 4.05, 1],
    ['Dining_Chair_R1', 6.65, 4.05, 3],
    ['Dining_Chair_L2', 5.95, 2.75, 3],
    ['Dining_Chair_R2', 6.65, 2.75, 1],
    ['Kitchen_Run', 6.25, 0.43, 0, 0.45, 1],
    ['Fridge', 5.288, 1.70, 1],
    ['Yard_Washer', 7.762, 1.20, 3],
    // Bedroom 2 — head on the east wall; wardrobe on the south wall, east of the door.
    ['Bed1_Bed', 10.30, 7.30, 0, 0.85, 0.75],
    ['Bed1_Wardrobe', 10.265, 5.399, 0, 0.85, 0.7],
    // Bedroom 3 — head on the south wall; wardrobe on the west wall.
    ['Bed2_Bed', 12.15, 3.416, 1, 0.80, 0.70],
    ['Bed2_Wardrobe', 10.204, 3.20, 1, 0.85, 0.75],
    // Bath 2 — vanity and toilet on the west wall; shower against the east wall.
    ['Bath1_Vanity', 8.56, 4.40, 2],
    ['Bath1_Toilet', 8.675, 3.55, 2],
    ['Bath1_Shower', 9.314, 2.91, 0],
    ['Shoe_Cabinet', 3.22, 0.295, 0, 0.45, 1],
    ['Balcony_Plant_1', 4.00, 8.25, 0, 0.6, 0.6],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-2.2, -3.4, 17.5], tgt: [6.4, 4.2, 0.4], fov: 32 },
    { id: 'plan', name: 'Plan', pos: [6.56, 4.39, 20], tgt: [6.56, 4.39, 0], fov: 40 },
    { id: 'living', name: 'Living', pos: [5.4, 4.6, 1.45], tgt: [5.5, 6.6, 0.9], hfov: 78 },
    { id: 'master', name: 'Master bedroom', pos: [1.4, 4.8, 1.45], tgt: [1.4, 6.6, 0.9], hfov: 78 },
  ],
};
