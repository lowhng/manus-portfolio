// Aster Residence Type D — duplex, 1,009 sqft, 3 bedrooms, 2 baths + powder.
// Both floors are on one sheet and share this scale. No millimetre arrow.
// Each floor's outer wall-centre rectangle is about half of 1,009 sqft
// (s = 0.0084 m/px). Origin is the south-west outer centre of either
// plan, so the upper floor stacks on the lower. +y toward the top of
// each plan (foyer on the lower floor). No pink hammer.
// The stair is drawn on the lower floor. The upper floor leaves a void
// in the slab over that box. Level chips live in the shared viewer.
window.UNIT = {
  id: 'type-d',
  project: 'Aster Residence',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type D',
  beds: 3,
  baths: '2+1',
  sqft: 1009,
  sourceUrl: 'https://www.amberhomes.com.my/home/project/aster-residence/',
  width: 6.20,
  depth: 7.70,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.18,
  explicitWalls: true,
  rooms: [
    { name: 'Foyer', level: 'lower', c: [1.70, 6.90], box: [0.30, 6.30, 3.20, 7.50] },
    { name: 'Bath 1', level: 'lower', c: [4.20, 6.80], box: [3.40, 6.20, 5.40, 7.50] },
    { name: 'Kitchen', level: 'lower', c: [1.20, 5.30], box: [0.25, 4.30, 2.50, 6.20] },
    { name: 'Dining', level: 'lower', c: [1.30, 3.20], box: [0.25, 2.20, 2.50, 4.20] },
    { name: 'Living', level: 'lower', c: [1.40, 1.10], box: [0.25, 0.20, 2.80, 2.00] },
    { name: 'Master Bedroom', level: 'lower', c: [4.50, 1.30], box: [3.20, 0.20, 6.00, 2.60] },
    { name: 'Bedroom 3', level: 'upper', c: [1.35, 6.55], box: [0.25, 5.60, 2.50, 7.50] },
    { name: 'Storage Room', level: 'upper', c: [4.60, 6.90], box: [3.80, 6.40, 5.40, 7.40] },
    { name: 'Bedroom 2', level: 'upper', c: [4.20, 1.10], box: [2.90, 0.20, 5.50, 2.00] },
    { name: 'Bath 2', level: 'upper', c: [5.40, 3.30], box: [4.80, 2.40, 6.05, 4.30] },
  ],
  walls: [],
  floors: [],
  furniture: [],
  levels: [
    {
      id: 'lower',
      name: 'Lower',
      stair: { box: [2.90, 4.10, 4.40, 5.70] },
      floors: [
        { name: 'Foyer', box: [0, 6.20, 2.70, 7.70] },
        { name: 'Bath 1', box: [3.68, 6.20, 6.20, 7.70] },
        { name: 'Kitchen', box: [0, 3.98, 2.70, 6.20] },
        { name: 'Dining', box: [0, 2.20, 2.70, 3.98] },
        { name: 'Living', box: [0, 0, 2.70, 2.20] },
        { name: 'Master Bedroom', box: [2.70, 0, 6.20, 2.86] },
        { name: 'Stair', box: [2.70, 2.86, 5.61, 6.20] },
      ],
      plan: {
        file: 'type-d-duplex-1009sf.jpg',
        ox: 465,
        oy: 1047,
        mx: 6.20 / 735,
        my: 6.20 / 735,
      },
      walls: [
        { x0: 0, y0: 0, x1: 6.20, y1: 0, openings: [
          { at: 3.40, w: 1.60, type: 'window', sill: 0.9, head: 2.1 },
        ] },
        { x0: 6.20, y0: 0, x1: 6.20, y1: 7.70 },
        { x0: 0, y0: 7.70, x1: 6.20, y1: 7.70, openings: [
          { at: 0, w: 0.90, type: 'door', hinge: 'start', swing: -1, kind: 'entry' },
          { at: 0.90, w: 1.74, type: 'window', sill: 0.9, head: 2.1 },
          { at: 3.75, w: 0.94, type: 'window', sill: 0.9, head: 2.1 },
          { at: 4.86, w: 0.52, type: 'window', sill: 0.9, head: 2.1 },
          { at: 5.68, w: 0.52, type: 'window', sill: 0.9, head: 2.1 },
        ] },
        { x0: 0, y0: 0, x1: 0, y1: 7.70 },
        { x0: 2.70, y0: 0, x1: 2.70, y1: 7.70, openings: [
          { at: 4.03, w: 1.70, type: 'opening', noDoor: 'open-plan arch', ambiguous: true },
        ] },
        { x0: 2.70, y0: 5.20, x1: 4.75, y1: 5.20 },
        { x0: 3.68, y0: 5.20, x1: 3.68, y1: 7.70 },
        // Bath door. Hinge on the south jamb, swing west into the bath.
        { x0: 4.75, y0: 3.98, x1: 4.75, y1: 7.70, openings: [
          { at: 1.74, w: 0.70, type: 'door', hinge: 'start', swing: 1 },
        ] },
        { x0: 5.61, y0: 0, x1: 5.61, y1: 7.70, openings: [
          { at: 2.91, w: 2.40, type: 'window', sill: 0.9, head: 2.1 },
        ] },
        { x0: 0, y0: 6.41, x1: 2.70, y1: 6.41 },
        { x0: 3.68, y0: 6.67, x1: 4.75, y1: 6.67 },
        { x0: 4.75, y0: 5.47, x1: 6.20, y1: 5.47 },
        { x0: 2.70, y0: 3.98, x1: 4.75, y1: 3.98, openings: [
          { at: 1.05, w: 0.78, type: 'door', hinge: 'start', swing: -1 },
        ] },
        { x0: 5.61, y0: 2.86, x1: 6.20, y1: 2.86 },
        { x0: 0, y0: 2.20, x1: 2.70, y1: 2.20, openings: [
          { at: 0.40, w: 0.85, type: 'door', hinge: 'start', swing: 1, ambiguous: true },
        ] },
      ],
      furniture: [
        ['Shoe_Cabinet', 1.30, 7.494, 2, 0.70, 0.55],
        ['Bath1_Vanity', 3.934, 7.25, 2, 0.60, 0.45],
        ['Bath1_Toilet', 5.340, 6.85, 0, 0.45, 0.50],
        ['Kitchen_Run', 0.249, 5.20, 1, 0.415, 0.45],
        ['Kitchen_Run', 1.20, 6.176, 2, 0.332, 0.40],
        ['Fridge', 2.30, 6.098, 2, 0.55, 0.55],
        ['Dining_Table', 1.25, 3.10, 0, 0.70, 0.75],
        ['Dining_Chair_L1', 0.65, 3.50, 1],
        ['Dining_Chair_R1', 1.85, 3.50, 3],
        ['Dining_Chair_L2', 0.65, 2.70, 1],
        ['Dining_Chair_R2', 1.85, 2.70, 3],
        ['Sofa', 1.50, 1.20, 2, 0.75, 0.70],
        ['Coffee_Table', 2.20, 1.20, 0, 0.50, 0.50],
        ['TV_Unit', 0.90, 0.200, 1, 0.45, 0.70],
        ['Master_Bed', 4.20, 0.986, 3, 0.80, 0.75],
        // East wall of the bedroom, long north-south, front west.
        ['Master_Wardrobe', 5.344, 1.40, 2, 0.50, 0.85],
        ['Master_Bedside_L', 3.40, 1.90, 0, 0.50, 0.50],
        ['Master_Bedside_R', 4.70, 1.50, 0, 0.50, 0.50],
      ],
    },
    {
      id: 'upper',
      name: 'Upper',
      plan: {
        file: 'type-d-duplex-1009sf.jpg',
        ox: 465,
        oy: 2324,
        mx: 6.20 / 735,
        my: 6.20 / 735,
      },
      voids: [{ box: [2.90, 4.10, 4.40, 5.70] }],
      floors: [
        { name: 'Bedroom 3', box: [0, 5.40, 2.70, 7.70] },
        { name: 'Storage Room', box: [2.70, 6.20, 6.20, 7.70] },
        { name: 'Bedroom', box: [0, 0, 2.70, 3.62] },
        { name: 'Hall', box: [0, 3.62, 2.70, 5.40] },
        { name: 'Bedroom 2', box: [2.70, 0, 5.61, 2.18] },
        { name: 'Bath 2', box: [4.69, 2.18, 6.20, 4.48] },
        { name: 'Hall', box: [2.70, 2.18, 4.69, 6.20] },
      ],
      walls: [
        { x0: 0, y0: 0, x1: 6.20, y1: 0, openings: [
          { at: 0.40, w: 1.40, type: 'window' },
          { at: 3.60, w: 1.40, type: 'window' },
        ] },
        { x0: 6.20, y0: 0, x1: 6.20, y1: 7.70 },
        { x0: 0, y0: 7.70, x1: 6.20, y1: 7.70, openings: [
          { at: 1.00, w: 1.40, type: 'window' },
        ] },
        { x0: 0, y0: 0, x1: 0, y1: 7.70 },
        { x0: 2.70, y0: 0, x1: 2.70, y1: 7.70, openings: [
          { at: 2.18, w: 0.87, type: 'door', hinge: 'start', swing: 1, ambiguous: true },
          { at: 3.75, w: 0.78, type: 'door', hinge: 'start', swing: 1 },
        ] },
        // Bath door. Hinge on the south jamb, swing east into the bath.
        { x0: 4.69, y0: 2.18, x1: 4.69, y1: 7.70, openings: [
          { at: 0.47, w: 0.68, type: 'door', hinge: 'start', swing: -1 },
        ] },
        { x0: 5.61, y0: 0, x1: 5.61, y1: 7.70, openings: [
          { at: 2.04, w: 3.20, type: 'opening', noDoor: 'open-plan arch', ambiguous: true },
        ] },
        { x0: 0, y0: 6.41, x1: 2.70, y1: 6.41, openings: [
          { at: 0.30, w: 0.80, type: 'door', hinge: 'start', swing: -1, ambiguous: true },
        ] },
        { x0: 2.70, y0: 6.06, x1: 4.69, y1: 6.06 },
        { x0: 4.69, y0: 4.48, x1: 6.20, y1: 4.48 },
        // West door swings north into the hall. Eastern door swings south into Bedroom 2.
        { x0: 0, y0: 3.62, x1: 4.69, y1: 3.62, openings: [
          { at: 1.78, w: 0.87, type: 'door', hinge: 'start', swing: 1 },
          { at: 3.33, w: 0.78, type: 'door', hinge: 'start', swing: -1 },
        ] },
        { x0: 4.70, y0: 2.18, x1: 6.20, y1: 2.18 },
      ],
      furniture: [
        ['Sofa', 1.30, 7.05, 2, 0.70, 0.40],
        ['Coffee_Table', 1.35, 5.90, 0, 0.50, 0.50],
        ['TV_Unit', 2.500, 7.05, 0, 0.45, 0.45],
        ['Bed1_Bed', 1.30, 2.634, 3, 0.80, 0.75],
        ['Bed1_Wardrobe', 0.344, 2.40, 1, 0.50, 0.75],
        ['Bed2_Bedside', 3.40, 1.20, 0, 0.50, 0.50],
        ['Bed2_Bed', 4.10, 0.931, 1, 0.75, 0.70],
        ['Bed2_Wardrobe', 5.297, 1.20, 3, 0.45, 0.65],
        ['Bath1_Shower', 5.20, 4.166, 0, 0.50, 0.55],
        ['Bath1_Vanity', 4.932, 2.60, 2, 0.55, 0.45],
        ['Bath1_Toilet', 5.35, 2.450, 1, 0.45, 0.50],
      ],
    },
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-2.2, -2.6, 12], tgt: [3.1, 3.6, 1.6], fov: 38 },
    { id: 'plan', name: 'Plan', pos: [3.1, 3.8, 16], tgt: [3.1, 3.8, 1.2], fov: 36 },
    { id: 'lower', name: 'Lower', pos: [-1.6, -2.0, 11], tgt: [3.1, 3.6, 0.4], fov: 36 },
    { id: 'upper', name: 'Upper', pos: [-1.6, -2.0, 11], tgt: [3.1, 3.6, 3.2], fov: 36 },
  ],
};
