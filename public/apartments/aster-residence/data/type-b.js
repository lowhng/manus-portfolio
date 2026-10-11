// Aster Residence Type B — 810 sqft, 3 bedrooms, 2 bathrooms.
// No millimetre arrow. Outer wall-centre polygon is scaled to 810 sqft
// (s = 0.01022 m/px). Origin is the south-west outer centre. +y is toward
// the top of the sheet (living / bedroom 2). No pink hammer.
// Hinged leaves sit on the thin grey quarter-circles: Bath 2 (into the
// hall), Bedroom 3 (into the room at the north-east corner), Bath 1
// (into the bath), and the foyer entrance (hinge on the east jamb).
// The bedroom 2 and master breaks have no swing, so they stay openings.
window.UNIT = {
  id: 'type-b',
  project: 'Aster Residence',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type B',
  beds: 3,
  baths: 2,
  sqft: 810,
  sourceUrl: 'https://www.amberhomes.com.my/home/project/aster-residence/',
  width: 8.66,
  depth: 9.54,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.20,
  explicitWalls: true,
  rooms: [
    { name: 'Bedroom 2', c: [3.30, 8.10], box: [1.40, 6.90, 5.30, 9.35] },
    { name: 'Living', c: [7.05, 8.15], box: [5.65, 6.90, 8.50, 9.35] },
    { name: 'Dining', c: [7.10, 5.70], box: [5.65, 4.70, 8.50, 6.55] },
    { name: 'Bath 2', c: [2.45, 6.00], box: [1.40, 5.40, 3.60, 6.55] },
    { name: 'Bedroom 3', c: [3.40, 3.90], box: [1.40, 2.80, 5.30, 5.05] },
    { name: 'Kitchen', c: [7.20, 3.40], box: [5.65, 2.20, 8.50, 4.50] },
    { name: 'Master Bedroom', c: [3.50, 1.30], box: [1.70, 0.20, 5.30, 2.40] },
    { name: 'Bath 1', c: [0.75, 1.30], box: [0.15, 0.20, 1.40, 2.40] },
    { name: 'A/C Ledge', c: [0.60, 3.10], box: [0.15, 2.70, 1.05, 3.45] },
    { name: 'Foyer', c: [6.20, 1.00], box: [5.65, 0.15, 6.85, 1.90] },
    { name: 'Utility', c: [7.80, 1.00], box: [7.15, 0.15, 8.50, 1.90] },
  ],
  floors: [
    { name: 'Bedroom 2', box: [1.22, 6.71, 5.47, 9.54] },
    { name: 'Bath 2', box: [1.22, 5.23, 3.79, 6.71] },
    { name: 'Hall', box: [3.79, 5.23, 5.47, 6.71] },
    { name: 'Living', box: [5.47, 6.71, 8.66, 9.54] },
    { name: 'Dining', box: [5.47, 4.40, 8.66, 6.71] },
    { name: 'Bedroom 3', box: [1.22, 2.60, 5.47, 5.23] },
    { name: 'Kitchen', box: [5.47, 2.07, 8.66, 4.40] },
    { name: 'A/C Ledge', box: [0, 2.60, 1.22, 3.59] },
    { name: 'Bath 1', box: [0, 0, 1.53, 2.60] },
    { name: 'Master Bedroom', box: [1.53, 0, 5.47, 2.60] },
    { name: 'Foyer', box: [5.47, 0, 7.00, 2.07] },
    { name: 'Utility', box: [7.00, 0, 8.66, 2.07] },
  ],
  walls: [
    { x0: 0, y0: 0, x1: 0, y1: 3.59 },
    { x0: 0, y0: 3.59, x1: 1.22, y1: 3.59 },
    { x0: 1.22, y0: 3.59, x1: 1.22, y1: 9.54 },
    { x0: 1.22, y0: 9.54, x1: 8.66, y1: 9.54, openings: [
      { at: 1.03, w: 2.19, type: 'window' },
      { at: 4.81, w: 2.20, type: 'window' },
    ] },
    { x0: 8.66, y0: 0, x1: 8.66, y1: 9.54 },
    // Entrance. Hinge on the east jamb, leaf swings north into the foyer.
    { x0: 0, y0: 0, x1: 8.66, y1: 0, openings: [
      { at: 5.56, w: 1.38, type: 'door', hinge: 'end', swing: -1, kind: 'entry' },
    ] },
    // Bedroom 2 south wall. The break has no quarter-circle, so it stays open.
    { x0: 1.22, y0: 6.71, x1: 5.47, y1: 6.71, openings: [
      { at: 2.69, w: 0.89, type: 'opening' },
    ] },
    // Bedroom 3 north wall. Arc inside the room, hinge at the north-east corner.
    { x0: 1.22, y0: 5.23, x1: 5.47, y1: 5.23, openings: [
      { at: 3.17, w: 0.89, type: 'door', hinge: 'end', swing: 1 },
    ] },
    { x0: 0, y0: 2.60, x1: 5.47, y1: 2.60, openings: [
      { at: 0.78, w: 0.59, type: 'opening' },
      { at: 1.60, w: 0.70, type: 'opening' },
    ] },
    // Spine. Both breaks are openings: the master has no swing, and the
    // upper one is the wide way into the living room.
    { x0: 5.47, y0: 0, x1: 5.47, y1: 9.54, openings: [
      { at: 0.91, w: 0.89, type: 'opening' },
      { at: 5.31, w: 1.33, type: 'opening' },
    ] },
    // Bath 2 east wall. Arc in the hall, hinge on the north jamb.
    { x0: 3.79, y0: 5.23, x1: 3.79, y1: 6.71, openings: [
      { at: 0.16, w: 0.78, type: 'door', hinge: 'end', swing: 1 },
    ] },
    // Bath 1 east wall. Arc inside the bath, hinge on the south jamb.
    { x0: 1.53, y0: 0, x1: 1.53, y1: 2.60, openings: [
      { at: 1.64, w: 0.78, type: 'door', hinge: 'start', swing: 1 },
    ] },
    { x0: 7.00, y0: 0, x1: 7.00, y1: 2.07 },
    { x0: 7.00, y0: 2.07, x1: 8.66, y1: 2.07 },
  ],
  // Symbol centres on the render. Bed1/Bed2 head +X. Master_Bed head -X.
  // Sofa back +X, length Z. TV screen -X. Bed2_Wardrobe long X, front -Z.
  // Master_Wardrobe long Z, front +X. Kitchen_Run backsplash +Z, length X.
  // Dining table long Z. Fridge back +Z. DeskChair faces -Z.
  furniture: [
    // Bedroom 2 — queen, pillows on the west wall; desk in the north-east corner; wardrobe on the east wall
    ['Bed2_Bed', 2.70, 8.05, 2, 0.90, 0.75],
    ['Bed2_Bedside', 2.55, 8.85, 2, 0.70, 0.70],
    ['Master_Desk', 4.55, 8.70, 1],
    ['Master_DeskChair', 4.05, 8.70, 1],
    ['Bed2_Wardrobe', 4.85, 7.35, 3, 0.85, 0.70],
    // Living — sofa on the east wall facing the TV on the spine
    ['TV_Unit', 5.85, 8.20, 2, 0.85, 0.90],
    ['Coffee_Table', 6.90, 8.15, 1, 0.75, 0.70],
    ['Sofa', 7.70, 8.20, 0, 0.85, 0.95],
    ['Rug_Living', 7.00, 8.15, 0, 0.70, 0.75],
    // Dining — table long east-west, three chairs on each long side
    ['Dining_Table', 7.15, 5.65, 1, 0.85, 1.05],
    ['Dining_Chair_L1', 6.40, 6.15, 1],
    ['Dining_Chair_L2', 7.15, 6.15, 1],
    ['Dining_Chair_L3', 7.90, 6.15, 1],
    ['Dining_Chair_R1', 6.40, 5.15, 1],
    ['Dining_Chair_R2', 7.15, 5.15, 1],
    ['Dining_Chair_R3', 7.90, 5.15, 1],
    // Bath 2 — basin and WC against the west wall
    ['Bath1_Vanity', 1.65, 6.30, 3, 0.70, 0.55],
    ['Bath1_Toilet', 1.70, 5.55, 3, 0.55, 0.55],
    // Bedroom 3 — bed head to the south, wardrobe on the east wall
    ['Bed1_Bed', 3.35, 3.85, 1, 0.85, 0.80],
    ['Bed1_Bedside_A', 2.40, 3.15, 1, 0.65, 0.65],
    ['Bed1_Bedside_B', 4.30, 3.15, 1, 0.65, 0.65],
    ['Bed1_Wardrobe', 5.05, 4.20, 3, 0.80, 0.65],
    // Kitchen — L along the east wall and the wall above the foyer; fridge at the north end of the east run
    ['Kitchen_Run', 8.30, 3.50, 3, 0.85, 0.55],
    ['Kitchen_Run', 6.90, 2.30, 0, 0.70, 0.50],
    ['Fridge', 8.25, 4.55, 3, 0.70, 0.70],
    // Master — head to the north, wardrobe against the bath wall
    ['Master_Bed', 3.50, 1.25, 1, 0.90, 0.80],
    ['Master_Bedside_L', 2.40, 2.05, 1, 0.65, 0.65],
    ['Master_Bedside_R', 4.55, 2.05, 1, 0.65, 0.65],
    ['Master_Wardrobe', 1.95, 1.15, 0, 0.75, 0.85],
    // Bath 1 — fittings inside the west room
    ['Bath1_Vanity', 0.45, 0.55, 1, 0.60, 0.50],
    ['Bath1_Toilet', 1.05, 0.55, 1, 0.50, 0.50],
    ['Bath1_Shower', 0.70, 1.90, 0, 0.55, 0.65],
    // Foyer shoe cabinet, utility washer
    ['Shoe_Cabinet', 6.15, 1.45, 0, 0.75, 0.55],
    ['Yard_Washer', 7.85, 0.85, 0, 0.65, 0.65],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-1.8, -2.4, 13], tgt: [4.2, 4.6, 0.4], fov: 36 },
    { id: 'plan', name: 'Plan', pos: [4.3, 4.8, 18], tgt: [4.3, 4.8, 0], fov: 36 },
  ],
};
