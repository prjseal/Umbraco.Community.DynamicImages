# Canvas panning, and scrollbars that flicker with the pointer

## Context

Two problems in the Design view's canvas (`di-designer-canvas`):

1. **Scrollbars flicker when the mouse moves anywhere on the screen, even off the canvas.** The
   canvas listens for `pointermove` on `window`
   (`src/DynamicImages/Client/src/designer/di-designer-canvas.element.ts:128`) and
   `#onPointerMove` sets `_pointer = #toImagePixels(...)` on every move, with no check that the
   pointer is over the stage. That value goes to `di-rulers`, which positions its hairlines at
   `left: pointer.x * scale` / `top: pointer.y * scale` (`di-rulers.element.ts:85-96`). When the
   pointer is right of or below the canvas, the hairline sits past the end of the ruler. The
   ruler strips `.top` / `.left` don't clip, so that hairline becomes scrollable overflow of
   `.viewport` (`overflow: auto`). Both scrollbars then appear, and vanish when the pointer moves
   back up or left. The stage's `pointerleave` clears `_pointer`, but the next window move sets
   it again. A side cost: every mouse move anywhere in the backoffice re-renders the whole canvas.
   This is a different bug from the fit feedback loop that `canvas-scroll-stability.browser.test.ts`
   already covers.

2. **There's no way to grab the canvas and move it.** When zoomed in, the scrollbars are the only
   way to move around. There's also a hidden defect: `.viewport` centres the artboard with
   `display: flex; align-items: center; justify-content: center`. Once the artboard is bigger
   than the viewport, flex centring pushes the overflow off both edges, but only the right and
   bottom overflow can be scrolled to. The top-left of a zoomed-in canvas can't be reached at all.

What we want: the canvas stays still unless you move it. You can grab it and drag it to the part
you want to see, the way Figma and Photoshop work. Scrollbars are no longer needed, so they're
hidden.

### Decisions (defaults, not asked)

- **Keep the scroll container and pan by setting `scrollLeft` / `scrollTop`.** Don't switch to a
  CSS-transform canvas. All pointer maths goes through `#toImagePoint`, which reads the stage's
  `getBoundingClientRect()`, so scrolling needs no coordinate changes at all. A transform-based
  canvas would touch the fit logic, the rulers, snapping and the drop maths for no gain the user
  would notice.
- **Pan gestures:** Space + drag (the standard design-tool one), middle-button drag, and
  left-drag on the bare checkerboard around the artboard. Left-drag on the stage keeps doing what
  it does now: select or deselect, and move layers. The wheel scrolls as normal (Shift + wheel
  scrolls horizontally, which browsers already do), and Ctrl/Cmd + wheel still zooms.
- **Hide the scrollbars** (`scrollbar-width: none` and `::-webkit-scrollbar { display: none }`).
  The viewport can still scroll, so the wheel, trackpad and panning all keep working.
- **Out of scope:** zooming towards the cursor, panning past the canvas edges (an "infinite"
  canvas), and a hand tool in the toolbar.

## Design

### 1. The pointer is tracked only over the stage (`di-designer-canvas.element.ts`)

- In `#onPointerMove`, compute the image point. Set `_pointer` only when the point is inside
  `0..canvas.width` × `0..canvas.height`. Otherwise set it to `undefined`. Only assign when the
  value actually changes (compare x/y), so moves off the canvas don't re-render anything. The
  drag handling after that stays as it is.
- Keep the existing `pointerleave` reset. It stays correct.

### 2. The rulers clip their own hairlines (`di-rulers.element.ts`)

- Add `overflow: hidden` to `.top` and `.left`, so a hairline can never make the rulers larger
  than they are, whatever `pointer` says. This is defence in depth: part 1 alone fixes the symptom,
  and this stops it coming back.

### 3. The whole zoomed-in canvas can be reached (`di-designer-canvas.element.ts` styles)

