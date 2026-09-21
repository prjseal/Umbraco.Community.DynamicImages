import { afterEach, describe, expect, it } from "vitest";
import { resetBody, settle } from "../testing/browser-fixtures.js";
import { createTemplate, createTextLayer } from "../models/layer-factories.js";
import type { DiProperty, DiTextLayer, PropertyClassification } from "../api/types.js";
import "./di-layer-inspector.element.js";

/**
 * The two-dropdown decode of a dotted alias. Browser mode rather than node: `uui-select` is a real
 * custom element whose options only exist once it has upgraded and rendered, and the regression
 * this file guards - a select blanking its own value - is a property of that element.
 */

const property = (alias: string, classification: PropertyClassification, name = alias): DiProperty => ({
  alias, name, group: "Content", editorAlias: "Umbraco.TextBox", classification, isSystem: false,
});

const PROPERTIES: DiProperty[] = [
  property("title", "text", "Title"),
  property("author", "content", "Author"),
  property("editor", "content", "Editor"),
];

const LINKED: Record<string, DiProperty[]> = {
  author: [property("jobTitle", "text", "Job title"), property("mainImage", "media", "Main image")],
  editor: [property("nickname", "text", "Nickname")],
};

/** Mounts the inspector on a text layer bound to `alias`, and returns it with the change events. */
async function mountInspector(alias: string) {
  resetBody();

  const template = createTemplate("Path fixture");
  const layer = createTextLayer({ template, x: 0, y: 0 }, "Byline", {
    kind: "property",
    propertyAlias: alias,
  }) as DiTextLayer;

  template.layers = [layer];

  const inspector = document.createElement("di-layer-inspector") as HTMLElement & {
    template: unknown; layer: unknown; properties: DiProperty[]; linkedProperties: Record<string, DiProperty[]>;
  };

  inspector.template = template;
  inspector.layer = layer;
  inspector.properties = PROPERTIES;
  inspector.linkedProperties = LINKED;

  const changes: { propertyAlias?: string | null }[] = [];
  inspector.addEventListener("di-layer-change", (event) => {
    changes.push((event as CustomEvent).detail.patch.binding);
  });

  document.body.append(inspector);
  await settle(inspector, 3);

  return { inspector, changes, layer };
}

/** The property dropdowns inside the binding field, in document order: root then tail. */
function selects(inspector: HTMLElement): HTMLSelectElement[] {
  const labels = [...inspector.shadowRoot!.querySelectorAll("label.field")];
  const field = labels.find((label) => label.querySelector("span")?.textContent?.trim() === "Property");

  return [...field!.querySelectorAll("uui-select")]
    .map((select) => select.shadowRoot!.querySelector("select")!)
    .filter(Boolean);
}

/** Picks a value on a real `select` and fires the change the inspector listens for. */
function choose(select: HTMLSelectElement, value: string) {
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
}

afterEach(() => {
  resetBody();
});

describe("property path select", () => {
  it("shows one dropdown when the binding has no path", async () => {
    const { inspector } = await mountInspector("title");

    expect(selects(inspector)).toHaveLength(1);
  });

  it("shows a second dropdown once the root is a content property", async () => {
    const { inspector } = await mountInspector("author");

    expect(selects(inspector)).toHaveLength(2);
  });

  it("offers the linked properties of that root in the second dropdown", async () => {
    const { inspector } = await mountInspector("author");

    const options = [...selects(inspector)[1].options].map((option) => option.value);

    expect(options).toContain("jobTitle");
    expect(options).toContain("mainImage");
    // Another root's properties must not leak into this one.
    expect(options).not.toContain("nickname");
  });

  it("writes the dotted alias when a tail is chosen", async () => {
    const { inspector, changes } = await mountInspector("author");

    choose(selects(inspector)[1], "jobTitle");

    expect(changes.at(-1)?.propertyAlias).toBe("author.jobTitle");
  });

  it("clears the tail when the root changes", async () => {
    // The new root's properties are a different set, so carrying the old tail over would produce
    // a path that resolves to nothing.
    const { inspector, changes } = await mountInspector("author.jobTitle");

    choose(selects(inspector)[0], "editor");

    expect(changes.at(-1)?.propertyAlias).toBe("editor");
  });

  it("opens a stored path with both dropdowns selected", async () => {
    const { inspector } = await mountInspector("author.jobTitle");

    const [root, tail] = selects(inspector);

    expect(root.value).toBe("author");
    expect(tail.value).toBe("jobTitle");
  });

  it("keeps an alias that is not in the list rather than blanking it", async () => {
    // A uui-select whose value is not among its options renders blank, and the next change event
    // writes that blank back over the editor's binding - so a stale alias would destroy itself
    // just by being looked at. The regression guard for the whole feature.
    const { inspector } = await mountInspector("goneAway");

    const [root] = selects(inspector);

    expect(root.value).toBe("goneAway");
    expect([...root.options].map((option) => option.value)).toContain("goneAway");
  });

  it("keeps a stored tail visible even when its root has no linked properties loaded", async () => {
    const { inspector } = await mountInspector("unknownRoot.someProperty");

    const [root, tail] = selects(inspector);

    expect(root.value).toBe("unknownRoot");
    expect(tail.value).toBe("someProperty");
  });
});
