import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Shared steps for the Dynamic Images E2E specs.
 *
 * Two rules run through all of them, both learned from the manual review:
 *
 * 1. **Never navigate between workspace views by URL.** A full page load legitimately resets the
 *    workspace context, so a test that switches view with `page.goto` proves nothing about
 *    whether state carries across - which is exactly what A3 is about. Click the view tab.
 * 2. **Never assert with a fixed wait.** Views take 5-10 seconds to mount here; every assertion
 *    below is an auto-waiting one, which is both faster and steadier than sleeping.
 */

export const USER = {
  login: process.env.UMBRACO_USER_LOGIN ?? "test@example.com",
  password: process.env.UMBRACO_USER_PASSWORD ?? "CHANGE-ME-local-only-1234",
};

/** The template the test site's uSync fixture creates. */
export const TEMPLATE_NAME = "Article OG image";

export async function login(page: Page): Promise<void> {
  await page.goto("/umbraco");

  await page.locator("#username-input").fill(USER.login);
  await page.locator("#password-input").fill(USER.password);
  await page.locator("button[type=submit]:has-text('Login')").click();

  // Lands in whichever section comes first; the section link is clicked from there.
  await page.waitForURL(/\/umbraco\/section\//, { timeout: 120_000 });
}

/** Opens the Dynamic Images section by clicking its nav link, never by URL. */
export async function openSection(page: Page): Promise<void> {
  await page.locator("a[href='section/dynamic-images']").first().click();
  await expect(page.locator("umb-section-sidebar")).toBeVisible();
}

/** Opens a template's workspace from the Templates menu in the sidebar. */
export async function openTemplate(page: Page, name = TEMPLATE_NAME): Promise<void> {
  await expect(page.locator("uui-menu-item[label='Templates']")).toBeVisible({ timeout: 60_000 });

  await page.locator(`uui-menu-item[label='${name}']`).click();
  await expect(page.locator("di-template-editor")).toBeVisible({ timeout: 60_000 });
}

/**
 * Switches workspace view **in-app**, which is the whole point - see rule 1 above. The tab is a
 * link, so clicking it is a router navigation rather than a page load.
 */
export async function openView(page: Page, label: string): Promise<void> {
  await page.locator(`uui-tab:has-text('${label}')`).first().click();
}

/** The workspace view tab, for asserting on which one is active. */
export function viewTab(page: Page, label: string): Locator {
  return page.locator(`uui-tab:has-text('${label}')`).first();
}

/**
 * The workspace's name field, in the editor's header. The native `input` inside the `uui-input`,
 * not the custom element: `inputValue()` and `toHaveValue()` need a real form control.
 */
export function nameField(page: Page): Locator {
  // `#name` specifically: the designer's palette has a search box that a looser selector picks
  // up instead, and it is the one that comes first in the DOM.
  return page.locator("di-template-editor uui-input#name input").first();
}

/** Umbraco's own unsaved-changes prompt - the one A4 was failing to raise. */
export function discardModal(page: Page): Locator {
  return page.locator("umb-discard-changes-modal");
}

/** The names in the Design view's layers panel, minus the synthetic Background row. */
export async function layerNames(page: Page): Promise<string[]> {
  const rows = page.locator("di-layers-panel .row");
  await expect(rows.first()).toBeVisible({ timeout: 60_000 });

  const names = await rows.allInnerTexts();

  return names
    .map((name) => name.replace(/\s+/g, " ").trim())
    .filter((name) => name.length > 0 && name !== "Background");
}

export interface PreviewRequestBody {
  contentKey: string | null;
  useSampleData: boolean;
  scale: number | null;
}

/**
 * Records the body of every `POST …/preview` the page makes.
 *
 * Asserting on the request payload rather than on the rendered pixels is what makes A1 and A3
 * exact: the defects were entirely in what got sent, and a payload assertion cannot flake on a
 * font-rendering difference the way an image diff can.
 */
export function recordPreviewRequests(page: Page, options?: { layout?: boolean }): PreviewRequestBody[] {
  const bodies: PreviewRequestBody[] = [];
  const wantLayout = options?.layout ?? false;

  page.on("request", (request) => {
    if (request.method() !== "POST") return;

    const url = request.url();
    if (!url.includes("/dynamic-images/preview")) return;

    // `/preview/layout` is a different call from `/preview`; most specs want only one of them.
    const isLayout = url.endsWith("/layout");
    if (isLayout !== wantLayout) return;

    try {
      bodies.push(JSON.parse(request.postData() ?? "{}") as PreviewRequestBody);
    } catch {
      // A body we cannot parse is not a payload worth asserting on.
    }
  });

  return bodies;
}
