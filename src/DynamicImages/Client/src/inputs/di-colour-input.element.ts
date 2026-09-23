import { css, customElement, html, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

/**
 * A colour field: UUI's own colour picker - the one behind the backoffice's Eye Dropper editor -
 * with its opacity slider on, so a colour and its alpha are one value. The model stores #RRGGBB or
 * #RRGGBBAA everywhere; this keeps that shape whatever the picker hands back, and drops a fully
 * opaque alpha so "#FFFFFF" is not written as "#FFFFFFFF".
 *
 * The tag, `label`, `value` and the `change` event (`detail.value`) are unchanged from the native
 * swatch it replaces, so every colour field in the inspector upgraded at once.
 */
@customElement("di-colour-input")
export class DiColourInputElement extends UmbLitElement {
  @property({ type: String })
  value = "#FFFFFF";

  @property({ type: String })
  label = "Colour";

  #onChange(event: Event) {
    event.stopPropagation();

    const value = normaliseHex((event.target as HTMLElement & { value: string }).value);
    if (!value || value === normaliseHex(this.value)) return;


    this.value = value;
    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { value } }));
  }

  /**
   * The picker's swatch, and the value as text beside it: the compact picker shows only a swatch,
   * and a colour someone has been handed by a brand guide is typed, not dragged to.
   */
  override render() {
    return html`
      <div class="colour">
        <uui-color-picker
          label=${this.label}
          format="hex"
          opacity
          uppercase
          .value=${this.value}
          @change=${this.#onChange}></uui-color-picker>
        <uui-input
          label="${this.label} (hex)"
          spellcheck="false"
          .value=${this.value}
          @change=${this.#onChange}></uui-input>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    .colour {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      min-width: 0;
    }

    /* The picker's host is 100% wide by default, which leaves the hex field no room. */
    uui-color-picker {
      flex: 0 0 auto;
      width: auto;
    }

    uui-input {
      flex: 1 1 auto;
      min-width: 0;
    }
  `;
}

/**
 * `#RRGGBB` or `#RRGGBBAA`, upper case, from whatever hex the picker produced - three, four, six
 * or eight digits. Anything that is not hex is passed through untouched, so the validator can
 * still name it.
 */
export function normaliseHex(value: string | null | undefined): string {
  const raw = (value ?? "").trim();
  const hex = raw.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(hex) || ![3, 4, 6, 8].includes(hex.length)) return raw;

  const full = hex.length <= 4 ? [...hex].map((digit) => digit + digit).join("") : hex;
  const upper = full.toUpperCase();

  return upper.length === 8 && upper.endsWith("FF") ? `#${upper.slice(0, 6)}` : `#${upper}`;
}

export default DiColourInputElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-colour-input": DiColourInputElement;
  }
}
