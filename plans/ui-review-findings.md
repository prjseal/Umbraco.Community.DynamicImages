# Dynamic Images — backoffice UI review findings

Review date: 2026-09-20. Reviewed against `src/DynamicImages.TestSite.Clean` (Umbraco 17.7.0,
Clean starter kit content via uSync) running locally, logged in as the unattended admin.

Every item below was found by driving the real backoffice in Chrome. Each one says whether it was
**confirmed in the browser** or **read in the source only**. Line references are to
`src/DynamicImages/Client/src/`.

**Triage is complete.** Each issue carries a **Decision** line: 17 to fix, one discarded. Those
decisions are the scope for the implementation plan — an agent writing that plan should treat them
as settled rather than re-litigating them.

Two are not simply "fix as described", so read their Decision lines in full before planning:
**A2** (remove the presets rather than implement them, leaning on A3 instead) and **C3** (reframed —
booleans stay in the palette; what changes is what dropping one creates).

Every issue carries a **Replicate** block naming the recipe to use from
[`ui-review-method.md`](./ui-review-method.md) and the concrete steps. **Read sections 1–4 of that
document first** — the environment setup, the shadow-DOM helpers (`__txt`, `__find`, `__all`,
`__goto`) that every step below depends on, and the traps that produce false positives. In
particular: `read_page` and `get_page_text` return nothing against the backoffice, views take 5–10
seconds to mount, and the `__txt` walker de-duplicates text, so confirm anything surprising against
raw HTML before believing it.

---

## A. Functional defects

### A1. The "Server preview" toolbar button does nothing
**Confirmed in the browser.** Severity: medium (dead control in the primary toolbar).

The Design toolbar's **Server preview** button emits a `di-request-preview` event that nothing
listens for. I attached a window-level listener, clicked the button, and saw the event fire and
bubble all the way to `window` with no handler anywhere in between; the preview strip did not
expand, refresh, or re-render.

- Emitted at `designer/di-canvas-toolbar.element.ts:69`.
- `grep -rn "di-request-preview"` over the whole client returns exactly that one line — the
  emitter, and no listener. `di-design-view.element.ts` handles ~20 other `di-*` events but not
  this one.

The button's `previewing` property is likewise never set by any parent, so it can never show a
busy state.

**Replicate** — recipe *"Dead control"*.
1. `grep -rn "di-request-preview" src/DynamicImages/Client/src` — one hit means emitter only.
2. Open the Design view. In call 1 register the counter and click:
   ```js
   window.__fired = 0;
   window.addEventListener('di-request-preview', () => { window.__fired++; }, true);
   const tb = __find('di-canvas-toolbar');
   [...tb.shadowRoot.querySelectorAll('uui-button')]
     .find(b => (b.textContent || '').includes('Server preview')).click();
   'ok'
   ```
3. In call 2 (separate — promises do not resolve through `javascript_tool`) read the result:
   ```js
   JSON.stringify({ firedAtWindow: window.__fired,
     stripExpanded: __find('di-preview-strip').shadowRoot
       .querySelector('button.toggle').getAttribute('aria-expanded') })
   ```
   The event reaching `window` while the strip's state is unchanged is the proof.

**Decision: fix.** Either wire the button up to trigger a render or remove it; a dead control in
the primary toolbar is not acceptable either way.

---

### A2. The title-length presets in "Preview & test" do nothing
**Confirmed in the browser.** Severity: medium (three controls that silently lie).

"Try a title length: **Short** / **Typical** / **Very long**" re-renders the preview but never
changes the title. I clicked **Very long**, then **Short**, and read the Resolved values table
each time: the Title layer stayed at `Designing social share images that actually get clicked`,
same value, same position `64, 210`, both times.

Cause: the handler calls `#render(title)` at `workspace/views/di-preview-view.element.ts:145`, but
the method signature is `async #render(_sampleTitle?: string)` (`:148`) and the argument is never
used. All three buttons produce an identical image from the server's own sample data.

