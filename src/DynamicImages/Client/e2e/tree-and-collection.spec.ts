import { expect, test, type Locator, type Page } from "@playwright/test";
import { expandTemplatesTree, login, openSection, selectTreeItem, TEMPLATE_NAME, treeItem } from "./helpers.js";

/**
 * The Templates tree and its collection, end to end: the root shows the collection, the list and
 * the grid, and a folder's whole life - created from ⋯, a template created in it, moved out, and
 * the emptied folder deleted. Everything it creates it removes again, so the site is left as found.
 */

const RUN = Date.now().toString(36);
const FOLDER = `E2E folder ${RUN}`;
const TEMPLATE = `E2E template ${RUN}`;

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await login(page);
  await openSection(page);
  await expandTemplatesTree(page);
});

/** Opens a tree node's ⋯ menu. The button only shows on hover, so hover first. */
async function openActions(page: Page, name: string): Promise<void> {
  const item = treeItem(page, name);
  await item.locator("#label-button").first().hover();
  await item.locator("#action-modal").first().click();
}

/** Clicks an entry in whichever ⋯ menu is open. */
async function chooseAction(page: Page, label: string): Promise<void> {
  await page.locator("umb-entity-action-list uui-menu-item").filter({ hasText: label }).first().click();
}

/** The collection the root and each folder show, and its rows or cards. */
function collection(page: Page): Locator {
  return page.locator("umb-collection").first();
}

test("the Templates root shows its templates as a collection", async ({ page }) => {
  await selectTreeItem(page, "Templates");

  await expect(page).toHaveURL(/\/workspace\/di-template-root/);
  await expect(collection(page).locator("umb-table-collection-view, umb-table").first()).toBeVisible({ timeout: 60_000 });
  await expect(collection(page).getByRole("link", { name: TEMPLATE_NAME })).toBeVisible({ timeout: 60_000 });
});

test("the collection switches between the list and the grid, whose cards show a render", async ({ page }) => {
  await selectTreeItem(page, "Templates");
  await expect(collection(page).getByRole("link", { name: TEMPLATE_NAME })).toBeVisible({ timeout: 60_000 });

  await collection(page).locator("umb-collection-view-bundle uui-button").first().click();
  await page.locator("umb-collection-view-bundle").getByText("Grid", { exact: true }).click();

  const card = page.locator(`di-template-collection-card uui-card-media[name='${TEMPLATE_NAME}']`);
  await expect(card).toBeVisible({ timeout: 60_000 });

  // The thumbnail is a real render: an image, loaded, with pixels.
  const image = page.locator("di-template-collection-card img").first();
  await expect(image).toBeVisible({ timeout: 120_000 });
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 120_000 })
    .toBeGreaterThan(0);

  // And back, so the next visit starts on the list.
  await collection(page).locator("umb-collection-view-bundle uui-button").first().click();
  await page.locator("umb-collection-view-bundle").getByText("List", { exact: true }).click();
  await expect(collection(page).getByRole("link", { name: TEMPLATE_NAME })).toBeVisible({ timeout: 60_000 });
});

test("a folder is created from the root's ⋯ menu", async ({ page }) => {
  await openActions(page, "Templates");
  await chooseAction(page, "Create");

  const options = page.locator("umb-entity-create-option-action-list-modal");
  await expect(options).toBeVisible();
  await options.getByText("Folder", { exact: false }).first().click();

  const modal = page.locator("umb-folder-create-modal");
  await expect(modal).toBeVisible();
  await modal.locator("uui-input input").fill(FOLDER);
  await modal.locator("uui-button[type='submit'], uui-button[look='primary']").first().click();

  await expect(treeItem(page, FOLDER)).toBeVisible({ timeout: 60_000 });
});

test("a template created from the folder's ⋯ menu is saved in the folder", async ({ page }) => {
  await openActions(page, FOLDER);
  await chooseAction(page, "Create");

  await page.locator("umb-entity-create-option-action-list-modal").getByText("Template", { exact: true }).click();

  await expect(page).toHaveURL(/\/create\/parent\/di-template-folder\//, { timeout: 60_000 });
  await expect(page.locator("di-template-editor")).toBeVisible({ timeout: 60_000 });

  const name = page.locator("di-template-editor uui-input#name input").first();
  await name.fill(TEMPLATE);
  await page.locator("umb-workspace-action button:has-text('Save')").first().click();
  await expect(page.locator("uui-toast-notification[color='positive']").first()).toBeVisible({ timeout: 60_000 });

  // In the folder, in the tree.
  const folder = treeItem(page, FOLDER);
  if ((await folder.getAttribute("show-children")) === null) await folder.locator("#caret-button").click();
  await expect(folder.locator(`uui-menu-item[label='${TEMPLATE}']`)).toBeVisible({ timeout: 60_000 });
});

test("the template moves out of the folder to the root", async ({ page }) => {
  const folder = treeItem(page, FOLDER);
  await folder.locator("#caret-button").click();
  await expect(treeItem(page, TEMPLATE)).toBeVisible({ timeout: 60_000 });

  await openActions(page, TEMPLATE);
  await chooseAction(page, "Move");

  // The picker lists folders only, root first; its label is what selects it.
  const picker = page.locator("umb-tree-picker-modal");
  await expect(picker).toBeVisible();
  await picker.locator("uui-menu-item[label='Templates'] #label-button").first().click();
  await picker.locator("uui-button[label='Move']").click();
  await expect(picker).toBeHidden({ timeout: 30_000 });

  // The folder is empty, and the template is still in the tree - under the root now, shown
  // without a reload because the move reloads its destination.
  await expect(folder).not.toHaveAttribute("has-children", /.*/, { timeout: 60_000 });
  await expect(folder.locator(`uui-menu-item[label='${TEMPLATE}']`)).toHaveCount(0);
  await expect(treeItem(page, TEMPLATE)).toBeVisible({ timeout: 60_000 });
});

test("the emptied folder is deleted, and the template with it cleaned up", async ({ page }) => {
  await openActions(page, FOLDER);
  await chooseAction(page, "Delete");
  await page.locator("umb-confirm-modal uui-button[color='danger']").click();
  await expect(treeItem(page, FOLDER)).toBeHidden({ timeout: 60_000 });

  await openActions(page, TEMPLATE);
  await chooseAction(page, "Delete");
  await page.locator("umb-confirm-modal uui-button[color='danger']").click();
  await expect(treeItem(page, TEMPLATE)).toBeHidden({ timeout: 60_000 });
});
