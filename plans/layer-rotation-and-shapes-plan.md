# Layer rotation, and shape layers with fill and border

*Implemented as described here; the few places the code forced a different choice are noted
inline ("built:") and in the commit messages.*

## Context

Every layer has a position, an anchor and a size; nothing in the model, the renderers or the
designer knows about rotation. The palette's **Shape** chip creates a `rect` layer: a rectangle
with a solid or linear-gradient fill and a corner radius, and nothing else - no border, no other
outline. Editors want to tilt a label or a badge row, and to draw circles, rules and outlined
boxes without pre-rendering them into the base image.

Two features, one plan, because they meet in the same places (the layer box on the canvas, the
renderers, the bounds contract):

1. **Rotate** on every layer type.
2. **Shape layers**: rectangle, ellipse, polygon and star, each with a fill (solid, gradient or
   none) and an optional border.

### Decisions (made in the planning session - overturn any before implementing)

- **Rotation is a property of `LayerBase`**, in degrees, **clockwise positive**, default 0, and it
  turns the layer **about its anchor point** (the resolved position, so a tracked axis still
  works). The anchor is the one point whose place is known without a size - an auto-height text
  layer has no centre until the server measures it - and every new layer is created with a
  `middleCentre` anchor, so in practice most rotations feel like "spin around the middle". CSS
  `rotate()` on a y-down canvas and ImageSharp's `Rotate` share the clockwise-positive convention,
  so the designer and the render agree without a sign flip anywhere.
- **Shapes extend the existing `rect` layer rather than adding a new type.** The discriminator
  stays `"rect"` and the C# class stays `RectLayer`: every stored template, export file and the
  v1 importer remain valid, an older package reading a newer document just draws a rectangle, and
  the UI already calls the layer "Shape". It gains `shape` (rectangle | ellipse | polygon |
  star), `sides`, `innerRatio` and `border`.