- Remove `align-items: center; justify-content: center` from `.viewport` and give `.artboard`
  `margin: auto`. That centres the artboard while it fits. Once it overflows, the artboard starts
  at the padding edge, so every side can be scrolled to. (`justify-content: safe center` would
  also work, but auto margins are the long-standing fix and behave the same in every engine.)
- The fit maths in `#recomputeFit` doesn't change. It measures the host, not the viewport.

### 4. Panning (`di-designer-canvas.element.ts`)

State:
- `#pan?: { pointerId, startX, startY, scrollLeft, scrollTop }`
- `@state() _spaceHeld = false`, `@state() _panning = false` (for the cursor)
- `#hovering = false`, set by `pointerenter` / `pointerleave` on `.viewport`

Starting a pan: a **capture-phase** `pointerdown` listener on `.viewport`, so it runs before
`di-layer-box` starts a layer drag. It starts a pan when:
- `event.button === 1` (middle), or
- `event.button === 0` and `_spaceHeld`, or
- `event.button === 0` and the press landed on bare viewport or artboard. Check
  `event.composedPath()[0]`: it's the `.viewport` or `.artboard` element itself, not the stage, a
  layer box or a ruler.

When it starts a pan it calls `preventDefault()` (this stops middle-click autoscroll and text
selection) and `stopPropagation()` (so no layer drag starts under Space), then
`viewport.setPointerCapture(pointerId)` and records the start.

Moving: in the existing window `pointermove` handler, if `#pan` is set, set
`viewport.scrollLeft = pan.scrollLeft - (clientX - startX)` and the same for `scrollTop`, then
return before the layer-drag code. Ending: `pointerup` / `pointercancel` for the pan's pointer
clears `#pan`. Add this to `#onPointerUp` before the layer-drag branch.

Space:
- The canvas adds `keydown` / `keyup` listeners on `window` in `connectedCallback` and removes
  them in `disconnectedCallback`. On `key === " "`, it only acts when `#hovering` is true and the
  event isn't coming from a text field. Reuse the check from `di-design-view.element.ts:341-344`:
  move it into a small shared helper (for example `isTypingTarget(event)` in
  `src/designer/keyboard.ts`) and call it from both places.
- keydown: `preventDefault()` (no page scroll, no pressing a focused button) and set
  `_spaceHeld = true`. Ignore `event.repeat`.
- keyup, or the window losing focus (`blur`): set `_spaceHeld = false`.

