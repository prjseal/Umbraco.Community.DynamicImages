import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbItemRepositoryBase, UmbItemServerDataSourceBase } from "@umbraco-cms/backoffice/repository";
import { UmbItemStoreBase } from "@umbraco-cms/backoffice/store";
import { fetchTreeItems } from "../../api/dynamic-images-api.js";
import type { DiTreeItem } from "../../api/types.js";
import { diExecute } from "../../api/di-execute.js";
import { DI_TEMPLATE_ENTITY_TYPE, DI_TEMPLATE_FOLDER_ENTITY_TYPE } from "../../tree/constants.js";

/** A template or folder by key, as the delete confirmation and other pickers name it. */
export interface DiTemplateItemModel {
  unique: string;
  entityType: string;
  name: string;
  isFolder: boolean;
  isEnabled: boolean;
}

export const DI_TEMPLATE_ITEM_STORE_CONTEXT = new UmbContextToken<DiTemplateItemStore>("DiTemplateItemStore");

export class DiTemplateItemStore extends UmbItemStoreBase<DiTemplateItemModel> {
  constructor(host: UmbControllerHost) {
    super(host, DI_TEMPLATE_ITEM_STORE_CONTEXT);
  }
}

class DiTemplateItemServerDataSource extends UmbItemServerDataSourceBase<DiTreeItem, DiTemplateItemModel> {
  constructor(host: UmbControllerHost) {
    super(host, {
      getItems: (uniques) => diExecute(host, (token) => fetchTreeItems(uniques, token)) as never,
      mapper: (item) => ({
        unique: item.key,
        entityType: item.entityType === "folder" ? DI_TEMPLATE_FOLDER_ENTITY_TYPE : DI_TEMPLATE_ENTITY_TYPE,
        name: item.name,
        isFolder: item.entityType === "folder",
        isEnabled: item.isEnabled,
      }),
    });
  }
}

/** Over `GET item?key=…`: what the `delete` entity action kind reads the name from. */
export class DiTemplateItemRepository extends UmbItemRepositoryBase<DiTemplateItemModel> implements UmbApi {
  constructor(host: UmbControllerHost) {
    super(host, DiTemplateItemServerDataSource, DI_TEMPLATE_ITEM_STORE_CONTEXT);
  }
}

export { DiTemplateItemRepository as api };
