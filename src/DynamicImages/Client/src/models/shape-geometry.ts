import type { ShapeKind } from "../api/types.js";

/**
 * The client half of the shape contract. `vertices` mirrors
 * Core/Rendering/Layers/ShapeGeometry.cs exactly, and both are tested against the shared fixture
 * in shape-fixtures.json - so the designer's clip path and the render's path are the same shape.
 * Rectangles and ellipses have no vertex list: they are primitives on both sides.
 */

export const MIN_SIDES = 3;
export const MAX_SIDES = 12;
export const MIN_INNER_RATIO = 0.1;
export const MAX_INNER_RATIO = 0.9;

export function clampSides(sides: number): number {
  return Math.max(MIN_SIDES, Math.min(MAX_SIDES, sides));
}

export function clampInnerRatio(innerRatio: number): number {
  return Math.max(MIN_INNER_RATIO, Math.min(MAX_INNER_RATIO, innerRatio));
}

/**
 * Points in the unit square around the centre (0.5, 0.5) at radius 0.5. A polygon's point i sits
 * at -90° + i·360°/n (the first at the top); a star has 2n points at -90° + i·180°/n, alternating
 * the outer radius and the inner one. Scaled to the layer's box, a polygon fills a non-square box
 * by stretching, as CSS `clip-path: polygon(%)` does.
 */
export function vertices(kind: ShapeKind, sides: number, innerRatio: number): { x: number; y: number }[] {
  if (kind !== "polygon" && kind !== "star") return [];

  const n = clampSides(sides);
  const inner = 0.5 * clampInnerRatio(innerRatio);
  const count = kind === "star" ? n * 2 : n;
  const step = kind === "star" ? 180 / n : 360 / n;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < count; i++) {
    const radians = ((-90 + i * step) * Math.PI) / 180;
    const radius = kind === "star" && i % 2 === 1 ? inner : 0.5;
    points.push({ x: 0.5 + radius * Math.cos(radians), y: 0.5 + radius * Math.sin(radians) });
  }

  return points;
}

/** The CSS `clip-path` for a polygon or star, in percentages so it scales with its box. */
export function clipPathFor(kind: ShapeKind, sides: number, innerRatio: number): string | undefined {
  const points = vertices(kind, sides, innerRatio);
  if (points.length === 0) return undefined;

  return `polygon(${points.map((p) => `${(p.x * 100).toFixed(3)}% ${(p.y * 100).toFixed(3)}%`).join(", ")})`;
}
