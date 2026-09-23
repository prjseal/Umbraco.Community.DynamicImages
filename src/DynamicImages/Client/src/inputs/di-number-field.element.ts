import { css, customElement, html, nothing, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { clampNumber } from "./number-bounds.js";

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

  /**
   * For a toolbar: no visible label - `label` is the input's accessible name only - and the field
   * fills its host's height, so it can sit flush between buttons in one segmented control the
   * way every design tool draws its zoom. A caption above the field pushed the input below the
   * buttons beside it. Without it the label is core's property layout, like every other
   * inspector field.
   */
  @property({ type: Boolean, reflect: true })
  compact = false;

  /** Shown when the value is null - "as big as the content needs", which is a real setting. */
  @property({ type: String })
  placeholder = "Auto";

  /**
   * `min` and `max` on the native input only constrain its steppers - a typed value went through
   * verbatim, so Opacity happily became 5 with no clamping and no inline error, and the server's
   * validator only caught it on save.
   */
  #onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = input.value;
    const value = clampNumber(raw, this.min, this.max);

    // Unparseable: keep whatever the model already had rather than blanking it, and put that
    // back in the field so the two agree.
    if (value === undefined) {
      input.value = this.value === null || this.value === undefined ? "" : String(this.value);
      return;
    }

    // Writing the clamped value back matters: without it the field keeps showing 5 while the
    // model holds 1.
    const corrected = value === null ? "" : String(value);
    if (corrected !== raw) input.value = corrected;

    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { value } }));
  }

  render() {
    const input = html`
      <span class="input" slot="editor">
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
    `;

    // The label through core's property layout, like every other inspector field, so a number
    // reads the same as the select above it.
    if (!this.label || this.compact) return input;

    return html`<umb-property-layout orientation="vertical" label=${this.label}>${input}</umb-property-layout>`;
  }

  static styles = css`
    :host {
      display: block;
    }

    /* Core's layout pads for a full-width workspace; the inspector's fields use this. */
    umb-property-layout {
      padding: var(--uui-size-space-3) 0;
    }

    :host([compact]) .input {
      box-sizing: border-box;
      height: 100%;
      border-radius: var(--di-number-field-border-radius, var(--uui-border-radius));
    }

    :host([compact]) input {
      min-height: 0;
      height: 100%;
      padding: 0 2px 0 var(--uui-size-space-2, 6px);
      text-align: right;
      /* The buttons either side already step it; the spinner only crowded the number. */
      appearance: textfield;
      -moz-appearance: textfield;
    }

    :host([compact]) input::-webkit-inner-spin-button,
    :host([compact]) input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    :host([compact]) .suffix {
      padding-right: var(--uui-size-space-2, 6px);
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
      /* The height of a uui-input or uui-select beside it. */
      min-height: calc(var(--uui-size-11, 36px) - 2px);
      padding: 0 var(--uui-size-space-3, 9px);
      font-variant-numeric: tabular-nums;
    }

    input:focus {
      outline: none;
    }

    .input:focus-within {
      border-color: var(--uui-color-focus);
    }

    .suffix {
      padding-right: var(--uui-size-space-3, 9px);
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
