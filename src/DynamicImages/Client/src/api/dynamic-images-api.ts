import type {
  DiDocumentType, DiFont, DiFontStyle, DiHealthReport, DiJob, DiLayout, DiLinkedProperties,
  DiProperty, DiRegisterWebFontRequest, DiRegisterWebFontResponse, DiSampleContentItem,
  DiCollectionItem, DiSyncStatus, DiTemplate, DiTemplateFolder, DiTemplateSaveResponse, DiTemplateSummary, DiTreeItem, DiUsage,
} from "./types.js";

export type TokenGetter = () => Promise<string | undefined> | undefined;

export const SECTION_PATHNAME = "dynamic-images";
export const TEMPLATE_ENTITY_TYPE = "di-template";

/** Dispatched on window whenever the template list changes, so the menu can refresh itself. */
export const TEMPLATES_CHANGED_EVENT = "di:templates-changed";

const API_BASE = "/umbraco/management/api/v1/dynamic-images";

/** A failed request, carrying the ProblemDetails the server sent so the UI can show it. */
export class DiApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detail?: string,
  ) {
    super(message);
    this.name = "DiApiError";
  }
}

async function request(
  path: string,
  getToken: TokenGetter,
  init?: RequestInit & { json?: unknown },
): Promise<Response> {
  const token = await getToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let body = init?.body;
  if (init?.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers, body });
  if (!response.ok) throw await toError(response);

  return response;
}

/** Turns a failed response into an error carrying the server's own explanation, when it sent one. */
async function toError(response: Response): Promise<DiApiError> {
  let title = `Request failed (${response.status})`;
  let detail: string | undefined;

  try {
    const problem = await response.json();
    if (problem?.title) title = problem.title;
    if (problem?.detail) detail = problem.detail;
  } catch {
    // Not every failure is ProblemDetails - a 401 from the auth middleware has no body at all.
  }

  return new DiApiError(title, response.status, detail);
}

const json = async <T>(response: Response): Promise<T> => response.json() as Promise<T>;

// ---------------------------------------------------------------- templates

export async function fetchTemplates(getToken: TokenGetter): Promise<DiTemplateSummary[]> {
  const response = await request("/templates?take=500", getToken);
  const body = await json<{ total: number; items: DiTemplateSummary[] }>(response);
  return body.items;
}

export const fetchTemplate = async (key: string, getToken: TokenGetter): Promise<DiTemplate> =>
  json(await request(`/templates/${key}`, getToken));

export const createTemplate = async (template: DiTemplate, getToken: TokenGetter): Promise<DiTemplateSaveResponse> =>
  json(await request("/templates", getToken, { method: "POST", json: template }));

export const updateTemplate = async (template: DiTemplate, getToken: TokenGetter): Promise<DiTemplateSaveResponse> =>
  json(await request(`/templates/${template.key}`, getToken, { method: "PUT", json: template }));

export async function deleteTemplate(key: string, getToken: TokenGetter): Promise<void> {
  await request(`/templates/${key}`, getToken, { method: "DELETE" });
}

/** `targetKey` is the folder the copy goes into; null is the Templates root. */
export const duplicateTemplate = async (
  key: string, targetKey: string | null, getToken: TokenGetter,
): Promise<DiTemplateSaveResponse> =>
  json(await request(`/templates/${key}/duplicate`, getToken, { method: "POST", json: { targetKey } }));

export async function exportTemplate(key: string, getToken: TokenGetter): Promise<Blob> {
  return (await request(`/templates/${key}/export`, getToken)).blob();
}

/** `parentKey` is the folder the import was started from; null or omitted is the Templates root. */
export const importTemplate = async (
  templateJson: string,
  mode: "create" | "overwrite",
  getToken: TokenGetter,
  parentKey: string | null = null,
): Promise<DiTemplateSaveResponse> =>
  json(await request("/templates/import", getToken, { method: "POST", json: { json: templateJson, mode, parentKey } }));

// ---------------------------------------------------------------- tree and folders

export interface DiPaged<T> {
  total: number;
  items: T[];
}

