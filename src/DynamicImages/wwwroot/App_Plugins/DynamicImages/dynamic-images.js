var tr = (e) => {
  throw TypeError(e);
};
var Ns = (e, t, i) => t.has(e) || tr("Cannot " + i);
var c = (e, t, i) => (Ns(e, t, "read from private field"), i ? i.call(e) : t.get(e)), k = (e, t, i) => t.has(e) ? tr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (Ns(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), E = (e, t, i) => (Ns(e, t, "access private method"), i);
var Bs = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as Kd, UmbEntityWorkspaceDataManager as Vd, UmbSubmitWorkspaceAction as Ji, UmbEntityNamedDetailWorkspaceContextBase as Qo, UMB_WORKSPACE_CONTEXT as qd, UmbEntityDetailWorkspaceContextBase as Gd, UmbWorkspaceActionBase as Yd } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as wt, UmbContextConsumerController as Hd } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as ba, UmbItemRepositoryBase as Xd, UmbItemServerDataSourceBase as Jd, UmbRepositoryBase as Oi } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as _a, UmbItemStoreBase as Zd } from "@umbraco-cms/backoffice/store";
import { UmbId as fl } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as Qd, UMB_DATE_TIME_VALUE_TYPE as ep } from "@umbraco-cms/backoffice/value-type";
import { nothing as h, html as r, css as A, state as y, customElement as I, ifDefined as Zi, property as f, repeat as te, classMap as gl, styleMap as U } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as P } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as vl, UmbTreeRepositoryBase as bl } from "@umbraco-cms/backoffice/tree";
import { UMB_ACTION_EVENT_CONTEXT as Ht } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent as Ai, UmbRequestReloadStructureForEntityEvent as _l, UmbEntityActionBase as wa } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT as Z } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as wl } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UMB_AUTH_CONTEXT as Ae } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as en, UMB_DISCARD_CHANGES_MODAL as tp, umbConfirmModal as $l, UmbModalToken as xl, UmbModalBaseElement as kl } from "@umbraco-cms/backoffice/modal";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as Tl } from "@umbraco-cms/backoffice/entity";
import { UmbDefaultCollectionContext as Sl } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as Dl, UmbDeselectedEvent as El } from "@umbraco-cms/backoffice/event";
import "@umbraco-cms/backoffice/document-type";
import "@umbraco-cms/backoffice/media";
import { UmbArrayState as Ri, UmbStringState as ir, UmbObjectState as ar, UmbBooleanState as Aa, UmbNumberState as ip } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as ap } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as sp } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as op } from "@umbraco-cms/backoffice/document";
import { UmbTextStyles as np } from "@umbraco-cms/backoffice/style";
import { tryExecute as rp } from "@umbraco-cms/backoffice/resources";
const Cs = "dynamic-images", Is = "di-template", ro = "di:templates-changed", lp = "/umbraco/management/api/v1/dynamic-images";
class jt extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function g(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${lp}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await cp(n);
  return n;
}
async function cp(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new jt(t, e.status, i);
}
const w = async (e) => e.json();
async function up(e) {
  const t = await g("/templates?take=500", e);
  return (await w(t)).items;
}
const tn = async (e, t) => w(await g(`/templates/${e}`, t)), dp = async (e, t) => w(await g("/templates", t, { method: "POST", json: e })), pp = async (e, t) => w(await g(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function hp(e, t) {
  await g(`/templates/${e}`, t, { method: "DELETE" });
}
const mp = async (e, t, i) => w(await g(`/templates/${e}/duplicate`, i, { method: "POST", json: { targetKey: t } })), yp = async (e, t, i) => w(await g(`/templates/${e}/enabled`, i, { method: "PUT", json: { isEnabled: t } }));
async function fp(e, t) {
  return (await g(`/templates/${e}/export`, t)).blob();
}
const gp = async (e, t, i, a = null) => w(await g("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function Os(e, t, i, a) {
  const s = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && s.set("foldersOnly", "true"), a && s.set("parentKey", a), s.toString();
}
const sr = async (e, t, i, a) => w(await g(`/tree/root?${Os(e, t, i)}`, a)), vp = async (e, t, i, a, s) => w(await g(`/tree/children?${Os(t, i, a, e)}`, s)), bp = async (e, t) => w(await g(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function As(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return w(await g(`/item?${i}`, t));
}
async function _p(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), w(await g(`/collection/templates?${i}`, t));
}
async function wp(e, t, i) {
  return (await g(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const $p = async (e, t) => w(await g("/folders", t, { method: "POST", json: e })), xp = async (e, t) => w(await g(`/folders/${e}`, t)), kp = async (e, t, i) => w(await g(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function Cl(e, t) {
  await g(`/folders/${e}`, t, { method: "DELETE" });
}
async function Tp(e, t, i) {
  await g(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Sp(e, t, i) {
  await g(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Dp(e, t, i) {
  await g("/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const Ep = async (e, t, i) => w(await g("/templates/bulk-duplicate", i, { method: "POST", json: { keys: e, targetKey: t } }));
async function Cp(e, t, i) {
  await g("/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
const lo = async (e) => w(await g("/fonts", e)), Ip = async (e, t) => w(await g(`/fonts/${e}`, t));
async function Op(e, t, i = {}) {
  const a = new FormData();
  return a.append("file", e), i.familyKey && a.append("familyKey", i.familyKey), i.parentKey && a.append("parentKey", i.parentKey), w(await g("/fonts", t, { method: "POST", body: a }));
}
const Ap = async (e, t, i = {}) => w(await g("/fonts/register-path", t, { method: "POST", json: { path: e, ...i } })), Pp = async (e, t, i = {}) => w(await g("/fonts/register-web", t, { method: "POST", json: { ...e, ...i } })), Fp = async (e, t, i, a, s) => w(await g(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function Rp(e, t) {
  await g(`/fonts/${e}`, t, { method: "DELETE" });
}
async function Mp(e, t) {
  return (await g(`/fonts/${e}/file`, t)).arrayBuffer();
}
const or = async (e, t, i, a) => w(await g(`/fonts/tree/root?${Os(e, t, i)}`, a)), Lp = async (e, t, i, a, s) => w(await g(`/fonts/tree/children?${Os(t, i, a, e)}`, s)), zp = async (e, t) => w(await g(`/fonts/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function Wp(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return w(await g(`/fonts/item?${i}`, t));
}
async function Up(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), w(await g(`/fonts/collection?${i}`, t));
}
const Np = async (e, t, i, a) => w(await g(`/fonts/${e}/references?skip=${t}&take=${i}`, a)), Bp = async (e, t) => w(await g("/fonts/folders", t, { method: "POST", json: e })), jp = async (e, t) => w(await g(`/fonts/folders/${e}`, t)), Kp = async (e, t, i) => w(await g(`/fonts/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function Vp(e, t) {
  await g(`/fonts/folders/${e}`, t, { method: "DELETE" });
}
const qp = async (e, t) => w(await g(`/fonts/families/${e}`, t)), Gp = async (e, t, i) => w(await g(`/fonts/families/${e}`, i, { method: "PUT", json: { name: t } }));
async function Yp(e, t) {
  await g(`/fonts/families/${e}`, t, { method: "DELETE" });
}
const Il = async (e) => w(await g("/document-types", e)), Hp = async (e, t) => w(await g(`/document-types/${encodeURIComponent(e)}/properties`, t)), Xp = async (e, t, i) => w(await g(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function Ol(e, t, i) {
  return (await g("/preview", i, {
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
const Al = async (e, t, i) => w(await g("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Pl = async (e, t) => w(await g(`/media/${e}/image-info`, t)), an = async (e, t) => w(await g(`/documents/${e}/regenerate`, t, { method: "POST" })), Fl = async (e, t, i) => w(await g(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), Jp = async (e, t) => w(await g(`/jobs/${e}`, t));
async function Zp(e, t) {
  await g(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const Qp = async (e, t) => w(await g(`/templates/${e}/usage`, t)), Rl = async (e) => w(await g("/health", e)), eh = async (e) => w(await g("/sync/status", e)), th = async (e) => w(await g("/sync/export", e, { method: "POST" })), ih = async (e) => w(await g("/sync/import", e, { method: "POST" }));
function Ps(e) {
  const t = `section/${Cs}/workspace/${Is}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function ah(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${Cs}/workspace/${Is}/create${t}`, document.baseURI).pathname;
}
function Di(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${Cs}/workspace/${e}${i}`, document.baseURI).pathname;
}
function sh(e) {
  return new URL(`section/${Cs}/dashboard/${e}`, document.baseURI).pathname;
}
function sn() {
  window.dispatchEvent(new CustomEvent(ro));
}
const Fs = () => crypto.randomUUID();
function Rs(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function Ml(e, t, i) {
  const { x: a, y: s } = Rs(e);
  return {
    type: "text",
    key: Fs(),
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
function Ll(e, t, i) {
  const { x: a, y: s } = Rs(e);
  return {
    type: "image",
    key: Fs(),
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
function zl(e, t, i) {
  const { x: a, y: s } = Rs(e);
  return {
    type: "badges",
    key: Fs(),
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
const Qi = {
  rectangle: { label: "Rectangle", icon: "icon-shape-rectangle-horizontal", shape: "rectangle", size: { width: 400, height: 200 }, cornerRadius: 0 },
  roundedRectangle: {
    label: "Rounded rectangle",
    icon: "icon-shape-square",
    shape: "rectangle",
    size: { width: 400, height: 200 },
    cornerRadius: 24
  },
  circle: { label: "Circle", icon: "icon-shape-circle", shape: "ellipse", size: { width: 200, height: 200 }, lockAspect: !0 },
  ellipse: { label: "Ellipse", icon: "icon-record", shape: "ellipse", size: { width: 300, height: 180 } },
  polygon: { label: "Polygon", icon: "icon-shape-hexagon", shape: "polygon", size: { width: 220, height: 220 }, sides: 6 },
  triangle: { label: "Triangle", icon: "icon-shape-triangle", shape: "polygon", size: { width: 220, height: 200 }, sides: 3 },
  star: { label: "Star", icon: "icon-star", shape: "star", size: { width: 220, height: 220 }, sides: 5, innerRatio: 0.5 }
}, oh = Object.keys(Qi);
function nh(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = Rs(e), o = Qi[i] ?? Qi.rectangle;
  return {
    type: "rect",
    key: Fs(),
    name: t === "Shape" ? o.label : t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: a, y: s, anchor: "middleCentre" },
    size: { ...o.size },
    rotation: 0,
    visibility: { rule: "always" },
    shape: o.shape,
    fill: "#00000099",
    gradient: null,
    cornerRadius: o.cornerRadius ?? 0,
    sides: o.sides ?? 5,
    innerRatio: o.innerRatio ?? 0.5,
    border: null,
    ...o.lockAspect ? { lockAspect: !0 } : {}
  };
}
function rh(e) {
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
function lh(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (rh(e.classification)) {
    case "image":
      return { kind: "layer", layer: Ll(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: zl(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: Ml(t, e.name, ch(e)) };
  }
}
function ch(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Wl() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function uh(e) {
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
const Ul = [
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
function ea(e) {
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
function ta(e) {
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
function co(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return Ul[a * 3 + i];
}
function Ms(e, t, i) {
  return {
    x: e.x - t * ea(e.anchor),
    y: e.y - i * ta(e.anchor)
  };
}
function on(e, t, i, a, s) {
  return {
    x: e + i * ea(s),
    y: t + a * ta(s)
  };
}
function dh(e, t, i, a) {
  const s = Ms(e, t, i), o = on(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function ph(e, t) {
  const i = on(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Nl(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function oi(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), p = e - i, m = t - a;
  return { x: i + p * n - m * l, y: a + p * l + m * n };
}
function hh(e, t, i, a, s) {
  return oi(e, t, i, a, -s);
}
function Bl(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    oi(e.x, e.y, t, i, a),
    oi(e.x + e.width, e.y, t, i, a),
    oi(e.x + e.width, e.y + e.height, t, i, a),
    oi(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((m) => m.x)), n = Math.max(...s.map((m) => m.x)), l = Math.min(...s.map((m) => m.y)), p = Math.max(...s.map((m) => m.y));
  return { x: o, y: l, width: n - o, height: p - l };
}
const mh = 10;
function ze(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function jl(e) {
  return !!e.relativeX || !!e.relativeY;
}
function os(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function nr(e) {
  return e === "below" || e === "above";
}
function rr(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function yh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function fh(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = rr(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...rr(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function gh(e, t, i) {
  const a = e.position;
  if (!jl(a)) return a;
  if (fh(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = ea(a.anchor), l = ta(a.anchor);
  const p = lr(e, a.relativeX, !1, t, i);
  p && (s = p.coordinate, n = p.factor);
  const m = lr(e, a.relativeY, !0, t, i);
  return m && (o = m.coordinate, l = m.factor), { x: s, y: o, anchor: co(n, l) };
}
function lr(e, t, i, a, s) {
  if (!t || nr(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let n = t.layerKey;
  for (; !o.has(n); ) {
    o.add(n);
    const l = a.get(n);
    if (!l) return;
    const p = s(n);
    if (p)
      switch (t.edge) {
        case "below":
          return { coordinate: p.y + p.height + t.gap, factor: 0 };
        case "above":
          return { coordinate: p.y - t.gap, factor: 1 };
        case "rightOf":
          return { coordinate: p.x + p.width + t.gap, factor: 0 };
        default:
          return { coordinate: p.x - t.gap, factor: 1 };
      }
    const m = i ? l.position.relativeY : l.position.relativeX;
    if (!m || nr(m.edge) !== i) return;
    n = m.layerKey;
  }
}
function vh(e, t, i) {
  const a = yh(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const p = s.get(l.key);
    if (p) return p;
    let m;
    o.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), m = gh(l, a, (ye) => {
      const fe = a.get(ye);
      return fe && !i(fe) ? n(fe).extent : void 0;
    }), o.delete(l.key));
    const D = t(l), S = Ms(m, D.width, D.height), K = { x: S.x, y: S.y, width: D.width, height: D.height }, ie = { position: m, box: K, extent: Bl(K, m.x, m.y, l.rotation ?? 0) };
    return s.set(l.key, ie), ie;
  };
  for (const l of e) n(l);
  return s;
}
function uo(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? co(ea(i.anchor), ta(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? co(ea(e.anchor), ta(i.anchor)) : e.anchor
  };
}
var ce, Be, Re, ut;
class bh {
  constructor(t = 100) {
    k(this, ce, []);
    k(this, Be, []);
    k(this, Re, 0);
    k(this, ut);
    this.limit = t;
  }
  get canUndo() {
    return c(this, ce).length > 0;
  }
  get canRedo() {
    return c(this, Be).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Re) > 0 || (c(this, ce).push(structuredClone(t)), c(this, ce).length > this.limit && c(this, ce).shift(), _(this, Be, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Re) === 0 && _(this, ut, structuredClone(t)), Bs(this, Re)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Re) !== 0 && (Bs(this, Re)._--, !(c(this, Re) > 0) && (t && c(this, ut) !== void 0 && (c(this, ce).push(c(this, ut)), c(this, ce).length > this.limit && c(this, ce).shift(), _(this, Be, [])), _(this, ut, void 0)));
  }
  undo(t) {
    const i = c(this, ce).pop();
    if (i !== void 0)
      return c(this, Be).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Be).pop();
    if (i !== void 0)
      return c(this, ce).push(structuredClone(t)), i;
  }
  clear() {
    _(this, ce, []), _(this, Be, []), _(this, Re, 0), _(this, ut, void 0);
  }
}
ce = new WeakMap(), Be = new WeakMap(), Re = new WeakMap(), ut = new WeakMap();
const po = 3, _h = (e) => wh(e), cr = (e, t) => e.slice(0, Math.max(0, t)).join("."), wh = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), $h = "Page";
function xh(e) {
  return e.isSystem ? $h : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const Qt = (e) => e ?? Number.MAX_SAFE_INTEGER;
function kh(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || Qt(t.property.tabSortOrder) - Qt(i.property.tabSortOrder) || Qt(t.property.groupSortOrder) - Qt(i.property.groupSortOrder) || Qt(t.property.sortOrder) - Qt(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function Th(e, t) {
  const i = kh(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: xh(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function Sh(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const Dh = "DynamicImages.Workspace.Template", Eh = 12, ur = 36;
var yi, dt, It, Ot, fi, At, gi, vi, Pt, pt, bi, je, _i, wi, ue, ya, Ft, Me, Rt, $, Kl, $i, xi, ho, mo, yo, Ue, Tt, fo, Wa, Vl, ql, Gl, go;
class Ch extends Kd {
  constructor(i) {
    super(i, Dh);
    k(this, $);
    k(this, yi);
    k(this, dt);
    k(this, It);
    k(this, Ot);
    k(this, fi);
    k(this, At);
    k(this, gi);
    k(this, vi);
    k(this, Pt);
    k(this, pt);
    k(this, bi);
    k(this, je);
    k(this, _i);
    k(this, wi);
    k(this, ue);
    k(this, ya);
    k(this, Ft);
    k(this, Me);
    k(this, Rt);
    k(this, $i);
    k(this, xi);
    this._data = new Vd(this), this.template = this._data.current, _(this, yi, new Ri([], (a) => a.key)), this.layers = c(this, yi).asObservable(), _(this, dt, new ir(void 0)), this.selectedLayerKey = c(this, dt).asObservable(), _(this, It, new Ri([], (a) => a.alias)), this.properties = c(this, It).asObservable(), _(this, Ot, new ar({})), this.linkedProperties = c(this, Ot).asObservable(), _(this, fi, new ar({})), this.linkedCaptions = c(this, fi).asObservable(), _(this, At, new Ri([], (a) => a.key)), this.fonts = c(this, At).asObservable(), _(this, gi, new Ri([], (a) => a.key)), this.serverBounds = c(this, gi).asObservable(), _(this, vi, new Ri([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, vi).asObservable(), _(this, Pt, new ir(void 0)), this.sampleContentKey = c(this, Pt).asObservable(), _(this, pt, new Aa(!0)), this.useSampleData = c(this, pt).asObservable(), _(this, bi, new ip(1)), this.zoom = c(this, bi).asObservable(), _(this, je, new Aa(!0)), this.loading = c(this, je).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, _i, new Aa(!1)), this.canUndo = c(this, _i).asObservable(), _(this, wi, new Aa(!1)), this.canRedo = c(this, wi).asObservable(), _(this, ue, new bh()), _(this, Me, !1), _(this, Rt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, $i, async (a) => {
      const s = a.detail;
      if (c(this, Rt) || !(s != null && s.url) || !E(this, $, Kl).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await en(this, tp), _(this, Rt, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, xi, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, ya)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => Ys),
        setup: (a, s) => {
          const o = s.match.params.parentUnique;
          return this.createScaffold(void 0, o && o !== "null" ? o : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => Ys),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Ys),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ae, (a) => {
      _(this, ya, a);
    }), this.consumeContext(Z, (a) => {
      _(this, Ft, a);
    }), window.addEventListener("willchangestate", c(this, $i)), window.addEventListener("beforeunload", c(this, xi)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Me);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, je).setValue(!0), _(this, Me, !1);
    try {
      const a = await tn(i, this.getToken);
      E(this, $, Tt).call(this, a, { resetHistory: !0, persist: !0 }), E(this, $, ql).call(this), this.setIsNew(!1), await E(this, $, ho).call(this, a);
    } catch (a) {
      E(this, $, go).call(this, "This template could not be loaded", a);
    } finally {
      c(this, je).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, je).setValue(!0), _(this, Me, !0), E(this, $, Tt).call(this, { ...uh(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await E(this, $, ho).call(this, this._data.getCurrent()), c(this, je).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await E(this, $, yo).call(this, i.docTypeAliases);
    c(this, It).setValue(a), c(this, Ot).setValue(await E(this, $, mo).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, At).setValue(await lo(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    E(this, $, Ue).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    E(this, $, Ue).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    E(this, $, Ue).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    E(this, $, Ue).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    E(this, $, Ue).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    E(this, $, Ue).call(this, (s) => ({
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
    E(this, $, Ue).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, p;
        let n = o.position;
        return ((l = os(n, "x")) == null ? void 0 : l.layerKey) === i && (n = uo(n, "x", a == null ? void 0 : a.get(o.key))), ((p = os(n, "y")) == null ? void 0 : p.layerKey) === i && (n = uo(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), c(this, dt).getValue() === i && this.selectLayer(void 0);
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
    E(this, $, Ue).call(this, (s) => {
      const o = [...s.layers], n = o.findIndex((p) => p.key === i);
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
    c(this, dt).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, dt).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, ue).begin(i);
  }
  endTransaction(i = !0) {
    c(this, ue).end(i), E(this, $, fo).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ue).undo(i);
    a && E(this, $, Tt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ue).redo(i);
    a && E(this, $, Tt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, gi).setValue(i);
  }
  setIssues(i) {
    c(this, vi).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    c(this, Pt).setValue(i), c(this, pt).setValue(!i), E(this, $, Vl).call(this, i);
  }
  setUseSampleData(i) {
    c(this, pt).setValue(i);
  }
  setZoom(i) {
    c(this, bi).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = c(this, Me) ? await dp(i, this.getToken) : await pp(i, this.getToken);
      E(this, $, Tt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Me);
      _(this, Me, !1), this.setIsNew(!1), sn(), await E(this, $, Gl).call(this, o.template, n), (a = c(this, Ft)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, Ft)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", Ps(o.template.key));
    } catch (o) {
      throw E(this, $, go).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Rt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, $i)), window.removeEventListener("beforeunload", c(this, xi)), c(this, ue).clear(), super.destroy();
  }
}
yi = new WeakMap(), dt = new WeakMap(), It = new WeakMap(), Ot = new WeakMap(), fi = new WeakMap(), At = new WeakMap(), gi = new WeakMap(), vi = new WeakMap(), Pt = new WeakMap(), pt = new WeakMap(), bi = new WeakMap(), je = new WeakMap(), _i = new WeakMap(), wi = new WeakMap(), ue = new WeakMap(), ya = new WeakMap(), Ft = new WeakMap(), Me = new WeakMap(), Rt = new WeakMap(), $ = new WeakSet(), /**
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
Kl = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, $i = new WeakMap(), xi = new WeakMap(), ho = async function(i) {
  const [a, s] = await Promise.all([
    lo(this.getToken).catch(() => []),
    E(this, $, yo).call(this, i.docTypeAliases)
  ]);
  c(this, At).setValue(a), c(this, It).setValue(s), c(this, Ot).setValue(await E(this, $, mo).call(this, i.docTypeAliases, s));
}, mo = async function(i, a) {
  const s = {}, o = {};
  if (i.length === 0) return s;
  let n = a.filter((p) => p.classification === "content").slice(0, Eh).map((p) => p.alias), l = 0;
  for (let p = 1; p <= po && n.length > 0 && l < ur; p++) {
    const m = n.slice(0, ur - l);
    l += m.length;
    const D = await Promise.all(m.map(async (S) => {
      var Fi;
      const K = await Promise.all(
        i.map((ae) => Xp(ae, S, this.getToken).catch(() => null))
      ), ie = /* @__PURE__ */ new Map();
      for (const ae of K.flatMap(($e) => ($e == null ? void 0 : $e.properties) ?? []))
        ie.has(ae.alias) || ie.set(ae.alias, ae);
      const ye = K.filter((ae) => ae !== null), fe = [...new Set(ye.flatMap((ae) => ae.targetDocTypes.map(($e) => $e.name)))], Zt = ye.some((ae) => ae.inference === "all") ? "all" : (Fi = ye[0]) == null ? void 0 : Fi.inference;
      return { prefix: S, properties: [...ie.values()], caption: Sh(fe, Zt) };
    }));
    n = [];
    for (const S of D)
      S.properties.length !== 0 && (s[S.prefix] = S.properties, o[S.prefix] = S.caption, p < po && n.push(...S.properties.filter((K) => K.classification === "content" && !K.isSystem).map((K) => `${S.prefix}.${K.alias}`)));
  }
  return c(this, fi).setValue(o), s;
}, yo = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => Hp(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Ue = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && c(this, ue).push(s);
  const o = i(structuredClone(s));
  E(this, $, Tt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
Tt = function(i, a) {
  a != null && a.resetHistory && c(this, ue).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, yi).setValue(i.layers), E(this, $, fo).call(this);
}, fo = function() {
  c(this, _i).setValue(c(this, ue).canUndo), c(this, wi).setValue(c(this, ue).canRedo);
}, Wa = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, Vl = function(i) {
  try {
    i ? localStorage.setItem(E(this, $, Wa).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(E(this, $, Wa).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
ql = function() {
  let i;
  try {
    const a = localStorage.getItem(E(this, $, Wa).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  c(this, Pt).setValue(i), c(this, pt).setValue(!i);
}, Gl = async function(i, a) {
  const s = await this.getContext(Ht).catch(() => {
  });
  s && (a ? s.dispatchEvent(new Ai({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : s.dispatchEvent(new _l({ entityType: "di-template", unique: i.key })));
}, go = function(i, a) {
  var o;
  const s = a instanceof jt ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, Ft)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const $t = new wt(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Ye = "di-template-root", W = "di-template-folder", G = Is, Et = "DynamicImages.Tree.Templates", ni = "DynamicImages.Repository.TemplateTree", Vi = "DynamicImages.Repository.TemplateFolder", Ih = "DynamicImages.Store.TemplateFolder", ns = "DynamicImages.Workspace.TemplateFolder", Yl = "DynamicImages.Workspace.TemplateRoot", js = "DynamicImages.Repository.TemplateItem", Oh = "DynamicImages.Store.TemplateItem", Ks = "DynamicImages.Repository.TemplateDetail", Ah = "DynamicImages.Store.TemplateDetail", dr = "DynamicImages.Repository.MoveTemplate", pr = "DynamicImages.Repository.MoveTemplateFolder", hr = "DynamicImages.Repository.DuplicateTemplate", mr = "DynamicImages.Repository.BulkMoveTemplates", yr = "DynamicImages.Repository.BulkDuplicateTemplates", fr = "DynamicImages.Repository.SortTemplateChildren", Hl = "icon-picture", Xl = "icon-picture color-grey", Jl = "icon-folder", rs = "DynamicImages.Collection.Templates", gr = "DynamicImages.Repository.TemplateCollection";
async function T(e, t) {
  const i = (async () => {
    const a = await new Hd(e, Ae).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (s) {
      throw s instanceof jt ? { type: "error", title: s.message, status: s.status, detail: s.detail } : s;
    }
  })();
  return await rp(e, i);
}
var ht;
class Ph {
  constructor(t) {
    k(this, ht);
    _(this, ht, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: W,
      unique: fl.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await T(c(this, ht), (s) => xp(t, s));
    return i ? { data: { entityType: W, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await T(c(this, ht), (o) => $p({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await T(c(this, ht), (s) => kp(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return T(c(this, ht), (i) => Cl(t, i));
  }
}
ht = new WeakMap();
const nn = new wt("DiTemplateFolderStore");
class Zl extends _a {
  constructor(t) {
    super(t, nn);
  }
}
class vr extends ba {
  constructor(t) {
    super(t, Ph, nn);
  }
}
const Fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: nn,
  DiTemplateFolderRepository: vr,
  DiTemplateFolderStore: Zl,
  api: vr
}, Symbol.toStringTag, { value: "Module" })), Rh = [
  {
    type: "repository",
    alias: Vi,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => Fh)
  },
  {
    type: "store",
    alias: Ih,
    name: "Dynamic Images Template Folder Store",
    api: Zl
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [W],
    meta: { folderRepositoryAlias: Vi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [W],
    meta: { folderRepositoryAlias: Vi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: ns,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => fm),
    meta: { entityType: W }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: Ji,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: ns }]
  }
], Mh = [
  {
    type: "repository",
    alias: ni,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => bm)
  },
  {
    type: "tree",
    kind: "default",
    alias: Et,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: ni }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [Ye, W, G]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: Et, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: Yl,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: Ye, headline: "Templates" }
  },
  ...Rh
], rn = new wt("DiTemplateItemStore");
class Ql extends Zd {
  constructor(t) {
    super(t, rn);
  }
}
class Lh extends Jd {
  constructor(t) {
    super(t, {
      getItems: (i) => T(t, (a) => As(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? W : G,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class br extends Xd {
  constructor(t) {
    super(t, Lh, rn);
  }
}
const zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: rn,
  DiTemplateItemRepository: br,
  DiTemplateItemStore: Ql,
  api: br
}, Symbol.toStringTag, { value: "Module" })), ln = new wt("DiTemplateDetailStore");
class ec extends _a {
  constructor(t) {
    super(t, ln);
  }
}
const Vs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var ki;
class Wh {
  constructor(t) {
    k(this, ki);
    this.createScaffold = Vs, this.create = Vs, this.update = Vs, _(this, ki, t);
  }
  async read(t) {
    const { data: i, error: a } = await T(c(this, ki), (s) => tn(t, s));
    return i ? { data: { entityType: G, unique: i.key, name: i.name } } : { error: a };
  }
  /**
   * A template, or a folder: the collection's bulk Delete sends every selected key here, and a
   * selection can hold both. A folder that is not empty is refused by the server with a 409, which
   * core's bulk action shows as that item's error.
   */
  delete(t) {
    return T(c(this, ki), async (i) => {
      const [a] = await As([t], i);
      return (a == null ? void 0 : a.entityType) === "folder" ? Cl(t, i) : hp(t, i);
    });
  }
}
ki = new WeakMap();
class _r extends ba {
  constructor(t) {
    super(t, Wh, ln);
  }
}
const Uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: ln,
  DiTemplateDetailRepository: _r,
  DiTemplateDetailStore: ec,
  api: _r
}, Symbol.toStringTag, { value: "Module" })), ei = [Ye, W], qs = [{ alias: "Umb.Condition.CollectionAlias", match: rs }], Nh = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: js,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => zh)
  },
  {
    type: "itemStore",
    alias: Oh,
    name: "Dynamic Images Template Item Store",
    api: Ql
  },
  {
    type: "repository",
    alias: Ks,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => Uh)
  },
  {
    type: "store",
    alias: Ah,
    name: "Dynamic Images Template Detail Store",
    api: ec
  },
  {
    type: "repository",
    alias: dr,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => $m)
  },
  {
    type: "repository",
    alias: pr,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => xm)
  },
  {
    type: "repository",
    alias: hr,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => km)
  },
  {
    type: "repository",
    alias: fr,
    name: "Dynamic Images Sort Template Children Repository",
    api: () => Promise.resolve().then(() => Tm)
  },
  {
    type: "repository",
    alias: mr,
    name: "Dynamic Images Bulk Move Templates Repository",
    api: () => Promise.resolve().then(() => Em)
  },
  {
    type: "repository",
    alias: yr,
    name: "Dynamic Images Bulk Duplicate Templates Repository",
    api: () => Promise.resolve().then(() => Cm)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: ei,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => Im),
    forEntityTypes: ei,
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
    forEntityTypes: ei,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Vi
    }
  },
  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [G],
    meta: {
      treeRepositoryAlias: ni,
      moveRepositoryAlias: dr,
      treeAlias: Et,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Template To",
    forEntityTypes: [G],
    meta: {
      duplicateRepositoryAlias: hr,
      treeRepositoryAlias: ni,
      treeAlias: Et,
      foldersOnly: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Enable",
    name: "Enable Dynamic Images Template",
    api: () => Promise.resolve().then(() => Om),
    forEntityTypes: [G],
    weight: 560,
    meta: { icon: "icon-check", label: "Enable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Disable",
    name: "Disable Dynamic Images Template",
    api: () => Promise.resolve().then(() => Am),
    forEntityTypes: [G],
    weight: 550,
    meta: { icon: "icon-block", label: "Disable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => Pm),
    forEntityTypes: [G],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => Rm),
    forEntityTypes: [G],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [G],
    meta: {
      itemRepositoryAlias: js,
      detailRepositoryAlias: Ks,
      additionalOptions: !0,
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
    forEntityTypes: [W],
    meta: {
      treeRepositoryAlias: ni,
      moveRepositoryAlias: pr,
      treeAlias: Et,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  // ---------------------------------------------------------------- root and folder
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Import",
    name: "Import a Dynamic Images Template",
    api: () => Promise.resolve().then(() => zm),
    forEntityTypes: ei,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "sortChildrenOf",
    alias: "DynamicImages.EntityAction.Template.SortChildren",
    name: "Sort Dynamic Images Templates",
    forEntityTypes: ei,
    meta: {
      sortChildrenOfRepositoryAlias: fr,
      treeRepositoryAlias: ni
    }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: ei
  },
  // ---------------------------------------------------------------- collection selection
  // Any of these applying is what turns on the collection's checkboxes.
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Template.MoveTo",
    name: "Move Dynamic Images Templates",
    forEntityTypes: [G, W],
    meta: {
      bulkMoveRepositoryAlias: mr,
      treeAlias: Et,
      foldersOnly: !0
    },
    conditions: qs
  },
  {
    type: "entityBulkAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityBulkAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Templates To",
    forEntityTypes: [G, W],
    meta: {
      bulkDuplicateRepositoryAlias: yr,
      treeAlias: Et,
      foldersOnly: !0
    },
    conditions: qs
  },
  {
    type: "entityBulkAction",
    kind: "delete",
    alias: "DynamicImages.EntityBulkAction.Template.Delete",
    name: "Delete Dynamic Images Templates",
    forEntityTypes: [G, W],
    meta: {
      itemRepositoryAlias: js,
      detailRepositoryAlias: Ks
    },
    conditions: qs
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => Km)
  }
], Pa = [{ alias: "Umb.Condition.CollectionAlias", match: rs }], Bh = [
  {
    type: "repository",
    alias: gr,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => Vm)
  },
  {
    type: "collection",
    kind: "default",
    alias: rs,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => qm),
    meta: { repositoryAlias: gr }
  },
  {
    type: "collectionView",
    kind: "table",
    alias: "DynamicImages.CollectionView.Templates.Table",
    name: "Dynamic Images Template Table View",
    weight: 300,
    meta: {
      label: "List",
      icon: "icon-list",
      pathName: "list",
      columns: [
        { field: "docTypes", label: "Document types" },
        { field: "targetProperty", label: "Target property" },
        { field: "canvas", label: "Canvas" },
        { field: "layers", label: "Layers" },
        { field: "isEnabled", label: "Enabled", valueType: Qd },
        { field: "updated", label: "Last updated", valueType: ep }
      ]
    },
    conditions: Pa
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: Pa
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => Xm),
    forEntityTypes: [G]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: Pa
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: Pa
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Templates.Collection",
    name: "Dynamic Images Templates Collection Workspace View",
    meta: {
      label: "Templates",
      pathname: "templates",
      icon: "icon-grid",
      collectionAlias: rs
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [Yl, ns]
      }
    ]
  }
], Kt = "di-font-root", Ee = "di-font-folder", _e = "di-font-family", Xt = "di-font", wr = "DynamicImages.Tree.Fonts", $r = "DynamicImages.Repository.FontTree", qi = "DynamicImages.Repository.FontFolder", jh = "DynamicImages.Store.FontFolder", ls = "DynamicImages.Workspace.FontFolder", tc = "DynamicImages.Workspace.FontRoot", cs = "DynamicImages.Workspace.FontFamily", Ua = "DynamicImages.Workspace.Font", ic = "DynamicImages.Repository.FontDetail", Kh = "DynamicImages.Store.FontDetail", ac = "DynamicImages.Repository.FontFamilyDetail", Vh = "DynamicImages.Store.FontFamilyDetail", vo = "DynamicImages.Collection.Fonts", Gs = "DynamicImages.Repository.FontCollection", bo = "DynamicImages.Collection.FontVariants", qh = "icon-folder", Gh = "icon-font", Yh = "icon-font color-grey", Hh = "icon-cloud";
function sc(e) {
  switch (e) {
    case "folder":
      return Ee;
    case "family":
      return _e;
    default:
      return Xt;
  }
}
function oc(e, t) {
  switch (e) {
    case "folder":
      return qh;
    case "family":
      return Gh;
    default:
      return t ? Hh : Yh;
  }
}
const Xh = [
  {
    type: "repository",
    alias: $r,
    name: "Dynamic Images Font Tree Repository",
    api: () => Promise.resolve().then(() => Qm)
  },
  {
    type: "tree",
    kind: "default",
    alias: wr,
    name: "Dynamic Images Font Tree",
    meta: { repositoryAlias: $r }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Fonts",
    name: "Dynamic Images Font Tree Item",
    forEntityTypes: [Kt, Ee, _e, Xt]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Fonts",
    name: "Dynamic Images Fonts Menu Item",
    weight: 100,
    meta: { label: "Fonts", treeAlias: wr, menus: ["DynamicImages.Menu"] }
  },
  {
    type: "workspace",
    kind: "default",
    alias: tc,
    name: "Dynamic Images Fonts Root Workspace",
    meta: { entityType: Kt, headline: "Fonts" }
  }
];
var mt;
class Jh {
  constructor(t) {
    k(this, mt);
    _(this, mt, t);
  }
  async createScaffold(t) {
    return { data: { entityType: Ee, unique: fl.new(), name: "", ...t } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await T(c(this, mt), (s) => jp(t, s));
    return i ? { data: { entityType: Ee, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await T(c(this, mt), (o) => Bp({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await T(c(this, mt), (s) => Kp(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return T(c(this, mt), (i) => Vp(t, i));
  }
}
mt = new WeakMap();
const cn = new wt("DiFontFolderStore");
class nc extends _a {
  constructor(t) {
    super(t, cn);
  }
}
class xr extends ba {
  constructor(t) {
    super(t, Jh, cn);
  }
}
const Zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FOLDER_STORE_CONTEXT: cn,
  DiFontFolderRepository: xr,
  DiFontFolderStore: nc,
  api: xr
}, Symbol.toStringTag, { value: "Module" })), Qh = [
  {
    type: "repository",
    alias: qi,
    name: "Dynamic Images Font Folder Repository",
    api: () => Promise.resolve().then(() => Zh)
  },
  {
    type: "store",
    alias: jh,
    name: "Dynamic Images Font Folder Store",
    api: nc
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.FontFolder.Rename",
    name: "Rename Dynamic Images Font Folder",
    forEntityTypes: [Ee],
    meta: { folderRepositoryAlias: qi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.FontFolder.Delete",
    name: "Delete Dynamic Images Font Folder",
    forEntityTypes: [Ee],
    meta: { folderRepositoryAlias: qi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: ls,
    name: "Dynamic Images Font Folder Workspace",
    api: () => Promise.resolve().then(() => ey),
    meta: { entityType: Ee }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.FontFolder.Submit",
    name: "Save Dynamic Images Font Folder",
    api: Ji,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: ls }]
  }
], kr = [{ alias: "Umb.Condition.CollectionAlias", match: vo }], Tr = [{ alias: "Umb.Condition.CollectionAlias", match: bo }], Sr = (e, t) => [
  {
    type: "collectionView",
    kind: "card",
    alias: `DynamicImages.CollectionView.${e}.Grid`,
    name: `Dynamic Images ${e} Grid View`,
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: t
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: `DynamicImages.CollectionTextFilter.${e}`,
    name: `Dynamic Images ${e} Collection Filter`,
    conditions: t
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: `DynamicImages.CollectionAction.${e}.Create`,
    name: `Create in the Dynamic Images ${e} Collection`,
    conditions: t
  }
], em = [
  {
    type: "repository",
    alias: Gs,
    name: "Dynamic Images Font Collection Repository",
    api: () => Promise.resolve().then(() => iy)
  },
  {
    type: "collection",
    kind: "default",
    alias: vo,
    name: "Dynamic Images Font Collection",
    api: () => Promise.resolve().then(() => Jr),
    meta: { repositoryAlias: Gs }
  },
  {
    type: "collection",
    kind: "default",
    alias: bo,
    name: "Dynamic Images Font Variant Collection",
    api: () => Promise.resolve().then(() => Jr),
    meta: { repositoryAlias: Gs }
  },
  // ---------------------------------------------------------------- views
  {
    type: "collectionView",
    kind: "table",
    alias: "DynamicImages.CollectionView.Fonts.Table",
    name: "Dynamic Images Font Table View",
    weight: 300,
    meta: {
      label: "List",
      icon: "icon-list",
      pathName: "list",
      columns: [
        { field: "variants", label: "Variants" },
        { field: "usedBy", label: "Used by templates" }
      ]
    },
    conditions: kr
  },
  {
    type: "collectionView",
    kind: "table",
    alias: "DynamicImages.CollectionView.FontVariants.Table",
    name: "Dynamic Images Font Variant Table View",
    weight: 300,
    meta: {
      label: "List",
      icon: "icon-list",
      pathName: "list",
      columns: [
        { field: "weight", label: "Weight" },
        { field: "style", label: "Style" },
        { field: "source", label: "Source" },
        { field: "usedBy", label: "Used by templates" }
      ]
    },
    conditions: Tr
  },
  ...Sr("Fonts", kr),
  ...Sr("FontVariants", Tr),
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Font",
    name: "Dynamic Images Font Card",
    element: () => Promise.resolve().then(() => ny),
    forEntityTypes: [Ee, _e, Xt]
  },
  // ---------------------------------------------------------------- where they show
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Fonts.Collection",
    name: "Dynamic Images Fonts Collection Workspace View",
    meta: { label: "Fonts", pathname: "fonts", icon: "icon-grid", collectionAlias: vo },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", oneOf: [tc, ls] }]
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.FontVariants.Collection",
    name: "Dynamic Images Font Variants Collection Workspace View",
    meta: { label: "Variants", pathname: "variants", icon: "icon-font", collectionAlias: bo },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: cs }]
  }
], ti = [Kt, Ee], tm = [
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Font.Create",
    name: "Create Dynamic Images Font",
    weight: 1200,
    forEntityTypes: [...ti, _e],
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Add to Fonts" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Upload",
    name: "Upload a Dynamic Images Font File",
    weight: 100,
    api: () => Promise.resolve().then(() => dy),
    forEntityTypes: ti,
    meta: {
      icon: "icon-cloud-upload",
      label: "Upload font file",
      description: "A .ttf, .otf, .woff2 or .woff, stored in the media library"
    }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Web",
    name: "Add a Dynamic Images Web Font",
    weight: 90,
    api: () => Promise.resolve().then(() => py),
    forEntityTypes: ti,
    meta: { icon: "icon-cloud", label: "Web font", description: "From Google Fonts, Bunny Fonts or a file URL" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Path",
    name: "Register a Dynamic Images Font Path",
    weight: 80,
    api: () => Promise.resolve().then(() => hy),
    forEntityTypes: ti,
    meta: { icon: "icon-font", label: "Font from path", description: "A font file already in the site's wwwroot" }
  },
  // Cast for the same reason as the template folder option in entity-actions/manifests.ts.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.FontFolder",
    name: "Dynamic Images Font Folder Create Option",
    weight: 70,
    forEntityTypes: ti,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: qi
    }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.AddVariant",
    name: "Add a Variant to a Dynamic Images Font Family",
    weight: 100,
    api: () => Promise.resolve().then(() => my),
    forEntityTypes: [_e],
    meta: { icon: "icon-add", label: "Add variant", description: "Another weight or slant of this family" }
  },
  // ---------------------------------------------------------------- reload
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Font.ReloadChildren",
    name: "Reload Dynamic Images Fonts",
    forEntityTypes: [...ti, _e]
  }
], un = new wt("DiFontFamilyDetailStore");
class rc extends _a {
  constructor(t) {
    super(t, un);
  }
}
const Dr = () => Promise.resolve({ error: new Error("A font family is created by adding a font.") });
var Mt;
class im {
  constructor(t) {
    k(this, Mt);
    this.createScaffold = Dr, this.create = Dr, _(this, Mt, t);
  }
  async read(t) {
    const { data: i, error: a } = await T(c(this, Mt), (s) => qp(t, s));
    return i ? { data: { entityType: _e, unique: i.key, name: i.name } } : { error: a };
  }
  /** A rename: the server carries it onto every variant's family name. */
  async update(t) {
    const { error: i } = await T(c(this, Mt), (a) => Gp(t.unique, t.name, a));
    return i ? { error: i } : this.read(t.unique);
  }
  delete(t) {
    return T(c(this, Mt), (i) => Yp(t, i));
  }
}
Mt = new WeakMap();
class Er extends ba {
  constructor(t) {
    super(t, im, un);
  }
}
const am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FAMILY_DETAIL_STORE_CONTEXT: un,
  DiFontFamilyDetailRepository: Er,
  DiFontFamilyDetailStore: rc,
  api: Er
}, Symbol.toStringTag, { value: "Module" })), sm = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black"
};
function us(e, t) {
  const i = sm[e], a = i ? `${i} ${e}` : String(e);
  return t ? `${a} Italic` : a;
}
const dn = new wt("DiFontDetailStore");
class lc extends _a {
  constructor(t) {
    super(t, dn);
  }
}
const Cr = () => Promise.resolve({ error: new Error("A font is added from the Fonts tree's Create….") });
function _o(e) {
  return {
    entityType: Xt,
    unique: e.key,
    name: us(e.weight, e.isItalic),
    font: e,
    weight: e.weight,
    isItalic: e.isItalic,
    styles: e.styles
  };
}
var Lt;
class om {
  constructor(t) {
    k(this, Lt);
    this.createScaffold = Cr, this.create = Cr, _(this, Lt, t);
  }
  async read(t) {
    const { data: i, error: a } = await T(c(this, Lt), (s) => Ip(t, s));
    return i ? { data: _o(i) } : { error: a };
  }
  /** The named styles, weight and slant. The family name is the family's, so it goes back unchanged. */
  async update(t) {
    const { data: i, error: a } = await T(c(this, Lt), (s) => Fp(t.unique, t.font.familyName, t.styles, s, { weight: t.weight, isItalic: t.isItalic }));
    return i ? { data: _o(i) } : { error: a };
  }
  delete(t) {
    return T(c(this, Lt), (i) => Rp(t, i));
  }
}
Lt = new WeakMap();
class Ir extends ba {
  constructor(t) {
    super(t, om, dn);
  }
}
const nm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_DETAIL_STORE_CONTEXT: dn,
  DiFontDetailRepository: Ir,
  DiFontDetailStore: lc,
  api: Ir,
  toDetail: _o,
  variantName: us
}, Symbol.toStringTag, { value: "Module" })), Or = (e, t) => ({
  type: "workspaceAction",
  kind: "default",
  alias: e,
  name: `Save ${t}`,
  api: Ji,
  meta: { label: "#buttons_save", look: "primary", color: "positive" },
  conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: t }]
}), rm = [
  // ---------------------------------------------------------------- family
  {
    type: "repository",
    alias: ac,
    name: "Dynamic Images Font Family Detail Repository",
    api: () => Promise.resolve().then(() => am)
  },
  {
    type: "store",
    alias: Vh,
    name: "Dynamic Images Font Family Detail Store",
    api: rc
  },
  {
    type: "workspace",
    kind: "routable",
    alias: cs,
    name: "Dynamic Images Font Family Workspace",
    api: () => Promise.resolve().then(() => yy),
    meta: { entityType: _e }
  },
  Or("DynamicImages.WorkspaceAction.FontFamily.Submit", cs),
  // ---------------------------------------------------------------- variant
  {
    type: "repository",
    alias: ic,
    name: "Dynamic Images Font Detail Repository",
    api: () => Promise.resolve().then(() => nm)
  },
  {
    type: "store",
    alias: Kh,
    name: "Dynamic Images Font Detail Store",
    api: lc
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Ua,
    name: "Dynamic Images Font Workspace",
    api: () => Promise.resolve().then(() => fy),
    meta: { entityType: Xt }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Font",
    name: "Dynamic Images Font View",
    element: () => Promise.resolve().then(() => $y),
    weight: 100,
    meta: { label: "Font", pathname: "font", icon: "icon-font" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Ua }]
  },
  Or("DynamicImages.WorkspaceAction.Font.Submit", Ua)
], lm = [
  ...Xh,
  ...Qh,
  ...em,
  ...tm,
  ...rm
], cm = [
  ...Mh,
  ...Nh,
  ...Bh,
  ...lm,
  // ---------------------------------------------------------------- sidebar
  //
  // The sidebar app, the menu and the Health link item are NOT here - they live in
  // wwwroot/App_Plugins/DynamicImages/umbraco-package.json, which Umbraco reads before this
  // bundle loads, so the section chrome paints immediately rather than after the entry point
  // has downloaded. None of them needs an element, so nothing is lost by moving them.
  //
  // The Templates and Fonts trees' menu items are in tree/manifests.ts and fonts/tree/manifests.ts:
  // `tree` kind menu items, which need their trees registered first.
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => Sy),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    // Fonts are the Fonts tree now. The dashboard's route stays, as a redirect to the tree's root
    // workspace, so a bookmarked dashboard/fonts still lands somewhere.
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Iy),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Fy),
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
    api: Ch,
    meta: { entityType: Is }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => ng),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => ug),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => yg),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => _g),
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
    api: () => Promise.resolve().then(() => wg),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => $g),
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
    api: () => Promise.resolve().then(() => xg),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => kg),
    // A property action rather than a custom property editor UI, so adopting the package needs no
    // data type changes on anyone's existing document types.
    forPropertyEditorUis: ["Umb.PropertyEditorUi.MediaPicker"],
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  // ---------------------------------------------------------------- modals
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => Og)
  }
], gv = (e, t) => {
  t.registerMany(cm);
};
var um = Object.defineProperty, dm = Object.getOwnPropertyDescriptor, cc = (e) => {
  throw TypeError(e);
}, pn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? dm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && um(t, i, s), s;
}, hn = (e, t, i) => t.has(e) || cc("Cannot " + i), pm = (e, t, i) => (hn(e, t, "read from private field"), t.get(e)), Ar = (e, t, i) => t.has(e) ? cc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hm = (e, t, i, a) => (hn(e, t, "write to private field"), t.set(e, i), i), mm = (e, t, i) => (hn(e, t, "access private method"), i), ds, wo, uc;
let Vt = class extends P {
  constructor() {
    super(), Ar(this, wo), Ar(this, ds), this._name = "", this._loading = !0, this.consumeContext($t, (e) => {
      hm(this, ds, e), e && (this.observe(e.template, (t) => {
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
            @input=${mm(this, wo, uc)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : h}
    `;
  }
};
ds = /* @__PURE__ */ new WeakMap();
wo = /* @__PURE__ */ new WeakSet();
uc = function(e) {
  var i;
  const t = e.target.value;
  (i = pm(this, ds)) == null || i.updateTemplateFields({ name: t });
};
Vt.styles = A`
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
pn([
  y()
], Vt.prototype, "_name", 2);
pn([
  y()
], Vt.prototype, "_loading", 2);
Vt = pn([
  I("di-template-editor")
], Vt);
const ym = Vt, Ys = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Vt;
  },
  default: ym
}, Symbol.toStringTag, { value: "Module" }));
class Pr extends Qo {
  constructor(t) {
    super(t, {
      workspaceAlias: ns,
      entityType: W,
      detailRepositoryAlias: Vi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Bd),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const fm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: Pr,
  api: Pr
}, Symbol.toStringTag, { value: "Module" }));
function Hs(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function gm(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? W : Ye
    },
    name: e.name,
    entityType: t ? W : G,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? Jl : e.isEnabled ? Hl : Xl,
    isEnabled: e.isEnabled
  };
}
class vm extends vl {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = Hs(i);
        return T(t, (o) => sr(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = Hs(i);
          return T(t, (p) => sr(n, l, i.foldersOnly ?? !1, p));
        }
        const a = i.parent.unique, { skip: s, take: o } = Hs(i);
        return T(t, (n) => vp(a, s, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => T(t, (a) => bp(i.treeItem.unique, a)),
      mapper: gm
    });
  }
}
class Fr extends bl {
  constructor(t) {
    super(t, vm);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: Ye,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const bm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: Fr,
  api: Fr
}, Symbol.toStringTag, { value: "Module" }));
class dc extends Oi {
  async requestMoveTo(t) {
    const { error: i } = await T(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(Z);
      a == null || a.peek("positive", { data: { message: "Moved" } });
      const s = await this.getContext(Ht).catch(() => {
      }), o = t.destination.unique;
      s == null || s.dispatchEvent(new Ai({
        entityType: o ? W : Ye,
        unique: o
      }));
    }
    return { error: i };
  }
}
class _m extends dc {
  constructor() {
    super(...arguments), this.move = Tp;
  }
}
class wm extends dc {
  constructor() {
    super(...arguments), this.move = Sp;
  }
}
const $m = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: _m
}, Symbol.toStringTag, { value: "Module" })), xm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: wm
}, Symbol.toStringTag, { value: "Module" }));
class Rr extends Oi {
  async requestDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: s } = await T(this, (o) => mp(t.unique, i, o));
    if (a) {
      const o = await this.getContext(Z);
      o == null || o.peek("positive", { data: { message: `'${a.template.name}' created` } });
      const n = await this.getContext(Ht).catch(() => {
      });
      n == null || n.dispatchEvent(new Ai({
        entityType: i ? W : Ye,
        unique: i
      }));
    }
    return { error: s };
  }
}
const km = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateToTemplateRepository: Rr,
  api: Rr
}, Symbol.toStringTag, { value: "Module" }));
class Mr extends Oi {
  async sortChildrenOf(t) {
    const i = t.sorting.map((s) => ({ key: s.unique, sortOrder: s.sortOrder })), { error: a } = await T(this, (s) => Cp(t.unique, i, s));
    if (!a) {
      const s = await this.getContext(Z);
      s == null || s.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const Tm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortTemplateChildrenRepository: Mr,
  api: Mr
}, Symbol.toStringTag, { value: "Module" })), pc = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
class hc extends Oi {
  async reloadDestination(t) {
    const i = await this.getContext(Ht).catch(() => {
    });
    i == null || i.dispatchEvent(new Ai({
      entityType: t ? W : Ye,
      unique: t
    }));
  }
  async notify(t, i) {
    const a = await this.getContext(Z);
    a == null || a.peek(t, { data: { message: i } });
  }
}
class Sm extends hc {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await T(this, (s) => Dp(t.uniques, i, s));
    return await this.reloadDestination(i), a || await this.notify("positive", `Moved ${pc(t.uniques.length, "item")}`), { error: a };
  }
}
class Dm extends hc {
  async requestBulkDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: s } = await T(this, (o) => Ep(t.uniques, i, o));
    return a ? (await this.reloadDestination(i), a.created.length > 0 && await this.notify("positive", `Copied ${pc(a.created.length, "template")}`), a.skippedFolders.length > 0 && await this.notify("warning", `Folders are not copied: ${a.skippedFolders.join(", ")}`), a.errors.length > 0 && await this.notify("warning", a.errors.join(" ")), {}) : { error: s };
  }
}
const Em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Sm
}, Symbol.toStringTag, { value: "Module" })), Cm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Dm
}, Symbol.toStringTag, { value: "Module" }));
class Lr extends wl {
  async getHref() {
    return ah({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const Im = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: Lr,
  api: Lr
}, Symbol.toStringTag, { value: "Module" }));
class mn extends wa {
  async execute() {
    var m;
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await T(this, (D) => yp(t, this.enable, D));
    if (a || !i) throw a ?? new Error("The template could not be changed.");
    const { data: s } = await T(this, (D) => As([t], D)), o = ((m = s == null ? void 0 : s[0]) == null ? void 0 : m.name) ?? "The template", n = this.enable ? "enabled" : "disabled", l = await this.getContext(Z);
    if (!i.changed) {
      l == null || l.peek("default", { data: { message: `'${o}' is already ${n}` } });
      return;
    }
    l == null || l.peek("positive", { data: { message: `'${o}' ${n}` } });
    const p = await this.getContext(Ht).catch(() => {
    });
    p == null || p.dispatchEvent(new _l({ unique: t, entityType: this.args.entityType })), sn();
  }
}
class zr extends mn {
  constructor() {
    super(...arguments), this.enable = !0;
  }
}
const Om = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiEnableTemplateEntityAction: zr,
  DiSetTemplateEnabledEntityAction: mn,
  api: zr
}, Symbol.toStringTag, { value: "Module" }));
class Wr extends mn {
  constructor() {
    super(...arguments), this.enable = !1;
  }
}
const Am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDisableTemplateEntityAction: Wr,
  api: Wr
}, Symbol.toStringTag, { value: "Module" }));
class Ur extends wa {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await T(this, async (n) => ({
      blob: await fp(t, n),
      alias: (await tn(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const s = URL.createObjectURL(i.blob), o = document.createElement("a");
    o.href = s, o.download = `${i.alias}.json`, o.click(), URL.revokeObjectURL(s);
  }
}
const Pm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: Ur,
  api: Ur
}, Symbol.toStringTag, { value: "Module" })), Fm = 1500;
async function mc(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((s) => setTimeout(s, Fm));
    try {
      a = await Jp(a.id, t);
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
class Nr extends wa {
  async execute() {
    var p;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await T(this, (m) => As([t], m)), a = ((p = i == null ? void 0 : i[0]) == null ? void 0 : p.name) ?? "this template";
    await $l(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: s, error: o } = await T(this, (m) => Fl(t, !1, m));
    if (o || !s) throw o ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(Z);
    n == null || n.peek("positive", { data: { message: `Regenerating ${s.total} item(s)…` } });
    const l = await this.getContext(Ae);
    await mc(s, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const Rm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: Nr,
  api: Nr
}, Symbol.toStringTag, { value: "Module" })), Mm = new xl(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), Lm = new xl(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class Br extends wa {
  async execute() {
    const { json: t } = await en(this, Lm, { data: {} }), i = this.args.unique ?? null, { data: a, error: s } = await T(this, (l) => gp(t, "create", l, i));
    if (s || !a) throw s ?? new Error("The template could not be imported.");
    const o = await this.getContext(Z);
    o == null || o.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) o == null || o.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(Ht);
    n == null || n.dispatchEvent(new Ai({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const zm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: Br,
  api: Br
}, Symbol.toStringTag, { value: "Module" }));
var Wm = Object.defineProperty, Um = Object.getOwnPropertyDescriptor, yc = (e) => {
  throw TypeError(e);
}, fc = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Um(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wm(t, i, s), s;
}, Nm = (e, t, i) => t.has(e) || yc("Cannot " + i), Bm = (e, t, i) => t.has(e) ? yc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), jr = (e, t, i) => (Nm(e, t, "access private method"), i), Na, gc, vc;
let Ei = class extends kl {
  constructor() {
    super(...arguments), Bm(this, Na), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${jr(this, Na, gc)} aria-label="Choose a file" />
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
            @click=${jr(this, Na, vc)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Na = /* @__PURE__ */ new WeakSet();
gc = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
vc = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
Ei.styles = [
  A`
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
fc([
  y()
], Ei.prototype, "_json", 2);
Ei = fc([
  I("di-import-template-modal")
], Ei);
const jm = Ei, Km = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return Ei;
  },
  default: jm
}, Symbol.toStringTag, { value: "Module" }));
function bc(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? W : G,
    name: e.name,
    icon: t ? Jl : e.isEnabled ? Hl : Xl,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class Kr extends Oi {
  async requestCollection(t = {}) {
    const i = await this.getContext(Tl), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: o } = await T(this, (n) => _p({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return s ? { data: { total: s.total, items: s.items.map(bc) } } : { error: o };
  }
}
const Vm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: Kr,
  api: Kr,
  mapCollectionItem: bc
}, Symbol.toStringTag, { value: "Module" }));
class Vr extends Sl {
  async requestItemHref(t) {
    return t.entityType === W ? Di(W, t.unique) : Ps(t.unique);
  }
}
const qm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: Vr,
  api: Vr
}, Symbol.toStringTag, { value: "Module" }));
var Gm = Object.defineProperty, Ym = Object.getOwnPropertyDescriptor, _c = (e) => {
  throw TypeError(e);
}, tt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ym(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gm(t, i, s), s;
}, yn = (e, t, i) => t.has(e) || _c("Cannot " + i), ps = (e, t, i) => (yn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Fa = (e, t, i) => t.has(e) ? _c("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ba = (e, t, i, a) => (yn(e, t, "write to private field"), t.set(e, i), i), Xs = (e, t, i) => (yn(e, t, "access private method"), i), hs, zi, ia, Wi, wc, $c, xc;
const Hm = 400;
let pe = class extends P {
  constructor() {
    super(), Fa(this, Wi), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, Fa(this, hs), Fa(this, zi), Fa(this, ia), this.consumeContext(Ae, (e) => {
      Ba(this, hs, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), Ba(this, zi, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && Xs(this, Wi, wc).call(this);
    })), ps(this, zi).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ps(this, zi)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, Ba(this, ia, void 0);
  }
  render() {
    return this.item ? r`
      <uui-card-media
        name=${this.item.name}
        detail=${Zi(this.item.docTypes || void 0)}
        href=${Zi(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${Xs(this, Wi, $c)}
        @deselected=${Xs(this, Wi, xc)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : h}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : h;
  }
};
hs = /* @__PURE__ */ new WeakMap();
zi = /* @__PURE__ */ new WeakMap();
ia = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakSet();
wc = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || ps(this, ia) === t)) {
    Ba(this, ia, t);
    try {
      const i = await wp(e.unique, Hm, () => {
        var a;
        return (a = ps(this, hs)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
$c = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Dl(this.item.unique)));
};
xc = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new El(this.item.unique)));
};
pe.styles = [
  A`
      uui-card-media {
        height: 100%;
      }

      img {
        object-fit: contain;
      }

      slot[name="actions"] {
        --uui-button-background-color: var(--uui-color-surface);
        --uui-button-background-color-hover: var(--uui-color-surface);
      }
    `
];
tt([
  f({ type: Object })
], pe.prototype, "item", 2);
tt([
  f({ type: Boolean })
], pe.prototype, "selectable", 2);
tt([
  f({ type: Boolean })
], pe.prototype, "selected", 2);
tt([
  f({ type: Boolean, attribute: "select-only" })
], pe.prototype, "selectOnly", 2);
tt([
  f({ type: Boolean })
], pe.prototype, "disabled", 2);
tt([
  f({ type: String })
], pe.prototype, "href", 2);
tt([
  y()
], pe.prototype, "_src", 2);
tt([
  y()
], pe.prototype, "_failed", 2);
pe = tt([
  I("di-template-collection-card")
], pe);
const Xm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return pe;
  },
  get element() {
    return pe;
  }
}, Symbol.toStringTag, { value: "Module" }));
function qr(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function Jm(e) {
  const t = e.parentKey ? e.entityType === "font" ? _e : Ee : Kt;
  return {
    unique: e.key,
    parent: { unique: e.parentKey, entityType: t },
    name: e.name,
    entityType: sc(e.entityType),
    hasChildren: e.hasChildren,
    isFolder: e.entityType !== "font",
    icon: oc(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
class Zm extends vl {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = qr(i);
        return T(t, (o) => or(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        const { skip: a, take: s } = qr(i);
        if (i.parent.unique === null)
          return T(t, (n) => or(a, s, i.foldersOnly ?? !1, n));
        const o = i.parent.unique;
        return T(t, (n) => Lp(o, a, s, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => T(t, (a) => zp(i.treeItem.unique, a)),
      mapper: Jm
    });
  }
}
class Gr extends bl {
  constructor(t) {
    super(t, Zm);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: Kt,
      name: "Fonts",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const Qm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontTreeRepository: Gr,
  api: Gr
}, Symbol.toStringTag, { value: "Module" }));
class Yr extends Qo {
  constructor(t) {
    super(t, {
      workspaceAlias: ls,
      entityType: Ee,
      detailRepositoryAlias: qi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        // The same element as a template folder's: core's editable folder header, nothing more.
        component: () => Promise.resolve().then(() => Bd),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const ey = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFolderWorkspaceContext: Yr,
  api: Yr
}, Symbol.toStringTag, { value: "Module" }));
function ty(e) {
  switch (e.sourceKind) {
    case "path":
      return "wwwroot";
    case "url":
      return e.provider === "google" ? "Google Fonts" : e.provider === "bunny" ? "Bunny Fonts" : "Web";
    case "media":
      return "Media library";
    default:
      return "";
  }
}
function kc(e) {
  return {
    unique: e.key,
    entityType: sc(e.entityType),
    name: e.name,
    icon: oc(e.entityType, e.sourceKind === "url"),
    isFolder: e.entityType === "folder",
    variants: e.variantCount === null ? "" : String(e.variantCount),
    usedBy: e.usedByTemplateCount === null ? "" : String(e.usedByTemplateCount),
    weight: e.weight === null ? "" : String(e.weight),
    style: e.isItalic === null ? "" : e.isItalic ? "Italic" : "Upright",
    source: ty(e),
    sampleFontKey: e.sampleFontKey
  };
}
class Hr extends Oi {
  async requestCollection(t = {}) {
    const i = await this.getContext(Tl), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: o } = await T(this, (n) => Up({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return s ? { data: { total: s.total, items: s.items.map(kc) } } : { error: o };
  }
}
const iy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionRepository: Hr,
  api: Hr,
  mapFontCollectionItem: kc
}, Symbol.toStringTag, { value: "Module" }));
class Xr extends Sl {
  async requestItemHref(t) {
    return Di(t.entityType, t.unique);
  }
}
const Jr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionContext: Xr,
  api: Xr
}, Symbol.toStringTag, { value: "Module" })), Zr = /* @__PURE__ */ new Map(), $a = (e) => `di-${e}`;
function fn(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Zr.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await Mp(e, t), o = new FontFace($a(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return Zr.set(e, a), a;
}
async function ay(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => fn(a, t)));
}
var sy = Object.defineProperty, oy = Object.getOwnPropertyDescriptor, Tc = (e) => {
  throw TypeError(e);
}, xt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? oy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && sy(t, i, s), s;
}, gn = (e, t, i) => t.has(e) || Tc("Cannot " + i), Js = (e, t, i) => (gn(e, t, "read from private field"), t.get(e)), Zs = (e, t, i) => t.has(e) ? Tc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Sc = (e, t, i, a) => (gn(e, t, "write to private field"), t.set(e, i), i), Ra = (e, t, i) => (gn(e, t, "access private method"), i), ms, Gi, ai, $o, Dc, Ec;
let we = class extends P {
  constructor() {
    super(), Zs(this, ai), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._loaded = !1, Zs(this, ms), Zs(this, Gi), this.consumeContext(Ae, (e) => {
      Sc(this, ms, e), Ra(this, ai, $o).call(this);
    });
  }
  willUpdate(e) {
    super.willUpdate(e), e.has("item") && Ra(this, ai, $o).call(this);
  }
  render() {
    if (!this.item) return h;
    const e = this.item.isFolder ? void 0 : this.item.variants ? `${this.item.variants} variant${this.item.variants === "1" ? "" : "s"}` : [this.item.style, this.item.source].filter(Boolean).join(" · ");
    return r`
      <uui-card-media
        name=${this.item.name}
        detail=${Zi(e)}
        href=${Zi(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${Ra(this, ai, Dc)}
        @deselected=${Ra(this, ai, Ec)}>
        ${this.item.sampleFontKey && this._loaded ? r`<div class="specimen" style="font-family: ${$a(this.item.sampleFontKey)}, serif">Aa Bb</div>` : r`<umb-icon name=${this.item.icon}></umb-icon>`}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    `;
  }
};
ms = /* @__PURE__ */ new WeakMap();
Gi = /* @__PURE__ */ new WeakMap();
ai = /* @__PURE__ */ new WeakSet();
$o = function() {
  var i;
  const e = (i = this.item) == null ? void 0 : i.sampleFontKey, t = Js(this, ms);
  !t || !e || Js(this, Gi) === e || (Sc(this, Gi, e), this._loaded = !1, fn(e, () => t.getLatestToken()).then((a) => {
    Js(this, Gi) === e && (this._loaded = !!a);
  }));
};
Dc = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Dl(this.item.unique)));
};
Ec = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new El(this.item.unique)));
};
we.styles = [
  A`
      uui-card-media {
        height: 100%;
      }

      .specimen {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 48px;
        line-height: 1;
      }

      slot[name="actions"] {
        --uui-button-background-color: var(--uui-color-surface);
        --uui-button-background-color-hover: var(--uui-color-surface);
      }
    `
];
xt([
  f({ type: Object })
], we.prototype, "item", 2);
xt([
  f({ type: Boolean })
], we.prototype, "selectable", 2);
xt([
  f({ type: Boolean })
], we.prototype, "selected", 2);
xt([
  f({ type: Boolean, attribute: "select-only" })
], we.prototype, "selectOnly", 2);
xt([
  f({ type: Boolean })
], we.prototype, "disabled", 2);
xt([
  f({ type: String })
], we.prototype, "href", 2);
xt([
  y()
], we.prototype, "_loaded", 2);
we = xt([
  I("di-font-collection-card")
], we);
const ny = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontCollectionCardElement() {
    return we;
  },
  get element() {
    return we;
  }
}, Symbol.toStringTag, { value: "Module" }));
class Ls extends wl {
  async execute() {
    var n, l;
    const t = this.args.unique ?? null, i = { mode: this.mode };
    if (this.args.entityType === _e && t) {
      const { data: p } = await T(this, (m) => Wp([t], m));
      i.familyKey = t, i.familyName = (n = p == null ? void 0 : p[0]) == null ? void 0 : n.name;
    } else
      i.parentKey = t;
    const a = await en(this, Mm, { data: i });
    if (!(a != null && a.uploaded)) return;
    const s = await this.getContext(Z);
    s == null || s.peek("positive", { data: { message: "Font added" } }), (l = a.warnings) != null && l.length && (s == null || s.peek("warning", { data: { headline: "Some variants were not added", message: a.warnings.join(" ") } }));
    const o = await this.getContext(Ht);
    o == null || o.dispatchEvent(new Ai({ entityType: this.args.entityType, unique: t })), sn();
  }
}
class ry extends Ls {
  constructor() {
    super(...arguments), this.mode = "upload";
  }
}
class ly extends Ls {
  constructor() {
    super(...arguments), this.mode = "web";
  }
}
class cy extends Ls {
  constructor() {
    super(...arguments), this.mode = "path";
  }
}
class uy extends Ls {
  constructor() {
    super(...arguments), this.mode = void 0;
  }
}
const dy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ry
}, Symbol.toStringTag, { value: "Module" })), py = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ly
}, Symbol.toStringTag, { value: "Module" })), hy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: cy
}, Symbol.toStringTag, { value: "Module" })), my = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: uy
}, Symbol.toStringTag, { value: "Module" }));
class Qr extends Qo {
  constructor(t) {
    super(t, {
      workspaceAlias: cs,
      entityType: _e,
      detailRepositoryAlias: ac
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => zg),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFamilyWorkspaceContext: Qr,
  api: Qr
}, Symbol.toStringTag, { value: "Module" }));
class el extends Gd {
  constructor(t) {
    super(t, {
      workspaceAlias: Ua,
      entityType: Xt,
      detailRepositoryAlias: ic
    }), this.current = this._data.current, this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Bg),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
  setStyles(t) {
    this._data.updateCurrent({ styles: t });
  }
  /** A detected weight is a guess read out of the file's names; this is how it is corrected. */
  setWeight(t) {
    const i = this._data.getCurrent();
    this._data.updateCurrent({ weight: t, name: us(t, (i == null ? void 0 : i.isItalic) ?? !1) });
  }
  setItalic(t) {
    const i = this._data.getCurrent();
    this._data.updateCurrent({ isItalic: t, name: us((i == null ? void 0 : i.weight) ?? 400, t) });
  }
}
const vn = new wt(
  qd.contextAlias,
  void 0,
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === Xt;
  }
), fy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_WORKSPACE_CONTEXT: vn,
  DiFontWorkspaceContext: el,
  api: el
}, Symbol.toStringTag, { value: "Module" }));
var gy = Object.defineProperty, vy = Object.getOwnPropertyDescriptor, Cc = (e) => {
  throw TypeError(e);
}, xa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? vy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && gy(t, i, s), s;
}, bn = (e, t, i) => t.has(e) || Cc("Cannot " + i), qt = (e, t, i) => (bn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ma = (e, t, i) => t.has(e) ? Cc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xo = (e, t, i, a) => (bn(e, t, "write to private field"), t.set(e, i), i), Ve = (e, t, i) => (bn(e, t, "access private method"), i), ft, ys, fs, Se, ko, Ic, ja, Oc, Ac, Pc;
const by = ["Regular", "Bold", "Italic", "BoldItalic"];
function _y(e) {
  switch (e.sourceKind) {
    case "path":
      return `wwwroot: ${e.path ?? ""}`;
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : e.sourceUrl ?? "Web";
    default:
      return "Media library";
  }
}
let He = class extends P {
  constructor() {
    super(), Ma(this, Se), this._sampleLoaded = !1, this._usedBy = [], this._usedByTotal = 0, Ma(this, ft), Ma(this, ys), Ma(this, fs), this.consumeContext(Ae, (e) => {
      xo(this, ys, () => e == null ? void 0 : e.getLatestToken()), Ve(this, Se, ko).call(this);
    }), this.consumeContext(vn, (e) => {
      xo(this, ft, e), this.observe(e == null ? void 0 : e.current, (t) => {
        this._data = t, Ve(this, Se, ko).call(this);
      });
    });
  }
  render() {
    const e = this._data;
    return e ? r`
      <uui-box headline="Sample">
        <p class="specimen" style=${this._sampleLoaded ? `font-family: ${$a(e.unique)}, serif` : ""}>
          Designing social share images that actually get clicked
        </p>
      </uui-box>

      <uui-box headline="Weight and slant">
        <div class="identity">
          <uui-input
            id="weight"
            type="number"
            label="Weight"
            min="1"
            max="1000"
            step="100"
            .value=${String(e.weight)}
            @change=${(t) => {
      var i;
      return (i = qt(this, ft)) == null ? void 0 : i.setWeight(Number(t.target.value) || 400);
    }}>
          </uui-input>
          <uui-toggle
            id="italic"
            label="Italic"
            ?checked=${e.isItalic}
            @change=${(t) => {
      var i;
      return (i = qt(this, ft)) == null ? void 0 : i.setItalic(t.target.checked);
    }}>
            Italic
          </uui-toggle>
        </div>
        <small class="hint">
          Weight and slant are detected from the font file. Correct them here if they are wrong - a named style below
          chooses the <em>face</em> (Regular, Bold, Italic, BoldItalic), while this is the variant's numeric weight.
        </small>
      </uui-box>

      <uui-box headline="Named styles">
        <small class="hint">A named style - "Title", "Meta" - applies a size and face in one click in the designer.</small>
        ${Ve(this, Se, Pc).call(this, e.styles)}
        <uui-button look="secondary" label="Add a named style" @click=${Ve(this, Se, Oc)}>Add a style</uui-button>
      </uui-box>

      <uui-box headline="Source">
        <dl>
          <dt>Family</dt>
          <dd>
            ${e.font.familyKey ? r`<a href=${Di(_e, e.font.familyKey)}>${e.font.familyName}</a>` : e.font.familyName}
          </dd>
          <dt>File</dt>
          <dd>${_y(e.font)}</dd>
        </dl>
      </uui-box>

      <uui-box headline="Used by">
        ${this._usedByTotal === 0 ? r`<p class="hint">No template uses this font.</p>` : r`<ul class="used-by">
              ${te(
      this._usedBy,
      (t) => t.key,
      (t) => r`<li>
                  <uui-ref-node name=${t.name} href=${Ps(t.key)}>
                    <umb-icon slot="icon" name=${t.isEnabled ? "icon-picture" : "icon-picture color-grey"}></umb-icon>
                  </uui-ref-node>
                </li>`
    )}
            </ul>
            ${this._usedByTotal > this._usedBy.length ? r`<p class="hint">and ${this._usedByTotal - this._usedBy.length} more</p>` : h}`}
      </uui-box>
    ` : r`<uui-loader></uui-loader>`;
  }
};
ft = /* @__PURE__ */ new WeakMap();
ys = /* @__PURE__ */ new WeakMap();
fs = /* @__PURE__ */ new WeakMap();
Se = /* @__PURE__ */ new WeakSet();
ko = async function() {
  var s;
  const e = (s = this._data) == null ? void 0 : s.unique, t = qt(this, ys);
  if (!e || !t || qt(this, fs) === e) return;
  xo(this, fs, e);
  const [i, a] = await Promise.all([
    fn(e, t),
    Np(e, 0, 50, t).catch(() => {
    })
  ]);
  this._sampleLoaded = !!i, this._usedBy = (a == null ? void 0 : a.items) ?? [], this._usedByTotal = (a == null ? void 0 : a.total) ?? 0;
};
Ic = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
ja = function(e, t) {
  var a, s;
  const i = [...((a = this._data) == null ? void 0 : a.styles) ?? []];
  i[e] = { ...i[e], ...t }, (s = qt(this, ft)) == null || s.setStyles(i);
};
Oc = function() {
  var e, t;
  (t = qt(this, ft)) == null || t.setStyles([...((e = this._data) == null ? void 0 : e.styles) ?? [], { name: "New style", size: 32, fontStyle: "Regular" }]), Ve(this, Se, Ic).call(this);
};
Ac = function(e) {
  var i, a;
  const t = [...((i = this._data) == null ? void 0 : i.styles) ?? []];
  t.splice(e, 1), (a = qt(this, ft)) == null || a.setStyles(t);
};
Pc = function(e) {
  return e.length === 0 ? h : r`
      <uui-table>
        <uui-table-head>
          <uui-table-head-cell>Name</uui-table-head-cell>
          <uui-table-head-cell>Size</uui-table-head-cell>
          <uui-table-head-cell>Face</uui-table-head-cell>
          <uui-table-head-cell></uui-table-head-cell>
        </uui-table-head>
        ${te(
    e,
    (t, i) => i,
    (t, i) => r`
            <uui-table-row>
              <uui-table-cell>
                <uui-input
                  class="style-name"
                  label="Style name"
                  .value=${t.name}
                  @change=${(a) => Ve(this, Se, ja).call(this, i, { name: a.target.value })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-input
                  type="number"
                  label="Size"
                  .value=${String(t.size)}
                  @change=${(a) => Ve(this, Se, ja).call(this, i, { size: Number(a.target.value) })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-select
                  label="Face"
                  .options=${by.map((a) => ({ name: a, value: a, selected: a === t.fontStyle }))}
                  @change=${(a) => Ve(this, Se, ja).call(this, i, { fontStyle: a.target.value })}>
                </uui-select>
              </uui-table-cell>
              <uui-table-cell>
                <uui-button
                  compact
                  look="secondary"
                  color="danger"
                  label="Remove ${t.name}"
                  @click=${() => Ve(this, Se, Ac).call(this, i)}>
                  <uui-icon name="icon-trash"></uui-icon>
                </uui-button>
              </uui-table-cell>
            </uui-table-row>
          `
  )}
      </uui-table>
    `;
};
He.styles = A`
    :host {
      display: grid;
      gap: var(--uui-size-layout-1);
      padding: var(--uui-size-layout-1);
    }

    .specimen {
      margin: 0;
      font-size: 32px;
      line-height: 1.2;
    }

    .identity {
      display: flex;
      gap: var(--uui-size-space-4);
      align-items: center;
      flex-wrap: wrap;
    }

    .hint {
      display: block;
      margin: var(--uui-size-space-2) 0 var(--uui-size-space-4);
      color: var(--uui-color-text-alt);
      font-size: 12px;
    }

    uui-table {
      margin-bottom: var(--uui-size-space-4);
    }

    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: var(--uui-size-space-2) var(--uui-size-space-5);
      margin: 0;
    }

    dt {
      font-weight: 700;
    }

    dd {
      margin: 0;
      overflow-wrap: anywhere;
    }

    .used-by {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  `;
xa([
  y()
], He.prototype, "_data", 2);
xa([
  y()
], He.prototype, "_sampleLoaded", 2);
xa([
  y()
], He.prototype, "_usedBy", 2);
xa([
  y()
], He.prototype, "_usedByTotal", 2);
He = xa([
  I("di-font-workspace-view")
], He);
const wy = He, $y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontWorkspaceViewElement() {
    return He;
  },
  default: wy
}, Symbol.toStringTag, { value: "Module" }));
var xy = Object.defineProperty, ky = Object.getOwnPropertyDescriptor, Fc = (e) => {
  throw TypeError(e);
}, ka = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ky(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && xy(t, i, s), s;
}, _n = (e, t, i) => t.has(e) || Fc("Cannot " + i), gt = (e, t, i) => (_n(e, t, "read from private field"), t.get(e)), Mi = (e, t, i) => t.has(e) ? Fc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), tl = (e, t, i, a) => (_n(e, t, "write to private field"), t.set(e, i), i), qe = (e, t, i) => (_n(e, t, "access private method"), i), Ui, gs, Ka, Yi, De, To, Rc, Mc, Ni, Lc;
let Xe = class extends P {
  constructor() {
    super(), Mi(this, De), Mi(this, Ui), Mi(this, gs), this._templates = [], this._fonts = [], this._loading = !0, Mi(this, Ka, () => {
      gt(this, Ui) && qe(this, De, To).call(this);
    }), Mi(this, Yi, () => {
      var e;
      return (e = gt(this, Ui)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Z, (e) => {
      tl(this, gs, e);
    }), this.consumeContext(Ae, (e) => {
      tl(this, Ui, e), e && qe(this, De, To).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(ro, gt(this, Ka));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(ro, gt(this, Ka));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${qe(this, De, Mc).call(this)} ${qe(this, De, Lc).call(this)}
      </umb-body-layout>
    `;
  }
};
Ui = /* @__PURE__ */ new WeakMap();
gs = /* @__PURE__ */ new WeakMap();
Ka = /* @__PURE__ */ new WeakMap();
Yi = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakSet();
To = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      up(gt(this, Yi)),
      lo(gt(this, Yi)).catch(() => []),
      Rl(gt(this, Yi)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    qe(this, De, Rc).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Rc = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = gt(this, gs)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Mc = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${qe(this, De, Ni).call(this, "Templates", this._templates.length, "icon-brush", !1, Di(Ye))}
        ${qe(this, De, Ni).call(this, "Fonts", this._fonts.length, "icon-font", !1, Di(Kt))}
        ${qe(this, De, Ni).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${qe(this, De, Ni).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
Ni = function(e, t, i, a = !1, s) {
  const o = r`
      <uui-icon name=${i}></uui-icon>
      <div class="stat-value">${t}</div>
      <div class="stat-label">${e}</div>
    `;
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        ${s ? r`<a class="stat-link" href=${s} aria-label="${e}: ${t}">${o}</a>` : o}
      </uui-box>
    `;
};
Lc = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? h : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${te(
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
                  ${i.templateName ? r`<strong>${i.templateName}</strong> — ` : h}${i.message}
                </uui-table-cell>
              </uui-table-row>
            `
  )}
        </uui-table>
        <uui-button look="secondary" href=${sh("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Xe.styles = A`
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

    .stat-link {
      display: block;
      color: inherit;
      text-decoration: none;
    }

    .stat-link:hover .stat-label {
      text-decoration: underline;
    }
  `;
ka([
  y()
], Xe.prototype, "_templates", 2);
ka([
  y()
], Xe.prototype, "_fonts", 2);
ka([
  y()
], Xe.prototype, "_health", 2);
ka([
  y()
], Xe.prototype, "_loading", 2);
Xe = ka([
  I("di-overview-dashboard")
], Xe);
const Ty = Xe, Sy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return Xe;
  },
  default: Ty
}, Symbol.toStringTag, { value: "Module" }));
var Dy = Object.getOwnPropertyDescriptor, Ey = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = n(s) || s);
  return s;
};
let vs = class extends P {
  connectedCallback() {
    super.connectedCallback(), window.history.replaceState(null, "", Di(Kt));
  }
};
vs = Ey([
  I("di-fonts-redirect")
], vs);
const Cy = vs, Iy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsRedirectElement() {
    return vs;
  },
  default: Cy
}, Symbol.toStringTag, { value: "Module" }));
var Oy = Object.defineProperty, Ay = Object.getOwnPropertyDescriptor, zc = (e) => {
  throw TypeError(e);
}, Ta = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ay(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Oy(t, i, s), s;
}, wn = (e, t, i) => t.has(e) || zc("Cannot " + i), lt = (e, t, i) => (wn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), La = (e, t, i) => t.has(e) ? zc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), il = (e, t, i, a) => (wn(e, t, "write to private field"), t.set(e, i), i), ci = (e, t, i) => (wn(e, t, "access private method"), i), Va, ui, Ci, vt, bs, So, Wc;
let Je = class extends P {
  constructor() {
    super(), La(this, vt), La(this, Va), La(this, ui), this._loading = !0, this._busy = !1, La(this, Ci, () => {
      var e;
      return (e = lt(this, Va)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Z, (e) => {
      il(this, ui, e);
    }), this.consumeContext(Ae, (e) => {
      il(this, Va, e), e && ci(this, vt, bs).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => ci(this, vt, bs).call(this)}>Re-check</uui-button>
          </div>

          <ul class="summary">
            <li>
              Image generation is
              <strong class=${this._health.isEnabled ? "ok" : "bad"}>${this._health.isEnabled ? "on" : "off"}</strong>
              ${this._health.isEnabled ? h : r`(set <code>DynamicImages:Enabled</code> to true)`}
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
                ${te(
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
                        ${a.templateKey ? r`<a href=${Ps(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${ci(this, vt, Wc).call(this)}
      </umb-body-layout>
    `;
  }
};
Va = /* @__PURE__ */ new WeakMap();
ui = /* @__PURE__ */ new WeakMap();
Ci = /* @__PURE__ */ new WeakMap();
vt = /* @__PURE__ */ new WeakSet();
bs = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Rl(lt(this, Ci)),
      eh(lt(this, Ci)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
So = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await th(lt(this, Ci)) : await ih(lt(this, Ci));
    (t = lt(this, ui)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = lt(this, ui)) == null || i.peek("warning", { data: { message: o } });
    await ci(this, vt, bs).call(this);
  } catch (s) {
    (a = lt(this, ui)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Wc = function() {
  return this._sync ? r`
      <uui-box headline="Environment transfer">
        <p>
          Templates live in the database. To move them between environments, export them to JSON files under
          <code>${this._sync.folder}</code> and commit those, or import files someone else committed.
        </p>
        <p class="meta">
          Mode: <strong>${this._sync.mode}</strong> · ${this._sync.fileCount} file(s)
          ${this._sync.lastWriteUtc ? r`· last written ${new Date(this._sync.lastWriteUtc).toLocaleString()}` : h}
        </p>

        <div class="row">
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => ci(this, vt, So).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => ci(this, vt, So).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : h;
};
Je.styles = A`
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
Ta([
  y()
], Je.prototype, "_health", 2);
Ta([
  y()
], Je.prototype, "_sync", 2);
Ta([
  y()
], Je.prototype, "_loading", 2);
Ta([
  y()
], Je.prototype, "_busy", 2);
Je = Ta([
  I("di-health-dashboard")
], Je);
const Py = Je, Fy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Je;
  },
  default: Py
}, Symbol.toStringTag, { value: "Module" })), Uc = 3, Nc = 12, Bc = 0.1, jc = 0.9;
function Ry(e) {
  return Math.max(Uc, Math.min(Nc, e));
}
function My(e) {
  return Math.max(Bc, Math.min(jc, e));
}
function Ly(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Ry(t), s = 0.5 * My(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let p = 0; p < o; p++) {
    const m = (-90 + p * n) * Math.PI / 180, D = e === "star" && p % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + D * Math.cos(m), y: 0.5 + D * Math.sin(m) });
  }
  return l;
}
function zy(e, t, i) {
  const a = Ly(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
const v = {
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
  sides: { min: Uc, max: Nc },
  innerRatio: { min: Bc, max: jc }
}, _s = { min: 0.1, max: 4 };
function Wy(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function $n(e) {
  const t = e.kind ?? "linear", i = Math.round(Do(e.centreX ?? 0.5) * 100), a = Math.round(Do(e.centreY ?? 0.5) * 100);
  switch (t) {
    case "radial":
      return `radial-gradient(${e.shape ?? "ellipse"} ${Ny(e.extent)} at ${i}% ${a}%, ${Qs(e)})`;
    case "angular":
      return `conic-gradient(from ${e.angle}deg at ${i}% ${a}%, ${Qs(e)})`;
    case "reflected":
      return `linear-gradient(${e.angle}deg, ${Eo(By(_t(e)))})`;
    case "diamond": {
      const s = Eo(_t(e).map((o) => ({ ...o, position: o.position / 2 })));
      return [
        `linear-gradient(to top left, ${s}) left top / ${i}% ${a}% no-repeat`,
        `linear-gradient(to top right, ${s}) right top / ${100 - i}% ${a}% no-repeat`,
        `linear-gradient(to bottom left, ${s}) left bottom / ${i}% ${100 - a}% no-repeat`,
        `linear-gradient(to bottom right, ${s}) right bottom / ${100 - i}% ${100 - a}% no-repeat`
      ].join(", ");
    }
    default:
      return `linear-gradient(${e.angle}deg, ${Qs(e)})`;
  }
}
function Do(e) {
  return Math.min(1, Math.max(0, e));
}
const Uy = {
  farthestCorner: "farthest-corner",
  farthestSide: "farthest-side",
  closestCorner: "closest-corner",
  closestSide: "closest-side"
};
function Ny(e) {
  return Uy[e ?? "farthestCorner"] ?? "farthest-corner";
}
function _t(e) {
  const t = e.stops;
  return !t || t.length < 2 ? [{ colour: e.from, position: 0 }, { colour: e.to, position: 1 }] : t.map((i, a) => ({ stop: { colour: i.colour, position: Do(i.position) }, index: a })).sort((i, a) => i.stop.position - a.stop.position || i.index - a.index).map(({ stop: i }) => i);
}
function By(e) {
  return [
    ...[...e].reverse().map((t) => ({ colour: t.colour, position: 0.5 - t.position / 2 })),
    ...e.map((t) => ({ colour: t.colour, position: 0.5 + t.position / 2 }))
  ];
}
function Qs(e) {
  const t = e.stops;
  return t && t.length >= 2 ? Eo(_t(e)) : `${e.from}, ${e.to}`;
}
function Eo(e) {
  return e.map((t) => `${t.colour} ${xn(t.position * 100)}%`).join(", ");
}
const xn = (e) => Math.round(e * 100) / 100;
function aa(e, t) {
  const i = _t({ ...e, stops: t });
  return { ...e, stops: t, from: i[0].colour, to: i[i.length - 1].colour };
}
function jy(e) {
  const t = [..._t(e)].reverse().map((i) => ({ colour: i.colour, position: xn(1 - i.position) }));
  return aa(e, t);
}
function Ky(e) {
  const t = _t(e);
  let i = 0;
  for (let n = 1; n < t.length; n++)
    t[n].position - t[n - 1].position > t[i + 1].position - t[i].position && (i = n - 1);
  const a = t[i], s = t[i + 1], o = xn((a.position + s.position) / 2);
  return aa(e, [...t, { colour: qy(a.colour, s.colour, 0.5), position: o }]);
}
function Vy(e, t) {
  const i = _t(e);
  return i.length <= 2 ? e : aa(e, i.filter((a, s) => s !== t));
}
function qy(e, t, i) {
  const a = al(e), s = al(t);
  if (!a || !s) return e;
  const o = (p) => Math.round(a[p] + (s[p] - a[p]) * i).toString(16).padStart(2, "0").toUpperCase(), n = `#${o(0)}${o(1)}${o(2)}`, l = o(3);
  return l === "FF" ? n : `${n}${l}`;
}
function al(e) {
  const t = (e ?? "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t) || ![3, 4, 6, 8].includes(t.length)) return;
  const i = t.length <= 4 ? [...t].map((s) => s + s).join("") : t, a = (s) => parseInt(i.slice(s * 2, s * 2 + 2), 16);
  return [a(0), a(1), a(2), i.length === 8 ? a(3) : 255];
}
const kn = A`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Gy(e, t) {
  const i = [], a = t.lockX ? void 0 : sl(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Yy(t),
    t.threshold
  ), s = t.lockY ? void 0 : sl(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    Hy(t),
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
function Yy(e) {
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
function Hy(e) {
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
function sl(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var Xy = Object.defineProperty, Jy = Object.getOwnPropertyDescriptor, Kc = (e) => {
  throw TypeError(e);
}, it = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Xy(t, i, s), s;
}, Tn = (e, t, i) => t.has(e) || Kc("Cannot " + i), ke = (e, t, i) => (Tn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), eo = (e, t, i) => t.has(e) ? Kc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), to = (e, t, i, a) => (Tn(e, t, "write to private field"), t.set(e, i), i), V = (e, t, i) => (Tn(e, t, "access private method"), i), St, Bi, R, zs, Sn, Vc, qc, Gc, Yc, Dn, ws, Hc, Xc, Jc, Zc, Qc, eu, tu, iu, au;
const Zy = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], io = 18;
let Ce = class extends P {
  constructor() {
    super(...arguments), eo(this, R), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, eo(this, St), eo(this, Bi);
  }
  willUpdate() {
    this._box = V(this, R, Vc).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ke(this, Bi) && ((t = ke(this, St)) == null || t.disconnect(), to(this, Bi, e), e && (ke(this, St) ?? to(this, St, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ke(this, St).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ke(this, St)) == null || e.disconnect(), to(this, Bi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return h;
    const e = this._box;
    return r`
      <div
        class=${gl({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${U({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ke(this, R, qc) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...V(this, R, Dn).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      V(this, R, Hc).call(this, t), V(this, R, ws).call(this, t);
    }}>
        ${V(this, R, Xc).call(this)}
      </div>

      ${this.selected ? V(this, R, iu).call(this, e) : h}
      ${this.showMeasured && this.measured ? V(this, R, au).call(this) : h}
    `;
  }
};
St = /* @__PURE__ */ new WeakMap();
Bi = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakSet();
zs = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Sn = function() {
  return this.layer.rotation ?? 0;
};
Vc = function() {
  var s;
  const e = this.layer, t = e.size.width ?? V(this, R, Gc).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? V(this, R, Yc).call(this), a = Ms(ke(this, R, zs), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
qc = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
Gc = function() {
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
Yc = function() {
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
Dn = function(e) {
  const t = ke(this, R, Sn);
  if (t === 0) return {};
  const i = ke(this, R, zs);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
ws = function(e, t) {
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
Hc = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Xc = function() {
  switch (this.layer.type) {
    case "text":
      return V(this, R, Jc).call(this);
    case "image":
      return V(this, R, Qc).call(this);
    case "badges":
      return V(this, R, eu).call(this);
    default:
      return V(this, R, tu).call(this);
  }
};
Jc = function() {
  if (this.layer.type !== "text") return h;
  const e = this.layer.style, t = this.resolvedText || V(this, R, Zc).call(this);
  return r`
      <div
        class="text"
        style=${U({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${$a(e.fontKey)}, sans-serif`,
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
Zc = function() {
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
Qc = function() {
  if (this.layer.type !== "image") return h;
  const e = this.layer.border;
  return r`
      <div
        class="image"
        style=${U({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
eu = function() {
  if (this.layer.type !== "badges") return h;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", p = l && o, m = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${U({
    flexDirection: l ? "row" : "column",
    flexWrap: p ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...p ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${te(
    Array.from({ length: Math.max(1, a) }, (D, S) => S),
    (D) => D,
    () => r`
            <div class=${gl({ badge: !0, right: m === "right" })}>
              <div
                class="circle"
                style=${U({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${m === "none" ? h : r`<div
                    class="badge-label"
                    style=${U({
      ...m === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${$a(t.fontKey)}, sans-serif`,
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
tu = function() {
  if (this.layer.type !== "rect") return h;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? $n(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${U({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${o}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const n = zy(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${U({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${U({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
iu = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = ke(this, R, zs), n = ke(this, R, Sn), l = ze(this.layer.position, "x") || ze(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${U({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...V(this, R, Dn).call(this, e) })}>
        <span
          class="tag"
          style=${U(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : h}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? h : r`
              ${te(
    Zy,
    (p) => p,
    (p) => r`
                  <span
                    class="handle ${p}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${p}"
                    @pointerdown=${(m) => V(this, R, ws).call(this, m, p)}>
                  </span>
                `
  )}
              <span class="stalk" style=${U({ height: `${io}px`, top: `${-io}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${U({ top: `${-io}px` })}
                @pointerdown=${(p) => V(this, R, ws).call(this, p, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${U({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
au = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return r`
      <div
        class="measured"
        style=${U({
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
Ce.styles = A`
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
it([
  f({ type: Object })
], Ce.prototype, "layer", 2);
it([
  f({ type: Number })
], Ce.prototype, "scale", 2);
it([
  f({ type: Boolean, reflect: !0 })
], Ce.prototype, "selected", 2);
it([
  f({ type: Object })
], Ce.prototype, "measured", 2);
it([
  f({ type: Boolean })
], Ce.prototype, "showMeasured", 2);
it([
  f({ type: String })
], Ce.prototype, "resolvedText", 2);
it([
  f({ attribute: !1 })
], Ce.prototype, "resolvedPosition", 2);
it([
  y()
], Ce.prototype, "_box", 2);
Ce = it([
  I("di-layer-box")
], Ce);
var Qy = Object.defineProperty, ef = Object.getOwnPropertyDescriptor, su = (e) => {
  throw TypeError(e);
}, En = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ef(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Qy(t, i, s), s;
}, tf = (e, t, i) => t.has(e) || su("Cannot " + i), af = (e, t, i) => t.has(e) ? su("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), sf = (e, t, i) => (tf(e, t, "access private method"), i), Co, ou;
let sa = class extends P {
  constructor() {
    super(...arguments), af(this, Co), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${te(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => sf(this, Co, ou).call(this, e)
    )}`;
  }
};
Co = /* @__PURE__ */ new WeakSet();
ou = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
sa.styles = A`
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
En([
  f({ type: Array })
], sa.prototype, "guides", 2);
En([
  f({ type: Number })
], sa.prototype, "scale", 2);
sa = En([
  I("di-guides")
], sa);
var of = Object.defineProperty, nf = Object.getOwnPropertyDescriptor, nu = (e) => {
  throw TypeError(e);
}, Sa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && of(t, i, s), s;
}, rf = (e, t, i) => t.has(e) || nu("Cannot " + i), lf = (e, t, i) => t.has(e) ? nu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ol = (e, t, i) => (rf(e, t, "access private method"), i), qa, Io;
let Y = class extends P {
  constructor() {
    super(...arguments), lf(this, qa), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    ol(this, qa, Io).call(this, "top"), ol(this, qa, Io).call(this, "left");
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
qa = /* @__PURE__ */ new WeakSet();
Io = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : Y.thickness) * o, t.height = (e === "top" ? Y.thickness : s) * o, t.style.width = `${e === "top" ? s : Y.thickness}px`, t.style.height = `${e === "top" ? Y.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const p = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, D = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(p, Y.thickness - D), i.lineTo(p, Y.thickness)) : (i.moveTo(Y.thickness - D, p), i.lineTo(Y.thickness, p)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), p + 2, 9) : (i.save(), i.translate(9, p - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
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
Sa([
  f({ type: Number })
], Y.prototype, "canvasWidth", 2);
Sa([
  f({ type: Number })
], Y.prototype, "canvasHeight", 2);
Sa([
  f({ type: Number })
], Y.prototype, "scale", 2);
Sa([
  f({ type: Object })
], Y.prototype, "pointer", 2);
Y = Sa([
  I("di-rulers")
], Y);
var cf = Object.defineProperty, uf = Object.getOwnPropertyDescriptor, ru = (e) => {
  throw TypeError(e);
}, re = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? uf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && cf(t, i, s), s;
}, Cn = (e, t, i) => t.has(e) || ru("Cannot " + i), M = (e, t, i) => (Cn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), le = (e, t, i) => t.has(e) ? ru("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ga = (e, t, i, a) => (Cn(e, t, "write to private field"), t.set(e, i), i), F = (e, t, i) => (Cn(e, t, "access private method"), i), Dt, ji, bt, O, In, Oo, Ao, Ws, On, Po, lu, cu, An, uu, du, Fo, Ya, pu, hu, si, Pn, Ro, Mo, Lo, mu, zo, Wo, Uo, yu;
const df = 6, fu = 20, pf = 2, hf = 15, mf = 0.1;
let J = class extends P {
  constructor() {
    super(...arguments), le(this, O), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, le(this, Dt), le(this, ji), le(this, bt, /* @__PURE__ */ new Map()), le(this, Fo, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = F(this, O, On).call(this, t), a = F(this, O, Po).call(this, t), s = F(this, O, lu).call(this, t), o = F(this, O, Ws).call(this, e.detail.startX, e.detail.startY);
      Ga(this, Dt, {
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
    }), le(this, Ya, (e) => {
      var Fi, ae;
      this._pointer = F(this, O, Ao).call(this, e.clientX, e.clientY);
      const t = M(this, Dt);
      if (!t) return;
      const i = this.template.layers.find(($e) => $e.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        F(this, O, hu).call(this, i, t, e);
        return;
      }
      const o = ze(i.position, "x"), n = ze(i.position, "y"), l = t.startRotation, p = e.shiftKey || i.type === "rect" && i.lockAspect === !0;
      if (t.handle && l !== 0) {
        F(this, O, pu).call(this, i, t, t.handle, a, s, p, o, n);
        return;
      }
      let m = t.handle ? F(this, O, Pn).call(this, t.startBox, t.handle, a, s, p) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (m = { ...m, x: t.startBox.x, width: (Fi = t.handle) != null && Fi.includes("w") ? t.startBox.width : m.width }), n && (m = { ...m, y: t.startBox.y, height: (ae = t.handle) != null && ae.includes("n") ? t.startBox.height : m.height });
      const D = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, S = l !== 0 ? { x: m.x + D.x, y: m.y + D.y, width: t.startExtent.width, height: t.startExtent.height } : m, ie = this.snapEnabled && !e.altKey ? Gy(S, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter(($e) => $e.key !== i.key).map(($e) => F(this, O, Po).call(this, $e)),
        threshold: df / this.scale,
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
      this._guides = ie.guides;
      const ye = l !== 0 ? { ...m, x: ie.box.x - D.x, y: ie.box.y - D.y } : ie.box, fe = ph(ye, i.position);
      o && (fe.x = i.position.x), n && (fe.y = i.position.y);
      const Zt = { position: fe };
      t.handle && (Zt.size = {
        width: Math.max(1, Math.round(ye.width)),
        height: Math.max(1, Math.round(ye.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Zt } })
      );
    }), le(this, si, () => {
      if (!M(this, Dt)) return;
      const e = M(this, Dt).moved;
      Ga(this, Dt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), le(this, Ro, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), le(this, Mo, () => {
      this._dropTarget = !1;
    }), le(this, Lo, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = F(this, O, Ao).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: F(this, O, mu).call(this, e) }
        })
      );
    }), le(this, zo, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), le(this, Wo, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => jl(t.position)) && this.requestUpdate();
    }), le(this, Uo, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), Ga(this, ji, new ResizeObserver(() => F(this, O, Oo).call(this))), M(this, ji).observe(this), window.addEventListener("pointermove", M(this, Ya)), window.addEventListener("pointerup", M(this, si)), window.addEventListener("pointercancel", M(this, si));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = M(this, ji)) == null || e.disconnect(), window.removeEventListener("pointermove", M(this, Ya)), window.removeEventListener("pointerup", M(this, si)), window.removeEventListener("pointercancel", M(this, si));
  }
  updated(e) {
    F(this, O, Oo).call(this), e.has("zoom") && F(this, O, In).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = M(this, bt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return h;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    F(this, O, cu).call(this);
    const s = this.showRulers ? fu : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${M(this, zo)}
        @dragover=${M(this, Ro)}
        @dragleave=${M(this, Mo)}
        @drop=${M(this, Lo)}
        @di-layer-drag-start=${M(this, Fo)}
        @di-layer-box-resize=${M(this, Wo)}>
        <div
          class="artboard"
          style=${U({
      width: `${t + s}px`,
      height: `${i + s}px`,
      "--di-gutter": `${s}px`
    })}>
          ${this.showRulers ? r`<di-rulers
                .canvasWidth=${e.width}
                .canvasHeight=${e.height}
                .scale=${this.scale}
                .pointer=${this._pointer}>
              </di-rulers>` : h}

          <div
            class="stage"
            style=${U({
      background: e.backgroundGradient ? $n(e.backgroundGradient) : e.background
    })}
            @pointerdown=${M(this, Uo)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${U({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : h}

            ${te(
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
                  .resolvedPosition=${(l = M(this, bt).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? F(this, O, yu).call(this) : h}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
Dt = /* @__PURE__ */ new WeakMap();
ji = /* @__PURE__ */ new WeakMap();
bt = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
In = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Oo = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? fu : 0) + pf, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, F(this, O, In).call(this));
};
Ao = function(e, t) {
  const i = F(this, O, Ws).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Ws = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
On = function(e) {
  const t = M(this, bt).get(e.key);
  if (t) return t.box;
  const i = F(this, O, An).call(this, e), a = Ms(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Po = function(e) {
  const t = M(this, bt).get(e.key);
  return t ? t.extent : Bl(F(this, O, On).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
lu = function(e) {
  var t;
  return ((t = M(this, bt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
cu = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  Ga(this, bt, vh(
    this.template.layers,
    (i) => F(this, O, An).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
An = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? F(this, O, uu).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? F(this, O, du).call(this, e, i)
  };
};
uu = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
du = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Fo = /* @__PURE__ */ new WeakMap();
Ya = /* @__PURE__ */ new WeakMap();
pu = function(e, t, i, a, s, o, n, l) {
  const p = t.startRotation, m = t.startPosition, D = hh(a, s, 0, 0, p);
  let S = F(this, O, Pn).call(this, t.startBox, i, D.x, D.y, o);
  n && (S = { ...S, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : S.width }), l && (S = { ...S, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : S.height });
  const K = Math.max(1, Math.round(S.width)), ie = Math.max(1, Math.round(S.height)), ye = on(S.x, S.y, K, ie, m.anchor), fe = oi(ye.x, ye.y, m.x, m.y, p), Zt = {
    ...e.position,
    x: n ? e.position.x : Math.round(fe.x),
    y: l ? e.position.y : Math.round(fe.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Zt, size: { width: K, height: ie } } }
    })
  );
};
hu = function(e, t, i) {
  const a = t.startPosition, s = F(this, O, Ws).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, p = i.shiftKey ? hf : mf, m = Nl(Math.round(l / p) * p);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
si = /* @__PURE__ */ new WeakMap();
Pn = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: p } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, p = e.height - a), t.includes("s") && (p = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(p - e.height) ? p = l / m : l = p * m, t.includes("n") && (n = e.y + e.height - p), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, p) };
};
Ro = /* @__PURE__ */ new WeakMap();
Mo = /* @__PURE__ */ new WeakMap();
Lo = /* @__PURE__ */ new WeakMap();
mu = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
zo = /* @__PURE__ */ new WeakMap();
Wo = /* @__PURE__ */ new WeakMap();
Uo = /* @__PURE__ */ new WeakMap();
yu = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${U({ top: `${i}px`, bottom: `${i}px` })}></div>`;
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
      ${kn}
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
re([
  f({ type: Object })
], J.prototype, "template", 2);
re([
  f({ type: String })
], J.prototype, "selectedLayerKey", 2);
re([
  f({ type: Object })
], J.prototype, "baseImageUrl", 2);
re([
  f({ type: Array })
], J.prototype, "serverBounds", 2);
re([
  f({ type: Boolean })
], J.prototype, "showMeasured", 2);
re([
  f({ type: Boolean })
], J.prototype, "snapEnabled", 2);
re([
  f({ type: Boolean })
], J.prototype, "showRulers", 2);
re([
  f({ type: Boolean })
], J.prototype, "showSafeArea", 2);
re([
  f({ type: Number })
], J.prototype, "zoom", 2);
re([
  y()
], J.prototype, "_fitScale", 2);
re([
  y()
], J.prototype, "_guides", 2);
re([
  y()
], J.prototype, "_pointer", 2);
re([
  y()
], J.prototype, "_dropTarget", 2);
J = re([
  I("di-designer-canvas")
], J);
var yf = Object.defineProperty, ff = Object.getOwnPropertyDescriptor, gu = (e) => {
  throw TypeError(e);
}, Fn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ff(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && yf(t, i, s), s;
}, vu = (e, t, i) => t.has(e) || gu("Cannot " + i), gf = (e, t, i) => (vu(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vf = (e, t, i) => t.has(e) ? gu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), be = (e, t, i) => (vu(e, t, "access private method"), i), ee, bu, Rn, Mn, _u, wu, $u, xu, Hi;
const nl = {
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
let oa = class extends P {
  constructor() {
    super(...arguments), vf(this, ee), this.properties = [], this._search = "";
  }
  render() {
    const e = bf(gf(this, ee, bu));
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

        ${be(this, ee, wu).call(this)}

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : te(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => be(this, ee, _u).call(this, t, i)
    )}
      </div>
    `;
  }
};
ee = /* @__PURE__ */ new WeakSet();
bu = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Rn = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Mn = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
_u = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${te(
    t,
    (i) => i.alias,
    (i) => be(this, ee, Hi).call(
      this,
      i.name,
      nl[i.classification] ?? nl.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
wu = function() {
  return r`
      <div class="group">
        <h5>Elements</h5>
        ${be(this, ee, Hi).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${be(this, ee, Hi).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${be(this, ee, Hi).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${be(this, ee, $u).call(this)}
      </div>
    `;
};
$u = function() {
  const e = { kind: "static", layerType: "rect", preset: "rectangle" };
  return r`
      <div
        class="chip other shape"
        draggable="true"
        title="Shape"
        @dragstart=${(t) => be(this, ee, Mn).call(this, t, e)}>
        <uui-icon name="icon-shape-circle"></uui-icon>
        <button type="button" class="label chip-open" popovertarget="shape-menu" aria-label="Choose a shape">
          Shape
        </button>
        <uui-button compact look="secondary" label="Add a shape" popovertarget="shape-menu">
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
      <uui-popover-container id="shape-menu" placement="bottom-end">
        <div class="menu">
          <uui-menu-item label="Add shape" class="menu-heading" disabled></uui-menu-item>
          ${oh.map((t) => r`
            <uui-menu-item
              label=${Qi[t].label}
              data-preset=${t}
              @click-label=${() => be(this, ee, xu).call(this, t)}>
              <uui-icon slot="icon" name=${Qi[t].icon}></uui-icon>
            </uui-menu-item>
          `)}
        </div>
      </uui-popover-container>
    `;
};
xu = function(e) {
  var t, i, a;
  (a = (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#shape-menu")) == null ? void 0 : i.hidePopover) == null || a.call(i), be(this, ee, Rn).call(this, { kind: "static", layerType: "rect", preset: e });
};
Hi = function(e, t, i, a, s) {
  const o = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(n) => be(this, ee, Mn).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => be(this, ee, Rn).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
oa.styles = A`
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

    /* The Shape chip's name opens the menu too, so it is a real button - reset to read as the
       label it replaces. */
    .chip-open {
      border: 0;
      background: none;
      padding: 0;
      font: inherit;
      color: inherit;
      text-align: left;
      cursor: pointer;
    }

    .menu {
      min-width: 200px;
      padding: var(--uui-size-space-2) 0;
      background: var(--uui-color-surface);
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-3);
    }

    .menu-heading {
      --uui-menu-item-color-disabled: var(--uui-color-text-alt);
    }

    .empty {
      margin: 0;
      color: var(--uui-color-text-alt);
      font-size: 13px;
    }
  `;
Fn([
  f({ type: Array })
], oa.prototype, "properties", 2);
Fn([
  y()
], oa.prototype, "_search", 2);
oa = Fn([
  I("di-property-palette")
], oa);
function bf(e) {
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
function _f(e) {
  return e.backgroundGradient ? "gradient" : wf(e.background) ? "transparent" : "colour";
}
function wf(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function $f(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var xf = Object.defineProperty, kf = Object.getOwnPropertyDescriptor, ku = (e) => {
  throw TypeError(e);
}, Ln = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && xf(t, i, s), s;
}, Tf = (e, t, i) => t.has(e) || ku("Cannot " + i), Sf = (e, t, i) => t.has(e) ? ku("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), rl = (e, t, i) => (Tf(e, t, "access private method"), i), Ha, No;
let na = class extends P {
  constructor() {
    super(...arguments), Sf(this, Ha), this.value = "#FFFFFF", this.label = "Colour";
  }
  /**
   * The picker's swatch, and the value as text beside it: the compact picker shows only a swatch,
   * and a colour someone has been handed by a brand guide is typed, not dragged to.
   */
  render() {
    return r`
      <div class="colour">
        <uui-color-picker
          label=${this.label}
          format="hex"
          opacity
          uppercase
          .value=${this.value}
          @change=${rl(this, Ha, No)}></uui-color-picker>
        <uui-input
          label="${this.label} (hex)"
          spellcheck="false"
          .value=${this.value}
          @change=${rl(this, Ha, No)}></uui-input>
      </div>
    `;
  }
};
Ha = /* @__PURE__ */ new WeakSet();
No = function(e) {
  e.stopPropagation();
  const t = ll(e.target.value);
  !t || t === ll(this.value) || (this.value = t, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: t } })));
};
na.styles = A`
    :host {
      display: block;
      min-width: 0;
    }

    .colour {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      min-width: 0;
    }

    /* The picker's host is 100% wide by default, which leaves the hex field no room. */
    uui-color-picker {
      flex: 0 0 auto;
      width: auto;
    }

    uui-input {
      flex: 1 1 auto;
      min-width: 0;
    }
  `;
Ln([
  f({ type: String })
], na.prototype, "value", 2);
Ln([
  f({ type: String })
], na.prototype, "label", 2);
na = Ln([
  I("di-colour-input")
], na);
function ll(e) {
  const t = (e ?? "").trim(), i = t.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(i) || ![3, 4, 6, 8].includes(i.length)) return t;
  const s = (i.length <= 4 ? [...i].map((o) => o + o).join("") : i).toUpperCase();
  return s.length === 8 && s.endsWith("FF") ? `#${s.slice(0, 6)}` : `#${s}`;
}
var Df = Object.defineProperty, Ef = Object.getOwnPropertyDescriptor, Tu = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ef(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Df(t, i, s), s;
};
const cl = {
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
let $s = class extends P {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${te(
      Ul,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${cl[e]}
              title=${cl[e]}
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
$s.styles = A`
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
Tu([
  f({ type: String })
], $s.prototype, "value", 2);
$s = Tu([
  I("di-anchor-picker")
], $s);
var Cf = Object.defineProperty, If = Object.getOwnPropertyDescriptor, Su = (e) => {
  throw TypeError(e);
}, at = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? If(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Cf(t, i, s), s;
}, Of = (e, t, i) => t.has(e) || Su("Cannot " + i), Af = (e, t, i) => t.has(e) ? Su("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pf = (e, t, i) => (Of(e, t, "access private method"), i), Bo, Du;
let Ie = class extends P {
  constructor() {
    super(...arguments), Af(this, Bo), this.label = "", this.suffix = "px", this.step = 1, this.compact = !1, this.placeholder = "Auto";
  }
  render() {
    const e = r`
      <span class="input" slot="editor">
        <input
          type="number"
          aria-label=${this.label}
          .value=${this.value === null || this.value === void 0 ? "" : String(this.value)}
          placeholder=${this.placeholder}
          step=${this.step}
          min=${this.min ?? h}
          max=${this.max ?? h}
          @change=${Pf(this, Bo, Du)} />
        ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : h}
      </span>
    `;
    return this.label ? this.compact ? r`<label class="compact-field"><span class="compact-label">${this.label}</span>${e}</label>` : r`<umb-property-layout orientation="vertical" label=${this.label}>${e}</umb-property-layout>` : e;
  }
};
Bo = /* @__PURE__ */ new WeakSet();
Du = function(e) {
  const t = e.target, i = t.value, a = Wy(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Ie.styles = A`
    :host {
      display: block;
    }

    /* Core's layout pads for a full-width workspace; the inspector's fields use this. */
    umb-property-layout {
      padding: var(--uui-size-space-3) 0;
    }

    .compact-field {
      display: grid;
      gap: 2px;
    }

    .compact-label {
      font-size: 11px;
      color: var(--uui-color-text-alt);
    }

    :host([compact]) input {
      min-height: 0;
      padding: 4px 6px;
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
      /* The height of a uui-input or uui-select beside it. */
      min-height: calc(var(--uui-size-11, 36px) - 2px);
      padding: 0 var(--uui-size-space-3, 9px);
      font-variant-numeric: tabular-nums;
    }

    input:focus {
      outline: none;
    }

    .input:focus-within {
      border-color: var(--uui-color-focus);
    }

    .suffix {
      padding-right: var(--uui-size-space-3, 9px);
      font-size: 11px;
      color: var(--uui-color-text-alt);
    }
  `;
at([
  f({ type: Number })
], Ie.prototype, "value", 2);
at([
  f({ type: String })
], Ie.prototype, "label", 2);
at([
  f({ type: String })
], Ie.prototype, "suffix", 2);
at([
  f({ type: Number })
], Ie.prototype, "step", 2);
at([
  f({ type: Number })
], Ie.prototype, "min", 2);
at([
  f({ type: Number })
], Ie.prototype, "max", 2);
at([
  f({ type: Boolean, reflect: !0 })
], Ie.prototype, "compact", 2);
at([
  f({ type: String })
], Ie.prototype, "placeholder", 2);
Ie = at([
  I("di-number-field")
], Ie);
var Ff = Object.defineProperty, Rf = Object.getOwnPropertyDescriptor, Eu = (e) => {
  throw TypeError(e);
}, Jt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ff(t, i, s), s;
}, Mf = (e, t, i) => t.has(e) || Eu("Cannot " + i), Lf = (e, t, i) => t.has(e) ? Eu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (Mf(e, t, "access private method"), i), u, b, ge, Cu, Iu, Ou, zn, Au, Pu, Fu, jo, Ru, Mu, Lu, zu, Wu, Uu, Ko, Nu, Bu, Vo, ju, Xa, Ku, Vu, Wn, We, Pi, qu, Un, Gu;
const zf = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let Ze = class extends P {
  constructor() {
    super(...arguments), Lf(this, u), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? d(this, u, Ru).call(this, this.layer) : d(this, u, Cu).call(this)}</div>` : h;
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
ge = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Cu = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="stack">
          <di-number-field
            .min=${v.width.min}
            .max=${v.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => d(this, u, ge).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${v.height.min}
            .max=${v.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => d(this, u, ge).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${d(this, u, Iu).call(this, e)}

        <umb-property-layout orientation="vertical" label="Base image">

          <div slot="editor" class="editor">
          <uui-select
            label="Base image source"
            .value=${e.baseImage.kind}
            .options=${Yu(e.baseImage.kind)}
            @change=${(t) => d(this, u, ge).call(this, {
    baseImage: { ...e.baseImage, kind: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.baseImage.kind === "media" ? d(this, u, We).call(this, "Media item", d(this, u, Wn).call(this, e.baseImage.mediaKey, (t) => d(this, u, ge).call(this, { baseImage: { ...e.baseImage, kind: "media", mediaKey: t } }))) : h}

        ${e.baseImage.kind === "path" ? r`<umb-property-layout orientation="vertical" label="Path">

              <div slot="editor" class="editor">
              <uui-input
                .value=${e.baseImage.path ?? ""}
                placeholder="/assets/og-background.png"
                @change=${(t) => d(this, u, ge).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : h}

        ${e.baseImage.kind === "property" ? r`<umb-property-layout orientation="vertical" label="From property">

              <div slot="editor" class="editor">
              ${d(this, u, Pi).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, ge).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.baseImageFit}
            .options=${B(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => d(this, u, ge).call(this, { baseImageFit: t.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

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
Iu = function(e) {
  const t = _f(e);
  return r`
      <umb-property-layout orientation="vertical" label="Fill">

        <div slot="editor" class="editor">
        <uui-select
          .value=${t}
          .options=${B(["colour", "gradient", "transparent"], t)}
          @change=${(i) => d(this, u, Ou).call(this, e, i.target.value)}>
        </uui-select>
      </div>

      </umb-property-layout>

      ${t === "colour" ? r`<umb-property-layout orientation="vertical" label="Colour">

            <div slot="editor" class="editor">
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => d(this, u, ge).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </div>

          </umb-property-layout>` : h}

      ${t === "gradient" && e.backgroundGradient ? d(this, u, zn).call(this, e.backgroundGradient, (i) => d(this, u, ge).call(this, { backgroundGradient: i })) : h}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : h}
    `;
};
Ou = function(e, t) {
  if (t === "gradient") {
    d(this, u, ge).call(this, { backgroundGradient: e.backgroundGradient ?? Wl() });
    return;
  }
  d(this, u, ge).call(this, {
    background: $f(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
zn = function(e, t) {
  const i = e.kind ?? "linear", a = i === "linear" || i === "reflected" || i === "angular", s = i === "radial" || i === "angular" || i === "diamond";
  return r`
      ${d(this, u, We).call(this, "Gradient type", r`
        <uui-select
          label="Gradient type"
          .value=${i}
          .options=${B(["linear", "radial", "angular", "diamond", "reflected"], i, Wf)}
          @change=${(o) => t({ ...e, kind: o.target.value })}>
        </uui-select>
      `)}

      <div class="gradient-preview" role="img" aria-label="The gradient" style="background: ${$n(e)}"></div>

      ${a ? d(this, u, Au).call(this, e, t) : h}
      ${i === "radial" ? d(this, u, Pu).call(this, e, t) : h}
      ${s ? r`
            ${d(this, u, jo).call(this, "Centre X", e.centreX, (o) => t({ ...e, centreX: o }))}
            ${d(this, u, jo).call(this, "Centre Y", e.centreY, (o) => t({ ...e, centreY: o }))}
          ` : h}

      ${d(this, u, Fu).call(this, e, t)}
    `;
};
Au = function(e, t) {
  const i = Math.round(e.angle ?? 180) % 360, a = (s) => t({ ...e, angle: (Math.round(s) % 360 + 360) % 360 });
  return d(this, u, We).call(this, e.kind === "angular" ? "Start angle" : "Angle", r`
      <div class="angle">
        <uui-slider
          label="Angle"
          hide-step-values
          min="0"
          max="359"
          step="1"
          .value=${String(i)}
          @change=${(s) => a(Number(s.target.value))}>
        </uui-slider>
        <di-number-field
          label="Degrees"
          suffix="°"
          .min=${v.gradientAngle.min}
          .max=${v.gradientAngle.max}
          .value=${i}
          @change=${(s) => a(s.detail.value ?? 180)}>
        </di-number-field>
        <uui-button-group>
          ${Nf.map(([s, o, n]) => r`
            <uui-button
              compact
              look=${i === o ? "primary" : "secondary"}
              label=${n}
              title=${n}
              @click=${() => a(o)}>${s}</uui-button>
          `)}
        </uui-button-group>
      </div>
    `);
};
Pu = function(e, t) {
  const i = e.shape ?? "ellipse", a = e.extent ?? "farthestCorner";
  return r`
      ${d(this, u, We).call(this, "Shape", r`
        <uui-select
          label="Radial shape"
          .value=${i}
          .options=${B(["ellipse", "circle"], i)}
          @change=${(s) => t({ ...e, shape: s.target.value })}>
        </uui-select>
      `)}
      ${d(this, u, We).call(this, "Size", r`
        <uui-select
          label="Radial size"
          .value=${a}
          .options=${B(["farthestCorner", "farthestSide", "closestCorner", "closestSide"], a, Uf)}
          @change=${(s) => t({ ...e, extent: s.target.value })}>
        </uui-select>
      `, "Where the last colour lands.")}
    `;
};
Fu = function(e, t) {
  const i = _t(e);
  return d(this, u, We).call(this, "Colour stops", r`
      <div class="stops">
        ${i.map((a, s) => r`
          <div class="stop">
            <di-colour-input
              label="Stop ${s + 1} colour"
              .value=${a.colour}
              @change=${(o) => t(aa(e, i.map((n, l) => l === s ? { ...n, colour: o.detail.value } : n)))}>
            </di-colour-input>
            <div class="stop-position">
              <di-number-field
                label="Position"
                suffix="%"
                .min=${0}
                .max=${100}
                .value=${Math.round(a.position * 100)}
                @change=${(o) => t(aa(e, i.map((n, l) => l === s ? { ...n, position: (o.detail.value ?? 0) / 100 } : n)))}>
              </di-number-field>
              <uui-button
                compact
                look="secondary"
                color="danger"
                label="Remove stop ${s + 1}"
                ?disabled=${i.length <= 2}
                @click=${() => t(Vy(e, s))}>
                <uui-icon name="icon-trash"></uui-icon>
              </uui-button>
            </div>
          </div>
        `)}
        <div class="stop-actions">
          <uui-button look="secondary" label="Add stop" @click=${() => t(Ky(e))}>
            <uui-icon name="icon-add"></uui-icon> Add stop
          </uui-button>
          <uui-button look="secondary" label="Reverse the gradient" @click=${() => t(jy(e))}>
            <uui-icon name="icon-sync"></uui-icon> Reverse
          </uui-button>
        </div>
      </div>
    `);
};
jo = function(e, t, i) {
  return r`<di-number-field
      .min=${v.gradientCentre.min * 100}
      .max=${v.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
Ru = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, Mu).call(this, e) : h}
      ${e.type === "text" ? d(this, u, Lu).call(this, e) : h}
      ${e.type === "image" ? d(this, u, zu).call(this, e) : h}
      ${e.type === "badges" ? d(this, u, Wu).call(this, e) : h}
      ${e.type === "rect" ? d(this, u, Nu).call(this, e) : h}
      ${d(this, u, Bu).call(this, e)} ${d(this, u, Vu).call(this, e)}
    `;
};
Mu = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${B(
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
            @change=${(i) => d(this, u, b).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? d(this, u, We).call(this, "Property", d(this, u, Pi).call(this, t.propertyAlias ?? "", (i) => d(this, u, b).call(this, { binding: { ...t, propertyAlias: i } }))) : h}

        ${t.kind === "date" ? r`<umb-property-layout orientation="vertical" label="Date format">

              <div slot="editor" class="editor">
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => d(this, u, b).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : h}

        ${t.kind === "static" || t.kind === "expression" ? r`<umb-property-layout orientation="vertical" label="${t.kind === "static" ? "Text" : "Expression"}">

              <div slot="editor" class="editor">
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => d(this, u, b).call(this, {
    binding: { ...t, text: i.target.value }
  })}>
              </uui-textarea>
              ${t.kind === "expression" ? r`<small class="hint">
                    Tokens: <code>{name}</code>, <code>{readingTime}</code>, <code>{prop:alias}</code>,
                    <code>{date:alias:format}</code>
                  </small>` : h}
            </div>

            </umb-property-layout>` : h}

        <div class="stack">
          <umb-property-layout orientation="vertical" label="Prefix">

            <div slot="editor" class="editor">
            <uui-input
              .value=${e.prefix ?? ""}
              @change=${(i) => d(this, u, b).call(this, { prefix: i.target.value })}>
            </uui-input>
          </div>

          </umb-property-layout>
          <umb-property-layout orientation="vertical" label="Suffix">

            <div slot="editor" class="editor">
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => d(this, u, b).call(this, { suffix: i.target.value })}>
            </uui-input>
          </div>

          </umb-property-layout>
        </div>
      </uui-box>
    `;
};
Lu = function(e) {
  const t = e.style, i = (a) => d(this, u, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <umb-property-layout orientation="vertical" label="Font">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, Un).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${d(this, u, Gu).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

        <div class="stack">
          <di-number-field
            .min=${v.fontSize.min}
            .max=${v.fontSize.max}
            label="Size"
            .value=${t.fontSize}
            @change=${(a) => i({ fontSize: a.detail.value ?? t.fontSize })}>
          </di-number-field>
          <umb-property-layout orientation="vertical" label="Weight">

            <div slot="editor" class="editor">
            <uui-select
              .value=${t.fontStyle}
              .options=${B(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
              @change=${(a) => i({ fontStyle: a.target.value })}>
            </uui-select>
          </div>

          </umb-property-layout>
        </div>

        <umb-property-layout orientation="vertical" label="Colour">

          <div slot="editor" class="editor">
          <di-colour-input
            label="Text colour"
            .value=${t.colour}
            @change=${(a) => i({ colour: a.detail.value })}>
          </di-colour-input>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Align inside the box">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.textAlign}
            .options=${B(["left", "centre", "right"], t.textAlign)}
            @change=${(a) => i({ textAlign: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        <div class="stack">
          <di-number-field
            .min=${v.lineSpacing.min}
            .max=${v.lineSpacing.max}
            label="Line spacing"
            suffix="×"
            step="0.05"
            .value=${t.lineSpacing}
            @change=${(a) => i({ lineSpacing: a.detail.value ?? 1 })}>
          </di-number-field>
          <di-number-field
            .min=${v.letterSpacing.min}
            .max=${v.letterSpacing.max}
            label="Letter spacing"
            .value=${t.letterSpacing}
            @change=${(a) => i({ letterSpacing: a.detail.value ?? 0 })}>
          </di-number-field>
        </div>

        <div class="stack">
          <di-number-field
            .min=${v.maxLines.min}
            .max=${v.maxLines.max}
            label="Max lines"
            suffix=""
            placeholder="No limit"
            .value=${t.maxLines ?? null}
            @change=${(a) => i({ maxLines: a.detail.value })}>
          </di-number-field>
          <umb-property-layout orientation="vertical" label="When it overflows">

            <div slot="editor" class="editor">
            <uui-select
              .value=${t.overflow}
              .options=${B(["shrink", "ellipsis", "clip"], t.overflow, {
    shrink: "Shrink to fit",
    ellipsis: "Trim with …",
    clip: "Cut off"
  })}
              @change=${(a) => i({ overflow: a.target.value })}>
            </uui-select>
          </div>

          </umb-property-layout>
        </div>

        <umb-property-layout orientation="vertical" label="Transform">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.textTransform}
            .options=${B(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
zu = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${Yu(t.kind)}
            @change=${(a) => d(this, u, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" ? d(this, u, We).call(this, "Property", d(this, u, Pi).call(
    this,
    t.propertyAlias ?? "",
    (a) => d(this, u, b).call(this, { source: { ...t, propertyAlias: a } }),
    // The root widens from media to media + content, and the media filter moves to the
    // tail: that is exactly the author.mainImage case, and it never offers a text
    // property as an image source.
    { root: ["media", "content"], tail: "media" }
  )) : h}

        ${t.kind === "path" ? r`<umb-property-layout orientation="vertical" label="Path">

              <div slot="editor" class="editor">
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => d(this, u, b).call(this, {
    source: { ...t, path: a.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : h}

        ${t.kind === "media" ? d(this, u, We).call(this, "Media item", d(this, u, Wn).call(this, t.mediaKey, (a) => d(this, u, b).call(this, { source: { ...t, kind: "media", mediaKey: a } }))) : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.fit}
            .options=${B(["cover", "contain", "stretch"], e.fit)}
            @change=${(a) => d(this, u, b).call(this, { fit: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        <di-number-field
          .min=${v.cornerRadius.min}
          .max=${v.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => d(this, u, b).call(this, { cornerRadius: a.detail.value ?? 0 })}>
        </di-number-field>

        <umb-property-layout orientation="vertical" label="Border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-number-field
              .min=${v.borderWidth.min}
              .max=${v.borderWidth.max}
              label="Width"
              .value=${((i = e.border) == null ? void 0 : i.width) ?? 0}
              @change=${(a) => {
    var o;
    const s = a.detail.value ?? 0;
    d(this, u, b).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => d(this, u, b).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : h}
          </div>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
Wu = function(e) {
  const t = (s) => d(this, u, b).call(this, { badge: { ...e.badge, ...s } }), i = (s) => d(this, u, b).call(this, { label: { ...e.label, ...s } }), a = (s) => d(this, u, b).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <umb-property-layout orientation="vertical" label="Items from">

          <div slot="editor" class="editor">
          ${d(this, u, Pi).call(this, e.itemsPropertyAlias, (s) => d(this, u, b).call(this, { itemsPropertyAlias: s }))}
        </div>

        </umb-property-layout>

        <div class="stack">
          <di-number-field
            .min=${v.maxItems.min}
            .max=${v.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => d(this, u, b).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${v.gap.min}
            .max=${v.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => d(this, u, b).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <umb-property-layout orientation="vertical" label="Direction">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.direction}
            .options=${B(["horizontal", "vertical"], e.direction)}
            @change=${(s) => d(this, u, b).call(this, { direction: s.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.direction === "horizontal" ? r`
              <umb-property-layout orientation="vertical" label="Wrap onto new rows">

                <div slot="editor" class="editor">
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => d(this, u, b).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </div>

              </umb-property-layout>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${v.rowGap.min}
                      .max=${v.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => d(this, u, b).call(this, { rowGap: s.detail.value ?? 20 })}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  ` : h}
            ` : h}

        <div class="stack">
          <di-number-field
            .min=${v.circleSize.min}
            .max=${v.circleSize.max}
            label="Circle size"
            .value=${e.badge.size}
            @change=${(s) => t({ size: s.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
            .min=${v.iconSize.min}
            .max=${v.iconSize.max}
            label="Icon size"
            .value=${e.badge.innerSize}
            @change=${(s) => t({ innerSize: s.detail.value ?? 44 })}>
          </di-number-field>
        </div>

        <umb-property-layout orientation="vertical" label="Circle fill">

          <div slot="editor" class="editor">
          <di-colour-input
            label="Circle fill"
            .value=${e.badge.fillColour}
            @change=${(s) => t({ fillColour: s.detail.value })}>
          </di-colour-input>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Circle border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-colour-input
              label="Circle border colour"
              .value=${e.badge.borderColour}
              @change=${(s) => t({ borderColour: s.detail.value })}>
            </di-colour-input>
            <di-number-field
              .min=${v.borderWidth.min}
              .max=${v.borderWidth.max}
              label="Width"
              step="0.5"
              .value=${e.badge.borderWidth}
              @change=${(s) => t({ borderWidth: s.detail.value ?? 1.5 })}>
            </di-number-field>
          </div>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Icon folder">

          <div slot="editor" class="editor">
          <uui-input
            .value=${e.icon.basePath}
            placeholder="/assets/og-icons"
            @change=${(s) => a({ basePath: s.target.value })}>
          </uui-input>
          <small class="hint">Icons are matched by slugifying the item's name, with default.png as a fallback.</small>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Label position">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.label.position}
            .options=${B(["below", "right", "none"], e.label.position, {
    below: "Below the icon",
    right: "Beside the icon",
    none: "Icon only"
  })}
            @change=${(s) => i({ position: s.target.value })}>
          </uui-select>
          ${e.label.position === "right" ? r`<small class="hint">Each badge is as wide as its own label.</small>` : h}
        </div>

        </umb-property-layout>

        ${e.label.position === "none" ? h : r`
              <umb-property-layout orientation="vertical" label="Label font">

                <div slot="editor" class="editor">
                <uui-select
                  .value=${e.label.fontKey}
                  .options=${d(this, u, Un).call(this, e.label.fontKey)}
                  @change=${(s) => i({ fontKey: s.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>

              <div class="stack">
                <di-number-field
                  .min=${v.labelSize.min}
                  .max=${v.labelSize.max}
                  label="Label size"
                  .value=${e.label.fontSize}
                  @change=${(s) => i({ fontSize: s.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
                  .min=${v.labelGap.min}
                  .max=${v.labelGap.max}
                  label="Label gap"
                  .value=${e.label.gap}
                  @change=${(s) => i({ gap: s.detail.value ?? 10 })}>
                </di-number-field>
              </div>

              <umb-property-layout orientation="vertical" label="Label colour">

                <div slot="editor" class="editor">
                <di-colour-input
                  label="Label colour"
                  .value=${e.label.colour}
                  @change=${(s) => i({ colour: s.detail.value })}>
                </di-colour-input>
              </div>

              </umb-property-layout>

              <umb-property-layout orientation="vertical" label="Label transform">

                <div slot="editor" class="editor">
                <uui-select
                  .value=${e.label.textTransform}
                  .options=${B(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>
            `}
      </uui-box>
    `;
};
Uu = function(e, t) {
  if (t === "circle") {
    const a = e.size.width ?? e.size.height ?? 200;
    d(this, u, b).call(this, { shape: "ellipse", lockAspect: !0, size: { ...e.size, width: a, height: a } });
    return;
  }
  const i = qo(e) === "circle";
  d(this, u, b).call(this, {
    shape: t,
    ...i ? { lockAspect: !1 } : {}
  });
};
Ko = function(e, t, i) {
  const a = e.type === "rect" && e.lockAspect === !0, { width: s, height: o } = e.size;
  if (!a || i === null || !s || !o) {
    d(this, u, b).call(this, { size: { ...e.size, [t]: i } });
    return;
  }
  const n = t === "width" ? { width: i, height: Math.round(i * o / s) } : { width: Math.round(i * s / o), height: i };
  d(this, u, b).call(this, { size: n });
};
Nu = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <umb-property-layout orientation="vertical" label="Shape">

          <div slot="editor" class="editor">
          <uui-select
            .value=${qo(e)}
            .options=${B(["rectangle", "circle", "ellipse", "polygon", "star"], qo(e))}
            @change=${(s) => d(this, u, Uu).call(this, e, s.target.value)}>
          </uui-select>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Lock aspect ratio">

          <div slot="editor" class="editor">
          <uui-toggle
            label="Lock aspect ratio"
            ?checked=${e.lockAspect === !0}
            @change=${(s) => d(this, u, b).call(this, { lockAspect: s.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${t === "polygon" || t === "star" ? r`
              <div class="stack">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  .min=${v.sides.min}
                  .max=${v.sides.max}
                  .value=${e.sides ?? 5}
                  @change=${(s) => d(this, u, b).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${v.innerRatio.min}
                      .max=${v.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => d(this, u, b).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : h}
              </div>
            ` : h}

        <umb-property-layout orientation="vertical" label="Fill">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${i}
            @change=${(s) => d(this, u, b).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${i ? r`<umb-property-layout orientation="vertical" label="Fill colour">

              <div slot="editor" class="editor">
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => d(this, u, b).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Gradient">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => d(this, u, b).call(this, {
    gradient: s.target.checked ? Wl() : null
  })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${e.gradient ? d(this, u, zn).call(this, e.gradient, (s) => d(this, u, b).call(this, { gradient: s })) : h}

        ${t === "rectangle" ? r`<di-number-field
            .min=${v.cornerRadius.min}
            .max=${v.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => d(this, u, b).call(this, { cornerRadius: s.detail.value ?? 0 })}>
            </di-number-field>` : h}

        <umb-property-layout orientation="vertical" label="Border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-number-field
              .min=${v.borderWidth.min}
              .max=${v.borderWidth.max}
              label="Width"
              .value=${((a = e.border) == null ? void 0 : a.width) ?? 0}
              @change=${(s) => {
    var n;
    const o = s.detail.value ?? 0;
    d(this, u, b).call(this, {
      border: o > 0 ? { width: o, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => d(this, u, b).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : h}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
Bu = function(e) {
  const t = ze(e.position, "x"), i = ze(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${d(this, u, Vo).call(this, e, "x")} ${d(this, u, Vo).call(this, e, "y")}

        <umb-property-layout orientation="vertical" label="Anchor">

          <div slot="editor" class="editor">
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => d(this, u, Ku).call(this, e, s.detail.value)}>
          </di-anchor-picker>
          <small class="hint">
            Where X and Y sit on the layer's box.
            ${t || i ? r`The ${t && i ? "horizontal and vertical" : t ? "horizontal" : "vertical"}
                  ${t && i ? "components are" : "component is"} set by the edge
                  ${t && i ? "each axis tracks" : "that axis tracks"}.` : h}
            ${a !== 0 ? r`The layer turns around this point.` : h}
          </small>
        </div>

        </umb-property-layout>

        <div class="stack">
          <di-number-field
            label="Rotation"
            suffix="°"
            step="1"
            placeholder="0"
            .value=${a}
            @change=${(s) => d(this, u, b).call(this, { rotation: Nl(s.detail.value ?? 0) })}>
          </di-number-field>
          <small class="hint">Clockwise, around the anchor point. Drag the handle above the selection on the canvas; hold Shift for 15° steps.</small>
        </div>

        <div class="stack">
          <di-number-field
            .min=${v.width.min}
            .max=${v.width.max}
            label="Width"
            placeholder="Auto"
            .value=${e.size.width ?? null}
            @change=${(s) => d(this, u, Ko).call(this, e, "width", s.detail.value)}>
          </di-number-field>
          <di-number-field
            .min=${v.height.min}
            .max=${v.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => d(this, u, Ko).call(this, e, "height", s.detail.value)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
Vo = function(e, t) {
  const i = ze(e.position, t), a = os(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
  return r`
      <div class="axis">
        <umb-property-layout orientation="vertical" label="${t === "x" ? "Horizontal position" : "Vertical position"}">

          <div slot="editor" class="editor">
          <uui-select
            .value=${i ? "relative" : "absolute"}
            .options=${[
    { name: "Absolute", value: "absolute", selected: !i },
    { name: "Relative to a layer", value: "relative", selected: i }
  ]}
            @change=${(n) => d(this, u, ju).call(this, e, t, n.target.value)}>
          </uui-select>
          ${!i && s.length === 0 ? r`<small class="hint">Add another layer to position this one against it.</small>` : h}
        </div>

        </umb-property-layout>

        ${i && a ? r`
              <umb-property-layout orientation="vertical" label="Tracks">

                <div slot="editor" class="editor">
                <div class="stack">
                  <uui-select
                    .value=${a.layerKey}
                    .options=${s.map((n) => ({
    name: n.name || n.type,
    value: n.key,
    selected: n.key === a.layerKey
  }))}
                    @change=${(n) => d(this, u, Xa).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${B(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => d(this, u, Xa).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </div>

              </umb-property-layout>

              <di-number-field
                .min=${v.referenceGap.min}
                .max=${v.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => d(this, u, Xa).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? v.x.min : v.y.min}
                .max=${t === "x" ? v.x.max : v.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => d(this, u, b).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
ju = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (ze(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && d(this, u, b).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: mh
      }
    }
  });
};
Xa = function(e, t, i) {
  const a = os(e.position, t);
  a && d(this, u, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Ku = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? dh(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, b).call(this, { position: s });
};
Vu = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <umb-property-layout orientation="vertical" label="Visible">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => d(this, u, b).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Locked">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => d(this, u, b).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${v.opacity.min}
          .max=${v.opacity.max}
          .value=${e.opacity}
          @change=${(t) => d(this, u, b).call(this, { opacity: t.detail.value ?? 1 })}>
        </di-number-field>

        <umb-property-layout orientation="vertical" label="Show this layer">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.visibility.rule}
            .options=${B(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
    always: "Always",
    whenNotEmpty: "When it has a value",
    whenPropertyTruthy: "When another property is set"
  })}
            @change=${(t) => d(this, u, b).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<umb-property-layout orientation="vertical" label="Controlled by">

              <div slot="editor" class="editor">
              ${d(this, u, Pi).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, b).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </div>

            </umb-property-layout>` : h}
      </uui-box>
    `;
};
Wn = function(e, t) {
  return r`
      <umb-input-media
        max="1"
        .selection=${e ? [e] : []}
        @change=${(i) => t(i.target.selection[0] ?? null)}>
      </umb-input-media>
    `;
};
We = function(e, t, i) {
  return r`
      <umb-property-layout orientation="vertical" label=${e} description=${Zi(i)}>
        <div slot="editor" class="editor">${t}</div>
      </umb-property-layout>
    `;
};
Pi = function(e, t, i = {}) {
  const a = _h(e), s = [];
  for (let o = 0; o <= po; o++) {
    const n = cr(a, o), l = o === 0 ? this.properties : this.linkedProperties[n] ?? [], p = a[o] ?? "";
    if (o > 0) {
      const S = (o === 1 ? this.properties : this.linkedProperties[cr(a, o - 1)] ?? []).some(
        (K) => K.alias === a[o - 1] && K.classification === "content"
      );
      if (!a[o - 1] || !S && !p) break;
    }
    const m = d(this, u, qu).call(this, zf(l, o === 0 ? i.root : i.tail), p, (D) => t([...a.slice(0, o), D].filter(Boolean).join(".")));
    s.push(o === 0 ? m : r`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[n] ?? "Property on the linked item"}</span>
            ${m}
          </div>`);
  }
  return s.length === 1 ? s[0] : r`<div class="path">${s}</div>`;
};
qu = function(e, t, i) {
  return r`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${Th(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
Un = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
Gu = function(e, t, i) {
  const a = this.fonts.find((s) => s.key === e);
  return !a || a.styles.length === 0 ? h : r`
      <umb-property-layout orientation="vertical" label="Named style">

        <div slot="editor" class="editor">
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
      </div>

      </umb-property-layout>
    `;
};
Ze.styles = A`
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

    /* Core's property layout, tightened for a 320px panel: its own padding (--uui-size-layout-1
       above and below) is sized for a full-width workspace, and stacked field after field it read
       as a gap rather than as spacing. The label-to-editor distance stays core's own. */
    umb-property-layout {
      padding: var(--uui-size-space-3) 0;
    }

    umb-property-layout:first-child {
      padding-top: 0;
    }

    /* One hop per line, each full width; every hop after the first sits behind a 2px rule, as
       the relative-position axes do, with room either side of it. */
    .path {
      display: flex;
      flex-direction: column;
      gap: var(--uui-size-space-4);
      min-width: 0;
    }

    .hop {
      display: flex;
      flex-direction: column;
      gap: var(--uui-size-space-2);
      margin-left: var(--uui-size-space-1);
      padding: var(--uui-size-space-1) 0 var(--uui-size-space-1) var(--uui-size-space-4);
      border-left: 2px solid var(--uui-color-border);
      min-width: 0;
    }

    .hop-caption {
      color: var(--uui-color-text-alt);
      font-size: var(--uui-type-small-size, 12px);
      line-height: 1.3;
    }

    .gradient-preview {
      height: 28px;
      margin: var(--uui-size-space-3) 0;
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
    }

    .angle,
    .stops {
      display: flex;
      flex-direction: column;
      gap: var(--uui-size-space-3);
      min-width: 0;
    }

    .stop {
      display: flex;
      flex-direction: column;
      gap: var(--uui-size-space-2);
      padding: var(--uui-size-space-3);
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      min-width: 0;
    }

    .stop-position {
      display: flex;
      align-items: flex-end;
      gap: var(--uui-size-space-2);
      min-width: 0;
    }

    .stop-position di-number-field {
      flex: 1 1 auto;
      min-width: 0;
    }

    .stop-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--uui-size-space-2);
    }

    /* What used to sit side by side - width and height, from and to, a select and its button -
       is one field per line: side by side, the second was clipped at the default panel width. */
    .stack {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .editor {
      min-width: 0;
    }

    .editor > uui-select,
    .editor > uui-input,
    .editor > di-colour-input {
      width: 100%;
    }

    .property-select {
      width: 100%;
      min-width: 0;
    }

    /* One axis reads as a unit: the mode, then whatever that mode needs. */
    .axis {
      border-left: 2px solid var(--uui-color-divider-standalone);
      padding-left: var(--uui-size-space-3);
      margin-bottom: var(--uui-size-space-3);
    }

    .axis umb-property-layout:last-child {
      padding-bottom: 0;
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
Jt([
  f({ type: Object })
], Ze.prototype, "template", 2);
Jt([
  f({ type: Object })
], Ze.prototype, "layer", 2);
Jt([
  f({ type: Array })
], Ze.prototype, "properties", 2);
Jt([
  f({ type: Object })
], Ze.prototype, "linkedProperties", 2);
Jt([
  f({ type: Object })
], Ze.prototype, "linkedCaptions", 2);
Jt([
  f({ type: Array })
], Ze.prototype, "fonts", 2);
Ze = Jt([
  I("di-layer-inspector")
], Ze);
function B(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
const Wf = {
  linear: "Linear",
  radial: "Radial",
  angular: "Angular (conic)",
  diamond: "Diamond",
  reflected: "Reflected"
}, Uf = {
  farthestCorner: "Farthest corner",
  farthestSide: "Farthest side",
  closestCorner: "Closest corner",
  closestSide: "Closest side"
}, Nf = [
  ["↑", 0, "Upwards (0°)"],
  ["→", 90, "To the right (90°)"],
  ["↓", 180, "Downwards (180°)"],
  ["←", 270, "To the left (270°)"]
];
function Yu(e) {
  return B(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
function qo(e) {
  const t = e.shape ?? "rectangle";
  return t === "ellipse" && e.lockAspect === !0 ? "circle" : t;
}
var Bf = Object.defineProperty, jf = Object.getOwnPropertyDescriptor, Hu = (e) => {
  throw TypeError(e);
}, Da = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? jf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Bf(t, i, s), s;
}, Kf = (e, t, i) => t.has(e) || Hu("Cannot " + i), Vf = (e, t, i) => t.has(e) ? Hu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Fe = (e, t, i) => (Kf(e, t, "access private method"), i), ve, Ct, Xu, Ju, Zu, Qu;
const qf = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Gt = class extends P {
  constructor() {
    super(...arguments), Vf(this, ve), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Fe(this, ve, Zu)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : te(
      e,
      (t) => t.key,
      (t, i) => Fe(this, ve, Qu).call(this, t, i)
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
ve = /* @__PURE__ */ new WeakSet();
Ct = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Xu = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Ju = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Zu = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Fe(this, ve, Ct).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Qu = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Fe(this, ve, Xu).call(this, a, e.key)}
        @dragover=${(a) => Fe(this, ve, Ju).call(this, a, t)}
        @click=${() => Fe(this, ve, Ct).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${qf[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Fe(this, ve, Ct).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Fe(this, ve, Ct).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Fe(this, ve, Ct).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Fe(this, ve, Ct).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Gt.styles = A`
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
Da([
  f({ type: Array })
], Gt.prototype, "layers", 2);
Da([
  f({ type: String })
], Gt.prototype, "selectedLayerKey", 2);
Da([
  y()
], Gt.prototype, "_dragKey", 2);
Da([
  y()
], Gt.prototype, "_dropIndex", 2);
Gt = Da([
  I("di-layers-panel")
], Gt);
var Gf = Object.defineProperty, Yf = Object.getOwnPropertyDescriptor, ed = (e) => {
  throw TypeError(e);
}, st = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Yf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gf(t, i, s), s;
}, Nn = (e, t, i) => t.has(e) || ed("Cannot " + i), Hf = (e, t, i) => (Nn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ul = (e, t, i) => t.has(e) ? ed("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Xf = (e, t, i, a) => (Nn(e, t, "write to private field"), t.set(e, i), i), se = (e, t, i) => (Nn(e, t, "access private method"), i), q, Ne, xs, td, id, Ki;
let Oe = class extends P {
  constructor() {
    super(...arguments), ul(this, q), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, ul(this, xs, 100);
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
            @click=${() => se(this, q, Ne).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            compact
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${_s.min * 100}
            .max=${_s.max * 100}
            .value=${se(this, q, td).call(this)}
            @change=${se(this, q, id)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => se(this, q, Ne).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => se(this, q, Ne).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${se(this, q, Ki).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${se(this, q, Ki).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${se(this, q, Ki).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${se(this, q, Ki).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => se(this, q, Ne).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => se(this, q, Ne).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => se(this, q, Ne).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
q = /* @__PURE__ */ new WeakSet();
Ne = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
xs = /* @__PURE__ */ new WeakMap();
td = function() {
  return this.matches(":focus-within") || Xf(this, xs, Math.round(this.effectiveScale * 100)), Hf(this, xs);
};
id = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && se(this, q, Ne).call(this, "di-zoom-change", { zoom: t / 100 });
};
Ki = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => se(this, q, Ne).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
Oe.styles = A`
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
st([
  f({ type: Number })
], Oe.prototype, "effectiveScale", 2);
st([
  f({ type: Boolean })
], Oe.prototype, "snapEnabled", 2);
st([
  f({ type: Boolean })
], Oe.prototype, "showRulers", 2);
st([
  f({ type: Boolean })
], Oe.prototype, "showSafeArea", 2);
st([
  f({ type: Boolean })
], Oe.prototype, "showMeasured", 2);
st([
  f({ type: Boolean })
], Oe.prototype, "canUndo", 2);
st([
  f({ type: Boolean })
], Oe.prototype, "canRedo", 2);
st([
  f({ type: Boolean })
], Oe.prototype, "previewing", 2);
Oe = st([
  I("di-canvas-toolbar")
], Oe);
var Jf = Object.defineProperty, Zf = Object.getOwnPropertyDescriptor, ad = (e) => {
  throw TypeError(e);
}, Bn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Jf(t, i, s), s;
}, jn = (e, t, i) => t.has(e) || ad("Cannot " + i), ri = (e, t, i) => (jn(e, t, "read from private field"), t.get(e)), za = (e, t, i) => t.has(e) ? ad("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Go = (e, t, i, a) => (jn(e, t, "write to private field"), t.set(e, i), i), dl = (e, t, i) => (jn(e, t, "access private method"), i), Ii, Ja, Xi, Za, sd, od;
let ra = class extends P {
  constructor() {
    super(), za(this, Za), za(this, Ii), this._selection = [], za(this, Ja, ""), za(this, Xi), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext($t, (e) => {
      Go(this, Ii, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== ri(this, Ja) && (Go(this, Ja, i), dl(this, Za, sd).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
      }));
    });
  }
  render() {
    return r`
      <umb-property-layout orientation="vertical" label="Preview content" description="Empty = sample data">
        <umb-input-document
          slot="editor"
          max="1"
          .allowedContentTypeIds=${this._allowedContentTypeIds}
          .selection=${this._selection}
          @change=${dl(this, Za, od)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
Ii = /* @__PURE__ */ new WeakMap();
Ja = /* @__PURE__ */ new WeakMap();
Xi = /* @__PURE__ */ new WeakMap();
Za = /* @__PURE__ */ new WeakSet();
sd = async function(e) {
  if (!ri(this, Ii)) return;
  ri(this, Xi) ?? Go(this, Xi, Il(ri(this, Ii).getToken).catch(() => []));
  const t = await ri(this, Xi), i = new Set(e), a = t.filter((s) => i.has(s.alias)).map((s) => s.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
od = function(e) {
  var i;
  const t = e.target.selection;
  (i = ri(this, Ii)) == null || i.setSampleContentKey(t[0]);
};
ra.styles = A`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
Bn([
  y()
], ra.prototype, "_selection", 2);
Bn([
  y()
], ra.prototype, "_allowedContentTypeIds", 2);
ra = Bn([
  I("di-preview-content-picker")
], ra);
var Qf = Object.defineProperty, eg = Object.getOwnPropertyDescriptor, nd = (e) => {
  throw TypeError(e);
}, Ea = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? eg(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Qf(t, i, s), s;
}, Kn = (e, t, i) => t.has(e) || nd("Cannot " + i), H = (e, t, i) => (Kn(e, t, "read from private field"), t.get(e)), kt = (e, t, i) => t.has(e) ? nd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ut = (e, t, i, a) => (Kn(e, t, "write to private field"), t.set(e, i), i), Ke = (e, t, i) => (Kn(e, t, "access private method"), i), ct, di, pi, Nt, ks, Ts, Te, Vn, Qa, qn, Yo;
const tg = 400;
let Yt = class extends P {
  constructor() {
    super(), kt(this, Te), kt(this, ct), kt(this, di), kt(this, pi), kt(this, Nt), kt(this, ks), kt(this, Ts, !0), this._loading = !1, this._collapsed = !1, this.consumeContext($t, (e) => {
      Ut(this, ct, e), e && (this.observe(e.template, (t) => {
        t && Ke(this, Te, Qa).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Ut(this, ks, t);
        const i = (a = H(this, ct)) == null ? void 0 : a.getData();
        i && Ke(this, Te, Qa).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Ut(this, Ts, t ?? !0);
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
    const e = (t = H(this, ct)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(H(this, di)), this._collapsed = !1, Ke(this, Te, qn).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(H(this, di)), (e = H(this, pi)) == null || e.abort(), Ke(this, Te, Vn).call(this);
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
        const t = (e = H(this, ct)) == null ? void 0 : e.getData();
        t && Ke(this, Te, Qa).call(this, t);
      }
    }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed ? h : r`
              <di-preview-content-picker></di-preview-content-picker>
              <div class="body">
                ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : h}
                ${this._error ? r`<span class="error" role="status">${this._error}</span>` : this._url ? r`<img src=${this._url} alt="Server-rendered preview of this template" />` : r`<span class="pending">Rendering…</span>`}
              </div>
            `}
      </div>
    `;
  }
};
ct = /* @__PURE__ */ new WeakMap();
di = /* @__PURE__ */ new WeakMap();
pi = /* @__PURE__ */ new WeakMap();
Nt = /* @__PURE__ */ new WeakMap();
ks = /* @__PURE__ */ new WeakMap();
Ts = /* @__PURE__ */ new WeakMap();
Te = /* @__PURE__ */ new WeakSet();
Vn = function() {
  H(this, Nt) && (URL.revokeObjectURL(H(this, Nt)), Ut(this, Nt, void 0));
};
Qa = function(e) {
  this._collapsed || (window.clearTimeout(H(this, di)), Ut(this, di, window.setTimeout(() => void Ke(this, Te, qn).call(this, e), tg)));
};
qn = async function(e) {
  var t;
  if (H(this, ct)) {
    (t = H(this, pi)) == null || t.abort(), Ut(this, pi, new AbortController()), Ke(this, Te, Yo).call(this, !0), this._error = void 0;
    try {
      const i = await Ol(
        e,
        {
          signal: H(this, pi).signal,
          contentKey: H(this, ks),
          useSampleData: H(this, Ts)
        },
        H(this, ct).getToken
      );
      Ke(this, Te, Vn).call(this), Ut(this, Nt, URL.createObjectURL(i)), this._url = H(this, Nt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ke(this, Te, Yo).call(this, !1);
    }
  }
};
Yo = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Yt.styles = A`
    :host {
      display: block;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .strip {
      padding: var(--uui-size-space-2) var(--uui-size-space-3);
    }

    di-preview-content-picker {
      margin-top: var(--uui-size-space-2);
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
      ${kn}
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
Ea([
  y()
], Yt.prototype, "_url", 2);
Ea([
  y()
], Yt.prototype, "_loading", 2);
Ea([
  y()
], Yt.prototype, "_error", 2);
Ea([
  y()
], Yt.prototype, "_collapsed", 2);
Yt = Ea([
  I("di-preview-strip")
], Yt);
var ig = Object.defineProperty, ag = Object.getOwnPropertyDescriptor, rd = (e) => {
  throw TypeError(e);
}, j = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ag(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ig(t, i, s), s;
}, Gn = (e, t, i) => t.has(e) || rd("Cannot " + i), x = (e, t, i) => (Gn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ii = (e, t, i) => t.has(e) ? rd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ss = (e, t, i, a) => (Gn(e, t, "write to private field"), t.set(e, i), i), xe = (e, t, i) => (Gn(e, t, "access private method"), i), C, la, ca, hi, N, Ho, Yn, ld, cd, Xo, ud, dd, pd, Jo, hd, md, yd, es;
const sg = 400;
let L = class extends P {
  constructor() {
    super(), ii(this, N), ii(this, C), ii(this, la), ii(this, ca), ii(this, hi), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, ii(this, es, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = x(this, C);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = x(this, N, Ho);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), xe(this, N, Xo).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, p = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, m = ze(s.position, "x") ? 0 : l, D = ze(s.position, "y") ? 0 : p;
            if (m === 0 && D === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + m, y: s.position.y + D }
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
    }), this.consumeContext(Z, (e) => {
      Ss(this, la, e);
    }), this.consumeContext($t, (e) => {
      Ss(this, C, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (xe(this, N, ud).call(this, t), xe(this, N, dd).call(this, t), xe(this, N, pd).call(this));
      }), this.observe(e.selectedLayerKey, (t) => {
        this._selectedKey = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }), this.observe(e.linkedCaptions, (t) => {
        this._linkedCaptions = t ?? {};
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
    super.connectedCallback(), window.addEventListener("keydown", x(this, es));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", x(this, es)), window.clearTimeout(x(this, ca)), (e = x(this, hi)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = x(this, C)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = x(this, C)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = x(this, C)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => xe(this, N, Xo).call(this, e.detail.key)}
        @di-layer-detach=${(e) => xe(this, N, cd).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = x(this, C)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = x(this, C)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = x(this, C)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = x(this, C)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = x(this, C)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = x(this, C)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => xe(this, N, Jo).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => xe(this, N, Jo).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-use-image-size=${xe(this, N, yd)}
        @di-request-preview=${() => {
      var e;
      return (e = x(this, N, ld)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(_s.min, Math.min(_s.max, e.detail.zoom));
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
      return (e = x(this, C)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = x(this, C)) == null ? void 0 : e.redo();
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
            .layer=${x(this, N, Ho)}
            .properties=${this._properties}
            .linkedProperties=${this._linkedProperties}
            .linkedCaptions=${this._linkedCaptions}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    ` : r`<div class="state"><uui-loader></uui-loader></div>`;
  }
};
C = /* @__PURE__ */ new WeakMap();
la = /* @__PURE__ */ new WeakMap();
ca = /* @__PURE__ */ new WeakMap();
hi = /* @__PURE__ */ new WeakMap();
N = /* @__PURE__ */ new WeakSet();
Ho = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
Yn = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
ld = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
cd = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = x(this, N, Yn)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = x(this, C)) == null || n.updateLayer(e, { position: uo(i.position, t, a) });
};
Xo = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = x(this, N, Yn)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = x(this, C)) == null || s.removeLayer(e, t);
};
ud = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && x(this, C) && await ay(t, x(this, C).getToken);
};
dd = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !x(this, C)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Pl(t.mediaKey, x(this, C).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
pd = function() {
  window.clearTimeout(x(this, ca)), Ss(this, ca, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !x(this, C))) {
      (t = x(this, hi)) == null || t.abort(), Ss(this, hi, new AbortController());
      try {
        const i = await Al(
          e,
          { signal: x(this, hi).signal, useSampleData: !0 },
          x(this, C).getToken
        );
        x(this, C).setServerBounds(i.layers), x(this, C).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, sg));
};
Jo = function(e, t, i, a) {
  const s = this._template;
  if (!s || !x(this, C)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: xe(this, N, md).call(this) };
  if (e.kind === "property") {
    const l = lh(e.property, o);
    if (l.kind === "condition") {
      xe(this, N, hd).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    x(this, C).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? Ll(o, "Image") : e.layerType === "badges" ? zl(o, "Badges", "") : e.layerType === "rect" ? nh(o, "Shape", e.preset) : Ml(o, "Text", { kind: "static", text: "Text" });
  x(this, C).addLayer(n);
};
hd = function(e, t, i) {
  var o, n, l, p;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((m) => m.key === a);
  if (!s) {
    (n = x(this, la)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = x(this, C)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (p = x(this, la)) == null || p.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
md = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
yd = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !x(this, C)) return;
  const t = await Pl(e.mediaKey, x(this, C).getToken).catch(() => {
  });
  t && x(this, C).updateCanvas({ width: t.width, height: t.height });
};
es = /* @__PURE__ */ new WeakMap();
L.styles = A`
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
j([
  y()
], L.prototype, "_template", 2);
j([
  y()
], L.prototype, "_selectedKey", 2);
j([
  y()
], L.prototype, "_properties", 2);
j([
  y()
], L.prototype, "_linkedProperties", 2);
j([
  y()
], L.prototype, "_linkedCaptions", 2);
j([
  y()
], L.prototype, "_fonts", 2);
j([
  y()
], L.prototype, "_serverBounds", 2);
j([
  y()
], L.prototype, "_baseImageUrl", 2);
j([
  y()
], L.prototype, "_zoom", 2);
j([
  y()
], L.prototype, "_effectiveScale", 2);
j([
  y()
], L.prototype, "_previewing", 2);
j([
  y()
], L.prototype, "_snapEnabled", 2);
j([
  y()
], L.prototype, "_showRulers", 2);
j([
  y()
], L.prototype, "_showSafeArea", 2);
j([
  y()
], L.prototype, "_showMeasured", 2);
j([
  y()
], L.prototype, "_canUndo", 2);
j([
  y()
], L.prototype, "_canRedo", 2);
L = j([
  I("di-design-view")
], L);
const og = L, ng = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return L;
  },
  default: og
}, Symbol.toStringTag, { value: "Module" }));
var rg = Object.defineProperty, lg = Object.getOwnPropertyDescriptor, fd = (e) => {
  throw TypeError(e);
}, ot = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? lg(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && rg(t, i, s), s;
}, Hn = (e, t, i) => t.has(e) || fd("Cannot " + i), Q = (e, t, i) => (Hn(e, t, "read from private field"), t.get(e)), Li = (e, t, i) => t.has(e) ? fd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ua = (e, t, i, a) => (Hn(e, t, "write to private field"), t.set(e, i), i), rt = (e, t, i) => (Hn(e, t, "access private method"), i), Le, da, mi, Bt, Pe, Xn, ts, gd, vd, bd;
let he = class extends P {
  constructor() {
    super(), Li(this, Pe), Li(this, Le), Li(this, da), Li(this, mi), Li(this, Bt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Z, (e) => {
      ua(this, da, e);
    }), this.consumeContext($t, (e) => {
      ua(this, Le, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, rt(this, Pe, ts).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), rt(this, Pe, ts).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Q(this, mi)) == null || e.abort(), rt(this, Pe, Xn).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => rt(this, Pe, ts).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${rt(this, Pe, vd)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : h}
          ${this._error ? r`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? r`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : h}
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._template.layers.length === 0 ? r`<p class="empty">This template has no layers yet.</p>` : r`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${te(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => rt(this, Pe, bd).call(this, e)
    )}
              </uui-table>`}
        </uui-box>

        ${this._contentKey ? r`<uui-box headline="This page">
              <p>
                Regenerating writes a new image into
                <code>${this._template.targetPropertyAlias || "the target property"}</code> on the page
                chosen above, replacing the existing media file in place.
              </p>
              <uui-button
                look="primary"
                color="positive"
                label="Regenerate the image for this page"
                ?disabled=${this._regenerating}
                @click=${rt(this, Pe, gd)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : h}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
Le = /* @__PURE__ */ new WeakMap();
da = /* @__PURE__ */ new WeakMap();
mi = /* @__PURE__ */ new WeakMap();
Bt = /* @__PURE__ */ new WeakMap();
Pe = /* @__PURE__ */ new WeakSet();
Xn = function() {
  Q(this, Bt) && (URL.revokeObjectURL(Q(this, Bt)), ua(this, Bt, void 0));
};
ts = async function() {
  var i;
  const e = this._template;
  if (!e || !Q(this, Le)) return;
  (i = Q(this, mi)) == null || i.abort(), ua(this, mi, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: Q(this, mi).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, s] = await Promise.all([
      Ol(e, t, Q(this, Le).getToken),
      Al(e, t, Q(this, Le).getToken)
    ]);
    rt(this, Pe, Xn).call(this), ua(this, Bt, URL.createObjectURL(a)), this._url = Q(this, Bt), this._bounds = s.layers, this._skipped = s.skipped ?? [], Q(this, Le).setServerBounds(s.layers), Q(this, Le).setIssues(s.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
gd = async function() {
  var e, t;
  if (!(!this._contentKey || !Q(this, Le))) {
    this._regenerating = !0;
    try {
      const i = await an(this._contentKey, Q(this, Le).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = Q(this, da)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = Q(this, da)) == null || t.peek("danger", {
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
vd = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
bd = function(e) {
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
          ${t.truncated ? r`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : h}
        </uui-table-cell>
        <uui-table-cell>${Math.round(t.x)}, ${Math.round(t.y)}</uui-table-cell>
        <uui-table-cell>${Math.round(t.width)} × ${Math.round(t.height)}</uui-table-cell>
      </uui-table-row>
    `;
};
he.styles = A`
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
      ${kn}
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
ot([
  y()
], he.prototype, "_template", 2);
ot([
  y()
], he.prototype, "_contentKey", 2);
ot([
  y()
], he.prototype, "_bounds", 2);
ot([
  y()
], he.prototype, "_skipped", 2);
ot([
  y()
], he.prototype, "_url", 2);
ot([
  y()
], he.prototype, "_loading", 2);
ot([
  y()
], he.prototype, "_error", 2);
ot([
  y()
], he.prototype, "_regenerating", 2);
he = ot([
  I("di-preview-view")
], he);
const cg = he, ug = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return he;
  },
  default: cg
}, Symbol.toStringTag, { value: "Module" }));
var dg = Object.defineProperty, pg = Object.getOwnPropertyDescriptor, _d = (e) => {
  throw TypeError(e);
}, Ca = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? pg(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && dg(t, i, s), s;
}, Jn = (e, t, i) => t.has(e) || _d("Cannot " + i), X = (e, t, i) => (Jn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), pl = (e, t, i) => t.has(e) ? _d("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hg = (e, t, i, a) => (Jn(e, t, "write to private field"), t.set(e, i), i), li = (e, t, i) => (Jn(e, t, "access private method"), i), ne, de, wd, $d, Ds, xd, kd, Td, Sd, Dd, Ed;
let Qe = class extends P {
  constructor() {
    super(), pl(this, de), pl(this, ne), this._properties = [], this._showAdvanced = !1, this.consumeContext($t, (e) => {
      hg(this, ne, e), e && (Il(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${li(this, de, Td).call(this)} ${li(this, de, Sd).call(this)} ${li(this, de, Dd).call(this)} ${li(this, de, Ed).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
ne = /* @__PURE__ */ new WeakMap();
de = /* @__PURE__ */ new WeakSet();
wd = function() {
  return this._properties.filter((e) => e.classification === "media");
};
$d = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
Ds = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
xd = async function(e) {
  var s, o;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((n) => [n.key, n.alias])), a = [
    ...t.map((n) => i.get(n)).filter((n) => !!n),
    ...X(this, de, Ds)
  ].filter((n, l, p) => p.indexOf(n) === l);
  (s = X(this, ne)) == null || s.updateTemplateFields({ docTypeAliases: a }), await ((o = X(this, ne)) == null ? void 0 : o.reloadProperties());
};
kd = function(e) {
  var i;
  const t = e.target.selection;
  (i = X(this, ne)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
Td = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? r`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${X(this, de, $d)}
                  @change=${li(this, de, xd)}></umb-input-document-type>` : r`<uui-loader-bar></uui-loader-bar>`}
            ${X(this, de, Ds).length > 0 ? r`<p class="note">
                  Also targets ${X(this, de, Ds).join(", ")}, which no document type has any more.
                </p>` : h}
          </div>
        </umb-property-layout>

        <umb-property-layout
          label="Target property"
          description="The media picker the generated image is written to.">
          <uui-select
            slot="editor"
            class="full"
            label="Target property"
            .value=${e.targetPropertyAlias}
            .options=${[
    { name: "- none -", value: "" },
    ...X(this, de, wd).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = X(this, ne)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = X(this, ne)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Sd = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout
          label="Media folder"
          description="Where generated images are saved. Empty = the media root.">
          <umb-input-media
            slot="editor"
            max="1"
            folder-filter="foldersOnly"
            .selection=${e.output.mediaFolderKey ? [e.output.mediaFolderKey] : []}
            @change=${li(this, de, kd)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = X(this, ne)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = X(this, ne)) == null ? void 0 : i.updateOutput({
      format: t.target.value
    });
  }}>
          </uui-select>
        </umb-property-layout>

        ${e.output.format === "png" ? h : r`<umb-property-layout label="Quality" description="1-100. Ignored for PNG.">
              <uui-input
                slot="editor"
                type="number"
                min="1"
                max="100"
                .value=${String(e.output.quality)}
                @change=${(t) => {
    var i;
    return (i = X(this, ne)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
Dd = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = X(this, ne)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = X(this, ne)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Ed = function() {
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
    return (i = X(this, ne)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
            ${this._showAdvanced ? r`<pre class="json">${JSON.stringify(e, null, 2)}</pre>` : h}
          </div>
        </umb-property-layout>
      </uui-box>
    `;
};
Qe.styles = A`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
    }

    .grid {
      display: grid;
      gap: var(--uui-size-layout-1);
      max-width: 1100px;
    }

    uui-select.full {
      width: 100%;
    }

    .note {
      margin: var(--uui-size-space-3) 0 0;
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
Ca([
  y()
], Qe.prototype, "_template", 2);
Ca([
  y()
], Qe.prototype, "_properties", 2);
Ca([
  y()
], Qe.prototype, "_showAdvanced", 2);
Ca([
  y()
], Qe.prototype, "_documentTypes", 2);
Qe = Ca([
  I("di-settings-view")
], Qe);
const mg = Qe, yg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return Qe;
  },
  default: mg
}, Symbol.toStringTag, { value: "Module" }));
var fg = Object.defineProperty, gg = Object.getOwnPropertyDescriptor, Cd = (e) => {
  throw TypeError(e);
}, Ia = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gg(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && fg(t, i, s), s;
}, Zn = (e, t, i) => t.has(e) || Cd("Cannot " + i), hl = (e, t, i) => (Zn(e, t, "read from private field"), t.get(e)), ml = (e, t, i) => t.has(e) ? Cd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), vg = (e, t, i, a) => (Zn(e, t, "write to private field"), t.set(e, i), i), yl = (e, t, i) => (Zn(e, t, "access private method"), i), pa, is, Zo;
let et = class extends P {
  constructor() {
    super(), ml(this, is), ml(this, pa), this._loading = !0, this._onlyMissing = !1, this.consumeContext($t, (e) => {
      vg(this, pa, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && yl(this, is, Zo).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => yl(this, is, Zo).call(this)}>Reload</uui-button>
        </div>

        <p class="summary">
          <strong>${this._usage.withImageOnPage}</strong> of the
          <strong>${this._usage.items.length}</strong> shown have an image.
          ${this._usage.total > this._usage.items.length ? r`<span class="muted">${this._usage.total} in total.</span>` : h}
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
              ${te(
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
pa = /* @__PURE__ */ new WeakMap();
is = /* @__PURE__ */ new WeakSet();
Zo = async function() {
  const e = this._template;
  if (!(!e || !hl(this, pa))) {
    this._loading = !0;
    try {
      this._usage = await Qp(e.key, hl(this, pa).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
et.styles = A`
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
Ia([
  y()
], et.prototype, "_template", 2);
Ia([
  y()
], et.prototype, "_usage", 2);
Ia([
  y()
], et.prototype, "_loading", 2);
Ia([
  y()
], et.prototype, "_onlyMissing", 2);
et = Ia([
  I("di-usage-view")
], et);
const bg = et, _g = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return et;
  },
  default: bg
}, Symbol.toStringTag, { value: "Module" })), wg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ji,
  default: Ji
}, Symbol.toStringTag, { value: "Module" }));
var yt, zt;
class ao extends Yd {
  constructor(i, a) {
    super(i, a);
    k(this, yt);
    k(this, zt);
    this.consumeContext(Z, (s) => {
      _(this, yt, s);
    }), this.consumeContext($t, (s) => {
      _(this, zt, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, zt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, yt)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await $l(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await Fl(a.key, !1, i.getToken);
        (o = c(this, yt)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await mc(l, i.getToken, c(this, yt));
      } catch (l) {
        (n = c(this, yt)) == null || n.peek("danger", {
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
    c(this, zt) && await Zp(i, c(this, zt).getToken);
  }
}
yt = new WeakMap(), zt = new WeakMap();
const $g = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: ao,
  api: ao,
  default: ao
}, Symbol.toStringTag, { value: "Module" }));
var fa, Ti;
class so extends wa {
  constructor(i, a) {
    super(i, a);
    k(this, fa);
    k(this, Ti);
    this.consumeContext(Ae, (s) => {
      _(this, fa, s);
    }), this.consumeContext(Z, (s) => {
      _(this, Ti, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await an(i, () => {
          var l;
          return (l = c(this, fa)) == null ? void 0 : l.getLatestToken();
        }), n = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = c(this, Ti)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof jt && o.status === 404;
        (s = c(this, Ti)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof jt ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
fa = new WeakMap(), Ti = new WeakMap();
const xg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: so,
  api: so,
  default: so
}, Symbol.toStringTag, { value: "Module" }));
var ga, Wt, va, Si;
class oo extends ap {
  constructor(i, a) {
    super(i, a);
    k(this, ga);
    k(this, Wt);
    k(this, va);
    k(this, Si);
    this.consumeContext(Ae, (s) => {
      _(this, ga, s);
    }), this.consumeContext(Z, (s) => {
      _(this, Wt, s);
    }), this.consumeContext(sp, (s) => {
      _(this, va, s);
    }), this.consumeContext(op, (s) => {
      _(this, Si, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, Si)) {
      (i = c(this, Wt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await an(c(this, Si), () => {
        var l;
        return (l = c(this, ga)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, va)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, Wt)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof jt && n.status === 404;
      (o = c(this, Wt)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof jt ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
ga = new WeakMap(), Wt = new WeakMap(), va = new WeakMap(), Si = new WeakMap();
const kg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: oo,
  api: oo,
  default: oo
}, Symbol.toStringTag, { value: "Module" }));
var Tg = Object.defineProperty, Sg = Object.getOwnPropertyDescriptor, Id = (e) => {
  throw TypeError(e);
}, nt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Sg(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Tg(t, i, s), s;
}, Qn = (e, t, i) => t.has(e) || Id("Cannot " + i), Ge = (e, t, i) => (Qn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), no = (e, t, i) => t.has(e) ? Id("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Dg = (e, t, i, a) => (Qn(e, t, "write to private field"), t.set(e, i), i), oe = (e, t, i) => (Qn(e, t, "access private method"), i), as, Oa, z, Us, ss, Od, Ad, Pd, er, Fd, Rd, Md, Ld, zd, Wd, Ud, Nd;
const Eg = [100, 200, 300, 400, 500, 600, 700, 800, 900], Cg = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let me = class extends kl {
  constructor() {
    super(), no(this, z), no(this, as), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", no(this, Oa, () => {
      var e;
      return (e = Ge(this, as)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ae, (e) => {
      Dg(this, as, e);
    });
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this.data) != null && e.familyName && (this._family = this.data.familyName);
  }
  render() {
    var t;
    const e = !((t = this.data) != null && t.mode);
    return r`
      <umb-body-layout headline=${oe(this, z, Md).call(this)}>
        ${oe(this, z, ss).call(this, "upload") ? oe(this, z, Ld).call(this, e) : h}
        ${oe(this, z, ss).call(this, "path") ? oe(this, z, zd).call(this, e) : h}
        ${oe(this, z, ss).call(this, "web") ? oe(this, z, Wd).call(this, e) : h}

        ${this._error ? r`<p class="error" role="alert">${this._error}</p>` : h}
        ${this._busy ? r`<uui-loader-bar></uui-loader-bar>` : h}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
as = /* @__PURE__ */ new WeakMap();
Oa = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakSet();
Us = function() {
  var e, t;
  return { familyKey: ((e = this.data) == null ? void 0 : e.familyKey) ?? null, parentKey: ((t = this.data) == null ? void 0 : t.parentKey) ?? null };
};
ss = function(e) {
  var t;
  return !((t = this.data) != null && t.mode) || this.data.mode === e;
};
Od = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  oe(this, z, Ad).call(this, t);
};
Ad = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await Op(t, Ge(this, Oa), Ge(this, z, Us));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Pd = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await Ap(this._path.trim(), Ge(this, Oa), Ge(this, z, Us)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
er = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
Fd = async function() {
  if (Ge(this, z, er)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await Pp(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        Ge(this, Oa),
        Ge(this, z, Us)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
Rd = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Md = function() {
  var t, i, a;
  const e = (t = this.data) != null && t.familyName ? ` to ${this.data.familyName}` : "";
  switch ((i = this.data) == null ? void 0 : i.mode) {
    case "upload":
      return `Upload a font file${e}`;
    case "web":
      return `Add a web font${e}`;
    case "path":
      return `Register a font in wwwroot${e}`;
    default:
      return (a = this.data) != null && a.familyName ? `Add a variant to ${this.data.familyName}` : "Add a font";
  }
};
Ld = function(e) {
  return r`
        <uui-box headline=${e ? "Upload a file" : "File"}>
          <!-- uui-file-dropzone rather than a raw <input type="file">: the native
               "Choose files | No file chosen" control looked out of place beside the uui-styled
               inputs in the same dialog. It is what umb-input-dropzone is built on in core, so
               this borrows the control without core's media upload manager. -->
          <uui-file-dropzone
            accept=".ttf,.otf,.woff2,.woff"
            multiple
            label="Drop font files here, or click to browse"
            ?disabled=${this._busy}
            @change=${oe(this, z, Od)}>
          </uui-file-dropzone>
          <p class="hint">
            .ttf, .otf, .woff2 or .woff. The family name and weight are read from the file. Uploads are stored in the
            media library, so they work on Umbraco Cloud and transfer with Deploy.
          </p>
        </uui-box>
    `;
};
zd = function(e) {
  return r`
        <uui-box headline=${e ? "Or register a path in wwwroot" : "Path in wwwroot"}>
          <uui-input
            label="Path"
            placeholder="/assets/fonts/Inter-Regular.ttf"
            .value=${this._path}
            ?disabled=${this._busy}
            @input=${(t) => {
    this._path = t.target.value;
  }}>
          </uui-input>
          <uui-button
            look="secondary"
            label="Register this path"
            ?disabled=${this._busy || !this._path.trim()}
            @click=${oe(this, z, Pd)}>
            Register
          </uui-button>
        </uui-box>
    `;
};
Wd = function(e) {
  return r`
        <uui-box headline=${e ? "Or use a web font" : "Web font"}>
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Cg.map((t) => ({
    name: t.name,
    value: t.value,
    selected: t.value === this._provider
  }))}
            ?disabled=${this._busy}
            @change=${(t) => {
    this._provider = t.target.value;
  }}>
          </uui-select>

          ${this._provider === "direct" ? oe(this, z, Nd).call(this) : oe(this, z, Ud).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !Ge(this, z, er)}
            @click=${oe(this, z, Fd)}>
            Add web font
          </uui-button>
        </uui-box>
    `;
};
Ud = function() {
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
        ${te(
    Eg,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => oe(this, z, Rd).call(this, e, t.target.checked)}>
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
        ${this._provider === "bunny" ? r`<br />Bunny Fonts serve the Latin subset only, so accented Latin renders but other scripts do not.` : h}
      </p>
    `;
};
Nd = function() {
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
me.styles = A`
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
nt([
  y()
], me.prototype, "_busy", 2);
nt([
  y()
], me.prototype, "_error", 2);
nt([
  y()
], me.prototype, "_path", 2);
nt([
  y()
], me.prototype, "_provider", 2);
nt([
  y()
], me.prototype, "_family", 2);
nt([
  y()
], me.prototype, "_weights", 2);
nt([
  y()
], me.prototype, "_italic", 2);
nt([
  y()
], me.prototype, "_url", 2);
me = nt([
  I("di-font-upload-modal")
], me);
const Ig = me, Og = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return me;
  },
  default: Ig
}, Symbol.toStringTag, { value: "Module" }));
var Ag = Object.getOwnPropertyDescriptor, Pg = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ag(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = n(s) || s);
  return s;
};
let Es = class extends P {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Es = Pg([
  I("di-template-folder-editor")
], Es);
const Fg = Es, Bd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Es;
  },
  default: Fg
}, Symbol.toStringTag, { value: "Module" }));
var Rg = Object.getOwnPropertyDescriptor, Mg = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rg(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = n(s) || s);
  return s;
};
let ha = class extends P {
  render() {
    return r`<umb-workspace-editor>
      <umb-icon id="icon" slot="header" name="icon-font"></umb-icon>
      <umb-workspace-header-name-editable slot="header"></umb-workspace-header-name-editable>
    </umb-workspace-editor>`;
  }
};
ha.styles = [
  np,
  A`
      #icon {
        display: inline-block;
        font-size: var(--uui-size-6);
        margin-right: var(--uui-size-space-4);
      }
    `
];
ha = Mg([
  I("di-font-family-editor")
], ha);
const Lg = ha, zg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontFamilyEditorElement() {
    return ha;
  },
  default: Lg
}, Symbol.toStringTag, { value: "Module" }));
var Wg = Object.defineProperty, Ug = Object.getOwnPropertyDescriptor, jd = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ug(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wg(t, i, s), s;
};
let ma = class extends P {
  constructor() {
    super(), this._headline = "", this.consumeContext(vn, (e) => {
      this.observe(e == null ? void 0 : e.current, (t) => {
        this._headline = t ? `${t.font.familyName} · ${t.name}` : "";
      });
    });
  }
  render() {
    return r`<umb-workspace-editor headline=${this._headline}></umb-workspace-editor>`;
  }
};
jd([
  y()
], ma.prototype, "_headline", 2);
ma = jd([
  I("di-font-editor")
], ma);
const Ng = ma, Bg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontEditorElement() {
    return ma;
  },
  default: Ng
}, Symbol.toStringTag, { value: "Module" }));
export {
  cm as manifests,
  gv as onInit
};
//# sourceMappingURL=dynamic-images.js.map
