import { css, customElement, html, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { ZOOM_BOUNDS } from "../inputs/number-bounds.js";
import "../inputs/di-number-field.element.js";

/** Zoom, the display toggles, undo/redo and the way into a server render. */
@customElement("di-canvas-toolbar")
export class DiCanvasToolbarElement extends UmbLitElement {
  /**
   * The scale the canvas is actually drawing at, which is not the same thing as `zoom`: the
   * stage is sized to fit rather than transformed, so an unset zoom means "fit" and reading 100%
   * there was simply wrong - the review measured a 1200x630 canvas at a 326px stage, about 27%,
   * while the toolbar read 100%. The canvas announces this through `di-scale-change`.
   */
  @property({ type: Number })
  effectiveScale = 1;

  @property({ type: Boolean })
  snapEnabled = true;

  @property({ type: Boolean })
  showRulers = true;

  @property({ type: Boolean })
  showSafeArea = false;

  @property({ type: Boolean })
  showMeasured = false;

  @property({ type: Boolean })
  canUndo = false;

  @property({ type: Boolean })
  canRedo = false;

  @property({ type: Boolean })
  previewing = false;

  #emit(name: string, detail?: unknown) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  /** The percentage last pushed into the field, so a re-render mid-typing can repeat it. */
  #shownPercent = 100;

  /**
   * The percentage is a real input now, so it must not be rewritten under the cursor.
   * `effectiveScale` arrives again on every canvas resize and on every drag that reflows an
   * auto-height layer, and each one re-renders this toolbar - without this guard, typing "150"
   * would be replaced by the current scale somewhere around the "5".
   *
   * Repeating the previous number rather than returning nothing is the point: an unchanged binding
   * is one lit does not commit, so di-number-field never re-renders and the half-typed text stands.
   * Returning undefined would blank the field instead, which is worse than overwriting it.
   */
  #percentToShow(): number {
    if (!this.matches(":focus-within")) this.#shownPercent = Math.round(this.effectiveScale * 100);
    return this.#shownPercent;
  }

  /**
   * di-number-field has already clamped what was typed into the percent range and written the
   * corrected value back into the input. `null` is an emptied field, which is not a zoom.
   *
   * The listener is bound on the toolbar row, so it reads the detail defensively rather than
   * destructuring it: a bare `change` from some other control in that row carries none.
   */
  #onPercentChange(event: Event) {
    const value = (event as CustomEvent<{ value: number | null } | undefined>).detail?.value;
    if (value === null || value === undefined) return;

    this.#emit("di-zoom-change", { zoom: value / 100 });
  }

  /**
   * The zoom buttons carry the registry's matched `icon-zoom-out` / `icon-zoom-in` magnifier pair.
   * Zoom out used to carry the registry's *remove* icon, which in Umbraco 17 resolves to
   * lucide-trash-2 - a wastebasket - so the control read as [bin] 27% [+] and the minus looked
   * missing entirely. `zoom-controls.browser.test.ts` asserts what actually renders here, since a
   * name that exists but draws the wrong picture is invisible to `icon-contract.test.ts`.
   *
   * Neither old name is spelled out anywhere in this file on purpose: the bundle under wwwroot is
   * committed unminified, comments and all, so grepping the built output for a bad icon name is a
   * real check and a comment quoting one would defeat it.
   */
  render() {
    return html`
      <div class="toolbar" @focusout=${() => this.requestUpdate()}>
        <div class="zoom">
          <!-- Stepping multiplies the *effective* scale, so stepping up out of Fit lands one
               step above what is on screen rather than jumping to 125%. -->
          <uui-button
            compact
            look="secondary"
            label="Zoom out"
            @click=${() => this.#emit("di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            compact
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${ZOOM_BOUNDS.min * 100}
            .max=${ZOOM_BOUNDS.max * 100}
            .value=${this.#percentToShow()}
            @change=${this.#onPercentChange}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => this.#emit("di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => this.#emit("di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${this.#renderToggle("Snap", this.snapEnabled, "di-toggle-snap")}
          ${this.#renderToggle("Rulers", this.showRulers, "di-toggle-rulers")}
          ${this.#renderToggle("Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${this.#renderToggle("Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => this.#emit("di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => this.#emit("di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => this.#emit("di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }

  #renderToggle(label: string, active: boolean, event: string) {
    return html`
      <uui-button
        compact
        look=${active ? "primary" : "secondary"}
        label="${label}: ${active ? "on" : "off"}"
        @click=${() => this.#emit(event)}>
        ${label}
      </uui-button>
    `;
  }

  static styles = css`
    :host {
      display: block;
      border-bottom: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-4);
      padding: var(--uui-size-space-2) var(--uui-size-space-3);
      flex-wrap: wrap;
    }

    .zoom,
    .toggles,
    .actions {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-1);
    }

    .actions {
      margin-left: auto;
    }

    /* A fixed narrow width, so the toolbar row does not shuffle sideways as the readout goes
       from 27 to 100 to 400. This is what the old span's min-width was for. */
    .value {
      width: 72px;
      font-size: 12px;
    }
  `;
}

export default DiCanvasToolbarElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-canvas-toolbar": DiCanvasToolbarElement;
  }
}
