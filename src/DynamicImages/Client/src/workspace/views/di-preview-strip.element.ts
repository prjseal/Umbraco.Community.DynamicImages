import { css, customElement, html, nothing, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import { fetchPreview } from "../../api/dynamic-images-api.js";
import type { DiTemplate } from "../../api/types.js";

/** Long enough that a drag does not fire a render per frame, short enough to feel live. */
const PREVIEW_DEBOUNCE_MS = 400;

/**
 * The server-rendered thumbnail under the canvas - the ground truth the DOM canvas approximates.
 * Half-scale by default; the full-size render lives in the Preview & test view.
 */
@customElement("di-preview-strip")
export class DiPreviewStripElement extends UmbLitElement {
  #context?: DiTemplateWorkspaceContext;
  #timer?: number;
  #abort?: AbortController;
  #objectUrl?: string;

  /** The node picked in Preview & test, so the strip shows the same thing that view does. */
  #contentKey?: string;
  #useSampleData = true;

  @state()
  private _url?: string;

  @state()
  private _loading = false;

  @state()
  private _error?: string;

  @state()
  private _collapsed = false;

  constructor() {
    super();

    this.consumeContext(DI_TEMPLATE_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
      if (!context) return;

      this.observe(context.template, (template) => {
        if (template) this.#schedule(template);
      });
      this.observe(context.sampleContentKey, (key) => {
        this.#contentKey = key;

        const template = this.#context?.getData();
        if (template) this.#schedule(template);
      });
      this.observe(context.useSampleData, (value) => {
        this.#useSampleData = value ?? true;
      });
    });
  }

  /**
   * Render now, bypassing the debounce, and open the strip if it was collapsed. This is what the
   * toolbar's "Server preview" button does - the button emitted `di-request-preview` and nothing
   * listened for it, so it had never done anything at all.
   */
  refresh(): void {
    const template = this.#context?.getData();
    if (!template) return;

    window.clearTimeout(this.#timer);
    this._collapsed = false;

    void this.#render(template);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    window.clearTimeout(this.#timer);
    this.#abort?.abort();
    this.#revoke();
  }

  #revoke() {
    if (this.#objectUrl) {
      URL.revokeObjectURL(this.#objectUrl);
      this.#objectUrl = undefined;
    }
  }

  #schedule(template: DiTemplate) {
    if (this._collapsed) return;

    window.clearTimeout(this.#timer);
    this.#timer = window.setTimeout(() => void this.#render(template), PREVIEW_DEBOUNCE_MS);
  }

  async #render(template: DiTemplate) {
    if (!this.#context) return;

    // Abort whatever is still in flight: a drag makes previews stale faster than they arrive.
    this.#abort?.abort();
    this.#abort = new AbortController();

    this.#setBusy(true);
    this._error = undefined;

    try {
      // Both of these used to be hard-coded - `contentKey` to undefined through a
      // `cond ? undefined : undefined`, and `useSampleData` to true - so picking a node in
      // Preview & test never reached the strip under the canvas.
      const blob = await fetchPreview(
        template,
        {
          signal: this.#abort.signal,
          contentKey: this.#contentKey,
          useSampleData: this.#useSampleData,
        },
        this.#context.getToken,
      );

      this.#revoke();
      this.#objectUrl = URL.createObjectURL(blob);
      this._url = this.#objectUrl;
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return;

      this._error = error instanceof Error ? error.message : "The preview could not be rendered.";
    } finally {
      this.#setBusy(false);
    }
  }

  /** Announced so the toolbar's `previewing` property - which nothing ever set - can mean something. */
  #setBusy(busy: boolean) {
    this._loading = busy;
    this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: true, composed: true, detail: { busy } }));
  }

  render() {
    return html`
      <div class="strip">
        <button
          class="toggle"
          type="button"
          aria-expanded=${!this._collapsed}
          @click=${() => {
            this._collapsed = !this._collapsed;
            if (!this._collapsed) {
              const template = this.#context?.getData();
              if (template) this.#schedule(template);
            }
          }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed
          ? nothing
          : html`
              <div class="body">
                ${this._loading ? html`<uui-loader-bar></uui-loader-bar>` : nothing}
                ${this._error
                  ? html`<span class="error" role="status">${this._error}</span>`
                  : this._url
                    ? html`<img src=${this._url} alt="Server-rendered preview of this template" />`
                    : html`<span class="pending">Rendering…</span>`}
              </div>
            `}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .strip {
      padding: var(--uui-size-space-2) var(--uui-size-space-3);
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-1);
      border: 0;
      background: none;
      color: var(--uui-color-text-alt);
      font: inherit;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      cursor: pointer;
      padding: 0;
    }

    /* Both sizes are custom properties so the design view can collapse the strip's reserved
       space on a short window - the shadow boundary means it cannot reach these rules directly.
       See the (max-height: 720px) block in di-design-view. */
    .body {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3);
      margin-top: var(--uui-size-space-2);
      min-height: var(--di-preview-strip-body-min-height, 84px);
    }

    img {
      max-height: var(--di-preview-strip-image-max-height, 120px);
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-2);
    }

    @media (prefers-reduced-motion: no-preference) {
      img {
        animation: fade 160ms ease-out;
      }
    }

    @keyframes fade {
      from {
        opacity: 0;
      }
    }

    .error {
      color: var(--uui-color-danger);
      font-size: 12px;
    }

    .pending {
      color: var(--uui-color-text-alt);
      font-size: 12px;
    }
  `;
}

export default DiPreviewStripElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-preview-strip": DiPreviewStripElement;
  }
}
