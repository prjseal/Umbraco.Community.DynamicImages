import { describe, expect, it } from "vitest";
import { snap, type SnapContext } from "./snap.js";

const context = (others: SnapContext["others"] = []): SnapContext => ({
  canvasWidth: 1200,
  canvasHeight: 630,
  others,
  threshold: 6,
});

describe("snap", () => {
  it("leaves a box alone when nothing is within the threshold", () => {
    // Deliberately clear of every candidate: the canvas centre is (600, 315), and none of this
    // box's own edges land within six pixels of that or of an edge.
    const result = snap({ x: 300, y: 400, width: 100, height: 40 }, context());

    expect(result.box.x).toBe(300);
    expect(result.box.y).toBe(400);
    expect(result.guides).toHaveLength(0);
  });

  it("snaps a near-left box onto the canvas edge", () => {
    const result = snap({ x: 4, y: 300, width: 100, height: 40 }, context());

    expect(result.box.x).toBe(0);
    expect(result.guides).toContainEqual({ orientation: "vertical", at: 0, label: "Left edge" });
  });

  it("snaps by the right edge, not only the left", () => {
    // Right edge at 1197, three pixels short of the canvas.
    const result = snap({ x: 997, y: 300, width: 200, height: 40 }, context());

    expect(result.box.x).toBe(1000);
    expect(result.guides[0]?.label).toBe("Right edge");
  });

  it("centres a box on the canvas centre line", () => {
    const result = snap({ x: 548, y: 10, width: 100, height: 40 }, context());

    expect(result.box.x).toBe(550);
    expect(result.guides.some((g) => g.label === "Centre")).toBe(true);
  });

  it("aligns to another layer's edge", () => {
    const result = snap({ x: 63, y: 400, width: 200, height: 40 }, context([{ x: 60, y: 160, width: 300, height: 100 }]));

    expect(result.box.x).toBe(60);
    expect(result.guides[0]?.label).toBe("Layer left");
  });

  it("snaps the two axes independently", () => {
    const result = snap({ x: 3, y: 400, width: 100, height: 40 }, context());

    expect(result.box.x).toBe(0);
    expect(result.box.y).toBe(400);
    expect(result.guides).toHaveLength(1);
  });

  it("leaves a locked axis alone and draws no guide for it", () => {
    // Four pixels from the left edge and three from the top: both would snap if free.
    const result = snap({ x: 4, y: 3, width: 100, height: 40 }, { ...context(), lockX: true });

    expect(result.box.x).toBe(4);
    expect(result.box.y).toBe(0);
    expect(result.guides).toHaveLength(1);
    expect(result.guides[0]?.orientation).toBe("horizontal");
  });

  it("can lock both axes", () => {
    const result = snap({ x: 4.4, y: 3, width: 100, height: 40 }, { ...context(), lockX: true, lockY: true });

    expect(result.box).toEqual({ x: 4.4, y: 3, width: 100, height: 40 });
    expect(result.guides).toHaveLength(0);
  });

  it("always returns whole pixels", () => {
    const result = snap({ x: 300.4, y: 400.6, width: 100, height: 40 }, context());

    expect(Number.isInteger(result.box.x)).toBe(true);
    expect(Number.isInteger(result.box.y)).toBe(true);
  });
});