**Replicate** — recipe *"No-op button"*.
1. Open **Preview & test** and wait for the first render to finish.
2. Click a preset, wait ~7 seconds, then dump the table. Repeat for a different preset:
   ```js
   (() => { const v = __find('di-preview-view');
     [...v.shadowRoot.querySelectorAll('uui-button')]
       .find(x => (x.textContent || '').trim() === 'Very long').click(); return 'clicked'; })()
   ```
   ```js
   (() => { const v = __find('di-preview-view'); const h = v.shadowRoot.innerHTML;
     const i = h.indexOf('Resolved values');
     return h.slice(i, i + 1100).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); })()
   ```
3. Compare the Title **value and position** across **Short** and **Very long**. Identical output
   (`Designing social share images that actually get clicked` at `64, 210`) is the finding. Read the
   table from raw HTML as shown, not via `__txt`, which would collapse repeated numbers.

**Decision: replace, do not wire up.** Remove the three preset buttons. Previewing against a real
content item is the supported path instead — see A3, which makes the chosen node apply to the
designer's own preview. Revisit synthetic sample overrides only if choosing a node proves
insufficient in practice.

---

### A3. The preview strip ignores the content node you picked
**Confirmed in the browser.** Severity: medium (the designer's live preview can't show you a real node).

I chose the **Community** node in **Preview & test** (the picker button then read "Community", and
that view rendered the real article — title "Community" with its photo), then switched in-app to
**Design** without reloading. The Server preview strip under the canvas still showed the sample
data: "Designing social share images that actually get clicked", no photo.

`workspace/views/di-preview-strip.element.ts:83` reads:

```ts
const contentKey = this.#context.getData() ? undefined : undefined;
```

Both branches are `undefined`, and `useSampleData: true` is hard-coded on the next line (`:86`).
The strip does observe `sampleContentKey`, but only to retrigger a render it then performs with
sample data regardless. So picking a node in **Preview & test** never affects the strip under the
canvas.

**Replicate** — recipe *"No-op button"*, with one critical constraint.

**Do not navigate between the two views by URL.** A full page load leaves the context's
`sampleContentKey` unset (only `localStorage` remembers the choice, and only the Preview & test view
restores it), so the strip would be showing sample data legitimately and the test proves nothing.
This tripped me up first time round. Switch views **in-app** with `__goto`.

1. Open **Preview & test**, click the picker button (labelled "Sample data") and choose a node with
   a distinctive title and a `mainImage` — *Community* works.
2. Confirm the selection took, so the next step is meaningful:
   ```js
   (() => { const v = __find('di-preview-view');
     const b = [...v.shadowRoot.querySelectorAll('uui-button')]
       .find(x => (x.getAttribute('label') || '').includes('Choose content'));
     return 'picker label: ' + b.textContent.replace(/\s+/g, ' ').trim(); })()
   ```
   It should read the node name, and the view should render that article.
3. `__goto(0)` to switch to Design in-app, wait ~10 seconds, screenshot the strip. Showing the
   sample title and no photo is the finding.

**Decision: fix.** Pass the chosen node's key through to the strip. Given the A2 decision this
becomes the primary way to preview against real content, so it carries more weight than its
medium severity suggests.

---

### A4. Unsaved changes are discarded silently when you navigate away
**Confirmed in the browser.** Severity: high (straightforward data loss).

I opened **Article OG image**, clicked into the template name field and typed ` TEST` (a real
keyboard edit — the field showed `Article OG image TEST`), then clicked **Health** in the sidebar.
The app navigated away immediately: no confirmation dialog, no notification, and the edit was
gone when I reopened the template.

This contradicts the workspace context's own documented intent at
`workspace/di-template-workspace.context.ts:21-23`:

> Extending Umbraco's submittable workspace base is what buys Save, dirty tracking and the
> unsaved-changes prompt for free rather than reimplementing them.

**Likely cause (not verified):** the context extends `UmbSubmittableWorkspaceContextBase` but keeps
all template state in its own `#template = new UmbObjectState(...)` (`:26-27`) instead of the base
class's data state, so the base's dirty check never sees a change and the route guard never fires.

