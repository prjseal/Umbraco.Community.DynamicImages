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

/**
 * The Templates tree's node for a template or folder. Scoped to `umb-tree-item`, so it cannot
 * catch a same-named item anywhere else in the backoffice.
 */
export function treeItem(page: Page, name: string): Locator {
  return page.locator(`umb-tree-item uui-menu-item[label='${name}']`).first();
}

/**
 * Selects a tree node by its own label. An expanded node's box includes its children, so a plain
 * click on it lands on whichever child sits in the middle.
 */
export async function selectTreeItem(page: Page, name: string): Promise<void> {
  await treeItem(page, name).locator("#label-button").first().click();
}

/** Expands the Templates root in the sidebar tree, if it is not open already. */
export async function expandTemplatesTree(page: Page): Promise<void> {
  const root = treeItem(page, "Templates");
  await expect(root).toBeVisible({ timeout: 60_000 });

  if ((await root.getAttribute("show-children")) === null) {
    await root.locator("#caret-button").click();
  }
}

/** Opens a template's workspace from the Templates tree in the sidebar. */
export async function openTemplate(page: Page, name = TEMPLATE_NAME): Promise<void> {
  await expandTemplatesTree(page);

  await selectTreeItem(page, name);
  await expect(page.locator("di-template-editor")).toBeVisible({ timeout: 60_000 });
}

/**
 * An inspector or settings field, by its label. Every field is core's `umb-property-layout`, and
 * a di-number-field wraps one of its own, so the label is the one stable handle on either.
 */
export function field(scope: string, label: string): string {
  return `${scope} umb-property-layout[label="${label}"]`;
}

/**
 * Chooses a page in a Preview content picker - core's document picker, searched by name. `scope`
 * picks which of the two pickers (Preview & test's, or the designer strip's).
 */
export async function choosePreviewContent(page: Page, name: string, scope = "di-preview-view"): Promise<void> {
  const picker = page.locator(`${scope} di-preview-content-picker umb-input-document`);
  await expect(picker).toBeVisible({ timeout: 60_000 });
  await picker.locator("#btn-add").click();

  const modal = page.locator("umb-tree-picker-modal");
  await expect(modal).toBeVisible({ timeout: 60_000 });

  await modal.locator("uui-tab").filter({ hasText: "Search" }).click();
  await modal.locator("umb-picker-search-field input").first().fill(name);
  await modal.locator(`umb-document-picker-search-result-item uui-ref-node[name='${name}']`).first().click();
  await modal.locator("uui-button[label='Choose']").click();

  await expect(modal).toBeHidden({ timeout: 30_000 });
  await expect(picker).toContainText(name, { timeout: 60_000 });
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
