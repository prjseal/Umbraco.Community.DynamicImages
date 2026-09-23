import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbDetailRepositoryBase } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase } from "@umbraco-cms/backoffice/store";
import type { UmbFolderModel } from "@umbraco-cms/backoffice/tree";
import { DiFontFolderServerDataSource } from "./font-folder.server.data-source.js";

export const DI_FONT_FOLDER_STORE_CONTEXT = new UmbContextToken<DiFontFolderStore>("DiFontFolderStore");

export class DiFontFolderStore extends UmbDetailStoreBase<UmbFolderModel> {
  constructor(host: UmbControllerHost) {
    super(host, DI_FONT_FOLDER_STORE_CONTEXT);
  }
}

/** What the folderUpdate / folderDelete kinds and the folder create option talk to. */
export class DiFontFolderRepository extends UmbDetailRepositoryBase<UmbFolderModel> implements UmbApi {
  constructor(host: UmbControllerHost) {
    super(host, DiFontFolderServerDataSource, DI_FONT_FOLDER_STORE_CONTEXT);
  }
}

export { DiFontFolderRepository as api };
