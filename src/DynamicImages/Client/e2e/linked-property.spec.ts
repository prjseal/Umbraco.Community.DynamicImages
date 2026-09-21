import { expect, test, type Page } from "@playwright/test";
import { login, openSection, openTemplate, openView } from "./helpers.js";

/**
 * Following a content reference into a linked node, end to end.
 *
 * This is the one layer that can prove the inference actually works on a real site. The Clean
 * fixture is exactly the awkward case: `MNTPAuthors` - the data type behind `article.author` - has
 * **no `filter`**, so the endpoint cannot learn the target type from the picker's configuration.
 * It has to sample what existing content points at, through `ScopeToStartNodes`, and come back
 * with `author`. The second dropdown offering `mainImage` is the proof that happened: `mainImage`
 * is on the `author` document type and nowhere on `article`.
 */

/** A published Clean article that has an author picked, so the reference resolves to something. */
const SAMPLE_NODE = "Community";

interface LayoutRender {
  /** False only when the render was against a real node, which is the only kind worth reading. */
  useSampleData: boolean;
  layers: { key: string; resolvedText?: string | null }[];
}

/**
 * The `/preview/layout` responses, which carry the text the server actually drew per layer, each
 * tagged with whether its request was sample data. Switching to Preview & test renders against
 * samples before a node is picked, and "Sample value" is not what this spec is asserting on.
 */
function recordLayouts(page: Page): LayoutRender[] {
  const renders: LayoutRender[] = [];

  page.on("response", async (response) => {
    if (!response.url().endsWith("/dynamic-images/preview/layout")) return;

    try {
      const request = JSON.parse(response.request().postData() ?? "{}") as { useSampleData?: boolean };
      const body = (await response.json()) as { layers?: { key: string; resolvedText?: string | null }[] };

      renders.push({ useSampleData: request.useSampleData !== false, layers: body.layers ?? [] });
    } catch {
      // A body we cannot parse is not a payload worth asserting on.
    }
  });

  return renders;
}

/** Picks a real content node in Preview & test, so the render is against content rather than samples. */
async function pickSampleNode(page: Page): Promise<void> {
  const picker = page.locator("di-preview-view uui-button[label='Choose content to preview against']");
  await expect(picker).toBeVisible({ timeout: 60_000 });
  await picker.click();

  const modal = page.locator("di-sample-node-picker-modal");
  await expect(modal).toBeVisible({ timeout: 60_000 });

  // Clicking the node submits the modal; there is no separate confirm button.
  await modal.locator(`uui-ref-node[name='${SAMPLE_NODE}']`).click();
  await expect(picker).toContainText(SAMPLE_NODE, { timeout: 60_000 });
}

/**
 * The text the server drew for one layer, off the latest real-content render. The key is read on
 * the Design view and passed in, because the canvas - and with it every di-layer-box - is gone by
 * the time Preview & test is open.
 */
async function resolvedTextOf(renders: LayoutRender[], key: string): Promise<string> {
  const matching = () => renders.filter(
    (render) => !render.useSampleData && render.layers.some((layer) => layer.key === key));

  await expect.poll(() => matching().length, { timeout: 120_000 }).toBeGreaterThan(0);

  return matching().at(-1)!.layers.find((layer) => layer.key === key)!.resolvedText ?? "";
}

const FIELD = (label: string) => `di-layer-inspector label.field:has(> span:text-is("${label}"))`;

/** The native controls inside the binding field's `uui-select`s: root first, then tail. */
const pathSelects = (page: Page) => page.locator(`${FIELD("Property")} uui-select select`);

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await login(page);
  await openSection(page);
  await openTemplate(page);

  // A layer of this spec's own, from the palette, so it does not depend on which text layer the
  // fixture happens to have selected. It is never saved, so the template is left as it was.
  await page.locator("di-property-palette uui-button[label='Add Text to the canvas']").click();

  // A positioned wrapper whose paint lives in its shadow root, so "attached" is the state to wait
  // for - toBeVisible measures the host box and reads hidden.
  await page.locator("di-layer-box[selected]").last().waitFor({ state: "attached" });

  await page.locator(`${FIELD("Source")} uui-select select`).selectOption("property");
});

test("a content property offers the linked node's properties in a second dropdown", async ({ page }) => {
  await expect(pathSelects(page)).toHaveCount(1);

  await pathSelects(page).first().selectOption("author");

  // The second dropdown appearing at all means the root classified as content; mainImage being in
  // it means the endpoint inferred `author` by sampling, since MNTPAuthors has no filter.
  await expect(pathSelects(page)).toHaveCount(2);

  const tailOptions = await pathSelects(page).nth(1).evaluate(
    (select: HTMLSelectElement) => [...select.options].map((option) => option.value));

  expect(tailOptions).toContain("mainImage");
});

test("the server draws the linked value rather than a UDI", async ({ page }) => {
  // The one assertion that covers the whole server path: ContentRenderValueSource resolving the
  // reference against a real node, not the designer's sample data. /preview/layout reports the
  // text it actually drew, which is exact where a pixel diff would be a guess.
  const renders = recordLayouts(page);

  await pathSelects(page).first().selectOption("author");
  await expect(pathSelects(page)).toHaveCount(2);

  const key = (await page.locator("di-layer-box[selected]").last().getAttribute("data-key"))!;

  await openView(page, "Preview & test");
  await pickSampleNode(page);

  // A bare reference draws the linked node's *name*, where it used to print umb://document/…
  const bare = await resolvedTextOf(renders, key);
  expect(bare).not.toMatch(/umb:\/\/document\//);
  expect(bare.length).toBeGreaterThan(0);

  await openView(page, "Design");

  // `name` as the tail is the assertion that needs no fixture data to be populated: author.name
  // and a bare author reference must resolve to the same node, so they must draw the same string.
  // It is the dotted walk proving it lands where the bare one does.
  await pathSelects(page).nth(1).selectOption("name");

  // The stored alias is the dotted path, and it survives a re-read of the two dropdowns.
  await expect(pathSelects(page).first()).toHaveValue("author");
  await expect(pathSelects(page).nth(1)).toHaveValue("name");

  await openView(page, "Preview & test");

  await expect.poll(() => resolvedTextOf(renders, key), { timeout: 120_000 }).toBe(bare);
});

test("changing the root clears the tail", async ({ page }) => {
  await pathSelects(page).first().selectOption("author");
  await expect(pathSelects(page)).toHaveCount(2);
  await pathSelects(page).nth(1).selectOption("mainImage");

  await pathSelects(page).first().selectOption("title");

  // A text property is not a reference, so there is nothing left to follow.
  await expect(pathSelects(page)).toHaveCount(1);
  await expect(pathSelects(page).first()).toHaveValue("title");
});
