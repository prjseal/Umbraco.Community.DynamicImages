import {
  DI_DUPLICATE_TEMPLATE_REPOSITORY_ALIAS, DI_MOVE_FOLDER_REPOSITORY_ALIAS, DI_MOVE_TEMPLATE_REPOSITORY_ALIAS,
  DI_TEMPLATE_DETAIL_REPOSITORY_ALIAS, DI_TEMPLATE_DETAIL_STORE_ALIAS, DI_TEMPLATE_ENTITY_TYPE,
  DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_FOLDER_REPOSITORY_ALIAS, DI_TEMPLATE_ITEM_REPOSITORY_ALIAS,
  DI_TEMPLATE_ITEM_STORE_ALIAS, DI_TEMPLATE_ROOT_ENTITY_TYPE, DI_TEMPLATE_TREE_ALIAS, DI_TEMPLATE_TREE_REPOSITORY_ALIAS,
} from "../tree/constants.js";
import { DiTemplateItemStore } from "./delete/template-item.repository.js";
import { DiTemplateDetailStore } from "./delete/template-detail.repository.js";

const CONTAINERS = [DI_TEMPLATE_ROOT_ENTITY_TYPE, DI_TEMPLATE_FOLDER_ENTITY_TYPE];

/**
 * Every ⋯ action in the Templates tree and collection. Core kinds wherever one exists; `default`
 * only for the three that are this package's own (import, export, regenerate).
 */
export const manifests: Array<UmbExtensionManifest> = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: DI_TEMPLATE_ITEM_REPOSITORY_ALIAS,
    name: "Dynamic Images Template Item Repository",
    api: () => import("./delete/template-item.repository.js"),
  },
  {
    type: "itemStore",
    alias: DI_TEMPLATE_ITEM_STORE_ALIAS,
    name: "Dynamic Images Template Item Store",
    api: DiTemplateItemStore,
  },
  {
    type: "repository",
    alias: DI_TEMPLATE_DETAIL_REPOSITORY_ALIAS,
    name: "Dynamic Images Template Detail Repository",
    api: () => import("./delete/template-detail.repository.js"),
  },
  {
    type: "store",
    alias: DI_TEMPLATE_DETAIL_STORE_ALIAS,
    name: "Dynamic Images Template Detail Store",
    api: DiTemplateDetailStore,
  },
  {
    type: "repository",
    alias: DI_MOVE_TEMPLATE_REPOSITORY_ALIAS,
    name: "Dynamic Images Move Template Repository",
    api: () => import("./move/move-template.repository.js"),
  },
  {
    type: "repository",
    alias: DI_MOVE_FOLDER_REPOSITORY_ALIAS,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => import("./move/move-folder.repository.js"),
  },
  {
    type: "repository",
    alias: DI_DUPLICATE_TEMPLATE_REPOSITORY_ALIAS,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => import("./duplicate-template.repository.js"),
  },

  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: CONTAINERS,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: true, headline: "Create under Templates" },
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => import("./create-template.option-action.js"),
    forEntityTypes: CONTAINERS,
    meta: {
      icon: "icon-picture",
      label: "Template",
      description: "A generated image design for one or more document types",
    },
  },
  // Cast because 17.5's folder create option kind declares its manifest type in a file that no
  // public entry point imports, so the global manifest map never learns about `kind: "folder"`.
  // The kind itself is registered and works exactly as core's document type folder option.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.TemplateFolder",
    name: "Dynamic Images Template Folder Create Option",
    weight: 90,
    forEntityTypes: CONTAINERS,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: true,
      folderRepositoryAlias: DI_TEMPLATE_FOLDER_REPOSITORY_ALIAS,
    },
  } as unknown as UmbExtensionManifest,

  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [DI_TEMPLATE_ENTITY_TYPE],
    meta: {
      treeRepositoryAlias: DI_TEMPLATE_TREE_REPOSITORY_ALIAS,
      moveRepositoryAlias: DI_MOVE_TEMPLATE_REPOSITORY_ALIAS,
      treeAlias: DI_TEMPLATE_TREE_ALIAS,
      foldersOnly: true,
      additionalOptions: true,
    },
  },
  {
    type: "entityAction",
    kind: "duplicate",
    alias: "DynamicImages.EntityAction.Template.Duplicate",
    name: "Duplicate Dynamic Images Template",
    forEntityTypes: [DI_TEMPLATE_ENTITY_TYPE],
    meta: {
      icon: "icon-documents",
      label: "Duplicate",
      duplicateRepositoryAlias: DI_DUPLICATE_TEMPLATE_REPOSITORY_ALIAS,
      treeRepositoryAlias: DI_TEMPLATE_TREE_REPOSITORY_ALIAS,
    },
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => import("./export-template.action.js"),
    forEntityTypes: [DI_TEMPLATE_ENTITY_TYPE],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: true },
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => import("./regenerate-template.action.js"),
    forEntityTypes: [DI_TEMPLATE_ENTITY_TYPE],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: true },
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [DI_TEMPLATE_ENTITY_TYPE],
    meta: {
      itemRepositoryAlias: DI_TEMPLATE_ITEM_REPOSITORY_ALIAS,
      detailRepositoryAlias: DI_TEMPLATE_DETAIL_REPOSITORY_ALIAS,
      additionalOptions: true,
      confirm: {
        headline: "Delete template",
        message: "Delete <strong>{0}</strong>? Images it already generated stay in the media library.",
      },
    },
  },

  // ---------------------------------------------------------------- folder
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.TemplateFolder.MoveTo",
    name: "Move Dynamic Images Template Folder",
    forEntityTypes: [DI_TEMPLATE_FOLDER_ENTITY_TYPE],
    meta: {
      treeRepositoryAlias: DI_TEMPLATE_TREE_REPOSITORY_ALIAS,
      moveRepositoryAlias: DI_MOVE_FOLDER_REPOSITORY_ALIAS,
      treeAlias: DI_TEMPLATE_TREE_ALIAS,
      foldersOnly: true,
      additionalOptions: true,
    },
  },

  // ---------------------------------------------------------------- root and folder
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Import",
    name: "Import a Dynamic Images Template",
    api: () => import("./import-template.action.js"),
    forEntityTypes: CONTAINERS,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON…", additionalOptions: true },
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: CONTAINERS,
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => import("../modals/di-import-template-modal.element.js"),
  },
];
