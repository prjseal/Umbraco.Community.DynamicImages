/**
 * Per-browser designer preferences: which panels the editor last folded away.
 *
 * Keys take a `di:` prefix with colons, never a `"di-…"` literal - `event-contract.test.ts` reads
 * every `"di-…"` string in the source as an event name.
 */
export const PALETTE_COLLAPSED_KEY = "di:designer:palette-collapsed";
export const TREE_COLLAPSED_KEY = "di:designer:tree-collapsed";

export function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    // Private mode, blocked storage - the panel simply starts open.
    return false;
  }
}

export function writeFlag(key: string, value: boolean): void {
  try {
    if (value) localStorage.setItem(key, "true");
    else localStorage.removeItem(key);
  } catch {
    // Not being able to remember a panel's state is not worth telling anyone about.
  }
}
