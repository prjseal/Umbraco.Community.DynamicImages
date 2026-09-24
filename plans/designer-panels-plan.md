# Designer panels: a clickable Background row, collapsible side panels, and chevrons that point the right way

## Context

Four problems with the panels around the Design view's canvas (`di-design-view`):

1. **The Background row in the Layers panel does nothing.** In
   `src/DynamicImages/Client/src/designer/di-layers-panel.element.ts:95-99` it's a dimmed
   (`opacity: 0.6`, `cursor: default`) row with a lock icon titled "The base image and canvas
   fill are edited in the inspector". It has no click handler, role or tabindex. The inspector
   already shows the Canvas pane whenever no layer is selected
   (`di-layer-inspector.element.ts:81`: `this.layer ? #renderLayer : #renderCanvas`). So the
   row only has to select nothing, which is what a click on bare stage already does
   (`di-designer-canvas.element.ts:785-791` dispatches `di-layer-select` with `key: undefined`).
2. **The Layers panel chevron points the wrong way.** It shows `icon-navigation-right` when
   collapsed and `icon-navigation-down` when expanded (`di-layers-panel.element.ts:75`).
3. **The Elements palette (`di-property-palette`) can't be collapsed.** It always takes the
   250px grid column (200px under 1280px).
4. **The section's tree sidebar can't be collapsed.** Umbraco 17.5.3 has no API for this. The
   sidebar sits in `umb-section-default`'s shadow root as
   `umb-split-panel > umb-section-sidebar[slot=start]`. The split panel's
   `--umb-split-panel-start-min-width: 200px` means neither dragging the divider nor pressing
   Home can shrink it below 200px. `UMB_SECTION_SIDEBAR_CONTEXT` is empty and is provided on a
   sibling branch, so the workspace can't consume it.

### Decisions made with Paul

- **Chevron convention for the two bottom-docked panels (Layers, Server preview): up to open,
  down to close.** Both grow upwards, so the chevron points where the header will move. The
  preview strip already does this (`di-preview-strip.element.ts:155`), so only the Layers panel
  changes.
- **Side panels that collapse to the left:** the chevron points left to collapse and right to
  expand.
- **The tree toggle is the first button in the canvas toolbar**, before the zoom control. It
  says "Hide tree" / "Show tree" and is always visible, even when the Elements panel is
  collapsed. The Elements panel has its own chevron in its header.
- **Both collapse states are remembered per browser** in localStorage. The tree is always put
  back when the Design view is left, whatever the preference says. Otherwise the rest of the
  section would have no navigation.

### Facts verified in the installed backoffice (17.5.3)

- `umb-section-default` (`dist-cms/packages/core/section/default/default-section.element.js`)
  renders `<umb-split-panel lock="start" snap="300px" .position=${_splitPanelPosition}>`. It
  saves the position to localStorage key `umb-split-panel-position` **only** on the split panel's
  `position-changed` event, and that event fires only when a drag ends. Setting `position` from
  code recalculates the grid and persists nothing.
- `umb-split-panel` (`dist-cms/packages/core/components/split-panel/split-panel.element.js`)
  lays out `minmax(var(--umb-split-panel-start-min-width), <locked width>px) 0px 1fr`. An inline
  `--umb-split-panel-start-min-width: 0px` on the element overrides section-default's 200px.
  Its `#divider` (with a 12px drag touch area) is in its own open shadow root.
- The section also sets `--umb-split-panel-slot-overflow: visible`, so a 0px sidebar would still
  paint its contents. The sidebar element has to be `display: none` as well.
- `UMB_SECTION_CONTEXT` (from `@umbraco-cms/backoffice/section`) is provided on the
  `umb-section-default` element. `consumeContext(UMB_SECTION_CONTEXT, ctx => ctx.getHostElement())`
  from the design view gives that element directly, with no DOM walking.
- Icons `icon-navigation-left/right/up/down` are all in the registry (`icon-contract.test.ts`
  checks this). There are no `icon-chevron-*` names.

## Design

### 1. The Background row selects the canvas (`di-layers-panel.element.ts`)

- It becomes an interactive row like the layer rows: `role="button"`, `tabindex="0"`,
  `aria-pressed=${!this.selectedLayerKey}`, and the `selected` class when nothing is selected. It
  has `title="Canvas settings: size, fill and base image"`.
- `@click` emits `di-layer-select` with `{ key: undefined }`. The design view already routes that
  to `context.selectLayer(undefined)`, and the inspector then renders the Canvas pane.
- `@keydown`: Enter or Space (with `preventDefault`) does the same as a click.
- Remove the lock icon, and remove the `.row.background` opacity and `cursor: default`. Keep the
  `icon-picture` icon.
- Keep the row's visible text exactly "Background". `e2e/helpers.ts:layerNames` filters on that
  exact text.
- It is still not draggable and not a drop target, and it stays last (the bottom of the stack).

### 2. Layers chevron (`di-layers-panel.element.ts:75`)

