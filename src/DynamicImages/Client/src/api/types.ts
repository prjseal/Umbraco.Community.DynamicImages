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
  /** {@link DottedAlias} - e.g. `author.mainImage` for the picked author's photo. */
  propertyAlias?: string | null;
  fallback?: DiImageSource | null;
}

export type TextBindingKind = "property" | "nodeName" | "readingTime" | "date" | "static" | "expression";

export interface DiTextBinding {
  kind: TextBindingKind;
  /**
   * {@link DottedAlias}. A bare reference - `author` with no tail - draws the linked node's name
   * rather than its UDI.
   */
  propertyAlias?: string | null;
  format?: string | null;
  culture?: string | null;
  text?: string | null;
}

export type VisibilityRuleKind = "always" | "whenNotEmpty" | "whenPropertyTruthy";

export interface DiVisibility {
  rule: VisibilityRuleKind;
  /** {@link DottedAlias} - e.g. `author.isFeatured`. */
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
  /** Degrees clockwise, turning the layer about its anchor point. Absent in older documents = 0. */
  rotation: number;
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
  /**
   * {@link DottedAlias}. The label and icon aliases below are single-segment reads on each badge
   * item and do not follow references.
   */
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

export type ShapeKind = "rectangle" | "ellipse" | "polygon" | "star";

export type GradientKind = "linear" | "radial";

/**
 * A two-stop gradient, on a shape layer or as the canvas's fill. The server writes every field,
 * so none of them is optional here; a gradient the *client* builds comes from `createGradient()`,
 * which is the one place the defaults live.
 */
export interface DiGradient {
  kind: GradientKind;
  from: string;
  to: string;
  /** Linear only. Degrees clockwise from "top to bottom" = 180, as in CSS. */
  angle: number;
  /** Radial only. The centre as a fraction of the box, 0..1. */
  centreX: number;
  centreY: number;
}

/**
 * A filled and/or outlined shape. The discriminator stays "rect" whatever the shape, so every
 * stored template stays valid and an older package draws a rectangle.
 */
export interface DiRectLayer extends DiLayerBase {
  type: "rect";
  shape: ShapeKind;
  /** null with no gradient means outline-only. */
  fill?: string | null;
  gradient?: DiGradient | null;
  /** Rectangle only. */
  cornerRadius: number;
  /** Sides of a polygon or points of a star, 3..12. */
  sides: number;
  /** A star's inner radius as a proportion of the outer, 0.1..0.9. */
  innerRatio: number;
  /** Drawn inside the box, like an image border. */
  border?: { width: number; colour: string } | null;
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
  /** The folder in the Templates tree; null (or absent, before folders existed) is the root. */
  parentKey?: string | null;
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
    /** The fill, unless `backgroundGradient` is set; the base image draws on top of either. */
    background: string;
    /** When set, the canvas is filled with this instead of `background`. */
    backgroundGradient?: DiGradient | null;
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

/** A row of the Templates tree, as `tree/*` and `item` return it. */
export interface DiTreeItem {
  key: string;
  name: string;
  entityType: "folder" | "template";
  parentKey: string | null;
  hasChildren: boolean;
  isEnabled: boolean;
}

/** A row of `collection/templates`. The template-only fields are null on a folder. */
export interface DiCollectionItem {
  key: string;
  entityType: "folder" | "template";
  name: string;
  parentKey: string | null;
  isEnabled: boolean;
  docTypeAliases: string[] | null;
  targetPropertyAlias: string | null;
  layerCount: number | null;
  canvasWidth: number | null;
  canvasHeight: number | null;
  updatedUtc: string | null;
}

export interface DiTemplateFolder {
  key: string;
  name: string;
  parentKey: string | null;
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

/**
 * Any `propertyAlias` on a binding may be a dotted path - `author.mainImage` - which follows the
 * content reference in its first segment and reads the last segment on the node it lands on.
 *
 * Three rules, all enforced server-side: **the first node wins** when a picker holds several,
 * there is no index syntax, and a path may follow at most `MAX_HOPS` (3) references - beyond that
 * it resolves to nothing rather than being truncated, and the template validator warns.
 *
 * The dotted string rides in the existing field, so the template JSON and uSync serialisation
 * carry it unchanged.
 */
export type DottedAlias = string;

/** How {@link DiLinkedProperties.targetDocTypes} was arrived at. */
export type LinkedInference =
  /** The picker's own content-type filter said so. */
  | "filter"
  /** Inferred from what existing content actually picks. */
  | "sampled"
  /** Nothing could narrow it, so every document type is offered. */
  | "all"
  /** The property is not a content reference at all. */
  | "none";

/** What a content-reference property points at, and what can be read on the far side of it. */
export interface DiLinkedProperties {
  propertyAlias: string;
  inference: LinkedInference;
  targetDocTypes: DiDocumentType[];
  properties: DiProperty[];
}

export interface DiProperty {
  alias: string;
  name: string;
  /** The group's name, or the tab's for a property placed directly on a tab. */
  group: string;
  editorAlias: string;
  classification: PropertyClassification;
  isSystem: boolean;
  /** The tab the group is on, when it is on one. */
  tab?: string | null;
  /** Where the property sits on its document type; -1 sorts first. Absent from older servers. */
  tabSortOrder?: number;
  groupSortOrder?: number;
  sortOrder?: number;
}

export interface DiSampleContentItem {
  key: string;
  name: string;
  docTypeAlias: string;
  isPublished: boolean;
  updateDate: string;
}

// ---------------------------------------------------------------- preview

/**
 * Where the server drew a layer: its unrotated box, plus the rotation and the pivot it turned
 * about, so the overlay can be laid over exactly where the pixels went.
 */
export interface DiLayerBounds {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  lines: number;
  truncated: boolean;
  resolvedText?: string | null;
  rotation: number;
  pivotX: number;
  pivotY: number;
}

/**
 * A layer that produced nothing, and why. Mirrors `LayerSkipResponse`. A layer that draws
 * nothing is absent from `layers`, so without this the designer has no way to say why the image
 * is missing something.
 */
export interface DiLayerSkip {
  key: string;
  reason: string;
}

export interface DiLayout {
  canvasWidth: number;
  canvasHeight: number;
  layers: DiLayerBounds[];
  issues: DiValidationIssue[];
  skipped: DiLayerSkip[];
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
  /** Every document the template covers, not just the ones on this page. */
  total: number;
  /** How many of `items` have an image - the server does not count the rows it did not return. */
  withImageOnPage: number;
  items: { key: string; name: string; hasImage: boolean; isPublished: boolean }[];
}

export interface DiSyncStatus {
  mode: "off" | "export" | "import";
  folder: string;
  fileCount: number;
  lastWriteUtc?: string | null;
}
