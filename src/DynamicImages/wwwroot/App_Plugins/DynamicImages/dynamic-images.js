var Do = (e) => {
  throw TypeError(e);
};
var is = (e, t, i) => t.has(e) || Do("Cannot " + i);
var c = (e, t, i) => (is(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? Do("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (is(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), P = (e, t, i) => (is(e, t, "access private method"), i);
var as = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { nothing as m, html as r, css as A, state as p, customElement as L, repeat as B, property as b, classMap as jo, styleMap as V } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as N } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Be } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as Ke } from "@umbraco-cms/backoffice/notification";
import { umbOpenModal as nc, UMB_DISCARD_CHANGES_MODAL as rc, umbConfirmModal as Ks, UmbModalToken as Xo, UMB_MODAL_MANAGER_CONTEXT as Ua, UmbModalBaseElement as Yo } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as qo } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as lc } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as cc, UmbEntityWorkspaceDataManager as uc, UmbSubmitWorkspaceAction as Po, UmbWorkspaceActionBase as hc } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as dc } from "@umbraco-cms/backoffice/context-api";
import { UmbArrayState as bi, UmbStringState as zo, UmbBooleanState as oa, UmbNumberState as pc } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as mc } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as fc } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as gc } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as yc } from "@umbraco-cms/backoffice/document";
import "@umbraco-cms/backoffice/external/uui";
const Fa = "dynamic-images", qi = "di-template", Ca = "di:templates-changed", vc = "/umbraco/management/api/v1/dynamic-images";
class nt extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function T(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${vc}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await bc(n);
  return n;
}
async function bc(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new nt(t, e.status, i);
}
const D = async (e) => e.json();
async function Vs(e) {
  const t = await T("/templates?take=500", e);
  return (await D(t)).items;
}
const Jo = async (e, t) => D(await T(`/templates/${e}`, t)), Zo = async (e, t) => D(await T("/templates", t, { method: "POST", json: e })), Qo = async (e, t) => D(await T(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function en(e, t) {
  await T(`/templates/${e}`, t, { method: "DELETE" });
}
const tn = async (e, t) => D(await T(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function an(e, t) {
  return (await T(`/templates/${e}/export`, t)).blob();
}
const sn = async (e, t, i) => D(await T("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), on = async (e) => D(await T("/templates/import/appsettings", e, { method: "POST" })), Pi = async (e) => D(await T("/fonts", e));
async function nn(e, t) {
  const i = new FormData();
  return i.append("file", e), D(await T("/fonts", t, { method: "POST", body: i }));
}
const rn = async (e, t) => D(await T("/fonts/register-path", t, { method: "POST", json: { path: e } })), ln = async (e, t) => D(await T("/fonts/register-web", t, { method: "POST", json: e })), cn = async (e, t) => D(await T(`/fonts/${e}/refresh`, t, { method: "POST" })), un = async (e, t, i, a, s) => D(await T(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function hn(e, t) {
  await T(`/fonts/${e}`, t, { method: "DELETE" });
}
async function dn(e, t) {
  return (await T(`/fonts/${e}/file`, t)).arrayBuffer();
}
const _c = async (e) => D(await T("/document-types", e)), pn = async (e, t) => D(await T(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function mn(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), D(await T(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function Hs(e, t, i) {
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
const Gs = async (e, t, i) => D(await T("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), js = async (e, t) => D(await T(`/media/${e}/image-info`, t)), Ba = async (e, t) => D(await T(`/documents/${e}/regenerate`, t, { method: "POST" })), fn = async (e, t, i) => D(await T(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), gn = async (e, t) => D(await T(`/jobs/${e}`, t));
async function yn(e, t) {
  await T(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const vn = async (e, t) => D(await T(`/templates/${e}/usage`, t)), Ka = async (e) => D(await T("/health", e)), bn = async (e) => D(await T("/sync/status", e)), _n = async (e) => D(await T("/sync/export", e, { method: "POST" })), wn = async (e) => D(await T("/sync/import", e, { method: "POST" }));
function ci(e) {
  const t = `section/${Fa}/workspace/${qi}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Va() {
  return new URL(`section/${Fa}/workspace/${qi}/create`, document.baseURI).pathname;
}
function $n(e) {
  return new URL(`section/${Fa}/dashboard/${e}`, document.baseURI).pathname;
}
function ds() {
  const e = window.location.pathname.split(`/workspace/${qi}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function pi() {
  window.dispatchEvent(new CustomEvent(Ca));
}
const wc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: nt,
  SECTION_PATHNAME: Fa,
  TEMPLATES_CHANGED_EVENT: Ca,
  TEMPLATE_ENTITY_TYPE: qi,
  cancelJob: yn,
  createTemplate: Zo,
  deleteFont: hn,
  deleteTemplate: en,
  duplicateTemplate: tn,
  exportTemplate: an,
  fetchDocumentTypes: _c,
  fetchFontFile: dn,
  fetchFonts: Pi,
  fetchHealth: Ka,
  fetchImageInfo: js,
  fetchJob: gn,
  fetchLayout: Gs,
  fetchPreview: Hs,
  fetchProperties: pn,
  fetchSampleContent: mn,
  fetchSyncStatus: bn,
  fetchTemplate: Jo,
  fetchTemplates: Vs,
  fetchUsage: vn,
  hrefForCreate: Va,
  hrefForDashboard: $n,
  hrefForTemplate: ci,
  importFromAppSettings: on,
  importTemplate: sn,
  notifyTemplatesChanged: pi,
  refreshFont: cn,
  regenerateDocument: Ba,
  regenerateTemplate: fn,
  registerFontPath: rn,
  registerWebFont: ln,
  runSyncExport: _n,
  runSyncImport: wn,
  templateKeyFromLocation: ds,
  updateFont: un,
  updateTemplate: Qo,
  uploadFont: nn
}, Symbol.toStringTag, { value: "Module" })), Ha = () => crypto.randomUUID();
function Ga(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function xn(e, t, i) {
  const { x: a, y: s } = Ga(e);
  return {
    type: "text",
    key: Ha(),
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
function kn(e, t, i) {
  const { x: a, y: s } = Ga(e);
  return {
    type: "image",
    key: Ha(),
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
function Sn(e, t, i) {
  const { x: a, y: s } = Ga(e);
  return {
    type: "badges",
    key: Ha(),
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
function $c(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = Ga(e);
  return {
    type: "rect",
    key: Ha(),
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
function xc(e) {
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
function kc(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (xc(e.classification)) {
    case "image":
      return { kind: "layer", layer: kn(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: Sn(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: xn(t, e.name, Sc(e)) };
  }
}
function Sc(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Tc(e) {
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
const Tn = [
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
function ps(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return Tn[a * 3 + i];
}
function ja(e, t, i) {
  return {
    x: e.x - t * zi(e.anchor),
    y: e.y - i * Mi(e.anchor)
  };
}
function Xs(e, t, i, a, s) {
  return {
    x: e + i * zi(s),
    y: t + a * Mi(s)
  };
}
function Cc(e, t, i, a) {
  const s = ja(e, t, i), o = Xs(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function Ec(e, t) {
  const i = Xs(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Cn(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Kt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), h = e - i, f = t - a;
  return { x: i + h * n - f * l, y: a + h * l + f * n };
}
function Dc(e, t, i, a, s) {
  return Kt(e, t, i, a, -s);
}
function En(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Kt(e.x, e.y, t, i, a),
    Kt(e.x + e.width, e.y, t, i, a),
    Kt(e.x + e.width, e.y + e.height, t, i, a),
    Kt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((f) => f.x)), n = Math.max(...s.map((f) => f.x)), l = Math.min(...s.map((f) => f.y)), h = Math.max(...s.map((f) => f.y));
  return { x: o, y: l, width: n - o, height: h - l };
}
const Pc = 10;
function ze(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Dn(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Ea(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Mo(e) {
  return e === "below" || e === "above";
}
function Oo(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function zc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Mc(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = Oo(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...Oo(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Oc(e, t, i) {
  const a = e.position;
  if (!Dn(a)) return a;
  if (Mc(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = zi(a.anchor), l = Mi(a.anchor);
  const h = Io(e, a.relativeX, !1, t, i);
  h && (s = h.coordinate, n = h.factor);
  const f = Io(e, a.relativeY, !0, t, i);
  return f && (o = f.coordinate, l = f.factor), { x: s, y: o, anchor: ps(n, l) };
}
function Io(e, t, i, a, s) {
  if (!t || Mo(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let n = t.layerKey;
  for (; !o.has(n); ) {
    o.add(n);
    const l = a.get(n);
    if (!l) return;
    const h = s(n);
    if (h)
      switch (t.edge) {
        case "below":
          return { coordinate: h.y + h.height + t.gap, factor: 0 };
        case "above":
          return { coordinate: h.y - t.gap, factor: 1 };
        case "rightOf":
          return { coordinate: h.x + h.width + t.gap, factor: 0 };
        default:
          return { coordinate: h.x - t.gap, factor: 1 };
      }
    const f = i ? l.position.relativeY : l.position.relativeX;
    if (!f || Mo(f.edge) !== i) return;
    n = f.layerKey;
  }
}
function Ic(e, t, i) {
  const a = zc(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const h = s.get(l.key);
    if (h) return h;
    let f;
    o.has(l.key) ? f = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), f = Oc(l, a, (Xe) => {
      const Ae = a.get(Xe);
      return Ae && !i(Ae) ? n(Ae).extent : void 0;
    }), o.delete(l.key));
    const C = t(l), X = ja(f, C.width, C.height), ke = { x: X.x, y: X.y, width: C.width, height: C.height }, Ie = { position: f, box: ke, extent: En(ke, f.x, f.y, l.rotation ?? 0) };
    return s.set(l.key, Ie), Ie;
  };
  for (const l of e) n(l);
  return s;
}
function ms(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? ps(zi(i.anchor), Mi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? ps(zi(e.anchor), Mi(i.anchor)) : e.anchor
  };
}
var ne, Re, Te, tt;
class Ac {
  constructor(t = 100) {
    w(this, ne, []);
    w(this, Re, []);
    w(this, Te, 0);
    w(this, tt);
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
    c(this, Te) > 0 || (c(this, ne).push(structuredClone(t)), c(this, ne).length > this.limit && c(this, ne).shift(), _(this, Re, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Te) === 0 && _(this, tt, structuredClone(t)), as(this, Te)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Te) !== 0 && (as(this, Te)._--, !(c(this, Te) > 0) && (t && c(this, tt) !== void 0 && (c(this, ne).push(c(this, tt)), c(this, ne).length > this.limit && c(this, ne).shift(), _(this, Re, [])), _(this, tt, void 0)));
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
    _(this, ne, []), _(this, Re, []), _(this, Te, 0), _(this, tt, void 0);
  }
}
ne = new WeakMap(), Re = new WeakMap(), Te = new WeakMap(), tt = new WeakMap();
const Lc = "DynamicImages.Workspace.Template";
var Zt, it, $t, xt, Qt, ei, ti, kt, ii, We, ai, si, re, Gi, St, Ce, Tt, k, Pn, oi, ni, fs, gs, Le, ft, ys, vs;
class Rc extends cc {
  constructor(i) {
    super(i, Lc);
    w(this, k);
    w(this, Zt);
    w(this, it);
    w(this, $t);
    w(this, xt);
    w(this, Qt);
    w(this, ei);
    w(this, ti);
    w(this, kt);
    w(this, ii);
    w(this, We);
    w(this, ai);
    w(this, si);
    w(this, re);
    w(this, Gi);
    w(this, St);
    w(this, Ce);
    w(this, Tt);
    w(this, oi);
    w(this, ni);
    this._data = new uc(this), this.template = this._data.current, _(this, Zt, new bi([], (a) => a.key)), this.layers = c(this, Zt).asObservable(), _(this, it, new zo(void 0)), this.selectedLayerKey = c(this, it).asObservable(), _(this, $t, new bi([], (a) => a.alias)), this.properties = c(this, $t).asObservable(), _(this, xt, new bi([], (a) => a.key)), this.fonts = c(this, xt).asObservable(), _(this, Qt, new bi([], (a) => a.key)), this.serverBounds = c(this, Qt).asObservable(), _(this, ei, new bi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, ei).asObservable(), _(this, ti, new zo(void 0)), this.sampleContentKey = c(this, ti).asObservable(), _(this, kt, new oa(!0)), this.useSampleData = c(this, kt).asObservable(), _(this, ii, new pc(1)), this.zoom = c(this, ii).asObservable(), _(this, We, new oa(!0)), this.loading = c(this, We).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ai, new oa(!1)), this.canUndo = c(this, ai).asObservable(), _(this, si, new oa(!1)), this.canRedo = c(this, si).asObservable(), _(this, re, new Ac()), _(this, Ce, !1), _(this, Tt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, oi, async (a) => {
      const s = a.detail;
      if (c(this, Tt) || !(s != null && s.url) || !P(this, k, Pn).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await nc(this, rc), _(this, Tt, !0), window.history.pushState({}, "", s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, ni, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, Gi)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        path: "create",
        component: () => Promise.resolve().then(() => Lo),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Lo),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Be, (a) => {
      _(this, Gi, a);
    }), this.consumeContext(Ke, (a) => {
      _(this, St, a);
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
    c(this, We).setValue(!0), _(this, Ce, !1);
    try {
      const a = await Jo(i, this.getToken);
      P(this, k, ft).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await P(this, k, fs).call(this, a);
    } catch (a) {
      P(this, k, vs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, We).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    c(this, We).setValue(!0), _(this, Ce, !0), P(this, k, ft).call(this, Tc(i), { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await P(this, k, fs).call(this, this._data.getCurrent()), c(this, We).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    i && c(this, $t).setValue(await P(this, k, gs).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    c(this, xt).setValue(await Pi(this.getToken).catch(() => []));
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
        var l, h;
        let n = o.position;
        return ((l = Ea(n, "x")) == null ? void 0 : l.layerKey) === i && (n = ms(n, "x", a == null ? void 0 : a.get(o.key))), ((h = Ea(n, "y")) == null ? void 0 : h.layerKey) === i && (n = ms(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), c(this, it).getValue() === i && this.selectLayer(void 0);
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
      const o = [...s.layers], n = o.findIndex((h) => h.key === i);
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
    c(this, it).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, it).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, re).begin(i);
  }
  endTransaction(i = !0) {
    c(this, re).end(i), P(this, k, ys).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, re).undo(i);
    a && P(this, k, ft).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, re).redo(i);
    a && P(this, k, ft).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Qt).setValue(i);
  }
  setIssues(i) {
    c(this, ei).setValue(i);
  }
  setSampleContentKey(i) {
    c(this, ti).setValue(i), c(this, kt).setValue(!i);
  }
  setUseSampleData(i) {
    c(this, kt).setValue(i);
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
      const o = c(this, Ce) ? await Zo(i, this.getToken) : await Qo(i, this.getToken);
      P(this, k, ft).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Ce);
      _(this, Ce, !1), this.setIsNew(!1), pi(), (a = c(this, St)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, St)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", ci(o.template.key));
    } catch (o) {
      throw P(this, k, vs).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Tt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, oi)), window.removeEventListener("beforeunload", c(this, ni)), c(this, re).clear(), super.destroy();
  }
}
Zt = new WeakMap(), it = new WeakMap(), $t = new WeakMap(), xt = new WeakMap(), Qt = new WeakMap(), ei = new WeakMap(), ti = new WeakMap(), kt = new WeakMap(), ii = new WeakMap(), We = new WeakMap(), ai = new WeakMap(), si = new WeakMap(), re = new WeakMap(), Gi = new WeakMap(), St = new WeakMap(), Ce = new WeakMap(), Tt = new WeakMap(), k = new WeakSet(), /**
 * True when the new URL leaves this workspace. Switching between the four workspace views keeps
 * the workspace's own path as a prefix (`…/edit/<key>/view/<pathname>`), so this is false for
 * those and the editor is never prompted for moving between Design and Preview & test.
 *
 * Core has the same one-liner as a protected method on `UmbEntityDetailWorkspaceContextBase`.
 * There is no exported helper for it, so it is inlined rather than reached for.
 */
Pn = function(i) {
  return !i.includes(this.routes.getActiveLocalPath());
}, oi = new WeakMap(), ni = new WeakMap(), fs = async function(i) {
  const [a, s] = await Promise.all([
    Pi(this.getToken).catch(() => []),
    P(this, k, gs).call(this, i.docTypeAliases)
  ]);
  c(this, xt).setValue(a), c(this, $t).setValue(s);
}, gs = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => pn(o, this.getToken).catch(() => []))
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
  P(this, k, ft).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
ft = function(i, a) {
  a != null && a.resetHistory && c(this, re).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Zt).setValue(i.layers), P(this, k, ys).call(this);
}, ys = function() {
  c(this, ai).setValue(c(this, re).canUndo), c(this, si).setValue(c(this, re).canRedo);
}, vs = function(i, a) {
  var o;
  const s = a instanceof nt ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, St)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const Wt = new dc(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Wc = [
  // ---------------------------------------------------------------- sidebar
  //
  // The sidebar app, the menu and the Fonts/Health link items are NOT here - they live in
  // wwwroot/App_Plugins/DynamicImages/umbraco-package.json, which Umbraco reads before this
  // bundle loads, so the section chrome paints immediately rather than after the entry point
  // has downloaded. None of them needs an element, so nothing is lost by moving them.
  //
  // This one stays, because it has an element and so benefits from the compile-time safety the
  // comment above argues for.
  {
    type: "menuItem",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    element: () => Promise.resolve().then(() => qc),
    weight: 200,
    meta: { label: "Templates", menus: ["DynamicImages.Menu"] }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => eu),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => cu),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => pu),
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
    api: Rc,
    meta: { entityType: qi }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => _h),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => kh),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Eh),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Oh),
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
    api: () => Promise.resolve().then(() => Ih),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Lh),
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
    api: () => Promise.resolve().then(() => Rh),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Wh),
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
    element: () => Promise.resolve().then(() => Bh)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => Yh)
  }
], dd = (e, t) => {
  t.registerMany(Wc);
};
var Nc = Object.defineProperty, Uc = Object.getOwnPropertyDescriptor, zn = (e) => {
  throw TypeError(e);
}, Ys = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Uc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Nc(t, i, s), s;
}, qs = (e, t, i) => t.has(e) || zn("Cannot " + i), Fc = (e, t, i) => (qs(e, t, "read from private field"), t.get(e)), Ao = (e, t, i) => t.has(e) ? zn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Bc = (e, t, i, a) => (qs(e, t, "write to private field"), t.set(e, i), i), Kc = (e, t, i) => (qs(e, t, "access private method"), i), Da, bs, Mn;
let Mt = class extends N {
  constructor() {
    super(), Ao(this, bs), Ao(this, Da), this._name = "", this._loading = !0, this.consumeContext(Wt, (e) => {
      Bc(this, Da, e), e && (this.observe(e.template, (t) => {
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
            @input=${Kc(this, bs, Mn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : m}
    `;
  }
};
Da = /* @__PURE__ */ new WeakMap();
bs = /* @__PURE__ */ new WeakSet();
Mn = function(e) {
  var i;
  const t = e.target.value;
  (i = Fc(this, Da)) == null || i.updateTemplateFields({ name: t });
};
Mt.styles = A`
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
Ys([
  p()
], Mt.prototype, "_name", 2);
Ys([
  p()
], Mt.prototype, "_loading", 2);
Mt = Ys([
  L("di-template-editor")
], Mt);
const Vc = Mt, Lo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Mt;
  },
  default: Vc
}, Symbol.toStringTag, { value: "Module" }));
var Hc = Object.defineProperty, Gc = Object.getOwnPropertyDescriptor, On = (e) => {
  throw TypeError(e);
}, mi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Hc(t, i, s), s;
}, Js = (e, t, i) => t.has(e) || On("Cannot " + i), vt = (e, t, i) => (Js(e, t, "read from private field"), t.get(e)), _i = (e, t, i) => t.has(e) ? On("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), jc = (e, t, i, a) => (Js(e, t, "write to private field"), t.set(e, i), i), ca = (e, t, i) => (Js(e, t, "access private method"), i), ua, Pa, ha, da, Vt, _s, In, An;
let Me = class extends N {
  constructor() {
    super(), _i(this, Vt), _i(this, ua), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = ds(), this._expanded = !0, _i(this, Pa, () => {
      var e;
      return (e = vt(this, ua)) == null ? void 0 : e.getLatestToken();
    }), _i(this, ha, () => {
      this._activeKey = ds();
    }), _i(this, da, () => {
      ca(this, Vt, _s).call(this);
    }), this.consumeContext(Be, (e) => {
      jc(this, ua, e), e && ca(this, Vt, _s).call(this);
    }), window.addEventListener("changestate", vt(this, ha)), window.addEventListener(Ca, vt(this, da));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("changestate", vt(this, ha)), window.removeEventListener(Ca, vt(this, da));
  }
  render() {
    return r`
      <uui-menu-item
        label="Templates"
        has-children
        ?loading=${this._loading}
        ?show-children=${this._expanded}
        @show-children=${() => {
      this._expanded = !0;
    }}
        @hide-children=${() => {
      this._expanded = !1;
    }}>
        <uui-icon slot="icon" name="icon-brush"></uui-icon>
        ${ca(this, Vt, In).call(this)}
      </uui-menu-item>
    `;
  }
};
ua = /* @__PURE__ */ new WeakMap();
Pa = /* @__PURE__ */ new WeakMap();
ha = /* @__PURE__ */ new WeakMap();
da = /* @__PURE__ */ new WeakMap();
Vt = /* @__PURE__ */ new WeakSet();
_s = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Vs(vt(this, Pa)),
      Ka(vt(this, Pa)).catch(() => {
      })
    ]);
    this._templates = e, this._issuesByTemplate = Xc((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
In = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${B(
    this._templates,
    (e) => e.key,
    (e) => ca(this, Vt, An).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${Va()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
An = function(e) {
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
mi([
  p()
], Me.prototype, "_templates", 2);
mi([
  p()
], Me.prototype, "_issuesByTemplate", 2);
mi([
  p()
], Me.prototype, "_loading", 2);
mi([
  p()
], Me.prototype, "_activeKey", 2);
mi([
  p()
], Me.prototype, "_expanded", 2);
Me = mi([
  L("di-templates-menu-item")
], Me);
function Xc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const Yc = Me, qc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return Me;
  },
  default: Yc
}, Symbol.toStringTag, { value: "Module" }));
var Jc = Object.defineProperty, Zc = Object.getOwnPropertyDescriptor, Ln = (e) => {
  throw TypeError(e);
}, ht = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Jc(t, i, s), s;
}, Zs = (e, t, i) => t.has(e) || Ln("Cannot " + i), De = (e, t, i) => (Zs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), na = (e, t, i) => t.has(e) ? Ln("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ro = (e, t, i, a) => (Zs(e, t, "write to private field"), t.set(e, i), i), S = (e, t, i) => (Zs(e, t, "access private method"), i), pa, za, Pe, x, fi, pe, Rn, Wn, Nn, Un, Fn, Bn, Kn, wi, Vn, Hn, Gn, jn, Xn;
let me = class extends N {
  constructor() {
    super(), na(this, x), na(this, pa), na(this, za), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, na(this, Pe, () => {
      var e;
      return (e = De(this, pa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ke, (e) => {
      Ro(this, za, e);
    }), this.consumeContext(Be, (e) => {
      Ro(this, pa, e), e && S(this, x, fi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${S(this, x, Bn).call(this)} ${S(this, x, Kn).call(this)} ${S(this, x, Vn).call(this)} ${S(this, x, Hn).call(this)}
      </umb-body-layout>
    `;
  }
};
pa = /* @__PURE__ */ new WeakMap();
za = /* @__PURE__ */ new WeakMap();
Pe = /* @__PURE__ */ new WeakMap();
x = /* @__PURE__ */ new WeakSet();
fi = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Vs(De(this, Pe)),
      Pi(De(this, Pe)).catch(() => []),
      Ka(De(this, Pe)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    S(this, x, pe).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
pe = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = De(this, za)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Rn = async function() {
  this._importing = !0;
  try {
    const e = await on(De(this, Pe));
    S(this, x, pe).call(this, e.created.length > 0 ? "positive" : "warning", e.created.length > 0 ? `Imported ${e.created.length} template(s)` : "Nothing was imported");
    for (const t of e.warnings.slice(0, 5)) S(this, x, pe).call(this, "warning", t);
    pi(), await S(this, x, fi).call(this);
  } catch (e) {
    S(this, x, pe).call(this, "danger", "The import failed", e);
  } finally {
    this._importing = !1;
  }
};
Wn = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await sn(this._pasteJson, "create", De(this, Pe)), S(this, x, pe).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, pi(), await S(this, x, fi).call(this);
    } catch (e) {
      S(this, x, pe).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
Nn = async function(e) {
  try {
    await tn(e.key, De(this, Pe)), S(this, x, pe).call(this, "positive", `'${e.name}' duplicated`), pi(), await S(this, x, fi).call(this);
  } catch (t) {
    S(this, x, pe).call(this, "danger", "The template could not be duplicated", t);
  }
};
Un = async function(e) {
  await Ks(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await en(e.key, De(this, Pe)), S(this, x, pe).call(this, "positive", `'${e.name}' deleted`), pi(), await S(this, x, fi).call(this);
  } catch (t) {
    S(this, x, pe).call(this, "danger", "The template could not be deleted", t);
  }
};
Fn = async function(e) {
  try {
    const t = await an(e.key, De(this, Pe)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    S(this, x, pe).call(this, "danger", "The template could not be exported", t);
  }
};
Bn = function() {
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
            @click=${S(this, x, Rn)}>
            Import from appsettings
          </uui-button>
        </div>
      </uui-box>
    `;
};
Kn = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${S(this, x, wi).call(this, "Templates", this._templates.length, "icon-brush")}
        ${S(this, x, wi).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${S(this, x, wi).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${S(this, x, wi).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
wi = function(e, t, i, a = !1) {
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        <uui-icon name=${i}></uui-icon>
        <div class="stat-value">${t}</div>
        <div class="stat-label">${e}</div>
      </uui-box>
    `;
};
Vn = function() {
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
        <uui-button look="secondary" href=${$n("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Hn = function() {
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
          <uui-button look="primary" color="positive" href=${Va()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? S(this, x, Gn).call(this) : m}
        ${this._templates.length === 0 ? S(this, x, jn).call(this) : S(this, x, Xn).call(this)}
      </uui-box>
    `;
};
Gn = function() {
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
          @click=${S(this, x, Wn)}>
          Import
        </uui-button>
      </div>
    `;
};
jn = function() {
  return r`
      <div class="empty">
        <uui-icon name="icon-brush"></uui-icon>
        <h4>No templates yet</h4>
        <p>A template says which document types get a generated image, and what it looks like.</p>
        <uui-button look="primary" color="positive" href=${Va()} label="Create your first template">
          Create your first template
        </uui-button>
      </div>
    `;
};
Xn = function() {
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
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => S(this, x, Nn).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => S(this, x, Fn).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => S(this, x, Un).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
me.styles = A`
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
ht([
  p()
], me.prototype, "_templates", 2);
ht([
  p()
], me.prototype, "_fonts", 2);
ht([
  p()
], me.prototype, "_health", 2);
ht([
  p()
], me.prototype, "_loading", 2);
ht([
  p()
], me.prototype, "_importing", 2);
ht([
  p()
], me.prototype, "_pasteJson", 2);
ht([
  p()
], me.prototype, "_showPaste", 2);
me = ht([
  L("di-overview-dashboard")
], me);
const Qc = me, eu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return me;
  },
  default: Qc
}, Symbol.toStringTag, { value: "Module" })), ws = /* @__PURE__ */ new Map(), Xa = (e) => `di-${e}`;
function tu(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = ws.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await dn(e, t), o = new FontFace(Xa(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return ws.set(e, a), a;
}
async function Yn(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => tu(a, t)));
}
function qn(e) {
  ws.delete(e);
}
const iu = new Xo(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), au = new Xo(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var su = Object.defineProperty, ou = Object.getOwnPropertyDescriptor, Jn = (e) => {
  throw TypeError(e);
}, Ya = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ou(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && su(t, i, s), s;
}, Qs = (e, t, i) => t.has(e) || Jn("Cannot " + i), we = (e, t, i) => (Qs(e, t, "read from private field"), t.get(e)), Nt = (e, t, i) => t.has(e) ? Jn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $i = (e, t, i, a) => (Qs(e, t, "write to private field"), t.set(e, i), i), W = (e, t, i) => (Qs(e, t, "access private method"), i), ma, Oi, Ii, Ot, Ti, O, gi, rt, $s, Zn, Qn, fa, er, tr, ir;
function nu(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : ru(e.sourceUrl);
    default:
      return "Media library";
  }
}
function ru(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let lt = class extends N {
  constructor() {
    super(), Nt(this, O), Nt(this, ma), Nt(this, Oi), Nt(this, Ii), this._fonts = [], this._loading = !0, Nt(this, Ot, () => {
      var e;
      return (e = we(this, ma)) == null ? void 0 : e.getLatestToken();
    }), Nt(this, Ti, !1), this.consumeContext(Ua, (e) => {
      $i(this, Oi, e);
    }), this.consumeContext(Ke, (e) => {
      $i(this, Ii, e);
    }), this.consumeContext(Be, (e) => {
      $i(this, ma, e), e && W(this, O, gi).call(this);
    });
  }
  updated(e) {
    var i;
    if (super.updated(e), !we(this, Ti)) return;
    $i(this, Ti, !1);
    const t = this.renderRoot.querySelectorAll(".style-name");
    (i = t[t.length - 1]) == null || i.focus();
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${W(this, O, $s)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${W(this, O, $s)}>
                  Add your first font
                </uui-button>
              </div>` : r`${B(this._fonts, (e) => e.key, (e) => W(this, O, er).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
ma = /* @__PURE__ */ new WeakMap();
Oi = /* @__PURE__ */ new WeakMap();
Ii = /* @__PURE__ */ new WeakMap();
Ot = /* @__PURE__ */ new WeakMap();
Ti = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
gi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Pi(we(this, Ot)), await Yn(this._fonts.map((e) => e.key), we(this, Ot));
  } catch (e) {
    W(this, O, rt).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
rt = function(e, t, i) {
  var s;
  const a = i instanceof nt ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = we(this, Ii)) == null || s.peek(e, { data: { headline: t, message: a } });
};
$s = async function() {
  var i, a;
  if (!we(this, Oi)) return;
  const e = we(this, Oi).open(this, au, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = we(this, Ii)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await W(this, O, gi).call(this));
};
Zn = async function(e) {
  try {
    await cn(e.key, we(this, Ot)), qn(e.key), W(this, O, rt).call(this, "positive", `'${e.familyName}' refreshed`), await W(this, O, gi).call(this);
  } catch (t) {
    W(this, O, rt).call(this, "danger", "That font could not be refreshed", t);
  }
};
Qn = async function(e) {
  await Ks(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await hn(e.key, we(this, Ot)), qn(e.key), W(this, O, rt).call(this, "positive", `'${e.familyName}' deleted`), await W(this, O, gi).call(this);
  } catch (t) {
    W(this, O, rt).call(this, "danger", "That font could not be deleted", t);
  }
};
fa = async function(e, t, i, a) {
  try {
    await un(e.key, t, i, we(this, Ot), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), W(this, O, rt).call(this, "positive", `'${t}' saved`), await W(this, O, gi).call(this), a != null && a.keepOpen && $i(this, Ti, !0);
  } catch (s) {
    W(this, O, rt).call(this, "danger", "The font could not be saved", s);
  }
};
er = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${nu(e)} · weight ${e.weight}
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
                  @click=${() => W(this, O, Zn).call(this, e)}>
                  Refresh
                </uui-button>` : m}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => W(this, O, Qn).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Xa(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? W(this, O, ir).call(this, e) : W(this, O, tr).call(this, e)}
      </div>
    `;
};
tr = function(e) {
  return e.styles.length === 0 ? m : r`<div class="tags">
      ${B(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
ir = function(e) {
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
          ${B(
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
      t.splice(a, 1), W(this, O, fa).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), W(this, O, fa).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    W(this, O, fa).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
lt.styles = A`
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
Ya([
  p()
], lt.prototype, "_fonts", 2);
Ya([
  p()
], lt.prototype, "_loading", 2);
Ya([
  p()
], lt.prototype, "_editingKey", 2);
lt = Ya([
  L("di-fonts-dashboard")
], lt);
const lu = lt, cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return lt;
  },
  default: lu
}, Symbol.toStringTag, { value: "Module" }));
var uu = Object.defineProperty, hu = Object.getOwnPropertyDescriptor, ar = (e) => {
  throw TypeError(e);
}, Ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && uu(t, i, s), s;
}, eo = (e, t, i) => t.has(e) || ar("Cannot " + i), Ze = (e, t, i) => (eo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ra = (e, t, i) => t.has(e) ? ar("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Wo = (e, t, i, a) => (eo(e, t, "write to private field"), t.set(e, i), i), Ht = (e, t, i) => (eo(e, t, "access private method"), i), ga, Gt, ui, at, Ma, xs, sr;
let Ue = class extends N {
  constructor() {
    super(), ra(this, at), ra(this, ga), ra(this, Gt), this._loading = !0, this._busy = !1, ra(this, ui, () => {
      var e;
      return (e = Ze(this, ga)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ke, (e) => {
      Wo(this, Gt, e);
    }), this.consumeContext(Be, (e) => {
      Wo(this, ga, e), e && Ht(this, at, Ma).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Ht(this, at, Ma).call(this)}>Re-check</uui-button>
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

        ${Ht(this, at, sr).call(this)}
      </umb-body-layout>
    `;
  }
};
ga = /* @__PURE__ */ new WeakMap();
Gt = /* @__PURE__ */ new WeakMap();
ui = /* @__PURE__ */ new WeakMap();
at = /* @__PURE__ */ new WeakSet();
Ma = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Ka(Ze(this, ui)),
      bn(Ze(this, ui)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
xs = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await _n(Ze(this, ui)) : await wn(Ze(this, ui));
    (t = Ze(this, Gt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Ze(this, Gt)) == null || i.peek("warning", { data: { message: o } });
    await Ht(this, at, Ma).call(this);
  } catch (s) {
    (a = Ze(this, Gt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
sr = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Ht(this, at, xs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Ht(this, at, xs).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : m;
};
Ue.styles = A`
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
Ji([
  p()
], Ue.prototype, "_health", 2);
Ji([
  p()
], Ue.prototype, "_sync", 2);
Ji([
  p()
], Ue.prototype, "_loading", 2);
Ji([
  p()
], Ue.prototype, "_busy", 2);
Ue = Ji([
  L("di-health-dashboard")
], Ue);
const du = Ue, pu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Ue;
  },
  default: du
}, Symbol.toStringTag, { value: "Module" }));
function mu(e, t) {
  const i = [], a = t.lockX ? void 0 : No(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    fu(t),
    t.threshold
  ), s = t.lockY ? void 0 : No(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    gu(t),
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
function fu(e) {
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
function gu(e) {
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
function No(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
const or = 3, nr = 12, rr = 0.1, lr = 0.9;
function yu(e) {
  return Math.max(or, Math.min(nr, e));
}
function vu(e) {
  return Math.max(rr, Math.min(lr, e));
}
function bu(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = yu(t), s = 0.5 * vu(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let h = 0; h < o; h++) {
    const f = (-90 + h * n) * Math.PI / 180, C = e === "star" && h % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + C * Math.cos(f), y: 0.5 + C * Math.sin(f) });
  }
  return l;
}
function _u(e, t, i) {
  const a = bu(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
var wu = Object.defineProperty, $u = Object.getOwnPropertyDescriptor, cr = (e) => {
  throw TypeError(e);
}, Ve = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $u(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && wu(t, i, s), s;
}, to = (e, t, i) => t.has(e) || cr("Cannot " + i), ve = (e, t, i) => (to(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ss = (e, t, i) => t.has(e) ? cr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), os = (e, t, i, a) => (to(e, t, "write to private field"), t.set(e, i), i), j = (e, t, i) => (to(e, t, "access private method"), i), gt, xi, M, qa, io, ur, hr, dr, pr, ao, Oa, mr, fr, gr, yr, vr, br, _r, wr, $r;
const xu = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], ns = 18;
let $e = class extends N {
  constructor() {
    super(...arguments), ss(this, M), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, ss(this, gt), ss(this, xi);
  }
  willUpdate() {
    this._box = j(this, M, ur).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ve(this, xi) && ((t = ve(this, gt)) == null || t.disconnect(), os(this, xi, e), e && (ve(this, gt) ?? os(this, gt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ve(this, gt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ve(this, gt)) == null || e.disconnect(), os(this, xi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return m;
    const e = this._box;
    return r`
      <div
        class=${jo({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${V({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ve(this, M, hr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...j(this, M, ao).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      j(this, M, mr).call(this, t), j(this, M, Oa).call(this, t);
    }}>
        ${j(this, M, fr).call(this)}
      </div>

      ${this.selected ? j(this, M, wr).call(this, e) : m}
      ${this.showMeasured && this.measured ? j(this, M, $r).call(this) : m}
    `;
  }
};
gt = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
qa = function() {
  return this.resolvedPosition ?? this.layer.position;
};
io = function() {
  return this.layer.rotation ?? 0;
};
ur = function() {
  var s;
  const e = this.layer, t = e.size.width ?? j(this, M, dr).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? j(this, M, pr).call(this), a = ja(ve(this, M, qa), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
hr = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
dr = function() {
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
pr = function() {
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
ao = function(e) {
  const t = ve(this, M, io);
  if (t === 0) return {};
  const i = ve(this, M, qa);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Oa = function(e, t) {
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
mr = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
fr = function() {
  switch (this.layer.type) {
    case "text":
      return j(this, M, gr).call(this);
    case "image":
      return j(this, M, vr).call(this);
    case "badges":
      return j(this, M, br).call(this);
    default:
      return j(this, M, _r).call(this);
  }
};
gr = function() {
  if (this.layer.type !== "text") return m;
  const e = this.layer.style, t = this.resolvedText || j(this, M, yr).call(this);
  return r`
      <div
        class="text"
        style=${V({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Xa(e.fontKey)}, sans-serif`,
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
yr = function() {
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
vr = function() {
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
br = function() {
  if (this.layer.type !== "badges") return m;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", h = l && o, f = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${V({
    flexDirection: l ? "row" : "column",
    flexWrap: h ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...h ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${B(
    Array.from({ length: Math.max(1, a) }, (C, X) => X),
    (C) => C,
    () => r`
            <div class=${jo({ badge: !0, right: f === "right" })}>
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
      fontFamily: `${Xa(t.fontKey)}, sans-serif`,
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
_r = function() {
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
  const n = _u(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${V({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${V({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
wr = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = ve(this, M, qa), n = ve(this, M, io), l = ze(this.layer.position, "x") || ze(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${V({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...j(this, M, ao).call(this, e) })}>
        <span
          class="tag"
          style=${V(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : m}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? m : r`
              ${B(
    xu,
    (h) => h,
    (h) => r`
                  <span
                    class="handle ${h}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${h}"
                    @pointerdown=${(f) => j(this, M, Oa).call(this, f, h)}>
                  </span>
                `
  )}
              <span class="stalk" style=${V({ height: `${ns}px`, top: `${-ns}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${V({ top: `${-ns}px` })}
                @pointerdown=${(h) => j(this, M, Oa).call(this, h, "rotate")}>
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
$r = function() {
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
$e.styles = A`
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
Ve([
  b({ type: Object })
], $e.prototype, "layer", 2);
Ve([
  b({ type: Number })
], $e.prototype, "scale", 2);
Ve([
  b({ type: Boolean, reflect: !0 })
], $e.prototype, "selected", 2);
Ve([
  b({ type: Object })
], $e.prototype, "measured", 2);
Ve([
  b({ type: Boolean })
], $e.prototype, "showMeasured", 2);
Ve([
  b({ type: String })
], $e.prototype, "resolvedText", 2);
Ve([
  b({ attribute: !1 })
], $e.prototype, "resolvedPosition", 2);
Ve([
  p()
], $e.prototype, "_box", 2);
$e = Ve([
  L("di-layer-box")
], $e);
var ku = Object.defineProperty, Su = Object.getOwnPropertyDescriptor, xr = (e) => {
  throw TypeError(e);
}, so = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Su(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ku(t, i, s), s;
}, Tu = (e, t, i) => t.has(e) || xr("Cannot " + i), Cu = (e, t, i) => t.has(e) ? xr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Eu = (e, t, i) => (Tu(e, t, "access private method"), i), ks, kr;
let Ai = class extends N {
  constructor() {
    super(...arguments), Cu(this, ks), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${B(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => Eu(this, ks, kr).call(this, e)
    )}`;
  }
};
ks = /* @__PURE__ */ new WeakSet();
kr = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Ai.styles = A`
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
so([
  b({ type: Array })
], Ai.prototype, "guides", 2);
so([
  b({ type: Number })
], Ai.prototype, "scale", 2);
Ai = so([
  L("di-guides")
], Ai);
var Du = Object.defineProperty, Pu = Object.getOwnPropertyDescriptor, Sr = (e) => {
  throw TypeError(e);
}, Zi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Pu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Du(t, i, s), s;
}, zu = (e, t, i) => t.has(e) || Sr("Cannot " + i), Mu = (e, t, i) => t.has(e) ? Sr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Uo = (e, t, i) => (zu(e, t, "access private method"), i), ya, Ss;
let Y = class extends N {
  constructor() {
    super(...arguments), Mu(this, ya), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Uo(this, ya, Ss).call(this, "top"), Uo(this, ya, Ss).call(this, "left");
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
ya = /* @__PURE__ */ new WeakSet();
Ss = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : Y.thickness) * o, t.height = (e === "top" ? Y.thickness : s) * o, t.style.width = `${e === "top" ? s : Y.thickness}px`, t.style.height = `${e === "top" ? Y.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const h = Math.round(l * this.scale) + 0.5, f = l % 100 === 0, C = f ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(h, Y.thickness - C), i.lineTo(h, Y.thickness)) : (i.moveTo(Y.thickness - C, h), i.lineTo(Y.thickness, h)), i.stroke(), f && l > 0 && (e === "top" ? i.fillText(String(l), h + 2, 9) : (i.save(), i.translate(9, h - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
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
Zi([
  b({ type: Number })
], Y.prototype, "canvasWidth", 2);
Zi([
  b({ type: Number })
], Y.prototype, "canvasHeight", 2);
Zi([
  b({ type: Number })
], Y.prototype, "scale", 2);
Zi([
  b({ type: Object })
], Y.prototype, "pointer", 2);
Y = Zi([
  L("di-rulers")
], Y);
var Ou = Object.defineProperty, Iu = Object.getOwnPropertyDescriptor, Tr = (e) => {
  throw TypeError(e);
}, ae = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Iu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ou(t, i, s), s;
}, oo = (e, t, i) => t.has(e) || Tr("Cannot " + i), I = (e, t, i) => (oo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), se = (e, t, i) => t.has(e) ? Tr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), va = (e, t, i, a) => (oo(e, t, "write to private field"), t.set(e, i), i), z = (e, t, i) => (oo(e, t, "access private method"), i), yt, ki, ot, E, no, Ts, Cs, Ja, ro, Es, Cr, Er, lo, Dr, Pr, Ds, ba, zr, Mr, Ft, co, Ps, zs, Ms, Or, Os, Is, As, Ir;
const Au = 6, Ar = 20, Lu = 15, Ru = 0.1;
let Z = class extends N {
  constructor() {
    super(...arguments), se(this, E), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, se(this, yt), se(this, ki), se(this, ot, /* @__PURE__ */ new Map()), se(this, Ds, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = z(this, E, ro).call(this, t), a = z(this, E, Es).call(this, t), s = z(this, E, Cr).call(this, t), o = z(this, E, Ja).call(this, e.detail.startX, e.detail.startY);
      va(this, yt, {
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
    }), se(this, ba, (e) => {
      var sa, Eo;
      this._pointer = z(this, E, Cs).call(this, e.clientX, e.clientY);
      const t = I(this, yt);
      if (!t) return;
      const i = this.template.layers.find((vi) => vi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        z(this, E, Mr).call(this, i, t, e);
        return;
      }
      const o = ze(i.position, "x"), n = ze(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        z(this, E, zr).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let h = t.handle ? z(this, E, co).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (h = { ...h, x: t.startBox.x, width: (sa = t.handle) != null && sa.includes("w") ? t.startBox.width : h.width }), n && (h = { ...h, y: t.startBox.y, height: (Eo = t.handle) != null && Eo.includes("n") ? t.startBox.height : h.height });
      const f = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, C = l !== 0 ? { x: h.x + f.x, y: h.y + f.y, width: t.startExtent.width, height: t.startExtent.height } : h, ke = this.snapEnabled && !e.altKey ? mu(C, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((vi) => vi.key !== i.key).map((vi) => z(this, E, Es).call(this, vi)),
        threshold: Au / this.scale,
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
      this._guides = ke.guides;
      const Ie = l !== 0 ? { ...h, x: ke.box.x - f.x, y: ke.box.y - f.y } : ke.box, Xe = Ec(Ie, i.position);
      o && (Xe.x = i.position.x), n && (Xe.y = i.position.y);
      const Ae = { position: Xe };
      t.handle && (Ae.size = {
        width: Math.max(1, Math.round(Ie.width)),
        height: Math.max(1, Math.round(Ie.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Ae } })
      );
    }), se(this, Ft, () => {
      if (!I(this, yt)) return;
      const e = I(this, yt).moved;
      va(this, yt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), se(this, Ps, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), se(this, zs, () => {
      this._dropTarget = !1;
    }), se(this, Ms, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = z(this, E, Cs).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: z(this, E, Or).call(this, e) }
        })
      );
    }), se(this, Os, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), se(this, Is, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Dn(t.position)) && this.requestUpdate();
    }), se(this, As, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), va(this, ki, new ResizeObserver(() => z(this, E, Ts).call(this))), I(this, ki).observe(this), window.addEventListener("pointermove", I(this, ba)), window.addEventListener("pointerup", I(this, Ft)), window.addEventListener("pointercancel", I(this, Ft));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = I(this, ki)) == null || e.disconnect(), window.removeEventListener("pointermove", I(this, ba)), window.removeEventListener("pointerup", I(this, Ft)), window.removeEventListener("pointercancel", I(this, Ft));
  }
  updated(e) {
    z(this, E, Ts).call(this), e.has("zoom") && z(this, E, no).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = I(this, ot).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return m;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    z(this, E, Er).call(this);
    const s = this.showRulers ? Ar : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${I(this, Os)}
        @dragover=${I(this, Ps)}
        @dragleave=${I(this, zs)}
        @drop=${I(this, Ms)}
        @di-layer-drag-start=${I(this, Ds)}
        @di-layer-box-resize=${I(this, Is)}>
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
            @pointerdown=${I(this, As)}
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
                  .resolvedPosition=${(l = I(this, ot).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? z(this, E, Ir).call(this) : m}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
yt = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakMap();
ot = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
no = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Ts = function() {
  const e = this.renderRoot.querySelector(".viewport");
  if (!e || !this.template) return;
  const t = 48 + (this.showRulers ? Ar : 0), i = {
    width: Math.max(1, e.clientWidth - t),
    height: Math.max(1, e.clientHeight - t)
  }, a = Math.min(
    i.width / this.template.canvas.width,
    i.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(a - this._fitScale) > 1e-3 && (this._fitScale = a, z(this, E, no).call(this));
};
Cs = function(e, t) {
  const i = z(this, E, Ja).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Ja = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
ro = function(e) {
  const t = I(this, ot).get(e.key);
  if (t) return t.box;
  const i = z(this, E, lo).call(this, e), a = ja(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Es = function(e) {
  const t = I(this, ot).get(e.key);
  return t ? t.extent : En(z(this, E, ro).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Cr = function(e) {
  var t;
  return ((t = I(this, ot).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Er = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  va(this, ot, Ic(
    this.template.layers,
    (i) => z(this, E, lo).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
lo = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? z(this, E, Dr).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? z(this, E, Pr).call(this, e, i)
  };
};
Dr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Pr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Ds = /* @__PURE__ */ new WeakMap();
ba = /* @__PURE__ */ new WeakMap();
zr = function(e, t, i, a, s, o, n, l) {
  const h = t.startRotation, f = t.startPosition, C = Dc(a, s, 0, 0, h);
  let X = z(this, E, co).call(this, t.startBox, i, C.x, C.y, o);
  n && (X = { ...X, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : X.width }), l && (X = { ...X, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : X.height });
  const ke = Math.max(1, Math.round(X.width)), Ie = Math.max(1, Math.round(X.height)), Xe = Xs(X.x, X.y, ke, Ie, f.anchor), Ae = Kt(Xe.x, Xe.y, f.x, f.y, h), sa = {
    ...e.position,
    x: n ? e.position.x : Math.round(Ae.x),
    y: l ? e.position.y : Math.round(Ae.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: sa, size: { width: ke, height: Ie } } }
    })
  );
};
Mr = function(e, t, i) {
  const a = t.startPosition, s = z(this, E, Ja).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, h = i.shiftKey ? Lu : Ru, f = Cn(Math.round(l / h) * h);
  this._guides = [], f !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: f } }
    })
  );
};
Ft = /* @__PURE__ */ new WeakMap();
co = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: h } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, h = e.height - a), t.includes("s") && (h = e.height + a), s && e.width > 0 && e.height > 0) {
    const f = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(h - e.height) ? h = l / f : l = h * f, t.includes("n") && (n = e.y + e.height - h), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, h) };
};
Ps = /* @__PURE__ */ new WeakMap();
zs = /* @__PURE__ */ new WeakMap();
Ms = /* @__PURE__ */ new WeakMap();
Or = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Os = /* @__PURE__ */ new WeakMap();
Is = /* @__PURE__ */ new WeakMap();
As = /* @__PURE__ */ new WeakMap();
Ir = function() {
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
  b({ type: Object })
], Z.prototype, "template", 2);
ae([
  b({ type: String })
], Z.prototype, "selectedLayerKey", 2);
ae([
  b({ type: Object })
], Z.prototype, "baseImageUrl", 2);
ae([
  b({ type: Array })
], Z.prototype, "serverBounds", 2);
ae([
  b({ type: Boolean })
], Z.prototype, "showMeasured", 2);
ae([
  b({ type: Boolean })
], Z.prototype, "snapEnabled", 2);
ae([
  b({ type: Boolean })
], Z.prototype, "showRulers", 2);
ae([
  b({ type: Boolean })
], Z.prototype, "showSafeArea", 2);
ae([
  b({ type: Number })
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
var Wu = Object.defineProperty, Nu = Object.getOwnPropertyDescriptor, Lr = (e) => {
  throw TypeError(e);
}, uo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Nu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wu(t, i, s), s;
}, Rr = (e, t, i) => t.has(e) || Lr("Cannot " + i), Uu = (e, t, i) => (Rr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Fu = (e, t, i) => t.has(e) ? Lr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ee = (e, t, i) => (Rr(e, t, "access private method"), i), le, Wr, Nr, Ur, Fr, Br, bt;
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
let Li = class extends N {
  constructor() {
    super(...arguments), Fu(this, le), this.properties = [], this._search = "";
  }
  render() {
    const e = Bu(Uu(this, le, Wr));
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
      ([t, i]) => Ee(this, le, Fr).call(this, t, i)
    )}

        ${Ee(this, le, Br).call(this)}
      </div>
    `;
  }
};
le = /* @__PURE__ */ new WeakSet();
Wr = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Nr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Ur = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Fr = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${B(
    t,
    (i) => i.alias,
    (i) => Ee(this, le, bt).call(
      this,
      i.name,
      Fo[i.classification] ?? Fo.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Br = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Ee(this, le, bt).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Ee(this, le, bt).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Ee(this, le, bt).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Ee(this, le, bt).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Ee(this, le, bt).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
bt = function(e, t, i, a, s) {
  const o = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(n) => Ee(this, le, Ur).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => Ee(this, le, Nr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Li.styles = A`
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
uo([
  b({ type: Array })
], Li.prototype, "properties", 2);
uo([
  p()
], Li.prototype, "_search", 2);
Li = uo([
  L("di-property-palette")
], Li);
function Bu(e) {
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
var Ku = Object.defineProperty, Vu = Object.getOwnPropertyDescriptor, Kr = (e) => {
  throw TypeError(e);
}, Za = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Vu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ku(t, i, s), s;
}, Vr = (e, t, i) => t.has(e) || Kr("Cannot " + i), Qe = (e, t, i) => (Vr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Hu = (e, t, i) => t.has(e) ? Kr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ci = (e, t, i) => (Vr(e, t, "access private method"), i), te, Ri, Ei, Qa, Hr, Gr;
let hi = class extends N {
  constructor() {
    super(...arguments), Hu(this, te), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Qe(this, te, Ri)};opacity:${Qe(this, te, Ei)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Ci(this, te, Qa).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Qe(this, te, Ri)}
                  @input=${(e) => Ci(this, te, Hr).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Qe(this, te, Ei))}
                    @input=${(e) => Ci(this, te, Gr).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Qe(this, te, Ei) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
te = /* @__PURE__ */ new WeakSet();
Ri = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
Ei = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
Qa = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Hr = function(e) {
  const t = Qe(this, te, Ei);
  Ci(this, te, Qa).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${jr(t)}`);
};
Gr = function(e) {
  Ci(this, te, Qa).call(this, e >= 0.999 ? Qe(this, te, Ri).toUpperCase() : `${Qe(this, te, Ri).toUpperCase()}${jr(e)}`);
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
Za([
  b({ type: String })
], hi.prototype, "value", 2);
Za([
  b({ type: String })
], hi.prototype, "label", 2);
Za([
  p()
], hi.prototype, "_open", 2);
hi = Za([
  L("di-colour-input")
], hi);
const jr = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Gu = Object.defineProperty, ju = Object.getOwnPropertyDescriptor, Xr = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ju(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gu(t, i, s), s;
};
const Bo = {
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
let Ia = class extends N {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${B(
      Tn,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Bo[e]}
              title=${Bo[e]}
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
Ia.styles = A`
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
Xr([
  b({ type: String })
], Ia.prototype, "value", 2);
Ia = Xr([
  L("di-anchor-picker")
], Ia);
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
  sides: { min: or, max: nr },
  innerRatio: { min: rr, max: lr }
};
function Xu(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
var Yu = Object.defineProperty, qu = Object.getOwnPropertyDescriptor, Yr = (e) => {
  throw TypeError(e);
}, dt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Yu(t, i, s), s;
}, Ju = (e, t, i) => t.has(e) || Yr("Cannot " + i), Zu = (e, t, i) => t.has(e) ? Yr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Qu = (e, t, i) => (Ju(e, t, "access private method"), i), Ls, qr;
let Oe = class extends N {
  constructor() {
    super(...arguments), Zu(this, Ls), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${Qu(this, Ls, qr)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : m}
        </span>
      </label>
    `;
  }
};
Ls = /* @__PURE__ */ new WeakSet();
qr = function(e) {
  const t = e.target, i = t.value, a = Xu(i, this.min, this.max);
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
dt([
  b({ type: Number })
], Oe.prototype, "value", 2);
dt([
  b({ type: String })
], Oe.prototype, "label", 2);
dt([
  b({ type: String })
], Oe.prototype, "suffix", 2);
dt([
  b({ type: Number })
], Oe.prototype, "step", 2);
dt([
  b({ type: Number })
], Oe.prototype, "min", 2);
dt([
  b({ type: Number })
], Oe.prototype, "max", 2);
dt([
  b({ type: String })
], Oe.prototype, "placeholder", 2);
Oe = dt([
  L("di-number-field")
], Oe);
var eh = Object.defineProperty, th = Object.getOwnPropertyDescriptor, Jr = (e) => {
  throw TypeError(e);
}, Qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? th(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && eh(t, i, s), s;
}, ih = (e, t, i) => t.has(e) || Jr("Cannot " + i), ah = (e, t, i) => t.has(e) ? Jr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (ih(e, t, "access private method"), i), u, y, Ye, Zr, Qr, el, tl, il, al, sl, ol, Rs, nl, _a, rl, ll, yi, ho, cl;
let It = class extends N {
  constructor() {
    super(...arguments), ah(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? d(this, u, Qr).call(this, this.layer) : d(this, u, Zr).call(this)}</div>` : m;
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
Ye = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Zr = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => d(this, u, Ye).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => d(this, u, Ye).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Background</span>
          <di-colour-input
            label="Canvas background"
            .value=${e.background}
            @change=${(t) => d(this, u, Ye).call(this, { background: t.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${ul(e.baseImage.kind)}
              @change=${(t) => d(this, u, Ye).call(this, {
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
                @change=${(t) => d(this, u, Ye).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : m}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${d(this, u, yi).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, Ye).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : m}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${ie(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => d(this, u, Ye).call(this, { baseImageFit: t.target.value })}>
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
Qr = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, y).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, el).call(this, e) : m}
      ${e.type === "text" ? d(this, u, tl).call(this, e) : m}
      ${e.type === "image" ? d(this, u, il).call(this, e) : m}
      ${e.type === "badges" ? d(this, u, al).call(this, e) : m}
      ${e.type === "rect" ? d(this, u, sl).call(this, e) : m}
      ${d(this, u, ol).call(this, e)} ${d(this, u, ll).call(this, e)}
    `;
};
el = function(e) {
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
            @change=${(i) => d(this, u, y).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? r`<label class="field">
              <span>Property</span>
              ${d(this, u, yi).call(this, t.propertyAlias ?? "", (i) => d(this, u, y).call(this, { binding: { ...t, propertyAlias: i } }))}
            </label>` : m}

        ${t.kind === "date" ? r`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => d(this, u, y).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : m}

        ${t.kind === "static" || t.kind === "expression" ? r`<label class="field">
              <span>${t.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => d(this, u, y).call(this, {
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
              @change=${(i) => d(this, u, y).call(this, { prefix: i.target.value })}>
            </uui-input>
          </label>
          <label class="field">
            <span>Suffix</span>
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => d(this, u, y).call(this, { suffix: i.target.value })}>
            </uui-input>
          </label>
        </div>
      </uui-box>
    `;
};
tl = function(e) {
  const t = e.style, i = (a) => d(this, u, y).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, ho).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${d(this, u, cl).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
il = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${ul(t.kind)}
            @change=${(a) => d(this, u, y).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${d(this, u, yi).call(this, t.propertyAlias ?? "", (a) => d(this, u, y).call(this, { source: { ...t, propertyAlias: a } }), "media")}
            </label>` : m}

        ${t.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => d(this, u, y).call(this, {
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
            @change=${(a) => d(this, u, y).call(this, { fit: a.target.value })}>
          </uui-select>
        </label>

        <di-number-field
          .min=${g.cornerRadius.min}
          .max=${g.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => d(this, u, y).call(this, { cornerRadius: a.detail.value ?? 0 })}>
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
    d(this, u, y).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => d(this, u, y).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : m}
          </div>
        </label>
      </uui-box>
    `;
};
al = function(e) {
  const t = (s) => d(this, u, y).call(this, { badge: { ...e.badge, ...s } }), i = (s) => d(this, u, y).call(this, { label: { ...e.label, ...s } }), a = (s) => d(this, u, y).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${d(this, u, yi).call(this, e.itemsPropertyAlias, (s) => d(this, u, y).call(this, { itemsPropertyAlias: s }))}
        </label>

        <div class="pair">
          <di-number-field
            .min=${g.maxItems.min}
            .max=${g.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => d(this, u, y).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${g.gap.min}
            .max=${g.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => d(this, u, y).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${e.direction}
            .options=${ie(["horizontal", "vertical"], e.direction)}
            @change=${(s) => d(this, u, y).call(this, { direction: s.target.value })}>
          </uui-select>
        </label>

        ${e.direction === "horizontal" ? r`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => d(this, u, y).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </label>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${g.rowGap.min}
                      .max=${g.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => d(this, u, y).call(this, { rowGap: s.detail.value ?? 20 })}>
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
                  .options=${d(this, u, ho).call(this, e.label.fontKey)}
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
sl = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${ie(["rectangle", "ellipse", "polygon", "star"], t)}
            @change=${(s) => d(this, u, y).call(this, { shape: s.target.value })}>
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
                  @change=${(s) => d(this, u, y).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${g.innerRatio.min}
                      .max=${g.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => d(this, u, y).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : m}
              </div>
            ` : m}

        <label class="field inline">
          <span>Fill</span>
          <uui-toggle
            ?checked=${i}
            @change=${(s) => d(this, u, y).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </label>

        ${i ? r`<label class="field">
              <span>Fill colour</span>
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => d(this, u, y).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </label>` : m}

        <label class="field inline">
          <span>Gradient</span>
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => d(this, u, y).call(this, {
    gradient: s.target.checked ? { from: "#000000CC", to: "#00000000", angle: 180 } : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? r`
              <div class="pair">
                <di-colour-input
                  label="From"
                  .value=${e.gradient.from}
                  @change=${(s) => d(this, u, y).call(this, { gradient: { ...e.gradient, from: s.detail.value } })}>
                </di-colour-input>
                <di-colour-input
                  label="To"
                  .value=${e.gradient.to}
                  @change=${(s) => d(this, u, y).call(this, { gradient: { ...e.gradient, to: s.detail.value } })}>
                </di-colour-input>
              </div>
              <di-number-field
                .min=${g.gradientAngle.min}
                .max=${g.gradientAngle.max}
                label="Angle"
                suffix="°"
                .value=${e.gradient.angle}
                @change=${(s) => d(this, u, y).call(this, { gradient: { ...e.gradient, angle: s.detail.value ?? 180 } })}>
              </di-number-field>
            ` : m}

        ${t === "rectangle" ? r`<di-number-field
            .min=${g.cornerRadius.min}
            .max=${g.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => d(this, u, y).call(this, { cornerRadius: s.detail.value ?? 0 })}>
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
    d(this, u, y).call(this, {
      border: o > 0 ? { width: o, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => d(this, u, y).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : m}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </label>
      </uui-box>
    `;
};
ol = function(e) {
  const t = ze(e.position, "x"), i = ze(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${d(this, u, Rs).call(this, e, "x")} ${d(this, u, Rs).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => d(this, u, rl).call(this, e, s.detail.value)}>
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
            @change=${(s) => d(this, u, y).call(this, { rotation: Cn(s.detail.value ?? 0) })}>
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
            @change=${(s) => d(this, u, y).call(this, { size: { ...e.size, width: s.detail.value } })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => d(this, u, y).call(this, { size: { ...e.size, height: s.detail.value } })}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
Rs = function(e, t) {
  const i = ze(e.position, t), a = Ea(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => d(this, u, nl).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => d(this, u, _a).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${ie(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => d(this, u, _a).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${g.referenceGap.min}
                .max=${g.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => d(this, u, _a).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? g.x.min : g.y.min}
                .max=${t === "x" ? g.x.max : g.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => d(this, u, y).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
nl = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (ze(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && d(this, u, y).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Pc
      }
    }
  });
};
_a = function(e, t, i) {
  const a = Ea(e.position, t);
  a && d(this, u, y).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
rl = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? Cc(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, y).call(this, { position: s });
};
ll = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <label class="field inline">
          <span>Visible</span>
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => d(this, u, y).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </label>

        <label class="field inline">
          <span>Locked</span>
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => d(this, u, y).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </label>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${g.opacity.min}
          .max=${g.opacity.max}
          .value=${e.opacity}
          @change=${(t) => d(this, u, y).call(this, { opacity: t.detail.value ?? 1 })}>
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
            @change=${(t) => d(this, u, y).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </label>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<label class="field">
              <span>Controlled by</span>
              ${d(this, u, yi).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, y).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
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
ho = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
cl = function(e, t, i) {
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
It.styles = A`
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
Qi([
  b({ type: Object })
], It.prototype, "template", 2);
Qi([
  b({ type: Object })
], It.prototype, "layer", 2);
Qi([
  b({ type: Array })
], It.prototype, "properties", 2);
Qi([
  b({ type: Array })
], It.prototype, "fonts", 2);
It = Qi([
  L("di-layer-inspector")
], It);
function ie(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function ul(e) {
  return ie(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var sh = Object.defineProperty, oh = Object.getOwnPropertyDescriptor, hl = (e) => {
  throw TypeError(e);
}, ea = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? oh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && sh(t, i, s), s;
}, nh = (e, t, i) => t.has(e) || hl("Cannot " + i), rh = (e, t, i) => t.has(e) ? hl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Se = (e, t, i) => (nh(e, t, "access private method"), i), he, _t, dl, pl, ml, fl;
const lh = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let At = class extends N {
  constructor() {
    super(...arguments), rh(this, he), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Se(this, he, ml)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : B(
      e,
      (t) => t.key,
      (t, i) => Se(this, he, fl).call(this, t, i)
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
he = /* @__PURE__ */ new WeakSet();
_t = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
dl = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
pl = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
ml = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Se(this, he, _t).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
fl = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Se(this, he, dl).call(this, a, e.key)}
        @dragover=${(a) => Se(this, he, pl).call(this, a, t)}
        @click=${() => Se(this, he, _t).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${lh[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          look="secondary"
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, he, _t).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name=${e.isVisible ? "icon-eye" : "icon-eye-off"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, he, _t).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, he, _t).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, he, _t).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
At.styles = A`
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
ea([
  b({ type: Array })
], At.prototype, "layers", 2);
ea([
  b({ type: String })
], At.prototype, "selectedLayerKey", 2);
ea([
  p()
], At.prototype, "_dragKey", 2);
ea([
  p()
], At.prototype, "_dropIndex", 2);
At = ea([
  L("di-layers-panel")
], At);
var ch = Object.defineProperty, uh = Object.getOwnPropertyDescriptor, gl = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? uh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ch(t, i, s), s;
}, hh = (e, t, i) => t.has(e) || gl("Cannot " + i), dh = (e, t, i) => t.has(e) ? gl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fe = (e, t, i) => (hh(e, t, "access private method"), i), oe, qe, Si;
let xe = class extends N {
  constructor() {
    super(...arguments), dh(this, oe), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1;
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
            @click=${() => fe(this, oe, qe).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-remove"></uui-icon>
          </uui-button>
          <span class="value">${Math.round(this.effectiveScale * 100)}%</span>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => fe(this, oe, qe).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-add"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => fe(this, oe, qe).call(this, "di-zoom-fit")}>
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
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => fe(this, oe, qe).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => fe(this, oe, qe).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => fe(this, oe, qe).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
oe = /* @__PURE__ */ new WeakSet();
qe = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Si = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => fe(this, oe, qe).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
xe.styles = A`
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
He([
  b({ type: Number })
], xe.prototype, "effectiveScale", 2);
He([
  b({ type: Boolean })
], xe.prototype, "snapEnabled", 2);
He([
  b({ type: Boolean })
], xe.prototype, "showRulers", 2);
He([
  b({ type: Boolean })
], xe.prototype, "showSafeArea", 2);
He([
  b({ type: Boolean })
], xe.prototype, "showMeasured", 2);
He([
  b({ type: Boolean })
], xe.prototype, "canUndo", 2);
He([
  b({ type: Boolean })
], xe.prototype, "canRedo", 2);
He([
  b({ type: Boolean })
], xe.prototype, "previewing", 2);
xe = He([
  L("di-canvas-toolbar")
], xe);
var ph = Object.defineProperty, mh = Object.getOwnPropertyDescriptor, yl = (e) => {
  throw TypeError(e);
}, ta = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? mh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ph(t, i, s), s;
}, po = (e, t, i) => t.has(e) || yl("Cannot " + i), J = (e, t, i) => (po(e, t, "read from private field"), t.get(e)), pt = (e, t, i) => t.has(e) ? yl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Dt = (e, t, i, a) => (po(e, t, "write to private field"), t.set(e, i), i), Ne = (e, t, i) => (po(e, t, "access private method"), i), et, jt, Xt, Pt, Aa, La, be, mo, wa, fo, Ws;
const fh = 400;
let Lt = class extends N {
  constructor() {
    super(), pt(this, be), pt(this, et), pt(this, jt), pt(this, Xt), pt(this, Pt), pt(this, Aa), pt(this, La, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(Wt, (e) => {
      Dt(this, et, e), e && (this.observe(e.template, (t) => {
        t && Ne(this, be, wa).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Dt(this, Aa, t);
        const i = (a = J(this, et)) == null ? void 0 : a.getData();
        i && Ne(this, be, wa).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Dt(this, La, t ?? !0);
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
    const e = (t = J(this, et)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(J(this, jt)), this._collapsed = !1, Ne(this, be, fo).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(J(this, jt)), (e = J(this, Xt)) == null || e.abort(), Ne(this, be, mo).call(this);
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
        const t = (e = J(this, et)) == null ? void 0 : e.getData();
        t && Ne(this, be, wa).call(this, t);
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
et = /* @__PURE__ */ new WeakMap();
jt = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
Pt = /* @__PURE__ */ new WeakMap();
Aa = /* @__PURE__ */ new WeakMap();
La = /* @__PURE__ */ new WeakMap();
be = /* @__PURE__ */ new WeakSet();
mo = function() {
  J(this, Pt) && (URL.revokeObjectURL(J(this, Pt)), Dt(this, Pt, void 0));
};
wa = function(e) {
  this._collapsed || (window.clearTimeout(J(this, jt)), Dt(this, jt, window.setTimeout(() => void Ne(this, be, fo).call(this, e), fh)));
};
fo = async function(e) {
  var t;
  if (J(this, et)) {
    (t = J(this, Xt)) == null || t.abort(), Dt(this, Xt, new AbortController()), Ne(this, be, Ws).call(this, !0), this._error = void 0;
    try {
      const i = await Hs(
        e,
        {
          signal: J(this, Xt).signal,
          contentKey: J(this, Aa),
          useSampleData: J(this, La)
        },
        J(this, et).getToken
      );
      Ne(this, be, mo).call(this), Dt(this, Pt, URL.createObjectURL(i)), this._url = J(this, Pt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ne(this, be, Ws).call(this, !1);
    }
  }
};
Ws = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Lt.styles = A`
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
ta([
  p()
], Lt.prototype, "_url", 2);
ta([
  p()
], Lt.prototype, "_loading", 2);
ta([
  p()
], Lt.prototype, "_error", 2);
ta([
  p()
], Lt.prototype, "_collapsed", 2);
Lt = ta([
  L("di-preview-strip")
], Lt);
var gh = Object.defineProperty, yh = Object.getOwnPropertyDescriptor, vl = (e) => {
  throw TypeError(e);
}, Q = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && gh(t, i, s), s;
}, go = (e, t, i) => t.has(e) || vl("Cannot " + i), v = (e, t, i) => (go(e, t, "read from private field"), i ? i.call(e) : t.get(e)), mt = (e, t, i) => t.has(e) ? vl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Di = (e, t, i, a) => (go(e, t, "write to private field"), t.set(e, i), i), ee = (e, t, i) => (go(e, t, "access private method"), i), $, Wi, Ni, Ui, Yt, R, Ns, yo, bl, _l, Us, wl, $l, xl, Fs, kl, Sl, Tl, Cl, vo, El, $a;
const vh = 400;
let F = class extends N {
  constructor() {
    super(), mt(this, R), mt(this, $), mt(this, Wi), mt(this, Ni), mt(this, Ui), mt(this, Yt), this._properties = [], this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, mt(this, $a, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = v(this, $);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = v(this, R, Ns);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), ee(this, R, Us).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, h = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, f = ze(s.position, "x") ? 0 : l, C = ze(s.position, "y") ? 0 : h;
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
    }), this.consumeContext(Ua, (e) => {
      Di(this, Wi, e);
    }), this.consumeContext(Ke, (e) => {
      Di(this, Ni, e);
    }), this.consumeContext(Wt, (e) => {
      Di(this, $, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (ee(this, R, wl).call(this, t), ee(this, R, $l).call(this, t), ee(this, R, xl).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", v(this, $a));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", v(this, $a)), window.clearTimeout(v(this, Ui)), (e = v(this, Yt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = v(this, $)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = v(this, $)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = v(this, $)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => ee(this, R, Us).call(this, e.detail.key)}
        @di-layer-detach=${(e) => ee(this, R, _l).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = v(this, $)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = v(this, $)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = v(this, $)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = v(this, $)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = v(this, $)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = v(this, $)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => ee(this, R, Fs).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => ee(this, R, Fs).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-pick-base-image=${ee(this, R, Tl)}
        @di-pick-layer-image=${(e) => ee(this, R, Cl).call(this, e.detail.key)}
        @di-use-image-size=${ee(this, R, El)}
        @di-request-preview=${() => {
      var e;
      return (e = v(this, R, bl)) == null ? void 0 : e.refresh();
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
      return (e = v(this, $)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = v(this, $)) == null ? void 0 : e.redo();
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
            .layer=${v(this, R, Ns)}
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
Wi = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
Ui = /* @__PURE__ */ new WeakMap();
Yt = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakSet();
Ns = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
yo = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
bl = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
_l = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = v(this, R, yo)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = v(this, $)) == null || n.updateLayer(e, { position: ms(i.position, t, a) });
};
Us = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = v(this, R, yo)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = v(this, $)) == null || s.removeLayer(e, t);
};
wl = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && v(this, $) && await Yn(t, v(this, $).getToken);
};
$l = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !v(this, $)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await js(t.mediaKey, v(this, $).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
xl = function() {
  window.clearTimeout(v(this, Ui)), Di(this, Ui, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !v(this, $))) {
      (t = v(this, Yt)) == null || t.abort(), Di(this, Yt, new AbortController());
      try {
        const i = await Gs(
          e,
          { signal: v(this, Yt).signal, useSampleData: !0 },
          v(this, $).getToken
        );
        v(this, $).setServerBounds(i.layers), v(this, $).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, vh));
};
Fs = function(e, t, i, a) {
  const s = this._template;
  if (!s || !v(this, $)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: ee(this, R, Sl).call(this) };
  if (e.kind === "property") {
    const l = kc(e.property, o);
    if (l.kind === "condition") {
      ee(this, R, kl).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    v(this, $).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? kn(o, "Image") : e.layerType === "badges" ? Sn(o, "Badges", "") : e.layerType === "rect" ? $c(o, "Shape", e.shape) : xn(o, "Text", { kind: "static", text: "Text" });
  v(this, $).addLayer(n);
};
kl = function(e, t, i) {
  var o, n, l, h;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((f) => f.key === a);
  if (!s) {
    (n = v(this, Ni)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = v(this, $)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (h = v(this, Ni)) == null || h.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
Sl = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Tl = async function() {
  var t;
  const e = await ee(this, R, vo).call(this);
  e && ((t = v(this, $)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
Cl = async function(e) {
  var i;
  const t = await ee(this, R, vo).call(this);
  t && ((i = v(this, $)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
vo = async function() {
  if (!v(this, Wi)) return;
  const e = v(this, Wi).open(this, qo, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
El = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !v(this, $)) return;
  const t = await js(e.mediaKey, v(this, $).getToken).catch(() => {
  });
  t && v(this, $).updateCanvas({ width: t.width, height: t.height });
};
$a = /* @__PURE__ */ new WeakMap();
F.styles = A`
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
], F.prototype, "_template", 2);
Q([
  p()
], F.prototype, "_selectedKey", 2);
Q([
  p()
], F.prototype, "_properties", 2);
Q([
  p()
], F.prototype, "_fonts", 2);
Q([
  p()
], F.prototype, "_serverBounds", 2);
Q([
  p()
], F.prototype, "_baseImageUrl", 2);
Q([
  p()
], F.prototype, "_zoom", 2);
Q([
  p()
], F.prototype, "_effectiveScale", 2);
Q([
  p()
], F.prototype, "_previewing", 2);
Q([
  p()
], F.prototype, "_snapEnabled", 2);
Q([
  p()
], F.prototype, "_showRulers", 2);
Q([
  p()
], F.prototype, "_showSafeArea", 2);
Q([
  p()
], F.prototype, "_showMeasured", 2);
Q([
  p()
], F.prototype, "_canUndo", 2);
Q([
  p()
], F.prototype, "_canRedo", 2);
F = Q([
  L("di-design-view")
], F);
const bh = F, _h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return F;
  },
  default: bh
}, Symbol.toStringTag, { value: "Module" }));
var wh = Object.defineProperty, $h = Object.getOwnPropertyDescriptor, Dl = (e) => {
  throw TypeError(e);
}, Ge = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $h(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && wh(t, i, s), s;
}, bo = (e, t, i) => t.has(e) || Dl("Cannot " + i), K = (e, t, i) => (bo(e, t, "read from private field"), t.get(e)), Ut = (e, t, i) => t.has(e) ? Dl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qt = (e, t, i, a) => (bo(e, t, "write to private field"), t.set(e, i), i), q = (e, t, i) => (bo(e, t, "access private method"), i), de, Fi, Bi, Jt, zt, H, Pl, Ra, zl, Ml, _o, Ol, Ki, Il, Al, Ll;
let ce = class extends N {
  constructor() {
    super(), Ut(this, H), Ut(this, de), Ut(this, Fi), Ut(this, Bi), Ut(this, Jt), Ut(this, zt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Ua, (e) => {
      qt(this, Fi, e);
    }), this.consumeContext(Ke, (e) => {
      qt(this, Bi, e);
    }), this.consumeContext(Wt, (e) => {
      qt(this, de, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && q(this, H, Pl).call(this);
      });
    });
  }
  connectedCallback() {
    super.connectedCallback(), q(this, H, Ki).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = K(this, Jt)) == null || e.abort(), q(this, H, _o).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${q(this, H, Ol)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => q(this, H, Ki).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${q(this, H, Al)}>
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
          ${this._template.layers.length === 0 ? r`<p class="empty">This template has no layers yet.</p>` : r`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${B(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => q(this, H, Ll).call(this, e)
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
                @click=${q(this, H, Il)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : m}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
de = /* @__PURE__ */ new WeakMap();
Fi = /* @__PURE__ */ new WeakMap();
Bi = /* @__PURE__ */ new WeakMap();
Jt = /* @__PURE__ */ new WeakMap();
zt = /* @__PURE__ */ new WeakMap();
H = /* @__PURE__ */ new WeakSet();
Pl = async function() {
  var t;
  const e = q(this, H, zl).call(this);
  e && (this._sampleNode = e, (t = K(this, de)) == null || t.setSampleContentKey(e.key), await q(this, H, Ki).call(this));
};
Ra = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
zl = function() {
  try {
    const e = localStorage.getItem(q(this, H, Ra).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
Ml = function(e) {
  try {
    e ? localStorage.setItem(q(this, H, Ra).call(this), JSON.stringify(e)) : localStorage.removeItem(q(this, H, Ra).call(this));
  } catch {
  }
};
_o = function() {
  K(this, zt) && (URL.revokeObjectURL(K(this, zt)), qt(this, zt, void 0));
};
Ol = async function() {
  var i, a, s;
  if (!K(this, Fi) || !this._template) return;
  const e = K(this, Fi).open(this, iu, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, q(this, H, Ml).call(this, t.item), (s = K(this, de)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await q(this, H, Ki).call(this));
};
Ki = async function() {
  var i, a;
  const e = this._template;
  if (!e || !K(this, de)) return;
  (i = K(this, Jt)) == null || i.abort(), qt(this, Jt, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: K(this, Jt).signal,
    contentKey: (a = this._sampleNode) == null ? void 0 : a.key,
    useSampleData: !this._sampleNode,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [s, o] = await Promise.all([
      Hs(e, t, K(this, de).getToken),
      Gs(e, t, K(this, de).getToken)
    ]);
    q(this, H, _o).call(this), qt(this, zt, URL.createObjectURL(s)), this._url = K(this, zt), this._bounds = o.layers, this._skipped = o.skipped ?? [], K(this, de).setServerBounds(o.layers), K(this, de).setIssues(o.issues);
  } catch (s) {
    if ((s == null ? void 0 : s.name) === "AbortError") return;
    this._error = s instanceof Error ? s.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Il = async function() {
  var e, t;
  if (!(!this._sampleNode || !K(this, de))) {
    this._regenerating = !0;
    try {
      const i = await Ba(this._sampleNode.key, K(this, de).getToken);
      (e = K(this, Bi)) == null || e.peek(i.outcome === "generated" ? "positive" : "warning", {
        data: { message: `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = K(this, Bi)) == null || t.peek("danger", {
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
Al = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Ll = function(e) {
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
          ${t.truncated ? r`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : m}
        </uui-table-cell>
        <uui-table-cell>${Math.round(t.x)}, ${Math.round(t.y)}</uui-table-cell>
        <uui-table-cell>${Math.round(t.width)} × ${Math.round(t.height)}</uui-table-cell>
      </uui-table-row>
    `;
};
ce.styles = A`
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
Ge([
  p()
], ce.prototype, "_template", 2);
Ge([
  p()
], ce.prototype, "_sampleNode", 2);
Ge([
  p()
], ce.prototype, "_bounds", 2);
Ge([
  p()
], ce.prototype, "_skipped", 2);
Ge([
  p()
], ce.prototype, "_url", 2);
Ge([
  p()
], ce.prototype, "_loading", 2);
Ge([
  p()
], ce.prototype, "_error", 2);
Ge([
  p()
], ce.prototype, "_regenerating", 2);
ce = Ge([
  L("di-preview-view")
], ce);
const xh = ce, kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return ce;
  },
  default: xh
}, Symbol.toStringTag, { value: "Module" }));
var Sh = Object.defineProperty, Th = Object.getOwnPropertyDescriptor, Rl = (e) => {
  throw TypeError(e);
}, es = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Th(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Sh(t, i, s), s;
}, wo = (e, t, i) => t.has(e) || Rl("Cannot " + i), U = (e, t, i) => (wo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), rs = (e, t, i) => t.has(e) ? Rl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ko = (e, t, i, a) => (wo(e, t, "write to private field"), t.set(e, i), i), st = (e, t, i) => (wo(e, t, "access private method"), i), G, Rt, _e, Wl, Nl, Ul, Fl, Bl, Kl, Vl, Hl, Gl;
let ct = class extends N {
  constructor() {
    super(), rs(this, _e), rs(this, G), rs(this, Rt), this._properties = [], this._showAdvanced = !1, this.consumeContext(Ua, (e) => {
      Ko(this, Rt, e);
    }), this.consumeContext(Wt, (e) => {
      Ko(this, G, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${st(this, _e, Kl).call(this)} ${st(this, _e, Vl).call(this)} ${st(this, _e, Hl).call(this)} ${st(this, _e, Gl).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
G = /* @__PURE__ */ new WeakMap();
Rt = /* @__PURE__ */ new WeakMap();
_e = /* @__PURE__ */ new WeakSet();
Wl = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Nl = async function() {
  var a, s;
  if (!U(this, Rt) || !this._template) return;
  const e = U(this, Rt).open(this, lc, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await st(this, _e, Ul).call(this, t.selection.filter((o) => !!o));
  (a = U(this, G)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = U(this, G)) == null ? void 0 : s.reloadProperties());
};
Ul = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => wc), i = await t(U(this, G).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
Fl = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = U(this, G)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = U(this, G)) == null || s.reloadProperties();
};
Bl = async function() {
  var i;
  if (!U(this, Rt)) return;
  const e = U(this, Rt).open(this, qo, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = U(this, G)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
Kl = function() {
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
                          @click=${() => st(this, _e, Fl).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${st(this, _e, Nl)}>
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
    ...U(this, _e, Wl).map((t) => ({
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
Vl = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${st(this, _e, Bl)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = U(this, G)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
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

        ${e.output.format === "png" ? m : r`<umb-property-layout label="Quality" description="1-100. Ignored for PNG.">
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
Hl = function() {
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
Gl = function() {
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
            ${this._showAdvanced ? r`<pre class="json">${JSON.stringify(e, null, 2)}</pre>` : m}
          </div>
        </umb-property-layout>
      </uui-box>
    `;
};
ct.styles = A`
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
es([
  p()
], ct.prototype, "_template", 2);
es([
  p()
], ct.prototype, "_properties", 2);
es([
  p()
], ct.prototype, "_showAdvanced", 2);
ct = es([
  L("di-settings-view")
], ct);
const Ch = ct, Eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return ct;
  },
  default: Ch
}, Symbol.toStringTag, { value: "Module" }));
var Dh = Object.defineProperty, Ph = Object.getOwnPropertyDescriptor, jl = (e) => {
  throw TypeError(e);
}, ia = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ph(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Dh(t, i, s), s;
}, $o = (e, t, i) => t.has(e) || jl("Cannot " + i), Vo = (e, t, i) => ($o(e, t, "read from private field"), t.get(e)), Ho = (e, t, i) => t.has(e) ? jl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), zh = (e, t, i, a) => ($o(e, t, "write to private field"), t.set(e, i), i), Go = (e, t, i) => ($o(e, t, "access private method"), i), Vi, xa, Bs;
let Fe = class extends N {
  constructor() {
    super(), Ho(this, xa), Ho(this, Vi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Wt, (e) => {
      zh(this, Vi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Go(this, xa, Bs).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Go(this, xa, Bs).call(this)}>Reload</uui-button>
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
Vi = /* @__PURE__ */ new WeakMap();
xa = /* @__PURE__ */ new WeakSet();
Bs = async function() {
  const e = this._template;
  if (!(!e || !Vo(this, Vi))) {
    this._loading = !0;
    try {
      this._usage = await vn(e.key, Vo(this, Vi).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Fe.styles = A`
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
ia([
  p()
], Fe.prototype, "_template", 2);
ia([
  p()
], Fe.prototype, "_usage", 2);
ia([
  p()
], Fe.prototype, "_loading", 2);
ia([
  p()
], Fe.prototype, "_onlyMissing", 2);
Fe = ia([
  L("di-usage-view")
], Fe);
const Mh = Fe, Oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Fe;
  },
  default: Mh
}, Symbol.toStringTag, { value: "Module" })), Ih = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Po,
  default: Po
}, Symbol.toStringTag, { value: "Module" })), Ah = 1500;
var ge, Ct, Na, Xl;
class ls extends hc {
  constructor(i, a) {
    super(i, a);
    w(this, Na);
    w(this, ge);
    w(this, Ct);
    this.consumeContext(Ke, (s) => {
      _(this, ge, s);
    }), this.consumeContext(Wt, (s) => {
      _(this, Ct, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, Ct), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, ge)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await Ks(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await fn(a.key, !1, i.getToken);
        (o = c(this, ge)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await P(this, Na, Xl).call(this, l, i);
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
    c(this, Ct) && await yn(i, c(this, Ct).getToken);
  }
}
ge = new WeakMap(), Ct = new WeakMap(), Na = new WeakSet(), Xl = async function(i, a) {
  var o, n, l, h;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((f) => setTimeout(f, Ah));
    try {
      s = await gn(s.id, a.getToken);
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
    (h = c(this, ge)) == null || h.peek("danger", {
      data: { headline: `Regeneration ${s.status}`, message: s.failures[0] ?? "" }
    });
};
const Lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: ls,
  api: ls,
  default: ls
}, Symbol.toStringTag, { value: "Module" }));
var ji, ri;
class cs extends mc {
  constructor(i, a) {
    super(i, a);
    w(this, ji);
    w(this, ri);
    this.consumeContext(Be, (s) => {
      _(this, ji, s);
    }), this.consumeContext(Ke, (s) => {
      _(this, ri, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Ba(i, () => {
          var n;
          return (n = c(this, ji)) == null ? void 0 : n.getLatestToken();
        });
        (a = c(this, ri)) == null || a.peek(o.outcome === "generated" ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: o.outcome === "generated" ? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof nt && o.status === 404;
        (s = c(this, ri)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof nt ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
ji = new WeakMap(), ri = new WeakMap();
const Rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: cs,
  api: cs,
  default: cs
}, Symbol.toStringTag, { value: "Module" }));
var Xi, Et, Yi, li;
class us extends fc {
  constructor(i, a) {
    super(i, a);
    w(this, Xi);
    w(this, Et);
    w(this, Yi);
    w(this, li);
    this.consumeContext(Be, (s) => {
      _(this, Xi, s);
    }), this.consumeContext(Ke, (s) => {
      _(this, Et, s);
    }), this.consumeContext(gc, (s) => {
      _(this, Yi, s);
    }), this.consumeContext(yc, (s) => {
      _(this, li, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, li)) {
      (i = c(this, Et)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Ba(c(this, li), () => {
        var l;
        return (l = c(this, Xi)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Yi)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, Et)) == null || s.peek("positive", {
        data: { headline: "Dynamic Images", message: "The image has been regenerated." }
      });
    } catch (n) {
      const l = n instanceof nt && n.status === 404;
      (o = c(this, Et)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof nt ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Xi = new WeakMap(), Et = new WeakMap(), Yi = new WeakMap(), li = new WeakMap();
const Wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: us,
  api: us,
  default: us
}, Symbol.toStringTag, { value: "Module" }));
var Nh = Object.defineProperty, Uh = Object.getOwnPropertyDescriptor, Yl = (e) => {
  throw TypeError(e);
}, ts = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Uh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Nh(t, i, s), s;
}, xo = (e, t, i) => t.has(e) || Yl("Cannot " + i), Wa = (e, t, i) => (xo(e, t, "read from private field"), t.get(e)), la = (e, t, i) => t.has(e) ? Yl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ql = (e, t, i, a) => (xo(e, t, "write to private field"), t.set(e, i), i), Bt = (e, t, i) => (xo(e, t, "access private method"), i), ka, Hi, ko, Je, So, Jl, Sa;
let ut = class extends Yo {
  constructor() {
    super(), la(this, Je), la(this, ka), la(this, Hi), this._items = [], this._loading = !0, this._search = "", la(this, ko, () => {
      var e;
      return (e = Wa(this, ka)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Be, (e) => {
      ql(this, ka, e), e && Bt(this, Je, So).call(this);
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
          @input=${Bt(this, Je, Jl)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Bt(this, Je, Sa).call(this, void 0)}>
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
                      @open=${() => Bt(this, Je, Sa).call(this, e)}
                      @click=${() => Bt(this, Je, Sa).call(this, e)}>
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
ka = /* @__PURE__ */ new WeakMap();
Hi = /* @__PURE__ */ new WeakMap();
ko = /* @__PURE__ */ new WeakMap();
Je = /* @__PURE__ */ new WeakSet();
So = async function() {
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
        (a) => mn(a, this._search, 0, 30, Wa(this, ko)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
Jl = function(e) {
  this._search = e.target.value, window.clearTimeout(Wa(this, Hi)), ql(this, Hi, window.setTimeout(() => void Bt(this, Je, So).call(this), 300));
};
Sa = function(e) {
  this.value = { item: e }, this._submitModal();
};
ut.styles = A`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
ts([
  p()
], ut.prototype, "_items", 2);
ts([
  p()
], ut.prototype, "_loading", 2);
ts([
  p()
], ut.prototype, "_search", 2);
ut = ts([
  L("di-sample-node-picker-modal")
], ut);
const Fh = ut, Bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return ut;
  },
  default: Fh
}, Symbol.toStringTag, { value: "Module" }));
var Kh = Object.defineProperty, Vh = Object.getOwnPropertyDescriptor, Zl = (e) => {
  throw TypeError(e);
}, je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Vh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Kh(t, i, s), s;
}, To = (e, t, i) => t.has(e) || Zl("Cannot " + i), di = (e, t, i) => (To(e, t, "read from private field"), i ? i.call(e) : t.get(e)), hs = (e, t, i) => t.has(e) ? Zl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Hh = (e, t, i, a) => (To(e, t, "write to private field"), t.set(e, i), i), wt = (e, t, i) => (To(e, t, "access private method"), i), Ta, aa, ye, Ql, ec, tc, Co, ic, ac, sc, oc;
const Gh = [100, 200, 300, 400, 500, 600, 700, 800, 900], jh = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let ue = class extends Yo {
  constructor() {
    super(), hs(this, ye), hs(this, Ta), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", hs(this, aa, () => {
      var e;
      return (e = di(this, Ta)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Be, (e) => {
      Hh(this, Ta, e);
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
            @change=${wt(this, ye, Ql)}>
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
            @click=${wt(this, ye, tc)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${jh.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? wt(this, ye, oc).call(this) : wt(this, ye, sc).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !di(this, ye, Co)}
            @click=${wt(this, ye, ic)}>
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
Ta = /* @__PURE__ */ new WeakMap();
aa = /* @__PURE__ */ new WeakMap();
ye = /* @__PURE__ */ new WeakSet();
Ql = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  wt(this, ye, ec).call(this, t);
};
ec = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await nn(t, di(this, aa));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
tc = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await rn(this._path.trim(), di(this, aa)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Co = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
ic = async function() {
  if (di(this, ye, Co)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await ln(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        di(this, aa)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
ac = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
sc = function() {
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
    Gh,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => wt(this, ye, ac).call(this, e, t.target.checked)}>
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
oc = function() {
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
ue.styles = A`
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
je([
  p()
], ue.prototype, "_busy", 2);
je([
  p()
], ue.prototype, "_error", 2);
je([
  p()
], ue.prototype, "_path", 2);
je([
  p()
], ue.prototype, "_provider", 2);
je([
  p()
], ue.prototype, "_family", 2);
je([
  p()
], ue.prototype, "_weights", 2);
je([
  p()
], ue.prototype, "_italic", 2);
je([
  p()
], ue.prototype, "_url", 2);
ue = je([
  L("di-font-upload-modal")
], ue);
const Xh = ue, Yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return ue;
  },
  default: Xh
}, Symbol.toStringTag, { value: "Module" }));
export {
  Wc as manifests,
  dd as onInit
};
//# sourceMappingURL=dynamic-images.js.map
