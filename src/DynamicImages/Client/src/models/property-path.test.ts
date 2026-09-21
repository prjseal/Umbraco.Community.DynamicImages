import { describe, expect, it } from "vitest";
import { hopCount, isPath, joinPath, MAX_HOPS, splitPath } from "./property-path.js";

describe("splitPath", () => {
  it("leaves a bare alias as the root with no tail", () => {
    expect(splitPath("title")).toEqual({ root: "title", tail: "" });
  });

  it("splits a two-segment path", () => {
    expect(splitPath("author.mainImage")).toEqual({ root: "author", tail: "mainImage" });
  });

  it("keeps the whole remainder in the tail", () => {
    // The correct decode for a two-dropdown UI: a three-segment path survives a round trip
    // through the inspector rather than being flattened the moment the layer opens.
    expect(splitPath("a.b.c")).toEqual({ root: "a", tail: "b.c" });
  });

  it("drops empty segments", () => {
    expect(splitPath("author.")).toEqual({ root: "author", tail: "" });
    expect(splitPath(".author")).toEqual({ root: "author", tail: "" });
    expect(splitPath("author..mainImage")).toEqual({ root: "author", tail: "mainImage" });
  });

  it("trims whitespace around each segment", () => {
    expect(splitPath(" author . mainImage ")).toEqual({ root: "author", tail: "mainImage" });
  });

  it("is empty for nothing", () => {
    expect(splitPath("")).toEqual({ root: "", tail: "" });
    expect(splitPath(null)).toEqual({ root: "", tail: "" });
    expect(splitPath(undefined)).toEqual({ root: "", tail: "" });
  });
});

describe("joinPath", () => {
  it("joins a root and a tail", () => {
    expect(joinPath("author", "mainImage")).toBe("author.mainImage");
  });

  it("gives the bare root for an empty tail", () => {
    expect(joinPath("author", "")).toBe("author");
    expect(joinPath("author", null)).toBe("author");
    expect(joinPath("author", undefined)).toBe("author");
  });

  it("gives nothing without a root", () => {
    expect(joinPath("", "mainImage")).toBe("");
  });

  it("keeps a multi-segment tail whole", () => {
    expect(joinPath("a", "b.c")).toBe("a.b.c");
  });
});

describe("round trips", () => {
  it.each(["title", "author.mainImage", "a.b.c", "a.b.c.d"])("survives %s", (alias) => {
    const { root, tail } = splitPath(alias);
    expect(joinPath(root, tail)).toBe(alias);
  });
});

describe("isPath and hopCount", () => {
  it("counts the references an alias follows", () => {
    expect(hopCount("title")).toBe(0);
    expect(hopCount("author.mainImage")).toBe(1);
    expect(hopCount("a.b.c.d")).toBe(MAX_HOPS);
    expect(hopCount("a.b.c.d.e")).toBe(MAX_HOPS + 1);
    expect(hopCount("")).toBe(0);
  });

  it("is a path only when something is followed", () => {
    expect(isPath("author.mainImage")).toBe(true);
    expect(isPath("title")).toBe(false);
    expect(isPath("author.")).toBe(false);
    expect(isPath(null)).toBe(false);
  });
});
