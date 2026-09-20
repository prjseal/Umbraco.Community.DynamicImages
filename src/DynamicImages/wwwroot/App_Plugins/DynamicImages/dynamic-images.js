var ko = (e) => {
  throw TypeError(e);
};
var Ja = (e, t, i) => t.has(e) || ko("Cannot " + i);
var c = (e, t, i) => (Ja(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? ko("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), b = (e, t, i, a) => (Ja(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), P = (e, t, i) => (Ja(e, t, "access private method"), i);
var Za = (e, t, i, a) => ({
  set _(s) {
    b(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { nothing as p, html as r, css as A, state as m, customElement as L, repeat as W, property as v, classMap as Bo, styleMap as K } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as N } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Fe } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as lt } from "@umbraco-cms/backoffice/notification";
import { umbOpenModal as Jl, UMB_DISCARD_CHANGES_MODAL as Zl, umbConfirmModal as Ws, UmbModalToken as Ko, UMB_MODAL_MANAGER_CONTEXT as La, UmbModalBaseElement as Vo } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as Ho } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as Ql } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as ec, UmbEntityWorkspaceDataManager as tc, UmbSubmitWorkspaceAction as So, UmbWorkspaceActionBase as ic } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as ac } from "@umbraco-cms/backoffice/context-api";
import { UmbArrayState as gi, UmbStringState as To, UmbBooleanState as ia, UmbNumberState as sc } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as oc } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as nc } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as rc } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as lc } from "@umbraco-cms/backoffice/document";
const oi = "dynamic-images", ji = "di-template", ka = "di:templates-changed", cc = "/umbraco/management/api/v1/dynamic-images";
class at extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function T(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${cc}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await uc(n);
  return n;
}
async function uc(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new at(t, e.status, i);
}
const D = async (e) => e.json();
async function Ns(e) {
  const t = await T("/templates?take=500", e);
  return (await D(t)).items;
}
const Go = async (e, t) => D(await T(`/templates/${e}`, t)), jo = async (e, t) => D(await T("/templates", t, { method: "POST", json: e })), Xo = async (e, t) => D(await T(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Yo(e, t) {
  await T(`/templates/${e}`, t, { method: "DELETE" });
}
const qo = async (e, t) => D(await T(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function Jo(e, t) {
  return (await T(`/templates/${e}/export`, t)).blob();
}
const Zo = async (e, t, i) => D(await T("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), Qo = async (e) => D(await T("/templates/import/appsettings", e, { method: "POST" })), Ti = async (e) => D(await T("/fonts", e));
async function en(e, t) {
  const i = new FormData();
  return i.append("file", e), D(await T("/fonts", t, { method: "POST", body: i }));
}
const tn = async (e, t) => D(await T("/fonts/register-path", t, { method: "POST", json: { path: e } })), an = async (e, t) => D(await T("/fonts/register-web", t, { method: "POST", json: e })), sn = async (e, t) => D(await T(`/fonts/${e}/refresh`, t, { method: "POST" })), on = async (e, t, i, a) => D(await T(`/fonts/${e}`, a, { method: "PUT", json: { familyName: t, styles: i } }));
async function nn(e, t) {
  await T(`/fonts/${e}`, t, { method: "DELETE" });
}
async function rn(e, t) {
  return (await T(`/fonts/${e}/file`, t)).arrayBuffer();
}
const hc = async (e) => D(await T("/document-types", e)), ln = async (e, t) => D(await T(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function cn(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), D(await T(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function Fs(e, t, i) {
  return (await T("/preview", i, {
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
const Us = async (e, t, i) => D(await T("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Bs = async (e, t) => D(await T(`/media/${e}/image-info`, t)), Ra = async (e, t) => D(await T(`/documents/${e}/regenerate`, t, { method: "POST" })), un = async (e, t, i) => D(await T(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), hn = async (e, t) => D(await T(`/jobs/${e}`, t));
async function dn(e, t) {
  await T(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const pn = async (e, t) => D(await T(`/templates/${e}/usage`, t)), Wa = async (e) => D(await T("/health", e)), mn = async (e) => D(await T("/sync/status", e)), fn = async (e) => D(await T("/sync/export", e, { method: "POST" })), gn = async (e) => D(await T("/sync/import", e, { method: "POST" }));
function ni(e) {
  const t = `section/${oi}/workspace/${ji}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Na() {
  return new URL(`section/${oi}/workspace/${ji}/create`, document.baseURI).pathname;
}
function yn(e) {
  return new URL(`section/${oi}/dashboard/${e}`, document.baseURI).pathname;
}
function ls() {
  const e = window.location.pathname.split(`/workspace/${ji}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function ui() {
  window.dispatchEvent(new CustomEvent(ka));
}
const dc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: at,
  SECTION_PATHNAME: oi,
  TEMPLATES_CHANGED_EVENT: ka,
  TEMPLATE_ENTITY_TYPE: ji,
  cancelJob: dn,
  createTemplate: jo,
  deleteFont: nn,
  deleteTemplate: Yo,
  duplicateTemplate: qo,
  exportTemplate: Jo,
  fetchDocumentTypes: hc,
  fetchFontFile: rn,
  fetchFonts: Ti,
  fetchHealth: Wa,
  fetchImageInfo: Bs,
  fetchJob: hn,
  fetchLayout: Us,
  fetchPreview: Fs,
  fetchProperties: ln,
  fetchSampleContent: cn,
  fetchSyncStatus: mn,
  fetchTemplate: Go,
  fetchTemplates: Ns,
  fetchUsage: pn,
  hrefForCreate: Na,
  hrefForDashboard: yn,
  hrefForTemplate: ni,
  importFromAppSettings: Qo,
  importTemplate: Zo,
  notifyTemplatesChanged: ui,
  refreshFont: sn,
  regenerateDocument: Ra,
  regenerateTemplate: un,
  registerFontPath: tn,
  registerWebFont: an,
  runSyncExport: fn,
  runSyncImport: gn,
  templateKeyFromLocation: ls,
  updateFont: on,
  updateTemplate: Xo,
  uploadFont: en
}, Symbol.toStringTag, { value: "Module" })), Fa = () => crypto.randomUUID();
function Ua(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function vn(e, t, i) {
  const { x: a, y: s } = Ua(e);
  return {
    type: "text",
    key: Fa(),
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
function bn(e, t, i) {
  const { x: a, y: s } = Ua(e);
  return {
    type: "image",
    key: Fa(),
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
function _n(e, t, i) {
  const { x: a, y: s } = Ua(e);
  return {
    type: "badges",
    key: Fa(),
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
function pc(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = Ua(e);
  return {
    type: "rect",
    key: Fa(),
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
function mc(e) {
  switch (e) {
    case "media":
      return "image";
    case "content":
    case "list":
      return "badges";
    default:
      return "text";
  }
}
function fc(e, t) {
  switch (mc(e.classification)) {
    case "image":
      return bn(t, e.name, e.alias);
    case "badges":
      return _n(t, e.name, e.alias);
    default:
      return vn(t, e.name, gc(e));
  }
}
function gc(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function yc(e) {
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
const wn = [
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
function Ci(e) {
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
function Ei(e) {
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
function cs(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return wn[a * 3 + i];
}
function Ba(e, t, i) {
  return {
    x: e.x - t * Ci(e.anchor),
    y: e.y - i * Ei(e.anchor)
  };
}
function Ks(e, t, i, a, s) {
  return {
    x: e + i * Ci(s),
    y: t + a * Ei(s)
  };
}
function vc(e, t, i, a) {
  const s = Ba(e, t, i), o = Ks(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function bc(e, t) {
  const i = Ks(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function $n(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Nt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), d = e - i, f = t - a;
  return { x: i + d * n - f * l, y: a + d * l + f * n };
}
function _c(e, t, i, a, s) {
  return Nt(e, t, i, a, -s);
}
function xn(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Nt(e.x, e.y, t, i, a),
    Nt(e.x + e.width, e.y, t, i, a),
    Nt(e.x + e.width, e.y + e.height, t, i, a),
    Nt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((f) => f.x)), n = Math.max(...s.map((f) => f.x)), l = Math.min(...s.map((f) => f.y)), d = Math.max(...s.map((f) => f.y));
  return { x: o, y: l, width: n - o, height: d - l };
}
const wc = 10;
function Pe(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function kn(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Sa(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Co(e) {
  return e === "below" || e === "above";
}
function Eo(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function $c(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function xc(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = Eo(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...Eo(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function kc(e, t, i) {
  const a = e.position;
  if (!kn(a)) return a;
  if (xc(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Ci(a.anchor), l = Ei(a.anchor);
  const d = Do(e, a.relativeX, !1, t, i);
  d && (s = d.coordinate, n = d.factor);
  const f = Do(e, a.relativeY, !0, t, i);
  return f && (o = f.coordinate, l = f.factor), { x: s, y: o, anchor: cs(n, l) };
}
function Do(e, t, i, a, s) {
  if (!t || Co(t.edge) !== i) return;
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
    const f = i ? l.position.relativeY : l.position.relativeX;
    if (!f || Co(f.edge) !== i) return;
    n = f.layerKey;
  }
}
function Sc(e, t, i) {
  const a = $c(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const d = s.get(l.key);
    if (d) return d;
    let f;
    o.has(l.key) ? f = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), f = kc(l, a, (Ve) => {
      const Ie = a.get(Ve);
      return Ie && !i(Ie) ? n(Ie).extent : void 0;
    }), o.delete(l.key));
    const C = t(l), Y = Ba(f, C.width, C.height), we = { x: Y.x, y: Y.y, width: C.width, height: C.height }, Oe = { position: f, box: we, extent: xn(we, f.x, f.y, l.rotation ?? 0) };
    return s.set(l.key, Oe), Oe;
  };
  for (const l of e) n(l);
  return s;
}
function us(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? cs(Ci(i.anchor), Ei(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? cs(Ci(e.anchor), Ei(i.anchor)) : e.anchor
  };
}
var oe, Le, ke, Je;
class Tc {
  constructor(t = 100) {
    w(this, oe, []);
    w(this, Le, []);
    w(this, ke, 0);
    w(this, Je);
    this.limit = t;
  }
  get canUndo() {
    return c(this, oe).length > 0;
  }
  get canRedo() {
    return c(this, Le).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, ke) > 0 || (c(this, oe).push(structuredClone(t)), c(this, oe).length > this.limit && c(this, oe).shift(), b(this, Le, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, ke) === 0 && b(this, Je, structuredClone(t)), Za(this, ke)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, ke) !== 0 && (Za(this, ke)._--, !(c(this, ke) > 0) && (t && c(this, Je) !== void 0 && (c(this, oe).push(c(this, Je)), c(this, oe).length > this.limit && c(this, oe).shift(), b(this, Le, [])), b(this, Je, void 0)));
  }
  undo(t) {
    const i = c(this, oe).pop();
    if (i !== void 0)
      return c(this, Le).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Le).pop();
    if (i !== void 0)
      return c(this, oe).push(structuredClone(t)), i;
  }
  clear() {
    b(this, oe, []), b(this, Le, []), b(this, ke, 0), b(this, Je, void 0);
  }
}
oe = new WeakMap(), Le = new WeakMap(), ke = new WeakMap(), Je = new WeakMap();
const Cc = "DynamicImages.Workspace.Template";
var Xt, Ze, vt, bt, Yt, qt, Jt, _t, Zt, Re, Qt, ei, ne, Ki, wt, Se, $t, k, Sn, ti, ii, hs, ds, Ae, dt, ps, ms;
class Ec extends ec {
  constructor(i) {
    super(i, Cc);
    w(this, k);
    w(this, Xt);
    w(this, Ze);
    w(this, vt);
    w(this, bt);
    w(this, Yt);
    w(this, qt);
    w(this, Jt);
    w(this, _t);
    w(this, Zt);
    w(this, Re);
    w(this, Qt);
    w(this, ei);
    w(this, ne);
    w(this, Ki);
    w(this, wt);
    w(this, Se);
    w(this, $t);
    w(this, ti);
    w(this, ii);
    this._data = new tc(this), this.template = this._data.current, b(this, Xt, new gi([], (a) => a.key)), this.layers = c(this, Xt).asObservable(), b(this, Ze, new To(void 0)), this.selectedLayerKey = c(this, Ze).asObservable(), b(this, vt, new gi([], (a) => a.alias)), this.properties = c(this, vt).asObservable(), b(this, bt, new gi([], (a) => a.key)), this.fonts = c(this, bt).asObservable(), b(this, Yt, new gi([], (a) => a.key)), this.serverBounds = c(this, Yt).asObservable(), b(this, qt, new gi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, qt).asObservable(), b(this, Jt, new To(void 0)), this.sampleContentKey = c(this, Jt).asObservable(), b(this, _t, new ia(!0)), this.useSampleData = c(this, _t).asObservable(), b(this, Zt, new sc(1)), this.zoom = c(this, Zt).asObservable(), b(this, Re, new ia(!0)), this.loading = c(this, Re).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), b(this, Qt, new ia(!1)), this.canUndo = c(this, Qt).asObservable(), b(this, ei, new ia(!1)), this.canRedo = c(this, ei).asObservable(), b(this, ne, new Tc()), b(this, Se, !1), b(this, $t, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), b(this, ti, async (a) => {
      const s = a.detail;
      if (c(this, $t) || !(s != null && s.url) || !P(this, k, Sn).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await Jl(this, Zl), b(this, $t, !0), window.history.pushState({}, "", s.url), !0;
      } catch {
        return !1;
      }
    }), b(this, ii, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, Ki)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        path: "create",
        component: () => Promise.resolve().then(() => Mo),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Mo),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Fe, (a) => {
      b(this, Ki, a);
    }), this.consumeContext(lt, (a) => {
      b(this, wt, a);
    }), window.addEventListener("willchangestate", c(this, ti)), window.addEventListener("beforeunload", c(this, ii));
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Se);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Re).setValue(!0), b(this, Se, !1);
    try {
      const a = await Go(i, this.getToken);
      P(this, k, dt).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await P(this, k, hs).call(this, a);
    } catch (a) {
      P(this, k, ms).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Re).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    c(this, Re).setValue(!0), b(this, Se, !0), P(this, k, dt).call(this, yc(i), { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await P(this, k, hs).call(this, this._data.getCurrent()), c(this, Re).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    i && c(this, vt).setValue(await P(this, k, ds).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    c(this, bt).setValue(await Ti(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    P(this, k, Ae).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    P(this, k, Ae).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    P(this, k, Ae).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    P(this, k, Ae).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    P(this, k, Ae).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    P(this, k, Ae).call(this, (s) => ({
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
    P(this, k, Ae).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, d;
        let n = o.position;
        return ((l = Sa(n, "x")) == null ? void 0 : l.layerKey) === i && (n = us(n, "x", a == null ? void 0 : a.get(o.key))), ((d = Sa(n, "y")) == null ? void 0 : d.layerKey) === i && (n = us(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), c(this, Ze).getValue() === i && this.selectLayer(void 0);
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
    P(this, k, Ae).call(this, (s) => {
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
    c(this, Ze).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, Ze).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, ne).begin(i);
  }
  endTransaction(i = !0) {
    c(this, ne).end(i), P(this, k, ps).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ne).undo(i);
    a && P(this, k, dt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ne).redo(i);
    a && P(this, k, dt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Yt).setValue(i);
  }
  setIssues(i) {
    c(this, qt).setValue(i);
  }
  setSampleContentKey(i) {
    c(this, Jt).setValue(i), c(this, _t).setValue(!i);
  }
  setUseSampleData(i) {
    c(this, _t).setValue(i);
  }
  setZoom(i) {
    c(this, Zt).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = c(this, Se) ? await jo(i, this.getToken) : await Xo(i, this.getToken);
      P(this, k, dt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Se);
      b(this, Se, !1), this.setIsNew(!1), ui(), (a = c(this, wt)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, wt)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", ni(o.template.key));
    } catch (o) {
      throw P(this, k, ms).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), b(this, $t, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, ti)), window.removeEventListener("beforeunload", c(this, ii)), c(this, ne).clear(), super.destroy();
  }
}
Xt = new WeakMap(), Ze = new WeakMap(), vt = new WeakMap(), bt = new WeakMap(), Yt = new WeakMap(), qt = new WeakMap(), Jt = new WeakMap(), _t = new WeakMap(), Zt = new WeakMap(), Re = new WeakMap(), Qt = new WeakMap(), ei = new WeakMap(), ne = new WeakMap(), Ki = new WeakMap(), wt = new WeakMap(), Se = new WeakMap(), $t = new WeakMap(), k = new WeakSet(), /**
 * True when the new URL leaves this workspace. Switching between the four workspace views keeps
 * the workspace's own path as a prefix (`…/edit/<key>/view/<pathname>`), so this is false for
 * those and the editor is never prompted for moving between Design and Preview & test.
 *
 * Core has the same one-liner as a protected method on `UmbEntityDetailWorkspaceContextBase`.
 * There is no exported helper for it, so it is inlined rather than reached for.
 */
Sn = function(i) {
  return !i.includes(this.routes.getActiveLocalPath());
}, ti = new WeakMap(), ii = new WeakMap(), hs = async function(i) {
  const [a, s] = await Promise.all([
    Ti(this.getToken).catch(() => []),
    P(this, k, ds).call(this, i.docTypeAliases)
  ]);
  c(this, bt).setValue(a), c(this, vt).setValue(s);
}, ds = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => ln(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Ae = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && c(this, ne).push(s);
  const o = i(structuredClone(s));
  P(this, k, dt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
dt = function(i, a) {
  a != null && a.resetHistory && c(this, ne).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Xt).setValue(i.layers), P(this, k, ps).call(this);
}, ps = function() {
  c(this, Qt).setValue(c(this, ne).canUndo), c(this, ei).setValue(c(this, ne).canRedo);
}, ms = function(i, a) {
  var o;
  const s = a instanceof at ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, wt)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const Ot = new ac(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Dc = [
  // ---------------------------------------------------------------- sidebar
  {
    type: "sectionSidebarApp",
    kind: "menu",
    alias: "DynamicImages.SidebarApp",
    name: "Dynamic Images Sidebar",
    meta: {
      label: "#dynamicImages_sectionName",
      menu: "DynamicImages.Menu"
    },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "menu",
    alias: "DynamicImages.Menu",
    name: "Dynamic Images Menu"
  },
  {
    type: "menuItem",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    element: () => Promise.resolve().then(() => Uc),
    weight: 200,
    meta: { label: "Templates", menus: ["DynamicImages.Menu"] }
  },
  {
    type: "menuItem",
    kind: "link",
    alias: "DynamicImages.MenuItem.Fonts",
    name: "Dynamic Images Fonts Menu Item",
    weight: 100,
    meta: {
      label: "Fonts",
      icon: "icon-font",
      menus: ["DynamicImages.Menu"],
      href: `section/${oi}/dashboard/fonts`
    }
  },
  {
    type: "menuItem",
    kind: "link",
    alias: "DynamicImages.MenuItem.Health",
    name: "Dynamic Images Health Menu Item",
    weight: 90,
    meta: {
      label: "Health",
      icon: "icon-stethoscope",
      menus: ["DynamicImages.Menu"],
      href: `section/${oi}/dashboard/health`
    }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => Hc),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => eu),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => su),
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
    api: Ec,
    meta: { entityType: ji }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => hh),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => gh),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => _h),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Sh),
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
    api: () => Promise.resolve().then(() => Th),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Eh),
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
    api: () => Promise.resolve().then(() => Dh),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Ph),
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
    element: () => Promise.resolve().then(() => Ih)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => Uh)
  }
], ad = (e, t) => {
  t.registerMany(Dc);
};
var Pc = Object.defineProperty, Mc = Object.getOwnPropertyDescriptor, Tn = (e) => {
  throw TypeError(e);
}, Vs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Pc(t, i, s), s;
}, Hs = (e, t, i) => t.has(e) || Tn("Cannot " + i), zc = (e, t, i) => (Hs(e, t, "read from private field"), t.get(e)), Po = (e, t, i) => t.has(e) ? Tn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Oc = (e, t, i, a) => (Hs(e, t, "write to private field"), t.set(e, i), i), Ic = (e, t, i) => (Hs(e, t, "access private method"), i), Ta, fs, Cn;
let Ct = class extends N {
  constructor() {
    super(), Po(this, fs), Po(this, Ta), this._name = "", this._loading = !0, this.consumeContext(Ot, (e) => {
      Oc(this, Ta, e), e && (this.observe(e.template, (t) => {
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
            @input=${Ic(this, fs, Cn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Ta = /* @__PURE__ */ new WeakMap();
fs = /* @__PURE__ */ new WeakSet();
Cn = function(e) {
  var i;
  const t = e.target.value;
  (i = zc(this, Ta)) == null || i.updateTemplateFields({ name: t });
};
Ct.styles = A`
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
Vs([
  m()
], Ct.prototype, "_name", 2);
Vs([
  m()
], Ct.prototype, "_loading", 2);
Ct = Vs([
  L("di-template-editor")
], Ct);
const Ac = Ct, Mo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Ct;
  },
  default: Ac
}, Symbol.toStringTag, { value: "Module" }));
var Lc = Object.defineProperty, Rc = Object.getOwnPropertyDescriptor, En = (e) => {
  throw TypeError(e);
}, hi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Lc(t, i, s), s;
}, Gs = (e, t, i) => t.has(e) || En("Cannot " + i), ft = (e, t, i) => (Gs(e, t, "read from private field"), t.get(e)), yi = (e, t, i) => t.has(e) ? En("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Wc = (e, t, i, a) => (Gs(e, t, "write to private field"), t.set(e, i), i), na = (e, t, i) => (Gs(e, t, "access private method"), i), ra, Ca, la, ca, Ft, gs, Dn, Pn;
let Me = class extends N {
  constructor() {
    super(), yi(this, Ft), yi(this, ra), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = ls(), this._expanded = !0, yi(this, Ca, () => {
      var e;
      return (e = ft(this, ra)) == null ? void 0 : e.getLatestToken();
    }), yi(this, la, () => {
      this._activeKey = ls();
    }), yi(this, ca, () => {
      na(this, Ft, gs).call(this);
    }), this.consumeContext(Fe, (e) => {
      Wc(this, ra, e), e && na(this, Ft, gs).call(this);
    }), window.addEventListener("changestate", ft(this, la)), window.addEventListener(ka, ft(this, ca));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("changestate", ft(this, la)), window.removeEventListener(ka, ft(this, ca));
  }
  render() {
    return r`
      <uui-menu-item
        label="Templates"
        has-children
        ?show-children=${this._expanded}
        @show-children=${() => {
      this._expanded = !0;
    }}
        @hide-children=${() => {
      this._expanded = !1;
    }}>
        <uui-icon slot="icon" name="icon-brush"></uui-icon>
        ${na(this, Ft, Dn).call(this)}
      </uui-menu-item>
    `;
  }
};
ra = /* @__PURE__ */ new WeakMap();
Ca = /* @__PURE__ */ new WeakMap();
la = /* @__PURE__ */ new WeakMap();
ca = /* @__PURE__ */ new WeakMap();
Ft = /* @__PURE__ */ new WeakSet();
gs = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Ns(ft(this, Ca)),
      Wa(ft(this, Ca)).catch(() => {
      })
    ]);
    this._templates = e, this._issuesByTemplate = Nc((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
Dn = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${W(
    this._templates,
    (e) => e.key,
    (e) => na(this, Ft, Pn).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${Na()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
Pn = function(e) {
  const t = this._issuesByTemplate.get(e.key) ?? 0;
  return r`
      <uui-menu-item
        label=${e.name}
        href=${ni(e.key)}
        ?active=${e.key === this._activeKey}>
        <uui-icon
          slot="icon"
          name=${e.isEnabled ? "icon-picture" : "icon-block"}
          class=${e.isEnabled ? "enabled" : "disabled"}>
        </uui-icon>
        ${t > 0 ? r`<uui-badge slot="badge" color="warning" look="primary" title="${t} issue(s)">${t}</uui-badge>` : p}
      </uui-menu-item>
    `;
};
Me.styles = A`
    :host {
      display: block;
    }

    .disabled {
      opacity: 0.5;
    }

    .enabled {
      color: var(--uui-color-positive);
    }
  `;
hi([
  m()
], Me.prototype, "_templates", 2);
hi([
  m()
], Me.prototype, "_issuesByTemplate", 2);
hi([
  m()
], Me.prototype, "_loading", 2);
hi([
  m()
], Me.prototype, "_activeKey", 2);
hi([
  m()
], Me.prototype, "_expanded", 2);
Me = hi([
  L("di-templates-menu-item")
], Me);
function Nc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const Fc = Me, Uc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return Me;
  },
  default: Fc
}, Symbol.toStringTag, { value: "Module" }));
var Bc = Object.defineProperty, Kc = Object.getOwnPropertyDescriptor, Mn = (e) => {
  throw TypeError(e);
}, ct = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Kc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Bc(t, i, s), s;
}, js = (e, t, i) => t.has(e) || Mn("Cannot " + i), Ce = (e, t, i) => (js(e, t, "read from private field"), i ? i.call(e) : t.get(e)), aa = (e, t, i) => t.has(e) ? Mn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), zo = (e, t, i, a) => (js(e, t, "write to private field"), t.set(e, i), i), S = (e, t, i) => (js(e, t, "access private method"), i), ua, Ea, Ee, $, di, he, zn, On, In, An, Ln, Rn, Wn, _i, Nn, Fn, Un, Bn, Kn;
let de = class extends N {
  constructor() {
    super(), aa(this, $), aa(this, ua), aa(this, Ea), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, aa(this, Ee, () => {
      var e;
      return (e = Ce(this, ua)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(lt, (e) => {
      zo(this, Ea, e);
    }), this.consumeContext(Fe, (e) => {
      zo(this, ua, e), e && S(this, $, di).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${S(this, $, Rn).call(this)} ${S(this, $, Wn).call(this)} ${S(this, $, Nn).call(this)} ${S(this, $, Fn).call(this)}
      </umb-body-layout>
    `;
  }
};
ua = /* @__PURE__ */ new WeakMap();
Ea = /* @__PURE__ */ new WeakMap();
Ee = /* @__PURE__ */ new WeakMap();
$ = /* @__PURE__ */ new WeakSet();
di = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Ns(Ce(this, Ee)),
      Ti(Ce(this, Ee)).catch(() => []),
      Wa(Ce(this, Ee)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    S(this, $, he).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
he = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ce(this, Ea)) == null || s.peek(e, { data: { headline: t, message: a } });
};
zn = async function() {
  this._importing = !0;
  try {
    const e = await Qo(Ce(this, Ee));
    S(this, $, he).call(this, e.created.length > 0 ? "positive" : "warning", e.created.length > 0 ? `Imported ${e.created.length} template(s)` : "Nothing was imported");
    for (const t of e.warnings.slice(0, 5)) S(this, $, he).call(this, "warning", t);
    ui(), await S(this, $, di).call(this);
  } catch (e) {
    S(this, $, he).call(this, "danger", "The import failed", e);
  } finally {
    this._importing = !1;
  }
};
On = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await Zo(this._pasteJson, "create", Ce(this, Ee)), S(this, $, he).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, ui(), await S(this, $, di).call(this);
    } catch (e) {
      S(this, $, he).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
In = async function(e) {
  try {
    await qo(e.key, Ce(this, Ee)), S(this, $, he).call(this, "positive", `'${e.name}' duplicated`), ui(), await S(this, $, di).call(this);
  } catch (t) {
    S(this, $, he).call(this, "danger", "The template could not be duplicated", t);
  }
};
An = async function(e) {
  await Ws(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Yo(e.key, Ce(this, Ee)), S(this, $, he).call(this, "positive", `'${e.name}' deleted`), ui(), await S(this, $, di).call(this);
  } catch (t) {
    S(this, $, he).call(this, "danger", "The template could not be deleted", t);
  }
};
Ln = async function(e) {
  try {
    const t = await Jo(e.key, Ce(this, Ee)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    S(this, $, he).call(this, "danger", "The template could not be exported", t);
  }
};
Rn = function() {
  var t;
  if (!((t = this._health) != null && t.legacyConfigPresent)) return p;
  const e = this._templates.length > 0;
  return r`
      <uui-box class="banner">
        <div class="banner-inner">
          <uui-icon name="icon-alert"></uui-icon>
          <div>
            <strong>There is still a v1 configuration block in appsettings.</strong>
            <p>
              ${e ? "Templates already exist here, so it is no longer read. You can import it again if you need to." : "Import it to bring your existing designs into the backoffice."}
            </p>
          </div>
          <uui-button
            look="primary"
            color="positive"
            label="Import from appsettings"
            ?disabled=${this._importing}
            @click=${S(this, $, zn)}>
            Import from appsettings
          </uui-button>
        </div>
      </uui-box>
    `;
};
Wn = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${S(this, $, _i).call(this, "Templates", this._templates.length, "icon-brush")}
        ${S(this, $, _i).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${S(this, $, _i).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${S(this, $, _i).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
_i = function(e, t, i, a = !1) {
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        <uui-icon name=${i}></uui-icon>
        <div class="stat-value">${t}</div>
        <div class="stat-label">${e}</div>
      </uui-box>
    `;
};
Nn = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${W(
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
        <uui-button look="secondary" href=${yn("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Fn = function() {
  return r`
      <uui-box headline="Templates">
        <div slot="header-actions" class="header-actions">
          <uui-button
            look="secondary"
            label="Paste a template or a v1 configuration"
            @click=${() => {
    this._showPaste = !this._showPaste;
  }}>
            Import JSON
          </uui-button>
          <uui-button look="primary" color="positive" href=${Na()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? S(this, $, Un).call(this) : p}
        ${this._templates.length === 0 ? S(this, $, Bn).call(this) : S(this, $, Kn).call(this)}
      </uui-box>
    `;
};
Un = function() {
  return r`
      <div class="paste">
        <uui-textarea
          label="Template or v1 configuration JSON"
          placeholder="Paste an exported template, or a v1 DynamicImages configuration block"
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
          @click=${S(this, $, On)}>
          Import
        </uui-button>
      </div>
    `;
};
Bn = function() {
  return r`
      <div class="empty">
        <uui-icon name="icon-brush"></uui-icon>
        <h4>No templates yet</h4>
        <p>A template says which document types get a generated image, and what it looks like.</p>
        <uui-button look="primary" color="positive" href=${Na()} label="Create your first template">
          Create your first template
        </uui-button>
      </div>
    `;
};
Kn = function() {
  return r`
      <div class="cards">
        ${W(
    this._templates,
    (e) => e.key,
    (e) => r`
            <uui-box class="card ${e.isEnabled ? "" : "disabled"}">
              <div slot="headline">
                <a href=${ni(e.key)}>${e.name}</a>
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
                <uui-button look="secondary" href=${ni(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => S(this, $, In).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => S(this, $, Ln).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => S(this, $, An).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
de.styles = A`
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

    .banner {
      border-left: 4px solid var(--uui-color-warning);
    }

    .banner-inner {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-4);
      flex-wrap: wrap;
    }

    .banner-inner p {
      margin: var(--uui-size-space-1) 0 0;
      color: var(--uui-color-text-alt);
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
ct([
  m()
], de.prototype, "_templates", 2);
ct([
  m()
], de.prototype, "_fonts", 2);
ct([
  m()
], de.prototype, "_health", 2);
ct([
  m()
], de.prototype, "_loading", 2);
ct([
  m()
], de.prototype, "_importing", 2);
ct([
  m()
], de.prototype, "_pasteJson", 2);
ct([
  m()
], de.prototype, "_showPaste", 2);
de = ct([
  L("di-overview-dashboard")
], de);
const Vc = de, Hc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return de;
  },
  default: Vc
}, Symbol.toStringTag, { value: "Module" })), ys = /* @__PURE__ */ new Map(), Ka = (e) => `di-${e}`;
function Gc(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = ys.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await rn(e, t), o = new FontFace(Ka(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return ys.set(e, a), a;
}
async function Vn(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => Gc(a, t)));
}
function Hn(e) {
  ys.delete(e);
}
const jc = new Ko(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), Xc = new Ko(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var Yc = Object.defineProperty, qc = Object.getOwnPropertyDescriptor, Gn = (e) => {
  throw TypeError(e);
}, Va = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Yc(t, i, s), s;
}, Xs = (e, t, i) => t.has(e) || Gn("Cannot " + i), De = (e, t, i) => (Xs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vi = (e, t, i) => t.has(e) ? Gn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Qa = (e, t, i, a) => (Xs(e, t, "write to private field"), t.set(e, i), i), R = (e, t, i) => (Xs(e, t, "access private method"), i), ha, Di, Pi, Et, O, pi, st, vs, jn, Xn, da, Yn, qn, Jn;
function Jc(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : Zc(e.sourceUrl);
    default:
      return "Media library";
  }
}
function Zc(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let ot = class extends N {
  constructor() {
    super(), vi(this, O), vi(this, ha), vi(this, Di), vi(this, Pi), this._fonts = [], this._loading = !0, vi(this, Et, () => {
      var e;
      return (e = De(this, ha)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(La, (e) => {
      Qa(this, Di, e);
    }), this.consumeContext(lt, (e) => {
      Qa(this, Pi, e);
    }), this.consumeContext(Fe, (e) => {
      Qa(this, ha, e), e && R(this, O, pi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${R(this, O, vs)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf or .woff2, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${R(this, O, vs)}>
                  Add your first font
                </uui-button>
              </div>` : r`${W(this._fonts, (e) => e.key, (e) => R(this, O, Yn).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
ha = /* @__PURE__ */ new WeakMap();
Di = /* @__PURE__ */ new WeakMap();
Pi = /* @__PURE__ */ new WeakMap();
Et = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
pi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Ti(De(this, Et)), await Vn(this._fonts.map((e) => e.key), De(this, Et));
  } catch (e) {
    R(this, O, st).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
st = function(e, t, i) {
  var s;
  const a = i instanceof at ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = De(this, Pi)) == null || s.peek(e, { data: { headline: t, message: a } });
};
vs = async function() {
  var i, a;
  if (!De(this, Di)) return;
  const e = De(this, Di).open(this, Xc, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = De(this, Pi)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await R(this, O, pi).call(this));
};
jn = async function(e) {
  try {
    await sn(e.key, De(this, Et)), Hn(e.key), R(this, O, st).call(this, "positive", `'${e.familyName}' refreshed`), await R(this, O, pi).call(this);
  } catch (t) {
    R(this, O, st).call(this, "danger", "That font could not be refreshed", t);
  }
};
Xn = async function(e) {
  await Ws(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await nn(e.key, De(this, Et)), Hn(e.key), R(this, O, st).call(this, "positive", `'${e.familyName}' deleted`), await R(this, O, pi).call(this);
  } catch (t) {
    R(this, O, st).call(this, "danger", "That font could not be deleted", t);
  }
};
da = async function(e, t, i) {
  try {
    await on(e.key, t, i, De(this, Et)), this._editingKey = void 0, R(this, O, st).call(this, "positive", `'${t}' saved`), await R(this, O, pi).call(this);
  } catch (a) {
    R(this, O, st).call(this, "danger", "The font could not be saved", a);
  }
};
Yn = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${Jc(e)} · weight ${e.weight}
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
                  @click=${() => R(this, O, jn).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => R(this, O, Xn).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Ka(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? R(this, O, Jn).call(this, e) : R(this, O, qn).call(this, e)}
      </div>
    `;
};
qn = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${W(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
Jn = function(e) {
  const t = [...e.styles];
  return r`
      <div class="editor">
        <uui-input
          label="Family name"
          .value=${e.familyName}
          id="family-${e.key}">
        </uui-input>

        <uui-table>
          <uui-table-head>
            <uui-table-head-cell>Name</uui-table-head-cell>
            <uui-table-head-cell>Size</uui-table-head-cell>
            <uui-table-head-cell>Weight</uui-table-head-cell>
            <uui-table-head-cell></uui-table-head-cell>
          </uui-table-head>
          ${W(
    t,
    (i, a) => a,
    (i, a) => r`
              <uui-table-row>
                <uui-table-cell>
                  <uui-input
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
      t.splice(a, 1), R(this, O, da).call(this, e, e.familyName, t);
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), R(this, O, da).call(this, e, e.familyName, t);
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`);
    R(this, O, da).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t);
  }}>
            Save
          </uui-button>
        </div>
      </div>
    `;
};
ot.styles = A`
    :host {
      display: block;
    }

    .state {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-layout-3);
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
Va([
  m()
], ot.prototype, "_fonts", 2);
Va([
  m()
], ot.prototype, "_loading", 2);
Va([
  m()
], ot.prototype, "_editingKey", 2);
ot = Va([
  L("di-fonts-dashboard")
], ot);
const Qc = ot, eu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return ot;
  },
  default: Qc
}, Symbol.toStringTag, { value: "Module" }));
var tu = Object.defineProperty, iu = Object.getOwnPropertyDescriptor, Zn = (e) => {
  throw TypeError(e);
}, Xi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? iu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && tu(t, i, s), s;
}, Ys = (e, t, i) => t.has(e) || Zn("Cannot " + i), Xe = (e, t, i) => (Ys(e, t, "read from private field"), i ? i.call(e) : t.get(e)), sa = (e, t, i) => t.has(e) ? Zn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Oo = (e, t, i, a) => (Ys(e, t, "write to private field"), t.set(e, i), i), Bt = (e, t, i) => (Ys(e, t, "access private method"), i), pa, Kt, ri, Qe, Da, bs, Qn;
let We = class extends N {
  constructor() {
    super(), sa(this, Qe), sa(this, pa), sa(this, Kt), this._loading = !0, this._busy = !1, sa(this, ri, () => {
      var e;
      return (e = Xe(this, pa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(lt, (e) => {
      Oo(this, Kt, e);
    }), this.consumeContext(Fe, (e) => {
      Oo(this, pa, e), e && Bt(this, Qe, Da).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Bt(this, Qe, Da).call(this)}>Re-check</uui-button>
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
                ${W(
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
                        ${a.templateKey ? r`<a href=${ni(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Bt(this, Qe, Qn).call(this)}
      </umb-body-layout>
    `;
  }
};
pa = /* @__PURE__ */ new WeakMap();
Kt = /* @__PURE__ */ new WeakMap();
ri = /* @__PURE__ */ new WeakMap();
Qe = /* @__PURE__ */ new WeakSet();
Da = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Wa(Xe(this, ri)),
      mn(Xe(this, ri)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
bs = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await fn(Xe(this, ri)) : await gn(Xe(this, ri));
    (t = Xe(this, Kt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Xe(this, Kt)) == null || i.peek("warning", { data: { message: o } });
    await Bt(this, Qe, Da).call(this);
  } catch (s) {
    (a = Xe(this, Kt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Qn = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Bt(this, Qe, bs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Bt(this, Qe, bs).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
We.styles = A`
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
Xi([
  m()
], We.prototype, "_health", 2);
Xi([
  m()
], We.prototype, "_sync", 2);
Xi([
  m()
], We.prototype, "_loading", 2);
Xi([
  m()
], We.prototype, "_busy", 2);
We = Xi([
  L("di-health-dashboard")
], We);
const au = We, su = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return We;
  },
  default: au
}, Symbol.toStringTag, { value: "Module" }));
function ou(e, t) {
  const i = [], a = t.lockX ? void 0 : Io(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    nu(t),
    t.threshold
  ), s = t.lockY ? void 0 : Io(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    ru(t),
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
function nu(e) {
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
function ru(e) {
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
function Io(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
const er = 3, tr = 12, ir = 0.1, ar = 0.9;
function lu(e) {
  return Math.max(er, Math.min(tr, e));
}
function cu(e) {
  return Math.max(ir, Math.min(ar, e));
}
function uu(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = lu(t), s = 0.5 * cu(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let d = 0; d < o; d++) {
    const f = (-90 + d * n) * Math.PI / 180, C = e === "star" && d % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + C * Math.cos(f), y: 0.5 + C * Math.sin(f) });
  }
  return l;
}
function hu(e, t, i) {
  const a = uu(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
var du = Object.defineProperty, pu = Object.getOwnPropertyDescriptor, sr = (e) => {
  throw TypeError(e);
}, Ue = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? pu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && du(t, i, s), s;
}, qs = (e, t, i) => t.has(e) || sr("Cannot " + i), ge = (e, t, i) => (qs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), es = (e, t, i) => t.has(e) ? sr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ts = (e, t, i, a) => (qs(e, t, "write to private field"), t.set(e, i), i), X = (e, t, i) => (qs(e, t, "access private method"), i), pt, wi, M, Ha, Js, or, nr, rr, lr, Zs, Pa, cr, ur, hr, dr, pr, mr, fr, gr, yr;
const mu = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], is = 18;
let be = class extends N {
  constructor() {
    super(...arguments), es(this, M), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, es(this, pt), es(this, wi);
  }
  willUpdate() {
    this._box = X(this, M, or).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ge(this, wi) && ((t = ge(this, pt)) == null || t.disconnect(), ts(this, wi, e), e && (ge(this, pt) ?? ts(this, pt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ge(this, pt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ge(this, pt)) == null || e.disconnect(), ts(this, wi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${Bo({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${K({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ge(this, M, nr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...X(this, M, Zs).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      X(this, M, cr).call(this, t), X(this, M, Pa).call(this, t);
    }}>
        ${X(this, M, ur).call(this)}
      </div>

      ${this.selected ? X(this, M, gr).call(this, e) : p}
      ${this.showMeasured && this.measured ? X(this, M, yr).call(this) : p}
    `;
  }
};
pt = /* @__PURE__ */ new WeakMap();
wi = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
Ha = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Js = function() {
  return this.layer.rotation ?? 0;
};
or = function() {
  var s;
  const e = this.layer, t = e.size.width ?? X(this, M, rr).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? X(this, M, lr).call(this), a = Ba(ge(this, M, Ha), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
nr = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
rr = function() {
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
lr = function() {
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
Zs = function(e) {
  const t = ge(this, M, Js);
  if (t === 0) return {};
  const i = ge(this, M, Ha);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Pa = function(e, t) {
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
cr = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
ur = function() {
  switch (this.layer.type) {
    case "text":
      return X(this, M, hr).call(this);
    case "image":
      return X(this, M, pr).call(this);
    case "badges":
      return X(this, M, mr).call(this);
    default:
      return X(this, M, fr).call(this);
  }
};
hr = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || X(this, M, dr).call(this);
  return r`
      <div
        class="text"
        style=${K({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Ka(e.fontKey)}, sans-serif`,
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
dr = function() {
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
pr = function() {
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
mr = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", d = l && o, f = t.position ?? "below";
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
        ${W(
    Array.from({ length: Math.max(1, a) }, (C, Y) => Y),
    (C) => C,
    () => r`
            <div class=${Bo({ badge: !0, right: f === "right" })}>
              <div
                class="circle"
                style=${K({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${f === "none" ? p : r`<div
                    class="badge-label"
                    style=${K({
      ...f === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${Ka(t.fontKey)}, sans-serif`,
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
fr = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? `linear-gradient(${i.angle}deg, ${i.from}, ${i.to})` : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
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
  const n = hu(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${K({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${K({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
gr = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = ge(this, M, Ha), n = ge(this, M, Js), l = Pe(this.layer.position, "x") || Pe(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${K({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...X(this, M, Zs).call(this, e) })}>
        <span
          class="tag"
          style=${K(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${W(
    mu,
    (d) => d,
    (d) => r`
                  <span
                    class="handle ${d}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${d}"
                    @pointerdown=${(f) => X(this, M, Pa).call(this, f, d)}>
                  </span>
                `
  )}
              <span class="stalk" style=${K({ height: `${is}px`, top: `${-is}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${K({ top: `${-is}px` })}
                @pointerdown=${(d) => X(this, M, Pa).call(this, d, "rotate")}>
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
yr = function() {
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
be.styles = A`
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
Ue([
  v({ type: Object })
], be.prototype, "layer", 2);
Ue([
  v({ type: Number })
], be.prototype, "scale", 2);
Ue([
  v({ type: Boolean, reflect: !0 })
], be.prototype, "selected", 2);
Ue([
  v({ type: Object })
], be.prototype, "measured", 2);
Ue([
  v({ type: Boolean })
], be.prototype, "showMeasured", 2);
Ue([
  v({ type: String })
], be.prototype, "resolvedText", 2);
Ue([
  v({ attribute: !1 })
], be.prototype, "resolvedPosition", 2);
Ue([
  m()
], be.prototype, "_box", 2);
be = Ue([
  L("di-layer-box")
], be);
var fu = Object.defineProperty, gu = Object.getOwnPropertyDescriptor, vr = (e) => {
  throw TypeError(e);
}, Qs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && fu(t, i, s), s;
}, yu = (e, t, i) => t.has(e) || vr("Cannot " + i), vu = (e, t, i) => t.has(e) ? vr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), bu = (e, t, i) => (yu(e, t, "access private method"), i), _s, br;
let Mi = class extends N {
  constructor() {
    super(...arguments), vu(this, _s), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${W(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => bu(this, _s, br).call(this, e)
    )}`;
  }
};
_s = /* @__PURE__ */ new WeakSet();
br = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Mi.styles = A`
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
Qs([
  v({ type: Array })
], Mi.prototype, "guides", 2);
Qs([
  v({ type: Number })
], Mi.prototype, "scale", 2);
Mi = Qs([
  L("di-guides")
], Mi);
var _u = Object.defineProperty, wu = Object.getOwnPropertyDescriptor, _r = (e) => {
  throw TypeError(e);
}, Yi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && _u(t, i, s), s;
}, $u = (e, t, i) => t.has(e) || _r("Cannot " + i), xu = (e, t, i) => t.has(e) ? _r("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ao = (e, t, i) => ($u(e, t, "access private method"), i), ma, ws;
let q = class extends N {
  constructor() {
    super(...arguments), xu(this, ma), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Ao(this, ma, ws).call(this, "top"), Ao(this, ma, ws).call(this, "left");
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
ma = /* @__PURE__ */ new WeakSet();
ws = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : q.thickness) * o, t.height = (e === "top" ? q.thickness : s) * o, t.style.width = `${e === "top" ? s : q.thickness}px`, t.style.height = `${e === "top" ? q.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const d = Math.round(l * this.scale) + 0.5, f = l % 100 === 0, C = f ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(d, q.thickness - C), i.lineTo(d, q.thickness)) : (i.moveTo(q.thickness - C, d), i.lineTo(q.thickness, d)), i.stroke(), f && l > 0 && (e === "top" ? i.fillText(String(l), d + 2, 9) : (i.save(), i.translate(9, d - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
q.thickness = 20;
q.styles = A`
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
Yi([
  v({ type: Number })
], q.prototype, "canvasWidth", 2);
Yi([
  v({ type: Number })
], q.prototype, "canvasHeight", 2);
Yi([
  v({ type: Number })
], q.prototype, "scale", 2);
Yi([
  v({ type: Object })
], q.prototype, "pointer", 2);
q = Yi([
  L("di-rulers")
], q);
var ku = Object.defineProperty, Su = Object.getOwnPropertyDescriptor, wr = (e) => {
  throw TypeError(e);
}, ie = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Su(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ku(t, i, s), s;
}, eo = (e, t, i) => t.has(e) || wr("Cannot " + i), I = (e, t, i) => (eo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ae = (e, t, i) => t.has(e) ? wr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fa = (e, t, i, a) => (eo(e, t, "write to private field"), t.set(e, i), i), z = (e, t, i) => (eo(e, t, "access private method"), i), mt, $i, it, E, to, $s, xs, Ga, io, ks, $r, xr, ao, kr, Sr, Ss, ga, Tr, Cr, Lt, so, Ts, Cs, Es, Ds, Ps, Ms, Er;
const Tu = 6, Dr = 20, Cu = 15, Eu = 0.1;
let J = class extends N {
  constructor() {
    super(...arguments), ae(this, E), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ae(this, mt), ae(this, $i), ae(this, it, /* @__PURE__ */ new Map()), ae(this, Ss, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = z(this, E, io).call(this, t), a = z(this, E, ks).call(this, t), s = z(this, E, $r).call(this, t), o = z(this, E, Ga).call(this, e.detail.startX, e.detail.startY);
      fa(this, mt, {
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
    }), ae(this, ga, (e) => {
      var ta, xo;
      this._pointer = z(this, E, xs).call(this, e.clientX, e.clientY);
      const t = I(this, mt);
      if (!t) return;
      const i = this.template.layers.find((fi) => fi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        z(this, E, Cr).call(this, i, t, e);
        return;
      }
      const o = Pe(i.position, "x"), n = Pe(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        z(this, E, Tr).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let d = t.handle ? z(this, E, so).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (d = { ...d, x: t.startBox.x, width: (ta = t.handle) != null && ta.includes("w") ? t.startBox.width : d.width }), n && (d = { ...d, y: t.startBox.y, height: (xo = t.handle) != null && xo.includes("n") ? t.startBox.height : d.height });
      const f = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, C = l !== 0 ? { x: d.x + f.x, y: d.y + f.y, width: t.startExtent.width, height: t.startExtent.height } : d, we = this.snapEnabled && !e.altKey ? ou(C, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((fi) => fi.key !== i.key).map((fi) => z(this, E, ks).call(this, fi)),
        threshold: Tu / this.scale,
        lockX: o,
        lockY: n
      }) : {
        box: {
          ...C,
          x: o ? C.x : Math.round(C.x),
          y: n ? C.y : Math.round(C.y)
        },
        guides: []
      };
      this._guides = we.guides;
      const Oe = l !== 0 ? { ...d, x: we.box.x - f.x, y: we.box.y - f.y } : we.box, Ve = bc(Oe, i.position);
      o && (Ve.x = i.position.x), n && (Ve.y = i.position.y);
      const Ie = { position: Ve };
      t.handle && (Ie.size = {
        width: Math.max(1, Math.round(Oe.width)),
        height: Math.max(1, Math.round(Oe.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Ie } })
      );
    }), ae(this, Lt, () => {
      if (!I(this, mt)) return;
      const e = I(this, mt).moved;
      fa(this, mt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ae(this, Ts, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ae(this, Cs, () => {
      this._dropTarget = !1;
    }), ae(this, Es, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = z(this, E, xs).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y }
        })
      );
    }), ae(this, Ds, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ae(this, Ps, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => kn(t.position)) && this.requestUpdate();
    }), ae(this, Ms, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), fa(this, $i, new ResizeObserver(() => z(this, E, $s).call(this))), I(this, $i).observe(this), window.addEventListener("pointermove", I(this, ga)), window.addEventListener("pointerup", I(this, Lt)), window.addEventListener("pointercancel", I(this, Lt));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = I(this, $i)) == null || e.disconnect(), window.removeEventListener("pointermove", I(this, ga)), window.removeEventListener("pointerup", I(this, Lt)), window.removeEventListener("pointercancel", I(this, Lt));
  }
  updated(e) {
    z(this, E, $s).call(this), e.has("zoom") && z(this, E, to).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = I(this, it).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    z(this, E, xr).call(this);
    const s = this.showRulers ? Dr : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${I(this, Ds)}
        @dragover=${I(this, Ts)}
        @dragleave=${I(this, Cs)}
        @drop=${I(this, Es)}
        @di-layer-drag-start=${I(this, Ss)}
        @di-layer-box-resize=${I(this, Ps)}>
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
            style=${K({ background: e.background })}
            @pointerdown=${I(this, Ms)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${K({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${W(
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
                  .resolvedPosition=${(l = I(this, it).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? z(this, E, Er).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
mt = /* @__PURE__ */ new WeakMap();
$i = /* @__PURE__ */ new WeakMap();
it = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
to = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
$s = function() {
  const e = this.renderRoot.querySelector(".viewport");
  if (!e || !this.template) return;
  const t = 48 + (this.showRulers ? Dr : 0), i = {
    width: Math.max(1, e.clientWidth - t),
    height: Math.max(1, e.clientHeight - t)
  }, a = Math.min(
    i.width / this.template.canvas.width,
    i.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(a - this._fitScale) > 1e-3 && (this._fitScale = a, z(this, E, to).call(this));
};
xs = function(e, t) {
  const i = z(this, E, Ga).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Ga = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
io = function(e) {
  const t = I(this, it).get(e.key);
  if (t) return t.box;
  const i = z(this, E, ao).call(this, e), a = Ba(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
ks = function(e) {
  const t = I(this, it).get(e.key);
  return t ? t.extent : xn(z(this, E, io).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
$r = function(e) {
  var t;
  return ((t = I(this, it).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
xr = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  fa(this, it, Sc(
    this.template.layers,
    (i) => z(this, E, ao).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
ao = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? z(this, E, kr).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? z(this, E, Sr).call(this, e, i)
  };
};
kr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Sr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Ss = /* @__PURE__ */ new WeakMap();
ga = /* @__PURE__ */ new WeakMap();
Tr = function(e, t, i, a, s, o, n, l) {
  const d = t.startRotation, f = t.startPosition, C = _c(a, s, 0, 0, d);
  let Y = z(this, E, so).call(this, t.startBox, i, C.x, C.y, o);
  n && (Y = { ...Y, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : Y.width }), l && (Y = { ...Y, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : Y.height });
  const we = Math.max(1, Math.round(Y.width)), Oe = Math.max(1, Math.round(Y.height)), Ve = Ks(Y.x, Y.y, we, Oe, f.anchor), Ie = Nt(Ve.x, Ve.y, f.x, f.y, d), ta = {
    ...e.position,
    x: n ? e.position.x : Math.round(Ie.x),
    y: l ? e.position.y : Math.round(Ie.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: ta, size: { width: we, height: Oe } } }
    })
  );
};
Cr = function(e, t, i) {
  const a = t.startPosition, s = z(this, E, Ga).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, d = i.shiftKey ? Cu : Eu, f = $n(Math.round(l / d) * d);
  this._guides = [], f !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: f } }
    })
  );
};
Lt = /* @__PURE__ */ new WeakMap();
so = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: d } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, d = e.height - a), t.includes("s") && (d = e.height + a), s && e.width > 0 && e.height > 0) {
    const f = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(d - e.height) ? d = l / f : l = d * f, t.includes("n") && (n = e.y + e.height - d), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, d) };
};
Ts = /* @__PURE__ */ new WeakMap();
Cs = /* @__PURE__ */ new WeakMap();
Es = /* @__PURE__ */ new WeakMap();
Ds = /* @__PURE__ */ new WeakMap();
Ps = /* @__PURE__ */ new WeakMap();
Ms = /* @__PURE__ */ new WeakMap();
Er = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${K({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
J.styles = A`
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
ie([
  v({ type: Object })
], J.prototype, "template", 2);
ie([
  v({ type: String })
], J.prototype, "selectedLayerKey", 2);
ie([
  v({ type: Object })
], J.prototype, "baseImageUrl", 2);
ie([
  v({ type: Array })
], J.prototype, "serverBounds", 2);
ie([
  v({ type: Boolean })
], J.prototype, "showMeasured", 2);
ie([
  v({ type: Boolean })
], J.prototype, "snapEnabled", 2);
ie([
  v({ type: Boolean })
], J.prototype, "showRulers", 2);
ie([
  v({ type: Boolean })
], J.prototype, "showSafeArea", 2);
ie([
  v({ type: Number })
], J.prototype, "zoom", 2);
ie([
  m()
], J.prototype, "_fitScale", 2);
ie([
  m()
], J.prototype, "_guides", 2);
ie([
  m()
], J.prototype, "_pointer", 2);
ie([
  m()
], J.prototype, "_dropTarget", 2);
J = ie([
  L("di-designer-canvas")
], J);
var Du = Object.defineProperty, Pu = Object.getOwnPropertyDescriptor, Pr = (e) => {
  throw TypeError(e);
}, oo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Pu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Du(t, i, s), s;
}, Mr = (e, t, i) => t.has(e) || Pr("Cannot " + i), Mu = (e, t, i) => (Mr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), zu = (e, t, i) => t.has(e) ? Pr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Te = (e, t, i) => (Mr(e, t, "access private method"), i), le, zr, Or, Ir, Ar, Lr, gt;
const Lo = {
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
let zi = class extends N {
  constructor() {
    super(...arguments), zu(this, le), this.properties = [], this._search = "";
  }
  render() {
    const e = Ou(Mu(this, le, zr));
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

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : W(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => Te(this, le, Ar).call(this, t, i)
    )}

        ${Te(this, le, Lr).call(this)}
      </div>
    `;
  }
};
le = /* @__PURE__ */ new WeakSet();
zr = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Or = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Ir = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Ar = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${W(
    t,
    (i) => i.alias,
    (i) => Te(this, le, gt).call(this, i.name, Lo[i.classification] ?? Lo.other, i.classification, { kind: "property", property: i })
  )}
      </div>
    `;
};
Lr = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Te(this, le, gt).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Te(this, le, gt).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Te(this, le, gt).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Te(this, le, gt).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Te(this, le, gt).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
gt = function(e, t, i, a) {
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        @dragstart=${(s) => Te(this, le, Ir).call(this, s, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${e}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label="Add ${e} to the canvas"
          @click=${() => Te(this, le, Or).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
zi.styles = A`
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

    .empty {
      margin: 0;
      color: var(--uui-color-text-alt);
      font-size: 13px;
    }
  `;
oo([
  v({ type: Array })
], zi.prototype, "properties", 2);
oo([
  m()
], zi.prototype, "_search", 2);
zi = oo([
  L("di-property-palette")
], zi);
function Ou(e) {
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
var Iu = Object.defineProperty, Au = Object.getOwnPropertyDescriptor, Rr = (e) => {
  throw TypeError(e);
}, ja = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Au(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Iu(t, i, s), s;
}, Wr = (e, t, i) => t.has(e) || Rr("Cannot " + i), Ye = (e, t, i) => (Wr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Lu = (e, t, i) => t.has(e) ? Rr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ki = (e, t, i) => (Wr(e, t, "access private method"), i), Z, Oi, Si, Xa, Nr, Fr;
let li = class extends N {
  constructor() {
    super(...arguments), Lu(this, Z), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Ye(this, Z, Oi)};opacity:${Ye(this, Z, Si)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => ki(this, Z, Xa).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Ye(this, Z, Oi)}
                  @input=${(e) => ki(this, Z, Nr).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Ye(this, Z, Si))}
                    @input=${(e) => ki(this, Z, Fr).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Ye(this, Z, Si) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
Z = /* @__PURE__ */ new WeakSet();
Oi = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
Si = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
Xa = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Nr = function(e) {
  const t = Ye(this, Z, Si);
  ki(this, Z, Xa).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${Ur(t)}`);
};
Fr = function(e) {
  ki(this, Z, Xa).call(this, e >= 0.999 ? Ye(this, Z, Oi).toUpperCase() : `${Ye(this, Z, Oi).toUpperCase()}${Ur(e)}`);
};
li.styles = A`
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
ja([
  v({ type: String })
], li.prototype, "value", 2);
ja([
  v({ type: String })
], li.prototype, "label", 2);
ja([
  m()
], li.prototype, "_open", 2);
li = ja([
  L("di-colour-input")
], li);
const Ur = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Ru = Object.defineProperty, Wu = Object.getOwnPropertyDescriptor, Br = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Wu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ru(t, i, s), s;
};
const Ro = {
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
let Ma = class extends N {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${W(
      wn,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Ro[e]}
              title=${Ro[e]}
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
Ma.styles = A`
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
Br([
  v({ type: String })
], Ma.prototype, "value", 2);
Ma = Br([
  L("di-anchor-picker")
], Ma);
const g = {
  /** Font size, in points. Beyond 800 the renderer is being asked for a poster, not an OG image. */
  fontSize: { min: 1, max: 800 },
  /** Position. Negative is legitimate - a layer can be deliberately bled off the canvas edge. */
  x: { min: -5e3, max: 5e3 },
  y: { min: -5e3, max: 5e3 },
  /** Any box dimension. Zero is not a size; "auto" is expressed by clearing the field, not by 0. */
  width: { min: 1, max: 5e3 },
  height: { min: 1, max: 5e3 },
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
  /** Opacity is a fraction, and always was bounded - it just was not enforced. */
  opacity: { min: 0, max: 1 },
  /**
   * These two are not a UI preference: they are the polygon/star geometry contract, shared with
   * the server and already clamped by `clampSides` / `clampInnerRatio`. Re-exported through the
   * table so the inspector still reads every bound from one place.
   */
  sides: { min: er, max: tr },
  innerRatio: { min: ir, max: ar }
};
function Nu(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
var Fu = Object.defineProperty, Uu = Object.getOwnPropertyDescriptor, Kr = (e) => {
  throw TypeError(e);
}, ut = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Uu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Fu(t, i, s), s;
}, Bu = (e, t, i) => t.has(e) || Kr("Cannot " + i), Ku = (e, t, i) => t.has(e) ? Kr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Vu = (e, t, i) => (Bu(e, t, "access private method"), i), zs, Vr;
let ze = class extends N {
  constructor() {
    super(...arguments), Ku(this, zs), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${Vu(this, zs, Vr)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
zs = /* @__PURE__ */ new WeakSet();
Vr = function(e) {
  const t = e.target, i = t.value, a = Nu(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
ze.styles = A`
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
ut([
  v({ type: Number })
], ze.prototype, "value", 2);
ut([
  v({ type: String })
], ze.prototype, "label", 2);
ut([
  v({ type: String })
], ze.prototype, "suffix", 2);
ut([
  v({ type: Number })
], ze.prototype, "step", 2);
ut([
  v({ type: Number })
], ze.prototype, "min", 2);
ut([
  v({ type: Number })
], ze.prototype, "max", 2);
ut([
  v({ type: String })
], ze.prototype, "placeholder", 2);
ze = ut([
  L("di-number-field")
], ze);
var Hu = Object.defineProperty, Gu = Object.getOwnPropertyDescriptor, Hr = (e) => {
  throw TypeError(e);
}, qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Hu(t, i, s), s;
}, ju = (e, t, i) => t.has(e) || Hr("Cannot " + i), Xu = (e, t, i) => t.has(e) ? Hr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (ju(e, t, "access private method"), i), u, y, He, Gr, jr, Xr, Yr, qr, Jr, Zr, Qr, Os, el, ya, tl, il, mi, no, al;
let Dt = class extends N {
  constructor() {
    super(...arguments), Xu(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, u, jr).call(this, this.layer) : h(this, u, Gr).call(this)}</div>` : p;
  }
};
u = /* @__PURE__ */ new WeakSet();
y = function(e) {
  this.layer && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: this.layer.key, patch: e }
    })
  );
};
He = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Gr = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => h(this, u, He).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => h(this, u, He).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Background</span>
          <di-colour-input
            label="Canvas background"
            .value=${e.background}
            @change=${(t) => h(this, u, He).call(this, { background: t.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${sl(e.baseImage.kind)}
              @change=${(t) => h(this, u, He).call(this, {
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
                @change=${(t) => h(this, u, He).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${h(this, u, mi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, u, He).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${te(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => h(this, u, He).call(this, { baseImageFit: t.target.value })}>
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
jr = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, u, y).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, u, Xr).call(this, e) : p}
      ${e.type === "text" ? h(this, u, Yr).call(this, e) : p}
      ${e.type === "image" ? h(this, u, qr).call(this, e) : p}
      ${e.type === "badges" ? h(this, u, Jr).call(this, e) : p}
      ${e.type === "rect" ? h(this, u, Zr).call(this, e) : p}
      ${h(this, u, Qr).call(this, e)} ${h(this, u, il).call(this, e)}
    `;
};
Xr = function(e) {
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
            @change=${(i) => h(this, u, y).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, mi).call(this, t.propertyAlias ?? "", (i) => h(this, u, y).call(this, { binding: { ...t, propertyAlias: i } }))}
            </label>` : p}

        ${t.kind === "date" ? r`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => h(this, u, y).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "static" || t.kind === "expression" ? r`<label class="field">
              <span>${t.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => h(this, u, y).call(this, {
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
              @change=${(i) => h(this, u, y).call(this, { prefix: i.target.value })}>
            </uui-input>
          </label>
          <label class="field">
            <span>Suffix</span>
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => h(this, u, y).call(this, { suffix: i.target.value })}>
            </uui-input>
          </label>
        </div>
      </uui-box>
    `;
};
Yr = function(e) {
  const t = e.style, i = (a) => h(this, u, y).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, u, no).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, u, al).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
qr = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${sl(t.kind)}
            @change=${(a) => h(this, u, y).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, mi).call(this, t.propertyAlias ?? "", (a) => h(this, u, y).call(this, { source: { ...t, propertyAlias: a } }), "media")}
            </label>` : p}

        ${t.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => h(this, u, y).call(this, {
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
            @change=${(a) => h(this, u, y).call(this, { fit: a.target.value })}>
          </uui-select>
        </label>

        <di-number-field
          .min=${g.cornerRadius.min}
          .max=${g.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => h(this, u, y).call(this, { cornerRadius: a.detail.value ?? 0 })}>
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
    h(this, u, y).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => h(this, u, y).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : p}
          </div>
        </label>
      </uui-box>
    `;
};
Jr = function(e) {
  const t = (s) => h(this, u, y).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, u, y).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, u, y).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, u, mi).call(this, e.itemsPropertyAlias, (s) => h(this, u, y).call(this, { itemsPropertyAlias: s }))}
        </label>

        <div class="pair">
          <di-number-field
            .min=${g.maxItems.min}
            .max=${g.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => h(this, u, y).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${g.gap.min}
            .max=${g.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => h(this, u, y).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${e.direction}
            .options=${te(["horizontal", "vertical"], e.direction)}
            @change=${(s) => h(this, u, y).call(this, { direction: s.target.value })}>
          </uui-select>
        </label>

        ${e.direction === "horizontal" ? r`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => h(this, u, y).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </label>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${g.rowGap.min}
                      .max=${g.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => h(this, u, y).call(this, { rowGap: s.detail.value ?? 20 })}>
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
                  .options=${h(this, u, no).call(this, e.label.fontKey)}
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
Zr = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${te(["rectangle", "ellipse", "polygon", "star"], t)}
            @change=${(s) => h(this, u, y).call(this, { shape: s.target.value })}>
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
                  @change=${(s) => h(this, u, y).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${g.innerRatio.min}
                      .max=${g.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => h(this, u, y).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : p}
              </div>
            ` : p}

        <label class="field inline">
          <span>Fill</span>
          <uui-toggle
            ?checked=${i}
            @change=${(s) => h(this, u, y).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </label>

        ${i ? r`<label class="field">
              <span>Fill colour</span>
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => h(this, u, y).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </label>` : p}

        <label class="field inline">
          <span>Gradient</span>
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => h(this, u, y).call(this, {
    gradient: s.target.checked ? { from: "#000000CC", to: "#00000000", angle: 180 } : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? r`
              <div class="pair">
                <di-colour-input
                  label="From"
                  .value=${e.gradient.from}
                  @change=${(s) => h(this, u, y).call(this, { gradient: { ...e.gradient, from: s.detail.value } })}>
                </di-colour-input>
                <di-colour-input
                  label="To"
                  .value=${e.gradient.to}
                  @change=${(s) => h(this, u, y).call(this, { gradient: { ...e.gradient, to: s.detail.value } })}>
                </di-colour-input>
              </div>
              <di-number-field
                .min=${g.gradientAngle.min}
                .max=${g.gradientAngle.max}
                label="Angle"
                suffix="°"
                .value=${e.gradient.angle}
                @change=${(s) => h(this, u, y).call(this, { gradient: { ...e.gradient, angle: s.detail.value ?? 180 } })}>
              </di-number-field>
            ` : p}

        ${t === "rectangle" ? r`<di-number-field
            .min=${g.cornerRadius.min}
            .max=${g.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => h(this, u, y).call(this, { cornerRadius: s.detail.value ?? 0 })}>
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
    h(this, u, y).call(this, {
      border: o > 0 ? { width: o, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => h(this, u, y).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : p}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </label>
      </uui-box>
    `;
};
Qr = function(e) {
  const t = Pe(e.position, "x"), i = Pe(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, u, Os).call(this, e, "x")} ${h(this, u, Os).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, u, tl).call(this, e, s.detail.value)}>
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
            @change=${(s) => h(this, u, y).call(this, { rotation: $n(s.detail.value ?? 0) })}>
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
            @change=${(s) => h(this, u, y).call(this, { size: { ...e.size, width: s.detail.value } })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => h(this, u, y).call(this, { size: { ...e.size, height: s.detail.value } })}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
Os = function(e, t) {
  const i = Pe(e.position, t), a = Sa(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => h(this, u, el).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => h(this, u, ya).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${te(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => h(this, u, ya).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${g.referenceGap.min}
                .max=${g.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => h(this, u, ya).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? g.x.min : g.y.min}
                .max=${t === "x" ? g.x.max : g.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => h(this, u, y).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
el = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Pe(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && h(this, u, y).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: wc
      }
    }
  });
};
ya = function(e, t, i) {
  const a = Sa(e.position, t);
  a && h(this, u, y).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
tl = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? vc(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, u, y).call(this, { position: s });
};
il = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <label class="field inline">
          <span>Visible</span>
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => h(this, u, y).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </label>

        <label class="field inline">
          <span>Locked</span>
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => h(this, u, y).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </label>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${g.opacity.min}
          .max=${g.opacity.max}
          .value=${e.opacity}
          @change=${(t) => h(this, u, y).call(this, { opacity: t.detail.value ?? 1 })}>
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
            @change=${(t) => h(this, u, y).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </label>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<label class="field">
              <span>Controlled by</span>
              ${h(this, u, mi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, u, y).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
mi = function(e, t, i) {
  const a = i ? this.properties.filter((s) => s.classification === i) : this.properties;
  return r`
      <uui-select
        .value=${e}
        .options=${[
    { name: "- none -", value: "" },
    ...a.map((s) => ({
      name: `${s.name} (${s.alias})`,
      value: s.alias,
      selected: s.alias === e
    }))
  ]}
        @change=${(s) => t(s.target.value)}>
      </uui-select>
    `;
};
no = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
al = function(e, t, i) {
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
Dt.styles = A`
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
qi([
  v({ type: Object })
], Dt.prototype, "template", 2);
qi([
  v({ type: Object })
], Dt.prototype, "layer", 2);
qi([
  v({ type: Array })
], Dt.prototype, "properties", 2);
qi([
  v({ type: Array })
], Dt.prototype, "fonts", 2);
Dt = qi([
  L("di-layer-inspector")
], Dt);
function te(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function sl(e) {
  return te(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var Yu = Object.defineProperty, qu = Object.getOwnPropertyDescriptor, ol = (e) => {
  throw TypeError(e);
}, Ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Yu(t, i, s), s;
}, Ju = (e, t, i) => t.has(e) || ol("Cannot " + i), Zu = (e, t, i) => t.has(e) ? ol("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $e = (e, t, i) => (Ju(e, t, "access private method"), i), ue, yt, nl, rl, ll, cl;
const Qu = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Pt = class extends N {
  constructor() {
    super(...arguments), Zu(this, ue), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${$e(this, ue, ll)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : W(
      e,
      (t) => t.key,
      (t, i) => $e(this, ue, cl).call(this, t, i)
    )}

        <div class="row background">
          <uui-icon name="icon-picture"></uui-icon>
          <span class="name">Background</span>
          <uui-icon name="icon-lock" title="The base image and canvas colour are edited in the inspector"></uui-icon>
        </div>
      </div>
    `;
  }
};
ue = /* @__PURE__ */ new WeakSet();
yt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
nl = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
rl = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
ll = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  $e(this, ue, yt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
cl = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => $e(this, ue, nl).call(this, a, e.key)}
        @dragover=${(a) => $e(this, ue, rl).call(this, a, t)}
        @click=${() => $e(this, ue, yt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Qu[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          look="secondary"
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), $e(this, ue, yt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name=${e.isVisible ? "icon-eye" : "icon-eye-off"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), $e(this, ue, yt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), $e(this, ue, yt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), $e(this, ue, yt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Pt.styles = A`
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
Ji([
  v({ type: Array })
], Pt.prototype, "layers", 2);
Ji([
  v({ type: String })
], Pt.prototype, "selectedLayerKey", 2);
Ji([
  m()
], Pt.prototype, "_dragKey", 2);
Ji([
  m()
], Pt.prototype, "_dropIndex", 2);
Pt = Ji([
  L("di-layers-panel")
], Pt);
var eh = Object.defineProperty, th = Object.getOwnPropertyDescriptor, ul = (e) => {
  throw TypeError(e);
}, Be = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? th(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && eh(t, i, s), s;
}, ih = (e, t, i) => t.has(e) || ul("Cannot " + i), ah = (e, t, i) => t.has(e) ? ul("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), me = (e, t, i) => (ih(e, t, "access private method"), i), se, Ge, xi;
let _e = class extends N {
  constructor() {
    super(...arguments), ah(this, se), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1;
  }
  render() {
    return r`
      <div class="toolbar">
        <div class="zoom">
          <!-- Stepping multiplies the *effective* scale, so stepping up out of Fit lands one
               step above what is on screen rather than jumping to 125%. -->
          <uui-button
            compact
            look="secondary"
            label="Zoom out"
            @click=${() => me(this, se, Ge).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-remove"></uui-icon>
          </uui-button>
          <span class="value">${Math.round(this.effectiveScale * 100)}%</span>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => me(this, se, Ge).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-add"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => me(this, se, Ge).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${me(this, se, xi).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${me(this, se, xi).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${me(this, se, xi).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${me(this, se, xi).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => me(this, se, Ge).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => me(this, se, Ge).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => me(this, se, Ge).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
se = /* @__PURE__ */ new WeakSet();
Ge = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
xi = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => me(this, se, Ge).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
_e.styles = A`
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

    .value {
      min-width: 44px;
      text-align: center;
      font-variant-numeric: tabular-nums;
      font-size: 12px;
    }
  `;
Be([
  v({ type: Number })
], _e.prototype, "effectiveScale", 2);
Be([
  v({ type: Boolean })
], _e.prototype, "snapEnabled", 2);
Be([
  v({ type: Boolean })
], _e.prototype, "showRulers", 2);
Be([
  v({ type: Boolean })
], _e.prototype, "showSafeArea", 2);
Be([
  v({ type: Boolean })
], _e.prototype, "showMeasured", 2);
Be([
  v({ type: Boolean })
], _e.prototype, "canUndo", 2);
Be([
  v({ type: Boolean })
], _e.prototype, "canRedo", 2);
Be([
  v({ type: Boolean })
], _e.prototype, "previewing", 2);
_e = Be([
  L("di-canvas-toolbar")
], _e);
var sh = Object.defineProperty, oh = Object.getOwnPropertyDescriptor, hl = (e) => {
  throw TypeError(e);
}, Zi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? oh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && sh(t, i, s), s;
}, ro = (e, t, i) => t.has(e) || hl("Cannot " + i), re = (e, t, i) => (ro(e, t, "read from private field"), t.get(e)), bi = (e, t, i) => t.has(e) ? hl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ii = (e, t, i, a) => (ro(e, t, "write to private field"), t.set(e, i), i), Ut = (e, t, i) => (ro(e, t, "access private method"), i), et, Ai, Vt, St, qe, lo, va, dl;
const nh = 400;
let Mt = class extends N {
  constructor() {
    super(), bi(this, qe), bi(this, et), bi(this, Ai), bi(this, Vt), bi(this, St), this._loading = !1, this._collapsed = !1, this.consumeContext(Ot, (e) => {
      Ii(this, et, e), e && (this.observe(e.template, (t) => {
        t && Ut(this, qe, va).call(this, t);
      }), this.observe(e.sampleContentKey, () => {
        var i;
        const t = (i = re(this, et)) == null ? void 0 : i.getData();
        t && Ut(this, qe, va).call(this, t);
      }));
    });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(re(this, Ai)), (e = re(this, Vt)) == null || e.abort(), Ut(this, qe, lo).call(this);
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
        const t = (e = re(this, et)) == null ? void 0 : e.getData();
        t && Ut(this, qe, va).call(this, t);
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
et = /* @__PURE__ */ new WeakMap();
Ai = /* @__PURE__ */ new WeakMap();
Vt = /* @__PURE__ */ new WeakMap();
St = /* @__PURE__ */ new WeakMap();
qe = /* @__PURE__ */ new WeakSet();
lo = function() {
  re(this, St) && (URL.revokeObjectURL(re(this, St)), Ii(this, St, void 0));
};
va = function(e) {
  this._collapsed || (window.clearTimeout(re(this, Ai)), Ii(this, Ai, window.setTimeout(() => void Ut(this, qe, dl).call(this, e), nh)));
};
dl = async function(e) {
  var t;
  if (re(this, et)) {
    (t = re(this, Vt)) == null || t.abort(), Ii(this, Vt, new AbortController()), this._loading = !0, this._error = void 0;
    try {
      const i = (re(this, et).getData(), void 0), a = await Fs(
        e,
        { signal: re(this, Vt).signal, useSampleData: !0, contentKey: i },
        re(this, et).getToken
      );
      Ut(this, qe, lo).call(this), Ii(this, St, URL.createObjectURL(a)), this._url = re(this, St);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      this._loading = !1;
    }
  }
};
Mt.styles = A`
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
Zi([
  m()
], Mt.prototype, "_url", 2);
Zi([
  m()
], Mt.prototype, "_loading", 2);
Zi([
  m()
], Mt.prototype, "_error", 2);
Zi([
  m()
], Mt.prototype, "_collapsed", 2);
Mt = Zi([
  L("di-preview-strip")
], Mt);
var rh = Object.defineProperty, lh = Object.getOwnPropertyDescriptor, pl = (e) => {
  throw TypeError(e);
}, Q = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? lh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && rh(t, i, s), s;
}, co = (e, t, i) => t.has(e) || pl("Cannot " + i), _ = (e, t, i) => (co(e, t, "read from private field"), i ? i.call(e) : t.get(e)), It = (e, t, i) => t.has(e) ? pl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), za = (e, t, i, a) => (co(e, t, "write to private field"), t.set(e, i), i), ee = (e, t, i) => (co(e, t, "access private method"), i), x, Li, Ri, Ht, F, Is, uo, ml, As, fl, gl, yl, Ls, vl, bl, _l, ho, wl, ba;
const ch = 400;
let V = class extends N {
  constructor() {
    super(), It(this, F), It(this, x), It(this, Li), It(this, Ri), It(this, Ht), this._properties = [], this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, It(this, ba, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = _(this, x);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = _(this, F, Is);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), ee(this, F, As).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, d = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, f = Pe(s.position, "x") ? 0 : l, C = Pe(s.position, "y") ? 0 : d;
            if (f === 0 && C === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + f, y: s.position.y + C }
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
    }), this.consumeContext(La, (e) => {
      za(this, Li, e);
    }), this.consumeContext(Ot, (e) => {
      za(this, x, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (ee(this, F, fl).call(this, t), ee(this, F, gl).call(this, t), ee(this, F, yl).call(this));
      }), this.observe(e.selectedLayerKey, (t) => {
        this._selectedKey = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
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
    super.connectedCallback(), window.addEventListener("keydown", _(this, ba));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", _(this, ba)), window.clearTimeout(_(this, Ri)), (e = _(this, Ht)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = _(this, x)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = _(this, x)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = _(this, x)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => ee(this, F, As).call(this, e.detail.key)}
        @di-layer-detach=${(e) => ee(this, F, ml).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = _(this, x)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = _(this, x)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = _(this, x)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = _(this, x)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = _(this, x)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = _(this, x)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => ee(this, F, Ls).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => ee(this, F, Ls).call(this, e.detail.payload, e.detail.x, e.detail.y)}
        @di-pick-base-image=${ee(this, F, bl)}
        @di-pick-layer-image=${(e) => ee(this, F, _l).call(this, e.detail.key)}
        @di-use-image-size=${ee(this, F, wl)}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(0.1, Math.min(4, e.detail.zoom));
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
      return (e = _(this, x)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = _(this, x)) == null ? void 0 : e.redo();
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
            .layer=${_(this, F, Is)}
            .properties=${this._properties}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    ` : r`<div class="state"><uui-loader></uui-loader></div>`;
  }
};
x = /* @__PURE__ */ new WeakMap();
Li = /* @__PURE__ */ new WeakMap();
Ri = /* @__PURE__ */ new WeakMap();
Ht = /* @__PURE__ */ new WeakMap();
F = /* @__PURE__ */ new WeakSet();
Is = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
uo = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
ml = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = _(this, F, uo)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = _(this, x)) == null || n.updateLayer(e, { position: us(i.position, t, a) });
};
As = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = _(this, F, uo)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = _(this, x)) == null || s.removeLayer(e, t);
};
fl = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && _(this, x) && await Vn(t, _(this, x).getToken);
};
gl = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !_(this, x)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Bs(t.mediaKey, _(this, x).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
yl = function() {
  window.clearTimeout(_(this, Ri)), za(this, Ri, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !_(this, x))) {
      (t = _(this, Ht)) == null || t.abort(), za(this, Ht, new AbortController());
      try {
        const i = await Us(
          e,
          { signal: _(this, Ht).signal, useSampleData: !0 },
          _(this, x).getToken
        );
        _(this, x).setServerBounds(i.layers), _(this, x).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, ch));
};
Ls = function(e, t, i) {
  const a = this._template;
  if (!a || !_(this, x)) return;
  const s = { template: a, x: t, y: i, defaultFontKey: ee(this, F, vl).call(this) }, o = e.kind === "property" ? fc(e.property, s) : e.layerType === "image" ? bn(s, "Image") : e.layerType === "badges" ? _n(s, "Badges", "") : e.layerType === "rect" ? pc(s, "Shape", e.shape) : vn(s, "Text", { kind: "static", text: "Text" });
  _(this, x).addLayer(o);
};
vl = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
bl = async function() {
  var t;
  const e = await ee(this, F, ho).call(this);
  e && ((t = _(this, x)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
_l = async function(e) {
  var i;
  const t = await ee(this, F, ho).call(this);
  t && ((i = _(this, x)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
ho = async function() {
  if (!_(this, Li)) return;
  const e = _(this, Li).open(this, Ho, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
wl = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !_(this, x)) return;
  const t = await Bs(e.mediaKey, _(this, x).getToken).catch(() => {
  });
  t && _(this, x).updateCanvas({ width: t.width, height: t.height });
};
ba = /* @__PURE__ */ new WeakMap();
V.styles = A`
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
Q([
  m()
], V.prototype, "_template", 2);
Q([
  m()
], V.prototype, "_selectedKey", 2);
Q([
  m()
], V.prototype, "_properties", 2);
Q([
  m()
], V.prototype, "_fonts", 2);
Q([
  m()
], V.prototype, "_serverBounds", 2);
Q([
  m()
], V.prototype, "_baseImageUrl", 2);
Q([
  m()
], V.prototype, "_zoom", 2);
Q([
  m()
], V.prototype, "_effectiveScale", 2);
Q([
  m()
], V.prototype, "_snapEnabled", 2);
Q([
  m()
], V.prototype, "_showRulers", 2);
Q([
  m()
], V.prototype, "_showSafeArea", 2);
Q([
  m()
], V.prototype, "_showMeasured", 2);
Q([
  m()
], V.prototype, "_canUndo", 2);
Q([
  m()
], V.prototype, "_canRedo", 2);
V = Q([
  L("di-design-view")
], V);
const uh = V, hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return V;
  },
  default: uh
}, Symbol.toStringTag, { value: "Module" }));
var dh = Object.defineProperty, ph = Object.getOwnPropertyDescriptor, $l = (e) => {
  throw TypeError(e);
}, ht = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ph(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && dh(t, i, s), s;
}, po = (e, t, i) => t.has(e) || $l("Cannot " + i), H = (e, t, i) => (po(e, t, "read from private field"), t.get(e)), At = (e, t, i) => t.has(e) ? $l("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gt = (e, t, i, a) => (po(e, t, "write to private field"), t.set(e, i), i), j = (e, t, i) => (po(e, t, "access private method"), i), ye, Wi, Ni, jt, Tt, B, Oa, xl, mo, fo, kl, Sl, Fi, Tl, Cl, El;
const mh = [
  { label: "Short", value: "Ship it" },
  { label: "Typical", value: "Designing social share images that actually get clicked" },
  {
    label: "Very long",
    value: "Everything you ever wanted to know about generating Open Graph images from your content, and rather more besides"
  }
];
let pe = class extends N {
  constructor() {
    super(), At(this, B), At(this, ye), At(this, Wi), At(this, Ni), At(this, jt), At(this, Tt), this._bounds = [], this._loading = !1, this._regenerating = !1, this.consumeContext(La, (e) => {
      Gt(this, Wi, e);
    }), this.consumeContext(lt, (e) => {
      Gt(this, Ni, e);
    }), this.consumeContext(Ot, (e) => {
      Gt(this, ye, e), e && this.observe(e.template, (t) => {
        this._template = t;
      });
    });
  }
  connectedCallback() {
    super.connectedCallback();
    const e = j(this, B, xl).call(this);
    e && (this._sampleNode = e), j(this, B, Fi).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = H(this, jt)) == null || e.abort(), j(this, B, fo).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${j(this, B, kl)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => j(this, B, Fi).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${j(this, B, Cl)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
          ${this._error ? r`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? r`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : p}

          <div class="presets">
            <span>Try a title length:</span>
            ${W(
      mh,
      (e) => e.label,
      (e) => r`
                <uui-button
                  compact
                  look="secondary"
                  label="Preview with a ${e.label.toLowerCase()} title"
                  @click=${() => j(this, B, Sl).call(this, e.value)}>
                  ${e.label}
                </uui-button>
              `
    )}
          </div>
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._bounds.length === 0 ? r`<p class="empty">Nothing was drawn. Check the layers are visible and have values.</p>` : r`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${W(
      this._bounds,
      (e) => e.key,
      (e) => r`
                    <uui-table-row>
                      <uui-table-cell>${j(this, B, El).call(this, e.key)}</uui-table-cell>
                      <uui-table-cell>
                        ${e.resolvedText ?? r`<em>—</em>`}
                        ${e.truncated ? r`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : p}
                      </uui-table-cell>
                      <uui-table-cell>${Math.round(e.x)}, ${Math.round(e.y)}</uui-table-cell>
                      <uui-table-cell>${Math.round(e.width)} × ${Math.round(e.height)}</uui-table-cell>
                    </uui-table-row>
                  `
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
                @click=${j(this, B, Tl)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
ye = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
jt = /* @__PURE__ */ new WeakMap();
Tt = /* @__PURE__ */ new WeakMap();
B = /* @__PURE__ */ new WeakSet();
Oa = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
xl = function() {
  try {
    const e = localStorage.getItem(j(this, B, Oa).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
mo = function(e) {
  try {
    e ? localStorage.setItem(j(this, B, Oa).call(this), JSON.stringify(e)) : localStorage.removeItem(j(this, B, Oa).call(this));
  } catch {
  }
};
fo = function() {
  H(this, Tt) && (URL.revokeObjectURL(H(this, Tt)), Gt(this, Tt, void 0));
};
kl = async function() {
  var i, a, s;
  if (!H(this, Wi) || !this._template) return;
  const e = H(this, Wi).open(this, jc, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, j(this, B, mo).call(this, t.item), (s = H(this, ye)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await j(this, B, Fi).call(this));
};
Sl = async function(e) {
  this._template && (this._sampleNode = void 0, j(this, B, mo).call(this, void 0), await j(this, B, Fi).call(this, e));
};
Fi = async function(e) {
  var a, s;
  const t = this._template;
  if (!t || !H(this, ye)) return;
  (a = H(this, jt)) == null || a.abort(), Gt(this, jt, new AbortController()), this._loading = !0, this._error = void 0;
  const i = {
    signal: H(this, jt).signal,
    contentKey: (s = this._sampleNode) == null ? void 0 : s.key,
    useSampleData: !this._sampleNode,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [o, n] = await Promise.all([
      Fs(t, i, H(this, ye).getToken),
      Us(t, i, H(this, ye).getToken)
    ]);
    j(this, B, fo).call(this), Gt(this, Tt, URL.createObjectURL(o)), this._url = H(this, Tt), this._bounds = n.layers, H(this, ye).setServerBounds(n.layers), H(this, ye).setIssues(n.issues);
  } catch (o) {
    if ((o == null ? void 0 : o.name) === "AbortError") return;
    this._error = o instanceof Error ? o.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Tl = async function() {
  var e, t;
  if (!(!this._sampleNode || !H(this, ye))) {
    this._regenerating = !0;
    try {
      const i = await Ra(this._sampleNode.key, H(this, ye).getToken);
      (e = H(this, Ni)) == null || e.peek(i.outcome === "generated" ? "positive" : "warning", {
        data: { message: `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = H(this, Ni)) == null || t.peek("danger", {
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
Cl = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
El = function(e) {
  var i;
  const t = (i = this._template) == null ? void 0 : i.layers.find((a) => a.key === e);
  return (t == null ? void 0 : t.name) || (t == null ? void 0 : t.type) || e.slice(0, 8);
};
pe.styles = A`
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
    }

    .presets {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      margin-top: var(--uui-size-space-4);
      font-size: 12px;
      color: var(--uui-color-text-alt);
      flex-wrap: wrap;
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

    code {
      background: var(--uui-color-surface-alt);
      padding: 0 4px;
      border-radius: 2px;
    }
  `;
ht([
  m()
], pe.prototype, "_template", 2);
ht([
  m()
], pe.prototype, "_sampleNode", 2);
ht([
  m()
], pe.prototype, "_bounds", 2);
ht([
  m()
], pe.prototype, "_url", 2);
ht([
  m()
], pe.prototype, "_loading", 2);
ht([
  m()
], pe.prototype, "_error", 2);
ht([
  m()
], pe.prototype, "_regenerating", 2);
pe = ht([
  L("di-preview-view")
], pe);
const fh = pe, gh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return pe;
  },
  default: fh
}, Symbol.toStringTag, { value: "Module" }));
var yh = Object.defineProperty, vh = Object.getOwnPropertyDescriptor, Dl = (e) => {
  throw TypeError(e);
}, Ya = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? vh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && yh(t, i, s), s;
}, go = (e, t, i) => t.has(e) || Dl("Cannot " + i), U = (e, t, i) => (go(e, t, "read from private field"), i ? i.call(e) : t.get(e)), as = (e, t, i) => t.has(e) ? Dl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Wo = (e, t, i, a) => (go(e, t, "write to private field"), t.set(e, i), i), tt = (e, t, i) => (go(e, t, "access private method"), i), G, zt, ve, Pl, Ml, zl, Ol, Il, Al, Ll, Rl, Wl;
let nt = class extends N {
  constructor() {
    super(), as(this, ve), as(this, G), as(this, zt), this._properties = [], this._showAdvanced = !1, this.consumeContext(La, (e) => {
      Wo(this, zt, e);
    }), this.consumeContext(Ot, (e) => {
      Wo(this, G, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${tt(this, ve, Al).call(this)} ${tt(this, ve, Ll).call(this)} ${tt(this, ve, Rl).call(this)} ${tt(this, ve, Wl).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
G = /* @__PURE__ */ new WeakMap();
zt = /* @__PURE__ */ new WeakMap();
ve = /* @__PURE__ */ new WeakSet();
Pl = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Ml = async function() {
  var a, s;
  if (!U(this, zt) || !this._template) return;
  const e = U(this, zt).open(this, Ql, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await tt(this, ve, zl).call(this, t.selection.filter((o) => !!o));
  (a = U(this, G)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = U(this, G)) == null ? void 0 : s.reloadProperties());
};
zl = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => dc), i = await t(U(this, G).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
Ol = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = U(this, G)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = U(this, G)) == null || s.reloadProperties();
};
Il = async function() {
  var i;
  if (!U(this, zt)) return;
  const e = U(this, zt).open(this, Ho, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = U(this, G)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
Al = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${e.docTypeAliases.length === 0 ? r`<p class="empty">No document types yet - nothing will trigger this template.</p>` : r`<div class="tags">
                  ${W(
    e.docTypeAliases,
    (t) => t,
    (t) => r`
                      <uui-tag look="secondary">
                        ${t}
                        <uui-button
                          compact
                          label="Remove ${t}"
                          @click=${() => tt(this, ve, Ol).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${tt(this, ve, Ml)}>
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
    ...U(this, ve, Pl).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = U(this, G)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = U(this, G)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Ll = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${tt(this, ve, Il)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = U(this, G)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
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
    return (i = U(this, G)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = U(this, G)) == null ? void 0 : i.updateOutput({
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
    return (i = U(this, G)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
Rl = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = U(this, G)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = U(this, G)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Wl = function() {
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
    return (i = U(this, G)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
nt.styles = A`
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
Ya([
  m()
], nt.prototype, "_template", 2);
Ya([
  m()
], nt.prototype, "_properties", 2);
Ya([
  m()
], nt.prototype, "_showAdvanced", 2);
nt = Ya([
  L("di-settings-view")
], nt);
const bh = nt, _h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return nt;
  },
  default: bh
}, Symbol.toStringTag, { value: "Module" }));
var wh = Object.defineProperty, $h = Object.getOwnPropertyDescriptor, Nl = (e) => {
  throw TypeError(e);
}, Qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $h(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && wh(t, i, s), s;
}, yo = (e, t, i) => t.has(e) || Nl("Cannot " + i), No = (e, t, i) => (yo(e, t, "read from private field"), t.get(e)), Fo = (e, t, i) => t.has(e) ? Nl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xh = (e, t, i, a) => (yo(e, t, "write to private field"), t.set(e, i), i), Uo = (e, t, i) => (yo(e, t, "access private method"), i), Ui, _a, Rs;
let Ne = class extends N {
  constructor() {
    super(), Fo(this, _a), Fo(this, Ui), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Ot, (e) => {
      xh(this, Ui, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Uo(this, _a, Rs).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Uo(this, _a, Rs).call(this)}>Reload</uui-button>
        </div>

        <p class="summary">
          <strong>${this._usage.withImage}</strong> of <strong>${this._usage.total}</strong> have an image.
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
              ${W(
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
Ui = /* @__PURE__ */ new WeakMap();
_a = /* @__PURE__ */ new WeakSet();
Rs = async function() {
  const e = this._template;
  if (!(!e || !No(this, Ui))) {
    this._loading = !0;
    try {
      this._usage = await pn(e.key, No(this, Ui).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Ne.styles = A`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
      overflow: auto;
    }

    .summary {
      margin: 0 0 var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
Qi([
  m()
], Ne.prototype, "_template", 2);
Qi([
  m()
], Ne.prototype, "_usage", 2);
Qi([
  m()
], Ne.prototype, "_loading", 2);
Qi([
  m()
], Ne.prototype, "_onlyMissing", 2);
Ne = Qi([
  L("di-usage-view")
], Ne);
const kh = Ne, Sh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Ne;
  },
  default: kh
}, Symbol.toStringTag, { value: "Module" })), Th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: So,
  default: So
}, Symbol.toStringTag, { value: "Module" })), Ch = 1500;
var fe, xt, Aa, Fl;
class ss extends ic {
  constructor(i, a) {
    super(i, a);
    w(this, Aa);
    w(this, fe);
    w(this, xt);
    this.consumeContext(lt, (s) => {
      b(this, fe, s);
    }), this.consumeContext(Ot, (s) => {
      b(this, xt, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, xt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, fe)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await Ws(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await un(a.key, !1, i.getToken);
        (o = c(this, fe)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await P(this, Aa, Fl).call(this, l, i);
      } catch (l) {
        (n = c(this, fe)) == null || n.peek("danger", {
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
    c(this, xt) && await dn(i, c(this, xt).getToken);
  }
}
fe = new WeakMap(), xt = new WeakMap(), Aa = new WeakSet(), Fl = async function(i, a) {
  var o, n, l, d;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((f) => setTimeout(f, Ch));
    try {
      s = await hn(s.id, a.getToken);
    } catch {
      (o = c(this, fe)) == null || o.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }
  if (s.status === "completed") {
    const f = s.failures.length;
    (n = c(this, fe)) == null || n.peek(f > 0 ? "warning" : "positive", {
      data: {
        headline: "Regeneration finished",
        message: `${s.generated} generated, ${s.skipped} skipped${f > 0 ? `, ${f} failed` : ""}.`
      }
    });
    for (const C of s.failures.slice(0, 3))
      (l = c(this, fe)) == null || l.peek("danger", { data: { message: C } });
  } else
    (d = c(this, fe)) == null || d.peek("danger", {
      data: { headline: `Regeneration ${s.status}`, message: s.failures[0] ?? "" }
    });
};
const Eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: ss,
  api: ss,
  default: ss
}, Symbol.toStringTag, { value: "Module" }));
var Vi, ai;
class os extends oc {
  constructor(i, a) {
    super(i, a);
    w(this, Vi);
    w(this, ai);
    this.consumeContext(Fe, (s) => {
      b(this, Vi, s);
    }), this.consumeContext(lt, (s) => {
      b(this, ai, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Ra(i, () => {
          var n;
          return (n = c(this, Vi)) == null ? void 0 : n.getLatestToken();
        });
        (a = c(this, ai)) == null || a.peek(o.outcome === "generated" ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: o.outcome === "generated" ? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof at && o.status === 404;
        (s = c(this, ai)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof at ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Vi = new WeakMap(), ai = new WeakMap();
const Dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: os,
  api: os,
  default: os
}, Symbol.toStringTag, { value: "Module" }));
var Hi, kt, Gi, si;
class ns extends nc {
  constructor(i, a) {
    super(i, a);
    w(this, Hi);
    w(this, kt);
    w(this, Gi);
    w(this, si);
    this.consumeContext(Fe, (s) => {
      b(this, Hi, s);
    }), this.consumeContext(lt, (s) => {
      b(this, kt, s);
    }), this.consumeContext(rc, (s) => {
      b(this, Gi, s);
    }), this.consumeContext(lc, (s) => {
      b(this, si, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, si)) {
      (i = c(this, kt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Ra(c(this, si), () => {
        var l;
        return (l = c(this, Hi)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Gi)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, kt)) == null || s.peek("positive", {
        data: { headline: "Dynamic Images", message: "The image has been regenerated." }
      });
    } catch (n) {
      const l = n instanceof at && n.status === 404;
      (o = c(this, kt)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof at ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Hi = new WeakMap(), kt = new WeakMap(), Gi = new WeakMap(), si = new WeakMap();
const Ph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: ns,
  api: ns,
  default: ns
}, Symbol.toStringTag, { value: "Module" }));
var Mh = Object.defineProperty, zh = Object.getOwnPropertyDescriptor, Ul = (e) => {
  throw TypeError(e);
}, qa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Mh(t, i, s), s;
}, vo = (e, t, i) => t.has(e) || Ul("Cannot " + i), Ia = (e, t, i) => (vo(e, t, "read from private field"), t.get(e)), oa = (e, t, i) => t.has(e) ? Ul("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Bl = (e, t, i, a) => (vo(e, t, "write to private field"), t.set(e, i), i), Rt = (e, t, i) => (vo(e, t, "access private method"), i), wa, Bi, bo, je, _o, Kl, $a;
let rt = class extends Vo {
  constructor() {
    super(), oa(this, je), oa(this, wa), oa(this, Bi), this._items = [], this._loading = !0, this._search = "", oa(this, bo, () => {
      var e;
      return (e = Ia(this, wa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Fe, (e) => {
      Bl(this, wa, e), e && Rt(this, je, _o).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(Ia(this, Bi));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${Rt(this, je, Kl)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Rt(this, je, $a).call(this, void 0)}>
          Use sample data
        </uui-button>

        ${this._loading ? r`<uui-loader></uui-loader>` : this._items.length === 0 ? r`<p class="empty">No content of the selected document types was found.</p>` : r`<uui-ref-list>
                ${W(
      this._items,
      (e) => e.key,
      (e) => {
        var t;
        return r`
                    <uui-ref-node
                      name=${e.name}
                      detail=${e.isPublished ? "Published" : "Draft"}
                      ?selected=${e.key === ((t = this.data) == null ? void 0 : t.selectedKey)}
                      @open=${() => Rt(this, je, $a).call(this, e)}
                      @click=${() => Rt(this, je, $a).call(this, e)}>
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
wa = /* @__PURE__ */ new WeakMap();
Bi = /* @__PURE__ */ new WeakMap();
bo = /* @__PURE__ */ new WeakMap();
je = /* @__PURE__ */ new WeakSet();
_o = async function() {
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
        (a) => cn(a, this._search, 0, 30, Ia(this, bo)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
Kl = function(e) {
  this._search = e.target.value, window.clearTimeout(Ia(this, Bi)), Bl(this, Bi, window.setTimeout(() => void Rt(this, je, _o).call(this), 300));
};
$a = function(e) {
  this.value = { item: e }, this._submitModal();
};
rt.styles = A`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
qa([
  m()
], rt.prototype, "_items", 2);
qa([
  m()
], rt.prototype, "_loading", 2);
qa([
  m()
], rt.prototype, "_search", 2);
rt = qa([
  L("di-sample-node-picker-modal")
], rt);
const Oh = rt, Ih = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return rt;
  },
  default: Oh
}, Symbol.toStringTag, { value: "Module" }));
var Ah = Object.defineProperty, Lh = Object.getOwnPropertyDescriptor, Vl = (e) => {
  throw TypeError(e);
}, Ke = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Lh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ah(t, i, s), s;
}, wo = (e, t, i) => t.has(e) || Vl("Cannot " + i), ci = (e, t, i) => (wo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), rs = (e, t, i) => t.has(e) ? Vl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Rh = (e, t, i, a) => (wo(e, t, "write to private field"), t.set(e, i), i), Wt = (e, t, i) => (wo(e, t, "access private method"), i), xa, ea, xe, Hl, Gl, $o, jl, Xl, Yl, ql;
const Wh = [100, 200, 300, 400, 500, 600, 700, 800, 900], Nh = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let ce = class extends Vo {
  constructor() {
    super(), rs(this, xe), rs(this, xa), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", rs(this, ea, () => {
      var e;
      return (e = ci(this, xa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Fe, (e) => {
      Rh(this, xa, e);
    });
  }
  render() {
    return r`
      <umb-body-layout headline="Add a font">
        <uui-box headline="Upload a file">
          <input
            type="file"
            accept=".ttf,.otf,.woff2,.woff"
            multiple
            aria-label="Font files"
            ?disabled=${this._busy}
            @change=${Wt(this, xe, Hl)} />
          <p class="hint">
            .ttf, .otf or .woff2. The family name and weight are read from the file. Uploads are stored in the media
            library, so they work on Umbraco Cloud and transfer with Deploy.
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
            @click=${Wt(this, xe, Gl)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Nh.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? Wt(this, xe, ql).call(this) : Wt(this, xe, Yl).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !ci(this, xe, $o)}
            @click=${Wt(this, xe, jl)}>
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
xa = /* @__PURE__ */ new WeakMap();
ea = /* @__PURE__ */ new WeakMap();
xe = /* @__PURE__ */ new WeakSet();
Hl = async function(e) {
  const t = e.target.files;
  if (!(!t || t.length === 0)) {
    this._busy = !0, this._error = void 0;
    try {
      for (const i of Array.from(t))
        await en(i, ci(this, ea));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (i) {
      this._error = i instanceof Error ? i.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Gl = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await tn(this._path.trim(), ci(this, ea)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
$o = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
jl = async function() {
  if (ci(this, xe, $o)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await an(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        ci(this, ea)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
Xl = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Yl = function() {
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
        ${W(
    Wh,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => Wt(this, xe, Xl).call(this, e, t.target.checked)}>
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
ql = function() {
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
ce.styles = A`
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
Ke([
  m()
], ce.prototype, "_busy", 2);
Ke([
  m()
], ce.prototype, "_error", 2);
Ke([
  m()
], ce.prototype, "_path", 2);
Ke([
  m()
], ce.prototype, "_provider", 2);
Ke([
  m()
], ce.prototype, "_family", 2);
Ke([
  m()
], ce.prototype, "_weights", 2);
Ke([
  m()
], ce.prototype, "_italic", 2);
Ke([
  m()
], ce.prototype, "_url", 2);
ce = Ke([
  L("di-font-upload-modal")
], ce);
const Fh = ce, Uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return ce;
  },
  default: Fh
}, Symbol.toStringTag, { value: "Module" }));
export {
  Dc as manifests,
  ad as onInit
};
//# sourceMappingURL=dynamic-images.js.map
