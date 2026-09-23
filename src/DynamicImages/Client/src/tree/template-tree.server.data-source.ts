import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbTreeServerDataSourceBase,
  type UmbTreeAncestorsOfRequestArgs,
  type UmbTreeChildrenOfRequestArgs,
  type UmbTreeRootItemsRequestArgs,
} from "@umbraco-cms/backoffice/tree";
import { fetchTreeAncestors, fetchTreeChildren, fetchTreeRoot } from "../api/dynamic-images-api.js";
import type { DiTreeItem } from "../api/types.js";
import { diExecute } from "../api/di-execute.js";
import {
  DI_TEMPLATE_DISABLED_ICON, DI_TEMPLATE_ENTITY_TYPE, DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_FOLDER_ICON,
  DI_TEMPLATE_ICON, DI_TEMPLATE_ROOT_ENTITY_TYPE,
} from "./constants.js";
import type { DiTemplateTreeItemModel } from "./types.js";

/** Offset paging, whichever of the two argument shapes core sent. */
function paging(args: UmbTreeRootItemsRequestArgs | UmbTreeChildrenOfRequestArgs): { skip: number; take: number } {
  const page = args.paging as { skip?: number; take?: number } | undefined;
  return { skip: page?.skip ?? args.skip ?? 0, take: page?.take ?? args.take ?? 100 };
}

/** One server row as a tree item. */
export function mapTreeItem(item: DiTreeItem): DiTemplateTreeItemModel {
  const isFolder = item.entityType === "folder";

  return {
    unique: item.key,
    parent: {
      unique: item.parentKey,
      entityType: item.parentKey ? DI_TEMPLATE_FOLDER_ENTITY_TYPE : DI_TEMPLATE_ROOT_ENTITY_TYPE,
    },
    name: item.name,
    entityType: isFolder ? DI_TEMPLATE_FOLDER_ENTITY_TYPE : DI_TEMPLATE_ENTITY_TYPE,
    hasChildren: item.hasChildren,
    isFolder,
    icon: isFolder ? DI_TEMPLATE_FOLDER_ICON : item.isEnabled ? DI_TEMPLATE_ICON : DI_TEMPLATE_DISABLED_ICON,
    isEnabled: item.isEnabled,
  };
}

/**
 * The Templates tree's data source, over `tree/root`, `tree/children` and `tree/ancestors`.
 * Modelled on core's document type tree data source; the requests are this package's own
 * hand-written API rather than a generated client.
 */
export class DiTemplateTreeServerDataSource extends UmbTreeServerDataSourceBase<DiTreeItem, DiTemplateTreeItemModel> {
  constructor(host: UmbControllerHost) {
    super(host, {
      getRootItems: (args) => {
        const { skip, take } = paging(args);
        return diExecute(host, (token) => fetchTreeRoot(skip, take, args.foldersOnly ?? false, token)) as never;
      },
      getChildrenOf: (args) => {
        if (args.parent.unique === null) {
          const { skip, take } = paging(args);
          return diExecute(host, (token) => fetchTreeRoot(skip, take, args.foldersOnly ?? false, token)) as never;
        }

        const parentKey = args.parent.unique;
        const { skip, take } = paging(args);
        return diExecute(host, (token) =>
          fetchTreeChildren(parentKey, skip, take, args.foldersOnly ?? false, token)) as never;
      },
      getAncestorsOf: (args: UmbTreeAncestorsOfRequestArgs) =>
        diExecute(host, (token) => fetchTreeAncestors(args.treeItem.unique, token)) as never,
      mapper: mapTreeItem,
    });
  }
}
