import type { DiGradient, DiGradientStop, GradientExtent } from "../api/types.js";

/**
 * The CSS the designer paints a gradient with. It is deliberately the *same* convention the
 * server renders with - `GradientGeometry` and `GradientBrushes` - so the artboard and the real
 * preview agree. One builder, so the canvas's stage and a shape layer's box cannot drift.
 *
 * - linear: `linear-gradient(<angle>deg, …)`; 180deg is top to bottom.
 * - radial: `radial-gradient(<ellipse|circle> <extent> at x% y%, …)`.
 * - angular: `conic-gradient(from <angle>deg at x% y%, …)`.
 * - reflected: a linear gradient with its stops mirrored about the middle - the same stops the
 *   server draws with, so the two agree by construction.
 * - diamond: four `to <corner>` linear gradients, one per quadrant around the centre, each sized
 *   to its quadrant. CSS's "magic corners" put a `to corner` gradient's lines through the other
 *   two corners, which are exactly the diamond's lines; the stops are halved so the last one lands
 *   on the sides, where the renderer puts it.
 *
 * The result is a `background` value (the diamond is four layers), not a `background-image`.
 */
export function gradientCss(gradient: DiGradient): string {
  const kind = gradient.kind ?? "linear";
  const x = Math.round(clamp01(gradient.centreX ?? 0.5) * 100);
  const y = Math.round(clamp01(gradient.centreY ?? 0.5) * 100);

  switch (kind) {
    case "radial":
      return `radial-gradient(${gradient.shape ?? "ellipse"} ${extentKeyword(gradient.extent)} at ${x}% ${y}%, ${stopList(gradient)})`;

    case "angular":
      return `conic-gradient(from ${gradient.angle}deg at ${x}% ${y}%, ${stopList(gradient)})`;

    case "reflected":
      return `linear-gradient(${gradient.angle}deg, ${positioned(reflectedStops(effectiveStops(gradient)))})`;

    case "diamond": {
      const list = positioned(effectiveStops(gradient).map((stop) => ({ ...stop, position: stop.position / 2 })));
      return [
        `linear-gradient(to top left, ${list}) left top / ${x}% ${y}% no-repeat`,
        `linear-gradient(to top right, ${list}) right top / ${100 - x}% ${y}% no-repeat`,
        `linear-gradient(to bottom left, ${list}) left bottom / ${x}% ${100 - y}% no-repeat`,
        `linear-gradient(to bottom right, ${list}) right bottom / ${100 - x}% ${100 - y}% no-repeat`,
      ].join(", ");
    }

    default:
      return `linear-gradient(${gradient.angle}deg, ${stopList(gradient)})`;
  }
}

/** The renderer clamps a centre to the box; the preview has to clamp it the same way. */
export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

const EXTENT_KEYWORDS: Record<GradientExtent, string> = {
  farthestCorner: "farthest-corner",
  farthestSide: "farthest-side",
  closestCorner: "closest-corner",
  closestSide: "closest-side",
};

function extentKeyword(extent: GradientExtent | undefined): string {
  return EXTENT_KEYWORDS[extent ?? "farthestCorner"] ?? "farthest-corner";
}

/**
 * The stops a gradient draws with: its own, sorted and clamped, when it has two or more;
 * otherwise `from` at 0 and `to` at 1. The server's `GradientGeometry.EffectiveStops`.
 */
export function effectiveStops(gradient: DiGradient): DiGradientStop[] {
  const stops = gradient.stops;
  if (!stops || stops.length < 2) {
    return [{ colour: gradient.from, position: 0 }, { colour: gradient.to, position: 1 }];
  }

  return stops
    .map((stop, index) => ({ stop: { colour: stop.colour, position: clamp01(stop.position) }, index }))
    .sort((a, b) => a.stop.position - b.stop.position || a.index - b.index)
    .map(({ stop }) => stop);
}

/** The first stop at the middle, running out to the last at both ends. */
export function reflectedStops(stops: DiGradientStop[]): DiGradientStop[] {
  return [
    ...[...stops].reverse().map((stop) => ({ colour: stop.colour, position: 0.5 - stop.position / 2 })),
    ...stops.map((stop) => ({ colour: stop.colour, position: 0.5 + stop.position / 2 })),
  ];
}

/**
 * A two-colour gradient as it always was - `from, to` with no positions, which is what every
 * stored template's CSS looked like - and anything with stops with a position on each.
 */
function stopList(gradient: DiGradient): string {
  const stops = gradient.stops;
  return stops && stops.length >= 2 ? positioned(effectiveStops(gradient)) : `${gradient.from}, ${gradient.to}`;
}

function positioned(stops: DiGradientStop[]): string {
  return stops.map((stop) => `${stop.colour} ${round(stop.position * 100)}%`).join(", ");
}

const round = (value: number): number => Math.round(value * 100) / 100;

// ------------------------------------------------------------------ editing stops

/**
 * A gradient with new stops, keeping `from` and `to` equal to the first and last so a package
 * that predates stops still draws something close.
 */
export function withStops(gradient: DiGradient, stops: DiGradientStop[]): DiGradient {
  const sorted = effectiveStops({ ...gradient, stops });
  return { ...gradient, stops, from: sorted[0].colour, to: sorted[sorted.length - 1].colour };
}

/** Reversed, as an art program's Reverse button does: the colours run the other way. */
export function reverseStops(gradient: DiGradient): DiGradient {
  const reversed = [...effectiveStops(gradient)]
    .reverse()
    .map((stop) => ({ colour: stop.colour, position: round(1 - stop.position) }));

  return withStops(gradient, reversed);
}

/** A new stop at the middle of the widest gap, in the colour the gradient already has there. */
export function addStop(gradient: DiGradient): DiGradient {
  const stops = effectiveStops(gradient);

  let widest = 0;
  for (let index = 1; index < stops.length; index++) {
    if (stops[index].position - stops[index - 1].position > stops[widest + 1].position - stops[widest].position) {
      widest = index - 1;
    }
  }

  const before = stops[widest];
  const after = stops[widest + 1];
  const position = round((before.position + after.position) / 2);

  return withStops(gradient, [...stops, { colour: mixHex(before.colour, after.colour, 0.5), position }]);
}

/** Without the stop at `index`; a gradient never drops below two. */
export function removeStop(gradient: DiGradient, index: number): DiGradient {
  const stops = effectiveStops(gradient);
  if (stops.length <= 2) return gradient;

  return withStops(gradient, stops.filter((_, candidate) => candidate !== index));
}

/** Straight RGBA interpolation between two hex colours, as the renderer's brushes interpolate. */
export function mixHex(from: string, to: string, amount: number): string {
  const a = parseHex(from);
  const b = parseHex(to);
  if (!a || !b) return from;

  const channel = (index: number) =>
    Math.round(a[index] + (b[index] - a[index]) * amount).toString(16).padStart(2, "0").toUpperCase();

  const rgb = `#${channel(0)}${channel(1)}${channel(2)}`;
  const alpha = channel(3);

  return alpha === "FF" ? rgb : `${rgb}${alpha}`;
}

function parseHex(value: string): [number, number, number, number] | undefined {
  const hex = (value ?? "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(hex) || ![3, 4, 6, 8].includes(hex.length)) return undefined;

  const full = hex.length <= 4 ? [...hex].map((digit) => digit + digit).join("") : hex;
  const byte = (index: number) => parseInt(full.slice(index * 2, index * 2 + 2), 16);

  return [byte(0), byte(1), byte(2), full.length === 8 ? byte(3) : 255];
}
