import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { INSPECTOR_BOUNDS, clampNumber, type NumberBounds } from "./number-bounds.js";
import { normalise } from "../models/rotation.js";
import fixtures from "../models/rotation-fixtures.json" with { type: "json" };

/**
 * A5 - `min` and `max` reached only the native input's steppers, so a typed Opacity of 5 was
 * accepted verbatim and the layer model became `opacity: 5`. The server's validator would have
 * caught it, but not until save.
 */

describe("clampNumber", () => {
  it("clamps above the maximum", () => {
    const { min, max } = INSPECTOR_BOUNDS.opacity;
    expect(clampNumber("5", min, max)).toBe(1);
  });

  it("clamps below the minimum", () => {
    const { min, max } = INSPECTOR_BOUNDS.opacity;
    expect(clampNumber("-3", min, max)).toBe(0);
  });

  it("leaves an in-range value alone", () => {
    const { min, max } = INSPECTOR_BOUNDS.opacity;
    expect(clampNumber("0.4", min, max)).toBe(0.4);
  });

  it("reads an empty field as null, which is a real setting", () => {
    expect(clampNumber("", 1, 5000)).toBeNull();
    expect(clampNumber("   ", 1, 5000)).toBeNull();
  });

  it("keeps the last good value when what was typed is not a number", () => {
    // undefined means "do not dispatch" - typing "abc" must not blank a layer's width.
    expect(clampNumber("abc", 1, 5000)).toBeUndefined();
    expect(clampNumber("12px", 1, 5000)).toBeUndefined();
  });

  it("applies a one-sided bound on its own", () => {
    expect(clampNumber("-40", 0, undefined)).toBe(0);
    expect(clampNumber("9999", undefined, 800)).toBe(800);
    expect(clampNumber("-9999", undefined, 800)).toBe(-9999);
  });

  it("does not clamp an unbounded field", () => {
    expect(clampNumber("9999")).toBe(9999);
  });
});

describe("rotation is normalised rather than clamped", () => {
  // Wrapping is the correct behaviour for an angle, and the shared fixture already pins it - so
  // Rotation is the one inspector field deliberately absent from the bounds table.
  it("999 becomes -81", () => {
    expect(normalise(999)).toBe(-81);
  });

  for (const { degrees, expected } of fixtures.normalise) {
    it(`normalise(${degrees}) is ${expected}`, () => {
      expect(normalise(degrees)).toBe(expected);
    });
  }

  it("is not in the bounds table", () => {
    expect(Object.keys(INSPECTOR_BOUNDS)).not.toContain("rotation");
  });
});

describe("the inspector bounds table", () => {
  const entries = Object.entries(INSPECTOR_BOUNDS) as [string, NumberBounds][];

  it("is not empty", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  for (const [name, bounds] of entries) {
    it(`${name} declares a usable range`, () => {
      expect(Number.isFinite(bounds.min), `${name}.min is not a number`).toBe(true);
      expect(Number.isFinite(bounds.max), `${name}.max is not a number`).toBe(true);
      expect(bounds.min, `${name} has min >= max`).toBeLessThan(bounds.max);
    });
  }
});

describe("every inspector number field declares bounds", () => {
  // A source scan rather than a mounted element, because the point is that no *future* field is
  // added without bounds - the state A5 found the inspector in, where only Opacity had any.
  const source = readFileSync(
    fileURLToPath(new URL("../designer/di-layer-inspector.element.ts", import.meta.url)),
    "utf8",
  );

  const fields = [...source.matchAll(/<di-number-field\b([\s\S]*?)>/g)].map((match) => {
    const attributes = match[1];
    const label = /label=(?:"([^"]*)"|\$\{([^}]*)\})/.exec(attributes);

    return {
      label: (label?.[1] ?? label?.[2] ?? "(unlabelled)").trim(),
      bounded: /\.min=/.test(attributes) && /\.max=/.test(attributes),
    };
  });

  it("finds the fields at all, so a passing scan means something", () => {
    expect(fields.length).toBeGreaterThan(20);
  });

  it("leaves none unbounded but Rotation", () => {
    const unbounded = fields.filter((field) => !field.bounded).map((field) => field.label);
    expect(unbounded).toEqual(["Rotation"]);
  });
});
