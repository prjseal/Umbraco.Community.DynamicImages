import { afterEach, describe, expect, it } from "vitest";
import { fixedBox, resetBody, settle } from "../testing/browser-fixtures.js";
import { createTemplate, createTextLayer } from "../models/layer-factories.js";
import "./di-designer-canvas.element.js";

/**
 * Grabbing the canvas and moving it: Space + drag, middle-button drag, and a drag on the bare
 * checkerboard around the artboard. Panning sets the viewport's scroll position, so these are
 * browser-mode specs - jsdom neither lays out nor scrolls.
 */

afterEach(() => {
  resetBody();
});

async function mountZoomedCanvas() {
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
  canvas.zoom = 3;
  box.append(canvas);

  await settle(canvas, 4);

  const viewport = canvas.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
  const layerBox = canvas.shadowRoot!.querySelector("di-layer-box")!.shadowRoot!.querySelector<HTMLElement>(".box")!;

  return { canvas, viewport, layerBox, events };
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

describe("di-designer-canvas panning", () => {
  it("pans by dragging the bare checkerboard", async () => {
    const { canvas, viewport, events } = await mountZoomedCanvas();
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;

    drag(viewport, -100, -80);
    await settle(canvas, 1);

    expect(viewport.scrollLeft).toBe(100);
    expect(viewport.scrollTop).toBe(80);
    expect(events).toEqual([]);
  });

  it("pans with Space + drag over a layer without moving it, and drags the layer again after", async () => {
    const { canvas, viewport, layerBox, events } = await mountZoomedCanvas();
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;

    hover(viewport);
    key("keydown");
    await settle(canvas, 1);
    expect(viewport.classList.contains("pan-ready")).toBe(true);

    drag(layerBox, -100, -80);
    await settle(canvas, 1);

    expect(viewport.scrollLeft).toBe(100);
    expect(viewport.scrollTop).toBe(80);
    expect(events).toEqual([]);

    key("keyup");
    await settle(canvas, 1);
    expect(viewport.classList.contains("pan-ready")).toBe(false);

    drag(layerBox, 50, 40);
    await settle(canvas, 1);

    expect(viewport.scrollLeft).toBe(100);
    expect(events).toContain("di-transaction-begin");
    expect(events).toContain("di-layer-change");
  });

  it("pans with a middle-button drag, even over a layer", async () => {
    const { canvas, viewport, layerBox, events } = await mountZoomedCanvas();
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;

    drag(layerBox, -60, -40, 1);
    await settle(canvas, 1);

    expect(viewport.scrollLeft).toBe(60);
    expect(viewport.scrollTop).toBe(40);
    expect(events).toEqual([]);
  });

  it("leaves Space alone when it is typed into a field", async () => {
    const { canvas, viewport } = await mountZoomedCanvas();
    const input = document.createElement("input");
    document.body.append(input);

    hover(viewport);
    key("keydown", input);
    await settle(canvas, 1);

    expect(viewport.classList.contains("pan-ready")).toBe(false);
  });

  it("ignores Space while the pointer is elsewhere", async () => {
    const { canvas, viewport } = await mountZoomedCanvas();

    key("keydown");
    await settle(canvas, 1);

    expect(viewport.classList.contains("pan-ready")).toBe(false);
  });
});
