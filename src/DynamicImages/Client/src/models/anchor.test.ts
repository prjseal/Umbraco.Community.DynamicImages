import { describe, expect, it } from "vitest";
import { anchorToTopLeft, ANCHORS, axisX, axisY, composeAnchor, positionForTopLeft, reanchor, topLeftToAnchor } from "./anchor.js";
import fixtures from "./anchor-fixtures.json";

/**
 * The same fixture file is asserted against by AnchorMathTests on the server. If either side
 * drifts, one of the two suites fails - which is the point.
 */
describe("anchor maths", () => {
  it("matches the shared fixture", () => {
    for (const fixture of fixtures.cases) {
      const topLeft = anchorToTopLeft(
        { x: fixture.x, y: fixture.y, anchor: fixture.anchor as never },
        fixture.width,
        fixture.height,
      );

      expect(topLeft.x, `${fixture.anchor} x`).toBeCloseTo(fixture.expectedLeft, 4);
      expect(topLeft.y, `${fixture.anchor} y`).toBeCloseTo(fixture.expectedTop, 4);
    }
  });

  it("round-trips through top-left and back", () => {
    for (const anchor of ANCHORS) {
      const position = { x: 137, y: 421, anchor };
      const topLeft = anchorToTopLeft(position, 300, 120);
      const back = topLeftToAnchor(topLeft.x, topLeft.y, 300, 120, anchor);

      expect(back.x).toBeCloseTo(position.x, 6);
      expect(back.y).toBeCloseTo(position.y, 6);
    }
  });

  it("leaves the box where it is when the anchor changes", () => {
    const original = { x: 60, y: 160, anchor: "topLeft" as const };
    const before = anchorToTopLeft(original, 400, 100);

    for (const anchor of ANCHORS) {
      const after = anchorToTopLeft(reanchor(original, 400, 100, anchor), 400, 100);

      // Re-anchoring rounds to whole pixels, so the box may shift by at most half a pixel.
      expect(after.x).toBeCloseTo(before.x, 0);
      expect(after.y).toBeCloseTo(before.y, 0);
    }
  });

  it("puts a box's top-left exactly where asked, for every anchor", () => {
    for (const anchor of ANCHORS) {
      const position = positionForTopLeft({ x: 12, y: 34, width: 200, height: 80 }, { x: 0, y: 0, anchor });
      const topLeft = anchorToTopLeft(position, 200, 80);

      expect(topLeft.x).toBeCloseTo(12, 0);
      expect(topLeft.y).toBeCloseTo(34, 0);
    }
  });

  it("composes an anchor back from its axis factors", () => {
    for (const anchor of ANCHORS) {
      expect(composeAnchor(axisX(anchor), axisY(anchor))).toBe(anchor);
    }

    expect(composeAnchor(0, 1)).toBe("bottomLeft");
    expect(composeAnchor(1, 0)).toBe("topRight");
    expect(composeAnchor(0.5, 0.5)).toBe("middleCentre");
  });

  it("keeps relative references when a position is re-expressed", () => {
    const position = {
      x: 10, y: 20, anchor: "topLeft" as const,
      relativeY: { layerKey: "title", edge: "below" as const, gap: 10 },
      relativeX: null,
    };

    expect(positionForTopLeft({ x: 0, y: 0, width: 10, height: 10 }, position).relativeY).toEqual(position.relativeY);
    expect(reanchor(position, 10, 10, "bottomRight").relativeY).toEqual(position.relativeY);
    expect(reanchor(position, 10, 10, "bottomRight").relativeX).toBeNull();
  });

  it("uses the axis factors the renderer's alignment is derived from", () => {
    expect(axisX("topLeft")).toBe(0);
    expect(axisX("middleCentre")).toBe(0.5);
    expect(axisX("bottomRight")).toBe(1);
    expect(axisY("topRight")).toBe(0);
    expect(axisY("middleLeft")).toBe(0.5);
    expect(axisY("bottomCentre")).toBe(1);
  });
});