function treeQuery(skip: number, take: number, foldersOnly: boolean, parentKey?: string): string {
  const search = new URLSearchParams({ skip: String(skip), take: String(take) });
  if (foldersOnly) search.set("foldersOnly", "true");
  if (parentKey) search.set("parentKey", parentKey);
  return search.toString();
}

export const fetchTreeRoot = async (
  skip: number, take: number, foldersOnly: boolean, getToken: TokenGetter,
): Promise<DiPaged<DiTreeItem>> => json(await request(`/tree/root?${treeQuery(skip, take, foldersOnly)}`, getToken));

export const fetchTreeChildren = async (
  parentKey: string, skip: number, take: number, foldersOnly: boolean, getToken: TokenGetter,
): Promise<DiPaged<DiTreeItem>> =>
  json(await request(`/tree/children?${treeQuery(skip, take, foldersOnly, parentKey)}`, getToken));

/** From the top of the tree down to the item, the item itself last. */
export const fetchTreeAncestors = async (key: string, getToken: TokenGetter): Promise<DiTreeItem[]> =>
  json(await request(`/tree/ancestors?descendantKey=${encodeURIComponent(key)}`, getToken));

export async function fetchTreeItems(keys: string[], getToken: TokenGetter): Promise<DiTreeItem[]> {
  if (keys.length === 0) return [];
  const search = new URLSearchParams();
  for (const key of keys) search.append("key", key);
  return json(await request(`/item?${search}`, getToken));
}

export async function fetchCollection(
  query: { parentKey: string | null; filter?: string; skip?: number; take?: number; orderBy?: "name" | "updated" },
  getToken: TokenGetter,
): Promise<DiPaged<DiCollectionItem>> {
  const search = new URLSearchParams({ skip: String(query.skip ?? 0), take: String(query.take ?? 100) });
  if (query.parentKey) search.set("parentKey", query.parentKey);
  if (query.filter) search.set("filter", query.filter);
  if (query.orderBy) search.set("orderBy", query.orderBy);
  return json(await request(`/collection/templates?${search}`, getToken));
}

/**
 * A rendered thumbnail of a saved template against sample data. Fetched rather than put in an
 * `<img src>`, because the Management API needs the bearer token an image request cannot carry.
 */
export async function fetchThumbnail(key: string, width: number, getToken: TokenGetter): Promise<Blob> {
  return (await request(`/templates/${key}/thumbnail?width=${width}`, getToken)).blob();
}

export const createFolder = async (
  folder: { key?: string; name: string; parentKey: string | null }, getToken: TokenGetter,
): Promise<DiTemplateFolder> => json(await request("/folders", getToken, { method: "POST", json: folder }));

export const fetchFolder = async (key: string, getToken: TokenGetter): Promise<DiTemplateFolder> =>
  json(await request(`/folders/${key}`, getToken));

export const updateFolder = async (key: string, name: string, getToken: TokenGetter): Promise<DiTemplateFolder> =>
  json(await request(`/folders/${key}`, getToken, { method: "PUT", json: { name } }));

/** Refused with a 409 while the folder holds anything. */
export async function deleteFolder(key: string, getToken: TokenGetter): Promise<void> {
  await request(`/folders/${key}`, getToken, { method: "DELETE" });
}

/** `targetKey` null is the Templates root. */
export async function moveTemplate(key: string, targetKey: string | null, getToken: TokenGetter): Promise<void> {
  await request(`/templates/${key}/move`, getToken, { method: "PUT", json: { targetKey } });
}

export async function moveFolder(key: string, targetKey: string | null, getToken: TokenGetter): Promise<void> {
  await request(`/folders/${key}/move`, getToken, { method: "PUT", json: { targetKey } });
}

// ---------------------------------------------------------------- fonts

export const fetchFonts = async (getToken: TokenGetter): Promise<DiFont[]> =>
  json(await request("/fonts", getToken));

export async function uploadFont(file: File, getToken: TokenGetter): Promise<DiFont> {
  const form = new FormData();
  form.append("file", file);

  // No Content-Type header: the browser has to set the multipart boundary itself.
  return json(await request("/fonts", getToken, { method: "POST", body: form }));
}

