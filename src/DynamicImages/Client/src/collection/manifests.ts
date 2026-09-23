import { UMB_BOOLEAN_VALUE_TYPE, UMB_DATE_TIME_VALUE_TYPE } from "@umbraco-cms/backoffice/value-type";
import {
  DI_TEMPLATE_COLLECTION_ALIAS, DI_TEMPLATE_COLLECTION_REPOSITORY_ALIAS, DI_TEMPLATE_ENTITY_TYPE,
  DI_TEMPLATE_FOLDER_WORKSPACE_ALIAS, DI_TEMPLATE_ROOT_WORKSPACE_ALIAS,
} from "../tree/constants.js";

const IN_COLLECTION = [{ alias: "Umb.Condition.CollectionAlias", match: DI_TEMPLATE_COLLECTION_ALIAS }];

/**
 * The Templates collection, shown by the root and every folder: a table and a grid, a text
 * filter, and Create… - modelled on core's user collection (table + card) and on the document
 * type tree's tree-item-children collection (the workspace view on root and folder).
 */
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: DI_TEMPLATE_COLLECTION_REPOSITORY_ALIAS,
    name: "Dynamic Images Template Collection Repository",
    api: () => import("./template-collection.repository.js"),
  },
  {
    type: "collection",
    kind: "default",
    alias: DI_TEMPLATE_COLLECTION_ALIAS,
    name: "Dynamic Images Template Collection",
    api: () => import("./template-collection.context.js"),
    meta: { repositoryAlias: DI_TEMPLATE_COLLECTION_REPOSITORY_ALIAS },
  },
  {
    type: "collectionView",
    kind: "table",
    alias: "DynamicImages.CollectionView.Templates.Table",
    name: "Dynamic Images Template Table View",
    weight: 300,
    meta: {
      label: "List",
      icon: "icon-list",
      pathName: "list",
      columns: [
        { field: "docTypes", label: "Document types" },
        { field: "targetProperty", label: "Target property" },
        { field: "canvas", label: "Canvas" },
        { field: "layers", label: "Layers" },
        { field: "isEnabled", label: "Enabled", valueType: UMB_BOOLEAN_VALUE_TYPE },
        { field: "updated", label: "Last updated", valueType: UMB_DATE_TIME_VALUE_TYPE },
      ],
    },
    conditions: IN_COLLECTION,
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: IN_COLLECTION,
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => import("./di-template-collection-card.element.js"),
    forEntityTypes: [DI_TEMPLATE_ENTITY_TYPE],
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: IN_COLLECTION,
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: IN_COLLECTION,
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Templates.Collection",
    name: "Dynamic Images Templates Collection Workspace View",
    meta: {
      label: "Templates",
      pathname: "templates",
      icon: "icon-grid",
      collectionAlias: DI_TEMPLATE_COLLECTION_ALIAS,
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [DI_TEMPLATE_ROOT_WORKSPACE_ALIAS, DI_TEMPLATE_FOLDER_WORKSPACE_ALIAS],
      },
    ],
  },
];
