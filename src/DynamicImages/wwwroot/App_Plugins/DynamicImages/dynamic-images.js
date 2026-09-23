var dr = (e) => {
  throw TypeError(e);
};
var us = (e, t, i) => t.has(e) || dr("Cannot " + i);
var d = (e, t, i) => (us(e, t, "read from private field"), i ? i.call(e) : t.get(e)), x = (e, t, i) => t.has(e) ? dr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), b = (e, t, i, a) => (us(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), E = (e, t, i) => (us(e, t, "access private method"), i);
var ds = (e, t, i, a) => ({
  set _(s) {
    b(e, t, s, i);
  },
  get _() {
    return d(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as du, UmbEntityWorkspaceDataManager as hu, UmbSubmitWorkspaceAction as Ts, UmbEntityNamedDetailWorkspaceContextBase as pu, UmbWorkspaceActionBase as mu } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Qa, UmbContextConsumerController as yu } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as sn, UmbItemRepositoryBase as fu, UmbItemServerDataSourceBase as gu, UmbRepositoryBase as yo } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as on, UmbItemStoreBase as vu } from "@umbraco-cms/backoffice/store";
import { UmbId as bu } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as _u, UMB_DATE_TIME_VALUE_TYPE as wu } from "@umbraco-cms/backoffice/value-type";
import { nothing as p, html as n, css as A, state as y, customElement as M, ifDefined as Ss, property as g, repeat as Z, classMap as rn, styleMap as W } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as L } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as $u, UmbTreeRepositoryBase as xu } from "@umbraco-cms/backoffice/tree";
import { UMB_ACTION_EVENT_CONTEXT as ia } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent as es, UmbRequestReloadStructureForEntityEvent as nn, UmbEntityActionBase as aa } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT as oe } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as ku } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UMB_AUTH_CONTEXT as Le } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as ln, UMB_DISCARD_CHANGES_MODAL as Tu, umbConfirmModal as fo, UmbModalToken as cn, UmbModalBaseElement as un, UMB_MODAL_MANAGER_CONTEXT as Su } from "@umbraco-cms/backoffice/modal";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as Eu } from "@umbraco-cms/backoffice/entity";
import { tryExecute as Cu } from "@umbraco-cms/backoffice/resources";
import { UmbDefaultCollectionContext as Du } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as Ou, UmbDeselectedEvent as Iu } from "@umbraco-cms/backoffice/event";
import "@umbraco-cms/backoffice/document-type";
import "@umbraco-cms/backoffice/media";
import { UmbArrayState as vi, UmbStringState as hr, UmbObjectState as pr, UmbBooleanState as ha, UmbNumberState as Pu } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as Au } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Mu } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Ru } from "@umbraco-cms/backoffice/document";
const ts = "dynamic-images", is = "di-template", Es = "di:templates-changed", zu = "/umbraco/management/api/v1/dynamic-images";
class ht extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function w(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const r = await fetch(`${zu}${e}`, { ...i, headers: s, body: o });
  if (!r.ok) throw await Lu(r);
  return r;
}
async function Lu(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new ht(t, e.status, i);
}
const T = async (e) => e.json();
async function Fu(e) {
  const t = await w("/templates?take=500", e);
  return (await T(t)).items;
}
const go = async (e, t) => T(await w(`/templates/${e}`, t)), Uu = async (e, t) => T(await w("/templates", t, { method: "POST", json: e })), Wu = async (e, t) => T(await w(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Nu(e, t) {
  await w(`/templates/${e}`, t, { method: "DELETE" });
}
const Bu = async (e, t, i) => T(await w(`/templates/${e}/duplicate`, i, { method: "POST", json: { targetKey: t } })), Ku = async (e, t, i) => T(await w(`/templates/${e}/enabled`, i, { method: "PUT", json: { isEnabled: t } }));
async function ju(e, t) {
  return (await w(`/templates/${e}/export`, t)).blob();
}
const Vu = async (e, t, i, a = null) => T(await w("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function dn(e, t, i, a) {
  const s = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && s.set("foldersOnly", "true"), a && s.set("parentKey", a), s.toString();
}
const mr = async (e, t, i, a) => T(await w(`/tree/root?${dn(e, t, i)}`, a)), qu = async (e, t, i, a, s) => T(await w(`/tree/children?${dn(t, i, a, e)}`, s)), Gu = async (e, t) => T(await w(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function vo(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return T(await w(`/item?${i}`, t));
}
async function Hu(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), T(await w(`/collection/templates?${i}`, t));
}
async function Yu(e, t, i) {
  return (await w(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const Xu = async (e, t) => T(await w("/folders", t, { method: "POST", json: e })), Ju = async (e, t) => T(await w(`/folders/${e}`, t)), Zu = async (e, t, i) => T(await w(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function Qu(e, t) {
  await w(`/folders/${e}`, t, { method: "DELETE" });
}
async function ed(e, t, i) {
  await w(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function td(e, t, i) {
  await w(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
const za = async (e) => T(await w("/fonts", e));
async function id(e, t) {
  const i = new FormData();
  return i.append("file", e), T(await w("/fonts", t, { method: "POST", body: i }));
}
const ad = async (e, t) => T(await w("/fonts/register-path", t, { method: "POST", json: { path: e } })), sd = async (e, t) => T(await w("/fonts/register-web", t, { method: "POST", json: e })), od = async (e, t) => T(await w(`/fonts/${e}/refresh`, t, { method: "POST" })), rd = async (e, t, i, a, s) => T(await w(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function nd(e, t) {
  await w(`/fonts/${e}`, t, { method: "DELETE" });
}
async function ld(e, t) {
  return (await w(`/fonts/${e}/file`, t)).arrayBuffer();
}
const hn = async (e) => T(await w("/document-types", e)), cd = async (e, t) => T(await w(`/document-types/${encodeURIComponent(e)}/properties`, t)), ud = async (e, t, i) => T(await w(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function pn(e, t, i) {
  return (await w("/preview", i, {
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
const mn = async (e, t, i) => T(await w("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), yn = async (e, t) => T(await w(`/media/${e}/image-info`, t)), bo = async (e, t) => T(await w(`/documents/${e}/regenerate`, t, { method: "POST" })), fn = async (e, t, i) => T(await w(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), dd = async (e, t) => T(await w(`/jobs/${e}`, t));
async function hd(e, t) {
  await w(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const pd = async (e, t) => T(await w(`/templates/${e}/usage`, t)), gn = async (e) => T(await w("/health", e)), md = async (e) => T(await w("/sync/status", e)), yd = async (e) => T(await w("/sync/export", e, { method: "POST" })), fd = async (e) => T(await w("/sync/import", e, { method: "POST" }));
function _o(e) {
  const t = `section/${ts}/workspace/${is}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function gd(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${ts}/workspace/${is}/create${t}`, document.baseURI).pathname;
}
function vn(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${ts}/workspace/${e}${i}`, document.baseURI).pathname;
}
function vd(e) {
  return new URL(`section/${ts}/dashboard/${e}`, document.baseURI).pathname;
}
function bn() {
  window.dispatchEvent(new CustomEvent(Es));
}
const as = () => crypto.randomUUID();
function ss(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function _n(e, t, i) {
  const { x: a, y: s } = ss(e);
  return {
    type: "text",
    key: as(),
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
function wn(e, t, i) {
  const { x: a, y: s } = ss(e);
  return {
    type: "image",
    key: as(),
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
function $n(e, t, i) {
  const { x: a, y: s } = ss(e);
  return {
    type: "badges",
    key: as(),
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
const zi = {
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
}, bd = Object.keys(zi);
function _d(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = ss(e), o = zi[i] ?? zi.rectangle;
  return {
    type: "rect",
    key: as(),
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
function wd(e) {
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
function $d(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (wd(e.classification)) {
    case "image":
      return { kind: "layer", layer: wn(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: $n(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: _n(t, e.name, xd(e)) };
  }
}
function xd(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function xn() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function kd(e) {
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
function Li(e) {
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
function Fi(e) {
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
function Cs(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return kn[a * 3 + i];
}
function os(e, t, i) {
  return {
    x: e.x - t * Li(e.anchor),
    y: e.y - i * Fi(e.anchor)
  };
}
function wo(e, t, i, a, s) {
  return {
    x: e + i * Li(s),
    y: t + a * Fi(s)
  };
}
function Td(e, t, i, a) {
  const s = os(e, t, i), o = wo(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function Sd(e, t) {
  const i = wo(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Tn(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function jt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, r = Math.cos(o), l = Math.sin(o), h = e - i, m = t - a;
  return { x: i + h * r - m * l, y: a + h * l + m * r };
}
function Ed(e, t, i, a, s) {
  return jt(e, t, i, a, -s);
}
function Sn(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    jt(e.x, e.y, t, i, a),
    jt(e.x + e.width, e.y, t, i, a),
    jt(e.x + e.width, e.y + e.height, t, i, a),
    jt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((m) => m.x)), r = Math.max(...s.map((m) => m.x)), l = Math.min(...s.map((m) => m.y)), h = Math.max(...s.map((m) => m.y));
  return { x: o, y: l, width: r - o, height: h - l };
}
const Cd = 10;
function Re(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function En(e) {
  return !!e.relativeX || !!e.relativeY;
}
function La(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function yr(e) {
  return e === "below" || e === "above";
}
function fr(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Dd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Od(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = fr(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const r = t.get(o);
    r && s.push(...fr(r.position).map((l) => l.layerKey));
  }
  return !1;
}
function Id(e, t, i) {
  const a = e.position;
  if (!En(a)) return a;
  if (Od(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, r = Li(a.anchor), l = Fi(a.anchor);
  const h = gr(e, a.relativeX, !1, t, i);
  h && (s = h.coordinate, r = h.factor);
  const m = gr(e, a.relativeY, !0, t, i);
  return m && (o = m.coordinate, l = m.factor), { x: s, y: o, anchor: Cs(r, l) };
}
function gr(e, t, i, a, s) {
  if (!t || yr(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let r = t.layerKey;
  for (; !o.has(r); ) {
    o.add(r);
    const l = a.get(r);
    if (!l) return;
    const h = s(r);
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
    const m = i ? l.position.relativeY : l.position.relativeX;
    if (!m || yr(m.edge) !== i) return;
    r = m.layerKey;
  }
}
function Pd(e, t, i) {
  const a = Dd(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), r = (l) => {
    const h = s.get(l.key);
    if (h) return h;
    let m;
    o.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), m = Id(l, a, (ye) => {
      const fe = a.get(ye);
      return fe && !i(fe) ? r(fe).extent : void 0;
    }), o.delete(l.key));
    const S = t(l), k = os(m, S.width, S.height), j = { x: k.x, y: k.y, width: S.width, height: S.height }, te = { position: m, box: j, extent: Sn(j, m.x, m.y, l.rotation ?? 0) };
    return s.set(l.key, te), te;
  };
  for (const l of e) r(l);
  return s;
}
function Ds(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? Cs(Li(i.anchor), Fi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? Cs(Li(e.anchor), Fi(i.anchor)) : e.anchor
  };
}
var le, We, Ie, st;
class Ad {
  constructor(t = 100) {
    x(this, le, []);
    x(this, We, []);
    x(this, Ie, 0);
    x(this, st);
    this.limit = t;
  }
  get canUndo() {
    return d(this, le).length > 0;
  }
  get canRedo() {
    return d(this, We).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    d(this, Ie) > 0 || (d(this, le).push(structuredClone(t)), d(this, le).length > this.limit && d(this, le).shift(), b(this, We, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    d(this, Ie) === 0 && b(this, st, structuredClone(t)), ds(this, Ie)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    d(this, Ie) !== 0 && (ds(this, Ie)._--, !(d(this, Ie) > 0) && (t && d(this, st) !== void 0 && (d(this, le).push(d(this, st)), d(this, le).length > this.limit && d(this, le).shift(), b(this, We, [])), b(this, st, void 0)));
  }
  undo(t) {
    const i = d(this, le).pop();
    if (i !== void 0)
      return d(this, We).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = d(this, We).pop();
    if (i !== void 0)
      return d(this, le).push(structuredClone(t)), i;
  }
  clear() {
    b(this, le, []), b(this, We, []), b(this, Ie, 0), b(this, st, void 0);
  }
}
le = new WeakMap(), We = new WeakMap(), Ie = new WeakMap(), st = new WeakMap();
const Os = 3, Md = (e) => Rd(e), vr = (e, t) => e.slice(0, Math.max(0, t)).join("."), Rd = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), zd = "Page";
function Ld(e) {
  return e.isSystem ? zd : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const Nt = (e) => e ?? Number.MAX_SAFE_INTEGER;
function Fd(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || Nt(t.property.tabSortOrder) - Nt(i.property.tabSortOrder) || Nt(t.property.groupSortOrder) - Nt(i.property.groupSortOrder) || Nt(t.property.sortOrder) - Nt(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function Ud(e, t) {
  const i = Fd(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: Ld(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function Wd(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const Nd = "DynamicImages.Workspace.Template", Bd = 12, br = 36;
var Qt, ot, kt, Tt, ei, St, ti, ii, Et, rt, ai, Ne, si, oi, ce, Zi, Ct, Pe, Dt, _, Cn, ri, ni, Is, Ps, As, Fe, bt, Ms, ga, Dn, On, In, Rs;
class Kd extends du {
  constructor(i) {
    super(i, Nd);
    x(this, _);
    x(this, Qt);
    x(this, ot);
    x(this, kt);
    x(this, Tt);
    x(this, ei);
    x(this, St);
    x(this, ti);
    x(this, ii);
    x(this, Et);
    x(this, rt);
    x(this, ai);
    x(this, Ne);
    x(this, si);
    x(this, oi);
    x(this, ce);
    x(this, Zi);
    x(this, Ct);
    x(this, Pe);
    x(this, Dt);
    x(this, ri);
    x(this, ni);
    this._data = new hu(this), this.template = this._data.current, b(this, Qt, new vi([], (a) => a.key)), this.layers = d(this, Qt).asObservable(), b(this, ot, new hr(void 0)), this.selectedLayerKey = d(this, ot).asObservable(), b(this, kt, new vi([], (a) => a.alias)), this.properties = d(this, kt).asObservable(), b(this, Tt, new pr({})), this.linkedProperties = d(this, Tt).asObservable(), b(this, ei, new pr({})), this.linkedCaptions = d(this, ei).asObservable(), b(this, St, new vi([], (a) => a.key)), this.fonts = d(this, St).asObservable(), b(this, ti, new vi([], (a) => a.key)), this.serverBounds = d(this, ti).asObservable(), b(this, ii, new vi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = d(this, ii).asObservable(), b(this, Et, new hr(void 0)), this.sampleContentKey = d(this, Et).asObservable(), b(this, rt, new ha(!0)), this.useSampleData = d(this, rt).asObservable(), b(this, ai, new Pu(1)), this.zoom = d(this, ai).asObservable(), b(this, Ne, new ha(!0)), this.loading = d(this, Ne).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), b(this, si, new ha(!1)), this.canUndo = d(this, si).asObservable(), b(this, oi, new ha(!1)), this.canRedo = d(this, oi).asObservable(), b(this, ce, new Ad()), b(this, Pe, !1), b(this, Dt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), b(this, ri, async (a) => {
      const s = a.detail;
      if (d(this, Dt) || !(s != null && s.url) || !E(this, _, Cn).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await ln(this, Tu), b(this, Dt, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), b(this, ni, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = d(this, Zi)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => ps),
        setup: (a, s) => {
          const o = s.match.params.parentUnique;
          return this.createScaffold(void 0, o && o !== "null" ? o : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => ps),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => ps),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Le, (a) => {
      b(this, Zi, a);
    }), this.consumeContext(oe, (a) => {
      b(this, Ct, a);
    }), window.addEventListener("willchangestate", d(this, ri)), window.addEventListener("beforeunload", d(this, ni)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return d(this, Pe);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    d(this, Ne).setValue(!0), b(this, Pe, !1);
    try {
      const a = await go(i, this.getToken);
      E(this, _, bt).call(this, a, { resetHistory: !0, persist: !0 }), E(this, _, On).call(this), this.setIsNew(!1), await E(this, _, Is).call(this, a);
    } catch (a) {
      E(this, _, Rs).call(this, "This template could not be loaded", a);
    } finally {
      d(this, Ne).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    d(this, Ne).setValue(!0), b(this, Pe, !0), E(this, _, bt).call(this, { ...kd(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await E(this, _, Is).call(this, this._data.getCurrent()), d(this, Ne).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await E(this, _, As).call(this, i.docTypeAliases);
    d(this, kt).setValue(a), d(this, Tt).setValue(await E(this, _, Ps).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    d(this, St).setValue(await za(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    E(this, _, Fe).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    E(this, _, Fe).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    E(this, _, Fe).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    E(this, _, Fe).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    E(this, _, Fe).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    E(this, _, Fe).call(this, (s) => ({
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
    E(this, _, Fe).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, h;
        let r = o.position;
        return ((l = La(r, "x")) == null ? void 0 : l.layerKey) === i && (r = Ds(r, "x", a == null ? void 0 : a.get(o.key))), ((h = La(r, "y")) == null ? void 0 : h.layerKey) === i && (r = Ds(r, "y", a == null ? void 0 : a.get(o.key))), r === o.position ? o : { ...o, position: r };
      })
    })), d(this, ot).getValue() === i && this.selectLayer(void 0);
  }
  duplicateLayer(i) {
    var o;
    const a = (o = this._data.getCurrent()) == null ? void 0 : o.layers.find((r) => r.key === i);
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
    E(this, _, Fe).call(this, (s) => {
      const o = [...s.layers], r = o.findIndex((h) => h.key === i);
      if (r < 0) return s;
      const [l] = o.splice(r, 1);
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
    d(this, ot).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = d(this, ot).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && d(this, ce).begin(i);
  }
  endTransaction(i = !0) {
    d(this, ce).end(i), E(this, _, Ms).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = d(this, ce).undo(i);
    a && E(this, _, bt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = d(this, ce).redo(i);
    a && E(this, _, bt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    d(this, ti).setValue(i);
  }
  setIssues(i) {
    d(this, ii).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    d(this, Et).setValue(i), d(this, rt).setValue(!i), E(this, _, Dn).call(this, i);
  }
  setUseSampleData(i) {
    d(this, rt).setValue(i);
  }
  setZoom(i) {
    d(this, ai).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = d(this, Pe) ? await Uu(i, this.getToken) : await Wu(i, this.getToken);
      E(this, _, bt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const r = d(this, Pe);
      b(this, Pe, !1), this.setIsNew(!1), bn(), await E(this, _, In).call(this, o.template, r), (a = d(this, Ct)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = d(this, Ct)) == null || s.peek("warning", { data: { message: l.message } });
      r && window.history.replaceState({}, "", _o(o.template.key));
    } catch (o) {
      throw E(this, _, Rs).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), b(this, Dt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", d(this, ri)), window.removeEventListener("beforeunload", d(this, ni)), d(this, ce).clear(), super.destroy();
  }
}
Qt = new WeakMap(), ot = new WeakMap(), kt = new WeakMap(), Tt = new WeakMap(), ei = new WeakMap(), St = new WeakMap(), ti = new WeakMap(), ii = new WeakMap(), Et = new WeakMap(), rt = new WeakMap(), ai = new WeakMap(), Ne = new WeakMap(), si = new WeakMap(), oi = new WeakMap(), ce = new WeakMap(), Zi = new WeakMap(), Ct = new WeakMap(), Pe = new WeakMap(), Dt = new WeakMap(), _ = new WeakSet(), /**
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
Cn = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, ri = new WeakMap(), ni = new WeakMap(), Is = async function(i) {
  const [a, s] = await Promise.all([
    za(this.getToken).catch(() => []),
    E(this, _, As).call(this, i.docTypeAliases)
  ]);
  d(this, St).setValue(a), d(this, kt).setValue(s), d(this, Tt).setValue(await E(this, _, Ps).call(this, i.docTypeAliases, s));
}, Ps = async function(i, a) {
  const s = {}, o = {};
  if (i.length === 0) return s;
  let r = a.filter((h) => h.classification === "content").slice(0, Bd).map((h) => h.alias), l = 0;
  for (let h = 1; h <= Os && r.length > 0 && l < br; h++) {
    const m = r.slice(0, br - l);
    l += m.length;
    const S = await Promise.all(m.map(async (k) => {
      var gi;
      const j = await Promise.all(
        i.map((ie) => ud(ie, k, this.getToken).catch(() => null))
      ), te = /* @__PURE__ */ new Map();
      for (const ie of j.flatMap((_e) => (_e == null ? void 0 : _e.properties) ?? []))
        te.has(ie.alias) || te.set(ie.alias, ie);
      const ye = j.filter((ie) => ie !== null), fe = [...new Set(ye.flatMap((ie) => ie.targetDocTypes.map((_e) => _e.name)))], Wt = ye.some((ie) => ie.inference === "all") ? "all" : (gi = ye[0]) == null ? void 0 : gi.inference;
      return { prefix: k, properties: [...te.values()], caption: Wd(fe, Wt) };
    }));
    r = [];
    for (const k of S)
      k.properties.length !== 0 && (s[k.prefix] = k.properties, o[k.prefix] = k.caption, h < Os && r.push(...k.properties.filter((j) => j.classification === "content" && !j.isSystem).map((j) => `${k.prefix}.${j.alias}`)));
  }
  return d(this, ei).setValue(o), s;
}, As = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => cd(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Fe = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && d(this, ce).push(s);
  const o = i(structuredClone(s));
  E(this, _, bt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
bt = function(i, a) {
  a != null && a.resetHistory && d(this, ce).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), d(this, Qt).setValue(i.layers), E(this, _, Ms).call(this);
}, Ms = function() {
  d(this, si).setValue(d(this, ce).canUndo), d(this, oi).setValue(d(this, ce).canRedo);
}, ga = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, Dn = function(i) {
  try {
    i ? localStorage.setItem(E(this, _, ga).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(E(this, _, ga).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
On = function() {
  let i;
  try {
    const a = localStorage.getItem(E(this, _, ga).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  d(this, Et).setValue(i), d(this, rt).setValue(!i);
}, In = async function(i, a) {
  const s = await this.getContext(ia).catch(() => {
  });
  s && (a ? s.dispatchEvent(new es({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : s.dispatchEvent(new nn({ entityType: "di-template", unique: i.key })));
}, Rs = function(i, a) {
  var o;
  const s = a instanceof ht ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = d(this, Ct)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const gt = new Qa(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), pt = "di-template-root", q = "di-template-folder", ue = is, Oi = "DynamicImages.Tree.Templates", Ii = "DynamicImages.Repository.TemplateTree", Pi = "DynamicImages.Repository.TemplateFolder", jd = "DynamicImages.Store.TemplateFolder", Fa = "DynamicImages.Workspace.TemplateFolder", Pn = "DynamicImages.Workspace.TemplateRoot", _r = "DynamicImages.Repository.TemplateItem", Vd = "DynamicImages.Store.TemplateItem", wr = "DynamicImages.Repository.TemplateDetail", qd = "DynamicImages.Store.TemplateDetail", $r = "DynamicImages.Repository.MoveTemplate", xr = "DynamicImages.Repository.MoveTemplateFolder", kr = "DynamicImages.Repository.DuplicateTemplate", An = "icon-picture", Mn = "icon-picture color-grey", Rn = "icon-folder", zs = "DynamicImages.Collection.Templates", Tr = "DynamicImages.Repository.TemplateCollection";
async function U(e, t) {
  const i = (async () => {
    const a = await new yu(e, Le).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (s) {
      throw s instanceof ht ? { type: "error", title: s.message, status: s.status, detail: s.detail } : s;
    }
  })();
  return await Cu(e, i);
}
var nt;
class Gd {
  constructor(t) {
    x(this, nt);
    b(this, nt, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: q,
      unique: bu.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await U(d(this, nt), (s) => Ju(t, s));
    return i ? { data: { entityType: q, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await U(d(this, nt), (o) => Xu({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await U(d(this, nt), (s) => Zu(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return U(d(this, nt), (i) => Qu(t, i));
  }
}
nt = new WeakMap();
const $o = new Qa("DiTemplateFolderStore");
class zn extends on {
  constructor(t) {
    super(t, $o);
  }
}
class Sr extends sn {
  constructor(t) {
    super(t, Gd, $o);
  }
}
const Hd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: $o,
  DiTemplateFolderRepository: Sr,
  DiTemplateFolderStore: zn,
  api: Sr
}, Symbol.toStringTag, { value: "Module" })), Yd = [
  {
    type: "repository",
    alias: Pi,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => Hd)
  },
  {
    type: "store",
    alias: jd,
    name: "Dynamic Images Template Folder Store",
    api: zn
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [q],
    meta: { folderRepositoryAlias: Pi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [q],
    meta: { folderRepositoryAlias: Pi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Fa,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => uh),
    meta: { entityType: q }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: Ts,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Fa }]
  }
], Xd = [
  {
    type: "repository",
    alias: Ii,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => ph)
  },
  {
    type: "tree",
    kind: "default",
    alias: Oi,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: Ii }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [pt, q, ue]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: Oi, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: Pn,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: pt, headline: "Templates" }
  },
  ...Yd
], xo = new Qa("DiTemplateItemStore");
class Ln extends vu {
  constructor(t) {
    super(t, xo);
  }
}
class Jd extends gu {
  constructor(t) {
    super(t, {
      getItems: (i) => U(t, (a) => vo(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? q : ue,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class Er extends fu {
  constructor(t) {
    super(t, Jd, xo);
  }
}
const Zd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: xo,
  DiTemplateItemRepository: Er,
  DiTemplateItemStore: Ln,
  api: Er
}, Symbol.toStringTag, { value: "Module" })), ko = new Qa("DiTemplateDetailStore");
class Fn extends on {
  constructor(t) {
    super(t, ko);
  }
}
const hs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var li;
class Qd {
  constructor(t) {
    x(this, li);
    this.createScaffold = hs, this.create = hs, this.update = hs, b(this, li, t);
  }
  async read(t) {
    const { data: i, error: a } = await U(d(this, li), (s) => go(t, s));
    return i ? { data: { entityType: ue, unique: i.key, name: i.name } } : { error: a };
  }
  delete(t) {
    return U(d(this, li), (i) => Nu(t, i));
  }
}
li = new WeakMap();
class Cr extends sn {
  constructor(t) {
    super(t, Qd, ko);
  }
}
const eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: ko,
  DiTemplateDetailRepository: Cr,
  DiTemplateDetailStore: Fn,
  api: Cr
}, Symbol.toStringTag, { value: "Module" })), bi = [pt, q], th = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: _r,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => Zd)
  },
  {
    type: "itemStore",
    alias: Vd,
    name: "Dynamic Images Template Item Store",
    api: Ln
  },
  {
    type: "repository",
    alias: wr,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => eh)
  },
  {
    type: "store",
    alias: qd,
    name: "Dynamic Images Template Detail Store",
    api: Fn
  },
  {
    type: "repository",
    alias: $r,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => fh)
  },
  {
    type: "repository",
    alias: xr,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => gh)
  },
  {
    type: "repository",
    alias: kr,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => vh)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: bi,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => bh),
    forEntityTypes: bi,
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
    forEntityTypes: bi,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Pi
    }
  },
  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [ue],
    meta: {
      treeRepositoryAlias: Ii,
      moveRepositoryAlias: $r,
      treeAlias: Oi,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Template To",
    forEntityTypes: [ue],
    meta: {
      duplicateRepositoryAlias: kr,
      treeRepositoryAlias: Ii,
      treeAlias: Oi,
      foldersOnly: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Enable",
    name: "Enable Dynamic Images Template",
    api: () => Promise.resolve().then(() => _h),
    forEntityTypes: [ue],
    weight: 560,
    meta: { icon: "icon-check", label: "Enable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Disable",
    name: "Disable Dynamic Images Template",
    api: () => Promise.resolve().then(() => wh),
    forEntityTypes: [ue],
    weight: 550,
    meta: { icon: "icon-block", label: "Disable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => $h),
    forEntityTypes: [ue],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => kh),
    forEntityTypes: [ue],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [ue],
    meta: {
      itemRepositoryAlias: _r,
      detailRepositoryAlias: wr,
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
    forEntityTypes: [q],
    meta: {
      treeRepositoryAlias: Ii,
      moveRepositoryAlias: xr,
      treeAlias: Oi,
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
    api: () => Promise.resolve().then(() => Eh),
    forEntityTypes: bi,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: bi
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => Ah)
  }
], pa = [{ alias: "Umb.Condition.CollectionAlias", match: zs }], ih = [
  {
    type: "repository",
    alias: Tr,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => Mh)
  },
  {
    type: "collection",
    kind: "default",
    alias: zs,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => Rh),
    meta: { repositoryAlias: Tr }
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
        { field: "isEnabled", label: "Enabled", valueType: _u },
        { field: "updated", label: "Last updated", valueType: wu }
      ]
    },
    conditions: pa
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: pa
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => Uh),
    forEntityTypes: [ue]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: pa
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: pa
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
      collectionAlias: zs
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [Pn, Fa]
      }
    ]
  }
], ah = [
  ...Xd,
  ...th,
  ...ih,
  // ---------------------------------------------------------------- sidebar
  //
  // The sidebar app, the menu and the Fonts/Health link items are NOT here - they live in
  // wwwroot/App_Plugins/DynamicImages/umbraco-package.json, which Umbraco reads before this
  // bundle loads, so the section chrome paints immediately rather than after the entry point
  // has downloaded. None of them needs an element, so nothing is lost by moving them.
  //
  // The Templates tree's menu item is in tree/manifests.ts: a `tree` kind menu item, which needs
  // the tree registered first.
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => Kh),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Xh),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => ep),
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
    api: Kd,
    meta: { entityType: is }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => Tm),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Dm),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Mm),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Um),
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
    api: () => Promise.resolve().then(() => Wm),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Nm),
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
    api: () => Promise.resolve().then(() => Bm),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Km),
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
    element: () => Promise.resolve().then(() => Xm)
  }
], Cy = (e, t) => {
  t.registerMany(ah);
};
var sh = Object.defineProperty, oh = Object.getOwnPropertyDescriptor, Un = (e) => {
  throw TypeError(e);
}, To = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? oh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && sh(t, i, s), s;
}, So = (e, t, i) => t.has(e) || Un("Cannot " + i), rh = (e, t, i) => (So(e, t, "read from private field"), t.get(e)), Dr = (e, t, i) => t.has(e) ? Un("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), nh = (e, t, i, a) => (So(e, t, "write to private field"), t.set(e, i), i), lh = (e, t, i) => (So(e, t, "access private method"), i), Ua, Ls, Wn;
let Rt = class extends L {
  constructor() {
    super(), Dr(this, Ls), Dr(this, Ua), this._name = "", this._loading = !0, this.consumeContext(gt, (e) => {
      nh(this, Ua, e), e && (this.observe(e.template, (t) => {
        this._name = (t == null ? void 0 : t.name) ?? "";
      }), this.observe(e.loading, (t) => {
        this._loading = t ?? !1;
      }));
    });
  }
  render() {
    return n`
      <umb-workspace-editor alias="DynamicImages.Workspace.Template" .loading=${this._loading}>
        <div slot="header" class="header">
          <uui-input
            id="name"
            label="Template name"
            placeholder="Give this template a name"
            .value=${this._name}
            @input=${lh(this, Ls, Wn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Ua = /* @__PURE__ */ new WeakMap();
Ls = /* @__PURE__ */ new WeakSet();
Wn = function(e) {
  var i;
  const t = e.target.value;
  (i = rh(this, Ua)) == null || i.updateTemplateFields({ name: t });
};
Rt.styles = A`
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
To([
  y()
], Rt.prototype, "_name", 2);
To([
  y()
], Rt.prototype, "_loading", 2);
Rt = To([
  M("di-template-editor")
], Rt);
const ch = Rt, ps = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Rt;
  },
  default: ch
}, Symbol.toStringTag, { value: "Module" }));
class Or extends pu {
  constructor(t) {
    super(t, {
      workspaceAlias: Fa,
      entityType: q,
      detailRepositoryAlias: Pi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => ey),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: Or,
  api: Or
}, Symbol.toStringTag, { value: "Module" }));
function ms(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function dh(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? q : pt
    },
    name: e.name,
    entityType: t ? q : ue,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? Rn : e.isEnabled ? An : Mn,
    isEnabled: e.isEnabled
  };
}
class hh extends $u {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = ms(i);
        return U(t, (o) => mr(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: r, take: l } = ms(i);
          return U(t, (h) => mr(r, l, i.foldersOnly ?? !1, h));
        }
        const a = i.parent.unique, { skip: s, take: o } = ms(i);
        return U(t, (r) => qu(a, s, o, i.foldersOnly ?? !1, r));
      },
      getAncestorsOf: (i) => U(t, (a) => Gu(i.treeItem.unique, a)),
      mapper: dh
    });
  }
}
class Ir extends xu {
  constructor(t) {
    super(t, hh);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: pt,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const ph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: Ir,
  api: Ir
}, Symbol.toStringTag, { value: "Module" }));
class Nn extends yo {
  async requestMoveTo(t) {
    const { error: i } = await U(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(oe);
      a == null || a.peek("positive", { data: { message: "Moved" } });
      const s = await this.getContext(ia).catch(() => {
      }), o = t.destination.unique;
      s == null || s.dispatchEvent(new es({
        entityType: o ? q : pt,
        unique: o
      }));
    }
    return { error: i };
  }
}
class mh extends Nn {
  constructor() {
    super(...arguments), this.move = ed;
  }
}
class yh extends Nn {
  constructor() {
    super(...arguments), this.move = td;
  }
}
const fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: mh
}, Symbol.toStringTag, { value: "Module" })), gh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: yh
}, Symbol.toStringTag, { value: "Module" }));
class Pr extends yo {
  async requestDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: s } = await U(this, (o) => Bu(t.unique, i, o));
    if (a) {
      const o = await this.getContext(oe);
      o == null || o.peek("positive", { data: { message: `'${a.template.name}' created` } });
      const r = await this.getContext(ia).catch(() => {
      });
      r == null || r.dispatchEvent(new es({
        entityType: i ? q : pt,
        unique: i
      }));
    }
    return { error: s };
  }
}
const vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateToTemplateRepository: Pr,
  api: Pr
}, Symbol.toStringTag, { value: "Module" }));
class Ar extends ku {
  async getHref() {
    return gd({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: Ar,
  api: Ar
}, Symbol.toStringTag, { value: "Module" }));
class Eo extends aa {
  async execute() {
    var m;
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await U(this, (S) => Ku(t, this.enable, S));
    if (a || !i) throw a ?? new Error("The template could not be changed.");
    const { data: s } = await U(this, (S) => vo([t], S)), o = ((m = s == null ? void 0 : s[0]) == null ? void 0 : m.name) ?? "The template", r = this.enable ? "enabled" : "disabled", l = await this.getContext(oe);
    if (!i.changed) {
      l == null || l.peek("default", { data: { message: `'${o}' is already ${r}` } });
      return;
    }
    l == null || l.peek("positive", { data: { message: `'${o}' ${r}` } });
    const h = await this.getContext(ia).catch(() => {
    });
    h == null || h.dispatchEvent(new nn({ unique: t, entityType: this.args.entityType })), bn();
  }
}
class Mr extends Eo {
  constructor() {
    super(...arguments), this.enable = !0;
  }
}
const _h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiEnableTemplateEntityAction: Mr,
  DiSetTemplateEnabledEntityAction: Eo,
  api: Mr
}, Symbol.toStringTag, { value: "Module" }));
class Rr extends Eo {
  constructor() {
    super(...arguments), this.enable = !1;
  }
}
const wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDisableTemplateEntityAction: Rr,
  api: Rr
}, Symbol.toStringTag, { value: "Module" }));
class zr extends aa {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await U(this, async (r) => ({
      blob: await ju(t, r),
      alias: (await go(t, r)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const s = URL.createObjectURL(i.blob), o = document.createElement("a");
    o.href = s, o.download = `${i.alias}.json`, o.click(), URL.revokeObjectURL(s);
  }
}
const $h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: zr,
  api: zr
}, Symbol.toStringTag, { value: "Module" })), xh = 1500;
async function Bn(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((s) => setTimeout(s, xh));
    try {
      a = await dd(a.id, t);
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
class Lr extends aa {
  async execute() {
    var h;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await U(this, (m) => vo([t], m)), a = ((h = i == null ? void 0 : i[0]) == null ? void 0 : h.name) ?? "this template";
    await fo(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: s, error: o } = await U(this, (m) => fn(t, !1, m));
    if (o || !s) throw o ?? new Error("Regeneration could not be started.");
    const r = await this.getContext(oe);
    r == null || r.peek("positive", { data: { message: `Regenerating ${s.total} item(s)…` } });
    const l = await this.getContext(Le);
    await Bn(s, () => l == null ? void 0 : l.getLatestToken(), r);
  }
}
const kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: Lr,
  api: Lr
}, Symbol.toStringTag, { value: "Module" })), Th = new cn(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), Sh = new cn(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class Fr extends aa {
  async execute() {
    const { json: t } = await ln(this, Sh, { data: {} }), i = this.args.unique ?? null, { data: a, error: s } = await U(this, (l) => Vu(t, "create", l, i));
    if (s || !a) throw s ?? new Error("The template could not be imported.");
    const o = await this.getContext(oe);
    o == null || o.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) o == null || o.peek("warning", { data: { message: l.message } });
    const r = await this.getContext(ia);
    r == null || r.dispatchEvent(new es({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const Eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: Fr,
  api: Fr
}, Symbol.toStringTag, { value: "Module" }));
var Ch = Object.defineProperty, Dh = Object.getOwnPropertyDescriptor, Kn = (e) => {
  throw TypeError(e);
}, jn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Ch(t, i, s), s;
}, Oh = (e, t, i) => t.has(e) || Kn("Cannot " + i), Ih = (e, t, i) => t.has(e) ? Kn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ur = (e, t, i) => (Oh(e, t, "access private method"), i), va, Vn, qn;
let di = class extends un {
  constructor() {
    super(...arguments), Ih(this, va), this._json = "";
  }
  render() {
    return n`
      <umb-body-layout headline="Import template">
        <uui-box>
          <umb-property-layout
            orientation="vertical"
            label="Template JSON"
            description="Paste an exported template, or choose its .json file. An alias already in use gets a new one.">
            <div slot="editor" class="editor">
              <input type="file" accept=".json,application/json" @change=${Ur(this, va, Vn)} aria-label="Choose a file" />
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
            @click=${Ur(this, va, qn)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
va = /* @__PURE__ */ new WeakSet();
Vn = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
qn = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
di.styles = [
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
jn([
  y()
], di.prototype, "_json", 2);
di = jn([
  M("di-import-template-modal")
], di);
const Ph = di, Ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return di;
  },
  default: Ph
}, Symbol.toStringTag, { value: "Module" }));
function Gn(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? q : ue,
    name: e.name,
    icon: t ? Rn : e.isEnabled ? An : Mn,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class Wr extends yo {
  async requestCollection(t = {}) {
    const i = await this.getContext(Eu), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: o } = await U(this, (r) => Hu({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, r));
    return s ? { data: { total: s.total, items: s.items.map(Gn) } } : { error: o };
  }
}
const Mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: Wr,
  api: Wr,
  mapCollectionItem: Gn
}, Symbol.toStringTag, { value: "Module" }));
class Nr extends Du {
  async requestItemHref(t) {
    return t.entityType === q ? vn(q, t.unique) : _o(t.unique);
  }
}
const Rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: Nr,
  api: Nr
}, Symbol.toStringTag, { value: "Module" }));
var zh = Object.defineProperty, Lh = Object.getOwnPropertyDescriptor, Hn = (e) => {
  throw TypeError(e);
}, Ye = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Lh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && zh(t, i, s), s;
}, Co = (e, t, i) => t.has(e) || Hn("Cannot " + i), Wa = (e, t, i) => (Co(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ma = (e, t, i) => t.has(e) ? Hn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ba = (e, t, i, a) => (Co(e, t, "write to private field"), t.set(e, i), i), ys = (e, t, i) => (Co(e, t, "access private method"), i), Na, xi, Ui, ki, Yn, Xn, Jn;
const Fh = 400;
let he = class extends L {
  constructor() {
    super(), ma(this, ki), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, ma(this, Na), ma(this, xi), ma(this, Ui), this.consumeContext(Le, (e) => {
      ba(this, Na, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), ba(this, xi, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && ys(this, ki, Yn).call(this);
    })), Wa(this, xi).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Wa(this, xi)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, ba(this, Ui, void 0);
  }
  render() {
    return this.item ? n`
      <uui-card-media
        name=${this.item.name}
        detail=${Ss(this.item.docTypes || void 0)}
        href=${Ss(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${ys(this, ki, Xn)}
        @deselected=${ys(this, ki, Jn)}>
        ${this._src ? n`<img src=${this._src} alt=${this.item.name} />` : n`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? n`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : p}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : p;
  }
};
Na = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
Ui = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakSet();
Yn = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || Wa(this, Ui) === t)) {
    ba(this, Ui, t);
    try {
      const i = await Yu(e.unique, Fh, () => {
        var a;
        return (a = Wa(this, Na)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
Xn = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Ou(this.item.unique)));
};
Jn = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Iu(this.item.unique)));
};
he.styles = [
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
Ye([
  g({ type: Object })
], he.prototype, "item", 2);
Ye([
  g({ type: Boolean })
], he.prototype, "selectable", 2);
Ye([
  g({ type: Boolean })
], he.prototype, "selected", 2);
Ye([
  g({ type: Boolean, attribute: "select-only" })
], he.prototype, "selectOnly", 2);
Ye([
  g({ type: Boolean })
], he.prototype, "disabled", 2);
Ye([
  g({ type: String })
], he.prototype, "href", 2);
Ye([
  y()
], he.prototype, "_src", 2);
Ye([
  y()
], he.prototype, "_failed", 2);
he = Ye([
  M("di-template-collection-card")
], he);
const Uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return he;
  },
  get element() {
    return he;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Wh = Object.defineProperty, Nh = Object.getOwnPropertyDescriptor, Zn = (e) => {
  throw TypeError(e);
}, sa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Nh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Wh(t, i, s), s;
}, Do = (e, t, i) => t.has(e) || Zn("Cannot " + i), ct = (e, t, i) => (Do(e, t, "read from private field"), t.get(e)), _i = (e, t, i) => t.has(e) ? Zn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Br = (e, t, i, a) => (Do(e, t, "write to private field"), t.set(e, i), i), Ke = (e, t, i) => (Do(e, t, "access private method"), i), Ti, Ba, _a, Ai, Te, Fs, Qn, el, Si, tl;
let je = class extends L {
  constructor() {
    super(), _i(this, Te), _i(this, Ti), _i(this, Ba), this._templates = [], this._fonts = [], this._loading = !0, _i(this, _a, () => {
      ct(this, Ti) && Ke(this, Te, Fs).call(this);
    }), _i(this, Ai, () => {
      var e;
      return (e = ct(this, Ti)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(oe, (e) => {
      Br(this, Ba, e);
    }), this.consumeContext(Le, (e) => {
      Br(this, Ti, e), e && Ke(this, Te, Fs).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Es, ct(this, _a));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Es, ct(this, _a));
  }
  render() {
    return this._loading ? n`<div class="state"><uui-loader></uui-loader></div>` : n`
      <umb-body-layout headline="Dynamic Images">
        ${Ke(this, Te, el).call(this)} ${Ke(this, Te, tl).call(this)}
      </umb-body-layout>
    `;
  }
};
Ti = /* @__PURE__ */ new WeakMap();
Ba = /* @__PURE__ */ new WeakMap();
_a = /* @__PURE__ */ new WeakMap();
Ai = /* @__PURE__ */ new WeakMap();
Te = /* @__PURE__ */ new WeakSet();
Fs = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Fu(ct(this, Ai)),
      za(ct(this, Ai)).catch(() => []),
      gn(ct(this, Ai)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    Ke(this, Te, Qn).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Qn = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = ct(this, Ba)) == null || s.peek(e, { data: { headline: t, message: a } });
};
el = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return n`
      <div class="stats">
        ${Ke(this, Te, Si).call(this, "Templates", this._templates.length, "icon-brush", !1, vn(pt))}
        ${Ke(this, Te, Si).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${Ke(this, Te, Si).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${Ke(this, Te, Si).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
Si = function(e, t, i, a = !1, s) {
  const o = n`
      <uui-icon name=${i}></uui-icon>
      <div class="stat-value">${t}</div>
      <div class="stat-label">${e}</div>
    `;
  return n`
      <uui-box class="stat ${a ? "warn" : ""}">
        ${s ? n`<a class="stat-link" href=${s} aria-label="${e}: ${t}">${o}</a>` : o}
      </uui-box>
    `;
};
tl = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : n`
      <uui-box headline="Needs attention">
        <uui-table>
          ${Z(
    e.slice(0, 8),
    (i, a) => `${i.code}-${a}`,
    (i) => n`
              <uui-table-row>
                <uui-table-cell style="width: 90px">
                  <uui-tag color=${i.severity === "error" ? "danger" : "warning"} look="secondary">
                    ${i.severity}
                  </uui-tag>
                </uui-table-cell>
                <uui-table-cell>
                  ${i.templateName ? n`<strong>${i.templateName}</strong> — ` : p}${i.message}
                </uui-table-cell>
              </uui-table-row>
            `
  )}
        </uui-table>
        <uui-button look="secondary" href=${vd("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
je.styles = A`
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
sa([
  y()
], je.prototype, "_templates", 2);
sa([
  y()
], je.prototype, "_fonts", 2);
sa([
  y()
], je.prototype, "_health", 2);
sa([
  y()
], je.prototype, "_loading", 2);
je = sa([
  M("di-overview-dashboard")
], je);
const Bh = je, Kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return je;
  },
  default: Bh
}, Symbol.toStringTag, { value: "Module" })), Us = /* @__PURE__ */ new Map(), rs = (e) => `di-${e}`;
function jh(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Us.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await ld(e, t), o = new FontFace(rs(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return Us.set(e, a), a;
}
async function il(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => jh(a, t)));
}
function al(e) {
  Us.delete(e);
}
var Vh = Object.defineProperty, qh = Object.getOwnPropertyDescriptor, sl = (e) => {
  throw TypeError(e);
}, ns = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Vh(t, i, s), s;
}, Oo = (e, t, i) => t.has(e) || sl("Cannot " + i), Me = (e, t, i) => (Oo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), wi = (e, t, i) => t.has(e) ? sl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fs = (e, t, i, a) => (Oo(e, t, "write to private field"), t.set(e, i), i), z = (e, t, i) => (Oo(e, t, "access private method"), i), wa, Wi, Ni, zt, P, ol, yi, mt, Ws, rl, nl, $a, ll, cl, ul;
function Gh(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : Hh(e.sourceUrl);
    default:
      return "Media library";
  }
}
function Hh(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let yt = class extends L {
  constructor() {
    super(), wi(this, P), wi(this, wa), wi(this, Wi), wi(this, Ni), this._fonts = [], this._loading = !0, wi(this, zt, () => {
      var e;
      return (e = Me(this, wa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Su, (e) => {
      fs(this, Wi, e);
    }), this.consumeContext(oe, (e) => {
      fs(this, Ni, e);
    }), this.consumeContext(Le, (e) => {
      fs(this, wa, e), e && z(this, P, yi).call(this);
    });
  }
  render() {
    return this._loading ? n`<div class="state"><uui-loader></uui-loader></div>` : n`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${z(this, P, Ws)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? n`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${z(this, P, Ws)}>
                  Add your first font
                </uui-button>
              </div>` : n`${Z(this._fonts, (e) => e.key, (e) => z(this, P, ll).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
wa = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
zt = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakSet();
ol = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
yi = async function() {
  this._loading = !0;
  try {
    this._fonts = await za(Me(this, zt)), await il(this._fonts.map((e) => e.key), Me(this, zt));
  } catch (e) {
    z(this, P, mt).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
mt = function(e, t, i) {
  var s;
  const a = i instanceof ht ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Me(this, Ni)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Ws = async function() {
  var i, a;
  if (!Me(this, Wi)) return;
  const e = Me(this, Wi).open(this, Th, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Me(this, Ni)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await z(this, P, yi).call(this));
};
rl = async function(e) {
  try {
    await od(e.key, Me(this, zt)), al(e.key), z(this, P, mt).call(this, "positive", `'${e.familyName}' refreshed`), await z(this, P, yi).call(this);
  } catch (t) {
    z(this, P, mt).call(this, "danger", "That font could not be refreshed", t);
  }
};
nl = async function(e) {
  await fo(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await nd(e.key, Me(this, zt)), al(e.key), z(this, P, mt).call(this, "positive", `'${e.familyName}' deleted`), await z(this, P, yi).call(this);
  } catch (t) {
    z(this, P, mt).call(this, "danger", "That font could not be deleted", t);
  }
};
$a = async function(e, t, i, a) {
  try {
    await rd(e.key, t, i, Me(this, zt), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), z(this, P, mt).call(this, "positive", `'${t}' saved`), await z(this, P, yi).call(this), a != null && a.keepOpen && await z(this, P, ol).call(this);
  } catch (s) {
    z(this, P, mt).call(this, "danger", "The font could not be saved", s);
  }
};
ll = function(e) {
  const t = this._editingKey === e.key;
  return n`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${Gh(e)} · weight ${e.weight}
              ${e.isItalic ? "· italic" : ""}
              ${e.usedByTemplateCount > 0 ? n`· used by ${e.usedByTemplateCount} template(s)` : ""}
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
            ${e.sourceKind === "url" ? n`<uui-button
                  look="secondary"
                  label="Re-download ${e.familyName} from its provider"
                  @click=${() => z(this, P, rl).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => z(this, P, nl).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${rs(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? z(this, P, ul).call(this, e) : z(this, P, cl).call(this, e)}
      </div>
    `;
};
cl = function(e) {
  return e.styles.length === 0 ? p : n`<div class="tags">
      ${Z(
    e.styles,
    (t) => t.name,
    (t) => n`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
ul = function(e) {
  const t = [...e.styles];
  return n`
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
          ${Z(
    t,
    (i, a) => a,
    (i, a) => n`
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
      t.splice(a, 1), z(this, P, $a).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), z(this, P, $a).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    z(this, P, $a).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
yt.styles = A`
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
ns([
  y()
], yt.prototype, "_fonts", 2);
ns([
  y()
], yt.prototype, "_loading", 2);
ns([
  y()
], yt.prototype, "_editingKey", 2);
yt = ns([
  M("di-fonts-dashboard")
], yt);
const Yh = yt, Xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return yt;
  },
  default: Yh
}, Symbol.toStringTag, { value: "Module" }));
var Jh = Object.defineProperty, Zh = Object.getOwnPropertyDescriptor, dl = (e) => {
  throw TypeError(e);
}, oa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Jh(t, i, s), s;
}, Io = (e, t, i) => t.has(e) || dl("Cannot " + i), it = (e, t, i) => (Io(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ya = (e, t, i) => t.has(e) ? dl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Kr = (e, t, i, a) => (Io(e, t, "write to private field"), t.set(e, i), i), Gt = (e, t, i) => (Io(e, t, "access private method"), i), xa, Ht, hi, ut, Ka, Ns, hl;
let Ve = class extends L {
  constructor() {
    super(), ya(this, ut), ya(this, xa), ya(this, Ht), this._loading = !0, this._busy = !1, ya(this, hi, () => {
      var e;
      return (e = it(this, xa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(oe, (e) => {
      Kr(this, Ht, e);
    }), this.consumeContext(Le, (e) => {
      Kr(this, xa, e), e && Gt(this, ut, Ka).call(this);
    });
  }
  render() {
    if (this._loading) return n`<div class="state"><uui-loader></uui-loader></div>`;
    if (!this._health) return n`<p class="empty">The health report could not be loaded.</p>`;
    const e = this._health.issues, t = e.filter((a) => a.severity === "error"), i = e.filter((a) => a.severity === "warning");
    return n`
      <umb-body-layout headline="Health">
        <uui-box headline="Summary">
          <div slot="header-actions">
            <uui-button look="secondary" label="Re-check" @click=${() => Gt(this, ut, Ka).call(this)}>Re-check</uui-button>
          </div>

          <ul class="summary">
            <li>
              Image generation is
              <strong class=${this._health.isEnabled ? "ok" : "bad"}>${this._health.isEnabled ? "on" : "off"}</strong>
              ${this._health.isEnabled ? p : n`(set <code>DynamicImages:Enabled</code> to true)`}
            </li>
            <li><strong>${this._health.templateCount}</strong> template(s), <strong>${this._health.fontCount}</strong> font(s)</li>
            <li>
              <strong class=${t.length > 0 ? "bad" : "ok"}>${t.length}</strong> error(s),
              <strong>${i.length}</strong> warning(s)
            </li>
          </ul>
        </uui-box>

        <uui-box headline="Issues">
          ${e.length === 0 ? n`<p class="empty"><uui-icon name="icon-check"></uui-icon> Everything checks out.</p>` : n`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Severity</uui-table-head-cell>
                  <uui-table-head-cell>Template</uui-table-head-cell>
                  <uui-table-head-cell>Issue</uui-table-head-cell>
                  <uui-table-head-cell>Code</uui-table-head-cell>
                </uui-table-head>
                ${Z(
      e,
      (a, s) => `${a.code}-${s}`,
      (a) => n`
                    <uui-table-row>
                      <uui-table-cell>
                        <uui-tag
                          look="secondary"
                          color=${a.severity === "error" ? "danger" : a.severity === "warning" ? "warning" : "default"}>
                          ${a.severity}
                        </uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>
                        ${a.templateKey ? n`<a href=${_o(a.templateKey)}>${a.templateName}</a>` : n`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Gt(this, ut, hl).call(this)}
      </umb-body-layout>
    `;
  }
};
xa = /* @__PURE__ */ new WeakMap();
Ht = /* @__PURE__ */ new WeakMap();
hi = /* @__PURE__ */ new WeakMap();
ut = /* @__PURE__ */ new WeakSet();
Ka = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      gn(it(this, hi)),
      md(it(this, hi)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
Ns = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await yd(it(this, hi)) : await fd(it(this, hi));
    (t = it(this, Ht)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = it(this, Ht)) == null || i.peek("warning", { data: { message: o } });
    await Gt(this, ut, Ka).call(this);
  } catch (s) {
    (a = it(this, Ht)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
hl = function() {
  return this._sync ? n`
      <uui-box headline="Environment transfer">
        <p>
          Templates live in the database. To move them between environments, export them to JSON files under
          <code>${this._sync.folder}</code> and commit those, or import files someone else committed.
        </p>
        <p class="meta">
          Mode: <strong>${this._sync.mode}</strong> · ${this._sync.fileCount} file(s)
          ${this._sync.lastWriteUtc ? n`· last written ${new Date(this._sync.lastWriteUtc).toLocaleString()}` : p}
        </p>

        <div class="row">
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Gt(this, ut, Ns).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Gt(this, ut, Ns).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
Ve.styles = A`
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
oa([
  y()
], Ve.prototype, "_health", 2);
oa([
  y()
], Ve.prototype, "_sync", 2);
oa([
  y()
], Ve.prototype, "_loading", 2);
oa([
  y()
], Ve.prototype, "_busy", 2);
Ve = oa([
  M("di-health-dashboard")
], Ve);
const Qh = Ve, ep = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Ve;
  },
  default: Qh
}, Symbol.toStringTag, { value: "Module" })), pl = 3, ml = 12, yl = 0.1, fl = 0.9;
function tp(e) {
  return Math.max(pl, Math.min(ml, e));
}
function ip(e) {
  return Math.max(yl, Math.min(fl, e));
}
function ap(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = tp(t), s = 0.5 * ip(i), o = e === "star" ? a * 2 : a, r = e === "star" ? 180 / a : 360 / a, l = [];
  for (let h = 0; h < o; h++) {
    const m = (-90 + h * r) * Math.PI / 180, S = e === "star" && h % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + S * Math.cos(m), y: 0.5 + S * Math.sin(m) });
  }
  return l;
}
function sp(e, t, i) {
  const a = ap(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
const f = {
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
  sides: { min: pl, max: ml },
  innerRatio: { min: yl, max: fl }
}, ja = { min: 0.1, max: 4 };
function op(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function Po(e) {
  const t = e.kind ?? "linear", i = Math.round(Bs(e.centreX ?? 0.5) * 100), a = Math.round(Bs(e.centreY ?? 0.5) * 100);
  switch (t) {
    case "radial":
      return `radial-gradient(${e.shape ?? "ellipse"} ${np(e.extent)} at ${i}% ${a}%, ${gs(e)})`;
    case "angular":
      return `conic-gradient(from ${e.angle}deg at ${i}% ${a}%, ${gs(e)})`;
    case "reflected":
      return `linear-gradient(${e.angle}deg, ${Ks(lp(ft(e)))})`;
    case "diamond": {
      const s = Ks(ft(e).map((o) => ({ ...o, position: o.position / 2 })));
      return [
        `linear-gradient(to top left, ${s}) left top / ${i}% ${a}% no-repeat`,
        `linear-gradient(to top right, ${s}) right top / ${100 - i}% ${a}% no-repeat`,
        `linear-gradient(to bottom left, ${s}) left bottom / ${i}% ${100 - a}% no-repeat`,
        `linear-gradient(to bottom right, ${s}) right bottom / ${100 - i}% ${100 - a}% no-repeat`
      ].join(", ");
    }
    default:
      return `linear-gradient(${e.angle}deg, ${gs(e)})`;
  }
}
function Bs(e) {
  return Math.min(1, Math.max(0, e));
}
const rp = {
  farthestCorner: "farthest-corner",
  farthestSide: "farthest-side",
  closestCorner: "closest-corner",
  closestSide: "closest-side"
};
function np(e) {
  return rp[e ?? "farthestCorner"] ?? "farthest-corner";
}
function ft(e) {
  const t = e.stops;
  return !t || t.length < 2 ? [{ colour: e.from, position: 0 }, { colour: e.to, position: 1 }] : t.map((i, a) => ({ stop: { colour: i.colour, position: Bs(i.position) }, index: a })).sort((i, a) => i.stop.position - a.stop.position || i.index - a.index).map(({ stop: i }) => i);
}
function lp(e) {
  return [
    ...[...e].reverse().map((t) => ({ colour: t.colour, position: 0.5 - t.position / 2 })),
    ...e.map((t) => ({ colour: t.colour, position: 0.5 + t.position / 2 }))
  ];
}
function gs(e) {
  const t = e.stops;
  return t && t.length >= 2 ? Ks(ft(e)) : `${e.from}, ${e.to}`;
}
function Ks(e) {
  return e.map((t) => `${t.colour} ${Ao(t.position * 100)}%`).join(", ");
}
const Ao = (e) => Math.round(e * 100) / 100;
function Bi(e, t) {
  const i = ft({ ...e, stops: t });
  return { ...e, stops: t, from: i[0].colour, to: i[i.length - 1].colour };
}
function cp(e) {
  const t = [...ft(e)].reverse().map((i) => ({ colour: i.colour, position: Ao(1 - i.position) }));
  return Bi(e, t);
}
function up(e) {
  const t = ft(e);
  let i = 0;
  for (let r = 1; r < t.length; r++)
    t[r].position - t[r - 1].position > t[i + 1].position - t[i].position && (i = r - 1);
  const a = t[i], s = t[i + 1], o = Ao((a.position + s.position) / 2);
  return Bi(e, [...t, { colour: hp(a.colour, s.colour, 0.5), position: o }]);
}
function dp(e, t) {
  const i = ft(e);
  return i.length <= 2 ? e : Bi(e, i.filter((a, s) => s !== t));
}
function hp(e, t, i) {
  const a = jr(e), s = jr(t);
  if (!a || !s) return e;
  const o = (h) => Math.round(a[h] + (s[h] - a[h]) * i).toString(16).padStart(2, "0").toUpperCase(), r = `#${o(0)}${o(1)}${o(2)}`, l = o(3);
  return l === "FF" ? r : `${r}${l}`;
}
function jr(e) {
  const t = (e ?? "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t) || ![3, 4, 6, 8].includes(t.length)) return;
  const i = t.length <= 4 ? [...t].map((s) => s + s).join("") : t, a = (s) => parseInt(i.slice(s * 2, s * 2 + 2), 16);
  return [a(0), a(1), a(2), i.length === 8 ? a(3) : 255];
}
const Mo = A`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function pp(e, t) {
  const i = [], a = t.lockX ? void 0 : Vr(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    mp(t),
    t.threshold
  ), s = t.lockY ? void 0 : Vr(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    yp(t),
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
function mp(e) {
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
function yp(e) {
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
function Vr(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const r = Math.abs(o.at - s.value);
      r > i || (!a || r < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: r });
    }
  return a;
}
var fp = Object.defineProperty, gp = Object.getOwnPropertyDescriptor, gl = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && fp(t, i, s), s;
}, Ro = (e, t, i) => t.has(e) || gl("Cannot " + i), xe = (e, t, i) => (Ro(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vs = (e, t, i) => t.has(e) ? gl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), bs = (e, t, i, a) => (Ro(e, t, "write to private field"), t.set(e, i), i), V = (e, t, i) => (Ro(e, t, "access private method"), i), _t, Ei, I, ls, zo, vl, bl, _l, wl, Lo, Va, $l, xl, kl, Tl, Sl, El, Cl, Dl, Ol;
const vp = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], _s = 18;
let Se = class extends L {
  constructor() {
    super(...arguments), vs(this, I), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, vs(this, _t), vs(this, Ei);
  }
  willUpdate() {
    this._box = V(this, I, vl).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== xe(this, Ei) && ((t = xe(this, _t)) == null || t.disconnect(), bs(this, Ei, e), e && (xe(this, _t) ?? bs(this, _t, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), xe(this, _t).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = xe(this, _t)) == null || e.disconnect(), bs(this, Ei, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return n`
      <div
        class=${rn({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${W({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...xe(this, I, bl) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...V(this, I, Lo).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      V(this, I, $l).call(this, t), V(this, I, Va).call(this, t);
    }}>
        ${V(this, I, xl).call(this)}
      </div>

      ${this.selected ? V(this, I, Dl).call(this, e) : p}
      ${this.showMeasured && this.measured ? V(this, I, Ol).call(this) : p}
    `;
  }
};
_t = /* @__PURE__ */ new WeakMap();
Ei = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakSet();
ls = function() {
  return this.resolvedPosition ?? this.layer.position;
};
zo = function() {
  return this.layer.rotation ?? 0;
};
vl = function() {
  var s;
  const e = this.layer, t = e.size.width ?? V(this, I, _l).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? V(this, I, wl).call(this), a = os(xe(this, I, ls), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
bl = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
_l = function() {
  var e;
  switch (this.layer.type) {
    case "badges": {
      if ((e = this.measured) != null && e.width) return this.measured.width;
      const { badge: t, label: i, gap: a, maxItems: s, direction: o } = this.layer, r = i.position === "right" ? t.size + i.gap + i.fontSize * 0.6 * 8 : t.size;
      return o === "horizontal" ? s * r + (s - 1) * a : r;
    }
    case "text":
      return 600;
    default:
      return 240;
  }
};
wl = function() {
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
Lo = function(e) {
  const t = xe(this, I, zo);
  if (t === 0) return {};
  const i = xe(this, I, ls);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Va = function(e, t) {
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
$l = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
xl = function() {
  switch (this.layer.type) {
    case "text":
      return V(this, I, kl).call(this);
    case "image":
      return V(this, I, Sl).call(this);
    case "badges":
      return V(this, I, El).call(this);
    default:
      return V(this, I, Cl).call(this);
  }
};
kl = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || V(this, I, Tl).call(this);
  return n`
      <div
        class="text"
        style=${W({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${rs(e.fontKey)}, sans-serif`,
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
Tl = function() {
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
Sl = function() {
  if (this.layer.type !== "image") return p;
  const e = this.layer.border;
  return n`
      <div
        class="image"
        style=${W({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
El = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: r } = this.layer, l = s === "horizontal", h = l && o, m = t.position ?? "below";
  return n`
      <div
        class="badges"
        style=${W({
    flexDirection: l ? "row" : "column",
    flexWrap: h ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...h ? { rowGap: `${r * this.scale}px` } : {}
  })}>
        ${Z(
    Array.from({ length: Math.max(1, a) }, (S, k) => k),
    (S) => S,
    () => n`
            <div class=${rn({ badge: !0, right: m === "right" })}>
              <div
                class="circle"
                style=${W({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${m === "none" ? p : n`<div
                    class="badge-label"
                    style=${W({
      ...m === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${rs(t.fontKey)}, sans-serif`,
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
Cl = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? Po(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return n`
        <div
          class="shape"
          style=${W({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${o}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const r = sp(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return n`
      <div class="shape" style=${W({ clipPath: r, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${W({ inset: `${o}px`, clipPath: r, background: a })}></div>
      </div>
    `;
};
Dl = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = xe(this, I, ls), r = xe(this, I, zo), l = Re(this.layer.position, "x") || Re(this.layer.position, "y");
  return n`
      <div
        class="chrome"
        style=${W({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...V(this, I, Lo).call(this, e) })}>
        <span
          class="tag"
          style=${W(r !== 0 ? { transform: `rotate(${-r}deg)` } : {})}>
          ${l ? n`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : n`
              ${Z(
    vp,
    (h) => h,
    (h) => n`
                  <span
                    class="handle ${h}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${h}"
                    @pointerdown=${(m) => V(this, I, Va).call(this, m, h)}>
                  </span>
                `
  )}
              <span class="stalk" style=${W({ height: `${_s}px`, top: `${-_s}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${W({ top: `${-_s}px` })}
                @pointerdown=${(h) => V(this, I, Va).call(this, h, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}${r !== 0 ? ` - turns ${r}° here` : ""}"
          style=${W({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
Ol = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return n`
      <div
        class="measured"
        style=${W({
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
Se.styles = A`
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
Xe([
  g({ type: Object })
], Se.prototype, "layer", 2);
Xe([
  g({ type: Number })
], Se.prototype, "scale", 2);
Xe([
  g({ type: Boolean, reflect: !0 })
], Se.prototype, "selected", 2);
Xe([
  g({ type: Object })
], Se.prototype, "measured", 2);
Xe([
  g({ type: Boolean })
], Se.prototype, "showMeasured", 2);
Xe([
  g({ type: String })
], Se.prototype, "resolvedText", 2);
Xe([
  g({ attribute: !1 })
], Se.prototype, "resolvedPosition", 2);
Xe([
  y()
], Se.prototype, "_box", 2);
Se = Xe([
  M("di-layer-box")
], Se);
var bp = Object.defineProperty, _p = Object.getOwnPropertyDescriptor, Il = (e) => {
  throw TypeError(e);
}, Fo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? _p(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && bp(t, i, s), s;
}, wp = (e, t, i) => t.has(e) || Il("Cannot " + i), $p = (e, t, i) => t.has(e) ? Il("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xp = (e, t, i) => (wp(e, t, "access private method"), i), js, Pl;
let Ki = class extends L {
  constructor() {
    super(...arguments), $p(this, js), this.guides = [], this.scale = 1;
  }
  render() {
    return n`${Z(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => xp(this, js, Pl).call(this, e)
    )}`;
  }
};
js = /* @__PURE__ */ new WeakSet();
Pl = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? n`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : n`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Ki.styles = A`
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
Fo([
  g({ type: Array })
], Ki.prototype, "guides", 2);
Fo([
  g({ type: Number })
], Ki.prototype, "scale", 2);
Ki = Fo([
  M("di-guides")
], Ki);
var kp = Object.defineProperty, Tp = Object.getOwnPropertyDescriptor, Al = (e) => {
  throw TypeError(e);
}, ra = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Tp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && kp(t, i, s), s;
}, Sp = (e, t, i) => t.has(e) || Al("Cannot " + i), Ep = (e, t, i) => t.has(e) ? Al("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qr = (e, t, i) => (Sp(e, t, "access private method"), i), ka, Vs;
let H = class extends L {
  constructor() {
    super(...arguments), Ep(this, ka), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    qr(this, ka, Vs).call(this, "top"), qr(this, ka, Vs).call(this, "left");
  }
  render() {
    const e = this.pointer ? this.pointer.x * this.scale : void 0, t = this.pointer ? this.pointer.y * this.scale : void 0;
    return n`
      <div class="corner"></div>
      <div class="top">
        <canvas id="top"></canvas>
        ${e === void 0 ? "" : n`<div class="hairline vertical" style="left:${e}px"></div>`}
      </div>
      <div class="left">
        <canvas id="left"></canvas>
        ${t === void 0 ? "" : n`<div class="hairline horizontal" style="top:${t}px"></div>`}
      </div>
    `;
  }
};
ka = /* @__PURE__ */ new WeakSet();
Vs = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : H.thickness) * o, t.height = (e === "top" ? H.thickness : s) * o, t.style.width = `${e === "top" ? s : H.thickness}px`, t.style.height = `${e === "top" ? H.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const r = getComputedStyle(this);
  i.strokeStyle = r.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = r.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const h = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, S = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(h, H.thickness - S), i.lineTo(h, H.thickness)) : (i.moveTo(H.thickness - S, h), i.lineTo(H.thickness, h)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), h + 2, 9) : (i.save(), i.translate(9, h - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
H.thickness = 20;
H.styles = A`
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
ra([
  g({ type: Number })
], H.prototype, "canvasWidth", 2);
ra([
  g({ type: Number })
], H.prototype, "canvasHeight", 2);
ra([
  g({ type: Number })
], H.prototype, "scale", 2);
ra([
  g({ type: Object })
], H.prototype, "pointer", 2);
H = ra([
  M("di-rulers")
], H);
var Cp = Object.defineProperty, Dp = Object.getOwnPropertyDescriptor, Ml = (e) => {
  throw TypeError(e);
}, re = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Cp(t, i, s), s;
}, Uo = (e, t, i) => t.has(e) || Ml("Cannot " + i), R = (e, t, i) => (Uo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ne = (e, t, i) => t.has(e) ? Ml("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ta = (e, t, i, a) => (Uo(e, t, "write to private field"), t.set(e, i), i), O = (e, t, i) => (Uo(e, t, "access private method"), i), wt, Ci, dt, D, Wo, qs, Gs, cs, No, Hs, Rl, zl, Bo, Ll, Fl, Ys, Sa, Ul, Wl, Kt, Ko, Xs, Js, Zs, Nl, Qs, eo, to, Bl;
const Op = 6, Kl = 20, Ip = 2, Pp = 15, Ap = 0.1;
let J = class extends L {
  constructor() {
    super(...arguments), ne(this, D), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ne(this, wt), ne(this, Ci), ne(this, dt, /* @__PURE__ */ new Map()), ne(this, Ys, (e) => {
      const t = this.template.layers.find((r) => r.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = O(this, D, No).call(this, t), a = O(this, D, Hs).call(this, t), s = O(this, D, Rl).call(this, t), o = O(this, D, cs).call(this, e.detail.startX, e.detail.startY);
      Ta(this, wt, {
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
    }), ne(this, Sa, (e) => {
      var gi, ie;
      this._pointer = O(this, D, Gs).call(this, e.clientX, e.clientY);
      const t = R(this, wt);
      if (!t) return;
      const i = this.template.layers.find((_e) => _e.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        O(this, D, Wl).call(this, i, t, e);
        return;
      }
      const o = Re(i.position, "x"), r = Re(i.position, "y"), l = t.startRotation, h = e.shiftKey || i.type === "rect" && i.lockAspect === !0;
      if (t.handle && l !== 0) {
        O(this, D, Ul).call(this, i, t, t.handle, a, s, h, o, r);
        return;
      }
      let m = t.handle ? O(this, D, Ko).call(this, t.startBox, t.handle, a, s, h) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (m = { ...m, x: t.startBox.x, width: (gi = t.handle) != null && gi.includes("w") ? t.startBox.width : m.width }), r && (m = { ...m, y: t.startBox.y, height: (ie = t.handle) != null && ie.includes("n") ? t.startBox.height : m.height });
      const S = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, k = l !== 0 ? { x: m.x + S.x, y: m.y + S.y, width: t.startExtent.width, height: t.startExtent.height } : m, te = this.snapEnabled && !e.altKey ? pp(k, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((_e) => _e.key !== i.key).map((_e) => O(this, D, Hs).call(this, _e)),
        threshold: Op / this.scale,
        lockX: o,
        lockY: r
      }) : {
        box: {
          ...k,
          x: o ? k.x : Math.round(k.x),
          y: r ? k.y : Math.round(k.y)
        },
        guides: []
      };
      this._guides = te.guides;
      const ye = l !== 0 ? { ...m, x: te.box.x - S.x, y: te.box.y - S.y } : te.box, fe = Sd(ye, i.position);
      o && (fe.x = i.position.x), r && (fe.y = i.position.y);
      const Wt = { position: fe };
      t.handle && (Wt.size = {
        width: Math.max(1, Math.round(ye.width)),
        height: Math.max(1, Math.round(ye.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Wt } })
      );
    }), ne(this, Kt, () => {
      if (!R(this, wt)) return;
      const e = R(this, wt).moved;
      Ta(this, wt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ne(this, Xs, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ne(this, Js, () => {
      this._dropTarget = !1;
    }), ne(this, Zs, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = O(this, D, Gs).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: O(this, D, Nl).call(this, e) }
        })
      );
    }), ne(this, Qs, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ne(this, eo, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => En(t.position)) && this.requestUpdate();
    }), ne(this, to, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), Ta(this, Ci, new ResizeObserver(() => O(this, D, qs).call(this))), R(this, Ci).observe(this), window.addEventListener("pointermove", R(this, Sa)), window.addEventListener("pointerup", R(this, Kt)), window.addEventListener("pointercancel", R(this, Kt));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = R(this, Ci)) == null || e.disconnect(), window.removeEventListener("pointermove", R(this, Sa)), window.removeEventListener("pointerup", R(this, Kt)), window.removeEventListener("pointercancel", R(this, Kt));
  }
  updated(e) {
    O(this, D, qs).call(this), e.has("zoom") && O(this, D, Wo).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = R(this, dt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    O(this, D, zl).call(this);
    const s = this.showRulers ? Kl : 0;
    return n`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${R(this, Qs)}
        @dragover=${R(this, Xs)}
        @dragleave=${R(this, Js)}
        @drop=${R(this, Zs)}
        @di-layer-drag-start=${R(this, Ys)}
        @di-layer-box-resize=${R(this, eo)}>
        <div
          class="artboard"
          style=${W({
      width: `${t + s}px`,
      height: `${i + s}px`,
      "--di-gutter": `${s}px`
    })}>
          ${this.showRulers ? n`<di-rulers
                .canvasWidth=${e.width}
                .canvasHeight=${e.height}
                .scale=${this.scale}
                .pointer=${this._pointer}>
              </di-rulers>` : p}

          <div
            class="stage"
            style=${W({
      background: e.backgroundGradient ? Po(e.backgroundGradient) : e.background
    })}
            @pointerdown=${R(this, to)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? n`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${W({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${Z(
      this.template.layers,
      (o) => o.key,
      (o) => {
        var r, l;
        return n`
                <di-layer-box
                  data-key=${o.key}
                  .layer=${o}
                  .scale=${this.scale}
                  .selected=${o.key === this.selectedLayerKey}
                  .measured=${a.get(o.key)}
                  .showMeasured=${this.showMeasured}
                  .resolvedText=${((r = a.get(o.key)) == null ? void 0 : r.resolvedText) ?? void 0}
                  .resolvedPosition=${(l = R(this, dt).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? O(this, D, Bl).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
wt = /* @__PURE__ */ new WeakMap();
Ci = /* @__PURE__ */ new WeakMap();
dt = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakSet();
Wo = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
qs = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Kl : 0) + Ip, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, O(this, D, Wo).call(this));
};
Gs = function(e, t) {
  const i = O(this, D, cs).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
cs = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
No = function(e) {
  const t = R(this, dt).get(e.key);
  if (t) return t.box;
  const i = O(this, D, Bo).call(this, e), a = os(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Hs = function(e) {
  const t = R(this, dt).get(e.key);
  return t ? t.extent : Sn(O(this, D, No).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Rl = function(e) {
  var t;
  return ((t = R(this, dt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
zl = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  Ta(this, dt, Pd(
    this.template.layers,
    (i) => O(this, D, Bo).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Bo = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? O(this, D, Ll).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? O(this, D, Fl).call(this, e, i)
  };
};
Ll = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Fl = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Ys = /* @__PURE__ */ new WeakMap();
Sa = /* @__PURE__ */ new WeakMap();
Ul = function(e, t, i, a, s, o, r, l) {
  const h = t.startRotation, m = t.startPosition, S = Ed(a, s, 0, 0, h);
  let k = O(this, D, Ko).call(this, t.startBox, i, S.x, S.y, o);
  r && (k = { ...k, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : k.width }), l && (k = { ...k, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : k.height });
  const j = Math.max(1, Math.round(k.width)), te = Math.max(1, Math.round(k.height)), ye = wo(k.x, k.y, j, te, m.anchor), fe = jt(ye.x, ye.y, m.x, m.y, h), Wt = {
    ...e.position,
    x: r ? e.position.x : Math.round(fe.x),
    y: l ? e.position.y : Math.round(fe.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Wt, size: { width: j, height: te } } }
    })
  );
};
Wl = function(e, t, i) {
  const a = t.startPosition, s = O(this, D, cs).call(this, i.clientX, i.clientY), r = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + r, h = i.shiftKey ? Pp : Ap, m = Tn(Math.round(l / h) * h);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
Kt = /* @__PURE__ */ new WeakMap();
Ko = function(e, t, i, a, s) {
  let { x: o, y: r, width: l, height: h } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (r = e.y + a, h = e.height - a), t.includes("s") && (h = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(h - e.height) ? h = l / m : l = h * m, t.includes("n") && (r = e.y + e.height - h), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: r, width: Math.max(4, l), height: Math.max(4, h) };
};
Xs = /* @__PURE__ */ new WeakMap();
Js = /* @__PURE__ */ new WeakMap();
Zs = /* @__PURE__ */ new WeakMap();
Nl = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Qs = /* @__PURE__ */ new WeakMap();
eo = /* @__PURE__ */ new WeakMap();
to = /* @__PURE__ */ new WeakMap();
Bl = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return n`<div class="safe-area" style=${W({ top: `${i}px`, bottom: `${i}px` })}></div>`;
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
      ${Mo}
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
  g({ type: Object })
], J.prototype, "template", 2);
re([
  g({ type: String })
], J.prototype, "selectedLayerKey", 2);
re([
  g({ type: Object })
], J.prototype, "baseImageUrl", 2);
re([
  g({ type: Array })
], J.prototype, "serverBounds", 2);
re([
  g({ type: Boolean })
], J.prototype, "showMeasured", 2);
re([
  g({ type: Boolean })
], J.prototype, "snapEnabled", 2);
re([
  g({ type: Boolean })
], J.prototype, "showRulers", 2);
re([
  g({ type: Boolean })
], J.prototype, "showSafeArea", 2);
re([
  g({ type: Number })
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
  M("di-designer-canvas")
], J);
var Mp = Object.defineProperty, Rp = Object.getOwnPropertyDescriptor, jl = (e) => {
  throw TypeError(e);
}, jo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Mp(t, i, s), s;
}, Vl = (e, t, i) => t.has(e) || jl("Cannot " + i), zp = (e, t, i) => (Vl(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Lp = (e, t, i) => t.has(e) ? jl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), be = (e, t, i) => (Vl(e, t, "access private method"), i), ee, ql, Vo, qo, Gl, Hl, Yl, Xl, Mi;
const Gr = {
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
let ji = class extends L {
  constructor() {
    super(...arguments), Lp(this, ee), this.properties = [], this._search = "";
  }
  render() {
    const e = Fp(zp(this, ee, ql));
    return n`
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

        ${be(this, ee, Hl).call(this)}

        ${this.properties.length === 0 ? n`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : Z(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => be(this, ee, Gl).call(this, t, i)
    )}
      </div>
    `;
  }
};
ee = /* @__PURE__ */ new WeakSet();
ql = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Vo = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
qo = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Gl = function(e, t) {
  return n`
      <div class="group">
        <h5>${e}</h5>
        ${Z(
    t,
    (i) => i.alias,
    (i) => be(this, ee, Mi).call(
      this,
      i.name,
      Gr[i.classification] ?? Gr.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Hl = function() {
  return n`
      <div class="group">
        <h5>Elements</h5>
        ${be(this, ee, Mi).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${be(this, ee, Mi).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${be(this, ee, Mi).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${be(this, ee, Yl).call(this)}
      </div>
    `;
};
Yl = function() {
  const e = { kind: "static", layerType: "rect", preset: "rectangle" };
  return n`
      <div
        class="chip other shape"
        draggable="true"
        title="Shape"
        @dragstart=${(t) => be(this, ee, qo).call(this, t, e)}>
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
          ${bd.map((t) => n`
            <uui-menu-item
              label=${zi[t].label}
              data-preset=${t}
              @click-label=${() => be(this, ee, Xl).call(this, t)}>
              <uui-icon slot="icon" name=${zi[t].icon}></uui-icon>
            </uui-menu-item>
          `)}
        </div>
      </uui-popover-container>
    `;
};
Xl = function(e) {
  var t, i, a;
  (a = (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#shape-menu")) == null ? void 0 : i.hidePopover) == null || a.call(i), be(this, ee, Vo).call(this, { kind: "static", layerType: "rect", preset: e });
};
Mi = function(e, t, i, a, s) {
  const o = s ?? e;
  return n`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(r) => be(this, ee, qo).call(this, r, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => be(this, ee, Vo).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
ji.styles = A`
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
jo([
  g({ type: Array })
], ji.prototype, "properties", 2);
jo([
  y()
], ji.prototype, "_search", 2);
ji = jo([
  M("di-property-palette")
], ji);
function Fp(e) {
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
function Up(e) {
  return e.backgroundGradient ? "gradient" : Wp(e.background) ? "transparent" : "colour";
}
function Wp(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function Np(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var Bp = Object.defineProperty, Kp = Object.getOwnPropertyDescriptor, Jl = (e) => {
  throw TypeError(e);
}, Go = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Kp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Bp(t, i, s), s;
}, jp = (e, t, i) => t.has(e) || Jl("Cannot " + i), Vp = (e, t, i) => t.has(e) ? Jl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Hr = (e, t, i) => (jp(e, t, "access private method"), i), Ea, io;
let Vi = class extends L {
  constructor() {
    super(...arguments), Vp(this, Ea), this.value = "#FFFFFF", this.label = "Colour";
  }
  /**
   * The picker's swatch, and the value as text beside it: the compact picker shows only a swatch,
   * and a colour someone has been handed by a brand guide is typed, not dragged to.
   */
  render() {
    return n`
      <div class="colour">
        <uui-color-picker
          label=${this.label}
          format="hex"
          opacity
          uppercase
          .value=${this.value}
          @change=${Hr(this, Ea, io)}></uui-color-picker>
        <uui-input
          label="${this.label} (hex)"
          spellcheck="false"
          .value=${this.value}
          @change=${Hr(this, Ea, io)}></uui-input>
      </div>
    `;
  }
};
Ea = /* @__PURE__ */ new WeakSet();
io = function(e) {
  e.stopPropagation();
  const t = Yr(e.target.value);
  !t || t === Yr(this.value) || (this.value = t, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: t } })));
};
Vi.styles = A`
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
Go([
  g({ type: String })
], Vi.prototype, "value", 2);
Go([
  g({ type: String })
], Vi.prototype, "label", 2);
Vi = Go([
  M("di-colour-input")
], Vi);
function Yr(e) {
  const t = (e ?? "").trim(), i = t.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(i) || ![3, 4, 6, 8].includes(i.length)) return t;
  const s = (i.length <= 4 ? [...i].map((o) => o + o).join("") : i).toUpperCase();
  return s.length === 8 && s.endsWith("FF") ? `#${s.slice(0, 6)}` : `#${s}`;
}
var qp = Object.defineProperty, Gp = Object.getOwnPropertyDescriptor, Zl = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && qp(t, i, s), s;
};
const Xr = {
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
let qa = class extends L {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return n`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${Z(
      kn,
      (e) => e,
      (e) => n`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Xr[e]}
              title=${Xr[e]}
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
qa.styles = A`
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
Zl([
  g({ type: String })
], qa.prototype, "value", 2);
qa = Zl([
  M("di-anchor-picker")
], qa);
var Hp = Object.defineProperty, Yp = Object.getOwnPropertyDescriptor, Ql = (e) => {
  throw TypeError(e);
}, Je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Yp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Hp(t, i, s), s;
}, Xp = (e, t, i) => t.has(e) || Ql("Cannot " + i), Jp = (e, t, i) => t.has(e) ? Ql("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Zp = (e, t, i) => (Xp(e, t, "access private method"), i), ao, ec;
let Ee = class extends L {
  constructor() {
    super(...arguments), Jp(this, ao), this.label = "", this.suffix = "px", this.step = 1, this.compact = !1, this.placeholder = "Auto";
  }
  render() {
    const e = n`
      <span class="input" slot="editor">
        <input
          type="number"
          aria-label=${this.label}
          .value=${this.value === null || this.value === void 0 ? "" : String(this.value)}
          placeholder=${this.placeholder}
          step=${this.step}
          min=${this.min ?? p}
          max=${this.max ?? p}
          @change=${Zp(this, ao, ec)} />
        ${this.suffix ? n`<span class="suffix">${this.suffix}</span>` : p}
      </span>
    `;
    return this.label ? this.compact ? n`<label class="compact-field"><span class="compact-label">${this.label}</span>${e}</label>` : n`<umb-property-layout orientation="vertical" label=${this.label}>${e}</umb-property-layout>` : e;
  }
};
ao = /* @__PURE__ */ new WeakSet();
ec = function(e) {
  const t = e.target, i = t.value, a = op(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Ee.styles = A`
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
Je([
  g({ type: Number })
], Ee.prototype, "value", 2);
Je([
  g({ type: String })
], Ee.prototype, "label", 2);
Je([
  g({ type: String })
], Ee.prototype, "suffix", 2);
Je([
  g({ type: Number })
], Ee.prototype, "step", 2);
Je([
  g({ type: Number })
], Ee.prototype, "min", 2);
Je([
  g({ type: Number })
], Ee.prototype, "max", 2);
Je([
  g({ type: Boolean, reflect: !0 })
], Ee.prototype, "compact", 2);
Je([
  g({ type: String })
], Ee.prototype, "placeholder", 2);
Ee = Je([
  M("di-number-field")
], Ee);
var Qp = Object.defineProperty, em = Object.getOwnPropertyDescriptor, tc = (e) => {
  throw TypeError(e);
}, Ut = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? em(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Qp(t, i, s), s;
}, tm = (e, t, i) => t.has(e) || tc("Cannot " + i), im = (e, t, i) => t.has(e) ? tc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), u = (e, t, i) => (tm(e, t, "access private method"), i), c, v, ge, ic, ac, sc, Ho, oc, rc, nc, so, lc, cc, uc, dc, hc, pc, oo, mc, yc, ro, fc, Ca, gc, vc, Yo, ze, fi, bc, Xo, _c;
const am = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let qe = class extends L {
  constructor() {
    super(...arguments), im(this, c), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? n`<div class="inspector">${this.layer ? u(this, c, lc).call(this, this.layer) : u(this, c, ic).call(this)}</div>` : p;
  }
};
c = /* @__PURE__ */ new WeakSet();
v = function(e) {
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
ic = function() {
  const e = this.template.canvas;
  return n`
      <uui-box headline="Canvas">
        <div class="stack">
          <di-number-field
            .min=${f.width.min}
            .max=${f.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => u(this, c, ge).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${f.height.min}
            .max=${f.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => u(this, c, ge).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${u(this, c, ac).call(this, e)}

        <umb-property-layout orientation="vertical" label="Base image">

          <div slot="editor" class="editor">
          <uui-select
            label="Base image source"
            .value=${e.baseImage.kind}
            .options=${wc(e.baseImage.kind)}
            @change=${(t) => u(this, c, ge).call(this, {
    baseImage: { ...e.baseImage, kind: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.baseImage.kind === "media" ? u(this, c, ze).call(this, "Media item", u(this, c, Yo).call(this, e.baseImage.mediaKey, (t) => u(this, c, ge).call(this, { baseImage: { ...e.baseImage, kind: "media", mediaKey: t } }))) : p}

        ${e.baseImage.kind === "path" ? n`<umb-property-layout orientation="vertical" label="Path">

              <div slot="editor" class="editor">
              <uui-input
                .value=${e.baseImage.path ?? ""}
                placeholder="/assets/og-background.png"
                @change=${(t) => u(this, c, ge).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : p}

        ${e.baseImage.kind === "property" ? n`<umb-property-layout orientation="vertical" label="From property">

              <div slot="editor" class="editor">
              ${u(this, c, fi).call(this, e.baseImage.propertyAlias ?? "", (t) => u(this, c, ge).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </div>

            </umb-property-layout>` : p}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.baseImageFit}
            .options=${B(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => u(this, c, ge).call(this, { baseImageFit: t.target.value })}>
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
ac = function(e) {
  const t = Up(e);
  return n`
      <umb-property-layout orientation="vertical" label="Fill">

        <div slot="editor" class="editor">
        <uui-select
          .value=${t}
          .options=${B(["colour", "gradient", "transparent"], t)}
          @change=${(i) => u(this, c, sc).call(this, e, i.target.value)}>
        </uui-select>
      </div>

      </umb-property-layout>

      ${t === "colour" ? n`<umb-property-layout orientation="vertical" label="Colour">

            <div slot="editor" class="editor">
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => u(this, c, ge).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </div>

          </umb-property-layout>` : p}

      ${t === "gradient" && e.backgroundGradient ? u(this, c, Ho).call(this, e.backgroundGradient, (i) => u(this, c, ge).call(this, { backgroundGradient: i })) : p}

      ${t === "transparent" ? n`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : p}
    `;
};
sc = function(e, t) {
  if (t === "gradient") {
    u(this, c, ge).call(this, { backgroundGradient: e.backgroundGradient ?? xn() });
    return;
  }
  u(this, c, ge).call(this, {
    background: Np(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
Ho = function(e, t) {
  const i = e.kind ?? "linear", a = i === "linear" || i === "reflected" || i === "angular", s = i === "radial" || i === "angular" || i === "diamond";
  return n`
      ${u(this, c, ze).call(this, "Gradient type", n`
        <uui-select
          label="Gradient type"
          .value=${i}
          .options=${B(["linear", "radial", "angular", "diamond", "reflected"], i, sm)}
          @change=${(o) => t({ ...e, kind: o.target.value })}>
        </uui-select>
      `)}

      <div class="gradient-preview" role="img" aria-label="The gradient" style="background: ${Po(e)}"></div>

      ${a ? u(this, c, oc).call(this, e, t) : p}
      ${i === "radial" ? u(this, c, rc).call(this, e, t) : p}
      ${s ? n`
            ${u(this, c, so).call(this, "Centre X", e.centreX, (o) => t({ ...e, centreX: o }))}
            ${u(this, c, so).call(this, "Centre Y", e.centreY, (o) => t({ ...e, centreY: o }))}
          ` : p}

      ${u(this, c, nc).call(this, e, t)}
    `;
};
oc = function(e, t) {
  const i = Math.round(e.angle ?? 180) % 360, a = (s) => t({ ...e, angle: (Math.round(s) % 360 + 360) % 360 });
  return u(this, c, ze).call(this, e.kind === "angular" ? "Start angle" : "Angle", n`
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
          .min=${f.gradientAngle.min}
          .max=${f.gradientAngle.max}
          .value=${i}
          @change=${(s) => a(s.detail.value ?? 180)}>
        </di-number-field>
        <uui-button-group>
          ${rm.map(([s, o, r]) => n`
            <uui-button
              compact
              look=${i === o ? "primary" : "secondary"}
              label=${r}
              title=${r}
              @click=${() => a(o)}>${s}</uui-button>
          `)}
        </uui-button-group>
      </div>
    `);
};
rc = function(e, t) {
  const i = e.shape ?? "ellipse", a = e.extent ?? "farthestCorner";
  return n`
      ${u(this, c, ze).call(this, "Shape", n`
        <uui-select
          label="Radial shape"
          .value=${i}
          .options=${B(["ellipse", "circle"], i)}
          @change=${(s) => t({ ...e, shape: s.target.value })}>
        </uui-select>
      `)}
      ${u(this, c, ze).call(this, "Size", n`
        <uui-select
          label="Radial size"
          .value=${a}
          .options=${B(["farthestCorner", "farthestSide", "closestCorner", "closestSide"], a, om)}
          @change=${(s) => t({ ...e, extent: s.target.value })}>
        </uui-select>
      `, "Where the last colour lands.")}
    `;
};
nc = function(e, t) {
  const i = ft(e);
  return u(this, c, ze).call(this, "Colour stops", n`
      <div class="stops">
        ${i.map((a, s) => n`
          <div class="stop">
            <di-colour-input
              label="Stop ${s + 1} colour"
              .value=${a.colour}
              @change=${(o) => t(Bi(e, i.map((r, l) => l === s ? { ...r, colour: o.detail.value } : r)))}>
            </di-colour-input>
            <div class="stop-position">
              <di-number-field
                label="Position"
                suffix="%"
                .min=${0}
                .max=${100}
                .value=${Math.round(a.position * 100)}
                @change=${(o) => t(Bi(e, i.map((r, l) => l === s ? { ...r, position: (o.detail.value ?? 0) / 100 } : r)))}>
              </di-number-field>
              <uui-button
                compact
                look="secondary"
                color="danger"
                label="Remove stop ${s + 1}"
                ?disabled=${i.length <= 2}
                @click=${() => t(dp(e, s))}>
                <uui-icon name="icon-trash"></uui-icon>
              </uui-button>
            </div>
          </div>
        `)}
        <div class="stop-actions">
          <uui-button look="secondary" label="Add stop" @click=${() => t(up(e))}>
            <uui-icon name="icon-add"></uui-icon> Add stop
          </uui-button>
          <uui-button look="secondary" label="Reverse the gradient" @click=${() => t(cp(e))}>
            <uui-icon name="icon-sync"></uui-icon> Reverse
          </uui-button>
        </div>
      </div>
    `);
};
so = function(e, t, i) {
  return n`<di-number-field
      .min=${f.gradientCentre.min * 100}
      .max=${f.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
lc = function(e) {
  return n`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => u(this, c, v).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? u(this, c, cc).call(this, e) : p}
      ${e.type === "text" ? u(this, c, uc).call(this, e) : p}
      ${e.type === "image" ? u(this, c, dc).call(this, e) : p}
      ${e.type === "badges" ? u(this, c, hc).call(this, e) : p}
      ${e.type === "rect" ? u(this, c, mc).call(this, e) : p}
      ${u(this, c, yc).call(this, e)} ${u(this, c, vc).call(this, e)}
    `;
};
cc = function(e) {
  const t = e.binding;
  return n`
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
            @change=${(i) => u(this, c, v).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? u(this, c, ze).call(this, "Property", u(this, c, fi).call(this, t.propertyAlias ?? "", (i) => u(this, c, v).call(this, { binding: { ...t, propertyAlias: i } }))) : p}

        ${t.kind === "date" ? n`<umb-property-layout orientation="vertical" label="Date format">

              <div slot="editor" class="editor">
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => u(this, c, v).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : p}

        ${t.kind === "static" || t.kind === "expression" ? n`<umb-property-layout orientation="vertical" label="${t.kind === "static" ? "Text" : "Expression"}">

              <div slot="editor" class="editor">
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => u(this, c, v).call(this, {
    binding: { ...t, text: i.target.value }
  })}>
              </uui-textarea>
              ${t.kind === "expression" ? n`<small class="hint">
                    Tokens: <code>{name}</code>, <code>{readingTime}</code>, <code>{prop:alias}</code>,
                    <code>{date:alias:format}</code>
                  </small>` : p}
            </div>

            </umb-property-layout>` : p}

        <div class="stack">
          <umb-property-layout orientation="vertical" label="Prefix">

            <div slot="editor" class="editor">
            <uui-input
              .value=${e.prefix ?? ""}
              @change=${(i) => u(this, c, v).call(this, { prefix: i.target.value })}>
            </uui-input>
          </div>

          </umb-property-layout>
          <umb-property-layout orientation="vertical" label="Suffix">

            <div slot="editor" class="editor">
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => u(this, c, v).call(this, { suffix: i.target.value })}>
            </uui-input>
          </div>

          </umb-property-layout>
        </div>
      </uui-box>
    `;
};
uc = function(e) {
  const t = e.style, i = (a) => u(this, c, v).call(this, { style: { ...t, ...a } });
  return n`
      <uui-box headline="Typography">
        <umb-property-layout orientation="vertical" label="Font">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.fontKey}
            .options=${u(this, c, Xo).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${u(this, c, _c).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

        <div class="stack">
          <di-number-field
            .min=${f.fontSize.min}
            .max=${f.fontSize.max}
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
            .min=${f.lineSpacing.min}
            .max=${f.lineSpacing.max}
            label="Line spacing"
            suffix="×"
            step="0.05"
            .value=${t.lineSpacing}
            @change=${(a) => i({ lineSpacing: a.detail.value ?? 1 })}>
          </di-number-field>
          <di-number-field
            .min=${f.letterSpacing.min}
            .max=${f.letterSpacing.max}
            label="Letter spacing"
            .value=${t.letterSpacing}
            @change=${(a) => i({ letterSpacing: a.detail.value ?? 0 })}>
          </di-number-field>
        </div>

        <div class="stack">
          <di-number-field
            .min=${f.maxLines.min}
            .max=${f.maxLines.max}
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
dc = function(e) {
  var i;
  const t = e.source;
  return n`
      <uui-box headline="Image">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${wc(t.kind)}
            @change=${(a) => u(this, c, v).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" ? u(this, c, ze).call(this, "Property", u(this, c, fi).call(
    this,
    t.propertyAlias ?? "",
    (a) => u(this, c, v).call(this, { source: { ...t, propertyAlias: a } }),
    // The root widens from media to media + content, and the media filter moves to the
    // tail: that is exactly the author.mainImage case, and it never offers a text
    // property as an image source.
    { root: ["media", "content"], tail: "media" }
  )) : p}

        ${t.kind === "path" ? n`<umb-property-layout orientation="vertical" label="Path">

              <div slot="editor" class="editor">
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => u(this, c, v).call(this, {
    source: { ...t, path: a.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : p}

        ${t.kind === "media" ? u(this, c, ze).call(this, "Media item", u(this, c, Yo).call(this, t.mediaKey, (a) => u(this, c, v).call(this, { source: { ...t, kind: "media", mediaKey: a } }))) : p}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.fit}
            .options=${B(["cover", "contain", "stretch"], e.fit)}
            @change=${(a) => u(this, c, v).call(this, { fit: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        <di-number-field
          .min=${f.cornerRadius.min}
          .max=${f.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => u(this, c, v).call(this, { cornerRadius: a.detail.value ?? 0 })}>
        </di-number-field>

        <umb-property-layout orientation="vertical" label="Border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-number-field
              .min=${f.borderWidth.min}
              .max=${f.borderWidth.max}
              label="Width"
              .value=${((i = e.border) == null ? void 0 : i.width) ?? 0}
              @change=${(a) => {
    var o;
    const s = a.detail.value ?? 0;
    u(this, c, v).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? n`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => u(this, c, v).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : p}
          </div>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
hc = function(e) {
  const t = (s) => u(this, c, v).call(this, { badge: { ...e.badge, ...s } }), i = (s) => u(this, c, v).call(this, { label: { ...e.label, ...s } }), a = (s) => u(this, c, v).call(this, { icon: { ...e.icon, ...s } });
  return n`
      <uui-box headline="Badges">
        <umb-property-layout orientation="vertical" label="Items from">

          <div slot="editor" class="editor">
          ${u(this, c, fi).call(this, e.itemsPropertyAlias, (s) => u(this, c, v).call(this, { itemsPropertyAlias: s }))}
        </div>

        </umb-property-layout>

        <div class="stack">
          <di-number-field
            .min=${f.maxItems.min}
            .max=${f.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => u(this, c, v).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${f.gap.min}
            .max=${f.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => u(this, c, v).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <umb-property-layout orientation="vertical" label="Direction">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.direction}
            .options=${B(["horizontal", "vertical"], e.direction)}
            @change=${(s) => u(this, c, v).call(this, { direction: s.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.direction === "horizontal" ? n`
              <umb-property-layout orientation="vertical" label="Wrap onto new rows">

                <div slot="editor" class="editor">
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => u(this, c, v).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </div>

              </umb-property-layout>

              ${e.wrap ? n`
                    <di-number-field
                      .min=${f.rowGap.min}
                      .max=${f.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => u(this, c, v).call(this, { rowGap: s.detail.value ?? 20 })}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  ` : p}
            ` : p}

        <div class="stack">
          <di-number-field
            .min=${f.circleSize.min}
            .max=${f.circleSize.max}
            label="Circle size"
            .value=${e.badge.size}
            @change=${(s) => t({ size: s.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
            .min=${f.iconSize.min}
            .max=${f.iconSize.max}
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
              .min=${f.borderWidth.min}
              .max=${f.borderWidth.max}
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
          ${e.label.position === "right" ? n`<small class="hint">Each badge is as wide as its own label.</small>` : p}
        </div>

        </umb-property-layout>

        ${e.label.position === "none" ? p : n`
              <umb-property-layout orientation="vertical" label="Label font">

                <div slot="editor" class="editor">
                <uui-select
                  .value=${e.label.fontKey}
                  .options=${u(this, c, Xo).call(this, e.label.fontKey)}
                  @change=${(s) => i({ fontKey: s.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>

              <div class="stack">
                <di-number-field
                  .min=${f.labelSize.min}
                  .max=${f.labelSize.max}
                  label="Label size"
                  .value=${e.label.fontSize}
                  @change=${(s) => i({ fontSize: s.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
                  .min=${f.labelGap.min}
                  .max=${f.labelGap.max}
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
pc = function(e, t) {
  if (t === "circle") {
    const a = e.size.width ?? e.size.height ?? 200;
    u(this, c, v).call(this, { shape: "ellipse", lockAspect: !0, size: { ...e.size, width: a, height: a } });
    return;
  }
  const i = no(e) === "circle";
  u(this, c, v).call(this, {
    shape: t,
    ...i ? { lockAspect: !1 } : {}
  });
};
oo = function(e, t, i) {
  const a = e.type === "rect" && e.lockAspect === !0, { width: s, height: o } = e.size;
  if (!a || i === null || !s || !o) {
    u(this, c, v).call(this, { size: { ...e.size, [t]: i } });
    return;
  }
  const r = t === "width" ? { width: i, height: Math.round(i * o / s) } : { width: Math.round(i * s / o), height: i };
  u(this, c, v).call(this, { size: r });
};
mc = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return n`
      <uui-box headline="Shape">
        <umb-property-layout orientation="vertical" label="Shape">

          <div slot="editor" class="editor">
          <uui-select
            .value=${no(e)}
            .options=${B(["rectangle", "circle", "ellipse", "polygon", "star"], no(e))}
            @change=${(s) => u(this, c, pc).call(this, e, s.target.value)}>
          </uui-select>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Lock aspect ratio">

          <div slot="editor" class="editor">
          <uui-toggle
            label="Lock aspect ratio"
            ?checked=${e.lockAspect === !0}
            @change=${(s) => u(this, c, v).call(this, { lockAspect: s.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${t === "polygon" || t === "star" ? n`
              <div class="stack">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  .min=${f.sides.min}
                  .max=${f.sides.max}
                  .value=${e.sides ?? 5}
                  @change=${(s) => u(this, c, v).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? n`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${f.innerRatio.min}
                      .max=${f.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => u(this, c, v).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : p}
              </div>
            ` : p}

        <umb-property-layout orientation="vertical" label="Fill">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${i}
            @change=${(s) => u(this, c, v).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${i ? n`<umb-property-layout orientation="vertical" label="Fill colour">

              <div slot="editor" class="editor">
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => u(this, c, v).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </div>

            </umb-property-layout>` : p}

        <umb-property-layout orientation="vertical" label="Gradient">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => u(this, c, v).call(this, {
    gradient: s.target.checked ? xn() : null
  })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${e.gradient ? u(this, c, Ho).call(this, e.gradient, (s) => u(this, c, v).call(this, { gradient: s })) : p}

        ${t === "rectangle" ? n`<di-number-field
            .min=${f.cornerRadius.min}
            .max=${f.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => u(this, c, v).call(this, { cornerRadius: s.detail.value ?? 0 })}>
            </di-number-field>` : p}

        <umb-property-layout orientation="vertical" label="Border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-number-field
              .min=${f.borderWidth.min}
              .max=${f.borderWidth.max}
              label="Width"
              .value=${((a = e.border) == null ? void 0 : a.width) ?? 0}
              @change=${(s) => {
    var r;
    const o = s.detail.value ?? 0;
    u(this, c, v).call(this, {
      border: o > 0 ? { width: o, colour: ((r = e.border) == null ? void 0 : r.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? n`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => u(this, c, v).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : p}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
yc = function(e) {
  const t = Re(e.position, "x"), i = Re(e.position, "y"), a = e.rotation ?? 0;
  return n`
      <uui-box headline="Layout">
        ${u(this, c, ro).call(this, e, "x")} ${u(this, c, ro).call(this, e, "y")}

        <umb-property-layout orientation="vertical" label="Anchor">

          <div slot="editor" class="editor">
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => u(this, c, gc).call(this, e, s.detail.value)}>
          </di-anchor-picker>
          <small class="hint">
            Where X and Y sit on the layer's box.
            ${t || i ? n`The ${t && i ? "horizontal and vertical" : t ? "horizontal" : "vertical"}
                  ${t && i ? "components are" : "component is"} set by the edge
                  ${t && i ? "each axis tracks" : "that axis tracks"}.` : p}
            ${a !== 0 ? n`The layer turns around this point.` : p}
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
            @change=${(s) => u(this, c, v).call(this, { rotation: Tn(s.detail.value ?? 0) })}>
          </di-number-field>
          <small class="hint">Clockwise, around the anchor point. Drag the handle above the selection on the canvas; hold Shift for 15° steps.</small>
        </div>

        <div class="stack">
          <di-number-field
            .min=${f.width.min}
            .max=${f.width.max}
            label="Width"
            placeholder="Auto"
            .value=${e.size.width ?? null}
            @change=${(s) => u(this, c, oo).call(this, e, "width", s.detail.value)}>
          </di-number-field>
          <di-number-field
            .min=${f.height.min}
            .max=${f.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => u(this, c, oo).call(this, e, "height", s.detail.value)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
ro = function(e, t) {
  const i = Re(e.position, t), a = La(e.position, t), s = this.template.layers.filter((r) => r.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
  return n`
      <div class="axis">
        <umb-property-layout orientation="vertical" label="${t === "x" ? "Horizontal position" : "Vertical position"}">

          <div slot="editor" class="editor">
          <uui-select
            .value=${i ? "relative" : "absolute"}
            .options=${[
    { name: "Absolute", value: "absolute", selected: !i },
    { name: "Relative to a layer", value: "relative", selected: i }
  ]}
            @change=${(r) => u(this, c, fc).call(this, e, t, r.target.value)}>
          </uui-select>
          ${!i && s.length === 0 ? n`<small class="hint">Add another layer to position this one against it.</small>` : p}
        </div>

        </umb-property-layout>

        ${i && a ? n`
              <umb-property-layout orientation="vertical" label="Tracks">

                <div slot="editor" class="editor">
                <div class="stack">
                  <uui-select
                    .value=${a.layerKey}
                    .options=${s.map((r) => ({
    name: r.name || r.type,
    value: r.key,
    selected: r.key === a.layerKey
  }))}
                    @change=${(r) => u(this, c, Ca).call(this, e, t, { layerKey: r.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${B(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(r) => u(this, c, Ca).call(this, e, t, { edge: r.target.value })}>
                  </uui-select>
                </div>
              </div>

              </umb-property-layout>

              <di-number-field
                .min=${f.referenceGap.min}
                .max=${f.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(r) => u(this, c, Ca).call(this, e, t, { gap: r.detail.value ?? 0 })}>
              </di-number-field>
            ` : n`
              <di-number-field
                .min=${t === "x" ? f.x.min : f.y.min}
                .max=${t === "x" ? f.x.max : f.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(r) => u(this, c, v).call(this, {
    position: { ...e.position, [t]: r.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
fc = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Re(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && u(this, c, v).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Cd
      }
    }
  });
};
Ca = function(e, t, i) {
  const a = La(e.position, t);
  a && u(this, c, v).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
gc = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? Td(e.position, i, a, t) : { ...e.position, anchor: t };
  u(this, c, v).call(this, { position: s });
};
vc = function(e) {
  return n`
      <uui-box headline="Behaviour">
        <umb-property-layout orientation="vertical" label="Visible">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => u(this, c, v).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Locked">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => u(this, c, v).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${f.opacity.min}
          .max=${f.opacity.max}
          .value=${e.opacity}
          @change=${(t) => u(this, c, v).call(this, { opacity: t.detail.value ?? 1 })}>
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
            @change=${(t) => u(this, c, v).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.visibility.rule === "whenPropertyTruthy" ? n`<umb-property-layout orientation="vertical" label="Controlled by">

              <div slot="editor" class="editor">
              ${u(this, c, fi).call(this, e.visibility.propertyAlias ?? "", (t) => u(this, c, v).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </div>

            </umb-property-layout>` : p}
      </uui-box>
    `;
};
Yo = function(e, t) {
  return n`
      <umb-input-media
        max="1"
        .selection=${e ? [e] : []}
        @change=${(i) => t(i.target.selection[0] ?? null)}>
      </umb-input-media>
    `;
};
ze = function(e, t, i) {
  return n`
      <umb-property-layout orientation="vertical" label=${e} description=${Ss(i)}>
        <div slot="editor" class="editor">${t}</div>
      </umb-property-layout>
    `;
};
fi = function(e, t, i = {}) {
  const a = Md(e), s = [];
  for (let o = 0; o <= Os; o++) {
    const r = vr(a, o), l = o === 0 ? this.properties : this.linkedProperties[r] ?? [], h = a[o] ?? "";
    if (o > 0) {
      const k = (o === 1 ? this.properties : this.linkedProperties[vr(a, o - 1)] ?? []).some(
        (j) => j.alias === a[o - 1] && j.classification === "content"
      );
      if (!a[o - 1] || !k && !h) break;
    }
    const m = u(this, c, bc).call(this, am(l, o === 0 ? i.root : i.tail), h, (S) => t([...a.slice(0, o), S].filter(Boolean).join(".")));
    s.push(o === 0 ? m : n`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[r] ?? "Property on the linked item"}</span>
            ${m}
          </div>`);
  }
  return s.length === 1 ? s[0] : n`<div class="path">${s}</div>`;
};
bc = function(e, t, i) {
  return n`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${Ud(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
Xo = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
_c = function(e, t, i) {
  const a = this.fonts.find((s) => s.key === e);
  return !a || a.styles.length === 0 ? p : n`
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
    const o = s.target.value, r = a.styles.find((l) => l.name === o);
    i(o, r == null ? void 0 : r.size, r == null ? void 0 : r.fontStyle);
  }}>
        </uui-select>
      </div>

      </umb-property-layout>
    `;
};
qe.styles = A`
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
Ut([
  g({ type: Object })
], qe.prototype, "template", 2);
Ut([
  g({ type: Object })
], qe.prototype, "layer", 2);
Ut([
  g({ type: Array })
], qe.prototype, "properties", 2);
Ut([
  g({ type: Object })
], qe.prototype, "linkedProperties", 2);
Ut([
  g({ type: Object })
], qe.prototype, "linkedCaptions", 2);
Ut([
  g({ type: Array })
], qe.prototype, "fonts", 2);
qe = Ut([
  M("di-layer-inspector")
], qe);
function B(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
const sm = {
  linear: "Linear",
  radial: "Radial",
  angular: "Angular (conic)",
  diamond: "Diamond",
  reflected: "Reflected"
}, om = {
  farthestCorner: "Farthest corner",
  farthestSide: "Farthest side",
  closestCorner: "Closest corner",
  closestSide: "Closest side"
}, rm = [
  ["↑", 0, "Upwards (0°)"],
  ["→", 90, "To the right (90°)"],
  ["↓", 180, "Downwards (180°)"],
  ["←", 270, "To the left (270°)"]
];
function wc(e) {
  return B(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
function no(e) {
  const t = e.shape ?? "rectangle";
  return t === "ellipse" && e.lockAspect === !0 ? "circle" : t;
}
var nm = Object.defineProperty, lm = Object.getOwnPropertyDescriptor, $c = (e) => {
  throw TypeError(e);
}, na = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? lm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && nm(t, i, s), s;
}, cm = (e, t, i) => t.has(e) || $c("Cannot " + i), um = (e, t, i) => t.has(e) ? $c("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Oe = (e, t, i) => (cm(e, t, "access private method"), i), ve, $t, xc, kc, Tc, Sc;
const dm = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Lt = class extends L {
  constructor() {
    super(...arguments), um(this, ve), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return n`
      <div class="panel" @drop=${Oe(this, ve, Tc)}>
        <h5>Layers</h5>

        ${e.length === 0 ? n`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : Z(
      e,
      (t) => t.key,
      (t, i) => Oe(this, ve, Sc).call(this, t, i)
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
$t = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
xc = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
kc = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Tc = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Oe(this, ve, $t).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Sc = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return n`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Oe(this, ve, xc).call(this, a, e.key)}
        @dragover=${(a) => Oe(this, ve, kc).call(this, a, t)}
        @click=${() => Oe(this, ve, $t).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${dm[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Oe(this, ve, $t).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Oe(this, ve, $t).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Oe(this, ve, $t).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Oe(this, ve, $t).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Lt.styles = A`
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
na([
  g({ type: Array })
], Lt.prototype, "layers", 2);
na([
  g({ type: String })
], Lt.prototype, "selectedLayerKey", 2);
na([
  y()
], Lt.prototype, "_dragKey", 2);
na([
  y()
], Lt.prototype, "_dropIndex", 2);
Lt = na([
  M("di-layers-panel")
], Lt);
var hm = Object.defineProperty, pm = Object.getOwnPropertyDescriptor, Ec = (e) => {
  throw TypeError(e);
}, Ze = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? pm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && hm(t, i, s), s;
}, Jo = (e, t, i) => t.has(e) || Ec("Cannot " + i), mm = (e, t, i) => (Jo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Jr = (e, t, i) => t.has(e) ? Ec("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ym = (e, t, i, a) => (Jo(e, t, "write to private field"), t.set(e, i), i), ae = (e, t, i) => (Jo(e, t, "access private method"), i), G, Ue, Ga, Cc, Dc, Di;
let Ce = class extends L {
  constructor() {
    super(...arguments), Jr(this, G), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Jr(this, Ga, 100);
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
    return n`
      <div class="toolbar" @focusout=${() => this.requestUpdate()}>
        <div class="zoom">
          <!-- Stepping multiplies the *effective* scale, so stepping up out of Fit lands one
               step above what is on screen rather than jumping to 125%. -->
          <uui-button
            compact
            look="secondary"
            label="Zoom out"
            @click=${() => ae(this, G, Ue).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            compact
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${ja.min * 100}
            .max=${ja.max * 100}
            .value=${ae(this, G, Cc).call(this)}
            @change=${ae(this, G, Dc)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => ae(this, G, Ue).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => ae(this, G, Ue).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${ae(this, G, Di).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${ae(this, G, Di).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${ae(this, G, Di).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${ae(this, G, Di).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => ae(this, G, Ue).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => ae(this, G, Ue).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => ae(this, G, Ue).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
G = /* @__PURE__ */ new WeakSet();
Ue = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Ga = /* @__PURE__ */ new WeakMap();
Cc = function() {
  return this.matches(":focus-within") || ym(this, Ga, Math.round(this.effectiveScale * 100)), mm(this, Ga);
};
Dc = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && ae(this, G, Ue).call(this, "di-zoom-change", { zoom: t / 100 });
};
Di = function(e, t, i) {
  return n`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => ae(this, G, Ue).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
Ce.styles = A`
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
Ze([
  g({ type: Number })
], Ce.prototype, "effectiveScale", 2);
Ze([
  g({ type: Boolean })
], Ce.prototype, "snapEnabled", 2);
Ze([
  g({ type: Boolean })
], Ce.prototype, "showRulers", 2);
Ze([
  g({ type: Boolean })
], Ce.prototype, "showSafeArea", 2);
Ze([
  g({ type: Boolean })
], Ce.prototype, "showMeasured", 2);
Ze([
  g({ type: Boolean })
], Ce.prototype, "canUndo", 2);
Ze([
  g({ type: Boolean })
], Ce.prototype, "canRedo", 2);
Ze([
  g({ type: Boolean })
], Ce.prototype, "previewing", 2);
Ce = Ze([
  M("di-canvas-toolbar")
], Ce);
var fm = Object.defineProperty, gm = Object.getOwnPropertyDescriptor, Oc = (e) => {
  throw TypeError(e);
}, Zo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && fm(t, i, s), s;
}, Qo = (e, t, i) => t.has(e) || Oc("Cannot " + i), Vt = (e, t, i) => (Qo(e, t, "read from private field"), t.get(e)), fa = (e, t, i) => t.has(e) ? Oc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), lo = (e, t, i, a) => (Qo(e, t, "write to private field"), t.set(e, i), i), Zr = (e, t, i) => (Qo(e, t, "access private method"), i), pi, Da, Ri, Oa, Ic, Pc;
let qi = class extends L {
  constructor() {
    super(), fa(this, Oa), fa(this, pi), this._selection = [], fa(this, Da, ""), fa(this, Ri), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(gt, (e) => {
      lo(this, pi, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== Vt(this, Da) && (lo(this, Da, i), Zr(this, Oa, Ic).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
      }));
    });
  }
  render() {
    return n`
      <umb-property-layout orientation="vertical" label="Preview content" description="Empty = sample data">
        <umb-input-document
          slot="editor"
          max="1"
          .allowedContentTypeIds=${this._allowedContentTypeIds}
          .selection=${this._selection}
          @change=${Zr(this, Oa, Pc)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
pi = /* @__PURE__ */ new WeakMap();
Da = /* @__PURE__ */ new WeakMap();
Ri = /* @__PURE__ */ new WeakMap();
Oa = /* @__PURE__ */ new WeakSet();
Ic = async function(e) {
  if (!Vt(this, pi)) return;
  Vt(this, Ri) ?? lo(this, Ri, hn(Vt(this, pi).getToken).catch(() => []));
  const t = await Vt(this, Ri), i = new Set(e), a = t.filter((s) => i.has(s.alias)).map((s) => s.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
Pc = function(e) {
  var i;
  const t = e.target.selection;
  (i = Vt(this, pi)) == null || i.setSampleContentKey(t[0]);
};
qi.styles = A`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
Zo([
  y()
], qi.prototype, "_selection", 2);
Zo([
  y()
], qi.prototype, "_allowedContentTypeIds", 2);
qi = Zo([
  M("di-preview-content-picker")
], qi);
var vm = Object.defineProperty, bm = Object.getOwnPropertyDescriptor, Ac = (e) => {
  throw TypeError(e);
}, la = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && vm(t, i, s), s;
}, er = (e, t, i) => t.has(e) || Ac("Cannot " + i), Y = (e, t, i) => (er(e, t, "read from private field"), t.get(e)), vt = (e, t, i) => t.has(e) ? Ac("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pt = (e, t, i, a) => (er(e, t, "write to private field"), t.set(e, i), i), Be = (e, t, i) => (er(e, t, "access private method"), i), at, Yt, Xt, At, Ha, Ya, ke, tr, Ia, ir, co;
const _m = 400;
let Ft = class extends L {
  constructor() {
    super(), vt(this, ke), vt(this, at), vt(this, Yt), vt(this, Xt), vt(this, At), vt(this, Ha), vt(this, Ya, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(gt, (e) => {
      Pt(this, at, e), e && (this.observe(e.template, (t) => {
        t && Be(this, ke, Ia).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Pt(this, Ha, t);
        const i = (a = Y(this, at)) == null ? void 0 : a.getData();
        i && Be(this, ke, Ia).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Pt(this, Ya, t ?? !0);
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
    const e = (t = Y(this, at)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(Y(this, Yt)), this._collapsed = !1, Be(this, ke, ir).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(Y(this, Yt)), (e = Y(this, Xt)) == null || e.abort(), Be(this, ke, tr).call(this);
  }
  render() {
    return n`
      <div class="strip">
        <button
          class="toggle"
          type="button"
          aria-expanded=${!this._collapsed}
          @click=${() => {
      var e;
      if (this._collapsed = !this._collapsed, !this._collapsed) {
        const t = (e = Y(this, at)) == null ? void 0 : e.getData();
        t && Be(this, ke, Ia).call(this, t);
      }
    }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed ? p : n`
              <di-preview-content-picker></di-preview-content-picker>
              <div class="body">
                ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : p}
                ${this._error ? n`<span class="error" role="status">${this._error}</span>` : this._url ? n`<img src=${this._url} alt="Server-rendered preview of this template" />` : n`<span class="pending">Rendering…</span>`}
              </div>
            `}
      </div>
    `;
  }
};
at = /* @__PURE__ */ new WeakMap();
Yt = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
At = /* @__PURE__ */ new WeakMap();
Ha = /* @__PURE__ */ new WeakMap();
Ya = /* @__PURE__ */ new WeakMap();
ke = /* @__PURE__ */ new WeakSet();
tr = function() {
  Y(this, At) && (URL.revokeObjectURL(Y(this, At)), Pt(this, At, void 0));
};
Ia = function(e) {
  this._collapsed || (window.clearTimeout(Y(this, Yt)), Pt(this, Yt, window.setTimeout(() => void Be(this, ke, ir).call(this, e), _m)));
};
ir = async function(e) {
  var t;
  if (Y(this, at)) {
    (t = Y(this, Xt)) == null || t.abort(), Pt(this, Xt, new AbortController()), Be(this, ke, co).call(this, !0), this._error = void 0;
    try {
      const i = await pn(
        e,
        {
          signal: Y(this, Xt).signal,
          contentKey: Y(this, Ha),
          useSampleData: Y(this, Ya)
        },
        Y(this, at).getToken
      );
      Be(this, ke, tr).call(this), Pt(this, At, URL.createObjectURL(i)), this._url = Y(this, At);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Be(this, ke, co).call(this, !1);
    }
  }
};
co = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Ft.styles = A`
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
      ${Mo}
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
la([
  y()
], Ft.prototype, "_url", 2);
la([
  y()
], Ft.prototype, "_loading", 2);
la([
  y()
], Ft.prototype, "_error", 2);
la([
  y()
], Ft.prototype, "_collapsed", 2);
Ft = la([
  M("di-preview-strip")
], Ft);
var wm = Object.defineProperty, $m = Object.getOwnPropertyDescriptor, Mc = (e) => {
  throw TypeError(e);
}, K = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $m(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && wm(t, i, s), s;
}, ar = (e, t, i) => t.has(e) || Mc("Cannot " + i), $ = (e, t, i) => (ar(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Bt = (e, t, i) => t.has(e) ? Mc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Xa = (e, t, i, a) => (ar(e, t, "write to private field"), t.set(e, i), i), we = (e, t, i) => (ar(e, t, "access private method"), i), C, Gi, Hi, Jt, N, uo, sr, Rc, zc, ho, Lc, Fc, Uc, po, Wc, Nc, Bc, Pa;
const xm = 400;
let F = class extends L {
  constructor() {
    super(), Bt(this, N), Bt(this, C), Bt(this, Gi), Bt(this, Hi), Bt(this, Jt), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, Bt(this, Pa, (e) => {
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
      const s = $(this, N, uo);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), we(this, N, ho).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const r = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -r : e.key === "ArrowRight" ? r : 0, h = e.key === "ArrowUp" ? -r : e.key === "ArrowDown" ? r : 0, m = Re(s.position, "x") ? 0 : l, S = Re(s.position, "y") ? 0 : h;
            if (m === 0 && S === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + m, y: s.position.y + S }
            });
            break;
          }
          case "[":
          case "]": {
            const r = ((o = this._template) == null ? void 0 : o.layers.findIndex((l) => l.key === s.key)) ?? -1;
            if (r < 0) return;
            e.preventDefault(), i.moveLayer(s.key, e.key === "]" ? r + 1 : r - 1);
            break;
          }
        }
      }
    }), this.consumeContext(oe, (e) => {
      Xa(this, Gi, e);
    }), this.consumeContext(gt, (e) => {
      Xa(this, C, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (we(this, N, Lc).call(this, t), we(this, N, Fc).call(this, t), we(this, N, Uc).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", $(this, Pa));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", $(this, Pa)), window.clearTimeout($(this, Hi)), (e = $(this, Jt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? n`
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
        @di-layer-delete=${(e) => we(this, N, ho).call(this, e.detail.key)}
        @di-layer-detach=${(e) => we(this, N, zc).call(this, e.detail.key, e.detail.axis)}
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
        @di-palette-add=${(e) => we(this, N, po).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => we(this, N, po).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-use-image-size=${we(this, N, Bc)}
        @di-request-preview=${() => {
      var e;
      return (e = $(this, N, Rc)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(ja.min, Math.min(ja.max, e.detail.zoom));
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
            .layer=${$(this, N, uo)}
            .properties=${this._properties}
            .linkedProperties=${this._linkedProperties}
            .linkedCaptions=${this._linkedCaptions}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    ` : n`<div class="state"><uui-loader></uui-loader></div>`;
  }
};
C = /* @__PURE__ */ new WeakMap();
Gi = /* @__PURE__ */ new WeakMap();
Hi = /* @__PURE__ */ new WeakMap();
Jt = /* @__PURE__ */ new WeakMap();
N = /* @__PURE__ */ new WeakSet();
uo = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
sr = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Rc = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
zc = function(e, t) {
  var s, o, r;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = $(this, N, sr)) == null ? void 0 : o.resolvedPositionOf(e);
  (r = $(this, C)) == null || r.updateLayer(e, { position: Ds(i.position, t, a) });
};
ho = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const r = (a = $(this, N, sr)) == null ? void 0 : a.resolvedPositionOf(o.key);
    r && t.set(o.key, r);
  }
  (s = $(this, C)) == null || s.removeLayer(e, t);
};
Lc = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && $(this, C) && await il(t, $(this, C).getToken);
};
Fc = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !$(this, C)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await yn(t.mediaKey, $(this, C).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Uc = function() {
  window.clearTimeout($(this, Hi)), Xa(this, Hi, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !$(this, C))) {
      (t = $(this, Jt)) == null || t.abort(), Xa(this, Jt, new AbortController());
      try {
        const i = await mn(
          e,
          { signal: $(this, Jt).signal, useSampleData: !0 },
          $(this, C).getToken
        );
        $(this, C).setServerBounds(i.layers), $(this, C).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, xm));
};
po = function(e, t, i, a) {
  const s = this._template;
  if (!s || !$(this, C)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: we(this, N, Nc).call(this) };
  if (e.kind === "property") {
    const l = $d(e.property, o);
    if (l.kind === "condition") {
      we(this, N, Wc).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    $(this, C).addLayer(l.layer);
    return;
  }
  const r = e.layerType === "image" ? wn(o, "Image") : e.layerType === "badges" ? $n(o, "Badges", "") : e.layerType === "rect" ? _d(o, "Shape", e.preset) : _n(o, "Text", { kind: "static", text: "Text" });
  $(this, C).addLayer(r);
};
Wc = function(e, t, i) {
  var o, r, l, h;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((m) => m.key === a);
  if (!s) {
    (r = $(this, Gi)) == null || r.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = $(this, C)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (h = $(this, Gi)) == null || h.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
Nc = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Bc = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !$(this, C)) return;
  const t = await yn(e.mediaKey, $(this, C).getToken).catch(() => {
  });
  t && $(this, C).updateCanvas({ width: t.width, height: t.height });
};
Pa = /* @__PURE__ */ new WeakMap();
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
K([
  y()
], F.prototype, "_template", 2);
K([
  y()
], F.prototype, "_selectedKey", 2);
K([
  y()
], F.prototype, "_properties", 2);
K([
  y()
], F.prototype, "_linkedProperties", 2);
K([
  y()
], F.prototype, "_linkedCaptions", 2);
K([
  y()
], F.prototype, "_fonts", 2);
K([
  y()
], F.prototype, "_serverBounds", 2);
K([
  y()
], F.prototype, "_baseImageUrl", 2);
K([
  y()
], F.prototype, "_zoom", 2);
K([
  y()
], F.prototype, "_effectiveScale", 2);
K([
  y()
], F.prototype, "_previewing", 2);
K([
  y()
], F.prototype, "_snapEnabled", 2);
K([
  y()
], F.prototype, "_showRulers", 2);
K([
  y()
], F.prototype, "_showSafeArea", 2);
K([
  y()
], F.prototype, "_showMeasured", 2);
K([
  y()
], F.prototype, "_canUndo", 2);
K([
  y()
], F.prototype, "_canRedo", 2);
F = K([
  M("di-design-view")
], F);
const km = F, Tm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return F;
  },
  default: km
}, Symbol.toStringTag, { value: "Module" }));
var Sm = Object.defineProperty, Em = Object.getOwnPropertyDescriptor, Kc = (e) => {
  throw TypeError(e);
}, Qe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Em(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Sm(t, i, s), s;
}, or = (e, t, i) => t.has(e) || Kc("Cannot " + i), Q = (e, t, i) => (or(e, t, "read from private field"), t.get(e)), $i = (e, t, i) => t.has(e) ? Kc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Yi = (e, t, i, a) => (or(e, t, "write to private field"), t.set(e, i), i), tt = (e, t, i) => (or(e, t, "access private method"), i), Ae, Xi, Zt, Mt, De, rr, Aa, jc, Vc, qc;
let pe = class extends L {
  constructor() {
    super(), $i(this, De), $i(this, Ae), $i(this, Xi), $i(this, Zt), $i(this, Mt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(oe, (e) => {
      Yi(this, Xi, e);
    }), this.consumeContext(gt, (e) => {
      Yi(this, Ae, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, tt(this, De, Aa).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), tt(this, De, Aa).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Q(this, Zt)) == null || e.abort(), tt(this, De, rr).call(this);
  }
  render() {
    return this._template ? n`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => tt(this, De, Aa).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${tt(this, De, Vc)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : p}
          ${this._error ? n`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? n`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : p}
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._template.layers.length === 0 ? n`<p class="empty">This template has no layers yet.</p>` : n`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${Z(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => tt(this, De, qc).call(this, e)
    )}
              </uui-table>`}
        </uui-box>

        ${this._contentKey ? n`<uui-box headline="This page">
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
                @click=${tt(this, De, jc)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : n`<uui-loader></uui-loader>`;
  }
};
Ae = /* @__PURE__ */ new WeakMap();
Xi = /* @__PURE__ */ new WeakMap();
Zt = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakSet();
rr = function() {
  Q(this, Mt) && (URL.revokeObjectURL(Q(this, Mt)), Yi(this, Mt, void 0));
};
Aa = async function() {
  var i;
  const e = this._template;
  if (!e || !Q(this, Ae)) return;
  (i = Q(this, Zt)) == null || i.abort(), Yi(this, Zt, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: Q(this, Zt).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, s] = await Promise.all([
      pn(e, t, Q(this, Ae).getToken),
      mn(e, t, Q(this, Ae).getToken)
    ]);
    tt(this, De, rr).call(this), Yi(this, Mt, URL.createObjectURL(a)), this._url = Q(this, Mt), this._bounds = s.layers, this._skipped = s.skipped ?? [], Q(this, Ae).setServerBounds(s.layers), Q(this, Ae).setIssues(s.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
jc = async function() {
  var e, t;
  if (!(!this._contentKey || !Q(this, Ae))) {
    this._regenerating = !0;
    try {
      const i = await bo(this._contentKey, Q(this, Ae).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = Q(this, Xi)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = Q(this, Xi)) == null || t.peek("danger", {
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
Vc = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
qc = function(e) {
  var i;
  const t = this._bounds.find((a) => a.key === e.key);
  if (!t) {
    const a = (i = this._skipped.find((s) => s.key === e.key)) == null ? void 0 : i.reason;
    return n`
        <uui-table-row class="not-drawn">
          <uui-table-cell>${e.name || e.type}</uui-table-cell>
          <uui-table-cell colspan="3">
            <span class="reason">not drawn${a ? ` — ${a}` : ""}</span>
          </uui-table-cell>
        </uui-table-row>
      `;
  }
  return n`
      <uui-table-row>
        <uui-table-cell>${e.name || e.type}</uui-table-cell>
        <uui-table-cell>
          ${t.resolvedText ?? n`<em>—</em>`}
          ${t.truncated ? n`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : p}
        </uui-table-cell>
        <uui-table-cell>${Math.round(t.x)}, ${Math.round(t.y)}</uui-table-cell>
        <uui-table-cell>${Math.round(t.width)} × ${Math.round(t.height)}</uui-table-cell>
      </uui-table-row>
    `;
};
pe.styles = A`
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
      ${Mo}
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
Qe([
  y()
], pe.prototype, "_template", 2);
Qe([
  y()
], pe.prototype, "_contentKey", 2);
Qe([
  y()
], pe.prototype, "_bounds", 2);
Qe([
  y()
], pe.prototype, "_skipped", 2);
Qe([
  y()
], pe.prototype, "_url", 2);
Qe([
  y()
], pe.prototype, "_loading", 2);
Qe([
  y()
], pe.prototype, "_error", 2);
Qe([
  y()
], pe.prototype, "_regenerating", 2);
pe = Qe([
  M("di-preview-view")
], pe);
const Cm = pe, Dm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return pe;
  },
  default: Cm
}, Symbol.toStringTag, { value: "Module" }));
var Om = Object.defineProperty, Im = Object.getOwnPropertyDescriptor, Gc = (e) => {
  throw TypeError(e);
}, ca = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Im(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Om(t, i, s), s;
}, nr = (e, t, i) => t.has(e) || Gc("Cannot " + i), X = (e, t, i) => (nr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Qr = (e, t, i) => t.has(e) ? Gc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pm = (e, t, i, a) => (nr(e, t, "write to private field"), t.set(e, i), i), qt = (e, t, i) => (nr(e, t, "access private method"), i), se, de, Hc, Yc, Ja, Xc, Jc, Zc, Qc, eu, tu;
let Ge = class extends L {
  constructor() {
    super(), Qr(this, de), Qr(this, se), this._properties = [], this._showAdvanced = !1, this.consumeContext(gt, (e) => {
      Pm(this, se, e), e && (hn(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? n`
      <div class="grid">
        ${qt(this, de, Zc).call(this)} ${qt(this, de, Qc).call(this)} ${qt(this, de, eu).call(this)} ${qt(this, de, tu).call(this)}
      </div>
    ` : n`<uui-loader></uui-loader>`;
  }
};
se = /* @__PURE__ */ new WeakMap();
de = /* @__PURE__ */ new WeakSet();
Hc = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Yc = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
Ja = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
Xc = async function(e) {
  var s, o;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((r) => [r.key, r.alias])), a = [
    ...t.map((r) => i.get(r)).filter((r) => !!r),
    ...X(this, de, Ja)
  ].filter((r, l, h) => h.indexOf(r) === l);
  (s = X(this, se)) == null || s.updateTemplateFields({ docTypeAliases: a }), await ((o = X(this, se)) == null ? void 0 : o.reloadProperties());
};
Jc = function(e) {
  var i;
  const t = e.target.selection;
  (i = X(this, se)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
Zc = function() {
  const e = this._template;
  return n`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? n`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${X(this, de, Yc)}
                  @change=${qt(this, de, Xc)}></umb-input-document-type>` : n`<uui-loader-bar></uui-loader-bar>`}
            ${X(this, de, Ja).length > 0 ? n`<p class="note">
                  Also targets ${X(this, de, Ja).join(", ")}, which no document type has any more.
                </p>` : p}
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
    ...X(this, de, Hc).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = X(this, se)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = X(this, se)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Qc = function() {
  const e = this._template;
  return n`
      <uui-box headline="Output">
        <umb-property-layout
          label="Media folder"
          description="Where generated images are saved. Empty = the media root.">
          <umb-input-media
            slot="editor"
            max="1"
            folder-filter="foldersOnly"
            .selection=${e.output.mediaFolderKey ? [e.output.mediaFolderKey] : []}
            @change=${qt(this, de, Jc)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = X(this, se)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = X(this, se)) == null ? void 0 : i.updateOutput({
      format: t.target.value
    });
  }}>
          </uui-select>
        </umb-property-layout>

        ${e.output.format === "png" ? p : n`<umb-property-layout label="Quality" description="1-100. Ignored for PNG.">
              <uui-input
                slot="editor"
                type="number"
                min="1"
                max="100"
                .value=${String(e.output.quality)}
                @change=${(t) => {
    var i;
    return (i = X(this, se)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
eu = function() {
  const e = this._template;
  return n`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = X(this, se)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = X(this, se)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
tu = function() {
  const e = this._template;
  return n`
      <uui-box headline="Advanced">
        <umb-property-layout label="Alias" description="Used by export, import and file sync.">
          <uui-input
            slot="editor"
            .value=${e.alias}
            placeholder="Generated from the name"
            @change=${(t) => {
    var i;
    return (i = X(this, se)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
            ${this._showAdvanced ? n`<pre class="json">${JSON.stringify(e, null, 2)}</pre>` : p}
          </div>
        </umb-property-layout>
      </uui-box>
    `;
};
Ge.styles = A`
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
ca([
  y()
], Ge.prototype, "_template", 2);
ca([
  y()
], Ge.prototype, "_properties", 2);
ca([
  y()
], Ge.prototype, "_showAdvanced", 2);
ca([
  y()
], Ge.prototype, "_documentTypes", 2);
Ge = ca([
  M("di-settings-view")
], Ge);
const Am = Ge, Mm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return Ge;
  },
  default: Am
}, Symbol.toStringTag, { value: "Module" }));
var Rm = Object.defineProperty, zm = Object.getOwnPropertyDescriptor, iu = (e) => {
  throw TypeError(e);
}, ua = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Rm(t, i, s), s;
}, lr = (e, t, i) => t.has(e) || iu("Cannot " + i), en = (e, t, i) => (lr(e, t, "read from private field"), t.get(e)), tn = (e, t, i) => t.has(e) ? iu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Lm = (e, t, i, a) => (lr(e, t, "write to private field"), t.set(e, i), i), an = (e, t, i) => (lr(e, t, "access private method"), i), Ji, Ma, mo;
let He = class extends L {
  constructor() {
    super(), tn(this, Ma), tn(this, Ji), this._loading = !0, this._onlyMissing = !1, this.consumeContext(gt, (e) => {
      Lm(this, Ji, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && an(this, Ma, mo).call(this);
      });
    });
  }
  render() {
    if (this._loading) return n`<uui-loader></uui-loader>`;
    if (!this._usage) return n`<p class="empty">Save the template to see which content it applies to.</p>`;
    const e = this._onlyMissing ? this._usage.items.filter((t) => !t.hasImage) : this._usage.items;
    return n`
      <uui-box headline="Content using this template">
        <div slot="header-actions">
          <uui-button look="secondary" label="Reload" @click=${() => an(this, Ma, mo).call(this)}>Reload</uui-button>
        </div>

        <p class="summary">
          <strong>${this._usage.withImageOnPage}</strong> of the
          <strong>${this._usage.items.length}</strong> shown have an image.
          ${this._usage.total > this._usage.items.length ? n`<span class="muted">${this._usage.total} in total.</span>` : p}
        </p>

        <uui-toggle
          label="Only show the ones without an image"
          ?checked=${this._onlyMissing}
          @change=${(t) => {
      this._onlyMissing = t.target.checked;
    }}>
          Only without an image
        </uui-toggle>

        ${e.length === 0 ? n`<p class="empty">Nothing to show.</p>` : n`<uui-table>
              <uui-table-head>
                <uui-table-head-cell>Name</uui-table-head-cell>
                <uui-table-head-cell>Image</uui-table-head-cell>
                <uui-table-head-cell>State</uui-table-head-cell>
              </uui-table-head>
              ${Z(
      e,
      (t) => t.key,
      (t) => n`
                  <uui-table-row>
                    <uui-table-cell>${t.name}</uui-table-cell>
                    <uui-table-cell>
                      ${t.hasImage ? n`<uui-tag color="positive" look="secondary">Has one</uui-tag>` : n`<uui-tag color="warning" look="secondary">Missing</uui-tag>`}
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
Ji = /* @__PURE__ */ new WeakMap();
Ma = /* @__PURE__ */ new WeakSet();
mo = async function() {
  const e = this._template;
  if (!(!e || !en(this, Ji))) {
    this._loading = !0;
    try {
      this._usage = await pd(e.key, en(this, Ji).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
He.styles = A`
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
ua([
  y()
], He.prototype, "_template", 2);
ua([
  y()
], He.prototype, "_usage", 2);
ua([
  y()
], He.prototype, "_loading", 2);
ua([
  y()
], He.prototype, "_onlyMissing", 2);
He = ua([
  M("di-usage-view")
], He);
const Fm = He, Um = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return He;
  },
  default: Fm
}, Symbol.toStringTag, { value: "Module" })), Wm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ts,
  default: Ts
}, Symbol.toStringTag, { value: "Module" }));
var lt, Ot;
class ws extends mu {
  constructor(i, a) {
    super(i, a);
    x(this, lt);
    x(this, Ot);
    this.consumeContext(oe, (s) => {
      b(this, lt, s);
    }), this.consumeContext(gt, (s) => {
      b(this, Ot, s);
    });
  }
  async execute() {
    var s, o, r;
    const i = d(this, Ot), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = d(this, lt)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await fo(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await fn(a.key, !1, i.getToken);
        (o = d(this, lt)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await Bn(l, i.getToken, d(this, lt));
      } catch (l) {
        (r = d(this, lt)) == null || r.peek("danger", {
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
    d(this, Ot) && await hd(i, d(this, Ot).getToken);
  }
}
lt = new WeakMap(), Ot = new WeakMap();
const Nm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: ws,
  api: ws,
  default: ws
}, Symbol.toStringTag, { value: "Module" }));
var Qi, ci;
class $s extends aa {
  constructor(i, a) {
    super(i, a);
    x(this, Qi);
    x(this, ci);
    this.consumeContext(Le, (s) => {
      b(this, Qi, s);
    }), this.consumeContext(oe, (s) => {
      b(this, ci, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await bo(i, () => {
          var l;
          return (l = d(this, Qi)) == null ? void 0 : l.getLatestToken();
        }), r = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = d(this, ci)) == null || a.peek(r ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: r ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const r = o instanceof ht && o.status === 404;
        (s = d(this, ci)) == null || s.peek(r ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof ht ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Qi = new WeakMap(), ci = new WeakMap();
const Bm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: $s,
  api: $s,
  default: $s
}, Symbol.toStringTag, { value: "Module" }));
var ea, It, ta, ui;
class xs extends Au {
  constructor(i, a) {
    super(i, a);
    x(this, ea);
    x(this, It);
    x(this, ta);
    x(this, ui);
    this.consumeContext(Le, (s) => {
      b(this, ea, s);
    }), this.consumeContext(oe, (s) => {
      b(this, It, s);
    }), this.consumeContext(Mu, (s) => {
      b(this, ta, s);
    }), this.consumeContext(Ru, (s) => {
      b(this, ui, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!d(this, ui)) {
      (i = d(this, It)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const r = await bo(d(this, ui), () => {
        var l;
        return (l = d(this, ea)) == null ? void 0 : l.getLatestToken();
      });
      r.propertyValue && ((a = d(this, ta)) == null || a.setValue(JSON.parse(r.propertyValue))), (s = d(this, It)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: r.message ?? "The image has been regenerated."
        }
      });
    } catch (r) {
      const l = r instanceof ht && r.status === 404;
      (o = d(this, It)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: r instanceof ht ? r.detail ?? r.message : "The image could not be regenerated."
        }
      });
    }
  }
}
ea = new WeakMap(), It = new WeakMap(), ta = new WeakMap(), ui = new WeakMap();
const Km = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: xs,
  api: xs,
  default: xs
}, Symbol.toStringTag, { value: "Module" }));
var jm = Object.defineProperty, Vm = Object.getOwnPropertyDescriptor, au = (e) => {
  throw TypeError(e);
}, et = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Vm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && jm(t, i, s), s;
}, cr = (e, t, i) => t.has(e) || au("Cannot " + i), mi = (e, t, i) => (cr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ks = (e, t, i) => t.has(e) ? au("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qm = (e, t, i, a) => (cr(e, t, "write to private field"), t.set(e, i), i), xt = (e, t, i) => (cr(e, t, "access private method"), i), Ra, da, $e, su, ou, ru, ur, nu, lu, cu, uu;
const Gm = [100, 200, 300, 400, 500, 600, 700, 800, 900], Hm = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let me = class extends un {
  constructor() {
    super(), ks(this, $e), ks(this, Ra), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", ks(this, da, () => {
      var e;
      return (e = mi(this, Ra)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Le, (e) => {
      qm(this, Ra, e);
    });
  }
  render() {
    return n`
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
            @change=${xt(this, $e, su)}>
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
            @click=${xt(this, $e, ru)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Hm.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? xt(this, $e, uu).call(this) : xt(this, $e, cu).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !mi(this, $e, ur)}
            @click=${xt(this, $e, nu)}>
            Add web font
          </uui-button>
        </uui-box>

        ${this._error ? n`<p class="error" role="alert">${this._error}</p>` : p}
        ${this._busy ? n`<uui-loader-bar></uui-loader-bar>` : p}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Ra = /* @__PURE__ */ new WeakMap();
da = /* @__PURE__ */ new WeakMap();
$e = /* @__PURE__ */ new WeakSet();
su = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  xt(this, $e, ou).call(this, t);
};
ou = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await id(t, mi(this, da));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
ru = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await ad(this._path.trim(), mi(this, da)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
ur = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
nu = async function() {
  if (mi(this, $e, ur)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await sd(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        mi(this, da)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
lu = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
cu = function() {
  return n`
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
        ${Z(
    Gm,
    (e) => e,
    (e) => n`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => xt(this, $e, lu).call(this, e, t.target.checked)}>
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
        ${this._provider === "bunny" ? n`<br />Bunny Fonts serve the Latin subset only, so accented Latin renders but other scripts do not.` : p}
      </p>
    `;
};
uu = function() {
  return n`
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
et([
  y()
], me.prototype, "_busy", 2);
et([
  y()
], me.prototype, "_error", 2);
et([
  y()
], me.prototype, "_path", 2);
et([
  y()
], me.prototype, "_provider", 2);
et([
  y()
], me.prototype, "_family", 2);
et([
  y()
], me.prototype, "_weights", 2);
et([
  y()
], me.prototype, "_italic", 2);
et([
  y()
], me.prototype, "_url", 2);
me = et([
  M("di-font-upload-modal")
], me);
const Ym = me, Xm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return me;
  },
  default: Ym
}, Symbol.toStringTag, { value: "Module" }));
var Jm = Object.getOwnPropertyDescriptor, Zm = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(s) || s);
  return s;
};
let Za = class extends L {
  render() {
    return n`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Za = Zm([
  M("di-template-folder-editor")
], Za);
const Qm = Za, ey = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Za;
  },
  default: Qm
}, Symbol.toStringTag, { value: "Module" }));
export {
  ah as manifests,
  Cy as onInit
};
//# sourceMappingURL=dynamic-images.js.map
