import { UmbSubmitWorkspaceAction } from "@umbraco-cms/backoffice/workspace";
import {
  DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_FOLDER_REPOSITORY_ALIAS, DI_TEMPLATE_FOLDER_STORE_ALIAS,
  DI_TEMPLATE_FOLDER_WORKSPACE_ALIAS,
} from "../constants.js";
import { DiTemplateFolderStore } from "./template-folder.repository.js";

/** Modelled on core's `documents/document-types/tree/folder/manifests.js`. */
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: DI_TEMPLATE_FOLDER_REPOSITORY_ALIAS,
    name: "Dynamic Images Template Folder Repository",
    api: () => import("./template-folder.repository.js"),
  },
  {
    type: "store",
    alias: DI_TEMPLATE_FOLDER_STORE_ALIAS,
    name: "Dynamic Images Template Folder Store",
    api: DiTemplateFolderStore,
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [DI_TEMPLATE_FOLDER_ENTITY_TYPE],
    meta: { folderRepositoryAlias: DI_TEMPLATE_FOLDER_REPOSITORY_ALIAS },
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [DI_TEMPLATE_FOLDER_ENTITY_TYPE],
    meta: { folderRepositoryAlias: DI_TEMPLATE_FOLDER_REPOSITORY_ALIAS },
  },
  {
    type: "workspace",
    kind: "routable",
    alias: DI_TEMPLATE_FOLDER_WORKSPACE_ALIAS,
    name: "Dynamic Images Template Folder Workspace",
    api: () => import("./template-folder-workspace.context.js"),
    meta: { entityType: DI_TEMPLATE_FOLDER_ENTITY_TYPE },
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: UmbSubmitWorkspaceAction,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: DI_TEMPLATE_FOLDER_WORKSPACE_ALIAS }],
  },
];
