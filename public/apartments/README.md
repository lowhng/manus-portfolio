# Apartment Models

Interactive 3D models of Malaysian condominium units, built from real developer floor plans and furnished with Ayanna assets.

## Pilot: Sunway Cochrane

Four unit types from Sunway Cochrane (Cheras, KL):

| Unit | Beds | Baths | Sqft | Model |
|------|------|-------|------|-------|
| Type A | 1+1 | 1 | 650 | [type-a.html](sunway-cochrane/type-a.html) |
| Type B | 2 | 2 | 732 | [type-b.html](sunway-cochrane/type-b.html) |
| Type C | 2+1 | 2 | 872 | [type-c.html](sunway-cochrane/type-c.html) |
| Type D | 3 | 2 | 1001 | [type-d.html](sunway-cochrane/type-d.html) |

[View catalogue →](index.html) · [All four types →](sunway-cochrane/index.html)

## Architecture

```
public/shared/furniture.txt          ← Ayanna furniture+fixtures (base64 GLB)
public/apartments/shared/viewer.js   ← shared three.js viewer
public/apartments/sunway-cochrane/
  data/type-{a,b,c,d}.js             ← walls, rooms, furniture layout (data entry)
  type-{a,b,c,d}.html                ← thin HTML shells
  type-*-*.png                       ← source floor plans
```

**Pipeline**
1. Trace plan outer dimensions and room boxes from the PNG (manual).
2. Enter walls + furniture layout in `data/type-*.js` (manual data entry).
3. `python3 scripts/extract_furniture.py` — pulls movable furniture + kitchen/bath fixtures from Ayanna into `/shared/furniture.txt`.
4. `node scripts/write-unit-pages.cjs` — regenerates HTML shells.
5. Viewer loads furniture, centres each piece on its footprint, places/scales per layout.

### What's manual
- Measuring room boxes and walls from the plan image
- Choosing which furniture piece goes where (and rotation/scale)
- Building any procedural pieces Ayanna doesn't have (kitchen return legs, pantry island)

### Furniture

**Reused from Ayanna** (via `/shared/furniture.txt`):
Sofa, Armchair, Coffee_Table, TV_Unit, Dining_Table + chairs, Master/Bed1/Bed2 beds & bedsides & wardrobes, Master_Desk/DeskChair/Dresser, Fridge, Kitchen_Run, Kitchen_Decor/Herb, Bath1/MBath Toilet/Vanity/Shower, Yard_Washer, rugs, plants, balcony chair/table, Shoe_Cabinet.

**Made new (procedural, Ayanna materials):**
- Kitchen return cabinets (L/U kitchen short legs — Ayanna only has a straight `Kitchen_Run`)
- Pantry island (Type D) — quartz top + sage fronts matching Kitchen Sage / Quartz

**Struggled with:**
- Circular nightstands on the plans → reused rectangular Ayanna bedsides
- Square ottomans on Types B/D → reused Armchair (same scale-ish seat)
- Kitchen_Run is 4.82 m long → scaled down per unit (~0.65–0.72)
- All four types have door leaves (show / open toggles) and a 2.5 m ceiling. Walls open at full height; Lower walls drops them to 1.05 m. A pink hammer on the plan marks a wall that can be removed, drawn here in a warm tint.

### Accuracy
- Outer dimensions taken from plan millimetre labels (±~2%)
- Interior walls traced by eye from the plan drawings (±10–15% on room sizes)
- Furniture placement follows plan drawings; scale adjusted so pieces fit room boxes
- Not a survey-grade BIM model — treat as a layout guide

**Type A** walls are centreline runs. Each opening is an offset and a width along its run (`door`, `window`, or `opening`). The viewer cuts the opening out of that run, sizes the door leaf to it, and snaps any end within 5 cm onto the neighbouring centreline so the 200 mm boxes overlap at corners and T-junctions. `node scripts/check_walls.mjs` fails if an end is unattached, an opening has no type, a leaf width differs from its opening, or openings overlap or run past the wall. Thickness is the drawn stroke (~200 mm). North windows and the balcony slider are gaps in the stroke; the east dining windows are glass in a low sill. The master/hall leaf is the swing drawn in the hall, filling the opening down to the bath pier. Leaves swing 65° and, in the cutaway, are clipped to the 1.05 m cut. The pink hammer by marker 8 is a hackable wall, not a door, so the master/study partition is solid and tinted. Walls open at full height (2.5 m); ?walls=low or the Lower walls toggle drops them to 1.05 m, and door leaves are clipped to that cut. Types B, C, and D use the same centreline runs, including one hackable wall each where the plan draws a hammer. All four sit on one page at sunway-cochrane/index.html, with a single live model. Fridge and shower colours are cloned onto those meshes only.
