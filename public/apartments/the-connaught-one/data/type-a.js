// The Connaught One Type A — 452 sqft.
// Printed arrows: 5700 mm by 8888 mm. Wall-centre span is 426.5 px by 666 px
// (west centre px 548, south centre px 941). Origin is the south-west outer
// wall centre. +x right, +y north.
// Hinged leaves follow the quarter-circles: entry (west jamb, into the unit),
// bath (north jamb, into the bath), A/C (east jamb, into the living room).
// The yard edge is open (railing). Yard windows are a single glass line.
// The entry is recessed: the door line is the unit boundary.
// This sheet has no pink hammer.
window.UNIT = {
  id: "type-a",
  project: 'The Connaught One',
  location: 'Cheras, Kuala Lumpur',
  name: "Type A",
  beds: 1,
  baths: 1,
  sqft: 452,
  sourceUrl: 'https://www.uemsunrise.com/property/region/greater-kuala-lumpur/project/the-connaught-one',
  width: 5.43,
  depth: 8.72,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.15,
  explicitWalls: true,
  plan: {
    file: 'type-a-452sf.png',
    ox: 548,
    oy: 941,
    mx: 5.432 / 426.5,
    my: 8.718 / 666,
  },
  rooms: [
    { name: "URBAN YARD", c: [1.90, 7.95], box: [0.20, 7.40, 3.80, 8.55] },
    { name: "A/C", c: [4.70, 8.00], box: [4.10, 7.40, 5.30, 8.55] },
    { name: "BEDROOM", c: [1.15, 3.90], box: [0.20, 3.20, 2.40, 6.90] },
    { name: "LIVING / DINING", c: [4.15, 3.70], box: [2.70, 2.50, 5.20, 6.90] },
    { name: "KITCHEN", c: [4.05, 1.15], box: [3.20, 0.40, 5.20, 1.90] },
    { name: "FOYER", c: [2.45, 0.75], box: [1.60, 0.40, 3.10, 1.30] },
    { name: "BATH", c: [0.90, 1.55], box: [0.20, 0.30, 1.40, 2.60] },
  ],
  floors: [
    { name: "URBAN YARD", box: [0.341, 7.534, 3.536, 8.331] },
    { name: "A/C", box: [4.294, 7.534, 5.194, 8.396] },
    { name: "BEDROOM", box: [0.341, 3.215, 2.516, 6.629] },
    { name: "LIVING / DINING", box: [3.018, 2.56, 5.066, 6.629] },
    { name: "LIVING / DINING", box: [1.998, 0.728, 3.408, 2.44] },
    { name: "KITCHEN", box: [3.528, 0.466, 5.13, 1.786] },
    { name: "BATH", box: [0.596, 0.597, 1.241, 2.309] },
    { name: "BATH", box: [0.149, 0.204, 0.603, 0.804] },
  ],
  walls: [
    // North edge. The yard is open; the A/C ledge keeps a solid wall.
    { x0: 0.0, y0: 8.718, x1: 5.432, y1: 8.718, openings: [
      { at: 0.05, w: 3.83, type: 'rail', h: 1.05 },
    ] },
    // Bedroom window, living window, then the A/C door. Glass is one line,
    // so these are windows. The bedroom opening is wide enough to be a walk-out,
    // drawn the same way, so both yard windows are full-height glazing.
    { x0: 0.0, y0: 7.239, x1: 5.432, y1: 7.239, openings: [
      { at: 0.70, w: 1.40, type: 'window', sill: 0, head: 2.1 },
      { at: 2.75, w: 1.12, type: 'window', sill: 0, head: 2.1 },
      { at: 4.27, w: 0.75, type: 'door', hinge: 'end', swing: 1 },
    ] },
    { x0: 0.0, y0: 2.788, x1: 1.492, y1: 2.788 },
    { x0: 0.0, y0: 1.021, x1: 0.37, y1: 1.021 },
    // Recessed entry. Hinge on the west jamb, leaf swings north into the unit.
    { x0: 1.492, y0: 0.301, x1: 3.15, y1: 0.301, openings: [
      { at: 0.54, w: 1.00, type: 'door', kind: 'entry', hinge: 'start', swing: 1 },
    ] },
    { x0: 0.0, y0: 0.0, x1: 1.492, y1: 0.0 },
    { x0: 3.15, y0: 0.0, x1: 5.432, y1: 0.0 },
    { x0: 0.0, y0: 0.0, x1: 0.0, y1: 8.718 },
    { x0: 0.37, y0: 0.0, x1: 0.37, y1: 1.021 },
    // Bath door. Hinge on the north jamb, leaf swings west into the bath.
    { x0: 1.492, y0: 0.0, x1: 1.492, y1: 2.788, openings: [
      { at: 1.91, w: 0.70, type: 'door', hinge: 'end', swing: -1 },
    ] },
    { x0: 3.15, y0: 0.0, x1: 3.15, y1: 0.301 },
    // Louvers between the yard and the A/C ledge.
    { x0: 3.966, y0: 7.239, x1: 3.966, y1: 8.718, openings: [
      { at: 0.34, w: 0.39, type: 'window', sill: 0.9, head: 2.1 },
      { at: 0.92, w: 0.15, type: 'window', sill: 1.4, head: 2.0 },
    ] },
    { x0: 5.432, y0: 0.0, x1: 5.432, y1: 8.718 },
  ],
  furniture: [
    ["Master_Bed", 1.027, 5.36, 0, 0.87, 0.88],
    ["Master_Bedside_L", 0.34, 6.47, 0, 0.90, 0.80],
    ["Master_Bedside_R", 0.34, 4.25, 0, 0.90, 0.80],
    ["Bed2_Wardrobe", 0.915, 3.113, 0, 1.02, 0.80],
    ["Balcony_SideTable", 3.15, 6.29, 0, 1.05, 1.05],
    ["Armchair", 3.90, 6.55, 0, 0.58, 0.58],
    ["Sofa", 3.21, 4.955, 0, 0.79, 0.70],
    ["Coffee_Table", 4.15, 4.95, 0, 0.65, 0.65],
    ["TV_Unit", 5.247, 5.17, 0, 0.55, 0.73],
    ["Dining_Table", 4.24, 2.39, 1, 0.98, 0.71],
    ["Dining_Chair_L1", 4.07, 3.02, 0],
    ["Dining_Chair_R1", 4.07, 1.68, 0],
    ["Kitchen_Run", 3.914, 0.373, 0, 0.284, 0.96],
    ["Fridge", 5.033, 1.42, 3, 0.80, 0.88],
    ["Bath1_Vanity", 0.274, 2.30, 2, 0.83, 0.67],
    ["Bath1_Toilet", 0.430, 1.50, 2, 1, 1],
    ["Bath1_Shower", 0.185, 0.51, 0, 0.24, 1.08],
  ],
  views: [
    { id: "overview", name: "Overview", pos: [-2.18, -1.92, 12.64], tgt: [2.71, 3.92, 0.3], fov: 34 },
    { id: "plan", name: "Plan", pos: [2.71, 4.36, 16.13], tgt: [2.71, 4.36, 0], fov: 36 },
  ],
};