`this.expanded ? "icon-navigation-down" : "icon-navigation-up"`. Update the comment above the
toggle to say that the panel grows upwards, so up opens and down closes, the same as the preview
strip.

### 3. Collapsible Elements palette

**`di-property-palette.element.ts`**
- New `@property({ type: Boolean, reflect: true }) collapsed = false`.
- **Expanded:** the first row becomes `.top`, a flex row holding the existing search `uui-input`
  (`flex: 1`) and a `uui-button compact look="secondary" label="Collapse the elements panel"`
  containing `icon-navigation-left`.
- **Collapsed:** render only a rail containing one `uui-button compact look="secondary"
  label="Expand the elements panel"` with `icon-navigation-right`. Also add
  `:host([collapsed]) { overflow: hidden }`, and keep the border-right.
- The button dispatches `di-palette-toggle` (bubbles, composed) with `{ collapsed: !this.collapsed }`.
  The palette does not change its own state; the design view owns it.

**`di-design-view.element.ts`**
- `@state() _paletteCollapsed`, read from localStorage key `di:designer:palette-collapsed` in the
  constructor.
- Pass `.collapsed=${this._paletteCollapsed}` to the palette. On `@di-palette-toggle`, set the
  state and persist it.
- Add the class `palette-collapsed` to `.layout` when collapsed. The CSS:
  - default: `.layout.palette-collapsed { grid-template-columns: 40px 1fr 340px; }`
  - inside `@media (max-width: 1280px)`: `40px 1fr`
  - under 860px the layout is one column, so a collapsed palette is just its rail's height.
    Make sure the `.palette { max-height: 30vh }` rule doesn't give it more.

### 4. Collapsible tree sidebar

**New `src/DynamicImages/Client/src/workspace/views/section-sidebar.ts`.** All knowledge of
Umbraco's internals lives in this one file, so an upgrade that moves them breaks only here.

```ts
/** Hides the section's tree sidebar, which Umbraco 17 has no API to collapse. */
export class SectionSidebar {
  constructor(sectionElement: Element | undefined)
  get available(): boolean   // found both umb-split-panel and umb-section-sidebar
  get collapsed(): boolean
  collapse(): void
  restore(): void
}
```

- It finds `umb-split-panel` and `umb-section-sidebar` in `sectionElement.shadowRoot`. If either
  is missing, `available` is false and every method does nothing.
- `collapse()` (does nothing if already collapsed):
  - Remember `splitPanel.position`.
  - Set `--umb-split-panel-start-min-width: 0px` on the split panel's inline style.
  - Set `sidebar.style.display = "none"`.
  - Hide `splitPanel.shadowRoot?.querySelector("#divider")` with `display: none`. Dragging it
    would fire `position-changed` and overwrite Umbraco's saved width.
  - Set `splitPanel.position = "0px"`.
- `restore()` (does nothing if not collapsed):
  - Remove the inline property and the two inline `display` values.
  - Set `position` back to the remembered value. If that is empty or `0`, use
    `localStorage["umb-split-panel-position"]` instead, and `"300px"` if that is missing too.
    Wrap the localStorage read in try/catch.

**`di-design-view.element.ts`**
- `consumeContext(UMB_SECTION_CONTEXT, (ctx) => …)` creates
  `new SectionSidebar(ctx?.getHostElement())`, sets `@state() _treeAvailable = sidebar.available`,
  and calls `collapse()` if the saved preference says so.
- `@state() _treeCollapsed`, read from localStorage key `di:designer:tree-collapsed`.
- `@di-toggle-tree` flips `_treeCollapsed`, calls `collapse()` or `restore()`, and persists the
  new value.
- `disconnectedCallback` calls `restore()` and leaves the saved preference alone.
  `connectedCallback` calls `collapse()` again if the preference is set and the helper exists,
  in case the view is re-attached rather than recreated.
- Pass `.treeAvailable` and `.treeCollapsed` to the toolbar.

**`di-canvas-toolbar.element.ts`**
- New `@property({ type: Boolean }) treeAvailable = false` and `treeCollapsed = false`.
- When `treeAvailable` is true, render `uui-button compact look="secondary"` first in `.toolbar`,
  before `.zoom`. Its label is `treeCollapsed ? "Show tree" : "Hide tree"`. Its icon is
  `icon-navigation-right` when collapsed and `icon-navigation-left` when expanded. It emits
  `di-toggle-tree`.
- When the helper finds no sidebar (in unit tests, or after a future Umbraco change), the button
  isn't rendered. Don't show a control that does nothing.

### localStorage

Follow the try/catch pattern in `di-template-workspace.context.ts:570-594`. Put small
`readFlag(key)` / `writeFlag(key, value)` helpers in `section-sidebar.ts`, or in a tiny
`workspace/views/ui-prefs.ts` if that reads better. Key names use a colon prefix (`di:designer:…`),
never a `"di-…"` literal: `event-contract.test.ts` treats every `"di-…"` string as an event name.

