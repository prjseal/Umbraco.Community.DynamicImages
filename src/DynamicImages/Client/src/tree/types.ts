import type { UmbTreeItemModel, UmbTreeRootModel } from "@umbraco-cms/backoffice/tree";

export interface DiTemplateTreeItemModel extends UmbTreeItemModel {
  isEnabled: boolean;
}

export type DiTemplateTreeRootModel = UmbTreeRootModel;
