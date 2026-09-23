import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { fetchFontReferences, hrefForTemplate, hrefForWorkspace, type TokenGetter } from "../../api/dynamic-images-api.js";
import type { DiFont, DiFontReference, DiFontStyle } from "../../api/types.js";
import { fontFamilyFor, loadFont } from "../../designer/fonts/font-face-loader.js";
import { DI_FONT_FAMILY_ENTITY_TYPE } from "../constants.js";
import type { DiFontDetailModel } from "./font-detail.repository.js";
import { DI_FONT_WORKSPACE_CONTEXT, type DiFontWorkspaceContext } from "./font-workspace.context.js";

const FACES = ["Regular", "Bold", "Italic", "BoldItalic"];

/** Where a variant's file lives, as its Source box says it. */
function sourceLabel(font: DiFont): string {
  switch (font.sourceKind) {
    case "path":
      return `wwwroot: ${font.path ?? ""}`;
    case "url":
      if (font.provider === "google") return `Google Fonts · ${font.providerFamily ?? font.familyName}`;
      if (font.provider === "bunny") return `Bunny Fonts · ${font.providerFamily ?? font.familyName}`;
      return font.sourceUrl ?? "Web";
    default:
      return "Media library";
  }
}

/**
 * A variant's workspace view: a live sample in the real typeface, its weight and slant, the named
 * styles the designer offers for it, where its file comes from, and the templates using it. The
 * named-style editor is the fonts dashboard's, lifted out; it now edits the workspace's data and
 * the workspace's Save persists it.
 */
@customElement("di-font-workspace-view")
export class DiFontWorkspaceViewElement extends UmbLitElement {
  @state()
  private _data?: DiFontDetailModel;

  @state()
  private _sampleLoaded = false;

  @state()
  private _usedBy: DiFontReference[] = [];

  @state()
  private _usedByTotal = 0;

  #context?: DiFontWorkspaceContext;
  #getToken?: TokenGetter;
  #loadedKey?: string;

