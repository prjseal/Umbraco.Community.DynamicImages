import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * A1 as a class of bug rather than one instance.
 *
 * The "Server preview" button emitted `di-request-preview` and nothing anywhere listened for it,
 * so the primary toolbar carried a control that did nothing. The only way to find that was to
 * attach a window-level listener and watch the event bubble past every component untouched.
 *
 * This costs the same as testing that one button and catches the next dead control for free:
 * every `di-*` event name this client emits must have at least one listener bound somewhere.
 */

const SRC = fileURLToPath(new URL(".", import.meta.url));

/**
 * `di-*` strings that name something other than an event. Custom element tag names are excluded
 * automatically by reading `@customElement(...)`; these are the ones that are neither.
 */
const NOT_EVENTS = new Set([
  // The workspace's entity type, as returned by getEntityType().
  "di-template",
]);

function sourceFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...sourceFiles(path));
      continue;
    }

    // Specs are not production source: a name only a test mentions is not a shipped contract.
    if (!entry.name.endsWith(".ts")) continue;
    if (entry.name.endsWith(".test.ts")) continue;
    if (path.includes(`${join("src", "testing")}`) || directory.endsWith("testing")) continue;

    files.push(path);
  }

  return files;
}

const sources = sourceFiles(SRC).map((path) => ({ path, text: readFileSync(path, "utf8") }));

function collect(pattern: RegExp): Map<string, string[]> {
  const found = new Map<string, string[]>();

  for (const { path, text } of sources) {
    for (const match of text.matchAll(pattern)) {
      const name = match[1];
      found.set(name, [...(found.get(name) ?? []), path]);
    }
  }

  return found;
}

/** Every custom element this client defines, so a tag name is never mistaken for an event. */
const tagNames = new Set(collect(/@customElement\("(di-[a-z0-9-]+)"\)/g).keys());

/**
 * Any `di-…` string literal that is not a tag name. Deliberately broader than
 * `new CustomEvent("…")`: di-canvas-toolbar passes its toggle event names into a shared
 * `#renderToggle(label, active, event)` helper, so a pattern matching only the dispatch site
 * would miss four real events and quietly stop guarding them.
 */
const emitted = new Map(
  [...collect(/"(di-[a-z0-9-]+)"/g)].filter(([name]) => !tagNames.has(name) && !NOT_EVENTS.has(name)),
);

/** Lit template bindings, plus anything listening imperatively. */
const listened = new Set([
  ...collect(/@(di-[a-z0-9-]+)=/g).keys(),
  ...collect(/addEventListener\(\s*"(di-[a-z0-9-]+)"/g).keys(),
]);

describe("di-* event contract", () => {
  it("finds events at all, so a passing run means something", () => {
    expect(tagNames.size).toBeGreaterThan(5);
    expect(emitted.size).toBeGreaterThan(15);
    expect(listened.size).toBeGreaterThan(15);
  });

  it("every emitted event has a listener", () => {
    const dead = [...emitted]
      .filter(([name]) => !listened.has(name))
      .map(([name, paths]) => `${name} (emitted in ${paths.map((p) => p.replace(SRC, "")).join(", ")})`);

    expect(dead, "these events are dispatched and nothing listens for them").toEqual([]);
  });
});
