import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { ManifestWorkspaceView } from "@umbraco-cms/backoffice/workspace";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import { DI_SAMPLE_NODE_PICKER_MODAL } from "../../modals/tokens.js";
import { fetchLayout, fetchPreview, regenerateDocument } from "../../api/dynamic-images-api.js";
import type { DiLayer, DiLayerBounds, DiLayerSkip, DiSampleContentItem, DiTemplate } from "../../api/types.js";

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

  /** The layers that produced nothing, with why - see DiLayerSkip. */
  @state()
  private _skipped: DiLayerSkip[] = [];

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
        const isFirst = !this._template;
        this._template = template;

        // The remembered node is keyed by the template, so it can only be restored once the
        // template is known - which is here, not in connectedCallback.
        if (template && isFirst) void this.#restoreRememberedNode();
      });
    });
  }

  /**
   * Re-selects whichever node was last previewed for this template, so returning to the tab does
   * not mean picking it again - and, crucially, tells the workspace context as well. Without
   * that last part the restored node reached only this view: after a full page load the
   * designer's preview strip went on showing sample data while the picker here already read the
   * right node's name.
   */
  async #restoreRememberedNode(): Promise<void> {
    const remembered = this.#rememberedNode();
    if (!remembered) return;

    this._sampleNode = remembered;
    this.#context?.setSampleContentKey(remembered.key);

    await this.#render();
  }

  override connectedCallback() {
    super.connectedCallback();

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

  async #render() {
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
      this._skipped = layout.skipped ?? [];

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

          <p class="hint">
            Choose a content item above to preview this template against a real title and image.
          </p>
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._template.layers.length === 0
            ? html`<p class="empty">This template has no layers yet.</p>`
            : html`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${repeat(
                  // A row per *template layer*, not per bounds. A layer that resolved to nothing
                  // used to be dropped from this table entirely - no row, no note, no reason -
                  // which is exactly when an editor most needs telling.
                  this._template.layers,
                  (layer) => layer.key,
                  (layer) => this.#renderLayerRow(layer),
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

  /** One row per layer: what it drew, or a muted note saying it did not and why. */
  #renderLayerRow(layer: DiLayer) {
    const bounds = this._bounds.find((candidate) => candidate.key === layer.key);

    if (!bounds) {
      const reason = this._skipped.find((skip) => skip.key === layer.key)?.reason;

      return html`
        <uui-table-row class="not-drawn">
          <uui-table-cell>${layer.name || layer.type}</uui-table-cell>
          <uui-table-cell colspan="3">
            <span class="reason">not drawn${reason ? ` — ${reason}` : ""}</span>
          </uui-table-cell>
        </uui-table-row>
      `;
    }

    return html`
      <uui-table-row>
        <uui-table-cell>${layer.name || layer.type}</uui-table-cell>
        <uui-table-cell>
          ${bounds.resolvedText ?? html`<em>—</em>`}
          ${bounds.truncated ? html`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : nothing}
        </uui-table-cell>
        <uui-table-cell>${Math.round(bounds.x)}, ${Math.round(bounds.y)}</uui-table-cell>
        <uui-table-cell>${Math.round(bounds.width)} × ${Math.round(bounds.height)}</uui-table-cell>
      </uui-table-row>
    `;
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

    .hint {
      margin: var(--uui-size-space-4) 0 0;
      font-size: 12px;
      color: var(--uui-color-text-alt);
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

    .not-drawn {
      color: var(--uui-color-text-alt);
    }

    .reason {
      font-style: italic;
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
