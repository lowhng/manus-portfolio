// Aster Residence Type A — 650 sqft, 2 bedrooms, 2 bathrooms.
// The sheet prints no millimetre arrow. Scale is the outer wall-centre
// polygon set to 650 sqft (s = 0.00919 m/px). The drawn stroke is about
// 200 mm. Origin is the south-west outer centre. +x right, +y toward the
// master/living end of the plan. No pink hammer on this sheet.
// A hinged leaf is placed only on a gap where the plan breaks the wall
// for a swing. Tan marks are not doors.
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
  rooms: [
    { name: 'Master Bedroom', c: [2.85, 7.20], box: [1.30, 5.90, 4.40, 8.50] },
    { name: 'Living', c: [6.15, 7.20], box: [4.70, 5.90, 7.60, 8.50] },
    { name: 'Dining', c: [6.15, 4.95], box: [4.70, 4.35, 7.60, 5.60] },
    { name: 'Kitchen', c: [6.15, 2.90], box: [4.70, 1.75, 7.60, 4.05] },
    { name: 'Bath 1', c: [3.60, 4.55], box: [2.85, 3.55, 4.40, 5.60] },
    { name: 'Bath 2', c: [1.90, 4.55], box: [1.30, 3.55, 2.55, 5.60] },
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
    { name: 'Bath 1', box: [2.70, 3.40, 4.55, 5.75] },
    { name: 'Bath 2', box: [1.15, 3.40, 2.70, 5.75] },
    { name: 'Bedroom 2', box: [1.15, 0, 4.55, 3.40] },
    { name: 'A/C Ledge', box: [0, 0, 1.15, 3.40] },
    { name: 'Foyer', box: [4.55, 0, 6.10, 1.60] },
    { name: 'Utility', box: [6.10, 0, 7.75, 1.60] },
  ],
  walls: [
    { x0: 0, y0: 0, x1: 0, y1: 3.40 },
    // South edge. The measured gap is the entrance; the leaf is the west part of that gap.
    { x0: 0, y0: 0, x1: 7.75, y1: 0, openings: [
      { at: 4.65, w: 0.90, type: 'door', hinge: 'start', swing: 1, kind: 'entry' },
      { at: 5.55, w: 0.50, type: 'opening' },
    ] },
    { x0: 7.75, y0: 0, x1: 7.75, y1: 8.70 },
    { x0: 1.15, y0: 8.70, x1: 7.75, y1: 8.70, openings: [
      { at: 0.90, w: 1.90, type: 'window' },
      { at: 3.60, w: 1.80, type: 'window' },
    ] },
    { x0: 1.15, y0: 0, x1: 1.15, y1: 8.70, openings: [
      { at: 4.30, w: 0.70, type: 'opening' },
    ] },
    { x0: 0, y0: 3.40, x1: 1.15, y1: 3.40 },
    // Master south wall. The gray stroke is continuous here, so this is a
    // cased opening rather than a hinged leaf.
    { x0: 1.15, y0: 5.75, x1: 4.55, y1: 5.75, openings: [
      { at: 0.25, w: 0.90, type: 'opening' },
    ] },
    // Bedroom 2 / baths. Same: the stroke does not break for a swing.
    { x0: 1.15, y0: 3.40, x1: 4.55, y1: 3.40, openings: [
      { at: 0.20, w: 0.90, type: 'opening' },
      { at: 1.70, w: 0.80, type: 'opening' },
      { at: 2.55, w: 0.80, type: 'opening' },
    ] },
    { x0: 2.70, y0: 3.40, x1: 2.70, y1: 5.75 },
    { x0: 4.55, y0: 0, x1: 4.55, y1: 8.70, openings: [
      { at: 0.69, w: 0.90, type: 'door', hinge: 'start', swing: -1 },
      { at: 4.48, w: 0.90, type: 'door', hinge: 'start', swing: 1 },
    ] },
    { x0: 6.10, y0: 0, x1: 6.10, y1: 1.60 },
    { x0: 4.55, y0: 1.60, x1: 7.75, y1: 1.60, openings: [
      { at: 0.30, w: 0.90, type: 'opening' },
    ] },
    { x0: 4.55, y0: 4.20, x1: 7.75, y1: 4.20 },
  ],
  furniture: [
    ['Master_Bed', 2.80, 7.15, 0, 0.85, 0.90],
    ['Master_Bedside_L', 1.70, 7.40, 0, 0.70, 0.70],
    ['Master_Bedside_R', 3.90, 7.40, 0, 0.70, 0.70],
    ['Master_Wardrobe', 1.55, 6.20, 1, 0.70, 1.10],
    ['Sofa', 6.30, 7.30, 2, 0.70, 0.95],
    ['Coffee_Table', 6.20, 6.50, 0, 0.70, 0.70],
    ['TV_Unit', 7.30, 7.20, 1, 0.55, 1.20],
    ['Dining_Table', 6.20, 5.00, 0, 0.70, 0.85],
    ['Dining_Chair_L1', 5.70, 5.30, 1],
    ['Dining_Chair_R1', 6.70, 5.30, 3],
    ['Dining_Chair_L2', 5.70, 4.70, 1],
    ['Dining_Chair_R2', 6.70, 4.70, 3],
    ['Kitchen_Run', 6.40, 1.90, 0, 0.35, 0.90],
    ['Fridge', 7.35, 3.50, 1, 0.70, 0.70],
    ['Bed2_Bed', 2.70, 1.80, 0, 0.80, 0.85],
    ['Bed2_Wardrobe', 1.50, 2.60, 1, 0.55, 1.00],
    ['Bed2_Bedside', 3.80, 2.20, 0, 0.65, 0.65],
    ['MBath_Shower', 1.70, 5.20, 0, 0.55, 0.70],
    ['MBath_Vanity', 1.70, 4.00, 0, 0.70, 0.55],
    ['MBath_Toilet', 2.30, 4.70, 1, 0.50, 0.70],
    ['Bath1_Shower', 3.20, 5.20, 0, 0.55, 0.70],
    ['Bath1_Vanity', 3.90, 4.00, 0, 0.70, 0.55],
    ['Bath1_Toilet', 3.30, 4.50, 1, 0.50, 0.70],
    ['Shoe_Cabinet', 5.20, 1.20, 0, 0.80, 0.70],
    ['Yard_Washer', 7.20, 0.70, 0, 0.70, 0.70],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-1.6, -2.2, 12], tgt: [3.8, 4.2, 0.4], fov: 36 },
    { id: 'plan', name: 'Plan', pos: [3.9, 4.3, 16], tgt: [3.9, 4.3, 0], fov: 36 },
  ],
};
