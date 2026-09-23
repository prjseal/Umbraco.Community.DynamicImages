import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbTreeRepositoryBase } from "@umbraco-cms/backoffice/tree";
import { DI_FONT_ROOT_ENTITY_TYPE } from "../constants.js";
import { DiFontTreeServerDataSource } from "./font-tree.server.data-source.js";
import type { DiFontTreeItemModel, DiFontTreeRootModel } from "./types.js";

/** The Fonts tree, as `DiTemplateTreeRepository` is the Templates tree: no tree store. */
export class DiFontTreeRepository extends UmbTreeRepositoryBase<DiFontTreeItemModel, DiFontTreeRootModel> implements UmbApi {
  constructor(host: UmbControllerHost) {
    super(host, DiFontTreeServerDataSource);
  }

  async requestTreeRoot() {
    const { data } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });

    const root: DiFontTreeRootModel = {
      unique: null,
      entityType: DI_FONT_ROOT_ENTITY_TYPE,
      name: "Fonts",
      icon: "icon-folder",
      hasChildren: data ? data.total > 0 : false,
      isFolder: true,
    };

    return { data: root };
  }
}

export { DiFontTreeRepository as api };
