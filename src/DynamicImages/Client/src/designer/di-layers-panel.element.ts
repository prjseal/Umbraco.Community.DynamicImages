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

  /** Collapsed by default, so the inspector above gets the side column's height. */
  @property({ type: Boolean, reflect: true })
  expanded = false;

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
        <h5>
          <!-- The panel is docked at the bottom and grows upwards, so the chevron points where the
               header is about to move: up to open, down to close - the same as the preview strip. -->
          <button
            class="toggle"
            type="button"
            aria-expanded=${this.expanded}
            @click=${() => (this.expanded = !this.expanded)}>
            <uui-icon name=${this.expanded ? "icon-navigation-down" : "icon-navigation-up"}></uui-icon>
            Layers <span class="count">(${reversed.length})</span>
          </button>
        </h5>

        ${this.expanded ? this.#renderList(reversed) : nothing}
      </div>
    `;
  }

  #renderList(reversed: DiLayer[]) {
    return html`
        ${reversed.length === 0
          ? html`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>`
          : repeat(
              reversed,
              (layer) => layer.key,
              (layer, index) => this.#renderRow(layer, index),
            )}

        ${this.#renderBackgroundRow()}
    `;
  }

  /**
   * The canvas itself, always at the bottom of the stack. Selecting it selects no layer, which is
   * what a click on bare stage does too, and the inspector shows its Canvas pane for that. Not
   * draggable and not a drop target: nothing can go underneath the background.
   *
   * The text stays exactly "Background" - `e2e/helpers.ts` filters the rows on it.
   */
  #renderBackgroundRow() {
    const selected = !this.selectedLayerKey;
    const select = () => this.#emit("di-layer-select", { key: undefined });

    return html`
      <div
        class="row background ${selected ? "selected" : ""}"
        role="button"
        tabindex="0"
        aria-pressed=${selected}
        title="Canvas settings: size, fill and base image"
        @click=${select}
        @keydown=${(event: KeyboardEvent) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          select();
        }}>
        <uui-icon name="icon-picture"></uui-icon>
        <span class="name">Background</span>
      </div>
    `;
  }

  /**
   * The visibility button shows `icon-eye` in both states, with the state carried by the button's
   * look and a dimmed glyph - the pattern di-canvas-toolbar's own toggles use. The hidden state
   * used to ask for an eye-with-a-slash, which is not in Umbraco 17's registry under any name, so
   * it rendered blank; there is no such glyph at all, and an unrelated one would read worse than
   * the look does. The label already says Hide/Show, so the accessible name was never the problem.
   * `icon-contract.test.ts` now fails on any name the registry does not have.
   */
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
          class="visibility ${layer.isVisible ? "" : "off"}"
          look=${layer.isVisible ? "primary" : "secondary"}
          label="${layer.isVisible ? "Hide" : "Show"} ${layer.name}"
          @click=${(event: Event) => {
            event.stopPropagation();
            this.#emit("di-layer-visibility", { key: layer.key, isVisible: !layer.isVisible });
          }}>
          <uui-icon name="icon-eye"></uui-icon>
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
    /* max-height: 40% resolved against the grid row the panel had already been given, so 60%
       of that row was guaranteed waste - 92px of panel in a 228.8px row, with the list clipped
       mid-row and grey space beneath it. The cap is now against the viewport instead, and the
       scroll moved to .panel so the host can size to its content the way the side column's
       auto row intends. This is also what was clipping the empty-state sentence on a new
       template. */
    :host {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
      min-height: 0;
      max-height: min(50vh, 100%);
    }

    .panel {
      padding: var(--uui-size-space-3);
      min-height: 0;
      overflow: auto;
    }

    h5 {
      margin: 0 0 var(--uui-size-space-2);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--uui-color-text-alt);
    }

    :host(:not([expanded])) h5 {
      margin-bottom: 0;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-1);
      width: 100%;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      text-transform: inherit;
      letter-spacing: inherit;
      cursor: pointer;
      padding: 0;
    }

    .count {
      text-transform: none;
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

    /* The hidden state has no icon of its own to show, so it is carried by the look plus a
       dimmed glyph - the same visual language as the toolbar's toggles. */
    .visibility.off uui-icon {
      opacity: 0.45;
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
