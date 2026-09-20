# The canvas fill: a colour, a gradient, or nothing

## Context

The canvas's base layer is not a layer: it is two scalar fields on `CanvasSettings`
(`Core/Models/CanvasSettings.cs:17-29`) — a flat hex `Background` and an `ImageSource BaseImage` —
painted in that order before the layer loop runs. So "choose a source image **or** set a colour" is
already half-true: both exist, and the colour is what shows through where a `contain` base image is
padded.

What is missing is the *or a gradient* half. A gradient today is a shape-layer-only feature
(`Core/Models/Layers/RectLayer.cs:6-14`), it is linear-only, and the brush that draws it is a
private method on one renderer (`Core/Rendering/Layers/RectLayerRenderer.cs:124-150`). An editor who
wants a gradient background has to drop a full-canvas shape layer on top of the base image, which
both inverts the z-order they wanted and shows up as a layer in the layers panel.

**Intended outcome:** the canvas's fill is a solid colour, a gradient, or nothing at all, drawn
behind the optional base image exactly as the solid colour is today; gradients gain a radial kind;
transparency becomes something an editor can *choose* rather than something they have to know to
construct; and both the canvas and shape layers get their gradients from one shared piece of
geometry, so the two can never disagree.

### What already works, and what this adds

Setting a canvas size and rendering at exactly that size is **already the behaviour**, so the
feature the user describes is one field short of existing rather than new:

- `CanvasSettings.Width` / `.Height` default to 1200×630 (`Core/Models/CanvasSettings.cs:19-21`) and
  are edited as the first two fields of the inspector's Canvas panel
  (`designer/di-layer-inspector.element.ts:64-78`).
- The render is that size and nothing else — `DynamicImageRenderer.cs:17-21` allocates
  `new Image<Rgba32>(width, height)` from those two numbers, and the base image is *resized into*
  the canvas (`:133-151`), never the other way round. *Use image size* (`:142-147`) is the one place
  the image drives the canvas, and only when the editor asks it to.
- With `BaseImage.Kind == None` — the default for a new template — nothing is drawn over the fill at
  all, so "a size filled with a colour" already renders today.

So the only missing piece is the gradient, which is what the rest of this plan is. One small
inconsistency turned up while confirming it, and is folded in because it sits in a file this change
already edits: **the client caps the canvas at 5000px per side (`inputs/number-bounds.ts:32-33`)
while the server accepts 8000 (`Core/Services/TemplateValidator.cs:57`)**, so a template built by
hand or imported at 6000px is silently clamped the moment its Width field is touched in the
designer. Raise the two client bounds to 8000 to match the server, which is the authority.

### Decisions already made with the user

- **Fill *plus* optional image, not either/or.** The base image keeps drawing on top of whatever the
  fill is. This is what the canvas already does, it keeps `contain` padding meaningful, and it needs
  no migration — an either/or `background: { kind }` object would be a breaking reshape of every
  stored template for no behaviour anyone asked for.
- **Linear *and* radial.** Two stops, as now, plus a kind.
- **Shape layers share the improvement.** Radial is offered on `rect` layers too, and both read from
  one gradient model, one brush builder and one CSS builder — rather than the canvas growing a
  second, divergent notion of "gradient".
- **Transparent is a third choice on the same control, not a new model field.** It is already
  expressible as `#RRGGBB00` and already renders and encodes correctly; what is missing is a way to
  *ask* for it without knowing to drag a hidden alpha slider to zero, and a warning when the chosen
  output format cannot keep it. See the next section for the shape that takes.

### One refinement inside that first decision — overturn it before implementing if you disagree

The question offered a `canvas.backgroundFill: { kind, colour, gradient }` wrapper. **Build it
instead as `Background` (unchanged) plus a nullable `BackgroundGradient`**, because that is exactly
the shape `RectLayer` already uses — `Fill` (a colour string) alongside `Gradient?`, with the
gradient winning when both are set (`RectLayerRenderer.cs:52-60`). Same shape, same precedence, so
the inspector's existing gradient editor drops straight onto the canvas, the validator's existing
gradient checks generalise, and `{"background":"#0B0F19"}` in every stored document still means what
it meant. A `backgroundFill` wrapper would hold the colour in two places and buy nothing.

### Facts verified against the source and against the pinned packages (2026-09-20)

