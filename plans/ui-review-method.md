# How the backoffice UI review was run

Companion to [`ui-review-findings.md`](./ui-review-findings.md). This is the method, the tooling and
the traps, written so the review can be repeated from scratch — and so the checks can be turned into
automated tests rather than re-run by hand every time.

---

## 1. Environment

```bash
# From the repo root. SQLite, so no SQL Server needed.
dotnet run --project src/DynamicImages.TestSite.Clean
```

- Site: <https://localhost:44344>, backoffice at `/umbraco`. Front end 500s — a known upstream
  `Clean.Core` 7.x packaging bug, documented in the test site's README, and irrelevant to this review.
- Login: create `src/DynamicImages.TestSite.Clean/appsettings.Local.json` from the committed
  `.example` file. It is gitignored and drives Umbraco's unattended install, so the first boot
  installs itself instead of showing the wizard. Throwaway local credentials only.
- First boot takes a couple of minutes: uSync imports ~192 items, and Dynamic Images imports the v1
  template from `appsettings.Development.json`.

**Start from an empty database when the boot sequence itself matters.** Delete
`src/DynamicImages.TestSite.Clean/umbraco/Data/` and re-run. That is how finding D (the v1 import
running before uSync creates the `article` document type) was caught — it is only visible on a cold
first boot. Killing a part-way first run leaves a half-initialised database, so always reset rather
than resume.

**Media files.** The 34 Clean starter-kit media files are now committed under
`src/DynamicImages.TestSite.Clean/wwwroot/media/`, force-added past the `/wwwroot/media/` ignore
rule. Without them, image layers silently render nothing and you will misdiagnose it as a package
bug — that happened in this review. If they ever go missing again, re-copy the folders referenced by
`uSync/v17/Media/*.config` from `D:\Code\GitHub\Clean\template\Clean.Blog\wwwroot\media`.

Also worth knowing: the Dynamic Images section is hidden until granted under
**Users → User Groups → (group) → Sections**, though the unattended admin already has it.

---

## 2. Tooling

Browser automation via the **Claude in Chrome** MCP tools. The ones that earned their keep:

| Tool | Used for |
|---|---|
| `tabs_context_mcp`, `tabs_create_mcp`, `tabs_close_mcp` | session/tab management |
| `navigate` | deep-linking to dashboards and workspace views |
| `computer` (`screenshot`, `left_click`, `triple_click`, `type`, `scroll`, `wait`) | real user input and visual checks |
| `javascript_tool` | **the workhorse** — DOM measurement and shadow-DOM extraction |
| `browser_batch` | batching a click → wait → screenshot sequence into one round trip |
| `read_console_messages` | checking for JS errors (there were none) |

Plus `grep`/`ripgrep` over `src/DynamicImages/Client/src` to confirm root causes in source, and a
subagent to map the extension surface (manifests, views, endpoints) before touching the browser.

**Two tools that do not work here:** `read_page` and `get_page_text` both return nothing on the
Umbraco backoffice. Everything is nested shadow DOM and neither tool pierces it. Do not waste time
on them — go straight to `javascript_tool`.

---

## 3. Shadow-DOM helpers

Paste these into the page once per load (`javascript_tool`), then reuse. They are what made the
review possible.

```js
// Walk into every shadow root and pull out visible text + labels.
window.__txt = (root) => {
  const out = [];
  const walk = (n, d) => {
    if (!n) return;
    if (n.nodeType === 3) {
      const t = n.textContent.replace(/\s+/g, ' ').trim();
      if (t && t.length < 300) out.push('  '.repeat(Math.min(d, 10)) + t);
      return;
    }
    if (n.nodeType !== 1) return;
    const tag = n.tagName.toLowerCase();
    if (['script', 'style', 'svg', 'path', 'noscript'].includes(tag)) return;
    const lbl = n.getAttribute('label') || n.getAttribute('placeholder');
    if (lbl && lbl.length < 120) out.push('  '.repeat(Math.min(d, 10)) + '[' + tag + '] ' + lbl);
    if (n.shadowRoot) [...n.shadowRoot.childNodes].forEach(c => walk(c, d + 1));
    [...n.childNodes].forEach(c => walk(c, d + 1));
  };
  walk(root || document.body, 0);
  // NOTE: this de-duplicates. See the warning below.
  const seen = new Set();
  return out.filter(l => { const k = l.trim(); if (seen.has(k)) return false; seen.add(k); return true; }).join('\n');
};

// Find the first element with a given tag name, crossing shadow boundaries.
window.__find = (tag) => {
  let el = null;
  const w = n => {
    if (el) return;
    if (n.nodeType === 1) {
      if (n.tagName.toLowerCase() === tag) { el = n; return; }
      if (n.shadowRoot) [...n.shadowRoot.children].forEach(w);
      [...n.children].forEach(w);
    }
  };
  w(document.body);
  return el;
};

// Collect every element matching a predicate, crossing shadow boundaries.
window.__all = (pred) => {
  const r = [];
  const w = n => {
    if (n.nodeType === 1) {
      if (pred(n)) r.push(n);
      if (n.shadowRoot) [...n.shadowRoot.children].forEach(w);
      [...n.children].forEach(w);
    }
  };
  w(document.body);
  return r;
};

// Switch workspace view tabs (0 Design, 1 Preview & test, 2 Settings, 3 Usage).
window.__goto = (i) => {
  const we = __find('umb-workspace-editor');
  const tabs = [];
  const w = n => {
    if (n.nodeType === 1) {
      if (n.tagName === 'UUI-TAB') tabs.push(n);
      if (n.shadowRoot) [...n.shadowRoot.children].forEach(w);
      [...n.children].forEach(w);
    }
  };
  w(we);
  tabs[i].shadowRoot.querySelector('a').click();   // the inner <a>, not the host
  return tabs[i].textContent.replace(/\s+/g, ' ').trim();
};
```

