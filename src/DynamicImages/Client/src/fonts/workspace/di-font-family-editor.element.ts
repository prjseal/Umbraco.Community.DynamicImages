import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

/** Core's folder workspace editor with the family's icon: an editable name, and the workspace views. */
@customElement("di-font-family-editor")
export class DiFontFamilyEditorElement extends UmbLitElement {
  override render() {
    return html`<umb-workspace-editor>
      <umb-icon id="icon" slot="header" name="icon-font"></umb-icon>
      <umb-workspace-header-name-editable slot="header"></umb-workspace-header-name-editable>
    </umb-workspace-editor>`;
  }

  static override styles = [
    UmbTextStyles,
    css`
      #icon {
        display: inline-block;
        font-size: var(--uui-size-6);
        margin-right: var(--uui-size-space-4);
      }
    `,
  ];
}

export default DiFontFamilyEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-font-family-editor": DiFontFamilyEditorElement;
  }
}
