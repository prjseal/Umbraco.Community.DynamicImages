import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent } from "@umbraco-cms/backoffice/entity-action";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbDuplicateToRepository, UmbDuplicateToRequestArgs } from "@umbraco-cms/backoffice/tree";
import { duplicateTemplate } from "../api/dynamic-images-api.js";
import { diExecute } from "../api/di-execute.js";
import { DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_ROOT_ENTITY_TYPE } from "../tree/constants.js";

/**
 * What core's `duplicateTo` kind calls, over `POST templates/{key}/duplicate`. Like the move
 * repositories, it reloads the destination itself: core's action reloads only the structure of
 * the item it copied from (its code carries a "TODO: Reload destination").
 */
export class DiDuplicateToTemplateRepository extends UmbRepositoryBase implements UmbDuplicateToRepository, UmbApi {
  async requestDuplicateTo(args: UmbDuplicateToRequestArgs) {
    const destination = args.destination.unique;
    const { data, error } = await diExecute(this, (token) => duplicateTemplate(args.unique, destination, token));

    if (data) {
      const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
      notifications?.peek("positive", { data: { message: `'${data.template.name}' created` } });

      const events = await this.getContext(UMB_ACTION_EVENT_CONTEXT).catch(() => undefined);
      events?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
        entityType: destination ? DI_TEMPLATE_FOLDER_ENTITY_TYPE : DI_TEMPLATE_ROOT_ENTITY_TYPE,
        unique: destination,
      }));
    }

    return { error };
  }
}

export { DiDuplicateToTemplateRepository as api };
