import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import type { UmbCollectionFilterModel, UmbCollectionRepository } from "@umbraco-cms/backoffice/collection";
import { UMB_ENTITY_CONTEXT } from "@umbraco-cms/backoffice/entity";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import { fetchCollection } from "../api/dynamic-images-api.js";
import type { DiCollectionItem } from "../api/types.js";
import { diExecute } from "../api/di-execute.js";
import {
  DI_TEMPLATE_DISABLED_ICON, DI_TEMPLATE_ENTITY_TYPE, DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_FOLDER_ICON,
  DI_TEMPLATE_ICON,
} from "../tree/constants.js";
import type { DiTemplateCollectionItemModel } from "./types.js";

export function mapCollectionItem(item: DiCollectionItem): DiTemplateCollectionItemModel {
  const isFolder = item.entityType === "folder";

  return {
    unique: item.key,
    entityType: isFolder ? DI_TEMPLATE_FOLDER_ENTITY_TYPE : DI_TEMPLATE_ENTITY_TYPE,
    name: item.name,
    icon: isFolder ? DI_TEMPLATE_FOLDER_ICON : item.isEnabled ? DI_TEMPLATE_ICON : DI_TEMPLATE_DISABLED_ICON,
    isFolder,
    docTypes: (item.docTypeAliases ?? []).join(", "),
    targetProperty: item.targetPropertyAlias ?? "",
    canvas: item.canvasWidth && item.canvasHeight ? `${item.canvasWidth} × ${item.canvasHeight}` : "",
    layers: item.layerCount === null ? "" : String(item.layerCount),
    isEnabled: isFolder ? undefined : item.isEnabled,
    updated: item.updatedUtc ?? undefined,
  };
}

/**
 * What the Templates root and each folder list: everything directly inside, over
 * `collection/templates`. The parent comes from the entity context the root or folder workspace
 * provides, exactly as core's `UmbTreeItemChildrenCollectionRepositoryBase` finds it.
 */
export class DiTemplateCollectionRepository extends UmbRepositoryBase implements UmbCollectionRepository, UmbApi {
  async requestCollection(filter: UmbCollectionFilterModel = {}) {
    const entity = await this.getContext(UMB_ENTITY_CONTEXT);
    const parentKey = entity?.getUnique() ?? null;

    const { data, error } = await diExecute(this, (token) =>
      fetchCollection({ parentKey, filter: filter.filter, skip: filter.skip, take: filter.take }, token));

    return data ? { data: { total: data.total, items: data.items.map(mapCollectionItem) } } : { error };
  }
}

export { DiTemplateCollectionRepository as api };
