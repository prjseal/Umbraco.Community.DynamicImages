import { expect, test } from "@playwright/test";
import { choosePreviewContent, layerNames, login, openSection, openTemplate, openView, recordPreviewRequests } from "./helpers.js";

/**
 * A3 - the preview strip under the canvas ignored the node picked in Preview & test, because it
 * computed its content key from `getData() ? undefined : undefined` and hard-coded
 * `useSampleData: true`.
 *
 * A1 - the toolbar's "Server preview" button emitted an event nothing listened for.
 *
 * Both assert on the intercepted request body rather than on pixels: the defects were entirely
 * in what got sent, and a payload assertion cannot flake on a font-rendering difference.
 */

/** A published Clean article with a distinctive title and a mainImage. */
const SAMPLE_NODE = "Community";

test.beforeEach(async ({ page }) => {
  await login(page);
  await openSection(page);
  await openTemplate(page);
});

/** Picks a content node in Preview & test and returns its key, read off the request it triggers. */
async function pickSampleNode(page: import("@playwright/test").Page): Promise<string> {
  const previews = recordPreviewRequests(page);

  await openView(page, "Preview & test");

  // Core's document picker, limited to the template's document types.
  await choosePreviewContent(page, SAMPLE_NODE);

  // The render this triggered carries the key, which saves looking it up another way.
  await expect
    .poll(() => previews.filter((r) => r.contentKey !== null).length, { timeout: 60_000 })
    .toBeGreaterThan(0);

  return previews.filter((r) => r.contentKey !== null).at(-1)!.contentKey!;
}

test("the designer's preview strip renders against the node picked in Preview & test", async ({ page }) => {
  const contentKey = await pickSampleNode(page);

  const previews = recordPreviewRequests(page);

  // In-app, never by URL: a full page load legitimately resets the context, so navigating that
  // way would prove nothing. This is the exact mistake the manual review made first time round.
  await openView(page, "Design");
  await expect(page.locator("di-preview-strip")).toBeVisible({ timeout: 60_000 });

  await expect.poll(() => previews.length, { timeout: 60_000 }).toBeGreaterThan(0);

  const last = previews.at(-1)!;
  expect(last.contentKey).toBe(contentKey);
  expect(last.useSampleData).toBe(false);
});

test("the picked node survives a full page load", async ({ page }) => {
  const contentKey = await pickSampleNode(page);

  // A reload is the case the findings doc did not cover: the remembered node reached the picker
  // but never the workspace context, so the strip went back to sample data.
  await page.reload();

  const previews = recordPreviewRequests(page);

  await expect(page.locator("di-preview-view")).toBeVisible({ timeout: 120_000 });
  await openView(page, "Design");
  await expect(page.locator("di-preview-strip")).toBeVisible({ timeout: 60_000 });

  await expect.poll(() => previews.filter((r) => r.contentKey !== null).length, { timeout: 60_000 })
    .toBeGreaterThan(0);

  const last = previews.filter((r) => r.contentKey !== null).at(-1)!;
  expect(last.contentKey).toBe(contentKey);
  expect(last.useSampleData).toBe(false);
});

test("Server preview renders, and disables the button while it is in flight", async ({ page }) => {
  await openView(page, "Design");

  const toolbar = page.locator("di-canvas-toolbar");
  await expect(toolbar).toBeVisible({ timeout: 60_000 });

  const button = toolbar.locator("uui-button[label='Render this template on the server']");
  await expect(button).toBeVisible();

  // Wait out the strip's own first render, so what is counted is this click's.
  await expect(page.locator("di-preview-strip img")).toBeVisible({ timeout: 90_000 });

  const previews = recordPreviewRequests(page);

  // The busy state is recorded as it happens rather than asserted after the fact: a render can
  // finish faster than an assertion can look, and a test that only sometimes catches the
  // in-flight moment is worse than one that records it.
  await page.evaluate(() => {
    (window as unknown as { __busy: boolean[] }).__busy = [];
    document.addEventListener(
      "di-preview-state",
      (event) => {
        (window as unknown as { __busy: boolean[] }).__busy.push(
          (event as CustomEvent<{ busy: boolean }>).detail.busy,
        );
      },
      true,
    );
  });

  await button.click();

  // The click reached the strip: a render fired without waiting out the debounce.
  await expect.poll(() => previews.length, { timeout: 60_000 }).toBeGreaterThan(0);

  // And the strip announced both edges, which is what drives the toolbar's `previewing`
  // property - the one that nothing had ever set.
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __busy: boolean[] }).__busy), { timeout: 90_000 })
    .toEqual(expect.arrayContaining([true, false]));

  await expect(button).toBeEnabled();
});

test("the Resolved values table has a row for every layer", async ({ page }) => {
  // C5: a layer that drew nothing used to be dropped from this table entirely.
  await openView(page, "Design");
  const layers = await layerNames(page);
  expect(layers.length).toBeGreaterThan(0);

  await openView(page, "Preview & test");

  const table = page.locator("di-preview-view uui-table");
  await expect(table).toBeVisible({ timeout: 120_000 });

  // One row per layer, named - compared as a set against the layers panel, so a row that is
  // present but for the wrong layer fails too. The first cell is matched exactly rather than by
  // substring, because "Subtitle" contains "Title".
  await expect(table.locator("uui-table-row")).toHaveCount(layers.length);

  const rowNames = (await table.locator("uui-table-row uui-table-cell:first-child").allInnerTexts())
    .map((name) => name.replace(/\s+/g, " ").trim());

  expect(rowNames.sort()).toEqual([...layers].sort());
});

test("the designer strip shows and changes the same page as Preview & test", async ({ page }) => {
  const contentKey = await pickSampleNode(page);

  await openView(page, "Design");

  // One value, two pickers: the strip's reads what Preview & test chose...
  const strip = page.locator("di-preview-strip di-preview-content-picker umb-input-document");
  await expect(strip).toContainText(SAMPLE_NODE, { timeout: 60_000 });

  // ...and clearing it there puts both surfaces back on sample data.
  const previews = recordPreviewRequests(page);
  await strip.locator("uui-button[label='Remove']").first().click().catch(async () => {
    await strip.locator("[label^='Remove']").first().click();
  });
  const dialog = page.locator("umb-confirm-modal uui-button[color='danger']");
  if (await dialog.isVisible().catch(() => false)) await dialog.click();

  await expect.poll(() => previews.at(-1)?.useSampleData, { timeout: 60_000 }).toBe(true);

  await openView(page, "Preview & test");
  await expect(page.locator("di-preview-view di-preview-content-picker umb-input-document")).not.toContainText(SAMPLE_NODE);
  expect(contentKey.length).toBeGreaterThan(0);
});
