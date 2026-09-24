import { afterEach, describe, expect, it, vi } from "vitest";
import { fixedBox, resetBody, settle } from "../testing/browser-fixtures.js";
import { createTemplate } from "../models/layer-factories.js";
import "./di-designer-canvas.element.js";

/**
 * The x and y scrollbars flickered while interacting with the canvas.
 *
 * `#recomputeFit()` measured `.viewport` - the `overflow: auto` box whose scrollbar the artboard it
 * sizes is what causes. Overflow shrank the measurement by the scrollbar's width, which shrank the
 * fit, which shrank the artboard, which cleared the overflow, which grew the measurement back. The
 * `> 0.001` guard was the only damping, and a 15px scrollbar on a 1200px canvas moves the fit by
 * about 0.0125 - an order of magnitude over it.
 *
 * Compounding it, at fit the artboard was sized to *exactly* the viewport's content box, so
 * sub-pixel layout rounding decided which side of the overflow threshold it landed on.
 *
 * These specs are browser-mode because they are entirely about layout, and jsdom does none.
 */

/** Both padding edges of `.viewport`, which is `padding: 24px; box-sizing: border-box`. */
const VIEWPORT_PADDING = 48;

afterEach(() => {
  resetBody();
});

async function mountCanvas(boxWidth: number, boxHeight: number, showRulers = false) {
  resetBody();

  const scales: number[] = [];
  const box = fixedBox(boxWidth, boxHeight);
  box.addEventListener("di-scale-change", (event) => {
    scales.push((event as CustomEvent<{ scale: number }>).detail.scale);
  });

  const canvas = document.createElement("di-designer-canvas");
  canvas.template = createTemplate("Scroll fixture");
  canvas.showRulers = showRulers;
  box.append(canvas);

  await settle(canvas, 4);

  return { canvas, scales };
}

function viewportOf(canvas: HTMLElement): HTMLElement {
  return canvas.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
}

function artboardOf(canvas: HTMLElement): HTMLElement {
  return canvas.shadowRoot!.querySelector<HTMLElement>(".artboard")!;
}

/**
 * Headless Chromium may render overlay scrollbars, which take no space at all - and a spec whose
 * premise is "the viewport gained a scrollbar" would then pass without ever testing anything.
 * Defining `::-webkit-scrollbar` switches Chromium to a custom scrollbar that does occupy space.
 * Every spec that relies on it asserts the premise before asserting the fix.
 */
function giveScrollbarsWidth(canvas: HTMLElement) {
  // The canvas hides its scrollbars, and a non-auto `scrollbar-width` makes Chromium ignore
  // `::-webkit-scrollbar` altogether - so both are undone here, or the premise never holds. The
  // doubled class is for specificity: the element's own adopted stylesheet cascades after any
  // <style> in its shadow root, so an equally specific rule here would lose.
  const style = document.createElement("style");
  style.textContent = `
    .viewport.viewport { scrollbar-width: auto; }
    .viewport.viewport::-webkit-scrollbar { display: block; width: 15px; height: 15px; }
    .viewport.viewport::-webkit-scrollbar-thumb { background: #888; }
  `;
  canvas.shadowRoot!.append(style);
}

function hairlinesOf(canvas: HTMLElement): NodeListOf<Element> {
  const rulers = canvas.shadowRoot!.querySelector("di-rulers")!;
  return rulers.shadowRoot!.querySelectorAll(".hairline");
}

function stageOf(canvas: HTMLElement): HTMLElement {
  return canvas.shadowRoot!.querySelector<HTMLElement>(".stage")!;
}

function moveTo(clientX: number, clientY: number) {
  window.dispatchEvent(new PointerEvent("pointermove", { clientX, clientY, pointerId: 1, bubbles: true }));
}

/** Forces the viewport to overflow with something the fit calculation has no say over. */
function forceOverflow(canvas: HTMLElement) {
  const spacer = document.createElement("div");
  spacer.style.cssText = "width:3000px;height:3000px;flex:0 0 auto;";
  viewportOf(canvas).append(spacer);
}

