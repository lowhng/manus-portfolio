// Emerald 9 Tower D · Type A — 675 sqft, 2 bed / 1 bath.
// Centreline runs traced from the developer plan. Scale is the printed
// dimension arrows (separate horizontal and vertical, the sheet is not square).
// A door is placed only where a swing arc is drawn. No pink hammer on this sheet.
window.UNIT = {
  id: "tower-d-type-a",
  project: "Emerald 9",
  location: "Cheras, Selangor",
  name: "Tower D \u00b7 Type A",
  beds: 2,
  baths: 1,
  sqft: 675,
  sourceUrl: "https://guocoland.com.my/emerald9/towerd.html",
  width: 7.45,
  depth: 9.76,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.15,
  explicitWalls: true,
  // Outer-wall centres: west x=545 px, east x=987 px, south y=831.5 px.
  // The y=5.043 partition sits at y=534.5 px. Image +y is down.
  plan: {
    file: "tower-d-type-a-675sf.png",
    ox: 545,
    oy: 831.5,
    mx: 7.454 / (987 - 545),
    my: 5.043 / (831.5 - 534.5),
  },
  rooms: [
    { name: "Balcony", c: [1.45, 9.3], box: [0.15, 8.95, 2.75, 9.68] },
    { name: "A/C", c: [3.51, 9.31], box: [2.97, 8.95, 4.05, 9.68] },
    { name: "Living", c: [1.588, 7.677], box: [0.178, 6.567, 2.998, 8.787] },
    { name: "Master Bedroom", c: [4.5, 6.96], box: [3.21, 5.19, 5.79, 8.73] },
    { name: "Dining", c: [1.475, 5.595], box: [0.065, 4.455, 2.885, 6.735] },
    { name: "Bath 1", c: [4.305, 3.958], box: [3.045, 2.908, 5.565, 5.008] },
    { name: "Kitchen", c: [1.772, 2.335], box: [0.062, 0.025, 3.482, 4.645] },
    { name: "Yard", c: [6.7, 3.42], box: [6.05, 2.85, 7.35, 4.0] },
    { name: "Bedroom 2", c: [5.58, 1.38], box: [3.81, 0.15, 7.35, 2.61] },
  ],
  floors: [
    { name: "Balcony", box: [0.15, 8.95, 2.75, 9.68] },
    { name: "A/C", box: [2.97, 8.95, 4.05, 9.68] },
    { name: "Living", box: [0.178, 6.567, 2.998, 8.787] },
    { name: "Master Bedroom", box: [3.21, 5.19, 5.79, 8.73] },
    { name: "Dining", box: [0.065, 4.455, 2.885, 6.735] },
    { name: "Bath 1", box: [3.045, 2.908, 5.565, 5.008] },
    { name: "Kitchen", box: [0.062, 0.025, 3.482, 4.645] },
    { name: "Yard", box: [6.05, 2.85, 7.35, 4.0] },
    { name: "Bedroom 2", box: [3.81, 0.15, 7.35, 2.61] },
  ],
  walls: [
    { x0: 0, y0: 0, x1: 0, y1: 9.755 },
    // Entry recess returns. The leaf is on the inner line, hinge to the right.
    { x0: 1.572, y0: 0, x1: 1.572, y1: 0.238 },
    { x0: 2.941, y0: 0, x1: 2.941, y1: 0.238 },
    // Living / master partition. Lower leaf is the bath door; upper leaf swings into the master.
    { x0: 3.093, y0: 2.726, x1: 3.093, y1: 8.855, openings: [{ at: 0.618, w: 0.721, type: "door", hinge: "end", swing: 1 }, { at: 2.496, w: 0.9, type: "door", hinge: "end", swing: -1 }] },
    { x0: 3.685, y0: 0, x1: 3.685, y1: 1.673 },
    { x0: 4.124, y0: 8.855, x1: 4.124, y1: 9.755 },
    { x0: 5.366, y0: 2.726, x1: 5.366, y1: 3.133 },
    // Bath / yard door, hinge on the lower jamb, swing into the bath.
    { x0: 5.899, y0: 2.726, x1: 5.899, y1: 8.855, openings: [{ at: 0.543, w: 0.713, type: "door", hinge: "start", swing: 1, kind: "service" }] },
    { x0: 7.454, y0: 0, x1: 7.454, y1: 4.101 },
    // South wall stops at the entry recess, then continues as Bedroom 2's exterior.
    { x0: 0, y0: 0, x1: 1.572, y1: 0 },
    { x0: 1.572, y0: 0.238, x1: 2.941, y1: 0.238, openings: [{ at: 0.18, w: 1.0, type: "door", hinge: "end", swing: -1, kind: "entry" }] },
    { x0: 2.941, y0: 0, x1: 7.454, y1: 0 },
    // Bedroom 2 / yard window sits in the east part of this run.
    { x0: 3.093, y0: 2.726, x1: 7.454, y1: 2.726, openings: [{ at: 2.957, w: 1.15, type: "window", sill: 0.9, head: 2.1 }] },
    { x0: 5.366, y0: 3.133, x1: 5.899, y1: 3.133 },
    { x0: 7.175, y0: 4.101, x1: 7.454, y1: 4.101 },
    { x0: 4.082, y0: 5.043, x1: 5.899, y1: 5.043 },
    // Living slider, then the master bedroom window past the A/C ledge.
    { x0: 0, y0: 8.855, x1: 5.899, y1: 8.855, openings: [{ at: 0.228, w: 2.383, type: "slider" }, { at: 4.124, w: 1.755, type: "window", sill: 0.85, head: 2.1 }] },
    // Balcony outer edge is a glass rail. The A/C ledge keeps a solid parapet.
    { x0: 0, y0: 9.755, x1: 2.89, y1: 9.755, rail: 1.05 },
    { x0: 2.89, y0: 8.855, x1: 2.89, y1: 9.755 },
    { x0: 2.89, y0: 9.755, x1: 4.124, y1: 9.755 },
    // Yard opens north through a railing, between the bath wall and the east return.
    { x0: 5.899, y0: 4.101, x1: 7.175, y1: 4.101, rail: 1.05 },
    { x0: 3.685, y0: 1.673, x1: 3.685, y1: 2.726, openings: [{ at: 0.031, w: 0.842, type: "door", hinge: "end", swing: 1 }] },
    { x0: 3.093, y0: 5.043, x1: 4.082, y1: 5.043, openings: [{ at: 0.241, w: 0.697, type: "door", hinge: "start", swing: -1 }] },
  ],
  furniture: [
    ["Sofa", 0.519, 7.575, 2, 0.89, 0.82],
    ["TV_Unit", 2.883, 7.505, 0, 0.625, 1.235],
    ["Armchair", 0.394, 6.334, 1, 0.39, 0.41],
    ["Coffee_Table", 1.4, 7.4, 0, 0.9, 0.9],
    ["Master_Bed", 4.914, 7.41, 2, 0.818, 0.858],
    ["Master_Wardrobe", 5.035, 5.403, 3, 0.864, 0.596],
    ["Master_Bedside_L", 5.565, 6.255, 0, 0.88, 0.78],
    ["Master_Bedside_R", 5.565, 8.545, 0, 0.88, 0.78],
    ["Dining_Table", 0.889, 4.518, 0, 1.35, 0.95],
    ["Dining_Chair_L1", 0.865, 5.262, 1, 1, 1],
    ["Dining_Chair_R1", 0.871, 3.849, 3, 1, 1],
    ["Dining_Chair_L2", 1.564, 4.534, 2, 1, 1],
    ["Bath1_Toilet", 4.497, 4.616, 3, 0.91, 1.1],
    ["Bath1_Vanity", 4.235, 3.041, 1, 0.938, 3.483],
    ["Kitchen_Run", 0.378, 1.605, 1, 0.53, 0.93],
    ["Fridge", 1.085, 0.38, 0, 0.868, 0.789],
    ["Bed2_Bed", 6.01, 0.985, 1, 0.818, 0.85],
    ["Bed2_Wardrobe", 3.97, 0.83, 1, 0.92, 0.624],
    ["Bed2_Bedside", 5.01, 0.33, 0, 0.96, 0.76],
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-2.607, -3.904, 12.2], tgt: [3.725, 4.88, 0.4], fov: 34 },
    { id: 'plan', name: 'Plan', pos: [3.725, 4.88, 16.104], tgt: [3.725, 4.88, 0], fov: 36 },
  ],
};