Cursor: `.viewport.pan-ready { cursor: grab }` while Space is held.
`.viewport.panning, .viewport.panning * { cursor: grabbing }` during a pan. Give the bare
checkerboard (`.viewport` itself, which covers the artboard's surroundings) `cursor: grab` when
the canvas overflows. The simple version: always `grab` on bare checkerboard, and the stage sets
`cursor: default` so layer interaction looks the same as it does now.

As built, three additions:
- Layer boxes set their cursors inside their own shadow roots, which `.pan-ready *` can't reach.
  So while `pan-ready` or `panning` is on, `.stage > *` gets `pointer-events: none` and the grab
  cursor shows through. The capture-phase listener still starts the pan, because Space is held.
- A `mousedown` listener on `.viewport` cancels the middle button's default, since cancelling
  `pointerdown` isn't guaranteed to stop Chromium's autoscroll.
- keyup also calls `preventDefault()` when it releases a held Space, so a focused button isn't
  clicked on release.

### 5. Hidden scrollbars (`di-designer-canvas.element.ts` styles)

```css
.viewport { scrollbar-width: none; }
.viewport::-webkit-scrollbar { display: none; }
```

`canvas-scroll-stability.browser.test.ts` injects its own `::-webkit-scrollbar` style to give
scrollbars width. Check that its "premise" assertion still holds, because the injected rule has
to win against `display: none`. If it doesn't, make the injected rule set `display: block` as
well. That spec protects the fit loop, which still matters: the viewport still overflows.

As built: the premise did fail, and `display: block` alone wasn't enough. The element's own
styles are an adopted stylesheet, which cascades after any `<style>` in the shadow root, so an
equally specific injected rule loses. And a non-auto `scrollbar-width` makes Chromium ignore
`::-webkit-scrollbar` entirely. `giveScrollbarsWidth` now uses `.viewport.viewport` selectors and
sets `scrollbar-width: auto` as well as `display: block`.

## Files

**Modified**
- `src/DynamicImages/Client/src/designer/di-designer-canvas.element.ts`: pointer gating, panning,
  Space handling, centring and scrollbar CSS.
- `src/DynamicImages/Client/src/designer/di-rulers.element.ts`: `overflow: hidden` on the strips.
- `src/DynamicImages/Client/src/workspace/views/di-design-view.element.ts`: use the shared
  typing-target helper.
- `src/DynamicImages/Client/src/designer/canvas-scroll-stability.browser.test.ts`: add the specs
  below, and adjust `giveScrollbarsWidth` if needed.
- `src/DynamicImages/wwwroot/App_Plugins/DynamicImages/dynamic-images.js` (+ `.map`): the rebuilt
  bundle (CI checks that it matches the source).

**New**
- `src/DynamicImages/Client/src/designer/keyboard.ts`: `isTypingTarget(event)`.
- `src/DynamicImages/Client/src/designer/canvas-pan.browser.test.ts`

**Reused as-is**
- `src/DynamicImages/Client/src/testing/browser-fixtures.ts`: `fixedBox`, `resetBody`, `settle`.
- `createTemplate` from `src/models/layer-factories.ts`.

## Implementation order

1. The pointer gating (part 1) and the ruler clip (part 2), plus a spec reproducing the flicker.
   Write the spec first and watch it fail.
2. Auto-margin centring (part 3), plus a spec showing the top-left of a zoomed canvas is
   reachable.
3. The `isTypingTarget` helper, and switch the design view over to it.
4. Panning (part 4) with its specs.
5. Hidden scrollbars (part 5). Re-run the scroll-stability specs.
6. `npm run typecheck && npm test && npm run test:browser && npm run build`, then commit the
   bundle.

## Verification

Browser-mode specs (`npm run test:browser`), in a fixed box with rulers **on**:

- **No overflow from the pointer:** dispatch `pointermove` on `window` at a point well right of
  and below the stage. Assert `viewport.scrollWidth <= viewport.clientWidth` and the same for
  height, and that the rulers render no hairline. Then move over the stage and assert the
  hairline appears. The first assertion fails before the fix.
- **No re-render off-canvas:** two moves off-canvas in a row don't change `_pointer`. Check it via
  the `updateComplete` count or by spying on `render`, whichever is simplest.
- **Top-left reachable:** `zoom = 3`, `scrollLeft = scrollTop = 0`. The stage's top-left is inside
  the viewport's rect (it fails today because flex centring pushes it off to the negative side).
- **Pan by dragging bare checkerboard:** at `zoom = 3`, pointerdown on `.viewport`, move −100/−80,
  pointerup. `scrollLeft` / `scrollTop` went up by 100/80, and no `di-layer-select` or
  `di-transaction-begin` fired.
- **Space + drag over a layer pans and doesn't move the layer:** dispatch a Space keydown while
  hovering, then press on a `di-layer-box` and move. Scroll changed, and no `di-layer-change`
  fired. After keyup, the same press starts a layer drag again.
- **Space in a text field is left alone:** a keydown from an `<input>` doesn't set `pan-ready`.
- **Middle-button drag pans.**
- The existing `canvas-scroll-stability` specs, including "still scrolls when the user has
  genuinely zoomed in", still pass.

Manual, in the booted test site (see CLAUDE.md, "Driving the backoffice"): open "Article OG
image" and go to Design.
- At fit, move the mouse around the whole screen. No scrollbars appear.
- Zoom to 300%. There are no scrollbars. Drag the checkerboard, hold Space and drag over the
  image, and middle-drag: each one moves the view, and every edge of the canvas can be reached.
  Dragging a layer still moves it, and the ruler hairlines follow the pointer only over the stage.
