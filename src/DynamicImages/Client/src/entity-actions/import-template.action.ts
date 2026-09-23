import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbEntityActionBase, UmbRequestReloadChildrenOfEntityEvent } from "@umbraco-cms/backoffice/entity-action";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { importTemplate } from "../api/dynamic-images-api.js";
import { diExecute } from "../api/di-execute.js";
import { DI_IMPORT_TEMPLATE_MODAL } from "../modals/tokens.js";

/** Import JSON on the Templates root and on folders: into the folder it was started from. */
export class DiImportTemplateEntityAction extends UmbEntityActionBase<never> {
  override async execute() {
    const { json } = await umbOpenModal(this, DI_IMPORT_TEMPLATE_MODAL, { data: {} });

    const parentKey = this.args.unique ?? null;
    const { data, error } = await diExecute(this, (token) => importTemplate(json, "create", token, parentKey));
    if (error || !data) throw error ?? new Error("The template could not be imported.");

    const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    notifications?.peek("positive", { data: { message: `'${data.template.name}' imported` } });
    for (const warning of data.warnings) notifications?.peek("warning", { data: { message: warning.message } });

    const events = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
    events?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
      entityType: this.args.entityType,
      unique: this.args.unique,
    }));
  }
}

export { DiImportTemplateEntityAction as api };
