var zo = (e) => {
  throw TypeError(e);
};
var is = (e, t, i) => t.has(e) || zo("Cannot " + i);
var c = (e, t, i) => (is(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? zo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (is(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), P = (e, t, i) => (is(e, t, "access private method"), i);
var as = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { nothing as m, html as r, css as L, state as p, customElement as R, repeat as B, property as b, classMap as qo, styleMap as V } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as N } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Ke } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as Ve } from "@umbraco-cms/backoffice/notification";
import { umbOpenModal as dc, UMB_DISCARD_CHANGES_MODAL as pc, umbConfirmModal as Vs, UmbModalToken as Jo, UMB_MODAL_MANAGER_CONTEXT as Ua, UmbModalBaseElement as Zo } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as Qo } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as mc } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as fc, UmbEntityWorkspaceDataManager as gc, UmbSubmitWorkspaceAction as Mo, UmbWorkspaceActionBase as yc } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as vc } from "@umbraco-cms/backoffice/context-api";
import { UmbArrayState as vi, UmbStringState as Oo, UmbBooleanState as aa, UmbNumberState as bc } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as _c } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as wc } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as $c } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as xc } from "@umbraco-cms/backoffice/document";
import "@umbraco-cms/backoffice/external/uui";
const Fa = "dynamic-images", Xi = "di-template", Sa = "di:templates-changed", kc = "/umbraco/management/api/v1/dynamic-images";
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
  const n = await fetch(`${kc}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await Sc(n);
  return n;
}
async function Sc(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new nt(t, e.status, i);
}
const D = async (e) => e.json();
async function Hs(e) {
  const t = await T("/templates?take=500", e);
  return (await D(t)).items;
}
const en = async (e, t) => D(await T(`/templates/${e}`, t)), tn = async (e, t) => D(await T("/templates", t, { method: "POST", json: e })), an = async (e, t) => D(await T(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function sn(e, t) {
  await T(`/templates/${e}`, t, { method: "DELETE" });
}
const on = async (e, t) => D(await T(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function nn(e, t) {
  return (await T(`/templates/${e}/export`, t)).blob();
}
const rn = async (e, t, i) => D(await T("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), ln = async (e) => D(await T("/templates/import/appsettings", e, { method: "POST" })), Ei = async (e) => D(await T("/fonts", e));
async function cn(e, t) {
  const i = new FormData();
  return i.append("file", e), D(await T("/fonts", t, { method: "POST", body: i }));
}
const un = async (e, t) => D(await T("/fonts/register-path", t, { method: "POST", json: { path: e } })), hn = async (e, t) => D(await T("/fonts/register-web", t, { method: "POST", json: e })), dn = async (e, t) => D(await T(`/fonts/${e}/refresh`, t, { method: "POST" })), pn = async (e, t, i, a, s) => D(await T(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function mn(e, t) {
  await T(`/fonts/${e}`, t, { method: "DELETE" });
}
async function fn(e, t) {
  return (await T(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Tc = async (e) => D(await T("/document-types", e)), gn = async (e, t) => D(await T(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function yn(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), D(await T(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function Gs(e, t, i) {
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
const js = async (e, t, i) => D(await T("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Xs = async (e, t) => D(await T(`/media/${e}/image-info`, t)), Ba = async (e, t) => D(await T(`/documents/${e}/regenerate`, t, { method: "POST" })), vn = async (e, t, i) => D(await T(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), bn = async (e, t) => D(await T(`/jobs/${e}`, t));
async function _n(e, t) {
  await T(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const wn = async (e, t) => D(await T(`/templates/${e}/usage`, t)), Ka = async (e) => D(await T("/health", e)), $n = async (e) => D(await T("/sync/status", e)), xn = async (e) => D(await T("/sync/export", e, { method: "POST" })), kn = async (e) => D(await T("/sync/import", e, { method: "POST" }));
function li(e) {
  const t = `section/${Fa}/workspace/${Xi}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Va() {
  return new URL(`section/${Fa}/workspace/${Xi}/create`, document.baseURI).pathname;
}
function Sn(e) {
  return new URL(`section/${Fa}/dashboard/${e}`, document.baseURI).pathname;
}
function ps() {
  const e = window.location.pathname.split(`/workspace/${Xi}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function di() {
  window.dispatchEvent(new CustomEvent(Sa));
}
const Cc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: nt,
  SECTION_PATHNAME: Fa,
  TEMPLATES_CHANGED_EVENT: Sa,
  TEMPLATE_ENTITY_TYPE: Xi,
  cancelJob: _n,
  createTemplate: tn,
  deleteFont: mn,
  deleteTemplate: sn,
  duplicateTemplate: on,
  exportTemplate: nn,
  fetchDocumentTypes: Tc,
  fetchFontFile: fn,
  fetchFonts: Ei,
  fetchHealth: Ka,
  fetchImageInfo: Xs,
  fetchJob: bn,
  fetchLayout: js,
  fetchPreview: Gs,
  fetchProperties: gn,
  fetchSampleContent: yn,
  fetchSyncStatus: $n,
  fetchTemplate: en,
  fetchTemplates: Hs,
  fetchUsage: wn,
  hrefForCreate: Va,
  hrefForDashboard: Sn,
  hrefForTemplate: li,
  importFromAppSettings: ln,
  importTemplate: rn,
  notifyTemplatesChanged: di,
  refreshFont: dn,
  regenerateDocument: Ba,
  regenerateTemplate: vn,
  registerFontPath: un,
  registerWebFont: hn,
  runSyncExport: xn,
  runSyncImport: kn,
  templateKeyFromLocation: ps,
  updateFont: pn,
  updateTemplate: an,
  uploadFont: cn
}, Symbol.toStringTag, { value: "Module" })), Ha = () => crypto.randomUUID();
function Ga(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function Tn(e, t, i) {
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
function Cn(e, t, i) {
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
function En(e, t, i) {
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
function Ec(e, t = "Shape", i = "rectangle") {
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
function Dc(e) {
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
function Pc(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (Dc(e.classification)) {
    case "image":
      return { kind: "layer", layer: Cn(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: En(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: Tn(t, e.name, zc(e)) };
  }
}
function zc(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Mc(e) {
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
const Dn = [
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
function ms(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return Dn[a * 3 + i];
}
function ja(e, t, i) {
  return {
    x: e.x - t * Di(e.anchor),
    y: e.y - i * Pi(e.anchor)
  };
}
function Ys(e, t, i, a, s) {
  return {
    x: e + i * Di(s),
    y: t + a * Pi(s)
  };
}
function Oc(e, t, i, a) {
  const s = ja(e, t, i), o = Ys(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function Ic(e, t) {
  const i = Ys(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Pn(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Bt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), h = e - i, f = t - a;
  return { x: i + h * n - f * l, y: a + h * l + f * n };
}
function Ac(e, t, i, a, s) {
  return Bt(e, t, i, a, -s);
}
function zn(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Bt(e.x, e.y, t, i, a),
    Bt(e.x + e.width, e.y, t, i, a),
    Bt(e.x + e.width, e.y + e.height, t, i, a),
    Bt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((f) => f.x)), n = Math.max(...s.map((f) => f.x)), l = Math.min(...s.map((f) => f.y)), h = Math.max(...s.map((f) => f.y));
  return { x: o, y: l, width: n - o, height: h - l };
}
const Lc = 10;
function ze(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Mn(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Ta(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Io(e) {
  return e === "below" || e === "above";
}
function Ao(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Rc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Wc(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = Ao(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...Ao(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Nc(e, t, i) {
  const a = e.position;
  if (!Mn(a)) return a;
  if (Wc(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Di(a.anchor), l = Pi(a.anchor);
  const h = Lo(e, a.relativeX, !1, t, i);
  h && (s = h.coordinate, n = h.factor);
  const f = Lo(e, a.relativeY, !0, t, i);
  return f && (o = f.coordinate, l = f.factor), { x: s, y: o, anchor: ms(n, l) };
}
function Lo(e, t, i, a, s) {
  if (!t || Io(t.edge) !== i) return;
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
    if (!f || Io(f.edge) !== i) return;
    n = f.layerKey;
  }
}
function Uc(e, t, i) {
  const a = Rc(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const h = s.get(l.key);
    if (h) return h;
    let f;
    o.has(l.key) ? f = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), f = Nc(l, a, (Ye) => {
      const Ae = a.get(Ye);
      return Ae && !i(Ae) ? n(Ae).extent : void 0;
    }), o.delete(l.key));
    const C = t(l), X = ja(f, C.width, C.height), xe = { x: X.x, y: X.y, width: C.width, height: C.height }, Ie = { position: f, box: xe, extent: zn(xe, f.x, f.y, l.rotation ?? 0) };
    return s.set(l.key, Ie), Ie;
  };
  for (const l of e) n(l);
  return s;
}
function fs(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? ms(Di(i.anchor), Pi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? ms(Di(e.anchor), Pi(i.anchor)) : e.anchor
  };
}
var re, We, Se, tt;
class Fc {
  constructor(t = 100) {
    w(this, re, []);
    w(this, We, []);
    w(this, Se, 0);
    w(this, tt);
    this.limit = t;
  }
  get canUndo() {
    return c(this, re).length > 0;
  }
  get canRedo() {
    return c(this, We).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Se) > 0 || (c(this, re).push(structuredClone(t)), c(this, re).length > this.limit && c(this, re).shift(), _(this, We, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Se) === 0 && _(this, tt, structuredClone(t)), as(this, Se)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Se) !== 0 && (as(this, Se)._--, !(c(this, Se) > 0) && (t && c(this, tt) !== void 0 && (c(this, re).push(c(this, tt)), c(this, re).length > this.limit && c(this, re).shift(), _(this, We, [])), _(this, tt, void 0)));
  }
  undo(t) {
    const i = c(this, re).pop();
    if (i !== void 0)
      return c(this, We).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, We).pop();
    if (i !== void 0)
      return c(this, re).push(structuredClone(t)), i;
  }
  clear() {
    _(this, re, []), _(this, We, []), _(this, Se, 0), _(this, tt, void 0);
  }
}
re = new WeakMap(), We = new WeakMap(), Se = new WeakMap(), tt = new WeakMap();
const Bc = "DynamicImages.Workspace.Template";
var Jt, it, $t, xt, Zt, Qt, ei, kt, ti, Ne, ii, ai, le, Vi, St, Te, Tt, k, On, si, oi, gs, ys, Le, ft, vs, bs;
class Kc extends fc {
  constructor(i) {
    super(i, Bc);
    w(this, k);
    w(this, Jt);
    w(this, it);
    w(this, $t);
    w(this, xt);
    w(this, Zt);
    w(this, Qt);
    w(this, ei);
    w(this, kt);
    w(this, ti);
    w(this, Ne);
    w(this, ii);
    w(this, ai);
    w(this, le);
    w(this, Vi);
    w(this, St);
    w(this, Te);
    w(this, Tt);
    w(this, si);
    w(this, oi);
    this._data = new gc(this), this.template = this._data.current, _(this, Jt, new vi([], (a) => a.key)), this.layers = c(this, Jt).asObservable(), _(this, it, new Oo(void 0)), this.selectedLayerKey = c(this, it).asObservable(), _(this, $t, new vi([], (a) => a.alias)), this.properties = c(this, $t).asObservable(), _(this, xt, new vi([], (a) => a.key)), this.fonts = c(this, xt).asObservable(), _(this, Zt, new vi([], (a) => a.key)), this.serverBounds = c(this, Zt).asObservable(), _(this, Qt, new vi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, Qt).asObservable(), _(this, ei, new Oo(void 0)), this.sampleContentKey = c(this, ei).asObservable(), _(this, kt, new aa(!0)), this.useSampleData = c(this, kt).asObservable(), _(this, ti, new bc(1)), this.zoom = c(this, ti).asObservable(), _(this, Ne, new aa(!0)), this.loading = c(this, Ne).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ii, new aa(!1)), this.canUndo = c(this, ii).asObservable(), _(this, ai, new aa(!1)), this.canRedo = c(this, ai).asObservable(), _(this, le, new Fc()), _(this, Te, !1), _(this, Tt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, si, async (a) => {
      const s = a.detail;
      if (c(this, Tt) || !(s != null && s.url) || !P(this, k, On).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await dc(this, pc), _(this, Tt, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, oi, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, Vi)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        path: "create",
        component: () => Promise.resolve().then(() => Wo),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Wo),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ke, (a) => {
      _(this, Vi, a);
    }), this.consumeContext(Ve, (a) => {
      _(this, St, a);
    }), window.addEventListener("willchangestate", c(this, si)), window.addEventListener("beforeunload", c(this, oi)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Te);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Ne).setValue(!0), _(this, Te, !1);
    try {
      const a = await en(i, this.getToken);
      P(this, k, ft).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await P(this, k, gs).call(this, a);
    } catch (a) {
      P(this, k, bs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Ne).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    c(this, Ne).setValue(!0), _(this, Te, !0), P(this, k, ft).call(this, Mc(i), { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await P(this, k, gs).call(this, this._data.getCurrent()), c(this, Ne).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    i && c(this, $t).setValue(await P(this, k, ys).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    c(this, xt).setValue(await Ei(this.getToken).catch(() => []));
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
        return ((l = Ta(n, "x")) == null ? void 0 : l.layerKey) === i && (n = fs(n, "x", a == null ? void 0 : a.get(o.key))), ((h = Ta(n, "y")) == null ? void 0 : h.layerKey) === i && (n = fs(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
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
    i && c(this, le).begin(i);
  }
  endTransaction(i = !0) {
    c(this, le).end(i), P(this, k, vs).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, le).undo(i);
    a && P(this, k, ft).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, le).redo(i);
    a && P(this, k, ft).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Zt).setValue(i);
  }
  setIssues(i) {
    c(this, Qt).setValue(i);
  }
  setSampleContentKey(i) {
    c(this, ei).setValue(i), c(this, kt).setValue(!i);
  }
  setUseSampleData(i) {
    c(this, kt).setValue(i);
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
      const o = c(this, Te) ? await tn(i, this.getToken) : await an(i, this.getToken);
      P(this, k, ft).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Te);
      _(this, Te, !1), this.setIsNew(!1), di(), (a = c(this, St)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, St)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", li(o.template.key));
    } catch (o) {
      throw P(this, k, bs).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Tt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, si)), window.removeEventListener("beforeunload", c(this, oi)), c(this, le).clear(), super.destroy();
  }
}
Jt = new WeakMap(), it = new WeakMap(), $t = new WeakMap(), xt = new WeakMap(), Zt = new WeakMap(), Qt = new WeakMap(), ei = new WeakMap(), kt = new WeakMap(), ti = new WeakMap(), Ne = new WeakMap(), ii = new WeakMap(), ai = new WeakMap(), le = new WeakMap(), Vi = new WeakMap(), St = new WeakMap(), Te = new WeakMap(), Tt = new WeakMap(), k = new WeakSet(), /**
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
On = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, si = new WeakMap(), oi = new WeakMap(), gs = async function(i) {
  const [a, s] = await Promise.all([
    Ei(this.getToken).catch(() => []),
    P(this, k, ys).call(this, i.docTypeAliases)
  ]);
  c(this, xt).setValue(a), c(this, $t).setValue(s);
}, ys = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => gn(o, this.getToken).catch(() => []))
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
  P(this, k, ft).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
ft = function(i, a) {
  a != null && a.resetHistory && c(this, le).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Jt).setValue(i.layers), P(this, k, vs).call(this);
}, vs = function() {
  c(this, ii).setValue(c(this, le).canUndo), c(this, ai).setValue(c(this, le).canRedo);
}, bs = function(i, a) {
  var o;
  const s = a instanceof nt ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, St)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const Wt = new vc(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Vc = [
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
    element: () => Promise.resolve().then(() => iu),
    weight: 200,
    meta: { label: "Templates", menus: ["DynamicImages.Menu"] }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => nu),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => fu),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => bu),
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
    api: Kc,
    meta: { entityType: Xi }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => Ch),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => zh),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Ah),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Uh),
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
    api: () => Promise.resolve().then(() => Fh),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Kh),
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
    api: () => Promise.resolve().then(() => Vh),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Hh),
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
    element: () => Promise.resolve().then(() => Yh)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => id)
  }
], bd = (e, t) => {
  t.registerMany(Vc);
};
var Hc = Object.defineProperty, Gc = Object.getOwnPropertyDescriptor, In = (e) => {
  throw TypeError(e);
}, qs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Hc(t, i, s), s;
}, Js = (e, t, i) => t.has(e) || In("Cannot " + i), jc = (e, t, i) => (Js(e, t, "read from private field"), t.get(e)), Ro = (e, t, i) => t.has(e) ? In("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Xc = (e, t, i, a) => (Js(e, t, "write to private field"), t.set(e, i), i), Yc = (e, t, i) => (Js(e, t, "access private method"), i), Ca, _s, An;
let Mt = class extends N {
  constructor() {
    super(), Ro(this, _s), Ro(this, Ca), this._name = "", this._loading = !0, this.consumeContext(Wt, (e) => {
      Xc(this, Ca, e), e && (this.observe(e.template, (t) => {
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
            @input=${Yc(this, _s, An)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : m}
    `;
  }
};
Ca = /* @__PURE__ */ new WeakMap();
_s = /* @__PURE__ */ new WeakSet();
An = function(e) {
  var i;
  const t = e.target.value;
  (i = jc(this, Ca)) == null || i.updateTemplateFields({ name: t });
};
Mt.styles = L`
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
qs([
  p()
], Mt.prototype, "_name", 2);
qs([
  p()
], Mt.prototype, "_loading", 2);
Mt = qs([
  R("di-template-editor")
], Mt);
const qc = Mt, Wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Mt;
  },
  default: qc
}, Symbol.toStringTag, { value: "Module" }));
var Jc = Object.defineProperty, Zc = Object.getOwnPropertyDescriptor, Ln = (e) => {
  throw TypeError(e);
}, pi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Jc(t, i, s), s;
}, Zs = (e, t, i) => t.has(e) || Ln("Cannot " + i), vt = (e, t, i) => (Zs(e, t, "read from private field"), t.get(e)), bi = (e, t, i) => t.has(e) ? Ln("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Qc = (e, t, i, a) => (Zs(e, t, "write to private field"), t.set(e, i), i), ra = (e, t, i) => (Zs(e, t, "access private method"), i), la, Ea, ca, ua, Kt, ws, Rn, Wn;
let Me = class extends N {
  constructor() {
    super(), bi(this, Kt), bi(this, la), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = ps(), this._expanded = !0, bi(this, Ea, () => {
      var e;
      return (e = vt(this, la)) == null ? void 0 : e.getLatestToken();
    }), bi(this, ca, () => {
      this._activeKey = ps();
    }), bi(this, ua, () => {
      ra(this, Kt, ws).call(this);
    }), this.consumeContext(Ke, (e) => {
      Qc(this, la, e), e && ra(this, Kt, ws).call(this);
    }), window.addEventListener("changestate", vt(this, ca)), window.addEventListener(Sa, vt(this, ua));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("changestate", vt(this, ca)), window.removeEventListener(Sa, vt(this, ua));
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
        ${ra(this, Kt, Rn).call(this)}
      </uui-menu-item>
    `;
  }
};
la = /* @__PURE__ */ new WeakMap();
Ea = /* @__PURE__ */ new WeakMap();
ca = /* @__PURE__ */ new WeakMap();
ua = /* @__PURE__ */ new WeakMap();
Kt = /* @__PURE__ */ new WeakSet();
ws = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Hs(vt(this, Ea)),
      Ka(vt(this, Ea)).catch(() => {
      })
    ]);
    this._templates = e, this._issuesByTemplate = eu((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
Rn = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${B(
    this._templates,
    (e) => e.key,
    (e) => ra(this, Kt, Wn).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${Va()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
Wn = function(e) {
  const t = this._issuesByTemplate.get(e.key) ?? 0;
  return r`
      <uui-menu-item
        label=${e.name}
        href=${li(e.key)}
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
Me.styles = L`
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
pi([
  p()
], Me.prototype, "_templates", 2);
pi([
  p()
], Me.prototype, "_issuesByTemplate", 2);
pi([
  p()
], Me.prototype, "_loading", 2);
pi([
  p()
], Me.prototype, "_activeKey", 2);
pi([
  p()
], Me.prototype, "_expanded", 2);
Me = pi([
  R("di-templates-menu-item")
], Me);
function eu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const tu = Me, iu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return Me;
  },
  default: tu
}, Symbol.toStringTag, { value: "Module" }));
var au = Object.defineProperty, su = Object.getOwnPropertyDescriptor, Nn = (e) => {
  throw TypeError(e);
}, ht = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? su(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && au(t, i, s), s;
}, Qs = (e, t, i) => t.has(e) || Nn("Cannot " + i), Ee = (e, t, i) => (Qs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), sa = (e, t, i) => t.has(e) ? Nn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), No = (e, t, i, a) => (Qs(e, t, "write to private field"), t.set(e, i), i), S = (e, t, i) => (Qs(e, t, "access private method"), i), ha, Da, De, x, mi, me, Un, Fn, Bn, Kn, Vn, Hn, Gn, wi, jn, Xn, Yn, qn, Jn;
let fe = class extends N {
  constructor() {
    super(), sa(this, x), sa(this, ha), sa(this, Da), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, sa(this, De, () => {
      var e;
      return (e = Ee(this, ha)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ve, (e) => {
      No(this, Da, e);
    }), this.consumeContext(Ke, (e) => {
      No(this, ha, e), e && S(this, x, mi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${S(this, x, Hn).call(this)} ${S(this, x, Gn).call(this)} ${S(this, x, jn).call(this)} ${S(this, x, Xn).call(this)}
      </umb-body-layout>
    `;
  }
};
ha = /* @__PURE__ */ new WeakMap();
Da = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakMap();
x = /* @__PURE__ */ new WeakSet();
mi = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Hs(Ee(this, De)),
      Ei(Ee(this, De)).catch(() => []),
      Ka(Ee(this, De)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    S(this, x, me).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
me = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ee(this, Da)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Un = async function() {
  this._importing = !0;
  try {
    const e = await ln(Ee(this, De));
    S(this, x, me).call(this, e.created.length > 0 ? "positive" : "warning", e.created.length > 0 ? `Imported ${e.created.length} template(s)` : "Nothing was imported");
    for (const t of e.warnings.slice(0, 5)) S(this, x, me).call(this, "warning", t);
    di(), await S(this, x, mi).call(this);
  } catch (e) {
    S(this, x, me).call(this, "danger", "The import failed", e);
  } finally {
    this._importing = !1;
  }
};
Fn = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await rn(this._pasteJson, "create", Ee(this, De)), S(this, x, me).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, di(), await S(this, x, mi).call(this);
    } catch (e) {
      S(this, x, me).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
Bn = async function(e) {
  try {
    await on(e.key, Ee(this, De)), S(this, x, me).call(this, "positive", `'${e.name}' duplicated`), di(), await S(this, x, mi).call(this);
  } catch (t) {
    S(this, x, me).call(this, "danger", "The template could not be duplicated", t);
  }
};
Kn = async function(e) {
  await Vs(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await sn(e.key, Ee(this, De)), S(this, x, me).call(this, "positive", `'${e.name}' deleted`), di(), await S(this, x, mi).call(this);
  } catch (t) {
    S(this, x, me).call(this, "danger", "The template could not be deleted", t);
  }
};
Vn = async function(e) {
  try {
    const t = await nn(e.key, Ee(this, De)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    S(this, x, me).call(this, "danger", "The template could not be exported", t);
  }
};
Hn = function() {
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
            @click=${S(this, x, Un)}>
            Import from appsettings
          </uui-button>
        </div>
      </uui-box>
    `;
};
Gn = function() {
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
jn = function() {
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
        <uui-button look="secondary" href=${Sn("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Xn = function() {
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

        ${this._showPaste ? S(this, x, Yn).call(this) : m}
        ${this._templates.length === 0 ? S(this, x, qn).call(this) : S(this, x, Jn).call(this)}
      </uui-box>
    `;
};
Yn = function() {
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
          @click=${S(this, x, Fn)}>
          Import
        </uui-button>
      </div>
    `;
};
qn = function() {
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
Jn = function() {
  return r`
      <div class="cards">
        ${B(
    this._templates,
    (e) => e.key,
    (e) => r`
            <uui-box class="card ${e.isEnabled ? "" : "disabled"}">
              <div slot="headline">
                <a href=${li(e.key)}>${e.name}</a>
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
                <uui-button look="secondary" href=${li(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => S(this, x, Bn).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => S(this, x, Vn).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => S(this, x, Kn).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
fe.styles = L`
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
], fe.prototype, "_templates", 2);
ht([
  p()
], fe.prototype, "_fonts", 2);
ht([
  p()
], fe.prototype, "_health", 2);
ht([
  p()
], fe.prototype, "_loading", 2);
ht([
  p()
], fe.prototype, "_importing", 2);
ht([
  p()
], fe.prototype, "_pasteJson", 2);
ht([
  p()
], fe.prototype, "_showPaste", 2);
fe = ht([
  R("di-overview-dashboard")
], fe);
const ou = fe, nu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return fe;
  },
  default: ou
}, Symbol.toStringTag, { value: "Module" })), $s = /* @__PURE__ */ new Map(), Xa = (e) => `di-${e}`;
function ru(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = $s.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await fn(e, t), o = new FontFace(Xa(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return $s.set(e, a), a;
}
async function Zn(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => ru(a, t)));
}
function Qn(e) {
  $s.delete(e);
}
const lu = new Jo(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), cu = new Jo(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var uu = Object.defineProperty, hu = Object.getOwnPropertyDescriptor, er = (e) => {
  throw TypeError(e);
}, Ya = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && uu(t, i, s), s;
}, eo = (e, t, i) => t.has(e) || er("Cannot " + i), Pe = (e, t, i) => (eo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), _i = (e, t, i) => t.has(e) ? er("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ss = (e, t, i, a) => (eo(e, t, "write to private field"), t.set(e, i), i), A = (e, t, i) => (eo(e, t, "access private method"), i), da, zi, Mi, Ot, O, tr, fi, rt, xs, ir, ar, pa, sr, or, nr;
function du(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : pu(e.sourceUrl);
    default:
      return "Media library";
  }
}
function pu(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let lt = class extends N {
  constructor() {
    super(), _i(this, O), _i(this, da), _i(this, zi), _i(this, Mi), this._fonts = [], this._loading = !0, _i(this, Ot, () => {
      var e;
      return (e = Pe(this, da)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ua, (e) => {
      ss(this, zi, e);
    }), this.consumeContext(Ve, (e) => {
      ss(this, Mi, e);
    }), this.consumeContext(Ke, (e) => {
      ss(this, da, e), e && A(this, O, fi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${A(this, O, xs)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${A(this, O, xs)}>
                  Add your first font
                </uui-button>
              </div>` : r`${B(this._fonts, (e) => e.key, (e) => A(this, O, sr).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
da = /* @__PURE__ */ new WeakMap();
zi = /* @__PURE__ */ new WeakMap();
Mi = /* @__PURE__ */ new WeakMap();
Ot = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
tr = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
fi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Ei(Pe(this, Ot)), await Zn(this._fonts.map((e) => e.key), Pe(this, Ot));
  } catch (e) {
    A(this, O, rt).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
rt = function(e, t, i) {
  var s;
  const a = i instanceof nt ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Pe(this, Mi)) == null || s.peek(e, { data: { headline: t, message: a } });
};
xs = async function() {
  var i, a;
  if (!Pe(this, zi)) return;
  const e = Pe(this, zi).open(this, cu, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Pe(this, Mi)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await A(this, O, fi).call(this));
};
ir = async function(e) {
  try {
    await dn(e.key, Pe(this, Ot)), Qn(e.key), A(this, O, rt).call(this, "positive", `'${e.familyName}' refreshed`), await A(this, O, fi).call(this);
  } catch (t) {
    A(this, O, rt).call(this, "danger", "That font could not be refreshed", t);
  }
};
ar = async function(e) {
  await Vs(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await mn(e.key, Pe(this, Ot)), Qn(e.key), A(this, O, rt).call(this, "positive", `'${e.familyName}' deleted`), await A(this, O, fi).call(this);
  } catch (t) {
    A(this, O, rt).call(this, "danger", "That font could not be deleted", t);
  }
};
pa = async function(e, t, i, a) {
  try {
    await pn(e.key, t, i, Pe(this, Ot), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), A(this, O, rt).call(this, "positive", `'${t}' saved`), await A(this, O, fi).call(this), a != null && a.keepOpen && await A(this, O, tr).call(this);
  } catch (s) {
    A(this, O, rt).call(this, "danger", "The font could not be saved", s);
  }
};
sr = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${du(e)} · weight ${e.weight}
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
                  @click=${() => A(this, O, ir).call(this, e)}>
                  Refresh
                </uui-button>` : m}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => A(this, O, ar).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Xa(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? A(this, O, nr).call(this, e) : A(this, O, or).call(this, e)}
      </div>
    `;
};
or = function(e) {
  return e.styles.length === 0 ? m : r`<div class="tags">
      ${B(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
nr = function(e) {
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
      t.splice(a, 1), A(this, O, pa).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), A(this, O, pa).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    A(this, O, pa).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
lt.styles = L`
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
  R("di-fonts-dashboard")
], lt);
const mu = lt, fu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return lt;
  },
  default: mu
}, Symbol.toStringTag, { value: "Module" }));
var gu = Object.defineProperty, yu = Object.getOwnPropertyDescriptor, rr = (e) => {
  throw TypeError(e);
}, Yi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && gu(t, i, s), s;
}, to = (e, t, i) => t.has(e) || rr("Cannot " + i), Ze = (e, t, i) => (to(e, t, "read from private field"), i ? i.call(e) : t.get(e)), oa = (e, t, i) => t.has(e) ? rr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Uo = (e, t, i, a) => (to(e, t, "write to private field"), t.set(e, i), i), Vt = (e, t, i) => (to(e, t, "access private method"), i), ma, Ht, ci, at, Pa, ks, lr;
let Fe = class extends N {
  constructor() {
    super(), oa(this, at), oa(this, ma), oa(this, Ht), this._loading = !0, this._busy = !1, oa(this, ci, () => {
      var e;
      return (e = Ze(this, ma)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ve, (e) => {
      Uo(this, Ht, e);
    }), this.consumeContext(Ke, (e) => {
      Uo(this, ma, e), e && Vt(this, at, Pa).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Vt(this, at, Pa).call(this)}>Re-check</uui-button>
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
                        ${a.templateKey ? r`<a href=${li(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Vt(this, at, lr).call(this)}
      </umb-body-layout>
    `;
  }
};
ma = /* @__PURE__ */ new WeakMap();
Ht = /* @__PURE__ */ new WeakMap();
ci = /* @__PURE__ */ new WeakMap();
at = /* @__PURE__ */ new WeakSet();
Pa = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Ka(Ze(this, ci)),
      $n(Ze(this, ci)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
ks = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await xn(Ze(this, ci)) : await kn(Ze(this, ci));
    (t = Ze(this, Ht)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Ze(this, Ht)) == null || i.peek("warning", { data: { message: o } });
    await Vt(this, at, Pa).call(this);
  } catch (s) {
    (a = Ze(this, Ht)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
lr = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Vt(this, at, ks).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Vt(this, at, ks).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : m;
};
Fe.styles = L`
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
Yi([
  p()
], Fe.prototype, "_health", 2);
Yi([
  p()
], Fe.prototype, "_sync", 2);
Yi([
  p()
], Fe.prototype, "_loading", 2);
Yi([
  p()
], Fe.prototype, "_busy", 2);
Fe = Yi([
  R("di-health-dashboard")
], Fe);
const vu = Fe, bu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Fe;
  },
  default: vu
}, Symbol.toStringTag, { value: "Module" })), cr = 3, ur = 12, hr = 0.1, dr = 0.9;
function _u(e) {
  return Math.max(cr, Math.min(ur, e));
}
function wu(e) {
  return Math.max(hr, Math.min(dr, e));
}
function $u(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = _u(t), s = 0.5 * wu(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let h = 0; h < o; h++) {
    const f = (-90 + h * n) * Math.PI / 180, C = e === "star" && h % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + C * Math.cos(f), y: 0.5 + C * Math.sin(f) });
  }
  return l;
}
function xu(e, t, i) {
  const a = $u(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
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
  sides: { min: cr, max: ur },
  innerRatio: { min: hr, max: dr }
}, za = { min: 0.1, max: 4 };
function ku(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function Su(e, t) {
  const i = [], a = t.lockX ? void 0 : Fo(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Tu(t),
    t.threshold
  ), s = t.lockY ? void 0 : Fo(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    Cu(t),
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
function Tu(e) {
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
function Cu(e) {
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
function Fo(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var Eu = Object.defineProperty, Du = Object.getOwnPropertyDescriptor, pr = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Du(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Eu(t, i, s), s;
}, io = (e, t, i) => t.has(e) || pr("Cannot " + i), ve = (e, t, i) => (io(e, t, "read from private field"), i ? i.call(e) : t.get(e)), os = (e, t, i) => t.has(e) ? pr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ns = (e, t, i, a) => (io(e, t, "write to private field"), t.set(e, i), i), j = (e, t, i) => (io(e, t, "access private method"), i), gt, $i, M, qa, ao, mr, fr, gr, yr, so, Ma, vr, br, _r, wr, $r, xr, kr, Sr, Tr;
const Pu = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], rs = 18;
let we = class extends N {
  constructor() {
    super(...arguments), os(this, M), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, os(this, gt), os(this, $i);
  }
  willUpdate() {
    this._box = j(this, M, mr).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ve(this, $i) && ((t = ve(this, gt)) == null || t.disconnect(), ns(this, $i, e), e && (ve(this, gt) ?? ns(this, gt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ve(this, gt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ve(this, gt)) == null || e.disconnect(), ns(this, $i, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return m;
    const e = this._box;
    return r`
      <div
        class=${qo({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${V({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ve(this, M, fr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...j(this, M, so).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      j(this, M, vr).call(this, t), j(this, M, Ma).call(this, t);
    }}>
        ${j(this, M, br).call(this)}
      </div>

      ${this.selected ? j(this, M, Sr).call(this, e) : m}
      ${this.showMeasured && this.measured ? j(this, M, Tr).call(this) : m}
    `;
  }
};
gt = /* @__PURE__ */ new WeakMap();
$i = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
qa = function() {
  return this.resolvedPosition ?? this.layer.position;
};
ao = function() {
  return this.layer.rotation ?? 0;
};
mr = function() {
  var s;
  const e = this.layer, t = e.size.width ?? j(this, M, gr).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? j(this, M, yr).call(this), a = ja(ve(this, M, qa), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
fr = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
gr = function() {
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
yr = function() {
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
so = function(e) {
  const t = ve(this, M, ao);
  if (t === 0) return {};
  const i = ve(this, M, qa);
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
vr = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
br = function() {
  switch (this.layer.type) {
    case "text":
      return j(this, M, _r).call(this);
    case "image":
      return j(this, M, $r).call(this);
    case "badges":
      return j(this, M, xr).call(this);
    default:
      return j(this, M, kr).call(this);
  }
};
_r = function() {
  if (this.layer.type !== "text") return m;
  const e = this.layer.style, t = this.resolvedText || j(this, M, wr).call(this);
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
wr = function() {
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
$r = function() {
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
xr = function() {
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
            <div class=${qo({ badge: !0, right: f === "right" })}>
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
kr = function() {
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
  const n = xu(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${V({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${V({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
Sr = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = ve(this, M, qa), n = ve(this, M, ao), l = ze(this.layer.position, "x") || ze(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${V({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...j(this, M, so).call(this, e) })}>
        <span
          class="tag"
          style=${V(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : m}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? m : r`
              ${B(
    Pu,
    (h) => h,
    (h) => r`
                  <span
                    class="handle ${h}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${h}"
                    @pointerdown=${(f) => j(this, M, Ma).call(this, f, h)}>
                  </span>
                `
  )}
              <span class="stalk" style=${V({ height: `${rs}px`, top: `${-rs}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${V({ top: `${-rs}px` })}
                @pointerdown=${(h) => j(this, M, Ma).call(this, h, "rotate")}>
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
Tr = function() {
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
we.styles = L`
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
  b({ type: Object })
], we.prototype, "layer", 2);
He([
  b({ type: Number })
], we.prototype, "scale", 2);
He([
  b({ type: Boolean, reflect: !0 })
], we.prototype, "selected", 2);
He([
  b({ type: Object })
], we.prototype, "measured", 2);
He([
  b({ type: Boolean })
], we.prototype, "showMeasured", 2);
He([
  b({ type: String })
], we.prototype, "resolvedText", 2);
He([
  b({ attribute: !1 })
], we.prototype, "resolvedPosition", 2);
He([
  p()
], we.prototype, "_box", 2);
we = He([
  R("di-layer-box")
], we);
var zu = Object.defineProperty, Mu = Object.getOwnPropertyDescriptor, Cr = (e) => {
  throw TypeError(e);
}, oo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && zu(t, i, s), s;
}, Ou = (e, t, i) => t.has(e) || Cr("Cannot " + i), Iu = (e, t, i) => t.has(e) ? Cr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Au = (e, t, i) => (Ou(e, t, "access private method"), i), Ss, Er;
let Oi = class extends N {
  constructor() {
    super(...arguments), Iu(this, Ss), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${B(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => Au(this, Ss, Er).call(this, e)
    )}`;
  }
};
Ss = /* @__PURE__ */ new WeakSet();
Er = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Oi.styles = L`
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
oo([
  b({ type: Array })
], Oi.prototype, "guides", 2);
oo([
  b({ type: Number })
], Oi.prototype, "scale", 2);
Oi = oo([
  R("di-guides")
], Oi);
var Lu = Object.defineProperty, Ru = Object.getOwnPropertyDescriptor, Dr = (e) => {
  throw TypeError(e);
}, qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ru(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Lu(t, i, s), s;
}, Wu = (e, t, i) => t.has(e) || Dr("Cannot " + i), Nu = (e, t, i) => t.has(e) ? Dr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Bo = (e, t, i) => (Wu(e, t, "access private method"), i), fa, Ts;
let q = class extends N {
  constructor() {
    super(...arguments), Nu(this, fa), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Bo(this, fa, Ts).call(this, "top"), Bo(this, fa, Ts).call(this, "left");
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
fa = /* @__PURE__ */ new WeakSet();
Ts = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : q.thickness) * o, t.height = (e === "top" ? q.thickness : s) * o, t.style.width = `${e === "top" ? s : q.thickness}px`, t.style.height = `${e === "top" ? q.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const h = Math.round(l * this.scale) + 0.5, f = l % 100 === 0, C = f ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(h, q.thickness - C), i.lineTo(h, q.thickness)) : (i.moveTo(q.thickness - C, h), i.lineTo(q.thickness, h)), i.stroke(), f && l > 0 && (e === "top" ? i.fillText(String(l), h + 2, 9) : (i.save(), i.translate(9, h - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
q.thickness = 20;
q.styles = L`
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
qi([
  b({ type: Number })
], q.prototype, "canvasWidth", 2);
qi([
  b({ type: Number })
], q.prototype, "canvasHeight", 2);
qi([
  b({ type: Number })
], q.prototype, "scale", 2);
qi([
  b({ type: Object })
], q.prototype, "pointer", 2);
q = qi([
  R("di-rulers")
], q);
var Uu = Object.defineProperty, Fu = Object.getOwnPropertyDescriptor, Pr = (e) => {
  throw TypeError(e);
}, oe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Uu(t, i, s), s;
}, no = (e, t, i) => t.has(e) || Pr("Cannot " + i), I = (e, t, i) => (no(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ne = (e, t, i) => t.has(e) ? Pr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ga = (e, t, i, a) => (no(e, t, "write to private field"), t.set(e, i), i), z = (e, t, i) => (no(e, t, "access private method"), i), yt, xi, ot, E, ro, Cs, Es, Ja, lo, Ds, zr, Mr, co, Or, Ir, Ps, ya, Ar, Lr, Ut, uo, zs, Ms, Os, Rr, Is, As, Ls, Wr;
const Bu = 6, Nr = 20, Ku = 2, Vu = 15, Hu = 0.1;
let Q = class extends N {
  constructor() {
    super(...arguments), ne(this, E), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ne(this, yt), ne(this, xi), ne(this, ot, /* @__PURE__ */ new Map()), ne(this, Ps, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = z(this, E, lo).call(this, t), a = z(this, E, Ds).call(this, t), s = z(this, E, zr).call(this, t), o = z(this, E, Ja).call(this, e.detail.startX, e.detail.startY);
      ga(this, yt, {
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
    }), ne(this, ya, (e) => {
      var ia, Po;
      this._pointer = z(this, E, Es).call(this, e.clientX, e.clientY);
      const t = I(this, yt);
      if (!t) return;
      const i = this.template.layers.find((yi) => yi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        z(this, E, Lr).call(this, i, t, e);
        return;
      }
      const o = ze(i.position, "x"), n = ze(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        z(this, E, Ar).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let h = t.handle ? z(this, E, uo).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (h = { ...h, x: t.startBox.x, width: (ia = t.handle) != null && ia.includes("w") ? t.startBox.width : h.width }), n && (h = { ...h, y: t.startBox.y, height: (Po = t.handle) != null && Po.includes("n") ? t.startBox.height : h.height });
      const f = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, C = l !== 0 ? { x: h.x + f.x, y: h.y + f.y, width: t.startExtent.width, height: t.startExtent.height } : h, xe = this.snapEnabled && !e.altKey ? Su(C, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((yi) => yi.key !== i.key).map((yi) => z(this, E, Ds).call(this, yi)),
        threshold: Bu / this.scale,
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
      this._guides = xe.guides;
      const Ie = l !== 0 ? { ...h, x: xe.box.x - f.x, y: xe.box.y - f.y } : xe.box, Ye = Ic(Ie, i.position);
      o && (Ye.x = i.position.x), n && (Ye.y = i.position.y);
      const Ae = { position: Ye };
      t.handle && (Ae.size = {
        width: Math.max(1, Math.round(Ie.width)),
        height: Math.max(1, Math.round(Ie.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Ae } })
      );
    }), ne(this, Ut, () => {
      if (!I(this, yt)) return;
      const e = I(this, yt).moved;
      ga(this, yt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ne(this, zs, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ne(this, Ms, () => {
      this._dropTarget = !1;
    }), ne(this, Os, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = z(this, E, Es).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: z(this, E, Rr).call(this, e) }
        })
      );
    }), ne(this, Is, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ne(this, As, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Mn(t.position)) && this.requestUpdate();
    }), ne(this, Ls, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), ga(this, xi, new ResizeObserver(() => z(this, E, Cs).call(this))), I(this, xi).observe(this), window.addEventListener("pointermove", I(this, ya)), window.addEventListener("pointerup", I(this, Ut)), window.addEventListener("pointercancel", I(this, Ut));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = I(this, xi)) == null || e.disconnect(), window.removeEventListener("pointermove", I(this, ya)), window.removeEventListener("pointerup", I(this, Ut)), window.removeEventListener("pointercancel", I(this, Ut));
  }
  updated(e) {
    z(this, E, Cs).call(this), e.has("zoom") && z(this, E, ro).call(this);
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
    z(this, E, Mr).call(this);
    const s = this.showRulers ? Nr : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${I(this, Is)}
        @dragover=${I(this, zs)}
        @dragleave=${I(this, Ms)}
        @drop=${I(this, Os)}
        @di-layer-drag-start=${I(this, Ps)}
        @di-layer-box-resize=${I(this, As)}>
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
            @pointerdown=${I(this, Ls)}
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

            ${this.showSafeArea ? z(this, E, Wr).call(this) : m}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
yt = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
ot = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
ro = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Cs = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Nr : 0) + Ku, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, z(this, E, ro).call(this));
};
Es = function(e, t) {
  const i = z(this, E, Ja).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Ja = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
lo = function(e) {
  const t = I(this, ot).get(e.key);
  if (t) return t.box;
  const i = z(this, E, co).call(this, e), a = ja(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Ds = function(e) {
  const t = I(this, ot).get(e.key);
  return t ? t.extent : zn(z(this, E, lo).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
zr = function(e) {
  var t;
  return ((t = I(this, ot).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Mr = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  ga(this, ot, Uc(
    this.template.layers,
    (i) => z(this, E, co).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
co = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? z(this, E, Or).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? z(this, E, Ir).call(this, e, i)
  };
};
Or = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Ir = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Ps = /* @__PURE__ */ new WeakMap();
ya = /* @__PURE__ */ new WeakMap();
Ar = function(e, t, i, a, s, o, n, l) {
  const h = t.startRotation, f = t.startPosition, C = Ac(a, s, 0, 0, h);
  let X = z(this, E, uo).call(this, t.startBox, i, C.x, C.y, o);
  n && (X = { ...X, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : X.width }), l && (X = { ...X, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : X.height });
  const xe = Math.max(1, Math.round(X.width)), Ie = Math.max(1, Math.round(X.height)), Ye = Ys(X.x, X.y, xe, Ie, f.anchor), Ae = Bt(Ye.x, Ye.y, f.x, f.y, h), ia = {
    ...e.position,
    x: n ? e.position.x : Math.round(Ae.x),
    y: l ? e.position.y : Math.round(Ae.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: ia, size: { width: xe, height: Ie } } }
    })
  );
};
Lr = function(e, t, i) {
  const a = t.startPosition, s = z(this, E, Ja).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, h = i.shiftKey ? Vu : Hu, f = Pn(Math.round(l / h) * h);
  this._guides = [], f !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: f } }
    })
  );
};
Ut = /* @__PURE__ */ new WeakMap();
uo = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: h } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, h = e.height - a), t.includes("s") && (h = e.height + a), s && e.width > 0 && e.height > 0) {
    const f = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(h - e.height) ? h = l / f : l = h * f, t.includes("n") && (n = e.y + e.height - h), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, h) };
};
zs = /* @__PURE__ */ new WeakMap();
Ms = /* @__PURE__ */ new WeakMap();
Os = /* @__PURE__ */ new WeakMap();
Rr = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Is = /* @__PURE__ */ new WeakMap();
As = /* @__PURE__ */ new WeakMap();
Ls = /* @__PURE__ */ new WeakMap();
Wr = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${V({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
Q.styles = L`
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
oe([
  b({ type: Object })
], Q.prototype, "template", 2);
oe([
  b({ type: String })
], Q.prototype, "selectedLayerKey", 2);
oe([
  b({ type: Object })
], Q.prototype, "baseImageUrl", 2);
oe([
  b({ type: Array })
], Q.prototype, "serverBounds", 2);
oe([
  b({ type: Boolean })
], Q.prototype, "showMeasured", 2);
oe([
  b({ type: Boolean })
], Q.prototype, "snapEnabled", 2);
oe([
  b({ type: Boolean })
], Q.prototype, "showRulers", 2);
oe([
  b({ type: Boolean })
], Q.prototype, "showSafeArea", 2);
oe([
  b({ type: Number })
], Q.prototype, "zoom", 2);
oe([
  p()
], Q.prototype, "_fitScale", 2);
oe([
  p()
], Q.prototype, "_guides", 2);
oe([
  p()
], Q.prototype, "_pointer", 2);
oe([
  p()
], Q.prototype, "_dropTarget", 2);
Q = oe([
  R("di-designer-canvas")
], Q);
var Gu = Object.defineProperty, ju = Object.getOwnPropertyDescriptor, Ur = (e) => {
  throw TypeError(e);
}, ho = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ju(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gu(t, i, s), s;
}, Fr = (e, t, i) => t.has(e) || Ur("Cannot " + i), Xu = (e, t, i) => (Fr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Yu = (e, t, i) => t.has(e) ? Ur("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ce = (e, t, i) => (Fr(e, t, "access private method"), i), ce, Br, Kr, Vr, Hr, Gr, bt;
const Ko = {
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
let Ii = class extends N {
  constructor() {
    super(...arguments), Yu(this, ce), this.properties = [], this._search = "";
  }
  render() {
    const e = qu(Xu(this, ce, Br));
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
      ([t, i]) => Ce(this, ce, Hr).call(this, t, i)
    )}

        ${Ce(this, ce, Gr).call(this)}
      </div>
    `;
  }
};
ce = /* @__PURE__ */ new WeakSet();
Br = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Kr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Vr = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Hr = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${B(
    t,
    (i) => i.alias,
    (i) => Ce(this, ce, bt).call(
      this,
      i.name,
      Ko[i.classification] ?? Ko.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Gr = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Ce(this, ce, bt).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Ce(this, ce, bt).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Ce(this, ce, bt).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Ce(this, ce, bt).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Ce(this, ce, bt).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
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
        @dragstart=${(n) => Ce(this, ce, Vr).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => Ce(this, ce, Kr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Ii.styles = L`
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
ho([
  b({ type: Array })
], Ii.prototype, "properties", 2);
ho([
  p()
], Ii.prototype, "_search", 2);
Ii = ho([
  R("di-property-palette")
], Ii);
function qu(e) {
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
var Ju = Object.defineProperty, Zu = Object.getOwnPropertyDescriptor, jr = (e) => {
  throw TypeError(e);
}, Za = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ju(t, i, s), s;
}, Xr = (e, t, i) => t.has(e) || jr("Cannot " + i), Qe = (e, t, i) => (Xr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Qu = (e, t, i) => t.has(e) ? jr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Si = (e, t, i) => (Xr(e, t, "access private method"), i), ie, Ai, Ti, Qa, Yr, qr;
let ui = class extends N {
  constructor() {
    super(...arguments), Qu(this, ie), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Qe(this, ie, Ai)};opacity:${Qe(this, ie, Ti)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Si(this, ie, Qa).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Qe(this, ie, Ai)}
                  @input=${(e) => Si(this, ie, Yr).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Qe(this, ie, Ti))}
                    @input=${(e) => Si(this, ie, qr).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Qe(this, ie, Ti) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
ie = /* @__PURE__ */ new WeakSet();
Ai = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
Ti = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
Qa = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Yr = function(e) {
  const t = Qe(this, ie, Ti);
  Si(this, ie, Qa).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${Jr(t)}`);
};
qr = function(e) {
  Si(this, ie, Qa).call(this, e >= 0.999 ? Qe(this, ie, Ai).toUpperCase() : `${Qe(this, ie, Ai).toUpperCase()}${Jr(e)}`);
};
ui.styles = L`
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
], ui.prototype, "value", 2);
Za([
  b({ type: String })
], ui.prototype, "label", 2);
Za([
  p()
], ui.prototype, "_open", 2);
ui = Za([
  R("di-colour-input")
], ui);
const Jr = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var eh = Object.defineProperty, th = Object.getOwnPropertyDescriptor, Zr = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? th(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && eh(t, i, s), s;
};
const Vo = {
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
let Oa = class extends N {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${B(
      Dn,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Vo[e]}
              title=${Vo[e]}
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
Oa.styles = L`
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
Zr([
  b({ type: String })
], Oa.prototype, "value", 2);
Oa = Zr([
  R("di-anchor-picker")
], Oa);
var ih = Object.defineProperty, ah = Object.getOwnPropertyDescriptor, Qr = (e) => {
  throw TypeError(e);
}, dt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ah(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ih(t, i, s), s;
}, sh = (e, t, i) => t.has(e) || Qr("Cannot " + i), oh = (e, t, i) => t.has(e) ? Qr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), nh = (e, t, i) => (sh(e, t, "access private method"), i), Rs, el;
let Oe = class extends N {
  constructor() {
    super(...arguments), oh(this, Rs), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${nh(this, Rs, el)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : m}
        </span>
      </label>
    `;
  }
};
Rs = /* @__PURE__ */ new WeakSet();
el = function(e) {
  const t = e.target, i = t.value, a = ku(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Oe.styles = L`
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
  R("di-number-field")
], Oe);
var rh = Object.defineProperty, lh = Object.getOwnPropertyDescriptor, tl = (e) => {
  throw TypeError(e);
}, Ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? lh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && rh(t, i, s), s;
}, ch = (e, t, i) => t.has(e) || tl("Cannot " + i), uh = (e, t, i) => t.has(e) ? tl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (ch(e, t, "access private method"), i), u, y, qe, il, al, sl, ol, nl, rl, ll, cl, Ws, ul, va, hl, dl, gi, po, pl;
let It = class extends N {
  constructor() {
    super(...arguments), uh(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? d(this, u, al).call(this, this.layer) : d(this, u, il).call(this)}</div>` : m;
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
qe = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
il = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => d(this, u, qe).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => d(this, u, qe).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Background</span>
          <di-colour-input
            label="Canvas background"
            .value=${e.background}
            @change=${(t) => d(this, u, qe).call(this, { background: t.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${ml(e.baseImage.kind)}
              @change=${(t) => d(this, u, qe).call(this, {
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
                @change=${(t) => d(this, u, qe).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : m}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${d(this, u, gi).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, qe).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : m}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${se(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => d(this, u, qe).call(this, { baseImageFit: t.target.value })}>
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
al = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, y).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, sl).call(this, e) : m}
      ${e.type === "text" ? d(this, u, ol).call(this, e) : m}
      ${e.type === "image" ? d(this, u, nl).call(this, e) : m}
      ${e.type === "badges" ? d(this, u, rl).call(this, e) : m}
      ${e.type === "rect" ? d(this, u, ll).call(this, e) : m}
      ${d(this, u, cl).call(this, e)} ${d(this, u, dl).call(this, e)}
    `;
};
sl = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${se(
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
              ${d(this, u, gi).call(this, t.propertyAlias ?? "", (i) => d(this, u, y).call(this, { binding: { ...t, propertyAlias: i } }))}
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
ol = function(e) {
  const t = e.style, i = (a) => d(this, u, y).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, po).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${d(this, u, pl).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
              .options=${se(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${se(["left", "centre", "right"], t.textAlign)}
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
              .options=${se(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${se(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
nl = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${ml(t.kind)}
            @change=${(a) => d(this, u, y).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${d(this, u, gi).call(this, t.propertyAlias ?? "", (a) => d(this, u, y).call(this, { source: { ...t, propertyAlias: a } }), "media")}
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
            .options=${se(["cover", "contain", "stretch"], e.fit)}
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
rl = function(e) {
  const t = (s) => d(this, u, y).call(this, { badge: { ...e.badge, ...s } }), i = (s) => d(this, u, y).call(this, { label: { ...e.label, ...s } }), a = (s) => d(this, u, y).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${d(this, u, gi).call(this, e.itemsPropertyAlias, (s) => d(this, u, y).call(this, { itemsPropertyAlias: s }))}
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
            .options=${se(["horizontal", "vertical"], e.direction)}
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
            .options=${se(["below", "right", "none"], e.label.position, {
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
                  .options=${d(this, u, po).call(this, e.label.fontKey)}
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
                  .options=${se(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
ll = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${se(["rectangle", "ellipse", "polygon", "star"], t)}
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
cl = function(e) {
  const t = ze(e.position, "x"), i = ze(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${d(this, u, Ws).call(this, e, "x")} ${d(this, u, Ws).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => d(this, u, hl).call(this, e, s.detail.value)}>
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
            @change=${(s) => d(this, u, y).call(this, { rotation: Pn(s.detail.value ?? 0) })}>
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
Ws = function(e, t) {
  const i = ze(e.position, t), a = Ta(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => d(this, u, ul).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => d(this, u, va).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${se(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => d(this, u, va).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${g.referenceGap.min}
                .max=${g.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => d(this, u, va).call(this, e, t, { gap: n.detail.value ?? 0 })}>
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
ul = function(e, t, i) {
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
        gap: Lc
      }
    }
  });
};
va = function(e, t, i) {
  const a = Ta(e.position, t);
  a && d(this, u, y).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
hl = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? Oc(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, y).call(this, { position: s });
};
dl = function(e) {
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
            .options=${se(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
              ${d(this, u, gi).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, y).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : m}
      </uui-box>
    `;
};
gi = function(e, t, i) {
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
po = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
pl = function(e, t, i) {
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
It.styles = L`
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
Ji([
  b({ type: Object })
], It.prototype, "template", 2);
Ji([
  b({ type: Object })
], It.prototype, "layer", 2);
Ji([
  b({ type: Array })
], It.prototype, "properties", 2);
Ji([
  b({ type: Array })
], It.prototype, "fonts", 2);
It = Ji([
  R("di-layer-inspector")
], It);
function se(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function ml(e) {
  return se(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var hh = Object.defineProperty, dh = Object.getOwnPropertyDescriptor, fl = (e) => {
  throw TypeError(e);
}, Zi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? dh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && hh(t, i, s), s;
}, ph = (e, t, i) => t.has(e) || fl("Cannot " + i), mh = (e, t, i) => t.has(e) ? fl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ke = (e, t, i) => (ph(e, t, "access private method"), i), de, _t, gl, yl, vl, bl;
const fh = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let At = class extends N {
  constructor() {
    super(...arguments), mh(this, de), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${ke(this, de, vl)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : B(
      e,
      (t) => t.key,
      (t, i) => ke(this, de, bl).call(this, t, i)
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
de = /* @__PURE__ */ new WeakSet();
_t = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
gl = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
yl = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
vl = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  ke(this, de, _t).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
bl = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => ke(this, de, gl).call(this, a, e.key)}
        @dragover=${(a) => ke(this, de, yl).call(this, a, t)}
        @click=${() => ke(this, de, _t).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${fh[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, de, _t).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, de, _t).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, de, _t).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, de, _t).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
At.styles = L`
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
Zi([
  b({ type: Array })
], At.prototype, "layers", 2);
Zi([
  b({ type: String })
], At.prototype, "selectedLayerKey", 2);
Zi([
  p()
], At.prototype, "_dragKey", 2);
Zi([
  p()
], At.prototype, "_dropIndex", 2);
At = Zi([
  R("di-layers-panel")
], At);
var gh = Object.defineProperty, yh = Object.getOwnPropertyDescriptor, _l = (e) => {
  throw TypeError(e);
}, Ge = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && gh(t, i, s), s;
}, mo = (e, t, i) => t.has(e) || _l("Cannot " + i), vh = (e, t, i) => (mo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ho = (e, t, i) => t.has(e) ? _l("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), bh = (e, t, i, a) => (mo(e, t, "write to private field"), t.set(e, i), i), ae = (e, t, i) => (mo(e, t, "access private method"), i), Y, Re, Ia, wl, $l, ki;
let $e = class extends N {
  constructor() {
    super(...arguments), Ho(this, Y), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Ho(this, Ia, 100);
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
            @click=${() => ae(this, Y, Re).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${za.min * 100}
            .max=${za.max * 100}
            .value=${ae(this, Y, wl).call(this)}
            @change=${ae(this, Y, $l)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => ae(this, Y, Re).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => ae(this, Y, Re).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${ae(this, Y, ki).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${ae(this, Y, ki).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${ae(this, Y, ki).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${ae(this, Y, ki).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => ae(this, Y, Re).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => ae(this, Y, Re).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => ae(this, Y, Re).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
Y = /* @__PURE__ */ new WeakSet();
Re = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Ia = /* @__PURE__ */ new WeakMap();
wl = function() {
  return this.matches(":focus-within") || bh(this, Ia, Math.round(this.effectiveScale * 100)), vh(this, Ia);
};
$l = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && ae(this, Y, Re).call(this, "di-zoom-change", { zoom: t / 100 });
};
ki = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => ae(this, Y, Re).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
$e.styles = L`
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
Ge([
  b({ type: Number })
], $e.prototype, "effectiveScale", 2);
Ge([
  b({ type: Boolean })
], $e.prototype, "snapEnabled", 2);
Ge([
  b({ type: Boolean })
], $e.prototype, "showRulers", 2);
Ge([
  b({ type: Boolean })
], $e.prototype, "showSafeArea", 2);
Ge([
  b({ type: Boolean })
], $e.prototype, "showMeasured", 2);
Ge([
  b({ type: Boolean })
], $e.prototype, "canUndo", 2);
Ge([
  b({ type: Boolean })
], $e.prototype, "canRedo", 2);
Ge([
  b({ type: Boolean })
], $e.prototype, "previewing", 2);
$e = Ge([
  R("di-canvas-toolbar")
], $e);
var _h = Object.defineProperty, wh = Object.getOwnPropertyDescriptor, xl = (e) => {
  throw TypeError(e);
}, Qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && _h(t, i, s), s;
}, fo = (e, t, i) => t.has(e) || xl("Cannot " + i), Z = (e, t, i) => (fo(e, t, "read from private field"), t.get(e)), pt = (e, t, i) => t.has(e) ? xl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Dt = (e, t, i, a) => (fo(e, t, "write to private field"), t.set(e, i), i), Ue = (e, t, i) => (fo(e, t, "access private method"), i), et, Gt, jt, Pt, Aa, La, be, go, ba, yo, Ns;
const $h = 400;
let Lt = class extends N {
  constructor() {
    super(), pt(this, be), pt(this, et), pt(this, Gt), pt(this, jt), pt(this, Pt), pt(this, Aa), pt(this, La, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(Wt, (e) => {
      Dt(this, et, e), e && (this.observe(e.template, (t) => {
        t && Ue(this, be, ba).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Dt(this, Aa, t);
        const i = (a = Z(this, et)) == null ? void 0 : a.getData();
        i && Ue(this, be, ba).call(this, i);
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
    const e = (t = Z(this, et)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(Z(this, Gt)), this._collapsed = !1, Ue(this, be, yo).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(Z(this, Gt)), (e = Z(this, jt)) == null || e.abort(), Ue(this, be, go).call(this);
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
        const t = (e = Z(this, et)) == null ? void 0 : e.getData();
        t && Ue(this, be, ba).call(this, t);
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
Gt = /* @__PURE__ */ new WeakMap();
jt = /* @__PURE__ */ new WeakMap();
Pt = /* @__PURE__ */ new WeakMap();
Aa = /* @__PURE__ */ new WeakMap();
La = /* @__PURE__ */ new WeakMap();
be = /* @__PURE__ */ new WeakSet();
go = function() {
  Z(this, Pt) && (URL.revokeObjectURL(Z(this, Pt)), Dt(this, Pt, void 0));
};
ba = function(e) {
  this._collapsed || (window.clearTimeout(Z(this, Gt)), Dt(this, Gt, window.setTimeout(() => void Ue(this, be, yo).call(this, e), $h)));
};
yo = async function(e) {
  var t;
  if (Z(this, et)) {
    (t = Z(this, jt)) == null || t.abort(), Dt(this, jt, new AbortController()), Ue(this, be, Ns).call(this, !0), this._error = void 0;
    try {
      const i = await Gs(
        e,
        {
          signal: Z(this, jt).signal,
          contentKey: Z(this, Aa),
          useSampleData: Z(this, La)
        },
        Z(this, et).getToken
      );
      Ue(this, be, go).call(this), Dt(this, Pt, URL.createObjectURL(i)), this._url = Z(this, Pt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ue(this, be, Ns).call(this, !1);
    }
  }
};
Ns = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Lt.styles = L`
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
Qi([
  p()
], Lt.prototype, "_url", 2);
Qi([
  p()
], Lt.prototype, "_loading", 2);
Qi([
  p()
], Lt.prototype, "_error", 2);
Qi([
  p()
], Lt.prototype, "_collapsed", 2);
Lt = Qi([
  R("di-preview-strip")
], Lt);
var xh = Object.defineProperty, kh = Object.getOwnPropertyDescriptor, kl = (e) => {
  throw TypeError(e);
}, ee = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && xh(t, i, s), s;
}, vo = (e, t, i) => t.has(e) || kl("Cannot " + i), v = (e, t, i) => (vo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), mt = (e, t, i) => t.has(e) ? kl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ci = (e, t, i, a) => (vo(e, t, "write to private field"), t.set(e, i), i), te = (e, t, i) => (vo(e, t, "access private method"), i), $, Li, Ri, Wi, Xt, W, Us, bo, Sl, Tl, Fs, Cl, El, Dl, Bs, Pl, zl, Ml, Ol, _o, Il, _a;
const Sh = 400;
let F = class extends N {
  constructor() {
    super(), mt(this, W), mt(this, $), mt(this, Li), mt(this, Ri), mt(this, Wi), mt(this, Xt), this._properties = [], this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, mt(this, _a, (e) => {
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
      const s = v(this, W, Us);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), te(this, W, Fs).call(this, s.key);
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
      Ci(this, Li, e);
    }), this.consumeContext(Ve, (e) => {
      Ci(this, Ri, e);
    }), this.consumeContext(Wt, (e) => {
      Ci(this, $, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (te(this, W, Cl).call(this, t), te(this, W, El).call(this, t), te(this, W, Dl).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", v(this, _a));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", v(this, _a)), window.clearTimeout(v(this, Wi)), (e = v(this, Xt)) == null || e.abort();
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
        @di-layer-delete=${(e) => te(this, W, Fs).call(this, e.detail.key)}
        @di-layer-detach=${(e) => te(this, W, Tl).call(this, e.detail.key, e.detail.axis)}
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
        @di-palette-add=${(e) => te(this, W, Bs).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => te(this, W, Bs).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-pick-base-image=${te(this, W, Ml)}
        @di-pick-layer-image=${(e) => te(this, W, Ol).call(this, e.detail.key)}
        @di-use-image-size=${te(this, W, Il)}
        @di-request-preview=${() => {
      var e;
      return (e = v(this, W, Sl)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(za.min, Math.min(za.max, e.detail.zoom));
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
            .layer=${v(this, W, Us)}
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
Li = /* @__PURE__ */ new WeakMap();
Ri = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakSet();
Us = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
bo = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Sl = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Tl = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = v(this, W, bo)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = v(this, $)) == null || n.updateLayer(e, { position: fs(i.position, t, a) });
};
Fs = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = v(this, W, bo)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = v(this, $)) == null || s.removeLayer(e, t);
};
Cl = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && v(this, $) && await Zn(t, v(this, $).getToken);
};
El = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !v(this, $)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Xs(t.mediaKey, v(this, $).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Dl = function() {
  window.clearTimeout(v(this, Wi)), Ci(this, Wi, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !v(this, $))) {
      (t = v(this, Xt)) == null || t.abort(), Ci(this, Xt, new AbortController());
      try {
        const i = await js(
          e,
          { signal: v(this, Xt).signal, useSampleData: !0 },
          v(this, $).getToken
        );
        v(this, $).setServerBounds(i.layers), v(this, $).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, Sh));
};
Bs = function(e, t, i, a) {
  const s = this._template;
  if (!s || !v(this, $)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: te(this, W, zl).call(this) };
  if (e.kind === "property") {
    const l = Pc(e.property, o);
    if (l.kind === "condition") {
      te(this, W, Pl).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    v(this, $).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? Cn(o, "Image") : e.layerType === "badges" ? En(o, "Badges", "") : e.layerType === "rect" ? Ec(o, "Shape", e.shape) : Tn(o, "Text", { kind: "static", text: "Text" });
  v(this, $).addLayer(n);
};
Pl = function(e, t, i) {
  var o, n, l, h;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((f) => f.key === a);
  if (!s) {
    (n = v(this, Ri)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = v(this, $)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (h = v(this, Ri)) == null || h.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
zl = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Ml = async function() {
  var t;
  const e = await te(this, W, _o).call(this);
  e && ((t = v(this, $)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
Ol = async function(e) {
  var i;
  const t = await te(this, W, _o).call(this);
  t && ((i = v(this, $)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
_o = async function() {
  if (!v(this, Li)) return;
  const e = v(this, Li).open(this, Qo, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
Il = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !v(this, $)) return;
  const t = await Xs(e.mediaKey, v(this, $).getToken).catch(() => {
  });
  t && v(this, $).updateCanvas({ width: t.width, height: t.height });
};
_a = /* @__PURE__ */ new WeakMap();
F.styles = L`
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
ee([
  p()
], F.prototype, "_template", 2);
ee([
  p()
], F.prototype, "_selectedKey", 2);
ee([
  p()
], F.prototype, "_properties", 2);
ee([
  p()
], F.prototype, "_fonts", 2);
ee([
  p()
], F.prototype, "_serverBounds", 2);
ee([
  p()
], F.prototype, "_baseImageUrl", 2);
ee([
  p()
], F.prototype, "_zoom", 2);
ee([
  p()
], F.prototype, "_effectiveScale", 2);
ee([
  p()
], F.prototype, "_previewing", 2);
ee([
  p()
], F.prototype, "_snapEnabled", 2);
ee([
  p()
], F.prototype, "_showRulers", 2);
ee([
  p()
], F.prototype, "_showSafeArea", 2);
ee([
  p()
], F.prototype, "_showMeasured", 2);
ee([
  p()
], F.prototype, "_canUndo", 2);
ee([
  p()
], F.prototype, "_canRedo", 2);
F = ee([
  R("di-design-view")
], F);
const Th = F, Ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return F;
  },
  default: Th
}, Symbol.toStringTag, { value: "Module" }));
var Eh = Object.defineProperty, Dh = Object.getOwnPropertyDescriptor, Al = (e) => {
  throw TypeError(e);
}, je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Eh(t, i, s), s;
}, wo = (e, t, i) => t.has(e) || Al("Cannot " + i), K = (e, t, i) => (wo(e, t, "read from private field"), t.get(e)), Nt = (e, t, i) => t.has(e) ? Al("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Yt = (e, t, i, a) => (wo(e, t, "write to private field"), t.set(e, i), i), J = (e, t, i) => (wo(e, t, "access private method"), i), pe, Ni, Ui, qt, zt, H, Ll, Ra, Rl, Wl, $o, Nl, Fi, Ul, Fl, Bl;
let ue = class extends N {
  constructor() {
    super(), Nt(this, H), Nt(this, pe), Nt(this, Ni), Nt(this, Ui), Nt(this, qt), Nt(this, zt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Ua, (e) => {
      Yt(this, Ni, e);
    }), this.consumeContext(Ve, (e) => {
      Yt(this, Ui, e);
    }), this.consumeContext(Wt, (e) => {
      Yt(this, pe, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && J(this, H, Ll).call(this);
      });
    });
  }
  connectedCallback() {
    super.connectedCallback(), J(this, H, Fi).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = K(this, qt)) == null || e.abort(), J(this, H, $o).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${J(this, H, Nl)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => J(this, H, Fi).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${J(this, H, Fl)}>
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
      (e) => J(this, H, Bl).call(this, e)
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
                @click=${J(this, H, Ul)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : m}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
pe = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
Ui = /* @__PURE__ */ new WeakMap();
qt = /* @__PURE__ */ new WeakMap();
zt = /* @__PURE__ */ new WeakMap();
H = /* @__PURE__ */ new WeakSet();
Ll = async function() {
  var t;
  const e = J(this, H, Rl).call(this);
  e && (this._sampleNode = e, (t = K(this, pe)) == null || t.setSampleContentKey(e.key), await J(this, H, Fi).call(this));
};
Ra = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
Rl = function() {
  try {
    const e = localStorage.getItem(J(this, H, Ra).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
Wl = function(e) {
  try {
    e ? localStorage.setItem(J(this, H, Ra).call(this), JSON.stringify(e)) : localStorage.removeItem(J(this, H, Ra).call(this));
  } catch {
  }
};
$o = function() {
  K(this, zt) && (URL.revokeObjectURL(K(this, zt)), Yt(this, zt, void 0));
};
Nl = async function() {
  var i, a, s;
  if (!K(this, Ni) || !this._template) return;
  const e = K(this, Ni).open(this, lu, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, J(this, H, Wl).call(this, t.item), (s = K(this, pe)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await J(this, H, Fi).call(this));
};
Fi = async function() {
  var i, a;
  const e = this._template;
  if (!e || !K(this, pe)) return;
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
      Gs(e, t, K(this, pe).getToken),
      js(e, t, K(this, pe).getToken)
    ]);
    J(this, H, $o).call(this), Yt(this, zt, URL.createObjectURL(s)), this._url = K(this, zt), this._bounds = o.layers, this._skipped = o.skipped ?? [], K(this, pe).setServerBounds(o.layers), K(this, pe).setIssues(o.issues);
  } catch (s) {
    if ((s == null ? void 0 : s.name) === "AbortError") return;
    this._error = s instanceof Error ? s.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Ul = async function() {
  var e, t;
  if (!(!this._sampleNode || !K(this, pe))) {
    this._regenerating = !0;
    try {
      const i = await Ba(this._sampleNode.key, K(this, pe).getToken);
      (e = K(this, Ui)) == null || e.peek(i.outcome === "generated" ? "positive" : "warning", {
        data: { message: `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = K(this, Ui)) == null || t.peek("danger", {
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
Fl = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Bl = function(e) {
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
ue.styles = L`
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
je([
  p()
], ue.prototype, "_template", 2);
je([
  p()
], ue.prototype, "_sampleNode", 2);
je([
  p()
], ue.prototype, "_bounds", 2);
je([
  p()
], ue.prototype, "_skipped", 2);
je([
  p()
], ue.prototype, "_url", 2);
je([
  p()
], ue.prototype, "_loading", 2);
je([
  p()
], ue.prototype, "_error", 2);
je([
  p()
], ue.prototype, "_regenerating", 2);
ue = je([
  R("di-preview-view")
], ue);
const Ph = ue, zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return ue;
  },
  default: Ph
}, Symbol.toStringTag, { value: "Module" }));
var Mh = Object.defineProperty, Oh = Object.getOwnPropertyDescriptor, Kl = (e) => {
  throw TypeError(e);
}, es = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Oh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Mh(t, i, s), s;
}, xo = (e, t, i) => t.has(e) || Kl("Cannot " + i), U = (e, t, i) => (xo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ls = (e, t, i) => t.has(e) ? Kl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Go = (e, t, i, a) => (xo(e, t, "write to private field"), t.set(e, i), i), st = (e, t, i) => (xo(e, t, "access private method"), i), G, Rt, _e, Vl, Hl, Gl, jl, Xl, Yl, ql, Jl, Zl;
let ct = class extends N {
  constructor() {
    super(), ls(this, _e), ls(this, G), ls(this, Rt), this._properties = [], this._showAdvanced = !1, this.consumeContext(Ua, (e) => {
      Go(this, Rt, e);
    }), this.consumeContext(Wt, (e) => {
      Go(this, G, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${st(this, _e, Yl).call(this)} ${st(this, _e, ql).call(this)} ${st(this, _e, Jl).call(this)} ${st(this, _e, Zl).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
G = /* @__PURE__ */ new WeakMap();
Rt = /* @__PURE__ */ new WeakMap();
_e = /* @__PURE__ */ new WeakSet();
Vl = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Hl = async function() {
  var a, s;
  if (!U(this, Rt) || !this._template) return;
  const e = U(this, Rt).open(this, mc, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await st(this, _e, Gl).call(this, t.selection.filter((o) => !!o));
  (a = U(this, G)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = U(this, G)) == null ? void 0 : s.reloadProperties());
};
Gl = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => Cc), i = await t(U(this, G).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
jl = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = U(this, G)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = U(this, G)) == null || s.reloadProperties();
};
Xl = async function() {
  var i;
  if (!U(this, Rt)) return;
  const e = U(this, Rt).open(this, Qo, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = U(this, G)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
Yl = function() {
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
                          @click=${() => st(this, _e, jl).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${st(this, _e, Hl)}>
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
    ...U(this, _e, Vl).map((t) => ({
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
ql = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${st(this, _e, Xl)}>Choose</uui-button>
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
Jl = function() {
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
Zl = function() {
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
ct.styles = L`
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
  R("di-settings-view")
], ct);
const Ih = ct, Ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return ct;
  },
  default: Ih
}, Symbol.toStringTag, { value: "Module" }));
var Lh = Object.defineProperty, Rh = Object.getOwnPropertyDescriptor, Ql = (e) => {
  throw TypeError(e);
}, ea = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Lh(t, i, s), s;
}, ko = (e, t, i) => t.has(e) || Ql("Cannot " + i), jo = (e, t, i) => (ko(e, t, "read from private field"), t.get(e)), Xo = (e, t, i) => t.has(e) ? Ql("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Wh = (e, t, i, a) => (ko(e, t, "write to private field"), t.set(e, i), i), Yo = (e, t, i) => (ko(e, t, "access private method"), i), Bi, wa, Ks;
let Be = class extends N {
  constructor() {
    super(), Xo(this, wa), Xo(this, Bi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Wt, (e) => {
      Wh(this, Bi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Yo(this, wa, Ks).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Yo(this, wa, Ks).call(this)}>Reload</uui-button>
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
Bi = /* @__PURE__ */ new WeakMap();
wa = /* @__PURE__ */ new WeakSet();
Ks = async function() {
  const e = this._template;
  if (!(!e || !jo(this, Bi))) {
    this._loading = !0;
    try {
      this._usage = await wn(e.key, jo(this, Bi).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Be.styles = L`
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
ea([
  p()
], Be.prototype, "_template", 2);
ea([
  p()
], Be.prototype, "_usage", 2);
ea([
  p()
], Be.prototype, "_loading", 2);
ea([
  p()
], Be.prototype, "_onlyMissing", 2);
Be = ea([
  R("di-usage-view")
], Be);
const Nh = Be, Uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Be;
  },
  default: Nh
}, Symbol.toStringTag, { value: "Module" })), Fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Mo,
  default: Mo
}, Symbol.toStringTag, { value: "Module" })), Bh = 1500;
var ge, Ct, Na, ec;
class cs extends yc {
  constructor(i, a) {
    super(i, a);
    w(this, Na);
    w(this, ge);
    w(this, Ct);
    this.consumeContext(Ve, (s) => {
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
      await Vs(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await vn(a.key, !1, i.getToken);
        (o = c(this, ge)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await P(this, Na, ec).call(this, l, i);
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
    c(this, Ct) && await _n(i, c(this, Ct).getToken);
  }
}
ge = new WeakMap(), Ct = new WeakMap(), Na = new WeakSet(), ec = async function(i, a) {
  var o, n, l, h;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((f) => setTimeout(f, Bh));
    try {
      s = await bn(s.id, a.getToken);
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
const Kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: cs,
  api: cs,
  default: cs
}, Symbol.toStringTag, { value: "Module" }));
var Hi, ni;
class us extends _c {
  constructor(i, a) {
    super(i, a);
    w(this, Hi);
    w(this, ni);
    this.consumeContext(Ke, (s) => {
      _(this, Hi, s);
    }), this.consumeContext(Ve, (s) => {
      _(this, ni, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Ba(i, () => {
          var n;
          return (n = c(this, Hi)) == null ? void 0 : n.getLatestToken();
        });
        (a = c(this, ni)) == null || a.peek(o.outcome === "generated" ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: o.outcome === "generated" ? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof nt && o.status === 404;
        (s = c(this, ni)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof nt ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Hi = new WeakMap(), ni = new WeakMap();
const Vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: us,
  api: us,
  default: us
}, Symbol.toStringTag, { value: "Module" }));
var Gi, Et, ji, ri;
class hs extends wc {
  constructor(i, a) {
    super(i, a);
    w(this, Gi);
    w(this, Et);
    w(this, ji);
    w(this, ri);
    this.consumeContext(Ke, (s) => {
      _(this, Gi, s);
    }), this.consumeContext(Ve, (s) => {
      _(this, Et, s);
    }), this.consumeContext($c, (s) => {
      _(this, ji, s);
    }), this.consumeContext(xc, (s) => {
      _(this, ri, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, ri)) {
      (i = c(this, Et)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Ba(c(this, ri), () => {
        var l;
        return (l = c(this, Gi)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, ji)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, Et)) == null || s.peek("positive", {
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
Gi = new WeakMap(), Et = new WeakMap(), ji = new WeakMap(), ri = new WeakMap();
const Hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: hs,
  api: hs,
  default: hs
}, Symbol.toStringTag, { value: "Module" }));
var Gh = Object.defineProperty, jh = Object.getOwnPropertyDescriptor, tc = (e) => {
  throw TypeError(e);
}, ts = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? jh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gh(t, i, s), s;
}, So = (e, t, i) => t.has(e) || tc("Cannot " + i), Wa = (e, t, i) => (So(e, t, "read from private field"), t.get(e)), na = (e, t, i) => t.has(e) ? tc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ic = (e, t, i, a) => (So(e, t, "write to private field"), t.set(e, i), i), Ft = (e, t, i) => (So(e, t, "access private method"), i), $a, Ki, To, Je, Co, ac, xa;
let ut = class extends Zo {
  constructor() {
    super(), na(this, Je), na(this, $a), na(this, Ki), this._items = [], this._loading = !0, this._search = "", na(this, To, () => {
      var e;
      return (e = Wa(this, $a)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ke, (e) => {
      ic(this, $a, e), e && Ft(this, Je, Co).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(Wa(this, Ki));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${Ft(this, Je, ac)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Ft(this, Je, xa).call(this, void 0)}>
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
                      @open=${() => Ft(this, Je, xa).call(this, e)}
                      @click=${() => Ft(this, Je, xa).call(this, e)}>
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
$a = /* @__PURE__ */ new WeakMap();
Ki = /* @__PURE__ */ new WeakMap();
To = /* @__PURE__ */ new WeakMap();
Je = /* @__PURE__ */ new WeakSet();
Co = async function() {
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
        (a) => yn(a, this._search, 0, 30, Wa(this, To)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
ac = function(e) {
  this._search = e.target.value, window.clearTimeout(Wa(this, Ki)), ic(this, Ki, window.setTimeout(() => void Ft(this, Je, Co).call(this), 300));
};
xa = function(e) {
  this.value = { item: e }, this._submitModal();
};
ut.styles = L`
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
  R("di-sample-node-picker-modal")
], ut);
const Xh = ut, Yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return ut;
  },
  default: Xh
}, Symbol.toStringTag, { value: "Module" }));
var qh = Object.defineProperty, Jh = Object.getOwnPropertyDescriptor, sc = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && qh(t, i, s), s;
}, Eo = (e, t, i) => t.has(e) || sc("Cannot " + i), hi = (e, t, i) => (Eo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ds = (e, t, i) => t.has(e) ? sc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Zh = (e, t, i, a) => (Eo(e, t, "write to private field"), t.set(e, i), i), wt = (e, t, i) => (Eo(e, t, "access private method"), i), ka, ta, ye, oc, nc, rc, Do, lc, cc, uc, hc;
const Qh = [100, 200, 300, 400, 500, 600, 700, 800, 900], ed = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let he = class extends Zo {
  constructor() {
    super(), ds(this, ye), ds(this, ka), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", ds(this, ta, () => {
      var e;
      return (e = hi(this, ka)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ke, (e) => {
      Zh(this, ka, e);
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
            @change=${wt(this, ye, oc)}>
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
            @click=${wt(this, ye, rc)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${ed.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? wt(this, ye, hc).call(this) : wt(this, ye, uc).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !hi(this, ye, Do)}
            @click=${wt(this, ye, lc)}>
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
ka = /* @__PURE__ */ new WeakMap();
ta = /* @__PURE__ */ new WeakMap();
ye = /* @__PURE__ */ new WeakSet();
oc = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  wt(this, ye, nc).call(this, t);
};
nc = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await cn(t, hi(this, ta));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
rc = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await un(this._path.trim(), hi(this, ta)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Do = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
lc = async function() {
  if (hi(this, ye, Do)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await hn(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        hi(this, ta)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
cc = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
uc = function() {
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
    Qh,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => wt(this, ye, cc).call(this, e, t.target.checked)}>
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
hc = function() {
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
he.styles = L`
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
  p()
], he.prototype, "_busy", 2);
Xe([
  p()
], he.prototype, "_error", 2);
Xe([
  p()
], he.prototype, "_path", 2);
Xe([
  p()
], he.prototype, "_provider", 2);
Xe([
  p()
], he.prototype, "_family", 2);
Xe([
  p()
], he.prototype, "_weights", 2);
Xe([
  p()
], he.prototype, "_italic", 2);
Xe([
  p()
], he.prototype, "_url", 2);
he = Xe([
  R("di-font-upload-modal")
], he);
const td = he, id = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return he;
  },
  default: td
}, Symbol.toStringTag, { value: "Module" }));
export {
  Vc as manifests,
  bd as onInit
};
//# sourceMappingURL=dynamic-images.js.map
