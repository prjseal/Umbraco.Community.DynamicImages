# Backoffice UI review fixes and a regression-test harness

## Context

[`plans/ui-review-findings.md`](./ui-review-findings.md) records 18 findings from a manual
review of the Dynamic Images backoffice, driven through a real browser against
`src/DynamicImages.TestSite.Clean`. Triage with the repo owner settled the scope: **17 to action,
C9 discarded as working-as-intended.** This plan turns those decisions into a build.

Two findings dominate because they hit real users:

- **A4** — an edit to the template name is discarded silently on navigation. Straightforward data
  loss.
- **B1** — the designer canvas measures `650×0` at a 1150×666 viewport. The designer is unusable on
  a laptop-width or short window.

Alongside the fixes, the plan builds the regression harness section 6 of
[`plans/ui-review-method.md`](./ui-review-method.md) proposes. This is an explicit
requirement, not a nice-to-have: **there is no CI workflow in this repository at all today** —
`.github/workflows/release.yml` is tag-triggered and only packs and pushes to NuGet. The .NET tests
and the vitest specs have never run automatically.

### Decisions already made

Settled in triage, before this plan:

- **A2 — remove, do not wire up.** Delete the three title-length preset buttons. Previewing against
  a real content item is the supported path instead. That makes **A3 load-bearing**: it is what
  editors will use to test real titles, so it carries more weight than its medium severity implies.
- **C3 — reframed.** Booleans stay listed and draggable in the palette; they are wanted for
  conditional display, and the layer visibility rule already has a "Controlled by" property picker
  aimed at exactly that. What changes is what *dropping* one produces.
- **C9 — closed.** Working as intended. Not reopened here.
- Test-site media files and the committed `Imaging:HMACSecretKey` are settled and not revisited.

Settled in this planning session:

- **A1 — wire the button up**, not remove it. `di-preview-strip` gains a public `refresh()` that
  bypasses the debounce; the toolbar's existing `previewing` property finally gets driven.
- **Component tests — vitest browser mode with the Playwright provider.** One runner, one browser
  download shared with E2E, and a real Chromium so `getBoundingClientRect()` assertions mean
  something. jsdom cannot do layout and so cannot pin B1, B2 or B3 at all.
- **CI — unit and component on every push/PR; E2E behind `workflow_dispatch`.** First boot of the
  test site imports ~192 uSync items, so E2E is minutes, not seconds.
- **D — defer the import and retry**, rather than just demoting the log line.

### Facts verified against the source while planning

Every `file:line` in the findings doc still resolves. Three things the findings doc gets wrong or
could not know, which change the design:

1. **`UmbSubmittableWorkspaceContextBase` has no dirty tracking.** The doc comment at
   `workspace/di-template-workspace.context.ts:21-23` claims extending it "buys Save, dirty tracking
   and the unsaved-changes prompt for free". It does not. Umbraco 17's base class carries a
   commented-out `#isDirty` and a note explaining the team chose not to implement it; the
   unsaved-changes guard lives one level up, in `UmbEntityDetailWorkspaceContextBase`. So A4 is not
   "the state is in the wrong place" — the machinery was never inherited. That comment must be
   corrected as part of the fix.
2. **One half of the guard is publicly exported** from `@umbraco-cms/backoffice/workspace`:
   `UmbEntityWorkspaceDataManager` (persisted/current pair, `getHasUnpersistedChanges()` via
   `jsonStringComparison`). Plus `UMB_DISCARD_CHANGES_MODAL` and `umbOpenModal` from
   `@umbraco-cms/backoffice/modal`. So A4 does **not** need a rewrite onto
   `UmbEntityDetailWorkspaceContextBase` — which would mean a detail repository, an entity context
   and action-event reload events, none of which this package's bespoke fetch layer has.

   **Corrected during implementation:** this plan originally claimed a second export,
   `umbWorkspaceWillNavigateAway(routes, unique, newUrl)`. There is no such export in 17.x. Core
   has only a protected `_checkWillNavigateAway(newUrl)` method on the detail base class, and it is
   one line — `!newUrl.includes(this.routes.getActiveLocalPath())`. That line is inlined in our
   context instead. The consequence is the same, including the part that matters: a workspace view
   URL keeps the workspace's own path as a prefix, so switching views never prompts.
3. **C4 is a two-liner.** `UmbSubmittableWorkspaceContextBase` already exposes
   `public readonly view = new UmbViewContext(this, null)`, and `UmbViewContext extends
   UmbViewController`, which has `setTitle()`. The observed `| Design | Umbraco` is exactly what
   `#computeTitle()` produces when the parent view's title is `undefined`.

Server-side facts that shape C2, C5 and D:

- `WeightOf` (`Core/Services/FontService.cs:463-475`) only inspects
  `FontSubFamilyNameInvariantCulture` — OpenType name ID 2, which the spec restricts to
  Regular/Bold/Italic/BoldItalic. `Inter-SemiBold.ttf` puts its weight in the *family* name and
  reports subfamily "Regular", hence 400. SixLabors.Fonts 2.0.8 exposes no OS/2 `usWeightClass`,
  but `FontDescription.GetNameById(CultureInfo, KnownNameIds)` **is** public, and
  `TypographicSubfamilyName` (ID 17), `FullFontName` and `PostscriptName` all carry the weight.
- A layer that draws nothing is **omitted** from `LayoutResponse.Layers`
  (`Core/Rendering/DynamicImageRenderer.cs:52`), with no flag and no reason. The
  `Task<LayerBounds?>` contract is load-bearing — `MeasureReferencesAsync` relies on "no bounds
  means did not draw" to send relative-layout trackers up the chain — so C5 must add a channel
  beside it, not change it.
