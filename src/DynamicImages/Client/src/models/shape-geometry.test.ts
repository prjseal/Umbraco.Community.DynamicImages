import { describe, expect, it } from "vitest";
import { clampInnerRatio, clampSides, clipPathFor, vertices } from "./shape-geometry.js";
import fixtures from "./shape-fixtures.json";

/**
 * The same fixture file is asserted against by ShapeGeometryTests on the server. If either side
 * drifts, one of the two suites fails - which is the point.
 */
describe("shape geometry", () => {
  for (const fixture of fixtures.cases) {
    it(fixture.name, () => {
      const points = vertices(fixture.kind as never, fixture.sides, fixture.innerRatio);

      expect(points.length, "vertex count").toBe(fixture.expected.length);
      fixture.expected.forEach(([x, y], index) => {
        expect(points[index].x, `point ${index} x`).toBeCloseTo(x, 3);
        expect(points[index].y, `point ${index} y`).toBeCloseTo(y, 3);
      });
    });
  }

  it("clamps sides and inner ratio to the shared range", () => {
    expect(clampSides(2)).toBe(3);
    expect(clampSides(12)).toBe(12);
    expect(clampSides(13)).toBe(12);
    expect(clampInnerRatio(0)).toBe(0.1);
    expect(clampInnerRatio(0.5)).toBe(0.5);
    expect(clampInnerRatio(1)).toBe(0.9);
  });

  it("builds a percentage clip path for polygons and stars only", () => {
    expect(clipPathFor("rectangle", 5, 0.5)).toBeUndefined();
    expect(clipPathFor("ellipse", 5, 0.5)).toBeUndefined();
    expect(clipPathFor("polygon", 4, 0.5)).toBe("polygon(50.000% 0.000%, 100.000% 50.000%, 50.000% 100.000%, 0.000% 50.000%)");
    expect(clipPathFor("star", 5, 0.5)!.split(",").length).toBe(10);
  });
});
