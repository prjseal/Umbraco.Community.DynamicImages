import { describe, expect, it } from "vitest";
import {
  SHAPE_PRESETS, SHAPE_PRESET_ORDER, createLayerForProperty, createRectLayer, createTemplate, layerTypeFor,
} from "./layer-factories.js";
import type { DiProperty, PropertyClassification } from "../api/types.js";

/**
 * C3 - the palette lists every property on the document type, booleans included. Dropping one
 * created a text layer that drew the literal word "True" or "False" onto the OG image, because
 * `layerTypeFor`'s default swept booleans in with everything else.
 *
 * Booleans stay in the palette: they are wanted, but as the *condition* on a layer rather than
 * as something to draw.
 */

function property(classification: PropertyClassification, alias = "isFollowable"): DiProperty {
  return {
    alias,
    name: "Is Followable",
    group: "Visibility",
    editorAlias: "Umbraco.TrueFalse",
    classification,
    isSystem: false,
  };
}

const context = { template: createTemplate("Drop fixture") };

describe("createLayerForProperty", () => {
  it("turns a boolean into a visibility condition, not a layer", () => {
    const drop = createLayerForProperty(property("boolean"), context);

    expect(drop.kind).toBe("condition");
    if (drop.kind !== "condition") throw new Error("unreachable");

    expect(drop.propertyAlias).toBe("isFollowable");
    // The name comes along so the notification can say what was applied, in the editor's words.
    expect(drop.propertyName).toBe("Is Followable");
  });

  it("still makes a text layer for text", () => {
    const drop = createLayerForProperty(property("text", "title"), context);

    expect(drop.kind).toBe("layer");
    if (drop.kind !== "layer") throw new Error("unreachable");
    expect(drop.layer.type).toBe("text");
  });

  it("still makes an image layer for media", () => {
    const drop = createLayerForProperty(property("media", "mainImage"), context);

    expect(drop.kind).toBe("layer");
    if (drop.kind !== "layer") throw new Error("unreachable");
    expect(drop.layer.type).toBe("image");
  });

  it("still makes a badges layer for a list", () => {
    const drop = createLayerForProperty(property("list", "tags"), context);

    expect(drop.kind).toBe("layer");
    if (drop.kind !== "layer") throw new Error("unreachable");
    expect(drop.layer.type).toBe("badges");
  });

  for (const classification of ["richtext", "date", "number", "readingTime", "other"] as const) {
    it(`leaves ${classification} producing a layer`, () => {
      expect(createLayerForProperty(property(classification, "x"), context).kind).toBe("layer");
    });
  }
});

describe("layerTypeFor", () => {
  it("keeps its signature, with boolean spelled out rather than swept into the default", () => {
    // It no longer decides what a boolean drop *does* - that is createLayerForProperty - but it
    // still has to answer, and the explicit case is there so the intent is legible.
    expect(layerTypeFor("boolean")).toBe("text");
    expect(layerTypeFor("media")).toBe("image");
    expect(layerTypeFor("list")).toBe("badges");
    expect(layerTypeFor("content")).toBe("badges");
    expect(layerTypeFor("text")).toBe("text");
  });
});

describe("createRectLayer presets", () => {
  it("offers every renderer shape, plus the presets, in menu order", () => {
    expect(SHAPE_PRESET_ORDER).toEqual([
      "rectangle", "roundedRectangle", "circle", "ellipse", "polygon", "triangle", "star",
    ]);
    expect(new Set(SHAPE_PRESET_ORDER.map((preset) => SHAPE_PRESETS[preset].shape)))
      .toEqual(new Set(["rectangle", "ellipse", "polygon", "star"]));
  });

  it("makes a circle a square ellipse with its aspect locked", () => {
    const circle = createRectLayer(context, "Shape", "circle");

    expect(circle.shape).toBe("ellipse");
    expect(circle.lockAspect).toBe(true);
    expect(circle.size.width).toBe(circle.size.height);
    expect(circle.name).toBe("Circle");
  });

  it("leaves an ordinary ellipse unlocked", () => {
    const ellipse = createRectLayer(context, "Shape", "ellipse");

    expect(ellipse.shape).toBe("ellipse");
    expect(ellipse.lockAspect).toBeUndefined();
  });

  it("rounds a rounded rectangle and not a plain one", () => {
    expect(createRectLayer(context, "Shape", "roundedRectangle").cornerRadius).toBe(24);
    expect(createRectLayer(context, "Shape", "rectangle").cornerRadius).toBe(0);
  });

  it("gives a triangle three sides, a polygon six and a star five points at half depth", () => {
    expect(createRectLayer(context, "Shape", "triangle")).toMatchObject({ shape: "polygon", sides: 3 });
    expect(createRectLayer(context, "Shape", "polygon")).toMatchObject({ shape: "polygon", sides: 6 });
    expect(createRectLayer(context, "Shape", "star")).toMatchObject({ shape: "star", sides: 5, innerRatio: 0.5 });
  });

  it("drops a rectangle when no preset is named, as dragging the Shape chip does", () => {
    expect(createRectLayer(context)).toMatchObject({ shape: "rectangle", name: "Rectangle" });
  });

  it("keeps a name the caller gave", () => {
    expect(createRectLayer(context, "Scrim", "rectangle").name).toBe("Scrim");
  });
});
