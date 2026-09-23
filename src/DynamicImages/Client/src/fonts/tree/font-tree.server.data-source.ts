import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbTreeServerDataSourceBase,
  type UmbTreeAncestorsOfRequestArgs,
  type UmbTreeChildrenOfRequestArgs,
  type UmbTreeRootItemsRequestArgs,
} from "@umbraco-cms/backoffice/tree";
import { fetchFontTreeAncestors, fetchFontTreeChildren, fetchFontTreeRoot } from "../../api/dynamic-images-api.js";
import type { DiFontTreeItem } from "../../api/types.js";
import { diExecute } from "../../api/di-execute.js";
import {
  DI_FONT_FAMILY_ENTITY_TYPE, DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_ROOT_ENTITY_TYPE, fontEntityType, fontIcon,
} from "../constants.js";
import type { DiFontTreeItemModel } from "./types.js";

function paging(args: UmbTreeRootItemsRequestArgs | UmbTreeChildrenOfRequestArgs): { skip: number; take: number } {
  const page = args.paging as { skip?: number; take?: number } | undefined;
  return { skip: page?.skip ?? args.skip ?? 0, take: page?.take ?? args.take ?? 100 };
}

/** One server row as a tree item. A variant's parent is its family; anything else's is a folder or the root. */
export function mapFontTreeItem(item: DiFontTreeItem): DiFontTreeItemModel {
  const parentEntityType = !item.parentKey
    ? DI_FONT_ROOT_ENTITY_TYPE
    : item.entityType === "font"
      ? DI_FONT_FAMILY_ENTITY_TYPE
      : DI_FONT_FOLDER_ENTITY_TYPE;

  return {
    unique: item.key,
    parent: { unique: item.parentKey, entityType: parentEntityType },
    name: item.name,
    entityType: fontEntityType(item.entityType),
    hasChildren: item.hasChildren,
    isFolder: item.entityType !== "font",
    icon: fontIcon(item.entityType, item.isUrlFont),
    isUrlFont: item.isUrlFont,
  };
}

/** The Fonts tree's data source, over `fonts/tree/*`, as the Templates tree's is over `tree/*`. */
export class DiFontTreeServerDataSource extends UmbTreeServerDataSourceBase<DiFontTreeItem, DiFontTreeItemModel> {
  constructor(host: UmbControllerHost) {
    super(host, {
      getRootItems: (args) => {
        const { skip, take } = paging(args);
        return diExecute(host, (token) => fetchFontTreeRoot(skip, take, args.foldersOnly ?? false, token)) as never;
      },
      getChildrenOf: (args) => {
        const { skip, take } = paging(args);
        if (args.parent.unique === null) {
          return diExecute(host, (token) => fetchFontTreeRoot(skip, take, args.foldersOnly ?? false, token)) as never;
        }

        const parentKey = args.parent.unique;
        return diExecute(host, (token) =>
          fetchFontTreeChildren(parentKey, skip, take, args.foldersOnly ?? false, token)) as never;
      },
      getAncestorsOf: (args: UmbTreeAncestorsOfRequestArgs) =>
        diExecute(host, (token) => fetchFontTreeAncestors(args.treeItem.unique, token)) as never,
      mapper: mapFontTreeItem,
    });
  }
}
