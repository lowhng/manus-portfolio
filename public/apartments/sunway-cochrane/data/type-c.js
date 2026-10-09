// Sunway Cochrane Type C — 872 sqft / 81 m²
// Rebuilt from type-c-872sf.png.
//
// The printed 11100 mm arrow is centred on the outer side walls
// (stroke centres x=880 and x=1847). Depth is the same scale from the
// north centre (image y=153) to the south centre (image y=824): 7.70 m.
//   sx = 11.100 / (1847 - 880)
// Origin is the south-west outer centre line. +y toward the balcony.
// The hammer is on bedroom 2's south wall. That run is hackable, and the
// study bay on the right projects past the 11100 arrow.
window.UNIT = {
  id: 'type-c',
  project: 'Sunway Cochrane',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type C',
  beds: '2+1',
  baths: 2,
  sqft: 872,
  sourceUrl: 'https://assets.sunwayproperty.com/2026/03/Sunway-Cochrane-Brochure.pdf',
  width: 12.20,
  depth: 7.70,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.20,
  explicitWalls: true,
  rooms: [
    { name: 'Master Bedroom', c: [1.45, 5.55], box: [0.12, 3.56, 2.77, 7.58] },
    { name: 'Master Bath', c: [1.45, 2.55], box: [0.12, 1.86, 2.77, 3.32] },
    { name: 'Living', c: [5.50, 5.40], box: [3.01, 3.80, 8.18, 6.58] },
    { name: 'Dining', c: [5.20, 3.10], box: [3.01, 2.20, 7.70, 3.80] },
    { name: 'Kitchen', c: [4.60, 1.10], box: [2.54, 0.12, 6.70, 2.08] },
    { name: 'Foyer', c: [7.40, 0.40], box: [6.40, 0.12, 8.50, 0.68] },
    { name: 'Balcony', c: [5.40, 7.20], box: [3.10, 6.82, 8.18, 7.58] },
    { name: 'Bedroom 2', c: [9.70, 5.80], box: [8.42, 4.11, 10.98, 7.58] },
    { name: 'Study', c: [10.30, 2.70], box: [9.62, 1.54, 10.98, 3.87] },
    { name: 'Bath 2', c: [8.65, 2.20], box: [7.95, 1.54, 9.38, 2.87] },
  ],
  floors: [
    { name: 'Master Bedroom', box: [0.12, 3.56, 2.77, 7.58] },
    { name: 'Master Bath', box: [0.12, 1.86, 2.77, 3.32] },
    { name: 'Living', box: [3.01, 3.80, 8.18, 6.58] },
    { name: 'Dining', box: [3.01, 2.20, 7.70, 3.80] },
    { name: 'Kitchen', box: [2.54, 0.12, 6.70, 2.08] },
    { name: 'Foyer', box: [6.40, 0.12, 8.50, 0.68] },
    { name: 'Balcony', box: [3.10, 6.82, 8.18, 7.58] },
    { name: 'Bedroom 2', box: [8.42, 4.11, 10.98, 7.58] },
    { name: 'Study', box: [9.62, 1.54, 10.98, 3.87] },
    { name: 'Bath 2', box: [7.95, 1.54, 9.38, 2.87] },
  ],
  walls: [
    { x0: 0, y0: 1.74, x1: 0, y1: 7.70 },
    { x0: 0, y0: 7.70, x1: 11.10, y1: 7.70, openings: [
      { at: 0.40, w: 2.25, type: 'window', sill: 0.12, head: 2.1 },
      { at: 3.05, w: 5.05, type: 'window', sill: 0.05, head: 2.1 },
      { at: 8.55, w: 2.20, type: 'window', sill: 0.12, head: 2.1 },
    ] },
    { x0: 11.10, y0: 3.99, x1: 11.10, y1: 7.70 },
    // Study bay, past the printed 11100 arrow.
    { x0: 11.10, y0: 3.99, x1: 12.20, y1: 3.99 },
    { x0: 12.20, y0: 1.42, x1: 12.20, y1: 3.99 },
    { x0: 9.47, y0: 1.42, x1: 12.20, y1: 1.42 },
    { x0: 2.42, y0: 0, x1: 9.47, y1: 0, openings: [
      { at: 3.68, w: 0.30, type: 'opening' },
      { at: 3.98, w: 0.90, type: 'door', hinge: 'start', swing: 1, kind: 'entry' },
      { at: 4.88, w: 0.53, type: 'opening' },
    ] },
    { x0: 2.42, y0: 0, x1: 2.42, y1: 0.63 },
    { x0: 2.42, y0: 0.63, x1: 2.89, y1: 0.63 },
    { x0: 0, y0: 1.74, x1: 2.89, y1: 1.74 },
    { x0: 0, y0: 3.48, x1: 2.89, y1: 3.48, openings: [
      { at: 1.91, w: 0.85, type: 'door', hinge: 'end', swing: -1 },
    ] },
    { x0: 2.89, y0: 0, x1: 2.89, y1: 7.70, openings: [
      { at: 3.67, w: 0.77, type: 'door', hinge: 'start', swing: 1 },
    ] },
    { x0: 2.89, y0: 6.70, x1: 8.30, y1: 6.70, openings: [
      { at: 0.70, w: 3.80, type: 'window', sill: 0.05, head: 2.1 },
    ] },
    { x0: 8.30, y0: 3.99, x1: 8.30, y1: 7.70 },
    // Hammer on bedroom 2's south wall. The gap beside it is an opening, not a door.
    { x0: 8.30, y0: 3.99, x1: 11.10, y1: 3.99, openings: [
      { at: 0.05, w: 1.05, type: 'opening' },
    ], hackable: [{ at: 1.10, w: 1.70 }] },
    { x0: 7.87, y0: 0, x1: 7.87, y1: 2.80 },
    { x0: 7.87, y0: 2.80, x1: 9.47, y1: 2.80, openings: [
      { at: 0.75, w: 0.70, type: 'door', hinge: 'start', swing: -1 },
    ] },
    { x0: 9.47, y0: 0, x1: 9.47, y1: 2.80 },
    { x0: 7.87, y0: 1.00, x1: 9.47, y1: 1.00, openings: [
      { at: 0.55, w: 0.78, type: 'door', hinge: 'end', swing: 1 },
    ] },
  ],
  furniture: [
    ['Master_Bed', 1.40, 5.80, 0, 0.85, 0.9],
    ['Master_Wardrobe', 1.40, 3.85, 0, 0.8, 0.65],
    ['MBath_Shower', 0.70, 2.55, 0],
    ['MBath_Vanity', 1.60, 2.10, 1],
    ['MBath_Toilet', 2.35, 2.45, 1],
    ['Sofa', 3.70, 5.30, 2, 0.95, 0.85],
    ['Coffee_Table', 5.10, 5.30, 0],
    ['TV_Unit', 7.70, 5.40, 0, 0.85, 1],
    ['Dining_Table', 5.20, 3.05, 3, 0.9, 0.7],
    ['Dining_Chair_L1', 4.85, 3.65, 1],
    ['Dining_Chair_R1', 5.55, 3.65, 3],
    ['Dining_Chair_L2', 4.85, 2.45, 3],
    ['Dining_Chair_R2', 5.55, 2.45, 1],
    ['Kitchen_Run', 4.50, 0.42, 0, 0.5, 1],
    ['Fridge', 3.10, 1.20, 1],
    ['Bed1_Bed', 9.60, 6.40, 2, 0.85, 0.7],
    ['Bed1_Wardrobe', 8.80, 4.45, 1, 0.75, 0.7],
    ['Master_Desk', 10.30, 3.20, 0],
    ['Master_DeskChair', 10.30, 2.55, 0],
    ['Bath1_Shower', 8.30, 2.20, 0],
    ['Bath1_Vanity', 8.70, 1.75, 1],
    ['Bath1_Toilet', 9.15, 2.20, 3],
    ['Shoe_Cabinet', 8.20, 0.40, 0],
    ['Balcony_Plant_1', 4.20, 7.20, 0, 0.6, 0.6],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-1.8, -2.8, 15.5], tgt: [5.5, 3.7, 0.4], fov: 32 },
    { id: 'plan', name: 'Plan', pos: [5.55, 3.85, 18], tgt: [5.55, 3.85, 0], fov: 40 },
    { id: 'living', name: 'Living', pos: [5.4, 3.2, 1.45], tgt: [5.5, 5.6, 0.9], hfov: 78 },
    { id: 'master', name: 'Master bedroom', pos: [1.4, 4.0, 1.45], tgt: [1.4, 5.8, 0.9], hfov: 78 },
  ],
};
