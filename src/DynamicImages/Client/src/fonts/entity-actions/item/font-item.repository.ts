import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbItemRepositoryBase, UmbItemServerDataSourceBase } from "@umbraco-cms/backoffice/repository";
import { UmbItemStoreBase } from "@umbraco-cms/backoffice/store";
import { fetchFontTreeItems } from "../../../api/dynamic-images-api.js";
import type { DiFontTreeItem } from "../../../api/types.js";
import { diExecute } from "../../../api/di-execute.js";
import { fontEntityType, fontIcon } from "../../constants.js";

/** A folder, family or variant by key, as the delete modals and pickers name and draw it. */
export interface DiFontItemModel {
  unique: string;
  entityType: string;
  name: string;
  icon: string;
  isUrlFont: boolean;
}

export function mapFontItem(item: DiFontTreeItem): DiFontItemModel {
  return {
    unique: item.key,
    entityType: fontEntityType(item.entityType),
    name: item.name,
    icon: fontIcon(item.entityType, item.isUrlFont),
    isUrlFont: item.isUrlFont,
  };
}

export const DI_FONT_ITEM_STORE_CONTEXT = new UmbContextToken<DiFontItemStore>("DiFontItemStore");

export class DiFontItemStore extends UmbItemStoreBase<DiFontItemModel> {
  constructor(host: UmbControllerHost) {
    super(host, DI_FONT_ITEM_STORE_CONTEXT);
  }
}

class DiFontItemServerDataSource extends UmbItemServerDataSourceBase<DiFontTreeItem, DiFontItemModel> {
  constructor(host: UmbControllerHost) {
    super(host, {
      getItems: (uniques) => diExecute(host, (token) => fetchFontTreeItems(uniques, token)) as never,
      mapper: mapFontItem,
    });
  }
}

/** Over `GET fonts/item?key=…`. */
export class DiFontItemRepository extends UmbItemRepositoryBase<DiFontItemModel> implements UmbApi {
  constructor(host: UmbControllerHost) {
    super(host, DiFontItemServerDataSource, DI_FONT_ITEM_STORE_CONTEXT);
  }
}

export { DiFontItemRepository as api };
