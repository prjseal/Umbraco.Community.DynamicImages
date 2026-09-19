import { css, customElement, html, nothing, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

/** A compact number input with a unit suffix, used throughout the inspector's layout section. */
@customElement("di-number-field")
export class DiNumberFieldElement extends UmbLitElement {
  @property({ type: Number })
  value?: number | null;

  @property({ type: String })
  label = "";

  @property({ type: String })
  suffix = "px";

  @property({ type: Number })
  step = 1;

  @property({ type: Number })
  min?: number;

  @property({ type: Number })
  max?: number;

  /** Shown when the value is null - "as big as the content needs", which is a real setting. */
  @property({ type: String })
  placeholder = "Auto";

  #onChange(event: Event) {
    const raw = (event.target as HTMLInputElement).value;
    const value = raw === "" ? null : Number(raw);

    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { value } }));
  }

  render() {
    return html`
      <label class="field">
        ${this.label ? html`<span class="label">${this.label}</span>` : nothing}
        <span class="input">
          <input
            type="number"
            aria-label=${this.label}
            .value=${this.value === null || this.value === undefined ? "" : String(this.value)}
            placeholder=${this.placeholder}
            step=${this.step}
            min=${this.min ?? nothing}
            max=${this.max ?? nothing}
            @change=${this.#onChange} />
          ${this.suffix ? html`<span class="suffix">${this.suffix}</span>` : nothing}
        </span>
      </label>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .field {
      display: grid;
      gap: 2px;
    }

    .label {
      font-size: 11px;
      color: var(--uui-color-text-alt);
    }

    .input {
      display: flex;
      align-items: center;
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      background: var(--uui-color-surface);
    }

    input {
      flex: 1 1 auto;
      width: 100%;
      min-width: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      padding: 4px 6px;
      font-variant-numeric: tabular-nums;
    }

    input:focus {
      outline: none;
    }

    .input:focus-within {
      border-color: var(--uui-color-focus);
    }

    .suffix {
      padding-right: 6px;
      font-size: 11px;
      color: var(--uui-color-text-alt);
    }
  `;
}

export default DiNumberFieldElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-number-field": DiNumberFieldElement;
  }
}
