import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { DiSampleContentItem } from "../api/types.js";

export interface SampleNodePickerData {
  /** The document types to offer nodes from - the template's own, normally. */
  docTypeAliases: string[];
  selectedKey?: string;
}

export interface SampleNodePickerValue {
  /** Undefined means "use sample data", which is a real choice, not a cancel. */
  item?: DiSampleContentItem;
}

export const DI_SAMPLE_NODE_PICKER_MODAL = new UmbModalToken<SampleNodePickerData, SampleNodePickerValue>(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } },
);

export interface FontUploadValue {
  uploaded: boolean;
  /** Variants of a web font that were not added, when at least one was. */
  warnings?: string[];
}

export const DI_FONT_UPLOAD_MODAL = new UmbModalToken<object, FontUploadValue>(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } },
);
