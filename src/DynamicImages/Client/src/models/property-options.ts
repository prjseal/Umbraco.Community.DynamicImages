import type { DiProperty } from "../api/types.js";

/** An option for `uui-select`, whose `group` renders as an `<optgroup>`. */
export interface PropertyOption {
  name: string;
  value: string;
  group?: string;
  selected?: boolean;
}

/** The group the system pseudo-properties (Name, Publish date, Last updated, Reading time) sit under. */
export const PAGE_GROUP = "Page";

/**
 * The label a property's option group carries: "Tab › Group", or just the group when it is on no
 * tab. `<optgroup>` cannot nest, so the two levels share one label.
 */
export function groupLabel(property: DiProperty): string {
  if (property.isSystem) return PAGE_GROUP;
  return property.tab ? `${property.tab} › ${property.group}` : property.group;
}

const order = (value: number | undefined): number => value ?? Number.MAX_SAFE_INTEGER;

/**
 * Properties in the order the Document Type editor shows them: the system ones first, then by
 * tab, group and property sort order. The server's own order (by group name, then property name)
 * is left alone for the palette; only the dropdown re-sorts. Stable, so properties from an older
 * server without sort orders keep the order they came in.
 */
export function sortProperties(properties: readonly DiProperty[]): DiProperty[] {
  return properties
    .map((property, index) => ({ property, index }))
    .sort((a, b) =>
      Number(b.property.isSystem) - Number(a.property.isSystem)
      || order(a.property.tabSortOrder) - order(b.property.tabSortOrder)
      || order(a.property.groupSortOrder) - order(b.property.groupSortOrder)
      || order(a.property.sortOrder) - order(b.property.sortOrder)
      || a.index - b.index)
    .map(({ property }) => property);
}

/**
 * The options for one property dropdown: grouped, in document type order, labelled by name.
 *
 * `- none -` and a stored alias that is not in the list are ungrouped, which `uui-select` renders
 * after its groups. The stale alias still has to render as a selected option: a `uui-select`
 * whose value is not among its options shows blank, and the next change event writes that blank
 * straight back over the binding - so an alias the palette has not loaded would destroy itself
 * just by being looked at.
 */
export function propertyOptions(properties: readonly DiProperty[], value: string): PropertyOption[] {
  const options: PropertyOption[] = sortProperties(properties).map((property) => ({
    name: property.name,
    value: property.alias,
    group: groupLabel(property),
    selected: property.alias === value,
  }));

  options.push({ name: "- none -", value: "", selected: !value });

  if (value && !properties.some((property) => property.alias === value)) {
    options.push({ name: `${value} (not in this list)`, value, selected: true });
  }

  return options;
}

/**
 * The caption over a hop after the first: "Property on the linked Author", "…linked Author or
 * Company" when the reference can point at several types, and "…linked item" when nothing could
 * narrow it down.
 */
export function linkedCaption(targetNames: readonly string[], inference?: string): string {
  if (inference === "all" || targetNames.length === 0) return "Property on the linked item";
  return `Property on the linked ${targetNames.join(" or ")}`;
}
