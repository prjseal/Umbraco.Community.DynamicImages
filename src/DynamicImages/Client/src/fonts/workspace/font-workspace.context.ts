import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbEntityDetailWorkspaceContextBase, UMB_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import type { DiFontStyle } from "../../api/types.js";
import { variantName, type DiFontDetailModel, type DiFontDetailRepository } from "./font-detail.repository.js";
import { DI_FONT_DETAIL_REPOSITORY_ALIAS, DI_FONT_ENTITY_TYPE, DI_FONT_WORKSPACE_ALIAS } from "../constants.js";

/**
 * One variant: its named styles, weight and slant, saved with the workspace's Save. What the fonts
 * dashboard's inline editor was, as a workspace of its own.
 */
export class DiFontWorkspaceContext extends UmbEntityDetailWorkspaceContextBase<DiFontDetailModel, DiFontDetailRepository> {
  readonly current = this._data.current;

  constructor(host: UmbControllerHost) {
    super(host, {
      workspaceAlias: DI_FONT_WORKSPACE_ALIAS,
      entityType: DI_FONT_ENTITY_TYPE,
      detailRepositoryAlias: DI_FONT_DETAIL_REPOSITORY_ALIAS,
    });

    this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => import("./di-font-editor.element.js"),
        setup: (_component, info) => {
          this.load(info.match.params.unique);
        },
      },
    ]);
  }

  setStyles(styles: DiFontStyle[]) {
    this._data.updateCurrent({ styles });
  }

  /** A detected weight is a guess read out of the file's names; this is how it is corrected. */
  setWeight(weight: number) {
    const current = this._data.getCurrent();
    this._data.updateCurrent({ weight, name: variantName(weight, current?.isItalic ?? false) });
  }

  setItalic(isItalic: boolean) {
    const current = this._data.getCurrent();
    this._data.updateCurrent({ isItalic, name: variantName(current?.weight ?? 400, isItalic) });
  }
}

export const DI_FONT_WORKSPACE_CONTEXT = new UmbContextToken<typeof UMB_WORKSPACE_CONTEXT.TYPE, DiFontWorkspaceContext>(
  UMB_WORKSPACE_CONTEXT.contextAlias,
  undefined,
  (context): context is DiFontWorkspaceContext => context.getEntityType?.() === DI_FONT_ENTITY_TYPE,
);

export { DiFontWorkspaceContext as api };
