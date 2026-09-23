import { describe, expect, it } from "vitest";
import type { DiProperty } from "../api/types.js";
import { groupLabel, linkedCaption, propertyOptions, sortProperties } from "./property-options.js";

const property = (alias: string, overrides: Partial<DiProperty> = {}): DiProperty => ({
  alias,
  name: alias[0].toUpperCase() + alias.slice(1),
  group: "Content",
  editorAlias: "Umbraco.TextBox",
  classification: "text",
  isSystem: false,
  ...overrides,
});

const FIXTURE: DiProperty[] = [
  // The server's order: by group name, then property name.
  property("metaTitle", { group: "Meta", tab: "SEO", tabSortOrder: 2, groupSortOrder: 0, sortOrder: 1 }),
  property("subtitle", { group: "Hero", tab: "Content", tabSortOrder: 1, groupSortOrder: 0, sortOrder: 2 }),
  property("title", { group: "Hero", tab: "Content", tabSortOrder: 1, groupSortOrder: 0, sortOrder: 1 }),
  property("bodyText", { group: "Body", tab: "Content", tabSortOrder: 1, groupSortOrder: 1, sortOrder: 0 }),
  property("name", { group: "Node", isSystem: true }),
  property("readingTime", { group: "Node", isSystem: true }),
  property("loose", { group: "Details", tab: null, tabSortOrder: -1, groupSortOrder: 4, sortOrder: 0 }),
];

describe("property options", () => {
  it("orders the system properties first, then tab, group and property sort order", () => {
    expect(sortProperties(FIXTURE).map((p) => p.alias)).toEqual([
      "name", "readingTime", "loose", "title", "subtitle", "bodyText", "metaTitle",
    ]);
  });

  it("labels a group with its tab, a tabless group alone, and the system ones as Page", () => {
    expect(groupLabel(FIXTURE[0])).toBe("SEO › Meta");
    expect(groupLabel(FIXTURE[6])).toBe("Details");
    expect(groupLabel(FIXTURE[4])).toBe("Page");
  });

  it("groups the options in document type order, labelled by name", () => {
    const options = propertyOptions(FIXTURE, "title");

    expect(options.map((o) => o.group).filter((g, i, all) => g && all.indexOf(g) === i)).toEqual([
      "Page", "Details", "Content › Hero", "Content › Body", "SEO › Meta",
    ]);
    expect(options.find((o) => o.value === "title")).toMatchObject({ name: "Title", selected: true });
  });

  it("keeps none and a stale alias as ungrouped options", () => {
    const options = propertyOptions(FIXTURE, "goneAway");

    expect(options.find((o) => o.value === "")?.group).toBeUndefined();
    expect(options.at(-1)).toMatchObject({ value: "goneAway", selected: true });
    expect(options.at(-1)?.group).toBeUndefined();
  });

  it("keeps the order of properties from a server without sort orders", () => {
    const legacy = [property("b"), property("a"), property("c")];

    expect(sortProperties(legacy).map((p) => p.alias)).toEqual(["b", "a", "c"]);
  });

  it("captions a hop by what the reference points at", () => {
    expect(linkedCaption(["Author"], "filter")).toBe("Property on the linked Author");
    expect(linkedCaption(["Author", "Company"], "sampled")).toBe("Property on the linked Author or Company");
    expect(linkedCaption(["Author", "Company"], "all")).toBe("Property on the linked item");
  });
});