**Replicate** — recipe *"Unsaved-changes guard"*.

**Use real keyboard input.** A synthetic `input`/`change` event may never register as a change, in
which case a missing prompt proves nothing — I made exactly that mistake and had to redo the test.

1. Open the template. Get the name field's coordinates, then click and type with the `computer`
   tool (`left_click`, then `type`):
   ```js
   (() => { const inp = __find('di-template-editor').shadowRoot.querySelector('uui-input');
     const r = inp.getBoundingClientRect();
     return JSON.stringify({ x: Math.round(r.left + r.width / 2),
                             y: Math.round(r.top + r.height / 2), val: inp.value }); })()
   ```
2. Re-read `inp.value` and confirm it shows the edit before continuing.
3. Click a sidebar menu item (Health) and assert nothing intervened:
   ```js
   JSON.stringify({ path: location.pathname, modalOpen: !!__find('umb-confirm-modal') })
   ```
4. Reopen the template and confirm the edit is gone.

**Decision: fix.** Highest priority of the whole set.

---

### A5. Opacity accepts out-of-range values; most number fields have no bounds at all
**Confirmed in the browser.** Severity: medium.

With a text layer selected I set **Opacity** to `5`. The field has `min=0` / `max=1`, but the typed
value was accepted verbatim: the field showed `5` and the layer model became `opacity: 5`, with no
clamping and no inline error. (The server-side validator would flag it as `OpacityInvalid`, but
only on save.)

`inputs/di-number-field.element.ts:47-48` passes `min`/`max` to the native input — which only
constrains the steppers — while `#onChange` (`:29-33`) dispatches whatever was typed without
clamping.

By contrast, **Rotation** *does* normalise correctly: I typed `999` and it became `-81`. So the
behaviour is inconsistent between fields.

Also worth noting: of the fields on a text layer, only Opacity declares `min`/`max` at all. Size,
X, Y, Width, Height, Line spacing, Letter spacing and Max lines have no bounds, so negative or
absurd values are accepted.

**Replicate** — recipe *"Input validation"*.
1. In the Design view select a text layer (click a row in the Layers panel). Survey the fields and
   their declared bounds:
   ```js
   JSON.stringify(__all(n => n.tagName === 'DI-NUMBER-FIELD')
     .map(f => ({ l: f.getAttribute('label'), v: f.value, min: f.min, max: f.max, step: f.step })))
   ```
   Only Opacity reports `min`/`max`.
2. Push a value past the bound, then read the model back in a **second** call:
   ```js
   (() => { const f = __all(n => n.tagName === 'DI-NUMBER-FIELD')
       .find(x => x.getAttribute('label') === 'Opacity');
     const inp = f.shadowRoot.querySelector('input');
     inp.value = '5';
     inp.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
     return 'set'; })()
   ```
   ```js
   (() => { const l = __find('di-layer-inspector').layer;
     return JSON.stringify({ opacity: l.opacity, rotation: l.rotation }); })()
   ```
3. Repeat with Rotation `999`; it normalises to `-81`. The contrast between the two is the point.
4. **Restore:** click the toolbar Undo twice and confirm `opacity: 1, rotation: 0`. Do not save.

**Decision: fix.** Clamp typed values in `di-number-field`, and give the other numeric fields
sensible bounds.

---

## B. Layout defects

### B1. The designer canvas collapses to zero height on narrower/shorter windows
**Confirmed in the browser (measured).** Severity: high — the designer becomes unusable.

At a **1150×666** viewport, `di-designer-canvas` measured **650×0**. The canvas was completely
absent: palette, toolbar, preview strip, inspector and layers panel were all visible, but there
was no stage at all and no scrollbar to reveal one. Collapsing the preview strip freed 126px and
the canvas still only reached **17px**.

The arithmetic, measured live: the `.centre` column was 141px tall, while its three rows wanted
toolbar 91px + canvas + preview strip 160px.

Cause — `workspace/views/di-design-view.element.ts`:
- `.centre` is `grid-template-rows: auto 1fr auto` (`:477-479`), so the canvas is the only
  flexible row and absorbs every shortfall. It has no `min-height`.
