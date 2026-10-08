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
- Door slabs are not modelled. Type A cuts openings where the plan stroke breaks; Types B–D are still a solid shell with plan-traced partitions

### Accuracy
- Outer dimensions taken from plan millimetre labels (±~2%)
- Interior walls traced by eye from the plan drawings (±10–15% on room sizes)
- Furniture placement follows plan drawings; scale adjusted so pieces fit room boxes
- Not a survey-grade BIM model — treat as a layout guide

**Type A** was retraced from `type-a-650sf.png` at the printed 8850 × 8470 mm arrows (those tips land on the outer-wall centre lines). Wall thickness in the model is the drawn stroke (~200 mm), not a surveyed build-up, so the outer faces sit about one stroke outside the labelled centre lines. North windows and the balcony slider are gaps in the stroke; the east dining windows are legend marks on a continuous stroke, so they are glass in a low sill. The study-to-hall opening and the foyer inner door are as wide as the drawn gaps. The master-to-hall link has a door swing and no wall stroke, so it is left open. An orthographic overlay of the wall centre lines on the plan is the check; it is a layout guide, not BIM. Types B, C, and D are unchanged.
