// Emerald 9 Tower C · Type A — 675 sqft, 2 bed / 1 bath.
// Centreline runs traced from the developer plan. Scale is the printed
// dimension arrows (separate horizontal and vertical, the sheet is not square).
// A hinged leaf is placed where a swing is drawn. The balcony front is two
// sliding panels; the balcony outer edge is a parapet. No pink hammer.
window.UNIT = {
  id: "tower-c-type-a",
  project: "Emerald 9",
  location: "Cheras, Selangor",
  name: "Tower C \u00b7 Type A",
  beds: 2,
  baths: 1,
  sqft: 675,
  sourceUrl: "https://guocoland.com.my/emerald9/towerc.html",
  width: 5.85,
  depth: 8.9,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.15,
  explicitWalls: true,
  // World (0, 0) is the bedroom 2 south-west centreline. Image +y is down.
  // Horizontal 78.56 px/m, vertical 68.47 px/m (the sheet is not square).
  plan: {
    file: "tower-c-type-a-675sf.jpg",
    ox: 676.11,
    oy: 884.5,
    mx: 1 / 78.561,
    my: 1 / 68.467,
  },
  rooms: [
    { name: "A/C", c: [3.11, 8.42], box: [2.70, 8.05, 3.52, 8.82] },
    { name: "BALCONY", c: [4.72, 8.42], box: [3.70, 8.05, 5.75, 8.82] },
    { name: "MASTER BEDROOM", c: [2.31, 6.24], box: [1.35, 4.65, 3.27, 7.83] },
    { name: "LIVING", c: [4.61, 6.73], box: [3.5, 5.59, 5.72, 7.87] },
    { name: "DINING", c: [4.645, 4.352], box: [3.535, 3.062, 5.755, 5.642] },
    { name: "BATH 1", c: [2.404, 3.576], box: [1.444, 2.676, 3.364, 4.476] },
    { name: "YARD", c: [0.62, 3.05], box: [0.18, 2.58, 1.10, 3.52] },
    { name: "KITCHEN", c: [4.437, 1.65], box: [3.117, 0.12, 5.757, 3.18] },
    { name: "BEDROOM 2", c: [1.5, 1.26], box: [0.15, 0.15, 2.85, 2.37] },
  ],
  floors: [
    { name: "A/C", box: [2.70, 8.05, 3.52, 8.82] },
    { name: "BALCONY", box: [3.70, 8.05, 5.75, 8.82] },
    { name: "MASTER BEDROOM", box: [1.35, 4.65, 3.27, 7.83] },
    { name: "LIVING", box: [3.5, 5.59, 5.72, 7.87] },
    { name: "DINING", box: [3.535, 3.062, 5.755, 5.642] },
    { name: "BATH 1", box: [1.444, 2.676, 3.364, 4.476] },
    { name: "YARD", box: [0.18, 2.58, 1.10, 3.52] },
    { name: "KITCHEN", box: [3.117, 0.12, 5.757, 3.18] },
    { name: "BEDROOM 2", box: [0.15, 0.15, 2.85, 2.37] },
  ],
  walls: [
    { x0: 0, y0: 0, x1: 0, y1: 3.652 },
    // Yard door. The chevron sits in the bath, so the leaf swings east.
    { x0: 1.227, y0: 2.461, x1: 1.227, y1: 7.96, openings: [{ at: 0.47, w: 0.63, type: "door", hinge: "start", swing: -1 }] },
    { x0: 1.678, y0: 2.461, x1: 1.678, y1: 2.804 },
    { x0: 2.612, y0: 7.96, x1: 2.612, y1: 8.902 },
    // A/C ledge and balcony are separate. The drawn pier is at x = 3.60.
    { x0: 3.60, y0: 7.96, x1: 3.60, y1: 8.902 },
    { x0: 2.943, y0: 0, x1: 2.943, y1: 2.461, openings: [{ at: 1.545, w: 0.648, type: "door", hinge: "end", swing: -1 }] },
    { x0: 3.407, y0: 2.461, x1: 3.407, y1: 7.96, openings: [{ at: 0.546, w: 0.577, type: "door", hinge: "end", swing: -1 }, { at: 2.228, w: 0.733, type: "door", hinge: "start", swing: 1 }] },
    { x0: 3.515, y0: 0, x1: 3.515, y1: 0.3 },
    { x0: 4.64, y0: 0, x1: 4.64, y1: 0.241 },
    { x0: 5.364, y0: 0, x1: 5.364, y1: 0.241 },
    { x0: 5.854, y0: 0, x1: 5.854, y1: 8.902 },
    // Entry leaf swings north. Kitchen window sits between the two jambs, glass on the outer line.
    { x0: 0, y0: 0, x1: 5.854, y1: 0, openings: [
      { at: 3.689, w: 0.904, type: "door", hinge: "start", swing: 1, kind: "entry" },
      { at: 4.66, w: 0.70, type: "window", sill: 0.9, head: 2.1 },
    ] },
    { x0: 4.64, y0: 0.241, x1: 5.854, y1: 0.241, openings: [{ at: 0.02, w: 0.70, type: "window", sill: 0.9, head: 2.1 }] },
    { x0: 0, y0: 2.461, x1: 3.407, y1: 2.461 },
    { x0: 1.227, y0: 2.804, x1: 1.678, y1: 2.804 },
    // North wall of the yard. The sheet draws it across to the bathroom wall.
    { x0: 0, y0: 3.652, x1: 1.227, y1: 3.652 },
    // Bath door. The leaf line drops south of the east jamb, into the bath.
    { x0: 1.227, y0: 4.535, x1: 3.407, y1: 4.535, openings: [{ at: 1.462, w: 0.547, type: "door", hinge: "end", swing: 1 }] },
    // Balcony sliders. The master bedroom's north wall is solid on the sheet.
    { x0: 1.227, y0: 7.96, x1: 5.854, y1: 7.96, openings: [{ at: 2.613, w: 1.80, type: "slider" }] },
    // A/C outer wall is solid; the balcony edge is a parapet.
    { x0: 2.612, y0: 8.902, x1: 5.854, y1: 8.902, openings: [{ at: 0.988, w: 2.254, type: "rail", h: 1.05 }] },
    { x0: 2.943, y0: 0.3, x1: 3.515, y1: 0.3 },
  ],
  furniture: [
    // Headboard on the master bedroom's west wall.
    ["Master_Bed", 2.25, 6.40, 0, 0.85, 0.95],
    ["Master_Bedside_L", 2.05, 7.20, 0, 1, 1],
    ["Master_Bedside_R", 2.05, 5.60, 0, 1, 1],
    ["Sofa", 5.30, 6.70, 0, 0.70, 0.80],
    // Console against the living side of the bedroom wall.
    ["TV_Unit", 3.70, 6.60, 2, 1, 0.85],
    ["Coffee_Table", 4.50, 6.70, 0, 0.55, 0.50],
    ["Dining_Table", 4.70, 4.20, 0, 1.10, 0.75],
    ["Dining_Chair_L1", 4.70, 4.85, 1, 1, 1],
    ["Dining_Chair_R1", 4.70, 3.55, 3, 1, 1],
    ["Dining_Chair_L2", 4.15, 4.20, 0, 1, 1],
    // Toilet under the wall to the master bedroom. Vanity is the long south bench.
    ["Bath1_Toilet", 2.25, 4.16, 3, 0.80, 1.1],
    ["Bath1_Vanity", 2.40, 2.79, 1, 1, 1.8],
    // Counter along the kitchen's east wall, clear of the window jamb and the dining table.
    ["Kitchen_Run", 5.50, 1.55, 3, 0.45, 0.85],
    ["Bed2_Bed", 1.10, 0.86, 1, 0.70, 1.0],
    ["Bed2_Wardrobe", 2.54, 0.80, 3, 0.80, 1],
    ["Bed2_Bedside", 0.50, 1.20, 0, 1, 1],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-2.047, -3.56, 11.125], tgt: [2.925, 4.45, 0.4], fov: 34 },
    { id: 'plan', name: 'Plan', pos: [2.925, 4.45, 14.685], tgt: [2.925, 4.45, 0], fov: 36 },
  ],
};
