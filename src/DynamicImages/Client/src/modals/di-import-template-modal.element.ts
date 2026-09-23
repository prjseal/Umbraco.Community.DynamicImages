import { css, customElement, html, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { ImportTemplateValue } from "./tokens.js";
import "@umbraco-cms/backoffice/external/uui";

/**
 * Paste a template, or choose the `.json` file Export JSON produced. The server does the reading
 * and the validation; this only collects the text.
 */
@customElement("di-import-template-modal")
export class DiImportTemplateModalElement extends UmbModalBaseElement<object, ImportTemplateValue> {
  @state()
  private _json = "";

  async #onFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this._json = await file.text();
  }

  #submit() {
    if (!this._json.trim()) return;

    this.value = { json: this._json };
    this._submitModal();
  }

  override render() {
    return html`
      <umb-body-layout headline="Import template">
        <uui-box>
          <umb-property-layout
            orientation="vertical"
            label="Template JSON"
            description="Paste an exported template, or choose its .json file. An alias already in use gets a new one.">
            <div slot="editor" class="editor">
              <input type="file" accept=".json,application/json" @change=${this.#onFile} aria-label="Choose a file" />
              <uui-textarea
                label="Template JSON"
                rows="16"
                .value=${this._json}
                @input=${(e: Event) => (this._json = (e.target as HTMLTextAreaElement).value)}></uui-textarea>
            </div>
          </umb-property-layout>
        </uui-box>
        <div slot="actions">
          <uui-button label="Close" @click=${this._rejectModal}></uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Import"
            ?disabled=${!this._json.trim()}
            @click=${this.#submit}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }

  static override styles = [
    css`
      .editor {
        display: flex;
        flex-direction: column;
        gap: var(--uui-size-space-3);
      }

      uui-textarea {
        width: 100%;
        font-family: monospace;
      }
    `,
  ];
}

export default DiImportTemplateModalElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-import-template-modal": DiImportTemplateModalElement;
  }
}