- **`SixLabors.ImageSharp.Drawing` is pinned at `2.1.5`**
  (`src/DynamicImages/Umbraco.Community.DynamicImages.csproj:28`). Its assembly and XML docs, pulled
  from nuget.org and read directly, carry **`RadialGradientBrush`** (a circle:
  `ctor(PointF center, float radius, GradientRepetitionMode, params ColorStop[])`) and
  **`EllipticGradientBrush`**
  (`ctor(PointF center, PointF referenceAxisEnd, float axisRatio, GradientRepetitionMode, params ColorStop[])`,
  where *"the second axis is perpendicular to the reference axis and its length is the reference
  axis' length multiplied by this factor"*). `EllipticGradientBrush` is the one to use — a circular
  gradient on a 1200×630 canvas is not what `radial-gradient` means to anyone who has used CSS.
- **`FillExtensions.Fill(IImageProcessingContext, Brush)` exists** (and its `DrawingOptions`
  overload), so filling the whole canvas with a brush is one call and needs no `RectangularPolygon`.
- **The canvas is currently constructed *as* a solid pixel buffer**, which is why there is nowhere
  to hang a brush today — `DynamicImageRenderer.cs:20-21`:

  ```csharp
  var background = ColourParser.ParseOrDefault(template.Canvas.Background, Color.Transparent);
  var image = new Image<Rgba32>(width, height, background.ToPixel<Rgba32>());
  ```

- **No schema bump is needed, and not bumping is the safer choice.** `DynamicImagesJsonOptions`
  (`Core/Json/DynamicImagesJsonOptions.cs:17-29`) sets no `UnmappedMemberHandling`, so System.Text.Json
  ignores members it does not know. `Gradient.Kind` defaults to `Linear` (enum zero) and
  `BackgroundGradient` defaults to `null`, so a v2 document reads unchanged — and an *older* package
  reading a document written by this change ignores `backgroundGradient` and draws a solid
  background, rather than throwing. `TemplateJsonMigrator.Deserialize` **throws** for any
  `schemaVersion` above `CurrentSchemaVersion` (`DynamicImagesConstants.cs:40`, currently 2), so
  bumping to 3 would be a one-way door bought for nothing. This is the same forward-compatibility
  argument `RectLayer.cs:48-52` already makes for keeping the `rect` discriminator.
- **The CSS radial contract is derivable in closed form, so the server and the designer preview can
  be made to agree exactly.** CSS's default is `ellipse farthest-corner at 50% 50%`. For a box of
  width `w`, height `h` and a centre at `(cx, cy)`, the farthest-side distances are
  `dx = max(cx, w − cx)` and `dy = max(cy, h − cy)`; the farthest-corner ellipse has the same axis
  ratio and passes through `(dx, dy)`, which solves to semi-axes **`a = √2·dx`, `b = √2·dy`**. That is
  the number the brush needs and the keyword the preview needs, from one derivation.
- **Gradient rendering has zero server test coverage today.** `grep -rn "Gradient" test/` finds one
  hit, `RendererTests.cs:562` (`empty.Gradient = null;`). `BuildGradientBrush` has never been
  exercised by a test. Whatever else this change does, it should close that.
- **Two `RendererTests` helpers assume the background is opaque black** — `CountNonBackgroundOutside`
  (`:828`) and `HasNonBackgroundPixels` (`:844`). New gradient tests must probe pixels directly
  rather than reach for those.
- **No new `di-*` event is needed.** The canvas panel already writes through `di-canvas-change` →
  `updateCanvas` (`workspace/di-template-workspace.context.ts:307-309`) and the layer panel through
  the inspector's own `#patch`, so `src/event-contract.test.ts` has nothing new to satisfy.

### Transparency: plumbed everywhere, acknowledged nowhere

Traced end to end, because "can the background be transparent" turns out to have a different answer
at each layer:

- **The model and parser already do it.** `ColourParser` reads `#RRGGBBAA`, and `AA = 00` parses to
  a fully transparent colour (`ColourParser.cs:36-44`). `ParseOrDefault` returns the *caller's*
  fallback for null, empty or malformed input, and the renderer's fallback is `Color.Transparent`
  (`DynamicImageRenderer.cs:20`) — so **an empty `background` string already renders a transparent
  canvas**, and the validator deliberately skips empty values (`TemplateValidator.cs:63`), making
  that a legal, entirely unwarned path to transparency today.
- **The encoder already keeps it, by default.** `new PngEncoder()` with no options resolves colour
  type from the source, so an `Image<Rgba32>` with any non-opaque pixel is written RGBA
  (`Core/Media/DynamicImageMediaWriter.cs:92-94`), and PNG is the default format
  (`Core/Models/OutputSettings.cs:28`). Nothing in the pipeline flattens: a `contain` base image
  even pads with `PadColor = Color.Transparent` (`DynamicImageRenderer.cs:147`). WebP's lossy
  encoder writes an `ALPH` chunk, so it keeps alpha too.
- **The colour input already offers it.** `di-colour-input` has an alpha slider at
  `min="0" max="1" step="0.01"` and **already renders its swatch over a checkerboard** with the chip
  at the value's alpha (`inputs/di-colour-input.element.ts:55, 75-81, 103-119`), so alpha 0 shows a
  bare checkerboard and a `0%` readout. Nothing needs adding there.
- **The designer already draws it honestly.** `.stage` declares no background of its own and
  `.artboard` declares none either (`di-designer-canvas.element.ts:711-724`), so a transparent
  canvas shows the viewport's hard-coded checkerboard (`:694-704`) straight through. Verified by
  reading the CSS: there is nothing opaque in between, only the stage's `box-shadow` rim.
- **JPEG is where it breaks, and nothing says so.** JPEG has no alpha channel; ImageSharp converts
  `Rgba32` → YCbCr and drops A, keeping the un-premultiplied RGB. So a `#00000000` canvas encodes to
  solid **black** and `#FFFFFF00` to solid **white** — whichever hex happened to be under the zero
  alpha, which is not a choice anyone made. Worse, *semi*-transparent content hardens: the shape
  layer's own default fill `#00000099` (`models/layer-factories.ts:132`) is a 60% scrim on PNG and
  **solid black** on JPEG. `TemplateValidator` never reads `Output.Format` at all — grep finds no
  reference outside `ValidateOutputFolder`.
- **The rendered previews hide it.** The scaled designer preview is always encoded WebP regardless of
  the template's format (`Api/Controllers/PreviewController.cs:42-58`), so it stays honest; but
  `di-preview-view.element.ts:352-358` and `di-preview-strip.element.ts:176` put the `<img>` on
  `var(--uui-color-surface)` with no checkerboard, so transparent output reads as *white* output on
  both surfaces.
- **Nothing is tested or documented.** `ColourParserTests` has alpha cases for `14` and `26` but
  **none for `00`**; no test covers a transparent canvas surviving encoding; `DynamicImageMediaWriter`
  has no test file at all; and the README contains no occurrence of "transparent", "alpha" or
  `#RRGGBBAA` outside the validator's error message.

---

## Design

### 1. One gradient model, with a kind

`Core/Models/Layers/RectLayer.cs` — extend `Gradient` in place. It stays in the `...Models.Layers`
namespace: moving it would churn every consumer for a tidier `using`, and `CanvasSettings` can carry
one `using`.

```csharp
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum GradientKind
{
    [JsonStringEnumMemberName("linear")]
    Linear,

    [JsonStringEnumMemberName("radial")]
    Radial
}

public class Gradient
{
    /// <summary>Absent in a v2 document, which is exactly the linear gradient it used to be.</summary>
    public GradientKind Kind { get; set; } = GradientKind.Linear;

    public string From { get; set; } = "#000000CC";

    public string To { get; set; } = "#00000000";

    /// <summary><see cref="GradientKind.Linear"/> only. Degrees clockwise from "top to bottom" = 180,
    /// matching CSS linear-gradient.</summary>
    public float Angle { get; set; } = 180f;

    /// <summary><see cref="GradientKind.Radial"/> only. The centre as a fraction of the box, as in
    /// CSS's <c>at 50% 50%</c>. The renderer clamps to 0..1.</summary>
    public float CentreX { get; set; } = 0.5f;

    public float CentreY { get; set; } = 0.5f;
}
```

Both new enum members get `[JsonStringEnumMemberName]` **and** the enum gets
`[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]` — the pinning convention in
`Core/Json/CamelCaseJsonStringEnumConverter.cs` exists because the Management API serialises with the
host's own options, and an enum that skips either half silently deserialises as its default.

### 2. `CanvasSettings` grows a nullable gradient

`Core/Models/CanvasSettings.cs`:

```csharp
/// <summary>Painted before the base image, so a "contain" base image sits on it. Ignored when
/// <see cref="BackgroundGradient"/> is set - the gradient is the fill, as on a shape layer.</summary>
public string Background { get; set; } = "#0B0F19";

/// <summary>When set, the canvas is filled with this instead of <see cref="Background"/>.</summary>
public Gradient? BackgroundGradient { get; set; }
```

### 3. The brush builder moves out of the rect renderer and learns radial

New `Core/Rendering/GradientBrushes.cs`, lifted verbatim from
`RectLayerRenderer.BuildGradientBrush` (`:124-150`) with a radial branch beside it. It is public
static, beside `ColourParser` in the same namespace, because both the canvas and a layer renderer
need it.

```csharp
/// <summary>
/// Turns a <see cref="Gradient"/> into an ImageSharp brush over a given box. Shared by the canvas
/// background and by shape layers, so the two cannot drift - and both follow the CSS conventions
/// the designer paints its preview with, so the preview and the render agree.
/// </summary>
public static class GradientBrushes
{
    public static Brush Build(Gradient gradient, float x, float y, float width, float height, Matrix3x2 transform)
    {
        var from = ColourParser.ParseOrDefault(gradient.From, Color.Black);
        var to = ColourParser.ParseOrDefault(gradient.To, Color.Transparent);

        return gradient.Kind == GradientKind.Radial
            ? Radial(gradient, from, to, x, y, width, height, transform)
            : Linear(gradient, from, to, x, y, width, height, transform);
    }
```

`Linear` is today's code unchanged. `Radial`:

```csharp
    private static Brush Radial(
        Gradient gradient, Color from, Color to,
        float x, float y, float width, float height, Matrix3x2 transform)
    {
        // CSS's default is `ellipse farthest-corner`: an ellipse with the box's own proportions,
        // grown until it passes through the corner furthest from the centre. For a rectangle the
        // farthest corner sits at the two farthest-side distances, which solves to sqrt(2) times
        // each of them - so an off-centre gradient stays an ellipse rather than skewing.
        var (centreX, centreY) = GradientGeometry.RadialCentre(x, y, width, height, gradient.CentreX, gradient.CentreY);
        var (a, b) = GradientGeometry.RadialSemiAxes(x, y, width, height, centreX, centreY);

        // The gradient turns with the shape: the reference axis goes through the same matrix, and
        // rotation preserves the ratio between the axes.
        var centre = Vector2.Transform(new Vector2(centreX, centreY), transform);
        var axisEnd = Vector2.Transform(new Vector2(centreX + a, centreY), transform);

        return new EllipticGradientBrush(
            new PointF(centre.X, centre.Y),
            new PointF(axisEnd.X, axisEnd.Y),
            b / a,
            GradientRepetitionMode.None,
            new ColorStop(0f, from),
            new ColorStop(1f, to));
    }
}
```

The two pieces of arithmetic go in a **new `Core/Rendering/GradientGeometry.cs`** — `LinearAxis(...)`
returning the start and end points, and `RadialSemiAxes(...)` returning `(a, b)` — public static and
free of ImageSharp brushes, so they can be unit-tested against hand-computed numbers the way
`ShapeGeometry`, `AnchorMath` and `RotationMath` already are. **As built it carries the centre clamp
too**, as `RadialCentre(...)` (fractions in, pixels out) and `ClampFraction(...)`: the clamp is part
of the radial definition, the validator's warning needs to ask the geometry what will be drawn, and
"a centre outside 0..1 clamps" is then asserted against arithmetic rather than through a brush.
`GradientBrushes` is then the thin adapter that wraps them in a brush.

`RectLayerRenderer` loses `BuildGradientBrush` and calls `GradientBrushes.Build(rect.Gradient, x, y, width, height, matrix)`
at `:54`. Everything else about it is untouched.

### 4. The canvas is filled, not seeded

`Core/Rendering/DynamicImageRenderer.cs:20-21` becomes a call to a private helper:

```csharp
    /// <summary>
    /// A solid background is still the pixel the buffer is created with - it is one allocation and
    /// no pass. A gradient has no single pixel to seed with, so the buffer starts transparent and
    /// takes a fill. The brush spans the whole canvas, untransformed: the canvas never rotates.
    /// </summary>
    private static Image<Rgba32> CreateCanvas(CanvasSettings canvas, int width, int height)
    {
        if (canvas.BackgroundGradient is null)
        {
            var background = ColourParser.ParseOrDefault(canvas.Background, Color.Transparent);
            return new Image<Rgba32>(width, height, background.ToPixel<Rgba32>());
        }

        var image = new Image<Rgba32>(width, height);
        var brush = GradientBrushes.Build(canvas.BackgroundGradient, 0, 0, width, height, Matrix3x2.Identity);
        image.Mutate(ctx => ctx.Fill(brush));
        return image;
    }
```

Order is unchanged, so `DrawBaseImageAsync` (`:133-151`) still draws over the fill and a `contain`
base image still pads onto it — now onto a gradient.

**Deliberately not done:**

- **No multi-stop gradients.** Two stops is what the model, the UI and every existing template have;
  a stops list is a different feature with its own editor, and the `from`/`to` shape would have to
  change under shape layers too.
- **No conic gradients.** ImageSharp 2.1.5 has no conic brush; it would have to be drawn by hand.
- **No background *repeat*, *position* or *size* for the base image.** Out of scope.
- **The background stays out of the layers panel.** The synthetic locked "Background" row
  (`designer/di-layers-panel.element.ts:75-79`) keeps pointing at the inspector; only its
  subtitle text needs to stop saying "canvas colour" when a gradient is set.
- **No schema version bump**, for the reasons in Context.

### 5. Validation

`Core/Services/TemplateValidator.cs`. `RequireColour` (`:281-287`) currently takes a `LayerBase` to
build its message; split it so the canvas can reuse the check:

- `RequireColour(string? value, string what, string? layerKey, List<ValidationIssue> issues)` — the
  core, where `what` is the phrase that names the thing ("the canvas background gradient", "Layer
  'Title'").
- Keep the existing `RequireColour(string?, LayerBase, List<...>)` overload delegating to it, so the
  five existing call sites are untouched.

Then:

- `ValidateCanvas` (`:55-69`) gains: when `BackgroundGradient` is not null, `RequireColour` on both
  stops, and — for a radial one — a `GradientCentreInvalid` **warning** when either centre falls
  outside 0..1, saying it will be clamped. That mirrors the `ShapeSidesInvalid` precedent at `:239-244`:
  the renderer clamps either way, and the warning says what will actually be drawn.
- The `RectLayer` arm (`:231-235`) gets the same centre check, through a shared
  `ValidateGradient(Gradient, string what, string? layerKey, List<...>)` used by both.
- The existing `ColourInvalid` message for `Canvas.Background` stays as it is — a template may
  legitimately carry a stale colour beneath a gradient, and it is still an error if it is malformed.
- No `NoFill`-style warning for the canvas: a transparent canvas is now a thing an editor *chooses*,
  and `BaseImageMissing` (`:81-83`) already covers the case where they did not mean it.

**And one new check the transparency question turns up** — `TemplateValidator` does not read
`Output.Format` anywhere today. Add a `TransparencyNotKept` **warning** when all of:

- `template.Output.Format == OutputFormat.Jpeg`; and
- the fill carries alpha — the solid background parses to an alpha below 255, *or* is empty or
  whitespace (which `ParseOrDefault` silently renders transparent), *or* either gradient stop has
  alpha; and
- the base image will not certainly cover it — i.e. **not** (`BaseImage.Kind != None` and
  `BaseImageFit` is `Cover` or `Stretch`). Those two fits always fill the canvas, so a warning there
  would be noise; `Contain` pads with transparency and leaves the fill showing, and a `Property`
  source that resolves to nothing leaves all of it showing.

Message: *"The output format is JPEG, which has no transparency, so the transparent parts of this
template will be flattened to whatever colour is underneath them. Use PNG or WebP to keep it."*
A warning and not an error: flattening is a legitimate thing to want, and this is exactly the
`ShapeSidesInvalid` register — say what will actually be drawn.

### 6. Backoffice client (`src/DynamicImages/Client`)

**The wire contract** — `src/api/types.ts`. Hand-written, so it must be edited in lockstep with the
C# (the third lockstep partner is the default factory, below):

```ts
export type GradientKind = "linear" | "radial";

export interface DiGradient {
  kind: GradientKind;
  from: string;
  to: string;
  /** Linear only. */
  angle: number;
  /** Radial only, 0..1. */
  centreX: number;
  centreY: number;
}
```

`DiRectLayer.gradient` becomes `DiGradient | null`, and the canvas block (`:201-206`) gains
`backgroundGradient?: DiGradient | null`. The server always writes the new fields (they are
non-nullable on the C# side), so they are required on `DiGradient` rather than optional; the one
place that has to cope with their absence is a document the *client* built, which is what the factory
below is for.

**One factory, two callers** — `src/models/layer-factories.ts` gains

```ts
/** What a gradient starts as when one is first switched on, for the canvas and a shape alike. */
export function createGradient(): DiGradient {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
```

which replaces the inline `{ from: "#000000CC", to: "#00000000", angle: 180 }` literal at
`di-layer-inspector.element.ts:740`. `createTemplate` (`:202-225`) leaves `backgroundGradient` unset:
a new template starts on the solid `#0B0F19` it starts on today.

**One CSS builder, two previews** — new `src/models/gradient-css.ts`:

```ts
/**
 * The CSS the designer paints a gradient with. It is deliberately the *same* convention the server
 * renders with - `180deg` is top-to-bottom, and `ellipse farthest-corner` is the ellipse whose
 * semi-axes GradientGeometry.RadialSemiAxes computes - so the artboard and the real preview agree.
 */
export function gradientCss(gradient: DiGradient): string {
  if (gradient.kind === "radial") {
    const x = Math.round(clamp01(gradient.centreX) * 100);
    const y = Math.round(clamp01(gradient.centreY) * 100);
    return `radial-gradient(ellipse farthest-corner at ${x}% ${y}%, ${gradient.from}, ${gradient.to})`;
  }
  return `linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to})`;
}
```

Its two consumers replace ad-hoc strings:

- `designer/di-designer-canvas.element.ts:627` —
  `styleMap({ background: canvas.backgroundGradient ? gradientCss(canvas.backgroundGradient) : canvas.background })`.
  The stage already sets the `background` **shorthand**, so a gradient string renders there with no
  markup change.
- `designer/di-layer-box.element.ts:409-411` — `const paint = gradient ? gradientCss(gradient) : layer.fill ?? "transparent";`,
  replacing the inline `linear-gradient(...)` template literal.

**The inspector** — `designer/di-layer-inspector.element.ts`. The gradient sub-form is now needed in
two panels, so extract it once as a private method on the element rather than a new custom element:
no new manifest, no new event, and it reads the same `INSPECTOR_BOUNDS` table either way.

```ts
  /**
   * The gradient editor, shared by the canvas panel and the shape panel. `patch` takes the whole
   * replacement gradient, because the two panels write through different paths (`#canvas` vs
   * `#patch`) and neither should have to know about the other's.
   */
  #renderGradientFields(gradient: DiGradient, patch: (next: DiGradient) => void) { ... }
