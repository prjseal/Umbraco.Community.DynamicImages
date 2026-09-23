import { afterEach, describe, expect, it } from "vitest";
import { resetBody, settle } from "../testing/browser-fixtures.js";
import { ZOOM_BOUNDS } from "../inputs/number-bounds.js";
import "./di-canvas-toolbar.element.js";

/**
 * The zoom control looked like it had no "-" button. It had one - its icon was `icon-remove`,
 * which in Umbraco 17 resolves to lucide-trash-2, a wastebasket. The control read [bin] 27% [+].
 *
 * `icon-contract.test.ts` catches a name the registry does not *have*; only an assertion on the
 * rendered name catches a name it has under the wrong picture, which is this one's job.
 *
 * The percentage is also a typeable input now rather than a span, so what it accepts, clamps and
 * emits is pinned here too.
 */

afterEach(() => {
  resetBody();
});

async function mountToolbar(effectiveScale = 1) {
  resetBody();

  const events: { zoom: number }[] = [];
  const toolbar = document.createElement("di-canvas-toolbar");
  toolbar.effectiveScale = effectiveScale;
  toolbar.addEventListener("di-zoom-change", (event) => {
    events.push((event as CustomEvent<{ zoom: number }>).detail);
  });
  document.body.append(toolbar);

  await settle(toolbar, 2);

  return { toolbar, events };
}

/**
 * The percentage field and the input inside it. Looked up on demand rather than in the mount, so
 * that the icon specs fail on the icon they are about instead of on a field they never touch.
 */
async function fieldOf(toolbar: HTMLElement) {
  const field = toolbar.shadowRoot!.querySelector("di-number-field");
  expect(field, "the toolbar has no di-number-field: the percentage is not typeable").toBeTruthy();

  await settle(field!, 1);

  return { field: field!, input: field!.shadowRoot!.querySelector<HTMLInputElement>("input")! };
}

function buttonLabelled(toolbar: HTMLElement, label: string): HTMLElement {
  return toolbar.shadowRoot!.querySelector<HTMLElement>(`uui-button[label="${label}"]`)!;
}

function iconNameOf(button: HTMLElement): string | null {
  return button.querySelector("uui-icon")!.getAttribute("name");
}

/** uui-button overrides `click()` into a no-op, so press it the way a pointer does. */
function press(button: HTMLElement) {
  button.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
}

/**
 * Types into the field and commits, the way a user pressing Enter or tabbing away does.
 *
 * `composed: false` is not incidental: a native `change` does not cross a shadow boundary, so the
 * only `change` the toolbar ever sees is the one di-number-field re-dispatches with a detail.
 */
function type(input: HTMLInputElement, text: string) {
  input.value = text;
  input.dispatchEvent(new Event("change", { bubbles: true, composed: false }));
}

