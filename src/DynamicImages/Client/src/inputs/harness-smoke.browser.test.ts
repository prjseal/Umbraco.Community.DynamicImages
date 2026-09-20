import { describe, expect, it } from "vitest";
import "./di-number-field.element.js";

/**
 * Throwaway: the only thing this proves is that a real `.element.ts` - and the
 * `@umbraco-cms/backoffice` imports behind it - resolves, registers and lays out under vitest
 * browser mode. Delete it once a real browser spec exists.
 */
describe("browser harness", () => {
  it("mounts a real custom element and lays it out", async () => {
    const host = document.createElement("div");
    host.style.width = "200px";
    document.body.append(host);

    const field = document.createElement("di-number-field");
    field.setAttribute("label", "Opacity");
    host.append(field);

    await customElements.whenDefined("di-number-field");
    await (field as unknown as { updateComplete: Promise<unknown> }).updateComplete;

    const input = field.shadowRoot?.querySelector("input");
    expect(input).toBeTruthy();
    // The point of browser mode: a real box, with a real width, from real layout.
    expect(field.getBoundingClientRect().width).toBeGreaterThan(0);

    host.remove();
  });
});
