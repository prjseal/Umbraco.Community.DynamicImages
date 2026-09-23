import { expect, test } from "@playwright/test";
import { field, login, openSection, openTemplate } from "./helpers.js";

/**
 * The canvas fill, end to end: the checks `plans/canvas-fill-plan.md` lists as manual ones.
 *
 * Two things here that the unit and component suites cannot reach:
 *
 * 1. **The artboard and the server agree.** The designer paints CSS and the server paints a
 *    brush; the whole point of sharing the geometry is that the two describe the same gradient.
 *    That is only observable with a real render, so the Preview tab's image is drawn to a canvas
 *    and its pixels sampled - a picture of the agreement, not a screenshot diff.
 * 2. **The round trip through the database and the Management API.** A missed
 *    `[JsonStringEnumMemberName]` shows up as a gradient that silently reverts to linear on
 *    reload, and nothing below the API can see that.
 */

const FIELD = (label: string) => field("di-layer-inspector", label);

/** The native control inside a `uui-select`; Playwright's CSS pierces the shadow root. */
const selectIn = (scope: string) => `${scope} select`;

/**
 * The workspace's own view tabs, scoped to the editor. `helpers.openView` takes the first
 * `uui-tab` matching the label, and Umbraco's *section* tabs are called Content, Media,
 * **Settings**, Users - so an unscoped "Settings" navigates out of the template entirely.
 */
async function openWorkspaceView(page: import("@playwright/test").Page, label: string) {
  await page.locator("umb-workspace-editor uui-tab").filter({ hasText: label }).first().click();
}

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await login(page);
  await openSection(page);
  await openTemplate(page);
});

/** The designer stage's computed styles, which is where the fill is actually painted. */
async function stageStyle(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const find = (tag: string, root: Document | ShadowRoot = document): Element | null => {
      for (const element of Array.from(root.querySelectorAll("*"))) {
        if (element.tagName.toLowerCase() === tag) return element;
        if (element.shadowRoot) {
          const inner = find(tag, element.shadowRoot);
          if (inner) return inner;
        }
      }
      return null;
    };

    const canvas = find("di-designer-canvas");
    const stage = canvas?.shadowRoot?.querySelector(".stage") as HTMLElement | null;
    if (!stage) return null;

    const style = getComputedStyle(stage);
    return { backgroundImage: style.backgroundImage, backgroundColor: style.backgroundColor };
  });
}

/**
 * Samples the Preview tab's server-rendered image at fractions of its own size. The image is
 * same-origin, so it can be drawn to a canvas and read back.
 */
async function samplePreview(page: import("@playwright/test").Page, points: [number, number][]) {
  const image = page.locator("di-preview-view img.render");
  await expect(image).toBeVisible({ timeout: 120_000 });
  await expect
    .poll(async () => image.evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 120_000 })
    .toBeGreaterThan(0);

  return image.evaluate((img: HTMLImageElement, at: [number, number][]) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const context = canvas.getContext("2d")!;
    context.drawImage(img, 0, 0);

    return at.map(([fx, fy]) => {
      const x = Math.min(canvas.width - 1, Math.round(fx * canvas.width));
      const y = Math.min(canvas.height - 1, Math.round(fy * canvas.height));
      const [r, g, b, a] = context.getImageData(x, y, 1, 1).data;
      return { r, g, b, a };
    });
  }, points);
}

/**
 * Takes the base image away, unsaved. The fixture's base image is an opaque 1200 x 630 PNG at
 * `cover`, drawn over the fill, so with it in place the server render shows no fill at all and a
 * pixel sample measures the photograph.
 */
async function withoutBaseImage(page: import("@playwright/test").Page) {
  await page.locator(selectIn(FIELD("Base image"))).selectOption("none");
}

async function setFill(page: import("@playwright/test").Page, mode: "colour" | "gradient" | "transparent") {
  await page.locator(selectIn(FIELD("Fill"))).selectOption(mode);
}

test("the canvas panel reads size, then fill, then image", async ({ page }) => {
  // The panel's own labels, in document order. A CSS query would also reach inside each
  // di-number-field's shadow root, so this walks the panel's light DOM only.
  const labels = await page.locator("di-layer-inspector uui-box[headline='Canvas']").evaluate((box) => {
    const out: string[] = [];
    const walk = (node: Element) => {
      for (const child of Array.from(node.children)) {
        const tag = child.tagName.toLowerCase();
        if (tag === "di-number-field" || tag === "umb-property-layout") out.push(child.getAttribute("label") ?? "");
        else walk(child);
      }
    };
    walk(box);
    return out;
  });

  const order = (label: string) => labels.indexOf(label);

  expect(labels).toContain("Fill");
  expect(order("Width")).toBeGreaterThanOrEqual(0);
  expect(order("Width")).toBeLessThan(order("Height"));
  expect(order("Height")).toBeLessThan(order("Fill"));
  expect(order("Fill")).toBeLessThan(order("Base image"));
  expect(order("Base image")).toBeLessThan(order("Fit"));
});