- **`LayerBounds` keeps reporting the unrotated layout box** and gains `Rotation`, `PivotX`,
  `PivotY`. Anything that needs the on-canvas footprint (relative positioning's edges, the
  designer's measured overlay) derives the axis-aligned **extent** from those through one shared
  maths module. Reason: the designer uses the measured height as an auto-height text layer's
  height, which must stay the line-box height, not the height of a tilted box.
- **No schema version bump.** Both changes are additive with defaults, the same shape as the
  badge layout options and relative references were; the migrator's "version 3 goes here" hook
  stays unused because there is nothing to rewrite.
- **A border is drawn inside the box**, the way an image layer's border and a CSS border are.
- Out of scope: rotating the canvas or base image; skewing; per-corner radii; a "line" shape (a
  thin rotated rectangle is one).

### Library facts (verified against the packages the project pins, 2026-09-19)

SixLabors.ImageSharp.Drawing **2.1.5** (pulls ImageSharp 3.1.6 and Fonts 2.0.8):

- `DrawingOptions.Transform` is a `Matrix3x2` "applied during rasterization". `FillPathProcessor`
  does `Region.Transform(Options.Transform)` and **does not transform the brush**, so a gradient's
  start/end points have to be transformed by hand. `RichTextGlyphRenderer` composes
  `Options.Transform` into every glyph and decoration outline, so **text rotates by setting
  `Transform` and nothing else** - `Origin` is the anchor point, and a rotation matrix about that
  point spins the block in place.
- Paths: `IPath.Transform(Matrix3x2)`, `RectangularPolygon`, `EllipsePolygon(PointF centre,
  SizeF size)` (non-circular is fine), `Polygon(PointF[] points)`; `RegularPolygon`/`Star` exist
  but are radius-based, so the plan generates vertices itself to share the maths with the client.
- Pens: `SolidPen(colour, width)`; `PenOptions.JointStyle = JointStyle.Round` stops star points
  spiking past the box.
- ImageSharp `ctx.Rotate(degrees)` rotates about the image centre, **grows the canvas to the
  rotated bounding box** (transparent fill), positive = clockwise. That is how the image and
  badge layers rotate: rotate the overlay, then place its centre where the box's centre lands.
  `AffineTransformBuilder.PrependRotationDegrees(degrees, origin)` is the alternative if the
  extra canvas ever matters; not needed here.

The container has no .NET SDK preinstalled; install it with the script in `CLAUDE.md` (verified:
.NET 10.0.401 installs in under a minute and the existing 342 tests pass). Node 22 is available
for the client.

## Design

### The rotation contract (mirrored, fixture-tested)

`Core/Rendering/RotationMath.cs` and `Client/src/models/rotation.ts`, both verified against
`Client/src/models/rotation-fixtures.json` (the `anchor-fixtures.json` pattern: one JSON file,
read by `RotationMathTests.cs` and `rotation.test.ts`). Test project copies it to the output
folder like the two existing fixtures.

- `Normalise(degrees)` → the equivalent angle in `(-180, 180]`.
- `RotatePoint(px, py, pivotX, pivotY, degrees)`: with `dx = px - pivotX`, `dy = py - pivotY`,
  `x' = pivotX + dx·cos θ - dy·sin θ`, `y' = pivotY + dx·sin θ + dy·cos θ`. On a y-down canvas a
  positive angle takes "right of the pivot" to "below the pivot" - clockwise on screen, the CSS
  convention. `ToLocal(...)` is the same with `-degrees`.
- `Extent(left, top, width, height, pivotX, pivotY, degrees)` → the axis-aligned bounding box of
  the four rotated corners. **`degrees == 0` returns the input unchanged** (exact, no float
  noise, so an unrotated layer's numbers are bit-identical to today's).
- C#-only: `Matrix(pivotX, pivotY, degrees)` = `Matrix3x2.CreateRotation(θ, new Vector2(pivotX,
  pivotY))`; a test asserts `Vector2.Transform` agrees with `RotatePoint` on every fixture case,
  which is what lets the renderers use the matrix while the layout code uses the point maths.

Fixture cases: 0°, 90°, 180°, -90°, 45° and 30° about a corner, the centre and an external
pivot; the extent of a 100×20 box rotated 90° about its top-left (`left-20..left`,
`top..top+100`); normalisation of 270, -270, 360, 540.

### The shape contract (mirrored, fixture-tested)

`Core/Rendering/Layers/ShapeGeometry.cs` and `Client/src/models/shape-geometry.ts`, verified
against `Client/src/models/shape-fixtures.json`:

- `Vertices(kind, sides, innerRatio)` → points in the unit square, centre `(0.5, 0.5)`, radius
  `0.5`. Polygon: `n` points, point `i` at angle `-90° + i·360°/n` (first point at the top). Star:
  `2n` points at `-90° + i·180°/n`, alternating the outer radius `0.5` and the inner radius
  `0.5·innerRatio`. `sides` is clamped to 3..12 and `innerRatio` to 0.1..0.9 here, so both sides
  clamp identically; the limits are public constants (`MinSides`/`MIN_SIDES` etc.) with
  `ClampSides`/`ClampInnerRatio` helpers, which the validator and the inspector's min/max use.
  The client module also has `clipPathFor(kind, sides, innerRatio)` → the CSS `polygon(...)` in
  percentages, or undefined for the two primitives.
- The points are scaled to the layer's box (`left + x·width`, `top + y·height`), so a polygon
  fills a non-square box by stretching, exactly as CSS `clip-path: polygon(%)` does. Rectangle and
  ellipse have no vertex list; they are primitives on both sides.

### Model

- `Core/Models/Layers/LayerBase.cs`: `public float Rotation { get; set; }` with a doc comment
  (degrees, clockwise, about the anchor point). JSON `rotation`; absent → 0.
- `Core/Models/Layers/RectLayer.cs`:
  - `ShapeKind` enum with `[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]` and
    `[JsonStringEnumMemberName]` for `rectangle`, `ellipse`, `polygon`, `star` (the repo pins every
    enum name this way so the host's serializer agrees - see `TemplateJsonTests`).
  - `Shape` (default `Rectangle`), `Sides` (int, default 5, polygon and star), `InnerRatio`
    (float, default 0.5, star only), `Border` (`ShapeBorder?` with `Width` and `Colour =
    "#FFFFFF"`; a new small class rather than reusing `ImageBorder`, whose name would mislead
    on a shape). `CornerRadius` now applies to `Rectangle` only.
  - Class summary updated: "A filled and/or outlined shape - scrims, colour blocks, rules,
    circles behind icons."
- `Core/Rendering/ILayerRenderer.cs`: `LayerBounds` gains `float Rotation = 0f, float PivotX =
  0f, float PivotY = 0f` **at the end, with defaults**, so the four renderers' and the tests'
  positional constructions keep compiling; add `public (float X, float Y, float Width, float
  Height) Extent()` delegating to `RotationMath.Extent`. Interface doc: a renderer reads
  `layer.Rotation` and reports the unrotated box plus the pivot; a third-party renderer that
  ignores rotation still works (it draws unrotated and reports `Rotation = 0`).
- `Api/Models/ApiModels.cs`: `LayerBoundsResponse` gains `Rotation`, `PivotX`, `PivotY`;
  `PreviewController` maps them.

### Rendering

- `Core/Rendering/RelativeLayout.cs` `ResolveAxis`: read `bounds.Extent()` instead of `bounds.X/
  Y/Width/Height` - one line per edge. Everything else (cycles, chains, problems) is untouched.
  The fixture format needs no change: its `bounds` are already "what the reference covered", so a
  rotated-reference case simply supplies the extent.
- `Layers/RectLayerRenderer.cs`:
  - `HasFill` → `HasPaint`: a gradient, a parseable fill, **or** a border with `Width > 0` and a
    parseable colour. A border-only shape draws and occupies its box.
  - `Layout` unchanged (missing dimension = whole canvas). `pivot = context.PositionOf(rect)`.
  - `ShapePath.Build(rect, x, y, w, h)` (new static class next to `RoundedRectangle`): rectangle →
    `RoundedRectangle.Build` (radius 0 falls through to `RectangularPolygon` as today); ellipse →
    `new EllipsePolygon(new PointF(x + w/2, y + h/2), new SizeF(w, h))`; polygon/star →
    `new Polygon(ShapeGeometry.Vertices(...) scaled to the box)`.
  - Fill path for the box; border path for the box **deflated by `Width / 2`** on every side, so
    the stroke, centred on that outline, lies inside the box (the image layer's inset trick,
    generalised). A rectangle's border path uses `max(0, CornerRadius - Width / 2)` as its
    radius, so the stroke's *outer* edge has the layer's corner radius, as a CSS border does
    and as the designer draws it (built: the image layer keeps its own, unchanged, behaviour).
    Draw the fill (gradient or solid) then the border with
    `new SolidPen(new PenOptions(colour, width) { JointStyle = JointStyle.Round })`, both with the
    layer opacity as `BlendPercentage` as today. The border is skipped when the box is no wider
    or taller than the stroke.
  - Rotation ≠ 0: `matrix = RotationMath.Matrix(pivot, rotation)`; `fill = fill.Transform(matrix)`,
    `border = border.Transform(matrix)`, and `BuildGradientBrush` transforms its `start`/`end`
    with `Vector2.Transform(point, matrix)` because the brush is not transformed by the fill.
  - Bounds: `new LayerBounds(key, x, y, w, h, 0, false, null, rect.Rotation, pivot.X, pivot.Y)`.
- `Layers/TextLayerRenderer.cs`: in `RenderAsync`, when `text.Rotation != 0`,
  `drawingOptions.Transform = RotationMath.Matrix(position.X, position.Y, text.Rotation)`. Bounds
  gain rotation and pivot; nothing else changes, and `MeasureAsync` still shares `LayoutAsync`.
- `Layers/ImageLayerRenderer.cs`: after resize, corners and border, when rotated:
  `overlay.Mutate(ctx => ctx.Rotate(rotation))`; the box centre `C = (x + w/2, y + h/2)` maps to
  `C' = RotatePoint(C, pivot, rotation)`; draw at `(round(C'.x - overlay.Width/2), round(C'.y -
  overlay.Height/2))`. Bounds report the unrotated `(x, y, w, h)` plus rotation and pivot;
  `MeasureAsync` does the same without touching pixels.
- `Layers/BadgesLayerRenderer.cs`: `Rotation == 0` keeps the current direct-draw path untouched
  (that path is deliberately pixel-identical to v1 imports). Otherwise: extract the per-slot
  drawing into `DrawRun(Image target, BadgesPlan plan, float originX, float originY)`, render the
  run into a transparent `Image<Rgba32>` of `ceil(TotalWidth) × ceil(TotalHeight)` **plus
  `ceil(BorderWidth)` of padding on every side** (a circle's border stroke is centred on its
  edge and would otherwise be clipped), at origin `(padding, padding)`, with the per-element
  opacity applied exactly as now, then composite it like the image layer (rotate, place the
  centre, `DrawImage(scratch, point, 1f)`). Bounds as for images.
- `DynamicImageRenderer`, `HealthService`, `LegacyConfigImporter`, `SampleData`: no change. v1
  configuration has neither rotation nor shapes, so imported layers get the defaults.

### Validation (`Core/Services/TemplateValidator.cs`)

- `RectLayer`: `NoFill` condition and message become "has no fill, gradient or border, so nothing
  is drawn". `RequireColour(border.Colour)` when a border is set. New warnings
  `ShapeSidesInvalid` (polygon/star with `Sides` outside 3..12: "…will be drawn with N sides")
  and `ShapeInnerRatioInvalid` (star with `InnerRatio` outside 0.1..0.9). The renderer clamps
  either way.
- Rotation needs no rule: any finite number is meaningful and JSON cannot carry NaN. The
  inspector normalises what it writes.

### Backoffice client (`src/DynamicImages/Client`)

- `api/types.ts`: `DiLayerBase.rotation: number`; `ShapeKind`; `DiRectLayer` gains `shape`,
  `sides`, `innerRatio`, `border?: { width; colour } | null`; `DiLayerBounds` gains `rotation`,
  `pivotX`, `pivotY`.
- `models/layer-factories.ts`: every factory sets `rotation: 0`; `createRectLayer(context, name =
  "Shape", shape: ShapeKind = "rectangle")` sets `shape`, `sides: 5`, `innerRatio: 0.5`,
  `border: null`, names an ellipse "Ellipse" and makes it 200×200 (a circle is the ellipse
  people reach for) where a rectangle stays 400×200. Read `layer.rotation ?? 0` wherever a
  layer is consumed, for in-memory layers created before this change.
- `models/rotation.ts`, `models/shape-geometry.ts` + tests + the two fixtures (above).
- `models/relative-layout.ts`: `Positioned` gains `rotation?: number`; `ResolvedLayer` gains
  `extent: Box` (`extent(box, position, rotation)`); `resolveAll` hands `resolve(reference).extent`
  to `boundsOf`. `resolvePosition`'s contract is unchanged ("`boundsOf` returns what the reference
  covered"), so the existing fixture cases pass as they are; add one case where the supplied
  bounds are a rotated title's extent.
- `designer/di-property-palette.element.ts`: the **Shape** chip becomes **Rectangle**
  (`icon-stop`) and **Ellipse** (`icon-record`) (`PalettePayload` static variant gains
  `shape?: ShapeKind`); polygon and star are a select away in the inspector, where their sides
  and ratio live anyway.
  `workspace/views/di-design-view.element.ts` passes `payload.shape` to `createRectLayer`.
- `designer/di-layer-inspector.element.ts`:
  - **Shape** box: Shape select (Rectangle / Ellipse / Polygon / Star); **Sides** (polygon:
    "Sides", star: "Points", 3–12); **Inner ratio** (star, step 0.05, 0.1–0.9); **Fill** toggle
    (off → `fill: null`; on → colour input, default `#000000`) matching the existing Gradient
    toggle; Gradient as today; **Corner radius** only for rectangle; **Border** width + colour
    with the image layer's "width 0 → null" pattern.
  - **Layout** box: **Rotation** `di-number-field`, suffix `°`, step 1, writing
    `normalise(value)`; hint "Clockwise, around the anchor point." plus a pointer to the canvas
    handle and Shift. The anchor hint gains a sentence when rotated: "The layer turns around
    this point."