- At `@media (max-width: 1280px)` (`:492`) the inspector + layers `.side` block moves below the
  canvas and takes up to `max-height: 45vh` (`:501`).
- The toolbar (91px) and the preview strip (160px, even when collapsed it keeps a 34px header) are
  effectively fixed.

At ≥1280px wide the three-column layout returns and the canvas is fine (measured 239px tall at a
1536×674 viewport, and it would be ~465px on a 1080p screen). So this bites laptop-width windows
and anyone with a short browser window.

**Replicate** — recipe *"Layout collapse"*.

You need a viewport **under 1280px wide and roughly 700px or less tall**. **Do not use
`resize_window`** — each call shrank my usable viewport further (1150 → 806 → 524px). Close the tab
and let `navigate` open a fresh window, or size the browser by hand.

1. Record what you actually have, so the numbers mean something:
   ```js
   JSON.stringify({ iw: innerWidth, ih: innerHeight, dpr: devicePixelRatio })
   ```
2. Open the Design view, wait for it to mount, then measure:
   ```js
   (() => { const names = ['di-design-view','di-property-palette','di-designer-canvas',
     'di-canvas-toolbar','di-preview-strip','di-layer-inspector','di-layers-panel'];
     return JSON.stringify(names.map(n => { const e = __find(n); if (!e) return [n, 'MISSING'];
       const r = e.getBoundingClientRect();
       return [n, Math.round(r.width) + 'x' + Math.round(r.height)]; })); })()
   ```
   `di-designer-canvas` at height `0` is the finding.
3. Optionally collapse the preview strip (`strip.shadowRoot.querySelector('button.toggle').click()`)
   and re-measure — it only recovers to ~17px, which shows collapsing it is not a workaround.
4. Never measure this from a screenshot; the capture scale varies between calls.

**Decision: fix.**

---

### B2. The Layers panel is capped at 40% of its own space and clips its list
**Confirmed in the browser (measured).** Severity: medium.

In the three-column layout the grid allocated the layers panel a **228.8px** row, but the panel
rendered only **92px** tall, leaving **137px of empty grey directly beneath it** while the list
itself was cut off mid-row — with 4 layers plus the Background row, only about two rows were
visible.

Cause: `designer/di-layers-panel.element.ts:153` sets `:host { max-height: 40%; overflow: auto; }`.
The percentage resolves against the grid row the panel was already given, so it can never use more
than 40% of its own allotment — 60% of that row is guaranteed to be wasted.

Same defect on a new template: the empty-state text "No layers yet. Drag a property from the left
onto the canvas." is clipped mid-sentence.

**Replicate** — recipe *"Layout collapse"*, comparing the panel against the row it was given.

1. Use a viewport **wider than 1280px** so the three-column layout is active, and open a template
   with four or more layers.
2. ```js
   (() => { const lp = __find('di-layers-panel'); const side = lp.parentElement;
     const r = n => { const b = n.getBoundingClientRect();
       return n.tagName.toLowerCase() + ' ' + Math.round(b.width) + 'x' + Math.round(b.height)
              + ' top=' + Math.round(b.top) + ' bot=' + Math.round(b.bottom); };
     return JSON.stringify({ side: r(side),
       sideRows: getComputedStyle(side).gridTemplateRows,
       kids: [...side.children].map(r) }); })()
   ```
   The finding is the panel's height being ~40% of its grid row (92px of 228.8px), with the gap
   between the panel's `bot` and the side column's `bot` left empty.
3. Confirm the cause in source: `designer/di-layers-panel.element.ts:153`.
4. For the clipped empty state, open **Create template** and look at the Layers panel.

**Decision: fix.** Address together with B1 as a single layout change rather than two patches.

---

### B3. The zoom readout shows 100% when the canvas is scaled to fit
**Confirmed in the browser (measured).** Severity: low–medium (misleading).

The toolbar read **100%** while the stage measured **326×171** for a 1200×630 canvas — an actual
scale of roughly **27%**. The stage is sized down to fit rather than transformed, so the readout
never reflects the effective fit scale. A user reading "100%" has no way to know what they're
looking at, and "Fit" appears to do nothing because the number doesn't move.

