var _o = (e) => {
  throw TypeError(e);
};
var Xa = (e, t, i) => t.has(e) || _o("Cannot " + i);
var l = (e, t, i) => (Xa(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $ = (e, t, i) => t.has(e) ? _o("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), b = (e, t, i, a) => (Xa(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), D = (e, t, i) => (Xa(e, t, "access private method"), i);
var Ya = (e, t, i, a) => ({
  set _(s) {
    b(e, t, s, i);
  },
  get _() {
    return l(e, t, a);
  }
});
import { nothing as p, html as r, css as O, state as f, customElement as I, repeat as R, property as y, classMap as Wo, styleMap as B } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as W } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Ne } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as lt } from "@umbraco-cms/backoffice/notification";
import { umbConfirmModal as As, UmbModalToken as Fo, UMB_MODAL_MANAGER_CONTEXT as Oa, UmbModalBaseElement as No } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as Uo } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as jl } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as Gl, UmbSubmitWorkspaceAction as $o, UmbWorkspaceActionBase as Xl } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Yl } from "@umbraco-cms/backoffice/context-api";
import { UmbObjectState as ql, UmbArrayState as pi, UmbStringState as wo, UmbBooleanState as Qi, UmbNumberState as Jl } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as Zl } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as Ql } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as ec } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as tc } from "@umbraco-cms/backoffice/document";
const ii = "dynamic-images", Vi = "di-template", $a = "di:templates-changed", ic = "/umbraco/management/api/v1/dynamic-images";
class at extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function k(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${ic}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await ac(n);
  return n;
}
async function ac(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new at(t, e.status, i);
}
const C = async (e) => e.json();
async function Ls(e) {
  const t = await k("/templates?take=500", e);
  return (await C(t)).items;
}
const Bo = async (e, t) => C(await k(`/templates/${e}`, t)), Ko = async (e, t) => C(await k("/templates", t, { method: "POST", json: e })), Vo = async (e, t) => C(await k(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Ho(e, t) {
  await k(`/templates/${e}`, t, { method: "DELETE" });
}
const jo = async (e, t) => C(await k(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function Go(e, t) {
  return (await k(`/templates/${e}/export`, t)).blob();
}
const Xo = async (e, t, i) => C(await k("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), Yo = async (e) => C(await k("/templates/import/appsettings", e, { method: "POST" })), xi = async (e) => C(await k("/fonts", e));
async function qo(e, t) {
  const i = new FormData();
  return i.append("file", e), C(await k("/fonts", t, { method: "POST", body: i }));
}
const Jo = async (e, t) => C(await k("/fonts/register-path", t, { method: "POST", json: { path: e } })), Zo = async (e, t) => C(await k("/fonts/register-web", t, { method: "POST", json: e })), Qo = async (e, t) => C(await k(`/fonts/${e}/refresh`, t, { method: "POST" })), en = async (e, t, i, a) => C(await k(`/fonts/${e}`, a, { method: "PUT", json: { familyName: t, styles: i } }));
async function tn(e, t) {
  await k(`/fonts/${e}`, t, { method: "DELETE" });
}
async function an(e, t) {
  return (await k(`/fonts/${e}/file`, t)).arrayBuffer();
}
const sc = async (e) => C(await k("/document-types", e)), sn = async (e, t) => C(await k(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function on(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), C(await k(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function Rs(e, t, i) {
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
const Ws = async (e, t, i) => C(await k("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Fs = async (e, t) => C(await k(`/media/${e}/image-info`, t)), Ia = async (e, t) => C(await k(`/documents/${e}/regenerate`, t, { method: "POST" })), nn = async (e, t, i) => C(await k(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), rn = async (e, t) => C(await k(`/jobs/${e}`, t));
async function ln(e, t) {
  await k(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const cn = async (e, t) => C(await k(`/templates/${e}/usage`, t)), Aa = async (e) => C(await k("/health", e)), un = async (e) => C(await k("/sync/status", e)), hn = async (e) => C(await k("/sync/export", e, { method: "POST" })), dn = async (e) => C(await k("/sync/import", e, { method: "POST" }));
function ai(e) {
  const t = `section/${ii}/workspace/${Vi}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function La() {
  return new URL(`section/${ii}/workspace/${Vi}/create`, document.baseURI).pathname;
}
function pn(e) {
  return new URL(`section/${ii}/dashboard/${e}`, document.baseURI).pathname;
}
function os() {
  const e = window.location.pathname.split(`/workspace/${Vi}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function ri() {
  window.dispatchEvent(new CustomEvent($a));
}
const oc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: at,
  SECTION_PATHNAME: ii,
  TEMPLATES_CHANGED_EVENT: $a,
  TEMPLATE_ENTITY_TYPE: Vi,
  cancelJob: ln,
  createTemplate: Ko,
  deleteFont: tn,
  deleteTemplate: Ho,
  duplicateTemplate: jo,
  exportTemplate: Go,
  fetchDocumentTypes: sc,
  fetchFontFile: an,
  fetchFonts: xi,
  fetchHealth: Aa,
  fetchImageInfo: Fs,
  fetchJob: rn,
  fetchLayout: Ws,
  fetchPreview: Rs,
  fetchProperties: sn,
  fetchSampleContent: on,
  fetchSyncStatus: un,
  fetchTemplate: Bo,
  fetchTemplates: Ls,
  fetchUsage: cn,
  hrefForCreate: La,
  hrefForDashboard: pn,
  hrefForTemplate: ai,
  importFromAppSettings: Yo,
  importTemplate: Xo,
  notifyTemplatesChanged: ri,
  refreshFont: Qo,
  regenerateDocument: Ia,
  regenerateTemplate: nn,
  registerFontPath: Jo,
  registerWebFont: Zo,
  runSyncExport: hn,
  runSyncImport: dn,
  templateKeyFromLocation: os,
  updateFont: en,
  updateTemplate: Vo,
  uploadFont: qo
}, Symbol.toStringTag, { value: "Module" })), Ra = () => crypto.randomUUID();
function Wa(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function fn(e, t, i) {
  const { x: a, y: s } = Wa(e);
  return {
    type: "text",
    key: Ra(),
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
function mn(e, t, i) {
  const { x: a, y: s } = Wa(e);
  return {
    type: "image",
    key: Ra(),
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
function gn(e, t, i) {
  const { x: a, y: s } = Wa(e);
  return {
    type: "badges",
    key: Ra(),
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
function nc(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = Wa(e);
  return {
    type: "rect",
    key: Ra(),
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
function rc(e) {
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
function lc(e, t) {
  switch (rc(e.classification)) {
    case "image":
      return mn(t, e.name, e.alias);
    case "badges":
      return gn(t, e.name, e.alias);
    default:
      return fn(t, e.name, cc(e));
  }
}
function cc(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function uc(e) {
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
const yn = [
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
function ki(e) {
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
function Si(e) {
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
function ns(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return yn[a * 3 + i];
}
function Fa(e, t, i) {
  return {
    x: e.x - t * ki(e.anchor),
    y: e.y - i * Si(e.anchor)
  };
}
function Ns(e, t, i, a, s) {
  return {
    x: e + i * ki(s),
    y: t + a * Si(s)
  };
}
function hc(e, t, i, a) {
  const s = Fa(e, t, i), o = Ns(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function dc(e, t) {
  const i = Ns(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function vn(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Wt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), c = Math.sin(o), d = e - i, m = t - a;
  return { x: i + d * n - m * c, y: a + d * c + m * n };
}
function pc(e, t, i, a, s) {
  return Wt(e, t, i, a, -s);
}
function bn(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Wt(e.x, e.y, t, i, a),
    Wt(e.x + e.width, e.y, t, i, a),
    Wt(e.x + e.width, e.y + e.height, t, i, a),
    Wt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((m) => m.x)), n = Math.max(...s.map((m) => m.x)), c = Math.min(...s.map((m) => m.y)), d = Math.max(...s.map((m) => m.y));
  return { x: o, y: c, width: n - o, height: d - c };
}
const fc = 10;
function Pe(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function _n(e) {
  return !!e.relativeX || !!e.relativeY;
}
function wa(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function xo(e) {
  return e === "below" || e === "above";
}
function ko(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function mc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function gc(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = ko(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...ko(n.position).map((c) => c.layerKey));
  }
  return !1;
}
function yc(e, t, i) {
  const a = e.position;
  if (!_n(a)) return a;
  if (gc(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = ki(a.anchor), c = Si(a.anchor);
  const d = So(e, a.relativeX, !1, t, i);
  d && (s = d.coordinate, n = d.factor);
  const m = So(e, a.relativeY, !0, t, i);
  return m && (o = m.coordinate, c = m.factor), { x: s, y: o, anchor: ns(n, c) };
}
function So(e, t, i, a, s) {
  if (!t || xo(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let n = t.layerKey;
  for (; !o.has(n); ) {
    o.add(n);
    const c = a.get(n);
    if (!c) return;
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
    const m = i ? c.position.relativeY : c.position.relativeX;
    if (!m || xo(m.edge) !== i) return;
    n = m.layerKey;
  }
}
function vc(e, t, i) {
  const a = mc(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (c) => {
    const d = s.get(c.key);
    if (d) return d;
    let m;
    o.has(c.key) ? m = { x: c.position.x, y: c.position.y, anchor: c.position.anchor } : (o.add(c.key), m = yc(c, a, (Ve) => {
      const Ie = a.get(Ve);
      return Ie && !i(Ie) ? n(Ie).extent : void 0;
    }), o.delete(c.key));
    const T = t(c), Y = Fa(m, T.width, T.height), $e = { x: Y.x, y: Y.y, width: T.width, height: T.height }, Oe = { position: m, box: $e, extent: bn($e, m.x, m.y, c.rotation ?? 0) };
    return s.set(c.key, Oe), Oe;
  };
  for (const c of e) n(c);
  return s;
}
function rs(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? ns(ki(i.anchor), Si(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? ns(ki(e.anchor), Si(i.anchor)) : e.anchor
  };
}
var oe, Le, ke, Je;
class bc {
  constructor(t = 100) {
    $(this, oe, []);
    $(this, Le, []);
    $(this, ke, 0);
    $(this, Je);
    this.limit = t;
  }
  get canUndo() {
    return l(this, oe).length > 0;
  }
  get canRedo() {
    return l(this, Le).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    l(this, ke) > 0 || (l(this, oe).push(structuredClone(t)), l(this, oe).length > this.limit && l(this, oe).shift(), b(this, Le, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    l(this, ke) === 0 && b(this, Je, structuredClone(t)), Ya(this, ke)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    l(this, ke) !== 0 && (Ya(this, ke)._--, !(l(this, ke) > 0) && (t && l(this, Je) !== void 0 && (l(this, oe).push(l(this, Je)), l(this, oe).length > this.limit && l(this, oe).shift(), b(this, Le, [])), b(this, Je, void 0)));
  }
  undo(t) {
    const i = l(this, oe).pop();
    if (i !== void 0)
      return l(this, Le).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = l(this, Le).pop();
    if (i !== void 0)
      return l(this, oe).push(structuredClone(t)), i;
  }
  clear() {
    b(this, oe, []), b(this, Le, []), b(this, ke, 0), b(this, Je, void 0);
  }
}
oe = new WeakMap(), Le = new WeakMap(), ke = new WeakMap(), Je = new WeakMap();
const _c = "DynamicImages.Workspace.Template";
var K, Gt, Ze, vt, bt, Xt, Yt, qt, _t, Jt, Re, Zt, Qt, ne, Ni, $t, Se, S, ls, cs, Ae, dt, us, hs;
class $c extends Gl {
  constructor(i) {
    super(i, _c);
    $(this, S);
    $(this, K);
    $(this, Gt);
    $(this, Ze);
    $(this, vt);
    $(this, bt);
    $(this, Xt);
    $(this, Yt);
    $(this, qt);
    $(this, _t);
    $(this, Jt);
    $(this, Re);
    $(this, Zt);
    $(this, Qt);
    $(this, ne);
    $(this, Ni);
    $(this, $t);
    $(this, Se);
    b(this, K, new ql(void 0)), this.template = l(this, K).asObservable(), b(this, Gt, new pi([], (a) => a.key)), this.layers = l(this, Gt).asObservable(), b(this, Ze, new wo(void 0)), this.selectedLayerKey = l(this, Ze).asObservable(), b(this, vt, new pi([], (a) => a.alias)), this.properties = l(this, vt).asObservable(), b(this, bt, new pi([], (a) => a.key)), this.fonts = l(this, bt).asObservable(), b(this, Xt, new pi([], (a) => a.key)), this.serverBounds = l(this, Xt).asObservable(), b(this, Yt, new pi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = l(this, Yt).asObservable(), b(this, qt, new wo(void 0)), this.sampleContentKey = l(this, qt).asObservable(), b(this, _t, new Qi(!0)), this.useSampleData = l(this, _t).asObservable(), b(this, Jt, new Jl(1)), this.zoom = l(this, Jt).asObservable(), b(this, Re, new Qi(!0)), this.loading = l(this, Re).asObservable(), this.unique = l(this, K).asObservablePart((a) => a == null ? void 0 : a.key), b(this, Zt, new Qi(!1)), this.canUndo = l(this, Zt).asObservable(), b(this, Qt, new Qi(!1)), this.canRedo = l(this, Qt).asObservable(), b(this, ne, new bc()), b(this, Se, !1), this.getToken = () => {
      var a;
      return (a = l(this, Ni)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = l(this, K).getValue()) == null ? void 0 : a.key;
    }, this.getData = () => l(this, K).getValue(), this.routes.setRoutes([
      {
        path: "create",
        component: () => Promise.resolve().then(() => Co),
        setup: () => this.createScaffold()
      },
      {
        path: "edit/:key",
        component: () => Promise.resolve().then(() => Co),
        setup: (a, s) => this.load(s.match.params.key)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ne, (a) => {
      b(this, Ni, a);
    }), this.consumeContext(lt, (a) => {
      b(this, $t, a);
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return l(this, Se);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    l(this, Re).setValue(!0), b(this, Se, !1);
    try {
      const a = await Bo(i, this.getToken);
      D(this, S, dt).call(this, a, { resetHistory: !0 }), this.setIsNew(!1), await D(this, S, ls).call(this, a);
    } catch (a) {
      D(this, S, hs).call(this, "This template could not be loaded", a);
    } finally {
      l(this, Re).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    l(this, Re).setValue(!0), b(this, Se, !0), D(this, S, dt).call(this, uc(i), { resetHistory: !0 }), this.setIsNew(!0), await D(this, S, ls).call(this, l(this, K).getValue()), l(this, Re).setValue(!1);
  }
  async reloadProperties() {
    const i = l(this, K).getValue();
    i && l(this, vt).setValue(await D(this, S, cs).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    l(this, bt).setValue(await xi(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    D(this, S, Ae).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    D(this, S, Ae).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    D(this, S, Ae).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    D(this, S, Ae).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    D(this, S, Ae).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    D(this, S, Ae).call(this, (s) => ({
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
    D(this, S, Ae).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var c, d;
        let n = o.position;
        return ((c = wa(n, "x")) == null ? void 0 : c.layerKey) === i && (n = rs(n, "x", a == null ? void 0 : a.get(o.key))), ((d = wa(n, "y")) == null ? void 0 : d.layerKey) === i && (n = rs(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), l(this, Ze).getValue() === i && this.selectLayer(void 0);
  }
  duplicateLayer(i) {
    var o;
    const a = (o = l(this, K).getValue()) == null ? void 0 : o.layers.find((n) => n.key === i);
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
    D(this, S, Ae).call(this, (s) => {
      const o = [...s.layers], n = o.findIndex((d) => d.key === i);
      if (n < 0) return s;
      const [c] = o.splice(n, 1);
      return o.splice(Math.max(0, Math.min(o.length, a)), 0, c), { ...s, layers: o };
    });
  }
  setLayerVisible(i, a) {
    this.updateLayer(i, { isVisible: a });
  }
  setLayerLocked(i, a) {
    this.updateLayer(i, { isLocked: a });
  }
  selectLayer(i) {
    l(this, Ze).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = l(this, Ze).getValue();
    return i ? (a = l(this, K).getValue()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = l(this, K).getValue();
    i && l(this, ne).begin(i);
  }
  endTransaction(i = !0) {
    l(this, ne).end(i), D(this, S, us).call(this);
  }
  undo() {
    const i = l(this, K).getValue();
    if (!i) return;
    const a = l(this, ne).undo(i);
    a && D(this, S, dt).call(this, a);
  }
  redo() {
    const i = l(this, K).getValue();
    if (!i) return;
    const a = l(this, ne).redo(i);
    a && D(this, S, dt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    l(this, Xt).setValue(i);
  }
  setIssues(i) {
    l(this, Yt).setValue(i);
  }
  setSampleContentKey(i) {
    l(this, qt).setValue(i), l(this, _t).setValue(!i);
  }
  setUseSampleData(i) {
    l(this, _t).setValue(i);
  }
  setZoom(i) {
    l(this, Jt).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = l(this, K).getValue();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = l(this, Se) ? await Ko(i, this.getToken) : await Vo(i, this.getToken);
      D(this, S, dt).call(this, o.template, { resetHistory: !0 });
      const n = l(this, Se);
      b(this, Se, !1), this.setIsNew(!1), ri(), (a = l(this, $t)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const c of o.warnings)
        (s = l(this, $t)) == null || s.peek("warning", { data: { message: c.message } });
      n && window.history.replaceState({}, "", ai(o.template.key));
    } catch (o) {
      throw D(this, S, hs).call(this, "The template could not be saved", o), o;
    }
  }
  destroy() {
    l(this, ne).clear(), super.destroy();
  }
}
K = new WeakMap(), Gt = new WeakMap(), Ze = new WeakMap(), vt = new WeakMap(), bt = new WeakMap(), Xt = new WeakMap(), Yt = new WeakMap(), qt = new WeakMap(), _t = new WeakMap(), Jt = new WeakMap(), Re = new WeakMap(), Zt = new WeakMap(), Qt = new WeakMap(), ne = new WeakMap(), Ni = new WeakMap(), $t = new WeakMap(), Se = new WeakMap(), S = new WeakSet(), ls = async function(i) {
  const [a, s] = await Promise.all([
    xi(this.getToken).catch(() => []),
    D(this, S, cs).call(this, i.docTypeAliases)
  ]);
  l(this, bt).setValue(a), l(this, vt).setValue(s);
}, cs = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => sn(o, this.getToken).catch(() => []))
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
  const s = l(this, K).getValue();
  if (!s) return;
  a && l(this, ne).push(s);
  const o = i(structuredClone(s));
  D(this, S, dt).call(this, o);
}, dt = function(i, a) {
  a != null && a.resetHistory && l(this, ne).clear(), l(this, K).setValue(i), l(this, Gt).setValue(i.layers), D(this, S, us).call(this);
}, us = function() {
  l(this, Zt).setValue(l(this, ne).canUndo), l(this, Qt).setValue(l(this, ne).canRedo);
}, hs = function(i, a) {
  var o;
  const s = a instanceof at ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = l(this, $t)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const zt = new Yl(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), wc = [
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
    element: () => Promise.resolve().then(() => Ic),
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
      href: `section/${ii}/dashboard/fonts`
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
      href: `section/${ii}/dashboard/health`
    }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => Wc),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Gc),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Jc),
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
    api: $c,
    meta: { entityType: Vi }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => ah),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => lh),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => dh),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => yh),
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
    api: () => Promise.resolve().then(() => vh),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => _h),
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
    api: () => Promise.resolve().then(() => $h),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => wh),
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
    element: () => Promise.resolve().then(() => Th)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => Oh)
  }
], Yh = (e, t) => {
  t.registerMany(wc);
};
var xc = Object.defineProperty, kc = Object.getOwnPropertyDescriptor, $n = (e) => {
  throw TypeError(e);
}, Us = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && xc(t, i, s), s;
}, Bs = (e, t, i) => t.has(e) || $n("Cannot " + i), Sc = (e, t, i) => (Bs(e, t, "read from private field"), t.get(e)), To = (e, t, i) => t.has(e) ? $n("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Tc = (e, t, i, a) => (Bs(e, t, "write to private field"), t.set(e, i), i), Cc = (e, t, i) => (Bs(e, t, "access private method"), i), xa, ds, wn;
let Tt = class extends W {
  constructor() {
    super(), To(this, ds), To(this, xa), this._name = "", this._loading = !0, this.consumeContext(zt, (e) => {
      Tc(this, xa, e), e && (this.observe(e.template, (t) => {
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
            @input=${Cc(this, ds, wn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
xa = /* @__PURE__ */ new WeakMap();
ds = /* @__PURE__ */ new WeakSet();
wn = function(e) {
  var i;
  const t = e.target.value;
  (i = Sc(this, xa)) == null || i.updateTemplateFields({ name: t });
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
Us([
  f()
], Tt.prototype, "_name", 2);
Us([
  f()
], Tt.prototype, "_loading", 2);
Tt = Us([
  I("di-template-editor")
], Tt);
const Ec = Tt, Co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Tt;
  },
  default: Ec
}, Symbol.toStringTag, { value: "Module" }));
var Dc = Object.defineProperty, Pc = Object.getOwnPropertyDescriptor, xn = (e) => {
  throw TypeError(e);
}, li = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Pc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Dc(t, i, s), s;
}, Ks = (e, t, i) => t.has(e) || xn("Cannot " + i), mt = (e, t, i) => (Ks(e, t, "read from private field"), t.get(e)), fi = (e, t, i) => t.has(e) ? xn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mc = (e, t, i, a) => (Ks(e, t, "write to private field"), t.set(e, i), i), aa = (e, t, i) => (Ks(e, t, "access private method"), i), sa, ka, oa, na, Ft, ps, kn, Sn;
let Me = class extends W {
  constructor() {
    super(), fi(this, Ft), fi(this, sa), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = os(), this._expanded = !0, fi(this, ka, () => {
      var e;
      return (e = mt(this, sa)) == null ? void 0 : e.getLatestToken();
    }), fi(this, oa, () => {
      this._activeKey = os();
    }), fi(this, na, () => {
      aa(this, Ft, ps).call(this);
    }), this.consumeContext(Ne, (e) => {
      Mc(this, sa, e), e && aa(this, Ft, ps).call(this);
    }), window.addEventListener("changestate", mt(this, oa)), window.addEventListener($a, mt(this, na));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("changestate", mt(this, oa)), window.removeEventListener($a, mt(this, na));
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
        ${aa(this, Ft, kn).call(this)}
      </uui-menu-item>
    `;
  }
};
sa = /* @__PURE__ */ new WeakMap();
ka = /* @__PURE__ */ new WeakMap();
oa = /* @__PURE__ */ new WeakMap();
na = /* @__PURE__ */ new WeakMap();
Ft = /* @__PURE__ */ new WeakSet();
ps = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Ls(mt(this, ka)),
      Aa(mt(this, ka)).catch(() => {
      })
    ]);
    this._templates = e, this._issuesByTemplate = zc((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
kn = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${R(
    this._templates,
    (e) => e.key,
    (e) => aa(this, Ft, Sn).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${La()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
Sn = function(e) {
  const t = this._issuesByTemplate.get(e.key) ?? 0;
  return r`
      <uui-menu-item
        label=${e.name}
        href=${ai(e.key)}
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
Me.styles = O`
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
li([
  f()
], Me.prototype, "_templates", 2);
li([
  f()
], Me.prototype, "_issuesByTemplate", 2);
li([
  f()
], Me.prototype, "_loading", 2);
li([
  f()
], Me.prototype, "_activeKey", 2);
li([
  f()
], Me.prototype, "_expanded", 2);
Me = li([
  I("di-templates-menu-item")
], Me);
function zc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const Oc = Me, Ic = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return Me;
  },
  default: Oc
}, Symbol.toStringTag, { value: "Module" }));
var Ac = Object.defineProperty, Lc = Object.getOwnPropertyDescriptor, Tn = (e) => {
  throw TypeError(e);
}, ct = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Lc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ac(t, i, s), s;
}, Vs = (e, t, i) => t.has(e) || Tn("Cannot " + i), Ce = (e, t, i) => (Vs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ea = (e, t, i) => t.has(e) ? Tn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Eo = (e, t, i, a) => (Vs(e, t, "write to private field"), t.set(e, i), i), x = (e, t, i) => (Vs(e, t, "access private method"), i), ra, Sa, Ee, _, ci, he, Cn, En, Dn, Pn, Mn, zn, On, yi, In, An, Ln, Rn, Wn;
let de = class extends W {
  constructor() {
    super(), ea(this, _), ea(this, ra), ea(this, Sa), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, ea(this, Ee, () => {
      var e;
      return (e = Ce(this, ra)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(lt, (e) => {
      Eo(this, Sa, e);
    }), this.consumeContext(Ne, (e) => {
      Eo(this, ra, e), e && x(this, _, ci).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${x(this, _, zn).call(this)} ${x(this, _, On).call(this)} ${x(this, _, In).call(this)} ${x(this, _, An).call(this)}
      </umb-body-layout>
    `;
  }
};
ra = /* @__PURE__ */ new WeakMap();
Sa = /* @__PURE__ */ new WeakMap();
Ee = /* @__PURE__ */ new WeakMap();
_ = /* @__PURE__ */ new WeakSet();
ci = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Ls(Ce(this, Ee)),
      xi(Ce(this, Ee)).catch(() => []),
      Aa(Ce(this, Ee)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    x(this, _, he).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
he = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ce(this, Sa)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Cn = async function() {
  this._importing = !0;
  try {
    const e = await Yo(Ce(this, Ee));
    x(this, _, he).call(this, e.created.length > 0 ? "positive" : "warning", e.created.length > 0 ? `Imported ${e.created.length} template(s)` : "Nothing was imported");
    for (const t of e.warnings.slice(0, 5)) x(this, _, he).call(this, "warning", t);
    ri(), await x(this, _, ci).call(this);
  } catch (e) {
    x(this, _, he).call(this, "danger", "The import failed", e);
  } finally {
    this._importing = !1;
  }
};
En = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await Xo(this._pasteJson, "create", Ce(this, Ee)), x(this, _, he).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, ri(), await x(this, _, ci).call(this);
    } catch (e) {
      x(this, _, he).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
Dn = async function(e) {
  try {
    await jo(e.key, Ce(this, Ee)), x(this, _, he).call(this, "positive", `'${e.name}' duplicated`), ri(), await x(this, _, ci).call(this);
  } catch (t) {
    x(this, _, he).call(this, "danger", "The template could not be duplicated", t);
  }
};
Pn = async function(e) {
  await As(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Ho(e.key, Ce(this, Ee)), x(this, _, he).call(this, "positive", `'${e.name}' deleted`), ri(), await x(this, _, ci).call(this);
  } catch (t) {
    x(this, _, he).call(this, "danger", "The template could not be deleted", t);
  }
};
Mn = async function(e) {
  try {
    const t = await Go(e.key, Ce(this, Ee)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    x(this, _, he).call(this, "danger", "The template could not be exported", t);
  }
};
zn = function() {
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
            @click=${x(this, _, Cn)}>
            Import from appsettings
          </uui-button>
        </div>
      </uui-box>
    `;
};
On = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${x(this, _, yi).call(this, "Templates", this._templates.length, "icon-brush")}
        ${x(this, _, yi).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${x(this, _, yi).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${x(this, _, yi).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
yi = function(e, t, i, a = !1) {
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        <uui-icon name=${i}></uui-icon>
        <div class="stat-value">${t}</div>
        <div class="stat-label">${e}</div>
      </uui-box>
    `;
};
In = function() {
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
        <uui-button look="secondary" href=${pn("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
An = function() {
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
          <uui-button look="primary" color="positive" href=${La()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? x(this, _, Ln).call(this) : p}
        ${this._templates.length === 0 ? x(this, _, Rn).call(this) : x(this, _, Wn).call(this)}
      </uui-box>
    `;
};
Ln = function() {
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
          @click=${x(this, _, En)}>
          Import
        </uui-button>
      </div>
    `;
};
Rn = function() {
  return r`
      <div class="empty">
        <uui-icon name="icon-brush"></uui-icon>
        <h4>No templates yet</h4>
        <p>A template says which document types get a generated image, and what it looks like.</p>
        <uui-button look="primary" color="positive" href=${La()} label="Create your first template">
          Create your first template
        </uui-button>
      </div>
    `;
};
Wn = function() {
  return r`
      <div class="cards">
        ${R(
    this._templates,
    (e) => e.key,
    (e) => r`
            <uui-box class="card ${e.isEnabled ? "" : "disabled"}">
              <div slot="headline">
                <a href=${ai(e.key)}>${e.name}</a>
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
                <uui-button look="secondary" href=${ai(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => x(this, _, Dn).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => x(this, _, Mn).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => x(this, _, Pn).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
de.styles = O`
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
  f()
], de.prototype, "_templates", 2);
ct([
  f()
], de.prototype, "_fonts", 2);
ct([
  f()
], de.prototype, "_health", 2);
ct([
  f()
], de.prototype, "_loading", 2);
ct([
  f()
], de.prototype, "_importing", 2);
ct([
  f()
], de.prototype, "_pasteJson", 2);
ct([
  f()
], de.prototype, "_showPaste", 2);
de = ct([
  I("di-overview-dashboard")
], de);
const Rc = de, Wc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return de;
  },
  default: Rc
}, Symbol.toStringTag, { value: "Module" })), fs = /* @__PURE__ */ new Map(), Na = (e) => `di-${e}`;
function Fc(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = fs.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await an(e, t), o = new FontFace(Na(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return fs.set(e, a), a;
}
async function Fn(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => Fc(a, t)));
}
function Nn(e) {
  fs.delete(e);
}
const Nc = new Fo(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), Uc = new Fo(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var Bc = Object.defineProperty, Kc = Object.getOwnPropertyDescriptor, Un = (e) => {
  throw TypeError(e);
}, Ua = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Kc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Bc(t, i, s), s;
}, Hs = (e, t, i) => t.has(e) || Un("Cannot " + i), De = (e, t, i) => (Hs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), mi = (e, t, i) => t.has(e) ? Un("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qa = (e, t, i, a) => (Hs(e, t, "write to private field"), t.set(e, i), i), L = (e, t, i) => (Hs(e, t, "access private method"), i), la, Ti, Ci, Ct, M, ui, st, ms, Bn, Kn, ca, Vn, Hn, jn;
function Vc(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : Hc(e.sourceUrl);
    default:
      return "Media library";
  }
}
function Hc(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let ot = class extends W {
  constructor() {
    super(), mi(this, M), mi(this, la), mi(this, Ti), mi(this, Ci), this._fonts = [], this._loading = !0, mi(this, Ct, () => {
      var e;
      return (e = De(this, la)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Oa, (e) => {
      qa(this, Ti, e);
    }), this.consumeContext(lt, (e) => {
      qa(this, Ci, e);
    }), this.consumeContext(Ne, (e) => {
      qa(this, la, e), e && L(this, M, ui).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${L(this, M, ms)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf or .woff2, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${L(this, M, ms)}>
                  Add your first font
                </uui-button>
              </div>` : r`${R(this._fonts, (e) => e.key, (e) => L(this, M, Vn).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
la = /* @__PURE__ */ new WeakMap();
Ti = /* @__PURE__ */ new WeakMap();
Ci = /* @__PURE__ */ new WeakMap();
Ct = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
ui = async function() {
  this._loading = !0;
  try {
    this._fonts = await xi(De(this, Ct)), await Fn(this._fonts.map((e) => e.key), De(this, Ct));
  } catch (e) {
    L(this, M, st).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
st = function(e, t, i) {
  var s;
  const a = i instanceof at ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = De(this, Ci)) == null || s.peek(e, { data: { headline: t, message: a } });
};
ms = async function() {
  var i, a;
  if (!De(this, Ti)) return;
  const e = De(this, Ti).open(this, Uc, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = De(this, Ci)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await L(this, M, ui).call(this));
};
Bn = async function(e) {
  try {
    await Qo(e.key, De(this, Ct)), Nn(e.key), L(this, M, st).call(this, "positive", `'${e.familyName}' refreshed`), await L(this, M, ui).call(this);
  } catch (t) {
    L(this, M, st).call(this, "danger", "That font could not be refreshed", t);
  }
};
Kn = async function(e) {
  await As(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await tn(e.key, De(this, Ct)), Nn(e.key), L(this, M, st).call(this, "positive", `'${e.familyName}' deleted`), await L(this, M, ui).call(this);
  } catch (t) {
    L(this, M, st).call(this, "danger", "That font could not be deleted", t);
  }
};
ca = async function(e, t, i) {
  try {
    await en(e.key, t, i, De(this, Ct)), this._editingKey = void 0, L(this, M, st).call(this, "positive", `'${t}' saved`), await L(this, M, ui).call(this);
  } catch (a) {
    L(this, M, st).call(this, "danger", "The font could not be saved", a);
  }
};
Vn = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${Vc(e)} · weight ${e.weight}
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
                  @click=${() => L(this, M, Bn).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => L(this, M, Kn).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Na(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? L(this, M, jn).call(this, e) : L(this, M, Hn).call(this, e)}
      </div>
    `;
};
Hn = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${R(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
jn = function(e) {
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
      t.splice(a, 1), L(this, M, ca).call(this, e, e.familyName, t);
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), L(this, M, ca).call(this, e, e.familyName, t);
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`);
    L(this, M, ca).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t);
  }}>
            Save
          </uui-button>
        </div>
      </div>
    `;
};
ot.styles = O`
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
Ua([
  f()
], ot.prototype, "_fonts", 2);
Ua([
  f()
], ot.prototype, "_loading", 2);
Ua([
  f()
], ot.prototype, "_editingKey", 2);
ot = Ua([
  I("di-fonts-dashboard")
], ot);
const jc = ot, Gc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return ot;
  },
  default: jc
}, Symbol.toStringTag, { value: "Module" }));
var Xc = Object.defineProperty, Yc = Object.getOwnPropertyDescriptor, Gn = (e) => {
  throw TypeError(e);
}, Hi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Yc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Xc(t, i, s), s;
}, js = (e, t, i) => t.has(e) || Gn("Cannot " + i), Xe = (e, t, i) => (js(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ta = (e, t, i) => t.has(e) ? Gn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Do = (e, t, i, a) => (js(e, t, "write to private field"), t.set(e, i), i), Ut = (e, t, i) => (js(e, t, "access private method"), i), ua, Bt, si, Qe, Ta, gs, Xn;
let We = class extends W {
  constructor() {
    super(), ta(this, Qe), ta(this, ua), ta(this, Bt), this._loading = !0, this._busy = !1, ta(this, si, () => {
      var e;
      return (e = Xe(this, ua)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(lt, (e) => {
      Do(this, Bt, e);
    }), this.consumeContext(Ne, (e) => {
      Do(this, ua, e), e && Ut(this, Qe, Ta).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Ut(this, Qe, Ta).call(this)}>Re-check</uui-button>
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
                        ${a.templateKey ? r`<a href=${ai(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Ut(this, Qe, Xn).call(this)}
      </umb-body-layout>
    `;
  }
};
ua = /* @__PURE__ */ new WeakMap();
Bt = /* @__PURE__ */ new WeakMap();
si = /* @__PURE__ */ new WeakMap();
Qe = /* @__PURE__ */ new WeakSet();
Ta = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Aa(Xe(this, si)),
      un(Xe(this, si)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
gs = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await hn(Xe(this, si)) : await dn(Xe(this, si));
    (t = Xe(this, Bt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Xe(this, Bt)) == null || i.peek("warning", { data: { message: o } });
    await Ut(this, Qe, Ta).call(this);
  } catch (s) {
    (a = Xe(this, Bt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Xn = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Ut(this, Qe, gs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Ut(this, Qe, gs).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
We.styles = O`
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
Hi([
  f()
], We.prototype, "_health", 2);
Hi([
  f()
], We.prototype, "_sync", 2);
Hi([
  f()
], We.prototype, "_loading", 2);
Hi([
  f()
], We.prototype, "_busy", 2);
We = Hi([
  I("di-health-dashboard")
], We);
const qc = We, Jc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return We;
  },
  default: qc
}, Symbol.toStringTag, { value: "Module" }));
function Zc(e, t) {
  const i = [], a = t.lockX ? void 0 : Po(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Qc(t),
    t.threshold
  ), s = t.lockY ? void 0 : Po(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    eu(t),
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
function Qc(e) {
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
function eu(e) {
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
function Po(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
const Yn = 3, qn = 12, Jn = 0.1, Zn = 0.9;
function tu(e) {
  return Math.max(Yn, Math.min(qn, e));
}
function iu(e) {
  return Math.max(Jn, Math.min(Zn, e));
}
function au(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = tu(t), s = 0.5 * iu(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, c = [];
  for (let d = 0; d < o; d++) {
    const m = (-90 + d * n) * Math.PI / 180, T = e === "star" && d % 2 === 1 ? s : 0.5;
    c.push({ x: 0.5 + T * Math.cos(m), y: 0.5 + T * Math.sin(m) });
  }
  return c;
}
function su(e, t, i) {
  const a = au(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
var ou = Object.defineProperty, nu = Object.getOwnPropertyDescriptor, Qn = (e) => {
  throw TypeError(e);
}, Ue = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ou(t, i, s), s;
}, Gs = (e, t, i) => t.has(e) || Qn("Cannot " + i), ge = (e, t, i) => (Gs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ja = (e, t, i) => t.has(e) ? Qn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Za = (e, t, i, a) => (Gs(e, t, "write to private field"), t.set(e, i), i), X = (e, t, i) => (Gs(e, t, "access private method"), i), pt, vi, E, Ba, Xs, er, tr, ir, ar, Ys, Ca, sr, or, nr, rr, lr, cr, ur, hr, dr;
const ru = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], Qa = 18;
let be = class extends W {
  constructor() {
    super(...arguments), Ja(this, E), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, Ja(this, pt), Ja(this, vi);
  }
  willUpdate() {
    this._box = X(this, E, er).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ge(this, vi) && ((t = ge(this, pt)) == null || t.disconnect(), Za(this, vi, e), e && (ge(this, pt) ?? Za(this, pt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ge(this, pt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ge(this, pt)) == null || e.disconnect(), Za(this, vi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${Wo({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${B({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ge(this, E, tr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...X(this, E, Ys).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      X(this, E, sr).call(this, t), X(this, E, Ca).call(this, t);
    }}>
        ${X(this, E, or).call(this)}
      </div>

      ${this.selected ? X(this, E, hr).call(this, e) : p}
      ${this.showMeasured && this.measured ? X(this, E, dr).call(this) : p}
    `;
  }
};
pt = /* @__PURE__ */ new WeakMap();
vi = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
Ba = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Xs = function() {
  return this.layer.rotation ?? 0;
};
er = function() {
  var s;
  const e = this.layer, t = e.size.width ?? X(this, E, ir).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? X(this, E, ar).call(this), a = Fa(ge(this, E, Ba), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
tr = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
ir = function() {
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
ar = function() {
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
Ys = function(e) {
  const t = ge(this, E, Xs);
  if (t === 0) return {};
  const i = ge(this, E, Ba);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Ca = function(e, t) {
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
sr = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
or = function() {
  switch (this.layer.type) {
    case "text":
      return X(this, E, nr).call(this);
    case "image":
      return X(this, E, lr).call(this);
    case "badges":
      return X(this, E, cr).call(this);
    default:
      return X(this, E, ur).call(this);
  }
};
nr = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || X(this, E, rr).call(this);
  return r`
      <div
        class="text"
        style=${B({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Na(e.fontKey)}, sans-serif`,
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
rr = function() {
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
lr = function() {
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
cr = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, c = s === "horizontal", d = c && o, m = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${B({
    flexDirection: c ? "row" : "column",
    flexWrap: d ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...d ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${R(
    Array.from({ length: Math.max(1, a) }, (T, Y) => Y),
    (T) => T,
    () => r`
            <div class=${Wo({ badge: !0, right: m === "right" })}>
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
      fontFamily: `${Na(t.fontKey)}, sans-serif`,
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
ur = function() {
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
  const n = su(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${B({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${B({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
hr = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = ge(this, E, Ba), n = ge(this, E, Xs), c = Pe(this.layer.position, "x") || Pe(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${B({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...X(this, E, Ys).call(this, e) })}>
        <span
          class="tag"
          style=${B(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${c ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${R(
    ru,
    (d) => d,
    (d) => r`
                  <span
                    class="handle ${d}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${d}"
                    @pointerdown=${(m) => X(this, E, Ca).call(this, m, d)}>
                  </span>
                `
  )}
              <span class="stalk" style=${B({ height: `${Qa}px`, top: `${-Qa}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${B({ top: `${-Qa}px` })}
                @pointerdown=${(d) => X(this, E, Ca).call(this, d, "rotate")}>
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
dr = function() {
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
be.styles = O`
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
], be.prototype, "layer", 2);
Ue([
  y({ type: Number })
], be.prototype, "scale", 2);
Ue([
  y({ type: Boolean, reflect: !0 })
], be.prototype, "selected", 2);
Ue([
  y({ type: Object })
], be.prototype, "measured", 2);
Ue([
  y({ type: Boolean })
], be.prototype, "showMeasured", 2);
Ue([
  y({ type: String })
], be.prototype, "resolvedText", 2);
Ue([
  y({ attribute: !1 })
], be.prototype, "resolvedPosition", 2);
Ue([
  f()
], be.prototype, "_box", 2);
be = Ue([
  I("di-layer-box")
], be);
var lu = Object.defineProperty, cu = Object.getOwnPropertyDescriptor, pr = (e) => {
  throw TypeError(e);
}, qs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? cu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && lu(t, i, s), s;
}, uu = (e, t, i) => t.has(e) || pr("Cannot " + i), hu = (e, t, i) => t.has(e) ? pr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), du = (e, t, i) => (uu(e, t, "access private method"), i), ys, fr;
let Ei = class extends W {
  constructor() {
    super(...arguments), hu(this, ys), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${R(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => du(this, ys, fr).call(this, e)
    )}`;
  }
};
ys = /* @__PURE__ */ new WeakSet();
fr = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Ei.styles = O`
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
qs([
  y({ type: Array })
], Ei.prototype, "guides", 2);
qs([
  y({ type: Number })
], Ei.prototype, "scale", 2);
Ei = qs([
  I("di-guides")
], Ei);
var pu = Object.defineProperty, fu = Object.getOwnPropertyDescriptor, mr = (e) => {
  throw TypeError(e);
}, ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? fu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && pu(t, i, s), s;
}, mu = (e, t, i) => t.has(e) || mr("Cannot " + i), gu = (e, t, i) => t.has(e) ? mr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mo = (e, t, i) => (mu(e, t, "access private method"), i), ha, vs;
let q = class extends W {
  constructor() {
    super(...arguments), gu(this, ha), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Mo(this, ha, vs).call(this, "top"), Mo(this, ha, vs).call(this, "left");
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
ha = /* @__PURE__ */ new WeakSet();
vs = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : q.thickness) * o, t.height = (e === "top" ? q.thickness : s) * o, t.style.width = `${e === "top" ? s : q.thickness}px`, t.style.height = `${e === "top" ? q.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let c = 0; c <= a; c += 50) {
    const d = Math.round(c * this.scale) + 0.5, m = c % 100 === 0, T = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(d, q.thickness - T), i.lineTo(d, q.thickness)) : (i.moveTo(q.thickness - T, d), i.lineTo(q.thickness, d)), i.stroke(), m && c > 0 && (e === "top" ? i.fillText(String(c), d + 2, 9) : (i.save(), i.translate(9, d - 2), i.rotate(-Math.PI / 2), i.fillText(String(c), 0, 0), i.restore()));
  }
};
q.thickness = 20;
q.styles = O`
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
ji([
  y({ type: Number })
], q.prototype, "canvasWidth", 2);
ji([
  y({ type: Number })
], q.prototype, "canvasHeight", 2);
ji([
  y({ type: Number })
], q.prototype, "scale", 2);
ji([
  y({ type: Object })
], q.prototype, "pointer", 2);
q = ji([
  I("di-rulers")
], q);
var yu = Object.defineProperty, vu = Object.getOwnPropertyDescriptor, gr = (e) => {
  throw TypeError(e);
}, te = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? vu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && yu(t, i, s), s;
}, Js = (e, t, i) => t.has(e) || gr("Cannot " + i), z = (e, t, i) => (Js(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ae = (e, t, i) => t.has(e) ? gr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), da = (e, t, i, a) => (Js(e, t, "write to private field"), t.set(e, i), i), A = (e, t, i) => (Js(e, t, "access private method"), i), ft, bi, it, P, bs, _s, Ka, Zs, $s, yr, vr, Qs, br, _r, ws, pa, $r, wr, At, eo, xs, ks, Ss, Ts, Cs, Es, xr;
const bu = 6, kr = 20, _u = 15, $u = 0.1;
let J = class extends W {
  constructor() {
    super(...arguments), ae(this, P), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ae(this, ft), ae(this, bi), ae(this, it, /* @__PURE__ */ new Map()), ae(this, ws, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = A(this, P, Zs).call(this, t), a = A(this, P, $s).call(this, t), s = A(this, P, yr).call(this, t), o = A(this, P, Ka).call(this, e.detail.startX, e.detail.startY);
      da(this, ft, {
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
    }), ae(this, pa, (e) => {
      var Zi, bo;
      this._pointer = A(this, P, _s).call(this, e.clientX, e.clientY);
      const t = z(this, ft);
      if (!t) return;
      const i = this.template.layers.find((di) => di.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        A(this, P, wr).call(this, i, t, e);
        return;
      }
      const o = Pe(i.position, "x"), n = Pe(i.position, "y"), c = t.startRotation;
      if (t.handle && c !== 0) {
        A(this, P, $r).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let d = t.handle ? A(this, P, eo).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (d = { ...d, x: t.startBox.x, width: (Zi = t.handle) != null && Zi.includes("w") ? t.startBox.width : d.width }), n && (d = { ...d, y: t.startBox.y, height: (bo = t.handle) != null && bo.includes("n") ? t.startBox.height : d.height });
      const m = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, T = c !== 0 ? { x: d.x + m.x, y: d.y + m.y, width: t.startExtent.width, height: t.startExtent.height } : d, $e = this.snapEnabled && !e.altKey ? Zc(T, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((di) => di.key !== i.key).map((di) => A(this, P, $s).call(this, di)),
        threshold: bu / this.scale,
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
      this._guides = $e.guides;
      const Oe = c !== 0 ? { ...d, x: $e.box.x - m.x, y: $e.box.y - m.y } : $e.box, Ve = dc(Oe, i.position);
      o && (Ve.x = i.position.x), n && (Ve.y = i.position.y);
      const Ie = { position: Ve };
      t.handle && (Ie.size = {
        width: Math.max(1, Math.round(Oe.width)),
        height: Math.max(1, Math.round(Oe.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Ie } })
      );
    }), ae(this, At, () => {
      if (!z(this, ft)) return;
      const e = z(this, ft).moved;
      da(this, ft, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ae(this, xs, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ae(this, ks, () => {
      this._dropTarget = !1;
    }), ae(this, Ss, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = A(this, P, _s).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y }
        })
      );
    }), ae(this, Ts, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ae(this, Cs, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => _n(t.position)) && this.requestUpdate();
    }), ae(this, Es, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), da(this, bi, new ResizeObserver(() => A(this, P, bs).call(this))), z(this, bi).observe(this), window.addEventListener("pointermove", z(this, pa)), window.addEventListener("pointerup", z(this, At)), window.addEventListener("pointercancel", z(this, At));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = z(this, bi)) == null || e.disconnect(), window.removeEventListener("pointermove", z(this, pa)), window.removeEventListener("pointerup", z(this, At)), window.removeEventListener("pointercancel", z(this, At));
  }
  updated() {
    A(this, P, bs).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = z(this, it).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    A(this, P, vr).call(this);
    const s = this.showRulers ? kr : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${z(this, Ts)}
        @dragover=${z(this, xs)}
        @dragleave=${z(this, ks)}
        @drop=${z(this, Ss)}
        @di-layer-drag-start=${z(this, ws)}
        @di-layer-box-resize=${z(this, Cs)}>
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
            @pointerdown=${z(this, Es)}
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
        var n, c;
        return r`
                <di-layer-box
                  data-key=${o.key}
                  .layer=${o}
                  .scale=${this.scale}
                  .selected=${o.key === this.selectedLayerKey}
                  .measured=${a.get(o.key)}
                  .showMeasured=${this.showMeasured}
                  .resolvedText=${((n = a.get(o.key)) == null ? void 0 : n.resolvedText) ?? void 0}
                  .resolvedPosition=${(c = z(this, it).get(o.key)) == null ? void 0 : c.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? A(this, P, xr).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
ft = /* @__PURE__ */ new WeakMap();
bi = /* @__PURE__ */ new WeakMap();
it = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakSet();
bs = function() {
  const e = this.renderRoot.querySelector(".viewport");
  if (!e || !this.template) return;
  const t = 48 + (this.showRulers ? kr : 0), i = {
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
_s = function(e, t) {
  const i = A(this, P, Ka).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Ka = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
Zs = function(e) {
  const t = z(this, it).get(e.key);
  if (t) return t.box;
  const i = A(this, P, Qs).call(this, e), a = Fa(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
$s = function(e) {
  const t = z(this, it).get(e.key);
  return t ? t.extent : bn(A(this, P, Zs).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
yr = function(e) {
  var t;
  return ((t = z(this, it).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
vr = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  da(this, it, vc(
    this.template.layers,
    (i) => A(this, P, Qs).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Qs = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? A(this, P, br).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? A(this, P, _r).call(this, e, i)
  };
};
br = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
_r = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
ws = /* @__PURE__ */ new WeakMap();
pa = /* @__PURE__ */ new WeakMap();
$r = function(e, t, i, a, s, o, n, c) {
  const d = t.startRotation, m = t.startPosition, T = pc(a, s, 0, 0, d);
  let Y = A(this, P, eo).call(this, t.startBox, i, T.x, T.y, o);
  n && (Y = { ...Y, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : Y.width }), c && (Y = { ...Y, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : Y.height });
  const $e = Math.max(1, Math.round(Y.width)), Oe = Math.max(1, Math.round(Y.height)), Ve = Ns(Y.x, Y.y, $e, Oe, m.anchor), Ie = Wt(Ve.x, Ve.y, m.x, m.y, d), Zi = {
    ...e.position,
    x: n ? e.position.x : Math.round(Ie.x),
    y: c ? e.position.y : Math.round(Ie.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Zi, size: { width: $e, height: Oe } } }
    })
  );
};
wr = function(e, t, i) {
  const a = t.startPosition, s = A(this, P, Ka).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, c = t.startRotation + n, d = i.shiftKey ? _u : $u, m = vn(Math.round(c / d) * d);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
At = /* @__PURE__ */ new WeakMap();
eo = function(e, t, i, a, s) {
  let { x: o, y: n, width: c, height: d } = e;
  if (t.includes("w") && (o = e.x + i, c = e.width - i), t.includes("e") && (c = e.width + i), t.includes("n") && (n = e.y + a, d = e.height - a), t.includes("s") && (d = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(c - e.width) >= Math.abs(d - e.height) ? d = c / m : c = d * m, t.includes("n") && (n = e.y + e.height - d), t.includes("w") && (o = e.x + e.width - c);
  }
  return { x: o, y: n, width: Math.max(4, c), height: Math.max(4, d) };
};
xs = /* @__PURE__ */ new WeakMap();
ks = /* @__PURE__ */ new WeakMap();
Ss = /* @__PURE__ */ new WeakMap();
Ts = /* @__PURE__ */ new WeakMap();
Cs = /* @__PURE__ */ new WeakMap();
Es = /* @__PURE__ */ new WeakMap();
xr = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${B({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
J.styles = O`
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
te([
  y({ type: Object })
], J.prototype, "template", 2);
te([
  y({ type: String })
], J.prototype, "selectedLayerKey", 2);
te([
  y({ type: Object })
], J.prototype, "baseImageUrl", 2);
te([
  y({ type: Array })
], J.prototype, "serverBounds", 2);
te([
  y({ type: Boolean })
], J.prototype, "showMeasured", 2);
te([
  y({ type: Boolean })
], J.prototype, "snapEnabled", 2);
te([
  y({ type: Boolean })
], J.prototype, "showRulers", 2);
te([
  y({ type: Boolean })
], J.prototype, "showSafeArea", 2);
te([
  y({ type: Number })
], J.prototype, "zoom", 2);
te([
  f()
], J.prototype, "_fitScale", 2);
te([
  f()
], J.prototype, "_guides", 2);
te([
  f()
], J.prototype, "_pointer", 2);
te([
  f()
], J.prototype, "_dropTarget", 2);
J = te([
  I("di-designer-canvas")
], J);
var wu = Object.defineProperty, xu = Object.getOwnPropertyDescriptor, Sr = (e) => {
  throw TypeError(e);
}, to = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? xu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && wu(t, i, s), s;
}, Tr = (e, t, i) => t.has(e) || Sr("Cannot " + i), ku = (e, t, i) => (Tr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Su = (e, t, i) => t.has(e) ? Sr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Te = (e, t, i) => (Tr(e, t, "access private method"), i), le, Cr, Er, Dr, Pr, Mr, gt;
const zo = {
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
let Di = class extends W {
  constructor() {
    super(...arguments), Su(this, le), this.properties = [], this._search = "";
  }
  render() {
    const e = Tu(ku(this, le, Cr));
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
      ([t, i]) => Te(this, le, Pr).call(this, t, i)
    )}

        ${Te(this, le, Mr).call(this)}
      </div>
    `;
  }
};
le = /* @__PURE__ */ new WeakSet();
Cr = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Er = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Dr = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Pr = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${R(
    t,
    (i) => i.alias,
    (i) => Te(this, le, gt).call(this, i.name, zo[i.classification] ?? zo.other, i.classification, { kind: "property", property: i })
  )}
      </div>
    `;
};
Mr = function() {
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
        @dragstart=${(s) => Te(this, le, Dr).call(this, s, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${e}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label="Add ${e} to the canvas"
          @click=${() => Te(this, le, Er).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Di.styles = O`
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
to([
  y({ type: Array })
], Di.prototype, "properties", 2);
to([
  f()
], Di.prototype, "_search", 2);
Di = to([
  I("di-property-palette")
], Di);
function Tu(e) {
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
var Cu = Object.defineProperty, Eu = Object.getOwnPropertyDescriptor, zr = (e) => {
  throw TypeError(e);
}, Va = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Eu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Cu(t, i, s), s;
}, Or = (e, t, i) => t.has(e) || zr("Cannot " + i), Ye = (e, t, i) => (Or(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Du = (e, t, i) => t.has(e) ? zr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $i = (e, t, i) => (Or(e, t, "access private method"), i), Z, Pi, wi, Ha, Ir, Ar;
let oi = class extends W {
  constructor() {
    super(...arguments), Du(this, Z), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Ye(this, Z, Pi)};opacity:${Ye(this, Z, wi)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => $i(this, Z, Ha).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Ye(this, Z, Pi)}
                  @input=${(e) => $i(this, Z, Ir).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Ye(this, Z, wi))}
                    @input=${(e) => $i(this, Z, Ar).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Ye(this, Z, wi) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
Z = /* @__PURE__ */ new WeakSet();
Pi = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
wi = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
Ha = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Ir = function(e) {
  const t = Ye(this, Z, wi);
  $i(this, Z, Ha).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${Lr(t)}`);
};
Ar = function(e) {
  $i(this, Z, Ha).call(this, e >= 0.999 ? Ye(this, Z, Pi).toUpperCase() : `${Ye(this, Z, Pi).toUpperCase()}${Lr(e)}`);
};
oi.styles = O`
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
Va([
  y({ type: String })
], oi.prototype, "value", 2);
Va([
  y({ type: String })
], oi.prototype, "label", 2);
Va([
  f()
], oi.prototype, "_open", 2);
oi = Va([
  I("di-colour-input")
], oi);
const Lr = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Pu = Object.defineProperty, Mu = Object.getOwnPropertyDescriptor, Rr = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Pu(t, i, s), s;
};
const Oo = {
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
let Ea = class extends W {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${R(
      yn,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Oo[e]}
              title=${Oo[e]}
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
Ea.styles = O`
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
Rr([
  y({ type: String })
], Ea.prototype, "value", 2);
Ea = Rr([
  I("di-anchor-picker")
], Ea);
var zu = Object.defineProperty, Ou = Object.getOwnPropertyDescriptor, Wr = (e) => {
  throw TypeError(e);
}, ut = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ou(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && zu(t, i, s), s;
}, Iu = (e, t, i) => t.has(e) || Wr("Cannot " + i), Au = (e, t, i) => t.has(e) ? Wr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Lu = (e, t, i) => (Iu(e, t, "access private method"), i), Ds, Fr;
let ze = class extends W {
  constructor() {
    super(...arguments), Au(this, Ds), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${Lu(this, Ds, Fr)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
Ds = /* @__PURE__ */ new WeakSet();
Fr = function(e) {
  const t = e.target.value, i = t === "" ? null : Number(t);
  this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: i } }));
};
ze.styles = O`
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
  y({ type: Number })
], ze.prototype, "value", 2);
ut([
  y({ type: String })
], ze.prototype, "label", 2);
ut([
  y({ type: String })
], ze.prototype, "suffix", 2);
ut([
  y({ type: Number })
], ze.prototype, "step", 2);
ut([
  y({ type: Number })
], ze.prototype, "min", 2);
ut([
  y({ type: Number })
], ze.prototype, "max", 2);
ut([
  y({ type: String })
], ze.prototype, "placeholder", 2);
ze = ut([
  I("di-number-field")
], ze);
var Ru = Object.defineProperty, Wu = Object.getOwnPropertyDescriptor, Nr = (e) => {
  throw TypeError(e);
}, Gi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Wu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ru(t, i, s), s;
}, Fu = (e, t, i) => t.has(e) || Nr("Cannot " + i), Nu = (e, t, i) => t.has(e) ? Nr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (Fu(e, t, "access private method"), i), u, g, He, Ur, Br, Kr, Vr, Hr, jr, Gr, Xr, Ps, Yr, fa, qr, Jr, hi, io, Zr;
let Et = class extends W {
  constructor() {
    super(...arguments), Nu(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, u, Br).call(this, this.layer) : h(this, u, Ur).call(this)}</div>` : p;
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
He = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Ur = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            label="Width"
            .value=${e.width}
            @change=${(t) => h(this, u, He).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
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
              .options=${Qr(e.baseImage.kind)}
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
              ${h(this, u, hi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, u, He).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${ee(["cover", "contain", "stretch"], e.baseImageFit)}
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
Br = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, u, g).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, u, Kr).call(this, e) : p}
      ${e.type === "text" ? h(this, u, Vr).call(this, e) : p}
      ${e.type === "image" ? h(this, u, Hr).call(this, e) : p}
      ${e.type === "badges" ? h(this, u, jr).call(this, e) : p}
      ${e.type === "rect" ? h(this, u, Gr).call(this, e) : p}
      ${h(this, u, Xr).call(this, e)} ${h(this, u, Jr).call(this, e)}
    `;
};
Kr = function(e) {
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
            @change=${(i) => h(this, u, g).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, hi).call(this, t.propertyAlias ?? "", (i) => h(this, u, g).call(this, { binding: { ...t, propertyAlias: i } }))}
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
Vr = function(e) {
  const t = e.style, i = (a) => h(this, u, g).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, u, io).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, u, Zr).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
Hr = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${Qr(t.kind)}
            @change=${(a) => h(this, u, g).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, u, hi).call(this, t.propertyAlias ?? "", (a) => h(this, u, g).call(this, { source: { ...t, propertyAlias: a } }), "media")}
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
            .options=${ee(["cover", "contain", "stretch"], e.fit)}
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
jr = function(e) {
  const t = (s) => h(this, u, g).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, u, g).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, u, g).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, u, hi).call(this, e.itemsPropertyAlias, (s) => h(this, u, g).call(this, { itemsPropertyAlias: s }))}
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
            .options=${ee(["horizontal", "vertical"], e.direction)}
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
                  .options=${h(this, u, io).call(this, e.label.fontKey)}
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
                  .options=${ee(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
Gr = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${ee(["rectangle", "ellipse", "polygon", "star"], t)}
            @change=${(s) => h(this, u, g).call(this, { shape: s.target.value })}>
          </uui-select>
        </label>

        ${t === "polygon" || t === "star" ? r`
              <div class="pair">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  min=${Yn}
                  max=${qn}
                  .value=${e.sides ?? 5}
                  @change=${(s) => h(this, u, g).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      min=${Jn}
                      max=${Zn}
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
Xr = function(e) {
  const t = Pe(e.position, "x"), i = Pe(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, u, Ps).call(this, e, "x")} ${h(this, u, Ps).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, u, qr).call(this, e, s.detail.value)}>
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
            @change=${(s) => h(this, u, g).call(this, { rotation: vn(s.detail.value ?? 0) })}>
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
Ps = function(e, t) {
  const i = Pe(e.position, t), a = wa(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => h(this, u, Yr).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => h(this, u, fa).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${ee(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => h(this, u, fa).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                label="Gap"
                .value=${a.gap}
                @change=${(n) => h(this, u, fa).call(this, e, t, { gap: n.detail.value ?? 0 })}>
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
Yr = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Pe(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && h(this, u, g).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: fc
      }
    }
  });
};
fa = function(e, t, i) {
  const a = wa(e.position, t);
  a && h(this, u, g).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
qr = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? hc(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, u, g).call(this, { position: s });
};
Jr = function(e) {
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
            .options=${ee(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
              ${h(this, u, hi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, u, g).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
hi = function(e, t, i) {
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
io = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
Zr = function(e, t, i) {
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
    const o = s.target.value, n = a.styles.find((c) => c.name === o);
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
Gi([
  y({ type: Object })
], Et.prototype, "template", 2);
Gi([
  y({ type: Object })
], Et.prototype, "layer", 2);
Gi([
  y({ type: Array })
], Et.prototype, "properties", 2);
Gi([
  y({ type: Array })
], Et.prototype, "fonts", 2);
Et = Gi([
  I("di-layer-inspector")
], Et);
function ee(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function Qr(e) {
  return ee(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var Uu = Object.defineProperty, Bu = Object.getOwnPropertyDescriptor, el = (e) => {
  throw TypeError(e);
}, Xi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Uu(t, i, s), s;
}, Ku = (e, t, i) => t.has(e) || el("Cannot " + i), Vu = (e, t, i) => t.has(e) ? el("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), we = (e, t, i) => (Ku(e, t, "access private method"), i), ue, yt, tl, il, al, sl;
const Hu = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Dt = class extends W {
  constructor() {
    super(...arguments), Vu(this, ue), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${we(this, ue, al)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : R(
      e,
      (t) => t.key,
      (t, i) => we(this, ue, sl).call(this, t, i)
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
tl = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
il = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
al = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  we(this, ue, yt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
sl = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => we(this, ue, tl).call(this, a, e.key)}
        @dragover=${(a) => we(this, ue, il).call(this, a, t)}
        @click=${() => we(this, ue, yt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Hu[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          look="secondary"
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), we(this, ue, yt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name=${e.isVisible ? "icon-eye" : "icon-eye-off"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), we(this, ue, yt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), we(this, ue, yt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), we(this, ue, yt).call(this, "di-layer-delete", { key: e.key });
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
Xi([
  y({ type: Array })
], Dt.prototype, "layers", 2);
Xi([
  y({ type: String })
], Dt.prototype, "selectedLayerKey", 2);
Xi([
  f()
], Dt.prototype, "_dragKey", 2);
Xi([
  f()
], Dt.prototype, "_dropIndex", 2);
Dt = Xi([
  I("di-layers-panel")
], Dt);
var ju = Object.defineProperty, Gu = Object.getOwnPropertyDescriptor, ol = (e) => {
  throw TypeError(e);
}, Be = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ju(t, i, s), s;
}, Xu = (e, t, i) => t.has(e) || ol("Cannot " + i), Yu = (e, t, i) => t.has(e) ? ol("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fe = (e, t, i) => (Xu(e, t, "access private method"), i), se, je, _i;
let _e = class extends W {
  constructor() {
    super(...arguments), Yu(this, se), this.zoom = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1;
  }
  render() {
    return r`
      <div class="toolbar">
        <div class="zoom">
          <uui-button compact look="secondary" label="Zoom out" @click=${() => fe(this, se, je).call(this, "di-zoom-change", { zoom: this.zoom / 1.25 })}>
            <uui-icon name="icon-remove"></uui-icon>
          </uui-button>
          <span class="value">${Math.round(this.zoom * 100)}%</span>
          <uui-button compact look="secondary" label="Zoom in" @click=${() => fe(this, se, je).call(this, "di-zoom-change", { zoom: this.zoom * 1.25 })}>
            <uui-icon name="icon-add"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => fe(this, se, je).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${fe(this, se, _i).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${fe(this, se, _i).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${fe(this, se, _i).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${fe(this, se, _i).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => fe(this, se, je).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => fe(this, se, je).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => fe(this, se, je).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
se = /* @__PURE__ */ new WeakSet();
je = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
_i = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => fe(this, se, je).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
_e.styles = O`
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
  y({ type: Number })
], _e.prototype, "zoom", 2);
Be([
  y({ type: Boolean })
], _e.prototype, "snapEnabled", 2);
Be([
  y({ type: Boolean })
], _e.prototype, "showRulers", 2);
Be([
  y({ type: Boolean })
], _e.prototype, "showSafeArea", 2);
Be([
  y({ type: Boolean })
], _e.prototype, "showMeasured", 2);
Be([
  y({ type: Boolean })
], _e.prototype, "canUndo", 2);
Be([
  y({ type: Boolean })
], _e.prototype, "canRedo", 2);
Be([
  y({ type: Boolean })
], _e.prototype, "previewing", 2);
_e = Be([
  I("di-canvas-toolbar")
], _e);
var qu = Object.defineProperty, Ju = Object.getOwnPropertyDescriptor, nl = (e) => {
  throw TypeError(e);
}, Yi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ju(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && qu(t, i, s), s;
}, ao = (e, t, i) => t.has(e) || nl("Cannot " + i), re = (e, t, i) => (ao(e, t, "read from private field"), t.get(e)), gi = (e, t, i) => t.has(e) ? nl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mi = (e, t, i, a) => (ao(e, t, "write to private field"), t.set(e, i), i), Nt = (e, t, i) => (ao(e, t, "access private method"), i), et, zi, Kt, kt, qe, so, ma, rl;
const Zu = 400;
let Pt = class extends W {
  constructor() {
    super(), gi(this, qe), gi(this, et), gi(this, zi), gi(this, Kt), gi(this, kt), this._loading = !1, this._collapsed = !1, this.consumeContext(zt, (e) => {
      Mi(this, et, e), e && (this.observe(e.template, (t) => {
        t && Nt(this, qe, ma).call(this, t);
      }), this.observe(e.sampleContentKey, () => {
        var i;
        const t = (i = re(this, et)) == null ? void 0 : i.getData();
        t && Nt(this, qe, ma).call(this, t);
      }));
    });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(re(this, zi)), (e = re(this, Kt)) == null || e.abort(), Nt(this, qe, so).call(this);
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
        t && Nt(this, qe, ma).call(this, t);
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
zi = /* @__PURE__ */ new WeakMap();
Kt = /* @__PURE__ */ new WeakMap();
kt = /* @__PURE__ */ new WeakMap();
qe = /* @__PURE__ */ new WeakSet();
so = function() {
  re(this, kt) && (URL.revokeObjectURL(re(this, kt)), Mi(this, kt, void 0));
};
ma = function(e) {
  this._collapsed || (window.clearTimeout(re(this, zi)), Mi(this, zi, window.setTimeout(() => void Nt(this, qe, rl).call(this, e), Zu)));
};
rl = async function(e) {
  var t;
  if (re(this, et)) {
    (t = re(this, Kt)) == null || t.abort(), Mi(this, Kt, new AbortController()), this._loading = !0, this._error = void 0;
    try {
      const i = (re(this, et).getData(), void 0), a = await Rs(
        e,
        { signal: re(this, Kt).signal, useSampleData: !0, contentKey: i },
        re(this, et).getToken
      );
      Nt(this, qe, so).call(this), Mi(this, kt, URL.createObjectURL(a)), this._url = re(this, kt);
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
Yi([
  f()
], Pt.prototype, "_url", 2);
Yi([
  f()
], Pt.prototype, "_loading", 2);
Yi([
  f()
], Pt.prototype, "_error", 2);
Yi([
  f()
], Pt.prototype, "_collapsed", 2);
Pt = Yi([
  I("di-preview-strip")
], Pt);
var Qu = Object.defineProperty, eh = Object.getOwnPropertyDescriptor, ll = (e) => {
  throw TypeError(e);
}, ie = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? eh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Qu(t, i, s), s;
}, oo = (e, t, i) => t.has(e) || ll("Cannot " + i), v = (e, t, i) => (oo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ot = (e, t, i) => t.has(e) ? ll("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Da = (e, t, i, a) => (oo(e, t, "write to private field"), t.set(e, i), i), Q = (e, t, i) => (oo(e, t, "access private method"), i), w, Oi, Ii, Vt, F, Ms, no, cl, zs, ul, hl, dl, Os, pl, fl, ml, ro, gl, ga;
const th = 400;
let j = class extends W {
  constructor() {
    super(), Ot(this, F), Ot(this, w), Ot(this, Oi), Ot(this, Ii), Ot(this, Vt), this._properties = [], this._fonts = [], this._serverBounds = [], this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, Ot(this, ga, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = v(this, w);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = v(this, F, Ms);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), Q(this, F, zs).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, c = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, d = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, m = Pe(s.position, "x") ? 0 : c, T = Pe(s.position, "y") ? 0 : d;
            if (m === 0 && T === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + m, y: s.position.y + T }
            });
            break;
          }
          case "[":
          case "]": {
            const n = ((o = this._template) == null ? void 0 : o.layers.findIndex((c) => c.key === s.key)) ?? -1;
            if (n < 0) return;
            e.preventDefault(), i.moveLayer(s.key, e.key === "]" ? n + 1 : n - 1);
            break;
          }
        }
      }
    }), this.consumeContext(Oa, (e) => {
      Da(this, Oi, e);
    }), this.consumeContext(zt, (e) => {
      Da(this, w, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (Q(this, F, ul).call(this, t), Q(this, F, hl).call(this, t), Q(this, F, dl).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", v(this, ga));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", v(this, ga)), window.clearTimeout(v(this, Ii)), (e = v(this, Vt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = v(this, w)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = v(this, w)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = v(this, w)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => Q(this, F, zs).call(this, e.detail.key)}
        @di-layer-detach=${(e) => Q(this, F, cl).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = v(this, w)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = v(this, w)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = v(this, w)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = v(this, w)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = v(this, w)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = v(this, w)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => Q(this, F, Os).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => Q(this, F, Os).call(this, e.detail.payload, e.detail.x, e.detail.y)}
        @di-pick-base-image=${Q(this, F, fl)}
        @di-pick-layer-image=${(e) => Q(this, F, ml).call(this, e.detail.key)}
        @di-use-image-size=${Q(this, F, gl)}
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
      return (e = v(this, w)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = v(this, w)) == null ? void 0 : e.redo();
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
            .layer=${v(this, F, Ms)}
            .properties=${this._properties}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    ` : r`<div class="state"><uui-loader></uui-loader></div>`;
  }
};
w = /* @__PURE__ */ new WeakMap();
Oi = /* @__PURE__ */ new WeakMap();
Ii = /* @__PURE__ */ new WeakMap();
Vt = /* @__PURE__ */ new WeakMap();
F = /* @__PURE__ */ new WeakSet();
Ms = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
no = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
cl = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((c) => c.key === e);
  if (!i) return;
  const a = (o = v(this, F, no)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = v(this, w)) == null || n.updateLayer(e, { position: rs(i.position, t, a) });
};
zs = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = v(this, F, no)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = v(this, w)) == null || s.removeLayer(e, t);
};
ul = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && v(this, w) && await Fn(t, v(this, w).getToken);
};
hl = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !v(this, w)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Fs(t.mediaKey, v(this, w).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
dl = function() {
  window.clearTimeout(v(this, Ii)), Da(this, Ii, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !v(this, w))) {
      (t = v(this, Vt)) == null || t.abort(), Da(this, Vt, new AbortController());
      try {
        const i = await Ws(
          e,
          { signal: v(this, Vt).signal, useSampleData: !0 },
          v(this, w).getToken
        );
        v(this, w).setServerBounds(i.layers), v(this, w).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, th));
};
Os = function(e, t, i) {
  const a = this._template;
  if (!a || !v(this, w)) return;
  const s = { template: a, x: t, y: i, defaultFontKey: Q(this, F, pl).call(this) }, o = e.kind === "property" ? lc(e.property, s) : e.layerType === "image" ? mn(s, "Image") : e.layerType === "badges" ? gn(s, "Badges", "") : e.layerType === "rect" ? nc(s, "Shape", e.shape) : fn(s, "Text", { kind: "static", text: "Text" });
  v(this, w).addLayer(o);
};
pl = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
fl = async function() {
  var t;
  const e = await Q(this, F, ro).call(this);
  e && ((t = v(this, w)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
ml = async function(e) {
  var i;
  const t = await Q(this, F, ro).call(this);
  t && ((i = v(this, w)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
ro = async function() {
  if (!v(this, Oi)) return;
  const e = v(this, Oi).open(this, Uo, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
gl = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !v(this, w)) return;
  const t = await Fs(e.mediaKey, v(this, w).getToken).catch(() => {
  });
  t && v(this, w).updateCanvas({ width: t.width, height: t.height });
};
ga = /* @__PURE__ */ new WeakMap();
j.styles = O`
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
ie([
  f()
], j.prototype, "_template", 2);
ie([
  f()
], j.prototype, "_selectedKey", 2);
ie([
  f()
], j.prototype, "_properties", 2);
ie([
  f()
], j.prototype, "_fonts", 2);
ie([
  f()
], j.prototype, "_serverBounds", 2);
ie([
  f()
], j.prototype, "_baseImageUrl", 2);
ie([
  f()
], j.prototype, "_zoom", 2);
ie([
  f()
], j.prototype, "_snapEnabled", 2);
ie([
  f()
], j.prototype, "_showRulers", 2);
ie([
  f()
], j.prototype, "_showSafeArea", 2);
ie([
  f()
], j.prototype, "_showMeasured", 2);
ie([
  f()
], j.prototype, "_canUndo", 2);
ie([
  f()
], j.prototype, "_canRedo", 2);
j = ie([
  I("di-design-view")
], j);
const ih = j, ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return j;
  },
  default: ih
}, Symbol.toStringTag, { value: "Module" }));
var sh = Object.defineProperty, oh = Object.getOwnPropertyDescriptor, yl = (e) => {
  throw TypeError(e);
}, ht = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? oh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && sh(t, i, s), s;
}, lo = (e, t, i) => t.has(e) || yl("Cannot " + i), V = (e, t, i) => (lo(e, t, "read from private field"), t.get(e)), It = (e, t, i) => t.has(e) ? yl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ht = (e, t, i, a) => (lo(e, t, "write to private field"), t.set(e, i), i), G = (e, t, i) => (lo(e, t, "access private method"), i), ye, Ai, Li, jt, St, U, Pa, vl, co, uo, bl, _l, Ri, $l, wl, xl;
const nh = [
  { label: "Short", value: "Ship it" },
  { label: "Typical", value: "Designing social share images that actually get clicked" },
  {
    label: "Very long",
    value: "Everything you ever wanted to know about generating Open Graph images from your content, and rather more besides"
  }
];
let pe = class extends W {
  constructor() {
    super(), It(this, U), It(this, ye), It(this, Ai), It(this, Li), It(this, jt), It(this, St), this._bounds = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Oa, (e) => {
      Ht(this, Ai, e);
    }), this.consumeContext(lt, (e) => {
      Ht(this, Li, e);
    }), this.consumeContext(zt, (e) => {
      Ht(this, ye, e), e && this.observe(e.template, (t) => {
        this._template = t;
      });
    });
  }
  connectedCallback() {
    super.connectedCallback();
    const e = G(this, U, vl).call(this);
    e && (this._sampleNode = e), G(this, U, Ri).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = V(this, jt)) == null || e.abort(), G(this, U, uo).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${G(this, U, bl)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => G(this, U, Ri).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${G(this, U, wl)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
          ${this._error ? r`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? r`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : p}

          <div class="presets">
            <span>Try a title length:</span>
            ${R(
      nh,
      (e) => e.label,
      (e) => r`
                <uui-button
                  compact
                  look="secondary"
                  label="Preview with a ${e.label.toLowerCase()} title"
                  @click=${() => G(this, U, _l).call(this, e.value)}>
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
                      <uui-table-cell>${G(this, U, xl).call(this, e.key)}</uui-table-cell>
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
                @click=${G(this, U, $l)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
ye = /* @__PURE__ */ new WeakMap();
Ai = /* @__PURE__ */ new WeakMap();
Li = /* @__PURE__ */ new WeakMap();
jt = /* @__PURE__ */ new WeakMap();
St = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakSet();
Pa = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
vl = function() {
  try {
    const e = localStorage.getItem(G(this, U, Pa).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
co = function(e) {
  try {
    e ? localStorage.setItem(G(this, U, Pa).call(this), JSON.stringify(e)) : localStorage.removeItem(G(this, U, Pa).call(this));
  } catch {
  }
};
uo = function() {
  V(this, St) && (URL.revokeObjectURL(V(this, St)), Ht(this, St, void 0));
};
bl = async function() {
  var i, a, s;
  if (!V(this, Ai) || !this._template) return;
  const e = V(this, Ai).open(this, Nc, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, G(this, U, co).call(this, t.item), (s = V(this, ye)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await G(this, U, Ri).call(this));
};
_l = async function(e) {
  this._template && (this._sampleNode = void 0, G(this, U, co).call(this, void 0), await G(this, U, Ri).call(this, e));
};
Ri = async function(e) {
  var a, s;
  const t = this._template;
  if (!t || !V(this, ye)) return;
  (a = V(this, jt)) == null || a.abort(), Ht(this, jt, new AbortController()), this._loading = !0, this._error = void 0;
  const i = {
    signal: V(this, jt).signal,
    contentKey: (s = this._sampleNode) == null ? void 0 : s.key,
    useSampleData: !this._sampleNode,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [o, n] = await Promise.all([
      Rs(t, i, V(this, ye).getToken),
      Ws(t, i, V(this, ye).getToken)
    ]);
    G(this, U, uo).call(this), Ht(this, St, URL.createObjectURL(o)), this._url = V(this, St), this._bounds = n.layers, V(this, ye).setServerBounds(n.layers), V(this, ye).setIssues(n.issues);
  } catch (o) {
    if ((o == null ? void 0 : o.name) === "AbortError") return;
    this._error = o instanceof Error ? o.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
$l = async function() {
  var e, t;
  if (!(!this._sampleNode || !V(this, ye))) {
    this._regenerating = !0;
    try {
      const i = await Ia(this._sampleNode.key, V(this, ye).getToken);
      (e = V(this, Li)) == null || e.peek(i.outcome === "generated" ? "positive" : "warning", {
        data: { message: `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = V(this, Li)) == null || t.peek("danger", {
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
wl = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
xl = function(e) {
  var i;
  const t = (i = this._template) == null ? void 0 : i.layers.find((a) => a.key === e);
  return (t == null ? void 0 : t.name) || (t == null ? void 0 : t.type) || e.slice(0, 8);
};
pe.styles = O`
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
  f()
], pe.prototype, "_template", 2);
ht([
  f()
], pe.prototype, "_sampleNode", 2);
ht([
  f()
], pe.prototype, "_bounds", 2);
ht([
  f()
], pe.prototype, "_url", 2);
ht([
  f()
], pe.prototype, "_loading", 2);
ht([
  f()
], pe.prototype, "_error", 2);
ht([
  f()
], pe.prototype, "_regenerating", 2);
pe = ht([
  I("di-preview-view")
], pe);
const rh = pe, lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return pe;
  },
  default: rh
}, Symbol.toStringTag, { value: "Module" }));
var ch = Object.defineProperty, uh = Object.getOwnPropertyDescriptor, kl = (e) => {
  throw TypeError(e);
}, ja = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? uh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ch(t, i, s), s;
}, ho = (e, t, i) => t.has(e) || kl("Cannot " + i), N = (e, t, i) => (ho(e, t, "read from private field"), i ? i.call(e) : t.get(e)), es = (e, t, i) => t.has(e) ? kl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Io = (e, t, i, a) => (ho(e, t, "write to private field"), t.set(e, i), i), tt = (e, t, i) => (ho(e, t, "access private method"), i), H, Mt, ve, Sl, Tl, Cl, El, Dl, Pl, Ml, zl, Ol;
let nt = class extends W {
  constructor() {
    super(), es(this, ve), es(this, H), es(this, Mt), this._properties = [], this._showAdvanced = !1, this.consumeContext(Oa, (e) => {
      Io(this, Mt, e);
    }), this.consumeContext(zt, (e) => {
      Io(this, H, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${tt(this, ve, Pl).call(this)} ${tt(this, ve, Ml).call(this)} ${tt(this, ve, zl).call(this)} ${tt(this, ve, Ol).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
H = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
ve = /* @__PURE__ */ new WeakSet();
Sl = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Tl = async function() {
  var a, s;
  if (!N(this, Mt) || !this._template) return;
  const e = N(this, Mt).open(this, jl, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await tt(this, ve, Cl).call(this, t.selection.filter((o) => !!o));
  (a = N(this, H)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = N(this, H)) == null ? void 0 : s.reloadProperties());
};
Cl = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => oc), i = await t(N(this, H).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
El = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = N(this, H)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = N(this, H)) == null || s.reloadProperties();
};
Dl = async function() {
  var i;
  if (!N(this, Mt)) return;
  const e = N(this, Mt).open(this, Uo, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = N(this, H)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
Pl = function() {
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
                          @click=${() => tt(this, ve, El).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${tt(this, ve, Tl)}>
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
    ...N(this, ve, Sl).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = N(this, H)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = N(this, H)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Ml = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${tt(this, ve, Dl)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = N(this, H)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
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
    return (i = N(this, H)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = N(this, H)) == null ? void 0 : i.updateOutput({
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
    return (i = N(this, H)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
zl = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = N(this, H)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = N(this, H)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Ol = function() {
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
    return (i = N(this, H)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
nt.styles = O`
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
ja([
  f()
], nt.prototype, "_template", 2);
ja([
  f()
], nt.prototype, "_properties", 2);
ja([
  f()
], nt.prototype, "_showAdvanced", 2);
nt = ja([
  I("di-settings-view")
], nt);
const hh = nt, dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return nt;
  },
  default: hh
}, Symbol.toStringTag, { value: "Module" }));
var ph = Object.defineProperty, fh = Object.getOwnPropertyDescriptor, Il = (e) => {
  throw TypeError(e);
}, qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? fh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ph(t, i, s), s;
}, po = (e, t, i) => t.has(e) || Il("Cannot " + i), Ao = (e, t, i) => (po(e, t, "read from private field"), t.get(e)), Lo = (e, t, i) => t.has(e) ? Il("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), mh = (e, t, i, a) => (po(e, t, "write to private field"), t.set(e, i), i), Ro = (e, t, i) => (po(e, t, "access private method"), i), Wi, ya, Is;
let Fe = class extends W {
  constructor() {
    super(), Lo(this, ya), Lo(this, Wi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(zt, (e) => {
      mh(this, Wi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Ro(this, ya, Is).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Ro(this, ya, Is).call(this)}>Reload</uui-button>
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
Wi = /* @__PURE__ */ new WeakMap();
ya = /* @__PURE__ */ new WeakSet();
Is = async function() {
  const e = this._template;
  if (!(!e || !Ao(this, Wi))) {
    this._loading = !0;
    try {
      this._usage = await cn(e.key, Ao(this, Wi).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Fe.styles = O`
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
qi([
  f()
], Fe.prototype, "_template", 2);
qi([
  f()
], Fe.prototype, "_usage", 2);
qi([
  f()
], Fe.prototype, "_loading", 2);
qi([
  f()
], Fe.prototype, "_onlyMissing", 2);
Fe = qi([
  I("di-usage-view")
], Fe);
const gh = Fe, yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Fe;
  },
  default: gh
}, Symbol.toStringTag, { value: "Module" })), vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: $o,
  default: $o
}, Symbol.toStringTag, { value: "Module" })), bh = 1500;
var me, wt, za, Al;
class ts extends Xl {
  constructor(i, a) {
    super(i, a);
    $(this, za);
    $(this, me);
    $(this, wt);
    this.consumeContext(lt, (s) => {
      b(this, me, s);
    }), this.consumeContext(zt, (s) => {
      b(this, wt, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = l(this, wt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = l(this, me)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await As(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const c = await nn(a.key, !1, i.getToken);
        (o = l(this, me)) == null || o.peek("positive", {
          data: { message: `Regenerating ${c.total} item(s)…` }
        }), await D(this, za, Al).call(this, c, i);
      } catch (c) {
        (n = l(this, me)) == null || n.peek("danger", {
          data: {
            headline: "Regeneration could not be started",
            message: c instanceof Error ? c.message : ""
          }
        });
      }
    }
  }
  /** Exposed so a future progress UI can stop a long run; the endpoint already supports it. */
  async cancel(i) {
    l(this, wt) && await ln(i, l(this, wt).getToken);
  }
}
me = new WeakMap(), wt = new WeakMap(), za = new WeakSet(), Al = async function(i, a) {
  var o, n, c, d;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((m) => setTimeout(m, bh));
    try {
      s = await rn(s.id, a.getToken);
    } catch {
      (o = l(this, me)) == null || o.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }
  if (s.status === "completed") {
    const m = s.failures.length;
    (n = l(this, me)) == null || n.peek(m > 0 ? "warning" : "positive", {
      data: {
        headline: "Regeneration finished",
        message: `${s.generated} generated, ${s.skipped} skipped${m > 0 ? `, ${m} failed` : ""}.`
      }
    });
    for (const T of s.failures.slice(0, 3))
      (c = l(this, me)) == null || c.peek("danger", { data: { message: T } });
  } else
    (d = l(this, me)) == null || d.peek("danger", {
      data: { headline: `Regeneration ${s.status}`, message: s.failures[0] ?? "" }
    });
};
const _h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: ts,
  api: ts,
  default: ts
}, Symbol.toStringTag, { value: "Module" }));
var Ui, ei;
class is extends Zl {
  constructor(i, a) {
    super(i, a);
    $(this, Ui);
    $(this, ei);
    this.consumeContext(Ne, (s) => {
      b(this, Ui, s);
    }), this.consumeContext(lt, (s) => {
      b(this, ei, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Ia(i, () => {
          var n;
          return (n = l(this, Ui)) == null ? void 0 : n.getLatestToken();
        });
        (a = l(this, ei)) == null || a.peek(o.outcome === "generated" ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: o.outcome === "generated" ? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof at && o.status === 404;
        (s = l(this, ei)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof at ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Ui = new WeakMap(), ei = new WeakMap();
const $h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: is,
  api: is,
  default: is
}, Symbol.toStringTag, { value: "Module" }));
var Bi, xt, Ki, ti;
class as extends Ql {
  constructor(i, a) {
    super(i, a);
    $(this, Bi);
    $(this, xt);
    $(this, Ki);
    $(this, ti);
    this.consumeContext(Ne, (s) => {
      b(this, Bi, s);
    }), this.consumeContext(lt, (s) => {
      b(this, xt, s);
    }), this.consumeContext(ec, (s) => {
      b(this, Ki, s);
    }), this.consumeContext(tc, (s) => {
      b(this, ti, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!l(this, ti)) {
      (i = l(this, xt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Ia(l(this, ti), () => {
        var c;
        return (c = l(this, Bi)) == null ? void 0 : c.getLatestToken();
      });
      n.propertyValue && ((a = l(this, Ki)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = l(this, xt)) == null || s.peek("positive", {
        data: { headline: "Dynamic Images", message: "The image has been regenerated." }
      });
    } catch (n) {
      const c = n instanceof at && n.status === 404;
      (o = l(this, xt)) == null || o.peek(c ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof at ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Bi = new WeakMap(), xt = new WeakMap(), Ki = new WeakMap(), ti = new WeakMap();
const wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: as,
  api: as,
  default: as
}, Symbol.toStringTag, { value: "Module" }));
var xh = Object.defineProperty, kh = Object.getOwnPropertyDescriptor, Ll = (e) => {
  throw TypeError(e);
}, Ga = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && xh(t, i, s), s;
}, fo = (e, t, i) => t.has(e) || Ll("Cannot " + i), Ma = (e, t, i) => (fo(e, t, "read from private field"), t.get(e)), ia = (e, t, i) => t.has(e) ? Ll("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Rl = (e, t, i, a) => (fo(e, t, "write to private field"), t.set(e, i), i), Lt = (e, t, i) => (fo(e, t, "access private method"), i), va, Fi, mo, Ge, go, Wl, ba;
let rt = class extends No {
  constructor() {
    super(), ia(this, Ge), ia(this, va), ia(this, Fi), this._items = [], this._loading = !0, this._search = "", ia(this, mo, () => {
      var e;
      return (e = Ma(this, va)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ne, (e) => {
      Rl(this, va, e), e && Lt(this, Ge, go).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(Ma(this, Fi));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${Lt(this, Ge, Wl)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Lt(this, Ge, ba).call(this, void 0)}>
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
                      @open=${() => Lt(this, Ge, ba).call(this, e)}
                      @click=${() => Lt(this, Ge, ba).call(this, e)}>
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
va = /* @__PURE__ */ new WeakMap();
Fi = /* @__PURE__ */ new WeakMap();
mo = /* @__PURE__ */ new WeakMap();
Ge = /* @__PURE__ */ new WeakSet();
go = async function() {
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
        (a) => on(a, this._search, 0, 30, Ma(this, mo)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
Wl = function(e) {
  this._search = e.target.value, window.clearTimeout(Ma(this, Fi)), Rl(this, Fi, window.setTimeout(() => void Lt(this, Ge, go).call(this), 300));
};
ba = function(e) {
  this.value = { item: e }, this._submitModal();
};
rt.styles = O`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
Ga([
  f()
], rt.prototype, "_items", 2);
Ga([
  f()
], rt.prototype, "_loading", 2);
Ga([
  f()
], rt.prototype, "_search", 2);
rt = Ga([
  I("di-sample-node-picker-modal")
], rt);
const Sh = rt, Th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return rt;
  },
  default: Sh
}, Symbol.toStringTag, { value: "Module" }));
var Ch = Object.defineProperty, Eh = Object.getOwnPropertyDescriptor, Fl = (e) => {
  throw TypeError(e);
}, Ke = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Eh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ch(t, i, s), s;
}, yo = (e, t, i) => t.has(e) || Fl("Cannot " + i), ni = (e, t, i) => (yo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ss = (e, t, i) => t.has(e) ? Fl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Dh = (e, t, i, a) => (yo(e, t, "write to private field"), t.set(e, i), i), Rt = (e, t, i) => (yo(e, t, "access private method"), i), _a, Ji, xe, Nl, Ul, vo, Bl, Kl, Vl, Hl;
const Ph = [100, 200, 300, 400, 500, 600, 700, 800, 900], Mh = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let ce = class extends No {
  constructor() {
    super(), ss(this, xe), ss(this, _a), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", ss(this, Ji, () => {
      var e;
      return (e = ni(this, _a)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ne, (e) => {
      Dh(this, _a, e);
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
            @change=${Rt(this, xe, Nl)} />
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
            @click=${Rt(this, xe, Ul)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Mh.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? Rt(this, xe, Hl).call(this) : Rt(this, xe, Vl).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !ni(this, xe, vo)}
            @click=${Rt(this, xe, Bl)}>
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
_a = /* @__PURE__ */ new WeakMap();
Ji = /* @__PURE__ */ new WeakMap();
xe = /* @__PURE__ */ new WeakSet();
Nl = async function(e) {
  const t = e.target.files;
  if (!(!t || t.length === 0)) {
    this._busy = !0, this._error = void 0;
    try {
      for (const i of Array.from(t))
        await qo(i, ni(this, Ji));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (i) {
      this._error = i instanceof Error ? i.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Ul = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await Jo(this._path.trim(), ni(this, Ji)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
vo = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
Bl = async function() {
  if (ni(this, xe, vo)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await Zo(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        ni(this, Ji)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
Kl = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Vl = function() {
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
    Ph,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => Rt(this, xe, Kl).call(this, e, t.target.checked)}>
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
Hl = function() {
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
ce.styles = O`
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
  f()
], ce.prototype, "_busy", 2);
Ke([
  f()
], ce.prototype, "_error", 2);
Ke([
  f()
], ce.prototype, "_path", 2);
Ke([
  f()
], ce.prototype, "_provider", 2);
Ke([
  f()
], ce.prototype, "_family", 2);
Ke([
  f()
], ce.prototype, "_weights", 2);
Ke([
  f()
], ce.prototype, "_italic", 2);
Ke([
  f()
], ce.prototype, "_url", 2);
ce = Ke([
  I("di-font-upload-modal")
], ce);
const zh = ce, Oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return ce;
  },
  default: zh
}, Symbol.toStringTag, { value: "Module" }));
export {
  wc as manifests,
  Yh as onInit
};
//# sourceMappingURL=dynamic-images.js.map
