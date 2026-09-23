import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import type { UmbCollectionFilterModel, UmbCollectionRepository } from "@umbraco-cms/backoffice/collection";
import { UMB_ENTITY_CONTEXT } from "@umbraco-cms/backoffice/entity";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import { fetchFontCollection } from "../../api/dynamic-images-api.js";
import type { DiFontCollectionItem } from "../../api/types.js";
import { diExecute } from "../../api/di-execute.js";
import { fontEntityType, fontIcon } from "../constants.js";
import type { DiFontCollectionItemModel } from "./types.js";

function sourceLabel(item: DiFontCollectionItem): string {
  switch (item.sourceKind) {
    case "path":
      return "wwwroot";
    case "url":
      return item.provider === "google" ? "Google Fonts" : item.provider === "bunny" ? "Bunny Fonts" : "Web";
    case "media":
      return "Media library";
    default:
      return "";
  }
}

export function mapFontCollectionItem(item: DiFontCollectionItem): DiFontCollectionItemModel {
  return {
    unique: item.key,
    entityType: fontEntityType(item.entityType),
    name: item.name,
    icon: fontIcon(item.entityType, item.sourceKind === "url"),
    isFolder: item.entityType === "folder",
    variants: item.variantCount === null ? "" : String(item.variantCount),
    usedBy: item.usedByTemplateCount === null ? "" : String(item.usedByTemplateCount),
    weight: item.weight === null ? "" : String(item.weight),
    style: item.isItalic === null ? "" : item.isItalic ? "Italic" : "Upright",
    source: sourceLabel(item),
    sampleFontKey: item.sampleFontKey,
  };
}

/**
 * What the Fonts root, a folder and a family list, over `fonts/collection`: the level's folders
 * and families, or the family's variants. The parent is the workspace's entity, as for templates.
 */
export class DiFontCollectionRepository extends UmbRepositoryBase implements UmbCollectionRepository, UmbApi {
  async requestCollection(filter: UmbCollectionFilterModel = {}) {
    const entity = await this.getContext(UMB_ENTITY_CONTEXT);
    const parentKey = entity?.getUnique() ?? null;

    const { data, error } = await diExecute(this, (token) =>
      fetchFontCollection({ parentKey, filter: filter.filter, skip: filter.skip, take: filter.take }, token));

    return data ? { data: { total: data.total, items: data.items.map(mapFontCollectionItem) } } : { error };
  }
}

export { DiFontCollectionRepository as api };
