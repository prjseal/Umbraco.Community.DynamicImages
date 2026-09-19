import { css, customElement, html, nothing, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { registerFontPath, uploadFont, type TokenGetter } from "../api/dynamic-images-api.js";
import type { FontUploadValue } from "./tokens.js";

/**
 * Two ways to add a font: upload a file (which becomes a media item, so it is blob-backed on
 * Cloud and travels with Deploy), or point at one already committed under wwwroot.
 */
@customElement("di-font-upload-modal")
export class DiFontUploadModalElement extends UmbModalBaseElement<object, FontUploadValue> {
  #authContext?: typeof UMB_AUTH_CONTEXT.TYPE;

  @state()
  private _busy = false;

  @state()
  private _error?: string;

  @state()
  private _path = "";

  constructor() {
    super();

    this.consumeContext(UMB_AUTH_CONTEXT, (context) => {
      this.#authContext = context;
    });
  }

  #getToken: TokenGetter = () => this.#authContext?.getLatestToken();

  async #onFiles(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    this._busy = true;
    this._error = undefined;

    try {
      for (const file of Array.from(files)) {
        await uploadFont(file, this.#getToken);
      }

      this.value = { uploaded: true };
      this._submitModal();
    } catch (error) {
      this._error = error instanceof Error ? error.message : "The font could not be uploaded.";
    } finally {
      this._busy = false;
    }
  }

  async #registerPath() {
    if (!this._path.trim()) return;

    this._busy = true;
    this._error = undefined;

    try {
      await registerFontPath(this._path.trim(), this.#getToken);

      this.value = { uploaded: true };
      this._submitModal();
    } catch (error) {
      this._error = error instanceof Error ? error.message : "That path could not be registered.";
    } finally {
      this._busy = false;
    }
  }

  render() {
    return html`
      <umb-body-layout headline="Add a font">
        <uui-box headline="Upload a file">
          <input
            type="file"
            accept=".ttf,.otf,.woff2,.woff"
            multiple
            aria-label="Font files"
            ?disabled=${this._busy}
            @change=${this.#onFiles} />
          <p class="hint">
            .ttf, .otf or .woff2. The family name and weight are read from the file. Uploads are stored in the media
            library, so they work on Umbraco Cloud and transfer with Deploy.
          </p>
        </uui-box>

        <uui-box headline="Or register a path in wwwroot">
          <uui-input
            label="Path"
            placeholder="/assets/fonts/Inter-Regular.ttf"
            .value=${this._path}
            ?disabled=${this._busy}
            @input=${(event: Event) => {
              this._path = (event.target as HTMLInputElement).value;
            }}>
          </uui-input>
          <uui-button
            look="secondary"
            label="Register this path"
            ?disabled=${this._busy || !this._path.trim()}
            @click=${this.#registerPath}>
            Register
          </uui-button>
        </uui-box>

        ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}
        ${this._busy ? html`<uui-loader-bar></uui-loader-bar>` : nothing}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }

  static styles = css`
    uui-box {
      margin-bottom: var(--uui-size-space-4);
    }

    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .hint {
      margin: var(--uui-size-space-3) 0 0;
      font-size: 12px;
      color: var(--uui-color-text-alt);
    }

    .error {
      color: var(--uui-color-danger);
    }
  `;
}

export default DiFontUploadModalElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-font-upload-modal": DiFontUploadModalElement;
  }
}
