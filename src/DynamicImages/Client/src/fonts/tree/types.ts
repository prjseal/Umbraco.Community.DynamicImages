import type { UmbTreeItemModel, UmbTreeRootModel } from "@umbraco-cms/backoffice/tree";

export interface DiFontTreeItemModel extends UmbTreeItemModel {
  /** A variant fetched from the web - the only kind the Refresh action applies to. */
  isUrlFont: boolean;
}

export type DiFontTreeRootModel = UmbTreeRootModel;
