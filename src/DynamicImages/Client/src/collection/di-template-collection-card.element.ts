import { css, customElement, html, ifDefined, nothing, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbDeselectedEvent, UmbSelectedEvent } from "@umbraco-cms/backoffice/event";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { fetchThumbnail } from "../api/dynamic-images-api.js";
import type { DiTemplateCollectionItemModel } from "./types.js";

/** Twice the card's width, so the thumbnail stays sharp on a high-density screen. */
const THUMBNAIL_WIDTH = 400;

/**
 * A template in the grid view: core's `uui-card-media`, as Media's grid uses, with the template
 * rendered against sample data as its picture. The name is the template's and the detail line is
 * its document types.
 * <p>
 * The thumbnail is fetched only once the card scrolls into view - the lazy loading an `<img
 * loading="lazy">` would give, which is not available here because the request needs a bearer
 * token - and the server caches one render per template per save.
 */
@customElement("di-template-collection-card")
export class DiTemplateCollectionCardElement extends UmbLitElement {
  @property({ type: Object })
  item?: DiTemplateCollectionItemModel;

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
  private _src?: string;

  @state()
  private _failed = false;

  #auth?: typeof UMB_AUTH_CONTEXT.TYPE;
  #observer?: IntersectionObserver;
  #loadedFor?: string;

  constructor() {
    super();
    this.consumeContext(UMB_AUTH_CONTEXT, (auth) => {
      this.#auth = auth;
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void this.#load();
    });
    this.#observer.observe(this);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
    if (this._src) URL.revokeObjectURL(this._src);
    this._src = undefined;
    this.#loadedFor = undefined;
  }

  async #load() {
    const item = this.item;
    // Keyed on the save as well as the template, so a card for an edited template refetches.
    const version = item ? `${item.unique}:${item.updated ?? ""}` : undefined;
    if (!item || item.isFolder || !version || this.#loadedFor === version) return;
    this.#loadedFor = version;

    try {
      const blob = await fetchThumbnail(item.unique, THUMBNAIL_WIDTH, () => this.#auth?.getLatestToken());
      if (this._src) URL.revokeObjectURL(this._src);
      this._src = URL.createObjectURL(blob);
      this._failed = false;
    } catch {
      this._failed = true;
    }
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

    return html`
      <uui-card-media
        name=${this.item.name}
        detail=${ifDefined(this.item.docTypes || undefined)}
        href=${ifDefined(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${this.#onSelected}
        @deselected=${this.#onDeselected}>
        ${this._src
          ? html`<img src=${this._src} alt=${this.item.name} />`
          : html`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === false ? html`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : nothing}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    `;
  }

  static override styles = [
    css`
      uui-card-media {
        height: 100%;
      }

      img {
        object-fit: contain;
      }

      slot[name="actions"] {
        --uui-button-background-color: var(--uui-color-surface);
        --uui-button-background-color-hover: var(--uui-color-surface);
      }
    `,
  ];
}

export { DiTemplateCollectionCardElement as element };

declare global {
  interface HTMLElementTagNameMap {
    "di-template-collection-card": DiTemplateCollectionCardElement;
  }
}
