import { afterEach, describe, expect, it } from "vitest";
import { page } from "@vitest/browser/context";
import { mountWorkspace, resetBody, settle } from "../../testing/browser-fixtures.js";
import "./di-design-view.element.js";

/**
 * B1 - the designer canvas collapsed to zero height on narrower or shorter windows. At a
 * 1150x666 viewport `di-designer-canvas` measured 650x0: the `.centre` column was 141px tall
 * while its rows wanted toolbar 91px + canvas + preview strip 160px, and the canvas was the only
 * flexible row, so it absorbed the whole shortfall. There was no scrollbar to reveal a stage
 * either, so the designer was simply unusable.
 *
 * The viewport is driven through `page.viewport()` rather than a fixed-size container, because
 * the defect runs through `@media (max-width: 1280px)` and a container's size does not answer a
 * media query.
 */

/** Below this the stage is not a stage. The pre-fix measurements were 0px and 17px. */
const CANVAS_HEIGHT_FLOOR = 120;

/**
 * The design view never gets the whole viewport: the workspace header and view tabs sit above
 * it. Handing the spec `100vh` would hide the defect entirely - the canvas clears the floor on
 * the *old* CSS too at that size, which is exactly why the review had to measure the real app.
 * These heights are what a workspace leaves at each viewport, and the first is the one the
 * review measured `di-designer-canvas` at 650x0 in.
 */
const VIEWPORTS = [
  { width: 1150, height: 666, available: 400 },
  { width: 1280, height: 800, available: 520 },
  { width: 1536, height: 900, available: 620 },
];

async function mountDesignView(width: number, height: number, available: number) {
  await page.viewport(width, height);
  resetBody();

  const { host, cleanup } = await mountWorkspace();
  host.style.height = `${available}px`;

  const view = document.createElement("di-design-view");
  host.append(view);
  await settle(view, 4);

  return { view, cleanup };
}

afterEach(() => {
  resetBody();
});

describe("di-design-view layout", () => {
  for (const { width, height, available } of VIEWPORTS) {
    it(`keeps the canvas above ${CANVAS_HEIGHT_FLOOR}px at ${width}x${height}`, async () => {
      const { view, cleanup } = await mountDesignView(width, height, available);

      const canvas = view.shadowRoot?.querySelector("di-designer-canvas");
      expect(canvas, "the design view rendered its loading state, not the designer").toBeTruthy();

      const box = canvas!.getBoundingClientRect();
      expect(Math.round(box.height)).toBeGreaterThanOrEqual(CANVAS_HEIGHT_FLOOR);
      expect(Math.round(box.width)).toBeGreaterThan(0);

      cleanup();
    });
  }

  it("scrolls the centre column rather than crushing the canvas", async () => {
    const { view, cleanup } = await mountDesignView(1150, 666, 400);

    const centre = view.shadowRoot?.querySelector<HTMLElement>(".centre");
    expect(centre).toBeTruthy();

    // A scrollbar is the intended failure mode when the rows genuinely do not fit; a zero-height
    // stage with nothing to scroll to is not.
    expect(getComputedStyle(centre!).overflow).toBe("auto");

    // The canvas row keeps its floor even though the column is shorter than its content wants.
    const canvas = view.shadowRoot!.querySelector("di-designer-canvas")!;
    expect(Math.round(canvas.getBoundingClientRect().height)).toBeGreaterThanOrEqual(CANVAS_HEIGHT_FLOOR);

    cleanup();
  });
});
