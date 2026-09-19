import { fetchFontFile, type TokenGetter } from "../../api/dynamic-images-api.js";

/**
 * Loads a registered font into the page so the canvas can lay text out in the real typeface.
 *
 * A plain @font-face URL cannot carry the bearer token the API needs, so the bytes are fetched
 * and handed to the FontFace constructor instead.
 */
const loaded = new Map<string, Promise<FontFace | undefined>>();

/** The CSS family name a layer box should use for a font key. */
export const fontFamilyFor = (fontKey: string): string => `di-${fontKey}`;

export function loadFont(fontKey: string, getToken: TokenGetter): Promise<FontFace | undefined> {
  if (!fontKey) return Promise.resolve(undefined);

  const existing = loaded.get(fontKey);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const buffer = await fetchFontFile(fontKey, getToken);
      const face = new FontFace(fontFamilyFor(fontKey), buffer);

      await face.load();
      document.fonts.add(face);

      return face;
    } catch (error) {
      // A font that will not load is already reported by validation and the health check; the
      // canvas falls back to a system font rather than failing to render at all.
      console.warn("[DynamicImages] Could not load font", fontKey, error);
      return undefined;
    }
  })();

  loaded.set(fontKey, promise);
  return promise;
}

/** Loads several fonts at once, ignoring the ones that fail. */
export async function loadFonts(fontKeys: Iterable<string>, getToken: TokenGetter): Promise<void> {
  const unique = [...new Set([...fontKeys].filter(Boolean))];
  await Promise.all(unique.map((key) => loadFont(key, getToken)));
}

/** Forgets a cached font so the next request re-fetches it - used when a font file is replaced. */
export function forgetFont(fontKey: string): void {
  loaded.delete(fontKey);
}
