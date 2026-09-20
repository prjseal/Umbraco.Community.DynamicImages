import type { DiGradient } from "../api/types.js";

/**
 * The CSS the designer paints a gradient with. It is deliberately the *same* convention the
 * server renders with - `180deg` is top to bottom, and `ellipse farthest-corner` is the ellipse
 * whose semi-axes `GradientGeometry.RadialSemiAxes` computes - so the artboard and the real
 * preview agree. One builder, so the canvas's stage and a shape layer's box cannot drift.
 */
export function gradientCss(gradient: DiGradient): string {
  if (gradient.kind === "radial") {
    const x = Math.round(clamp01(gradient.centreX ?? 0.5) * 100);
    const y = Math.round(clamp01(gradient.centreY ?? 0.5) * 100);
    return `radial-gradient(ellipse farthest-corner at ${x}% ${y}%, ${gradient.from}, ${gradient.to})`;
  }

  return `linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to})`;
}

/** The renderer clamps a centre to the box; the preview has to clamp it the same way. */
export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
