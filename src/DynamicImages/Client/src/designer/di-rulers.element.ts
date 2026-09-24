import { css, customElement, html, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

/**
 * Pixel rulers along the top and left of the artboard. Drawn on a canvas rather than as DOM ticks
 * because at 1200px wide there would be dozens of elements redrawn on every zoom step.
 */
@customElement("di-rulers")
export class DiRulersElement extends UmbLitElement {
  @property({ type: Number })
  canvasWidth = 1200;

  @property({ type: Number })
  canvasHeight = 630;

  @property({ type: Number })
  scale = 1;

  /** Pointer position in image pixels, or undefined when the pointer is off the stage. */
  @property({ type: Object })
  pointer?: { x: number; y: number };

  static readonly thickness = 20;

  override updated() {
    this.#draw("top");
    this.#draw("left");
  }

  #draw(which: "top" | "left") {
    const canvas = this.renderRoot.querySelector<HTMLCanvasElement>(`#${which}`);
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const lengthInImagePx = which === "top" ? this.canvasWidth : this.canvasHeight;
    const lengthInScreenPx = lengthInImagePx * this.scale;
    const ratio = window.devicePixelRatio || 1;

    // Size the backing store for the display density, or the ticks and labels come out fuzzy.
    canvas.width = (which === "top" ? lengthInScreenPx : DiRulersElement.thickness) * ratio;
    canvas.height = (which === "top" ? DiRulersElement.thickness : lengthInScreenPx) * ratio;
    canvas.style.width = `${which === "top" ? lengthInScreenPx : DiRulersElement.thickness}px`;
    canvas.style.height = `${which === "top" ? DiRulersElement.thickness : lengthInScreenPx}px`;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    const styles = getComputedStyle(this);
    context.strokeStyle = styles.getPropertyValue("--uui-color-border").trim() || "#c4c4c4";
    context.fillStyle = styles.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a";
    context.font = "9px sans-serif";
    context.lineWidth = 1;

    // Ticks every 50 image pixels, labelled every 100 - dense enough to judge a position,
    // sparse enough to stay readable when zoomed out.
    for (let position = 0; position <= lengthInImagePx; position += 50) {
      const at = Math.round(position * this.scale) + 0.5;
      const major = position % 100 === 0;
      const tick = major ? 8 : 4;

      context.beginPath();
      if (which === "top") {
        context.moveTo(at, DiRulersElement.thickness - tick);
        context.lineTo(at, DiRulersElement.thickness);
      } else {
        context.moveTo(DiRulersElement.thickness - tick, at);
        context.lineTo(DiRulersElement.thickness, at);
      }
      context.stroke();

      if (major && position > 0) {
        if (which === "top") context.fillText(String(position), at + 2, 9);
        else {
          context.save();
          context.translate(9, at - 2);
          context.rotate(-Math.PI / 2);
          context.fillText(String(position), 0, 0);
          context.restore();
        }
      }
    }
  }

  render() {
    const x = this.pointer ? this.pointer.x * this.scale : undefined;
    const y = this.pointer ? this.pointer.y * this.scale : undefined;

    return html`
      <div class="corner"></div>
      <div class="top">
        <canvas id="top"></canvas>
        ${x === undefined ? "" : html`<div class="hairline vertical" style="left:${x}px"></div>`}
      </div>
      <div class="left">
        <canvas id="left"></canvas>
        ${y === undefined ? "" : html`<div class="hairline horizontal" style="top:${y}px"></div>`}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: contents;
    }

    .corner {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      background: var(--uui-color-surface-alt);
      z-index: 3;
    }

    .top,
    .left {
      position: absolute;
      background: var(--uui-color-surface-alt);
      z-index: 2;
      /* A hairline past the end of its ruler must never become the viewport's scrollable overflow. */
      overflow: hidden;
    }

    .top {
      top: 0;
      left: 20px;
      height: 20px;
    }

    .left {
      top: 20px;
      left: 0;
      width: 20px;
    }

    .hairline {
      position: absolute;
      background: var(--uui-color-focus);
      pointer-events: none;
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
  `;
}

export default DiRulersElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-rulers": DiRulersElement;
  }
}
