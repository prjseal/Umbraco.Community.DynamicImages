import { expect, test, type Page } from "@playwright/test";
import {
  chooseAction, expandTreeItem, login, openActions, openSection, pickInTree, TEMPLATE_NAME, treeItem,
} from "./helpers.js";

/**
 * The Fonts tree, end to end: the uSync fixture's fonts as families with their variants, a folder
 * created, a family of this run's own registered, renamed and moved into it, Delete showing the
 * templates that use a font - and refusing - and an unused family deleted, and a variant's named
 * styles saved from its workspace. Everything it creates it removes again, and the one change it
 * makes to a fixture font it takes back.
 */

const RUN = Date.now().toString(36);
const FOLDER = `E2E fonts ${RUN}`;
const FAMILY = `E2E family ${RUN}`;
const STYLE = `E2E style ${RUN}`;

/** A font file the Clean site ships in wwwroot, registered afresh as this run's own family. */
const FONT_PATH = "/assets/fonts/HankenGrotesk-Regular.woff2";

/** The fixture's families: each font the uSync fixture imports became one. */
const FIXTURE_FAMILIES = ["BricolageDisplay", "HankenBody", "HankenMeta", "Kablammo", "Mountains of Christmas"];

/** "Article OG image" sets its title in this one. */
const USED_FAMILY = "BricolageDisplay";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await login(page);
  await openSection(page);
  await expandTreeItem(page, "Fonts");
});

/** The labels of the Fonts root's direct children - not its grandchildren - in tree order. */
async function rootLabels(page: Page): Promise<string[]> {
  const children = treeItem(page, "Fonts").locator(":scope > umb-tree-item");
  const labels: string[] = [];

  for (let i = 0; i < (await children.count()); i++) {
    labels.push((await children.nth(i).locator("uui-menu-item").first().getAttribute("label")) ?? "");
  }

  return labels;
}

/**
 * Clicks the workspace's Save and waits for the write it makes. Core's detail workspaces save
 * without a notification, so the request is what says it happened.
 */
async function save(page: Page, path: RegExp): Promise<void> {
  const response = page.waitForResponse((r) => path.test(r.url()) && r.request().method() === "PUT");
  await page.locator("umb-workspace-action button:has-text('Save')").first().click();
  expect((await response).ok()).toBe(true);
}

test("the Fonts tree lists the fixture's families, each with its variants", async ({ page }) => {
  for (const family of FIXTURE_FAMILIES) await expect(treeItem(page, family)).toBeVisible({ timeout: 60_000 });

  const hanken = await expandTreeItem(page, "HankenBody");
  await expect(hanken.locator("umb-tree-item uui-menu-item[label='Regular 400']")).toBeVisible({ timeout: 60_000 });
});

test("a folder is created from the Fonts root's Create…", async ({ page }) => {
  await openActions(page, "Fonts");
  await chooseAction(page, "Create");

  await page.locator("umb-entity-create-option-action-list-modal").getByText("Folder", { exact: false }).first().click();

  const modal = page.locator("umb-folder-create-modal");
  await expect(modal).toBeVisible();
  await modal.locator("uui-input input").fill(FOLDER);
  await modal.locator("uui-button[type='submit'], uui-button[look='primary']").first().click();

  await expect(treeItem(page, FOLDER)).toBeVisible({ timeout: 60_000 });
});

