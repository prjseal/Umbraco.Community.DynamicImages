# Dynamic Images for Umbraco

Generate Open Graph / social share images from your content automatically, and design them in the
backoffice instead of writing configuration by hand.

When an editor publishes a page, Dynamic Images composites your text, images and category badges
over a base image, saves the result to the media library, and sets it on the page's media picker -
all within the publish that is already running. What gets drawn is a **template**: a canvas and a
stack of layers you build by dragging properties onto an artboard.

![The Dynamic Images designer](https://raw.githubusercontent.com/prjseal/Umbraco.Community.DynamicImages/main/docs/screenshots/02-designer.png)

## Installing

```
dotnet add package Umbraco.Community.DynamicImages
```

**Umbraco 17.5.3 or later.** Everything below 17.5.3 has published security advisories against it,
so that is the floor - and it is also the version that lets this package scope its own content
lists to a user's start nodes.

On first start the package creates two tables, installs a media type for font files, and a relation
type that marks the images it generates.

Then grant the section: **Users → User Groups → (your group) → Sections → Dynamic Images**. Nobody
sees the section until you do, including administrators.

## Getting started

1. **Add a font.** Dynamic Images → Fonts → *Add a font*. Upload a `.ttf`, `.otf` or `.woff2`,
   register a path to one already in `wwwroot`, or name a [web font](#web-fonts) from Google Fonts
   or Bunny Fonts. Text layers cannot render without one.
2. **Create a template.** Dynamic Images → Templates → *Create template*.
3. **In Settings**, choose the document types it applies to and the media picker property the
   generated image should be written to.
4. **In Design**, pick a base image, then drag properties from the left onto the canvas. Drop a
   text property and you get a text layer; drop a media picker and you get an image layer; drop a
   multi-node picker and you get a badge row.
5. **In Preview & test**, pick a real page and check the render.
6. Publish a page of that type. The image is generated and attached.

## How a template works

### The canvas

A fixed size in pixels, a fill, and an optional base image - a media item, a file in `wwwroot`, or
a property on the page being rendered. The base image is drawn on top of the fill, so a *contain*
fit pads onto it. *Use image size* sets the canvas to the base image's own dimensions.

The **fill** is a solid colour, a two-stop gradient - **linear** at an angle, or **radial** from a
centre you place - or **transparent**. PNG and WebP keep transparency; JPEG has no alpha channel,
so it flattens whatever is transparent to the colour underneath it, and the validator warns when
the template is set up that way.

**Size limits.** A canvas may be up to **4096 px** on either side and up to **8 megapixels** in
total - so 4096 x 1953, or 2828 x 2828, but not 4096 x 4096. An Open Graph image is 1200 x 630, so
this is generous against real use and mean against a template asking for something that would take
the site down with it. A template may have at most **100 layers**; a point size is capped at
**512**, a badge layer draws at most **50** badges, an image overlay is scaled to at most twice
the canvas, and a text layer lays out at most **2,000** characters of resolved text. The last four
are clamps - the image is still produced - and the designer says so as a warning; the first two
are errors. The renderer applies all of them whatever the template came from, so the preview
endpoint gets the same treatment as a saved template.

### Layers

Layers are drawn bottom to top, in the order the layers panel shows them reversed.

| Type | What it draws |
|---|---|
| **Text** | A value from the page, formatted and fitted to its box |
| **Image** | A media item, a `wwwroot` file, or a media picker property on the page |
| **Badges** | A row or column of circular badges from a multi-node picker - categories, tags, authors. Labels below, beside, or off, with optional wrapping |
| **Shape** | A rectangle, ellipse, polygon or star with a solid or gradient fill and an optional border - scrims, rules, circles behind icons |

### Positioning

Every layer has an `(x, y)` **and an anchor** - which point of the layer's box sits at that
coordinate. A date pinned to the right margin uses a top-right anchor, so it stays put however long
it gets; a title uses top-left. The anchor picker in the inspector changes what `x` and `y` mean
without moving the layer.

#### Relative to another layer

Each axis is independently **absolute** (a coordinate) or **relative** (it tracks another layer).
A description set to sit 24px *below it* the title starts wherever the title ends, so a two-line
title pushes it down instead of running into it. Horizontally a layer can sit *right of* or *left
of* another; vertically *below* or *above*. The tracked axis shows a **Gap** in place of X or Y,
because the coordinate is derived rather than stored.

The tracked edge also fixes that axis' half of the anchor: tracking *below* means the layer's top
edge is what gets placed, and tracking *above* means its bottom edge. The other axis keeps its own
coordinate and anchor component.

If the tracked layer draws nothing - an empty value, hidden, or a visibility rule - the chain
carries on to whatever *that* layer tracks, keeping this layer's own gap; a badge row under a
description under a title moves up to the title when the description is empty. With nothing left
on the chain, the layer falls back to its own stored coordinate. A loop of references resolves as
absolute, and the validator reports it.

In the designer a tracked axis is not draggable, snappable or nudgeable - it is derived, so the
pointer has nothing to move. Switching an axis back to absolute bakes in the coordinate it had
resolved to, so the layer stays exactly where it is, and deleting a layer does the same to
everything that tracked it.

#### Rotation

Every layer has a **Rotation** in degrees, clockwise, and turns around its **anchor point** - the
one point of the layer whose place is fixed however big its content turns out to be. New layers
are anchored at their middle, so in practice a rotation spins the layer about its centre; a
top-left-anchored label swings from its corner instead. Type a value in the inspector, or drag
the round handle above the selection on the canvas; hold **Shift** to snap to 15° steps. A whole
drag is one undo step.

The designer's box, its handles and the measured overlay all tilt with the layer, and moving a
rotated layer snaps by its tilted footprint. A layer that tracks a rotated layer follows that
footprint too: *below* a title turned 90° means below the bottom of the upright column it now
occupies, not below its unrotated height.

### Shapes

A shape layer draws a **rectangle**, **ellipse**, **polygon** or **star** inside its box. A
polygon has 3 to 12 **sides**, the first point at the top; a star has that many **points** and an
**inner ratio** (0.1 to 0.9) that sets how deep its notches are. Both stretch to fill a non-square
box, the way CSS `clip-path` does, so a circle is an ellipse in a square box. **Corner radius**
applies to rectangles only.

The fill is a solid colour, a two-stop gradient (linear or radial, the same as the canvas's), or
nothing: turn **Fill** off and set a **Border**
for an outline alone - a ring, a frame, a rule. The border is drawn inside the box, the way an
image layer's border and a CSS border are, so a bordered shape occupies exactly its box. A shape
with no fill, no gradient and no border draws nothing, and the validator says so. The palette
offers a rectangle and an ellipse; polygon and star are a select away in the inspector.

### Badge layout

A badges layer repeats one circle-and-label per item of a multi-node picker. **Label position**
decides the shape of each item:

| Position | What it gives you |
|---|---|
| **Below the icon** | Every item is one circle wide, with the label centred underneath |
| **Beside the icon** | Every item is as wide as its own label, so items sit as close as their text allows |
| **Icon only** | Circles alone, no labels and no label font needed |

For a horizontal row, **Wrap** starts a new row when the next item would pass the layer's Width,
with **Row gap** between rows. Without a width nothing can wrap, which the validator points out.
Because the whole run is the layer's box, the row can itself track a title or description with the
relative positioning above.

### Text bindings

| Binding | What it resolves to |
|---|---|
| **A property** | That property's value. Rich text is stripped to plain text. |
| **The page name** | The node's name |
| **Reading time** | "5 min read", estimated at 200 words a minute from a rich text property |
| **A date** | A date property (including `createDate` and `updateDate`), in a format you choose |
| **Fixed text** | The same text on every page |
| **Expression** | A token string: `{name}`, `{readingTime}`, `{prop:alias}`, `{date:alias:format}` |

### When text does not fit

Set **max lines**, then choose what happens when it overflows: **shrink** steps the font size down
(to 60% of the configured size), **trim with …** drops whole words and appends an ellipsis, and
**cut off** simply clips. The Preview & test view marks any layer that was truncated.

### Web fonts

A text layer can use a font that was never uploaded: type a family name, tick the weights you
want, and the file is fetched from the provider. Three providers are supported.

| Provider | What you enter | What is fetched |
|---|---|---|
| **Google Fonts** | The family name as Google shows it (`Inter`, `Open Sans`) plus weights and italic | One full TrueType file per weight from `fonts.gstatic.com` |
| **Bunny Fonts** | The same, resolved against Bunny's GDPR-friendly mirror | One `woff2` per weight from `fonts.bunny.net` - the **Latin subset only**, so accented Latin renders but Cyrillic, Greek and other scripts do not |
| **Direct URL** | An `https` URL to a font file | That file. **Static files only**: a variable font renders at its default instance, because the bundled SixLabors.Fonts does not read `fvar` |

Each weight (and each italic, when ticked) becomes its own font row, the same "one family, one
file, one weight" model as an upload, so the rows list and delete individually and a template
references one weight exactly. The family is validated against the provider's CSS API when you add
it - an unknown family or a weight the family does not ship is reported per variant - and needs no
API key.

**Where the file lives.** It is *not* copied into the media library. Each server downloads it the
first time it needs it and keeps a copy under `umbraco/Data/TEMP/DynamicImages/Fonts/` named by
the file's content hash, so a second render, a restart, or another server that already has it
costs no network. Deleting that folder is safe; it is re-fetched transparently. **Refresh** on a
font row re-resolves the provider (Google's file URLs move when a family is updated), re-downloads,
updates the stored hash and drops the old cached copy on every server.

The **Health** dashboard reports a web font that cannot be fetched as `FontUnreachable`, and one
whose file has changed since it was registered as `FontChanged`.

**What the server will and will not fetch.** A font URL is typed by a person in the backoffice and
then fetched by the server, so it is treated as untrusted:

- **`https` only**, on the standard port, with no `user:password@` part.
- **A public host.** Not an IP address, not a bare host name, not a `.local` / `.internal` /
  `.localhost` suffix - and the host is resolved and its *address* checked before the connection
  is made, so a public-looking name that resolves to `169.254.169.254`, `10.0.0.0/8` or anything
  else on the server's own network is refused.
- **No redirects.** A `3xx` is an error saying to enter the URL of the file itself. Google and
  Bunny both serve their files directly, so this costs nothing real.
- **The provider's own host.** A row registered as a Google font has to be served from
  `fonts.gstatic.com`, and a Bunny one from `fonts.bunny.net`.
- **The registered hash.** Once a font is registered, a file whose bytes no longer match the hash
  is not used and not cached - it is parsed on the server and served to every designer's browser,
  so it is not accepted on trust. **Refresh** is how a changed file is taken on deliberately.

These apply wherever the row came from, including a uSync import: the rules live in the fetcher
every code path goes through, not only in the registration screen.

### A font's weight, and a named style's *style*

These are two different things, and the Fonts dashboard shows both, which is easy to misread.

- A font row's **weight** is a number (100–900) describing the *family*. It is detected by reading
  the weight out of the font file's own names — the typographic subfamily, the full font name, the
  PostScript name, then the family name. That is a guess, because a font file is not obliged to put
  its weight in any of them, so the field is **editable**: correct it and save if it is wrong.
- A named style's **style** is one of `Regular`, `Bold`, `Italic` or `BoldItalic`. It names the
  *face*, because that is the four-member enum SixLabors.Fonts itself takes. So an ExtraBold family
  quite correctly carries a named style called `Regular`: the family is already extra bold, and the
  style is not asking for any further emphasis.

In short: one family, one file, one weight — and named styles are a size-and-face shortcut within
that family, not a way to pick a different one.

## Permissions

| Policy | Grants | Applies to |
|---|---|---|
| `DynamicImages.SectionAccess` | The Dynamic Images section in a user group | Everything except the endpoint below |
| `DynamicImages.Regenerate` | The Content section, or Dynamic Images | `POST documents/{key}/regenerate` |

That split is why a content editor who cannot open the designer can still use **Regenerate OG
image** on their own page - from the document's Actions menu, or from the media picker's "…" menu.

### Regenerating one document

Having the section is not enough on its own. Regenerating a document is authorised against **that
node**, with the same check Umbraco's own document endpoints make, so start nodes and per-node
permissions apply:

| The editor has | What happens |
|---|---|
| No **Update** on the node | `403`. Nothing is generated. |
| **Update** but not **Publish** | The image is generated and saved to the **draft**. Publishing it is someone else's call. |
| **Update** and **Publish**, node published with no pending edits | The image is generated and the node is published, so it goes live. |
| **Update** and **Publish**, node has unpublished edits | The image is generated and saved to the **draft**, and the response says so. |

That last row is deliberate. Publishing a node to get an image out would also push out whatever
the editor has been working on and has not chosen to release - so it never happens. The response
outcome is `generateddraft` and the notification tells the editor to publish the page when they
are ready.

Saves and publishes are attributed to the editor who asked for them, not to "System", so the audit
log names a person.

Both places that name real content honour the caller's start nodes too: the designer's "preview
against a real node" picker lists only nodes under them, and previewing against a node the caller
may not browse falls back to sample data rather than returning that node's draft text.

### What regeneration will and will not overwrite

The target property is an ordinary media picker, so it may well be pointing at an image nobody
generated - a shared hero, a logo. Dynamic Images only replaces a media item **it** created for
**that** document, which it records with an Umbraco relation (visible on the media item's
References tab). Anything else it finds there is left alone and a new media item is created
beside it.

Images generated before this was added carry no relation. The first regeneration after upgrading
recognises them by their folder and name, replaces them in place as before, and marks them - after
which the relation is what decides.

## Configuration

```json
{
  "DynamicImages": {
    "Enabled": true,
    "Preview": { "Scale": 0.5 },
    "Sync": { "Mode": "Off", "Folder": "umbraco/DynamicImages" },
    "WebFonts": { "TimeoutSeconds": 15, "MaxBytes": 10485760, "CacheFolder": null }
  }
}
```

| Setting | Default | What it does |
|---|---|---|
| `Enabled` | `true` | Global switch. Read live, so toggling it takes effect on the next publish. |
| `Preview.Scale` | `0.5` | Scale of the designer's debounced preview renders |
| `Sync.Mode` | `Off` | `Export` writes templates to disk on demand; `Import` reads them on start-up |
| `Sync.Folder` | `umbraco/DynamicImages` | Where those JSON files live, relative to the content root |
| `WebFonts.TimeoutSeconds` | `15` | Timeout for one request to a font provider or a font file |
| `WebFonts.MaxBytes` | `10485760` | Largest web font file accepted (10 MB, the same cap as an upload) |
| `WebFonts.CacheFolder` | `null` | Where fetched files are cached. Null is `umbraco/Data/TEMP/DynamicImages/Fonts` under Umbraco's local temp path; a relative value is resolved against the content root |

## Umbraco Cloud

- Fonts and base images are read through Umbraco's media file system, so they work against Azure
  Blob storage.
- Uploaded fonts become media items, so they transfer with Deploy and are shared across
  load-balanced instances. You may need to add `ttf,otf,woff2` to
  `Umbraco:CMS:Content:AllowedUploadedFileExtensions`.
- Template changes are broadcast with Umbraco's own cache refresher, so every instance picks them
  up without a restart.
- Media keys survive a Deploy push, so a template's base image reference holds. Templates
  themselves are data, not schema: move them between environments with **Export**/**Import** on the
  Health dashboard, with file sync, or with the uSync package below. A Deploy connector is not
  included in this version.
- Only the scheduling publisher runs the start-up import, so instances do not race.
- **Web fonts are cached per instance, not shared.** The cache sits in the local temp folder,
  which is ephemeral on Cloud, so every instance downloads each font once after a deploy or a
  restart. That download happens inside the first publish (or preview) that needs the font, so
  the site needs **outbound HTTPS** to `fonts.googleapis.com` and `fonts.gstatic.com` (Google),
  `fonts.bunny.net` (Bunny) or your own host (direct URL). If outbound access is restricted, upload
  the file instead.

## uSync

Dynamic Images keeps its templates and fonts in its own two tables, so nothing in Umbraco backs
them up and uSync on its own does not move them. The optional companion package does:

```bash
dotnet add package Umbraco.Community.DynamicImages.uSync
```

It adds two handlers to the uSync dashboard's **Settings** group, which export to
`uSync/{version}/DynamicImagesTemplates` and `uSync/{version}/DynamicImagesFonts`, one `.config`
file per row. Saving a template or a font in the backoffice writes its file straight away, the way
uSync already does for a document type. Fonts import before templates, because a text layer names
its font by key.

It is a separate package so that uSync, which is MPL-2.0, never becomes a transitive dependency of
Dynamic Images itself. It tracks the uSync **17** line; a uSync 18 site needs an 18.x build of it.

One thing it cannot do on its own:

> uSync moves the template and font **rows**, and Umbraco's own Media handler moves the media
> **nodes** an uploaded font lives in — but uSync does not move media **files**. A `url` or `path`
> font travels completely; an uploaded font arrives as a row pointing at a media item whose binary
> the target environment must already have (Deploy, uSync.Complete, or a re-upload).

The Health dashboard's own **Export**/**Import** and the `Sync` configuration section are
unaffected and still work without uSync.

## Extending it

A layer type is an `ILayerRenderer` plus a model deriving from `LayerBase`:

```csharp
public class MyLayerRenderer : ILayerRenderer
{
    public Type LayerType => typeof(MyLayer);

    public Task<LayerBounds?> RenderAsync(Image image, LayerBase layer, LayerRenderContext context)
    {
        // Draw onto `image`, and return what you covered - or null if you drew nothing.
        // Read context.PositionOf(layer), not layer.Position, so relative positioning works.
    }
}
```

`ILayerRenderer.MeasureAsync` reports what a layer *would* cover, and is called for every layer
another layer is positioned against, before anything is drawn. Its default implementation renders
into a throwaway image and keeps the bounds, so an existing renderer needs no change; override it
when the size is cheaper to work out than the drawing.

`LayerBounds` is the **unrotated** box a layer was laid out in, plus `Rotation`, `PivotX` and
`PivotY` when the layer is turned; `Extent()` gives the axis-aligned footprint on the canvas,
which is what relative positioning hangs off. A renderer that honours `layer.Rotation` turns its
drawing about `context.PositionOf(layer)` (`RotationMath.Matrix` gives the matrix for a path or a
`DrawingOptions.Transform`) and reports the pivot; one that ignores rotation simply draws unrotated
and leaves the three fields at their defaults.

```csharp
public class MyComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
        => builder.WithCollectionBuilder<LayerRendererCollectionBuilder>().Append<MyLayerRenderer>();
}
```

Everything the renderer needs from the page arrives through `IRenderValueSource`, so a renderer can
be tested with `DictionaryRenderValueSource` and no database.

## The API

The endpoints live under `/umbraco/management/api/v1/dynamic-images` and appear as their own
document at `/umbraco/swagger`.

## Licence

MIT.
