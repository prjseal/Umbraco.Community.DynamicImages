var $o = (e) => {
  throw TypeError(e);
};
var qa = (e, t, i) => t.has(e) || $o("Cannot " + i);
var c = (e, t, i) => (qa(e, t, "read from private field"), i ? i.call(e) : t.get(e)), _ = (e, t, i) => t.has(e) ? $o("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), v = (e, t, i, a) => (qa(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), E = (e, t, i) => (qa(e, t, "access private method"), i);
var Ja = (e, t, i, a) => ({
  set _(s) {
    v(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { nothing as p, html as r, css as O, state as f, customElement as I, repeat as R, property as y, classMap as Uo, styleMap as B } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as W } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Fe } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as rt } from "@umbraco-cms/backoffice/notification";
import { umbOpenModal as Yl, UMB_DISCARD_CHANGES_MODAL as ql, umbConfirmModal as Rs, UmbModalToken as No, UMB_MODAL_MANAGER_CONTEXT as Aa, UmbModalBaseElement as Bo } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as Ko } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as Jl } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as Zl, UmbEntityWorkspaceDataManager as Ql, UmbSubmitWorkspaceAction as xo, UmbWorkspaceActionBase as ec } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as tc } from "@umbraco-cms/backoffice/context-api";
import { UmbArrayState as mi, UmbStringState as ko, UmbBooleanState as ta, UmbNumberState as ic } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as ac } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as sc } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as oc } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as nc } from "@umbraco-cms/backoffice/document";
const si = "dynamic-images", ji = "di-template", xa = "di:templates-changed", rc = "/umbraco/management/api/v1/dynamic-images";
class it extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function S(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${rc}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await lc(n);
  return n;
}
async function lc(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new it(t, e.status, i);
}
const C = async (e) => e.json();
async function Ws(e) {
  const t = await S("/templates?take=500", e);
  return (await C(t)).items;
}
const Vo = async (e, t) => C(await S(`/templates/${e}`, t)), Ho = async (e, t) => C(await S("/templates", t, { method: "POST", json: e })), jo = async (e, t) => C(await S(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Go(e, t) {
  await S(`/templates/${e}`, t, { method: "DELETE" });
}
const Xo = async (e, t) => C(await S(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function Yo(e, t) {
  return (await S(`/templates/${e}/export`, t)).blob();
}
const qo = async (e, t, i) => C(await S("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), Jo = async (e) => C(await S("/templates/import/appsettings", e, { method: "POST" })), Si = async (e) => C(await S("/fonts", e));
async function Zo(e, t) {
  const i = new FormData();
  return i.append("file", e), C(await S("/fonts", t, { method: "POST", body: i }));
}
const Qo = async (e, t) => C(await S("/fonts/register-path", t, { method: "POST", json: { path: e } })), en = async (e, t) => C(await S("/fonts/register-web", t, { method: "POST", json: e })), tn = async (e, t) => C(await S(`/fonts/${e}/refresh`, t, { method: "POST" })), an = async (e, t, i, a) => C(await S(`/fonts/${e}`, a, { method: "PUT", json: { familyName: t, styles: i } }));
async function sn(e, t) {
  await S(`/fonts/${e}`, t, { method: "DELETE" });
}
async function on(e, t) {
  return (await S(`/fonts/${e}/file`, t)).arrayBuffer();
}
const cc = async (e) => C(await S("/document-types", e)), nn = async (e, t) => C(await S(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function rn(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), C(await S(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function Fs(e, t, i) {
  return (await S("/preview", i, {
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
const Us = async (e, t, i) => C(await S("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Ns = async (e, t) => C(await S(`/media/${e}/image-info`, t)), La = async (e, t) => C(await S(`/documents/${e}/regenerate`, t, { method: "POST" })), ln = async (e, t, i) => C(await S(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), cn = async (e, t) => C(await S(`/jobs/${e}`, t));
async function un(e, t) {
  await S(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const hn = async (e, t) => C(await S(`/templates/${e}/usage`, t)), Ra = async (e) => C(await S("/health", e)), dn = async (e) => C(await S("/sync/status", e)), pn = async (e) => C(await S("/sync/export", e, { method: "POST" })), fn = async (e) => C(await S("/sync/import", e, { method: "POST" }));
function oi(e) {
  const t = `section/${si}/workspace/${ji}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Wa() {
  return new URL(`section/${si}/workspace/${ji}/create`, document.baseURI).pathname;
}
function mn(e) {
  return new URL(`section/${si}/dashboard/${e}`, document.baseURI).pathname;
}
function rs() {
  const e = window.location.pathname.split(`/workspace/${ji}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function ci() {
  window.dispatchEvent(new CustomEvent(xa));
}
const uc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: it,
  SECTION_PATHNAME: si,
  TEMPLATES_CHANGED_EVENT: xa,
  TEMPLATE_ENTITY_TYPE: ji,
  cancelJob: un,
  createTemplate: Ho,
  deleteFont: sn,
  deleteTemplate: Go,
  duplicateTemplate: Xo,
  exportTemplate: Yo,
  fetchDocumentTypes: cc,
  fetchFontFile: on,
  fetchFonts: Si,
  fetchHealth: Ra,
  fetchImageInfo: Ns,
  fetchJob: cn,
  fetchLayout: Us,
  fetchPreview: Fs,
  fetchProperties: nn,
  fetchSampleContent: rn,
  fetchSyncStatus: dn,
  fetchTemplate: Vo,
  fetchTemplates: Ws,
  fetchUsage: hn,
  hrefForCreate: Wa,
  hrefForDashboard: mn,
  hrefForTemplate: oi,
  importFromAppSettings: Jo,
  importTemplate: qo,
  notifyTemplatesChanged: ci,
  refreshFont: tn,
  regenerateDocument: La,
  regenerateTemplate: ln,
  registerFontPath: Qo,
  registerWebFont: en,
  runSyncExport: pn,
  runSyncImport: fn,
  templateKeyFromLocation: rs,
  updateFont: an,
  updateTemplate: jo,
  uploadFont: Zo
}, Symbol.toStringTag, { value: "Module" })), Fa = () => crypto.randomUUID();
function Ua(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function gn(e, t, i) {
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
function yn(e, t, i) {
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
function vn(e, t, i) {
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
function hc(e, t = "Shape", i = "rectangle") {
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
function dc(e) {
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
function pc(e, t) {
  switch (dc(e.classification)) {
    case "image":
      return yn(t, e.name, e.alias);
    case "badges":
      return vn(t, e.name, e.alias);
    default:
      return gn(t, e.name, fc(e));
  }
}
function fc(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function mc(e) {
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
const bn = [
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
function Ti(e) {
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
function Ci(e) {
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
function ls(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return bn[a * 3 + i];
}
function Na(e, t, i) {
  return {
    x: e.x - t * Ti(e.anchor),
    y: e.y - i * Ci(e.anchor)
  };
}
function Bs(e, t, i, a, s) {
  return {
    x: e + i * Ti(s),
    y: t + a * Ci(s)
  };
}
function gc(e, t, i, a) {
  const s = Na(e, t, i), o = Bs(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function yc(e, t) {
  const i = Bs(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function _n(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Wt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), d = e - i, m = t - a;
  return { x: i + d * n - m * l, y: a + d * l + m * n };
}
function vc(e, t, i, a, s) {
  return Wt(e, t, i, a, -s);
}
function wn(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Wt(e.x, e.y, t, i, a),
    Wt(e.x + e.width, e.y, t, i, a),
    Wt(e.x + e.width, e.y + e.height, t, i, a),
    Wt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((m) => m.x)), n = Math.max(...s.map((m) => m.x)), l = Math.min(...s.map((m) => m.y)), d = Math.max(...s.map((m) => m.y));
  return { x: o, y: l, width: n - o, height: d - l };
}
const bc = 10;
function De(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function $n(e) {
  return !!e.relativeX || !!e.relativeY;
}
function ka(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function So(e) {
  return e === "below" || e === "above";
}
function To(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function _c(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function wc(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = To(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...To(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function $c(e, t, i) {
  const a = e.position;
  if (!$n(a)) return a;
  if (wc(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Ti(a.anchor), l = Ci(a.anchor);
  const d = Co(e, a.relativeX, !1, t, i);
  d && (s = d.coordinate, n = d.factor);
  const m = Co(e, a.relativeY, !0, t, i);
  return m && (o = m.coordinate, l = m.factor), { x: s, y: o, anchor: ls(n, l) };
}
function Co(e, t, i, a, s) {
  if (!t || So(t.edge) !== i) return;
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
    if (!m || So(m.edge) !== i) return;
    n = m.layerKey;
  }
}
function xc(e, t, i) {
  const a = _c(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const d = s.get(l.key);
    if (d) return d;
    let m;
    o.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), m = $c(l, a, (Ke) => {
      const Oe = a.get(Ke);
      return Oe && !i(Oe) ? n(Oe).extent : void 0;
    }), o.delete(l.key));
    const T = t(l), X = Na(m, T.width, T.height), _e = { x: X.x, y: X.y, width: T.width, height: T.height }, ze = { position: m, box: _e, extent: wn(_e, m.x, m.y, l.rotation ?? 0) };
    return s.set(l.key, ze), ze;
  };
  for (const l of e) n(l);
  return s;
}
function cs(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? ls(Ti(i.anchor), Ci(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? ls(Ti(e.anchor), Ci(i.anchor)) : e.anchor
  };
}
var se, Ae, xe, qe;
class kc {
  constructor(t = 100) {
    _(this, se, []);
    _(this, Ae, []);
    _(this, xe, 0);
    _(this, qe);
    this.limit = t;
  }
  get canUndo() {
    return c(this, se).length > 0;
  }
  get canRedo() {
    return c(this, Ae).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, xe) > 0 || (c(this, se).push(structuredClone(t)), c(this, se).length > this.limit && c(this, se).shift(), v(this, Ae, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, xe) === 0 && v(this, qe, structuredClone(t)), Ja(this, xe)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, xe) !== 0 && (Ja(this, xe)._--, !(c(this, xe) > 0) && (t && c(this, qe) !== void 0 && (c(this, se).push(c(this, qe)), c(this, se).length > this.limit && c(this, se).shift(), v(this, Ae, [])), v(this, qe, void 0)));
  }
  undo(t) {
    const i = c(this, se).pop();
    if (i !== void 0)
      return c(this, Ae).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Ae).pop();
    if (i !== void 0)
      return c(this, se).push(structuredClone(t)), i;
  }
  clear() {
    v(this, se, []), v(this, Ae, []), v(this, xe, 0), v(this, qe, void 0);
  }
}
se = new WeakMap(), Ae = new WeakMap(), xe = new WeakMap(), qe = new WeakMap();
const Sc = "DynamicImages.Workspace.Template";
var Gt, Je, yt, vt, Xt, Yt, qt, bt, Jt, Le, Zt, Qt, oe, Bi, _t, ke, wt, x, xn, ei, ti, us, hs, Ie, ht, ds, ps;
class Tc extends Zl {
  constructor(i) {
    super(i, Sc);
    _(this, x);
    _(this, Gt);
    _(this, Je);
    _(this, yt);
    _(this, vt);
    _(this, Xt);
    _(this, Yt);
    _(this, qt);
    _(this, bt);
    _(this, Jt);
    _(this, Le);
    _(this, Zt);
    _(this, Qt);
    _(this, oe);
    _(this, Bi);
    _(this, _t);
    _(this, ke);
    _(this, wt);
    _(this, ei);
    _(this, ti);
    this._data = new Ql(this), this.template = this._data.current, v(this, Gt, new mi([], (a) => a.key)), this.layers = c(this, Gt).asObservable(), v(this, Je, new ko(void 0)), this.selectedLayerKey = c(this, Je).asObservable(), v(this, yt, new mi([], (a) => a.alias)), this.properties = c(this, yt).asObservable(), v(this, vt, new mi([], (a) => a.key)), this.fonts = c(this, vt).asObservable(), v(this, Xt, new mi([], (a) => a.key)), this.serverBounds = c(this, Xt).asObservable(), v(this, Yt, new mi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, Yt).asObservable(), v(this, qt, new ko(void 0)), this.sampleContentKey = c(this, qt).asObservable(), v(this, bt, new ta(!0)), this.useSampleData = c(this, bt).asObservable(), v(this, Jt, new ic(1)), this.zoom = c(this, Jt).asObservable(), v(this, Le, new ta(!0)), this.loading = c(this, Le).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), v(this, Zt, new ta(!1)), this.canUndo = c(this, Zt).asObservable(), v(this, Qt, new ta(!1)), this.canRedo = c(this, Qt).asObservable(), v(this, oe, new kc()), v(this, ke, !1), v(this, wt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), v(this, ei, async (a) => {
      const s = a.detail;
      if (c(this, wt) || !(s != null && s.url) || !E(this, x, xn).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await Yl(this, ql), v(this, wt, !0), window.history.pushState({}, "", s.url), !0;
      } catch {
        return !1;
      }
    }), v(this, ti, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, Bi)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        path: "create",
        component: () => Promise.resolve().then(() => Do),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Do),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Fe, (a) => {
      v(this, Bi, a);
    }), this.consumeContext(rt, (a) => {
      v(this, _t, a);
    }), window.addEventListener("willchangestate", c(this, ei)), window.addEventListener("beforeunload", c(this, ti));
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, ke);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Le).setValue(!0), v(this, ke, !1);
    try {
      const a = await Vo(i, this.getToken);
      E(this, x, ht).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await E(this, x, us).call(this, a);
    } catch (a) {
      E(this, x, ps).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Le).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    c(this, Le).setValue(!0), v(this, ke, !0), E(this, x, ht).call(this, mc(i), { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await E(this, x, us).call(this, this._data.getCurrent()), c(this, Le).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    i && c(this, yt).setValue(await E(this, x, hs).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    c(this, vt).setValue(await Si(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    E(this, x, Ie).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    E(this, x, Ie).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    E(this, x, Ie).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    E(this, x, Ie).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    E(this, x, Ie).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    E(this, x, Ie).call(this, (s) => ({
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
    E(this, x, Ie).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, d;
        let n = o.position;
        return ((l = ka(n, "x")) == null ? void 0 : l.layerKey) === i && (n = cs(n, "x", a == null ? void 0 : a.get(o.key))), ((d = ka(n, "y")) == null ? void 0 : d.layerKey) === i && (n = cs(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), c(this, Je).getValue() === i && this.selectLayer(void 0);
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
    E(this, x, Ie).call(this, (s) => {
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
    c(this, Je).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, Je).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, oe).begin(i);
  }
  endTransaction(i = !0) {
    c(this, oe).end(i), E(this, x, ds).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, oe).undo(i);
    a && E(this, x, ht).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, oe).redo(i);
    a && E(this, x, ht).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Xt).setValue(i);
  }
  setIssues(i) {
    c(this, Yt).setValue(i);
  }
  setSampleContentKey(i) {
    c(this, qt).setValue(i), c(this, bt).setValue(!i);
  }
  setUseSampleData(i) {
    c(this, bt).setValue(i);
  }
  setZoom(i) {
    c(this, Jt).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = c(this, ke) ? await Ho(i, this.getToken) : await jo(i, this.getToken);
      E(this, x, ht).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, ke);
      v(this, ke, !1), this.setIsNew(!1), ci(), (a = c(this, _t)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, _t)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", oi(o.template.key));
    } catch (o) {
      throw E(this, x, ps).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), v(this, wt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, ei)), window.removeEventListener("beforeunload", c(this, ti)), c(this, oe).clear(), super.destroy();
  }
}
Gt = new WeakMap(), Je = new WeakMap(), yt = new WeakMap(), vt = new WeakMap(), Xt = new WeakMap(), Yt = new WeakMap(), qt = new WeakMap(), bt = new WeakMap(), Jt = new WeakMap(), Le = new WeakMap(), Zt = new WeakMap(), Qt = new WeakMap(), oe = new WeakMap(), Bi = new WeakMap(), _t = new WeakMap(), ke = new WeakMap(), wt = new WeakMap(), x = new WeakSet(), /**
 * True when the new URL leaves this workspace. Switching between the four workspace views keeps
 * the workspace's own path as a prefix (`…/edit/<key>/view/<pathname>`), so this is false for
 * those and the editor is never prompted for moving between Design and Preview & test.
 *
 * Core has the same one-liner as a protected method on `UmbEntityDetailWorkspaceContextBase`.
 * There is no exported helper for it, so it is inlined rather than reached for.
 */
xn = function(i) {
  return !i.includes(this.routes.getActiveLocalPath());
}, ei = new WeakMap(), ti = new WeakMap(), us = async function(i) {
  const [a, s] = await Promise.all([
    Si(this.getToken).catch(() => []),
    E(this, x, hs).call(this, i.docTypeAliases)
  ]);
  c(this, vt).setValue(a), c(this, yt).setValue(s);
}, hs = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => nn(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Ie = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && c(this, oe).push(s);
  const o = i(structuredClone(s));
  E(this, x, ht).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
ht = function(i, a) {
  a != null && a.resetHistory && c(this, oe).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Gt).setValue(i.layers), E(this, x, ds).call(this);
}, ds = function() {
  c(this, Zt).setValue(c(this, oe).canUndo), c(this, Qt).setValue(c(this, oe).canRedo);
}, ps = function(i, a) {
  var o;
  const s = a instanceof it ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, _t)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const zt = new tc(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Cc = [
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
    element: () => Promise.resolve().then(() => Fc),
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
      href: `section/${si}/dashboard/fonts`
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
      href: `section/${si}/dashboard/health`
    }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => Kc),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Zc),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => iu),
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
    api: Tc,
    meta: { entityType: ji }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => lh),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => ph),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => yh),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => $h),
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
    api: () => Promise.resolve().then(() => xh),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Sh),
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
    api: () => Promise.resolve().then(() => Th),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Ch),
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
    element: () => Promise.resolve().then(() => Mh)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => Wh)
  }
], ed = (e, t) => {
  t.registerMany(Cc);
};
var Ec = Object.defineProperty, Dc = Object.getOwnPropertyDescriptor, kn = (e) => {
  throw TypeError(e);
}, Ks = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ec(t, i, s), s;
}, Vs = (e, t, i) => t.has(e) || kn("Cannot " + i), Pc = (e, t, i) => (Vs(e, t, "read from private field"), t.get(e)), Eo = (e, t, i) => t.has(e) ? kn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mc = (e, t, i, a) => (Vs(e, t, "write to private field"), t.set(e, i), i), zc = (e, t, i) => (Vs(e, t, "access private method"), i), Sa, fs, Sn;
let Tt = class extends W {
  constructor() {
    super(), Eo(this, fs), Eo(this, Sa), this._name = "", this._loading = !0, this.consumeContext(zt, (e) => {
      Mc(this, Sa, e), e && (this.observe(e.template, (t) => {
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
            @input=${zc(this, fs, Sn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Sa = /* @__PURE__ */ new WeakMap();
fs = /* @__PURE__ */ new WeakSet();
Sn = function(e) {
  var i;
  const t = e.target.value;
  (i = Pc(this, Sa)) == null || i.updateTemplateFields({ name: t });
};
Tt.styles = O`
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
Ks([
  f()
], Tt.prototype, "_name", 2);
Ks([
  f()
], Tt.prototype, "_loading", 2);
Tt = Ks([
  I("di-template-editor")
], Tt);
const Oc = Tt, Do = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Tt;
  },
  default: Oc
}, Symbol.toStringTag, { value: "Module" }));
var Ic = Object.defineProperty, Ac = Object.getOwnPropertyDescriptor, Tn = (e) => {
  throw TypeError(e);
}, ui = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ac(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ic(t, i, s), s;
}, Hs = (e, t, i) => t.has(e) || Tn("Cannot " + i), ft = (e, t, i) => (Hs(e, t, "read from private field"), t.get(e)), gi = (e, t, i) => t.has(e) ? Tn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Lc = (e, t, i, a) => (Hs(e, t, "write to private field"), t.set(e, i), i), oa = (e, t, i) => (Hs(e, t, "access private method"), i), na, Ta, ra, la, Ft, ms, Cn, En;
let Pe = class extends W {
  constructor() {
    super(), gi(this, Ft), gi(this, na), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = rs(), this._expanded = !0, gi(this, Ta, () => {
      var e;
      return (e = ft(this, na)) == null ? void 0 : e.getLatestToken();
    }), gi(this, ra, () => {
      this._activeKey = rs();
    }), gi(this, la, () => {
      oa(this, Ft, ms).call(this);
    }), this.consumeContext(Fe, (e) => {
      Lc(this, na, e), e && oa(this, Ft, ms).call(this);
    }), window.addEventListener("changestate", ft(this, ra)), window.addEventListener(xa, ft(this, la));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("changestate", ft(this, ra)), window.removeEventListener(xa, ft(this, la));
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
        ${oa(this, Ft, Cn).call(this)}
      </uui-menu-item>
    `;
  }
};
na = /* @__PURE__ */ new WeakMap();
Ta = /* @__PURE__ */ new WeakMap();
ra = /* @__PURE__ */ new WeakMap();
la = /* @__PURE__ */ new WeakMap();
Ft = /* @__PURE__ */ new WeakSet();
ms = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Ws(ft(this, Ta)),
      Ra(ft(this, Ta)).catch(() => {
      })
    ]);
    this._templates = e, this._issuesByTemplate = Rc((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
Cn = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${R(
    this._templates,
    (e) => e.key,
    (e) => oa(this, Ft, En).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${Wa()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
En = function(e) {
  const t = this._issuesByTemplate.get(e.key) ?? 0;
  return r`
      <uui-menu-item
        label=${e.name}
        href=${oi(e.key)}
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
Pe.styles = O`
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
ui([
  f()
], Pe.prototype, "_templates", 2);
ui([
  f()
], Pe.prototype, "_issuesByTemplate", 2);
ui([
  f()
], Pe.prototype, "_loading", 2);
ui([
  f()
], Pe.prototype, "_activeKey", 2);
ui([
  f()
], Pe.prototype, "_expanded", 2);
Pe = ui([
  I("di-templates-menu-item")
], Pe);
function Rc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const Wc = Pe, Fc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return Pe;
  },
  default: Wc
}, Symbol.toStringTag, { value: "Module" }));
var Uc = Object.defineProperty, Nc = Object.getOwnPropertyDescriptor, Dn = (e) => {
  throw TypeError(e);
}, lt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Nc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Uc(t, i, s), s;
}, js = (e, t, i) => t.has(e) || Dn("Cannot " + i), Te = (e, t, i) => (js(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ia = (e, t, i) => t.has(e) ? Dn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Po = (e, t, i, a) => (js(e, t, "write to private field"), t.set(e, i), i), k = (e, t, i) => (js(e, t, "access private method"), i), ca, Ca, Ce, w, hi, ue, Pn, Mn, zn, On, In, An, Ln, bi, Rn, Wn, Fn, Un, Nn;
let he = class extends W {
  constructor() {
    super(), ia(this, w), ia(this, ca), ia(this, Ca), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, ia(this, Ce, () => {
      var e;
      return (e = Te(this, ca)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(rt, (e) => {
      Po(this, Ca, e);
    }), this.consumeContext(Fe, (e) => {
      Po(this, ca, e), e && k(this, w, hi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${k(this, w, An).call(this)} ${k(this, w, Ln).call(this)} ${k(this, w, Rn).call(this)} ${k(this, w, Wn).call(this)}
      </umb-body-layout>
    `;
  }
};
ca = /* @__PURE__ */ new WeakMap();
Ca = /* @__PURE__ */ new WeakMap();
Ce = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakSet();
hi = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Ws(Te(this, Ce)),
      Si(Te(this, Ce)).catch(() => []),
      Ra(Te(this, Ce)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    k(this, w, ue).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
ue = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Te(this, Ca)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Pn = async function() {
  this._importing = !0;
  try {
    const e = await Jo(Te(this, Ce));
    k(this, w, ue).call(this, e.created.length > 0 ? "positive" : "warning", e.created.length > 0 ? `Imported ${e.created.length} template(s)` : "Nothing was imported");
    for (const t of e.warnings.slice(0, 5)) k(this, w, ue).call(this, "warning", t);
    ci(), await k(this, w, hi).call(this);
  } catch (e) {
    k(this, w, ue).call(this, "danger", "The import failed", e);
  } finally {
    this._importing = !1;
  }
};
Mn = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await qo(this._pasteJson, "create", Te(this, Ce)), k(this, w, ue).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, ci(), await k(this, w, hi).call(this);
    } catch (e) {
      k(this, w, ue).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
zn = async function(e) {
  try {
    await Xo(e.key, Te(this, Ce)), k(this, w, ue).call(this, "positive", `'${e.name}' duplicated`), ci(), await k(this, w, hi).call(this);
  } catch (t) {
    k(this, w, ue).call(this, "danger", "The template could not be duplicated", t);
  }
};
On = async function(e) {
  await Rs(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Go(e.key, Te(this, Ce)), k(this, w, ue).call(this, "positive", `'${e.name}' deleted`), ci(), await k(this, w, hi).call(this);
  } catch (t) {
    k(this, w, ue).call(this, "danger", "The template could not be deleted", t);
  }
};
In = async function(e) {
  try {
    const t = await Yo(e.key, Te(this, Ce)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    k(this, w, ue).call(this, "danger", "The template could not be exported", t);
  }
};
An = function() {
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
            @click=${k(this, w, Pn)}>
            Import from appsettings
          </uui-button>
        </div>
      </uui-box>
    `;
};
Ln = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${k(this, w, bi).call(this, "Templates", this._templates.length, "icon-brush")}
        ${k(this, w, bi).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${k(this, w, bi).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${k(this, w, bi).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
bi = function(e, t, i, a = !1) {
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        <uui-icon name=${i}></uui-icon>
        <div class="stat-value">${t}</div>
        <div class="stat-label">${e}</div>
      </uui-box>
    `;
};
Rn = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${R(
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
        <uui-button look="secondary" href=${mn("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Wn = function() {
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
          <uui-button look="primary" color="positive" href=${Wa()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? k(this, w, Fn).call(this) : p}
        ${this._templates.length === 0 ? k(this, w, Un).call(this) : k(this, w, Nn).call(this)}
      </uui-box>
    `;
};
Fn = function() {
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
          @click=${k(this, w, Mn)}>
          Import
        </uui-button>
      </div>
    `;
};
Un = function() {
  return r`
      <div class="empty">
        <uui-icon name="icon-brush"></uui-icon>
        <h4>No templates yet</h4>
        <p>A template says which document types get a generated image, and what it looks like.</p>
        <uui-button look="primary" color="positive" href=${Wa()} label="Create your first template">
          Create your first template
        </uui-button>
      </div>
    `;
};
Nn = function() {
  return r`
      <div class="cards">
        ${R(
    this._templates,
    (e) => e.key,
    (e) => r`
            <uui-box class="card ${e.isEnabled ? "" : "disabled"}">
              <div slot="headline">
                <a href=${oi(e.key)}>${e.name}</a>
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
                <uui-button look="secondary" href=${oi(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => k(this, w, zn).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => k(this, w, In).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => k(this, w, On).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
he.styles = O`
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
lt([
  f()
], he.prototype, "_templates", 2);
lt([
  f()
], he.prototype, "_fonts", 2);
lt([
  f()
], he.prototype, "_health", 2);
lt([
  f()
], he.prototype, "_loading", 2);
lt([
  f()
], he.prototype, "_importing", 2);
lt([
  f()
], he.prototype, "_pasteJson", 2);
lt([
  f()
], he.prototype, "_showPaste", 2);
he = lt([
  I("di-overview-dashboard")
], he);
const Bc = he, Kc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return he;
  },
  default: Bc
}, Symbol.toStringTag, { value: "Module" })), gs = /* @__PURE__ */ new Map(), Ba = (e) => `di-${e}`;
function Vc(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = gs.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await on(e, t), o = new FontFace(Ba(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return gs.set(e, a), a;
}
async function Bn(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => Vc(a, t)));
}
function Kn(e) {
  gs.delete(e);
}
const Hc = new No(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), jc = new No(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var Gc = Object.defineProperty, Xc = Object.getOwnPropertyDescriptor, Vn = (e) => {
  throw TypeError(e);
}, Ka = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Xc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gc(t, i, s), s;
}, Gs = (e, t, i) => t.has(e) || Vn("Cannot " + i), Ee = (e, t, i) => (Gs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), yi = (e, t, i) => t.has(e) ? Vn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Za = (e, t, i, a) => (Gs(e, t, "write to private field"), t.set(e, i), i), L = (e, t, i) => (Gs(e, t, "access private method"), i), ua, Ei, Di, Ct, M, di, at, ys, Hn, jn, ha, Gn, Xn, Yn;
function Yc(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : qc(e.sourceUrl);
    default:
      return "Media library";
  }
}
function qc(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let st = class extends W {
  constructor() {
    super(), yi(this, M), yi(this, ua), yi(this, Ei), yi(this, Di), this._fonts = [], this._loading = !0, yi(this, Ct, () => {
      var e;
      return (e = Ee(this, ua)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Aa, (e) => {
      Za(this, Ei, e);
    }), this.consumeContext(rt, (e) => {
      Za(this, Di, e);
    }), this.consumeContext(Fe, (e) => {
      Za(this, ua, e), e && L(this, M, di).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${L(this, M, ys)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf or .woff2, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${L(this, M, ys)}>
                  Add your first font
                </uui-button>
              </div>` : r`${R(this._fonts, (e) => e.key, (e) => L(this, M, Gn).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
ua = /* @__PURE__ */ new WeakMap();
Ei = /* @__PURE__ */ new WeakMap();
Di = /* @__PURE__ */ new WeakMap();
Ct = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
di = async function() {
  this._loading = !0;
  try {
    this._fonts = await Si(Ee(this, Ct)), await Bn(this._fonts.map((e) => e.key), Ee(this, Ct));
  } catch (e) {
    L(this, M, at).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
at = function(e, t, i) {
  var s;
  const a = i instanceof it ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ee(this, Di)) == null || s.peek(e, { data: { headline: t, message: a } });
};
ys = async function() {
  var i, a;
  if (!Ee(this, Ei)) return;
  const e = Ee(this, Ei).open(this, jc, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Ee(this, Di)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await L(this, M, di).call(this));
};
Hn = async function(e) {
  try {
    await tn(e.key, Ee(this, Ct)), Kn(e.key), L(this, M, at).call(this, "positive", `'${e.familyName}' refreshed`), await L(this, M, di).call(this);
  } catch (t) {
    L(this, M, at).call(this, "danger", "That font could not be refreshed", t);
  }
};
jn = async function(e) {
  await Rs(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await sn(e.key, Ee(this, Ct)), Kn(e.key), L(this, M, at).call(this, "positive", `'${e.familyName}' deleted`), await L(this, M, di).call(this);
  } catch (t) {
    L(this, M, at).call(this, "danger", "That font could not be deleted", t);
  }
};
ha = async function(e, t, i) {
  try {
    await an(e.key, t, i, Ee(this, Ct)), this._editingKey = void 0, L(this, M, at).call(this, "positive", `'${t}' saved`), await L(this, M, di).call(this);
  } catch (a) {
    L(this, M, at).call(this, "danger", "The font could not be saved", a);
  }
};
Gn = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${Yc(e)} · weight ${e.weight}
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
                  @click=${() => L(this, M, Hn).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => L(this, M, jn).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Ba(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? L(this, M, Yn).call(this, e) : L(this, M, Xn).call(this, e)}
      </div>
    `;
};
Xn = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${R(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
Yn = function(e) {
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
          ${R(
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
      t.splice(a, 1), L(this, M, ha).call(this, e, e.familyName, t);
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), L(this, M, ha).call(this, e, e.familyName, t);
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`);
    L(this, M, ha).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t);
  }}>
            Save
          </uui-button>
        </div>
      </div>
    `;
};
st.styles = O`
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
Ka([
  f()
], st.prototype, "_fonts", 2);
Ka([
  f()
], st.prototype, "_loading", 2);
Ka([
  f()
], st.prototype, "_editingKey", 2);
st = Ka([
  I("di-fonts-dashboard")
], st);
const Jc = st, Zc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return st;
  },
  default: Jc
}, Symbol.toStringTag, { value: "Module" }));
var Qc = Object.defineProperty, eu = Object.getOwnPropertyDescriptor, qn = (e) => {
  throw TypeError(e);
}, Gi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? eu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Qc(t, i, s), s;
}, Xs = (e, t, i) => t.has(e) || qn("Cannot " + i), Ge = (e, t, i) => (Xs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), aa = (e, t, i) => t.has(e) ? qn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mo = (e, t, i, a) => (Xs(e, t, "write to private field"), t.set(e, i), i), Nt = (e, t, i) => (Xs(e, t, "access private method"), i), da, Bt, ni, Ze, Ea, vs, Jn;
let Re = class extends W {
  constructor() {
    super(), aa(this, Ze), aa(this, da), aa(this, Bt), this._loading = !0, this._busy = !1, aa(this, ni, () => {
      var e;
      return (e = Ge(this, da)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(rt, (e) => {
      Mo(this, Bt, e);
    }), this.consumeContext(Fe, (e) => {
      Mo(this, da, e), e && Nt(this, Ze, Ea).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Nt(this, Ze, Ea).call(this)}>Re-check</uui-button>
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
                ${R(
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
                        ${a.templateKey ? r`<a href=${oi(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Nt(this, Ze, Jn).call(this)}
      </umb-body-layout>
    `;
  }
};
da = /* @__PURE__ */ new WeakMap();
Bt = /* @__PURE__ */ new WeakMap();
ni = /* @__PURE__ */ new WeakMap();
Ze = /* @__PURE__ */ new WeakSet();
Ea = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Ra(Ge(this, ni)),
      dn(Ge(this, ni)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
vs = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await pn(Ge(this, ni)) : await fn(Ge(this, ni));
    (t = Ge(this, Bt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Ge(this, Bt)) == null || i.peek("warning", { data: { message: o } });
    await Nt(this, Ze, Ea).call(this);
  } catch (s) {
    (a = Ge(this, Bt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Jn = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Nt(this, Ze, vs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Nt(this, Ze, vs).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
Re.styles = O`
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
Gi([
  f()
], Re.prototype, "_health", 2);
Gi([
  f()
], Re.prototype, "_sync", 2);
Gi([
  f()
], Re.prototype, "_loading", 2);
Gi([
  f()
], Re.prototype, "_busy", 2);
Re = Gi([
  I("di-health-dashboard")
], Re);
const tu = Re, iu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Re;
  },
  default: tu
}, Symbol.toStringTag, { value: "Module" }));
function au(e, t) {
  const i = [], a = t.lockX ? void 0 : zo(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    su(t),
    t.threshold
  ), s = t.lockY ? void 0 : zo(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    ou(t),
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
function su(e) {
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
function ou(e) {
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
function zo(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
const Zn = 3, Qn = 12, er = 0.1, tr = 0.9;
function nu(e) {
  return Math.max(Zn, Math.min(Qn, e));
}
function ru(e) {
  return Math.max(er, Math.min(tr, e));
}
function lu(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = nu(t), s = 0.5 * ru(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let d = 0; d < o; d++) {
    const m = (-90 + d * n) * Math.PI / 180, T = e === "star" && d % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + T * Math.cos(m), y: 0.5 + T * Math.sin(m) });
  }
  return l;
}
function cu(e, t, i) {
  const a = lu(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
var uu = Object.defineProperty, hu = Object.getOwnPropertyDescriptor, ir = (e) => {
  throw TypeError(e);
}, Ue = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && uu(t, i, s), s;
}, Ys = (e, t, i) => t.has(e) || ir("Cannot " + i), me = (e, t, i) => (Ys(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Qa = (e, t, i) => t.has(e) ? ir("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), es = (e, t, i, a) => (Ys(e, t, "write to private field"), t.set(e, i), i), G = (e, t, i) => (Ys(e, t, "access private method"), i), dt, _i, D, Va, qs, ar, sr, or, nr, Js, Da, rr, lr, cr, ur, hr, dr, pr, fr, mr;
const du = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], ts = 18;
let ve = class extends W {
  constructor() {
    super(...arguments), Qa(this, D), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, Qa(this, dt), Qa(this, _i);
  }
  willUpdate() {
    this._box = G(this, D, ar).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== me(this, _i) && ((t = me(this, dt)) == null || t.disconnect(), es(this, _i, e), e && (me(this, dt) ?? es(this, dt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), me(this, dt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = me(this, dt)) == null || e.disconnect(), es(this, _i, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${Uo({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${B({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...me(this, D, sr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...G(this, D, Js).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      G(this, D, rr).call(this, t), G(this, D, Da).call(this, t);
    }}>
        ${G(this, D, lr).call(this)}
      </div>

      ${this.selected ? G(this, D, fr).call(this, e) : p}
      ${this.showMeasured && this.measured ? G(this, D, mr).call(this) : p}
    `;
  }
};
dt = /* @__PURE__ */ new WeakMap();
_i = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakSet();
Va = function() {
  return this.resolvedPosition ?? this.layer.position;
};
qs = function() {
  return this.layer.rotation ?? 0;
};
ar = function() {
  var s;
  const e = this.layer, t = e.size.width ?? G(this, D, or).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? G(this, D, nr).call(this), a = Na(me(this, D, Va), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
sr = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
or = function() {
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
nr = function() {
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
Js = function(e) {
  const t = me(this, D, qs);
  if (t === 0) return {};
  const i = me(this, D, Va);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Da = function(e, t) {
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
rr = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
lr = function() {
  switch (this.layer.type) {
    case "text":
      return G(this, D, cr).call(this);
    case "image":
      return G(this, D, hr).call(this);
    case "badges":
      return G(this, D, dr).call(this);
    default:
      return G(this, D, pr).call(this);
  }
};
cr = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || G(this, D, ur).call(this);
  return r`
      <div
        class="text"
        style=${B({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Ba(e.fontKey)}, sans-serif`,
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
ur = function() {
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
hr = function() {
  if (this.layer.type !== "image") return p;
  const e = this.layer.border;
  return r`
      <div
        class="image"
        style=${B({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
dr = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", d = l && o, m = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${B({
    flexDirection: l ? "row" : "column",
    flexWrap: d ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...d ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${R(
    Array.from({ length: Math.max(1, a) }, (T, X) => X),
    (T) => T,
    () => r`
            <div class=${Uo({ badge: !0, right: m === "right" })}>
              <div
                class="circle"
                style=${B({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${m === "none" ? p : r`<div
                    class="badge-label"
                    style=${B({
      ...m === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${Ba(t.fontKey)}, sans-serif`,
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
pr = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? `linear-gradient(${i.angle}deg, ${i.from}, ${i.to})` : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${B({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${o}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const n = cu(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${B({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${B({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
fr = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = me(this, D, Va), n = me(this, D, qs), l = De(this.layer.position, "x") || De(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${B({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...G(this, D, Js).call(this, e) })}>
        <span
          class="tag"
          style=${B(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${R(
    du,
    (d) => d,
    (d) => r`
                  <span
                    class="handle ${d}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${d}"
                    @pointerdown=${(m) => G(this, D, Da).call(this, m, d)}>
                  </span>
                `
  )}
              <span class="stalk" style=${B({ height: `${ts}px`, top: `${-ts}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${B({ top: `${-ts}px` })}
                @pointerdown=${(d) => G(this, D, Da).call(this, d, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${B({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
mr = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return r`
      <div
        class="measured"
        style=${B({
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
ve.styles = O`
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
  y({ type: Object })
], ve.prototype, "layer", 2);
Ue([
  y({ type: Number })
], ve.prototype, "scale", 2);
Ue([
  y({ type: Boolean, reflect: !0 })
], ve.prototype, "selected", 2);
Ue([
  y({ type: Object })
], ve.prototype, "measured", 2);
Ue([
  y({ type: Boolean })
], ve.prototype, "showMeasured", 2);
Ue([
  y({ type: String })
], ve.prototype, "resolvedText", 2);
Ue([
  y({ attribute: !1 })
], ve.prototype, "resolvedPosition", 2);
Ue([
  f()
], ve.prototype, "_box", 2);
ve = Ue([
  I("di-layer-box")
], ve);
var pu = Object.defineProperty, fu = Object.getOwnPropertyDescriptor, gr = (e) => {
  throw TypeError(e);
}, Zs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? fu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && pu(t, i, s), s;
}, mu = (e, t, i) => t.has(e) || gr("Cannot " + i), gu = (e, t, i) => t.has(e) ? gr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), yu = (e, t, i) => (mu(e, t, "access private method"), i), bs, yr;
let Pi = class extends W {
  constructor() {
    super(...arguments), gu(this, bs), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${R(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => yu(this, bs, yr).call(this, e)
    )}`;
  }
};
bs = /* @__PURE__ */ new WeakSet();
yr = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Pi.styles = O`
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
Zs([
  y({ type: Array })
], Pi.prototype, "guides", 2);
Zs([
  y({ type: Number })
], Pi.prototype, "scale", 2);
Pi = Zs([
  I("di-guides")
], Pi);
var vu = Object.defineProperty, bu = Object.getOwnPropertyDescriptor, vr = (e) => {
  throw TypeError(e);
}, Xi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && vu(t, i, s), s;
}, _u = (e, t, i) => t.has(e) || vr("Cannot " + i), wu = (e, t, i) => t.has(e) ? vr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Oo = (e, t, i) => (_u(e, t, "access private method"), i), pa, _s;
let Y = class extends W {
  constructor() {
    super(...arguments), wu(this, pa), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Oo(this, pa, _s).call(this, "top"), Oo(this, pa, _s).call(this, "left");
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
pa = /* @__PURE__ */ new WeakSet();
_s = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : Y.thickness) * o, t.height = (e === "top" ? Y.thickness : s) * o, t.style.width = `${e === "top" ? s : Y.thickness}px`, t.style.height = `${e === "top" ? Y.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const d = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, T = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(d, Y.thickness - T), i.lineTo(d, Y.thickness)) : (i.moveTo(Y.thickness - T, d), i.lineTo(Y.thickness, d)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), d + 2, 9) : (i.save(), i.translate(9, d - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
Y.thickness = 20;
Y.styles = O`
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
Xi([
  y({ type: Number })
], Y.prototype, "canvasWidth", 2);
Xi([
  y({ type: Number })
], Y.prototype, "canvasHeight", 2);
Xi([
  y({ type: Number })
], Y.prototype, "scale", 2);
Xi([
  y({ type: Object })
], Y.prototype, "pointer", 2);
Y = Xi([
  I("di-rulers")
], Y);
var $u = Object.defineProperty, xu = Object.getOwnPropertyDescriptor, br = (e) => {
  throw TypeError(e);
}, ee = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? xu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && $u(t, i, s), s;
}, Qs = (e, t, i) => t.has(e) || br("Cannot " + i), z = (e, t, i) => (Qs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ie = (e, t, i) => t.has(e) ? br("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fa = (e, t, i, a) => (Qs(e, t, "write to private field"), t.set(e, i), i), A = (e, t, i) => (Qs(e, t, "access private method"), i), pt, wi, tt, P, ws, $s, Ha, eo, xs, _r, wr, to, $r, xr, ks, ma, kr, Sr, At, io, Ss, Ts, Cs, Es, Ds, Ps, Tr;
const ku = 6, Cr = 20, Su = 15, Tu = 0.1;
let q = class extends W {
  constructor() {
    super(...arguments), ie(this, P), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ie(this, pt), ie(this, wi), ie(this, tt, /* @__PURE__ */ new Map()), ie(this, ks, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = A(this, P, eo).call(this, t), a = A(this, P, xs).call(this, t), s = A(this, P, _r).call(this, t), o = A(this, P, Ha).call(this, e.detail.startX, e.detail.startY);
      fa(this, pt, {
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
    }), ie(this, ma, (e) => {
      var ea, wo;
      this._pointer = A(this, P, $s).call(this, e.clientX, e.clientY);
      const t = z(this, pt);
      if (!t) return;
      const i = this.template.layers.find((fi) => fi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        A(this, P, Sr).call(this, i, t, e);
        return;
      }
      const o = De(i.position, "x"), n = De(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        A(this, P, kr).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let d = t.handle ? A(this, P, io).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (d = { ...d, x: t.startBox.x, width: (ea = t.handle) != null && ea.includes("w") ? t.startBox.width : d.width }), n && (d = { ...d, y: t.startBox.y, height: (wo = t.handle) != null && wo.includes("n") ? t.startBox.height : d.height });
      const m = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, T = l !== 0 ? { x: d.x + m.x, y: d.y + m.y, width: t.startExtent.width, height: t.startExtent.height } : d, _e = this.snapEnabled && !e.altKey ? au(T, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((fi) => fi.key !== i.key).map((fi) => A(this, P, xs).call(this, fi)),
        threshold: ku / this.scale,
        lockX: o,
        lockY: n
      }) : {
        box: {
          ...T,
          x: o ? T.x : Math.round(T.x),
          y: n ? T.y : Math.round(T.y)
        },
        guides: []
      };
      this._guides = _e.guides;
      const ze = l !== 0 ? { ...d, x: _e.box.x - m.x, y: _e.box.y - m.y } : _e.box, Ke = yc(ze, i.position);
      o && (Ke.x = i.position.x), n && (Ke.y = i.position.y);
      const Oe = { position: Ke };
      t.handle && (Oe.size = {
        width: Math.max(1, Math.round(ze.width)),
        height: Math.max(1, Math.round(ze.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Oe } })
      );
    }), ie(this, At, () => {
      if (!z(this, pt)) return;
      const e = z(this, pt).moved;
      fa(this, pt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ie(this, Ss, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ie(this, Ts, () => {
      this._dropTarget = !1;
    }), ie(this, Cs, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = A(this, P, $s).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y }
        })
      );
    }), ie(this, Es, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ie(this, Ds, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => $n(t.position)) && this.requestUpdate();
    }), ie(this, Ps, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), fa(this, wi, new ResizeObserver(() => A(this, P, ws).call(this))), z(this, wi).observe(this), window.addEventListener("pointermove", z(this, ma)), window.addEventListener("pointerup", z(this, At)), window.addEventListener("pointercancel", z(this, At));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = z(this, wi)) == null || e.disconnect(), window.removeEventListener("pointermove", z(this, ma)), window.removeEventListener("pointerup", z(this, At)), window.removeEventListener("pointercancel", z(this, At));
  }
  updated() {
    A(this, P, ws).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = z(this, tt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    A(this, P, wr).call(this);
    const s = this.showRulers ? Cr : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${z(this, Es)}
        @dragover=${z(this, Ss)}
        @dragleave=${z(this, Ts)}
        @drop=${z(this, Cs)}
        @di-layer-drag-start=${z(this, ks)}
        @di-layer-box-resize=${z(this, Ds)}>
        <div
          class="artboard"
          style=${B({
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
            style=${B({ background: e.background })}
            @pointerdown=${z(this, Ps)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${B({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${R(
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
                  .resolvedPosition=${(l = z(this, tt).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? A(this, P, Tr).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
pt = /* @__PURE__ */ new WeakMap();
wi = /* @__PURE__ */ new WeakMap();
tt = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakSet();
ws = function() {
  const e = this.renderRoot.querySelector(".viewport");
  if (!e || !this.template) return;
  const t = 48 + (this.showRulers ? Cr : 0), i = {
    width: Math.max(1, e.clientWidth - t),
    height: Math.max(1, e.clientHeight - t)
  }, a = Math.min(
    i.width / this.template.canvas.width,
    i.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(a - this._fitScale) > 1e-3 && (this._fitScale = a);
};
$s = function(e, t) {
  const i = A(this, P, Ha).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Ha = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
eo = function(e) {
  const t = z(this, tt).get(e.key);
  if (t) return t.box;
  const i = A(this, P, to).call(this, e), a = Na(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
xs = function(e) {
  const t = z(this, tt).get(e.key);
  return t ? t.extent : wn(A(this, P, eo).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
_r = function(e) {
  var t;
  return ((t = z(this, tt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
wr = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  fa(this, tt, xc(
    this.template.layers,
    (i) => A(this, P, to).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
to = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? A(this, P, $r).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? A(this, P, xr).call(this, e, i)
  };
};
$r = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
xr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
ks = /* @__PURE__ */ new WeakMap();
ma = /* @__PURE__ */ new WeakMap();
kr = function(e, t, i, a, s, o, n, l) {
  const d = t.startRotation, m = t.startPosition, T = vc(a, s, 0, 0, d);
  let X = A(this, P, io).call(this, t.startBox, i, T.x, T.y, o);
  n && (X = { ...X, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : X.width }), l && (X = { ...X, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : X.height });
  const _e = Math.max(1, Math.round(X.width)), ze = Math.max(1, Math.round(X.height)), Ke = Bs(X.x, X.y, _e, ze, m.anchor), Oe = Wt(Ke.x, Ke.y, m.x, m.y, d), ea = {
    ...e.position,
    x: n ? e.position.x : Math.round(Oe.x),
    y: l ? e.position.y : Math.round(Oe.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: ea, size: { width: _e, height: ze } } }
    })
  );
};
Sr = function(e, t, i) {
  const a = t.startPosition, s = A(this, P, Ha).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, d = i.shiftKey ? Su : Tu, m = _n(Math.round(l / d) * d);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
At = /* @__PURE__ */ new WeakMap();
io = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: d } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, d = e.height - a), t.includes("s") && (d = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(d - e.height) ? d = l / m : l = d * m, t.includes("n") && (n = e.y + e.height - d), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, d) };
};
Ss = /* @__PURE__ */ new WeakMap();
Ts = /* @__PURE__ */ new WeakMap();
Cs = /* @__PURE__ */ new WeakMap();
Es = /* @__PURE__ */ new WeakMap();
Ds = /* @__PURE__ */ new WeakMap();
Ps = /* @__PURE__ */ new WeakMap();
Tr = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${B({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
q.styles = O`
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
ee([
  y({ type: Object })
], q.prototype, "template", 2);
ee([
  y({ type: String })
], q.prototype, "selectedLayerKey", 2);
ee([
  y({ type: Object })
], q.prototype, "baseImageUrl", 2);
ee([
  y({ type: Array })
], q.prototype, "serverBounds", 2);
ee([
  y({ type: Boolean })
], q.prototype, "showMeasured", 2);
ee([
  y({ type: Boolean })
], q.prototype, "snapEnabled", 2);
ee([
  y({ type: Boolean })
], q.prototype, "showRulers", 2);
ee([
  y({ type: Boolean })
], q.prototype, "showSafeArea", 2);
ee([
  y({ type: Number })
], q.prototype, "zoom", 2);
ee([
  f()
], q.prototype, "_fitScale", 2);
ee([
  f()
], q.prototype, "_guides", 2);
ee([
  f()
], q.prototype, "_pointer", 2);
ee([
  f()
], q.prototype, "_dropTarget", 2);
q = ee([
  I("di-designer-canvas")
], q);
var Cu = Object.defineProperty, Eu = Object.getOwnPropertyDescriptor, Er = (e) => {
  throw TypeError(e);
}, ao = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Eu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Cu(t, i, s), s;
}, Dr = (e, t, i) => t.has(e) || Er("Cannot " + i), Du = (e, t, i) => (Dr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Pu = (e, t, i) => t.has(e) ? Er("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Se = (e, t, i) => (Dr(e, t, "access private method"), i), re, Pr, Mr, zr, Or, Ir, mt;
const Io = {
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
let Mi = class extends W {
  constructor() {
    super(...arguments), Pu(this, re), this.properties = [], this._search = "";
  }
  render() {
    const e = Mu(Du(this, re, Pr));
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

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : R(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => Se(this, re, Or).call(this, t, i)
    )}

        ${Se(this, re, Ir).call(this)}
      </div>
    `;
  }
};
re = /* @__PURE__ */ new WeakSet();
Pr = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Mr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
zr = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Or = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${R(
    t,
    (i) => i.alias,
    (i) => Se(this, re, mt).call(this, i.name, Io[i.classification] ?? Io.other, i.classification, { kind: "property", property: i })
  )}
      </div>
    `;
};
Ir = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Se(this, re, mt).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Se(this, re, mt).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Se(this, re, mt).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Se(this, re, mt).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Se(this, re, mt).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
mt = function(e, t, i, a) {
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        @dragstart=${(s) => Se(this, re, zr).call(this, s, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${e}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label="Add ${e} to the canvas"
          @click=${() => Se(this, re, Mr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Mi.styles = O`
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
ao([
  y({ type: Array })
], Mi.prototype, "properties", 2);
ao([
  f()
], Mi.prototype, "_search", 2);
Mi = ao([
  I("di-property-palette")
], Mi);
function Mu(e) {
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
var zu = Object.defineProperty, Ou = Object.getOwnPropertyDescriptor, Ar = (e) => {
  throw TypeError(e);
}, ja = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ou(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && zu(t, i, s), s;
}, Lr = (e, t, i) => t.has(e) || Ar("Cannot " + i), Xe = (e, t, i) => (Lr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Iu = (e, t, i) => t.has(e) ? Ar("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xi = (e, t, i) => (Lr(e, t, "access private method"), i), J, zi, ki, Ga, Rr, Wr;
let ri = class extends W {
  constructor() {
    super(...arguments), Iu(this, J), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Xe(this, J, zi)};opacity:${Xe(this, J, ki)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => xi(this, J, Ga).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Xe(this, J, zi)}
                  @input=${(e) => xi(this, J, Rr).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Xe(this, J, ki))}
                    @input=${(e) => xi(this, J, Wr).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Xe(this, J, ki) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
J = /* @__PURE__ */ new WeakSet();
zi = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
ki = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
Ga = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Rr = function(e) {
  const t = Xe(this, J, ki);
  xi(this, J, Ga).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${Fr(t)}`);
};
Wr = function(e) {
  xi(this, J, Ga).call(this, e >= 0.999 ? Xe(this, J, zi).toUpperCase() : `${Xe(this, J, zi).toUpperCase()}${Fr(e)}`);
};
ri.styles = O`
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
  y({ type: String })
], ri.prototype, "value", 2);
ja([
  y({ type: String })
], ri.prototype, "label", 2);
ja([
  f()
], ri.prototype, "_open", 2);
ri = ja([
  I("di-colour-input")
], ri);
const Fr = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Au = Object.defineProperty, Lu = Object.getOwnPropertyDescriptor, Ur = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Lu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Au(t, i, s), s;
};
const Ao = {
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
let Pa = class extends W {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${R(
      bn,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Ao[e]}
              title=${Ao[e]}
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
Pa.styles = O`
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
Ur([
  y({ type: String })
], Pa.prototype, "value", 2);
Pa = Ur([
  I("di-anchor-picker")
], Pa);
var Ru = Object.defineProperty, Wu = Object.getOwnPropertyDescriptor, Nr = (e) => {
  throw TypeError(e);
}, ct = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Wu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ru(t, i, s), s;
}, Fu = (e, t, i) => t.has(e) || Nr("Cannot " + i), Uu = (e, t, i) => t.has(e) ? Nr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Nu = (e, t, i) => (Fu(e, t, "access private method"), i), Ms, Br;
let Me = class extends W {
  constructor() {
    super(...arguments), Uu(this, Ms), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${Nu(this, Ms, Br)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
Ms = /* @__PURE__ */ new WeakSet();
Br = function(e) {
  const t = e.target.value, i = t === "" ? null : Number(t);
  this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: i } }));
};
Me.styles = O`
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
ct([
  y({ type: Number })
], Me.prototype, "value", 2);
ct([
  y({ type: String })
], Me.prototype, "label", 2);
ct([
  y({ type: String })
], Me.prototype, "suffix", 2);
ct([
  y({ type: Number })
], Me.prototype, "step", 2);
ct([
  y({ type: Number })
], Me.prototype, "min", 2);
ct([
  y({ type: Number })
], Me.prototype, "max", 2);
ct([
  y({ type: String })
], Me.prototype, "placeholder", 2);
Me = ct([
  I("di-number-field")
], Me);
var Bu = Object.defineProperty, Ku = Object.getOwnPropertyDescriptor, Kr = (e) => {
  throw TypeError(e);
}, Yi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ku(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Bu(t, i, s), s;
}, Vu = (e, t, i) => t.has(e) || Kr("Cannot " + i), Hu = (e, t, i) => t.has(e) ? Kr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (Vu(e, t, "access private method"), i), u, g, Ve, Vr, Hr, jr, Gr, Xr, Yr, qr, Jr, zs, Zr, ga, Qr, el, pi, so, tl;
let Et = class extends W {
  constructor() {
    super(...arguments), Hu(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, u, Hr).call(this, this.layer) : h(this, u, Vr).call(this)}</div>` : p;
  }
};
u = /* @__PURE__ */ new WeakSet();
g = function(e) {
  this.layer && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: this.layer.key, patch: e }
    })
  );
};
Ve = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Vr = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            label="Width"
            .value=${e.width}
            @change=${(t) => h(this, u, Ve).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            label="Height"
            .value=${e.height}
            @change=${(t) => h(this, u, Ve).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Background</span>
          <di-colour-input
            label="Canvas background"
            .value=${e.background}
            @change=${(t) => h(this, u, Ve).call(this, { background: t.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${il(e.baseImage.kind)}
              @change=${(t) => h(this, u, Ve).call(this, {
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
                @change=${(t) => h(this, u, Ve).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${h(this, u, pi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, u, Ve).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${Q(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => h(this, u, Ve).call(this, { baseImageFit: t.target.value })}>
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
Hr = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, u, g).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, u, jr).call(this, e) : p}
      ${e.type === "text" ? h(this, u, Gr).call(this, e) : p}
      ${e.type === "image" ? h(this, u, Xr).call(this, e) : p}
      ${e.type === "badges" ? h(this, u, Yr).call(this, e) : p}
      ${e.type === "rect" ? h(this, u, qr).call(this, e) : p}
      ${h(this, u, Jr).call(this, e)} ${h(this, u, el).call(this, e)}
    `;
};
jr = function(e) {
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
            @change=${(i) => h(this, u, g).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, pi).call(this, t.propertyAlias ?? "", (i) => h(this, u, g).call(this, { binding: { ...t, propertyAlias: i } }))}
            </label>` : p}

        ${t.kind === "date" ? r`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => h(this, u, g).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "static" || t.kind === "expression" ? r`<label class="field">
              <span>${t.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => h(this, u, g).call(this, {
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
              @change=${(i) => h(this, u, g).call(this, { prefix: i.target.value })}>
            </uui-input>
          </label>
          <label class="field">
            <span>Suffix</span>
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => h(this, u, g).call(this, { suffix: i.target.value })}>
            </uui-input>
          </label>
        </div>
      </uui-box>
    `;
};
Gr = function(e) {
  const t = e.style, i = (a) => h(this, u, g).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, u, so).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, u, tl).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

        <div class="pair">
          <di-number-field
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
            label="Line spacing"
            suffix="×"
            step="0.05"
            .value=${t.lineSpacing}
            @change=${(a) => i({ lineSpacing: a.detail.value ?? 1 })}>
          </di-number-field>
          <di-number-field
            label="Letter spacing"
            .value=${t.letterSpacing}
            @change=${(a) => i({ letterSpacing: a.detail.value ?? 0 })}>
          </di-number-field>
        </div>

        <div class="pair">
          <di-number-field
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
Xr = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${il(t.kind)}
            @change=${(a) => h(this, u, g).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, pi).call(this, t.propertyAlias ?? "", (a) => h(this, u, g).call(this, { source: { ...t, propertyAlias: a } }), "media")}
            </label>` : p}

        ${t.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => h(this, u, g).call(this, {
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
            @change=${(a) => h(this, u, g).call(this, { fit: a.target.value })}>
          </uui-select>
        </label>

        <di-number-field
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => h(this, u, g).call(this, { cornerRadius: a.detail.value ?? 0 })}>
        </di-number-field>

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              label="Width"
              .value=${((i = e.border) == null ? void 0 : i.width) ?? 0}
              @change=${(a) => {
    var o;
    const s = a.detail.value ?? 0;
    h(this, u, g).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => h(this, u, g).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : p}
          </div>
        </label>
      </uui-box>
    `;
};
Yr = function(e) {
  const t = (s) => h(this, u, g).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, u, g).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, u, g).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, u, pi).call(this, e.itemsPropertyAlias, (s) => h(this, u, g).call(this, { itemsPropertyAlias: s }))}
        </label>

        <div class="pair">
          <di-number-field
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => h(this, u, g).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            label="Gap"
            .value=${e.gap}
            @change=${(s) => h(this, u, g).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${e.direction}
            .options=${Q(["horizontal", "vertical"], e.direction)}
            @change=${(s) => h(this, u, g).call(this, { direction: s.target.value })}>
          </uui-select>
        </label>

        ${e.direction === "horizontal" ? r`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => h(this, u, g).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </label>

              ${e.wrap ? r`
                    <di-number-field
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => h(this, u, g).call(this, { rowGap: s.detail.value ?? 20 })}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  ` : p}
            ` : p}

        <div class="pair">
          <di-number-field
            label="Circle size"
            .value=${e.badge.size}
            @change=${(s) => t({ size: s.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
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
                  .options=${h(this, u, so).call(this, e.label.fontKey)}
                  @change=${(s) => i({ fontKey: s.target.value })}>
                </uui-select>
              </label>

              <div class="pair">
                <di-number-field
                  label="Label size"
                  .value=${e.label.fontSize}
                  @change=${(s) => i({ fontSize: s.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
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
qr = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${Q(["rectangle", "ellipse", "polygon", "star"], t)}
            @change=${(s) => h(this, u, g).call(this, { shape: s.target.value })}>
          </uui-select>
        </label>

        ${t === "polygon" || t === "star" ? r`
              <div class="pair">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  min=${Zn}
                  max=${Qn}
                  .value=${e.sides ?? 5}
                  @change=${(s) => h(this, u, g).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      min=${er}
                      max=${tr}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => h(this, u, g).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : p}
              </div>
            ` : p}

        <label class="field inline">
          <span>Fill</span>
          <uui-toggle
            ?checked=${i}
            @change=${(s) => h(this, u, g).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </label>

        ${i ? r`<label class="field">
              <span>Fill colour</span>
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => h(this, u, g).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </label>` : p}

        <label class="field inline">
          <span>Gradient</span>
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => h(this, u, g).call(this, {
    gradient: s.target.checked ? { from: "#000000CC", to: "#00000000", angle: 180 } : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? r`
              <div class="pair">
                <di-colour-input
                  label="From"
                  .value=${e.gradient.from}
                  @change=${(s) => h(this, u, g).call(this, { gradient: { ...e.gradient, from: s.detail.value } })}>
                </di-colour-input>
                <di-colour-input
                  label="To"
                  .value=${e.gradient.to}
                  @change=${(s) => h(this, u, g).call(this, { gradient: { ...e.gradient, to: s.detail.value } })}>
                </di-colour-input>
              </div>
              <di-number-field
                label="Angle"
                suffix="°"
                .value=${e.gradient.angle}
                @change=${(s) => h(this, u, g).call(this, { gradient: { ...e.gradient, angle: s.detail.value ?? 180 } })}>
              </di-number-field>
            ` : p}

        ${t === "rectangle" ? r`<di-number-field
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => h(this, u, g).call(this, { cornerRadius: s.detail.value ?? 0 })}>
            </di-number-field>` : p}

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              label="Width"
              .value=${((a = e.border) == null ? void 0 : a.width) ?? 0}
              @change=${(s) => {
    var n;
    const o = s.detail.value ?? 0;
    h(this, u, g).call(this, {
      border: o > 0 ? { width: o, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => h(this, u, g).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : p}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </label>
      </uui-box>
    `;
};
Jr = function(e) {
  const t = De(e.position, "x"), i = De(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, u, zs).call(this, e, "x")} ${h(this, u, zs).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, u, Qr).call(this, e, s.detail.value)}>
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
            @change=${(s) => h(this, u, g).call(this, { rotation: _n(s.detail.value ?? 0) })}>
          </di-number-field>
          <small class="hint">Clockwise, around the anchor point. Drag the handle above the selection on the canvas; hold Shift for 15° steps.</small>
        </div>

        <div class="pair">
          <di-number-field
            label="Width"
            placeholder="Auto"
            .value=${e.size.width ?? null}
            @change=${(s) => h(this, u, g).call(this, { size: { ...e.size, width: s.detail.value } })}>
          </di-number-field>
          <di-number-field
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => h(this, u, g).call(this, { size: { ...e.size, height: s.detail.value } })}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
zs = function(e, t) {
  const i = De(e.position, t), a = ka(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => h(this, u, Zr).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => h(this, u, ga).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${Q(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => h(this, u, ga).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                label="Gap"
                .value=${a.gap}
                @change=${(n) => h(this, u, ga).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => h(this, u, g).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
Zr = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (De(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && h(this, u, g).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: bc
      }
    }
  });
};
ga = function(e, t, i) {
  const a = ka(e.position, t);
  a && h(this, u, g).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Qr = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? gc(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, u, g).call(this, { position: s });
};
el = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <label class="field inline">
          <span>Visible</span>
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => h(this, u, g).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </label>

        <label class="field inline">
          <span>Locked</span>
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => h(this, u, g).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </label>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          min="0"
          max="1"
          .value=${e.opacity}
          @change=${(t) => h(this, u, g).call(this, { opacity: t.detail.value ?? 1 })}>
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
            @change=${(t) => h(this, u, g).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </label>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<label class="field">
              <span>Controlled by</span>
              ${h(this, u, pi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, u, g).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
pi = function(e, t, i) {
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
so = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
tl = function(e, t, i) {
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
Et.styles = O`
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
Yi([
  y({ type: Object })
], Et.prototype, "template", 2);
Yi([
  y({ type: Object })
], Et.prototype, "layer", 2);
Yi([
  y({ type: Array })
], Et.prototype, "properties", 2);
Yi([
  y({ type: Array })
], Et.prototype, "fonts", 2);
Et = Yi([
  I("di-layer-inspector")
], Et);
function Q(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function il(e) {
  return Q(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var ju = Object.defineProperty, Gu = Object.getOwnPropertyDescriptor, al = (e) => {
  throw TypeError(e);
}, qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ju(t, i, s), s;
}, Xu = (e, t, i) => t.has(e) || al("Cannot " + i), Yu = (e, t, i) => t.has(e) ? al("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), we = (e, t, i) => (Xu(e, t, "access private method"), i), ce, gt, sl, ol, nl, rl;
const qu = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Dt = class extends W {
  constructor() {
    super(...arguments), Yu(this, ce), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${we(this, ce, nl)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : R(
      e,
      (t) => t.key,
      (t, i) => we(this, ce, rl).call(this, t, i)
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
ce = /* @__PURE__ */ new WeakSet();
gt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
sl = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
ol = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
nl = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  we(this, ce, gt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
rl = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => we(this, ce, sl).call(this, a, e.key)}
        @dragover=${(a) => we(this, ce, ol).call(this, a, t)}
        @click=${() => we(this, ce, gt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${qu[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          look="secondary"
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), we(this, ce, gt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name=${e.isVisible ? "icon-eye" : "icon-eye-off"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), we(this, ce, gt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), we(this, ce, gt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), we(this, ce, gt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Dt.styles = O`
    :host {
      display: block;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
      max-height: 40%;
      overflow: auto;
    }

    .panel {
      padding: var(--uui-size-space-3);
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
qi([
  y({ type: Array })
], Dt.prototype, "layers", 2);
qi([
  y({ type: String })
], Dt.prototype, "selectedLayerKey", 2);
qi([
  f()
], Dt.prototype, "_dragKey", 2);
qi([
  f()
], Dt.prototype, "_dropIndex", 2);
Dt = qi([
  I("di-layers-panel")
], Dt);
var Ju = Object.defineProperty, Zu = Object.getOwnPropertyDescriptor, ll = (e) => {
  throw TypeError(e);
}, Ne = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ju(t, i, s), s;
}, Qu = (e, t, i) => t.has(e) || ll("Cannot " + i), eh = (e, t, i) => t.has(e) ? ll("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), pe = (e, t, i) => (Qu(e, t, "access private method"), i), ae, He, $i;
let be = class extends W {
  constructor() {
    super(...arguments), eh(this, ae), this.zoom = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1;
  }
  render() {
    return r`
      <div class="toolbar">
        <div class="zoom">
          <uui-button compact look="secondary" label="Zoom out" @click=${() => pe(this, ae, He).call(this, "di-zoom-change", { zoom: this.zoom / 1.25 })}>
            <uui-icon name="icon-remove"></uui-icon>
          </uui-button>
          <span class="value">${Math.round(this.zoom * 100)}%</span>
          <uui-button compact look="secondary" label="Zoom in" @click=${() => pe(this, ae, He).call(this, "di-zoom-change", { zoom: this.zoom * 1.25 })}>
            <uui-icon name="icon-add"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => pe(this, ae, He).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${pe(this, ae, $i).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${pe(this, ae, $i).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${pe(this, ae, $i).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${pe(this, ae, $i).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => pe(this, ae, He).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => pe(this, ae, He).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => pe(this, ae, He).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
ae = /* @__PURE__ */ new WeakSet();
He = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
$i = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => pe(this, ae, He).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
be.styles = O`
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
Ne([
  y({ type: Number })
], be.prototype, "zoom", 2);
Ne([
  y({ type: Boolean })
], be.prototype, "snapEnabled", 2);
Ne([
  y({ type: Boolean })
], be.prototype, "showRulers", 2);
Ne([
  y({ type: Boolean })
], be.prototype, "showSafeArea", 2);
Ne([
  y({ type: Boolean })
], be.prototype, "showMeasured", 2);
Ne([
  y({ type: Boolean })
], be.prototype, "canUndo", 2);
Ne([
  y({ type: Boolean })
], be.prototype, "canRedo", 2);
Ne([
  y({ type: Boolean })
], be.prototype, "previewing", 2);
be = Ne([
  I("di-canvas-toolbar")
], be);
var th = Object.defineProperty, ih = Object.getOwnPropertyDescriptor, cl = (e) => {
  throw TypeError(e);
}, Ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ih(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && th(t, i, s), s;
}, oo = (e, t, i) => t.has(e) || cl("Cannot " + i), ne = (e, t, i) => (oo(e, t, "read from private field"), t.get(e)), vi = (e, t, i) => t.has(e) ? cl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Oi = (e, t, i, a) => (oo(e, t, "write to private field"), t.set(e, i), i), Ut = (e, t, i) => (oo(e, t, "access private method"), i), Qe, Ii, Kt, kt, Ye, no, ya, ul;
const ah = 400;
let Pt = class extends W {
  constructor() {
    super(), vi(this, Ye), vi(this, Qe), vi(this, Ii), vi(this, Kt), vi(this, kt), this._loading = !1, this._collapsed = !1, this.consumeContext(zt, (e) => {
      Oi(this, Qe, e), e && (this.observe(e.template, (t) => {
        t && Ut(this, Ye, ya).call(this, t);
      }), this.observe(e.sampleContentKey, () => {
        var i;
        const t = (i = ne(this, Qe)) == null ? void 0 : i.getData();
        t && Ut(this, Ye, ya).call(this, t);
      }));
    });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(ne(this, Ii)), (e = ne(this, Kt)) == null || e.abort(), Ut(this, Ye, no).call(this);
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
        const t = (e = ne(this, Qe)) == null ? void 0 : e.getData();
        t && Ut(this, Ye, ya).call(this, t);
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
Qe = /* @__PURE__ */ new WeakMap();
Ii = /* @__PURE__ */ new WeakMap();
Kt = /* @__PURE__ */ new WeakMap();
kt = /* @__PURE__ */ new WeakMap();
Ye = /* @__PURE__ */ new WeakSet();
no = function() {
  ne(this, kt) && (URL.revokeObjectURL(ne(this, kt)), Oi(this, kt, void 0));
};
ya = function(e) {
  this._collapsed || (window.clearTimeout(ne(this, Ii)), Oi(this, Ii, window.setTimeout(() => void Ut(this, Ye, ul).call(this, e), ah)));
};
ul = async function(e) {
  var t;
  if (ne(this, Qe)) {
    (t = ne(this, Kt)) == null || t.abort(), Oi(this, Kt, new AbortController()), this._loading = !0, this._error = void 0;
    try {
      const i = (ne(this, Qe).getData(), void 0), a = await Fs(
        e,
        { signal: ne(this, Kt).signal, useSampleData: !0, contentKey: i },
        ne(this, Qe).getToken
      );
      Ut(this, Ye, no).call(this), Oi(this, kt, URL.createObjectURL(a)), this._url = ne(this, kt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      this._loading = !1;
    }
  }
};
Pt.styles = O`
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

    .body {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3);
      margin-top: var(--uui-size-space-2);
      min-height: 84px;
    }

    img {
      max-height: 120px;
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
Ji([
  f()
], Pt.prototype, "_url", 2);
Ji([
  f()
], Pt.prototype, "_loading", 2);
Ji([
  f()
], Pt.prototype, "_error", 2);
Ji([
  f()
], Pt.prototype, "_collapsed", 2);
Pt = Ji([
  I("di-preview-strip")
], Pt);
var sh = Object.defineProperty, oh = Object.getOwnPropertyDescriptor, hl = (e) => {
  throw TypeError(e);
}, te = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? oh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && sh(t, i, s), s;
}, ro = (e, t, i) => t.has(e) || hl("Cannot " + i), b = (e, t, i) => (ro(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ot = (e, t, i) => t.has(e) ? hl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ma = (e, t, i, a) => (ro(e, t, "write to private field"), t.set(e, i), i), Z = (e, t, i) => (ro(e, t, "access private method"), i), $, Ai, Li, Vt, F, Os, lo, dl, Is, pl, fl, ml, As, gl, yl, vl, co, bl, va;
const nh = 400;
let H = class extends W {
  constructor() {
    super(), Ot(this, F), Ot(this, $), Ot(this, Ai), Ot(this, Li), Ot(this, Vt), this._properties = [], this._fonts = [], this._serverBounds = [], this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, Ot(this, va, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = b(this, $);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = b(this, F, Os);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), Z(this, F, Is).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, d = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, m = De(s.position, "x") ? 0 : l, T = De(s.position, "y") ? 0 : d;
            if (m === 0 && T === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + m, y: s.position.y + T }
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
    }), this.consumeContext(Aa, (e) => {
      Ma(this, Ai, e);
    }), this.consumeContext(zt, (e) => {
      Ma(this, $, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (Z(this, F, pl).call(this, t), Z(this, F, fl).call(this, t), Z(this, F, ml).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", b(this, va));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", b(this, va)), window.clearTimeout(b(this, Li)), (e = b(this, Vt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = b(this, $)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = b(this, $)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = b(this, $)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => Z(this, F, Is).call(this, e.detail.key)}
        @di-layer-detach=${(e) => Z(this, F, dl).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = b(this, $)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = b(this, $)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = b(this, $)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = b(this, $)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = b(this, $)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = b(this, $)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => Z(this, F, As).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => Z(this, F, As).call(this, e.detail.payload, e.detail.x, e.detail.y)}
        @di-pick-base-image=${Z(this, F, yl)}
        @di-pick-layer-image=${(e) => Z(this, F, vl).call(this, e.detail.key)}
        @di-use-image-size=${Z(this, F, bl)}
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
      return (e = b(this, $)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = b(this, $)) == null ? void 0 : e.redo();
    }}>
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
            .layer=${b(this, F, Os)}
            .properties=${this._properties}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    ` : r`<div class="state"><uui-loader></uui-loader></div>`;
  }
};
$ = /* @__PURE__ */ new WeakMap();
Ai = /* @__PURE__ */ new WeakMap();
Li = /* @__PURE__ */ new WeakMap();
Vt = /* @__PURE__ */ new WeakMap();
F = /* @__PURE__ */ new WeakSet();
Os = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
lo = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
dl = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = b(this, F, lo)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = b(this, $)) == null || n.updateLayer(e, { position: cs(i.position, t, a) });
};
Is = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = b(this, F, lo)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = b(this, $)) == null || s.removeLayer(e, t);
};
pl = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && b(this, $) && await Bn(t, b(this, $).getToken);
};
fl = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !b(this, $)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Ns(t.mediaKey, b(this, $).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
ml = function() {
  window.clearTimeout(b(this, Li)), Ma(this, Li, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !b(this, $))) {
      (t = b(this, Vt)) == null || t.abort(), Ma(this, Vt, new AbortController());
      try {
        const i = await Us(
          e,
          { signal: b(this, Vt).signal, useSampleData: !0 },
          b(this, $).getToken
        );
        b(this, $).setServerBounds(i.layers), b(this, $).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, nh));
};
As = function(e, t, i) {
  const a = this._template;
  if (!a || !b(this, $)) return;
  const s = { template: a, x: t, y: i, defaultFontKey: Z(this, F, gl).call(this) }, o = e.kind === "property" ? pc(e.property, s) : e.layerType === "image" ? yn(s, "Image") : e.layerType === "badges" ? vn(s, "Badges", "") : e.layerType === "rect" ? hc(s, "Shape", e.shape) : gn(s, "Text", { kind: "static", text: "Text" });
  b(this, $).addLayer(o);
};
gl = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
yl = async function() {
  var t;
  const e = await Z(this, F, co).call(this);
  e && ((t = b(this, $)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
vl = async function(e) {
  var i;
  const t = await Z(this, F, co).call(this);
  t && ((i = b(this, $)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
co = async function() {
  if (!b(this, Ai)) return;
  const e = b(this, Ai).open(this, Ko, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
bl = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !b(this, $)) return;
  const t = await Ns(e.mediaKey, b(this, $).getToken).catch(() => {
  });
  t && b(this, $).updateCanvas({ width: t.width, height: t.height });
};
va = /* @__PURE__ */ new WeakMap();
H.styles = O`
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
te([
  f()
], H.prototype, "_template", 2);
te([
  f()
], H.prototype, "_selectedKey", 2);
te([
  f()
], H.prototype, "_properties", 2);
te([
  f()
], H.prototype, "_fonts", 2);
te([
  f()
], H.prototype, "_serverBounds", 2);
te([
  f()
], H.prototype, "_baseImageUrl", 2);
te([
  f()
], H.prototype, "_zoom", 2);
te([
  f()
], H.prototype, "_snapEnabled", 2);
te([
  f()
], H.prototype, "_showRulers", 2);
te([
  f()
], H.prototype, "_showSafeArea", 2);
te([
  f()
], H.prototype, "_showMeasured", 2);
te([
  f()
], H.prototype, "_canUndo", 2);
te([
  f()
], H.prototype, "_canRedo", 2);
H = te([
  I("di-design-view")
], H);
const rh = H, lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return H;
  },
  default: rh
}, Symbol.toStringTag, { value: "Module" }));
var ch = Object.defineProperty, uh = Object.getOwnPropertyDescriptor, _l = (e) => {
  throw TypeError(e);
}, ut = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? uh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ch(t, i, s), s;
}, uo = (e, t, i) => t.has(e) || _l("Cannot " + i), K = (e, t, i) => (uo(e, t, "read from private field"), t.get(e)), It = (e, t, i) => t.has(e) ? _l("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ht = (e, t, i, a) => (uo(e, t, "write to private field"), t.set(e, i), i), j = (e, t, i) => (uo(e, t, "access private method"), i), ge, Ri, Wi, jt, St, N, za, wl, ho, po, $l, xl, Fi, kl, Sl, Tl;
const hh = [
  { label: "Short", value: "Ship it" },
  { label: "Typical", value: "Designing social share images that actually get clicked" },
  {
    label: "Very long",
    value: "Everything you ever wanted to know about generating Open Graph images from your content, and rather more besides"
  }
];
let de = class extends W {
  constructor() {
    super(), It(this, N), It(this, ge), It(this, Ri), It(this, Wi), It(this, jt), It(this, St), this._bounds = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Aa, (e) => {
      Ht(this, Ri, e);
    }), this.consumeContext(rt, (e) => {
      Ht(this, Wi, e);
    }), this.consumeContext(zt, (e) => {
      Ht(this, ge, e), e && this.observe(e.template, (t) => {
        this._template = t;
      });
    });
  }
  connectedCallback() {
    super.connectedCallback();
    const e = j(this, N, wl).call(this);
    e && (this._sampleNode = e), j(this, N, Fi).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = K(this, jt)) == null || e.abort(), j(this, N, po).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${j(this, N, $l)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => j(this, N, Fi).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${j(this, N, Sl)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
          ${this._error ? r`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? r`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : p}

          <div class="presets">
            <span>Try a title length:</span>
            ${R(
      hh,
      (e) => e.label,
      (e) => r`
                <uui-button
                  compact
                  look="secondary"
                  label="Preview with a ${e.label.toLowerCase()} title"
                  @click=${() => j(this, N, xl).call(this, e.value)}>
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
                ${R(
      this._bounds,
      (e) => e.key,
      (e) => r`
                    <uui-table-row>
                      <uui-table-cell>${j(this, N, Tl).call(this, e.key)}</uui-table-cell>
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
                @click=${j(this, N, kl)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
ge = /* @__PURE__ */ new WeakMap();
Ri = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
jt = /* @__PURE__ */ new WeakMap();
St = /* @__PURE__ */ new WeakMap();
N = /* @__PURE__ */ new WeakSet();
za = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
wl = function() {
  try {
    const e = localStorage.getItem(j(this, N, za).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
ho = function(e) {
  try {
    e ? localStorage.setItem(j(this, N, za).call(this), JSON.stringify(e)) : localStorage.removeItem(j(this, N, za).call(this));
  } catch {
  }
};
po = function() {
  K(this, St) && (URL.revokeObjectURL(K(this, St)), Ht(this, St, void 0));
};
$l = async function() {
  var i, a, s;
  if (!K(this, Ri) || !this._template) return;
  const e = K(this, Ri).open(this, Hc, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, j(this, N, ho).call(this, t.item), (s = K(this, ge)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await j(this, N, Fi).call(this));
};
xl = async function(e) {
  this._template && (this._sampleNode = void 0, j(this, N, ho).call(this, void 0), await j(this, N, Fi).call(this, e));
};
Fi = async function(e) {
  var a, s;
  const t = this._template;
  if (!t || !K(this, ge)) return;
  (a = K(this, jt)) == null || a.abort(), Ht(this, jt, new AbortController()), this._loading = !0, this._error = void 0;
  const i = {
    signal: K(this, jt).signal,
    contentKey: (s = this._sampleNode) == null ? void 0 : s.key,
    useSampleData: !this._sampleNode,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [o, n] = await Promise.all([
      Fs(t, i, K(this, ge).getToken),
      Us(t, i, K(this, ge).getToken)
    ]);
    j(this, N, po).call(this), Ht(this, St, URL.createObjectURL(o)), this._url = K(this, St), this._bounds = n.layers, K(this, ge).setServerBounds(n.layers), K(this, ge).setIssues(n.issues);
  } catch (o) {
    if ((o == null ? void 0 : o.name) === "AbortError") return;
    this._error = o instanceof Error ? o.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
kl = async function() {
  var e, t;
  if (!(!this._sampleNode || !K(this, ge))) {
    this._regenerating = !0;
    try {
      const i = await La(this._sampleNode.key, K(this, ge).getToken);
      (e = K(this, Wi)) == null || e.peek(i.outcome === "generated" ? "positive" : "warning", {
        data: { message: `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = K(this, Wi)) == null || t.peek("danger", {
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
Sl = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Tl = function(e) {
  var i;
  const t = (i = this._template) == null ? void 0 : i.layers.find((a) => a.key === e);
  return (t == null ? void 0 : t.name) || (t == null ? void 0 : t.type) || e.slice(0, 8);
};
de.styles = O`
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
ut([
  f()
], de.prototype, "_template", 2);
ut([
  f()
], de.prototype, "_sampleNode", 2);
ut([
  f()
], de.prototype, "_bounds", 2);
ut([
  f()
], de.prototype, "_url", 2);
ut([
  f()
], de.prototype, "_loading", 2);
ut([
  f()
], de.prototype, "_error", 2);
ut([
  f()
], de.prototype, "_regenerating", 2);
de = ut([
  I("di-preview-view")
], de);
const dh = de, ph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return de;
  },
  default: dh
}, Symbol.toStringTag, { value: "Module" }));
var fh = Object.defineProperty, mh = Object.getOwnPropertyDescriptor, Cl = (e) => {
  throw TypeError(e);
}, Xa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? mh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && fh(t, i, s), s;
}, fo = (e, t, i) => t.has(e) || Cl("Cannot " + i), U = (e, t, i) => (fo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), is = (e, t, i) => t.has(e) ? Cl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Lo = (e, t, i, a) => (fo(e, t, "write to private field"), t.set(e, i), i), et = (e, t, i) => (fo(e, t, "access private method"), i), V, Mt, ye, El, Dl, Pl, Ml, zl, Ol, Il, Al, Ll;
let ot = class extends W {
  constructor() {
    super(), is(this, ye), is(this, V), is(this, Mt), this._properties = [], this._showAdvanced = !1, this.consumeContext(Aa, (e) => {
      Lo(this, Mt, e);
    }), this.consumeContext(zt, (e) => {
      Lo(this, V, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${et(this, ye, Ol).call(this)} ${et(this, ye, Il).call(this)} ${et(this, ye, Al).call(this)} ${et(this, ye, Ll).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
V = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
ye = /* @__PURE__ */ new WeakSet();
El = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Dl = async function() {
  var a, s;
  if (!U(this, Mt) || !this._template) return;
  const e = U(this, Mt).open(this, Jl, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await et(this, ye, Pl).call(this, t.selection.filter((o) => !!o));
  (a = U(this, V)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = U(this, V)) == null ? void 0 : s.reloadProperties());
};
Pl = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => uc), i = await t(U(this, V).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
Ml = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = U(this, V)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = U(this, V)) == null || s.reloadProperties();
};
zl = async function() {
  var i;
  if (!U(this, Mt)) return;
  const e = U(this, Mt).open(this, Ko, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = U(this, V)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
Ol = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${e.docTypeAliases.length === 0 ? r`<p class="empty">No document types yet - nothing will trigger this template.</p>` : r`<div class="tags">
                  ${R(
    e.docTypeAliases,
    (t) => t,
    (t) => r`
                      <uui-tag look="secondary">
                        ${t}
                        <uui-button
                          compact
                          label="Remove ${t}"
                          @click=${() => et(this, ye, Ml).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${et(this, ye, Dl)}>
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
    ...U(this, ye, El).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = U(this, V)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = U(this, V)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Il = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${et(this, ye, zl)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = U(this, V)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
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
    return (i = U(this, V)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = U(this, V)) == null ? void 0 : i.updateOutput({
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
    return (i = U(this, V)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
Al = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = U(this, V)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = U(this, V)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Ll = function() {
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
    return (i = U(this, V)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
ot.styles = O`
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
Xa([
  f()
], ot.prototype, "_template", 2);
Xa([
  f()
], ot.prototype, "_properties", 2);
Xa([
  f()
], ot.prototype, "_showAdvanced", 2);
ot = Xa([
  I("di-settings-view")
], ot);
const gh = ot, yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return ot;
  },
  default: gh
}, Symbol.toStringTag, { value: "Module" }));
var vh = Object.defineProperty, bh = Object.getOwnPropertyDescriptor, Rl = (e) => {
  throw TypeError(e);
}, Zi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && vh(t, i, s), s;
}, mo = (e, t, i) => t.has(e) || Rl("Cannot " + i), Ro = (e, t, i) => (mo(e, t, "read from private field"), t.get(e)), Wo = (e, t, i) => t.has(e) ? Rl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _h = (e, t, i, a) => (mo(e, t, "write to private field"), t.set(e, i), i), Fo = (e, t, i) => (mo(e, t, "access private method"), i), Ui, ba, Ls;
let We = class extends W {
  constructor() {
    super(), Wo(this, ba), Wo(this, Ui), this._loading = !0, this._onlyMissing = !1, this.consumeContext(zt, (e) => {
      _h(this, Ui, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Fo(this, ba, Ls).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Fo(this, ba, Ls).call(this)}>Reload</uui-button>
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
              ${R(
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
ba = /* @__PURE__ */ new WeakSet();
Ls = async function() {
  const e = this._template;
  if (!(!e || !Ro(this, Ui))) {
    this._loading = !0;
    try {
      this._usage = await hn(e.key, Ro(this, Ui).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
We.styles = O`
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
Zi([
  f()
], We.prototype, "_template", 2);
Zi([
  f()
], We.prototype, "_usage", 2);
Zi([
  f()
], We.prototype, "_loading", 2);
Zi([
  f()
], We.prototype, "_onlyMissing", 2);
We = Zi([
  I("di-usage-view")
], We);
const wh = We, $h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return We;
  },
  default: wh
}, Symbol.toStringTag, { value: "Module" })), xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: xo,
  default: xo
}, Symbol.toStringTag, { value: "Module" })), kh = 1500;
var fe, $t, Ia, Wl;
class as extends ec {
  constructor(i, a) {
    super(i, a);
    _(this, Ia);
    _(this, fe);
    _(this, $t);
    this.consumeContext(rt, (s) => {
      v(this, fe, s);
    }), this.consumeContext(zt, (s) => {
      v(this, $t, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, $t), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, fe)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await Rs(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await ln(a.key, !1, i.getToken);
        (o = c(this, fe)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await E(this, Ia, Wl).call(this, l, i);
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
    c(this, $t) && await un(i, c(this, $t).getToken);
  }
}
fe = new WeakMap(), $t = new WeakMap(), Ia = new WeakSet(), Wl = async function(i, a) {
  var o, n, l, d;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((m) => setTimeout(m, kh));
    try {
      s = await cn(s.id, a.getToken);
    } catch {
      (o = c(this, fe)) == null || o.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }
  if (s.status === "completed") {
    const m = s.failures.length;
    (n = c(this, fe)) == null || n.peek(m > 0 ? "warning" : "positive", {
      data: {
        headline: "Regeneration finished",
        message: `${s.generated} generated, ${s.skipped} skipped${m > 0 ? `, ${m} failed` : ""}.`
      }
    });
    for (const T of s.failures.slice(0, 3))
      (l = c(this, fe)) == null || l.peek("danger", { data: { message: T } });
  } else
    (d = c(this, fe)) == null || d.peek("danger", {
      data: { headline: `Regeneration ${s.status}`, message: s.failures[0] ?? "" }
    });
};
const Sh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: as,
  api: as,
  default: as
}, Symbol.toStringTag, { value: "Module" }));
var Ki, ii;
class ss extends ac {
  constructor(i, a) {
    super(i, a);
    _(this, Ki);
    _(this, ii);
    this.consumeContext(Fe, (s) => {
      v(this, Ki, s);
    }), this.consumeContext(rt, (s) => {
      v(this, ii, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await La(i, () => {
          var n;
          return (n = c(this, Ki)) == null ? void 0 : n.getLatestToken();
        });
        (a = c(this, ii)) == null || a.peek(o.outcome === "generated" ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: o.outcome === "generated" ? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof it && o.status === 404;
        (s = c(this, ii)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof it ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Ki = new WeakMap(), ii = new WeakMap();
const Th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: ss,
  api: ss,
  default: ss
}, Symbol.toStringTag, { value: "Module" }));
var Vi, xt, Hi, ai;
class os extends sc {
  constructor(i, a) {
    super(i, a);
    _(this, Vi);
    _(this, xt);
    _(this, Hi);
    _(this, ai);
    this.consumeContext(Fe, (s) => {
      v(this, Vi, s);
    }), this.consumeContext(rt, (s) => {
      v(this, xt, s);
    }), this.consumeContext(oc, (s) => {
      v(this, Hi, s);
    }), this.consumeContext(nc, (s) => {
      v(this, ai, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, ai)) {
      (i = c(this, xt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await La(c(this, ai), () => {
        var l;
        return (l = c(this, Vi)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Hi)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, xt)) == null || s.peek("positive", {
        data: { headline: "Dynamic Images", message: "The image has been regenerated." }
      });
    } catch (n) {
      const l = n instanceof it && n.status === 404;
      (o = c(this, xt)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof it ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Vi = new WeakMap(), xt = new WeakMap(), Hi = new WeakMap(), ai = new WeakMap();
const Ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: os,
  api: os,
  default: os
}, Symbol.toStringTag, { value: "Module" }));
var Eh = Object.defineProperty, Dh = Object.getOwnPropertyDescriptor, Fl = (e) => {
  throw TypeError(e);
}, Ya = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Eh(t, i, s), s;
}, go = (e, t, i) => t.has(e) || Fl("Cannot " + i), Oa = (e, t, i) => (go(e, t, "read from private field"), t.get(e)), sa = (e, t, i) => t.has(e) ? Fl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ul = (e, t, i, a) => (go(e, t, "write to private field"), t.set(e, i), i), Lt = (e, t, i) => (go(e, t, "access private method"), i), _a, Ni, yo, je, vo, Nl, wa;
let nt = class extends Bo {
  constructor() {
    super(), sa(this, je), sa(this, _a), sa(this, Ni), this._items = [], this._loading = !0, this._search = "", sa(this, yo, () => {
      var e;
      return (e = Oa(this, _a)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Fe, (e) => {
      Ul(this, _a, e), e && Lt(this, je, vo).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(Oa(this, Ni));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${Lt(this, je, Nl)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Lt(this, je, wa).call(this, void 0)}>
          Use sample data
        </uui-button>

        ${this._loading ? r`<uui-loader></uui-loader>` : this._items.length === 0 ? r`<p class="empty">No content of the selected document types was found.</p>` : r`<uui-ref-list>
                ${R(
      this._items,
      (e) => e.key,
      (e) => {
        var t;
        return r`
                    <uui-ref-node
                      name=${e.name}
                      detail=${e.isPublished ? "Published" : "Draft"}
                      ?selected=${e.key === ((t = this.data) == null ? void 0 : t.selectedKey)}
                      @open=${() => Lt(this, je, wa).call(this, e)}
                      @click=${() => Lt(this, je, wa).call(this, e)}>
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
_a = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
yo = /* @__PURE__ */ new WeakMap();
je = /* @__PURE__ */ new WeakSet();
vo = async function() {
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
        (a) => rn(a, this._search, 0, 30, Oa(this, yo)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
Nl = function(e) {
  this._search = e.target.value, window.clearTimeout(Oa(this, Ni)), Ul(this, Ni, window.setTimeout(() => void Lt(this, je, vo).call(this), 300));
};
wa = function(e) {
  this.value = { item: e }, this._submitModal();
};
nt.styles = O`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
Ya([
  f()
], nt.prototype, "_items", 2);
Ya([
  f()
], nt.prototype, "_loading", 2);
Ya([
  f()
], nt.prototype, "_search", 2);
nt = Ya([
  I("di-sample-node-picker-modal")
], nt);
const Ph = nt, Mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return nt;
  },
  default: Ph
}, Symbol.toStringTag, { value: "Module" }));
var zh = Object.defineProperty, Oh = Object.getOwnPropertyDescriptor, Bl = (e) => {
  throw TypeError(e);
}, Be = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Oh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && zh(t, i, s), s;
}, bo = (e, t, i) => t.has(e) || Bl("Cannot " + i), li = (e, t, i) => (bo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ns = (e, t, i) => t.has(e) ? Bl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ih = (e, t, i, a) => (bo(e, t, "write to private field"), t.set(e, i), i), Rt = (e, t, i) => (bo(e, t, "access private method"), i), $a, Qi, $e, Kl, Vl, _o, Hl, jl, Gl, Xl;
const Ah = [100, 200, 300, 400, 500, 600, 700, 800, 900], Lh = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let le = class extends Bo {
  constructor() {
    super(), ns(this, $e), ns(this, $a), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", ns(this, Qi, () => {
      var e;
      return (e = li(this, $a)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Fe, (e) => {
      Ih(this, $a, e);
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
            @change=${Rt(this, $e, Kl)} />
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
            @click=${Rt(this, $e, Vl)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Lh.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? Rt(this, $e, Xl).call(this) : Rt(this, $e, Gl).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !li(this, $e, _o)}
            @click=${Rt(this, $e, Hl)}>
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
$a = /* @__PURE__ */ new WeakMap();
Qi = /* @__PURE__ */ new WeakMap();
$e = /* @__PURE__ */ new WeakSet();
Kl = async function(e) {
  const t = e.target.files;
  if (!(!t || t.length === 0)) {
    this._busy = !0, this._error = void 0;
    try {
      for (const i of Array.from(t))
        await Zo(i, li(this, Qi));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (i) {
      this._error = i instanceof Error ? i.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Vl = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await Qo(this._path.trim(), li(this, Qi)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
_o = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
Hl = async function() {
  if (li(this, $e, _o)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await en(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        li(this, Qi)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
jl = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Gl = function() {
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
        ${R(
    Ah,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => Rt(this, $e, jl).call(this, e, t.target.checked)}>
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
Xl = function() {
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
le.styles = O`
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
Be([
  f()
], le.prototype, "_busy", 2);
Be([
  f()
], le.prototype, "_error", 2);
Be([
  f()
], le.prototype, "_path", 2);
Be([
  f()
], le.prototype, "_provider", 2);
Be([
  f()
], le.prototype, "_family", 2);
Be([
  f()
], le.prototype, "_weights", 2);
Be([
  f()
], le.prototype, "_italic", 2);
Be([
  f()
], le.prototype, "_url", 2);
le = Be([
  I("di-font-upload-modal")
], le);
const Rh = le, Wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return le;
  },
  default: Rh
}, Symbol.toStringTag, { value: "Module" }));
export {
  Cc as manifests,
  ed as onInit
};
//# sourceMappingURL=dynamic-images.js.map
