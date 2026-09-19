/**
 * The wire shapes of the Dynamic Images Management API, hand-written to mirror the C# DTOs
 * (System.Text.Json with a camelCase policy, so every name here matches its C# property).
 * There is no OpenAPI codegen in this repo; these are the contract.
 */

// ---------------------------------------------------------------- shared

export type Anchor =
  | "topLeft" | "topCentre" | "topRight"
  | "middleLeft" | "middleCentre" | "middleRight"
  | "bottomLeft" | "bottomCentre" | "bottomRight";

export type ImageSourceKind = "media" | "path" | "property" | "none";

export type RelativeEdgeX = "rightOf" | "leftOf";
export type RelativeEdgeY = "below" | "above";
export type RelativeEdge = RelativeEdgeX | RelativeEdgeY;

/** One axis of a position following another layer's edge, a gap away. */
export interface DiRelativeReference<TEdge extends RelativeEdge = RelativeEdge> {
  layerKey: string;
  edge: TEdge;
  gap: number;
}

export interface DiPosition {
  x: number;
  y: number;
  anchor: Anchor;
  /** When set, x is only the fallback used if nothing on the reference chain draws. */
  relativeX?: DiRelativeReference<RelativeEdgeX> | null;
  /** When set, y is only the fallback used if nothing on the reference chain draws. */
  relativeY?: DiRelativeReference<RelativeEdgeY> | null;
}

export interface DiSize {
  width?: number | null;
  height?: number | null;
}

export interface DiImageSource {
  kind: ImageSourceKind;
  mediaKey?: string | null;
  path?: string | null;
  propertyAlias?: string | null;
  fallback?: DiImageSource | null;
}

export type TextBindingKind = "property" | "nodeName" | "readingTime" | "date" | "static" | "expression";

export interface DiTextBinding {
  kind: TextBindingKind;
  propertyAlias?: string | null;
  format?: string | null;
  culture?: string | null;
  text?: string | null;
}

export type VisibilityRuleKind = "always" | "whenNotEmpty" | "whenPropertyTruthy";

export interface DiVisibility {
  rule: VisibilityRuleKind;
  propertyAlias?: string | null;
}

// ---------------------------------------------------------------- layers

export type LayerType = "text" | "image" | "badges" | "rect";

export interface DiLayerBase {
  type: LayerType;
  key: string;
  name: string;
  isVisible: boolean;
  isLocked: boolean;
  opacity: number;
  position: DiPosition;
  size: DiSize;
  visibility: DiVisibility;
}

export type TextAlign = "left" | "centre" | "right";
export type TextTransform = "none" | "uppercase" | "lowercase";
export type TextOverflow = "ellipsis" | "clip" | "shrink";
export type BadgeLabelPosition = "below" | "right" | "none";

export interface DiTextStyle {
  fontKey: string;
  styleName?: string | null;
  fontSize: number;
  fontStyle: string;
  colour: string;
  textAlign: TextAlign;
  lineSpacing: number;
  letterSpacing: number;
  textTransform: TextTransform;
  maxLines?: number | null;
  overflow: TextOverflow;
}

export interface DiTextLayer extends DiLayerBase {
  type: "text";
  binding: DiTextBinding;
  prefix?: string | null;
  suffix?: string | null;
  style: DiTextStyle;
}

export type ImageFit = "cover" | "contain" | "stretch";

export interface DiImageLayer extends DiLayerBase {
  type: "image";
  source: DiImageSource;
  fit: ImageFit;
  cornerRadius: number;
  border?: { width: number; colour: string } | null;
}

export interface DiBadgesLayer extends DiLayerBase {
  type: "badges";
  itemsPropertyAlias: string;
  labelPropertyAlias?: string | null;
  maxItems: number;
  gap: number;
  direction: "horizontal" | "vertical";
  /** Horizontal only: items that would pass the layer's width start a new row. */
  wrap: boolean;
  rowGap: number;
  icon: {
    kind: "none" | "pathPattern";
    basePath: string;
    propertyAlias?: string | null;
    extension: string;
  };
  badge: {
    size: number;
    innerSize: number;
    fillColour: string;
    borderColour: string;
    borderWidth: number;
  };
  label: {
    fontKey: string;
    styleName?: string | null;
    fontSize: number;
    colour: string;
    textTransform: TextTransform;
    letterSpacing: number;
    gap: number;
    position: BadgeLabelPosition;
  };
}

export interface DiRectLayer extends DiLayerBase {
  type: "rect";
  fill?: string | null;
  gradient?: { from: string; to: string; angle: number } | null;
  cornerRadius: number;
}

export type DiLayer = DiTextLayer | DiImageLayer | DiBadgesLayer | DiRectLayer;

// ---------------------------------------------------------------- template