describe("di-designer-canvas scroll stability", () => {
  it("does not re-fit when the viewport gains a scrollbar", async () => {
    const { canvas } = await mountCanvas(400, 300);
    giveScrollbarsWidth(canvas);

    const viewport = viewportOf(canvas);
    const before = canvas.scale;

    // Force a scrollbar the fit must not see. The canvas has to measure the space it was *given*,
    // not what is left over once its own content has decided to overflow - otherwise the two
    // chase each other and both scrollbars flicker.
    forceOverflow(canvas);
    canvas.requestUpdate();
    await settle(canvas, 6);

    expect(
      viewport.clientWidth,
      "premise failed: the viewport's scrollbar takes no space, so this spec would pass vacuously",
    ).toBeLessThan(viewport.offsetWidth);

    expect(canvas.scale).toBe(before);
  });

  it("sizes the artboard strictly inside the viewport's content box, not level with it", async () => {
    const { canvas } = await mountCanvas(400, 300);

    const viewport = viewportOf(canvas);
    const artboard = artboardOf(canvas);

    // Dead level with the overflow threshold is what let sub-pixel rounding tip an axis over,
    // and a vertical scrollbar stealing width tips the horizontal axis, which steals height.
    expect(artboard.getBoundingClientRect().width).toBeLessThan(viewport.clientWidth - VIEWPORT_PADDING);
    expect(artboard.getBoundingClientRect().height).toBeLessThan(viewport.clientHeight - VIEWPORT_PADDING);
  });

  it("settles on one scale after a viewport size change", async () => {
    const { canvas, scales } = await mountCanvas(400, 300);
    giveScrollbarsWidth(canvas);

    const box = canvas.parentElement as HTMLElement;
    scales.length = 0;

    box.style.width = "520px";
    box.style.height = "360px";

    for (let frame = 0; frame < 20; frame++) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    // The tail must hold still. Whether this one *fails* pre-fix depends on the geometry landing
    // on the rounding boundary, so it supports the two above rather than standing on its own.
    const tail = scales.slice(-4);
    expect(new Set(tail).size).toBeLessThanOrEqual(1);
  });

  it("still scrolls when the user has genuinely zoomed in", async () => {
    const { canvas } = await mountCanvas(400, 300);
    giveScrollbarsWidth(canvas);

    canvas.zoom = 3;
    await settle(canvas, 6);

    // The cure for flicker must not be suppressing scrolling: past fit, both bars appear and stay.
    const viewport = viewportOf(canvas);
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
  });

  /**
   * A different flicker: the canvas tracked the pointer across the whole window, so with the
   * pointer right of or below the stage the ruler hairline sat past the end of its ruler and
   * became scrollable overflow. Both scrollbars appeared, and vanished again on the way back.
   */
  it("does not overflow when the pointer is off the canvas", async () => {
    const { canvas } = await mountCanvas(400, 300, true);
    const viewport = viewportOf(canvas);

    moveTo(2000, 2000);
    await settle(canvas, 2);

    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.clientHeight);
    expect(hairlinesOf(canvas)).toHaveLength(0);

    const stage = stageOf(canvas).getBoundingClientRect();
    moveTo(stage.left + stage.width / 2, stage.top + stage.height / 2);
    await settle(canvas, 2);

    expect(hairlinesOf(canvas)).toHaveLength(2);
  });

  it("does not re-render for pointer moves off the canvas", async () => {
    const { canvas } = await mountCanvas(400, 300, true);
    const render = vi.spyOn(canvas, "render");

    moveTo(2000, 2000);
    await settle(canvas, 1);
    moveTo(2100, 2100);
    await settle(canvas, 1);

    expect(render).not.toHaveBeenCalled();
  });

  it("can reach the top-left of a zoomed-in canvas", async () => {
    const { canvas } = await mountCanvas(400, 300, true);

    canvas.zoom = 3;
    await settle(canvas, 4);

    const viewport = viewportOf(canvas);
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
    await settle(canvas, 1);

    // Flex centring pushed the overflow off both edges, and only the right and bottom can be
    // scrolled to - so at scroll 0 the stage started somewhere left of and above the viewport.
    const stage = stageOf(canvas).getBoundingClientRect();
    const box = viewport.getBoundingClientRect();
    expect(stage.left).toBeGreaterThanOrEqual(box.left);
    expect(stage.top).toBeGreaterThanOrEqual(box.top);
  });
});