test("a font registered from a path becomes a family, renamed from its workspace", async ({ page }) => {
  await expect(treeItem(page, FIXTURE_FAMILIES[0])).toBeVisible({ timeout: 60_000 });
  const before = await rootLabels(page);

  await openActions(page, "Fonts");
  await chooseAction(page, "Create");
  await page.locator("umb-entity-create-option-action-list-modal").getByText("Font from path").click();

  const modal = page.locator("di-font-upload-modal");
  await expect(modal).toBeVisible();
  await modal.locator("uui-input[label='Path'] input").fill(FONT_PATH);
  await modal.locator("uui-button[label='Register this path']").click();
  await expect(modal).toBeHidden({ timeout: 60_000 });

  // A family named after the file's own family name, at the root.
  await expect.poll(async () => (await rootLabels(page)).filter((l) => !before.includes(l)), { timeout: 60_000 })
    .toHaveLength(1);
  const created = (await rootLabels(page)).find((l) => !before.includes(l))!;

  await openActions(page, created);
  await chooseAction(page, "Rename");

  const name = page.locator("umb-workspace-header-name-editable input").first();
  await expect(name).toHaveValue(created, { timeout: 60_000 });
  await name.fill(FAMILY);
  await save(page, /\/fonts\/families\//);

  await expandTreeItem(page, "Fonts");
  await expect(treeItem(page, FAMILY)).toBeVisible({ timeout: 60_000 });
  await expect(treeItem(page, created)).toHaveCount(0);
});

test("the family moves into the folder", async ({ page }) => {
  await openActions(page, FAMILY);
  await chooseAction(page, "Move to");

  const picker = page.locator("umb-tree-picker-modal");
  await pickInTree(page, "Fonts", FOLDER);
  await picker.locator("uui-button[label='Move']").click();
  await expect(picker).toBeHidden({ timeout: 30_000 });

  const folder = await expandTreeItem(page, FOLDER);
  await expect(folder.locator(`umb-tree-item uui-menu-item[label='${FAMILY}']`)).toBeVisible({ timeout: 60_000 });
  expect(await rootLabels(page)).not.toContain(FAMILY);
});

test("Delete on a family a template uses lists that template and is refused", async ({ page }) => {
  await openActions(page, USED_FAMILY);
  await chooseAction(page, "Delete");

  const modal = page.locator("umb-delete-with-relation-confirm-modal");
  await expect(modal).toBeVisible();
  await expect(modal.locator(`uui-ref-node[name='${TEMPLATE_NAME}']`)).toBeVisible({ timeout: 30_000 });

  await modal.locator("uui-button#confirm").click();
  await expect(page.locator("uui-toast-notification[color='danger']").filter({ hasText: "still in use" }).first())
    .toBeVisible({ timeout: 30_000 });
  await expect(treeItem(page, USED_FAMILY)).toBeVisible();
});

test("Delete on an unused family removes it, and the emptied folder goes too", async ({ page }) => {
  await expandTreeItem(page, FOLDER);
  await openActions(page, FAMILY);
  await chooseAction(page, "Delete");

  const modal = page.locator("umb-delete-with-relation-confirm-modal");
  await expect(modal).toBeVisible();
  await expect(modal.locator("uui-ref-node")).toHaveCount(0);
  await modal.locator("uui-button#confirm").click();
  await expect(treeItem(page, FAMILY)).toBeHidden({ timeout: 60_000 });

  await openActions(page, FOLDER);
  await chooseAction(page, "Delete");
  await page.locator("umb-confirm-modal uui-button[color='danger']").click();
  await expect(treeItem(page, FOLDER)).toBeHidden({ timeout: 60_000 });
});

test("a variant's named styles save from its workspace", async ({ page }) => {
  const hanken = await expandTreeItem(page, "HankenBody");
  await hanken.locator("umb-tree-item uui-menu-item[label='Regular 400'] #label-button").first().click();

  const view = page.locator("di-font-workspace-view");
  await expect(view).toBeVisible({ timeout: 60_000 });
  const rows = view.locator("uui-table-row");
  const before = await rows.count();

  await view.locator("uui-button[label='Add a named style']").click();
  await expect(rows).toHaveCount(before + 1);
  await rows.nth(before).locator(".style-name input").fill(STYLE);
  await rows.nth(before).locator(".style-name input").blur();

  await save(page, /\/fonts\/[0-9a-f-]{36}$/);

  // Saved, not just shown: a fresh load has it.
  await page.reload();
  await expect(view.locator(`.style-name[label='Style name']`).nth(before)).toBeVisible({ timeout: 60_000 });
  await expect(view.locator(".style-name input").nth(before)).toHaveValue(STYLE);

  // Put the fixture font back as it was.
  await view.locator(`uui-button[label='Remove ${STYLE}']`).click();
  await expect(rows).toHaveCount(before);
  await save(page, /\/fonts\/[0-9a-f-]{36}$/);
});
