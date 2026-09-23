import { UmbSubmitWorkspaceAction } from "@umbraco-cms/backoffice/workspace";
import {
  DI_FONT_DETAIL_REPOSITORY_ALIAS, DI_FONT_DETAIL_STORE_ALIAS, DI_FONT_ENTITY_TYPE, DI_FONT_FAMILY_DETAIL_REPOSITORY_ALIAS,
  DI_FONT_FAMILY_DETAIL_STORE_ALIAS, DI_FONT_FAMILY_ENTITY_TYPE, DI_FONT_FAMILY_WORKSPACE_ALIAS, DI_FONT_WORKSPACE_ALIAS,
} from "../constants.js";
import { DiFontFamilyDetailStore } from "./font-family-detail.repository.js";
import { DiFontDetailStore } from "./font-detail.repository.js";

const save = (alias: string, workspaceAlias: string): UmbExtensionManifest => ({
  type: "workspaceAction",
  kind: "default",
  alias,
  name: `Save ${workspaceAlias}`,
  api: UmbSubmitWorkspaceAction,
  meta: { label: "#buttons_save", look: "primary", color: "positive" },
  conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: workspaceAlias }],
});

/**
 * A family's workspace - its name and its Variants collection (collection/manifests.ts) - and a
 * variant's, which replaces the fonts dashboard's inline editor.
 */
export const manifests: Array<UmbExtensionManifest> = [
  // ---------------------------------------------------------------- family
  {
    type: "repository",
    alias: DI_FONT_FAMILY_DETAIL_REPOSITORY_ALIAS,
    name: "Dynamic Images Font Family Detail Repository",
    api: () => import("./font-family-detail.repository.js"),
  },
  {
    type: "store",
    alias: DI_FONT_FAMILY_DETAIL_STORE_ALIAS,
    name: "Dynamic Images Font Family Detail Store",
    api: DiFontFamilyDetailStore,
  },
  {
    type: "workspace",
    kind: "routable",
    alias: DI_FONT_FAMILY_WORKSPACE_ALIAS,
    name: "Dynamic Images Font Family Workspace",
    api: () => import("./font-family-workspace.context.js"),
    meta: { entityType: DI_FONT_FAMILY_ENTITY_TYPE },
  },
  save("DynamicImages.WorkspaceAction.FontFamily.Submit", DI_FONT_FAMILY_WORKSPACE_ALIAS),

  // ---------------------------------------------------------------- variant
  {
    type: "repository",
    alias: DI_FONT_DETAIL_REPOSITORY_ALIAS,
    name: "Dynamic Images Font Detail Repository",
    api: () => import("./font-detail.repository.js"),
  },
  {
    type: "store",
    alias: DI_FONT_DETAIL_STORE_ALIAS,
    name: "Dynamic Images Font Detail Store",
    api: DiFontDetailStore,
  },
  {
    type: "workspace",
    kind: "routable",
    alias: DI_FONT_WORKSPACE_ALIAS,
    name: "Dynamic Images Font Workspace",
    api: () => import("./font-workspace.context.js"),
    meta: { entityType: DI_FONT_ENTITY_TYPE },
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Font",
    name: "Dynamic Images Font View",
    element: () => import("./di-font-workspace-view.element.js"),
    weight: 100,
    meta: { label: "Font", pathname: "font", icon: "icon-font" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: DI_FONT_WORKSPACE_ALIAS }],
  },
  save("DynamicImages.WorkspaceAction.Font.Submit", DI_FONT_WORKSPACE_ALIAS),
];
