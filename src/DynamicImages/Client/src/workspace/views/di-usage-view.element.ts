import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { ManifestWorkspaceView } from "@umbraco-cms/backoffice/workspace";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import { fetchUsage } from "../../api/dynamic-images-api.js";
import type { DiTemplate, DiUsage } from "../../api/types.js";

/** Which nodes this template covers, and which of them already have an image. */
@customElement("di-usage-view")
export class DiUsageViewElement extends UmbLitElement {
  /** Assigned by the workspace editor once the view is instantiated. */
  manifest?: ManifestWorkspaceView;

  #context?: DiTemplateWorkspaceContext;

  @state()
  private _template?: DiTemplate;

  @state()
  private _usage?: DiUsage;

  @state()
  private _loading = true;

  @state()
  private _onlyMissing = false;

  constructor() {
    super();

    this.consumeContext(DI_TEMPLATE_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
      if (!context) return;

      this.observe(context.template, (template) => {
        const isFirst = !this._template;
        this._template = template;
        if (template && isFirst) void this.#load();
      });
    });
  }

  async #load() {
    const template = this._template;
    if (!template || !this.#context) return;

    this._loading = true;

    try {
      this._usage = await fetchUsage(template.key, this.#context.getToken);
    } catch (error) {
      console.error("[DynamicImages] Failed to load usage", error);
      this._usage = undefined;
    } finally {
      this._loading = false;
    }
  }

  render() {
    if (this._loading) return html`<uui-loader></uui-loader>`;
    if (!this._usage) return html`<p class="empty">Save the template to see which content it applies to.</p>`;

    const items = this._onlyMissing ? this._usage.items.filter((item) => !item.hasImage) : this._usage.items;

    return html`
      <uui-box headline="Content using this template">
        <div slot="header-actions">
          <uui-button look="secondary" label="Reload" @click=${() => this.#load()}>Reload</uui-button>
        </div>

        <p class="summary">
          <strong>${this._usage.withImage}</strong> of <strong>${this._usage.total}</strong> have an image.
        </p>

        <uui-toggle
          label="Only show the ones without an image"
          ?checked=${this._onlyMissing}
          @change=${(event: Event) => {
            this._onlyMissing = (event.target as HTMLInputElement).checked;
          }}>
          Only without an image
        </uui-toggle>

        ${items.length === 0
          ? html`<p class="empty">Nothing to show.</p>`
          : html`<uui-table>
              <uui-table-head>
                <uui-table-head-cell>Name</uui-table-head-cell>
                <uui-table-head-cell>Image</uui-table-head-cell>
                <uui-table-head-cell>State</uui-table-head-cell>
              </uui-table-head>
              ${repeat(
                items,
                (item) => item.key,
                (item) => html`
                  <uui-table-row>
                    <uui-table-cell>${item.name}</uui-table-cell>
                    <uui-table-cell>
                      ${item.hasImage
                        ? html`<uui-tag color="positive" look="secondary">Has one</uui-tag>`
                        : html`<uui-tag color="warning" look="secondary">Missing</uui-tag>`}
                    </uui-table-cell>
                    <uui-table-cell>${item.isPublished ? "Published" : "Draft"}</uui-table-cell>
                  </uui-table-row>
                `,
              )}
            </uui-table>`}
      </uui-box>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
      overflow: auto;
    }

    .summary {
      margin: 0 0 var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
}

export default DiUsageViewElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-usage-view": DiUsageViewElement;
  }
}
