import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import { hrefForTemplate, hrefForWorkspace } from "../api/dynamic-images-api.js";
import { DI_TEMPLATE_FOLDER_ENTITY_TYPE } from "../tree/constants.js";
import type { DiTemplateCollectionItemModel } from "./types.js";

/** Core's default collection, plus the link each row and card opens - as core's user group collection does. */
export class DiTemplateCollectionContext extends UmbDefaultCollectionContext<DiTemplateCollectionItemModel> {
  override async requestItemHref(item: DiTemplateCollectionItemModel) {
    return item.entityType === DI_TEMPLATE_FOLDER_ENTITY_TYPE
      ? hrefForWorkspace(DI_TEMPLATE_FOLDER_ENTITY_TYPE, item.unique)
      : hrefForTemplate(item.unique);
  }
}

export { DiTemplateCollectionContext as api };
