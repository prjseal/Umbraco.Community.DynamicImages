import { css, customElement, html, nothing, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { ManifestWorkspaceView } from "@umbraco-cms/backoffice/workspace";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL } from "@umbraco-cms/backoffice/media";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import type { DiFont, DiLayer, DiLayerBounds, DiPosition, DiProperty, DiTemplate } from "../../api/types.js";
import { detach, isTracked, type Axis } from "../../models/relative-layout.js";
import type { DiDesignerCanvasElement } from "../../designer/di-designer-canvas.element.js";
import { fetchImageInfo, fetchLayout } from "../../api/dynamic-images-api.js";
import {
  createBadgesLayer, createImageLayer, createLayerForProperty, createRectLayer, createTextLayer,
} from "../../models/layer-factories.js";
import { loadFonts } from "../../designer/fonts/font-face-loader.js";
import type { PalettePayload } from "../../designer/di-property-palette.element.js";
import "../../designer/di-designer-canvas.element.js";
import "../../designer/di-property-palette.element.js";
import "../../designer/di-layer-inspector.element.js";
import "../../designer/di-layers-panel.element.js";
import "../../designer/di-canvas-toolbar.element.js";
import "./di-preview-strip.element.js";

/** How long to wait after the last change before asking the server to re-measure the layout. */
const LAYOUT_DEBOUNCE_MS = 400;

/**
 * The designer: palette | canvas | inspector, with the layers panel under the inspector and a
 * live preview strip along the bottom.
 */
@customElement("di-design-view")
export class DiDesignViewElement extends UmbLitElement {
  /** Assigned by the workspace editor once the view is instantiated. */
  manifest?: ManifestWorkspaceView;

  #context?: DiTemplateWorkspaceContext;
  #modalContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
  #layoutTimer?: number;
  #layoutAbort?: AbortController;

  @state()
  private _template?: DiTemplate;

  @state()
  private _selectedKey?: string;

  @state()
  private _properties: DiProperty[] = [];

  @state()
  private _fonts: DiFont[] = [];

  @state()
  private _serverBounds: DiLayerBounds[] = [];

  @state()
  private _baseImageUrl?: string;

  @state()
  private _zoom?: number;

  @state()
  private _snapEnabled = true;

  @state()
  private _showRulers = true;

  @state()
  private _showSafeArea = false;

  @state()
  private _showMeasured = false;

  @state()
  private _canUndo = false;

  @state()
  private _canRedo = false;

  constructor() {
    super();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (context) => {
      this.#modalContext = context;
    });

    this.consumeContext(DI_TEMPLATE_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
      if (!context) return;

      this.observe(context.template, (template) => {
        this._template = template;
        if (template) {
          void this.#ensureFontsLoaded(template);
          void this.#resolveBaseImageUrl(template);
          this.#scheduleLayout();
        }
      });
      this.observe(context.selectedLayerKey, (key) => {
        this._selectedKey = key;
      });
      this.observe(context.properties, (properties) => {
        this._properties = properties ?? [];
      });
      this.observe(context.fonts, (fonts) => {
        this._fonts = fonts ?? [];
      });
      this.observe(context.serverBounds, (bounds) => {
        this._serverBounds = bounds ?? [];
      });
      this.observe(context.canUndo, (value) => {
        this._canUndo = value ?? false;
      });
      this.observe(context.canRedo, (value) => {
        this._canRedo = value ?? false;
      });
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.#onKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.#onKeyDown);
    window.clearTimeout(this.#layoutTimer);
    this.#layoutAbort?.abort();
  }

  get #selectedLayer(): DiLayer | undefined {
    return this._template?.layers.find((layer) => layer.key === this._selectedKey);
  }

