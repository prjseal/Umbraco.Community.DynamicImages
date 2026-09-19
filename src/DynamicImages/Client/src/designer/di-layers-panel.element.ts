import { css, customElement, html, nothing, property, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { DiLayer } from "../api/types.js";

const TYPE_ICONS: Record<DiLayer["type"], string> = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers",
};

/**
 * The z-order stack, newest on top. Reversed relative to the model, because "on top of the
 * image" should be "at the top of the list" - the array order is bottom-up for the renderer.
 */
@customElement("di-layers-panel")
export class DiLayersPanelElement extends UmbLitElement {
  @property({ type: Array })
  layers: DiLayer[] = [];

  @property({ type: String })
  selectedLayerKey?: string;

  @state()
  private _dragKey?: string;

  @state()
  private _dropIndex?: number;

  #emit(name: string, detail: unknown) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  #onDragStart(event: DragEvent, key: string) {
    this._dragKey = key;
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  }

  #onDragOver(event: DragEvent, displayIndex: number) {
    if (!this._dragKey) return;

    event.preventDefault();
    this._dropIndex = displayIndex;
  }

  #onDrop(event: DragEvent) {
    if (!this._dragKey || this._dropIndex === undefined) return;

    event.preventDefault();

    // The panel shows the stack reversed, so a display index has to be flipped back into the
    // model's bottom-up array index.
    const modelIndex = this.layers.length - 1 - this._dropIndex;
    this.#emit("di-layer-move", { key: this._dragKey, toIndex: Math.max(0, modelIndex) });

    this._dragKey = undefined;
    this._dropIndex = undefined;
  }

  render() {
    const reversed = [...this.layers].reverse();

    return html`
      <div class="panel" @drop=${this.#onDrop}>
        <h5>Layers</h5>

        ${reversed.length === 0
          ? html`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>`
          : repeat(
              reversed,
              (layer) => layer.key,
              (layer, index) => this.#renderRow(layer, index),
            )}

        <div class="row background">
          <uui-icon name="icon-picture"></uui-icon>
          <span class="name">Background</span>
          <uui-icon name="icon-lock" title="The base image and canvas colour are edited in the inspector"></uui-icon>
        </div>
      </div>
    `;
  }

  #renderRow(layer: DiLayer, displayIndex: number) {
    const selected = layer.key === this.selectedLayerKey;

    return html`
      <div
        class="row ${selected ? "selected" : ""} ${this._dropIndex === displayIndex ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${selected}
        @dragstart=${(event: DragEvent) => this.#onDragStart(event, layer.key)}
        @dragover=${(event: DragEvent) => this.#onDragOver(event, displayIndex)}
        @click=${() => this.#emit("di-layer-select", { key: layer.key })}>
        <uui-icon name=${TYPE_ICONS[layer.type]}></uui-icon>
        <span class="name" title=${layer.name}>${layer.name || layer.type}</span>

        <uui-button
          compact
          look="secondary"
          label="${layer.isVisible ? "Hide" : "Show"} ${layer.name}"
          @click=${(event: Event) => {
            event.stopPropagation();
            this.#emit("di-layer-visibility", { key: layer.key, isVisible: !layer.isVisible });
          }}>
          <uui-icon name=${layer.isVisible ? "icon-eye" : "icon-eye-off"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${layer.isLocked ? "Unlock" : "Lock"} ${layer.name}"
          @click=${(event: Event) => {
            event.stopPropagation();
            this.#emit("di-layer-lock", { key: layer.key, isLocked: !layer.isLocked });
          }}>
          <uui-icon name=${layer.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${layer.name}"
          @click=${(event: Event) => {
            event.stopPropagation();
            this.#emit("di-layer-duplicate", { key: layer.key });
          }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${layer.name}"
          @click=${(event: Event) => {
            event.stopPropagation();
            this.#emit("di-layer-delete", { key: layer.key });
          }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
      max-height: 40%;
      overflow: auto;
    }

    .panel {
      padding: var(--uui-size-space-3);
    }

    h5 {
      margin: 0 0 var(--uui-size-space-2);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--uui-color-text-alt);
    }

    .row {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-1);
      padding: var(--uui-size-space-1) var(--uui-size-space-2);
      border-radius: var(--uui-border-radius);
      cursor: pointer;
      font-size: 13px;
    }

    .row:hover {
      background: var(--uui-color-surface-alt);
    }

    .row.selected {
      background: var(--uui-color-selected);
      color: var(--uui-color-selected-contrast, inherit);
    }

    .row.drop {
      box-shadow: inset 0 2px 0 var(--uui-color-focus);
    }

    .row.background {
      opacity: 0.6;
      cursor: default;
    }

    .name {
      flex: 1 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .empty {
      margin: 0;
      font-size: 13px;
      color: var(--uui-color-text-alt);
    }
  `;
}

export default DiLayersPanelElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-layers-panel": DiLayersPanelElement;
  }
}
