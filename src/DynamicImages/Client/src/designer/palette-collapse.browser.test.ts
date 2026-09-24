import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { page } from "@vitest/browser/context";
import { mountWorkspace, resetBody, settle } from "../testing/browser-fixtures.js";
import { PALETTE_COLLAPSED_KEY } from "../workspace/views/ui-prefs.js";
import "./di-property-palette.element.js";
import "../workspace/views/di-design-view.element.js";

/**
 * The Elements palette always took its 250px column, however little the editor used it. It folds
 * to a 40px rail now, the canvas gets the difference, and the choice is remembered per browser.
 */

/** The pre-fix measurements `design-view-layout.browser.test.ts` guards were 0px and 17px. */
const CANVAS_HEIGHT_FLOOR = 120;

function button(root: ParentNode, label: string): HTMLElement {
  const found = root.querySelector<HTMLElement>(`uui-button[label="${label}"]`);
  expect(found, `no "${label}" button`).toBeTruthy();
  return found!;
}

beforeEach(() => {
  localStorage.removeItem(PALETTE_COLLAPSED_KEY);
});

afterEach(() => {
  localStorage.removeItem(PALETTE_COLLAPSED_KEY);
  resetBody();
});

describe("di-property-palette collapsing", () => {
  async function mountPalette(collapsed = false) {
    resetBody();
    const palette = document.createElement("di-property-palette");
    palette.collapsed = collapsed;
    document.body.append(palette);
    await settle(palette, 2);
    return palette;
  }

  it("asks to collapse from its header, and leaves the state to its owner", async () => {
    const palette = await mountPalette();
    const toggles: { collapsed: boolean }[] = [];
    palette.addEventListener("di-palette-toggle", (event) => toggles.push((event as CustomEvent).detail));

    const collapse = button(palette.shadowRoot!, "Collapse the elements panel");
    expect(collapse.querySelector("uui-icon")!.getAttribute("name")).toBe("icon-navigation-left");

    collapse.click();
    await settle(palette, 1);

    expect(toggles).toEqual([{ collapsed: true }]);
    expect(palette.collapsed).toBe(false);
  });

  it("renders only a rail with an expand button when collapsed", async () => {
    const palette = await mountPalette(true);
    const toggles: { collapsed: boolean }[] = [];
    palette.addEventListener("di-palette-toggle", (event) => toggles.push((event as CustomEvent).detail));

    expect(palette.hasAttribute("collapsed")).toBe(true);
    expect(palette.shadowRoot!.querySelectorAll(".chip").length).toBe(0);
    expect(palette.shadowRoot!.querySelector("uui-input")).toBeNull();

    const expand = button(palette.shadowRoot!, "Expand the elements panel");
    expect(expand.querySelector("uui-icon")!.getAttribute("name")).toBe("icon-navigation-right");

    expand.click();
    await settle(palette, 1);
    expect(toggles).toEqual([{ collapsed: false }]);
  });
});

describe("di-design-view with the palette collapsed", () => {
  async function mountDesignView() {
    await page.viewport(1536, 900);
    resetBody();

    const { host, cleanup } = await mountWorkspace();
    // What a workspace leaves of a 1536x900 viewport - see design-view-layout.browser.test.ts.
    host.style.height = "620px";

    const view = document.createElement("di-design-view");
    host.append(view);
    await settle(view, 4);

    return { view, cleanup };
  }

  it("gives the canvas the palette's column, keeps the canvas floor, and remembers it", async () => {
    const { view, cleanup } = await mountDesignView();

    const palette = view.shadowRoot!.querySelector("di-property-palette")!;
    const canvas = view.shadowRoot!.querySelector("di-designer-canvas")!;
    expect(canvas, "the design view rendered its loading state, not the designer").toBeTruthy();

    const paletteBefore = palette.getBoundingClientRect().width;
    const canvasBefore = canvas.getBoundingClientRect().width;
    expect(paletteBefore).toBeGreaterThan(200);

    button(palette.shadowRoot!, "Collapse the elements panel").click();
    await settle(view, 4);

    expect(palette.collapsed).toBe(true);
    expect(palette.getBoundingClientRect().width).toBeLessThanOrEqual(40);
    expect(canvas.getBoundingClientRect().width).toBeGreaterThan(canvasBefore + 150);
    expect(Math.round(canvas.getBoundingClientRect().height)).toBeGreaterThanOrEqual(CANVAS_HEIGHT_FLOOR);
    expect(localStorage.getItem(PALETTE_COLLAPSED_KEY)).toBe("true");

    cleanup();
  });

  it("starts collapsed when the browser remembers it that way", async () => {
    localStorage.setItem(PALETTE_COLLAPSED_KEY, "true");
    const { view, cleanup } = await mountDesignView();

    const palette = view.shadowRoot!.querySelector("di-property-palette")!;
    expect(palette.collapsed).toBe(true);
    expect(palette.getBoundingClientRect().width).toBeLessThanOrEqual(40);

    button(palette.shadowRoot!, "Expand the elements panel").click();
    await settle(view, 4);

    expect(palette.collapsed).toBe(false);
    expect(localStorage.getItem(PALETTE_COLLAPSED_KEY)).toBeNull();

    cleanup();
  });
});
