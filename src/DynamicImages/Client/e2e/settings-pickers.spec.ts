import { expect, test, type Page } from "@playwright/test";
import { login, openSection, openTemplate } from "./helpers.js";

/**
 * Settings uses Umbraco's own pickers, and shows what is chosen the way the rest of the backoffice
 * does: document types as document type refs, the output folder as a media card. Both store what
 * they always stored - aliases, and the folder's key - which the save round trip proves.
 */

const FOLDER = "Sample Images";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await login(page);
  await openSection(page);
  await openTemplate(page);
  await page.locator("umb-workspace-editor uui-tab").filter({ hasText: "Settings" }).first().click();
  await expect(page.locator("di-settings-view")).toBeVisible({ timeout: 60_000 });
});

const documentTypes = (page: Page) => page.locator("di-settings-view umb-input-document-type");
const mediaFolder = (page: Page) => page.locator("di-settings-view umb-input-media");

/** Every PUT of the template, so the round trip is asserted on what was actually sent. */
function recordSaves(page: Page): { docTypeAliases: string[]; output: { mediaFolderKey?: string | null } }[] {
  const saves: { docTypeAliases: string[]; output: { mediaFolderKey?: string | null } }[] = [];
  page.on("request", (request) => {
    if (request.method() === "PUT" && /\/dynamic-images\/templates\/[0-9a-f-]+$/.test(request.url())) {
      saves.push(JSON.parse(request.postData() ?? "{}"));
    }
  });
  return saves;
}

async function save(page: Page): Promise<void> {
  await page.locator("umb-workspace-action button:has-text('Save')").first().click();
  await expect(page.locator("uui-toast-notification[color='positive']").first()).toBeVisible({ timeout: 60_000 });
}

test("the document types show as document type refs, not aliases", async ({ page }) => {
  // The fixture targets `article`; the ref carries the document type's name.
  await expect(documentTypes(page)).toContainText("Article", { timeout: 60_000 });
  await expect(documentTypes(page).locator("uui-ref-node-document-type, umb-ref-item, uui-ref-node").first()).toBeVisible();
  await expect(page.locator("di-settings-view uui-tag")).toHaveCount(0);
});

test("the output folder is chosen with the media picker and shows as a card, and both survive a save", async ({ page }) => {
  const saves = recordSaves(page);

  await mediaFolder(page).locator("#btn-add").click();
  const modal = page.locator("umb-media-picker-modal");
  await expect(modal).toBeVisible({ timeout: 60_000 });

  // Folders only: every card offered is a folder, and choosing one is a selection, not a navigation.
  await modal.locator(`uui-card-media[title='${FOLDER}']`).click({ position: { x: 20, y: 20 } });
  await modal.locator("uui-button[label='Choose']").click();
  await expect(modal).toBeHidden({ timeout: 30_000 });

  await expect(mediaFolder(page).locator("uui-card-media").filter({ hasText: FOLDER })).toBeVisible({ timeout: 60_000 });

  await save(page);

  const sent = saves.at(-1)!;
  expect(sent.docTypeAliases).toEqual(["article"]);
  expect(sent.output.mediaFolderKey).toMatch(/^[0-9a-f-]{36}$/);

  // A reload reads both back from the server, not from the page's memory.
  await page.reload();
  await openTemplate(page);
  await page.locator("umb-workspace-editor uui-tab").filter({ hasText: "Settings" }).first().click();

  await expect(documentTypes(page)).toContainText("Article", { timeout: 60_000 });
  await expect(mediaFolder(page).locator("uui-card-media").filter({ hasText: FOLDER })).toBeVisible({ timeout: 60_000 });

  // Put the fixture back as it was: the media root.
  const card = mediaFolder(page).locator("uui-card-media").filter({ hasText: FOLDER });
  await card.hover();
  await card.locator("uui-button[label='Remove'], uui-button[label^='Remove']").first().click();
  const confirm = page.locator("umb-confirm-modal uui-button[color='danger']");
  if (await confirm.isVisible({ timeout: 5_000 }).catch(() => false)) await confirm.click();

  await expect(mediaFolder(page).locator("uui-card-media")).toHaveCount(0);
  await save(page);
  expect(saves.at(-1)!.output.mediaFolderKey ?? null).toBeNull();
});