```

It renders, in order: a **Type** `<uui-select>` (`Linear` | `Radial`); the existing From/To
`<di-colour-input>` pair; then, for linear, the existing **Angle** `<di-number-field>`; for radial, a
**Centre X / Centre Y** pair of `<di-number-field suffix="%">`. Percent in, fraction stored — the
`×100` / `÷100` happens at the call site, exactly as the zoom toolbar already does with
`ZOOM_BOUNDS` (`inputs/number-bounds.ts:71-79`).

The shape panel's block (`:733-772`) becomes a `<uui-toggle>` plus a call to it — a shape's "no fill"
is already expressed as `fill: null` for an outline-only shape, so it keeps its own idiom and does
not need the three-way picker below.

**The canvas panel gets a three-way Fill picker**, because it now has three states and a toggle only
has two. `#renderCanvas` (`:58-152`) replaces the bare **Background** colour field with:

```
Fill  [ Colour ▾ | Gradient | Transparent ]
  Colour      → the existing <di-colour-input>
  Gradient    → #renderGradientFields
  Transparent → a one-line hint naming which formats keep it
Base image …
```

so the panel reads top to bottom as *size → fill → image*.

**This is a projection of the existing two fields, not a new one.** The mode is derived, and each
switch is a plain write, so there is no hidden state to keep in sync and nothing to migrate:

