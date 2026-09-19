import { css, customElement, html, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

/** Zoom, the display toggles, undo/redo and the way into a server render. */
@customElement("di-canvas-toolbar")
export class DiCanvasToolbarElement extends UmbLitElement {
  @property({ type: Number })
  zoom = 1;

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

  render() {
    return html`
      <div class="toolbar">
        <div class="zoom">
          <uui-button compact look="secondary" label="Zoom out" @click=${() => this.#emit("di-zoom-change", { zoom: this.zoom / 1.25 })}>
            <uui-icon name="icon-remove"></uui-icon>
          </uui-button>
          <span class="value">${Math.round(this.zoom * 100)}%</span>
          <uui-button compact look="secondary" label="Zoom in" @click=${() => this.#emit("di-zoom-change", { zoom: this.zoom * 1.25 })}>
            <uui-icon name="icon-add"></uui-icon>
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

    .value {
      min-width: 44px;
      text-align: center;
      font-variant-numeric: tabular-nums;
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
