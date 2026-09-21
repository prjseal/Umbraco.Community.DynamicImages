# Changelog

## Unreleased

### Changed

- **Umbraco 17.5.3 is now the minimum.** Every 17.x below it has published security advisories
  against it, so there is nothing to be gained by supporting them; it is also the version whose
  `IUser.CalculateContentStartNodeIds` lets the sample-content list be scoped to a user's start
  nodes.

### Security

- **Regenerating a document is authorised against that document.** `POST
  documents/{key}/regenerate` checked only "has the Content section", so any editor could
  regenerate any document by key, start nodes and per-node permissions ignored. It now makes the
  same per-node check Umbraco's own document endpoints make: **Update** on the node, or `403`.
- **Regeneration no longer publishes an editor's pending edits.** It published as the super user
  with cultures `["*"]`, which pushed out every culture *and* any unpublished draft edits on the
  node, attributed to "System". It now publishes only when the image is the only thing that
  changed; a node with pending edits, or an editor who may update but not publish, gets the image
  on the draft and the new `generateddraft` outcome saying so. Saves and publishes are attributed
  to the editor who asked for them, so the audit log names a person.
- **Regeneration only overwrites images this package generated.** The target property is an
  ordinary media picker, so an editor who hand-picked a shared hero or a logo into it would find
  that file replaced site-wide on the next regeneration. Ownership is now recorded as an Umbraco
  relation between the document and the media item, visible on the media item's References tab;
  anything else in the property is left alone and a new media item is created beside it. Images
  generated before this are recognised by their folder and name on the first regeneration after
  upgrading, and marked then.
- **Web font fetching is hardened against SSRF.** Redirects are no longer followed (they let a
  `302` walk past the `https` and public-host checks, which only ever applied to the URL that was
  typed); the host is resolved and its *address* checked immediately before connecting, so a
  public-looking name that resolves to `169.254.169.254` or a private range is refused; the checks
  moved into the fetcher every code path goes through, so a uSync import is no longer a way around
  them; a row naming Google or Bunny must be served from that provider's file host; and a file
  whose bytes no longer match its registered hash is neither served nor cached — **Refresh** is
  how a changed file is taken on deliberately, and the Health dashboard reports the mismatch as
  `FontChanged`. Upstream status codes are no longer echoed for a URL the caller chose.
- **Every render is bounded.** The preview endpoint rendered a posted template with no size
  checks at all, so a `30000x30000` canvas was a 3.6 GB allocation and a single request taking the
  process down. `RenderLimits` now caps the canvas at 4096 px per side and 8 megapixels, layers at
  100, point size at 512, badges at 50, an image overlay at twice the canvas and a text layer at
  2,000 characters of resolved text, and a `RenderGate` caps how many renders run at once. The
  renderer enforces them, so every caller inherits them. See the README.
- **Raw exception text no longer reaches the backoffice.** `ex.Message` went into the preview
  400s, the sync messages and bulk job failures; an IO exception carries full server paths. The
  messages written for editors are kept, everything else is a fixed sentence with the detail in
  the log. A negative `skip` on the sample-content endpoint returned a 500 and is now clamped.
- **Content lookups honour start nodes.** Previewing with a `contentKey` resolved and returned
  the draft text of any node in the site, and `GET document-types/{alias}/content` listed every
  node of a document type — both regardless of the caller's start nodes. A node the caller cannot
  browse now falls back to sample data, and the sample-content list is narrowed in the query
  itself, so its reported total stays true.

### Performance

- **A manual regeneration no longer renders twice.** Setting the property and publishing raised
  `ContentPublishingNotification`, which the publish handler answered by rendering and writing the
  media again. A bulk run over N documents was 2N renders and 2N media saves; it is now N.
- **Long text costs a layout per doubling, not per word.** `TrimToLines` dropped one word at a
  time and re-laid-out the whole string each step. A rich-text body bound to a text layer was tens
  of millions of glyph placements on every publish and every designer keystroke; it now bisects,
  over text capped at 2,000 characters.
- **Measuring a layout produces no pixels.** The designer calls the layout endpoint alongside the
  preview on every debounced change, and measuring rendered a full canvas to read the bounds —
  two full renders per edit. It now runs the same pass minus the drawing.
- **The usage tab is paged.** `GET templates/{key}/usage` walked every document a template covered
  and loaded the content and its media one at a time — 10,000 queries for 5,000 articles, to
  return at most `take` rows. It now runs one paged query per document type and resolves the
  page's media in one call, and takes `skip` as well as `take`. `withImage` becomes
  `withImageOnPage`, because counting the rest would mean loading the rest.
- **Bulk regeneration jobs do not stack.** Two clicks started two full-site runs over the same
  documents; a second job for a template that is already running is now a `409`, and at most two
  run site-wide. Progress counters are interlocked and the failure list is concurrent, so polling
  a running job can no longer throw.
