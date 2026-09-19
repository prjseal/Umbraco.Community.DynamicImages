import { describe, expect, it } from "vitest";
import { extent, normalise, rotatePoint, toLocal } from "./rotation.js";
import fixtures from "./rotation-fixtures.json";

/**
 * The same fixture file is asserted against by RotationMathTests on the server. If either side
 * drifts, one of the two suites fails - which is the point.
 */
describe("rotation maths", () => {
  describe("rotatePoint", () => {
    for (const fixture of fixtures.rotatePoint) {
      it(fixture.name, () => {
        const rotated = rotatePoint(fixture.px, fixture.py, fixture.pivotX, fixture.pivotY, fixture.degrees);

        expect(rotated.x, "x").toBeCloseTo(fixture.expectedX, 3);
        expect(rotated.y, "y").toBeCloseTo(fixture.expectedY, 3);
      });
    }

    it("is undone by toLocal", () => {
      for (const fixture of fixtures.rotatePoint) {
        const rotated = rotatePoint(fixture.px, fixture.py, fixture.pivotX, fixture.pivotY, fixture.degrees);
        const back = toLocal(rotated.x, rotated.y, fixture.pivotX, fixture.pivotY, fixture.degrees);

        expect(back.x, fixture.name).toBeCloseTo(fixture.px, 3);
        expect(back.y, fixture.name).toBeCloseTo(fixture.py, 3);
      }
    });
  });

  describe("extent", () => {
    for (const fixture of fixtures.extent) {
      it(fixture.name, () => {
        const box = { x: fixture.left, y: fixture.top, width: fixture.width, height: fixture.height };
        const result = extent(box, fixture.pivotX, fixture.pivotY, fixture.degrees);

        expect(result.x, "x").toBeCloseTo(fixture.expected.x, 3);
        expect(result.y, "y").toBeCloseTo(fixture.expected.y, 3);
        expect(result.width, "width").toBeCloseTo(fixture.expected.width, 3);
        expect(result.height, "height").toBeCloseTo(fixture.expected.height, 3);
      });
    }

    it("returns the very same box when there is no rotation", () => {
      const box = { x: 1.1, y: 2.2, width: 3.3, height: 4.4 };
      expect(extent(box, 99, 99, 0)).toBe(box);
    });
  });

  describe("normalise", () => {
    for (const fixture of fixtures.normalise) {
      it(`${fixture.degrees} becomes ${fixture.expected}`, () => {
        expect(normalise(fixture.degrees)).toBeCloseTo(fixture.expected, 6);
      });
    }

    it("never returns negative zero", () => {
      expect(Object.is(normalise(-360), -0)).toBe(false);
      expect(Object.is(normalise(-0), -0)).toBe(false);
    });
  });
});
