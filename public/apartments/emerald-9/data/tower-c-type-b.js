// Emerald 9 Tower C · Type B — 852 sqft, 2+1 bed / 2 bath.
// Centreline runs traced from the developer plan. Scale is the printed
// dimension arrows (separate horizontal and vertical, the sheet is not square).
// A hinged leaf is placed where a swing is drawn. The study's north and east
// edges are dashed on the sheet, so they are not walls. No pink hammer.
window.UNIT = {
  id: "tower-c-type-b",
  project: "Emerald 9",
  location: "Cheras, Selangor",
  name: "Tower C \u00b7 Type B",
  beds: "2+1",
  baths: 2,
  sqft: 852,
  sourceUrl: "https://guocoland.com.my/emerald9/towerc.html",
  width: 9.91,
  depth: 9.05,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.15,
  explicitWalls: true,
  // World (0, 0) is the south-west centreline. Image +y is down.
  plan: {
    file: "tower-c-type-b-852sf.jpg",
    ox: 600.5,
    oy: 859.5,
    mx: 1 / 62.23,
    my: 1 / 63.40,
  },
  rooms: [
    { name: "A/C", c: [0.9, 7.53], box: [0.15, 7.08, 1.65, 7.98] },
    { name: "YARD", c: [0.81, 6.39], box: [0.15, 5.85, 1.47, 6.93] },
    { name: "LIVING", c: [3.53, 7], box: [2.09, 5.83, 4.97, 8.17] },
    { name: "MASTER BEDROOM", c: [6.72, 7.38], box: [5.01, 5.85, 8.43, 8.91] },
    { name: "KITCHEN", c: [2.202, 5.314], box: [-0.018, 3.814, 4.422, 6.814] },
    { name: "DINING", c: [2.931, 3.254], box: [0.621, 1.004, 5.241, 5.504] },
    { name: "BATH 1", c: [7.15, 4.90], box: [6.20, 4.28, 8.40, 5.55] },
    { name: "BATH 2", c: [7.20, 3.40], box: [6.35, 2.78, 8.40, 4.05] },
    { name: "A/C", c: [9.05, 3.14], box: [8.70, 2.78, 9.50, 3.50] },
    { name: "STUDY", c: [1.59, 1.47], box: [0.15, 0.87, 3.03, 2.07] },
    { name: "FOYER", c: [4.02, 0.45], box: [3.27, 0, 4.77, 0.9] },
    { name: "BEDROOM 2", c: [7.41, 1.35], box: [5.01, 0.15, 9.81, 2.55] },
  ],
  floors: [
    { name: "A/C", box: [0.15, 7.08, 1.65, 7.98] },
    { name: "YARD", box: [0.15, 5.85, 1.47, 6.93] },
    { name: "LIVING", box: [2.09, 5.83, 4.97, 8.17] },
    { name: "MASTER BEDROOM", box: [5.01, 5.85, 8.43, 8.91] },
    { name: "KITCHEN", box: [-0.018, 3.814, 4.422, 6.814] },
    { name: "DINING", box: [0.621, 1.004, 5.241, 5.504] },
    { name: "BATH 1", box: [6.20, 4.28, 8.40, 5.55] },
    { name: "BATH 2", box: [6.35, 2.78, 8.40, 4.05] },
    // Circulation between the dining spine and the bathrooms. Unlabelled on the sheet.
    // Kept clear of the short return at the end of the bathroom wall.
    { name: "HALL", box: [5.02, 2.75, 5.85, 5.55] },
    { name: "A/C", box: [8.70, 2.78, 9.50, 3.50] },
    { name: "STUDY", box: [0.15, 0.87, 3.03, 2.07] },
    { name: "STUDY", box: [0.12, 0.12, 3.05, 0.70] },
    { name: "FOYER", box: [3.27, 0, 4.77, 0.9] },
    { name: "BEDROOM 2", box: [5.01, 0.15, 9.81, 2.55] },
  ],
  walls: [
    { x0: 0, y0: 0, x1: 0, y1: 8.02 },
    { x0: 1.575, y0: 5.717, x1: 1.575, y1: 7.034 },
    // Kitchen / living partition. It is drawn a little below the yard, but a
    // free end cannot sit in the wall graph, so the run starts on the yard wall.
    { x0: 1.8, y0: 5.717, x1: 1.8, y1: 8.02 },
    { x0: 3.142, y0: 0, x1: 3.142, y1: 0.868 },
    // Dining window on the outside face of the spine, beside the foyer.
    { x0: 4.909, y0: 0, x1: 4.909, y1: 9.053, openings: [{ at: 2.78, w: 1.26, type: "window", sill: 0.9, head: 2.1 }] },
    // Bath 1 window, and the door into bath 2. The swing is in the hall, hinged at the top.
    { x0: 6.074, y0: 2.658, x1: 6.074, y1: 5.717, openings: [
      { at: 0.12, w: 0.78, type: "door", hinge: "end", swing: -1 },
      { at: 2.16, w: 0.60, type: "window", sill: 1.1, head: 2.1 },
    ] },
    { x0: 7.593, y0: 3.888, x1: 7.593, y1: 4.156 },
    // East wall of the baths, down to bedroom 2. The A/C ledge is on its east side.
    { x0: 8.549, y0: 2.658, x1: 8.549, y1: 9.053 },
    { x0: 9.914, y0: 0, x1: 9.914, y1: 3.628 },
    // Foyer entrance. Hinge on the west jamb, leaf swings north into the foyer.
    { x0: 0, y0: 0, x1: 9.914, y1: 0, openings: [{ at: 3.28, w: 1.56, type: "door", hinge: "start", swing: 1, kind: "entry" }] },
    { x0: 3.142, y0: 0.868, x1: 4.909, y1: 0.868, openings: [{ at: 0.496, w: 0.981, type: "door", hinge: "end", swing: -1 }] },
    // Bedroom 2 door. The swing sits inside the bedroom, hinged on the west jamb.
    { x0: 4.909, y0: 2.658, x1: 9.914, y1: 2.658, openings: [{ at: 0.22, w: 0.78, type: "door", hinge: "start", swing: -1 }] },
    // North edge of the A/C ledge beside bath 2.
    { x0: 8.549, y0: 3.628, x1: 9.914, y1: 3.628 },
    { x0: 7.593, y0: 3.888, x1: 8.549, y1: 3.888 },
    // Hall door, between the dining spine and the bathrooms. Leaf swings north.
    { x0: 4.909, y0: 4.156, x1: 8.549, y1: 4.156, openings: [{ at: 0.202, w: 0.804, type: "door", hinge: "start", swing: 1 }] },
    // Yard door. The swing sits in the yard, hinged on the east jamb.
    { x0: 0, y0: 5.717, x1: 1.8, y1: 5.717, openings: [{ at: 0.80, w: 0.75, type: "door", hinge: "end", swing: -1 }] },
    // Master bedroom's south wall starts at the bathroom. The hall west of that is open.
    { x0: 6.074, y0: 5.717, x1: 8.549, y1: 5.717 },
    { x0: 0, y0: 7.034, x1: 1.8, y1: 7.034 },
    // A/C ledge parapet. The living room's north wall, east of this, is solid.
    { x0: 0, y0: 8.02, x1: 4.909, y1: 8.02, openings: [{ at: 0.08, w: 1.70, type: "rail", h: 1.05 }] },
    // Master bedroom window along the north wall.
    { x0: 4.909, y0: 9.053, x1: 8.549, y1: 9.053, openings: [{ at: 0.80, w: 2.20, type: "window", sill: 0.9, head: 2.1 }] },
    { x0: 9.633, y0: 2.658, x1: 9.633, y1: 3.628 },
    // Study door, on the line above the south wall. Leaf swings north into the study.
    { x0: 0, y0: 0.76, x1: 3.14, y1: 0.76, openings: [{ at: 1.187, w: 0.573, type: "door", hinge: "end", swing: -1 }] },
  ],
  furniture: [
    // Washer against the yard's west wall.
    ["Yard_Washer", 0.39, 6.25, 1, 1, 1],
    // Television against the living side of the dining spine.
    ["TV_Unit", 4.634, 6.50, 0, 1, 0.75],
    ["Coffee_Table", 3.55, 6.70, 0, 0.60, 0.60],
    ["Sofa", 2.55, 6.70, 0, 1.10, 0.75],
    // Wardrobe on the master's west wall. Bed headboard on the east wall.
    ["Master_Wardrobe", 5.16, 8.20, 0, 0.55, 0.55],
    ["Master_Bed", 7.54, 7.55, 2, 0.85, 0.80],
    ["Master_Bedside_L", 8.10, 6.45, 0, 1, 1],
    ["Master_Bedside_R", 8.10, 8.55, 0, 1, 1],
    // Counter along the kitchen's west wall, stopping short of the yard.
    ["Kitchen_Run", 0.39, 4.20, 1, 0.52, 1],
    ["Dining_Table", 2.46, 3.30, 0, 1.55, 0.70],
    ["Dining_Chair_L1", 2.46, 4.20, 1, 1, 1],
    ["Dining_Chair_R1", 2.46, 2.45, 3, 1, 1],
    ["Dining_Chair_L2", 3.40, 3.30, 2, 1, 1],
    ["Dining_Chair_R2", 1.55, 3.30, 0, 1, 1],
    // Toilet under the wall shared with bath 2.
    ["Bath1_Toilet", 7.15, 4.53, 1, 0.85, 0.90],
    // Bath 2 toilet under the same wall, on the south side. Shower against the east wall.
    ["MBath_Toilet", 6.55, 3.78, 3, 0.85, 0.90],
    ["MBath_Shower", 8.03, 3.40, 0, 1, 1],
    // Bed headboard on bedroom 2's south wall. Wardrobe on the west wall, clear of the door.
    ["Bed2_Bed", 7.38, 0.99, 1, 0.83, 0.79],
    ["Bed2_Wardrobe", 5.30, 0.90, 1, 0.95, 1],
    ["Bed2_Bedside", 8.45, 0.40, 0, 1, 1],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-3.469, -3.62, 12.387], tgt: [4.955, 4.525, 0.4], fov: 34 },
    { id: 'plan', name: 'Plan', pos: [4.955, 4.525, 16.351], tgt: [4.955, 4.525, 0], fov: 36 },
  ],
};
