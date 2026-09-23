import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { hrefForWorkspace } from "../api/dynamic-images-api.js";
import { DI_FONT_ROOT_ENTITY_TYPE } from "../fonts/constants.js";

/**
 * What `dashboard/fonts` became when fonts moved into the Fonts tree: a redirect to the tree's
 * root workspace, so a bookmark or an old link still lands on the fonts. `replaceState` rather
 * than a push, so Back does not bounce through here again.
 */
@customElement("di-fonts-redirect")
export class DiFontsRedirectElement extends UmbLitElement {
  override connectedCallback() {
    super.connectedCallback();
    window.history.replaceState(null, "", hrefForWorkspace(DI_FONT_ROOT_ENTITY_TYPE));
  }
}

export default DiFontsRedirectElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-fonts-redirect": DiFontsRedirectElement;
  }
}
