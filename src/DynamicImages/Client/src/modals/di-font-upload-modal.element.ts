import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { registerFontPath, registerWebFont, uploadFont, type TokenGetter } from "../api/dynamic-images-api.js";
import type { DiWebFontProvider } from "../api/types.js";
import type { FontUploadValue } from "./tokens.js";

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const PROVIDERS: { value: DiWebFontProvider; name: string }[] = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" },
];

/**
 * Three ways to add a font: upload a file (which becomes a media item, so it is blob-backed on
 * Cloud and travels with Deploy), point at one already committed under wwwroot, or name a web
 * font - fetched from its provider the first time a server needs it and cached on that server.
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

  @state()
  private _provider: DiWebFontProvider = "google";

  @state()
  private _family = "";

  @state()
  private _weights = new Set<number>([400]);

  @state()
  private _italic = false;

  @state()
  private _url = "";

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

  get #webFontReady(): boolean {
    return this._provider === "direct"
      ? this._url.trim().length > 0
      : this._family.trim().length > 0 && this._weights.size > 0;
  }

  async #registerWebFont() {
    if (!this.#webFontReady) return;

    this._busy = true;
    this._error = undefined;

    try {
      const result = await registerWebFont(
        this._provider === "direct"
          ? { provider: "direct", includeItalic: false, url: this._url.trim() }
          : {
              provider: this._provider,
              family: this._family.trim(),
              weights: [...this._weights].sort((a, b) => a - b),
              includeItalic: this._italic,
            },
        this.#getToken,
      );

      // At least one row exists (a 400 throws), so close; the dashboard reports what was skipped.
      this.value = { uploaded: true, warnings: result.errors };
      this._submitModal();
    } catch (error) {
      // A 400 carries every variant's reason in its detail, which is the useful part.
      this._error =
        error instanceof Error && "detail" in error && typeof error.detail === "string"
          ? error.detail
          : error instanceof Error
            ? error.message
            : "That web font could not be added.";
    } finally {
      this._busy = false;
    }
  }

  #toggleWeight(weight: number, checked: boolean) {
    const next = new Set(this._weights);
    if (checked) next.add(weight);
    else next.delete(weight);
    this._weights = next;
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

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${PROVIDERS.map((provider) => ({
              name: provider.name,
              value: provider.value,
              selected: provider.value === this._provider,
            }))}
            ?disabled=${this._busy}
            @change=${(event: Event) => {
              this._provider = (event.target as HTMLSelectElement).value as DiWebFontProvider;
            }}>
          </uui-select>

          ${this._provider === "direct" ? this.#renderDirect() : this.#renderProviderPicker()}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !this.#webFontReady}
            @click=${this.#registerWebFont}>
            Add web font
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

  #renderProviderPicker() {
    return html`
      <uui-input
        label="Family"
        placeholder="Inter"
        .value=${this._family}
        ?disabled=${this._busy}
        @input=${(event: Event) => {
          this._family = (event.target as HTMLInputElement).value;
        }}>
      </uui-input>

      <div class="weights" role="group" aria-label="Weights">
        ${repeat(
          WEIGHTS,
          (weight) => weight,
          (weight) => html`
            <uui-checkbox
              label=${String(weight)}
              ?checked=${this._weights.has(weight)}
              ?disabled=${this._busy}
              @change=${(event: Event) => this.#toggleWeight(weight, (event.target as HTMLInputElement).checked)}>
              ${weight}
            </uui-checkbox>
          `,
        )}
      </div>

      <uui-toggle
        label="Include italic"
        ?checked=${this._italic}
        ?disabled=${this._busy}
        @change=${(event: Event) => {
          this._italic = (event.target as HTMLInputElement).checked;
        }}>
        Include italic
      </uui-toggle>

      <p class="hint">
        One font is added per weight (and per italic). The family name is the one the provider uses - type it as it
        appears on their site. The file is fetched from the provider the first time each server needs it and cached
        there; it is not stored in the media library.
        ${this._provider === "bunny" ? html`<br />Bunny Fonts serve the Latin subset only, so accented Latin renders but other scripts do not.` : nothing}
      </p>
    `;
  }

  #renderDirect() {
    return html`
      <uui-input
        label="Font file URL"
        placeholder="https://cdn.example.com/fonts/Inter-Bold.ttf"
        .value=${this._url}
        ?disabled=${this._busy}
        @input=${(event: Event) => {
          this._url = (event.target as HTMLInputElement).value;
        }}>
      </uui-input>
      <p class="hint">
        An https URL to a static .ttf, .otf, .woff2 or .woff file - not a stylesheet, and not a variable font, which
        would render at its default weight. The family name and weight are read from the file.
      </p>
    `;
  }

  static styles = css`
    uui-box {
      margin-bottom: var(--uui-size-space-4);
    }

    uui-input,
    uui-select {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .weights {
      display: flex;
      flex-wrap: wrap;
      gap: var(--uui-size-space-2) var(--uui-size-space-4);
      margin-bottom: var(--uui-size-space-3);
    }

    uui-toggle {
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