test("a gradient paints the artboard and the server render alike", async ({ page }) => {
  await withoutBaseImage(page);
  await setFill(page, "gradient");

  const stage = await stageStyle(page);
  expect(stage?.backgroundImage).toMatch(/^linear-gradient\(/);

  // The default gradient is #000000CC to #00000000 at 180deg: near-opaque black at the top,
  // fading to nothing at the bottom, over a transparent canvas.
  await openWorkspaceView(page, "Preview & test");
  const [top, bottom] = await samplePreview(page, [[0.5, 0.02], [0.5, 0.98]]);

  // Black at both ends, so it is the alpha that runs from the near-opaque stop to nothing.
  expect(top.a, "the top should be the near-opaque stop").toBeGreaterThan(bottom.a + 100);
});

test("a radial gradient's hotspot moves with its centre, on both surfaces", async ({ page }) => {
  await withoutBaseImage(page);
  await setFill(page, "gradient");
  await page.locator(selectIn(FIELD("Gradient type"))).selectOption("radial");

  const centreX = page.locator("di-layer-inspector di-number-field[label='Centre X'] input");
  await centreX.fill("20");
  await centreX.press("Enter");

  // Up in the top band, where this template draws nothing: a sample lower down lands on its text
  // and its hexagon, and measures a layer instead of the fill.
  const centreY = page.locator("di-layer-inspector di-number-field[label='Centre Y'] input");
  await centreY.fill("3");
  await centreY.press("Enter");

  const stage = await stageStyle(page);
  expect(stage?.backgroundImage).toMatch(/^radial-gradient\(/);
  expect(stage?.backgroundImage).toContain("20% 3%");

  await openWorkspaceView(page, "Preview & test");
  const [left, right] = await samplePreview(page, [[0.2, 0.03], [0.9, 0.03]]);

  // The centre is the `from` stop - near-opaque black - and the edge is the transparent one.
  expect(left.a, "the hotspot should be at 20%").toBeGreaterThan(right.a + 50);
});

test("switching to transparent and back keeps the colour", async ({ page }) => {
  const colour = await page.locator(selectIn(FIELD("Fill"))).evaluate(async (select: HTMLSelectElement) => {
    const field = select.getRootNode() as ShadowRoot;
    return (field.host as HTMLElement).parentElement?.querySelector("di-colour-input")?.getAttribute("value") ?? null;
  }).catch(() => null);

  const before = colour ?? (await page.locator("di-layer-inspector di-colour-input").first().evaluate(
    (input) => (input as HTMLElement & { value: string }).value,
  ));

  await setFill(page, "transparent");

  const stage = await stageStyle(page);
  expect(stage?.backgroundImage).toBe("none");
  expect(stage?.backgroundColor).toMatch(/rgba\(.*, 0\)$/);
  await expect(page.locator("di-layer-inspector p.hint", { hasText: "JPEG does not" })).toBeVisible();

  await setFill(page, "colour");

  const after = await page.locator("di-layer-inspector di-colour-input").first().evaluate(
    (input) => (input as HTMLElement & { value: string }).value,
  );

  expect(after.toUpperCase()).toBe(before.toUpperCase().slice(0, 7));
});

test("JPEG warns that the transparency will not survive, unless the image covers it", async ({ page }) => {
  const codes: string[][] = [];
  page.on("response", async (response) => {
    if (!response.url().includes("/dynamic-images/preview/layout")) return;
    try {
      const body = await response.json();
      codes.push((body.issues ?? []).map((issue: { code: string }) => issue.code));
    } catch {
      // A body we cannot parse is not a payload worth asserting on.
    }
  });

  await setFill(page, "transparent");
  await openWorkspaceView(page, "Settings");
  await page.locator('di-settings-view umb-property-layout[label="Format"] select').selectOption("jpeg");
  await openWorkspaceView(page, "Design");

  // This template's base image is `cover`, which always fills the canvas - so the warning would
  // be noise and is deliberately not raised.
  await page.locator(selectIn(FIELD("Fit"))).selectOption("cover");
  await expect.poll(() => codes.at(-1) ?? ["(nothing yet)"], { timeout: 60_000 }).not.toContain("TransparencyNotKept");

  // `contain` pads with transparency, so the fill shows and the flattening is real.
  await page.locator(selectIn(FIELD("Fit"))).selectOption("contain");
  await expect.poll(() => codes.at(-1) ?? [], { timeout: 60_000 }).toContain("TransparencyNotKept");

  // And a format that keeps alpha takes it away again.
  await openWorkspaceView(page, "Settings");
  await page.locator('di-settings-view umb-property-layout[label="Format"] select').selectOption("png");
  await openWorkspaceView(page, "Design");
  await page.locator(selectIn(FIELD("Fit"))).selectOption("cover");
  await expect.poll(() => codes.at(-1) ?? [], { timeout: 60_000 }).not.toContain("TransparencyNotKept");
});

test("the canvas stops at the largest side the server will render", async ({ page }) => {
  const width = page.locator("di-layer-inspector di-number-field[label='Width'] input").first();

  await width.fill("4096");
  await width.press("Enter");
  await expect(width).toHaveValue("4096");

  // Past the server's per-side cap the field clamps rather than letting a template be saved that
  // then cannot be rendered. The total-area cap is a validation error, not a field bound.
  await width.fill("6000");
  await width.press("Enter");
  await expect(width).toHaveValue("4096");
});

test("a shape layer's radial gradient paints its box, rotated or not", async ({ page }) => {
  // This template has no shape layer, so add one from the palette. It is never saved, so the
  // template is unchanged for the next spec.
  await page.locator("di-property-palette uui-button[label='Add a shape']").click();
  await page.locator("di-property-palette uui-menu-item[label='Rectangle']").click();

  // The element is a positioned wrapper whose paint lives in its shadow root, so "attached" is
  // the state to wait for - `toBeVisible` measures the host box and reads hidden.
  const box = page.locator("di-layer-box[selected]").last();
  await box.waitFor({ state: "attached" });

  await page.locator(`${FIELD("Gradient")} uui-toggle`).click();
  await page.locator(selectIn(FIELD("Gradient type"))).selectOption("radial");

  const paintOf = () => box.evaluate((element) => {
    const shape = element.shadowRoot?.querySelector(".shape") as HTMLElement | null;
    return shape ? getComputedStyle(shape).backgroundImage : null;
  });

  await expect.poll(paintOf, { timeout: 30_000 }).toMatch(/^radial-gradient\(/);

  // The gradient turns with the shape: the box is transformed, the paint stays a radial one.
  const rotation = page.locator("di-layer-inspector di-number-field[label='Rotation'] input").first();
  await rotation.fill("30");
  await rotation.press("Enter");

  // Whichever element in the box carries the turn, something must: an unrotated layer has none.
  await expect
    .poll(() => box.evaluate((element) => {
      const inner = element.shadowRoot?.firstElementChild as HTMLElement | null;
      return [getComputedStyle(element).transform, inner ? getComputedStyle(inner).transform : "none"]
        .some((transform) => transform !== "none");
    }), { timeout: 30_000 })
    .toBe(true);
  await expect.poll(paintOf, { timeout: 30_000 }).toMatch(/^radial-gradient\(/);
});

test("each fill change is one undo step", async ({ page }) => {
  const fill = page.locator(selectIn(FIELD("Fill")));

  await setFill(page, "gradient");
  await expect(fill).toHaveValue("gradient");

  await page.locator("di-designer-canvas").click({ position: { x: 5, y: 5 } });
  await page.keyboard.press("Control+z");

  await expect(fill).toHaveValue("colour");
});

/**
 * The "saved" toast, and only it. A save also raises any validation warnings the template has -
 * on a freshly installed site the fixture's output media folder does not exist yet, so there are
 * two toasts on screen - and an unscoped `uui-toast-notification` locator fails Playwright's
 * strict mode the moment a second one appears.
 */
function savedToast(page: import("@playwright/test").Page) {
  return page.locator("uui-toast-notification[color='positive']").first();
}

test("a gradient survives a save and a reload", async ({ page }) => {
  await setFill(page, "gradient");
  await page.locator(selectIn(FIELD("Gradient type"))).selectOption("radial");

  await page.locator("umb-workspace-action button:has-text('Save')").first().click();
  await expect(savedToast(page)).toBeVisible({ timeout: 60_000 });

  await page.reload();
  await openTemplate(page);

  await expect(page.locator(selectIn(FIELD("Fill")))).toHaveValue("gradient");
  await expect(page.locator(selectIn(FIELD("Gradient type")))).toHaveValue("radial");

  // Leave the template as it was found, so the other specs still start from a solid canvas.
  await setFill(page, "colour");
  await page.locator("umb-workspace-action button:has-text('Save')").first().click();
  await expect(savedToast(page)).toBeVisible({ timeout: 60_000 });
});
