// Quartz Queensville Type A — 702 sqft, 2 bedrooms, 2 bathrooms.
// Printed 8500 mm arrow spans the outer centreline ticks at px 147.5 and
// 1039.5; the 8495 mm arrow spans y 162.0 and 1053.5.
//   s = 8.500 / 892 m/px
// Origin is the south-west outer centre. +x right, +y toward the balcony.
// A hinged leaf is placed only where a quarter-circle swing is drawn.
// This sheet has no pink hammer.
window.UNIT = {
  id: 'type-a',
  project: 'Quartz Queensville',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type A',
  beds: 2,
  baths: 2,
  sqft: 702,
  sourceUrl: 'https://queensville.com.my/quartz/',
  width: 8.5,
  depth: 8.495,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.2,
  explicitWalls: true,
  rooms: [
    { name: 'BALCONY', c: [7.05, 8.12], box: [5.65, 7.85, 8.35, 8.40] },
    { name: 'MASTER BEDROOM', c: [1.45, 6.85], box: [0.20, 4.20, 2.75, 8.35] },
    { name: 'BEDROOM 1', c: [4.20, 6.85], box: [3.05, 5.35, 5.35, 8.35] },
    { name: 'LIVING', c: [7.05, 6.35], box: [5.70, 5.30, 8.30, 7.55] },
    { name: 'DINING', c: [7.00, 3.55], box: [5.70, 2.65, 8.30, 4.70] },
    { name: 'MASTER BATHROOM', c: [1.35, 3.25], box: [0.20, 2.65, 2.60, 3.90] },
    { name: 'BATHROOM 1', c: [4.10, 3.25], box: [2.95, 2.65, 5.35, 3.90] },
    { name: 'YARD', c: [3.22, 1.25], box: [2.90, 0.25, 3.55, 2.35] },
    { name: 'KITCHEN', c: [5.40, 1.25], box: [3.90, 0.25, 6.95, 2.35] },
    { name: 'FOYER', c: [7.85, 0.40], box: [7.35, 0.12, 8.35, 0.72] },
  ],
  floors: [
    { name: 'BALCONY', box: [5.65, 7.90, 8.35, 8.40] },
    { name: 'MASTER BEDROOM', box: [0.25, 5.40, 2.75, 8.30] },
    { name: 'BEDROOM 1', box: [3.10, 5.40, 5.30, 8.30] },
    { name: 'LIVING', box: [5.70, 5.40, 8.30, 7.55] },
    { name: 'DINING', box: [5.70, 2.70, 8.30, 4.90] },
    { name: 'LIVING', box: [3.70, 4.20, 5.30, 5.00] },
    { name: 'MASTER BATHROOM', box: [0.25, 2.70, 2.60, 3.85] },
    { name: 'BATHROOM 1', box: [2.95, 2.70, 5.30, 3.85] },
    { name: 'YARD', box: [2.95, 0.20, 3.60, 2.35] },
    { name: 'KITCHEN', box: [3.95, 0.20, 7.00, 2.35] },
    { name: 'FOYER', box: [7.40, 0.12, 8.35, 0.70] },
  ],
  walls: [
    // West exterior, from the master-bathroom south wall up to the north wall.
    { x0: 0, y0: 2.512, x1: 0, y1: 8.495 },
    // North wall. Bedroom windows keep a sill; the balcony front is a railing.
    { x0: 0, y0: 8.495, x1: 8.5, y1: 8.495, openings: [
      { at: 0.719, w: 1.811, type: 'window', sill: 0.9, head: 2.1 },
      { at: 3.426, w: 1.801, type: 'window', sill: 0.9, head: 2.1 },
      { at: 6.618, w: 1.763, type: 'window', sill: 1.0, head: 2.1 },
    ] },
    { x0: 8.5, y0: 0, x1: 8.5, y1: 8.495 },
    // South exterior. The notch under the master bathroom starts at the yard wall.
    // Entrance: hinge on the east jamb, arc drawn inside the foyer.
    { x0: 2.773, y0: 0, x1: 8.5, y1: 0, openings: [
      { at: 4.478, w: 1.12, type: 'door', hinge: 'end', swing: -1, kind: 'entry' },
    ] },
    // Yard / bathroom spine. Exterior below the baths, the bath partition above.
    { x0: 2.773, y0: 0, x1: 2.773, y1: 4.016 },
    // Master / bedroom 1 partition. It stops on the header; the door is the pier below.
    { x0: 2.9, y0: 5.165, x1: 2.9, y1: 8.495 },
    // Bedroom 1 / living, above the header and beside bathroom 1.
    { x0: 5.5, y0: 5.165, x1: 5.5, y1: 8.495 },
    { x0: 5.5, y0: 2.512, x1: 5.5, y1: 4.016 },
    // Header under the bedrooms. Bedroom 1 leaf: hinge on the living jamb, swing into the room.
    { x0: 2.9, y0: 5.165, x1: 5.5, y1: 5.165, openings: [
      { at: 1.574, w: 0.905, type: 'door', hinge: 'end', swing: -1 },
    ] },
    // Master door pier. The drawn arc sits on the pier, hinge at its lower end, swing west.
    { x0: 3.492, y0: 4.016, x1: 3.492, y1: 5.165, openings: [
      { at: 0.12, w: 0.86, type: 'door', hinge: 'start', swing: 1 },
    ] },
    // Bath north wall. Both leaves swing south into the bathrooms.
    { x0: 0, y0: 4.016, x1: 5.5, y1: 4.016, openings: [
      { at: 1.80, w: 0.74, type: 'door', hinge: 'end', swing: 1 },
      { at: 3.569, w: 0.858, type: 'door', hinge: 'start', swing: -1 },
    ] },
    { x0: 0, y0: 2.512, x1: 5.5, y1: 2.512 },
    // Balcony / living. The break is the sliding door, drawn without a swing.
    { x0: 5.5, y0: 7.747, x1: 8.5, y1: 7.747, openings: [
      { at: 1.118, w: 1.706, type: 'opening' },
    ] },
    // Yard / kitchen. The dashed arc sits in the yard: hinge on the lower jamb, swing west.
    { x0: 3.77, y0: 0, x1: 3.77, y1: 2.512, openings: [
      { at: 0.77, w: 0.77, type: 'door', hinge: 'start', swing: 1 },
    ] },
    // Foyer screen, and the open mouth into the kitchen.
    { x0: 7.189, y0: 0, x1: 7.189, y1: 0.824 },
    { x0: 7.189, y0: 0.824, x1: 8.5, y1: 0.824, openings: [
      { at: 0.12, w: 1.05, type: 'opening' },
    ] },
  ],
  furniture: [
    ['Master_Bed', 1.45, 6.95, 0, 0.85, 0.95],
    ['Master_Bedside_L', 0.55, 7.55, 0, 0.7, 0.7],
    ['Master_Bedside_R', 2.35, 7.55, 0, 0.7, 0.7],
    ['Master_Wardrobe', 1.35, 5.45, 0, 0.85, 0.7],
    ['Bed2_Bed', 4.15, 6.95, 0, 0.78, 0.95],
    ['Bed2_Bedside', 3.35, 7.45, 0, 0.7, 0.7],
    ['Bed2_Wardrobe', 4.20, 5.50, 0, 0.7, 0.65],
    ['Sofa', 6.15, 6.45, 1, 0.85, 0.9],
    ['Armchair', 6.15, 5.55, 1, 0.8, 0.8],
    ['Coffee_Table', 7.05, 6.35, 0, 0.85, 0.9],
    ['TV_Unit', 8.05, 6.45, 0, 1.15, 0.75],
    ['Dining_Table', 6.90, 3.55, 0, 0.85, 0.9],
    ['Dining_Chair_L1', 6.35, 4.15, 0],
    ['Dining_Chair_L2', 6.90, 4.15, 0],
    ['Dining_Chair_L3', 7.45, 4.15, 0],
    ['Dining_Chair_R1', 6.35, 2.95, 2],
    ['Dining_Chair_R2', 6.90, 2.95, 2],
    ['Dining_Chair_R3', 7.45, 2.95, 2],
    ['MBath_Vanity', 0.55, 2.75, 1, 0.7, 1.3],
    ['MBath_Toilet', 1.55, 2.85, 1, 0.55, 0.85],
    ['MBath_Shower', 2.25, 3.55, 0, 0.7, 0.85],
    ['Bath1_Vanity', 4.85, 2.75, 1, 0.7, 1.2],
    ['Bath1_Toilet', 3.35, 2.85, 1, 0.55, 0.85],
    ['Bath1_Shower', 3.20, 3.55, 0, 0.75, 0.85],
    ['Kitchen_Run', 5.40, 0.48, 0, 0.55, 0.9],
    ['Kitchen_Run', 4.25, 1.30, 1, 0.42, 0.9],
    ['Fridge', 4.60, 1.55, 1, 0.95, 0.9],
    ['Yard_Washer', 3.20, 1.05, 0, 0.9, 0.9],
    ['Shoe_Cabinet', 7.55, 0.40, 0, 0.7, 0.85],
    ['Balcony_Chair_1', 6.40, 8.15, 2, 0.5, 0.5],
    ['Balcony_SideTable', 6.95, 8.15, 0, 0.65, 0.65],
    ['Balcony_Chair_2', 7.50, 8.15, 0, 0.5, 0.5],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-2.2, -2.4, 14], tgt: [4.2, 4.2, 0.4], fov: 34 },
    { id: 'plan', name: 'Plan', pos: [4.25, 4.25, 16], tgt: [4.25, 4.25, 0], fov: 36 },
  ],
};
