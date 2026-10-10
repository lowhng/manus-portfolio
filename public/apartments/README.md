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


## Sunway Alishan

Four unit types from Sunway Alishan (Cheras, KL), on the same shared condo page:

| Unit | Beds | Baths | Sqft | Model |
|------|------|-------|------|-------|
| Type A1 | 3 | 2 | 1216 | [type-a1.html](sunway-alishan/type-a1.html) |
| Type A2 | 3 | 2 | 1249 | [type-a2.html](sunway-alishan/type-a2.html) |
| Type B | 4 | 3 | 1496 | [type-b.html](sunway-alishan/type-b.html) |
| Type C | 4 | 4 | 1798 | [type-c.html](sunway-alishan/type-c.html) |

[All four types →](sunway-alishan/index.html)

## Sunway Velocity 3

Three unit types from Sunway Velocity 3 (Cheras / Maluri, KL), on the same shared condo page:

| Unit | Beds | Baths | Sqft | Model |
|------|------|-------|------|-------|
| Type A | 2 | 2 | 721 | [type-a.html](sunway-velocity-3/type-a.html) |
| Type B | 3 | 2 | 926 | [type-b.html](sunway-velocity-3/type-b.html) |
| Type C | 3+1 | 2 | 1076 | [type-c.html](sunway-velocity-3/type-c.html) |

[All three types →](sunway-velocity-3/index.html)

## Architecture

```
public/shared/furniture.txt              ← original Ayanna library (Golden Leaf still uses this)
public/apartments/shared/furniture.txt   ← copy used by every apartment model
public/apartments/condos.json            ← the only condo list (catalogue + condo pages)
public/apartments/shared/condo.js        ← shared condo page
public/apartments/shared/unit-page.js    ← shared unit page
public/apartments/shared/viewer.js       ← shared three.js viewer
public/apartments/<condo>/index.html     ← stub; do not put layout HTML here
public/apartments/<condo>/data/*.js      ← that condo's unit geometry
```

**Pipeline**
1. Trace plan outer dimensions and room boxes from the PNG (manual).
2. Enter walls + furniture layout in `data/type-*.js` (manual data entry).
3. `python3 scripts/extract_furniture.py` — pulls movable furniture + kitchen/bath fixtures from Ayanna into `public/shared/furniture.txt` (Golden Leaf). Copy that file to `public/apartments/shared/furniture.txt` afterwards.
4. `node scripts/write-unit-pages.cjs` — regenerates HTML shells.
5. Viewer loads furniture, centres each piece on its footprint, places/scales per layout.

### What's manual
- Measuring room boxes and walls from the plan image
- Choosing which furniture piece goes where (and rotation/scale)
- Building any procedural pieces Ayanna doesn't have (kitchen return legs, pantry island)

### Furniture

**Reused from Ayanna** (via `public/apartments/shared/furniture.txt`, loaded relative to the viewer):
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

## Where to edit

- Shared condo page (every project): `shared/condo.js` and `shared/condo.css`. Each condo's `index.html` is a stub.
- Shared unit page (every model): `shared/unit-page.js` and `shared/unit.css`. A unit HTML file only loads `data/<id>.js`.
- Condo facts and the catalogue: `condos.json`. Adding a condo there adds it to the catalogue and, with a stub `index.html`, to its own page.
- One unit's walls, rooms, and furniture: `sunway-<condo>/data/<id>.js`.

## Moving this folder

`public/apartments/` is meant to be copied as one directory onto another host or Vercel project. Pages, the viewer, the furniture library, and the condo list all use relative URLs. This folder does not reference `/shared/...` or a weihong.dev host.

- three.js still loads from the jsDelivr CDN.
- The catalogue link to Ayanna (`../ayanna/index.html`) and the footer link (`../`) point at siblings of this folder. Change those two hrefs in `shared/catalogue.js` if this folder is served on its own.
- The theme toggle stores `apartments-theme` in localStorage and passes `?theme=light|dark` into each model. Changing the theme updates a live model without reloading it.
- Keep `public/shared/furniture.txt` if Golden Leaf stays on the same site. The apartment viewer reads `shared/furniture.txt` inside this folder.
