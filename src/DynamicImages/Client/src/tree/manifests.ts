import {
  DI_TEMPLATE_ENTITY_TYPE, DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_ROOT_ENTITY_TYPE,
  DI_TEMPLATE_ROOT_WORKSPACE_ALIAS, DI_TEMPLATE_TREE_ALIAS, DI_TEMPLATE_TREE_REPOSITORY_ALIAS,
} from "./constants.js";
import { manifests as folderManifests } from "./folder/manifests.js";

/**
 * The Templates tree: repository → tree → treeItem → a `tree` kind menu item in the section's
 * menu. Modelled on core's `documents/document-types/tree/manifests.js`. The ⋯ and + on each
 * node are `umb-tree-item`'s own, filled from the entity actions in `entity-actions/manifests.ts`.
 */
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: DI_TEMPLATE_TREE_REPOSITORY_ALIAS,
    name: "Dynamic Images Template Tree Repository",
    api: () => import("./template-tree.repository.js"),
  },
  {
    type: "tree",
    kind: "default",
    alias: DI_TEMPLATE_TREE_ALIAS,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: DI_TEMPLATE_TREE_REPOSITORY_ALIAS },
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [DI_TEMPLATE_ROOT_ENTITY_TYPE, DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_ENTITY_TYPE],
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: DI_TEMPLATE_TREE_ALIAS, menus: ["DynamicImages.Menu"] },
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: DI_TEMPLATE_ROOT_WORKSPACE_ALIAS,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: DI_TEMPLATE_ROOT_ENTITY_TYPE, headline: "Templates" },
  },
  ...folderManifests,
];
