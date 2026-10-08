// Sunway Cochrane Type A — 650 sqft / 60 m²
// Plan outer: 8.85 × 8.47 m. Origin: bottom-left of plan, Y toward balcony.
window.UNIT = {
  id: 'type-a',
  project: 'Sunway Cochrane',
  location: 'Cheras, Kuala Lumpur',
  name: 'Type A',
  beds: '1+1',
  baths: 1,
  sqft: 650,
  sourceUrl: 'https://assets.sunwayproperty.com/2026/03/Sunway-Cochrane-Brochure.pdf',
  // Overall footprint
  width: 8.85,
  depth: 8.47,
  wallH: 2.8,
  wallT: 0.12,
  // Rooms: box [x0,y0,x1,y1], label centre [cx,cy]
  rooms: [
    { name: 'Master Bedroom', c: [1.85, 6.55], box: [0.12, 4.55, 3.70, 8.35] },
    { name: 'Study', c: [4.55, 6.55], box: [3.70, 4.90, 5.55, 8.35] },
    { name: 'Living', c: [7.15, 6.40], box: [5.55, 4.40, 8.73, 7.55] },
    { name: 'Balcony', c: [7.40, 8.00], box: [5.95, 7.55, 8.73, 8.35] },
    { name: 'Dining / Kitchen', c: [6.80, 2.40], box: [4.40, 0.12, 8.73, 4.40] },
    { name: 'Bathroom', c: [2.20, 2.55], box: [0.12, 0.12, 3.55, 4.55] },
    { name: 'Foyer', c: [7.80, 0.70], box: [7.00, 0.12, 8.73, 1.40] },
  ],
  // Interior wall segments [x0,y0,x1,y1] (excludes outer shell, which is auto-built)
  walls: [
    // Master / bath divider (horizontal)
    [0.12, 4.55, 3.70, 4.55],
    // Master / study (vertical), door gap ~0.9
    [3.70, 5.80, 3.70, 8.35],
    [3.70, 4.55, 3.70, 4.90],
    // Study south wall
    [3.70, 4.90, 5.55, 4.90],
    // Study / living
    [5.55, 4.90, 5.55, 8.35],
    // Living south (open to dining — partial)
    [5.55, 4.40, 5.55, 4.90],
    // Hall spine between bath and kitchen
    [3.55, 0.12, 3.55, 2.80],
    [3.55, 3.70, 3.55, 4.55],
    // Bath north (toward master) already at y=4.55
    // Kitchen / foyer partial
    [7.00, 1.40, 8.73, 1.40],
    // Balcony divider
    [5.95, 7.55, 8.73, 7.55],
    // AC ledge wall left of balcony
    [5.55, 7.55, 5.95, 7.55],
    [5.55, 7.55, 5.55, 8.35],
  ],
  // Furniture: [asset, x, y, rotQuarters, sx?, sz?]
  // rot: 0 = asset default, each +1 = 90° CW from above (matches Ayanna)
  furniture: [
    // Master bedroom — bed against north window, wardrobe on south wall
    ['Rug_Master', 1.85, 6.70, 0],
    ['Master_Bed', 1.85, 7.20, 0],
    ['Master_Bedside_L', 0.70, 7.20, 0],
    ['Master_Bedside_R', 3.00, 7.20, 0],
    ['Master_Wardrobe', 1.85, 4.90, 0, 0.72, 1],
    ['Master_Dresser', 0.55, 5.40, 1],
    // Study — single bed + desk
    ['Bed2_Bed', 4.55, 7.20, 0, 0.85, 0.85],
    ['Master_Desk', 5.20, 6.10, 1],
    ['Master_DeskChair', 4.85, 6.10, 1],
    ['Bed2_Wardrobe', 4.00, 5.25, 0, 0.7, 1],
    // Living — sofa on west wall, TV on east
    ['Rug_Living', 7.10, 6.00, 0, 0.85, 0.75],
    ['Sofa', 6.00, 6.10, 1],
    ['Coffee_Table', 7.00, 6.10, 0],
    ['TV_Unit', 8.35, 6.10, 3, 0.85, 1],
    ['Living_Plant_R', 7.80, 7.20, 0],
    // Dining — 4 chairs
    ['Dining_Table', 6.40, 3.20, 0, 0.85, 1],
    ['Dining_Chair_L1', 5.85, 2.75, 0],
    ['Dining_Chair_L2', 5.85, 3.65, 0],
    ['Dining_Chair_R1', 6.95, 2.75, 2],
    ['Dining_Chair_R2', 6.95, 3.65, 2],
    // Kitchen — L-run along south + short return; scale Kitchen_Run to ~3.4m
    ['Kitchen_Run', 5.90, 0.45, 0, 0.70, 1],
    ['Fridge', 7.55, 0.55, 0],
    ['Kitchen_Decor', 5.90, 0.55, 0, 0.55, 1],
    // Bathroom
    ['Bath1_Vanity', 0.55, 3.60, 1],
    ['Bath1_Toilet', 0.55, 2.40, 1],
    ['Bath1_Shower', 0.70, 0.90, 0],
    // Foyer
    ['Shoe_Cabinet', 8.30, 0.90, 3],
    // Balcony
    ['Balcony_Plant_1', 6.50, 7.95, 0],
  ],
  // Procedural pieces (Ayanna has no matching asset)
  procedural: [
    // Kitchen return leg (L-shape short side along east of kitchen run area)
    { kind: 'kitchen_cabinet', x: 7.35, y: 1.55, w: 0.60, d: 1.60, rot: 1, label: 'Kitchen return' },
  ],
  views: [
    { id: 'overview', name: 'Overview', pos: [1.5, -4.5, 12], tgt: [4.4, 4.2, 0], fov: 40 },
    { id: 'plan', name: 'Plan', pos: [4.4, 4.2, 18], tgt: [4.4, 4.2, 0], fov: 38 },
    { id: 'living', name: 'Living', pos: [7.1, 1.5, -4.2], tgt: [7.1, 1.1, -6.2], hfov: 96 },
    { id: 'master', name: 'Master bedroom', pos: [1.85, 1.5, -5.2], tgt: [1.85, 1.0, -7.0], hfov: 96 },
  ],
};
