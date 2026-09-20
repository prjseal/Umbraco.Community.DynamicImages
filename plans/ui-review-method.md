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

## 6. How these are tested now

*This section proposed three layers. They were built — see
[`plans/ui-review-fixes-plan.md`](./ui-review-fixes-plan.md) — so it now describes what exists
rather than what should.*

Before the fixes there was no CI at all: `.github/workflows/release.yml` is tag-triggered and only
packs. The .NET tests and the vitest specs had never run automatically.

Now `.github/workflows/ci.yml` runs on every push and pull request — the .NET tests, then the
client's typecheck, unit and component suites, then a build and
`git diff --exit-code src/DynamicImages/wwwroot`. That last step is the one that matters: the
bundle is committed and the release workflow has no npm step, so a stale bundle used to ship
silently. `.github/workflows/e2e.yml` runs the E2E suite behind `workflow_dispatch`, because the
test site's first boot imports ~192 uSync items.

`rotation.test.ts` and `RotationMathTests` still share a JSON fixture so both sides fail if either
drifts; that pattern was kept and reused.

### Layer 1 — vitest, node environment (`npm test`)

| What | Where |
|---|---|
| A5 clamping | `Client/src/inputs/number-clamp.test.ts` over the exported `clampNumber` |
| A5 bounds | The same file: a table-driven pass over `INSPECTOR_BOUNDS`, plus a **source scan** of `di-layer-inspector.element.ts` asserting Rotation is the only `<di-number-field>` without bounds — so the next field added without any is caught |
| A1 as a class of bug | `Client/src/event-contract.test.ts` — collects every `di-*` name emitted anywhere in `src/` and every `@di-…=` binding, and asserts the first set is a subset of the second |
| C3 palette drops | `Client/src/models/palette-drop.test.ts` |

Two notes for anyone extending these:

- The event-contract scan deliberately takes **every `di-*` string literal** minus the custom
  element tag names, rather than matching `new CustomEvent("…")`. `di-canvas-toolbar` passes its
  four toggle event names into a shared helper, so a pattern matching only the dispatch site would
  miss them and quietly stop guarding them.
- `"abc" → keep the last value` is reachable only against `clampNumber` itself. A native
  `<input type="number">` sanitises an unparseable value to `""` before the element ever sees it.

### Layer 2 — vitest browser mode, real Chromium (`npm run test:browser`)

jsdom does no layout, so B1, B2 and B3 cannot be expressed there at all. `vite.config.ts` has two
projects so the node specs stay fast.

| What | Where |
|---|---|
| B1 canvas collapse | `Client/src/workspace/views/design-view-layout.browser.test.ts` |
| B2 layers panel | `Client/src/designer/layers-panel-layout.browser.test.ts` |
| B3 zoom readout | `Client/src/designer/canvas-scale.browser.test.ts` |
| A5 in the input | `Client/src/inputs/number-field-clamp.browser.test.ts` |
| A4 guard | `Client/src/workspace/navigation-guard.browser.test.ts` |
| A1/A3 strip payloads | `Client/src/workspace/views/preview-strip.browser.test.ts` |
| C5 skipped rows | `Client/src/workspace/views/preview-skips.browser.test.ts` |
| C4 view title | `Client/src/workspace/workspace-title.browser.test.ts` |

**Two traps worth more than the tests themselves:**

- **Drive the viewport, not a container.** B1 runs through `@media (max-width: 1280px)`, and a
  fixed-size container does not answer a media query. Use `page.viewport()` from
  `@vitest/browser/context`.
- **Give the view the height a workspace actually leaves it.** Handed `100vh`, the canvas clears
  the floor on the *pre-fix* CSS too, and the spec proves nothing. Every one of these specs was run
  against the pre-fix code and seen to fail before being kept.

### Layer 3 — Playwright E2E (`npm run test:e2e`)

`Client/playwright.config.ts` and `Client/e2e/`. **Not at `test/e2e/`:** `@playwright/test` is in
the client's `node_modules` and Node resolves upward from the spec file, so specs at the repo root
cannot import it.

| What | Where |
|---|---|
| A4, all four cases | `e2e/unsaved-changes.spec.ts` |
| A3 in-app switch and cold load, A1, C5 | `e2e/preview-surfaces.spec.ts` |
| C4, C1 | `e2e/fonts-and-title.spec.ts` |

**Assert on network payloads, not screenshots.** Every preview surface goes through
`POST preview` / `POST preview/layout`, so intercepting those requests is far more stable than
image diffing and tells you exactly what was wrong. Reserve visual snapshots for the rendered OG
image itself, where a pixel diff is the point.

#### Boot facts, all learned the hard way

- **Probe `/umbraco`, never `/`.** The Clean.Core 7.x front end 500s by design, so a readiness
  check against the root waits forever for a page that is never going to be healthy.
- **It has to be HTTPS.** The backoffice's OpenIddict authorize endpoint rejects plain HTTP
  outright — `error_description: This server only accepts HTTPS requests` — *before* rendering a
  login form. The symptom is a blank page with no inputs on it, which reads as a mounting problem
  and is not one. `dotnet dev-certs https` plus `ignoreHTTPSErrors: true` is the whole answer; the
  certificate does not need to be trusted.
- **`appsettings.Local.json` is loaded only under `#if DEBUG`** (the test site's `Program.cs`), so
  a Release build has to be configured through environment variables:
  `Umbraco__CMS__Unattended__InstallUnattended` and friends.
- **The section has to be granted to a user group.** Declaring a section in `umbraco-package.json`
  registers it but does not grant it, and a freshly installed site's Administrators group lists
  only the core sections — so the package installed into an invisible section. That was a real
  first-install defect, now fixed by a migration in the package rather than worked around in test
  setup.
- **First boot imports ~192 uSync items**, so `webServer.timeout` needs minutes.
- **Views take 5–10 seconds to mount.** Use auto-waiting assertions, never fixed timeouts.
- **One worker.** The specs share one site and several of them write to it.

#### What the E2E suite found that nothing else did

Worth recording, because it is the argument for the layer existing at all. A4's guard passed its
component test and did nothing in the real app: `event.detail.url` is a `URL` **object** on a real
in-app navigation and a string only when the event is dispatched by hand, so `.includes` threw and —
the handler being async — the rejection was swallowed. Only a real navigation could show it.

The lesson generalises: **a synthetic event is not the same shape as the real one.** Where a
component test dispatches an event by hand, check the real payload's type before trusting it.

#### Local run

```bash
# One terminal: the site (Release, HTTPS, unattended).
ASPNETCORE_URLS=https://localhost:44344 \
Umbraco__CMS__Unattended__InstallUnattended=true \
Umbraco__CMS__Unattended__UnattendedUserEmail=test@example.com \
Umbraco__CMS__Unattended__UnattendedUserPassword='CHANGE-ME-local-only-1234' \
dotnet run --project src/DynamicImages.TestSite.Clean -c Release --no-launch-profile

# Another: the specs against it.
cd src/DynamicImages/Client
E2E_BASE_URL=https://localhost:44344 npm run test:e2e
```

Leaving `E2E_BASE_URL` unset makes the config boot the site itself, which is what CI does.
