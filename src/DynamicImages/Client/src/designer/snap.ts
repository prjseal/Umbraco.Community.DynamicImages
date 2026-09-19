import type { Box } from "../models/anchor.js";

export interface Guide {
  orientation: "vertical" | "horizontal";
  /** Position along the perpendicular axis, in image pixels. */
  at: number;
  /** What the guide lined up with, for the label shown beside it. */
  label: string;
}

export interface SnapResult {
  box: Box;
  guides: Guide[];
}

export interface SnapContext {
  canvasWidth: number;
  canvasHeight: number;
  /** Every other layer's box. The moving layer must not be in here or it snaps to itself. */
  others: Box[];
  /** In image pixels. The caller divides the screen threshold by the zoom so it feels constant. */
  threshold: number;
  /** An axis that tracks another layer: it neither moves nor produces a guide. */
  lockX?: boolean;
  lockY?: boolean;
}

interface Candidate {
  at: number;
  label: string;
}

/**
 * Nudges a box onto the nearest alignment, independently in x and y. Candidates are the canvas
 * edges and centre plus every other layer's edges and centre. Pure, and unit-tested - the
 * designer's feel lives or dies on this behaving predictably.
 */
export function snap(box: Box, context: SnapContext): SnapResult {
  const guides: Guide[] = [];

  const x = context.lockX
    ? undefined
    : snapAxis(
        [
          { value: box.x, offset: 0 },
          { value: box.x + box.width / 2, offset: box.width / 2 },
          { value: box.x + box.width, offset: box.width },
        ],
        verticalCandidates(context),
        context.threshold,
      );

  const y = context.lockY
    ? undefined
    : snapAxis(
        [
          { value: box.y, offset: 0 },
          { value: box.y + box.height / 2, offset: box.height / 2 },
          { value: box.y + box.height, offset: box.height },
        ],
        horizontalCandidates(context),
        context.threshold,
      );

  if (x) guides.push({ orientation: "vertical", at: x.at, label: x.label });
  if (y) guides.push({ orientation: "horizontal", at: y.at, label: y.label });

  return {
    box: {
      ...box,
      x: context.lockX ? box.x : x ? Math.round(x.at - x.offset) : Math.round(box.x),
      y: context.lockY ? box.y : y ? Math.round(y.at - y.offset) : Math.round(box.y),
    },
    guides,
  };
}

function verticalCandidates(context: SnapContext): Candidate[] {
  const candidates: Candidate[] = [
    { at: 0, label: "Left edge" },
    { at: context.canvasWidth / 2, label: "Centre" },
    { at: context.canvasWidth, label: "Right edge" },
  ];

  for (const other of context.others) {
    candidates.push(
      { at: other.x, label: "Layer left" },
      { at: other.x + other.width / 2, label: "Layer centre" },
      { at: other.x + other.width, label: "Layer right" },
    );
  }

  return candidates;
}

function horizontalCandidates(context: SnapContext): Candidate[] {
  const candidates: Candidate[] = [
    { at: 0, label: "Top edge" },
    { at: context.canvasHeight / 2, label: "Middle" },
    { at: context.canvasHeight, label: "Bottom edge" },
  ];

  for (const other of context.others) {
    candidates.push(
      { at: other.y, label: "Layer top" },
      { at: other.y + other.height / 2, label: "Layer middle" },
      { at: other.y + other.height, label: "Layer bottom" },
    );
  }

  return candidates;
}

/**
 * Finds the closest candidate to any of the box's own edges, within the threshold. Returning the
 * offset as well as the candidate is what lets the caller move the box by its *matching* edge
 * rather than always by its left/top.
 */
function snapAxis(
  edges: { value: number; offset: number }[],
  candidates: Candidate[],
  threshold: number,
): { at: number; offset: number; label: string } | undefined {
  let best: { at: number; offset: number; label: string; distance: number } | undefined;

  for (const edge of edges) {
    for (const candidate of candidates) {
      const distance = Math.abs(candidate.at - edge.value);
      if (distance > threshold) continue;

      // Ties go to the earlier edge, so the left/top edge wins over the centre at equal distance -
      // which is what an editor dragging towards a margin expects.
      if (!best || distance < best.distance) {
        best = { at: candidate.at, offset: edge.offset, label: candidate.label, distance };
      }
    }
  }

  return best;
}
