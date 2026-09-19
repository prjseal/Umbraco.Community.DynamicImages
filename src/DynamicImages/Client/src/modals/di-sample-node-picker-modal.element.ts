import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { fetchSampleContent, type TokenGetter } from "../api/dynamic-images-api.js";
import type { DiSampleContentItem } from "../api/types.js";
import type { SampleNodePickerData, SampleNodePickerValue } from "./tokens.js";

/**
 * Picks a real node to preview against. Scoped to the template's own document types, because a
 * node of any other type would have none of the properties the layers read.
 */
@customElement("di-sample-node-picker-modal")
export class DiSampleNodePickerModalElement extends UmbModalBaseElement<SampleNodePickerData, SampleNodePickerValue> {
  #authContext?: typeof UMB_AUTH_CONTEXT.TYPE;
  #searchTimer?: number;

  @state()
  private _items: DiSampleContentItem[] = [];

  @state()
  private _loading = true;

  @state()
  private _search = "";

  constructor() {
    super();

    this.consumeContext(UMB_AUTH_CONTEXT, (context) => {
      this.#authContext = context;
      if (context) void this.#load();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.clearTimeout(this.#searchTimer);
  }

  #getToken: TokenGetter = () => this.#authContext?.getLatestToken();

  async #load() {
    const aliases = this.data?.docTypeAliases ?? [];
    if (aliases.length === 0) {
      this._items = [];
      this._loading = false;
      return;
    }

    this._loading = true;

    try {
      // One request per document type, merged - the endpoint is per-type by design, and there are
      // rarely more than a handful.
      const pages = await Promise.all(
        aliases.map((alias) =>
          fetchSampleContent(alias, this._search, 0, 30, this.#getToken).catch(() => ({ total: 0, items: [] })),
        ),
      );

      this._items = pages.flatMap((page) => page.items);
    } finally {
      this._loading = false;
    }
  }

  #onSearch(event: Event) {
    this._search = (event.target as HTMLInputElement).value;

    window.clearTimeout(this.#searchTimer);
    this.#searchTimer = window.setTimeout(() => void this.#load(), 300);
  }

  #choose(item?: DiSampleContentItem) {
    this.value = { item };
    this._submitModal();
  }

  render() {
    return html`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${this.#onSearch}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => this.#choose(undefined)}>
          Use sample data
        </uui-button>

        ${this._loading
          ? html`<uui-loader></uui-loader>`
          : this._items.length === 0
            ? html`<p class="empty">No content of the selected document types was found.</p>`
            : html`<uui-ref-list>
                ${repeat(
                  this._items,
                  (item) => item.key,
                  (item) => html`
                    <uui-ref-node
                      name=${item.name}
                      detail=${item.isPublished ? "Published" : "Draft"}
                      ?selected=${item.key === this.data?.selectedKey}
                      @open=${() => this.#choose(item)}
                      @click=${() => this.#choose(item)}>
                    </uui-ref-node>
                  `,
                )}
              </uui-ref-list>`}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }

  static styles = css`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
}

export default DiSampleNodePickerModalElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-sample-node-picker-modal": DiSampleNodePickerModalElement;
  }
}
