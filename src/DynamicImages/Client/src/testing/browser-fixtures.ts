// The UUI design tokens (--uui-size-*, --uui-color-*), which the backoffice defines on :root.
// Without them every var() in a component's styles is invalid, so paddings, gaps and borders
// collapse to nothing and a layout assertion measures a page no editor ever sees.
import "@umbraco-ui/uui-css/dist/custom-properties.css";
import { css, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { DiTemplateWorkspaceContext } from "../workspace/di-template-workspace.context.js";
import { createTemplate, createTextLayer } from "../models/layer-factories.js";
import type { DiLayer, DiTemplate } from "../api/types.js";

/**
 * Helpers shared by the `*.browser.test.ts` specs. These run in a real Chromium under
 * vitest browser mode, which is the whole point: the layout defects these specs pin
 * (B1, B2) are measured with `getBoundingClientRect()`, and jsdom does no layout at all.
 */

/**
 * A minimal controller host that also *provides* the workspace context, which is how the real
 * workspace element does it - `UmbSubmittableWorkspaceContextBase` provides itself under
 * `UMB_WORKSPACE_CONTEXT` when constructed against a host.
 */
class DiTestHostElement extends UmbLitElement {
  // The slot is not decoration: UmbLitElement renders into a shadow root, so anything a spec
  // appends to the host would never be laid out without one and every measurement would be 0.
  override render() {
    return html`<slot></slot>`;
  }

  static override styles = css`
    :host {
      display: block;
    }
  `;
}

if (!customElements.get("di-test-host")) {
  customElements.define("di-test-host", DiTestHostElement);
}

export interface MountedWorkspace {
  host: DiTestHostElement;
  context: DiTemplateWorkspaceContext;
  cleanup: () => void;
}

/**
 * Mounts a host providing a workspace context seeded with a scaffold template.
 *
 * `createScaffold()` is safe without a server: it fetches fonts (which fails and is caught into
 * an empty list) and skips properties entirely while `docTypeAliases` is empty.
 */
export async function mountWorkspace(template?: DiTemplate): Promise<MountedWorkspace> {
  const host = document.createElement("di-test-host") as DiTestHostElement;
  host.style.display = "block";
  host.style.height = "100%";
  document.body.append(host);

  const context = new DiTemplateWorkspaceContext(host);
  await context.createScaffold("Test template");

  if (template) {
    context.updateTemplateFields(template);
    context.updateCanvas(template.canvas);
  }

  return {
    host,
    context,
    cleanup: () => {
      context.destroy();
      host.remove();
    },
  };
}

/** A template with `count` simple text layers, for panels that render a list of them. */
export function templateWithLayers(count: number): DiTemplate {
  const template = createTemplate("Layers fixture");
  const layers: DiLayer[] = [];

  for (let index = 0; index < count; index++) {
    layers.push(createTextLayer({ template, x: 0, y: index * 40 }, `Layer ${index + 1}`, {
      kind: "static",
      text: `Layer ${index + 1}`,
    }));
  }

  return { ...template, layers };
}

/** Lit renders asynchronously; wait for the element and everything it just rendered. */
export async function settle(element: Element, frames = 2): Promise<void> {
  await (element as unknown as { updateComplete?: Promise<unknown> }).updateComplete;

  for (let index = 0; index < frames; index++) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

/** A fixed-size block to mount into, so a measurement is against a size the spec chose. */
export function fixedBox(width: number | string, height: number | string): HTMLDivElement {
  const box = document.createElement("div");
  box.style.width = typeof width === "number" ? `${width}px` : width;
  box.style.height = typeof height === "number" ? `${height}px` : height;
  box.style.display = "grid";
  box.style.minHeight = "0";
  document.body.append(box);

  return box;
}

/** Strip the page back between specs, so one spec's mount cannot flatter the next one's. */
export function resetBody(): void {
  document.body.innerHTML = "";
  document.body.style.margin = "0";
}
