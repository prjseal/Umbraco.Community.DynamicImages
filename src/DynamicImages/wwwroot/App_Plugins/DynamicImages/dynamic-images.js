var dn = (e) => {
  throw TypeError(e);
};
var fs = (e, t, i) => t.has(e) || dn("Cannot " + i);
var c = (e, t, i) => (fs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), x = (e, t, i) => t.has(e) ? dn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (fs(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), E = (e, t, i) => (fs(e, t, "access private method"), i);
var ys = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as Lu, UmbEntityWorkspaceDataManager as zu, UmbSubmitWorkspaceAction as Is, UmbEntityNamedDetailWorkspaceContextBase as Fu, UmbWorkspaceActionBase as Uu } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Za, UmbContextConsumerController as Wu } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as Xn, UmbItemRepositoryBase as Nu, UmbItemServerDataSourceBase as Bu, UmbRepositoryBase as po } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as Jn, UmbItemStoreBase as Ku } from "@umbraco-cms/backoffice/store";
import { UmbId as ju } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as Vu, UMB_DATE_TIME_VALUE_TYPE as qu } from "@umbraco-cms/backoffice/value-type";
import { nothing as p, html as r, css as P, state as f, customElement as A, ifDefined as hn, property as g, repeat as V, classMap as Zn, styleMap as N } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as z } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as Gu, UmbTreeRepositoryBase as Hu } from "@umbraco-cms/backoffice/tree";
import { UMB_NOTIFICATION_CONTEXT as pe } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as Yu } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UmbRequestReloadChildrenOfEntityEvent as Qn, UmbRequestReloadStructureForEntityEvent as Xu, UmbEntityActionBase as Qa } from "@umbraco-cms/backoffice/entity-action";
import { UMB_AUTH_CONTEXT as Te } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as er, UMB_DISCARD_CHANGES_MODAL as Ju, umbConfirmModal as mo, UmbModalToken as fo, UmbModalBaseElement as yo, UMB_MODAL_MANAGER_CONTEXT as es } from "@umbraco-cms/backoffice/modal";
import { UMB_ACTION_EVENT_CONTEXT as tr } from "@umbraco-cms/backoffice/action";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as Zu } from "@umbraco-cms/backoffice/entity";
import { tryExecute as Qu } from "@umbraco-cms/backoffice/resources";
import { UmbDefaultCollectionContext as ed } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as td, UmbDeselectedEvent as id } from "@umbraco-cms/backoffice/event";
import { UMB_MEDIA_PICKER_MODAL as ir } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as ad } from "@umbraco-cms/backoffice/document-type";
import { UmbArrayState as bi, UmbStringState as pn, UmbObjectState as sd, UmbBooleanState as pa, UmbNumberState as od } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as nd } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as rd } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as ld } from "@umbraco-cms/backoffice/document";
const aa = "dynamic-images", sa = "di-template", Ma = "di:templates-changed", cd = "/umbraco/management/api/v1/dynamic-images";
class Be extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function w(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${cd}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await ud(n);
  return n;
}
async function ud(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new Be(t, e.status, i);
}
const T = async (e) => e.json();
async function ar(e) {
  const t = await w("/templates?take=500", e);
  return (await T(t)).items;
}
const ts = async (e, t) => T(await w(`/templates/${e}`, t)), sr = async (e, t) => T(await w("/templates", t, { method: "POST", json: e })), or = async (e, t) => T(await w(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function nr(e, t) {
  await w(`/templates/${e}`, t, { method: "DELETE" });
}
const rr = async (e, t) => T(await w(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function lr(e, t) {
  return (await w(`/templates/${e}/export`, t)).blob();
}
const cr = async (e, t, i, a = null) => T(await w("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function ur(e, t, i, a) {
  const s = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && s.set("foldersOnly", "true"), a && s.set("parentKey", a), s.toString();
}
const Os = async (e, t, i, a) => T(await w(`/tree/root?${ur(e, t, i)}`, a)), dr = async (e, t, i, a, s) => T(await w(`/tree/children?${ur(t, i, a, e)}`, s)), hr = async (e, t) => T(await w(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function go(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return T(await w(`/item?${i}`, t));
}
async function pr(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), T(await w(`/collection/templates?${i}`, t));
}
async function mr(e, t, i) {
  return (await w(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const fr = async (e, t) => T(await w("/folders", t, { method: "POST", json: e })), yr = async (e, t) => T(await w(`/folders/${e}`, t)), gr = async (e, t, i) => T(await w(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function vr(e, t) {
  await w(`/folders/${e}`, t, { method: "DELETE" });
}
async function br(e, t, i) {
  await w(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function _r(e, t, i) {
  await w(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
const Li = async (e) => T(await w("/fonts", e));
async function wr(e, t) {
  const i = new FormData();
  return i.append("file", e), T(await w("/fonts", t, { method: "POST", body: i }));
}
const $r = async (e, t) => T(await w("/fonts/register-path", t, { method: "POST", json: { path: e } })), xr = async (e, t) => T(await w("/fonts/register-web", t, { method: "POST", json: e })), kr = async (e, t) => T(await w(`/fonts/${e}/refresh`, t, { method: "POST" })), Tr = async (e, t, i, a, s) => T(await w(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function Sr(e, t) {
  await w(`/fonts/${e}`, t, { method: "DELETE" });
}
async function Er(e, t) {
  return (await w(`/fonts/${e}/file`, t)).arrayBuffer();
}
const dd = async (e) => T(await w("/document-types", e)), Dr = async (e, t) => T(await w(`/document-types/${encodeURIComponent(e)}/properties`, t)), Cr = async (e, t, i) => T(await w(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function Ir(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), T(await w(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function vo(e, t, i) {
  return (await w("/preview", i, {
    method: "POST",
    signal: t.signal,
    json: {
      template: e,
      contentKey: t.contentKey ?? null,
      useSampleData: t.useSampleData ?? !1,
      scale: t.scale ?? null
    }
  })).blob();
}
const bo = async (e, t, i) => T(await w("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), _o = async (e, t) => T(await w(`/media/${e}/image-info`, t)), is = async (e, t) => T(await w(`/documents/${e}/regenerate`, t, { method: "POST" })), wo = async (e, t, i) => T(await w(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), Or = async (e, t) => T(await w(`/jobs/${e}`, t));
async function Pr(e, t) {
  await w(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const Ar = async (e, t) => T(await w(`/templates/${e}/usage`, t)), $o = async (e) => T(await w("/health", e)), Mr = async (e) => T(await w("/sync/status", e)), Rr = async (e) => T(await w("/sync/export", e, { method: "POST" })), Lr = async (e) => T(await w("/sync/import", e, { method: "POST" }));
function as(e) {
  const t = `section/${aa}/workspace/${sa}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function zr(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${aa}/workspace/${sa}/create${t}`, document.baseURI).pathname;
}
function xo(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${aa}/workspace/${e}${i}`, document.baseURI).pathname;
}
function Fr(e) {
  return new URL(`section/${aa}/dashboard/${e}`, document.baseURI).pathname;
}
function Ur() {
  window.dispatchEvent(new CustomEvent(Ma));
}
const hd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: Be,
  SECTION_PATHNAME: aa,
  TEMPLATES_CHANGED_EVENT: Ma,
  TEMPLATE_ENTITY_TYPE: sa,
  cancelJob: Pr,
  createFolder: fr,
  createTemplate: sr,
  deleteFolder: vr,
  deleteFont: Sr,
  deleteTemplate: nr,
  duplicateTemplate: rr,
  exportTemplate: lr,
  fetchCollection: pr,
  fetchDocumentTypes: dd,
  fetchFolder: yr,
  fetchFontFile: Er,
  fetchFonts: Li,
  fetchHealth: $o,
  fetchImageInfo: _o,
  fetchJob: Or,
  fetchLayout: bo,
  fetchLinkedProperties: Cr,
  fetchPreview: vo,
  fetchProperties: Dr,
  fetchSampleContent: Ir,
  fetchSyncStatus: Mr,
  fetchTemplate: ts,
  fetchTemplates: ar,
  fetchThumbnail: mr,
  fetchTreeAncestors: hr,
  fetchTreeChildren: dr,
  fetchTreeItems: go,
  fetchTreeRoot: Os,
  fetchUsage: Ar,
  hrefForCreate: zr,
  hrefForDashboard: Fr,
  hrefForTemplate: as,
  hrefForWorkspace: xo,
  importTemplate: cr,
  moveFolder: _r,
  moveTemplate: br,
  notifyTemplatesChanged: Ur,
  refreshFont: kr,
  regenerateDocument: is,
  regenerateTemplate: wo,
  registerFontPath: $r,
  registerWebFont: xr,
  runSyncExport: Rr,
  runSyncImport: Lr,
  updateFolder: gr,
  updateFont: Tr,
  updateTemplate: or,
  uploadFont: wr
}, Symbol.toStringTag, { value: "Module" })), ss = () => crypto.randomUUID();
function os(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function Wr(e, t, i) {
  const { x: a, y: s } = os(e);
  return {
    type: "text",
    key: ss(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    // Dropped layers are centred on the pointer, which is what "I put it there" means.
    position: { x: a, y: s, anchor: "middleCentre" },
    size: { width: Math.round(e.template.canvas.width * 0.8), height: null },
    rotation: 0,
    visibility: { rule: "always" },
    binding: i,
    prefix: "",
    suffix: "",
    style: {
      fontKey: e.defaultFontKey ?? "",
      styleName: null,
      fontSize: 48,
      fontStyle: "Regular",
      colour: "#FFFFFF",
      textAlign: "left",
      lineSpacing: 1.1,
      letterSpacing: 0,
      textTransform: "none",
      maxLines: 3,
      overflow: "shrink"
    }
  };
}
function Nr(e, t, i) {
  const { x: a, y: s } = os(e);
  return {
    type: "image",
    key: ss(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: a, y: s, anchor: "middleCentre" },
    size: { width: 320, height: 180 },
    rotation: 0,
    visibility: { rule: "always" },
    source: i ? { kind: "property", propertyAlias: i, fallback: null } : { kind: "none" },
    fit: "cover",
    cornerRadius: 16,
    border: null
  };
}
function Br(e, t, i) {
  const { x: a, y: s } = os(e);
  return {
    type: "badges",
    key: ss(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: a, y: s, anchor: "middleCentre" },
    size: {},
    rotation: 0,
    visibility: { rule: "always" },
    itemsPropertyAlias: i,
    labelPropertyAlias: null,
    maxItems: 2,
    gap: 40,
    direction: "horizontal",
    wrap: !1,
    rowGap: 20,
    icon: { kind: "pathPattern", basePath: "/assets/og-icons", propertyAlias: "shortName", extension: ".png" },
    badge: { size: 88, innerSize: 44, fillColour: "#FFFFFF14", borderColour: "#FFFFFF26", borderWidth: 1.5 },
    label: {
      fontKey: e.defaultFontKey ?? "",
      styleName: null,
      fontSize: 22,
      colour: "#6B7280",
      textTransform: "uppercase",
      letterSpacing: 1,
      gap: 10,
      position: "below"
    }
  };
}
function pd(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = os(e);
  return {
    type: "rect",
    key: ss(),
    name: i === "ellipse" && t === "Shape" ? "Ellipse" : t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: a, y: s, anchor: "middleCentre" },
    // A circle is the ellipse people reach for; a scrim is wide.
    size: i === "ellipse" ? { width: 200, height: 200 } : { width: 400, height: 200 },
    rotation: 0,
    visibility: { rule: "always" },
    shape: i,
    fill: "#00000099",
    gradient: null,
    cornerRadius: 0,
    sides: 5,
    innerRatio: 0.5,
    border: null
  };
}
function md(e) {
  switch (e) {
    case "media":
      return "image";
    case "content":
    case "list":
      return "badges";
    // Spelled out rather than left to the default, because a boolean does not produce a layer at
    // all - see createLayerForProperty. This is what it *would* be if it did.
    case "boolean":
      return "text";
    default:
      return "text";
  }
}
function fd(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (md(e.classification)) {
    case "image":
      return { kind: "layer", layer: Nr(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: Br(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: Wr(t, e.name, yd(e)) };
  }
}
function yd(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Kr() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function gd(e) {
  return {
    schemaVersion: 2,
    key: crypto.randomUUID(),
    alias: "",
    name: e,
    isEnabled: !0,
    docTypeAliases: [],
    targetPropertyAlias: "",
    trigger: { onPublish: !0, onlyWhenEmpty: !0 },
    output: { mediaFolderKey: null, fileNamePattern: "{name}", format: "png", quality: 90 },
    canvas: {
      width: 1200,
      height: 630,
      background: "#0B0F19",
      baseImage: { kind: "none" },
      baseImageFit: "cover"
    },
    layers: [],
    // The server stamps this on save; an epoch value means "I have never seen a stored version",
    // which the concurrency check treats as a first write.
    updatedUtc: (/* @__PURE__ */ new Date(0)).toISOString()
  };
}
const jr = [
  "topLeft",
  "topCentre",
  "topRight",
  "middleLeft",
  "middleCentre",
  "middleRight",
  "bottomLeft",
  "bottomCentre",
  "bottomRight"
];
function zi(e) {
  switch (e) {
    case "topLeft":
    case "middleLeft":
    case "bottomLeft":
      return 0;
    case "topCentre":
    case "middleCentre":
    case "bottomCentre":
      return 0.5;
    default:
      return 1;
  }
}
function Fi(e) {
  switch (e) {
    case "topLeft":
    case "topCentre":
    case "topRight":
      return 0;
    case "middleLeft":
    case "middleCentre":
    case "middleRight":
      return 0.5;
    default:
      return 1;
  }
}
function Ps(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return jr[a * 3 + i];
}
function ns(e, t, i) {
  return {
    x: e.x - t * zi(e.anchor),
    y: e.y - i * Fi(e.anchor)
  };
}
function ko(e, t, i, a, s) {
  return {
    x: e + i * zi(s),
    y: t + a * Fi(s)
  };
}
function vd(e, t, i, a) {
  const s = ns(e, t, i), o = ko(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function bd(e, t) {
  const i = ko(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Vr(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function jt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), d = e - i, m = t - a;
  return { x: i + d * n - m * l, y: a + d * l + m * n };
}
function _d(e, t, i, a, s) {
  return jt(e, t, i, a, -s);
}
function qr(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    jt(e.x, e.y, t, i, a),
    jt(e.x + e.width, e.y, t, i, a),
    jt(e.x + e.width, e.y + e.height, t, i, a),
    jt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((m) => m.x)), n = Math.max(...s.map((m) => m.x)), l = Math.min(...s.map((m) => m.y)), d = Math.max(...s.map((m) => m.y));
  return { x: o, y: l, width: n - o, height: d - l };
}
const wd = 10;
function Pe(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Gr(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Ra(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function mn(e) {
  return e === "below" || e === "above";
}
function fn(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function $d(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function xd(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = fn(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...fn(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function kd(e, t, i) {
  const a = e.position;
  if (!Gr(a)) return a;
  if (xd(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = zi(a.anchor), l = Fi(a.anchor);
  const d = yn(e, a.relativeX, !1, t, i);
  d && (s = d.coordinate, n = d.factor);
  const m = yn(e, a.relativeY, !0, t, i);
  return m && (o = m.coordinate, l = m.factor), { x: s, y: o, anchor: Ps(n, l) };
}
function yn(e, t, i, a, s) {
  if (!t || mn(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let n = t.layerKey;
  for (; !o.has(n); ) {
    o.add(n);
    const l = a.get(n);
    if (!l) return;
    const d = s(n);
    if (d)
      switch (t.edge) {
        case "below":
          return { coordinate: d.y + d.height + t.gap, factor: 0 };
        case "above":
          return { coordinate: d.y - t.gap, factor: 1 };
        case "rightOf":
          return { coordinate: d.x + d.width + t.gap, factor: 0 };
        default:
          return { coordinate: d.x - t.gap, factor: 1 };
      }
    const m = i ? l.position.relativeY : l.position.relativeX;
    if (!m || mn(m.edge) !== i) return;
    n = m.layerKey;
  }
}
function Td(e, t, i) {
  const a = $d(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const d = s.get(l.key);
    if (d) return d;
    let m;
    o.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), m = kd(l, a, (Je) => {
      const Re = a.get(Je);
      return Re && !i(Re) ? n(Re).extent : void 0;
    }), o.delete(l.key));
    const S = t(l), H = ns(m, S.width, S.height), Se = { x: H.x, y: H.y, width: S.width, height: S.height }, Me = { position: m, box: Se, extent: qr(Se, m.x, m.y, l.rotation ?? 0) };
    return s.set(l.key, Me), Me;
  };
  for (const l of e) n(l);
  return s;
}
function As(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? Ps(zi(i.anchor), Fi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? Ps(zi(e.anchor), Fi(i.anchor)) : e.anchor
  };
}
var re, Fe, De, it;
class Sd {
  constructor(t = 100) {
    x(this, re, []);
    x(this, Fe, []);
    x(this, De, 0);
    x(this, it);
    this.limit = t;
  }
  get canUndo() {
    return c(this, re).length > 0;
  }
  get canRedo() {
    return c(this, Fe).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, De) > 0 || (c(this, re).push(structuredClone(t)), c(this, re).length > this.limit && c(this, re).shift(), _(this, Fe, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, De) === 0 && _(this, it, structuredClone(t)), ys(this, De)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, De) !== 0 && (ys(this, De)._--, !(c(this, De) > 0) && (t && c(this, it) !== void 0 && (c(this, re).push(c(this, it)), c(this, re).length > this.limit && c(this, re).shift(), _(this, Fe, [])), _(this, it, void 0)));
  }
  undo(t) {
    const i = c(this, re).pop();
    if (i !== void 0)
      return c(this, Fe).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Fe).pop();
    if (i !== void 0)
      return c(this, re).push(structuredClone(t)), i;
  }
  clear() {
    _(this, re, []), _(this, Fe, []), _(this, De, 0), _(this, it, void 0);
  }
}
re = new WeakMap(), Fe = new WeakMap(), De = new WeakMap(), it = new WeakMap();
const Ed = "DynamicImages.Workspace.Template", Dd = 12;
var Zt, at, kt, Tt, St, Qt, ei, ti, Et, ii, Ue, ai, si, le, Qi, Dt, Ce, Ct, $, Hr, oi, ni, Ms, Rs, Ls, Le, vt, zs, Yr, Fs;
class Cd extends Lu {
  constructor(i) {
    super(i, Ed);
    x(this, $);
    x(this, Zt);
    x(this, at);
    x(this, kt);
    x(this, Tt);
    x(this, St);
    x(this, Qt);
    x(this, ei);
    x(this, ti);
    x(this, Et);
    x(this, ii);
    x(this, Ue);
    x(this, ai);
    x(this, si);
    x(this, le);
    x(this, Qi);
    x(this, Dt);
    x(this, Ce);
    x(this, Ct);
    x(this, oi);
    x(this, ni);
    this._data = new zu(this), this.template = this._data.current, _(this, Zt, new bi([], (a) => a.key)), this.layers = c(this, Zt).asObservable(), _(this, at, new pn(void 0)), this.selectedLayerKey = c(this, at).asObservable(), _(this, kt, new bi([], (a) => a.alias)), this.properties = c(this, kt).asObservable(), _(this, Tt, new sd({})), this.linkedProperties = c(this, Tt).asObservable(), _(this, St, new bi([], (a) => a.key)), this.fonts = c(this, St).asObservable(), _(this, Qt, new bi([], (a) => a.key)), this.serverBounds = c(this, Qt).asObservable(), _(this, ei, new bi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, ei).asObservable(), _(this, ti, new pn(void 0)), this.sampleContentKey = c(this, ti).asObservable(), _(this, Et, new pa(!0)), this.useSampleData = c(this, Et).asObservable(), _(this, ii, new od(1)), this.zoom = c(this, ii).asObservable(), _(this, Ue, new pa(!0)), this.loading = c(this, Ue).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ai, new pa(!1)), this.canUndo = c(this, ai).asObservable(), _(this, si, new pa(!1)), this.canRedo = c(this, si).asObservable(), _(this, le, new Sd()), _(this, Ce, !1), _(this, Ct, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, oi, async (a) => {
      const s = a.detail;
      if (c(this, Ct) || !(s != null && s.url) || !E(this, $, Hr).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await er(this, Ju), _(this, Ct, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, ni, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, Qi)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => vs),
        setup: (a, s) => {
          const o = s.match.params.parentUnique;
          return this.createScaffold(void 0, o && o !== "null" ? o : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => vs),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => vs),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Te, (a) => {
      _(this, Qi, a);
    }), this.consumeContext(pe, (a) => {
      _(this, Dt, a);
    }), window.addEventListener("willchangestate", c(this, oi)), window.addEventListener("beforeunload", c(this, ni)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Ce);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Ue).setValue(!0), _(this, Ce, !1);
    try {
      const a = await ts(i, this.getToken);
      E(this, $, vt).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await E(this, $, Ms).call(this, a);
    } catch (a) {
      E(this, $, Fs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Ue).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, Ue).setValue(!0), _(this, Ce, !0), E(this, $, vt).call(this, { ...gd(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await E(this, $, Ms).call(this, this._data.getCurrent()), c(this, Ue).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await E(this, $, Ls).call(this, i.docTypeAliases);
    c(this, kt).setValue(a), c(this, Tt).setValue(await E(this, $, Rs).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, St).setValue(await Li(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    E(this, $, Le).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    E(this, $, Le).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    E(this, $, Le).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    E(this, $, Le).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    E(this, $, Le).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    E(this, $, Le).call(this, (s) => ({
      ...s,
      layers: s.layers.map((o) => o.key === i ? { ...o, ...a } : o)
    }));
  }
  /**
   * Removes a layer, and detaches anything positioned against it in the same update - so one undo
   * restores both the layer and the links to it. `resolvedPositions` is where those layers were
   * actually drawn, which is what lets them stay put; without it they fall back to their own
   * stored coordinates.
   */
  removeLayer(i, a) {
    E(this, $, Le).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, d;
        let n = o.position;
        return ((l = Ra(n, "x")) == null ? void 0 : l.layerKey) === i && (n = As(n, "x", a == null ? void 0 : a.get(o.key))), ((d = Ra(n, "y")) == null ? void 0 : d.layerKey) === i && (n = As(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), c(this, at).getValue() === i && this.selectLayer(void 0);
  }
  duplicateLayer(i) {
    var o;
    const a = (o = this._data.getCurrent()) == null ? void 0 : o.layers.find((n) => n.key === i);
    if (!a) return;
    const s = {
      ...structuredClone(a),
      key: crypto.randomUUID(),
      name: `${a.name} copy`,
      // Offset so the copy is visibly a copy rather than hidden exactly behind the original.
      position: { ...a.position, x: a.position.x + 20, y: a.position.y + 20 }
    };
    this.addLayer(s);
  }
  /** Moves a layer to an index in the array, which is its z-order. */
  moveLayer(i, a) {
    E(this, $, Le).call(this, (s) => {
      const o = [...s.layers], n = o.findIndex((d) => d.key === i);
      if (n < 0) return s;
      const [l] = o.splice(n, 1);
      return o.splice(Math.max(0, Math.min(o.length, a)), 0, l), { ...s, layers: o };
    });
  }
  setLayerVisible(i, a) {
    this.updateLayer(i, { isVisible: a });
  }
  setLayerLocked(i, a) {
    this.updateLayer(i, { isLocked: a });
  }
  selectLayer(i) {
    c(this, at).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, at).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, le).begin(i);
  }
  endTransaction(i = !0) {
    c(this, le).end(i), E(this, $, zs).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, le).undo(i);
    a && E(this, $, vt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, le).redo(i);
    a && E(this, $, vt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Qt).setValue(i);
  }
  setIssues(i) {
    c(this, ei).setValue(i);
  }
  setSampleContentKey(i) {
    c(this, ti).setValue(i), c(this, Et).setValue(!i);
  }
  setUseSampleData(i) {
    c(this, Et).setValue(i);
  }
  setZoom(i) {
    c(this, ii).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = c(this, Ce) ? await sr(i, this.getToken) : await or(i, this.getToken);
      E(this, $, vt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Ce);
      _(this, Ce, !1), this.setIsNew(!1), Ur(), await E(this, $, Yr).call(this, o.template, n), (a = c(this, Dt)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, Dt)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", as(o.template.key));
    } catch (o) {
      throw E(this, $, Fs).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Ct, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, oi)), window.removeEventListener("beforeunload", c(this, ni)), c(this, le).clear(), super.destroy();
  }
}
Zt = new WeakMap(), at = new WeakMap(), kt = new WeakMap(), Tt = new WeakMap(), St = new WeakMap(), Qt = new WeakMap(), ei = new WeakMap(), ti = new WeakMap(), Et = new WeakMap(), ii = new WeakMap(), Ue = new WeakMap(), ai = new WeakMap(), si = new WeakMap(), le = new WeakMap(), Qi = new WeakMap(), Dt = new WeakMap(), Ce = new WeakMap(), Ct = new WeakMap(), $ = new WeakSet(), /**
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
Hr = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, oi = new WeakMap(), ni = new WeakMap(), Ms = async function(i) {
  const [a, s] = await Promise.all([
    Li(this.getToken).catch(() => []),
    E(this, $, Ls).call(this, i.docTypeAliases)
  ]);
  c(this, St).setValue(a), c(this, kt).setValue(s), c(this, Tt).setValue(await E(this, $, Rs).call(this, i.docTypeAliases, s));
}, Rs = async function(i, a) {
  const s = a.filter((n) => n.classification === "content").slice(0, Dd);
  if (s.length === 0 || i.length === 0) return {};
  const o = await Promise.all(
    s.map(async (n) => {
      const l = await Promise.all(
        i.map((m) => Cr(m, n.alias, this.getToken).catch(() => null))
      ), d = /* @__PURE__ */ new Map();
      for (const m of l.flatMap((S) => (S == null ? void 0 : S.properties) ?? []))
        d.has(m.alias) || d.set(m.alias, m);
      return [n.alias, [...d.values()]];
    })
  );
  return Object.fromEntries(o.filter(([, n]) => n.length > 0));
}, Ls = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => Dr(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Le = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && c(this, le).push(s);
  const o = i(structuredClone(s));
  E(this, $, vt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
vt = function(i, a) {
  a != null && a.resetHistory && c(this, le).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Zt).setValue(i.layers), E(this, $, zs).call(this);
}, zs = function() {
  c(this, ai).setValue(c(this, le).canUndo), c(this, si).setValue(c(this, le).canRedo);
}, Yr = async function(i, a) {
  const s = await this.getContext(tr).catch(() => {
  });
  s && (a ? s.dispatchEvent(new Qn({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : s.dispatchEvent(new Xu({ entityType: "di-template", unique: i.key })));
}, Fs = function(i, a) {
  var o;
  const s = a instanceof Be ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, Dt)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const Wt = new Za(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), ui = "di-template-root", ae = "di-template-folder", _e = sa, La = "DynamicImages.Tree.Templates", Ii = "DynamicImages.Repository.TemplateTree", Oi = "DynamicImages.Repository.TemplateFolder", Id = "DynamicImages.Store.TemplateFolder", za = "DynamicImages.Workspace.TemplateFolder", Xr = "DynamicImages.Workspace.TemplateRoot", gn = "DynamicImages.Repository.TemplateItem", Od = "DynamicImages.Store.TemplateItem", vn = "DynamicImages.Repository.TemplateDetail", Pd = "DynamicImages.Store.TemplateDetail", bn = "DynamicImages.Repository.MoveTemplate", _n = "DynamicImages.Repository.MoveTemplateFolder", wn = "DynamicImages.Repository.DuplicateTemplate", Jr = "icon-picture", Zr = "icon-picture color-grey", Qr = "icon-folder", Us = "DynamicImages.Collection.Templates", $n = "DynamicImages.Repository.TemplateCollection";
async function K(e, t) {
  const i = (async () => {
    const a = await new Wu(e, Te).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (s) {
      throw s instanceof Be ? { type: "error", title: s.message, status: s.status, detail: s.detail } : s;
    }
  })();
  return await Qu(e, i);
}
var st;
class Ad {
  constructor(t) {
    x(this, st);
    _(this, st, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: ae,
      unique: ju.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await K(c(this, st), (s) => yr(t, s));
    return i ? { data: { entityType: ae, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await K(c(this, st), (o) => fr({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await K(c(this, st), (s) => gr(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return K(c(this, st), (i) => vr(t, i));
  }
}
st = new WeakMap();
const To = new Za("DiTemplateFolderStore");
class el extends Jn {
  constructor(t) {
    super(t, To);
  }
}
class xn extends Xn {
  constructor(t) {
    super(t, Ad, To);
  }
}
const Md = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: To,
  DiTemplateFolderRepository: xn,
  DiTemplateFolderStore: el,
  api: xn
}, Symbol.toStringTag, { value: "Module" })), Rd = [
  {
    type: "repository",
    alias: Oi,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => Md)
  },
  {
    type: "store",
    alias: Id,
    name: "Dynamic Images Template Folder Store",
    api: el
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [ae],
    meta: { folderRepositoryAlias: Oi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [ae],
    meta: { folderRepositoryAlias: Oi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: za,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => Xd),
    meta: { entityType: ae }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: Is,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: za }]
  }
], Ld = [
  {
    type: "repository",
    alias: Ii,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => Qd)
  },
  {
    type: "tree",
    kind: "default",
    alias: La,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: Ii }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [ui, ae, _e]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: La, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: Xr,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: ui, headline: "Templates" }
  },
  ...Rd
], So = new Za("DiTemplateItemStore");
class tl extends Ku {
  constructor(t) {
    super(t, So);
  }
}
class zd extends Bu {
  constructor(t) {
    super(t, {
      getItems: (i) => K(t, (a) => go(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? ae : _e,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class kn extends Nu {
  constructor(t) {
    super(t, zd, So);
  }
}
const Fd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: So,
  DiTemplateItemRepository: kn,
  DiTemplateItemStore: tl,
  api: kn
}, Symbol.toStringTag, { value: "Module" })), Eo = new Za("DiTemplateDetailStore");
class il extends Jn {
  constructor(t) {
    super(t, Eo);
  }
}
const gs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var ri;
class Ud {
  constructor(t) {
    x(this, ri);
    this.createScaffold = gs, this.create = gs, this.update = gs, _(this, ri, t);
  }
  async read(t) {
    const { data: i, error: a } = await K(c(this, ri), (s) => ts(t, s));
    return i ? { data: { entityType: _e, unique: i.key, name: i.name } } : { error: a };
  }
  delete(t) {
    return K(c(this, ri), (i) => nr(t, i));
  }
}
ri = new WeakMap();
class Tn extends Xn {
  constructor(t) {
    super(t, Ud, Eo);
  }
}
const Wd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: Eo,
  DiTemplateDetailRepository: Tn,
  DiTemplateDetailStore: il,
  api: Tn
}, Symbol.toStringTag, { value: "Module" })), _i = [ui, ae], Nd = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: gn,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => Fd)
  },
  {
    type: "itemStore",
    alias: Od,
    name: "Dynamic Images Template Item Store",
    api: tl
  },
  {
    type: "repository",
    alias: vn,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => Wd)
  },
  {
    type: "store",
    alias: Pd,
    name: "Dynamic Images Template Detail Store",
    api: il
  },
  {
    type: "repository",
    alias: bn,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => ih)
  },
  {
    type: "repository",
    alias: _n,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => ah)
  },
  {
    type: "repository",
    alias: wn,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => sh)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: _i,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => oh),
    forEntityTypes: _i,
    meta: {
      icon: "icon-picture",
      label: "Template",
      description: "A generated image design for one or more document types"
    }
  },
  // Cast because 17.5's folder create option kind declares its manifest type in a file that no
  // public entry point imports, so the global manifest map never learns about `kind: "folder"`.
  // The kind itself is registered and works exactly as core's document type folder option.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.TemplateFolder",
    name: "Dynamic Images Template Folder Create Option",
    weight: 90,
    forEntityTypes: _i,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Oi
    }
  },
  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [_e],
    meta: {
      treeRepositoryAlias: Ii,
      moveRepositoryAlias: bn,
      treeAlias: La,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicate",
    alias: "DynamicImages.EntityAction.Template.Duplicate",
    name: "Duplicate Dynamic Images Template",
    forEntityTypes: [_e],
    meta: {
      icon: "icon-documents",
      label: "Duplicate",
      duplicateRepositoryAlias: wn,
      treeRepositoryAlias: Ii
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => nh),
    forEntityTypes: [_e],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => lh),
    forEntityTypes: [_e],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [_e],
    meta: {
      itemRepositoryAlias: gn,
      detailRepositoryAlias: vn,
      additionalOptions: !0,
      confirm: {
        headline: "Delete template",
        message: "Delete <strong>{0}</strong>? Images it already generated stay in the media library."
      }
    }
  },
  // ---------------------------------------------------------------- folder
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.TemplateFolder.MoveTo",
    name: "Move Dynamic Images Template Folder",
    forEntityTypes: [ae],
    meta: {
      treeRepositoryAlias: Ii,
      moveRepositoryAlias: _n,
      treeAlias: La,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  // ---------------------------------------------------------------- root and folder
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Import",
    name: "Import a Dynamic Images Template",
    api: () => Promise.resolve().then(() => hh),
    forEntityTypes: _i,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON…", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: _i
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => vh)
  }
], ma = [{ alias: "Umb.Condition.CollectionAlias", match: Us }], Bd = [
  {
    type: "repository",
    alias: $n,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => bh)
  },
  {
    type: "collection",
    kind: "default",
    alias: Us,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => _h),
    meta: { repositoryAlias: $n }
  },
  {
    type: "collectionView",
    kind: "table",
    alias: "DynamicImages.CollectionView.Templates.Table",
    name: "Dynamic Images Template Table View",
    weight: 300,
    meta: {
      label: "List",
      icon: "icon-list",
      pathName: "list",
      columns: [
        { field: "docTypes", label: "Document types" },
        { field: "targetProperty", label: "Target property" },
        { field: "canvas", label: "Canvas" },
        { field: "layers", label: "Layers" },
        { field: "isEnabled", label: "Enabled", valueType: Vu },
        { field: "updated", label: "Last updated", valueType: qu }
      ]
    },
    conditions: ma
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: ma
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => kh),
    forEntityTypes: [_e]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: ma
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: ma
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Templates.Collection",
    name: "Dynamic Images Templates Collection Workspace View",
    meta: {
      label: "Templates",
      pathname: "templates",
      icon: "icon-grid",
      collectionAlias: Us
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [Xr, za]
      }
    ]
  }
], Kd = [
  ...Ld,
  ...Nd,
  ...Bd,
  // ---------------------------------------------------------------- sidebar
  //
  // The sidebar app, the menu and the Fonts/Health link items are NOT here - they live in
  // wwwroot/App_Plugins/DynamicImages/umbraco-package.json, which Umbraco reads before this
  // bundle loads, so the section chrome paints immediately rather than after the entry point
  // has downloaded. None of them needs an element, so nothing is lost by moving them.
  //
  // The Templates tree's menu item is in tree/manifests.ts: a `tree` kind menu item, which needs
  // the tree registered first.
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => Dh),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Rh),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Uh),
    weight: 80,
    meta: { label: "Health", pathname: "health" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  // ---------------------------------------------------------------- workspace
  {
    type: "workspace",
    kind: "routable",
    alias: "DynamicImages.Workspace.Template",
    name: "Dynamic Images Template Workspace",
    api: Cd,
    meta: { entityType: sa }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => Qp),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => am),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => rm),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => hm),
    weight: 50,
    meta: { label: "Usage", pathname: "usage", icon: "icon-documents" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  // ---------------------------------------------------------------- workspace actions
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Save",
    name: "Dynamic Images Save",
    api: () => Promise.resolve().then(() => pm),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => mm),
    weight: 90,
    meta: { label: "Regenerate all", look: "secondary", color: "default" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  // ---------------------------------------------------------------- content integration
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.RegenerateDocument",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => fm),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => ym),
    // A property action rather than a custom property editor UI, so adopting the package needs no
    // data type changes on anyone's existing document types.
    forPropertyEditorUis: ["Umb.PropertyEditorUi.MediaPicker"],
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  // ---------------------------------------------------------------- modals
  {
    type: "modal",
    alias: "DynamicImages.Modal.SampleNodePicker",
    name: "Dynamic Images Sample Node Picker",
    element: () => Promise.resolve().then(() => _m)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => Em)
  }
], nf = (e, t) => {
  t.registerMany(Kd);
};
var jd = Object.defineProperty, Vd = Object.getOwnPropertyDescriptor, al = (e) => {
  throw TypeError(e);
}, Do = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Vd(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && jd(t, i, s), s;
}, Co = (e, t, i) => t.has(e) || al("Cannot " + i), qd = (e, t, i) => (Co(e, t, "read from private field"), t.get(e)), Sn = (e, t, i) => t.has(e) ? al("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gd = (e, t, i, a) => (Co(e, t, "write to private field"), t.set(e, i), i), Hd = (e, t, i) => (Co(e, t, "access private method"), i), Fa, Ws, sl;
let Rt = class extends z {
  constructor() {
    super(), Sn(this, Ws), Sn(this, Fa), this._name = "", this._loading = !0, this.consumeContext(Wt, (e) => {
      Gd(this, Fa, e), e && (this.observe(e.template, (t) => {
        this._name = (t == null ? void 0 : t.name) ?? "";
      }), this.observe(e.loading, (t) => {
        this._loading = t ?? !1;
      }));
    });
  }
  render() {
    return r`
      <umb-workspace-editor alias="DynamicImages.Workspace.Template" .loading=${this._loading}>
        <div slot="header" class="header">
          <uui-input
            id="name"
            label="Template name"
            placeholder="Give this template a name"
            .value=${this._name}
            @input=${Hd(this, Ws, sl)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Fa = /* @__PURE__ */ new WeakMap();
Ws = /* @__PURE__ */ new WeakSet();
sl = function(e) {
  var i;
  const t = e.target.value;
  (i = qd(this, Fa)) == null || i.updateTemplateFields({ name: t });
};
Rt.styles = P`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .header {
      display: flex;
      width: 100%;
    }

    #name {
      width: 100%;
      flex: 1 1 auto;
    }
  `;
Do([
  f()
], Rt.prototype, "_name", 2);
Do([
  f()
], Rt.prototype, "_loading", 2);
Rt = Do([
  A("di-template-editor")
], Rt);
const Yd = Rt, vs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Rt;
  },
  default: Yd
}, Symbol.toStringTag, { value: "Module" }));
class En extends Fu {
  constructor(t) {
    super(t, {
      workspaceAlias: za,
      entityType: ae,
      detailRepositoryAlias: Oi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Om),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Xd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: En,
  api: En
}, Symbol.toStringTag, { value: "Module" }));
function bs(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function Jd(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? ae : ui
    },
    name: e.name,
    entityType: t ? ae : _e,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? Qr : e.isEnabled ? Jr : Zr,
    isEnabled: e.isEnabled
  };
}
class Zd extends Gu {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = bs(i);
        return K(t, (o) => Os(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = bs(i);
          return K(t, (d) => Os(n, l, i.foldersOnly ?? !1, d));
        }
        const a = i.parent.unique, { skip: s, take: o } = bs(i);
        return K(t, (n) => dr(a, s, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => K(t, (a) => hr(i.treeItem.unique, a)),
      mapper: Jd
    });
  }
}
class Dn extends Hu {
  constructor(t) {
    super(t, Zd);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: ui,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const Qd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: Dn,
  api: Dn
}, Symbol.toStringTag, { value: "Module" }));
class ol extends po {
  async requestMoveTo(t) {
    const { error: i } = await K(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(pe);
      a == null || a.peek("positive", { data: { message: "Moved" } });
    }
    return { error: i };
  }
}
class eh extends ol {
  constructor() {
    super(...arguments), this.move = br;
  }
}
class th extends ol {
  constructor() {
    super(...arguments), this.move = _r;
  }
}
const ih = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: eh
}, Symbol.toStringTag, { value: "Module" })), ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: th
}, Symbol.toStringTag, { value: "Module" }));
class Cn extends po {
  async requestDuplicate(t) {
    const { data: i, error: a } = await K(this, (s) => rr(t.unique, s));
    if (i) {
      const s = await this.getContext(pe);
      s == null || s.peek("positive", { data: { message: `'${i.template.name}' created` } });
    }
    return { error: a };
  }
}
const sh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateTemplateRepository: Cn,
  api: Cn
}, Symbol.toStringTag, { value: "Module" }));
class In extends Yu {
  async getHref() {
    return zr({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: In,
  api: In
}, Symbol.toStringTag, { value: "Module" }));
class On extends Qa {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await K(this, async (n) => ({
      blob: await lr(t, n),
      alias: (await ts(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const s = URL.createObjectURL(i.blob), o = document.createElement("a");
    o.href = s, o.download = `${i.alias}.json`, o.click(), URL.revokeObjectURL(s);
  }
}
const nh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: On,
  api: On
}, Symbol.toStringTag, { value: "Module" })), rh = 1500;
async function nl(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((s) => setTimeout(s, rh));
    try {
      a = await Or(a.id, t);
    } catch {
      i == null || i.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }
  if (a.status === "completed") {
    const s = a.failures.length;
    i == null || i.peek(s > 0 ? "warning" : "positive", {
      data: {
        headline: "Regeneration finished",
        message: `${a.generated} generated, ${a.skipped} skipped${s > 0 ? `, ${s} failed` : ""}.`
      }
    });
    for (const o of a.failures.slice(0, 3))
      i == null || i.peek("danger", { data: { message: o } });
  } else
    i == null || i.peek("danger", {
      data: { headline: `Regeneration ${a.status}`, message: a.failures[0] ?? "" }
    });
}
class Pn extends Qa {
  async execute() {
    var d;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await K(this, (m) => go([t], m)), a = ((d = i == null ? void 0 : i[0]) == null ? void 0 : d.name) ?? "this template";
    await mo(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: s, error: o } = await K(this, (m) => wo(t, !1, m));
    if (o || !s) throw o ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(pe);
    n == null || n.peek("positive", { data: { message: `Regenerating ${s.total} item(s)…` } });
    const l = await this.getContext(Te);
    await nl(s, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: Pn,
  api: Pn
}, Symbol.toStringTag, { value: "Module" })), ch = new fo(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), uh = new fo(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), dh = new fo(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class An extends Qa {
  async execute() {
    const { json: t } = await er(this, dh, { data: {} }), i = this.args.unique ?? null, { data: a, error: s } = await K(this, (l) => cr(t, "create", l, i));
    if (s || !a) throw s ?? new Error("The template could not be imported.");
    const o = await this.getContext(pe);
    o == null || o.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) o == null || o.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(tr);
    n == null || n.dispatchEvent(new Qn({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: An,
  api: An
}, Symbol.toStringTag, { value: "Module" }));
var ph = Object.defineProperty, mh = Object.getOwnPropertyDescriptor, rl = (e) => {
  throw TypeError(e);
}, ll = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? mh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ph(t, i, s), s;
}, fh = (e, t, i) => t.has(e) || rl("Cannot " + i), yh = (e, t, i) => t.has(e) ? rl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mn = (e, t, i) => (fh(e, t, "access private method"), i), va, cl, ul;
let di = class extends yo {
  constructor() {
    super(...arguments), yh(this, va), this._json = "";
  }
  render() {
    return r`
      <umb-body-layout headline="Import template">
        <uui-box>
          <umb-property-layout
            orientation="vertical"
            label="Template JSON"
            description="Paste an exported template, or choose its .json file. An alias already in use gets a new one.">
            <div slot="editor" class="editor">
              <input type="file" accept=".json,application/json" @change=${Mn(this, va, cl)} aria-label="Choose a file" />
              <uui-textarea
                label="Template JSON"
                rows="16"
                .value=${this._json}
                @input=${(e) => this._json = e.target.value}></uui-textarea>
            </div>
          </umb-property-layout>
        </uui-box>
        <div slot="actions">
          <uui-button label="Close" @click=${this._rejectModal}></uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Import"
            ?disabled=${!this._json.trim()}
            @click=${Mn(this, va, ul)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
va = /* @__PURE__ */ new WeakSet();
cl = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
ul = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
di.styles = [
  P`
      .editor {
        display: flex;
        flex-direction: column;
        gap: var(--uui-size-space-3);
      }

      uui-textarea {
        width: 100%;
        font-family: monospace;
      }
    `
];
ll([
  f()
], di.prototype, "_json", 2);
di = ll([
  A("di-import-template-modal")
], di);
const gh = di, vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return di;
  },
  default: gh
}, Symbol.toStringTag, { value: "Module" }));
function dl(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? ae : _e,
    name: e.name,
    icon: t ? Qr : e.isEnabled ? Jr : Zr,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class Rn extends po {
  async requestCollection(t = {}) {
    const i = await this.getContext(Zu), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: o } = await K(this, (n) => pr({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return s ? { data: { total: s.total, items: s.items.map(dl) } } : { error: o };
  }
}
const bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: Rn,
  api: Rn,
  mapCollectionItem: dl
}, Symbol.toStringTag, { value: "Module" }));
class Ln extends ed {
  async requestItemHref(t) {
    return t.entityType === ae ? xo(ae, t.unique) : as(t.unique);
  }
}
const _h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: Ln,
  api: Ln
}, Symbol.toStringTag, { value: "Module" }));
var wh = Object.defineProperty, $h = Object.getOwnPropertyDescriptor, hl = (e) => {
  throw TypeError(e);
}, qe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $h(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && wh(t, i, s), s;
}, Io = (e, t, i) => t.has(e) || hl("Cannot " + i), Ua = (e, t, i) => (Io(e, t, "read from private field"), i ? i.call(e) : t.get(e)), fa = (e, t, i) => t.has(e) ? hl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ba = (e, t, i, a) => (Io(e, t, "write to private field"), t.set(e, i), i), _s = (e, t, i) => (Io(e, t, "access private method"), i), Wa, xi, Ui, ki, pl, ml, fl;
const xh = 400;
let ue = class extends z {
  constructor() {
    super(), fa(this, ki), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, fa(this, Wa), fa(this, xi), fa(this, Ui), this.consumeContext(Te, (e) => {
      ba(this, Wa, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), ba(this, xi, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && _s(this, ki, pl).call(this);
    })), Ua(this, xi).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Ua(this, xi)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, ba(this, Ui, void 0);
  }
  render() {
    return this.item ? r`
      <uui-card-media
        name=${this.item.name}
        detail=${hn(this.item.docTypes || void 0)}
        href=${hn(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${_s(this, ki, ml)}
        @deselected=${_s(this, ki, fl)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : p}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : p;
  }
};
Wa = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
Ui = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakSet();
pl = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || Ua(this, Ui) === t)) {
    ba(this, Ui, t);
    try {
      const i = await mr(e.unique, xh, () => {
        var a;
        return (a = Ua(this, Wa)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
ml = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new td(this.item.unique)));
};
fl = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new id(this.item.unique)));
};
ue.styles = [
  P`
      uui-card-media {
        height: 100%;
      }

      img {
        object-fit: contain;
      }

      slot[name="actions"] {
        --uui-button-background-color: var(--uui-color-surface);
        --uui-button-background-color-hover: var(--uui-color-surface);
      }
    `
];
qe([
  g({ type: Object })
], ue.prototype, "item", 2);
qe([
  g({ type: Boolean })
], ue.prototype, "selectable", 2);
qe([
  g({ type: Boolean })
], ue.prototype, "selected", 2);
qe([
  g({ type: Boolean, attribute: "select-only" })
], ue.prototype, "selectOnly", 2);
qe([
  g({ type: Boolean })
], ue.prototype, "disabled", 2);
qe([
  g({ type: String })
], ue.prototype, "href", 2);
qe([
  f()
], ue.prototype, "_src", 2);
qe([
  f()
], ue.prototype, "_failed", 2);
ue = qe([
  A("di-template-collection-card")
], ue);
const kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return ue;
  },
  get element() {
    return ue;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Th = Object.defineProperty, Sh = Object.getOwnPropertyDescriptor, yl = (e) => {
  throw TypeError(e);
}, oa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Sh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Th(t, i, s), s;
}, Oo = (e, t, i) => t.has(e) || yl("Cannot " + i), nt = (e, t, i) => (Oo(e, t, "read from private field"), t.get(e)), wi = (e, t, i) => t.has(e) ? yl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), zn = (e, t, i, a) => (Oo(e, t, "write to private field"), t.set(e, i), i), Ne = (e, t, i) => (Oo(e, t, "access private method"), i), Ti, Na, _a, Pi, we, Ns, gl, vl, Si, bl;
let Ke = class extends z {
  constructor() {
    super(), wi(this, we), wi(this, Ti), wi(this, Na), this._templates = [], this._fonts = [], this._loading = !0, wi(this, _a, () => {
      nt(this, Ti) && Ne(this, we, Ns).call(this);
    }), wi(this, Pi, () => {
      var e;
      return (e = nt(this, Ti)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(pe, (e) => {
      zn(this, Na, e);
    }), this.consumeContext(Te, (e) => {
      zn(this, Ti, e), e && Ne(this, we, Ns).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Ma, nt(this, _a));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Ma, nt(this, _a));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${Ne(this, we, vl).call(this)} ${Ne(this, we, bl).call(this)}
      </umb-body-layout>
    `;
  }
};
Ti = /* @__PURE__ */ new WeakMap();
Na = /* @__PURE__ */ new WeakMap();
_a = /* @__PURE__ */ new WeakMap();
Pi = /* @__PURE__ */ new WeakMap();
we = /* @__PURE__ */ new WeakSet();
Ns = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      ar(nt(this, Pi)),
      Li(nt(this, Pi)).catch(() => []),
      $o(nt(this, Pi)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    Ne(this, we, gl).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
gl = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = nt(this, Na)) == null || s.peek(e, { data: { headline: t, message: a } });
};
vl = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${Ne(this, we, Si).call(this, "Templates", this._templates.length, "icon-brush", !1, xo(ui))}
        ${Ne(this, we, Si).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${Ne(this, we, Si).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${Ne(this, we, Si).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
Si = function(e, t, i, a = !1, s) {
  const o = r`
      <uui-icon name=${i}></uui-icon>
      <div class="stat-value">${t}</div>
      <div class="stat-label">${e}</div>
    `;
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        ${s ? r`<a class="stat-link" href=${s} aria-label="${e}: ${t}">${o}</a>` : o}
      </uui-box>
    `;
};
bl = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${V(
    e.slice(0, 8),
    (i, a) => `${i.code}-${a}`,
    (i) => r`
              <uui-table-row>
                <uui-table-cell style="width: 90px">
                  <uui-tag color=${i.severity === "error" ? "danger" : "warning"} look="secondary">
                    ${i.severity}
                  </uui-tag>
                </uui-table-cell>
                <uui-table-cell>
                  ${i.templateName ? r`<strong>${i.templateName}</strong> — ` : p}${i.message}
                </uui-table-cell>
              </uui-table-row>
            `
  )}
        </uui-table>
        <uui-button look="secondary" href=${Fr("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Ke.styles = P`
    :host {
      display: block;
    }

    .state {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-layout-3);
    }

    uui-box {
      margin-bottom: var(--uui-size-layout-1);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--uui-size-space-4);
      margin-bottom: var(--uui-size-layout-1);
    }

    .stat {
      text-align: center;
    }

    .stat.warn {
      border-left: 3px solid var(--uui-color-warning);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.1;
    }

    .stat-label {
      color: var(--uui-color-text-alt);
      font-size: 0.85rem;
    }

    .stat-link {
      display: block;
      color: inherit;
      text-decoration: none;
    }

    .stat-link:hover .stat-label {
      text-decoration: underline;
    }
  `;
oa([
  f()
], Ke.prototype, "_templates", 2);
oa([
  f()
], Ke.prototype, "_fonts", 2);
oa([
  f()
], Ke.prototype, "_health", 2);
oa([
  f()
], Ke.prototype, "_loading", 2);
Ke = oa([
  A("di-overview-dashboard")
], Ke);
const Eh = Ke, Dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return Ke;
  },
  default: Eh
}, Symbol.toStringTag, { value: "Module" })), Bs = /* @__PURE__ */ new Map(), rs = (e) => `di-${e}`;
function Ch(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Bs.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await Er(e, t), o = new FontFace(rs(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return Bs.set(e, a), a;
}
async function _l(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => Ch(a, t)));
}
function wl(e) {
  Bs.delete(e);
}
var Ih = Object.defineProperty, Oh = Object.getOwnPropertyDescriptor, $l = (e) => {
  throw TypeError(e);
}, ls = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Oh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ih(t, i, s), s;
}, Po = (e, t, i) => t.has(e) || $l("Cannot " + i), Oe = (e, t, i) => (Po(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $i = (e, t, i) => t.has(e) ? $l("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ws = (e, t, i, a) => (Po(e, t, "write to private field"), t.set(e, i), i), R = (e, t, i) => (Po(e, t, "access private method"), i), wa, Wi, Ni, Lt, O, xl, fi, ut, Ks, kl, Tl, $a, Sl, El, Dl;
function Ph(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : Ah(e.sourceUrl);
    default:
      return "Media library";
  }
}
function Ah(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let dt = class extends z {
  constructor() {
    super(), $i(this, O), $i(this, wa), $i(this, Wi), $i(this, Ni), this._fonts = [], this._loading = !0, $i(this, Lt, () => {
      var e;
      return (e = Oe(this, wa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(es, (e) => {
      ws(this, Wi, e);
    }), this.consumeContext(pe, (e) => {
      ws(this, Ni, e);
    }), this.consumeContext(Te, (e) => {
      ws(this, wa, e), e && R(this, O, fi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${R(this, O, Ks)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${R(this, O, Ks)}>
                  Add your first font
                </uui-button>
              </div>` : r`${V(this._fonts, (e) => e.key, (e) => R(this, O, Sl).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
wa = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
Lt = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
xl = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
fi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Li(Oe(this, Lt)), await _l(this._fonts.map((e) => e.key), Oe(this, Lt));
  } catch (e) {
    R(this, O, ut).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
ut = function(e, t, i) {
  var s;
  const a = i instanceof Be ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Oe(this, Ni)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Ks = async function() {
  var i, a;
  if (!Oe(this, Wi)) return;
  const e = Oe(this, Wi).open(this, uh, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Oe(this, Ni)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await R(this, O, fi).call(this));
};
kl = async function(e) {
  try {
    await kr(e.key, Oe(this, Lt)), wl(e.key), R(this, O, ut).call(this, "positive", `'${e.familyName}' refreshed`), await R(this, O, fi).call(this);
  } catch (t) {
    R(this, O, ut).call(this, "danger", "That font could not be refreshed", t);
  }
};
Tl = async function(e) {
  await mo(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Sr(e.key, Oe(this, Lt)), wl(e.key), R(this, O, ut).call(this, "positive", `'${e.familyName}' deleted`), await R(this, O, fi).call(this);
  } catch (t) {
    R(this, O, ut).call(this, "danger", "That font could not be deleted", t);
  }
};
$a = async function(e, t, i, a) {
  try {
    await Tr(e.key, t, i, Oe(this, Lt), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), R(this, O, ut).call(this, "positive", `'${t}' saved`), await R(this, O, fi).call(this), a != null && a.keepOpen && await R(this, O, xl).call(this);
  } catch (s) {
    R(this, O, ut).call(this, "danger", "The font could not be saved", s);
  }
};
Sl = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${Ph(e)} · weight ${e.weight}
              ${e.isItalic ? "· italic" : ""}
              ${e.usedByTemplateCount > 0 ? r`· used by ${e.usedByTemplateCount} template(s)` : ""}
            </span>
          </div>
          <div class="row">
            <uui-button
              look="secondary"
              label="${t ? "Close" : "Edit"} the named styles for ${e.familyName}"
              @click=${() => {
    this._editingKey = t ? void 0 : e.key;
  }}>
              ${t ? "Close" : "Named styles"}
            </uui-button>
            ${e.sourceKind === "url" ? r`<uui-button
                  look="secondary"
                  label="Re-download ${e.familyName} from its provider"
                  @click=${() => R(this, O, kl).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => R(this, O, Tl).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${rs(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? R(this, O, Dl).call(this, e) : R(this, O, El).call(this, e)}
      </div>
    `;
};
El = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${V(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
Dl = function(e) {
  const t = [...e.styles];
  return r`
      <div class="editor">
        <div class="identity">
          <uui-input label="Family name" .value=${e.familyName} id="family-${e.key}"></uui-input>

          <uui-input
            type="number"
            label="Weight"
            min="1"
            max="1000"
            step="100"
            .value=${String(e.weight)}
            id="weight-${e.key}">
          </uui-input>

          <uui-toggle
            label="Italic"
            id="italic-${e.key}"
            ?checked=${e.isItalic}>
            Italic
          </uui-toggle>
        </div>

        <!-- The weight is read out of the font file's own names, which is a guess: a family that
             puts its weight nowhere a name can carry it cannot be detected. Correct it here. -->
        <small class="hint">
          Weight and slant are detected from the font file. Correct them here if they are wrong -
          a named style below chooses the <em>face</em> (Regular, Bold, Italic, BoldItalic), while
          this is the family's numeric weight.
        </small>

        <uui-table>
          <uui-table-head>
            <uui-table-head-cell>Name</uui-table-head-cell>
            <uui-table-head-cell>Size</uui-table-head-cell>
            <uui-table-head-cell>Weight</uui-table-head-cell>
            <uui-table-head-cell></uui-table-head-cell>
          </uui-table-head>
          ${V(
    t,
    (i, a) => a,
    (i, a) => r`
              <uui-table-row>
                <uui-table-cell>
                  <uui-input
                    class="style-name"
                    label="Style name"
                    .value=${i.name}
                    @change=${(s) => {
      t[a] = { ...i, name: s.target.value };
    }}>
                  </uui-input>
                </uui-table-cell>
                <uui-table-cell>
                  <uui-input
                    type="number"
                    .value=${String(i.size)}
                    @change=${(s) => {
      t[a] = { ...i, size: Number(s.target.value) };
    }}>
                  </uui-input>
                </uui-table-cell>
                <uui-table-cell>
                  <uui-input
                    .value=${i.fontStyle}
                    @change=${(s) => {
      t[a] = { ...i, fontStyle: s.target.value };
    }}>
                  </uui-input>
                </uui-table-cell>
                <uui-table-cell>
                  <uui-button
                    compact
                    look="secondary"
                    color="danger"
                    label="Remove ${i.name}"
                    @click=${() => {
      t.splice(a, 1), R(this, O, $a).call(this, e, e.familyName, t, { keepOpen: !0 });
    }}>
                    <uui-icon name="icon-trash"></uui-icon>
                  </uui-button>
                </uui-table-cell>
              </uui-table-row>
            `
  )}
        </uui-table>

        <div class="row">
          <uui-button
            look="secondary"
            label="Add a named style"
            @click=${() => {
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), R(this, O, $a).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    R(this, O, $a).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
      weight: a != null && a.value ? Number(a.value) : void 0,
      isItalic: s ? s.checked : void 0
    });
  }}>
            Save
          </uui-button>
        </div>
      </div>
    `;
};
dt.styles = P`
    :host {
      display: block;
    }

    .state {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-layout-3);
    }

    .identity {
      display: flex;
      gap: var(--uui-size-space-3);
      align-items: center;
      flex-wrap: wrap;
    }

    .hint {
      display: block;
      margin: var(--uui-size-space-2) 0 var(--uui-size-space-4);
      color: var(--uui-color-text-alt);
      font-size: 12px;
    }

    .font {
      padding: var(--uui-size-space-4) 0;
      border-bottom: 1px solid var(--uui-color-border);
    }

    .font:last-of-type {
      border-bottom: 0;
    }

    .head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--uui-size-space-4);
      flex-wrap: wrap;
    }

    .row {
      display: flex;
      gap: var(--uui-size-space-2);
      align-items: center;
      flex-wrap: wrap;
    }

    .meta {
      display: block;
      font-size: 12px;
      color: var(--uui-color-text-alt);
    }

    .specimen {
      margin: var(--uui-size-space-3) 0;
      font-size: 28px;
      line-height: 1.2;
    }

    .tags {
      display: flex;
      gap: var(--uui-size-space-2);
      flex-wrap: wrap;
    }

    .editor {
      display: grid;
      gap: var(--uui-size-space-3);
      padding: var(--uui-size-space-3);
      background: var(--uui-color-surface-alt);
      border-radius: var(--uui-border-radius);
    }

    .empty {
      text-align: center;
      padding: var(--uui-size-layout-2);
      color: var(--uui-color-text-alt);
    }

    .empty uui-icon {
      font-size: 2.5rem;
    }

    .empty h4 {
      margin: var(--uui-size-space-3) 0 var(--uui-size-space-2);
      color: var(--uui-color-text);
    }
  `;
ls([
  f()
], dt.prototype, "_fonts", 2);
ls([
  f()
], dt.prototype, "_loading", 2);
ls([
  f()
], dt.prototype, "_editingKey", 2);
dt = ls([
  A("di-fonts-dashboard")
], dt);
const Mh = dt, Rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return dt;
  },
  default: Mh
}, Symbol.toStringTag, { value: "Module" }));
var Lh = Object.defineProperty, zh = Object.getOwnPropertyDescriptor, Cl = (e) => {
  throw TypeError(e);
}, na = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Lh(t, i, s), s;
}, Ao = (e, t, i) => t.has(e) || Cl("Cannot " + i), Qe = (e, t, i) => (Ao(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ya = (e, t, i) => t.has(e) ? Cl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Fn = (e, t, i, a) => (Ao(e, t, "write to private field"), t.set(e, i), i), Vt = (e, t, i) => (Ao(e, t, "access private method"), i), xa, qt, hi, rt, Ba, js, Il;
let je = class extends z {
  constructor() {
    super(), ya(this, rt), ya(this, xa), ya(this, qt), this._loading = !0, this._busy = !1, ya(this, hi, () => {
      var e;
      return (e = Qe(this, xa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(pe, (e) => {
      Fn(this, qt, e);
    }), this.consumeContext(Te, (e) => {
      Fn(this, xa, e), e && Vt(this, rt, Ba).call(this);
    });
  }
  render() {
    if (this._loading) return r`<div class="state"><uui-loader></uui-loader></div>`;
    if (!this._health) return r`<p class="empty">The health report could not be loaded.</p>`;
    const e = this._health.issues, t = e.filter((a) => a.severity === "error"), i = e.filter((a) => a.severity === "warning");
    return r`
      <umb-body-layout headline="Health">
        <uui-box headline="Summary">
          <div slot="header-actions">
            <uui-button look="secondary" label="Re-check" @click=${() => Vt(this, rt, Ba).call(this)}>Re-check</uui-button>
          </div>

          <ul class="summary">
            <li>
              Image generation is
              <strong class=${this._health.isEnabled ? "ok" : "bad"}>${this._health.isEnabled ? "on" : "off"}</strong>
              ${this._health.isEnabled ? p : r`(set <code>DynamicImages:Enabled</code> to true)`}
            </li>
            <li><strong>${this._health.templateCount}</strong> template(s), <strong>${this._health.fontCount}</strong> font(s)</li>
            <li>
              <strong class=${t.length > 0 ? "bad" : "ok"}>${t.length}</strong> error(s),
              <strong>${i.length}</strong> warning(s)
            </li>
          </ul>
        </uui-box>

        <uui-box headline="Issues">
          ${e.length === 0 ? r`<p class="empty"><uui-icon name="icon-check"></uui-icon> Everything checks out.</p>` : r`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Severity</uui-table-head-cell>
                  <uui-table-head-cell>Template</uui-table-head-cell>
                  <uui-table-head-cell>Issue</uui-table-head-cell>
                  <uui-table-head-cell>Code</uui-table-head-cell>
                </uui-table-head>
                ${V(
      e,
      (a, s) => `${a.code}-${s}`,
      (a) => r`
                    <uui-table-row>
                      <uui-table-cell>
                        <uui-tag
                          look="secondary"
                          color=${a.severity === "error" ? "danger" : a.severity === "warning" ? "warning" : "default"}>
                          ${a.severity}
                        </uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>
                        ${a.templateKey ? r`<a href=${as(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Vt(this, rt, Il).call(this)}
      </umb-body-layout>
    `;
  }
};
xa = /* @__PURE__ */ new WeakMap();
qt = /* @__PURE__ */ new WeakMap();
hi = /* @__PURE__ */ new WeakMap();
rt = /* @__PURE__ */ new WeakSet();
Ba = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      $o(Qe(this, hi)),
      Mr(Qe(this, hi)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
js = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await Rr(Qe(this, hi)) : await Lr(Qe(this, hi));
    (t = Qe(this, qt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Qe(this, qt)) == null || i.peek("warning", { data: { message: o } });
    await Vt(this, rt, Ba).call(this);
  } catch (s) {
    (a = Qe(this, qt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Il = function() {
  return this._sync ? r`
      <uui-box headline="Environment transfer">
        <p>
          Templates live in the database. To move them between environments, export them to JSON files under
          <code>${this._sync.folder}</code> and commit those, or import files someone else committed.
        </p>
        <p class="meta">
          Mode: <strong>${this._sync.mode}</strong> · ${this._sync.fileCount} file(s)
          ${this._sync.lastWriteUtc ? r`· last written ${new Date(this._sync.lastWriteUtc).toLocaleString()}` : p}
        </p>

        <div class="row">
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Vt(this, rt, js).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Vt(this, rt, js).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
je.styles = P`
    :host {
      display: block;
    }

    uui-box {
      margin-bottom: var(--uui-size-layout-1);
    }

    .state {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-layout-3);
    }

    .summary {
      margin: 0;
      padding-left: var(--uui-size-space-5);
    }

    .ok {
      color: var(--uui-color-positive);
    }

    .bad {
      color: var(--uui-color-danger);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }

    .meta {
      font-size: 12px;
      color: var(--uui-color-text-alt);
    }

    .row {
      display: flex;
      gap: var(--uui-size-space-2);
      flex-wrap: wrap;
    }

    code {
      background: var(--uui-color-surface-alt);
      padding: 0 4px;
      border-radius: 2px;
    }
  `;
na([
  f()
], je.prototype, "_health", 2);
na([
  f()
], je.prototype, "_sync", 2);
na([
  f()
], je.prototype, "_loading", 2);
na([
  f()
], je.prototype, "_busy", 2);
je = na([
  A("di-health-dashboard")
], je);
const Fh = je, Uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return je;
  },
  default: Fh
}, Symbol.toStringTag, { value: "Module" })), Ol = 3, Pl = 12, Al = 0.1, Ml = 0.9;
function Wh(e) {
  return Math.max(Ol, Math.min(Pl, e));
}
function Nh(e) {
  return Math.max(Al, Math.min(Ml, e));
}
function Bh(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Wh(t), s = 0.5 * Nh(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let d = 0; d < o; d++) {
    const m = (-90 + d * n) * Math.PI / 180, S = e === "star" && d % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + S * Math.cos(m), y: 0.5 + S * Math.sin(m) });
  }
  return l;
}
function Kh(e, t, i) {
  const a = Bh(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
const y = {
  /**
   * Font size, in points. The maximum is the server's: `RenderLimits.MaxFontSize` clamps anything
   * larger, so offering more here would mean the designer showing a size the render will not use.
   */
  fontSize: { min: 1, max: 512 },
  /** Position. Negative is legitimate - a layer can be deliberately bled off the canvas edge. */
  x: { min: -5e3, max: 5e3 },
  y: { min: -5e3, max: 5e3 },
  /**
   * Any box dimension. Zero is not a size; "auto" is expressed by clearing the field, not by 0.
   * The maximum is the server's, and the server is the authority on what a canvas may be: a value
   * this field allowed but the renderer refused would be a template that saves and then cannot
   * produce an image.
   *
   * `RenderLimits.MaxCanvasSide` is the per-side cap. The server also caps the total *area* at 8
   * megapixels, which a number input cannot express - so 4096 x 4096 is typeable here and comes
   * back as a `CanvasSizeInvalid` validation error, which is where an area rule belongs.
   */
  width: { min: 1, max: 4096 },
  height: { min: 1, max: 4096 },
  /** A multiple of the font size. Below 0.5 the lines overlap. */
  lineSpacing: { min: 0.5, max: 4 },
  /** Tracking, in the same units the renderer uses. Negative tightens. */
  letterSpacing: { min: -20, max: 100 },
  maxLines: { min: 1, max: 20 },
  /** The family of non-negative lengths: radii, gaps and the badge sub-sizes. */
  cornerRadius: { min: 0, max: 2e3 },
  gap: { min: 0, max: 2e3 },
  rowGap: { min: 0, max: 2e3 },
  circleSize: { min: 0, max: 2e3 },
  iconSize: { min: 0, max: 2e3 },
  labelSize: { min: 0, max: 2e3 },
  labelGap: { min: 0, max: 2e3 },
  /** A stroke on a rect or a badge. 0 means "no border", which the inspector reads as null. */
  borderWidth: { min: 0, max: 200 },
  /**
   * The gap between a layer and the one it is positioned against. Unlike the badge gaps this one
   * may be negative: overlapping the reference layer is a legitimate design.
   */
  referenceGap: { min: -2e3, max: 2e3 },
  /** How many badges to draw before giving up. */
  maxItems: { min: 1, max: 50 },
  /** A gradient's direction. A full turn, and unlike rotation there is nothing to wrap onto. */
  gradientAngle: { min: 0, max: 360 },
  /** A radial gradient's centre, as a fraction of the box. Edited as a percentage, as zoom is. */
  gradientCentre: { min: 0, max: 1 },
  /** Opacity is a fraction, and always was bounded - it just was not enforced. */
  opacity: { min: 0, max: 1 },
  /**
   * These two are not a UI preference: they are the polygon/star geometry contract, shared with
   * the server and already clamped by `clampSides` / `clampInnerRatio`. Re-exported through the
   * table so the inspector still reads every bound from one place.
   */
  sides: { min: Ol, max: Pl },
  innerRatio: { min: Al, max: Ml }
}, Ka = { min: 0.1, max: 4 };
function jh(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function Rl(e) {
  if (e.kind === "radial") {
    const t = Math.round(Un(e.centreX ?? 0.5) * 100), i = Math.round(Un(e.centreY ?? 0.5) * 100);
    return `radial-gradient(ellipse farthest-corner at ${t}% ${i}%, ${e.from}, ${e.to})`;
  }
  return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
}
function Un(e) {
  return Math.min(1, Math.max(0, e));
}
const Mo = P`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Vh(e, t) {
  const i = [], a = t.lockX ? void 0 : Wn(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    qh(t),
    t.threshold
  ), s = t.lockY ? void 0 : Wn(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    Gh(t),
    t.threshold
  );
  return a && i.push({ orientation: "vertical", at: a.at, label: a.label }), s && i.push({ orientation: "horizontal", at: s.at, label: s.label }), {
    box: {
      ...e,
      x: t.lockX ? e.x : Math.round(a ? a.at - a.offset : e.x),
      y: t.lockY ? e.y : Math.round(s ? s.at - s.offset : e.y)
    },
    guides: i
  };
}
function qh(e) {
  const t = [
    { at: 0, label: "Left edge" },
    { at: e.canvasWidth / 2, label: "Centre" },
    { at: e.canvasWidth, label: "Right edge" }
  ];
  for (const i of e.others)
    t.push(
      { at: i.x, label: "Layer left" },
      { at: i.x + i.width / 2, label: "Layer centre" },
      { at: i.x + i.width, label: "Layer right" }
    );
  return t;
}
function Gh(e) {
  const t = [
    { at: 0, label: "Top edge" },
    { at: e.canvasHeight / 2, label: "Middle" },
    { at: e.canvasHeight, label: "Bottom edge" }
  ];
  for (const i of e.others)
    t.push(
      { at: i.y, label: "Layer top" },
      { at: i.y + i.height / 2, label: "Layer middle" },
      { at: i.y + i.height, label: "Layer bottom" }
    );
  return t;
}
function Wn(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var Hh = Object.defineProperty, Yh = Object.getOwnPropertyDescriptor, Ll = (e) => {
  throw TypeError(e);
}, Ge = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Yh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Hh(t, i, s), s;
}, Ro = (e, t, i) => t.has(e) || Ll("Cannot " + i), ge = (e, t, i) => (Ro(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $s = (e, t, i) => t.has(e) ? Ll("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xs = (e, t, i, a) => (Ro(e, t, "write to private field"), t.set(e, i), i), q = (e, t, i) => (Ro(e, t, "access private method"), i), bt, Ei, I, cs, Lo, zl, Fl, Ul, Wl, zo, ja, Nl, Bl, Kl, jl, Vl, ql, Gl, Hl, Yl;
const Xh = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], ks = 18;
let xe = class extends z {
  constructor() {
    super(...arguments), $s(this, I), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, $s(this, bt), $s(this, Ei);
  }
  willUpdate() {
    this._box = q(this, I, zl).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ge(this, Ei) && ((t = ge(this, bt)) == null || t.disconnect(), xs(this, Ei, e), e && (ge(this, bt) ?? xs(this, bt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ge(this, bt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ge(this, bt)) == null || e.disconnect(), xs(this, Ei, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${Zn({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${N({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ge(this, I, Fl) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...q(this, I, zo).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      q(this, I, Nl).call(this, t), q(this, I, ja).call(this, t);
    }}>
        ${q(this, I, Bl).call(this)}
      </div>

      ${this.selected ? q(this, I, Hl).call(this, e) : p}
      ${this.showMeasured && this.measured ? q(this, I, Yl).call(this) : p}
    `;
  }
};
bt = /* @__PURE__ */ new WeakMap();
Ei = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakSet();
cs = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Lo = function() {
  return this.layer.rotation ?? 0;
};
zl = function() {
  var s;
  const e = this.layer, t = e.size.width ?? q(this, I, Ul).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? q(this, I, Wl).call(this), a = ns(ge(this, I, cs), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
Fl = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
Ul = function() {
  var e;
  switch (this.layer.type) {
    case "badges": {
      if ((e = this.measured) != null && e.width) return this.measured.width;
      const { badge: t, label: i, gap: a, maxItems: s, direction: o } = this.layer, n = i.position === "right" ? t.size + i.gap + i.fontSize * 0.6 * 8 : t.size;
      return o === "horizontal" ? s * n + (s - 1) * a : n;
    }
    case "text":
      return 600;
    default:
      return 240;
  }
};
Wl = function() {
  switch (this.layer.type) {
    case "text": {
      const { fontSize: e, lineSpacing: t, maxLines: i } = this.layer.style;
      return e * t * (i ?? 1);
    }
    case "badges": {
      const { badge: e, label: t, gap: i, maxItems: a, direction: s } = this.layer, o = t.position === "below" ? e.size + t.gap + t.fontSize * 1.2 : t.position === "right" ? Math.max(e.size, t.fontSize * 1.2) : e.size;
      return s === "horizontal" ? o : a * o + (a - 1) * i;
    }
    default:
      return 135;
  }
};
zo = function(e) {
  const t = ge(this, I, Lo);
  if (t === 0) return {};
  const i = ge(this, I, cs);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
ja = function(e, t) {
  var i, a;
  this.layer.isLocked || (e.preventDefault(), e.stopPropagation(), (a = (i = e.target).setPointerCapture) == null || a.call(i, e.pointerId), this.dispatchEvent(
    new CustomEvent("di-layer-drag-start", {
      bubbles: !0,
      composed: !0,
      detail: {
        key: this.layer.key,
        handle: t,
        startX: e.clientX,
        startY: e.clientY,
        shiftKey: e.shiftKey,
        altKey: e.altKey
      }
    })
  ));
};
Nl = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Bl = function() {
  switch (this.layer.type) {
    case "text":
      return q(this, I, Kl).call(this);
    case "image":
      return q(this, I, Vl).call(this);
    case "badges":
      return q(this, I, ql).call(this);
    default:
      return q(this, I, Gl).call(this);
  }
};
Kl = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || q(this, I, jl).call(this);
  return r`
      <div
        class="text"
        style=${N({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${rs(e.fontKey)}, sans-serif`,
    fontSize: `${e.fontSize * this.scale}px`,
    lineHeight: String(e.lineSpacing),
    letterSpacing: `${e.letterSpacing * this.scale}px`,
    color: e.colour,
    textAlign: e.textAlign === "centre" ? "center" : e.textAlign,
    textTransform: e.textTransform === "none" ? "none" : e.textTransform,
    // -webkit-line-clamp is the closest DOM equivalent of the server's maxLines handling.
    ...e.maxLines ? { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: String(e.maxLines), overflow: "hidden" } : {}
  })}>
        ${t}
      </div>
    `;
};
jl = function() {
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
};
Vl = function() {
  if (this.layer.type !== "image") return p;
  const e = this.layer.border;
  return r`
      <div
        class="image"
        style=${N({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
ql = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", d = l && o, m = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${N({
    flexDirection: l ? "row" : "column",
    flexWrap: d ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...d ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${V(
    Array.from({ length: Math.max(1, a) }, (S, H) => H),
    (S) => S,
    () => r`
            <div class=${Zn({ badge: !0, right: m === "right" })}>
              <div
                class="circle"
                style=${N({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${m === "none" ? p : r`<div
                    class="badge-label"
                    style=${N({
      ...m === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${rs(t.fontKey)}, sans-serif`,
      fontSize: `${t.fontSize * this.scale}px`,
      color: t.colour,
      textTransform: t.textTransform === "none" ? "none" : t.textTransform,
      letterSpacing: `${t.letterSpacing * this.scale}px`
    })}>
                    Label
                  </div>`}
            </div>
          `
  )}
      </div>
    `;
};
Gl = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? Rl(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${N({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${o}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const n = Kh(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${N({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${N({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
Hl = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = ge(this, I, cs), n = ge(this, I, Lo), l = Pe(this.layer.position, "x") || Pe(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${N({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...q(this, I, zo).call(this, e) })}>
        <span
          class="tag"
          style=${N(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${V(
    Xh,
    (d) => d,
    (d) => r`
                  <span
                    class="handle ${d}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${d}"
                    @pointerdown=${(m) => q(this, I, ja).call(this, m, d)}>
                  </span>
                `
  )}
              <span class="stalk" style=${N({ height: `${ks}px`, top: `${-ks}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${N({ top: `${-ks}px` })}
                @pointerdown=${(d) => q(this, I, ja).call(this, d, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${N({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
Yl = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return r`
      <div
        class="measured"
        style=${N({
    left: `${e.x * this.scale}px`,
    top: `${e.y * this.scale}px`,
    width: `${e.width * this.scale}px`,
    height: `${e.height * this.scale}px`,
    ...t !== 0 ? {
      transform: `rotate(${t}deg)`,
      transformOrigin: `${(e.pivotX - e.x) * this.scale}px ${(e.pivotY - e.y) * this.scale}px`
    } : {}
  })}>
      </div>
    `;
};
xe.styles = P`
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
Ge([
  g({ type: Object })
], xe.prototype, "layer", 2);
Ge([
  g({ type: Number })
], xe.prototype, "scale", 2);
Ge([
  g({ type: Boolean, reflect: !0 })
], xe.prototype, "selected", 2);
Ge([
  g({ type: Object })
], xe.prototype, "measured", 2);
Ge([
  g({ type: Boolean })
], xe.prototype, "showMeasured", 2);
Ge([
  g({ type: String })
], xe.prototype, "resolvedText", 2);
Ge([
  g({ attribute: !1 })
], xe.prototype, "resolvedPosition", 2);
Ge([
  f()
], xe.prototype, "_box", 2);
xe = Ge([
  A("di-layer-box")
], xe);
var Jh = Object.defineProperty, Zh = Object.getOwnPropertyDescriptor, Xl = (e) => {
  throw TypeError(e);
}, Fo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Jh(t, i, s), s;
}, Qh = (e, t, i) => t.has(e) || Xl("Cannot " + i), ep = (e, t, i) => t.has(e) ? Xl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), tp = (e, t, i) => (Qh(e, t, "access private method"), i), Vs, Jl;
let Bi = class extends z {
  constructor() {
    super(...arguments), ep(this, Vs), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${V(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => tp(this, Vs, Jl).call(this, e)
    )}`;
  }
};
Vs = /* @__PURE__ */ new WeakSet();
Jl = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Bi.styles = P`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      /* Above the layer boxes, so a guide is never hidden behind the thing it is guiding. */
      z-index: 40;
    }

    .guide {
      position: absolute;
      /* Hard-coded, unlike everything else: a UUI token could resolve to a colour that vanishes
         against the artboard, and a guide that cannot be seen is worse than no guide. */
      background: #ff3fa4;
    }

    .vertical {
      top: 0;
      bottom: 0;
      width: 1px;
    }

    .horizontal {
      left: 0;
      right: 0;
      height: 1px;
    }

    .label {
      position: absolute;
      background: #ff3fa4;
      color: #fff;
      font-size: 10px;
      line-height: 1;
      padding: 2px 4px;
      border-radius: 2px;
      white-space: nowrap;
    }

    .vertical .label {
      top: 4px;
      left: 4px;
    }

    .horizontal .label {
      left: 4px;
      top: 4px;
    }

    @media (prefers-reduced-motion: no-preference) {
      .guide {
        animation: fade-in 120ms ease-out;
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
Fo([
  g({ type: Array })
], Bi.prototype, "guides", 2);
Fo([
  g({ type: Number })
], Bi.prototype, "scale", 2);
Bi = Fo([
  A("di-guides")
], Bi);
var ip = Object.defineProperty, ap = Object.getOwnPropertyDescriptor, Zl = (e) => {
  throw TypeError(e);
}, ra = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ap(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ip(t, i, s), s;
}, sp = (e, t, i) => t.has(e) || Zl("Cannot " + i), op = (e, t, i) => t.has(e) ? Zl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Nn = (e, t, i) => (sp(e, t, "access private method"), i), ka, qs;
let X = class extends z {
  constructor() {
    super(...arguments), op(this, ka), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Nn(this, ka, qs).call(this, "top"), Nn(this, ka, qs).call(this, "left");
  }
  render() {
    const e = this.pointer ? this.pointer.x * this.scale : void 0, t = this.pointer ? this.pointer.y * this.scale : void 0;
    return r`
      <div class="corner"></div>
      <div class="top">
        <canvas id="top"></canvas>
        ${e === void 0 ? "" : r`<div class="hairline vertical" style="left:${e}px"></div>`}
      </div>
      <div class="left">
        <canvas id="left"></canvas>
        ${t === void 0 ? "" : r`<div class="hairline horizontal" style="top:${t}px"></div>`}
      </div>
    `;
  }
};
ka = /* @__PURE__ */ new WeakSet();
qs = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : X.thickness) * o, t.height = (e === "top" ? X.thickness : s) * o, t.style.width = `${e === "top" ? s : X.thickness}px`, t.style.height = `${e === "top" ? X.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const d = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, S = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(d, X.thickness - S), i.lineTo(d, X.thickness)) : (i.moveTo(X.thickness - S, d), i.lineTo(X.thickness, d)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), d + 2, 9) : (i.save(), i.translate(9, d - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
X.thickness = 20;
X.styles = P`
    :host {
      display: contents;
    }

    .corner {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      background: var(--uui-color-surface-alt);
      z-index: 3;
    }

    .top,
    .left {
      position: absolute;
      background: var(--uui-color-surface-alt);
      z-index: 2;
    }

    .top {
      top: 0;
      left: 20px;
      height: 20px;
    }

    .left {
      top: 20px;
      left: 0;
      width: 20px;
    }

    .hairline {
      position: absolute;
      background: var(--uui-color-focus);
      pointer-events: none;
    }

    .vertical {
      top: 0;
      bottom: 0;
      width: 1px;
    }

    .horizontal {
      left: 0;
      right: 0;
      height: 1px;
    }
  `;
ra([
  g({ type: Number })
], X.prototype, "canvasWidth", 2);
ra([
  g({ type: Number })
], X.prototype, "canvasHeight", 2);
ra([
  g({ type: Number })
], X.prototype, "scale", 2);
ra([
  g({ type: Object })
], X.prototype, "pointer", 2);
X = ra([
  A("di-rulers")
], X);
var np = Object.defineProperty, rp = Object.getOwnPropertyDescriptor, Ql = (e) => {
  throw TypeError(e);
}, oe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? rp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && np(t, i, s), s;
}, Uo = (e, t, i) => t.has(e) || Ql("Cannot " + i), M = (e, t, i) => (Uo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ne = (e, t, i) => t.has(e) ? Ql("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ta = (e, t, i, a) => (Uo(e, t, "write to private field"), t.set(e, i), i), C = (e, t, i) => (Uo(e, t, "access private method"), i), _t, Di, ct, D, Wo, Gs, Hs, us, No, Ys, ec, tc, Bo, ic, ac, Xs, Sa, sc, oc, Bt, Ko, Js, Zs, Qs, nc, eo, to, io, rc;
const lp = 6, lc = 20, cp = 2, up = 15, dp = 0.1;
let ee = class extends z {
  constructor() {
    super(...arguments), ne(this, D), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ne(this, _t), ne(this, Di), ne(this, ct, /* @__PURE__ */ new Map()), ne(this, Xs, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = C(this, D, No).call(this, t), a = C(this, D, Ys).call(this, t), s = C(this, D, ec).call(this, t), o = C(this, D, us).call(this, e.detail.startX, e.detail.startY);
      Ta(this, _t, {
        key: t.key,
        handle: e.detail.handle,
        startClientX: e.detail.startX,
        startClientY: e.detail.startY,
        startBox: i,
        startPosition: s,
        startRotation: t.rotation ?? 0,
        startExtent: a,
        startAngle: Math.atan2(o.y - s.y, o.x - s.x),
        moved: !1,
        shiftKey: e.detail.shiftKey,
        altKey: e.detail.altKey
      }), this.dispatchEvent(new CustomEvent("di-transaction-begin", { bubbles: !0, composed: !0 }));
    }), ne(this, Sa, (e) => {
      var ha, un;
      this._pointer = C(this, D, Hs).call(this, e.clientX, e.clientY);
      const t = M(this, _t);
      if (!t) return;
      const i = this.template.layers.find((vi) => vi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        C(this, D, oc).call(this, i, t, e);
        return;
      }
      const o = Pe(i.position, "x"), n = Pe(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        C(this, D, sc).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let d = t.handle ? C(this, D, Ko).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (d = { ...d, x: t.startBox.x, width: (ha = t.handle) != null && ha.includes("w") ? t.startBox.width : d.width }), n && (d = { ...d, y: t.startBox.y, height: (un = t.handle) != null && un.includes("n") ? t.startBox.height : d.height });
      const m = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, S = l !== 0 ? { x: d.x + m.x, y: d.y + m.y, width: t.startExtent.width, height: t.startExtent.height } : d, Se = this.snapEnabled && !e.altKey ? Vh(S, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((vi) => vi.key !== i.key).map((vi) => C(this, D, Ys).call(this, vi)),
        threshold: lp / this.scale,
        lockX: o,
        lockY: n
      }) : {
        box: {
          ...S,
          x: o ? S.x : Math.round(S.x),
          y: n ? S.y : Math.round(S.y)
        },
        guides: []
      };
      this._guides = Se.guides;
      const Me = l !== 0 ? { ...d, x: Se.box.x - m.x, y: Se.box.y - m.y } : Se.box, Je = bd(Me, i.position);
      o && (Je.x = i.position.x), n && (Je.y = i.position.y);
      const Re = { position: Je };
      t.handle && (Re.size = {
        width: Math.max(1, Math.round(Me.width)),
        height: Math.max(1, Math.round(Me.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Re } })
      );
    }), ne(this, Bt, () => {
      if (!M(this, _t)) return;
      const e = M(this, _t).moved;
      Ta(this, _t, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ne(this, Js, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ne(this, Zs, () => {
      this._dropTarget = !1;
    }), ne(this, Qs, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = C(this, D, Hs).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: C(this, D, nc).call(this, e) }
        })
      );
    }), ne(this, eo, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ne(this, to, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Gr(t.position)) && this.requestUpdate();
    }), ne(this, io, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), Ta(this, Di, new ResizeObserver(() => C(this, D, Gs).call(this))), M(this, Di).observe(this), window.addEventListener("pointermove", M(this, Sa)), window.addEventListener("pointerup", M(this, Bt)), window.addEventListener("pointercancel", M(this, Bt));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = M(this, Di)) == null || e.disconnect(), window.removeEventListener("pointermove", M(this, Sa)), window.removeEventListener("pointerup", M(this, Bt)), window.removeEventListener("pointercancel", M(this, Bt));
  }
  updated(e) {
    C(this, D, Gs).call(this), e.has("zoom") && C(this, D, Wo).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = M(this, ct).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    C(this, D, tc).call(this);
    const s = this.showRulers ? lc : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${M(this, eo)}
        @dragover=${M(this, Js)}
        @dragleave=${M(this, Zs)}
        @drop=${M(this, Qs)}
        @di-layer-drag-start=${M(this, Xs)}
        @di-layer-box-resize=${M(this, to)}>
        <div
          class="artboard"
          style=${N({
      width: `${t + s}px`,
      height: `${i + s}px`,
      "--di-gutter": `${s}px`
    })}>
          ${this.showRulers ? r`<di-rulers
                .canvasWidth=${e.width}
                .canvasHeight=${e.height}
                .scale=${this.scale}
                .pointer=${this._pointer}>
              </di-rulers>` : p}

          <div
            class="stage"
            style=${N({
      background: e.backgroundGradient ? Rl(e.backgroundGradient) : e.background
    })}
            @pointerdown=${M(this, io)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${N({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${V(
      this.template.layers,
      (o) => o.key,
      (o) => {
        var n, l;
        return r`
                <di-layer-box
                  data-key=${o.key}
                  .layer=${o}
                  .scale=${this.scale}
                  .selected=${o.key === this.selectedLayerKey}
                  .measured=${a.get(o.key)}
                  .showMeasured=${this.showMeasured}
                  .resolvedText=${((n = a.get(o.key)) == null ? void 0 : n.resolvedText) ?? void 0}
                  .resolvedPosition=${(l = M(this, ct).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? C(this, D, rc).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
_t = /* @__PURE__ */ new WeakMap();
Di = /* @__PURE__ */ new WeakMap();
ct = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakSet();
Wo = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Gs = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? lc : 0) + cp, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, C(this, D, Wo).call(this));
};
Hs = function(e, t) {
  const i = C(this, D, us).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
us = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
No = function(e) {
  const t = M(this, ct).get(e.key);
  if (t) return t.box;
  const i = C(this, D, Bo).call(this, e), a = ns(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Ys = function(e) {
  const t = M(this, ct).get(e.key);
  return t ? t.extent : qr(C(this, D, No).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
ec = function(e) {
  var t;
  return ((t = M(this, ct).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
tc = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  Ta(this, ct, Td(
    this.template.layers,
    (i) => C(this, D, Bo).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Bo = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? C(this, D, ic).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? C(this, D, ac).call(this, e, i)
  };
};
ic = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
ac = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Xs = /* @__PURE__ */ new WeakMap();
Sa = /* @__PURE__ */ new WeakMap();
sc = function(e, t, i, a, s, o, n, l) {
  const d = t.startRotation, m = t.startPosition, S = _d(a, s, 0, 0, d);
  let H = C(this, D, Ko).call(this, t.startBox, i, S.x, S.y, o);
  n && (H = { ...H, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : H.width }), l && (H = { ...H, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : H.height });
  const Se = Math.max(1, Math.round(H.width)), Me = Math.max(1, Math.round(H.height)), Je = ko(H.x, H.y, Se, Me, m.anchor), Re = jt(Je.x, Je.y, m.x, m.y, d), ha = {
    ...e.position,
    x: n ? e.position.x : Math.round(Re.x),
    y: l ? e.position.y : Math.round(Re.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: ha, size: { width: Se, height: Me } } }
    })
  );
};
oc = function(e, t, i) {
  const a = t.startPosition, s = C(this, D, us).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, d = i.shiftKey ? up : dp, m = Vr(Math.round(l / d) * d);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
Bt = /* @__PURE__ */ new WeakMap();
Ko = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: d } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, d = e.height - a), t.includes("s") && (d = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(d - e.height) ? d = l / m : l = d * m, t.includes("n") && (n = e.y + e.height - d), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, d) };
};
Js = /* @__PURE__ */ new WeakMap();
Zs = /* @__PURE__ */ new WeakMap();
Qs = /* @__PURE__ */ new WeakMap();
nc = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
eo = /* @__PURE__ */ new WeakMap();
to = /* @__PURE__ */ new WeakMap();
io = /* @__PURE__ */ new WeakMap();
rc = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${N({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
ee.styles = P`
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
      ${Mo}
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
oe([
  g({ type: Object })
], ee.prototype, "template", 2);
oe([
  g({ type: String })
], ee.prototype, "selectedLayerKey", 2);
oe([
  g({ type: Object })
], ee.prototype, "baseImageUrl", 2);
oe([
  g({ type: Array })
], ee.prototype, "serverBounds", 2);
oe([
  g({ type: Boolean })
], ee.prototype, "showMeasured", 2);
oe([
  g({ type: Boolean })
], ee.prototype, "snapEnabled", 2);
oe([
  g({ type: Boolean })
], ee.prototype, "showRulers", 2);
oe([
  g({ type: Boolean })
], ee.prototype, "showSafeArea", 2);
oe([
  g({ type: Number })
], ee.prototype, "zoom", 2);
oe([
  f()
], ee.prototype, "_fitScale", 2);
oe([
  f()
], ee.prototype, "_guides", 2);
oe([
  f()
], ee.prototype, "_pointer", 2);
oe([
  f()
], ee.prototype, "_dropTarget", 2);
ee = oe([
  A("di-designer-canvas")
], ee);
var hp = Object.defineProperty, pp = Object.getOwnPropertyDescriptor, cc = (e) => {
  throw TypeError(e);
}, jo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? pp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && hp(t, i, s), s;
}, uc = (e, t, i) => t.has(e) || cc("Cannot " + i), mp = (e, t, i) => (uc(e, t, "read from private field"), i ? i.call(e) : t.get(e)), fp = (e, t, i) => t.has(e) ? cc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ie = (e, t, i) => (uc(e, t, "access private method"), i), ce, dc, hc, pc, mc, fc, wt;
const Bn = {
  text: "icon-font",
  richtext: "icon-article",
  date: "icon-calendar",
  media: "icon-picture",
  content: "icon-documents",
  list: "icon-tags",
  boolean: "icon-checkbox",
  number: "icon-calculator",
  readingTime: "icon-time",
  other: "icon-block"
};
let Ki = class extends z {
  constructor() {
    super(...arguments), fp(this, ce), this.properties = [], this._search = "";
  }
  render() {
    const e = yp(mp(this, ce, dc));
    return r`
      <div class="palette">
        <uui-input
          type="search"
          label="Search properties"
          placeholder="Search"
          .value=${this._search}
          @input=${(t) => {
      this._search = t.target.value;
    }}>
        </uui-input>

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : V(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => Ie(this, ce, mc).call(this, t, i)
    )}

        ${Ie(this, ce, fc).call(this)}
      </div>
    `;
  }
};
ce = /* @__PURE__ */ new WeakSet();
dc = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
hc = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
pc = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
mc = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${V(
    t,
    (i) => i.alias,
    (i) => Ie(this, ce, wt).call(
      this,
      i.name,
      Bn[i.classification] ?? Bn.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
fc = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Ie(this, ce, wt).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Ie(this, ce, wt).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Ie(this, ce, wt).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Ie(this, ce, wt).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Ie(this, ce, wt).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
wt = function(e, t, i, a, s) {
  const o = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(n) => Ie(this, ce, pc).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => Ie(this, ce, hc).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Ki.styles = P`
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
jo([
  g({ type: Array })
], Ki.prototype, "properties", 2);
jo([
  f()
], Ki.prototype, "_search", 2);
Ki = jo([
  A("di-property-palette")
], Ki);
function yp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e) {
    const s = a.group || "Other", o = t.get(s) ?? [];
    o.push(a), t.set(s, o);
  }
  const i = /* @__PURE__ */ new Map();
  t.has("Node") && i.set("Node", t.get("Node"));
  for (const [a, s] of t)
    a !== "Node" && i.set(a, s);
  return i;
}
function gp(e) {
  return e.backgroundGradient ? "gradient" : vp(e.background) ? "transparent" : "colour";
}
function vp(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function bp(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
function _p(e) {
  const t = $p(e);
  return { root: t[0] ?? "", tail: t.slice(1).join(".") };
}
function wp(e, t) {
  const i = (e ?? "").trim(), a = (t ?? "").trim();
  return i ? a ? `${i}.${a}` : i : "";
}
const $p = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0);
var xp = Object.defineProperty, kp = Object.getOwnPropertyDescriptor, yc = (e) => {
  throw TypeError(e);
}, ds = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && xp(t, i, s), s;
}, gc = (e, t, i) => t.has(e) || yc("Cannot " + i), et = (e, t, i) => (gc(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Tp = (e, t, i) => t.has(e) ? yc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ai = (e, t, i) => (gc(e, t, "access private method"), i), ie, ji, Mi, hs, vc, bc;
let pi = class extends z {
  constructor() {
    super(...arguments), Tp(this, ie), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
  }
  render() {
    return r`
      <div class="wrap">
        <button
          class="swatch"
          type="button"
          aria-label="${this.label}: ${this.value}"
          aria-expanded=${this._open}
          @click=${() => {
      this._open = !this._open;
    }}>
          <span class="chip" style="background:${et(this, ie, ji)};opacity:${et(this, ie, Mi)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Ai(this, ie, hs).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${et(this, ie, ji)}
                  @input=${(e) => Ai(this, ie, vc).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(et(this, ie, Mi))}
                    @input=${(e) => Ai(this, ie, bc).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(et(this, ie, Mi) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
ie = /* @__PURE__ */ new WeakSet();
ji = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
Mi = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
hs = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
vc = function(e) {
  const t = et(this, ie, Mi);
  Ai(this, ie, hs).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${_c(t)}`);
};
bc = function(e) {
  Ai(this, ie, hs).call(this, e >= 0.999 ? et(this, ie, ji).toUpperCase() : `${et(this, ie, ji).toUpperCase()}${_c(e)}`);
};
pi.styles = P`
    :host {
      display: block;
    }

    .wrap {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
    }

    .swatch {
      width: 28px;
      height: 28px;
      padding: 2px;
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      background:
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%),
        #fff;
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0;
      cursor: pointer;
      flex: 0 0 auto;
    }

    .chip {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 2px;
    }

    .popover {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      z-index: 10;
      display: grid;
      gap: var(--uui-size-space-2);
      padding: var(--uui-size-space-3);
      background: var(--uui-color-surface);
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-3);
    }

    .alpha {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      font-size: 12px;
    }

    .alpha-value {
      min-width: 36px;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
  `;
ds([
  g({ type: String })
], pi.prototype, "value", 2);
ds([
  g({ type: String })
], pi.prototype, "label", 2);
ds([
  f()
], pi.prototype, "_open", 2);
pi = ds([
  A("di-colour-input")
], pi);
const _c = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Sp = Object.defineProperty, Ep = Object.getOwnPropertyDescriptor, wc = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ep(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Sp(t, i, s), s;
};
const Kn = {
  topLeft: "Top left",
  topCentre: "Top centre",
  topRight: "Top right",
  middleLeft: "Middle left",
  middleCentre: "Middle centre",
  middleRight: "Middle right",
  bottomLeft: "Bottom left",
  bottomCentre: "Bottom centre",
  bottomRight: "Bottom right"
};
let Va = class extends z {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${V(
      jr,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Kn[e]}
              title=${Kn[e]}
              @click=${() => this.dispatchEvent(
        new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } })
      )}>
            </button>
          `
    )}
      </div>
    `;
  }
};
Va.styles = P`
    :host {
      display: inline-block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 20px);
      grid-template-rows: repeat(3, 20px);
      gap: 2px;
    }

    .cell {
      border: 1px solid var(--uui-color-border);
      border-radius: 2px;
      background: var(--uui-color-surface);
      cursor: pointer;
      padding: 0;
    }

    .cell:hover {
      border-color: var(--uui-color-focus);
    }

    .cell.active {
      background: var(--uui-color-focus);
      border-color: var(--uui-color-focus);
    }

    .cell:focus-visible {
      outline: 2px solid var(--uui-color-focus);
      outline-offset: 1px;
    }
  `;
wc([
  g({ type: String })
], Va.prototype, "value", 2);
Va = wc([
  A("di-anchor-picker")
], Va);
var Dp = Object.defineProperty, Cp = Object.getOwnPropertyDescriptor, $c = (e) => {
  throw TypeError(e);
}, ft = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Cp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Dp(t, i, s), s;
}, Ip = (e, t, i) => t.has(e) || $c("Cannot " + i), Op = (e, t, i) => t.has(e) ? $c("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pp = (e, t, i) => (Ip(e, t, "access private method"), i), ao, xc;
let Ae = class extends z {
  constructor() {
    super(...arguments), Op(this, ao), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
  }
  render() {
    return r`
      <label class="field">
        ${this.label ? r`<span class="label">${this.label}</span>` : p}
        <span class="input">
          <input
            type="number"
            aria-label=${this.label}
            .value=${this.value === null || this.value === void 0 ? "" : String(this.value)}
            placeholder=${this.placeholder}
            step=${this.step}
            min=${this.min ?? p}
            max=${this.max ?? p}
            @change=${Pp(this, ao, xc)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
ao = /* @__PURE__ */ new WeakSet();
xc = function(e) {
  const t = e.target, i = t.value, a = jh(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Ae.styles = P`
    :host {
      display: block;
    }

    .field {
      display: grid;
      gap: 2px;
    }

    .label {
      font-size: 11px;
      color: var(--uui-color-text-alt);
    }

    .input {
      display: flex;
      align-items: center;
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      background: var(--uui-color-surface);
    }

    input {
      flex: 1 1 auto;
      width: 100%;
      min-width: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      padding: 4px 6px;
      font-variant-numeric: tabular-nums;
    }

    input:focus {
      outline: none;
    }

    .input:focus-within {
      border-color: var(--uui-color-focus);
    }

    .suffix {
      padding-right: 6px;
      font-size: 11px;
      color: var(--uui-color-text-alt);
    }
  `;
ft([
  g({ type: Number })
], Ae.prototype, "value", 2);
ft([
  g({ type: String })
], Ae.prototype, "label", 2);
ft([
  g({ type: String })
], Ae.prototype, "suffix", 2);
ft([
  g({ type: Number })
], Ae.prototype, "step", 2);
ft([
  g({ type: Number })
], Ae.prototype, "min", 2);
ft([
  g({ type: Number })
], Ae.prototype, "max", 2);
ft([
  g({ type: String })
], Ae.prototype, "placeholder", 2);
Ae = ft([
  A("di-number-field")
], Ae);
var Ap = Object.defineProperty, Mp = Object.getOwnPropertyDescriptor, kc = (e) => {
  throw TypeError(e);
}, yi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ap(t, i, s), s;
}, Rp = (e, t, i) => t.has(e) || kc("Cannot " + i), Lp = (e, t, i) => t.has(e) ? kc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (Rp(e, t, "access private method"), i), u, b, ve, Tc, Sc, Ec, Vo, so, Dc, Cc, Ic, Oc, Pc, Ac, Mc, oo, Rc, Ea, Lc, zc, gi, no, qo, Fc;
const jn = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let ht = class extends z {
  constructor() {
    super(...arguments), Lp(this, u), this.properties = [], this.linkedProperties = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, u, Dc).call(this, this.layer) : h(this, u, Tc).call(this)}</div>` : p;
  }
};
u = /* @__PURE__ */ new WeakSet();
b = function(e) {
  this.layer && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: this.layer.key, patch: e }
    })
  );
};
ve = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Tc = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${y.width.min}
            .max=${y.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => h(this, u, ve).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${y.height.min}
            .max=${y.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => h(this, u, ve).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${h(this, u, Sc).call(this, e)}

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${Uc(e.baseImage.kind)}
              @change=${(t) => h(this, u, ve).call(this, {
    baseImage: { ...e.baseImage, kind: t.target.value }
  })}>
            </uui-select>
            <uui-button
              look="secondary"
              label="Choose a base image from the media library"
              @click=${() => this.dispatchEvent(new CustomEvent("di-pick-base-image", { bubbles: !0, composed: !0 }))}>
              Choose
            </uui-button>
          </div>
        </label>

        ${e.baseImage.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${e.baseImage.path ?? ""}
                placeholder="/assets/og-background.png"
                @change=${(t) => h(this, u, ve).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${h(this, u, gi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, u, ve).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${Q(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => h(this, u, ve).call(this, { baseImageFit: t.target.value })}>
          </uui-select>
        </label>

        <uui-button
          look="secondary"
          label="Set the canvas to the base image's own size"
          @click=${() => this.dispatchEvent(new CustomEvent("di-use-image-size", { bubbles: !0, composed: !0 }))}>
          Use image size
        </uui-button>
      </uui-box>

      <p class="hint">Select a layer to edit it, or drag a property from the left onto the canvas.</p>
    `;
};
Sc = function(e) {
  const t = gp(e);
  return r`
      <label class="field">
        <span>Fill</span>
        <uui-select
          .value=${t}
          .options=${Q(["colour", "gradient", "transparent"], t)}
          @change=${(i) => h(this, u, Ec).call(this, e, i.target.value)}>
        </uui-select>
      </label>

      ${t === "colour" ? r`<label class="field">
            <span>Colour</span>
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => h(this, u, ve).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </label>` : p}

      ${t === "gradient" && e.backgroundGradient ? h(this, u, Vo).call(this, e.backgroundGradient, (i) => h(this, u, ve).call(this, { backgroundGradient: i })) : p}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : p}
    `;
};
Ec = function(e, t) {
  if (t === "gradient") {
    h(this, u, ve).call(this, { backgroundGradient: e.backgroundGradient ?? Kr() });
    return;
  }
  h(this, u, ve).call(this, {
    background: bp(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
Vo = function(e, t) {
  return r`
      <label class="field">
        <span>Type</span>
        <uui-select
          .value=${e.kind}
          .options=${Q(["linear", "radial"], e.kind)}
          @change=${(i) => t({ ...e, kind: i.target.value })}>
        </uui-select>
      </label>

      <div class="pair">
        <di-colour-input
          label="From"
          .value=${e.from}
          @change=${(i) => t({ ...e, from: i.detail.value })}>
        </di-colour-input>
        <di-colour-input
          label="To"
          .value=${e.to}
          @change=${(i) => t({ ...e, to: i.detail.value })}>
        </di-colour-input>
      </div>

      ${e.kind === "radial" ? r`<div class="pair">
            ${h(this, u, so).call(this, "Centre X", e.centreX, (i) => t({ ...e, centreX: i }))}
            ${h(this, u, so).call(this, "Centre Y", e.centreY, (i) => t({ ...e, centreY: i }))}
          </div>` : r`<di-number-field
            .min=${y.gradientAngle.min}
            .max=${y.gradientAngle.max}
            label="Angle"
            suffix="°"
            .value=${e.angle}
            @change=${(i) => t({ ...e, angle: i.detail.value ?? 180 })}>
          </di-number-field>`}
    `;
};
so = function(e, t, i) {
  return r`<di-number-field
      .min=${y.gradientCentre.min * 100}
      .max=${y.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
Dc = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, u, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, u, Cc).call(this, e) : p}
      ${e.type === "text" ? h(this, u, Ic).call(this, e) : p}
      ${e.type === "image" ? h(this, u, Oc).call(this, e) : p}
      ${e.type === "badges" ? h(this, u, Pc).call(this, e) : p}
      ${e.type === "rect" ? h(this, u, Ac).call(this, e) : p}
      ${h(this, u, Mc).call(this, e)} ${h(this, u, zc).call(this, e)}
    `;
};
Cc = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${Q(
    ["property", "nodeName", "readingTime", "date", "static", "expression"],
    t.kind,
    {
      property: "A property",
      nodeName: "The page name",
      readingTime: "Reading time",
      date: "A date",
      static: "Fixed text",
      expression: "Expression"
    }
  )}
            @change=${(i) => h(this, u, b).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, gi).call(this, t.propertyAlias ?? "", (i) => h(this, u, b).call(this, { binding: { ...t, propertyAlias: i } }))}
            </label>` : p}

        ${t.kind === "date" ? r`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => h(this, u, b).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "static" || t.kind === "expression" ? r`<label class="field">
              <span>${t.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => h(this, u, b).call(this, {
    binding: { ...t, text: i.target.value }
  })}>
              </uui-textarea>
              ${t.kind === "expression" ? r`<small class="hint">
                    Tokens: <code>{name}</code>, <code>{readingTime}</code>, <code>{prop:alias}</code>,
                    <code>{date:alias:format}</code>
                  </small>` : p}
            </label>` : p}

        <div class="pair">
          <label class="field">
            <span>Prefix</span>
            <uui-input
              .value=${e.prefix ?? ""}
              @change=${(i) => h(this, u, b).call(this, { prefix: i.target.value })}>
            </uui-input>
          </label>
          <label class="field">
            <span>Suffix</span>
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => h(this, u, b).call(this, { suffix: i.target.value })}>
            </uui-input>
          </label>
        </div>
      </uui-box>
    `;
};
Ic = function(e) {
  const t = e.style, i = (a) => h(this, u, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, u, qo).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, u, Fc).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

        <div class="pair">
          <di-number-field
            .min=${y.fontSize.min}
            .max=${y.fontSize.max}
            label="Size"
            .value=${t.fontSize}
            @change=${(a) => i({ fontSize: a.detail.value ?? t.fontSize })}>
          </di-number-field>
          <label class="field">
            <span>Weight</span>
            <uui-select
              .value=${t.fontStyle}
              .options=${Q(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
              @change=${(a) => i({ fontStyle: a.target.value })}>
            </uui-select>
          </label>
        </div>

        <label class="field">
          <span>Colour</span>
          <di-colour-input
            label="Text colour"
            .value=${t.colour}
            @change=${(a) => i({ colour: a.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Align inside the box</span>
          <uui-select
            .value=${t.textAlign}
            .options=${Q(["left", "centre", "right"], t.textAlign)}
            @change=${(a) => i({ textAlign: a.target.value })}>
          </uui-select>
        </label>

        <div class="pair">
          <di-number-field
            .min=${y.lineSpacing.min}
            .max=${y.lineSpacing.max}
            label="Line spacing"
            suffix="×"
            step="0.05"
            .value=${t.lineSpacing}
            @change=${(a) => i({ lineSpacing: a.detail.value ?? 1 })}>
          </di-number-field>
          <di-number-field
            .min=${y.letterSpacing.min}
            .max=${y.letterSpacing.max}
            label="Letter spacing"
            .value=${t.letterSpacing}
            @change=${(a) => i({ letterSpacing: a.detail.value ?? 0 })}>
          </di-number-field>
        </div>

        <div class="pair">
          <di-number-field
            .min=${y.maxLines.min}
            .max=${y.maxLines.max}
            label="Max lines"
            suffix=""
            placeholder="No limit"
            .value=${t.maxLines ?? null}
            @change=${(a) => i({ maxLines: a.detail.value })}>
          </di-number-field>
          <label class="field">
            <span>When it overflows</span>
            <uui-select
              .value=${t.overflow}
              .options=${Q(["shrink", "ellipsis", "clip"], t.overflow, {
    shrink: "Shrink to fit",
    ellipsis: "Trim with …",
    clip: "Cut off"
  })}
              @change=${(a) => i({ overflow: a.target.value })}>
            </uui-select>
          </label>
        </div>

        <label class="field">
          <span>Transform</span>
          <uui-select
            .value=${t.textTransform}
            .options=${Q(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
Oc = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${Uc(t.kind)}
            @change=${(a) => h(this, u, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, gi).call(
    this,
    t.propertyAlias ?? "",
    (a) => h(this, u, b).call(this, { source: { ...t, propertyAlias: a } }),
    // The root widens from media to media + content, and the media filter moves to the
    // tail: that is exactly the author.mainImage case, and it never offers a text
    // property as an image source.
    { root: ["media", "content"], tail: "media" }
  )}
            </label>` : p}

        ${t.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => h(this, u, b).call(this, {
    source: { ...t, path: a.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "media" ? r`<uui-button
              look="secondary"
              label="Choose an image from the media library"
              @click=${() => this.dispatchEvent(
    new CustomEvent("di-pick-layer-image", { bubbles: !0, composed: !0, detail: { key: e.key } })
  )}>
              Choose image
            </uui-button>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.fit}
            .options=${Q(["cover", "contain", "stretch"], e.fit)}
            @change=${(a) => h(this, u, b).call(this, { fit: a.target.value })}>
          </uui-select>
        </label>

        <di-number-field
          .min=${y.cornerRadius.min}
          .max=${y.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => h(this, u, b).call(this, { cornerRadius: a.detail.value ?? 0 })}>
        </di-number-field>

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              .min=${y.borderWidth.min}
              .max=${y.borderWidth.max}
              label="Width"
              .value=${((i = e.border) == null ? void 0 : i.width) ?? 0}
              @change=${(a) => {
    var o;
    const s = a.detail.value ?? 0;
    h(this, u, b).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => h(this, u, b).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : p}
          </div>
        </label>
      </uui-box>
    `;
};
Pc = function(e) {
  const t = (s) => h(this, u, b).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, u, b).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, u, b).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, u, gi).call(this, e.itemsPropertyAlias, (s) => h(this, u, b).call(this, { itemsPropertyAlias: s }))}
        </label>

        <div class="pair">
          <di-number-field
            .min=${y.maxItems.min}
            .max=${y.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => h(this, u, b).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${y.gap.min}
            .max=${y.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => h(this, u, b).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${e.direction}
            .options=${Q(["horizontal", "vertical"], e.direction)}
            @change=${(s) => h(this, u, b).call(this, { direction: s.target.value })}>
          </uui-select>
        </label>

        ${e.direction === "horizontal" ? r`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => h(this, u, b).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </label>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${y.rowGap.min}
                      .max=${y.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => h(this, u, b).call(this, { rowGap: s.detail.value ?? 20 })}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  ` : p}
            ` : p}

        <div class="pair">
          <di-number-field
            .min=${y.circleSize.min}
            .max=${y.circleSize.max}
            label="Circle size"
            .value=${e.badge.size}
            @change=${(s) => t({ size: s.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
            .min=${y.iconSize.min}
            .max=${y.iconSize.max}
            label="Icon size"
            .value=${e.badge.innerSize}
            @change=${(s) => t({ innerSize: s.detail.value ?? 44 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Circle fill</span>
          <di-colour-input
            label="Circle fill"
            .value=${e.badge.fillColour}
            @change=${(s) => t({ fillColour: s.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Circle border</span>
          <div class="row">
            <di-colour-input
              label="Circle border colour"
              .value=${e.badge.borderColour}
              @change=${(s) => t({ borderColour: s.detail.value })}>
            </di-colour-input>
            <di-number-field
              .min=${y.borderWidth.min}
              .max=${y.borderWidth.max}
              label="Width"
              step="0.5"
              .value=${e.badge.borderWidth}
              @change=${(s) => t({ borderWidth: s.detail.value ?? 1.5 })}>
            </di-number-field>
          </div>
        </label>

        <label class="field">
          <span>Icon folder</span>
          <uui-input
            .value=${e.icon.basePath}
            placeholder="/assets/og-icons"
            @change=${(s) => a({ basePath: s.target.value })}>
          </uui-input>
          <small class="hint">Icons are matched by slugifying the item's name, with default.png as a fallback.</small>
        </label>

        <label class="field">
          <span>Label position</span>
          <uui-select
            .value=${e.label.position}
            .options=${Q(["below", "right", "none"], e.label.position, {
    below: "Below the icon",
    right: "Beside the icon",
    none: "Icon only"
  })}
            @change=${(s) => i({ position: s.target.value })}>
          </uui-select>
          ${e.label.position === "right" ? r`<small class="hint">Each badge is as wide as its own label.</small>` : p}
        </label>

        ${e.label.position === "none" ? p : r`
              <label class="field">
                <span>Label font</span>
                <uui-select
                  .value=${e.label.fontKey}
                  .options=${h(this, u, qo).call(this, e.label.fontKey)}
                  @change=${(s) => i({ fontKey: s.target.value })}>
                </uui-select>
              </label>

              <div class="pair">
                <di-number-field
                  .min=${y.labelSize.min}
                  .max=${y.labelSize.max}
                  label="Label size"
                  .value=${e.label.fontSize}
                  @change=${(s) => i({ fontSize: s.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
                  .min=${y.labelGap.min}
                  .max=${y.labelGap.max}
                  label="Label gap"
                  .value=${e.label.gap}
                  @change=${(s) => i({ gap: s.detail.value ?? 10 })}>
                </di-number-field>
              </div>

              <label class="field">
                <span>Label colour</span>
                <di-colour-input
                  label="Label colour"
                  .value=${e.label.colour}
                  @change=${(s) => i({ colour: s.detail.value })}>
                </di-colour-input>
              </label>

              <label class="field">
                <span>Label transform</span>
                <uui-select
                  .value=${e.label.textTransform}
                  .options=${Q(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
Ac = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${Q(["rectangle", "ellipse", "polygon", "star"], t)}
            @change=${(s) => h(this, u, b).call(this, { shape: s.target.value })}>
          </uui-select>
        </label>

        ${t === "polygon" || t === "star" ? r`
              <div class="pair">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  .min=${y.sides.min}
                  .max=${y.sides.max}
                  .value=${e.sides ?? 5}
                  @change=${(s) => h(this, u, b).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${y.innerRatio.min}
                      .max=${y.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => h(this, u, b).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : p}
              </div>
            ` : p}

        <label class="field inline">
          <span>Fill</span>
          <uui-toggle
            ?checked=${i}
            @change=${(s) => h(this, u, b).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </label>

        ${i ? r`<label class="field">
              <span>Fill colour</span>
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => h(this, u, b).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </label>` : p}

        <label class="field inline">
          <span>Gradient</span>
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => h(this, u, b).call(this, {
    gradient: s.target.checked ? Kr() : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? h(this, u, Vo).call(this, e.gradient, (s) => h(this, u, b).call(this, { gradient: s })) : p}

        ${t === "rectangle" ? r`<di-number-field
            .min=${y.cornerRadius.min}
            .max=${y.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => h(this, u, b).call(this, { cornerRadius: s.detail.value ?? 0 })}>
            </di-number-field>` : p}

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              .min=${y.borderWidth.min}
              .max=${y.borderWidth.max}
              label="Width"
              .value=${((a = e.border) == null ? void 0 : a.width) ?? 0}
              @change=${(s) => {
    var n;
    const o = s.detail.value ?? 0;
    h(this, u, b).call(this, {
      border: o > 0 ? { width: o, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => h(this, u, b).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : p}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </label>
      </uui-box>
    `;
};
Mc = function(e) {
  const t = Pe(e.position, "x"), i = Pe(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, u, oo).call(this, e, "x")} ${h(this, u, oo).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, u, Lc).call(this, e, s.detail.value)}>
          </di-anchor-picker>
          <small class="hint">
            Where X and Y sit on the layer's box.
            ${t || i ? r`The ${t && i ? "horizontal and vertical" : t ? "horizontal" : "vertical"}
                  ${t && i ? "components are" : "component is"} set by the edge
                  ${t && i ? "each axis tracks" : "that axis tracks"}.` : p}
            ${a !== 0 ? r`The layer turns around this point.` : p}
          </small>
        </label>

        <div class="field">
          <di-number-field
            label="Rotation"
            suffix="°"
            step="1"
            placeholder="0"
            .value=${a}
            @change=${(s) => h(this, u, b).call(this, { rotation: Vr(s.detail.value ?? 0) })}>
          </di-number-field>
          <small class="hint">Clockwise, around the anchor point. Drag the handle above the selection on the canvas; hold Shift for 15° steps.</small>
        </div>

        <div class="pair">
          <di-number-field
            .min=${y.width.min}
            .max=${y.width.max}
            label="Width"
            placeholder="Auto"
            .value=${e.size.width ?? null}
            @change=${(s) => h(this, u, b).call(this, { size: { ...e.size, width: s.detail.value } })}>
          </di-number-field>
          <di-number-field
            .min=${y.height.min}
            .max=${y.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => h(this, u, b).call(this, { size: { ...e.size, height: s.detail.value } })}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
oo = function(e, t) {
  const i = Pe(e.position, t), a = Ra(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
  return r`
      <div class="axis">
        <label class="field">
          <span>${t === "x" ? "Horizontal position" : "Vertical position"}</span>
          <uui-select
            .value=${i ? "relative" : "absolute"}
            .options=${[
    { name: "Absolute", value: "absolute", selected: !i },
    { name: "Relative to a layer", value: "relative", selected: i }
  ]}
            @change=${(n) => h(this, u, Rc).call(this, e, t, n.target.value)}>
          </uui-select>
          ${!i && s.length === 0 ? r`<small class="hint">Add another layer to position this one against it.</small>` : p}
        </label>

        ${i && a ? r`
              <label class="field">
                <span>Tracks</span>
                <div class="row">
                  <uui-select
                    .value=${a.layerKey}
                    .options=${s.map((n) => ({
    name: n.name || n.type,
    value: n.key,
    selected: n.key === a.layerKey
  }))}
                    @change=${(n) => h(this, u, Ea).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${Q(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => h(this, u, Ea).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${y.referenceGap.min}
                .max=${y.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => h(this, u, Ea).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? y.x.min : y.y.min}
                .max=${t === "x" ? y.x.max : y.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => h(this, u, b).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
Rc = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Pe(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && h(this, u, b).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: wd
      }
    }
  });
};
Ea = function(e, t, i) {
  const a = Ra(e.position, t);
  a && h(this, u, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Lc = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? vd(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, u, b).call(this, { position: s });
};
zc = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <label class="field inline">
          <span>Visible</span>
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => h(this, u, b).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </label>

        <label class="field inline">
          <span>Locked</span>
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => h(this, u, b).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </label>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${y.opacity.min}
          .max=${y.opacity.max}
          .value=${e.opacity}
          @change=${(t) => h(this, u, b).call(this, { opacity: t.detail.value ?? 1 })}>
        </di-number-field>

        <label class="field">
          <span>Show this layer</span>
          <uui-select
            .value=${e.visibility.rule}
            .options=${Q(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
    always: "Always",
    whenNotEmpty: "When it has a value",
    whenPropertyTruthy: "When another property is set"
  })}
            @change=${(t) => h(this, u, b).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </label>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<label class="field">
              <span>Controlled by</span>
              ${h(this, u, gi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, u, b).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
gi = function(e, t, i = {}) {
  const { root: a, tail: s } = _p(e), o = this.linkedProperties[a] ?? [], n = this.properties.some(
    (m) => m.alias === a && m.classification === "content"
  ), l = !!a && (n || !!s), d = h(this, u, no).call(this, jn(this.properties, i.root), a, (m) => t(m));
  return l ? r`
      <div class="path">
        ${d}
        <span class="path-hop" aria-hidden="true">›</span>
        ${h(this, u, no).call(this, jn(o, i.tail), s, (m) => t(wp(a, m)))}
      </div>
    ` : d;
};
no = function(e, t, i) {
  const a = [
    { name: "- none -", value: "" },
    ...e.map((s) => ({
      name: `${s.name} (${s.alias})`,
      value: s.alias,
      selected: s.alias === t
    }))
  ];
  return t && !e.some((s) => s.alias === t) && a.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), r`
      <uui-select
        .value=${t}
        .options=${a}
        @change=${(s) => i(s.target.value)}>
      </uui-select>
    `;
};
qo = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
Fc = function(e, t, i) {
  const a = this.fonts.find((s) => s.key === e);
  return !a || a.styles.length === 0 ? p : r`
      <label class="field">
        <span>Named style</span>
        <uui-select
          .value=${t}
          .options=${[
    { name: "- custom -", value: "" },
    ...a.styles.map((s) => ({
      name: `${s.name} (${s.size}px)`,
      value: s.name,
      selected: s.name === t
    }))
  ]}
          @change=${(s) => {
    const o = s.target.value, n = a.styles.find((l) => l.name === o);
    i(o, n == null ? void 0 : n.size, n == null ? void 0 : n.fontStyle);
  }}>
        </uui-select>
      </label>
    `;
};
ht.styles = P`
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

    .path {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: var(--uui-size-space-1);
    }

    .path-hop {
      color: var(--uui-color-text-alt);
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
yi([
  g({ type: Object })
], ht.prototype, "template", 2);
yi([
  g({ type: Object })
], ht.prototype, "layer", 2);
yi([
  g({ type: Array })
], ht.prototype, "properties", 2);
yi([
  g({ type: Object })
], ht.prototype, "linkedProperties", 2);
yi([
  g({ type: Array })
], ht.prototype, "fonts", 2);
ht = yi([
  A("di-layer-inspector")
], ht);
function Q(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function Uc(e) {
  return Q(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var zp = Object.defineProperty, Fp = Object.getOwnPropertyDescriptor, Wc = (e) => {
  throw TypeError(e);
}, la = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && zp(t, i, s), s;
}, Up = (e, t, i) => t.has(e) || Wc("Cannot " + i), Wp = (e, t, i) => t.has(e) ? Wc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ee = (e, t, i) => (Up(e, t, "access private method"), i), me, $t, Nc, Bc, Kc, jc;
const Np = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let zt = class extends z {
  constructor() {
    super(...arguments), Wp(this, me), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Ee(this, me, Kc)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : V(
      e,
      (t) => t.key,
      (t, i) => Ee(this, me, jc).call(this, t, i)
    )}

        <div class="row background">
          <uui-icon name="icon-picture"></uui-icon>
          <span class="name">Background</span>
          <uui-icon name="icon-lock" title="The base image and canvas fill are edited in the inspector"></uui-icon>
        </div>
      </div>
    `;
  }
};
me = /* @__PURE__ */ new WeakSet();
$t = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Nc = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Bc = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Kc = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Ee(this, me, $t).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
jc = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Ee(this, me, Nc).call(this, a, e.key)}
        @dragover=${(a) => Ee(this, me, Bc).call(this, a, t)}
        @click=${() => Ee(this, me, $t).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Np[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ee(this, me, $t).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ee(this, me, $t).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ee(this, me, $t).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ee(this, me, $t).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
zt.styles = P`
    /* max-height: 40% resolved against the grid row the panel had already been given, so 60%
       of that row was guaranteed waste - 92px of panel in a 228.8px row, with the list clipped
       mid-row and grey space beneath it. The cap is now against the viewport instead, and the
       scroll moved to .panel so the host can size to its content the way the side column's
       auto row intends. This is also what was clipping the empty-state sentence on a new
       template. */
    :host {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
      min-height: 0;
      max-height: min(50vh, 100%);
    }

    .panel {
      padding: var(--uui-size-space-3);
      min-height: 0;
      overflow: auto;
    }

    h5 {
      margin: 0 0 var(--uui-size-space-2);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--uui-color-text-alt);
    }

    .row {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-1);
      padding: var(--uui-size-space-1) var(--uui-size-space-2);
      border-radius: var(--uui-border-radius);
      cursor: pointer;
      font-size: 13px;
    }

    .row:hover {
      background: var(--uui-color-surface-alt);
    }

    .row.selected {
      background: var(--uui-color-selected);
      color: var(--uui-color-selected-contrast, inherit);
    }

    .row.drop {
      box-shadow: inset 0 2px 0 var(--uui-color-focus);
    }

    .row.background {
      opacity: 0.6;
      cursor: default;
    }

    /* The hidden state has no icon of its own to show, so it is carried by the look plus a
       dimmed glyph - the same visual language as the toolbar's toggles. */
    .visibility.off uui-icon {
      opacity: 0.45;
    }

    .name {
      flex: 1 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .empty {
      margin: 0;
      font-size: 13px;
      color: var(--uui-color-text-alt);
    }
  `;
la([
  g({ type: Array })
], zt.prototype, "layers", 2);
la([
  g({ type: String })
], zt.prototype, "selectedLayerKey", 2);
la([
  f()
], zt.prototype, "_dragKey", 2);
la([
  f()
], zt.prototype, "_dropIndex", 2);
zt = la([
  A("di-layers-panel")
], zt);
var Bp = Object.defineProperty, Kp = Object.getOwnPropertyDescriptor, Vc = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Kp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Bp(t, i, s), s;
}, Go = (e, t, i) => t.has(e) || Vc("Cannot " + i), jp = (e, t, i) => (Go(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Vn = (e, t, i) => t.has(e) ? Vc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Vp = (e, t, i, a) => (Go(e, t, "write to private field"), t.set(e, i), i), se = (e, t, i) => (Go(e, t, "access private method"), i), Y, ze, qa, qc, Gc, Ci;
let ke = class extends z {
  constructor() {
    super(...arguments), Vn(this, Y), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Vn(this, qa, 100);
  }
  /**
   * The zoom buttons carry the registry's matched `icon-zoom-out` / `icon-zoom-in` magnifier pair.
   * Zoom out used to carry the registry's *remove* icon, which in Umbraco 17 resolves to
   * lucide-trash-2 - a wastebasket - so the control read as [bin] 27% [+] and the minus looked
   * missing entirely. `zoom-controls.browser.test.ts` asserts what actually renders here, since a
   * name that exists but draws the wrong picture is invisible to `icon-contract.test.ts`.
   *
   * Neither old name is spelled out anywhere in this file on purpose: the bundle under wwwroot is
   * committed unminified, comments and all, so grepping the built output for a bad icon name is a
   * real check and a comment quoting one would defeat it.
   */
  render() {
    return r`
      <div class="toolbar" @focusout=${() => this.requestUpdate()}>
        <div class="zoom">
          <!-- Stepping multiplies the *effective* scale, so stepping up out of Fit lands one
               step above what is on screen rather than jumping to 125%. -->
          <uui-button
            compact
            look="secondary"
            label="Zoom out"
            @click=${() => se(this, Y, ze).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${Ka.min * 100}
            .max=${Ka.max * 100}
            .value=${se(this, Y, qc).call(this)}
            @change=${se(this, Y, Gc)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => se(this, Y, ze).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => se(this, Y, ze).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${se(this, Y, Ci).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${se(this, Y, Ci).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${se(this, Y, Ci).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${se(this, Y, Ci).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => se(this, Y, ze).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => se(this, Y, ze).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => se(this, Y, ze).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
Y = /* @__PURE__ */ new WeakSet();
ze = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
qa = /* @__PURE__ */ new WeakMap();
qc = function() {
  return this.matches(":focus-within") || Vp(this, qa, Math.round(this.effectiveScale * 100)), jp(this, qa);
};
Gc = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && se(this, Y, ze).call(this, "di-zoom-change", { zoom: t / 100 });
};
Ci = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => se(this, Y, ze).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
ke.styles = P`
    :host {
      display: block;
      border-bottom: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-4);
      padding: var(--uui-size-space-2) var(--uui-size-space-3);
      flex-wrap: wrap;
    }

    .zoom,
    .toggles,
    .actions {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-1);
    }

    .actions {
      margin-left: auto;
    }

    /* A fixed narrow width, so the toolbar row does not shuffle sideways as the readout goes
       from 27 to 100 to 400. This is what the old span's min-width was for. */
    .value {
      width: 72px;
      font-size: 12px;
    }
  `;
He([
  g({ type: Number })
], ke.prototype, "effectiveScale", 2);
He([
  g({ type: Boolean })
], ke.prototype, "snapEnabled", 2);
He([
  g({ type: Boolean })
], ke.prototype, "showRulers", 2);
He([
  g({ type: Boolean })
], ke.prototype, "showSafeArea", 2);
He([
  g({ type: Boolean })
], ke.prototype, "showMeasured", 2);
He([
  g({ type: Boolean })
], ke.prototype, "canUndo", 2);
He([
  g({ type: Boolean })
], ke.prototype, "canRedo", 2);
He([
  g({ type: Boolean })
], ke.prototype, "previewing", 2);
ke = He([
  A("di-canvas-toolbar")
], ke);
var qp = Object.defineProperty, Gp = Object.getOwnPropertyDescriptor, Hc = (e) => {
  throw TypeError(e);
}, ca = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && qp(t, i, s), s;
}, Ho = (e, t, i) => t.has(e) || Hc("Cannot " + i), Z = (e, t, i) => (Ho(e, t, "read from private field"), t.get(e)), yt = (e, t, i) => t.has(e) ? Hc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pt = (e, t, i, a) => (Ho(e, t, "write to private field"), t.set(e, i), i), We = (e, t, i) => (Ho(e, t, "access private method"), i), tt, Gt, Ht, At, Ga, Ha, be, Yo, Da, Xo, ro;
const Hp = 400;
let Ft = class extends z {
  constructor() {
    super(), yt(this, be), yt(this, tt), yt(this, Gt), yt(this, Ht), yt(this, At), yt(this, Ga), yt(this, Ha, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(Wt, (e) => {
      Pt(this, tt, e), e && (this.observe(e.template, (t) => {
        t && We(this, be, Da).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Pt(this, Ga, t);
        const i = (a = Z(this, tt)) == null ? void 0 : a.getData();
        i && We(this, be, Da).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Pt(this, Ha, t ?? !0);
      }));
    });
  }
  /**
   * Render now, bypassing the debounce, and open the strip if it was collapsed. This is what the
   * toolbar's "Server preview" button does - the button emitted `di-request-preview` and nothing
   * listened for it, so it had never done anything at all.
   */
  refresh() {
    var t;
    const e = (t = Z(this, tt)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(Z(this, Gt)), this._collapsed = !1, We(this, be, Xo).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(Z(this, Gt)), (e = Z(this, Ht)) == null || e.abort(), We(this, be, Yo).call(this);
  }
  render() {
    return r`
      <div class="strip">
        <button
          class="toggle"
          type="button"
          aria-expanded=${!this._collapsed}
          @click=${() => {
      var e;
      if (this._collapsed = !this._collapsed, !this._collapsed) {
        const t = (e = Z(this, tt)) == null ? void 0 : e.getData();
        t && We(this, be, Da).call(this, t);
      }
    }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed ? p : r`
              <div class="body">
                ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
                ${this._error ? r`<span class="error" role="status">${this._error}</span>` : this._url ? r`<img src=${this._url} alt="Server-rendered preview of this template" />` : r`<span class="pending">Rendering…</span>`}
              </div>
            `}
      </div>
    `;
  }
};
tt = /* @__PURE__ */ new WeakMap();
Gt = /* @__PURE__ */ new WeakMap();
Ht = /* @__PURE__ */ new WeakMap();
At = /* @__PURE__ */ new WeakMap();
Ga = /* @__PURE__ */ new WeakMap();
Ha = /* @__PURE__ */ new WeakMap();
be = /* @__PURE__ */ new WeakSet();
Yo = function() {
  Z(this, At) && (URL.revokeObjectURL(Z(this, At)), Pt(this, At, void 0));
};
Da = function(e) {
  this._collapsed || (window.clearTimeout(Z(this, Gt)), Pt(this, Gt, window.setTimeout(() => void We(this, be, Xo).call(this, e), Hp)));
};
Xo = async function(e) {
  var t;
  if (Z(this, tt)) {
    (t = Z(this, Ht)) == null || t.abort(), Pt(this, Ht, new AbortController()), We(this, be, ro).call(this, !0), this._error = void 0;
    try {
      const i = await vo(
        e,
        {
          signal: Z(this, Ht).signal,
          contentKey: Z(this, Ga),
          useSampleData: Z(this, Ha)
        },
        Z(this, tt).getToken
      );
      We(this, be, Yo).call(this), Pt(this, At, URL.createObjectURL(i)), this._url = Z(this, At);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      We(this, be, ro).call(this, !1);
    }
  }
};
ro = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Ft.styles = P`
    :host {
      display: block;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .strip {
      padding: var(--uui-size-space-2) var(--uui-size-space-3);
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-1);
      border: 0;
      background: none;
      color: var(--uui-color-text-alt);
      font: inherit;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      cursor: pointer;
      padding: 0;
    }

    /* Both sizes are custom properties so the design view can collapse the strip's reserved
       space on a short window - the shadow boundary means it cannot reach these rules directly.
       See the (max-height: 720px) block in di-design-view. */
    .body {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3);
      margin-top: var(--uui-size-space-2);
      min-height: var(--di-preview-strip-body-min-height, 84px);
    }

    img {
      max-height: var(--di-preview-strip-image-max-height, 120px);
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-2);
      /* Behind the image, so a transparent render reads as transparent rather than as white. */
      ${Mo}
    }

    @media (prefers-reduced-motion: no-preference) {
      img {
        animation: fade 160ms ease-out;
      }
    }

    @keyframes fade {
      from {
        opacity: 0;
      }
    }

    .error {
      color: var(--uui-color-danger);
      font-size: 12px;
    }

    .pending {
      color: var(--uui-color-text-alt);
      font-size: 12px;
    }
  `;
ca([
  f()
], Ft.prototype, "_url", 2);
ca([
  f()
], Ft.prototype, "_loading", 2);
ca([
  f()
], Ft.prototype, "_error", 2);
ca([
  f()
], Ft.prototype, "_collapsed", 2);
Ft = ca([
  A("di-preview-strip")
], Ft);
var Yp = Object.defineProperty, Xp = Object.getOwnPropertyDescriptor, Yc = (e) => {
  throw TypeError(e);
}, G = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Xp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Yp(t, i, s), s;
}, Jo = (e, t, i) => t.has(e) || Yc("Cannot " + i), v = (e, t, i) => (Jo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), gt = (e, t, i) => t.has(e) ? Yc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ri = (e, t, i, a) => (Jo(e, t, "write to private field"), t.set(e, i), i), te = (e, t, i) => (Jo(e, t, "access private method"), i), k, Vi, qi, Gi, Yt, L, lo, Zo, Xc, Jc, co, Zc, Qc, eu, uo, tu, iu, au, su, Qo, ou, Ca;
const Jp = 400;
let F = class extends z {
  constructor() {
    super(), gt(this, L), gt(this, k), gt(this, Vi), gt(this, qi), gt(this, Gi), gt(this, Yt), this._properties = [], this._linkedProperties = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, gt(this, Ca, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = v(this, k);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = v(this, L, lo);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), te(this, L, co).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, d = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, m = Pe(s.position, "x") ? 0 : l, S = Pe(s.position, "y") ? 0 : d;
            if (m === 0 && S === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + m, y: s.position.y + S }
            });
            break;
          }
          case "[":
          case "]": {
            const n = ((o = this._template) == null ? void 0 : o.layers.findIndex((l) => l.key === s.key)) ?? -1;
            if (n < 0) return;
            e.preventDefault(), i.moveLayer(s.key, e.key === "]" ? n + 1 : n - 1);
            break;
          }
        }
      }
    }), this.consumeContext(es, (e) => {
      Ri(this, Vi, e);
    }), this.consumeContext(pe, (e) => {
      Ri(this, qi, e);
    }), this.consumeContext(Wt, (e) => {
      Ri(this, k, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (te(this, L, Zc).call(this, t), te(this, L, Qc).call(this, t), te(this, L, eu).call(this));
      }), this.observe(e.selectedLayerKey, (t) => {
        this._selectedKey = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }), this.observe(e.linkedProperties, (t) => {
        this._linkedProperties = t ?? {};
      }), this.observe(e.fonts, (t) => {
        this._fonts = t ?? [];
      }), this.observe(e.serverBounds, (t) => {
        this._serverBounds = t ?? [];
      }), this.observe(e.canUndo, (t) => {
        this._canUndo = t ?? !1;
      }), this.observe(e.canRedo, (t) => {
        this._canRedo = t ?? !1;
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", v(this, Ca));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", v(this, Ca)), window.clearTimeout(v(this, Gi)), (e = v(this, Yt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => te(this, L, co).call(this, e.detail.key)}
        @di-layer-detach=${(e) => te(this, L, Jc).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = v(this, k)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = v(this, k)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => te(this, L, uo).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => te(this, L, uo).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-pick-base-image=${te(this, L, au)}
        @di-pick-layer-image=${(e) => te(this, L, su).call(this, e.detail.key)}
        @di-use-image-size=${te(this, L, ou)}
        @di-request-preview=${() => {
      var e;
      return (e = v(this, L, Xc)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(Ka.min, Math.min(Ka.max, e.detail.zoom));
    }}
        @di-zoom-fit=${() => {
      this._zoom = void 0;
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
        @di-undo=${() => {
      var e;
      return (e = v(this, k)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = v(this, k)) == null ? void 0 : e.redo();
    }}>
        <di-property-palette class="palette" .properties=${this._properties}></di-property-palette>

        <div class="centre">
          <di-canvas-toolbar
            .effectiveScale=${this._effectiveScale}
            .snapEnabled=${this._snapEnabled}
            .showRulers=${this._showRulers}
            .showSafeArea=${this._showSafeArea}
            .showMeasured=${this._showMeasured}
            .canUndo=${this._canUndo}
            .canRedo=${this._canRedo}
            .previewing=${this._previewing}>
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
            .layer=${v(this, L, lo)}
            .properties=${this._properties}
            .linkedProperties=${this._linkedProperties}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    ` : r`<div class="state"><uui-loader></uui-loader></div>`;
  }
};
k = /* @__PURE__ */ new WeakMap();
Vi = /* @__PURE__ */ new WeakMap();
qi = /* @__PURE__ */ new WeakMap();
Gi = /* @__PURE__ */ new WeakMap();
Yt = /* @__PURE__ */ new WeakMap();
L = /* @__PURE__ */ new WeakSet();
lo = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
Zo = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Xc = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Jc = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = v(this, L, Zo)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = v(this, k)) == null || n.updateLayer(e, { position: As(i.position, t, a) });
};
co = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = v(this, L, Zo)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = v(this, k)) == null || s.removeLayer(e, t);
};
Zc = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && v(this, k) && await _l(t, v(this, k).getToken);
};
Qc = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !v(this, k)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await _o(t.mediaKey, v(this, k).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
eu = function() {
  window.clearTimeout(v(this, Gi)), Ri(this, Gi, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !v(this, k))) {
      (t = v(this, Yt)) == null || t.abort(), Ri(this, Yt, new AbortController());
      try {
        const i = await bo(
          e,
          { signal: v(this, Yt).signal, useSampleData: !0 },
          v(this, k).getToken
        );
        v(this, k).setServerBounds(i.layers), v(this, k).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, Jp));
};
uo = function(e, t, i, a) {
  const s = this._template;
  if (!s || !v(this, k)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: te(this, L, iu).call(this) };
  if (e.kind === "property") {
    const l = fd(e.property, o);
    if (l.kind === "condition") {
      te(this, L, tu).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    v(this, k).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? Nr(o, "Image") : e.layerType === "badges" ? Br(o, "Badges", "") : e.layerType === "rect" ? pd(o, "Shape", e.shape) : Wr(o, "Text", { kind: "static", text: "Text" });
  v(this, k).addLayer(n);
};
tu = function(e, t, i) {
  var o, n, l, d;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((m) => m.key === a);
  if (!s) {
    (n = v(this, qi)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = v(this, k)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (d = v(this, qi)) == null || d.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
iu = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
au = async function() {
  var t;
  const e = await te(this, L, Qo).call(this);
  e && ((t = v(this, k)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
su = async function(e) {
  var i;
  const t = await te(this, L, Qo).call(this);
  t && ((i = v(this, k)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
Qo = async function() {
  if (!v(this, Vi)) return;
  const e = v(this, Vi).open(this, ir, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
ou = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !v(this, k)) return;
  const t = await _o(e.mediaKey, v(this, k).getToken).catch(() => {
  });
  t && v(this, k).updateCanvas({ width: t.width, height: t.height });
};
Ca = /* @__PURE__ */ new WeakMap();
F.styles = P`
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

    /* The canvas row has a floor. It used to be the only flexible row in the column, so it
       absorbed every shortfall: at a 1150x666 viewport the toolbar (91px) and preview strip
       (160px) left it 141px of column and it measured 650x0 - no stage at all, and no scrollbar
       to reveal one. With a floor the column scrolls instead, which is a far better failure mode
       than a crushed stage. */
    .centre {
      display: grid;
      grid-template-rows: auto minmax(240px, 1fr) auto;
      min-width: 0;
      min-height: 0;
      overflow: auto;
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
        /* The canvas row is guaranteed its share before the side block takes any. */
        grid-template-rows: minmax(320px, 1fr) auto;
      }

      .side {
        grid-column: 1 / -1;
        grid-template-rows: auto auto;
        max-height: 40vh;
        overflow: auto;
      }
    }

    /* On a short window the preview strip's reserved space is what the canvas is short of, so
       give it back automatically rather than making the editor collapse the strip by hand -
       which the review measured as recovering the canvas to only 17px anyway. */
    @media (max-height: 720px) {
      di-preview-strip {
        --di-preview-strip-body-min-height: 0px;
        --di-preview-strip-image-max-height: 72px;
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
G([
  f()
], F.prototype, "_template", 2);
G([
  f()
], F.prototype, "_selectedKey", 2);
G([
  f()
], F.prototype, "_properties", 2);
G([
  f()
], F.prototype, "_linkedProperties", 2);
G([
  f()
], F.prototype, "_fonts", 2);
G([
  f()
], F.prototype, "_serverBounds", 2);
G([
  f()
], F.prototype, "_baseImageUrl", 2);
G([
  f()
], F.prototype, "_zoom", 2);
G([
  f()
], F.prototype, "_effectiveScale", 2);
G([
  f()
], F.prototype, "_previewing", 2);
G([
  f()
], F.prototype, "_snapEnabled", 2);
G([
  f()
], F.prototype, "_showRulers", 2);
G([
  f()
], F.prototype, "_showSafeArea", 2);
G([
  f()
], F.prototype, "_showMeasured", 2);
G([
  f()
], F.prototype, "_canUndo", 2);
G([
  f()
], F.prototype, "_canRedo", 2);
F = G([
  A("di-design-view")
], F);
const Zp = F, Qp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return F;
  },
  default: Zp
}, Symbol.toStringTag, { value: "Module" }));
var em = Object.defineProperty, tm = Object.getOwnPropertyDescriptor, nu = (e) => {
  throw TypeError(e);
}, Ye = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? tm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && em(t, i, s), s;
}, en = (e, t, i) => t.has(e) || nu("Cannot " + i), W = (e, t, i) => (en(e, t, "read from private field"), t.get(e)), Nt = (e, t, i) => t.has(e) ? nu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Xt = (e, t, i, a) => (en(e, t, "write to private field"), t.set(e, i), i), J = (e, t, i) => (en(e, t, "access private method"), i), fe, Hi, Yi, Jt, Mt, B, ru, Ya, lu, cu, tn, uu, Xi, du, hu, pu;
let de = class extends z {
  constructor() {
    super(), Nt(this, B), Nt(this, fe), Nt(this, Hi), Nt(this, Yi), Nt(this, Jt), Nt(this, Mt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(es, (e) => {
      Xt(this, Hi, e);
    }), this.consumeContext(pe, (e) => {
      Xt(this, Yi, e);
    }), this.consumeContext(Wt, (e) => {
      Xt(this, fe, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && J(this, B, ru).call(this);
      });
    });
  }
  connectedCallback() {
    super.connectedCallback(), J(this, B, Xi).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = W(this, Jt)) == null || e.abort(), J(this, B, tn).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${J(this, B, uu)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => J(this, B, Xi).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${J(this, B, hu)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
          ${this._error ? r`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? r`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : p}

          <p class="hint">
            Choose a content item above to preview this template against a real title and image.
          </p>
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._template.layers.length === 0 ? r`<p class="empty">This template has no layers yet.</p>` : r`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${V(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => J(this, B, pu).call(this, e)
    )}
              </uui-table>`}
        </uui-box>

        ${this._sampleNode ? r`<uui-box headline="This node">
              <p>
                Regenerating writes a new image into
                <code>${this._template.targetPropertyAlias || "the target property"}</code> on
                <strong>${this._sampleNode.name}</strong>, replacing the existing media file in place.
              </p>
              <uui-button
                look="primary"
                color="positive"
                label="Regenerate the image for ${this._sampleNode.name}"
                ?disabled=${this._regenerating}
                @click=${J(this, B, du)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
fe = /* @__PURE__ */ new WeakMap();
Hi = /* @__PURE__ */ new WeakMap();
Yi = /* @__PURE__ */ new WeakMap();
Jt = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
B = /* @__PURE__ */ new WeakSet();
ru = async function() {
  var t;
  const e = J(this, B, lu).call(this);
  e && (this._sampleNode = e, (t = W(this, fe)) == null || t.setSampleContentKey(e.key), await J(this, B, Xi).call(this));
};
Ya = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
lu = function() {
  try {
    const e = localStorage.getItem(J(this, B, Ya).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
cu = function(e) {
  try {
    e ? localStorage.setItem(J(this, B, Ya).call(this), JSON.stringify(e)) : localStorage.removeItem(J(this, B, Ya).call(this));
  } catch {
  }
};
tn = function() {
  W(this, Mt) && (URL.revokeObjectURL(W(this, Mt)), Xt(this, Mt, void 0));
};
uu = async function() {
  var i, a, s;
  if (!W(this, Hi) || !this._template) return;
  const e = W(this, Hi).open(this, ch, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, J(this, B, cu).call(this, t.item), (s = W(this, fe)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await J(this, B, Xi).call(this));
};
Xi = async function() {
  var i, a;
  const e = this._template;
  if (!e || !W(this, fe)) return;
  (i = W(this, Jt)) == null || i.abort(), Xt(this, Jt, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: W(this, Jt).signal,
    contentKey: (a = this._sampleNode) == null ? void 0 : a.key,
    useSampleData: !this._sampleNode,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [s, o] = await Promise.all([
      vo(e, t, W(this, fe).getToken),
      bo(e, t, W(this, fe).getToken)
    ]);
    J(this, B, tn).call(this), Xt(this, Mt, URL.createObjectURL(s)), this._url = W(this, Mt), this._bounds = o.layers, this._skipped = o.skipped ?? [], W(this, fe).setServerBounds(o.layers), W(this, fe).setIssues(o.issues);
  } catch (s) {
    if ((s == null ? void 0 : s.name) === "AbortError") return;
    this._error = s instanceof Error ? s.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
du = async function() {
  var e, t;
  if (!(!this._sampleNode || !W(this, fe))) {
    this._regenerating = !0;
    try {
      const i = await is(this._sampleNode.key, W(this, fe).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = W(this, Yi)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = W(this, Yi)) == null || t.peek("danger", {
        data: {
          headline: "The image could not be regenerated",
          message: i instanceof Error ? i.message : ""
        }
      });
    } finally {
      this._regenerating = !1;
    }
  }
};
hu = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
pu = function(e) {
  var i;
  const t = this._bounds.find((a) => a.key === e.key);
  if (!t) {
    const a = (i = this._skipped.find((s) => s.key === e.key)) == null ? void 0 : i.reason;
    return r`
        <uui-table-row class="not-drawn">
          <uui-table-cell>${e.name || e.type}</uui-table-cell>
          <uui-table-cell colspan="3">
            <span class="reason">not drawn${a ? ` — ${a}` : ""}</span>
          </uui-table-cell>
        </uui-table-row>
      `;
  }
  return r`
      <uui-table-row>
        <uui-table-cell>${e.name || e.type}</uui-table-cell>
        <uui-table-cell>
          ${t.resolvedText ?? r`<em>—</em>`}
          ${t.truncated ? r`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : p}
        </uui-table-cell>
        <uui-table-cell>${Math.round(t.x)}, ${Math.round(t.y)}</uui-table-cell>
        <uui-table-cell>${Math.round(t.width)} × ${Math.round(t.height)}</uui-table-cell>
      </uui-table-row>
    `;
};
de.styles = P`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
      overflow: auto;
    }

    .grid {
      display: grid;
      gap: var(--uui-size-layout-1);
      max-width: 1200px;
    }

    .actions {
      display: flex;
      gap: var(--uui-size-space-2);
      flex-wrap: wrap;
    }

    .render {
      display: block;
      max-width: 100%;
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-2);
      /* Behind the image, so a transparent render reads as transparent rather than as white. */
      ${Mo}
    }

    .hint {
      margin: var(--uui-size-space-4) 0 0;
      font-size: 12px;
      color: var(--uui-color-text-alt);
    }

    .error {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      color: var(--uui-color-danger);
    }

    .empty {
      color: var(--uui-color-text-alt);
      margin: 0;
    }

    .not-drawn {
      color: var(--uui-color-text-alt);
    }

    .reason {
      font-style: italic;
    }

    code {
      background: var(--uui-color-surface-alt);
      padding: 0 4px;
      border-radius: 2px;
    }
  `;
Ye([
  f()
], de.prototype, "_template", 2);
Ye([
  f()
], de.prototype, "_sampleNode", 2);
Ye([
  f()
], de.prototype, "_bounds", 2);
Ye([
  f()
], de.prototype, "_skipped", 2);
Ye([
  f()
], de.prototype, "_url", 2);
Ye([
  f()
], de.prototype, "_loading", 2);
Ye([
  f()
], de.prototype, "_error", 2);
Ye([
  f()
], de.prototype, "_regenerating", 2);
de = Ye([
  A("di-preview-view")
], de);
const im = de, am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return de;
  },
  default: im
}, Symbol.toStringTag, { value: "Module" }));
var sm = Object.defineProperty, om = Object.getOwnPropertyDescriptor, mu = (e) => {
  throw TypeError(e);
}, ps = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? om(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && sm(t, i, s), s;
}, an = (e, t, i) => t.has(e) || mu("Cannot " + i), U = (e, t, i) => (an(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ts = (e, t, i) => t.has(e) ? mu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qn = (e, t, i, a) => (an(e, t, "write to private field"), t.set(e, i), i), lt = (e, t, i) => (an(e, t, "access private method"), i), j, Ut, $e, fu, yu, gu, vu, bu, _u, wu, $u, xu;
let pt = class extends z {
  constructor() {
    super(), Ts(this, $e), Ts(this, j), Ts(this, Ut), this._properties = [], this._showAdvanced = !1, this.consumeContext(es, (e) => {
      qn(this, Ut, e);
    }), this.consumeContext(Wt, (e) => {
      qn(this, j, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${lt(this, $e, _u).call(this)} ${lt(this, $e, wu).call(this)} ${lt(this, $e, $u).call(this)} ${lt(this, $e, xu).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
j = /* @__PURE__ */ new WeakMap();
Ut = /* @__PURE__ */ new WeakMap();
$e = /* @__PURE__ */ new WeakSet();
fu = function() {
  return this._properties.filter((e) => e.classification === "media");
};
yu = async function() {
  var a, s;
  if (!U(this, Ut) || !this._template) return;
  const e = U(this, Ut).open(this, ad, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await lt(this, $e, gu).call(this, t.selection.filter((o) => !!o));
  (a = U(this, j)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = U(this, j)) == null ? void 0 : s.reloadProperties());
};
gu = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => hd), i = await t(U(this, j).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
vu = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = U(this, j)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = U(this, j)) == null || s.reloadProperties();
};
bu = async function() {
  var i;
  if (!U(this, Ut)) return;
  const e = U(this, Ut).open(this, ir, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = U(this, j)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
_u = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${e.docTypeAliases.length === 0 ? r`<p class="empty">No document types yet - nothing will trigger this template.</p>` : r`<div class="tags">
                  ${V(
    e.docTypeAliases,
    (t) => t,
    (t) => r`
                      <uui-tag look="secondary">
                        ${t}
                        <uui-button
                          compact
                          label="Remove ${t}"
                          @click=${() => lt(this, $e, vu).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${lt(this, $e, yu)}>
              Choose document types
            </uui-button>
          </div>
        </umb-property-layout>

        <umb-property-layout
          label="Target property"
          description="The media picker the generated image is written to.">
          <uui-select
            slot="editor"
            .value=${e.targetPropertyAlias}
            .options=${[
    { name: "- none -", value: "" },
    ...U(this, $e, fu).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = U(this, j)) == null ? void 0 : i.updateTemplateFields({
      targetPropertyAlias: t.target.value
    });
  }}>
          </uui-select>
        </umb-property-layout>

        <umb-property-layout label="Enabled" description="Disabled templates never run.">
          <uui-toggle
            slot="editor"
            ?checked=${e.isEnabled}
            @change=${(t) => {
    var i;
    return (i = U(this, j)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
wu = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${lt(this, $e, bu)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = U(this, j)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
  }}>
                  Clear
                </uui-button>` : p}
          </div>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = U(this, j)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
  }}>
          </uui-input>
        </umb-property-layout>

        <umb-property-layout label="Format">
          <uui-select
            slot="editor"
            .value=${e.output.format}
            .options=${["png", "jpeg", "webp"].map((t) => ({
    name: t.toUpperCase(),
    value: t,
    selected: t === e.output.format
  }))}
            @change=${(t) => {
    var i;
    return (i = U(this, j)) == null ? void 0 : i.updateOutput({
      format: t.target.value
    });
  }}>
          </uui-select>
        </umb-property-layout>

        ${e.output.format === "png" ? p : r`<umb-property-layout label="Quality" description="1-100. Ignored for PNG.">
              <uui-input
                slot="editor"
                type="number"
                min="1"
                max="100"
                .value=${String(e.output.quality)}
                @change=${(t) => {
    var i;
    return (i = U(this, j)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
$u = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = U(this, j)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>

        <umb-property-layout
          label="Only when empty"
          description="Leave on so an image an editor picked by hand is never overwritten.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onlyWhenEmpty}
            @change=${(t) => {
    var i;
    return (i = U(this, j)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
xu = function() {
  const e = this._template;
  return r`
      <uui-box headline="Advanced">
        <umb-property-layout label="Alias" description="Used by export, import and file sync.">
          <uui-input
            slot="editor"
            .value=${e.alias}
            placeholder="Generated from the name"
            @change=${(t) => {
    var i;
    return (i = U(this, j)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
  }}>
          </uui-input>
        </umb-property-layout>

        <umb-property-layout label="Template JSON" description="Read-only. This is what export writes.">
          <div slot="editor">
            <uui-button
              look="secondary"
              label="${this._showAdvanced ? "Hide" : "Show"} the template JSON"
              @click=${() => {
    this._showAdvanced = !this._showAdvanced;
  }}>
              ${this._showAdvanced ? "Hide" : "Show"} JSON
            </uui-button>
            ${this._showAdvanced ? r`<pre class="json">${JSON.stringify(e, null, 2)}</pre>` : p}
          </div>
        </umb-property-layout>
      </uui-box>
    `;
};
pt.styles = P`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
    }

    .grid {
      display: grid;
      gap: var(--uui-size-layout-1);
      max-width: 1100px;
    }

    .row {
      display: flex;
      gap: var(--uui-size-space-3);
      align-items: center;
      flex-wrap: wrap;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--uui-size-space-2);
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      margin: 0 0 var(--uui-size-space-3);
      color: var(--uui-color-text-alt);
    }

    .json {
      margin-top: var(--uui-size-space-3);
      padding: var(--uui-size-space-4);
      background: var(--uui-color-surface-alt);
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      max-height: 420px;
      overflow: auto;
      font-size: 12px;
    }
  `;
ps([
  f()
], pt.prototype, "_template", 2);
ps([
  f()
], pt.prototype, "_properties", 2);
ps([
  f()
], pt.prototype, "_showAdvanced", 2);
pt = ps([
  A("di-settings-view")
], pt);
const nm = pt, rm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return pt;
  },
  default: nm
}, Symbol.toStringTag, { value: "Module" }));
var lm = Object.defineProperty, cm = Object.getOwnPropertyDescriptor, ku = (e) => {
  throw TypeError(e);
}, ua = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? cm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && lm(t, i, s), s;
}, sn = (e, t, i) => t.has(e) || ku("Cannot " + i), Gn = (e, t, i) => (sn(e, t, "read from private field"), t.get(e)), Hn = (e, t, i) => t.has(e) ? ku("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), um = (e, t, i, a) => (sn(e, t, "write to private field"), t.set(e, i), i), Yn = (e, t, i) => (sn(e, t, "access private method"), i), Ji, Ia, ho;
let Ve = class extends z {
  constructor() {
    super(), Hn(this, Ia), Hn(this, Ji), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Wt, (e) => {
      um(this, Ji, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Yn(this, Ia, ho).call(this);
      });
    });
  }
  render() {
    if (this._loading) return r`<uui-loader></uui-loader>`;
    if (!this._usage) return r`<p class="empty">Save the template to see which content it applies to.</p>`;
    const e = this._onlyMissing ? this._usage.items.filter((t) => !t.hasImage) : this._usage.items;
    return r`
      <uui-box headline="Content using this template">
        <div slot="header-actions">
          <uui-button look="secondary" label="Reload" @click=${() => Yn(this, Ia, ho).call(this)}>Reload</uui-button>
        </div>

        <p class="summary">
          <strong>${this._usage.withImageOnPage}</strong> of the
          <strong>${this._usage.items.length}</strong> shown have an image.
          ${this._usage.total > this._usage.items.length ? r`<span class="muted">${this._usage.total} in total.</span>` : p}
        </p>

        <uui-toggle
          label="Only show the ones without an image"
          ?checked=${this._onlyMissing}
          @change=${(t) => {
      this._onlyMissing = t.target.checked;
    }}>
          Only without an image
        </uui-toggle>

        ${e.length === 0 ? r`<p class="empty">Nothing to show.</p>` : r`<uui-table>
              <uui-table-head>
                <uui-table-head-cell>Name</uui-table-head-cell>
                <uui-table-head-cell>Image</uui-table-head-cell>
                <uui-table-head-cell>State</uui-table-head-cell>
              </uui-table-head>
              ${V(
      e,
      (t) => t.key,
      (t) => r`
                  <uui-table-row>
                    <uui-table-cell>${t.name}</uui-table-cell>
                    <uui-table-cell>
                      ${t.hasImage ? r`<uui-tag color="positive" look="secondary">Has one</uui-tag>` : r`<uui-tag color="warning" look="secondary">Missing</uui-tag>`}
                    </uui-table-cell>
                    <uui-table-cell>${t.isPublished ? "Published" : "Draft"}</uui-table-cell>
                  </uui-table-row>
                `
    )}
            </uui-table>`}
      </uui-box>
    `;
  }
};
Ji = /* @__PURE__ */ new WeakMap();
Ia = /* @__PURE__ */ new WeakSet();
ho = async function() {
  const e = this._template;
  if (!(!e || !Gn(this, Ji))) {
    this._loading = !0;
    try {
      this._usage = await Ar(e.key, Gn(this, Ji).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Ve.styles = P`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
      overflow: auto;
    }

    .summary {
      margin: 0 0 var(--uui-size-space-3);
    }

    .summary .muted {
      color: var(--uui-color-text-alt);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
ua([
  f()
], Ve.prototype, "_template", 2);
ua([
  f()
], Ve.prototype, "_usage", 2);
ua([
  f()
], Ve.prototype, "_loading", 2);
ua([
  f()
], Ve.prototype, "_onlyMissing", 2);
Ve = ua([
  A("di-usage-view")
], Ve);
const dm = Ve, hm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Ve;
  },
  default: dm
}, Symbol.toStringTag, { value: "Module" })), pm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Is,
  default: Is
}, Symbol.toStringTag, { value: "Module" }));
var ot, It;
class Ss extends Uu {
  constructor(i, a) {
    super(i, a);
    x(this, ot);
    x(this, It);
    this.consumeContext(pe, (s) => {
      _(this, ot, s);
    }), this.consumeContext(Wt, (s) => {
      _(this, It, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, It), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, ot)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await mo(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await wo(a.key, !1, i.getToken);
        (o = c(this, ot)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await nl(l, i.getToken, c(this, ot));
      } catch (l) {
        (n = c(this, ot)) == null || n.peek("danger", {
          data: {
            headline: "Regeneration could not be started",
            message: l instanceof Error ? l.message : ""
          }
        });
      }
    }
  }
  /** Exposed so a future progress UI can stop a long run; the endpoint already supports it. */
  async cancel(i) {
    c(this, It) && await Pr(i, c(this, It).getToken);
  }
}
ot = new WeakMap(), It = new WeakMap();
const mm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: Ss,
  api: Ss,
  default: Ss
}, Symbol.toStringTag, { value: "Module" }));
var ea, li;
class Es extends Qa {
  constructor(i, a) {
    super(i, a);
    x(this, ea);
    x(this, li);
    this.consumeContext(Te, (s) => {
      _(this, ea, s);
    }), this.consumeContext(pe, (s) => {
      _(this, li, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await is(i, () => {
          var l;
          return (l = c(this, ea)) == null ? void 0 : l.getLatestToken();
        }), n = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = c(this, li)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof Be && o.status === 404;
        (s = c(this, li)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof Be ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
ea = new WeakMap(), li = new WeakMap();
const fm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: Es,
  api: Es,
  default: Es
}, Symbol.toStringTag, { value: "Module" }));
var ta, Ot, ia, ci;
class Ds extends nd {
  constructor(i, a) {
    super(i, a);
    x(this, ta);
    x(this, Ot);
    x(this, ia);
    x(this, ci);
    this.consumeContext(Te, (s) => {
      _(this, ta, s);
    }), this.consumeContext(pe, (s) => {
      _(this, Ot, s);
    }), this.consumeContext(rd, (s) => {
      _(this, ia, s);
    }), this.consumeContext(ld, (s) => {
      _(this, ci, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, ci)) {
      (i = c(this, Ot)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await is(c(this, ci), () => {
        var l;
        return (l = c(this, ta)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, ia)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, Ot)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof Be && n.status === 404;
      (o = c(this, Ot)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof Be ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
ta = new WeakMap(), Ot = new WeakMap(), ia = new WeakMap(), ci = new WeakMap();
const ym = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: Ds,
  api: Ds,
  default: Ds
}, Symbol.toStringTag, { value: "Module" }));
var gm = Object.defineProperty, vm = Object.getOwnPropertyDescriptor, Tu = (e) => {
  throw TypeError(e);
}, ms = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? vm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && gm(t, i, s), s;
}, on = (e, t, i) => t.has(e) || Tu("Cannot " + i), Xa = (e, t, i) => (on(e, t, "read from private field"), t.get(e)), ga = (e, t, i) => t.has(e) ? Tu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Su = (e, t, i, a) => (on(e, t, "write to private field"), t.set(e, i), i), Kt = (e, t, i) => (on(e, t, "access private method"), i), Oa, Zi, nn, Ze, rn, Eu, Pa;
let mt = class extends yo {
  constructor() {
    super(), ga(this, Ze), ga(this, Oa), ga(this, Zi), this._items = [], this._loading = !0, this._search = "", ga(this, nn, () => {
      var e;
      return (e = Xa(this, Oa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Te, (e) => {
      Su(this, Oa, e), e && Kt(this, Ze, rn).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(Xa(this, Zi));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${Kt(this, Ze, Eu)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Kt(this, Ze, Pa).call(this, void 0)}>
          Use sample data
        </uui-button>

        ${this._loading ? r`<uui-loader></uui-loader>` : this._items.length === 0 ? r`<p class="empty">No content of the selected document types was found.</p>` : r`<uui-ref-list>
                ${V(
      this._items,
      (e) => e.key,
      (e) => {
        var t;
        return r`
                    <uui-ref-node
                      name=${e.name}
                      detail=${e.isPublished ? "Published" : "Draft"}
                      ?selected=${e.key === ((t = this.data) == null ? void 0 : t.selectedKey)}
                      @open=${() => Kt(this, Ze, Pa).call(this, e)}
                      @click=${() => Kt(this, Ze, Pa).call(this, e)}>
                    </uui-ref-node>
                  `;
      }
    )}
              </uui-ref-list>`}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Oa = /* @__PURE__ */ new WeakMap();
Zi = /* @__PURE__ */ new WeakMap();
nn = /* @__PURE__ */ new WeakMap();
Ze = /* @__PURE__ */ new WeakSet();
rn = async function() {
  var t;
  const e = ((t = this.data) == null ? void 0 : t.docTypeAliases) ?? [];
  if (e.length === 0) {
    this._items = [], this._loading = !1;
    return;
  }
  this._loading = !0;
  try {
    const i = await Promise.all(
      e.map(
        (a) => Ir(a, this._search, 0, 30, Xa(this, nn)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
Eu = function(e) {
  this._search = e.target.value, window.clearTimeout(Xa(this, Zi)), Su(this, Zi, window.setTimeout(() => void Kt(this, Ze, rn).call(this), 300));
};
Pa = function(e) {
  this.value = { item: e }, this._submitModal();
};
mt.styles = P`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
ms([
  f()
], mt.prototype, "_items", 2);
ms([
  f()
], mt.prototype, "_loading", 2);
ms([
  f()
], mt.prototype, "_search", 2);
mt = ms([
  A("di-sample-node-picker-modal")
], mt);
const bm = mt, _m = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return mt;
  },
  default: bm
}, Symbol.toStringTag, { value: "Module" }));
var wm = Object.defineProperty, $m = Object.getOwnPropertyDescriptor, Du = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $m(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && wm(t, i, s), s;
}, ln = (e, t, i) => t.has(e) || Du("Cannot " + i), mi = (e, t, i) => (ln(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Cs = (e, t, i) => t.has(e) ? Du("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xm = (e, t, i, a) => (ln(e, t, "write to private field"), t.set(e, i), i), xt = (e, t, i) => (ln(e, t, "access private method"), i), Aa, da, ye, Cu, Iu, Ou, cn, Pu, Au, Mu, Ru;
const km = [100, 200, 300, 400, 500, 600, 700, 800, 900], Tm = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let he = class extends yo {
  constructor() {
    super(), Cs(this, ye), Cs(this, Aa), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", Cs(this, da, () => {
      var e;
      return (e = mi(this, Aa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Te, (e) => {
      xm(this, Aa, e);
    });
  }
  render() {
    return r`
      <umb-body-layout headline="Add a font">
        <uui-box headline="Upload a file">
          <!-- uui-file-dropzone rather than a raw <input type="file">: the native
               "Choose files | No file chosen" control looked out of place beside the uui-styled
               inputs in the same dialog. It is what umb-input-dropzone is built on in core, so
               this borrows the control without core's media upload manager. -->
          <uui-file-dropzone
            accept=".ttf,.otf,.woff2,.woff"
            multiple
            label="Drop font files here, or click to browse"
            ?disabled=${this._busy}
            @change=${xt(this, ye, Cu)}>
          </uui-file-dropzone>
          <p class="hint">
            .ttf, .otf, .woff2 or .woff. The family name and weight are read from the file. Uploads are stored in the
            media library, so they work on Umbraco Cloud and transfer with Deploy.
          </p>
        </uui-box>

        <uui-box headline="Or register a path in wwwroot">
          <uui-input
            label="Path"
            placeholder="/assets/fonts/Inter-Regular.ttf"
            .value=${this._path}
            ?disabled=${this._busy}
            @input=${(e) => {
      this._path = e.target.value;
    }}>
          </uui-input>
          <uui-button
            look="secondary"
            label="Register this path"
            ?disabled=${this._busy || !this._path.trim()}
            @click=${xt(this, ye, Ou)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Tm.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? xt(this, ye, Ru).call(this) : xt(this, ye, Mu).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !mi(this, ye, cn)}
            @click=${xt(this, ye, Pu)}>
            Add web font
          </uui-button>
        </uui-box>

        ${this._error ? r`<p class="error" role="alert">${this._error}</p>` : p}
        ${this._busy ? r`<uui-loader-bar></uui-loader-bar>` : p}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Aa = /* @__PURE__ */ new WeakMap();
da = /* @__PURE__ */ new WeakMap();
ye = /* @__PURE__ */ new WeakSet();
Cu = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  xt(this, ye, Iu).call(this, t);
};
Iu = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await wr(t, mi(this, da));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Ou = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await $r(this._path.trim(), mi(this, da)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
cn = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
Pu = async function() {
  if (mi(this, ye, cn)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await xr(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        mi(this, da)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
Au = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Mu = function() {
  return r`
      <uui-input
        label="Family"
        placeholder="Inter"
        .value=${this._family}
        ?disabled=${this._busy}
        @input=${(e) => {
    this._family = e.target.value;
  }}>
      </uui-input>

      <div class="weights" role="group" aria-label="Weights">
        ${V(
    km,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => xt(this, ye, Au).call(this, e, t.target.checked)}>
              ${e}
            </uui-checkbox>
          `
  )}
      </div>

      <uui-toggle
        label="Include italic"
        ?checked=${this._italic}
        ?disabled=${this._busy}
        @change=${(e) => {
    this._italic = e.target.checked;
  }}>
        Include italic
      </uui-toggle>

      <p class="hint">
        One font is added per weight (and per italic). The family name is the one the provider uses - type it as it
        appears on their site. The file is fetched from the provider the first time each server needs it and cached
        there; it is not stored in the media library.
        ${this._provider === "bunny" ? r`<br />Bunny Fonts serve the Latin subset only, so accented Latin renders but other scripts do not.` : p}
      </p>
    `;
};
Ru = function() {
  return r`
      <uui-input
        label="Font file URL"
        placeholder="https://cdn.example.com/fonts/Inter-Bold.ttf"
        .value=${this._url}
        ?disabled=${this._busy}
        @input=${(e) => {
    this._url = e.target.value;
  }}>
      </uui-input>
      <p class="hint">
        An https URL to a static .ttf, .otf, .woff2 or .woff file - not a stylesheet, and not a variable font, which
        would render at its default weight. The family name and weight are read from the file.
      </p>
    `;
};
he.styles = P`
    uui-box {
      margin-bottom: var(--uui-size-space-4);
    }

    uui-input,
    uui-select {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .weights {
      display: flex;
      flex-wrap: wrap;
      gap: var(--uui-size-space-2) var(--uui-size-space-4);
      margin-bottom: var(--uui-size-space-3);
    }

    uui-toggle {
      margin-bottom: var(--uui-size-space-3);
    }

    .hint {
      margin: var(--uui-size-space-3) 0 0;
      font-size: 12px;
      color: var(--uui-color-text-alt);
    }

    .error {
      color: var(--uui-color-danger);
    }
  `;
Xe([
  f()
], he.prototype, "_busy", 2);
Xe([
  f()
], he.prototype, "_error", 2);
Xe([
  f()
], he.prototype, "_path", 2);
Xe([
  f()
], he.prototype, "_provider", 2);
Xe([
  f()
], he.prototype, "_family", 2);
Xe([
  f()
], he.prototype, "_weights", 2);
Xe([
  f()
], he.prototype, "_italic", 2);
Xe([
  f()
], he.prototype, "_url", 2);
he = Xe([
  A("di-font-upload-modal")
], he);
const Sm = he, Em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return he;
  },
  default: Sm
}, Symbol.toStringTag, { value: "Module" }));
var Dm = Object.getOwnPropertyDescriptor, Cm = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = n(s) || s);
  return s;
};
let Ja = class extends z {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Ja = Cm([
  A("di-template-folder-editor")
], Ja);
const Im = Ja, Om = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Ja;
  },
  default: Im
}, Symbol.toStringTag, { value: "Module" }));
export {
  Kd as manifests,
  nf as onInit
};
//# sourceMappingURL=dynamic-images.js.map
