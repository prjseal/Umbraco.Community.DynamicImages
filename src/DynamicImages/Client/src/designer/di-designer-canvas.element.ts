import { classMap, css, customElement, html, nothing, property, repeat, state, styleMap } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { DiLayer, DiLayerBounds, DiPosition, DiTemplate } from "../api/types.js";
import { anchorToTopLeft, positionForTopLeft, topLeftToAnchor, type Box } from "../models/anchor.js";
import { gradientCss } from "../models/gradient-css.js";
import { checkerboard } from "./checkerboard.js";
import { isRelative, isTracked, resolveAll, type ResolvedLayer, type Size } from "../models/relative-layout.js";
import { extent, normalise, rotatePoint, toLocal } from "../models/rotation.js";
import { snap, type Guide } from "./snap.js";
import { isTypingTarget } from "./keyboard.js";
import type { DragHandle, LayerDragEventDetail, ResizeHandle } from "./di-layer-box.element.js";
import "./di-layer-box.element.js";
import "./di-guides.element.js";
import "./di-rulers.element.js";

/** Screen pixels within which a drag snaps. Divided by the scale so it feels the same at any zoom. */
const SNAP_THRESHOLD_PX = 6;

/** Must match di-rulers' own thickness - it is the width of the gutter they sit in. */
const RULER_THICKNESS = 20;

/**
 * Slack between the artboard at fit and the viewport's content box.
 *
 * The fit used to be measured from `.viewport` - the overflow:auto box whose scrollbar the
 * artboard it sizes is what causes. Overflow shrank the measurement, which shrank the artboard,
 * which cleared the overflow, which grew the measurement back, so both scrollbars flickered on
 * every interaction. Measuring the host instead breaks that loop by construction: the host is
 * overflow:hidden, so its client size cannot move in response to its own content.
 *
 * That leaves the second half of it. At fit the artboard came out sized to *exactly* the content
 * box, dead level with the overflow threshold, where sub-pixel layout rounding decides which side
 * you land on - and a vertical scrollbar stealing width tips the horizontal axis, which steals
 * height. These two pixels keep the artboard off that edge.
 */
const FIT_HEADROOM = 2;

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

interface PanState {
  pointerId: number;
  startX: number;
  startY: number;
  scrollLeft: number;
  scrollTop: number;
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

  /** Space is held with the pointer over the canvas: the next press pans instead of editing. */
  @state()
  private _spaceHeld = false;

  @state()
  private _panning = false;