## Files

**Modified**
- `src/DynamicImages/Client/src/designer/di-layers-panel.element.ts`: the Background row and the
  chevron.
- `src/DynamicImages/Client/src/designer/di-property-palette.element.ts`: `collapsed`, the header
  button, the rail.
- `src/DynamicImages/Client/src/designer/di-canvas-toolbar.element.ts`: the tree toggle.
- `src/DynamicImages/Client/src/workspace/views/di-design-view.element.ts`: state, persistence,
  the grid class, the section context, and the event handlers.
- `src/DynamicImages/Client/src/designer/layers-panel-layout.browser.test.ts`: chevron and
  Background specs.
- `src/DynamicImages/Client/e2e/helpers.ts`: only if a new helper is useful, for example
  `expandPalette`.
- `src/DynamicImages/wwwroot/App_Plugins/DynamicImages/dynamic-images.js` (+ `.map`): the
  rebuilt bundle (`ci.yml` checks it matches the source).

**New**
- `src/DynamicImages/Client/src/workspace/views/section-sidebar.ts`
- `src/DynamicImages/Client/src/workspace/views/section-sidebar.browser.test.ts`
- `src/DynamicImages/Client/src/designer/palette-collapse.browser.test.ts`
- `src/DynamicImages/Client/e2e/designer-panels.spec.ts`

**Reused as-is**
- `di-preview-strip.element.ts`: its chevrons already match the chosen convention.
- `testing/browser-fixtures.ts`: `mountWorkspace`, `templateWithLayers`, `settle`, `fixedBox`,
  `resetBody`.
- The existing `di-layer-select` handling in `di-design-view.element.ts:421`, and the inspector's
  canvas pane.

## Implementation order

1. Layers panel: the chevron, then the Background row, with its specs.
2. Palette collapse: element, design-view grid and persistence, with its specs.
3. The `SectionSidebar` helper, with its stubbed spec.
4. Wire the tree toggle through the toolbar and the design view.
5. The E2E spec against the booted test site.
6. `npm run typecheck && npm test && npm run test:browser && npm run build`, then commit the
   bundle together with the source.

## Verification

**Browser-mode specs (`npm run test:browser`)**
- `layers-panel-layout`:
  - The toggle's `uui-icon` is `icon-navigation-up` when collapsed and `icon-navigation-down`
    when expanded.
  - The row count is still 4 (three layers plus Background).
  - With no `selectedLayerKey`, the Background row has `aria-pressed="true"` and the `selected`
    class. With a key, it is `"false"`.
  - Clicking it, and pressing Enter on it, each dispatch `di-layer-select` with
    `detail.key === undefined`.
- `palette-collapse`:
  - Clicking the header button fires `di-palette-toggle` with `{ collapsed: true }`.
  - With `collapsed` set, no `.chip` is rendered and the expand button shows
    `icon-navigation-right`.
  - Mount `di-design-view` at 1536x900 (the pattern in `design-view-layout.browser.test.ts`) and
    collapse the palette. It measures 40px wide or less, `di-designer-canvas` gets wider, and
    `design-view-layout`'s canvas-height floor still holds.
- `section-sidebar`, with a stub: a host element with an open shadow root containing a plain
  `umb-split-panel` element (with a `position` property and its own shadow root holding
  `#divider`) and a `umb-section-sidebar`:
  - `collapse()` sets the min-width property, hides the sidebar and the divider, and sets
    `position` to `"0px"`.
  - `restore()` puts the old position back, with the fallback when the old one was `0px`.
  - A host with no split panel gives `available === false`, and every call does nothing.
  - Guard the stub tag names with `customElements.get` in case the backoffice registers the real
    ones in the test bundle. If it does, use the real element.
- The existing `design-view-layout`, `zoom-controls` and `canvas-scale` specs still pass (the
  toolbar gains a leading button).
- `npm test`: `icon-contract` and `event-contract` pass, which proves `di-palette-toggle` and
  `di-toggle-tree` both have listeners.

**E2E (`e2e/designer-panels.spec.ts`, booted test site per CLAUDE.md), on "Article OG image" > Design**
- Select a layer, expand Layers, and click Background.
  `di-layer-inspector uui-box[headline='Canvas']` is visible.
- Collapse Elements. `di-property-palette` is 40px wide or less. Reload: it is still collapsed.
  Expand it again so the other specs aren't affected. Those specs click palette buttons, so
  clean up in `afterEach` and clear localStorage.
- Click "Hide tree". `umb-section-sidebar` is not visible, and the workspace gains about the
  sidebar's width. Switch to the Settings view tab (`umb-workspace-editor uui-tab`) and the
  sidebar is visible again. Back on Design it is hidden again. Click "Show tree" and it returns
  at its previous width.
- `localStorage["umb-split-panel-position"]` is unchanged by all of the above.

**Manual:** in the booted site, check each chevron's direction in both states, and that a drag
of the tree divider still works normally when the tree is shown.
