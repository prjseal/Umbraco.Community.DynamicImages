import {
  DI_FONT_COLLECTION_ALIAS, DI_FONT_COLLECTION_REPOSITORY_ALIAS, DI_FONT_ENTITY_TYPE, DI_FONT_FAMILY_ENTITY_TYPE,
  DI_FONT_FAMILY_WORKSPACE_ALIAS, DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_FOLDER_WORKSPACE_ALIAS, DI_FONT_ROOT_WORKSPACE_ALIAS,
  DI_FONT_VARIANT_COLLECTION_ALIAS,
} from "../constants.js";

type Conditions = Array<{ alias: string; match: string }>;

const IN_FONTS: Conditions = [{ alias: "Umb.Condition.CollectionAlias", match: DI_FONT_COLLECTION_ALIAS }];
const IN_VARIANTS: Conditions = [{ alias: "Umb.Condition.CollectionAlias", match: DI_FONT_VARIANT_COLLECTION_ALIAS }];

/**
 * The grid, the filter and Create… for one of the two collections. One set per collection rather
 * than a `oneOf`: in 17.5 Umb.Condition.CollectionAlias reads `match` only.
 */
const shared = (collection: "Fonts" | "FontVariants", conditions: Conditions): Array<UmbExtensionManifest> => [
  {
    type: "collectionView",
    kind: "card",
    alias: `DynamicImages.CollectionView.${collection}.Grid`,
    name: `Dynamic Images ${collection} Grid View`,
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions,
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: `DynamicImages.CollectionTextFilter.${collection}`,
    name: `Dynamic Images ${collection} Collection Filter`,
    conditions,
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: `DynamicImages.CollectionAction.${collection}.Create`,
    name: `Create in the Dynamic Images ${collection} Collection`,
    conditions,
  },
];

/**
 * Two collections over one repository, as the Templates collection is built: the root's and each
 * folder's folders and families, and a family's variants. Each has a table and a grid of
 * specimens, a text filter and Create…
 */
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: DI_FONT_COLLECTION_REPOSITORY_ALIAS,
    name: "Dynamic Images Font Collection Repository",
    api: () => import("./font-collection.repository.js"),
  },
  {
    type: "collection",
    kind: "default",
    alias: DI_FONT_COLLECTION_ALIAS,
    name: "Dynamic Images Font Collection",
    api: () => import("./font-collection.context.js"),
    meta: { repositoryAlias: DI_FONT_COLLECTION_REPOSITORY_ALIAS },
  },
  {
    type: "collection",
    kind: "default",
    alias: DI_FONT_VARIANT_COLLECTION_ALIAS,
    name: "Dynamic Images Font Variant Collection",
    api: () => import("./font-collection.context.js"),
    meta: { repositoryAlias: DI_FONT_COLLECTION_REPOSITORY_ALIAS },
  },

  // ---------------------------------------------------------------- views
  {
    type: "collectionView",
    kind: "table",
    alias: "DynamicImages.CollectionView.Fonts.Table",
    name: "Dynamic Images Font Table View",
    weight: 300,
    meta: {
      label: "List",
      icon: "icon-list",
      pathName: "list",
      columns: [
        { field: "variants", label: "Variants" },
        { field: "usedBy", label: "Used by templates" },
      ],
    },
    conditions: IN_FONTS,
  },
  {
    type: "collectionView",
    kind: "table",
    alias: "DynamicImages.CollectionView.FontVariants.Table",
    name: "Dynamic Images Font Variant Table View",
    weight: 300,
    meta: {
      label: "List",
      icon: "icon-list",
      pathName: "list",
      columns: [
        { field: "weight", label: "Weight" },
        { field: "style", label: "Style" },
        { field: "source", label: "Source" },
        { field: "usedBy", label: "Used by templates" },
      ],
    },
    conditions: IN_VARIANTS,
  },
  ...shared("Fonts", IN_FONTS),
  ...shared("FontVariants", IN_VARIANTS),
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Font",
    name: "Dynamic Images Font Card",
    element: () => import("./di-font-collection-card.element.js"),
    forEntityTypes: [DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_FAMILY_ENTITY_TYPE, DI_FONT_ENTITY_TYPE],
  },

  // ---------------------------------------------------------------- where they show
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Fonts.Collection",
    name: "Dynamic Images Fonts Collection Workspace View",
    meta: { label: "Fonts", pathname: "fonts", icon: "icon-grid", collectionAlias: DI_FONT_COLLECTION_ALIAS },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", oneOf: [DI_FONT_ROOT_WORKSPACE_ALIAS, DI_FONT_FOLDER_WORKSPACE_ALIAS] }],
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.FontVariants.Collection",
    name: "Dynamic Images Font Variants Collection Workspace View",
    meta: { label: "Variants", pathname: "variants", icon: "icon-font", collectionAlias: DI_FONT_VARIANT_COLLECTION_ALIAS },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: DI_FONT_FAMILY_WORKSPACE_ALIAS }],
  },
];
