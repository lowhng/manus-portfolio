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

[View catalogue →](index.html)

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
- Type A has door leaves (show / open toggles) and a 2.5 m ceiling with a cutaway toggle. Types B–D are still a solid shell with plan-traced partitions and no door slabs

### Accuracy
- Outer dimensions taken from plan millimetre labels (±~2%)
- Interior walls traced by eye from the plan drawings (±10–15% on room sizes)
- Furniture placement follows plan drawings; scale adjusted so pieces fit room boxes
- Not a survey-grade BIM model — treat as a layout guide

**Type A** walls are centreline runs. Each opening is an offset and a width along its run (`door`, `window`, or `opening`). The viewer cuts the opening out of that run, sizes the door leaf to it, and snaps any end within 5 cm onto the neighbouring centreline so the 200 mm boxes overlap at corners and T-junctions. `node scripts/check_walls.mjs` fails if an end is unattached, an opening has no type, a leaf width differs from its opening, or openings overlap or run past the wall. Thickness is the drawn stroke (~200 mm). North windows and the balcony slider are gaps in the stroke; the east dining windows are glass in a low sill. The master/hall leaf is the swing drawn in the hall, filling the opening down to the bath pier. Leaves swing 65° and, in the cutaway, are clipped to the 1.05 m cut. The master/study arc is under marker 8, so that hinge is a judgment. The page opens with cutaway walls; turn cutaway off for the 2.5 m shell. Types B, C, and D stay on the old segment list and still render. The scale wrapper still applies when they load. Fridge and shower colours are cloned onto those meshes only.
