import { describe, expect, it } from "vitest";
import type { DiTemplate } from "../api/types.js";
import { canvasFill, isTransparent, withAlpha } from "./canvas-fill.js";
import { createTemplate } from "./layer-factories.js";

const canvas = (overrides: Partial<DiTemplate["canvas"]> = {}): DiTemplate["canvas"] => ({
  ...createTemplate("T").canvas,
  ...overrides,
});

describe("canvas fill", () => {
  it("reads the mode off the two fields that already say it", () => {
    expect(canvasFill(canvas())).toBe("colour");
    expect(canvasFill(canvas({ background: "#0B0F1900" }))).toBe("transparent");
    expect(canvasFill(canvas({
      backgroundGradient: { kind: "linear", from: "#000", to: "#FFF", angle: 180, centreX: 0.5, centreY: 0.5 },
    }))).toBe("gradient");
  });

  it("calls a gradient over a transparent colour a gradient", () => {
    // The gradient is the fill when it is set, exactly as on a shape layer.
    expect(canvasFill(canvas({
      background: "#0B0F1900",
      backgroundGradient: { kind: "radial", from: "#000", to: "#FFF", angle: 180, centreX: 0.5, centreY: 0.5 },
    }))).toBe("gradient");
  });

  it("counts an empty background as transparent, because that is what renders", () => {
    expect(isTransparent("")).toBe(true);
    expect(isTransparent("   ")).toBe(true);
    expect(isTransparent(undefined)).toBe(true);
    expect(isTransparent(null)).toBe(true);
  });

  it("reads zero alpha and only zero alpha as transparent", () => {
    expect(isTransparent("#0B0F1900")).toBe(true);
    expect(isTransparent("0B0F1900")).toBe(true);
    expect(isTransparent("#0B0F1901")).toBe(false);
    expect(isTransparent("#0B0F19")).toBe(false);
    expect(isTransparent("#0B0F1999")).toBe(false);
  });

  it("round-trips a colour through transparent and back", () => {
    expect(withAlpha("#0B0F19", "00")).toBe("#0B0F1900");
    expect(withAlpha("#0B0F1900", "FF")).toBe("#0B0F19");
    expect(withAlpha(withAlpha("#0B0F19", "00"), "FF")).toBe("#0B0F19");
  });

  it("keeps the colour when the alpha it already carries is not the one being set", () => {
    // A 60% scrim colour switched to Transparent and back comes back opaque, not 60%: the mode
    // picker's three states are opaque, gradient and invisible.
    expect(withAlpha("#0B0F1999", "00")).toBe("#0B0F1900");
    expect(withAlpha("#0B0F1999", "FF")).toBe("#0B0F19");
  });

  it("expands a hand-written shorthand and falls back to black on nonsense", () => {
    expect(withAlpha("#abc", "00")).toBe("#AABBCC00");
    expect(withAlpha("", "FF")).toBe("#000000");
    expect(withAlpha("rebeccapurple", "FF")).toBe("#000000");
  });
});
