import type { UmbEntityModel } from "@umbraco-cms/backoffice/entity";

/**
 * A row of the Templates collection. The display fields are pre-formatted strings, because the
 * `table` collection view kind renders a manifest column as the raw field value.
 */
export interface DiTemplateCollectionItemModel extends UmbEntityModel {
  unique: string;
  name: string;
  icon: string;
  isFolder: boolean;
  docTypes: string;
  targetProperty: string;
  canvas: string;
  layers: string;
  isEnabled: boolean | undefined;
  updated: string | undefined;
}
