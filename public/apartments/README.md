# Apartment Models

Interactive 3D models of Malaysian condominium units, built from real developer floor plans.

## Pilot: Sunway Cochrane

This pilot includes 4 unit types from Sunway Cochrane (Cheras, KL):
- **Type A**: 1+1 bed, 1 bath, 650 sqft ([model](sunway-cochrane/type-a.html) · [plan](sunway-cochrane/type-a-650sf.png))
- **Type B**: 2 bed, 2 bath, 732 sqft ([model](sunway-cochrane/type-b.html) · [plan](sunway-cochrane/type-b-732sf.png))
- **Type C**: 2+1 bed, 2 bath, 872 sqft ([model](sunway-cochrane/type-c.html) · [plan](sunway-cochrane/type-c-872sf.png))
- **Type D**: 3 bed, 2 bath, 1001 sqft ([model](sunway-cochrane/type-d.html) · [plan](sunway-cochrane/type-d-1001sf.png))

[View catalogue →](index.html)

## Implementation

### Visual Style
Matches the [Ayanna E2](../ayanna/index.html) model:
- Same lighting setup (directional sun + hemisphere)
- Same materials and colors
- Same camera controls and UI pattern
- Embedded using the 16:9 full-width pattern from [/embed-test/](../embed-test/index.html)

### Pipeline
1. **Source**: Floor plans from developer brochure (PDF → PNG at 300dpi)
2. **Measurement**: Room dimensions estimated from plan proportions, calibrated to built-up sqft
3. **Modeling**: Procedural three.js geometry (floors, walls, ceilings)
4. **Furniture**: Placeholder - Ayanna assets not yet integrated (manual step)
5. **Output**: Self-contained HTML files with embedded three.js

### What's Manual
- Measuring room dimensions from floor plans (traced by eye)
- Estimating interior wall positions
- Placing furniture (not yet implemented - would reference Ayanna GLTF assets)

### Accuracy vs Plans
- **Room dimensions**: ±10-15% - estimated from visual proportions of the plan images
- **Walls**: Approximate - interior walls placed based on plan interpretation
- **Furniture**: Not yet placed - current models show empty rooms with basic floor/wall geometry
- **Materials**: Simplified - using flat colors, no textures from Ayanna yet

### Data Format
Each unit is defined by:
```javascript
{
  name: 'Type A',
  beds: '1+1', baths: 1, sqft: 650,
  rooms: [
    { name: 'Living / Dining / Kitchen', c: [2.9, 2.1], box: [0, 0, 5.8, 4.2] },
    // ... more rooms
  ],
  totalDims: [6.5, 8.5]
}
```
Coordinates in meters, origin at (0,0), Y-up in Blender space (three.js Z-up).

## Next Steps
To scale to the remaining ~51 units across 9 more projects:
1. **Automate measurement**: Computer vision or manual tracing tool to extract dimensions
2. **Furniture placement**: Load Ayanna GLTF, place instances by room type
3. **Data entry**: Structured JSON per project/unit
4. **Generator script**: Build HTML from JSON templates

**Bottleneck**: Measuring each plan by hand. With 55 units, that's ~55 × 10min = 9 hours of manual work unless automated.

## Source Data
Floor plans collected by another bot, stored in `/Floorplans/`:
- `index.csv`: 55 rows (project, unit type, beds/baths, sqft, file path, source URL)
- `malaysia/cheras/<project>/<unit>.png`: Plan images (PNG, 1984-2232px wide)
- Developer brochures: Sunway, UEM Sunrise, GuocoLand, etc.

Only Sunway Cochrane plans committed to this repo.
