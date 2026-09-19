import type { Box } from "./anchor.js";

/**
 * The client half of the rotation contract. Every function here mirrors
 * Core/Rendering/RotationMath.cs exactly, and both are tested against the shared fixture in
 * rotation-fixtures.json. Degrees are clockwise-positive on the y-down canvas - the CSS
 * `rotate()` convention, which ImageSharp shares - so nothing flips a sign anywhere.
 */

/** The equivalent angle in (-180, 180], so 270 reads as -90 and 360 as 0. */
export function normalise(degrees: number): number {
  let result = degrees % 360;
  if (result > 180) result -= 360;
  else if (result <= -180) result += 360;
  // -0 would print as "-0" in an input; nobody means that.
  return result === 0 ? 0 : result;
}

/** The point turned `degrees` clockwise about the pivot: right of the pivot goes to below it. */
export function rotatePoint(
  px: number, py: number, pivotX: number, pivotY: number, degrees: number,
): { x: number; y: number } {
  if (degrees === 0) return { x: px, y: py };

  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = px - pivotX;
  const dy = py - pivotY;

  return { x: pivotX + dx * cos - dy * sin, y: pivotY + dx * sin + dy * cos };
}

/** The inverse of rotatePoint: a canvas point expressed in the layer's own unrotated frame. */
export function toLocal(
  px: number, py: number, pivotX: number, pivotY: number, degrees: number,
): { x: number; y: number } {
  return rotatePoint(px, py, pivotX, pivotY, -degrees);
}

/**
 * The axis-aligned box covering the rotated box's four corners - its footprint on the canvas.
 * An unrotated box comes back as it went in, so today's layouts pick up no float noise.
 */
export function extent(box: Box, pivotX: number, pivotY: number, degrees: number): Box {
  if (degrees === 0) return box;

  const corners = [
    rotatePoint(box.x, box.y, pivotX, pivotY, degrees),
    rotatePoint(box.x + box.width, box.y, pivotX, pivotY, degrees),
    rotatePoint(box.x + box.width, box.y + box.height, pivotX, pivotY, degrees),
    rotatePoint(box.x, box.y + box.height, pivotX, pivotY, degrees),
  ];

  const minX = Math.min(...corners.map((c) => c.x));
  const maxX = Math.max(...corners.map((c) => c.x));
  const minY = Math.min(...corners.map((c) => c.y));
  const maxY = Math.max(...corners.map((c) => c.y));

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
