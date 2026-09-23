import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbDuplicateRepository, UmbDuplicateRequestArgs } from "@umbraco-cms/backoffice/entity-action";
import { duplicateTemplate } from "../api/dynamic-images-api.js";
import { diExecute } from "../api/di-execute.js";

/** Over `POST templates/{key}/duplicate`, which copies into the same folder. */
export class DiDuplicateTemplateRepository extends UmbRepositoryBase implements UmbDuplicateRepository, UmbApi {
  async requestDuplicate(args: UmbDuplicateRequestArgs) {
    const { data, error } = await diExecute(this, (token) => duplicateTemplate(args.unique, token));

    if (data) {
      const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
      notifications?.peek("positive", { data: { message: `'${data.template.name}' created` } });
    }

    return { error };
  }
}

export { DiDuplicateTemplateRepository as api };
