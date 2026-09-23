import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface FontUploadValue {
  uploaded: boolean;
  /** Variants of a web font that were not added, when at least one was. */
  warnings?: string[];
}

export const DI_FONT_UPLOAD_MODAL = new UmbModalToken<object, FontUploadValue>(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } },
);

export interface ImportTemplateValue {
  /** The template document, pasted or read from a file. */
  json: string;
}

/** Paste or choose a template JSON file - the Import JSON entity action on the root and on folders. */
export const DI_IMPORT_TEMPLATE_MODAL = new UmbModalToken<object, ImportTemplateValue>(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } },
);
