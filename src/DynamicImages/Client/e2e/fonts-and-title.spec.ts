import { expect, test } from "@playwright/test";
import { login, openSection, openTemplate, TEMPLATE_NAME } from "./helpers.js";

/**
 * C1 - "Add a style" persisted a placeholder row *and closed the editor*, so the new style had
 * to be reopened to be named.
 *
 * C4 - the browser tab read "| Design | Umbraco", with a leading empty segment.
 *
 * C1 writes to the database, so that test puts the font back the way it found it.
 */

test("the workspace tab title carries the template name", async ({ page }) => {
  await login(page);
  await openSection(page);
  await openTemplate(page);

  await expect.poll(() => page.title(), { timeout: 60_000 }).toContain(TEMPLATE_NAME);

  // The defect was the leading empty segment, so assert on its absence specifically.
  expect(await page.title()).not.toMatch(/^\s*\|/);
});

test("adding a named style keeps the editor open and focuses the new row", async ({ page }) => {
  await login(page);
  await openSection(page);

  await page.locator("uui-menu-item[label='Fonts']").click();

  const dashboard = page.locator("di-fonts-dashboard");
  await expect(dashboard).toBeVisible({ timeout: 60_000 });

  // Whichever font is listed first; the behaviour is not specific to any of them.
  const namedStyles = dashboard.locator("uui-button:has-text('Named styles')").first();
  await expect(namedStyles).toBeVisible({ timeout: 60_000 });
  await namedStyles.click();

  const editor = dashboard.locator(".editor").first();
  await expect(editor).toBeVisible();

  const rowsBefore = await editor.locator("uui-table-row").count();

  await editor.locator("uui-button[label='Add a named style']").click();

  // The whole finding: the editor used to close here.
  await expect(editor).toBeVisible();
  await expect(editor.locator("uui-table-row")).toHaveCount(rowsBefore + 1);

  // And focus lands in the new row's name, so it can be typed straight in.
  //
  // `document.activeElement` only ever reports the outermost shadow *host*, so the chain has to
  // be walked to find what is really focused - everything here lives several shadow roots deep.
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          let active: Element | null = document.activeElement;

          while (active?.shadowRoot?.activeElement) {
            active = active.shadowRoot.activeElement;
          }

          // The class is on the uui-input; focus lands on the native input inside it.
          return !!active?.closest?.(".style-name") || !!active?.getRootNode?.call(active) &&
            !!(active?.getRootNode() as ShadowRoot)?.host?.classList?.contains("style-name");
        }),
      { timeout: 15_000 },
    )
    .toBe(true);

  // Restore: this one writes to the database, so put the row back.
  await editor.locator("uui-table-row").nth(rowsBefore).locator("uui-button[label^='Remove']").click();
  await expect(editor.locator("uui-table-row")).toHaveCount(rowsBefore);
});
