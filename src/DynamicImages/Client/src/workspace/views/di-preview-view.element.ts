import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { ManifestWorkspaceView } from "@umbraco-cms/backoffice/workspace";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import { DI_SAMPLE_NODE_PICKER_MODAL } from "../../modals/tokens.js";
import { fetchLayout, fetchPreview, regenerateDocument } from "../../api/dynamic-images-api.js";
import type { DiLayerBounds, DiSampleContentItem, DiTemplate } from "../../api/types.js";

/** Title lengths worth checking a design against before it meets real content. */
const TITLE_PRESETS = [
  { label: "Short", value: "Ship it" },
  { label: "Typical", value: "Designing social share images that actually get clicked" },
  {
    label: "Very long",
    value:
      "Everything you ever wanted to know about generating Open Graph images from your content, and rather more besides",
  },
];

/** The full-size server render, what each layer resolved to, and the way to regenerate one node. */
@customElement("di-preview-view")
export class DiPreviewViewElement extends UmbLitElement {
  /** Assigned by the workspace editor once the view is instantiated. */
  manifest?: ManifestWorkspaceView;

  #context?: DiTemplateWorkspaceContext;
  #modalContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;
  #abort?: AbortController;
  #objectUrl?: string;

  @state()
  private _template?: DiTemplate;

  @state()
  private _sampleNode?: DiSampleContentItem;

  @state()
  private _bounds: DiLayerBounds[] = [];

  @state()
  private _url?: string;

  @state()
  private _loading = false;

  @state()
  private _error?: string;

  @state()
  private _regenerating = false;