  /** The canvas holds the resolved positions, because it is what measures the rendered boxes. */
  get #canvas(): DiDesignerCanvasElement | null {
    return this.renderRoot.querySelector("di-designer-canvas");
  }

  /**
   * Removes one axis' link, keeping the layer exactly where it is by baking in the coordinate and
   * anchor component it resolved to.
   */
  #detachAxis(key: string, axis: Axis) {
    const layer = this._template?.layers.find((candidate) => candidate.key === key);
    if (!layer) return;

    const resolved = this.#canvas?.resolvedPositionOf(key);
    this.#context?.updateLayer(key, { position: detach(layer.position, axis, resolved) } as Partial<DiLayer>);
  }

  /**
   * Deleting a layer others are positioned against detaches them first, so they stay where they
   * were drawn rather than snapping back to a stale fallback coordinate.
   */
  #removeLayer(key: string) {
    const resolved = new Map<string, DiPosition>();

    for (const layer of this._template?.layers ?? []) {
      const position = this.#canvas?.resolvedPositionOf(layer.key);
      if (position) resolved.set(layer.key, position);
    }

    this.#context?.removeLayer(key, resolved);
  }

  // ------------------------------------------------------------------ fonts and base image

  async #ensureFontsLoaded(template: DiTemplate) {
    const keys = template.layers.flatMap((layer) =>
      layer.type === "text" ? [layer.style.fontKey] : layer.type === "badges" ? [layer.label.fontKey] : [],
    );

    if (keys.length > 0 && this.#context) await loadFonts(keys, this.#context.getToken);
  }

  /** The canvas draws the base image directly, so the media item's own URL is needed. */
  async #resolveBaseImageUrl(template: DiTemplate) {
    const baseImage = template.canvas.baseImage;

    if (baseImage.kind === "path" && baseImage.path) {
      this._baseImageUrl = baseImage.path;
      return;
    }

    if (baseImage.kind !== "media" || !baseImage.mediaKey || !this.#context) {
      this._baseImageUrl = undefined;
      return;
    }

    const info = await fetchImageInfo(baseImage.mediaKey, this.#context.getToken).catch(() => undefined);
    this._baseImageUrl = info?.url;
  }

  // ------------------------------------------------------------------ server layout

  /**
   * Asks the server where the layers actually landed. Debounced and abortable, so dragging does
   * not queue a request per pointer event.
   */
  #scheduleLayout() {
    window.clearTimeout(this.#layoutTimer);

    this.#layoutTimer = window.setTimeout(async () => {
      const template = this._template;
      if (!template || !this.#context) return;

      this.#layoutAbort?.abort();
      this.#layoutAbort = new AbortController();

      try {
        const layout = await fetchLayout(
          template,
          { signal: this.#layoutAbort.signal, useSampleData: true },
          this.#context.getToken,
        );

        this.#context.setServerBounds(layout.layers);
        this.#context.setIssues(layout.issues);
      } catch (error) {
        // An abort is the normal outcome of a fast drag, not a failure worth reporting.
        if ((error as Error)?.name !== "AbortError") {
          console.warn("[DynamicImages] Layout measurement failed", error);
        }
      }
    }, LAYOUT_DEBOUNCE_MS);
  }

  // ------------------------------------------------------------------ palette

  #addFromPayload(payload: PalettePayload, x?: number, y?: number) {
    const template = this._template;
    if (!template || !this.#context) return;

    // A new text layer inherits whichever font the design already leans on, so it is legible
    // straight away rather than defaulting to nothing.
    const context = { template, x, y, defaultFontKey: this.#defaultFontKey() };

    const layer =
      payload.kind === "property"
        ? createLayerForProperty(payload.property, context)
        : payload.layerType === "image"
          ? createImageLayer(context, "Image")
          : payload.layerType === "badges"
            ? createBadgesLayer(context, "Badges", "")
            : payload.layerType === "rect"
              ? createRectLayer(context)
              : createTextLayer(context, "Text", { kind: "static", text: "Text" });

    this.#context.addLayer(layer);
  }

  #defaultFontKey(): string | undefined {
    const used = this._template?.layers.flatMap((layer) =>
      layer.type === "text" ? [layer.style.fontKey] : layer.type === "badges" ? [layer.label.fontKey] : [],
    ).filter(Boolean);

    return used?.[0] ?? this._fonts[0]?.key;
  }

  // ------------------------------------------------------------------ media pickers

  async #pickBaseImage() {
    const mediaKey = await this.#pickMedia();
    if (!mediaKey) return;

    this.#context?.updateCanvas({ baseImage: { kind: "media", mediaKey } });
  }

  async #pickLayerImage(key: string) {
    const mediaKey = await this.#pickMedia();
    if (!mediaKey) return;

    this.#context?.updateLayer(key, { source: { kind: "media", mediaKey } } as Partial<DiLayer>);
  }

  async #pickMedia(): Promise<string | undefined> {
    if (!this.#modalContext) return undefined;

    const modal = this.#modalContext.open(this, UMB_MEDIA_PICKER_MODAL, { data: { multiple: false } });
    const result = await modal?.onSubmit().catch(() => undefined);

    return result?.selection[0] ?? undefined;
  }

  /** Sizes the canvas to the base image, which is almost always what is wanted after picking one. */
  async #useImageSize() {
    const baseImage = this._template?.canvas.baseImage;
    if (baseImage?.kind !== "media" || !baseImage.mediaKey || !this.#context) return;

    const info = await fetchImageInfo(baseImage.mediaKey, this.#context.getToken).catch(() => undefined);
    if (info) this.#context.updateCanvas({ width: info.width, height: info.height });
  }

  // ------------------------------------------------------------------ keyboard

  #onKeyDown = (event: KeyboardEvent) => {
    // Never steal keys from a field the editor is typing in.
    const target = event.composedPath()[0] as HTMLElement | undefined;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    if (target?.isContentEditable) return;

    const context = this.#context;
    if (!context) return;

    const meta = event.ctrlKey || event.metaKey;

    if (meta && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) context.redo();
      else context.undo();
      return;
    }

    const layer = this.#selectedLayer;
    if (!layer) return;

    if (meta && event.key.toLowerCase() === "d") {
      event.preventDefault();
      context.duplicateLayer(layer.key);
      return;
    }

    switch (event.key) {
      case "Delete":
      case "Backspace":
        event.preventDefault();
        this.#removeLayer(layer.key);
        break;

      case "Escape":
        context.selectLayer(undefined);
        break;

      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();

        // Shift nudges by ten, matching every design tool.
        const step = event.shiftKey ? 10 : 1;
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;

        // An axis that tracks another layer is not the keyboard's to move either.
        const moveX = isTracked(layer.position, "x") ? 0 : dx;
        const moveY = isTracked(layer.position, "y") ? 0 : dy;
        if (moveX === 0 && moveY === 0) break;

        context.updateLayer(layer.key, {
          position: { ...layer.position, x: layer.position.x + moveX, y: layer.position.y + moveY },
        } as Partial<DiLayer>);
        break;
      }

      case "[":
      case "]": {
        const index = this._template?.layers.findIndex((candidate) => candidate.key === layer.key) ?? -1;
        if (index < 0) return;

        event.preventDefault();
        context.moveLayer(layer.key, event.key === "]" ? index + 1 : index - 1);
        break;
      }
    }
  };

  // ------------------------------------------------------------------ rendering

  render() {
    if (!this._template) return html`<div class="state"><uui-loader></uui-loader></div>`;

    return html`
      <div
        class="layout"
        @di-layer-change=${(event: CustomEvent) => this.#context?.updateLayer(event.detail.key, event.detail.patch)}
        @di-canvas-change=${(event: CustomEvent) => this.#context?.updateCanvas(event.detail.patch)}
        @di-layer-select=${(event: CustomEvent) => this.#context?.selectLayer(event.detail.key)}
        @di-layer-delete=${(event: CustomEvent) => this.#removeLayer(event.detail.key)}
        @di-layer-detach=${(event: CustomEvent) => this.#detachAxis(event.detail.key, event.detail.axis)}
        @di-layer-duplicate=${(event: CustomEvent) => this.#context?.duplicateLayer(event.detail.key)}
        @di-layer-move=${(event: CustomEvent) => this.#context?.moveLayer(event.detail.key, event.detail.toIndex)}
        @di-layer-visibility=${(event: CustomEvent) =>
          this.#context?.setLayerVisible(event.detail.key, event.detail.isVisible)}
        @di-layer-lock=${(event: CustomEvent) => this.#context?.setLayerLocked(event.detail.key, event.detail.isLocked)}
        @di-transaction-begin=${() => this.#context?.beginTransaction()}
        @di-transaction-end=${(event: CustomEvent) => this.#context?.endTransaction(event.detail?.moved ?? true)}
        @di-palette-add=${(event: CustomEvent) => this.#addFromPayload(event.detail.payload)}
        @di-palette-drop=${(event: CustomEvent) =>
          this.#addFromPayload(event.detail.payload, event.detail.x, event.detail.y)}
        @di-pick-base-image=${this.#pickBaseImage}
        @di-pick-layer-image=${(event: CustomEvent) => this.#pickLayerImage(event.detail.key)}
        @di-use-image-size=${this.#useImageSize}
        @di-zoom-change=${(event: CustomEvent) => {
          this._zoom = Math.max(0.1, Math.min(4, event.detail.zoom));
        }}
        @di-zoom-fit=${() => {
          this._zoom = undefined;
        }}
        @di-toggle-snap=${() => {
          this._snapEnabled = !this._snapEnabled;
        }}
        @di-toggle-rulers=${() => {
          this._showRulers = !this._showRulers;
        }}
        @di-toggle-safe-area=${() => {
          this._showSafeArea = !this._showSafeArea;
        }}
        @di-toggle-measured=${() => {
          this._showMeasured = !this._showMeasured;
        }}
        @di-undo=${() => this.#context?.undo()}
        @di-redo=${() => this.#context?.redo()}>
        <di-property-palette class="palette" .properties=${this._properties}></di-property-palette>

        <div class="centre">
          <di-canvas-toolbar
            .zoom=${this._zoom ?? 1}
            .snapEnabled=${this._snapEnabled}
            .showRulers=${this._showRulers}
            .showSafeArea=${this._showSafeArea}
            .showMeasured=${this._showMeasured}
            .canUndo=${this._canUndo}
            .canRedo=${this._canRedo}>
          </di-canvas-toolbar>

          <di-designer-canvas
            .template=${this._template}
            .selectedLayerKey=${this._selectedKey}
            .baseImageUrl=${this._baseImageUrl}
            .serverBounds=${this._serverBounds}
            .showMeasured=${this._showMeasured}
            .snapEnabled=${this._snapEnabled}
            .showRulers=${this._showRulers}
            .showSafeArea=${this._showSafeArea}
            .zoom=${this._zoom}>
          </di-designer-canvas>

          <di-preview-strip></di-preview-strip>
        </div>

        <div class="side">
          <di-layer-inspector
            .template=${this._template}
            .layer=${this.#selectedLayer}
            .properties=${this._properties}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }

    .state {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-layout-3);
    }

    .layout {
      display: grid;
      grid-template-columns: 250px 1fr 340px;
      height: 100%;
      min-height: 0;
    }

    .centre {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-width: 0;
      min-height: 0;
    }

    .side {
      display: grid;
      grid-template-rows: 1fr auto;
      min-height: 0;
    }

    /* Below this width the three columns stop being usable; the inspector and layers move under
       the canvas rather than squeezing it to nothing. */
    @media (max-width: 1280px) {
      .layout {
        grid-template-columns: 200px 1fr;
        grid-template-rows: 1fr auto;
      }

      .side {
        grid-column: 1 / -1;
        grid-template-rows: auto auto;
        max-height: 45vh;
        overflow: auto;
      }
    }

    @media (max-width: 860px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .palette {
        max-height: 30vh;
      }
    }
  `;
}

export default DiDesignViewElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-design-view": DiDesignViewElement;
  }
}
