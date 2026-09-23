import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbFolderModel } from "@umbraco-cms/backoffice/tree";
import { UmbEntityNamedDetailWorkspaceContextBase } from "@umbraco-cms/backoffice/workspace";
import type { DiFontFolderRepository } from "./font-folder.repository.js";
import { DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_FOLDER_REPOSITORY_ALIAS, DI_FONT_FOLDER_WORKSPACE_ALIAS } from "../constants.js";

/** The font folder workspace: its name in the header, Save, and the collection of what is in it. */
export class DiFontFolderWorkspaceContext extends UmbEntityNamedDetailWorkspaceContextBase<UmbFolderModel, DiFontFolderRepository> {
  constructor(host: UmbControllerHost) {
    super(host, {
      workspaceAlias: DI_FONT_FOLDER_WORKSPACE_ALIAS,
      entityType: DI_FONT_FOLDER_ENTITY_TYPE,
      detailRepositoryAlias: DI_FONT_FOLDER_REPOSITORY_ALIAS,
    });

    this.routes.setRoutes([
      {
        path: "edit/:unique",
        // The same element as a template folder's: core's editable folder header, nothing more.
        component: () => import("../../tree/folder/di-template-folder-editor.element.js"),
        setup: (_component, info) => {
          this.load(info.match.params.unique);
        },
      },
    ]);
  }
}

export { DiFontFolderWorkspaceContext as api };
