import { afterEach, describe, expect, it } from "vitest";
import { fixedBox, resetBody, settle } from "../testing/browser-fixtures.js";
import {
  createBadgesLayer, createGradient, createImageLayer, createRectLayer, createTemplate, createTextLayer,
} from "../models/layer-factories.js";
import type { DiGradient, DiLayer, DiProperty, DiTemplate, GradientKind } from "../api/types.js";
import "./di-layer-inspector.element.js";

/**
 * Nothing in the inspector may run off the side of it. The panel used to put fields side by side
 * - width beside height, a select beside its button, one path dropdown beside the next - and at
 * the default sidebar width the second of each pair was clipped. Every field now stacks, and this
 * holds it there: the inspector at 320px, for every layer type and every gradient kind, with
 * nothing scrolling sideways and every control's right edge inside the panel.
 */

const WIDTH = 320;

const KINDS: GradientKind[] = ["linear", "radial", "angular", "diamond", "reflected"];

const PROPERTIES: DiProperty[] = [
  { alias: "title", name: "A title property with a very long name indeed", group: "Content", editorAlias: "Umbraco.TextBox", classification: "text", isSystem: false, tab: "Content", tabSortOrder: 0, groupSortOrder: 0, sortOrder: 0 },
  { alias: "author", name: "Author", group: "Content", editorAlias: "Umbraco.ContentPicker", classification: "content", isSystem: false },
  { alias: "mainImage", name: "Main image", group: "Media", editorAlias: "Umbraco.MediaPicker3", classification: "media", isSystem: false },
  { alias: "tags", name: "Tags", group: "Content", editorAlias: "Umbraco.Tags", classification: "list", isSystem: false },
];

const LINKED: Record<string, DiProperty[]> = {
  author: [{ alias: "employer", name: "Employer", group: "Content", editorAlias: "Umbraco.ContentPicker", classification: "content", isSystem: false }],
  "author.employer": [{ alias: "logo", name: "Logo", group: "Media", editorAlias: "Umbraco.MediaPicker3", classification: "media", isSystem: false }],
};

/** Every element under a root, through every open shadow root on the way. */
function deepElements(root: Element | ShadowRoot): Element[] {
  const found: Element[] = [];
  for (const element of root.querySelectorAll("*")) {
    found.push(element);
    if (element.shadowRoot) found.push(...deepElements(element.shadowRoot));
  }
  return found;
}

/** The controls an editor reaches for; each must end inside the panel. */
const CONTROLS = new Set([
  "UUI-SELECT", "UUI-INPUT", "UUI-BUTTON", "UUI-TOGGLE", "UUI-SLIDER", "UUI-TEXTAREA",
  "DI-NUMBER-FIELD", "DI-COLOUR-INPUT", "DI-ANCHOR-PICKER", "UMB-INPUT-MEDIA", "UUI-COLOR-PICKER",
]);

async function mountInspector(template: DiTemplate, layer?: DiLayer) {
  resetBody();

  const inspector = document.createElement("di-layer-inspector") as HTMLElement & {
    template: DiTemplate; layer?: DiLayer; properties: DiProperty[]; linkedProperties: Record<string, DiProperty[]>;
  };
  inspector.template = template;
  inspector.layer = layer;
  inspector.properties = PROPERTIES;
  inspector.linkedProperties = LINKED;

  // The inspector's own column is scrollable vertically; a tall box keeps every field laid out.
  fixedBox(WIDTH, 6000).append(inspector);
  await settle(inspector, 6);

  return inspector;
}

function assertNothingOverflows(inspector: HTMLElement) {
  const host = inspector.getBoundingClientRect();
  expect(host.width).toBeCloseTo(WIDTH, 0);

  const problems: string[] = [];

  for (const element of [inspector, ...deepElements(inspector.shadowRoot!)]) {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    // A native text control scrolls its own text by design (a long path does); what must not
    // scroll sideways is anything that lays other things out.
    const native = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement;
    const style = getComputedStyle(element);
    if (!native && style.overflowX !== "visible" && element.scrollWidth > element.clientWidth + 1) {
      problems.push(`${nameOf(element)} scrolls sideways: ${element.scrollWidth} > ${element.clientWidth}`);
    }

    if (CONTROLS.has(element.tagName) && rect.right > host.right + 0.5) {
      problems.push(`${nameOf(element)} ends at ${Math.round(rect.right)}, past the panel's ${Math.round(host.right)}`);
    }
  }

  expect(problems).toEqual([]);
}

function nameOf(element: Element): string {
  const label = element.getAttribute("label");
  return `<${element.tagName.toLowerCase()}${label ? ` label="${label}"` : ""}${element.className ? ` class="${element.className}"` : ""}>`;
}

afterEach(() => {
  resetBody();
});

describe("the inspector at 320px", () => {
  it("fits the canvas panel", async () => {
    const template = createTemplate("Overflow fixture");
    template.canvas.baseImage = { kind: "property", propertyAlias: "author.employer.logo" };

    assertNothingOverflows(await mountInspector(template));
  });

  for (const kind of KINDS) {
    it(`fits the canvas panel with a ${kind} gradient`, async () => {
      const template = createTemplate("Overflow fixture");
      template.canvas.backgroundGradient = { ...createGradient(), kind } as DiGradient;

      assertNothingOverflows(await mountInspector(template));
    });
  }

  it("fits a text layer bound through a two-hop path", async () => {
    const template = createTemplate("Overflow fixture");
    const layer = createTextLayer({ template }, "Byline", { kind: "property", propertyAlias: "author.employer.logo" });

    assertNothingOverflows(await mountInspector(template, layer));
  });

  it("fits an image layer", async () => {
    const template = createTemplate("Overflow fixture");
    const layer = createImageLayer({ template }, "Photo", "mainImage");

    assertNothingOverflows(await mountInspector(template, layer));
  });

  it("fits a badge row", async () => {
    const template = createTemplate("Overflow fixture");
    const layer = createBadgesLayer({ template }, "Tags", "tags");

    assertNothingOverflows(await mountInspector(template, layer));
  });

  for (const kind of KINDS) {
    it(`fits a shape with a ${kind} gradient`, async () => {
      const template = createTemplate("Overflow fixture");
      const layer = createRectLayer({ template }, "Shape", "star");
      layer.gradient = { ...createGradient(), kind, stops: [
        { colour: "#FF0000", position: 0 }, { colour: "#00FF0080", position: 0.4 }, { colour: "#0000FF", position: 1 },
      ] } as DiGradient;
      layer.border = { width: 4, colour: "#FFFFFF" };

      assertNothingOverflows(await mountInspector(template, layer));
    });
  }
});