```ts
/**
 * Which of the three the canvas is currently filled with. Derived rather than stored: a third
 * `fillMode` field would be a second source of truth for something the two fields already say,
 * and would need a migration to add.
 */
export type CanvasFill = "colour" | "gradient" | "transparent";

export function canvasFill(canvas: DiTemplate["canvas"]): CanvasFill {
  if (canvas.backgroundGradient) return "gradient";
  return isTransparent(canvas.background) ? "transparent" : "colour";
}
```

Switching **flips the alpha nibble on the colour that is already there rather than replacing it**,
so `#0B0F19` → `#0B0F1900` → `#0B0F19` round-trips and an editor who tries Transparent and changes
their mind gets their colour back:

- → `colour`: `{ background: withAlpha(canvas.background, "FF"), backgroundGradient: null }`
- → `transparent`: `{ background: withAlpha(canvas.background, "00"), backgroundGradient: null }`
- → `gradient`: `{ backgroundGradient: createGradient() }`, leaving `background` untouched

(`clamp01` is exported from the same module, since the preview and the renderer have to clamp alike.)

`isTransparent` and `withAlpha` are two small functions in the new `models/gradient-css.ts`'s
neighbour, `models/canvas-fill.ts`, node-tested — they are the only place the 8-digit hex convention
is reasoned about on the client, and `di-colour-input` already normalises everything it emits to
`#RRGGBB` or `#RRGGBBAA` (`inputs/di-colour-input.element.ts:34-42`), so they only ever see those
two shapes.