- `designer/di-layer-box.element.ts`:
  - `.box` gets `transform: rotate(<deg>deg)` and `transform-origin: <(position.x - box.x)·scale>px
    <(position.y - box.y)·scale>px`, the pivot being the resolved position - the same numbers the
    anchor marker already uses. `.chrome` gets the identical transform and origin, so the ring,
    handles and anchor dot turn with the layer; the `.tag` label counter-rotates about its own
    bottom-left so it stays readable.
  - **Rotation handle**: a small round handle centred above the `n` handle (a fixed screen
    distance, e.g. 18px, `cursor: grab`), dispatching `di-layer-drag-start` with `handle:
    "rotate"`. `ResizeHandle` stays the eight edges; a new `DragHandle = ResizeHandle | "rotate"`
    is what the event carries.
  - Measured overlay: the dashed box is the server's unrotated box with the same rotate transform
    about `(pivotX - x, pivotY - y)`, so it lands exactly where the server drew.
  - `#renderRect` → `#renderShape`: rectangle and ellipse are a div with `border-radius`
    (`50%` for the ellipse), `border: <width·scale>px solid <colour>` (the box is
    `border-box`, so the border is inside, as on the server) and the fill or gradient as
    background; polygon and star are an outer div clipped by `clip-path: polygon(...)` from
    `shape-geometry.ts` and painted in the border colour, with an inner div inset by the border
    width, clipped by the same polygon, painted with the fill or gradient - the standard CSS
    approximation of an inside stroke on a clipped shape. `fill ?? "transparent"`.
