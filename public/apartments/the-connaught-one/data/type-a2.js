// The Connaught One Type A2 — 452 sqft.
// Printed arrows: 5650 mm by 8888 mm. Wall-centre span is 423 px by 666 px
// (west centre px 545, south centre px 940). Origin is the south-west outer
// wall centre. +x right, +y north.
// Hinged leaves follow the quarter-circles: entry (west jamb, into the unit),
// bath (north jamb, into the bath), A/C (east jamb, into the living room).
// The yard edge is open (railing). Yard windows are a single glass line.
// The entry is recessed: the door line is the unit boundary.
// This sheet has no pink hammer.
window.UNIT = {
  id: "type-a2",
  project: 'The Connaught One',
  location: 'Cheras, Kuala Lumpur',
  name: "Type A2",
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
  plan: { file: 'type-a2-452sf.png', ox: 545, oy: 940, mx: 0.012841, my: 0.013090 },
  rooms: [
    { name: "URBAN YARD", c: [1.96, 7.95], box: [0.32, 7.52, 3.6, 8.38] },
    { name: "A/C", c: [4.72, 7.95], box: [4.23, 7.52, 5.21, 8.38] },
    { name: "BEDROOM", c: [1.20, 4.90], box: [0.32, 3.2, 2.57, 6.62] },
    { name: "LIVING / DINING", c: [4.04, 4.58], box: [2.95, 2.55, 5.14, 6.62] },
    { name: "KITCHEN", c: [4.3, 1.11], box: [3.46, 0.45, 5.14, 1.77] },
    { name: "FOYER", c: [2.30, 0.85], box: [1.60, 0.40, 3.00, 1.30] },
    { name: "BATH", c: [0.87, 1.44], box: [0.51, 0.58, 1.22, 2.3] },
  ],
  floors: [
    { name: "URBAN YARD", box: [0.317, 7.521, 3.6, 8.383] },
    { name: "A/C", box: [4.233, 7.521, 5.205, 8.383] },
    { name: "BEDROOM", box: [0.317, 3.202, 2.572, 6.616] },
    { name: "LIVING / DINING", box: [2.949, 2.547, 5.141, 6.616] },
    { name: "LIVING / DINING", box: [1.922, 0.714, 3.343, 2.427] },
    { name: "KITCHEN", box: [3.463, 0.453, 5.141, 1.773] },
    { name: "BATH", box: [0.509, 0.584, 1.224, 2.296] },
    { name: "BATH", box: [0.124, 0.191, 0.518, 0.791] },
  ],
  walls: [
    { x0: 0.0, y0: 8.718, x1: 5.432, y1: 8.718, openings: [
      { at: 0.05, w: 3.85, type: 'rail', h: 1.05 },
    ] },
    { x0: 0.0, y0: 7.226, x1: 5.432, y1: 7.226, openings: [
      { at: 0.68, w: 1.42, type: 'window', sill: 0, head: 2.1 },
      { at: 2.76, w: 1.12, type: 'window', sill: 0, head: 2.1 },
      { at: 4.32, w: 0.75, type: 'door', hinge: 'end', swing: 1 },
    ] },
    { x0: 0.0, y0: 2.788, x1: 1.464, y1: 2.788 },
    { x0: 0.0, y0: 1.021, x1: 0.334, y1: 1.021 },
    { x0: 1.464, y0: 0.314, x1: 3.133, y1: 0.314, openings: [
      { at: 0.54, w: 1.00, type: 'door', kind: 'entry', hinge: 'start', swing: 1 },
    ] },
    { x0: 0.0, y0: 0.0, x1: 1.464, y1: 0.0 },
    { x0: 3.133, y0: 0.0, x1: 5.432, y1: 0.0 },
    { x0: 0.0, y0: 0.0, x1: 0.0, y1: 8.718 },
    { x0: 0.334, y0: 0.0, x1: 0.334, y1: 1.021 },
    { x0: 1.464, y0: 0.0, x1: 1.464, y1: 2.788, openings: [
      { at: 1.94, w: 0.70, type: 'door', hinge: 'end', swing: -1 },
    ] },
    { x0: 3.133, y0: 0.0, x1: 3.133, y1: 0.314 },
    { x0: 3.942, y0: 7.226, x1: 3.942, y1: 8.718, openings: [
      { at: 0.34, w: 0.40, type: 'window', sill: 0.9, head: 2.1 },
      { at: 0.92, w: 0.18, type: 'window', sill: 1.4, head: 2.0 },
    ] },
    { x0: 5.432, y0: 0.0, x1: 5.432, y1: 8.718 },
  ],
  furniture: [
    ["Master_Bed", 1.012, 5.335, 0, 0.857, 0.853],
    ["Master_Bedside_L", 0.31, 6.45, 0, 0.91, 0.80],
    ["Master_Bedside_R", 0.32, 4.20, 0, 0.86, 0.80],
    ["Bed2_Wardrobe", 0.825, 3.141, 0, 1.00, 0.891],
    ["Balcony_SideTable", 3.125, 6.285, 0, 1.07, 1.07],
    ["Armchair", 3.98, 6.40, 0, 0.67, 0.67],
    ["Sofa", 3.195, 4.95, 0, 0.798, 0.704],
    ["Coffee_Table", 4.12, 4.95, 0, 0.65, 0.65],
    ["TV_Unit", 5.169, 5.00, 0, 0.943, 0.90],
    ["Dining_Table", 4.415, 2.41, 1, 0.956, 0.928],
    ["Dining_Chair_L1", 4.05, 3.15, 0],
    ["Dining_Chair_R1", 4.05, 1.70, 0],
    ["Kitchen_Run", 3.995, 0.377, 0, 0.309, 0.976],
    ["Kitchen_Run", 5.049, 1.14, 3, 0.191, 0.995],
    ["Bath1_Vanity", 0.315, 2.20, 2, 1.0, 0.70],
    ["Bath1_Toilet", 0.430, 1.50, 2, 1.0, 1.0],
    ["Bath1_Shower", 0.155, 0.51, 0, 0.19, 1.17],
  ],
  views: [
    { id: "overview", name: "Overview", pos: [-2.18, -1.92, 12.64], tgt: [2.71, 3.92, 0.3], fov: 34 },
    { id: "plan", name: "Plan", pos: [2.71, 4.36, 16.13], tgt: [2.71, 4.36, 0], fov: 36 },
  ],
};