The Transparent hint is one `<p class="hint">`, and it says the thing the validator will also say:
*"The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it."*

**Bounds** — `inputs/number-bounds.ts` gains one entry beside `gradientAngle` (`:57`):

```ts
  /** A radial gradient's centre, as a fraction of the box. Edited as a percentage, as zoom is. */
  gradientCentre: { min: 0, max: 1 },
```

and `width` / `height` (`:32-33`) go from `5000` to `8000`, with their comment saying why: the
server's validator is the authority on what the canvas may be, and 5000 was quietly the stricter of
the two. Nothing else reads those two entries, so this is a one-line widening.

**The layers panel** — `designer/di-layers-panel.element.ts:75-79`: the synthetic Background row's
subtitle says "The base image and canvas colour are edited in the inspector". Make it say *fill*
rather than *colour*, so it is not wrong once a gradient is set.

**The rendered previews** — the Preview tab's `<img class="render">` sits in a `uui-box` and the
strip's sits on the host's `var(--uui-color-surface)`, so a transparent render reads as a *white*
render on the two surfaces an editor actually checks their work on. The designer artboard has
solved this since it was written; lift its checkerboard (`di-designer-canvas.element.ts:694-704`)
into a shared `designer/checkerboard.ts` exporting a `css` fragment, and use it in all three places
rather than pasting the nine declarations twice more. **As built** the fragment goes on the two
`<img>` rules themselves rather than on a wrapper: an image's own background paints behind its
transparent pixels, which is exactly the surface that was missing.

### 7. Docs

- `src/DynamicImages/README.md:41-44` ("The canvas") — the fill is a colour **or a two-stop linear or
  radial gradient**, with the base image drawn on top of it.
