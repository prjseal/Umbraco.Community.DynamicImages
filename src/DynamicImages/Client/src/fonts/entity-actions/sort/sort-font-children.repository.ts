import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbSortChildrenOfArgs, UmbSortChildrenOfRepository } from "@umbraco-cms/backoffice/tree";
import { sortFontTreeChildren } from "../../../api/dynamic-images-api.js";
import { diExecute } from "../../../api/di-execute.js";

/** Sort children on the Fonts root and folders, over `PUT fonts/tree/sort`; as the Templates one. */
export class DiSortFontChildrenRepository extends UmbRepositoryBase implements UmbSortChildrenOfRepository, UmbApi {
  async sortChildrenOf(args: UmbSortChildrenOfArgs) {
    const sorting = args.sorting.map((s) => ({ key: s.unique, sortOrder: s.sortOrder }));
    const { error } = await diExecute(this, (token) => sortFontTreeChildren(args.unique, sorting, token));

    if (!error) {
      const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
      notifications?.peek("positive", { data: { message: "Sorted" } });
    }

    return { error };
  }
}

export { DiSortFontChildrenRepository as api };
