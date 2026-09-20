import { css, customElement, html, nothing, property, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { classMap, styleMap } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { DiLayer, DiLayerBounds, DiPosition } from "../api/types.js";
import { anchorToTopLeft, type Box } from "../models/anchor.js";
import { isTracked } from "../models/relative-layout.js";
import { clipPathFor } from "../models/shape-geometry.js";
import { fontFamilyFor } from "./fonts/font-face-loader.js";

/** The eight resize handles, named by which corner or edge they move. */
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
export type ResizeHandle = (typeof HANDLES)[number];

/** What a drag starts from: a resize handle, the rotation handle above the box, or the box itself. */
export type DragHandle = ResizeHandle | "rotate";

/** Screen pixels between the top edge's handle and the rotation handle, whatever the zoom. */
const ROTATE_HANDLE_OFFSET_PX = 18;

export interface LayerDragEventDetail {
  key: string;
  handle?: DragHandle;
  /** Pointer position in image pixels at the moment the gesture started. */
  startX: number;
  startY: number;
  shiftKey: boolean;
  altKey: boolean;
}

/**
 * One layer on the artboard: an approximate, DOM-rendered preview plus the pointer handling that
 * moves, resizes and rotates it.
 *
 * The DOM rendering is deliberately approximate. It uses the real font files, so wrapping and
 * weight look right, but the server render is the ground truth - which is why the measured
 * bounds from preview/layout can be overlaid on top.
 */
@customElement("di-layer-box")
export class DiLayerBoxElement extends UmbLitElement {
  @property({ type: Object })
  layer!: DiLayer;

  @property({ type: Number })
  scale = 1;

  @property({ type: Boolean, reflect: true })
  selected = false;

  /** The server's measured bounds for this layer, when the overlay is turned on. */
  @property({ type: Object })
  measured?: DiLayerBounds;

  @property({ type: Boolean })
  showMeasured = false;

  /** Text the server resolved for this layer, so the box shows real content rather than a token. */
  @property({ type: String })
  resolvedText?: string;

  /**
   * Where the layer goes once any axis that tracks another layer is resolved. The canvas works
   * this out for every layer at once; without it the layer's own position is used.
   */
  @property({ attribute: false })
  resolvedPosition?: DiPosition;

  @state()
  private _box: Box = { x: 0, y: 0, width: 0, height: 0 };

  #resizeObserver?: ResizeObserver;
  #observedBox?: HTMLElement;

  override willUpdate() {
    this._box = this.#computeBox();
  }

  override updated() {
    // An auto-height layer changes size when its text or font changes, with no property of the
    // canvas changing - and any layer positioned below it has to follow. Reporting the resize
    // lets the canvas re-resolve.
    const box = this.renderRoot.querySelector<HTMLElement>(".box") ?? undefined;
    if (box === this.#observedBox) return;

    this.#resizeObserver?.disconnect();
    this.#observedBox = box;

    if (box) {
      this.#resizeObserver ??= new ResizeObserver(() =>
        this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: true, composed: true })),
      );
      this.#resizeObserver.observe(box);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver?.disconnect();
    this.#observedBox = undefined;
  }

  /** The position the box is laid out from. */
  get #position(): DiPosition {
    return this.resolvedPosition ?? this.layer.position;
  }

  /** Degrees clockwise about the position; a layer made before rotation existed has none. */
  get #rotation(): number {
    return this.layer.rotation ?? 0;
  }

  /**
   * The box this layer occupies. Width and height fall back to something sensible per type when
   * the layer leaves them open, because an absolutely positioned element needs a size.
   */
  #computeBox(): Box {
    const layer = this.layer;
    const width = layer.size.width ?? this.#intrinsicWidth();

    // With no explicit height the layer is as tall as its content, which only the server can say
    // for certain - so its measured height is preferred over the estimate once it arrives.
    const height = layer.size.height ?? this.measured?.height ?? this.#intrinsicHeight();
    const topLeft = anchorToTopLeft(this.#position, width, height);

    return { x: topLeft.x, y: topLeft.y, width, height };
  }

  /** True when the layer's height is whatever its content needs, rather than a fixed number. */
  get #heightIsAuto(): boolean {
    return this.layer.size.height === null || this.layer.size.height === undefined;
  }

  #intrinsicWidth(): number {
    switch (this.layer.type) {
      case "badges": {
        // Labels beside their icons make every item as wide as its text, which only the server
        // can measure honestly - so its width is preferred, with a rough estimate for the first frame.
        if (this.measured?.width) return this.measured.width;

        const { badge, label, gap, maxItems, direction } = this.layer;
        const one = label.position === "right" ? badge.size + label.gap + label.fontSize * 0.6 * 8 : badge.size;
        return direction === "horizontal" ? maxItems * one + (maxItems - 1) * gap : one;
      }
      case "text":
        return 600;
      default:
        return 240;
    }
  }

  #intrinsicHeight(): number {
    switch (this.layer.type) {
      case "text": {
        const { fontSize, lineSpacing, maxLines } = this.layer.style;
        return fontSize * lineSpacing * (maxLines ?? 1);
      }
      case "badges": {
        const { badge, label, gap, maxItems, direction } = this.layer;
        const one =
          label.position === "below"
            ? badge.size + label.gap + label.fontSize * 1.2
            : label.position === "right"
              ? Math.max(badge.size, label.fontSize * 1.2)
              : badge.size;
        return direction === "horizontal" ? one : maxItems * one + (maxItems - 1) * gap;
      }
      default:
        return 135;
    }
  }

  /**
   * The CSS that turns an element laid out as the unrotated box about the layer's pivot - the
   * resolved position, the same point the anchor marker sits on. Applied to the box and to its
   * chrome alike, so ring, handles and anchor dot turn with the layer.
   */
  #turn(box: Box): Record<string, string> {
    const rotation = this.#rotation;
    if (rotation === 0) return {};

    const position = this.#position;

    return {
      transform: `rotate(${rotation}deg)`,
      transformOrigin: `${(position.x - box.x) * this.scale}px ${(position.y - box.y) * this.scale}px`,
    };
  }

  // ------------------------------------------------------------------ pointer handling

  #onPointerDown(event: PointerEvent, handle?: DragHandle) {
    if (this.layer.isLocked) return;

    event.preventDefault();
    event.stopPropagation();

    // Capturing on the element means the gesture keeps working when the pointer leaves the box -
    // which it always does on a fast drag.
    (event.target as Element).setPointerCapture?.(event.pointerId);

    this.dispatchEvent(
      new CustomEvent<LayerDragEventDetail>("di-layer-drag-start", {
        bubbles: true,
        composed: true,
        detail: {
          key: this.layer.key,
          handle,
          startX: event.clientX,
          startY: event.clientY,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
        },
      }),
    );
  }

  #onSelect(event: PointerEvent) {
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent("di-layer-select", { bubbles: true, composed: true, detail: { key: this.layer.key } }),
    );
  }

  // ------------------------------------------------------------------ rendering

  render() {
    if (!this.layer.isVisible) return nothing;

    const box = this._box;

    return html`
      <div
        class=${classMap({ box: true, selected: this.selected, locked: this.layer.isLocked })}
        style=${styleMap({
          left: `${box.x * this.scale}px`,
          top: `${box.y * this.scale}px`,
          width: `${box.width * this.scale}px`,
          // An auto-height layer grows downward from its anchored top instead of being cut off at
          // an estimated height - a wrapped two-line title would otherwise lose its second line.
          ...(this.#heightIsAuto
            ? { minHeight: `${box.height * this.scale}px`, overflow: "visible" }
            : { height: `${box.height * this.scale}px` }),
          opacity: String(this.layer.opacity),
          ...this.#turn(box),
        })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(event: PointerEvent) => {
          this.#onSelect(event);
          this.#onPointerDown(event);
        }}>
        ${this.#renderContent()}
      </div>

      ${this.selected ? this.#renderChrome(box) : nothing}
      ${this.showMeasured && this.measured ? this.#renderMeasured() : nothing}
    `;
  }

  #renderContent() {
    switch (this.layer.type) {
      case "text":
        return this.#renderText();
      case "image":
        return this.#renderImage();
      case "badges":
        return this.#renderBadges();
      default:
        return this.#renderShape();
    }
  }

  #renderText() {
    if (this.layer.type !== "text") return nothing;

    const style = this.layer.style;
    const text = this.resolvedText || this.#placeholderText();

    return html`
      <div
        class="text"
        style=${styleMap({
          // The real font, loaded through the FontFace API - that is what makes the wrapping in
          // the designer match the wrapping in the render.
          fontFamily: `${fontFamilyFor(style.fontKey)}, sans-serif`,
          fontSize: `${style.fontSize * this.scale}px`,
          lineHeight: String(style.lineSpacing),
          letterSpacing: `${style.letterSpacing * this.scale}px`,
          color: style.colour,
          textAlign: style.textAlign === "centre" ? "center" : style.textAlign,
          textTransform: style.textTransform === "none" ? "none" : style.textTransform,
          // -webkit-line-clamp is the closest DOM equivalent of the server's maxLines handling.
          ...(style.maxLines
            ? { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: String(style.maxLines), overflow: "hidden" }
            : {}),
        })}>
        ${text}
      </div>
    `;
  }

  #placeholderText(): string {
    if (this.layer.type !== "text") return "";

    switch (this.layer.binding.kind) {
      case "nodeName":
        return "{Page name}";
      case "readingTime":
        return "5 min read";
      case "static":
        return this.layer.binding.text || "Text";
      case "expression":
        return this.layer.binding.text || "{expression}";
      case "date":
        return "1 January 2026";
      default:
        return `{${this.layer.binding.propertyAlias ?? "property"}}`;
    }
  }

  #renderImage() {
    if (this.layer.type !== "image") return nothing;

    const border = this.layer.border;

    return html`
      <div
        class="image"
        style=${styleMap({
          borderRadius: `${this.layer.cornerRadius * this.scale}px`,
          border: border ? `${border.width * this.scale}px solid ${border.colour}` : "none",
        })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
  }

  #renderBadges() {
    if (this.layer.type !== "badges") return nothing;

    const { badge, label, gap, maxItems, direction, wrap, rowGap } = this.layer;
    const horizontal = direction === "horizontal";
    const wraps = horizontal && wrap;
    const labelPosition = label.position ?? "below";

    return html`
      <div
        class="badges"
        style=${styleMap({
          flexDirection: horizontal ? "row" : "column",
          flexWrap: wraps ? "wrap" : "nowrap",
          gap: `${gap * this.scale}px`,
          // Wrapped rows are a row gap apart; the item gap stays between items in a row.
          ...(wraps ? { rowGap: `${rowGap * this.scale}px` } : {}),
        })}>
        ${repeat(
          Array.from({ length: Math.max(1, maxItems) }, (_, index) => index),
          (index) => index,
          () => html`
            <div class=${classMap({ badge: true, right: labelPosition === "right" })}>
              <div
                class="circle"
                style=${styleMap({
                  width: `${badge.size * this.scale}px`,
                  height: `${badge.size * this.scale}px`,
                  background: badge.fillColour,
                  border: `${badge.borderWidth * this.scale}px solid ${badge.borderColour}`,
                })}>
              </div>
              ${labelPosition === "none"
                ? nothing
                : html`<div
                    class="badge-label"
                    style=${styleMap({
                      ...(labelPosition === "right"
                        ? { marginLeft: `${label.gap * this.scale}px` }
                        : { marginTop: `${label.gap * this.scale}px` }),
                      fontFamily: `${fontFamilyFor(label.fontKey)}, sans-serif`,
                      fontSize: `${label.fontSize * this.scale}px`,
                      color: label.colour,
                      textTransform: label.textTransform === "none" ? "none" : label.textTransform,
                      letterSpacing: `${label.letterSpacing * this.scale}px`,
                    })}>
                    Label
                  </div>`}
            </div>
          `,
        )}
      </div>
    `;
  }

  /**
   * A rectangle or ellipse is one div with a border-radius and a CSS border (the box is
   * border-box, so the border lies inside it, as on the server). A polygon or star is an outer
   * div clipped to the shape and painted in the border colour, with an inner div inset by the
   * border width, clipped to the same shape and painted with the fill - the standard CSS
   * approximation of an inside stroke on a clipped shape.
   */
  #renderShape() {
    if (this.layer.type !== "rect") return nothing;

    const layer = this.layer;
    const shape = layer.shape ?? "rectangle";
    const gradient = layer.gradient;
    const paint = gradient
      ? `linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to})`
      : layer.fill ?? "transparent";
    const border = layer.border;
    const borderWidth = border ? border.width * this.scale : 0;

    if (shape === "rectangle" || shape === "ellipse") {
      return html`
        <div
          class="shape"
          style=${styleMap({
            background: paint,
            borderRadius: shape === "ellipse" ? "50%" : `${layer.cornerRadius * this.scale}px`,
            border: border ? `${borderWidth}px solid ${border.colour}` : "none",
          })}>
        </div>
      `;
    }

    const clipPath = clipPathFor(shape, layer.sides ?? 5, layer.innerRatio ?? 0.5) ?? "none";

    return html`
      <div class="shape" style=${styleMap({ clipPath, background: border ? border.colour : "transparent" })}>
        <div class="shape-inner" style=${styleMap({ inset: `${borderWidth}px`, clipPath, background: paint })}></div>
      </div>
    `;
  }

  /** Selection ring, resize handles, the rotation handle and the anchor marker - turned with the layer. */
  #renderChrome(box: Box) {
    const left = box.x * this.scale;
    const top = box.y * this.scale;
    const width = box.width * this.scale;
    const height = box.height * this.scale;

    const position = this.#position;
    const rotation = this.#rotation;
    const tracked = isTracked(this.layer.position, "x") || isTracked(this.layer.position, "y");

    return html`
      <div
        class="chrome"
        style=${styleMap({ left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px`, ...this.#turn(box) })}>
        <span
          class="tag"
          style=${styleMap(rotation !== 0 ? { transform: `rotate(${-rotation}deg)` } : {})}>
          ${tracked ? html`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : nothing}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked
          ? nothing
          : html`
              ${repeat(
                HANDLES,
                (handle) => handle,
                (handle) => html`
                  <span
                    class="handle ${handle}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${handle}"
                    @pointerdown=${(event: PointerEvent) => this.#onPointerDown(event, handle)}>
                  </span>
                `,
              )}
              <span class="stalk" style=${styleMap({ height: `${ROTATE_HANDLE_OFFSET_PX}px`, top: `${-ROTATE_HANDLE_OFFSET_PX}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${styleMap({ top: `${-ROTATE_HANDLE_OFFSET_PX}px` })}
                @pointerdown=${(event: PointerEvent) => this.#onPointerDown(event, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${position.anchor}${rotation !== 0 ? ` - turns ${rotation}° here` : ""}"
          style=${styleMap({
            left: `${(position.x - box.x) * this.scale}px`,
            top: `${(position.y - box.y) * this.scale}px`,
          })}>
        </span>
      </div>
    `;
  }

  /**
   * Where the server actually drew this layer - dashed, so it reads as a reference not a control.
   * The server reports the unrotated box plus the pivot; turning the dashed box about that pivot
   * puts it exactly over the pixels.
   */
  #renderMeasured() {
    const measured = this.measured!;
    const rotation = measured.rotation ?? 0;

    return html`
      <div
        class="measured"
        style=${styleMap({
          left: `${measured.x * this.scale}px`,
          top: `${measured.y * this.scale}px`,
          width: `${measured.width * this.scale}px`,
          height: `${measured.height * this.scale}px`,
          ...(rotation !== 0
            ? {
                transform: `rotate(${rotation}deg)`,
                transformOrigin: `${(measured.pivotX - measured.x) * this.scale}px ${(measured.pivotY - measured.y) * this.scale}px`,
              }
            : {}),
        })}>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: contents;
    }

    .box {
      position: absolute;
      overflow: hidden;
      cursor: move;
      user-select: none;
    }

    .box.locked {
      /* Locked layers still render, but pointer gestures pass straight through them. */
      pointer-events: none;
    }

    .box:focus-visible {
      outline: 2px solid var(--uui-color-focus);
      outline-offset: 1px;
    }

    .text {
      width: 100%;
      overflow-wrap: anywhere;
    }

    .image {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.7);
      font-size: 11px;
      overflow: hidden;
    }

    .shape {
      position: relative;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .shape-inner {
      position: absolute;
    }

    .badges {
      display: flex;
      align-items: flex-start;
      align-content: flex-start;
      width: 100%;
      height: 100%;
    }

    .badge {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .badge.right {
      flex-direction: row;
    }

    .circle {
      border-radius: 50%;
      box-sizing: border-box;
    }

    .badge-label {
      white-space: nowrap;
      line-height: 1.2;
    }

    .chrome {
      position: absolute;
      pointer-events: none;
      outline: 1px solid var(--uui-color-focus);
      z-index: 30;
    }

    @media (prefers-reduced-motion: no-preference) {
      .chrome {
        animation: ring 160ms ease-out;
      }
    }

    @keyframes ring {
      from {
        outline-color: transparent;
      }
    }

    .tag {
      position: absolute;
      top: -18px;
      left: 0;
      display: flex;
      align-items: center;
      gap: 3px;
      background: var(--uui-color-focus);
      color: var(--uui-color-surface);
      font-size: 10px;
      line-height: 1;
      padding: 3px 5px;
      border-radius: 2px;
      white-space: nowrap;
      pointer-events: none;
      /* Counter-rotated about its own bottom-left, so it stays readable on a tilted layer. */
      transform-origin: 0 100%;
    }

    .tag uui-icon {
      font-size: 10px;
    }

    .handle {
      position: absolute;
      width: 9px;
      height: 9px;
      margin: -5px 0 0 -5px;
      background: var(--uui-color-surface);
      border: 1px solid var(--uui-color-focus);
      border-radius: 1px;
      pointer-events: auto;
    }

    .nw { left: 0; top: 0; cursor: nwse-resize; }
    .n { left: 50%; top: 0; cursor: ns-resize; }
    .ne { left: 100%; top: 0; cursor: nesw-resize; }
    .e { left: 100%; top: 50%; cursor: ew-resize; }
    .se { left: 100%; top: 100%; cursor: nwse-resize; }
    .s { left: 50%; top: 100%; cursor: ns-resize; }
    .sw { left: 0; top: 100%; cursor: nesw-resize; }
    .w { left: 0; top: 50%; cursor: ew-resize; }

    /* A fixed screen distance above the top edge's handle, whatever the zoom. */
    .stalk {
      position: absolute;
      left: 50%;
      width: 1px;
      background: var(--uui-color-focus);
    }

    .rotate {
      left: 50%;
      width: 11px;
      height: 11px;
      margin: -6px 0 0 -6px;
      border-radius: 50%;
      cursor: grab;
    }

    .rotate:active {
      cursor: grabbing;
    }

    .anchor {
      position: absolute;
      width: 7px;
      height: 7px;
      margin: -4px 0 0 -4px;
      border-radius: 50%;
      background: var(--uui-color-focus);
      box-shadow: 0 0 0 2px var(--uui-color-surface);
      pointer-events: none;
    }

    .measured {
      position: absolute;
      border: 1px dashed rgba(255, 255, 255, 0.55);
      pointer-events: none;
      z-index: 25;
    }
  `;
}

export default DiLayerBoxElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-layer-box": DiLayerBoxElement;
  }
}
