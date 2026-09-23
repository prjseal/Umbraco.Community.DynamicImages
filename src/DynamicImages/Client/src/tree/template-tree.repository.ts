import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbTreeRepositoryBase } from "@umbraco-cms/backoffice/tree";
import { DI_TEMPLATE_ROOT_ENTITY_TYPE } from "./constants.js";
import { DiTemplateTreeServerDataSource } from "./template-tree.server.data-source.js";
import type { DiTemplateTreeItemModel, DiTemplateTreeRootModel } from "./types.js";

/**
 * The Templates tree. No tree store: core marks `UmbUniqueTreeStore` deprecated in 17.5 ("use
 * the tree repository instead"), and the tree, the tree picker and the collection all read
 * through `requestTreeRootItems` / `requestTreeItemsOf`, which do not need one.
 */
export class DiTemplateTreeRepository
  extends UmbTreeRepositoryBase<DiTemplateTreeItemModel, DiTemplateTreeRootModel>
  implements UmbApi {
  constructor(host: UmbControllerHost) {
    super(host, DiTemplateTreeServerDataSource);
  }

  async requestTreeRoot() {
    // take=0 asks only whether there is anything, as core's document type tree does.
    const { data } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });

    const root: DiTemplateTreeRootModel = {
      unique: null,
      entityType: DI_TEMPLATE_ROOT_ENTITY_TYPE,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: data ? data.total > 0 : false,
      isFolder: true,
    };

    return { data: root };
  }
}

export { DiTemplateTreeRepository as api };