**Replicate** — recipe *"Layout collapse"*, comparing the stage against the readout.

1. Open the Design view on a 1200×630 template, wide enough that the canvas is visible.
2. ```js
   (() => { const c = __find('di-designer-canvas');
     const stage = c.shadowRoot.querySelector('.stage') || c.shadowRoot.querySelector('[class*=stage]');
     const tb = __find('di-canvas-toolbar');
     const r = stage.getBoundingClientRect();
     return JSON.stringify({
       zoomLabel: (tb.shadowRoot.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
       stage: [Math.round(r.width), Math.round(r.height)],
       transform: getComputedStyle(stage).transform }); })()
   ```
   A stage of `326x171` for a 1200-wide canvas against a `100%` label — with `transform: none`,
   confirming it is sized rather than scaled — is the finding.
3. Click **Fit** and re-run; the readout should change and does not.

**Decision: fix.**

---

## C. UX and polish

### C1. "Add a style" saves a placeholder and closes the editor
**Confirmed in the browser.** Severity: medium.

In **Fonts → Named styles**, clicking **Add a style** immediately persists a row called
`New style · 32px · Regular` *and closes the editor*, so you have to reopen it to give the style a
name. Deleting a row does the same — saves and closes. Both showed a `'BricolageDisplay' saved`
notification.

On the positive side, an unsaved edit in the name field was carried into that immediate save
rather than lost, so this is an annoyance rather than data loss.

**Replicate** — real clicks and typing; this one **writes to the database**, so restore afterwards.
1. Open the **Fonts** dashboard and click **Named styles** on a font that has one.
2. Optionally type a new name into the style's Name field first (real typing) to check whether the
   pending edit survives.
3. Click **Add a style**. Observe: a `'<family>' saved` notification, a new
   `New style · 32px · Regular` chip, and the editor **closed** (its button reverts from "Close" to
   "Named styles").
4. Reopen and delete the added row — deleting also saves and closes.
5. List the chips at any point to check state:
   ```js
   (() => { const v = __find('di-fonts-dashboard');
     const h = v.shadowRoot.innerHTML.replace(/<!--[^>]*-->/g, '');
     return (h.match(/>\s*[A-Za-z ]+ · \d+px · \w+\s*</g) || []).join('\n'); })()
   ```
6. **Restore:** delete the placeholder row and rename the original style back, then **Save**. Leave
   the dashboard reading exactly as it did before.

**Decision: fix.** Keep the editor open after adding or deleting a row so the new style can be
filled in place.

---

### C2. Registered fonts always report "weight 400"
**Confirmed in the browser.** Severity: medium (actively misleading).

All three fonts on the test site report weight 400 regardless of the file behind them:

| Family | File | Reported |
|---|---|---|
| BricolageDisplay | `BricolageGrotesque-ExtraBold.woff2` | weight 400 |
| HankenBody | `HankenGrotesk-Regular.woff2` | weight 400 |
| HankenMeta | `HankenGrotesk-SemiBold.woff2` | weight 400 |

The live specimens render correctly (Bricolage is visibly extra-bold), so only the metadata is
wrong. Registering a path doesn't read the weight out of the font file.

Related: named styles can only be Regular / Bold / Italic / BoldItalic, so an ExtraBold or SemiBold
face is always labelled "Regular" — see the chips `Title · 58px · Regular` on an ExtraBold family.

**Replicate** — raw-HTML read of the Fonts dashboard (not `__txt`, which would collapse the three
identical "weight 400" strings into one and hide the pattern).
```js
(() => { const v = __find('di-fonts-dashboard');
  const h = v.shadowRoot.innerHTML.replace(/<!--[^>]*-->/g, '');
  return h.replace(/<[^>]+>/g, '|').replace(/\|+/g, '|').replace(/\s+/g, ' ').slice(0, 2000); })()
```
Each row prints `<path> · weight 400 · used by N template(s)`. Compare the weight against the
filename: `…-ExtraBold.woff2` and `…-SemiBold.woff2` both report 400. A screenshot is worth taking
too — it shows the specimens rendering at the correct weight, which proves only the metadata is wrong.

