import { css, customElement, html, property, repeat } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { Guide } from "./snap.js";

/**
 * The magenta alignment lines that appear while a layer is being dragged. Purely presentational -
 * snap.ts decides where they go.
 */
@customElement("di-guides")
export class DiGuidesElement extends UmbLitElement {
  @property({ type: Array })
  guides: Guide[] = [];

  /** Canvas-to-screen scale, so image pixels land on the right screen pixels. */
  @property({ type: Number })
  scale = 1;

  render() {
    return html`${repeat(
      this.guides,
      (guide, index) => `${guide.orientation}-${guide.at}-${index}`,
      (guide) => this.#renderGuide(guide),
    )}`;
  }

  #renderGuide(guide: Guide) {
    const offset = `${guide.at * this.scale}px`;

    return guide.orientation === "vertical"
      ? html`<div class="guide vertical" style="left:${offset}"><span class="label">${guide.label}</span></div>`
      : html`<div class="guide horizontal" style="top:${offset}"><span class="label">${guide.label}</span></div>`;
  }

  static styles = css`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      /* Above the layer boxes, so a guide is never hidden behind the thing it is guiding. */
      z-index: 40;
    }

    .guide {
      position: absolute;
      /* Hard-coded, unlike everything else: a UUI token could resolve to a colour that vanishes
         against the artboard, and a guide that cannot be seen is worse than no guide. */
      background: #ff3fa4;
    }

    .vertical {
      top: 0;
      bottom: 0;
      width: 1px;
    }

    .horizontal {
      left: 0;
      right: 0;
      height: 1px;
    }

    .label {
      position: absolute;
      background: #ff3fa4;
      color: #fff;
      font-size: 10px;
      line-height: 1;
      padding: 2px 4px;
      border-radius: 2px;
      white-space: nowrap;
    }

    .vertical .label {
      top: 4px;
      left: 4px;
    }

    .horizontal .label {
      left: 4px;
      top: 4px;
    }

    @media (prefers-reduced-motion: no-preference) {
      .guide {
        animation: fade-in 120ms ease-out;
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
}

export default DiGuidesElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-guides": DiGuidesElement;
  }
}
