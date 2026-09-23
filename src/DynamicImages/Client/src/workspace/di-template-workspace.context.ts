import { UmbEntityWorkspaceDataManager, UmbSubmittableWorkspaceContextBase } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbArrayState, UmbBooleanState, UmbObjectState, UmbStringState, UmbNumberState } from "@umbraco-cms/backoffice/observable-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UMB_DISCARD_CHANGES_MODAL, umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import {
  UmbRequestReloadChildrenOfEntityEvent, UmbRequestReloadStructureForEntityEvent,
} from "@umbraco-cms/backoffice/entity-action";
import {
  DiApiError, createTemplate as apiCreate, fetchFonts, fetchLinkedProperties, fetchProperties, fetchTemplate,
  hrefForTemplate, notifyTemplatesChanged, updateTemplate,
} from "../api/dynamic-images-api.js";
import type {
  DiFont, DiLayer, DiLayerBounds, DiPosition, DiProperty, DiTemplate, DiValidationIssue,
} from "../api/types.js";
import { createTemplate } from "../models/layer-factories.js";
import { detach, referenceOn } from "../models/relative-layout.js";
import { History } from "../designer/history.js";

export const DI_TEMPLATE_WORKSPACE_ALIAS = "DynamicImages.Workspace.Template";

/**
 * One immutable template document, plus everything the designer derives from it.
 *
 * Extending Umbraco's submittable workspace base buys Save and the `isNew` flag, and nothing
 * else: it carries a commented-out `#isDirty` and no dirty tracking at all. The unsaved-changes
 * guard lives one level up, in `UmbEntityDetailWorkspaceContextBase`, which we cannot inherit
 * because it requires a detail repository, an entity context and action-event reload events that
 * this package's bespoke fetch layer does not have. So the two halves are assembled here from
 * core's own exported pieces: `UmbEntityWorkspaceDataManager` holds the persisted/current pair
 * that answers "is this dirty", and the `willchangestate` listener below is core's own guard,
 * inlined.
 */
/**
 * How many content-classified roots are probed for their linked properties. A document type with
 * dozens of pickers would otherwise be dozens of requests on every template open, and a dropdown
 * that long is not usable anyway.
 */
const MAX_LINKED_ROOTS = 12;

export class DiTemplateWorkspaceContext extends UmbSubmittableWorkspaceContextBase<DiTemplate> {
  /**
   * The persisted/current pair. `getHasUnpersistedChanges()` is a JSON comparison of the two, so
   * every path that reaches a saved state must set both from the *same* object.
   */
  protected readonly _data = new UmbEntityWorkspaceDataManager<DiTemplate>(this);
  readonly template = this._data.current;

  #layers = new UmbArrayState<DiLayer>([], (layer) => layer.key);
  readonly layers = this.#layers.asObservable();

  #selectedLayerKey = new UmbStringState<string | undefined>(undefined);
  readonly selectedLayerKey = this.#selectedLayerKey.asObservable();

  #properties = new UmbArrayState<DiProperty>([], (property) => property.alias);
  readonly properties = this.#properties.asObservable();

  /**
   * The properties reachable through each content-classified root property, keyed by that root's
   * alias - what the inspector's second dropdown offers for `author.…`.
   */
  #linkedProperties = new UmbObjectState<Record<string, DiProperty[]>>({});
  readonly linkedProperties = this.#linkedProperties.asObservable();

  #fonts = new UmbArrayState<DiFont>([], (font) => font.key);
  readonly fonts = this.#fonts.asObservable();

  /** The server's measured bounds from the last preview/layout call - the designer's ground truth. */
  #serverBounds = new UmbArrayState<DiLayerBounds>([], (bounds) => bounds.key);
  readonly serverBounds = this.#serverBounds.asObservable();

  #issues = new UmbArrayState<DiValidationIssue>([], (issue) => `${issue.code}:${issue.layerKey ?? ""}:${issue.message}`);
  readonly issues = this.#issues.asObservable();

  #sampleContentKey = new UmbStringState<string | undefined>(undefined);
  readonly sampleContentKey = this.#sampleContentKey.asObservable();

  #useSampleData = new UmbBooleanState(true);
  readonly useSampleData = this.#useSampleData.asObservable();

  #zoom = new UmbNumberState(1);
  readonly zoom = this.#zoom.asObservable();

  #loading = new UmbBooleanState(true);
  readonly loading = this.#loading.asObservable();

  /** Required by the base class; the workspace's unique is the template key. */
  readonly unique = this._data.createObservablePartOfCurrent((template) => template?.key);

  #canUndo = new UmbBooleanState(false);
  readonly canUndo = this.#canUndo.asObservable();

