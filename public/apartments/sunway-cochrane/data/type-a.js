// Sunway Cochrane Type A — 650 sqft / 60 m²
// Rebuilt from the floor-plan image (type-a-650sf.png).
//
// Scale: the printed 8850 mm and 8470 mm arrows land on the outer-wall
// centerlines (arrow tips x=1034..1807, y=139..880; stroke centers
// x=1033..1807.5, y=139..880).
//   sx = 8.850 / (1807.5 - 1033) m/px
//   sy = 8.470 / (880 - 139) m/px
// Origin is the bottom-left outer-wall centerline. +x right, +y toward the balcony.
// Wall segments are those centerlines. Thickness matches the drawn stroke (~200 mm).
// Openings are the gaps in the strokes (bedroom windows, balcony slider, doors).
// East dining windows are legend marks 3 and 4; the stroke there is continuous,
// so those are glass set in a cut wall rather than a missing stroke.
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
  wallH: 1.05,
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
  // Centerlines [x0,y0,x1,y1]. Ends that meet another wall overshoot by 0.10 m
  // so the 0.20 m boxes close the corner. Door jambs are not overshot.
  walls: [
    // West wall of the master (stops at the south wall — exterior notch below)
    [0.00, 2.95, 0.00, 7.57],
    // North wall of master / study / living, broken for windows and the balcony slider
    [-0.10, 7.47, 0.34, 7.47],
    [2.70, 7.47, 3.15, 7.47],
    [4.85, 7.47, 6.45, 7.47],
    [8.55, 7.47, 8.95, 7.47],
    // East wall. Dining windows (legend 3 and 4) sit above a sill — the plan
    // stroke is continuous there, so the footprint stays solid.
    [8.85, -0.10, 8.85, 2.50],
    [8.85, 2.50, 8.85, 4.00, 0.42],
    [8.85, 4.00, 8.85, 8.57],
    // Balcony + A/C ledge (north of the living / study)
    [5.04, 8.47, 8.95, 8.47],
    [5.14, 7.37, 5.14, 8.57],
    [6.33, 7.37, 6.33, 8.57],
    // Master / study partition, door between the two segments
    [2.90, 6.70, 2.90, 7.57],
    [2.90, 4.67, 2.90, 5.62],
    // Study south wall (tan stroke), stops at the door to the hall
    [2.80, 4.77, 4.24, 4.77],
    // Study / living wall, and the bath's east wall below the hall opening
    [5.60, 4.70, 5.60, 7.57],
    [5.60, 1.97, 5.60, 3.77],
    // Master south wall and the return that closes the bath's west side
    [-0.10, 3.05, 2.20, 3.05],
    [2.10, 1.97, 2.10, 3.77],
    // Bath north, two door openings
    [2.00, 3.67, 3.34, 3.67],
    [4.12, 3.67, 4.62, 3.67],
    [5.40, 3.67, 5.70, 3.67],
    // Bath south
    [2.00, 2.07, 5.70, 2.07],
    // Kitchen left wall, up to the bath
    [3.58, -0.10, 3.58, 2.17],
    // Exterior notch at the kitchen's lower-left
    [3.15, -0.10, 3.15, 0.72],
    [3.05, 0.62, 3.68, 0.62],
    // South wall: kitchen, then foyer with the entrance door
    [3.05, 0.00, 7.00, 0.00],
    [6.80, 0.00, 7.60, 0.00],
    [8.50, 0.00, 8.95, 0.00],
    // Foyer west and north (inner door)
    [6.90, -0.10, 6.90, 0.80],
    [6.80, 0.70, 7.43, 0.70],
    [8.63, 0.70, 8.95, 0.70],
  ],
  windows: [
    // Master bedroom window (stroke gap under marker 7)
    [0.36, 7.47, 2.68, 7.47],
    // Study window (marker 7)
    [3.17, 7.47, 4.83, 7.47],
    // Living to balcony slider
    [6.47, 7.47, 8.53, 7.47],
    // Dining east windows (markers 4 then 3)
    [8.85, 3.32, 8.85, 3.98],
    [8.85, 2.52, 8.85, 3.13],
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
    ['Master_Bed', 1.15, 5.94, 0, 0.90, 0.96],
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
    { id: 'overview', name: 'Overview', pos: [0.4, -2.2, 10.5], tgt: [4.4, 4.3, 0.3], fov: 38 },
    { id: 'plan', name: 'Plan', pos: [4.42, 4.24, 17], tgt: [4.42, 4.24, 0], fov: 40 },
    { id: 'living', name: 'Living', pos: [7.2, 3.4, 1.45], tgt: [7.2, 6.1, 0.9], hfov: 78 },
    { id: 'master', name: 'Master bedroom', pos: [1.3, 3.8, 1.45], tgt: [1.4, 6.0, 0.9], hfov: 78 },
  ],
};