describe("di-canvas-toolbar zoom controls", () => {
  it("draws the zoom-out button with a magnifier, not a wastebasket", async () => {
    const { toolbar } = await mountToolbar();

    const zoomOut = buttonLabelled(toolbar, "Zoom out");
    expect(zoomOut, "there is no button labelled Zoom out").toBeTruthy();

    // icon-remove is lucide-trash-2 in Umbraco 17. Any other bin would fail here just as loudly;
    // that the name is one the registry has is asserted by icon-contract.test.ts.
    expect(iconNameOf(zoomOut)).not.toBe("icon-remove");
    expect(iconNameOf(zoomOut)).toBe("icon-zoom-out");
  });

  it("pairs it with a matching zoom-in magnifier", async () => {
    const { toolbar } = await mountToolbar();

    expect(iconNameOf(buttonLabelled(toolbar, "Zoom in"))).toBe("icon-zoom-in");
  });

  /**
   * A "Zoom" caption above the field pushed it ~20px below the buttons either side, which read
   * as broken. The three are one segmented control now: same top, same bottom, edge to edge.
   */
  it("lines the field up with the buttons as one segmented control", async () => {
    const { toolbar } = await mountToolbar(0.27);
    const { field } = await fieldOf(toolbar);

    const out = buttonLabelled(toolbar, "Zoom out").getBoundingClientRect();
    const box = field.shadowRoot!.querySelector(".input")!.getBoundingClientRect();
    const zoomIn = buttonLabelled(toolbar, "Zoom in").getBoundingClientRect();

    expect(box.height).toBeGreaterThan(20);
    for (const button of [out, zoomIn]) {
      expect(Math.abs(button.top - box.top), "tops differ").toBeLessThan(1);
      expect(Math.abs(button.bottom - box.bottom), "bottoms differ").toBeLessThan(1);
    }
    expect(Math.abs(out.right - box.left), "gap before the field").toBeLessThan(1);
    expect(Math.abs(box.right - zoomIn.left), "gap after the field").toBeLessThan(1);

    expect(field.shadowRoot!.textContent, "no visible caption above the number").not.toContain("Zoom");
    expect(field.shadowRoot!.querySelector("input")!.getAttribute("aria-label")).toBe("Zoom");
  });

  it("steps out and in from the effective scale", async () => {
    const { toolbar, events } = await mountToolbar(0.4);

    press(buttonLabelled(toolbar, "Zoom out"));
    expect(events.at(-1)!.zoom).toBeCloseTo(0.4 / 1.25, 6);

    press(buttonLabelled(toolbar, "Zoom in"));
    expect(events.at(-1)!.zoom).toBeCloseTo(0.4 * 1.25, 6);
  });

  it("shows the effective scale as a percentage in the field", async () => {
    const { toolbar } = await mountToolbar(0.27);
    const { input } = await fieldOf(toolbar);

    expect(input.value).toBe("27");
  });

  it("zooms to a typed percentage", async () => {
    const { toolbar, events } = await mountToolbar(0.27);
    const { input } = await fieldOf(toolbar);

    type(input, "50");

    expect(events).toHaveLength(1);
    expect(events[0].zoom).toBeCloseTo(0.5, 6);
  });

  it("clamps a typed percentage to the zoom bounds", async () => {
    const { toolbar, events } = await mountToolbar(0.27);
    const { input } = await fieldOf(toolbar);

    type(input, "900");
    expect(events.at(-1)!.zoom).toBeCloseTo(ZOOM_BOUNDS.max, 6);
    expect(input.value, "the field must show what was actually applied").toBe("400");

    type(input, "1");
    expect(events.at(-1)!.zoom).toBeCloseTo(ZOOM_BOUNDS.min, 6);
    expect(input.value).toBe("10");
  });

  it("emits nothing for a value that is not a zoom", async () => {
    const { toolbar, events } = await mountToolbar(0.27);
    const { input } = await fieldOf(toolbar);

    // A number input sanitises letters to "" on its own, so this is the emptied-field path: a
    // blank zoom is not a zoom, and it must not be sent on as one.
    type(input, "abc");

    expect(events).toEqual([]);
  });

  it("does not overwrite the field while it is being typed into", async () => {
    const { toolbar } = await mountToolbar(0.27);
    const { field, input } = await fieldOf(toolbar);

    input.focus();
    input.value = "150";

    // The canvas re-announces its scale on every resize and on every drag that reflows an
    // auto-height layer, and each one re-renders the toolbar.
    toolbar.effectiveScale = 0.33;
    await settle(toolbar, 2);
    await settle(field, 1);

    expect(input.value).toBe("150");
  });

  it("resyncs the field once focus leaves it", async () => {
    const { toolbar } = await mountToolbar(0.27);
    const { field, input } = await fieldOf(toolbar);

    input.focus();
    input.value = "150";

    toolbar.effectiveScale = 0.33;
    input.blur();
    await settle(toolbar, 2);
    await settle(field, 1);

    expect(input.value).toBe("33");
  });
});