Useful element names: `di-overview-dashboard`, `di-fonts-dashboard`, `di-health-dashboard`,
`di-template-editor`, `di-design-view`, `di-property-palette`, `di-canvas-toolbar`,
`di-designer-canvas`, `di-preview-strip`, `di-layer-inspector`, `di-layers-panel`,
`di-preview-view`, `di-settings-view`, `di-usage-view`, `di-number-field`, `di-colour-input`,
`di-font-upload-modal`.

To discover them live:

```js
(() => { const s = new Set(); const w = n => { if (n.nodeType === 1) {
  const t = n.tagName.toLowerCase(); if (t.startsWith('di-')) s.add(t);
  if (n.shadowRoot) [...n.shadowRoot.children].forEach(w); [...n.children].forEach(w); } };
  w(document.body); return [...s].join(', '); })()
```

---

## 4. Traps that cause false positives

These cost real time and two of them produced findings I had to retract. Read this section before
repeating the review.

**The `__txt` walker de-duplicates.** Identical strings are collapsed, so `7 of 7 have an image`
renders as `7 of have an image` and `0 error(s), 0 warning(s)` as `0 error(s), warning(s)`. Both
looked like missing-value bugs. **Always confirm anything suspicious against raw HTML** before
believing it:

```js
(() => { const v = __find('di-usage-view');
  const h = v.shadowRoot.innerHTML.replace(/<!--[^>]*-->/g, '');
  return h.replace(/<[^>]+>/g, '|').replace(/\|+/g, '|').replace(/\s+/g, ' ').slice(0, 1500); })()
```

**Views take 5–10 seconds to mount.** Checking for an element too early reports "not mounted" and
looks like a routing bug. Poll, or wait generously, before concluding anything is missing. A URL
that has already changed while the old view is still rendered is normal here, not a defect.

**`javascript_tool` refuses output that looks like cookie or query-string data.** Returning an
`href` or a bare GUID gets the whole call blocked with `[BLOCKED: Cookie/query string data]`. Return
element references, short labels and numbers instead.

**Promises do not resolve through `javascript_tool`** — it returns `{}`. Split the work: perform the
action and stash the result on `window` in one call, read it back in the next.

```js
// call 1
window.__fired = 0;
window.addEventListener('di-request-preview', () => { window.__fired++; }, true);
/* ...click... */ 'ok'
// call 2
JSON.stringify({ firedAtWindow: window.__fired })
```

**Never call `resize_window`.** Each call shrank the usable viewport further (1150 → 806 → 524 CSS
px) because the Claude side panel keeps its width while the page loses it. To recover, close the tab
and let `navigate` open a fresh window. Measure what you actually have before judging any layout:

```js
JSON.stringify({ iw: innerWidth, ih: innerHeight, dpr: devicePixelRatio,
                 scrollW: document.documentElement.scrollWidth })
```

**Screenshots are flaky.** `Page.captureScreenshot` times out after 30s fairly often; just retry.
The reported scale also varies between captures, so never measure layout from a screenshot —
measure with `getBoundingClientRect()`.

**Synthetic `.click()` on a `uui-tab` host does nothing.** Click the inner `<a>` inside its shadow
root (as `__goto` does).

---

## 5. Probe recipes

Reusable techniques, each tied to the findings it produced.

### Dead control (A1)
Grep for the emitter and any listener; then prove it live with a window-level counter.

```bash
grep -rn "di-request-preview" src/DynamicImages/Client/src
# one hit = emitter only, no listener
```

Then click the button and read `window.__fired` (see above). The event bubbling to `window`
unhandled, with no UI change, is the proof.

### No-op button (A2)
Capture observable state before and after. For the title-length presets, read the Resolved values
table after each click and compare value **and** position:

```js
(() => { const v = __find('di-preview-view');
  const h = v.shadowRoot.innerHTML; const i = h.indexOf('Resolved values');
  return h.slice(i, i + 1100).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); })()
```

Identical output for **Short** and **Very long** is the finding.

### Layout collapse (B1, B2, B3)
Measure named elements rather than eyeballing:

```js
(() => { const names = ['di-design-view','di-property-palette','di-designer-canvas',
  'di-canvas-toolbar','di-preview-strip','di-layer-inspector','di-layers-panel'];
  return JSON.stringify(names.map(n => { const e = __find(n); if (!e) return [n, 'MISSING'];
    const r = e.getBoundingClientRect();
    return [n, Math.round(r.width) + 'x' + Math.round(r.height)]; })); })()
```

