import { afterEach, describe, expect, it, vi } from "vitest";
import { mountWorkspace, resetBody, settle } from "../testing/browser-fixtures.js";

/**
 * C4 - the browser tab read "| Design | Umbraco", with a leading empty segment, because the
 * workspace context never gave its view a title. That is exactly what the host's #computeTitle()
 * produces from an undefined one. Every other Umbraco workspace puts the entity name there.
 */

afterEach(() => {
  resetBody();
});

describe("the workspace view title", () => {
  it("is the template's name", async () => {
    const { context, host, cleanup } = await mountWorkspace();
    const setTitle = vi.spyOn(context.view, "setTitle");

    context.updateTemplateFields({ name: "Article OG image" });
    await settle(host, 2);

    expect(setTitle).toHaveBeenCalledWith("Article OG image");

    cleanup();
  });

  it("falls back to New template rather than an empty segment", async () => {
    const { context, host, cleanup } = await mountWorkspace();
    const setTitle = vi.spyOn(context.view, "setTitle");

    context.updateTemplateFields({ name: "" });
    await settle(host, 2);

    expect(setTitle).toHaveBeenCalledWith("New template");
    expect(setTitle).not.toHaveBeenCalledWith("");

    cleanup();
  });
});
