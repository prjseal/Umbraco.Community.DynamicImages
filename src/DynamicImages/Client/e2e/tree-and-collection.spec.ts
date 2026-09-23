import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  chooseAction, expandTemplatesTree, expandTreeItem, login, openActions, openSection, pickInTree, selectTreeItem,
  TEMPLATE_NAME, treeItem,
} from "./helpers.js";

/**
 * The Templates tree and its collection, end to end: the root shows the collection, the list and
 * the grid, and a folder's whole life - created from ⋯, a template created in it, moved out - then
 * the native actions on a template (Duplicate to, Enable/Disable), Sort children, and the
 * collection's bulk Move to, Duplicate to and Delete. Everything it creates it removes again, so
 * the site is left as found - which is also why Sort runs on the E2E folder rather than the root,
 * whose fixture templates would otherwise keep the order it gave them.
 */

const RUN = Date.now().toString(36);
const FOLDER = `E2E folder ${RUN}`;
const TEMPLATE = `E2E template ${RUN}`;
const SECOND = `E2E second ${RUN}`;
const COPY = `${TEMPLATE} (copy)`;

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await login(page);
  await openSection(page);
  await expandTemplatesTree(page);
});

/** The collection the root and each folder show, and its rows or cards. */
function collection(page: Page): Locator {
  return page.locator("umb-collection").first();
}

/**
 * The labels of an expanded tree node's children, in the order the tree shows them. Every item
 * under it: the tests only ask this of a folder holding templates, so there are no grandchildren.
 */
async function childLabels(parent: Locator): Promise<string[]> {
  return parent.locator("umb-tree-item uui-menu-item").evaluateAll((items) => items.map((i) => i.getAttribute("label") ?? ""));
}

/**
 * Ticks a collection table row by its name link. The first tick is the checkbox, which shows on
 * hover; once anything is selected the rows go select-only, and a click anywhere on one toggles it.
 */
async function selectRow(page: Page, name: string): Promise<void> {
  const row = collection(page).locator("uui-table-row").filter({ has: page.getByRole("link", { name, exact: true }) });
  await row.hover();

  if ((await row.getAttribute("select-only")) !== null) await row.locator("uui-table-cell").first().click();
  else await row.locator("uui-checkbox").click();

  await expect(row).toHaveAttribute("selected", /.*/);
}