**Decision: fix.**

---

### C3. The palette offers properties that make no sense on an image
**Confirmed in the browser.** Severity: low.

The palette lists every property on the document type, including booleans: **Is Followable**,
**Is Indexable**, **Hide From Search**, **Hide From Top Navigation**, **Hide From XML Sitemap**.
Dropping one creates a text layer that will draw `True` / `False` onto the OG image. Per
`models/layer-factories.ts:147-157` anything that isn't media or a list becomes a text layer.

**Replicate** — `__txt` dump of the palette (de-duplication is harmless here; every entry is a
distinct property name).
```js
__txt(__find('di-property-palette'))
```
Returns more than the tool will print in one go, so take it in slices:
`__txt(__find('di-property-palette')).split('\n').slice(28).join('\n')`. Look for the boolean
properties under **SEO** and **Visibility**. To see what a drop produces, click the `+` on one and
inspect the created layer's `type`.

**Decision: fix, reframed.** Booleans stay listed and draggable — they are wanted for conditional
display, and the layer visibility rule already has a "Controlled by" property picker pointed at
exactly this kind of property. What changes is what dropping one *produces*: offer it as a layer
visibility condition rather than defaulting to a text layer that draws `True` / `False`. Treat this
as input to the conditional-display work rather than as palette filtering.

---

### C4. The workspace browser-tab title has an empty name segment
**Confirmed in the browser.** Severity: low.

The document title reads `| Design | Umbraco` — with a leading empty segment — instead of
`Article OG image | Design | Umbraco`. Same on the create route, where the name is "New template".
Every other Umbraco workspace puts the entity name there (e.g. `Community | Content | SEO | Umbraco`).

Cause: `workspace/di-template-workspace.context.ts` exposes no `name` observable for Umbraco's
title service; the name lives only in the header `uui-input` in
`workspace/di-template-editor.element.ts:45-52`.

**Replicate** — one line, once a workspace view has mounted:
```js
document.title
```
Returns `| Design | Umbraco`. Check the create route too, and compare against any core workspace
(open a content node: `Community | Content | SEO | Umbraco`). Confirm the cause with
`grep -n "name\b" src/DynamicImages/Client/src/workspace/di-template-workspace.context.ts` — no
`name` observable is exposed.

**Decision: fix.**

---

### C5. "Resolved values" silently omits layers that didn't draw
**Confirmed in the browser.** Severity: low.

While the site was missing its media files, the template's 4 layers produced only 3 rows (Title,
Subtitle, ArticleDate). The `mainImage` layer simply wasn't there — no row, no "not drawn" note,
no reason given, so there was nothing in the UI to explain why the image was absent from the render.

Once the media files were restored the Image row appeared correctly (`Image | — | 760, 95 |
380 × 440`), which confirms the row is dropped precisely when a layer resolves to nothing — exactly
the case where an editor most needs to be told why. A row with an explanation would make this panel
far more useful for debugging.

**Replicate** — raw-HTML read of the Resolved values table, before and after giving the layer a value.
1. Open **Preview & test**, wait for the render, and dump the table:
   ```js
   (() => { const v = __find('di-preview-view');
     const h = v.shadowRoot.innerHTML.replace(/<!--[^>]*-->/g, '');
     const i = h.indexOf('Resolved values');
     return h.slice(i, i + 2400).replace(/<[^>]+>/g, '|').replace(/\|+/g, '|').replace(/\s+/g, ' '); })()
   ```
2. Against **sample data** the Image layer is absent — 3 rows for a 4-layer template. Count the rows
   against the template's layer count rather than assuming.
3. Pick a node that has a `mainImage` (*Community*) and re-dump: the Image row now appears as
   `Image | — | 760, 95 | 380 × 440`. The difference between the two dumps is the finding.

**Decision: fix.** Render a row for every layer, with a reason when it did not draw.

---

