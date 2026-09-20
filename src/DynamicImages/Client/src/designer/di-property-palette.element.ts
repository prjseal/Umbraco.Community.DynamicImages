import { css, customElement, html, property, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { DiProperty, PropertyClassification, ShapeKind } from "../api/types.js";

/**
 * What the palette puts on the drag payload. The canvas turns it into a layer on drop. A "rect"
 * chip may name the shape it starts as; polygon and star are a select away in the inspector,
 * where their sides and inner ratio live anyway.
 */
export type PalettePayload =
  | { kind: "property"; property: DiProperty }
  | { kind: "static"; layerType: "text" | "image" | "badges" | "rect"; shape?: ShapeKind };

const ICONS: Record<PropertyClassification, string> = {
  text: "icon-font",
  richtext: "icon-article",
  date: "icon-calendar",
  media: "icon-picture",
  content: "icon-documents",
  list: "icon-tags",
  boolean: "icon-checkbox",
  number: "icon-calculator",
  readingTime: "icon-time",
  other: "icon-block",
};

/**
 * The left-hand rail of draggable chips. Every chip also has a "+" button: drag-and-drop is the
 * fast path, but it is unusable by keyboard and awkward on touch, so clicking must work too.
 */
@customElement("di-property-palette")
export class DiPropertyPaletteElement extends UmbLitElement {
  @property({ type: Array })
  properties: DiProperty[] = [];

  @state()
  private _search = "";

  get #filtered(): DiProperty[] {
    const search = this._search.trim().toLowerCase();
    if (!search) return this.properties;

    return this.properties.filter(
      (property) =>
        property.name.toLowerCase().includes(search) || property.alias.toLowerCase().includes(search),
    );
  }

  #add(payload: PalettePayload) {
    this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: true, composed: true, detail: { payload } }));
  }

  #onDragStart(event: DragEvent, payload: PalettePayload) {
    // A custom MIME type, so the canvas can tell a palette chip apart from a file or a link
    // being dragged in from elsewhere.
    event.dataTransfer?.setData("application/x-di-palette-item", JSON.stringify(payload));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
  }

  render() {
    const grouped = groupByGroup(this.#filtered);

    return html`
      <div class="palette">
        <uui-input
          type="search"
          label="Search properties"
          placeholder="Search"
          .value=${this._search}
          @input=${(event: Event) => {
            this._search = (event.target as HTMLInputElement).value;
          }}>
        </uui-input>

        ${this.properties.length === 0
          ? html`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>`
          : repeat(
              [...grouped.entries()],
              ([group]) => group,
              ([group, properties]) => this.#renderGroup(group, properties),
            )}

        ${this.#renderStaticGroup()}
      </div>
    `;
  }

  #renderGroup(group: string, properties: DiProperty[]) {
    return html`
      <div class="group">
        <h5>${group}</h5>
        ${repeat(
          properties,
          (property) => property.alias,
          (property) => this.#renderChip(
            property.name,
            ICONS[property.classification] ?? ICONS.other,
            property.classification,
            { kind: "property", property },
            // A Yes/No chip does not add a layer, so the button must not claim it does.
            property.classification === "boolean"
              ? `Use ${property.name} as a show/hide condition`
              : undefined,
          ),
        )}
      </div>
    `;
  }

  #renderStaticGroup() {
    return html`
      <div class="group">
        <h5>Static</h5>
        ${this.#renderChip("Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${this.#renderChip("Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${this.#renderChip("Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${this.#renderChip("Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${this.#renderChip("Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
  }

  #renderChip(
    label: string,
    icon: string,
    classification: PropertyClassification,
    payload: PalettePayload,
    actionLabel?: string,
  ) {
    const title = actionLabel ?? label;

    return html`
      <div
        class="chip ${classification}"
        draggable="true"
        title=${title}
        @dragstart=${(event: DragEvent) => this.#onDragStart(event, payload)}>
        <uui-icon name=${icon}></uui-icon>
        <span class="label" title=${title}>${label}</span>
        <uui-button
          compact
          look="secondary"
          label=${actionLabel ?? `Add ${label} to the canvas`}
          @click=${() => this.#add(payload)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: auto;
      border-right: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .palette {
      padding: var(--uui-size-space-3);
      display: grid;
      gap: var(--uui-size-space-4);
    }

    .group h5 {
      margin: 0 0 var(--uui-size-space-2);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--uui-color-text-alt);
    }

    .chip {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      padding: var(--uui-size-space-2);
      margin-bottom: var(--uui-size-space-1);
      border: 1px solid var(--uui-color-border);
      border-left: 3px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      background: var(--uui-color-surface);
      cursor: grab;
      font-size: 13px;
    }

    .chip:active {
      cursor: grabbing;
    }

    .chip .label {
      flex: 1 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* The left border encodes the classification, which is also what decides the layer type a
       drop creates - so the colour is a hint about what will happen, not decoration. */
    .chip.text,
    .chip.richtext {
      border-left-color: var(--uui-color-focus);
    }
    .chip.media {
      border-left-color: var(--uui-color-positive);
    }
    .chip.date {
      border-left-color: var(--uui-color-warning);
    }
    .chip.content,
    .chip.list {
      border-left-color: var(--uui-color-danger);
    }
    /* A Yes/No property is the one chip that does not add a layer at all - it sets a layer's
       visibility condition - so it gets a colour of its own, and a dashed border to say the
       drop needs a target. */
    .chip.boolean {
      border-left-color: var(--uui-color-selected);
      border-left-style: dashed;
    }

    .empty {
      margin: 0;
      color: var(--uui-color-text-alt);
      font-size: 13px;
    }
  `;
}

/** Groups properties by their document-type tab, keeping "Node" first. */
function groupByGroup(properties: DiProperty[]): Map<string, DiProperty[]> {
  const grouped = new Map<string, DiProperty[]>();

  for (const property of properties) {
    const group = property.group || "Other";
    const list = grouped.get(group) ?? [];
    list.push(property);
    grouped.set(group, list);
  }

  const ordered = new Map<string, DiProperty[]>();
  if (grouped.has("Node")) ordered.set("Node", grouped.get("Node")!);

  for (const [group, list] of grouped) {
    if (group !== "Node") ordered.set(group, list);
  }

  return ordered;
}

export default DiPropertyPaletteElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-property-palette": DiPropertyPaletteElement;
  }
}
