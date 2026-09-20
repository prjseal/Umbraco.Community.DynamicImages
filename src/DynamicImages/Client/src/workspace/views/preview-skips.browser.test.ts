import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountWorkspace, resetBody, settle, templateWithLayers } from "../../testing/browser-fixtures.js";
import "./di-preview-view.element.js";

/**
 * C5 - the Resolved values table rendered a row per *bounds*, and a layer that drew nothing is
 * omitted from the bounds entirely. So a 4-layer template showed 3 rows with no note, no reason
 * and nothing in the UI to explain why the image was missing its photo. It now renders a row per
 * template layer, with the server's reason when it did not draw.
 */

const LAYOUT_URL = "/preview/layout";

let layout: Record<string, unknown>;
let realFetch: typeof fetch;

beforeEach(() => {
  realFetch = globalThis.fetch;

  globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(typeof input === "string" || input instanceof URL ? input : input.url);

    if (url.includes(LAYOUT_URL)) {
      return new Response(JSON.stringify(layout), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    if (url.includes("/preview")) {
      return new Response(new Blob([new Uint8Array([71, 73, 70])], { type: "image/gif" }), { status: 200 });
    }

    return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  resetBody();
});

async function mountPreviewView(drawnCount: number, layerCount: number, reason?: string) {
  const template = templateWithLayers(layerCount);
  const drawn = template.layers.slice(0, drawnCount);
  const missed = template.layers.slice(drawnCount);

  layout = {
    canvasWidth: template.canvas.width,
    canvasHeight: template.canvas.height,
    layers: drawn.map((layer, index) => ({
      key: layer.key,
      x: 64,
      y: 100 + index * 40,
      width: 300,
      height: 32,
      lines: 1,
      truncated: false,
      resolvedText: layer.name,
      rotation: 0,
      pivotX: 0,
      pivotY: 0,
    })),
    issues: [],
    skipped: reason ? missed.map((layer) => ({ key: layer.key, reason })) : [],
  };

  const { host, context, cleanup } = await mountWorkspace();
  context.updateTemplateFields({ layers: template.layers, canvas: template.canvas });

  const view = document.createElement("di-preview-view");
  host.append(view);
  await settle(view, 6);

  return { view, cleanup };
}

function rows(view: Element): HTMLElement[] {
  // uui-table-row's own typings do not carry the HTMLElement surface this spec reads.
  return [...view.shadowRoot!.querySelectorAll("uui-table-row")] as unknown as HTMLElement[];
}

describe("the Resolved values table", () => {
  it("renders a row for every layer, drawn or not", async () => {
    const { view, cleanup } = await mountPreviewView(3, 4, "the image could not be loaded");

    // The exact shape of the finding: 4 layers, 3 of which drew.
    expect(rows(view)).toHaveLength(4);

    cleanup();
  });

  it("says why a layer did not draw", async () => {
    const { view, cleanup } = await mountPreviewView(3, 4, "the image could not be loaded");

    const notDrawn = rows(view).filter((row) => row.classList.contains("not-drawn"));
    expect(notDrawn).toHaveLength(1);
    expect(notDrawn[0].textContent).toContain("not drawn");
    expect(notDrawn[0].textContent).toContain("the image could not be loaded");

    cleanup();
  });

  it("still says a layer did not draw when the server gave no reason", async () => {
    const { view, cleanup } = await mountPreviewView(1, 2);

    const notDrawn = rows(view).filter((row) => row.classList.contains("not-drawn"));
    expect(notDrawn).toHaveLength(1);
    expect(notDrawn[0].textContent).toContain("not drawn");

    cleanup();
  });

  it("marks nothing when every layer drew", async () => {
    const { view, cleanup } = await mountPreviewView(3, 3);

    expect(rows(view)).toHaveLength(3);
    expect(rows(view).filter((row) => row.classList.contains("not-drawn"))).toHaveLength(0);

    cleanup();
  });
});
