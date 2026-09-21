var Io = (e) => {
  throw TypeError(e);
};
var is = (e, t, i) => t.has(e) || Io("Cannot " + i);
var c = (e, t, i) => (is(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? Io("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (is(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), D = (e, t, i) => (is(e, t, "access private method"), i);
var as = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { nothing as p, html as r, css as I, state as m, customElement as R, repeat as B, property as b, classMap as en, styleMap as V } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as N } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Ve } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as Ge } from "@umbraco-cms/backoffice/notification";
import { umbOpenModal as yc, UMB_DISCARD_CHANGES_MODAL as vc, umbConfirmModal as Gs, UmbModalToken as tn, UMB_MODAL_MANAGER_CONTEXT as Fa, UmbModalBaseElement as an } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as sn } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as bc } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as _c, UmbEntityWorkspaceDataManager as wc, UmbSubmitWorkspaceAction as Ao, UmbWorkspaceActionBase as $c } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as xc } from "@umbraco-cms/backoffice/context-api";
import { UmbArrayState as gi, UmbStringState as Lo, UmbBooleanState as aa, UmbNumberState as kc } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as Sc } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as Cc } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Tc } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Ec } from "@umbraco-cms/backoffice/document";
import "@umbraco-cms/backoffice/external/uui";
const Ua = "dynamic-images", Hi = "di-template", Sa = "di:templates-changed", Dc = "/umbraco/management/api/v1/dynamic-images";
class nt extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function k(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${Dc}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await Pc(n);
  return n;
}
async function Pc(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new nt(t, e.status, i);
}
const O = async (e) => e.json();
async function Hs(e) {
  const t = await k("/templates?take=500", e);
  return (await O(t)).items;
}
const on = async (e, t) => O(await k(`/templates/${e}`, t)), nn = async (e, t) => O(await k("/templates", t, { method: "POST", json: e })), rn = async (e, t) => O(await k(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function ln(e, t) {
  await k(`/templates/${e}`, t, { method: "DELETE" });
}
const cn = async (e, t) => O(await k(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function un(e, t) {
  return (await k(`/templates/${e}/export`, t)).blob();
}
const hn = async (e, t, i) => O(await k("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), Ci = async (e) => O(await k("/fonts", e));
async function dn(e, t) {
  const i = new FormData();
  return i.append("file", e), O(await k("/fonts", t, { method: "POST", body: i }));
}
const pn = async (e, t) => O(await k("/fonts/register-path", t, { method: "POST", json: { path: e } })), mn = async (e, t) => O(await k("/fonts/register-web", t, { method: "POST", json: e })), fn = async (e, t) => O(await k(`/fonts/${e}/refresh`, t, { method: "POST" })), gn = async (e, t, i, a, s) => O(await k(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function yn(e, t) {
  await k(`/fonts/${e}`, t, { method: "DELETE" });
}
async function vn(e, t) {
  return (await k(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Mc = async (e) => O(await k("/document-types", e)), bn = async (e, t) => O(await k(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function _n(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), O(await k(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function js(e, t, i) {
  return (await k("/preview", i, {
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
const Xs = async (e, t, i) => O(await k("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Ys = async (e, t) => O(await k(`/media/${e}/image-info`, t)), Ba = async (e, t) => O(await k(`/documents/${e}/regenerate`, t, { method: "POST" })), wn = async (e, t, i) => O(await k(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), $n = async (e, t) => O(await k(`/jobs/${e}`, t));
async function xn(e, t) {
  await k(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const kn = async (e, t) => O(await k(`/templates/${e}/usage`, t)), Ka = async (e) => O(await k("/health", e)), Sn = async (e) => O(await k("/sync/status", e)), Cn = async (e) => O(await k("/sync/export", e, { method: "POST" })), Tn = async (e) => O(await k("/sync/import", e, { method: "POST" }));
function li(e) {
  const t = `section/${Ua}/workspace/${Hi}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Va() {
  return new URL(`section/${Ua}/workspace/${Hi}/create`, document.baseURI).pathname;
}
function En(e) {
  return new URL(`section/${Ua}/dashboard/${e}`, document.baseURI).pathname;
}
function ps() {
  const e = window.location.pathname.split(`/workspace/${Hi}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function ji() {
  window.dispatchEvent(new CustomEvent(Sa));
}
const zc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: nt,
  SECTION_PATHNAME: Ua,
  TEMPLATES_CHANGED_EVENT: Sa,
  TEMPLATE_ENTITY_TYPE: Hi,
  cancelJob: xn,
  createTemplate: nn,
  deleteFont: yn,
  deleteTemplate: ln,
  duplicateTemplate: cn,
  exportTemplate: un,
  fetchDocumentTypes: Mc,
  fetchFontFile: vn,
  fetchFonts: Ci,
  fetchHealth: Ka,
  fetchImageInfo: Ys,
  fetchJob: $n,
  fetchLayout: Xs,
  fetchPreview: js,
  fetchProperties: bn,
  fetchSampleContent: _n,
  fetchSyncStatus: Sn,
  fetchTemplate: on,
  fetchTemplates: Hs,
  fetchUsage: kn,
  hrefForCreate: Va,
  hrefForDashboard: En,
  hrefForTemplate: li,
  importTemplate: hn,
  notifyTemplatesChanged: ji,
  refreshFont: fn,
  regenerateDocument: Ba,
  regenerateTemplate: wn,
  registerFontPath: pn,
  registerWebFont: mn,
  runSyncExport: Cn,
  runSyncImport: Tn,
  templateKeyFromLocation: ps,
  updateFont: gn,
  updateTemplate: rn,
  uploadFont: dn
}, Symbol.toStringTag, { value: "Module" })), Ga = () => crypto.randomUUID();
function Ha(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function Dn(e, t, i) {
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
function Pn(e, t, i) {
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
function Mn(e, t, i) {
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
function Oc(e, t = "Shape", i = "rectangle") {
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
function Ic(e) {
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
function Ac(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (Ic(e.classification)) {
    case "image":
      return { kind: "layer", layer: Pn(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: Mn(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: Dn(t, e.name, Lc(e)) };
  }
}
function Lc(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function zn() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function Rc(e) {
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
const On = [
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
function ms(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return On[a * 3 + i];
}
function ja(e, t, i) {
  return {
    x: e.x - t * Ti(e.anchor),
    y: e.y - i * Ei(e.anchor)
  };
}
function qs(e, t, i, a, s) {
  return {
    x: e + i * Ti(s),
    y: t + a * Ei(s)
  };
}
function Wc(e, t, i, a) {
  const s = ja(e, t, i), o = qs(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function Nc(e, t) {
  const i = qs(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function In(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Bt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), d = e - i, f = t - a;
  return { x: i + d * n - f * l, y: a + d * l + f * n };
}
function Fc(e, t, i, a, s) {
  return Bt(e, t, i, a, -s);
}
function An(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Bt(e.x, e.y, t, i, a),
    Bt(e.x + e.width, e.y, t, i, a),
    Bt(e.x + e.width, e.y + e.height, t, i, a),
    Bt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((f) => f.x)), n = Math.max(...s.map((f) => f.x)), l = Math.min(...s.map((f) => f.y)), d = Math.max(...s.map((f) => f.y));
  return { x: o, y: l, width: n - o, height: d - l };
}
const Uc = 10;
function De(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Ln(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Ca(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Ro(e) {
  return e === "below" || e === "above";
}
function Wo(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Bc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Kc(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = Wo(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...Wo(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Vc(e, t, i) {
  const a = e.position;
  if (!Ln(a)) return a;
  if (Kc(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Ti(a.anchor), l = Ei(a.anchor);
  const d = No(e, a.relativeX, !1, t, i);
  d && (s = d.coordinate, n = d.factor);
  const f = No(e, a.relativeY, !0, t, i);
  return f && (o = f.coordinate, l = f.factor), { x: s, y: o, anchor: ms(n, l) };
}
function No(e, t, i, a, s) {
  if (!t || Ro(t.edge) !== i) return;
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
    if (!f || Ro(f.edge) !== i) return;
    n = f.layerKey;
  }
}
function Gc(e, t, i) {
  const a = Bc(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const d = s.get(l.key);
    if (d) return d;
    let f;
    o.has(l.key) ? f = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), f = Vc(l, a, (qe) => {
      const Oe = a.get(qe);
      return Oe && !i(Oe) ? n(Oe).extent : void 0;
    }), o.delete(l.key));
    const S = t(l), X = ja(f, S.width, S.height), xe = { x: X.x, y: X.y, width: S.width, height: S.height }, ze = { position: f, box: xe, extent: An(xe, f.x, f.y, l.rotation ?? 0) };
    return s.set(l.key, ze), ze;
  };
  for (const l of e) n(l);
  return s;
}
function fs(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? ms(Ti(i.anchor), Ei(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? ms(Ti(e.anchor), Ei(i.anchor)) : e.anchor
  };
}
var re, Le, Se, tt;
class Hc {
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
    c(this, Se) === 0 && _(this, tt, structuredClone(t)), as(this, Se)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Se) !== 0 && (as(this, Se)._--, !(c(this, Se) > 0) && (t && c(this, tt) !== void 0 && (c(this, re).push(c(this, tt)), c(this, re).length > this.limit && c(this, re).shift(), _(this, Le, [])), _(this, tt, void 0)));
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
const jc = "DynamicImages.Workspace.Template";
var Jt, it, $t, xt, Zt, Qt, ei, kt, ti, Re, ii, ai, le, Bi, St, Ce, Ct, x, Rn, si, oi, gs, ys, Ie, ft, vs, bs;
class Xc extends _c {
  constructor(i) {
    super(i, jc);
    w(this, x);
    w(this, Jt);
    w(this, it);
    w(this, $t);
    w(this, xt);
    w(this, Zt);
    w(this, Qt);
    w(this, ei);
    w(this, kt);
    w(this, ti);
    w(this, Re);
    w(this, ii);
    w(this, ai);
    w(this, le);
    w(this, Bi);
    w(this, St);
    w(this, Ce);
    w(this, Ct);
    w(this, si);
    w(this, oi);
    this._data = new wc(this), this.template = this._data.current, _(this, Jt, new gi([], (a) => a.key)), this.layers = c(this, Jt).asObservable(), _(this, it, new Lo(void 0)), this.selectedLayerKey = c(this, it).asObservable(), _(this, $t, new gi([], (a) => a.alias)), this.properties = c(this, $t).asObservable(), _(this, xt, new gi([], (a) => a.key)), this.fonts = c(this, xt).asObservable(), _(this, Zt, new gi([], (a) => a.key)), this.serverBounds = c(this, Zt).asObservable(), _(this, Qt, new gi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, Qt).asObservable(), _(this, ei, new Lo(void 0)), this.sampleContentKey = c(this, ei).asObservable(), _(this, kt, new aa(!0)), this.useSampleData = c(this, kt).asObservable(), _(this, ti, new kc(1)), this.zoom = c(this, ti).asObservable(), _(this, Re, new aa(!0)), this.loading = c(this, Re).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ii, new aa(!1)), this.canUndo = c(this, ii).asObservable(), _(this, ai, new aa(!1)), this.canRedo = c(this, ai).asObservable(), _(this, le, new Hc()), _(this, Ce, !1), _(this, Ct, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, si, async (a) => {
      const s = a.detail;
      if (c(this, Ct) || !(s != null && s.url) || !D(this, x, Rn).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await yc(this, vc), _(this, Ct, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, oi, (a) => {
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
        component: () => Promise.resolve().then(() => Uo),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Uo),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ve, (a) => {
      _(this, Bi, a);
    }), this.consumeContext(Ge, (a) => {
      _(this, St, a);
    }), window.addEventListener("willchangestate", c(this, si)), window.addEventListener("beforeunload", c(this, oi)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
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
      const a = await on(i, this.getToken);
      D(this, x, ft).call(this, a, { resetHistory: !0, persist: !0 }), this.setIsNew(!1), await D(this, x, gs).call(this, a);
    } catch (a) {
      D(this, x, bs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Re).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    c(this, Re).setValue(!0), _(this, Ce, !0), D(this, x, ft).call(this, Rc(i), { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await D(this, x, gs).call(this, this._data.getCurrent()), c(this, Re).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    i && c(this, $t).setValue(await D(this, x, ys).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    c(this, xt).setValue(await Ci(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    D(this, x, Ie).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    D(this, x, Ie).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    D(this, x, Ie).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    D(this, x, Ie).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    D(this, x, Ie).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    D(this, x, Ie).call(this, (s) => ({
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
    D(this, x, Ie).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, d;
        let n = o.position;
        return ((l = Ca(n, "x")) == null ? void 0 : l.layerKey) === i && (n = fs(n, "x", a == null ? void 0 : a.get(o.key))), ((d = Ca(n, "y")) == null ? void 0 : d.layerKey) === i && (n = fs(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
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
    D(this, x, Ie).call(this, (s) => {
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
    c(this, le).end(i), D(this, x, vs).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, le).undo(i);
    a && D(this, x, ft).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, le).redo(i);
    a && D(this, x, ft).call(this, a);
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
      const o = c(this, Ce) ? await nn(i, this.getToken) : await rn(i, this.getToken);
      D(this, x, ft).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Ce);
      _(this, Ce, !1), this.setIsNew(!1), ji(), (a = c(this, St)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, St)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", li(o.template.key));
    } catch (o) {
      throw D(this, x, bs).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Ct, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, si)), window.removeEventListener("beforeunload", c(this, oi)), c(this, le).clear(), super.destroy();
  }
}
Jt = new WeakMap(), it = new WeakMap(), $t = new WeakMap(), xt = new WeakMap(), Zt = new WeakMap(), Qt = new WeakMap(), ei = new WeakMap(), kt = new WeakMap(), ti = new WeakMap(), Re = new WeakMap(), ii = new WeakMap(), ai = new WeakMap(), le = new WeakMap(), Bi = new WeakMap(), St = new WeakMap(), Ce = new WeakMap(), Ct = new WeakMap(), x = new WeakSet(), /**
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
Rn = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, si = new WeakMap(), oi = new WeakMap(), gs = async function(i) {
  const [a, s] = await Promise.all([
    Ci(this.getToken).catch(() => []),
    D(this, x, ys).call(this, i.docTypeAliases)
  ]);
  c(this, xt).setValue(a), c(this, $t).setValue(s);
}, ys = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => bn(o, this.getToken).catch(() => []))
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
  D(this, x, ft).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
ft = function(i, a) {
  a != null && a.resetHistory && c(this, le).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Jt).setValue(i.layers), D(this, x, vs).call(this);
}, vs = function() {
  c(this, ii).setValue(c(this, le).canUndo), c(this, ai).setValue(c(this, le).canRedo);
}, bs = function(i, a) {
  var o;
  const s = a instanceof nt ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, St)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const Wt = new xc(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Yc = [
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
    element: () => Promise.resolve().then(() => ru),
    weight: 200,
    meta: { label: "Templates", menus: ["DynamicImages.Menu"] }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => hu),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => _u),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => ku),
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
    api: Xc,
    meta: { entityType: Hi }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => Ah),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Nh),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Kh),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Xh),
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
    api: () => Promise.resolve().then(() => Yh),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Jh),
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
    api: () => Promise.resolve().then(() => Zh),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Qh),
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
    element: () => Promise.resolve().then(() => ad)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => ud)
  }
], Td = (e, t) => {
  t.registerMany(Yc);
};
var qc = Object.defineProperty, Jc = Object.getOwnPropertyDescriptor, Wn = (e) => {
  throw TypeError(e);
}, Js = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && qc(t, i, s), s;
}, Zs = (e, t, i) => t.has(e) || Wn("Cannot " + i), Zc = (e, t, i) => (Zs(e, t, "read from private field"), t.get(e)), Fo = (e, t, i) => t.has(e) ? Wn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Qc = (e, t, i, a) => (Zs(e, t, "write to private field"), t.set(e, i), i), eu = (e, t, i) => (Zs(e, t, "access private method"), i), Ta, _s, Nn;
let zt = class extends N {
  constructor() {
    super(), Fo(this, _s), Fo(this, Ta), this._name = "", this._loading = !0, this.consumeContext(Wt, (e) => {
      Qc(this, Ta, e), e && (this.observe(e.template, (t) => {
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
            @input=${eu(this, _s, Nn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Ta = /* @__PURE__ */ new WeakMap();
_s = /* @__PURE__ */ new WeakSet();
Nn = function(e) {
  var i;
  const t = e.target.value;
  (i = Zc(this, Ta)) == null || i.updateTemplateFields({ name: t });
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
const tu = zt, Uo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return zt;
  },
  default: tu
}, Symbol.toStringTag, { value: "Module" }));
var iu = Object.defineProperty, au = Object.getOwnPropertyDescriptor, Fn = (e) => {
  throw TypeError(e);
}, di = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? au(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && iu(t, i, s), s;
}, Qs = (e, t, i) => t.has(e) || Fn("Cannot " + i), vt = (e, t, i) => (Qs(e, t, "read from private field"), t.get(e)), yi = (e, t, i) => t.has(e) ? Fn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), su = (e, t, i, a) => (Qs(e, t, "write to private field"), t.set(e, i), i), ra = (e, t, i) => (Qs(e, t, "access private method"), i), la, Ea, ca, ua, Kt, ws, Un, Bn;
let Pe = class extends N {
  constructor() {
    super(), yi(this, Kt), yi(this, la), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = ps(), this._expanded = !0, yi(this, Ea, () => {
      var e;
      return (e = vt(this, la)) == null ? void 0 : e.getLatestToken();
    }), yi(this, ca, () => {
      this._activeKey = ps();
    }), yi(this, ua, () => {
      ra(this, Kt, ws).call(this);
    }), this.consumeContext(Ve, (e) => {
      su(this, la, e), e && ra(this, Kt, ws).call(this);
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
        ${ra(this, Kt, Un).call(this)}
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
    this._templates = e, this._issuesByTemplate = ou((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
Un = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${B(
    this._templates,
    (e) => e.key,
    (e) => ra(this, Kt, Bn).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${Va()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
Bn = function(e) {
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
di([
  m()
], Pe.prototype, "_templates", 2);
di([
  m()
], Pe.prototype, "_issuesByTemplate", 2);
di([
  m()
], Pe.prototype, "_loading", 2);
di([
  m()
], Pe.prototype, "_activeKey", 2);
di([
  m()
], Pe.prototype, "_expanded", 2);
Pe = di([
  R("di-templates-menu-item")
], Pe);
function ou(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const nu = Pe, ru = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return Pe;
  },
  default: nu
}, Symbol.toStringTag, { value: "Module" }));
var lu = Object.defineProperty, cu = Object.getOwnPropertyDescriptor, Kn = (e) => {
  throw TypeError(e);
}, ht = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? cu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && lu(t, i, s), s;
}, eo = (e, t, i) => t.has(e) || Kn("Cannot " + i), Ne = (e, t, i) => (eo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), sa = (e, t, i) => t.has(e) ? Kn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Bo = (e, t, i, a) => (eo(e, t, "write to private field"), t.set(e, i), i), E = (e, t, i) => (eo(e, t, "access private method"), i), ha, Da, Fe, C, Xi, Ue, Vn, Gn, Hn, jn, Xn, bi, Yn, qn, Jn, Zn, Qn;
let me = class extends N {
  constructor() {
    super(), sa(this, C), sa(this, ha), sa(this, Da), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, sa(this, Fe, () => {
      var e;
      return (e = Ne(this, ha)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ge, (e) => {
      Bo(this, Da, e);
    }), this.consumeContext(Ve, (e) => {
      Bo(this, ha, e), e && E(this, C, Xi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${E(this, C, Xn).call(this)} ${E(this, C, Yn).call(this)} ${E(this, C, qn).call(this)}
      </umb-body-layout>
    `;
  }
};
ha = /* @__PURE__ */ new WeakMap();
Da = /* @__PURE__ */ new WeakMap();
Fe = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakSet();
Xi = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Hs(Ne(this, Fe)),
      Ci(Ne(this, Fe)).catch(() => []),
      Ka(Ne(this, Fe)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    E(this, C, Ue).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Ue = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ne(this, Da)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Vn = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await hn(this._pasteJson, "create", Ne(this, Fe)), E(this, C, Ue).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, ji(), await E(this, C, Xi).call(this);
    } catch (e) {
      E(this, C, Ue).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
Gn = async function(e) {
  try {
    await cn(e.key, Ne(this, Fe)), E(this, C, Ue).call(this, "positive", `'${e.name}' duplicated`), ji(), await E(this, C, Xi).call(this);
  } catch (t) {
    E(this, C, Ue).call(this, "danger", "The template could not be duplicated", t);
  }
};
Hn = async function(e) {
  await Gs(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await ln(e.key, Ne(this, Fe)), E(this, C, Ue).call(this, "positive", `'${e.name}' deleted`), ji(), await E(this, C, Xi).call(this);
  } catch (t) {
    E(this, C, Ue).call(this, "danger", "The template could not be deleted", t);
  }
};
jn = async function(e) {
  try {
    const t = await un(e.key, Ne(this, Fe)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    E(this, C, Ue).call(this, "danger", "The template could not be exported", t);
  }
};
Xn = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${E(this, C, bi).call(this, "Templates", this._templates.length, "icon-brush")}
        ${E(this, C, bi).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${E(this, C, bi).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${E(this, C, bi).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
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
Yn = function() {
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
        <uui-button look="secondary" href=${En("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
qn = function() {
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
          <uui-button look="primary" color="positive" href=${Va()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? E(this, C, Jn).call(this) : p}
        ${this._templates.length === 0 ? E(this, C, Zn).call(this) : E(this, C, Qn).call(this)}
      </uui-box>
    `;
};
Jn = function() {
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
          @click=${E(this, C, Vn)}>
          Import
        </uui-button>
      </div>
    `;
};
Zn = function() {
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
Qn = function() {
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
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => E(this, C, Gn).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => E(this, C, jn).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => E(this, C, Hn).call(this, e)}>
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
ht([
  m()
], me.prototype, "_templates", 2);
ht([
  m()
], me.prototype, "_fonts", 2);
ht([
  m()
], me.prototype, "_health", 2);
ht([
  m()
], me.prototype, "_loading", 2);
ht([
  m()
], me.prototype, "_importing", 2);
ht([
  m()
], me.prototype, "_pasteJson", 2);
ht([
  m()
], me.prototype, "_showPaste", 2);
me = ht([
  R("di-overview-dashboard")
], me);
const uu = me, hu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return me;
  },
  default: uu
}, Symbol.toStringTag, { value: "Module" })), $s = /* @__PURE__ */ new Map(), Xa = (e) => `di-${e}`;
function du(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = $s.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await vn(e, t), o = new FontFace(Xa(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return $s.set(e, a), a;
}
async function er(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => du(a, t)));
}
function tr(e) {
  $s.delete(e);
}
const pu = new tn(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), mu = new tn(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var fu = Object.defineProperty, gu = Object.getOwnPropertyDescriptor, ir = (e) => {
  throw TypeError(e);
}, Ya = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && fu(t, i, s), s;
}, to = (e, t, i) => t.has(e) || ir("Cannot " + i), Ee = (e, t, i) => (to(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vi = (e, t, i) => t.has(e) ? ir("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ss = (e, t, i, a) => (to(e, t, "write to private field"), t.set(e, i), i), L = (e, t, i) => (to(e, t, "access private method"), i), da, Di, Pi, Ot, z, ar, pi, rt, xs, sr, or, pa, nr, rr, lr;
function yu(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : vu(e.sourceUrl);
    default:
      return "Media library";
  }
}
function vu(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let lt = class extends N {
  constructor() {
    super(), vi(this, z), vi(this, da), vi(this, Di), vi(this, Pi), this._fonts = [], this._loading = !0, vi(this, Ot, () => {
      var e;
      return (e = Ee(this, da)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Fa, (e) => {
      ss(this, Di, e);
    }), this.consumeContext(Ge, (e) => {
      ss(this, Pi, e);
    }), this.consumeContext(Ve, (e) => {
      ss(this, da, e), e && L(this, z, pi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${L(this, z, xs)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${L(this, z, xs)}>
                  Add your first font
                </uui-button>
              </div>` : r`${B(this._fonts, (e) => e.key, (e) => L(this, z, nr).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
da = /* @__PURE__ */ new WeakMap();
Di = /* @__PURE__ */ new WeakMap();
Pi = /* @__PURE__ */ new WeakMap();
Ot = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakSet();
ar = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
pi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Ci(Ee(this, Ot)), await er(this._fonts.map((e) => e.key), Ee(this, Ot));
  } catch (e) {
    L(this, z, rt).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
rt = function(e, t, i) {
  var s;
  const a = i instanceof nt ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ee(this, Pi)) == null || s.peek(e, { data: { headline: t, message: a } });
};
xs = async function() {
  var i, a;
  if (!Ee(this, Di)) return;
  const e = Ee(this, Di).open(this, mu, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Ee(this, Pi)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await L(this, z, pi).call(this));
};
sr = async function(e) {
  try {
    await fn(e.key, Ee(this, Ot)), tr(e.key), L(this, z, rt).call(this, "positive", `'${e.familyName}' refreshed`), await L(this, z, pi).call(this);
  } catch (t) {
    L(this, z, rt).call(this, "danger", "That font could not be refreshed", t);
  }
};
or = async function(e) {
  await Gs(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await yn(e.key, Ee(this, Ot)), tr(e.key), L(this, z, rt).call(this, "positive", `'${e.familyName}' deleted`), await L(this, z, pi).call(this);
  } catch (t) {
    L(this, z, rt).call(this, "danger", "That font could not be deleted", t);
  }
};
pa = async function(e, t, i, a) {
  try {
    await gn(e.key, t, i, Ee(this, Ot), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), L(this, z, rt).call(this, "positive", `'${t}' saved`), await L(this, z, pi).call(this), a != null && a.keepOpen && await L(this, z, ar).call(this);
  } catch (s) {
    L(this, z, rt).call(this, "danger", "The font could not be saved", s);
  }
};
nr = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${yu(e)} · weight ${e.weight}
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
                  @click=${() => L(this, z, sr).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => L(this, z, or).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Xa(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? L(this, z, lr).call(this, e) : L(this, z, rr).call(this, e)}
      </div>
    `;
};
rr = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${B(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
lr = function(e) {
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
      t.splice(a, 1), L(this, z, pa).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), L(this, z, pa).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    L(this, z, pa).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
const bu = lt, _u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return lt;
  },
  default: bu
}, Symbol.toStringTag, { value: "Module" }));
var wu = Object.defineProperty, $u = Object.getOwnPropertyDescriptor, cr = (e) => {
  throw TypeError(e);
}, Yi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $u(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && wu(t, i, s), s;
}, io = (e, t, i) => t.has(e) || cr("Cannot " + i), Ze = (e, t, i) => (io(e, t, "read from private field"), i ? i.call(e) : t.get(e)), oa = (e, t, i) => t.has(e) ? cr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ko = (e, t, i, a) => (io(e, t, "write to private field"), t.set(e, i), i), Vt = (e, t, i) => (io(e, t, "access private method"), i), ma, Gt, ci, at, Pa, ks, ur;
let Be = class extends N {
  constructor() {
    super(), oa(this, at), oa(this, ma), oa(this, Gt), this._loading = !0, this._busy = !1, oa(this, ci, () => {
      var e;
      return (e = Ze(this, ma)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ge, (e) => {
      Ko(this, Gt, e);
    }), this.consumeContext(Ve, (e) => {
      Ko(this, ma, e), e && Vt(this, at, Pa).call(this);
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

        ${Vt(this, at, ur).call(this)}
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
      Sn(Ze(this, ci)).catch(() => {
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
    const s = e === "export" ? await Cn(Ze(this, ci)) : await Tn(Ze(this, ci));
    (t = Ze(this, Gt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Ze(this, Gt)) == null || i.peek("warning", { data: { message: o } });
    await Vt(this, at, Pa).call(this);
  } catch (s) {
    (a = Ze(this, Gt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
ur = function() {
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
const xu = Be, ku = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Be;
  },
  default: xu
}, Symbol.toStringTag, { value: "Module" })), hr = 3, dr = 12, pr = 0.1, mr = 0.9;
function Su(e) {
  return Math.max(hr, Math.min(dr, e));
}
function Cu(e) {
  return Math.max(pr, Math.min(mr, e));
}
function Tu(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Su(t), s = 0.5 * Cu(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let d = 0; d < o; d++) {
    const f = (-90 + d * n) * Math.PI / 180, S = e === "star" && d % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + S * Math.cos(f), y: 0.5 + S * Math.sin(f) });
  }
  return l;
}
function Eu(e, t, i) {
  const a = Tu(e, t, i);
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
  sides: { min: hr, max: dr },
  innerRatio: { min: pr, max: mr }
}, Ma = { min: 0.1, max: 4 };
function Du(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function fr(e) {
  if (e.kind === "radial") {
    const t = Math.round(Vo(e.centreX ?? 0.5) * 100), i = Math.round(Vo(e.centreY ?? 0.5) * 100);
    return `radial-gradient(ellipse farthest-corner at ${t}% ${i}%, ${e.from}, ${e.to})`;
  }
  return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
}
function Vo(e) {
  return Math.min(1, Math.max(0, e));
}
const ao = I`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Pu(e, t) {
  const i = [], a = t.lockX ? void 0 : Go(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Mu(t),
    t.threshold
  ), s = t.lockY ? void 0 : Go(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    zu(t),
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
function Mu(e) {
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
function zu(e) {
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
function Go(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var Ou = Object.defineProperty, Iu = Object.getOwnPropertyDescriptor, gr = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Iu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ou(t, i, s), s;
}, so = (e, t, i) => t.has(e) || gr("Cannot " + i), ye = (e, t, i) => (so(e, t, "read from private field"), i ? i.call(e) : t.get(e)), os = (e, t, i) => t.has(e) ? gr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ns = (e, t, i, a) => (so(e, t, "write to private field"), t.set(e, i), i), j = (e, t, i) => (so(e, t, "access private method"), i), gt, _i, M, qa, oo, yr, vr, br, _r, no, za, wr, $r, xr, kr, Sr, Cr, Tr, Er, Dr;
const Au = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], rs = 18;
let we = class extends N {
  constructor() {
    super(...arguments), os(this, M), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, os(this, gt), os(this, _i);
  }
  willUpdate() {
    this._box = j(this, M, yr).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ye(this, _i) && ((t = ye(this, gt)) == null || t.disconnect(), ns(this, _i, e), e && (ye(this, gt) ?? ns(this, gt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ye(this, gt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ye(this, gt)) == null || e.disconnect(), ns(this, _i, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${en({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${V({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ye(this, M, vr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...j(this, M, no).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      j(this, M, wr).call(this, t), j(this, M, za).call(this, t);
    }}>
        ${j(this, M, $r).call(this)}
      </div>

      ${this.selected ? j(this, M, Er).call(this, e) : p}
      ${this.showMeasured && this.measured ? j(this, M, Dr).call(this) : p}
    `;
  }
};
gt = /* @__PURE__ */ new WeakMap();
_i = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
qa = function() {
  return this.resolvedPosition ?? this.layer.position;
};
oo = function() {
  return this.layer.rotation ?? 0;
};
yr = function() {
  var s;
  const e = this.layer, t = e.size.width ?? j(this, M, br).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? j(this, M, _r).call(this), a = ja(ye(this, M, qa), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
vr = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
br = function() {
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
_r = function() {
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
no = function(e) {
  const t = ye(this, M, oo);
  if (t === 0) return {};
  const i = ye(this, M, qa);
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
wr = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
$r = function() {
  switch (this.layer.type) {
    case "text":
      return j(this, M, xr).call(this);
    case "image":
      return j(this, M, Sr).call(this);
    case "badges":
      return j(this, M, Cr).call(this);
    default:
      return j(this, M, Tr).call(this);
  }
};
xr = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || j(this, M, kr).call(this);
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
kr = function() {
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
Sr = function() {
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
Cr = function() {
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
    Array.from({ length: Math.max(1, a) }, (S, X) => X),
    (S) => S,
    () => r`
            <div class=${en({ badge: !0, right: f === "right" })}>
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
Tr = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? fr(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
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
  const n = Eu(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${V({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${V({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
Er = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = ye(this, M, qa), n = ye(this, M, oo), l = De(this.layer.position, "x") || De(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${V({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...j(this, M, no).call(this, e) })}>
        <span
          class="tag"
          style=${V(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${B(
    Au,
    (d) => d,
    (d) => r`
                  <span
                    class="handle ${d}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${d}"
                    @pointerdown=${(f) => j(this, M, za).call(this, f, d)}>
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
                @pointerdown=${(d) => j(this, M, za).call(this, d, "rotate")}>
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
Dr = function() {
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
  m()
], we.prototype, "_box", 2);
we = He([
  R("di-layer-box")
], we);
var Lu = Object.defineProperty, Ru = Object.getOwnPropertyDescriptor, Pr = (e) => {
  throw TypeError(e);
}, ro = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ru(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Lu(t, i, s), s;
}, Wu = (e, t, i) => t.has(e) || Pr("Cannot " + i), Nu = (e, t, i) => t.has(e) ? Pr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Fu = (e, t, i) => (Wu(e, t, "access private method"), i), Ss, Mr;
let Mi = class extends N {
  constructor() {
    super(...arguments), Nu(this, Ss), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${B(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => Fu(this, Ss, Mr).call(this, e)
    )}`;
  }
};
Ss = /* @__PURE__ */ new WeakSet();
Mr = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Mi.styles = I`
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
ro([
  b({ type: Array })
], Mi.prototype, "guides", 2);
ro([
  b({ type: Number })
], Mi.prototype, "scale", 2);
Mi = ro([
  R("di-guides")
], Mi);
var Uu = Object.defineProperty, Bu = Object.getOwnPropertyDescriptor, zr = (e) => {
  throw TypeError(e);
}, qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Uu(t, i, s), s;
}, Ku = (e, t, i) => t.has(e) || zr("Cannot " + i), Vu = (e, t, i) => t.has(e) ? zr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ho = (e, t, i) => (Ku(e, t, "access private method"), i), fa, Cs;
let q = class extends N {
  constructor() {
    super(...arguments), Vu(this, fa), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Ho(this, fa, Cs).call(this, "top"), Ho(this, fa, Cs).call(this, "left");
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
Cs = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : q.thickness) * o, t.height = (e === "top" ? q.thickness : s) * o, t.style.width = `${e === "top" ? s : q.thickness}px`, t.style.height = `${e === "top" ? q.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const d = Math.round(l * this.scale) + 0.5, f = l % 100 === 0, S = f ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(d, q.thickness - S), i.lineTo(d, q.thickness)) : (i.moveTo(q.thickness - S, d), i.lineTo(q.thickness, d)), i.stroke(), f && l > 0 && (e === "top" ? i.fillText(String(l), d + 2, 9) : (i.save(), i.translate(9, d - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
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
var Gu = Object.defineProperty, Hu = Object.getOwnPropertyDescriptor, Or = (e) => {
  throw TypeError(e);
}, oe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Hu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gu(t, i, s), s;
}, lo = (e, t, i) => t.has(e) || Or("Cannot " + i), A = (e, t, i) => (lo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ne = (e, t, i) => t.has(e) ? Or("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ga = (e, t, i, a) => (lo(e, t, "write to private field"), t.set(e, i), i), P = (e, t, i) => (lo(e, t, "access private method"), i), yt, wi, ot, T, co, Ts, Es, Ja, uo, Ds, Ir, Ar, ho, Lr, Rr, Ps, ya, Wr, Nr, Ft, po, Ms, zs, Os, Fr, Is, As, Ls, Ur;
const ju = 6, Br = 20, Xu = 2, Yu = 15, qu = 0.1;
let ee = class extends N {
  constructor() {
    super(...arguments), ne(this, T), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ne(this, yt), ne(this, wi), ne(this, ot, /* @__PURE__ */ new Map()), ne(this, Ps, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = P(this, T, uo).call(this, t), a = P(this, T, Ds).call(this, t), s = P(this, T, Ir).call(this, t), o = P(this, T, Ja).call(this, e.detail.startX, e.detail.startY);
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
      var ia, Oo;
      this._pointer = P(this, T, Es).call(this, e.clientX, e.clientY);
      const t = A(this, yt);
      if (!t) return;
      const i = this.template.layers.find((fi) => fi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        P(this, T, Nr).call(this, i, t, e);
        return;
      }
      const o = De(i.position, "x"), n = De(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        P(this, T, Wr).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let d = t.handle ? P(this, T, po).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (d = { ...d, x: t.startBox.x, width: (ia = t.handle) != null && ia.includes("w") ? t.startBox.width : d.width }), n && (d = { ...d, y: t.startBox.y, height: (Oo = t.handle) != null && Oo.includes("n") ? t.startBox.height : d.height });
      const f = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, S = l !== 0 ? { x: d.x + f.x, y: d.y + f.y, width: t.startExtent.width, height: t.startExtent.height } : d, xe = this.snapEnabled && !e.altKey ? Pu(S, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((fi) => fi.key !== i.key).map((fi) => P(this, T, Ds).call(this, fi)),
        threshold: ju / this.scale,
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
      this._guides = xe.guides;
      const ze = l !== 0 ? { ...d, x: xe.box.x - f.x, y: xe.box.y - f.y } : xe.box, qe = Nc(ze, i.position);
      o && (qe.x = i.position.x), n && (qe.y = i.position.y);
      const Oe = { position: qe };
      t.handle && (Oe.size = {
        width: Math.max(1, Math.round(ze.width)),
        height: Math.max(1, Math.round(ze.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Oe } })
      );
    }), ne(this, Ft, () => {
      if (!A(this, yt)) return;
      const e = A(this, yt).moved;
      ga(this, yt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ne(this, Ms, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ne(this, zs, () => {
      this._dropTarget = !1;
    }), ne(this, Os, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = P(this, T, Es).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: P(this, T, Fr).call(this, e) }
        })
      );
    }), ne(this, Is, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ne(this, As, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Ln(t.position)) && this.requestUpdate();
    }), ne(this, Ls, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), ga(this, wi, new ResizeObserver(() => P(this, T, Ts).call(this))), A(this, wi).observe(this), window.addEventListener("pointermove", A(this, ya)), window.addEventListener("pointerup", A(this, Ft)), window.addEventListener("pointercancel", A(this, Ft));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = A(this, wi)) == null || e.disconnect(), window.removeEventListener("pointermove", A(this, ya)), window.removeEventListener("pointerup", A(this, Ft)), window.removeEventListener("pointercancel", A(this, Ft));
  }
  updated(e) {
    P(this, T, Ts).call(this), e.has("zoom") && P(this, T, co).call(this);
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
    P(this, T, Ar).call(this);
    const s = this.showRulers ? Br : 0;
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
      background: e.backgroundGradient ? fr(e.backgroundGradient) : e.background
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

            ${this.showSafeArea ? P(this, T, Ur).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
yt = /* @__PURE__ */ new WeakMap();
wi = /* @__PURE__ */ new WeakMap();
ot = /* @__PURE__ */ new WeakMap();
T = /* @__PURE__ */ new WeakSet();
co = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Ts = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Br : 0) + Xu, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, P(this, T, co).call(this));
};
Es = function(e, t) {
  const i = P(this, T, Ja).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Ja = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
uo = function(e) {
  const t = A(this, ot).get(e.key);
  if (t) return t.box;
  const i = P(this, T, ho).call(this, e), a = ja(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Ds = function(e) {
  const t = A(this, ot).get(e.key);
  return t ? t.extent : An(P(this, T, uo).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Ir = function(e) {
  var t;
  return ((t = A(this, ot).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Ar = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  ga(this, ot, Gc(
    this.template.layers,
    (i) => P(this, T, ho).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
ho = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? P(this, T, Lr).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? P(this, T, Rr).call(this, e, i)
  };
};
Lr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Rr = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Ps = /* @__PURE__ */ new WeakMap();
ya = /* @__PURE__ */ new WeakMap();
Wr = function(e, t, i, a, s, o, n, l) {
  const d = t.startRotation, f = t.startPosition, S = Fc(a, s, 0, 0, d);
  let X = P(this, T, po).call(this, t.startBox, i, S.x, S.y, o);
  n && (X = { ...X, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : X.width }), l && (X = { ...X, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : X.height });
  const xe = Math.max(1, Math.round(X.width)), ze = Math.max(1, Math.round(X.height)), qe = qs(X.x, X.y, xe, ze, f.anchor), Oe = Bt(qe.x, qe.y, f.x, f.y, d), ia = {
    ...e.position,
    x: n ? e.position.x : Math.round(Oe.x),
    y: l ? e.position.y : Math.round(Oe.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: ia, size: { width: xe, height: ze } } }
    })
  );
};
Nr = function(e, t, i) {
  const a = t.startPosition, s = P(this, T, Ja).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, d = i.shiftKey ? Yu : qu, f = In(Math.round(l / d) * d);
  this._guides = [], f !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: f } }
    })
  );
};
Ft = /* @__PURE__ */ new WeakMap();
po = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: d } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, d = e.height - a), t.includes("s") && (d = e.height + a), s && e.width > 0 && e.height > 0) {
    const f = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(d - e.height) ? d = l / f : l = d * f, t.includes("n") && (n = e.y + e.height - d), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, d) };
};
Ms = /* @__PURE__ */ new WeakMap();
zs = /* @__PURE__ */ new WeakMap();
Os = /* @__PURE__ */ new WeakMap();
Fr = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Is = /* @__PURE__ */ new WeakMap();
As = /* @__PURE__ */ new WeakMap();
Ls = /* @__PURE__ */ new WeakMap();
Ur = function() {
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
      ${ao}
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
], ee.prototype, "template", 2);
oe([
  b({ type: String })
], ee.prototype, "selectedLayerKey", 2);
oe([
  b({ type: Object })
], ee.prototype, "baseImageUrl", 2);
oe([
  b({ type: Array })
], ee.prototype, "serverBounds", 2);
oe([
  b({ type: Boolean })
], ee.prototype, "showMeasured", 2);
oe([
  b({ type: Boolean })
], ee.prototype, "snapEnabled", 2);
oe([
  b({ type: Boolean })
], ee.prototype, "showRulers", 2);
oe([
  b({ type: Boolean })
], ee.prototype, "showSafeArea", 2);
oe([
  b({ type: Number })
], ee.prototype, "zoom", 2);
oe([
  m()
], ee.prototype, "_fitScale", 2);
oe([
  m()
], ee.prototype, "_guides", 2);
oe([
  m()
], ee.prototype, "_pointer", 2);
oe([
  m()
], ee.prototype, "_dropTarget", 2);
ee = oe([
  R("di-designer-canvas")
], ee);
var Ju = Object.defineProperty, Zu = Object.getOwnPropertyDescriptor, Kr = (e) => {
  throw TypeError(e);
}, mo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ju(t, i, s), s;
}, Vr = (e, t, i) => t.has(e) || Kr("Cannot " + i), Qu = (e, t, i) => (Vr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), eh = (e, t, i) => t.has(e) ? Kr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Te = (e, t, i) => (Vr(e, t, "access private method"), i), ce, Gr, Hr, jr, Xr, Yr, bt;
const jo = {
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
    super(...arguments), eh(this, ce), this.properties = [], this._search = "";
  }
  render() {
    const e = th(Qu(this, ce, Gr));
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
      ([t, i]) => Te(this, ce, Xr).call(this, t, i)
    )}

        ${Te(this, ce, Yr).call(this)}
      </div>
    `;
  }
};
ce = /* @__PURE__ */ new WeakSet();
Gr = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Hr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
jr = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Xr = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${B(
    t,
    (i) => i.alias,
    (i) => Te(this, ce, bt).call(
      this,
      i.name,
      jo[i.classification] ?? jo.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Yr = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Te(this, ce, bt).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Te(this, ce, bt).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Te(this, ce, bt).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Te(this, ce, bt).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Te(this, ce, bt).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
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
        @dragstart=${(n) => Te(this, ce, jr).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => Te(this, ce, Hr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
zi.styles = I`
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
mo([
  b({ type: Array })
], zi.prototype, "properties", 2);
mo([
  m()
], zi.prototype, "_search", 2);
zi = mo([
  R("di-property-palette")
], zi);
function th(e) {
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
function ih(e) {
  return e.backgroundGradient ? "gradient" : ah(e.background) ? "transparent" : "colour";
}
function ah(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function sh(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var oh = Object.defineProperty, nh = Object.getOwnPropertyDescriptor, qr = (e) => {
  throw TypeError(e);
}, Za = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && oh(t, i, s), s;
}, Jr = (e, t, i) => t.has(e) || qr("Cannot " + i), Qe = (e, t, i) => (Jr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), rh = (e, t, i) => t.has(e) ? qr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xi = (e, t, i) => (Jr(e, t, "access private method"), i), ae, Oi, ki, Qa, Zr, Qr;
let ui = class extends N {
  constructor() {
    super(...arguments), rh(this, ae), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Qe(this, ae, Oi)};opacity:${Qe(this, ae, ki)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => xi(this, ae, Qa).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Qe(this, ae, Oi)}
                  @input=${(e) => xi(this, ae, Zr).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Qe(this, ae, ki))}
                    @input=${(e) => xi(this, ae, Qr).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Qe(this, ae, ki) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
ae = /* @__PURE__ */ new WeakSet();
Oi = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
ki = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
Qa = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Zr = function(e) {
  const t = Qe(this, ae, ki);
  xi(this, ae, Qa).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${el(t)}`);
};
Qr = function(e) {
  xi(this, ae, Qa).call(this, e >= 0.999 ? Qe(this, ae, Oi).toUpperCase() : `${Qe(this, ae, Oi).toUpperCase()}${el(e)}`);
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
const el = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var lh = Object.defineProperty, ch = Object.getOwnPropertyDescriptor, tl = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ch(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && lh(t, i, s), s;
};
const Xo = {
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
      On,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Xo[e]}
              title=${Xo[e]}
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
tl([
  b({ type: String })
], Oa.prototype, "value", 2);
Oa = tl([
  R("di-anchor-picker")
], Oa);
var uh = Object.defineProperty, hh = Object.getOwnPropertyDescriptor, il = (e) => {
  throw TypeError(e);
}, dt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && uh(t, i, s), s;
}, dh = (e, t, i) => t.has(e) || il("Cannot " + i), ph = (e, t, i) => t.has(e) ? il("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), mh = (e, t, i) => (dh(e, t, "access private method"), i), Rs, al;
let Me = class extends N {
  constructor() {
    super(...arguments), ph(this, Rs), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${mh(this, Rs, al)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
Rs = /* @__PURE__ */ new WeakSet();
al = function(e) {
  const t = e.target, i = t.value, a = Du(i, this.min, this.max);
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
dt([
  b({ type: Number })
], Me.prototype, "value", 2);
dt([
  b({ type: String })
], Me.prototype, "label", 2);
dt([
  b({ type: String })
], Me.prototype, "suffix", 2);
dt([
  b({ type: Number })
], Me.prototype, "step", 2);
dt([
  b({ type: Number })
], Me.prototype, "min", 2);
dt([
  b({ type: Number })
], Me.prototype, "max", 2);
dt([
  b({ type: String })
], Me.prototype, "placeholder", 2);
Me = dt([
  R("di-number-field")
], Me);
var fh = Object.defineProperty, gh = Object.getOwnPropertyDescriptor, sl = (e) => {
  throw TypeError(e);
}, Ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && fh(t, i, s), s;
}, yh = (e, t, i) => t.has(e) || sl("Cannot " + i), vh = (e, t, i) => t.has(e) ? sl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (yh(e, t, "access private method"), i), u, v, ve, ol, nl, rl, fo, Ws, ll, cl, ul, hl, dl, pl, ml, Ns, fl, va, gl, yl, mi, go, vl;
let It = class extends N {
  constructor() {
    super(...arguments), vh(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, u, ll).call(this, this.layer) : h(this, u, ol).call(this)}</div>` : p;
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
ve = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
ol = function() {
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

        ${h(this, u, nl).call(this, e)}

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${bl(e.baseImage.kind)}
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
              ${h(this, u, mi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, u, ve).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
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
nl = function(e) {
  const t = ih(e);
  return r`
      <label class="field">
        <span>Fill</span>
        <uui-select
          .value=${t}
          .options=${Q(["colour", "gradient", "transparent"], t)}
          @change=${(i) => h(this, u, rl).call(this, e, i.target.value)}>
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

      ${t === "gradient" && e.backgroundGradient ? h(this, u, fo).call(this, e.backgroundGradient, (i) => h(this, u, ve).call(this, { backgroundGradient: i })) : p}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : p}
    `;
};
rl = function(e, t) {
  if (t === "gradient") {
    h(this, u, ve).call(this, { backgroundGradient: e.backgroundGradient ?? zn() });
    return;
  }
  h(this, u, ve).call(this, {
    background: sh(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
fo = function(e, t) {
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
ll = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, u, v).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, u, cl).call(this, e) : p}
      ${e.type === "text" ? h(this, u, ul).call(this, e) : p}
      ${e.type === "image" ? h(this, u, hl).call(this, e) : p}
      ${e.type === "badges" ? h(this, u, dl).call(this, e) : p}
      ${e.type === "rect" ? h(this, u, pl).call(this, e) : p}
      ${h(this, u, ml).call(this, e)} ${h(this, u, yl).call(this, e)}
    `;
};
cl = function(e) {
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
              ${h(this, u, mi).call(this, t.propertyAlias ?? "", (i) => h(this, u, v).call(this, { binding: { ...t, propertyAlias: i } }))}
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
ul = function(e) {
  const t = e.style, i = (a) => h(this, u, v).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, u, go).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, u, vl).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
hl = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${bl(t.kind)}
            @change=${(a) => h(this, u, v).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, mi).call(this, t.propertyAlias ?? "", (a) => h(this, u, v).call(this, { source: { ...t, propertyAlias: a } }), "media")}
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
    var o;
    const s = a.detail.value ?? 0;
    h(this, u, v).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
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
dl = function(e) {
  const t = (s) => h(this, u, v).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, u, v).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, u, v).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, u, mi).call(this, e.itemsPropertyAlias, (s) => h(this, u, v).call(this, { itemsPropertyAlias: s }))}
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
                  .options=${h(this, u, go).call(this, e.label.fontKey)}
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
pl = function(e) {
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
    gradient: s.target.checked ? zn() : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? h(this, u, fo).call(this, e.gradient, (s) => h(this, u, v).call(this, { gradient: s })) : p}

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
    var n;
    const o = s.detail.value ?? 0;
    h(this, u, v).call(this, {
      border: o > 0 ? { width: o, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
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
ml = function(e) {
  const t = De(e.position, "x"), i = De(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, u, Ns).call(this, e, "x")} ${h(this, u, Ns).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, u, gl).call(this, e, s.detail.value)}>
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
            @change=${(s) => h(this, u, v).call(this, { rotation: In(s.detail.value ?? 0) })}>
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
  const i = De(e.position, t), a = Ca(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => h(this, u, fl).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => h(this, u, va).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${Q(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => h(this, u, va).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${g.referenceGap.min}
                .max=${g.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => h(this, u, va).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? g.x.min : g.y.min}
                .max=${t === "x" ? g.x.max : g.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => h(this, u, v).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
fl = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (De(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && h(this, u, v).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Uc
      }
    }
  });
};
va = function(e, t, i) {
  const a = Ca(e.position, t);
  a && h(this, u, v).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
gl = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? Wc(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, u, v).call(this, { position: s });
};
yl = function(e) {
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
              ${h(this, u, mi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, u, v).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
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
go = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
vl = function(e, t, i) {
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
function bl(e) {
  return Q(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var bh = Object.defineProperty, _h = Object.getOwnPropertyDescriptor, _l = (e) => {
  throw TypeError(e);
}, Zi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? _h(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && bh(t, i, s), s;
}, wh = (e, t, i) => t.has(e) || _l("Cannot " + i), $h = (e, t, i) => t.has(e) ? _l("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ke = (e, t, i) => (wh(e, t, "access private method"), i), de, _t, wl, $l, xl, kl;
const xh = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let At = class extends N {
  constructor() {
    super(...arguments), $h(this, de), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${ke(this, de, xl)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : B(
      e,
      (t) => t.key,
      (t, i) => ke(this, de, kl).call(this, t, i)
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
wl = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
$l = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
xl = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  ke(this, de, _t).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
kl = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => ke(this, de, wl).call(this, a, e.key)}
        @dragover=${(a) => ke(this, de, $l).call(this, a, t)}
        @click=${() => ke(this, de, _t).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${xh[e.type]}></uui-icon>
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
var kh = Object.defineProperty, Sh = Object.getOwnPropertyDescriptor, Sl = (e) => {
  throw TypeError(e);
}, je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Sh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && kh(t, i, s), s;
}, yo = (e, t, i) => t.has(e) || Sl("Cannot " + i), Ch = (e, t, i) => (yo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Yo = (e, t, i) => t.has(e) ? Sl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Th = (e, t, i, a) => (yo(e, t, "write to private field"), t.set(e, i), i), se = (e, t, i) => (yo(e, t, "access private method"), i), Y, Ae, Ia, Cl, Tl, $i;
let $e = class extends N {
  constructor() {
    super(...arguments), Yo(this, Y), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Yo(this, Ia, 100);
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
            @click=${() => se(this, Y, Ae).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${Ma.min * 100}
            .max=${Ma.max * 100}
            .value=${se(this, Y, Cl).call(this)}
            @change=${se(this, Y, Tl)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => se(this, Y, Ae).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => se(this, Y, Ae).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${se(this, Y, $i).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${se(this, Y, $i).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${se(this, Y, $i).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${se(this, Y, $i).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => se(this, Y, Ae).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => se(this, Y, Ae).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => se(this, Y, Ae).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
Y = /* @__PURE__ */ new WeakSet();
Ae = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Ia = /* @__PURE__ */ new WeakMap();
Cl = function() {
  return this.matches(":focus-within") || Th(this, Ia, Math.round(this.effectiveScale * 100)), Ch(this, Ia);
};
Tl = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && se(this, Y, Ae).call(this, "di-zoom-change", { zoom: t / 100 });
};
$i = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => se(this, Y, Ae).call(this, i)}>
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
  b({ type: Number })
], $e.prototype, "effectiveScale", 2);
je([
  b({ type: Boolean })
], $e.prototype, "snapEnabled", 2);
je([
  b({ type: Boolean })
], $e.prototype, "showRulers", 2);
je([
  b({ type: Boolean })
], $e.prototype, "showSafeArea", 2);
je([
  b({ type: Boolean })
], $e.prototype, "showMeasured", 2);
je([
  b({ type: Boolean })
], $e.prototype, "canUndo", 2);
je([
  b({ type: Boolean })
], $e.prototype, "canRedo", 2);
je([
  b({ type: Boolean })
], $e.prototype, "previewing", 2);
$e = je([
  R("di-canvas-toolbar")
], $e);
var Eh = Object.defineProperty, Dh = Object.getOwnPropertyDescriptor, El = (e) => {
  throw TypeError(e);
}, Qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Eh(t, i, s), s;
}, vo = (e, t, i) => t.has(e) || El("Cannot " + i), Z = (e, t, i) => (vo(e, t, "read from private field"), t.get(e)), pt = (e, t, i) => t.has(e) ? El("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Dt = (e, t, i, a) => (vo(e, t, "write to private field"), t.set(e, i), i), We = (e, t, i) => (vo(e, t, "access private method"), i), et, Ht, jt, Pt, Aa, La, be, bo, ba, _o, Fs;
const Ph = 400;
let Lt = class extends N {
  constructor() {
    super(), pt(this, be), pt(this, et), pt(this, Ht), pt(this, jt), pt(this, Pt), pt(this, Aa), pt(this, La, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(Wt, (e) => {
      Dt(this, et, e), e && (this.observe(e.template, (t) => {
        t && We(this, be, ba).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Dt(this, Aa, t);
        const i = (a = Z(this, et)) == null ? void 0 : a.getData();
        i && We(this, be, ba).call(this, i);
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
    e && (window.clearTimeout(Z(this, Ht)), this._collapsed = !1, We(this, be, _o).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(Z(this, Ht)), (e = Z(this, jt)) == null || e.abort(), We(this, be, bo).call(this);
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
        t && We(this, be, ba).call(this, t);
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
be = /* @__PURE__ */ new WeakSet();
bo = function() {
  Z(this, Pt) && (URL.revokeObjectURL(Z(this, Pt)), Dt(this, Pt, void 0));
};
ba = function(e) {
  this._collapsed || (window.clearTimeout(Z(this, Ht)), Dt(this, Ht, window.setTimeout(() => void We(this, be, _o).call(this, e), Ph)));
};
_o = async function(e) {
  var t;
  if (Z(this, et)) {
    (t = Z(this, jt)) == null || t.abort(), Dt(this, jt, new AbortController()), We(this, be, Fs).call(this, !0), this._error = void 0;
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
      We(this, be, bo).call(this), Dt(this, Pt, URL.createObjectURL(i)), this._url = Z(this, Pt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      We(this, be, Fs).call(this, !1);
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
      ${ao}
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
var Mh = Object.defineProperty, zh = Object.getOwnPropertyDescriptor, Dl = (e) => {
  throw TypeError(e);
}, te = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Mh(t, i, s), s;
}, wo = (e, t, i) => t.has(e) || Dl("Cannot " + i), y = (e, t, i) => (wo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), mt = (e, t, i) => t.has(e) ? Dl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Si = (e, t, i, a) => (wo(e, t, "write to private field"), t.set(e, i), i), ie = (e, t, i) => (wo(e, t, "access private method"), i), $, Ii, Ai, Li, Xt, W, Us, $o, Pl, Ml, Bs, zl, Ol, Il, Ks, Al, Ll, Rl, Wl, xo, Nl, _a;
const Oh = 400;
let U = class extends N {
  constructor() {
    super(), mt(this, W), mt(this, $), mt(this, Ii), mt(this, Ai), mt(this, Li), mt(this, Xt), this._properties = [], this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, mt(this, _a, (e) => {
      var o;
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
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, d = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, f = De(s.position, "x") ? 0 : l, S = De(s.position, "y") ? 0 : d;
            if (f === 0 && S === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + f, y: s.position.y + S }
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
    }), this.consumeContext(Fa, (e) => {
      Si(this, Ii, e);
    }), this.consumeContext(Ge, (e) => {
      Si(this, Ai, e);
    }), this.consumeContext(Wt, (e) => {
      Si(this, $, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (ie(this, W, zl).call(this, t), ie(this, W, Ol).call(this, t), ie(this, W, Il).call(this));
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
    super.disconnectedCallback(), window.removeEventListener("keydown", y(this, _a)), window.clearTimeout(y(this, Li)), (e = y(this, Xt)) == null || e.abort();
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
        @di-layer-detach=${(e) => ie(this, W, Ml).call(this, e.detail.key, e.detail.axis)}
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
        @di-pick-base-image=${ie(this, W, Rl)}
        @di-pick-layer-image=${(e) => ie(this, W, Wl).call(this, e.detail.key)}
        @di-use-image-size=${ie(this, W, Nl)}
        @di-request-preview=${() => {
      var e;
      return (e = y(this, W, Pl)) == null ? void 0 : e.refresh();
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
Ii = /* @__PURE__ */ new WeakMap();
Ai = /* @__PURE__ */ new WeakMap();
Li = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakSet();
Us = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
$o = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Pl = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Ml = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = y(this, W, $o)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = y(this, $)) == null || n.updateLayer(e, { position: fs(i.position, t, a) });
};
Bs = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = y(this, W, $o)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = y(this, $)) == null || s.removeLayer(e, t);
};
zl = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && y(this, $) && await er(t, y(this, $).getToken);
};
Ol = async function(e) {
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
Il = function() {
  window.clearTimeout(y(this, Li)), Si(this, Li, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !y(this, $))) {
      (t = y(this, Xt)) == null || t.abort(), Si(this, Xt, new AbortController());
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
  }, Oh));
};
Ks = function(e, t, i, a) {
  const s = this._template;
  if (!s || !y(this, $)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: ie(this, W, Ll).call(this) };
  if (e.kind === "property") {
    const l = Ac(e.property, o);
    if (l.kind === "condition") {
      ie(this, W, Al).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    y(this, $).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? Pn(o, "Image") : e.layerType === "badges" ? Mn(o, "Badges", "") : e.layerType === "rect" ? Oc(o, "Shape", e.shape) : Dn(o, "Text", { kind: "static", text: "Text" });
  y(this, $).addLayer(n);
};
Al = function(e, t, i) {
  var o, n, l, d;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((f) => f.key === a);
  if (!s) {
    (n = y(this, Ai)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = y(this, $)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (d = y(this, Ai)) == null || d.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
Ll = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Rl = async function() {
  var t;
  const e = await ie(this, W, xo).call(this);
  e && ((t = y(this, $)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
Wl = async function(e) {
  var i;
  const t = await ie(this, W, xo).call(this);
  t && ((i = y(this, $)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
xo = async function() {
  if (!y(this, Ii)) return;
  const e = y(this, Ii).open(this, sn, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
Nl = async function() {
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
const Ih = U, Ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return U;
  },
  default: Ih
}, Symbol.toStringTag, { value: "Module" }));
var Lh = Object.defineProperty, Rh = Object.getOwnPropertyDescriptor, Fl = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Lh(t, i, s), s;
}, ko = (e, t, i) => t.has(e) || Fl("Cannot " + i), K = (e, t, i) => (ko(e, t, "read from private field"), t.get(e)), Nt = (e, t, i) => t.has(e) ? Fl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Yt = (e, t, i, a) => (ko(e, t, "write to private field"), t.set(e, i), i), J = (e, t, i) => (ko(e, t, "access private method"), i), pe, Ri, Wi, qt, Mt, G, Ul, Ra, Bl, Kl, So, Vl, Ni, Gl, Hl, jl;
let ue = class extends N {
  constructor() {
    super(), Nt(this, G), Nt(this, pe), Nt(this, Ri), Nt(this, Wi), Nt(this, qt), Nt(this, Mt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Fa, (e) => {
      Yt(this, Ri, e);
    }), this.consumeContext(Ge, (e) => {
      Yt(this, Wi, e);
    }), this.consumeContext(Wt, (e) => {
      Yt(this, pe, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && J(this, G, Ul).call(this);
      });
    });
  }
  connectedCallback() {
    super.connectedCallback(), J(this, G, Ni).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = K(this, qt)) == null || e.abort(), J(this, G, So).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${J(this, G, Vl)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => J(this, G, Ni).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${J(this, G, Hl)}>
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
      (e) => J(this, G, jl).call(this, e)
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
                @click=${J(this, G, Gl)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
pe = /* @__PURE__ */ new WeakMap();
Ri = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
qt = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
G = /* @__PURE__ */ new WeakSet();
Ul = async function() {
  var t;
  const e = J(this, G, Bl).call(this);
  e && (this._sampleNode = e, (t = K(this, pe)) == null || t.setSampleContentKey(e.key), await J(this, G, Ni).call(this));
};
Ra = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
Bl = function() {
  try {
    const e = localStorage.getItem(J(this, G, Ra).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
Kl = function(e) {
  try {
    e ? localStorage.setItem(J(this, G, Ra).call(this), JSON.stringify(e)) : localStorage.removeItem(J(this, G, Ra).call(this));
  } catch {
  }
};
So = function() {
  K(this, Mt) && (URL.revokeObjectURL(K(this, Mt)), Yt(this, Mt, void 0));
};
Vl = async function() {
  var i, a, s;
  if (!K(this, Ri) || !this._template) return;
  const e = K(this, Ri).open(this, pu, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, J(this, G, Kl).call(this, t.item), (s = K(this, pe)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await J(this, G, Ni).call(this));
};
Ni = async function() {
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
      js(e, t, K(this, pe).getToken),
      Xs(e, t, K(this, pe).getToken)
    ]);
    J(this, G, So).call(this), Yt(this, Mt, URL.createObjectURL(s)), this._url = K(this, Mt), this._bounds = o.layers, this._skipped = o.skipped ?? [], K(this, pe).setServerBounds(o.layers), K(this, pe).setIssues(o.issues);
  } catch (s) {
    if ((s == null ? void 0 : s.name) === "AbortError") return;
    this._error = s instanceof Error ? s.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Gl = async function() {
  var e, t;
  if (!(!this._sampleNode || !K(this, pe))) {
    this._regenerating = !0;
    try {
      const i = await Ba(this._sampleNode.key, K(this, pe).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = K(this, Wi)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? `'${this._sampleNode.name}': ${i.outcome}` }
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
Hl = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
jl = function(e) {
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
      ${ao}
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
const Wh = ue, Nh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return ue;
  },
  default: Wh
}, Symbol.toStringTag, { value: "Module" }));
var Fh = Object.defineProperty, Uh = Object.getOwnPropertyDescriptor, Xl = (e) => {
  throw TypeError(e);
}, es = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Uh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Fh(t, i, s), s;
}, Co = (e, t, i) => t.has(e) || Xl("Cannot " + i), F = (e, t, i) => (Co(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ls = (e, t, i) => t.has(e) ? Xl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qo = (e, t, i, a) => (Co(e, t, "write to private field"), t.set(e, i), i), st = (e, t, i) => (Co(e, t, "access private method"), i), H, Rt, _e, Yl, ql, Jl, Zl, Ql, ec, tc, ic, ac;
let ct = class extends N {
  constructor() {
    super(), ls(this, _e), ls(this, H), ls(this, Rt), this._properties = [], this._showAdvanced = !1, this.consumeContext(Fa, (e) => {
      qo(this, Rt, e);
    }), this.consumeContext(Wt, (e) => {
      qo(this, H, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${st(this, _e, ec).call(this)} ${st(this, _e, tc).call(this)} ${st(this, _e, ic).call(this)} ${st(this, _e, ac).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
H = /* @__PURE__ */ new WeakMap();
Rt = /* @__PURE__ */ new WeakMap();
_e = /* @__PURE__ */ new WeakSet();
Yl = function() {
  return this._properties.filter((e) => e.classification === "media");
};
ql = async function() {
  var a, s;
  if (!F(this, Rt) || !this._template) return;
  const e = F(this, Rt).open(this, bc, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await st(this, _e, Jl).call(this, t.selection.filter((o) => !!o));
  (a = F(this, H)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = F(this, H)) == null ? void 0 : s.reloadProperties());
};
Jl = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => zc), i = await t(F(this, H).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
Zl = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = F(this, H)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = F(this, H)) == null || s.reloadProperties();
};
Ql = async function() {
  var i;
  if (!F(this, Rt)) return;
  const e = F(this, Rt).open(this, sn, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = F(this, H)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
ec = function() {
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
                          @click=${() => st(this, _e, Zl).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${st(this, _e, ql)}>
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
    ...F(this, _e, Yl).map((t) => ({
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
tc = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${st(this, _e, Ql)}>Choose</uui-button>
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
ic = function() {
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
ac = function() {
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
const Bh = ct, Kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return ct;
  },
  default: Bh
}, Symbol.toStringTag, { value: "Module" }));
var Vh = Object.defineProperty, Gh = Object.getOwnPropertyDescriptor, sc = (e) => {
  throw TypeError(e);
}, ea = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Vh(t, i, s), s;
}, To = (e, t, i) => t.has(e) || sc("Cannot " + i), Jo = (e, t, i) => (To(e, t, "read from private field"), t.get(e)), Zo = (e, t, i) => t.has(e) ? sc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Hh = (e, t, i, a) => (To(e, t, "write to private field"), t.set(e, i), i), Qo = (e, t, i) => (To(e, t, "access private method"), i), Fi, wa, Vs;
let Ke = class extends N {
  constructor() {
    super(), Zo(this, wa), Zo(this, Fi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Wt, (e) => {
      Hh(this, Fi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Qo(this, wa, Vs).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Qo(this, wa, Vs).call(this)}>Reload</uui-button>
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
Fi = /* @__PURE__ */ new WeakMap();
wa = /* @__PURE__ */ new WeakSet();
Vs = async function() {
  const e = this._template;
  if (!(!e || !Jo(this, Fi))) {
    this._loading = !0;
    try {
      this._usage = await kn(e.key, Jo(this, Fi).getToken);
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
const jh = Ke, Xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Ke;
  },
  default: jh
}, Symbol.toStringTag, { value: "Module" })), Yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ao,
  default: Ao
}, Symbol.toStringTag, { value: "Module" })), qh = 1500;
var fe, Tt, Na, oc;
class cs extends $c {
  constructor(i, a) {
    super(i, a);
    w(this, Na);
    w(this, fe);
    w(this, Tt);
    this.consumeContext(Ge, (s) => {
      _(this, fe, s);
    }), this.consumeContext(Wt, (s) => {
      _(this, Tt, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, Tt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, fe)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await Gs(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await wn(a.key, !1, i.getToken);
        (o = c(this, fe)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await D(this, Na, oc).call(this, l, i);
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
    c(this, Tt) && await xn(i, c(this, Tt).getToken);
  }
}
fe = new WeakMap(), Tt = new WeakMap(), Na = new WeakSet(), oc = async function(i, a) {
  var o, n, l, d;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((f) => setTimeout(f, qh));
    try {
      s = await $n(s.id, a.getToken);
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
    for (const S of s.failures.slice(0, 3))
      (l = c(this, fe)) == null || l.peek("danger", { data: { message: S } });
  } else
    (d = c(this, fe)) == null || d.peek("danger", {
      data: { headline: `Regeneration ${s.status}`, message: s.failures[0] ?? "" }
    });
};
const Jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: cs,
  api: cs,
  default: cs
}, Symbol.toStringTag, { value: "Module" }));
var Ki, ni;
class us extends Sc {
  constructor(i, a) {
    super(i, a);
    w(this, Ki);
    w(this, ni);
    this.consumeContext(Ve, (s) => {
      _(this, Ki, s);
    }), this.consumeContext(Ge, (s) => {
      _(this, ni, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Ba(i, () => {
          var l;
          return (l = c(this, Ki)) == null ? void 0 : l.getLatestToken();
        }), n = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = c(this, ni)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
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
Ki = new WeakMap(), ni = new WeakMap();
const Zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: us,
  api: us,
  default: us
}, Symbol.toStringTag, { value: "Module" }));
var Vi, Et, Gi, ri;
class hs extends Cc {
  constructor(i, a) {
    super(i, a);
    w(this, Vi);
    w(this, Et);
    w(this, Gi);
    w(this, ri);
    this.consumeContext(Ve, (s) => {
      _(this, Vi, s);
    }), this.consumeContext(Ge, (s) => {
      _(this, Et, s);
    }), this.consumeContext(Tc, (s) => {
      _(this, Gi, s);
    }), this.consumeContext(Ec, (s) => {
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
        return (l = c(this, Vi)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Gi)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, Et)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
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
Vi = new WeakMap(), Et = new WeakMap(), Gi = new WeakMap(), ri = new WeakMap();
const Qh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: hs,
  api: hs,
  default: hs
}, Symbol.toStringTag, { value: "Module" }));
var ed = Object.defineProperty, td = Object.getOwnPropertyDescriptor, nc = (e) => {
  throw TypeError(e);
}, ts = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? td(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ed(t, i, s), s;
}, Eo = (e, t, i) => t.has(e) || nc("Cannot " + i), Wa = (e, t, i) => (Eo(e, t, "read from private field"), t.get(e)), na = (e, t, i) => t.has(e) ? nc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), rc = (e, t, i, a) => (Eo(e, t, "write to private field"), t.set(e, i), i), Ut = (e, t, i) => (Eo(e, t, "access private method"), i), $a, Ui, Do, Je, Po, lc, xa;
let ut = class extends an {
  constructor() {
    super(), na(this, Je), na(this, $a), na(this, Ui), this._items = [], this._loading = !0, this._search = "", na(this, Do, () => {
      var e;
      return (e = Wa(this, $a)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ve, (e) => {
      rc(this, $a, e), e && Ut(this, Je, Po).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(Wa(this, Ui));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${Ut(this, Je, lc)}>
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
Ui = /* @__PURE__ */ new WeakMap();
Do = /* @__PURE__ */ new WeakMap();
Je = /* @__PURE__ */ new WeakSet();
Po = async function() {
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
        (a) => _n(a, this._search, 0, 30, Wa(this, Do)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
lc = function(e) {
  this._search = e.target.value, window.clearTimeout(Wa(this, Ui)), rc(this, Ui, window.setTimeout(() => void Ut(this, Je, Po).call(this), 300));
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
const id = ut, ad = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return ut;
  },
  default: id
}, Symbol.toStringTag, { value: "Module" }));
var sd = Object.defineProperty, od = Object.getOwnPropertyDescriptor, cc = (e) => {
  throw TypeError(e);
}, Ye = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? od(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && sd(t, i, s), s;
}, Mo = (e, t, i) => t.has(e) || cc("Cannot " + i), hi = (e, t, i) => (Mo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ds = (e, t, i) => t.has(e) ? cc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), nd = (e, t, i, a) => (Mo(e, t, "write to private field"), t.set(e, i), i), wt = (e, t, i) => (Mo(e, t, "access private method"), i), ka, ta, ge, uc, hc, dc, zo, pc, mc, fc, gc;
const rd = [100, 200, 300, 400, 500, 600, 700, 800, 900], ld = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let he = class extends an {
  constructor() {
    super(), ds(this, ge), ds(this, ka), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", ds(this, ta, () => {
      var e;
      return (e = hi(this, ka)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ve, (e) => {
      nd(this, ka, e);
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
            @change=${wt(this, ge, uc)}>
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
            @click=${wt(this, ge, dc)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${ld.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? wt(this, ge, gc).call(this) : wt(this, ge, fc).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !hi(this, ge, zo)}
            @click=${wt(this, ge, pc)}>
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
ge = /* @__PURE__ */ new WeakSet();
uc = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  wt(this, ge, hc).call(this, t);
};
hc = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await dn(t, hi(this, ta));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
dc = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await pn(this._path.trim(), hi(this, ta)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
zo = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
pc = async function() {
  if (hi(this, ge, zo)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await mn(
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
mc = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
fc = function() {
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
    rd,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => wt(this, ge, mc).call(this, e, t.target.checked)}>
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
gc = function() {
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
const cd = he, ud = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return he;
  },
  default: cd
}, Symbol.toStringTag, { value: "Module" }));
export {
  Yc as manifests,
  Td as onInit
};
//# sourceMappingURL=dynamic-images.js.map
