var Co = (e) => {
  throw TypeError(e);
};
var Qa = (e, t, i) => t.has(e) || Co("Cannot " + i);
var c = (e, t, i) => (Qa(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? Co("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (Qa(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), P = (e, t, i) => (Qa(e, t, "access private method"), i);
var es = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { nothing as m, html as r, css as A, state as p, customElement as L, repeat as B, property as v, classMap as Ho, styleMap as V } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as F } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Be } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as ct } from "@umbraco-cms/backoffice/notification";
import { umbOpenModal as tc, UMB_DISCARD_CHANGES_MODAL as ic, umbConfirmModal as Us, UmbModalToken as Go, UMB_MODAL_MANAGER_CONTEXT as Wa, UmbModalBaseElement as jo } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as Xo } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as ac } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as sc, UmbEntityWorkspaceDataManager as oc, UmbSubmitWorkspaceAction as Eo, UmbWorkspaceActionBase as nc } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as rc } from "@umbraco-cms/backoffice/context-api";
import { UmbArrayState as bi, UmbStringState as Do, UmbBooleanState as ia, UmbNumberState as lc } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as cc } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as uc } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as hc } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as dc } from "@umbraco-cms/backoffice/document";
const li = "dynamic-images", ji = "di-template", ka = "di:templates-changed", pc = "/umbraco/management/api/v1/dynamic-images";
class st extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function T(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${pc}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await mc(n);
  return n;
}
async function mc(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new st(t, e.status, i);
}
const D = async (e) => e.json();
async function Bs(e) {
  const t = await T("/templates?take=500", e);
  return (await D(t)).items;
}
const Yo = async (e, t) => D(await T(`/templates/${e}`, t)), qo = async (e, t) => D(await T("/templates", t, { method: "POST", json: e })), Jo = async (e, t) => D(await T(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Zo(e, t) {
  await T(`/templates/${e}`, t, { method: "DELETE" });
}
const Qo = async (e, t) => D(await T(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function en(e, t) {
  return (await T(`/templates/${e}/export`, t)).blob();
}
const tn = async (e, t, i) => D(await T("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), an = async (e) => D(await T("/templates/import/appsettings", e, { method: "POST" })), Ei = async (e) => D(await T("/fonts", e));
async function sn(e, t) {
  const i = new FormData();
  return i.append("file", e), D(await T("/fonts", t, { method: "POST", body: i }));
}
const on = async (e, t) => D(await T("/fonts/register-path", t, { method: "POST", json: { path: e } })), nn = async (e, t) => D(await T("/fonts/register-web", t, { method: "POST", json: e })), rn = async (e, t) => D(await T(`/fonts/${e}/refresh`, t, { method: "POST" })), ln = async (e, t, i, a) => D(await T(`/fonts/${e}`, a, { method: "PUT", json: { familyName: t, styles: i } }));
async function cn(e, t) {
  await T(`/fonts/${e}`, t, { method: "DELETE" });
}
async function un(e, t) {
  return (await T(`/fonts/${e}/file`, t)).arrayBuffer();
}
const fc = async (e) => D(await T("/document-types", e)), hn = async (e, t) => D(await T(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function dn(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), D(await T(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function Ks(e, t, i) {
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
const Vs = async (e, t, i) => D(await T("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Hs = async (e, t) => D(await T(`/media/${e}/image-info`, t)), Fa = async (e, t) => D(await T(`/documents/${e}/regenerate`, t, { method: "POST" })), pn = async (e, t, i) => D(await T(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), mn = async (e, t) => D(await T(`/jobs/${e}`, t));
async function fn(e, t) {
  await T(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const gn = async (e, t) => D(await T(`/templates/${e}/usage`, t)), Na = async (e) => D(await T("/health", e)), yn = async (e) => D(await T("/sync/status", e)), vn = async (e) => D(await T("/sync/export", e, { method: "POST" })), bn = async (e) => D(await T("/sync/import", e, { method: "POST" }));
function ci(e) {
  const t = `section/${li}/workspace/${ji}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Ua() {
  return new URL(`section/${li}/workspace/${ji}/create`, document.baseURI).pathname;
}
function _n(e) {
  return new URL(`section/${li}/dashboard/${e}`, document.baseURI).pathname;
}
function us() {
  const e = window.location.pathname.split(`/workspace/${ji}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function pi() {
  window.dispatchEvent(new CustomEvent(ka));
}
const gc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: st,
  SECTION_PATHNAME: li,
  TEMPLATES_CHANGED_EVENT: ka,
  TEMPLATE_ENTITY_TYPE: ji,
  cancelJob: fn,
  createTemplate: qo,
  deleteFont: cn,
  deleteTemplate: Zo,
  duplicateTemplate: Qo,
  exportTemplate: en,
  fetchDocumentTypes: fc,
  fetchFontFile: un,
  fetchFonts: Ei,
  fetchHealth: Na,
  fetchImageInfo: Hs,
  fetchJob: mn,
  fetchLayout: Vs,
  fetchPreview: Ks,
  fetchProperties: hn,
  fetchSampleContent: dn,
  fetchSyncStatus: yn,
  fetchTemplate: Yo,
  fetchTemplates: Bs,
  fetchUsage: gn,
  hrefForCreate: Ua,
  hrefForDashboard: _n,
  hrefForTemplate: ci,
  importFromAppSettings: an,
  importTemplate: tn,
  notifyTemplatesChanged: pi,
  refreshFont: rn,
  regenerateDocument: Fa,
  regenerateTemplate: pn,
  registerFontPath: on,
  registerWebFont: nn,
  runSyncExport: vn,
  runSyncImport: bn,
  templateKeyFromLocation: us,
  updateFont: ln,
  updateTemplate: Jo,
  uploadFont: sn
}, Symbol.toStringTag, { value: "Module" })), Ba = () => crypto.randomUUID();
function Ka(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function wn(e, t, i) {
  const { x: a, y: s } = Ka(e);
  return {
    type: "text",
    key: Ba(),
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
function $n(e, t, i) {
  const { x: a, y: s } = Ka(e);
  return {
    type: "image",
    key: Ba(),
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
function xn(e, t, i) {
  const { x: a, y: s } = Ka(e);
  return {
    type: "badges",
    key: Ba(),
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
function yc(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = Ka(e);
  return {
    type: "rect",
    key: Ba(),
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
function vc(e) {
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
function bc(e, t) {
  switch (vc(e.classification)) {
    case "image":
      return $n(t, e.name, e.alias);
    case "badges":
      return xn(t, e.name, e.alias);
    default:
      return wn(t, e.name, _c(e));
  }
}
function _c(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function wc(e) {
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
const kn = [
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
function Di(e) {
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
function Pi(e) {
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
function hs(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return kn[a * 3 + i];
}
function Va(e, t, i) {
  return {
    x: e.x - t * Di(e.anchor),
    y: e.y - i * Pi(e.anchor)
  };
}
function Gs(e, t, i, a, s) {
  return {
    x: e + i * Di(s),
    y: t + a * Pi(s)
  };
}
function $c(e, t, i, a) {
  const s = Va(e, t, i), o = Gs(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function xc(e, t) {
  const i = Gs(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Sn(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Bt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), d = e - i, f = t - a;
  return { x: i + d * n - f * l, y: a + d * l + f * n };
}
function kc(e, t, i, a, s) {
  return Bt(e, t, i, a, -s);
}
function Tn(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Bt(e.x, e.y, t, i, a),
    Bt(e.x + e.width, e.y, t, i, a),
    Bt(e.x + e.width, e.y + e.height, t, i, a),
    Bt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((f) => f.x)), n = Math.max(...s.map((f) => f.x)), l = Math.min(...s.map((f) => f.y)), d = Math.max(...s.map((f) => f.y));
  return { x: o, y: l, width: n - o, height: d - l };
}
const Sc = 10;
function Me(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Cn(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Sa(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Po(e) {
  return e === "below" || e === "above";
}
function Mo(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Tc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Cc(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = Mo(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...Mo(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Ec(e, t, i) {
  const a = e.position;
  if (!Cn(a)) return a;
  if (Cc(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Di(a.anchor), l = Pi(a.anchor);
  const d = zo(e, a.relativeX, !1, t, i);
  d && (s = d.coordinate, n = d.factor);
  const f = zo(e, a.relativeY, !0, t, i);
  return f && (o = f.coordinate, l = f.factor), { x: s, y: o, anchor: hs(n, l) };
}
function zo(e, t, i, a, s) {
  if (!t || Po(t.edge) !== i) return;
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
    if (!f || Po(f.edge) !== i) return;
    n = f.layerKey;
  }
}
function Dc(e, t, i) {
  const a = Tc(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const d = s.get(l.key);
    if (d) return d;
    let f;
    o.has(l.key) ? f = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), f = Ec(l, a, (Ge) => {
      const Ae = a.get(Ge);
      return Ae && !i(Ae) ? n(Ae).extent : void 0;
    }), o.delete(l.key));
    const C = t(l), X = Va(f, C.width, C.height), $e = { x: X.x, y: X.y, width: C.width, height: C.height }, Ie = { position: f, box: $e, extent: Tn($e, f.x, f.y, l.rotation ?? 0) };
    return s.set(l.key, Ie), Ie;
  };
  for (const l of e) n(l);
  return s;
}
function ds(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? hs(Di(i.anchor), Pi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? hs(Di(e.anchor), Pi(i.anchor)) : e.anchor
  };
}
var ne, Re, Se, Qe;
class Pc {
  constructor(t = 100) {
    w(this, ne, []);
    w(this, Re, []);
    w(this, Se, 0);
    w(this, Qe);
    this.limit = t;
  }
  get canUndo() {
    return c(this, ne).length > 0;
  }
  get canRedo() {
    return c(this, Re).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Se) > 0 || (c(this, ne).push(structuredClone(t)), c(this, ne).length > this.limit && c(this, ne).shift(), _(this, Re, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Se) === 0 && _(this, Qe, structuredClone(t)), es(this, Se)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Se) !== 0 && (es(this, Se)._--, !(c(this, Se) > 0) && (t && c(this, Qe) !== void 0 && (c(this, ne).push(c(this, Qe)), c(this, ne).length > this.limit && c(this, ne).shift(), _(this, Re, [])), _(this, Qe, void 0)));
  }
  undo(t) {
    const i = c(this, ne).pop();
    if (i !== void 0)
      return c(this, Re).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Re).pop();
    if (i !== void 0)
      return c(this, ne).push(structuredClone(t)), i;
  }
  clear() {
    _(this, ne, []), _(this, Re, []), _(this, Se, 0), _(this, Qe, void 0);
  }
}
ne = new WeakMap(), Re = new WeakMap(), Se = new WeakMap(), Qe = new WeakMap();
const Mc = "DynamicImages.Workspace.Template";
var Jt, et, _t, wt, Zt, Qt, ei, $t, ti, We, ii, ai, re, Ki, xt, Te, kt, k, En, si, oi, ps, ms, Le, mt, fs, gs;
class zc extends sc {
  constructor(i) {
    super(i, Mc);
    w(this, k);
    w(this, Jt);
    w(this, et);
    w(this, _t);
    w(this, wt);
    w(this, Zt);
    w(this, Qt);
    w(this, ei);
    w(this, $t);
    w(this, ti);
    w(this, We);
    w(this, ii);
    w(this, ai);
    w(this, re);
    w(this, Ki);
    w(this, xt);
    w(this, Te);
    w(this, kt);
    w(this, si);
    w(this, oi);
    this._data = new oc(this), this.template = this._data.current, _(this, Jt, new bi([], (a) => a.key)), this.layers = c(this, Jt).asObservable(), _(this, et, new Do(void 0)), this.selectedLayerKey = c(this, et).asObservable(), _(this, _t, new bi([], (a) => a.alias)), this.properties = c(this, _t).asObservable(), _(this, wt, new bi([], (a) => a.key)), this.fonts = c(this, wt).asObservable(), _(this, Zt, new bi([], (a) => a.key)), this.serverBounds = c(this, Zt).asObservable(), _(this, Qt, new bi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, Qt).asObservable(), _(this, ei, new Do(void 0)), this.sampleContentKey = c(this, ei).asObservable(), _(this, $t, new ia(!0)), this.useSampleData = c(this, $t).asObservable(), _(this, ti, new lc(1)), this.zoom = c(this, ti).asObservable(), _(this, We, new ia(!0)), this.loading = c(this, We).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ii, new ia(!1)), this.canUndo = c(this, ii).asObservable(), _(this, ai, new ia(!1)), this.canRedo = c(this, ai).asObservable(), _(this, re, new Pc()), _(this, Te, !1), _(this, kt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, si, async (a) => {
      const s = a.detail;
      if (c(this, kt) || !(s != null && s.url) || !P(this, k, En).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await tc(this, ic), _(this, kt, !0), window.history.pushState({}, "", s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, oi, (a) => {
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
        component: () => Promise.resolve().then(() => Io),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Io),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Be, (a) => {
      _(this, Ki, a);
    }), this.consumeContext(ct, (a) => {
      _(this, xt, a);
    }), window.addEventListener("willchangestate", c(this, si)), window.addEventListener("beforeunload", c(this, oi));
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Te);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, We).setValue(!0), _(this, Te, !1);
    try {
      const a = await Yo(i, this.getToken);
      P(this, k, mt).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await P(this, k, ps).call(this, a);
    } catch (a) {
      P(this, k, gs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, We).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    c(this, We).setValue(!0), _(this, Te, !0), P(this, k, mt).call(this, wc(i), { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await P(this, k, ps).call(this, this._data.getCurrent()), c(this, We).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    i && c(this, _t).setValue(await P(this, k, ms).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    c(this, wt).setValue(await Ei(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    P(this, k, Le).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    P(this, k, Le).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    P(this, k, Le).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    P(this, k, Le).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    P(this, k, Le).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    P(this, k, Le).call(this, (s) => ({
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
    P(this, k, Le).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, d;
        let n = o.position;
        return ((l = Sa(n, "x")) == null ? void 0 : l.layerKey) === i && (n = ds(n, "x", a == null ? void 0 : a.get(o.key))), ((d = Sa(n, "y")) == null ? void 0 : d.layerKey) === i && (n = ds(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), c(this, et).getValue() === i && this.selectLayer(void 0);
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
    P(this, k, Le).call(this, (s) => {
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
    c(this, et).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, et).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, re).begin(i);
  }
  endTransaction(i = !0) {
    c(this, re).end(i), P(this, k, fs).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, re).undo(i);
    a && P(this, k, mt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, re).redo(i);
    a && P(this, k, mt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Zt).setValue(i);
  }
  setIssues(i) {
    c(this, Qt).setValue(i);
  }
  setSampleContentKey(i) {
    c(this, ei).setValue(i), c(this, $t).setValue(!i);
  }
  setUseSampleData(i) {
    c(this, $t).setValue(i);
  }
  setZoom(i) {
    c(this, ti).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = c(this, Te) ? await qo(i, this.getToken) : await Jo(i, this.getToken);
      P(this, k, mt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Te);
      _(this, Te, !1), this.setIsNew(!1), pi(), (a = c(this, xt)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, xt)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", ci(o.template.key));
    } catch (o) {
      throw P(this, k, gs).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, kt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, si)), window.removeEventListener("beforeunload", c(this, oi)), c(this, re).clear(), super.destroy();
  }
}
Jt = new WeakMap(), et = new WeakMap(), _t = new WeakMap(), wt = new WeakMap(), Zt = new WeakMap(), Qt = new WeakMap(), ei = new WeakMap(), $t = new WeakMap(), ti = new WeakMap(), We = new WeakMap(), ii = new WeakMap(), ai = new WeakMap(), re = new WeakMap(), Ki = new WeakMap(), xt = new WeakMap(), Te = new WeakMap(), kt = new WeakMap(), k = new WeakSet(), /**
 * True when the new URL leaves this workspace. Switching between the four workspace views keeps
 * the workspace's own path as a prefix (`…/edit/<key>/view/<pathname>`), so this is false for
 * those and the editor is never prompted for moving between Design and Preview & test.
 *
 * Core has the same one-liner as a protected method on `UmbEntityDetailWorkspaceContextBase`.
 * There is no exported helper for it, so it is inlined rather than reached for.
 */
En = function(i) {
  return !i.includes(this.routes.getActiveLocalPath());
}, si = new WeakMap(), oi = new WeakMap(), ps = async function(i) {
  const [a, s] = await Promise.all([
    Ei(this.getToken).catch(() => []),
    P(this, k, ms).call(this, i.docTypeAliases)
  ]);
  c(this, wt).setValue(a), c(this, _t).setValue(s);
}, ms = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => hn(o, this.getToken).catch(() => []))
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
  a && c(this, re).push(s);
  const o = i(structuredClone(s));
  P(this, k, mt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
mt = function(i, a) {
  a != null && a.resetHistory && c(this, re).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Jt).setValue(i.layers), P(this, k, fs).call(this);
}, fs = function() {
  c(this, ii).setValue(c(this, re).canUndo), c(this, ai).setValue(c(this, re).canRedo);
}, gs = function(i, a) {
  var o;
  const s = a instanceof st ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, xt)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const Lt = new rc(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Oc = [
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
    element: () => Promise.resolve().then(() => Hc),
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
      href: `section/${li}/dashboard/fonts`
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
      href: `section/${li}/dashboard/health`
    }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => Yc),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => su),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => lu),
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
    api: zc,
    meta: { entityType: ji }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => fh),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => bh),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => xh),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Eh),
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
    api: () => Promise.resolve().then(() => Dh),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Mh),
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
    api: () => Promise.resolve().then(() => zh),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Oh),
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
    element: () => Promise.resolve().then(() => Rh)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => Vh)
  }
], nd = (e, t) => {
  t.registerMany(Oc);
};
var Ic = Object.defineProperty, Ac = Object.getOwnPropertyDescriptor, Dn = (e) => {
  throw TypeError(e);
}, js = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ac(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ic(t, i, s), s;
}, Xs = (e, t, i) => t.has(e) || Dn("Cannot " + i), Lc = (e, t, i) => (Xs(e, t, "read from private field"), t.get(e)), Oo = (e, t, i) => t.has(e) ? Dn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Rc = (e, t, i, a) => (Xs(e, t, "write to private field"), t.set(e, i), i), Wc = (e, t, i) => (Xs(e, t, "access private method"), i), Ta, ys, Pn;
let Pt = class extends F {
  constructor() {
    super(), Oo(this, ys), Oo(this, Ta), this._name = "", this._loading = !0, this.consumeContext(Lt, (e) => {
      Rc(this, Ta, e), e && (this.observe(e.template, (t) => {
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
            @input=${Wc(this, ys, Pn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : m}
    `;
  }
};
Ta = /* @__PURE__ */ new WeakMap();
ys = /* @__PURE__ */ new WeakSet();
Pn = function(e) {
  var i;
  const t = e.target.value;
  (i = Lc(this, Ta)) == null || i.updateTemplateFields({ name: t });
};
Pt.styles = A`
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
js([
  p()
], Pt.prototype, "_name", 2);
js([
  p()
], Pt.prototype, "_loading", 2);
Pt = js([
  L("di-template-editor")
], Pt);
const Fc = Pt, Io = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Pt;
  },
  default: Fc
}, Symbol.toStringTag, { value: "Module" }));
var Nc = Object.defineProperty, Uc = Object.getOwnPropertyDescriptor, Mn = (e) => {
  throw TypeError(e);
}, mi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Uc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Nc(t, i, s), s;
}, Ys = (e, t, i) => t.has(e) || Mn("Cannot " + i), yt = (e, t, i) => (Ys(e, t, "read from private field"), t.get(e)), _i = (e, t, i) => t.has(e) ? Mn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Bc = (e, t, i, a) => (Ys(e, t, "write to private field"), t.set(e, i), i), na = (e, t, i) => (Ys(e, t, "access private method"), i), ra, Ca, la, ca, Kt, vs, zn, On;
let ze = class extends F {
  constructor() {
    super(), _i(this, Kt), _i(this, ra), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = us(), this._expanded = !0, _i(this, Ca, () => {
      var e;
      return (e = yt(this, ra)) == null ? void 0 : e.getLatestToken();
    }), _i(this, la, () => {
      this._activeKey = us();
    }), _i(this, ca, () => {
      na(this, Kt, vs).call(this);
    }), this.consumeContext(Be, (e) => {
      Bc(this, ra, e), e && na(this, Kt, vs).call(this);
    }), window.addEventListener("changestate", yt(this, la)), window.addEventListener(ka, yt(this, ca));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("changestate", yt(this, la)), window.removeEventListener(ka, yt(this, ca));
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
        ${na(this, Kt, zn).call(this)}
      </uui-menu-item>
    `;
  }
};
ra = /* @__PURE__ */ new WeakMap();
Ca = /* @__PURE__ */ new WeakMap();
la = /* @__PURE__ */ new WeakMap();
ca = /* @__PURE__ */ new WeakMap();
Kt = /* @__PURE__ */ new WeakSet();
vs = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Bs(yt(this, Ca)),
      Na(yt(this, Ca)).catch(() => {
      })
    ]);
    this._templates = e, this._issuesByTemplate = Kc((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
zn = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${B(
    this._templates,
    (e) => e.key,
    (e) => na(this, Kt, On).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${Ua()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
On = function(e) {
  const t = this._issuesByTemplate.get(e.key) ?? 0;
  return r`
      <uui-menu-item
        label=${e.name}
        href=${ci(e.key)}
        ?active=${e.key === this._activeKey}>
        <uui-icon
          slot="icon"
          name=${e.isEnabled ? "icon-picture" : "icon-block"}
          class=${e.isEnabled ? "enabled" : "disabled"}>
        </uui-icon>
        ${t > 0 ? r`<uui-badge slot="badge" color="warning" look="primary" title="${t} issue(s)">${t}</uui-badge>` : m}
      </uui-menu-item>
    `;
};
ze.styles = A`
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
mi([
  p()
], ze.prototype, "_templates", 2);
mi([
  p()
], ze.prototype, "_issuesByTemplate", 2);
mi([
  p()
], ze.prototype, "_loading", 2);
mi([
  p()
], ze.prototype, "_activeKey", 2);
mi([
  p()
], ze.prototype, "_expanded", 2);
ze = mi([
  L("di-templates-menu-item")
], ze);
function Kc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const Vc = ze, Hc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return ze;
  },
  default: Vc
}, Symbol.toStringTag, { value: "Module" }));
var Gc = Object.defineProperty, jc = Object.getOwnPropertyDescriptor, In = (e) => {
  throw TypeError(e);
}, ut = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? jc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gc(t, i, s), s;
}, qs = (e, t, i) => t.has(e) || In("Cannot " + i), Ee = (e, t, i) => (qs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), aa = (e, t, i) => t.has(e) ? In("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ao = (e, t, i, a) => (qs(e, t, "write to private field"), t.set(e, i), i), S = (e, t, i) => (qs(e, t, "access private method"), i), ua, Ea, De, $, fi, de, An, Ln, Rn, Wn, Fn, Nn, Un, $i, Bn, Kn, Vn, Hn, Gn;
let pe = class extends F {
  constructor() {
    super(), aa(this, $), aa(this, ua), aa(this, Ea), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, aa(this, De, () => {
      var e;
      return (e = Ee(this, ua)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(ct, (e) => {
      Ao(this, Ea, e);
    }), this.consumeContext(Be, (e) => {
      Ao(this, ua, e), e && S(this, $, fi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${S(this, $, Nn).call(this)} ${S(this, $, Un).call(this)} ${S(this, $, Bn).call(this)} ${S(this, $, Kn).call(this)}
      </umb-body-layout>
    `;
  }
};
ua = /* @__PURE__ */ new WeakMap();
Ea = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakMap();
$ = /* @__PURE__ */ new WeakSet();
fi = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Bs(Ee(this, De)),
      Ei(Ee(this, De)).catch(() => []),
      Na(Ee(this, De)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    S(this, $, de).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
de = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ee(this, Ea)) == null || s.peek(e, { data: { headline: t, message: a } });
};
An = async function() {
  this._importing = !0;
  try {
    const e = await an(Ee(this, De));
    S(this, $, de).call(this, e.created.length > 0 ? "positive" : "warning", e.created.length > 0 ? `Imported ${e.created.length} template(s)` : "Nothing was imported");
    for (const t of e.warnings.slice(0, 5)) S(this, $, de).call(this, "warning", t);
    pi(), await S(this, $, fi).call(this);
  } catch (e) {
    S(this, $, de).call(this, "danger", "The import failed", e);
  } finally {
    this._importing = !1;
  }
};
Ln = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await tn(this._pasteJson, "create", Ee(this, De)), S(this, $, de).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, pi(), await S(this, $, fi).call(this);
    } catch (e) {
      S(this, $, de).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
Rn = async function(e) {
  try {
    await Qo(e.key, Ee(this, De)), S(this, $, de).call(this, "positive", `'${e.name}' duplicated`), pi(), await S(this, $, fi).call(this);
  } catch (t) {
    S(this, $, de).call(this, "danger", "The template could not be duplicated", t);
  }
};
Wn = async function(e) {
  await Us(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Zo(e.key, Ee(this, De)), S(this, $, de).call(this, "positive", `'${e.name}' deleted`), pi(), await S(this, $, fi).call(this);
  } catch (t) {
    S(this, $, de).call(this, "danger", "The template could not be deleted", t);
  }
};
Fn = async function(e) {
  try {
    const t = await en(e.key, Ee(this, De)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    S(this, $, de).call(this, "danger", "The template could not be exported", t);
  }
};
Nn = function() {
  var t;
  if (!((t = this._health) != null && t.legacyConfigPresent)) return m;
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
            @click=${S(this, $, An)}>
            Import from appsettings
          </uui-button>
        </div>
      </uui-box>
    `;
};
Un = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${S(this, $, $i).call(this, "Templates", this._templates.length, "icon-brush")}
        ${S(this, $, $i).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${S(this, $, $i).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${S(this, $, $i).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
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
Bn = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? m : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${B(
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
                  ${i.templateName ? r`<strong>${i.templateName}</strong> — ` : m}${i.message}
                </uui-table-cell>
              </uui-table-row>
            `
  )}
        </uui-table>
        <uui-button look="secondary" href=${_n("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Kn = function() {
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
          <uui-button look="primary" color="positive" href=${Ua()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? S(this, $, Vn).call(this) : m}
        ${this._templates.length === 0 ? S(this, $, Hn).call(this) : S(this, $, Gn).call(this)}
      </uui-box>
    `;
};
Vn = function() {
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
          @click=${S(this, $, Ln)}>
          Import
        </uui-button>
      </div>
    `;
};
Hn = function() {
  return r`
      <div class="empty">
        <uui-icon name="icon-brush"></uui-icon>
        <h4>No templates yet</h4>
        <p>A template says which document types get a generated image, and what it looks like.</p>
        <uui-button look="primary" color="positive" href=${Ua()} label="Create your first template">
          Create your first template
        </uui-button>
      </div>
    `;
};
Gn = function() {
  return r`
      <div class="cards">
        ${B(
    this._templates,
    (e) => e.key,
    (e) => r`
            <uui-box class="card ${e.isEnabled ? "" : "disabled"}">
              <div slot="headline">
                <a href=${ci(e.key)}>${e.name}</a>
                ${e.isEnabled ? m : r`<uui-tag look="secondary">Disabled</uui-tag>`}
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
                <uui-button look="secondary" href=${ci(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => S(this, $, Rn).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => S(this, $, Fn).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => S(this, $, Wn).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
pe.styles = A`
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
ut([
  p()
], pe.prototype, "_templates", 2);
ut([
  p()
], pe.prototype, "_fonts", 2);
ut([
  p()
], pe.prototype, "_health", 2);
ut([
  p()
], pe.prototype, "_loading", 2);
ut([
  p()
], pe.prototype, "_importing", 2);
ut([
  p()
], pe.prototype, "_pasteJson", 2);
ut([
  p()
], pe.prototype, "_showPaste", 2);
pe = ut([
  L("di-overview-dashboard")
], pe);
const Xc = pe, Yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return pe;
  },
  default: Xc
}, Symbol.toStringTag, { value: "Module" })), bs = /* @__PURE__ */ new Map(), Ha = (e) => `di-${e}`;
function qc(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = bs.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await un(e, t), o = new FontFace(Ha(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return bs.set(e, a), a;
}
async function jn(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => qc(a, t)));
}
function Xn(e) {
  bs.delete(e);
}
const Jc = new Go(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), Zc = new Go(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var Qc = Object.defineProperty, eu = Object.getOwnPropertyDescriptor, Yn = (e) => {
  throw TypeError(e);
}, Ga = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? eu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Qc(t, i, s), s;
}, Js = (e, t, i) => t.has(e) || Yn("Cannot " + i), Pe = (e, t, i) => (Js(e, t, "read from private field"), i ? i.call(e) : t.get(e)), wi = (e, t, i) => t.has(e) ? Yn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ts = (e, t, i, a) => (Js(e, t, "write to private field"), t.set(e, i), i), R = (e, t, i) => (Js(e, t, "access private method"), i), ha, Mi, zi, Mt, O, gi, ot, _s, qn, Jn, da, Zn, Qn, er;
function tu(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : iu(e.sourceUrl);
    default:
      return "Media library";
  }
}
function iu(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let nt = class extends F {
  constructor() {
    super(), wi(this, O), wi(this, ha), wi(this, Mi), wi(this, zi), this._fonts = [], this._loading = !0, wi(this, Mt, () => {
      var e;
      return (e = Pe(this, ha)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Wa, (e) => {
      ts(this, Mi, e);
    }), this.consumeContext(ct, (e) => {
      ts(this, zi, e);
    }), this.consumeContext(Be, (e) => {
      ts(this, ha, e), e && R(this, O, gi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${R(this, O, _s)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf or .woff2, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${R(this, O, _s)}>
                  Add your first font
                </uui-button>
              </div>` : r`${B(this._fonts, (e) => e.key, (e) => R(this, O, Zn).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
ha = /* @__PURE__ */ new WeakMap();
Mi = /* @__PURE__ */ new WeakMap();
zi = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
gi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Ei(Pe(this, Mt)), await jn(this._fonts.map((e) => e.key), Pe(this, Mt));
  } catch (e) {
    R(this, O, ot).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
ot = function(e, t, i) {
  var s;
  const a = i instanceof st ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Pe(this, zi)) == null || s.peek(e, { data: { headline: t, message: a } });
};
_s = async function() {
  var i, a;
  if (!Pe(this, Mi)) return;
  const e = Pe(this, Mi).open(this, Zc, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Pe(this, zi)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await R(this, O, gi).call(this));
};
qn = async function(e) {
  try {
    await rn(e.key, Pe(this, Mt)), Xn(e.key), R(this, O, ot).call(this, "positive", `'${e.familyName}' refreshed`), await R(this, O, gi).call(this);
  } catch (t) {
    R(this, O, ot).call(this, "danger", "That font could not be refreshed", t);
  }
};
Jn = async function(e) {
  await Us(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await cn(e.key, Pe(this, Mt)), Xn(e.key), R(this, O, ot).call(this, "positive", `'${e.familyName}' deleted`), await R(this, O, gi).call(this);
  } catch (t) {
    R(this, O, ot).call(this, "danger", "That font could not be deleted", t);
  }
};
da = async function(e, t, i) {
  try {
    await ln(e.key, t, i, Pe(this, Mt)), this._editingKey = void 0, R(this, O, ot).call(this, "positive", `'${t}' saved`), await R(this, O, gi).call(this);
  } catch (a) {
    R(this, O, ot).call(this, "danger", "The font could not be saved", a);
  }
};
Zn = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${tu(e)} · weight ${e.weight}
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
                  @click=${() => R(this, O, qn).call(this, e)}>
                  Refresh
                </uui-button>` : m}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => R(this, O, Jn).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Ha(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? R(this, O, er).call(this, e) : R(this, O, Qn).call(this, e)}
      </div>
    `;
};
Qn = function(e) {
  return e.styles.length === 0 ? m : r`<div class="tags">
      ${B(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
er = function(e) {
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
          ${B(
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
nt.styles = A`
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
Ga([
  p()
], nt.prototype, "_fonts", 2);
Ga([
  p()
], nt.prototype, "_loading", 2);
Ga([
  p()
], nt.prototype, "_editingKey", 2);
nt = Ga([
  L("di-fonts-dashboard")
], nt);
const au = nt, su = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return nt;
  },
  default: au
}, Symbol.toStringTag, { value: "Module" }));
var ou = Object.defineProperty, nu = Object.getOwnPropertyDescriptor, tr = (e) => {
  throw TypeError(e);
}, Xi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ou(t, i, s), s;
}, Zs = (e, t, i) => t.has(e) || tr("Cannot " + i), qe = (e, t, i) => (Zs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), sa = (e, t, i) => t.has(e) ? tr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Lo = (e, t, i, a) => (Zs(e, t, "write to private field"), t.set(e, i), i), Vt = (e, t, i) => (Zs(e, t, "access private method"), i), pa, Ht, ui, tt, Da, ws, ir;
let Ne = class extends F {
  constructor() {
    super(), sa(this, tt), sa(this, pa), sa(this, Ht), this._loading = !0, this._busy = !1, sa(this, ui, () => {
      var e;
      return (e = qe(this, pa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(ct, (e) => {
      Lo(this, Ht, e);
    }), this.consumeContext(Be, (e) => {
      Lo(this, pa, e), e && Vt(this, tt, Da).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Vt(this, tt, Da).call(this)}>Re-check</uui-button>
          </div>

          <ul class="summary">
            <li>
              Image generation is
              <strong class=${this._health.isEnabled ? "ok" : "bad"}>${this._health.isEnabled ? "on" : "off"}</strong>
              ${this._health.isEnabled ? m : r`(set <code>DynamicImages:Enabled</code> to true)`}
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
                ${B(
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
                        ${a.templateKey ? r`<a href=${ci(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Vt(this, tt, ir).call(this)}
      </umb-body-layout>
    `;
  }
};
pa = /* @__PURE__ */ new WeakMap();
Ht = /* @__PURE__ */ new WeakMap();
ui = /* @__PURE__ */ new WeakMap();
tt = /* @__PURE__ */ new WeakSet();
Da = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Na(qe(this, ui)),
      yn(qe(this, ui)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
ws = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await vn(qe(this, ui)) : await bn(qe(this, ui));
    (t = qe(this, Ht)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = qe(this, Ht)) == null || i.peek("warning", { data: { message: o } });
    await Vt(this, tt, Da).call(this);
  } catch (s) {
    (a = qe(this, Ht)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
ir = function() {
  return this._sync ? r`
      <uui-box headline="Environment transfer">
        <p>
          Templates live in the database. To move them between environments, export them to JSON files under
          <code>${this._sync.folder}</code> and commit those, or import files someone else committed.
        </p>
        <p class="meta">
          Mode: <strong>${this._sync.mode}</strong> · ${this._sync.fileCount} file(s)
          ${this._sync.lastWriteUtc ? r`· last written ${new Date(this._sync.lastWriteUtc).toLocaleString()}` : m}
        </p>

        <div class="row">
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Vt(this, tt, ws).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Vt(this, tt, ws).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : m;
};
Ne.styles = A`
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
  p()
], Ne.prototype, "_health", 2);
Xi([
  p()
], Ne.prototype, "_sync", 2);
Xi([
  p()
], Ne.prototype, "_loading", 2);
Xi([
  p()
], Ne.prototype, "_busy", 2);
Ne = Xi([
  L("di-health-dashboard")
], Ne);
const ru = Ne, lu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Ne;
  },
  default: ru
}, Symbol.toStringTag, { value: "Module" }));
function cu(e, t) {
  const i = [], a = t.lockX ? void 0 : Ro(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    uu(t),
    t.threshold
  ), s = t.lockY ? void 0 : Ro(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    hu(t),
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
function uu(e) {
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
function hu(e) {
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
function Ro(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
const ar = 3, sr = 12, or = 0.1, nr = 0.9;
function du(e) {
  return Math.max(ar, Math.min(sr, e));
}
function pu(e) {
  return Math.max(or, Math.min(nr, e));
}
function mu(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = du(t), s = 0.5 * pu(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let d = 0; d < o; d++) {
    const f = (-90 + d * n) * Math.PI / 180, C = e === "star" && d % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + C * Math.cos(f), y: 0.5 + C * Math.sin(f) });
  }
  return l;
}
function fu(e, t, i) {
  const a = mu(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
var gu = Object.defineProperty, yu = Object.getOwnPropertyDescriptor, rr = (e) => {
  throw TypeError(e);
}, Ke = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && gu(t, i, s), s;
}, Qs = (e, t, i) => t.has(e) || rr("Cannot " + i), ye = (e, t, i) => (Qs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), is = (e, t, i) => t.has(e) ? rr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), as = (e, t, i, a) => (Qs(e, t, "write to private field"), t.set(e, i), i), j = (e, t, i) => (Qs(e, t, "access private method"), i), ft, xi, M, ja, eo, lr, cr, ur, hr, to, Pa, dr, pr, mr, fr, gr, yr, vr, br, _r;
const vu = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], ss = 18;
let _e = class extends F {
  constructor() {
    super(...arguments), is(this, M), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, is(this, ft), is(this, xi);
  }
  willUpdate() {
    this._box = j(this, M, lr).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ye(this, xi) && ((t = ye(this, ft)) == null || t.disconnect(), as(this, xi, e), e && (ye(this, ft) ?? as(this, ft, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ye(this, ft).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ye(this, ft)) == null || e.disconnect(), as(this, xi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return m;
    const e = this._box;
    return r`
      <div
        class=${Ho({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${V({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ye(this, M, cr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...j(this, M, to).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      j(this, M, dr).call(this, t), j(this, M, Pa).call(this, t);
    }}>
        ${j(this, M, pr).call(this)}
      </div>

      ${this.selected ? j(this, M, br).call(this, e) : m}
      ${this.showMeasured && this.measured ? j(this, M, _r).call(this) : m}
    `;
  }
};
ft = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
ja = function() {
  return this.resolvedPosition ?? this.layer.position;
};
eo = function() {
  return this.layer.rotation ?? 0;
};
lr = function() {
  var s;
  const e = this.layer, t = e.size.width ?? j(this, M, ur).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? j(this, M, hr).call(this), a = Va(ye(this, M, ja), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
cr = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
ur = function() {
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
hr = function() {
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
to = function(e) {
  const t = ye(this, M, eo);
  if (t === 0) return {};
  const i = ye(this, M, ja);
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
dr = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
pr = function() {
  switch (this.layer.type) {
    case "text":
      return j(this, M, mr).call(this);
    case "image":
      return j(this, M, gr).call(this);
    case "badges":
      return j(this, M, yr).call(this);
    default:
      return j(this, M, vr).call(this);
  }
};
mr = function() {
  if (this.layer.type !== "text") return m;
  const e = this.layer.style, t = this.resolvedText || j(this, M, fr).call(this);
  return r`
      <div
        class="text"
        style=${V({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Ha(e.fontKey)}, sans-serif`,
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
fr = function() {
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
gr = function() {
  if (this.layer.type !== "image") return m;
  const e = this.layer.border;
  return r`
      <div
        class="image"
        style=${V({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
yr = function() {
  if (this.layer.type !== "badges") return m;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", d = l && o, f = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${V({
    flexDirection: l ? "row" : "column",
    flexWrap: d ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...d ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${B(
    Array.from({ length: Math.max(1, a) }, (C, X) => X),
    (C) => C,
    () => r`
            <div class=${Ho({ badge: !0, right: f === "right" })}>
              <div
                class="circle"
                style=${V({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${f === "none" ? m : r`<div
                    class="badge-label"
                    style=${V({
      ...f === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${Ha(t.fontKey)}, sans-serif`,
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
vr = function() {
  if (this.layer.type !== "rect") return m;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? `linear-gradient(${i.angle}deg, ${i.from}, ${i.to})` : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${V({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${o}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const n = fu(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${V({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${V({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
br = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = ye(this, M, ja), n = ye(this, M, eo), l = Me(this.layer.position, "x") || Me(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${V({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...j(this, M, to).call(this, e) })}>
        <span
          class="tag"
          style=${V(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : m}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? m : r`
              ${B(
    vu,
    (d) => d,
    (d) => r`
                  <span
                    class="handle ${d}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${d}"
                    @pointerdown=${(f) => j(this, M, Pa).call(this, f, d)}>
                  </span>
                `
  )}
              <span class="stalk" style=${V({ height: `${ss}px`, top: `${-ss}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${V({ top: `${-ss}px` })}
                @pointerdown=${(d) => j(this, M, Pa).call(this, d, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${V({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
_r = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return r`
      <div
        class="measured"
        style=${V({
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
_e.styles = A`
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
Ke([
  v({ type: Object })
], _e.prototype, "layer", 2);
Ke([
  v({ type: Number })
], _e.prototype, "scale", 2);
Ke([
  v({ type: Boolean, reflect: !0 })
], _e.prototype, "selected", 2);
Ke([
  v({ type: Object })
], _e.prototype, "measured", 2);
Ke([
  v({ type: Boolean })
], _e.prototype, "showMeasured", 2);
Ke([
  v({ type: String })
], _e.prototype, "resolvedText", 2);
Ke([
  v({ attribute: !1 })
], _e.prototype, "resolvedPosition", 2);
Ke([
  p()
], _e.prototype, "_box", 2);
_e = Ke([
  L("di-layer-box")
], _e);
var bu = Object.defineProperty, _u = Object.getOwnPropertyDescriptor, wr = (e) => {
  throw TypeError(e);
}, io = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? _u(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && bu(t, i, s), s;
}, wu = (e, t, i) => t.has(e) || wr("Cannot " + i), $u = (e, t, i) => t.has(e) ? wr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xu = (e, t, i) => (wu(e, t, "access private method"), i), $s, $r;
let Oi = class extends F {
  constructor() {
    super(...arguments), $u(this, $s), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${B(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => xu(this, $s, $r).call(this, e)
    )}`;
  }
};
$s = /* @__PURE__ */ new WeakSet();
$r = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Oi.styles = A`
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
io([
  v({ type: Array })
], Oi.prototype, "guides", 2);
io([
  v({ type: Number })
], Oi.prototype, "scale", 2);
Oi = io([
  L("di-guides")
], Oi);
var ku = Object.defineProperty, Su = Object.getOwnPropertyDescriptor, xr = (e) => {
  throw TypeError(e);
}, Yi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Su(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ku(t, i, s), s;
}, Tu = (e, t, i) => t.has(e) || xr("Cannot " + i), Cu = (e, t, i) => t.has(e) ? xr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Wo = (e, t, i) => (Tu(e, t, "access private method"), i), ma, xs;
let Y = class extends F {
  constructor() {
    super(...arguments), Cu(this, ma), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Wo(this, ma, xs).call(this, "top"), Wo(this, ma, xs).call(this, "left");
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
xs = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : Y.thickness) * o, t.height = (e === "top" ? Y.thickness : s) * o, t.style.width = `${e === "top" ? s : Y.thickness}px`, t.style.height = `${e === "top" ? Y.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const d = Math.round(l * this.scale) + 0.5, f = l % 100 === 0, C = f ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(d, Y.thickness - C), i.lineTo(d, Y.thickness)) : (i.moveTo(Y.thickness - C, d), i.lineTo(Y.thickness, d)), i.stroke(), f && l > 0 && (e === "top" ? i.fillText(String(l), d + 2, 9) : (i.save(), i.translate(9, d - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
Y.thickness = 20;
Y.styles = A`
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
], Y.prototype, "canvasWidth", 2);
Yi([
  v({ type: Number })
], Y.prototype, "canvasHeight", 2);
Yi([
  v({ type: Number })
], Y.prototype, "scale", 2);
Yi([
  v({ type: Object })
], Y.prototype, "pointer", 2);
Y = Yi([
  L("di-rulers")
], Y);
var Eu = Object.defineProperty, Du = Object.getOwnPropertyDescriptor, kr = (e) => {
  throw TypeError(e);
}, ae = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Du(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Eu(t, i, s), s;
}, ao = (e, t, i) => t.has(e) || kr("Cannot " + i), I = (e, t, i) => (ao(e, t, "read from private field"), i ? i.call(e) : t.get(e)), se = (e, t, i) => t.has(e) ? kr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fa = (e, t, i, a) => (ao(e, t, "write to private field"), t.set(e, i), i), z = (e, t, i) => (ao(e, t, "access private method"), i), gt, ki, at, E, so, ks, Ss, Xa, oo, Ts, Sr, Tr, no, Cr, Er, Cs, ga, Dr, Pr, Ft, ro, Es, Ds, Ps, Ms, zs, Os, Mr;
const Pu = 6, zr = 20, Mu = 15, zu = 0.1;
let Z = class extends F {
  constructor() {
    super(...arguments), se(this, E), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, se(this, gt), se(this, ki), se(this, at, /* @__PURE__ */ new Map()), se(this, Cs, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = z(this, E, oo).call(this, t), a = z(this, E, Ts).call(this, t), s = z(this, E, Sr).call(this, t), o = z(this, E, Xa).call(this, e.detail.startX, e.detail.startY);
      fa(this, gt, {
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
    }), se(this, ga, (e) => {
      var ta, To;
      this._pointer = z(this, E, Ss).call(this, e.clientX, e.clientY);
      const t = I(this, gt);
      if (!t) return;
      const i = this.template.layers.find((vi) => vi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        z(this, E, Pr).call(this, i, t, e);
        return;
      }
      const o = Me(i.position, "x"), n = Me(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        z(this, E, Dr).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let d = t.handle ? z(this, E, ro).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (d = { ...d, x: t.startBox.x, width: (ta = t.handle) != null && ta.includes("w") ? t.startBox.width : d.width }), n && (d = { ...d, y: t.startBox.y, height: (To = t.handle) != null && To.includes("n") ? t.startBox.height : d.height });
      const f = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, C = l !== 0 ? { x: d.x + f.x, y: d.y + f.y, width: t.startExtent.width, height: t.startExtent.height } : d, $e = this.snapEnabled && !e.altKey ? cu(C, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((vi) => vi.key !== i.key).map((vi) => z(this, E, Ts).call(this, vi)),
        threshold: Pu / this.scale,
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
      this._guides = $e.guides;
      const Ie = l !== 0 ? { ...d, x: $e.box.x - f.x, y: $e.box.y - f.y } : $e.box, Ge = xc(Ie, i.position);
      o && (Ge.x = i.position.x), n && (Ge.y = i.position.y);
      const Ae = { position: Ge };
      t.handle && (Ae.size = {
        width: Math.max(1, Math.round(Ie.width)),
        height: Math.max(1, Math.round(Ie.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Ae } })
      );
    }), se(this, Ft, () => {
      if (!I(this, gt)) return;
      const e = I(this, gt).moved;
      fa(this, gt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), se(this, Es, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), se(this, Ds, () => {
      this._dropTarget = !1;
    }), se(this, Ps, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = z(this, E, Ss).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y }
        })
      );
    }), se(this, Ms, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), se(this, zs, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Cn(t.position)) && this.requestUpdate();
    }), se(this, Os, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), fa(this, ki, new ResizeObserver(() => z(this, E, ks).call(this))), I(this, ki).observe(this), window.addEventListener("pointermove", I(this, ga)), window.addEventListener("pointerup", I(this, Ft)), window.addEventListener("pointercancel", I(this, Ft));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = I(this, ki)) == null || e.disconnect(), window.removeEventListener("pointermove", I(this, ga)), window.removeEventListener("pointerup", I(this, Ft)), window.removeEventListener("pointercancel", I(this, Ft));
  }
  updated(e) {
    z(this, E, ks).call(this), e.has("zoom") && z(this, E, so).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = I(this, at).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return m;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    z(this, E, Tr).call(this);
    const s = this.showRulers ? zr : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${I(this, Ms)}
        @dragover=${I(this, Es)}
        @dragleave=${I(this, Ds)}
        @drop=${I(this, Ps)}
        @di-layer-drag-start=${I(this, Cs)}
        @di-layer-box-resize=${I(this, zs)}>
        <div
          class="artboard"
          style=${V({
      width: `${t + s}px`,
      height: `${i + s}px`,
      "--di-gutter": `${s}px`
    })}>
          ${this.showRulers ? r`<di-rulers
                .canvasWidth=${e.width}
                .canvasHeight=${e.height}
                .scale=${this.scale}
                .pointer=${this._pointer}>
              </di-rulers>` : m}

          <div
            class="stage"
            style=${V({ background: e.background })}
            @pointerdown=${I(this, Os)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${V({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : m}

            ${B(
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
                  .resolvedPosition=${(l = I(this, at).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? z(this, E, Mr).call(this) : m}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
gt = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakMap();
at = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
so = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
ks = function() {
  const e = this.renderRoot.querySelector(".viewport");
  if (!e || !this.template) return;
  const t = 48 + (this.showRulers ? zr : 0), i = {
    width: Math.max(1, e.clientWidth - t),
    height: Math.max(1, e.clientHeight - t)
  }, a = Math.min(
    i.width / this.template.canvas.width,
    i.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(a - this._fitScale) > 1e-3 && (this._fitScale = a, z(this, E, so).call(this));
};
Ss = function(e, t) {
  const i = z(this, E, Xa).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Xa = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
oo = function(e) {
  const t = I(this, at).get(e.key);
  if (t) return t.box;
  const i = z(this, E, no).call(this, e), a = Va(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Ts = function(e) {
  const t = I(this, at).get(e.key);
  return t ? t.extent : Tn(z(this, E, oo).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Sr = function(e) {
  var t;
  return ((t = I(this, at).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Tr = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  fa(this, at, Dc(
    this.template.layers,
    (i) => z(this, E, no).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
no = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? z(this, E, Cr).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? z(this, E, Er).call(this, e, i)
  };
};
Cr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Er = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Cs = /* @__PURE__ */ new WeakMap();
ga = /* @__PURE__ */ new WeakMap();
Dr = function(e, t, i, a, s, o, n, l) {
  const d = t.startRotation, f = t.startPosition, C = kc(a, s, 0, 0, d);
  let X = z(this, E, ro).call(this, t.startBox, i, C.x, C.y, o);
  n && (X = { ...X, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : X.width }), l && (X = { ...X, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : X.height });
  const $e = Math.max(1, Math.round(X.width)), Ie = Math.max(1, Math.round(X.height)), Ge = Gs(X.x, X.y, $e, Ie, f.anchor), Ae = Bt(Ge.x, Ge.y, f.x, f.y, d), ta = {
    ...e.position,
    x: n ? e.position.x : Math.round(Ae.x),
    y: l ? e.position.y : Math.round(Ae.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: ta, size: { width: $e, height: Ie } } }
    })
  );
};
Pr = function(e, t, i) {
  const a = t.startPosition, s = z(this, E, Xa).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, d = i.shiftKey ? Mu : zu, f = Sn(Math.round(l / d) * d);
  this._guides = [], f !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: f } }
    })
  );
};
Ft = /* @__PURE__ */ new WeakMap();
ro = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: d } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, d = e.height - a), t.includes("s") && (d = e.height + a), s && e.width > 0 && e.height > 0) {
    const f = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(d - e.height) ? d = l / f : l = d * f, t.includes("n") && (n = e.y + e.height - d), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, d) };
};
Es = /* @__PURE__ */ new WeakMap();
Ds = /* @__PURE__ */ new WeakMap();
Ps = /* @__PURE__ */ new WeakMap();
Ms = /* @__PURE__ */ new WeakMap();
zs = /* @__PURE__ */ new WeakMap();
Os = /* @__PURE__ */ new WeakMap();
Mr = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${V({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
Z.styles = A`
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
ae([
  v({ type: Object })
], Z.prototype, "template", 2);
ae([
  v({ type: String })
], Z.prototype, "selectedLayerKey", 2);
ae([
  v({ type: Object })
], Z.prototype, "baseImageUrl", 2);
ae([
  v({ type: Array })
], Z.prototype, "serverBounds", 2);
ae([
  v({ type: Boolean })
], Z.prototype, "showMeasured", 2);
ae([
  v({ type: Boolean })
], Z.prototype, "snapEnabled", 2);
ae([
  v({ type: Boolean })
], Z.prototype, "showRulers", 2);
ae([
  v({ type: Boolean })
], Z.prototype, "showSafeArea", 2);
ae([
  v({ type: Number })
], Z.prototype, "zoom", 2);
ae([
  p()
], Z.prototype, "_fitScale", 2);
ae([
  p()
], Z.prototype, "_guides", 2);
ae([
  p()
], Z.prototype, "_pointer", 2);
ae([
  p()
], Z.prototype, "_dropTarget", 2);
Z = ae([
  L("di-designer-canvas")
], Z);
var Ou = Object.defineProperty, Iu = Object.getOwnPropertyDescriptor, Or = (e) => {
  throw TypeError(e);
}, lo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Iu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ou(t, i, s), s;
}, Ir = (e, t, i) => t.has(e) || Or("Cannot " + i), Au = (e, t, i) => (Ir(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Lu = (e, t, i) => t.has(e) ? Or("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ce = (e, t, i) => (Ir(e, t, "access private method"), i), le, Ar, Lr, Rr, Wr, Fr, vt;
const Fo = {
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
let Ii = class extends F {
  constructor() {
    super(...arguments), Lu(this, le), this.properties = [], this._search = "";
  }
  render() {
    const e = Ru(Au(this, le, Ar));
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

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : B(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => Ce(this, le, Wr).call(this, t, i)
    )}

        ${Ce(this, le, Fr).call(this)}
      </div>
    `;
  }
};
le = /* @__PURE__ */ new WeakSet();
Ar = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Lr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Rr = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Wr = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${B(
    t,
    (i) => i.alias,
    (i) => Ce(this, le, vt).call(this, i.name, Fo[i.classification] ?? Fo.other, i.classification, { kind: "property", property: i })
  )}
      </div>
    `;
};
Fr = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Ce(this, le, vt).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Ce(this, le, vt).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Ce(this, le, vt).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Ce(this, le, vt).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Ce(this, le, vt).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
vt = function(e, t, i, a) {
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        @dragstart=${(s) => Ce(this, le, Rr).call(this, s, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${e}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label="Add ${e} to the canvas"
          @click=${() => Ce(this, le, Lr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Ii.styles = A`
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
lo([
  v({ type: Array })
], Ii.prototype, "properties", 2);
lo([
  p()
], Ii.prototype, "_search", 2);
Ii = lo([
  L("di-property-palette")
], Ii);
function Ru(e) {
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
var Wu = Object.defineProperty, Fu = Object.getOwnPropertyDescriptor, Nr = (e) => {
  throw TypeError(e);
}, Ya = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wu(t, i, s), s;
}, Ur = (e, t, i) => t.has(e) || Nr("Cannot " + i), Je = (e, t, i) => (Ur(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Nu = (e, t, i) => t.has(e) ? Nr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ti = (e, t, i) => (Ur(e, t, "access private method"), i), ee, Ai, Ci, qa, Br, Kr;
let hi = class extends F {
  constructor() {
    super(...arguments), Nu(this, ee), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Je(this, ee, Ai)};opacity:${Je(this, ee, Ci)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Ti(this, ee, qa).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Je(this, ee, Ai)}
                  @input=${(e) => Ti(this, ee, Br).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Je(this, ee, Ci))}
                    @input=${(e) => Ti(this, ee, Kr).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Je(this, ee, Ci) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
ee = /* @__PURE__ */ new WeakSet();
Ai = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
Ci = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
qa = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Br = function(e) {
  const t = Je(this, ee, Ci);
  Ti(this, ee, qa).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${Vr(t)}`);
};
Kr = function(e) {
  Ti(this, ee, qa).call(this, e >= 0.999 ? Je(this, ee, Ai).toUpperCase() : `${Je(this, ee, Ai).toUpperCase()}${Vr(e)}`);
};
hi.styles = A`
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
Ya([
  v({ type: String })
], hi.prototype, "value", 2);
Ya([
  v({ type: String })
], hi.prototype, "label", 2);
Ya([
  p()
], hi.prototype, "_open", 2);
hi = Ya([
  L("di-colour-input")
], hi);
const Vr = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Uu = Object.defineProperty, Bu = Object.getOwnPropertyDescriptor, Hr = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Uu(t, i, s), s;
};
const No = {
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
let Ma = class extends F {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${B(
      kn,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${No[e]}
              title=${No[e]}
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
Hr([
  v({ type: String })
], Ma.prototype, "value", 2);
Ma = Hr([
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
  sides: { min: ar, max: sr },
  innerRatio: { min: or, max: nr }
};
function Ku(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
var Vu = Object.defineProperty, Hu = Object.getOwnPropertyDescriptor, Gr = (e) => {
  throw TypeError(e);
}, ht = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Hu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Vu(t, i, s), s;
}, Gu = (e, t, i) => t.has(e) || Gr("Cannot " + i), ju = (e, t, i) => t.has(e) ? Gr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Xu = (e, t, i) => (Gu(e, t, "access private method"), i), Is, jr;
let Oe = class extends F {
  constructor() {
    super(...arguments), ju(this, Is), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
  }
  render() {
    return r`
      <label class="field">
        ${this.label ? r`<span class="label">${this.label}</span>` : m}
        <span class="input">
          <input
            type="number"
            aria-label=${this.label}
            .value=${this.value === null || this.value === void 0 ? "" : String(this.value)}
            placeholder=${this.placeholder}
            step=${this.step}
            min=${this.min ?? m}
            max=${this.max ?? m}
            @change=${Xu(this, Is, jr)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : m}
        </span>
      </label>
    `;
  }
};
Is = /* @__PURE__ */ new WeakSet();
jr = function(e) {
  const t = e.target, i = t.value, a = Ku(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Oe.styles = A`
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
ht([
  v({ type: Number })
], Oe.prototype, "value", 2);
ht([
  v({ type: String })
], Oe.prototype, "label", 2);
ht([
  v({ type: String })
], Oe.prototype, "suffix", 2);
ht([
  v({ type: Number })
], Oe.prototype, "step", 2);
ht([
  v({ type: Number })
], Oe.prototype, "min", 2);
ht([
  v({ type: Number })
], Oe.prototype, "max", 2);
ht([
  v({ type: String })
], Oe.prototype, "placeholder", 2);
Oe = ht([
  L("di-number-field")
], Oe);
var Yu = Object.defineProperty, qu = Object.getOwnPropertyDescriptor, Xr = (e) => {
  throw TypeError(e);
}, qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Yu(t, i, s), s;
}, Ju = (e, t, i) => t.has(e) || Xr("Cannot " + i), Zu = (e, t, i) => t.has(e) ? Xr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (Ju(e, t, "access private method"), i), u, y, je, Yr, qr, Jr, Zr, Qr, el, tl, il, As, al, ya, sl, ol, yi, co, nl;
let zt = class extends F {
  constructor() {
    super(...arguments), Zu(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, u, qr).call(this, this.layer) : h(this, u, Yr).call(this)}</div>` : m;
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
je = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Yr = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => h(this, u, je).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => h(this, u, je).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Background</span>
          <di-colour-input
            label="Canvas background"
            .value=${e.background}
            @change=${(t) => h(this, u, je).call(this, { background: t.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${rl(e.baseImage.kind)}
              @change=${(t) => h(this, u, je).call(this, {
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
                @change=${(t) => h(this, u, je).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : m}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${h(this, u, yi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, u, je).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : m}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${ie(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => h(this, u, je).call(this, { baseImageFit: t.target.value })}>
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
qr = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, u, y).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, u, Jr).call(this, e) : m}
      ${e.type === "text" ? h(this, u, Zr).call(this, e) : m}
      ${e.type === "image" ? h(this, u, Qr).call(this, e) : m}
      ${e.type === "badges" ? h(this, u, el).call(this, e) : m}
      ${e.type === "rect" ? h(this, u, tl).call(this, e) : m}
      ${h(this, u, il).call(this, e)} ${h(this, u, ol).call(this, e)}
    `;
};
Jr = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${ie(
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
              ${h(this, u, yi).call(this, t.propertyAlias ?? "", (i) => h(this, u, y).call(this, { binding: { ...t, propertyAlias: i } }))}
            </label>` : m}

        ${t.kind === "date" ? r`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => h(this, u, y).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : m}

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
                  </small>` : m}
            </label>` : m}

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
Zr = function(e) {
  const t = e.style, i = (a) => h(this, u, y).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, u, co).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, u, nl).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
              .options=${ie(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${ie(["left", "centre", "right"], t.textAlign)}
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
              .options=${ie(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${ie(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
Qr = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${rl(t.kind)}
            @change=${(a) => h(this, u, y).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, yi).call(this, t.propertyAlias ?? "", (a) => h(this, u, y).call(this, { source: { ...t, propertyAlias: a } }), "media")}
            </label>` : m}

        ${t.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => h(this, u, y).call(this, {
    source: { ...t, path: a.target.value }
  })}>
              </uui-input>
            </label>` : m}

        ${t.kind === "media" ? r`<uui-button
              look="secondary"
              label="Choose an image from the media library"
              @click=${() => this.dispatchEvent(
    new CustomEvent("di-pick-layer-image", { bubbles: !0, composed: !0, detail: { key: e.key } })
  )}>
              Choose image
            </uui-button>` : m}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.fit}
            .options=${ie(["cover", "contain", "stretch"], e.fit)}
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
                </di-colour-input>` : m}
          </div>
        </label>
      </uui-box>
    `;
};
el = function(e) {
  const t = (s) => h(this, u, y).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, u, y).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, u, y).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, u, yi).call(this, e.itemsPropertyAlias, (s) => h(this, u, y).call(this, { itemsPropertyAlias: s }))}
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
            .options=${ie(["horizontal", "vertical"], e.direction)}
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
                  ` : m}
            ` : m}

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
            .options=${ie(["below", "right", "none"], e.label.position, {
    below: "Below the icon",
    right: "Beside the icon",
    none: "Icon only"
  })}
            @change=${(s) => i({ position: s.target.value })}>
          </uui-select>
          ${e.label.position === "right" ? r`<small class="hint">Each badge is as wide as its own label.</small>` : m}
        </label>

        ${e.label.position === "none" ? m : r`
              <label class="field">
                <span>Label font</span>
                <uui-select
                  .value=${e.label.fontKey}
                  .options=${h(this, u, co).call(this, e.label.fontKey)}
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
                  .options=${ie(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
tl = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${ie(["rectangle", "ellipse", "polygon", "star"], t)}
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
                    </di-number-field>` : m}
              </div>
            ` : m}

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
            </label>` : m}

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
            ` : m}

        ${t === "rectangle" ? r`<di-number-field
            .min=${g.cornerRadius.min}
            .max=${g.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => h(this, u, y).call(this, { cornerRadius: s.detail.value ?? 0 })}>
            </di-number-field>` : m}

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
                </di-colour-input>` : m}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </label>
      </uui-box>
    `;
};
il = function(e) {
  const t = Me(e.position, "x"), i = Me(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, u, As).call(this, e, "x")} ${h(this, u, As).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, u, sl).call(this, e, s.detail.value)}>
          </di-anchor-picker>
          <small class="hint">
            Where X and Y sit on the layer's box.
            ${t || i ? r`The ${t && i ? "horizontal and vertical" : t ? "horizontal" : "vertical"}
                  ${t && i ? "components are" : "component is"} set by the edge
                  ${t && i ? "each axis tracks" : "that axis tracks"}.` : m}
            ${a !== 0 ? r`The layer turns around this point.` : m}
          </small>
        </label>

        <div class="field">
          <di-number-field
            label="Rotation"
            suffix="°"
            step="1"
            placeholder="0"
            .value=${a}
            @change=${(s) => h(this, u, y).call(this, { rotation: Sn(s.detail.value ?? 0) })}>
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
As = function(e, t) {
  const i = Me(e.position, t), a = Sa(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => h(this, u, al).call(this, e, t, n.target.value)}>
          </uui-select>
          ${!i && s.length === 0 ? r`<small class="hint">Add another layer to position this one against it.</small>` : m}
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
                    .options=${ie(o, a.edge, {
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
al = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Me(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && h(this, u, y).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Sc
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
sl = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? $c(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, u, y).call(this, { position: s });
};
ol = function(e) {
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
            .options=${ie(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
              ${h(this, u, yi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, u, y).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : m}
      </uui-box>
    `;
};
yi = function(e, t, i) {
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
co = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
nl = function(e, t, i) {
  const a = this.fonts.find((s) => s.key === e);
  return !a || a.styles.length === 0 ? m : r`
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
zt.styles = A`
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
], zt.prototype, "template", 2);
qi([
  v({ type: Object })
], zt.prototype, "layer", 2);
qi([
  v({ type: Array })
], zt.prototype, "properties", 2);
qi([
  v({ type: Array })
], zt.prototype, "fonts", 2);
zt = qi([
  L("di-layer-inspector")
], zt);
function ie(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function rl(e) {
  return ie(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var Qu = Object.defineProperty, eh = Object.getOwnPropertyDescriptor, ll = (e) => {
  throw TypeError(e);
}, Ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? eh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Qu(t, i, s), s;
}, th = (e, t, i) => t.has(e) || ll("Cannot " + i), ih = (e, t, i) => t.has(e) ? ll("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xe = (e, t, i) => (th(e, t, "access private method"), i), ue, bt, cl, ul, hl, dl;
const ah = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Ot = class extends F {
  constructor() {
    super(...arguments), ih(this, ue), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${xe(this, ue, hl)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : B(
      e,
      (t) => t.key,
      (t, i) => xe(this, ue, dl).call(this, t, i)
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
bt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
cl = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
ul = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
hl = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  xe(this, ue, bt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
dl = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => xe(this, ue, cl).call(this, a, e.key)}
        @dragover=${(a) => xe(this, ue, ul).call(this, a, t)}
        @click=${() => xe(this, ue, bt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${ah[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          look="secondary"
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), xe(this, ue, bt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name=${e.isVisible ? "icon-eye" : "icon-eye-off"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), xe(this, ue, bt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), xe(this, ue, bt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), xe(this, ue, bt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Ot.styles = A`
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
], Ot.prototype, "layers", 2);
Ji([
  v({ type: String })
], Ot.prototype, "selectedLayerKey", 2);
Ji([
  p()
], Ot.prototype, "_dragKey", 2);
Ji([
  p()
], Ot.prototype, "_dropIndex", 2);
Ot = Ji([
  L("di-layers-panel")
], Ot);
var sh = Object.defineProperty, oh = Object.getOwnPropertyDescriptor, pl = (e) => {
  throw TypeError(e);
}, Ve = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? oh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && sh(t, i, s), s;
}, nh = (e, t, i) => t.has(e) || pl("Cannot " + i), rh = (e, t, i) => t.has(e) ? pl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fe = (e, t, i) => (nh(e, t, "access private method"), i), oe, Xe, Si;
let we = class extends F {
  constructor() {
    super(...arguments), rh(this, oe), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1;
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
            @click=${() => fe(this, oe, Xe).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-remove"></uui-icon>
          </uui-button>
          <span class="value">${Math.round(this.effectiveScale * 100)}%</span>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => fe(this, oe, Xe).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-add"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => fe(this, oe, Xe).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${fe(this, oe, Si).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${fe(this, oe, Si).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${fe(this, oe, Si).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${fe(this, oe, Si).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => fe(this, oe, Xe).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => fe(this, oe, Xe).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => fe(this, oe, Xe).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
oe = /* @__PURE__ */ new WeakSet();
Xe = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Si = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => fe(this, oe, Xe).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
we.styles = A`
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
Ve([
  v({ type: Number })
], we.prototype, "effectiveScale", 2);
Ve([
  v({ type: Boolean })
], we.prototype, "snapEnabled", 2);
Ve([
  v({ type: Boolean })
], we.prototype, "showRulers", 2);
Ve([
  v({ type: Boolean })
], we.prototype, "showSafeArea", 2);
Ve([
  v({ type: Boolean })
], we.prototype, "showMeasured", 2);
Ve([
  v({ type: Boolean })
], we.prototype, "canUndo", 2);
Ve([
  v({ type: Boolean })
], we.prototype, "canRedo", 2);
Ve([
  v({ type: Boolean })
], we.prototype, "previewing", 2);
we = Ve([
  L("di-canvas-toolbar")
], we);
var lh = Object.defineProperty, ch = Object.getOwnPropertyDescriptor, ml = (e) => {
  throw TypeError(e);
}, Zi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ch(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && lh(t, i, s), s;
}, uo = (e, t, i) => t.has(e) || ml("Cannot " + i), J = (e, t, i) => (uo(e, t, "read from private field"), t.get(e)), pt = (e, t, i) => t.has(e) ? ml("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ct = (e, t, i, a) => (uo(e, t, "write to private field"), t.set(e, i), i), Fe = (e, t, i) => (uo(e, t, "access private method"), i), Ze, Gt, jt, Et, za, Oa, ve, ho, va, po, Ls;
const uh = 400;
let It = class extends F {
  constructor() {
    super(), pt(this, ve), pt(this, Ze), pt(this, Gt), pt(this, jt), pt(this, Et), pt(this, za), pt(this, Oa, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(Lt, (e) => {
      Ct(this, Ze, e), e && (this.observe(e.template, (t) => {
        t && Fe(this, ve, va).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Ct(this, za, t);
        const i = (a = J(this, Ze)) == null ? void 0 : a.getData();
        i && Fe(this, ve, va).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Ct(this, Oa, t ?? !0);
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
    const e = (t = J(this, Ze)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(J(this, Gt)), this._collapsed = !1, Fe(this, ve, po).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(J(this, Gt)), (e = J(this, jt)) == null || e.abort(), Fe(this, ve, ho).call(this);
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
        const t = (e = J(this, Ze)) == null ? void 0 : e.getData();
        t && Fe(this, ve, va).call(this, t);
      }
    }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed ? m : r`
              <div class="body">
                ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : m}
                ${this._error ? r`<span class="error" role="status">${this._error}</span>` : this._url ? r`<img src=${this._url} alt="Server-rendered preview of this template" />` : r`<span class="pending">Rendering…</span>`}
              </div>
            `}
      </div>
    `;
  }
};
Ze = /* @__PURE__ */ new WeakMap();
Gt = /* @__PURE__ */ new WeakMap();
jt = /* @__PURE__ */ new WeakMap();
Et = /* @__PURE__ */ new WeakMap();
za = /* @__PURE__ */ new WeakMap();
Oa = /* @__PURE__ */ new WeakMap();
ve = /* @__PURE__ */ new WeakSet();
ho = function() {
  J(this, Et) && (URL.revokeObjectURL(J(this, Et)), Ct(this, Et, void 0));
};
va = function(e) {
  this._collapsed || (window.clearTimeout(J(this, Gt)), Ct(this, Gt, window.setTimeout(() => void Fe(this, ve, po).call(this, e), uh)));
};
po = async function(e) {
  var t;
  if (J(this, Ze)) {
    (t = J(this, jt)) == null || t.abort(), Ct(this, jt, new AbortController()), Fe(this, ve, Ls).call(this, !0), this._error = void 0;
    try {
      const i = await Ks(
        e,
        {
          signal: J(this, jt).signal,
          contentKey: J(this, za),
          useSampleData: J(this, Oa)
        },
        J(this, Ze).getToken
      );
      Fe(this, ve, ho).call(this), Ct(this, Et, URL.createObjectURL(i)), this._url = J(this, Et);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Fe(this, ve, Ls).call(this, !1);
    }
  }
};
Ls = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
It.styles = A`
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
  p()
], It.prototype, "_url", 2);
Zi([
  p()
], It.prototype, "_loading", 2);
Zi([
  p()
], It.prototype, "_error", 2);
Zi([
  p()
], It.prototype, "_collapsed", 2);
It = Zi([
  L("di-preview-strip")
], It);
var hh = Object.defineProperty, dh = Object.getOwnPropertyDescriptor, fl = (e) => {
  throw TypeError(e);
}, Q = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? dh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && hh(t, i, s), s;
}, mo = (e, t, i) => t.has(e) || fl("Cannot " + i), b = (e, t, i) => (mo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Rt = (e, t, i) => t.has(e) ? fl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ia = (e, t, i, a) => (mo(e, t, "write to private field"), t.set(e, i), i), te = (e, t, i) => (mo(e, t, "access private method"), i), x, Li, Ri, Xt, W, Rs, fo, gl, yl, Ws, vl, bl, _l, Fs, wl, $l, xl, go, kl, ba;
const ph = 400;
let U = class extends F {
  constructor() {
    super(), Rt(this, W), Rt(this, x), Rt(this, Li), Rt(this, Ri), Rt(this, Xt), this._properties = [], this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, Rt(this, ba, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = b(this, x);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = b(this, W, Rs);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), te(this, W, Ws).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, d = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, f = Me(s.position, "x") ? 0 : l, C = Me(s.position, "y") ? 0 : d;
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
    }), this.consumeContext(Wa, (e) => {
      Ia(this, Li, e);
    }), this.consumeContext(Lt, (e) => {
      Ia(this, x, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (te(this, W, vl).call(this, t), te(this, W, bl).call(this, t), te(this, W, _l).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", b(this, ba));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", b(this, ba)), window.clearTimeout(b(this, Ri)), (e = b(this, Xt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = b(this, x)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = b(this, x)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = b(this, x)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => te(this, W, Ws).call(this, e.detail.key)}
        @di-layer-detach=${(e) => te(this, W, yl).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = b(this, x)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = b(this, x)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = b(this, x)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = b(this, x)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = b(this, x)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = b(this, x)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => te(this, W, Fs).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => te(this, W, Fs).call(this, e.detail.payload, e.detail.x, e.detail.y)}
        @di-pick-base-image=${te(this, W, $l)}
        @di-pick-layer-image=${(e) => te(this, W, xl).call(this, e.detail.key)}
        @di-use-image-size=${te(this, W, kl)}
        @di-request-preview=${() => {
      var e;
      return (e = b(this, W, gl)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
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
      return (e = b(this, x)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = b(this, x)) == null ? void 0 : e.redo();
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
            .layer=${b(this, W, Rs)}
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
Xt = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakSet();
Rs = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
fo = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
gl = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
yl = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = b(this, W, fo)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = b(this, x)) == null || n.updateLayer(e, { position: ds(i.position, t, a) });
};
Ws = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = b(this, W, fo)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = b(this, x)) == null || s.removeLayer(e, t);
};
vl = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && b(this, x) && await jn(t, b(this, x).getToken);
};
bl = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !b(this, x)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Hs(t.mediaKey, b(this, x).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
_l = function() {
  window.clearTimeout(b(this, Ri)), Ia(this, Ri, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !b(this, x))) {
      (t = b(this, Xt)) == null || t.abort(), Ia(this, Xt, new AbortController());
      try {
        const i = await Vs(
          e,
          { signal: b(this, Xt).signal, useSampleData: !0 },
          b(this, x).getToken
        );
        b(this, x).setServerBounds(i.layers), b(this, x).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, ph));
};
Fs = function(e, t, i) {
  const a = this._template;
  if (!a || !b(this, x)) return;
  const s = { template: a, x: t, y: i, defaultFontKey: te(this, W, wl).call(this) }, o = e.kind === "property" ? bc(e.property, s) : e.layerType === "image" ? $n(s, "Image") : e.layerType === "badges" ? xn(s, "Badges", "") : e.layerType === "rect" ? yc(s, "Shape", e.shape) : wn(s, "Text", { kind: "static", text: "Text" });
  b(this, x).addLayer(o);
};
wl = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
$l = async function() {
  var t;
  const e = await te(this, W, go).call(this);
  e && ((t = b(this, x)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
xl = async function(e) {
  var i;
  const t = await te(this, W, go).call(this);
  t && ((i = b(this, x)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
go = async function() {
  if (!b(this, Li)) return;
  const e = b(this, Li).open(this, Xo, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
kl = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !b(this, x)) return;
  const t = await Hs(e.mediaKey, b(this, x).getToken).catch(() => {
  });
  t && b(this, x).updateCanvas({ width: t.width, height: t.height });
};
ba = /* @__PURE__ */ new WeakMap();
U.styles = A`
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
  p()
], U.prototype, "_template", 2);
Q([
  p()
], U.prototype, "_selectedKey", 2);
Q([
  p()
], U.prototype, "_properties", 2);
Q([
  p()
], U.prototype, "_fonts", 2);
Q([
  p()
], U.prototype, "_serverBounds", 2);
Q([
  p()
], U.prototype, "_baseImageUrl", 2);
Q([
  p()
], U.prototype, "_zoom", 2);
Q([
  p()
], U.prototype, "_effectiveScale", 2);
Q([
  p()
], U.prototype, "_previewing", 2);
Q([
  p()
], U.prototype, "_snapEnabled", 2);
Q([
  p()
], U.prototype, "_showRulers", 2);
Q([
  p()
], U.prototype, "_showSafeArea", 2);
Q([
  p()
], U.prototype, "_showMeasured", 2);
Q([
  p()
], U.prototype, "_canUndo", 2);
Q([
  p()
], U.prototype, "_canRedo", 2);
U = Q([
  L("di-design-view")
], U);
const mh = U, fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return U;
  },
  default: mh
}, Symbol.toStringTag, { value: "Module" }));
var gh = Object.defineProperty, yh = Object.getOwnPropertyDescriptor, Sl = (e) => {
  throw TypeError(e);
}, dt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && gh(t, i, s), s;
}, yo = (e, t, i) => t.has(e) || Sl("Cannot " + i), K = (e, t, i) => (yo(e, t, "read from private field"), t.get(e)), Wt = (e, t, i) => t.has(e) ? Sl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Yt = (e, t, i, a) => (yo(e, t, "write to private field"), t.set(e, i), i), q = (e, t, i) => (yo(e, t, "access private method"), i), he, Wi, Fi, qt, Dt, H, Tl, Aa, Cl, El, vo, Dl, Ni, Pl, Ml, zl;
let me = class extends F {
  constructor() {
    super(), Wt(this, H), Wt(this, he), Wt(this, Wi), Wt(this, Fi), Wt(this, qt), Wt(this, Dt), this._bounds = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Wa, (e) => {
      Yt(this, Wi, e);
    }), this.consumeContext(ct, (e) => {
      Yt(this, Fi, e);
    }), this.consumeContext(Lt, (e) => {
      Yt(this, he, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && q(this, H, Tl).call(this);
      });
    });
  }
  connectedCallback() {
    super.connectedCallback(), q(this, H, Ni).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = K(this, qt)) == null || e.abort(), q(this, H, vo).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${q(this, H, Dl)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => q(this, H, Ni).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${q(this, H, Ml)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : m}
          ${this._error ? r`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? r`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : m}

          <p class="hint">
            Choose a content item above to preview this template against a real title and image.
          </p>
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._bounds.length === 0 ? r`<p class="empty">Nothing was drawn. Check the layers are visible and have values.</p>` : r`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${B(
      this._bounds,
      (e) => e.key,
      (e) => r`
                    <uui-table-row>
                      <uui-table-cell>${q(this, H, zl).call(this, e.key)}</uui-table-cell>
                      <uui-table-cell>
                        ${e.resolvedText ?? r`<em>—</em>`}
                        ${e.truncated ? r`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : m}
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
                @click=${q(this, H, Pl)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : m}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
he = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
Fi = /* @__PURE__ */ new WeakMap();
qt = /* @__PURE__ */ new WeakMap();
Dt = /* @__PURE__ */ new WeakMap();
H = /* @__PURE__ */ new WeakSet();
Tl = async function() {
  var t;
  const e = q(this, H, Cl).call(this);
  e && (this._sampleNode = e, (t = K(this, he)) == null || t.setSampleContentKey(e.key), await q(this, H, Ni).call(this));
};
Aa = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
Cl = function() {
  try {
    const e = localStorage.getItem(q(this, H, Aa).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
El = function(e) {
  try {
    e ? localStorage.setItem(q(this, H, Aa).call(this), JSON.stringify(e)) : localStorage.removeItem(q(this, H, Aa).call(this));
  } catch {
  }
};
vo = function() {
  K(this, Dt) && (URL.revokeObjectURL(K(this, Dt)), Yt(this, Dt, void 0));
};
Dl = async function() {
  var i, a, s;
  if (!K(this, Wi) || !this._template) return;
  const e = K(this, Wi).open(this, Jc, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, q(this, H, El).call(this, t.item), (s = K(this, he)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await q(this, H, Ni).call(this));
};
Ni = async function() {
  var i, a;
  const e = this._template;
  if (!e || !K(this, he)) return;
  (i = K(this, qt)) == null || i.abort(), Yt(this, qt, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: K(this, qt).signal,
    contentKey: (a = this._sampleNode) == null ? void 0 : a.key,
    useSampleData: !this._sampleNode,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [s, o] = await Promise.all([
      Ks(e, t, K(this, he).getToken),
      Vs(e, t, K(this, he).getToken)
    ]);
    q(this, H, vo).call(this), Yt(this, Dt, URL.createObjectURL(s)), this._url = K(this, Dt), this._bounds = o.layers, K(this, he).setServerBounds(o.layers), K(this, he).setIssues(o.issues);
  } catch (s) {
    if ((s == null ? void 0 : s.name) === "AbortError") return;
    this._error = s instanceof Error ? s.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Pl = async function() {
  var e, t;
  if (!(!this._sampleNode || !K(this, he))) {
    this._regenerating = !0;
    try {
      const i = await Fa(this._sampleNode.key, K(this, he).getToken);
      (e = K(this, Fi)) == null || e.peek(i.outcome === "generated" ? "positive" : "warning", {
        data: { message: `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = K(this, Fi)) == null || t.peek("danger", {
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
Ml = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
zl = function(e) {
  var i;
  const t = (i = this._template) == null ? void 0 : i.layers.find((a) => a.key === e);
  return (t == null ? void 0 : t.name) || (t == null ? void 0 : t.type) || e.slice(0, 8);
};
me.styles = A`
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

    code {
      background: var(--uui-color-surface-alt);
      padding: 0 4px;
      border-radius: 2px;
    }
  `;
dt([
  p()
], me.prototype, "_template", 2);
dt([
  p()
], me.prototype, "_sampleNode", 2);
dt([
  p()
], me.prototype, "_bounds", 2);
dt([
  p()
], me.prototype, "_url", 2);
dt([
  p()
], me.prototype, "_loading", 2);
dt([
  p()
], me.prototype, "_error", 2);
dt([
  p()
], me.prototype, "_regenerating", 2);
me = dt([
  L("di-preview-view")
], me);
const vh = me, bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return me;
  },
  default: vh
}, Symbol.toStringTag, { value: "Module" }));
var _h = Object.defineProperty, wh = Object.getOwnPropertyDescriptor, Ol = (e) => {
  throw TypeError(e);
}, Ja = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && _h(t, i, s), s;
}, bo = (e, t, i) => t.has(e) || Ol("Cannot " + i), N = (e, t, i) => (bo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), os = (e, t, i) => t.has(e) ? Ol("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Uo = (e, t, i, a) => (bo(e, t, "write to private field"), t.set(e, i), i), it = (e, t, i) => (bo(e, t, "access private method"), i), G, At, be, Il, Al, Ll, Rl, Wl, Fl, Nl, Ul, Bl;
let rt = class extends F {
  constructor() {
    super(), os(this, be), os(this, G), os(this, At), this._properties = [], this._showAdvanced = !1, this.consumeContext(Wa, (e) => {
      Uo(this, At, e);
    }), this.consumeContext(Lt, (e) => {
      Uo(this, G, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${it(this, be, Fl).call(this)} ${it(this, be, Nl).call(this)} ${it(this, be, Ul).call(this)} ${it(this, be, Bl).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
G = /* @__PURE__ */ new WeakMap();
At = /* @__PURE__ */ new WeakMap();
be = /* @__PURE__ */ new WeakSet();
Il = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Al = async function() {
  var a, s;
  if (!N(this, At) || !this._template) return;
  const e = N(this, At).open(this, ac, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await it(this, be, Ll).call(this, t.selection.filter((o) => !!o));
  (a = N(this, G)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = N(this, G)) == null ? void 0 : s.reloadProperties());
};
Ll = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => gc), i = await t(N(this, G).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
Rl = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = N(this, G)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = N(this, G)) == null || s.reloadProperties();
};
Wl = async function() {
  var i;
  if (!N(this, At)) return;
  const e = N(this, At).open(this, Xo, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = N(this, G)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
Fl = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${e.docTypeAliases.length === 0 ? r`<p class="empty">No document types yet - nothing will trigger this template.</p>` : r`<div class="tags">
                  ${B(
    e.docTypeAliases,
    (t) => t,
    (t) => r`
                      <uui-tag look="secondary">
                        ${t}
                        <uui-button
                          compact
                          label="Remove ${t}"
                          @click=${() => it(this, be, Rl).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${it(this, be, Al)}>
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
    ...N(this, be, Il).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = N(this, G)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = N(this, G)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Nl = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${it(this, be, Wl)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = N(this, G)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
  }}>
                  Clear
                </uui-button>` : m}
          </div>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = N(this, G)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = N(this, G)) == null ? void 0 : i.updateOutput({
      format: t.target.value
    });
  }}>
          </uui-select>
        </umb-property-layout>

        ${e.output.format === "png" ? m : r`<umb-property-layout label="Quality" description="1-100. Ignored for PNG.">
              <uui-input
                slot="editor"
                type="number"
                min="1"
                max="100"
                .value=${String(e.output.quality)}
                @change=${(t) => {
    var i;
    return (i = N(this, G)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
Ul = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = N(this, G)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = N(this, G)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Bl = function() {
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
    return (i = N(this, G)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
            ${this._showAdvanced ? r`<pre class="json">${JSON.stringify(e, null, 2)}</pre>` : m}
          </div>
        </umb-property-layout>
      </uui-box>
    `;
};
rt.styles = A`
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
Ja([
  p()
], rt.prototype, "_template", 2);
Ja([
  p()
], rt.prototype, "_properties", 2);
Ja([
  p()
], rt.prototype, "_showAdvanced", 2);
rt = Ja([
  L("di-settings-view")
], rt);
const $h = rt, xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return rt;
  },
  default: $h
}, Symbol.toStringTag, { value: "Module" }));
var kh = Object.defineProperty, Sh = Object.getOwnPropertyDescriptor, Kl = (e) => {
  throw TypeError(e);
}, Qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Sh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && kh(t, i, s), s;
}, _o = (e, t, i) => t.has(e) || Kl("Cannot " + i), Bo = (e, t, i) => (_o(e, t, "read from private field"), t.get(e)), Ko = (e, t, i) => t.has(e) ? Kl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Th = (e, t, i, a) => (_o(e, t, "write to private field"), t.set(e, i), i), Vo = (e, t, i) => (_o(e, t, "access private method"), i), Ui, _a, Ns;
let Ue = class extends F {
  constructor() {
    super(), Ko(this, _a), Ko(this, Ui), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Lt, (e) => {
      Th(this, Ui, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Vo(this, _a, Ns).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Vo(this, _a, Ns).call(this)}>Reload</uui-button>
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
              ${B(
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
Ns = async function() {
  const e = this._template;
  if (!(!e || !Bo(this, Ui))) {
    this._loading = !0;
    try {
      this._usage = await gn(e.key, Bo(this, Ui).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Ue.styles = A`
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
  p()
], Ue.prototype, "_template", 2);
Qi([
  p()
], Ue.prototype, "_usage", 2);
Qi([
  p()
], Ue.prototype, "_loading", 2);
Qi([
  p()
], Ue.prototype, "_onlyMissing", 2);
Ue = Qi([
  L("di-usage-view")
], Ue);
const Ch = Ue, Eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Ue;
  },
  default: Ch
}, Symbol.toStringTag, { value: "Module" })), Dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Eo,
  default: Eo
}, Symbol.toStringTag, { value: "Module" })), Ph = 1500;
var ge, St, Ra, Vl;
class ns extends nc {
  constructor(i, a) {
    super(i, a);
    w(this, Ra);
    w(this, ge);
    w(this, St);
    this.consumeContext(ct, (s) => {
      _(this, ge, s);
    }), this.consumeContext(Lt, (s) => {
      _(this, St, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, St), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, ge)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await Us(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await pn(a.key, !1, i.getToken);
        (o = c(this, ge)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await P(this, Ra, Vl).call(this, l, i);
      } catch (l) {
        (n = c(this, ge)) == null || n.peek("danger", {
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
    c(this, St) && await fn(i, c(this, St).getToken);
  }
}
ge = new WeakMap(), St = new WeakMap(), Ra = new WeakSet(), Vl = async function(i, a) {
  var o, n, l, d;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((f) => setTimeout(f, Ph));
    try {
      s = await mn(s.id, a.getToken);
    } catch {
      (o = c(this, ge)) == null || o.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }
  if (s.status === "completed") {
    const f = s.failures.length;
    (n = c(this, ge)) == null || n.peek(f > 0 ? "warning" : "positive", {
      data: {
        headline: "Regeneration finished",
        message: `${s.generated} generated, ${s.skipped} skipped${f > 0 ? `, ${f} failed` : ""}.`
      }
    });
    for (const C of s.failures.slice(0, 3))
      (l = c(this, ge)) == null || l.peek("danger", { data: { message: C } });
  } else
    (d = c(this, ge)) == null || d.peek("danger", {
      data: { headline: `Regeneration ${s.status}`, message: s.failures[0] ?? "" }
    });
};
const Mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: ns,
  api: ns,
  default: ns
}, Symbol.toStringTag, { value: "Module" }));
var Vi, ni;
class rs extends cc {
  constructor(i, a) {
    super(i, a);
    w(this, Vi);
    w(this, ni);
    this.consumeContext(Be, (s) => {
      _(this, Vi, s);
    }), this.consumeContext(ct, (s) => {
      _(this, ni, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Fa(i, () => {
          var n;
          return (n = c(this, Vi)) == null ? void 0 : n.getLatestToken();
        });
        (a = c(this, ni)) == null || a.peek(o.outcome === "generated" ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: o.outcome === "generated" ? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof st && o.status === 404;
        (s = c(this, ni)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof st ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Vi = new WeakMap(), ni = new WeakMap();
const zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: rs,
  api: rs,
  default: rs
}, Symbol.toStringTag, { value: "Module" }));
var Hi, Tt, Gi, ri;
class ls extends uc {
  constructor(i, a) {
    super(i, a);
    w(this, Hi);
    w(this, Tt);
    w(this, Gi);
    w(this, ri);
    this.consumeContext(Be, (s) => {
      _(this, Hi, s);
    }), this.consumeContext(ct, (s) => {
      _(this, Tt, s);
    }), this.consumeContext(hc, (s) => {
      _(this, Gi, s);
    }), this.consumeContext(dc, (s) => {
      _(this, ri, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, ri)) {
      (i = c(this, Tt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Fa(c(this, ri), () => {
        var l;
        return (l = c(this, Hi)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Gi)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, Tt)) == null || s.peek("positive", {
        data: { headline: "Dynamic Images", message: "The image has been regenerated." }
      });
    } catch (n) {
      const l = n instanceof st && n.status === 404;
      (o = c(this, Tt)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof st ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Hi = new WeakMap(), Tt = new WeakMap(), Gi = new WeakMap(), ri = new WeakMap();
const Oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: ls,
  api: ls,
  default: ls
}, Symbol.toStringTag, { value: "Module" }));
var Ih = Object.defineProperty, Ah = Object.getOwnPropertyDescriptor, Hl = (e) => {
  throw TypeError(e);
}, Za = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ah(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ih(t, i, s), s;
}, wo = (e, t, i) => t.has(e) || Hl("Cannot " + i), La = (e, t, i) => (wo(e, t, "read from private field"), t.get(e)), oa = (e, t, i) => t.has(e) ? Hl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gl = (e, t, i, a) => (wo(e, t, "write to private field"), t.set(e, i), i), Nt = (e, t, i) => (wo(e, t, "access private method"), i), wa, Bi, $o, Ye, xo, jl, $a;
let lt = class extends jo {
  constructor() {
    super(), oa(this, Ye), oa(this, wa), oa(this, Bi), this._items = [], this._loading = !0, this._search = "", oa(this, $o, () => {
      var e;
      return (e = La(this, wa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Be, (e) => {
      Gl(this, wa, e), e && Nt(this, Ye, xo).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(La(this, Bi));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${Nt(this, Ye, jl)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Nt(this, Ye, $a).call(this, void 0)}>
          Use sample data
        </uui-button>

        ${this._loading ? r`<uui-loader></uui-loader>` : this._items.length === 0 ? r`<p class="empty">No content of the selected document types was found.</p>` : r`<uui-ref-list>
                ${B(
      this._items,
      (e) => e.key,
      (e) => {
        var t;
        return r`
                    <uui-ref-node
                      name=${e.name}
                      detail=${e.isPublished ? "Published" : "Draft"}
                      ?selected=${e.key === ((t = this.data) == null ? void 0 : t.selectedKey)}
                      @open=${() => Nt(this, Ye, $a).call(this, e)}
                      @click=${() => Nt(this, Ye, $a).call(this, e)}>
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
$o = /* @__PURE__ */ new WeakMap();
Ye = /* @__PURE__ */ new WeakSet();
xo = async function() {
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
        (a) => dn(a, this._search, 0, 30, La(this, $o)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
jl = function(e) {
  this._search = e.target.value, window.clearTimeout(La(this, Bi)), Gl(this, Bi, window.setTimeout(() => void Nt(this, Ye, xo).call(this), 300));
};
$a = function(e) {
  this.value = { item: e }, this._submitModal();
};
lt.styles = A`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
Za([
  p()
], lt.prototype, "_items", 2);
Za([
  p()
], lt.prototype, "_loading", 2);
Za([
  p()
], lt.prototype, "_search", 2);
lt = Za([
  L("di-sample-node-picker-modal")
], lt);
const Lh = lt, Rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return lt;
  },
  default: Lh
}, Symbol.toStringTag, { value: "Module" }));
var Wh = Object.defineProperty, Fh = Object.getOwnPropertyDescriptor, Xl = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wh(t, i, s), s;
}, ko = (e, t, i) => t.has(e) || Xl("Cannot " + i), di = (e, t, i) => (ko(e, t, "read from private field"), i ? i.call(e) : t.get(e)), cs = (e, t, i) => t.has(e) ? Xl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Nh = (e, t, i, a) => (ko(e, t, "write to private field"), t.set(e, i), i), Ut = (e, t, i) => (ko(e, t, "access private method"), i), xa, ea, ke, Yl, ql, So, Jl, Zl, Ql, ec;
const Uh = [100, 200, 300, 400, 500, 600, 700, 800, 900], Bh = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let ce = class extends jo {
  constructor() {
    super(), cs(this, ke), cs(this, xa), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", cs(this, ea, () => {
      var e;
      return (e = di(this, xa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Be, (e) => {
      Nh(this, xa, e);
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
            @change=${Ut(this, ke, Yl)} />
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
            @click=${Ut(this, ke, ql)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Bh.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? Ut(this, ke, ec).call(this) : Ut(this, ke, Ql).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !di(this, ke, So)}
            @click=${Ut(this, ke, Jl)}>
            Add web font
          </uui-button>
        </uui-box>

        ${this._error ? r`<p class="error" role="alert">${this._error}</p>` : m}
        ${this._busy ? r`<uui-loader-bar></uui-loader-bar>` : m}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
xa = /* @__PURE__ */ new WeakMap();
ea = /* @__PURE__ */ new WeakMap();
ke = /* @__PURE__ */ new WeakSet();
Yl = async function(e) {
  const t = e.target.files;
  if (!(!t || t.length === 0)) {
    this._busy = !0, this._error = void 0;
    try {
      for (const i of Array.from(t))
        await sn(i, di(this, ea));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (i) {
      this._error = i instanceof Error ? i.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
ql = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await on(this._path.trim(), di(this, ea)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
So = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
Jl = async function() {
  if (di(this, ke, So)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await nn(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        di(this, ea)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
Zl = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Ql = function() {
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
        ${B(
    Uh,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => Ut(this, ke, Zl).call(this, e, t.target.checked)}>
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
        ${this._provider === "bunny" ? r`<br />Bunny Fonts serve the Latin subset only, so accented Latin renders but other scripts do not.` : m}
      </p>
    `;
};
ec = function() {
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
He([
  p()
], ce.prototype, "_busy", 2);
He([
  p()
], ce.prototype, "_error", 2);
He([
  p()
], ce.prototype, "_path", 2);
He([
  p()
], ce.prototype, "_provider", 2);
He([
  p()
], ce.prototype, "_family", 2);
He([
  p()
], ce.prototype, "_weights", 2);
He([
  p()
], ce.prototype, "_italic", 2);
He([
  p()
], ce.prototype, "_url", 2);
ce = He([
  L("di-font-upload-modal")
], ce);
const Kh = ce, Vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return ce;
  },
  default: Kh
}, Symbol.toStringTag, { value: "Module" }));
export {
  Oc as manifests,
  nd as onInit
};
//# sourceMappingURL=dynamic-images.js.map
