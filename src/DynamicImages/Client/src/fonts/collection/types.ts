import type { UmbEntityModel } from "@umbraco-cms/backoffice/entity";

/**
 * A row of a Fonts collection - a folder or family, or a family's variant. The display fields are
 * pre-formatted strings, because the `table` collection view kind renders a column as the raw value.
 */
export interface DiFontCollectionItemModel extends UmbEntityModel {
  unique: string;
  name: string;
  icon: string;
  isFolder: boolean;
  variants: string;
  usedBy: string;
  weight: string;
  style: string;
  source: string;
  /** The variant a card draws its specimen in, or null for a folder. */
  sampleFontKey: string | null;
}
