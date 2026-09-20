import { afterEach, describe, expect, it, vi } from "vitest";
import { mountWorkspace, resetBody, settle } from "../testing/browser-fixtures.js";

/**
 * A4's guard, at the level the E2E suite found a hole in.
 *
 * The first implementation treated `event.detail.url` as a string. A real in-app navigation puts
 * a **`URL` object** there; only a hand-dispatched event carries a string. `.includes` therefore
 * threw, and because the handler is async the rejection was swallowed - so the guard did nothing
 * at all on exactly the navigations it exists for, while a synthetic-event test passed happily.
 *
 * Both shapes are asserted here, which is the point: the string case alone is what hid the bug.
 */

/**
 * The workspace's own path, as the route manager would report it once a route has matched.
 * Nothing matches a route in this harness, so it is stubbed - the guard's own logic is what
 * regressed, and this isolates exactly that.
 */
const ACTIVE_PATH = "edit/8d2eb682-9e30-4839-be8e-8d305d718d27";

function willChangeState(url: string | URL): CustomEvent {
  const event = new CustomEvent("willchangestate", { cancelable: true, detail: { url } });
  window.dispatchEvent(event);

  return event;
}

afterEach(() => {
  resetBody();
});

describe("the unsaved-changes navigation guard", () => {
  for (const asUrlObject of [false, true]) {
    const shape = asUrlObject ? "a URL object" : "a string";

    it(`cancels navigation away from a dirty workspace, given ${shape}`, async () => {
      const { context, host, cleanup } = await mountWorkspace();
      vi.spyOn(context.routes, "getActiveLocalPath").mockReturnValue(ACTIVE_PATH);

      context.updateTemplateFields({ name: "Edited" });
      await settle(host, 2);
      expect(context.getHasUnpersistedChanges()).toBe(true);

      const target = "/umbraco/section/dynamic-images/dashboard/health";
      const event = willChangeState(asUrlObject ? new URL(target, location.origin) : target);

      expect(event.defaultPrevented, `the guard did not act on ${shape}`).toBe(true);

      cleanup();
    });

    it(`allows navigation from a clean workspace, given ${shape}`, async () => {
      const { context, host, cleanup } = await mountWorkspace();
      vi.spyOn(context.routes, "getActiveLocalPath").mockReturnValue(ACTIVE_PATH);
      await settle(host, 2);

      expect(context.getHasUnpersistedChanges()).toBe(false);

      const target = "/umbraco/section/dynamic-images/dashboard/health";
      const event = willChangeState(asUrlObject ? new URL(target, location.origin) : target);

      expect(event.defaultPrevented).toBe(false);

      cleanup();
    });
  }

  it("does not prompt when switching workspace views", async () => {
    const { context, host, cleanup } = await mountWorkspace();
    vi.spyOn(context.routes, "getActiveLocalPath").mockReturnValue(ACTIVE_PATH);

    context.updateTemplateFields({ name: "Edited" });
    await settle(host, 2);

    // A view URL keeps the workspace's own path as a prefix, so it is not navigating away -
    // which is what keeps a dirty template from prompting on every tab click.
    const event = willChangeState(
      new URL(`/umbraco/section/dynamic-images/workspace/di-template/${ACTIVE_PATH}/view/preview`, location.origin),
    );

    expect(event.defaultPrevented).toBe(false);

    cleanup();
  });
});
