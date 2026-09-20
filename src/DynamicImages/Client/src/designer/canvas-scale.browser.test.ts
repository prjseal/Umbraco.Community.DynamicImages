import { afterEach, describe, expect, it } from "vitest";
import { fixedBox, resetBody, settle } from "../testing/browser-fixtures.js";
import { createTemplate } from "../models/layer-factories.js";
import "./di-designer-canvas.element.js";
import "./di-canvas-toolbar.element.js";

/**
 * B3 - the toolbar read 100% while the stage measured 326x171 for a 1200x630 canvas, an actual
 * scale of about 27%. The stage is *sized* to fit rather than transformed, so `zoom` being unset
 * means "fit", and the toolbar was reading `zoom ?? 1`. The canvas now announces its effective
 * scale through `di-scale-change`, which is the only place that number is known.
 */

afterEach(() => {
  resetBody();
});

async function mountCanvas(boxWidth: number, boxHeight: number) {
  resetBody();

  const scales: number[] = [];
  const box = fixedBox(boxWidth, boxHeight);
  box.addEventListener("di-scale-change", (event) => {
    scales.push((event as CustomEvent<{ scale: number }>).detail.scale);
  });

  const canvas = document.createElement("di-designer-canvas");
  canvas.template = createTemplate("Scale fixture");
  canvas.showRulers = false;
  box.append(canvas);

  await settle(canvas, 4);

  return { canvas, scales };
}

describe("di-designer-canvas scale reporting", () => {
  it("announces the scale the stage is actually drawn at", async () => {
    const { canvas, scales } = await mountCanvas(400, 300);

    expect(scales.length, "the canvas never announced a scale").toBeGreaterThan(0);

    const stage = canvas.shadowRoot!.querySelector<HTMLElement>(".stage")!;
    const measured = stage.getBoundingClientRect().width / canvas.template.canvas.width;

    expect(scales[scales.length - 1]).toBeCloseTo(measured, 2);

    // The whole point: fitting a 1200px canvas into a 400px box is nothing like 100%.
    expect(scales[scales.length - 1]).toBeLessThan(0.5);
  });

  it("announces a new scale when zoom is set explicitly", async () => {
    const { canvas, scales } = await mountCanvas(400, 300);
    const before = scales.length;

    canvas.zoom = 0.75;
    await settle(canvas, 3);

    expect(scales.length).toBeGreaterThan(before);
    expect(scales[scales.length - 1]).toBe(0.75);
  });

  it("the toolbar renders the effective scale, not the zoom", async () => {
    resetBody();

    const toolbar = document.createElement("di-canvas-toolbar");
    toolbar.effectiveScale = 0.27;
    document.body.append(toolbar);
    await settle(toolbar, 2);

    const readout = toolbar.shadowRoot!.querySelector<HTMLElement>(".value")!;
    expect(readout.textContent?.trim()).toBe("27%");
  });
});
