import { css, customElement, html, ifDefined, nothing, property, repeat } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type {
  Anchor, DiBadgesLayer, DiFont, DiGradient, DiImageLayer, DiLayer, DiPosition, DiProperty, DiRectLayer,
  DiTemplate, DiTextLayer, PropertyClassification, RelativeEdge, ShapeKind,
} from "../api/types.js";
import { reanchor } from "../models/anchor.js";
import { canvasFill, withAlpha, type CanvasFill } from "../models/canvas-fill.js";
import { createGradient } from "../models/layer-factories.js";
import { DEFAULT_RELATIVE_GAP, isTracked, referenceOn, type Axis } from "../models/relative-layout.js";
import { MAX_HOPS, pathPrefix, pathSegments } from "../models/property-path.js";
import { propertyOptions } from "../models/property-options.js";
import { normalise } from "../models/rotation.js";
import { MAX_INNER_RATIO, MAX_SIDES, MIN_INNER_RATIO, MIN_SIDES } from "../models/shape-geometry.js";
import "../inputs/di-colour-input.element.js";
import "../inputs/di-anchor-picker.element.js";
import { INSPECTOR_BOUNDS } from "../inputs/number-bounds.js";
import "../inputs/di-number-field.element.js";

/** One classification, or several - an image source accepts both media and content properties. */
type Classification = PropertyClassification | PropertyClassification[];

const filterByClassification = (properties: DiProperty[], classification?: Classification): DiProperty[] => {
  if (!classification) return properties;

  const kinds = Array.isArray(classification) ? classification : [classification];

  return properties.filter((property) => kinds.includes(property.classification));
};

/**
 * Everything about the selected layer, or - with nothing selected - the canvas itself, so the
 * panel is never empty and there is always somewhere obvious to set the base image.
 */
@customElement("di-layer-inspector")
export class DiLayerInspectorElement extends UmbLitElement {
  @property({ type: Object })
  template!: DiTemplate;

  @property({ type: Object })
  layer?: DiLayer;

  @property({ type: Array })
  properties: DiProperty[] = [];

  /**
   * The properties reachable through each content reference, keyed by the dotted prefix they sit
   * behind - `author`, then `author.employer`. Loaded eagerly by the workspace context, so each
   * hop's list is already here when the editor picks the hop before it.
   */
  @property({ type: Object })
  linkedProperties: Record<string, DiProperty[]> = {};

  /** Per dotted prefix, the caption over its hop: "Property on the linked Author". */
  @property({ type: Object })
  linkedCaptions: Record<string, string> = {};

  @property({ type: Array })
  fonts: DiFont[] = [];

  #patch(patch: Partial<DiLayer>) {
    if (!this.layer) return;

