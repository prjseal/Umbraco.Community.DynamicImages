import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { ManifestDashboard } from "@umbraco-cms/backoffice/dashboard";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { DiApiError, deleteFont, fetchFonts, refreshFont, updateFont, type TokenGetter } from "../api/dynamic-images-api.js";
import { fontFamilyFor, forgetFont, loadFonts } from "../designer/fonts/font-face-loader.js";
import { DI_FONT_UPLOAD_MODAL } from "../modals/tokens.js";
import type { DiFont, DiFontStyle } from "../api/types.js";

/** Where a font's file lives, as the row's meta line shows it. */
function sourceLabel(font: DiFont): string {
  switch (font.sourceKind) {
    case "path":
      return font.path ?? "wwwroot";
    case "url":
      if (font.provider === "google") return `Google Fonts · ${font.providerFamily ?? font.familyName}`;
      if (font.provider === "bunny") return `Bunny Fonts · ${font.providerFamily ?? font.familyName}`;
      return hostOf(font.sourceUrl);
    default:
      return "Media library";
  }
}

function hostOf(url?: string | null): string {
  try {
    return url ? new URL(url).host : "Web";
  } catch {
    return url ?? "Web";
  }
}

/** Manages the fonts templates can use, with a live specimen of each so they can be told apart. */
@customElement("di-fonts-dashboard")
export class DiFontsDashboardElement extends UmbLitElement {
  /** Assigned by the extension host once the dashboard is instantiated. */
  manifest?: ManifestDashboard;

  #authContext?: typeof UMB_AUTH_CONTEXT.TYPE;
  #modalContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  @state()
  private _fonts: DiFont[] = [];

  @state()
  private _loading = true;

  @state()
  private _editingKey?: string;

