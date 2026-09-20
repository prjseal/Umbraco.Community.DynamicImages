import { expect, test } from "@playwright/test";
import { discardModal, login, nameField, openSection, openTemplate, openView, viewTab } from "./helpers.js";

/**
 * A4 - the highest-impact finding. Typing into the template name and clicking a sidebar item
 * discarded the edit silently: no confirmation, no notification, and the edit gone on reopening.
 */

test.beforeEach(async ({ page }) => {
  await login(page);
  await openSection(page);
  await openTemplate(page);
});

/** Types into the name with real keyboard input - a synthetic event may not register as a change. */
async function dirtyTheName(page: import("@playwright/test").Page, suffix = " TEST") {
  const input = nameField(page);
  await expect(input).toBeVisible();

  const before = await input.inputValue();

  await input.click();
  await page.keyboard.press("End");
  await page.keyboard.type(suffix);

  await expect(input).toHaveValue(before + suffix);
  return { before, after: before + suffix };
}

test("cancelling the discard prompt keeps the edit and stays put", async ({ page }) => {
  const { after } = await dirtyTheName(page);

  await page.locator("uui-menu-item[label='Health']").click();

  const modal = discardModal(page);
  await expect(modal, "no discard-changes prompt - the edit would have been lost").toBeVisible();

  await modal.locator("#cancel").click();
  await expect(modal).toHaveCount(0);

  // Still on the template, edit intact.
  await expect(page.locator("di-template-editor")).toBeVisible();
  await expect(nameField(page)).toHaveValue(after);
});

test("confirming the discard prompt navigates away", async ({ page }) => {
  await dirtyTheName(page);

  await page.locator("uui-menu-item[label='Health']").click();

  const modal = discardModal(page);
  await expect(modal).toBeVisible();

  await modal.locator("#confirm").click();

  await expect(page).toHaveURL(/\/dashboard\/health/);
});

test("an unedited template does not prompt", async ({ page }) => {
  // The other half of the guard: a false positive here would be as bad as the original bug.
  await expect(nameField(page)).toBeVisible();

  await page.locator("uui-menu-item[label='Health']").click();

  await expect(page).toHaveURL(/\/dashboard\/health/);
  await expect(discardModal(page)).toHaveCount(0);
});

test("switching workspace views with a dirty template does not prompt", async ({ page }) => {
  const { after } = await dirtyTheName(page);

  await openView(page, "Preview & test");

  // A view URL keeps the workspace's own path as a prefix, so this is not navigating away.
  await expect(viewTab(page, "Preview & test")).toHaveAttribute("active", "");
  await expect(discardModal(page)).toHaveCount(0);

  await openView(page, "Design");
  await expect(discardModal(page)).toHaveCount(0);

  // And the edit came along, rather than being quietly reset by the view change.
  await expect(nameField(page)).toHaveValue(after);
});
