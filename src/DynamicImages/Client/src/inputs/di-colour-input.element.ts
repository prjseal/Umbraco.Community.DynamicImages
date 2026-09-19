import { css, customElement, html, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

/**
 * A hex colour field with an alpha slider and a swatch. The model stores #RRGGBB or #RRGGBBAA
 * everywhere, so alpha is edited as part of the same value rather than as a separate property.
 */
@customElement("di-colour-input")
export class DiColourInputElement extends UmbLitElement {
  @property({ type: String })
  value = "#FFFFFF";

  @property({ type: String })
  label = "Colour";

  @state()
  private _open = false;

  get #rgb(): string {
    const hex = (this.value || "").replace("#", "");
    return `#${hex.slice(0, 6).padEnd(6, "0")}`;
  }

  get #alpha(): number {
    const hex = (this.value || "").replace("#", "");
    return hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
  }

  #emit(value: string) {
    this.value = value;
    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { value } }));
  }

  #setRgb(rgb: string) {
    const alpha = this.#alpha;
    // Drop a fully opaque alpha suffix: "#FFFFFF" reads better than "#FFFFFFFF" and means the same.
    this.#emit(alpha >= 0.999 ? rgb.toUpperCase() : `${rgb.toUpperCase()}${toHexByte(alpha)}`);
  }

  #setAlpha(alpha: number) {
    this.#emit(alpha >= 0.999 ? this.#rgb.toUpperCase() : `${this.#rgb.toUpperCase()}${toHexByte(alpha)}`);
  }

  render() {
    return html`
      <div class="wrap">
        <button
          class="swatch"
          type="button"
          aria-label="${this.label}: ${this.value}"
          aria-expanded=${this._open}
          @click=${() => {
            this._open = !this._open;
          }}>
          <span class="chip" style="background:${this.#rgb};opacity:${this.#alpha}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(event: Event) => this.#emit((event.target as HTMLInputElement).value)}>
        </uui-input>

        ${this._open
          ? html`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${this.#rgb}
                  @input=${(event: Event) => this.#setRgb((event.target as HTMLInputElement).value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(this.#alpha)}
                    @input=${(event: Event) => this.#setAlpha(Number((event.target as HTMLInputElement).value))} />
                  <span class="alpha-value">${Math.round(this.#alpha * 100)}%</span>
                </label>
              </div>
            `
          : ""}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .wrap {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
    }

    .swatch {
      width: 28px;
      height: 28px;
      padding: 2px;
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      background:
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%),
        #fff;
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0;
      cursor: pointer;
      flex: 0 0 auto;
    }

    .chip {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 2px;
    }

    .popover {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      z-index: 10;
      display: grid;
      gap: var(--uui-size-space-2);
      padding: var(--uui-size-space-3);
      background: var(--uui-color-surface);
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-3);
    }

    .alpha {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      font-size: 12px;
    }

    .alpha-value {
      min-width: 36px;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
  `;
}

const toHexByte = (value: number): string =>
  Math.round(Math.max(0, Math.min(1, value)) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

export default DiColourInputElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-colour-input": DiColourInputElement;
  }
}
