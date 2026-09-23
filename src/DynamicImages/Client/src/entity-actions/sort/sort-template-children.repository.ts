import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbSortChildrenOfArgs, UmbSortChildrenOfRepository } from "@umbraco-cms/backoffice/tree";
import { sortTreeChildren } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";

/**
 * What core's `sortChildrenOf` kind calls, over `PUT tree/sort`. Core's modal sends only the
 * children that were dragged, each at its final index; the server fills in everything else. The
 * action itself reloads the parent's children afterwards.
 */
export class DiSortTemplateChildrenRepository extends UmbRepositoryBase implements UmbSortChildrenOfRepository, UmbApi {
  async sortChildrenOf(args: UmbSortChildrenOfArgs) {
    const sorting = args.sorting.map((s) => ({ key: s.unique, sortOrder: s.sortOrder }));
    const { error } = await diExecute(this, (token) => sortTreeChildren(args.unique, sorting, token));

    if (!error) {
      const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
      notifications?.peek("positive", { data: { message: "Sorted" } });
    }

    return { error };
  }
}

export { DiSortTemplateChildrenRepository as api };
