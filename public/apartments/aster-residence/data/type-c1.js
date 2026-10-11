// Aster Residence Type C1 — 957 sqft, 3 bedrooms, 3 bathrooms.
// Lower plan on the shared sheet. Same drawing scale as Type C.
// C1 keeps an extra kitchen/dining partition (the wall near x = 7.38)
// and the foyer sits on the east side of the entrance. No pink hammer.
// A hinged leaf is placed only where a quarter-circle swing was measured.
window.UNIT = {
  id: 'type-c1',
  project: 'Aster Residence',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type C1',
  beds: 3,
  baths: 3,
  sqft: 957,
  sourceUrl: 'https://www.amberhomes.com.my/home/project/aster-residence/',
  width: 9.35,
  depth: 9.45,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.20,
  explicitWalls: true,
  rooms: [
    { name: 'Bedroom 2', c: [1.45, 7.80], box: [0.20, 6.30, 2.85, 9.25] },
    { name: 'Living', c: [4.60, 7.70], box: [3.15, 6.30, 6.00, 9.25] },
    { name: 'Master Bedroom', c: [7.80, 8.50], box: [6.30, 7.55, 9.15, 9.25] },
    { name: 'Bath 2', c: [1.45, 5.40], box: [0.20, 4.70, 2.85, 6.10] },
    { name: 'Dining', c: [4.50, 5.00], box: [3.15, 3.80, 5.90, 6.10] },
    { name: 'Master Bath', c: [8.30, 4.70], box: [7.50, 3.40, 9.15, 6.10] },
    { name: 'Bath 3', c: [1.45, 3.60], box: [0.20, 2.80, 2.85, 4.50] },
    { name: 'Bedroom 3', c: [1.45, 1.40], box: [0.20, 0.20, 2.85, 2.60] },
    { name: 'Foyer', c: [7.60, 1.60], box: [6.30, 0.20, 9.15, 3.00] },
    { name: 'Kitchen', c: [4.00, 1.50], box: [3.15, 0.40, 5.10, 2.80] },
    { name: 'Utility', c: [5.30, 0.70], box: [4.80, 0.15, 6.00, 1.50] },
  ],
  floors: [
    { name: 'Bedroom 2', box: [0, 6.20, 3.00, 9.45] },
    { name: 'Living', box: [3.00, 6.20, 6.16, 9.45] },
    { name: 'Master Bedroom', box: [6.16, 7.40, 9.35, 9.45] },
    { name: 'Bath 2', box: [0, 4.60, 3.00, 6.20] },
    { name: 'Dining', box: [3.00, 3.20, 7.38, 6.20] },
    { name: 'Master Bath', box: [7.38, 3.20, 9.35, 6.20] },
    { name: 'Bath 3', box: [0, 1.70, 3.00, 4.60] },
    { name: 'Bedroom 3', box: [0, 0, 3.00, 1.70] },
    { name: 'Kitchen', box: [3.00, 0, 6.16, 3.20] },
    { name: 'Foyer', box: [6.16, 0, 9.35, 3.20] },
  ],
  walls: [
    { x0: 0, y0: 0, x1: 0, y1: 9.45, openings: [
      { at: 1.20, w: 1.20, type: 'opening' },
      { at: 3.11, w: 0.60, type: 'opening' },
      { at: 5.29, w: 0.60, type: 'opening' },
    ] },
    { x0: 0, y0: 0, x1: 9.35, y1: 0, openings: [
      { at: 6.55, w: 1.85, type: 'opening' },
      { at: 8.40, w: 0.95, type: 'door', hinge: 'end', swing: -1, kind: 'entry' },
    ] },
    { x0: 9.35, y0: 0, x1: 9.35, y1: 9.45 },
    { x0: 0, y0: 9.45, x1: 9.35, y1: 9.45, openings: [
      { at: 0.50, w: 1.60, type: 'window' },
      { at: 3.40, w: 1.80, type: 'window' },
      { at: 6.60, w: 1.80, type: 'window' },
    ] },
    { x0: 3.00, y0: 0, x1: 3.00, y1: 9.45, openings: [
      { at: 1.99, w: 0.89, type: 'door', hinge: 'end', swing: -1 },
      { at: 6.13, w: 0.89, type: 'door', hinge: 'start', swing: 1 },
    ] },
    { x0: 6.16, y0: 0, x1: 6.16, y1: 9.45, openings: [
      { at: 0.90, w: 2.16, type: 'opening' },
    ] },
    { x0: 0, y0: 6.20, x1: 3.00, y1: 6.20 },
    { x0: 0, y0: 4.60, x1: 3.00, y1: 4.60 },
    { x0: 0, y0: 1.70, x1: 3.00, y1: 1.70 },
    { x0: 6.16, y0: 3.20, x1: 9.35, y1: 3.20 },
    // Master bedroom south wall. Two gaps, no quarter-circle, so they stay openings.
    { x0: 6.16, y0: 7.40, x1: 9.35, y1: 7.40, openings: [
      { at: 0.54, w: 0.60, type: 'opening' },
      { at: 2.46, w: 0.60, type: 'opening' },
    ] },
    // Master bath partition. Grey arc hinges on the south jamb and swings east into the bath.
    { x0: 7.38, y0: 3.20, x1: 7.38, y1: 7.40, openings: [
      { at: 0.50, w: 0.80, type: 'door', hinge: 'start', swing: -1 },
    ] },
  ],
  furniture: [
    ['Bed2_Bed', 1.40, 7.85, 2, 0.85, 0.75],
    ['Bed2_Wardrobe', 2.20, 6.55, 0, 0.70, 0.50],
    ['TV_Unit', 3.40, 7.80, 2, 0.65, 0.80],
    ['Coffee_Table', 4.55, 7.70, 0, 0.55, 0.55],
    ['Sofa', 5.40, 7.85, 0, 0.75, 0.80],
    // Master bedroom, head on the north wall.
    ['Master_Bed', 7.75, 8.50, 1, 0.75, 0.70],
    ['Bath1_Shower', 0.50, 5.60, 0, 0.50, 0.60],
    ['Bath1_Vanity', 2.35, 5.30, 1, 0.60, 0.50],
    ['Bath1_Toilet', 1.40, 5.10, 0, 0.45, 0.50],
    ['Dining_Table', 4.70, 4.90, 1, 0.75, 0.95],
    ['Dining_Chair_L1', 4.00, 5.40, 1],
    ['Dining_Chair_L2', 4.70, 5.40, 1],
    ['Dining_Chair_L3', 5.40, 5.40, 1],
    ['Dining_Chair_R1', 4.00, 4.40, 1],
    ['Dining_Chair_R2', 4.70, 4.40, 1],
    ['Dining_Chair_R3', 5.40, 4.40, 1],
    // Master bath
    ['MBath_Shower', 7.85, 5.55, 0, 0.55, 0.60],
    ['MBath_Vanity', 8.95, 4.70, 0, 0.55, 0.50],
    ['MBath_Toilet', 8.20, 3.70, 1, 0.45, 0.50],
    ['Bath1_Shower', 0.50, 4.05, 2, 0.50, 0.55],
    ['Bath1_Vanity', 2.35, 3.50, 1, 0.60, 0.50],
    ['Bath1_Toilet', 1.40, 3.20, 0, 0.45, 0.50],
    // Bedroom 3 — head on the west wall, wardrobe on the south wall.
    ['Bed1_Bed', 1.45, 0.90, 2, 0.80, 0.70],
    ['Bed1_Wardrobe', 2.30, 0.40, 0, 0.65, 0.45],
    // Kitchen along the south and west walls; washer in the utility corner.
    ['Kitchen_Run', 4.00, 0.45, 0, 0.80, 0.50],
    ['Kitchen_Run', 3.40, 1.50, 1, 0.65, 0.45],
    ['Fridge', 4.70, 0.55, 0, 0.55, 0.55],
    ['Shoe_Cabinet', 7.60, 1.40, 0, 0.70, 0.55],
    ['Yard_Washer', 5.40, 1.50, 0, 0.55, 0.55],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-2.0, -2.4, 14], tgt: [4.6, 4.6, 0.4], fov: 36 },
    { id: 'plan', name: 'Plan', pos: [4.7, 4.7, 18], tgt: [4.7, 4.7, 0], fov: 36 },
  ],
};
