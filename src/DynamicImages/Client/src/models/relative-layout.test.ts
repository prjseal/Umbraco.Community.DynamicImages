import { describe, expect, it } from "vitest";
import type { DiPosition } from "../api/types.js";
import { anchorToTopLeft, type Box } from "./anchor.js";
import { detach, indexLayers, isOnCycle, isTracked, resolveAll, resolvePosition, type Positioned } from "./relative-layout.js";
import fixtures from "./relative-layout-fixtures.json";

interface FixtureLayer {
  key: string;
  x: number;
  y: number;
  anchor: string;
  relativeX?: { layerKey: string; edge: string; gap: number };
  relativeY?: { layerKey: string; edge: string; gap: number };
}

const toPositioned = (layer: FixtureLayer): Positioned => ({
  key: layer.key,
  position: {
    x: layer.x,
    y: layer.y,
    anchor: layer.anchor as never,
    relativeX: (layer.relativeX as never) ?? null,
    relativeY: (layer.relativeY as never) ?? null,
  },
});

const position = (x: number, y: number, anchor: DiPosition["anchor"] = "topLeft", extra: Partial<DiPosition> = {}): DiPosition =>
  ({ x, y, anchor, ...extra });

/** The same fixture RelativeLayoutTests asserts against on the server. */
describe("resolvePosition", () => {
  for (const fixture of fixtures.cases) {
    it(fixture.name, () => {
      const layers = (fixture.layers as FixtureLayer[]).map(toPositioned);
      const layersByKey = indexLayers(layers);
      const bounds = fixture.bounds as Record<string, Box>;

      const resolved = resolvePosition(layersByKey.get(fixture.resolve)!, layersByKey, (key) => bounds[key]);

      expect(resolved.x, "x").toBeCloseTo(fixture.expected.x, 4);
      expect(resolved.y, "y").toBeCloseTo(fixture.expected.y, 4);
      expect(resolved.anchor, "anchor").toBe(fixture.expected.anchor);
    });
  }

  it("returns the position itself when nothing is tracked", () => {
    const layer = { key: "a", position: position(1, 2) };
    expect(resolvePosition(layer, indexLayers([layer]), () => undefined)).toBe(layer.position);
  });
});

describe("isOnCycle", () => {
  it("finds a cycle that crosses axes", () => {
    const a = { key: "a", position: position(0, 0, "topLeft", { relativeX: { layerKey: "b", edge: "rightOf", gap: 0 } }) };
    const b = { key: "b", position: position(0, 0, "topLeft", { relativeY: { layerKey: "a", edge: "below", gap: 0 } }) };
    const c = { key: "c", position: position(0, 0, "topLeft", { relativeY: { layerKey: "a", edge: "below", gap: 0 } }) };
    const index = indexLayers([a, b, c]);

    expect(isOnCycle("a", index)).toBe(true);
    expect(isOnCycle("b", index)).toBe(true);
    expect(isOnCycle("c", index)).toBe(false);
  });
});

