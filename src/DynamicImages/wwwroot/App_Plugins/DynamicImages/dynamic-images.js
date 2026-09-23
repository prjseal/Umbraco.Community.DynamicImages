var en = (e) => {
  throw TypeError(e);
};
var rs = (e, t, i) => t.has(e) || en("Cannot " + i);
var c = (e, t, i) => (rs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), x = (e, t, i) => t.has(e) ? en("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (rs(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), D = (e, t, i) => (rs(e, t, "access private method"), i);
var ls = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as mu, UmbEntityWorkspaceDataManager as fu, UmbSubmitWorkspaceAction as ws, UmbEntityNamedDetailWorkspaceContextBase as gu, UmbWorkspaceActionBase as yu } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Ba, UmbContextConsumerController as vu } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as Rn, UmbItemRepositoryBase as bu, UmbItemServerDataSourceBase as _u, UmbRepositoryBase as Ln } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as Fn, UmbItemStoreBase as wu } from "@umbraco-cms/backoffice/store";
import { UmbId as $u } from "@umbraco-cms/backoffice/id";
import { nothing as p, html as r, css as M, state as f, customElement as z, repeat as j, property as y, classMap as Un, styleMap as K } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as W } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as xu, UmbTreeRepositoryBase as ku } from "@umbraco-cms/backoffice/tree";
import { UMB_NOTIFICATION_CONTEXT as pe } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as Tu } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UmbRequestReloadChildrenOfEntityEvent as Wn, UmbRequestReloadStructureForEntityEvent as Su, UmbEntityActionBase as Ka } from "@umbraco-cms/backoffice/entity-action";
import { UMB_AUTH_CONTEXT as Ae } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as Nn, UMB_DISCARD_CHANGES_MODAL as Eu, umbConfirmModal as ja, UmbModalToken as io, UmbModalBaseElement as ao, UMB_MODAL_MANAGER_CONTEXT as Va } from "@umbraco-cms/backoffice/modal";
import { UMB_ACTION_EVENT_CONTEXT as Bn } from "@umbraco-cms/backoffice/action";
import { tryExecute as Du } from "@umbraco-cms/backoffice/resources";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_MEDIA_PICKER_MODAL as Kn } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as Cu } from "@umbraco-cms/backoffice/document-type";
import { UmbArrayState as bi, UmbStringState as tn, UmbObjectState as Pu, UmbBooleanState as ca, UmbNumberState as Iu } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as Ou } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Au } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Mu } from "@umbraco-cms/backoffice/document";
const qa = "dynamic-images", Qi = "di-template", jn = "di:templates-changed", zu = "/umbraco/management/api/v1/dynamic-images";
class je extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function w(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${zu}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await Ru(n);
  return n;
}
async function Ru(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new je(t, e.status, i);
}
const T = async (e) => e.json();
async function Vn(e) {
  const t = await w("/templates?take=500", e);
  return (await T(t)).items;
}
const Ga = async (e, t) => T(await w(`/templates/${e}`, t)), qn = async (e, t) => T(await w("/templates", t, { method: "POST", json: e })), Gn = async (e, t) => T(await w(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function so(e, t) {
  await w(`/templates/${e}`, t, { method: "DELETE" });
}
const oo = async (e, t) => T(await w(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function no(e, t) {
  return (await w(`/templates/${e}/export`, t)).blob();
}
const ro = async (e, t, i, a = null) => T(await w("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function Hn(e, t, i, a) {
  const s = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && s.set("foldersOnly", "true"), a && s.set("parentKey", a), s.toString();
}
const $s = async (e, t, i, a) => T(await w(`/tree/root?${Hn(e, t, i)}`, a)), Yn = async (e, t, i, a, s) => T(await w(`/tree/children?${Hn(t, i, a, e)}`, s)), Xn = async (e, t) => T(await w(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function lo(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return T(await w(`/item?${i}`, t));
}
const Jn = async (e, t) => T(await w("/folders", t, { method: "POST", json: e })), Zn = async (e, t) => T(await w(`/folders/${e}`, t)), Qn = async (e, t, i) => T(await w(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function er(e, t) {
  await w(`/folders/${e}`, t, { method: "DELETE" });
}
async function tr(e, t, i) {
  await w(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function ir(e, t, i) {
  await w(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
const Ii = async (e) => T(await w("/fonts", e));
async function ar(e, t) {
  const i = new FormData();
  return i.append("file", e), T(await w("/fonts", t, { method: "POST", body: i }));
}
const sr = async (e, t) => T(await w("/fonts/register-path", t, { method: "POST", json: { path: e } })), or = async (e, t) => T(await w("/fonts/register-web", t, { method: "POST", json: e })), nr = async (e, t) => T(await w(`/fonts/${e}/refresh`, t, { method: "POST" })), rr = async (e, t, i, a, s) => T(await w(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function lr(e, t) {
  await w(`/fonts/${e}`, t, { method: "DELETE" });
}
async function cr(e, t) {
  return (await w(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Lu = async (e) => T(await w("/document-types", e)), ur = async (e, t) => T(await w(`/document-types/${encodeURIComponent(e)}/properties`, t)), dr = async (e, t, i) => T(await w(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function hr(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), T(await w(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function co(e, t, i) {
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
const uo = async (e, t, i) => T(await w("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), ho = async (e, t) => T(await w(`/media/${e}/image-info`, t)), Ha = async (e, t) => T(await w(`/documents/${e}/regenerate`, t, { method: "POST" })), po = async (e, t, i) => T(await w(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), pr = async (e, t) => T(await w(`/jobs/${e}`, t));
async function mr(e, t) {
  await w(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const fr = async (e, t) => T(await w(`/templates/${e}/usage`, t)), mo = async (e) => T(await w("/health", e)), gr = async (e) => T(await w("/sync/status", e)), yr = async (e) => T(await w("/sync/export", e, { method: "POST" })), vr = async (e) => T(await w("/sync/import", e, { method: "POST" }));
function Oi(e) {
  const t = `section/${qa}/workspace/${Qi}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Ya(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${qa}/workspace/${Qi}/create${t}`, document.baseURI).pathname;
}
function br(e) {
  return new URL(`section/${qa}/dashboard/${e}`, document.baseURI).pathname;
}
function ea() {
  window.dispatchEvent(new CustomEvent(jn));
}
const Fu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: je,
  SECTION_PATHNAME: qa,
  TEMPLATES_CHANGED_EVENT: jn,
  TEMPLATE_ENTITY_TYPE: Qi,
  cancelJob: mr,
  createFolder: Jn,
  createTemplate: qn,
  deleteFolder: er,
  deleteFont: lr,
  deleteTemplate: so,
  duplicateTemplate: oo,
  exportTemplate: no,
  fetchDocumentTypes: Lu,
  fetchFolder: Zn,
  fetchFontFile: cr,
  fetchFonts: Ii,
  fetchHealth: mo,
  fetchImageInfo: ho,
  fetchJob: pr,
  fetchLayout: uo,
  fetchLinkedProperties: dr,
  fetchPreview: co,
  fetchProperties: ur,
  fetchSampleContent: hr,
  fetchSyncStatus: gr,
  fetchTemplate: Ga,
  fetchTemplates: Vn,
  fetchTreeAncestors: Xn,
  fetchTreeChildren: Yn,
  fetchTreeItems: lo,
  fetchTreeRoot: $s,
  fetchUsage: fr,
  hrefForCreate: Ya,
  hrefForDashboard: br,
  hrefForTemplate: Oi,
  importTemplate: ro,
  moveFolder: ir,
  moveTemplate: tr,
  notifyTemplatesChanged: ea,
  refreshFont: nr,
  regenerateDocument: Ha,
  regenerateTemplate: po,
  registerFontPath: sr,
  registerWebFont: or,
  runSyncExport: yr,
  runSyncImport: vr,
  updateFolder: Qn,
  updateFont: rr,
  updateTemplate: Gn,
  uploadFont: ar
}, Symbol.toStringTag, { value: "Module" })), Xa = () => crypto.randomUUID();
function Ja(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function _r(e, t, i) {
  const { x: a, y: s } = Ja(e);
  return {
    type: "text",
    key: Xa(),
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
function wr(e, t, i) {
  const { x: a, y: s } = Ja(e);
  return {
    type: "image",
    key: Xa(),
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
function $r(e, t, i) {
  const { x: a, y: s } = Ja(e);
  return {
    type: "badges",
    key: Xa(),
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
function Uu(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = Ja(e);
  return {
    type: "rect",
    key: Xa(),
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
function Wu(e) {
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
function Nu(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (Wu(e.classification)) {
    case "image":
      return { kind: "layer", layer: wr(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: $r(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: _r(t, e.name, Bu(e)) };
  }
}
function Bu(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function xr() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function Ku(e) {
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
const kr = [
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
function Ai(e) {
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
function Mi(e) {
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
function xs(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return kr[a * 3 + i];
}
function Za(e, t, i) {
  return {
    x: e.x - t * Ai(e.anchor),
    y: e.y - i * Mi(e.anchor)
  };
}
function fo(e, t, i, a, s) {
  return {
    x: e + i * Ai(s),
    y: t + a * Mi(s)
  };
}
function ju(e, t, i, a) {
  const s = Za(e, t, i), o = fo(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function Vu(e, t) {
  const i = fo(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Tr(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Vt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), d = e - i, m = t - a;
  return { x: i + d * n - m * l, y: a + d * l + m * n };
}
function qu(e, t, i, a, s) {
  return Vt(e, t, i, a, -s);
}
function Sr(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Vt(e.x, e.y, t, i, a),
    Vt(e.x + e.width, e.y, t, i, a),
    Vt(e.x + e.width, e.y + e.height, t, i, a),
    Vt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((m) => m.x)), n = Math.max(...s.map((m) => m.x)), l = Math.min(...s.map((m) => m.y)), d = Math.max(...s.map((m) => m.y));
  return { x: o, y: l, width: n - o, height: d - l };
}
const Gu = 10;
function Ie(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Er(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Da(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function an(e) {
  return e === "below" || e === "above";
}
function sn(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Hu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Yu(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = sn(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...sn(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Xu(e, t, i) {
  const a = e.position;
  if (!Er(a)) return a;
  if (Yu(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Ai(a.anchor), l = Mi(a.anchor);
  const d = on(e, a.relativeX, !1, t, i);
  d && (s = d.coordinate, n = d.factor);
  const m = on(e, a.relativeY, !0, t, i);
  return m && (o = m.coordinate, l = m.factor), { x: s, y: o, anchor: xs(n, l) };
}
function on(e, t, i, a, s) {
  if (!t || an(t.edge) !== i) return;
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
    if (!m || an(m.edge) !== i) return;
    n = m.layerKey;
  }
}
function Ju(e, t, i) {
  const a = Hu(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const d = s.get(l.key);
    if (d) return d;
    let m;
    o.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), m = Xu(l, a, (Ze) => {
      const ze = a.get(Ze);
      return ze && !i(ze) ? n(ze).extent : void 0;
    }), o.delete(l.key));
    const S = t(l), X = Za(m, S.width, S.height), Te = { x: X.x, y: X.y, width: S.width, height: S.height }, Me = { position: m, box: Te, extent: Sr(Te, m.x, m.y, l.rotation ?? 0) };
    return s.set(l.key, Me), Me;
  };
  for (const l of e) n(l);
  return s;
}
function ks(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? xs(Ai(i.anchor), Mi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? xs(Ai(e.anchor), Mi(i.anchor)) : e.anchor
  };
}
var le, Fe, Ee, at;
class Zu {
  constructor(t = 100) {
    x(this, le, []);
    x(this, Fe, []);
    x(this, Ee, 0);
    x(this, at);
    this.limit = t;
  }
  get canUndo() {
    return c(this, le).length > 0;
  }
  get canRedo() {
    return c(this, Fe).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Ee) > 0 || (c(this, le).push(structuredClone(t)), c(this, le).length > this.limit && c(this, le).shift(), _(this, Fe, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Ee) === 0 && _(this, at, structuredClone(t)), ls(this, Ee)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Ee) !== 0 && (ls(this, Ee)._--, !(c(this, Ee) > 0) && (t && c(this, at) !== void 0 && (c(this, le).push(c(this, at)), c(this, le).length > this.limit && c(this, le).shift(), _(this, Fe, [])), _(this, at, void 0)));
  }
  undo(t) {
    const i = c(this, le).pop();
    if (i !== void 0)
      return c(this, Fe).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Fe).pop();
    if (i !== void 0)
      return c(this, le).push(structuredClone(t)), i;
  }
  clear() {
    _(this, le, []), _(this, Fe, []), _(this, Ee, 0), _(this, at, void 0);
  }
}
le = new WeakMap(), Fe = new WeakMap(), Ee = new WeakMap(), at = new WeakMap();
const Qu = "DynamicImages.Workspace.Template", ed = 12;
var Qt, st, Tt, St, Et, ei, ti, ii, Dt, ai, Ue, si, oi, ce, Yi, Ct, De, Pt, $, Dr, ni, ri, Ts, Ss, Es, Re, bt, Ds, Cr, Cs;
class td extends mu {
  constructor(i) {
    super(i, Qu);
    x(this, $);
    x(this, Qt);
    x(this, st);
    x(this, Tt);
    x(this, St);
    x(this, Et);
    x(this, ei);
    x(this, ti);
    x(this, ii);
    x(this, Dt);
    x(this, ai);
    x(this, Ue);
    x(this, si);
    x(this, oi);
    x(this, ce);
    x(this, Yi);
    x(this, Ct);
    x(this, De);
    x(this, Pt);
    x(this, ni);
    x(this, ri);
    this._data = new fu(this), this.template = this._data.current, _(this, Qt, new bi([], (a) => a.key)), this.layers = c(this, Qt).asObservable(), _(this, st, new tn(void 0)), this.selectedLayerKey = c(this, st).asObservable(), _(this, Tt, new bi([], (a) => a.alias)), this.properties = c(this, Tt).asObservable(), _(this, St, new Pu({})), this.linkedProperties = c(this, St).asObservable(), _(this, Et, new bi([], (a) => a.key)), this.fonts = c(this, Et).asObservable(), _(this, ei, new bi([], (a) => a.key)), this.serverBounds = c(this, ei).asObservable(), _(this, ti, new bi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, ti).asObservable(), _(this, ii, new tn(void 0)), this.sampleContentKey = c(this, ii).asObservable(), _(this, Dt, new ca(!0)), this.useSampleData = c(this, Dt).asObservable(), _(this, ai, new Iu(1)), this.zoom = c(this, ai).asObservable(), _(this, Ue, new ca(!0)), this.loading = c(this, Ue).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, si, new ca(!1)), this.canUndo = c(this, si).asObservable(), _(this, oi, new ca(!1)), this.canRedo = c(this, oi).asObservable(), _(this, ce, new Zu()), _(this, De, !1), _(this, Pt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, ni, async (a) => {
      const s = a.detail;
      if (c(this, Pt) || !(s != null && s.url) || !D(this, $, Dr).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await Nn(this, Eu), _(this, Pt, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, ri, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, Yi)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => us),
        setup: (a, s) => {
          const o = s.match.params.parentUnique;
          return this.createScaffold(void 0, o && o !== "null" ? o : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => us),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => us),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ae, (a) => {
      _(this, Yi, a);
    }), this.consumeContext(pe, (a) => {
      _(this, Ct, a);
    }), window.addEventListener("willchangestate", c(this, ni)), window.addEventListener("beforeunload", c(this, ri)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, De);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Ue).setValue(!0), _(this, De, !1);
    try {
      const a = await Ga(i, this.getToken);
      D(this, $, bt).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await D(this, $, Ts).call(this, a);
    } catch (a) {
      D(this, $, Cs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Ue).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, Ue).setValue(!0), _(this, De, !0), D(this, $, bt).call(this, { ...Ku(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await D(this, $, Ts).call(this, this._data.getCurrent()), c(this, Ue).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await D(this, $, Es).call(this, i.docTypeAliases);
    c(this, Tt).setValue(a), c(this, St).setValue(await D(this, $, Ss).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, Et).setValue(await Ii(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    D(this, $, Re).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    D(this, $, Re).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    D(this, $, Re).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    D(this, $, Re).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    D(this, $, Re).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    D(this, $, Re).call(this, (s) => ({
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
    D(this, $, Re).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, d;
        let n = o.position;
        return ((l = Da(n, "x")) == null ? void 0 : l.layerKey) === i && (n = ks(n, "x", a == null ? void 0 : a.get(o.key))), ((d = Da(n, "y")) == null ? void 0 : d.layerKey) === i && (n = ks(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), c(this, st).getValue() === i && this.selectLayer(void 0);
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
    D(this, $, Re).call(this, (s) => {
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
    c(this, st).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, st).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, ce).begin(i);
  }
  endTransaction(i = !0) {
    c(this, ce).end(i), D(this, $, Ds).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ce).undo(i);
    a && D(this, $, bt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ce).redo(i);
    a && D(this, $, bt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, ei).setValue(i);
  }
  setIssues(i) {
    c(this, ti).setValue(i);
  }
  setSampleContentKey(i) {
    c(this, ii).setValue(i), c(this, Dt).setValue(!i);
  }
  setUseSampleData(i) {
    c(this, Dt).setValue(i);
  }
  setZoom(i) {
    c(this, ai).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = c(this, De) ? await qn(i, this.getToken) : await Gn(i, this.getToken);
      D(this, $, bt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, De);
      _(this, De, !1), this.setIsNew(!1), ea(), await D(this, $, Cr).call(this, o.template, n), (a = c(this, Ct)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, Ct)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", Oi(o.template.key));
    } catch (o) {
      throw D(this, $, Cs).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Pt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, ni)), window.removeEventListener("beforeunload", c(this, ri)), c(this, ce).clear(), super.destroy();
  }
}
Qt = new WeakMap(), st = new WeakMap(), Tt = new WeakMap(), St = new WeakMap(), Et = new WeakMap(), ei = new WeakMap(), ti = new WeakMap(), ii = new WeakMap(), Dt = new WeakMap(), ai = new WeakMap(), Ue = new WeakMap(), si = new WeakMap(), oi = new WeakMap(), ce = new WeakMap(), Yi = new WeakMap(), Ct = new WeakMap(), De = new WeakMap(), Pt = new WeakMap(), $ = new WeakSet(), /**
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
Dr = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, ni = new WeakMap(), ri = new WeakMap(), Ts = async function(i) {
  const [a, s] = await Promise.all([
    Ii(this.getToken).catch(() => []),
    D(this, $, Es).call(this, i.docTypeAliases)
  ]);
  c(this, Et).setValue(a), c(this, Tt).setValue(s), c(this, St).setValue(await D(this, $, Ss).call(this, i.docTypeAliases, s));
}, Ss = async function(i, a) {
  const s = a.filter((n) => n.classification === "content").slice(0, ed);
  if (s.length === 0 || i.length === 0) return {};
  const o = await Promise.all(
    s.map(async (n) => {
      const l = await Promise.all(
        i.map((m) => dr(m, n.alias, this.getToken).catch(() => null))
      ), d = /* @__PURE__ */ new Map();
      for (const m of l.flatMap((S) => (S == null ? void 0 : S.properties) ?? []))
        d.has(m.alias) || d.set(m.alias, m);
      return [n.alias, [...d.values()]];
    })
  );
  return Object.fromEntries(o.filter(([, n]) => n.length > 0));
}, Es = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => ur(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Re = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && c(this, ce).push(s);
  const o = i(structuredClone(s));
  D(this, $, bt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
bt = function(i, a) {
  a != null && a.resetHistory && c(this, ce).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Qt).setValue(i.layers), D(this, $, Ds).call(this);
}, Ds = function() {
  c(this, si).setValue(c(this, ce).canUndo), c(this, oi).setValue(c(this, ce).canRedo);
}, Cr = async function(i, a) {
  const s = await this.getContext(Bn).catch(() => {
  });
  s && (a ? s.dispatchEvent(new Wn({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : s.dispatchEvent(new Su({ entityType: "di-template", unique: i.key })));
}, Cs = function(i, a) {
  var o;
  const s = a instanceof je ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, Ct)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const Nt = new Ba(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), zi = "di-template-root", ge = "di-template-folder", We = Qi, Ca = "DynamicImages.Tree.Templates", Si = "DynamicImages.Repository.TemplateTree", Ei = "DynamicImages.Repository.TemplateFolder", id = "DynamicImages.Store.TemplateFolder", Ps = "DynamicImages.Workspace.TemplateFolder", ad = "DynamicImages.Workspace.TemplateRoot", nn = "DynamicImages.Repository.TemplateItem", sd = "DynamicImages.Store.TemplateItem", rn = "DynamicImages.Repository.TemplateDetail", od = "DynamicImages.Store.TemplateDetail", ln = "DynamicImages.Repository.MoveTemplate", cn = "DynamicImages.Repository.MoveTemplateFolder", un = "DynamicImages.Repository.DuplicateTemplate", nd = "icon-picture", rd = "icon-picture color-grey", ld = "icon-folder";
async function H(e, t) {
  const i = (async () => {
    const a = await new vu(e, Ae).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (s) {
      throw s instanceof je ? { type: "error", title: s.message, status: s.status, detail: s.detail } : s;
    }
  })();
  return await Du(e, i);
}
var ot;
class cd {
  constructor(t) {
    x(this, ot);
    _(this, ot, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: ge,
      unique: $u.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await H(c(this, ot), (s) => Zn(t, s));
    return i ? { data: { entityType: ge, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await H(c(this, ot), (o) => Jn({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await H(c(this, ot), (s) => Qn(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return H(c(this, ot), (i) => er(t, i));
  }
}
ot = new WeakMap();
const go = new Ba("DiTemplateFolderStore");
class Pr extends Fn {
  constructor(t) {
    super(t, go);
  }
}
class dn extends Rn {
  constructor(t) {
    super(t, cd, go);
  }
}
const ud = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: go,
  DiTemplateFolderRepository: dn,
  DiTemplateFolderStore: Pr,
  api: dn
}, Symbol.toStringTag, { value: "Module" })), dd = [
  {
    type: "repository",
    alias: Ei,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => ud)
  },
  {
    type: "store",
    alias: id,
    name: "Dynamic Images Template Folder Store",
    api: Pr
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [ge],
    meta: { folderRepositoryAlias: Ei }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [ge],
    meta: { folderRepositoryAlias: Ei }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Ps,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => Td),
    meta: { entityType: ge }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: ws,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Ps }]
  }
], hd = [
  {
    type: "repository",
    alias: Si,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => Dd)
  },
  {
    type: "tree",
    kind: "default",
    alias: Ca,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: Si }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [zi, ge, We]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: Ca, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: ad,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: zi, headline: "Templates" }
  },
  ...dd
], yo = new Ba("DiTemplateItemStore");
class Ir extends wu {
  constructor(t) {
    super(t, yo);
  }
}
class pd extends _u {
  constructor(t) {
    super(t, {
      getItems: (i) => H(t, (a) => lo(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? ge : We,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class hn extends bu {
  constructor(t) {
    super(t, pd, yo);
  }
}
const md = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: yo,
  DiTemplateItemRepository: hn,
  DiTemplateItemStore: Ir,
  api: hn
}, Symbol.toStringTag, { value: "Module" })), vo = new Ba("DiTemplateDetailStore");
class Or extends Fn {
  constructor(t) {
    super(t, vo);
  }
}
const cs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var li;
class fd {
  constructor(t) {
    x(this, li);
    this.createScaffold = cs, this.create = cs, this.update = cs, _(this, li, t);
  }
  async read(t) {
    const { data: i, error: a } = await H(c(this, li), (s) => Ga(t, s));
    return i ? { data: { entityType: We, unique: i.key, name: i.name } } : { error: a };
  }
  delete(t) {
    return H(c(this, li), (i) => so(t, i));
  }
}
li = new WeakMap();
class pn extends Rn {
  constructor(t) {
    super(t, fd, vo);
  }
}
const gd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: vo,
  DiTemplateDetailRepository: pn,
  DiTemplateDetailStore: Or,
  api: pn
}, Symbol.toStringTag, { value: "Module" })), _i = [zi, ge], yd = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: nn,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => md)
  },
  {
    type: "itemStore",
    alias: sd,
    name: "Dynamic Images Template Item Store",
    api: Ir
  },
  {
    type: "repository",
    alias: rn,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => gd)
  },
  {
    type: "store",
    alias: od,
    name: "Dynamic Images Template Detail Store",
    api: Or
  },
  {
    type: "repository",
    alias: ln,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => Id)
  },
  {
    type: "repository",
    alias: cn,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => Od)
  },
  {
    type: "repository",
    alias: un,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => Ad)
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
    api: () => Promise.resolve().then(() => Md),
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
      folderRepositoryAlias: Ei
    }
  },
  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [We],
    meta: {
      treeRepositoryAlias: Si,
      moveRepositoryAlias: ln,
      treeAlias: Ca,
      foldersOnly: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicate",
    alias: "DynamicImages.EntityAction.Template.Duplicate",
    name: "Duplicate Dynamic Images Template",
    forEntityTypes: [We],
    meta: {
      icon: "icon-documents",
      label: "Duplicate",
      duplicateRepositoryAlias: un,
      treeRepositoryAlias: Si
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => zd),
    forEntityTypes: [We],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON" }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => Ld),
    forEntityTypes: [We],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all" }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [We],
    meta: {
      itemRepositoryAlias: nn,
      detailRepositoryAlias: rn,
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
    forEntityTypes: [ge],
    meta: {
      treeRepositoryAlias: Si,
      moveRepositoryAlias: cn,
      treeAlias: Ca,
      foldersOnly: !0
    }
  },
  // ---------------------------------------------------------------- root and folder
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Import",
    name: "Import a Dynamic Images Template",
    api: () => Promise.resolve().then(() => Nd),
    forEntityTypes: _i,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON…" }
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
    element: () => Promise.resolve().then(() => Gd)
  }
], vd = [
  ...hd,
  ...yd,
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
    element: () => Promise.resolve().then(() => Jd),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => sh),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => lh),
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
    api: td,
    meta: { entityType: Qi }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => $p),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Sp),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Pp),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => zp),
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
    api: () => Promise.resolve().then(() => Rp),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Lp),
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
    api: () => Promise.resolve().then(() => Fp),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Up),
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
    element: () => Promise.resolve().then(() => Kp)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => Xp)
  }
], km = (e, t) => {
  t.registerMany(vd);
};
var bd = Object.defineProperty, _d = Object.getOwnPropertyDescriptor, Ar = (e) => {
  throw TypeError(e);
}, bo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? _d(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && bd(t, i, s), s;
}, _o = (e, t, i) => t.has(e) || Ar("Cannot " + i), wd = (e, t, i) => (_o(e, t, "read from private field"), t.get(e)), mn = (e, t, i) => t.has(e) ? Ar("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $d = (e, t, i, a) => (_o(e, t, "write to private field"), t.set(e, i), i), xd = (e, t, i) => (_o(e, t, "access private method"), i), Pa, Is, Mr;
let Rt = class extends W {
  constructor() {
    super(), mn(this, Is), mn(this, Pa), this._name = "", this._loading = !0, this.consumeContext(Nt, (e) => {
      $d(this, Pa, e), e && (this.observe(e.template, (t) => {
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
            @input=${xd(this, Is, Mr)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Pa = /* @__PURE__ */ new WeakMap();
Is = /* @__PURE__ */ new WeakSet();
Mr = function(e) {
  var i;
  const t = e.target.value;
  (i = wd(this, Pa)) == null || i.updateTemplateFields({ name: t });
};
Rt.styles = M`
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
bo([
  f()
], Rt.prototype, "_name", 2);
bo([
  f()
], Rt.prototype, "_loading", 2);
Rt = bo([
  z("di-template-editor")
], Rt);
const kd = Rt, us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Rt;
  },
  default: kd
}, Symbol.toStringTag, { value: "Module" }));
class fn extends gu {
  constructor(t) {
    super(t, {
      workspaceAlias: Ps,
      entityType: ge,
      detailRepositoryAlias: Ei
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => em),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Td = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: fn,
  api: fn
}, Symbol.toStringTag, { value: "Module" }));
function ds(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function Sd(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? ge : zi
    },
    name: e.name,
    entityType: t ? ge : We,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? ld : e.isEnabled ? nd : rd,
    isEnabled: e.isEnabled
  };
}
class Ed extends xu {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = ds(i);
        return H(t, (o) => $s(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = ds(i);
          return H(t, (d) => $s(n, l, i.foldersOnly ?? !1, d));
        }
        const a = i.parent.unique, { skip: s, take: o } = ds(i);
        return H(t, (n) => Yn(a, s, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => H(t, (a) => Xn(i.treeItem.unique, a)),
      mapper: Sd
    });
  }
}
class gn extends ku {
  constructor(t) {
    super(t, Ed);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: zi,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const Dd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: gn,
  api: gn
}, Symbol.toStringTag, { value: "Module" }));
class zr extends Ln {
  async requestMoveTo(t) {
    const { error: i } = await H(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(pe);
      a == null || a.peek("positive", { data: { message: "Moved" } });
    }
    return { error: i };
  }
}
class Cd extends zr {
  constructor() {
    super(...arguments), this.move = tr;
  }
}
class Pd extends zr {
  constructor() {
    super(...arguments), this.move = ir;
  }
}
const Id = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Cd
}, Symbol.toStringTag, { value: "Module" })), Od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Pd
}, Symbol.toStringTag, { value: "Module" }));
class yn extends Ln {
  async requestDuplicate(t) {
    const { data: i, error: a } = await H(this, (s) => oo(t.unique, s));
    if (i) {
      const s = await this.getContext(pe);
      s == null || s.peek("positive", { data: { message: `'${i.template.name}' created` } });
    }
    return { error: a };
  }
}
const Ad = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateTemplateRepository: yn,
  api: yn
}, Symbol.toStringTag, { value: "Module" }));
class vn extends Tu {
  async getHref() {
    return Ya({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const Md = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: vn,
  api: vn
}, Symbol.toStringTag, { value: "Module" }));
class bn extends Ka {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await H(this, async (n) => ({
      blob: await no(t, n),
      alias: (await Ga(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const s = URL.createObjectURL(i.blob), o = document.createElement("a");
    o.href = s, o.download = `${i.alias}.json`, o.click(), URL.revokeObjectURL(s);
  }
}
const zd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: bn,
  api: bn
}, Symbol.toStringTag, { value: "Module" })), Rd = 1500;
async function Rr(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((s) => setTimeout(s, Rd));
    try {
      a = await pr(a.id, t);
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
class _n extends Ka {
  async execute() {
    var d;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await H(this, (m) => lo([t], m)), a = ((d = i == null ? void 0 : i[0]) == null ? void 0 : d.name) ?? "this template";
    await ja(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: s, error: o } = await H(this, (m) => po(t, !1, m));
    if (o || !s) throw o ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(pe);
    n == null || n.peek("positive", { data: { message: `Regenerating ${s.total} item(s)…` } });
    const l = await this.getContext(Ae);
    await Rr(s, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const Ld = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: _n,
  api: _n
}, Symbol.toStringTag, { value: "Module" })), Fd = new io(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), Ud = new io(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), Wd = new io(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class wn extends Ka {
  async execute() {
    const { json: t } = await Nn(this, Wd, { data: {} }), i = this.args.unique ?? null, { data: a, error: s } = await H(this, (l) => ro(t, "create", l, i));
    if (s || !a) throw s ?? new Error("The template could not be imported.");
    const o = await this.getContext(pe);
    o == null || o.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) o == null || o.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(Bn);
    n == null || n.dispatchEvent(new Wn({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const Nd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: wn,
  api: wn
}, Symbol.toStringTag, { value: "Module" }));
var Bd = Object.defineProperty, Kd = Object.getOwnPropertyDescriptor, Lr = (e) => {
  throw TypeError(e);
}, Fr = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Kd(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Bd(t, i, s), s;
}, jd = (e, t, i) => t.has(e) || Lr("Cannot " + i), Vd = (e, t, i) => t.has(e) ? Lr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $n = (e, t, i) => (jd(e, t, "access private method"), i), pa, Ur, Wr;
let di = class extends ao {
  constructor() {
    super(...arguments), Vd(this, pa), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${$n(this, pa, Ur)} aria-label="Choose a file" />
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
            @click=${$n(this, pa, Wr)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
pa = /* @__PURE__ */ new WeakSet();
Ur = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
Wr = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
di.styles = [
  M`
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
Fr([
  f()
], di.prototype, "_json", 2);
di = Fr([
  z("di-import-template-modal")
], di);
const qd = di, Gd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return di;
  },
  default: qd
}, Symbol.toStringTag, { value: "Module" }));
var Hd = Object.defineProperty, Yd = Object.getOwnPropertyDescriptor, Nr = (e) => {
  throw TypeError(e);
}, ft = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Yd(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Hd(t, i, s), s;
}, wo = (e, t, i) => t.has(e) || Nr("Cannot " + i), Be = (e, t, i) => (wo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ua = (e, t, i) => t.has(e) ? Nr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xn = (e, t, i, a) => (wo(e, t, "write to private field"), t.set(e, i), i), P = (e, t, i) => (wo(e, t, "access private method"), i), ma, Ia, Ke, E, ta, Ve, Br, Kr, jr, Vr, qr, $i, Gr, Hr, Yr, Xr, Jr;
let ye = class extends W {
  constructor() {
    super(), ua(this, E), ua(this, ma), ua(this, Ia), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, ua(this, Ke, () => {
      var e;
      return (e = Be(this, ma)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(pe, (e) => {
      xn(this, Ia, e);
    }), this.consumeContext(Ae, (e) => {
      xn(this, ma, e), e && P(this, E, ta).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${P(this, E, qr).call(this)} ${P(this, E, Gr).call(this)} ${P(this, E, Hr).call(this)}
      </umb-body-layout>
    `;
  }
};
ma = /* @__PURE__ */ new WeakMap();
Ia = /* @__PURE__ */ new WeakMap();
Ke = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
ta = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Vn(Be(this, Ke)),
      Ii(Be(this, Ke)).catch(() => []),
      mo(Be(this, Ke)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    P(this, E, Ve).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Ve = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Be(this, Ia)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Br = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await ro(this._pasteJson, "create", Be(this, Ke)), P(this, E, Ve).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, ea(), await P(this, E, ta).call(this);
    } catch (e) {
      P(this, E, Ve).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
Kr = async function(e) {
  try {
    await oo(e.key, Be(this, Ke)), P(this, E, Ve).call(this, "positive", `'${e.name}' duplicated`), ea(), await P(this, E, ta).call(this);
  } catch (t) {
    P(this, E, Ve).call(this, "danger", "The template could not be duplicated", t);
  }
};
jr = async function(e) {
  await ja(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await so(e.key, Be(this, Ke)), P(this, E, Ve).call(this, "positive", `'${e.name}' deleted`), ea(), await P(this, E, ta).call(this);
  } catch (t) {
    P(this, E, Ve).call(this, "danger", "The template could not be deleted", t);
  }
};
Vr = async function(e) {
  try {
    const t = await no(e.key, Be(this, Ke)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    P(this, E, Ve).call(this, "danger", "The template could not be exported", t);
  }
};
qr = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${P(this, E, $i).call(this, "Templates", this._templates.length, "icon-brush")}
        ${P(this, E, $i).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${P(this, E, $i).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${P(this, E, $i).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
$i = function(e, t, i, a = !1) {
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        <uui-icon name=${i}></uui-icon>
        <div class="stat-value">${t}</div>
        <div class="stat-label">${e}</div>
      </uui-box>
    `;
};
Gr = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${j(
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
        <uui-button look="secondary" href=${br("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Hr = function() {
  return r`
      <uui-box headline="Templates">
        <div slot="header-actions" class="header-actions">
          <uui-button
            look="secondary"
            label="Paste a template"
            @click=${() => {
    this._showPaste = !this._showPaste;
  }}>
            Import JSON
          </uui-button>
          <uui-button look="primary" color="positive" href=${Ya()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? P(this, E, Yr).call(this) : p}
        ${this._templates.length === 0 ? P(this, E, Xr).call(this) : P(this, E, Jr).call(this)}
      </uui-box>
    `;
};
Yr = function() {
  return r`
      <div class="paste">
        <uui-textarea
          label="Template JSON"
          placeholder="Paste an exported template"
          rows="6"
          .value=${this._pasteJson}
          @input=${(e) => {
    this._pasteJson = e.target.value;
  }}>
        </uui-textarea>
        <uui-button
          look="primary"
          label="Import the pasted JSON"
          ?disabled=${this._importing || !this._pasteJson.trim()}
          @click=${P(this, E, Br)}>
          Import
        </uui-button>
      </div>
    `;
};
Xr = function() {
  return r`
      <div class="empty">
        <uui-icon name="icon-brush"></uui-icon>
        <h4>No templates yet</h4>
        <p>A template says which document types get a generated image, and what it looks like.</p>
        <uui-button look="primary" color="positive" href=${Ya()} label="Create your first template">
          Create your first template
        </uui-button>
      </div>
    `;
};
Jr = function() {
  return r`
      <div class="cards">
        ${j(
    this._templates,
    (e) => e.key,
    (e) => r`
            <uui-box class="card ${e.isEnabled ? "" : "disabled"}">
              <div slot="headline">
                <a href=${Oi(e.key)}>${e.name}</a>
                ${e.isEnabled ? p : r`<uui-tag look="secondary">Disabled</uui-tag>`}
              </div>

              <dl>
                <dt>Applies to</dt>
                <dd>${e.docTypeAliases.join(", ") || "Nothing yet"}</dd>
                <dt>Writes to</dt>
                <dd>${e.targetPropertyAlias || "Nothing yet"}</dd>
                <dt>Canvas</dt>
                <dd>${e.canvasWidth} × ${e.canvasHeight}, ${e.layerCount} layer(s)</dd>
              </dl>

              <div class="card-actions">
                <uui-button look="secondary" href=${Oi(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => P(this, E, Kr).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => P(this, E, Vr).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => P(this, E, jr).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
ye.styles = M`
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

    .header-actions {
      display: flex;
      gap: var(--uui-size-space-3);
    }

    .paste {
      display: grid;
      gap: var(--uui-size-space-3);
      margin-bottom: var(--uui-size-layout-1);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--uui-size-space-4);
    }

    .card.disabled {
      opacity: 0.7;
    }

    .card a {
      color: inherit;
      text-decoration: none;
    }

    .card a:hover {
      text-decoration: underline;
    }

    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--uui-size-space-1) var(--uui-size-space-4);
      margin: 0 0 var(--uui-size-space-4);
      font-size: 0.9rem;
    }

    dt {
      color: var(--uui-color-text-alt);
    }

    dd {
      margin: 0;
    }

    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--uui-size-space-2);
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

    @media (max-width: 720px) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `;
ft([
  f()
], ye.prototype, "_templates", 2);
ft([
  f()
], ye.prototype, "_fonts", 2);
ft([
  f()
], ye.prototype, "_health", 2);
ft([
  f()
], ye.prototype, "_loading", 2);
ft([
  f()
], ye.prototype, "_importing", 2);
ft([
  f()
], ye.prototype, "_pasteJson", 2);
ft([
  f()
], ye.prototype, "_showPaste", 2);
ye = ft([
  z("di-overview-dashboard")
], ye);
const Xd = ye, Jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return ye;
  },
  default: Xd
}, Symbol.toStringTag, { value: "Module" })), Os = /* @__PURE__ */ new Map(), Qa = (e) => `di-${e}`;
function Zd(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Os.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await cr(e, t), o = new FontFace(Qa(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return Os.set(e, a), a;
}
async function Zr(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => Zd(a, t)));
}
function Qr(e) {
  Os.delete(e);
}
var Qd = Object.defineProperty, eh = Object.getOwnPropertyDescriptor, el = (e) => {
  throw TypeError(e);
}, es = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? eh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Qd(t, i, s), s;
}, $o = (e, t, i) => t.has(e) || el("Cannot " + i), Pe = (e, t, i) => ($o(e, t, "read from private field"), i ? i.call(e) : t.get(e)), wi = (e, t, i) => t.has(e) ? el("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hs = (e, t, i, a) => ($o(e, t, "write to private field"), t.set(e, i), i), L = (e, t, i) => ($o(e, t, "access private method"), i), fa, Ri, Li, Lt, A, tl, fi, ut, As, il, al, ga, sl, ol, nl;
function th(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : ih(e.sourceUrl);
    default:
      return "Media library";
  }
}
function ih(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let dt = class extends W {
  constructor() {
    super(), wi(this, A), wi(this, fa), wi(this, Ri), wi(this, Li), this._fonts = [], this._loading = !0, wi(this, Lt, () => {
      var e;
      return (e = Pe(this, fa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Va, (e) => {
      hs(this, Ri, e);
    }), this.consumeContext(pe, (e) => {
      hs(this, Li, e);
    }), this.consumeContext(Ae, (e) => {
      hs(this, fa, e), e && L(this, A, fi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${L(this, A, As)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${L(this, A, As)}>
                  Add your first font
                </uui-button>
              </div>` : r`${j(this._fonts, (e) => e.key, (e) => L(this, A, sl).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
fa = /* @__PURE__ */ new WeakMap();
Ri = /* @__PURE__ */ new WeakMap();
Li = /* @__PURE__ */ new WeakMap();
Lt = /* @__PURE__ */ new WeakMap();
A = /* @__PURE__ */ new WeakSet();
tl = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
fi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Ii(Pe(this, Lt)), await Zr(this._fonts.map((e) => e.key), Pe(this, Lt));
  } catch (e) {
    L(this, A, ut).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
ut = function(e, t, i) {
  var s;
  const a = i instanceof je ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Pe(this, Li)) == null || s.peek(e, { data: { headline: t, message: a } });
};
As = async function() {
  var i, a;
  if (!Pe(this, Ri)) return;
  const e = Pe(this, Ri).open(this, Ud, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Pe(this, Li)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await L(this, A, fi).call(this));
};
il = async function(e) {
  try {
    await nr(e.key, Pe(this, Lt)), Qr(e.key), L(this, A, ut).call(this, "positive", `'${e.familyName}' refreshed`), await L(this, A, fi).call(this);
  } catch (t) {
    L(this, A, ut).call(this, "danger", "That font could not be refreshed", t);
  }
};
al = async function(e) {
  await ja(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await lr(e.key, Pe(this, Lt)), Qr(e.key), L(this, A, ut).call(this, "positive", `'${e.familyName}' deleted`), await L(this, A, fi).call(this);
  } catch (t) {
    L(this, A, ut).call(this, "danger", "That font could not be deleted", t);
  }
};
ga = async function(e, t, i, a) {
  try {
    await rr(e.key, t, i, Pe(this, Lt), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), L(this, A, ut).call(this, "positive", `'${t}' saved`), await L(this, A, fi).call(this), a != null && a.keepOpen && await L(this, A, tl).call(this);
  } catch (s) {
    L(this, A, ut).call(this, "danger", "The font could not be saved", s);
  }
};
sl = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${th(e)} · weight ${e.weight}
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
                  @click=${() => L(this, A, il).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => L(this, A, al).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Qa(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? L(this, A, nl).call(this, e) : L(this, A, ol).call(this, e)}
      </div>
    `;
};
ol = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${j(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
nl = function(e) {
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
          ${j(
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
      t.splice(a, 1), L(this, A, ga).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), L(this, A, ga).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    L(this, A, ga).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
dt.styles = M`
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
es([
  f()
], dt.prototype, "_fonts", 2);
es([
  f()
], dt.prototype, "_loading", 2);
es([
  f()
], dt.prototype, "_editingKey", 2);
dt = es([
  z("di-fonts-dashboard")
], dt);
const ah = dt, sh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return dt;
  },
  default: ah
}, Symbol.toStringTag, { value: "Module" }));
var oh = Object.defineProperty, nh = Object.getOwnPropertyDescriptor, rl = (e) => {
  throw TypeError(e);
}, ia = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && oh(t, i, s), s;
}, xo = (e, t, i) => t.has(e) || rl("Cannot " + i), et = (e, t, i) => (xo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), da = (e, t, i) => t.has(e) ? rl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), kn = (e, t, i, a) => (xo(e, t, "write to private field"), t.set(e, i), i), qt = (e, t, i) => (xo(e, t, "access private method"), i), ya, Gt, hi, rt, Oa, Ms, ll;
let qe = class extends W {
  constructor() {
    super(), da(this, rt), da(this, ya), da(this, Gt), this._loading = !0, this._busy = !1, da(this, hi, () => {
      var e;
      return (e = et(this, ya)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(pe, (e) => {
      kn(this, Gt, e);
    }), this.consumeContext(Ae, (e) => {
      kn(this, ya, e), e && qt(this, rt, Oa).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => qt(this, rt, Oa).call(this)}>Re-check</uui-button>
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
                ${j(
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
                        ${a.templateKey ? r`<a href=${Oi(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${qt(this, rt, ll).call(this)}
      </umb-body-layout>
    `;
  }
};
ya = /* @__PURE__ */ new WeakMap();
Gt = /* @__PURE__ */ new WeakMap();
hi = /* @__PURE__ */ new WeakMap();
rt = /* @__PURE__ */ new WeakSet();
Oa = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      mo(et(this, hi)),
      gr(et(this, hi)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
Ms = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await yr(et(this, hi)) : await vr(et(this, hi));
    (t = et(this, Gt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = et(this, Gt)) == null || i.peek("warning", { data: { message: o } });
    await qt(this, rt, Oa).call(this);
  } catch (s) {
    (a = et(this, Gt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
ll = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => qt(this, rt, Ms).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => qt(this, rt, Ms).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
qe.styles = M`
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
ia([
  f()
], qe.prototype, "_health", 2);
ia([
  f()
], qe.prototype, "_sync", 2);
ia([
  f()
], qe.prototype, "_loading", 2);
ia([
  f()
], qe.prototype, "_busy", 2);
qe = ia([
  z("di-health-dashboard")
], qe);
const rh = qe, lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return qe;
  },
  default: rh
}, Symbol.toStringTag, { value: "Module" })), cl = 3, ul = 12, dl = 0.1, hl = 0.9;
function ch(e) {
  return Math.max(cl, Math.min(ul, e));
}
function uh(e) {
  return Math.max(dl, Math.min(hl, e));
}
function dh(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = ch(t), s = 0.5 * uh(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let d = 0; d < o; d++) {
    const m = (-90 + d * n) * Math.PI / 180, S = e === "star" && d % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + S * Math.cos(m), y: 0.5 + S * Math.sin(m) });
  }
  return l;
}
function hh(e, t, i) {
  const a = dh(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
const g = {
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
  sides: { min: cl, max: ul },
  innerRatio: { min: dl, max: hl }
}, Aa = { min: 0.1, max: 4 };
function ph(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function pl(e) {
  if (e.kind === "radial") {
    const t = Math.round(Tn(e.centreX ?? 0.5) * 100), i = Math.round(Tn(e.centreY ?? 0.5) * 100);
    return `radial-gradient(ellipse farthest-corner at ${t}% ${i}%, ${e.from}, ${e.to})`;
  }
  return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
}
function Tn(e) {
  return Math.min(1, Math.max(0, e));
}
const ko = M`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function mh(e, t) {
  const i = [], a = t.lockX ? void 0 : Sn(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    fh(t),
    t.threshold
  ), s = t.lockY ? void 0 : Sn(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    gh(t),
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
function fh(e) {
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
function gh(e) {
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
function Sn(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var yh = Object.defineProperty, vh = Object.getOwnPropertyDescriptor, ml = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? vh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && yh(t, i, s), s;
}, To = (e, t, i) => t.has(e) || ml("Cannot " + i), be = (e, t, i) => (To(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ps = (e, t, i) => t.has(e) ? ml("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ms = (e, t, i, a) => (To(e, t, "write to private field"), t.set(e, i), i), G = (e, t, i) => (To(e, t, "access private method"), i), _t, xi, O, ts, So, fl, gl, yl, vl, Eo, Ma, bl, _l, wl, $l, xl, kl, Tl, Sl, El;
const bh = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], fs = 18;
let xe = class extends W {
  constructor() {
    super(...arguments), ps(this, O), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, ps(this, _t), ps(this, xi);
  }
  willUpdate() {
    this._box = G(this, O, fl).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== be(this, xi) && ((t = be(this, _t)) == null || t.disconnect(), ms(this, xi, e), e && (be(this, _t) ?? ms(this, _t, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), be(this, _t).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = be(this, _t)) == null || e.disconnect(), ms(this, xi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${Un({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${K({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...be(this, O, gl) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...G(this, O, Eo).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      G(this, O, bl).call(this, t), G(this, O, Ma).call(this, t);
    }}>
        ${G(this, O, _l).call(this)}
      </div>

      ${this.selected ? G(this, O, Sl).call(this, e) : p}
      ${this.showMeasured && this.measured ? G(this, O, El).call(this) : p}
    `;
  }
};
_t = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
ts = function() {
  return this.resolvedPosition ?? this.layer.position;
};
So = function() {
  return this.layer.rotation ?? 0;
};
fl = function() {
  var s;
  const e = this.layer, t = e.size.width ?? G(this, O, yl).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? G(this, O, vl).call(this), a = Za(be(this, O, ts), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
gl = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
yl = function() {
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
vl = function() {
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
Eo = function(e) {
  const t = be(this, O, So);
  if (t === 0) return {};
  const i = be(this, O, ts);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Ma = function(e, t) {
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
bl = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
_l = function() {
  switch (this.layer.type) {
    case "text":
      return G(this, O, wl).call(this);
    case "image":
      return G(this, O, xl).call(this);
    case "badges":
      return G(this, O, kl).call(this);
    default:
      return G(this, O, Tl).call(this);
  }
};
wl = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || G(this, O, $l).call(this);
  return r`
      <div
        class="text"
        style=${K({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Qa(e.fontKey)}, sans-serif`,
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
$l = function() {
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
xl = function() {
  if (this.layer.type !== "image") return p;
  const e = this.layer.border;
  return r`
      <div
        class="image"
        style=${K({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
kl = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", d = l && o, m = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${K({
    flexDirection: l ? "row" : "column",
    flexWrap: d ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...d ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${j(
    Array.from({ length: Math.max(1, a) }, (S, X) => X),
    (S) => S,
    () => r`
            <div class=${Un({ badge: !0, right: m === "right" })}>
              <div
                class="circle"
                style=${K({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${m === "none" ? p : r`<div
                    class="badge-label"
                    style=${K({
      ...m === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${Qa(t.fontKey)}, sans-serif`,
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
Tl = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? pl(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${K({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${o}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const n = hh(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${K({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${K({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
Sl = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = be(this, O, ts), n = be(this, O, So), l = Ie(this.layer.position, "x") || Ie(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${K({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...G(this, O, Eo).call(this, e) })}>
        <span
          class="tag"
          style=${K(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${j(
    bh,
    (d) => d,
    (d) => r`
                  <span
                    class="handle ${d}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${d}"
                    @pointerdown=${(m) => G(this, O, Ma).call(this, m, d)}>
                  </span>
                `
  )}
              <span class="stalk" style=${K({ height: `${fs}px`, top: `${-fs}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${K({ top: `${-fs}px` })}
                @pointerdown=${(d) => G(this, O, Ma).call(this, d, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${K({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
El = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return r`
      <div
        class="measured"
        style=${K({
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
xe.styles = M`
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
He([
  y({ type: Object })
], xe.prototype, "layer", 2);
He([
  y({ type: Number })
], xe.prototype, "scale", 2);
He([
  y({ type: Boolean, reflect: !0 })
], xe.prototype, "selected", 2);
He([
  y({ type: Object })
], xe.prototype, "measured", 2);
He([
  y({ type: Boolean })
], xe.prototype, "showMeasured", 2);
He([
  y({ type: String })
], xe.prototype, "resolvedText", 2);
He([
  y({ attribute: !1 })
], xe.prototype, "resolvedPosition", 2);
He([
  f()
], xe.prototype, "_box", 2);
xe = He([
  z("di-layer-box")
], xe);
var _h = Object.defineProperty, wh = Object.getOwnPropertyDescriptor, Dl = (e) => {
  throw TypeError(e);
}, Do = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && _h(t, i, s), s;
}, $h = (e, t, i) => t.has(e) || Dl("Cannot " + i), xh = (e, t, i) => t.has(e) ? Dl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), kh = (e, t, i) => ($h(e, t, "access private method"), i), zs, Cl;
let Fi = class extends W {
  constructor() {
    super(...arguments), xh(this, zs), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${j(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => kh(this, zs, Cl).call(this, e)
    )}`;
  }
};
zs = /* @__PURE__ */ new WeakSet();
Cl = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Fi.styles = M`
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
Do([
  y({ type: Array })
], Fi.prototype, "guides", 2);
Do([
  y({ type: Number })
], Fi.prototype, "scale", 2);
Fi = Do([
  z("di-guides")
], Fi);
var Th = Object.defineProperty, Sh = Object.getOwnPropertyDescriptor, Pl = (e) => {
  throw TypeError(e);
}, aa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Sh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Th(t, i, s), s;
}, Eh = (e, t, i) => t.has(e) || Pl("Cannot " + i), Dh = (e, t, i) => t.has(e) ? Pl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), En = (e, t, i) => (Eh(e, t, "access private method"), i), va, Rs;
let Z = class extends W {
  constructor() {
    super(...arguments), Dh(this, va), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    En(this, va, Rs).call(this, "top"), En(this, va, Rs).call(this, "left");
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
va = /* @__PURE__ */ new WeakSet();
Rs = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : Z.thickness) * o, t.height = (e === "top" ? Z.thickness : s) * o, t.style.width = `${e === "top" ? s : Z.thickness}px`, t.style.height = `${e === "top" ? Z.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const d = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, S = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(d, Z.thickness - S), i.lineTo(d, Z.thickness)) : (i.moveTo(Z.thickness - S, d), i.lineTo(Z.thickness, d)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), d + 2, 9) : (i.save(), i.translate(9, d - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
Z.thickness = 20;
Z.styles = M`
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
aa([
  y({ type: Number })
], Z.prototype, "canvasWidth", 2);
aa([
  y({ type: Number })
], Z.prototype, "canvasHeight", 2);
aa([
  y({ type: Number })
], Z.prototype, "scale", 2);
aa([
  y({ type: Object })
], Z.prototype, "pointer", 2);
Z = aa([
  z("di-rulers")
], Z);
var Ch = Object.defineProperty, Ph = Object.getOwnPropertyDescriptor, Il = (e) => {
  throw TypeError(e);
}, ne = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ph(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ch(t, i, s), s;
}, Co = (e, t, i) => t.has(e) || Il("Cannot " + i), R = (e, t, i) => (Co(e, t, "read from private field"), i ? i.call(e) : t.get(e)), re = (e, t, i) => t.has(e) ? Il("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ba = (e, t, i, a) => (Co(e, t, "write to private field"), t.set(e, i), i), I = (e, t, i) => (Co(e, t, "access private method"), i), wt, ki, ct, C, Po, Ls, Fs, is, Io, Us, Ol, Al, Oo, Ml, zl, Ws, _a, Rl, Ll, Kt, Ao, Ns, Bs, Ks, Fl, js, Vs, qs, Ul;
const Ih = 6, Wl = 20, Oh = 2, Ah = 15, Mh = 0.1;
let ie = class extends W {
  constructor() {
    super(...arguments), re(this, C), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, re(this, wt), re(this, ki), re(this, ct, /* @__PURE__ */ new Map()), re(this, Ws, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = I(this, C, Io).call(this, t), a = I(this, C, Us).call(this, t), s = I(this, C, Ol).call(this, t), o = I(this, C, is).call(this, e.detail.startX, e.detail.startY);
      ba(this, wt, {
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
    }), re(this, _a, (e) => {
      var la, Qo;
      this._pointer = I(this, C, Fs).call(this, e.clientX, e.clientY);
      const t = R(this, wt);
      if (!t) return;
      const i = this.template.layers.find((vi) => vi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        I(this, C, Ll).call(this, i, t, e);
        return;
      }
      const o = Ie(i.position, "x"), n = Ie(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        I(this, C, Rl).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let d = t.handle ? I(this, C, Ao).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (d = { ...d, x: t.startBox.x, width: (la = t.handle) != null && la.includes("w") ? t.startBox.width : d.width }), n && (d = { ...d, y: t.startBox.y, height: (Qo = t.handle) != null && Qo.includes("n") ? t.startBox.height : d.height });
      const m = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, S = l !== 0 ? { x: d.x + m.x, y: d.y + m.y, width: t.startExtent.width, height: t.startExtent.height } : d, Te = this.snapEnabled && !e.altKey ? mh(S, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((vi) => vi.key !== i.key).map((vi) => I(this, C, Us).call(this, vi)),
        threshold: Ih / this.scale,
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
      this._guides = Te.guides;
      const Me = l !== 0 ? { ...d, x: Te.box.x - m.x, y: Te.box.y - m.y } : Te.box, Ze = Vu(Me, i.position);
      o && (Ze.x = i.position.x), n && (Ze.y = i.position.y);
      const ze = { position: Ze };
      t.handle && (ze.size = {
        width: Math.max(1, Math.round(Me.width)),
        height: Math.max(1, Math.round(Me.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: ze } })
      );
    }), re(this, Kt, () => {
      if (!R(this, wt)) return;
      const e = R(this, wt).moved;
      ba(this, wt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), re(this, Ns, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), re(this, Bs, () => {
      this._dropTarget = !1;
    }), re(this, Ks, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = I(this, C, Fs).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: I(this, C, Fl).call(this, e) }
        })
      );
    }), re(this, js, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), re(this, Vs, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Er(t.position)) && this.requestUpdate();
    }), re(this, qs, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), ba(this, ki, new ResizeObserver(() => I(this, C, Ls).call(this))), R(this, ki).observe(this), window.addEventListener("pointermove", R(this, _a)), window.addEventListener("pointerup", R(this, Kt)), window.addEventListener("pointercancel", R(this, Kt));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = R(this, ki)) == null || e.disconnect(), window.removeEventListener("pointermove", R(this, _a)), window.removeEventListener("pointerup", R(this, Kt)), window.removeEventListener("pointercancel", R(this, Kt));
  }
  updated(e) {
    I(this, C, Ls).call(this), e.has("zoom") && I(this, C, Po).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = R(this, ct).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    I(this, C, Al).call(this);
    const s = this.showRulers ? Wl : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${R(this, js)}
        @dragover=${R(this, Ns)}
        @dragleave=${R(this, Bs)}
        @drop=${R(this, Ks)}
        @di-layer-drag-start=${R(this, Ws)}
        @di-layer-box-resize=${R(this, Vs)}>
        <div
          class="artboard"
          style=${K({
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
            style=${K({
      background: e.backgroundGradient ? pl(e.backgroundGradient) : e.background
    })}
            @pointerdown=${R(this, qs)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${K({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${j(
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
                  .resolvedPosition=${(l = R(this, ct).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? I(this, C, Ul).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
wt = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakMap();
ct = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakSet();
Po = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Ls = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Wl : 0) + Oh, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, I(this, C, Po).call(this));
};
Fs = function(e, t) {
  const i = I(this, C, is).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
is = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
Io = function(e) {
  const t = R(this, ct).get(e.key);
  if (t) return t.box;
  const i = I(this, C, Oo).call(this, e), a = Za(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Us = function(e) {
  const t = R(this, ct).get(e.key);
  return t ? t.extent : Sr(I(this, C, Io).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Ol = function(e) {
  var t;
  return ((t = R(this, ct).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Al = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  ba(this, ct, Ju(
    this.template.layers,
    (i) => I(this, C, Oo).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Oo = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? I(this, C, Ml).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? I(this, C, zl).call(this, e, i)
  };
};
Ml = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
zl = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Ws = /* @__PURE__ */ new WeakMap();
_a = /* @__PURE__ */ new WeakMap();
Rl = function(e, t, i, a, s, o, n, l) {
  const d = t.startRotation, m = t.startPosition, S = qu(a, s, 0, 0, d);
  let X = I(this, C, Ao).call(this, t.startBox, i, S.x, S.y, o);
  n && (X = { ...X, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : X.width }), l && (X = { ...X, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : X.height });
  const Te = Math.max(1, Math.round(X.width)), Me = Math.max(1, Math.round(X.height)), Ze = fo(X.x, X.y, Te, Me, m.anchor), ze = Vt(Ze.x, Ze.y, m.x, m.y, d), la = {
    ...e.position,
    x: n ? e.position.x : Math.round(ze.x),
    y: l ? e.position.y : Math.round(ze.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: la, size: { width: Te, height: Me } } }
    })
  );
};
Ll = function(e, t, i) {
  const a = t.startPosition, s = I(this, C, is).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, d = i.shiftKey ? Ah : Mh, m = Tr(Math.round(l / d) * d);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
Kt = /* @__PURE__ */ new WeakMap();
Ao = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: d } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, d = e.height - a), t.includes("s") && (d = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(d - e.height) ? d = l / m : l = d * m, t.includes("n") && (n = e.y + e.height - d), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, d) };
};
Ns = /* @__PURE__ */ new WeakMap();
Bs = /* @__PURE__ */ new WeakMap();
Ks = /* @__PURE__ */ new WeakMap();
Fl = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
js = /* @__PURE__ */ new WeakMap();
Vs = /* @__PURE__ */ new WeakMap();
qs = /* @__PURE__ */ new WeakMap();
Ul = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${K({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
ie.styles = M`
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
      ${ko}
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
ne([
  y({ type: Object })
], ie.prototype, "template", 2);
ne([
  y({ type: String })
], ie.prototype, "selectedLayerKey", 2);
ne([
  y({ type: Object })
], ie.prototype, "baseImageUrl", 2);
ne([
  y({ type: Array })
], ie.prototype, "serverBounds", 2);
ne([
  y({ type: Boolean })
], ie.prototype, "showMeasured", 2);
ne([
  y({ type: Boolean })
], ie.prototype, "snapEnabled", 2);
ne([
  y({ type: Boolean })
], ie.prototype, "showRulers", 2);
ne([
  y({ type: Boolean })
], ie.prototype, "showSafeArea", 2);
ne([
  y({ type: Number })
], ie.prototype, "zoom", 2);
ne([
  f()
], ie.prototype, "_fitScale", 2);
ne([
  f()
], ie.prototype, "_guides", 2);
ne([
  f()
], ie.prototype, "_pointer", 2);
ne([
  f()
], ie.prototype, "_dropTarget", 2);
ie = ne([
  z("di-designer-canvas")
], ie);
var zh = Object.defineProperty, Rh = Object.getOwnPropertyDescriptor, Nl = (e) => {
  throw TypeError(e);
}, Mo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && zh(t, i, s), s;
}, Bl = (e, t, i) => t.has(e) || Nl("Cannot " + i), Lh = (e, t, i) => (Bl(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Fh = (e, t, i) => t.has(e) ? Nl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ce = (e, t, i) => (Bl(e, t, "access private method"), i), ue, Kl, jl, Vl, ql, Gl, $t;
const Dn = {
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
let Ui = class extends W {
  constructor() {
    super(...arguments), Fh(this, ue), this.properties = [], this._search = "";
  }
  render() {
    const e = Uh(Lh(this, ue, Kl));
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

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : j(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => Ce(this, ue, ql).call(this, t, i)
    )}

        ${Ce(this, ue, Gl).call(this)}
      </div>
    `;
  }
};
ue = /* @__PURE__ */ new WeakSet();
Kl = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
jl = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Vl = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
ql = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${j(
    t,
    (i) => i.alias,
    (i) => Ce(this, ue, $t).call(
      this,
      i.name,
      Dn[i.classification] ?? Dn.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Gl = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Ce(this, ue, $t).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Ce(this, ue, $t).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Ce(this, ue, $t).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Ce(this, ue, $t).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Ce(this, ue, $t).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
$t = function(e, t, i, a, s) {
  const o = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(n) => Ce(this, ue, Vl).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => Ce(this, ue, jl).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Ui.styles = M`
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
Mo([
  y({ type: Array })
], Ui.prototype, "properties", 2);
Mo([
  f()
], Ui.prototype, "_search", 2);
Ui = Mo([
  z("di-property-palette")
], Ui);
function Uh(e) {
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
function Wh(e) {
  return e.backgroundGradient ? "gradient" : Nh(e.background) ? "transparent" : "colour";
}
function Nh(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function Bh(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
function Kh(e) {
  const t = Vh(e);
  return { root: t[0] ?? "", tail: t.slice(1).join(".") };
}
function jh(e, t) {
  const i = (e ?? "").trim(), a = (t ?? "").trim();
  return i ? a ? `${i}.${a}` : i : "";
}
const Vh = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0);
var qh = Object.defineProperty, Gh = Object.getOwnPropertyDescriptor, Hl = (e) => {
  throw TypeError(e);
}, as = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && qh(t, i, s), s;
}, Yl = (e, t, i) => t.has(e) || Hl("Cannot " + i), tt = (e, t, i) => (Yl(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Hh = (e, t, i) => t.has(e) ? Hl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Di = (e, t, i) => (Yl(e, t, "access private method"), i), se, Wi, Ci, ss, Xl, Jl;
let pi = class extends W {
  constructor() {
    super(...arguments), Hh(this, se), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${tt(this, se, Wi)};opacity:${tt(this, se, Ci)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Di(this, se, ss).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${tt(this, se, Wi)}
                  @input=${(e) => Di(this, se, Xl).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(tt(this, se, Ci))}
                    @input=${(e) => Di(this, se, Jl).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(tt(this, se, Ci) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
se = /* @__PURE__ */ new WeakSet();
Wi = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
Ci = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
ss = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Xl = function(e) {
  const t = tt(this, se, Ci);
  Di(this, se, ss).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${Zl(t)}`);
};
Jl = function(e) {
  Di(this, se, ss).call(this, e >= 0.999 ? tt(this, se, Wi).toUpperCase() : `${tt(this, se, Wi).toUpperCase()}${Zl(e)}`);
};
pi.styles = M`
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
as([
  y({ type: String })
], pi.prototype, "value", 2);
as([
  y({ type: String })
], pi.prototype, "label", 2);
as([
  f()
], pi.prototype, "_open", 2);
pi = as([
  z("di-colour-input")
], pi);
const Zl = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Yh = Object.defineProperty, Xh = Object.getOwnPropertyDescriptor, Ql = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Xh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Yh(t, i, s), s;
};
const Cn = {
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
let za = class extends W {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${j(
      kr,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Cn[e]}
              title=${Cn[e]}
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
za.styles = M`
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
Ql([
  y({ type: String })
], za.prototype, "value", 2);
za = Ql([
  z("di-anchor-picker")
], za);
var Jh = Object.defineProperty, Zh = Object.getOwnPropertyDescriptor, ec = (e) => {
  throw TypeError(e);
}, gt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Jh(t, i, s), s;
}, Qh = (e, t, i) => t.has(e) || ec("Cannot " + i), ep = (e, t, i) => t.has(e) ? ec("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), tp = (e, t, i) => (Qh(e, t, "access private method"), i), Gs, tc;
let Oe = class extends W {
  constructor() {
    super(...arguments), ep(this, Gs), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${tp(this, Gs, tc)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
Gs = /* @__PURE__ */ new WeakSet();
tc = function(e) {
  const t = e.target, i = t.value, a = ph(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Oe.styles = M`
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
gt([
  y({ type: Number })
], Oe.prototype, "value", 2);
gt([
  y({ type: String })
], Oe.prototype, "label", 2);
gt([
  y({ type: String })
], Oe.prototype, "suffix", 2);
gt([
  y({ type: Number })
], Oe.prototype, "step", 2);
gt([
  y({ type: Number })
], Oe.prototype, "min", 2);
gt([
  y({ type: Number })
], Oe.prototype, "max", 2);
gt([
  y({ type: String })
], Oe.prototype, "placeholder", 2);
Oe = gt([
  z("di-number-field")
], Oe);
var ip = Object.defineProperty, ap = Object.getOwnPropertyDescriptor, ic = (e) => {
  throw TypeError(e);
}, gi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ap(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ip(t, i, s), s;
}, sp = (e, t, i) => t.has(e) || ic("Cannot " + i), op = (e, t, i) => t.has(e) ? ic("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (sp(e, t, "access private method"), i), u, b, _e, ac, sc, oc, zo, Hs, nc, rc, lc, cc, uc, dc, hc, Ys, pc, wa, mc, fc, yi, Xs, Ro, gc;
const Pn = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let ht = class extends W {
  constructor() {
    super(...arguments), op(this, u), this.properties = [], this.linkedProperties = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, u, nc).call(this, this.layer) : h(this, u, ac).call(this)}</div>` : p;
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
_e = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
ac = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => h(this, u, _e).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => h(this, u, _e).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${h(this, u, sc).call(this, e)}

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${yc(e.baseImage.kind)}
              @change=${(t) => h(this, u, _e).call(this, {
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
                @change=${(t) => h(this, u, _e).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${h(this, u, yi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, u, _e).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${te(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => h(this, u, _e).call(this, { baseImageFit: t.target.value })}>
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
sc = function(e) {
  const t = Wh(e);
  return r`
      <label class="field">
        <span>Fill</span>
        <uui-select
          .value=${t}
          .options=${te(["colour", "gradient", "transparent"], t)}
          @change=${(i) => h(this, u, oc).call(this, e, i.target.value)}>
        </uui-select>
      </label>

      ${t === "colour" ? r`<label class="field">
            <span>Colour</span>
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => h(this, u, _e).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </label>` : p}

      ${t === "gradient" && e.backgroundGradient ? h(this, u, zo).call(this, e.backgroundGradient, (i) => h(this, u, _e).call(this, { backgroundGradient: i })) : p}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : p}
    `;
};
oc = function(e, t) {
  if (t === "gradient") {
    h(this, u, _e).call(this, { backgroundGradient: e.backgroundGradient ?? xr() });
    return;
  }
  h(this, u, _e).call(this, {
    background: Bh(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
zo = function(e, t) {
  return r`
      <label class="field">
        <span>Type</span>
        <uui-select
          .value=${e.kind}
          .options=${te(["linear", "radial"], e.kind)}
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
            ${h(this, u, Hs).call(this, "Centre X", e.centreX, (i) => t({ ...e, centreX: i }))}
            ${h(this, u, Hs).call(this, "Centre Y", e.centreY, (i) => t({ ...e, centreY: i }))}
          </div>` : r`<di-number-field
            .min=${g.gradientAngle.min}
            .max=${g.gradientAngle.max}
            label="Angle"
            suffix="°"
            .value=${e.angle}
            @change=${(i) => t({ ...e, angle: i.detail.value ?? 180 })}>
          </di-number-field>`}
    `;
};
Hs = function(e, t, i) {
  return r`<di-number-field
      .min=${g.gradientCentre.min * 100}
      .max=${g.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
nc = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, u, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, u, rc).call(this, e) : p}
      ${e.type === "text" ? h(this, u, lc).call(this, e) : p}
      ${e.type === "image" ? h(this, u, cc).call(this, e) : p}
      ${e.type === "badges" ? h(this, u, uc).call(this, e) : p}
      ${e.type === "rect" ? h(this, u, dc).call(this, e) : p}
      ${h(this, u, hc).call(this, e)} ${h(this, u, fc).call(this, e)}
    `;
};
rc = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${te(
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
              ${h(this, u, yi).call(this, t.propertyAlias ?? "", (i) => h(this, u, b).call(this, { binding: { ...t, propertyAlias: i } }))}
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
lc = function(e) {
  const t = e.style, i = (a) => h(this, u, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, u, Ro).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, u, gc).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

        <div class="pair">
          <di-number-field
            .min=${g.fontSize.min}
            .max=${g.fontSize.max}
            label="Size"
            .value=${t.fontSize}
            @change=${(a) => i({ fontSize: a.detail.value ?? t.fontSize })}>
          </di-number-field>
          <label class="field">
            <span>Weight</span>
            <uui-select
              .value=${t.fontStyle}
              .options=${te(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${te(["left", "centre", "right"], t.textAlign)}
            @change=${(a) => i({ textAlign: a.target.value })}>
          </uui-select>
        </label>

        <div class="pair">
          <di-number-field
            .min=${g.lineSpacing.min}
            .max=${g.lineSpacing.max}
            label="Line spacing"
            suffix="×"
            step="0.05"
            .value=${t.lineSpacing}
            @change=${(a) => i({ lineSpacing: a.detail.value ?? 1 })}>
          </di-number-field>
          <di-number-field
            .min=${g.letterSpacing.min}
            .max=${g.letterSpacing.max}
            label="Letter spacing"
            .value=${t.letterSpacing}
            @change=${(a) => i({ letterSpacing: a.detail.value ?? 0 })}>
          </di-number-field>
        </div>

        <div class="pair">
          <di-number-field
            .min=${g.maxLines.min}
            .max=${g.maxLines.max}
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
              .options=${te(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${te(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
cc = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${yc(t.kind)}
            @change=${(a) => h(this, u, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, yi).call(
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
            .options=${te(["cover", "contain", "stretch"], e.fit)}
            @change=${(a) => h(this, u, b).call(this, { fit: a.target.value })}>
          </uui-select>
        </label>

        <di-number-field
          .min=${g.cornerRadius.min}
          .max=${g.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => h(this, u, b).call(this, { cornerRadius: a.detail.value ?? 0 })}>
        </di-number-field>

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              .min=${g.borderWidth.min}
              .max=${g.borderWidth.max}
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
uc = function(e) {
  const t = (s) => h(this, u, b).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, u, b).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, u, b).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, u, yi).call(this, e.itemsPropertyAlias, (s) => h(this, u, b).call(this, { itemsPropertyAlias: s }))}
        </label>

        <div class="pair">
          <di-number-field
            .min=${g.maxItems.min}
            .max=${g.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => h(this, u, b).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${g.gap.min}
            .max=${g.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => h(this, u, b).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${e.direction}
            .options=${te(["horizontal", "vertical"], e.direction)}
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
                      .min=${g.rowGap.min}
                      .max=${g.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => h(this, u, b).call(this, { rowGap: s.detail.value ?? 20 })}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  ` : p}
            ` : p}

        <div class="pair">
          <di-number-field
            .min=${g.circleSize.min}
            .max=${g.circleSize.max}
            label="Circle size"
            .value=${e.badge.size}
            @change=${(s) => t({ size: s.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
            .min=${g.iconSize.min}
            .max=${g.iconSize.max}
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
              .min=${g.borderWidth.min}
              .max=${g.borderWidth.max}
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
            .options=${te(["below", "right", "none"], e.label.position, {
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
                  .options=${h(this, u, Ro).call(this, e.label.fontKey)}
                  @change=${(s) => i({ fontKey: s.target.value })}>
                </uui-select>
              </label>

              <div class="pair">
                <di-number-field
                  .min=${g.labelSize.min}
                  .max=${g.labelSize.max}
                  label="Label size"
                  .value=${e.label.fontSize}
                  @change=${(s) => i({ fontSize: s.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
                  .min=${g.labelGap.min}
                  .max=${g.labelGap.max}
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
                  .options=${te(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
dc = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${te(["rectangle", "ellipse", "polygon", "star"], t)}
            @change=${(s) => h(this, u, b).call(this, { shape: s.target.value })}>
          </uui-select>
        </label>

        ${t === "polygon" || t === "star" ? r`
              <div class="pair">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  .min=${g.sides.min}
                  .max=${g.sides.max}
                  .value=${e.sides ?? 5}
                  @change=${(s) => h(this, u, b).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${g.innerRatio.min}
                      .max=${g.innerRatio.max}
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
    gradient: s.target.checked ? xr() : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? h(this, u, zo).call(this, e.gradient, (s) => h(this, u, b).call(this, { gradient: s })) : p}

        ${t === "rectangle" ? r`<di-number-field
            .min=${g.cornerRadius.min}
            .max=${g.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => h(this, u, b).call(this, { cornerRadius: s.detail.value ?? 0 })}>
            </di-number-field>` : p}

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              .min=${g.borderWidth.min}
              .max=${g.borderWidth.max}
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
hc = function(e) {
  const t = Ie(e.position, "x"), i = Ie(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, u, Ys).call(this, e, "x")} ${h(this, u, Ys).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, u, mc).call(this, e, s.detail.value)}>
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
            @change=${(s) => h(this, u, b).call(this, { rotation: Tr(s.detail.value ?? 0) })}>
          </di-number-field>
          <small class="hint">Clockwise, around the anchor point. Drag the handle above the selection on the canvas; hold Shift for 15° steps.</small>
        </div>

        <div class="pair">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            placeholder="Auto"
            .value=${e.size.width ?? null}
            @change=${(s) => h(this, u, b).call(this, { size: { ...e.size, width: s.detail.value } })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => h(this, u, b).call(this, { size: { ...e.size, height: s.detail.value } })}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
Ys = function(e, t) {
  const i = Ie(e.position, t), a = Da(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => h(this, u, pc).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => h(this, u, wa).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${te(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => h(this, u, wa).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${g.referenceGap.min}
                .max=${g.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => h(this, u, wa).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? g.x.min : g.y.min}
                .max=${t === "x" ? g.x.max : g.y.max}
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
pc = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Ie(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && h(this, u, b).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Gu
      }
    }
  });
};
wa = function(e, t, i) {
  const a = Da(e.position, t);
  a && h(this, u, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
mc = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? ju(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, u, b).call(this, { position: s });
};
fc = function(e) {
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
          .min=${g.opacity.min}
          .max=${g.opacity.max}
          .value=${e.opacity}
          @change=${(t) => h(this, u, b).call(this, { opacity: t.detail.value ?? 1 })}>
        </di-number-field>

        <label class="field">
          <span>Show this layer</span>
          <uui-select
            .value=${e.visibility.rule}
            .options=${te(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
              ${h(this, u, yi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, u, b).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
yi = function(e, t, i = {}) {
  const { root: a, tail: s } = Kh(e), o = this.linkedProperties[a] ?? [], n = this.properties.some(
    (m) => m.alias === a && m.classification === "content"
  ), l = !!a && (n || !!s), d = h(this, u, Xs).call(this, Pn(this.properties, i.root), a, (m) => t(m));
  return l ? r`
      <div class="path">
        ${d}
        <span class="path-hop" aria-hidden="true">›</span>
        ${h(this, u, Xs).call(this, Pn(o, i.tail), s, (m) => t(jh(a, m)))}
      </div>
    ` : d;
};
Xs = function(e, t, i) {
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
Ro = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
gc = function(e, t, i) {
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
ht.styles = M`
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
gi([
  y({ type: Object })
], ht.prototype, "template", 2);
gi([
  y({ type: Object })
], ht.prototype, "layer", 2);
gi([
  y({ type: Array })
], ht.prototype, "properties", 2);
gi([
  y({ type: Object })
], ht.prototype, "linkedProperties", 2);
gi([
  y({ type: Array })
], ht.prototype, "fonts", 2);
ht = gi([
  z("di-layer-inspector")
], ht);
function te(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function yc(e) {
  return te(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var np = Object.defineProperty, rp = Object.getOwnPropertyDescriptor, vc = (e) => {
  throw TypeError(e);
}, sa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? rp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && np(t, i, s), s;
}, lp = (e, t, i) => t.has(e) || vc("Cannot " + i), cp = (e, t, i) => t.has(e) ? vc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Se = (e, t, i) => (lp(e, t, "access private method"), i), me, xt, bc, _c, wc, $c;
const up = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Ft = class extends W {
  constructor() {
    super(...arguments), cp(this, me), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Se(this, me, wc)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : j(
      e,
      (t) => t.key,
      (t, i) => Se(this, me, $c).call(this, t, i)
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
xt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
bc = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
_c = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
wc = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Se(this, me, xt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
$c = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Se(this, me, bc).call(this, a, e.key)}
        @dragover=${(a) => Se(this, me, _c).call(this, a, t)}
        @click=${() => Se(this, me, xt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${up[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, me, xt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, me, xt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, me, xt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, me, xt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Ft.styles = M`
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
sa([
  y({ type: Array })
], Ft.prototype, "layers", 2);
sa([
  y({ type: String })
], Ft.prototype, "selectedLayerKey", 2);
sa([
  f()
], Ft.prototype, "_dragKey", 2);
sa([
  f()
], Ft.prototype, "_dropIndex", 2);
Ft = sa([
  z("di-layers-panel")
], Ft);
var dp = Object.defineProperty, hp = Object.getOwnPropertyDescriptor, xc = (e) => {
  throw TypeError(e);
}, Ye = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && dp(t, i, s), s;
}, Lo = (e, t, i) => t.has(e) || xc("Cannot " + i), pp = (e, t, i) => (Lo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), In = (e, t, i) => t.has(e) ? xc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), mp = (e, t, i, a) => (Lo(e, t, "write to private field"), t.set(e, i), i), oe = (e, t, i) => (Lo(e, t, "access private method"), i), J, Le, Ra, kc, Tc, Ti;
let ke = class extends W {
  constructor() {
    super(...arguments), In(this, J), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, In(this, Ra, 100);
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
            @click=${() => oe(this, J, Le).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${Aa.min * 100}
            .max=${Aa.max * 100}
            .value=${oe(this, J, kc).call(this)}
            @change=${oe(this, J, Tc)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => oe(this, J, Le).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => oe(this, J, Le).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${oe(this, J, Ti).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${oe(this, J, Ti).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${oe(this, J, Ti).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${oe(this, J, Ti).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => oe(this, J, Le).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => oe(this, J, Le).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => oe(this, J, Le).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
J = /* @__PURE__ */ new WeakSet();
Le = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Ra = /* @__PURE__ */ new WeakMap();
kc = function() {
  return this.matches(":focus-within") || mp(this, Ra, Math.round(this.effectiveScale * 100)), pp(this, Ra);
};
Tc = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && oe(this, J, Le).call(this, "di-zoom-change", { zoom: t / 100 });
};
Ti = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => oe(this, J, Le).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
ke.styles = M`
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
Ye([
  y({ type: Number })
], ke.prototype, "effectiveScale", 2);
Ye([
  y({ type: Boolean })
], ke.prototype, "snapEnabled", 2);
Ye([
  y({ type: Boolean })
], ke.prototype, "showRulers", 2);
Ye([
  y({ type: Boolean })
], ke.prototype, "showSafeArea", 2);
Ye([
  y({ type: Boolean })
], ke.prototype, "showMeasured", 2);
Ye([
  y({ type: Boolean })
], ke.prototype, "canUndo", 2);
Ye([
  y({ type: Boolean })
], ke.prototype, "canRedo", 2);
Ye([
  y({ type: Boolean })
], ke.prototype, "previewing", 2);
ke = Ye([
  z("di-canvas-toolbar")
], ke);
var fp = Object.defineProperty, gp = Object.getOwnPropertyDescriptor, Sc = (e) => {
  throw TypeError(e);
}, oa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && fp(t, i, s), s;
}, Fo = (e, t, i) => t.has(e) || Sc("Cannot " + i), ee = (e, t, i) => (Fo(e, t, "read from private field"), t.get(e)), yt = (e, t, i) => t.has(e) ? Sc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), At = (e, t, i, a) => (Fo(e, t, "write to private field"), t.set(e, i), i), Ne = (e, t, i) => (Fo(e, t, "access private method"), i), it, Ht, Yt, Mt, La, Fa, we, Uo, $a, Wo, Js;
const yp = 400;
let Ut = class extends W {
  constructor() {
    super(), yt(this, we), yt(this, it), yt(this, Ht), yt(this, Yt), yt(this, Mt), yt(this, La), yt(this, Fa, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(Nt, (e) => {
      At(this, it, e), e && (this.observe(e.template, (t) => {
        t && Ne(this, we, $a).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        At(this, La, t);
        const i = (a = ee(this, it)) == null ? void 0 : a.getData();
        i && Ne(this, we, $a).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        At(this, Fa, t ?? !0);
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
    const e = (t = ee(this, it)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(ee(this, Ht)), this._collapsed = !1, Ne(this, we, Wo).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(ee(this, Ht)), (e = ee(this, Yt)) == null || e.abort(), Ne(this, we, Uo).call(this);
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
        const t = (e = ee(this, it)) == null ? void 0 : e.getData();
        t && Ne(this, we, $a).call(this, t);
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
it = /* @__PURE__ */ new WeakMap();
Ht = /* @__PURE__ */ new WeakMap();
Yt = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
La = /* @__PURE__ */ new WeakMap();
Fa = /* @__PURE__ */ new WeakMap();
we = /* @__PURE__ */ new WeakSet();
Uo = function() {
  ee(this, Mt) && (URL.revokeObjectURL(ee(this, Mt)), At(this, Mt, void 0));
};
$a = function(e) {
  this._collapsed || (window.clearTimeout(ee(this, Ht)), At(this, Ht, window.setTimeout(() => void Ne(this, we, Wo).call(this, e), yp)));
};
Wo = async function(e) {
  var t;
  if (ee(this, it)) {
    (t = ee(this, Yt)) == null || t.abort(), At(this, Yt, new AbortController()), Ne(this, we, Js).call(this, !0), this._error = void 0;
    try {
      const i = await co(
        e,
        {
          signal: ee(this, Yt).signal,
          contentKey: ee(this, La),
          useSampleData: ee(this, Fa)
        },
        ee(this, it).getToken
      );
      Ne(this, we, Uo).call(this), At(this, Mt, URL.createObjectURL(i)), this._url = ee(this, Mt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ne(this, we, Js).call(this, !1);
    }
  }
};
Js = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Ut.styles = M`
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
      ${ko}
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
oa([
  f()
], Ut.prototype, "_url", 2);
oa([
  f()
], Ut.prototype, "_loading", 2);
oa([
  f()
], Ut.prototype, "_error", 2);
oa([
  f()
], Ut.prototype, "_collapsed", 2);
Ut = oa([
  z("di-preview-strip")
], Ut);
var vp = Object.defineProperty, bp = Object.getOwnPropertyDescriptor, Ec = (e) => {
  throw TypeError(e);
}, Y = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && vp(t, i, s), s;
}, No = (e, t, i) => t.has(e) || Ec("Cannot " + i), v = (e, t, i) => (No(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vt = (e, t, i) => t.has(e) ? Ec("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pi = (e, t, i, a) => (No(e, t, "write to private field"), t.set(e, i), i), ae = (e, t, i) => (No(e, t, "access private method"), i), k, Ni, Bi, Ki, Xt, F, Zs, Bo, Dc, Cc, Qs, Pc, Ic, Oc, eo, Ac, Mc, zc, Rc, Ko, Lc, xa;
const _p = 400;
let U = class extends W {
  constructor() {
    super(), vt(this, F), vt(this, k), vt(this, Ni), vt(this, Bi), vt(this, Ki), vt(this, Xt), this._properties = [], this._linkedProperties = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, vt(this, xa, (e) => {
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
      const s = v(this, F, Zs);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), ae(this, F, Qs).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, d = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, m = Ie(s.position, "x") ? 0 : l, S = Ie(s.position, "y") ? 0 : d;
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
    }), this.consumeContext(Va, (e) => {
      Pi(this, Ni, e);
    }), this.consumeContext(pe, (e) => {
      Pi(this, Bi, e);
    }), this.consumeContext(Nt, (e) => {
      Pi(this, k, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (ae(this, F, Pc).call(this, t), ae(this, F, Ic).call(this, t), ae(this, F, Oc).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", v(this, xa));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", v(this, xa)), window.clearTimeout(v(this, Ki)), (e = v(this, Xt)) == null || e.abort();
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
        @di-layer-delete=${(e) => ae(this, F, Qs).call(this, e.detail.key)}
        @di-layer-detach=${(e) => ae(this, F, Cc).call(this, e.detail.key, e.detail.axis)}
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
        @di-palette-add=${(e) => ae(this, F, eo).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => ae(this, F, eo).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-pick-base-image=${ae(this, F, zc)}
        @di-pick-layer-image=${(e) => ae(this, F, Rc).call(this, e.detail.key)}
        @di-use-image-size=${ae(this, F, Lc)}
        @di-request-preview=${() => {
      var e;
      return (e = v(this, F, Dc)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(Aa.min, Math.min(Aa.max, e.detail.zoom));
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
            .layer=${v(this, F, Zs)}
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
Ni = /* @__PURE__ */ new WeakMap();
Bi = /* @__PURE__ */ new WeakMap();
Ki = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
F = /* @__PURE__ */ new WeakSet();
Zs = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
Bo = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Dc = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Cc = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = v(this, F, Bo)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = v(this, k)) == null || n.updateLayer(e, { position: ks(i.position, t, a) });
};
Qs = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = v(this, F, Bo)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = v(this, k)) == null || s.removeLayer(e, t);
};
Pc = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && v(this, k) && await Zr(t, v(this, k).getToken);
};
Ic = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !v(this, k)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await ho(t.mediaKey, v(this, k).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Oc = function() {
  window.clearTimeout(v(this, Ki)), Pi(this, Ki, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !v(this, k))) {
      (t = v(this, Xt)) == null || t.abort(), Pi(this, Xt, new AbortController());
      try {
        const i = await uo(
          e,
          { signal: v(this, Xt).signal, useSampleData: !0 },
          v(this, k).getToken
        );
        v(this, k).setServerBounds(i.layers), v(this, k).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, _p));
};
eo = function(e, t, i, a) {
  const s = this._template;
  if (!s || !v(this, k)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: ae(this, F, Mc).call(this) };
  if (e.kind === "property") {
    const l = Nu(e.property, o);
    if (l.kind === "condition") {
      ae(this, F, Ac).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    v(this, k).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? wr(o, "Image") : e.layerType === "badges" ? $r(o, "Badges", "") : e.layerType === "rect" ? Uu(o, "Shape", e.shape) : _r(o, "Text", { kind: "static", text: "Text" });
  v(this, k).addLayer(n);
};
Ac = function(e, t, i) {
  var o, n, l, d;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((m) => m.key === a);
  if (!s) {
    (n = v(this, Bi)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = v(this, k)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (d = v(this, Bi)) == null || d.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
Mc = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
zc = async function() {
  var t;
  const e = await ae(this, F, Ko).call(this);
  e && ((t = v(this, k)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
Rc = async function(e) {
  var i;
  const t = await ae(this, F, Ko).call(this);
  t && ((i = v(this, k)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
Ko = async function() {
  if (!v(this, Ni)) return;
  const e = v(this, Ni).open(this, Kn, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
Lc = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !v(this, k)) return;
  const t = await ho(e.mediaKey, v(this, k).getToken).catch(() => {
  });
  t && v(this, k).updateCanvas({ width: t.width, height: t.height });
};
xa = /* @__PURE__ */ new WeakMap();
U.styles = M`
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
Y([
  f()
], U.prototype, "_template", 2);
Y([
  f()
], U.prototype, "_selectedKey", 2);
Y([
  f()
], U.prototype, "_properties", 2);
Y([
  f()
], U.prototype, "_linkedProperties", 2);
Y([
  f()
], U.prototype, "_fonts", 2);
Y([
  f()
], U.prototype, "_serverBounds", 2);
Y([
  f()
], U.prototype, "_baseImageUrl", 2);
Y([
  f()
], U.prototype, "_zoom", 2);
Y([
  f()
], U.prototype, "_effectiveScale", 2);
Y([
  f()
], U.prototype, "_previewing", 2);
Y([
  f()
], U.prototype, "_snapEnabled", 2);
Y([
  f()
], U.prototype, "_showRulers", 2);
Y([
  f()
], U.prototype, "_showSafeArea", 2);
Y([
  f()
], U.prototype, "_showMeasured", 2);
Y([
  f()
], U.prototype, "_canUndo", 2);
Y([
  f()
], U.prototype, "_canRedo", 2);
U = Y([
  z("di-design-view")
], U);
const wp = U, $p = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return U;
  },
  default: wp
}, Symbol.toStringTag, { value: "Module" }));
var xp = Object.defineProperty, kp = Object.getOwnPropertyDescriptor, Fc = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && xp(t, i, s), s;
}, jo = (e, t, i) => t.has(e) || Fc("Cannot " + i), B = (e, t, i) => (jo(e, t, "read from private field"), t.get(e)), Bt = (e, t, i) => t.has(e) ? Fc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Jt = (e, t, i, a) => (jo(e, t, "write to private field"), t.set(e, i), i), Q = (e, t, i) => (jo(e, t, "access private method"), i), fe, ji, Vi, Zt, zt, V, Uc, Ua, Wc, Nc, Vo, Bc, qi, Kc, jc, Vc;
let de = class extends W {
  constructor() {
    super(), Bt(this, V), Bt(this, fe), Bt(this, ji), Bt(this, Vi), Bt(this, Zt), Bt(this, zt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Va, (e) => {
      Jt(this, ji, e);
    }), this.consumeContext(pe, (e) => {
      Jt(this, Vi, e);
    }), this.consumeContext(Nt, (e) => {
      Jt(this, fe, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Q(this, V, Uc).call(this);
      });
    });
  }
  connectedCallback() {
    super.connectedCallback(), Q(this, V, qi).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = B(this, Zt)) == null || e.abort(), Q(this, V, Vo).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${Q(this, V, Bc)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => Q(this, V, qi).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${Q(this, V, jc)}>
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
                ${j(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => Q(this, V, Vc).call(this, e)
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
                @click=${Q(this, V, Kc)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
fe = /* @__PURE__ */ new WeakMap();
ji = /* @__PURE__ */ new WeakMap();
Vi = /* @__PURE__ */ new WeakMap();
Zt = /* @__PURE__ */ new WeakMap();
zt = /* @__PURE__ */ new WeakMap();
V = /* @__PURE__ */ new WeakSet();
Uc = async function() {
  var t;
  const e = Q(this, V, Wc).call(this);
  e && (this._sampleNode = e, (t = B(this, fe)) == null || t.setSampleContentKey(e.key), await Q(this, V, qi).call(this));
};
Ua = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
Wc = function() {
  try {
    const e = localStorage.getItem(Q(this, V, Ua).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
Nc = function(e) {
  try {
    e ? localStorage.setItem(Q(this, V, Ua).call(this), JSON.stringify(e)) : localStorage.removeItem(Q(this, V, Ua).call(this));
  } catch {
  }
};
Vo = function() {
  B(this, zt) && (URL.revokeObjectURL(B(this, zt)), Jt(this, zt, void 0));
};
Bc = async function() {
  var i, a, s;
  if (!B(this, ji) || !this._template) return;
  const e = B(this, ji).open(this, Fd, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, Q(this, V, Nc).call(this, t.item), (s = B(this, fe)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await Q(this, V, qi).call(this));
};
qi = async function() {
  var i, a;
  const e = this._template;
  if (!e || !B(this, fe)) return;
  (i = B(this, Zt)) == null || i.abort(), Jt(this, Zt, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: B(this, Zt).signal,
    contentKey: (a = this._sampleNode) == null ? void 0 : a.key,
    useSampleData: !this._sampleNode,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [s, o] = await Promise.all([
      co(e, t, B(this, fe).getToken),
      uo(e, t, B(this, fe).getToken)
    ]);
    Q(this, V, Vo).call(this), Jt(this, zt, URL.createObjectURL(s)), this._url = B(this, zt), this._bounds = o.layers, this._skipped = o.skipped ?? [], B(this, fe).setServerBounds(o.layers), B(this, fe).setIssues(o.issues);
  } catch (s) {
    if ((s == null ? void 0 : s.name) === "AbortError") return;
    this._error = s instanceof Error ? s.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Kc = async function() {
  var e, t;
  if (!(!this._sampleNode || !B(this, fe))) {
    this._regenerating = !0;
    try {
      const i = await Ha(this._sampleNode.key, B(this, fe).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = B(this, Vi)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = B(this, Vi)) == null || t.peek("danger", {
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
jc = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Vc = function(e) {
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
de.styles = M`
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
      ${ko}
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
Xe([
  f()
], de.prototype, "_template", 2);
Xe([
  f()
], de.prototype, "_sampleNode", 2);
Xe([
  f()
], de.prototype, "_bounds", 2);
Xe([
  f()
], de.prototype, "_skipped", 2);
Xe([
  f()
], de.prototype, "_url", 2);
Xe([
  f()
], de.prototype, "_loading", 2);
Xe([
  f()
], de.prototype, "_error", 2);
Xe([
  f()
], de.prototype, "_regenerating", 2);
de = Xe([
  z("di-preview-view")
], de);
const Tp = de, Sp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return de;
  },
  default: Tp
}, Symbol.toStringTag, { value: "Module" }));
var Ep = Object.defineProperty, Dp = Object.getOwnPropertyDescriptor, qc = (e) => {
  throw TypeError(e);
}, os = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ep(t, i, s), s;
}, qo = (e, t, i) => t.has(e) || qc("Cannot " + i), N = (e, t, i) => (qo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), gs = (e, t, i) => t.has(e) ? qc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), On = (e, t, i, a) => (qo(e, t, "write to private field"), t.set(e, i), i), lt = (e, t, i) => (qo(e, t, "access private method"), i), q, Wt, $e, Gc, Hc, Yc, Xc, Jc, Zc, Qc, eu, tu;
let pt = class extends W {
  constructor() {
    super(), gs(this, $e), gs(this, q), gs(this, Wt), this._properties = [], this._showAdvanced = !1, this.consumeContext(Va, (e) => {
      On(this, Wt, e);
    }), this.consumeContext(Nt, (e) => {
      On(this, q, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${lt(this, $e, Zc).call(this)} ${lt(this, $e, Qc).call(this)} ${lt(this, $e, eu).call(this)} ${lt(this, $e, tu).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
q = /* @__PURE__ */ new WeakMap();
Wt = /* @__PURE__ */ new WeakMap();
$e = /* @__PURE__ */ new WeakSet();
Gc = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Hc = async function() {
  var a, s;
  if (!N(this, Wt) || !this._template) return;
  const e = N(this, Wt).open(this, Cu, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await lt(this, $e, Yc).call(this, t.selection.filter((o) => !!o));
  (a = N(this, q)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = N(this, q)) == null ? void 0 : s.reloadProperties());
};
Yc = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => Fu), i = await t(N(this, q).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
Xc = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = N(this, q)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = N(this, q)) == null || s.reloadProperties();
};
Jc = async function() {
  var i;
  if (!N(this, Wt)) return;
  const e = N(this, Wt).open(this, Kn, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = N(this, q)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
Zc = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${e.docTypeAliases.length === 0 ? r`<p class="empty">No document types yet - nothing will trigger this template.</p>` : r`<div class="tags">
                  ${j(
    e.docTypeAliases,
    (t) => t,
    (t) => r`
                      <uui-tag look="secondary">
                        ${t}
                        <uui-button
                          compact
                          label="Remove ${t}"
                          @click=${() => lt(this, $e, Xc).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${lt(this, $e, Hc)}>
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
    ...N(this, $e, Gc).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = N(this, q)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = N(this, q)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Qc = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${lt(this, $e, Jc)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = N(this, q)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
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
    return (i = N(this, q)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = N(this, q)) == null ? void 0 : i.updateOutput({
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
    return (i = N(this, q)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
eu = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = N(this, q)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = N(this, q)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
tu = function() {
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
    return (i = N(this, q)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
pt.styles = M`
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
os([
  f()
], pt.prototype, "_template", 2);
os([
  f()
], pt.prototype, "_properties", 2);
os([
  f()
], pt.prototype, "_showAdvanced", 2);
pt = os([
  z("di-settings-view")
], pt);
const Cp = pt, Pp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return pt;
  },
  default: Cp
}, Symbol.toStringTag, { value: "Module" }));
var Ip = Object.defineProperty, Op = Object.getOwnPropertyDescriptor, iu = (e) => {
  throw TypeError(e);
}, na = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Op(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ip(t, i, s), s;
}, Go = (e, t, i) => t.has(e) || iu("Cannot " + i), An = (e, t, i) => (Go(e, t, "read from private field"), t.get(e)), Mn = (e, t, i) => t.has(e) ? iu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ap = (e, t, i, a) => (Go(e, t, "write to private field"), t.set(e, i), i), zn = (e, t, i) => (Go(e, t, "access private method"), i), Gi, ka, to;
let Ge = class extends W {
  constructor() {
    super(), Mn(this, ka), Mn(this, Gi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Nt, (e) => {
      Ap(this, Gi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && zn(this, ka, to).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => zn(this, ka, to).call(this)}>Reload</uui-button>
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
              ${j(
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
Gi = /* @__PURE__ */ new WeakMap();
ka = /* @__PURE__ */ new WeakSet();
to = async function() {
  const e = this._template;
  if (!(!e || !An(this, Gi))) {
    this._loading = !0;
    try {
      this._usage = await fr(e.key, An(this, Gi).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Ge.styles = M`
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
na([
  f()
], Ge.prototype, "_template", 2);
na([
  f()
], Ge.prototype, "_usage", 2);
na([
  f()
], Ge.prototype, "_loading", 2);
na([
  f()
], Ge.prototype, "_onlyMissing", 2);
Ge = na([
  z("di-usage-view")
], Ge);
const Mp = Ge, zp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Ge;
  },
  default: Mp
}, Symbol.toStringTag, { value: "Module" })), Rp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ws,
  default: ws
}, Symbol.toStringTag, { value: "Module" }));
var nt, It;
class ys extends yu {
  constructor(i, a) {
    super(i, a);
    x(this, nt);
    x(this, It);
    this.consumeContext(pe, (s) => {
      _(this, nt, s);
    }), this.consumeContext(Nt, (s) => {
      _(this, It, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, It), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, nt)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await ja(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await po(a.key, !1, i.getToken);
        (o = c(this, nt)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await Rr(l, i.getToken, c(this, nt));
      } catch (l) {
        (n = c(this, nt)) == null || n.peek("danger", {
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
    c(this, It) && await mr(i, c(this, It).getToken);
  }
}
nt = new WeakMap(), It = new WeakMap();
const Lp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: ys,
  api: ys,
  default: ys
}, Symbol.toStringTag, { value: "Module" }));
var Xi, ci;
class vs extends Ka {
  constructor(i, a) {
    super(i, a);
    x(this, Xi);
    x(this, ci);
    this.consumeContext(Ae, (s) => {
      _(this, Xi, s);
    }), this.consumeContext(pe, (s) => {
      _(this, ci, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Ha(i, () => {
          var l;
          return (l = c(this, Xi)) == null ? void 0 : l.getLatestToken();
        }), n = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = c(this, ci)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof je && o.status === 404;
        (s = c(this, ci)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof je ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Xi = new WeakMap(), ci = new WeakMap();
const Fp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: vs,
  api: vs,
  default: vs
}, Symbol.toStringTag, { value: "Module" }));
var Ji, Ot, Zi, ui;
class bs extends Ou {
  constructor(i, a) {
    super(i, a);
    x(this, Ji);
    x(this, Ot);
    x(this, Zi);
    x(this, ui);
    this.consumeContext(Ae, (s) => {
      _(this, Ji, s);
    }), this.consumeContext(pe, (s) => {
      _(this, Ot, s);
    }), this.consumeContext(Au, (s) => {
      _(this, Zi, s);
    }), this.consumeContext(Mu, (s) => {
      _(this, ui, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, ui)) {
      (i = c(this, Ot)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Ha(c(this, ui), () => {
        var l;
        return (l = c(this, Ji)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Zi)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, Ot)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof je && n.status === 404;
      (o = c(this, Ot)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof je ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Ji = new WeakMap(), Ot = new WeakMap(), Zi = new WeakMap(), ui = new WeakMap();
const Up = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: bs,
  api: bs,
  default: bs
}, Symbol.toStringTag, { value: "Module" }));
var Wp = Object.defineProperty, Np = Object.getOwnPropertyDescriptor, au = (e) => {
  throw TypeError(e);
}, ns = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Np(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wp(t, i, s), s;
}, Ho = (e, t, i) => t.has(e) || au("Cannot " + i), Wa = (e, t, i) => (Ho(e, t, "read from private field"), t.get(e)), ha = (e, t, i) => t.has(e) ? au("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), su = (e, t, i, a) => (Ho(e, t, "write to private field"), t.set(e, i), i), jt = (e, t, i) => (Ho(e, t, "access private method"), i), Ta, Hi, Yo, Qe, Xo, ou, Sa;
let mt = class extends ao {
  constructor() {
    super(), ha(this, Qe), ha(this, Ta), ha(this, Hi), this._items = [], this._loading = !0, this._search = "", ha(this, Yo, () => {
      var e;
      return (e = Wa(this, Ta)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ae, (e) => {
      su(this, Ta, e), e && jt(this, Qe, Xo).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(Wa(this, Hi));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${jt(this, Qe, ou)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => jt(this, Qe, Sa).call(this, void 0)}>
          Use sample data
        </uui-button>

        ${this._loading ? r`<uui-loader></uui-loader>` : this._items.length === 0 ? r`<p class="empty">No content of the selected document types was found.</p>` : r`<uui-ref-list>
                ${j(
      this._items,
      (e) => e.key,
      (e) => {
        var t;
        return r`
                    <uui-ref-node
                      name=${e.name}
                      detail=${e.isPublished ? "Published" : "Draft"}
                      ?selected=${e.key === ((t = this.data) == null ? void 0 : t.selectedKey)}
                      @open=${() => jt(this, Qe, Sa).call(this, e)}
                      @click=${() => jt(this, Qe, Sa).call(this, e)}>
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
Ta = /* @__PURE__ */ new WeakMap();
Hi = /* @__PURE__ */ new WeakMap();
Yo = /* @__PURE__ */ new WeakMap();
Qe = /* @__PURE__ */ new WeakSet();
Xo = async function() {
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
        (a) => hr(a, this._search, 0, 30, Wa(this, Yo)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
ou = function(e) {
  this._search = e.target.value, window.clearTimeout(Wa(this, Hi)), su(this, Hi, window.setTimeout(() => void jt(this, Qe, Xo).call(this), 300));
};
Sa = function(e) {
  this.value = { item: e }, this._submitModal();
};
mt.styles = M`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
ns([
  f()
], mt.prototype, "_items", 2);
ns([
  f()
], mt.prototype, "_loading", 2);
ns([
  f()
], mt.prototype, "_search", 2);
mt = ns([
  z("di-sample-node-picker-modal")
], mt);
const Bp = mt, Kp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return mt;
  },
  default: Bp
}, Symbol.toStringTag, { value: "Module" }));
var jp = Object.defineProperty, Vp = Object.getOwnPropertyDescriptor, nu = (e) => {
  throw TypeError(e);
}, Je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Vp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && jp(t, i, s), s;
}, Jo = (e, t, i) => t.has(e) || nu("Cannot " + i), mi = (e, t, i) => (Jo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), _s = (e, t, i) => t.has(e) ? nu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qp = (e, t, i, a) => (Jo(e, t, "write to private field"), t.set(e, i), i), kt = (e, t, i) => (Jo(e, t, "access private method"), i), Ea, ra, ve, ru, lu, cu, Zo, uu, du, hu, pu;
const Gp = [100, 200, 300, 400, 500, 600, 700, 800, 900], Hp = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let he = class extends ao {
  constructor() {
    super(), _s(this, ve), _s(this, Ea), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", _s(this, ra, () => {
      var e;
      return (e = mi(this, Ea)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ae, (e) => {
      qp(this, Ea, e);
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
            @change=${kt(this, ve, ru)}>
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
            @click=${kt(this, ve, cu)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Hp.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? kt(this, ve, pu).call(this) : kt(this, ve, hu).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !mi(this, ve, Zo)}
            @click=${kt(this, ve, uu)}>
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
Ea = /* @__PURE__ */ new WeakMap();
ra = /* @__PURE__ */ new WeakMap();
ve = /* @__PURE__ */ new WeakSet();
ru = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  kt(this, ve, lu).call(this, t);
};
lu = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await ar(t, mi(this, ra));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
cu = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await sr(this._path.trim(), mi(this, ra)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Zo = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
uu = async function() {
  if (mi(this, ve, Zo)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await or(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        mi(this, ra)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
du = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
hu = function() {
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
        ${j(
    Gp,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => kt(this, ve, du).call(this, e, t.target.checked)}>
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
pu = function() {
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
he.styles = M`
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
Je([
  f()
], he.prototype, "_busy", 2);
Je([
  f()
], he.prototype, "_error", 2);
Je([
  f()
], he.prototype, "_path", 2);
Je([
  f()
], he.prototype, "_provider", 2);
Je([
  f()
], he.prototype, "_family", 2);
Je([
  f()
], he.prototype, "_weights", 2);
Je([
  f()
], he.prototype, "_italic", 2);
Je([
  f()
], he.prototype, "_url", 2);
he = Je([
  z("di-font-upload-modal")
], he);
const Yp = he, Xp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return he;
  },
  default: Yp
}, Symbol.toStringTag, { value: "Module" }));
var Jp = Object.getOwnPropertyDescriptor, Zp = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = n(s) || s);
  return s;
};
let Na = class extends W {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Na = Zp([
  z("di-template-folder-editor")
], Na);
const Qp = Na, em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Na;
  },
  default: Qp
}, Symbol.toStringTag, { value: "Module" }));
export {
  vd as manifests,
  km as onInit
};
//# sourceMappingURL=dynamic-images.js.map
