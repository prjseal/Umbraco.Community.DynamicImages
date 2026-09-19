import { css, customElement, html, nothing, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "./di-template-workspace.context.js";

/**
 * The shell of the template workspace. umb-workspace-editor supplies the view tabs (from the
 * registered workspaceView extensions) and the action footer, so this element only has to
 * provide the headline and the loading state.
 */
@customElement("di-template-editor")
export class DiTemplateEditorElement extends UmbLitElement {
  #context?: DiTemplateWorkspaceContext;

  @state()
  private _name = "";

  @state()
  private _loading = true;

  constructor() {
    super();

    this.consumeContext(DI_TEMPLATE_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
      if (!context) return;

      this.observe(context.template, (template) => {
        this._name = template?.name ?? "";
      });
      this.observe(context.loading, (loading) => {
        this._loading = loading ?? false;
      });
    });
  }

  #onNameInput(event: Event) {
    const name = (event.target as HTMLInputElement).value;
    this.#context?.updateTemplateFields({ name });
  }

  render() {
    return html`
      <umb-workspace-editor alias="DynamicImages.Workspace.Template" .loading=${this._loading}>
        <div slot="header" class="header">
          <uui-input
            id="name"
            label="Template name"
            placeholder="Give this template a name"
            .value=${this._name}
            @input=${this.#onNameInput}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? html`<uui-loader-bar></uui-loader-bar>` : nothing}
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .header {
      display: flex;
      width: 100%;
    }

    #name {
      width: 100%;
      flex: 1 1 auto;
    }
  `;
}

export default DiTemplateEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-template-editor": DiTemplateEditorElement;
  }
}