- `designer/di-designer-canvas.element.ts`:
  - `#boxOf` stays the unrotated box (it positions the DOM); new `#extentOf(layer)` and
    `#positionOf(layer)` from the resolved entry, and `#toImagePoint` (the unrounded client →
    image conversion, for the angle maths). Snap candidates (`others`) use extents.
  - **Move** of a rotated layer snaps by its extent: at drag start record the extent (its offset
    from the box *and its size* are constant during a move, because the pivot moves with the
    box), snap the proposed box shifted by that offset and sized as the extent, then subtract
    the offset again. Unrotated layers take exactly today's path.
  - **Resize** of a rotated layer: convert the pointer delta into the layer's local frame with
    `toLocal` (rotate the vector by `-rotation`), run `#resizeBox` unchanged in local space, then
    the new position is the local anchor point of the new box (`topLeftToAnchor`) mapped back
    through `rotatePoint(…, pivot, rotation)` with the pivot being the position at drag start. No
    snapping and no guides while resizing a rotated layer. Tracked-axis locks apply in local space
    as today.
  - **Rotate gesture** (`handle === "rotate"`): record the pivot (resolved position, image px),
    `startAngle = atan2(pointer - pivot)` and the starting rotation; on move, `rotation =
    normalise(start + (atan2(now - pivot) - startAngle) in degrees)`, rounded to 0.1°, or to the
    nearest 15° with Shift; dispatch `di-layer-change` with `{ rotation }`. One transaction per
    gesture, as for moves, so a whole spin is one undo step.
  - `#fallbackWidth/Height` keep reading `offsetWidth/Height`, which CSS transforms do not affect.