export const registerFontPath = async (path: string, getToken: TokenGetter): Promise<DiFont> =>
  json(await request("/fonts/register-path", getToken, { method: "POST", json: { path } }));

/** 200 with rows plus per-variant errors when at least one row was created; a 400 (thrown) when none was. */
export const registerWebFont = async (
  request_: DiRegisterWebFontRequest, getToken: TokenGetter,
): Promise<DiRegisterWebFontResponse> =>
  json(await request("/fonts/register-web", getToken, { method: "POST", json: request_ }));

/** Re-resolves and re-downloads a web font; the returned row carries its new hash. */
export const refreshFont = async (key: string, getToken: TokenGetter): Promise<DiFont> =>
  json(await request(`/fonts/${key}/refresh`, getToken, { method: "POST" }));

export const updateFont = async (
  key: string,
  familyName: string,
  styles: DiFontStyle[],
  getToken: TokenGetter,
  // A detected weight is a guess read out of the file's names; these let an editor overrule it.
  overrides?: { weight?: number; isItalic?: boolean },
): Promise<DiFont> =>
  json(await request(`/fonts/${key}`, getToken, {
    method: "PUT",
    json: { familyName, styles, weight: overrides?.weight ?? null, isItalic: overrides?.isItalic ?? null },
  }));

export async function deleteFont(key: string, getToken: TokenGetter): Promise<void> {
  await request(`/fonts/${key}`, getToken, { method: "DELETE" });
}

export async function fetchFontFile(key: string, getToken: TokenGetter): Promise<ArrayBuffer> {
  return (await request(`/fonts/${key}/file`, getToken)).arrayBuffer();
}

// ---------------------------------------------------------------- document types

export const fetchDocumentTypes = async (getToken: TokenGetter): Promise<DiDocumentType[]> =>
  json(await request("/document-types", getToken));

export const fetchProperties = async (alias: string, getToken: TokenGetter): Promise<DiProperty[]> =>
  json(await request(`/document-types/${encodeURIComponent(alias)}/properties`, getToken));

/**
 * What a content-reference property points at, for the inspector's second dropdown. A property
 * that is not a content reference answers 200 with `inference: "none"` and empty lists, not an
 * error - the designer asks speculatively whenever the first dropdown changes.
 */
export const fetchLinkedProperties = async (
  alias: string, propertyAlias: string, getToken: TokenGetter,
): Promise<DiLinkedProperties> =>
  json(await request(
    `/document-types/${encodeURIComponent(alias)}/properties/${encodeURIComponent(propertyAlias)}/linked`,
    getToken,
  ));

export async function fetchSampleContent(
  alias: string, query: string, skip: number, take: number, getToken: TokenGetter,
): Promise<{ total: number; items: DiSampleContentItem[] }> {
  const search = new URLSearchParams({ skip: String(skip), take: String(take) });
  if (query) search.set("query", query);

  return json(await request(`/document-types/${encodeURIComponent(alias)}/content?${search}`, getToken));
}

// ---------------------------------------------------------------- preview

export interface PreviewOptions {
  contentKey?: string;
  useSampleData?: boolean;
  scale?: number;
  /** Lets the caller abort a preview that a further drag has already made stale. */
  signal?: AbortSignal;
}

export async function fetchPreview(
  template: DiTemplate, options: PreviewOptions, getToken: TokenGetter,
): Promise<Blob> {
  const response = await request("/preview", getToken, {
    method: "POST",
    signal: options.signal,
    json: {
      template,
      contentKey: options.contentKey ?? null,
      useSampleData: options.useSampleData ?? false,
      scale: options.scale ?? null,
    },
  });

  return response.blob();
}

export const fetchLayout = async (
  template: DiTemplate, options: PreviewOptions, getToken: TokenGetter,
): Promise<DiLayout> =>
  json(await request("/preview/layout", getToken, {
    method: "POST",
    signal: options.signal,
    json: {
      template,
      contentKey: options.contentKey ?? null,
      useSampleData: options.useSampleData ?? false,
    },
  }));