- **Smaller costs on hot paths.** Font cache invalidation ruled out a media save by content type
  before querying the fonts table (it fired on every image upload and crop); the template
  validator and the document-type properties endpoint no longer block on `GetAsync(...)
  .GetAwaiter().GetResult()`, and the latter resolves a document type's data types in one call
  rather than one per property.

### Fixed

- **Regeneration never actually attached the image.** It set the target property and called
  `Publish`, but Umbraco 17 refuses to publish content carrying unsaved in-memory changes
  (`FailedPublishUnsavedChanges`) — which is exactly what the property it had just set was. The
  publish silently persisted nothing, the endpoint reported `generated` anyway because the result
  was ignored, the property still pointed at nothing, and the next regeneration made another
  media item. It now saves and then publishes, and a save or publish that fails is reported as a
  failure with the reason rather than as success.
- **Two template saves carrying the same timestamp could both succeed.** Optimistic concurrency
  was a read-then-write with no condition on the update, so the later save silently discarded the
  earlier one's work. The condition now travels with the `UPDATE`.

### Added

- **uSync support**, as an optional companion package: `Umbraco.Community.DynamicImages.uSync`
  adds two handlers to the uSync dashboard's Settings group, which move the template and font rows
  between environments as files under `uSync/{version}/DynamicImagesTemplates` and
  `.../DynamicImagesFonts` — one `.config` file per row, written the moment a template or a font
  is saved. Fonts import before templates, because a text layer names its font by key. It is a
  separate package so uSync, which is MPL-2.0, never becomes a transitive dependency of Dynamic
  Images. The Health dashboard's own Export/Import and the `Sync` configuration section are
  unaffected and still work without uSync. What uSync cannot carry is an *uploaded* font's binary:
  the row and the media node travel, but not the media file (see the README).
- **Saved and deleted notifications**: `DynamicImagesTemplateSavedNotification`,
  `…TemplateDeletedNotification` and the two `FontDefinition` equivalents are published alongside
  the existing cache refresh, so anything can react to a template or a font changing. They cost a
  dictionary lookup when nothing is subscribed. `IFontService` also gains `Upsert`, which inserts
  or replaces a row exactly as given — every other write path derives the row from a font file it
  fetches first, which a restore cannot do.

- **The canvas fill**: the canvas is filled with a solid colour, a two-stop gradient, or nothing
  at all, and the base image still draws on top of whatever it is - so a *contain* fit pads onto
  the fill rather than onto black. Gradients gain a **radial** kind beside the linear one, on the
  canvas and on shape layers alike, and both read from one gradient model, one brush and one CSS
  builder, so the artboard and the render cannot disagree. **Transparent** is now something to
  choose rather than an alpha slider to know about: the Preview tab and the preview strip show a
  checkerboard behind the render instead of white, and the validator warns when the output format
  is JPEG, which has no alpha channel, and the fill would be flattened. A radial centre outside
  0-1 warns and is clamped, as a shape's sides already are. Nothing needs migrating: a stored
  gradient with no `kind` is the linear one it always was, and a canvas with no
  `backgroundGradient` is the solid colour it always was.
- **The designer accepts the canvas sizes the server does**: width and height went up to 8000 per
  side, matching `TemplateValidator`. At 5000 the designer quietly clamped a larger imported
  template the moment its Width field was touched.

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

- **A test harness and CI.** vitest gains a **browser-mode project** running real Chromium through
  Playwright, because jsdom does no layout and the layout defects below cannot be expressed
  without it; a **Playwright E2E suite** under `Client/e2e/` drives a booted test site; and
  `.github/workflows/ci.yml` runs the .NET tests, the client typecheck, both vitest projects and a
  build on every push and pull request. Its last step asserts
  `git diff --exit-code src/DynamicImages/wwwroot` — the bundle is committed and the release
  workflow has no npm step, so a stale bundle used to ship silently. E2E runs from
  `.github/workflows/e2e.yml` behind `workflow_dispatch`. Before this the repository had no CI at
  all.
- **A `di-*` event-contract guard.** A test collects every `di-*` event the client emits and every
  listener binding, and fails if anything is dispatched that nothing listens for — which is how
  the dead **Server preview** button below had gone unnoticed.
- **Editable font weight and slant.** A detected weight is a guess read out of the font file's
  names, so the Fonts dashboard now lets an editor correct it; `UpdateFontRequest` carries
  `Weight` and `IsItalic`.
- **A reason when a layer draws nothing.** `LayoutResponse` carries a `skipped` list of
  `(key, reason)`, and **Resolved values** renders a row per template layer rather than per
  bounds — a layer that resolved to nothing now says so, and why.

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

- **Dropping a Yes/No property sets a layer's visibility condition** instead of creating a text
  layer that drew the literal word `True` or `False` onto the image. Booleans stay in the palette
  — they are wanted for conditional display — with a distinct chip and an action label saying what
  a drop will do. `createLayerForProperty` returns a discriminated `PaletteDrop`.
