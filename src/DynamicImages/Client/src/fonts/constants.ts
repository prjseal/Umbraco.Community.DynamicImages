/** The Fonts root. Selecting it opens the collection of the folders and families directly under it. */
export const DI_FONT_ROOT_ENTITY_TYPE = "di-font-root";

/** A folder in the Fonts tree. */
export const DI_FONT_FOLDER_ENTITY_TYPE = "di-font-folder";

/** A family - "Inter" - whose children are its variants. */
export const DI_FONT_FAMILY_ENTITY_TYPE = "di-font-family";

/** One weight and slant of a family: a font row, which is what templates reference. */
export const DI_FONT_ENTITY_TYPE = "di-font";

export const DI_FONT_TREE_ALIAS = "DynamicImages.Tree.Fonts";
export const DI_FONT_TREE_REPOSITORY_ALIAS = "DynamicImages.Repository.FontTree";

export const DI_FONT_FOLDER_REPOSITORY_ALIAS = "DynamicImages.Repository.FontFolder";
export const DI_FONT_FOLDER_STORE_ALIAS = "DynamicImages.Store.FontFolder";
export const DI_FONT_FOLDER_WORKSPACE_ALIAS = "DynamicImages.Workspace.FontFolder";
export const DI_FONT_ROOT_WORKSPACE_ALIAS = "DynamicImages.Workspace.FontRoot";
export const DI_FONT_FAMILY_WORKSPACE_ALIAS = "DynamicImages.Workspace.FontFamily";
export const DI_FONT_WORKSPACE_ALIAS = "DynamicImages.Workspace.Font";

export const DI_FONT_ITEM_REPOSITORY_ALIAS = "DynamicImages.Repository.FontItem";
export const DI_FONT_ITEM_STORE_ALIAS = "DynamicImages.Store.FontItem";
export const DI_FONT_DETAIL_REPOSITORY_ALIAS = "DynamicImages.Repository.FontDetail";
export const DI_FONT_DETAIL_STORE_ALIAS = "DynamicImages.Store.FontDetail";
export const DI_FONT_FAMILY_DETAIL_REPOSITORY_ALIAS = "DynamicImages.Repository.FontFamilyDetail";
export const DI_FONT_FAMILY_DETAIL_STORE_ALIAS = "DynamicImages.Store.FontFamilyDetail";
export const DI_FONT_REFERENCE_REPOSITORY_ALIAS = "DynamicImages.Repository.FontReference";
export const DI_MOVE_FONT_FAMILY_REPOSITORY_ALIAS = "DynamicImages.Repository.MoveFontFamily";
export const DI_MOVE_FONT_FOLDER_REPOSITORY_ALIAS = "DynamicImages.Repository.MoveFontFolder";
export const DI_BULK_MOVE_FONTS_REPOSITORY_ALIAS = "DynamicImages.Repository.BulkMoveFonts";
export const DI_SORT_FONT_CHILDREN_REPOSITORY_ALIAS = "DynamicImages.Repository.SortFontChildren";
/** Deletes whatever a Fonts collection selection holds: folders, families or variants. */
export const DI_FONT_BULK_DELETE_REPOSITORY_ALIAS = "DynamicImages.Repository.FontBulkDelete";

/** Permits an action only on a variant fetched from the web, the only kind Refresh applies to. */
export const DI_IS_WEB_FONT_CONDITION_ALIAS = "DynamicImages.Condition.IsWebFont";

export const DI_FONT_COLLECTION_ALIAS = "DynamicImages.Collection.Fonts";
export const DI_FONT_COLLECTION_REPOSITORY_ALIAS = "DynamicImages.Repository.FontCollection";
export const DI_FONT_VARIANT_COLLECTION_ALIAS = "DynamicImages.Collection.FontVariants";

export const DI_FONT_FOLDER_ICON = "icon-folder";
export const DI_FONT_FAMILY_ICON = "icon-font";
/** A variant from a file (media or wwwroot); greyed so it reads as a child of its family. */
export const DI_FONT_ICON = "icon-font color-grey";
/** A variant fetched from Google, Bunny or a URL. */
export const DI_WEB_FONT_ICON = "icon-cloud";

/** Tree node label and entity type by server entity type. */
export function fontEntityType(serverType: "folder" | "family" | "font"): string {
  switch (serverType) {
    case "folder":
      return DI_FONT_FOLDER_ENTITY_TYPE;
    case "family":
      return DI_FONT_FAMILY_ENTITY_TYPE;
    default:
      return DI_FONT_ENTITY_TYPE;
  }
}

export function fontIcon(serverType: "folder" | "family" | "font", isUrlFont: boolean): string {
  switch (serverType) {
    case "folder":
      return DI_FONT_FOLDER_ICON;
    case "family":
      return DI_FONT_FAMILY_ICON;
    default:
      return isUrlFont ? DI_WEB_FONT_ICON : DI_FONT_ICON;
  }
}
