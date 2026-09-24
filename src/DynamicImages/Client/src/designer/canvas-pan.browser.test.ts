import { afterEach, describe, expect, it } from "vitest";
import { fixedBox, resetBody, settle } from "../testing/browser-fixtures.js";
import { createTemplate, createTextLayer } from "../models/layer-factories.js";
import "./di-designer-canvas.element.js";

/**
 * Grabbing the canvas and moving it anywhere: Space + drag, middle-button drag, a drag on the bare
 * checkerboard around the artboard, and the wheel. Panning translates the artboard, so these are
 * browser-mode specs that measure where the stage actually lands on screen.
 */

/** Must match PAN_MIN_VISIBLE in the canvas. */
const MIN_VISIBLE = 48;

afterEach(() => {
  resetBody();
});

async function mountCanvas(zoom?: number) {
  resetBody();

  const box = fixedBox(400, 300);
  const events: string[] = [];
  for (const name of ["di-layer-select", "di-transaction-begin", "di-layer-change"]) {
    box.addEventListener(name, () => events.push(name));
  }

  const template = createTemplate("Pan fixture");
  const layer = createTextLayer({ template, x: 100, y: 100 }, "Title", { kind: "static", text: "Title" });

  const canvas = document.createElement("di-designer-canvas");
  canvas.template = { ...template, layers: [layer] };
  canvas.showRulers = true;
  canvas.zoom = zoom;
  box.append(canvas);

  await settle(canvas, 4);

  const viewport = canvas.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
  const stage = canvas.shadowRoot!.querySelector<HTMLElement>(".stage")!;
  const layerBox = canvas.shadowRoot!.querySelector("di-layer-box")!.shadowRoot!.querySelector<HTMLElement>(".box")!;

  return { canvas, viewport, stage, layerBox, events };
}