### C6. Font upload help text doesn't match what's accepted
**Confirmed in the browser.** Severity: trivial.

The modal says "**.ttf, .otf or .woff2**" but the file input's `accept` attribute is
`.ttf,.otf,.woff2,.woff` — `.woff` is accepted and works but is never mentioned. The Fonts
dashboard empty state repeats the same three-format wording.

**Replicate** — open **Fonts → Add a font**, then compare the attribute against the help text:
```js
(() => { const m = __find('di-font-upload-modal');
  const f = m.shadowRoot.querySelector('input[type=file]');
  return JSON.stringify({
    buttons: [...m.shadowRoot.querySelectorAll('uui-button')]
      .map(b => (b.getAttribute('label') || b.textContent || '').replace(/\s+/g, ' ').trim()),
    accept: f.getAttribute('accept'), multiple: f.hasAttribute('multiple') }); })()
```
Cross-check the server's allow-list in `Core/Services/FontService.cs`. Close with **Cancel** —
the button sits below the fold, which is why the call above lists the buttons.

**Decision: fix.**

---

### C7. The font upload control is a raw browser file input
**Confirmed in the browser.** Severity: low (visual consistency).

"Add a font → Upload a file" renders the native `Choose files | No file chosen` control, which
looks out of place next to the uui-styled inputs and buttons in the same dialog.

**Replicate** — visual. Open **Fonts → Add a font** and screenshot the dialog; the native control
sits in the first box, above the uui-styled path input and provider select. The same
`input[type=file]` query as C6 confirms it is a raw input rather than a wrapped component.

**Decision: fix.**

---

### C8. Entering the section shows a blank screen for several seconds
**Confirmed in the browser.** Severity: low, and partly environmental.

A cold load of `/umbraco/section/dynamic-images/dashboard/overview` showed an entirely empty
section — no sidebar menu items, no dashboard, no spinner — for roughly 5–10 seconds before
everything appeared at once. Switching workspace views took a similar few seconds with no
indication anything was happening. This was a local dev build, so some of it is dev-mode cost, but
there is no loading affordance at all.

**Replicate** — `navigate` to `/umbraco/section/dynamic-images/dashboard/overview` as a full page
load, then screenshot immediately, at ~5s and at ~10s. The early captures show an empty section with
no spinner. Note the window title lags too — it read `Dynamic Images | Health | Umbraco` while the
URL was `/dashboard/overview`.

Beware the inverse mistake: this same slowness makes an element check run too early report "not
mounted", which looks like a routing bug and is not one. Always wait and re-check before concluding
a view failed to load.

**Decision: fix.** Add a loading affordance, and check separately whether the delay itself is
avoidable on a release build.

---

### C9. The Overview reports "0 Issues" while showing a warning banner
**Confirmed in the browser.** Severity: trivial / arguable.

The Overview shows the amber banner "There is still a v1 configuration block in appsettings."
directly above a stat tile reading **0 Issues**, and Health also reports 0 errors / 0 warnings. The
banner is informational rather than a validation issue, so this may be working as intended — but
the two read as contradictory.

**Replicate** — needs a site whose `appsettings.Development.json` still carries the v1
`DynamicImages` block *and* has templates in the database, which is the state the Clean test site
boots into.
```js
__txt(__find('di-overview-dashboard'))
```
The banner text and the `0 / Issues` tile appear in the same dump. Cross-check the Health dashboard,
but read that one from raw HTML — `__txt` collapses `0 error(s), 0 warning(s)` into
`0 error(s), warning(s)` and makes it look like a missing value.

**Decision: discard.** Working as intended. The banner is informational rather than a validation
issue and should not inflate the Issues count. Recorded here so it is not re-raised.

---

## D. Install-order observation (not strictly UI)

On the very first boot against an empty database, the v1 auto-import ran **before** uSync had
created the document types, and the log recorded:

```
Dynamic Images: imported 1 template(s) from the v1 configuration (0 skipped, 1 warning(s))
Dynamic Images: Article OG image: There is no document type with the alias 'article'.
```

