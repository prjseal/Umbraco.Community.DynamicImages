import { UmbEntityCreateOptionActionBase } from "@umbraco-cms/backoffice/entity-create-option-action";
import { hrefForCreate } from "../api/dynamic-images-api.js";

/**
 * "Template" in the Create… dialog on the Templates root and on folders: a link to the create
 * route, carrying the folder it was started from so the new template is saved there.
 */
export class DiCreateTemplateOptionAction extends UmbEntityCreateOptionActionBase {
  override async getHref() {
    return hrefForCreate({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}

export { DiCreateTemplateOptionAction as api };
