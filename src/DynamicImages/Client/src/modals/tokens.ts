import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface FontUploadValue {
  uploaded: boolean;
  /** Variants of a web font that were not added, when at least one was. */
  warnings?: string[];
}

/** Which of the three ways in the modal opens on; omitted shows all three. */
export type FontUploadMode = "upload" | "web" | "path";

/**
 * Where the new variants go and which way in to show. `familyKey` locks them to a family (the
 * family's "Add variant"); otherwise `parentKey` is the folder the create was started from.
 */
export interface FontUploadData {
  mode?: FontUploadMode;
  familyKey?: string | null;
  /** The locked family's name, for the headline and to prefill the web font family. */
  familyName?: string;
  parentKey?: string | null;
}

export const DI_FONT_UPLOAD_MODAL = new UmbModalToken<FontUploadData, FontUploadValue>(
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