export type OutputFormat = "png" | "jpeg" | "webp";
export type ImageFitMode = "cover" | "contain" | "stretch";

export interface DiTemplate {
  schemaVersion: number;
  key: string;
  alias: string;
  name: string;
  isEnabled: boolean;
  docTypeAliases: string[];
  targetPropertyAlias: string;
  trigger: { onPublish: boolean; onlyWhenEmpty: boolean };
  output: {
    mediaFolderKey?: string | null;
    fileNamePattern: string;
    format: OutputFormat;
    quality: number;
  };
  canvas: {
    width: number;
    height: number;
    background: string;
    baseImage: DiImageSource;
    baseImageFit: ImageFitMode;
  };
  layers: DiLayer[];
  updatedUtc: string;
}

export interface DiTemplateSummary {
  key: string;
  alias: string;
  name: string;
  isEnabled: boolean;
  docTypeAliases: string[];
  targetPropertyAlias: string;
  layerCount: number;
  canvasWidth: number;
  canvasHeight: number;
  updatedUtc: string;
}

export interface DiValidationIssue {
  severity: "warning" | "error";
  code: string;
  message: string;
  layerKey?: string | null;
}

export interface DiTemplateSaveResponse {
  template: DiTemplate;
  warnings: DiValidationIssue[];
}

// ---------------------------------------------------------------- fonts

export interface DiFontStyle {
  name: string;
  size: number;
  fontStyle: string;
}

/** Where a "url" font came from. Not "url" itself - that is the source kind. */
export type DiWebFontProvider = "google" | "bunny" | "direct";

export interface DiFont {
  key: string;
  familyName: string;
  sourceKind: "media" | "path" | "url";
  mediaKey?: string | null;
  path?: string | null;
  /** "url" fonts only. */
  provider?: DiWebFontProvider | null;
  /** "url" fonts only: the file URL fetched at render time. */
  sourceUrl?: string | null;
  /** "url" fonts only: the family as typed into the picker. */
  providerFamily?: string | null;
  weight: number;
  isItalic: boolean;
  styles: DiFontStyle[];
  contentHash?: string | null;
  usedByTemplateCount: number;
}

/** Google and Bunny take family + weights (+ italic); direct takes url. */
export interface DiRegisterWebFontRequest {
  provider: DiWebFontProvider;
  family?: string | null;
  weights?: number[] | null;
  includeItalic: boolean;
  url?: string | null;
}

/** The rows that were created and one message per variant that was not. */
export interface DiRegisterWebFontResponse {
  fonts: DiFont[];
  errors: string[];
}

// ---------------------------------------------------------------- document types

/** Drives the palette chip's icon and colour, and which layer type a drop creates. */
export type PropertyClassification =
  | "text" | "richtext" | "date" | "media" | "content" | "list" | "boolean" | "number" | "readingTime" | "other";

export interface DiDocumentType {
  key: string;
  alias: string;
  name: string;
  icon: string;
}

export interface DiProperty {
  alias: string;
  name: string;
  group: string;
  editorAlias: string;
  classification: PropertyClassification;
  isSystem: boolean;
}

export interface DiSampleContentItem {
  key: string;
  name: string;
  docTypeAlias: string;
  isPublished: boolean;
  updateDate: string;
}

// ---------------------------------------------------------------- preview

export interface DiLayerBounds {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  lines: number;
  truncated: boolean;
  resolvedText?: string | null;
}

export interface DiLayout {
  canvasWidth: number;
  canvasHeight: number;
  layers: DiLayerBounds[];
  issues: DiValidationIssue[];
}

// ---------------------------------------------------------------- health, jobs, usage

export interface DiHealthIssue {
  severity: "info" | "warning" | "error";
  code: string;
  message: string;
  templateKey?: string | null;
  templateName?: string | null;
  layerKey?: string | null;
}

export interface DiHealthReport {
  isEnabled: boolean;
  legacyConfigPresent: boolean;
  templateCount: number;
  fontCount: number;
  issues: DiHealthIssue[];
}

export interface DiJob {
  id: string;
  templateKey: string;
  templateName: string;
  status: "queued" | "running" | "completed" | "cancelled" | "failed";
  total: number;
  processed: number;
  generated: number;
  skipped: number;
  failures: string[];
  startedUtc: string;
  finishedUtc?: string | null;
}

export interface DiUsage {
  total: number;
  withImage: number;
  items: { key: string; name: string; hasImage: boolean; isPublished: boolean }[];
}

export interface DiImportReport {
  created: string[];
  skipped: string[];
  warnings: string[];
}

export interface DiSyncStatus {
  mode: "off" | "export" | "import";
  folder: string;
  fileCount: number;
  lastWriteUtc?: string | null;
}