- `designer/snap.ts`, `history.ts`, `di-layers-panel`, `di-guides`, `di-rulers`: no change.
  Duplicate keeps rotation and shape through `structuredClone`; keyboard nudging moves the pivot,
  which is right.
- Rebuild with `npm run build` so the committed bundle under
  `wwwroot/App_Plugins/DynamicImages/` carries the change; the release workflow has no npm step.

### Docs

- `README.md`: Layers table, **Shape** → "A rectangle, ellipse, polygon or star with a solid or
  gradient fill and an optional border - scrims, rules, circles behind icons". New **Rotation**
  subsection under *Positioning*: degrees clockwise, around the anchor point; the handle above
  the selection and Shift for 15° steps; a layer tracking a rotated layer follows its rotated
  footprint. New **Shapes** subsection: the four kinds, sides and inner ratio, border inside the
  box, corner radius on rectangles only, fill off for outline-only. *Extending it*: `LayerBounds`
  reports the unrotated box plus `Rotation`/`PivotX`/`PivotY`, and `Extent()` gives the footprint.
- `CHANGELOG.md` → Unreleased / Added: **Rotation**; **Shapes** (kinds, border, no-fill).
  Changed: `LayerBounds` and `LayerBoundsResponse` carry three new fields; a `rect` layer with
  only a border now draws.

