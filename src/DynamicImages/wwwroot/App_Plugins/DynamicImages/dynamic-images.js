var In = (e) => {
  throw TypeError(e);
};
var is = (e, t, i) => t.has(e) || In("Cannot " + i);
var c = (e, t, i) => (is(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? In("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (is(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), P = (e, t, i) => (is(e, t, "access private method"), i);
var as = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { nothing as p, html as r, css as I, state as m, customElement as R, repeat as B, property as b, classMap as eo, styleMap as V } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as N } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Ve } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as Ge } from "@umbraco-cms/backoffice/notification";
import { umbOpenModal as _c, UMB_DISCARD_CHANGES_MODAL as wc, umbConfirmModal as Gs, UmbModalToken as to, UMB_MODAL_MANAGER_CONTEXT as Fa, UmbModalBaseElement as io } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as ao } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as $c } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as xc, UmbEntityWorkspaceDataManager as kc, UmbSubmitWorkspaceAction as An, UmbWorkspaceActionBase as Sc } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Tc } from "@umbraco-cms/backoffice/context-api";
import { UmbArrayState as vi, UmbStringState as Ln, UmbBooleanState as aa, UmbNumberState as Cc } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as Ec } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as Dc } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Pc } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Mc } from "@umbraco-cms/backoffice/document";
import "@umbraco-cms/backoffice/external/uui";
const Ua = "dynamic-images", Xi = "di-template", Sa = "di:templates-changed", zc = "/umbraco/management/api/v1/dynamic-images";
class ot extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function T(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let n = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), n = JSON.stringify(i.json));
  const o = await fetch(`${zc}${e}`, { ...i, headers: s, body: n });
  if (!o.ok) throw await Oc(o);
  return o;
}
async function Oc(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new ot(t, e.status, i);
}
const D = async (e) => e.json();
async function Hs(e) {
  const t = await T("/templates?take=500", e);
  return (await D(t)).items;
}
const so = async (e, t) => D(await T(`/templates/${e}`, t)), no = async (e, t) => D(await T("/templates", t, { method: "POST", json: e })), oo = async (e, t) => D(await T(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function ro(e, t) {
  await T(`/templates/${e}`, t, { method: "DELETE" });
}
const lo = async (e, t) => D(await T(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function co(e, t) {
  return (await T(`/templates/${e}/export`, t)).blob();
}
const uo = async (e, t, i) => D(await T("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), ho = async (e) => D(await T("/templates/import/appsettings", e, { method: "POST" })), Ei = async (e) => D(await T("/fonts", e));
async function po(e, t) {
  const i = new FormData();
  return i.append("file", e), D(await T("/fonts", t, { method: "POST", body: i }));
}
const mo = async (e, t) => D(await T("/fonts/register-path", t, { method: "POST", json: { path: e } })), fo = async (e, t) => D(await T("/fonts/register-web", t, { method: "POST", json: e })), go = async (e, t) => D(await T(`/fonts/${e}/refresh`, t, { method: "POST" })), yo = async (e, t, i, a, s) => D(await T(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function vo(e, t) {
  await T(`/fonts/${e}`, t, { method: "DELETE" });
}
async function bo(e, t) {
  return (await T(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Ic = async (e) => D(await T("/document-types", e)), _o = async (e, t) => D(await T(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function wo(e, t, i, a, s) {
  const n = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && n.set("query", t), D(await T(`/document-types/${encodeURIComponent(e)}/content?${n}`, s));
}
async function js(e, t, i) {
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
const Xs = async (e, t, i) => D(await T("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Ys = async (e, t) => D(await T(`/media/${e}/image-info`, t)), Ba = async (e, t) => D(await T(`/documents/${e}/regenerate`, t, { method: "POST" })), $o = async (e, t, i) => D(await T(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), xo = async (e, t) => D(await T(`/jobs/${e}`, t));
async function ko(e, t) {
  await T(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const So = async (e, t) => D(await T(`/templates/${e}/usage`, t)), Ka = async (e) => D(await T("/health", e)), To = async (e) => D(await T("/sync/status", e)), Co = async (e) => D(await T("/sync/export", e, { method: "POST" })), Eo = async (e) => D(await T("/sync/import", e, { method: "POST" }));
function li(e) {
  const t = `section/${Ua}/workspace/${Xi}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Va() {
  return new URL(`section/${Ua}/workspace/${Xi}/create`, document.baseURI).pathname;
}
function Do(e) {
  return new URL(`section/${Ua}/dashboard/${e}`, document.baseURI).pathname;
}
function ps() {
  const e = window.location.pathname.split(`/workspace/${Xi}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function di() {
  window.dispatchEvent(new CustomEvent(Sa));
}
const Ac = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: ot,
  SECTION_PATHNAME: Ua,
  TEMPLATES_CHANGED_EVENT: Sa,
  TEMPLATE_ENTITY_TYPE: Xi,
  cancelJob: ko,
  createTemplate: no,
  deleteFont: vo,
  deleteTemplate: ro,
  duplicateTemplate: lo,
  exportTemplate: co,
  fetchDocumentTypes: Ic,
  fetchFontFile: bo,
  fetchFonts: Ei,
  fetchHealth: Ka,
  fetchImageInfo: Ys,
  fetchJob: xo,
  fetchLayout: Xs,
  fetchPreview: js,
  fetchProperties: _o,
  fetchSampleContent: wo,
  fetchSyncStatus: To,
  fetchTemplate: so,
  fetchTemplates: Hs,
  fetchUsage: So,
  hrefForCreate: Va,
  hrefForDashboard: Do,
  hrefForTemplate: li,
  importFromAppSettings: ho,
  importTemplate: uo,
  notifyTemplatesChanged: di,
  refreshFont: go,
  regenerateDocument: Ba,
  regenerateTemplate: $o,
  registerFontPath: mo,
  registerWebFont: fo,
  runSyncExport: Co,
  runSyncImport: Eo,
  templateKeyFromLocation: ps,
  updateFont: yo,
  updateTemplate: oo,
  uploadFont: po
}, Symbol.toStringTag, { value: "Module" })), Ga = () => crypto.randomUUID();
function Ha(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function Po(e, t, i) {
  const { x: a, y: s } = Ha(e);
  return {
    type: "text",
    key: Ga(),
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
function Mo(e, t, i) {
  const { x: a, y: s } = Ha(e);
  return {
    type: "image",
    key: Ga(),
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
function zo(e, t, i) {
  const { x: a, y: s } = Ha(e);
  return {
    type: "badges",
    key: Ga(),
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
function Lc(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = Ha(e);
  return {
    type: "rect",
    key: Ga(),
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
function Rc(e) {
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
function Wc(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (Rc(e.classification)) {
    case "image":
      return { kind: "layer", layer: Mo(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: zo(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: Po(t, e.name, Nc(e)) };
  }
}
function Nc(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Oo() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function Fc(e) {
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
const Io = [
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
  return Io[a * 3 + i];
}
function ja(e, t, i) {
  return {
    x: e.x - t * Di(e.anchor),
    y: e.y - i * Pi(e.anchor)
  };
}
function qs(e, t, i, a, s) {
  return {
    x: e + i * Di(s),
    y: t + a * Pi(s)
  };
}
function Uc(e, t, i, a) {
  const s = ja(e, t, i), n = qs(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(n.x), y: Math.round(n.y), anchor: a };
}
function Bc(e, t) {
  const i = qs(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Ao(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Bt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const n = s * Math.PI / 180, o = Math.cos(n), l = Math.sin(n), d = e - i, f = t - a;
  return { x: i + d * o - f * l, y: a + d * l + f * o };
}
function Kc(e, t, i, a, s) {
  return Bt(e, t, i, a, -s);
}
function Lo(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Bt(e.x, e.y, t, i, a),
    Bt(e.x + e.width, e.y, t, i, a),
    Bt(e.x + e.width, e.y + e.height, t, i, a),
    Bt(e.x, e.y + e.height, t, i, a)
  ], n = Math.min(...s.map((f) => f.x)), o = Math.max(...s.map((f) => f.x)), l = Math.min(...s.map((f) => f.y)), d = Math.max(...s.map((f) => f.y));
  return { x: n, y: l, width: o - n, height: d - l };
}
const Vc = 10;
function ze(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Ro(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Ta(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Rn(e) {
  return e === "below" || e === "above";
}
function Wn(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Gc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Hc(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = Wn(i.position).map((n) => n.layerKey);
  for (; s.length > 0; ) {
    const n = s.pop();
    if (n === e) return !0;
    if (a.has(n)) continue;
    a.add(n);
    const o = t.get(n);
    o && s.push(...Wn(o.position).map((l) => l.layerKey));
  }
  return !1;
}
function jc(e, t, i) {
  const a = e.position;
  if (!Ro(a)) return a;
  if (Hc(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, n = a.y, o = Di(a.anchor), l = Pi(a.anchor);
  const d = Nn(e, a.relativeX, !1, t, i);
  d && (s = d.coordinate, o = d.factor);
  const f = Nn(e, a.relativeY, !0, t, i);
  return f && (n = f.coordinate, l = f.factor), { x: s, y: n, anchor: ms(o, l) };
}
function Nn(e, t, i, a, s) {
  if (!t || Rn(t.edge) !== i) return;
  const n = /* @__PURE__ */ new Set([e.key]);
  let o = t.layerKey;
  for (; !n.has(o); ) {
    n.add(o);
    const l = a.get(o);
    if (!l) return;
    const d = s(o);
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
    if (!f || Rn(f.edge) !== i) return;
    o = f.layerKey;
  }
}
function Xc(e, t, i) {
  const a = Gc(e), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), o = (l) => {
    const d = s.get(l.key);
    if (d) return d;
    let f;
    n.has(l.key) ? f = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (n.add(l.key), f = jc(l, a, (qe) => {
      const Le = a.get(qe);
      return Le && !i(Le) ? o(Le).extent : void 0;
    }), n.delete(l.key));
    const C = t(l), X = ja(f, C.width, C.height), ke = { x: X.x, y: X.y, width: C.width, height: C.height }, Ae = { position: f, box: ke, extent: Lo(ke, f.x, f.y, l.rotation ?? 0) };
    return s.set(l.key, Ae), Ae;
  };
  for (const l of e) o(l);
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
var re, Ne, Te, tt;
class Yc {
  constructor(t = 100) {
    w(this, re, []);
    w(this, Ne, []);
    w(this, Te, 0);
    w(this, tt);
    this.limit = t;
  }
  get canUndo() {
    return c(this, re).length > 0;
  }
  get canRedo() {
    return c(this, Ne).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Te) > 0 || (c(this, re).push(structuredClone(t)), c(this, re).length > this.limit && c(this, re).shift(), _(this, Ne, []));
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
    c(this, Te) !== 0 && (as(this, Te)._--, !(c(this, Te) > 0) && (t && c(this, tt) !== void 0 && (c(this, re).push(c(this, tt)), c(this, re).length > this.limit && c(this, re).shift(), _(this, Ne, [])), _(this, tt, void 0)));
  }
  undo(t) {
    const i = c(this, re).pop();
    if (i !== void 0)
      return c(this, Ne).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Ne).pop();
    if (i !== void 0)
      return c(this, re).push(structuredClone(t)), i;
  }
  clear() {
    _(this, re, []), _(this, Ne, []), _(this, Te, 0), _(this, tt, void 0);
  }
}
re = new WeakMap(), Ne = new WeakMap(), Te = new WeakMap(), tt = new WeakMap();
const qc = "DynamicImages.Workspace.Template";
var Jt, it, $t, xt, Zt, Qt, ei, kt, ti, Fe, ii, ai, le, Vi, St, Ce, Tt, k, Wo, si, ni, gs, ys, Re, ft, vs, bs;
class Jc extends xc {
  constructor(i) {
    super(i, qc);
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
    w(this, Fe);
    w(this, ii);
    w(this, ai);
    w(this, le);
    w(this, Vi);
    w(this, St);
    w(this, Ce);
    w(this, Tt);
    w(this, si);
    w(this, ni);
    this._data = new kc(this), this.template = this._data.current, _(this, Jt, new vi([], (a) => a.key)), this.layers = c(this, Jt).asObservable(), _(this, it, new Ln(void 0)), this.selectedLayerKey = c(this, it).asObservable(), _(this, $t, new vi([], (a) => a.alias)), this.properties = c(this, $t).asObservable(), _(this, xt, new vi([], (a) => a.key)), this.fonts = c(this, xt).asObservable(), _(this, Zt, new vi([], (a) => a.key)), this.serverBounds = c(this, Zt).asObservable(), _(this, Qt, new vi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, Qt).asObservable(), _(this, ei, new Ln(void 0)), this.sampleContentKey = c(this, ei).asObservable(), _(this, kt, new aa(!0)), this.useSampleData = c(this, kt).asObservable(), _(this, ti, new Cc(1)), this.zoom = c(this, ti).asObservable(), _(this, Fe, new aa(!0)), this.loading = c(this, Fe).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ii, new aa(!1)), this.canUndo = c(this, ii).asObservable(), _(this, ai, new aa(!1)), this.canRedo = c(this, ai).asObservable(), _(this, le, new Yc()), _(this, Ce, !1), _(this, Tt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, si, async (a) => {
      const s = a.detail;
      if (c(this, Tt) || !(s != null && s.url) || !P(this, k, Wo).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await _c(this, wc), _(this, Tt, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
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
        component: () => Promise.resolve().then(() => Un),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Un),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ve, (a) => {
      _(this, Vi, a);
    }), this.consumeContext(Ge, (a) => {
      _(this, St, a);
    }), window.addEventListener("willchangestate", c(this, si)), window.addEventListener("beforeunload", c(this, ni)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Ce);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Fe).setValue(!0), _(this, Ce, !1);
    try {
      const a = await so(i, this.getToken);
      P(this, k, ft).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await P(this, k, gs).call(this, a);
    } catch (a) {
      P(this, k, bs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Fe).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    c(this, Fe).setValue(!0), _(this, Ce, !0), P(this, k, ft).call(this, Fc(i), { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await P(this, k, gs).call(this, this._data.getCurrent()), c(this, Fe).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    i && c(this, $t).setValue(await P(this, k, ys).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    c(this, xt).setValue(await Ei(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    P(this, k, Re).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    P(this, k, Re).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    P(this, k, Re).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    P(this, k, Re).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    P(this, k, Re).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    P(this, k, Re).call(this, (s) => ({
      ...s,
      layers: s.layers.map((n) => n.key === i ? { ...n, ...a } : n)
    }));
  }
  /**
   * Removes a layer, and detaches anything positioned against it in the same update - so one undo
   * restores both the layer and the links to it. `resolvedPositions` is where those layers were
   * actually drawn, which is what lets them stay put; without it they fall back to their own
   * stored coordinates.
   */
  removeLayer(i, a) {
    P(this, k, Re).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((n) => n.key !== i).map((n) => {
        var l, d;
        let o = n.position;
        return ((l = Ta(o, "x")) == null ? void 0 : l.layerKey) === i && (o = fs(o, "x", a == null ? void 0 : a.get(n.key))), ((d = Ta(o, "y")) == null ? void 0 : d.layerKey) === i && (o = fs(o, "y", a == null ? void 0 : a.get(n.key))), o === n.position ? n : { ...n, position: o };
      })
    })), c(this, it).getValue() === i && this.selectLayer(void 0);
  }
  duplicateLayer(i) {
    var n;
    const a = (n = this._data.getCurrent()) == null ? void 0 : n.layers.find((o) => o.key === i);
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
    P(this, k, Re).call(this, (s) => {
      const n = [...s.layers], o = n.findIndex((d) => d.key === i);
      if (o < 0) return s;
      const [l] = n.splice(o, 1);
      return n.splice(Math.max(0, Math.min(n.length, a)), 0, l), { ...s, layers: n };
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
      const n = c(this, Ce) ? await no(i, this.getToken) : await oo(i, this.getToken);
      P(this, k, ft).call(this, n.template, { resetHistory: !0, persist: !0 });
      const o = c(this, Ce);
      _(this, Ce, !1), this.setIsNew(!1), di(), (a = c(this, St)) == null || a.peek("positive", {
        data: { message: `'${n.template.name}' saved.` }
      });
      for (const l of n.warnings)
        (s = c(this, St)) == null || s.peek("warning", { data: { message: l.message } });
      o && window.history.replaceState({}, "", li(n.template.key));
    } catch (n) {
      throw P(this, k, bs).call(this, "The template could not be saved", n), n;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Tt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, si)), window.removeEventListener("beforeunload", c(this, ni)), c(this, le).clear(), super.destroy();
  }
}
Jt = new WeakMap(), it = new WeakMap(), $t = new WeakMap(), xt = new WeakMap(), Zt = new WeakMap(), Qt = new WeakMap(), ei = new WeakMap(), kt = new WeakMap(), ti = new WeakMap(), Fe = new WeakMap(), ii = new WeakMap(), ai = new WeakMap(), le = new WeakMap(), Vi = new WeakMap(), St = new WeakMap(), Ce = new WeakMap(), Tt = new WeakMap(), k = new WeakSet(), /**
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
Wo = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, si = new WeakMap(), ni = new WeakMap(), gs = async function(i) {
  const [a, s] = await Promise.all([
    Ei(this.getToken).catch(() => []),
    P(this, k, ys).call(this, i.docTypeAliases)
  ]);
  c(this, xt).setValue(a), c(this, $t).setValue(s);
}, ys = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((n) => _o(n, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const n of a.flat())
    s.has(n.alias) || s.set(n.alias, n);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Re = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && c(this, le).push(s);
  const n = i(structuredClone(s));
  P(this, k, ft).call(this, n);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
ft = function(i, a) {
  a != null && a.resetHistory && c(this, le).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Jt).setValue(i.layers), P(this, k, vs).call(this);
}, vs = function() {
  c(this, ii).setValue(c(this, le).canUndo), c(this, ai).setValue(c(this, le).canRedo);
}, bs = function(i, a) {
  var n;
  const s = a instanceof ot ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (n = c(this, St)) == null || n.peek("danger", { data: { headline: i, message: s } });
};
const Wt = new Tc(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Zc = [
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
    element: () => Promise.resolve().then(() => uu),
    weight: 200,
    meta: { label: "Templates", menus: ["DynamicImages.Menu"] }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => mu),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => xu),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Cu),
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
    api: Jc,
    meta: { entityType: Xi }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => Wh),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Bh),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Hh),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Jh),
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
    api: () => Promise.resolve().then(() => Zh),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => ed),
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
    api: () => Promise.resolve().then(() => td),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => id),
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
    element: () => Promise.resolve().then(() => od)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => pd)
  }
], Pd = (e, t) => {
  t.registerMany(Zc);
};
var Qc = Object.defineProperty, eu = Object.getOwnPropertyDescriptor, No = (e) => {
  throw TypeError(e);
}, Js = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? eu(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Qc(t, i, s), s;
}, Zs = (e, t, i) => t.has(e) || No("Cannot " + i), tu = (e, t, i) => (Zs(e, t, "read from private field"), t.get(e)), Fn = (e, t, i) => t.has(e) ? No("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), iu = (e, t, i, a) => (Zs(e, t, "write to private field"), t.set(e, i), i), au = (e, t, i) => (Zs(e, t, "access private method"), i), Ca, _s, Fo;
let zt = class extends N {
  constructor() {
    super(), Fn(this, _s), Fn(this, Ca), this._name = "", this._loading = !0, this.consumeContext(Wt, (e) => {
      iu(this, Ca, e), e && (this.observe(e.template, (t) => {
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
            @input=${au(this, _s, Fo)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Ca = /* @__PURE__ */ new WeakMap();
_s = /* @__PURE__ */ new WeakSet();
Fo = function(e) {
  var i;
  const t = e.target.value;
  (i = tu(this, Ca)) == null || i.updateTemplateFields({ name: t });
};
zt.styles = I`
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
Js([
  m()
], zt.prototype, "_name", 2);
Js([
  m()
], zt.prototype, "_loading", 2);
zt = Js([
  R("di-template-editor")
], zt);
const su = zt, Un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return zt;
  },
  default: su
}, Symbol.toStringTag, { value: "Module" }));
var nu = Object.defineProperty, ou = Object.getOwnPropertyDescriptor, Uo = (e) => {
  throw TypeError(e);
}, pi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ou(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && nu(t, i, s), s;
}, Qs = (e, t, i) => t.has(e) || Uo("Cannot " + i), vt = (e, t, i) => (Qs(e, t, "read from private field"), t.get(e)), bi = (e, t, i) => t.has(e) ? Uo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ru = (e, t, i, a) => (Qs(e, t, "write to private field"), t.set(e, i), i), ra = (e, t, i) => (Qs(e, t, "access private method"), i), la, Ea, ca, ua, Kt, ws, Bo, Ko;
let Oe = class extends N {
  constructor() {
    super(), bi(this, Kt), bi(this, la), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = ps(), this._expanded = !0, bi(this, Ea, () => {
      var e;
      return (e = vt(this, la)) == null ? void 0 : e.getLatestToken();
    }), bi(this, ca, () => {
      this._activeKey = ps();
    }), bi(this, ua, () => {
      ra(this, Kt, ws).call(this);
    }), this.consumeContext(Ve, (e) => {
      ru(this, la, e), e && ra(this, Kt, ws).call(this);
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
        ${ra(this, Kt, Bo).call(this)}
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
    this._templates = e, this._issuesByTemplate = lu((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
Bo = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${B(
    this._templates,
    (e) => e.key,
    (e) => ra(this, Kt, Ko).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${Va()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
Ko = function(e) {
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
        ${t > 0 ? r`<uui-badge slot="badge" color="warning" look="primary" title="${t} issue(s)">${t}</uui-badge>` : p}
      </uui-menu-item>
    `;
};
Oe.styles = I`
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
], Oe.prototype, "_templates", 2);
pi([
  m()
], Oe.prototype, "_issuesByTemplate", 2);
pi([
  m()
], Oe.prototype, "_loading", 2);
pi([
  m()
], Oe.prototype, "_activeKey", 2);
pi([
  m()
], Oe.prototype, "_expanded", 2);
Oe = pi([
  R("di-templates-menu-item")
], Oe);
function lu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const cu = Oe, uu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return Oe;
  },
  default: cu
}, Symbol.toStringTag, { value: "Module" }));
var hu = Object.defineProperty, du = Object.getOwnPropertyDescriptor, Vo = (e) => {
  throw TypeError(e);
}, ht = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? du(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && hu(t, i, s), s;
}, en = (e, t, i) => t.has(e) || Vo("Cannot " + i), De = (e, t, i) => (en(e, t, "read from private field"), i ? i.call(e) : t.get(e)), sa = (e, t, i) => t.has(e) ? Vo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Bn = (e, t, i, a) => (en(e, t, "write to private field"), t.set(e, i), i), S = (e, t, i) => (en(e, t, "access private method"), i), ha, Da, Pe, x, mi, me, Go, Ho, jo, Xo, Yo, qo, Jo, wi, Zo, Qo, er, tr, ir;
let fe = class extends N {
  constructor() {
    super(), sa(this, x), sa(this, ha), sa(this, Da), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, sa(this, Pe, () => {
      var e;
      return (e = De(this, ha)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ge, (e) => {
      Bn(this, Da, e);
    }), this.consumeContext(Ve, (e) => {
      Bn(this, ha, e), e && S(this, x, mi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${S(this, x, qo).call(this)} ${S(this, x, Jo).call(this)} ${S(this, x, Zo).call(this)} ${S(this, x, Qo).call(this)}
      </umb-body-layout>
    `;
  }
};
ha = /* @__PURE__ */ new WeakMap();
Da = /* @__PURE__ */ new WeakMap();
Pe = /* @__PURE__ */ new WeakMap();
x = /* @__PURE__ */ new WeakSet();
mi = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Hs(De(this, Pe)),
      Ei(De(this, Pe)).catch(() => []),
      Ka(De(this, Pe)).catch(() => {
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
  i && console.error("[DynamicImages]", t, i), (s = De(this, Da)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Go = async function() {
  this._importing = !0;
  try {
    const e = await ho(De(this, Pe));
    S(this, x, me).call(this, e.created.length > 0 ? "positive" : "warning", e.created.length > 0 ? `Imported ${e.created.length} template(s)` : "Nothing was imported");
    for (const t of e.warnings.slice(0, 5)) S(this, x, me).call(this, "warning", t);
    di(), await S(this, x, mi).call(this);
  } catch (e) {
    S(this, x, me).call(this, "danger", "The import failed", e);
  } finally {
    this._importing = !1;
  }
};
Ho = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await uo(this._pasteJson, "create", De(this, Pe)), S(this, x, me).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, di(), await S(this, x, mi).call(this);
    } catch (e) {
      S(this, x, me).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
jo = async function(e) {
  try {
    await lo(e.key, De(this, Pe)), S(this, x, me).call(this, "positive", `'${e.name}' duplicated`), di(), await S(this, x, mi).call(this);
  } catch (t) {
    S(this, x, me).call(this, "danger", "The template could not be duplicated", t);
  }
};
Xo = async function(e) {
  await Gs(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await ro(e.key, De(this, Pe)), S(this, x, me).call(this, "positive", `'${e.name}' deleted`), di(), await S(this, x, mi).call(this);
  } catch (t) {
    S(this, x, me).call(this, "danger", "The template could not be deleted", t);
  }
};
Yo = async function(e) {
  try {
    const t = await co(e.key, De(this, Pe)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    S(this, x, me).call(this, "danger", "The template could not be exported", t);
  }
};
qo = function() {
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
            @click=${S(this, x, Go)}>
            Import from appsettings
          </uui-button>
        </div>
      </uui-box>
    `;
};
Jo = function() {
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
Zo = function() {
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
        <uui-button look="secondary" href=${Do("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Qo = function() {
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

        ${this._showPaste ? S(this, x, er).call(this) : p}
        ${this._templates.length === 0 ? S(this, x, tr).call(this) : S(this, x, ir).call(this)}
      </uui-box>
    `;
};
er = function() {
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
          @click=${S(this, x, Ho)}>
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
        <uui-button look="primary" color="positive" href=${Va()} label="Create your first template">
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
                <a href=${li(e.key)}>${e.name}</a>
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
                <uui-button look="secondary" href=${li(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => S(this, x, jo).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => S(this, x, Yo).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => S(this, x, Xo).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
fe.styles = I`
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
  m()
], fe.prototype, "_templates", 2);
ht([
  m()
], fe.prototype, "_fonts", 2);
ht([
  m()
], fe.prototype, "_health", 2);
ht([
  m()
], fe.prototype, "_loading", 2);
ht([
  m()
], fe.prototype, "_importing", 2);
ht([
  m()
], fe.prototype, "_pasteJson", 2);
ht([
  m()
], fe.prototype, "_showPaste", 2);
fe = ht([
  R("di-overview-dashboard")
], fe);
const pu = fe, mu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return fe;
  },
  default: pu
}, Symbol.toStringTag, { value: "Module" })), $s = /* @__PURE__ */ new Map(), Xa = (e) => `di-${e}`;
function fu(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = $s.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await bo(e, t), n = new FontFace(Xa(e), s);
      return await n.load(), document.fonts.add(n), n;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return $s.set(e, a), a;
}
async function ar(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => fu(a, t)));
}
function sr(e) {
  $s.delete(e);
}
const gu = new to(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), yu = new to(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var vu = Object.defineProperty, bu = Object.getOwnPropertyDescriptor, nr = (e) => {
  throw TypeError(e);
}, Ya = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bu(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && vu(t, i, s), s;
}, tn = (e, t, i) => t.has(e) || nr("Cannot " + i), Me = (e, t, i) => (tn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), _i = (e, t, i) => t.has(e) ? nr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ss = (e, t, i, a) => (tn(e, t, "write to private field"), t.set(e, i), i), L = (e, t, i) => (tn(e, t, "access private method"), i), da, Mi, zi, Ot, O, or, fi, rt, xs, rr, lr, pa, cr, ur, hr;
function _u(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : wu(e.sourceUrl);
    default:
      return "Media library";
  }
}
function wu(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let lt = class extends N {
  constructor() {
    super(), _i(this, O), _i(this, da), _i(this, Mi), _i(this, zi), this._fonts = [], this._loading = !0, _i(this, Ot, () => {
      var e;
      return (e = Me(this, da)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Fa, (e) => {
      ss(this, Mi, e);
    }), this.consumeContext(Ge, (e) => {
      ss(this, zi, e);
    }), this.consumeContext(Ve, (e) => {
      ss(this, da, e), e && L(this, O, fi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${L(this, O, xs)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${L(this, O, xs)}>
                  Add your first font
                </uui-button>
              </div>` : r`${B(this._fonts, (e) => e.key, (e) => L(this, O, cr).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
da = /* @__PURE__ */ new WeakMap();
Mi = /* @__PURE__ */ new WeakMap();
zi = /* @__PURE__ */ new WeakMap();
Ot = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
or = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
fi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Ei(Me(this, Ot)), await ar(this._fonts.map((e) => e.key), Me(this, Ot));
  } catch (e) {
    L(this, O, rt).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
rt = function(e, t, i) {
  var s;
  const a = i instanceof ot ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Me(this, zi)) == null || s.peek(e, { data: { headline: t, message: a } });
};
xs = async function() {
  var i, a;
  if (!Me(this, Mi)) return;
  const e = Me(this, Mi).open(this, yu, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Me(this, zi)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await L(this, O, fi).call(this));
};
rr = async function(e) {
  try {
    await go(e.key, Me(this, Ot)), sr(e.key), L(this, O, rt).call(this, "positive", `'${e.familyName}' refreshed`), await L(this, O, fi).call(this);
  } catch (t) {
    L(this, O, rt).call(this, "danger", "That font could not be refreshed", t);
  }
};
lr = async function(e) {
  await Gs(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await vo(e.key, Me(this, Ot)), sr(e.key), L(this, O, rt).call(this, "positive", `'${e.familyName}' deleted`), await L(this, O, fi).call(this);
  } catch (t) {
    L(this, O, rt).call(this, "danger", "That font could not be deleted", t);
  }
};
pa = async function(e, t, i, a) {
  try {
    await yo(e.key, t, i, Me(this, Ot), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), L(this, O, rt).call(this, "positive", `'${t}' saved`), await L(this, O, fi).call(this), a != null && a.keepOpen && await L(this, O, or).call(this);
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
              ${_u(e)} · weight ${e.weight}
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

        <p class="specimen" style="font-family: ${Xa(e.key)}, serif">
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
      t.splice(a, 1), L(this, O, pa).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), L(this, O, pa).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    L(this, O, pa).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
Ya([
  m()
], lt.prototype, "_fonts", 2);
Ya([
  m()
], lt.prototype, "_loading", 2);
Ya([
  m()
], lt.prototype, "_editingKey", 2);
lt = Ya([
  R("di-fonts-dashboard")
], lt);
const $u = lt, xu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return lt;
  },
  default: $u
}, Symbol.toStringTag, { value: "Module" }));
var ku = Object.defineProperty, Su = Object.getOwnPropertyDescriptor, dr = (e) => {
  throw TypeError(e);
}, Yi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Su(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && ku(t, i, s), s;
}, an = (e, t, i) => t.has(e) || dr("Cannot " + i), Ze = (e, t, i) => (an(e, t, "read from private field"), i ? i.call(e) : t.get(e)), na = (e, t, i) => t.has(e) ? dr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Kn = (e, t, i, a) => (an(e, t, "write to private field"), t.set(e, i), i), Vt = (e, t, i) => (an(e, t, "access private method"), i), ma, Gt, ci, at, Pa, ks, pr;
let Be = class extends N {
  constructor() {
    super(), na(this, at), na(this, ma), na(this, Gt), this._loading = !0, this._busy = !1, na(this, ci, () => {
      var e;
      return (e = Ze(this, ma)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ge, (e) => {
      Kn(this, Gt, e);
    }), this.consumeContext(Ve, (e) => {
      Kn(this, ma, e), e && Vt(this, at, Pa).call(this);
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
                        ${a.templateKey ? r`<a href=${li(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Vt(this, at, pr).call(this)}
      </umb-body-layout>
    `;
  }
};
ma = /* @__PURE__ */ new WeakMap();
Gt = /* @__PURE__ */ new WeakMap();
ci = /* @__PURE__ */ new WeakMap();
at = /* @__PURE__ */ new WeakSet();
Pa = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Ka(Ze(this, ci)),
      To(Ze(this, ci)).catch(() => {
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
    const s = e === "export" ? await Co(Ze(this, ci)) : await Eo(Ze(this, ci));
    (t = Ze(this, Gt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const n of s.messages.slice(0, 3))
      (i = Ze(this, Gt)) == null || i.peek("warning", { data: { message: n } });
    await Vt(this, at, Pa).call(this);
  } catch (s) {
    (a = Ze(this, Gt)) == null || a.peek("danger", {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Vt(this, at, ks).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Vt(this, at, ks).call(this, "import")}>
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
Yi([
  m()
], Be.prototype, "_health", 2);
Yi([
  m()
], Be.prototype, "_sync", 2);
Yi([
  m()
], Be.prototype, "_loading", 2);
Yi([
  m()
], Be.prototype, "_busy", 2);
Be = Yi([
  R("di-health-dashboard")
], Be);
const Tu = Be, Cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Be;
  },
  default: Tu
}, Symbol.toStringTag, { value: "Module" })), mr = 3, fr = 12, gr = 0.1, yr = 0.9;
function Eu(e) {
  return Math.max(mr, Math.min(fr, e));
}
function Du(e) {
  return Math.max(gr, Math.min(yr, e));
}
function Pu(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Eu(t), s = 0.5 * Du(i), n = e === "star" ? a * 2 : a, o = e === "star" ? 180 / a : 360 / a, l = [];
  for (let d = 0; d < n; d++) {
    const f = (-90 + d * o) * Math.PI / 180, C = e === "star" && d % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + C * Math.cos(f), y: 0.5 + C * Math.sin(f) });
  }
  return l;
}
function Mu(e, t, i) {
  const a = Pu(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
const g = {
  /** Font size, in points. Beyond 800 the renderer is being asked for a poster, not an OG image. */
  fontSize: { min: 1, max: 800 },
  /** Position. Negative is legitimate - a layer can be deliberately bled off the canvas edge. */
  x: { min: -5e3, max: 5e3 },
  y: { min: -5e3, max: 5e3 },
  /**
   * Any box dimension. Zero is not a size; "auto" is expressed by clearing the field, not by 0.
   * The maximum is the server's: TemplateValidator accepts up to 8000, and it is the authority on
   * what a canvas may be - 5000 here quietly clamped an imported 6000px template the moment its
   * Width field was touched.
   */
  width: { min: 1, max: 8e3 },
  height: { min: 1, max: 8e3 },
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
}, Ma = { min: 0.1, max: 4 };
function zu(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function vr(e) {
  if (e.kind === "radial") {
    const t = Math.round(Vn(e.centreX ?? 0.5) * 100), i = Math.round(Vn(e.centreY ?? 0.5) * 100);
    return `radial-gradient(ellipse farthest-corner at ${t}% ${i}%, ${e.from}, ${e.to})`;
  }
  return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
}
function Vn(e) {
  return Math.min(1, Math.max(0, e));
}
const sn = I`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Ou(e, t) {
  const i = [], a = t.lockX ? void 0 : Gn(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Iu(t),
    t.threshold
  ), s = t.lockY ? void 0 : Gn(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    Au(t),
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
function Iu(e) {
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
function Au(e) {
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
function Gn(e, t, i) {
  let a;
  for (const s of e)
    for (const n of t) {
      const o = Math.abs(n.at - s.value);
      o > i || (!a || o < a.distance) && (a = { at: n.at, offset: s.offset, label: n.label, distance: o });
    }
  return a;
}
var Lu = Object.defineProperty, Ru = Object.getOwnPropertyDescriptor, br = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ru(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Lu(t, i, s), s;
}, nn = (e, t, i) => t.has(e) || br("Cannot " + i), ve = (e, t, i) => (nn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ns = (e, t, i) => t.has(e) ? br("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), os = (e, t, i, a) => (nn(e, t, "write to private field"), t.set(e, i), i), j = (e, t, i) => (nn(e, t, "access private method"), i), gt, $i, z, qa, on, _r, wr, $r, xr, rn, za, kr, Sr, Tr, Cr, Er, Dr, Pr, Mr, zr;
const Wu = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], rs = 18;
let $e = class extends N {
  constructor() {
    super(...arguments), ns(this, z), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, ns(this, gt), ns(this, $i);
  }
  willUpdate() {
    this._box = j(this, z, _r).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ve(this, $i) && ((t = ve(this, gt)) == null || t.disconnect(), os(this, $i, e), e && (ve(this, gt) ?? os(this, gt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ve(this, gt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ve(this, gt)) == null || e.disconnect(), os(this, $i, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${eo({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${V({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ve(this, z, wr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...j(this, z, rn).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      j(this, z, kr).call(this, t), j(this, z, za).call(this, t);
    }}>
        ${j(this, z, Sr).call(this)}
      </div>

      ${this.selected ? j(this, z, Mr).call(this, e) : p}
      ${this.showMeasured && this.measured ? j(this, z, zr).call(this) : p}
    `;
  }
};
gt = /* @__PURE__ */ new WeakMap();
$i = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakSet();
qa = function() {
  return this.resolvedPosition ?? this.layer.position;
};
on = function() {
  return this.layer.rotation ?? 0;
};
_r = function() {
  var s;
  const e = this.layer, t = e.size.width ?? j(this, z, $r).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? j(this, z, xr).call(this), a = ja(ve(this, z, qa), t, i);
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
      const { badge: t, label: i, gap: a, maxItems: s, direction: n } = this.layer, o = i.position === "right" ? t.size + i.gap + i.fontSize * 0.6 * 8 : t.size;
      return n === "horizontal" ? s * o + (s - 1) * a : o;
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
      const { badge: e, label: t, gap: i, maxItems: a, direction: s } = this.layer, n = t.position === "below" ? e.size + t.gap + t.fontSize * 1.2 : t.position === "right" ? Math.max(e.size, t.fontSize * 1.2) : e.size;
      return s === "horizontal" ? n : a * n + (a - 1) * i;
    }
    default:
      return 135;
  }
};
rn = function(e) {
  const t = ve(this, z, on);
  if (t === 0) return {};
  const i = ve(this, z, qa);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
za = function(e, t) {
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
      return j(this, z, Tr).call(this);
    case "image":
      return j(this, z, Er).call(this);
    case "badges":
      return j(this, z, Dr).call(this);
    default:
      return j(this, z, Pr).call(this);
  }
};
Tr = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || j(this, z, Cr).call(this);
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
Cr = function() {
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
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: n, rowGap: o } = this.layer, l = s === "horizontal", d = l && n, f = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${V({
    flexDirection: l ? "row" : "column",
    flexWrap: d ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...d ? { rowGap: `${o * this.scale}px` } : {}
  })}>
        ${B(
    Array.from({ length: Math.max(1, a) }, (C, X) => X),
    (C) => C,
    () => r`
            <div class=${eo({ badge: !0, right: f === "right" })}>
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
Pr = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? vr(i) : e.fill ?? "transparent", s = e.border, n = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${V({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${n}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const o = Mu(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${V({ clipPath: o, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${V({ inset: `${n}px`, clipPath: o, background: a })}></div>
      </div>
    `;
};
Mr = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, n = ve(this, z, qa), o = ve(this, z, on), l = ze(this.layer.position, "x") || ze(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${V({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...j(this, z, rn).call(this, e) })}>
        <span
          class="tag"
          style=${V(o !== 0 ? { transform: `rotate(${-o}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${B(
    Wu,
    (d) => d,
    (d) => r`
                  <span
                    class="handle ${d}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${d}"
                    @pointerdown=${(f) => j(this, z, za).call(this, f, d)}>
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
                @pointerdown=${(d) => j(this, z, za).call(this, d, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${n.anchor}${o !== 0 ? ` - turns ${o}° here` : ""}"
          style=${V({
    left: `${(n.x - e.x) * this.scale}px`,
    top: `${(n.y - e.y) * this.scale}px`
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
$e.styles = I`
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
], $e.prototype, "layer", 2);
He([
  b({ type: Number })
], $e.prototype, "scale", 2);
He([
  b({ type: Boolean, reflect: !0 })
], $e.prototype, "selected", 2);
He([
  b({ type: Object })
], $e.prototype, "measured", 2);
He([
  b({ type: Boolean })
], $e.prototype, "showMeasured", 2);
He([
  b({ type: String })
], $e.prototype, "resolvedText", 2);
He([
  b({ attribute: !1 })
], $e.prototype, "resolvedPosition", 2);
He([
  m()
], $e.prototype, "_box", 2);
$e = He([
  R("di-layer-box")
], $e);
var Nu = Object.defineProperty, Fu = Object.getOwnPropertyDescriptor, Or = (e) => {
  throw TypeError(e);
}, ln = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fu(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Nu(t, i, s), s;
}, Uu = (e, t, i) => t.has(e) || Or("Cannot " + i), Bu = (e, t, i) => t.has(e) ? Or("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ku = (e, t, i) => (Uu(e, t, "access private method"), i), Ss, Ir;
let Oi = class extends N {
  constructor() {
    super(...arguments), Bu(this, Ss), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${B(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => Ku(this, Ss, Ir).call(this, e)
    )}`;
  }
};
Ss = /* @__PURE__ */ new WeakSet();
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
ln([
  b({ type: Array })
], Oi.prototype, "guides", 2);
ln([
  b({ type: Number })
], Oi.prototype, "scale", 2);
Oi = ln([
  R("di-guides")
], Oi);
var Vu = Object.defineProperty, Gu = Object.getOwnPropertyDescriptor, Ar = (e) => {
  throw TypeError(e);
}, qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gu(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Vu(t, i, s), s;
}, Hu = (e, t, i) => t.has(e) || Ar("Cannot " + i), ju = (e, t, i) => t.has(e) ? Ar("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Hn = (e, t, i) => (Hu(e, t, "access private method"), i), fa, Ts;
let q = class extends N {
  constructor() {
    super(...arguments), ju(this, fa), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Hn(this, fa, Ts).call(this, "top"), Hn(this, fa, Ts).call(this, "left");
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
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, n = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : q.thickness) * n, t.height = (e === "top" ? q.thickness : s) * n, t.style.width = `${e === "top" ? s : q.thickness}px`, t.style.height = `${e === "top" ? q.thickness : s}px`, i.setTransform(n, 0, 0, n, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const o = getComputedStyle(this);
  i.strokeStyle = o.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = o.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const d = Math.round(l * this.scale) + 0.5, f = l % 100 === 0, C = f ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(d, q.thickness - C), i.lineTo(d, q.thickness)) : (i.moveTo(q.thickness - C, d), i.lineTo(q.thickness, d)), i.stroke(), f && l > 0 && (e === "top" ? i.fillText(String(l), d + 2, 9) : (i.save(), i.translate(9, d - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
q.thickness = 20;
q.styles = I`
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
var Xu = Object.defineProperty, Yu = Object.getOwnPropertyDescriptor, Lr = (e) => {
  throw TypeError(e);
}, ne = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Yu(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Xu(t, i, s), s;
}, cn = (e, t, i) => t.has(e) || Lr("Cannot " + i), A = (e, t, i) => (cn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), oe = (e, t, i) => t.has(e) ? Lr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ga = (e, t, i, a) => (cn(e, t, "write to private field"), t.set(e, i), i), M = (e, t, i) => (cn(e, t, "access private method"), i), yt, xi, nt, E, un, Cs, Es, Ja, hn, Ds, Rr, Wr, dn, Nr, Fr, Ps, ya, Ur, Br, Ft, pn, Ms, zs, Os, Kr, Is, As, Ls, Vr;
const qu = 6, Gr = 20, Ju = 2, Zu = 15, Qu = 0.1;
let ee = class extends N {
  constructor() {
    super(...arguments), oe(this, E), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, oe(this, yt), oe(this, xi), oe(this, nt, /* @__PURE__ */ new Map()), oe(this, Ps, (e) => {
      const t = this.template.layers.find((o) => o.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = M(this, E, hn).call(this, t), a = M(this, E, Ds).call(this, t), s = M(this, E, Rr).call(this, t), n = M(this, E, Ja).call(this, e.detail.startX, e.detail.startY);
      ga(this, yt, {
        key: t.key,
        handle: e.detail.handle,
        startClientX: e.detail.startX,
        startClientY: e.detail.startY,
        startBox: i,
        startPosition: s,
        startRotation: t.rotation ?? 0,
        startExtent: a,
        startAngle: Math.atan2(n.y - s.y, n.x - s.x),
        moved: !1,
        shiftKey: e.detail.shiftKey,
        altKey: e.detail.altKey
      }), this.dispatchEvent(new CustomEvent("di-transaction-begin", { bubbles: !0, composed: !0 }));
    }), oe(this, ya, (e) => {
      var ia, On;
      this._pointer = M(this, E, Es).call(this, e.clientX, e.clientY);
      const t = A(this, yt);
      if (!t) return;
      const i = this.template.layers.find((yi) => yi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        M(this, E, Br).call(this, i, t, e);
        return;
      }
      const n = ze(i.position, "x"), o = ze(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        M(this, E, Ur).call(this, i, t, t.handle, a, s, e.shiftKey, n, o);
        return;
      }
      let d = t.handle ? M(this, E, pn).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      n && (d = { ...d, x: t.startBox.x, width: (ia = t.handle) != null && ia.includes("w") ? t.startBox.width : d.width }), o && (d = { ...d, y: t.startBox.y, height: (On = t.handle) != null && On.includes("n") ? t.startBox.height : d.height });
      const f = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, C = l !== 0 ? { x: d.x + f.x, y: d.y + f.y, width: t.startExtent.width, height: t.startExtent.height } : d, ke = this.snapEnabled && !e.altKey ? Ou(C, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((yi) => yi.key !== i.key).map((yi) => M(this, E, Ds).call(this, yi)),
        threshold: qu / this.scale,
        lockX: n,
        lockY: o
      }) : {
        box: {
          ...C,
          x: n ? C.x : Math.round(C.x),
          y: o ? C.y : Math.round(C.y)
        },
        guides: []
      };
      this._guides = ke.guides;
      const Ae = l !== 0 ? { ...d, x: ke.box.x - f.x, y: ke.box.y - f.y } : ke.box, qe = Bc(Ae, i.position);
      n && (qe.x = i.position.x), o && (qe.y = i.position.y);
      const Le = { position: qe };
      t.handle && (Le.size = {
        width: Math.max(1, Math.round(Ae.width)),
        height: Math.max(1, Math.round(Ae.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Le } })
      );
    }), oe(this, Ft, () => {
      if (!A(this, yt)) return;
      const e = A(this, yt).moved;
      ga(this, yt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), oe(this, Ms, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), oe(this, zs, () => {
      this._dropTarget = !1;
    }), oe(this, Os, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = M(this, E, Es).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: M(this, E, Kr).call(this, e) }
        })
      );
    }), oe(this, Is, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), oe(this, As, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Ro(t.position)) && this.requestUpdate();
    }), oe(this, Ls, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), ga(this, xi, new ResizeObserver(() => M(this, E, Cs).call(this))), A(this, xi).observe(this), window.addEventListener("pointermove", A(this, ya)), window.addEventListener("pointerup", A(this, Ft)), window.addEventListener("pointercancel", A(this, Ft));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = A(this, xi)) == null || e.disconnect(), window.removeEventListener("pointermove", A(this, ya)), window.removeEventListener("pointerup", A(this, Ft)), window.removeEventListener("pointercancel", A(this, Ft));
  }
  updated(e) {
    M(this, E, Cs).call(this), e.has("zoom") && M(this, E, un).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = A(this, nt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((n) => [n.key, n]));
    M(this, E, Wr).call(this);
    const s = this.showRulers ? Gr : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${A(this, Is)}
        @dragover=${A(this, Ms)}
        @dragleave=${A(this, zs)}
        @drop=${A(this, Os)}
        @di-layer-drag-start=${A(this, Ps)}
        @di-layer-box-resize=${A(this, As)}>
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
            @pointerdown=${A(this, Ls)}
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
      (n) => n.key,
      (n) => {
        var o, l;
        return r`
                <di-layer-box
                  data-key=${n.key}
                  .layer=${n}
                  .scale=${this.scale}
                  .selected=${n.key === this.selectedLayerKey}
                  .measured=${a.get(n.key)}
                  .showMeasured=${this.showMeasured}
                  .resolvedText=${((o = a.get(n.key)) == null ? void 0 : o.resolvedText) ?? void 0}
                  .resolvedPosition=${(l = A(this, nt).get(n.key)) == null ? void 0 : l.position}>
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
yt = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
nt = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
un = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Cs = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Gr : 0) + Ju, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, M(this, E, un).call(this));
};
Es = function(e, t) {
  const i = M(this, E, Ja).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Ja = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
hn = function(e) {
  const t = A(this, nt).get(e.key);
  if (t) return t.box;
  const i = M(this, E, dn).call(this, e), a = ja(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Ds = function(e) {
  const t = A(this, nt).get(e.key);
  return t ? t.extent : Lo(M(this, E, hn).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Rr = function(e) {
  var t;
  return ((t = A(this, nt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Wr = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  ga(this, nt, Xc(
    this.template.layers,
    (i) => M(this, E, dn).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
dn = function(e, t) {
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
Ps = /* @__PURE__ */ new WeakMap();
ya = /* @__PURE__ */ new WeakMap();
Ur = function(e, t, i, a, s, n, o, l) {
  const d = t.startRotation, f = t.startPosition, C = Kc(a, s, 0, 0, d);
  let X = M(this, E, pn).call(this, t.startBox, i, C.x, C.y, n);
  o && (X = { ...X, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : X.width }), l && (X = { ...X, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : X.height });
  const ke = Math.max(1, Math.round(X.width)), Ae = Math.max(1, Math.round(X.height)), qe = qs(X.x, X.y, ke, Ae, f.anchor), Le = Bt(qe.x, qe.y, f.x, f.y, d), ia = {
    ...e.position,
    x: o ? e.position.x : Math.round(Le.x),
    y: l ? e.position.y : Math.round(Le.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: ia, size: { width: ke, height: Ae } } }
    })
  );
};
Br = function(e, t, i) {
  const a = t.startPosition, s = M(this, E, Ja).call(this, i.clientX, i.clientY), o = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + o, d = i.shiftKey ? Zu : Qu, f = Ao(Math.round(l / d) * d);
  this._guides = [], f !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: f } }
    })
  );
};
Ft = /* @__PURE__ */ new WeakMap();
pn = function(e, t, i, a, s) {
  let { x: n, y: o, width: l, height: d } = e;
  if (t.includes("w") && (n = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (o = e.y + a, d = e.height - a), t.includes("s") && (d = e.height + a), s && e.width > 0 && e.height > 0) {
    const f = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(d - e.height) ? d = l / f : l = d * f, t.includes("n") && (o = e.y + e.height - d), t.includes("w") && (n = e.x + e.width - l);
  }
  return { x: n, y: o, width: Math.max(4, l), height: Math.max(4, d) };
};
Ms = /* @__PURE__ */ new WeakMap();
zs = /* @__PURE__ */ new WeakMap();
Os = /* @__PURE__ */ new WeakMap();
Kr = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Is = /* @__PURE__ */ new WeakMap();
As = /* @__PURE__ */ new WeakMap();
Ls = /* @__PURE__ */ new WeakMap();
Vr = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${V({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
ee.styles = I`
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
      ${sn}
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
  b({ type: Object })
], ee.prototype, "template", 2);
ne([
  b({ type: String })
], ee.prototype, "selectedLayerKey", 2);
ne([
  b({ type: Object })
], ee.prototype, "baseImageUrl", 2);
ne([
  b({ type: Array })
], ee.prototype, "serverBounds", 2);
ne([
  b({ type: Boolean })
], ee.prototype, "showMeasured", 2);
ne([
  b({ type: Boolean })
], ee.prototype, "snapEnabled", 2);
ne([
  b({ type: Boolean })
], ee.prototype, "showRulers", 2);
ne([
  b({ type: Boolean })
], ee.prototype, "showSafeArea", 2);
ne([
  b({ type: Number })
], ee.prototype, "zoom", 2);
ne([
  m()
], ee.prototype, "_fitScale", 2);
ne([
  m()
], ee.prototype, "_guides", 2);
ne([
  m()
], ee.prototype, "_pointer", 2);
ne([
  m()
], ee.prototype, "_dropTarget", 2);
ee = ne([
  R("di-designer-canvas")
], ee);
var eh = Object.defineProperty, th = Object.getOwnPropertyDescriptor, Hr = (e) => {
  throw TypeError(e);
}, mn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? th(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && eh(t, i, s), s;
}, jr = (e, t, i) => t.has(e) || Hr("Cannot " + i), ih = (e, t, i) => (jr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ah = (e, t, i) => t.has(e) ? Hr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ee = (e, t, i) => (jr(e, t, "access private method"), i), ce, Xr, Yr, qr, Jr, Zr, bt;
const jn = {
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
    super(...arguments), ah(this, ce), this.properties = [], this._search = "";
  }
  render() {
    const e = sh(ih(this, ce, Xr));
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
      ([t, i]) => Ee(this, ce, Jr).call(this, t, i)
    )}

        ${Ee(this, ce, Zr).call(this)}
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
    (i) => Ee(this, ce, bt).call(
      this,
      i.name,
      jn[i.classification] ?? jn.other,
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
        ${Ee(this, ce, bt).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Ee(this, ce, bt).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Ee(this, ce, bt).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Ee(this, ce, bt).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Ee(this, ce, bt).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
bt = function(e, t, i, a, s) {
  const n = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${n}
        @dragstart=${(o) => Ee(this, ce, qr).call(this, o, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${n}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => Ee(this, ce, Yr).call(this, a)}>
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
mn([
  b({ type: Array })
], Ii.prototype, "properties", 2);
mn([
  m()
], Ii.prototype, "_search", 2);
Ii = mn([
  R("di-property-palette")
], Ii);
function sh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e) {
    const s = a.group || "Other", n = t.get(s) ?? [];
    n.push(a), t.set(s, n);
  }
  const i = /* @__PURE__ */ new Map();
  t.has("Node") && i.set("Node", t.get("Node"));
  for (const [a, s] of t)
    a !== "Node" && i.set(a, s);
  return i;
}
function nh(e) {
  return e.backgroundGradient ? "gradient" : oh(e.background) ? "transparent" : "colour";
}
function oh(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function rh(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var lh = Object.defineProperty, ch = Object.getOwnPropertyDescriptor, Qr = (e) => {
  throw TypeError(e);
}, Za = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ch(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && lh(t, i, s), s;
}, el = (e, t, i) => t.has(e) || Qr("Cannot " + i), Qe = (e, t, i) => (el(e, t, "read from private field"), i ? i.call(e) : t.get(e)), uh = (e, t, i) => t.has(e) ? Qr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Si = (e, t, i) => (el(e, t, "access private method"), i), ae, Ai, Ti, Qa, tl, il;
let ui = class extends N {
  constructor() {
    super(...arguments), uh(this, ae), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Qe(this, ae, Ai)};opacity:${Qe(this, ae, Ti)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Si(this, ae, Qa).call(this, e.target.value)}>
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
                    .value=${String(Qe(this, ae, Ti))}
                    @input=${(e) => Si(this, ae, il).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Qe(this, ae, Ti) * 100)}%</span>
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
Ti = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
Qa = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
tl = function(e) {
  const t = Qe(this, ae, Ti);
  Si(this, ae, Qa).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${al(t)}`);
};
il = function(e) {
  Si(this, ae, Qa).call(this, e >= 0.999 ? Qe(this, ae, Ai).toUpperCase() : `${Qe(this, ae, Ai).toUpperCase()}${al(e)}`);
};
ui.styles = I`
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
  m()
], ui.prototype, "_open", 2);
ui = Za([
  R("di-colour-input")
], ui);
const al = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var hh = Object.defineProperty, dh = Object.getOwnPropertyDescriptor, sl = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? dh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && hh(t, i, s), s;
};
const Xn = {
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
      Io,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Xn[e]}
              title=${Xn[e]}
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
Oa.styles = I`
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
  b({ type: String })
], Oa.prototype, "value", 2);
Oa = sl([
  R("di-anchor-picker")
], Oa);
var ph = Object.defineProperty, mh = Object.getOwnPropertyDescriptor, nl = (e) => {
  throw TypeError(e);
}, dt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? mh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && ph(t, i, s), s;
}, fh = (e, t, i) => t.has(e) || nl("Cannot " + i), gh = (e, t, i) => t.has(e) ? nl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), yh = (e, t, i) => (fh(e, t, "access private method"), i), Rs, ol;
let Ie = class extends N {
  constructor() {
    super(...arguments), gh(this, Rs), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${yh(this, Rs, ol)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
Rs = /* @__PURE__ */ new WeakSet();
ol = function(e) {
  const t = e.target, i = t.value, a = zu(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Ie.styles = I`
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
], Ie.prototype, "value", 2);
dt([
  b({ type: String })
], Ie.prototype, "label", 2);
dt([
  b({ type: String })
], Ie.prototype, "suffix", 2);
dt([
  b({ type: Number })
], Ie.prototype, "step", 2);
dt([
  b({ type: Number })
], Ie.prototype, "min", 2);
dt([
  b({ type: Number })
], Ie.prototype, "max", 2);
dt([
  b({ type: String })
], Ie.prototype, "placeholder", 2);
Ie = dt([
  R("di-number-field")
], Ie);
var vh = Object.defineProperty, bh = Object.getOwnPropertyDescriptor, rl = (e) => {
  throw TypeError(e);
}, Ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && vh(t, i, s), s;
}, _h = (e, t, i) => t.has(e) || rl("Cannot " + i), wh = (e, t, i) => t.has(e) ? rl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (_h(e, t, "access private method"), i), u, v, be, ll, cl, ul, fn, Ws, hl, dl, pl, ml, fl, gl, yl, Ns, vl, va, bl, _l, gi, gn, wl;
let It = class extends N {
  constructor() {
    super(...arguments), wh(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, u, hl).call(this, this.layer) : h(this, u, ll).call(this)}</div>` : p;
  }
};
u = /* @__PURE__ */ new WeakSet();
v = function(e) {
  this.layer && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: this.layer.key, patch: e }
    })
  );
};
be = function(e) {
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
            @change=${(t) => h(this, u, be).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => h(this, u, be).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${h(this, u, cl).call(this, e)}

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${$l(e.baseImage.kind)}
              @change=${(t) => h(this, u, be).call(this, {
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
                @change=${(t) => h(this, u, be).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${h(this, u, gi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, u, be).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${Q(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => h(this, u, be).call(this, { baseImageFit: t.target.value })}>
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
  const t = nh(e);
  return r`
      <label class="field">
        <span>Fill</span>
        <uui-select
          .value=${t}
          .options=${Q(["colour", "gradient", "transparent"], t)}
          @change=${(i) => h(this, u, ul).call(this, e, i.target.value)}>
        </uui-select>
      </label>

      ${t === "colour" ? r`<label class="field">
            <span>Colour</span>
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => h(this, u, be).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </label>` : p}

      ${t === "gradient" && e.backgroundGradient ? h(this, u, fn).call(this, e.backgroundGradient, (i) => h(this, u, be).call(this, { backgroundGradient: i })) : p}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : p}
    `;
};
ul = function(e, t) {
  if (t === "gradient") {
    h(this, u, be).call(this, { backgroundGradient: e.backgroundGradient ?? Oo() });
    return;
  }
  h(this, u, be).call(this, {
    background: rh(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
fn = function(e, t) {
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
            ${h(this, u, Ws).call(this, "Centre X", e.centreX, (i) => t({ ...e, centreX: i }))}
            ${h(this, u, Ws).call(this, "Centre Y", e.centreY, (i) => t({ ...e, centreY: i }))}
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
Ws = function(e, t, i) {
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
          @change=${(t) => h(this, u, v).call(this, { name: t.target.value })}>
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
            @change=${(i) => h(this, u, v).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, gi).call(this, t.propertyAlias ?? "", (i) => h(this, u, v).call(this, { binding: { ...t, propertyAlias: i } }))}
            </label>` : p}

        ${t.kind === "date" ? r`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => h(this, u, v).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "static" || t.kind === "expression" ? r`<label class="field">
              <span>${t.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => h(this, u, v).call(this, {
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
              @change=${(i) => h(this, u, v).call(this, { prefix: i.target.value })}>
            </uui-input>
          </label>
          <label class="field">
            <span>Suffix</span>
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => h(this, u, v).call(this, { suffix: i.target.value })}>
            </uui-input>
          </label>
        </div>
      </uui-box>
    `;
};
pl = function(e) {
  const t = e.style, i = (a) => h(this, u, v).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, u, gn).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, u, wl).call(this, t.fontKey, t.styleName ?? "", (a, s, n) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: n ?? t.fontStyle }))}

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
            @change=${(a) => h(this, u, v).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, gi).call(this, t.propertyAlias ?? "", (a) => h(this, u, v).call(this, { source: { ...t, propertyAlias: a } }), "media")}
            </label>` : p}

        ${t.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => h(this, u, v).call(this, {
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
            @change=${(a) => h(this, u, v).call(this, { fit: a.target.value })}>
          </uui-select>
        </label>

        <di-number-field
          .min=${g.cornerRadius.min}
          .max=${g.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => h(this, u, v).call(this, { cornerRadius: a.detail.value ?? 0 })}>
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
    var n;
    const s = a.detail.value ?? 0;
    h(this, u, v).call(this, {
      border: s > 0 ? { width: s, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => h(this, u, v).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : p}
          </div>
        </label>
      </uui-box>
    `;
};
fl = function(e) {
  const t = (s) => h(this, u, v).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, u, v).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, u, v).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, u, gi).call(this, e.itemsPropertyAlias, (s) => h(this, u, v).call(this, { itemsPropertyAlias: s }))}
        </label>

        <div class="pair">
          <di-number-field
            .min=${g.maxItems.min}
            .max=${g.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => h(this, u, v).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${g.gap.min}
            .max=${g.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => h(this, u, v).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${e.direction}
            .options=${Q(["horizontal", "vertical"], e.direction)}
            @change=${(s) => h(this, u, v).call(this, { direction: s.target.value })}>
          </uui-select>
        </label>

        ${e.direction === "horizontal" ? r`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => h(this, u, v).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </label>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${g.rowGap.min}
                      .max=${g.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => h(this, u, v).call(this, { rowGap: s.detail.value ?? 20 })}>
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
                  .options=${h(this, u, gn).call(this, e.label.fontKey)}
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
                  .options=${Q(["none", "uppercase", "lowercase"], e.label.textTransform)}
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
            .options=${Q(["rectangle", "ellipse", "polygon", "star"], t)}
            @change=${(s) => h(this, u, v).call(this, { shape: s.target.value })}>
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
                  @change=${(s) => h(this, u, v).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${g.innerRatio.min}
                      .max=${g.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => h(this, u, v).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : p}
              </div>
            ` : p}

        <label class="field inline">
          <span>Fill</span>
          <uui-toggle
            ?checked=${i}
            @change=${(s) => h(this, u, v).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </label>

        ${i ? r`<label class="field">
              <span>Fill colour</span>
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => h(this, u, v).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </label>` : p}

        <label class="field inline">
          <span>Gradient</span>
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => h(this, u, v).call(this, {
    gradient: s.target.checked ? Oo() : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? h(this, u, fn).call(this, e.gradient, (s) => h(this, u, v).call(this, { gradient: s })) : p}

        ${t === "rectangle" ? r`<di-number-field
            .min=${g.cornerRadius.min}
            .max=${g.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => h(this, u, v).call(this, { cornerRadius: s.detail.value ?? 0 })}>
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
    var o;
    const n = s.detail.value ?? 0;
    h(this, u, v).call(this, {
      border: n > 0 ? { width: n, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => h(this, u, v).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : p}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </label>
      </uui-box>
    `;
};
yl = function(e) {
  const t = ze(e.position, "x"), i = ze(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, u, Ns).call(this, e, "x")} ${h(this, u, Ns).call(this, e, "y")}

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
            @change=${(s) => h(this, u, v).call(this, { rotation: Ao(s.detail.value ?? 0) })}>
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
            @change=${(s) => h(this, u, v).call(this, { size: { ...e.size, width: s.detail.value } })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => h(this, u, v).call(this, { size: { ...e.size, height: s.detail.value } })}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
Ns = function(e, t) {
  const i = ze(e.position, t), a = Ta(e.position, t), s = this.template.layers.filter((o) => o.key !== e.key), n = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(o) => h(this, u, vl).call(this, e, t, o.target.value)}>
          </uui-select>
          ${!i && s.length === 0 ? r`<small class="hint">Add another layer to position this one against it.</small>` : p}
        </label>

        ${i && a ? r`
              <label class="field">
                <span>Tracks</span>
                <div class="row">
                  <uui-select
                    .value=${a.layerKey}
                    .options=${s.map((o) => ({
    name: o.name || o.type,
    value: o.key,
    selected: o.key === a.layerKey
  }))}
                    @change=${(o) => h(this, u, va).call(this, e, t, { layerKey: o.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${Q(n, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(o) => h(this, u, va).call(this, e, t, { edge: o.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${g.referenceGap.min}
                .max=${g.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(o) => h(this, u, va).call(this, e, t, { gap: o.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? g.x.min : g.y.min}
                .max=${t === "x" ? g.x.max : g.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(o) => h(this, u, v).call(this, {
    position: { ...e.position, [t]: o.detail.value ?? 0 }
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
  if (ze(e.position, t)) return;
  const a = this.template.layers.findIndex((n) => n.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((n) => n.key !== e.key);
  s && h(this, u, v).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Vc
      }
    }
  });
};
va = function(e, t, i) {
  const a = Ta(e.position, t);
  a && h(this, u, v).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
bl = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? Uc(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, u, v).call(this, { position: s });
};
_l = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <label class="field inline">
          <span>Visible</span>
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => h(this, u, v).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </label>

        <label class="field inline">
          <span>Locked</span>
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => h(this, u, v).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </label>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${g.opacity.min}
          .max=${g.opacity.max}
          .value=${e.opacity}
          @change=${(t) => h(this, u, v).call(this, { opacity: t.detail.value ?? 1 })}>
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
            @change=${(t) => h(this, u, v).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </label>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<label class="field">
              <span>Controlled by</span>
              ${h(this, u, gi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, u, v).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
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
gn = function(e) {
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
    const n = s.target.value, o = a.styles.find((l) => l.name === n);
    i(n, o == null ? void 0 : o.size, o == null ? void 0 : o.fontStyle);
  }}>
        </uui-select>
      </label>
    `;
};
It.styles = I`
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
function Q(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function $l(e) {
  return Q(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var $h = Object.defineProperty, xh = Object.getOwnPropertyDescriptor, xl = (e) => {
  throw TypeError(e);
}, Zi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? xh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && $h(t, i, s), s;
}, kh = (e, t, i) => t.has(e) || xl("Cannot " + i), Sh = (e, t, i) => t.has(e) ? xl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Se = (e, t, i) => (kh(e, t, "access private method"), i), de, _t, kl, Sl, Tl, Cl;
const Th = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let At = class extends N {
  constructor() {
    super(...arguments), Sh(this, de), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Se(this, de, Tl)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : B(
      e,
      (t) => t.key,
      (t, i) => Se(this, de, Cl).call(this, t, i)
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
_t = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
kl = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Sl = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Tl = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Se(this, de, _t).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Cl = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Se(this, de, kl).call(this, a, e.key)}
        @dragover=${(a) => Se(this, de, Sl).call(this, a, t)}
        @click=${() => Se(this, de, _t).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Th[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, de, _t).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, de, _t).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, de, _t).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Se(this, de, _t).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
At.styles = I`
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
  m()
], At.prototype, "_dragKey", 2);
Zi([
  m()
], At.prototype, "_dropIndex", 2);
At = Zi([
  R("di-layers-panel")
], At);
var Ch = Object.defineProperty, Eh = Object.getOwnPropertyDescriptor, El = (e) => {
  throw TypeError(e);
}, je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Eh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Ch(t, i, s), s;
}, yn = (e, t, i) => t.has(e) || El("Cannot " + i), Dh = (e, t, i) => (yn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Yn = (e, t, i) => t.has(e) ? El("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ph = (e, t, i, a) => (yn(e, t, "write to private field"), t.set(e, i), i), se = (e, t, i) => (yn(e, t, "access private method"), i), Y, We, Ia, Dl, Pl, ki;
let xe = class extends N {
  constructor() {
    super(...arguments), Yn(this, Y), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Yn(this, Ia, 100);
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
            @click=${() => se(this, Y, We).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${Ma.min * 100}
            .max=${Ma.max * 100}
            .value=${se(this, Y, Dl).call(this)}
            @change=${se(this, Y, Pl)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => se(this, Y, We).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => se(this, Y, We).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${se(this, Y, ki).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${se(this, Y, ki).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${se(this, Y, ki).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${se(this, Y, ki).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => se(this, Y, We).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => se(this, Y, We).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => se(this, Y, We).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
Y = /* @__PURE__ */ new WeakSet();
We = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Ia = /* @__PURE__ */ new WeakMap();
Dl = function() {
  return this.matches(":focus-within") || Ph(this, Ia, Math.round(this.effectiveScale * 100)), Dh(this, Ia);
};
Pl = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && se(this, Y, We).call(this, "di-zoom-change", { zoom: t / 100 });
};
ki = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => se(this, Y, We).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
xe.styles = I`
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
  b({ type: Number })
], xe.prototype, "effectiveScale", 2);
je([
  b({ type: Boolean })
], xe.prototype, "snapEnabled", 2);
je([
  b({ type: Boolean })
], xe.prototype, "showRulers", 2);
je([
  b({ type: Boolean })
], xe.prototype, "showSafeArea", 2);
je([
  b({ type: Boolean })
], xe.prototype, "showMeasured", 2);
je([
  b({ type: Boolean })
], xe.prototype, "canUndo", 2);
je([
  b({ type: Boolean })
], xe.prototype, "canRedo", 2);
je([
  b({ type: Boolean })
], xe.prototype, "previewing", 2);
xe = je([
  R("di-canvas-toolbar")
], xe);
var Mh = Object.defineProperty, zh = Object.getOwnPropertyDescriptor, Ml = (e) => {
  throw TypeError(e);
}, Qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Mh(t, i, s), s;
}, vn = (e, t, i) => t.has(e) || Ml("Cannot " + i), Z = (e, t, i) => (vn(e, t, "read from private field"), t.get(e)), pt = (e, t, i) => t.has(e) ? Ml("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Dt = (e, t, i, a) => (vn(e, t, "write to private field"), t.set(e, i), i), Ue = (e, t, i) => (vn(e, t, "access private method"), i), et, Ht, jt, Pt, Aa, La, _e, bn, ba, _n, Fs;
const Oh = 400;
let Lt = class extends N {
  constructor() {
    super(), pt(this, _e), pt(this, et), pt(this, Ht), pt(this, jt), pt(this, Pt), pt(this, Aa), pt(this, La, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(Wt, (e) => {
      Dt(this, et, e), e && (this.observe(e.template, (t) => {
        t && Ue(this, _e, ba).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Dt(this, Aa, t);
        const i = (a = Z(this, et)) == null ? void 0 : a.getData();
        i && Ue(this, _e, ba).call(this, i);
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
    e && (window.clearTimeout(Z(this, Ht)), this._collapsed = !1, Ue(this, _e, _n).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(Z(this, Ht)), (e = Z(this, jt)) == null || e.abort(), Ue(this, _e, bn).call(this);
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
        t && Ue(this, _e, ba).call(this, t);
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
Ht = /* @__PURE__ */ new WeakMap();
jt = /* @__PURE__ */ new WeakMap();
Pt = /* @__PURE__ */ new WeakMap();
Aa = /* @__PURE__ */ new WeakMap();
La = /* @__PURE__ */ new WeakMap();
_e = /* @__PURE__ */ new WeakSet();
bn = function() {
  Z(this, Pt) && (URL.revokeObjectURL(Z(this, Pt)), Dt(this, Pt, void 0));
};
ba = function(e) {
  this._collapsed || (window.clearTimeout(Z(this, Ht)), Dt(this, Ht, window.setTimeout(() => void Ue(this, _e, _n).call(this, e), Oh)));
};
_n = async function(e) {
  var t;
  if (Z(this, et)) {
    (t = Z(this, jt)) == null || t.abort(), Dt(this, jt, new AbortController()), Ue(this, _e, Fs).call(this, !0), this._error = void 0;
    try {
      const i = await js(
        e,
        {
          signal: Z(this, jt).signal,
          contentKey: Z(this, Aa),
          useSampleData: Z(this, La)
        },
        Z(this, et).getToken
      );
      Ue(this, _e, bn).call(this), Dt(this, Pt, URL.createObjectURL(i)), this._url = Z(this, Pt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ue(this, _e, Fs).call(this, !1);
    }
  }
};
Fs = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Lt.styles = I`
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
      ${sn}
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
  m()
], Lt.prototype, "_url", 2);
Qi([
  m()
], Lt.prototype, "_loading", 2);
Qi([
  m()
], Lt.prototype, "_error", 2);
Qi([
  m()
], Lt.prototype, "_collapsed", 2);
Lt = Qi([
  R("di-preview-strip")
], Lt);
var Ih = Object.defineProperty, Ah = Object.getOwnPropertyDescriptor, zl = (e) => {
  throw TypeError(e);
}, te = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ah(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Ih(t, i, s), s;
}, wn = (e, t, i) => t.has(e) || zl("Cannot " + i), y = (e, t, i) => (wn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), mt = (e, t, i) => t.has(e) ? zl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ci = (e, t, i, a) => (wn(e, t, "write to private field"), t.set(e, i), i), ie = (e, t, i) => (wn(e, t, "access private method"), i), $, Li, Ri, Wi, Xt, W, Us, $n, Ol, Il, Bs, Al, Ll, Rl, Ks, Wl, Nl, Fl, Ul, xn, Bl, _a;
const Lh = 400;
let U = class extends N {
  constructor() {
    super(), mt(this, W), mt(this, $), mt(this, Li), mt(this, Ri), mt(this, Wi), mt(this, Xt), this._properties = [], this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, mt(this, _a, (e) => {
      var n;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = y(this, $);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = y(this, W, Us);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), ie(this, W, Bs).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const o = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -o : e.key === "ArrowRight" ? o : 0, d = e.key === "ArrowUp" ? -o : e.key === "ArrowDown" ? o : 0, f = ze(s.position, "x") ? 0 : l, C = ze(s.position, "y") ? 0 : d;
            if (f === 0 && C === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + f, y: s.position.y + C }
            });
            break;
          }
          case "[":
          case "]": {
            const o = ((n = this._template) == null ? void 0 : n.layers.findIndex((l) => l.key === s.key)) ?? -1;
            if (o < 0) return;
            e.preventDefault(), i.moveLayer(s.key, e.key === "]" ? o + 1 : o - 1);
            break;
          }
        }
      }
    }), this.consumeContext(Fa, (e) => {
      Ci(this, Li, e);
    }), this.consumeContext(Ge, (e) => {
      Ci(this, Ri, e);
    }), this.consumeContext(Wt, (e) => {
      Ci(this, $, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (ie(this, W, Al).call(this, t), ie(this, W, Ll).call(this, t), ie(this, W, Rl).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", y(this, _a));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", y(this, _a)), window.clearTimeout(y(this, Wi)), (e = y(this, Xt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = y(this, $)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = y(this, $)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = y(this, $)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => ie(this, W, Bs).call(this, e.detail.key)}
        @di-layer-detach=${(e) => ie(this, W, Il).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = y(this, $)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = y(this, $)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = y(this, $)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = y(this, $)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = y(this, $)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = y(this, $)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => ie(this, W, Ks).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => ie(this, W, Ks).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-pick-base-image=${ie(this, W, Fl)}
        @di-pick-layer-image=${(e) => ie(this, W, Ul).call(this, e.detail.key)}
        @di-use-image-size=${ie(this, W, Bl)}
        @di-request-preview=${() => {
      var e;
      return (e = y(this, W, Ol)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(Ma.min, Math.min(Ma.max, e.detail.zoom));
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
      return (e = y(this, $)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = y(this, $)) == null ? void 0 : e.redo();
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
            .layer=${y(this, W, Us)}
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
$n = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Ol = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Il = function(e, t) {
  var s, n, o;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (n = y(this, W, $n)) == null ? void 0 : n.resolvedPositionOf(e);
  (o = y(this, $)) == null || o.updateLayer(e, { position: fs(i.position, t, a) });
};
Bs = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const n of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const o = (a = y(this, W, $n)) == null ? void 0 : a.resolvedPositionOf(n.key);
    o && t.set(n.key, o);
  }
  (s = y(this, $)) == null || s.removeLayer(e, t);
};
Al = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && y(this, $) && await ar(t, y(this, $).getToken);
};
Ll = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !y(this, $)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Ys(t.mediaKey, y(this, $).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Rl = function() {
  window.clearTimeout(y(this, Wi)), Ci(this, Wi, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !y(this, $))) {
      (t = y(this, Xt)) == null || t.abort(), Ci(this, Xt, new AbortController());
      try {
        const i = await Xs(
          e,
          { signal: y(this, Xt).signal, useSampleData: !0 },
          y(this, $).getToken
        );
        y(this, $).setServerBounds(i.layers), y(this, $).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, Lh));
};
Ks = function(e, t, i, a) {
  const s = this._template;
  if (!s || !y(this, $)) return;
  const n = { template: s, x: t, y: i, defaultFontKey: ie(this, W, Nl).call(this) };
  if (e.kind === "property") {
    const l = Wc(e.property, n);
    if (l.kind === "condition") {
      ie(this, W, Wl).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    y(this, $).addLayer(l.layer);
    return;
  }
  const o = e.layerType === "image" ? Mo(n, "Image") : e.layerType === "badges" ? zo(n, "Badges", "") : e.layerType === "rect" ? Lc(n, "Shape", e.shape) : Po(n, "Text", { kind: "static", text: "Text" });
  y(this, $).addLayer(o);
};
Wl = function(e, t, i) {
  var n, o, l, d;
  const a = i ?? this._selectedKey, s = (n = this._template) == null ? void 0 : n.layers.find((f) => f.key === a);
  if (!s) {
    (o = y(this, Ri)) == null || o.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = y(this, $)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (d = y(this, Ri)) == null || d.peek("positive", {
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
  const e = await ie(this, W, xn).call(this);
  e && ((t = y(this, $)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
Ul = async function(e) {
  var i;
  const t = await ie(this, W, xn).call(this);
  t && ((i = y(this, $)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
xn = async function() {
  if (!y(this, Li)) return;
  const e = y(this, Li).open(this, ao, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
Bl = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !y(this, $)) return;
  const t = await Ys(e.mediaKey, y(this, $).getToken).catch(() => {
  });
  t && y(this, $).updateCanvas({ width: t.width, height: t.height });
};
_a = /* @__PURE__ */ new WeakMap();
U.styles = I`
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
te([
  m()
], U.prototype, "_template", 2);
te([
  m()
], U.prototype, "_selectedKey", 2);
te([
  m()
], U.prototype, "_properties", 2);
te([
  m()
], U.prototype, "_fonts", 2);
te([
  m()
], U.prototype, "_serverBounds", 2);
te([
  m()
], U.prototype, "_baseImageUrl", 2);
te([
  m()
], U.prototype, "_zoom", 2);
te([
  m()
], U.prototype, "_effectiveScale", 2);
te([
  m()
], U.prototype, "_previewing", 2);
te([
  m()
], U.prototype, "_snapEnabled", 2);
te([
  m()
], U.prototype, "_showRulers", 2);
te([
  m()
], U.prototype, "_showSafeArea", 2);
te([
  m()
], U.prototype, "_showMeasured", 2);
te([
  m()
], U.prototype, "_canUndo", 2);
te([
  m()
], U.prototype, "_canRedo", 2);
U = te([
  R("di-design-view")
], U);
const Rh = U, Wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return U;
  },
  default: Rh
}, Symbol.toStringTag, { value: "Module" }));
var Nh = Object.defineProperty, Fh = Object.getOwnPropertyDescriptor, Kl = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Nh(t, i, s), s;
}, kn = (e, t, i) => t.has(e) || Kl("Cannot " + i), K = (e, t, i) => (kn(e, t, "read from private field"), t.get(e)), Nt = (e, t, i) => t.has(e) ? Kl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Yt = (e, t, i, a) => (kn(e, t, "write to private field"), t.set(e, i), i), J = (e, t, i) => (kn(e, t, "access private method"), i), pe, Ni, Fi, qt, Mt, G, Vl, Ra, Gl, Hl, Sn, jl, Ui, Xl, Yl, ql;
let ue = class extends N {
  constructor() {
    super(), Nt(this, G), Nt(this, pe), Nt(this, Ni), Nt(this, Fi), Nt(this, qt), Nt(this, Mt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Fa, (e) => {
      Yt(this, Ni, e);
    }), this.consumeContext(Ge, (e) => {
      Yt(this, Fi, e);
    }), this.consumeContext(Wt, (e) => {
      Yt(this, pe, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && J(this, G, Vl).call(this);
      });
    });
  }
  connectedCallback() {
    super.connectedCallback(), J(this, G, Ui).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = K(this, qt)) == null || e.abort(), J(this, G, Sn).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${J(this, G, jl)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => J(this, G, Ui).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${J(this, G, Yl)}>
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
      (e) => J(this, G, ql).call(this, e)
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
                @click=${J(this, G, Xl)}>
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
qt = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
G = /* @__PURE__ */ new WeakSet();
Vl = async function() {
  var t;
  const e = J(this, G, Gl).call(this);
  e && (this._sampleNode = e, (t = K(this, pe)) == null || t.setSampleContentKey(e.key), await J(this, G, Ui).call(this));
};
Ra = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
Gl = function() {
  try {
    const e = localStorage.getItem(J(this, G, Ra).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
Hl = function(e) {
  try {
    e ? localStorage.setItem(J(this, G, Ra).call(this), JSON.stringify(e)) : localStorage.removeItem(J(this, G, Ra).call(this));
  } catch {
  }
};
Sn = function() {
  K(this, Mt) && (URL.revokeObjectURL(K(this, Mt)), Yt(this, Mt, void 0));
};
jl = async function() {
  var i, a, s;
  if (!K(this, Ni) || !this._template) return;
  const e = K(this, Ni).open(this, gu, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, J(this, G, Hl).call(this, t.item), (s = K(this, pe)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await J(this, G, Ui).call(this));
};
Ui = async function() {
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
    const [s, n] = await Promise.all([
      js(e, t, K(this, pe).getToken),
      Xs(e, t, K(this, pe).getToken)
    ]);
    J(this, G, Sn).call(this), Yt(this, Mt, URL.createObjectURL(s)), this._url = K(this, Mt), this._bounds = n.layers, this._skipped = n.skipped ?? [], K(this, pe).setServerBounds(n.layers), K(this, pe).setIssues(n.issues);
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
      const i = await Ba(this._sampleNode.key, K(this, pe).getToken);
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
      ${sn}
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
const Uh = ue, Bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return ue;
  },
  default: Uh
}, Symbol.toStringTag, { value: "Module" }));
var Kh = Object.defineProperty, Vh = Object.getOwnPropertyDescriptor, Jl = (e) => {
  throw TypeError(e);
}, es = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Vh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Kh(t, i, s), s;
}, Tn = (e, t, i) => t.has(e) || Jl("Cannot " + i), F = (e, t, i) => (Tn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ls = (e, t, i) => t.has(e) ? Jl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qn = (e, t, i, a) => (Tn(e, t, "write to private field"), t.set(e, i), i), st = (e, t, i) => (Tn(e, t, "access private method"), i), H, Rt, we, Zl, Ql, ec, tc, ic, ac, sc, nc, oc;
let ct = class extends N {
  constructor() {
    super(), ls(this, we), ls(this, H), ls(this, Rt), this._properties = [], this._showAdvanced = !1, this.consumeContext(Fa, (e) => {
      qn(this, Rt, e);
    }), this.consumeContext(Wt, (e) => {
      qn(this, H, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${st(this, we, ac).call(this)} ${st(this, we, sc).call(this)} ${st(this, we, nc).call(this)} ${st(this, we, oc).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
H = /* @__PURE__ */ new WeakMap();
Rt = /* @__PURE__ */ new WeakMap();
we = /* @__PURE__ */ new WeakSet();
Zl = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Ql = async function() {
  var a, s;
  if (!F(this, Rt) || !this._template) return;
  const e = F(this, Rt).open(this, $c, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (n) => !n.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await st(this, we, ec).call(this, t.selection.filter((n) => !!n));
  (a = F(this, H)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = F(this, H)) == null ? void 0 : s.reloadProperties());
};
ec = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => Ac), i = await t(F(this, H).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, n, o) => o.indexOf(s) === n);
};
tc = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((n) => n !== e);
  (a = F(this, H)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = F(this, H)) == null || s.reloadProperties();
};
ic = async function() {
  var i;
  if (!F(this, Rt)) return;
  const e = F(this, Rt).open(this, ao, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = F(this, H)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
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
                          @click=${() => st(this, we, tc).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${st(this, we, Ql)}>
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
    ...F(this, we, Zl).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = F(this, H)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = F(this, H)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
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
            <uui-button look="secondary" label="Choose folder" @click=${st(this, we, ic)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = F(this, H)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
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
    return (i = F(this, H)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = F(this, H)) == null ? void 0 : i.updateOutput({
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
    return (i = F(this, H)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
nc = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = F(this, H)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = F(this, H)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
oc = function() {
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
    return (i = F(this, H)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
ct.styles = I`
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
  m()
], ct.prototype, "_template", 2);
es([
  m()
], ct.prototype, "_properties", 2);
es([
  m()
], ct.prototype, "_showAdvanced", 2);
ct = es([
  R("di-settings-view")
], ct);
const Gh = ct, Hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return ct;
  },
  default: Gh
}, Symbol.toStringTag, { value: "Module" }));
var jh = Object.defineProperty, Xh = Object.getOwnPropertyDescriptor, rc = (e) => {
  throw TypeError(e);
}, ea = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Xh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && jh(t, i, s), s;
}, Cn = (e, t, i) => t.has(e) || rc("Cannot " + i), Jn = (e, t, i) => (Cn(e, t, "read from private field"), t.get(e)), Zn = (e, t, i) => t.has(e) ? rc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Yh = (e, t, i, a) => (Cn(e, t, "write to private field"), t.set(e, i), i), Qn = (e, t, i) => (Cn(e, t, "access private method"), i), Bi, wa, Vs;
let Ke = class extends N {
  constructor() {
    super(), Zn(this, wa), Zn(this, Bi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Wt, (e) => {
      Yh(this, Bi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Qn(this, wa, Vs).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Qn(this, wa, Vs).call(this)}>Reload</uui-button>
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
Vs = async function() {
  const e = this._template;
  if (!(!e || !Jn(this, Bi))) {
    this._loading = !0;
    try {
      this._usage = await So(e.key, Jn(this, Bi).getToken);
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

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
ea([
  m()
], Ke.prototype, "_template", 2);
ea([
  m()
], Ke.prototype, "_usage", 2);
ea([
  m()
], Ke.prototype, "_loading", 2);
ea([
  m()
], Ke.prototype, "_onlyMissing", 2);
Ke = ea([
  R("di-usage-view")
], Ke);
const qh = Ke, Jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Ke;
  },
  default: qh
}, Symbol.toStringTag, { value: "Module" })), Zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: An,
  default: An
}, Symbol.toStringTag, { value: "Module" })), Qh = 1500;
var ge, Ct, Na, lc;
class cs extends Sc {
  constructor(i, a) {
    super(i, a);
    w(this, Na);
    w(this, ge);
    w(this, Ct);
    this.consumeContext(Ge, (s) => {
      _(this, ge, s);
    }), this.consumeContext(Wt, (s) => {
      _(this, Ct, s);
    });
  }
  async execute() {
    var s, n, o;
    const i = c(this, Ct), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, ge)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await Gs(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await $o(a.key, !1, i.getToken);
        (n = c(this, ge)) == null || n.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await P(this, Na, lc).call(this, l, i);
      } catch (l) {
        (o = c(this, ge)) == null || o.peek("danger", {
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
    c(this, Ct) && await ko(i, c(this, Ct).getToken);
  }
}
ge = new WeakMap(), Ct = new WeakMap(), Na = new WeakSet(), lc = async function(i, a) {
  var n, o, l, d;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((f) => setTimeout(f, Qh));
    try {
      s = await xo(s.id, a.getToken);
    } catch {
      (n = c(this, ge)) == null || n.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }
  if (s.status === "completed") {
    const f = s.failures.length;
    (o = c(this, ge)) == null || o.peek(f > 0 ? "warning" : "positive", {
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
const ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: cs,
  api: cs,
  default: cs
}, Symbol.toStringTag, { value: "Module" }));
var Gi, oi;
class us extends Ec {
  constructor(i, a) {
    super(i, a);
    w(this, Gi);
    w(this, oi);
    this.consumeContext(Ve, (s) => {
      _(this, Gi, s);
    }), this.consumeContext(Ge, (s) => {
      _(this, oi, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const n = await Ba(i, () => {
          var o;
          return (o = c(this, Gi)) == null ? void 0 : o.getLatestToken();
        });
        (a = c(this, oi)) == null || a.peek(n.outcome === "generated" ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n.outcome === "generated" ? "The image has been regenerated." : n.message ?? n.outcome
          }
        });
      } catch (n) {
        const o = n instanceof ot && n.status === 404;
        (s = c(this, oi)) == null || s.peek(o ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: n instanceof ot ? n.detail ?? n.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Gi = new WeakMap(), oi = new WeakMap();
const td = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: us,
  api: us,
  default: us
}, Symbol.toStringTag, { value: "Module" }));
var Hi, Et, ji, ri;
class hs extends Dc {
  constructor(i, a) {
    super(i, a);
    w(this, Hi);
    w(this, Et);
    w(this, ji);
    w(this, ri);
    this.consumeContext(Ve, (s) => {
      _(this, Hi, s);
    }), this.consumeContext(Ge, (s) => {
      _(this, Et, s);
    }), this.consumeContext(Pc, (s) => {
      _(this, ji, s);
    }), this.consumeContext(Mc, (s) => {
      _(this, ri, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, n;
    if (!c(this, ri)) {
      (i = c(this, Et)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const o = await Ba(c(this, ri), () => {
        var l;
        return (l = c(this, Hi)) == null ? void 0 : l.getLatestToken();
      });
      o.propertyValue && ((a = c(this, ji)) == null || a.setValue(JSON.parse(o.propertyValue))), (s = c(this, Et)) == null || s.peek("positive", {
        data: { headline: "Dynamic Images", message: "The image has been regenerated." }
      });
    } catch (o) {
      const l = o instanceof ot && o.status === 404;
      (n = c(this, Et)) == null || n.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: o instanceof ot ? o.detail ?? o.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Hi = new WeakMap(), Et = new WeakMap(), ji = new WeakMap(), ri = new WeakMap();
const id = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: hs,
  api: hs,
  default: hs
}, Symbol.toStringTag, { value: "Module" }));
var ad = Object.defineProperty, sd = Object.getOwnPropertyDescriptor, cc = (e) => {
  throw TypeError(e);
}, ts = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? sd(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && ad(t, i, s), s;
}, En = (e, t, i) => t.has(e) || cc("Cannot " + i), Wa = (e, t, i) => (En(e, t, "read from private field"), t.get(e)), oa = (e, t, i) => t.has(e) ? cc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), uc = (e, t, i, a) => (En(e, t, "write to private field"), t.set(e, i), i), Ut = (e, t, i) => (En(e, t, "access private method"), i), $a, Ki, Dn, Je, Pn, hc, xa;
let ut = class extends io {
  constructor() {
    super(), oa(this, Je), oa(this, $a), oa(this, Ki), this._items = [], this._loading = !0, this._search = "", oa(this, Dn, () => {
      var e;
      return (e = Wa(this, $a)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ve, (e) => {
      uc(this, $a, e), e && Ut(this, Je, Pn).call(this);
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
          @input=${Ut(this, Je, hc)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Ut(this, Je, xa).call(this, void 0)}>
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
                      @open=${() => Ut(this, Je, xa).call(this, e)}
                      @click=${() => Ut(this, Je, xa).call(this, e)}>
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
Dn = /* @__PURE__ */ new WeakMap();
Je = /* @__PURE__ */ new WeakSet();
Pn = async function() {
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
        (a) => wo(a, this._search, 0, 30, Wa(this, Dn)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
hc = function(e) {
  this._search = e.target.value, window.clearTimeout(Wa(this, Ki)), uc(this, Ki, window.setTimeout(() => void Ut(this, Je, Pn).call(this), 300));
};
xa = function(e) {
  this.value = { item: e }, this._submitModal();
};
ut.styles = I`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
ts([
  m()
], ut.prototype, "_items", 2);
ts([
  m()
], ut.prototype, "_loading", 2);
ts([
  m()
], ut.prototype, "_search", 2);
ut = ts([
  R("di-sample-node-picker-modal")
], ut);
const nd = ut, od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return ut;
  },
  default: nd
}, Symbol.toStringTag, { value: "Module" }));
var rd = Object.defineProperty, ld = Object.getOwnPropertyDescriptor, dc = (e) => {
  throw TypeError(e);
}, Ye = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ld(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && rd(t, i, s), s;
}, Mn = (e, t, i) => t.has(e) || dc("Cannot " + i), hi = (e, t, i) => (Mn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ds = (e, t, i) => t.has(e) ? dc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), cd = (e, t, i, a) => (Mn(e, t, "write to private field"), t.set(e, i), i), wt = (e, t, i) => (Mn(e, t, "access private method"), i), ka, ta, ye, pc, mc, fc, zn, gc, yc, vc, bc;
const ud = [100, 200, 300, 400, 500, 600, 700, 800, 900], hd = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let he = class extends io {
  constructor() {
    super(), ds(this, ye), ds(this, ka), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", ds(this, ta, () => {
      var e;
      return (e = hi(this, ka)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ve, (e) => {
      cd(this, ka, e);
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
            @change=${wt(this, ye, pc)}>
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
            @click=${wt(this, ye, fc)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${hd.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? wt(this, ye, bc).call(this) : wt(this, ye, vc).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !hi(this, ye, zn)}
            @click=${wt(this, ye, gc)}>
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
ka = /* @__PURE__ */ new WeakMap();
ta = /* @__PURE__ */ new WeakMap();
ye = /* @__PURE__ */ new WeakSet();
pc = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  wt(this, ye, mc).call(this, t);
};
mc = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await po(t, hi(this, ta));
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
      await mo(this._path.trim(), hi(this, ta)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
zn = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
gc = async function() {
  if (hi(this, ye, zn)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await fo(
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
    ud,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => wt(this, ye, yc).call(this, e, t.target.checked)}>
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
const dd = he, pd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return he;
  },
  default: dd
}, Symbol.toStringTag, { value: "Module" }));
export {
  Zc as manifests,
  Pd as onInit
};
//# sourceMappingURL=dynamic-images.js.map
