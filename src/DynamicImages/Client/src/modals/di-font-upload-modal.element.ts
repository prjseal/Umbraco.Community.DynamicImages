import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { registerFontPath, registerWebFont, uploadFont, type TokenGetter } from "../api/dynamic-images-api.js";
import type { DiWebFontProvider } from "../api/types.js";
import type { FontUploadData, FontUploadValue } from "./tokens.js";
// uui-file-dropzone is less universally already-registered than uui-button, so say so
// explicitly. The whole @umbraco namespace is external to the build, so this costs no bundle.
import "@umbraco-cms/backoffice/external/uui";

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
 * <p>
 * Opened from the Fonts tree's Create…, each option opens on its own way in (`data.mode`) and the
 * new variants go where the create was started: into a family, or a same-named family in a folder.
 */
@customElement("di-font-upload-modal")
export class DiFontUploadModalElement extends UmbModalBaseElement<FontUploadData, FontUploadValue> {
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

  get #placement() {
    return { familyKey: this.data?.familyKey ?? null, parentKey: this.data?.parentKey ?? null };
  }

  #shows(mode: "upload" | "web" | "path"): boolean {
    return !this.data?.mode || this.data.mode === mode;
  }

  override connectedCallback() {
    super.connectedCallback();
    // A variant for a web font family is most likely the same provider family.
    if (this.data?.familyName) this._family = this.data.familyName;
  }

  #onDropzoneFiles(event: Event) {
    const files = (event as CustomEvent<{ files: File[] }>).detail?.files ?? [];
    void this.#upload(files);
  }

  async #upload(files: readonly File[]) {
    if (files.length === 0) return;

    this._busy = true;
    this._error = undefined;

    try {
      for (const file of files) {
        await uploadFont(file, this.#getToken, this.#placement);
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
      await registerFontPath(this._path.trim(), this.#getToken, this.#placement);

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
        this.#placement,
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

  #headline(): string {
    const target = this.data?.familyName ? ` to ${this.data.familyName}` : "";
    switch (this.data?.mode) {
      case "upload":
        return `Upload a font file${target}`;
      case "web":
        return `Add a web font${target}`;
      case "path":
        return `Register a font in wwwroot${target}`;
      default:
        return this.data?.familyName ? `Add a variant to ${this.data.familyName}` : "Add a font";
    }
  }

  render() {
    const several = !this.data?.mode;

    return html`
      <umb-body-layout headline=${this.#headline()}>
        ${this.#shows("upload") ? this.#renderUpload(several) : nothing}
        ${this.#shows("path") ? this.#renderPath(several) : nothing}
        ${this.#shows("web") ? this.#renderWeb(several) : nothing}

        ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}
        ${this._busy ? html`<uui-loader-bar></uui-loader-bar>` : nothing}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }

  #renderUpload(several: boolean) {
    return html`
        <uui-box headline=${several ? "Upload a file" : "File"}>
          <!-- uui-file-dropzone rather than a raw <input type="file">: the native
               "Choose files | No file chosen" control looked out of place beside the uui-styled
               inputs in the same dialog. It is what umb-input-dropzone is built on in core, so
               this borrows the control without core's media upload manager. -->
          <uui-file-dropzone
            accept=".ttf,.otf,.woff2,.woff"
            multiple
            label="Drop font files here, or click to browse"
            ?disabled=${this._busy}
            @change=${this.#onDropzoneFiles}>
          </uui-file-dropzone>
          <p class="hint">
            .ttf, .otf, .woff2 or .woff. The family name and weight are read from the file. Uploads are stored in the
            media library, so they work on Umbraco Cloud and transfer with Deploy.
          </p>
        </uui-box>
    `;
  }

  #renderPath(several: boolean) {
    return html`
        <uui-box headline=${several ? "Or register a path in wwwroot" : "Path in wwwroot"}>
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
    `;
  }

  #renderWeb(several: boolean) {
    return html`
        <uui-box headline=${several ? "Or use a web font" : "Web font"}>
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
