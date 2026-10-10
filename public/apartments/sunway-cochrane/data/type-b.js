// Sunway Cochrane Type B — 732 sqft / 68 m²
// Rebuilt from type-b-732sf.png on the same centreline-run format as Type A.
//
// The printed 8900 mm arrow is centred on the outer side walls
// (stroke centres x=1031.5 and x=1806.5). No separate depth arrow is printed;
// the drawing is square, so one scale is used for both axes.
//   sx = 8.900 / (1806.5 - 1031.5)
// Origin is the bottom-left of the outer centre lines that do exist: the south
// wall centre (image y=944) and the west wall (image x=1031.5). +y toward the balcony.
// The hammer sits on the master / bedroom 2 partition, so that run is solid
// and hackable. The arc drawn on it is not a door.
window.UNIT = {
  id: 'type-b',
  project: 'Sunway Cochrane',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type B',
  beds: 2,
  baths: 2,
  sqft: 732,
  sourceUrl: 'https://assets.sunwayproperty.com/2026/03/Sunway-Cochrane-Brochure.pdf',
  width: 8.90,
  depth: 9.17,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.20,
  explicitWalls: true,
  rooms: [
    { name: 'Master Bedroom', c: [1.45, 6.20], box: [0.12, 3.77, 2.79, 7.97] },
    { name: 'Bedroom 2', c: [4.25, 6.40], box: [3.03, 4.87, 5.53, 7.97] },
    { name: 'Living', c: [7.25, 6.40], box: [5.77, 4.60, 8.78, 7.97] },
    { name: 'Dining', c: [7.20, 3.20], box: [5.77, 2.17, 8.78, 4.50] },
    { name: 'Master Bath', c: [1.45, 2.85], box: [0.12, 2.17, 2.79, 3.53] },
    { name: 'Bath 2', c: [4.25, 2.85], box: [3.03, 2.17, 5.53, 3.53] },
    { name: 'Hall', c: [4.20, 4.20], box: [3.03, 3.77, 5.53, 4.63] },
    { name: 'Kitchen', c: [5.20, 1.05], box: [3.82, 0.12, 6.80, 1.93] },
    { name: 'Foyer', c: [7.90, 0.35], box: [7.07, 0.12, 8.78, 0.58] },
    { name: 'Balcony', c: [7.50, 8.65], box: [6.45, 8.21, 8.78, 9.10] },
    { name: 'A/C ledge', c: [5.75, 8.65], box: [5.28, 8.21, 6.22, 9.10] },
  ],
  floors: [
    { name: 'Master Bedroom', box: [0.12, 3.77, 2.79, 7.97] },
    { name: 'Bedroom 2', box: [3.03, 4.87, 5.53, 7.97] },
    { name: 'Living', box: [5.77, 4.60, 8.78, 7.97] },
    { name: 'Dining', box: [5.77, 2.17, 8.78, 4.50] },
    { name: 'Master Bath', box: [0.12, 2.17, 2.79, 3.53] },
    { name: 'Bath 2', box: [3.03, 2.17, 5.53, 3.53] },
    { name: 'Hall', box: [3.03, 3.77, 5.53, 4.63] },
    { name: 'Kitchen', box: [3.82, 0.12, 6.80, 1.93] },
    { name: 'Foyer', box: [7.07, 0.12, 8.78, 0.58] },
    { name: 'Balcony', box: [6.45, 8.21, 8.78, 9.10] },
    { name: 'A/C ledge', box: [5.28, 8.21, 6.22, 9.10] },
  ],
  walls: [
    { x0: 0, y0: 2.05, x1: 0, y1: 8.09 },
    { x0: 0, y0: 8.09, x1: 8.90, y1: 8.09, openings: [
      { at: 0.37, w: 2.31, type: 'window', sill: 0.12, head: 2.1 },
      { at: 3.13, w: 1.70, type: 'window', sill: 0.12, head: 2.1 },
      { at: 6.51, w: 2.09, type: 'window', sill: 0.12, head: 2.1 },
    ] },
    { x0: 8.90, y0: 0, x1: 8.90, y1: 9.17 },
    { x0: 5.16, y0: 9.17, x1: 8.90, y1: 9.17 },
    { x0: 5.16, y0: 8.09, x1: 5.16, y1: 9.17 },
    { x0: 6.38, y0: 8.09, x1: 6.38, y1: 9.17 },
    // Hammer wall between the master and bedroom 2. The arc is not a door.
    { x0: 2.91, y0: 4.78, x1: 2.91, y1: 8.09, hackable: true },
    // Bedroom 2's south wall stops at the doorway into the hall.
    { x0: 2.91, y0: 4.78, x1: 5.65, y1: 4.78, openings: [
      { at: 1.69, w: 0.77, type: 'door', hinge: 'end', swing: -1 },
    ] },
    { x0: 5.65, y0: 2.05, x1: 5.65, y1: 8.09, openings: [
      { at: 1.67, w: 0.95, type: 'door', hinge: 'start', swing: 1 },
    ] },
    { x0: 0, y0: 3.65, x1: 5.65, y1: 3.65, openings: [
      { at: 1.95, w: 0.75, type: 'door', hinge: 'end', swing: 1 },
      { at: 3.77, w: 0.67, type: 'door', hinge: 'end', swing: 1 },
    ] },
    { x0: 0, y0: 2.05, x1: 5.65, y1: 2.05 },
    { x0: 2.91, y0: 2.05, x1: 2.91, y1: 3.65 },
    { x0: 4.65, y0: 2.05, x1: 4.65, y1: 3.65 },
    { x0: 3.70, y0: 0, x1: 3.70, y1: 2.05 },
    { x0: 3.22, y0: 0, x1: 3.22, y1: 0.55 },
    { x0: 3.22, y0: 0.55, x1: 3.70, y1: 0.55 },
    { x0: 3.22, y0: 0, x1: 8.90, y1: 0, openings: [
      { at: 3.86, w: 0.78, type: 'door', hinge: 'start', swing: 1, kind: 'entry' },
    ] },
    { x0: 6.95, y0: 0, x1: 6.95, y1: 0.70 },
    { x0: 6.95, y0: 0.70, x1: 8.90, y1: 0.70, openings: [
      { at: 0.40, w: 0.90, type: 'door', hinge: 'start', swing: 1 },
    ] },
  ],
  furniture: [
    ['Master_Bed', 1.40, 6.55, 0, 0.88, 0.92],
    ['Master_Wardrobe', 1.40, 4.15, 0, 0.85, 0.7],
    ['MBath_Shower', 0.70, 2.85, 0],
    ['MBath_Vanity', 1.70, 2.40, 1],
    ['MBath_Toilet', 2.40, 2.70, 1],
    ['Bed1_Bed', 4.20, 6.70, 2, 0.85, 0.7],
    ['Bed1_Wardrobe', 3.55, 5.15, 0, 0.8, 0.75],
    ['Bath1_Shower', 3.55, 2.85, 0],
    ['Bath1_Vanity', 4.40, 2.40, 1],
    ['Bath1_Toilet', 5.10, 2.70, 1],
    ['Sofa', 6.25, 6.40, 2, 1, 0.9],
    ['Coffee_Table', 7.30, 6.40, 0],
    ['TV_Unit', 8.55, 6.40, 0],
    ['Dining_Table', 7.15, 3.20, 3, 1, 0.7],
    ['Dining_Chair_L1', 6.80, 3.85, 1],
    ['Dining_Chair_R1', 7.50, 3.85, 3],
    ['Dining_Chair_L2', 6.80, 2.55, 3],
    ['Dining_Chair_R2', 7.50, 2.55, 1],
    ['Kitchen_Run', 5.20, 0.42, 0, 0.45, 1],
    ['Fridge', 4.20, 1.30, 1],
    ['Shoe_Cabinet', 8.40, 0.40, 0],
    ['Balcony_Plant_1', 8.20, 8.65, 0, 0.55, 0.55],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-1.6, -3.4, 15], tgt: [4.4, 4.3, 0.4], fov: 32 },
    { id: 'plan', name: 'Plan', pos: [4.45, 4.61, 18], tgt: [4.45, 4.61, 0], fov: 38 },
    { id: 'living', name: 'Living', pos: [7.2, 3.6, 1.45], tgt: [7.2, 6.4, 0.9], hfov: 78 },
    { id: 'master', name: 'Master bedroom', pos: [1.4, 4.4, 1.45], tgt: [1.4, 6.4, 0.9], hfov: 78 },
  ],
};
