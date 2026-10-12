// Quartz Queensville Type A — 702 sqft, 2 bedrooms, 2 bathrooms.
// Printed 8500 mm arrow spans the outer centreline ticks at px 147.5 and
// 1039.5; the 8495 mm arrow spans y 162.0 and 1053.5.
//   s = 8.500 / 892 m/px
// Origin is the south-west outer centre. +x right, +y toward the balcony.
// A hinged leaf is placed only where a quarter-circle swing is drawn.
// The balcony front is a parapet; the living walk-out is a two-panel slider.
// The foyer screen is open to the kitchen (no second swing). This sheet has no pink hammer.
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
  // Image pixel of world (0, 0). mx, my are metres per pixel; image +y is down.
  plan: {
    file: 'type-a-702sf.png',
    ox: 147.5,
    oy: 1053.5,
    mx: 8.500 / 892,
    my: 8.495 / (1053.5 - 162.0),
  },
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
    // North wall. Bedroom windows keep a sill. The balcony front is a railing.
    { x0: 0, y0: 8.495, x1: 8.5, y1: 8.495, openings: [
      { at: 0.719, w: 1.811, type: 'window', sill: 0.9, head: 2.1 },
      { at: 3.426, w: 1.801, type: 'window', sill: 0.9, head: 2.1 },
      { at: 6.63, w: 1.74, type: 'rail', h: 1.05 },
    ] },
    { x0: 8.5, y0: 0, x1: 8.5, y1: 8.495 },
    // South exterior. The notch under the master bathroom starts at the yard wall.
    // Entrance: hinge on the east jamb, arc drawn inside the foyer.
    { x0: 2.773, y0: 0, x1: 8.5, y1: 0, openings: [
      { at: 4.457, w: 1.14, type: 'door', hinge: 'end', swing: -1, kind: 'entry' },
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
      { at: 1.58, w: 0.89, type: 'door', hinge: 'end', swing: -1 },
    ] },
    // Master door pier. Arc in the bedroom, hinge on the upper jamb, swing west.
    { x0: 3.492, y0: 4.016, x1: 3.492, y1: 5.165, openings: [
      { at: 0.134, w: 0.89, type: 'door', hinge: 'end', swing: -1 },
    ] },
    // Bath north wall. Both arcs sit in the bathrooms, hinge on the east jamb.
    { x0: 0, y0: 4.016, x1: 5.5, y1: 4.016, openings: [
      { at: 1.86, w: 0.78, type: 'door', hinge: 'end', swing: 1 },
      { at: 3.64, w: 0.78, type: 'door', hinge: 'end', swing: 1 },
    ] },
    { x0: 0, y0: 2.512, x1: 5.5, y1: 2.512 },
    // Balcony / living. Two sliding panels, drawn without a swing.
    { x0: 5.5, y0: 7.747, x1: 8.5, y1: 7.747, openings: [
      { at: 1.21, w: 1.60, type: 'slider' },
    ] },
    // Yard / kitchen. Windows flank the door. The arc is in the yard, hinge on the upper jamb.
    { x0: 3.77, y0: 0, x1: 3.77, y1: 2.512, openings: [
      { at: 0.14, w: 0.58, type: 'window', sill: 0.9, head: 2.1 },
      { at: 0.79, w: 0.78, type: 'door', hinge: 'end', swing: -1 },
      { at: 1.63, w: 0.54, type: 'window', sill: 1.2, head: 2.1 },
    ] },
    // Foyer screen. The inner mouth lines up with the entry leaf and has no swing of its own.
    { x0: 7.189, y0: 0, x1: 7.189, y1: 0.824 },
    { x0: 7.189, y0: 0.824, x1: 8.5, y1: 0.824, openings: [
      { at: 0.041, w: 1.14, type: 'opening', noDoor: 'open-plan arch' },
    ] },
  ],
  // Heads against the drawn side. Wall-backed backs sit 1 cm off the inner face.
  furniture: [
    // Master — bed x 0.27–2.10, y 6.21–7.81, head on the west. Wardrobe on the bath wall, x 0.18–1.58.
    ['Master_Bed', 1.03, 7.01, 0, 0.84, 0.77],
    ['Master_Wardrobe', 0.88, 4.38, 3, 0.83, 0.58],
    // Bedroom 1 — bed head on the west; wardrobe on the south wall, left of the door.
    ['Bed2_Bed', 3.97, 7.16, 2, 0.86, 0.89],
    ['Bed2_Wardrobe', 3.75, 5.56, 0, 0.93, 0.90],
    // Living — sofa on the west wall, coffee table centred, TV on the east wall.
    ['Sofa', 6.02, 6.44, 2, 0.84, 0.89],
    ['Coffee_Table', 7.22, 6.38, 0, 0.71, 1.24],
    ['TV_Unit', 8.19, 6.40, 0, 1, 1],
    // Dining — table long east-west; three chairs each side.
    ['Dining_Table', 6.71, 3.26, 1, 0.84, 0.74],
    ['Dining_Chair_L1', 6.15, 3.79, 1],
    ['Dining_Chair_L2', 6.72, 3.79, 1],
    ['Dining_Chair_L3', 7.29, 3.79, 1],
    ['Dining_Chair_R1', 6.15, 2.73, 1],
    ['Dining_Chair_R2', 6.72, 2.73, 1],
    ['Dining_Chair_R3', 7.29, 2.73, 1],
    // Baths — vanity and toilet tanks on the south wall; showers in the far corner.
    ['MBath_Vanity', 0.62, 2.86, 1],
    ['MBath_Toilet', 1.40, 2.98, 1],
    ['MBath_Shower', 2.22, 3.05, 0],
    ['Bath1_Toilet', 3.30, 2.98, 1],
    ['Bath1_Shower', 4.05, 2.99, 0],
    ['Bath1_Vanity', 4.95, 2.86, 1],
    // Kitchen — stove run on the south wall, sink under the bath wall, fridge at the tall unit.
    ['Kitchen_Run', 5.05, 0.40, 0, 0.46, 0.92],
    ['Kitchen_Run', 4.30, 2.19, 2, 0.15, 0.68],
    ['Fridge', 6.68, 0.53, 0, 1.10, 1.10],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-2.2, -2.4, 14], tgt: [4.2, 4.2, 0.4], fov: 34 },
    { id: 'plan', name: 'Plan', pos: [4.25, 4.25, 16], tgt: [4.25, 4.25, 0], fov: 36 },
  ],
};
