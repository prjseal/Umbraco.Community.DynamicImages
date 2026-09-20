# Canvas zoom controls and scrollbar flicker

## Context

Manual testing of the designer in the backoffice turned up two defects:

1. **The zoom controls appear to have no "−" button** — just a percentage and a "+".
2. **The x and y scrollbars flicker** (appear and disappear) while interacting with the canvas.

Both were checked against `main` as of the `ui-review-fixes` merge (#10). **Neither is fixed.** Bug 2 was
in fact introduced by the B1/B3 work in `8c71db4`, which gave `.centre` a scrollbar and left the canvas
measuring its own scroll box.

### Decisions already made with the user

- **The percentage becomes a typeable input.** It is a read-only `<span>` today; the user described it as
  an input and has asked for it to be one — type a percentage, commit on change, clamped to the existing
  10%–400% range.
- **The second broken icon is in scope.** Auditing icon names turned up `icon-eye-off` in the layers panel,
  which does not exist in Umbraco 17's registry and so renders blank. Fix it, and add a guard test that
  asserts every `icon-*` name used in `src/` exists in the registry, so no unverified name ships again.

### Facts verified against the source and against `@umbraco-cms/backoffice@17.0.0` while planning

- `designer/di-canvas-toolbar.element.ts:47-53` **does** render a zoom-out button. Its only visible content
  is `<uui-icon name="icon-remove">`, and in Umbraco 17 `icon-remove` is **`lucide-trash-2` — a wastebasket**:

  ```js
  // .../icon-registry/icons/icon-remove.js
  export default `<svg ... class="lucide lucide-trash-2" ...><path d="M10 11v6M14 11v6M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
  ```

  So the control reads `[bin] 27% [+] [Fit]`. There is no minus on screen, which is exactly the report.
- The registry has a correct matched pair: **`icon-zoom-out`** (`lucide-zoom-out`, magnifier with a minus)
  and **`icon-zoom-in`** (`lucide-zoom-in`). Both are registered.
- 31 distinct `icon-*` names are used across `src/`. 29 resolve. The two that do not are `icon-remove`
  (resolves, but to the wrong picture) and **`icon-eye-off`** (`designer/di-layers-panel.element.ts:108`),
  which is **not in the registry at all** — the registry has no eye-with-a-slash under any name.
- The committed bundle in `wwwroot/App_Plugins/DynamicImages/dynamic-images.js` is in sync with source
  (one `icon-remove`, three `icon-add`), so a stale bundle is not why the minus is missing.
- The 0.1–4 zoom clamp already exists twice: `views/di-design-view.element.ts:461` and the **dead**
  `workspace/di-template-workspace.context.ts:459` `setZoom()` (nothing calls it, nothing subscribes to
  its observable).

### Why the scrollbars flicker

In `designer/di-designer-canvas.element.ts`:

- `:host { height: 100%; overflow: hidden }`, and inside it
  `.viewport { width:100%; height:100%; overflow:auto; padding:24px; box-sizing:border-box }` (`:660-726`).
- The stage is **sized in px, not transformed**: `.artboard` gets
  `width: ${canvas.width * scale + gutter}px` inline at render (`:591-597`).
- `#recomputeFit()` (`:143-164`) measures **`viewport.clientWidth/clientHeight`** — the *scrolling* box —
  subtracts `padding = 48 + (showRulers ? RULER_THICKNESS : 0)`, and writes `@state _fitScale`.
- `updated()` (`:124`) calls `#recomputeFit()` on **every** render, and a `ResizeObserver` watches the host.

Two things combine:

- **The measurement is taken through the thing it controls.** `clientWidth`/`clientHeight` exclude the
  scrollbar, so the moment the artboard overflows, the measured space shrinks ~15px, the fit shrinks, the
  artboard shrinks, the overflow clears, the measured space grows back, and the fit grows again. The
  `Math.abs(fit - this._fitScale) > 0.001` guard is the only damping, and a 15px delta on a 1200px canvas
  is ~0.0125 — an order of magnitude over it.
- **At fit, the artboard is sized to *exactly* the content box.** `available = clientH - 48 - gutter`,
  `artboard height = canvasH * fit + gutter = clientH - 48`, and the padding is 24 + 24 = 48. Dead level
  with the overflow threshold, so sub-pixel layout rounding (Chromium lays out in 1/64px) decides which
  side of it you land on. A vertical scrollbar steals width, which tips the horizontal axis over, which
  steals height — both axes, as reported.

Interaction is what shakes it loose: `#onLayerBoxResize` (`:555-558`) calls `requestUpdate()` whenever an
auto-height layer reflows, and `#fallbackWidth`/`#fallbackHeight` (`:249-257`) divide measured
`offsetWidth`/`offsetHeight` by `this.scale`, so a scale change feeds back into layer measurement.

**Intended outcome:** a visible, correct minus control with a typeable percentage; a canvas whose fit scale
is stable and whose scrollbars appear only when the user has genuinely zoomed past the available space;
and tests that fail on today's code and pass after the fix.

---

## Design

### 1. Fit is measured against the space the canvas was *given*

The canvas must measure the **host**, which is `overflow: hidden` and therefore cannot change size because
of its own content. That breaks the feedback loop by construction, and the existing `ResizeObserver`
already observes `this`. Then give the result a couple of px of headroom, so the artboard sits *inside* the
content box rather than level with its edge.

In `designer/di-designer-canvas.element.ts`:

```ts
/**
 * The artboard used to be sized to exactly the viewport's content box, and the fit was measured from
 * `.viewport` - the scrolling box, whose clientWidth excludes the scrollbar the artboard had just
 * caused. Overflow shrank the measurement, which shrank the artboard, which cleared the overflow,
 * which grew the measurement back: both scrollbars flickered on every interaction. The host is
 * `overflow: hidden`, so its client size cannot move in response to the artboard, and the headroom
 * keeps the artboard off the overflow threshold instead of dead level with it.
 */
const FIT_HEADROOM = 2;

#recomputeFit() {
  if (!this.template) return;

  const padding = 48 + (this.showRulers ? RULER_THICKNESS : 0) + FIT_HEADROOM;
  const available = {
    width: Math.max(1, this.clientWidth - padding),
    height: Math.max(1, this.clientHeight - padding),
  };
  // ... fit / epsilon / announce unchanged
}
```

`.viewport` is `width:100%; height:100%` in a `display:block` host with no border or padding, so its border
box *is* the host's content box — the only difference between the two measurements is the scrollbar, which
is precisely the term we want gone. The `.viewport` lookup and its `if (!viewport)` guard go with it; keep
the `!this.template` guard.

Deliberately **not** done:

- No `scrollbar-gutter: stable` — it would permanently shrink `.viewport`'s content box relative to the
  host and reintroduce a constant over-estimate.
- No change to `.centre` in `di-design-view.element.ts`. `design-view-layout.browser.test.ts:76` pins
  `overflow: auto` there, and that column's overflow is viewport-height driven, not canvas driven, so it is
  not part of this loop.
- `updated() → #recomputeFit()` stays. It is the only thing that catches a size change no observer fires
  for, and once the measurement is scrollbar-independent, re-running it per render is idempotent.

Scrolling when genuinely zoomed in is untouched: `scale = zoom ?? _fitScale`, so an explicit `zoom` above
fit still makes the artboard larger than the viewport, and the scrollbars appear and stay.

### 2. Zoom controls: real icons, and a typeable percentage

In `designer/di-canvas-toolbar.element.ts`:

- `icon-remove` → **`icon-zoom-out`**, and `icon-add` → **`icon-zoom-in`** on the two zoom buttons, so the
  pair reads as a matched magnifier −/+ instead of a bin next to a plus. The three other `icon-add` uses
  elsewhere in the client stay as they are — a plus is right there.
- Replace `<span class="value">` with the existing **`<di-number-field>`** (`inputs/di-number-field.element.ts`):
  `suffix="%"`, `label="Zoom"` for the accessible name, `step="5"`, `min`/`max` from the shared bounds
  below. It already clamps via `clampNumber()`, writes the corrected value back into the input, and keeps
  the previous value when what was typed is unparseable. It emits `change` with `{ value }`; the toolbar's
  handler turns percent into a fraction and emits `di-zoom-change`, ignoring `null` (an empty field is not
  a zoom). The handler reads `detail?.value` rather than destructuring: it is bound on the toolbar row,
  so any other control in that row raising a bare `change` must not throw.
- **Do not clobber the field while it has focus.** `effectiveScale` re-renders the toolbar on every resize
  and drag; guard the value binding on the field not being `:focus-within`, so typing survives a re-render.

  **Built slightly differently.** Simply withholding the value while focused sets the binding to
  `undefined`, which di-number-field renders as an *empty* field - it blanks what is being typed
  rather than preserving it. The toolbar instead remembers the last percentage it pushed
  (`#shownPercent`) and repeats that number while `:focus-within` holds. An unchanged binding is one
  lit does not commit, so di-number-field never re-renders and the half-typed text stands. A
  `@focusout` on the toolbar row calls `requestUpdate()`, so the field resyncs to the real scale the
  moment focus leaves it rather than waiting for the next unrelated render. Both behaviours are
  pinned by `zoom-controls.browser.test.ts`.
- Give the field a fixed narrow width in `.zoom`, so the toolbar row does not jump as the digit count
  changes — that is what `.value`'s `min-width: 44px` and `tabular-nums` were for, moved onto the field.

### 3. One clamp, one place

The 0.1–4 clamp exists twice already, and adding a third for the input would make it four. Export
`ZOOM_BOUNDS = { min: 0.1, max: 4 }` from `inputs/number-bounds.ts` alongside `INSPECTOR_BOUNDS`, and read
it from the design view's `di-zoom-change` handler and from the toolbar's field (as `min: 10, max: 400`
percent). Leave `setZoom()` in the workspace context alone — it is unrelated dead code, not this change's
business.

### 4. The blank eye icon

The registry has no eye-with-a-slash under any name, so rather than reach for an unrelated glyph
(`icon-block`, `icon-wrong`), use **`icon-eye` for both states and carry the state in the button's look** —
the pattern `di-canvas-toolbar`'s own `#renderToggle()` already uses. In
`designer/di-layers-panel.element.ts:100-109`: always `icon-eye`,
`look=${layer.isVisible ? "primary" : "secondary"}`, and dim the icon when hidden. The `label` already says
"Hide"/"Show", so the accessible name was never the problem.

As built, the dimming needs a hook the panel's own stylesheet can reach, so the button also carries
`class="visibility off"` when hidden and `.visibility.off uui-icon { opacity: 0.45 }` sits beside the
row rules. Reaching into `uui-button`'s shadow root from here is not possible, and the class is the
same channel `.row.selected` already uses.

### 5. A guard so no unverified icon name ships again

Both icon defects are the same class of bug: a name typed from memory that the registry does not have, or
has under a different picture. `event-contract.test.ts` already solves the analogous problem for `di-*`
events by scraping source text and asserting a contract; mirror it exactly.

---

## Files

**New**

- `src/DynamicImages/Client/src/designer/canvas-scroll-stability.browser.test.ts`
- `src/DynamicImages/Client/src/designer/zoom-controls.browser.test.ts`
- `src/DynamicImages/Client/src/icon-contract.test.ts` (node project)

**Modified**

- `src/DynamicImages/Client/src/designer/di-designer-canvas.element.ts` — `#recomputeFit()` measures the
  host; `FIT_HEADROOM`.
- `src/DynamicImages/Client/src/designer/di-canvas-toolbar.element.ts` — zoom icons, the
  `<di-number-field>` percentage input, its change handler and focus guard, `.zoom` width, drop `.value`.
- `src/DynamicImages/Client/src/inputs/number-bounds.ts` — add exported `ZOOM_BOUNDS`.
- `src/DynamicImages/Client/src/workspace/views/di-design-view.element.ts` — the `di-zoom-change` handler
  reads `ZOOM_BOUNDS` instead of inline `0.1`/`4`.
- `src/DynamicImages/Client/src/designer/di-layers-panel.element.ts` — the visibility button.
- `src/DynamicImages/Client/vite.config.ts` — the browser project's chromium instance launches with
  `ignoreDefaultArgs: ["--hide-scrollbars"]`, without which the scroll-stability spec's premise cannot
  hold. See "The tests" below.
- `src/DynamicImages/Client/src/designer/canvas-scale.browser.test.ts` — its third case asserts `.value`'s
  textContent is `"27%"`. Retarget it at the input's value (`"27"`). **This is the one existing spec this
  change breaks, and it must keep asserting the same thing: the readout shows the effective scale, not the
  zoom.**
- `src/DynamicImages/wwwroot/App_Plugins/DynamicImages/dynamic-images.js` (+ `.map`) — the committed
  bundle. `ci.yml` fails if it does not match source, so rebuild and commit it.
- `plans/ui-review-fixes-plan.md` — a short note that B1's `.centre` fix left the canvas measuring its own
  scroll box, and what replaced it.

**Reused as-is**

- `src/inputs/di-number-field.element.ts` and `clampNumber()` in `src/inputs/number-bounds.ts` — the
  percentage input, already clamping and already covered by `number-field-clamp.browser.test.ts`.
- `src/testing/browser-fixtures.ts` — `fixedBox()`, `resetBody()`, `settle()`.
- `src/event-contract.test.ts` — the structure the icon contract test copies: the `sourceFiles()` walk, the
  regex scrape, the `*.test.ts` and `src/testing` exclusions.

---

## The tests

Every spec below must be **run against the current code and seen to fail** before the fix lands, and the
observed numbers put in the commit message — the standard `8c71db4` set.

### 1. `canvas-scroll-stability.browser.test.ts` (browser mode — jsdom does no layout)

The causal one. *The fit scale must not move when the viewport gains a scrollbar.*

```ts
it("does not re-fit when the viewport gains a scrollbar", async () => {
  const { canvas } = await mountCanvas(400, 300);
  const before = canvas.scale;

  // Force a scrollbar the fit must not see. The canvas measures the space it was *given*, not what
  // is left over once its own content has decided to overflow - otherwise the two chase each other.
  const viewport = canvas.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
  const spacer = document.createElement("div");
  spacer.style.cssText = "width:3000px;height:3000px;flex:0 0 auto;";
  viewport.append(spacer);

  canvas.requestUpdate();
  await settle(canvas, 6);

  expect(canvas.scale).toBe(before);
});
```

Pre-fix, `clientWidth`/`clientHeight` drop by the scrollbar and the fit shrinks, so it fails; post-fix it
reads the host and passes.

**Headless Chromium may use overlay scrollbars, which take no space and would make this pass vacuously.**
So the spec first injects `::-webkit-scrollbar { width: 15px; height: 15px }` into `canvas.shadowRoot`, and
asserts `viewport.clientWidth < viewport.offsetWidth` once the spacer is in — the premise is guaranteed,
not assumed.

**Found during implementation: the CSS alone was not enough.** Playwright's headless defaults include
`--hide-scrollbars`, which zeroes every scrollbar whatever the stylesheet says. With it on, the spacer
made the viewport overflow (`scrollWidth` 1900 against a `clientWidth` of 400) while `clientWidth` stayed
level with `offsetWidth`, so the premise assertion failed — correctly, and loudly, which is what it is
there for. `vite.config.ts`'s browser instance now passes
`launch: { ignoreDefaultArgs: ["--hide-scrollbars"] }`. CI installs its own Chromium and runs the same
config, so the premise holds there too or the spec says so.

Also in the same file:

- **No knife edge.** After settling, the artboard's border box is *strictly* narrower and shorter than the
  viewport's content box (`clientWidth - 48`, `clientHeight - 48`). Pre-fix the binding axis is exactly
  equal, so it fails; post-fix it is `FIT_HEADROOM` short.
- **It converges.** Collect every `di-scale-change` over ~20 animation frames after a viewport size change,
  and assert the tail holds one distinct value. Honest caveat: whether this *fails* pre-fix depends on the
  geometry landing on the rounding boundary, so it is a supporting assertion — the two above are the ones
  the fix is judged by.
- **Zooming in still scrolls.** `canvas.zoom = 3` → `viewport.scrollWidth > viewport.clientWidth` and
  `scrollHeight > clientHeight`. Guards against "fixing" the flicker by suppressing scrolling.

### 2. `zoom-controls.browser.test.ts` (browser mode)

- The zoom-out button exists, is labelled `Zoom out`, and its icon name is **registered and not
  `icon-remove`** — assert the rendered `<uui-icon>`'s `name`, so swapping in another bin fails the spec.
- Clicking "Zoom out" emits `di-zoom-change` with `effectiveScale / 1.25`; "Zoom in" with `× 1.25`.
- The percentage field shows `27` for `effectiveScale = 0.27`.
- Typing `50` and firing `change` emits `di-zoom-change` with `{ zoom: 0.5 }`.
- Typing `900` clamps to `400` → `{ zoom: 4 }`; typing `1` clamps to `10` → `{ zoom: 0.1 }`.
- Typing gibberish emits nothing and restores the previous value.
- While the field has focus, a new `effectiveScale` does not overwrite what is being typed.

### 3. `icon-contract.test.ts` (node project — fast, runs on every save)

Scrape every `"icon-*"` literal out of `src/**/*.ts` (production only, same exclusions as
`event-contract.test.ts`), read
`node_modules/@umbraco-cms/backoffice/dist-cms/packages/core/icon-registry/icons.js` **as text** and regex
the `name:` values out of it, then assert every used name is in that set. Reading it as text rather than
importing it keeps the node project free of custom-element side effects, and matches how
`event-contract.test.ts` already works. Today this fails on `icon-eye-off`; after the fix it is green, and
it is what stops the next one.

Note what this test can and cannot do: it catches a name that does not **exist**. It cannot catch
`icon-remove`, which exists and draws the wrong thing — that one is caught by the icon-name assertion in
`zoom-controls.browser.test.ts`.

**One implementation note.** The committed bundle is unminified, so comments ship in it, and this plan's
own Context relies on grepping that bundle for icon names. The two comments explaining these fixes
therefore describe the old icons ("the registry's *remove* icon", "an eye-with-a-slash") rather than
quoting their names, so `grep icon-remove wwwroot/.../dynamic-images.js` stays a real check instead of
matching a comment about the bug it is looking for. Both names are now absent from the built output.

---

## Implementation order

1. `icon-contract.test.ts` first — it is cheap, it fails immediately on `icon-eye-off`, and it confirms
   `icon-zoom-in`/`icon-zoom-out` are safe choices before anything uses them.
2. The icon fixes: the toolbar's two zoom icons, the layers panel's visibility button.
3. `canvas-scroll-stability.browser.test.ts` against unfixed code. Confirm which assertions fail, and record
   the numbers for the commit message.
4. The `#recomputeFit()` fix; the spec goes green.
5. `ZOOM_BOUNDS` in `number-bounds.ts`; point `di-design-view`'s handler at it.
6. The percentage input in the toolbar, plus the focus guard; update `canvas-scale.browser.test.ts`'s third
   case.
7. `zoom-controls.browser.test.ts`.
8. Rebuild the client bundle and commit it.

## Verification

The container has no .NET SDK and no `node_modules`; install both first (per `CLAUDE.md`).

```bash
cd src/DynamicImages/Client
npm ci
npm run typecheck
npm test              # node project - includes the new icon contract test
npm run test:browser  # real Chromium - the scroll-stability and zoom-control specs
npm run build         # the committed bundle must match source, or ci.yml fails
git status --short ../wwwroot   # expect the rebuilt bundle + map, nothing else
```

```bash
curl -sSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
bash /tmp/dotnet-install.sh --channel 10.0 --install-dir "$HOME/.dotnet"
export PATH="$HOME/.dotnet:$PATH" DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1
dotnet build src/DynamicImages.sln && dotnet test test/DynamicImages.Tests
```

**Confirm each new spec fails before the fix**, not merely that it passes after: `git stash` the source
change, re-run, and put the observed numbers — the pre-fix scale delta, the exactly-equal artboard
measurement — in the commit message.

**Observed, on this implementation:**

| Spec | Pre-fix |
| --- | --- |
| `icon-contract` → every icon name is registered | fails: `icon-eye-off (used in designer/di-layers-panel.element.ts)` |
| scroll stability → does not re-fit when the viewport gains a scrollbar | fails: scale **0.29333333 → 0.28083333**, a delta of **0.0125** against a `0.001` epsilon |
| scroll stability → artboard sits strictly inside the content box | fails: **`expected 352 to be less than 352`** — dead level, exactly as predicted |
| zoom controls → zoom-out is a magnifier | fails: renders **`icon-remove`** |
| zoom controls → zoom-in is a magnifier | fails: renders **`icon-add`** |
| zoom controls → the six percentage-field cases | fail: *the toolbar has no di-number-field* |
| `canvas-scale` third case, retargeted | fails: *the toolbar has no percentage field* |

Two of the new assertions pass pre-fix and are kept as guards rather than as evidence, which the plan
already anticipated for the first: *it converges* (whether it fails depends on the geometry landing on the
rounding boundary) and *zooming in still scrolls* (it guards against curing the flicker by suppressing
scrolling, so passing before and after is the point). *Steps out and in from the effective scale* is the
same: pre-existing behaviour the icon change must not disturb.

Manual check, if the test site is booted (`plans/ui-review-method.md` §6 — HTTPS, probe `/umbraco`, never
`/`): open a template in the designer and confirm the toolbar reads `[magnifier−] [27 %] [magnifier+]
[Fit]`, that typing `150` into the field zooms to 150%, that neither scrollbar flickers while dragging a
layer, and that both scrollbars appear and *stay* at 300%.
