import { css, customElement, html, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import { fetchDocumentTypes } from "../../api/dynamic-images-api.js";
import type { DiDocumentType } from "../../api/types.js";

/**
 * "Preview content": core's document picker, limited to the template's document types, bound to
 * the workspace's `sampleContentKey`. The same element sits at the top of Preview & test and in
 * the designer's Server preview strip, so choosing a page in either shows in both - and the
 * chosen page always reads as core's document ref, so what is being previewed is never a guess.
 * <p>
 * `umb-input-document` applies the user's document start nodes itself, which the custom modal
 * this replaces had to do by hand.
 */
@customElement("di-preview-content-picker")
export class DiPreviewContentPickerElement extends UmbLitElement {
  #context?: DiTemplateWorkspaceContext;

  @state()
  private _selection: string[] = [];

  @state()
  private _allowedContentTypeIds?: string[];

  #docTypeAliases = "";
  #documentTypes?: Promise<DiDocumentType[]>;

  constructor() {
    super();

    // <umb-input-document> is defined by the document package, which the backoffice has always
    // loaded by the time a workspace opens. Importing it statically would, under vitest's browser
    // mode, evaluate a second copy of core and redefine its elements - so only ask for it when it
    // is genuinely missing, and never let that request fail the view.
    if (!customElements.get("umb-input-document")) {
      import("@umbraco-cms/backoffice/document").catch(() => undefined);
    }

    this.consumeContext(DI_TEMPLATE_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
      if (!context) return;

      this.observe(context.sampleContentKey, (key) => {
        this._selection = key ? [key] : [];
      });
      this.observe(context.template, (template) => {
        const aliases = (template?.docTypeAliases ?? []).join(",");
        if (aliases === this.#docTypeAliases) return;

        this.#docTypeAliases = aliases;
        void this.#resolveAllowedTypes(template?.docTypeAliases ?? []);
      });
    });
  }

  /** The picker filters by document type key; the template stores aliases. */
  async #resolveAllowedTypes(aliases: string[]) {
    if (!this.#context) return;

    this.#documentTypes ??= fetchDocumentTypes(this.#context.getToken).catch(() => []);
    const types = await this.#documentTypes;
    const wanted = new Set(aliases);

    const keys = types.filter((type) => wanted.has(type.alias)).map((type) => type.key);
    // No document types yet: leave the picker unfiltered rather than offering nothing at all.
    this._allowedContentTypeIds = keys.length > 0 ? keys : undefined;
  }

  #onChange(event: Event) {
    const selection = (event.target as HTMLElement & { selection: string[] }).selection;
    this.#context?.setSampleContentKey(selection[0]);
  }

  override render() {
    return html`
      <umb-property-layout orientation="vertical" label="Preview content" description="Empty = sample data">
        <umb-input-document
          slot="editor"
          max="1"
          .allowedContentTypeIds=${this._allowedContentTypeIds}
          .selection=${this._selection}
          @change=${this.#onChange}></umb-input-document>
      </umb-property-layout>
    `;
  }

  static override styles = css`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
}

export default DiPreviewContentPickerElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-preview-content-picker": DiPreviewContentPickerElement;
  }
}
