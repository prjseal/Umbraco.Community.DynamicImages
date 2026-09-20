import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The two icon defects found in manual testing were the same class of bug as A1: a name typed from
 * memory that the backoffice's registry does not have. `icon-eye-off` in the layers panel is in no
 * registry under any name, so that button rendered blank.
 *
 * `event-contract.test.ts` already solves the analogous problem for `di-*` event names by scraping
 * source text and asserting a contract; this mirrors it for `icon-*` names.
 *
 * What this can and cannot do: it catches a name that does not *exist*. It cannot catch
 * `icon-remove`, which exists and draws a wastebasket - the wrong picture is pinned by the icon-name
 * assertion in `designer/zoom-controls.browser.test.ts` instead.
 *
 * The registry is read as *text* and regexed rather than imported, for the same reason
 * `event-contract.test.ts` scrapes source: importing it into the node project would drag in
 * custom-element side effects that have no DOM to register against.
 */

const SRC = fileURLToPath(new URL(".", import.meta.url));

const REGISTRY = fileURLToPath(
  new URL(
    "../node_modules/@umbraco-cms/backoffice/dist-cms/packages/core/icon-registry/icons.js",
    import.meta.url,
  ),
);

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

/** Every `icon-*` string literal in production source, and where each one is used. */
const used = new Map<string, string[]>();

for (const { path, text } of sources) {
  for (const match of text.matchAll(/"(icon-[a-z0-9-]+)"/g)) {
    const name = match[1];
    used.set(name, [...(used.get(name) ?? []), path]);
  }
}

/** Every name the backoffice's icon registry actually registers. */
const registered = new Set(
  [...readFileSync(REGISTRY, "utf8").matchAll(/name:\s*"(icon-[a-z0-9-]+)"/g)].map((match) => match[1]),
);

describe("icon-* name contract", () => {
  it("finds icons at all, so a passing run means something", () => {
    expect(used.size, "no icon names were scraped out of src/").toBeGreaterThan(20);
    expect(registered.size, "the registry was not read").toBeGreaterThan(500);
  });

  it("every icon name used in src/ is registered", () => {
    const missing = [...used]
      .filter(([name]) => !registered.has(name))
      .map(([name, paths]) => `${name} (used in ${paths.map((p) => p.replace(SRC, "")).join(", ")})`);

    expect(missing, "these icon names are not in Umbraco's registry and render blank").toEqual([]);
  });

  it("registers the zoom pair the canvas toolbar reads as a matched minus and plus", () => {
    // Asserted here rather than assumed at the call site: `icon-remove` looked like a minus too.
    expect(registered.has("icon-zoom-out")).toBe(true);
    expect(registered.has("icon-zoom-in")).toBe(true);
  });
});