## Files

New:
- `src/DynamicImages/Core/Rendering/RotationMath.cs`
- `src/DynamicImages/Core/Rendering/Layers/ShapeGeometry.cs`, `ShapePath.cs`
- `src/DynamicImages/Client/src/models/rotation.ts`, `rotation.test.ts`, `rotation-fixtures.json`
- `src/DynamicImages/Client/src/models/shape-geometry.ts`, `shape-geometry.test.ts`, `shape-fixtures.json`
- `test/DynamicImages.Tests/RotationMathTests.cs`, `ShapeGeometryTests.cs`

Modified:
- `src/DynamicImages/Core/Models/Layers/LayerBase.cs`, `RectLayer.cs`
- `src/DynamicImages/Core/Rendering/ILayerRenderer.cs`, `RelativeLayout.cs`
- `src/DynamicImages/Core/Rendering/Layers/RectLayerRenderer.cs`, `TextLayerRenderer.cs`,
  `ImageLayerRenderer.cs`, `BadgesLayerRenderer.cs`
- `src/DynamicImages/Core/Services/TemplateValidator.cs`
- `src/DynamicImages/Api/Models/ApiModels.cs`, `Api/Controllers/PreviewController.cs`
- `src/DynamicImages/Client/src/api/types.ts`, `models/layer-factories.ts`,
  `models/relative-layout.ts`, `models/relative-layout-fixtures.json`,
  `designer/di-layer-box.element.ts`, `designer/di-designer-canvas.element.ts`,
  `designer/di-layer-inspector.element.ts`, `designer/di-property-palette.element.ts`,
  `workspace/views/di-design-view.element.ts`
- `src/DynamicImages/wwwroot/App_Plugins/DynamicImages/dynamic-images.js` (+ `.map`, rebuilt)
- `test/DynamicImages.Tests/RendererTests.cs`, `TemplateJsonTests.cs`, `RelativeLayoutTests.cs`,
  `DynamicImages.Tests.csproj` (copy the two new fixtures)
- `src/DynamicImages/README.md`, `CHANGELOG.md`

Reused as-is: `AnchorMath`, `RoundedRectangle`, `ColourParser`, `ImageProcessingContextExtensions`,
the `DrawingOptions`/`BlendPercentage` opacity handling, the history/transaction machinery,
`snap.ts`, the fixture-sharing test pattern.

## Implementation order

Each step leaves the build green and the existing tests passing.

