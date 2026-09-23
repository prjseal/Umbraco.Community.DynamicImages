import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbDetailRepositoryBase } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase } from "@umbraco-cms/backoffice/store";
import type { UmbFolderModel } from "@umbraco-cms/backoffice/tree";
import { DiTemplateFolderServerDataSource } from "./template-folder.server.data-source.js";

export const DI_TEMPLATE_FOLDER_STORE_CONTEXT = new UmbContextToken<DiTemplateFolderStore>("DiTemplateFolderStore");

/** Required by UmbDetailRepositoryBase, exactly as core's document type folder store is. */
export class DiTemplateFolderStore extends UmbDetailStoreBase<UmbFolderModel> {
  constructor(host: UmbControllerHost) {
    super(host, DI_TEMPLATE_FOLDER_STORE_CONTEXT);
  }
}

/** What the folderUpdate / folderDelete kinds and the folder create option talk to. */
export class DiTemplateFolderRepository extends UmbDetailRepositoryBase<UmbFolderModel> implements UmbApi {
  constructor(host: UmbControllerHost) {
    super(host, DiTemplateFolderServerDataSource, DI_TEMPLATE_FOLDER_STORE_CONTEXT);
  }
}

export { DiTemplateFolderRepository as api };
