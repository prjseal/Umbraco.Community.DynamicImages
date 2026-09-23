import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import { deleteFont, deleteFontFamily, deleteFontFolder, fetchFontTreeItems } from "../../../api/dynamic-images-api.js";
import { diExecute } from "../../../api/di-execute.js";

/**
 * The `delete` half of a detail repository, which is all core's bulk delete asks of one: a Fonts
 * collection's selection can hold folders and families together, so each key is deleted by what
 * it is. A family still in use and a folder that is not empty are refused by the server, and
 * core's bulk action shows each refusal as that item's error.
 */
export class DiFontBulkDeleteRepository extends UmbRepositoryBase implements UmbApi {
  delete(unique: string) {
    return diExecute(this, async (token) => {
      const [item] = await fetchFontTreeItems([unique], token);

      switch (item?.entityType) {
        case "folder":
          return deleteFontFolder(unique, token);
        case "family":
          return deleteFontFamily(unique, token);
        default:
          return deleteFont(unique, token);
      }
    });
  }
}

export { DiFontBulkDeleteRepository as api };
