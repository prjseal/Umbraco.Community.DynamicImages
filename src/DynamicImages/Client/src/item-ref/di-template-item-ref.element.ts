import { customElement, html, nothing, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { hrefForTemplate } from "../api/dynamic-images-api.js";
import { DI_TEMPLATE_DISABLED_ICON, DI_TEMPLATE_ICON } from "../tree/constants.js";

/**
 * A template as a reference - what `umb-entity-item-ref` draws for a `di-template` item, as in
 * the list of templates the delete modal shows for a font still in use. Links to the template.
 */
@customElement("di-template-item-ref")
export class DiTemplateItemRefElement extends UmbLitElement {
  @property({ type: Object })
  item?: { unique: string; name?: string; isEnabled?: boolean };

  @property({ type: Boolean })
  readonly = false;

  @property({ type: Boolean })
  standalone = false;

  override render() {
    if (!this.item) return nothing;

    return html`
      <uui-ref-node
        name=${this.item.name ?? "Template"}
        href=${hrefForTemplate(this.item.unique)}
        ?readonly=${this.readonly}
        ?standalone=${this.standalone}>
        <umb-icon slot="icon" name=${this.item.isEnabled === false ? DI_TEMPLATE_DISABLED_ICON : DI_TEMPLATE_ICON}></umb-icon>
        <slot name="actions" slot="actions"></slot>
      </uui-ref-node>
    `;
  }
}

export { DiTemplateItemRefElement as element };

declare global {
  interface HTMLElementTagNameMap {
    "di-template-item-ref": DiTemplateItemRefElement;
  }
}
