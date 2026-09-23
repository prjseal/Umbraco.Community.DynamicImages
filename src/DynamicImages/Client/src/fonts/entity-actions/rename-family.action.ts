import { UmbEntityActionBase } from "@umbraco-cms/backoffice/entity-action";
import { hrefForWorkspace } from "../../api/dynamic-images-api.js";

/**
 * Rename on a family: opens its workspace, whose header is the name. Core's folderUpdate kind is
 * for folders only, and its generic rename modal is too - a family's workspace is where it is named.
 */
export class DiRenameFontFamilyEntityAction extends UmbEntityActionBase<never> {
  override async getHref() {
    return this.args.unique ? hrefForWorkspace(this.args.entityType, this.args.unique) : undefined;
  }
}

export { DiRenameFontFamilyEntityAction as api };
