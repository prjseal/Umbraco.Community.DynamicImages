import { afterEach, describe, expect, it } from "vitest";
import { fixedBox, resetBody, settle, templateWithLayers } from "../testing/browser-fixtures.js";
import "./di-layers-panel.element.js";

/**
 * B2 - the layers panel was `max-height: 40%`, a percentage resolved against the grid row it had
 * already been given. So 60% of its own allotment was guaranteed waste: the review measured a
 * 92px panel in a 228.8px row, with 137px of empty grey beneath it and the list clipped mid-row.
 * The same rule clipped the empty-state sentence on a new template.
 */

/** Mounts the panel into a `.side`-shaped grid, which is what it sits in for real. */
async function mountPanel(layerCount: number, rowHeight: number) {
  resetBody();

  const side = fixedBox(340, rowHeight);
  // The real side column is `grid-template-rows: 1fr auto` with the inspector above.
  side.style.gridTemplateRows = "1fr auto";

  const inspectorStandIn = document.createElement("div");
  side.append(inspectorStandIn);

  const panel = document.createElement("di-layers-panel");
  panel.layers = templateWithLayers(layerCount).layers;
  // Sizing is about the open list; the panel starts collapsed.
  panel.expanded = true;
  side.append(panel);

  await settle(panel, 3);

  return { side, panel };
}

afterEach(() => {
  resetBody();
});

describe("di-layers-panel sizing", () => {
  it("uses the row it is given rather than 40% of it", async () => {
    const { panel } = await mountPanel(5, 480);

    const panelBox = panel.getBoundingClientRect();
    const inner = panel.shadowRoot!.querySelector<HTMLElement>(".panel")!;

    // Every row must be reachable: the last one's bottom sits inside the panel's own box.
    const rows = [...panel.shadowRoot!.querySelectorAll<HTMLElement>(".row")];
    expect(rows.length).toBeGreaterThan(0);

    const lastRowBottom = rows[rows.length - 1].getBoundingClientRect().bottom;
    expect(lastRowBottom).toBeLessThanOrEqual(panelBox.bottom + 1);

    // And nothing is clipped away unreachably - the content either fits or scrolls.
    expect(inner.scrollHeight).toBeLessThanOrEqual(inner.clientHeight + 1);
  });

  it("does not clip the empty state on a new template", async () => {
    const { panel } = await mountPanel(0, 480);

    const empty = panel.shadowRoot!.querySelector<HTMLElement>(".empty");
    expect(empty, "the empty state did not render").toBeTruthy();

    // The whole sentence, not the top half of it.
    expect(empty!.scrollHeight).toBeLessThanOrEqual(empty!.clientHeight + 1);
    expect(empty!.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      panel.getBoundingClientRect().bottom + 1,
    );
  });
});

describe("di-layers-panel collapsing", () => {
  it("starts collapsed, showing only its header", async () => {
    resetBody();
    const panel = document.createElement("di-layers-panel");
    panel.layers = templateWithLayers(3).layers;
    document.body.append(panel);
    await settle(panel, 3);

    const toggle = panel.shadowRoot!.querySelector<HTMLButtonElement>(".toggle")!;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel.shadowRoot!.querySelectorAll(".row").length).toBe(0);

    toggle.click();
    await settle(panel, 3);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    // Three layers plus the Background row.
    expect(panel.shadowRoot!.querySelectorAll(".row").length).toBe(4);
  });

  // The panel is docked at the bottom and grows upwards, so up opens it and down closes it -
  // the same convention as the preview strip beside it.
  it("points its chevron up when collapsed and down when expanded", async () => {
    resetBody();
    const panel = document.createElement("di-layers-panel");
    panel.layers = templateWithLayers(3).layers;
    document.body.append(panel);
    await settle(panel, 3);

    const icon = () => panel.shadowRoot!.querySelector(".toggle uui-icon")!.getAttribute("name");
    expect(icon()).toBe("icon-navigation-up");

    panel.shadowRoot!.querySelector<HTMLButtonElement>(".toggle")!.click();
    await settle(panel, 3);

    expect(icon()).toBe("icon-navigation-down");
  });
});

describe("di-layers-panel Background row", () => {
  async function mountExpanded(selectedLayerKey?: string) {
    resetBody();
    const panel = document.createElement("di-layers-panel");
    panel.layers = templateWithLayers(3).layers;
    panel.selectedLayerKey = selectedLayerKey;
    panel.expanded = true;
    document.body.append(panel);
    await settle(panel, 3);

    const background = panel.shadowRoot!.querySelector<HTMLElement>(".row.background")!;
    return { panel, background };
  }

  /** Every `di-layer-select` the panel dispatches, as its detail. */
  function recordSelects(panel: HTMLElement): { key?: string }[] {
    const details: { key?: string }[] = [];
    panel.addEventListener("di-layer-select", (event) => details.push((event as CustomEvent).detail));
    return details;
  }

  it("is still the last row, labelled exactly Background", async () => {
    const { panel, background } = await mountExpanded();

    const rows = [...panel.shadowRoot!.querySelectorAll(".row")];
    expect(rows.length).toBe(4);
    expect(rows[rows.length - 1]).toBe(background);
    expect(background.innerText.trim()).toBe("Background");
    expect(background.getAttribute("draggable")).toBeNull();
  });

  it("reads as selected when no layer is", async () => {
    const { background } = await mountExpanded();

    expect(background.getAttribute("role")).toBe("button");
    expect(background.getAttribute("aria-pressed")).toBe("true");
    expect(background.classList.contains("selected")).toBe(true);
  });

  it("does not read as selected while a layer is", async () => {
    const layers = templateWithLayers(3).layers;
    const { background } = await mountExpanded(layers[0].key);

    expect(background.getAttribute("aria-pressed")).toBe("false");
    expect(background.classList.contains("selected")).toBe(false);
  });

  it("selects no layer when clicked, which shows the canvas pane", async () => {
    const { panel, background } = await mountExpanded(templateWithLayers(1).layers[0].key);
    const selects = recordSelects(panel);

    background.click();

    expect(selects).toHaveLength(1);
    expect(selects[0].key).toBeUndefined();
  });

  it("selects no layer on Enter or Space", async () => {
    const { panel, background } = await mountExpanded(templateWithLayers(1).layers[0].key);
    const selects = recordSelects(panel);

    const enter = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    background.dispatchEvent(enter);
    const space = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    background.dispatchEvent(space);

    expect(selects).toHaveLength(2);
    expect(selects.every((detail) => detail.key === undefined)).toBe(true);
    // Space would otherwise scroll the panel.
    expect(space.defaultPrevented).toBe(true);
  });
});
