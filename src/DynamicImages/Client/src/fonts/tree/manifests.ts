import {
  DI_FONT_ENTITY_TYPE, DI_FONT_FAMILY_ENTITY_TYPE, DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_ROOT_ENTITY_TYPE,
  DI_FONT_ROOT_WORKSPACE_ALIAS, DI_FONT_TREE_ALIAS, DI_FONT_TREE_REPOSITORY_ALIAS,
} from "../constants.js";

/**
 * The Fonts tree: folders, families and each family's variants. The same stack as the Templates
 * tree (`tree/manifests.ts`), and a `tree` menu item where the Fonts link used to be - weight 100,
 * so it keeps its place between Templates (200) and Health (90).
 */
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: DI_FONT_TREE_REPOSITORY_ALIAS,
    name: "Dynamic Images Font Tree Repository",
    api: () => import("./font-tree.repository.js"),
  },
  {
    type: "tree",
    kind: "default",
    alias: DI_FONT_TREE_ALIAS,
    name: "Dynamic Images Font Tree",
    meta: { repositoryAlias: DI_FONT_TREE_REPOSITORY_ALIAS },
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Fonts",
    name: "Dynamic Images Font Tree Item",
    forEntityTypes: [DI_FONT_ROOT_ENTITY_TYPE, DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_FAMILY_ENTITY_TYPE, DI_FONT_ENTITY_TYPE],
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Fonts",
    name: "Dynamic Images Fonts Menu Item",
    weight: 100,
    meta: { label: "Fonts", treeAlias: DI_FONT_TREE_ALIAS, menus: ["DynamicImages.Menu"] },
  },
  {
    type: "workspace",
    kind: "default",
    alias: DI_FONT_ROOT_WORKSPACE_ALIAS,
    name: "Dynamic Images Fonts Root Workspace",
    meta: { entityType: DI_FONT_ROOT_ENTITY_TYPE, headline: "Fonts" },
  },
];