- `PreviewRequest` (`Api/Models/ApiModels.cs:112-130`) has no `SampleTitle`. Given the A2 decision,
  it never needs one: **A2 is a pure client-side deletion, no server change.**
- The v1 import runs from `DynamicImagesStartupComponent.InitializeAsync`
  (`IAsyncComponent`), with no `IRuntimeState` check anywhere in the package. The
  "only into an empty table" guard at `:52` makes any retry idempotent.

---

## Design

### 1. A4 — the unsaved-changes guard (highest priority)

Do what core does, using core's own exported pieces, without inheriting core's repository contract.

**Replace the bespoke state with the data manager.** In `di-template-workspace.context.ts`, swap
`#template = new UmbObjectState<DiTemplate | undefined>(undefined)` for
`_data = new UmbEntityWorkspaceDataManager<DiTemplate>(this)`. Everything downstream maps
one-for-one, so `#setTemplate` stays the single write path:

| today | becomes |
|---|---|
| `this.#template.setValue(t)` | `this._data.setCurrent(t)` |
| `this.#template.getValue()` | `this._data.getCurrent()` |
| `readonly template = this.#template.asObservable()` | `readonly template = this._data.current` |
| `unique = this.#template.asObservablePart(t => t?.key)` | `this._data.createObservablePartOfCurrent(t => t?.key)` |

`load()` and `submit()` additionally call `setPersisted(response)` with the **same object** they
pass to `setCurrent`, so the two are byte-identical at rest and a JSON comparison cannot produce a
false-positive dirty flag. `createScaffold()` sets both to the scaffold, so opening Create and
navigating straight back does not prompt. Override `resetState()` to call `this._data.clear()`.

**Add the guard**, mirroring `UmbEntityDetailWorkspaceContextBase` (registered in the constructor,
removed in `destroy()` — core leaks these listeners; we should not):

```ts
getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges();

// Core's own check, inlined - see the correction above.
#willNavigateAway = (url: string) => !url.includes(this.routes.getActiveLocalPath());

#onWillNavigate = async (event: CustomEvent) => {
  if (this.#allowNavigateAway) return true;
  if (!this.#willNavigateAway(event.detail.url)) return true;
  if (!this.getHasUnpersistedChanges()) return true;
  event.preventDefault();                       // modals are async, the event is not
  try {
    await umbOpenModal(this, UMB_DISCARD_CHANGES_MODAL);
    this.#allowNavigateAway = true;             // the pushState below re-fires willchangestate
    history.pushState({}, "", event.detail.url);
    return true;
  } catch { return false; }
};
#onBeforeUnload = (event: BeforeUnloadEvent) => {
  if (this.getHasUnpersistedChanges()) { event.preventDefault(); event.returnValue = ""; }
};
```

Switching between the four workspace views must not prompt. The check is against
`getActiveLocalPath()`, and a view URL is `…/edit/<key>/view/<pathname>` — a prefix match, so it
returns `false`. **Rename the route param `edit/:key` → `edit/:unique`** so the workspace reads
like every other one (not load-bearing for the guard, which has only the one check). Update
`setup: (_c, info) => this.load(info.match.params.unique)` with it.

Finally, **correct the doc comment at `:21-23`** — it currently states the opposite of what the base
class does, which is what made this bug invisible.

### 2. B1 + B2 — one layout change, not two patches

The two defects are the same mistake made twice: a flexible row with no floor, and a percentage
height resolved against a box that was itself sized by the content.

**`workspace/views/di-design-view.element.ts`:**

- `.centre` (`:477-482`) is `grid-template-rows: auto 1fr auto` where the canvas is the only
  flexible row, so it absorbs every shortfall down to zero. Give it a floor and let the column
  scroll instead of crushing: `grid-template-rows: auto minmax(240px, 1fr) auto;` and
  `overflow: auto` on `.centre`. When toolbar (91px) + strip (160px) + 240px exceeds the viewport,
  the centre column scrolls — a scrollbar is a far better failure mode than a zero-height stage.
- At `@media (max-width: 1280px)` (`:492-504`) `.side` drops below the canvas at `max-height: 45vh`.
  Tighten to `max-height: 40vh` **and** change `.layout`'s rows to `minmax(320px, 1fr) auto`, so the
  canvas row is guaranteed its share before the side block takes any.