describe("resolveAll", () => {
  interface TestLayer extends Positioned {
    visible: boolean;
    size: { width: number; height: number };
  }

  const layer = (key: string, pos: DiPosition, size = { width: 100, height: 40 }, visible = true): TestLayer =>
    ({ key, position: pos, size, visible });

  const run = (layers: TestLayer[], absentKeys: string[] = []) =>
    resolveAll(layers, (l) => l.size, (l) => !l.visible || absentKeys.includes(l.key));

  it("hangs a chain off the live resolved boxes", () => {
    const title = layer("title", position(60, 100), { width: 500, height: 60 });
    const subtitle = layer("subtitle", position(0, 0, "topLeft", { relativeY: { layerKey: "title", edge: "below", gap: 4 } }), { width: 500, height: 30 });
    const desc = layer("desc", position(60, 400, "topLeft", { relativeY: { layerKey: "subtitle", edge: "below", gap: 10 } }));

    // Order is deliberately reversed: the result must not depend on z-order.
    const resolved = run([desc, subtitle, title]);

    expect(resolved.get("subtitle")!.box.y).toBe(164);
    expect(resolved.get("desc")!.position).toEqual({ x: 60, y: 204, anchor: "topLeft" });
    expect(resolved.get("desc")!.box).toEqual({ x: 60, y: 204, width: 100, height: 40 });
  });

  it("skips an absent reference and keeps the tracker's own gap", () => {
    const title = layer("title", position(60, 100), { width: 500, height: 60 });
    const subtitle = layer("subtitle", position(0, 0, "topLeft", { relativeY: { layerKey: "title", edge: "below", gap: 4 } }));
    const desc = layer("desc", position(60, 400, "topLeft", { relativeY: { layerKey: "subtitle", edge: "below", gap: 10 } }));

    expect(run([title, subtitle, desc], ["subtitle"]).get("desc")!.position.y).toBe(170);
    subtitle.visible = false;
    expect(run([title, subtitle, desc]).get("desc")!.position.y).toBe(170);
  });

  it("resolves a cycle as absolute and lets others track its members", () => {
    const a = layer("a", position(10, 20, "topLeft", { relativeY: { layerKey: "b", edge: "below", gap: 10 } }));
    const b = layer("b", position(30, 40, "topLeft", { relativeY: { layerKey: "a", edge: "below", gap: 10 } }));
    const c = layer("c", position(0, 0, "topLeft", { relativeY: { layerKey: "a", edge: "below", gap: 5 } }));

    const resolved = run([a, b, c]);

    expect(resolved.get("a")!.position).toEqual({ x: 10, y: 20, anchor: "topLeft" });
    expect(resolved.get("b")!.position).toEqual({ x: 30, y: 40, anchor: "topLeft" });
    expect(resolved.get("c")!.position.y).toBe(20 + 40 + 5);
  });

  it("forces the anchor on the tracked axis only", () => {
    const title = layer("title", position(60, 100), { width: 500, height: 60 });
    const tag = layer("tag", position(600, 0, "bottomCentre", { relativeY: { layerKey: "title", edge: "above", gap: 8 } }), { width: 80, height: 20 });

    const resolved = run([title, tag]).get("tag")!;

    expect(resolved.position).toEqual({ x: 600, y: 92, anchor: "bottomCentre" });
    expect(resolved.box).toEqual({ x: 560, y: 72, width: 80, height: 20 });
  });
});

describe("isTracked and detach", () => {
  const tracked = position(60, 400, "bottomCentre", {
    relativeY: { layerKey: "title", edge: "below", gap: 10 },
    relativeX: { layerKey: "title", edge: "rightOf", gap: 4 },
  });

  it("reports each axis separately", () => {
    expect(isTracked(tracked, "x")).toBe(true);
    expect(isTracked(tracked, "y")).toBe(true);
    expect(isTracked(position(0, 0), "x")).toBe(false);
    expect(isTracked({ ...tracked, relativeX: null }, "x")).toBe(false);
  });

  it("bakes the resolved coordinate and anchor component so the box stays still", () => {
    const resolved: DiPosition = { x: 576, y: 170, anchor: "topLeft" };
    const size = { width: 100, height: 40 };
    const before = anchorToTopLeft(resolved, size.width, size.height);

    const detachedY = detach(tracked, "y", resolved);
    expect(detachedY.relativeY).toBeNull();
    expect(detachedY.relativeX).toEqual(tracked.relativeX);
    expect(detachedY.y).toBe(170);
    // Y is now top (from the resolved anchor); X keeps the stored centre component.
    expect(detachedY.anchor).toBe("topCentre");

    const detachedBoth = detach(detachedY, "x", resolved);
    expect(detachedBoth).toEqual({ x: 576, y: 170, anchor: "topLeft", relativeX: null, relativeY: null });
    expect(anchorToTopLeft(detachedBoth, size.width, size.height)).toEqual(before);
  });

  it("falls back to the stored coordinate when nothing has been resolved yet", () => {
    const detached = detach(tracked, "y", undefined);

    expect(detached.relativeY).toBeNull();
    expect(detached.y).toBe(400);
    expect(detached.anchor).toBe("bottomCentre");
  });
});