- **The three title-length presets are gone** from **Preview & test**. They re-rendered without
  ever changing the title, so all three produced an identical image from the server's own sample
  data. Previewing against a real content item is the supported path, and a hint under the picker
  now says so.
- **The section chrome is registered in `umbraco-package.json`** rather than the bundle — the
  sidebar app, the menu and the Fonts/Health link items, none of which needs an element. Umbraco
  reads that file before the bundle loads, so the sidebar paints immediately instead of after a
  ~250 KB download. Element-bearing extensions stay in `manifests.ts` for the compile-time safety.
- **`LayerRenderContext` gains `Skip(key, reason)`**, and `RenderResult` a `Skips` list.
  `Task<LayerBounds?>` is unchanged — relative layout depends on "no bounds means did not draw" —
  so the reason travels beside it. `IDynamicImageRenderer` gains `MeasureLayoutAsync`.

### Fixed

- The font registry cached a **cancelled or failed load** for the lifetime of the process: the
  shared load ran on the first caller's cancellation token, so a designer preview aborted mid-load
  (or one transient read error) left that font dead on the server until a refresh or restart. A
  failed load is now dropped from the cache and the next render retries.

- **Unsaved template changes were discarded silently on navigation.** Typing into the template
  name and clicking a sidebar item lost the edit with no prompt and no notification. The
  workspace context's own comment claimed extending `UmbSubmittableWorkspaceContextBase` bought
  dirty tracking; it does not — that base class has none, and the guard lives one level up in a
  class requiring a detail repository this package does not have. State moved onto core's
  `UmbEntityWorkspaceDataManager` and the `willchangestate` guard is assembled from core's own
  pieces. Switching between the four workspace views still does not prompt.
- **The designer canvas collapsed to zero height** on windows under 1280px wide and about 700px
  tall — measured 650×0 at 1150×666, with no scrollbar to reveal a stage. The canvas row has a
  240px floor and the centre column scrolls rather than crushing it; the same viewport now
  measures 650×240.
- **The Layers panel used 40% of its own grid row**, leaving empty space beneath it while clipping
  its list — 92px of a 228.8px row. It now fills the row it is given.
- **The zoom readout said 100% whenever the canvas was scaled to fit.** The stage is sized rather
  than transformed, so an unset zoom means "fit", not 100%; a 1200×630 template in a 328px stage
  read 100% and now reads 27%. Zoom in/out step the effective scale too.
- **The "Server preview" button did nothing.** It emitted an event nothing listened for, and its
  busy state was never driven.
- **The designer's preview strip ignored the node picked in Preview & test**, computing its content
  key from a conditional whose branches were both `undefined` and hard-coding `useSampleData:
  true`. A remembered node also never reached the workspace context, so it was lost on a page
  reload.
- **Typed numbers were not clamped.** `min`/`max` reached the native input, which only constrains
  its steppers, so an Opacity of `5` was accepted verbatim. Values are clamped and written back
  into the field, and every numeric inspector field now declares bounds — only Opacity did before.
  Rotation still normalises rather than clamping, because `999 → -81` is correct for an angle.
- **Every registered font reported weight 400**, whatever the file. Weight detection read only
  OpenType name ID 2, which the spec restricts to Regular/Bold/Italic/BoldItalic, so a SemiBold
  face reporting subfamily "Regular" came back as 400. It now reads the typographic subfamily, the
  full font name, the PostScript name and the family name as well: an ExtraBold family reports
  800, a SemiBold one 600.
- **"Add a style" closed the editor**, so a new style had to be reopened to be named. Adding and
  deleting now keep it open, and focus lands in the new row's name.
- **The workspace browser-tab title had an empty leading segment** — `| Design | Umbraco` rather
  than `Article OG image | Design | Umbraco`.
- **`.woff` was accepted but never mentioned** in the upload modal, the dashboard empty state or
  the server's own rejection message.
- **The font upload control was a raw browser file input**; it is now `uui-file-dropzone`.
- **Installing the package left its section invisible.** Declaring a section registers it but does
  not grant it, and a freshly installed site's Administrators group lists only the core sections.
  A migration now adds it to Administrators.

## 1.0.0

The first release. Templates live in the database and are designed in a backoffice section
rather than being written by hand in `appsettings.json`.

### Added

- A **Dynamic Images** backoffice section: templates menu, overview, fonts and health dashboards.
- A **drag-and-drop designer**: property palette, artboard with rulers, snapping guides and a
  safe-area overlay, a full inspector, a z-order layers panel, undo/redo, and keyboard nudging.
  Layers render with the real font files, and the server's own measured bounds can be overlaid.
- **Anchored positioning**: every layer has an anchor as well as an x/y, so right- and
  centre-aligned layers stay put whatever their content does.
- **Layer types**: text, image, badges and shapes, as a
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
