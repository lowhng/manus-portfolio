// Aster Residence Type A — 650 sqft, 2 bedrooms, 2 bathrooms.
// The sheet prints no millimetre arrow. Scale is the outer wall-centre
// polygon set to 650 sqft (s = 0.00919 m/px). The drawn stroke is about
// 200 mm. Origin is the south-west outer centre. +x right, +y toward the
// master/living end of the plan. No pink hammer on this sheet.
// Hinged leaves follow the thin grey quarter-circles: master (into the
// room), the bath partition, Bath 1, Bedroom 2, both spine breaks (into
// the bedrooms), the kitchen/foyer door, and the foyer entrance (hinge
// on the east jamb).
window.UNIT = {
  id: 'type-a',
  project: 'Aster Residence',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type A',
  beds: 2,
  baths: 2,
  sqft: 650,
  sourceUrl: 'https://www.amberhomes.com.my/home/project/aster-residence/',
  width: 7.75,
  depth: 8.70,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.20,
  explicitWalls: true,
  plan: {
    file: 'type-a-650sf.jpg',
    ox: 411,
    oy: 1168,
    mx: 7.75 / 844,
    my: 7.75 / 844,
  },
  rooms: [
    { name: 'Master Bedroom', c: [2.85, 7.20], box: [1.30, 5.90, 4.40, 8.50] },
    { name: 'Living', c: [6.15, 7.20], box: [4.70, 5.90, 7.60, 8.50] },
    { name: 'Dining', c: [6.15, 4.95], box: [4.70, 4.35, 7.60, 5.60] },
    { name: 'Kitchen', c: [6.15, 2.90], box: [4.70, 1.75, 7.60, 4.05] },
    { name: 'Bath 2', c: [3.60, 4.55], box: [2.85, 3.55, 4.40, 5.60] },
    { name: 'Bath 1', c: [1.90, 4.55], box: [1.30, 3.55, 2.55, 5.60] },
    { name: 'Bedroom 2', c: [2.85, 1.70], box: [1.30, 0.20, 4.40, 3.25] },
    { name: 'A/C Ledge', c: [0.55, 1.70], box: [0.15, 0.15, 1.00, 3.25] },
    { name: 'Foyer', c: [5.30, 0.80], box: [4.70, 0.15, 5.95, 1.45] },
    { name: 'Utility', c: [6.90, 0.80], box: [6.25, 0.15, 7.60, 1.45] },
  ],
  floors: [
    { name: 'Master Bedroom', box: [1.15, 5.75, 4.55, 8.70] },
    { name: 'Living', box: [4.55, 5.75, 7.75, 8.70] },
    { name: 'Dining', box: [4.55, 4.20, 7.75, 5.75] },
    { name: 'Kitchen', box: [4.55, 1.60, 7.75, 4.20] },
    { name: 'Bath 2', box: [2.70, 3.40, 4.55, 5.75] },
    { name: 'Bath 1', box: [1.15, 3.40, 2.70, 5.75] },
    { name: 'Bedroom 2', box: [1.15, 0, 4.55, 3.40] },
    { name: 'A/C Ledge', box: [0, 0, 1.15, 3.40] },
    { name: 'Foyer', box: [4.55, 0, 6.10, 1.60] },
    { name: 'Utility', box: [6.10, 0, 7.75, 1.60] },
  ],
  walls: [
    { x0: 0, y0: 0, x1: 0, y1: 3.40, rail: 1.05 },
    // Entrance. Hinge on the east jamb, leaf swings north into the foyer.
    { x0: 0, y0: 0, x1: 7.75, y1: 0, openings: [
      { at: 4.63, w: 1.40, type: 'door', hinge: 'end', swing: -1, kind: 'entry' },
    ] },
    { x0: 7.75, y0: 0, x1: 7.75, y1: 8.70 },
    { x0: 1.15, y0: 8.70, x1: 7.75, y1: 8.70, openings: [
      { at: 0.90, w: 1.90, type: 'window' },
      { at: 3.60, w: 1.80, type: 'window' },
    ] },
    { x0: 1.15, y0: 0, x1: 1.15, y1: 8.70, openings: [
      { at: 4.30, w: 0.61, type: 'window', sill: 0.9, head: 2.1 },
    ] },
    { x0: 0, y0: 3.40, x1: 1.15, y1: 3.40 },
    // Master south wall. Arc inside the room, hinge on the west jamb.
    { x0: 1.15, y0: 5.75, x1: 4.55, y1: 5.75, openings: [
      { at: 0.25, w: 0.90, type: 'door', hinge: 'start', swing: 1 },
    ] },
    // Bedroom 2 (west) and Bath 2 (east of it), both swinging south into those rooms.
    // The wall east of the Bath 2 door is solid; the nightstand sits against it.
    { x0: 1.15, y0: 3.40, x1: 4.55, y1: 3.40, openings: [
      { at: 0.20, w: 0.90, type: 'door', hinge: 'start', swing: -1 },
      { at: 1.70, w: 0.80, type: 'door', hinge: 'start', swing: -1 },
    ] },
    // Wall between the two baths. Arc into Bath 2, hinge on the south jamb.
    { x0: 2.70, y0: 3.40, x1: 2.70, y1: 5.75, openings: [
      { at: 1.38, w: 0.82, type: 'door', hinge: 'start', swing: -1 },
    ] },
    // Spine doors. Each grey quarter-circle hinges on the south jamb and swings west into the bedroom.
    { x0: 4.55, y0: 0, x1: 4.55, y1: 8.70, openings: [
      { at: 0.69, w: 0.90, type: 'door', hinge: 'start', swing: 1 },
      { at: 4.48, w: 0.90, type: 'door', hinge: 'start', swing: 1 },
    ] },
    { x0: 6.10, y0: 0, x1: 6.10, y1: 1.60 },
    // Kitchen / foyer. The grey quarter-circle hinges on the east jamb and swings north into the kitchen.
    { x0: 4.55, y0: 1.60, x1: 7.75, y1: 1.60, openings: [
      { at: 0.30, w: 0.90, type: 'door', hinge: 'end', swing: -1 },
    ] },
    { x0: 4.55, y0: 4.20, x1: 7.75, y1: 4.20 },
  ],
  // Master head -X (rot 0 faces west). Bed2 head +X (rot 3 faces north).
  // Sofa back +X. TV screen -X. Wardrobe long Z, front +X.
  furniture: [
    ['Master_Bed', 2.255, 7.34, 0, 0.90, 0.85],
    ['Master_Bedside_L', 2.70, 8.15, 0, 0.65, 0.65],
    ['Master_Bedside_R', 3.55, 6.70, 0, 0.65, 0.65],
    ['Master_Wardrobe', 2.80, 6.151, 3, 0.90, 0.55],
    ['Sofa', 6.70, 7.40, 0, 0.80, 0.90],
    ['Coffee_Table', 5.70, 7.20, 0, 0.65, 0.65],
    ['TV_Unit', 4.810, 7.30, 2, 0.70, 0.90],
    ['Rug_Living', 6.20, 7.30, 0, 0.65, 0.70],
    ['Dining_Table', 6.20, 4.75, 1, 0.75, 0.90],
    ['Dining_Chair_L1', 5.55, 5.20, 1],
    ['Dining_Chair_R1', 6.85, 5.20, 1],
    ['Dining_Chair_L2', 5.55, 4.55, 1],
    ['Dining_Chair_R2', 6.85, 4.55, 1],
    ['Kitchen_Run', 7.475, 2.625, 3, 0.363, 0.50],
    ['Kitchen_Run', 5.95, 1.860, 0, 0.498, 0.45],
    ['Fridge', 7.391, 3.80, 3, 0.65, 0.65],
    ['Bed2_Bed', 2.60, 2.350, 3, 0.85, 0.80],
    // Wardrobe is drawn on the south wall, long east-west, front north.
    ['Bed2_Wardrobe', 2.70, 0.292, 0, 0.90, 0.55],
    ['Bed2_Bedside', 3.50, 1.70, 0, 0.60, 0.60],
    ['MBath_Shower', 1.513, 5.15, 0, 0.55, 0.65],
    ['MBath_Vanity', 1.65, 3.664, 1, 0.60, 0.50],
    ['MBath_Toilet', 2.20, 5.452, 3, 0.50, 0.55],
    ['Bath1_Shower', 3.048, 5.15, 0, 0.55, 0.65],
    ['Bath1_Vanity', 3.90, 3.664, 1, 0.60, 0.50],
    ['Bath1_Toilet', 4.252, 4.50, 0, 0.50, 0.55],
    ['Shoe_Cabinet', 5.30, 0.216, 0, 0.75, 0.55],
    ['Yard_Washer', 7.15, 0.326, 0, 0.65, 0.65],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-1.6, -2.2, 12], tgt: [3.8, 4.2, 0.4], fov: 36 },
    { id: 'plan', name: 'Plan', pos: [3.9, 4.3, 16], tgt: [3.9, 4.3, 0], fov: 36 },
  ],
};