function pointer(type: string, target: EventTarget, clientX: number, clientY: number, button = 0) {
  target.dispatchEvent(
    new PointerEvent(type, {
      clientX,
      clientY,
      button,
      buttons: button === 1 ? 4 : 1,
      pointerId: 1,
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  );
}

/** Press on `target`, move by (dx, dy), release. */
function drag(target: EventTarget, dx: number, dy: number, button = 0) {
  pointer("pointerdown", target, 200, 150, button);
  pointer("pointermove", window, 200 + dx / 2, 150 + dy / 2, button);
  pointer("pointermove", window, 200 + dx, 150 + dy, button);
  pointer("pointerup", window, 200 + dx, 150 + dy, button);
}

function key(type: "keydown" | "keyup", target: EventTarget = window) {
  target.dispatchEvent(new KeyboardEvent(type, { key: " ", code: "Space", bubbles: true, composed: true, cancelable: true }));
}

function hover(viewport: HTMLElement) {
  viewport.dispatchEvent(new PointerEvent("pointerenter", { pointerId: 1 }));
}

function at(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.top };
}

describe("di-designer-canvas panning", () => {
  it("moves the canvas at fit, where there is nothing to scroll", async () => {
    const { canvas, viewport, stage, events } = await mountCanvas();
    const before = at(stage);

    drag(viewport, 150, 100);
    await settle(canvas, 1);

    expect(at(stage)).toEqual({ x: before.x + 150, y: before.y + 100 });
    expect(events).toEqual([]);
  });

  it("pans a zoomed-in canvas past any edge, to its top-left and beyond", async () => {
    const { canvas, viewport, stage } = await mountCanvas(3);
    const view = viewport.getBoundingClientRect();
    const before = at(stage);

    // Zoomed in and centred, the stage's top-left is well off the viewport's top-left.
    expect(before.x).toBeLessThan(view.left);

    const dx = view.left + 100 - before.x;
    const dy = view.top + 80 - before.y;
    drag(viewport, dx, dy);
    await settle(canvas, 1);

    // Past the corner, with checkerboard showing above and left of the canvas.
    expect(at(stage).x).toBeCloseTo(view.left + 100, 0);
    expect(at(stage).y).toBeCloseTo(view.top + 80, 0);
  });

  it("always leaves a strip of the canvas in view", async () => {
    const { canvas, viewport, stage } = await mountCanvas();
    const view = viewport.getBoundingClientRect();
    const artboard = canvas.shadowRoot!.querySelector<HTMLElement>(".artboard")!;

    drag(viewport, 5000, 5000);
    await settle(canvas, 1);

    const moved = artboard.getBoundingClientRect();
    expect(moved.left).toBeCloseTo(view.right - MIN_VISIBLE, 0);
    expect(moved.top).toBeCloseTo(view.bottom - MIN_VISIBLE, 0);

    drag(viewport, -10000, -10000);
    await settle(canvas, 1);

    expect(artboard.getBoundingClientRect().right).toBeCloseTo(view.left + MIN_VISIBLE, 0);
    expect(stage.getBoundingClientRect().bottom).toBeCloseTo(view.top + MIN_VISIBLE, 0);
  });

  it("pans with Space + drag over a layer without moving it, and drags the layer again after", async () => {
    const { canvas, viewport, stage, layerBox, events } = await mountCanvas(3);
    const before = at(stage);

    hover(viewport);
    key("keydown");
    await settle(canvas, 1);
    expect(viewport.classList.contains("pan-ready")).toBe(true);

    drag(layerBox, -100, -80);
    await settle(canvas, 1);

    expect(at(stage)).toEqual({ x: before.x - 100, y: before.y - 80 });
    expect(events).toEqual([]);

    key("keyup");
    await settle(canvas, 1);
    expect(viewport.classList.contains("pan-ready")).toBe(false);

    drag(layerBox, 50, 40);
    await settle(canvas, 1);

    expect(at(stage)).toEqual({ x: before.x - 100, y: before.y - 80 });
    expect(events).toContain("di-transaction-begin");
    expect(events).toContain("di-layer-change");
  });

  it("pans with a middle-button drag, even over a layer", async () => {
    const { canvas, stage, layerBox, events } = await mountCanvas(3);
    const before = at(stage);

    drag(layerBox, -60, -40, 1);
    await settle(canvas, 1);

    expect(at(stage)).toEqual({ x: before.x - 60, y: before.y - 40 });
    expect(events).toEqual([]);
  });

  it("pans with the wheel, and zooms with Ctrl + wheel", async () => {
    const { canvas, viewport, stage } = await mountCanvas(3);
    const before = at(stage);
    const zooms: number[] = [];
    canvas.addEventListener("di-zoom-change", (event) => zooms.push((event as CustomEvent).detail.zoom));

    viewport.dispatchEvent(new WheelEvent("wheel", { deltaX: 30, deltaY: 50, bubbles: true, cancelable: true }));
    await settle(canvas, 1);

    expect(at(stage)).toEqual({ x: before.x - 30, y: before.y - 50 });
    expect(zooms).toEqual([]);

    viewport.dispatchEvent(new WheelEvent("wheel", { deltaY: -50, ctrlKey: true, bubbles: true, cancelable: true }));
    expect(zooms).toHaveLength(1);
  });

  it("comes back to the middle on Fit, whether or not the zoom changes", async () => {
    const { canvas, viewport, stage } = await mountCanvas(3);

    drag(viewport, 120, 90);
    canvas.zoom = undefined;
    await settle(canvas, 2);
    const centred = at(stage);

    drag(viewport, 120, 90);
    await settle(canvas, 1);
    expect(at(stage)).not.toEqual(centred);

    canvas.recentre();
    await settle(canvas, 1);
    expect(at(stage)).toEqual(centred);
  });

  it("leaves Space alone when it is typed into a field", async () => {
    const { canvas, viewport } = await mountCanvas(3);
    const input = document.createElement("input");
    document.body.append(input);

    hover(viewport);
    key("keydown", input);
    await settle(canvas, 1);

    expect(viewport.classList.contains("pan-ready")).toBe(false);
  });

  it("ignores Space while the pointer is elsewhere", async () => {
    const { canvas, viewport } = await mountCanvas(3);

    key("keydown");
    await settle(canvas, 1);

    expect(viewport.classList.contains("pan-ready")).toBe(false);
  });
});