  constructor() {
    super();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (context) => {
      this.#modalContext = context;
    });
    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
      this.#notificationContext = context;
    });
    this.consumeContext(DI_TEMPLATE_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
      if (!context) return;

      this.observe(context.template, (template) => {
        this._template = template;
      });
    });
  }

  override connectedCallback() {
    super.connectedCallback();

    // Restore whichever node was last previewed for this template, so returning to the tab does
    // not mean picking it again.
    const remembered = this.#rememberedNode();
    if (remembered) this._sampleNode = remembered;

    void this.#render();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#abort?.abort();
    this.#revoke();
  }

  #storageKey(): string {
    return `di:sample-node:${this._template?.key ?? "new"}`;
  }

  #rememberedNode(): DiSampleContentItem | undefined {
    try {
      const raw = localStorage.getItem(this.#storageKey());
      return raw ? (JSON.parse(raw) as DiSampleContentItem) : undefined;
    } catch {
      // Private mode, blocked storage - the picker just starts empty.
      return undefined;
    }
  }

  #remember(item?: DiSampleContentItem) {
    try {
      if (item) localStorage.setItem(this.#storageKey(), JSON.stringify(item));
      else localStorage.removeItem(this.#storageKey());
    } catch {
      // Not being able to remember the choice is not worth telling anyone about.
    }
  }

  #revoke() {
    if (this.#objectUrl) {
      URL.revokeObjectURL(this.#objectUrl);
      this.#objectUrl = undefined;
    }
  }

  async #pickNode() {
    if (!this.#modalContext || !this._template) return;

    const modal = this.#modalContext.open(this, DI_SAMPLE_NODE_PICKER_MODAL, {
      data: { docTypeAliases: this._template.docTypeAliases, selectedKey: this._sampleNode?.key },
    });

    const result = await modal?.onSubmit().catch(() => undefined);
    if (!result) return;

    this._sampleNode = result.item;
    this.#remember(result.item);
    this.#context?.setSampleContentKey(result.item?.key);

    await this.#render();
  }

  async #useSampleTitle(title: string) {
    // The preset only affects the preview; it is a way of stress-testing the design, not an edit.
    if (!this._template) return;

    this._sampleNode = undefined;
    this.#remember(undefined);

    await this.#render(title);
  }

  async #render(_sampleTitle?: string) {
    const template = this._template;
    if (!template || !this.#context) return;

    this.#abort?.abort();
    this.#abort = new AbortController();

    this._loading = true;
    this._error = undefined;

    const options = {
      signal: this.#abort.signal,
      contentKey: this._sampleNode?.key,
      useSampleData: !this._sampleNode,
      // Full size here - this view is where fidelity matters.
      scale: 1,
    };

    try {
      const [blob, layout] = await Promise.all([
        fetchPreview(template, options, this.#context.getToken),
        fetchLayout(template, options, this.#context.getToken),
      ]);

      this.#revoke();
      this.#objectUrl = URL.createObjectURL(blob);
      this._url = this.#objectUrl;
      this._bounds = layout.layers;

      this.#context.setServerBounds(layout.layers);
      this.#context.setIssues(layout.issues);
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return;

      this._error = error instanceof Error ? error.message : "The preview could not be rendered.";
    } finally {
      this._loading = false;
    }
  }

  async #regenerateThisNode() {
    if (!this._sampleNode || !this.#context) return;

    this._regenerating = true;

    try {
      const result = await regenerateDocument(this._sampleNode.key, this.#context.getToken);

      this.#notificationContext?.peek(result.outcome === "generated" ? "positive" : "warning", {
        data: { message: `'${this._sampleNode.name}': ${result.outcome}` },
      });
    } catch (error) {
      this.#notificationContext?.peek("danger", {
        data: {
          headline: "The image could not be regenerated",
          message: error instanceof Error ? error.message : "",
        },
      });
    } finally {
      this._regenerating = false;
    }
  }

  #download() {
    if (!this._url || !this._template) return;

    const link = document.createElement("a");
    link.href = this._url;
    link.download = `${this._template.alias || "preview"}.${this._template.output.format}`;
    link.click();
  }

  render() {
    if (!this._template) return html`<uui-loader></uui-loader>`;

    return html`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${this.#pickNode}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => this.#render()}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${this.#download}>
              Download
            </uui-button>
          </div>

          ${this._loading ? html`<uui-loader-bar></uui-loader-bar>` : nothing}
          ${this._error
            ? html`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>`
            : this._url
              ? html`<img class="render" src=${this._url} alt="Rendered preview of this template" />`
              : nothing}

          <div class="presets">
            <span>Try a title length:</span>
            ${repeat(
              TITLE_PRESETS,
              (preset) => preset.label,
              (preset) => html`
                <uui-button
                  compact
                  look="secondary"
                  label="Preview with a ${preset.label.toLowerCase()} title"
                  @click=${() => this.#useSampleTitle(preset.value)}>
                  ${preset.label}
                </uui-button>
              `,
            )}
          </div>
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._bounds.length === 0
            ? html`<p class="empty">Nothing was drawn. Check the layers are visible and have values.</p>`
            : html`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${repeat(
                  this._bounds,
                  (bounds) => bounds.key,
                  (bounds) => html`
                    <uui-table-row>
                      <uui-table-cell>${this.#layerName(bounds.key)}</uui-table-cell>
                      <uui-table-cell>
                        ${bounds.resolvedText ?? html`<em>—</em>`}
                        ${bounds.truncated ? html`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : nothing}
                      </uui-table-cell>
                      <uui-table-cell>${Math.round(bounds.x)}, ${Math.round(bounds.y)}</uui-table-cell>
                      <uui-table-cell>${Math.round(bounds.width)} × ${Math.round(bounds.height)}</uui-table-cell>
                    </uui-table-row>
                  `,
                )}
              </uui-table>`}
        </uui-box>

        ${this._sampleNode
          ? html`<uui-box headline="This node">
              <p>
                Regenerating writes a new image into
                <code>${this._template.targetPropertyAlias || "the target property"}</code> on
                <strong>${this._sampleNode.name}</strong>, replacing the existing media file in place.
              </p>
              <uui-button
                look="primary"
                color="positive"
                label="Regenerate the image for ${this._sampleNode.name}"
                ?disabled=${this._regenerating}
                @click=${this.#regenerateThisNode}>
                Regenerate this node
              </uui-button>
            </uui-box>`
          : nothing}
      </div>
    `;
  }

  #layerName(key: string): string {
    const layer = this._template?.layers.find((candidate) => candidate.key === key);
    return layer?.name || layer?.type || key.slice(0, 8);
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
      overflow: auto;
    }

    .grid {
      display: grid;
      gap: var(--uui-size-layout-1);
      max-width: 1200px;
    }

    .actions {
      display: flex;
      gap: var(--uui-size-space-2);
      flex-wrap: wrap;
    }

    .render {
      display: block;
      max-width: 100%;
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-2);
    }

    .presets {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      margin-top: var(--uui-size-space-4);
      font-size: 12px;
      color: var(--uui-color-text-alt);
      flex-wrap: wrap;
    }

    .error {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      color: var(--uui-color-danger);
    }

    .empty {
      color: var(--uui-color-text-alt);
      margin: 0;
    }

    code {
      background: var(--uui-color-surface-alt);
      padding: 0 4px;
      border-radius: 2px;
    }
  `;
}

export default DiPreviewViewElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-preview-view": DiPreviewViewElement;
  }
}