- `src/DynamicImages/README.md:110-113` (the shape layer's fill paragraph) — gradients are linear or
  radial.
- `src/DynamicImages/CHANGELOG.md`, under `## Unreleased` → `### Added`, in the voice of the entries
  already there.

---

## Files

**New**

- `src/DynamicImages/Core/Rendering/GradientGeometry.cs` — `LinearAxis` and `RadialSemiAxes`, the
  two pieces of arithmetic, free of ImageSharp brushes so they can be asserted against numbers.
- `src/DynamicImages/Core/Rendering/GradientBrushes.cs` — the shared adapter from `Gradient` to a
  `Brush`, linear and radial.
- `src/DynamicImages/Client/src/models/gradient-css.ts` — `gradientCss()`.
- `src/DynamicImages/Client/src/models/gradient-css.test.ts` (node project).
- `src/DynamicImages/Client/src/models/canvas-fill.ts` — `canvasFill()`, `isTransparent()`,
  `withAlpha()`.
- `src/DynamicImages/Client/src/models/canvas-fill.test.ts` (node project).
- `src/DynamicImages/Client/src/designer/checkerboard.ts` — the shared `css` fragment.
- `test/DynamicImages.Tests/GradientGeometryTests.cs`.
- `test/DynamicImages.Tests/EncodingTests.cs` — the first coverage `DynamicImageMediaWriter` has had.
- `test/DynamicImages.Tests/TemplateValidatorTests.cs` — likewise the first for the validator.
- `src/DynamicImages/Client/src/designer/canvas-gradient.browser.test.ts` — the computed-style
  assertions, which need real layout.

**Modified**

- `src/DynamicImages/Core/Models/Layers/RectLayer.cs` — `GradientKind`; `Gradient` gains `Kind`,
  `CentreX`, `CentreY`.
- `src/DynamicImages/Core/Models/CanvasSettings.cs` — `BackgroundGradient`; the `Background` doc
  comment says when it is ignored.
- `src/DynamicImages/Core/Rendering/DynamicImageRenderer.cs` — `CreateCanvas(...)` replaces the
  inline buffer seed at `:20-21`.
- `src/DynamicImages/Core/Rendering/Layers/RectLayerRenderer.cs` — `BuildGradientBrush` deleted; the
  call at `:54` goes to `GradientBrushes.Build`.
- `src/DynamicImages/Core/Services/TemplateValidator.cs` — `RequireColour` split into a `what`-based
  core plus the existing layer overload; a shared `ValidateGradient`; `ValidateCanvas` and the
  `RectLayer` arm both call it; new `GradientCentreInvalid` and `TransparencyNotKept` warnings.
- `src/DynamicImages/Client/src/api/types.ts` — `GradientKind`, `DiGradient`, `DiRectLayer.gradient`,
  `canvas.backgroundGradient`.
- `src/DynamicImages/Client/src/models/layer-factories.ts` — `createGradient()`.
- `src/DynamicImages/Client/src/inputs/number-bounds.ts` — `gradientCentre`; `width`/`height` raised
  to 8000 to match the server's validator.
- `src/DynamicImages/Client/src/designer/di-layer-inspector.element.ts` — `#renderGradientFields`,
  the canvas panel's three-way Fill picker, the shape panel rewired onto the shared method.
- `src/DynamicImages/Client/src/designer/di-designer-canvas.element.ts` — the stage's `background`;
  its checkerboard CSS moves to the shared fragment.
- `src/DynamicImages/Client/src/designer/di-layer-box.element.ts` — `paint` via `gradientCss`.
- `src/DynamicImages/Client/src/designer/di-layers-panel.element.ts` — the Background row's subtitle.
- `src/DynamicImages/Client/src/workspace/views/di-preview-view.element.ts` and
  `di-preview-strip.element.ts` — the checkerboard behind the rendered `<img>`.
- `test/DynamicImages.Tests/RendererTests.cs` — canvas gradient cases, a transparent-canvas case, and
  the first rect-gradient render test the project has ever had.
- `test/DynamicImages.Tests/TemplateJsonTests.cs` — round-trip and backwards-compatibility cases.
- `test/DynamicImages.Tests/ColourParserTests.cs` — the missing `AA = 00` case.
- `src/DynamicImages/README.md`, `src/DynamicImages/CHANGELOG.md`.
- `src/DynamicImages/wwwroot/App_Plugins/DynamicImages/dynamic-images.js` (+ `.map`) — the committed
  bundle. `ci.yml` fails if it does not match source, so rebuild and commit it.

**Reused as-is**

- `Core/Rendering/ColourParser.cs` — every colour on the new model goes through `ParseOrDefault` /
  `TryParse`; no new colour syntax is introduced.
- `Core/Json/CamelCaseJsonStringEnumConverter.cs` and the `[JsonStringEnumMemberName]` convention —
  `GradientKind` follows it; nothing about the serializer changes.
- `Client/src/inputs/di-colour-input.element.ts` and `di-number-field.element.ts` — every new field
  is one of these two, already clamping and already covered. **The colour input needs no change for
  transparency**: it already has the alpha slider and already draws its swatch on a checkerboard
  (`:55, 75-81, 103-119`).
- `Core/Media/DynamicImageMediaWriter.cs` — the encoder selection is already right; PNG keeps alpha
  by default and WebP writes an `ALPH` chunk. Only its (absent) tests are added.
- `Client/src/workspace/di-template-workspace.context.ts` `updateCanvas` (`:307-309`) — a shallow
  merge, which is all `backgroundGradient` needs; undo/redo comes free.
- `Client/src/testing/browser-fixtures.ts` — `mountWorkspace()`, `settle()`, `resetBody()`.
- `Client/src/event-contract.test.ts` — unchanged, because no new `di-*` event is introduced.

---

## The tests

### `GradientGeometryTests.cs` (new)

Pure arithmetic against hand-computed numbers, the `ShapeGeometryTests` pattern:

- `LinearAxis` on a 400×200 box at 180° runs top-centre to bottom-centre; at 90° left to right; at
  0° bottom to top. These pin the CSS convention the designer's `linear-gradient(Ndeg, …)` relies on.
- `RadialSemiAxes` centred on a 400×200 box gives `(√2·200, √2·100)` — the farthest-corner ellipse,
  not the farthest-side one.
- `RadialSemiAxes` at `centreX = 0.25` on that box gives `a = √2·300` (the far side wins) and `b`
  unchanged.
- A centre outside 0..1 clamps rather than producing a negative axis.

### `RendererTests.cs` (extended)

Pixel probes, as the file already does at `:103-113`:

- `RenderAsync_FillsTheCanvasWithAGradient` — a 400×200 canvas, linear 180°, opaque red to opaque
  blue. `image[200, 2]` is near-red and `image[200, 197]` is near-blue. Assert with a tolerance:
  ImageSharp interpolates, so exact equality is the wrong assertion here.
- `RenderAsync_PrefersTheCanvasGradientOverTheBackgroundColour` — `Background = "#00FF00"` plus a
  red→blue gradient, and no pixel is green.
- `RenderAsync_FillsTheCanvasWithARadialGradient` — centre pixel near the `from` stop, all four
  corners near the `to` stop.
- `RenderAsync_LeavesTheBackgroundColourAloneWithoutAGradient` — the existing `:103-113` case,
  unchanged, as the guard that the new code path did not capture the old one.
- `RenderAsync_DrawsAShapeGradient` and `RenderAsync_DrawsARadialShapeGradient` — the coverage gap
  Context names. A full-canvas rect with a red→blue gradient, probed top and bottom.

- `RenderAsync_LeavesTheCanvasTransparent` — `Background = "#0B0F1900"`, no base image, no layers:
  every probed pixel has `A == 0`. And the companion that pins the unwarned path Context found:
  `Background = ""` renders transparent too, because `ParseOrDefault`'s fallback is
  `Color.Transparent`.

None of these may use `CountNonBackgroundOutside` or `HasNonBackgroundPixels`; both hard-code
opaque black as "background" and would silently mean the wrong thing on a gradient.

### `EncodingTests.cs` (new)

`DynamicImageMediaWriter` has no test file at all, and "does transparency survive?" is exactly the
question it answers. Encode a 4×4 fully transparent `Image<Rgba32>` through `EncodeAsync` and
re-load the bytes:

- PNG keeps it — the decoded pixel's `A` is 0.
- WebP keeps it — same assertion, which is what makes the scaled designer preview honest.
- JPEG does not — the decoded pixel is opaque. This is the assertion that gives the
  `TransparencyNotKept` warning a reason to exist, rather than the warning asserting its own premise.

### `ColourParserTests.cs` (extended)

One `[InlineData]` row: `#0B0F1900` parses with `A == 0`. The file already covers `14` and `26` and
somehow never covered the one value that means "invisible".

### `TemplateValidatorTests.cs` (new)

**`TemplateValidator` has no test file today** — the 22 files in `test/DynamicImages.Tests` include
none for it. So this is a new file, and it costs stubs: the `IImageSourceProvider` stub already
exists as `NoImages` (`RendererTests.cs:882`, lifted to a shared `NoImages.cs` — `LayerSkipTests`
had a second copy, which now goes too), plus a three-line `IFontRepository`. **`IMediaService`
turned out not to need one**: it is only touched when `Output.MediaFolderKey` is set, so these
templates leave it null. **`IContentTypeService` needs one after all**, and no template can avoid
it: `KnownPropertyAliases` passes `contentTypeService.Get` as a *method group*, which binds even
for an empty alias list and throws on null. Rather than hand-write that interface, one
`DispatchProxy` returns default for every member — anything actually called comes back as nothing
rather than quietly passing. Keep the file narrow — this change's three warnings, not a retrospective suite for the
whole validator:

- JPEG plus a transparent background warns `TransparencyNotKept`; JPEG plus an opaque background does
  not; **JPEG plus a transparent background and a `Cover` base image does not** — that third case is
  what keeps the warning from being noise, and it is the one most likely to regress.
- A radial gradient with a centre outside 0..1 warns `GradientCentreInvalid`, on the canvas and on a
  shape layer alike.
- A canvas gradient with a malformed stop is a `ColourInvalid` error, and its message names the
  canvas rather than a layer — the check that the `RequireColour` split did not mangle the wording.

If the stubbing turns out to cost more than the three warnings are worth, say so in the commit
message and cover the JPEG rule alone; it is the one with a user-visible footgun behind it.

### `TemplateJsonTests.cs` (extended)

The file's established shape — round-trip, then assert under **both** `DynamicImagesJsonOptions.Default`
and `new JsonSerializerOptions(JsonSerializerDefaults.Web)` (`:89-99`, `:236-250`):

- A canvas gradient and a radial rect gradient survive a round-trip, and `kind` is written as
  `"linear"` / `"radial"` under both option sets — the check that the
  `[JsonStringEnumMemberName]` pinning is actually in place.
- **Backwards compatibility**, the `:176-191` pattern: a hand-written JSON string whose rect gradient
  is `{"from":"#000000CC","to":"#00000000","angle":180}` deserialises with `Kind == Linear` and
  `CentreX == CentreY == 0.5f`.
- A hand-written canvas with `background` and no `backgroundGradient` deserialises with
  `BackgroundGradient` null — the guard that the old documents still mean what they meant.

### `gradient-css.test.ts` (new, node project)

- A linear gradient produces `linear-gradient(180deg, #000000CC, #00000000)`.
- A radial gradient at 0.5/0.5 produces `radial-gradient(ellipse farthest-corner at 50% 50%, …)`.
- Off-centre fractions come out as whole percentages.
- Centres outside 0..1 clamp, matching the server.

### `canvas-gradient.browser.test.ts` (new, browser project)

jsdom computes no styles, so these belong in browser mode:

- With `canvas.backgroundGradient` set to a linear gradient, the stage's computed `background-image`
  starts `linear-gradient(`; with a radial one, `radial-gradient(`.
- With `backgroundGradient` null, the stage's computed `background-color` is the canvas colour and
  `background-image` is `none` — the guard that the gradient branch does not leak.
- A shape layer with a radial gradient paints a `radial-gradient` on its `.shape` div — the same
  builder reaching the other consumer.
- With `background` at alpha 0 and no gradient, the stage's computed `background-color` has an alpha
  of 0, so the viewport's checkerboard is what the editor sees. This one is only meaningful in
  browser mode — it is a computed style on a real cascade. (It reads `rgba(11, 15, 25, 0)`, not
  `rgba(0, 0, 0, 0)`: the hue survives at alpha 0, which is what makes switching back to Colour
  return the same one.)

---

## Implementation order

Each step below is a commit. Steps 1-4 ship a working gradient on the server alone; 5-6 are the
transparency half; 7-9 are the client.

1. **`GradientGeometry` + `GradientGeometryTests`.** Pure arithmetic with no callers yet, so it
   lands green and settles the radial definition before anything depends on it.
2. **`GradientKind`, the `Gradient` fields, `CanvasSettings.BackgroundGradient`, and the
   `TemplateJsonTests` round-trip and back-compat cases.** The contract, pinned, before any renderer
   reads it.
3. **`GradientBrushes`, and `RectLayerRenderer` rewired onto it.** A pure move plus the radial
   branch; the two new rect-gradient render tests go in here, and they are the first coverage that
   method has ever had.
4. **`CreateCanvas` in `DynamicImageRenderer`, plus the canvas gradient render tests.** The server
   feature is complete at this point.
5. **Transparency on the server**: `ColourParserTests`' missing `AA = 00` row, the two transparent
   render cases, and `EncodingTests`. Nothing changes in `src/` here — **this step is pure
   characterisation**, pinning behaviour that already exists so the warning in step 6 has something
   to point at and so nothing later quietly regresses it.
6. **`TemplateValidator`** — the `RequireColour` split, `ValidateGradient`, both call sites, the
   `TransparencyNotKept` rule, and `TemplateValidatorTests`.
7. **The client contract**: `types.ts`, `createGradient()`, `gradient-css.ts` and `canvas-fill.ts`
   with their node tests, `number-bounds.ts`, and the two preview call sites (`di-designer-canvas`,
   `di-layer-box`) retargeted onto `gradientCss`. Radial now previews correctly on shape layers.
8. **The inspector**: `#renderGradientFields`, the shape panel rewired onto it, the canvas panel's
   three-way Fill picker, the layers-panel subtitle, and `canvas-gradient.browser.test.ts`.
9. **The checkerboard**: extract `designer/checkerboard.ts` and use it in the two preview surfaces.
   Independent of everything above and ships alone if the rest slips.
10. **Rebuild and commit the client bundle**, then the README and CHANGELOG, and update this plan
    with anything the code forced a different choice on.

## Verification

The container has no .NET SDK and no `node_modules`; install both first (per `CLAUDE.md`).

```bash
curl -sSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
bash /tmp/dotnet-install.sh --channel 10.0 --install-dir "$HOME/.dotnet"
export PATH="$HOME/.dotnet:$PATH" DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1
dotnet build src/DynamicImages.sln && dotnet test test/DynamicImages.Tests
```

```bash
cd src/DynamicImages/Client
npm ci
npm run typecheck
npm test              # node project - gradient-css, and the contract tests
npm run test:browser  # real Chromium - canvas-gradient computed styles
npm run build
git status --short ../wwwroot   # expect the rebuilt bundle + map, nothing else
```

**Confirm the back-compat cases fail for the right reason, not by accident.** Before step 2's model
change, the hand-written v2 JSON test should not compile (the properties do not exist); after it, it
must pass *without* touching the JSON string. If the string has to change, the change is not
backwards compatible and the plan is wrong.

Manual check against the test site (`plans/ui-review-method.md` §6 — it must be HTTPS, probe
`/umbraco` and never `/`):

1. Open a template in the designer with nothing selected. The Canvas panel reads
   *Width/Height → Fill → Base image → Fit → Use image size*.
2. Set **Fill** to **Gradient**. The artboard's background becomes the default dark-to-transparent
   linear gradient immediately, and the **Preview** tab, which is server-rendered, shows the same
   thing. *That agreement is the whole point of the shared CSS/geometry conventions — if the two
   differ, the angle or the `farthest-corner` keyword is wrong.*
3. Switch **Type** to **Radial** and drag **Centre X** to 20%. The artboard's hotspot moves left, and
   the preview agrees.
4. Set a **Base image** with **Fit: contain**. The gradient shows in the padding, not black.
5. Set **Fill** back to **Colour**. The solid colour returns, unchanged — it was never overwritten.
6. Set **Fill** to **Transparent**. The artboard shows the checkerboard through the stage, the
   preview strip and the Preview tab show a checkerboard rather than white, and switching back to
   **Colour** restores the same hue it had before — the alpha nibble flipped, the colour did not.
7. With Fill still Transparent, set **Output format** to **JPEG** in Settings. A
   `TransparencyNotKept` warning appears. Set **Fit** to **cover** with a base image and it goes
   away; back to **contain** and it returns. Publish with JPEG and confirm the flattening the
   warning predicted — that is the behaviour being warned about, not a bug to fix.
8. Publish with **PNG** and open the generated media item: it is genuinely transparent, not white.
9. With **no base image at all**, set Width/Height to something unusual (say 800×800), keep the
   gradient on, and publish a page the template applies to. The generated media item is 800×800 and
   is the gradient alone — the "set a size, fill it, render at that size" case end to end. Then type
   `6000` into Width and confirm it is accepted rather than clamped to 5000.
10. Ctrl+Z through the last few changes; each gradient edit is one undo step.
11. On a **shape** layer, switch its gradient to radial and confirm the layer box and the preview
   agree, including when the layer is rotated — the gradient turns with the shape.
12. Save, reload the page, and confirm the gradient is still there: the round-trip through the
   database and the Management API, which is where a missed `[JsonStringEnumMemberName]` would show
   up as a gradient that silently reverts to linear.
