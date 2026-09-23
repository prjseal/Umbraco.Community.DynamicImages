import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
// Registers <umb-folder-workspace-editor>, core's editable folder-name header.
import "@umbraco-cms/backoffice/tree";

@customElement("di-template-folder-editor")
export class DiTemplateFolderEditorElement extends UmbLitElement {
  override render() {
    return html`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
}

export default DiTemplateFolderEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-template-folder-editor": DiTemplateFolderEditorElement;
  }
}
