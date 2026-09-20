import { describe, expect, it } from "vitest";
import type { DiGradient } from "../api/types.js";
import { gradientCss } from "./gradient-css.js";

const gradient = (overrides: Partial<DiGradient> = {}): DiGradient => ({
  kind: "linear",
  from: "#000000CC",
  to: "#00000000",
  angle: 180,
  centreX: 0.5,
  centreY: 0.5,
  ...overrides,
});

/**
 * These strings are half of a contract: the other half is GradientGeometry on the server. If the
 * angle convention or the `farthest-corner` keyword changes here, the artboard stops agreeing
 * with the render.
 */
describe("gradient css", () => {
  it("writes a linear gradient at its angle", () => {
    expect(gradientCss(gradient())).toBe("linear-gradient(180deg, #000000CC, #00000000)");
  });

  it("writes a radial gradient as a farthest-corner ellipse", () => {
    expect(gradientCss(gradient({ kind: "radial", from: "#FF0000", to: "#0000FF" })))
      .toBe("radial-gradient(ellipse farthest-corner at 50% 50%, #FF0000, #0000FF)");
  });

  it("writes an off-centre radial gradient as whole percentages", () => {
    expect(gradientCss(gradient({ kind: "radial", centreX: 0.2, centreY: 0.755 })))
      .toContain("at 20% 76%");
  });

  it("clamps a centre outside 0..1, as the renderer does", () => {
    expect(gradientCss(gradient({ kind: "radial", centreX: -0.5, centreY: 4 })))
      .toContain("at 0% 100%");
  });

  it("ignores the centre on a linear gradient, as the renderer does", () => {
    expect(gradientCss(gradient({ centreX: 0.1, angle: 45 })))
      .toBe("linear-gradient(45deg, #000000CC, #00000000)");
  });
});