export const fetchImageInfo = async (
  mediaKey: string, getToken: TokenGetter,
): Promise<{ width: number; height: number; url?: string }> =>
  json(await request(`/media/${mediaKey}/image-info`, getToken));

// ---------------------------------------------------------------- regeneration

export const regenerateDocument = async (
  contentKey: string, getToken: TokenGetter,
): Promise<{ outcome: string; mediaKey?: string; propertyValue?: string; message?: string }> =>
  json(await request(`/documents/${contentKey}/regenerate`, getToken, { method: "POST" }));

export const regenerateTemplate = async (
  templateKey: string, onlyMissing: boolean, getToken: TokenGetter,
): Promise<DiJob> =>
  json(await request(`/templates/${templateKey}/regenerate`, getToken, { method: "POST", json: { onlyMissing } }));

export const fetchJob = async (id: string, getToken: TokenGetter): Promise<DiJob> =>
  json(await request(`/jobs/${id}`, getToken));

export async function cancelJob(id: string, getToken: TokenGetter): Promise<void> {
  await request(`/jobs/${id}/cancel`, getToken, { method: "POST" });
}

export const fetchUsage = async (templateKey: string, getToken: TokenGetter): Promise<DiUsage> =>
  json(await request(`/templates/${templateKey}/usage`, getToken));

// ---------------------------------------------------------------- health and sync

export const fetchHealth = async (getToken: TokenGetter): Promise<DiHealthReport> =>
  json(await request("/health", getToken));

export const fetchSyncStatus = async (getToken: TokenGetter): Promise<DiSyncStatus> =>
  json(await request("/sync/status", getToken));

export const runSyncExport = async (
  getToken: TokenGetter,
): Promise<{ written: number; imported: number; messages: string[] }> =>
  json(await request("/sync/export", getToken, { method: "POST" }));

export const runSyncImport = async (
  getToken: TokenGetter,
): Promise<{ written: number; imported: number; messages: string[] }> =>
  json(await request("/sync/import", getToken, { method: "POST" }));

// ---------------------------------------------------------------- routing

/**
 * Resolved against document.baseURI rather than a hard-coded "/umbraco", so the package keeps
 * working on installs that move the backoffice (Umbraco:CMS:Global:UmbracoPath). The backoffice
 * document carries a <base href> for exactly this reason - it is what router-slot matches on.
 */
export function hrefForTemplate(key: string): string {
  const relative = `section/${SECTION_PATHNAME}/workspace/${TEMPLATE_ENTITY_TYPE}/edit/${key}`;
  return new URL(relative, document.baseURI).pathname;
}

/**
 * The create route. With a parent, the new template is created in that folder - the same
 * `create/parent/:parentEntityType/:parentUnique` shape core's own create routes use.
 */
export function hrefForCreate(parent?: { entityType: string; unique: string | null }): string {
  const suffix = parent ? `/parent/${parent.entityType}/${parent.unique ?? "null"}` : "";
  return new URL(`section/${SECTION_PATHNAME}/workspace/${TEMPLATE_ENTITY_TYPE}/create${suffix}`, document.baseURI).pathname;
}

export function hrefForWorkspace(entityType: string, unique?: string | null): string {
  const suffix = unique ? `/edit/${unique}` : "";
  return new URL(`section/${SECTION_PATHNAME}/workspace/${entityType}${suffix}`, document.baseURI).pathname;
}

export function hrefForDashboard(pathname: string): string {
  return new URL(`section/${SECTION_PATHNAME}/dashboard/${pathname}`, document.baseURI).pathname;
}

/** The template key in the address bar, or "" when the current route is not a template workspace. */
export function templateKeyFromLocation(): string {
  const segment = window.location.pathname.split(`/workspace/${TEMPLATE_ENTITY_TYPE}/edit/`)[1];
  return segment ? decodeURIComponent(segment.split("/")[0]) : "";
}

/** Tells the menu (and anything else listening) that the template list has moved on. */
export function notifyTemplatesChanged(): void {
  window.dispatchEvent(new CustomEvent(TEMPLATES_CHANGED_EVENT));
}
