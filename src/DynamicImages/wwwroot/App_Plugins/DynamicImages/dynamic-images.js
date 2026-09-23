var qn = (e) => {
  throw TypeError(e);
};
var As = (e, t, i) => t.has(e) || qn("Cannot " + i);
var d = (e, t, i) => (As(e, t, "read from private field"), i ? i.call(e) : t.get(e)), k = (e, t, i) => t.has(e) ? qn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (As(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), D = (e, t, i) => (As(e, t, "access private method"), i);
var Ps = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return d(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as Dd, UmbEntityWorkspaceDataManager as Cd, UmbSubmitWorkspaceAction as Qa, UmbEntityNamedDetailWorkspaceContextBase as Qr, UmbWorkspaceActionBase as Id } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as fa, UmbContextConsumerController as Od } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as Ko, UmbItemRepositoryBase as Ad, UmbItemServerDataSourceBase as Pd, UmbRepositoryBase as Si } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as jo, UmbItemStoreBase as Rd } from "@umbraco-cms/backoffice/store";
import { UmbId as el } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as Md, UMB_DATE_TIME_VALUE_TYPE as Fd } from "@umbraco-cms/backoffice/value-type";
import { nothing as h, html as r, css as O, state as y, customElement as A, ifDefined as Yi, property as f, repeat as te, classMap as tl, styleMap as B } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as F } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as il, UmbTreeRepositoryBase as al } from "@umbraco-cms/backoffice/tree";
import { UMB_ACTION_EVENT_CONTEXT as qt } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent as Ei, UmbRequestReloadStructureForEntityEvent as sl, UmbEntityActionBase as ga } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT as Y } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as ol } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UMB_AUTH_CONTEXT as Ae } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as Vo, UMB_DISCARD_CHANGES_MODAL as Ld, umbConfirmModal as qo, UmbModalToken as nl, UmbModalBaseElement as rl, UMB_MODAL_MANAGER_CONTEXT as zd } from "@umbraco-cms/backoffice/modal";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as ll } from "@umbraco-cms/backoffice/entity";
import { UmbDefaultCollectionContext as cl } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as ul, UmbDeselectedEvent as dl } from "@umbraco-cms/backoffice/event";
import { tryExecute as Ud } from "@umbraco-cms/backoffice/resources";
import "@umbraco-cms/backoffice/document-type";
import "@umbraco-cms/backoffice/media";
import { UmbArrayState as Oi, UmbStringState as Gn, UmbObjectState as Yn, UmbBooleanState as Ea, UmbNumberState as Wd } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as Nd } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Bd } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Kd } from "@umbraco-cms/backoffice/document";
const _s = "dynamic-images", ws = "di-template", Qs = "di:templates-changed", jd = "/umbraco/management/api/v1/dynamic-images";
class bt extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function v(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${jd}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await Vd(n);
  return n;
}
async function Vd(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new bt(t, e.status, i);
}
const x = async (e) => e.json();
async function qd(e) {
  const t = await v("/templates?take=500", e);
  return (await x(t)).items;
}
const Go = async (e, t) => x(await v(`/templates/${e}`, t)), Gd = async (e, t) => x(await v("/templates", t, { method: "POST", json: e })), Yd = async (e, t) => x(await v(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Hd(e, t) {
  await v(`/templates/${e}`, t, { method: "DELETE" });
}
const Xd = async (e, t, i) => x(await v(`/templates/${e}/duplicate`, i, { method: "POST", json: { targetKey: t } })), Jd = async (e, t, i) => x(await v(`/templates/${e}/enabled`, i, { method: "PUT", json: { isEnabled: t } }));
async function Zd(e, t) {
  return (await v(`/templates/${e}/export`, t)).blob();
}
const Qd = async (e, t, i, a = null) => x(await v("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function $s(e, t, i, a) {
  const s = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && s.set("foldersOnly", "true"), a && s.set("parentKey", a), s.toString();
}
const Hn = async (e, t, i, a) => x(await v(`/tree/root?${$s(e, t, i)}`, a)), ep = async (e, t, i, a, s) => x(await v(`/tree/children?${$s(t, i, a, e)}`, s)), tp = async (e, t) => x(await v(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function xs(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return x(await v(`/item?${i}`, t));
}
async function ip(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), x(await v(`/collection/templates?${i}`, t));
}
async function ap(e, t, i) {
  return (await v(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const sp = async (e, t) => x(await v("/folders", t, { method: "POST", json: e })), op = async (e, t) => x(await v(`/folders/${e}`, t)), np = async (e, t, i) => x(await v(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function pl(e, t) {
  await v(`/folders/${e}`, t, { method: "DELETE" });
}
async function rp(e, t, i) {
  await v(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function lp(e, t, i) {
  await v(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function cp(e, t, i) {
  await v("/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const up = async (e, t, i) => x(await v("/templates/bulk-duplicate", i, { method: "POST", json: { keys: e, targetKey: t } }));
async function dp(e, t, i) {
  await v("/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
const es = async (e) => x(await v("/fonts", e));
async function pp(e, t, i = {}) {
  const a = new FormData();
  return a.append("file", e), i.familyKey && a.append("familyKey", i.familyKey), i.parentKey && a.append("parentKey", i.parentKey), x(await v("/fonts", t, { method: "POST", body: a }));
}
const hp = async (e, t, i = {}) => x(await v("/fonts/register-path", t, { method: "POST", json: { path: e, ...i } })), mp = async (e, t, i = {}) => x(await v("/fonts/register-web", t, { method: "POST", json: { ...e, ...i } })), yp = async (e, t) => x(await v(`/fonts/${e}/refresh`, t, { method: "POST" })), fp = async (e, t, i, a, s) => x(await v(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function gp(e, t) {
  await v(`/fonts/${e}`, t, { method: "DELETE" });
}
async function vp(e, t) {
  return (await v(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Xn = async (e, t, i, a) => x(await v(`/fonts/tree/root?${$s(e, t, i)}`, a)), bp = async (e, t, i, a, s) => x(await v(`/fonts/tree/children?${$s(t, i, a, e)}`, s)), _p = async (e, t) => x(await v(`/fonts/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function wp(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return x(await v(`/fonts/item?${i}`, t));
}
async function $p(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), x(await v(`/fonts/collection?${i}`, t));
}
const xp = async (e, t) => x(await v("/fonts/folders", t, { method: "POST", json: e })), kp = async (e, t) => x(await v(`/fonts/folders/${e}`, t)), Tp = async (e, t, i) => x(await v(`/fonts/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function Sp(e, t) {
  await v(`/fonts/folders/${e}`, t, { method: "DELETE" });
}
const hl = async (e) => x(await v("/document-types", e)), Ep = async (e, t) => x(await v(`/document-types/${encodeURIComponent(e)}/properties`, t)), Dp = async (e, t, i) => x(await v(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function ml(e, t, i) {
  return (await v("/preview", i, {
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
const yl = async (e, t, i) => x(await v("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), fl = async (e, t) => x(await v(`/media/${e}/image-info`, t)), Yo = async (e, t) => x(await v(`/documents/${e}/regenerate`, t, { method: "POST" })), gl = async (e, t, i) => x(await v(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), Cp = async (e, t) => x(await v(`/jobs/${e}`, t));
async function Ip(e, t) {
  await v(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const Op = async (e, t) => x(await v(`/templates/${e}/usage`, t)), vl = async (e) => x(await v("/health", e)), Ap = async (e) => x(await v("/sync/status", e)), Pp = async (e) => x(await v("/sync/export", e, { method: "POST" })), Rp = async (e) => x(await v("/sync/import", e, { method: "POST" }));
function Ho(e) {
  const t = `section/${_s}/workspace/${ws}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Mp(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${_s}/workspace/${ws}/create${t}`, document.baseURI).pathname;
}
function Xo(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${_s}/workspace/${e}${i}`, document.baseURI).pathname;
}
function Fp(e) {
  return new URL(`section/${_s}/dashboard/${e}`, document.baseURI).pathname;
}
function Jo() {
  window.dispatchEvent(new CustomEvent(Qs));
}
const ks = () => crypto.randomUUID();
function Ts(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function bl(e, t, i) {
  const { x: a, y: s } = Ts(e);
  return {
    type: "text",
    key: ks(),
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
function _l(e, t, i) {
  const { x: a, y: s } = Ts(e);
  return {
    type: "image",
    key: ks(),
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
function wl(e, t, i) {
  const { x: a, y: s } = Ts(e);
  return {
    type: "badges",
    key: ks(),
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
const Hi = {
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
}, Lp = Object.keys(Hi);
function zp(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = Ts(e), o = Hi[i] ?? Hi.rectangle;
  return {
    type: "rect",
    key: ks(),
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
function Up(e) {
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
function Wp(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (Up(e.classification)) {
    case "image":
      return { kind: "layer", layer: _l(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: wl(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: bl(t, e.name, Np(e)) };
  }
}
function Np(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function $l() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function Bp(e) {
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
const xl = [
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
function Xi(e) {
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
function Ji(e) {
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
function eo(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return xl[a * 3 + i];
}
function Ss(e, t, i) {
  return {
    x: e.x - t * Xi(e.anchor),
    y: e.y - i * Ji(e.anchor)
  };
}
function Zo(e, t, i, a, s) {
  return {
    x: e + i * Xi(s),
    y: t + a * Ji(s)
  };
}
function Kp(e, t, i, a) {
  const s = Ss(e, t, i), o = Zo(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function jp(e, t) {
  const i = Zo(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function kl(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function ti(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), p = e - i, m = t - a;
  return { x: i + p * n - m * l, y: a + p * l + m * n };
}
function Vp(e, t, i, a, s) {
  return ti(e, t, i, a, -s);
}
function Tl(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    ti(e.x, e.y, t, i, a),
    ti(e.x + e.width, e.y, t, i, a),
    ti(e.x + e.width, e.y + e.height, t, i, a),
    ti(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((m) => m.x)), n = Math.max(...s.map((m) => m.x)), l = Math.min(...s.map((m) => m.y)), p = Math.max(...s.map((m) => m.y));
  return { x: o, y: l, width: n - o, height: p - l };
}
const qp = 10;
function Ue(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Sl(e) {
  return !!e.relativeX || !!e.relativeY;
}
function ts(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Jn(e) {
  return e === "below" || e === "above";
}
function Zn(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Gp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Yp(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = Zn(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...Zn(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Hp(e, t, i) {
  const a = e.position;
  if (!Sl(a)) return a;
  if (Yp(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Xi(a.anchor), l = Ji(a.anchor);
  const p = Qn(e, a.relativeX, !1, t, i);
  p && (s = p.coordinate, n = p.factor);
  const m = Qn(e, a.relativeY, !0, t, i);
  return m && (o = m.coordinate, l = m.factor), { x: s, y: o, anchor: eo(n, l) };
}
function Qn(e, t, i, a, s) {
  if (!t || Jn(t.edge) !== i) return;
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
    if (!m || Jn(m.edge) !== i) return;
    n = m.layerKey;
  }
}
function Xp(e, t, i) {
  const a = Gp(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const p = s.get(l.key);
    if (p) return p;
    let m;
    o.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), m = Hp(l, a, (ge) => {
      const ve = a.get(ge);
      return ve && !i(ve) ? n(ve).extent : void 0;
    }), o.delete(l.key));
    const S = t(l), T = Ss(m, S.width, S.height), q = { x: T.x, y: T.y, width: S.width, height: S.height }, se = { position: m, box: q, extent: Tl(q, m.x, m.y, l.rotation ?? 0) };
    return s.set(l.key, se), se;
  };
  for (const l of e) n(l);
  return s;
}
function to(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? eo(Xi(i.anchor), Ji(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? eo(Xi(e.anchor), Ji(i.anchor)) : e.anchor
  };
}
var de, Ke, Me, ct;
class Jp {
  constructor(t = 100) {
    k(this, de, []);
    k(this, Ke, []);
    k(this, Me, 0);
    k(this, ct);
    this.limit = t;
  }
  get canUndo() {
    return d(this, de).length > 0;
  }
  get canRedo() {
    return d(this, Ke).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    d(this, Me) > 0 || (d(this, de).push(structuredClone(t)), d(this, de).length > this.limit && d(this, de).shift(), _(this, Ke, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    d(this, Me) === 0 && _(this, ct, structuredClone(t)), Ps(this, Me)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    d(this, Me) !== 0 && (Ps(this, Me)._--, !(d(this, Me) > 0) && (t && d(this, ct) !== void 0 && (d(this, de).push(d(this, ct)), d(this, de).length > this.limit && d(this, de).shift(), _(this, Ke, [])), _(this, ct, void 0)));
  }
  undo(t) {
    const i = d(this, de).pop();
    if (i !== void 0)
      return d(this, Ke).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = d(this, Ke).pop();
    if (i !== void 0)
      return d(this, de).push(structuredClone(t)), i;
  }
  clear() {
    _(this, de, []), _(this, Ke, []), _(this, Me, 0), _(this, ct, void 0);
  }
}
de = new WeakMap(), Ke = new WeakMap(), Me = new WeakMap(), ct = new WeakMap();
const io = 3, Zp = (e) => Qp(e), er = (e, t) => e.slice(0, Math.max(0, t)).join("."), Qp = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), eh = "Page";
function th(e) {
  return e.isSystem ? eh : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const Ht = (e) => e ?? Number.MAX_SAFE_INTEGER;
function ih(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || Ht(t.property.tabSortOrder) - Ht(i.property.tabSortOrder) || Ht(t.property.groupSortOrder) - Ht(i.property.groupSortOrder) || Ht(t.property.sortOrder) - Ht(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function ah(e, t) {
  const i = ih(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: th(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function sh(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const oh = "DynamicImages.Workspace.Template", nh = 12, tr = 36;
var di, ut, Ot, At, pi, Pt, hi, mi, Rt, dt, yi, je, fi, gi, pe, pa, Mt, Fe, Ft, w, El, vi, bi, ao, so, oo, Ne, St, no, Pa, Dl, Cl, Il, ro;
class rh extends Dd {
  constructor(i) {
    super(i, oh);
    k(this, w);
    k(this, di);
    k(this, ut);
    k(this, Ot);
    k(this, At);
    k(this, pi);
    k(this, Pt);
    k(this, hi);
    k(this, mi);
    k(this, Rt);
    k(this, dt);
    k(this, yi);
    k(this, je);
    k(this, fi);
    k(this, gi);
    k(this, pe);
    k(this, pa);
    k(this, Mt);
    k(this, Fe);
    k(this, Ft);
    k(this, vi);
    k(this, bi);
    this._data = new Cd(this), this.template = this._data.current, _(this, di, new Oi([], (a) => a.key)), this.layers = d(this, di).asObservable(), _(this, ut, new Gn(void 0)), this.selectedLayerKey = d(this, ut).asObservable(), _(this, Ot, new Oi([], (a) => a.alias)), this.properties = d(this, Ot).asObservable(), _(this, At, new Yn({})), this.linkedProperties = d(this, At).asObservable(), _(this, pi, new Yn({})), this.linkedCaptions = d(this, pi).asObservable(), _(this, Pt, new Oi([], (a) => a.key)), this.fonts = d(this, Pt).asObservable(), _(this, hi, new Oi([], (a) => a.key)), this.serverBounds = d(this, hi).asObservable(), _(this, mi, new Oi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = d(this, mi).asObservable(), _(this, Rt, new Gn(void 0)), this.sampleContentKey = d(this, Rt).asObservable(), _(this, dt, new Ea(!0)), this.useSampleData = d(this, dt).asObservable(), _(this, yi, new Wd(1)), this.zoom = d(this, yi).asObservable(), _(this, je, new Ea(!0)), this.loading = d(this, je).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, fi, new Ea(!1)), this.canUndo = d(this, fi).asObservable(), _(this, gi, new Ea(!1)), this.canRedo = d(this, gi).asObservable(), _(this, pe, new Jp()), _(this, Fe, !1), _(this, Ft, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, vi, async (a) => {
      const s = a.detail;
      if (d(this, Ft) || !(s != null && s.url) || !D(this, w, El).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await Vo(this, Ld), _(this, Ft, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, bi, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = d(this, pa)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => Us),
        setup: (a, s) => {
          const o = s.match.params.parentUnique;
          return this.createScaffold(void 0, o && o !== "null" ? o : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => Us),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Us),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ae, (a) => {
      _(this, pa, a);
    }), this.consumeContext(Y, (a) => {
      _(this, Mt, a);
    }), window.addEventListener("willchangestate", d(this, vi)), window.addEventListener("beforeunload", d(this, bi)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return d(this, Fe);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    d(this, je).setValue(!0), _(this, Fe, !1);
    try {
      const a = await Go(i, this.getToken);
      D(this, w, St).call(this, a, { resetHistory: !0, persist: !0 }), D(this, w, Cl).call(this), this.setIsNew(!1), await D(this, w, ao).call(this, a);
    } catch (a) {
      D(this, w, ro).call(this, "This template could not be loaded", a);
    } finally {
      d(this, je).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    d(this, je).setValue(!0), _(this, Fe, !0), D(this, w, St).call(this, { ...Bp(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await D(this, w, ao).call(this, this._data.getCurrent()), d(this, je).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await D(this, w, oo).call(this, i.docTypeAliases);
    d(this, Ot).setValue(a), d(this, At).setValue(await D(this, w, so).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    d(this, Pt).setValue(await es(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    D(this, w, Ne).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    D(this, w, Ne).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    D(this, w, Ne).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    D(this, w, Ne).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    D(this, w, Ne).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    D(this, w, Ne).call(this, (s) => ({
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
    D(this, w, Ne).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, p;
        let n = o.position;
        return ((l = ts(n, "x")) == null ? void 0 : l.layerKey) === i && (n = to(n, "x", a == null ? void 0 : a.get(o.key))), ((p = ts(n, "y")) == null ? void 0 : p.layerKey) === i && (n = to(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), d(this, ut).getValue() === i && this.selectLayer(void 0);
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
    D(this, w, Ne).call(this, (s) => {
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
    d(this, ut).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = d(this, ut).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && d(this, pe).begin(i);
  }
  endTransaction(i = !0) {
    d(this, pe).end(i), D(this, w, no).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = d(this, pe).undo(i);
    a && D(this, w, St).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = d(this, pe).redo(i);
    a && D(this, w, St).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    d(this, hi).setValue(i);
  }
  setIssues(i) {
    d(this, mi).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    d(this, Rt).setValue(i), d(this, dt).setValue(!i), D(this, w, Dl).call(this, i);
  }
  setUseSampleData(i) {
    d(this, dt).setValue(i);
  }
  setZoom(i) {
    d(this, yi).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = d(this, Fe) ? await Gd(i, this.getToken) : await Yd(i, this.getToken);
      D(this, w, St).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = d(this, Fe);
      _(this, Fe, !1), this.setIsNew(!1), Jo(), await D(this, w, Il).call(this, o.template, n), (a = d(this, Mt)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = d(this, Mt)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", Ho(o.template.key));
    } catch (o) {
      throw D(this, w, ro).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Ft, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", d(this, vi)), window.removeEventListener("beforeunload", d(this, bi)), d(this, pe).clear(), super.destroy();
  }
}
di = new WeakMap(), ut = new WeakMap(), Ot = new WeakMap(), At = new WeakMap(), pi = new WeakMap(), Pt = new WeakMap(), hi = new WeakMap(), mi = new WeakMap(), Rt = new WeakMap(), dt = new WeakMap(), yi = new WeakMap(), je = new WeakMap(), fi = new WeakMap(), gi = new WeakMap(), pe = new WeakMap(), pa = new WeakMap(), Mt = new WeakMap(), Fe = new WeakMap(), Ft = new WeakMap(), w = new WeakSet(), /**
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
El = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, vi = new WeakMap(), bi = new WeakMap(), ao = async function(i) {
  const [a, s] = await Promise.all([
    es(this.getToken).catch(() => []),
    D(this, w, oo).call(this, i.docTypeAliases)
  ]);
  d(this, Pt).setValue(a), d(this, Ot).setValue(s), d(this, At).setValue(await D(this, w, so).call(this, i.docTypeAliases, s));
}, so = async function(i, a) {
  const s = {}, o = {};
  if (i.length === 0) return s;
  let n = a.filter((p) => p.classification === "content").slice(0, nh).map((p) => p.alias), l = 0;
  for (let p = 1; p <= io && n.length > 0 && l < tr; p++) {
    const m = n.slice(0, tr - l);
    l += m.length;
    const S = await Promise.all(m.map(async (T) => {
      var Ii;
      const q = await Promise.all(
        i.map((oe) => Dp(oe, T, this.getToken).catch(() => null))
      ), se = /* @__PURE__ */ new Map();
      for (const oe of q.flatMap((xe) => (xe == null ? void 0 : xe.properties) ?? []))
        se.has(oe.alias) || se.set(oe.alias, oe);
      const ge = q.filter((oe) => oe !== null), ve = [...new Set(ge.flatMap((oe) => oe.targetDocTypes.map((xe) => xe.name)))], Yt = ge.some((oe) => oe.inference === "all") ? "all" : (Ii = ge[0]) == null ? void 0 : Ii.inference;
      return { prefix: T, properties: [...se.values()], caption: sh(ve, Yt) };
    }));
    n = [];
    for (const T of S)
      T.properties.length !== 0 && (s[T.prefix] = T.properties, o[T.prefix] = T.caption, p < io && n.push(...T.properties.filter((q) => q.classification === "content" && !q.isSystem).map((q) => `${T.prefix}.${q.alias}`)));
  }
  return d(this, pi).setValue(o), s;
}, oo = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => Ep(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Ne = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && d(this, pe).push(s);
  const o = i(structuredClone(s));
  D(this, w, St).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
St = function(i, a) {
  a != null && a.resetHistory && d(this, pe).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), d(this, di).setValue(i.layers), D(this, w, no).call(this);
}, no = function() {
  d(this, fi).setValue(d(this, pe).canUndo), d(this, gi).setValue(d(this, pe).canRedo);
}, Pa = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, Dl = function(i) {
  try {
    i ? localStorage.setItem(D(this, w, Pa).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(D(this, w, Pa).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
Cl = function() {
  let i;
  try {
    const a = localStorage.getItem(D(this, w, Pa).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  d(this, Rt).setValue(i), d(this, dt).setValue(!i);
}, Il = async function(i, a) {
  const s = await this.getContext(qt).catch(() => {
  });
  s && (a ? s.dispatchEvent(new Ei({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : s.dispatchEvent(new sl({ entityType: "di-template", unique: i.key })));
}, ro = function(i, a) {
  var o;
  const s = a instanceof bt ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = d(this, Mt)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const xt = new fa(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Ye = "di-template-root", N = "di-template-folder", X = ws, Ct = "DynamicImages.Tree.Templates", ii = "DynamicImages.Repository.TemplateTree", Bi = "DynamicImages.Repository.TemplateFolder", lh = "DynamicImages.Store.TemplateFolder", is = "DynamicImages.Workspace.TemplateFolder", Ol = "DynamicImages.Workspace.TemplateRoot", Rs = "DynamicImages.Repository.TemplateItem", ch = "DynamicImages.Store.TemplateItem", Ms = "DynamicImages.Repository.TemplateDetail", uh = "DynamicImages.Store.TemplateDetail", ir = "DynamicImages.Repository.MoveTemplate", ar = "DynamicImages.Repository.MoveTemplateFolder", sr = "DynamicImages.Repository.DuplicateTemplate", or = "DynamicImages.Repository.BulkMoveTemplates", nr = "DynamicImages.Repository.BulkDuplicateTemplates", rr = "DynamicImages.Repository.SortTemplateChildren", Al = "icon-picture", Pl = "icon-picture color-grey", Rl = "icon-folder", as = "DynamicImages.Collection.Templates", lr = "DynamicImages.Repository.TemplateCollection";
async function E(e, t) {
  const i = (async () => {
    const a = await new Od(e, Ae).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (s) {
      throw s instanceof bt ? { type: "error", title: s.message, status: s.status, detail: s.detail } : s;
    }
  })();
  return await Ud(e, i);
}
var pt;
class dh {
  constructor(t) {
    k(this, pt);
    _(this, pt, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: N,
      unique: el.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await E(d(this, pt), (s) => op(t, s));
    return i ? { data: { entityType: N, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await E(d(this, pt), (o) => sp({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await E(d(this, pt), (s) => np(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return E(d(this, pt), (i) => pl(t, i));
  }
}
pt = new WeakMap();
const Qo = new fa("DiTemplateFolderStore");
class Ml extends jo {
  constructor(t) {
    super(t, Qo);
  }
}
class cr extends Ko {
  constructor(t) {
    super(t, dh, Qo);
  }
}
const ph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: Qo,
  DiTemplateFolderRepository: cr,
  DiTemplateFolderStore: Ml,
  api: cr
}, Symbol.toStringTag, { value: "Module" })), hh = [
  {
    type: "repository",
    alias: Bi,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => ph)
  },
  {
    type: "store",
    alias: lh,
    name: "Dynamic Images Template Folder Store",
    api: Ml
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [N],
    meta: { folderRepositoryAlias: Bi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [N],
    meta: { folderRepositoryAlias: Bi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: is,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => Nh),
    meta: { entityType: N }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: Qa,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: is }]
  }
], mh = [
  {
    type: "repository",
    alias: ii,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => jh)
  },
  {
    type: "tree",
    kind: "default",
    alias: Ct,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: ii }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [Ye, N, X]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: Ct, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: Ol,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: Ye, headline: "Templates" }
  },
  ...hh
], en = new fa("DiTemplateItemStore");
class Fl extends Rd {
  constructor(t) {
    super(t, en);
  }
}
class yh extends Pd {
  constructor(t) {
    super(t, {
      getItems: (i) => E(t, (a) => xs(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? N : X,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class ur extends Ad {
  constructor(t) {
    super(t, yh, en);
  }
}
const fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: en,
  DiTemplateItemRepository: ur,
  DiTemplateItemStore: Fl,
  api: ur
}, Symbol.toStringTag, { value: "Module" })), tn = new fa("DiTemplateDetailStore");
class Ll extends jo {
  constructor(t) {
    super(t, tn);
  }
}
const Fs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var _i;
class gh {
  constructor(t) {
    k(this, _i);
    this.createScaffold = Fs, this.create = Fs, this.update = Fs, _(this, _i, t);
  }
  async read(t) {
    const { data: i, error: a } = await E(d(this, _i), (s) => Go(t, s));
    return i ? { data: { entityType: X, unique: i.key, name: i.name } } : { error: a };
  }
  /**
   * A template, or a folder: the collection's bulk Delete sends every selected key here, and a
   * selection can hold both. A folder that is not empty is refused by the server with a 409, which
   * core's bulk action shows as that item's error.
   */
  delete(t) {
    return E(d(this, _i), async (i) => {
      const [a] = await xs([t], i);
      return (a == null ? void 0 : a.entityType) === "folder" ? pl(t, i) : Hd(t, i);
    });
  }
}
_i = new WeakMap();
class dr extends Ko {
  constructor(t) {
    super(t, gh, tn);
  }
}
const vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: tn,
  DiTemplateDetailRepository: dr,
  DiTemplateDetailStore: Ll,
  api: dr
}, Symbol.toStringTag, { value: "Module" })), Xt = [Ye, N], Ls = [{ alias: "Umb.Condition.CollectionAlias", match: as }], bh = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: Rs,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => fh)
  },
  {
    type: "itemStore",
    alias: ch,
    name: "Dynamic Images Template Item Store",
    api: Fl
  },
  {
    type: "repository",
    alias: Ms,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => vh)
  },
  {
    type: "store",
    alias: uh,
    name: "Dynamic Images Template Detail Store",
    api: Ll
  },
  {
    type: "repository",
    alias: ir,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => Gh)
  },
  {
    type: "repository",
    alias: ar,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => Yh)
  },
  {
    type: "repository",
    alias: sr,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => Hh)
  },
  {
    type: "repository",
    alias: rr,
    name: "Dynamic Images Sort Template Children Repository",
    api: () => Promise.resolve().then(() => Xh)
  },
  {
    type: "repository",
    alias: or,
    name: "Dynamic Images Bulk Move Templates Repository",
    api: () => Promise.resolve().then(() => Qh)
  },
  {
    type: "repository",
    alias: nr,
    name: "Dynamic Images Bulk Duplicate Templates Repository",
    api: () => Promise.resolve().then(() => em)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: Xt,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => tm),
    forEntityTypes: Xt,
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
    forEntityTypes: Xt,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Bi
    }
  },
  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [X],
    meta: {
      treeRepositoryAlias: ii,
      moveRepositoryAlias: ir,
      treeAlias: Ct,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Template To",
    forEntityTypes: [X],
    meta: {
      duplicateRepositoryAlias: sr,
      treeRepositoryAlias: ii,
      treeAlias: Ct,
      foldersOnly: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Enable",
    name: "Enable Dynamic Images Template",
    api: () => Promise.resolve().then(() => im),
    forEntityTypes: [X],
    weight: 560,
    meta: { icon: "icon-check", label: "Enable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Disable",
    name: "Disable Dynamic Images Template",
    api: () => Promise.resolve().then(() => am),
    forEntityTypes: [X],
    weight: 550,
    meta: { icon: "icon-block", label: "Disable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => sm),
    forEntityTypes: [X],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => nm),
    forEntityTypes: [X],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [X],
    meta: {
      itemRepositoryAlias: Rs,
      detailRepositoryAlias: Ms,
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
    forEntityTypes: [N],
    meta: {
      treeRepositoryAlias: ii,
      moveRepositoryAlias: ar,
      treeAlias: Ct,
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
    api: () => Promise.resolve().then(() => lm),
    forEntityTypes: Xt,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "sortChildrenOf",
    alias: "DynamicImages.EntityAction.Template.SortChildren",
    name: "Sort Dynamic Images Templates",
    forEntityTypes: Xt,
    meta: {
      sortChildrenOfRepositoryAlias: rr,
      treeRepositoryAlias: ii
    }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: Xt
  },
  // ---------------------------------------------------------------- collection selection
  // Any of these applying is what turns on the collection's checkboxes.
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Template.MoveTo",
    name: "Move Dynamic Images Templates",
    forEntityTypes: [X, N],
    meta: {
      bulkMoveRepositoryAlias: or,
      treeAlias: Ct,
      foldersOnly: !0
    },
    conditions: Ls
  },
  {
    type: "entityBulkAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityBulkAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Templates To",
    forEntityTypes: [X, N],
    meta: {
      bulkDuplicateRepositoryAlias: nr,
      treeAlias: Ct,
      foldersOnly: !0
    },
    conditions: Ls
  },
  {
    type: "entityBulkAction",
    kind: "delete",
    alias: "DynamicImages.EntityBulkAction.Template.Delete",
    name: "Delete Dynamic Images Templates",
    forEntityTypes: [X, N],
    meta: {
      itemRepositoryAlias: Rs,
      detailRepositoryAlias: Ms
    },
    conditions: Ls
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => mm)
  }
], Da = [{ alias: "Umb.Condition.CollectionAlias", match: as }], _h = [
  {
    type: "repository",
    alias: lr,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => ym)
  },
  {
    type: "collection",
    kind: "default",
    alias: as,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => fm),
    meta: { repositoryAlias: lr }
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
        { field: "isEnabled", label: "Enabled", valueType: Md },
        { field: "updated", label: "Last updated", valueType: Fd }
      ]
    },
    conditions: Da
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: Da
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => _m),
    forEntityTypes: [X]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: Da
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: Da
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
      collectionAlias: as
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [Ol, is]
      }
    ]
  }
], Zi = "di-font-root", De = "di-font-folder", gt = "di-font-family", an = "di-font", pr = "DynamicImages.Tree.Fonts", hr = "DynamicImages.Repository.FontTree", Ki = "DynamicImages.Repository.FontFolder", wh = "DynamicImages.Store.FontFolder", ss = "DynamicImages.Workspace.FontFolder", zl = "DynamicImages.Workspace.FontRoot", $h = "DynamicImages.Workspace.FontFamily", lo = "DynamicImages.Collection.Fonts", zs = "DynamicImages.Repository.FontCollection", co = "DynamicImages.Collection.FontVariants", xh = "icon-folder", kh = "icon-font", Th = "icon-font color-grey", Sh = "icon-cloud";
function Ul(e) {
  switch (e) {
    case "folder":
      return De;
    case "family":
      return gt;
    default:
      return an;
  }
}
function Wl(e, t) {
  switch (e) {
    case "folder":
      return xh;
    case "family":
      return kh;
    default:
      return t ? Sh : Th;
  }
}
const Eh = [
  {
    type: "repository",
    alias: hr,
    name: "Dynamic Images Font Tree Repository",
    api: () => Promise.resolve().then(() => xm)
  },
  {
    type: "tree",
    kind: "default",
    alias: pr,
    name: "Dynamic Images Font Tree",
    meta: { repositoryAlias: hr }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Fonts",
    name: "Dynamic Images Font Tree Item",
    forEntityTypes: [Zi, De, gt, an]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Fonts",
    name: "Dynamic Images Fonts Menu Item",
    weight: 100,
    meta: { label: "Fonts", treeAlias: pr, menus: ["DynamicImages.Menu"] }
  },
  {
    type: "workspace",
    kind: "default",
    alias: zl,
    name: "Dynamic Images Fonts Root Workspace",
    meta: { entityType: Zi, headline: "Fonts" }
  }
];
var ht;
class Dh {
  constructor(t) {
    k(this, ht);
    _(this, ht, t);
  }
  async createScaffold(t) {
    return { data: { entityType: De, unique: el.new(), name: "", ...t } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await E(d(this, ht), (s) => kp(t, s));
    return i ? { data: { entityType: De, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await E(d(this, ht), (o) => xp({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await E(d(this, ht), (s) => Tp(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return E(d(this, ht), (i) => Sp(t, i));
  }
}
ht = new WeakMap();
const sn = new fa("DiFontFolderStore");
class Nl extends jo {
  constructor(t) {
    super(t, sn);
  }
}
class mr extends Ko {
  constructor(t) {
    super(t, Dh, sn);
  }
}
const Ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FOLDER_STORE_CONTEXT: sn,
  DiFontFolderRepository: mr,
  DiFontFolderStore: Nl,
  api: mr
}, Symbol.toStringTag, { value: "Module" })), Ih = [
  {
    type: "repository",
    alias: Ki,
    name: "Dynamic Images Font Folder Repository",
    api: () => Promise.resolve().then(() => Ch)
  },
  {
    type: "store",
    alias: wh,
    name: "Dynamic Images Font Folder Store",
    api: Nl
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.FontFolder.Rename",
    name: "Rename Dynamic Images Font Folder",
    forEntityTypes: [De],
    meta: { folderRepositoryAlias: Ki }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.FontFolder.Delete",
    name: "Delete Dynamic Images Font Folder",
    forEntityTypes: [De],
    meta: { folderRepositoryAlias: Ki }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: ss,
    name: "Dynamic Images Font Folder Workspace",
    api: () => Promise.resolve().then(() => km),
    meta: { entityType: De }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.FontFolder.Submit",
    name: "Save Dynamic Images Font Folder",
    api: Qa,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: ss }]
  }
], yr = [{ alias: "Umb.Condition.CollectionAlias", match: lo }], fr = [{ alias: "Umb.Condition.CollectionAlias", match: co }], gr = (e, t) => [
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
], Oh = [
  {
    type: "repository",
    alias: zs,
    name: "Dynamic Images Font Collection Repository",
    api: () => Promise.resolve().then(() => Sm)
  },
  {
    type: "collection",
    kind: "default",
    alias: lo,
    name: "Dynamic Images Font Collection",
    api: () => Promise.resolve().then(() => Lr),
    meta: { repositoryAlias: zs }
  },
  {
    type: "collection",
    kind: "default",
    alias: co,
    name: "Dynamic Images Font Variant Collection",
    api: () => Promise.resolve().then(() => Lr),
    meta: { repositoryAlias: zs }
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
    conditions: yr
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
    conditions: fr
  },
  ...gr("Fonts", yr),
  ...gr("FontVariants", fr),
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Font",
    name: "Dynamic Images Font Card",
    element: () => Promise.resolve().then(() => Cm),
    forEntityTypes: [De, gt, an]
  },
  // ---------------------------------------------------------------- where they show
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Fonts.Collection",
    name: "Dynamic Images Fonts Collection Workspace View",
    meta: { label: "Fonts", pathname: "fonts", icon: "icon-grid", collectionAlias: lo },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", oneOf: [zl, ss] }]
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.FontVariants.Collection",
    name: "Dynamic Images Font Variants Collection Workspace View",
    meta: { label: "Variants", pathname: "variants", icon: "icon-font", collectionAlias: co },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: $h }]
  }
], Jt = [Zi, De], Ah = [
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Font.Create",
    name: "Create Dynamic Images Font",
    weight: 1200,
    forEntityTypes: [...Jt, gt],
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Add to Fonts" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Upload",
    name: "Upload a Dynamic Images Font File",
    weight: 100,
    api: () => Promise.resolve().then(() => Rm),
    forEntityTypes: Jt,
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
    api: () => Promise.resolve().then(() => Mm),
    forEntityTypes: Jt,
    meta: { icon: "icon-cloud", label: "Web font", description: "From Google Fonts, Bunny Fonts or a file URL" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Path",
    name: "Register a Dynamic Images Font Path",
    weight: 80,
    api: () => Promise.resolve().then(() => Fm),
    forEntityTypes: Jt,
    meta: { icon: "icon-font", label: "Font from path", description: "A font file already in the site's wwwroot" }
  },
  // Cast for the same reason as the template folder option in entity-actions/manifests.ts.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.FontFolder",
    name: "Dynamic Images Font Folder Create Option",
    weight: 70,
    forEntityTypes: Jt,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Ki
    }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.AddVariant",
    name: "Add a Variant to a Dynamic Images Font Family",
    weight: 100,
    api: () => Promise.resolve().then(() => Lm),
    forEntityTypes: [gt],
    meta: { icon: "icon-add", label: "Add variant", description: "Another weight or slant of this family" }
  },
  // ---------------------------------------------------------------- reload
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Font.ReloadChildren",
    name: "Reload Dynamic Images Fonts",
    forEntityTypes: [...Jt, gt]
  }
], Ph = [
  ...Eh,
  ...Ih,
  ...Oh,
  ...Ah
], Rh = [
  ...mh,
  ...bh,
  ..._h,
  ...Ph,
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
    element: () => Promise.resolve().then(() => Nm),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Gm),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Jm),
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
    api: rh,
    meta: { entityType: ws }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => xf),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Ef),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Af),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Lf),
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
    api: () => Promise.resolve().then(() => zf),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Uf),
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
    api: () => Promise.resolve().then(() => Wf),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Nf),
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
    element: () => Promise.resolve().then(() => Yf)
  }
], Tg = (e, t) => {
  t.registerMany(Rh);
};
var Mh = Object.defineProperty, Fh = Object.getOwnPropertyDescriptor, Bl = (e) => {
  throw TypeError(e);
}, on = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Mh(t, i, s), s;
}, nn = (e, t, i) => t.has(e) || Bl("Cannot " + i), Lh = (e, t, i) => (nn(e, t, "read from private field"), t.get(e)), vr = (e, t, i) => t.has(e) ? Bl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), zh = (e, t, i, a) => (nn(e, t, "write to private field"), t.set(e, i), i), Uh = (e, t, i) => (nn(e, t, "access private method"), i), os, uo, Kl;
let Bt = class extends F {
  constructor() {
    super(), vr(this, uo), vr(this, os), this._name = "", this._loading = !0, this.consumeContext(xt, (e) => {
      zh(this, os, e), e && (this.observe(e.template, (t) => {
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
            @input=${Uh(this, uo, Kl)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : h}
    `;
  }
};
os = /* @__PURE__ */ new WeakMap();
uo = /* @__PURE__ */ new WeakSet();
Kl = function(e) {
  var i;
  const t = e.target.value;
  (i = Lh(this, os)) == null || i.updateTemplateFields({ name: t });
};
Bt.styles = O`
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
on([
  y()
], Bt.prototype, "_name", 2);
on([
  y()
], Bt.prototype, "_loading", 2);
Bt = on([
  A("di-template-editor")
], Bt);
const Wh = Bt, Us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Bt;
  },
  default: Wh
}, Symbol.toStringTag, { value: "Module" }));
class br extends Qr {
  constructor(t) {
    super(t, {
      workspaceAlias: is,
      entityType: N,
      detailRepositoryAlias: Bi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Ed),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Nh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: br,
  api: br
}, Symbol.toStringTag, { value: "Module" }));
function Ws(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function Bh(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? N : Ye
    },
    name: e.name,
    entityType: t ? N : X,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? Rl : e.isEnabled ? Al : Pl,
    isEnabled: e.isEnabled
  };
}
class Kh extends il {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = Ws(i);
        return E(t, (o) => Hn(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = Ws(i);
          return E(t, (p) => Hn(n, l, i.foldersOnly ?? !1, p));
        }
        const a = i.parent.unique, { skip: s, take: o } = Ws(i);
        return E(t, (n) => ep(a, s, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => E(t, (a) => tp(i.treeItem.unique, a)),
      mapper: Bh
    });
  }
}
class _r extends al {
  constructor(t) {
    super(t, Kh);
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
const jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: _r,
  api: _r
}, Symbol.toStringTag, { value: "Module" }));
class jl extends Si {
  async requestMoveTo(t) {
    const { error: i } = await E(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(Y);
      a == null || a.peek("positive", { data: { message: "Moved" } });
      const s = await this.getContext(qt).catch(() => {
      }), o = t.destination.unique;
      s == null || s.dispatchEvent(new Ei({
        entityType: o ? N : Ye,
        unique: o
      }));
    }
    return { error: i };
  }
}
class Vh extends jl {
  constructor() {
    super(...arguments), this.move = rp;
  }
}
class qh extends jl {
  constructor() {
    super(...arguments), this.move = lp;
  }
}
const Gh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Vh
}, Symbol.toStringTag, { value: "Module" })), Yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: qh
}, Symbol.toStringTag, { value: "Module" }));
class wr extends Si {
  async requestDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: s } = await E(this, (o) => Xd(t.unique, i, o));
    if (a) {
      const o = await this.getContext(Y);
      o == null || o.peek("positive", { data: { message: `'${a.template.name}' created` } });
      const n = await this.getContext(qt).catch(() => {
      });
      n == null || n.dispatchEvent(new Ei({
        entityType: i ? N : Ye,
        unique: i
      }));
    }
    return { error: s };
  }
}
const Hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateToTemplateRepository: wr,
  api: wr
}, Symbol.toStringTag, { value: "Module" }));
class $r extends Si {
  async sortChildrenOf(t) {
    const i = t.sorting.map((s) => ({ key: s.unique, sortOrder: s.sortOrder })), { error: a } = await E(this, (s) => dp(t.unique, i, s));
    if (!a) {
      const s = await this.getContext(Y);
      s == null || s.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const Xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortTemplateChildrenRepository: $r,
  api: $r
}, Symbol.toStringTag, { value: "Module" })), Vl = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
class ql extends Si {
  async reloadDestination(t) {
    const i = await this.getContext(qt).catch(() => {
    });
    i == null || i.dispatchEvent(new Ei({
      entityType: t ? N : Ye,
      unique: t
    }));
  }
  async notify(t, i) {
    const a = await this.getContext(Y);
    a == null || a.peek(t, { data: { message: i } });
  }
}
class Jh extends ql {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await E(this, (s) => cp(t.uniques, i, s));
    return await this.reloadDestination(i), a || await this.notify("positive", `Moved ${Vl(t.uniques.length, "item")}`), { error: a };
  }
}
class Zh extends ql {
  async requestBulkDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: s } = await E(this, (o) => up(t.uniques, i, o));
    return a ? (await this.reloadDestination(i), a.created.length > 0 && await this.notify("positive", `Copied ${Vl(a.created.length, "template")}`), a.skippedFolders.length > 0 && await this.notify("warning", `Folders are not copied: ${a.skippedFolders.join(", ")}`), a.errors.length > 0 && await this.notify("warning", a.errors.join(" ")), {}) : { error: s };
  }
}
const Qh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Jh
}, Symbol.toStringTag, { value: "Module" })), em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Zh
}, Symbol.toStringTag, { value: "Module" }));
class xr extends ol {
  async getHref() {
    return Mp({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const tm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: xr,
  api: xr
}, Symbol.toStringTag, { value: "Module" }));
class rn extends ga {
  async execute() {
    var m;
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await E(this, (S) => Jd(t, this.enable, S));
    if (a || !i) throw a ?? new Error("The template could not be changed.");
    const { data: s } = await E(this, (S) => xs([t], S)), o = ((m = s == null ? void 0 : s[0]) == null ? void 0 : m.name) ?? "The template", n = this.enable ? "enabled" : "disabled", l = await this.getContext(Y);
    if (!i.changed) {
      l == null || l.peek("default", { data: { message: `'${o}' is already ${n}` } });
      return;
    }
    l == null || l.peek("positive", { data: { message: `'${o}' ${n}` } });
    const p = await this.getContext(qt).catch(() => {
    });
    p == null || p.dispatchEvent(new sl({ unique: t, entityType: this.args.entityType })), Jo();
  }
}
class kr extends rn {
  constructor() {
    super(...arguments), this.enable = !0;
  }
}
const im = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiEnableTemplateEntityAction: kr,
  DiSetTemplateEnabledEntityAction: rn,
  api: kr
}, Symbol.toStringTag, { value: "Module" }));
class Tr extends rn {
  constructor() {
    super(...arguments), this.enable = !1;
  }
}
const am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDisableTemplateEntityAction: Tr,
  api: Tr
}, Symbol.toStringTag, { value: "Module" }));
class Sr extends ga {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await E(this, async (n) => ({
      blob: await Zd(t, n),
      alias: (await Go(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const s = URL.createObjectURL(i.blob), o = document.createElement("a");
    o.href = s, o.download = `${i.alias}.json`, o.click(), URL.revokeObjectURL(s);
  }
}
const sm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: Sr,
  api: Sr
}, Symbol.toStringTag, { value: "Module" })), om = 1500;
async function Gl(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((s) => setTimeout(s, om));
    try {
      a = await Cp(a.id, t);
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
class Er extends ga {
  async execute() {
    var p;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await E(this, (m) => xs([t], m)), a = ((p = i == null ? void 0 : i[0]) == null ? void 0 : p.name) ?? "this template";
    await qo(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: s, error: o } = await E(this, (m) => gl(t, !1, m));
    if (o || !s) throw o ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(Y);
    n == null || n.peek("positive", { data: { message: `Regenerating ${s.total} item(s)…` } });
    const l = await this.getContext(Ae);
    await Gl(s, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const nm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: Er,
  api: Er
}, Symbol.toStringTag, { value: "Module" })), Yl = new nl(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), rm = new nl(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class Dr extends ga {
  async execute() {
    const { json: t } = await Vo(this, rm, { data: {} }), i = this.args.unique ?? null, { data: a, error: s } = await E(this, (l) => Qd(t, "create", l, i));
    if (s || !a) throw s ?? new Error("The template could not be imported.");
    const o = await this.getContext(Y);
    o == null || o.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) o == null || o.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(qt);
    n == null || n.dispatchEvent(new Ei({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const lm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: Dr,
  api: Dr
}, Symbol.toStringTag, { value: "Module" }));
var cm = Object.defineProperty, um = Object.getOwnPropertyDescriptor, Hl = (e) => {
  throw TypeError(e);
}, Xl = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? um(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && cm(t, i, s), s;
}, dm = (e, t, i) => t.has(e) || Hl("Cannot " + i), pm = (e, t, i) => t.has(e) ? Hl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Cr = (e, t, i) => (dm(e, t, "access private method"), i), Ra, Jl, Zl;
let xi = class extends rl {
  constructor() {
    super(...arguments), pm(this, Ra), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${Cr(this, Ra, Jl)} aria-label="Choose a file" />
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
            @click=${Cr(this, Ra, Zl)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Ra = /* @__PURE__ */ new WeakSet();
Jl = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
Zl = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
xi.styles = [
  O`
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
Xl([
  y()
], xi.prototype, "_json", 2);
xi = Xl([
  A("di-import-template-modal")
], xi);
const hm = xi, mm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return xi;
  },
  default: hm
}, Symbol.toStringTag, { value: "Module" }));
function Ql(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? N : X,
    name: e.name,
    icon: t ? Rl : e.isEnabled ? Al : Pl,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class Ir extends Si {
  async requestCollection(t = {}) {
    const i = await this.getContext(ll), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: o } = await E(this, (n) => ip({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return s ? { data: { total: s.total, items: s.items.map(Ql) } } : { error: o };
  }
}
const ym = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: Ir,
  api: Ir,
  mapCollectionItem: Ql
}, Symbol.toStringTag, { value: "Module" }));
class Or extends cl {
  async requestItemHref(t) {
    return t.entityType === N ? Xo(N, t.unique) : Ho(t.unique);
  }
}
const fm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: Or,
  api: Or
}, Symbol.toStringTag, { value: "Module" }));
var gm = Object.defineProperty, vm = Object.getOwnPropertyDescriptor, ec = (e) => {
  throw TypeError(e);
}, et = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? vm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && gm(t, i, s), s;
}, ln = (e, t, i) => t.has(e) || ec("Cannot " + i), ns = (e, t, i) => (ln(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ca = (e, t, i) => t.has(e) ? ec("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ma = (e, t, i, a) => (ln(e, t, "write to private field"), t.set(e, i), i), Ns = (e, t, i) => (ln(e, t, "access private method"), i), rs, Mi, Qi, Fi, tc, ic, ac;
const bm = 400;
let me = class extends F {
  constructor() {
    super(), Ca(this, Fi), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, Ca(this, rs), Ca(this, Mi), Ca(this, Qi), this.consumeContext(Ae, (e) => {
      Ma(this, rs, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), Ma(this, Mi, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && Ns(this, Fi, tc).call(this);
    })), ns(this, Mi).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ns(this, Mi)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, Ma(this, Qi, void 0);
  }
  render() {
    return this.item ? r`
      <uui-card-media
        name=${this.item.name}
        detail=${Yi(this.item.docTypes || void 0)}
        href=${Yi(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${Ns(this, Fi, ic)}
        @deselected=${Ns(this, Fi, ac)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : h}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : h;
  }
};
rs = /* @__PURE__ */ new WeakMap();
Mi = /* @__PURE__ */ new WeakMap();
Qi = /* @__PURE__ */ new WeakMap();
Fi = /* @__PURE__ */ new WeakSet();
tc = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || ns(this, Qi) === t)) {
    Ma(this, Qi, t);
    try {
      const i = await ap(e.unique, bm, () => {
        var a;
        return (a = ns(this, rs)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
ic = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new ul(this.item.unique)));
};
ac = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new dl(this.item.unique)));
};
me.styles = [
  O`
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
et([
  f({ type: Object })
], me.prototype, "item", 2);
et([
  f({ type: Boolean })
], me.prototype, "selectable", 2);
et([
  f({ type: Boolean })
], me.prototype, "selected", 2);
et([
  f({ type: Boolean, attribute: "select-only" })
], me.prototype, "selectOnly", 2);
et([
  f({ type: Boolean })
], me.prototype, "disabled", 2);
et([
  f({ type: String })
], me.prototype, "href", 2);
et([
  y()
], me.prototype, "_src", 2);
et([
  y()
], me.prototype, "_failed", 2);
me = et([
  A("di-template-collection-card")
], me);
const _m = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return me;
  },
  get element() {
    return me;
  }
}, Symbol.toStringTag, { value: "Module" }));
function Ar(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function wm(e) {
  const t = e.parentKey ? e.entityType === "font" ? gt : De : Zi;
  return {
    unique: e.key,
    parent: { unique: e.parentKey, entityType: t },
    name: e.name,
    entityType: Ul(e.entityType),
    hasChildren: e.hasChildren,
    isFolder: e.entityType !== "font",
    icon: Wl(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
class $m extends il {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = Ar(i);
        return E(t, (o) => Xn(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        const { skip: a, take: s } = Ar(i);
        if (i.parent.unique === null)
          return E(t, (n) => Xn(a, s, i.foldersOnly ?? !1, n));
        const o = i.parent.unique;
        return E(t, (n) => bp(o, a, s, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => E(t, (a) => _p(i.treeItem.unique, a)),
      mapper: wm
    });
  }
}
class Pr extends al {
  constructor(t) {
    super(t, $m);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: Zi,
      name: "Fonts",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const xm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontTreeRepository: Pr,
  api: Pr
}, Symbol.toStringTag, { value: "Module" }));
class Rr extends Qr {
  constructor(t) {
    super(t, {
      workspaceAlias: ss,
      entityType: De,
      detailRepositoryAlias: Ki
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        // The same element as a template folder's: core's editable folder header, nothing more.
        component: () => Promise.resolve().then(() => Ed),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const km = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFolderWorkspaceContext: Rr,
  api: Rr
}, Symbol.toStringTag, { value: "Module" }));
function Tm(e) {
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
function sc(e) {
  return {
    unique: e.key,
    entityType: Ul(e.entityType),
    name: e.name,
    icon: Wl(e.entityType, e.sourceKind === "url"),
    isFolder: e.entityType === "folder",
    variants: e.variantCount === null ? "" : String(e.variantCount),
    usedBy: e.usedByTemplateCount === null ? "" : String(e.usedByTemplateCount),
    weight: e.weight === null ? "" : String(e.weight),
    style: e.isItalic === null ? "" : e.isItalic ? "Italic" : "Upright",
    source: Tm(e),
    sampleFontKey: e.sampleFontKey
  };
}
class Mr extends Si {
  async requestCollection(t = {}) {
    const i = await this.getContext(ll), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: o } = await E(this, (n) => $p({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return s ? { data: { total: s.total, items: s.items.map(sc) } } : { error: o };
  }
}
const Sm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionRepository: Mr,
  api: Mr,
  mapFontCollectionItem: sc
}, Symbol.toStringTag, { value: "Module" }));
class Fr extends cl {
  async requestItemHref(t) {
    return Xo(t.entityType, t.unique);
  }
}
const Lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionContext: Fr,
  api: Fr
}, Symbol.toStringTag, { value: "Module" })), po = /* @__PURE__ */ new Map(), va = (e) => `di-${e}`;
function oc(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = po.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await vp(e, t), o = new FontFace(va(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return po.set(e, a), a;
}
async function nc(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => oc(a, t)));
}
function rc(e) {
  po.delete(e);
}
var Em = Object.defineProperty, Dm = Object.getOwnPropertyDescriptor, lc = (e) => {
  throw TypeError(e);
}, kt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Em(t, i, s), s;
}, cn = (e, t, i) => t.has(e) || lc("Cannot " + i), Bs = (e, t, i) => (cn(e, t, "read from private field"), t.get(e)), Ks = (e, t, i) => t.has(e) ? lc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), cc = (e, t, i, a) => (cn(e, t, "write to private field"), t.set(e, i), i), Ia = (e, t, i) => (cn(e, t, "access private method"), i), ls, ji, Qt, ho, uc, dc;
let $e = class extends F {
  constructor() {
    super(), Ks(this, Qt), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._loaded = !1, Ks(this, ls), Ks(this, ji), this.consumeContext(Ae, (e) => {
      cc(this, ls, e), Ia(this, Qt, ho).call(this);
    });
  }
  willUpdate(e) {
    super.willUpdate(e), e.has("item") && Ia(this, Qt, ho).call(this);
  }
  render() {
    if (!this.item) return h;
    const e = this.item.isFolder ? void 0 : this.item.variants ? `${this.item.variants} variant${this.item.variants === "1" ? "" : "s"}` : [this.item.style, this.item.source].filter(Boolean).join(" · ");
    return r`
      <uui-card-media
        name=${this.item.name}
        detail=${Yi(e)}
        href=${Yi(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${Ia(this, Qt, uc)}
        @deselected=${Ia(this, Qt, dc)}>
        ${this.item.sampleFontKey && this._loaded ? r`<div class="specimen" style="font-family: ${va(this.item.sampleFontKey)}, serif">Aa Bb</div>` : r`<umb-icon name=${this.item.icon}></umb-icon>`}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    `;
  }
};
ls = /* @__PURE__ */ new WeakMap();
ji = /* @__PURE__ */ new WeakMap();
Qt = /* @__PURE__ */ new WeakSet();
ho = function() {
  var i;
  const e = (i = this.item) == null ? void 0 : i.sampleFontKey, t = Bs(this, ls);
  !t || !e || Bs(this, ji) === e || (cc(this, ji, e), this._loaded = !1, oc(e, () => t.getLatestToken()).then((a) => {
    Bs(this, ji) === e && (this._loaded = !!a);
  }));
};
uc = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new ul(this.item.unique)));
};
dc = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new dl(this.item.unique)));
};
$e.styles = [
  O`
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
kt([
  f({ type: Object })
], $e.prototype, "item", 2);
kt([
  f({ type: Boolean })
], $e.prototype, "selectable", 2);
kt([
  f({ type: Boolean })
], $e.prototype, "selected", 2);
kt([
  f({ type: Boolean, attribute: "select-only" })
], $e.prototype, "selectOnly", 2);
kt([
  f({ type: Boolean })
], $e.prototype, "disabled", 2);
kt([
  f({ type: String })
], $e.prototype, "href", 2);
kt([
  y()
], $e.prototype, "_loaded", 2);
$e = kt([
  A("di-font-collection-card")
], $e);
const Cm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontCollectionCardElement() {
    return $e;
  },
  get element() {
    return $e;
  }
}, Symbol.toStringTag, { value: "Module" }));
class Es extends ol {
  async execute() {
    var n, l;
    const t = this.args.unique ?? null, i = { mode: this.mode };
    if (this.args.entityType === gt && t) {
      const { data: p } = await E(this, (m) => wp([t], m));
      i.familyKey = t, i.familyName = (n = p == null ? void 0 : p[0]) == null ? void 0 : n.name;
    } else
      i.parentKey = t;
    const a = await Vo(this, Yl, { data: i });
    if (!(a != null && a.uploaded)) return;
    const s = await this.getContext(Y);
    s == null || s.peek("positive", { data: { message: "Font added" } }), (l = a.warnings) != null && l.length && (s == null || s.peek("warning", { data: { headline: "Some variants were not added", message: a.warnings.join(" ") } }));
    const o = await this.getContext(qt);
    o == null || o.dispatchEvent(new Ei({ entityType: this.args.entityType, unique: t })), Jo();
  }
}
class Im extends Es {
  constructor() {
    super(...arguments), this.mode = "upload";
  }
}
class Om extends Es {
  constructor() {
    super(...arguments), this.mode = "web";
  }
}
class Am extends Es {
  constructor() {
    super(...arguments), this.mode = "path";
  }
}
class Pm extends Es {
  constructor() {
    super(...arguments), this.mode = void 0;
  }
}
const Rm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Im
}, Symbol.toStringTag, { value: "Module" })), Mm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Om
}, Symbol.toStringTag, { value: "Module" })), Fm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Am
}, Symbol.toStringTag, { value: "Module" })), Lm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Pm
}, Symbol.toStringTag, { value: "Module" }));
var zm = Object.defineProperty, Um = Object.getOwnPropertyDescriptor, pc = (e) => {
  throw TypeError(e);
}, ba = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Um(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && zm(t, i, s), s;
}, un = (e, t, i) => t.has(e) || pc("Cannot " + i), yt = (e, t, i) => (un(e, t, "read from private field"), t.get(e)), Ai = (e, t, i) => t.has(e) ? pc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), zr = (e, t, i, a) => (un(e, t, "write to private field"), t.set(e, i), i), qe = (e, t, i) => (un(e, t, "access private method"), i), Li, cs, Fa, Vi, Ee, mo, hc, mc, zi, yc;
let He = class extends F {
  constructor() {
    super(), Ai(this, Ee), Ai(this, Li), Ai(this, cs), this._templates = [], this._fonts = [], this._loading = !0, Ai(this, Fa, () => {
      yt(this, Li) && qe(this, Ee, mo).call(this);
    }), Ai(this, Vi, () => {
      var e;
      return (e = yt(this, Li)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Y, (e) => {
      zr(this, cs, e);
    }), this.consumeContext(Ae, (e) => {
      zr(this, Li, e), e && qe(this, Ee, mo).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Qs, yt(this, Fa));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Qs, yt(this, Fa));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${qe(this, Ee, mc).call(this)} ${qe(this, Ee, yc).call(this)}
      </umb-body-layout>
    `;
  }
};
Li = /* @__PURE__ */ new WeakMap();
cs = /* @__PURE__ */ new WeakMap();
Fa = /* @__PURE__ */ new WeakMap();
Vi = /* @__PURE__ */ new WeakMap();
Ee = /* @__PURE__ */ new WeakSet();
mo = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      qd(yt(this, Vi)),
      es(yt(this, Vi)).catch(() => []),
      vl(yt(this, Vi)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    qe(this, Ee, hc).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
hc = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = yt(this, cs)) == null || s.peek(e, { data: { headline: t, message: a } });
};
mc = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${qe(this, Ee, zi).call(this, "Templates", this._templates.length, "icon-brush", !1, Xo(Ye))}
        ${qe(this, Ee, zi).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${qe(this, Ee, zi).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${qe(this, Ee, zi).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
zi = function(e, t, i, a = !1, s) {
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
yc = function() {
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
        <uui-button look="secondary" href=${Fp("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
He.styles = O`
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
ba([
  y()
], He.prototype, "_templates", 2);
ba([
  y()
], He.prototype, "_fonts", 2);
ba([
  y()
], He.prototype, "_health", 2);
ba([
  y()
], He.prototype, "_loading", 2);
He = ba([
  A("di-overview-dashboard")
], He);
const Wm = He, Nm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return He;
  },
  default: Wm
}, Symbol.toStringTag, { value: "Module" }));
var Bm = Object.defineProperty, Km = Object.getOwnPropertyDescriptor, fc = (e) => {
  throw TypeError(e);
}, Ds = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Km(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Bm(t, i, s), s;
}, dn = (e, t, i) => t.has(e) || fc("Cannot " + i), ze = (e, t, i) => (dn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Pi = (e, t, i) => t.has(e) ? fc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), js = (e, t, i, a) => (dn(e, t, "write to private field"), t.set(e, i), i), z = (e, t, i) => (dn(e, t, "access private method"), i), La, ea, ta, Kt, M, gc, Di, _t, yo, vc, bc, za, _c, wc, $c;
function jm(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : Vm(e.sourceUrl);
    default:
      return "Media library";
  }
}
function Vm(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let wt = class extends F {
  constructor() {
    super(), Pi(this, M), Pi(this, La), Pi(this, ea), Pi(this, ta), this._fonts = [], this._loading = !0, Pi(this, Kt, () => {
      var e;
      return (e = ze(this, La)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(zd, (e) => {
      js(this, ea, e);
    }), this.consumeContext(Y, (e) => {
      js(this, ta, e);
    }), this.consumeContext(Ae, (e) => {
      js(this, La, e), e && z(this, M, Di).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${z(this, M, yo)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${z(this, M, yo)}>
                  Add your first font
                </uui-button>
              </div>` : r`${te(this._fonts, (e) => e.key, (e) => z(this, M, _c).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
La = /* @__PURE__ */ new WeakMap();
ea = /* @__PURE__ */ new WeakMap();
ta = /* @__PURE__ */ new WeakMap();
Kt = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
gc = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
Di = async function() {
  this._loading = !0;
  try {
    this._fonts = await es(ze(this, Kt)), await nc(this._fonts.map((e) => e.key), ze(this, Kt));
  } catch (e) {
    z(this, M, _t).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
_t = function(e, t, i) {
  var s;
  const a = i instanceof bt ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = ze(this, ta)) == null || s.peek(e, { data: { headline: t, message: a } });
};
yo = async function() {
  var i, a;
  if (!ze(this, ea)) return;
  const e = ze(this, ea).open(this, Yl, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = ze(this, ta)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await z(this, M, Di).call(this));
};
vc = async function(e) {
  try {
    await yp(e.key, ze(this, Kt)), rc(e.key), z(this, M, _t).call(this, "positive", `'${e.familyName}' refreshed`), await z(this, M, Di).call(this);
  } catch (t) {
    z(this, M, _t).call(this, "danger", "That font could not be refreshed", t);
  }
};
bc = async function(e) {
  await qo(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await gp(e.key, ze(this, Kt)), rc(e.key), z(this, M, _t).call(this, "positive", `'${e.familyName}' deleted`), await z(this, M, Di).call(this);
  } catch (t) {
    z(this, M, _t).call(this, "danger", "That font could not be deleted", t);
  }
};
za = async function(e, t, i, a) {
  try {
    await fp(e.key, t, i, ze(this, Kt), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), z(this, M, _t).call(this, "positive", `'${t}' saved`), await z(this, M, Di).call(this), a != null && a.keepOpen && await z(this, M, gc).call(this);
  } catch (s) {
    z(this, M, _t).call(this, "danger", "The font could not be saved", s);
  }
};
_c = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${jm(e)} · weight ${e.weight}
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
                  @click=${() => z(this, M, vc).call(this, e)}>
                  Refresh
                </uui-button>` : h}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => z(this, M, bc).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${va(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? z(this, M, $c).call(this, e) : z(this, M, wc).call(this, e)}
      </div>
    `;
};
wc = function(e) {
  return e.styles.length === 0 ? h : r`<div class="tags">
      ${te(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
$c = function(e) {
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
          ${te(
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
      t.splice(a, 1), z(this, M, za).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), z(this, M, za).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    z(this, M, za).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
wt.styles = O`
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
Ds([
  y()
], wt.prototype, "_fonts", 2);
Ds([
  y()
], wt.prototype, "_loading", 2);
Ds([
  y()
], wt.prototype, "_editingKey", 2);
wt = Ds([
  A("di-fonts-dashboard")
], wt);
const qm = wt, Gm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return wt;
  },
  default: qm
}, Symbol.toStringTag, { value: "Module" }));
var Ym = Object.defineProperty, Hm = Object.getOwnPropertyDescriptor, xc = (e) => {
  throw TypeError(e);
}, _a = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Hm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ym(t, i, s), s;
}, pn = (e, t, i) => t.has(e) || xc("Cannot " + i), rt = (e, t, i) => (pn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Oa = (e, t, i) => t.has(e) ? xc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ur = (e, t, i, a) => (pn(e, t, "write to private field"), t.set(e, i), i), oi = (e, t, i) => (pn(e, t, "access private method"), i), Ua, ni, ki, ft, us, fo, kc;
let Xe = class extends F {
  constructor() {
    super(), Oa(this, ft), Oa(this, Ua), Oa(this, ni), this._loading = !0, this._busy = !1, Oa(this, ki, () => {
      var e;
      return (e = rt(this, Ua)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Y, (e) => {
      Ur(this, ni, e);
    }), this.consumeContext(Ae, (e) => {
      Ur(this, Ua, e), e && oi(this, ft, us).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => oi(this, ft, us).call(this)}>Re-check</uui-button>
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
                        ${a.templateKey ? r`<a href=${Ho(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${oi(this, ft, kc).call(this)}
      </umb-body-layout>
    `;
  }
};
Ua = /* @__PURE__ */ new WeakMap();
ni = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakMap();
ft = /* @__PURE__ */ new WeakSet();
us = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      vl(rt(this, ki)),
      Ap(rt(this, ki)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
fo = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await Pp(rt(this, ki)) : await Rp(rt(this, ki));
    (t = rt(this, ni)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = rt(this, ni)) == null || i.peek("warning", { data: { message: o } });
    await oi(this, ft, us).call(this);
  } catch (s) {
    (a = rt(this, ni)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
kc = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => oi(this, ft, fo).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => oi(this, ft, fo).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : h;
};
Xe.styles = O`
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
_a([
  y()
], Xe.prototype, "_health", 2);
_a([
  y()
], Xe.prototype, "_sync", 2);
_a([
  y()
], Xe.prototype, "_loading", 2);
_a([
  y()
], Xe.prototype, "_busy", 2);
Xe = _a([
  A("di-health-dashboard")
], Xe);
const Xm = Xe, Jm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Xe;
  },
  default: Xm
}, Symbol.toStringTag, { value: "Module" })), Tc = 3, Sc = 12, Ec = 0.1, Dc = 0.9;
function Zm(e) {
  return Math.max(Tc, Math.min(Sc, e));
}
function Qm(e) {
  return Math.max(Ec, Math.min(Dc, e));
}
function ey(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Zm(t), s = 0.5 * Qm(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let p = 0; p < o; p++) {
    const m = (-90 + p * n) * Math.PI / 180, S = e === "star" && p % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + S * Math.cos(m), y: 0.5 + S * Math.sin(m) });
  }
  return l;
}
function ty(e, t, i) {
  const a = ey(e, t, i);
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
  sides: { min: Tc, max: Sc },
  innerRatio: { min: Ec, max: Dc }
}, ds = { min: 0.1, max: 4 };
function iy(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function hn(e) {
  const t = e.kind ?? "linear", i = Math.round(go(e.centreX ?? 0.5) * 100), a = Math.round(go(e.centreY ?? 0.5) * 100);
  switch (t) {
    case "radial":
      return `radial-gradient(${e.shape ?? "ellipse"} ${sy(e.extent)} at ${i}% ${a}%, ${Vs(e)})`;
    case "angular":
      return `conic-gradient(from ${e.angle}deg at ${i}% ${a}%, ${Vs(e)})`;
    case "reflected":
      return `linear-gradient(${e.angle}deg, ${vo(oy($t(e)))})`;
    case "diamond": {
      const s = vo($t(e).map((o) => ({ ...o, position: o.position / 2 })));
      return [
        `linear-gradient(to top left, ${s}) left top / ${i}% ${a}% no-repeat`,
        `linear-gradient(to top right, ${s}) right top / ${100 - i}% ${a}% no-repeat`,
        `linear-gradient(to bottom left, ${s}) left bottom / ${i}% ${100 - a}% no-repeat`,
        `linear-gradient(to bottom right, ${s}) right bottom / ${100 - i}% ${100 - a}% no-repeat`
      ].join(", ");
    }
    default:
      return `linear-gradient(${e.angle}deg, ${Vs(e)})`;
  }
}
function go(e) {
  return Math.min(1, Math.max(0, e));
}
const ay = {
  farthestCorner: "farthest-corner",
  farthestSide: "farthest-side",
  closestCorner: "closest-corner",
  closestSide: "closest-side"
};
function sy(e) {
  return ay[e ?? "farthestCorner"] ?? "farthest-corner";
}
function $t(e) {
  const t = e.stops;
  return !t || t.length < 2 ? [{ colour: e.from, position: 0 }, { colour: e.to, position: 1 }] : t.map((i, a) => ({ stop: { colour: i.colour, position: go(i.position) }, index: a })).sort((i, a) => i.stop.position - a.stop.position || i.index - a.index).map(({ stop: i }) => i);
}
function oy(e) {
  return [
    ...[...e].reverse().map((t) => ({ colour: t.colour, position: 0.5 - t.position / 2 })),
    ...e.map((t) => ({ colour: t.colour, position: 0.5 + t.position / 2 }))
  ];
}
function Vs(e) {
  const t = e.stops;
  return t && t.length >= 2 ? vo($t(e)) : `${e.from}, ${e.to}`;
}
function vo(e) {
  return e.map((t) => `${t.colour} ${mn(t.position * 100)}%`).join(", ");
}
const mn = (e) => Math.round(e * 100) / 100;
function ia(e, t) {
  const i = $t({ ...e, stops: t });
  return { ...e, stops: t, from: i[0].colour, to: i[i.length - 1].colour };
}
function ny(e) {
  const t = [...$t(e)].reverse().map((i) => ({ colour: i.colour, position: mn(1 - i.position) }));
  return ia(e, t);
}
function ry(e) {
  const t = $t(e);
  let i = 0;
  for (let n = 1; n < t.length; n++)
    t[n].position - t[n - 1].position > t[i + 1].position - t[i].position && (i = n - 1);
  const a = t[i], s = t[i + 1], o = mn((a.position + s.position) / 2);
  return ia(e, [...t, { colour: cy(a.colour, s.colour, 0.5), position: o }]);
}
function ly(e, t) {
  const i = $t(e);
  return i.length <= 2 ? e : ia(e, i.filter((a, s) => s !== t));
}
function cy(e, t, i) {
  const a = Wr(e), s = Wr(t);
  if (!a || !s) return e;
  const o = (p) => Math.round(a[p] + (s[p] - a[p]) * i).toString(16).padStart(2, "0").toUpperCase(), n = `#${o(0)}${o(1)}${o(2)}`, l = o(3);
  return l === "FF" ? n : `${n}${l}`;
}
function Wr(e) {
  const t = (e ?? "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t) || ![3, 4, 6, 8].includes(t.length)) return;
  const i = t.length <= 4 ? [...t].map((s) => s + s).join("") : t, a = (s) => parseInt(i.slice(s * 2, s * 2 + 2), 16);
  return [a(0), a(1), a(2), i.length === 8 ? a(3) : 255];
}
const yn = O`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function uy(e, t) {
  const i = [], a = t.lockX ? void 0 : Nr(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    dy(t),
    t.threshold
  ), s = t.lockY ? void 0 : Nr(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    py(t),
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
function dy(e) {
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
function py(e) {
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
function Nr(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var hy = Object.defineProperty, my = Object.getOwnPropertyDescriptor, Cc = (e) => {
  throw TypeError(e);
}, tt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? my(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && hy(t, i, s), s;
}, fn = (e, t, i) => t.has(e) || Cc("Cannot " + i), Te = (e, t, i) => (fn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), qs = (e, t, i) => t.has(e) ? Cc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gs = (e, t, i, a) => (fn(e, t, "write to private field"), t.set(e, i), i), G = (e, t, i) => (fn(e, t, "access private method"), i), Et, Ui, R, Cs, gn, Ic, Oc, Ac, Pc, vn, ps, Rc, Mc, Fc, Lc, zc, Uc, Wc, Nc, Bc;
const yy = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], Ys = 18;
let Ce = class extends F {
  constructor() {
    super(...arguments), qs(this, R), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, qs(this, Et), qs(this, Ui);
  }
  willUpdate() {
    this._box = G(this, R, Ic).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== Te(this, Ui) && ((t = Te(this, Et)) == null || t.disconnect(), Gs(this, Ui, e), e && (Te(this, Et) ?? Gs(this, Et, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), Te(this, Et).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Te(this, Et)) == null || e.disconnect(), Gs(this, Ui, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return h;
    const e = this._box;
    return r`
      <div
        class=${tl({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${B({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...Te(this, R, Oc) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...G(this, R, vn).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      G(this, R, Rc).call(this, t), G(this, R, ps).call(this, t);
    }}>
        ${G(this, R, Mc).call(this)}
      </div>

      ${this.selected ? G(this, R, Nc).call(this, e) : h}
      ${this.showMeasured && this.measured ? G(this, R, Bc).call(this) : h}
    `;
  }
};
Et = /* @__PURE__ */ new WeakMap();
Ui = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakSet();
Cs = function() {
  return this.resolvedPosition ?? this.layer.position;
};
gn = function() {
  return this.layer.rotation ?? 0;
};
Ic = function() {
  var s;
  const e = this.layer, t = e.size.width ?? G(this, R, Ac).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? G(this, R, Pc).call(this), a = Ss(Te(this, R, Cs), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
Oc = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
Ac = function() {
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
Pc = function() {
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
vn = function(e) {
  const t = Te(this, R, gn);
  if (t === 0) return {};
  const i = Te(this, R, Cs);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
ps = function(e, t) {
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
Rc = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Mc = function() {
  switch (this.layer.type) {
    case "text":
      return G(this, R, Fc).call(this);
    case "image":
      return G(this, R, zc).call(this);
    case "badges":
      return G(this, R, Uc).call(this);
    default:
      return G(this, R, Wc).call(this);
  }
};
Fc = function() {
  if (this.layer.type !== "text") return h;
  const e = this.layer.style, t = this.resolvedText || G(this, R, Lc).call(this);
  return r`
      <div
        class="text"
        style=${B({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${va(e.fontKey)}, sans-serif`,
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
Lc = function() {
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
zc = function() {
  if (this.layer.type !== "image") return h;
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
Uc = function() {
  if (this.layer.type !== "badges") return h;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", p = l && o, m = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${B({
    flexDirection: l ? "row" : "column",
    flexWrap: p ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...p ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${te(
    Array.from({ length: Math.max(1, a) }, (S, T) => T),
    (S) => S,
    () => r`
            <div class=${tl({ badge: !0, right: m === "right" })}>
              <div
                class="circle"
                style=${B({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${m === "none" ? h : r`<div
                    class="badge-label"
                    style=${B({
      ...m === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${va(t.fontKey)}, sans-serif`,
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
Wc = function() {
  if (this.layer.type !== "rect") return h;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? hn(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
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
  const n = ty(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${B({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${B({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
Nc = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = Te(this, R, Cs), n = Te(this, R, gn), l = Ue(this.layer.position, "x") || Ue(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${B({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...G(this, R, vn).call(this, e) })}>
        <span
          class="tag"
          style=${B(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : h}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? h : r`
              ${te(
    yy,
    (p) => p,
    (p) => r`
                  <span
                    class="handle ${p}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${p}"
                    @pointerdown=${(m) => G(this, R, ps).call(this, m, p)}>
                  </span>
                `
  )}
              <span class="stalk" style=${B({ height: `${Ys}px`, top: `${-Ys}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${B({ top: `${-Ys}px` })}
                @pointerdown=${(p) => G(this, R, ps).call(this, p, "rotate")}>
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
Bc = function() {
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
Ce.styles = O`
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
tt([
  f({ type: Object })
], Ce.prototype, "layer", 2);
tt([
  f({ type: Number })
], Ce.prototype, "scale", 2);
tt([
  f({ type: Boolean, reflect: !0 })
], Ce.prototype, "selected", 2);
tt([
  f({ type: Object })
], Ce.prototype, "measured", 2);
tt([
  f({ type: Boolean })
], Ce.prototype, "showMeasured", 2);
tt([
  f({ type: String })
], Ce.prototype, "resolvedText", 2);
tt([
  f({ attribute: !1 })
], Ce.prototype, "resolvedPosition", 2);
tt([
  y()
], Ce.prototype, "_box", 2);
Ce = tt([
  A("di-layer-box")
], Ce);
var fy = Object.defineProperty, gy = Object.getOwnPropertyDescriptor, Kc = (e) => {
  throw TypeError(e);
}, bn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && fy(t, i, s), s;
}, vy = (e, t, i) => t.has(e) || Kc("Cannot " + i), by = (e, t, i) => t.has(e) ? Kc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _y = (e, t, i) => (vy(e, t, "access private method"), i), bo, jc;
let aa = class extends F {
  constructor() {
    super(...arguments), by(this, bo), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${te(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => _y(this, bo, jc).call(this, e)
    )}`;
  }
};
bo = /* @__PURE__ */ new WeakSet();
jc = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
aa.styles = O`
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
bn([
  f({ type: Array })
], aa.prototype, "guides", 2);
bn([
  f({ type: Number })
], aa.prototype, "scale", 2);
aa = bn([
  A("di-guides")
], aa);
var wy = Object.defineProperty, $y = Object.getOwnPropertyDescriptor, Vc = (e) => {
  throw TypeError(e);
}, wa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $y(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && wy(t, i, s), s;
}, xy = (e, t, i) => t.has(e) || Vc("Cannot " + i), ky = (e, t, i) => t.has(e) ? Vc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Br = (e, t, i) => (xy(e, t, "access private method"), i), Wa, _o;
let J = class extends F {
  constructor() {
    super(...arguments), ky(this, Wa), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Br(this, Wa, _o).call(this, "top"), Br(this, Wa, _o).call(this, "left");
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
Wa = /* @__PURE__ */ new WeakSet();
_o = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : J.thickness) * o, t.height = (e === "top" ? J.thickness : s) * o, t.style.width = `${e === "top" ? s : J.thickness}px`, t.style.height = `${e === "top" ? J.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const p = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, S = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(p, J.thickness - S), i.lineTo(p, J.thickness)) : (i.moveTo(J.thickness - S, p), i.lineTo(J.thickness, p)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), p + 2, 9) : (i.save(), i.translate(9, p - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
J.thickness = 20;
J.styles = O`
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
wa([
  f({ type: Number })
], J.prototype, "canvasWidth", 2);
wa([
  f({ type: Number })
], J.prototype, "canvasHeight", 2);
wa([
  f({ type: Number })
], J.prototype, "scale", 2);
wa([
  f({ type: Object })
], J.prototype, "pointer", 2);
J = wa([
  A("di-rulers")
], J);
var Ty = Object.defineProperty, Sy = Object.getOwnPropertyDescriptor, qc = (e) => {
  throw TypeError(e);
}, ce = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Sy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ty(t, i, s), s;
}, _n = (e, t, i) => t.has(e) || qc("Cannot " + i), L = (e, t, i) => (_n(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ue = (e, t, i) => t.has(e) ? qc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Na = (e, t, i, a) => (_n(e, t, "write to private field"), t.set(e, i), i), P = (e, t, i) => (_n(e, t, "access private method"), i), Dt, Wi, vt, I, wn, wo, $o, Is, $n, xo, Gc, Yc, xn, Hc, Xc, ko, Ba, Jc, Zc, ei, kn, To, So, Eo, Qc, Do, Co, Io, eu;
const Ey = 6, tu = 20, Dy = 2, Cy = 15, Iy = 0.1;
let ee = class extends F {
  constructor() {
    super(...arguments), ue(this, I), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ue(this, Dt), ue(this, Wi), ue(this, vt, /* @__PURE__ */ new Map()), ue(this, ko, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = P(this, I, $n).call(this, t), a = P(this, I, xo).call(this, t), s = P(this, I, Gc).call(this, t), o = P(this, I, Is).call(this, e.detail.startX, e.detail.startY);
      Na(this, Dt, {
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
    }), ue(this, Ba, (e) => {
      var Ii, oe;
      this._pointer = P(this, I, $o).call(this, e.clientX, e.clientY);
      const t = L(this, Dt);
      if (!t) return;
      const i = this.template.layers.find((xe) => xe.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        P(this, I, Zc).call(this, i, t, e);
        return;
      }
      const o = Ue(i.position, "x"), n = Ue(i.position, "y"), l = t.startRotation, p = e.shiftKey || i.type === "rect" && i.lockAspect === !0;
      if (t.handle && l !== 0) {
        P(this, I, Jc).call(this, i, t, t.handle, a, s, p, o, n);
        return;
      }
      let m = t.handle ? P(this, I, kn).call(this, t.startBox, t.handle, a, s, p) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (m = { ...m, x: t.startBox.x, width: (Ii = t.handle) != null && Ii.includes("w") ? t.startBox.width : m.width }), n && (m = { ...m, y: t.startBox.y, height: (oe = t.handle) != null && oe.includes("n") ? t.startBox.height : m.height });
      const S = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, T = l !== 0 ? { x: m.x + S.x, y: m.y + S.y, width: t.startExtent.width, height: t.startExtent.height } : m, se = this.snapEnabled && !e.altKey ? uy(T, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((xe) => xe.key !== i.key).map((xe) => P(this, I, xo).call(this, xe)),
        threshold: Ey / this.scale,
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
      this._guides = se.guides;
      const ge = l !== 0 ? { ...m, x: se.box.x - S.x, y: se.box.y - S.y } : se.box, ve = jp(ge, i.position);
      o && (ve.x = i.position.x), n && (ve.y = i.position.y);
      const Yt = { position: ve };
      t.handle && (Yt.size = {
        width: Math.max(1, Math.round(ge.width)),
        height: Math.max(1, Math.round(ge.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Yt } })
      );
    }), ue(this, ei, () => {
      if (!L(this, Dt)) return;
      const e = L(this, Dt).moved;
      Na(this, Dt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ue(this, To, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ue(this, So, () => {
      this._dropTarget = !1;
    }), ue(this, Eo, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = P(this, I, $o).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: P(this, I, Qc).call(this, e) }
        })
      );
    }), ue(this, Do, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ue(this, Co, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Sl(t.position)) && this.requestUpdate();
    }), ue(this, Io, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), Na(this, Wi, new ResizeObserver(() => P(this, I, wo).call(this))), L(this, Wi).observe(this), window.addEventListener("pointermove", L(this, Ba)), window.addEventListener("pointerup", L(this, ei)), window.addEventListener("pointercancel", L(this, ei));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = L(this, Wi)) == null || e.disconnect(), window.removeEventListener("pointermove", L(this, Ba)), window.removeEventListener("pointerup", L(this, ei)), window.removeEventListener("pointercancel", L(this, ei));
  }
  updated(e) {
    P(this, I, wo).call(this), e.has("zoom") && P(this, I, wn).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = L(this, vt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return h;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    P(this, I, Yc).call(this);
    const s = this.showRulers ? tu : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${L(this, Do)}
        @dragover=${L(this, To)}
        @dragleave=${L(this, So)}
        @drop=${L(this, Eo)}
        @di-layer-drag-start=${L(this, ko)}
        @di-layer-box-resize=${L(this, Co)}>
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
              </di-rulers>` : h}

          <div
            class="stage"
            style=${B({
      background: e.backgroundGradient ? hn(e.backgroundGradient) : e.background
    })}
            @pointerdown=${L(this, Io)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${B({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : h}

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
                  .resolvedPosition=${(l = L(this, vt).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? P(this, I, eu).call(this) : h}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
Dt = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
vt = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakSet();
wn = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
wo = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? tu : 0) + Dy, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, P(this, I, wn).call(this));
};
$o = function(e, t) {
  const i = P(this, I, Is).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Is = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
$n = function(e) {
  const t = L(this, vt).get(e.key);
  if (t) return t.box;
  const i = P(this, I, xn).call(this, e), a = Ss(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
xo = function(e) {
  const t = L(this, vt).get(e.key);
  return t ? t.extent : Tl(P(this, I, $n).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Gc = function(e) {
  var t;
  return ((t = L(this, vt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Yc = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  Na(this, vt, Xp(
    this.template.layers,
    (i) => P(this, I, xn).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
xn = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? P(this, I, Hc).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? P(this, I, Xc).call(this, e, i)
  };
};
Hc = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Xc = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
ko = /* @__PURE__ */ new WeakMap();
Ba = /* @__PURE__ */ new WeakMap();
Jc = function(e, t, i, a, s, o, n, l) {
  const p = t.startRotation, m = t.startPosition, S = Vp(a, s, 0, 0, p);
  let T = P(this, I, kn).call(this, t.startBox, i, S.x, S.y, o);
  n && (T = { ...T, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : T.width }), l && (T = { ...T, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : T.height });
  const q = Math.max(1, Math.round(T.width)), se = Math.max(1, Math.round(T.height)), ge = Zo(T.x, T.y, q, se, m.anchor), ve = ti(ge.x, ge.y, m.x, m.y, p), Yt = {
    ...e.position,
    x: n ? e.position.x : Math.round(ve.x),
    y: l ? e.position.y : Math.round(ve.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Yt, size: { width: q, height: se } } }
    })
  );
};
Zc = function(e, t, i) {
  const a = t.startPosition, s = P(this, I, Is).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, p = i.shiftKey ? Cy : Iy, m = kl(Math.round(l / p) * p);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
ei = /* @__PURE__ */ new WeakMap();
kn = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: p } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, p = e.height - a), t.includes("s") && (p = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(p - e.height) ? p = l / m : l = p * m, t.includes("n") && (n = e.y + e.height - p), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, p) };
};
To = /* @__PURE__ */ new WeakMap();
So = /* @__PURE__ */ new WeakMap();
Eo = /* @__PURE__ */ new WeakMap();
Qc = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Do = /* @__PURE__ */ new WeakMap();
Co = /* @__PURE__ */ new WeakMap();
Io = /* @__PURE__ */ new WeakMap();
eu = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${B({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
ee.styles = O`
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
      ${yn}
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
ce([
  f({ type: Object })
], ee.prototype, "template", 2);
ce([
  f({ type: String })
], ee.prototype, "selectedLayerKey", 2);
ce([
  f({ type: Object })
], ee.prototype, "baseImageUrl", 2);
ce([
  f({ type: Array })
], ee.prototype, "serverBounds", 2);
ce([
  f({ type: Boolean })
], ee.prototype, "showMeasured", 2);
ce([
  f({ type: Boolean })
], ee.prototype, "snapEnabled", 2);
ce([
  f({ type: Boolean })
], ee.prototype, "showRulers", 2);
ce([
  f({ type: Boolean })
], ee.prototype, "showSafeArea", 2);
ce([
  f({ type: Number })
], ee.prototype, "zoom", 2);
ce([
  y()
], ee.prototype, "_fitScale", 2);
ce([
  y()
], ee.prototype, "_guides", 2);
ce([
  y()
], ee.prototype, "_pointer", 2);
ce([
  y()
], ee.prototype, "_dropTarget", 2);
ee = ce([
  A("di-designer-canvas")
], ee);
var Oy = Object.defineProperty, Ay = Object.getOwnPropertyDescriptor, iu = (e) => {
  throw TypeError(e);
}, Tn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ay(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Oy(t, i, s), s;
}, au = (e, t, i) => t.has(e) || iu("Cannot " + i), Py = (e, t, i) => (au(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ry = (e, t, i) => t.has(e) ? iu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), we = (e, t, i) => (au(e, t, "access private method"), i), ae, su, Sn, En, ou, nu, ru, lu, qi;
const Kr = {
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
let sa = class extends F {
  constructor() {
    super(...arguments), Ry(this, ae), this.properties = [], this._search = "";
  }
  render() {
    const e = My(Py(this, ae, su));
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

        ${we(this, ae, nu).call(this)}

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : te(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => we(this, ae, ou).call(this, t, i)
    )}
      </div>
    `;
  }
};
ae = /* @__PURE__ */ new WeakSet();
su = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Sn = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
En = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
ou = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${te(
    t,
    (i) => i.alias,
    (i) => we(this, ae, qi).call(
      this,
      i.name,
      Kr[i.classification] ?? Kr.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
nu = function() {
  return r`
      <div class="group">
        <h5>Elements</h5>
        ${we(this, ae, qi).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${we(this, ae, qi).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${we(this, ae, qi).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${we(this, ae, ru).call(this)}
      </div>
    `;
};
ru = function() {
  const e = { kind: "static", layerType: "rect", preset: "rectangle" };
  return r`
      <div
        class="chip other shape"
        draggable="true"
        title="Shape"
        @dragstart=${(t) => we(this, ae, En).call(this, t, e)}>
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
          ${Lp.map((t) => r`
            <uui-menu-item
              label=${Hi[t].label}
              data-preset=${t}
              @click-label=${() => we(this, ae, lu).call(this, t)}>
              <uui-icon slot="icon" name=${Hi[t].icon}></uui-icon>
            </uui-menu-item>
          `)}
        </div>
      </uui-popover-container>
    `;
};
lu = function(e) {
  var t, i, a;
  (a = (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#shape-menu")) == null ? void 0 : i.hidePopover) == null || a.call(i), we(this, ae, Sn).call(this, { kind: "static", layerType: "rect", preset: e });
};
qi = function(e, t, i, a, s) {
  const o = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(n) => we(this, ae, En).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => we(this, ae, Sn).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
sa.styles = O`
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
Tn([
  f({ type: Array })
], sa.prototype, "properties", 2);
Tn([
  y()
], sa.prototype, "_search", 2);
sa = Tn([
  A("di-property-palette")
], sa);
function My(e) {
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
function Fy(e) {
  return e.backgroundGradient ? "gradient" : Ly(e.background) ? "transparent" : "colour";
}
function Ly(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function zy(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var Uy = Object.defineProperty, Wy = Object.getOwnPropertyDescriptor, cu = (e) => {
  throw TypeError(e);
}, Dn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Wy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Uy(t, i, s), s;
}, Ny = (e, t, i) => t.has(e) || cu("Cannot " + i), By = (e, t, i) => t.has(e) ? cu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), jr = (e, t, i) => (Ny(e, t, "access private method"), i), Ka, Oo;
let oa = class extends F {
  constructor() {
    super(...arguments), By(this, Ka), this.value = "#FFFFFF", this.label = "Colour";
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
          @change=${jr(this, Ka, Oo)}></uui-color-picker>
        <uui-input
          label="${this.label} (hex)"
          spellcheck="false"
          .value=${this.value}
          @change=${jr(this, Ka, Oo)}></uui-input>
      </div>
    `;
  }
};
Ka = /* @__PURE__ */ new WeakSet();
Oo = function(e) {
  e.stopPropagation();
  const t = Vr(e.target.value);
  !t || t === Vr(this.value) || (this.value = t, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: t } })));
};
oa.styles = O`
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
Dn([
  f({ type: String })
], oa.prototype, "value", 2);
Dn([
  f({ type: String })
], oa.prototype, "label", 2);
oa = Dn([
  A("di-colour-input")
], oa);
function Vr(e) {
  const t = (e ?? "").trim(), i = t.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(i) || ![3, 4, 6, 8].includes(i.length)) return t;
  const s = (i.length <= 4 ? [...i].map((o) => o + o).join("") : i).toUpperCase();
  return s.length === 8 && s.endsWith("FF") ? `#${s.slice(0, 6)}` : `#${s}`;
}
var Ky = Object.defineProperty, jy = Object.getOwnPropertyDescriptor, uu = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? jy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ky(t, i, s), s;
};
const qr = {
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
let hs = class extends F {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${te(
      xl,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${qr[e]}
              title=${qr[e]}
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
hs.styles = O`
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
uu([
  f({ type: String })
], hs.prototype, "value", 2);
hs = uu([
  A("di-anchor-picker")
], hs);
var Vy = Object.defineProperty, qy = Object.getOwnPropertyDescriptor, du = (e) => {
  throw TypeError(e);
}, it = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Vy(t, i, s), s;
}, Gy = (e, t, i) => t.has(e) || du("Cannot " + i), Yy = (e, t, i) => t.has(e) ? du("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Hy = (e, t, i) => (Gy(e, t, "access private method"), i), Ao, pu;
let Ie = class extends F {
  constructor() {
    super(...arguments), Yy(this, Ao), this.label = "", this.suffix = "px", this.step = 1, this.compact = !1, this.placeholder = "Auto";
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
          @change=${Hy(this, Ao, pu)} />
        ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : h}
      </span>
    `;
    return this.label ? this.compact ? r`<label class="compact-field"><span class="compact-label">${this.label}</span>${e}</label>` : r`<umb-property-layout orientation="vertical" label=${this.label}>${e}</umb-property-layout>` : e;
  }
};
Ao = /* @__PURE__ */ new WeakSet();
pu = function(e) {
  const t = e.target, i = t.value, a = iy(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Ie.styles = O`
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
it([
  f({ type: Number })
], Ie.prototype, "value", 2);
it([
  f({ type: String })
], Ie.prototype, "label", 2);
it([
  f({ type: String })
], Ie.prototype, "suffix", 2);
it([
  f({ type: Number })
], Ie.prototype, "step", 2);
it([
  f({ type: Number })
], Ie.prototype, "min", 2);
it([
  f({ type: Number })
], Ie.prototype, "max", 2);
it([
  f({ type: Boolean, reflect: !0 })
], Ie.prototype, "compact", 2);
it([
  f({ type: String })
], Ie.prototype, "placeholder", 2);
Ie = it([
  A("di-number-field")
], Ie);
var Xy = Object.defineProperty, Jy = Object.getOwnPropertyDescriptor, hu = (e) => {
  throw TypeError(e);
}, Gt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jy(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Xy(t, i, s), s;
}, Zy = (e, t, i) => t.has(e) || hu("Cannot " + i), Qy = (e, t, i) => t.has(e) ? hu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), u = (e, t, i) => (Zy(e, t, "access private method"), i), c, b, be, mu, yu, fu, Cn, gu, vu, bu, Po, _u, wu, $u, xu, ku, Tu, Ro, Su, Eu, Mo, Du, ja, Cu, Iu, In, We, Ci, Ou, On, Au;
const ef = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let Je = class extends F {
  constructor() {
    super(...arguments), Qy(this, c), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? u(this, c, _u).call(this, this.layer) : u(this, c, mu).call(this)}</div>` : h;
  }
};
c = /* @__PURE__ */ new WeakSet();
b = function(e) {
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
mu = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="stack">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => u(this, c, be).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => u(this, c, be).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${u(this, c, yu).call(this, e)}

        <umb-property-layout orientation="vertical" label="Base image">

          <div slot="editor" class="editor">
          <uui-select
            label="Base image source"
            .value=${e.baseImage.kind}
            .options=${Pu(e.baseImage.kind)}
            @change=${(t) => u(this, c, be).call(this, {
    baseImage: { ...e.baseImage, kind: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.baseImage.kind === "media" ? u(this, c, We).call(this, "Media item", u(this, c, In).call(this, e.baseImage.mediaKey, (t) => u(this, c, be).call(this, { baseImage: { ...e.baseImage, kind: "media", mediaKey: t } }))) : h}

        ${e.baseImage.kind === "path" ? r`<umb-property-layout orientation="vertical" label="Path">

              <div slot="editor" class="editor">
              <uui-input
                .value=${e.baseImage.path ?? ""}
                placeholder="/assets/og-background.png"
                @change=${(t) => u(this, c, be).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : h}

        ${e.baseImage.kind === "property" ? r`<umb-property-layout orientation="vertical" label="From property">

              <div slot="editor" class="editor">
              ${u(this, c, Ci).call(this, e.baseImage.propertyAlias ?? "", (t) => u(this, c, be).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.baseImageFit}
            .options=${j(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => u(this, c, be).call(this, { baseImageFit: t.target.value })}>
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
yu = function(e) {
  const t = Fy(e);
  return r`
      <umb-property-layout orientation="vertical" label="Fill">

        <div slot="editor" class="editor">
        <uui-select
          .value=${t}
          .options=${j(["colour", "gradient", "transparent"], t)}
          @change=${(i) => u(this, c, fu).call(this, e, i.target.value)}>
        </uui-select>
      </div>

      </umb-property-layout>

      ${t === "colour" ? r`<umb-property-layout orientation="vertical" label="Colour">

            <div slot="editor" class="editor">
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => u(this, c, be).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </div>

          </umb-property-layout>` : h}

      ${t === "gradient" && e.backgroundGradient ? u(this, c, Cn).call(this, e.backgroundGradient, (i) => u(this, c, be).call(this, { backgroundGradient: i })) : h}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : h}
    `;
};
fu = function(e, t) {
  if (t === "gradient") {
    u(this, c, be).call(this, { backgroundGradient: e.backgroundGradient ?? $l() });
    return;
  }
  u(this, c, be).call(this, {
    background: zy(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
Cn = function(e, t) {
  const i = e.kind ?? "linear", a = i === "linear" || i === "reflected" || i === "angular", s = i === "radial" || i === "angular" || i === "diamond";
  return r`
      ${u(this, c, We).call(this, "Gradient type", r`
        <uui-select
          label="Gradient type"
          .value=${i}
          .options=${j(["linear", "radial", "angular", "diamond", "reflected"], i, tf)}
          @change=${(o) => t({ ...e, kind: o.target.value })}>
        </uui-select>
      `)}

      <div class="gradient-preview" role="img" aria-label="The gradient" style="background: ${hn(e)}"></div>

      ${a ? u(this, c, gu).call(this, e, t) : h}
      ${i === "radial" ? u(this, c, vu).call(this, e, t) : h}
      ${s ? r`
            ${u(this, c, Po).call(this, "Centre X", e.centreX, (o) => t({ ...e, centreX: o }))}
            ${u(this, c, Po).call(this, "Centre Y", e.centreY, (o) => t({ ...e, centreY: o }))}
          ` : h}

      ${u(this, c, bu).call(this, e, t)}
    `;
};
gu = function(e, t) {
  const i = Math.round(e.angle ?? 180) % 360, a = (s) => t({ ...e, angle: (Math.round(s) % 360 + 360) % 360 });
  return u(this, c, We).call(this, e.kind === "angular" ? "Start angle" : "Angle", r`
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
          .min=${g.gradientAngle.min}
          .max=${g.gradientAngle.max}
          .value=${i}
          @change=${(s) => a(s.detail.value ?? 180)}>
        </di-number-field>
        <uui-button-group>
          ${sf.map(([s, o, n]) => r`
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
vu = function(e, t) {
  const i = e.shape ?? "ellipse", a = e.extent ?? "farthestCorner";
  return r`
      ${u(this, c, We).call(this, "Shape", r`
        <uui-select
          label="Radial shape"
          .value=${i}
          .options=${j(["ellipse", "circle"], i)}
          @change=${(s) => t({ ...e, shape: s.target.value })}>
        </uui-select>
      `)}
      ${u(this, c, We).call(this, "Size", r`
        <uui-select
          label="Radial size"
          .value=${a}
          .options=${j(["farthestCorner", "farthestSide", "closestCorner", "closestSide"], a, af)}
          @change=${(s) => t({ ...e, extent: s.target.value })}>
        </uui-select>
      `, "Where the last colour lands.")}
    `;
};
bu = function(e, t) {
  const i = $t(e);
  return u(this, c, We).call(this, "Colour stops", r`
      <div class="stops">
        ${i.map((a, s) => r`
          <div class="stop">
            <di-colour-input
              label="Stop ${s + 1} colour"
              .value=${a.colour}
              @change=${(o) => t(ia(e, i.map((n, l) => l === s ? { ...n, colour: o.detail.value } : n)))}>
            </di-colour-input>
            <div class="stop-position">
              <di-number-field
                label="Position"
                suffix="%"
                .min=${0}
                .max=${100}
                .value=${Math.round(a.position * 100)}
                @change=${(o) => t(ia(e, i.map((n, l) => l === s ? { ...n, position: (o.detail.value ?? 0) / 100 } : n)))}>
              </di-number-field>
              <uui-button
                compact
                look="secondary"
                color="danger"
                label="Remove stop ${s + 1}"
                ?disabled=${i.length <= 2}
                @click=${() => t(ly(e, s))}>
                <uui-icon name="icon-trash"></uui-icon>
              </uui-button>
            </div>
          </div>
        `)}
        <div class="stop-actions">
          <uui-button look="secondary" label="Add stop" @click=${() => t(ry(e))}>
            <uui-icon name="icon-add"></uui-icon> Add stop
          </uui-button>
          <uui-button look="secondary" label="Reverse the gradient" @click=${() => t(ny(e))}>
            <uui-icon name="icon-sync"></uui-icon> Reverse
          </uui-button>
        </div>
      </div>
    `);
};
Po = function(e, t, i) {
  return r`<di-number-field
      .min=${g.gradientCentre.min * 100}
      .max=${g.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
_u = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => u(this, c, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? u(this, c, wu).call(this, e) : h}
      ${e.type === "text" ? u(this, c, $u).call(this, e) : h}
      ${e.type === "image" ? u(this, c, xu).call(this, e) : h}
      ${e.type === "badges" ? u(this, c, ku).call(this, e) : h}
      ${e.type === "rect" ? u(this, c, Su).call(this, e) : h}
      ${u(this, c, Eu).call(this, e)} ${u(this, c, Iu).call(this, e)}
    `;
};
wu = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${j(
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
            @change=${(i) => u(this, c, b).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? u(this, c, We).call(this, "Property", u(this, c, Ci).call(this, t.propertyAlias ?? "", (i) => u(this, c, b).call(this, { binding: { ...t, propertyAlias: i } }))) : h}

        ${t.kind === "date" ? r`<umb-property-layout orientation="vertical" label="Date format">

              <div slot="editor" class="editor">
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => u(this, c, b).call(this, {
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
                @change=${(i) => u(this, c, b).call(this, {
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
              @change=${(i) => u(this, c, b).call(this, { prefix: i.target.value })}>
            </uui-input>
          </div>

          </umb-property-layout>
          <umb-property-layout orientation="vertical" label="Suffix">

            <div slot="editor" class="editor">
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => u(this, c, b).call(this, { suffix: i.target.value })}>
            </uui-input>
          </div>

          </umb-property-layout>
        </div>
      </uui-box>
    `;
};
$u = function(e) {
  const t = e.style, i = (a) => u(this, c, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <umb-property-layout orientation="vertical" label="Font">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.fontKey}
            .options=${u(this, c, On).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${u(this, c, Au).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

        <div class="stack">
          <di-number-field
            .min=${g.fontSize.min}
            .max=${g.fontSize.max}
            label="Size"
            .value=${t.fontSize}
            @change=${(a) => i({ fontSize: a.detail.value ?? t.fontSize })}>
          </di-number-field>
          <umb-property-layout orientation="vertical" label="Weight">

            <div slot="editor" class="editor">
            <uui-select
              .value=${t.fontStyle}
              .options=${j(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${j(["left", "centre", "right"], t.textAlign)}
            @change=${(a) => i({ textAlign: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        <div class="stack">
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

        <div class="stack">
          <di-number-field
            .min=${g.maxLines.min}
            .max=${g.maxLines.max}
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
              .options=${j(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${j(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
xu = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${Pu(t.kind)}
            @change=${(a) => u(this, c, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" ? u(this, c, We).call(this, "Property", u(this, c, Ci).call(
    this,
    t.propertyAlias ?? "",
    (a) => u(this, c, b).call(this, { source: { ...t, propertyAlias: a } }),
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
                @change=${(a) => u(this, c, b).call(this, {
    source: { ...t, path: a.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : h}

        ${t.kind === "media" ? u(this, c, We).call(this, "Media item", u(this, c, In).call(this, t.mediaKey, (a) => u(this, c, b).call(this, { source: { ...t, kind: "media", mediaKey: a } }))) : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.fit}
            .options=${j(["cover", "contain", "stretch"], e.fit)}
            @change=${(a) => u(this, c, b).call(this, { fit: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        <di-number-field
          .min=${g.cornerRadius.min}
          .max=${g.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => u(this, c, b).call(this, { cornerRadius: a.detail.value ?? 0 })}>
        </di-number-field>

        <umb-property-layout orientation="vertical" label="Border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-number-field
              .min=${g.borderWidth.min}
              .max=${g.borderWidth.max}
              label="Width"
              .value=${((i = e.border) == null ? void 0 : i.width) ?? 0}
              @change=${(a) => {
    var o;
    const s = a.detail.value ?? 0;
    u(this, c, b).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => u(this, c, b).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : h}
          </div>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
ku = function(e) {
  const t = (s) => u(this, c, b).call(this, { badge: { ...e.badge, ...s } }), i = (s) => u(this, c, b).call(this, { label: { ...e.label, ...s } }), a = (s) => u(this, c, b).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <umb-property-layout orientation="vertical" label="Items from">

          <div slot="editor" class="editor">
          ${u(this, c, Ci).call(this, e.itemsPropertyAlias, (s) => u(this, c, b).call(this, { itemsPropertyAlias: s }))}
        </div>

        </umb-property-layout>

        <div class="stack">
          <di-number-field
            .min=${g.maxItems.min}
            .max=${g.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => u(this, c, b).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${g.gap.min}
            .max=${g.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => u(this, c, b).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <umb-property-layout orientation="vertical" label="Direction">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.direction}
            .options=${j(["horizontal", "vertical"], e.direction)}
            @change=${(s) => u(this, c, b).call(this, { direction: s.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.direction === "horizontal" ? r`
              <umb-property-layout orientation="vertical" label="Wrap onto new rows">

                <div slot="editor" class="editor">
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => u(this, c, b).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </div>

              </umb-property-layout>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${g.rowGap.min}
                      .max=${g.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => u(this, c, b).call(this, { rowGap: s.detail.value ?? 20 })}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  ` : h}
            ` : h}

        <div class="stack">
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
              .min=${g.borderWidth.min}
              .max=${g.borderWidth.max}
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
            .options=${j(["below", "right", "none"], e.label.position, {
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
                  .options=${u(this, c, On).call(this, e.label.fontKey)}
                  @change=${(s) => i({ fontKey: s.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>

              <div class="stack">
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
                  .options=${j(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>
            `}
      </uui-box>
    `;
};
Tu = function(e, t) {
  if (t === "circle") {
    const a = e.size.width ?? e.size.height ?? 200;
    u(this, c, b).call(this, { shape: "ellipse", lockAspect: !0, size: { ...e.size, width: a, height: a } });
    return;
  }
  const i = Fo(e) === "circle";
  u(this, c, b).call(this, {
    shape: t,
    ...i ? { lockAspect: !1 } : {}
  });
};
Ro = function(e, t, i) {
  const a = e.type === "rect" && e.lockAspect === !0, { width: s, height: o } = e.size;
  if (!a || i === null || !s || !o) {
    u(this, c, b).call(this, { size: { ...e.size, [t]: i } });
    return;
  }
  const n = t === "width" ? { width: i, height: Math.round(i * o / s) } : { width: Math.round(i * s / o), height: i };
  u(this, c, b).call(this, { size: n });
};
Su = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <umb-property-layout orientation="vertical" label="Shape">

          <div slot="editor" class="editor">
          <uui-select
            .value=${Fo(e)}
            .options=${j(["rectangle", "circle", "ellipse", "polygon", "star"], Fo(e))}
            @change=${(s) => u(this, c, Tu).call(this, e, s.target.value)}>
          </uui-select>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Lock aspect ratio">

          <div slot="editor" class="editor">
          <uui-toggle
            label="Lock aspect ratio"
            ?checked=${e.lockAspect === !0}
            @change=${(s) => u(this, c, b).call(this, { lockAspect: s.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${t === "polygon" || t === "star" ? r`
              <div class="stack">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  .min=${g.sides.min}
                  .max=${g.sides.max}
                  .value=${e.sides ?? 5}
                  @change=${(s) => u(this, c, b).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${g.innerRatio.min}
                      .max=${g.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => u(this, c, b).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : h}
              </div>
            ` : h}

        <umb-property-layout orientation="vertical" label="Fill">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${i}
            @change=${(s) => u(this, c, b).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${i ? r`<umb-property-layout orientation="vertical" label="Fill colour">

              <div slot="editor" class="editor">
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => u(this, c, b).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Gradient">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => u(this, c, b).call(this, {
    gradient: s.target.checked ? $l() : null
  })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${e.gradient ? u(this, c, Cn).call(this, e.gradient, (s) => u(this, c, b).call(this, { gradient: s })) : h}

        ${t === "rectangle" ? r`<di-number-field
            .min=${g.cornerRadius.min}
            .max=${g.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => u(this, c, b).call(this, { cornerRadius: s.detail.value ?? 0 })}>
            </di-number-field>` : h}

        <umb-property-layout orientation="vertical" label="Border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-number-field
              .min=${g.borderWidth.min}
              .max=${g.borderWidth.max}
              label="Width"
              .value=${((a = e.border) == null ? void 0 : a.width) ?? 0}
              @change=${(s) => {
    var n;
    const o = s.detail.value ?? 0;
    u(this, c, b).call(this, {
      border: o > 0 ? { width: o, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => u(this, c, b).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : h}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
Eu = function(e) {
  const t = Ue(e.position, "x"), i = Ue(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${u(this, c, Mo).call(this, e, "x")} ${u(this, c, Mo).call(this, e, "y")}

        <umb-property-layout orientation="vertical" label="Anchor">

          <div slot="editor" class="editor">
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => u(this, c, Cu).call(this, e, s.detail.value)}>
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
            @change=${(s) => u(this, c, b).call(this, { rotation: kl(s.detail.value ?? 0) })}>
          </di-number-field>
          <small class="hint">Clockwise, around the anchor point. Drag the handle above the selection on the canvas; hold Shift for 15° steps.</small>
        </div>

        <div class="stack">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            placeholder="Auto"
            .value=${e.size.width ?? null}
            @change=${(s) => u(this, c, Ro).call(this, e, "width", s.detail.value)}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => u(this, c, Ro).call(this, e, "height", s.detail.value)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
Mo = function(e, t) {
  const i = Ue(e.position, t), a = ts(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => u(this, c, Du).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => u(this, c, ja).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${j(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => u(this, c, ja).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </div>

              </umb-property-layout>

              <di-number-field
                .min=${g.referenceGap.min}
                .max=${g.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => u(this, c, ja).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? g.x.min : g.y.min}
                .max=${t === "x" ? g.x.max : g.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => u(this, c, b).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
Du = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Ue(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && u(this, c, b).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: qp
      }
    }
  });
};
ja = function(e, t, i) {
  const a = ts(e.position, t);
  a && u(this, c, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Cu = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? Kp(e.position, i, a, t) : { ...e.position, anchor: t };
  u(this, c, b).call(this, { position: s });
};
Iu = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <umb-property-layout orientation="vertical" label="Visible">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => u(this, c, b).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Locked">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => u(this, c, b).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${g.opacity.min}
          .max=${g.opacity.max}
          .value=${e.opacity}
          @change=${(t) => u(this, c, b).call(this, { opacity: t.detail.value ?? 1 })}>
        </di-number-field>

        <umb-property-layout orientation="vertical" label="Show this layer">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.visibility.rule}
            .options=${j(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
    always: "Always",
    whenNotEmpty: "When it has a value",
    whenPropertyTruthy: "When another property is set"
  })}
            @change=${(t) => u(this, c, b).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<umb-property-layout orientation="vertical" label="Controlled by">

              <div slot="editor" class="editor">
              ${u(this, c, Ci).call(this, e.visibility.propertyAlias ?? "", (t) => u(this, c, b).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </div>

            </umb-property-layout>` : h}
      </uui-box>
    `;
};
In = function(e, t) {
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
      <umb-property-layout orientation="vertical" label=${e} description=${Yi(i)}>
        <div slot="editor" class="editor">${t}</div>
      </umb-property-layout>
    `;
};
Ci = function(e, t, i = {}) {
  const a = Zp(e), s = [];
  for (let o = 0; o <= io; o++) {
    const n = er(a, o), l = o === 0 ? this.properties : this.linkedProperties[n] ?? [], p = a[o] ?? "";
    if (o > 0) {
      const T = (o === 1 ? this.properties : this.linkedProperties[er(a, o - 1)] ?? []).some(
        (q) => q.alias === a[o - 1] && q.classification === "content"
      );
      if (!a[o - 1] || !T && !p) break;
    }
    const m = u(this, c, Ou).call(this, ef(l, o === 0 ? i.root : i.tail), p, (S) => t([...a.slice(0, o), S].filter(Boolean).join(".")));
    s.push(o === 0 ? m : r`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[n] ?? "Property on the linked item"}</span>
            ${m}
          </div>`);
  }
  return s.length === 1 ? s[0] : r`<div class="path">${s}</div>`;
};
Ou = function(e, t, i) {
  return r`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${ah(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
On = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
Au = function(e, t, i) {
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
Je.styles = O`
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
Gt([
  f({ type: Object })
], Je.prototype, "template", 2);
Gt([
  f({ type: Object })
], Je.prototype, "layer", 2);
Gt([
  f({ type: Array })
], Je.prototype, "properties", 2);
Gt([
  f({ type: Object })
], Je.prototype, "linkedProperties", 2);
Gt([
  f({ type: Object })
], Je.prototype, "linkedCaptions", 2);
Gt([
  f({ type: Array })
], Je.prototype, "fonts", 2);
Je = Gt([
  A("di-layer-inspector")
], Je);
function j(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
const tf = {
  linear: "Linear",
  radial: "Radial",
  angular: "Angular (conic)",
  diamond: "Diamond",
  reflected: "Reflected"
}, af = {
  farthestCorner: "Farthest corner",
  farthestSide: "Farthest side",
  closestCorner: "Closest corner",
  closestSide: "Closest side"
}, sf = [
  ["↑", 0, "Upwards (0°)"],
  ["→", 90, "To the right (90°)"],
  ["↓", 180, "Downwards (180°)"],
  ["←", 270, "To the left (270°)"]
];
function Pu(e) {
  return j(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
function Fo(e) {
  const t = e.shape ?? "rectangle";
  return t === "ellipse" && e.lockAspect === !0 ? "circle" : t;
}
var of = Object.defineProperty, nf = Object.getOwnPropertyDescriptor, Ru = (e) => {
  throw TypeError(e);
}, $a = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && of(t, i, s), s;
}, rf = (e, t, i) => t.has(e) || Ru("Cannot " + i), lf = (e, t, i) => t.has(e) ? Ru("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Re = (e, t, i) => (rf(e, t, "access private method"), i), _e, It, Mu, Fu, Lu, zu;
const cf = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let jt = class extends F {
  constructor() {
    super(...arguments), lf(this, _e), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Re(this, _e, Lu)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : te(
      e,
      (t) => t.key,
      (t, i) => Re(this, _e, zu).call(this, t, i)
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
_e = /* @__PURE__ */ new WeakSet();
It = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Mu = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Fu = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Lu = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Re(this, _e, It).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
zu = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Re(this, _e, Mu).call(this, a, e.key)}
        @dragover=${(a) => Re(this, _e, Fu).call(this, a, t)}
        @click=${() => Re(this, _e, It).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${cf[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Re(this, _e, It).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Re(this, _e, It).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Re(this, _e, It).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Re(this, _e, It).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
jt.styles = O`
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
$a([
  f({ type: Array })
], jt.prototype, "layers", 2);
$a([
  f({ type: String })
], jt.prototype, "selectedLayerKey", 2);
$a([
  y()
], jt.prototype, "_dragKey", 2);
$a([
  y()
], jt.prototype, "_dropIndex", 2);
jt = $a([
  A("di-layers-panel")
], jt);
var uf = Object.defineProperty, df = Object.getOwnPropertyDescriptor, Uu = (e) => {
  throw TypeError(e);
}, at = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? df(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && uf(t, i, s), s;
}, An = (e, t, i) => t.has(e) || Uu("Cannot " + i), pf = (e, t, i) => (An(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Gr = (e, t, i) => t.has(e) ? Uu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hf = (e, t, i, a) => (An(e, t, "write to private field"), t.set(e, i), i), ne = (e, t, i) => (An(e, t, "access private method"), i), H, Be, ms, Wu, Nu, Ni;
let Oe = class extends F {
  constructor() {
    super(...arguments), Gr(this, H), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Gr(this, ms, 100);
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
            @click=${() => ne(this, H, Be).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            compact
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${ds.min * 100}
            .max=${ds.max * 100}
            .value=${ne(this, H, Wu).call(this)}
            @change=${ne(this, H, Nu)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => ne(this, H, Be).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => ne(this, H, Be).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${ne(this, H, Ni).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${ne(this, H, Ni).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${ne(this, H, Ni).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${ne(this, H, Ni).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => ne(this, H, Be).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => ne(this, H, Be).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => ne(this, H, Be).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
H = /* @__PURE__ */ new WeakSet();
Be = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
ms = /* @__PURE__ */ new WeakMap();
Wu = function() {
  return this.matches(":focus-within") || hf(this, ms, Math.round(this.effectiveScale * 100)), pf(this, ms);
};
Nu = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && ne(this, H, Be).call(this, "di-zoom-change", { zoom: t / 100 });
};
Ni = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => ne(this, H, Be).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
Oe.styles = O`
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
at([
  f({ type: Number })
], Oe.prototype, "effectiveScale", 2);
at([
  f({ type: Boolean })
], Oe.prototype, "snapEnabled", 2);
at([
  f({ type: Boolean })
], Oe.prototype, "showRulers", 2);
at([
  f({ type: Boolean })
], Oe.prototype, "showSafeArea", 2);
at([
  f({ type: Boolean })
], Oe.prototype, "showMeasured", 2);
at([
  f({ type: Boolean })
], Oe.prototype, "canUndo", 2);
at([
  f({ type: Boolean })
], Oe.prototype, "canRedo", 2);
at([
  f({ type: Boolean })
], Oe.prototype, "previewing", 2);
Oe = at([
  A("di-canvas-toolbar")
], Oe);
var mf = Object.defineProperty, yf = Object.getOwnPropertyDescriptor, Bu = (e) => {
  throw TypeError(e);
}, Pn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && mf(t, i, s), s;
}, Rn = (e, t, i) => t.has(e) || Bu("Cannot " + i), ai = (e, t, i) => (Rn(e, t, "read from private field"), t.get(e)), Aa = (e, t, i) => t.has(e) ? Bu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Lo = (e, t, i, a) => (Rn(e, t, "write to private field"), t.set(e, i), i), Yr = (e, t, i) => (Rn(e, t, "access private method"), i), Ti, Va, Gi, qa, Ku, ju;
let na = class extends F {
  constructor() {
    super(), Aa(this, qa), Aa(this, Ti), this._selection = [], Aa(this, Va, ""), Aa(this, Gi), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(xt, (e) => {
      Lo(this, Ti, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== ai(this, Va) && (Lo(this, Va, i), Yr(this, qa, Ku).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
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
          @change=${Yr(this, qa, ju)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
Ti = /* @__PURE__ */ new WeakMap();
Va = /* @__PURE__ */ new WeakMap();
Gi = /* @__PURE__ */ new WeakMap();
qa = /* @__PURE__ */ new WeakSet();
Ku = async function(e) {
  if (!ai(this, Ti)) return;
  ai(this, Gi) ?? Lo(this, Gi, hl(ai(this, Ti).getToken).catch(() => []));
  const t = await ai(this, Gi), i = new Set(e), a = t.filter((s) => i.has(s.alias)).map((s) => s.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
ju = function(e) {
  var i;
  const t = e.target.selection;
  (i = ai(this, Ti)) == null || i.setSampleContentKey(t[0]);
};
na.styles = O`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
Pn([
  y()
], na.prototype, "_selection", 2);
Pn([
  y()
], na.prototype, "_allowedContentTypeIds", 2);
na = Pn([
  A("di-preview-content-picker")
], na);
var ff = Object.defineProperty, gf = Object.getOwnPropertyDescriptor, Vu = (e) => {
  throw TypeError(e);
}, xa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ff(t, i, s), s;
}, Mn = (e, t, i) => t.has(e) || Vu("Cannot " + i), Z = (e, t, i) => (Mn(e, t, "read from private field"), t.get(e)), Tt = (e, t, i) => t.has(e) ? Vu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ut = (e, t, i, a) => (Mn(e, t, "write to private field"), t.set(e, i), i), Ve = (e, t, i) => (Mn(e, t, "access private method"), i), lt, ri, li, Wt, ys, fs, Se, Fn, Ga, Ln, zo;
const vf = 400;
let Vt = class extends F {
  constructor() {
    super(), Tt(this, Se), Tt(this, lt), Tt(this, ri), Tt(this, li), Tt(this, Wt), Tt(this, ys), Tt(this, fs, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(xt, (e) => {
      Ut(this, lt, e), e && (this.observe(e.template, (t) => {
        t && Ve(this, Se, Ga).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Ut(this, ys, t);
        const i = (a = Z(this, lt)) == null ? void 0 : a.getData();
        i && Ve(this, Se, Ga).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Ut(this, fs, t ?? !0);
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
    const e = (t = Z(this, lt)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(Z(this, ri)), this._collapsed = !1, Ve(this, Se, Ln).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(Z(this, ri)), (e = Z(this, li)) == null || e.abort(), Ve(this, Se, Fn).call(this);
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
        const t = (e = Z(this, lt)) == null ? void 0 : e.getData();
        t && Ve(this, Se, Ga).call(this, t);
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
lt = /* @__PURE__ */ new WeakMap();
ri = /* @__PURE__ */ new WeakMap();
li = /* @__PURE__ */ new WeakMap();
Wt = /* @__PURE__ */ new WeakMap();
ys = /* @__PURE__ */ new WeakMap();
fs = /* @__PURE__ */ new WeakMap();
Se = /* @__PURE__ */ new WeakSet();
Fn = function() {
  Z(this, Wt) && (URL.revokeObjectURL(Z(this, Wt)), Ut(this, Wt, void 0));
};
Ga = function(e) {
  this._collapsed || (window.clearTimeout(Z(this, ri)), Ut(this, ri, window.setTimeout(() => void Ve(this, Se, Ln).call(this, e), vf)));
};
Ln = async function(e) {
  var t;
  if (Z(this, lt)) {
    (t = Z(this, li)) == null || t.abort(), Ut(this, li, new AbortController()), Ve(this, Se, zo).call(this, !0), this._error = void 0;
    try {
      const i = await ml(
        e,
        {
          signal: Z(this, li).signal,
          contentKey: Z(this, ys),
          useSampleData: Z(this, fs)
        },
        Z(this, lt).getToken
      );
      Ve(this, Se, Fn).call(this), Ut(this, Wt, URL.createObjectURL(i)), this._url = Z(this, Wt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ve(this, Se, zo).call(this, !1);
    }
  }
};
zo = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Vt.styles = O`
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
      ${yn}
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
xa([
  y()
], Vt.prototype, "_url", 2);
xa([
  y()
], Vt.prototype, "_loading", 2);
xa([
  y()
], Vt.prototype, "_error", 2);
xa([
  y()
], Vt.prototype, "_collapsed", 2);
Vt = xa([
  A("di-preview-strip")
], Vt);
var bf = Object.defineProperty, _f = Object.getOwnPropertyDescriptor, qu = (e) => {
  throw TypeError(e);
}, V = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? _f(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && bf(t, i, s), s;
}, zn = (e, t, i) => t.has(e) || qu("Cannot " + i), $ = (e, t, i) => (zn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Zt = (e, t, i) => t.has(e) ? qu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), gs = (e, t, i, a) => (zn(e, t, "write to private field"), t.set(e, i), i), ke = (e, t, i) => (zn(e, t, "access private method"), i), C, ra, la, ci, K, Uo, Un, Gu, Yu, Wo, Hu, Xu, Ju, No, Zu, Qu, ed, Ya;
const wf = 400;
let U = class extends F {
  constructor() {
    super(), Zt(this, K), Zt(this, C), Zt(this, ra), Zt(this, la), Zt(this, ci), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, Zt(this, Ya, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = $(this, C);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = $(this, K, Uo);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), ke(this, K, Wo).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, p = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, m = Ue(s.position, "x") ? 0 : l, S = Ue(s.position, "y") ? 0 : p;
            if (m === 0 && S === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + m, y: s.position.y + S }
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
    }), this.consumeContext(Y, (e) => {
      gs(this, ra, e);
    }), this.consumeContext(xt, (e) => {
      gs(this, C, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (ke(this, K, Hu).call(this, t), ke(this, K, Xu).call(this, t), ke(this, K, Ju).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", $(this, Ya));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", $(this, Ya)), window.clearTimeout($(this, la)), (e = $(this, ci)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = $(this, C)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = $(this, C)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = $(this, C)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => ke(this, K, Wo).call(this, e.detail.key)}
        @di-layer-detach=${(e) => ke(this, K, Yu).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = $(this, C)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = $(this, C)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = $(this, C)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = $(this, C)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = $(this, C)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = $(this, C)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => ke(this, K, No).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => ke(this, K, No).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-use-image-size=${ke(this, K, ed)}
        @di-request-preview=${() => {
      var e;
      return (e = $(this, K, Gu)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(ds.min, Math.min(ds.max, e.detail.zoom));
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
      return (e = $(this, C)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = $(this, C)) == null ? void 0 : e.redo();
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
            .layer=${$(this, K, Uo)}
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
ra = /* @__PURE__ */ new WeakMap();
la = /* @__PURE__ */ new WeakMap();
ci = /* @__PURE__ */ new WeakMap();
K = /* @__PURE__ */ new WeakSet();
Uo = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
Un = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Gu = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Yu = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = $(this, K, Un)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = $(this, C)) == null || n.updateLayer(e, { position: to(i.position, t, a) });
};
Wo = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = $(this, K, Un)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = $(this, C)) == null || s.removeLayer(e, t);
};
Hu = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && $(this, C) && await nc(t, $(this, C).getToken);
};
Xu = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !$(this, C)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await fl(t.mediaKey, $(this, C).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Ju = function() {
  window.clearTimeout($(this, la)), gs(this, la, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !$(this, C))) {
      (t = $(this, ci)) == null || t.abort(), gs(this, ci, new AbortController());
      try {
        const i = await yl(
          e,
          { signal: $(this, ci).signal, useSampleData: !0 },
          $(this, C).getToken
        );
        $(this, C).setServerBounds(i.layers), $(this, C).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, wf));
};
No = function(e, t, i, a) {
  const s = this._template;
  if (!s || !$(this, C)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: ke(this, K, Qu).call(this) };
  if (e.kind === "property") {
    const l = Wp(e.property, o);
    if (l.kind === "condition") {
      ke(this, K, Zu).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    $(this, C).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? _l(o, "Image") : e.layerType === "badges" ? wl(o, "Badges", "") : e.layerType === "rect" ? zp(o, "Shape", e.preset) : bl(o, "Text", { kind: "static", text: "Text" });
  $(this, C).addLayer(n);
};
Zu = function(e, t, i) {
  var o, n, l, p;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((m) => m.key === a);
  if (!s) {
    (n = $(this, ra)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = $(this, C)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (p = $(this, ra)) == null || p.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
Qu = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
ed = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !$(this, C)) return;
  const t = await fl(e.mediaKey, $(this, C).getToken).catch(() => {
  });
  t && $(this, C).updateCanvas({ width: t.width, height: t.height });
};
Ya = /* @__PURE__ */ new WeakMap();
U.styles = O`
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
V([
  y()
], U.prototype, "_template", 2);
V([
  y()
], U.prototype, "_selectedKey", 2);
V([
  y()
], U.prototype, "_properties", 2);
V([
  y()
], U.prototype, "_linkedProperties", 2);
V([
  y()
], U.prototype, "_linkedCaptions", 2);
V([
  y()
], U.prototype, "_fonts", 2);
V([
  y()
], U.prototype, "_serverBounds", 2);
V([
  y()
], U.prototype, "_baseImageUrl", 2);
V([
  y()
], U.prototype, "_zoom", 2);
V([
  y()
], U.prototype, "_effectiveScale", 2);
V([
  y()
], U.prototype, "_previewing", 2);
V([
  y()
], U.prototype, "_snapEnabled", 2);
V([
  y()
], U.prototype, "_showRulers", 2);
V([
  y()
], U.prototype, "_showSafeArea", 2);
V([
  y()
], U.prototype, "_showMeasured", 2);
V([
  y()
], U.prototype, "_canUndo", 2);
V([
  y()
], U.prototype, "_canRedo", 2);
U = V([
  A("di-design-view")
], U);
const $f = U, xf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return U;
  },
  default: $f
}, Symbol.toStringTag, { value: "Module" }));
var kf = Object.defineProperty, Tf = Object.getOwnPropertyDescriptor, td = (e) => {
  throw TypeError(e);
}, st = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Tf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && kf(t, i, s), s;
}, Wn = (e, t, i) => t.has(e) || td("Cannot " + i), ie = (e, t, i) => (Wn(e, t, "read from private field"), t.get(e)), Ri = (e, t, i) => t.has(e) ? td("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ca = (e, t, i, a) => (Wn(e, t, "write to private field"), t.set(e, i), i), nt = (e, t, i) => (Wn(e, t, "access private method"), i), Le, ua, ui, Nt, Pe, Nn, Ha, id, ad, sd;
let ye = class extends F {
  constructor() {
    super(), Ri(this, Pe), Ri(this, Le), Ri(this, ua), Ri(this, ui), Ri(this, Nt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Y, (e) => {
      ca(this, ua, e);
    }), this.consumeContext(xt, (e) => {
      ca(this, Le, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, nt(this, Pe, Ha).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), nt(this, Pe, Ha).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ie(this, ui)) == null || e.abort(), nt(this, Pe, Nn).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => nt(this, Pe, Ha).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${nt(this, Pe, ad)}>
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
      (e) => nt(this, Pe, sd).call(this, e)
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
                @click=${nt(this, Pe, id)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : h}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
Le = /* @__PURE__ */ new WeakMap();
ua = /* @__PURE__ */ new WeakMap();
ui = /* @__PURE__ */ new WeakMap();
Nt = /* @__PURE__ */ new WeakMap();
Pe = /* @__PURE__ */ new WeakSet();
Nn = function() {
  ie(this, Nt) && (URL.revokeObjectURL(ie(this, Nt)), ca(this, Nt, void 0));
};
Ha = async function() {
  var i;
  const e = this._template;
  if (!e || !ie(this, Le)) return;
  (i = ie(this, ui)) == null || i.abort(), ca(this, ui, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: ie(this, ui).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, s] = await Promise.all([
      ml(e, t, ie(this, Le).getToken),
      yl(e, t, ie(this, Le).getToken)
    ]);
    nt(this, Pe, Nn).call(this), ca(this, Nt, URL.createObjectURL(a)), this._url = ie(this, Nt), this._bounds = s.layers, this._skipped = s.skipped ?? [], ie(this, Le).setServerBounds(s.layers), ie(this, Le).setIssues(s.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
id = async function() {
  var e, t;
  if (!(!this._contentKey || !ie(this, Le))) {
    this._regenerating = !0;
    try {
      const i = await Yo(this._contentKey, ie(this, Le).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = ie(this, ua)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = ie(this, ua)) == null || t.peek("danger", {
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
ad = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
sd = function(e) {
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
ye.styles = O`
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
      ${yn}
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
st([
  y()
], ye.prototype, "_template", 2);
st([
  y()
], ye.prototype, "_contentKey", 2);
st([
  y()
], ye.prototype, "_bounds", 2);
st([
  y()
], ye.prototype, "_skipped", 2);
st([
  y()
], ye.prototype, "_url", 2);
st([
  y()
], ye.prototype, "_loading", 2);
st([
  y()
], ye.prototype, "_error", 2);
st([
  y()
], ye.prototype, "_regenerating", 2);
ye = st([
  A("di-preview-view")
], ye);
const Sf = ye, Ef = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return ye;
  },
  default: Sf
}, Symbol.toStringTag, { value: "Module" }));
var Df = Object.defineProperty, Cf = Object.getOwnPropertyDescriptor, od = (e) => {
  throw TypeError(e);
}, ka = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Cf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Df(t, i, s), s;
}, Bn = (e, t, i) => t.has(e) || od("Cannot " + i), Q = (e, t, i) => (Bn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Hr = (e, t, i) => t.has(e) ? od("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), If = (e, t, i, a) => (Bn(e, t, "write to private field"), t.set(e, i), i), si = (e, t, i) => (Bn(e, t, "access private method"), i), le, he, nd, rd, vs, ld, cd, ud, dd, pd, hd;
let Ze = class extends F {
  constructor() {
    super(), Hr(this, he), Hr(this, le), this._properties = [], this._showAdvanced = !1, this.consumeContext(xt, (e) => {
      If(this, le, e), e && (hl(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${si(this, he, ud).call(this)} ${si(this, he, dd).call(this)} ${si(this, he, pd).call(this)} ${si(this, he, hd).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
le = /* @__PURE__ */ new WeakMap();
he = /* @__PURE__ */ new WeakSet();
nd = function() {
  return this._properties.filter((e) => e.classification === "media");
};
rd = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
vs = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
ld = async function(e) {
  var s, o;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((n) => [n.key, n.alias])), a = [
    ...t.map((n) => i.get(n)).filter((n) => !!n),
    ...Q(this, he, vs)
  ].filter((n, l, p) => p.indexOf(n) === l);
  (s = Q(this, le)) == null || s.updateTemplateFields({ docTypeAliases: a }), await ((o = Q(this, le)) == null ? void 0 : o.reloadProperties());
};
cd = function(e) {
  var i;
  const t = e.target.selection;
  (i = Q(this, le)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
ud = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? r`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${Q(this, he, rd)}
                  @change=${si(this, he, ld)}></umb-input-document-type>` : r`<uui-loader-bar></uui-loader-bar>`}
            ${Q(this, he, vs).length > 0 ? r`<p class="note">
                  Also targets ${Q(this, he, vs).join(", ")}, which no document type has any more.
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
    ...Q(this, he, nd).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = Q(this, le)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = Q(this, le)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
dd = function() {
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
            @change=${si(this, he, cd)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = Q(this, le)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = Q(this, le)) == null ? void 0 : i.updateOutput({
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
    return (i = Q(this, le)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
pd = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = Q(this, le)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = Q(this, le)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
hd = function() {
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
    return (i = Q(this, le)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
Ze.styles = O`
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
ka([
  y()
], Ze.prototype, "_template", 2);
ka([
  y()
], Ze.prototype, "_properties", 2);
ka([
  y()
], Ze.prototype, "_showAdvanced", 2);
ka([
  y()
], Ze.prototype, "_documentTypes", 2);
Ze = ka([
  A("di-settings-view")
], Ze);
const Of = Ze, Af = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return Ze;
  },
  default: Of
}, Symbol.toStringTag, { value: "Module" }));
var Pf = Object.defineProperty, Rf = Object.getOwnPropertyDescriptor, md = (e) => {
  throw TypeError(e);
}, Ta = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Pf(t, i, s), s;
}, Kn = (e, t, i) => t.has(e) || md("Cannot " + i), Xr = (e, t, i) => (Kn(e, t, "read from private field"), t.get(e)), Jr = (e, t, i) => t.has(e) ? md("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mf = (e, t, i, a) => (Kn(e, t, "write to private field"), t.set(e, i), i), Zr = (e, t, i) => (Kn(e, t, "access private method"), i), da, Xa, Bo;
let Qe = class extends F {
  constructor() {
    super(), Jr(this, Xa), Jr(this, da), this._loading = !0, this._onlyMissing = !1, this.consumeContext(xt, (e) => {
      Mf(this, da, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Zr(this, Xa, Bo).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Zr(this, Xa, Bo).call(this)}>Reload</uui-button>
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
da = /* @__PURE__ */ new WeakMap();
Xa = /* @__PURE__ */ new WeakSet();
Bo = async function() {
  const e = this._template;
  if (!(!e || !Xr(this, da))) {
    this._loading = !0;
    try {
      this._usage = await Op(e.key, Xr(this, da).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Qe.styles = O`
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
Ta([
  y()
], Qe.prototype, "_template", 2);
Ta([
  y()
], Qe.prototype, "_usage", 2);
Ta([
  y()
], Qe.prototype, "_loading", 2);
Ta([
  y()
], Qe.prototype, "_onlyMissing", 2);
Qe = Ta([
  A("di-usage-view")
], Qe);
const Ff = Qe, Lf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Qe;
  },
  default: Ff
}, Symbol.toStringTag, { value: "Module" })), zf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Qa,
  default: Qa
}, Symbol.toStringTag, { value: "Module" }));
var mt, Lt;
class Hs extends Id {
  constructor(i, a) {
    super(i, a);
    k(this, mt);
    k(this, Lt);
    this.consumeContext(Y, (s) => {
      _(this, mt, s);
    }), this.consumeContext(xt, (s) => {
      _(this, Lt, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = d(this, Lt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = d(this, mt)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await qo(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await gl(a.key, !1, i.getToken);
        (o = d(this, mt)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await Gl(l, i.getToken, d(this, mt));
      } catch (l) {
        (n = d(this, mt)) == null || n.peek("danger", {
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
    d(this, Lt) && await Ip(i, d(this, Lt).getToken);
  }
}
mt = new WeakMap(), Lt = new WeakMap();
const Uf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: Hs,
  api: Hs,
  default: Hs
}, Symbol.toStringTag, { value: "Module" }));
var ha, wi;
class Xs extends ga {
  constructor(i, a) {
    super(i, a);
    k(this, ha);
    k(this, wi);
    this.consumeContext(Ae, (s) => {
      _(this, ha, s);
    }), this.consumeContext(Y, (s) => {
      _(this, wi, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Yo(i, () => {
          var l;
          return (l = d(this, ha)) == null ? void 0 : l.getLatestToken();
        }), n = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = d(this, wi)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof bt && o.status === 404;
        (s = d(this, wi)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof bt ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
ha = new WeakMap(), wi = new WeakMap();
const Wf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: Xs,
  api: Xs,
  default: Xs
}, Symbol.toStringTag, { value: "Module" }));
var ma, zt, ya, $i;
class Js extends Nd {
  constructor(i, a) {
    super(i, a);
    k(this, ma);
    k(this, zt);
    k(this, ya);
    k(this, $i);
    this.consumeContext(Ae, (s) => {
      _(this, ma, s);
    }), this.consumeContext(Y, (s) => {
      _(this, zt, s);
    }), this.consumeContext(Bd, (s) => {
      _(this, ya, s);
    }), this.consumeContext(Kd, (s) => {
      _(this, $i, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!d(this, $i)) {
      (i = d(this, zt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Yo(d(this, $i), () => {
        var l;
        return (l = d(this, ma)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = d(this, ya)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = d(this, zt)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof bt && n.status === 404;
      (o = d(this, zt)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof bt ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
ma = new WeakMap(), zt = new WeakMap(), ya = new WeakMap(), $i = new WeakMap();
const Nf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: Js,
  api: Js,
  default: Js
}, Symbol.toStringTag, { value: "Module" }));
var Bf = Object.defineProperty, Kf = Object.getOwnPropertyDescriptor, yd = (e) => {
  throw TypeError(e);
}, ot = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Kf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Bf(t, i, s), s;
}, jn = (e, t, i) => t.has(e) || yd("Cannot " + i), Ge = (e, t, i) => (jn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Zs = (e, t, i) => t.has(e) ? yd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), jf = (e, t, i, a) => (jn(e, t, "write to private field"), t.set(e, i), i), re = (e, t, i) => (jn(e, t, "access private method"), i), Ja, Sa, W, Os, Za, fd, gd, vd, Vn, bd, _d, wd, $d, xd, kd, Td, Sd;
const Vf = [100, 200, 300, 400, 500, 600, 700, 800, 900], qf = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let fe = class extends rl {
  constructor() {
    super(), Zs(this, W), Zs(this, Ja), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", Zs(this, Sa, () => {
      var e;
      return (e = Ge(this, Ja)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ae, (e) => {
      jf(this, Ja, e);
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
      <umb-body-layout headline=${re(this, W, wd).call(this)}>
        ${re(this, W, Za).call(this, "upload") ? re(this, W, $d).call(this, e) : h}
        ${re(this, W, Za).call(this, "path") ? re(this, W, xd).call(this, e) : h}
        ${re(this, W, Za).call(this, "web") ? re(this, W, kd).call(this, e) : h}

        ${this._error ? r`<p class="error" role="alert">${this._error}</p>` : h}
        ${this._busy ? r`<uui-loader-bar></uui-loader-bar>` : h}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Ja = /* @__PURE__ */ new WeakMap();
Sa = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakSet();
Os = function() {
  var e, t;
  return { familyKey: ((e = this.data) == null ? void 0 : e.familyKey) ?? null, parentKey: ((t = this.data) == null ? void 0 : t.parentKey) ?? null };
};
Za = function(e) {
  var t;
  return !((t = this.data) != null && t.mode) || this.data.mode === e;
};
fd = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  re(this, W, gd).call(this, t);
};
gd = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await pp(t, Ge(this, Sa), Ge(this, W, Os));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
vd = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await hp(this._path.trim(), Ge(this, Sa), Ge(this, W, Os)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Vn = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
bd = async function() {
  if (Ge(this, W, Vn)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await mp(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        Ge(this, Sa),
        Ge(this, W, Os)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
_d = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
wd = function() {
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
$d = function(e) {
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
            @change=${re(this, W, fd)}>
          </uui-file-dropzone>
          <p class="hint">
            .ttf, .otf, .woff2 or .woff. The family name and weight are read from the file. Uploads are stored in the
            media library, so they work on Umbraco Cloud and transfer with Deploy.
          </p>
        </uui-box>
    `;
};
xd = function(e) {
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
            @click=${re(this, W, vd)}>
            Register
          </uui-button>
        </uui-box>
    `;
};
kd = function(e) {
  return r`
        <uui-box headline=${e ? "Or use a web font" : "Web font"}>
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${qf.map((t) => ({
    name: t.name,
    value: t.value,
    selected: t.value === this._provider
  }))}
            ?disabled=${this._busy}
            @change=${(t) => {
    this._provider = t.target.value;
  }}>
          </uui-select>

          ${this._provider === "direct" ? re(this, W, Sd).call(this) : re(this, W, Td).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !Ge(this, W, Vn)}
            @click=${re(this, W, bd)}>
            Add web font
          </uui-button>
        </uui-box>
    `;
};
Td = function() {
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
    Vf,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => re(this, W, _d).call(this, e, t.target.checked)}>
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
Sd = function() {
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
fe.styles = O`
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
ot([
  y()
], fe.prototype, "_busy", 2);
ot([
  y()
], fe.prototype, "_error", 2);
ot([
  y()
], fe.prototype, "_path", 2);
ot([
  y()
], fe.prototype, "_provider", 2);
ot([
  y()
], fe.prototype, "_family", 2);
ot([
  y()
], fe.prototype, "_weights", 2);
ot([
  y()
], fe.prototype, "_italic", 2);
ot([
  y()
], fe.prototype, "_url", 2);
fe = ot([
  A("di-font-upload-modal")
], fe);
const Gf = fe, Yf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return fe;
  },
  default: Gf
}, Symbol.toStringTag, { value: "Module" }));
var Hf = Object.getOwnPropertyDescriptor, Xf = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Hf(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = n(s) || s);
  return s;
};
let bs = class extends F {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
bs = Xf([
  A("di-template-folder-editor")
], bs);
const Jf = bs, Ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return bs;
  },
  default: Jf
}, Symbol.toStringTag, { value: "Module" }));
export {
  Rh as manifests,
  Tg as onInit
};
//# sourceMappingURL=dynamic-images.js.map
