import type { DiPosition, DiRelativeReference, RelativeEdge } from "../api/types.js";
import { anchorToTopLeft, axisX, axisY, composeAnchor, type Box } from "./anchor.js";

/**
 * The client half of relative positioning. `resolvePosition` mirrors
 * Core/Rendering/RelativeLayout.cs exactly, and both are tested against the shared fixture in
 * relative-layout-fixtures.json:
 *
 * - A tracked axis becomes an edge coordinate with the anchor forced on that axis (below = top
 *   edge at the reference's bottom + gap, above = bottom edge at its top - gap, rightOf = left
 *   edge at its right + gap, leftOf = right edge at its left - gap). The other axis keeps the
 *   layer's own coordinate and anchor component.
 * - A reference that drew nothing is skipped and the chain moves on to whatever that layer
 *   tracks on the same axis, keeping this layer's own gap. Nothing left: the layer's own coordinate.
 * - A layer on a reference cycle is absolute on both axes.
 * - An edge on the wrong axis, or a reference to a missing layer, leaves the axis absolute.
 */

export type Axis = "x" | "y";

/** Just what the resolver needs of a layer, so tests need not build whole layers. */
export interface Positioned {
  key: string;
  position: DiPosition;
}

export interface Size {
  width: number;
  height: number;
}

/** A layer's position once its references are resolved, plus the box it occupies. */
export interface ResolvedLayer {
  position: DiPosition;
  box: Box;
}

export const DEFAULT_RELATIVE_GAP = 10;

export function isTracked(position: DiPosition, axis: Axis): boolean {
  return axis === "x" ? !!position.relativeX : !!position.relativeY;
}

export function isRelative(position: DiPosition): boolean {
  return !!position.relativeX || !!position.relativeY;
}

export function referenceOn(position: DiPosition, axis: Axis): DiRelativeReference | null | undefined {
  return axis === "x" ? position.relativeX : position.relativeY;
}

function isVerticalEdge(edge: RelativeEdge): boolean {
  return edge === "below" || edge === "above";
}

function references(position: DiPosition): DiRelativeReference[] {
  const result: DiRelativeReference[] = [];
  if (position.relativeX) result.push(position.relativeX);
  if (position.relativeY) result.push(position.relativeY);
  return result;
}

/** Layers by key, first occurrence winning, matching the server's index. */
export function indexLayers<T extends Positioned>(layers: readonly T[]): Map<string, T> {
  const index = new Map<string, T>();
  for (const layer of layers) {
    if (!index.has(layer.key)) index.set(layer.key, layer);
  }
  return index;
}

/** Whether following references out of this layer, on either axis, leads back to it. */
export function isOnCycle(key: string, layersByKey: ReadonlyMap<string, Positioned>): boolean {
  const start = layersByKey.get(key);
  if (!start) return false;

  const visited = new Set<string>();
  const pending = references(start.position).map((reference) => reference.layerKey);

  while (pending.length > 0) {
    const current = pending.pop()!;
    if (current === key) return true;
    if (visited.has(current)) continue;
    visited.add(current);

    const layer = layersByKey.get(current);
    if (layer) pending.push(...references(layer.position).map((reference) => reference.layerKey));
  }

  return false;
}

/**
 * The absolute position of a layer given where its references landed. `boundsOf` returns
 * undefined for a layer that drew nothing, which sends the chain on to the next reference.
 */
export function resolvePosition(
  layer: Positioned,
  layersByKey: ReadonlyMap<string, Positioned>,
  boundsOf: (key: string) => Box | undefined,
): DiPosition {
  const position = layer.position;
  if (!isRelative(position)) return position;

  // A layer on a cycle has no well-defined answer, so it keeps its own coordinates on both axes.
  if (isOnCycle(layer.key, layersByKey)) {
    return { x: position.x, y: position.y, anchor: position.anchor };
  }

  let x = position.x;
  let y = position.y;
  let factorX = axisX(position.anchor);
  let factorY = axisY(position.anchor);

  const horizontal = resolveAxis(layer, position.relativeX, false, layersByKey, boundsOf);
  if (horizontal) {
    x = horizontal.coordinate;
    factorX = horizontal.factor;
  }

  const vertical = resolveAxis(layer, position.relativeY, true, layersByKey, boundsOf);
  if (vertical) {
    y = vertical.coordinate;
    factorY = vertical.factor;
  }

  return { x, y, anchor: composeAnchor(factorX, factorY) };
}

