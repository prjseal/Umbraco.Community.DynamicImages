import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { ManifestWorkspaceView } from "@umbraco-cms/backoffice/workspace";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL } from "@umbraco-cms/backoffice/document-type";
import { UMB_MEDIA_PICKER_MODAL } from "@umbraco-cms/backoffice/media";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import type { DiProperty, DiTemplate } from "../../api/types.js";

/**
 * Everything about a template that is not its design: what it applies to, where the result goes
 * and when it runs.
 */
@customElement("di-settings-view")
export class DiSettingsViewElement extends UmbLitElement {
  /** Assigned by the workspace editor once the view is instantiated. */
  manifest?: ManifestWorkspaceView;

  #context?: DiTemplateWorkspaceContext;
  #modalContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;

  @state()
  private _template?: DiTemplate;

  @state()
  private _properties: DiProperty[] = [];

  @state()
  private _showAdvanced = false;

  constructor() {
    super();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (context) => {
      this.#modalContext = context;
    });

    this.consumeContext(DI_TEMPLATE_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
      if (!context) return;

      this.observe(context.template, (template) => {
        this._template = template;
      });
      this.observe(context.properties, (properties) => {
        this._properties = properties ?? [];
      });
    });
  }

  /** Only media pickers can hold the generated image, so only those are offered. */
  get #mediaPickerProperties(): DiProperty[] {
    return this._properties.filter((property) => property.classification === "media");
  }

  async #pickDocumentTypes() {
    if (!this.#modalContext || !this._template) return;

    const modal = this.#modalContext.open(this, UMB_DOCUMENT_TYPE_PICKER_MODAL, {
      data: {
        multiple: true,
        // Element types are never published on their own, so nothing would trigger the template.
        pickableFilter: (item) => !item.isElement,
      },
    });

    const result = await modal?.onSubmit().catch(() => undefined);
    if (!result) return;

    // The picker returns unique ids (keys); the template stores aliases, which is what the
    // publish handler matches on, so they are resolved through the document type list.
    const aliases = await this.#aliasesForKeys(result.selection.filter((key): key is string => !!key));

    this.#context?.updateTemplateFields({ docTypeAliases: aliases });
    await this.#context?.reloadProperties();
  }

  /**
   * The backoffice pickers work in keys; templates store aliases, because that is what the
   * publish handler matches a node's document type on. The list endpoint carries both.
   */
  async #aliasesForKeys(keys: string[]): Promise<string[]> {
    const { fetchDocumentTypes } = await import("../../api/dynamic-images-api.js");
    const all = await fetchDocumentTypes(this.#context!.getToken).catch(() => []);
    const byKey = new Map(all.map((type) => [type.key, type.alias] as const));

    return keys
      .map((key) => byKey.get(key))
      .filter((alias): alias is string => !!alias)
      .filter((alias, index, list) => list.indexOf(alias) === index);
  }

  #removeDocType(alias: string) {
    const aliases = (this._template?.docTypeAliases ?? []).filter((item) => item !== alias);
    this.#context?.updateTemplateFields({ docTypeAliases: aliases });
    void this.#context?.reloadProperties();
  }

  async #pickOutputFolder() {
    if (!this.#modalContext) return;

    const modal = this.#modalContext.open(this, UMB_MEDIA_PICKER_MODAL, {
      // Not filtered to folders here: the media tree item carries its media type as a key, not
      // an alias, so there is nothing reliable to match on. The server checks the chosen item is
      // a folder and the validator warns when it is not.
      data: { multiple: false },
    });

    const result = await modal?.onSubmit().catch(() => undefined);
    if (!result) return;

    this.#context?.updateOutput({ mediaFolderKey: result.selection[0] ?? null });
  }

  render() {
    if (!this._template) return html`<uui-loader></uui-loader>`;

    return html`
      <div class="grid">
        ${this.#renderAppliesTo()} ${this.#renderOutput()} ${this.#renderTrigger()} ${this.#renderAdvanced()}
      </div>
    `;
  }

  #renderAppliesTo() {
    const template = this._template!;

    return html`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${template.docTypeAliases.length === 0
              ? html`<p class="empty">No document types yet - nothing will trigger this template.</p>`
              : html`<div class="tags">
                  ${repeat(
                    template.docTypeAliases,
                    (alias) => alias,
                    (alias) => html`
                      <uui-tag look="secondary">
                        ${alias}
                        <uui-button
                          compact
                          label="Remove ${alias}"
                          @click=${() => this.#removeDocType(alias)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `,
                  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${this.#pickDocumentTypes}>
              Choose document types
            </uui-button>
          </div>
        </umb-property-layout>

        <umb-property-layout
          label="Target property"
          description="The media picker the generated image is written to.">
          <uui-select
            slot="editor"
            .value=${template.targetPropertyAlias}
            .options=${[
              { name: "- none -", value: "" },
              ...this.#mediaPickerProperties.map((property) => ({
                name: `${property.name} (${property.alias})`,
                value: property.alias,
                selected: property.alias === template.targetPropertyAlias,
              })),
            ]}
            @change=${(event: Event) =>
              this.#context?.updateTemplateFields({
                targetPropertyAlias: (event.target as HTMLSelectElement).value,
              })}>
          </uui-select>
        </umb-property-layout>

        <umb-property-layout label="Enabled" description="Disabled templates never run.">
          <uui-toggle
            slot="editor"
            ?checked=${template.isEnabled}
            @change=${(event: Event) =>
              this.#context?.updateTemplateFields({ isEnabled: (event.target as HTMLInputElement).checked })}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
  }

  #renderOutput() {
    const template = this._template!;

    return html`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${template.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${this.#pickOutputFolder}>Choose</uui-button>
            ${template.output.mediaFolderKey
              ? html`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => this.#context?.updateOutput({ mediaFolderKey: null })}>
                  Clear
                </uui-button>`
              : nothing}
          </div>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${template.output.fileNamePattern}
            @change=${(event: Event) =>
              this.#context?.updateOutput({ fileNamePattern: (event.target as HTMLInputElement).value })}>
          </uui-input>
        </umb-property-layout>

        <umb-property-layout label="Format">
          <uui-select
            slot="editor"
            .value=${template.output.format}
            .options=${["png", "jpeg", "webp"].map((format) => ({
              name: format.toUpperCase(),
              value: format,
              selected: format === template.output.format,
            }))}
            @change=${(event: Event) =>
              this.#context?.updateOutput({
                format: (event.target as HTMLSelectElement).value as DiTemplate["output"]["format"],
              })}>
          </uui-select>
        </umb-property-layout>

        ${template.output.format === "png"
          ? nothing
          : html`<umb-property-layout label="Quality" description="1-100. Ignored for PNG.">
              <uui-input
                slot="editor"
                type="number"
                min="1"
                max="100"
                .value=${String(template.output.quality)}
                @change=${(event: Event) =>
                  this.#context?.updateOutput({ quality: Number((event.target as HTMLInputElement).value) })}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
  }

  #renderTrigger() {
    const template = this._template!;

    return html`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${template.trigger.onPublish}
            @change=${(event: Event) =>
              this.#context?.updateTrigger({ onPublish: (event.target as HTMLInputElement).checked })}>
          </uui-toggle>
        </umb-property-layout>

        <umb-property-layout
          label="Only when empty"
          description="Leave on so an image an editor picked by hand is never overwritten.">
          <uui-toggle
            slot="editor"
            ?checked=${template.trigger.onlyWhenEmpty}
            @change=${(event: Event) =>
              this.#context?.updateTrigger({ onlyWhenEmpty: (event.target as HTMLInputElement).checked })}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
  }

  #renderAdvanced() {
    const template = this._template!;

    return html`
      <uui-box headline="Advanced">
        <umb-property-layout label="Alias" description="Used by export, import and file sync.">
          <uui-input
            slot="editor"
            .value=${template.alias}
            placeholder="Generated from the name"
            @change=${(event: Event) =>
              this.#context?.updateTemplateFields({ alias: (event.target as HTMLInputElement).value })}>
          </uui-input>
        </umb-property-layout>

        <umb-property-layout label="Template JSON" description="Read-only. This is what export writes.">
          <div slot="editor">
            <uui-button
              look="secondary"
              label="${this._showAdvanced ? "Hide" : "Show"} the template JSON"
              @click=${() => {
                this._showAdvanced = !this._showAdvanced;
              }}>
              ${this._showAdvanced ? "Hide" : "Show"} JSON
            </uui-button>
            ${this._showAdvanced
              ? html`<pre class="json">${JSON.stringify(template, null, 2)}</pre>`
              : nothing}
          </div>
        </umb-property-layout>
      </uui-box>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
    }

    .grid {
      display: grid;
      gap: var(--uui-size-layout-1);
      max-width: 1100px;
    }

    .row {
      display: flex;
      gap: var(--uui-size-space-3);
      align-items: center;
      flex-wrap: wrap;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--uui-size-space-2);
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      margin: 0 0 var(--uui-size-space-3);
      color: var(--uui-color-text-alt);
    }

    .json {
      margin-top: var(--uui-size-space-3);
      padding: var(--uui-size-space-4);
      background: var(--uui-color-surface-alt);
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      max-height: 420px;
      overflow: auto;
      font-size: 12px;
    }
  `;
}

export default DiSettingsViewElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-settings-view": DiSettingsViewElement;
  }
}
