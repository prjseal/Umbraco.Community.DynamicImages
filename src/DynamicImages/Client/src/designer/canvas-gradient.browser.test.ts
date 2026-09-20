import { afterEach, describe, expect, it } from "vitest";
import { fixedBox, resetBody, settle } from "../testing/browser-fixtures.js";
import { createGradient, createTemplate, createRectLayer } from "../models/layer-factories.js";
import type { DiGradient, DiTemplate } from "../api/types.js";
import "./di-designer-canvas.element.js";

/**
 * The fill as the editor actually sees it. jsdom computes no styles at all, so a
 * `getComputedStyle` assertion means nothing there: these belong in browser mode, against a real
 * cascade.
 */

afterEach(() => {
  resetBody();
});

async function mountCanvas(mutate: (template: DiTemplate) => void) {
  resetBody();

  const template = createTemplate("Gradient fixture");
  mutate(template);

  const canvas = document.createElement("di-designer-canvas");
  canvas.template = template;
  canvas.showRulers = false;
  fixedBox(800, 500).append(canvas);

  await settle(canvas, 4);

  return canvas;
}

const stageOf = (canvas: Element) => getComputedStyle(canvas.shadowRoot!.querySelector<HTMLElement>(".stage")!);

describe("the canvas fill on the artboard", () => {
  it("paints a linear gradient on the stage", async () => {
    const canvas = await mountCanvas((template) => {
      template.canvas.backgroundGradient = createGradient();
    });

    expect(stageOf(canvas).backgroundImage).toMatch(/^linear-gradient\(/);
  });

  it("paints a radial gradient on the stage", async () => {
    const canvas = await mountCanvas((template) => {
      template.canvas.backgroundGradient = { ...createGradient(), kind: "radial", centreX: 0.2 };
    });

    expect(stageOf(canvas).backgroundImage).toMatch(/^radial-gradient\(/);
  });

  it("leaves the stage on its colour when there is no gradient", async () => {
    // The guard that the gradient branch does not leak into the solid one.
    const canvas = await mountCanvas((template) => {
      template.canvas.background = "#112233";
    });

    const stage = stageOf(canvas);
    expect(stage.backgroundImage).toBe("none");
    expect(stage.backgroundColor).toBe("rgb(17, 34, 51)");
  });

  it("lets the viewport's checkerboard through a transparent canvas", async () => {
    const canvas = await mountCanvas((template) => {
      template.canvas.background = "#0B0F1900";
    });

    // The colour keeps its hue at alpha 0 - that is what makes switching back to Colour return
    // the same one - so it is the alpha that says the checkerboard shows through.
    const stage = stageOf(canvas);
    expect(stage.backgroundImage).toBe("none");
    expect(stage.backgroundColor).toMatch(/^rgba\(11, 15, 25, 0\)$/);
  });

  it("paints a shape layer's radial gradient with the same builder", async () => {
    const gradient: DiGradient = { ...createGradient(), kind: "radial", from: "#FF0000", to: "#0000FF" };
    const canvas = await mountCanvas((template) => {
      const shape = createRectLayer({ template, x: 200, y: 150 });
      shape.gradient = gradient;
      template.layers = [shape];
    });

    const box = canvas.shadowRoot!.querySelector("di-layer-box")!;
    await settle(box, 2);

    const shape = box.shadowRoot!.querySelector<HTMLElement>(".shape")!;
    expect(getComputedStyle(shape).backgroundImage).toMatch(/^radial-gradient\(/);
  });
});