/** Creates a template from a container's ⋯ → Create → Template, and saves it under `name`. */
async function createTemplate(page: Page, container: string, name: string): Promise<void> {
  await openActions(page, container);
  await chooseAction(page, "Create");
  await page.locator("umb-entity-create-option-action-list-modal").getByText("Template", { exact: true }).click();
  await expect(page.locator("di-template-editor")).toBeVisible({ timeout: 60_000 });

  await page.locator("di-template-editor uui-input#name input").first().fill(name);
  await page.locator("umb-workspace-action button:has-text('Save')").first().click();
  await expect(page.locator("uui-toast-notification[color='positive']").first()).toBeVisible({ timeout: 60_000 });
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

test("a template's ⋯ menu offers Duplicate to, Move to, Enable, Disable and Delete", async ({ page }) => {
  await openActions(page, TEMPLATE);

  const menu = page.locator("umb-entity-action-list");
  for (const label of ["Duplicate to", "Move to", "Enable", "Disable", "Delete"]) {
    await expect(menu.locator("uui-menu-item").filter({ hasText: label }).first()).toBeVisible();
  }
  // The same-folder Duplicate it replaced is gone.
  await expect(menu.locator("uui-menu-item[label='Duplicate']")).toHaveCount(0);
});

test("Duplicate to a folder puts the copy under that folder", async ({ page }) => {
  await openActions(page, TEMPLATE);
  await chooseAction(page, "Duplicate to");

  // 17.5 opens its own duplicate-to modal; 17.7 deprecates that for the shared tree picker.
  const modal = page.locator("umb-duplicate-to-modal, umb-tree-picker-modal");
  await expect(modal).toBeVisible();
  await modal.locator(`uui-menu-item[label='${FOLDER}'] #label-button`).first().click();
  await modal.locator("uui-button[look='primary']").last().click();
  await expect(modal).toBeHidden({ timeout: 30_000 });

  const folder = await expandTreeItem(page, FOLDER);
  await expect(folder.locator(`uui-menu-item[label='${COPY}']`)).toBeVisible({ timeout: 60_000 });
  // The original stays where it was.
  await expect(treeItem(page, TEMPLATE)).toBeVisible();
});

test("Disable greys a template's icon and Enable restores it", async ({ page }) => {
  await createTemplate(page, "Templates", SECOND);
  await expandTemplatesTree(page);

  // Away from the new template's designer: core draws the active tree item's icon without its
  // colour, since it sits on the highlight.
  await selectTreeItem(page, "Templates");

  // umb-icon takes "icon-picture color-grey" as its name attribute and splits the colour off into
  // its own property, so the attribute is the thing to assert on.
  const icon = () => treeItem(page, SECOND).locator("umb-icon").first();
  await expect(icon()).not.toHaveAttribute("name", /color-grey/, { timeout: 60_000 });

  await openActions(page, SECOND);
  await chooseAction(page, "Disable");
  await expect(page.locator("uui-toast-notification").filter({ hasText: `'${SECOND}' disabled` }).first())
    .toBeVisible({ timeout: 30_000 });
  await expect(icon()).toHaveAttribute("name", /color-grey/, { timeout: 60_000 });

  // Disable again is a no-op that says so, rather than an error.
  await openActions(page, SECOND);
  await chooseAction(page, "Disable");
  await expect(page.locator("uui-toast-notification").filter({ hasText: "already disabled" }).first())
    .toBeVisible({ timeout: 30_000 });

  await openActions(page, SECOND);
  await chooseAction(page, "Enable");
  await expect(icon()).not.toHaveAttribute("name", /color-grey/, { timeout: 60_000 });
});

test("selecting two templates in the collection offers bulk Move to, Duplicate to and Delete, and Move to moves them", async ({ page }) => {
  await selectTreeItem(page, "Templates");
  await expect(collection(page).getByRole("link", { name: TEMPLATE, exact: true })).toBeVisible({ timeout: 60_000 });

  await selectRow(page, TEMPLATE);
  await selectRow(page, SECOND);

  const actions = page.locator("umb-collection-selection-actions");
  await expect(actions).toContainText("2 of");
  for (const label of ["Move to", "Duplicate to", "Delete"]) {
    await expect(actions.locator(`uui-button[label='${label}']`)).toBeVisible();
  }

  await actions.locator("uui-button[label='Move to']").click();
  // Core's bulk actions open the tree picker with the root collapsed.
  const picker = page.locator("umb-tree-picker-modal");
  await pickInTree(page, "Templates", FOLDER);
  await picker.locator("uui-button[look='primary']").last().click();
  await expect(picker).toBeHidden({ timeout: 30_000 });

  // Gone from the root's collection, and both in the folder in the tree, without a reload.
  await expect(collection(page).getByRole("link", { name: TEMPLATE, exact: true })).toHaveCount(0, { timeout: 60_000 });
  const folder = await expandTreeItem(page, FOLDER);
  await expect(folder.locator(`uui-menu-item[label='${TEMPLATE}']`)).toBeVisible({ timeout: 60_000 });
  await expect(folder.locator(`uui-menu-item[label='${SECOND}']`)).toBeVisible({ timeout: 60_000 });
});

test("Sort children reorders the folder's tree to the order the modal showed", async ({ page }) => {
  const folder = await expandTreeItem(page, FOLDER);
  await expect(folder.locator(`uui-menu-item[label='${SECOND}']`)).toBeVisible({ timeout: 60_000 });
  const before = await childLabels(folder);
  expect(before).toHaveLength(3);

  await openActions(page, FOLDER);
  await chooseAction(page, "Sort children");

  const modal = page.locator("umb-sort-children-of-modal");
  await expect(modal.locator("uui-table-row")).toHaveCount(3, { timeout: 30_000 });

  // Drag the last row to the top by its grip, as an editor would. (The Name column's ordering
  // does nothing in 17.7: its comparator is handed lit templates, not strings.)
  const rows = modal.locator("uui-table-row");
  const grip = await rows.nth(2).locator("uui-icon[name='icon-grip']").boundingBox();
  const top = await rows.nth(0).boundingBox();
  await page.mouse.move(grip!.x + grip!.width / 2, grip!.y + grip!.height / 2);
  await page.mouse.down();
  await page.mouse.move(grip!.x + 5, top!.y + 5, { steps: 10 });
  await page.mouse.move(grip!.x + 5, top!.y + 2, { steps: 5 });
  await page.mouse.up();

  const order = await modal.locator("uui-table-row")
    .evaluateAll((all) => all.map((r) => r.textContent?.replace(/\s+/g, " ").trim() ?? ""));
  expect(order).toEqual([before[2], before[0], before[1]]);

  await modal.locator("uui-button[look='primary']").last().click();
  await expect(modal).toBeHidden({ timeout: 30_000 });

  await expect.poll(() => childLabels(treeItem(page, FOLDER)), { timeout: 60_000 }).toEqual(order);
});

test("the folder's contents are bulk deleted from its collection, then the folder itself", async ({ page }) => {
  await selectTreeItem(page, FOLDER);
  await expect(collection(page).getByRole("link", { name: SECOND, exact: true })).toBeVisible({ timeout: 60_000 });

  for (const name of [TEMPLATE, SECOND, COPY]) await selectRow(page, name);

  await page.locator("umb-collection-selection-actions uui-button[label='Delete']").click();
  await page.locator("umb-confirm-modal uui-button[color='danger']").click();
  await expect(collection(page).getByRole("link", { name: SECOND, exact: true })).toHaveCount(0, { timeout: 60_000 });

  await openActions(page, FOLDER);
  await chooseAction(page, "Delete");
  await page.locator("umb-confirm-modal uui-button[color='danger']").click();
  await expect(treeItem(page, FOLDER)).toBeHidden({ timeout: 60_000 });
});
