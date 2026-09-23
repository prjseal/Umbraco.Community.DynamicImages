var _r = (e) => {
  throw TypeError(e);
};
var Jo = (e, t, i) => t.has(e) || _r("Cannot " + i);
var c = (e, t, i) => (Jo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), k = (e, t, i) => t.has(e) ? _r("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (Jo(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), E = (e, t, i) => (Jo(e, t, "access private method"), i);
var Zo = (e, t, i, a) => ({
  set _(o) {
    _(e, t, o, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as $p, UmbEntityWorkspaceDataManager as Tp, UmbSubmitWorkspaceAction as ia, UmbEntityNamedDetailWorkspaceContextBase as cn, UMB_WORKSPACE_CONTEXT as xp, UmbEntityDetailWorkspaceContextBase as kp, UmbWorkspaceActionBase as Dp } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as at, UmbContextConsumerController as Sp } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as xa, UmbItemRepositoryBase as ql, UmbItemServerDataSourceBase as Gl, UmbRepositoryBase as Ue } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as ka, UmbItemStoreBase as Yl } from "@umbraco-cms/backoffice/store";
import { UmbId as Hl } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as Ep, UMB_DATE_TIME_VALUE_TYPE as Ip } from "@umbraco-cms/backoffice/value-type";
import { nothing as h, html as r, css as F, state as y, customElement as O, ifDefined as aa, property as g, repeat as ae, classMap as Xl, styleMap as U } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as C } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as Jl, UmbTreeRepositoryBase as Zl } from "@umbraco-cms/backoffice/tree";
import { UMB_ACTION_EVENT_CONTEXT as ot } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent as ii, UmbRequestReloadStructureForEntityEvent as un, UmbEntityActionBase as ai } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT as N } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as Ql } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UMB_AUTH_CONTEXT as Ae } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as dn, UMB_DISCARD_CHANGES_MODAL as Op, umbConfirmModal as ec, UmbModalToken as tc, UmbModalBaseElement as ic } from "@umbraco-cms/backoffice/modal";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as pn } from "@umbraco-cms/backoffice/entity";
import { UmbDefaultCollectionContext as ac } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as oc, UmbDeselectedEvent as sc } from "@umbraco-cms/backoffice/event";
import { UmbConditionBase as Cp } from "@umbraco-cms/backoffice/extension-registry";
import "@umbraco-cms/backoffice/document-type";
import "@umbraco-cms/backoffice/media";
import { UmbArrayState as zi, UmbStringState as wr, UmbObjectState as $r, UmbBooleanState as La, UmbNumberState as Ap } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as Fp } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Pp } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Rp } from "@umbraco-cms/backoffice/document";
import { UmbTextStyles as Mp } from "@umbraco-cms/backoffice/style";
import { tryExecute as Lp } from "@umbraco-cms/backoffice/resources";
const zo = "dynamic-images", Wo = "di-template", gs = "di:templates-changed", zp = "/umbraco/management/api/v1/dynamic-images";
class Ht extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function f(e, t, i) {
  const a = await t(), o = new Headers(i == null ? void 0 : i.headers);
  a && o.set("Authorization", `Bearer ${a}`);
  let s = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (o.set("Content-Type", "application/json"), s = JSON.stringify(i.json));
  const n = await fetch(`${zp}${e}`, { ...i, headers: o, body: s });
  if (!n.ok) throw await Wp(n);
  return n;
}
async function Wp(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new Ht(t, e.status, i);
}
const $ = async (e) => e.json();
async function Up(e) {
  const t = await f("/templates?take=500", e);
  return (await $(t)).items;
}
const hn = async (e, t) => $(await f(`/templates/${e}`, t)), Np = async (e, t) => $(await f("/templates", t, { method: "POST", json: e })), Bp = async (e, t) => $(await f(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function jp(e, t) {
  await f(`/templates/${e}`, t, { method: "DELETE" });
}
const Kp = async (e, t, i) => $(await f(`/templates/${e}/duplicate`, i, { method: "POST", json: { targetKey: t } })), Vp = async (e, t, i) => $(await f(`/templates/${e}/enabled`, i, { method: "PUT", json: { isEnabled: t } }));
async function qp(e, t) {
  return (await f(`/templates/${e}/export`, t)).blob();
}
const Gp = async (e, t, i, a = null) => $(await f("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function Uo(e, t, i, a) {
  const o = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && o.set("foldersOnly", "true"), a && o.set("parentKey", a), o.toString();
}
const Tr = async (e, t, i, a) => $(await f(`/tree/root?${Uo(e, t, i)}`, a)), Yp = async (e, t, i, a, o) => $(await f(`/tree/children?${Uo(t, i, a, e)}`, o)), Hp = async (e, t) => $(await f(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function No(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return $(await f(`/item?${i}`, t));
}
async function Xp(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), $(await f(`/collection/templates?${i}`, t));
}
async function Jp(e, t, i) {
  return (await f(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const Zp = async (e, t) => $(await f("/folders", t, { method: "POST", json: e })), Qp = async (e, t) => $(await f(`/folders/${e}`, t)), eh = async (e, t, i) => $(await f(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function nc(e, t) {
  await f(`/folders/${e}`, t, { method: "DELETE" });
}
async function th(e, t, i) {
  await f(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function ih(e, t, i) {
  await f(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function ah(e, t, i) {
  await f("/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const oh = async (e, t, i) => $(await f("/templates/bulk-duplicate", i, { method: "POST", json: { keys: e, targetKey: t } }));
async function sh(e, t, i) {
  await f("/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
const vs = async (e) => $(await f("/fonts", e)), nh = async (e, t) => $(await f(`/fonts/${e}`, t));
async function rh(e, t, i = {}) {
  const a = new FormData();
  return a.append("file", e), i.familyKey && a.append("familyKey", i.familyKey), i.parentKey && a.append("parentKey", i.parentKey), $(await f("/fonts", t, { method: "POST", body: a }));
}
const lh = async (e, t, i = {}) => $(await f("/fonts/register-path", t, { method: "POST", json: { path: e, ...i } })), ch = async (e, t, i = {}) => $(await f("/fonts/register-web", t, { method: "POST", json: { ...e, ...i } })), uh = async (e, t) => $(await f(`/fonts/${e}/refresh`, t, { method: "POST" })), dh = async (e, t, i, a, o) => $(await f(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (o == null ? void 0 : o.weight) ?? null, isItalic: (o == null ? void 0 : o.isItalic) ?? null }
}));
async function rc(e, t) {
  await f(`/fonts/${e}`, t, { method: "DELETE" });
}
async function ph(e, t) {
  return (await f(`/fonts/${e}/file`, t)).arrayBuffer();
}
const xr = async (e, t, i, a) => $(await f(`/fonts/tree/root?${Uo(e, t, i)}`, a)), hh = async (e, t, i, a, o) => $(await f(`/fonts/tree/children?${Uo(t, i, a, e)}`, o)), mh = async (e, t) => $(await f(`/fonts/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function Bo(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return $(await f(`/fonts/item?${i}`, t));
}
async function yh(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), $(await f(`/fonts/collection?${i}`, t));
}
const lc = async (e, t, i, a) => $(await f(`/fonts/${e}/references?skip=${t}&take=${i}`, a));
async function fh(e, t, i, a) {
  const o = new URLSearchParams({ skip: String(t), take: String(i) });
  for (const s of e) o.append("key", s);
  return $(await f(`/fonts/are-referenced?${o}`, a));
}
const gh = async (e, t) => $(await f("/fonts/folders", t, { method: "POST", json: e })), vh = async (e, t) => $(await f(`/fonts/folders/${e}`, t)), bh = async (e, t, i) => $(await f(`/fonts/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function cc(e, t) {
  await f(`/fonts/folders/${e}`, t, { method: "DELETE" });
}
const _h = async (e, t) => $(await f(`/fonts/families/${e}`, t)), wh = async (e, t, i) => $(await f(`/fonts/families/${e}`, i, { method: "PUT", json: { name: t } }));
async function uc(e, t) {
  await f(`/fonts/families/${e}`, t, { method: "DELETE" });
}
async function $h(e, t, i) {
  await f(`/fonts/families/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Th(e, t, i) {
  await f(`/fonts/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function xh(e, t, i) {
  await f("/fonts/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
async function kh(e, t, i) {
  await f("/fonts/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const dc = async (e) => $(await f("/document-types", e)), Dh = async (e, t) => $(await f(`/document-types/${encodeURIComponent(e)}/properties`, t)), Sh = async (e, t, i) => $(await f(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function pc(e, t, i) {
  return (await f("/preview", i, {
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
const hc = async (e, t, i) => $(await f("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), mc = async (e, t) => $(await f(`/media/${e}/image-info`, t)), mn = async (e, t) => $(await f(`/documents/${e}/regenerate`, t, { method: "POST" })), yc = async (e, t, i) => $(await f(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), Eh = async (e, t) => $(await f(`/jobs/${e}`, t));
async function Ih(e, t) {
  await f(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const Oh = async (e, t) => $(await f(`/templates/${e}/usage`, t)), fc = async (e) => $(await f("/health", e)), Ch = async (e) => $(await f("/sync/status", e)), Ah = async (e) => $(await f("/sync/export", e, { method: "POST" })), Fh = async (e) => $(await f("/sync/import", e, { method: "POST" }));
function Da(e) {
  const t = `section/${zo}/workspace/${Wo}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Ph(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${zo}/workspace/${Wo}/create${t}`, document.baseURI).pathname;
}
function Xt(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${zo}/workspace/${e}${i}`, document.baseURI).pathname;
}
function Rh(e) {
  return new URL(`section/${zo}/dashboard/${e}`, document.baseURI).pathname;
}
function yn() {
  window.dispatchEvent(new CustomEvent(gs));
}
const jo = () => crypto.randomUUID();
function Ko(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function gc(e, t, i) {
  const { x: a, y: o } = Ko(e);
  return {
    type: "text",
    key: jo(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    // Dropped layers are centred on the pointer, which is what "I put it there" means.
    position: { x: a, y: o, anchor: "middleCentre" },
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
function vc(e, t, i) {
  const { x: a, y: o } = Ko(e);
  return {
    type: "image",
    key: jo(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: a, y: o, anchor: "middleCentre" },
    size: { width: 320, height: 180 },
    rotation: 0,
    visibility: { rule: "always" },
    source: i ? { kind: "property", propertyAlias: i, fallback: null } : { kind: "none" },
    fit: "cover",
    cornerRadius: 16,
    border: null
  };
}
function bc(e, t, i) {
  const { x: a, y: o } = Ko(e);
  return {
    type: "badges",
    key: jo(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: a, y: o, anchor: "middleCentre" },
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
const oa = {
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
}, Mh = Object.keys(oa);
function Lh(e, t = "Shape", i = "rectangle") {
  const { x: a, y: o } = Ko(e), s = oa[i] ?? oa.rectangle;
  return {
    type: "rect",
    key: jo(),
    name: t === "Shape" ? s.label : t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: a, y: o, anchor: "middleCentre" },
    size: { ...s.size },
    rotation: 0,
    visibility: { rule: "always" },
    shape: s.shape,
    fill: "#00000099",
    gradient: null,
    cornerRadius: s.cornerRadius ?? 0,
    sides: s.sides ?? 5,
    innerRatio: s.innerRatio ?? 0.5,
    border: null,
    ...s.lockAspect ? { lockAspect: !0 } : {}
  };
}
function zh(e) {
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
function Wh(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (zh(e.classification)) {
    case "image":
      return { kind: "layer", layer: vc(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: bc(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: gc(t, e.name, Uh(e)) };
  }
}
function Uh(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function _c() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function Nh(e) {
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
const wc = [
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
function sa(e) {
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
function na(e) {
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
function bs(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return wc[a * 3 + i];
}
function Vo(e, t, i) {
  return {
    x: e.x - t * sa(e.anchor),
    y: e.y - i * na(e.anchor)
  };
}
function fn(e, t, i, a, o) {
  return {
    x: e + i * sa(o),
    y: t + a * na(o)
  };
}
function Bh(e, t, i, a) {
  const o = Vo(e, t, i), s = fn(o.x, o.y, t, i, a);
  return { ...e, x: Math.round(s.x), y: Math.round(s.y), anchor: a };
}
function jh(e, t) {
  const i = fn(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function $c(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function di(e, t, i, a, o) {
  if (o === 0) return { x: e, y: t };
  const s = o * Math.PI / 180, n = Math.cos(s), l = Math.sin(s), p = e - i, m = t - a;
  return { x: i + p * n - m * l, y: a + p * l + m * n };
}
function Kh(e, t, i, a, o) {
  return di(e, t, i, a, -o);
}
function Tc(e, t, i, a) {
  if (a === 0) return e;
  const o = [
    di(e.x, e.y, t, i, a),
    di(e.x + e.width, e.y, t, i, a),
    di(e.x + e.width, e.y + e.height, t, i, a),
    di(e.x, e.y + e.height, t, i, a)
  ], s = Math.min(...o.map((m) => m.x)), n = Math.max(...o.map((m) => m.x)), l = Math.min(...o.map((m) => m.y)), p = Math.max(...o.map((m) => m.y));
  return { x: s, y: l, width: n - s, height: p - l };
}
const Vh = 10;
function ze(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function xc(e) {
  return !!e.relativeX || !!e.relativeY;
}
function ho(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function kr(e) {
  return e === "below" || e === "above";
}
function Dr(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function qh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Gh(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), o = Dr(i.position).map((s) => s.layerKey);
  for (; o.length > 0; ) {
    const s = o.pop();
    if (s === e) return !0;
    if (a.has(s)) continue;
    a.add(s);
    const n = t.get(s);
    n && o.push(...Dr(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Yh(e, t, i) {
  const a = e.position;
  if (!xc(a)) return a;
  if (Gh(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let o = a.x, s = a.y, n = sa(a.anchor), l = na(a.anchor);
  const p = Sr(e, a.relativeX, !1, t, i);
  p && (o = p.coordinate, n = p.factor);
  const m = Sr(e, a.relativeY, !0, t, i);
  return m && (s = m.coordinate, l = m.factor), { x: o, y: s, anchor: bs(n, l) };
}
function Sr(e, t, i, a, o) {
  if (!t || kr(t.edge) !== i) return;
  const s = /* @__PURE__ */ new Set([e.key]);
  let n = t.layerKey;
  for (; !s.has(n); ) {
    s.add(n);
    const l = a.get(n);
    if (!l) return;
    const p = o(n);
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
    if (!m || kr(m.edge) !== i) return;
    n = m.layerKey;
  }
}
function Hh(e, t, i) {
  const a = qh(e), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set(), n = (l) => {
    const p = o.get(l.key);
    if (p) return p;
    let m;
    s.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (s.add(l.key), m = Yh(l, a, (ge) => {
      const ve = a.get(ge);
      return ve && !i(ve) ? n(ve).extent : void 0;
    }), s.delete(l.key));
    const S = t(l), D = Vo(m, S.width, S.height), q = { x: D.x, y: D.y, width: S.width, height: S.height }, oe = { position: m, box: q, extent: Tc(q, m.x, m.y, l.rotation ?? 0) };
    return o.set(l.key, oe), oe;
  };
  for (const l of e) n(l);
  return o;
}
function _s(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? bs(sa(i.anchor), na(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? bs(sa(e.anchor), na(i.anchor)) : e.anchor
  };
}
var de, je, Re, mt;
class Xh {
  constructor(t = 100) {
    k(this, de, []);
    k(this, je, []);
    k(this, Re, 0);
    k(this, mt);
    this.limit = t;
  }
  get canUndo() {
    return c(this, de).length > 0;
  }
  get canRedo() {
    return c(this, je).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Re) > 0 || (c(this, de).push(structuredClone(t)), c(this, de).length > this.limit && c(this, de).shift(), _(this, je, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Re) === 0 && _(this, mt, structuredClone(t)), Zo(this, Re)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Re) !== 0 && (Zo(this, Re)._--, !(c(this, Re) > 0) && (t && c(this, mt) !== void 0 && (c(this, de).push(c(this, mt)), c(this, de).length > this.limit && c(this, de).shift(), _(this, je, [])), _(this, mt, void 0)));
  }
  undo(t) {
    const i = c(this, de).pop();
    if (i !== void 0)
      return c(this, je).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, je).pop();
    if (i !== void 0)
      return c(this, de).push(structuredClone(t)), i;
  }
  clear() {
    _(this, de, []), _(this, je, []), _(this, Re, 0), _(this, mt, void 0);
  }
}
de = new WeakMap(), je = new WeakMap(), Re = new WeakMap(), mt = new WeakMap();
const ws = 3, Jh = (e) => Zh(e), Er = (e, t) => e.slice(0, Math.max(0, t)).join("."), Zh = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), Qh = "Page";
function em(e) {
  return e.isSystem ? Qh : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const ni = (e) => e ?? Number.MAX_SAFE_INTEGER;
function tm(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || ni(t.property.tabSortOrder) - ni(i.property.tabSortOrder) || ni(t.property.groupSortOrder) - ni(i.property.groupSortOrder) || ni(t.property.sortOrder) - ni(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function im(e, t) {
  const i = tm(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: em(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function am(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const om = "DynamicImages.Workspace.Template", sm = 12, Ir = 36;
var wi, yt, Mt, Lt, $i, zt, Ti, xi, Wt, ft, ki, Ke, Di, Si, pe, _a, Ut, Me, Nt, T, kc, Ei, Ii, $s, Ts, xs, Ne, Ct, ks, qa, Dc, Sc, Ec, Ds;
class nm extends $p {
  constructor(i) {
    super(i, om);
    k(this, T);
    k(this, wi);
    k(this, yt);
    k(this, Mt);
    k(this, Lt);
    k(this, $i);
    k(this, zt);
    k(this, Ti);
    k(this, xi);
    k(this, Wt);
    k(this, ft);
    k(this, ki);
    k(this, Ke);
    k(this, Di);
    k(this, Si);
    k(this, pe);
    k(this, _a);
    k(this, Ut);
    k(this, Me);
    k(this, Nt);
    k(this, Ei);
    k(this, Ii);
    this._data = new Tp(this), this.template = this._data.current, _(this, wi, new zi([], (a) => a.key)), this.layers = c(this, wi).asObservable(), _(this, yt, new wr(void 0)), this.selectedLayerKey = c(this, yt).asObservable(), _(this, Mt, new zi([], (a) => a.alias)), this.properties = c(this, Mt).asObservable(), _(this, Lt, new $r({})), this.linkedProperties = c(this, Lt).asObservable(), _(this, $i, new $r({})), this.linkedCaptions = c(this, $i).asObservable(), _(this, zt, new zi([], (a) => a.key)), this.fonts = c(this, zt).asObservable(), _(this, Ti, new zi([], (a) => a.key)), this.serverBounds = c(this, Ti).asObservable(), _(this, xi, new zi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, xi).asObservable(), _(this, Wt, new wr(void 0)), this.sampleContentKey = c(this, Wt).asObservable(), _(this, ft, new La(!0)), this.useSampleData = c(this, ft).asObservable(), _(this, ki, new Ap(1)), this.zoom = c(this, ki).asObservable(), _(this, Ke, new La(!0)), this.loading = c(this, Ke).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, Di, new La(!1)), this.canUndo = c(this, Di).asObservable(), _(this, Si, new La(!1)), this.canRedo = c(this, Si).asObservable(), _(this, pe, new Xh()), _(this, Me, !1), _(this, Nt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, Ei, async (a) => {
      const o = a.detail;
      if (c(this, Nt) || !(o != null && o.url) || !E(this, T, kc).call(this, o.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await dn(this, Op), _(this, Nt, !0), window.history.pushState({}, "", o.url instanceof URL ? o.url.href : o.url), !0;
      } catch {
        return !1;
      }
    }), _(this, Ii, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, _a)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => os),
        setup: (a, o) => {
          const s = o.match.params.parentUnique;
          return this.createScaffold(void 0, s && s !== "null" ? s : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => os),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => os),
        setup: (a, o) => this.load(o.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ae, (a) => {
      _(this, _a, a);
    }), this.consumeContext(N, (a) => {
      _(this, Ut, a);
    }), window.addEventListener("willchangestate", c(this, Ei)), window.addEventListener("beforeunload", c(this, Ii)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Me);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Ke).setValue(!0), _(this, Me, !1);
    try {
      const a = await hn(i, this.getToken);
      E(this, T, Ct).call(this, a, { resetHistory: !0, persist: !0 }), E(this, T, Sc).call(this), this.setIsNew(!1), await E(this, T, $s).call(this, a);
    } catch (a) {
      E(this, T, Ds).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Ke).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, Ke).setValue(!0), _(this, Me, !0), E(this, T, Ct).call(this, { ...Nh(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await E(this, T, $s).call(this, this._data.getCurrent()), c(this, Ke).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await E(this, T, xs).call(this, i.docTypeAliases);
    c(this, Mt).setValue(a), c(this, Lt).setValue(await E(this, T, Ts).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, zt).setValue(await vs(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    E(this, T, Ne).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    E(this, T, Ne).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    E(this, T, Ne).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    E(this, T, Ne).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    E(this, T, Ne).call(this, (o) => ({ ...o, layers: [...o.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    E(this, T, Ne).call(this, (o) => ({
      ...o,
      layers: o.layers.map((s) => s.key === i ? { ...s, ...a } : s)
    }));
  }
  /**
   * Removes a layer, and detaches anything positioned against it in the same update - so one undo
   * restores both the layer and the links to it. `resolvedPositions` is where those layers were
   * actually drawn, which is what lets them stay put; without it they fall back to their own
   * stored coordinates.
   */
  removeLayer(i, a) {
    E(this, T, Ne).call(this, (o) => ({
      ...o,
      layers: o.layers.filter((s) => s.key !== i).map((s) => {
        var l, p;
        let n = s.position;
        return ((l = ho(n, "x")) == null ? void 0 : l.layerKey) === i && (n = _s(n, "x", a == null ? void 0 : a.get(s.key))), ((p = ho(n, "y")) == null ? void 0 : p.layerKey) === i && (n = _s(n, "y", a == null ? void 0 : a.get(s.key))), n === s.position ? s : { ...s, position: n };
      })
    })), c(this, yt).getValue() === i && this.selectLayer(void 0);
  }
  duplicateLayer(i) {
    var s;
    const a = (s = this._data.getCurrent()) == null ? void 0 : s.layers.find((n) => n.key === i);
    if (!a) return;
    const o = {
      ...structuredClone(a),
      key: crypto.randomUUID(),
      name: `${a.name} copy`,
      // Offset so the copy is visibly a copy rather than hidden exactly behind the original.
      position: { ...a.position, x: a.position.x + 20, y: a.position.y + 20 }
    };
    this.addLayer(o);
  }
  /** Moves a layer to an index in the array, which is its z-order. */
  moveLayer(i, a) {
    E(this, T, Ne).call(this, (o) => {
      const s = [...o.layers], n = s.findIndex((p) => p.key === i);
      if (n < 0) return o;
      const [l] = s.splice(n, 1);
      return s.splice(Math.max(0, Math.min(s.length, a)), 0, l), { ...o, layers: s };
    });
  }
  setLayerVisible(i, a) {
    this.updateLayer(i, { isVisible: a });
  }
  setLayerLocked(i, a) {
    this.updateLayer(i, { isLocked: a });
  }
  selectLayer(i) {
    c(this, yt).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, yt).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((o) => o.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, pe).begin(i);
  }
  endTransaction(i = !0) {
    c(this, pe).end(i), E(this, T, ks).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, pe).undo(i);
    a && E(this, T, Ct).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, pe).redo(i);
    a && E(this, T, Ct).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Ti).setValue(i);
  }
  setIssues(i) {
    c(this, xi).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    c(this, Wt).setValue(i), c(this, ft).setValue(!i), E(this, T, Dc).call(this, i);
  }
  setUseSampleData(i) {
    c(this, ft).setValue(i);
  }
  setZoom(i) {
    c(this, ki).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, o;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const s = c(this, Me) ? await Np(i, this.getToken) : await Bp(i, this.getToken);
      E(this, T, Ct).call(this, s.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Me);
      _(this, Me, !1), this.setIsNew(!1), yn(), await E(this, T, Ec).call(this, s.template, n), (a = c(this, Ut)) == null || a.peek("positive", {
        data: { message: `'${s.template.name}' saved.` }
      });
      for (const l of s.warnings)
        (o = c(this, Ut)) == null || o.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", Da(s.template.key));
    } catch (s) {
      throw E(this, T, Ds).call(this, "The template could not be saved", s), s;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Nt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, Ei)), window.removeEventListener("beforeunload", c(this, Ii)), c(this, pe).clear(), super.destroy();
  }
}
wi = new WeakMap(), yt = new WeakMap(), Mt = new WeakMap(), Lt = new WeakMap(), $i = new WeakMap(), zt = new WeakMap(), Ti = new WeakMap(), xi = new WeakMap(), Wt = new WeakMap(), ft = new WeakMap(), ki = new WeakMap(), Ke = new WeakMap(), Di = new WeakMap(), Si = new WeakMap(), pe = new WeakMap(), _a = new WeakMap(), Ut = new WeakMap(), Me = new WeakMap(), Nt = new WeakMap(), T = new WeakSet(), /**
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
kc = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, Ei = new WeakMap(), Ii = new WeakMap(), $s = async function(i) {
  const [a, o] = await Promise.all([
    vs(this.getToken).catch(() => []),
    E(this, T, xs).call(this, i.docTypeAliases)
  ]);
  c(this, zt).setValue(a), c(this, Mt).setValue(o), c(this, Lt).setValue(await E(this, T, Ts).call(this, i.docTypeAliases, o));
}, Ts = async function(i, a) {
  const o = {}, s = {};
  if (i.length === 0) return o;
  let n = a.filter((p) => p.classification === "content").slice(0, sm).map((p) => p.alias), l = 0;
  for (let p = 1; p <= ws && n.length > 0 && l < Ir; p++) {
    const m = n.slice(0, Ir - l);
    l += m.length;
    const S = await Promise.all(m.map(async (D) => {
      var Li;
      const q = await Promise.all(
        i.map((se) => Sh(se, D, this.getToken).catch(() => null))
      ), oe = /* @__PURE__ */ new Map();
      for (const se of q.flatMap((Te) => (Te == null ? void 0 : Te.properties) ?? []))
        oe.has(se.alias) || oe.set(se.alias, se);
      const ge = q.filter((se) => se !== null), ve = [...new Set(ge.flatMap((se) => se.targetDocTypes.map((Te) => Te.name)))], si = ge.some((se) => se.inference === "all") ? "all" : (Li = ge[0]) == null ? void 0 : Li.inference;
      return { prefix: D, properties: [...oe.values()], caption: am(ve, si) };
    }));
    n = [];
    for (const D of S)
      D.properties.length !== 0 && (o[D.prefix] = D.properties, s[D.prefix] = D.caption, p < ws && n.push(...D.properties.filter((q) => q.classification === "content" && !q.isSystem).map((q) => `${D.prefix}.${q.alias}`)));
  }
  return c(this, $i).setValue(s), o;
}, xs = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((s) => Dh(s, this.getToken).catch(() => []))
  ), o = /* @__PURE__ */ new Map();
  for (const s of a.flat())
    o.has(s.alias) || o.set(s.alias, s);
  return [...o.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Ne = function(i, a = !0) {
  const o = this._data.getCurrent();
  if (!o) return;
  a && c(this, pe).push(o);
  const s = i(structuredClone(o));
  E(this, T, Ct).call(this, s);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
Ct = function(i, a) {
  a != null && a.resetHistory && c(this, pe).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, wi).setValue(i.layers), E(this, T, ks).call(this);
}, ks = function() {
  c(this, Di).setValue(c(this, pe).canUndo), c(this, Si).setValue(c(this, pe).canRedo);
}, qa = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, Dc = function(i) {
  try {
    i ? localStorage.setItem(E(this, T, qa).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(E(this, T, qa).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
Sc = function() {
  let i;
  try {
    const a = localStorage.getItem(E(this, T, qa).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  c(this, Wt).setValue(i), c(this, ft).setValue(!i);
}, Ec = async function(i, a) {
  const o = await this.getContext(ot).catch(() => {
  });
  o && (a ? o.dispatchEvent(new ii({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : o.dispatchEvent(new un({ entityType: "di-template", unique: i.key })));
}, Ds = function(i, a) {
  var s;
  const o = a instanceof Ht ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (s = c(this, Ut)) == null || s.peek("danger", { data: { headline: i, message: o } });
};
const Dt = new at(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), He = "di-template-root", W = "di-template-folder", j = Wo, Pt = "DynamicImages.Tree.Templates", pi = "DynamicImages.Repository.TemplateTree", Yi = "DynamicImages.Repository.TemplateFolder", rm = "DynamicImages.Store.TemplateFolder", mo = "DynamicImages.Workspace.TemplateFolder", Ic = "DynamicImages.Workspace.TemplateRoot", Qo = "DynamicImages.Repository.TemplateItem", lm = "DynamicImages.Store.TemplateItem", es = "DynamicImages.Repository.TemplateDetail", cm = "DynamicImages.Store.TemplateDetail", Or = "DynamicImages.Repository.MoveTemplate", Cr = "DynamicImages.Repository.MoveTemplateFolder", Ar = "DynamicImages.Repository.DuplicateTemplate", Fr = "DynamicImages.Repository.BulkMoveTemplates", Pr = "DynamicImages.Repository.BulkDuplicateTemplates", Rr = "DynamicImages.Repository.SortTemplateChildren", gn = "icon-picture", vn = "icon-picture color-grey", Oc = "icon-folder", yo = "DynamicImages.Collection.Templates", Mr = "DynamicImages.Repository.TemplateCollection";
async function w(e, t) {
  const i = (async () => {
    const a = await new Sp(e, Ae).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (o) {
      throw o instanceof Ht ? { type: "error", title: o.message, status: o.status, detail: o.detail } : o;
    }
  })();
  return await Lp(e, i);
}
var gt;
class um {
  constructor(t) {
    k(this, gt);
    _(this, gt, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: W,
      unique: Hl.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await w(c(this, gt), (o) => Qp(t, o));
    return i ? { data: { entityType: W, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: o } = await w(c(this, gt), (s) => Zp({ key: a, name: t.name, parentKey: i }, s));
    return o ? { error: o } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await w(c(this, gt), (o) => eh(i, t.name, o));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return w(c(this, gt), (i) => nc(t, i));
  }
}
gt = new WeakMap();
const bn = new at("DiTemplateFolderStore");
class Cc extends ka {
  constructor(t) {
    super(t, bn);
  }
}
class Lr extends xa {
  constructor(t) {
    super(t, um, bn);
  }
}
const dm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: bn,
  DiTemplateFolderRepository: Lr,
  DiTemplateFolderStore: Cc,
  api: Lr
}, Symbol.toStringTag, { value: "Module" })), pm = [
  {
    type: "repository",
    alias: Yi,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => dm)
  },
  {
    type: "store",
    alias: rm,
    name: "Dynamic Images Template Folder Store",
    api: Cc
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [W],
    meta: { folderRepositoryAlias: Yi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [W],
    meta: { folderRepositoryAlias: Yi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: mo,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => Xm),
    meta: { entityType: W }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: ia,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: mo }]
  }
], hm = [
  {
    type: "repository",
    alias: pi,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => Qm)
  },
  {
    type: "tree",
    kind: "default",
    alias: Pt,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: pi }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [He, W, j]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: Pt, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: Ic,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: He, headline: "Templates" }
  },
  ...pm
], _n = new at("DiTemplateItemStore");
class Ac extends Yl {
  constructor(t) {
    super(t, _n);
  }
}
class mm extends Gl {
  constructor(t) {
    super(t, {
      getItems: (i) => w(t, (a) => No(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? W : j,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class zr extends ql {
  constructor(t) {
    super(t, mm, _n);
  }
}
const ym = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: _n,
  DiTemplateItemRepository: zr,
  DiTemplateItemStore: Ac,
  api: zr
}, Symbol.toStringTag, { value: "Module" })), wn = new at("DiTemplateDetailStore");
class Fc extends ka {
  constructor(t) {
    super(t, wn);
  }
}
const ts = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var Oi;
class fm {
  constructor(t) {
    k(this, Oi);
    this.createScaffold = ts, this.create = ts, this.update = ts, _(this, Oi, t);
  }
  async read(t) {
    const { data: i, error: a } = await w(c(this, Oi), (o) => hn(t, o));
    return i ? { data: { entityType: j, unique: i.key, name: i.name } } : { error: a };
  }
  /**
   * A template, or a folder: the collection's bulk Delete sends every selected key here, and a
   * selection can hold both. A folder that is not empty is refused by the server with a 409, which
   * core's bulk action shows as that item's error.
   */
  delete(t) {
    return w(c(this, Oi), async (i) => {
      const [a] = await No([t], i);
      return (a == null ? void 0 : a.entityType) === "folder" ? nc(t, i) : jp(t, i);
    });
  }
}
Oi = new WeakMap();
class Wr extends xa {
  constructor(t) {
    super(t, fm, wn);
  }
}
const gm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: wn,
  DiTemplateDetailRepository: Wr,
  DiTemplateDetailStore: Fc,
  api: Wr
}, Symbol.toStringTag, { value: "Module" })), ri = [He, W], is = [{ alias: "Umb.Condition.CollectionAlias", match: yo }], vm = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: Qo,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => ym)
  },
  {
    type: "itemStore",
    alias: lm,
    name: "Dynamic Images Template Item Store",
    api: Ac
  },
  {
    type: "repository",
    alias: es,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => gm)
  },
  {
    type: "store",
    alias: cm,
    name: "Dynamic Images Template Detail Store",
    api: Fc
  },
  {
    type: "repository",
    alias: Or,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => iy)
  },
  {
    type: "repository",
    alias: Cr,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => ay)
  },
  {
    type: "repository",
    alias: Ar,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => oy)
  },
  {
    type: "repository",
    alias: Rr,
    name: "Dynamic Images Sort Template Children Repository",
    api: () => Promise.resolve().then(() => sy)
  },
  {
    type: "repository",
    alias: Fr,
    name: "Dynamic Images Bulk Move Templates Repository",
    api: () => Promise.resolve().then(() => ly)
  },
  {
    type: "repository",
    alias: Pr,
    name: "Dynamic Images Bulk Duplicate Templates Repository",
    api: () => Promise.resolve().then(() => cy)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: ri,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => uy),
    forEntityTypes: ri,
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
    forEntityTypes: ri,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Yi
    }
  },
  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [j],
    meta: {
      treeRepositoryAlias: pi,
      moveRepositoryAlias: Or,
      treeAlias: Pt,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Template To",
    forEntityTypes: [j],
    meta: {
      duplicateRepositoryAlias: Ar,
      treeRepositoryAlias: pi,
      treeAlias: Pt,
      foldersOnly: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Enable",
    name: "Enable Dynamic Images Template",
    api: () => Promise.resolve().then(() => dy),
    forEntityTypes: [j],
    weight: 560,
    meta: { icon: "icon-check", label: "Enable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Disable",
    name: "Disable Dynamic Images Template",
    api: () => Promise.resolve().then(() => py),
    forEntityTypes: [j],
    weight: 550,
    meta: { icon: "icon-block", label: "Disable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => hy),
    forEntityTypes: [j],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => yy),
    forEntityTypes: [j],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [j],
    meta: {
      itemRepositoryAlias: Qo,
      detailRepositoryAlias: es,
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
      treeRepositoryAlias: pi,
      moveRepositoryAlias: Cr,
      treeAlias: Pt,
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
    api: () => Promise.resolve().then(() => vy),
    forEntityTypes: ri,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "sortChildrenOf",
    alias: "DynamicImages.EntityAction.Template.SortChildren",
    name: "Sort Dynamic Images Templates",
    forEntityTypes: ri,
    meta: {
      sortChildrenOfRepositoryAlias: Rr,
      treeRepositoryAlias: pi
    }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: ri
  },
  // ---------------------------------------------------------------- collection selection
  // Any of these applying is what turns on the collection's checkboxes.
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Template.MoveTo",
    name: "Move Dynamic Images Templates",
    forEntityTypes: [j, W],
    meta: {
      bulkMoveRepositoryAlias: Fr,
      treeAlias: Pt,
      foldersOnly: !0
    },
    conditions: is
  },
  {
    type: "entityBulkAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityBulkAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Templates To",
    forEntityTypes: [j, W],
    meta: {
      bulkDuplicateRepositoryAlias: Pr,
      treeAlias: Pt,
      foldersOnly: !0
    },
    conditions: is
  },
  {
    type: "entityBulkAction",
    kind: "delete",
    alias: "DynamicImages.EntityBulkAction.Template.Delete",
    name: "Delete Dynamic Images Templates",
    forEntityTypes: [j, W],
    meta: {
      itemRepositoryAlias: Qo,
      detailRepositoryAlias: es
    },
    conditions: is
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => xy)
  }
], za = [{ alias: "Umb.Condition.CollectionAlias", match: yo }], bm = [
  {
    type: "repository",
    alias: Mr,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => ky)
  },
  {
    type: "collection",
    kind: "default",
    alias: yo,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => Dy),
    meta: { repositoryAlias: Mr }
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
        { field: "isEnabled", label: "Enabled", valueType: Ep },
        { field: "updated", label: "Last updated", valueType: Ip }
      ]
    },
    conditions: za
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: za
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => Oy),
    forEntityTypes: [j]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: za
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: za
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
      collectionAlias: yo
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [Ic, mo]
      }
    ]
  }
], xt = "di-font-root", ie = "di-font-folder", G = "di-font-family", Xe = "di-font", Hi = "DynamicImages.Tree.Fonts", Xi = "DynamicImages.Repository.FontTree", Ji = "DynamicImages.Repository.FontFolder", _m = "DynamicImages.Store.FontFolder", fo = "DynamicImages.Workspace.FontFolder", Pc = "DynamicImages.Workspace.FontRoot", go = "DynamicImages.Workspace.FontFamily", Ga = "DynamicImages.Workspace.Font", Wa = "DynamicImages.Repository.FontItem", wm = "DynamicImages.Store.FontItem", $n = "DynamicImages.Repository.FontDetail", $m = "DynamicImages.Store.FontDetail", Tn = "DynamicImages.Repository.FontFamilyDetail", Tm = "DynamicImages.Store.FontFamilyDetail", Ua = "DynamicImages.Repository.FontReference", Ur = "DynamicImages.Repository.MoveFontFamily", Nr = "DynamicImages.Repository.MoveFontFolder", Br = "DynamicImages.Repository.BulkMoveFonts", jr = "DynamicImages.Repository.SortFontChildren", Kr = "DynamicImages.Repository.FontBulkDelete", Vr = "DynamicImages.Condition.IsWebFont", vo = "DynamicImages.Collection.Fonts", as = "DynamicImages.Repository.FontCollection", Ss = "DynamicImages.Collection.FontVariants", xm = "icon-folder", km = "icon-font", Dm = "icon-font color-grey", Sm = "icon-cloud";
function xn(e) {
  switch (e) {
    case "folder":
      return ie;
    case "family":
      return G;
    default:
      return Xe;
  }
}
function kn(e, t) {
  switch (e) {
    case "folder":
      return xm;
    case "family":
      return km;
    default:
      return t ? Sm : Dm;
  }
}
const Em = [
  {
    type: "repository",
    alias: Xi,
    name: "Dynamic Images Font Tree Repository",
    api: () => Promise.resolve().then(() => Fy)
  },
  {
    type: "tree",
    kind: "default",
    alias: Hi,
    name: "Dynamic Images Font Tree",
    meta: { repositoryAlias: Xi }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Fonts",
    name: "Dynamic Images Font Tree Item",
    forEntityTypes: [xt, ie, G, Xe]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Fonts",
    name: "Dynamic Images Fonts Menu Item",
    weight: 100,
    meta: { label: "Fonts", treeAlias: Hi, menus: ["DynamicImages.Menu"] }
  },
  {
    type: "workspace",
    kind: "default",
    alias: Pc,
    name: "Dynamic Images Fonts Root Workspace",
    meta: { entityType: xt, headline: "Fonts" }
  }
];
var vt;
class Im {
  constructor(t) {
    k(this, vt);
    _(this, vt, t);
  }
  async createScaffold(t) {
    return { data: { entityType: ie, unique: Hl.new(), name: "", ...t } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await w(c(this, vt), (o) => vh(t, o));
    return i ? { data: { entityType: ie, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: o } = await w(c(this, vt), (s) => gh({ key: a, name: t.name, parentKey: i }, s));
    return o ? { error: o } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await w(c(this, vt), (o) => bh(i, t.name, o));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return w(c(this, vt), (i) => cc(t, i));
  }
}
vt = new WeakMap();
const Dn = new at("DiFontFolderStore");
class Rc extends ka {
  constructor(t) {
    super(t, Dn);
  }
}
class qr extends xa {
  constructor(t) {
    super(t, Im, Dn);
  }
}
const Om = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FOLDER_STORE_CONTEXT: Dn,
  DiFontFolderRepository: qr,
  DiFontFolderStore: Rc,
  api: qr
}, Symbol.toStringTag, { value: "Module" })), Cm = [
  {
    type: "repository",
    alias: Ji,
    name: "Dynamic Images Font Folder Repository",
    api: () => Promise.resolve().then(() => Om)
  },
  {
    type: "store",
    alias: _m,
    name: "Dynamic Images Font Folder Store",
    api: Rc
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.FontFolder.Rename",
    name: "Rename Dynamic Images Font Folder",
    forEntityTypes: [ie],
    meta: { folderRepositoryAlias: Ji }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.FontFolder.Delete",
    name: "Delete Dynamic Images Font Folder",
    forEntityTypes: [ie],
    meta: { folderRepositoryAlias: Ji }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: fo,
    name: "Dynamic Images Font Folder Workspace",
    api: () => Promise.resolve().then(() => Py),
    meta: { entityType: ie }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.FontFolder.Submit",
    name: "Save Dynamic Images Font Folder",
    api: ia,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: fo }]
  }
], Gr = [{ alias: "Umb.Condition.CollectionAlias", match: vo }], Yr = [{ alias: "Umb.Condition.CollectionAlias", match: Ss }], Hr = (e, t) => [
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
], Am = [
  {
    type: "repository",
    alias: as,
    name: "Dynamic Images Font Collection Repository",
    api: () => Promise.resolve().then(() => My)
  },
  {
    type: "collection",
    kind: "default",
    alias: vo,
    name: "Dynamic Images Font Collection",
    api: () => Promise.resolve().then(() => $l),
    meta: { repositoryAlias: as }
  },
  {
    type: "collection",
    kind: "default",
    alias: Ss,
    name: "Dynamic Images Font Variant Collection",
    api: () => Promise.resolve().then(() => $l),
    meta: { repositoryAlias: as }
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
    conditions: Gr
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
    conditions: Yr
  },
  ...Hr("Fonts", Gr),
  ...Hr("FontVariants", Yr),
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Font",
    name: "Dynamic Images Font Card",
    element: () => Promise.resolve().then(() => Ny),
    forEntityTypes: [ie, G, Xe]
  },
  // ---------------------------------------------------------------- where they show
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Fonts.Collection",
    name: "Dynamic Images Fonts Collection Workspace View",
    meta: { label: "Fonts", pathname: "fonts", icon: "icon-grid", collectionAlias: vo },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", oneOf: [Pc, fo] }]
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.FontVariants.Collection",
    name: "Dynamic Images Font Variants Collection Workspace View",
    meta: { label: "Variants", pathname: "variants", icon: "icon-font", collectionAlias: Ss },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: go }]
  }
];
function Sn(e) {
  return {
    unique: e.key,
    entityType: xn(e.entityType),
    name: e.name,
    icon: kn(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
const En = new at("DiFontItemStore");
class Mc extends Yl {
  constructor(t) {
    super(t, En);
  }
}
class Fm extends Gl {
  constructor(t) {
    super(t, {
      getItems: (i) => w(t, (a) => Bo(i, a)),
      mapper: Sn
    });
  }
}
class Xr extends ql {
  constructor(t) {
    super(t, Fm, En);
  }
}
const Pm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_ITEM_STORE_CONTEXT: En,
  DiFontItemRepository: Xr,
  DiFontItemStore: Mc,
  api: Xr,
  mapFontItem: Sn
}, Symbol.toStringTag, { value: "Module" })), Et = [xt, ie], Jr = [{ alias: "Umb.Condition.CollectionAlias", match: vo }], It = (e, t, i) => ({ type: "repository", alias: e, name: t, api: i }), Rm = [
  // ---------------------------------------------------------------- repositories
  It(Wa, "Dynamic Images Font Item Repository", () => Promise.resolve().then(() => Pm)),
  { type: "itemStore", alias: wm, name: "Dynamic Images Font Item Store", api: Mc },
  It(
    Ua,
    "Dynamic Images Font Reference Repository",
    () => Promise.resolve().then(() => By)
  ),
  It(
    Kr,
    "Dynamic Images Font Bulk Delete Repository",
    () => Promise.resolve().then(() => jy)
  ),
  It(
    Ur,
    "Dynamic Images Move Font Family Repository",
    () => Promise.resolve().then(() => Gy)
  ),
  It(
    Nr,
    "Dynamic Images Move Font Folder Repository",
    () => Promise.resolve().then(() => Yy)
  ),
  It(
    Br,
    "Dynamic Images Bulk Move Fonts Repository",
    () => Promise.resolve().then(() => Hy)
  ),
  It(
    jr,
    "Dynamic Images Sort Font Children Repository",
    () => Promise.resolve().then(() => Xy)
  ),
  {
    type: "condition",
    alias: Vr,
    name: "Dynamic Images Is Web Font Condition",
    api: () => Promise.resolve().then(() => Jy)
  },
  // How the delete modal draws each template still using a font. Cast because 17.5 declares the
  // entityItemRef manifest type in a file no public entry point imports - the folder create
  // option's problem again. The extension type itself is registered and resolved by entity type.
  {
    type: "entityItemRef",
    alias: "DynamicImages.EntityItemRef.Template",
    name: "Dynamic Images Template Item Ref",
    element: () => Promise.resolve().then(() => ef),
    forEntityTypes: [j]
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Font.Create",
    name: "Create Dynamic Images Font",
    weight: 1200,
    forEntityTypes: [...Et, G],
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Add to Fonts" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Upload",
    name: "Upload a Dynamic Images Font File",
    weight: 100,
    api: () => Promise.resolve().then(() => nf),
    forEntityTypes: Et,
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
    api: () => Promise.resolve().then(() => rf),
    forEntityTypes: Et,
    meta: { icon: "icon-cloud", label: "Web font", description: "From Google Fonts, Bunny Fonts or a file URL" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Path",
    name: "Register a Dynamic Images Font Path",
    weight: 80,
    api: () => Promise.resolve().then(() => lf),
    forEntityTypes: Et,
    meta: { icon: "icon-font", label: "Font from path", description: "A font file already in the site's wwwroot" }
  },
  // Cast for the same reason as the template folder option in entity-actions/manifests.ts.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.FontFolder",
    name: "Dynamic Images Font Folder Create Option",
    weight: 70,
    forEntityTypes: Et,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Ji
    }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.AddVariant",
    name: "Add a Variant to a Dynamic Images Font Family",
    weight: 100,
    api: () => Promise.resolve().then(() => cf),
    forEntityTypes: [G],
    meta: { icon: "icon-add", label: "Add variant", description: "Another weight or slant of this family" }
  },
  // ---------------------------------------------------------------- family
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.FontFamily.MoveTo",
    name: "Move Dynamic Images Font Family",
    forEntityTypes: [G],
    meta: {
      treeRepositoryAlias: Xi,
      moveRepositoryAlias: Ur,
      treeAlias: Hi,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.FontFamily.Rename",
    name: "Rename Dynamic Images Font Family",
    api: () => Promise.resolve().then(() => uf),
    forEntityTypes: [G],
    weight: 650,
    meta: { icon: "icon-edit", label: "#actions_rename", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityAction.FontFamily.Delete",
    name: "Delete Dynamic Images Font Family",
    forEntityTypes: [G],
    meta: {
      itemRepositoryAlias: Wa,
      detailRepositoryAlias: Tn,
      referenceRepositoryAlias: Ua
    }
  },
  // ---------------------------------------------------------------- variant
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Font.Refresh",
    name: "Refresh a Dynamic Images Web Font",
    api: () => Promise.resolve().then(() => df),
    forEntityTypes: [Xe],
    weight: 500,
    meta: { icon: "icon-sync", label: "Refresh", additionalOptions: !0 },
    conditions: [{ alias: Vr }]
  },
  {
    type: "entityAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityAction.Font.Delete",
    name: "Delete a Dynamic Images Font",
    forEntityTypes: [Xe],
    meta: {
      itemRepositoryAlias: Wa,
      detailRepositoryAlias: $n,
      referenceRepositoryAlias: Ua
    }
  },
  // ---------------------------------------------------------------- folder
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.FontFolder.MoveTo",
    name: "Move Dynamic Images Font Folder",
    forEntityTypes: [ie],
    meta: {
      treeRepositoryAlias: Xi,
      moveRepositoryAlias: Nr,
      treeAlias: Hi,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  // ---------------------------------------------------------------- root and folder
  {
    type: "entityAction",
    kind: "sortChildrenOf",
    alias: "DynamicImages.EntityAction.Font.SortChildren",
    name: "Sort Dynamic Images Fonts",
    forEntityTypes: Et,
    meta: {
      sortChildrenOfRepositoryAlias: jr,
      treeRepositoryAlias: Xi
    }
  },
  // ---------------------------------------------------------------- collection selection
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Font.MoveTo",
    name: "Move Dynamic Images Fonts",
    forEntityTypes: [ie, G],
    meta: { bulkMoveRepositoryAlias: Br, treeAlias: Hi, foldersOnly: !0 },
    conditions: Jr
  },
  {
    type: "entityBulkAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityBulkAction.Font.Delete",
    name: "Delete Dynamic Images Fonts",
    forEntityTypes: [ie, G],
    meta: {
      itemRepositoryAlias: Wa,
      detailRepositoryAlias: Kr,
      referenceRepositoryAlias: Ua
    },
    conditions: Jr
  },
  // ---------------------------------------------------------------- reload
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Font.ReloadChildren",
    name: "Reload Dynamic Images Fonts",
    forEntityTypes: [...Et, G]
  }
], In = new at("DiFontFamilyDetailStore");
class Lc extends ka {
  constructor(t) {
    super(t, In);
  }
}
const Zr = () => Promise.resolve({ error: new Error("A font family is created by adding a font.") });
var Bt;
class Mm {
  constructor(t) {
    k(this, Bt);
    this.createScaffold = Zr, this.create = Zr, _(this, Bt, t);
  }
  async read(t) {
    const { data: i, error: a } = await w(c(this, Bt), (o) => _h(t, o));
    return i ? { data: { entityType: G, unique: i.key, name: i.name } } : { error: a };
  }
  /** A rename: the server carries it onto every variant's family name. */
  async update(t) {
    const { error: i } = await w(c(this, Bt), (a) => wh(t.unique, t.name, a));
    return i ? { error: i } : this.read(t.unique);
  }
  delete(t) {
    return w(c(this, Bt), (i) => uc(t, i));
  }
}
Bt = new WeakMap();
class Qr extends xa {
  constructor(t) {
    super(t, Mm, In);
  }
}
const Lm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FAMILY_DETAIL_STORE_CONTEXT: In,
  DiFontFamilyDetailRepository: Qr,
  DiFontFamilyDetailStore: Lc,
  api: Qr
}, Symbol.toStringTag, { value: "Module" })), zm = {
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
function bo(e, t) {
  const i = zm[e], a = i ? `${i} ${e}` : String(e);
  return t ? `${a} Italic` : a;
}
const On = new at("DiFontDetailStore");
class zc extends ka {
  constructor(t) {
    super(t, On);
  }
}
const el = () => Promise.resolve({ error: new Error("A font is added from the Fonts tree's Create….") });
function Es(e) {
  return {
    entityType: Xe,
    unique: e.key,
    name: bo(e.weight, e.isItalic),
    font: e,
    weight: e.weight,
    isItalic: e.isItalic,
    styles: e.styles
  };
}
var jt;
class Wm {
  constructor(t) {
    k(this, jt);
    this.createScaffold = el, this.create = el, _(this, jt, t);
  }
  async read(t) {
    const { data: i, error: a } = await w(c(this, jt), (o) => nh(t, o));
    return i ? { data: Es(i) } : { error: a };
  }
  /** The named styles, weight and slant. The family name is the family's, so it goes back unchanged. */
  async update(t) {
    const { data: i, error: a } = await w(c(this, jt), (o) => dh(t.unique, t.font.familyName, t.styles, o, { weight: t.weight, isItalic: t.isItalic }));
    return i ? { data: Es(i) } : { error: a };
  }
  delete(t) {
    return w(c(this, jt), (i) => rc(t, i));
  }
}
jt = new WeakMap();
class tl extends xa {
  constructor(t) {
    super(t, Wm, On);
  }
}
const Um = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_DETAIL_STORE_CONTEXT: On,
  DiFontDetailRepository: tl,
  DiFontDetailStore: zc,
  api: tl,
  toDetail: Es,
  variantName: bo
}, Symbol.toStringTag, { value: "Module" })), il = (e, t) => ({
  type: "workspaceAction",
  kind: "default",
  alias: e,
  name: `Save ${t}`,
  api: ia,
  meta: { label: "#buttons_save", look: "primary", color: "positive" },
  conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: t }]
}), Nm = [
  // ---------------------------------------------------------------- family
  {
    type: "repository",
    alias: Tn,
    name: "Dynamic Images Font Family Detail Repository",
    api: () => Promise.resolve().then(() => Lm)
  },
  {
    type: "store",
    alias: Tm,
    name: "Dynamic Images Font Family Detail Store",
    api: Lc
  },
  {
    type: "workspace",
    kind: "routable",
    alias: go,
    name: "Dynamic Images Font Family Workspace",
    api: () => Promise.resolve().then(() => pf),
    meta: { entityType: G }
  },
  il("DynamicImages.WorkspaceAction.FontFamily.Submit", go),
  // ---------------------------------------------------------------- variant
  {
    type: "repository",
    alias: $n,
    name: "Dynamic Images Font Detail Repository",
    api: () => Promise.resolve().then(() => Um)
  },
  {
    type: "store",
    alias: $m,
    name: "Dynamic Images Font Detail Store",
    api: zc
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Ga,
    name: "Dynamic Images Font Workspace",
    api: () => Promise.resolve().then(() => hf),
    meta: { entityType: Xe }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Font",
    name: "Dynamic Images Font View",
    element: () => Promise.resolve().then(() => bf),
    weight: 100,
    meta: { label: "Font", pathname: "font", icon: "icon-font" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Ga }]
  },
  il("DynamicImages.WorkspaceAction.Font.Submit", Ga)
], Bm = [
  ...Em,
  ...Cm,
  ...Am,
  ...Rm,
  ...Nm
], jm = [
  ...hm,
  ...vm,
  ...bm,
  ...Bm,
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
    element: () => Promise.resolve().then(() => Tf),
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
    element: () => Promise.resolve().then(() => Sf),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Cf),
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
    api: nm,
    meta: { entityType: Wo }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => iv),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => nv),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => dv),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => fv),
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
    api: () => Promise.resolve().then(() => gv),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => vv),
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
    api: () => Promise.resolve().then(() => bv),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => _v),
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
    element: () => Promise.resolve().then(() => Sv)
  }
], mb = (e, t) => {
  t.registerMany(jm);
};
var Km = Object.defineProperty, Vm = Object.getOwnPropertyDescriptor, Wc = (e) => {
  throw TypeError(e);
}, Cn = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Vm(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Km(t, i, o), o;
}, An = (e, t, i) => t.has(e) || Wc("Cannot " + i), qm = (e, t, i) => (An(e, t, "read from private field"), t.get(e)), al = (e, t, i) => t.has(e) ? Wc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gm = (e, t, i, a) => (An(e, t, "write to private field"), t.set(e, i), i), Ym = (e, t, i) => (An(e, t, "access private method"), i), _o, Is, Uc;
let Jt = class extends C {
  constructor() {
    super(), al(this, Is), al(this, _o), this._name = "", this._loading = !0, this.consumeContext(Dt, (e) => {
      Gm(this, _o, e), e && (this.observe(e.template, (t) => {
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
            @input=${Ym(this, Is, Uc)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : h}
    `;
  }
};
_o = /* @__PURE__ */ new WeakMap();
Is = /* @__PURE__ */ new WeakSet();
Uc = function(e) {
  var i;
  const t = e.target.value;
  (i = qm(this, _o)) == null || i.updateTemplateFields({ name: t });
};
Jt.styles = F`
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
Cn([
  y()
], Jt.prototype, "_name", 2);
Cn([
  y()
], Jt.prototype, "_loading", 2);
Jt = Cn([
  O("di-template-editor")
], Jt);
const Hm = Jt, os = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Jt;
  },
  default: Hm
}, Symbol.toStringTag, { value: "Module" }));
class ol extends cn {
  constructor(t) {
    super(t, {
      workspaceAlias: mo,
      entityType: W,
      detailRepositoryAlias: Yi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => _p),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Xm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: ol,
  api: ol
}, Symbol.toStringTag, { value: "Module" }));
function ss(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function Jm(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? W : He
    },
    name: e.name,
    entityType: t ? W : j,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? Oc : e.isEnabled ? gn : vn,
    isEnabled: e.isEnabled
  };
}
class Zm extends Jl {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: o } = ss(i);
        return w(t, (s) => Tr(a, o, i.foldersOnly ?? !1, s));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = ss(i);
          return w(t, (p) => Tr(n, l, i.foldersOnly ?? !1, p));
        }
        const a = i.parent.unique, { skip: o, take: s } = ss(i);
        return w(t, (n) => Yp(a, o, s, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => w(t, (a) => Hp(i.treeItem.unique, a)),
      mapper: Jm
    });
  }
}
class sl extends Zl {
  constructor(t) {
    super(t, Zm);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: He,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const Qm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: sl,
  api: sl
}, Symbol.toStringTag, { value: "Module" }));
class Nc extends Ue {
  async requestMoveTo(t) {
    const { error: i } = await w(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(N);
      a == null || a.peek("positive", { data: { message: "Moved" } });
      const o = await this.getContext(ot).catch(() => {
      }), s = t.destination.unique;
      o == null || o.dispatchEvent(new ii({
        entityType: s ? W : He,
        unique: s
      }));
    }
    return { error: i };
  }
}
class ey extends Nc {
  constructor() {
    super(...arguments), this.move = th;
  }
}
class ty extends Nc {
  constructor() {
    super(...arguments), this.move = ih;
  }
}
const iy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ey
}, Symbol.toStringTag, { value: "Module" })), ay = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ty
}, Symbol.toStringTag, { value: "Module" }));
class nl extends Ue {
  async requestDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: o } = await w(this, (s) => Kp(t.unique, i, s));
    if (a) {
      const s = await this.getContext(N);
      s == null || s.peek("positive", { data: { message: `'${a.template.name}' created` } });
      const n = await this.getContext(ot).catch(() => {
      });
      n == null || n.dispatchEvent(new ii({
        entityType: i ? W : He,
        unique: i
      }));
    }
    return { error: o };
  }
}
const oy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateToTemplateRepository: nl,
  api: nl
}, Symbol.toStringTag, { value: "Module" }));
class rl extends Ue {
  async sortChildrenOf(t) {
    const i = t.sorting.map((o) => ({ key: o.unique, sortOrder: o.sortOrder })), { error: a } = await w(this, (o) => sh(t.unique, i, o));
    if (!a) {
      const o = await this.getContext(N);
      o == null || o.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const sy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortTemplateChildrenRepository: rl,
  api: rl
}, Symbol.toStringTag, { value: "Module" })), Bc = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
class jc extends Ue {
  async reloadDestination(t) {
    const i = await this.getContext(ot).catch(() => {
    });
    i == null || i.dispatchEvent(new ii({
      entityType: t ? W : He,
      unique: t
    }));
  }
  async notify(t, i) {
    const a = await this.getContext(N);
    a == null || a.peek(t, { data: { message: i } });
  }
}
class ny extends jc {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await w(this, (o) => ah(t.uniques, i, o));
    return await this.reloadDestination(i), a || await this.notify("positive", `Moved ${Bc(t.uniques.length, "item")}`), { error: a };
  }
}
class ry extends jc {
  async requestBulkDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: o } = await w(this, (s) => oh(t.uniques, i, s));
    return a ? (await this.reloadDestination(i), a.created.length > 0 && await this.notify("positive", `Copied ${Bc(a.created.length, "template")}`), a.skippedFolders.length > 0 && await this.notify("warning", `Folders are not copied: ${a.skippedFolders.join(", ")}`), a.errors.length > 0 && await this.notify("warning", a.errors.join(" ")), {}) : { error: o };
  }
}
const ly = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ny
}, Symbol.toStringTag, { value: "Module" })), cy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ry
}, Symbol.toStringTag, { value: "Module" }));
class ll extends Ql {
  async getHref() {
    return Ph({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const uy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: ll,
  api: ll
}, Symbol.toStringTag, { value: "Module" }));
class Fn extends ai {
  async execute() {
    var m;
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await w(this, (S) => Vp(t, this.enable, S));
    if (a || !i) throw a ?? new Error("The template could not be changed.");
    const { data: o } = await w(this, (S) => No([t], S)), s = ((m = o == null ? void 0 : o[0]) == null ? void 0 : m.name) ?? "The template", n = this.enable ? "enabled" : "disabled", l = await this.getContext(N);
    if (!i.changed) {
      l == null || l.peek("default", { data: { message: `'${s}' is already ${n}` } });
      return;
    }
    l == null || l.peek("positive", { data: { message: `'${s}' ${n}` } });
    const p = await this.getContext(ot).catch(() => {
    });
    p == null || p.dispatchEvent(new un({ unique: t, entityType: this.args.entityType })), yn();
  }
}
class cl extends Fn {
  constructor() {
    super(...arguments), this.enable = !0;
  }
}
const dy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiEnableTemplateEntityAction: cl,
  DiSetTemplateEnabledEntityAction: Fn,
  api: cl
}, Symbol.toStringTag, { value: "Module" }));
class ul extends Fn {
  constructor() {
    super(...arguments), this.enable = !1;
  }
}
const py = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDisableTemplateEntityAction: ul,
  api: ul
}, Symbol.toStringTag, { value: "Module" }));
class dl extends ai {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await w(this, async (n) => ({
      blob: await qp(t, n),
      alias: (await hn(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const o = URL.createObjectURL(i.blob), s = document.createElement("a");
    s.href = o, s.download = `${i.alias}.json`, s.click(), URL.revokeObjectURL(o);
  }
}
const hy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: dl,
  api: dl
}, Symbol.toStringTag, { value: "Module" })), my = 1500;
async function Kc(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((o) => setTimeout(o, my));
    try {
      a = await Eh(a.id, t);
    } catch {
      i == null || i.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }
  if (a.status === "completed") {
    const o = a.failures.length;
    i == null || i.peek(o > 0 ? "warning" : "positive", {
      data: {
        headline: "Regeneration finished",
        message: `${a.generated} generated, ${a.skipped} skipped${o > 0 ? `, ${o} failed` : ""}.`
      }
    });
    for (const s of a.failures.slice(0, 3))
      i == null || i.peek("danger", { data: { message: s } });
  } else
    i == null || i.peek("danger", {
      data: { headline: `Regeneration ${a.status}`, message: a.failures[0] ?? "" }
    });
}
class pl extends ai {
  async execute() {
    var p;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await w(this, (m) => No([t], m)), a = ((p = i == null ? void 0 : i[0]) == null ? void 0 : p.name) ?? "this template";
    await ec(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: o, error: s } = await w(this, (m) => yc(t, !1, m));
    if (s || !o) throw s ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(N);
    n == null || n.peek("positive", { data: { message: `Regenerating ${o.total} item(s)…` } });
    const l = await this.getContext(Ae);
    await Kc(o, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: pl,
  api: pl
}, Symbol.toStringTag, { value: "Module" })), fy = new tc(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), gy = new tc(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class hl extends ai {
  async execute() {
    const { json: t } = await dn(this, gy, { data: {} }), i = this.args.unique ?? null, { data: a, error: o } = await w(this, (l) => Gp(t, "create", l, i));
    if (o || !a) throw o ?? new Error("The template could not be imported.");
    const s = await this.getContext(N);
    s == null || s.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) s == null || s.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(ot);
    n == null || n.dispatchEvent(new ii({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const vy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: hl,
  api: hl
}, Symbol.toStringTag, { value: "Module" }));
var by = Object.defineProperty, _y = Object.getOwnPropertyDescriptor, Vc = (e) => {
  throw TypeError(e);
}, qc = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? _y(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && by(t, i, o), o;
}, wy = (e, t, i) => t.has(e) || Vc("Cannot " + i), $y = (e, t, i) => t.has(e) ? Vc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ml = (e, t, i) => (wy(e, t, "access private method"), i), Ya, Gc, Yc;
let Fi = class extends ic {
  constructor() {
    super(...arguments), $y(this, Ya), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${ml(this, Ya, Gc)} aria-label="Choose a file" />
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
            @click=${ml(this, Ya, Yc)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Ya = /* @__PURE__ */ new WeakSet();
Gc = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
Yc = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
Fi.styles = [
  F`
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
qc([
  y()
], Fi.prototype, "_json", 2);
Fi = qc([
  O("di-import-template-modal")
], Fi);
const Ty = Fi, xy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return Fi;
  },
  default: Ty
}, Symbol.toStringTag, { value: "Module" }));
function Hc(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? W : j,
    name: e.name,
    icon: t ? Oc : e.isEnabled ? gn : vn,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class yl extends Ue {
  async requestCollection(t = {}) {
    const i = await this.getContext(pn), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: o, error: s } = await w(this, (n) => Xp({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return o ? { data: { total: o.total, items: o.items.map(Hc) } } : { error: s };
  }
}
const ky = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: yl,
  api: yl,
  mapCollectionItem: Hc
}, Symbol.toStringTag, { value: "Module" }));
class fl extends ac {
  async requestItemHref(t) {
    return t.entityType === W ? Xt(W, t.unique) : Da(t.unique);
  }
}
const Dy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: fl,
  api: fl
}, Symbol.toStringTag, { value: "Module" }));
var Sy = Object.defineProperty, Ey = Object.getOwnPropertyDescriptor, Xc = (e) => {
  throw TypeError(e);
}, st = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ey(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Sy(t, i, o), o;
}, Pn = (e, t, i) => t.has(e) || Xc("Cannot " + i), wo = (e, t, i) => (Pn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Na = (e, t, i) => t.has(e) ? Xc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ha = (e, t, i, a) => (Pn(e, t, "write to private field"), t.set(e, i), i), ns = (e, t, i) => (Pn(e, t, "access private method"), i), $o, Ni, ra, Bi, Jc, Zc, Qc;
const Iy = 400;
let me = class extends C {
  constructor() {
    super(), Na(this, Bi), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, Na(this, $o), Na(this, Ni), Na(this, ra), this.consumeContext(Ae, (e) => {
      Ha(this, $o, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), Ha(this, Ni, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && ns(this, Bi, Jc).call(this);
    })), wo(this, Ni).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = wo(this, Ni)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, Ha(this, ra, void 0);
  }
  render() {
    return this.item ? r`
      <uui-card-media
        name=${this.item.name}
        detail=${aa(this.item.docTypes || void 0)}
        href=${aa(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${ns(this, Bi, Zc)}
        @deselected=${ns(this, Bi, Qc)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : h}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : h;
  }
};
$o = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
ra = /* @__PURE__ */ new WeakMap();
Bi = /* @__PURE__ */ new WeakSet();
Jc = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || wo(this, ra) === t)) {
    Ha(this, ra, t);
    try {
      const i = await Jp(e.unique, Iy, () => {
        var a;
        return (a = wo(this, $o)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
Zc = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new oc(this.item.unique)));
};
Qc = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new sc(this.item.unique)));
};
me.styles = [
  F`
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
st([
  g({ type: Object })
], me.prototype, "item", 2);
st([
  g({ type: Boolean })
], me.prototype, "selectable", 2);
st([
  g({ type: Boolean })
], me.prototype, "selected", 2);
st([
  g({ type: Boolean, attribute: "select-only" })
], me.prototype, "selectOnly", 2);
st([
  g({ type: Boolean })
], me.prototype, "disabled", 2);
st([
  g({ type: String })
], me.prototype, "href", 2);
st([
  y()
], me.prototype, "_src", 2);
st([
  y()
], me.prototype, "_failed", 2);
me = st([
  O("di-template-collection-card")
], me);
const Oy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return me;
  },
  get element() {
    return me;
  }
}, Symbol.toStringTag, { value: "Module" }));
function gl(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function Cy(e) {
  const t = e.parentKey ? e.entityType === "font" ? G : ie : xt;
  return {
    unique: e.key,
    parent: { unique: e.parentKey, entityType: t },
    name: e.name,
    entityType: xn(e.entityType),
    hasChildren: e.hasChildren,
    isFolder: e.entityType !== "font",
    icon: kn(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
class Ay extends Jl {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: o } = gl(i);
        return w(t, (s) => xr(a, o, i.foldersOnly ?? !1, s));
      },
      getChildrenOf: (i) => {
        const { skip: a, take: o } = gl(i);
        if (i.parent.unique === null)
          return w(t, (n) => xr(a, o, i.foldersOnly ?? !1, n));
        const s = i.parent.unique;
        return w(t, (n) => hh(s, a, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => w(t, (a) => mh(i.treeItem.unique, a)),
      mapper: Cy
    });
  }
}
class vl extends Zl {
  constructor(t) {
    super(t, Ay);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: xt,
      name: "Fonts",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const Fy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontTreeRepository: vl,
  api: vl
}, Symbol.toStringTag, { value: "Module" }));
class bl extends cn {
  constructor(t) {
    super(t, {
      workspaceAlias: fo,
      entityType: ie,
      detailRepositoryAlias: Ji
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        // The same element as a template folder's: core's editable folder header, nothing more.
        component: () => Promise.resolve().then(() => _p),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Py = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFolderWorkspaceContext: bl,
  api: bl
}, Symbol.toStringTag, { value: "Module" }));
function Ry(e) {
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
function eu(e) {
  return {
    unique: e.key,
    entityType: xn(e.entityType),
    name: e.name,
    icon: kn(e.entityType, e.sourceKind === "url"),
    isFolder: e.entityType === "folder",
    variants: e.variantCount === null ? "" : String(e.variantCount),
    usedBy: e.usedByTemplateCount === null ? "" : String(e.usedByTemplateCount),
    weight: e.weight === null ? "" : String(e.weight),
    style: e.isItalic === null ? "" : e.isItalic ? "Italic" : "Upright",
    source: Ry(e),
    sampleFontKey: e.sampleFontKey
  };
}
class _l extends Ue {
  async requestCollection(t = {}) {
    const i = await this.getContext(pn), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: o, error: s } = await w(this, (n) => yh({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return o ? { data: { total: o.total, items: o.items.map(eu) } } : { error: s };
  }
}
const My = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionRepository: _l,
  api: _l,
  mapFontCollectionItem: eu
}, Symbol.toStringTag, { value: "Module" }));
class wl extends ac {
  async requestItemHref(t) {
    return Xt(t.entityType, t.unique);
  }
}
const $l = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionContext: wl,
  api: wl
}, Symbol.toStringTag, { value: "Module" })), Os = /* @__PURE__ */ new Map(), Sa = (e) => `di-${e}`;
function Rn(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Os.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const o = await ph(e, t), s = new FontFace(Sa(e), o);
      return await s.load(), document.fonts.add(s), s;
    } catch (o) {
      console.warn("[DynamicImages] Could not load font", e, o);
      return;
    }
  })();
  return Os.set(e, a), a;
}
async function Ly(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => Rn(a, t)));
}
function zy(e) {
  Os.delete(e);
}
var Wy = Object.defineProperty, Uy = Object.getOwnPropertyDescriptor, tu = (e) => {
  throw TypeError(e);
}, St = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Uy(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Wy(t, i, o), o;
}, Mn = (e, t, i) => t.has(e) || tu("Cannot " + i), rs = (e, t, i) => (Mn(e, t, "read from private field"), t.get(e)), ls = (e, t, i) => t.has(e) ? tu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), iu = (e, t, i, a) => (Mn(e, t, "write to private field"), t.set(e, i), i), Ba = (e, t, i) => (Mn(e, t, "access private method"), i), To, Zi, ci, Cs, au, ou;
let $e = class extends C {
  constructor() {
    super(), ls(this, ci), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._loaded = !1, ls(this, To), ls(this, Zi), this.consumeContext(Ae, (e) => {
      iu(this, To, e), Ba(this, ci, Cs).call(this);
    });
  }
  willUpdate(e) {
    super.willUpdate(e), e.has("item") && Ba(this, ci, Cs).call(this);
  }
  render() {
    if (!this.item) return h;
    const e = this.item.isFolder ? void 0 : this.item.variants ? `${this.item.variants} variant${this.item.variants === "1" ? "" : "s"}` : [this.item.style, this.item.source].filter(Boolean).join(" · ");
    return r`
      <uui-card-media
        name=${this.item.name}
        detail=${aa(e)}
        href=${aa(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${Ba(this, ci, au)}
        @deselected=${Ba(this, ci, ou)}>
        ${this.item.sampleFontKey && this._loaded ? r`<div class="specimen" style="font-family: ${Sa(this.item.sampleFontKey)}, serif">Aa Bb</div>` : r`<umb-icon name=${this.item.icon}></umb-icon>`}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    `;
  }
};
To = /* @__PURE__ */ new WeakMap();
Zi = /* @__PURE__ */ new WeakMap();
ci = /* @__PURE__ */ new WeakSet();
Cs = function() {
  var i;
  const e = (i = this.item) == null ? void 0 : i.sampleFontKey, t = rs(this, To);
  !t || !e || rs(this, Zi) === e || (iu(this, Zi, e), this._loaded = !1, Rn(e, () => t.getLatestToken()).then((a) => {
    rs(this, Zi) === e && (this._loaded = !!a);
  }));
};
au = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new oc(this.item.unique)));
};
ou = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new sc(this.item.unique)));
};
$e.styles = [
  F`
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
St([
  g({ type: Object })
], $e.prototype, "item", 2);
St([
  g({ type: Boolean })
], $e.prototype, "selectable", 2);
St([
  g({ type: Boolean })
], $e.prototype, "selected", 2);
St([
  g({ type: Boolean, attribute: "select-only" })
], $e.prototype, "selectOnly", 2);
St([
  g({ type: Boolean })
], $e.prototype, "disabled", 2);
St([
  g({ type: String })
], $e.prototype, "href", 2);
St([
  y()
], $e.prototype, "_loaded", 2);
$e = St([
  O("di-font-collection-card")
], $e);
const Ny = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontCollectionCardElement() {
    return $e;
  },
  get element() {
    return $e;
  }
}, Symbol.toStringTag, { value: "Module" }));
class Tl extends Ue {
  async requestReferencedBy(t, i = 0, a = 20) {
    const { data: o, error: s } = await w(this, (l) => lc(t, i, a, l));
    if (!o) return { error: s };
    const n = o.items.map((l) => ({
      entityType: j,
      unique: l.key,
      name: l.name,
      isEnabled: l.isEnabled
    }));
    return { data: { total: o.total, items: n } };
  }
  /** Which of a bulk selection is in use - the fonts themselves, which the bulk modal names. */
  async requestAreReferenced(t, i = 0, a = 20) {
    const { data: o, error: s } = await w(this, (n) => fh(t, i, a, n));
    return o ? { data: { total: o.total, items: o.items.map(Sn) } } : { error: s };
  }
}
const By = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontReferenceRepository: Tl,
  api: Tl
}, Symbol.toStringTag, { value: "Module" }));
class xl extends Ue {
  delete(t) {
    return w(this, async (i) => {
      const [a] = await Bo([t], i);
      switch (a == null ? void 0 : a.entityType) {
        case "folder":
          return cc(t, i);
        case "family":
          return uc(t, i);
        default:
          return rc(t, i);
      }
    });
  }
}
const jy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontBulkDeleteRepository: xl,
  api: xl
}, Symbol.toStringTag, { value: "Module" }));
class su extends Ue {
  async moved(t, i) {
    if (i) {
      const o = await this.getContext(N);
      o == null || o.peek("positive", { data: { message: i } });
    }
    const a = await this.getContext(ot).catch(() => {
    });
    a == null || a.dispatchEvent(new ii({
      entityType: t ? ie : xt,
      unique: t
    }));
  }
}
class nu extends su {
  async requestMoveTo(t) {
    const i = t.destination.unique, { error: a } = await w(this, (o) => this.move(t.unique, i, o));
    return a || await this.moved(i, "Moved"), { error: a };
  }
}
class Ky extends nu {
  constructor() {
    super(...arguments), this.move = $h;
  }
}
class Vy extends nu {
  constructor() {
    super(...arguments), this.move = Th;
  }
}
class qy extends su {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await w(this, (o) => kh(t.uniques, i, o));
    return await this.moved(i, a ? void 0 : `Moved ${t.uniques.length} item${t.uniques.length === 1 ? "" : "s"}`), { error: a };
  }
}
const Gy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ky
}, Symbol.toStringTag, { value: "Module" })), Yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Vy
}, Symbol.toStringTag, { value: "Module" })), Hy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: qy
}, Symbol.toStringTag, { value: "Module" }));
class kl extends Ue {
  async sortChildrenOf(t) {
    const i = t.sorting.map((o) => ({ key: o.unique, sortOrder: o.sortOrder })), { error: a } = await w(this, (o) => xh(t.unique, i, o));
    if (!a) {
      const o = await this.getContext(N);
      o == null || o.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const Xy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortFontChildrenRepository: kl,
  api: kl
}, Symbol.toStringTag, { value: "Module" }));
class Dl extends Cp {
  constructor(t, i) {
    super(t, i), this.consumeContext(pn, (a) => {
      this.observe(a == null ? void 0 : a.unique, async (o) => {
        var n;
        if (!o) {
          this.permitted = !1;
          return;
        }
        const { data: s } = await w(this, (l) => Bo([o], l));
        this.permitted = ((n = s == null ? void 0 : s[0]) == null ? void 0 : n.isUrlFont) ?? !1;
      });
    });
  }
}
const Jy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiIsWebFontCondition: Dl,
  api: Dl
}, Symbol.toStringTag, { value: "Module" }));
var Zy = Object.defineProperty, Qy = Object.getOwnPropertyDescriptor, qo = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Qy(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Zy(t, i, o), o;
};
let Zt = class extends C {
  constructor() {
    super(...arguments), this.readonly = !1, this.standalone = !1;
  }
  render() {
    return this.item ? r`
      <uui-ref-node
        name=${this.item.name ?? "Template"}
        href=${Da(this.item.unique)}
        ?readonly=${this.readonly}
        ?standalone=${this.standalone}>
        <umb-icon slot="icon" name=${this.item.isEnabled === !1 ? vn : gn}></umb-icon>
        <slot name="actions" slot="actions"></slot>
      </uui-ref-node>
    ` : h;
  }
};
qo([
  g({ type: Object })
], Zt.prototype, "item", 2);
qo([
  g({ type: Boolean })
], Zt.prototype, "readonly", 2);
qo([
  g({ type: Boolean })
], Zt.prototype, "standalone", 2);
Zt = qo([
  O("di-template-item-ref")
], Zt);
const ef = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateItemRefElement() {
    return Zt;
  },
  get element() {
    return Zt;
  }
}, Symbol.toStringTag, { value: "Module" }));
class Go extends Ql {
  async execute() {
    var n, l;
    const t = this.args.unique ?? null, i = { mode: this.mode };
    if (this.args.entityType === G && t) {
      const { data: p } = await w(this, (m) => Bo([t], m));
      i.familyKey = t, i.familyName = (n = p == null ? void 0 : p[0]) == null ? void 0 : n.name;
    } else
      i.parentKey = t;
    const a = await dn(this, fy, { data: i });
    if (!(a != null && a.uploaded)) return;
    const o = await this.getContext(N);
    o == null || o.peek("positive", { data: { message: "Font added" } }), (l = a.warnings) != null && l.length && (o == null || o.peek("warning", { data: { headline: "Some variants were not added", message: a.warnings.join(" ") } }));
    const s = await this.getContext(ot);
    s == null || s.dispatchEvent(new ii({ entityType: this.args.entityType, unique: t })), yn();
  }
}
class tf extends Go {
  constructor() {
    super(...arguments), this.mode = "upload";
  }
}
class af extends Go {
  constructor() {
    super(...arguments), this.mode = "web";
  }
}
class of extends Go {
  constructor() {
    super(...arguments), this.mode = "path";
  }
}
class sf extends Go {
  constructor() {
    super(...arguments), this.mode = void 0;
  }
}
const nf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: tf
}, Symbol.toStringTag, { value: "Module" })), rf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: af
}, Symbol.toStringTag, { value: "Module" })), lf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: of
}, Symbol.toStringTag, { value: "Module" })), cf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: sf
}, Symbol.toStringTag, { value: "Module" }));
class Sl extends ai {
  async getHref() {
    return this.args.unique ? Xt(this.args.entityType, this.args.unique) : void 0;
  }
}
const uf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRenameFontFamilyEntityAction: Sl,
  api: Sl
}, Symbol.toStringTag, { value: "Module" }));
class El extends ai {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await w(this, (n) => uh(t, n));
    if (a || !i) throw a ?? new Error("The font could not be refreshed.");
    zy(t);
    const o = await this.getContext(N);
    o == null || o.peek("positive", { data: { message: `'${i.familyName}' refreshed` } });
    const s = await this.getContext(ot).catch(() => {
    });
    s == null || s.dispatchEvent(new un({ unique: t, entityType: this.args.entityType }));
  }
}
const df = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRefreshFontEntityAction: El,
  api: El
}, Symbol.toStringTag, { value: "Module" }));
class Il extends cn {
  constructor(t) {
    super(t, {
      workspaceAlias: go,
      entityType: G,
      detailRepositoryAlias: Tn
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Pv),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const pf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFamilyWorkspaceContext: Il,
  api: Il
}, Symbol.toStringTag, { value: "Module" }));
class Ol extends kp {
  constructor(t) {
    super(t, {
      workspaceAlias: Ga,
      entityType: Xe,
      detailRepositoryAlias: $n
    }), this.current = this._data.current, this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => zv),
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
    this._data.updateCurrent({ weight: t, name: bo(t, (i == null ? void 0 : i.isItalic) ?? !1) });
  }
  setItalic(t) {
    const i = this._data.getCurrent();
    this._data.updateCurrent({ isItalic: t, name: bo((i == null ? void 0 : i.weight) ?? 400, t) });
  }
}
const Ln = new at(
  xp.contextAlias,
  void 0,
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === Xe;
  }
), hf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_WORKSPACE_CONTEXT: Ln,
  DiFontWorkspaceContext: Ol,
  api: Ol
}, Symbol.toStringTag, { value: "Module" }));
var mf = Object.defineProperty, yf = Object.getOwnPropertyDescriptor, ru = (e) => {
  throw TypeError(e);
}, Ea = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? yf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && mf(t, i, o), o;
}, zn = (e, t, i) => t.has(e) || ru("Cannot " + i), Qt = (e, t, i) => (zn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ja = (e, t, i) => t.has(e) ? ru("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), As = (e, t, i, a) => (zn(e, t, "write to private field"), t.set(e, i), i), qe = (e, t, i) => (zn(e, t, "access private method"), i), _t, xo, ko, Se, Fs, lu, Xa, cu, uu, du;
const ff = ["Regular", "Bold", "Italic", "BoldItalic"];
function gf(e) {
  switch (e.sourceKind) {
    case "path":
      return `wwwroot: ${e.path ?? ""}`;
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : e.sourceUrl ?? "Web";
    default:
      return "Media library";
  }
}
let Je = class extends C {
  constructor() {
    super(), ja(this, Se), this._sampleLoaded = !1, this._usedBy = [], this._usedByTotal = 0, ja(this, _t), ja(this, xo), ja(this, ko), this.consumeContext(Ae, (e) => {
      As(this, xo, () => e == null ? void 0 : e.getLatestToken()), qe(this, Se, Fs).call(this);
    }), this.consumeContext(Ln, (e) => {
      As(this, _t, e), this.observe(e == null ? void 0 : e.current, (t) => {
        this._data = t, qe(this, Se, Fs).call(this);
      });
    });
  }
  render() {
    const e = this._data;
    return e ? r`
      <uui-box headline="Sample">
        <p class="specimen" style=${this._sampleLoaded ? `font-family: ${Sa(e.unique)}, serif` : ""}>
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
      return (i = Qt(this, _t)) == null ? void 0 : i.setWeight(Number(t.target.value) || 400);
    }}>
          </uui-input>
          <uui-toggle
            id="italic"
            label="Italic"
            ?checked=${e.isItalic}
            @change=${(t) => {
      var i;
      return (i = Qt(this, _t)) == null ? void 0 : i.setItalic(t.target.checked);
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
        ${qe(this, Se, du).call(this, e.styles)}
        <uui-button look="secondary" label="Add a named style" @click=${qe(this, Se, cu)}>Add a style</uui-button>
      </uui-box>

      <uui-box headline="Source">
        <dl>
          <dt>Family</dt>
          <dd>
            ${e.font.familyKey ? r`<a href=${Xt(G, e.font.familyKey)}>${e.font.familyName}</a>` : e.font.familyName}
          </dd>
          <dt>File</dt>
          <dd>${gf(e.font)}</dd>
        </dl>
      </uui-box>

      <uui-box headline="Used by">
        ${this._usedByTotal === 0 ? r`<p class="hint">No template uses this font.</p>` : r`<ul class="used-by">
              ${ae(
      this._usedBy,
      (t) => t.key,
      (t) => r`<li>
                  <uui-ref-node name=${t.name} href=${Da(t.key)}>
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
_t = /* @__PURE__ */ new WeakMap();
xo = /* @__PURE__ */ new WeakMap();
ko = /* @__PURE__ */ new WeakMap();
Se = /* @__PURE__ */ new WeakSet();
Fs = async function() {
  var o;
  const e = (o = this._data) == null ? void 0 : o.unique, t = Qt(this, xo);
  if (!e || !t || Qt(this, ko) === e) return;
  As(this, ko, e);
  const [i, a] = await Promise.all([
    Rn(e, t),
    lc(e, 0, 50, t).catch(() => {
    })
  ]);
  this._sampleLoaded = !!i, this._usedBy = (a == null ? void 0 : a.items) ?? [], this._usedByTotal = (a == null ? void 0 : a.total) ?? 0;
};
lu = async function() {
  var a;
  await this.updateComplete, await new Promise((o) => requestAnimationFrame(o));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
Xa = function(e, t) {
  var a, o;
  const i = [...((a = this._data) == null ? void 0 : a.styles) ?? []];
  i[e] = { ...i[e], ...t }, (o = Qt(this, _t)) == null || o.setStyles(i);
};
cu = function() {
  var e, t;
  (t = Qt(this, _t)) == null || t.setStyles([...((e = this._data) == null ? void 0 : e.styles) ?? [], { name: "New style", size: 32, fontStyle: "Regular" }]), qe(this, Se, lu).call(this);
};
uu = function(e) {
  var i, a;
  const t = [...((i = this._data) == null ? void 0 : i.styles) ?? []];
  t.splice(e, 1), (a = Qt(this, _t)) == null || a.setStyles(t);
};
du = function(e) {
  return e.length === 0 ? h : r`
      <uui-table>
        <uui-table-head>
          <uui-table-head-cell>Name</uui-table-head-cell>
          <uui-table-head-cell>Size</uui-table-head-cell>
          <uui-table-head-cell>Face</uui-table-head-cell>
          <uui-table-head-cell></uui-table-head-cell>
        </uui-table-head>
        ${ae(
    e,
    (t, i) => i,
    (t, i) => r`
            <uui-table-row>
              <uui-table-cell>
                <uui-input
                  class="style-name"
                  label="Style name"
                  .value=${t.name}
                  @change=${(a) => qe(this, Se, Xa).call(this, i, { name: a.target.value })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-input
                  type="number"
                  label="Size"
                  .value=${String(t.size)}
                  @change=${(a) => qe(this, Se, Xa).call(this, i, { size: Number(a.target.value) })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-select
                  label="Face"
                  .options=${ff.map((a) => ({ name: a, value: a, selected: a === t.fontStyle }))}
                  @change=${(a) => qe(this, Se, Xa).call(this, i, { fontStyle: a.target.value })}>
                </uui-select>
              </uui-table-cell>
              <uui-table-cell>
                <uui-button
                  compact
                  look="secondary"
                  color="danger"
                  label="Remove ${t.name}"
                  @click=${() => qe(this, Se, uu).call(this, i)}>
                  <uui-icon name="icon-trash"></uui-icon>
                </uui-button>
              </uui-table-cell>
            </uui-table-row>
          `
  )}
      </uui-table>
    `;
};
Je.styles = F`
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
Ea([
  y()
], Je.prototype, "_data", 2);
Ea([
  y()
], Je.prototype, "_sampleLoaded", 2);
Ea([
  y()
], Je.prototype, "_usedBy", 2);
Ea([
  y()
], Je.prototype, "_usedByTotal", 2);
Je = Ea([
  O("di-font-workspace-view")
], Je);
const vf = Je, bf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontWorkspaceViewElement() {
    return Je;
  },
  default: vf
}, Symbol.toStringTag, { value: "Module" }));
var _f = Object.defineProperty, wf = Object.getOwnPropertyDescriptor, pu = (e) => {
  throw TypeError(e);
}, Ia = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? wf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && _f(t, i, o), o;
}, Wn = (e, t, i) => t.has(e) || pu("Cannot " + i), wt = (e, t, i) => (Wn(e, t, "read from private field"), t.get(e)), Wi = (e, t, i) => t.has(e) ? pu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Cl = (e, t, i, a) => (Wn(e, t, "write to private field"), t.set(e, i), i), Ge = (e, t, i) => (Wn(e, t, "access private method"), i), ji, Do, Ja, Qi, Ee, Ps, hu, mu, Ki, yu;
let Ze = class extends C {
  constructor() {
    super(), Wi(this, Ee), Wi(this, ji), Wi(this, Do), this._templates = [], this._fonts = [], this._loading = !0, Wi(this, Ja, () => {
      wt(this, ji) && Ge(this, Ee, Ps).call(this);
    }), Wi(this, Qi, () => {
      var e;
      return (e = wt(this, ji)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(N, (e) => {
      Cl(this, Do, e);
    }), this.consumeContext(Ae, (e) => {
      Cl(this, ji, e), e && Ge(this, Ee, Ps).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(gs, wt(this, Ja));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(gs, wt(this, Ja));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${Ge(this, Ee, mu).call(this)} ${Ge(this, Ee, yu).call(this)}
      </umb-body-layout>
    `;
  }
};
ji = /* @__PURE__ */ new WeakMap();
Do = /* @__PURE__ */ new WeakMap();
Ja = /* @__PURE__ */ new WeakMap();
Qi = /* @__PURE__ */ new WeakMap();
Ee = /* @__PURE__ */ new WeakSet();
Ps = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Up(wt(this, Qi)),
      vs(wt(this, Qi)).catch(() => []),
      fc(wt(this, Qi)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    Ge(this, Ee, hu).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
hu = function(e, t, i) {
  var o;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (o = wt(this, Do)) == null || o.peek(e, { data: { headline: t, message: a } });
};
mu = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((o) => o.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${Ge(this, Ee, Ki).call(this, "Templates", this._templates.length, "icon-brush", !1, Xt(He))}
        ${Ge(this, Ee, Ki).call(this, "Fonts", this._fonts.length, "icon-font", !1, Xt(xt))}
        ${Ge(this, Ee, Ki).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${Ge(this, Ee, Ki).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
Ki = function(e, t, i, a = !1, o) {
  const s = r`
      <uui-icon name=${i}></uui-icon>
      <div class="stat-value">${t}</div>
      <div class="stat-label">${e}</div>
    `;
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        ${o ? r`<a class="stat-link" href=${o} aria-label="${e}: ${t}">${s}</a>` : s}
      </uui-box>
    `;
};
yu = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? h : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${ae(
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
        <uui-button look="secondary" href=${Rh("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Ze.styles = F`
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
Ia([
  y()
], Ze.prototype, "_templates", 2);
Ia([
  y()
], Ze.prototype, "_fonts", 2);
Ia([
  y()
], Ze.prototype, "_health", 2);
Ia([
  y()
], Ze.prototype, "_loading", 2);
Ze = Ia([
  O("di-overview-dashboard")
], Ze);
const $f = Ze, Tf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return Ze;
  },
  default: $f
}, Symbol.toStringTag, { value: "Module" }));
var xf = Object.getOwnPropertyDescriptor, kf = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? xf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let So = class extends C {
  connectedCallback() {
    super.connectedCallback(), window.history.replaceState(null, "", Xt(xt));
  }
};
So = kf([
  O("di-fonts-redirect")
], So);
const Df = So, Sf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsRedirectElement() {
    return So;
  },
  default: Df
}, Symbol.toStringTag, { value: "Module" }));
var Ef = Object.defineProperty, If = Object.getOwnPropertyDescriptor, fu = (e) => {
  throw TypeError(e);
}, Oa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? If(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Ef(t, i, o), o;
}, Un = (e, t, i) => t.has(e) || fu("Cannot " + i), pt = (e, t, i) => (Un(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ka = (e, t, i) => t.has(e) ? fu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Al = (e, t, i, a) => (Un(e, t, "write to private field"), t.set(e, i), i), yi = (e, t, i) => (Un(e, t, "access private method"), i), Za, fi, Pi, $t, Eo, Rs, gu;
let Qe = class extends C {
  constructor() {
    super(), Ka(this, $t), Ka(this, Za), Ka(this, fi), this._loading = !0, this._busy = !1, Ka(this, Pi, () => {
      var e;
      return (e = pt(this, Za)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(N, (e) => {
      Al(this, fi, e);
    }), this.consumeContext(Ae, (e) => {
      Al(this, Za, e), e && yi(this, $t, Eo).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => yi(this, $t, Eo).call(this)}>Re-check</uui-button>
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
                ${ae(
      e,
      (a, o) => `${a.code}-${o}`,
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
                        ${a.templateKey ? r`<a href=${Da(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${yi(this, $t, gu).call(this)}
      </umb-body-layout>
    `;
  }
};
Za = /* @__PURE__ */ new WeakMap();
fi = /* @__PURE__ */ new WeakMap();
Pi = /* @__PURE__ */ new WeakMap();
$t = /* @__PURE__ */ new WeakSet();
Eo = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      fc(pt(this, Pi)),
      Ch(pt(this, Pi)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
Rs = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const o = e === "export" ? await Ah(pt(this, Pi)) : await Fh(pt(this, Pi));
    (t = pt(this, fi)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${o.written} file(s) written.` : `${o.imported} template(s) imported.`
      }
    });
    for (const s of o.messages.slice(0, 3))
      (i = pt(this, fi)) == null || i.peek("warning", { data: { message: s } });
    await yi(this, $t, Eo).call(this);
  } catch (o) {
    (a = pt(this, fi)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: o instanceof Error ? o.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
gu = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => yi(this, $t, Rs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => yi(this, $t, Rs).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : h;
};
Qe.styles = F`
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
Oa([
  y()
], Qe.prototype, "_health", 2);
Oa([
  y()
], Qe.prototype, "_sync", 2);
Oa([
  y()
], Qe.prototype, "_loading", 2);
Oa([
  y()
], Qe.prototype, "_busy", 2);
Qe = Oa([
  O("di-health-dashboard")
], Qe);
const Of = Qe, Cf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Qe;
  },
  default: Of
}, Symbol.toStringTag, { value: "Module" })), vu = 3, bu = 12, _u = 0.1, wu = 0.9;
function Af(e) {
  return Math.max(vu, Math.min(bu, e));
}
function Ff(e) {
  return Math.max(_u, Math.min(wu, e));
}
function Pf(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Af(t), o = 0.5 * Ff(i), s = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let p = 0; p < s; p++) {
    const m = (-90 + p * n) * Math.PI / 180, S = e === "star" && p % 2 === 1 ? o : 0.5;
    l.push({ x: 0.5 + S * Math.cos(m), y: 0.5 + S * Math.sin(m) });
  }
  return l;
}
function Rf(e, t, i) {
  const a = Pf(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((o) => `${(o.x * 100).toFixed(3)}% ${(o.y * 100).toFixed(3)}%`).join(", ")})`;
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
  sides: { min: vu, max: bu },
  innerRatio: { min: _u, max: wu }
}, Io = { min: 0.1, max: 4 };
function Mf(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let o = a;
  return t !== void 0 && (o = Math.max(t, o)), i !== void 0 && (o = Math.min(i, o)), o;
}
function Nn(e) {
  const t = e.kind ?? "linear", i = Math.round(Ms(e.centreX ?? 0.5) * 100), a = Math.round(Ms(e.centreY ?? 0.5) * 100);
  switch (t) {
    case "radial":
      return `radial-gradient(${e.shape ?? "ellipse"} ${zf(e.extent)} at ${i}% ${a}%, ${cs(e)})`;
    case "angular":
      return `conic-gradient(from ${e.angle}deg at ${i}% ${a}%, ${cs(e)})`;
    case "reflected":
      return `linear-gradient(${e.angle}deg, ${Ls(Wf(kt(e)))})`;
    case "diamond": {
      const o = Ls(kt(e).map((s) => ({ ...s, position: s.position / 2 })));
      return [
        `linear-gradient(to top left, ${o}) left top / ${i}% ${a}% no-repeat`,
        `linear-gradient(to top right, ${o}) right top / ${100 - i}% ${a}% no-repeat`,
        `linear-gradient(to bottom left, ${o}) left bottom / ${i}% ${100 - a}% no-repeat`,
        `linear-gradient(to bottom right, ${o}) right bottom / ${100 - i}% ${100 - a}% no-repeat`
      ].join(", ");
    }
    default:
      return `linear-gradient(${e.angle}deg, ${cs(e)})`;
  }
}
function Ms(e) {
  return Math.min(1, Math.max(0, e));
}
const Lf = {
  farthestCorner: "farthest-corner",
  farthestSide: "farthest-side",
  closestCorner: "closest-corner",
  closestSide: "closest-side"
};
function zf(e) {
  return Lf[e ?? "farthestCorner"] ?? "farthest-corner";
}
function kt(e) {
  const t = e.stops;
  return !t || t.length < 2 ? [{ colour: e.from, position: 0 }, { colour: e.to, position: 1 }] : t.map((i, a) => ({ stop: { colour: i.colour, position: Ms(i.position) }, index: a })).sort((i, a) => i.stop.position - a.stop.position || i.index - a.index).map(({ stop: i }) => i);
}
function Wf(e) {
  return [
    ...[...e].reverse().map((t) => ({ colour: t.colour, position: 0.5 - t.position / 2 })),
    ...e.map((t) => ({ colour: t.colour, position: 0.5 + t.position / 2 }))
  ];
}
function cs(e) {
  const t = e.stops;
  return t && t.length >= 2 ? Ls(kt(e)) : `${e.from}, ${e.to}`;
}
function Ls(e) {
  return e.map((t) => `${t.colour} ${Bn(t.position * 100)}%`).join(", ");
}
const Bn = (e) => Math.round(e * 100) / 100;
function la(e, t) {
  const i = kt({ ...e, stops: t });
  return { ...e, stops: t, from: i[0].colour, to: i[i.length - 1].colour };
}
function Uf(e) {
  const t = [...kt(e)].reverse().map((i) => ({ colour: i.colour, position: Bn(1 - i.position) }));
  return la(e, t);
}
function Nf(e) {
  const t = kt(e);
  let i = 0;
  for (let n = 1; n < t.length; n++)
    t[n].position - t[n - 1].position > t[i + 1].position - t[i].position && (i = n - 1);
  const a = t[i], o = t[i + 1], s = Bn((a.position + o.position) / 2);
  return la(e, [...t, { colour: jf(a.colour, o.colour, 0.5), position: s }]);
}
function Bf(e, t) {
  const i = kt(e);
  return i.length <= 2 ? e : la(e, i.filter((a, o) => o !== t));
}
function jf(e, t, i) {
  const a = Fl(e), o = Fl(t);
  if (!a || !o) return e;
  const s = (p) => Math.round(a[p] + (o[p] - a[p]) * i).toString(16).padStart(2, "0").toUpperCase(), n = `#${s(0)}${s(1)}${s(2)}`, l = s(3);
  return l === "FF" ? n : `${n}${l}`;
}
function Fl(e) {
  const t = (e ?? "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t) || ![3, 4, 6, 8].includes(t.length)) return;
  const i = t.length <= 4 ? [...t].map((o) => o + o).join("") : t, a = (o) => parseInt(i.slice(o * 2, o * 2 + 2), 16);
  return [a(0), a(1), a(2), i.length === 8 ? a(3) : 255];
}
const jn = F`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Kf(e, t) {
  const i = [], a = t.lockX ? void 0 : Pl(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Vf(t),
    t.threshold
  ), o = t.lockY ? void 0 : Pl(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    qf(t),
    t.threshold
  );
  return a && i.push({ orientation: "vertical", at: a.at, label: a.label }), o && i.push({ orientation: "horizontal", at: o.at, label: o.label }), {
    box: {
      ...e,
      x: t.lockX ? e.x : Math.round(a ? a.at - a.offset : e.x),
      y: t.lockY ? e.y : Math.round(o ? o.at - o.offset : e.y)
    },
    guides: i
  };
}
function Vf(e) {
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
function qf(e) {
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
function Pl(e, t, i) {
  let a;
  for (const o of e)
    for (const s of t) {
      const n = Math.abs(s.at - o.value);
      n > i || (!a || n < a.distance) && (a = { at: s.at, offset: o.offset, label: s.label, distance: n });
    }
  return a;
}
var Gf = Object.defineProperty, Yf = Object.getOwnPropertyDescriptor, $u = (e) => {
  throw TypeError(e);
}, nt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Yf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Gf(t, i, o), o;
}, Kn = (e, t, i) => t.has(e) || $u("Cannot " + i), ke = (e, t, i) => (Kn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), us = (e, t, i) => t.has(e) ? $u("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ds = (e, t, i, a) => (Kn(e, t, "write to private field"), t.set(e, i), i), Y = (e, t, i) => (Kn(e, t, "access private method"), i), At, Vi, R, Yo, Vn, Tu, xu, ku, Du, qn, Oo, Su, Eu, Iu, Ou, Cu, Au, Fu, Pu, Ru;
const Hf = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], ps = 18;
let Ie = class extends C {
  constructor() {
    super(...arguments), us(this, R), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, us(this, At), us(this, Vi);
  }
  willUpdate() {
    this._box = Y(this, R, Tu).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ke(this, Vi) && ((t = ke(this, At)) == null || t.disconnect(), ds(this, Vi, e), e && (ke(this, At) ?? ds(this, At, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ke(this, At).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ke(this, At)) == null || e.disconnect(), ds(this, Vi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return h;
    const e = this._box;
    return r`
      <div
        class=${Xl({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${U({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ke(this, R, xu) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...Y(this, R, qn).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      Y(this, R, Su).call(this, t), Y(this, R, Oo).call(this, t);
    }}>
        ${Y(this, R, Eu).call(this)}
      </div>

      ${this.selected ? Y(this, R, Pu).call(this, e) : h}
      ${this.showMeasured && this.measured ? Y(this, R, Ru).call(this) : h}
    `;
  }
};
At = /* @__PURE__ */ new WeakMap();
Vi = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakSet();
Yo = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Vn = function() {
  return this.layer.rotation ?? 0;
};
Tu = function() {
  var o;
  const e = this.layer, t = e.size.width ?? Y(this, R, ku).call(this), i = e.size.height ?? ((o = this.measured) == null ? void 0 : o.height) ?? Y(this, R, Du).call(this), a = Vo(ke(this, R, Yo), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
xu = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
ku = function() {
  var e;
  switch (this.layer.type) {
    case "badges": {
      if ((e = this.measured) != null && e.width) return this.measured.width;
      const { badge: t, label: i, gap: a, maxItems: o, direction: s } = this.layer, n = i.position === "right" ? t.size + i.gap + i.fontSize * 0.6 * 8 : t.size;
      return s === "horizontal" ? o * n + (o - 1) * a : n;
    }
    case "text":
      return 600;
    default:
      return 240;
  }
};
Du = function() {
  switch (this.layer.type) {
    case "text": {
      const { fontSize: e, lineSpacing: t, maxLines: i } = this.layer.style;
      return e * t * (i ?? 1);
    }
    case "badges": {
      const { badge: e, label: t, gap: i, maxItems: a, direction: o } = this.layer, s = t.position === "below" ? e.size + t.gap + t.fontSize * 1.2 : t.position === "right" ? Math.max(e.size, t.fontSize * 1.2) : e.size;
      return o === "horizontal" ? s : a * s + (a - 1) * i;
    }
    default:
      return 135;
  }
};
qn = function(e) {
  const t = ke(this, R, Vn);
  if (t === 0) return {};
  const i = ke(this, R, Yo);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Oo = function(e, t) {
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
Su = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Eu = function() {
  switch (this.layer.type) {
    case "text":
      return Y(this, R, Iu).call(this);
    case "image":
      return Y(this, R, Cu).call(this);
    case "badges":
      return Y(this, R, Au).call(this);
    default:
      return Y(this, R, Fu).call(this);
  }
};
Iu = function() {
  if (this.layer.type !== "text") return h;
  const e = this.layer.style, t = this.resolvedText || Y(this, R, Ou).call(this);
  return r`
      <div
        class="text"
        style=${U({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Sa(e.fontKey)}, sans-serif`,
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
Ou = function() {
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
Cu = function() {
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
Au = function() {
  if (this.layer.type !== "badges") return h;
  const { badge: e, label: t, gap: i, maxItems: a, direction: o, wrap: s, rowGap: n } = this.layer, l = o === "horizontal", p = l && s, m = t.position ?? "below";
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
        ${ae(
    Array.from({ length: Math.max(1, a) }, (S, D) => D),
    (S) => S,
    () => r`
            <div class=${Xl({ badge: !0, right: m === "right" })}>
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
      fontFamily: `${Sa(t.fontKey)}, sans-serif`,
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
Fu = function() {
  if (this.layer.type !== "rect") return h;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? Nn(i) : e.fill ?? "transparent", o = e.border, s = o ? o.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${U({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: o ? `${s}px solid ${o.colour}` : "none"
    })}>
        </div>
      `;
  const n = Rf(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${U({ clipPath: n, background: o ? o.colour : "transparent" })}>
        <div class="shape-inner" style=${U({ inset: `${s}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
Pu = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, o = e.height * this.scale, s = ke(this, R, Yo), n = ke(this, R, Vn), l = ze(this.layer.position, "x") || ze(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${U({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${o}px`, ...Y(this, R, qn).call(this, e) })}>
        <span
          class="tag"
          style=${U(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : h}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? h : r`
              ${ae(
    Hf,
    (p) => p,
    (p) => r`
                  <span
                    class="handle ${p}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${p}"
                    @pointerdown=${(m) => Y(this, R, Oo).call(this, m, p)}>
                  </span>
                `
  )}
              <span class="stalk" style=${U({ height: `${ps}px`, top: `${-ps}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${U({ top: `${-ps}px` })}
                @pointerdown=${(p) => Y(this, R, Oo).call(this, p, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${s.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${U({
    left: `${(s.x - e.x) * this.scale}px`,
    top: `${(s.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
Ru = function() {
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
Ie.styles = F`
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
nt([
  g({ type: Object })
], Ie.prototype, "layer", 2);
nt([
  g({ type: Number })
], Ie.prototype, "scale", 2);
nt([
  g({ type: Boolean, reflect: !0 })
], Ie.prototype, "selected", 2);
nt([
  g({ type: Object })
], Ie.prototype, "measured", 2);
nt([
  g({ type: Boolean })
], Ie.prototype, "showMeasured", 2);
nt([
  g({ type: String })
], Ie.prototype, "resolvedText", 2);
nt([
  g({ attribute: !1 })
], Ie.prototype, "resolvedPosition", 2);
nt([
  y()
], Ie.prototype, "_box", 2);
Ie = nt([
  O("di-layer-box")
], Ie);
var Xf = Object.defineProperty, Jf = Object.getOwnPropertyDescriptor, Mu = (e) => {
  throw TypeError(e);
}, Gn = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Jf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Xf(t, i, o), o;
}, Zf = (e, t, i) => t.has(e) || Mu("Cannot " + i), Qf = (e, t, i) => t.has(e) ? Mu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), eg = (e, t, i) => (Zf(e, t, "access private method"), i), zs, Lu;
let ca = class extends C {
  constructor() {
    super(...arguments), Qf(this, zs), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${ae(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => eg(this, zs, Lu).call(this, e)
    )}`;
  }
};
zs = /* @__PURE__ */ new WeakSet();
Lu = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
ca.styles = F`
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
Gn([
  g({ type: Array })
], ca.prototype, "guides", 2);
Gn([
  g({ type: Number })
], ca.prototype, "scale", 2);
ca = Gn([
  O("di-guides")
], ca);
var tg = Object.defineProperty, ig = Object.getOwnPropertyDescriptor, zu = (e) => {
  throw TypeError(e);
}, Ca = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? ig(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && tg(t, i, o), o;
}, ag = (e, t, i) => t.has(e) || zu("Cannot " + i), og = (e, t, i) => t.has(e) ? zu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Rl = (e, t, i) => (ag(e, t, "access private method"), i), Qa, Ws;
let X = class extends C {
  constructor() {
    super(...arguments), og(this, Qa), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Rl(this, Qa, Ws).call(this, "top"), Rl(this, Qa, Ws).call(this, "left");
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
Qa = /* @__PURE__ */ new WeakSet();
Ws = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, o = a * this.scale, s = window.devicePixelRatio || 1;
  t.width = (e === "top" ? o : X.thickness) * s, t.height = (e === "top" ? X.thickness : o) * s, t.style.width = `${e === "top" ? o : X.thickness}px`, t.style.height = `${e === "top" ? X.thickness : o}px`, i.setTransform(s, 0, 0, s, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const p = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, S = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(p, X.thickness - S), i.lineTo(p, X.thickness)) : (i.moveTo(X.thickness - S, p), i.lineTo(X.thickness, p)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), p + 2, 9) : (i.save(), i.translate(9, p - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
X.thickness = 20;
X.styles = F`
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
Ca([
  g({ type: Number })
], X.prototype, "canvasWidth", 2);
Ca([
  g({ type: Number })
], X.prototype, "canvasHeight", 2);
Ca([
  g({ type: Number })
], X.prototype, "scale", 2);
Ca([
  g({ type: Object })
], X.prototype, "pointer", 2);
X = Ca([
  O("di-rulers")
], X);
var sg = Object.defineProperty, ng = Object.getOwnPropertyDescriptor, Wu = (e) => {
  throw TypeError(e);
}, ce = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? ng(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && sg(t, i, o), o;
}, Yn = (e, t, i) => t.has(e) || Wu("Cannot " + i), M = (e, t, i) => (Yn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ue = (e, t, i) => t.has(e) ? Wu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), eo = (e, t, i, a) => (Yn(e, t, "write to private field"), t.set(e, i), i), P = (e, t, i) => (Yn(e, t, "access private method"), i), Ft, qi, Tt, A, Hn, Us, Ns, Ho, Xn, Bs, Uu, Nu, Jn, Bu, ju, js, to, Ku, Vu, ui, Zn, Ks, Vs, qs, qu, Gs, Ys, Hs, Gu;
const rg = 6, Yu = 20, lg = 2, cg = 15, ug = 0.1;
let Q = class extends C {
  constructor() {
    super(...arguments), ue(this, A), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ue(this, Ft), ue(this, qi), ue(this, Tt, /* @__PURE__ */ new Map()), ue(this, js, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = P(this, A, Xn).call(this, t), a = P(this, A, Bs).call(this, t), o = P(this, A, Uu).call(this, t), s = P(this, A, Ho).call(this, e.detail.startX, e.detail.startY);
      eo(this, Ft, {
        key: t.key,
        handle: e.detail.handle,
        startClientX: e.detail.startX,
        startClientY: e.detail.startY,
        startBox: i,
        startPosition: o,
        startRotation: t.rotation ?? 0,
        startExtent: a,
        startAngle: Math.atan2(s.y - o.y, s.x - o.x),
        moved: !1,
        shiftKey: e.detail.shiftKey,
        altKey: e.detail.altKey
      }), this.dispatchEvent(new CustomEvent("di-transaction-begin", { bubbles: !0, composed: !0 }));
    }), ue(this, to, (e) => {
      var Li, se;
      this._pointer = P(this, A, Ns).call(this, e.clientX, e.clientY);
      const t = M(this, Ft);
      if (!t) return;
      const i = this.template.layers.find((Te) => Te.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, o = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(o) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        P(this, A, Vu).call(this, i, t, e);
        return;
      }
      const s = ze(i.position, "x"), n = ze(i.position, "y"), l = t.startRotation, p = e.shiftKey || i.type === "rect" && i.lockAspect === !0;
      if (t.handle && l !== 0) {
        P(this, A, Ku).call(this, i, t, t.handle, a, o, p, s, n);
        return;
      }
      let m = t.handle ? P(this, A, Zn).call(this, t.startBox, t.handle, a, o, p) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + o };
      s && (m = { ...m, x: t.startBox.x, width: (Li = t.handle) != null && Li.includes("w") ? t.startBox.width : m.width }), n && (m = { ...m, y: t.startBox.y, height: (se = t.handle) != null && se.includes("n") ? t.startBox.height : m.height });
      const S = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, D = l !== 0 ? { x: m.x + S.x, y: m.y + S.y, width: t.startExtent.width, height: t.startExtent.height } : m, oe = this.snapEnabled && !e.altKey ? Kf(D, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((Te) => Te.key !== i.key).map((Te) => P(this, A, Bs).call(this, Te)),
        threshold: rg / this.scale,
        lockX: s,
        lockY: n
      }) : {
        box: {
          ...D,
          x: s ? D.x : Math.round(D.x),
          y: n ? D.y : Math.round(D.y)
        },
        guides: []
      };
      this._guides = oe.guides;
      const ge = l !== 0 ? { ...m, x: oe.box.x - S.x, y: oe.box.y - S.y } : oe.box, ve = jh(ge, i.position);
      s && (ve.x = i.position.x), n && (ve.y = i.position.y);
      const si = { position: ve };
      t.handle && (si.size = {
        width: Math.max(1, Math.round(ge.width)),
        height: Math.max(1, Math.round(ge.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: si } })
      );
    }), ue(this, ui, () => {
      if (!M(this, Ft)) return;
      const e = M(this, Ft).moved;
      eo(this, Ft, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ue(this, Ks, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ue(this, Vs, () => {
      this._dropTarget = !1;
    }), ue(this, qs, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = P(this, A, Ns).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: P(this, A, qu).call(this, e) }
        })
      );
    }), ue(this, Gs, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ue(this, Ys, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => xc(t.position)) && this.requestUpdate();
    }), ue(this, Hs, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), eo(this, qi, new ResizeObserver(() => P(this, A, Us).call(this))), M(this, qi).observe(this), window.addEventListener("pointermove", M(this, to)), window.addEventListener("pointerup", M(this, ui)), window.addEventListener("pointercancel", M(this, ui));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = M(this, qi)) == null || e.disconnect(), window.removeEventListener("pointermove", M(this, to)), window.removeEventListener("pointerup", M(this, ui)), window.removeEventListener("pointercancel", M(this, ui));
  }
  updated(e) {
    P(this, A, Us).call(this), e.has("zoom") && P(this, A, Hn).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = M(this, Tt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return h;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((s) => [s.key, s]));
    P(this, A, Nu).call(this);
    const o = this.showRulers ? Yu : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${M(this, Gs)}
        @dragover=${M(this, Ks)}
        @dragleave=${M(this, Vs)}
        @drop=${M(this, qs)}
        @di-layer-drag-start=${M(this, js)}
        @di-layer-box-resize=${M(this, Ys)}>
        <div
          class="artboard"
          style=${U({
      width: `${t + o}px`,
      height: `${i + o}px`,
      "--di-gutter": `${o}px`
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
      background: e.backgroundGradient ? Nn(e.backgroundGradient) : e.background
    })}
            @pointerdown=${M(this, Hs)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${U({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : h}

            ${ae(
      this.template.layers,
      (s) => s.key,
      (s) => {
        var n, l;
        return r`
                <di-layer-box
                  data-key=${s.key}
                  .layer=${s}
                  .scale=${this.scale}
                  .selected=${s.key === this.selectedLayerKey}
                  .measured=${a.get(s.key)}
                  .showMeasured=${this.showMeasured}
                  .resolvedText=${((n = a.get(s.key)) == null ? void 0 : n.resolvedText) ?? void 0}
                  .resolvedPosition=${(l = M(this, Tt).get(s.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? P(this, A, Gu).call(this) : h}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
Ft = /* @__PURE__ */ new WeakMap();
qi = /* @__PURE__ */ new WeakMap();
Tt = /* @__PURE__ */ new WeakMap();
A = /* @__PURE__ */ new WeakSet();
Hn = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Us = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Yu : 0) + lg, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, P(this, A, Hn).call(this));
};
Ns = function(e, t) {
  const i = P(this, A, Ho).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
Ho = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
Xn = function(e) {
  const t = M(this, Tt).get(e.key);
  if (t) return t.box;
  const i = P(this, A, Jn).call(this, e), a = Vo(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Bs = function(e) {
  const t = M(this, Tt).get(e.key);
  return t ? t.extent : Tc(P(this, A, Xn).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Uu = function(e) {
  var t;
  return ((t = M(this, Tt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Nu = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  eo(this, Tt, Hh(
    this.template.layers,
    (i) => P(this, A, Jn).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Jn = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? P(this, A, Bu).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? P(this, A, ju).call(this, e, i)
  };
};
Bu = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
ju = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
js = /* @__PURE__ */ new WeakMap();
to = /* @__PURE__ */ new WeakMap();
Ku = function(e, t, i, a, o, s, n, l) {
  const p = t.startRotation, m = t.startPosition, S = Kh(a, o, 0, 0, p);
  let D = P(this, A, Zn).call(this, t.startBox, i, S.x, S.y, s);
  n && (D = { ...D, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : D.width }), l && (D = { ...D, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : D.height });
  const q = Math.max(1, Math.round(D.width)), oe = Math.max(1, Math.round(D.height)), ge = fn(D.x, D.y, q, oe, m.anchor), ve = di(ge.x, ge.y, m.x, m.y, p), si = {
    ...e.position,
    x: n ? e.position.x : Math.round(ve.x),
    y: l ? e.position.y : Math.round(ve.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: si, size: { width: q, height: oe } } }
    })
  );
};
Vu = function(e, t, i) {
  const a = t.startPosition, o = P(this, A, Ho).call(this, i.clientX, i.clientY), n = (Math.atan2(o.y - a.y, o.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, p = i.shiftKey ? cg : ug, m = $c(Math.round(l / p) * p);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
ui = /* @__PURE__ */ new WeakMap();
Zn = function(e, t, i, a, o) {
  let { x: s, y: n, width: l, height: p } = e;
  if (t.includes("w") && (s = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, p = e.height - a), t.includes("s") && (p = e.height + a), o && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(p - e.height) ? p = l / m : l = p * m, t.includes("n") && (n = e.y + e.height - p), t.includes("w") && (s = e.x + e.width - l);
  }
  return { x: s, y: n, width: Math.max(4, l), height: Math.max(4, p) };
};
Ks = /* @__PURE__ */ new WeakMap();
Vs = /* @__PURE__ */ new WeakMap();
qs = /* @__PURE__ */ new WeakMap();
qu = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Gs = /* @__PURE__ */ new WeakMap();
Ys = /* @__PURE__ */ new WeakMap();
Hs = /* @__PURE__ */ new WeakMap();
Gu = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${U({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
Q.styles = F`
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
      ${jn}
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
  g({ type: Object })
], Q.prototype, "template", 2);
ce([
  g({ type: String })
], Q.prototype, "selectedLayerKey", 2);
ce([
  g({ type: Object })
], Q.prototype, "baseImageUrl", 2);
ce([
  g({ type: Array })
], Q.prototype, "serverBounds", 2);
ce([
  g({ type: Boolean })
], Q.prototype, "showMeasured", 2);
ce([
  g({ type: Boolean })
], Q.prototype, "snapEnabled", 2);
ce([
  g({ type: Boolean })
], Q.prototype, "showRulers", 2);
ce([
  g({ type: Boolean })
], Q.prototype, "showSafeArea", 2);
ce([
  g({ type: Number })
], Q.prototype, "zoom", 2);
ce([
  y()
], Q.prototype, "_fitScale", 2);
ce([
  y()
], Q.prototype, "_guides", 2);
ce([
  y()
], Q.prototype, "_pointer", 2);
ce([
  y()
], Q.prototype, "_dropTarget", 2);
Q = ce([
  O("di-designer-canvas")
], Q);
var dg = Object.defineProperty, pg = Object.getOwnPropertyDescriptor, Hu = (e) => {
  throw TypeError(e);
}, Qn = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? pg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && dg(t, i, o), o;
}, Xu = (e, t, i) => t.has(e) || Hu("Cannot " + i), hg = (e, t, i) => (Xu(e, t, "read from private field"), i ? i.call(e) : t.get(e)), mg = (e, t, i) => t.has(e) ? Hu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), we = (e, t, i) => (Xu(e, t, "access private method"), i), te, Ju, er, tr, Zu, Qu, ed, td, ea;
const Ml = {
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
let ua = class extends C {
  constructor() {
    super(...arguments), mg(this, te), this.properties = [], this._search = "";
  }
  render() {
    const e = yg(hg(this, te, Ju));
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

        ${we(this, te, Qu).call(this)}

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : ae(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => we(this, te, Zu).call(this, t, i)
    )}
      </div>
    `;
  }
};
te = /* @__PURE__ */ new WeakSet();
Ju = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
er = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
tr = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Zu = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${ae(
    t,
    (i) => i.alias,
    (i) => we(this, te, ea).call(
      this,
      i.name,
      Ml[i.classification] ?? Ml.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Qu = function() {
  return r`
      <div class="group">
        <h5>Elements</h5>
        ${we(this, te, ea).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${we(this, te, ea).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${we(this, te, ea).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${we(this, te, ed).call(this)}
      </div>
    `;
};
ed = function() {
  const e = { kind: "static", layerType: "rect", preset: "rectangle" };
  return r`
      <div
        class="chip other shape"
        draggable="true"
        title="Shape"
        @dragstart=${(t) => we(this, te, tr).call(this, t, e)}>
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
          ${Mh.map((t) => r`
            <uui-menu-item
              label=${oa[t].label}
              data-preset=${t}
              @click-label=${() => we(this, te, td).call(this, t)}>
              <uui-icon slot="icon" name=${oa[t].icon}></uui-icon>
            </uui-menu-item>
          `)}
        </div>
      </uui-popover-container>
    `;
};
td = function(e) {
  var t, i, a;
  (a = (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#shape-menu")) == null ? void 0 : i.hidePopover) == null || a.call(i), we(this, te, er).call(this, { kind: "static", layerType: "rect", preset: e });
};
ea = function(e, t, i, a, o) {
  const s = o ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${s}
        @dragstart=${(n) => we(this, te, tr).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${s}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${o ?? `Add ${e} to the canvas`}
          @click=${() => we(this, te, er).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
ua.styles = F`
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
Qn([
  g({ type: Array })
], ua.prototype, "properties", 2);
Qn([
  y()
], ua.prototype, "_search", 2);
ua = Qn([
  O("di-property-palette")
], ua);
function yg(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e) {
    const o = a.group || "Other", s = t.get(o) ?? [];
    s.push(a), t.set(o, s);
  }
  const i = /* @__PURE__ */ new Map();
  t.has("Node") && i.set("Node", t.get("Node"));
  for (const [a, o] of t)
    a !== "Node" && i.set(a, o);
  return i;
}
function fg(e) {
  return e.backgroundGradient ? "gradient" : gg(e.background) ? "transparent" : "colour";
}
function gg(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function vg(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((o) => o + o).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var bg = Object.defineProperty, _g = Object.getOwnPropertyDescriptor, id = (e) => {
  throw TypeError(e);
}, ir = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? _g(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && bg(t, i, o), o;
}, wg = (e, t, i) => t.has(e) || id("Cannot " + i), $g = (e, t, i) => t.has(e) ? id("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ll = (e, t, i) => (wg(e, t, "access private method"), i), io, Xs;
let da = class extends C {
  constructor() {
    super(...arguments), $g(this, io), this.value = "#FFFFFF", this.label = "Colour";
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
          @change=${Ll(this, io, Xs)}></uui-color-picker>
        <uui-input
          label="${this.label} (hex)"
          spellcheck="false"
          .value=${this.value}
          @change=${Ll(this, io, Xs)}></uui-input>
      </div>
    `;
  }
};
io = /* @__PURE__ */ new WeakSet();
Xs = function(e) {
  e.stopPropagation();
  const t = zl(e.target.value);
  !t || t === zl(this.value) || (this.value = t, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: t } })));
};
da.styles = F`
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
ir([
  g({ type: String })
], da.prototype, "value", 2);
ir([
  g({ type: String })
], da.prototype, "label", 2);
da = ir([
  O("di-colour-input")
], da);
function zl(e) {
  const t = (e ?? "").trim(), i = t.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(i) || ![3, 4, 6, 8].includes(i.length)) return t;
  const o = (i.length <= 4 ? [...i].map((s) => s + s).join("") : i).toUpperCase();
  return o.length === 8 && o.endsWith("FF") ? `#${o.slice(0, 6)}` : `#${o}`;
}
var Tg = Object.defineProperty, xg = Object.getOwnPropertyDescriptor, ad = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? xg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Tg(t, i, o), o;
};
const Wl = {
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
let Co = class extends C {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${ae(
      wc,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Wl[e]}
              title=${Wl[e]}
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
Co.styles = F`
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
ad([
  g({ type: String })
], Co.prototype, "value", 2);
Co = ad([
  O("di-anchor-picker")
], Co);
var kg = Object.defineProperty, Dg = Object.getOwnPropertyDescriptor, od = (e) => {
  throw TypeError(e);
}, rt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Dg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && kg(t, i, o), o;
}, Sg = (e, t, i) => t.has(e) || od("Cannot " + i), Eg = (e, t, i) => t.has(e) ? od("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ig = (e, t, i) => (Sg(e, t, "access private method"), i), Js, sd;
let Oe = class extends C {
  constructor() {
    super(...arguments), Eg(this, Js), this.label = "", this.suffix = "px", this.step = 1, this.compact = !1, this.placeholder = "Auto";
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
          @change=${Ig(this, Js, sd)} />
        ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : h}
      </span>
    `;
    return !this.label || this.compact ? e : r`<umb-property-layout orientation="vertical" label=${this.label}>${e}</umb-property-layout>`;
  }
};
Js = /* @__PURE__ */ new WeakSet();
sd = function(e) {
  const t = e.target, i = t.value, a = Mf(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const o = a === null ? "" : String(a);
  o !== i && (t.value = o), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Oe.styles = F`
    :host {
      display: block;
    }

    /* Core's layout pads for a full-width workspace; the inspector's fields use this. */
    umb-property-layout {
      padding: var(--uui-size-space-3) 0;
    }

    :host([compact]) .input {
      box-sizing: border-box;
      height: 100%;
      border-radius: var(--di-number-field-border-radius, var(--uui-border-radius));
    }

    :host([compact]) input {
      min-height: 0;
      height: 100%;
      padding: 0 2px 0 var(--uui-size-space-2, 6px);
      text-align: right;
      /* The buttons either side already step it; the spinner only crowded the number. */
      appearance: textfield;
      -moz-appearance: textfield;
    }

    :host([compact]) input::-webkit-inner-spin-button,
    :host([compact]) input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    :host([compact]) .suffix {
      padding-right: var(--uui-size-space-2, 6px);
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
rt([
  g({ type: Number })
], Oe.prototype, "value", 2);
rt([
  g({ type: String })
], Oe.prototype, "label", 2);
rt([
  g({ type: String })
], Oe.prototype, "suffix", 2);
rt([
  g({ type: Number })
], Oe.prototype, "step", 2);
rt([
  g({ type: Number })
], Oe.prototype, "min", 2);
rt([
  g({ type: Number })
], Oe.prototype, "max", 2);
rt([
  g({ type: Boolean, reflect: !0 })
], Oe.prototype, "compact", 2);
rt([
  g({ type: String })
], Oe.prototype, "placeholder", 2);
Oe = rt([
  O("di-number-field")
], Oe);
var Og = Object.defineProperty, Cg = Object.getOwnPropertyDescriptor, nd = (e) => {
  throw TypeError(e);
}, oi = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Cg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Og(t, i, o), o;
}, Ag = (e, t, i) => t.has(e) || nd("Cannot " + i), Fg = (e, t, i) => t.has(e) ? nd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (Ag(e, t, "access private method"), i), u, b, be, rd, ld, cd, ar, ud, dd, pd, Zs, hd, md, yd, fd, gd, vd, Qs, bd, _d, en, wd, ao, $d, Td, or, We, Mi, xd, sr, kd;
const Pg = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let et = class extends C {
  constructor() {
    super(...arguments), Fg(this, u), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? d(this, u, hd).call(this, this.layer) : d(this, u, rd).call(this)}</div>` : h;
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
be = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
rd = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="stack">
          <di-number-field
            .min=${v.width.min}
            .max=${v.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => d(this, u, be).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${v.height.min}
            .max=${v.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => d(this, u, be).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${d(this, u, ld).call(this, e)}

        <umb-property-layout orientation="vertical" label="Base image">

          <div slot="editor" class="editor">
          <uui-select
            label="Base image source"
            .value=${e.baseImage.kind}
            .options=${Dd(e.baseImage.kind)}
            @change=${(t) => d(this, u, be).call(this, {
    baseImage: { ...e.baseImage, kind: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.baseImage.kind === "media" ? d(this, u, We).call(this, "Media item", d(this, u, or).call(this, e.baseImage.mediaKey, (t) => d(this, u, be).call(this, { baseImage: { ...e.baseImage, kind: "media", mediaKey: t } }))) : h}

        ${e.baseImage.kind === "path" ? r`<umb-property-layout orientation="vertical" label="Path">

              <div slot="editor" class="editor">
              <uui-input
                .value=${e.baseImage.path ?? ""}
                placeholder="/assets/og-background.png"
                @change=${(t) => d(this, u, be).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : h}

        ${e.baseImage.kind === "property" ? r`<umb-property-layout orientation="vertical" label="From property">

              <div slot="editor" class="editor">
              ${d(this, u, Mi).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, be).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.baseImageFit}
            .options=${K(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => d(this, u, be).call(this, { baseImageFit: t.target.value })}>
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
ld = function(e) {
  const t = fg(e);
  return r`
      <umb-property-layout orientation="vertical" label="Fill">

        <div slot="editor" class="editor">
        <uui-select
          .value=${t}
          .options=${K(["colour", "gradient", "transparent"], t)}
          @change=${(i) => d(this, u, cd).call(this, e, i.target.value)}>
        </uui-select>
      </div>

      </umb-property-layout>

      ${t === "colour" ? r`<umb-property-layout orientation="vertical" label="Colour">

            <div slot="editor" class="editor">
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => d(this, u, be).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </div>

          </umb-property-layout>` : h}

      ${t === "gradient" && e.backgroundGradient ? d(this, u, ar).call(this, e.backgroundGradient, (i) => d(this, u, be).call(this, { backgroundGradient: i })) : h}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : h}
    `;
};
cd = function(e, t) {
  if (t === "gradient") {
    d(this, u, be).call(this, { backgroundGradient: e.backgroundGradient ?? _c() });
    return;
  }
  d(this, u, be).call(this, {
    background: vg(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
ar = function(e, t) {
  const i = e.kind ?? "linear", a = i === "linear" || i === "reflected" || i === "angular", o = i === "radial" || i === "angular" || i === "diamond";
  return r`
      ${d(this, u, We).call(this, "Gradient type", r`
        <uui-select
          label="Gradient type"
          .value=${i}
          .options=${K(["linear", "radial", "angular", "diamond", "reflected"], i, Rg)}
          @change=${(s) => t({ ...e, kind: s.target.value })}>
        </uui-select>
      `)}

      <div class="gradient-preview" role="img" aria-label="The gradient" style="background: ${Nn(e)}"></div>

      ${a ? d(this, u, ud).call(this, e, t) : h}
      ${i === "radial" ? d(this, u, dd).call(this, e, t) : h}
      ${o ? r`
            ${d(this, u, Zs).call(this, "Centre X", e.centreX, (s) => t({ ...e, centreX: s }))}
            ${d(this, u, Zs).call(this, "Centre Y", e.centreY, (s) => t({ ...e, centreY: s }))}
          ` : h}

      ${d(this, u, pd).call(this, e, t)}
    `;
};
ud = function(e, t) {
  const i = Math.round(e.angle ?? 180) % 360, a = (o) => t({ ...e, angle: (Math.round(o) % 360 + 360) % 360 });
  return d(this, u, We).call(this, e.kind === "angular" ? "Start angle" : "Angle", r`
      <div class="angle">
        <uui-slider
          label="Angle"
          hide-step-values
          min="0"
          max="359"
          step="1"
          .value=${String(i)}
          @change=${(o) => a(Number(o.target.value))}>
        </uui-slider>
        <di-number-field
          label="Degrees"
          suffix="°"
          .min=${v.gradientAngle.min}
          .max=${v.gradientAngle.max}
          .value=${i}
          @change=${(o) => a(o.detail.value ?? 180)}>
        </di-number-field>
        <uui-button-group>
          ${Lg.map(([o, s, n]) => r`
            <uui-button
              compact
              look=${i === s ? "primary" : "secondary"}
              label=${n}
              title=${n}
              @click=${() => a(s)}>${o}</uui-button>
          `)}
        </uui-button-group>
      </div>
    `);
};
dd = function(e, t) {
  const i = e.shape ?? "ellipse", a = e.extent ?? "farthestCorner";
  return r`
      ${d(this, u, We).call(this, "Shape", r`
        <uui-select
          label="Radial shape"
          .value=${i}
          .options=${K(["ellipse", "circle"], i)}
          @change=${(o) => t({ ...e, shape: o.target.value })}>
        </uui-select>
      `)}
      ${d(this, u, We).call(this, "Size", r`
        <uui-select
          label="Radial size"
          .value=${a}
          .options=${K(["farthestCorner", "farthestSide", "closestCorner", "closestSide"], a, Mg)}
          @change=${(o) => t({ ...e, extent: o.target.value })}>
        </uui-select>
      `, "Where the last colour lands.")}
    `;
};
pd = function(e, t) {
  const i = kt(e);
  return d(this, u, We).call(this, "Colour stops", r`
      <div class="stops">
        ${i.map((a, o) => r`
          <div class="stop">
            <di-colour-input
              label="Stop ${o + 1} colour"
              .value=${a.colour}
              @change=${(s) => t(la(e, i.map((n, l) => l === o ? { ...n, colour: s.detail.value } : n)))}>
            </di-colour-input>
            <div class="stop-position">
              <di-number-field
                label="Position"
                suffix="%"
                .min=${0}
                .max=${100}
                .value=${Math.round(a.position * 100)}
                @change=${(s) => t(la(e, i.map((n, l) => l === o ? { ...n, position: (s.detail.value ?? 0) / 100 } : n)))}>
              </di-number-field>
              <uui-button
                compact
                look="secondary"
                color="danger"
                label="Remove stop ${o + 1}"
                ?disabled=${i.length <= 2}
                @click=${() => t(Bf(e, o))}>
                <uui-icon name="icon-trash"></uui-icon>
              </uui-button>
            </div>
          </div>
        `)}
        <div class="stop-actions">
          <uui-button look="secondary" label="Add stop" @click=${() => t(Nf(e))}>
            <uui-icon name="icon-add"></uui-icon> Add stop
          </uui-button>
          <uui-button look="secondary" label="Reverse the gradient" @click=${() => t(Uf(e))}>
            <uui-icon name="icon-sync"></uui-icon> Reverse
          </uui-button>
        </div>
      </div>
    `);
};
Zs = function(e, t, i) {
  return r`<di-number-field
      .min=${v.gradientCentre.min * 100}
      .max=${v.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
hd = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, md).call(this, e) : h}
      ${e.type === "text" ? d(this, u, yd).call(this, e) : h}
      ${e.type === "image" ? d(this, u, fd).call(this, e) : h}
      ${e.type === "badges" ? d(this, u, gd).call(this, e) : h}
      ${e.type === "rect" ? d(this, u, bd).call(this, e) : h}
      ${d(this, u, _d).call(this, e)} ${d(this, u, Td).call(this, e)}
    `;
};
md = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${K(
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

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? d(this, u, We).call(this, "Property", d(this, u, Mi).call(this, t.propertyAlias ?? "", (i) => d(this, u, b).call(this, { binding: { ...t, propertyAlias: i } }))) : h}

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
yd = function(e) {
  const t = e.style, i = (a) => d(this, u, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <umb-property-layout orientation="vertical" label="Font">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, sr).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${d(this, u, kd).call(this, t.fontKey, t.styleName ?? "", (a, o, s) => i({ styleName: a || null, fontSize: o ?? t.fontSize, fontStyle: s ?? t.fontStyle }))}

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
              .options=${K(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${K(["left", "centre", "right"], t.textAlign)}
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
              .options=${K(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${K(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
fd = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${Dd(t.kind)}
            @change=${(a) => d(this, u, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" ? d(this, u, We).call(this, "Property", d(this, u, Mi).call(
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

        ${t.kind === "media" ? d(this, u, We).call(this, "Media item", d(this, u, or).call(this, t.mediaKey, (a) => d(this, u, b).call(this, { source: { ...t, kind: "media", mediaKey: a } }))) : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.fit}
            .options=${K(["cover", "contain", "stretch"], e.fit)}
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
    var s;
    const o = a.detail.value ?? 0;
    d(this, u, b).call(this, {
      border: o > 0 ? { width: o, colour: ((s = e.border) == null ? void 0 : s.colour) ?? "#FFFFFF" } : null
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
gd = function(e) {
  const t = (o) => d(this, u, b).call(this, { badge: { ...e.badge, ...o } }), i = (o) => d(this, u, b).call(this, { label: { ...e.label, ...o } }), a = (o) => d(this, u, b).call(this, { icon: { ...e.icon, ...o } });
  return r`
      <uui-box headline="Badges">
        <umb-property-layout orientation="vertical" label="Items from">

          <div slot="editor" class="editor">
          ${d(this, u, Mi).call(this, e.itemsPropertyAlias, (o) => d(this, u, b).call(this, { itemsPropertyAlias: o }))}
        </div>

        </umb-property-layout>

        <div class="stack">
          <di-number-field
            .min=${v.maxItems.min}
            .max=${v.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(o) => d(this, u, b).call(this, { maxItems: o.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${v.gap.min}
            .max=${v.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(o) => d(this, u, b).call(this, { gap: o.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <umb-property-layout orientation="vertical" label="Direction">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.direction}
            .options=${K(["horizontal", "vertical"], e.direction)}
            @change=${(o) => d(this, u, b).call(this, { direction: o.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.direction === "horizontal" ? r`
              <umb-property-layout orientation="vertical" label="Wrap onto new rows">

                <div slot="editor" class="editor">
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(o) => d(this, u, b).call(this, { wrap: o.target.checked })}>
                </uui-toggle>
              </div>

              </umb-property-layout>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${v.rowGap.min}
                      .max=${v.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(o) => d(this, u, b).call(this, { rowGap: o.detail.value ?? 20 })}>
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
            @change=${(o) => t({ size: o.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
            .min=${v.iconSize.min}
            .max=${v.iconSize.max}
            label="Icon size"
            .value=${e.badge.innerSize}
            @change=${(o) => t({ innerSize: o.detail.value ?? 44 })}>
          </di-number-field>
        </div>

        <umb-property-layout orientation="vertical" label="Circle fill">

          <div slot="editor" class="editor">
          <di-colour-input
            label="Circle fill"
            .value=${e.badge.fillColour}
            @change=${(o) => t({ fillColour: o.detail.value })}>
          </di-colour-input>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Circle border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-colour-input
              label="Circle border colour"
              .value=${e.badge.borderColour}
              @change=${(o) => t({ borderColour: o.detail.value })}>
            </di-colour-input>
            <di-number-field
              .min=${v.borderWidth.min}
              .max=${v.borderWidth.max}
              label="Width"
              step="0.5"
              .value=${e.badge.borderWidth}
              @change=${(o) => t({ borderWidth: o.detail.value ?? 1.5 })}>
            </di-number-field>
          </div>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Icon folder">

          <div slot="editor" class="editor">
          <uui-input
            .value=${e.icon.basePath}
            placeholder="/assets/og-icons"
            @change=${(o) => a({ basePath: o.target.value })}>
          </uui-input>
          <small class="hint">Icons are matched by slugifying the item's name, with default.png as a fallback.</small>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Label position">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.label.position}
            .options=${K(["below", "right", "none"], e.label.position, {
    below: "Below the icon",
    right: "Beside the icon",
    none: "Icon only"
  })}
            @change=${(o) => i({ position: o.target.value })}>
          </uui-select>
          ${e.label.position === "right" ? r`<small class="hint">Each badge is as wide as its own label.</small>` : h}
        </div>

        </umb-property-layout>

        ${e.label.position === "none" ? h : r`
              <umb-property-layout orientation="vertical" label="Label font">

                <div slot="editor" class="editor">
                <uui-select
                  .value=${e.label.fontKey}
                  .options=${d(this, u, sr).call(this, e.label.fontKey)}
                  @change=${(o) => i({ fontKey: o.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>

              <div class="stack">
                <di-number-field
                  .min=${v.labelSize.min}
                  .max=${v.labelSize.max}
                  label="Label size"
                  .value=${e.label.fontSize}
                  @change=${(o) => i({ fontSize: o.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
                  .min=${v.labelGap.min}
                  .max=${v.labelGap.max}
                  label="Label gap"
                  .value=${e.label.gap}
                  @change=${(o) => i({ gap: o.detail.value ?? 10 })}>
                </di-number-field>
              </div>

              <umb-property-layout orientation="vertical" label="Label colour">

                <div slot="editor" class="editor">
                <di-colour-input
                  label="Label colour"
                  .value=${e.label.colour}
                  @change=${(o) => i({ colour: o.detail.value })}>
                </di-colour-input>
              </div>

              </umb-property-layout>

              <umb-property-layout orientation="vertical" label="Label transform">

                <div slot="editor" class="editor">
                <uui-select
                  .value=${e.label.textTransform}
                  .options=${K(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(o) => i({ textTransform: o.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>
            `}
      </uui-box>
    `;
};
vd = function(e, t) {
  if (t === "circle") {
    const a = e.size.width ?? e.size.height ?? 200;
    d(this, u, b).call(this, { shape: "ellipse", lockAspect: !0, size: { ...e.size, width: a, height: a } });
    return;
  }
  const i = tn(e) === "circle";
  d(this, u, b).call(this, {
    shape: t,
    ...i ? { lockAspect: !1 } : {}
  });
};
Qs = function(e, t, i) {
  const a = e.type === "rect" && e.lockAspect === !0, { width: o, height: s } = e.size;
  if (!a || i === null || !o || !s) {
    d(this, u, b).call(this, { size: { ...e.size, [t]: i } });
    return;
  }
  const n = t === "width" ? { width: i, height: Math.round(i * s / o) } : { width: Math.round(i * o / s), height: i };
  d(this, u, b).call(this, { size: n });
};
bd = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <umb-property-layout orientation="vertical" label="Shape">

          <div slot="editor" class="editor">
          <uui-select
            .value=${tn(e)}
            .options=${K(["rectangle", "circle", "ellipse", "polygon", "star"], tn(e))}
            @change=${(o) => d(this, u, vd).call(this, e, o.target.value)}>
          </uui-select>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Lock aspect ratio">

          <div slot="editor" class="editor">
          <uui-toggle
            label="Lock aspect ratio"
            ?checked=${e.lockAspect === !0}
            @change=${(o) => d(this, u, b).call(this, { lockAspect: o.target.checked })}>
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
                  @change=${(o) => d(this, u, b).call(this, { sides: Math.round(o.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${v.innerRatio.min}
                      .max=${v.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(o) => d(this, u, b).call(this, { innerRatio: o.detail.value ?? 0.5 })}>
                    </di-number-field>` : h}
              </div>
            ` : h}

        <umb-property-layout orientation="vertical" label="Fill">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${i}
            @change=${(o) => d(this, u, b).call(this, { fill: o.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${i ? r`<umb-property-layout orientation="vertical" label="Fill colour">

              <div slot="editor" class="editor">
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(o) => d(this, u, b).call(this, { fill: o.detail.value })}>
              </di-colour-input>
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Gradient">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(o) => d(this, u, b).call(this, {
    gradient: o.target.checked ? _c() : null
  })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${e.gradient ? d(this, u, ar).call(this, e.gradient, (o) => d(this, u, b).call(this, { gradient: o })) : h}

        ${t === "rectangle" ? r`<di-number-field
            .min=${v.cornerRadius.min}
            .max=${v.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(o) => d(this, u, b).call(this, { cornerRadius: o.detail.value ?? 0 })}>
            </di-number-field>` : h}

        <umb-property-layout orientation="vertical" label="Border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-number-field
              .min=${v.borderWidth.min}
              .max=${v.borderWidth.max}
              label="Width"
              .value=${((a = e.border) == null ? void 0 : a.width) ?? 0}
              @change=${(o) => {
    var n;
    const s = o.detail.value ?? 0;
    d(this, u, b).call(this, {
      border: s > 0 ? { width: s, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(o) => d(this, u, b).call(this, { border: { ...e.border, colour: o.detail.value } })}>
                </di-colour-input>` : h}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
_d = function(e) {
  const t = ze(e.position, "x"), i = ze(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${d(this, u, en).call(this, e, "x")} ${d(this, u, en).call(this, e, "y")}

        <umb-property-layout orientation="vertical" label="Anchor">

          <div slot="editor" class="editor">
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(o) => d(this, u, $d).call(this, e, o.detail.value)}>
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
            @change=${(o) => d(this, u, b).call(this, { rotation: $c(o.detail.value ?? 0) })}>
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
            @change=${(o) => d(this, u, Qs).call(this, e, "width", o.detail.value)}>
          </di-number-field>
          <di-number-field
            .min=${v.height.min}
            .max=${v.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(o) => d(this, u, Qs).call(this, e, "height", o.detail.value)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
en = function(e, t) {
  const i = ze(e.position, t), a = ho(e.position, t), o = this.template.layers.filter((n) => n.key !== e.key), s = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => d(this, u, wd).call(this, e, t, n.target.value)}>
          </uui-select>
          ${!i && o.length === 0 ? r`<small class="hint">Add another layer to position this one against it.</small>` : h}
        </div>

        </umb-property-layout>

        ${i && a ? r`
              <umb-property-layout orientation="vertical" label="Tracks">

                <div slot="editor" class="editor">
                <div class="stack">
                  <uui-select
                    .value=${a.layerKey}
                    .options=${o.map((n) => ({
    name: n.name || n.type,
    value: n.key,
    selected: n.key === a.layerKey
  }))}
                    @change=${(n) => d(this, u, ao).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${K(s, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => d(this, u, ao).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </div>

              </umb-property-layout>

              <di-number-field
                .min=${v.referenceGap.min}
                .max=${v.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => d(this, u, ao).call(this, e, t, { gap: n.detail.value ?? 0 })}>
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
wd = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (ze(e.position, t)) return;
  const a = this.template.layers.findIndex((s) => s.key === e.key), o = this.template.layers[a - 1] ?? this.template.layers.find((s) => s.key !== e.key);
  o && d(this, u, b).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: o.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Vh
      }
    }
  });
};
ao = function(e, t, i) {
  const a = ho(e.position, t);
  a && d(this, u, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
$d = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, o = i > 0 && a > 0 ? Bh(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, b).call(this, { position: o });
};
Td = function(e) {
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
            .options=${K(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
              ${d(this, u, Mi).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, b).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </div>

            </umb-property-layout>` : h}
      </uui-box>
    `;
};
or = function(e, t) {
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
      <umb-property-layout orientation="vertical" label=${e} description=${aa(i)}>
        <div slot="editor" class="editor">${t}</div>
      </umb-property-layout>
    `;
};
Mi = function(e, t, i = {}) {
  const a = Jh(e), o = [];
  for (let s = 0; s <= ws; s++) {
    const n = Er(a, s), l = s === 0 ? this.properties : this.linkedProperties[n] ?? [], p = a[s] ?? "";
    if (s > 0) {
      const D = (s === 1 ? this.properties : this.linkedProperties[Er(a, s - 1)] ?? []).some(
        (q) => q.alias === a[s - 1] && q.classification === "content"
      );
      if (!a[s - 1] || !D && !p) break;
    }
    const m = d(this, u, xd).call(this, Pg(l, s === 0 ? i.root : i.tail), p, (S) => t([...a.slice(0, s), S].filter(Boolean).join(".")));
    o.push(s === 0 ? m : r`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[n] ?? "Property on the linked item"}</span>
            ${m}
          </div>`);
  }
  return o.length === 1 ? o[0] : r`<div class="path">${o}</div>`;
};
xd = function(e, t, i) {
  return r`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${im(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
sr = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
kd = function(e, t, i) {
  const a = this.fonts.find((o) => o.key === e);
  return !a || a.styles.length === 0 ? h : r`
      <umb-property-layout orientation="vertical" label="Named style">

        <div slot="editor" class="editor">
        <uui-select
          .value=${t}
          .options=${[
    { name: "- custom -", value: "" },
    ...a.styles.map((o) => ({
      name: `${o.name} (${o.size}px)`,
      value: o.name,
      selected: o.name === t
    }))
  ]}
          @change=${(o) => {
    const s = o.target.value, n = a.styles.find((l) => l.name === s);
    i(s, n == null ? void 0 : n.size, n == null ? void 0 : n.fontStyle);
  }}>
        </uui-select>
      </div>

      </umb-property-layout>
    `;
};
et.styles = F`
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
oi([
  g({ type: Object })
], et.prototype, "template", 2);
oi([
  g({ type: Object })
], et.prototype, "layer", 2);
oi([
  g({ type: Array })
], et.prototype, "properties", 2);
oi([
  g({ type: Object })
], et.prototype, "linkedProperties", 2);
oi([
  g({ type: Object })
], et.prototype, "linkedCaptions", 2);
oi([
  g({ type: Array })
], et.prototype, "fonts", 2);
et = oi([
  O("di-layer-inspector")
], et);
function K(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
const Rg = {
  linear: "Linear",
  radial: "Radial",
  angular: "Angular (conic)",
  diamond: "Diamond",
  reflected: "Reflected"
}, Mg = {
  farthestCorner: "Farthest corner",
  farthestSide: "Farthest side",
  closestCorner: "Closest corner",
  closestSide: "Closest side"
}, Lg = [
  ["↑", 0, "Upwards (0°)"],
  ["→", 90, "To the right (90°)"],
  ["↓", 180, "Downwards (180°)"],
  ["←", 270, "To the left (270°)"]
];
function Dd(e) {
  return K(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
function tn(e) {
  const t = e.shape ?? "rectangle";
  return t === "ellipse" && e.lockAspect === !0 ? "circle" : t;
}
var zg = Object.defineProperty, Wg = Object.getOwnPropertyDescriptor, Sd = (e) => {
  throw TypeError(e);
}, Aa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Wg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && zg(t, i, o), o;
}, Ug = (e, t, i) => t.has(e) || Sd("Cannot " + i), Ng = (e, t, i) => t.has(e) ? Sd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pe = (e, t, i) => (Ug(e, t, "access private method"), i), _e, Rt, Ed, Id, Od, Cd;
const Bg = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let ei = class extends C {
  constructor() {
    super(...arguments), Ng(this, _e), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Pe(this, _e, Od)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : ae(
      e,
      (t) => t.key,
      (t, i) => Pe(this, _e, Cd).call(this, t, i)
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
Rt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Ed = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Id = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Od = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Pe(this, _e, Rt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Cd = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Pe(this, _e, Ed).call(this, a, e.key)}
        @dragover=${(a) => Pe(this, _e, Id).call(this, a, t)}
        @click=${() => Pe(this, _e, Rt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Bg[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Pe(this, _e, Rt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Pe(this, _e, Rt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Pe(this, _e, Rt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Pe(this, _e, Rt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
ei.styles = F`
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
Aa([
  g({ type: Array })
], ei.prototype, "layers", 2);
Aa([
  g({ type: String })
], ei.prototype, "selectedLayerKey", 2);
Aa([
  y()
], ei.prototype, "_dragKey", 2);
Aa([
  y()
], ei.prototype, "_dropIndex", 2);
ei = Aa([
  O("di-layers-panel")
], ei);
var jg = Object.defineProperty, Kg = Object.getOwnPropertyDescriptor, Ad = (e) => {
  throw TypeError(e);
}, lt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Kg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && jg(t, i, o), o;
}, nr = (e, t, i) => t.has(e) || Ad("Cannot " + i), Vg = (e, t, i) => (nr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ul = (e, t, i) => t.has(e) ? Ad("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qg = (e, t, i, a) => (nr(e, t, "write to private field"), t.set(e, i), i), ne = (e, t, i) => (nr(e, t, "access private method"), i), H, Be, Ao, Fd, Pd, Gi;
let Ce = class extends C {
  constructor() {
    super(...arguments), Ul(this, H), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Ul(this, Ao, 100);
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
          <!-- One segmented control, [-|27 %|+], the way Figma, Photoshop and Affinity draw zoom:
               every segment the same height and edge to edge, and no caption above the number -
               the old "Zoom" label pushed the field below the buttons either side of it.
               Stepping multiplies the *effective* scale, so stepping up out of Fit lands one
               step above what is on screen rather than jumping to 125%. -->
          <div class="segmented" role="group" aria-label="Zoom">
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
              .min=${Io.min * 100}
              .max=${Io.max * 100}
              .value=${ne(this, H, Fd).call(this)}
              @change=${ne(this, H, Pd)}>
            </di-number-field>
            <uui-button
              compact
              look="secondary"
              label="Zoom in"
              @click=${() => ne(this, H, Be).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
              <uui-icon name="icon-zoom-in"></uui-icon>
            </uui-button>
          </div>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => ne(this, H, Be).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${ne(this, H, Gi).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${ne(this, H, Gi).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${ne(this, H, Gi).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${ne(this, H, Gi).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
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
Ao = /* @__PURE__ */ new WeakMap();
Fd = function() {
  return this.matches(":focus-within") || qg(this, Ao, Math.round(this.effectiveScale * 100)), Vg(this, Ao);
};
Pd = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && ne(this, H, Be).call(this, "di-zoom-change", { zoom: t / 100 });
};
Gi = function(e, t, i) {
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
Ce.styles = F`
    :host {
      display: block;
      border-bottom: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .toolbar {
      /* One height for every control in the row, so nothing sits a few pixels proud of its
         neighbour - the field and the buttons especially. */
      --di-toolbar-control-height: var(--uui-size-11, 33px);
      --uui-button-height: var(--di-toolbar-control-height);

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

    /* The three segments butt together and only the outer corners are rounded. */
    .segmented {
      display: flex;
      align-items: stretch;
      height: var(--di-toolbar-control-height);
    }

    .segmented uui-button {
      --uui-button-border-radius: 0;
    }

    .segmented uui-button:first-child {
      --uui-button-border-radius: var(--uui-border-radius) 0 0 var(--uui-border-radius);
    }

    .segmented uui-button:last-child {
      --uui-button-border-radius: 0 var(--uui-border-radius) var(--uui-border-radius) 0;
    }

    /* A fixed narrow width, so the toolbar row does not shuffle sideways as the readout goes
       from 27 to 100 to 400. This is what the old span's min-width was for. */
    .value {
      --di-number-field-border-radius: 0;
      width: 56px;
      height: 100%;
      font-size: 12px;
    }
  `;
lt([
  g({ type: Number })
], Ce.prototype, "effectiveScale", 2);
lt([
  g({ type: Boolean })
], Ce.prototype, "snapEnabled", 2);
lt([
  g({ type: Boolean })
], Ce.prototype, "showRulers", 2);
lt([
  g({ type: Boolean })
], Ce.prototype, "showSafeArea", 2);
lt([
  g({ type: Boolean })
], Ce.prototype, "showMeasured", 2);
lt([
  g({ type: Boolean })
], Ce.prototype, "canUndo", 2);
lt([
  g({ type: Boolean })
], Ce.prototype, "canRedo", 2);
lt([
  g({ type: Boolean })
], Ce.prototype, "previewing", 2);
Ce = lt([
  O("di-canvas-toolbar")
], Ce);
var Gg = Object.defineProperty, Yg = Object.getOwnPropertyDescriptor, Rd = (e) => {
  throw TypeError(e);
}, rr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Yg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Gg(t, i, o), o;
}, lr = (e, t, i) => t.has(e) || Rd("Cannot " + i), hi = (e, t, i) => (lr(e, t, "read from private field"), t.get(e)), Va = (e, t, i) => t.has(e) ? Rd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), an = (e, t, i, a) => (lr(e, t, "write to private field"), t.set(e, i), i), Nl = (e, t, i) => (lr(e, t, "access private method"), i), Ri, oo, ta, so, Md, Ld;
let pa = class extends C {
  constructor() {
    super(), Va(this, so), Va(this, Ri), this._selection = [], Va(this, oo, ""), Va(this, ta), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(Dt, (e) => {
      an(this, Ri, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== hi(this, oo) && (an(this, oo, i), Nl(this, so, Md).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
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
          @change=${Nl(this, so, Ld)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
Ri = /* @__PURE__ */ new WeakMap();
oo = /* @__PURE__ */ new WeakMap();
ta = /* @__PURE__ */ new WeakMap();
so = /* @__PURE__ */ new WeakSet();
Md = async function(e) {
  if (!hi(this, Ri)) return;
  hi(this, ta) ?? an(this, ta, dc(hi(this, Ri).getToken).catch(() => []));
  const t = await hi(this, ta), i = new Set(e), a = t.filter((o) => i.has(o.alias)).map((o) => o.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
Ld = function(e) {
  var i;
  const t = e.target.selection;
  (i = hi(this, Ri)) == null || i.setSampleContentKey(t[0]);
};
pa.styles = F`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
rr([
  y()
], pa.prototype, "_selection", 2);
rr([
  y()
], pa.prototype, "_allowedContentTypeIds", 2);
pa = rr([
  O("di-preview-content-picker")
], pa);
var Hg = Object.defineProperty, Xg = Object.getOwnPropertyDescriptor, zd = (e) => {
  throw TypeError(e);
}, Fa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Xg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Hg(t, i, o), o;
}, cr = (e, t, i) => t.has(e) || zd("Cannot " + i), J = (e, t, i) => (cr(e, t, "read from private field"), t.get(e)), Ot = (e, t, i) => t.has(e) ? zd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qt = (e, t, i, a) => (cr(e, t, "write to private field"), t.set(e, i), i), Ve = (e, t, i) => (cr(e, t, "access private method"), i), ht, gi, vi, Gt, Fo, Po, De, ur, no, dr, on;
const Jg = 400;
let ti = class extends C {
  constructor() {
    super(), Ot(this, De), Ot(this, ht), Ot(this, gi), Ot(this, vi), Ot(this, Gt), Ot(this, Fo), Ot(this, Po, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(Dt, (e) => {
      qt(this, ht, e), e && (this.observe(e.template, (t) => {
        t && Ve(this, De, no).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        qt(this, Fo, t);
        const i = (a = J(this, ht)) == null ? void 0 : a.getData();
        i && Ve(this, De, no).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        qt(this, Po, t ?? !0);
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
    const e = (t = J(this, ht)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(J(this, gi)), this._collapsed = !1, Ve(this, De, dr).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(J(this, gi)), (e = J(this, vi)) == null || e.abort(), Ve(this, De, ur).call(this);
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
        const t = (e = J(this, ht)) == null ? void 0 : e.getData();
        t && Ve(this, De, no).call(this, t);
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
ht = /* @__PURE__ */ new WeakMap();
gi = /* @__PURE__ */ new WeakMap();
vi = /* @__PURE__ */ new WeakMap();
Gt = /* @__PURE__ */ new WeakMap();
Fo = /* @__PURE__ */ new WeakMap();
Po = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakSet();
ur = function() {
  J(this, Gt) && (URL.revokeObjectURL(J(this, Gt)), qt(this, Gt, void 0));
};
no = function(e) {
  this._collapsed || (window.clearTimeout(J(this, gi)), qt(this, gi, window.setTimeout(() => void Ve(this, De, dr).call(this, e), Jg)));
};
dr = async function(e) {
  var t;
  if (J(this, ht)) {
    (t = J(this, vi)) == null || t.abort(), qt(this, vi, new AbortController()), Ve(this, De, on).call(this, !0), this._error = void 0;
    try {
      const i = await pc(
        e,
        {
          signal: J(this, vi).signal,
          contentKey: J(this, Fo),
          useSampleData: J(this, Po)
        },
        J(this, ht).getToken
      );
      Ve(this, De, ur).call(this), qt(this, Gt, URL.createObjectURL(i)), this._url = J(this, Gt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ve(this, De, on).call(this, !1);
    }
  }
};
on = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
ti.styles = F`
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
      ${jn}
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
Fa([
  y()
], ti.prototype, "_url", 2);
Fa([
  y()
], ti.prototype, "_loading", 2);
Fa([
  y()
], ti.prototype, "_error", 2);
Fa([
  y()
], ti.prototype, "_collapsed", 2);
ti = Fa([
  O("di-preview-strip")
], ti);
var Zg = Object.defineProperty, Qg = Object.getOwnPropertyDescriptor, Wd = (e) => {
  throw TypeError(e);
}, V = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Qg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Zg(t, i, o), o;
}, pr = (e, t, i) => t.has(e) || Wd("Cannot " + i), x = (e, t, i) => (pr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), li = (e, t, i) => t.has(e) ? Wd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ro = (e, t, i, a) => (pr(e, t, "write to private field"), t.set(e, i), i), xe = (e, t, i) => (pr(e, t, "access private method"), i), I, ha, ma, bi, B, sn, hr, Ud, Nd, nn, Bd, jd, Kd, rn, Vd, qd, Gd, ro;
const ev = 400;
let L = class extends C {
  constructor() {
    super(), li(this, B), li(this, I), li(this, ha), li(this, ma), li(this, bi), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, li(this, ro, (e) => {
      var s;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = x(this, I);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const o = x(this, B, sn);
      if (o) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(o.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), xe(this, B, nn).call(this, o.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, p = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, m = ze(o.position, "x") ? 0 : l, S = ze(o.position, "y") ? 0 : p;
            if (m === 0 && S === 0) break;
            i.updateLayer(o.key, {
              position: { ...o.position, x: o.position.x + m, y: o.position.y + S }
            });
            break;
          }
          case "[":
          case "]": {
            const n = ((s = this._template) == null ? void 0 : s.layers.findIndex((l) => l.key === o.key)) ?? -1;
            if (n < 0) return;
            e.preventDefault(), i.moveLayer(o.key, e.key === "]" ? n + 1 : n - 1);
            break;
          }
        }
      }
    }), this.consumeContext(N, (e) => {
      Ro(this, ha, e);
    }), this.consumeContext(Dt, (e) => {
      Ro(this, I, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (xe(this, B, Bd).call(this, t), xe(this, B, jd).call(this, t), xe(this, B, Kd).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", x(this, ro));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", x(this, ro)), window.clearTimeout(x(this, ma)), (e = x(this, bi)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = x(this, I)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = x(this, I)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = x(this, I)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => xe(this, B, nn).call(this, e.detail.key)}
        @di-layer-detach=${(e) => xe(this, B, Nd).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = x(this, I)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = x(this, I)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = x(this, I)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = x(this, I)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = x(this, I)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = x(this, I)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => xe(this, B, rn).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => xe(this, B, rn).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-use-image-size=${xe(this, B, Gd)}
        @di-request-preview=${() => {
      var e;
      return (e = x(this, B, Ud)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(Io.min, Math.min(Io.max, e.detail.zoom));
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
      return (e = x(this, I)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = x(this, I)) == null ? void 0 : e.redo();
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
            .layer=${x(this, B, sn)}
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
I = /* @__PURE__ */ new WeakMap();
ha = /* @__PURE__ */ new WeakMap();
ma = /* @__PURE__ */ new WeakMap();
bi = /* @__PURE__ */ new WeakMap();
B = /* @__PURE__ */ new WeakSet();
sn = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
hr = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Ud = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Nd = function(e, t) {
  var o, s, n;
  const i = (o = this._template) == null ? void 0 : o.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (s = x(this, B, hr)) == null ? void 0 : s.resolvedPositionOf(e);
  (n = x(this, I)) == null || n.updateLayer(e, { position: _s(i.position, t, a) });
};
nn = function(e) {
  var i, a, o;
  const t = /* @__PURE__ */ new Map();
  for (const s of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = x(this, B, hr)) == null ? void 0 : a.resolvedPositionOf(s.key);
    n && t.set(s.key, n);
  }
  (o = x(this, I)) == null || o.removeLayer(e, t);
};
Bd = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && x(this, I) && await Ly(t, x(this, I).getToken);
};
jd = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !x(this, I)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await mc(t.mediaKey, x(this, I).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Kd = function() {
  window.clearTimeout(x(this, ma)), Ro(this, ma, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !x(this, I))) {
      (t = x(this, bi)) == null || t.abort(), Ro(this, bi, new AbortController());
      try {
        const i = await hc(
          e,
          { signal: x(this, bi).signal, useSampleData: !0 },
          x(this, I).getToken
        );
        x(this, I).setServerBounds(i.layers), x(this, I).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, ev));
};
rn = function(e, t, i, a) {
  const o = this._template;
  if (!o || !x(this, I)) return;
  const s = { template: o, x: t, y: i, defaultFontKey: xe(this, B, qd).call(this) };
  if (e.kind === "property") {
    const l = Wh(e.property, s);
    if (l.kind === "condition") {
      xe(this, B, Vd).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    x(this, I).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? vc(s, "Image") : e.layerType === "badges" ? bc(s, "Badges", "") : e.layerType === "rect" ? Lh(s, "Shape", e.preset) : gc(s, "Text", { kind: "static", text: "Text" });
  x(this, I).addLayer(n);
};
Vd = function(e, t, i) {
  var s, n, l, p;
  const a = i ?? this._selectedKey, o = (s = this._template) == null ? void 0 : s.layers.find((m) => m.key === a);
  if (!o) {
    (n = x(this, ha)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = x(this, I)) == null || l.updateLayer(o.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (p = x(this, ha)) == null || p.peek("positive", {
    data: { message: `'${o.name}' now shows only when '${t}' is ticked.` }
  });
};
qd = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Gd = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !x(this, I)) return;
  const t = await mc(e.mediaKey, x(this, I).getToken).catch(() => {
  });
  t && x(this, I).updateCanvas({ width: t.width, height: t.height });
};
ro = /* @__PURE__ */ new WeakMap();
L.styles = F`
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
], L.prototype, "_template", 2);
V([
  y()
], L.prototype, "_selectedKey", 2);
V([
  y()
], L.prototype, "_properties", 2);
V([
  y()
], L.prototype, "_linkedProperties", 2);
V([
  y()
], L.prototype, "_linkedCaptions", 2);
V([
  y()
], L.prototype, "_fonts", 2);
V([
  y()
], L.prototype, "_serverBounds", 2);
V([
  y()
], L.prototype, "_baseImageUrl", 2);
V([
  y()
], L.prototype, "_zoom", 2);
V([
  y()
], L.prototype, "_effectiveScale", 2);
V([
  y()
], L.prototype, "_previewing", 2);
V([
  y()
], L.prototype, "_snapEnabled", 2);
V([
  y()
], L.prototype, "_showRulers", 2);
V([
  y()
], L.prototype, "_showSafeArea", 2);
V([
  y()
], L.prototype, "_showMeasured", 2);
V([
  y()
], L.prototype, "_canUndo", 2);
V([
  y()
], L.prototype, "_canRedo", 2);
L = V([
  O("di-design-view")
], L);
const tv = L, iv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return L;
  },
  default: tv
}, Symbol.toStringTag, { value: "Module" }));
var av = Object.defineProperty, ov = Object.getOwnPropertyDescriptor, Yd = (e) => {
  throw TypeError(e);
}, ct = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? ov(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && av(t, i, o), o;
}, mr = (e, t, i) => t.has(e) || Yd("Cannot " + i), ee = (e, t, i) => (mr(e, t, "read from private field"), t.get(e)), Ui = (e, t, i) => t.has(e) ? Yd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ya = (e, t, i, a) => (mr(e, t, "write to private field"), t.set(e, i), i), dt = (e, t, i) => (mr(e, t, "access private method"), i), Le, fa, _i, Yt, Fe, yr, lo, Hd, Xd, Jd;
let ye = class extends C {
  constructor() {
    super(), Ui(this, Fe), Ui(this, Le), Ui(this, fa), Ui(this, _i), Ui(this, Yt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(N, (e) => {
      ya(this, fa, e);
    }), this.consumeContext(Dt, (e) => {
      ya(this, Le, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, dt(this, Fe, lo).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), dt(this, Fe, lo).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ee(this, _i)) == null || e.abort(), dt(this, Fe, yr).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => dt(this, Fe, lo).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${dt(this, Fe, Xd)}>
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
                ${ae(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => dt(this, Fe, Jd).call(this, e)
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
                @click=${dt(this, Fe, Hd)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : h}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
Le = /* @__PURE__ */ new WeakMap();
fa = /* @__PURE__ */ new WeakMap();
_i = /* @__PURE__ */ new WeakMap();
Yt = /* @__PURE__ */ new WeakMap();
Fe = /* @__PURE__ */ new WeakSet();
yr = function() {
  ee(this, Yt) && (URL.revokeObjectURL(ee(this, Yt)), ya(this, Yt, void 0));
};
lo = async function() {
  var i;
  const e = this._template;
  if (!e || !ee(this, Le)) return;
  (i = ee(this, _i)) == null || i.abort(), ya(this, _i, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: ee(this, _i).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, o] = await Promise.all([
      pc(e, t, ee(this, Le).getToken),
      hc(e, t, ee(this, Le).getToken)
    ]);
    dt(this, Fe, yr).call(this), ya(this, Yt, URL.createObjectURL(a)), this._url = ee(this, Yt), this._bounds = o.layers, this._skipped = o.skipped ?? [], ee(this, Le).setServerBounds(o.layers), ee(this, Le).setIssues(o.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Hd = async function() {
  var e, t;
  if (!(!this._contentKey || !ee(this, Le))) {
    this._regenerating = !0;
    try {
      const i = await mn(this._contentKey, ee(this, Le).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = ee(this, fa)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = ee(this, fa)) == null || t.peek("danger", {
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
Xd = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Jd = function(e) {
  var i;
  const t = this._bounds.find((a) => a.key === e.key);
  if (!t) {
    const a = (i = this._skipped.find((o) => o.key === e.key)) == null ? void 0 : i.reason;
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
ye.styles = F`
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
      ${jn}
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
ct([
  y()
], ye.prototype, "_template", 2);
ct([
  y()
], ye.prototype, "_contentKey", 2);
ct([
  y()
], ye.prototype, "_bounds", 2);
ct([
  y()
], ye.prototype, "_skipped", 2);
ct([
  y()
], ye.prototype, "_url", 2);
ct([
  y()
], ye.prototype, "_loading", 2);
ct([
  y()
], ye.prototype, "_error", 2);
ct([
  y()
], ye.prototype, "_regenerating", 2);
ye = ct([
  O("di-preview-view")
], ye);
const sv = ye, nv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return ye;
  },
  default: sv
}, Symbol.toStringTag, { value: "Module" }));
var rv = Object.defineProperty, lv = Object.getOwnPropertyDescriptor, Zd = (e) => {
  throw TypeError(e);
}, Pa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? lv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && rv(t, i, o), o;
}, fr = (e, t, i) => t.has(e) || Zd("Cannot " + i), Z = (e, t, i) => (fr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Bl = (e, t, i) => t.has(e) ? Zd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), cv = (e, t, i, a) => (fr(e, t, "write to private field"), t.set(e, i), i), mi = (e, t, i) => (fr(e, t, "access private method"), i), le, he, Qd, ep, Mo, tp, ip, ap, op, sp, np;
let tt = class extends C {
  constructor() {
    super(), Bl(this, he), Bl(this, le), this._properties = [], this._showAdvanced = !1, this.consumeContext(Dt, (e) => {
      cv(this, le, e), e && (dc(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${mi(this, he, ap).call(this)} ${mi(this, he, op).call(this)} ${mi(this, he, sp).call(this)} ${mi(this, he, np).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
le = /* @__PURE__ */ new WeakMap();
he = /* @__PURE__ */ new WeakSet();
Qd = function() {
  return this._properties.filter((e) => e.classification === "media");
};
ep = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
Mo = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
tp = async function(e) {
  var o, s;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((n) => [n.key, n.alias])), a = [
    ...t.map((n) => i.get(n)).filter((n) => !!n),
    ...Z(this, he, Mo)
  ].filter((n, l, p) => p.indexOf(n) === l);
  (o = Z(this, le)) == null || o.updateTemplateFields({ docTypeAliases: a }), await ((s = Z(this, le)) == null ? void 0 : s.reloadProperties());
};
ip = function(e) {
  var i;
  const t = e.target.selection;
  (i = Z(this, le)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
ap = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? r`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${Z(this, he, ep)}
                  @change=${mi(this, he, tp)}></umb-input-document-type>` : r`<uui-loader-bar></uui-loader-bar>`}
            ${Z(this, he, Mo).length > 0 ? r`<p class="note">
                  Also targets ${Z(this, he, Mo).join(", ")}, which no document type has any more.
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
    ...Z(this, he, Qd).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = Z(this, le)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = Z(this, le)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
op = function() {
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
            @change=${mi(this, he, ip)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = Z(this, le)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = Z(this, le)) == null ? void 0 : i.updateOutput({
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
    return (i = Z(this, le)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
sp = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = Z(this, le)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = Z(this, le)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
np = function() {
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
    return (i = Z(this, le)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
tt.styles = F`
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
Pa([
  y()
], tt.prototype, "_template", 2);
Pa([
  y()
], tt.prototype, "_properties", 2);
Pa([
  y()
], tt.prototype, "_showAdvanced", 2);
Pa([
  y()
], tt.prototype, "_documentTypes", 2);
tt = Pa([
  O("di-settings-view")
], tt);
const uv = tt, dv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return tt;
  },
  default: uv
}, Symbol.toStringTag, { value: "Module" }));
var pv = Object.defineProperty, hv = Object.getOwnPropertyDescriptor, rp = (e) => {
  throw TypeError(e);
}, Ra = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? hv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && pv(t, i, o), o;
}, gr = (e, t, i) => t.has(e) || rp("Cannot " + i), jl = (e, t, i) => (gr(e, t, "read from private field"), t.get(e)), Kl = (e, t, i) => t.has(e) ? rp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), mv = (e, t, i, a) => (gr(e, t, "write to private field"), t.set(e, i), i), Vl = (e, t, i) => (gr(e, t, "access private method"), i), ga, co, ln;
let it = class extends C {
  constructor() {
    super(), Kl(this, co), Kl(this, ga), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Dt, (e) => {
      mv(this, ga, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Vl(this, co, ln).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Vl(this, co, ln).call(this)}>Reload</uui-button>
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
              ${ae(
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
ga = /* @__PURE__ */ new WeakMap();
co = /* @__PURE__ */ new WeakSet();
ln = async function() {
  const e = this._template;
  if (!(!e || !jl(this, ga))) {
    this._loading = !0;
    try {
      this._usage = await Oh(e.key, jl(this, ga).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
it.styles = F`
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
Ra([
  y()
], it.prototype, "_template", 2);
Ra([
  y()
], it.prototype, "_usage", 2);
Ra([
  y()
], it.prototype, "_loading", 2);
Ra([
  y()
], it.prototype, "_onlyMissing", 2);
it = Ra([
  O("di-usage-view")
], it);
const yv = it, fv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return it;
  },
  default: yv
}, Symbol.toStringTag, { value: "Module" })), gv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ia,
  default: ia
}, Symbol.toStringTag, { value: "Module" }));
var bt, Kt;
class hs extends Dp {
  constructor(i, a) {
    super(i, a);
    k(this, bt);
    k(this, Kt);
    this.consumeContext(N, (o) => {
      _(this, bt, o);
    }), this.consumeContext(Dt, (o) => {
      _(this, Kt, o);
    });
  }
  async execute() {
    var o, s, n;
    const i = c(this, Kt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (o = c(this, bt)) == null || o.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await ec(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await yc(a.key, !1, i.getToken);
        (s = c(this, bt)) == null || s.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await Kc(l, i.getToken, c(this, bt));
      } catch (l) {
        (n = c(this, bt)) == null || n.peek("danger", {
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
    c(this, Kt) && await Ih(i, c(this, Kt).getToken);
  }
}
bt = new WeakMap(), Kt = new WeakMap();
const vv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: hs,
  api: hs,
  default: hs
}, Symbol.toStringTag, { value: "Module" }));
var wa, Ci;
class ms extends ai {
  constructor(i, a) {
    super(i, a);
    k(this, wa);
    k(this, Ci);
    this.consumeContext(Ae, (o) => {
      _(this, wa, o);
    }), this.consumeContext(N, (o) => {
      _(this, Ci, o);
    });
  }
  async execute() {
    var a, o;
    const i = this.args.unique;
    if (i)
      try {
        const s = await mn(i, () => {
          var l;
          return (l = c(this, wa)) == null ? void 0 : l.getLatestToken();
        }), n = s.outcome === "generated" || s.outcome === "generateddraft";
        (a = c(this, Ci)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? s.message ?? "The image has been regenerated." : s.message ?? s.outcome
          }
        });
      } catch (s) {
        const n = s instanceof Ht && s.status === 404;
        (o = c(this, Ci)) == null || o.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: s instanceof Ht ? s.detail ?? s.message : "The image could not be regenerated."
          }
        });
      }
  }
}
wa = new WeakMap(), Ci = new WeakMap();
const bv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: ms,
  api: ms,
  default: ms
}, Symbol.toStringTag, { value: "Module" }));
var $a, Vt, Ta, Ai;
class ys extends Fp {
  constructor(i, a) {
    super(i, a);
    k(this, $a);
    k(this, Vt);
    k(this, Ta);
    k(this, Ai);
    this.consumeContext(Ae, (o) => {
      _(this, $a, o);
    }), this.consumeContext(N, (o) => {
      _(this, Vt, o);
    }), this.consumeContext(Pp, (o) => {
      _(this, Ta, o);
    }), this.consumeContext(Rp, (o) => {
      _(this, Ai, (o == null ? void 0 : o.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, o, s;
    if (!c(this, Ai)) {
      (i = c(this, Vt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await mn(c(this, Ai), () => {
        var l;
        return (l = c(this, $a)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Ta)) == null || a.setValue(JSON.parse(n.propertyValue))), (o = c(this, Vt)) == null || o.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof Ht && n.status === 404;
      (s = c(this, Vt)) == null || s.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof Ht ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
$a = new WeakMap(), Vt = new WeakMap(), Ta = new WeakMap(), Ai = new WeakMap();
const _v = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: ys,
  api: ys,
  default: ys
}, Symbol.toStringTag, { value: "Module" }));
var wv = Object.defineProperty, $v = Object.getOwnPropertyDescriptor, lp = (e) => {
  throw TypeError(e);
}, ut = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? $v(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && wv(t, i, o), o;
}, vr = (e, t, i) => t.has(e) || lp("Cannot " + i), Ye = (e, t, i) => (vr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), fs = (e, t, i) => t.has(e) ? lp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Tv = (e, t, i, a) => (vr(e, t, "write to private field"), t.set(e, i), i), re = (e, t, i) => (vr(e, t, "access private method"), i), uo, Ma, z, Xo, po, cp, up, dp, br, pp, hp, mp, yp, fp, gp, vp, bp;
const xv = [100, 200, 300, 400, 500, 600, 700, 800, 900], kv = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let fe = class extends ic {
  constructor() {
    super(), fs(this, z), fs(this, uo), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", fs(this, Ma, () => {
      var e;
      return (e = Ye(this, uo)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ae, (e) => {
      Tv(this, uo, e);
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
      <umb-body-layout headline=${re(this, z, mp).call(this)}>
        ${re(this, z, po).call(this, "upload") ? re(this, z, yp).call(this, e) : h}
        ${re(this, z, po).call(this, "path") ? re(this, z, fp).call(this, e) : h}
        ${re(this, z, po).call(this, "web") ? re(this, z, gp).call(this, e) : h}

        ${this._error ? r`<p class="error" role="alert">${this._error}</p>` : h}
        ${this._busy ? r`<uui-loader-bar></uui-loader-bar>` : h}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
uo = /* @__PURE__ */ new WeakMap();
Ma = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakSet();
Xo = function() {
  var e, t;
  return { familyKey: ((e = this.data) == null ? void 0 : e.familyKey) ?? null, parentKey: ((t = this.data) == null ? void 0 : t.parentKey) ?? null };
};
po = function(e) {
  var t;
  return !((t = this.data) != null && t.mode) || this.data.mode === e;
};
cp = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  re(this, z, up).call(this, t);
};
up = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await rh(t, Ye(this, Ma), Ye(this, z, Xo));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
dp = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await lh(this._path.trim(), Ye(this, Ma), Ye(this, z, Xo)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
br = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
pp = async function() {
  if (Ye(this, z, br)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await ch(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        Ye(this, Ma),
        Ye(this, z, Xo)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
hp = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
mp = function() {
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
yp = function(e) {
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
            @change=${re(this, z, cp)}>
          </uui-file-dropzone>
          <p class="hint">
            .ttf, .otf, .woff2 or .woff. The family name and weight are read from the file. Uploads are stored in the
            media library, so they work on Umbraco Cloud and transfer with Deploy.
          </p>
        </uui-box>
    `;
};
fp = function(e) {
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
            @click=${re(this, z, dp)}>
            Register
          </uui-button>
        </uui-box>
    `;
};
gp = function(e) {
  return r`
        <uui-box headline=${e ? "Or use a web font" : "Web font"}>
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${kv.map((t) => ({
    name: t.name,
    value: t.value,
    selected: t.value === this._provider
  }))}
            ?disabled=${this._busy}
            @change=${(t) => {
    this._provider = t.target.value;
  }}>
          </uui-select>

          ${this._provider === "direct" ? re(this, z, bp).call(this) : re(this, z, vp).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !Ye(this, z, br)}
            @click=${re(this, z, pp)}>
            Add web font
          </uui-button>
        </uui-box>
    `;
};
vp = function() {
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
        ${ae(
    xv,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => re(this, z, hp).call(this, e, t.target.checked)}>
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
bp = function() {
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
fe.styles = F`
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
ut([
  y()
], fe.prototype, "_busy", 2);
ut([
  y()
], fe.prototype, "_error", 2);
ut([
  y()
], fe.prototype, "_path", 2);
ut([
  y()
], fe.prototype, "_provider", 2);
ut([
  y()
], fe.prototype, "_family", 2);
ut([
  y()
], fe.prototype, "_weights", 2);
ut([
  y()
], fe.prototype, "_italic", 2);
ut([
  y()
], fe.prototype, "_url", 2);
fe = ut([
  O("di-font-upload-modal")
], fe);
const Dv = fe, Sv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return fe;
  },
  default: Dv
}, Symbol.toStringTag, { value: "Module" }));
var Ev = Object.getOwnPropertyDescriptor, Iv = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ev(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let Lo = class extends C {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Lo = Iv([
  O("di-template-folder-editor")
], Lo);
const Ov = Lo, _p = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Lo;
  },
  default: Ov
}, Symbol.toStringTag, { value: "Module" }));
var Cv = Object.getOwnPropertyDescriptor, Av = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Cv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let va = class extends C {
  render() {
    return r`<umb-workspace-editor>
      <umb-icon id="icon" slot="header" name="icon-font"></umb-icon>
      <umb-workspace-header-name-editable slot="header"></umb-workspace-header-name-editable>
    </umb-workspace-editor>`;
  }
};
va.styles = [
  Mp,
  F`
      #icon {
        display: inline-block;
        font-size: var(--uui-size-6);
        margin-right: var(--uui-size-space-4);
      }
    `
];
va = Av([
  O("di-font-family-editor")
], va);
const Fv = va, Pv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontFamilyEditorElement() {
    return va;
  },
  default: Fv
}, Symbol.toStringTag, { value: "Module" }));
var Rv = Object.defineProperty, Mv = Object.getOwnPropertyDescriptor, wp = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Mv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Rv(t, i, o), o;
};
let ba = class extends C {
  constructor() {
    super(), this._headline = "", this.consumeContext(Ln, (e) => {
      this.observe(e == null ? void 0 : e.current, (t) => {
        this._headline = t ? `${t.font.familyName} · ${t.name}` : "";
      });
    });
  }
  render() {
    return r`<umb-workspace-editor headline=${this._headline}></umb-workspace-editor>`;
  }
};
wp([
  y()
], ba.prototype, "_headline", 2);
ba = wp([
  O("di-font-editor")
], ba);
const Lv = ba, zv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontEditorElement() {
    return ba;
  },
  default: Lv
}, Symbol.toStringTag, { value: "Module" }));
export {
  jm as manifests,
  mb as onInit
};
//# sourceMappingURL=dynamic-images.js.map
