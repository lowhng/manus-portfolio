/**
 * Category and measured footprint for every Ayanna piece the viewer can spawn.
 *
 * Sizes are the axis-aligned bounds of each root in public/apartments/shared/furniture.txt
 * after the glTF node transforms, in metres. The viewer centres XZ on that box and
 * scales X by sx and Z by sz. `back` is the local axis that sits against the wall
 * (+x, -x, +z, -z), from the mesh notes on the Sunway Cochrane Type A model.
 * `thin` is the local axis a wall-mounted sheet is normal to; either sign may face
 * the wall. `centerY` is the natural vertical centre when the mesh sits as authored.
 */

export const FURNITURE = {
  Armchair: { category: 'freestanding', w: 1.018, d: 1.018, maxY: 0.942 },
  Balcony_Chair_1: { category: 'freestanding', w: 0.750, d: 0.765, maxY: 0.942 },
  Balcony_Chair_2: { category: 'freestanding', w: 0.750, d: 0.765, maxY: 0.942 },
  Balcony_Plant_1: { category: 'freestanding', w: 1.114, d: 0.955, maxY: 1.537 },
  Balcony_Plant_2: { category: 'freestanding', w: 0.827, d: 0.861, maxY: 0.980 },
  Balcony_SideTable: { category: 'freestanding', w: 0.440, d: 0.440, maxY: 0.450 },
  Bath1_Shower: { category: 'fixture', w: 0.829, d: 0.741, maxY: 2.160 },
  Bath1_Toilet: { category: 'wall-backed', back: '+x', w: 0.710, d: 0.400, maxY: 0.808 },
  Bath1_Vanity: { category: 'wall-backed', back: '+x', w: 0.480, d: 0.600, maxY: 1.950 },
  Bed1_Bed: { category: 'wall-backed', back: '+x', w: 2.189, d: 1.764, maxY: 1.150, overlap: 'bed' },
  Bed1_Bedside_A: { category: 'freestanding', w: 0.418, d: 0.500, maxY: 0.970, overlap: 'bedside' },
  Bed1_Bedside_B: { category: 'freestanding', w: 0.418, d: 0.500, maxY: 0.970, overlap: 'bedside' },
  Bed1_Wardrobe: { category: 'wall-backed', back: '+z', w: 1.800, d: 0.625, maxY: 2.400 },
  Bed2_Bed: { category: 'wall-backed', back: '+x', w: 2.189, d: 1.764, maxY: 1.150, overlap: 'bed' },
  Bed2_Bedside: { category: 'freestanding', w: 0.418, d: 0.500, maxY: 0.970, overlap: 'bedside' },
  Bed2_Plant: { category: 'freestanding', w: 0.853, d: 0.988, maxY: 1.048 },
  Bed2_Wardrobe: { category: 'wall-backed', back: '+z', w: 1.500, d: 0.625, maxY: 2.400 },
  Coffee_Table: { category: 'freestanding', w: 0.840, d: 0.840, maxY: 0.635 },
  Dining_Art: { category: 'wall-mounted', thin: 'x', w: 0.038, d: 1.200, maxY: 1.950, centerY: 1.550, mount: 'mirror' },
  Dining_Chair_L1: { category: 'freestanding', w: 0.460, d: 0.460, maxY: 0.840, overlap: 'chair' },
  Dining_Chair_L2: { category: 'freestanding', w: 0.460, d: 0.460, maxY: 0.840, overlap: 'chair' },
  Dining_Chair_L3: { category: 'freestanding', w: 0.460, d: 0.460, maxY: 0.840, overlap: 'chair' },
  Dining_Chair_R1: { category: 'freestanding', w: 0.460, d: 0.460, maxY: 0.840, overlap: 'chair' },
  Dining_Chair_R2: { category: 'freestanding', w: 0.460, d: 0.460, maxY: 0.840, overlap: 'chair' },
  Dining_Chair_R3: { category: 'freestanding', w: 0.460, d: 0.460, maxY: 0.840, overlap: 'chair' },
  Dining_Pendant_1: { category: 'ceiling', w: 0.380, d: 0.380, maxY: 3.000 },
  Dining_Pendant_2: { category: 'ceiling', w: 0.380, d: 0.380, maxY: 3.000 },
  Dining_Pendant_3: { category: 'ceiling', w: 0.380, d: 0.380, maxY: 3.000 },
  Dining_Table: { category: 'freestanding', w: 0.900, d: 1.800, maxY: 0.955, overlap: 'table' },
  Foyer_Mirror: { category: 'wall-mounted', thin: 'z', w: 0.600, d: 0.038, maxY: 2.100, centerY: 1.650, mount: 'mirror' },
  Fridge: { category: 'wall-backed', back: '+z', w: 0.680, d: 0.735, maxY: 1.850 },
  Kitchen_Decor: { category: 'countertop', w: 2.490, d: 0.475, maxY: 1.350, overlap: 'ontop' },
  Kitchen_Herb: { category: 'countertop', w: 0.601, d: 0.637, maxY: 1.358, overlap: 'ontop' },
  Kitchen_Run: { category: 'wall-backed', back: '+z', w: 4.820, d: 0.620, maxY: 2.250, overlap: 'counter' },
  Living_Plant_L: { category: 'freestanding', w: 1.159, d: 1.203, maxY: 1.735 },
  Living_Plant_R: { category: 'freestanding', w: 0.907, d: 0.864, maxY: 1.326 },
  MBath_Shower: { category: 'fixture', w: 0.884, d: 0.775, maxY: 2.160 },
  MBath_Toilet: { category: 'wall-backed', back: '+x', w: 0.710, d: 0.400, maxY: 0.808 },
  MBath_Vanity: { category: 'wall-backed', back: '+x', w: 0.480, d: 0.800, maxY: 1.950 },
  Master_Art: { category: 'wall-mounted', thin: 'x', w: 0.038, d: 0.600, maxY: 1.950, centerY: 1.550, mount: 'mirror' },
  Master_Bed: { category: 'wall-backed', back: '-x', w: 2.189, d: 2.074, maxY: 1.150, overlap: 'bed' },
  Master_Bedside_L: { category: 'freestanding', w: 0.418, d: 0.500, maxY: 0.970, overlap: 'bedside' },
  Master_Bedside_R: { category: 'freestanding', w: 0.418, d: 0.500, maxY: 0.970, overlap: 'bedside' },
  Master_Desk: { category: 'wall-backed', back: '-z', w: 1.100, d: 0.500, maxY: 1.155, overlap: 'desk' },
  Master_DeskChair: { category: 'freestanding', w: 0.460, d: 0.460, maxY: 0.840, overlap: 'chair' },
  Master_Dresser: { category: 'wall-backed', back: '+x', w: 0.450, d: 1.000, maxY: 0.780 },
  Master_Plant: { category: 'freestanding', w: 0.883, d: 0.943, maxY: 1.217 },
  Master_Wardrobe: { category: 'wall-backed', back: '-x', w: 0.625, d: 2.400, maxY: 2.400 },
  Rug_Bed1: { category: 'rug', w: 2.000, d: 2.400, maxY: 0.012, overlap: 'rug' },
  Rug_Living: { category: 'rug', w: 2.200, d: 2.800, maxY: 0.012, overlap: 'rug' },
  Rug_Master: { category: 'rug', w: 2.000, d: 2.800, maxY: 0.012, overlap: 'rug' },
  Shoe_Cabinet: { category: 'wall-backed', back: '+z', w: 1.000, d: 0.350, maxY: 1.000 },
  Sofa: { category: 'freestanding', w: 0.965, d: 2.300, maxY: 0.976 },
  Sofa_Art_1: { category: 'wall-mounted', thin: 'x', w: 0.038, d: 0.600, maxY: 1.950, centerY: 1.550, mount: 'mirror' },
  Sofa_Art_2: { category: 'wall-mounted', thin: 'x', w: 0.038, d: 0.600, maxY: 1.950, centerY: 1.550, mount: 'mirror' },
  TV_Unit: { category: 'wall-backed', back: '+x', w: 0.400, d: 2.000, maxY: 1.880 },
  Yard_Washer: { category: 'wall-backed', back: '+z', w: 0.600, d: 0.635, maxY: 0.850 },
};

export const PROCEDURAL = {
  ottoman: { category: 'freestanding', w: 0.55, d: 0.55, maxY: 0.42 },
  stool: { category: 'freestanding', w: 0.34, d: 0.34, maxY: 0.70 },
  // Front of the carcass is local +Z, so the back against the wall is -Z.
  kitchen_cabinet: { category: 'wall-backed', back: '-z', maxY: 0.94, overlap: 'counter' },
  kitchen_island: { category: 'freestanding', maxY: 0.94, overlap: 'counter' },
  mirror: { category: 'wall-mounted', thin: 'z', w: 0.60, d: 0.04, maxY: 2.05, centerY: 1.50, mount: 'mirror' },
  tv: { category: 'wall-mounted', thin: 'z', w: 0.90, d: 0.04, maxY: 1.70, centerY: 1.20, mount: 'tv' },
};

export const MOUNT_RANGE = {
  mirror: [1.15, 1.85],
  tv: [0.95, 1.55],
};
