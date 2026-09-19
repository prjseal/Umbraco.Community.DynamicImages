# Dynamic Images for Umbraco

Generate Open Graph / social share images from your content automatically, and design them in the
backoffice instead of writing configuration by hand.

When an editor publishes a page, Dynamic Images composites your text, images and category badges
over a base image, saves the result to the media library, and sets it on the page's media picker -
all within the publish that is already running. What gets drawn is a **template**: a canvas and a
stack of layers you build by dragging properties onto an artboard.

![The Dynamic Images designer](https://raw.githubusercontent.com/prjseal/Umbraco.Community.DynamicImages/dev/v2/docs/screenshots/02-designer.png)

## Installing

```
dotnet add package Umbraco.Community.DynamicImages
```

On first start the package creates two tables, installs a media type for font files, and - if
there is a v1 `DynamicImages` block in your configuration - imports it.

Then grant the section: **Users → User Groups → (your group) → Sections → Dynamic Images**. Nobody
sees the section until you do, including administrators.

## Getting started

1. **Add a font.** Dynamic Images → Fonts → *Add a font*. Upload a `.ttf`, `.otf` or `.woff2`, or
   register a path to one already in `wwwroot`. Text layers cannot render without one.
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

A fixed size in pixels, a background colour, and an optional base image - a media item, a file in
`wwwroot`, or a property on the page being rendered. *Use image size* sets the canvas to the base
image's own dimensions.

### Layers

Layers are drawn bottom to top, in the order the layers panel shows them reversed.

| Type | What it draws |
|---|---|
| **Text** | A value from the page, formatted and fitted to its box |
| **Image** | A media item, a `wwwroot` file, or a media picker property on the page |
| **Badges** | A row or column of circular badges from a multi-node picker - categories, tags, authors. Labels below, beside, or off, with optional wrapping |
| **Shape** | A solid or gradient rectangle, for scrims behind text |

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

## Permissions

| Policy | Grants | Applies to |
|---|---|---|
| `DynamicImages.SectionAccess` | The Dynamic Images section in a user group | Everything except the endpoint below |
| `DynamicImages.Regenerate` | The Content section, or Dynamic Images | `POST documents/{key}/regenerate` |

That split is why a content editor who cannot open the designer can still use **Regenerate OG
image** on their own page - from the document's Actions menu, or from the media picker's "…" menu.

## Migrating from v1

v2 is a breaking change: templates live in the database and are edited in the backoffice, not in
`appsettings.json`.

Leave your existing `DynamicImages` block where it is. On first start against an empty template
table it is imported: instructions become templates, fonts are registered from their paths, and
layers keep their positions. You can also import it again at any time from the banner on the
Overview dashboard, or paste a v1 block into *Import JSON*.

Once the import looks right, trim the configuration to:

```json
{
  "DynamicImages": {
    "Enabled": true
  }
}
```

Editing the old `Instructions` no longer changes what renders.

What the import cannot carry over is called out in the warnings it returns:

- `Author` was never read when rendering in v1, so it is dropped.
- A `SuffixText` containing `{readingTime}` becomes an **expression** binding, which is the general
  form of that special case.

Behaviour that changed on purpose:

- **Output format is honoured.** v1 always encoded JPEG but named the file `.png`. The encoder and
  the extension now both follow the template's format setting, which defaults to PNG.
- **Regeneration replaces the file in place**, keeping the media key - so existing picker
  references and shared URLs keep resolving.
- **Rich text is stripped to plain text** rather than drawn as raw markup.
- **A missing font or unreadable colour is a validation error**, not an exception during a publish.

## Configuration

```json
{
  "DynamicImages": {
    "Enabled": true,
    "AutoImportLegacyConfig": true,
    "Preview": { "Scale": 0.5 },
    "Sync": { "Mode": "Off", "Folder": "umbraco/DynamicImages" }
  }
}
```

| Setting | Default | What it does |
|---|---|---|
| `Enabled` | `true` | Global switch. Read live, so toggling it takes effect on the next publish. |
| `AutoImportLegacyConfig` | `true` | Import a v1 block on first start against an empty table |
| `Preview.Scale` | `0.5` | Scale of the designer's debounced preview renders |
| `Sync.Mode` | `Off` | `Export` writes templates to disk on demand; `Import` reads them on start-up |
| `Sync.Folder` | `umbraco/DynamicImages` | Where those JSON files live, relative to the content root |

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
  Health dashboard, or with file sync. A Deploy connector is not included in this version.
- Only the scheduling publisher runs the start-up import, so instances do not race.

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