It resolved itself — by the time I opened the designer the `article` binding was intact and the
palette listed all its properties — but a first-run warning that the target document type doesn't
exist is alarming, and it would be a real failure if the binding didn't recover.

**Replicate** — this is **only visible on a cold first boot**; a running or resumed site will never
show it.
1. Stop the site, `rm -rf src/DynamicImages.TestSite.Clean/umbraco/Data/`, and run again. Do not
   resume a part-way first run — that leaves a half-initialised database and different symptoms.
2. Watch the startup log for the two lines above, and note their order relative to
   `Starting 'uSync_FirstBoot'` / `uSync Import: … processed 192 items`. The import warning fires
   *before* uSync creates the document types.
3. Then open the Design view and dump the palette (as in C3) to confirm the binding recovered —
   Node / Content / SEO / Visibility groups all resolving means it did.

**Decision: fix.**

---

## E. Verified working

Worth recording so we don't re-test these:

- **Overview** — stats, the v1 import banner, and per-template Design / Duplicate / Export / Delete.
- **Settings view** — document type bound to `article`, target property `socialImage`, format PNG
  with the Quality field correctly hidden, alias `articleOgImage`, read-only Template JSON.
- **Usage view** — "7 of 7 have an image", per-node state list, the without-an-image filter.
- **Health dashboard** — 0 errors / 0 warnings, "Everything checks out", environment transfer
  showing "Mode: off · 0 file(s)".
- **Fonts dashboard** — live specimens render in the genuine typefaces via the FontFace API (three
  `di-{guid}` families loaded).
- **Undo / redo** — undid two inspector changes cleanly and restored the exact prior values.
- **Preview strip and Preview & test** — both render real server images; the Resolved values table
  reports values, positions and sizes.
- **Palette** — resolves Node / Content / SEO / Visibility groups plus the Static chips.
- **Create template flow** — new 1200×630 canvas with the correct "Pick one or more document types
  in Settings" hint.
- **Modal validation** — Register and Add web font are correctly disabled until their inputs are
  valid; the modal has a Cancel action.
- **Content integration** — **Regenerate OG image** in a document's Actions menu worked end to end:
  "The image has been regenerated" notification, and the SEO tab's Social Share Image showed the
  correctly branded, correctly titled image.

---

## F. Not covered by this review

Flagging these so we know what's untested rather than assumed fine:

- **Canvas gestures** — dragging, the 8 resize handles, the rotation handle, Shift/Alt modifiers,
  snapping and guides. The browser window available to me was too small to use the canvas (see B1).
- **Drag and drop from the palette**, and the keyboard shortcuts (undo/redo, duplicate, delete,
  nudge, z-order).
- **Shape layers** — the ellipse / polygon / star inspector controls, sides, inner ratio, gradients.
- **Badges layers.**
- **Adding a web font** (Google / Bunny / direct URL), uploading a font file, and refreshing one.
- **Import / export JSON**, and the Health dashboard's export-to-disk / import-from-disk.
- **Regenerate all** (the bulk job) and job progress.

---

## G. Test-site media, now fixed

The Clean test site originally had 40 uSync media items but only 7 media folders on disk, so the
starter kit's image binaries were missing: Main Image thumbnails were broken in the Content section
and generated OG images had an empty photo card. That was missing test data, **not** a Dynamic
Images defect.

The 34 referenced files have since been copied in from
`D:\Code\GitHub\Clean\template\Clean.Blog\wwwroot\media` and force-added to git (33 MB, mostly
~2 MB Codegarden JPEGs) so the test site is self-contained. `/wwwroot/media/` stays gitignored, so
the 7 Dynamic Images-generated OG images remain untracked — they are build output and would churn
on every regenerate.

With the media in place these now verify as **working**:

- **Image layers draw real media.** Previewing against the Community node rendered the article's
  `mainImage` as the rounded photo card, and all four layers resolved
  (`Image | — | 760, 95 | 380 × 440`).
- **The sample-node picker** lists the published articles, remembers the choice per template in
  `localStorage`, and re-renders **Preview & test** against the chosen node.
