var Lo = (e) => {
  throw TypeError(e);
};
var as = (e, t, i) => t.has(e) || Lo("Cannot " + i);
var c = (e, t, i) => (as(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? Lo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (as(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), T = (e, t, i) => (as(e, t, "access private method"), i);
var ss = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { nothing as p, html as r, css as I, state as m, customElement as R, repeat as B, property as y, classMap as an, styleMap as V } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as F } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Ve } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as Ge } from "@umbraco-cms/backoffice/notification";
import { umbOpenModal as _c, UMB_DISCARD_CHANGES_MODAL as wc, umbConfirmModal as js, UmbModalToken as sn, UMB_MODAL_MANAGER_CONTEXT as Ua, UmbModalBaseElement as on } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as nn } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as $c } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as xc, UmbEntityWorkspaceDataManager as kc, UmbSubmitWorkspaceAction as Ro, UmbWorkspaceActionBase as Sc } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Cc } from "@umbraco-cms/backoffice/context-api";
import { UmbArrayState as vi, UmbStringState as Wo, UmbObjectState as Tc, UmbBooleanState as sa, UmbNumberState as Ec } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as Dc } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as Pc } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Mc } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as zc } from "@umbraco-cms/backoffice/document";
import "@umbraco-cms/backoffice/external/uui";
const Ba = "dynamic-images", Xi = "di-template", Ca = "di:templates-changed", Oc = "/umbraco/management/api/v1/dynamic-images";
class nt extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function S(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${Oc}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await Ic(n);
  return n;
}
async function Ic(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new nt(t, e.status, i);
}
const P = async (e) => e.json();
async function Xs(e) {
  const t = await S("/templates?take=500", e);
  return (await P(t)).items;
}
const rn = async (e, t) => P(await S(`/templates/${e}`, t)), ln = async (e, t) => P(await S("/templates", t, { method: "POST", json: e })), cn = async (e, t) => P(await S(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function un(e, t) {
  await S(`/templates/${e}`, t, { method: "DELETE" });
}
const hn = async (e, t) => P(await S(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function dn(e, t) {
  return (await S(`/templates/${e}/export`, t)).blob();
}
const pn = async (e, t, i) => P(await S("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), Ei = async (e) => P(await S("/fonts", e));
async function mn(e, t) {
  const i = new FormData();
  return i.append("file", e), P(await S("/fonts", t, { method: "POST", body: i }));
}
const fn = async (e, t) => P(await S("/fonts/register-path", t, { method: "POST", json: { path: e } })), gn = async (e, t) => P(await S("/fonts/register-web", t, { method: "POST", json: e })), yn = async (e, t) => P(await S(`/fonts/${e}/refresh`, t, { method: "POST" })), vn = async (e, t, i, a, s) => P(await S(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function bn(e, t) {
  await S(`/fonts/${e}`, t, { method: "DELETE" });
}
async function _n(e, t) {
  return (await S(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Ac = async (e) => P(await S("/document-types", e)), wn = async (e, t) => P(await S(`/document-types/${encodeURIComponent(e)}/properties`, t)), $n = async (e, t, i) => P(await S(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function xn(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), P(await S(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function Ys(e, t, i) {
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
const qs = async (e, t, i) => P(await S("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Js = async (e, t) => P(await S(`/media/${e}/image-info`, t)), Ka = async (e, t) => P(await S(`/documents/${e}/regenerate`, t, { method: "POST" })), kn = async (e, t, i) => P(await S(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), Sn = async (e, t) => P(await S(`/jobs/${e}`, t));
async function Cn(e, t) {
  await S(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const Tn = async (e, t) => P(await S(`/templates/${e}/usage`, t)), Va = async (e) => P(await S("/health", e)), En = async (e) => P(await S("/sync/status", e)), Dn = async (e) => P(await S("/sync/export", e, { method: "POST" })), Pn = async (e) => P(await S("/sync/import", e, { method: "POST" }));
function ci(e) {
  const t = `section/${Ba}/workspace/${Xi}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Ga() {
  return new URL(`section/${Ba}/workspace/${Xi}/create`, document.baseURI).pathname;
}
function Mn(e) {
  return new URL(`section/${Ba}/dashboard/${e}`, document.baseURI).pathname;
}
function ms() {
  const e = window.location.pathname.split(`/workspace/${Xi}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function Yi() {
  window.dispatchEvent(new CustomEvent(Ca));
}
const Lc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: nt,
  SECTION_PATHNAME: Ba,
  TEMPLATES_CHANGED_EVENT: Ca,
  TEMPLATE_ENTITY_TYPE: Xi,
  cancelJob: Cn,
  createTemplate: ln,
  deleteFont: bn,
  deleteTemplate: un,
  duplicateTemplate: hn,
  exportTemplate: dn,
  fetchDocumentTypes: Ac,
  fetchFontFile: _n,
  fetchFonts: Ei,
  fetchHealth: Va,
  fetchImageInfo: Js,
  fetchJob: Sn,
  fetchLayout: qs,
  fetchLinkedProperties: $n,
  fetchPreview: Ys,
  fetchProperties: wn,
  fetchSampleContent: xn,
  fetchSyncStatus: En,
  fetchTemplate: rn,
  fetchTemplates: Xs,
  fetchUsage: Tn,
  hrefForCreate: Ga,
  hrefForDashboard: Mn,
  hrefForTemplate: ci,
  importTemplate: pn,
  notifyTemplatesChanged: Yi,
  refreshFont: yn,
  regenerateDocument: Ka,
  regenerateTemplate: kn,
  registerFontPath: fn,
  registerWebFont: gn,
  runSyncExport: Dn,
  runSyncImport: Pn,
  templateKeyFromLocation: ms,
  updateFont: vn,
  updateTemplate: cn,
  uploadFont: mn
}, Symbol.toStringTag, { value: "Module" })), Ha = () => crypto.randomUUID();
function ja(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function zn(e, t, i) {
  const { x: a, y: s } = ja(e);
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
function On(e, t, i) {
  const { x: a, y: s } = ja(e);
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
function In(e, t, i) {
  const { x: a, y: s } = ja(e);
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
function Rc(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = ja(e);
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
function Wc(e) {
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
function Nc(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (Wc(e.classification)) {
    case "image":
      return { kind: "layer", layer: On(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: In(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: zn(t, e.name, Fc(e)) };
  }
}
function Fc(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function An() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function Uc(e) {
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
const Ln = [
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
function fs(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return Ln[a * 3 + i];
}
function Xa(e, t, i) {
  return {
    x: e.x - t * Di(e.anchor),
    y: e.y - i * Pi(e.anchor)
  };
}
function Zs(e, t, i, a, s) {
  return {
    x: e + i * Di(s),
    y: t + a * Pi(s)
  };
}
function Bc(e, t, i, a) {
  const s = Xa(e, t, i), o = Zs(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function Kc(e, t) {
  const i = Zs(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Rn(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Kt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), d = e - i, f = t - a;
  return { x: i + d * n - f * l, y: a + d * l + f * n };
}
function Vc(e, t, i, a, s) {
  return Kt(e, t, i, a, -s);
}
function Wn(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Kt(e.x, e.y, t, i, a),
    Kt(e.x + e.width, e.y, t, i, a),
    Kt(e.x + e.width, e.y + e.height, t, i, a),
    Kt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((f) => f.x)), n = Math.max(...s.map((f) => f.x)), l = Math.min(...s.map((f) => f.y)), d = Math.max(...s.map((f) => f.y));
  return { x: o, y: l, width: n - o, height: d - l };
}
const Gc = 10;
function De(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Nn(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Ta(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function No(e) {
  return e === "below" || e === "above";
}
function Fo(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Hc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function jc(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = Fo(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...Fo(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Xc(e, t, i) {
  const a = e.position;
  if (!Nn(a)) return a;
  if (jc(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Di(a.anchor), l = Pi(a.anchor);
  const d = Uo(e, a.relativeX, !1, t, i);
  d && (s = d.coordinate, n = d.factor);
  const f = Uo(e, a.relativeY, !0, t, i);
  return f && (o = f.coordinate, l = f.factor), { x: s, y: o, anchor: fs(n, l) };
}
function Uo(e, t, i, a, s) {
  if (!t || No(t.edge) !== i) return;
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
    if (!f || No(f.edge) !== i) return;
    n = f.layerKey;
  }
}
function Yc(e, t, i) {
  const a = Hc(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const d = s.get(l.key);
    if (d) return d;
    let f;
    o.has(l.key) ? f = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), f = Xc(l, a, (qe) => {
      const Oe = a.get(qe);
      return Oe && !i(Oe) ? n(Oe).extent : void 0;
    }), o.delete(l.key));
    const k = t(l), Y = Xa(f, k.width, k.height), xe = { x: Y.x, y: Y.y, width: k.width, height: k.height }, ze = { position: f, box: xe, extent: Wn(xe, f.x, f.y, l.rotation ?? 0) };
    return s.set(l.key, ze), ze;
  };
  for (const l of e) n(l);
  return s;
}
function gs(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? fs(Di(i.anchor), Pi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? fs(Di(e.anchor), Pi(i.anchor)) : e.anchor
  };
}
var re, Le, Se, tt;
class qc {
  constructor(t = 100) {
    w(this, re, []);
    w(this, Le, []);
    w(this, Se, 0);
    w(this, tt);
    this.limit = t;
  }
  get canUndo() {
    return c(this, re).length > 0;
  }
  get canRedo() {
    return c(this, Le).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Se) > 0 || (c(this, re).push(structuredClone(t)), c(this, re).length > this.limit && c(this, re).shift(), _(this, Le, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Se) === 0 && _(this, tt, structuredClone(t)), ss(this, Se)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Se) !== 0 && (ss(this, Se)._--, !(c(this, Se) > 0) && (t && c(this, tt) !== void 0 && (c(this, re).push(c(this, tt)), c(this, re).length > this.limit && c(this, re).shift(), _(this, Le, [])), _(this, tt, void 0)));
  }
  undo(t) {
    const i = c(this, re).pop();
    if (i !== void 0)
      return c(this, Le).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Le).pop();
    if (i !== void 0)
      return c(this, re).push(structuredClone(t)), i;
  }
  clear() {
    _(this, re, []), _(this, Le, []), _(this, Se, 0), _(this, tt, void 0);
  }
}
re = new WeakMap(), Le = new WeakMap(), Se = new WeakMap(), tt = new WeakMap();
const Jc = "DynamicImages.Workspace.Template", Zc = 12;
var Zt, it, xt, kt, St, Qt, ei, ti, Ct, ii, Re, ai, si, le, Vi, Tt, Ce, Et, $, Fn, oi, ni, ys, vs, bs, Ie, gt, _s, ws;
class Qc extends xc {
  constructor(i) {
    super(i, Jc);
    w(this, $);
    w(this, Zt);
    w(this, it);
    w(this, xt);
    w(this, kt);
    w(this, St);
    w(this, Qt);
    w(this, ei);
    w(this, ti);
    w(this, Ct);
    w(this, ii);
    w(this, Re);
    w(this, ai);
    w(this, si);
    w(this, le);
    w(this, Vi);
    w(this, Tt);
    w(this, Ce);
    w(this, Et);
    w(this, oi);
    w(this, ni);
    this._data = new kc(this), this.template = this._data.current, _(this, Zt, new vi([], (a) => a.key)), this.layers = c(this, Zt).asObservable(), _(this, it, new Wo(void 0)), this.selectedLayerKey = c(this, it).asObservable(), _(this, xt, new vi([], (a) => a.alias)), this.properties = c(this, xt).asObservable(), _(this, kt, new Tc({})), this.linkedProperties = c(this, kt).asObservable(), _(this, St, new vi([], (a) => a.key)), this.fonts = c(this, St).asObservable(), _(this, Qt, new vi([], (a) => a.key)), this.serverBounds = c(this, Qt).asObservable(), _(this, ei, new vi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, ei).asObservable(), _(this, ti, new Wo(void 0)), this.sampleContentKey = c(this, ti).asObservable(), _(this, Ct, new sa(!0)), this.useSampleData = c(this, Ct).asObservable(), _(this, ii, new Ec(1)), this.zoom = c(this, ii).asObservable(), _(this, Re, new sa(!0)), this.loading = c(this, Re).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ai, new sa(!1)), this.canUndo = c(this, ai).asObservable(), _(this, si, new sa(!1)), this.canRedo = c(this, si).asObservable(), _(this, le, new qc()), _(this, Ce, !1), _(this, Et, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, oi, async (a) => {
      const s = a.detail;
      if (c(this, Et) || !(s != null && s.url) || !T(this, $, Fn).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await _c(this, wc), _(this, Et, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, ni, (a) => {
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
        component: () => Promise.resolve().then(() => Ko),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Ko),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ve, (a) => {
      _(this, Vi, a);
    }), this.consumeContext(Ge, (a) => {
      _(this, Tt, a);
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
    c(this, Re).setValue(!0), _(this, Ce, !1);
    try {
      const a = await rn(i, this.getToken);
      T(this, $, gt).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await T(this, $, ys).call(this, a);
    } catch (a) {
      T(this, $, ws).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Re).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    c(this, Re).setValue(!0), _(this, Ce, !0), T(this, $, gt).call(this, Uc(i), { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await T(this, $, ys).call(this, this._data.getCurrent()), c(this, Re).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await T(this, $, bs).call(this, i.docTypeAliases);
    c(this, xt).setValue(a), c(this, kt).setValue(await T(this, $, vs).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, St).setValue(await Ei(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    T(this, $, Ie).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    T(this, $, Ie).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    T(this, $, Ie).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    T(this, $, Ie).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    T(this, $, Ie).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    T(this, $, Ie).call(this, (s) => ({
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
    T(this, $, Ie).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, d;
        let n = o.position;
        return ((l = Ta(n, "x")) == null ? void 0 : l.layerKey) === i && (n = gs(n, "x", a == null ? void 0 : a.get(o.key))), ((d = Ta(n, "y")) == null ? void 0 : d.layerKey) === i && (n = gs(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
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
    T(this, $, Ie).call(this, (s) => {
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
    c(this, le).end(i), T(this, $, _s).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, le).undo(i);
    a && T(this, $, gt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, le).redo(i);
    a && T(this, $, gt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Qt).setValue(i);
  }
  setIssues(i) {
    c(this, ei).setValue(i);
  }
  setSampleContentKey(i) {
    c(this, ti).setValue(i), c(this, Ct).setValue(!i);
  }
  setUseSampleData(i) {
    c(this, Ct).setValue(i);
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
      const o = c(this, Ce) ? await ln(i, this.getToken) : await cn(i, this.getToken);
      T(this, $, gt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Ce);
      _(this, Ce, !1), this.setIsNew(!1), Yi(), (a = c(this, Tt)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, Tt)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", ci(o.template.key));
    } catch (o) {
      throw T(this, $, ws).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Et, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, oi)), window.removeEventListener("beforeunload", c(this, ni)), c(this, le).clear(), super.destroy();
  }
}
Zt = new WeakMap(), it = new WeakMap(), xt = new WeakMap(), kt = new WeakMap(), St = new WeakMap(), Qt = new WeakMap(), ei = new WeakMap(), ti = new WeakMap(), Ct = new WeakMap(), ii = new WeakMap(), Re = new WeakMap(), ai = new WeakMap(), si = new WeakMap(), le = new WeakMap(), Vi = new WeakMap(), Tt = new WeakMap(), Ce = new WeakMap(), Et = new WeakMap(), $ = new WeakSet(), /**
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
Fn = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, oi = new WeakMap(), ni = new WeakMap(), ys = async function(i) {
  const [a, s] = await Promise.all([
    Ei(this.getToken).catch(() => []),
    T(this, $, bs).call(this, i.docTypeAliases)
  ]);
  c(this, St).setValue(a), c(this, xt).setValue(s), c(this, kt).setValue(await T(this, $, vs).call(this, i.docTypeAliases, s));
}, vs = async function(i, a) {
  const s = a.filter((n) => n.classification === "content").slice(0, Zc);
  if (s.length === 0 || i.length === 0) return {};
  const o = await Promise.all(
    s.map(async (n) => {
      const l = await Promise.all(
        i.map((f) => $n(f, n.alias, this.getToken).catch(() => null))
      ), d = /* @__PURE__ */ new Map();
      for (const f of l.flatMap((k) => (k == null ? void 0 : k.properties) ?? []))
        d.has(f.alias) || d.set(f.alias, f);
      return [n.alias, [...d.values()]];
    })
  );
  return Object.fromEntries(o.filter(([, n]) => n.length > 0));
}, bs = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => wn(o, this.getToken).catch(() => []))
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
  a && c(this, le).push(s);
  const o = i(structuredClone(s));
  T(this, $, gt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
gt = function(i, a) {
  a != null && a.resetHistory && c(this, le).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Zt).setValue(i.layers), T(this, $, _s).call(this);
}, _s = function() {
  c(this, ai).setValue(c(this, le).canUndo), c(this, si).setValue(c(this, le).canRedo);
}, ws = function(i, a) {
  var o;
  const s = a instanceof nt ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, Tt)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const Nt = new Cc(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), eu = [
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
    element: () => Promise.resolve().then(() => du),
    weight: 200,
    meta: { label: "Templates", menus: ["DynamicImages.Menu"] }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => gu),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Su),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Du),
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
    api: Qc,
    meta: { entityType: Xi }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => Fh),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Vh),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Xh),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Qh),
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
    api: () => Promise.resolve().then(() => ed),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => id),
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
    api: () => Promise.resolve().then(() => ad),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => sd),
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
    element: () => Promise.resolve().then(() => ld)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => fd)
  }
], zd = (e, t) => {
  t.registerMany(eu);
};
var tu = Object.defineProperty, iu = Object.getOwnPropertyDescriptor, Un = (e) => {
  throw TypeError(e);
}, Qs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? iu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && tu(t, i, s), s;
}, eo = (e, t, i) => t.has(e) || Un("Cannot " + i), au = (e, t, i) => (eo(e, t, "read from private field"), t.get(e)), Bo = (e, t, i) => t.has(e) ? Un("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), su = (e, t, i, a) => (eo(e, t, "write to private field"), t.set(e, i), i), ou = (e, t, i) => (eo(e, t, "access private method"), i), Ea, $s, Bn;
let It = class extends F {
  constructor() {
    super(), Bo(this, $s), Bo(this, Ea), this._name = "", this._loading = !0, this.consumeContext(Nt, (e) => {
      su(this, Ea, e), e && (this.observe(e.template, (t) => {
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
            @input=${ou(this, $s, Bn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Ea = /* @__PURE__ */ new WeakMap();
$s = /* @__PURE__ */ new WeakSet();
Bn = function(e) {
  var i;
  const t = e.target.value;
  (i = au(this, Ea)) == null || i.updateTemplateFields({ name: t });
};
It.styles = I`
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
Qs([
  m()
], It.prototype, "_name", 2);
Qs([
  m()
], It.prototype, "_loading", 2);
It = Qs([
  R("di-template-editor")
], It);
const nu = It, Ko = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return It;
  },
  default: nu
}, Symbol.toStringTag, { value: "Module" }));
var ru = Object.defineProperty, lu = Object.getOwnPropertyDescriptor, Kn = (e) => {
  throw TypeError(e);
}, pi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? lu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ru(t, i, s), s;
}, to = (e, t, i) => t.has(e) || Kn("Cannot " + i), bt = (e, t, i) => (to(e, t, "read from private field"), t.get(e)), bi = (e, t, i) => t.has(e) ? Kn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), cu = (e, t, i, a) => (to(e, t, "write to private field"), t.set(e, i), i), la = (e, t, i) => (to(e, t, "access private method"), i), ca, Da, ua, ha, Vt, xs, Vn, Gn;
let Pe = class extends F {
  constructor() {
    super(), bi(this, Vt), bi(this, ca), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = ms(), this._expanded = !0, bi(this, Da, () => {
      var e;
      return (e = bt(this, ca)) == null ? void 0 : e.getLatestToken();
    }), bi(this, ua, () => {
      this._activeKey = ms();
    }), bi(this, ha, () => {
      la(this, Vt, xs).call(this);
    }), this.consumeContext(Ve, (e) => {
      cu(this, ca, e), e && la(this, Vt, xs).call(this);
    }), window.addEventListener("changestate", bt(this, ua)), window.addEventListener(Ca, bt(this, ha));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("changestate", bt(this, ua)), window.removeEventListener(Ca, bt(this, ha));
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
        ${la(this, Vt, Vn).call(this)}
      </uui-menu-item>
    `;
  }
};
ca = /* @__PURE__ */ new WeakMap();
Da = /* @__PURE__ */ new WeakMap();
ua = /* @__PURE__ */ new WeakMap();
ha = /* @__PURE__ */ new WeakMap();
Vt = /* @__PURE__ */ new WeakSet();
xs = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Xs(bt(this, Da)),
      Va(bt(this, Da)).catch(() => {
      })
    ]);
    this._templates = e, this._issuesByTemplate = uu((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
Vn = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${B(
    this._templates,
    (e) => e.key,
    (e) => la(this, Vt, Gn).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${Ga()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
Gn = function(e) {
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
        ${t > 0 ? r`<uui-badge slot="badge" color="warning" look="primary" title="${t} issue(s)">${t}</uui-badge>` : p}
      </uui-menu-item>
    `;
};
Pe.styles = I`
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
  m()
], Pe.prototype, "_templates", 2);
pi([
  m()
], Pe.prototype, "_issuesByTemplate", 2);
pi([
  m()
], Pe.prototype, "_loading", 2);
pi([
  m()
], Pe.prototype, "_activeKey", 2);
pi([
  m()
], Pe.prototype, "_expanded", 2);
Pe = pi([
  R("di-templates-menu-item")
], Pe);
function uu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const hu = Pe, du = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return Pe;
  },
  default: hu
}, Symbol.toStringTag, { value: "Module" }));
var pu = Object.defineProperty, mu = Object.getOwnPropertyDescriptor, Hn = (e) => {
  throw TypeError(e);
}, dt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? mu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && pu(t, i, s), s;
}, io = (e, t, i) => t.has(e) || Hn("Cannot " + i), Ne = (e, t, i) => (io(e, t, "read from private field"), i ? i.call(e) : t.get(e)), oa = (e, t, i) => t.has(e) ? Hn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Vo = (e, t, i, a) => (io(e, t, "write to private field"), t.set(e, i), i), D = (e, t, i) => (io(e, t, "access private method"), i), da, Pa, Fe, C, qi, Ue, jn, Xn, Yn, qn, Jn, wi, Zn, Qn, er, tr, ir;
let me = class extends F {
  constructor() {
    super(), oa(this, C), oa(this, da), oa(this, Pa), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, oa(this, Fe, () => {
      var e;
      return (e = Ne(this, da)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ge, (e) => {
      Vo(this, Pa, e);
    }), this.consumeContext(Ve, (e) => {
      Vo(this, da, e), e && D(this, C, qi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${D(this, C, Jn).call(this)} ${D(this, C, Zn).call(this)} ${D(this, C, Qn).call(this)}
      </umb-body-layout>
    `;
  }
};
da = /* @__PURE__ */ new WeakMap();
Pa = /* @__PURE__ */ new WeakMap();
Fe = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakSet();
qi = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Xs(Ne(this, Fe)),
      Ei(Ne(this, Fe)).catch(() => []),
      Va(Ne(this, Fe)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    D(this, C, Ue).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Ue = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ne(this, Pa)) == null || s.peek(e, { data: { headline: t, message: a } });
};
jn = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await pn(this._pasteJson, "create", Ne(this, Fe)), D(this, C, Ue).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, Yi(), await D(this, C, qi).call(this);
    } catch (e) {
      D(this, C, Ue).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
Xn = async function(e) {
  try {
    await hn(e.key, Ne(this, Fe)), D(this, C, Ue).call(this, "positive", `'${e.name}' duplicated`), Yi(), await D(this, C, qi).call(this);
  } catch (t) {
    D(this, C, Ue).call(this, "danger", "The template could not be duplicated", t);
  }
};
Yn = async function(e) {
  await js(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await un(e.key, Ne(this, Fe)), D(this, C, Ue).call(this, "positive", `'${e.name}' deleted`), Yi(), await D(this, C, qi).call(this);
  } catch (t) {
    D(this, C, Ue).call(this, "danger", "The template could not be deleted", t);
  }
};
qn = async function(e) {
  try {
    const t = await dn(e.key, Ne(this, Fe)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    D(this, C, Ue).call(this, "danger", "The template could not be exported", t);
  }
};
Jn = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${D(this, C, wi).call(this, "Templates", this._templates.length, "icon-brush")}
        ${D(this, C, wi).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${D(this, C, wi).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${D(this, C, wi).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
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
Zn = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : r`
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
                  ${i.templateName ? r`<strong>${i.templateName}</strong> — ` : p}${i.message}
                </uui-table-cell>
              </uui-table-row>
            `
  )}
        </uui-table>
        <uui-button look="secondary" href=${Mn("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Qn = function() {
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
          <uui-button look="primary" color="positive" href=${Ga()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? D(this, C, er).call(this) : p}
        ${this._templates.length === 0 ? D(this, C, tr).call(this) : D(this, C, ir).call(this)}
      </uui-box>
    `;
};
er = function() {
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
          @click=${D(this, C, jn)}>
          Import
        </uui-button>
      </div>
    `;
};
tr = function() {
  return r`
      <div class="empty">
        <uui-icon name="icon-brush"></uui-icon>
        <h4>No templates yet</h4>
        <p>A template says which document types get a generated image, and what it looks like.</p>
        <uui-button look="primary" color="positive" href=${Ga()} label="Create your first template">
          Create your first template
        </uui-button>
      </div>
    `;
};
ir = function() {
  return r`
      <div class="cards">
        ${B(
    this._templates,
    (e) => e.key,
    (e) => r`
            <uui-box class="card ${e.isEnabled ? "" : "disabled"}">
              <div slot="headline">
                <a href=${ci(e.key)}>${e.name}</a>
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
                <uui-button look="secondary" href=${ci(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => D(this, C, Xn).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => D(this, C, qn).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => D(this, C, Yn).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
me.styles = I`
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
dt([
  m()
], me.prototype, "_templates", 2);
dt([
  m()
], me.prototype, "_fonts", 2);
dt([
  m()
], me.prototype, "_health", 2);
dt([
  m()
], me.prototype, "_loading", 2);
dt([
  m()
], me.prototype, "_importing", 2);
dt([
  m()
], me.prototype, "_pasteJson", 2);
dt([
  m()
], me.prototype, "_showPaste", 2);
me = dt([
  R("di-overview-dashboard")
], me);
const fu = me, gu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return me;
  },
  default: fu
}, Symbol.toStringTag, { value: "Module" })), ks = /* @__PURE__ */ new Map(), Ya = (e) => `di-${e}`;
function yu(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = ks.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await _n(e, t), o = new FontFace(Ya(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return ks.set(e, a), a;
}
async function ar(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => yu(a, t)));
}
function sr(e) {
  ks.delete(e);
}
const vu = new sn(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), bu = new sn(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var _u = Object.defineProperty, wu = Object.getOwnPropertyDescriptor, or = (e) => {
  throw TypeError(e);
}, qa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && _u(t, i, s), s;
}, ao = (e, t, i) => t.has(e) || or("Cannot " + i), Ee = (e, t, i) => (ao(e, t, "read from private field"), i ? i.call(e) : t.get(e)), _i = (e, t, i) => t.has(e) ? or("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), os = (e, t, i, a) => (ao(e, t, "write to private field"), t.set(e, i), i), L = (e, t, i) => (ao(e, t, "access private method"), i), pa, Mi, zi, At, O, nr, mi, rt, Ss, rr, lr, ma, cr, ur, hr;
function $u(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : xu(e.sourceUrl);
    default:
      return "Media library";
  }
}
function xu(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let lt = class extends F {
  constructor() {
    super(), _i(this, O), _i(this, pa), _i(this, Mi), _i(this, zi), this._fonts = [], this._loading = !0, _i(this, At, () => {
      var e;
      return (e = Ee(this, pa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ua, (e) => {
      os(this, Mi, e);
    }), this.consumeContext(Ge, (e) => {
      os(this, zi, e);
    }), this.consumeContext(Ve, (e) => {
      os(this, pa, e), e && L(this, O, mi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${L(this, O, Ss)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${L(this, O, Ss)}>
                  Add your first font
                </uui-button>
              </div>` : r`${B(this._fonts, (e) => e.key, (e) => L(this, O, cr).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
pa = /* @__PURE__ */ new WeakMap();
Mi = /* @__PURE__ */ new WeakMap();
zi = /* @__PURE__ */ new WeakMap();
At = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
nr = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
mi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Ei(Ee(this, At)), await ar(this._fonts.map((e) => e.key), Ee(this, At));
  } catch (e) {
    L(this, O, rt).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
rt = function(e, t, i) {
  var s;
  const a = i instanceof nt ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ee(this, zi)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Ss = async function() {
  var i, a;
  if (!Ee(this, Mi)) return;
  const e = Ee(this, Mi).open(this, bu, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Ee(this, zi)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await L(this, O, mi).call(this));
};
rr = async function(e) {
  try {
    await yn(e.key, Ee(this, At)), sr(e.key), L(this, O, rt).call(this, "positive", `'${e.familyName}' refreshed`), await L(this, O, mi).call(this);
  } catch (t) {
    L(this, O, rt).call(this, "danger", "That font could not be refreshed", t);
  }
};
lr = async function(e) {
  await js(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await bn(e.key, Ee(this, At)), sr(e.key), L(this, O, rt).call(this, "positive", `'${e.familyName}' deleted`), await L(this, O, mi).call(this);
  } catch (t) {
    L(this, O, rt).call(this, "danger", "That font could not be deleted", t);
  }
};
ma = async function(e, t, i, a) {
  try {
    await vn(e.key, t, i, Ee(this, At), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), L(this, O, rt).call(this, "positive", `'${t}' saved`), await L(this, O, mi).call(this), a != null && a.keepOpen && await L(this, O, nr).call(this);
  } catch (s) {
    L(this, O, rt).call(this, "danger", "The font could not be saved", s);
  }
};
cr = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${$u(e)} · weight ${e.weight}
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
                  @click=${() => L(this, O, rr).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => L(this, O, lr).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Ya(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? L(this, O, hr).call(this, e) : L(this, O, ur).call(this, e)}
      </div>
    `;
};
ur = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${B(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
hr = function(e) {
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
      t.splice(a, 1), L(this, O, ma).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), L(this, O, ma).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    L(this, O, ma).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
lt.styles = I`
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
qa([
  m()
], lt.prototype, "_fonts", 2);
qa([
  m()
], lt.prototype, "_loading", 2);
qa([
  m()
], lt.prototype, "_editingKey", 2);
lt = qa([
  R("di-fonts-dashboard")
], lt);
const ku = lt, Su = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return lt;
  },
  default: ku
}, Symbol.toStringTag, { value: "Module" }));
var Cu = Object.defineProperty, Tu = Object.getOwnPropertyDescriptor, dr = (e) => {
  throw TypeError(e);
}, Ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Tu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Cu(t, i, s), s;
}, so = (e, t, i) => t.has(e) || dr("Cannot " + i), Ze = (e, t, i) => (so(e, t, "read from private field"), i ? i.call(e) : t.get(e)), na = (e, t, i) => t.has(e) ? dr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Go = (e, t, i, a) => (so(e, t, "write to private field"), t.set(e, i), i), Gt = (e, t, i) => (so(e, t, "access private method"), i), fa, Ht, ui, at, Ma, Cs, pr;
let Be = class extends F {
  constructor() {
    super(), na(this, at), na(this, fa), na(this, Ht), this._loading = !0, this._busy = !1, na(this, ui, () => {
      var e;
      return (e = Ze(this, fa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ge, (e) => {
      Go(this, Ht, e);
    }), this.consumeContext(Ve, (e) => {
      Go(this, fa, e), e && Gt(this, at, Ma).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Gt(this, at, Ma).call(this)}>Re-check</uui-button>
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

        ${Gt(this, at, pr).call(this)}
      </umb-body-layout>
    `;
  }
};
fa = /* @__PURE__ */ new WeakMap();
Ht = /* @__PURE__ */ new WeakMap();
ui = /* @__PURE__ */ new WeakMap();
at = /* @__PURE__ */ new WeakSet();
Ma = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Va(Ze(this, ui)),
      En(Ze(this, ui)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
Cs = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await Dn(Ze(this, ui)) : await Pn(Ze(this, ui));
    (t = Ze(this, Ht)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Ze(this, Ht)) == null || i.peek("warning", { data: { message: o } });
    await Gt(this, at, Ma).call(this);
  } catch (s) {
    (a = Ze(this, Ht)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
pr = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Gt(this, at, Cs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Gt(this, at, Cs).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
Be.styles = I`
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
  m()
], Be.prototype, "_health", 2);
Ji([
  m()
], Be.prototype, "_sync", 2);
Ji([
  m()
], Be.prototype, "_loading", 2);
Ji([
  m()
], Be.prototype, "_busy", 2);
Be = Ji([
  R("di-health-dashboard")
], Be);
const Eu = Be, Du = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Be;
  },
  default: Eu
}, Symbol.toStringTag, { value: "Module" })), mr = 3, fr = 12, gr = 0.1, yr = 0.9;
function Pu(e) {
  return Math.max(mr, Math.min(fr, e));
}
function Mu(e) {
  return Math.max(gr, Math.min(yr, e));
}
function zu(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Pu(t), s = 0.5 * Mu(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let d = 0; d < o; d++) {
    const f = (-90 + d * n) * Math.PI / 180, k = e === "star" && d % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + k * Math.cos(f), y: 0.5 + k * Math.sin(f) });
  }
  return l;
}
function Ou(e, t, i) {
  const a = zu(e, t, i);
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
  sides: { min: mr, max: fr },
  innerRatio: { min: gr, max: yr }
}, za = { min: 0.1, max: 4 };
function Iu(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function vr(e) {
  if (e.kind === "radial") {
    const t = Math.round(Ho(e.centreX ?? 0.5) * 100), i = Math.round(Ho(e.centreY ?? 0.5) * 100);
    return `radial-gradient(ellipse farthest-corner at ${t}% ${i}%, ${e.from}, ${e.to})`;
  }
  return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
}
function Ho(e) {
  return Math.min(1, Math.max(0, e));
}
const oo = I`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Au(e, t) {
  const i = [], a = t.lockX ? void 0 : jo(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Lu(t),
    t.threshold
  ), s = t.lockY ? void 0 : jo(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    Ru(t),
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
function Lu(e) {
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
function Ru(e) {
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
function jo(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var Wu = Object.defineProperty, Nu = Object.getOwnPropertyDescriptor, br = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Nu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wu(t, i, s), s;
}, no = (e, t, i) => t.has(e) || br("Cannot " + i), ye = (e, t, i) => (no(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ns = (e, t, i) => t.has(e) ? br("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), rs = (e, t, i, a) => (no(e, t, "write to private field"), t.set(e, i), i), j = (e, t, i) => (no(e, t, "access private method"), i), yt, $i, z, Ja, ro, _r, wr, $r, xr, lo, Oa, kr, Sr, Cr, Tr, Er, Dr, Pr, Mr, zr;
const Fu = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], ls = 18;
let we = class extends F {
  constructor() {
    super(...arguments), ns(this, z), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, ns(this, yt), ns(this, $i);
  }
  willUpdate() {
    this._box = j(this, z, _r).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ye(this, $i) && ((t = ye(this, yt)) == null || t.disconnect(), rs(this, $i, e), e && (ye(this, yt) ?? rs(this, yt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ye(this, yt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ye(this, yt)) == null || e.disconnect(), rs(this, $i, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${an({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${V({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ye(this, z, wr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...j(this, z, lo).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      j(this, z, kr).call(this, t), j(this, z, Oa).call(this, t);
    }}>
        ${j(this, z, Sr).call(this)}
      </div>

      ${this.selected ? j(this, z, Mr).call(this, e) : p}
      ${this.showMeasured && this.measured ? j(this, z, zr).call(this) : p}
    `;
  }
};
yt = /* @__PURE__ */ new WeakMap();
$i = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakSet();
Ja = function() {
  return this.resolvedPosition ?? this.layer.position;
};
ro = function() {
  return this.layer.rotation ?? 0;
};
_r = function() {
  var s;
  const e = this.layer, t = e.size.width ?? j(this, z, $r).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? j(this, z, xr).call(this), a = Xa(ye(this, z, Ja), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
wr = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
$r = function() {
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
xr = function() {
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
lo = function(e) {
  const t = ye(this, z, ro);
  if (t === 0) return {};
  const i = ye(this, z, Ja);
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
kr = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Sr = function() {
  switch (this.layer.type) {
    case "text":
      return j(this, z, Cr).call(this);
    case "image":
      return j(this, z, Er).call(this);
    case "badges":
      return j(this, z, Dr).call(this);
    default:
      return j(this, z, Pr).call(this);
  }
};
Cr = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || j(this, z, Tr).call(this);
  return r`
      <div
        class="text"
        style=${V({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Ya(e.fontKey)}, sans-serif`,
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
Tr = function() {
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
Er = function() {
  if (this.layer.type !== "image") return p;
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
Dr = function() {
  if (this.layer.type !== "badges") return p;
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
    Array.from({ length: Math.max(1, a) }, (k, Y) => Y),
    (k) => k,
    () => r`
            <div class=${an({ badge: !0, right: f === "right" })}>
              <div
                class="circle"
                style=${V({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${f === "none" ? p : r`<div
                    class="badge-label"
                    style=${V({
      ...f === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${Ya(t.fontKey)}, sans-serif`,
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
Pr = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? vr(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
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
  const n = Ou(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${V({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${V({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
Mr = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = ye(this, z, Ja), n = ye(this, z, ro), l = De(this.layer.position, "x") || De(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${V({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...j(this, z, lo).call(this, e) })}>
        <span
          class="tag"
          style=${V(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${B(
    Fu,
    (d) => d,
    (d) => r`
                  <span
                    class="handle ${d}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${d}"
                    @pointerdown=${(f) => j(this, z, Oa).call(this, f, d)}>
                  </span>
                `
  )}
              <span class="stalk" style=${V({ height: `${ls}px`, top: `${-ls}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${V({ top: `${-ls}px` })}
                @pointerdown=${(d) => j(this, z, Oa).call(this, d, "rotate")}>
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
zr = function() {
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
we.styles = I`
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
], we.prototype, "layer", 2);
He([
  y({ type: Number })
], we.prototype, "scale", 2);
He([
  y({ type: Boolean, reflect: !0 })
], we.prototype, "selected", 2);
He([
  y({ type: Object })
], we.prototype, "measured", 2);
He([
  y({ type: Boolean })
], we.prototype, "showMeasured", 2);
He([
  y({ type: String })
], we.prototype, "resolvedText", 2);
He([
  y({ attribute: !1 })
], we.prototype, "resolvedPosition", 2);
He([
  m()
], we.prototype, "_box", 2);
we = He([
  R("di-layer-box")
], we);
var Uu = Object.defineProperty, Bu = Object.getOwnPropertyDescriptor, Or = (e) => {
  throw TypeError(e);
}, co = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Uu(t, i, s), s;
}, Ku = (e, t, i) => t.has(e) || Or("Cannot " + i), Vu = (e, t, i) => t.has(e) ? Or("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gu = (e, t, i) => (Ku(e, t, "access private method"), i), Ts, Ir;
let Oi = class extends F {
  constructor() {
    super(...arguments), Vu(this, Ts), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${B(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => Gu(this, Ts, Ir).call(this, e)
    )}`;
  }
};
Ts = /* @__PURE__ */ new WeakSet();
Ir = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Oi.styles = I`
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
co([
  y({ type: Array })
], Oi.prototype, "guides", 2);
co([
  y({ type: Number })
], Oi.prototype, "scale", 2);
Oi = co([
  R("di-guides")
], Oi);
var Hu = Object.defineProperty, ju = Object.getOwnPropertyDescriptor, Ar = (e) => {
  throw TypeError(e);
}, Zi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ju(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Hu(t, i, s), s;
}, Xu = (e, t, i) => t.has(e) || Ar("Cannot " + i), Yu = (e, t, i) => t.has(e) ? Ar("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Xo = (e, t, i) => (Xu(e, t, "access private method"), i), ga, Es;
let J = class extends F {
  constructor() {
    super(...arguments), Yu(this, ga), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Xo(this, ga, Es).call(this, "top"), Xo(this, ga, Es).call(this, "left");
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
ga = /* @__PURE__ */ new WeakSet();
Es = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : J.thickness) * o, t.height = (e === "top" ? J.thickness : s) * o, t.style.width = `${e === "top" ? s : J.thickness}px`, t.style.height = `${e === "top" ? J.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const d = Math.round(l * this.scale) + 0.5, f = l % 100 === 0, k = f ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(d, J.thickness - k), i.lineTo(d, J.thickness)) : (i.moveTo(J.thickness - k, d), i.lineTo(J.thickness, d)), i.stroke(), f && l > 0 && (e === "top" ? i.fillText(String(l), d + 2, 9) : (i.save(), i.translate(9, d - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
J.thickness = 20;
J.styles = I`
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
  y({ type: Number })
], J.prototype, "canvasWidth", 2);
Zi([
  y({ type: Number })
], J.prototype, "canvasHeight", 2);
Zi([
  y({ type: Number })
], J.prototype, "scale", 2);
Zi([
  y({ type: Object })
], J.prototype, "pointer", 2);
J = Zi([
  R("di-rulers")
], J);
var qu = Object.defineProperty, Ju = Object.getOwnPropertyDescriptor, Lr = (e) => {
  throw TypeError(e);
}, oe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ju(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && qu(t, i, s), s;
}, uo = (e, t, i) => t.has(e) || Lr("Cannot " + i), A = (e, t, i) => (uo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ne = (e, t, i) => t.has(e) ? Lr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ya = (e, t, i, a) => (uo(e, t, "write to private field"), t.set(e, i), i), M = (e, t, i) => (uo(e, t, "access private method"), i), vt, xi, ot, E, ho, Ds, Ps, Za, po, Ms, Rr, Wr, mo, Nr, Fr, zs, va, Ur, Br, Ut, fo, Os, Is, As, Kr, Ls, Rs, Ws, Vr;
const Zu = 6, Gr = 20, Qu = 2, eh = 15, th = 0.1;
let te = class extends F {
  constructor() {
    super(...arguments), ne(this, E), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ne(this, vt), ne(this, xi), ne(this, ot, /* @__PURE__ */ new Map()), ne(this, zs, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = M(this, E, po).call(this, t), a = M(this, E, Ms).call(this, t), s = M(this, E, Rr).call(this, t), o = M(this, E, Za).call(this, e.detail.startX, e.detail.startY);
      ya(this, vt, {
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
    }), ne(this, va, (e) => {
      var aa, Ao;
      this._pointer = M(this, E, Ps).call(this, e.clientX, e.clientY);
      const t = A(this, vt);
      if (!t) return;
      const i = this.template.layers.find((yi) => yi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        M(this, E, Br).call(this, i, t, e);
        return;
      }
      const o = De(i.position, "x"), n = De(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        M(this, E, Ur).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let d = t.handle ? M(this, E, fo).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (d = { ...d, x: t.startBox.x, width: (aa = t.handle) != null && aa.includes("w") ? t.startBox.width : d.width }), n && (d = { ...d, y: t.startBox.y, height: (Ao = t.handle) != null && Ao.includes("n") ? t.startBox.height : d.height });
      const f = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, k = l !== 0 ? { x: d.x + f.x, y: d.y + f.y, width: t.startExtent.width, height: t.startExtent.height } : d, xe = this.snapEnabled && !e.altKey ? Au(k, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((yi) => yi.key !== i.key).map((yi) => M(this, E, Ms).call(this, yi)),
        threshold: Zu / this.scale,
        lockX: o,
        lockY: n
      }) : {
        box: {
          ...k,
          x: o ? k.x : Math.round(k.x),
          y: n ? k.y : Math.round(k.y)
        },
        guides: []
      };
      this._guides = xe.guides;
      const ze = l !== 0 ? { ...d, x: xe.box.x - f.x, y: xe.box.y - f.y } : xe.box, qe = Kc(ze, i.position);
      o && (qe.x = i.position.x), n && (qe.y = i.position.y);
      const Oe = { position: qe };
      t.handle && (Oe.size = {
        width: Math.max(1, Math.round(ze.width)),
        height: Math.max(1, Math.round(ze.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Oe } })
      );
    }), ne(this, Ut, () => {
      if (!A(this, vt)) return;
      const e = A(this, vt).moved;
      ya(this, vt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ne(this, Os, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ne(this, Is, () => {
      this._dropTarget = !1;
    }), ne(this, As, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = M(this, E, Ps).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: M(this, E, Kr).call(this, e) }
        })
      );
    }), ne(this, Ls, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ne(this, Rs, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Nn(t.position)) && this.requestUpdate();
    }), ne(this, Ws, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), ya(this, xi, new ResizeObserver(() => M(this, E, Ds).call(this))), A(this, xi).observe(this), window.addEventListener("pointermove", A(this, va)), window.addEventListener("pointerup", A(this, Ut)), window.addEventListener("pointercancel", A(this, Ut));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = A(this, xi)) == null || e.disconnect(), window.removeEventListener("pointermove", A(this, va)), window.removeEventListener("pointerup", A(this, Ut)), window.removeEventListener("pointercancel", A(this, Ut));
  }
  updated(e) {
    M(this, E, Ds).call(this), e.has("zoom") && M(this, E, ho).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = A(this, ot).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    M(this, E, Wr).call(this);
    const s = this.showRulers ? Gr : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${A(this, Ls)}
        @dragover=${A(this, Os)}
        @dragleave=${A(this, Is)}
        @drop=${A(this, As)}
        @di-layer-drag-start=${A(this, zs)}
        @di-layer-box-resize=${A(this, Rs)}>
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
              </di-rulers>` : p}

          <div
            class="stage"
            style=${V({
      background: e.backgroundGradient ? vr(e.backgroundGradient) : e.background
    })}
            @pointerdown=${A(this, Ws)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${V({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

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
                  .resolvedPosition=${(l = A(this, ot).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? M(this, E, Vr).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
vt = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
ot = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
ho = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Ds = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Gr : 0) + Qu, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, M(this, E, ho).call(this));
};
Ps = function(e, t) {
  const i = M(this, E, Za).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Za = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
po = function(e) {
  const t = A(this, ot).get(e.key);
  if (t) return t.box;
  const i = M(this, E, mo).call(this, e), a = Xa(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Ms = function(e) {
  const t = A(this, ot).get(e.key);
  return t ? t.extent : Wn(M(this, E, po).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Rr = function(e) {
  var t;
  return ((t = A(this, ot).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Wr = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  ya(this, ot, Yc(
    this.template.layers,
    (i) => M(this, E, mo).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
mo = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? M(this, E, Nr).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? M(this, E, Fr).call(this, e, i)
  };
};
Nr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Fr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
zs = /* @__PURE__ */ new WeakMap();
va = /* @__PURE__ */ new WeakMap();
Ur = function(e, t, i, a, s, o, n, l) {
  const d = t.startRotation, f = t.startPosition, k = Vc(a, s, 0, 0, d);
  let Y = M(this, E, fo).call(this, t.startBox, i, k.x, k.y, o);
  n && (Y = { ...Y, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : Y.width }), l && (Y = { ...Y, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : Y.height });
  const xe = Math.max(1, Math.round(Y.width)), ze = Math.max(1, Math.round(Y.height)), qe = Zs(Y.x, Y.y, xe, ze, f.anchor), Oe = Kt(qe.x, qe.y, f.x, f.y, d), aa = {
    ...e.position,
    x: n ? e.position.x : Math.round(Oe.x),
    y: l ? e.position.y : Math.round(Oe.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: aa, size: { width: xe, height: ze } } }
    })
  );
};
Br = function(e, t, i) {
  const a = t.startPosition, s = M(this, E, Za).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, d = i.shiftKey ? eh : th, f = Rn(Math.round(l / d) * d);
  this._guides = [], f !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: f } }
    })
  );
};
Ut = /* @__PURE__ */ new WeakMap();
fo = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: d } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, d = e.height - a), t.includes("s") && (d = e.height + a), s && e.width > 0 && e.height > 0) {
    const f = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(d - e.height) ? d = l / f : l = d * f, t.includes("n") && (n = e.y + e.height - d), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, d) };
};
Os = /* @__PURE__ */ new WeakMap();
Is = /* @__PURE__ */ new WeakMap();
As = /* @__PURE__ */ new WeakMap();
Kr = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Ls = /* @__PURE__ */ new WeakMap();
Rs = /* @__PURE__ */ new WeakMap();
Ws = /* @__PURE__ */ new WeakMap();
Vr = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${V({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
te.styles = I`
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
      ${oo}
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
  y({ type: Object })
], te.prototype, "template", 2);
oe([
  y({ type: String })
], te.prototype, "selectedLayerKey", 2);
oe([
  y({ type: Object })
], te.prototype, "baseImageUrl", 2);
oe([
  y({ type: Array })
], te.prototype, "serverBounds", 2);
oe([
  y({ type: Boolean })
], te.prototype, "showMeasured", 2);
oe([
  y({ type: Boolean })
], te.prototype, "snapEnabled", 2);
oe([
  y({ type: Boolean })
], te.prototype, "showRulers", 2);
oe([
  y({ type: Boolean })
], te.prototype, "showSafeArea", 2);
oe([
  y({ type: Number })
], te.prototype, "zoom", 2);
oe([
  m()
], te.prototype, "_fitScale", 2);
oe([
  m()
], te.prototype, "_guides", 2);
oe([
  m()
], te.prototype, "_pointer", 2);
oe([
  m()
], te.prototype, "_dropTarget", 2);
te = oe([
  R("di-designer-canvas")
], te);
var ih = Object.defineProperty, ah = Object.getOwnPropertyDescriptor, Hr = (e) => {
  throw TypeError(e);
}, go = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ah(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ih(t, i, s), s;
}, jr = (e, t, i) => t.has(e) || Hr("Cannot " + i), sh = (e, t, i) => (jr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), oh = (e, t, i) => t.has(e) ? Hr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Te = (e, t, i) => (jr(e, t, "access private method"), i), ce, Xr, Yr, qr, Jr, Zr, _t;
const Yo = {
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
    super(...arguments), oh(this, ce), this.properties = [], this._search = "";
  }
  render() {
    const e = nh(sh(this, ce, Xr));
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
      ([t, i]) => Te(this, ce, Jr).call(this, t, i)
    )}

        ${Te(this, ce, Zr).call(this)}
      </div>
    `;
  }
};
ce = /* @__PURE__ */ new WeakSet();
Xr = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Yr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
qr = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Jr = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${B(
    t,
    (i) => i.alias,
    (i) => Te(this, ce, _t).call(
      this,
      i.name,
      Yo[i.classification] ?? Yo.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Zr = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Te(this, ce, _t).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Te(this, ce, _t).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Te(this, ce, _t).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Te(this, ce, _t).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Te(this, ce, _t).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
_t = function(e, t, i, a, s) {
  const o = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(n) => Te(this, ce, qr).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => Te(this, ce, Yr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Ii.styles = I`
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
go([
  y({ type: Array })
], Ii.prototype, "properties", 2);
go([
  m()
], Ii.prototype, "_search", 2);
Ii = go([
  R("di-property-palette")
], Ii);
function nh(e) {
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
function rh(e) {
  return e.backgroundGradient ? "gradient" : lh(e.background) ? "transparent" : "colour";
}
function lh(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function ch(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var uh = Object.defineProperty, hh = Object.getOwnPropertyDescriptor, Qr = (e) => {
  throw TypeError(e);
}, Qa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && uh(t, i, s), s;
}, el = (e, t, i) => t.has(e) || Qr("Cannot " + i), Qe = (e, t, i) => (el(e, t, "read from private field"), i ? i.call(e) : t.get(e)), dh = (e, t, i) => t.has(e) ? Qr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Si = (e, t, i) => (el(e, t, "access private method"), i), ae, Ai, Ci, es, tl, il;
let hi = class extends F {
  constructor() {
    super(...arguments), dh(this, ae), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Qe(this, ae, Ai)};opacity:${Qe(this, ae, Ci)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Si(this, ae, es).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Qe(this, ae, Ai)}
                  @input=${(e) => Si(this, ae, tl).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Qe(this, ae, Ci))}
                    @input=${(e) => Si(this, ae, il).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Qe(this, ae, Ci) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
ae = /* @__PURE__ */ new WeakSet();
Ai = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
Ci = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
es = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
tl = function(e) {
  const t = Qe(this, ae, Ci);
  Si(this, ae, es).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${al(t)}`);
};
il = function(e) {
  Si(this, ae, es).call(this, e >= 0.999 ? Qe(this, ae, Ai).toUpperCase() : `${Qe(this, ae, Ai).toUpperCase()}${al(e)}`);
};
hi.styles = I`
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
Qa([
  y({ type: String })
], hi.prototype, "value", 2);
Qa([
  y({ type: String })
], hi.prototype, "label", 2);
Qa([
  m()
], hi.prototype, "_open", 2);
hi = Qa([
  R("di-colour-input")
], hi);
const al = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var ph = Object.defineProperty, mh = Object.getOwnPropertyDescriptor, sl = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? mh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ph(t, i, s), s;
};
const qo = {
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
let Ia = class extends F {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${B(
      Ln,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${qo[e]}
              title=${qo[e]}
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
Ia.styles = I`
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
sl([
  y({ type: String })
], Ia.prototype, "value", 2);
Ia = sl([
  R("di-anchor-picker")
], Ia);
var fh = Object.defineProperty, gh = Object.getOwnPropertyDescriptor, ol = (e) => {
  throw TypeError(e);
}, pt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && fh(t, i, s), s;
}, yh = (e, t, i) => t.has(e) || ol("Cannot " + i), vh = (e, t, i) => t.has(e) ? ol("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), bh = (e, t, i) => (yh(e, t, "access private method"), i), Ns, nl;
let Me = class extends F {
  constructor() {
    super(...arguments), vh(this, Ns), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${bh(this, Ns, nl)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
Ns = /* @__PURE__ */ new WeakSet();
nl = function(e) {
  const t = e.target, i = t.value, a = Iu(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Me.styles = I`
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
pt([
  y({ type: Number })
], Me.prototype, "value", 2);
pt([
  y({ type: String })
], Me.prototype, "label", 2);
pt([
  y({ type: String })
], Me.prototype, "suffix", 2);
pt([
  y({ type: Number })
], Me.prototype, "step", 2);
pt([
  y({ type: Number })
], Me.prototype, "min", 2);
pt([
  y({ type: Number })
], Me.prototype, "max", 2);
pt([
  y({ type: String })
], Me.prototype, "placeholder", 2);
Me = pt([
  R("di-number-field")
], Me);
var _h = Object.defineProperty, wh = Object.getOwnPropertyDescriptor, rl = (e) => {
  throw TypeError(e);
}, fi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && _h(t, i, s), s;
}, $h = (e, t, i) => t.has(e) || rl("Cannot " + i), xh = (e, t, i) => t.has(e) ? rl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => ($h(e, t, "access private method"), i), u, b, ve, ll, cl, ul, yo, Fs, hl, dl, pl, ml, fl, gl, yl, Us, vl, ba, bl, _l, gi, vo, wl;
let ct = class extends F {
  constructor() {
    super(...arguments), xh(this, u), this.properties = [], this.linkedProperties = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, u, hl).call(this, this.layer) : h(this, u, ll).call(this)}</div>` : p;
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
ll = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => h(this, u, ve).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => h(this, u, ve).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${h(this, u, cl).call(this, e)}

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${$l(e.baseImage.kind)}
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
              ${h(this, u, gi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, u, ve).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${ee(["cover", "contain", "stretch"], e.baseImageFit)}
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
cl = function(e) {
  const t = rh(e);
  return r`
      <label class="field">
        <span>Fill</span>
        <uui-select
          .value=${t}
          .options=${ee(["colour", "gradient", "transparent"], t)}
          @change=${(i) => h(this, u, ul).call(this, e, i.target.value)}>
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

      ${t === "gradient" && e.backgroundGradient ? h(this, u, yo).call(this, e.backgroundGradient, (i) => h(this, u, ve).call(this, { backgroundGradient: i })) : p}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : p}
    `;
};
ul = function(e, t) {
  if (t === "gradient") {
    h(this, u, ve).call(this, { backgroundGradient: e.backgroundGradient ?? An() });
    return;
  }
  h(this, u, ve).call(this, {
    background: ch(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
yo = function(e, t) {
  return r`
      <label class="field">
        <span>Type</span>
        <uui-select
          .value=${e.kind}
          .options=${ee(["linear", "radial"], e.kind)}
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
            ${h(this, u, Fs).call(this, "Centre X", e.centreX, (i) => t({ ...e, centreX: i }))}
            ${h(this, u, Fs).call(this, "Centre Y", e.centreY, (i) => t({ ...e, centreY: i }))}
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
Fs = function(e, t, i) {
  return r`<di-number-field
      .min=${g.gradientCentre.min * 100}
      .max=${g.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
hl = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, u, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, u, dl).call(this, e) : p}
      ${e.type === "text" ? h(this, u, pl).call(this, e) : p}
      ${e.type === "image" ? h(this, u, ml).call(this, e) : p}
      ${e.type === "badges" ? h(this, u, fl).call(this, e) : p}
      ${e.type === "rect" ? h(this, u, gl).call(this, e) : p}
      ${h(this, u, yl).call(this, e)} ${h(this, u, _l).call(this, e)}
    `;
};
dl = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${ee(
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
pl = function(e) {
  const t = e.style, i = (a) => h(this, u, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, u, vo).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, u, wl).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
              .options=${ee(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${ee(["left", "centre", "right"], t.textAlign)}
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
              .options=${ee(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${ee(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
ml = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${$l(t.kind)}
            @change=${(a) => h(this, u, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, gi).call(this, t.propertyAlias ?? "", (a) => h(this, u, b).call(this, { source: { ...t, propertyAlias: a } }), "media")}
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
            .options=${ee(["cover", "contain", "stretch"], e.fit)}
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
fl = function(e) {
  const t = (s) => h(this, u, b).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, u, b).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, u, b).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, u, gi).call(this, e.itemsPropertyAlias, (s) => h(this, u, b).call(this, { itemsPropertyAlias: s }))}
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
            .options=${ee(["horizontal", "vertical"], e.direction)}
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
            .options=${ee(["below", "right", "none"], e.label.position, {
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
                  .options=${h(this, u, vo).call(this, e.label.fontKey)}
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
                  .options=${ee(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
gl = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${ee(["rectangle", "ellipse", "polygon", "star"], t)}
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
    gradient: s.target.checked ? An() : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? h(this, u, yo).call(this, e.gradient, (s) => h(this, u, b).call(this, { gradient: s })) : p}

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
yl = function(e) {
  const t = De(e.position, "x"), i = De(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, u, Us).call(this, e, "x")} ${h(this, u, Us).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, u, bl).call(this, e, s.detail.value)}>
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
            @change=${(s) => h(this, u, b).call(this, { rotation: Rn(s.detail.value ?? 0) })}>
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
Us = function(e, t) {
  const i = De(e.position, t), a = Ta(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => h(this, u, vl).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => h(this, u, ba).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${ee(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => h(this, u, ba).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${g.referenceGap.min}
                .max=${g.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => h(this, u, ba).call(this, e, t, { gap: n.detail.value ?? 0 })}>
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
vl = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (De(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && h(this, u, b).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Gc
      }
    }
  });
};
ba = function(e, t, i) {
  const a = Ta(e.position, t);
  a && h(this, u, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
bl = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? Bc(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, u, b).call(this, { position: s });
};
_l = function(e) {
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
            .options=${ee(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
vo = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
wl = function(e, t, i) {
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
ct.styles = I`
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
fi([
  y({ type: Object })
], ct.prototype, "template", 2);
fi([
  y({ type: Object })
], ct.prototype, "layer", 2);
fi([
  y({ type: Array })
], ct.prototype, "properties", 2);
fi([
  y({ type: Object })
], ct.prototype, "linkedProperties", 2);
fi([
  y({ type: Array })
], ct.prototype, "fonts", 2);
ct = fi([
  R("di-layer-inspector")
], ct);
function ee(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function $l(e) {
  return ee(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var kh = Object.defineProperty, Sh = Object.getOwnPropertyDescriptor, xl = (e) => {
  throw TypeError(e);
}, Qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Sh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && kh(t, i, s), s;
}, Ch = (e, t, i) => t.has(e) || xl("Cannot " + i), Th = (e, t, i) => t.has(e) ? xl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ke = (e, t, i) => (Ch(e, t, "access private method"), i), de, wt, kl, Sl, Cl, Tl;
const Eh = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Lt = class extends F {
  constructor() {
    super(...arguments), Th(this, de), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${ke(this, de, Cl)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : B(
      e,
      (t) => t.key,
      (t, i) => ke(this, de, Tl).call(this, t, i)
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
de = /* @__PURE__ */ new WeakSet();
wt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
kl = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Sl = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Cl = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  ke(this, de, wt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Tl = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => ke(this, de, kl).call(this, a, e.key)}
        @dragover=${(a) => ke(this, de, Sl).call(this, a, t)}
        @click=${() => ke(this, de, wt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Eh[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, de, wt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, de, wt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, de, wt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, de, wt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Lt.styles = I`
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
Qi([
  y({ type: Array })
], Lt.prototype, "layers", 2);
Qi([
  y({ type: String })
], Lt.prototype, "selectedLayerKey", 2);
Qi([
  m()
], Lt.prototype, "_dragKey", 2);
Qi([
  m()
], Lt.prototype, "_dropIndex", 2);
Lt = Qi([
  R("di-layers-panel")
], Lt);
var Dh = Object.defineProperty, Ph = Object.getOwnPropertyDescriptor, El = (e) => {
  throw TypeError(e);
}, je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ph(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Dh(t, i, s), s;
}, bo = (e, t, i) => t.has(e) || El("Cannot " + i), Mh = (e, t, i) => (bo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Jo = (e, t, i) => t.has(e) ? El("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), zh = (e, t, i, a) => (bo(e, t, "write to private field"), t.set(e, i), i), se = (e, t, i) => (bo(e, t, "access private method"), i), q, Ae, Aa, Dl, Pl, ki;
let $e = class extends F {
  constructor() {
    super(...arguments), Jo(this, q), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Jo(this, Aa, 100);
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
            @click=${() => se(this, q, Ae).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${za.min * 100}
            .max=${za.max * 100}
            .value=${se(this, q, Dl).call(this)}
            @change=${se(this, q, Pl)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => se(this, q, Ae).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => se(this, q, Ae).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${se(this, q, ki).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${se(this, q, ki).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${se(this, q, ki).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${se(this, q, ki).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => se(this, q, Ae).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => se(this, q, Ae).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => se(this, q, Ae).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
q = /* @__PURE__ */ new WeakSet();
Ae = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Aa = /* @__PURE__ */ new WeakMap();
Dl = function() {
  return this.matches(":focus-within") || zh(this, Aa, Math.round(this.effectiveScale * 100)), Mh(this, Aa);
};
Pl = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && se(this, q, Ae).call(this, "di-zoom-change", { zoom: t / 100 });
};
ki = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => se(this, q, Ae).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
$e.styles = I`
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
je([
  y({ type: Number })
], $e.prototype, "effectiveScale", 2);
je([
  y({ type: Boolean })
], $e.prototype, "snapEnabled", 2);
je([
  y({ type: Boolean })
], $e.prototype, "showRulers", 2);
je([
  y({ type: Boolean })
], $e.prototype, "showSafeArea", 2);
je([
  y({ type: Boolean })
], $e.prototype, "showMeasured", 2);
je([
  y({ type: Boolean })
], $e.prototype, "canUndo", 2);
je([
  y({ type: Boolean })
], $e.prototype, "canRedo", 2);
je([
  y({ type: Boolean })
], $e.prototype, "previewing", 2);
$e = je([
  R("di-canvas-toolbar")
], $e);
var Oh = Object.defineProperty, Ih = Object.getOwnPropertyDescriptor, Ml = (e) => {
  throw TypeError(e);
}, ea = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ih(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Oh(t, i, s), s;
}, _o = (e, t, i) => t.has(e) || Ml("Cannot " + i), Q = (e, t, i) => (_o(e, t, "read from private field"), t.get(e)), mt = (e, t, i) => t.has(e) ? Ml("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mt = (e, t, i, a) => (_o(e, t, "write to private field"), t.set(e, i), i), We = (e, t, i) => (_o(e, t, "access private method"), i), et, jt, Xt, zt, La, Ra, be, wo, _a, $o, Bs;
const Ah = 400;
let Rt = class extends F {
  constructor() {
    super(), mt(this, be), mt(this, et), mt(this, jt), mt(this, Xt), mt(this, zt), mt(this, La), mt(this, Ra, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(Nt, (e) => {
      Mt(this, et, e), e && (this.observe(e.template, (t) => {
        t && We(this, be, _a).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Mt(this, La, t);
        const i = (a = Q(this, et)) == null ? void 0 : a.getData();
        i && We(this, be, _a).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Mt(this, Ra, t ?? !0);
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
    const e = (t = Q(this, et)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(Q(this, jt)), this._collapsed = !1, We(this, be, $o).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(Q(this, jt)), (e = Q(this, Xt)) == null || e.abort(), We(this, be, wo).call(this);
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
        const t = (e = Q(this, et)) == null ? void 0 : e.getData();
        t && We(this, be, _a).call(this, t);
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
jt = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
zt = /* @__PURE__ */ new WeakMap();
La = /* @__PURE__ */ new WeakMap();
Ra = /* @__PURE__ */ new WeakMap();
be = /* @__PURE__ */ new WeakSet();
wo = function() {
  Q(this, zt) && (URL.revokeObjectURL(Q(this, zt)), Mt(this, zt, void 0));
};
_a = function(e) {
  this._collapsed || (window.clearTimeout(Q(this, jt)), Mt(this, jt, window.setTimeout(() => void We(this, be, $o).call(this, e), Ah)));
};
$o = async function(e) {
  var t;
  if (Q(this, et)) {
    (t = Q(this, Xt)) == null || t.abort(), Mt(this, Xt, new AbortController()), We(this, be, Bs).call(this, !0), this._error = void 0;
    try {
      const i = await Ys(
        e,
        {
          signal: Q(this, Xt).signal,
          contentKey: Q(this, La),
          useSampleData: Q(this, Ra)
        },
        Q(this, et).getToken
      );
      We(this, be, wo).call(this), Mt(this, zt, URL.createObjectURL(i)), this._url = Q(this, zt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      We(this, be, Bs).call(this, !1);
    }
  }
};
Bs = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Rt.styles = I`
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
      ${oo}
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
ea([
  m()
], Rt.prototype, "_url", 2);
ea([
  m()
], Rt.prototype, "_loading", 2);
ea([
  m()
], Rt.prototype, "_error", 2);
ea([
  m()
], Rt.prototype, "_collapsed", 2);
Rt = ea([
  R("di-preview-strip")
], Rt);
var Lh = Object.defineProperty, Rh = Object.getOwnPropertyDescriptor, zl = (e) => {
  throw TypeError(e);
}, X = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Lh(t, i, s), s;
}, xo = (e, t, i) => t.has(e) || zl("Cannot " + i), v = (e, t, i) => (xo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ft = (e, t, i) => t.has(e) ? zl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ti = (e, t, i, a) => (xo(e, t, "write to private field"), t.set(e, i), i), ie = (e, t, i) => (xo(e, t, "access private method"), i), x, Li, Ri, Wi, Yt, W, Ks, ko, Ol, Il, Vs, Al, Ll, Rl, Gs, Wl, Nl, Fl, Ul, So, Bl, wa;
const Wh = 400;
let N = class extends F {
  constructor() {
    super(), ft(this, W), ft(this, x), ft(this, Li), ft(this, Ri), ft(this, Wi), ft(this, Yt), this._properties = [], this._linkedProperties = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, ft(this, wa, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = v(this, x);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = v(this, W, Ks);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), ie(this, W, Vs).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, d = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, f = De(s.position, "x") ? 0 : l, k = De(s.position, "y") ? 0 : d;
            if (f === 0 && k === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + f, y: s.position.y + k }
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
      Ti(this, Li, e);
    }), this.consumeContext(Ge, (e) => {
      Ti(this, Ri, e);
    }), this.consumeContext(Nt, (e) => {
      Ti(this, x, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (ie(this, W, Al).call(this, t), ie(this, W, Ll).call(this, t), ie(this, W, Rl).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", v(this, wa));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", v(this, wa)), window.clearTimeout(v(this, Wi)), (e = v(this, Yt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = v(this, x)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = v(this, x)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = v(this, x)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => ie(this, W, Vs).call(this, e.detail.key)}
        @di-layer-detach=${(e) => ie(this, W, Il).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = v(this, x)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = v(this, x)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = v(this, x)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = v(this, x)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = v(this, x)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = v(this, x)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => ie(this, W, Gs).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => ie(this, W, Gs).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-pick-base-image=${ie(this, W, Fl)}
        @di-pick-layer-image=${(e) => ie(this, W, Ul).call(this, e.detail.key)}
        @di-use-image-size=${ie(this, W, Bl)}
        @di-request-preview=${() => {
      var e;
      return (e = v(this, W, Ol)) == null ? void 0 : e.refresh();
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
      return (e = v(this, x)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = v(this, x)) == null ? void 0 : e.redo();
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
            .layer=${v(this, W, Ks)}
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
x = /* @__PURE__ */ new WeakMap();
Li = /* @__PURE__ */ new WeakMap();
Ri = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
Yt = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakSet();
Ks = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
ko = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Ol = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Il = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = v(this, W, ko)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = v(this, x)) == null || n.updateLayer(e, { position: gs(i.position, t, a) });
};
Vs = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = v(this, W, ko)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = v(this, x)) == null || s.removeLayer(e, t);
};
Al = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && v(this, x) && await ar(t, v(this, x).getToken);
};
Ll = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !v(this, x)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Js(t.mediaKey, v(this, x).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Rl = function() {
  window.clearTimeout(v(this, Wi)), Ti(this, Wi, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !v(this, x))) {
      (t = v(this, Yt)) == null || t.abort(), Ti(this, Yt, new AbortController());
      try {
        const i = await qs(
          e,
          { signal: v(this, Yt).signal, useSampleData: !0 },
          v(this, x).getToken
        );
        v(this, x).setServerBounds(i.layers), v(this, x).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, Wh));
};
Gs = function(e, t, i, a) {
  const s = this._template;
  if (!s || !v(this, x)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: ie(this, W, Nl).call(this) };
  if (e.kind === "property") {
    const l = Nc(e.property, o);
    if (l.kind === "condition") {
      ie(this, W, Wl).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    v(this, x).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? On(o, "Image") : e.layerType === "badges" ? In(o, "Badges", "") : e.layerType === "rect" ? Rc(o, "Shape", e.shape) : zn(o, "Text", { kind: "static", text: "Text" });
  v(this, x).addLayer(n);
};
Wl = function(e, t, i) {
  var o, n, l, d;
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
  (l = v(this, x)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (d = v(this, Ri)) == null || d.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
Nl = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Fl = async function() {
  var t;
  const e = await ie(this, W, So).call(this);
  e && ((t = v(this, x)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
Ul = async function(e) {
  var i;
  const t = await ie(this, W, So).call(this);
  t && ((i = v(this, x)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
So = async function() {
  if (!v(this, Li)) return;
  const e = v(this, Li).open(this, nn, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
Bl = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !v(this, x)) return;
  const t = await Js(e.mediaKey, v(this, x).getToken).catch(() => {
  });
  t && v(this, x).updateCanvas({ width: t.width, height: t.height });
};
wa = /* @__PURE__ */ new WeakMap();
N.styles = I`
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
X([
  m()
], N.prototype, "_template", 2);
X([
  m()
], N.prototype, "_selectedKey", 2);
X([
  m()
], N.prototype, "_properties", 2);
X([
  m()
], N.prototype, "_linkedProperties", 2);
X([
  m()
], N.prototype, "_fonts", 2);
X([
  m()
], N.prototype, "_serverBounds", 2);
X([
  m()
], N.prototype, "_baseImageUrl", 2);
X([
  m()
], N.prototype, "_zoom", 2);
X([
  m()
], N.prototype, "_effectiveScale", 2);
X([
  m()
], N.prototype, "_previewing", 2);
X([
  m()
], N.prototype, "_snapEnabled", 2);
X([
  m()
], N.prototype, "_showRulers", 2);
X([
  m()
], N.prototype, "_showSafeArea", 2);
X([
  m()
], N.prototype, "_showMeasured", 2);
X([
  m()
], N.prototype, "_canUndo", 2);
X([
  m()
], N.prototype, "_canRedo", 2);
N = X([
  R("di-design-view")
], N);
const Nh = N, Fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return N;
  },
  default: Nh
}, Symbol.toStringTag, { value: "Module" }));
var Uh = Object.defineProperty, Bh = Object.getOwnPropertyDescriptor, Kl = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Uh(t, i, s), s;
}, Co = (e, t, i) => t.has(e) || Kl("Cannot " + i), K = (e, t, i) => (Co(e, t, "read from private field"), t.get(e)), Ft = (e, t, i) => t.has(e) ? Kl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qt = (e, t, i, a) => (Co(e, t, "write to private field"), t.set(e, i), i), Z = (e, t, i) => (Co(e, t, "access private method"), i), pe, Ni, Fi, Jt, Ot, G, Vl, Wa, Gl, Hl, To, jl, Ui, Xl, Yl, ql;
let ue = class extends F {
  constructor() {
    super(), Ft(this, G), Ft(this, pe), Ft(this, Ni), Ft(this, Fi), Ft(this, Jt), Ft(this, Ot), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Ua, (e) => {
      qt(this, Ni, e);
    }), this.consumeContext(Ge, (e) => {
      qt(this, Fi, e);
    }), this.consumeContext(Nt, (e) => {
      qt(this, pe, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Z(this, G, Vl).call(this);
      });
    });
  }
  connectedCallback() {
    super.connectedCallback(), Z(this, G, Ui).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = K(this, Jt)) == null || e.abort(), Z(this, G, To).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${Z(this, G, jl)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => Z(this, G, Ui).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${Z(this, G, Yl)}>
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
                ${B(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => Z(this, G, ql).call(this, e)
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
                @click=${Z(this, G, Xl)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
pe = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
Fi = /* @__PURE__ */ new WeakMap();
Jt = /* @__PURE__ */ new WeakMap();
Ot = /* @__PURE__ */ new WeakMap();
G = /* @__PURE__ */ new WeakSet();
Vl = async function() {
  var t;
  const e = Z(this, G, Gl).call(this);
  e && (this._sampleNode = e, (t = K(this, pe)) == null || t.setSampleContentKey(e.key), await Z(this, G, Ui).call(this));
};
Wa = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
Gl = function() {
  try {
    const e = localStorage.getItem(Z(this, G, Wa).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
Hl = function(e) {
  try {
    e ? localStorage.setItem(Z(this, G, Wa).call(this), JSON.stringify(e)) : localStorage.removeItem(Z(this, G, Wa).call(this));
  } catch {
  }
};
To = function() {
  K(this, Ot) && (URL.revokeObjectURL(K(this, Ot)), qt(this, Ot, void 0));
};
jl = async function() {
  var i, a, s;
  if (!K(this, Ni) || !this._template) return;
  const e = K(this, Ni).open(this, vu, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, Z(this, G, Hl).call(this, t.item), (s = K(this, pe)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await Z(this, G, Ui).call(this));
};
Ui = async function() {
  var i, a;
  const e = this._template;
  if (!e || !K(this, pe)) return;
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
      Ys(e, t, K(this, pe).getToken),
      qs(e, t, K(this, pe).getToken)
    ]);
    Z(this, G, To).call(this), qt(this, Ot, URL.createObjectURL(s)), this._url = K(this, Ot), this._bounds = o.layers, this._skipped = o.skipped ?? [], K(this, pe).setServerBounds(o.layers), K(this, pe).setIssues(o.issues);
  } catch (s) {
    if ((s == null ? void 0 : s.name) === "AbortError") return;
    this._error = s instanceof Error ? s.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Xl = async function() {
  var e, t;
  if (!(!this._sampleNode || !K(this, pe))) {
    this._regenerating = !0;
    try {
      const i = await Ka(this._sampleNode.key, K(this, pe).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = K(this, Fi)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? `'${this._sampleNode.name}': ${i.outcome}` }
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
Yl = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
ql = function(e) {
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
ue.styles = I`
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
      ${oo}
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
  m()
], ue.prototype, "_template", 2);
Xe([
  m()
], ue.prototype, "_sampleNode", 2);
Xe([
  m()
], ue.prototype, "_bounds", 2);
Xe([
  m()
], ue.prototype, "_skipped", 2);
Xe([
  m()
], ue.prototype, "_url", 2);
Xe([
  m()
], ue.prototype, "_loading", 2);
Xe([
  m()
], ue.prototype, "_error", 2);
Xe([
  m()
], ue.prototype, "_regenerating", 2);
ue = Xe([
  R("di-preview-view")
], ue);
const Kh = ue, Vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return ue;
  },
  default: Kh
}, Symbol.toStringTag, { value: "Module" }));
var Gh = Object.defineProperty, Hh = Object.getOwnPropertyDescriptor, Jl = (e) => {
  throw TypeError(e);
}, ts = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Hh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gh(t, i, s), s;
}, Eo = (e, t, i) => t.has(e) || Jl("Cannot " + i), U = (e, t, i) => (Eo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), cs = (e, t, i) => t.has(e) ? Jl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Zo = (e, t, i, a) => (Eo(e, t, "write to private field"), t.set(e, i), i), st = (e, t, i) => (Eo(e, t, "access private method"), i), H, Wt, _e, Zl, Ql, ec, tc, ic, ac, sc, oc, nc;
let ut = class extends F {
  constructor() {
    super(), cs(this, _e), cs(this, H), cs(this, Wt), this._properties = [], this._showAdvanced = !1, this.consumeContext(Ua, (e) => {
      Zo(this, Wt, e);
    }), this.consumeContext(Nt, (e) => {
      Zo(this, H, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${st(this, _e, ac).call(this)} ${st(this, _e, sc).call(this)} ${st(this, _e, oc).call(this)} ${st(this, _e, nc).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
H = /* @__PURE__ */ new WeakMap();
Wt = /* @__PURE__ */ new WeakMap();
_e = /* @__PURE__ */ new WeakSet();
Zl = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Ql = async function() {
  var a, s;
  if (!U(this, Wt) || !this._template) return;
  const e = U(this, Wt).open(this, $c, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await st(this, _e, ec).call(this, t.selection.filter((o) => !!o));
  (a = U(this, H)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = U(this, H)) == null ? void 0 : s.reloadProperties());
};
ec = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => Lc), i = await t(U(this, H).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
tc = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = U(this, H)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = U(this, H)) == null || s.reloadProperties();
};
ic = async function() {
  var i;
  if (!U(this, Wt)) return;
  const e = U(this, Wt).open(this, nn, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = U(this, H)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
ac = function() {
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
                          @click=${() => st(this, _e, tc).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${st(this, _e, Ql)}>
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
    ...U(this, _e, Zl).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = U(this, H)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = U(this, H)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
sc = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${st(this, _e, ic)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = U(this, H)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
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
    return (i = U(this, H)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = U(this, H)) == null ? void 0 : i.updateOutput({
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
    return (i = U(this, H)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
oc = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = U(this, H)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = U(this, H)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
nc = function() {
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
    return (i = U(this, H)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
ut.styles = I`
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
ts([
  m()
], ut.prototype, "_template", 2);
ts([
  m()
], ut.prototype, "_properties", 2);
ts([
  m()
], ut.prototype, "_showAdvanced", 2);
ut = ts([
  R("di-settings-view")
], ut);
const jh = ut, Xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return ut;
  },
  default: jh
}, Symbol.toStringTag, { value: "Module" }));
var Yh = Object.defineProperty, qh = Object.getOwnPropertyDescriptor, rc = (e) => {
  throw TypeError(e);
}, ta = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Yh(t, i, s), s;
}, Do = (e, t, i) => t.has(e) || rc("Cannot " + i), Qo = (e, t, i) => (Do(e, t, "read from private field"), t.get(e)), en = (e, t, i) => t.has(e) ? rc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Jh = (e, t, i, a) => (Do(e, t, "write to private field"), t.set(e, i), i), tn = (e, t, i) => (Do(e, t, "access private method"), i), Bi, $a, Hs;
let Ke = class extends F {
  constructor() {
    super(), en(this, $a), en(this, Bi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Nt, (e) => {
      Jh(this, Bi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && tn(this, $a, Hs).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => tn(this, $a, Hs).call(this)}>Reload</uui-button>
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
$a = /* @__PURE__ */ new WeakSet();
Hs = async function() {
  const e = this._template;
  if (!(!e || !Qo(this, Bi))) {
    this._loading = !0;
    try {
      this._usage = await Tn(e.key, Qo(this, Bi).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Ke.styles = I`
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
ta([
  m()
], Ke.prototype, "_template", 2);
ta([
  m()
], Ke.prototype, "_usage", 2);
ta([
  m()
], Ke.prototype, "_loading", 2);
ta([
  m()
], Ke.prototype, "_onlyMissing", 2);
Ke = ta([
  R("di-usage-view")
], Ke);
const Zh = Ke, Qh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Ke;
  },
  default: Zh
}, Symbol.toStringTag, { value: "Module" })), ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ro,
  default: Ro
}, Symbol.toStringTag, { value: "Module" })), td = 1500;
var fe, Dt, Fa, lc;
class us extends Sc {
  constructor(i, a) {
    super(i, a);
    w(this, Fa);
    w(this, fe);
    w(this, Dt);
    this.consumeContext(Ge, (s) => {
      _(this, fe, s);
    }), this.consumeContext(Nt, (s) => {
      _(this, Dt, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, Dt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, fe)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await js(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await kn(a.key, !1, i.getToken);
        (o = c(this, fe)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await T(this, Fa, lc).call(this, l, i);
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
    c(this, Dt) && await Cn(i, c(this, Dt).getToken);
  }
}
fe = new WeakMap(), Dt = new WeakMap(), Fa = new WeakSet(), lc = async function(i, a) {
  var o, n, l, d;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((f) => setTimeout(f, td));
    try {
      s = await Sn(s.id, a.getToken);
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
    for (const k of s.failures.slice(0, 3))
      (l = c(this, fe)) == null || l.peek("danger", { data: { message: k } });
  } else
    (d = c(this, fe)) == null || d.peek("danger", {
      data: { headline: `Regeneration ${s.status}`, message: s.failures[0] ?? "" }
    });
};
const id = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: us,
  api: us,
  default: us
}, Symbol.toStringTag, { value: "Module" }));
var Gi, ri;
class hs extends Dc {
  constructor(i, a) {
    super(i, a);
    w(this, Gi);
    w(this, ri);
    this.consumeContext(Ve, (s) => {
      _(this, Gi, s);
    }), this.consumeContext(Ge, (s) => {
      _(this, ri, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Ka(i, () => {
          var l;
          return (l = c(this, Gi)) == null ? void 0 : l.getLatestToken();
        }), n = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = c(this, ri)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
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
Gi = new WeakMap(), ri = new WeakMap();
const ad = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: hs,
  api: hs,
  default: hs
}, Symbol.toStringTag, { value: "Module" }));
var Hi, Pt, ji, li;
class ds extends Pc {
  constructor(i, a) {
    super(i, a);
    w(this, Hi);
    w(this, Pt);
    w(this, ji);
    w(this, li);
    this.consumeContext(Ve, (s) => {
      _(this, Hi, s);
    }), this.consumeContext(Ge, (s) => {
      _(this, Pt, s);
    }), this.consumeContext(Mc, (s) => {
      _(this, ji, s);
    }), this.consumeContext(zc, (s) => {
      _(this, li, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, li)) {
      (i = c(this, Pt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Ka(c(this, li), () => {
        var l;
        return (l = c(this, Hi)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, ji)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, Pt)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof nt && n.status === 404;
      (o = c(this, Pt)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof nt ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Hi = new WeakMap(), Pt = new WeakMap(), ji = new WeakMap(), li = new WeakMap();
const sd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: ds,
  api: ds,
  default: ds
}, Symbol.toStringTag, { value: "Module" }));
var od = Object.defineProperty, nd = Object.getOwnPropertyDescriptor, cc = (e) => {
  throw TypeError(e);
}, is = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nd(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && od(t, i, s), s;
}, Po = (e, t, i) => t.has(e) || cc("Cannot " + i), Na = (e, t, i) => (Po(e, t, "read from private field"), t.get(e)), ra = (e, t, i) => t.has(e) ? cc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), uc = (e, t, i, a) => (Po(e, t, "write to private field"), t.set(e, i), i), Bt = (e, t, i) => (Po(e, t, "access private method"), i), xa, Ki, Mo, Je, zo, hc, ka;
let ht = class extends on {
  constructor() {
    super(), ra(this, Je), ra(this, xa), ra(this, Ki), this._items = [], this._loading = !0, this._search = "", ra(this, Mo, () => {
      var e;
      return (e = Na(this, xa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ve, (e) => {
      uc(this, xa, e), e && Bt(this, Je, zo).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(Na(this, Ki));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${Bt(this, Je, hc)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Bt(this, Je, ka).call(this, void 0)}>
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
                      @open=${() => Bt(this, Je, ka).call(this, e)}
                      @click=${() => Bt(this, Je, ka).call(this, e)}>
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
xa = /* @__PURE__ */ new WeakMap();
Ki = /* @__PURE__ */ new WeakMap();
Mo = /* @__PURE__ */ new WeakMap();
Je = /* @__PURE__ */ new WeakSet();
zo = async function() {
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
        (a) => xn(a, this._search, 0, 30, Na(this, Mo)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
hc = function(e) {
  this._search = e.target.value, window.clearTimeout(Na(this, Ki)), uc(this, Ki, window.setTimeout(() => void Bt(this, Je, zo).call(this), 300));
};
ka = function(e) {
  this.value = { item: e }, this._submitModal();
};
ht.styles = I`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
is([
  m()
], ht.prototype, "_items", 2);
is([
  m()
], ht.prototype, "_loading", 2);
is([
  m()
], ht.prototype, "_search", 2);
ht = is([
  R("di-sample-node-picker-modal")
], ht);
const rd = ht, ld = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return ht;
  },
  default: rd
}, Symbol.toStringTag, { value: "Module" }));
var cd = Object.defineProperty, ud = Object.getOwnPropertyDescriptor, dc = (e) => {
  throw TypeError(e);
}, Ye = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ud(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && cd(t, i, s), s;
}, Oo = (e, t, i) => t.has(e) || dc("Cannot " + i), di = (e, t, i) => (Oo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ps = (e, t, i) => t.has(e) ? dc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hd = (e, t, i, a) => (Oo(e, t, "write to private field"), t.set(e, i), i), $t = (e, t, i) => (Oo(e, t, "access private method"), i), Sa, ia, ge, pc, mc, fc, Io, gc, yc, vc, bc;
const dd = [100, 200, 300, 400, 500, 600, 700, 800, 900], pd = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let he = class extends on {
  constructor() {
    super(), ps(this, ge), ps(this, Sa), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", ps(this, ia, () => {
      var e;
      return (e = di(this, Sa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ve, (e) => {
      hd(this, Sa, e);
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
            @change=${$t(this, ge, pc)}>
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
            @click=${$t(this, ge, fc)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${pd.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? $t(this, ge, bc).call(this) : $t(this, ge, vc).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !di(this, ge, Io)}
            @click=${$t(this, ge, gc)}>
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
Sa = /* @__PURE__ */ new WeakMap();
ia = /* @__PURE__ */ new WeakMap();
ge = /* @__PURE__ */ new WeakSet();
pc = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  $t(this, ge, mc).call(this, t);
};
mc = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await mn(t, di(this, ia));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
fc = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await fn(this._path.trim(), di(this, ia)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Io = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
gc = async function() {
  if (di(this, ge, Io)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await gn(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        di(this, ia)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
yc = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
vc = function() {
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
    dd,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => $t(this, ge, yc).call(this, e, t.target.checked)}>
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
bc = function() {
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
he.styles = I`
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
Ye([
  m()
], he.prototype, "_busy", 2);
Ye([
  m()
], he.prototype, "_error", 2);
Ye([
  m()
], he.prototype, "_path", 2);
Ye([
  m()
], he.prototype, "_provider", 2);
Ye([
  m()
], he.prototype, "_family", 2);
Ye([
  m()
], he.prototype, "_weights", 2);
Ye([
  m()
], he.prototype, "_italic", 2);
Ye([
  m()
], he.prototype, "_url", 2);
he = Ye([
  R("di-font-upload-modal")
], he);
const md = he, fd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return he;
  },
  default: md
}, Symbol.toStringTag, { value: "Module" }));
export {
  eu as manifests,
  zd as onInit
};
//# sourceMappingURL=dynamic-images.js.map
