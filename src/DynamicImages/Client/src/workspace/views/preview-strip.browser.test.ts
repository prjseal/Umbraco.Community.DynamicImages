import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountWorkspace, resetBody, settle } from "../../testing/browser-fixtures.js";
import "./di-preview-strip.element.js";

/**
 * A3 - the strip hard-coded `useSampleData: true` and computed `contentKey` from
 * `getData() ? undefined : undefined`, so picking a node in Preview & test never reached the
 * preview under the canvas.
 *
 * A1 - the toolbar's "Server preview" button emitted `di-request-preview` and nothing listened,
 * so the button did nothing at all and its `previewing` property was never driven.
 *
 * These assert on the intercepted request body rather than on pixels, which is what makes them
 * exact: the whole defect was in what got sent.
 */

interface PreviewRequest {
  contentKey: string | null;
  useSampleData: boolean;
}

let requests: PreviewRequest[];
let realFetch: typeof fetch;

beforeEach(() => {
  requests = [];
  realFetch = globalThis.fetch;

  globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(typeof input === "string" || input instanceof URL ? input : input.url);

    if (url.includes("/preview")) {
      requests.push(JSON.parse(String(init?.body)) as PreviewRequest);
      // A 1x1 transparent GIF is enough - the strip only needs a blob to make an object URL of.
      return new Response(new Blob([new Uint8Array([71, 73, 70])], { type: "image/gif" }), { status: 200 });
    }

    return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  resetBody();
});

async function mountStrip() {
  const { host, context, cleanup } = await mountWorkspace();

  const strip = document.createElement("di-preview-strip");
  host.append(strip);
  await settle(strip, 2);

  requests.length = 0;

  return { strip, context, cleanup };
}

describe("di-preview-strip", () => {
  it("sends the picked node through to the server", async () => {
    const { strip, context, cleanup } = await mountStrip();

    context.setSampleContentKey("11111111-2222-3333-4444-555555555555");
    strip.refresh();
    await settle(strip, 3);

    expect(requests.length).toBeGreaterThan(0);

    const last = requests[requests.length - 1];
    expect(last.contentKey).toBe("11111111-2222-3333-4444-555555555555");
    expect(last.useSampleData).toBe(false);

    cleanup();
  });

  it("falls back to sample data when no node is picked", async () => {
    const { strip, cleanup } = await mountStrip();

    strip.refresh();
    await settle(strip, 3);

    const last = requests[requests.length - 1];
    expect(last.contentKey).toBeNull();
    expect(last.useSampleData).toBe(true);

    cleanup();
  });

  it("refresh() renders immediately and expands a collapsed strip", async () => {
    const { strip, cleanup } = await mountStrip();

    // Collapsed by default, and nothing rendered while it is.
    expect(strip.shadowRoot!.querySelector("button.toggle")!.getAttribute("aria-expanded")).toBe("false");
    expect(requests.length).toBe(0);

    strip.refresh();
    await settle(strip, 3);

    // No debounce to wait out, and the strip opened so there is somewhere to show the result.
    expect(requests.length).toBeGreaterThan(0);
    expect(strip.shadowRoot!.querySelector("button.toggle")!.getAttribute("aria-expanded")).toBe("true");

    cleanup();
  });

  it("announces when a render starts and finishes", async () => {
    const { strip, cleanup } = await mountStrip();

    const states: boolean[] = [];
    strip.addEventListener("di-preview-state", (event) => {
      states.push((event as CustomEvent<{ busy: boolean }>).detail.busy);
    });

    strip.refresh();
    await settle(strip, 4);

    // This is what finally gives the toolbar button something to disable on.
    expect(states).toContain(true);
    expect(states[states.length - 1]).toBe(false);

    cleanup();
  });
});
