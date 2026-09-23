import { TEMPLATE_ENTITY_TYPE } from "../api/dynamic-images-api.js";

/** The Templates root. Selecting it opens the collection of everything directly under it. */
export const DI_TEMPLATE_ROOT_ENTITY_TYPE = "di-template-root";

/** A folder in the Templates tree. */
export const DI_TEMPLATE_FOLDER_ENTITY_TYPE = "di-template-folder";

/** Unchanged from before the tree, so existing deep links to a template keep working. */
export const DI_TEMPLATE_ENTITY_TYPE = TEMPLATE_ENTITY_TYPE;

export const DI_TEMPLATE_TREE_ALIAS = "DynamicImages.Tree.Templates";
export const DI_TEMPLATE_TREE_REPOSITORY_ALIAS = "DynamicImages.Repository.TemplateTree";

export const DI_TEMPLATE_FOLDER_REPOSITORY_ALIAS = "DynamicImages.Repository.TemplateFolder";
export const DI_TEMPLATE_FOLDER_STORE_ALIAS = "DynamicImages.Store.TemplateFolder";
export const DI_TEMPLATE_FOLDER_WORKSPACE_ALIAS = "DynamicImages.Workspace.TemplateFolder";
export const DI_TEMPLATE_ROOT_WORKSPACE_ALIAS = "DynamicImages.Workspace.TemplateRoot";

export const DI_TEMPLATE_ITEM_REPOSITORY_ALIAS = "DynamicImages.Repository.TemplateItem";
export const DI_TEMPLATE_ITEM_STORE_ALIAS = "DynamicImages.Store.TemplateItem";
export const DI_TEMPLATE_DETAIL_REPOSITORY_ALIAS = "DynamicImages.Repository.TemplateDetail";
export const DI_TEMPLATE_DETAIL_STORE_ALIAS = "DynamicImages.Store.TemplateDetail";
export const DI_MOVE_TEMPLATE_REPOSITORY_ALIAS = "DynamicImages.Repository.MoveTemplate";
export const DI_MOVE_FOLDER_REPOSITORY_ALIAS = "DynamicImages.Repository.MoveTemplateFolder";
export const DI_DUPLICATE_TEMPLATE_REPOSITORY_ALIAS = "DynamicImages.Repository.DuplicateTemplate";
export const DI_BULK_MOVE_TEMPLATE_REPOSITORY_ALIAS = "DynamicImages.Repository.BulkMoveTemplates";
export const DI_BULK_DUPLICATE_TEMPLATE_REPOSITORY_ALIAS = "DynamicImages.Repository.BulkDuplicateTemplates";
export const DI_SORT_TEMPLATE_CHILDREN_REPOSITORY_ALIAS = "DynamicImages.Repository.SortTemplateChildren";

/** Icons for the three entity types. A disabled template is shown greyed via umb-icon's colour suffix. */
export const DI_TEMPLATE_ICON = "icon-picture";
export const DI_TEMPLATE_DISABLED_ICON = "icon-picture color-grey";
export const DI_TEMPLATE_FOLDER_ICON = "icon-folder";

export const DI_TEMPLATE_COLLECTION_ALIAS = "DynamicImages.Collection.Templates";
export const DI_TEMPLATE_COLLECTION_REPOSITORY_ALIAS = "DynamicImages.Repository.TemplateCollection";
