import type { Anchor, DiPosition } from "../api/types.js";

/**
 * The client half of the anchor contract. Every function here mirrors
 * Core/Rendering/AnchorMath.cs exactly, and both are tested against the shared fixture in
 * anchor-fixtures.json - a drift between them means a layer sits in one place in the designer
 * and another in the render, which is the single most confusing thing this tool could do.
 */

export const ANCHORS: Anchor[] = [
  "topLeft", "topCentre", "topRight",
  "middleLeft", "middleCentre", "middleRight",
  "bottomLeft", "bottomCentre", "bottomRight",
];

/** 0 at the left edge, 0.5 centred, 1 at the right. */
export function axisX(anchor: Anchor): number {
  switch (anchor) {
    case "topLeft":
    case "middleLeft":
    case "bottomLeft":
      return 0;
    case "topCentre":
    case "middleCentre":
    case "bottomCentre":
      return 0.5;
    default:
      return 1;
  }
}

/** 0 at the top edge, 0.5 middle, 1 at the bottom. */
export function axisY(anchor: Anchor): number {
  switch (anchor) {
    case "topLeft":
    case "topCentre":
    case "topRight":
      return 0;
    case "middleLeft":
    case "middleCentre":
    case "middleRight":
      return 0.5;
    default:
      return 1;
  }
}

/**
 * The anchor whose factors these are - the inverse of axisX/axisY. Relative positioning forces
 * one axis to an edge and keeps the other, and this is how the two halves become an anchor again.
 */
export function composeAnchor(axisXFactor: number, axisYFactor: number): Anchor {
  const column = axisXFactor < 0.25 ? 0 : axisXFactor < 0.75 ? 1 : 2;
  const row = axisYFactor < 0.25 ? 0 : axisYFactor < 0.75 ? 1 : 2;

  return ANCHORS[row * 3 + column];
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The top-left corner of a box of this size anchored at this position. */
export function anchorToTopLeft(position: DiPosition, width: number, height: number): { x: number; y: number } {
  return {
    x: position.x - width * axisX(position.anchor),
    y: position.y - height * axisY(position.anchor),
  };
}

/** The inverse: where the anchor point of a box with this top-left corner sits. */
export function topLeftToAnchor(
  left: number, top: number, width: number, height: number, anchor: Anchor,
): { x: number; y: number } {
  return {
    x: left + width * axisX(anchor),
    y: top + height * axisY(anchor),
  };
}

/**
 * Re-expresses a position against a different anchor without moving the box, which is what the
 * inspector's anchor picker needs: changing the anchor should change what x/y *mean*, not where
 * the layer is.
 */
export function reanchor(position: DiPosition, width: number, height: number, anchor: Anchor): DiPosition {
  const topLeft = anchorToTopLeft(position, width, height);
  const moved = topLeftToAnchor(topLeft.x, topLeft.y, width, height, anchor);

  // Spread first: a position may also carry relative references, and they must survive.
  return { ...position, x: Math.round(moved.x), y: Math.round(moved.y), anchor };
}

/** The box a layer occupies, given the size the caller resolved for it. */
export function boxOf(position: DiPosition, width: number, height: number): Box {
  const topLeft = anchorToTopLeft(position, width, height);
  return { x: topLeft.x, y: topLeft.y, width, height };
}

/**
 * The position that puts a box's top-left corner here, keeping the current anchor and any
 * relative references the position carries.
 */
export function positionForTopLeft(box: Box, position: DiPosition): DiPosition {
  const moved = topLeftToAnchor(box.x, box.y, box.width, box.height, position.anchor);
  return { ...position, x: Math.round(moved.x), y: Math.round(moved.y) };
}
