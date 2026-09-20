import { css, customElement, html, nothing, property, repeat, state, styleMap } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { DiLayer, DiLayerBounds, DiPosition, DiTemplate } from "../api/types.js";
import { anchorToTopLeft, positionForTopLeft, topLeftToAnchor, type Box } from "../models/anchor.js";
import { isRelative, isTracked, resolveAll, type ResolvedLayer, type Size } from "../models/relative-layout.js";
import { extent, normalise, rotatePoint, toLocal } from "../models/rotation.js";
import { snap, type Guide } from "./snap.js";
import type { DragHandle, LayerDragEventDetail, ResizeHandle } from "./di-layer-box.element.js";
import "./di-layer-box.element.js";
import "./di-guides.element.js";
import "./di-rulers.element.js";

/** Screen pixels within which a drag snaps. Divided by the scale so it feels the same at any zoom. */
const SNAP_THRESHOLD_PX = 6;

/** Must match di-rulers' own thickness - it is the width of the gutter they sit in. */
const RULER_THICKNESS = 20;

/** Degrees a rotation drag snaps to with Shift held, and the precision it keeps without. */
const ROTATE_STEP_DEGREES = 15;
const ROTATE_PRECISION_DEGREES = 0.1;

interface DragState {
  key: string;
  handle?: DragHandle;
  startClientX: number;
  startClientY: number;
  /** The unrotated box at the start of the gesture. */
  startBox: Box;
  /** The resolved position at the start - the pivot every frame of a rotated resize or a rotation turns about. */
  startPosition: DiPosition;
  startRotation: number;
  /**
   * The footprint at the start. A move of a rotated layer snaps by its footprint, and the
   * footprint's offset from the box and its size are both constant during a move, because the
   * pivot moves with the box.
   */
  startExtent: Box;
  /** Rotation drags: the pointer's angle from the pivot when the drag began. */
  startAngle: number;
  moved: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

/**
 * The artboard: a fixed-size stage in image pixels, scaled to fit, with one layer box per layer.
 *
 * All pointer maths goes through one conversion - client pixels to image pixels - so a drag at
 * 50% zoom lands on exactly the same image pixel as the same drag at 200%.
 */
@customElement("di-designer-canvas")
export class DiDesignerCanvasElement extends UmbLitElement {
  @property({ type: Object })
  template!: DiTemplate;

  @property({ type: String })
  selectedLayerKey?: string;

  @property({ type: Object })
  baseImageUrl?: string;

  @property({ type: Array })
  serverBounds: DiLayerBounds[] = [];

  @property({ type: Boolean })
  showMeasured = false;

  @property({ type: Boolean })
  snapEnabled = true;

  @property({ type: Boolean })
  showRulers = true;

  @property({ type: Boolean })
  showSafeArea = false;

  /** Zoom, or undefined to fit the available space. */
  @property({ type: Number })
  zoom?: number;

  @state()
  private _fitScale = 1;

  @state()
  private _guides: Guide[] = [];

  @state()
  private _pointer?: { x: number; y: number };

  @state()
  private _dropTarget = false;

  #drag?: DragState;
  #resizeObserver?: ResizeObserver;

  /** Every layer's resolved position and box, recomputed once per render. */
  #resolved = new Map<string, ResolvedLayer>();

