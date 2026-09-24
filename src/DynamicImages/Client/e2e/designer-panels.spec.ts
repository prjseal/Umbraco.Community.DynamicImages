import { expect, test, type Page } from "@playwright/test";
import { layerNames, login, openSection, openTemplate } from "./helpers.js";

/**
 * The panels around the Design view's canvas, end to end: `plans/designer-panels-plan.md`.
 *
 * The tree toggle is the one that needs this layer. It reaches into Umbraco's own section
 * element, which no unit spec has - the browser-mode spec pins the helper against a stand-in, and
 * only a real backoffice shows that the stand-in is the right shape.
 */

const PALETTE_KEY = "di:designer:palette-collapsed";
const TREE_KEY = "di:designer:tree-collapsed";
const UMBRACO_POSITION_KEY = "umb-split-panel-position";

/** Scoped to the editor: Umbraco's section tabs include a "Settings" too. */
async function openWorkspaceView(page: Page, label: string) {
  await page.locator("umb-workspace-editor uui-tab").filter({ hasText: label }).first().click();
}

async function width(page: Page, selector: string): Promise<number> {
  const box = await page.locator(selector).first().boundingBox();
  return box?.width ?? 0;
}

const sidebar = (page: Page) => page.locator("umb-section-sidebar");
const treeToggle = (page: Page, label: "Hide tree" | "Show tree") =>
  page.locator(`di-canvas-toolbar uui-button[label='${label}']`);

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await login(page);
  await openSection(page);
  await openTemplate(page);
  await expect(page.locator("di-designer-canvas")).toBeVisible({ timeout: 60_000 });
});

// The palette buttons other specs click have to be there for them, and the tree has to be back
// for the next spec's openTemplate.
test.afterEach(async ({ page }) => {
  await page.evaluate(([palette, tree]) => {
    localStorage.removeItem(palette);
    localStorage.removeItem(tree);
  }, [PALETTE_KEY, TREE_KEY]);
});

test("the Background row shows the canvas settings", async ({ page }) => {
  // Expands the panel as a side effect, and proves there is a layer to select.
  const names = await layerNames(page);
  expect(names.length).toBeGreaterThan(0);

  await page.locator("di-layers-panel .row").filter({ hasText: names[0] }).first().click();
  await expect(page.locator("di-layer-inspector uui-box[headline='Canvas']")).toHaveCount(0);

  const background = page.locator("di-layers-panel .row.background");
  await expect(background).toHaveText("Background");
  await expect(background).toHaveAttribute("aria-pressed", "false");

  await background.click();

  await expect(page.locator("di-layer-inspector uui-box[headline='Canvas']")).toBeVisible();
  await expect(background).toHaveAttribute("aria-pressed", "true");
});

test("the Elements panel collapses to a rail, and stays that way across a reload", async ({ page }) => {
  const canvasBefore = await width(page, "di-designer-canvas");

  await page.locator("di-property-palette uui-button[label='Collapse the elements panel']").click();

  await expect.poll(() => width(page, "di-property-palette")).toBeLessThanOrEqual(40);
  expect(await width(page, "di-designer-canvas")).toBeGreaterThan(canvasBefore);

  await page.reload();
  await expect(page.locator("di-designer-canvas")).toBeVisible({ timeout: 60_000 });
  await expect(page.locator("di-property-palette uui-button[label='Expand the elements panel']")).toBeVisible();
  expect(await width(page, "di-property-palette")).toBeLessThanOrEqual(40);

  await page.locator("di-property-palette uui-button[label='Expand the elements panel']").click();
  await expect(page.locator("di-property-palette uui-button[label='Collapse the elements panel']")).toBeVisible();
  expect(await width(page, "di-property-palette")).toBeGreaterThan(40);
});

test("Hide tree folds the section's tree away while the Design view is open", async ({ page }) => {
  const savedPosition = await page.evaluate((key) => localStorage.getItem(key), UMBRACO_POSITION_KEY);

  await expect(sidebar(page)).toBeVisible();
  const sidebarWidth = await width(page, "umb-section-sidebar");
  const viewBefore = await width(page, "di-design-view");

  await treeToggle(page, "Hide tree").click();

  await expect(sidebar(page)).toBeHidden();
  await expect(treeToggle(page, "Show tree")).toBeVisible();
  // The workspace takes the tree's column, give or take the divider.
  await expect
    .poll(async () => (await width(page, "di-design-view")) - viewBefore)
    .toBeGreaterThan(sidebarWidth - 20);

  // Every other view navigates by the tree, so it comes back whatever the preference says...
  await openWorkspaceView(page, "Settings");
  await expect(sidebar(page)).toBeVisible();

  // ...and goes away again on the way back in.
  await openWorkspaceView(page, "Design");
  await expect(page.locator("di-designer-canvas")).toBeVisible({ timeout: 60_000 });
  await expect(sidebar(page)).toBeHidden();

  await treeToggle(page, "Show tree").click();

  await expect(sidebar(page)).toBeVisible();
  await expect.poll(() => width(page, "umb-section-sidebar")).toBeGreaterThan(sidebarWidth - 2);
  expect(await width(page, "umb-section-sidebar")).toBeLessThan(sidebarWidth + 2);

  // Only a drag of the divider may write Umbraco's saved tree width.
  expect(await page.evaluate((key) => localStorage.getItem(key), UMBRACO_POSITION_KEY)).toBe(savedPosition);
});
