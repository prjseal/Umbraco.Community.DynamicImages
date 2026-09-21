/**
 * A binding's `propertyAlias` may be a dotted path - `author.mainImage` - which follows the
 * content reference in its first segment and reads the last segment on the node it lands on.
 *
 * This is the client's half of `Core/Rendering/PropertyPath.cs`, kept deliberately small: it only
 * has to split a stored alias into the two dropdowns the inspector shows and put it back together.
 * The server is what actually resolves a path.
 */

/** How many content references a path may follow. Mirrors `PropertyPath.MaxHops`. */
export const MAX_HOPS = 3;

/** Whether an alias names a property on a linked node rather than on this one. */
export const isPath = (alias: string | null | undefined): boolean => hopCount(alias) > 0;

/** How many references an alias follows. */
export const hopCount = (alias: string | null | undefined): number => Math.max(0, segmentsOf(alias).length - 1);

/**
 * Splits a stored alias into the root property and everything after it.
 *
 * The whole remainder stays in the tail - `splitPath("a.b.c")` gives `{ root: "a", tail: "b.c" }`.
 * That is the correct decode for a two-dropdown UI: a three-segment path typed by hand or imported
 * from JSON then survives a round trip through the inspector untouched, rather than being
 * flattened to two segments the moment the editor opens the layer.
 */
export function splitPath(alias: string | null | undefined): { root: string; tail: string } {
  const segments = segmentsOf(alias);

  return { root: segments[0] ?? "", tail: segments.slice(1).join(".") };
}

/** Puts a root and a tail back together. An empty tail gives the bare root. */
export function joinPath(root: string, tail: string | null | undefined): string {
  const trimmedRoot = (root ?? "").trim();
  const trimmedTail = (tail ?? "").trim();

  if (!trimmedRoot) return "";

  return trimmedTail ? `${trimmedRoot}.${trimmedTail}` : trimmedRoot;
}

/** Empty segments are dropped, so `"author."` degrades to the bare alias - defensive, not a feature. */
const segmentsOf = (alias: string | null | undefined): string[] =>
  (alias ?? "")
    .split(".")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