  get scale(): number {
    return this.zoom ?? this._fitScale;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.#resizeObserver = new ResizeObserver(() => this.#recomputeFit());
    this.#resizeObserver.observe(this);

    window.addEventListener("pointermove", this.#onPointerMove);
    window.addEventListener("pointerup", this.#onPointerUp);
    window.addEventListener("pointercancel", this.#onPointerUp);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.#resizeObserver?.disconnect();
    window.removeEventListener("pointermove", this.#onPointerMove);
    window.removeEventListener("pointerup", this.#onPointerUp);
    window.removeEventListener("pointercancel", this.#onPointerUp);
  }

  override updated(changed: Map<string, unknown>) {
    this.#recomputeFit();

    // A zoom change moves the effective scale without touching the fit scale, so the readout
    // has to be told about it here too.
    if (changed.has("zoom")) this.#announceScale();
  }

  /**
   * The canvas is the only thing that knows the effective scale - it is sized to fit rather than
   * transformed, so `zoom` being unset means "fit", not 100%. Anything showing a percentage has
   * to hear it from here.
   */
  #announceScale() {
    this.dispatchEvent(
      new CustomEvent("di-scale-change", { bubbles: true, composed: true, detail: { scale: this.scale } }),
    );
  }

  #recomputeFit() {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (!viewport || !this.template) return;

    const padding = 48 + (this.showRulers ? RULER_THICKNESS : 0);
    const available = {
      width: Math.max(1, viewport.clientWidth - padding),
      height: Math.max(1, viewport.clientHeight - padding),
    };

    const fit = Math.min(
      available.width / this.template.canvas.width,
      available.height / this.template.canvas.height,
      // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
      1,
    );

    if (Math.abs(fit - this._fitScale) > 0.001) {
      this._fitScale = fit;
      this.#announceScale();
    }
  }

  // ------------------------------------------------------------------ coordinate conversion

  /** The one place client coordinates become image pixels. */
  #toImagePixels(clientX: number, clientY: number): { x: number; y: number } {
    const point = this.#toImagePoint(clientX, clientY);
    return { x: Math.round(point.x), y: Math.round(point.y) };
  }

  /** The same conversion unrounded, for the angle maths of a rotation drag. */
  #toImagePoint(clientX: number, clientY: number): { x: number; y: number } {
    const stage = this.renderRoot.querySelector<HTMLElement>(".stage");
    if (!stage) return { x: 0, y: 0 };

    const rect = stage.getBoundingClientRect();

    return { x: (clientX - rect.left) / this.scale, y: (clientY - rect.top) / this.scale };
  }

  /** The unrotated box a layer is laid out in - what positions its DOM. */
  #boxOf(layer: DiLayer): Box {
    const resolved = this.#resolved.get(layer.key);
    if (resolved) return resolved.box;

    const size = this.#sizeOf(layer);
    const topLeft = anchorToTopLeft(layer.position, size.width, size.height);

    return { x: topLeft.x, y: topLeft.y, ...size };
  }

  /** The axis-aligned footprint a layer covers once rotated - what snapping and guides see. */
  #extentOf(layer: DiLayer): Box {
    const resolved = this.#resolved.get(layer.key);
    if (resolved) return resolved.extent;

    return extent(this.#boxOf(layer), layer.position.x, layer.position.y, layer.rotation ?? 0);
  }

  /** The resolved position of a layer, or its own when nothing has been laid out yet. */
  #positionOf(layer: DiLayer): DiPosition {
    return this.#resolved.get(layer.key)?.position ?? layer.position;
  }

  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(key: string): DiPosition | undefined {
    return this.#resolved.get(key)?.position;
  }

  /**
   * Resolves every layer's position from the sizes the DOM and the server know about. A layer the
   * server measured nothing for (an empty value) is absent, so anything tracking it moves on up
   * its chain here exactly as it does in the render.
   */
  #resolveLayout() {
    const boundsByKey = new Map(this.serverBounds.map((bounds) => [bounds.key, bounds] as const));
    const serverHasSpoken = this.serverBounds.length > 0;

