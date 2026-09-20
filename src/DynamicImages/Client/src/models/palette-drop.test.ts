import { describe, expect, it } from "vitest";
import { createLayerForProperty, createTemplate, layerTypeFor } from "./layer-factories.js";
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