A `0` height on `di-designer-canvas` is B1. For B2, compare the panel's own height against the grid
row it was given (`getComputedStyle(side).gridTemplateRows`). For B3, compare the stage's measured
width against the template's canvas width and check it against the toolbar's percentage readout.
Then read the component's `static styles` block in source to name the cause.

### Input validation (A5)
Set the inner input and dispatch `change`, then read the model back off the inspector:

```js
// call 1
(() => { const f = __all(n => n.tagName === 'DI-NUMBER-FIELD')
    .find(x => (x.getAttribute('label') || '') === 'Opacity');
  const inp = f.shadowRoot.querySelector('input');
  inp.value = '5';
  inp.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  return 'set'; })()
// call 2
(() => { const l = __find('di-layer-inspector').layer;
  return JSON.stringify({ rotation: l.rotation, opacity: l.opacity }); })()
```

`opacity: 5` surviving `min=0 max=1` is the finding. Repeat with Rotation `999` — it normalises to
`-81`, which is what makes the inconsistency worth reporting.

### Unsaved-changes guard (A4)
This one **must** use real keyboard input — a synthetic event may not register as a change, and a
missing prompt would then prove nothing. Click into the name field, `type` via the `computer` tool,
confirm the field shows the new value, then navigate away and assert no modal appeared:

```js
JSON.stringify({ path: location.pathname, modalOpen: !!__find('umb-confirm-modal') })
```

### Restoring state
The review made three persistent changes, two of which were reverted: a font named style was added
and deleted, and a style rename was typed and set back. Only the **Regenerate OG image** run on the
*Community* article was left in place. Template edits were never saved. Anything not reverted should
be listed in the findings so the next person is not confused by it.

---

## 6. Turning these into regression tests

Today the repo has 17 xUnit files under `test/DynamicImages.Tests` and 6 vitest specs under
`src/DynamicImages/Client/src` — all pure logic, nothing that renders a component or drives a
browser. `rotation.test.ts` and `RotationMathTests` already share a JSON fixture so that both sides
fail if either drifts; that shared-fixture pattern is worth keeping.

Every finding below can be pinned by a test. Three layers, cheapest first.

### Layer 1 — vitest, no browser (fast, run in CI today)

| Finding | Test |
|---|---|
| A5 clamping | `di-number-field` change handler clamps to `min`/`max`; add fixtures for opacity `5 → 1`, `-3 → 0`, and rotation `999 → -81` alongside the existing `rotation.test.ts` |
| A5 bounds | Assert every numeric inspector field declares sensible `min`/`max` — a table-driven test over the field descriptors |
| A1 dead event | A guard test asserting every `di-*` event name emitted anywhere in `src/` has at least one `@di-…` listener. Cheap, and catches the whole class rather than this one instance |
| A2 preset argument | Once `#render` honours its argument, assert the sample title is threaded into the request payload |

### Layer 2 — component tests (new: vitest browser mode or `@open-wc/testing`)

| Finding | Test |
|---|---|
| B2 layers panel | Mount `di-layers-panel` with 5 layers in a fixed-height container; assert its height fills the container and no row is clipped |
| B1 canvas collapse | Mount `di-design-view` at 1150×666 and assert `di-designer-canvas` height is above a floor (say 120px). Parameterise over 1150×666, 1280×800, 1536×900 |
| B3 zoom readout | Assert the toolbar percentage equals the stage's actual scale after **Fit** |
| C5 resolved values | Given a layout response where one layer produced nothing, assert a row still renders with an explanation |
| C4 workspace title | Assert the workspace context exposes a name observable and the document title contains the template name |

### Layer 3 — Playwright E2E (new)

Use `@umbraco/playwright-testhelpers`; the `umbraco-e2e-testing` skill in this workspace covers the
setup. These need a booted site, so they belong in a separate, slower CI job.

| Finding | Test |
|---|---|
| A4 unsaved changes | Type in the template name, navigate away, assert the confirm dialog appears and that cancelling keeps the edit |
| A3 preview strip | Choose a node in **Preview & test**, switch to **Design**, assert the strip's request carries that `contentKey` — intercept the `POST preview` call rather than diffing pixels |
| A1 server preview | Click **Server preview**, assert a `POST preview` request fires |
| A2 title presets | Click **Short** then **Very long**, assert the two `POST preview` payloads differ |
| C1 named styles | Click **Add a style**, assert the editor stays open and focus lands in the new row's name field |
| Happy path | Regenerate an OG image from a document's Actions menu and assert the target media picker is populated |

**Assert on network payloads, not screenshots.** Every preview surface goes through `POST
preview` / `POST preview/layout`, so intercepting those requests is far more stable than image
diffing and tells you exactly what was wrong. Reserve visual snapshots for the rendered OG image
itself, where a pixel diff is the point.

Two prerequisites for any browser-level work: the committed media files (section 1) and the fact
that views take seconds to mount — use Playwright's auto-waiting assertions rather than fixed
timeouts.
