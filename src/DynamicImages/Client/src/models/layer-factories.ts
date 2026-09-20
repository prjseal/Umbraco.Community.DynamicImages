import type {
  DiBadgesLayer, DiImageLayer, DiLayer, DiProperty, DiRectLayer, DiTemplate, DiTextLayer,
  PropertyClassification, ShapeKind,
} from "../api/types.js";

/** crypto.randomUUID is available in every browser the backoffice supports. */
const newKey = (): string => crypto.randomUUID();

export interface NewLayerContext {
  /** Where the editor dropped or clicked, in image pixels. Defaults to the canvas centre. */
  x?: number;
  y?: number;
  template: DiTemplate;
  /** The font a new text layer should use - normally whichever the design already uses most. */
  defaultFontKey?: string;
}

function centre(context: NewLayerContext): { x: number; y: number } {
  return {
    x: Math.round(context.x ?? context.template.canvas.width / 2),
    y: Math.round(context.y ?? context.template.canvas.height / 2),
  };
}

export function createTextLayer(context: NewLayerContext, name: string, binding: DiTextLayer["binding"]): DiTextLayer {
  const { x, y } = centre(context);

  return {
    type: "text",
    key: newKey(),
    name,
    isVisible: true,
    isLocked: false,
    opacity: 1,
    // Dropped layers are centred on the pointer, which is what "I put it there" means.
    position: { x, y, anchor: "middleCentre" },
    size: { width: Math.round(context.template.canvas.width * 0.8), height: null },
    rotation: 0,
    visibility: { rule: "always" },
    binding,
    prefix: "",
    suffix: "",
    style: {
      fontKey: context.defaultFontKey ?? "",
      styleName: null,
      fontSize: 48,
      fontStyle: "Regular",
      colour: "#FFFFFF",
      textAlign: "left",
      lineSpacing: 1.1,
      letterSpacing: 0,
      textTransform: "none",
      maxLines: 3,
      overflow: "shrink",
    },
  };
}

export function createImageLayer(context: NewLayerContext, name: string, propertyAlias?: string): DiImageLayer {
  const { x, y } = centre(context);

  return {
    type: "image",
    key: newKey(),
    name,
    isVisible: true,
    isLocked: false,
    opacity: 1,
    position: { x, y, anchor: "middleCentre" },
    size: { width: 320, height: 180 },
    rotation: 0,
    visibility: { rule: "always" },
    source: propertyAlias
      ? { kind: "property", propertyAlias, fallback: null }
      : { kind: "none" },
    fit: "cover",
    cornerRadius: 16,
    border: null,
  };
}

export function createBadgesLayer(context: NewLayerContext, name: string, itemsPropertyAlias: string): DiBadgesLayer {
  const { x, y } = centre(context);

  return {
    type: "badges",
    key: newKey(),
    name,
    isVisible: true,
    isLocked: false,
    opacity: 1,
    position: { x, y, anchor: "middleCentre" },
    size: {},
    rotation: 0,
    visibility: { rule: "always" },
    itemsPropertyAlias,
    labelPropertyAlias: null,
    maxItems: 2,
    gap: 40,
    direction: "horizontal",
    wrap: false,
    rowGap: 20,
    icon: { kind: "pathPattern", basePath: "/assets/og-icons", propertyAlias: "shortName", extension: ".png" },
    badge: { size: 88, innerSize: 44, fillColour: "#FFFFFF14", borderColour: "#FFFFFF26", borderWidth: 1.5 },
    label: {
      fontKey: context.defaultFontKey ?? "",
      styleName: null,
      fontSize: 22,
      colour: "#6B7280",
      textTransform: "uppercase",
      letterSpacing: 1,
      gap: 10,
      position: "below",
    },
  };
}

export function createRectLayer(context: NewLayerContext, name = "Shape", shape: ShapeKind = "rectangle"): DiRectLayer {
  const { x, y } = centre(context);

  return {
    type: "rect",
    key: newKey(),
    name: shape === "ellipse" && name === "Shape" ? "Ellipse" : name,
    isVisible: true,
    isLocked: false,
    opacity: 1,
    position: { x, y, anchor: "middleCentre" },
    // A circle is the ellipse people reach for; a scrim is wide.
    size: shape === "ellipse" ? { width: 200, height: 200 } : { width: 400, height: 200 },
    rotation: 0,
    visibility: { rule: "always" },
    shape,
    fill: "#00000099",
    gradient: null,
    cornerRadius: 0,
    sides: 5,
    innerRatio: 0.5,
    border: null,
  };
}

/**
 * Which layer type a property produces when it is dragged onto the canvas. This is the one place
 * the palette's "what happens when I drop this" decision lives.
 */
export function layerTypeFor(classification: PropertyClassification): DiLayer["type"] {
  switch (classification) {
    case "media":
      return "image";
    case "content":
    case "list":
      return "badges";
    // Spelled out rather than left to the default, because a boolean does not produce a layer at
    // all - see createLayerForProperty. This is what it *would* be if it did.
    case "boolean":
      return "text";
    default:
      return "text";
  }
}

/**
 * What dropping a palette chip produces. A Yes/No property is not a thing to draw - drawing it
 * put the literal word "True" or "False" on the image - it is a thing to draw *by*, so it
 * becomes a visibility condition on a layer instead.
 */
export type PaletteDrop =
  | { kind: "layer"; layer: DiLayer }
  | { kind: "condition"; propertyAlias: string; propertyName: string };

/** Builds what a dropped palette chip becomes. */
export function createLayerForProperty(property: DiProperty, context: NewLayerContext): PaletteDrop {
  if (property.classification === "boolean") {
    return { kind: "condition", propertyAlias: property.alias, propertyName: property.name };
  }

  switch (layerTypeFor(property.classification)) {
    case "image":
      return { kind: "layer", layer: createImageLayer(context, property.name, property.alias) };

    case "badges":
      return { kind: "layer", layer: createBadgesLayer(context, property.name, property.alias) };

    default:
      return { kind: "layer", layer: createTextLayer(context, property.name, bindingFor(property)) };
  }
}

function bindingFor(property: DiProperty): DiTextLayer["binding"] {
  if (property.alias === "name") return { kind: "nodeName" };
  if (property.alias === "readingTime") return { kind: "readingTime", propertyAlias: "mainContent" };

  if (property.classification === "date") {
    return { kind: "date", propertyAlias: property.alias, format: "d MMMM yyyy" };
  }

  return { kind: "property", propertyAlias: property.alias };
}

/** A brand-new, empty-but-valid template, so "Create" lands on something renderable. */
export function createTemplate(name: string): DiTemplate {
  return {
    schemaVersion: 2,
    key: crypto.randomUUID(),
    alias: "",
    name,
    isEnabled: true,
    docTypeAliases: [],
    targetPropertyAlias: "",
    trigger: { onPublish: true, onlyWhenEmpty: true },
    output: { mediaFolderKey: null, fileNamePattern: "{name}", format: "png", quality: 90 },
    canvas: {
      width: 1200,
      height: 630,
      background: "#0B0F19",
      baseImage: { kind: "none" },
      baseImageFit: "cover",
    },
    layers: [],
    // The server stamps this on save; an epoch value means "I have never seen a stored version",
    // which the concurrency check treats as a first write.
    updatedUtc: new Date(0).toISOString(),
  };
}