1. `RotationMath` + `rotation.ts` + fixture + both tests. `LayerBase.Rotation`; `LayerBounds`
   gains the three defaulted fields and `Extent()`; `RelativeLayout` reads the extent. JSON tests:
   `rotation` round-trips, absent → 0.
2. Rotation in the four renderers (rect via path transform, text via `DrawingOptions.Transform`,
   image and badges via the rotate-and-place composite) and in `LayerBoundsResponse`. Renderer
   tests below.
3. `ShapeGeometry` + `shape-geometry.ts` + fixture + tests. `RectLayer` model additions,
   `ShapePath`, `RectLayerRenderer` shapes and border, validator changes, JSON tests (`"shape":
   "ellipse"` pinned under both option sets; older document without `shape` → rectangle).
4. Client types and factories; `relative-layout.ts` extents; layer box rotation, chrome, rotate
   handle and shape rendering; canvas move/resize/rotate gestures; inspector fields; palette chips.
   `npm run typecheck && npm test && npm run build`.
5. README and CHANGELOG.

## Verification

- Install the .NET SDK first (see `CLAUDE.md`), then `dotnet build src/DynamicImages.sln` and
  `dotnet test test/DynamicImages.Tests`, with these new cases in `RendererTests`:
  - A 100×20 red rect at (100, 100), top-left anchor, rotated 90°, covers `x ∈ [80, 100]`,
    `y ∈ [100, 200]`: pixel (90, 150) is red, (150, 110) is background.
  - The same rect rotated 0 is pixel-identical to today's test (`RenderAsync_DrawsARectangleWhereTheAnchorSays`).
  - A rotated text layer reports `Rotation`, the pivot at its position, and an `Extent()` taller
    than its `Height`; `MeasureAsync` agrees with `RenderAsync` for rotated text, image-less
    and badge layers.
  - An ellipse in a 100×50 box paints its centre and not its corner; a star with 5 points
    paints the centre and its top tip and not the box's top corners or its bottom-centre (the
    tip *is* the midpoint of the top edge, so that pixel is painted); a diamond stretches to a
    100×50 box; a border-only rectangle paints its edge pixel and not its centre, and reports
    bounds; a border around a filled ellipse; a shape with no fill, gradient or border reports
    nothing; 20 sides draws as 12; a rotated ellipse stands upright.
  - An image layer rotated 90° lands where the rectangle does, with its left half at the top
    (a stripe-image source in the tests pins the direction of ImageSharp's `Rotate`).
  - A description tracking *below* a 90°-rotated rectangle lands under the rectangle's extent,
    not under its unrotated height.
- `cd src/DynamicImages/Client && npm ci && npm run typecheck && npm test && npm run build`.
- Manual, against `src/DynamicImages.TestSite.Clean` (`dotnet run`, grant the section) on the
  imported Clean Bean Cafe template:
  1. Select the tagline, type 15 into Rotation → the DOM box tilts about its anchor dot; the
     preview strip re-renders tilted the same way; toggle the measured overlay → the dashed box
     sits over the tilted DOM box.
  2. Drag the rotate handle on the title with Shift → snaps in 15° steps; Ctrl+Z undoes the whole
     gesture in one step; Rotation in the inspector shows the value.
  3. Move a rotated layer → it snaps by its tilted footprint against the canvas centre; resize
     it from the `se` handle → grows along its own axes, no jump.
  4. Rotate the badge row and the article image 20° → both render rotated in the preview with
     corners and border intact on the image.
  5. Add **Ellipse** from the palette; set Fill off and a 4px white border → an outlined circle in
     the DOM and in the render. Switch Shape to Star, 5 points, inner ratio 0.4 → same star in
     both; set Sides to 20 → validator warning, drawn with 12.
  6. Set a description to track *below* a rotated title → it sits under the tilted footprint.
  7. Export the template, reimport it → rotation and shapes survive; a template saved before this
     change loads with everything at 0° and rectangles, and renders as before.