function resolveAxis(
  layer: Positioned,
  reference: DiRelativeReference | null | undefined,
  vertical: boolean,
  layersByKey: ReadonlyMap<string, Positioned>,
  boundsOf: (key: string) => Box | undefined,
): { coordinate: number; factor: number } | undefined {
  if (!reference || isVerticalEdge(reference.edge) !== vertical) return undefined;

  const visited = new Set<string>([layer.key]);
  let current = reference.layerKey;

  while (!visited.has(current)) {
    visited.add(current);

    const target = layersByKey.get(current);
    if (!target) return undefined;

    const bounds = boundsOf(current);
    if (bounds) {
      // The gap is always this layer's own, however far up the chain the answer came from.
      switch (reference.edge) {
        case "below":
          return { coordinate: bounds.y + bounds.height + reference.gap, factor: 0 };
        case "above":
          return { coordinate: bounds.y - reference.gap, factor: 1 };
        case "rightOf":
          return { coordinate: bounds.x + bounds.width + reference.gap, factor: 0 };
        default:
          return { coordinate: bounds.x - reference.gap, factor: 1 };
      }
    }

    // The reference drew nothing: track whatever it tracks on this axis instead.
    const next = vertical ? target.position.relativeY : target.position.relativeX;
    if (!next || isVerticalEdge(next.edge) !== vertical) return undefined;
    current = next.layerKey;
  }

  return undefined;
}

/**
 * Resolves every layer at once, for the designer. A reference's box is its own resolved position
 * plus its size; `isAbsent` says which layers draw nothing (hidden, or the server measured the
 * layout and reported no bounds for them), which is what sends a tracker up the chain before
 * the server has had its say.
 */
export function resolveAll<T extends Positioned>(
  layers: readonly T[],
  sizeOf: (layer: T) => Size,
  isAbsent: (layer: T) => boolean,
): Map<string, ResolvedLayer> {
  const layersByKey = indexLayers(layers);
  const resolved = new Map<string, ResolvedLayer>();
  const inProgress = new Set<string>();

  const resolve = (layer: T): ResolvedLayer => {
    const done = resolved.get(layer.key);
    if (done) return done;

    let position: DiPosition;

    if (inProgress.has(layer.key)) {
      // Cannot happen once cycles resolve as absolute, but a guard beats a stack overflow.
      position = { x: layer.position.x, y: layer.position.y, anchor: layer.position.anchor };
    } else {
      inProgress.add(layer.key);
      position = resolvePosition(layer, layersByKey, (key) => {
        const reference = layersByKey.get(key);
        return reference && !isAbsent(reference) ? resolve(reference).box : undefined;
      });
      inProgress.delete(layer.key);
    }

    const size = sizeOf(layer);
    const topLeft = anchorToTopLeft(position, size.width, size.height);
    const entry = { position, box: { x: topLeft.x, y: topLeft.y, width: size.width, height: size.height } };

    resolved.set(layer.key, entry);
    return entry;
  };

  for (const layer of layers) resolve(layer);

  return resolved;
}

/**
 * Removes the link on one axis, baking the resolved coordinate and anchor component into the
 * position so the layer stays exactly where it was. Without a resolved position (nothing has
 * been laid out yet) the stored fallback coordinate is all there is.
 */
export function detach(position: DiPosition, axis: Axis, resolved: DiPosition | undefined): DiPosition {
  if (axis === "x") {
    return {
      ...position,
      relativeX: null,
      x: resolved ? Math.round(resolved.x) : position.x,
      anchor: resolved ? composeAnchor(axisX(resolved.anchor), axisY(position.anchor)) : position.anchor,
    };
  }

  return {
    ...position,
    relativeY: null,
    y: resolved ? Math.round(resolved.y) : position.y,
    anchor: resolved ? composeAnchor(axisX(position.anchor), axisY(resolved.anchor)) : position.anchor,
  };
}
