/** What this needs of core's `umb-split-panel`: its divider position, "300px" or "18.5%". */
type SplitPanel = HTMLElement & { position: string };

/** Umbraco's own key for the tree's width, written only when a drag of the divider ends. */
const UMBRACO_POSITION_KEY = "umb-split-panel-position";
const DEFAULT_POSITION = "300px";

/**
 * Hides the section's tree sidebar, which Umbraco 17 has no API to collapse.
 *
 * Every assumption about Umbraco's internals lives in this one class, so an upgrade that moves
 * them breaks only here - and it breaks quietly: when the elements are not where they were,
 * `available` is false, every method does nothing, and the design view shows no toggle.
 *
 * What it relies on, as of 17.5.3:
 * - `umb-section-default` renders `umb-split-panel > umb-section-sidebar[slot=start]` in its open
 *   shadow root, and gives the split panel `--umb-split-panel-start-min-width: 200px`, which is
 *   why neither a drag nor Home can take the tree below 200px. An inline value overrides it.
 * - The section also sets `--umb-split-panel-slot-overflow: visible`, so a 0px column would still
 *   paint the tree. The sidebar has to be `display: none` as well.
 * - Setting the split panel's `position` from code relays it out and persists nothing. Only a
 *   drag's `position-changed` saves a width, so the divider is hidden too: dragging it while the
 *   tree is folded away would overwrite the editor's saved width with this one.
 * - The split panel is a three-column grid, start | divider | end, with the divider's column 0px.
 *   So the divider is hidden with `visibility`, never `display: none`: taken out of the grid, it
 *   lets the workspace slide into its 0px column and the whole section goes blank. Hidden, it
 *   takes no pointer events and no focus, which is all that is wanted of it here.
 */
export class SectionSidebar {
  readonly #splitPanel?: SplitPanel;
  readonly #sidebar?: HTMLElement;

  #collapsed = false;
  #position = "";
  #minWidth = "";
  #sidebarDisplay = "";
  #dividerVisibility = "";

  constructor(sectionElement: Element | undefined) {
    const root = sectionElement?.shadowRoot;
    const splitPanel = root?.querySelector<SplitPanel>("umb-split-panel") ?? undefined;
    const sidebar = root?.querySelector<HTMLElement>("umb-section-sidebar") ?? undefined;

    if (splitPanel && sidebar) {
      this.#splitPanel = splitPanel;
      this.#sidebar = sidebar;
    }
  }

  get available(): boolean {
    return this.#splitPanel !== undefined;
  }

  get collapsed(): boolean {
    return this.#collapsed;
  }

  get #divider(): HTMLElement | null {
    return this.#splitPanel?.shadowRoot?.querySelector<HTMLElement>("#divider") ?? null;
  }

  collapse(): void {
    const splitPanel = this.#splitPanel;
    const sidebar = this.#sidebar;
    if (!splitPanel || !sidebar || this.#collapsed) return;

    this.#collapsed = true;
    this.#position = splitPanel.position;

    // Each inline value is remembered and put back rather than cleared, in case Umbraco set one.
    const divider = this.#divider;
    this.#minWidth = splitPanel.style.getPropertyValue("--umb-split-panel-start-min-width");
    this.#sidebarDisplay = sidebar.style.display;
    this.#dividerVisibility = divider?.style.visibility ?? "";

    splitPanel.style.setProperty("--umb-split-panel-start-min-width", "0px");
    sidebar.style.display = "none";
    if (divider) divider.style.visibility = "hidden";
    splitPanel.position = "0px";
  }

  restore(): void {
    const splitPanel = this.#splitPanel;
    const sidebar = this.#sidebar;
    if (!splitPanel || !sidebar || !this.#collapsed) return;

    this.#collapsed = false;

    if (this.#minWidth) splitPanel.style.setProperty("--umb-split-panel-start-min-width", this.#minWidth);
    else splitPanel.style.removeProperty("--umb-split-panel-start-min-width");

    sidebar.style.display = this.#sidebarDisplay;
    const divider = this.#divider;
    if (divider) divider.style.visibility = this.#dividerVisibility;

    splitPanel.position = isZero(this.#position) ? savedPosition() : this.#position;
  }
}

function isZero(position: string): boolean {
  return !position || parseFloat(position) === 0;
}

/** The width Umbraco last saved for the tree, for when there is no better one to go back to. */
function savedPosition(): string {
  try {
    const saved = localStorage.getItem(UMBRACO_POSITION_KEY);
    return saved && !isZero(saved) ? saved : DEFAULT_POSITION;
  } catch {
    return DEFAULT_POSITION;
  }
}
