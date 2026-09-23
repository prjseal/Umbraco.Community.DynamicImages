import { css, customElement, html, ifDefined, nothing, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbDeselectedEvent, UmbSelectedEvent } from "@umbraco-cms/backoffice/event";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { fontFamilyFor, loadFont } from "../../designer/fonts/font-face-loader.js";
import type { DiFontCollectionItemModel } from "./types.js";

/**
 * A family or variant in a Fonts grid: core's `uui-card-media`, with a specimen set in the real
 * typeface as its picture - the family's regular upright, or the variant itself. A folder is its
 * icon, as in the Templates grid.
 */
@customElement("di-font-collection-card")
export class DiFontCollectionCardElement extends UmbLitElement {
  @property({ type: Object })
  item?: DiFontCollectionItemModel;

  @property({ type: Boolean })
  selectable = false;

  @property({ type: Boolean })
  selected = false;

  @property({ type: Boolean, attribute: "select-only" })
  selectOnly = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  href?: string;

  @state()
  private _loaded = false;

  #auth?: typeof UMB_AUTH_CONTEXT.TYPE;
  #loadedFor?: string;

  constructor() {
    super();
    this.consumeContext(UMB_AUTH_CONTEXT, (auth) => {
      this.#auth = auth;
      this.#load();
    });
  }

  override willUpdate(changed: Map<PropertyKey, unknown>) {
    super.willUpdate(changed);
    if (changed.has("item")) this.#load();
  }

  /** The loader keeps one FontFace per variant, so a family's cards and its variants' share them. */
  #load() {
    const key = this.item?.sampleFontKey;
    const auth = this.#auth;
    if (!auth || !key || this.#loadedFor === key) return;

    this.#loadedFor = key;
    this._loaded = false;
    void loadFont(key, () => auth.getLatestToken()).then((face) => {
      if (this.#loadedFor === key) this._loaded = !!face;
    });
  }

  #onSelected(event: Event) {
    if (!this.item) return;
    event.stopPropagation();
    this.dispatchEvent(new UmbSelectedEvent(this.item.unique));
  }

  #onDeselected(event: Event) {
    if (!this.item) return;
    event.stopPropagation();
    this.dispatchEvent(new UmbDeselectedEvent(this.item.unique));
  }

  override render() {
    if (!this.item) return nothing;

    const detail = this.item.isFolder
      ? undefined
      : this.item.variants
        ? `${this.item.variants} variant${this.item.variants === "1" ? "" : "s"}`
        : [this.item.style, this.item.source].filter(Boolean).join(" · ");

    return html`
      <uui-card-media
        name=${this.item.name}
        detail=${ifDefined(detail)}
        href=${ifDefined(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${this.#onSelected}
        @deselected=${this.#onDeselected}>
        ${this.item.sampleFontKey && this._loaded
          ? html`<div class="specimen" style="font-family: ${fontFamilyFor(this.item.sampleFontKey)}, serif">Aa Bb</div>`
          : html`<umb-icon name=${this.item.icon}></umb-icon>`}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    `;
  }

  static override styles = [
    css`
      uui-card-media {
        height: 100%;
      }

      .specimen {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 48px;
        line-height: 1;
      }

      slot[name="actions"] {
        --uui-button-background-color: var(--uui-color-surface);
        --uui-button-background-color-hover: var(--uui-color-surface);
      }
    `,
  ];
}

export { DiFontCollectionCardElement as element };

declare global {
  interface HTMLElementTagNameMap {
    "di-font-collection-card": DiFontCollectionCardElement;
  }
}