    this.dispatchEvent(
      new CustomEvent("di-layer-change", {
        bubbles: true,
        composed: true,
        detail: { key: this.layer.key, patch },
      }),
    );
  }

  #canvas(patch: Partial<DiTemplate["canvas"]>) {
    this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: true, composed: true, detail: { patch } }));
  }

  render() {
    if (!this.template) return nothing;

    return html`<div class="inspector">${this.layer ? this.#renderLayer(this.layer) : this.#renderCanvas()}</div>`;
  }

  // ------------------------------------------------------------------ canvas

  #renderCanvas() {
    const canvas = this.template.canvas;

    return html`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${INSPECTOR_BOUNDS.width.min}
            .max=${INSPECTOR_BOUNDS.width.max}
            label="Width"
            .value=${canvas.width}
            @change=${(event: CustomEvent) => this.#canvas({ width: event.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${INSPECTOR_BOUNDS.height.min}
            .max=${INSPECTOR_BOUNDS.height.max}
            label="Height"
            .value=${canvas.height}
            @change=${(event: CustomEvent) => this.#canvas({ height: event.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${this.#renderCanvasFill(canvas)}

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${canvas.baseImage.kind}
              .options=${sourceKindOptions(canvas.baseImage.kind)}
              @change=${(event: Event) =>
                this.#canvas({
                  baseImage: { ...canvas.baseImage, kind: (event.target as HTMLSelectElement).value as never },
                })}>
            </uui-select>
            <uui-button
              look="secondary"
              label="Choose a base image from the media library"
              @click=${() => this.dispatchEvent(new CustomEvent("di-pick-base-image", { bubbles: true, composed: true }))}>
              Choose
            </uui-button>
          </div>
        </label>

        ${canvas.baseImage.kind === "path"
          ? html`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${canvas.baseImage.path ?? ""}
                placeholder="/assets/og-background.png"
                @change=${(event: Event) =>
                  this.#canvas({
                    baseImage: { ...canvas.baseImage, path: (event.target as HTMLInputElement).value },
                  })}>
              </uui-input>
            </label>`
          : nothing}

        ${canvas.baseImage.kind === "property"
          ? html`<label class="field">
              <span>From property</span>
              ${this.#propertyPathSelect(canvas.baseImage.propertyAlias ?? "", (alias) =>
                this.#canvas({ baseImage: { ...canvas.baseImage, propertyAlias: alias } }),
                { root: ["media", "content"], tail: "media" })}
            </label>`
          : nothing}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${canvas.baseImageFit}
            .options=${optionsFrom(["cover", "contain", "stretch"], canvas.baseImageFit)}
            @change=${(event: Event) =>
              this.#canvas({ baseImageFit: (event.target as HTMLSelectElement).value as never })}>
          </uui-select>
        </label>

        <uui-button
          look="secondary"
          label="Set the canvas to the base image's own size"
          @click=${() => this.dispatchEvent(new CustomEvent("di-use-image-size", { bubbles: true, composed: true }))}>
          Use image size
        </uui-button>
      </uui-box>

      <p class="hint">Select a layer to edit it, or drag a property from the left onto the canvas.</p>
    `;
  }

  /**
   * The canvas's fill: a colour, a gradient, or nothing. Three states, so a picker rather than
   * the shape panel's toggle - and a projection of the two fields that already say which it is,
   * not a fourth field to keep in sync.
   */
  #renderCanvasFill(canvas: DiTemplate["canvas"]) {
    const mode = canvasFill(canvas);

    return html`
      <label class="field">
        <span>Fill</span>
        <uui-select
          .value=${mode}
          .options=${optionsFrom(["colour", "gradient", "transparent"], mode)}
          @change=${(event: Event) => this.#setCanvasFill(canvas, (event.target as HTMLSelectElement).value as CanvasFill)}>
        </uui-select>
      </label>

      ${mode === "colour"
        ? html`<label class="field">
            <span>Colour</span>
            <di-colour-input
              label="Canvas background"
              .value=${canvas.background}
              @change=${(event: CustomEvent) => this.#canvas({ background: event.detail.value })}>
            </di-colour-input>
          </label>`
        : nothing}

      ${mode === "gradient" && canvas.backgroundGradient
        ? this.#renderGradientFields(canvas.backgroundGradient, (next) => this.#canvas({ backgroundGradient: next }))
        : nothing}

      ${mode === "transparent"
        ? html`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>`
        : nothing}
    `;
  }

  /**
   * Each switch is a plain write, and switching to or from Transparent flips the alpha nibble on
   * the colour that is already there rather than replacing it - so an editor who tries it and
   * changes their mind gets their colour back.
   */
  #setCanvasFill(canvas: DiTemplate["canvas"], mode: CanvasFill) {
    if (mode === "gradient") {
      this.#canvas({ backgroundGradient: canvas.backgroundGradient ?? createGradient() });
      return;
    }

    this.#canvas({
      background: withAlpha(canvas.background, mode === "transparent" ? "00" : "FF"),
      backgroundGradient: null,
    });
  }

  /**
   * The gradient editor, shared by the canvas panel and the shape panel. `patch` takes the whole
   * replacement gradient, because the two panels write through different paths (`#canvas` vs
   * `#patch`) and neither should have to know about the other's.
   */
  #renderGradientFields(gradient: DiGradient, patch: (next: DiGradient) => void) {
    return html`
      <label class="field">
        <span>Type</span>
        <uui-select
          .value=${gradient.kind}
          .options=${optionsFrom(["linear", "radial"], gradient.kind)}
          @change=${(event: Event) =>
            patch({ ...gradient, kind: (event.target as HTMLSelectElement).value as DiGradient["kind"] })}>
        </uui-select>
      </label>

      <div class="pair">
        <di-colour-input
          label="From"
          .value=${gradient.from}
          @change=${(event: CustomEvent) => patch({ ...gradient, from: event.detail.value })}>
        </di-colour-input>
        <di-colour-input
          label="To"
          .value=${gradient.to}
          @change=${(event: CustomEvent) => patch({ ...gradient, to: event.detail.value })}>
        </di-colour-input>
      </div>

      ${gradient.kind === "radial"
        ? html`<div class="pair">
            ${this.#renderCentreField("Centre X", gradient.centreX, (value) => patch({ ...gradient, centreX: value }))}
            ${this.#renderCentreField("Centre Y", gradient.centreY, (value) => patch({ ...gradient, centreY: value }))}
          </div>`
        : html`<di-number-field
            .min=${INSPECTOR_BOUNDS.gradientAngle.min}
            .max=${INSPECTOR_BOUNDS.gradientAngle.max}
            label="Angle"
            suffix="°"
            .value=${gradient.angle}
            @change=${(event: CustomEvent) => patch({ ...gradient, angle: event.detail.value ?? 180 })}>
          </di-number-field>`}
    `;
  }

  /** Percent in, fraction stored - the x100 / divide-by-100 the zoom toolbar already does. */
  #renderCentreField(label: string, value: number, patch: (next: number) => void) {
    return html`<di-number-field
      .min=${INSPECTOR_BOUNDS.gradientCentre.min * 100}
      .max=${INSPECTOR_BOUNDS.gradientCentre.max * 100}
      label=${label}
      suffix="%"
      .value=${Math.round((value ?? 0.5) * 100)}
      @change=${(event: CustomEvent) => patch((event.detail.value ?? 50) / 100)}>
    </di-number-field>`;
  }

  // ------------------------------------------------------------------ layer

  #renderLayer(layer: DiLayer) {
    return html`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${layer.name}
          @change=${(event: Event) => this.#patch({ name: (event.target as HTMLInputElement).value } as Partial<DiLayer>)}>
        </uui-input>
        <uui-tag look="secondary">${layer.type}</uui-tag>
      </div>

      ${layer.type === "text" ? this.#renderTextContent(layer) : nothing}
      ${layer.type === "text" ? this.#renderTypography(layer) : nothing}
      ${layer.type === "image" ? this.#renderImage(layer) : nothing}
      ${layer.type === "badges" ? this.#renderBadges(layer) : nothing}
      ${layer.type === "rect" ? this.#renderShape(layer) : nothing}
      ${this.#renderLayout(layer)} ${this.#renderBehaviour(layer)}
    `;
  }

  #renderTextContent(layer: DiTextLayer) {
    const binding = layer.binding;

    return html`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${binding.kind}
            .options=${optionsFrom(
              ["property", "nodeName", "readingTime", "date", "static", "expression"],
              binding.kind,
              {
                property: "A property",
                nodeName: "The page name",
                readingTime: "Reading time",
                date: "A date",
                static: "Fixed text",
                expression: "Expression",
              },
            )}
            @change=${(event: Event) =>
              this.#patch({
                binding: { ...binding, kind: (event.target as HTMLSelectElement).value as never },
              } as Partial<DiLayer>)}>
          </uui-select>
        </label>

        ${binding.kind === "property" || binding.kind === "date" || binding.kind === "readingTime"
          ? this.#field("Property", this.#propertyPathSelect(binding.propertyAlias ?? "", (alias) =>
              this.#patch({ binding: { ...binding, propertyAlias: alias } } as Partial<DiLayer>)))
          : nothing}

        ${binding.kind === "date"
          ? html`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${binding.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(event: Event) =>
                  this.#patch({
                    binding: { ...binding, format: (event.target as HTMLInputElement).value },
                  } as Partial<DiLayer>)}>
              </uui-input>
            </label>`
          : nothing}

        ${binding.kind === "static" || binding.kind === "expression"
          ? html`<label class="field">
              <span>${binding.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${binding.text ?? ""}
                @change=${(event: Event) =>
                  this.#patch({
                    binding: { ...binding, text: (event.target as HTMLTextAreaElement).value },
                  } as Partial<DiLayer>)}>
              </uui-textarea>
              ${binding.kind === "expression"
                ? html`<small class="hint">
                    Tokens: <code>{name}</code>, <code>{readingTime}</code>, <code>{prop:alias}</code>,
                    <code>{date:alias:format}</code>
                  </small>`
                : nothing}
            </label>`
          : nothing}

        <div class="pair">
          <label class="field">
            <span>Prefix</span>
            <uui-input
              .value=${layer.prefix ?? ""}
              @change=${(event: Event) => this.#patch({ prefix: (event.target as HTMLInputElement).value } as Partial<DiLayer>)}>
            </uui-input>
          </label>
          <label class="field">
            <span>Suffix</span>
            <uui-input
              .value=${layer.suffix ?? ""}
              @change=${(event: Event) => this.#patch({ suffix: (event.target as HTMLInputElement).value } as Partial<DiLayer>)}>
            </uui-input>
          </label>
        </div>
      </uui-box>
    `;
  }

  #renderTypography(layer: DiTextLayer) {
    const style = layer.style;
    const patchStyle = (patch: Partial<DiTextLayer["style"]>) =>
      this.#patch({ style: { ...style, ...patch } } as Partial<DiLayer>);

    return html`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${style.fontKey}
            .options=${this.#fontOptions(style.fontKey)}
            @change=${(event: Event) => patchStyle({ fontKey: (event.target as HTMLSelectElement).value })}>
          </uui-select>
        </label>

        ${this.#namedStyleSelect(style.fontKey, style.styleName ?? "", (name, size, fontStyle) =>
          patchStyle({ styleName: name || null, fontSize: size ?? style.fontSize, fontStyle: fontStyle ?? style.fontStyle }))}

        <div class="pair">
          <di-number-field
            .min=${INSPECTOR_BOUNDS.fontSize.min}
            .max=${INSPECTOR_BOUNDS.fontSize.max}
            label="Size"
            .value=${style.fontSize}
            @change=${(event: CustomEvent) => patchStyle({ fontSize: event.detail.value ?? style.fontSize })}>
          </di-number-field>
          <label class="field">
            <span>Weight</span>
            <uui-select
              .value=${style.fontStyle}
              .options=${optionsFrom(["Regular", "Bold", "Italic", "BoldItalic"], style.fontStyle)}
              @change=${(event: Event) => patchStyle({ fontStyle: (event.target as HTMLSelectElement).value })}>
            </uui-select>
          </label>
        </div>

        <label class="field">
          <span>Colour</span>
          <di-colour-input
            label="Text colour"
            .value=${style.colour}
            @change=${(event: CustomEvent) => patchStyle({ colour: event.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Align inside the box</span>
          <uui-select
            .value=${style.textAlign}
            .options=${optionsFrom(["left", "centre", "right"], style.textAlign)}
            @change=${(event: Event) => patchStyle({ textAlign: (event.target as HTMLSelectElement).value as never })}>
          </uui-select>
        </label>

        <div class="pair">
          <di-number-field
            .min=${INSPECTOR_BOUNDS.lineSpacing.min}
            .max=${INSPECTOR_BOUNDS.lineSpacing.max}
            label="Line spacing"
            suffix="×"
            step="0.05"
            .value=${style.lineSpacing}
            @change=${(event: CustomEvent) => patchStyle({ lineSpacing: event.detail.value ?? 1 })}>
          </di-number-field>
          <di-number-field
            .min=${INSPECTOR_BOUNDS.letterSpacing.min}
            .max=${INSPECTOR_BOUNDS.letterSpacing.max}
            label="Letter spacing"
            .value=${style.letterSpacing}
            @change=${(event: CustomEvent) => patchStyle({ letterSpacing: event.detail.value ?? 0 })}>
          </di-number-field>
        </div>

        <div class="pair">
          <di-number-field
            .min=${INSPECTOR_BOUNDS.maxLines.min}
            .max=${INSPECTOR_BOUNDS.maxLines.max}
            label="Max lines"
            suffix=""
            placeholder="No limit"
            .value=${style.maxLines ?? null}
            @change=${(event: CustomEvent) => patchStyle({ maxLines: event.detail.value })}>
          </di-number-field>
          <label class="field">
            <span>When it overflows</span>
            <uui-select
              .value=${style.overflow}
              .options=${optionsFrom(["shrink", "ellipsis", "clip"], style.overflow, {
                shrink: "Shrink to fit",
                ellipsis: "Trim with …",
                clip: "Cut off",
              })}
              @change=${(event: Event) => patchStyle({ overflow: (event.target as HTMLSelectElement).value as never })}>
            </uui-select>
          </label>
        </div>

        <label class="field">
          <span>Transform</span>
          <uui-select
            .value=${style.textTransform}
            .options=${optionsFrom(["none", "uppercase", "lowercase"], style.textTransform)}
            @change=${(event: Event) => patchStyle({ textTransform: (event.target as HTMLSelectElement).value as never })}>
          </uui-select>
        </label>
      </uui-box>
    `;
  }

  #renderImage(layer: DiImageLayer) {
    const source = layer.source;

    return html`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${source.kind}
            .options=${sourceKindOptions(source.kind)}
            @change=${(event: Event) =>
              this.#patch({
                source: { ...source, kind: (event.target as HTMLSelectElement).value as never },
              } as Partial<DiLayer>)}>
          </uui-select>
        </label>

        ${source.kind === "property"
          ? this.#field("Property", this.#propertyPathSelect(
              source.propertyAlias ?? "",
              (alias) => this.#patch({ source: { ...source, propertyAlias: alias } } as Partial<DiLayer>),
              // The root widens from media to media + content, and the media filter moves to the
              // tail: that is exactly the author.mainImage case, and it never offers a text
              // property as an image source.
              { root: ["media", "content"], tail: "media" },
            ))
          : nothing}

        ${source.kind === "path"
          ? html`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${source.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(event: Event) =>
                  this.#patch({
                    source: { ...source, path: (event.target as HTMLInputElement).value },
                  } as Partial<DiLayer>)}>
              </uui-input>
            </label>`
          : nothing}

        ${source.kind === "media"
          ? html`<uui-button
              look="secondary"
              label="Choose an image from the media library"
              @click=${() =>
                this.dispatchEvent(
                  new CustomEvent("di-pick-layer-image", { bubbles: true, composed: true, detail: { key: layer.key } }),
                )}>
              Choose image
            </uui-button>`
          : nothing}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${layer.fit}
            .options=${optionsFrom(["cover", "contain", "stretch"], layer.fit)}
            @change=${(event: Event) => this.#patch({ fit: (event.target as HTMLSelectElement).value as never } as Partial<DiLayer>)}>
          </uui-select>
        </label>

        <di-number-field
          .min=${INSPECTOR_BOUNDS.cornerRadius.min}
          .max=${INSPECTOR_BOUNDS.cornerRadius.max}
          label="Corner radius"
          .value=${layer.cornerRadius}
          @change=${(event: CustomEvent) => this.#patch({ cornerRadius: event.detail.value ?? 0 } as Partial<DiLayer>)}>
        </di-number-field>

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              .min=${INSPECTOR_BOUNDS.borderWidth.min}
              .max=${INSPECTOR_BOUNDS.borderWidth.max}
              label="Width"
              .value=${layer.border?.width ?? 0}
              @change=${(event: CustomEvent) => {
                const width = event.detail.value ?? 0;
                this.#patch({
                  border: width > 0 ? { width, colour: layer.border?.colour ?? "#FFFFFF" } : null,
                } as Partial<DiLayer>);
              }}>
            </di-number-field>
            ${layer.border
              ? html`<di-colour-input
                  label="Border colour"
                  .value=${layer.border.colour}
                  @change=${(event: CustomEvent) =>
                    this.#patch({ border: { ...layer.border!, colour: event.detail.value } } as Partial<DiLayer>)}>
                </di-colour-input>`
              : nothing}
          </div>
        </label>
      </uui-box>
    `;
  }

  #renderBadges(layer: DiBadgesLayer) {
    const patchBadge = (patch: Partial<DiBadgesLayer["badge"]>) =>
      this.#patch({ badge: { ...layer.badge, ...patch } } as Partial<DiLayer>);
    const patchLabel = (patch: Partial<DiBadgesLayer["label"]>) =>
      this.#patch({ label: { ...layer.label, ...patch } } as Partial<DiLayer>);
    const patchIcon = (patch: Partial<DiBadgesLayer["icon"]>) =>
      this.#patch({ icon: { ...layer.icon, ...patch } } as Partial<DiLayer>);

    return html`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${this.#propertyPathSelect(layer.itemsPropertyAlias, (alias) =>
            this.#patch({ itemsPropertyAlias: alias } as Partial<DiLayer>))}
        </label>

        <div class="pair">
          <di-number-field
            .min=${INSPECTOR_BOUNDS.maxItems.min}
            .max=${INSPECTOR_BOUNDS.maxItems.max}
            label="Max items"
            suffix=""
            .value=${layer.maxItems}
            @change=${(event: CustomEvent) => this.#patch({ maxItems: event.detail.value ?? 2 } as Partial<DiLayer>)}>
          </di-number-field>
          <di-number-field
            .min=${INSPECTOR_BOUNDS.gap.min}
            .max=${INSPECTOR_BOUNDS.gap.max}
            label="Gap"
            .value=${layer.gap}
            @change=${(event: CustomEvent) => this.#patch({ gap: event.detail.value ?? 40 } as Partial<DiLayer>)}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${layer.direction}
            .options=${optionsFrom(["horizontal", "vertical"], layer.direction)}
            @change=${(event: Event) =>
              this.#patch({ direction: (event.target as HTMLSelectElement).value as never } as Partial<DiLayer>)}>
          </uui-select>
        </label>

        ${layer.direction === "horizontal"
          ? html`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${layer.wrap}
                  @change=${(event: Event) =>
                    this.#patch({ wrap: (event.target as HTMLInputElement).checked } as Partial<DiLayer>)}>
                </uui-toggle>
              </label>

              ${layer.wrap
                ? html`
                    <di-number-field
                      .min=${INSPECTOR_BOUNDS.rowGap.min}
                      .max=${INSPECTOR_BOUNDS.rowGap.max}
                      label="Row gap"
                      .value=${layer.rowGap}
                      @change=${(event: CustomEvent) => this.#patch({ rowGap: event.detail.value ?? 20 } as Partial<DiLayer>)}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  `
                : nothing}
            `
          : nothing}

        <div class="pair">
          <di-number-field
            .min=${INSPECTOR_BOUNDS.circleSize.min}
            .max=${INSPECTOR_BOUNDS.circleSize.max}
            label="Circle size"
            .value=${layer.badge.size}
            @change=${(event: CustomEvent) => patchBadge({ size: event.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
            .min=${INSPECTOR_BOUNDS.iconSize.min}
            .max=${INSPECTOR_BOUNDS.iconSize.max}
            label="Icon size"
            .value=${layer.badge.innerSize}
            @change=${(event: CustomEvent) => patchBadge({ innerSize: event.detail.value ?? 44 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Circle fill</span>
          <di-colour-input
            label="Circle fill"
            .value=${layer.badge.fillColour}
            @change=${(event: CustomEvent) => patchBadge({ fillColour: event.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Circle border</span>
          <div class="row">
            <di-colour-input
              label="Circle border colour"
              .value=${layer.badge.borderColour}
              @change=${(event: CustomEvent) => patchBadge({ borderColour: event.detail.value })}>
            </di-colour-input>
            <di-number-field
              .min=${INSPECTOR_BOUNDS.borderWidth.min}
              .max=${INSPECTOR_BOUNDS.borderWidth.max}
              label="Width"
              step="0.5"
              .value=${layer.badge.borderWidth}
              @change=${(event: CustomEvent) => patchBadge({ borderWidth: event.detail.value ?? 1.5 })}>
            </di-number-field>
          </div>
        </label>

        <label class="field">
          <span>Icon folder</span>
          <uui-input
            .value=${layer.icon.basePath}
            placeholder="/assets/og-icons"
            @change=${(event: Event) => patchIcon({ basePath: (event.target as HTMLInputElement).value })}>
          </uui-input>
          <small class="hint">Icons are matched by slugifying the item's name, with default.png as a fallback.</small>
        </label>

        <label class="field">
          <span>Label position</span>
          <uui-select
            .value=${layer.label.position}
            .options=${optionsFrom(["below", "right", "none"], layer.label.position, {
              below: "Below the icon",
              right: "Beside the icon",
              none: "Icon only",
            })}
            @change=${(event: Event) => patchLabel({ position: (event.target as HTMLSelectElement).value as never })}>
          </uui-select>
          ${layer.label.position === "right"
            ? html`<small class="hint">Each badge is as wide as its own label.</small>`
            : nothing}
        </label>

        ${layer.label.position === "none"
          ? nothing
          : html`
              <label class="field">
                <span>Label font</span>
                <uui-select
                  .value=${layer.label.fontKey}
                  .options=${this.#fontOptions(layer.label.fontKey)}
                  @change=${(event: Event) => patchLabel({ fontKey: (event.target as HTMLSelectElement).value })}>
                </uui-select>
              </label>

              <div class="pair">
                <di-number-field
                  .min=${INSPECTOR_BOUNDS.labelSize.min}
                  .max=${INSPECTOR_BOUNDS.labelSize.max}
                  label="Label size"
                  .value=${layer.label.fontSize}
                  @change=${(event: CustomEvent) => patchLabel({ fontSize: event.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
                  .min=${INSPECTOR_BOUNDS.labelGap.min}
                  .max=${INSPECTOR_BOUNDS.labelGap.max}
                  label="Label gap"
                  .value=${layer.label.gap}
                  @change=${(event: CustomEvent) => patchLabel({ gap: event.detail.value ?? 10 })}>
                </di-number-field>
              </div>

              <label class="field">
                <span>Label colour</span>
                <di-colour-input
                  label="Label colour"
                  .value=${layer.label.colour}
                  @change=${(event: CustomEvent) => patchLabel({ colour: event.detail.value })}>
                </di-colour-input>
              </label>

              <label class="field">
                <span>Label transform</span>
                <uui-select
                  .value=${layer.label.textTransform}
                  .options=${optionsFrom(["none", "uppercase", "lowercase"], layer.label.textTransform)}
                  @change=${(event: Event) =>
                    patchLabel({ textTransform: (event.target as HTMLSelectElement).value as never })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
  }

  #renderShape(layer: DiRectLayer) {
    const shape = layer.shape ?? "rectangle";
    const hasFill = layer.fill !== null && layer.fill !== undefined;

    return html`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${shape}
            .options=${optionsFrom(["rectangle", "ellipse", "polygon", "star"], shape)}
            @change=${(event: Event) =>
              this.#patch({ shape: (event.target as HTMLSelectElement).value as ShapeKind } as Partial<DiLayer>)}>
          </uui-select>
        </label>

        ${shape === "polygon" || shape === "star"
          ? html`
              <div class="pair">
                <di-number-field
                  label=${shape === "star" ? "Points" : "Sides"}
                  suffix=""
                  .min=${INSPECTOR_BOUNDS.sides.min}
                  .max=${INSPECTOR_BOUNDS.sides.max}
                  .value=${layer.sides ?? 5}
                  @change=${(event: CustomEvent) =>
                    this.#patch({ sides: Math.round(event.detail.value ?? 5) } as Partial<DiLayer>)}>
                </di-number-field>
                ${shape === "star"
                  ? html`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${INSPECTOR_BOUNDS.innerRatio.min}
                      .max=${INSPECTOR_BOUNDS.innerRatio.max}
                      .value=${layer.innerRatio ?? 0.5}
                      @change=${(event: CustomEvent) =>
                        this.#patch({ innerRatio: event.detail.value ?? 0.5 } as Partial<DiLayer>)}>
                    </di-number-field>`
                  : nothing}
              </div>
            `
          : nothing}

        <label class="field inline">
          <span>Fill</span>
          <uui-toggle
            ?checked=${hasFill}
            @change=${(event: Event) =>
              this.#patch({ fill: (event.target as HTMLInputElement).checked ? "#000000" : null } as Partial<DiLayer>)}>
          </uui-toggle>
        </label>

        ${hasFill
          ? html`<label class="field">
              <span>Fill colour</span>
              <di-colour-input
                label="Fill colour"
                .value=${layer.fill ?? "#000000"}
                @change=${(event: CustomEvent) => this.#patch({ fill: event.detail.value } as Partial<DiLayer>)}>
              </di-colour-input>
            </label>`
          : nothing}

        <label class="field inline">
          <span>Gradient</span>
          <uui-toggle
            ?checked=${!!layer.gradient}
            @change=${(event: Event) =>
              this.#patch({
                gradient: (event.target as HTMLInputElement).checked ? createGradient() : null,
              } as Partial<DiLayer>)}>
          </uui-toggle>
        </label>

        ${layer.gradient
          ? this.#renderGradientFields(layer.gradient, (next) => this.#patch({ gradient: next } as Partial<DiLayer>))
          : nothing}

        ${shape === "rectangle"
          ? html`<di-number-field
            .min=${INSPECTOR_BOUNDS.cornerRadius.min}
            .max=${INSPECTOR_BOUNDS.cornerRadius.max}
              label="Corner radius"
              .value=${layer.cornerRadius}
              @change=${(event: CustomEvent) => this.#patch({ cornerRadius: event.detail.value ?? 0 } as Partial<DiLayer>)}>
            </di-number-field>`
          : nothing}

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              .min=${INSPECTOR_BOUNDS.borderWidth.min}
              .max=${INSPECTOR_BOUNDS.borderWidth.max}
              label="Width"
              .value=${layer.border?.width ?? 0}
              @change=${(event: CustomEvent) => {
                const width = event.detail.value ?? 0;
                this.#patch({
                  border: width > 0 ? { width, colour: layer.border?.colour ?? "#FFFFFF" } : null,
                } as Partial<DiLayer>);
              }}>
            </di-number-field>
            ${layer.border
              ? html`<di-colour-input
                  label="Border colour"
                  .value=${layer.border.colour}
                  @change=${(event: CustomEvent) =>
                    this.#patch({ border: { ...layer.border!, colour: event.detail.value } } as Partial<DiLayer>)}>
                </di-colour-input>`
              : nothing}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </label>
      </uui-box>
    `;
  }

  #renderLayout(layer: DiLayer) {
    const trackedX = isTracked(layer.position, "x");
    const trackedY = isTracked(layer.position, "y");
    const rotation = layer.rotation ?? 0;

    return html`
      <uui-box headline="Layout">
        ${this.#renderAxis(layer, "x")} ${this.#renderAxis(layer, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${layer.position.anchor}
            @change=${(event: CustomEvent) => this.#reanchor(layer, event.detail.value)}>
          </di-anchor-picker>
          <small class="hint">
            Where X and Y sit on the layer's box.
            ${trackedX || trackedY
              ? html`The ${trackedX && trackedY ? "horizontal and vertical" : trackedX ? "horizontal" : "vertical"}
                  ${trackedX && trackedY ? "components are" : "component is"} set by the edge
                  ${trackedX && trackedY ? "each axis tracks" : "that axis tracks"}.`
              : nothing}
            ${rotation !== 0 ? html`The layer turns around this point.` : nothing}
          </small>
        </label>

        <div class="field">
          <di-number-field
            label="Rotation"
            suffix="°"
            step="1"
            placeholder="0"
            .value=${rotation}
            @change=${(event: CustomEvent) =>
              this.#patch({ rotation: normalise(event.detail.value ?? 0) } as Partial<DiLayer>)}>
          </di-number-field>
          <small class="hint">Clockwise, around the anchor point. Drag the handle above the selection on the canvas; hold Shift for 15° steps.</small>
        </div>

        <div class="pair">
          <di-number-field
            .min=${INSPECTOR_BOUNDS.width.min}
            .max=${INSPECTOR_BOUNDS.width.max}
            label="Width"
            placeholder="Auto"
            .value=${layer.size.width ?? null}
            @change=${(event: CustomEvent) =>
              this.#patch({ size: { ...layer.size, width: event.detail.value } } as Partial<DiLayer>)}>
          </di-number-field>
          <di-number-field
            .min=${INSPECTOR_BOUNDS.height.min}
            .max=${INSPECTOR_BOUNDS.height.max}
            label="Height"
            placeholder="Auto"
            .value=${layer.size.height ?? null}
            @change=${(event: CustomEvent) =>
              this.#patch({ size: { ...layer.size, height: event.detail.value } } as Partial<DiLayer>)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
  }

  /**
   * One axis of the position: absolute (a coordinate) or relative (a layer to track, which edge
   * of it, and the gap). Two independent axes, so a layer can follow a title downwards while
   * staying at a fixed X.
   */
  #renderAxis(layer: DiLayer, axis: Axis) {
    const tracked = isTracked(layer.position, axis);
    const reference = referenceOn(layer.position, axis);
    const others = this.template.layers.filter((candidate) => candidate.key !== layer.key);
    const edges: RelativeEdge[] = axis === "x" ? ["rightOf", "leftOf"] : ["below", "above"];

    return html`
      <div class="axis">
        <label class="field">
          <span>${axis === "x" ? "Horizontal position" : "Vertical position"}</span>
          <uui-select
            .value=${tracked ? "relative" : "absolute"}
            .options=${[
              { name: "Absolute", value: "absolute", selected: !tracked },
              { name: "Relative to a layer", value: "relative", selected: tracked },
            ]}
            @change=${(event: Event) => this.#setMode(layer, axis, (event.target as HTMLSelectElement).value)}>
          </uui-select>
          ${!tracked && others.length === 0
            ? html`<small class="hint">Add another layer to position this one against it.</small>`
            : nothing}
        </label>

        ${tracked && reference
          ? html`
              <label class="field">
                <span>Tracks</span>
                <div class="row">
                  <uui-select
                    .value=${reference.layerKey}
                    .options=${others.map((candidate) => ({
                      name: candidate.name || candidate.type,
                      value: candidate.key,
                      selected: candidate.key === reference.layerKey,
                    }))}
                    @change=${(event: Event) =>
                      this.#patchReference(layer, axis, { layerKey: (event.target as HTMLSelectElement).value })}>
                  </uui-select>
                  <uui-select
                    .value=${reference.edge}
                    .options=${optionsFrom(edges, reference.edge, {
                      below: "Below it",
                      above: "Above it",
                      rightOf: "Right of it",
                      leftOf: "Left of it",
                    })}
                    @change=${(event: Event) =>
                      this.#patchReference(layer, axis, { edge: (event.target as HTMLSelectElement).value as never })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${INSPECTOR_BOUNDS.referenceGap.min}
                .max=${INSPECTOR_BOUNDS.referenceGap.max}
                label="Gap"
                .value=${reference.gap}
                @change=${(event: CustomEvent) => this.#patchReference(layer, axis, { gap: event.detail.value ?? 0 })}>
              </di-number-field>
            `
          : html`
              <di-number-field
                .min=${axis === "x" ? INSPECTOR_BOUNDS.x.min : INSPECTOR_BOUNDS.y.min}
                .max=${axis === "x" ? INSPECTOR_BOUNDS.x.max : INSPECTOR_BOUNDS.y.max}
                label=${axis === "x" ? "X" : "Y"}
                .value=${axis === "x" ? layer.position.x : layer.position.y}
                @change=${(event: CustomEvent) =>
                  this.#patch({
                    position: { ...layer.position, [axis]: event.detail.value ?? 0 },
                  } as unknown as Partial<DiLayer>)}>
              </di-number-field>
            `}
      </div>
    `;
  }

  /**
   * Absolute or relative for one axis. Going relative tracks the layer below this one in z-order
   * by default - which is nearly always the one it should follow. Going absolute bakes in the
   * coordinate it resolved to, so nothing moves.
   */
  #setMode(layer: DiLayer, axis: Axis, mode: string) {
    if (mode === "absolute") {
      // Detaching needs the resolved coordinate, which only the canvas knows.
      this.dispatchEvent(
        new CustomEvent("di-layer-detach", { bubbles: true, composed: true, detail: { key: layer.key, axis } }),
      );
      return;
    }

    if (isTracked(layer.position, axis)) return;

    const index = this.template.layers.findIndex((candidate) => candidate.key === layer.key);
    const target = this.template.layers[index - 1] ?? this.template.layers.find((candidate) => candidate.key !== layer.key);
    if (!target) return;

    this.#patch({
      position: {
        ...layer.position,
        [axis === "x" ? "relativeX" : "relativeY"]: {
          layerKey: target.key,
          edge: axis === "x" ? "rightOf" : "below",
          gap: DEFAULT_RELATIVE_GAP,
        },
      },
    } as unknown as Partial<DiLayer>);
  }

  #patchReference(layer: DiLayer, axis: Axis, patch: { layerKey?: string; edge?: RelativeEdge; gap?: number }) {
    const existing = referenceOn(layer.position, axis);
    if (!existing) return;

    this.#patch({
      position: { ...layer.position, [axis === "x" ? "relativeX" : "relativeY"]: { ...existing, ...patch } },
    } as unknown as Partial<DiLayer>);
  }

  /** Changing the anchor must not move the layer - only change what x and y mean. */
  #reanchor(layer: DiLayer, anchor: Anchor) {
    const width = layer.size.width ?? 0;
    const height = layer.size.height ?? 0;

    // With no explicit size there is no box to keep still, so the anchor simply changes.
    const position: DiPosition =
      width > 0 && height > 0 ? reanchor(layer.position, width, height, anchor) : { ...layer.position, anchor };

    this.#patch({ position } as Partial<DiLayer>);
  }

  #renderBehaviour(layer: DiLayer) {
    return html`
      <uui-box headline="Behaviour">
        <label class="field inline">
          <span>Visible</span>
          <uui-toggle
            ?checked=${layer.isVisible}
            @change=${(event: Event) =>
              this.#patch({ isVisible: (event.target as HTMLInputElement).checked } as Partial<DiLayer>)}>
          </uui-toggle>
        </label>

        <label class="field inline">
          <span>Locked</span>
          <uui-toggle
            ?checked=${layer.isLocked}
            @change=${(event: Event) =>
              this.#patch({ isLocked: (event.target as HTMLInputElement).checked } as Partial<DiLayer>)}>
          </uui-toggle>
        </label>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${INSPECTOR_BOUNDS.opacity.min}
          .max=${INSPECTOR_BOUNDS.opacity.max}
          .value=${layer.opacity}
          @change=${(event: CustomEvent) => this.#patch({ opacity: event.detail.value ?? 1 } as Partial<DiLayer>)}>
        </di-number-field>

        <label class="field">
          <span>Show this layer</span>
          <uui-select
            .value=${layer.visibility.rule}
            .options=${optionsFrom(["always", "whenNotEmpty", "whenPropertyTruthy"], layer.visibility.rule, {
              always: "Always",
              whenNotEmpty: "When it has a value",
              whenPropertyTruthy: "When another property is set",
            })}
            @change=${(event: Event) =>
              this.#patch({
                visibility: { ...layer.visibility, rule: (event.target as HTMLSelectElement).value as never },
              } as Partial<DiLayer>)}>
          </uui-select>
        </label>

        ${layer.visibility.rule === "whenPropertyTruthy"
          ? html`<label class="field">
              <span>Controlled by</span>
              ${this.#propertyPathSelect(layer.visibility.propertyAlias ?? "", (alias) =>
                this.#patch({ visibility: { ...layer.visibility, propertyAlias: alias } } as Partial<DiLayer>))}
            </label>`
          : nothing}
      </uui-box>
    `;
  }

  // ------------------------------------------------------------------ shared field helpers

  /**
   * One inspector field: core's label / description / editor layout, stacked, so every field in
   * every panel has the same spacing and none of them sits beside another.
   */
  #field(label: string, editor: unknown, description?: string) {
    return html`
      <umb-property-layout orientation="vertical" label=${label} description=${ifDefined(description)}>
        <div slot="editor" class="editor">${editor}</div>
      </umb-property-layout>
    `;
  }

  /**
   * One dropdown per hop, stacked: the first reads a property on this node, and each one after it
   * reads a property on whatever node the hop above points at, up to `MAX_HOPS` references. They
   * compose into the dotted alias the server resolves.
   *
   * Composition rules. Changing a hop replaces everything below it, which clears the lower hops -
   * the new hop's target has a different set of properties, and carrying the old ones over would
   * produce a path that resolves to nothing. `- none -` below the first gives the bare reference,
   * which a text layer draws as the linked node's name.
   *
   * Decoding is `pathSegments` on every render, with no stored state in the element, so it
   * survives a layer-selection change for free.
   */
  #propertyPathSelect(
    value: string,
    onChange: (alias: string) => void,
    filters: { root?: Classification; tail?: Classification } = {},
  ) {
    const segments = pathSegments(value);
    const hops: unknown[] = [];

    for (let index = 0; index <= MAX_HOPS; index++) {
      const prefix = pathPrefix(segments, index);
      const list = index === 0 ? this.properties : this.linkedProperties[prefix] ?? [];
      const current = segments[index] ?? "";

      // A hop below appears when the one above is a content reference *or* when the stored path
      // already goes further, so an existing path is never silently flattened by a palette that
      // has not finished loading.
      if (index > 0) {
        const above = index === 1 ? this.properties : this.linkedProperties[pathPrefix(segments, index - 1)] ?? [];
        const aboveIsReference = above.some(
          (property) => property.alias === segments[index - 1] && property.classification === "content",
        );
        if (!segments[index - 1] || (!aboveIsReference && !current)) break;
      }

      const select = this.#selectFrom(
        filterByClassification(list, index === 0 ? filters.root : filters.tail),
        current,
        (chosen) => onChange([...segments.slice(0, index), chosen].filter(Boolean).join(".")),
      );

      hops.push(index === 0
        ? select
        : html`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[prefix] ?? "Property on the linked item"}</span>
            ${select}
          </div>`);
    }

    return hops.length === 1 ? hops[0] : html`<div class="path">${hops}</div>`;
  }

  /**
   * The one property dropdown: full width, grouped "Tab › Group" in document type order, each
   * option labelled by the property's name. `uui-select` has no per-option title, so the alias of
   * whatever is selected is the select's own title instead. See `propertyOptions` for why a stale
   * alias is kept as a selected option.
   */
  #selectFrom(list: DiProperty[], value: string, onChange: (alias: string) => void) {
    return html`
      <uui-select
        class="property-select"
        label="Property"
        title=${value || "No property"}
        .value=${value}
        .options=${propertyOptions(list, value)}
        @change=${(event: Event) => onChange((event.target as HTMLSelectElement).value)}>
      </uui-select>
    `;
  }

  #fontOptions(selected: string) {
    return [
      { name: "- none -", value: "" },
      ...this.fonts.map((font) => ({
        name: font.familyName,
        value: font.key,
        selected: font.key === selected,
      })),
    ];
  }

  /** A font's named styles, when it has any - the quick way to apply "Title" or "Meta". */
  #namedStyleSelect(
    fontKey: string,
    styleName: string,
    onChange: (name: string, size?: number, fontStyle?: string) => void,
  ) {
    const font = this.fonts.find((candidate) => candidate.key === fontKey);
    if (!font || font.styles.length === 0) return nothing;

    return html`
      <label class="field">
        <span>Named style</span>
        <uui-select
          .value=${styleName}
          .options=${[
            { name: "- custom -", value: "" },
            ...font.styles.map((style) => ({
              name: `${style.name} (${style.size}px)`,
              value: style.name,
              selected: style.name === styleName,
            })),
          ]}
          @change=${(event: Event) => {
            const name = (event.target as HTMLSelectElement).value;
            const style = font.styles.find((candidate) => candidate.name === name);
            onChange(name, style?.size, style?.fontStyle);
          }}>
        </uui-select>
      </label>
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: auto;
      border-left: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .inspector {
      padding: var(--uui-size-space-3);
      display: grid;
      gap: var(--uui-size-space-3);
    }

    .head {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
    }

    .head uui-input {
      flex: 1 1 auto;
    }

    .field {
      display: grid;
      gap: 2px;
      margin-bottom: var(--uui-size-space-3);
    }

    .field > span {
      font-size: 11px;
      color: var(--uui-color-text-alt);
    }

    /* One hop per line, each full width; every hop after the first sits behind a 2px rule, as
       the relative-position axes do. */
    .path {
      display: flex;
      flex-direction: column;
      gap: var(--uui-size-space-4);
      min-width: 0;
    }

    .hop {
      display: flex;
      flex-direction: column;
      gap: var(--uui-size-space-1);
      padding-left: var(--uui-size-space-3);
      border-left: 2px solid var(--uui-color-border);
      min-width: 0;
    }

    .hop-caption {
      color: var(--uui-color-text-alt);
    }

    .property-select {
      width: 100%;
      min-width: 0;
    }

    .field.inline {
      grid-template-columns: 1fr auto;
      align-items: center;
    }

    .pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--uui-size-space-2);
      margin-bottom: var(--uui-size-space-3);
    }

    /* One axis reads as a unit: the mode, then whatever that mode needs. */
    .axis {
      border-left: 2px solid var(--uui-color-divider-standalone);
      padding-left: var(--uui-size-space-3);
      margin-bottom: var(--uui-size-space-3);
    }

    .axis .field:last-child,
    .axis di-number-field:last-child {
      margin-bottom: 0;
    }

    .row {
      display: flex;
      gap: var(--uui-size-space-2);
      align-items: center;
    }

    .hint {
      font-size: 11px;
      color: var(--uui-color-text-alt);
    }

    code {
      background: var(--uui-color-surface-alt);
      padding: 0 3px;
      border-radius: 2px;
    }
  `;
}

/** Builds uui-select options from a list of values, with optional friendlier labels. */
function optionsFrom(values: string[], selected: string, labels: Record<string, string> = {}) {
  return values.map((value) => ({
    name: labels[value] ?? value.charAt(0).toUpperCase() + value.slice(1),
    value,
    selected: value === selected,
  }));
}

function sourceKindOptions(selected: string) {
  return optionsFrom(["none", "media", "path", "property"], selected, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page",
  });
}

export default DiLayerInspectorElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-layer-inspector": DiLayerInspectorElement;
  }
}