  #canRedo = new UmbBooleanState(false);
  readonly canRedo = this.#canRedo.asObservable();

  #history = new History<DiTemplate>();
  #authContext?: typeof UMB_AUTH_CONTEXT.TYPE;
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;
  #isNew = false;

  /**
   * Set while we are deliberately re-entering navigation after the editor chose to discard.
   * The `history.pushState` below fires `willchangestate` a second time, and without this the
   * guard would prompt in a loop. Core does exactly the same thing, for the same reason.
   */
  #allowNavigateAway = false;

  constructor(host: UmbControllerHost) {
    super(host, DI_TEMPLATE_WORKSPACE_ALIAS);

    // The routable workspace kind renders whichever of these matches the address bar. Both land
    // on the same editor element; only how the context is seeded differs.
    this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => import("./di-template-editor.element.js"),
        setup: (_component, info) => {
          const parent = info.match.params.parentUnique;
          return this.createScaffold(undefined, parent && parent !== "null" ? parent : null);
        },
      },
      {
        path: "create",
        component: () => import("./di-template-editor.element.js"),
        setup: () => this.createScaffold(),
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => import("./di-template-editor.element.js"),
        setup: (_component, info) => this.load(info.match.params.unique),
      },
      {
        path: "",
        redirectTo: "create",
      },
    ]);

    this.consumeContext(UMB_AUTH_CONTEXT, (instance) => {
      this.#authContext = instance;
    });
    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
      this.#notificationContext = instance;
    });

    window.addEventListener("willchangestate", this.#onWillNavigate);
    window.addEventListener("beforeunload", this.#onBeforeUnload);

    // Without this the browser tab reads "| Design | Umbraco" - a leading empty segment, which
    // is exactly what the host's #computeTitle() produces when the view's title is undefined.
    // `view` comes from the base class; it is an UmbViewContext, which has setTitle.
    this.observe(this._data.createObservablePartOfCurrent((template) => template?.name), (name) => {
      this.view.setTitle(name || "New template");
    });
  }

  // ------------------------------------------------------------------ the unsaved-changes guard

  getHasUnpersistedChanges = (): boolean => this._data.getHasUnpersistedChanges();

  /**
   * True when the new URL leaves this workspace. Switching between the four workspace views keeps
   * the workspace's own path as a prefix (`…/edit/<key>/view/<pathname>`), so this is false for
   * those and the editor is never prompted for moving between Design and Preview & test.
   *
   * Core has the same check as a protected method on `UmbEntityDetailWorkspaceContextBase`.
   * There is no exported helper for it, so it is inlined rather than reached for.
   *
   * The `URL` branch is not defensive padding: a real in-app navigation puts a `URL` **object**
   * in `event.detail.url`, and only a synthetic event carries a string. Without it `.includes`
   * throws, and because the handler is async the rejection is swallowed - so the guard silently
   * did nothing on exactly the navigations it exists for, while passing every test that
   * dispatched the event by hand.
   */
  #willNavigateAway(newUrl: string | URL): boolean {
    const url = newUrl instanceof URL ? newUrl.href : newUrl;

    return !url.includes(this.routes.getActiveLocalPath());
  }

  #onWillNavigate = async (event: Event): Promise<boolean> => {
    const detail = (event as CustomEvent<{ url: string | URL }>).detail;

    if (this.#allowNavigateAway) return true;
    if (!detail?.url || !this.#willNavigateAway(detail.url)) return true;
    if (!this.getHasUnpersistedChanges()) return true;

    // Modals are async and the event is not, so the navigation has to be cancelled up front and
    // replayed once the editor has answered.
    event.preventDefault();

    try {
      await umbOpenModal(this, UMB_DISCARD_CHANGES_MODAL);
      this.#allowNavigateAway = true;
      window.history.pushState({}, "", detail.url instanceof URL ? detail.url.href : detail.url);
      return true;
    } catch {
      return false;
    }
  };

  /** A full page unload cannot be prompted with our own modal; the browser's own will do. */
  #onBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!this.getHasUnpersistedChanges()) return;

    event.preventDefault();
    event.returnValue = "";
  };

  getToken = () => this.#authContext?.getLatestToken();

  getEntityType = () => "di-template";

  getUnique = () => this._data.getCurrent()?.key;

  getData = () => this._data.getCurrent();

  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved(): boolean {
    return this.#isNew;
  }

  // ------------------------------------------------------------------ loading

  async load(key: string): Promise<void> {
    this.#loading.setValue(true);
    this.#isNew = false;

    try {
      const template = await fetchTemplate(key, this.getToken);
      this.#setTemplate(template, { resetHistory: true, persist: true });
      this.#restoreSampleContentKey();
      this.setIsNew(false);
      await this.#loadSupportingData(template);
    } catch (error) {
      this.#notifyError("This template could not be loaded", error);
    } finally {
      this.#loading.setValue(false);
    }
  }

  async createScaffold(name = "New template", parentKey: string | null = null): Promise<void> {
    this.#loading.setValue(true);
    this.#isNew = true;

    // The scaffold is persisted as well as current, so opening Create and navigating straight
    // back out does not prompt over changes nobody made.
    this.#setTemplate({ ...createTemplate(name), parentKey }, { resetHistory: true, persist: true });
    this.setIsNew(true);
    await this.#loadSupportingData(this._data.getCurrent()!);

    this.#loading.setValue(false);
  }

  /** Fonts, and the properties of whichever document types the template is attached to. */
  async #loadSupportingData(template: DiTemplate): Promise<void> {
    const [fonts, properties] = await Promise.all([
      fetchFonts(this.getToken).catch(() => [] as DiFont[]),
      this.#loadProperties(template.docTypeAliases),
    ]);

    this.#fonts.setValue(fonts);
    this.#properties.setValue(properties);
    this.#linkedProperties.setValue(await this.#loadLinkedProperties(template.docTypeAliases, properties));
  }

  /**
   * What each content-classified property points at, loaded eagerly rather than on demand. Lazy
   * loading would leave the second dropdown empty for the moment right after the editor picks a
   * root - the exact moment they are looking at it - and would need event plumbing back from the
   * inspector for no gain.
   *
   * Mirrors {@link #loadProperties}: one request per (docTypeAlias, rootAlias) pair, each
   * swallowing its own failure, then flattened and de-duped by alias with the first winning.
   */
  async #loadLinkedProperties(
    docTypeAliases: string[], properties: DiProperty[],
  ): Promise<Record<string, DiProperty[]>> {
    const roots = properties
      .filter((property) => property.classification === "content")
      .slice(0, MAX_LINKED_ROOTS);

    if (roots.length === 0 || docTypeAliases.length === 0) return {};

    const loaded = await Promise.all(
      roots.map(async (root) => {
        const responses = await Promise.all(
          docTypeAliases.map((alias) =>
            fetchLinkedProperties(alias, root.alias, this.getToken).catch(() => null)),
        );

        const seen = new Map<string, DiProperty>();
        for (const property of responses.flatMap((response) => response?.properties ?? [])) {
          if (!seen.has(property.alias)) seen.set(property.alias, property);
        }

        return [root.alias, [...seen.values()]] as [string, DiProperty[]];
      }),
    );

    return Object.fromEntries(loaded.filter(([, list]) => list.length > 0));
  }

  /**
   * The union of the selected document types' properties. A property that only some of them have
   * is still offered - the validator is what warns that it will be empty on the others.
   */
  async #loadProperties(docTypeAliases: string[]): Promise<DiProperty[]> {
    if (docTypeAliases.length === 0) return [];

    const results = await Promise.all(
      docTypeAliases.map((alias) => fetchProperties(alias, this.getToken).catch(() => [] as DiProperty[])),
    );

    const seen = new Map<string, DiProperty>();
    for (const property of results.flat()) {
      if (!seen.has(property.alias)) seen.set(property.alias, property);
    }

    return [...seen.values()];
  }

  async reloadProperties(): Promise<void> {
    const template = this._data.getCurrent();
    if (!template) return;

    const properties = await this.#loadProperties(template.docTypeAliases);

    this.#properties.setValue(properties);
    this.#linkedProperties.setValue(await this.#loadLinkedProperties(template.docTypeAliases, properties));
  }

  async reloadFonts(): Promise<void> {
    this.#fonts.setValue(await fetchFonts(this.getToken).catch(() => [] as DiFont[]));
  }

  // ------------------------------------------------------------------ mutation

  /**
   * The single write path. Everything the designer changes goes through here, which is what makes
   * the undo stack, the dirty flag and the derived observables consistent by construction.
   */
  #update(mutate: (template: DiTemplate) => DiTemplate, recordHistory = true): void {
    const current = this._data.getCurrent();
    if (!current) return;

    if (recordHistory) this.#history.push(current);

    const next = mutate(structuredClone(current));
    this.#setTemplate(next);
  }

  /**
   * `persist` marks this template as the saved state too. Both halves get the *same* object, so
   * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
   */
  #setTemplate(template: DiTemplate, options?: { resetHistory?: boolean; persist?: boolean }): void {
    if (options?.resetHistory) this.#history.clear();

    this._data.setCurrent(template);
    if (options?.persist) this._data.setPersisted(template);

    this.#layers.setValue(template.layers);
    this.#refreshHistoryFlags();
  }

  updateTemplateFields(patch: Partial<DiTemplate>): void {
    this.#update((template) => ({ ...template, ...patch }));
  }

  updateCanvas(patch: Partial<DiTemplate["canvas"]>): void {
    this.#update((template) => ({ ...template, canvas: { ...template.canvas, ...patch } }));
  }

  updateOutput(patch: Partial<DiTemplate["output"]>): void {
    this.#update((template) => ({ ...template, output: { ...template.output, ...patch } }));
  }

  updateTrigger(patch: Partial<DiTemplate["trigger"]>): void {
    this.#update((template) => ({ ...template, trigger: { ...template.trigger, ...patch } }));
  }

  addLayer(layer: DiLayer, select = true): void {
    this.#update((template) => ({ ...template, layers: [...template.layers, layer] }));
    if (select) this.selectLayer(layer.key);
  }

  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(key: string, patch: Partial<DiLayer>): void {
    this.#update((template) => ({
      ...template,
      layers: template.layers.map((layer) => (layer.key === key ? ({ ...layer, ...patch } as DiLayer) : layer)),
    }));
  }

  /**
   * Removes a layer, and detaches anything positioned against it in the same update - so one undo
   * restores both the layer and the links to it. `resolvedPositions` is where those layers were
   * actually drawn, which is what lets them stay put; without it they fall back to their own
   * stored coordinates.
   */
  removeLayer(key: string, resolvedPositions?: ReadonlyMap<string, DiPosition>): void {
    this.#update((template) => ({
      ...template,
      layers: template.layers
        .filter((layer) => layer.key !== key)
        .map((layer) => {
          let position = layer.position;

          if (referenceOn(position, "x")?.layerKey === key) {
            position = detach(position, "x", resolvedPositions?.get(layer.key));
          }
          if (referenceOn(position, "y")?.layerKey === key) {
            position = detach(position, "y", resolvedPositions?.get(layer.key));
          }

          return position === layer.position ? layer : ({ ...layer, position } as DiLayer);
        }),
    }));

    if (this.#selectedLayerKey.getValue() === key) this.selectLayer(undefined);
  }

  duplicateLayer(key: string): void {
    const source = this._data.getCurrent()?.layers.find((layer) => layer.key === key);
    if (!source) return;

    const copy: DiLayer = {
      ...structuredClone(source),
      key: crypto.randomUUID(),
      name: `${source.name} copy`,
      // Offset so the copy is visibly a copy rather than hidden exactly behind the original.
      position: { ...source.position, x: source.position.x + 20, y: source.position.y + 20 },
    };

    this.addLayer(copy);
  }

  /** Moves a layer to an index in the array, which is its z-order. */
  moveLayer(key: string, toIndex: number): void {
    this.#update((template) => {
      const layers = [...template.layers];
      const from = layers.findIndex((layer) => layer.key === key);
      if (from < 0) return template;

      const [moved] = layers.splice(from, 1);
      layers.splice(Math.max(0, Math.min(layers.length, toIndex)), 0, moved);

      return { ...template, layers };
    });
  }

  setLayerVisible(key: string, isVisible: boolean): void {
    this.updateLayer(key, { isVisible } as Partial<DiLayer>);
  }

  setLayerLocked(key: string, isLocked: boolean): void {
    this.updateLayer(key, { isLocked } as Partial<DiLayer>);
  }

  selectLayer(key: string | undefined): void {
    this.#selectedLayerKey.setValue(key);
  }

  getSelectedLayer(): DiLayer | undefined {
    const key = this.#selectedLayerKey.getValue();
    return key ? this._data.getCurrent()?.layers.find((layer) => layer.key === key) : undefined;
  }

  // ------------------------------------------------------------------ transactions and history

  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction(): void {
    const current = this._data.getCurrent();
    if (current) this.#history.begin(current);
  }

  endTransaction(changed = true): void {
    this.#history.end(changed);
    this.#refreshHistoryFlags();
  }

  undo(): void {
    const current = this._data.getCurrent();
    if (!current) return;

    const previous = this.#history.undo(current);
    if (previous) this.#setTemplate(previous);
  }

  redo(): void {
    const current = this._data.getCurrent();
    if (!current) return;

    const next = this.#history.redo(current);
    if (next) this.#setTemplate(next);
  }

  #refreshHistoryFlags(): void {
    this.#canUndo.setValue(this.#history.canUndo);
    this.#canRedo.setValue(this.#history.canRedo);
  }

  // ------------------------------------------------------------------ preview state

  setServerBounds(bounds: DiLayerBounds[]): void {
    this.#serverBounds.setValue(bounds);
  }

  setIssues(issues: DiValidationIssue[]): void {
    this.#issues.setValue(issues);
  }

  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(key: string | undefined): void {
    this.#sampleContentKey.setValue(key);
    this.#useSampleData.setValue(!key);
    this.#rememberSampleContentKey(key);
  }

  #sampleStorageKey(): string {
    return `di:sample-node:${this._data.getCurrent()?.key ?? "new"}`;
  }

  #rememberSampleContentKey(key: string | undefined): void {
    try {
      if (key) localStorage.setItem(this.#sampleStorageKey(), JSON.stringify({ key }));
      else localStorage.removeItem(this.#sampleStorageKey());
    } catch {
      // Private mode, blocked storage - not being able to remember the choice is not worth telling anyone about.
    }
  }

  /** Accepts the older remembered shape too, which stored the whole picked item. */
  #restoreSampleContentKey(): void {
    let key: string | undefined;
    try {
      const raw = localStorage.getItem(this.#sampleStorageKey());
      key = raw ? (JSON.parse(raw) as { key?: string }).key : undefined;
    } catch {
      key = undefined;
    }

    this.#sampleContentKey.setValue(key);
    this.#useSampleData.setValue(!key);
  }

  setUseSampleData(value: boolean): void {
    this.#useSampleData.setValue(value);
  }

  setZoom(zoom: number): void {
    this.#zoom.setValue(Math.max(0.1, Math.min(4, zoom)));
  }

  // ------------------------------------------------------------------ saving

  protected async submit(): Promise<void> {
    const template = this._data.getCurrent();
    if (!template) throw new Error("There is nothing to save.");

    try {
      const response = this.#isNew
        ? await apiCreate(template, this.getToken)
        : await updateTemplate(template, this.getToken);

      // Saved, so the response is both what is on screen and what is on the server. The guard
      // must not prompt on the way out of a template that was just saved.
      this.#setTemplate(response.template, { resetHistory: true, persist: true });

      const wasNew = this.#isNew;
      this.#isNew = false;
      this.setIsNew(false);

      notifyTemplatesChanged();
      await this.#reloadTree(response.template, wasNew);

      this.#notificationContext?.peek("positive", {
        data: { message: `'${response.template.name}' saved.` },
      });

      for (const warning of response.warnings) {
        this.#notificationContext?.peek("warning", { data: { message: warning.message } });
      }

      // A created template has to move off the /create route, or saving again would create
      // a second one.
      if (wasNew) window.history.replaceState({}, "", hrefForTemplate(response.template.key));
    } catch (error) {
      this.#notifyError("The template could not be saved", error);
      throw error;
    }
  }

  /**
   * Tells the Templates tree (and the collection) what changed, the way core's detail workspaces
   * do: a new template reloads its parent's children, and a saved one reloads its own structure
   * so a rename shows.
   */
  async #reloadTree(template: DiTemplate, created: boolean): Promise<void> {
    const events = await this.getContext(UMB_ACTION_EVENT_CONTEXT).catch(() => undefined);
    if (!events) return;

    if (created) {
      events.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
        entityType: template.parentKey ? "di-template-folder" : "di-template-root",
        unique: template.parentKey ?? null,
      }));
    } else {
      events.dispatchEvent(new UmbRequestReloadStructureForEntityEvent({ entityType: "di-template", unique: template.key }));
    }
  }

  #notifyError(fallback: string, error: unknown): void {
    const message = error instanceof DiApiError
      ? error.detail ?? error.message
      : error instanceof Error
        ? error.message
        : fallback;

    console.error("[DynamicImages]", fallback, error);
    this.#notificationContext?.peek("danger", { data: { headline: fallback, message } });
  }

  protected override resetState(): void {
    super.resetState();
    this._data.clear();
    this.#allowNavigateAway = false;
  }

  override destroy(): void {
    // Core leaks these listeners; we should not.
    window.removeEventListener("willchangestate", this.#onWillNavigate);
    window.removeEventListener("beforeunload", this.#onBeforeUnload);

    this.#history.clear();
    super.destroy();
  }
}

export const DI_TEMPLATE_WORKSPACE_CONTEXT = new UmbContextToken<DiTemplateWorkspaceContext>(
  "UmbWorkspaceContext",
  undefined,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (context): context is DiTemplateWorkspaceContext =>
    (context as DiTemplateWorkspaceContext).getEntityType?.() === "di-template",
);
