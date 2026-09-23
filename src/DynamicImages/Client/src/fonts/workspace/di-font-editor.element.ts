import { customElement, html, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { DI_FONT_WORKSPACE_CONTEXT } from "./font-workspace.context.js";

/** The variant workspace's frame: "Inter · Bold 700" in the header, and its workspace views. */
@customElement("di-font-editor")
export class DiFontEditorElement extends UmbLitElement {
  @state()
  private _headline = "";

  constructor() {
    super();
    this.consumeContext(DI_FONT_WORKSPACE_CONTEXT, (context) => {
      this.observe(context?.current, (data) => {
        this._headline = data ? `${data.font.familyName} · ${data.name}` : "";
      });
    });
  }

  override render() {
    return html`<umb-workspace-editor headline=${this._headline}></umb-workspace-editor>`;
  }
}

export default DiFontEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-font-editor": DiFontEditorElement;
  }
}