    this.#resolved = resolveAll(
      this.template.layers,
      (layer) => this.#sizeOf(layer, boundsByKey.get(layer.key)),
      (layer) => !layer.isVisible || (serverHasSpoken && !boundsByKey.has(layer.key)),
    );
  }

  #sizeOf(layer: DiLayer, measured?: DiLayerBounds): Size {
    const element = this.renderRoot.querySelector<HTMLElement>(`di-layer-box[data-key="${layer.key}"]`);

    // Badges with labels beside their icons have no honest client-side width, so the server's wins.
    const measuredWidth = layer.type === "badges" && measured?.width ? measured.width : undefined;

    return {
      width: layer.size.width ?? measuredWidth ?? this.#fallbackWidth(layer, element),
      height: layer.size.height ?? measured?.height ?? this.#fallbackHeight(layer, element),
    };
  }

  /**
   * A layer with no explicit width occupies whatever its content needs. Measuring the rendered
   * box is the only honest answer, with a constant fallback for the first frame.
   */
  #fallbackWidth(layer: DiLayer, element: HTMLElement | null): number {
    const rendered = element?.querySelector<HTMLElement>(".box")?.offsetWidth;
    return rendered ? rendered / this.scale : layer.type === "text" ? 600 : 240;
  }

  #fallbackHeight(layer: DiLayer, element: HTMLElement | null): number {
    const rendered = element?.querySelector<HTMLElement>(".box")?.offsetHeight;
    return rendered ? rendered / this.scale : layer.type === "text" ? 80 : 135;
  }

  // ------------------------------------------------------------------ dragging

  #onDragStart = (event: CustomEvent<LayerDragEventDetail>) => {
    const layer = this.template.layers.find((candidate) => candidate.key === event.detail.key);
    if (!layer || layer.isLocked) return;

    const startBox = this.#boxOf(layer);
    const startExtent = this.#extentOf(layer);
    const startPosition = this.#positionOf(layer);
    const pointer = this.#toImagePoint(event.detail.startX, event.detail.startY);

    this.#drag = {
      key: layer.key,
      handle: event.detail.handle,
      startClientX: event.detail.startX,
      startClientY: event.detail.startY,
      startBox,
      startPosition,
      startRotation: layer.rotation ?? 0,
      startExtent,
      startAngle: Math.atan2(pointer.y - startPosition.y, pointer.x - startPosition.x),
      moved: false,
      shiftKey: event.detail.shiftKey,
      altKey: event.detail.altKey,
    };

    // One transaction for the whole gesture, so a 300-event drag (or a whole spin) is a single
    // undo step.
    this.dispatchEvent(new CustomEvent("di-transaction-begin", { bubbles: true, composed: true }));
  };

  #onPointerMove = (event: PointerEvent) => {
    this._pointer = this.#toImagePixels(event.clientX, event.clientY);

    const drag = this.#drag;
    if (!drag) return;

    const layer = this.template.layers.find((candidate) => candidate.key === drag.key);
    if (!layer) return;

    const deltaX = (event.clientX - drag.startClientX) / this.scale;
    const deltaY = (event.clientY - drag.startClientY) / this.scale;

    if (!drag.moved && Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
    drag.moved = true;

    if (drag.handle === "rotate") {
      this.#rotateTo(layer, drag, event);
      return;
    }

    // An axis that tracks another layer is not the pointer's to move: it stays where the gesture
    // found it, for a move and for the handles that would drag that edge alike.
    const lockX = isTracked(layer.position, "x");
    const lockY = isTracked(layer.position, "y");
    const rotation = drag.startRotation;

    if (drag.handle && rotation !== 0) {
      this.#resizeRotated(layer, drag, drag.handle, deltaX, deltaY, event.shiftKey, lockX, lockY);
      return;
    }

    let proposed = drag.handle
      ? this.#resizeBox(drag.startBox, drag.handle, deltaX, deltaY, event.shiftKey)
      : { ...drag.startBox, x: drag.startBox.x + deltaX, y: drag.startBox.y + deltaY };

    if (lockX) {
      proposed = { ...proposed, x: drag.startBox.x, width: drag.handle?.includes("w") ? drag.startBox.width : proposed.width };
    }
    if (lockY) {
      proposed = { ...proposed, y: drag.startBox.y, height: drag.handle?.includes("n") ? drag.startBox.height : proposed.height };
    }

    // A rotated layer moves by its footprint: what snaps to the canvas centre is the tilted
    // outline, not the box the DOM is laid out in. The footprint's offset from the box and its
    // size are constant during a move, because the pivot moves with the box, so the offset
    // comes off again afterwards. An unrotated layer's footprint is its box, and this is
    // exactly the path it always took.
    const offset = { x: drag.startExtent.x - drag.startBox.x, y: drag.startExtent.y - drag.startBox.y };
    const proposedExtent =
      rotation !== 0
        ? { x: proposed.x + offset.x, y: proposed.y + offset.y, width: drag.startExtent.width, height: drag.startExtent.height }
        : proposed;

    // Alt is the universal "ignore snapping for a moment" modifier.
    const useSnap = this.snapEnabled && !event.altKey;
    const result = useSnap
      ? snap(proposedExtent, {
          canvasWidth: this.template.canvas.width,
          canvasHeight: this.template.canvas.height,
          others: this.template.layers.filter((other) => other.key !== layer.key).map((other) => this.#extentOf(other)),
          threshold: SNAP_THRESHOLD_PX / this.scale,
          lockX,
          lockY,
        })
      : {
          box: {
            ...proposedExtent,
            x: lockX ? proposedExtent.x : Math.round(proposedExtent.x),
            y: lockY ? proposedExtent.y : Math.round(proposedExtent.y),
          },
          guides: [],
        };

    this._guides = result.guides;

    const box = rotation !== 0 ? { ...proposed, x: result.box.x - offset.x, y: result.box.y - offset.y } : result.box;

    // The stored coordinate on a tracked axis is only the fallback; the resolved value is
    // derived, never written back.
    const position = positionForTopLeft(box, layer.position);
    if (lockX) position.x = layer.position.x;
    if (lockY) position.y = layer.position.y;

    const patch: Partial<DiLayer> = { position };

    if (drag.handle) {
      patch.size = {
        width: Math.max(1, Math.round(box.width)),
        height: Math.max(1, Math.round(box.height)),
      };
    }

    this.dispatchEvent(
      new CustomEvent("di-layer-change", { bubbles: true, composed: true, detail: { key: layer.key, patch } }),
    );
  };

  /**
   * Resizing a rotated layer: the pointer's movement is expressed in the layer's own frame, the
   * box is resized there exactly as an unrotated one is, and the new position is the local
   * anchor point of the new box mapped back through the rotation about the pivot the gesture
   * started with - so the edges opposite the handle stay put on screen and the layer grows along
   * its own axes. No snapping and no guides: axis-aligned candidates mean nothing to a tilted box.
   */
  #resizeRotated(
    layer: DiLayer, drag: DragState, handle: ResizeHandle,
    deltaX: number, deltaY: number, keepAspect: boolean, lockX: boolean, lockY: boolean,
  ) {
    const rotation = drag.startRotation;
    const pivot = drag.startPosition;
    const local = toLocal(deltaX, deltaY, 0, 0, rotation);

    let box = this.#resizeBox(drag.startBox, handle, local.x, local.y, keepAspect);

    if (lockX) box = { ...box, x: drag.startBox.x, width: handle.includes("w") ? drag.startBox.width : box.width };
    if (lockY) box = { ...box, y: drag.startBox.y, height: handle.includes("n") ? drag.startBox.height : box.height };

    const width = Math.max(1, Math.round(box.width));
    const height = Math.max(1, Math.round(box.height));
    const anchor = topLeftToAnchor(box.x, box.y, width, height, pivot.anchor);
    const moved = rotatePoint(anchor.x, anchor.y, pivot.x, pivot.y, rotation);

    const position: DiPosition = {
      ...layer.position,
      x: lockX ? layer.position.x : Math.round(moved.x),
      y: lockY ? layer.position.y : Math.round(moved.y),
    };

    this._guides = [];

    this.dispatchEvent(
      new CustomEvent("di-layer-change", {
        bubbles: true,
        composed: true,
        detail: { key: layer.key, patch: { position, size: { width, height } } satisfies Partial<DiLayer> },
      }),
    );
  }

  /** The rotation handle: the angle the pointer has swept around the pivot since the drag began. */
  #rotateTo(layer: DiLayer, drag: DragState, event: PointerEvent) {
    const pivot = drag.startPosition;
    const pointer = this.#toImagePoint(event.clientX, event.clientY);
    const angle = Math.atan2(pointer.y - pivot.y, pointer.x - pivot.x);
    const swept = ((angle - drag.startAngle) * 180) / Math.PI;

    const raw = drag.startRotation + swept;
    const step = event.shiftKey ? ROTATE_STEP_DEGREES : ROTATE_PRECISION_DEGREES;
    const rotation = normalise(Math.round(raw / step) * step);

    this._guides = [];

    if (rotation === (layer.rotation ?? 0)) return;

    this.dispatchEvent(
      new CustomEvent("di-layer-change", {
        bubbles: true,
        composed: true,
        detail: { key: layer.key, patch: { rotation } satisfies Partial<DiLayer> },
      }),
    );
  }

  #onPointerUp = () => {
    if (!this.#drag) return;

    const moved = this.#drag.moved;
    this.#drag = undefined;
    this._guides = [];

    // A click that selected without moving must not leave an empty undo entry behind.
    this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: true, composed: true, detail: { moved } }));
  };

  /**
   * Moves the edges the handle controls, leaving the opposite edges fixed - which is what makes
   * a resize feel like a resize rather than a move.
   */
  #resizeBox(start: Box, handle: ResizeHandle, deltaX: number, deltaY: number, keepAspect: boolean): Box {
    let { x, y, width, height } = start;

    if (handle.includes("w")) {
      x = start.x + deltaX;
      width = start.width - deltaX;
    }
    if (handle.includes("e")) {
      width = start.width + deltaX;
    }
    if (handle.includes("n")) {
      y = start.y + deltaY;
      height = start.height - deltaY;
    }
    if (handle.includes("s")) {
      height = start.height + deltaY;
    }

    if (keepAspect && start.width > 0 && start.height > 0) {
      const ratio = start.width / start.height;
      // Drive the aspect from whichever dimension the handle changed more, so a corner drag
      // follows the pointer rather than fighting it.
      if (Math.abs(width - start.width) >= Math.abs(height - start.height)) height = width / ratio;
      else width = height * ratio;

      if (handle.includes("n")) y = start.y + start.height - height;
      if (handle.includes("w")) x = start.x + start.width - width;
    }

    return { x, y, width: Math.max(4, width), height: Math.max(4, height) };
  }

  // ------------------------------------------------------------------ drop, zoom, deselect

  #onDragOver = (event: DragEvent) => {
    if (!event.dataTransfer?.types.includes("application/x-di-palette-item")) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    this._dropTarget = true;
  };

  #onDragLeave = () => {
    this._dropTarget = false;
  };

  #onDrop = (event: DragEvent) => {
    this._dropTarget = false;

    const payload = event.dataTransfer?.getData("application/x-di-palette-item");
    if (!payload) return;

    event.preventDefault();
    const point = this.#toImagePixels(event.clientX, event.clientY);

    this.dispatchEvent(
      new CustomEvent("di-palette-drop", {
        bubbles: true,
        composed: true,
        detail: { payload: JSON.parse(payload), x: point.x, y: point.y, targetKey: this.#layerUnder(event) },
      }),
    );
  };

  /**
   * Which layer the pointer was over when something was dropped. A free hit-test - the event's
   * own composed path already went through the layer box - with no geometry to get wrong. Used
   * by a dropped Yes/No property to know which layer it should control.
   */
  #layerUnder(event: DragEvent): string | undefined {
    const box = event.composedPath().find(
      (node) => (node as HTMLElement).tagName === "DI-LAYER-BOX",
    ) as HTMLElement | undefined;

    return box?.dataset.key;
  }

  #onWheel = (event: WheelEvent) => {
    // Ctrl+wheel is the established "zoom the canvas" gesture, and trackpad pinch arrives as it.
    if (!event.ctrlKey && !event.metaKey) return;

    event.preventDefault();
    const next = this.scale * (event.deltaY < 0 ? 1.1 : 1 / 1.1);

    this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: true, composed: true, detail: { zoom: next } }));
  };

  /** A layer box changed size on its own (text reflowed): layers tracking it have to follow. */
  #onLayerBoxResize = () => {
    if (this.template?.layers.some((layer) => isRelative(layer.position))) this.requestUpdate();
  };

  #onStagePointerDown = (event: PointerEvent) => {
    // A press on bare stage means "nothing selected", which is how the inspector switches back to
    // the canvas settings.
    if (event.target === event.currentTarget) {
      this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: true, composed: true, detail: { key: undefined } }));
    }
  };

  // ------------------------------------------------------------------ rendering

  render() {
    if (!this.template) return nothing;

    const canvas = this.template.canvas;
    const width = canvas.width * this.scale;
    const height = canvas.height * this.scale;
    const boundsByKey = new Map(this.serverBounds.map((bounds) => [bounds.key, bounds] as const));
    this.#resolveLayout();

    // The rulers live in a gutter outside the stage, so they never cover the design itself.
    const gutter = this.showRulers ? RULER_THICKNESS : 0;

    return html`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${this.#onWheel}
        @dragover=${this.#onDragOver}
        @dragleave=${this.#onDragLeave}
        @drop=${this.#onDrop}
        @di-layer-drag-start=${this.#onDragStart}
        @di-layer-box-resize=${this.#onLayerBoxResize}>
        <div
          class="artboard"
          style=${styleMap({
            width: `${width + gutter}px`,
            height: `${height + gutter}px`,
            "--di-gutter": `${gutter}px`,
          })}>
          ${this.showRulers
            ? html`<di-rulers
                .canvasWidth=${canvas.width}
                .canvasHeight=${canvas.height}
                .scale=${this.scale}
                .pointer=${this._pointer}>
              </di-rulers>`
            : nothing}

          <div
            class="stage"
            style=${styleMap({ background: canvas.background })}
            @pointerdown=${this.#onStagePointerDown}
            @pointerleave=${() => {
              this._pointer = undefined;
            }}>
            ${this.baseImageUrl
              ? html`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${styleMap({ objectFit: canvas.baseImageFit === "stretch" ? "fill" : canvas.baseImageFit })} />`
              : nothing}

            ${repeat(
              this.template.layers,
              (layer) => layer.key,
              (layer) => html`
                <di-layer-box
                  data-key=${layer.key}
                  .layer=${layer}
                  .scale=${this.scale}
                  .selected=${layer.key === this.selectedLayerKey}
                  .measured=${boundsByKey.get(layer.key)}
                  .showMeasured=${this.showMeasured}
                  .resolvedText=${boundsByKey.get(layer.key)?.resolvedText ?? undefined}
                  .resolvedPosition=${this.#resolved.get(layer.key)?.position}>
                </di-layer-box>
              `,
            )}

            ${this.showSafeArea ? this.#renderSafeArea() : nothing}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Where the major networks crop an OG image. Roughly: the centre 1.91:1 area survives
   * everywhere, and the outer band is what gets eaten on a narrow card.
   */
  #renderSafeArea() {
    const canvas = this.template.canvas;
    const safeHeight = canvas.width / 1.91;
    const inset = Math.max(0, (canvas.height - safeHeight) / 2) * this.scale;

    return html`<div class="safe-area" style=${styleMap({ top: `${inset}px`, bottom: `${inset}px` })}></div>`;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }

    .viewport {
      width: 100%;
      height: 100%;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      /* Hard-coded: a checkerboard has to read as "nothing here" in both light and dark
         backoffice themes, and no UUI token means that. */
      background-color: #26262b;
      background-image:
        linear-gradient(45deg, #303036 25%, transparent 25%),
        linear-gradient(-45deg, #303036 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #303036 75%),
        linear-gradient(-45deg, transparent 75%, #303036 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0;
    }

    .viewport.drop-target {
      outline: 2px dashed var(--uui-color-focus);
      outline-offset: -8px;
    }

    .artboard {
      position: relative;
      flex: 0 0 auto;
    }

    .stage {
      position: absolute;
      top: var(--di-gutter, 0px);
      left: var(--di-gutter, 0px);
      right: 0;
      bottom: 0;
      overflow: hidden;
      /* The shadow belongs to the artboard proper, not to the ruler gutter. */
      box-shadow: var(--uui-shadow-depth-5, 0 20px 40px rgba(0, 0, 0, 0.45));
    }

    .base {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .safe-area {
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1px dashed rgba(255, 255, 255, 0.35);
      border-bottom: 1px dashed rgba(255, 255, 255, 0.35);
      pointer-events: none;
      z-index: 20;
    }
  `;
}

export default DiDesignerCanvasElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-designer-canvas": DiDesignerCanvasElement;
  }
}
