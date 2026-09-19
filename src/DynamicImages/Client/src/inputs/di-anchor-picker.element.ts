import { css, customElement, html, property, repeat } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { Anchor } from "../api/types.js";
import { ANCHORS } from "../models/anchor.js";

const LABELS: Record<Anchor, string> = {
  topLeft: "Top left",
  topCentre: "Top centre",
  topRight: "Top right",
  middleLeft: "Middle left",
  middleCentre: "Middle centre",
  middleRight: "Middle right",
  bottomLeft: "Bottom left",
  bottomCentre: "Bottom centre",
  bottomRight: "Bottom right",
};

/**
 * The 3x3 grid that says which point of the layer's box its x/y refer to. Choosing "top right",
 * for instance, is what makes a right-aligned date stay pinned to the right margin whatever its
 * text does.
 */
@customElement("di-anchor-picker")
export class DiAnchorPickerElement extends UmbLitElement {
  @property({ type: String })
  value: Anchor = "topLeft";

  render() {
    return html`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${repeat(
          ANCHORS,
          (anchor) => anchor,
          (anchor) => html`
            <button
              type="button"
              role="radio"
              class=${anchor === this.value ? "cell active" : "cell"}
              aria-checked=${anchor === this.value}
              aria-label=${LABELS[anchor]}
              title=${LABELS[anchor]}
              @click=${() =>
                this.dispatchEvent(
                  new CustomEvent("change", { bubbles: true, composed: true, detail: { value: anchor } }),
                )}>
            </button>
          `,
        )}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 20px);
      grid-template-rows: repeat(3, 20px);
      gap: 2px;
    }

    .cell {
      border: 1px solid var(--uui-color-border);
      border-radius: 2px;
      background: var(--uui-color-surface);
      cursor: pointer;
      padding: 0;
    }

    .cell:hover {
      border-color: var(--uui-color-focus);
    }

    .cell.active {
      background: var(--uui-color-focus);
      border-color: var(--uui-color-focus);
    }

    .cell:focus-visible {
      outline: 2px solid var(--uui-color-focus);
      outline-offset: 1px;
    }
  `;
}

export default DiAnchorPickerElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-anchor-picker": DiAnchorPickerElement;
  }
}
