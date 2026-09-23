import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbEntityNamedDetailWorkspaceContextBase } from "@umbraco-cms/backoffice/workspace";
import type { DiFontFamilyDetailModel, DiFontFamilyDetailRepository } from "./font-family-detail.repository.js";
import { DI_FONT_FAMILY_DETAIL_REPOSITORY_ALIAS, DI_FONT_FAMILY_ENTITY_TYPE, DI_FONT_FAMILY_WORKSPACE_ALIAS } from "../constants.js";

/**
 * A family: its name in the header, editable and saved as a rename, and the Variants collection.
 * The same shape as a folder workspace, which is what a family is to its variants.
 */
export class DiFontFamilyWorkspaceContext extends UmbEntityNamedDetailWorkspaceContextBase<
  DiFontFamilyDetailModel,
  DiFontFamilyDetailRepository
> {
  constructor(host: UmbControllerHost) {
    super(host, {
      workspaceAlias: DI_FONT_FAMILY_WORKSPACE_ALIAS,
      entityType: DI_FONT_FAMILY_ENTITY_TYPE,
      detailRepositoryAlias: DI_FONT_FAMILY_DETAIL_REPOSITORY_ALIAS,
    });

    this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => import("./di-font-family-editor.element.js"),
        setup: (_component, info) => {
          this.load(info.match.params.unique);
        },
      },
    ]);
  }
}

export { DiFontFamilyWorkspaceContext as api };
