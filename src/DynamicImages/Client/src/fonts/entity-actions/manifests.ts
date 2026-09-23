import {
  DI_BULK_MOVE_FONTS_REPOSITORY_ALIAS, DI_FONT_BULK_DELETE_REPOSITORY_ALIAS, DI_FONT_COLLECTION_ALIAS,
  DI_FONT_DETAIL_REPOSITORY_ALIAS, DI_FONT_ENTITY_TYPE, DI_FONT_FAMILY_DETAIL_REPOSITORY_ALIAS, DI_FONT_FAMILY_ENTITY_TYPE,
  DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_FOLDER_REPOSITORY_ALIAS, DI_FONT_ITEM_REPOSITORY_ALIAS, DI_FONT_ITEM_STORE_ALIAS,
  DI_FONT_REFERENCE_REPOSITORY_ALIAS, DI_FONT_ROOT_ENTITY_TYPE, DI_FONT_TREE_ALIAS, DI_FONT_TREE_REPOSITORY_ALIAS,
  DI_IS_WEB_FONT_CONDITION_ALIAS, DI_MOVE_FONT_FAMILY_REPOSITORY_ALIAS, DI_MOVE_FONT_FOLDER_REPOSITORY_ALIAS,
  DI_SORT_FONT_CHILDREN_REPOSITORY_ALIAS,
} from "../constants.js";
import { DI_TEMPLATE_ENTITY_TYPE } from "../../tree/constants.js";
import { DiFontItemStore } from "./item/font-item.repository.js";

/** The root and folders: what holds folders and families. */
const CONTAINERS = [DI_FONT_ROOT_ENTITY_TYPE, DI_FONT_FOLDER_ENTITY_TYPE];

const IN_FONTS_COLLECTION = [{ alias: "Umb.Condition.CollectionAlias", match: DI_FONT_COLLECTION_ALIAS }];

const repository = (alias: string, name: string, api: () => Promise<object>): UmbExtensionManifest =>
  ({ type: "repository", alias, name, api }) as UmbExtensionManifest;

/**
 * Every ⋯ action in the Fonts tree and its collections. Core kinds wherever one exists, as in
 * the Templates tree; the Create… options are this package's own because adding a font is.
 */
