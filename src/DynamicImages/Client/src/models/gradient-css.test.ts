import { describe, expect, it } from "vitest";
import type { DiGradient } from "../api/types.js";
import { addStop, effectiveStops, gradientCss, mixHex, removeStop, reverseStops, withStops } from "./gradient-css.js";

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

const THREE = [
  { colour: "#FF0000", position: 0 },
  { colour: "#00FF00", position: 0.4 },
  { colour: "#0000FF", position: 1 },
];

describe("gradient css - stops and kinds", () => {
  it("writes every stop with its position", () => {
    expect(gradientCss(gradient({ stops: THREE })))
      .toBe("linear-gradient(180deg, #FF0000 0%, #00FF00 40%, #0000FF 100%)");
  });

  it("sorts stops by position, as the renderer does", () => {
    expect(gradientCss(gradient({ stops: [THREE[2], THREE[0], THREE[1]] })))
      .toBe("linear-gradient(180deg, #FF0000 0%, #00FF00 40%, #0000FF 100%)");
  });

  it("falls back to from and to with fewer than two stops", () => {
    expect(gradientCss(gradient({ stops: [THREE[1]] }))).toBe("linear-gradient(180deg, #000000CC, #00000000)");
  });

  it("writes a radial gradient's shape and extent", () => {
    expect(gradientCss(gradient({ kind: "radial", shape: "circle", extent: "closestSide" })))
      .toBe("radial-gradient(circle closest-side at 50% 50%, #000000CC, #00000000)");
  });

  it("writes an angular gradient as a conic gradient from its angle", () => {
    expect(gradientCss(gradient({ kind: "angular", angle: 90, centreX: 0.25, stops: THREE })))
      .toBe("conic-gradient(from 90deg at 25% 50%, #FF0000 0%, #00FF00 40%, #0000FF 100%)");
  });

  it("writes a reflected gradient with its stops mirrored about the middle", () => {
    expect(gradientCss(gradient({ kind: "reflected", from: "#FF0000", to: "#0000FF" })))
      .toBe("linear-gradient(180deg, #0000FF 0%, #FF0000 50%, #FF0000 50%, #0000FF 100%)");
  });

  it("writes a diamond as four quadrant gradients sized around the centre, stops halved", () => {
    const css = gradientCss(gradient({ kind: "diamond", from: "#FF0000", to: "#0000FF", centreX: 0.25, centreY: 0.5 }));

    expect(css).toContain("linear-gradient(to top left, #FF0000 0%, #0000FF 50%) left top / 25% 50% no-repeat");
    expect(css).toContain("linear-gradient(to bottom right, #FF0000 0%, #0000FF 50%) right bottom / 75% 50% no-repeat");
    expect(css.match(/linear-gradient/g)).toHaveLength(4);
  });
});

describe("editing stops", () => {
  it("keeps from and to equal to the first and last stops", () => {
    const next = withStops(gradient(), [THREE[1], THREE[2], THREE[0]]);

    expect(next.from).toBe("#FF0000");
    expect(next.to).toBe("#0000FF");
  });

  it("adds a stop at the middle of the widest gap, in the colour already there", () => {
    const next = addStop(gradient({ stops: THREE }));
    const added = effectiveStops(next).find((stop) => stop.position === 0.7);

    expect(effectiveStops(next)).toHaveLength(4);
    expect(added?.colour).toBe(mixHex("#00FF00", "#0000FF", 0.5));
  });

  it("turns a two-colour gradient into three stops", () => {
    const next = addStop(gradient({ from: "#000000", to: "#FFFFFF" }));

    expect(effectiveStops(next).map((stop) => stop.colour)).toEqual(["#000000", "#808080", "#FFFFFF"]);
  });

  it("never removes below two stops", () => {
    const two = gradient({ from: "#000000", to: "#FFFFFF" });

    expect(removeStop(two, 0)).toBe(two);
    expect(effectiveStops(removeStop(gradient({ stops: THREE }), 1)).map((stop) => stop.colour))
      .toEqual(["#FF0000", "#0000FF"]);
  });

  it("reverses the colours along the gradient", () => {
    const reversed = reverseStops(gradient({ stops: THREE }));

    expect(effectiveStops(reversed)).toEqual([
      { colour: "#0000FF", position: 0 },
      { colour: "#00FF00", position: 0.6 },
      { colour: "#FF0000", position: 1 },
    ]);
    expect(reversed.from).toBe("#0000FF");
  });

  it("mixes alpha as well as colour", () => {
    expect(mixHex("#00000000", "#FFFFFFFF", 0.5)).toBe("#80808080");
    expect(mixHex("#000000", "#FFFFFF", 0.5)).toBe("#808080");
  });
});
