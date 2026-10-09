// Sunway Cochrane Type D — 1001 sqft / 93 m²
// Rebuilt from type-d-1001sf.png.
//
// The printed 13130 mm arrow is centred on the outer side walls
// (stroke centres x=925 and x=2075). Depth uses the same scale from the
// north centre (image y=156) to the south centre (image y=925): 8.78 m.
//   sx = 13.130 / (2075 - 925)
// Origin is the south-west outer centre line. +y toward the balcony.
// The hammer is on the wall between bedroom 2 and bedroom 3, so that run
// is solid and hackable.
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
  rooms: [
    { name: 'Master Bedroom', c: [1.45, 5.80], box: [0.12, 2.99, 2.78, 8.66] },
    { name: 'Master Bath', c: [2.05, 1.40], box: [1.32, 0.12, 2.78, 2.75] },
    { name: 'Living', c: [5.40, 6.20], box: [3.02, 4.20, 7.70, 7.66] },
    { name: 'Dining', c: [6.40, 3.40], box: [4.97, 2.20, 7.75, 4.60] },
    { name: 'Kitchen', c: [5.80, 1.15], box: [3.20, 0.12, 7.70, 2.08] },
    { name: 'Foyer', c: [3.60, 0.50], box: [1.40, 0.12, 4.70, 0.95] },
    { name: 'Balcony', c: [5.60, 8.20], box: [3.10, 7.78, 8.20, 8.66] },
    { name: 'Bedroom 2', c: [10.20, 6.80], box: [8.69, 5.18, 11.23, 8.66] },
    { name: 'Bedroom 3', c: [12.20, 3.70], box: [11.47, 2.54, 13.01, 4.94] },
    { name: 'Bath 2', c: [9.00, 3.20], box: [8.32, 2.32, 9.73, 4.90] },
    { name: 'Yard', c: [6.40, 1.10], box: [4.92, 0.12, 8.08, 2.08] },
  ],
  floors: [
    { name: 'Master Bedroom', box: [0.12, 2.99, 2.78, 8.66] },
    { name: 'Master Bath', box: [1.32, 0.12, 2.78, 2.75] },
    { name: 'Living', box: [3.02, 4.20, 7.70, 7.66] },
    { name: 'Dining', box: [4.97, 2.20, 7.75, 4.60] },
    { name: 'Kitchen', box: [3.20, 0.12, 7.70, 2.08] },
    { name: 'Foyer', box: [1.40, 0.12, 4.70, 0.95] },
    { name: 'Balcony', box: [3.10, 7.78, 8.20, 8.66] },
    { name: 'Bedroom 2', box: [8.69, 5.18, 11.23, 8.66] },
    { name: 'Bedroom 3', box: [11.47, 2.54, 13.01, 4.94] },
    { name: 'Bath 2', box: [8.32, 2.32, 9.73, 4.90] },
    { name: 'Yard', box: [4.92, 0.12, 8.08, 2.08] },
  ],
  walls: [
    { x0: 0, y0: 2.87, x1: 0, y1: 8.78 },
    { x0: 0, y0: 8.78, x1: 11.35, y1: 8.78, openings: [
      { at: 0.45, w: 2.25, type: 'window', sill: 0.12, head: 2.1 },
      { at: 3.10, w: 5.30, type: 'window', sill: 0.05, head: 2.1 },
      { at: 8.95, w: 2.10, type: 'window', sill: 0.12, head: 2.1 },
    ] },
    { x0: 11.35, y0: 5.06, x1: 11.35, y1: 8.78 },
    { x0: 11.35, y0: 5.06, x1: 13.13, y1: 5.06, openings: [
      { at: 0.45, w: 1.00, type: 'window', sill: 0.12, head: 2.1 },
    ] },
    { x0: 13.13, y0: 2.42, x1: 13.13, y1: 5.06 },
    { x0: 9.85, y0: 2.42, x1: 13.13, y1: 2.42 },
    { x0: 1.20, y0: 0, x1: 8.20, y1: 0, openings: [
      { at: 2.29, w: 0.90, type: 'door', hinge: 'start', swing: 1, kind: 'entry' },
      { at: 3.19, w: 0.36, type: 'opening' },
    ] },
    { x0: 1.20, y0: 0, x1: 1.20, y1: 2.87 },
    { x0: 0, y0: 2.87, x1: 2.90, y1: 2.87, openings: [
      { at: 2.00, w: 0.75, type: 'door', hinge: 'end', swing: -1 },
    ] },
    { x0: 2.90, y0: 0, x1: 2.90, y1: 8.78, openings: [
      { at: 3.15, w: 0.77, type: 'door', hinge: 'start', swing: 1 },
    ] },
    { x0: 2.90, y0: 7.80, x1: 8.57, y1: 7.80, openings: [
      { at: 1.00, w: 4.20, type: 'window', sill: 0.05, head: 2.1 },
    ] },
    { x0: 8.57, y0: 5.06, x1: 8.57, y1: 8.78 },
    // Bedroom 2 opens to the west. The hammer stretch, from x=9.85, is solid.
    { x0: 8.20, y0: 5.06, x1: 11.35, y1: 5.06, openings: [
      { at: 0, w: 1.65, type: 'opening' },
    ], hackable: [{ at: 1.65, w: 1.50 }] },
    { x0: 4.80, y0: 0, x1: 4.80, y1: 2.20 },
    { x0: 4.80, y0: 2.20, x1: 8.20, y1: 2.20, openings: [
      { at: 1.21, w: 0.90, type: 'door', hinge: 'start', swing: 1 },
    ] },
    { x0: 8.20, y0: 0, x1: 8.20, y1: 5.06, openings: [
      { at: 3.89, w: 1.17, type: 'opening' },
    ] },
    { x0: 9.85, y0: 2.42, x1: 9.85, y1: 5.06, openings: [
      { at: 1.62, w: 1.02, type: 'opening' },
    ] },
  ],
  furniture: [
    ['Master_Bed', 1.40, 6.70, 0, 0.85, 0.9],
    ['Master_Wardrobe', 1.40, 4.60, 0, 0.85, 0.65],
    ['MBath_Shower', 1.70, 2.15, 0],
    ['MBath_Vanity', 1.60, 1.55, 1],
    ['MBath_Toilet', 2.40, 2.10, 1],
    ['Sofa', 3.70, 6.10, 2, 0.95, 0.85],
    ['Coffee_Table', 5.20, 6.10, 0],
    ['TV_Unit', 7.30, 6.20, 0, 0.8, 1],
    ['Dining_Table', 6.30, 3.40, 3, 0.9, 0.75],
    ['Dining_Chair_L1', 5.95, 4.05, 1],
    ['Dining_Chair_R1', 6.65, 4.05, 3],
    ['Dining_Chair_L2', 5.95, 2.75, 3],
    ['Dining_Chair_R2', 6.65, 2.75, 1],
    ['Kitchen_Run', 5.40, 0.42, 0, 0.55, 1],
    ['Fridge', 4.00, 1.30, 1],
    ['Bed1_Bed', 10.10, 7.20, 2, 0.85, 0.75],
    ['Bed1_Wardrobe', 8.95, 5.55, 1, 0.75, 0.7],
    ['Bed2_Bed', 12.20, 3.80, 1, 0.8, 0.75],
    ['Bed2_Wardrobe', 11.70, 2.85, 0, 0.7, 0.7],
    ['Bath1_Shower', 8.70, 3.40, 0],
    ['Bath1_Vanity', 9.20, 2.80, 1],
    ['Bath1_Toilet', 9.40, 3.70, 3],
    ['Yard_Washer', 8.60, 1.00, 0],
    ['Shoe_Cabinet', 2.20, 0.45, 1],
    ['Balcony_Plant_1', 4.00, 8.20, 0, 0.6, 0.6],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-2.2, -3.4, 17.5], tgt: [6.4, 4.2, 0.4], fov: 32 },
    { id: 'plan', name: 'Plan', pos: [6.56, 4.39, 20], tgt: [6.56, 4.39, 0], fov: 40 },
    { id: 'living', name: 'Living', pos: [5.4, 4.6, 1.45], tgt: [5.5, 6.6, 0.9], hfov: 78 },
    { id: 'master', name: 'Master bedroom', pos: [1.4, 4.8, 1.45], tgt: [1.4, 6.6, 0.9], hfov: 78 },
  ],
};
