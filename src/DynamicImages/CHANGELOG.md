# Changelog

## Unreleased

### Added

- **Rotation**: every layer has a rotation in degrees, clockwise, and turns about its anchor point
  - so a tracked axis still works and a middle-anchored layer spins in place. Text rotates through
  ImageSharp's drawing transform, so wrapping and the reported line box are untouched; shapes turn
  their path (and their gradient); images and badge rows are rotated as a whole and placed by
  their centre. In the designer the box, its handles and the measured overlay tilt with the
  layer, a round handle above the selection rotates it (Shift for 15° steps, one undo step per
  drag), a rotated layer moves by its tilted footprint and resizes along its own axes, and a layer
  tracking a rotated one follows that footprint. The maths is shared with the client through
  `rotation-fixtures.json`.
- **Shapes**: the shape layer draws a rectangle, ellipse, polygon (3-12 sides) or star (3-12
  points, inner ratio 0.1-0.9), with a solid or gradient fill and an optional **border** drawn
  inside the box. Fill can be turned off for an outline alone. The palette offers a rectangle and
  an ellipse. The document keeps the `rect` discriminator and every existing template reads as a
  rectangle, so nothing needs migrating; the polygon and star vertices are shared with the client
  through `shape-fixtures.json`. The validator warns about sides or an inner ratio outside the
  range (the renderer clamps them) and about a shape with nothing to paint.
- **Relative positioning**: each axis of a layer's position is either absolute or tracks another
  layer by an edge and a gap - `below`, `above`, `rightOf`, `leftOf`. A description can start a
  fixed distance under a title whatever the title's height, and a badge row under that. References
  are resolved by a measure pass before anything is drawn, so the tracked layer may sit anywhere in
  z-order. A reference that draws nothing (empty value, hidden, visibility rule) is skipped and the
  chain carries on to what *it* tracks; a loop resolves as absolute and is reported by the
  validator.
- **Badge layout options**: labels below the icon (as before), beside it - which makes each item as
  wide as its own label - or off entirely, plus wrapping onto new rows against the layer's width
  with a configurable row gap.
- **Web fonts**: a font can now be a **Google Fonts** or **Bunny Fonts** family - type the name,
  tick the weights and italic - or a **direct URL** to a font file. Each weight becomes its own
  font row, validated against the provider's CSS API with no API key. The file is fetched the
  first time a server needs it and cached on that server's disk under
  `umbraco/Data/TEMP/DynamicImages/Fonts`, content-addressed by hash, rather than stored as a media
  item; a **Refresh** action re-resolves and re-downloads it. Bunny fonts render the Latin subset
  only; direct URLs must point at static (non-variable) files. New `WebFonts` options
  (`TimeoutSeconds`, `MaxBytes`, `CacheFolder`), a `FontUnreachable` health warning, and
  `POST fonts/register-web` / `POST fonts/{key}/refresh` endpoints. The font table gains three
  nullable columns (`sourceUrl`, `provider`, `providerFamily`) through a migration.

### Changed

- `LayerBounds` and the layout API's `LayerBoundsResponse` carry three new fields - `rotation`,
  `pivotX` and `pivotY` - and `LayerBounds.Extent()` gives the rotated footprint. The box itself
  stays the unrotated layout box, so nothing changes for a layer that is not rotated.
- A `rect` layer with only a border (no fill and no gradient) now draws and occupies its box;
  before, it drew nothing. The `NoFill` validation warning now fires only when there is no fill,
  gradient or border.
- Text layers now report their **line box** rather than their glyph ink as their bounds, so a gap
  measured below "Hello" and below "Happy" is the same gap, and the designer's measured overlay
  agrees with its DOM box. Nothing about where text is drawn has changed.
- `IFontFileProvider.OpenAsync` takes the `FontDefinition` rather than a positional
  `(kind, mediaKey, path)`, and `FontResponse` carries `provider`, `sourceUrl` and
  `providerFamily`, with `sourceKind` now also `"url"`.

### Fixed

- The font registry cached a **cancelled or failed load** for the lifetime of the process: the
  shared load ran on the first caller's cancellation token, so a designer preview aborted mid-load
  (or one transient read error) left that font dead on the server until a refresh or restart. A
  failed load is now dropped from the cache and the next render retries.

## 2.0.0

Templates move from `appsettings.json` into the database and are designed in a new backoffice
section. **This is a breaking change** - see "Migrating from v1" in the README. Your existing
configuration is imported automatically on first start.

### Added

- A **Dynamic Images** backoffice section: templates menu, overview, fonts and health dashboards.
- A **drag-and-drop designer**: property palette, artboard with rulers, snapping guides and a
  safe-area overlay, a full inspector, a z-order layers panel, undo/redo, and keyboard nudging.
  Layers render with the real font files, and the server's own measured bounds can be overlaid.
- **Anchored positioning**: every layer has an anchor as well as an x/y, so right- and
  centre-aligned layers stay put whatever their content does.
- **Layer types**: text, image, badges (generalised from v1's category badges) and shapes, as a
  discriminated union with an `ILayerRenderer` per type that consuming sites can extend.
- **Text bindings** including a general expression syntax with `{name}`, `{readingTime}`,
  `{prop:alias}` and `{date:alias:format}` tokens.
- **Max lines and overflow handling** - shrink, ellipsis or clip - which ImageSharp has no
  primitive for and OG titles need constantly.
- **Fonts as media items**, uploaded in the backoffice, with named styles. `wwwroot` paths are
  still supported.
- **Preview and regeneration**: a live server preview, a sample-content picker, single and bulk
  regeneration, and a usage view.
- **Regenerate OG image** as a document entity action and a media picker property action, available
  to content editors without the section.
- A **Management API** with its own Swagger document, a **health check** across every template, and
  **JSON export/import** plus optional file sync for moving templates between environments.
- Distributed cache invalidation, so a template edit takes effect on every server without a
  restart.

### Fixed

- Configuration was frozen at start-up: the composer refused to register anything when generation
  was disabled or no fonts were configured, so adding a font meant restarting the application.
- Generated images were encoded as JPEG but saved with a `.png` filename. The encoder and the
  extension now both follow the template's output format.
- A mistyped font key threw out of an unguarded dictionary indexer mid-publish.
- An empty or malformed colour threw from `Color.ParseHex`. Colours are now validated, and a bad
  one is a validation error rather than a failed publish.
- Rich text was drawn as raw HTML, tags and all.
- Regenerating created a new media item every time, orphaning the old one and invalidating any URL
  already shared. The existing file is now replaced in place, keeping the media key.
- `wwwroot` path sources were not validated and could escape the web root.
- Two fonts sharing a family name collided in a shared font collection.

### Removed

- `DynamicImagesTestController`, an anonymous API endpoint that could publish content. The
  authorised Management API endpoints replace it.
- `Instruction.Author` and `Layer.LabelLetterSpacing`, neither of which was ever read.