  constructor() {
    super();

    this.consumeContext(UMB_AUTH_CONTEXT, (auth) => {
      this.#getToken = () => auth?.getLatestToken();
      void this.#loadExtras();
    });

    this.consumeContext(DI_FONT_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
      this.observe(context?.current, (data) => {
        this._data = data;
        void this.#loadExtras();
      });
    });
  }

  /** The sample's typeface and the Used by list, once per variant. */
  async #loadExtras() {
    const key = this._data?.unique;
    const getToken = this.#getToken;
    if (!key || !getToken || this.#loadedKey === key) return;
    this.#loadedKey = key;

    const [face, references] = await Promise.all([
      loadFont(key, getToken),
      fetchFontReferences(key, 0, 50, getToken).catch(() => undefined),
    ]);

    this._sampleLoaded = !!face;
    this._usedBy = references?.items ?? [];
    this._usedByTotal = references?.total ?? 0;
  }

  /**
   * Puts the cursor in the newly added style's name, so it can be typed straight in. Awaiting the
   * render, then a frame for uui-input's own update, then its inner control.
   */
  async #focusLastStyleName() {
    await this.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const names = this.renderRoot.querySelectorAll<HTMLElement>(".style-name");
    const last = names[names.length - 1];
    if (!last) return;

    await (last as HTMLElement & { updateComplete?: Promise<unknown> }).updateComplete;
    const input = last.shadowRoot?.querySelector<HTMLInputElement>("input");
    (input ?? last).focus();
  }

  #setStyle(index: number, patch: Partial<DiFontStyle>) {
    const styles = [...(this._data?.styles ?? [])];
    styles[index] = { ...styles[index], ...patch };
    this.#context?.setStyles(styles);
  }

  #addStyle() {
    this.#context?.setStyles([...(this._data?.styles ?? []), { name: "New style", size: 32, fontStyle: "Regular" }]);
    void this.#focusLastStyleName();
  }

  #removeStyle(index: number) {
    const styles = [...(this._data?.styles ?? [])];
    styles.splice(index, 1);
    this.#context?.setStyles(styles);
  }

  override render() {
    const data = this._data;
    if (!data) return html`<uui-loader></uui-loader>`;

    return html`
      <uui-box headline="Sample">
        <p class="specimen" style=${this._sampleLoaded ? `font-family: ${fontFamilyFor(data.unique)}, serif` : ""}>
          Designing social share images that actually get clicked
        </p>
      </uui-box>

      <uui-box headline="Weight and slant">
        <div class="identity">
          <uui-input
            id="weight"
            type="number"
            label="Weight"
            min="1"
            max="1000"
            step="100"
            .value=${String(data.weight)}
            @change=${(event: Event) => this.#context?.setWeight(Number((event.target as HTMLInputElement).value) || 400)}>
          </uui-input>
          <uui-toggle
            id="italic"
            label="Italic"
            ?checked=${data.isItalic}
            @change=${(event: Event) => this.#context?.setItalic((event.target as HTMLInputElement).checked)}>
            Italic
          </uui-toggle>
        </div>
        <small class="hint">
          Weight and slant are detected from the font file. Correct them here if they are wrong - a named style below
          chooses the <em>face</em> (Regular, Bold, Italic, BoldItalic), while this is the variant's numeric weight.
        </small>
      </uui-box>

      <uui-box headline="Named styles">
        <small class="hint">A named style - "Title", "Meta" - applies a size and face in one click in the designer.</small>
        ${this.#renderStyles(data.styles)}
        <uui-button look="secondary" label="Add a named style" @click=${this.#addStyle}>Add a style</uui-button>
      </uui-box>

      <uui-box headline="Source">
        <dl>
          <dt>Family</dt>
          <dd>
            ${data.font.familyKey
              ? html`<a href=${hrefForWorkspace(DI_FONT_FAMILY_ENTITY_TYPE, data.font.familyKey)}>${data.font.familyName}</a>`
              : data.font.familyName}
          </dd>
          <dt>File</dt>
          <dd>${sourceLabel(data.font)}</dd>
        </dl>
      </uui-box>

      <uui-box headline="Used by">
        ${this._usedByTotal === 0
          ? html`<p class="hint">No template uses this font.</p>`
          : html`<ul class="used-by">
              ${repeat(
                this._usedBy,
                (template) => template.key,
                (template) => html`<li>
                  <uui-ref-node name=${template.name} href=${hrefForTemplate(template.key)}>
                    <umb-icon slot="icon" name=${template.isEnabled ? "icon-picture" : "icon-picture color-grey"}></umb-icon>
                  </uui-ref-node>
                </li>`,
              )}
            </ul>
            ${this._usedByTotal > this._usedBy.length
              ? html`<p class="hint">and ${this._usedByTotal - this._usedBy.length} more</p>`
              : nothing}`}
      </uui-box>
    `;
  }

  #renderStyles(styles: DiFontStyle[]) {
    if (styles.length === 0) return nothing;

    return html`
      <uui-table>
        <uui-table-head>
          <uui-table-head-cell>Name</uui-table-head-cell>
          <uui-table-head-cell>Size</uui-table-head-cell>
          <uui-table-head-cell>Face</uui-table-head-cell>
          <uui-table-head-cell></uui-table-head-cell>
        </uui-table-head>
        ${repeat(
          styles,
          (_style, index) => index,
          (style, index) => html`
            <uui-table-row>
              <uui-table-cell>
                <uui-input
                  class="style-name"
                  label="Style name"
                  .value=${style.name}
                  @change=${(event: Event) => this.#setStyle(index, { name: (event.target as HTMLInputElement).value })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-input
                  type="number"
                  label="Size"
                  .value=${String(style.size)}
                  @change=${(event: Event) => this.#setStyle(index, { size: Number((event.target as HTMLInputElement).value) })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-select
                  label="Face"
                  .options=${FACES.map((face) => ({ name: face, value: face, selected: face === style.fontStyle }))}
                  @change=${(event: Event) => this.#setStyle(index, { fontStyle: (event.target as HTMLSelectElement).value })}>
                </uui-select>
              </uui-table-cell>
              <uui-table-cell>
                <uui-button
                  compact
                  look="secondary"
                  color="danger"
                  label="Remove ${style.name}"
                  @click=${() => this.#removeStyle(index)}>
                  <uui-icon name="icon-trash"></uui-icon>
                </uui-button>
              </uui-table-cell>
            </uui-table-row>
          `,
        )}
      </uui-table>
    `;
  }

  static override styles = css`
    :host {
      display: grid;
      gap: var(--uui-size-layout-1);
      padding: var(--uui-size-layout-1);
    }

    .specimen {
      margin: 0;
      font-size: 32px;
      line-height: 1.2;
    }

    .identity {
      display: flex;
      gap: var(--uui-size-space-4);
      align-items: center;
      flex-wrap: wrap;
    }

    .hint {
      display: block;
      margin: var(--uui-size-space-2) 0 var(--uui-size-space-4);
      color: var(--uui-color-text-alt);
      font-size: 12px;
    }

    uui-table {
      margin-bottom: var(--uui-size-space-4);
    }

    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: var(--uui-size-space-2) var(--uui-size-space-5);
      margin: 0;
    }

    dt {
      font-weight: 700;
    }

    dd {
      margin: 0;
      overflow-wrap: anywhere;
    }

    .used-by {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  `;
}

export default DiFontWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-font-workspace-view": DiFontWorkspaceViewElement;
  }
}
