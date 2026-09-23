var mr = (e) => {
  throw TypeError(e);
};
var hs = (e, t, i) => t.has(e) || mr("Cannot " + i);
var d = (e, t, i) => (hs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), x = (e, t, i) => t.has(e) ? mr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (hs(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), E = (e, t, i) => (hs(e, t, "access private method"), i);
var ms = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return d(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as bu, UmbEntityWorkspaceDataManager as _u, UmbSubmitWorkspaceAction as Os, UmbEntityNamedDetailWorkspaceContextBase as wu, UmbWorkspaceActionBase as $u } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as is, UmbContextConsumerController as xu } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as cn, UmbItemRepositoryBase as ku, UmbItemServerDataSourceBase as Tu, UmbRepositoryBase as aa } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as un, UmbItemStoreBase as Su } from "@umbraco-cms/backoffice/store";
import { UmbId as Eu } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as Du, UMB_DATE_TIME_VALUE_TYPE as Cu } from "@umbraco-cms/backoffice/value-type";
import { nothing as h, html as n, css as P, state as y, customElement as M, ifDefined as As, property as g, repeat as Q, classMap as dn, styleMap as N } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as F } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as Iu, UmbTreeRepositoryBase as Ou } from "@umbraco-cms/backoffice/tree";
import { UMB_ACTION_EVENT_CONTEXT as vi } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent as sa, UmbRequestReloadStructureForEntityEvent as pn, UmbEntityActionBase as oa } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT as ee } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as Au } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UMB_AUTH_CONTEXT as Le } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as hn, UMB_DISCARD_CHANGES_MODAL as Pu, umbConfirmModal as _o, UmbModalToken as mn, UmbModalBaseElement as yn, UMB_MODAL_MANAGER_CONTEXT as Mu } from "@umbraco-cms/backoffice/modal";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as Ru } from "@umbraco-cms/backoffice/entity";
import { tryExecute as zu } from "@umbraco-cms/backoffice/resources";
import { UmbDefaultCollectionContext as Lu } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as Fu, UmbDeselectedEvent as Uu } from "@umbraco-cms/backoffice/event";
import "@umbraco-cms/backoffice/document-type";
import "@umbraco-cms/backoffice/media";
import { UmbArrayState as $i, UmbStringState as yr, UmbObjectState as fr, UmbBooleanState as ma, UmbNumberState as Wu } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as Nu } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Bu } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as ju } from "@umbraco-cms/backoffice/document";
const as = "dynamic-images", ss = "di-template", Ps = "di:templates-changed", Ku = "/umbraco/management/api/v1/dynamic-images";
class ht extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function b(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const r = await fetch(`${Ku}${e}`, { ...i, headers: s, body: o });
  if (!r.ok) throw await Vu(r);
  return r;
}
async function Vu(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new ht(t, e.status, i);
}
const T = async (e) => e.json();
async function qu(e) {
  const t = await b("/templates?take=500", e);
  return (await T(t)).items;
}
const wo = async (e, t) => T(await b(`/templates/${e}`, t)), Gu = async (e, t) => T(await b("/templates", t, { method: "POST", json: e })), Hu = async (e, t) => T(await b(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Yu(e, t) {
  await b(`/templates/${e}`, t, { method: "DELETE" });
}
const Xu = async (e, t, i) => T(await b(`/templates/${e}/duplicate`, i, { method: "POST", json: { targetKey: t } })), Ju = async (e, t, i) => T(await b(`/templates/${e}/enabled`, i, { method: "PUT", json: { isEnabled: t } }));
async function Zu(e, t) {
  return (await b(`/templates/${e}/export`, t)).blob();
}
const Qu = async (e, t, i, a = null) => T(await b("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function fn(e, t, i, a) {
  const s = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && s.set("foldersOnly", "true"), a && s.set("parentKey", a), s.toString();
}
const gr = async (e, t, i, a) => T(await b(`/tree/root?${fn(e, t, i)}`, a)), ed = async (e, t, i, a, s) => T(await b(`/tree/children?${fn(t, i, a, e)}`, s)), td = async (e, t) => T(await b(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function os(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return T(await b(`/item?${i}`, t));
}
async function id(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), T(await b(`/collection/templates?${i}`, t));
}
async function ad(e, t, i) {
  return (await b(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const sd = async (e, t) => T(await b("/folders", t, { method: "POST", json: e })), od = async (e, t) => T(await b(`/folders/${e}`, t)), rd = async (e, t, i) => T(await b(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function gn(e, t) {
  await b(`/folders/${e}`, t, { method: "DELETE" });
}
async function nd(e, t, i) {
  await b(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function ld(e, t, i) {
  await b(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function cd(e, t, i) {
  await b("/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const ud = async (e, t, i) => T(await b("/templates/bulk-duplicate", i, { method: "POST", json: { keys: e, targetKey: t } }));
async function dd(e, t, i) {
  await b("/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
const Fa = async (e) => T(await b("/fonts", e));
async function pd(e, t) {
  const i = new FormData();
  return i.append("file", e), T(await b("/fonts", t, { method: "POST", body: i }));
}
const hd = async (e, t) => T(await b("/fonts/register-path", t, { method: "POST", json: { path: e } })), md = async (e, t) => T(await b("/fonts/register-web", t, { method: "POST", json: e })), yd = async (e, t) => T(await b(`/fonts/${e}/refresh`, t, { method: "POST" })), fd = async (e, t, i, a, s) => T(await b(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function gd(e, t) {
  await b(`/fonts/${e}`, t, { method: "DELETE" });
}
async function vd(e, t) {
  return (await b(`/fonts/${e}/file`, t)).arrayBuffer();
}
const vn = async (e) => T(await b("/document-types", e)), bd = async (e, t) => T(await b(`/document-types/${encodeURIComponent(e)}/properties`, t)), _d = async (e, t, i) => T(await b(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function bn(e, t, i) {
  return (await b("/preview", i, {
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
const _n = async (e, t, i) => T(await b("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), wn = async (e, t) => T(await b(`/media/${e}/image-info`, t)), $o = async (e, t) => T(await b(`/documents/${e}/regenerate`, t, { method: "POST" })), $n = async (e, t, i) => T(await b(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), wd = async (e, t) => T(await b(`/jobs/${e}`, t));
async function $d(e, t) {
  await b(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const xd = async (e, t) => T(await b(`/templates/${e}/usage`, t)), xn = async (e) => T(await b("/health", e)), kd = async (e) => T(await b("/sync/status", e)), Td = async (e) => T(await b("/sync/export", e, { method: "POST" })), Sd = async (e) => T(await b("/sync/import", e, { method: "POST" }));
function xo(e) {
  const t = `section/${as}/workspace/${ss}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Ed(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${as}/workspace/${ss}/create${t}`, document.baseURI).pathname;
}
function kn(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${as}/workspace/${e}${i}`, document.baseURI).pathname;
}
function Dd(e) {
  return new URL(`section/${as}/dashboard/${e}`, document.baseURI).pathname;
}
function Tn() {
  window.dispatchEvent(new CustomEvent(Ps));
}
const rs = () => crypto.randomUUID();
function ns(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function Sn(e, t, i) {
  const { x: a, y: s } = ns(e);
  return {
    type: "text",
    key: rs(),
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
function En(e, t, i) {
  const { x: a, y: s } = ns(e);
  return {
    type: "image",
    key: rs(),
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
function Dn(e, t, i) {
  const { x: a, y: s } = ns(e);
  return {
    type: "badges",
    key: rs(),
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
const Li = {
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
}, Cd = Object.keys(Li);
function Id(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = ns(e), o = Li[i] ?? Li.rectangle;
  return {
    type: "rect",
    key: rs(),
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
function Od(e) {
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
function Ad(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (Od(e.classification)) {
    case "image":
      return { kind: "layer", layer: En(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: Dn(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: Sn(t, e.name, Pd(e)) };
  }
}
function Pd(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Cn() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function Md(e) {
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
const In = [
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
function Fi(e) {
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
function Ui(e) {
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
function Ms(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return In[a * 3 + i];
}
function ls(e, t, i) {
  return {
    x: e.x - t * Fi(e.anchor),
    y: e.y - i * Ui(e.anchor)
  };
}
function ko(e, t, i, a, s) {
  return {
    x: e + i * Fi(s),
    y: t + a * Ui(s)
  };
}
function Rd(e, t, i, a) {
  const s = ls(e, t, i), o = ko(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function zd(e, t) {
  const i = ko(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function On(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function qt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, r = Math.cos(o), l = Math.sin(o), p = e - i, m = t - a;
  return { x: i + p * r - m * l, y: a + p * l + m * r };
}
function Ld(e, t, i, a, s) {
  return qt(e, t, i, a, -s);
}
function An(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    qt(e.x, e.y, t, i, a),
    qt(e.x + e.width, e.y, t, i, a),
    qt(e.x + e.width, e.y + e.height, t, i, a),
    qt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((m) => m.x)), r = Math.max(...s.map((m) => m.x)), l = Math.min(...s.map((m) => m.y)), p = Math.max(...s.map((m) => m.y));
  return { x: o, y: l, width: r - o, height: p - l };
}
const Fd = 10;
function Re(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Pn(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Ua(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function vr(e) {
  return e === "below" || e === "above";
}
function br(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Ud(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Wd(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = br(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const r = t.get(o);
    r && s.push(...br(r.position).map((l) => l.layerKey));
  }
  return !1;
}
function Nd(e, t, i) {
  const a = e.position;
  if (!Pn(a)) return a;
  if (Wd(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, r = Fi(a.anchor), l = Ui(a.anchor);
  const p = _r(e, a.relativeX, !1, t, i);
  p && (s = p.coordinate, r = p.factor);
  const m = _r(e, a.relativeY, !0, t, i);
  return m && (o = m.coordinate, l = m.factor), { x: s, y: o, anchor: Ms(r, l) };
}
function _r(e, t, i, a, s) {
  if (!t || vr(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let r = t.layerKey;
  for (; !o.has(r); ) {
    o.add(r);
    const l = a.get(r);
    if (!l) return;
    const p = s(r);
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
    if (!m || vr(m.edge) !== i) return;
    r = m.layerKey;
  }
}
function Bd(e, t, i) {
  const a = Ud(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), r = (l) => {
    const p = s.get(l.key);
    if (p) return p;
    let m;
    o.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), m = Nd(l, a, (ye) => {
      const fe = a.get(ye);
      return fe && !i(fe) ? r(fe).extent : void 0;
    }), o.delete(l.key));
    const S = t(l), k = ls(m, S.width, S.height), V = { x: k.x, y: k.y, width: S.width, height: S.height }, ae = { position: m, box: V, extent: An(V, m.x, m.y, l.rotation ?? 0) };
    return s.set(l.key, ae), ae;
  };
  for (const l of e) r(l);
  return s;
}
function Rs(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? Ms(Fi(i.anchor), Ui(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? Ms(Fi(e.anchor), Ui(i.anchor)) : e.anchor
  };
}
var ce, We, Oe, ot;
class jd {
  constructor(t = 100) {
    x(this, ce, []);
    x(this, We, []);
    x(this, Oe, 0);
    x(this, ot);
    this.limit = t;
  }
  get canUndo() {
    return d(this, ce).length > 0;
  }
  get canRedo() {
    return d(this, We).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    d(this, Oe) > 0 || (d(this, ce).push(structuredClone(t)), d(this, ce).length > this.limit && d(this, ce).shift(), _(this, We, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    d(this, Oe) === 0 && _(this, ot, structuredClone(t)), ms(this, Oe)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    d(this, Oe) !== 0 && (ms(this, Oe)._--, !(d(this, Oe) > 0) && (t && d(this, ot) !== void 0 && (d(this, ce).push(d(this, ot)), d(this, ce).length > this.limit && d(this, ce).shift(), _(this, We, [])), _(this, ot, void 0)));
  }
  undo(t) {
    const i = d(this, ce).pop();
    if (i !== void 0)
      return d(this, We).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = d(this, We).pop();
    if (i !== void 0)
      return d(this, ce).push(structuredClone(t)), i;
  }
  clear() {
    _(this, ce, []), _(this, We, []), _(this, Oe, 0), _(this, ot, void 0);
  }
}
ce = new WeakMap(), We = new WeakMap(), Oe = new WeakMap(), ot = new WeakMap();
const zs = 3, Kd = (e) => Vd(e), wr = (e, t) => e.slice(0, Math.max(0, t)).join("."), Vd = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), qd = "Page";
function Gd(e) {
  return e.isSystem ? qd : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const Bt = (e) => e ?? Number.MAX_SAFE_INTEGER;
function Hd(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || Bt(t.property.tabSortOrder) - Bt(i.property.tabSortOrder) || Bt(t.property.groupSortOrder) - Bt(i.property.groupSortOrder) || Bt(t.property.sortOrder) - Bt(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function Yd(e, t) {
  const i = Hd(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: Gd(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function Xd(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const Jd = "DynamicImages.Workspace.Template", Zd = 12, $r = 36;
var ii, rt, Tt, St, ai, Et, si, oi, Dt, nt, ri, Ne, ni, li, ue, Qi, Ct, Ae, It, w, Mn, ci, ui, Ls, Fs, Us, Fe, bt, Ws, ba, Rn, zn, Ln, Ns;
class Qd extends bu {
  constructor(i) {
    super(i, Jd);
    x(this, w);
    x(this, ii);
    x(this, rt);
    x(this, Tt);
    x(this, St);
    x(this, ai);
    x(this, Et);
    x(this, si);
    x(this, oi);
    x(this, Dt);
    x(this, nt);
    x(this, ri);
    x(this, Ne);
    x(this, ni);
    x(this, li);
    x(this, ue);
    x(this, Qi);
    x(this, Ct);
    x(this, Ae);
    x(this, It);
    x(this, ci);
    x(this, ui);
    this._data = new _u(this), this.template = this._data.current, _(this, ii, new $i([], (a) => a.key)), this.layers = d(this, ii).asObservable(), _(this, rt, new yr(void 0)), this.selectedLayerKey = d(this, rt).asObservable(), _(this, Tt, new $i([], (a) => a.alias)), this.properties = d(this, Tt).asObservable(), _(this, St, new fr({})), this.linkedProperties = d(this, St).asObservable(), _(this, ai, new fr({})), this.linkedCaptions = d(this, ai).asObservable(), _(this, Et, new $i([], (a) => a.key)), this.fonts = d(this, Et).asObservable(), _(this, si, new $i([], (a) => a.key)), this.serverBounds = d(this, si).asObservable(), _(this, oi, new $i([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = d(this, oi).asObservable(), _(this, Dt, new yr(void 0)), this.sampleContentKey = d(this, Dt).asObservable(), _(this, nt, new ma(!0)), this.useSampleData = d(this, nt).asObservable(), _(this, ri, new Wu(1)), this.zoom = d(this, ri).asObservable(), _(this, Ne, new ma(!0)), this.loading = d(this, Ne).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ni, new ma(!1)), this.canUndo = d(this, ni).asObservable(), _(this, li, new ma(!1)), this.canRedo = d(this, li).asObservable(), _(this, ue, new jd()), _(this, Ae, !1), _(this, It, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, ci, async (a) => {
      const s = a.detail;
      if (d(this, It) || !(s != null && s.url) || !E(this, w, Mn).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await hn(this, Pu), _(this, It, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, ui, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = d(this, Qi)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => bs),
        setup: (a, s) => {
          const o = s.match.params.parentUnique;
          return this.createScaffold(void 0, o && o !== "null" ? o : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => bs),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => bs),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Le, (a) => {
      _(this, Qi, a);
    }), this.consumeContext(ee, (a) => {
      _(this, Ct, a);
    }), window.addEventListener("willchangestate", d(this, ci)), window.addEventListener("beforeunload", d(this, ui)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return d(this, Ae);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    d(this, Ne).setValue(!0), _(this, Ae, !1);
    try {
      const a = await wo(i, this.getToken);
      E(this, w, bt).call(this, a, { resetHistory: !0, persist: !0 }), E(this, w, zn).call(this), this.setIsNew(!1), await E(this, w, Ls).call(this, a);
    } catch (a) {
      E(this, w, Ns).call(this, "This template could not be loaded", a);
    } finally {
      d(this, Ne).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    d(this, Ne).setValue(!0), _(this, Ae, !0), E(this, w, bt).call(this, { ...Md(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await E(this, w, Ls).call(this, this._data.getCurrent()), d(this, Ne).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await E(this, w, Us).call(this, i.docTypeAliases);
    d(this, Tt).setValue(a), d(this, St).setValue(await E(this, w, Fs).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    d(this, Et).setValue(await Fa(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    E(this, w, Fe).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    E(this, w, Fe).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    E(this, w, Fe).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    E(this, w, Fe).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    E(this, w, Fe).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    E(this, w, Fe).call(this, (s) => ({
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
    E(this, w, Fe).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, p;
        let r = o.position;
        return ((l = Ua(r, "x")) == null ? void 0 : l.layerKey) === i && (r = Rs(r, "x", a == null ? void 0 : a.get(o.key))), ((p = Ua(r, "y")) == null ? void 0 : p.layerKey) === i && (r = Rs(r, "y", a == null ? void 0 : a.get(o.key))), r === o.position ? o : { ...o, position: r };
      })
    })), d(this, rt).getValue() === i && this.selectLayer(void 0);
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
    E(this, w, Fe).call(this, (s) => {
      const o = [...s.layers], r = o.findIndex((p) => p.key === i);
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
    d(this, rt).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = d(this, rt).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && d(this, ue).begin(i);
  }
  endTransaction(i = !0) {
    d(this, ue).end(i), E(this, w, Ws).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = d(this, ue).undo(i);
    a && E(this, w, bt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = d(this, ue).redo(i);
    a && E(this, w, bt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    d(this, si).setValue(i);
  }
  setIssues(i) {
    d(this, oi).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    d(this, Dt).setValue(i), d(this, nt).setValue(!i), E(this, w, Rn).call(this, i);
  }
  setUseSampleData(i) {
    d(this, nt).setValue(i);
  }
  setZoom(i) {
    d(this, ri).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = d(this, Ae) ? await Gu(i, this.getToken) : await Hu(i, this.getToken);
      E(this, w, bt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const r = d(this, Ae);
      _(this, Ae, !1), this.setIsNew(!1), Tn(), await E(this, w, Ln).call(this, o.template, r), (a = d(this, Ct)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = d(this, Ct)) == null || s.peek("warning", { data: { message: l.message } });
      r && window.history.replaceState({}, "", xo(o.template.key));
    } catch (o) {
      throw E(this, w, Ns).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, It, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", d(this, ci)), window.removeEventListener("beforeunload", d(this, ui)), d(this, ue).clear(), super.destroy();
  }
}
ii = new WeakMap(), rt = new WeakMap(), Tt = new WeakMap(), St = new WeakMap(), ai = new WeakMap(), Et = new WeakMap(), si = new WeakMap(), oi = new WeakMap(), Dt = new WeakMap(), nt = new WeakMap(), ri = new WeakMap(), Ne = new WeakMap(), ni = new WeakMap(), li = new WeakMap(), ue = new WeakMap(), Qi = new WeakMap(), Ct = new WeakMap(), Ae = new WeakMap(), It = new WeakMap(), w = new WeakSet(), /**
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
Mn = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, ci = new WeakMap(), ui = new WeakMap(), Ls = async function(i) {
  const [a, s] = await Promise.all([
    Fa(this.getToken).catch(() => []),
    E(this, w, Us).call(this, i.docTypeAliases)
  ]);
  d(this, Et).setValue(a), d(this, Tt).setValue(s), d(this, St).setValue(await E(this, w, Fs).call(this, i.docTypeAliases, s));
}, Fs = async function(i, a) {
  const s = {}, o = {};
  if (i.length === 0) return s;
  let r = a.filter((p) => p.classification === "content").slice(0, Zd).map((p) => p.alias), l = 0;
  for (let p = 1; p <= zs && r.length > 0 && l < $r; p++) {
    const m = r.slice(0, $r - l);
    l += m.length;
    const S = await Promise.all(m.map(async (k) => {
      var wi;
      const V = await Promise.all(
        i.map((se) => _d(se, k, this.getToken).catch(() => null))
      ), ae = /* @__PURE__ */ new Map();
      for (const se of V.flatMap((_e) => (_e == null ? void 0 : _e.properties) ?? []))
        ae.has(se.alias) || ae.set(se.alias, se);
      const ye = V.filter((se) => se !== null), fe = [...new Set(ye.flatMap((se) => se.targetDocTypes.map((_e) => _e.name)))], Nt = ye.some((se) => se.inference === "all") ? "all" : (wi = ye[0]) == null ? void 0 : wi.inference;
      return { prefix: k, properties: [...ae.values()], caption: Xd(fe, Nt) };
    }));
    r = [];
    for (const k of S)
      k.properties.length !== 0 && (s[k.prefix] = k.properties, o[k.prefix] = k.caption, p < zs && r.push(...k.properties.filter((V) => V.classification === "content" && !V.isSystem).map((V) => `${k.prefix}.${V.alias}`)));
  }
  return d(this, ai).setValue(o), s;
}, Us = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => bd(o, this.getToken).catch(() => []))
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
  a && d(this, ue).push(s);
  const o = i(structuredClone(s));
  E(this, w, bt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
bt = function(i, a) {
  a != null && a.resetHistory && d(this, ue).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), d(this, ii).setValue(i.layers), E(this, w, Ws).call(this);
}, Ws = function() {
  d(this, ni).setValue(d(this, ue).canUndo), d(this, li).setValue(d(this, ue).canRedo);
}, ba = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, Rn = function(i) {
  try {
    i ? localStorage.setItem(E(this, w, ba).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(E(this, w, ba).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
zn = function() {
  let i;
  try {
    const a = localStorage.getItem(E(this, w, ba).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  d(this, Dt).setValue(i), d(this, nt).setValue(!i);
}, Ln = async function(i, a) {
  const s = await this.getContext(vi).catch(() => {
  });
  s && (a ? s.dispatchEvent(new sa({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : s.dispatchEvent(new pn({ entityType: "di-template", unique: i.key })));
}, Ns = function(i, a) {
  var o;
  const s = a instanceof ht ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = d(this, Ct)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const gt = new is(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Ke = "di-template-root", W = "di-template-folder", H = ss, $t = "DynamicImages.Tree.Templates", Gt = "DynamicImages.Repository.TemplateTree", Pi = "DynamicImages.Repository.TemplateFolder", ep = "DynamicImages.Store.TemplateFolder", Wa = "DynamicImages.Workspace.TemplateFolder", Fn = "DynamicImages.Workspace.TemplateRoot", ys = "DynamicImages.Repository.TemplateItem", tp = "DynamicImages.Store.TemplateItem", fs = "DynamicImages.Repository.TemplateDetail", ip = "DynamicImages.Store.TemplateDetail", xr = "DynamicImages.Repository.MoveTemplate", kr = "DynamicImages.Repository.MoveTemplateFolder", Tr = "DynamicImages.Repository.DuplicateTemplate", Sr = "DynamicImages.Repository.BulkMoveTemplates", Er = "DynamicImages.Repository.BulkDuplicateTemplates", Dr = "DynamicImages.Repository.SortTemplateChildren", Un = "icon-picture", Wn = "icon-picture color-grey", Nn = "icon-folder", Na = "DynamicImages.Collection.Templates", Cr = "DynamicImages.Repository.TemplateCollection";
async function z(e, t) {
  const i = (async () => {
    const a = await new xu(e, Le).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (s) {
      throw s instanceof ht ? { type: "error", title: s.message, status: s.status, detail: s.detail } : s;
    }
  })();
  return await zu(e, i);
}
var lt;
class ap {
  constructor(t) {
    x(this, lt);
    _(this, lt, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: W,
      unique: Eu.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await z(d(this, lt), (s) => od(t, s));
    return i ? { data: { entityType: W, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await z(d(this, lt), (o) => sd({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await z(d(this, lt), (s) => rd(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return z(d(this, lt), (i) => gn(t, i));
  }
}
lt = new WeakMap();
const To = new is("DiTemplateFolderStore");
class Bn extends un {
  constructor(t) {
    super(t, To);
  }
}
class Ir extends cn {
  constructor(t) {
    super(t, ap, To);
  }
}
const sp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: To,
  DiTemplateFolderRepository: Ir,
  DiTemplateFolderStore: Bn,
  api: Ir
}, Symbol.toStringTag, { value: "Module" })), op = [
  {
    type: "repository",
    alias: Pi,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => sp)
  },
  {
    type: "store",
    alias: ep,
    name: "Dynamic Images Template Folder Store",
    api: Bn
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [W],
    meta: { folderRepositoryAlias: Pi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [W],
    meta: { folderRepositoryAlias: Pi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Wa,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => _p),
    meta: { entityType: W }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: Os,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Wa }]
  }
], rp = [
  {
    type: "repository",
    alias: Gt,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => xp)
  },
  {
    type: "tree",
    kind: "default",
    alias: $t,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: Gt }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [Ke, W, H]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: $t, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: Fn,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: Ke, headline: "Templates" }
  },
  ...op
], So = new is("DiTemplateItemStore");
class jn extends Su {
  constructor(t) {
    super(t, So);
  }
}
class np extends Tu {
  constructor(t) {
    super(t, {
      getItems: (i) => z(t, (a) => os(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? W : H,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class Or extends ku {
  constructor(t) {
    super(t, np, So);
  }
}
const lp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: So,
  DiTemplateItemRepository: Or,
  DiTemplateItemStore: jn,
  api: Or
}, Symbol.toStringTag, { value: "Module" })), Eo = new is("DiTemplateDetailStore");
class Kn extends un {
  constructor(t) {
    super(t, Eo);
  }
}
const gs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var di;
class cp {
  constructor(t) {
    x(this, di);
    this.createScaffold = gs, this.create = gs, this.update = gs, _(this, di, t);
  }
  async read(t) {
    const { data: i, error: a } = await z(d(this, di), (s) => wo(t, s));
    return i ? { data: { entityType: H, unique: i.key, name: i.name } } : { error: a };
  }
  /**
   * A template, or a folder: the collection's bulk Delete sends every selected key here, and a
   * selection can hold both. A folder that is not empty is refused by the server with a 409, which
   * core's bulk action shows as that item's error.
   */
  delete(t) {
    return z(d(this, di), async (i) => {
      const [a] = await os([t], i);
      return (a == null ? void 0 : a.entityType) === "folder" ? gn(t, i) : Yu(t, i);
    });
  }
}
di = new WeakMap();
class Ar extends cn {
  constructor(t) {
    super(t, cp, Eo);
  }
}
const up = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: Eo,
  DiTemplateDetailRepository: Ar,
  DiTemplateDetailStore: Kn,
  api: Ar
}, Symbol.toStringTag, { value: "Module" })), jt = [Ke, W], vs = [{ alias: "Umb.Condition.CollectionAlias", match: Na }], dp = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: ys,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => lp)
  },
  {
    type: "itemStore",
    alias: tp,
    name: "Dynamic Images Template Item Store",
    api: jn
  },
  {
    type: "repository",
    alias: fs,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => up)
  },
  {
    type: "store",
    alias: ip,
    name: "Dynamic Images Template Detail Store",
    api: Kn
  },
  {
    type: "repository",
    alias: xr,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => Sp)
  },
  {
    type: "repository",
    alias: kr,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => Ep)
  },
  {
    type: "repository",
    alias: Tr,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => Dp)
  },
  {
    type: "repository",
    alias: Dr,
    name: "Dynamic Images Sort Template Children Repository",
    api: () => Promise.resolve().then(() => Cp)
  },
  {
    type: "repository",
    alias: Sr,
    name: "Dynamic Images Bulk Move Templates Repository",
    api: () => Promise.resolve().then(() => Ap)
  },
  {
    type: "repository",
    alias: Er,
    name: "Dynamic Images Bulk Duplicate Templates Repository",
    api: () => Promise.resolve().then(() => Pp)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: jt,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => Mp),
    forEntityTypes: jt,
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
    forEntityTypes: jt,
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
    forEntityTypes: [H],
    meta: {
      treeRepositoryAlias: Gt,
      moveRepositoryAlias: xr,
      treeAlias: $t,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Template To",
    forEntityTypes: [H],
    meta: {
      duplicateRepositoryAlias: Tr,
      treeRepositoryAlias: Gt,
      treeAlias: $t,
      foldersOnly: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Enable",
    name: "Enable Dynamic Images Template",
    api: () => Promise.resolve().then(() => Rp),
    forEntityTypes: [H],
    weight: 560,
    meta: { icon: "icon-check", label: "Enable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Disable",
    name: "Disable Dynamic Images Template",
    api: () => Promise.resolve().then(() => zp),
    forEntityTypes: [H],
    weight: 550,
    meta: { icon: "icon-block", label: "Disable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => Lp),
    forEntityTypes: [H],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => Up),
    forEntityTypes: [H],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [H],
    meta: {
      itemRepositoryAlias: ys,
      detailRepositoryAlias: fs,
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
      treeRepositoryAlias: Gt,
      moveRepositoryAlias: kr,
      treeAlias: $t,
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
    api: () => Promise.resolve().then(() => Bp),
    forEntityTypes: jt,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "sortChildrenOf",
    alias: "DynamicImages.EntityAction.Template.SortChildren",
    name: "Sort Dynamic Images Templates",
    forEntityTypes: jt,
    meta: {
      sortChildrenOfRepositoryAlias: Dr,
      treeRepositoryAlias: Gt
    }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: jt
  },
  // ---------------------------------------------------------------- collection selection
  // Any of these applying is what turns on the collection's checkboxes.
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Template.MoveTo",
    name: "Move Dynamic Images Templates",
    forEntityTypes: [H, W],
    meta: {
      bulkMoveRepositoryAlias: Sr,
      treeAlias: $t,
      foldersOnly: !0
    },
    conditions: vs
  },
  {
    type: "entityBulkAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityBulkAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Templates To",
    forEntityTypes: [H, W],
    meta: {
      bulkDuplicateRepositoryAlias: Er,
      treeAlias: $t,
      foldersOnly: !0
    },
    conditions: vs
  },
  {
    type: "entityBulkAction",
    kind: "delete",
    alias: "DynamicImages.EntityBulkAction.Template.Delete",
    name: "Delete Dynamic Images Templates",
    forEntityTypes: [H, W],
    meta: {
      itemRepositoryAlias: ys,
      detailRepositoryAlias: fs
    },
    conditions: vs
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => Hp)
  }
], ya = [{ alias: "Umb.Condition.CollectionAlias", match: Na }], pp = [
  {
    type: "repository",
    alias: Cr,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => Yp)
  },
  {
    type: "collection",
    kind: "default",
    alias: Na,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => Xp),
    meta: { repositoryAlias: Cr }
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
        { field: "isEnabled", label: "Enabled", valueType: Du },
        { field: "updated", label: "Last updated", valueType: Cu }
      ]
    },
    conditions: ya
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: ya
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => eh),
    forEntityTypes: [H]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: ya
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: ya
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
      collectionAlias: Na
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [Fn, Wa]
      }
    ]
  }
], hp = [
  ...rp,
  ...dp,
  ...pp,
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
    element: () => Promise.resolve().then(() => sh),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => dh),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => yh),
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
    api: Qd,
    meta: { entityType: ss }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => Wm),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Km),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Ym),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => ey),
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
    api: () => Promise.resolve().then(() => ty),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => iy),
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
    api: () => Promise.resolve().then(() => ay),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => sy),
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
    element: () => Promise.resolve().then(() => dy)
  }
], jy = (e, t) => {
  t.registerMany(hp);
};
var mp = Object.defineProperty, yp = Object.getOwnPropertyDescriptor, Vn = (e) => {
  throw TypeError(e);
}, Do = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && mp(t, i, s), s;
}, Co = (e, t, i) => t.has(e) || Vn("Cannot " + i), fp = (e, t, i) => (Co(e, t, "read from private field"), t.get(e)), Pr = (e, t, i) => t.has(e) ? Vn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), gp = (e, t, i, a) => (Co(e, t, "write to private field"), t.set(e, i), i), vp = (e, t, i) => (Co(e, t, "access private method"), i), Ba, Bs, qn;
let zt = class extends F {
  constructor() {
    super(), Pr(this, Bs), Pr(this, Ba), this._name = "", this._loading = !0, this.consumeContext(gt, (e) => {
      gp(this, Ba, e), e && (this.observe(e.template, (t) => {
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
            @input=${vp(this, Bs, qn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : h}
    `;
  }
};
Ba = /* @__PURE__ */ new WeakMap();
Bs = /* @__PURE__ */ new WeakSet();
qn = function(e) {
  var i;
  const t = e.target.value;
  (i = fp(this, Ba)) == null || i.updateTemplateFields({ name: t });
};
zt.styles = P`
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
Do([
  y()
], zt.prototype, "_name", 2);
Do([
  y()
], zt.prototype, "_loading", 2);
zt = Do([
  M("di-template-editor")
], zt);
const bp = zt, bs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return zt;
  },
  default: bp
}, Symbol.toStringTag, { value: "Module" }));
class Mr extends wu {
  constructor(t) {
    super(t, {
      workspaceAlias: Wa,
      entityType: W,
      detailRepositoryAlias: Pi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => yy),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const _p = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: Mr,
  api: Mr
}, Symbol.toStringTag, { value: "Module" }));
function _s(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function wp(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? W : Ke
    },
    name: e.name,
    entityType: t ? W : H,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? Nn : e.isEnabled ? Un : Wn,
    isEnabled: e.isEnabled
  };
}
class $p extends Iu {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = _s(i);
        return z(t, (o) => gr(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: r, take: l } = _s(i);
          return z(t, (p) => gr(r, l, i.foldersOnly ?? !1, p));
        }
        const a = i.parent.unique, { skip: s, take: o } = _s(i);
        return z(t, (r) => ed(a, s, o, i.foldersOnly ?? !1, r));
      },
      getAncestorsOf: (i) => z(t, (a) => td(i.treeItem.unique, a)),
      mapper: wp
    });
  }
}
class Rr extends Ou {
  constructor(t) {
    super(t, $p);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: Ke,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const xp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: Rr,
  api: Rr
}, Symbol.toStringTag, { value: "Module" }));
class Gn extends aa {
  async requestMoveTo(t) {
    const { error: i } = await z(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(ee);
      a == null || a.peek("positive", { data: { message: "Moved" } });
      const s = await this.getContext(vi).catch(() => {
      }), o = t.destination.unique;
      s == null || s.dispatchEvent(new sa({
        entityType: o ? W : Ke,
        unique: o
      }));
    }
    return { error: i };
  }
}
class kp extends Gn {
  constructor() {
    super(...arguments), this.move = nd;
  }
}
class Tp extends Gn {
  constructor() {
    super(...arguments), this.move = ld;
  }
}
const Sp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: kp
}, Symbol.toStringTag, { value: "Module" })), Ep = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Tp
}, Symbol.toStringTag, { value: "Module" }));
class zr extends aa {
  async requestDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: s } = await z(this, (o) => Xu(t.unique, i, o));
    if (a) {
      const o = await this.getContext(ee);
      o == null || o.peek("positive", { data: { message: `'${a.template.name}' created` } });
      const r = await this.getContext(vi).catch(() => {
      });
      r == null || r.dispatchEvent(new sa({
        entityType: i ? W : Ke,
        unique: i
      }));
    }
    return { error: s };
  }
}
const Dp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateToTemplateRepository: zr,
  api: zr
}, Symbol.toStringTag, { value: "Module" }));
class Lr extends aa {
  async sortChildrenOf(t) {
    const i = t.sorting.map((s) => ({ key: s.unique, sortOrder: s.sortOrder })), { error: a } = await z(this, (s) => dd(t.unique, i, s));
    if (!a) {
      const s = await this.getContext(ee);
      s == null || s.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const Cp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortTemplateChildrenRepository: Lr,
  api: Lr
}, Symbol.toStringTag, { value: "Module" })), Hn = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
class Yn extends aa {
  async reloadDestination(t) {
    const i = await this.getContext(vi).catch(() => {
    });
    i == null || i.dispatchEvent(new sa({
      entityType: t ? W : Ke,
      unique: t
    }));
  }
  async notify(t, i) {
    const a = await this.getContext(ee);
    a == null || a.peek(t, { data: { message: i } });
  }
}
class Ip extends Yn {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await z(this, (s) => cd(t.uniques, i, s));
    return await this.reloadDestination(i), a || await this.notify("positive", `Moved ${Hn(t.uniques.length, "item")}`), { error: a };
  }
}
class Op extends Yn {
  async requestBulkDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: s } = await z(this, (o) => ud(t.uniques, i, o));
    return a ? (await this.reloadDestination(i), a.created.length > 0 && await this.notify("positive", `Copied ${Hn(a.created.length, "template")}`), a.skippedFolders.length > 0 && await this.notify("warning", `Folders are not copied: ${a.skippedFolders.join(", ")}`), a.errors.length > 0 && await this.notify("warning", a.errors.join(" ")), {}) : { error: s };
  }
}
const Ap = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ip
}, Symbol.toStringTag, { value: "Module" })), Pp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Op
}, Symbol.toStringTag, { value: "Module" }));
class Fr extends Au {
  async getHref() {
    return Ed({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const Mp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: Fr,
  api: Fr
}, Symbol.toStringTag, { value: "Module" }));
class Io extends oa {
  async execute() {
    var m;
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await z(this, (S) => Ju(t, this.enable, S));
    if (a || !i) throw a ?? new Error("The template could not be changed.");
    const { data: s } = await z(this, (S) => os([t], S)), o = ((m = s == null ? void 0 : s[0]) == null ? void 0 : m.name) ?? "The template", r = this.enable ? "enabled" : "disabled", l = await this.getContext(ee);
    if (!i.changed) {
      l == null || l.peek("default", { data: { message: `'${o}' is already ${r}` } });
      return;
    }
    l == null || l.peek("positive", { data: { message: `'${o}' ${r}` } });
    const p = await this.getContext(vi).catch(() => {
    });
    p == null || p.dispatchEvent(new pn({ unique: t, entityType: this.args.entityType })), Tn();
  }
}
class Ur extends Io {
  constructor() {
    super(...arguments), this.enable = !0;
  }
}
const Rp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiEnableTemplateEntityAction: Ur,
  DiSetTemplateEnabledEntityAction: Io,
  api: Ur
}, Symbol.toStringTag, { value: "Module" }));
class Wr extends Io {
  constructor() {
    super(...arguments), this.enable = !1;
  }
}
const zp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDisableTemplateEntityAction: Wr,
  api: Wr
}, Symbol.toStringTag, { value: "Module" }));
class Nr extends oa {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await z(this, async (r) => ({
      blob: await Zu(t, r),
      alias: (await wo(t, r)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const s = URL.createObjectURL(i.blob), o = document.createElement("a");
    o.href = s, o.download = `${i.alias}.json`, o.click(), URL.revokeObjectURL(s);
  }
}
const Lp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: Nr,
  api: Nr
}, Symbol.toStringTag, { value: "Module" })), Fp = 1500;
async function Xn(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((s) => setTimeout(s, Fp));
    try {
      a = await wd(a.id, t);
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
class Br extends oa {
  async execute() {
    var p;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await z(this, (m) => os([t], m)), a = ((p = i == null ? void 0 : i[0]) == null ? void 0 : p.name) ?? "this template";
    await _o(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: s, error: o } = await z(this, (m) => $n(t, !1, m));
    if (o || !s) throw o ?? new Error("Regeneration could not be started.");
    const r = await this.getContext(ee);
    r == null || r.peek("positive", { data: { message: `Regenerating ${s.total} item(s)…` } });
    const l = await this.getContext(Le);
    await Xn(s, () => l == null ? void 0 : l.getLatestToken(), r);
  }
}
const Up = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: Br,
  api: Br
}, Symbol.toStringTag, { value: "Module" })), Wp = new mn(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), Np = new mn(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class jr extends oa {
  async execute() {
    const { json: t } = await hn(this, Np, { data: {} }), i = this.args.unique ?? null, { data: a, error: s } = await z(this, (l) => Qu(t, "create", l, i));
    if (s || !a) throw s ?? new Error("The template could not be imported.");
    const o = await this.getContext(ee);
    o == null || o.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) o == null || o.peek("warning", { data: { message: l.message } });
    const r = await this.getContext(vi);
    r == null || r.dispatchEvent(new sa({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const Bp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: jr,
  api: jr
}, Symbol.toStringTag, { value: "Module" }));
var jp = Object.defineProperty, Kp = Object.getOwnPropertyDescriptor, Jn = (e) => {
  throw TypeError(e);
}, Zn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Kp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && jp(t, i, s), s;
}, Vp = (e, t, i) => t.has(e) || Jn("Cannot " + i), qp = (e, t, i) => t.has(e) ? Jn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Kr = (e, t, i) => (Vp(e, t, "access private method"), i), _a, Qn, el;
let mi = class extends yn {
  constructor() {
    super(...arguments), qp(this, _a), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${Kr(this, _a, Qn)} aria-label="Choose a file" />
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
            @click=${Kr(this, _a, el)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
_a = /* @__PURE__ */ new WeakSet();
Qn = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
el = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
mi.styles = [
  P`
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
Zn([
  y()
], mi.prototype, "_json", 2);
mi = Zn([
  M("di-import-template-modal")
], mi);
const Gp = mi, Hp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return mi;
  },
  default: Gp
}, Symbol.toStringTag, { value: "Module" }));
function tl(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? W : H,
    name: e.name,
    icon: t ? Nn : e.isEnabled ? Un : Wn,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class Vr extends aa {
  async requestCollection(t = {}) {
    const i = await this.getContext(Ru), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: o } = await z(this, (r) => id({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, r));
    return s ? { data: { total: s.total, items: s.items.map(tl) } } : { error: o };
  }
}
const Yp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: Vr,
  api: Vr,
  mapCollectionItem: tl
}, Symbol.toStringTag, { value: "Module" }));
class qr extends Lu {
  async requestItemHref(t) {
    return t.entityType === W ? kn(W, t.unique) : xo(t.unique);
  }
}
const Xp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: qr,
  api: qr
}, Symbol.toStringTag, { value: "Module" }));
var Jp = Object.defineProperty, Zp = Object.getOwnPropertyDescriptor, il = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zp(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Jp(t, i, s), s;
}, Oo = (e, t, i) => t.has(e) || il("Cannot " + i), ja = (e, t, i) => (Oo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), fa = (e, t, i) => t.has(e) ? il("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), wa = (e, t, i, a) => (Oo(e, t, "write to private field"), t.set(e, i), i), ws = (e, t, i) => (Oo(e, t, "access private method"), i), Ka, Si, Wi, Ei, al, sl, ol;
const Qp = 400;
let pe = class extends F {
  constructor() {
    super(), fa(this, Ei), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, fa(this, Ka), fa(this, Si), fa(this, Wi), this.consumeContext(Le, (e) => {
      wa(this, Ka, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), wa(this, Si, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && ws(this, Ei, al).call(this);
    })), ja(this, Si).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ja(this, Si)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, wa(this, Wi, void 0);
  }
  render() {
    return this.item ? n`
      <uui-card-media
        name=${this.item.name}
        detail=${As(this.item.docTypes || void 0)}
        href=${As(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${ws(this, Ei, sl)}
        @deselected=${ws(this, Ei, ol)}>
        ${this._src ? n`<img src=${this._src} alt=${this.item.name} />` : n`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? n`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : h}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : h;
  }
};
Ka = /* @__PURE__ */ new WeakMap();
Si = /* @__PURE__ */ new WeakMap();
Wi = /* @__PURE__ */ new WeakMap();
Ei = /* @__PURE__ */ new WeakSet();
al = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || ja(this, Wi) === t)) {
    wa(this, Wi, t);
    try {
      const i = await ad(e.unique, Qp, () => {
        var a;
        return (a = ja(this, Ka)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
sl = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Fu(this.item.unique)));
};
ol = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Uu(this.item.unique)));
};
pe.styles = [
  P`
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
Xe([
  g({ type: Object })
], pe.prototype, "item", 2);
Xe([
  g({ type: Boolean })
], pe.prototype, "selectable", 2);
Xe([
  g({ type: Boolean })
], pe.prototype, "selected", 2);
Xe([
  g({ type: Boolean, attribute: "select-only" })
], pe.prototype, "selectOnly", 2);
Xe([
  g({ type: Boolean })
], pe.prototype, "disabled", 2);
Xe([
  g({ type: String })
], pe.prototype, "href", 2);
Xe([
  y()
], pe.prototype, "_src", 2);
Xe([
  y()
], pe.prototype, "_failed", 2);
pe = Xe([
  M("di-template-collection-card")
], pe);
const eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return pe;
  },
  get element() {
    return pe;
  }
}, Symbol.toStringTag, { value: "Module" }));
var th = Object.defineProperty, ih = Object.getOwnPropertyDescriptor, rl = (e) => {
  throw TypeError(e);
}, ra = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ih(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && th(t, i, s), s;
}, Ao = (e, t, i) => t.has(e) || rl("Cannot " + i), ut = (e, t, i) => (Ao(e, t, "read from private field"), t.get(e)), xi = (e, t, i) => t.has(e) ? rl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gr = (e, t, i, a) => (Ao(e, t, "write to private field"), t.set(e, i), i), je = (e, t, i) => (Ao(e, t, "access private method"), i), Di, Va, $a, Mi, Te, js, nl, ll, Ci, cl;
let Ve = class extends F {
  constructor() {
    super(), xi(this, Te), xi(this, Di), xi(this, Va), this._templates = [], this._fonts = [], this._loading = !0, xi(this, $a, () => {
      ut(this, Di) && je(this, Te, js).call(this);
    }), xi(this, Mi, () => {
      var e;
      return (e = ut(this, Di)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(ee, (e) => {
      Gr(this, Va, e);
    }), this.consumeContext(Le, (e) => {
      Gr(this, Di, e), e && je(this, Te, js).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Ps, ut(this, $a));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Ps, ut(this, $a));
  }
  render() {
    return this._loading ? n`<div class="state"><uui-loader></uui-loader></div>` : n`
      <umb-body-layout headline="Dynamic Images">
        ${je(this, Te, ll).call(this)} ${je(this, Te, cl).call(this)}
      </umb-body-layout>
    `;
  }
};
Di = /* @__PURE__ */ new WeakMap();
Va = /* @__PURE__ */ new WeakMap();
$a = /* @__PURE__ */ new WeakMap();
Mi = /* @__PURE__ */ new WeakMap();
Te = /* @__PURE__ */ new WeakSet();
js = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      qu(ut(this, Mi)),
      Fa(ut(this, Mi)).catch(() => []),
      xn(ut(this, Mi)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    je(this, Te, nl).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
nl = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = ut(this, Va)) == null || s.peek(e, { data: { headline: t, message: a } });
};
ll = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return n`
      <div class="stats">
        ${je(this, Te, Ci).call(this, "Templates", this._templates.length, "icon-brush", !1, kn(Ke))}
        ${je(this, Te, Ci).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${je(this, Te, Ci).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${je(this, Te, Ci).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
Ci = function(e, t, i, a = !1, s) {
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
cl = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? h : n`
      <uui-box headline="Needs attention">
        <uui-table>
          ${Q(
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
                  ${i.templateName ? n`<strong>${i.templateName}</strong> — ` : h}${i.message}
                </uui-table-cell>
              </uui-table-row>
            `
  )}
        </uui-table>
        <uui-button look="secondary" href=${Dd("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Ve.styles = P`
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
ra([
  y()
], Ve.prototype, "_templates", 2);
ra([
  y()
], Ve.prototype, "_fonts", 2);
ra([
  y()
], Ve.prototype, "_health", 2);
ra([
  y()
], Ve.prototype, "_loading", 2);
Ve = ra([
  M("di-overview-dashboard")
], Ve);
const ah = Ve, sh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return Ve;
  },
  default: ah
}, Symbol.toStringTag, { value: "Module" })), Ks = /* @__PURE__ */ new Map(), cs = (e) => `di-${e}`;
function oh(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Ks.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await vd(e, t), o = new FontFace(cs(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return Ks.set(e, a), a;
}
async function ul(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => oh(a, t)));
}
function dl(e) {
  Ks.delete(e);
}
var rh = Object.defineProperty, nh = Object.getOwnPropertyDescriptor, pl = (e) => {
  throw TypeError(e);
}, us = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && rh(t, i, s), s;
}, Po = (e, t, i) => t.has(e) || pl("Cannot " + i), Me = (e, t, i) => (Po(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ki = (e, t, i) => t.has(e) ? pl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $s = (e, t, i, a) => (Po(e, t, "write to private field"), t.set(e, i), i), L = (e, t, i) => (Po(e, t, "access private method"), i), xa, Ni, Bi, Lt, A, hl, bi, mt, Vs, ml, yl, ka, fl, gl, vl;
function lh(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : ch(e.sourceUrl);
    default:
      return "Media library";
  }
}
function ch(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let yt = class extends F {
  constructor() {
    super(), ki(this, A), ki(this, xa), ki(this, Ni), ki(this, Bi), this._fonts = [], this._loading = !0, ki(this, Lt, () => {
      var e;
      return (e = Me(this, xa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Mu, (e) => {
      $s(this, Ni, e);
    }), this.consumeContext(ee, (e) => {
      $s(this, Bi, e);
    }), this.consumeContext(Le, (e) => {
      $s(this, xa, e), e && L(this, A, bi).call(this);
    });
  }
  render() {
    return this._loading ? n`<div class="state"><uui-loader></uui-loader></div>` : n`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${L(this, A, Vs)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? n`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${L(this, A, Vs)}>
                  Add your first font
                </uui-button>
              </div>` : n`${Q(this._fonts, (e) => e.key, (e) => L(this, A, fl).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
xa = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
Bi = /* @__PURE__ */ new WeakMap();
Lt = /* @__PURE__ */ new WeakMap();
A = /* @__PURE__ */ new WeakSet();
hl = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
bi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Fa(Me(this, Lt)), await ul(this._fonts.map((e) => e.key), Me(this, Lt));
  } catch (e) {
    L(this, A, mt).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
mt = function(e, t, i) {
  var s;
  const a = i instanceof ht ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Me(this, Bi)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Vs = async function() {
  var i, a;
  if (!Me(this, Ni)) return;
  const e = Me(this, Ni).open(this, Wp, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Me(this, Bi)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await L(this, A, bi).call(this));
};
ml = async function(e) {
  try {
    await yd(e.key, Me(this, Lt)), dl(e.key), L(this, A, mt).call(this, "positive", `'${e.familyName}' refreshed`), await L(this, A, bi).call(this);
  } catch (t) {
    L(this, A, mt).call(this, "danger", "That font could not be refreshed", t);
  }
};
yl = async function(e) {
  await _o(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await gd(e.key, Me(this, Lt)), dl(e.key), L(this, A, mt).call(this, "positive", `'${e.familyName}' deleted`), await L(this, A, bi).call(this);
  } catch (t) {
    L(this, A, mt).call(this, "danger", "That font could not be deleted", t);
  }
};
ka = async function(e, t, i, a) {
  try {
    await fd(e.key, t, i, Me(this, Lt), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), L(this, A, mt).call(this, "positive", `'${t}' saved`), await L(this, A, bi).call(this), a != null && a.keepOpen && await L(this, A, hl).call(this);
  } catch (s) {
    L(this, A, mt).call(this, "danger", "The font could not be saved", s);
  }
};
fl = function(e) {
  const t = this._editingKey === e.key;
  return n`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${lh(e)} · weight ${e.weight}
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
                  @click=${() => L(this, A, ml).call(this, e)}>
                  Refresh
                </uui-button>` : h}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => L(this, A, yl).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${cs(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? L(this, A, vl).call(this, e) : L(this, A, gl).call(this, e)}
      </div>
    `;
};
gl = function(e) {
  return e.styles.length === 0 ? h : n`<div class="tags">
      ${Q(
    e.styles,
    (t) => t.name,
    (t) => n`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
vl = function(e) {
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
          ${Q(
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
      t.splice(a, 1), L(this, A, ka).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), L(this, A, ka).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    L(this, A, ka).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
yt.styles = P`
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
us([
  y()
], yt.prototype, "_fonts", 2);
us([
  y()
], yt.prototype, "_loading", 2);
us([
  y()
], yt.prototype, "_editingKey", 2);
yt = us([
  M("di-fonts-dashboard")
], yt);
const uh = yt, dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return yt;
  },
  default: uh
}, Symbol.toStringTag, { value: "Module" }));
var ph = Object.defineProperty, hh = Object.getOwnPropertyDescriptor, bl = (e) => {
  throw TypeError(e);
}, na = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && ph(t, i, s), s;
}, Mo = (e, t, i) => t.has(e) || bl("Cannot " + i), at = (e, t, i) => (Mo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ga = (e, t, i) => t.has(e) ? bl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Hr = (e, t, i, a) => (Mo(e, t, "write to private field"), t.set(e, i), i), Xt = (e, t, i) => (Mo(e, t, "access private method"), i), Ta, Jt, yi, dt, qa, qs, _l;
let qe = class extends F {
  constructor() {
    super(), ga(this, dt), ga(this, Ta), ga(this, Jt), this._loading = !0, this._busy = !1, ga(this, yi, () => {
      var e;
      return (e = at(this, Ta)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(ee, (e) => {
      Hr(this, Jt, e);
    }), this.consumeContext(Le, (e) => {
      Hr(this, Ta, e), e && Xt(this, dt, qa).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Xt(this, dt, qa).call(this)}>Re-check</uui-button>
          </div>

          <ul class="summary">
            <li>
              Image generation is
              <strong class=${this._health.isEnabled ? "ok" : "bad"}>${this._health.isEnabled ? "on" : "off"}</strong>
              ${this._health.isEnabled ? h : n`(set <code>DynamicImages:Enabled</code> to true)`}
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
                ${Q(
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
                        ${a.templateKey ? n`<a href=${xo(a.templateKey)}>${a.templateName}</a>` : n`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Xt(this, dt, _l).call(this)}
      </umb-body-layout>
    `;
  }
};
Ta = /* @__PURE__ */ new WeakMap();
Jt = /* @__PURE__ */ new WeakMap();
yi = /* @__PURE__ */ new WeakMap();
dt = /* @__PURE__ */ new WeakSet();
qa = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      xn(at(this, yi)),
      kd(at(this, yi)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
qs = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await Td(at(this, yi)) : await Sd(at(this, yi));
    (t = at(this, Jt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = at(this, Jt)) == null || i.peek("warning", { data: { message: o } });
    await Xt(this, dt, qa).call(this);
  } catch (s) {
    (a = at(this, Jt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
_l = function() {
  return this._sync ? n`
      <uui-box headline="Environment transfer">
        <p>
          Templates live in the database. To move them between environments, export them to JSON files under
          <code>${this._sync.folder}</code> and commit those, or import files someone else committed.
        </p>
        <p class="meta">
          Mode: <strong>${this._sync.mode}</strong> · ${this._sync.fileCount} file(s)
          ${this._sync.lastWriteUtc ? n`· last written ${new Date(this._sync.lastWriteUtc).toLocaleString()}` : h}
        </p>

        <div class="row">
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Xt(this, dt, qs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Xt(this, dt, qs).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : h;
};
qe.styles = P`
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
na([
  y()
], qe.prototype, "_health", 2);
na([
  y()
], qe.prototype, "_sync", 2);
na([
  y()
], qe.prototype, "_loading", 2);
na([
  y()
], qe.prototype, "_busy", 2);
qe = na([
  M("di-health-dashboard")
], qe);
const mh = qe, yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return qe;
  },
  default: mh
}, Symbol.toStringTag, { value: "Module" })), wl = 3, $l = 12, xl = 0.1, kl = 0.9;
function fh(e) {
  return Math.max(wl, Math.min($l, e));
}
function gh(e) {
  return Math.max(xl, Math.min(kl, e));
}
function vh(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = fh(t), s = 0.5 * gh(i), o = e === "star" ? a * 2 : a, r = e === "star" ? 180 / a : 360 / a, l = [];
  for (let p = 0; p < o; p++) {
    const m = (-90 + p * r) * Math.PI / 180, S = e === "star" && p % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + S * Math.cos(m), y: 0.5 + S * Math.sin(m) });
  }
  return l;
}
function bh(e, t, i) {
  const a = vh(e, t, i);
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
  sides: { min: wl, max: $l },
  innerRatio: { min: xl, max: kl }
}, Ga = { min: 0.1, max: 4 };
function _h(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function Ro(e) {
  const t = e.kind ?? "linear", i = Math.round(Gs(e.centreX ?? 0.5) * 100), a = Math.round(Gs(e.centreY ?? 0.5) * 100);
  switch (t) {
    case "radial":
      return `radial-gradient(${e.shape ?? "ellipse"} ${$h(e.extent)} at ${i}% ${a}%, ${xs(e)})`;
    case "angular":
      return `conic-gradient(from ${e.angle}deg at ${i}% ${a}%, ${xs(e)})`;
    case "reflected":
      return `linear-gradient(${e.angle}deg, ${Hs(xh(ft(e)))})`;
    case "diamond": {
      const s = Hs(ft(e).map((o) => ({ ...o, position: o.position / 2 })));
      return [
        `linear-gradient(to top left, ${s}) left top / ${i}% ${a}% no-repeat`,
        `linear-gradient(to top right, ${s}) right top / ${100 - i}% ${a}% no-repeat`,
        `linear-gradient(to bottom left, ${s}) left bottom / ${i}% ${100 - a}% no-repeat`,
        `linear-gradient(to bottom right, ${s}) right bottom / ${100 - i}% ${100 - a}% no-repeat`
      ].join(", ");
    }
    default:
      return `linear-gradient(${e.angle}deg, ${xs(e)})`;
  }
}
function Gs(e) {
  return Math.min(1, Math.max(0, e));
}
const wh = {
  farthestCorner: "farthest-corner",
  farthestSide: "farthest-side",
  closestCorner: "closest-corner",
  closestSide: "closest-side"
};
function $h(e) {
  return wh[e ?? "farthestCorner"] ?? "farthest-corner";
}
function ft(e) {
  const t = e.stops;
  return !t || t.length < 2 ? [{ colour: e.from, position: 0 }, { colour: e.to, position: 1 }] : t.map((i, a) => ({ stop: { colour: i.colour, position: Gs(i.position) }, index: a })).sort((i, a) => i.stop.position - a.stop.position || i.index - a.index).map(({ stop: i }) => i);
}
function xh(e) {
  return [
    ...[...e].reverse().map((t) => ({ colour: t.colour, position: 0.5 - t.position / 2 })),
    ...e.map((t) => ({ colour: t.colour, position: 0.5 + t.position / 2 }))
  ];
}
function xs(e) {
  const t = e.stops;
  return t && t.length >= 2 ? Hs(ft(e)) : `${e.from}, ${e.to}`;
}
function Hs(e) {
  return e.map((t) => `${t.colour} ${zo(t.position * 100)}%`).join(", ");
}
const zo = (e) => Math.round(e * 100) / 100;
function ji(e, t) {
  const i = ft({ ...e, stops: t });
  return { ...e, stops: t, from: i[0].colour, to: i[i.length - 1].colour };
}
function kh(e) {
  const t = [...ft(e)].reverse().map((i) => ({ colour: i.colour, position: zo(1 - i.position) }));
  return ji(e, t);
}
function Th(e) {
  const t = ft(e);
  let i = 0;
  for (let r = 1; r < t.length; r++)
    t[r].position - t[r - 1].position > t[i + 1].position - t[i].position && (i = r - 1);
  const a = t[i], s = t[i + 1], o = zo((a.position + s.position) / 2);
  return ji(e, [...t, { colour: Eh(a.colour, s.colour, 0.5), position: o }]);
}
function Sh(e, t) {
  const i = ft(e);
  return i.length <= 2 ? e : ji(e, i.filter((a, s) => s !== t));
}
function Eh(e, t, i) {
  const a = Yr(e), s = Yr(t);
  if (!a || !s) return e;
  const o = (p) => Math.round(a[p] + (s[p] - a[p]) * i).toString(16).padStart(2, "0").toUpperCase(), r = `#${o(0)}${o(1)}${o(2)}`, l = o(3);
  return l === "FF" ? r : `${r}${l}`;
}
function Yr(e) {
  const t = (e ?? "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t) || ![3, 4, 6, 8].includes(t.length)) return;
  const i = t.length <= 4 ? [...t].map((s) => s + s).join("") : t, a = (s) => parseInt(i.slice(s * 2, s * 2 + 2), 16);
  return [a(0), a(1), a(2), i.length === 8 ? a(3) : 255];
}
const Lo = P`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Dh(e, t) {
  const i = [], a = t.lockX ? void 0 : Xr(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Ch(t),
    t.threshold
  ), s = t.lockY ? void 0 : Xr(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    Ih(t),
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
function Ch(e) {
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
function Ih(e) {
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
function Xr(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const r = Math.abs(o.at - s.value);
      r > i || (!a || r < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: r });
    }
  return a;
}
var Oh = Object.defineProperty, Ah = Object.getOwnPropertyDescriptor, Tl = (e) => {
  throw TypeError(e);
}, Je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ah(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Oh(t, i, s), s;
}, Fo = (e, t, i) => t.has(e) || Tl("Cannot " + i), xe = (e, t, i) => (Fo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ks = (e, t, i) => t.has(e) ? Tl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ts = (e, t, i, a) => (Fo(e, t, "write to private field"), t.set(e, i), i), q = (e, t, i) => (Fo(e, t, "access private method"), i), _t, Ii, O, ds, Uo, Sl, El, Dl, Cl, Wo, Ha, Il, Ol, Al, Pl, Ml, Rl, zl, Ll, Fl;
const Ph = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], Ss = 18;
let Se = class extends F {
  constructor() {
    super(...arguments), ks(this, O), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, ks(this, _t), ks(this, Ii);
  }
  willUpdate() {
    this._box = q(this, O, Sl).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== xe(this, Ii) && ((t = xe(this, _t)) == null || t.disconnect(), Ts(this, Ii, e), e && (xe(this, _t) ?? Ts(this, _t, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), xe(this, _t).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = xe(this, _t)) == null || e.disconnect(), Ts(this, Ii, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return h;
    const e = this._box;
    return n`
      <div
        class=${dn({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${N({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...xe(this, O, El) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...q(this, O, Wo).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      q(this, O, Il).call(this, t), q(this, O, Ha).call(this, t);
    }}>
        ${q(this, O, Ol).call(this)}
      </div>

      ${this.selected ? q(this, O, Ll).call(this, e) : h}
      ${this.showMeasured && this.measured ? q(this, O, Fl).call(this) : h}
    `;
  }
};
_t = /* @__PURE__ */ new WeakMap();
Ii = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
ds = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Uo = function() {
  return this.layer.rotation ?? 0;
};
Sl = function() {
  var s;
  const e = this.layer, t = e.size.width ?? q(this, O, Dl).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? q(this, O, Cl).call(this), a = ls(xe(this, O, ds), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
El = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
Dl = function() {
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
Cl = function() {
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
Wo = function(e) {
  const t = xe(this, O, Uo);
  if (t === 0) return {};
  const i = xe(this, O, ds);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Ha = function(e, t) {
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
Il = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Ol = function() {
  switch (this.layer.type) {
    case "text":
      return q(this, O, Al).call(this);
    case "image":
      return q(this, O, Ml).call(this);
    case "badges":
      return q(this, O, Rl).call(this);
    default:
      return q(this, O, zl).call(this);
  }
};
Al = function() {
  if (this.layer.type !== "text") return h;
  const e = this.layer.style, t = this.resolvedText || q(this, O, Pl).call(this);
  return n`
      <div
        class="text"
        style=${N({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${cs(e.fontKey)}, sans-serif`,
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
Pl = function() {
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
Ml = function() {
  if (this.layer.type !== "image") return h;
  const e = this.layer.border;
  return n`
      <div
        class="image"
        style=${N({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
Rl = function() {
  if (this.layer.type !== "badges") return h;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: r } = this.layer, l = s === "horizontal", p = l && o, m = t.position ?? "below";
  return n`
      <div
        class="badges"
        style=${N({
    flexDirection: l ? "row" : "column",
    flexWrap: p ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...p ? { rowGap: `${r * this.scale}px` } : {}
  })}>
        ${Q(
    Array.from({ length: Math.max(1, a) }, (S, k) => k),
    (S) => S,
    () => n`
            <div class=${dn({ badge: !0, right: m === "right" })}>
              <div
                class="circle"
                style=${N({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${m === "none" ? h : n`<div
                    class="badge-label"
                    style=${N({
      ...m === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${cs(t.fontKey)}, sans-serif`,
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
zl = function() {
  if (this.layer.type !== "rect") return h;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? Ro(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return n`
        <div
          class="shape"
          style=${N({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${o}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const r = bh(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return n`
      <div class="shape" style=${N({ clipPath: r, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${N({ inset: `${o}px`, clipPath: r, background: a })}></div>
      </div>
    `;
};
Ll = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = xe(this, O, ds), r = xe(this, O, Uo), l = Re(this.layer.position, "x") || Re(this.layer.position, "y");
  return n`
      <div
        class="chrome"
        style=${N({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...q(this, O, Wo).call(this, e) })}>
        <span
          class="tag"
          style=${N(r !== 0 ? { transform: `rotate(${-r}deg)` } : {})}>
          ${l ? n`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : h}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? h : n`
              ${Q(
    Ph,
    (p) => p,
    (p) => n`
                  <span
                    class="handle ${p}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${p}"
                    @pointerdown=${(m) => q(this, O, Ha).call(this, m, p)}>
                  </span>
                `
  )}
              <span class="stalk" style=${N({ height: `${Ss}px`, top: `${-Ss}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${N({ top: `${-Ss}px` })}
                @pointerdown=${(p) => q(this, O, Ha).call(this, p, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}${r !== 0 ? ` - turns ${r}° here` : ""}"
          style=${N({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
Fl = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return n`
      <div
        class="measured"
        style=${N({
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
Se.styles = P`
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
Je([
  g({ type: Object })
], Se.prototype, "layer", 2);
Je([
  g({ type: Number })
], Se.prototype, "scale", 2);
Je([
  g({ type: Boolean, reflect: !0 })
], Se.prototype, "selected", 2);
Je([
  g({ type: Object })
], Se.prototype, "measured", 2);
Je([
  g({ type: Boolean })
], Se.prototype, "showMeasured", 2);
Je([
  g({ type: String })
], Se.prototype, "resolvedText", 2);
Je([
  g({ attribute: !1 })
], Se.prototype, "resolvedPosition", 2);
Je([
  y()
], Se.prototype, "_box", 2);
Se = Je([
  M("di-layer-box")
], Se);
var Mh = Object.defineProperty, Rh = Object.getOwnPropertyDescriptor, Ul = (e) => {
  throw TypeError(e);
}, No = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Mh(t, i, s), s;
}, zh = (e, t, i) => t.has(e) || Ul("Cannot " + i), Lh = (e, t, i) => t.has(e) ? Ul("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Fh = (e, t, i) => (zh(e, t, "access private method"), i), Ys, Wl;
let Ki = class extends F {
  constructor() {
    super(...arguments), Lh(this, Ys), this.guides = [], this.scale = 1;
  }
  render() {
    return n`${Q(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => Fh(this, Ys, Wl).call(this, e)
    )}`;
  }
};
Ys = /* @__PURE__ */ new WeakSet();
Wl = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? n`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : n`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Ki.styles = P`
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
No([
  g({ type: Array })
], Ki.prototype, "guides", 2);
No([
  g({ type: Number })
], Ki.prototype, "scale", 2);
Ki = No([
  M("di-guides")
], Ki);
var Uh = Object.defineProperty, Wh = Object.getOwnPropertyDescriptor, Nl = (e) => {
  throw TypeError(e);
}, la = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Wh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Uh(t, i, s), s;
}, Nh = (e, t, i) => t.has(e) || Nl("Cannot " + i), Bh = (e, t, i) => t.has(e) ? Nl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Jr = (e, t, i) => (Nh(e, t, "access private method"), i), Sa, Xs;
let Y = class extends F {
  constructor() {
    super(...arguments), Bh(this, Sa), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Jr(this, Sa, Xs).call(this, "top"), Jr(this, Sa, Xs).call(this, "left");
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
Sa = /* @__PURE__ */ new WeakSet();
Xs = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : Y.thickness) * o, t.height = (e === "top" ? Y.thickness : s) * o, t.style.width = `${e === "top" ? s : Y.thickness}px`, t.style.height = `${e === "top" ? Y.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const r = getComputedStyle(this);
  i.strokeStyle = r.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = r.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const p = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, S = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(p, Y.thickness - S), i.lineTo(p, Y.thickness)) : (i.moveTo(Y.thickness - S, p), i.lineTo(Y.thickness, p)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), p + 2, 9) : (i.save(), i.translate(9, p - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
Y.thickness = 20;
Y.styles = P`
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
la([
  g({ type: Number })
], Y.prototype, "canvasWidth", 2);
la([
  g({ type: Number })
], Y.prototype, "canvasHeight", 2);
la([
  g({ type: Number })
], Y.prototype, "scale", 2);
la([
  g({ type: Object })
], Y.prototype, "pointer", 2);
Y = la([
  M("di-rulers")
], Y);
var jh = Object.defineProperty, Kh = Object.getOwnPropertyDescriptor, Bl = (e) => {
  throw TypeError(e);
}, ne = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Kh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && jh(t, i, s), s;
}, Bo = (e, t, i) => t.has(e) || Bl("Cannot " + i), R = (e, t, i) => (Bo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), le = (e, t, i) => t.has(e) ? Bl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ea = (e, t, i, a) => (Bo(e, t, "write to private field"), t.set(e, i), i), I = (e, t, i) => (Bo(e, t, "access private method"), i), wt, Oi, pt, C, jo, Js, Zs, ps, Ko, Qs, jl, Kl, Vo, Vl, ql, eo, Da, Gl, Hl, Vt, qo, to, io, ao, Yl, so, oo, ro, Xl;
const Vh = 6, Jl = 20, qh = 2, Gh = 15, Hh = 0.1;
let Z = class extends F {
  constructor() {
    super(...arguments), le(this, C), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, le(this, wt), le(this, Oi), le(this, pt, /* @__PURE__ */ new Map()), le(this, eo, (e) => {
      const t = this.template.layers.find((r) => r.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = I(this, C, Ko).call(this, t), a = I(this, C, Qs).call(this, t), s = I(this, C, jl).call(this, t), o = I(this, C, ps).call(this, e.detail.startX, e.detail.startY);
      Ea(this, wt, {
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
    }), le(this, Da, (e) => {
      var wi, se;
      this._pointer = I(this, C, Zs).call(this, e.clientX, e.clientY);
      const t = R(this, wt);
      if (!t) return;
      const i = this.template.layers.find((_e) => _e.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        I(this, C, Hl).call(this, i, t, e);
        return;
      }
      const o = Re(i.position, "x"), r = Re(i.position, "y"), l = t.startRotation, p = e.shiftKey || i.type === "rect" && i.lockAspect === !0;
      if (t.handle && l !== 0) {
        I(this, C, Gl).call(this, i, t, t.handle, a, s, p, o, r);
        return;
      }
      let m = t.handle ? I(this, C, qo).call(this, t.startBox, t.handle, a, s, p) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (m = { ...m, x: t.startBox.x, width: (wi = t.handle) != null && wi.includes("w") ? t.startBox.width : m.width }), r && (m = { ...m, y: t.startBox.y, height: (se = t.handle) != null && se.includes("n") ? t.startBox.height : m.height });
      const S = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, k = l !== 0 ? { x: m.x + S.x, y: m.y + S.y, width: t.startExtent.width, height: t.startExtent.height } : m, ae = this.snapEnabled && !e.altKey ? Dh(k, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((_e) => _e.key !== i.key).map((_e) => I(this, C, Qs).call(this, _e)),
        threshold: Vh / this.scale,
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
      this._guides = ae.guides;
      const ye = l !== 0 ? { ...m, x: ae.box.x - S.x, y: ae.box.y - S.y } : ae.box, fe = zd(ye, i.position);
      o && (fe.x = i.position.x), r && (fe.y = i.position.y);
      const Nt = { position: fe };
      t.handle && (Nt.size = {
        width: Math.max(1, Math.round(ye.width)),
        height: Math.max(1, Math.round(ye.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Nt } })
      );
    }), le(this, Vt, () => {
      if (!R(this, wt)) return;
      const e = R(this, wt).moved;
      Ea(this, wt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), le(this, to, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), le(this, io, () => {
      this._dropTarget = !1;
    }), le(this, ao, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = I(this, C, Zs).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: I(this, C, Yl).call(this, e) }
        })
      );
    }), le(this, so, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), le(this, oo, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Pn(t.position)) && this.requestUpdate();
    }), le(this, ro, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), Ea(this, Oi, new ResizeObserver(() => I(this, C, Js).call(this))), R(this, Oi).observe(this), window.addEventListener("pointermove", R(this, Da)), window.addEventListener("pointerup", R(this, Vt)), window.addEventListener("pointercancel", R(this, Vt));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = R(this, Oi)) == null || e.disconnect(), window.removeEventListener("pointermove", R(this, Da)), window.removeEventListener("pointerup", R(this, Vt)), window.removeEventListener("pointercancel", R(this, Vt));
  }
  updated(e) {
    I(this, C, Js).call(this), e.has("zoom") && I(this, C, jo).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = R(this, pt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return h;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    I(this, C, Kl).call(this);
    const s = this.showRulers ? Jl : 0;
    return n`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${R(this, so)}
        @dragover=${R(this, to)}
        @dragleave=${R(this, io)}
        @drop=${R(this, ao)}
        @di-layer-drag-start=${R(this, eo)}
        @di-layer-box-resize=${R(this, oo)}>
        <div
          class="artboard"
          style=${N({
      width: `${t + s}px`,
      height: `${i + s}px`,
      "--di-gutter": `${s}px`
    })}>
          ${this.showRulers ? n`<di-rulers
                .canvasWidth=${e.width}
                .canvasHeight=${e.height}
                .scale=${this.scale}
                .pointer=${this._pointer}>
              </di-rulers>` : h}

          <div
            class="stage"
            style=${N({
      background: e.backgroundGradient ? Ro(e.backgroundGradient) : e.background
    })}
            @pointerdown=${R(this, ro)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? n`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${N({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : h}

            ${Q(
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
                  .resolvedPosition=${(l = R(this, pt).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? I(this, C, Xl).call(this) : h}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
wt = /* @__PURE__ */ new WeakMap();
Oi = /* @__PURE__ */ new WeakMap();
pt = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakSet();
jo = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Js = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Jl : 0) + qh, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, I(this, C, jo).call(this));
};
Zs = function(e, t) {
  const i = I(this, C, ps).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
ps = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
Ko = function(e) {
  const t = R(this, pt).get(e.key);
  if (t) return t.box;
  const i = I(this, C, Vo).call(this, e), a = ls(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Qs = function(e) {
  const t = R(this, pt).get(e.key);
  return t ? t.extent : An(I(this, C, Ko).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
jl = function(e) {
  var t;
  return ((t = R(this, pt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Kl = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  Ea(this, pt, Bd(
    this.template.layers,
    (i) => I(this, C, Vo).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Vo = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? I(this, C, Vl).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? I(this, C, ql).call(this, e, i)
  };
};
Vl = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
ql = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
eo = /* @__PURE__ */ new WeakMap();
Da = /* @__PURE__ */ new WeakMap();
Gl = function(e, t, i, a, s, o, r, l) {
  const p = t.startRotation, m = t.startPosition, S = Ld(a, s, 0, 0, p);
  let k = I(this, C, qo).call(this, t.startBox, i, S.x, S.y, o);
  r && (k = { ...k, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : k.width }), l && (k = { ...k, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : k.height });
  const V = Math.max(1, Math.round(k.width)), ae = Math.max(1, Math.round(k.height)), ye = ko(k.x, k.y, V, ae, m.anchor), fe = qt(ye.x, ye.y, m.x, m.y, p), Nt = {
    ...e.position,
    x: r ? e.position.x : Math.round(fe.x),
    y: l ? e.position.y : Math.round(fe.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Nt, size: { width: V, height: ae } } }
    })
  );
};
Hl = function(e, t, i) {
  const a = t.startPosition, s = I(this, C, ps).call(this, i.clientX, i.clientY), r = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + r, p = i.shiftKey ? Gh : Hh, m = On(Math.round(l / p) * p);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
Vt = /* @__PURE__ */ new WeakMap();
qo = function(e, t, i, a, s) {
  let { x: o, y: r, width: l, height: p } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (r = e.y + a, p = e.height - a), t.includes("s") && (p = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(p - e.height) ? p = l / m : l = p * m, t.includes("n") && (r = e.y + e.height - p), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: r, width: Math.max(4, l), height: Math.max(4, p) };
};
to = /* @__PURE__ */ new WeakMap();
io = /* @__PURE__ */ new WeakMap();
ao = /* @__PURE__ */ new WeakMap();
Yl = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
so = /* @__PURE__ */ new WeakMap();
oo = /* @__PURE__ */ new WeakMap();
ro = /* @__PURE__ */ new WeakMap();
Xl = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return n`<div class="safe-area" style=${N({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
Z.styles = P`
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
      ${Lo}
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
  g({ type: Object })
], Z.prototype, "template", 2);
ne([
  g({ type: String })
], Z.prototype, "selectedLayerKey", 2);
ne([
  g({ type: Object })
], Z.prototype, "baseImageUrl", 2);
ne([
  g({ type: Array })
], Z.prototype, "serverBounds", 2);
ne([
  g({ type: Boolean })
], Z.prototype, "showMeasured", 2);
ne([
  g({ type: Boolean })
], Z.prototype, "snapEnabled", 2);
ne([
  g({ type: Boolean })
], Z.prototype, "showRulers", 2);
ne([
  g({ type: Boolean })
], Z.prototype, "showSafeArea", 2);
ne([
  g({ type: Number })
], Z.prototype, "zoom", 2);
ne([
  y()
], Z.prototype, "_fitScale", 2);
ne([
  y()
], Z.prototype, "_guides", 2);
ne([
  y()
], Z.prototype, "_pointer", 2);
ne([
  y()
], Z.prototype, "_dropTarget", 2);
Z = ne([
  M("di-designer-canvas")
], Z);
var Yh = Object.defineProperty, Xh = Object.getOwnPropertyDescriptor, Zl = (e) => {
  throw TypeError(e);
}, Go = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Xh(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Yh(t, i, s), s;
}, Ql = (e, t, i) => t.has(e) || Zl("Cannot " + i), Jh = (e, t, i) => (Ql(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Zh = (e, t, i) => t.has(e) ? Zl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), be = (e, t, i) => (Ql(e, t, "access private method"), i), ie, ec, Ho, Yo, tc, ic, ac, sc, Ri;
const Zr = {
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
let Vi = class extends F {
  constructor() {
    super(...arguments), Zh(this, ie), this.properties = [], this._search = "";
  }
  render() {
    const e = Qh(Jh(this, ie, ec));
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

        ${be(this, ie, ic).call(this)}

        ${this.properties.length === 0 ? n`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : Q(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => be(this, ie, tc).call(this, t, i)
    )}
      </div>
    `;
  }
};
ie = /* @__PURE__ */ new WeakSet();
ec = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Ho = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Yo = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
tc = function(e, t) {
  return n`
      <div class="group">
        <h5>${e}</h5>
        ${Q(
    t,
    (i) => i.alias,
    (i) => be(this, ie, Ri).call(
      this,
      i.name,
      Zr[i.classification] ?? Zr.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
ic = function() {
  return n`
      <div class="group">
        <h5>Elements</h5>
        ${be(this, ie, Ri).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${be(this, ie, Ri).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${be(this, ie, Ri).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${be(this, ie, ac).call(this)}
      </div>
    `;
};
ac = function() {
  const e = { kind: "static", layerType: "rect", preset: "rectangle" };
  return n`
      <div
        class="chip other shape"
        draggable="true"
        title="Shape"
        @dragstart=${(t) => be(this, ie, Yo).call(this, t, e)}>
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
          ${Cd.map((t) => n`
            <uui-menu-item
              label=${Li[t].label}
              data-preset=${t}
              @click-label=${() => be(this, ie, sc).call(this, t)}>
              <uui-icon slot="icon" name=${Li[t].icon}></uui-icon>
            </uui-menu-item>
          `)}
        </div>
      </uui-popover-container>
    `;
};
sc = function(e) {
  var t, i, a;
  (a = (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#shape-menu")) == null ? void 0 : i.hidePopover) == null || a.call(i), be(this, ie, Ho).call(this, { kind: "static", layerType: "rect", preset: e });
};
Ri = function(e, t, i, a, s) {
  const o = s ?? e;
  return n`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(r) => be(this, ie, Yo).call(this, r, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => be(this, ie, Ho).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Vi.styles = P`
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
Go([
  g({ type: Array })
], Vi.prototype, "properties", 2);
Go([
  y()
], Vi.prototype, "_search", 2);
Vi = Go([
  M("di-property-palette")
], Vi);
function Qh(e) {
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
function em(e) {
  return e.backgroundGradient ? "gradient" : tm(e.background) ? "transparent" : "colour";
}
function tm(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function im(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var am = Object.defineProperty, sm = Object.getOwnPropertyDescriptor, oc = (e) => {
  throw TypeError(e);
}, Xo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? sm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && am(t, i, s), s;
}, om = (e, t, i) => t.has(e) || oc("Cannot " + i), rm = (e, t, i) => t.has(e) ? oc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Qr = (e, t, i) => (om(e, t, "access private method"), i), Ca, no;
let qi = class extends F {
  constructor() {
    super(...arguments), rm(this, Ca), this.value = "#FFFFFF", this.label = "Colour";
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
          @change=${Qr(this, Ca, no)}></uui-color-picker>
        <uui-input
          label="${this.label} (hex)"
          spellcheck="false"
          .value=${this.value}
          @change=${Qr(this, Ca, no)}></uui-input>
      </div>
    `;
  }
};
Ca = /* @__PURE__ */ new WeakSet();
no = function(e) {
  e.stopPropagation();
  const t = en(e.target.value);
  !t || t === en(this.value) || (this.value = t, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: t } })));
};
qi.styles = P`
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
Xo([
  g({ type: String })
], qi.prototype, "value", 2);
Xo([
  g({ type: String })
], qi.prototype, "label", 2);
qi = Xo([
  M("di-colour-input")
], qi);
function en(e) {
  const t = (e ?? "").trim(), i = t.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(i) || ![3, 4, 6, 8].includes(i.length)) return t;
  const s = (i.length <= 4 ? [...i].map((o) => o + o).join("") : i).toUpperCase();
  return s.length === 8 && s.endsWith("FF") ? `#${s.slice(0, 6)}` : `#${s}`;
}
var nm = Object.defineProperty, lm = Object.getOwnPropertyDescriptor, rc = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? lm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && nm(t, i, s), s;
};
const tn = {
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
let Ya = class extends F {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return n`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${Q(
      In,
      (e) => e,
      (e) => n`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${tn[e]}
              title=${tn[e]}
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
Ya.styles = P`
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
rc([
  g({ type: String })
], Ya.prototype, "value", 2);
Ya = rc([
  M("di-anchor-picker")
], Ya);
var cm = Object.defineProperty, um = Object.getOwnPropertyDescriptor, nc = (e) => {
  throw TypeError(e);
}, Ze = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? um(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && cm(t, i, s), s;
}, dm = (e, t, i) => t.has(e) || nc("Cannot " + i), pm = (e, t, i) => t.has(e) ? nc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hm = (e, t, i) => (dm(e, t, "access private method"), i), lo, lc;
let Ee = class extends F {
  constructor() {
    super(...arguments), pm(this, lo), this.label = "", this.suffix = "px", this.step = 1, this.compact = !1, this.placeholder = "Auto";
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
          min=${this.min ?? h}
          max=${this.max ?? h}
          @change=${hm(this, lo, lc)} />
        ${this.suffix ? n`<span class="suffix">${this.suffix}</span>` : h}
      </span>
    `;
    return this.label ? this.compact ? n`<label class="compact-field"><span class="compact-label">${this.label}</span>${e}</label>` : n`<umb-property-layout orientation="vertical" label=${this.label}>${e}</umb-property-layout>` : e;
  }
};
lo = /* @__PURE__ */ new WeakSet();
lc = function(e) {
  const t = e.target, i = t.value, a = _h(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Ee.styles = P`
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
Ze([
  g({ type: Number })
], Ee.prototype, "value", 2);
Ze([
  g({ type: String })
], Ee.prototype, "label", 2);
Ze([
  g({ type: String })
], Ee.prototype, "suffix", 2);
Ze([
  g({ type: Number })
], Ee.prototype, "step", 2);
Ze([
  g({ type: Number })
], Ee.prototype, "min", 2);
Ze([
  g({ type: Number })
], Ee.prototype, "max", 2);
Ze([
  g({ type: Boolean, reflect: !0 })
], Ee.prototype, "compact", 2);
Ze([
  g({ type: String })
], Ee.prototype, "placeholder", 2);
Ee = Ze([
  M("di-number-field")
], Ee);
var mm = Object.defineProperty, ym = Object.getOwnPropertyDescriptor, cc = (e) => {
  throw TypeError(e);
}, Wt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ym(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && mm(t, i, s), s;
}, fm = (e, t, i) => t.has(e) || cc("Cannot " + i), gm = (e, t, i) => t.has(e) ? cc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), u = (e, t, i) => (fm(e, t, "access private method"), i), c, v, ge, uc, dc, pc, Jo, hc, mc, yc, co, fc, gc, vc, bc, _c, wc, uo, $c, xc, po, kc, Ia, Tc, Sc, Zo, ze, _i, Ec, Qo, Dc;
const vm = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let Ge = class extends F {
  constructor() {
    super(...arguments), gm(this, c), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? n`<div class="inspector">${this.layer ? u(this, c, fc).call(this, this.layer) : u(this, c, uc).call(this)}</div>` : h;
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
uc = function() {
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

        ${u(this, c, dc).call(this, e)}

        <umb-property-layout orientation="vertical" label="Base image">

          <div slot="editor" class="editor">
          <uui-select
            label="Base image source"
            .value=${e.baseImage.kind}
            .options=${Cc(e.baseImage.kind)}
            @change=${(t) => u(this, c, ge).call(this, {
    baseImage: { ...e.baseImage, kind: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.baseImage.kind === "media" ? u(this, c, ze).call(this, "Media item", u(this, c, Zo).call(this, e.baseImage.mediaKey, (t) => u(this, c, ge).call(this, { baseImage: { ...e.baseImage, kind: "media", mediaKey: t } }))) : h}

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

            </umb-property-layout>` : h}

        ${e.baseImage.kind === "property" ? n`<umb-property-layout orientation="vertical" label="From property">

              <div slot="editor" class="editor">
              ${u(this, c, _i).call(this, e.baseImage.propertyAlias ?? "", (t) => u(this, c, ge).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.baseImageFit}
            .options=${j(["cover", "contain", "stretch"], e.baseImageFit)}
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
dc = function(e) {
  const t = em(e);
  return n`
      <umb-property-layout orientation="vertical" label="Fill">

        <div slot="editor" class="editor">
        <uui-select
          .value=${t}
          .options=${j(["colour", "gradient", "transparent"], t)}
          @change=${(i) => u(this, c, pc).call(this, e, i.target.value)}>
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

          </umb-property-layout>` : h}

      ${t === "gradient" && e.backgroundGradient ? u(this, c, Jo).call(this, e.backgroundGradient, (i) => u(this, c, ge).call(this, { backgroundGradient: i })) : h}

      ${t === "transparent" ? n`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : h}
    `;
};
pc = function(e, t) {
  if (t === "gradient") {
    u(this, c, ge).call(this, { backgroundGradient: e.backgroundGradient ?? Cn() });
    return;
  }
  u(this, c, ge).call(this, {
    background: im(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
Jo = function(e, t) {
  const i = e.kind ?? "linear", a = i === "linear" || i === "reflected" || i === "angular", s = i === "radial" || i === "angular" || i === "diamond";
  return n`
      ${u(this, c, ze).call(this, "Gradient type", n`
        <uui-select
          label="Gradient type"
          .value=${i}
          .options=${j(["linear", "radial", "angular", "diamond", "reflected"], i, bm)}
          @change=${(o) => t({ ...e, kind: o.target.value })}>
        </uui-select>
      `)}

      <div class="gradient-preview" role="img" aria-label="The gradient" style="background: ${Ro(e)}"></div>

      ${a ? u(this, c, hc).call(this, e, t) : h}
      ${i === "radial" ? u(this, c, mc).call(this, e, t) : h}
      ${s ? n`
            ${u(this, c, co).call(this, "Centre X", e.centreX, (o) => t({ ...e, centreX: o }))}
            ${u(this, c, co).call(this, "Centre Y", e.centreY, (o) => t({ ...e, centreY: o }))}
          ` : h}

      ${u(this, c, yc).call(this, e, t)}
    `;
};
hc = function(e, t) {
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
          ${wm.map(([s, o, r]) => n`
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
mc = function(e, t) {
  const i = e.shape ?? "ellipse", a = e.extent ?? "farthestCorner";
  return n`
      ${u(this, c, ze).call(this, "Shape", n`
        <uui-select
          label="Radial shape"
          .value=${i}
          .options=${j(["ellipse", "circle"], i)}
          @change=${(s) => t({ ...e, shape: s.target.value })}>
        </uui-select>
      `)}
      ${u(this, c, ze).call(this, "Size", n`
        <uui-select
          label="Radial size"
          .value=${a}
          .options=${j(["farthestCorner", "farthestSide", "closestCorner", "closestSide"], a, _m)}
          @change=${(s) => t({ ...e, extent: s.target.value })}>
        </uui-select>
      `, "Where the last colour lands.")}
    `;
};
yc = function(e, t) {
  const i = ft(e);
  return u(this, c, ze).call(this, "Colour stops", n`
      <div class="stops">
        ${i.map((a, s) => n`
          <div class="stop">
            <di-colour-input
              label="Stop ${s + 1} colour"
              .value=${a.colour}
              @change=${(o) => t(ji(e, i.map((r, l) => l === s ? { ...r, colour: o.detail.value } : r)))}>
            </di-colour-input>
            <div class="stop-position">
              <di-number-field
                label="Position"
                suffix="%"
                .min=${0}
                .max=${100}
                .value=${Math.round(a.position * 100)}
                @change=${(o) => t(ji(e, i.map((r, l) => l === s ? { ...r, position: (o.detail.value ?? 0) / 100 } : r)))}>
              </di-number-field>
              <uui-button
                compact
                look="secondary"
                color="danger"
                label="Remove stop ${s + 1}"
                ?disabled=${i.length <= 2}
                @click=${() => t(Sh(e, s))}>
                <uui-icon name="icon-trash"></uui-icon>
              </uui-button>
            </div>
          </div>
        `)}
        <div class="stop-actions">
          <uui-button look="secondary" label="Add stop" @click=${() => t(Th(e))}>
            <uui-icon name="icon-add"></uui-icon> Add stop
          </uui-button>
          <uui-button look="secondary" label="Reverse the gradient" @click=${() => t(kh(e))}>
            <uui-icon name="icon-sync"></uui-icon> Reverse
          </uui-button>
        </div>
      </div>
    `);
};
co = function(e, t, i) {
  return n`<di-number-field
      .min=${f.gradientCentre.min * 100}
      .max=${f.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
fc = function(e) {
  return n`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => u(this, c, v).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? u(this, c, gc).call(this, e) : h}
      ${e.type === "text" ? u(this, c, vc).call(this, e) : h}
      ${e.type === "image" ? u(this, c, bc).call(this, e) : h}
      ${e.type === "badges" ? u(this, c, _c).call(this, e) : h}
      ${e.type === "rect" ? u(this, c, $c).call(this, e) : h}
      ${u(this, c, xc).call(this, e)} ${u(this, c, Sc).call(this, e)}
    `;
};
gc = function(e) {
  const t = e.binding;
  return n`
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
            @change=${(i) => u(this, c, v).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? u(this, c, ze).call(this, "Property", u(this, c, _i).call(this, t.propertyAlias ?? "", (i) => u(this, c, v).call(this, { binding: { ...t, propertyAlias: i } }))) : h}

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

            </umb-property-layout>` : h}

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
                  </small>` : h}
            </div>

            </umb-property-layout>` : h}

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
vc = function(e) {
  const t = e.style, i = (a) => u(this, c, v).call(this, { style: { ...t, ...a } });
  return n`
      <uui-box headline="Typography">
        <umb-property-layout orientation="vertical" label="Font">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.fontKey}
            .options=${u(this, c, Qo).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${u(this, c, Dc).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
bc = function(e) {
  var i;
  const t = e.source;
  return n`
      <uui-box headline="Image">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${Cc(t.kind)}
            @change=${(a) => u(this, c, v).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" ? u(this, c, ze).call(this, "Property", u(this, c, _i).call(
    this,
    t.propertyAlias ?? "",
    (a) => u(this, c, v).call(this, { source: { ...t, propertyAlias: a } }),
    // The root widens from media to media + content, and the media filter moves to the
    // tail: that is exactly the author.mainImage case, and it never offers a text
    // property as an image source.
    { root: ["media", "content"], tail: "media" }
  )) : h}

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

            </umb-property-layout>` : h}

        ${t.kind === "media" ? u(this, c, ze).call(this, "Media item", u(this, c, Zo).call(this, t.mediaKey, (a) => u(this, c, v).call(this, { source: { ...t, kind: "media", mediaKey: a } }))) : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.fit}
            .options=${j(["cover", "contain", "stretch"], e.fit)}
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
                </di-colour-input>` : h}
          </div>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
_c = function(e) {
  const t = (s) => u(this, c, v).call(this, { badge: { ...e.badge, ...s } }), i = (s) => u(this, c, v).call(this, { label: { ...e.label, ...s } }), a = (s) => u(this, c, v).call(this, { icon: { ...e.icon, ...s } });
  return n`
      <uui-box headline="Badges">
        <umb-property-layout orientation="vertical" label="Items from">

          <div slot="editor" class="editor">
          ${u(this, c, _i).call(this, e.itemsPropertyAlias, (s) => u(this, c, v).call(this, { itemsPropertyAlias: s }))}
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
            .options=${j(["horizontal", "vertical"], e.direction)}
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
                  ` : h}
            ` : h}

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
            .options=${j(["below", "right", "none"], e.label.position, {
    below: "Below the icon",
    right: "Beside the icon",
    none: "Icon only"
  })}
            @change=${(s) => i({ position: s.target.value })}>
          </uui-select>
          ${e.label.position === "right" ? n`<small class="hint">Each badge is as wide as its own label.</small>` : h}
        </div>

        </umb-property-layout>

        ${e.label.position === "none" ? h : n`
              <umb-property-layout orientation="vertical" label="Label font">

                <div slot="editor" class="editor">
                <uui-select
                  .value=${e.label.fontKey}
                  .options=${u(this, c, Qo).call(this, e.label.fontKey)}
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
                  .options=${j(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>
            `}
      </uui-box>
    `;
};
wc = function(e, t) {
  if (t === "circle") {
    const a = e.size.width ?? e.size.height ?? 200;
    u(this, c, v).call(this, { shape: "ellipse", lockAspect: !0, size: { ...e.size, width: a, height: a } });
    return;
  }
  const i = ho(e) === "circle";
  u(this, c, v).call(this, {
    shape: t,
    ...i ? { lockAspect: !1 } : {}
  });
};
uo = function(e, t, i) {
  const a = e.type === "rect" && e.lockAspect === !0, { width: s, height: o } = e.size;
  if (!a || i === null || !s || !o) {
    u(this, c, v).call(this, { size: { ...e.size, [t]: i } });
    return;
  }
  const r = t === "width" ? { width: i, height: Math.round(i * o / s) } : { width: Math.round(i * s / o), height: i };
  u(this, c, v).call(this, { size: r });
};
$c = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return n`
      <uui-box headline="Shape">
        <umb-property-layout orientation="vertical" label="Shape">

          <div slot="editor" class="editor">
          <uui-select
            .value=${ho(e)}
            .options=${j(["rectangle", "circle", "ellipse", "polygon", "star"], ho(e))}
            @change=${(s) => u(this, c, wc).call(this, e, s.target.value)}>
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
                    </di-number-field>` : h}
              </div>
            ` : h}

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

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Gradient">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => u(this, c, v).call(this, {
    gradient: s.target.checked ? Cn() : null
  })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${e.gradient ? u(this, c, Jo).call(this, e.gradient, (s) => u(this, c, v).call(this, { gradient: s })) : h}

        ${t === "rectangle" ? n`<di-number-field
            .min=${f.cornerRadius.min}
            .max=${f.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => u(this, c, v).call(this, { cornerRadius: s.detail.value ?? 0 })}>
            </di-number-field>` : h}

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
                </di-colour-input>` : h}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
xc = function(e) {
  const t = Re(e.position, "x"), i = Re(e.position, "y"), a = e.rotation ?? 0;
  return n`
      <uui-box headline="Layout">
        ${u(this, c, po).call(this, e, "x")} ${u(this, c, po).call(this, e, "y")}

        <umb-property-layout orientation="vertical" label="Anchor">

          <div slot="editor" class="editor">
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => u(this, c, Tc).call(this, e, s.detail.value)}>
          </di-anchor-picker>
          <small class="hint">
            Where X and Y sit on the layer's box.
            ${t || i ? n`The ${t && i ? "horizontal and vertical" : t ? "horizontal" : "vertical"}
                  ${t && i ? "components are" : "component is"} set by the edge
                  ${t && i ? "each axis tracks" : "that axis tracks"}.` : h}
            ${a !== 0 ? n`The layer turns around this point.` : h}
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
            @change=${(s) => u(this, c, v).call(this, { rotation: On(s.detail.value ?? 0) })}>
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
            @change=${(s) => u(this, c, uo).call(this, e, "width", s.detail.value)}>
          </di-number-field>
          <di-number-field
            .min=${f.height.min}
            .max=${f.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => u(this, c, uo).call(this, e, "height", s.detail.value)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
po = function(e, t) {
  const i = Re(e.position, t), a = Ua(e.position, t), s = this.template.layers.filter((r) => r.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(r) => u(this, c, kc).call(this, e, t, r.target.value)}>
          </uui-select>
          ${!i && s.length === 0 ? n`<small class="hint">Add another layer to position this one against it.</small>` : h}
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
                    @change=${(r) => u(this, c, Ia).call(this, e, t, { layerKey: r.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${j(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(r) => u(this, c, Ia).call(this, e, t, { edge: r.target.value })}>
                  </uui-select>
                </div>
              </div>

              </umb-property-layout>

              <di-number-field
                .min=${f.referenceGap.min}
                .max=${f.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(r) => u(this, c, Ia).call(this, e, t, { gap: r.detail.value ?? 0 })}>
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
kc = function(e, t, i) {
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
        gap: Fd
      }
    }
  });
};
Ia = function(e, t, i) {
  const a = Ua(e.position, t);
  a && u(this, c, v).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Tc = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? Rd(e.position, i, a, t) : { ...e.position, anchor: t };
  u(this, c, v).call(this, { position: s });
};
Sc = function(e) {
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
            .options=${j(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
              ${u(this, c, _i).call(this, e.visibility.propertyAlias ?? "", (t) => u(this, c, v).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </div>

            </umb-property-layout>` : h}
      </uui-box>
    `;
};
Zo = function(e, t) {
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
      <umb-property-layout orientation="vertical" label=${e} description=${As(i)}>
        <div slot="editor" class="editor">${t}</div>
      </umb-property-layout>
    `;
};
_i = function(e, t, i = {}) {
  const a = Kd(e), s = [];
  for (let o = 0; o <= zs; o++) {
    const r = wr(a, o), l = o === 0 ? this.properties : this.linkedProperties[r] ?? [], p = a[o] ?? "";
    if (o > 0) {
      const k = (o === 1 ? this.properties : this.linkedProperties[wr(a, o - 1)] ?? []).some(
        (V) => V.alias === a[o - 1] && V.classification === "content"
      );
      if (!a[o - 1] || !k && !p) break;
    }
    const m = u(this, c, Ec).call(this, vm(l, o === 0 ? i.root : i.tail), p, (S) => t([...a.slice(0, o), S].filter(Boolean).join(".")));
    s.push(o === 0 ? m : n`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[r] ?? "Property on the linked item"}</span>
            ${m}
          </div>`);
  }
  return s.length === 1 ? s[0] : n`<div class="path">${s}</div>`;
};
Ec = function(e, t, i) {
  return n`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${Yd(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
Qo = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
Dc = function(e, t, i) {
  const a = this.fonts.find((s) => s.key === e);
  return !a || a.styles.length === 0 ? h : n`
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
Ge.styles = P`
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
Wt([
  g({ type: Object })
], Ge.prototype, "template", 2);
Wt([
  g({ type: Object })
], Ge.prototype, "layer", 2);
Wt([
  g({ type: Array })
], Ge.prototype, "properties", 2);
Wt([
  g({ type: Object })
], Ge.prototype, "linkedProperties", 2);
Wt([
  g({ type: Object })
], Ge.prototype, "linkedCaptions", 2);
Wt([
  g({ type: Array })
], Ge.prototype, "fonts", 2);
Ge = Wt([
  M("di-layer-inspector")
], Ge);
function j(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
const bm = {
  linear: "Linear",
  radial: "Radial",
  angular: "Angular (conic)",
  diamond: "Diamond",
  reflected: "Reflected"
}, _m = {
  farthestCorner: "Farthest corner",
  farthestSide: "Farthest side",
  closestCorner: "Closest corner",
  closestSide: "Closest side"
}, wm = [
  ["↑", 0, "Upwards (0°)"],
  ["→", 90, "To the right (90°)"],
  ["↓", 180, "Downwards (180°)"],
  ["←", 270, "To the left (270°)"]
];
function Cc(e) {
  return j(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
function ho(e) {
  const t = e.shape ?? "rectangle";
  return t === "ellipse" && e.lockAspect === !0 ? "circle" : t;
}
var $m = Object.defineProperty, xm = Object.getOwnPropertyDescriptor, Ic = (e) => {
  throw TypeError(e);
}, ca = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? xm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && $m(t, i, s), s;
}, km = (e, t, i) => t.has(e) || Ic("Cannot " + i), Tm = (e, t, i) => t.has(e) ? Ic("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ie = (e, t, i) => (km(e, t, "access private method"), i), ve, xt, Oc, Ac, Pc, Mc;
const Sm = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Ft = class extends F {
  constructor() {
    super(...arguments), Tm(this, ve), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return n`
      <div class="panel" @drop=${Ie(this, ve, Pc)}>
        <h5>Layers</h5>

        ${e.length === 0 ? n`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : Q(
      e,
      (t) => t.key,
      (t, i) => Ie(this, ve, Mc).call(this, t, i)
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
xt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Oc = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Ac = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Pc = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Ie(this, ve, xt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Mc = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return n`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Ie(this, ve, Oc).call(this, a, e.key)}
        @dragover=${(a) => Ie(this, ve, Ac).call(this, a, t)}
        @click=${() => Ie(this, ve, xt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Sm[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ie(this, ve, xt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ie(this, ve, xt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ie(this, ve, xt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ie(this, ve, xt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Ft.styles = P`
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
ca([
  g({ type: Array })
], Ft.prototype, "layers", 2);
ca([
  g({ type: String })
], Ft.prototype, "selectedLayerKey", 2);
ca([
  y()
], Ft.prototype, "_dragKey", 2);
ca([
  y()
], Ft.prototype, "_dropIndex", 2);
Ft = ca([
  M("di-layers-panel")
], Ft);
var Em = Object.defineProperty, Dm = Object.getOwnPropertyDescriptor, Rc = (e) => {
  throw TypeError(e);
}, Qe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Em(t, i, s), s;
}, er = (e, t, i) => t.has(e) || Rc("Cannot " + i), Cm = (e, t, i) => (er(e, t, "read from private field"), i ? i.call(e) : t.get(e)), an = (e, t, i) => t.has(e) ? Rc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Im = (e, t, i, a) => (er(e, t, "write to private field"), t.set(e, i), i), oe = (e, t, i) => (er(e, t, "access private method"), i), G, Ue, Xa, zc, Lc, Ai;
let De = class extends F {
  constructor() {
    super(...arguments), an(this, G), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, an(this, Xa, 100);
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
            @click=${() => oe(this, G, Ue).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            compact
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${Ga.min * 100}
            .max=${Ga.max * 100}
            .value=${oe(this, G, zc).call(this)}
            @change=${oe(this, G, Lc)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => oe(this, G, Ue).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => oe(this, G, Ue).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${oe(this, G, Ai).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${oe(this, G, Ai).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${oe(this, G, Ai).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${oe(this, G, Ai).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => oe(this, G, Ue).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => oe(this, G, Ue).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => oe(this, G, Ue).call(this, "di-request-preview")}>
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
Xa = /* @__PURE__ */ new WeakMap();
zc = function() {
  return this.matches(":focus-within") || Im(this, Xa, Math.round(this.effectiveScale * 100)), Cm(this, Xa);
};
Lc = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && oe(this, G, Ue).call(this, "di-zoom-change", { zoom: t / 100 });
};
Ai = function(e, t, i) {
  return n`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => oe(this, G, Ue).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
De.styles = P`
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
Qe([
  g({ type: Number })
], De.prototype, "effectiveScale", 2);
Qe([
  g({ type: Boolean })
], De.prototype, "snapEnabled", 2);
Qe([
  g({ type: Boolean })
], De.prototype, "showRulers", 2);
Qe([
  g({ type: Boolean })
], De.prototype, "showSafeArea", 2);
Qe([
  g({ type: Boolean })
], De.prototype, "showMeasured", 2);
Qe([
  g({ type: Boolean })
], De.prototype, "canUndo", 2);
Qe([
  g({ type: Boolean })
], De.prototype, "canRedo", 2);
Qe([
  g({ type: Boolean })
], De.prototype, "previewing", 2);
De = Qe([
  M("di-canvas-toolbar")
], De);
var Om = Object.defineProperty, Am = Object.getOwnPropertyDescriptor, Fc = (e) => {
  throw TypeError(e);
}, tr = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Am(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Om(t, i, s), s;
}, ir = (e, t, i) => t.has(e) || Fc("Cannot " + i), Ht = (e, t, i) => (ir(e, t, "read from private field"), t.get(e)), va = (e, t, i) => t.has(e) ? Fc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), mo = (e, t, i, a) => (ir(e, t, "write to private field"), t.set(e, i), i), sn = (e, t, i) => (ir(e, t, "access private method"), i), fi, Oa, zi, Aa, Uc, Wc;
let Gi = class extends F {
  constructor() {
    super(), va(this, Aa), va(this, fi), this._selection = [], va(this, Oa, ""), va(this, zi), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(gt, (e) => {
      mo(this, fi, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== Ht(this, Oa) && (mo(this, Oa, i), sn(this, Aa, Uc).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
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
          @change=${sn(this, Aa, Wc)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
fi = /* @__PURE__ */ new WeakMap();
Oa = /* @__PURE__ */ new WeakMap();
zi = /* @__PURE__ */ new WeakMap();
Aa = /* @__PURE__ */ new WeakSet();
Uc = async function(e) {
  if (!Ht(this, fi)) return;
  Ht(this, zi) ?? mo(this, zi, vn(Ht(this, fi).getToken).catch(() => []));
  const t = await Ht(this, zi), i = new Set(e), a = t.filter((s) => i.has(s.alias)).map((s) => s.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
Wc = function(e) {
  var i;
  const t = e.target.selection;
  (i = Ht(this, fi)) == null || i.setSampleContentKey(t[0]);
};
Gi.styles = P`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
tr([
  y()
], Gi.prototype, "_selection", 2);
tr([
  y()
], Gi.prototype, "_allowedContentTypeIds", 2);
Gi = tr([
  M("di-preview-content-picker")
], Gi);
var Pm = Object.defineProperty, Mm = Object.getOwnPropertyDescriptor, Nc = (e) => {
  throw TypeError(e);
}, ua = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Pm(t, i, s), s;
}, ar = (e, t, i) => t.has(e) || Nc("Cannot " + i), X = (e, t, i) => (ar(e, t, "read from private field"), t.get(e)), vt = (e, t, i) => t.has(e) ? Nc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pt = (e, t, i, a) => (ar(e, t, "write to private field"), t.set(e, i), i), Be = (e, t, i) => (ar(e, t, "access private method"), i), st, Zt, Qt, Mt, Ja, Za, ke, sr, Pa, or, yo;
const Rm = 400;
let Ut = class extends F {
  constructor() {
    super(), vt(this, ke), vt(this, st), vt(this, Zt), vt(this, Qt), vt(this, Mt), vt(this, Ja), vt(this, Za, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(gt, (e) => {
      Pt(this, st, e), e && (this.observe(e.template, (t) => {
        t && Be(this, ke, Pa).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Pt(this, Ja, t);
        const i = (a = X(this, st)) == null ? void 0 : a.getData();
        i && Be(this, ke, Pa).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Pt(this, Za, t ?? !0);
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
    const e = (t = X(this, st)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(X(this, Zt)), this._collapsed = !1, Be(this, ke, or).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(X(this, Zt)), (e = X(this, Qt)) == null || e.abort(), Be(this, ke, sr).call(this);
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
        const t = (e = X(this, st)) == null ? void 0 : e.getData();
        t && Be(this, ke, Pa).call(this, t);
      }
    }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed ? h : n`
              <di-preview-content-picker></di-preview-content-picker>
              <div class="body">
                ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : h}
                ${this._error ? n`<span class="error" role="status">${this._error}</span>` : this._url ? n`<img src=${this._url} alt="Server-rendered preview of this template" />` : n`<span class="pending">Rendering…</span>`}
              </div>
            `}
      </div>
    `;
  }
};
st = /* @__PURE__ */ new WeakMap();
Zt = /* @__PURE__ */ new WeakMap();
Qt = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
Ja = /* @__PURE__ */ new WeakMap();
Za = /* @__PURE__ */ new WeakMap();
ke = /* @__PURE__ */ new WeakSet();
sr = function() {
  X(this, Mt) && (URL.revokeObjectURL(X(this, Mt)), Pt(this, Mt, void 0));
};
Pa = function(e) {
  this._collapsed || (window.clearTimeout(X(this, Zt)), Pt(this, Zt, window.setTimeout(() => void Be(this, ke, or).call(this, e), Rm)));
};
or = async function(e) {
  var t;
  if (X(this, st)) {
    (t = X(this, Qt)) == null || t.abort(), Pt(this, Qt, new AbortController()), Be(this, ke, yo).call(this, !0), this._error = void 0;
    try {
      const i = await bn(
        e,
        {
          signal: X(this, Qt).signal,
          contentKey: X(this, Ja),
          useSampleData: X(this, Za)
        },
        X(this, st).getToken
      );
      Be(this, ke, sr).call(this), Pt(this, Mt, URL.createObjectURL(i)), this._url = X(this, Mt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Be(this, ke, yo).call(this, !1);
    }
  }
};
yo = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
Ut.styles = P`
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
      ${Lo}
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
ua([
  y()
], Ut.prototype, "_url", 2);
ua([
  y()
], Ut.prototype, "_loading", 2);
ua([
  y()
], Ut.prototype, "_error", 2);
ua([
  y()
], Ut.prototype, "_collapsed", 2);
Ut = ua([
  M("di-preview-strip")
], Ut);
var zm = Object.defineProperty, Lm = Object.getOwnPropertyDescriptor, Bc = (e) => {
  throw TypeError(e);
}, K = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Lm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && zm(t, i, s), s;
}, rr = (e, t, i) => t.has(e) || Bc("Cannot " + i), $ = (e, t, i) => (rr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Kt = (e, t, i) => t.has(e) ? Bc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Qa = (e, t, i, a) => (rr(e, t, "write to private field"), t.set(e, i), i), we = (e, t, i) => (rr(e, t, "access private method"), i), D, Hi, Yi, ei, B, fo, nr, jc, Kc, go, Vc, qc, Gc, vo, Hc, Yc, Xc, Ma;
const Fm = 400;
let U = class extends F {
  constructor() {
    super(), Kt(this, B), Kt(this, D), Kt(this, Hi), Kt(this, Yi), Kt(this, ei), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, Kt(this, Ma, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = $(this, D);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = $(this, B, fo);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), we(this, B, go).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const r = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -r : e.key === "ArrowRight" ? r : 0, p = e.key === "ArrowUp" ? -r : e.key === "ArrowDown" ? r : 0, m = Re(s.position, "x") ? 0 : l, S = Re(s.position, "y") ? 0 : p;
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
    }), this.consumeContext(ee, (e) => {
      Qa(this, Hi, e);
    }), this.consumeContext(gt, (e) => {
      Qa(this, D, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (we(this, B, Vc).call(this, t), we(this, B, qc).call(this, t), we(this, B, Gc).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", $(this, Ma));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", $(this, Ma)), window.clearTimeout($(this, Yi)), (e = $(this, ei)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? n`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = $(this, D)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = $(this, D)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = $(this, D)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => we(this, B, go).call(this, e.detail.key)}
        @di-layer-detach=${(e) => we(this, B, Kc).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = $(this, D)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = $(this, D)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = $(this, D)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = $(this, D)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = $(this, D)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = $(this, D)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => we(this, B, vo).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => we(this, B, vo).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-use-image-size=${we(this, B, Xc)}
        @di-request-preview=${() => {
      var e;
      return (e = $(this, B, jc)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(Ga.min, Math.min(Ga.max, e.detail.zoom));
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
      return (e = $(this, D)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = $(this, D)) == null ? void 0 : e.redo();
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
            .layer=${$(this, B, fo)}
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
D = /* @__PURE__ */ new WeakMap();
Hi = /* @__PURE__ */ new WeakMap();
Yi = /* @__PURE__ */ new WeakMap();
ei = /* @__PURE__ */ new WeakMap();
B = /* @__PURE__ */ new WeakSet();
fo = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
nr = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
jc = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Kc = function(e, t) {
  var s, o, r;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = $(this, B, nr)) == null ? void 0 : o.resolvedPositionOf(e);
  (r = $(this, D)) == null || r.updateLayer(e, { position: Rs(i.position, t, a) });
};
go = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const r = (a = $(this, B, nr)) == null ? void 0 : a.resolvedPositionOf(o.key);
    r && t.set(o.key, r);
  }
  (s = $(this, D)) == null || s.removeLayer(e, t);
};
Vc = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && $(this, D) && await ul(t, $(this, D).getToken);
};
qc = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !$(this, D)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await wn(t.mediaKey, $(this, D).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Gc = function() {
  window.clearTimeout($(this, Yi)), Qa(this, Yi, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !$(this, D))) {
      (t = $(this, ei)) == null || t.abort(), Qa(this, ei, new AbortController());
      try {
        const i = await _n(
          e,
          { signal: $(this, ei).signal, useSampleData: !0 },
          $(this, D).getToken
        );
        $(this, D).setServerBounds(i.layers), $(this, D).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, Fm));
};
vo = function(e, t, i, a) {
  const s = this._template;
  if (!s || !$(this, D)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: we(this, B, Yc).call(this) };
  if (e.kind === "property") {
    const l = Ad(e.property, o);
    if (l.kind === "condition") {
      we(this, B, Hc).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    $(this, D).addLayer(l.layer);
    return;
  }
  const r = e.layerType === "image" ? En(o, "Image") : e.layerType === "badges" ? Dn(o, "Badges", "") : e.layerType === "rect" ? Id(o, "Shape", e.preset) : Sn(o, "Text", { kind: "static", text: "Text" });
  $(this, D).addLayer(r);
};
Hc = function(e, t, i) {
  var o, r, l, p;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((m) => m.key === a);
  if (!s) {
    (r = $(this, Hi)) == null || r.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = $(this, D)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (p = $(this, Hi)) == null || p.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
Yc = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Xc = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !$(this, D)) return;
  const t = await wn(e.mediaKey, $(this, D).getToken).catch(() => {
  });
  t && $(this, D).updateCanvas({ width: t.width, height: t.height });
};
Ma = /* @__PURE__ */ new WeakMap();
U.styles = P`
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
], U.prototype, "_template", 2);
K([
  y()
], U.prototype, "_selectedKey", 2);
K([
  y()
], U.prototype, "_properties", 2);
K([
  y()
], U.prototype, "_linkedProperties", 2);
K([
  y()
], U.prototype, "_linkedCaptions", 2);
K([
  y()
], U.prototype, "_fonts", 2);
K([
  y()
], U.prototype, "_serverBounds", 2);
K([
  y()
], U.prototype, "_baseImageUrl", 2);
K([
  y()
], U.prototype, "_zoom", 2);
K([
  y()
], U.prototype, "_effectiveScale", 2);
K([
  y()
], U.prototype, "_previewing", 2);
K([
  y()
], U.prototype, "_snapEnabled", 2);
K([
  y()
], U.prototype, "_showRulers", 2);
K([
  y()
], U.prototype, "_showSafeArea", 2);
K([
  y()
], U.prototype, "_showMeasured", 2);
K([
  y()
], U.prototype, "_canUndo", 2);
K([
  y()
], U.prototype, "_canRedo", 2);
U = K([
  M("di-design-view")
], U);
const Um = U, Wm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return U;
  },
  default: Um
}, Symbol.toStringTag, { value: "Module" }));
var Nm = Object.defineProperty, Bm = Object.getOwnPropertyDescriptor, Jc = (e) => {
  throw TypeError(e);
}, et = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Nm(t, i, s), s;
}, lr = (e, t, i) => t.has(e) || Jc("Cannot " + i), te = (e, t, i) => (lr(e, t, "read from private field"), t.get(e)), Ti = (e, t, i) => t.has(e) ? Jc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Xi = (e, t, i, a) => (lr(e, t, "write to private field"), t.set(e, i), i), it = (e, t, i) => (lr(e, t, "access private method"), i), Pe, Ji, ti, Rt, Ce, cr, Ra, Zc, Qc, eu;
let he = class extends F {
  constructor() {
    super(), Ti(this, Ce), Ti(this, Pe), Ti(this, Ji), Ti(this, ti), Ti(this, Rt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(ee, (e) => {
      Xi(this, Ji, e);
    }), this.consumeContext(gt, (e) => {
      Xi(this, Pe, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, it(this, Ce, Ra).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), it(this, Ce, Ra).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = te(this, ti)) == null || e.abort(), it(this, Ce, cr).call(this);
  }
  render() {
    return this._template ? n`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => it(this, Ce, Ra).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${it(this, Ce, Qc)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : h}
          ${this._error ? n`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? n`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : h}
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._template.layers.length === 0 ? n`<p class="empty">This template has no layers yet.</p>` : n`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${Q(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => it(this, Ce, eu).call(this, e)
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
                @click=${it(this, Ce, Zc)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : h}
      </div>
    ` : n`<uui-loader></uui-loader>`;
  }
};
Pe = /* @__PURE__ */ new WeakMap();
Ji = /* @__PURE__ */ new WeakMap();
ti = /* @__PURE__ */ new WeakMap();
Rt = /* @__PURE__ */ new WeakMap();
Ce = /* @__PURE__ */ new WeakSet();
cr = function() {
  te(this, Rt) && (URL.revokeObjectURL(te(this, Rt)), Xi(this, Rt, void 0));
};
Ra = async function() {
  var i;
  const e = this._template;
  if (!e || !te(this, Pe)) return;
  (i = te(this, ti)) == null || i.abort(), Xi(this, ti, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: te(this, ti).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, s] = await Promise.all([
      bn(e, t, te(this, Pe).getToken),
      _n(e, t, te(this, Pe).getToken)
    ]);
    it(this, Ce, cr).call(this), Xi(this, Rt, URL.createObjectURL(a)), this._url = te(this, Rt), this._bounds = s.layers, this._skipped = s.skipped ?? [], te(this, Pe).setServerBounds(s.layers), te(this, Pe).setIssues(s.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Zc = async function() {
  var e, t;
  if (!(!this._contentKey || !te(this, Pe))) {
    this._regenerating = !0;
    try {
      const i = await $o(this._contentKey, te(this, Pe).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = te(this, Ji)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = te(this, Ji)) == null || t.peek("danger", {
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
Qc = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
eu = function(e) {
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
          ${t.truncated ? n`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : h}
        </uui-table-cell>
        <uui-table-cell>${Math.round(t.x)}, ${Math.round(t.y)}</uui-table-cell>
        <uui-table-cell>${Math.round(t.width)} × ${Math.round(t.height)}</uui-table-cell>
      </uui-table-row>
    `;
};
he.styles = P`
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
      ${Lo}
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
et([
  y()
], he.prototype, "_template", 2);
et([
  y()
], he.prototype, "_contentKey", 2);
et([
  y()
], he.prototype, "_bounds", 2);
et([
  y()
], he.prototype, "_skipped", 2);
et([
  y()
], he.prototype, "_url", 2);
et([
  y()
], he.prototype, "_loading", 2);
et([
  y()
], he.prototype, "_error", 2);
et([
  y()
], he.prototype, "_regenerating", 2);
he = et([
  M("di-preview-view")
], he);
const jm = he, Km = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return he;
  },
  default: jm
}, Symbol.toStringTag, { value: "Module" }));
var Vm = Object.defineProperty, qm = Object.getOwnPropertyDescriptor, tu = (e) => {
  throw TypeError(e);
}, da = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Vm(t, i, s), s;
}, ur = (e, t, i) => t.has(e) || tu("Cannot " + i), J = (e, t, i) => (ur(e, t, "read from private field"), i ? i.call(e) : t.get(e)), on = (e, t, i) => t.has(e) ? tu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gm = (e, t, i, a) => (ur(e, t, "write to private field"), t.set(e, i), i), Yt = (e, t, i) => (ur(e, t, "access private method"), i), re, de, iu, au, es, su, ou, ru, nu, lu, cu;
let He = class extends F {
  constructor() {
    super(), on(this, de), on(this, re), this._properties = [], this._showAdvanced = !1, this.consumeContext(gt, (e) => {
      Gm(this, re, e), e && (vn(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? n`
      <div class="grid">
        ${Yt(this, de, ru).call(this)} ${Yt(this, de, nu).call(this)} ${Yt(this, de, lu).call(this)} ${Yt(this, de, cu).call(this)}
      </div>
    ` : n`<uui-loader></uui-loader>`;
  }
};
re = /* @__PURE__ */ new WeakMap();
de = /* @__PURE__ */ new WeakSet();
iu = function() {
  return this._properties.filter((e) => e.classification === "media");
};
au = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
es = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
su = async function(e) {
  var s, o;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((r) => [r.key, r.alias])), a = [
    ...t.map((r) => i.get(r)).filter((r) => !!r),
    ...J(this, de, es)
  ].filter((r, l, p) => p.indexOf(r) === l);
  (s = J(this, re)) == null || s.updateTemplateFields({ docTypeAliases: a }), await ((o = J(this, re)) == null ? void 0 : o.reloadProperties());
};
ou = function(e) {
  var i;
  const t = e.target.selection;
  (i = J(this, re)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
ru = function() {
  const e = this._template;
  return n`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? n`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${J(this, de, au)}
                  @change=${Yt(this, de, su)}></umb-input-document-type>` : n`<uui-loader-bar></uui-loader-bar>`}
            ${J(this, de, es).length > 0 ? n`<p class="note">
                  Also targets ${J(this, de, es).join(", ")}, which no document type has any more.
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
    ...J(this, de, iu).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = J(this, re)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = J(this, re)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
nu = function() {
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
            @change=${Yt(this, de, ou)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = J(this, re)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = J(this, re)) == null ? void 0 : i.updateOutput({
      format: t.target.value
    });
  }}>
          </uui-select>
        </umb-property-layout>

        ${e.output.format === "png" ? h : n`<umb-property-layout label="Quality" description="1-100. Ignored for PNG.">
              <uui-input
                slot="editor"
                type="number"
                min="1"
                max="100"
                .value=${String(e.output.quality)}
                @change=${(t) => {
    var i;
    return (i = J(this, re)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
lu = function() {
  const e = this._template;
  return n`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = J(this, re)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = J(this, re)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
cu = function() {
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
    return (i = J(this, re)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
            ${this._showAdvanced ? n`<pre class="json">${JSON.stringify(e, null, 2)}</pre>` : h}
          </div>
        </umb-property-layout>
      </uui-box>
    `;
};
He.styles = P`
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
da([
  y()
], He.prototype, "_template", 2);
da([
  y()
], He.prototype, "_properties", 2);
da([
  y()
], He.prototype, "_showAdvanced", 2);
da([
  y()
], He.prototype, "_documentTypes", 2);
He = da([
  M("di-settings-view")
], He);
const Hm = He, Ym = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return He;
  },
  default: Hm
}, Symbol.toStringTag, { value: "Module" }));
var Xm = Object.defineProperty, Jm = Object.getOwnPropertyDescriptor, uu = (e) => {
  throw TypeError(e);
}, pa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jm(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Xm(t, i, s), s;
}, dr = (e, t, i) => t.has(e) || uu("Cannot " + i), rn = (e, t, i) => (dr(e, t, "read from private field"), t.get(e)), nn = (e, t, i) => t.has(e) ? uu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Zm = (e, t, i, a) => (dr(e, t, "write to private field"), t.set(e, i), i), ln = (e, t, i) => (dr(e, t, "access private method"), i), Zi, za, bo;
let Ye = class extends F {
  constructor() {
    super(), nn(this, za), nn(this, Zi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(gt, (e) => {
      Zm(this, Zi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && ln(this, za, bo).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => ln(this, za, bo).call(this)}>Reload</uui-button>
        </div>

        <p class="summary">
          <strong>${this._usage.withImageOnPage}</strong> of the
          <strong>${this._usage.items.length}</strong> shown have an image.
          ${this._usage.total > this._usage.items.length ? n`<span class="muted">${this._usage.total} in total.</span>` : h}
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
              ${Q(
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
Zi = /* @__PURE__ */ new WeakMap();
za = /* @__PURE__ */ new WeakSet();
bo = async function() {
  const e = this._template;
  if (!(!e || !rn(this, Zi))) {
    this._loading = !0;
    try {
      this._usage = await xd(e.key, rn(this, Zi).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Ye.styles = P`
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
pa([
  y()
], Ye.prototype, "_template", 2);
pa([
  y()
], Ye.prototype, "_usage", 2);
pa([
  y()
], Ye.prototype, "_loading", 2);
pa([
  y()
], Ye.prototype, "_onlyMissing", 2);
Ye = pa([
  M("di-usage-view")
], Ye);
const Qm = Ye, ey = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Ye;
  },
  default: Qm
}, Symbol.toStringTag, { value: "Module" })), ty = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Os,
  default: Os
}, Symbol.toStringTag, { value: "Module" }));
var ct, Ot;
class Es extends $u {
  constructor(i, a) {
    super(i, a);
    x(this, ct);
    x(this, Ot);
    this.consumeContext(ee, (s) => {
      _(this, ct, s);
    }), this.consumeContext(gt, (s) => {
      _(this, Ot, s);
    });
  }
  async execute() {
    var s, o, r;
    const i = d(this, Ot), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = d(this, ct)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await _o(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await $n(a.key, !1, i.getToken);
        (o = d(this, ct)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await Xn(l, i.getToken, d(this, ct));
      } catch (l) {
        (r = d(this, ct)) == null || r.peek("danger", {
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
    d(this, Ot) && await $d(i, d(this, Ot).getToken);
  }
}
ct = new WeakMap(), Ot = new WeakMap();
const iy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: Es,
  api: Es,
  default: Es
}, Symbol.toStringTag, { value: "Module" }));
var ea, pi;
class Ds extends oa {
  constructor(i, a) {
    super(i, a);
    x(this, ea);
    x(this, pi);
    this.consumeContext(Le, (s) => {
      _(this, ea, s);
    }), this.consumeContext(ee, (s) => {
      _(this, pi, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await $o(i, () => {
          var l;
          return (l = d(this, ea)) == null ? void 0 : l.getLatestToken();
        }), r = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = d(this, pi)) == null || a.peek(r ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: r ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const r = o instanceof ht && o.status === 404;
        (s = d(this, pi)) == null || s.peek(r ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof ht ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
ea = new WeakMap(), pi = new WeakMap();
const ay = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: Ds,
  api: Ds,
  default: Ds
}, Symbol.toStringTag, { value: "Module" }));
var ta, At, ia, hi;
class Cs extends Nu {
  constructor(i, a) {
    super(i, a);
    x(this, ta);
    x(this, At);
    x(this, ia);
    x(this, hi);
    this.consumeContext(Le, (s) => {
      _(this, ta, s);
    }), this.consumeContext(ee, (s) => {
      _(this, At, s);
    }), this.consumeContext(Bu, (s) => {
      _(this, ia, s);
    }), this.consumeContext(ju, (s) => {
      _(this, hi, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!d(this, hi)) {
      (i = d(this, At)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const r = await $o(d(this, hi), () => {
        var l;
        return (l = d(this, ta)) == null ? void 0 : l.getLatestToken();
      });
      r.propertyValue && ((a = d(this, ia)) == null || a.setValue(JSON.parse(r.propertyValue))), (s = d(this, At)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: r.message ?? "The image has been regenerated."
        }
      });
    } catch (r) {
      const l = r instanceof ht && r.status === 404;
      (o = d(this, At)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: r instanceof ht ? r.detail ?? r.message : "The image could not be regenerated."
        }
      });
    }
  }
}
ta = new WeakMap(), At = new WeakMap(), ia = new WeakMap(), hi = new WeakMap();
const sy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: Cs,
  api: Cs,
  default: Cs
}, Symbol.toStringTag, { value: "Module" }));
var oy = Object.defineProperty, ry = Object.getOwnPropertyDescriptor, du = (e) => {
  throw TypeError(e);
}, tt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ry(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && oy(t, i, s), s;
}, pr = (e, t, i) => t.has(e) || du("Cannot " + i), gi = (e, t, i) => (pr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Is = (e, t, i) => t.has(e) ? du("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ny = (e, t, i, a) => (pr(e, t, "write to private field"), t.set(e, i), i), kt = (e, t, i) => (pr(e, t, "access private method"), i), La, ha, $e, pu, hu, mu, hr, yu, fu, gu, vu;
const ly = [100, 200, 300, 400, 500, 600, 700, 800, 900], cy = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let me = class extends yn {
  constructor() {
    super(), Is(this, $e), Is(this, La), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", Is(this, ha, () => {
      var e;
      return (e = gi(this, La)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Le, (e) => {
      ny(this, La, e);
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
            @change=${kt(this, $e, pu)}>
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
            @click=${kt(this, $e, mu)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${cy.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? kt(this, $e, vu).call(this) : kt(this, $e, gu).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !gi(this, $e, hr)}
            @click=${kt(this, $e, yu)}>
            Add web font
          </uui-button>
        </uui-box>

        ${this._error ? n`<p class="error" role="alert">${this._error}</p>` : h}
        ${this._busy ? n`<uui-loader-bar></uui-loader-bar>` : h}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
La = /* @__PURE__ */ new WeakMap();
ha = /* @__PURE__ */ new WeakMap();
$e = /* @__PURE__ */ new WeakSet();
pu = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  kt(this, $e, hu).call(this, t);
};
hu = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await pd(t, gi(this, ha));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
mu = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await hd(this._path.trim(), gi(this, ha)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
hr = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
yu = async function() {
  if (gi(this, $e, hr)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await md(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        gi(this, ha)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
fu = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
gu = function() {
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
        ${Q(
    ly,
    (e) => e,
    (e) => n`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => kt(this, $e, fu).call(this, e, t.target.checked)}>
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
        ${this._provider === "bunny" ? n`<br />Bunny Fonts serve the Latin subset only, so accented Latin renders but other scripts do not.` : h}
      </p>
    `;
};
vu = function() {
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
me.styles = P`
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
tt([
  y()
], me.prototype, "_busy", 2);
tt([
  y()
], me.prototype, "_error", 2);
tt([
  y()
], me.prototype, "_path", 2);
tt([
  y()
], me.prototype, "_provider", 2);
tt([
  y()
], me.prototype, "_family", 2);
tt([
  y()
], me.prototype, "_weights", 2);
tt([
  y()
], me.prototype, "_italic", 2);
tt([
  y()
], me.prototype, "_url", 2);
me = tt([
  M("di-font-upload-modal")
], me);
const uy = me, dy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return me;
  },
  default: uy
}, Symbol.toStringTag, { value: "Module" }));
var py = Object.getOwnPropertyDescriptor, hy = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? py(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(s) || s);
  return s;
};
let ts = class extends F {
  render() {
    return n`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
ts = hy([
  M("di-template-folder-editor")
], ts);
const my = ts, yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return ts;
  },
  default: my
}, Symbol.toStringTag, { value: "Module" }));
export {
  hp as manifests,
  jy as onInit
};
//# sourceMappingURL=dynamic-images.js.map