  #drag?: DragState;
  #pan?: PanState;
  #hovering = false;
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
    window.addEventListener("keydown", this.#onKeyDown);
    window.addEventListener("keyup", this.#onKeyUp);
    window.addEventListener("blur", this.#onWindowBlur);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.#resizeObserver?.disconnect();
    window.removeEventListener("pointermove", this.#onPointerMove);
    window.removeEventListener("pointerup", this.#onPointerUp);
    window.removeEventListener("pointercancel", this.#onPointerUp);
    window.removeEventListener("keydown", this.#onKeyDown);
    window.removeEventListener("keyup", this.#onKeyUp);
    window.removeEventListener("blur", this.#onWindowBlur);
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
    if (!this.template) return;

    // `.viewport` is width/height 100% in a display:block host with no border or padding, so its
    // border box *is* the host's content box. The only difference between measuring the two is the
    // scrollbar - which is precisely the term that has to go.
    const padding = 48 + (this.showRulers ? RULER_THICKNESS : 0) + FIT_HEADROOM;
    const available = {
      width: Math.max(1, this.clientWidth - padding),
      height: Math.max(1, this.clientHeight - padding),
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
    this.#trackPointer(event.clientX, event.clientY);

    const pan = this.#pan;
    if (pan) {
      if (event.pointerId !== pan.pointerId) return;

      const viewport = this.#viewport();
      if (viewport) {
        viewport.scrollLeft = pan.scrollLeft - (event.clientX - pan.startX);
        viewport.scrollTop = pan.scrollTop - (event.clientY - pan.startY);
      }
      return;
    }

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

    // A shape with its aspect locked (a circle, say) resizes as though Shift were held.
    const keepAspect = event.shiftKey || (layer.type === "rect" && layer.lockAspect === true);

    if (drag.handle && rotation !== 0) {
      this.#resizeRotated(layer, drag, drag.handle, deltaX, deltaY, keepAspect, lockX, lockY);
      return;
    }

    let proposed = drag.handle
      ? this.#resizeBox(drag.startBox, drag.handle, deltaX, deltaY, keepAspect)
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

  #onPointerUp = (event: PointerEvent) => {
    if (this.#pan) {
      if (event.pointerId !== this.#pan.pointerId) return;

      this.#pan = undefined;
      this._panning = false;
      return;
    }

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

  // ------------------------------------------------------------------ pointer tracking, panning

  /**
   * The rulers' hairlines follow the pointer only while it is over the stage. Tracked anywhere
   * else, a hairline past the end of its ruler became scrollable overflow and the scrollbars came
   * and went with the mouse - and every move anywhere in the backoffice re-rendered the canvas.
   */
  #trackPointer(clientX: number, clientY: number) {
    const canvas = this.template?.canvas;
    const point = canvas ? this.#toImagePixels(clientX, clientY) : undefined;
    const next =
      canvas && point && point.x >= 0 && point.y >= 0 && point.x <= canvas.width && point.y <= canvas.height
        ? point
        : undefined;

    if (next?.x === this._pointer?.x && next?.y === this._pointer?.y) return;
    this._pointer = next;
  }

  #viewport(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(".viewport");
  }

  /**
   * Capture phase, so it decides before a layer box starts a drag: middle button, Space held, or a
   * press on the bare checkerboard around the artboard all grab the view instead. Panning moves the
   * viewport's scroll position, and every pointer conversion reads the stage's rect, so nothing
   * else has to know it happened.
   */
  #panListener = {
    capture: true,
    handleEvent: (event: PointerEvent) => {
      const viewport = event.currentTarget as HTMLElement;
      const origin = event.composedPath()[0] as HTMLElement | undefined;
      const onBare = origin === viewport || origin?.classList?.contains("artboard") === true;
      const pan = event.button === 1 || (event.button === 0 && (this._spaceHeld || onBare));
      if (!pan) return;

      // No middle-click autoscroll, no text selection, and no layer drag starting underneath.
      event.preventDefault();
      event.stopPropagation();

      try {
        viewport.setPointerCapture(event.pointerId);
      } catch {
        // Only a pointer the browser knows about can be captured; the window listeners still see the drag.
      }

      this.#pan = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        scrollLeft: viewport.scrollLeft,
        scrollTop: viewport.scrollTop,
      };
      this._panning = true;
    },
  };

  /** Chromium starts autoscroll on the middle button's mousedown, which a cancelled pointerdown may not stop. */
  #onMouseDown = (event: MouseEvent) => {
    if (event.button === 1) event.preventDefault();
  };

  #onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== " " || !this.#hovering || isTypingTarget(event)) return;

    // No page scroll, and no pressing whichever button happens to have focus.
    event.preventDefault();
    if (event.repeat) return;

    this._spaceHeld = true;
  };

  #onKeyUp = (event: KeyboardEvent) => {
    if (event.key !== " " || !this._spaceHeld) return;

    event.preventDefault();
    this._spaceHeld = false;
  };

  /** A Space released in another window never arrives here. */
  #onWindowBlur = () => {
    this._spaceHeld = false;
  };

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
        class=${classMap({
          viewport: true,
          "drop-target": this._dropTarget,
          "pan-ready": this._spaceHeld,
          panning: this._panning,
        })}
        @pointerdown=${this.#panListener}
        @mousedown=${this.#onMouseDown}
        @pointerenter=${() => {
          this.#hovering = true;
        }}
        @pointerleave=${() => {
          this.#hovering = false;
        }}
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
            style=${styleMap({
              background: canvas.backgroundGradient ? gradientCss(canvas.backgroundGradient) : canvas.background,
            })}
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
      /* Panning replaces the scrollbars; the viewport still scrolls for the wheel and trackpad. */
      scrollbar-width: none;
      display: flex;
      padding: 24px;
      box-sizing: border-box;
      /* The bare checkerboard is a handle for the view. */
      cursor: grab;
      ${checkerboard}
    }

    .viewport::-webkit-scrollbar {
      display: none;
    }

    .viewport.drop-target {
      outline: 2px dashed var(--uui-color-focus);
      outline-offset: -8px;
    }

    .viewport.pan-ready,
    .viewport.pan-ready * {
      cursor: grab;
    }

    .viewport.panning,
    .viewport.panning * {
      cursor: grabbing;
    }

    /* Layer boxes set their own cursors inside their shadow roots, which no rule here can reach -
       so while Space is held they stop taking the pointer and the stage's grab shows through. */
    .viewport.pan-ready .stage > *,
    .viewport.panning .stage > * {
      pointer-events: none;
    }

    .artboard {
      position: relative;
      flex: 0 0 auto;
      /* Centres the artboard while it fits. Flex centring pushed the overflow of a zoomed-in
         artboard off both edges, and only the right and bottom can be scrolled to; auto margins
         collapse to zero instead, so every edge stays reachable. */
      margin: auto;
    }

    .stage {
      cursor: default;
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
