import { UmbSubmitWorkspaceAction } from "@umbraco-cms/backoffice/workspace";
import {
  DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_FOLDER_REPOSITORY_ALIAS, DI_FONT_FOLDER_STORE_ALIAS, DI_FONT_FOLDER_WORKSPACE_ALIAS,
} from "../constants.js";
import { DiFontFolderStore } from "./font-folder.repository.js";

/** Font folders, as `tree/folder/manifests.ts` is for template folders. */
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: DI_FONT_FOLDER_REPOSITORY_ALIAS,
    name: "Dynamic Images Font Folder Repository",
    api: () => import("./font-folder.repository.js"),
  },
  {
    type: "store",
    alias: DI_FONT_FOLDER_STORE_ALIAS,
    name: "Dynamic Images Font Folder Store",
    api: DiFontFolderStore,
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.FontFolder.Rename",
    name: "Rename Dynamic Images Font Folder",
    forEntityTypes: [DI_FONT_FOLDER_ENTITY_TYPE],
    meta: { folderRepositoryAlias: DI_FONT_FOLDER_REPOSITORY_ALIAS },
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.FontFolder.Delete",
    name: "Delete Dynamic Images Font Folder",
    forEntityTypes: [DI_FONT_FOLDER_ENTITY_TYPE],
    meta: { folderRepositoryAlias: DI_FONT_FOLDER_REPOSITORY_ALIAS },
  },
  {
    type: "workspace",
    kind: "routable",
    alias: DI_FONT_FOLDER_WORKSPACE_ALIAS,
    name: "Dynamic Images Font Folder Workspace",
    api: () => import("./font-folder-workspace.context.js"),
    meta: { entityType: DI_FONT_FOLDER_ENTITY_TYPE },
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.FontFolder.Submit",
    name: "Save Dynamic Images Font Folder",
    api: UmbSubmitWorkspaceAction,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: DI_FONT_FOLDER_WORKSPACE_ALIAS }],
  },
];
