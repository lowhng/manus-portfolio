// Sunway Cochrane Type A — 650 sqft / 60 m²
// Rebuilt from the floor-plan image (type-a-650sf.png).
//
// Scale: the printed 8850 mm and 8470 mm arrows land on the outer-wall
// centerlines (arrow tips x=1034..1807, y=139..880; stroke centers
// x=1033..1807.5, y=139..880).
//   sx = 8.850 / (1807.5 - 1033) m/px
//   sy = 8.470 / (880 - 139) m/px
// Origin is the bottom-left outer-wall centerline. +x right, +y toward the balcony.
// Each wall is one centreline run. Openings are offsets along that run
// (type door, window, or opening). The viewer cuts them out and sizes each
// door leaf to its opening. Ends meet on the centreline; the viewer snaps
// anything within 5 cm and overlaps the boxes, so the data has no overshoot.
// East dining windows are legend marks 3 and 4 on a continuous stroke, so
// they keep a sill. Ceiling matches Ayanna (2.5 m). Walls open at full height;
// Lower walls drops them to cutH. The pink hammer by
// marker 8 marks the master/study partition as hackable, not a door, so that
// run is a solid tinted wall. The master/hall leaf is the swing measured in
// the hall: hinge on the bath pier, closing down onto it.
//
// explicitWalls: the footprint is not a rectangle (master notch, kitchen notch,
// balcony / A/C ledge). Do not add the viewer's rectangular shell.
window.UNIT = {
  id: 'type-a',
  project: 'Sunway Cochrane',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type A',
  beds: '1+1',
  baths: 1,
  sqft: 650,
  sourceUrl: 'https://assets.sunwayproperty.com/2026/03/Sunway-Cochrane-Brochure.pdf',
  width: 8.85,
  depth: 8.47,
  wallH: 2.5,
  cutH: 1.05,
  doorH: 2.0,
  windowHead: 2.1,
  wallT: 0.20,
  explicitWalls: true,
  rooms: [
    { name: 'Master Bedroom', c: [1.35, 5.40], box: [0.12, 3.16, 2.78, 7.36] },
    { name: 'Study', c: [4.20, 6.15], box: [3.02, 4.90, 5.48, 7.36] },
    { name: 'Living', c: [7.20, 5.80], box: [5.72, 4.05, 8.73, 7.36] },
    { name: 'Dining', c: [7.15, 3.15], box: [5.72, 2.18, 8.73, 4.05] },
    { name: 'Kitchen', c: [5.20, 1.15], box: [3.70, 0.12, 6.90, 2.16] },
    { name: 'Bath', c: [3.85, 2.85], box: [2.22, 2.18, 5.48, 3.56] },
    { name: 'Hall', c: [3.90, 4.30], box: [1.98, 3.78, 5.72, 4.86] },
    { name: 'Foyer', c: [7.90, 0.35], box: [7.02, 0.12, 8.73, 0.58] },
    { name: 'Balcony', c: [7.55, 7.95], box: [6.45, 7.58, 8.73, 8.36] },
    { name: 'A/C ledge', c: [5.74, 7.95], box: [5.26, 7.58, 6.22, 8.36] },
  ],
  floors: [
    { name: 'Master Bedroom', box: [0.12, 3.16, 1.98, 7.36] },
    { name: 'Master Bedroom', box: [2.12, 4.88, 2.78, 7.36] },
    { name: 'Study', box: [3.02, 4.90, 5.48, 7.36] },
    { name: 'Hall', box: [1.98, 3.78, 5.72, 4.86] },
    { name: 'Living', box: [5.72, 4.05, 8.73, 7.36] },
    { name: 'Dining', box: [5.72, 2.18, 8.73, 4.05] },
    { name: 'Passage', box: [6.90, 0.82, 8.73, 2.18] },
    { name: 'Kitchen', box: [3.70, 0.12, 6.90, 2.16] },
    { name: 'Bath', box: [2.22, 2.18, 5.48, 3.56] },
    { name: 'Foyer', box: [7.02, 0.12, 8.73, 0.58] },
    { name: 'Balcony', box: [6.45, 7.58, 8.73, 8.36] },
    { name: 'A/C ledge', box: [5.26, 7.58, 6.22, 8.36] },
  ],
  // Centreline runs. `at` is metres from (x0, y0). hinge start|end is which
  // jamb the leaf hangs from. swing +1 is counter-clockwise in plan.
  walls: [
    // West wall of the master, from the south wall up to the north wall.
    { x0: 0, y0: 3.05, x1: 0, y1: 7.47 },
    // North wall. Windows are the stroke gaps; the balcony slider is the third.
    { x0: 0, y0: 7.47, x1: 8.85, y1: 7.47, openings: [
      { at: 0.36, w: 2.32, type: 'window', sill: 0.12, head: 2.1 },
      { at: 3.17, w: 1.66, type: 'window', sill: 0.12, head: 2.1 },
      { at: 6.47, w: 2.06, type: 'window', sill: 0.12, head: 2.1 },
    ] },
    // East wall. Dining windows keep the sill under legend marks 3 and 4.
    { x0: 8.85, y0: 0, x1: 8.85, y1: 8.47, openings: [
      { at: 2.52, w: 0.61, type: 'window', sill: 0.42, head: 2.1 },
      { at: 3.32, w: 0.66, type: 'window', sill: 0.42, head: 2.1 },
    ] },
    // Balcony and A/C ledge, north of the living room.
    { x0: 5.14, y0: 8.47, x1: 8.85, y1: 8.47 },
    { x0: 5.14, y0: 7.47, x1: 5.14, y1: 8.47 },
    { x0: 6.33, y0: 7.47, x1: 6.33, y1: 8.47 },
    // Master / study partition. The hammer means this wall can be removed.
    { x0: 2.90, y0: 4.77, x1: 2.90, y1: 7.47, hackable: true },
    // Study south wall, then the door into the hall (hinge on the living wall).
    { x0: 2.90, y0: 4.77, x1: 5.60, y1: 4.77, openings: [
      { at: 1.60, w: 1.10, type: 'door', hinge: 'end', swing: -1 },
    ] },
    // Master / hall door. The drawn swing closes onto the bath pier at x=4.40.
    { x0: 4.40, y0: 3.67, x1: 4.40, y1: 4.77, openings: [
      { at: 0, w: 0.93, type: 'door', hinge: 'end', swing: -1 },
    ] },
    // Study / living wall, and the bath's east wall below the hall.
    { x0: 5.60, y0: 4.77, x1: 5.60, y1: 7.47 },
    { x0: 5.60, y0: 2.07, x1: 5.60, y1: 3.67 },
    // Master south wall.
    { x0: 0, y0: 3.05, x1: 2.10, y1: 3.05 },
    // Bath. Two doors in the north wall, arcs into the room.
    { x0: 2.10, y0: 2.07, x1: 2.10, y1: 3.67 },
    { x0: 2.10, y0: 3.67, x1: 5.60, y1: 3.67, openings: [
      { at: 1.24, w: 0.78, type: 'door', hinge: 'start', swing: -1 },
      { at: 2.52, w: 0.78, type: 'door', hinge: 'end', swing: 1 },
    ] },
    { x0: 2.10, y0: 2.07, x1: 5.60, y1: 2.07 },
    // Kitchen left wall, and the exterior notch at its lower-left.
    { x0: 3.58, y0: 0, x1: 3.58, y1: 2.07 },
    { x0: 3.15, y0: 0, x1: 3.15, y1: 0.62 },
    { x0: 3.15, y0: 0.62, x1: 3.58, y1: 0.62 },
    // South wall, entrance door swinging into the foyer.
    { x0: 3.15, y0: 0, x1: 8.85, y1: 0, openings: [
      { at: 4.45, w: 0.90, type: 'door', hinge: 'start', swing: 1, kind: 'entry' },
    ] },
    // Foyer west wall and the inner door.
    { x0: 6.90, y0: 0, x1: 6.90, y1: 0.70 },
    { x0: 6.90, y0: 0.70, x1: 8.85, y1: 0.70, openings: [
      { at: 0.53, w: 1.20, type: 'door', hinge: 'start', swing: 1 },
    ] },
  ],
  // [asset, x, y, rotQuarters, sx?, sz?]
  // rot 0: local +X stays plan +x, local +Z goes to plan -y. Each +1 is 90° clockwise from above.
  // Heads / fronts measured from the meshes (taller side), after footprint centering:
  //   Master_Bed head -X. Bed2_Bed head +X.
  //   Master_Wardrobe long on Z, front +X. Bed2_Wardrobe long on X, front -Z.
  //   Sofa back +X (seat toward -X), length Z. TV screen -X, length Z. Kitchen_Run backsplash +Z.
  //   Dining table long on Z. L-chair backs -X (face +X); R-chair backs +X (face -X).
  //   DeskChair faces -Z. Vanity / toilet tank on +X. Fridge door -Z (back +Z).
  // Positions are the drawn symbol centres on the plan, in metres.
  furniture: [
    // Master — queen drawn x 0.16–2.10, y 4.95–6.93, head on the west; wardrobe on the south wall
    ['Master_Bed', 1.15, 6.18, 0, 0.90, 0.96],
    ['Master_Wardrobe', 1.09, 3.48, 3, 1, 0.77],
    // Study — single bed x 3.06–4.92, y 6.20–7.29, head on the west; desk under it; wardrobe on the south wall
    ['Bed2_Bed', 3.99, 6.88, 2, 0.85, 0.53],
    ['Master_Desk', 4.05, 6.13, 0],
    ['Master_DeskChair', 4.05, 5.61, 0],
    ['Bed2_Wardrobe', 3.64, 5.10, 0, 0.75, 0.75],
    // Living — sofa on the west wall facing the TV on the east wall
    ['Sofa', 6.19, 5.89, 2, 1, 0.93],
    ['Coffee_Table', 7.35, 5.90, 0],
    ['TV_Unit', 8.55, 5.90, 0],
    // Dining — table drawn x 5.71–6.97, y 2.41–3.31; two chairs north, two south
    ['Dining_Table', 6.34, 2.86, 3, 1, 0.69],
    ['Dining_Chair_L1', 6.00, 3.58, 1],
    ['Dining_Chair_R1', 6.66, 3.58, 3],
    ['Dining_Chair_L2', 6.00, 2.20, 3],
    ['Dining_Chair_R2', 6.66, 2.20, 1],
    // Kitchen — counter drawn x 4.30–5.85 on the south wall; fridge on the left wall
    ['Kitchen_Run', 5.08, 0.42, 0, 0.32, 1],
    ['Fridge', 4.05, 1.40, 1],
    // Bath — shower in the left bay, basin on the south wall, toilet to the right (tank south)
    ['Bath1_Shower', 2.68, 2.80, 0],
    ['Bath1_Vanity', 3.90, 2.42, 1],
    ['Bath1_Toilet', 5.10, 2.55, 1],
    ['Balcony_Plant_2', 8.15, 7.95, 0, 0.55, 0.55],
  ],
  procedural: [
    { kind: 'ottoman', x: 6.80, y: 4.40, rot: 0.5 },
    { kind: 'ottoman', x: 7.60, y: 4.40, rot: 0.5 },
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [-1.6, -3.6, 14.5], tgt: [4.3, 4.0, 0.4], fov: 34 },
    { id: 'plan', name: 'Plan', pos: [4.42, 4.24, 17], tgt: [4.42, 4.24, 0], fov: 40 },
    { id: 'living', name: 'Living', pos: [7.2, 3.4, 1.45], tgt: [7.2, 6.1, 0.9], hfov: 78 },
    { id: 'master', name: 'Master bedroom', pos: [1.3, 3.8, 1.45], tgt: [1.4, 6.0, 0.9], hfov: 78 },
  ],
};
