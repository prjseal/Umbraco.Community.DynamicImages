import { css, customElement, html, nothing, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { ManifestWorkspaceView } from "@umbraco-cms/backoffice/workspace";
// Side-effect imports: they register <umb-input-document-type> and <umb-input-media>. The whole
// @umbraco-cms namespace is external to the build, so they cost nothing in the bundle.
import "@umbraco-cms/backoffice/document-type";
import "@umbraco-cms/backoffice/media";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import { fetchDocumentTypes } from "../../api/dynamic-images-api.js";
import type { DiDocumentType, DiProperty, DiTemplate } from "../../api/types.js";

/**
 * Everything about a template that is not its design: what it applies to, where the result goes
 * and when it runs.
 */
@customElement("di-settings-view")
export class DiSettingsViewElement extends UmbLitElement {
  /** Assigned by the workspace editor once the view is instantiated. */
  manifest?: ManifestWorkspaceView;

  #context?: DiTemplateWorkspaceContext;

  @state()
  private _template?: DiTemplate;

  @state()
  private _properties: DiProperty[] = [];

  @state()
  private _showAdvanced = false;

  /**
   * Every document type, for the alias ↔ key mapping. The picker works in keys; the template
   * stores aliases, because that is what the publish handler matches a node's document type on.
   */
  @state()
  private _documentTypes?: DiDocumentType[];

  constructor() {
    super();

    this.consumeContext(DI_TEMPLATE_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
      if (!context) return;

      void fetchDocumentTypes(context.getToken)
        .then((types) => (this._documentTypes = types))
        .catch(() => (this._documentTypes = []));

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

  /** The picker's selection: the key of every stored alias that names a document type. */
  get #selectedDocumentTypeKeys(): string[] {
    const byAlias = new Map((this._documentTypes ?? []).map((type) => [type.alias, type.key] as const));
    return (this._template?.docTypeAliases ?? [])
      .map((alias) => byAlias.get(alias))
      .filter((key): key is string => !!key);
  }

  /** Stored aliases that no document type has (renamed or deleted since), kept rather than lost. */
  get #unknownAliases(): string[] {
    if (!this._documentTypes) return [];
    const known = new Set(this._documentTypes.map((type) => type.alias));
    return (this._template?.docTypeAliases ?? []).filter((alias) => !known.has(alias));
  }

  async #onDocumentTypesChange(event: Event) {
    const keys = (event.target as HTMLElement & { selection: string[] }).selection;
    const byKey = new Map((this._documentTypes ?? []).map((type) => [type.key, type.alias] as const));

    const aliases = [
      ...keys.map((key) => byKey.get(key)).filter((alias): alias is string => !!alias),
      ...this.#unknownAliases,
    ].filter((alias, index, list) => list.indexOf(alias) === index);

    this.#context?.updateTemplateFields({ docTypeAliases: aliases });
    await this.#context?.reloadProperties();
  }

  #onMediaFolderChange(event: Event) {
    const selection = (event.target as HTMLElement & { selection: string[] }).selection;
    this.#context?.updateOutput({ mediaFolderKey: selection[0] ?? null });
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
            ${this._documentTypes
              ? html`<umb-input-document-type
                  .documentTypesOnly=${true}
                  .selection=${this.#selectedDocumentTypeKeys}
                  @change=${this.#onDocumentTypesChange}></umb-input-document-type>`
              : html`<uui-loader-bar></uui-loader-bar>`}
            ${this.#unknownAliases.length > 0
              ? html`<p class="note">
                  Also targets ${this.#unknownAliases.join(", ")}, which no document type has any more.
                </p>`
              : nothing}
          </div>
        </umb-property-layout>

        <umb-property-layout
          label="Target property"
          description="The media picker the generated image is written to.">
          <uui-select
            slot="editor"
            class="full"
            label="Target property"
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
        <umb-property-layout
          label="Media folder"
          description="Where generated images are saved. Empty = the media root.">
          <umb-input-media
            slot="editor"
            max="1"
            folder-filter="foldersOnly"
            .selection=${template.output.mediaFolderKey ? [template.output.mediaFolderKey] : []}
            @change=${this.#onMediaFolderChange}></umb-input-media>
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

    uui-select.full {
      width: 100%;
    }

    .note {
      margin: var(--uui-size-space-3) 0 0;
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