- Add a `@media (max-height: 720px)` block that collapses the preview strip's reserved space: the
  strip's `.body { min-height: 84px }` becomes `min-height: 0` and the `img { max-height: 120px }`
  becomes `72px`. That is the 126px the review measured the collapsed strip freeing, recovered
  automatically on a short window.

  **Corrected during implementation:** both rules live inside `di-preview-strip`'s shadow root,
  which the design view's stylesheet cannot reach. The strip declares them as the custom
  properties `--di-preview-strip-body-min-height` and `--di-preview-strip-image-max-height`
  (defaulting to today's 84px and 120px), and the media query sets those on `di-preview-strip`
  from the design view. Same numbers, same effect, through the only channel that crosses a
  shadow boundary.

**`designer/di-layers-panel.element.ts:148-155`:** delete `max-height: 40%` from `:host`. The
percentage resolves against the grid row the panel was already given, so 60% of that row was
guaranteed waste. Replace with `min-height: 0; overflow: auto;` and move the scroll to `.panel`.
`.side` is already `grid-template-rows: 1fr auto` — the panel is the `auto` row, so it sizes to its
content and the inspector takes the rest, which is the intended behaviour. To stop a long stack
eating the whole column, cap it against the *viewport* rather than its own row:
`max-height: min(50vh, 100%)`.

This also fixes the clipped empty-state sentence on a new template, which was the same cause.

### 3. B3 — the zoom readout

`di-designer-canvas` already computes the truth: `get scale() { return this.zoom ?? this._fitScale }`
(`:100-102`). The design view passes `.zoom=${this._zoom ?? 1}` to the toolbar, which is `1` whenever
zoom is unset — i.e. exactly when "Fit" is active.

Have the canvas emit its effective scale whenever it changes — in `#recomputeFit()` where the change
is already detected (`:145`), and in `updated()` when the `zoom` property changes:

```ts
this.dispatchEvent(new CustomEvent("di-scale-change", { bubbles: true, composed: true,
  detail: { scale: this.scale } }));
```

`di-design-view` holds `_effectiveScale` from that event and passes it to the toolbar. The toolbar
renders `Math.round(effectiveScale * 100)%`, and its zoom in/out buttons multiply the *effective*
scale, so stepping up from Fit lands where you expect instead of jumping to 125%.

### 4. A1 + A3 — the preview surfaces

Both live in `workspace/views/di-preview-strip.element.ts`.

**A3.** Line `:83` reads `const contentKey = this.#context.getData() ? undefined : undefined;` —
both branches undefined — and `:86` hard-codes `useSampleData: true`. The strip already observes
`sampleContentKey` but only to retrigger a render it then performs with sample data. Track both
context values into fields and use them:

```ts
this.observe(context.sampleContentKey, (key) => { this.#contentKey = key; this.#schedule(...); });
this.observe(context.useSampleData,    (v)   => { this.#useSampleData = v ?? true; });
// …
fetchPreview(template, { signal, contentKey: this.#contentKey,
                         useSampleData: this.#useSampleData }, this.#context.getToken)
```

There is a **second half** the findings doc does not mention: `di-preview-view.element.ts`
`connectedCallback` (`:79-80`) restores the remembered node from `localStorage` into `_sampleNode`
but never calls `context.setSampleContentKey(...)`. So after a full page load the context stays
unset even though the Preview & test view shows the right node. Add the call, so the strip agrees
with the picker on a cold load too, not only after an in-app pick.

**And a third, found while implementing it:** the restore cannot stay in `connectedCallback` at
all. `#storageKey()` is `di:sample-node:${this._template?.key ?? "new"}`, and `_template` is set
from the context observable, which has not resolved when `connectedCallback` runs — so the
restore was reading the `…:new` key and could never find what `#remember` wrote under the
template's own key. The restore moves into the `context.template` observer, firing once when the
template first arrives, which is the earliest point the key is knowable.

**A1.** `di-canvas-toolbar` emits `di-request-preview` (`:69`) and nothing listens. Give
`di-preview-strip` a public `refresh()` that renders immediately, bypassing `PREVIEW_DEBOUNCE_MS`,
and expands the strip if collapsed. Handle the event on `.layout` in `di-design-view` alongside the
~20 others already there, and have the strip emit `di-preview-state { busy }` so
`.previewing=${this._previewing}` on the toolbar finally does something.

### 5. A2 — remove the title-length presets

Pure deletion in `workspace/views/di-preview-view.element.ts`: the `TITLE_PRESETS` const (`:11-20`),
`#useSampleTitle` (`:138-146`), the `.presets` block in `render()` (`:245-260`) and the `.presets`
styles (`:343-351`). `#render(_sampleTitle?: string)` loses its unused parameter and the call at
`:145` goes with the handler. No server change — `PreviewRequest` never had a `SampleTitle`.

Replace the removed row with a one-line hint under the picker pointing at what replaces it: *"Choose
a content item above to preview this template against a real title and image."* That is the A2→A3
handoff made visible.

### 6. A5 — clamp typed numbers, and give the fields bounds

`inputs/di-number-field.element.ts:29-33` dispatches whatever was typed. `min`/`max` reach the native
input (`:47-48`), which only constrains the steppers. Clamp in `#onChange`:

```ts
const raw = (event.target as HTMLInputElement).value;
let value = raw === "" ? null : Number(raw);
if (value !== null && Number.isFinite(value)) {
  if (this.min !== undefined) value = Math.max(this.min, value);
  if (this.max !== undefined) value = Math.min(this.max, value);
} else if (value !== null) { return; }          // "abc" → keep the last good value
if (value !== Number(raw)) (event.target as HTMLInputElement).value = String(value);
```

Writing the clamped value back to the input matters: without it the field keeps showing `5` while
the model holds `1`.

Then declare bounds on the fields in `designer/di-layer-inspector.element.ts` that have none. Put the
numbers in one exported table so the guard test in section 10 can assert against it rather than
duplicating them:

| field | min | max |
|---|---|---|
| Size (font size) | 1 | 800 |
| X, Y | −5000 | 5000 |
| Width, Height | 1 | 5000 |
| Line spacing | 0.5 | 4 |
| Letter spacing | −20 | 100 |
| Max lines | 1 | 20 |
| Corner radius, Gap, Row gap, Circle/Icon/Label size, Label gap | 0 | 2000 |

Four fields the plan's survey missed, added during implementation: Border width (0–200), the
relative-layout Gap (−2000–2000, which unlike the badge gaps may be negative — overlapping the
reference layer is a legitimate design), Max items (1–50) and the gradient Angle (0–360). The
three fields that *already* had bounds — Sides/Points, Inner ratio and Opacity — move onto the
same table rather than keeping their own literals, since one source of truth is the point of the
table. Sides and Inner ratio re-export `MIN_SIDES`/`MAX_SIDES`/`MIN_INNER_RATIO`/`MAX_INNER_RATIO`
from `shape-geometry.ts`: those are a geometry contract shared with the server, not a UI
preference, so the table points at them rather than restating them.

Rotation keeps normalising at the call site (`normalise()` at `:809`) rather than clamping — wrapping
`999 → -81` is correct behaviour and the shared `rotation-fixtures.json` already pins it.

### 7. C3 — a dropped boolean becomes a visibility condition

The model already has everything needed: `VisibilityRuleKind` includes `"whenPropertyTruthy"` and
`DiVisibility` carries `propertyAlias` (`api/types.ts:60-65`). Only the drop behaviour changes.

`models/layer-factories.ts`: `layerTypeFor` (`:147-157`) currently returns `"text"` for `boolean`
via its `default`. Change `createLayerForProperty` to return a discriminated result:

```ts
export type PaletteDrop =
  | { kind: "layer"; layer: DiLayer }
  | { kind: "condition"; propertyAlias: string; propertyName: string };
```

`boolean` produces `condition`; everything else is unchanged. `layerTypeFor` keeps its current
signature and gains an explicit `case "boolean"` so the intent is legible.

`di-designer-canvas.#onDrop` (`:496-512`) adds the layer under the pointer to the event detail —
`event.composedPath().find(n => n.tagName === "DI-LAYER-BOX")?.dataset.key` — a free hit-test, no
geometry.

`di-design-view.#addFromPayload` then resolves the condition:

- a target layer from the drop, else the selected layer → set
  `visibility: { rule: "whenPropertyTruthy", propertyAlias }` on it and peek a positive notification
  naming both ("*Photo card* now shows only when **Is Followable** is ticked").
- neither → peek a warning: *"Drop a Yes/No property onto a layer, or select one first — it controls
  when that layer is shown."*

`di-property-palette` gives boolean chips a distinct left-border colour and a `+` button labelled
"Use {name} as a show/hide condition", so the chip tells you what will happen before you drag it —
the file's own comment at `:186-188` already states that the border colour encodes exactly this.

### 8. C1, C2, C6, C7 — fonts

**C1** (`dashboards/di-fonts-dashboard.element.ts`): "Add a style" (`:317-323`) and the per-row
delete (`:300-307`) both call `#saveStyles`, which sets `_editingKey = undefined` (`:150`) and closes
the editor. Give `#saveStyles` a `{ keepOpen?: boolean }` option; add and delete pass `true`, the
explicit **Save** button does not. After an add, focus the new row's name input in `updated()`.

**C2** (`Core/Services/FontService.cs`): widen `WeightOf` to read, in order, the typographic
subfamily (name ID 17), the full font name, the PostScript name and the family name — all reachable
through the public `FontDescription.GetNameById(CultureInfo.InvariantCulture, KnownNameIds.…)` — and
run each through the existing most-specific-first `NamedWeights` table before falling back to the
current `FontStyle.Bold ? 700 : 400`. The table already covers ExtraBold/SemiBold/etc.; only the
inputs were too narrow. No new dependency, no SixLabors bump.

Related and worth the same pass: `UpdateFontRequest` (`ApiModels.cs:88`) carries only `FamilyName`
and `Styles`, so a wrong weight cannot be corrected through the UI. Add `Weight` and `IsItalic` to
the request and to `FontService.Update`, and surface them as fields in the dashboard's style editor.
A detected weight is a guess; an editor needs to be able to overrule it.

The named-style `fontStyle` stays the Regular/Bold/Italic/BoldItalic string
(`Core/Models/Layers/TextStyle.cs:55-56`) because `FontRegistry:37` parses it into SixLabors' own
four-member enum. Note in the README that a style names the *face*, while the family's numeric
weight is what the file reports — that is the distinction the review found confusing.

**C6**: `.woff` is accepted (`FontService.cs:40`) but unmentioned in three places — the modal hint
(`modals/di-font-upload-modal.element.ts:157-160`), the dashboard empty state, and the server's own
rejection message (`FontService.cs:51-55`). Make all three read ".ttf, .otf, .woff2 or .woff".

**C7**: replace the raw `<input type="file">` (`:150-156`) with `uui-file-dropzone` from
`@umbraco-cms/backoffice/external/uui` — same `accept` / `multiple` / `label` attributes, a `@change`
carrying `event.detail.files`, and it is what `umb-input-dropzone` is built on in core, so it matches
the surrounding chrome. Our handler keeps posting to the fonts endpoint; we are borrowing the
control, not core's media upload manager.

### 9. C4, C5, C8, D — the remainder

**C4** — in the workspace context constructor, observe the name and set the view title:

```ts
this.observe(this._data.createObservablePartOfCurrent((t) => t?.name), (name) => {
  this.view.setTitle(name || "New template");
});
```

`this.view` is already there on the base class. The tab title becomes
`Article OG image | Design | Umbraco`.

**C5** — a layer that resolves to nothing needs a row *and* a reason. Keep `Task<LayerBounds?>`
untouched (relative layout depends on it) and add a parallel channel:

- `LayerRenderContext` gains `Skip(Guid key, string reason)`; the renderers that already know why
  they are returning null call it first — `TextLayerRenderer:60` ("the text resolved to nothing"),
  `:65-71` ("the font is unavailable"), `ImageLayerRenderer:19` ("the image could not be loaded"),
  `:23`/`:86` ("the computed size is zero"), `BadgesLayerRenderer:124`/`:127`,
  `RectLayerRenderer:21`/`:24`.
- `DynamicImageRenderer` records its own three `ShouldDraw` cases (`:136-149`: hidden, opacity 0,
  visibility rule not met), the no-renderer case (`:46`) and the exception case (`:63`), and supplies
  a generic "this layer produced nothing" for any null with no recorded reason.
- `LayoutResponse` gains `IReadOnlyList<LayerSkipResponse>(Guid Key, string Reason)`. `DiLayoutResult`
  in `api/types.ts` follows.
- `di-preview-view` renders a row per **template layer**, not per bounds: value/position/size when
  it drew, and a muted "not drawn — {reason}" row when it did not. This is exactly the case where an
  editor most needs telling.

**C8** — most of the 5–10s blank is the host loading our 243 KB entry point before anything of ours
exists to render a spinner in. What we control is the section chrome: move the `sectionSidebarApp`,
the `menu` and the two link-kind menu items (Fonts, Health — none of which has an `element`) from
`manifests.ts` into `wwwroot/App_Plugins/DynamicImages/umbraco-package.json`, which Umbraco reads
before the bundle loads. The sidebar then paints immediately. Element-bearing extensions stay in
`manifests.ts` for the compile-time safety the file's comment at `:4-8` argues for. Add a loading
state to `di-templates-menu-item`. Then **measure a Release build and record the number** in the
findings doc — the review flagged that some of this is dev-mode cost, and that has not been checked.

**D** — move the v1 import off `IAsyncComponent.InitializeAsync`
(`Composing/DynamicImagesStartupComponent.cs:19`) to an
`INotificationAsyncHandler<UmbracoApplicationStartedNotification>`, so it runs after every component
has initialised. If the resulting report still carries `DocTypeUnknown` or `PropertyUnknown`
warnings, register a one-shot `ContentTypeSavedNotification` handler that re-checks once the alias
appears. Keep the `ServerRole.Subscriber` guard at `:25` and the `ServerRole.Unknown` allowance
exactly as they are — the comment at `:22-24` explains why they matter. Log the deferral at
Information, not Warning.

**Corrected during implementation, on two points.**

1. The plan had the retry *re-run the import*, with the existing "only into an empty table" guard
   (`:52`) making it idempotent. The guard does make it safe, but it also makes it a **no-op**: the
   first import already created the template, so there is nothing left to import. What actually
   needs re-doing is the **validation**. So the retry re-validates when templates exist, and
   re-runs the import only when the table is empty — the case where the first attempt really did
   fail.
2. Umbraco registers notification handlers at composition time, so a handler cannot literally
   "unregister itself on success". `LegacyImportRetryState` (a singleton, claimed with an
   interlocked exchange because a uSync run raises `ContentTypeSaved` for all 192 items) is what
   makes it behave as one-shot.

`ImportReport` gains `WarningCodes`, because the warning *message* loses the validation code and
the code is what distinguishes a warning that will resolve itself from one that will not. A mixed
report is reported in full rather than deferred — one missing font must not be hidden behind a
document type that fixes itself.

**Verified on a real cold boot**, `umbraco/Data` deleted in between:

```
before   12:24:13  Dynamic Images: imported 1 template(s) ... (1 warning(s))
         12:24:13  Dynamic Images: ... There is no document type with the alias 'article'.
         12:24:25  uSync First boot complete

after    12:27:50  uSync First boot complete
         12:27:51  Dynamic Images: imported 1 template(s) ... (0 warning(s))
```

### 10. Regression tests

Three layers, cheapest first, matching section 6 of the method doc. The existing
shared-fixture pattern — `rotation-fixtures.json` asserted by both `rotation.test.ts` and
`RotationMathTests` — continues wherever a fix has a server twin.

**Layer 1 — vitest, node environment (existing runner, no browser).**

- `di-number-field` clamping, as a new `inputs/number-clamp.test.ts` over a pure exported
  `clampNumber(value, min, max)` that the element calls. Fixtures: opacity `5 → 1`, `-3 → 0`,
  `"" → null`, `"abc" → unchanged`, and rotation `999 → -81` reusing `rotation-fixtures.json`.

  Note from implementation: `"abc" → unchanged` is reachable only against the function. A native
  `<input type="number">` refuses to hold a value it cannot parse and reports `""`, so through the
  element letters read as an emptied field. The browser spec pins that real behaviour; the unit
  test still covers the defensive branch, which matters for any other caller.
- A table-driven test over the exported inspector bounds table from section 6, asserting every
  numeric field declares a min and a max and that min < max. Plus a source scan of
  `di-layer-inspector.element.ts` asserting Rotation is the *only* `<di-number-field>` without
  bounds — so the next field added without any is caught, which is the state A5 found the
  inspector in.
- **A1 as a class of bug, not an instance.** A source-scanning guard test: walk
  `src/DynamicImages/Client/src/**/*.ts`, collect every `di-*` event name passed to
  `new CustomEvent(...)` / `#emit(...)`, collect every `@di-…=` listener binding, and assert the
  first set is a subset of the second. This costs the same as testing the one dead button and
  catches the next one for free. `di-request-preview` is the case that exists today.

**Layer 2 — vitest browser mode, Playwright provider (new).**

Upgrade vitest `2.1.9 → ^3` (vite is already 6) and add `@vitest/browser` and `playwright`. Split
`vite.config.ts`'s `test` block into two projects so the fast node specs stay fast:

```ts
test: { projects: [
  { name: "node",    test: { environment: "node", include: ["src/**/*.test.ts"] } },
  { name: "browser", test: { include: ["src/**/*.browser.test.ts"],
      browser: { enabled: true, provider: "playwright", headless: true,
                 instances: [{ browser: "chromium" }] } } },
]}
```

Note for the implementer: browser specs import real `.element.ts` files, which pull in
`@umbraco-cms/backoffice` for the first time in a test. `rollupOptions.external` is a *build*
setting and does not apply to vitest, so the package resolves for real — this is the main new cost
and the reason to prove the harness on one small element before writing the rest.

| finding | test (`*.browser.test.ts`) |
|---|---|
| B1 | drive the viewport with `page.viewport()` over 1150×666, 1280×800 and 1536×900 — the defect runs through `@media (max-width: 1280px)`, and a container's size does not answer a media query — with the view constrained to the height a workspace actually leaves it (the workspace header and view tabs sit above it; given `100vh` the canvas clears the floor on the *old* CSS too and the spec proves nothing). Assert `di-designer-canvas` height is above a 120px floor at every size. Seen to fail at 40px and 31px pre-fix. |
| B2 | mount `di-layers-panel` with 5 layers in a fixed-height container; assert its height fills the row it was given and that the last row's `bottom` is within the panel |
| B2 | mount it empty; assert the empty-state paragraph is not clipped (`scrollHeight <= clientHeight`) |
| B3 | mount `di-designer-canvas` 1200×630 in a 400px box; assert the emitted `di-scale-change` matches `stage.getBoundingClientRect().width / 1200`, and that the toolbar's readout agrees |
| C5 | given a layout response with one skipped layer, assert a row renders carrying the reason |
| C4 | assert the context calls `view.setTitle` with the template name |
| A5 | assert a typed out-of-range value is clamped **in the input as well as in the model** |

**Layer 3 — Playwright E2E (new), `test/e2e/`.**

Boot notes, all verified against a real booted site: readiness must probe **`/umbraco`, never
`/`** — the Clean.Core 7.x front end 500s by design; `appsettings.Local.json` is loaded only under
`#if DEBUG` (`Program.cs`), so CI must supply `Umbraco__CMS__Unattended__InstallUnattended` and
friends as environment variables; the site is `https://localhost:44344` with a dev cert, so
`ignoreHTTPSErrors: true`; first boot imports ~192 uSync items, so `webServer.timeout` needs
minutes; use auto-waiting assertions, never fixed timeouts, because views take 5–10 seconds to
mount.

**Learned during implementation, and all of it load-bearing:**

- **HTTPS is not optional.** The backoffice's OpenIddict authorize endpoint rejects plain HTTP
  outright (`error_description: This server only accepts HTTPS requests`) *before* rendering a
  login form, so the symptom is a blank page with no inputs — which reads as a mounting problem
  and is not one. `dotnet dev-certs https` plus `ignoreHTTPSErrors` is the whole answer.
- **The section has to be granted to a user group.** Declaring a section in
  `umbraco-package.json` registers it but does not grant it, and a freshly installed site's
  Administrators group lists only the core sections — so the package installed into an invisible
  section. Fixed in the package itself with a `GrantSectionToAdministrators` migration, not in
  test setup, because it is a real first-install defect.
- **Specs live in `src/DynamicImages/Client/e2e/`, not `test/e2e/`.** `@playwright/test` is
  installed in the client's `node_modules`, and Node resolves upward from the spec file: specs at
  the repo root cannot see it. They sit beside the config that drives them.
- `@umbraco/playwright-testhelpers` is installed, but only its conventions are used — its
  fixture stack assumes Umbraco's own suite layout, and everything these specs need is a login
  and shadow-piercing selectors.

**Assert on intercepted request payloads, not image diffs.** Every preview surface goes through
`POST …/dynamic-images/preview` and `POST …/dynamic-images/preview/layout`, and the request body is
`{ template, contentKey, useSampleData, scale }`. Payload assertions pin A1 and A3 exactly and
cannot flake on a font-rendering difference. Reserve visual snapshots for the rendered OG image
itself, where a pixel diff is the point.

| finding | test |
|---|---|
| A4 | type into the template name, click a sidebar item, assert the discard-changes modal appears; cancel and assert the edit survives; confirm and assert navigation completes |
| A4 | assert **no** modal when switching Design ↔ Preview & test with a dirty template |
| A3 | pick a node in Preview & test, switch to Design in-app, assert the strip's `POST preview` body carries that `contentKey` and `useSampleData: false` |
| A3 | reload the page, open Design; assert the restored node still reaches the request |
| A1 | click **Server preview**; assert a `POST preview` fires and the toolbar button disables while it is in flight |
| C1 | click **Add a style**; assert the editor stays open and focus lands in the new row's name field |
| C3 | drag a Yes/No property onto a layer; assert the layer's visibility rule changed and no text layer was created |
| happy path | Regenerate OG image from a document's Actions menu; assert the notification and that the target media picker is populated |

**CI.** New `.github/workflows/ci.yml` on `push` and `pull_request`:

- job `dotnet` — `actions/setup-dotnet@v5` pinned `10.0.x` (matching `release.yml`),
  `dotnet test test/DynamicImages.Tests`. Testing the project directly rather than
  `dotnet build src/DynamicImages.sln` avoids restoring Umbraco, Clean.Core and uSync for the test
  site.
- job `client` — `actions/setup-node` with `cache: npm` and
  `cache-dependency-path: src/DynamicImages/Client/package-lock.json`, then `npm ci`,
  `npm run typecheck`, `npm test`, `npx playwright install --with-deps chromium`,
  `npm run test:browser`, `npm run build`, then **`git diff --exit-code src/DynamicImages/wwwroot`**.
  That last step is the one that matters: the bundle is committed and the release workflow has no
  npm step, so a stale bundle ships silently today.

New `.github/workflows/e2e.yml` on `workflow_dispatch`: boot the Clean test site with the unattended
environment variables, wait on `/umbraco`, run Playwright, upload the report as an artifact.

### 11. Keeping the two review docs accurate

- `ui-review-findings.md` — mark every actioned item **Fixed**, naming the commit or PR.
  **A2 needs rewriting, not annotating**: its Replicate block describes clicking presets that no
  longer exist. Replace it with what the Preview & test view now contains. A3's Replicate block
  gains the cold-load case. B1/B2 record the new floors so a future regression is measurable against
  a number. C8 records the Release-build measurement.
- `ui-review-method.md` — section 6 becomes "how these are tested now", pointing at the real files
  rather than proposing three layers. Add the boot facts the E2E work pins down (the `#if DEBUG`
  trap, the `/umbraco` probe, the env-var route). Section F ("Not covered") loses the items the E2E
  suite now covers.
- `CHANGELOG.md` — Fixed entries per finding; Added for the test harness and CI.
- `CLAUDE.md` — the client command line gains `npm run test:browser`, and a line on where E2E lives
  and how to run it.

### 12. The open uSync gitignore question — answered

The question was whether a gitignore rule can key off `/SocialImages`. **It cannot.** Two independent
reasons: `.gitignore` matches paths and never file contents, and the discriminator lives inside the
XML at `<Media><Info><Path>`; and `uSync/v17/Media/` is flat, named after the media node with no
parent prefix, so a generated image for an article called "24 Days People at Codegarden" collides by
name with an existing starter-kit file and uSync disambiguates with an opaque `_<hash>` suffix
carrying no folder information.

Recommendation, following the precedent already in the root `.gitignore` (line 358 ignores the old
test site's entire `uSync/v9/Media`): add one line —

```gitignore
/src/DynamicImages.TestSite.Clean/uSync/v17/Media/
```

Ignore rules do not affect already-tracked files, so all 37 Clean configs stay tracked and keep
diffing normally; only *new* files are ignored, which is exactly the generated-config case. While
there, delete the duplicated line 360 in the root `.gitignore` (a verbatim repeat of line 359).

---

## Files

**New**

- `src/DynamicImages/Client/src/inputs/number-bounds.ts` — the clamp function and the inspector
  bounds table, exported so tests assert against one source of truth
- `src/DynamicImages/Client/src/inputs/number-clamp.test.ts`
- `src/DynamicImages/Client/src/event-contract.test.ts` — the `di-*` emitter/listener guard
- `src/DynamicImages/Client/src/**/*.browser.test.ts` — one per Layer 2 row above
- `src/DynamicImages/Client/playwright.config.ts`, `src/DynamicImages/Client/e2e/*.spec.ts`
  (beside the config and the dependency, not at `test/e2e/` — see section 10 Layer 3)
- `src/DynamicImages/Migrations/GrantSectionToAdministrators.cs` — the section is registered but
  not granted on a fresh install
- `src/DynamicImages/Core/Rendering/LayerSkip.cs` (or a record on the existing render-result type)
- `.github/workflows/ci.yml`, `.github/workflows/e2e.yml`

**Modified — client**

- `workspace/di-template-workspace.context.ts` — A4 (data manager + guard + `:unique` route), C4
  (view title), and the corrected doc comment
- `workspace/views/di-design-view.element.ts` — B1 grid, A1 handler, B3 scale, C3 condition drop
- `workspace/views/di-preview-strip.element.ts` — A3 content key, A1 `refresh()`, busy event
- `workspace/views/di-preview-view.element.ts` — A2 removal, A3 cold-load fix, C5 rows
- `designer/di-layers-panel.element.ts` — B2
- `designer/di-designer-canvas.element.ts` — B3 event, C3 drop hit-test
- `designer/di-canvas-toolbar.element.ts` — B3 readout and zoom stepping
- `designer/di-layer-inspector.element.ts` — A5 bounds
- `designer/di-property-palette.element.ts` — C3 boolean chip affordance
- `inputs/di-number-field.element.ts` — A5 clamping
- `models/layer-factories.ts` — C3 `PaletteDrop`
- `dashboards/di-fonts-dashboard.element.ts` — C1, C2 weight fields, C6
- `modals/di-font-upload-modal.element.ts` — C6, C7
- `api/types.ts` — C5 skip list, C2 request fields
- `manifests.ts` — C8 (chrome moves out)
- `package.json`, `vite.config.ts`, `tsconfig.json` — the browser test project
- `wwwroot/App_Plugins/DynamicImages/umbraco-package.json` — C8 static chrome
- `wwwroot/App_Plugins/DynamicImages/dynamic-images.js` (+`.map`) — rebuilt, committed

**Modified — server**

- `Core/Services/FontService.cs` — C2 `WeightOf`, C6 message, weight/italic update
- `Core/Rendering/DynamicImageRenderer.cs`, `Core/Rendering/ILayerRenderer.cs` and the five layer
  renderers — C5 skip reasons
- `Api/Models/ApiModels.cs`, `Api/Controllers/PreviewController.cs`, `FontsController.cs` — C5, C2
- `Composing/DynamicImagesStartupComponent.cs`, `Composing/DynamicImagesComposer.cs` — D
- `test/DynamicImages.Tests/DynamicImages.Tests.csproj` — any new shared fixture

**Modified — docs and repo**

- `plans/ui-review-findings.md`, `plans/ui-review-method.md`, `CHANGELOG.md`,
  `src/DynamicImages/README.md`, `CLAUDE.md`, `.gitignore`

**Reused as is**

`History<T>` and the undo/redo stack; `normalise()` and `rotation-fixtures.json`;
`relative-layout.ts`'s `detach`/`referenceOn`; the `UmbEntityWorkspaceDataManager` /
`umbWorkspaceWillNavigateAway` / `UMB_DISCARD_CHANGES_MODAL` trio from the backoffice;
`UmbViewContext.setTitle`; `uui-file-dropzone`; the `NamedWeights` table in `FontService`;
`DiVisibility` and `whenPropertyTruthy`; the `<None Link=… CopyToOutputDirectory>` fixture-sharing
pattern in the test csproj; `release.yml` (untouched).

---

## Implementation order

Each step builds and tests green on its own, so it can ship alone.

1. **Test harness first, empty.** vitest 3 + `@vitest/browser` + playwright; the two-project
   `vite.config.ts`; one throwaway browser spec mounting `di-number-field` to prove
   `@umbraco-cms/backoffice` resolves under vitest. Then `ci.yml`. Nothing else is trustworthy until
   this runs.
2. **A4** — data manager, guard, `:unique` route, corrected comment. Highest user impact.
3. **B1 + B2 + B3** — the single layout change, then the scale event. Write the Layer 2 specs
   alongside; they are the reason step 1 came first.
4. **A5** — `number-bounds.ts`, clamping, the bounds table, Layer 1 tests.
5. **A1 + A3 + A2** — the preview surfaces together: they touch the same two files and A2's removal
   depends on A3 working.
6. **C4** (two lines), then the `di-*` event-contract guard test, which A1 makes pass.
7. **C3** — `PaletteDrop`, the drop hit-test, the palette affordance.
8. **C5** — server skip reasons, the response shape, then the client rows.
9. **C1, C6, C7**, then **C2** (weight detection plus the editable weight).
10. **C8** — manifest split, and measure a Release build.
11. **D** — deferred import and the one-shot retry.
12. **E2E suite** and `e2e.yml`.
13. **Docs**: both review docs, CHANGELOG, README, CLAUDE.md, `.gitignore`. Rebuild the client bundle
    and commit it.

---

## Verification

**Automated**

- `dotnet test test/DynamicImages.Tests` — existing 17 files plus the C5 and C2 additions.
- `cd src/DynamicImages/Client && npm ci && npm run typecheck && npm test && npm run test:browser
  && npm run build`, then `git diff --exit-code src/DynamicImages/wwwroot` — the committed bundle
  must match its source.
- `npx playwright test` against a booted test site.
- The `di-*` event-contract guard must pass; deliberately delete the new `@di-request-preview`
  handler once and confirm it fails. A guard that has never been seen to fail is not a guard.

**Manual, against `src/DynamicImages.TestSite.Clean`** (`dotnet run`, `https://localhost:44344/umbraco`)

1. **A4** — open *Article OG image*, type into the name with real keyboard input, click **Health**.
   The discard-changes modal appears. Cancel → still on the template, edit intact. Repeat and
   confirm → navigation proceeds. Switch Design ↔ Preview & test while dirty → **no** modal. Save,
   then navigate away → no modal.
2. **B1** — a viewport under 1280px wide and ~700px tall (do **not** use `resize_window`; close the
   tab and let `navigate` open a fresh window). Measure with `getBoundingClientRect()`, never from a
   screenshot. `di-designer-canvas` height ≥ 120px, and the centre column scrolls rather than
   crushing.
3. **B2** — at ≥1280px with a 4-layer template, the panel fills its grid row with no grey band
   beneath and no clipped row. On **Create template**, the empty-state sentence is whole.
4. **B3** — a 1200×630 template: the readout matches `stage.width / 1200`. Click **Fit** from a
   manual zoom and watch the number move.
5. **A1/A3** — pick *Community* in Preview & test, switch to Design in-app (`__goto(0)`, never by
   URL — a full page load legitimately resets the context and the test proves nothing). The strip
   shows the real article with its photo. Reload and reopen Design: still the real article. Click
   **Server preview**: it re-renders and the button disables while in flight.
6. **A2** — the preset buttons are gone; the hint points at the picker.
7. **A5** — Opacity `5` → clamps to `1` in both the field and the model. Rotation `999` → `-81`.
   Every numeric field reports a min and max in the `__all(…DI-NUMBER-FIELD…)` survey.
8. **C3** — drag **Is Followable** onto a layer: its visibility rule becomes "when property truthy",
   no text layer appears. Drop on bare stage with nothing selected: the warning explains what to do.
9. **C1** — **Add a style** keeps the editor open with focus in the new name field; delete likewise.
   Restore the dashboard to its original state afterwards — this one writes to the database.
10. **C2** — BricolageDisplay (ExtraBold) reports 800, HankenMeta (SemiBold) 600, HankenBody 400.
    Override a weight in the editor and confirm it persists.
11. **C5** — preview against sample data: the Image row is present, marked not drawn, with a reason.
    Pick *Community*: it draws.
12. **C6/C7** — the modal lists `.woff` and shows a styled dropzone. Upload a `.woff` end to end.
13. **C4** — `document.title` reads `Article OG image | Design | Umbraco`, and `New template | …`
    on the create route.
14. **C8** — cold-load the section on a **Release** build; record how long until the sidebar paints,
    and put the number in the findings doc.
15. **D** — stop the site, delete `src/DynamicImages.TestSite.Clean/umbraco/Data/`, run again
    (never resume a part-way first run). The startup log no longer warns that `article` does not
    exist, and the Design view's palette resolves Node / Content / SEO / Visibility.
