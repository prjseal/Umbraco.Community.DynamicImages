import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetBody } from "../../testing/browser-fixtures.js";
import { SectionSidebar } from "./section-sidebar.js";

/**
 * `SectionSidebar` against a stand-in for `umb-section-default`'s shadow tree: a split panel with
 * a `position` property and its own `#divider`, and a sidebar beside it. The real elements are
 * not needed for what this pins, which is exactly which inline styles and properties the helper
 * touches, and that it puts every one of them back.
 */

const UMBRACO_POSITION_KEY = "umb-split-panel-position";
const MIN_WIDTH = "--umb-split-panel-start-min-width";

type SplitPanel = HTMLElement & { position: string };

/** A stub only if the backoffice has not registered the real one in this bundle. */
class StubSplitPanel extends HTMLElement {
  position = "18.5%";

  constructor() {
    super();
    // The real split panel sets the divider's inline display itself once both slots are filled,
    // and the helper must leave that alone.
    this.attachShadow({ mode: "open" }).innerHTML = `<div id="divider" style="display: unset"></div>`;
  }
}

if (!customElements.get("umb-split-panel")) customElements.define("umb-split-panel", StubSplitPanel);
if (!customElements.get("umb-section-sidebar")) customElements.define("umb-section-sidebar", class extends HTMLElement {});

/** A host shaped like `umb-section-default`: an open shadow root holding the split panel. */
async function mountSection(options: { withSplitPanel?: boolean; position?: string } = {}) {
  const section = document.createElement("div");
  const root = section.attachShadow({ mode: "open" });
  document.body.append(section);

  let splitPanel: SplitPanel | undefined;
  if (options.withSplitPanel ?? true) {
    splitPanel = document.createElement("umb-split-panel") as SplitPanel;
    root.append(splitPanel);
    // The real element renders its divider asynchronously.
    await (splitPanel as unknown as { updateComplete?: Promise<unknown> }).updateComplete;
    if (options.position !== undefined) splitPanel.position = options.position;
  }

  const sidebar = document.createElement("umb-section-sidebar");
  sidebar.slot = "start";
  (splitPanel ?? root).append(sidebar);

  const divider = () => splitPanel?.shadowRoot?.querySelector<HTMLElement>("#divider") ?? null;
  return { section, splitPanel, sidebar, divider };
}

beforeEach(() => {
  localStorage.removeItem(UMBRACO_POSITION_KEY);
});

afterEach(() => {
  localStorage.removeItem(UMBRACO_POSITION_KEY);
  resetBody();
});

describe("SectionSidebar", () => {
  it("folds the tree away completely", async () => {
    const { section, splitPanel, sidebar, divider } = await mountSection({ position: "18.5%" });
    const helper = new SectionSidebar(section);
    expect(helper.available).toBe(true);
    expect(helper.collapsed).toBe(false);

    helper.collapse();

    expect(helper.collapsed).toBe(true);
    expect(splitPanel!.style.getPropertyValue(MIN_WIDTH)).toBe("0px");
    expect(sidebar.style.display).toBe("none");
    expect(divider()!.style.visibility).toBe("hidden");
    expect(splitPanel!.position).toBe("0px");
  });

  // The real split panel is a start | divider | end grid with a 0px divider column. With the
  // divider out of the grid, the workspace slid into that 0px column and the section went blank.
  it("keeps the divider in the layout, only invisible", async () => {
    const { section, divider } = await mountSection({ position: "18.5%" });
    const display = divider()!.style.display;

    new SectionSidebar(section).collapse();

    expect(divider()!.style.display).toBe(display);
    expect(getComputedStyle(divider()!).display).not.toBe("none");
  });

  it("puts back exactly what it changed", async () => {
    const { section, splitPanel, sidebar, divider } = await mountSection({ position: "18.5%" });
    const helper = new SectionSidebar(section);

    helper.collapse();
    helper.restore();

    expect(helper.collapsed).toBe(false);
    expect(splitPanel!.style.getPropertyValue(MIN_WIDTH)).toBe("");
    expect(sidebar.style.display).toBe("");
    expect(divider()!.style.visibility).toBe("");
    expect(splitPanel!.position).toBe("18.5%");
  });

  it("never writes Umbraco's saved width", async () => {
    localStorage.setItem(UMBRACO_POSITION_KEY, "260px");
    const { section } = await mountSection({ position: "18.5%" });
    const helper = new SectionSidebar(section);

    helper.collapse();
    helper.restore();

    expect(localStorage.getItem(UMBRACO_POSITION_KEY)).toBe("260px");
  });

  it("falls back to Umbraco's saved width when the tree was already at 0px", async () => {
    localStorage.setItem(UMBRACO_POSITION_KEY, "260px");
    const { section, splitPanel } = await mountSection({ position: "0px" });
    const helper = new SectionSidebar(section);

    helper.collapse();
    helper.restore();

    expect(splitPanel!.position).toBe("260px");
  });

  it("falls back to 300px when nothing better is saved", async () => {
    const { section, splitPanel } = await mountSection({ position: "0px" });
    const helper = new SectionSidebar(section);

    helper.collapse();
    helper.restore();

    expect(splitPanel!.position).toBe("300px");
  });

  it("ignores a second collapse, so the width it goes back to is the real one", async () => {
    const { section, splitPanel } = await mountSection({ position: "18.5%" });
    const helper = new SectionSidebar(section);

    helper.collapse();
    helper.collapse();
    helper.restore();

    expect(splitPanel!.position).toBe("18.5%");
  });

  it("ignores a restore when nothing was collapsed", async () => {
    const { section, splitPanel, sidebar } = await mountSection({ position: "18.5%" });
    sidebar.style.display = "block";
    const helper = new SectionSidebar(section);

    helper.restore();

    expect(splitPanel!.position).toBe("18.5%");
    expect(sidebar.style.display).toBe("block");
  });

  it("is unavailable, and does nothing, without a split panel", async () => {
    const { section, sidebar } = await mountSection({ withSplitPanel: false });
    const helper = new SectionSidebar(section);

    expect(helper.available).toBe(false);
    helper.collapse();

    expect(helper.collapsed).toBe(false);
    expect(sidebar.style.display).toBe("");
  });

  it("is unavailable without a section element at all", () => {
    const helper = new SectionSidebar(undefined);

    expect(helper.available).toBe(false);
    expect(() => {
      helper.collapse();
      helper.restore();
    }).not.toThrow();
  });
});