export const manifests: Array<UmbExtensionManifest> = [
  // ---------------------------------------------------------------- repositories
  repository(DI_FONT_ITEM_REPOSITORY_ALIAS, "Dynamic Images Font Item Repository", () => import("./item/font-item.repository.js")),
  { type: "itemStore", alias: DI_FONT_ITEM_STORE_ALIAS, name: "Dynamic Images Font Item Store", api: DiFontItemStore },
  repository(DI_FONT_REFERENCE_REPOSITORY_ALIAS, "Dynamic Images Font Reference Repository",
    () => import("./reference/font-reference.repository.js")),
  repository(DI_FONT_BULK_DELETE_REPOSITORY_ALIAS, "Dynamic Images Font Bulk Delete Repository",
    () => import("./delete/font-bulk-delete.repository.js")),
  repository(DI_MOVE_FONT_FAMILY_REPOSITORY_ALIAS, "Dynamic Images Move Font Family Repository",
    () => import("./move/move-font-family.repository.js")),
  repository(DI_MOVE_FONT_FOLDER_REPOSITORY_ALIAS, "Dynamic Images Move Font Folder Repository",
    () => import("./move/move-font-folder.repository.js")),
  repository(DI_BULK_MOVE_FONTS_REPOSITORY_ALIAS, "Dynamic Images Bulk Move Fonts Repository",
    () => import("./move/bulk-move-fonts.repository.js")),
  repository(DI_SORT_FONT_CHILDREN_REPOSITORY_ALIAS, "Dynamic Images Sort Font Children Repository",
    () => import("./sort/sort-font-children.repository.js")),
  {
    type: "condition",
    alias: DI_IS_WEB_FONT_CONDITION_ALIAS,
    name: "Dynamic Images Is Web Font Condition",
    api: () => import("./is-web-font.condition.js"),
  },
  // How the delete modal draws each template still using a font. Cast because 17.5 declares the
  // entityItemRef manifest type in a file no public entry point imports - the folder create
  // option's problem again. The extension type itself is registered and resolved by entity type.
  {
    type: "entityItemRef",
    alias: "DynamicImages.EntityItemRef.Template",
    name: "Dynamic Images Template Item Ref",
    element: () => import("../../item-ref/di-template-item-ref.element.js"),
    forEntityTypes: [DI_TEMPLATE_ENTITY_TYPE],
  } as unknown as UmbExtensionManifest,

  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Font.Create",
    name: "Create Dynamic Images Font",
    weight: 1200,
    forEntityTypes: [...CONTAINERS, DI_FONT_FAMILY_ENTITY_TYPE],
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: true, headline: "Add to Fonts" },
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Upload",
    name: "Upload a Dynamic Images Font File",
    weight: 100,
    api: () => import("./upload-font.option-action.js"),
    forEntityTypes: CONTAINERS,
    meta: {
      icon: "icon-cloud-upload",
      label: "Upload font file",
      description: "A .ttf, .otf, .woff2 or .woff, stored in the media library",
    },
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Web",
    name: "Add a Dynamic Images Web Font",
    weight: 90,
    api: () => import("./web-font.option-action.js"),
    forEntityTypes: CONTAINERS,
    meta: { icon: "icon-cloud", label: "Web font", description: "From Google Fonts, Bunny Fonts or a file URL" },
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Path",
    name: "Register a Dynamic Images Font Path",
    weight: 80,
    api: () => import("./path-font.option-action.js"),
    forEntityTypes: CONTAINERS,
    meta: { icon: "icon-font", label: "Font from path", description: "A font file already in the site's wwwroot" },
  },
  // Cast for the same reason as the template folder option in entity-actions/manifests.ts.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.FontFolder",
    name: "Dynamic Images Font Folder Create Option",
    weight: 70,
    forEntityTypes: CONTAINERS,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: true,
      folderRepositoryAlias: DI_FONT_FOLDER_REPOSITORY_ALIAS,
    },
  } as unknown as UmbExtensionManifest,
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.AddVariant",
    name: "Add a Variant to a Dynamic Images Font Family",
    weight: 100,
    api: () => import("./add-variant.option-action.js"),
    forEntityTypes: [DI_FONT_FAMILY_ENTITY_TYPE],
    meta: { icon: "icon-add", label: "Add variant", description: "Another weight or slant of this family" },
  },

  // ---------------------------------------------------------------- family
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.FontFamily.MoveTo",
    name: "Move Dynamic Images Font Family",
    forEntityTypes: [DI_FONT_FAMILY_ENTITY_TYPE],
    meta: {
      treeRepositoryAlias: DI_FONT_TREE_REPOSITORY_ALIAS,
      moveRepositoryAlias: DI_MOVE_FONT_FAMILY_REPOSITORY_ALIAS,
      treeAlias: DI_FONT_TREE_ALIAS,
      foldersOnly: true,
      additionalOptions: true,
    },
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.FontFamily.Rename",
    name: "Rename Dynamic Images Font Family",
    api: () => import("./rename-family.action.js"),
    forEntityTypes: [DI_FONT_FAMILY_ENTITY_TYPE],
    weight: 650,
    meta: { icon: "icon-edit", label: "#actions_rename", additionalOptions: true },
  },
  {
    type: "entityAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityAction.FontFamily.Delete",
    name: "Delete Dynamic Images Font Family",
    forEntityTypes: [DI_FONT_FAMILY_ENTITY_TYPE],
    meta: {
      itemRepositoryAlias: DI_FONT_ITEM_REPOSITORY_ALIAS,
      detailRepositoryAlias: DI_FONT_FAMILY_DETAIL_REPOSITORY_ALIAS,
      referenceRepositoryAlias: DI_FONT_REFERENCE_REPOSITORY_ALIAS,
    },
  },

  // ---------------------------------------------------------------- variant
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Font.Refresh",
    name: "Refresh a Dynamic Images Web Font",
    api: () => import("./refresh-font.action.js"),
    forEntityTypes: [DI_FONT_ENTITY_TYPE],
    weight: 500,
    meta: { icon: "icon-sync", label: "Refresh", additionalOptions: true },
    conditions: [{ alias: DI_IS_WEB_FONT_CONDITION_ALIAS }],
  },
  {
    type: "entityAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityAction.Font.Delete",
    name: "Delete a Dynamic Images Font",
    forEntityTypes: [DI_FONT_ENTITY_TYPE],
    meta: {
      itemRepositoryAlias: DI_FONT_ITEM_REPOSITORY_ALIAS,
      detailRepositoryAlias: DI_FONT_DETAIL_REPOSITORY_ALIAS,
      referenceRepositoryAlias: DI_FONT_REFERENCE_REPOSITORY_ALIAS,
    },
  },

  // ---------------------------------------------------------------- folder
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.FontFolder.MoveTo",
    name: "Move Dynamic Images Font Folder",
    forEntityTypes: [DI_FONT_FOLDER_ENTITY_TYPE],
    meta: {
      treeRepositoryAlias: DI_FONT_TREE_REPOSITORY_ALIAS,
      moveRepositoryAlias: DI_MOVE_FONT_FOLDER_REPOSITORY_ALIAS,
      treeAlias: DI_FONT_TREE_ALIAS,
      foldersOnly: true,
      additionalOptions: true,
    },
  },

  // ---------------------------------------------------------------- root and folder
  {
    type: "entityAction",
    kind: "sortChildrenOf",
    alias: "DynamicImages.EntityAction.Font.SortChildren",
    name: "Sort Dynamic Images Fonts",
    forEntityTypes: CONTAINERS,
    meta: {
      sortChildrenOfRepositoryAlias: DI_SORT_FONT_CHILDREN_REPOSITORY_ALIAS,
      treeRepositoryAlias: DI_FONT_TREE_REPOSITORY_ALIAS,
    },
  },

  // ---------------------------------------------------------------- collection selection
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Font.MoveTo",
    name: "Move Dynamic Images Fonts",
    forEntityTypes: [DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_FAMILY_ENTITY_TYPE],
    meta: { bulkMoveRepositoryAlias: DI_BULK_MOVE_FONTS_REPOSITORY_ALIAS, treeAlias: DI_FONT_TREE_ALIAS, foldersOnly: true },
    conditions: IN_FONTS_COLLECTION,
  },
  {
    type: "entityBulkAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityBulkAction.Font.Delete",
    name: "Delete Dynamic Images Fonts",
    forEntityTypes: [DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_FAMILY_ENTITY_TYPE],
    meta: {
      itemRepositoryAlias: DI_FONT_ITEM_REPOSITORY_ALIAS,
      detailRepositoryAlias: DI_FONT_BULK_DELETE_REPOSITORY_ALIAS,
      referenceRepositoryAlias: DI_FONT_REFERENCE_REPOSITORY_ALIAS,
    },
    conditions: IN_FONTS_COLLECTION,
  },

  // ---------------------------------------------------------------- reload
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Font.ReloadChildren",
    name: "Reload Dynamic Images Fonts",
    forEntityTypes: [...CONTAINERS, DI_FONT_FAMILY_ENTITY_TYPE],
  },
];