  constructor() {
    super();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (context) => {
      this.#modalContext = context;
    });
    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
      this.#notificationContext = context;
    });
    this.consumeContext(UMB_AUTH_CONTEXT, (context) => {
      this.#authContext = context;
      if (context) void this.#load();
    });
  }

  #getToken: TokenGetter = () => this.#authContext?.getLatestToken();

  async #load() {
    this._loading = true;

    try {
      this._fonts = await fetchFonts(this.#getToken);

      // The specimens are drawn in the real typeface, which means loading every file.
      await loadFonts(this._fonts.map((font) => font.key), this.#getToken);
    } catch (error) {
      this.#notify("danger", "The fonts could not be loaded", error);
    } finally {
      this._loading = false;
    }
  }

  #notify(colour: "positive" | "warning" | "danger", headline: string, error?: unknown) {
    const message =
      error instanceof DiApiError ? error.detail ?? error.message : error instanceof Error ? error.message : "";

    if (error) console.error("[DynamicImages]", headline, error);
    this.#notificationContext?.peek(colour, { data: { headline, message } });
  }

  async #addFont() {
    if (!this.#modalContext) return;

    const modal = this.#modalContext.open(this, DI_FONT_UPLOAD_MODAL, {});
    const result = await modal?.onSubmit().catch(() => undefined);

    if (!result?.uploaded) return;

    // The modal closes as soon as one row exists; the variants that were not added are told here.
    if (result.warnings?.length) {
      this.#notificationContext?.peek("warning", {
        data: { headline: "Some variants were not added", message: result.warnings.join(" ") },
      });
    }

    await this.#load();
  }

  async #refreshFont(font: DiFont) {
    try {
      await refreshFont(font.key, this.#getToken);

      // The loader is keyed by font key, not hash, so it has to forget the old bytes.
      forgetFont(font.key);

      this.#notify("positive", `'${font.familyName}' refreshed`);
      await this.#load();
    } catch (error) {
      this.#notify("danger", "That font could not be refreshed", error);
    }
  }

  async #deleteFont(font: DiFont) {
    await umbConfirmModal(this, {
      headline: `Delete '${font.familyName}'?`,
      content: "Templates using it will stop rendering their text until another font is chosen.",
      confirmLabel: "Delete",
      color: "danger",
    });

    try {
      await deleteFont(font.key, this.#getToken);
      forgetFont(font.key);

      this.#notify("positive", `'${font.familyName}' deleted`);
      await this.#load();
    } catch (error) {
      // A 409 names the templates still using it, which is the useful part of the message.
      this.#notify("danger", "That font could not be deleted", error);
    }
  }

  async #saveStyles(font: DiFont, familyName: string, styles: DiFontStyle[]) {
    try {
      await updateFont(font.key, familyName, styles, this.#getToken);

      this._editingKey = undefined;
      this.#notify("positive", `'${familyName}' saved`);

      await this.#load();
    } catch (error) {
      this.#notify("danger", "The font could not be saved", error);
    }
  }

  render() {
    if (this._loading) return html`<div class="state"><uui-loader></uui-loader></div>`;

    return html`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${this.#addFont}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0
            ? html`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf or .woff2, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${this.#addFont}>
                  Add your first font
                </uui-button>
              </div>`
            : html`${repeat(this._fonts, (font) => font.key, (font) => this.#renderFont(font))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }

  #renderFont(font: DiFont) {
    const editing = this._editingKey === font.key;

    return html`
      <div class="font">
        <div class="head">
          <div>
            <strong>${font.familyName}</strong>
            <span class="meta">
              ${sourceLabel(font)} · weight ${font.weight}
              ${font.isItalic ? "· italic" : ""}
              ${font.usedByTemplateCount > 0 ? html`· used by ${font.usedByTemplateCount} template(s)` : ""}
            </span>
          </div>
          <div class="row">
            <uui-button
              look="secondary"
              label="${editing ? "Close" : "Edit"} the named styles for ${font.familyName}"
              @click=${() => {
                this._editingKey = editing ? undefined : font.key;
              }}>
              ${editing ? "Close" : "Named styles"}
            </uui-button>
            ${font.sourceKind === "url"
              ? html`<uui-button
                  look="secondary"
                  label="Re-download ${font.familyName} from its provider"
                  @click=${() => this.#refreshFont(font)}>
                  Refresh
                </uui-button>`
              : nothing}
            <uui-button look="secondary" color="danger" label="Delete ${font.familyName}" @click=${() => this.#deleteFont(font)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${fontFamilyFor(font.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${editing ? this.#renderStyleEditor(font) : this.#renderStyleTags(font)}
      </div>
    `;
  }

  #renderStyleTags(font: DiFont) {
    if (font.styles.length === 0) return nothing;

    return html`<div class="tags">
      ${repeat(
        font.styles,
        (style) => style.name,
        (style) => html`<uui-tag look="secondary">${style.name} · ${style.size}px · ${style.fontStyle}</uui-tag>`,
      )}
    </div>`;
  }

  /**
   * Named styles are a convenience: "Title" or "Meta" applies a size and weight in one click in
   * the designer, rather than retyping the numbers on every layer.
   */
  #renderStyleEditor(font: DiFont) {
    const styles = [...font.styles];

    return html`
      <div class="editor">
        <uui-input
          label="Family name"
          .value=${font.familyName}
          id="family-${font.key}">
        </uui-input>

        <uui-table>
          <uui-table-head>
            <uui-table-head-cell>Name</uui-table-head-cell>
            <uui-table-head-cell>Size</uui-table-head-cell>
            <uui-table-head-cell>Weight</uui-table-head-cell>
            <uui-table-head-cell></uui-table-head-cell>
          </uui-table-head>
          ${repeat(
            styles,
            (_style, index) => index,
            (style, index) => html`
              <uui-table-row>
                <uui-table-cell>
                  <uui-input
                    .value=${style.name}
                    @change=${(event: Event) => {
                      styles[index] = { ...style, name: (event.target as HTMLInputElement).value };
                    }}>
                  </uui-input>
                </uui-table-cell>
                <uui-table-cell>
                  <uui-input
                    type="number"
                    .value=${String(style.size)}
                    @change=${(event: Event) => {
                      styles[index] = { ...style, size: Number((event.target as HTMLInputElement).value) };
                    }}>
                  </uui-input>
                </uui-table-cell>
                <uui-table-cell>
                  <uui-input
                    .value=${style.fontStyle}
                    @change=${(event: Event) => {
                      styles[index] = { ...style, fontStyle: (event.target as HTMLInputElement).value };
                    }}>
                  </uui-input>
                </uui-table-cell>
                <uui-table-cell>
                  <uui-button
                    compact
                    look="secondary"
                    color="danger"
                    label="Remove ${style.name}"
                    @click=${() => {
                      styles.splice(index, 1);
                      void this.#saveStyles(font, font.familyName, styles);
                    }}>
                    <uui-icon name="icon-trash"></uui-icon>
                  </uui-button>
                </uui-table-cell>
              </uui-table-row>
            `,
          )}
        </uui-table>

        <div class="row">
          <uui-button
            look="secondary"
            label="Add a named style"
            @click=${() => {
              styles.push({ name: "New style", size: 32, fontStyle: "Regular" });
              void this.#saveStyles(font, font.familyName, styles);
            }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${font.familyName}"
            @click=${() => {
              const input = this.renderRoot.querySelector<HTMLInputElement>(`#family-${font.key}`);
              void this.#saveStyles(font, input?.value || font.familyName, styles);
            }}>
            Save
          </uui-button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .state {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-layout-3);
    }

    .font {
      padding: var(--uui-size-space-4) 0;
      border-bottom: 1px solid var(--uui-color-border);
    }

    .font:last-of-type {
      border-bottom: 0;
    }

    .head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--uui-size-space-4);
      flex-wrap: wrap;
    }

    .row {
      display: flex;
      gap: var(--uui-size-space-2);
      align-items: center;
      flex-wrap: wrap;
    }

    .meta {
      display: block;
      font-size: 12px;
      color: var(--uui-color-text-alt);
    }

    .specimen {
      margin: var(--uui-size-space-3) 0;
      font-size: 28px;
      line-height: 1.2;
    }

    .tags {
      display: flex;
      gap: var(--uui-size-space-2);
      flex-wrap: wrap;
    }

    .editor {
      display: grid;
      gap: var(--uui-size-space-3);
      padding: var(--uui-size-space-3);
      background: var(--uui-color-surface-alt);
      border-radius: var(--uui-border-radius);
    }

    .empty {
      text-align: center;
      padding: var(--uui-size-layout-2);
      color: var(--uui-color-text-alt);
    }

    .empty uui-icon {
      font-size: 2.5rem;
    }

    .empty h4 {
      margin: var(--uui-size-space-3) 0 var(--uui-size-space-2);
      color: var(--uui-color-text);
    }
  `;
}

export default DiFontsDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-fonts-dashboard": DiFontsDashboardElement;
  }
}
