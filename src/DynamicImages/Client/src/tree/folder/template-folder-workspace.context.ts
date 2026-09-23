import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbFolderModel } from "@umbraco-cms/backoffice/tree";
import { UmbEntityNamedDetailWorkspaceContextBase } from "@umbraco-cms/backoffice/workspace";
import type { DiTemplateFolderRepository } from "./template-folder.repository.js";
import {
  DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_FOLDER_REPOSITORY_ALIAS, DI_TEMPLATE_FOLDER_WORKSPACE_ALIAS,
} from "../constants.js";

/**
 * The folder workspace: the folder's name in the header, a Save action, and the collection of
 * what is in it. A line-for-line copy of core's document type folder workspace context.
 */
export class DiTemplateFolderWorkspaceContext extends UmbEntityNamedDetailWorkspaceContextBase<
  UmbFolderModel,
  DiTemplateFolderRepository
> {
  constructor(host: UmbControllerHost) {
    super(host, {
      workspaceAlias: DI_TEMPLATE_FOLDER_WORKSPACE_ALIAS,
      entityType: DI_TEMPLATE_FOLDER_ENTITY_TYPE,
      detailRepositoryAlias: DI_TEMPLATE_FOLDER_REPOSITORY_ALIAS,
    });

    this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => import("./di-template-folder-editor.element.js"),
        setup: (_component, info) => {
          this.load(info.match.params.unique);
        },
      },
    ]);
  }
}

export { DiTemplateFolderWorkspaceContext as api };
