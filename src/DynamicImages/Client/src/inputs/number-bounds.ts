/**
 * The numeric contract for the inspector's fields: what each one accepts, in one place.
 *
 * It lives here rather than inline on each `<di-number-field>` so that the guard test can assert
 * against the same table the elements read from, instead of restating the numbers and drifting.
 */

import {
  MAX_INNER_RATIO, MAX_SIDES, MIN_INNER_RATIO, MIN_SIDES,
} from "../models/shape-geometry.js";

export interface NumberBounds {
  min: number;
  max: number;
}

/**
 * Bounds by field. Names are the field's role, not its label, because several labels repeat
 * (three different "Width"s) and several roles share a label.
 *
 * `rotation` is deliberately absent: it normalises at the call site rather than clamping, because
 * wrapping 999 to -81 is the correct behaviour for an angle and `rotation-fixtures.json` already
 * pins it. See di-layer-inspector's Rotation field.
 */
export const INSPECTOR_BOUNDS = {
  /** Font size, in points. Beyond 800 the renderer is being asked for a poster, not an OG image. */
  fontSize: { min: 1, max: 800 },
  /** Position. Negative is legitimate - a layer can be deliberately bled off the canvas edge. */
  x: { min: -5000, max: 5000 },
  y: { min: -5000, max: 5000 },
  /** Any box dimension. Zero is not a size; "auto" is expressed by clearing the field, not by 0. */
  width: { min: 1, max: 5000 },
  height: { min: 1, max: 5000 },
  /** A multiple of the font size. Below 0.5 the lines overlap. */
  lineSpacing: { min: 0.5, max: 4 },
  /** Tracking, in the same units the renderer uses. Negative tightens. */
  letterSpacing: { min: -20, max: 100 },
  maxLines: { min: 1, max: 20 },
  /** The family of non-negative lengths: radii, gaps and the badge sub-sizes. */
  cornerRadius: { min: 0, max: 2000 },
  gap: { min: 0, max: 2000 },
  rowGap: { min: 0, max: 2000 },
  circleSize: { min: 0, max: 2000 },
  iconSize: { min: 0, max: 2000 },
  labelSize: { min: 0, max: 2000 },
  labelGap: { min: 0, max: 2000 },
  /** A stroke on a rect or a badge. 0 means "no border", which the inspector reads as null. */
  borderWidth: { min: 0, max: 200 },
  /**
   * The gap between a layer and the one it is positioned against. Unlike the badge gaps this one
   * may be negative: overlapping the reference layer is a legitimate design.
   */
  referenceGap: { min: -2000, max: 2000 },
  /** How many badges to draw before giving up. */
  maxItems: { min: 1, max: 50 },
  /** A gradient's direction. A full turn, and unlike rotation there is nothing to wrap onto. */
  gradientAngle: { min: 0, max: 360 },
  /** Opacity is a fraction, and always was bounded - it just was not enforced. */
  opacity: { min: 0, max: 1 },
  /**
   * These two are not a UI preference: they are the polygon/star geometry contract, shared with
   * the server and already clamped by `clampSides` / `clampInnerRatio`. Re-exported through the
   * table so the inspector still reads every bound from one place.
   */
  sides: { min: MIN_SIDES, max: MAX_SIDES },
  innerRatio: { min: MIN_INNER_RATIO, max: MAX_INNER_RATIO },
} as const satisfies Record<string, NumberBounds>;

export type InspectorBoundsKey = keyof typeof INSPECTOR_BOUNDS;

/**
 * What the canvas will zoom to, as a fraction. 10% still shows a poster-sized canvas whole; past
 * 400% a 1200px design is bigger than any screen it would be reviewed on.
 *
 * It lives beside the inspector's table for the same reason that one exists: the clamp was written
 * out inline in the design view, the toolbar's typed percentage would have been a second copy, and
 * two copies of a bound drift. The toolbar reads it as percent, hence the x100 at that call site.
 */
export const ZOOM_BOUNDS = { min: 0.1, max: 4 } as const satisfies NumberBounds;

/**
 * What a `<di-number-field>` should report for what was typed into it.
 *
 * - `""` clears the field, which is a real setting ("as big as the content needs"), so `null`.
 * - Anything unparseable returns `undefined`, meaning *keep the value you already had*. Typing
 *   "abc" must not blank a layer's width.
 * - Anything else is clamped into range.
 */
export function clampNumber(raw: string | number, min?: number, max?: number): number | null | undefined {
  if (typeof raw === "string" && raw.trim() === "") return null;

  const value = Number(raw);
  if (!Number.isFinite(value)) return undefined;

  let clamped = value;
  if (min !== undefined) clamped = Math.max(min, clamped);
  if (max !== undefined) clamped = Math.min(max, clamped);

  return clamped;
}
