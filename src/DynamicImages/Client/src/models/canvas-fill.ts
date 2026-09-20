import type { DiTemplate } from "../api/types.js";

/**
 * Which of the three the canvas is currently filled with. Derived rather than stored: a third
 * `fillMode` field would be a second source of truth for something the two fields already say,
 * and would need a migration to add.
 */
export type CanvasFill = "colour" | "gradient" | "transparent";

export function canvasFill(canvas: DiTemplate["canvas"]): CanvasFill {
  if (canvas.backgroundGradient) return "gradient";
  return isTransparent(canvas.background) ? "transparent" : "colour";
}

/**
 * Whether a colour draws nothing at all. An empty value counts: the renderer's fallback for one
 * is `Color.Transparent`, so a template that has lost its background renders through.
 */
export function isTransparent(colour: string | null | undefined): boolean {
  if (!colour || colour.trim() === "") return true;

  const hex = colour.trim().replace(/^#/, "");
  return hex.length === 8 && hex.slice(6).toUpperCase() === "00";
}

/**
 * The same colour at a different alpha, so switching the fill to Transparent and back returns the
 * hue the editor chose rather than a default. `di-colour-input` normalises everything it emits to
 * `#RRGGBB` or `#RRGGBBAA`, so those are the only two shapes this has to read - but a hand-edited
 * document can hold `#RGB`, which expands, and anything else falls back to black.
 */
export function withAlpha(colour: string | null | undefined, alpha: "FF" | "00"): string {
  const hex = (colour ?? "").trim().replace(/^#/, "");

  const rgb = hex.length === 3
    ? [...hex].map((nibble) => nibble + nibble).join("")
    : hex.length === 6 || hex.length === 8
      ? hex.slice(0, 6)
      : "000000";

  // An opaque colour is written as six digits: "#FFFFFF" reads better than "#FFFFFFFF" and means
  // the same thing, which is also what the colour input emits.
  return alpha === "FF" ? `#${rgb.toUpperCase()}` : `#${rgb.toUpperCase()}00`;
}
