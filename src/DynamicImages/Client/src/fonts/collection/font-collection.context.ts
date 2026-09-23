import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import { hrefForWorkspace } from "../../api/dynamic-images-api.js";
import type { DiFontCollectionItemModel } from "./types.js";

/** Core's default collection, plus the link each row and card opens: the item's own workspace. */
export class DiFontCollectionContext extends UmbDefaultCollectionContext<DiFontCollectionItemModel> {
  override async requestItemHref(item: DiFontCollectionItemModel) {
    return hrefForWorkspace(item.entityType, item.unique);
  }
}

export { DiFontCollectionContext as api };
