// The Connaught One Type A1 — 468 sqft.
// Printed arrows: 6025 mm by 9150 mm. sx = 0.012500 m/px, sy = 0.013476 m/px.
// West centre px 525, south centre px 941. Origin is the south-west outer
// wall centre. +x right, +y north.
// Hinged leaves follow the quarter-circles: entry (west jamb, into the unit),
// bath (north jamb, into the bath), A/C (east jamb, into the living room).
// The yard edge is open. The east side steps out for the kitchen. A small
// notch is cut out of the south-east corner. The entry is recessed.
// This sheet has no pink hammer.
window.UNIT = {
  id: "type-a1",
  project: 'The Connaught One',
  location: 'Cheras, Kuala Lumpur',
  name: "Type A1",
  beds: 1,
  baths: 1,
  sqft: 468,
  sourceUrl: 'https://www.uemsunrise.com/property/region/greater-kuala-lumpur/project/the-connaught-one',
  width: 5.49,
  depth: 8.99,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.15,
  explicitWalls: true,
  plan: {
    file: 'type-a1-468sf.png',
    ox: 525,
    oy: 941,
    mx: 0.0125,
    my: 0.013476,
  },
  rooms: [
    { name: "URBAN YARD", c: [1.85, 8.15], box: [0.20, 7.40, 3.70, 8.80] },
    { name: "A/C", c: [4.45, 8.15], box: [3.95, 7.40, 4.95, 8.80] },
    { name: "BEDROOM", c: [1.15, 3.85], box: [0.20, 3.10, 2.50, 6.90] },
    { name: "LIVING / DINING", c: [3.70, 4.20], box: [2.60, 2.60, 4.90, 6.90] },
    { name: "KITCHEN", c: [4.10, 1.30], box: [3.10, 0.45, 5.30, 2.20] },
    { name: "FOYER", c: [2.15, 0.80], box: [1.50, 0.45, 2.85, 1.30] },
    { name: "BATH", c: [0.85, 1.50], box: [0.20, 0.30, 1.30, 2.60] },
  ],
  floors: [
    { name: "URBAN YARD", box: [0.31, 7.552, 3.378, 8.578] },
    { name: "A/C", box: [4.122, 7.552, 4.878, 8.645] },
    { name: "BEDROOM", box: [0.31, 3.173, 2.628, 6.691] },
    { name: "LIVING / DINING", box: [2.998, 2.499, 4.752, 6.691] },
    { name: "LIVING / DINING", box: [1.998, 0.747, 3.378, 2.379] },
    { name: "KITCHEN", box: [3.498, 0.478, 5.252, 1.84] },
    { name: "KITCHEN", box: [5.12, 0.55, 5.40, 4.40] },
    { name: "BATH", box: [0.498, 0.613, 1.128, 2.244] },
    { name: "BATH", box: [0.122, 0.208, 0.565, 0.762] },
  ],
  walls: [
    { x0: 0.0, y0: 8.988, x1: 5.038, y1: 8.988, openings: [
      { at: 0.05, w: 3.70, type: 'rail', h: 1.05 },
    ] },
    { x0: 0.0, y0: 7.25, x1: 5.038, y1: 7.25, openings: [
      { at: 0.62, w: 1.36, type: 'window', sill: 0, head: 2.1 },
      { at: 2.68, w: 1.07, type: 'window', sill: 0, head: 2.1 },
      { at: 4.238, w: 0.80, type: 'door', hinge: 'end', swing: 1 },
    ] },
    // Step where the kitchen bay pushes east. North of this is outside.
    { x0: 5.038, y0: 4.73, x1: 5.488, y1: 4.73 },
    { x0: 0.0, y0: 2.776, x1: 1.388, y1: 2.776 },
    { x0: 0.0, y0: 1.011, x1: 0.312, y1: 1.011 },
    // Recessed entry.
    { x0: 1.388, y0: 0.35, x1: 2.963, y1: 0.35, openings: [
      { at: 0.48, w: 0.95, type: 'door', kind: 'entry', hinge: 'start', swing: 1 },
    ] },
    { x0: 0.0, y0: 0.0, x1: 1.388, y1: 0.0 },
    { x0: 2.963, y0: 0.0, x1: 5.038, y1: 0.0 },
    // Notch in the south-east corner, open to the outside.
    { x0: 5.038, y0: 0.0, x1: 5.038, y1: 0.35 },
    { x0: 5.038, y0: 0.35, x1: 5.488, y1: 0.35 },
    { x0: 0.0, y0: 0.0, x1: 0.0, y1: 8.988 },
    { x0: 0.312, y0: 0.0, x1: 0.312, y1: 1.011 },
    { x0: 1.388, y0: 0.0, x1: 1.388, y1: 2.776, openings: [
      { at: 1.90, w: 0.72, type: 'door', hinge: 'end', swing: -1 },
    ] },
    { x0: 2.963, y0: 0.0, x1: 2.963, y1: 0.35 },
    { x0: 3.825, y0: 7.25, x1: 3.825, y1: 8.988, openings: [
      { at: 0.58, w: 0.39, type: 'window', sill: 0.9, head: 2.1 },
      { at: 1.16, w: 0.16, type: 'window', sill: 1.4, head: 2.0 },
    ] },
    // Living-room east wall, above the kitchen step.
    { x0: 5.038, y0: 4.73, x1: 5.038, y1: 8.988 },
    { x0: 5.488, y0: 0.35, x1: 5.488, y1: 4.73 },
  ],
  furniture: [
    ["Master_Bed", 0.962, 5.305, 0, 0.811, 0.853],
    ["Master_Bedside_L", 0.30, 6.45, 0, 0.86, 0.72],
    ["Master_Bedside_R", 0.30, 4.14, 0, 0.86, 0.68],
    ["Bed2_Wardrobe", 0.824, 3.126, 0, 0.98, 0.88],
    ["Balcony_SideTable", 2.965, 6.425, 0, 1.0, 1.0],
    ["Armchair", 3.78, 6.46, 0, 0.63, 0.63],
    ["Sofa", 3.025, 5.02, 0, 0.757, 0.713],
    ["Coffee_Table", 3.92, 5.01, 0, 0.65, 0.65],
    ["TV_Unit", 4.832, 5.375, 0, 0.658, 0.625],
    ["Dining_Table", 4.22, 2.38, 1, 0.978, 0.667],
    ["Dining_Chair_L1", 4.15, 3.12, 0],
    ["Dining_Chair_R1", 4.15, 1.64, 0],
    ["Kitchen_Run", 3.965, 0.347, 0, 0.367, 0.879],
    ["Kitchen_Run", 5.161, 0.925, 3, 0.176, 0.844],
    ["Bath1_Vanity", 0.315, 2.15, 2, 1.0, 0.65],
    ["Bath1_Toilet", 0.43, 1.52, 2, 1.0, 0.95],
    ["Bath1_Shower", 0.156, 0.50, 0, 0.17, 1.05],
  ],
  views: [
    { id: "overview", name: "Overview", pos: [-2.25, -1.98, 13.04], tgt: [2.75, 4.05, 0.3], fov: 34 },
    { id: "plan", name: "Plan", pos: [2.75, 4.5, 16.63], tgt: [2.75, 4.5, 0], fov: 36 },
  ],
};
