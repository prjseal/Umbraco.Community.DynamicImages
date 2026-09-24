var Ir = (e) => {
  throw TypeError(e);
};
var as = (e, t, i) => t.has(e) || Ir("Cannot " + i);
var c = (e, t, i) => (as(e, t, "read from private field"), i ? i.call(e) : t.get(e)), k = (e, t, i) => t.has(e) ? Ir("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (as(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), I = (e, t, i) => (as(e, t, "access private method"), i);
var os = (e, t, i, a) => ({
  set _(o) {
    _(e, t, o, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as Pp, UmbEntityWorkspaceDataManager as Rp, UmbSubmitWorkspaceAction as ra, UmbEntityNamedDetailWorkspaceContextBase as fn, UMB_WORKSPACE_CONTEXT as Mp, UmbEntityDetailWorkspaceContextBase as Lp, UmbWorkspaceActionBase as zp } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as at, UmbContextConsumerController as Wp } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as Ia, UmbItemRepositoryBase as tc, UmbItemServerDataSourceBase as ic, UmbRepositoryBase as We } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as Oa, UmbItemStoreBase as ac } from "@umbraco-cms/backoffice/store";
import { UmbId as oc } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as Up, UMB_DATE_TIME_VALUE_TYPE as Np } from "@umbraco-cms/backoffice/value-type";
import { nothing as h, html as r, css as R, state as m, customElement as C, ifDefined as la, property as f, repeat as se, classMap as gn, styleMap as B } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as F } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as sc, UmbTreeRepositoryBase as nc } from "@umbraco-cms/backoffice/tree";
import { UMB_ACTION_EVENT_CONTEXT as ot } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent as ni, UmbRequestReloadStructureForEntityEvent as vn, UmbEntityActionBase as ri } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT as j } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as rc } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UMB_AUTH_CONTEXT as Ce } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as bn, UMB_DISCARD_CHANGES_MODAL as Bp, umbConfirmModal as lc, UmbModalToken as cc, UmbModalBaseElement as uc } from "@umbraco-cms/backoffice/modal";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as _n } from "@umbraco-cms/backoffice/entity";
import { UmbDefaultCollectionContext as dc } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as pc, UmbDeselectedEvent as hc } from "@umbraco-cms/backoffice/event";
import { UmbConditionBase as jp } from "@umbraco-cms/backoffice/extension-registry";
import "@umbraco-cms/backoffice/document-type";
import "@umbraco-cms/backoffice/media";
import { UmbArrayState as Bi, UmbStringState as Or, UmbObjectState as Cr, UmbBooleanState as Na, UmbNumberState as Kp } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as Vp } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as qp } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Yp } from "@umbraco-cms/backoffice/document";
import { UmbTextStyles as Gp } from "@umbraco-cms/backoffice/style";
import { tryExecute as Hp } from "@umbraco-cms/backoffice/resources";
const Ko = "dynamic-images", Vo = "di-template", Ts = "di:templates-changed", Xp = "/umbraco/management/api/v1/dynamic-images";
class ei extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function g(e, t, i) {
  const a = await t(), o = new Headers(i == null ? void 0 : i.headers);
  a && o.set("Authorization", `Bearer ${a}`);
  let s = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (o.set("Content-Type", "application/json"), s = JSON.stringify(i.json));
  const n = await fetch(`${Xp}${e}`, { ...i, headers: o, body: s });
  if (!n.ok) throw await Jp(n);
  return n;
}
async function Jp(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new ei(t, e.status, i);
}
const $ = async (e) => e.json();
async function Zp(e) {
  const t = await g("/templates?take=500", e);
  return (await $(t)).items;
}
const wn = async (e, t) => $(await g(`/templates/${e}`, t)), Qp = async (e, t) => $(await g("/templates", t, { method: "POST", json: e })), eh = async (e, t) => $(await g(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function th(e, t) {
  await g(`/templates/${e}`, t, { method: "DELETE" });
}
const ih = async (e, t, i) => $(await g(`/templates/${e}/duplicate`, i, { method: "POST", json: { targetKey: t } })), ah = async (e, t, i) => $(await g(`/templates/${e}/enabled`, i, { method: "PUT", json: { isEnabled: t } }));
async function oh(e, t) {
  return (await g(`/templates/${e}/export`, t)).blob();
}
const sh = async (e, t, i, a = null) => $(await g("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function qo(e, t, i, a) {
  const o = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && o.set("foldersOnly", "true"), a && o.set("parentKey", a), o.toString();
}
const Ar = async (e, t, i, a) => $(await g(`/tree/root?${qo(e, t, i)}`, a)), nh = async (e, t, i, a, o) => $(await g(`/tree/children?${qo(t, i, a, e)}`, o)), rh = async (e, t) => $(await g(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function Yo(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return $(await g(`/item?${i}`, t));
}
async function lh(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), $(await g(`/collection/templates?${i}`, t));
}
async function ch(e, t, i) {
  return (await g(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const uh = async (e, t) => $(await g("/folders", t, { method: "POST", json: e })), dh = async (e, t) => $(await g(`/folders/${e}`, t)), ph = async (e, t, i) => $(await g(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function mc(e, t) {
  await g(`/folders/${e}`, t, { method: "DELETE" });
}
async function hh(e, t, i) {
  await g(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function mh(e, t, i) {
  await g(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function yh(e, t, i) {
  await g("/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const fh = async (e, t, i) => $(await g("/templates/bulk-duplicate", i, { method: "POST", json: { keys: e, targetKey: t } }));
async function gh(e, t, i) {
  await g("/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
const xs = async (e) => $(await g("/fonts", e)), vh = async (e, t) => $(await g(`/fonts/${e}`, t));
async function bh(e, t, i = {}) {
  const a = new FormData();
  return a.append("file", e), i.familyKey && a.append("familyKey", i.familyKey), i.parentKey && a.append("parentKey", i.parentKey), $(await g("/fonts", t, { method: "POST", body: a }));
}
const _h = async (e, t, i = {}) => $(await g("/fonts/register-path", t, { method: "POST", json: { path: e, ...i } })), wh = async (e, t, i = {}) => $(await g("/fonts/register-web", t, { method: "POST", json: { ...e, ...i } })), $h = async (e, t) => $(await g(`/fonts/${e}/refresh`, t, { method: "POST" })), Th = async (e, t, i, a, o) => $(await g(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (o == null ? void 0 : o.weight) ?? null, isItalic: (o == null ? void 0 : o.isItalic) ?? null }
}));
async function yc(e, t) {
  await g(`/fonts/${e}`, t, { method: "DELETE" });
}
async function xh(e, t) {
  return (await g(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Fr = async (e, t, i, a) => $(await g(`/fonts/tree/root?${qo(e, t, i)}`, a)), kh = async (e, t, i, a, o) => $(await g(`/fonts/tree/children?${qo(t, i, a, e)}`, o)), Dh = async (e, t) => $(await g(`/fonts/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function Go(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return $(await g(`/fonts/item?${i}`, t));
}
async function Sh(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), $(await g(`/fonts/collection?${i}`, t));
}
const fc = async (e, t, i, a) => $(await g(`/fonts/${e}/references?skip=${t}&take=${i}`, a));
async function Eh(e, t, i, a) {
  const o = new URLSearchParams({ skip: String(t), take: String(i) });
  for (const s of e) o.append("key", s);
  return $(await g(`/fonts/are-referenced?${o}`, a));
}
const Ih = async (e, t) => $(await g("/fonts/folders", t, { method: "POST", json: e })), Oh = async (e, t) => $(await g(`/fonts/folders/${e}`, t)), Ch = async (e, t, i) => $(await g(`/fonts/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function gc(e, t) {
  await g(`/fonts/folders/${e}`, t, { method: "DELETE" });
}
const Ah = async (e, t) => $(await g(`/fonts/families/${e}`, t)), Fh = async (e, t, i) => $(await g(`/fonts/families/${e}`, i, { method: "PUT", json: { name: t } }));
async function vc(e, t) {
  await g(`/fonts/families/${e}`, t, { method: "DELETE" });
}
async function Ph(e, t, i) {
  await g(`/fonts/families/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Rh(e, t, i) {
  await g(`/fonts/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Mh(e, t, i) {
  await g("/fonts/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
async function Lh(e, t, i) {
  await g("/fonts/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const bc = async (e) => $(await g("/document-types", e)), zh = async (e, t) => $(await g(`/document-types/${encodeURIComponent(e)}/properties`, t)), Wh = async (e, t, i) => $(await g(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function _c(e, t, i) {
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
const wc = async (e, t, i) => $(await g("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), $c = async (e, t) => $(await g(`/media/${e}/image-info`, t)), $n = async (e, t) => $(await g(`/documents/${e}/regenerate`, t, { method: "POST" })), Tc = async (e, t, i) => $(await g(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), Uh = async (e, t) => $(await g(`/jobs/${e}`, t));
async function Nh(e, t) {
  await g(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const Bh = async (e, t) => $(await g(`/templates/${e}/usage`, t)), xc = async (e) => $(await g("/health", e)), jh = async (e) => $(await g("/sync/status", e)), Kh = async (e) => $(await g("/sync/export", e, { method: "POST" })), Vh = async (e) => $(await g("/sync/import", e, { method: "POST" }));
function Ca(e) {
  const t = `section/${Ko}/workspace/${Vo}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function qh(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${Ko}/workspace/${Vo}/create${t}`, document.baseURI).pathname;
}
function ti(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${Ko}/workspace/${e}${i}`, document.baseURI).pathname;
}
function Yh(e) {
  return new URL(`section/${Ko}/dashboard/${e}`, document.baseURI).pathname;
}
function Tn() {
  window.dispatchEvent(new CustomEvent(Ts));
}
const Ho = () => crypto.randomUUID();
function Xo(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function kc(e, t, i) {
  const { x: a, y: o } = Xo(e);
  return {
    type: "text",
    key: Ho(),
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
function Dc(e, t, i) {
  const { x: a, y: o } = Xo(e);
  return {
    type: "image",
    key: Ho(),
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
function Sc(e, t, i) {
  const { x: a, y: o } = Xo(e);
  return {
    type: "badges",
    key: Ho(),
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
const ca = {
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
}, Gh = Object.keys(ca);
function Hh(e, t = "Shape", i = "rectangle") {
  const { x: a, y: o } = Xo(e), s = ca[i] ?? ca.rectangle;
  return {
    type: "rect",
    key: Ho(),
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
function Xh(e) {
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
function Jh(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (Xh(e.classification)) {
    case "image":
      return { kind: "layer", layer: Dc(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: Sc(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: kc(t, e.name, Zh(e)) };
  }
}
function Zh(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Ec() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function Qh(e) {
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
const Ic = [
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
function ua(e) {
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
function da(e) {
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
function ks(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return Ic[a * 3 + i];
}
function Jo(e, t, i) {
  return {
    x: e.x - t * ua(e.anchor),
    y: e.y - i * da(e.anchor)
  };
}
function xn(e, t, i, a, o) {
  return {
    x: e + i * ua(o),
    y: t + a * da(o)
  };
}
function em(e, t, i, a) {
  const o = Jo(e, t, i), s = xn(o.x, o.y, t, i, a);
  return { ...e, x: Math.round(s.x), y: Math.round(s.y), anchor: a };
}
function tm(e, t) {
  const i = xn(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Oc(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function mi(e, t, i, a, o) {
  if (o === 0) return { x: e, y: t };
  const s = o * Math.PI / 180, n = Math.cos(s), l = Math.sin(s), p = e - i, y = t - a;
  return { x: i + p * n - y * l, y: a + p * l + y * n };
}
function im(e, t, i, a, o) {
  return mi(e, t, i, a, -o);
}
function Cc(e, t, i, a) {
  if (a === 0) return e;
  const o = [
    mi(e.x, e.y, t, i, a),
    mi(e.x + e.width, e.y, t, i, a),
    mi(e.x + e.width, e.y + e.height, t, i, a),
    mi(e.x, e.y + e.height, t, i, a)
  ], s = Math.min(...o.map((y) => y.x)), n = Math.max(...o.map((y) => y.x)), l = Math.min(...o.map((y) => y.y)), p = Math.max(...o.map((y) => y.y));
  return { x: s, y: l, width: n - s, height: p - l };
}
const am = 10;
function Le(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Ac(e) {
  return !!e.relativeX || !!e.relativeY;
}
function bo(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Pr(e) {
  return e === "below" || e === "above";
}
function Rr(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function om(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function sm(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), o = Rr(i.position).map((s) => s.layerKey);
  for (; o.length > 0; ) {
    const s = o.pop();
    if (s === e) return !0;
    if (a.has(s)) continue;
    a.add(s);
    const n = t.get(s);
    n && o.push(...Rr(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function nm(e, t, i) {
  const a = e.position;
  if (!Ac(a)) return a;
  if (sm(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let o = a.x, s = a.y, n = ua(a.anchor), l = da(a.anchor);
  const p = Mr(e, a.relativeX, !1, t, i);
  p && (o = p.coordinate, n = p.factor);
  const y = Mr(e, a.relativeY, !0, t, i);
  return y && (s = y.coordinate, l = y.factor), { x: o, y: s, anchor: ks(n, l) };
}
function Mr(e, t, i, a, o) {
  if (!t || Pr(t.edge) !== i) return;
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
    const y = i ? l.position.relativeY : l.position.relativeX;
    if (!y || Pr(y.edge) !== i) return;
    n = y.layerKey;
  }
}
function rm(e, t, i) {
  const a = om(e), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set(), n = (l) => {
    const p = o.get(l.key);
    if (p) return p;
    let y;
    s.has(l.key) ? y = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (s.add(l.key), y = nm(l, a, (ue) => {
      const ve = a.get(ue);
      return ve && !i(ve) ? n(ve).extent : void 0;
    }), s.delete(l.key));
    const D = t(l), E = Jo(y, D.width, D.height), L = { x: E.x, y: E.y, width: D.width, height: D.height }, Ae = { position: y, box: L, extent: Cc(L, y.x, y.y, l.rotation ?? 0) };
    return o.set(l.key, Ae), Ae;
  };
  for (const l of e) n(l);
  return o;
}
function Ds(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? ks(ua(i.anchor), da(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? ks(ua(e.anchor), da(i.anchor)) : e.anchor
  };
}
var de, je, Pe, ft;
class lm {
  constructor(t = 100) {
    k(this, de, []);
    k(this, je, []);
    k(this, Pe, 0);
    k(this, ft);
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
    c(this, Pe) > 0 || (c(this, de).push(structuredClone(t)), c(this, de).length > this.limit && c(this, de).shift(), _(this, je, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Pe) === 0 && _(this, ft, structuredClone(t)), os(this, Pe)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Pe) !== 0 && (os(this, Pe)._--, !(c(this, Pe) > 0) && (t && c(this, ft) !== void 0 && (c(this, de).push(c(this, ft)), c(this, de).length > this.limit && c(this, de).shift(), _(this, je, [])), _(this, ft, void 0)));
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
    _(this, de, []), _(this, je, []), _(this, Pe, 0), _(this, ft, void 0);
  }
}
de = new WeakMap(), je = new WeakMap(), Pe = new WeakMap(), ft = new WeakMap();
const Ss = 3, cm = (e) => um(e), Lr = (e, t) => e.slice(0, Math.max(0, t)).join("."), um = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), dm = "Page";
function pm(e) {
  return e.isSystem ? dm : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const ci = (e) => e ?? Number.MAX_SAFE_INTEGER;
function hm(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || ci(t.property.tabSortOrder) - ci(i.property.tabSortOrder) || ci(t.property.groupSortOrder) - ci(i.property.groupSortOrder) || ci(t.property.sortOrder) - ci(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function mm(e, t) {
  const i = hm(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: pm(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function ym(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const fm = "DynamicImages.Workspace.Template", gm = 12, zr = 36;
var xi, gt, Nt, Bt, ki, jt, Di, Si, Kt, vt, Ei, Ke, Ii, Oi, pe, ka, Vt, Re, qt, T, Fc, Ci, Ai, Es, Is, Os, Ne, Rt, Cs, Xa, Pc, Rc, Mc, As;
class vm extends Pp {
  constructor(i) {
    super(i, fm);
    k(this, T);
    k(this, xi);
    k(this, gt);
    k(this, Nt);
    k(this, Bt);
    k(this, ki);
    k(this, jt);
    k(this, Di);
    k(this, Si);
    k(this, Kt);
    k(this, vt);
    k(this, Ei);
    k(this, Ke);
    k(this, Ii);
    k(this, Oi);
    k(this, pe);
    k(this, ka);
    k(this, Vt);
    k(this, Re);
    k(this, qt);
    k(this, Ci);
    k(this, Ai);
    this._data = new Rp(this), this.template = this._data.current, _(this, xi, new Bi([], (a) => a.key)), this.layers = c(this, xi).asObservable(), _(this, gt, new Or(void 0)), this.selectedLayerKey = c(this, gt).asObservable(), _(this, Nt, new Bi([], (a) => a.alias)), this.properties = c(this, Nt).asObservable(), _(this, Bt, new Cr({})), this.linkedProperties = c(this, Bt).asObservable(), _(this, ki, new Cr({})), this.linkedCaptions = c(this, ki).asObservable(), _(this, jt, new Bi([], (a) => a.key)), this.fonts = c(this, jt).asObservable(), _(this, Di, new Bi([], (a) => a.key)), this.serverBounds = c(this, Di).asObservable(), _(this, Si, new Bi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, Si).asObservable(), _(this, Kt, new Or(void 0)), this.sampleContentKey = c(this, Kt).asObservable(), _(this, vt, new Na(!0)), this.useSampleData = c(this, vt).asObservable(), _(this, Ei, new Kp(1)), this.zoom = c(this, Ei).asObservable(), _(this, Ke, new Na(!0)), this.loading = c(this, Ke).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, Ii, new Na(!1)), this.canUndo = c(this, Ii).asObservable(), _(this, Oi, new Na(!1)), this.canRedo = c(this, Oi).asObservable(), _(this, pe, new lm()), _(this, Re, !1), _(this, qt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, Ci, async (a) => {
      const o = a.detail;
      if (c(this, qt) || !(o != null && o.url) || !I(this, T, Fc).call(this, o.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await bn(this, Bp), _(this, qt, !0), window.history.pushState({}, "", o.url instanceof URL ? o.url.href : o.url), !0;
      } catch {
        return !1;
      }
    }), _(this, Ai, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, ka)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => us),
        setup: (a, o) => {
          const s = o.match.params.parentUnique;
          return this.createScaffold(void 0, s && s !== "null" ? s : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => us),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => us),
        setup: (a, o) => this.load(o.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ce, (a) => {
      _(this, ka, a);
    }), this.consumeContext(j, (a) => {
      _(this, Vt, a);
    }), window.addEventListener("willchangestate", c(this, Ci)), window.addEventListener("beforeunload", c(this, Ai)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Re);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Ke).setValue(!0), _(this, Re, !1);
    try {
      const a = await wn(i, this.getToken);
      I(this, T, Rt).call(this, a, { resetHistory: !0, persist: !0 }), I(this, T, Rc).call(this), this.setIsNew(!1), await I(this, T, Es).call(this, a);
    } catch (a) {
      I(this, T, As).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Ke).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, Ke).setValue(!0), _(this, Re, !0), I(this, T, Rt).call(this, { ...Qh(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await I(this, T, Es).call(this, this._data.getCurrent()), c(this, Ke).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await I(this, T, Os).call(this, i.docTypeAliases);
    c(this, Nt).setValue(a), c(this, Bt).setValue(await I(this, T, Is).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, jt).setValue(await xs(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    I(this, T, Ne).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    I(this, T, Ne).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    I(this, T, Ne).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    I(this, T, Ne).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    I(this, T, Ne).call(this, (o) => ({ ...o, layers: [...o.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    I(this, T, Ne).call(this, (o) => ({
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
    I(this, T, Ne).call(this, (o) => ({
      ...o,
      layers: o.layers.filter((s) => s.key !== i).map((s) => {
        var l, p;
        let n = s.position;
        return ((l = bo(n, "x")) == null ? void 0 : l.layerKey) === i && (n = Ds(n, "x", a == null ? void 0 : a.get(s.key))), ((p = bo(n, "y")) == null ? void 0 : p.layerKey) === i && (n = Ds(n, "y", a == null ? void 0 : a.get(s.key))), n === s.position ? s : { ...s, position: n };
      })
    })), c(this, gt).getValue() === i && this.selectLayer(void 0);
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
    I(this, T, Ne).call(this, (o) => {
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
    c(this, gt).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, gt).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((o) => o.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, pe).begin(i);
  }
  endTransaction(i = !0) {
    c(this, pe).end(i), I(this, T, Cs).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, pe).undo(i);
    a && I(this, T, Rt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, pe).redo(i);
    a && I(this, T, Rt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Di).setValue(i);
  }
  setIssues(i) {
    c(this, Si).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    c(this, Kt).setValue(i), c(this, vt).setValue(!i), I(this, T, Pc).call(this, i);
  }
  setUseSampleData(i) {
    c(this, vt).setValue(i);
  }
  setZoom(i) {
    c(this, Ei).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, o;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const s = c(this, Re) ? await Qp(i, this.getToken) : await eh(i, this.getToken);
      I(this, T, Rt).call(this, s.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Re);
      _(this, Re, !1), this.setIsNew(!1), Tn(), await I(this, T, Mc).call(this, s.template, n), (a = c(this, Vt)) == null || a.peek("positive", {
        data: { message: `'${s.template.name}' saved.` }
      });
      for (const l of s.warnings)
        (o = c(this, Vt)) == null || o.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", Ca(s.template.key));
    } catch (s) {
      throw I(this, T, As).call(this, "The template could not be saved", s), s;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, qt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, Ci)), window.removeEventListener("beforeunload", c(this, Ai)), c(this, pe).clear(), super.destroy();
  }
}
xi = new WeakMap(), gt = new WeakMap(), Nt = new WeakMap(), Bt = new WeakMap(), ki = new WeakMap(), jt = new WeakMap(), Di = new WeakMap(), Si = new WeakMap(), Kt = new WeakMap(), vt = new WeakMap(), Ei = new WeakMap(), Ke = new WeakMap(), Ii = new WeakMap(), Oi = new WeakMap(), pe = new WeakMap(), ka = new WeakMap(), Vt = new WeakMap(), Re = new WeakMap(), qt = new WeakMap(), T = new WeakSet(), /**
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
Fc = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, Ci = new WeakMap(), Ai = new WeakMap(), Es = async function(i) {
  const [a, o] = await Promise.all([
    xs(this.getToken).catch(() => []),
    I(this, T, Os).call(this, i.docTypeAliases)
  ]);
  c(this, jt).setValue(a), c(this, Nt).setValue(o), c(this, Bt).setValue(await I(this, T, Is).call(this, i.docTypeAliases, o));
}, Is = async function(i, a) {
  const o = {}, s = {};
  if (i.length === 0) return o;
  let n = a.filter((p) => p.classification === "content").slice(0, gm).map((p) => p.alias), l = 0;
  for (let p = 1; p <= Ss && n.length > 0 && l < zr; p++) {
    const y = n.slice(0, zr - l);
    l += y.length;
    const D = await Promise.all(y.map(async (E) => {
      var Ni;
      const L = await Promise.all(
        i.map((ne) => Wh(ne, E, this.getToken).catch(() => null))
      ), Ae = /* @__PURE__ */ new Map();
      for (const ne of L.flatMap((dt) => (dt == null ? void 0 : dt.properties) ?? []))
        Ae.has(ne.alias) || Ae.set(ne.alias, ne);
      const ue = L.filter((ne) => ne !== null), ve = [...new Set(ue.flatMap((ne) => ne.targetDocTypes.map((dt) => dt.name)))], Ct = ue.some((ne) => ne.inference === "all") ? "all" : (Ni = ue[0]) == null ? void 0 : Ni.inference;
      return { prefix: E, properties: [...Ae.values()], caption: ym(ve, Ct) };
    }));
    n = [];
    for (const E of D)
      E.properties.length !== 0 && (o[E.prefix] = E.properties, s[E.prefix] = E.caption, p < Ss && n.push(...E.properties.filter((L) => L.classification === "content" && !L.isSystem).map((L) => `${E.prefix}.${L.alias}`)));
  }
  return c(this, ki).setValue(s), o;
}, Os = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((s) => zh(s, this.getToken).catch(() => []))
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
  I(this, T, Rt).call(this, s);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
Rt = function(i, a) {
  a != null && a.resetHistory && c(this, pe).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, xi).setValue(i.layers), I(this, T, Cs).call(this);
}, Cs = function() {
  c(this, Ii).setValue(c(this, pe).canUndo), c(this, Oi).setValue(c(this, pe).canRedo);
}, Xa = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, Pc = function(i) {
  try {
    i ? localStorage.setItem(I(this, T, Xa).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(I(this, T, Xa).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
Rc = function() {
  let i;
  try {
    const a = localStorage.getItem(I(this, T, Xa).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  c(this, Kt).setValue(i), c(this, vt).setValue(!i);
}, Mc = async function(i, a) {
  const o = await this.getContext(ot).catch(() => {
  });
  o && (a ? o.dispatchEvent(new ni({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : o.dispatchEvent(new vn({ entityType: "di-template", unique: i.key })));
}, As = function(i, a) {
  var s;
  const o = a instanceof ei ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (s = c(this, Vt)) == null || s.peek("danger", { data: { headline: i, message: o } });
};
const It = new at(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), He = "di-template-root", U = "di-template-folder", V = Vo, Wt = "DynamicImages.Tree.Templates", yi = "DynamicImages.Repository.TemplateTree", Qi = "DynamicImages.Repository.TemplateFolder", bm = "DynamicImages.Store.TemplateFolder", _o = "DynamicImages.Workspace.TemplateFolder", Lc = "DynamicImages.Workspace.TemplateRoot", ss = "DynamicImages.Repository.TemplateItem", _m = "DynamicImages.Store.TemplateItem", ns = "DynamicImages.Repository.TemplateDetail", wm = "DynamicImages.Store.TemplateDetail", Wr = "DynamicImages.Repository.MoveTemplate", Ur = "DynamicImages.Repository.MoveTemplateFolder", Nr = "DynamicImages.Repository.DuplicateTemplate", Br = "DynamicImages.Repository.BulkMoveTemplates", jr = "DynamicImages.Repository.BulkDuplicateTemplates", Kr = "DynamicImages.Repository.SortTemplateChildren", kn = "icon-picture", Dn = "icon-picture color-grey", zc = "icon-folder", wo = "DynamicImages.Collection.Templates", Vr = "DynamicImages.Repository.TemplateCollection";
async function w(e, t) {
  const i = (async () => {
    const a = await new Wp(e, Ce).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (o) {
      throw o instanceof ei ? { type: "error", title: o.message, status: o.status, detail: o.detail } : o;
    }
  })();
  return await Hp(e, i);
}
var bt;
class $m {
  constructor(t) {
    k(this, bt);
    _(this, bt, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: U,
      unique: oc.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await w(c(this, bt), (o) => dh(t, o));
    return i ? { data: { entityType: U, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: o } = await w(c(this, bt), (s) => uh({ key: a, name: t.name, parentKey: i }, s));
    return o ? { error: o } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await w(c(this, bt), (o) => ph(i, t.name, o));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return w(c(this, bt), (i) => mc(t, i));
  }
}
bt = new WeakMap();
const Sn = new at("DiTemplateFolderStore");
class Wc extends Oa {
  constructor(t) {
    super(t, Sn);
  }
}
class qr extends Ia {
  constructor(t) {
    super(t, $m, Sn);
  }
}
const Tm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: Sn,
  DiTemplateFolderRepository: qr,
  DiTemplateFolderStore: Wc,
  api: qr
}, Symbol.toStringTag, { value: "Module" })), xm = [
  {
    type: "repository",
    alias: Qi,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => Tm)
  },
  {
    type: "store",
    alias: bm,
    name: "Dynamic Images Template Folder Store",
    api: Wc
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [U],
    meta: { folderRepositoryAlias: Qi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [U],
    meta: { folderRepositoryAlias: Qi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: _o,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => ly),
    meta: { entityType: U }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: ra,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: _o }]
  }
], km = [
  {
    type: "repository",
    alias: yi,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => dy)
  },
  {
    type: "tree",
    kind: "default",
    alias: Wt,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: yi }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [He, U, V]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: Wt, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: Lc,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: He, headline: "Templates" }
  },
  ...xm
], En = new at("DiTemplateItemStore");
class Uc extends ac {
  constructor(t) {
    super(t, En);
  }
}
class Dm extends ic {
  constructor(t) {
    super(t, {
      getItems: (i) => w(t, (a) => Yo(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? U : V,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class Yr extends tc {
  constructor(t) {
    super(t, Dm, En);
  }
}
const Sm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: En,
  DiTemplateItemRepository: Yr,
  DiTemplateItemStore: Uc,
  api: Yr
}, Symbol.toStringTag, { value: "Module" })), In = new at("DiTemplateDetailStore");
class Nc extends Oa {
  constructor(t) {
    super(t, In);
  }
}
const rs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var Fi;
class Em {
  constructor(t) {
    k(this, Fi);
    this.createScaffold = rs, this.create = rs, this.update = rs, _(this, Fi, t);
  }
  async read(t) {
    const { data: i, error: a } = await w(c(this, Fi), (o) => wn(t, o));
    return i ? { data: { entityType: V, unique: i.key, name: i.name } } : { error: a };
  }
  /**
   * A template, or a folder: the collection's bulk Delete sends every selected key here, and a
   * selection can hold both. A folder that is not empty is refused by the server with a 409, which
   * core's bulk action shows as that item's error.
   */
  delete(t) {
    return w(c(this, Fi), async (i) => {
      const [a] = await Yo([t], i);
      return (a == null ? void 0 : a.entityType) === "folder" ? mc(t, i) : th(t, i);
    });
  }
}
Fi = new WeakMap();
class Gr extends Ia {
  constructor(t) {
    super(t, Em, In);
  }
}
const Im = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: In,
  DiTemplateDetailRepository: Gr,
  DiTemplateDetailStore: Nc,
  api: Gr
}, Symbol.toStringTag, { value: "Module" })), ui = [He, U], ls = [{ alias: "Umb.Condition.CollectionAlias", match: wo }], Om = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: ss,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => Sm)
  },
  {
    type: "itemStore",
    alias: _m,
    name: "Dynamic Images Template Item Store",
    api: Uc
  },
  {
    type: "repository",
    alias: ns,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => Im)
  },
  {
    type: "store",
    alias: wm,
    name: "Dynamic Images Template Detail Store",
    api: Nc
  },
  {
    type: "repository",
    alias: Wr,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => my)
  },
  {
    type: "repository",
    alias: Ur,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => yy)
  },
  {
    type: "repository",
    alias: Nr,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => fy)
  },
  {
    type: "repository",
    alias: Kr,
    name: "Dynamic Images Sort Template Children Repository",
    api: () => Promise.resolve().then(() => gy)
  },
  {
    type: "repository",
    alias: Br,
    name: "Dynamic Images Bulk Move Templates Repository",
    api: () => Promise.resolve().then(() => _y)
  },
  {
    type: "repository",
    alias: jr,
    name: "Dynamic Images Bulk Duplicate Templates Repository",
    api: () => Promise.resolve().then(() => wy)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: ui,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => $y),
    forEntityTypes: ui,
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
    forEntityTypes: ui,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Qi
    }
  },
  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [V],
    meta: {
      treeRepositoryAlias: yi,
      moveRepositoryAlias: Wr,
      treeAlias: Wt,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Template To",
    forEntityTypes: [V],
    meta: {
      duplicateRepositoryAlias: Nr,
      treeRepositoryAlias: yi,
      treeAlias: Wt,
      foldersOnly: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Enable",
    name: "Enable Dynamic Images Template",
    api: () => Promise.resolve().then(() => Ty),
    forEntityTypes: [V],
    weight: 560,
    meta: { icon: "icon-check", label: "Enable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Disable",
    name: "Disable Dynamic Images Template",
    api: () => Promise.resolve().then(() => xy),
    forEntityTypes: [V],
    weight: 550,
    meta: { icon: "icon-block", label: "Disable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => ky),
    forEntityTypes: [V],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => Sy),
    forEntityTypes: [V],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [V],
    meta: {
      itemRepositoryAlias: ss,
      detailRepositoryAlias: ns,
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
    forEntityTypes: [U],
    meta: {
      treeRepositoryAlias: yi,
      moveRepositoryAlias: Ur,
      treeAlias: Wt,
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
    api: () => Promise.resolve().then(() => Oy),
    forEntityTypes: ui,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "sortChildrenOf",
    alias: "DynamicImages.EntityAction.Template.SortChildren",
    name: "Sort Dynamic Images Templates",
    forEntityTypes: ui,
    meta: {
      sortChildrenOfRepositoryAlias: Kr,
      treeRepositoryAlias: yi
    }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: ui
  },
  // ---------------------------------------------------------------- collection selection
  // Any of these applying is what turns on the collection's checkboxes.
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Template.MoveTo",
    name: "Move Dynamic Images Templates",
    forEntityTypes: [V, U],
    meta: {
      bulkMoveRepositoryAlias: Br,
      treeAlias: Wt,
      foldersOnly: !0
    },
    conditions: ls
  },
  {
    type: "entityBulkAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityBulkAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Templates To",
    forEntityTypes: [V, U],
    meta: {
      bulkDuplicateRepositoryAlias: jr,
      treeAlias: Wt,
      foldersOnly: !0
    },
    conditions: ls
  },
  {
    type: "entityBulkAction",
    kind: "delete",
    alias: "DynamicImages.EntityBulkAction.Template.Delete",
    name: "Delete Dynamic Images Templates",
    forEntityTypes: [V, U],
    meta: {
      itemRepositoryAlias: ss,
      detailRepositoryAlias: ns
    },
    conditions: ls
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => My)
  }
], Ba = [{ alias: "Umb.Condition.CollectionAlias", match: wo }], Cm = [
  {
    type: "repository",
    alias: Vr,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => Ly)
  },
  {
    type: "collection",
    kind: "default",
    alias: wo,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => zy),
    meta: { repositoryAlias: Vr }
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
        { field: "isEnabled", label: "Enabled", valueType: Up },
        { field: "updated", label: "Last updated", valueType: Np }
      ]
    },
    conditions: Ba
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: Ba
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => By),
    forEntityTypes: [V]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: Ba
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: Ba
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
      collectionAlias: wo
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [Lc, _o]
      }
    ]
  }
], Dt = "di-font-root", oe = "di-font-folder", H = "di-font-family", Xe = "di-font", ea = "DynamicImages.Tree.Fonts", ta = "DynamicImages.Repository.FontTree", ia = "DynamicImages.Repository.FontFolder", Am = "DynamicImages.Store.FontFolder", $o = "DynamicImages.Workspace.FontFolder", Bc = "DynamicImages.Workspace.FontRoot", To = "DynamicImages.Workspace.FontFamily", Ja = "DynamicImages.Workspace.Font", ja = "DynamicImages.Repository.FontItem", Fm = "DynamicImages.Store.FontItem", On = "DynamicImages.Repository.FontDetail", Pm = "DynamicImages.Store.FontDetail", Cn = "DynamicImages.Repository.FontFamilyDetail", Rm = "DynamicImages.Store.FontFamilyDetail", Ka = "DynamicImages.Repository.FontReference", Hr = "DynamicImages.Repository.MoveFontFamily", Xr = "DynamicImages.Repository.MoveFontFolder", Jr = "DynamicImages.Repository.BulkMoveFonts", Zr = "DynamicImages.Repository.SortFontChildren", Qr = "DynamicImages.Repository.FontBulkDelete", el = "DynamicImages.Condition.IsWebFont", xo = "DynamicImages.Collection.Fonts", cs = "DynamicImages.Repository.FontCollection", Fs = "DynamicImages.Collection.FontVariants", Mm = "icon-folder", Lm = "icon-font", zm = "icon-font color-grey", Wm = "icon-cloud";
function An(e) {
  switch (e) {
    case "folder":
      return oe;
    case "family":
      return H;
    default:
      return Xe;
  }
}
function Fn(e, t) {
  switch (e) {
    case "folder":
      return Mm;
    case "family":
      return Lm;
    default:
      return t ? Wm : zm;
  }
}
const Um = [
  {
    type: "repository",
    alias: ta,
    name: "Dynamic Images Font Tree Repository",
    api: () => Promise.resolve().then(() => Vy)
  },
  {
    type: "tree",
    kind: "default",
    alias: ea,
    name: "Dynamic Images Font Tree",
    meta: { repositoryAlias: ta }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Fonts",
    name: "Dynamic Images Font Tree Item",
    forEntityTypes: [Dt, oe, H, Xe]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Fonts",
    name: "Dynamic Images Fonts Menu Item",
    weight: 100,
    meta: { label: "Fonts", treeAlias: ea, menus: ["DynamicImages.Menu"] }
  },
  {
    type: "workspace",
    kind: "default",
    alias: Bc,
    name: "Dynamic Images Fonts Root Workspace",
    meta: { entityType: Dt, headline: "Fonts" }
  }
];
var _t;
class Nm {
  constructor(t) {
    k(this, _t);
    _(this, _t, t);
  }
  async createScaffold(t) {
    return { data: { entityType: oe, unique: oc.new(), name: "", ...t } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await w(c(this, _t), (o) => Oh(t, o));
    return i ? { data: { entityType: oe, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: o } = await w(c(this, _t), (s) => Ih({ key: a, name: t.name, parentKey: i }, s));
    return o ? { error: o } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await w(c(this, _t), (o) => Ch(i, t.name, o));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return w(c(this, _t), (i) => gc(t, i));
  }
}
_t = new WeakMap();
const Pn = new at("DiFontFolderStore");
class jc extends Oa {
  constructor(t) {
    super(t, Pn);
  }
}
class tl extends Ia {
  constructor(t) {
    super(t, Nm, Pn);
  }
}
const Bm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FOLDER_STORE_CONTEXT: Pn,
  DiFontFolderRepository: tl,
  DiFontFolderStore: jc,
  api: tl
}, Symbol.toStringTag, { value: "Module" })), jm = [
  {
    type: "repository",
    alias: ia,
    name: "Dynamic Images Font Folder Repository",
    api: () => Promise.resolve().then(() => Bm)
  },
  {
    type: "store",
    alias: Am,
    name: "Dynamic Images Font Folder Store",
    api: jc
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.FontFolder.Rename",
    name: "Rename Dynamic Images Font Folder",
    forEntityTypes: [oe],
    meta: { folderRepositoryAlias: ia }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.FontFolder.Delete",
    name: "Delete Dynamic Images Font Folder",
    forEntityTypes: [oe],
    meta: { folderRepositoryAlias: ia }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: $o,
    name: "Dynamic Images Font Folder Workspace",
    api: () => Promise.resolve().then(() => qy),
    meta: { entityType: oe }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.FontFolder.Submit",
    name: "Save Dynamic Images Font Folder",
    api: ra,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: $o }]
  }
], il = [{ alias: "Umb.Condition.CollectionAlias", match: xo }], al = [{ alias: "Umb.Condition.CollectionAlias", match: Fs }], ol = (e, t) => [
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
], Km = [
  {
    type: "repository",
    alias: cs,
    name: "Dynamic Images Font Collection Repository",
    api: () => Promise.resolve().then(() => Gy)
  },
  {
    type: "collection",
    kind: "default",
    alias: xo,
    name: "Dynamic Images Font Collection",
    api: () => Promise.resolve().then(() => Cl),
    meta: { repositoryAlias: cs }
  },
  {
    type: "collection",
    kind: "default",
    alias: Fs,
    name: "Dynamic Images Font Variant Collection",
    api: () => Promise.resolve().then(() => Cl),
    meta: { repositoryAlias: cs }
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
    conditions: il
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
    conditions: al
  },
  ...ol("Fonts", il),
  ...ol("FontVariants", al),
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Font",
    name: "Dynamic Images Font Card",
    element: () => Promise.resolve().then(() => Qy),
    forEntityTypes: [oe, H, Xe]
  },
  // ---------------------------------------------------------------- where they show
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Fonts.Collection",
    name: "Dynamic Images Fonts Collection Workspace View",
    meta: { label: "Fonts", pathname: "fonts", icon: "icon-grid", collectionAlias: xo },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", oneOf: [Bc, $o] }]
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.FontVariants.Collection",
    name: "Dynamic Images Font Variants Collection Workspace View",
    meta: { label: "Variants", pathname: "variants", icon: "icon-font", collectionAlias: Fs },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: To }]
  }
];
function Rn(e) {
  return {
    unique: e.key,
    entityType: An(e.entityType),
    name: e.name,
    icon: Fn(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
const Mn = new at("DiFontItemStore");
class Kc extends ac {
  constructor(t) {
    super(t, Mn);
  }
}
class Vm extends ic {
  constructor(t) {
    super(t, {
      getItems: (i) => w(t, (a) => Go(i, a)),
      mapper: Rn
    });
  }
}
class sl extends tc {
  constructor(t) {
    super(t, Vm, Mn);
  }
}
const qm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_ITEM_STORE_CONTEXT: Mn,
  DiFontItemRepository: sl,
  DiFontItemStore: Kc,
  api: sl,
  mapFontItem: Rn
}, Symbol.toStringTag, { value: "Module" })), At = [Dt, oe], nl = [{ alias: "Umb.Condition.CollectionAlias", match: xo }], Ft = (e, t, i) => ({ type: "repository", alias: e, name: t, api: i }), Ym = [
  // ---------------------------------------------------------------- repositories
  Ft(ja, "Dynamic Images Font Item Repository", () => Promise.resolve().then(() => qm)),
  { type: "itemStore", alias: Fm, name: "Dynamic Images Font Item Store", api: Kc },
  Ft(
    Ka,
    "Dynamic Images Font Reference Repository",
    () => Promise.resolve().then(() => ef)
  ),
  Ft(
    Qr,
    "Dynamic Images Font Bulk Delete Repository",
    () => Promise.resolve().then(() => tf)
  ),
  Ft(
    Hr,
    "Dynamic Images Move Font Family Repository",
    () => Promise.resolve().then(() => nf)
  ),
  Ft(
    Xr,
    "Dynamic Images Move Font Folder Repository",
    () => Promise.resolve().then(() => rf)
  ),
  Ft(
    Jr,
    "Dynamic Images Bulk Move Fonts Repository",
    () => Promise.resolve().then(() => lf)
  ),
  Ft(
    Zr,
    "Dynamic Images Sort Font Children Repository",
    () => Promise.resolve().then(() => cf)
  ),
  {
    type: "condition",
    alias: el,
    name: "Dynamic Images Is Web Font Condition",
    api: () => Promise.resolve().then(() => uf)
  },
  // How the delete modal draws each template still using a font. Cast because 17.5 declares the
  // entityItemRef manifest type in a file no public entry point imports - the folder create
  // option's problem again. The extension type itself is registered and resolved by entity type.
  {
    type: "entityItemRef",
    alias: "DynamicImages.EntityItemRef.Template",
    name: "Dynamic Images Template Item Ref",
    element: () => Promise.resolve().then(() => hf),
    forEntityTypes: [V]
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Font.Create",
    name: "Create Dynamic Images Font",
    weight: 1200,
    forEntityTypes: [...At, H],
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Add to Fonts" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Upload",
    name: "Upload a Dynamic Images Font File",
    weight: 100,
    api: () => Promise.resolve().then(() => vf),
    forEntityTypes: At,
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
    api: () => Promise.resolve().then(() => bf),
    forEntityTypes: At,
    meta: { icon: "icon-cloud", label: "Web font", description: "From Google Fonts, Bunny Fonts or a file URL" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Path",
    name: "Register a Dynamic Images Font Path",
    weight: 80,
    api: () => Promise.resolve().then(() => _f),
    forEntityTypes: At,
    meta: { icon: "icon-font", label: "Font from path", description: "A font file already in the site's wwwroot" }
  },
  // Cast for the same reason as the template folder option in entity-actions/manifests.ts.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.FontFolder",
    name: "Dynamic Images Font Folder Create Option",
    weight: 70,
    forEntityTypes: At,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: ia
    }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.AddVariant",
    name: "Add a Variant to a Dynamic Images Font Family",
    weight: 100,
    api: () => Promise.resolve().then(() => wf),
    forEntityTypes: [H],
    meta: { icon: "icon-add", label: "Add variant", description: "Another weight or slant of this family" }
  },
  // ---------------------------------------------------------------- family
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.FontFamily.MoveTo",
    name: "Move Dynamic Images Font Family",
    forEntityTypes: [H],
    meta: {
      treeRepositoryAlias: ta,
      moveRepositoryAlias: Hr,
      treeAlias: ea,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.FontFamily.Rename",
    name: "Rename Dynamic Images Font Family",
    api: () => Promise.resolve().then(() => $f),
    forEntityTypes: [H],
    weight: 650,
    meta: { icon: "icon-edit", label: "#actions_rename", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityAction.FontFamily.Delete",
    name: "Delete Dynamic Images Font Family",
    forEntityTypes: [H],
    meta: {
      itemRepositoryAlias: ja,
      detailRepositoryAlias: Cn,
      referenceRepositoryAlias: Ka
    }
  },
  // ---------------------------------------------------------------- variant
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Font.Refresh",
    name: "Refresh a Dynamic Images Web Font",
    api: () => Promise.resolve().then(() => Tf),
    forEntityTypes: [Xe],
    weight: 500,
    meta: { icon: "icon-sync", label: "Refresh", additionalOptions: !0 },
    conditions: [{ alias: el }]
  },
  {
    type: "entityAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityAction.Font.Delete",
    name: "Delete a Dynamic Images Font",
    forEntityTypes: [Xe],
    meta: {
      itemRepositoryAlias: ja,
      detailRepositoryAlias: On,
      referenceRepositoryAlias: Ka
    }
  },
  // ---------------------------------------------------------------- folder
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.FontFolder.MoveTo",
    name: "Move Dynamic Images Font Folder",
    forEntityTypes: [oe],
    meta: {
      treeRepositoryAlias: ta,
      moveRepositoryAlias: Xr,
      treeAlias: ea,
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
    forEntityTypes: At,
    meta: {
      sortChildrenOfRepositoryAlias: Zr,
      treeRepositoryAlias: ta
    }
  },
  // ---------------------------------------------------------------- collection selection
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Font.MoveTo",
    name: "Move Dynamic Images Fonts",
    forEntityTypes: [oe, H],
    meta: { bulkMoveRepositoryAlias: Jr, treeAlias: ea, foldersOnly: !0 },
    conditions: nl
  },
  {
    type: "entityBulkAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityBulkAction.Font.Delete",
    name: "Delete Dynamic Images Fonts",
    forEntityTypes: [oe, H],
    meta: {
      itemRepositoryAlias: ja,
      detailRepositoryAlias: Qr,
      referenceRepositoryAlias: Ka
    },
    conditions: nl
  },
  // ---------------------------------------------------------------- reload
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Font.ReloadChildren",
    name: "Reload Dynamic Images Fonts",
    forEntityTypes: [...At, H]
  }
], Ln = new at("DiFontFamilyDetailStore");
class Vc extends Oa {
  constructor(t) {
    super(t, Ln);
  }
}
const rl = () => Promise.resolve({ error: new Error("A font family is created by adding a font.") });
var Yt;
class Gm {
  constructor(t) {
    k(this, Yt);
    this.createScaffold = rl, this.create = rl, _(this, Yt, t);
  }
  async read(t) {
    const { data: i, error: a } = await w(c(this, Yt), (o) => Ah(t, o));
    return i ? { data: { entityType: H, unique: i.key, name: i.name } } : { error: a };
  }
  /** A rename: the server carries it onto every variant's family name. */
  async update(t) {
    const { error: i } = await w(c(this, Yt), (a) => Fh(t.unique, t.name, a));
    return i ? { error: i } : this.read(t.unique);
  }
  delete(t) {
    return w(c(this, Yt), (i) => vc(t, i));
  }
}
Yt = new WeakMap();
class ll extends Ia {
  constructor(t) {
    super(t, Gm, Ln);
  }
}
const Hm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FAMILY_DETAIL_STORE_CONTEXT: Ln,
  DiFontFamilyDetailRepository: ll,
  DiFontFamilyDetailStore: Vc,
  api: ll
}, Symbol.toStringTag, { value: "Module" })), Xm = {
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
function ko(e, t) {
  const i = Xm[e], a = i ? `${i} ${e}` : String(e);
  return t ? `${a} Italic` : a;
}
const zn = new at("DiFontDetailStore");
class qc extends Oa {
  constructor(t) {
    super(t, zn);
  }
}
const cl = () => Promise.resolve({ error: new Error("A font is added from the Fonts tree's Create….") });
function Ps(e) {
  return {
    entityType: Xe,
    unique: e.key,
    name: ko(e.weight, e.isItalic),
    font: e,
    weight: e.weight,
    isItalic: e.isItalic,
    styles: e.styles
  };
}
var Gt;
class Jm {
  constructor(t) {
    k(this, Gt);
    this.createScaffold = cl, this.create = cl, _(this, Gt, t);
  }
  async read(t) {
    const { data: i, error: a } = await w(c(this, Gt), (o) => vh(t, o));
    return i ? { data: Ps(i) } : { error: a };
  }
  /** The named styles, weight and slant. The family name is the family's, so it goes back unchanged. */
  async update(t) {
    const { data: i, error: a } = await w(c(this, Gt), (o) => Th(t.unique, t.font.familyName, t.styles, o, { weight: t.weight, isItalic: t.isItalic }));
    return i ? { data: Ps(i) } : { error: a };
  }
  delete(t) {
    return w(c(this, Gt), (i) => yc(t, i));
  }
}
Gt = new WeakMap();
class ul extends Ia {
  constructor(t) {
    super(t, Jm, zn);
  }
}
const Zm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_DETAIL_STORE_CONTEXT: zn,
  DiFontDetailRepository: ul,
  DiFontDetailStore: qc,
  api: ul,
  toDetail: Ps,
  variantName: ko
}, Symbol.toStringTag, { value: "Module" })), dl = (e, t) => ({
  type: "workspaceAction",
  kind: "default",
  alias: e,
  name: `Save ${t}`,
  api: ra,
  meta: { label: "#buttons_save", look: "primary", color: "positive" },
  conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: t }]
}), Qm = [
  // ---------------------------------------------------------------- family
  {
    type: "repository",
    alias: Cn,
    name: "Dynamic Images Font Family Detail Repository",
    api: () => Promise.resolve().then(() => Hm)
  },
  {
    type: "store",
    alias: Rm,
    name: "Dynamic Images Font Family Detail Store",
    api: Vc
  },
  {
    type: "workspace",
    kind: "routable",
    alias: To,
    name: "Dynamic Images Font Family Workspace",
    api: () => Promise.resolve().then(() => xf),
    meta: { entityType: H }
  },
  dl("DynamicImages.WorkspaceAction.FontFamily.Submit", To),
  // ---------------------------------------------------------------- variant
  {
    type: "repository",
    alias: On,
    name: "Dynamic Images Font Detail Repository",
    api: () => Promise.resolve().then(() => Zm)
  },
  {
    type: "store",
    alias: Pm,
    name: "Dynamic Images Font Detail Store",
    api: qc
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Ja,
    name: "Dynamic Images Font Workspace",
    api: () => Promise.resolve().then(() => kf),
    meta: { entityType: Xe }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Font",
    name: "Dynamic Images Font View",
    element: () => Promise.resolve().then(() => Cf),
    weight: 100,
    meta: { label: "Font", pathname: "font", icon: "icon-font" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Ja }]
  },
  dl("DynamicImages.WorkspaceAction.Font.Submit", Ja)
], ey = [
  ...Um,
  ...jm,
  ...Km,
  ...Ym,
  ...Qm
], ty = [
  ...km,
  ...Om,
  ...Cm,
  ...ey,
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
    element: () => Promise.resolve().then(() => Rf),
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
    element: () => Promise.resolve().then(() => Wf),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => jf),
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
    api: vm,
    meta: { entityType: Vo }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => mv),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => vv),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Tv),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Ev),
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
    api: () => Promise.resolve().then(() => Iv),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Ov),
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
    api: () => Promise.resolve().then(() => Cv),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Av),
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
    element: () => Promise.resolve().then(() => Wv)
  }
], Db = (e, t) => {
  t.registerMany(ty);
};
var iy = Object.defineProperty, ay = Object.getOwnPropertyDescriptor, Yc = (e) => {
  throw TypeError(e);
}, Wn = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? ay(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && iy(t, i, o), o;
}, Un = (e, t, i) => t.has(e) || Yc("Cannot " + i), oy = (e, t, i) => (Un(e, t, "read from private field"), t.get(e)), pl = (e, t, i) => t.has(e) ? Yc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), sy = (e, t, i, a) => (Un(e, t, "write to private field"), t.set(e, i), i), ny = (e, t, i) => (Un(e, t, "access private method"), i), Do, Rs, Gc;
let ii = class extends F {
  constructor() {
    super(), pl(this, Rs), pl(this, Do), this._name = "", this._loading = !0, this.consumeContext(It, (e) => {
      sy(this, Do, e), e && (this.observe(e.template, (t) => {
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
            @input=${ny(this, Rs, Gc)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : h}
    `;
  }
};
Do = /* @__PURE__ */ new WeakMap();
Rs = /* @__PURE__ */ new WeakSet();
Gc = function(e) {
  var i;
  const t = e.target.value;
  (i = oy(this, Do)) == null || i.updateTemplateFields({ name: t });
};
ii.styles = R`
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
Wn([
  m()
], ii.prototype, "_name", 2);
Wn([
  m()
], ii.prototype, "_loading", 2);
ii = Wn([
  C("di-template-editor")
], ii);
const ry = ii, us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return ii;
  },
  default: ry
}, Symbol.toStringTag, { value: "Module" }));
class hl extends fn {
  constructor(t) {
    super(t, {
      workspaceAlias: _o,
      entityType: U,
      detailRepositoryAlias: Qi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Ap),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const ly = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: hl,
  api: hl
}, Symbol.toStringTag, { value: "Module" }));
function ds(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function cy(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? U : He
    },
    name: e.name,
    entityType: t ? U : V,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? zc : e.isEnabled ? kn : Dn,
    isEnabled: e.isEnabled
  };
}
class uy extends sc {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: o } = ds(i);
        return w(t, (s) => Ar(a, o, i.foldersOnly ?? !1, s));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = ds(i);
          return w(t, (p) => Ar(n, l, i.foldersOnly ?? !1, p));
        }
        const a = i.parent.unique, { skip: o, take: s } = ds(i);
        return w(t, (n) => nh(a, o, s, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => w(t, (a) => rh(i.treeItem.unique, a)),
      mapper: cy
    });
  }
}
class ml extends nc {
  constructor(t) {
    super(t, uy);
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
const dy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: ml,
  api: ml
}, Symbol.toStringTag, { value: "Module" }));
class Hc extends We {
  async requestMoveTo(t) {
    const { error: i } = await w(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(j);
      a == null || a.peek("positive", { data: { message: "Moved" } });
      const o = await this.getContext(ot).catch(() => {
      }), s = t.destination.unique;
      o == null || o.dispatchEvent(new ni({
        entityType: s ? U : He,
        unique: s
      }));
    }
    return { error: i };
  }
}
class py extends Hc {
  constructor() {
    super(...arguments), this.move = hh;
  }
}
class hy extends Hc {
  constructor() {
    super(...arguments), this.move = mh;
  }
}
const my = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: py
}, Symbol.toStringTag, { value: "Module" })), yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: hy
}, Symbol.toStringTag, { value: "Module" }));
class yl extends We {
  async requestDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: o } = await w(this, (s) => ih(t.unique, i, s));
    if (a) {
      const s = await this.getContext(j);
      s == null || s.peek("positive", { data: { message: `'${a.template.name}' created` } });
      const n = await this.getContext(ot).catch(() => {
      });
      n == null || n.dispatchEvent(new ni({
        entityType: i ? U : He,
        unique: i
      }));
    }
    return { error: o };
  }
}
const fy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateToTemplateRepository: yl,
  api: yl
}, Symbol.toStringTag, { value: "Module" }));
class fl extends We {
  async sortChildrenOf(t) {
    const i = t.sorting.map((o) => ({ key: o.unique, sortOrder: o.sortOrder })), { error: a } = await w(this, (o) => gh(t.unique, i, o));
    if (!a) {
      const o = await this.getContext(j);
      o == null || o.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const gy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortTemplateChildrenRepository: fl,
  api: fl
}, Symbol.toStringTag, { value: "Module" })), Xc = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
class Jc extends We {
  async reloadDestination(t) {
    const i = await this.getContext(ot).catch(() => {
    });
    i == null || i.dispatchEvent(new ni({
      entityType: t ? U : He,
      unique: t
    }));
  }
  async notify(t, i) {
    const a = await this.getContext(j);
    a == null || a.peek(t, { data: { message: i } });
  }
}
class vy extends Jc {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await w(this, (o) => yh(t.uniques, i, o));
    return await this.reloadDestination(i), a || await this.notify("positive", `Moved ${Xc(t.uniques.length, "item")}`), { error: a };
  }
}
class by extends Jc {
  async requestBulkDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: o } = await w(this, (s) => fh(t.uniques, i, s));
    return a ? (await this.reloadDestination(i), a.created.length > 0 && await this.notify("positive", `Copied ${Xc(a.created.length, "template")}`), a.skippedFolders.length > 0 && await this.notify("warning", `Folders are not copied: ${a.skippedFolders.join(", ")}`), a.errors.length > 0 && await this.notify("warning", a.errors.join(" ")), {}) : { error: o };
  }
}
const _y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: vy
}, Symbol.toStringTag, { value: "Module" })), wy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: by
}, Symbol.toStringTag, { value: "Module" }));
class gl extends rc {
  async getHref() {
    return qh({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const $y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: gl,
  api: gl
}, Symbol.toStringTag, { value: "Module" }));
class Nn extends ri {
  async execute() {
    var y;
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await w(this, (D) => ah(t, this.enable, D));
    if (a || !i) throw a ?? new Error("The template could not be changed.");
    const { data: o } = await w(this, (D) => Yo([t], D)), s = ((y = o == null ? void 0 : o[0]) == null ? void 0 : y.name) ?? "The template", n = this.enable ? "enabled" : "disabled", l = await this.getContext(j);
    if (!i.changed) {
      l == null || l.peek("default", { data: { message: `'${s}' is already ${n}` } });
      return;
    }
    l == null || l.peek("positive", { data: { message: `'${s}' ${n}` } });
    const p = await this.getContext(ot).catch(() => {
    });
    p == null || p.dispatchEvent(new vn({ unique: t, entityType: this.args.entityType })), Tn();
  }
}
class vl extends Nn {
  constructor() {
    super(...arguments), this.enable = !0;
  }
}
const Ty = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiEnableTemplateEntityAction: vl,
  DiSetTemplateEnabledEntityAction: Nn,
  api: vl
}, Symbol.toStringTag, { value: "Module" }));
class bl extends Nn {
  constructor() {
    super(...arguments), this.enable = !1;
  }
}
const xy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDisableTemplateEntityAction: bl,
  api: bl
}, Symbol.toStringTag, { value: "Module" }));
class _l extends ri {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await w(this, async (n) => ({
      blob: await oh(t, n),
      alias: (await wn(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const o = URL.createObjectURL(i.blob), s = document.createElement("a");
    s.href = o, s.download = `${i.alias}.json`, s.click(), URL.revokeObjectURL(o);
  }
}
const ky = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: _l,
  api: _l
}, Symbol.toStringTag, { value: "Module" })), Dy = 1500;
async function Zc(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((o) => setTimeout(o, Dy));
    try {
      a = await Uh(a.id, t);
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
class wl extends ri {
  async execute() {
    var p;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await w(this, (y) => Yo([t], y)), a = ((p = i == null ? void 0 : i[0]) == null ? void 0 : p.name) ?? "this template";
    await lc(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: o, error: s } = await w(this, (y) => Tc(t, !1, y));
    if (s || !o) throw s ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(j);
    n == null || n.peek("positive", { data: { message: `Regenerating ${o.total} item(s)…` } });
    const l = await this.getContext(Ce);
    await Zc(o, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const Sy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: wl,
  api: wl
}, Symbol.toStringTag, { value: "Module" })), Ey = new cc(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), Iy = new cc(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class $l extends ri {
  async execute() {
    const { json: t } = await bn(this, Iy, { data: {} }), i = this.args.unique ?? null, { data: a, error: o } = await w(this, (l) => sh(t, "create", l, i));
    if (o || !a) throw o ?? new Error("The template could not be imported.");
    const s = await this.getContext(j);
    s == null || s.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) s == null || s.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(ot);
    n == null || n.dispatchEvent(new ni({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const Oy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: $l,
  api: $l
}, Symbol.toStringTag, { value: "Module" }));
var Cy = Object.defineProperty, Ay = Object.getOwnPropertyDescriptor, Qc = (e) => {
  throw TypeError(e);
}, eu = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ay(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Cy(t, i, o), o;
}, Fy = (e, t, i) => t.has(e) || Qc("Cannot " + i), Py = (e, t, i) => t.has(e) ? Qc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Tl = (e, t, i) => (Fy(e, t, "access private method"), i), Za, tu, iu;
let Mi = class extends uc {
  constructor() {
    super(...arguments), Py(this, Za), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${Tl(this, Za, tu)} aria-label="Choose a file" />
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
            @click=${Tl(this, Za, iu)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Za = /* @__PURE__ */ new WeakSet();
tu = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
iu = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
Mi.styles = [
  R`
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
eu([
  m()
], Mi.prototype, "_json", 2);
Mi = eu([
  C("di-import-template-modal")
], Mi);
const Ry = Mi, My = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return Mi;
  },
  default: Ry
}, Symbol.toStringTag, { value: "Module" }));
function au(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? U : V,
    name: e.name,
    icon: t ? zc : e.isEnabled ? kn : Dn,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class xl extends We {
  async requestCollection(t = {}) {
    const i = await this.getContext(_n), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: o, error: s } = await w(this, (n) => lh({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return o ? { data: { total: o.total, items: o.items.map(au) } } : { error: s };
  }
}
const Ly = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: xl,
  api: xl,
  mapCollectionItem: au
}, Symbol.toStringTag, { value: "Module" }));
class kl extends dc {
  async requestItemHref(t) {
    return t.entityType === U ? ti(U, t.unique) : Ca(t.unique);
  }
}
const zy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: kl,
  api: kl
}, Symbol.toStringTag, { value: "Module" }));
var Wy = Object.defineProperty, Uy = Object.getOwnPropertyDescriptor, ou = (e) => {
  throw TypeError(e);
}, st = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Uy(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Wy(t, i, o), o;
}, Bn = (e, t, i) => t.has(e) || ou("Cannot " + i), So = (e, t, i) => (Bn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Va = (e, t, i) => t.has(e) ? ou("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Qa = (e, t, i, a) => (Bn(e, t, "write to private field"), t.set(e, i), i), ps = (e, t, i) => (Bn(e, t, "access private method"), i), Eo, Vi, pa, qi, su, nu, ru;
const Ny = 400;
let ye = class extends F {
  constructor() {
    super(), Va(this, qi), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, Va(this, Eo), Va(this, Vi), Va(this, pa), this.consumeContext(Ce, (e) => {
      Qa(this, Eo, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), Qa(this, Vi, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && ps(this, qi, su).call(this);
    })), So(this, Vi).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = So(this, Vi)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, Qa(this, pa, void 0);
  }
  render() {
    return this.item ? r`
      <uui-card-media
        name=${this.item.name}
        detail=${la(this.item.docTypes || void 0)}
        href=${la(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${ps(this, qi, nu)}
        @deselected=${ps(this, qi, ru)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : h}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : h;
  }
};
Eo = /* @__PURE__ */ new WeakMap();
Vi = /* @__PURE__ */ new WeakMap();
pa = /* @__PURE__ */ new WeakMap();
qi = /* @__PURE__ */ new WeakSet();
su = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || So(this, pa) === t)) {
    Qa(this, pa, t);
    try {
      const i = await ch(e.unique, Ny, () => {
        var a;
        return (a = So(this, Eo)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
nu = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new pc(this.item.unique)));
};
ru = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new hc(this.item.unique)));
};
ye.styles = [
  R`
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
  f({ type: Object })
], ye.prototype, "item", 2);
st([
  f({ type: Boolean })
], ye.prototype, "selectable", 2);
st([
  f({ type: Boolean })
], ye.prototype, "selected", 2);
st([
  f({ type: Boolean, attribute: "select-only" })
], ye.prototype, "selectOnly", 2);
st([
  f({ type: Boolean })
], ye.prototype, "disabled", 2);
st([
  f({ type: String })
], ye.prototype, "href", 2);
st([
  m()
], ye.prototype, "_src", 2);
st([
  m()
], ye.prototype, "_failed", 2);
ye = st([
  C("di-template-collection-card")
], ye);
const By = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return ye;
  },
  get element() {
    return ye;
  }
}, Symbol.toStringTag, { value: "Module" }));
function Dl(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function jy(e) {
  const t = e.parentKey ? e.entityType === "font" ? H : oe : Dt;
  return {
    unique: e.key,
    parent: { unique: e.parentKey, entityType: t },
    name: e.name,
    entityType: An(e.entityType),
    hasChildren: e.hasChildren,
    isFolder: e.entityType !== "font",
    icon: Fn(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
class Ky extends sc {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: o } = Dl(i);
        return w(t, (s) => Fr(a, o, i.foldersOnly ?? !1, s));
      },
      getChildrenOf: (i) => {
        const { skip: a, take: o } = Dl(i);
        if (i.parent.unique === null)
          return w(t, (n) => Fr(a, o, i.foldersOnly ?? !1, n));
        const s = i.parent.unique;
        return w(t, (n) => kh(s, a, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => w(t, (a) => Dh(i.treeItem.unique, a)),
      mapper: jy
    });
  }
}
class Sl extends nc {
  constructor(t) {
    super(t, Ky);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: Dt,
      name: "Fonts",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const Vy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontTreeRepository: Sl,
  api: Sl
}, Symbol.toStringTag, { value: "Module" }));
class El extends fn {
  constructor(t) {
    super(t, {
      workspaceAlias: $o,
      entityType: oe,
      detailRepositoryAlias: ia
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        // The same element as a template folder's: core's editable folder header, nothing more.
        component: () => Promise.resolve().then(() => Ap),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const qy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFolderWorkspaceContext: El,
  api: El
}, Symbol.toStringTag, { value: "Module" }));
function Yy(e) {
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
function lu(e) {
  return {
    unique: e.key,
    entityType: An(e.entityType),
    name: e.name,
    icon: Fn(e.entityType, e.sourceKind === "url"),
    isFolder: e.entityType === "folder",
    variants: e.variantCount === null ? "" : String(e.variantCount),
    usedBy: e.usedByTemplateCount === null ? "" : String(e.usedByTemplateCount),
    weight: e.weight === null ? "" : String(e.weight),
    style: e.isItalic === null ? "" : e.isItalic ? "Italic" : "Upright",
    source: Yy(e),
    sampleFontKey: e.sampleFontKey
  };
}
class Il extends We {
  async requestCollection(t = {}) {
    const i = await this.getContext(_n), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: o, error: s } = await w(this, (n) => Sh({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return o ? { data: { total: o.total, items: o.items.map(lu) } } : { error: s };
  }
}
const Gy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionRepository: Il,
  api: Il,
  mapFontCollectionItem: lu
}, Symbol.toStringTag, { value: "Module" }));
class Ol extends dc {
  async requestItemHref(t) {
    return ti(t.entityType, t.unique);
  }
}
const Cl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionContext: Ol,
  api: Ol
}, Symbol.toStringTag, { value: "Module" })), Ms = /* @__PURE__ */ new Map(), Aa = (e) => `di-${e}`;
function jn(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Ms.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const o = await xh(e, t), s = new FontFace(Aa(e), o);
      return await s.load(), document.fonts.add(s), s;
    } catch (o) {
      console.warn("[DynamicImages] Could not load font", e, o);
      return;
    }
  })();
  return Ms.set(e, a), a;
}
async function Hy(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => jn(a, t)));
}
function Xy(e) {
  Ms.delete(e);
}
var Jy = Object.defineProperty, Zy = Object.getOwnPropertyDescriptor, cu = (e) => {
  throw TypeError(e);
}, Ot = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Zy(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Jy(t, i, o), o;
}, Kn = (e, t, i) => t.has(e) || cu("Cannot " + i), hs = (e, t, i) => (Kn(e, t, "read from private field"), t.get(e)), ms = (e, t, i) => t.has(e) ? cu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), uu = (e, t, i, a) => (Kn(e, t, "write to private field"), t.set(e, i), i), qa = (e, t, i) => (Kn(e, t, "access private method"), i), Io, aa, pi, Ls, du, pu;
let we = class extends F {
  constructor() {
    super(), ms(this, pi), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._loaded = !1, ms(this, Io), ms(this, aa), this.consumeContext(Ce, (e) => {
      uu(this, Io, e), qa(this, pi, Ls).call(this);
    });
  }
  willUpdate(e) {
    super.willUpdate(e), e.has("item") && qa(this, pi, Ls).call(this);
  }
  render() {
    if (!this.item) return h;
    const e = this.item.isFolder ? void 0 : this.item.variants ? `${this.item.variants} variant${this.item.variants === "1" ? "" : "s"}` : [this.item.style, this.item.source].filter(Boolean).join(" · ");
    return r`
      <uui-card-media
        name=${this.item.name}
        detail=${la(e)}
        href=${la(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${qa(this, pi, du)}
        @deselected=${qa(this, pi, pu)}>
        ${this.item.sampleFontKey && this._loaded ? r`<div class="specimen" style="font-family: ${Aa(this.item.sampleFontKey)}, serif">Aa Bb</div>` : r`<umb-icon name=${this.item.icon}></umb-icon>`}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    `;
  }
};
Io = /* @__PURE__ */ new WeakMap();
aa = /* @__PURE__ */ new WeakMap();
pi = /* @__PURE__ */ new WeakSet();
Ls = function() {
  var i;
  const e = (i = this.item) == null ? void 0 : i.sampleFontKey, t = hs(this, Io);
  !t || !e || hs(this, aa) === e || (uu(this, aa, e), this._loaded = !1, jn(e, () => t.getLatestToken()).then((a) => {
    hs(this, aa) === e && (this._loaded = !!a);
  }));
};
du = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new pc(this.item.unique)));
};
pu = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new hc(this.item.unique)));
};
we.styles = [
  R`
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
Ot([
  f({ type: Object })
], we.prototype, "item", 2);
Ot([
  f({ type: Boolean })
], we.prototype, "selectable", 2);
Ot([
  f({ type: Boolean })
], we.prototype, "selected", 2);
Ot([
  f({ type: Boolean, attribute: "select-only" })
], we.prototype, "selectOnly", 2);
Ot([
  f({ type: Boolean })
], we.prototype, "disabled", 2);
Ot([
  f({ type: String })
], we.prototype, "href", 2);
Ot([
  m()
], we.prototype, "_loaded", 2);
we = Ot([
  C("di-font-collection-card")
], we);
const Qy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontCollectionCardElement() {
    return we;
  },
  get element() {
    return we;
  }
}, Symbol.toStringTag, { value: "Module" }));
class Al extends We {
  async requestReferencedBy(t, i = 0, a = 20) {
    const { data: o, error: s } = await w(this, (l) => fc(t, i, a, l));
    if (!o) return { error: s };
    const n = o.items.map((l) => ({
      entityType: V,
      unique: l.key,
      name: l.name,
      isEnabled: l.isEnabled
    }));
    return { data: { total: o.total, items: n } };
  }
  /** Which of a bulk selection is in use - the fonts themselves, which the bulk modal names. */
  async requestAreReferenced(t, i = 0, a = 20) {
    const { data: o, error: s } = await w(this, (n) => Eh(t, i, a, n));
    return o ? { data: { total: o.total, items: o.items.map(Rn) } } : { error: s };
  }
}
const ef = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontReferenceRepository: Al,
  api: Al
}, Symbol.toStringTag, { value: "Module" }));
class Fl extends We {
  delete(t) {
    return w(this, async (i) => {
      const [a] = await Go([t], i);
      switch (a == null ? void 0 : a.entityType) {
        case "folder":
          return gc(t, i);
        case "family":
          return vc(t, i);
        default:
          return yc(t, i);
      }
    });
  }
}
const tf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontBulkDeleteRepository: Fl,
  api: Fl
}, Symbol.toStringTag, { value: "Module" }));
class hu extends We {
  async moved(t, i) {
    if (i) {
      const o = await this.getContext(j);
      o == null || o.peek("positive", { data: { message: i } });
    }
    const a = await this.getContext(ot).catch(() => {
    });
    a == null || a.dispatchEvent(new ni({
      entityType: t ? oe : Dt,
      unique: t
    }));
  }
}
class mu extends hu {
  async requestMoveTo(t) {
    const i = t.destination.unique, { error: a } = await w(this, (o) => this.move(t.unique, i, o));
    return a || await this.moved(i, "Moved"), { error: a };
  }
}
class af extends mu {
  constructor() {
    super(...arguments), this.move = Ph;
  }
}
class of extends mu {
  constructor() {
    super(...arguments), this.move = Rh;
  }
}
class sf extends hu {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await w(this, (o) => Lh(t.uniques, i, o));
    return await this.moved(i, a ? void 0 : `Moved ${t.uniques.length} item${t.uniques.length === 1 ? "" : "s"}`), { error: a };
  }
}
const nf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: af
}, Symbol.toStringTag, { value: "Module" })), rf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: of
}, Symbol.toStringTag, { value: "Module" })), lf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: sf
}, Symbol.toStringTag, { value: "Module" }));
class Pl extends We {
  async sortChildrenOf(t) {
    const i = t.sorting.map((o) => ({ key: o.unique, sortOrder: o.sortOrder })), { error: a } = await w(this, (o) => Mh(t.unique, i, o));
    if (!a) {
      const o = await this.getContext(j);
      o == null || o.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const cf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortFontChildrenRepository: Pl,
  api: Pl
}, Symbol.toStringTag, { value: "Module" }));
class Rl extends jp {
  constructor(t, i) {
    super(t, i), this.consumeContext(_n, (a) => {
      this.observe(a == null ? void 0 : a.unique, async (o) => {
        var n;
        if (!o) {
          this.permitted = !1;
          return;
        }
        const { data: s } = await w(this, (l) => Go([o], l));
        this.permitted = ((n = s == null ? void 0 : s[0]) == null ? void 0 : n.isUrlFont) ?? !1;
      });
    });
  }
}
const uf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiIsWebFontCondition: Rl,
  api: Rl
}, Symbol.toStringTag, { value: "Module" }));
var df = Object.defineProperty, pf = Object.getOwnPropertyDescriptor, Zo = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? pf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && df(t, i, o), o;
};
let ai = class extends F {
  constructor() {
    super(...arguments), this.readonly = !1, this.standalone = !1;
  }
  render() {
    return this.item ? r`
      <uui-ref-node
        name=${this.item.name ?? "Template"}
        href=${Ca(this.item.unique)}
        ?readonly=${this.readonly}
        ?standalone=${this.standalone}>
        <umb-icon slot="icon" name=${this.item.isEnabled === !1 ? Dn : kn}></umb-icon>
        <slot name="actions" slot="actions"></slot>
      </uui-ref-node>
    ` : h;
  }
};
Zo([
  f({ type: Object })
], ai.prototype, "item", 2);
Zo([
  f({ type: Boolean })
], ai.prototype, "readonly", 2);
Zo([
  f({ type: Boolean })
], ai.prototype, "standalone", 2);
ai = Zo([
  C("di-template-item-ref")
], ai);
const hf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateItemRefElement() {
    return ai;
  },
  get element() {
    return ai;
  }
}, Symbol.toStringTag, { value: "Module" }));
class Qo extends rc {
  async execute() {
    var n, l;
    const t = this.args.unique ?? null, i = { mode: this.mode };
    if (this.args.entityType === H && t) {
      const { data: p } = await w(this, (y) => Go([t], y));
      i.familyKey = t, i.familyName = (n = p == null ? void 0 : p[0]) == null ? void 0 : n.name;
    } else
      i.parentKey = t;
    const a = await bn(this, Ey, { data: i });
    if (!(a != null && a.uploaded)) return;
    const o = await this.getContext(j);
    o == null || o.peek("positive", { data: { message: "Font added" } }), (l = a.warnings) != null && l.length && (o == null || o.peek("warning", { data: { headline: "Some variants were not added", message: a.warnings.join(" ") } }));
    const s = await this.getContext(ot);
    s == null || s.dispatchEvent(new ni({ entityType: this.args.entityType, unique: t })), Tn();
  }
}
class mf extends Qo {
  constructor() {
    super(...arguments), this.mode = "upload";
  }
}
class yf extends Qo {
  constructor() {
    super(...arguments), this.mode = "web";
  }
}
class ff extends Qo {
  constructor() {
    super(...arguments), this.mode = "path";
  }
}
class gf extends Qo {
  constructor() {
    super(...arguments), this.mode = void 0;
  }
}
const vf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: mf
}, Symbol.toStringTag, { value: "Module" })), bf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: yf
}, Symbol.toStringTag, { value: "Module" })), _f = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ff
}, Symbol.toStringTag, { value: "Module" })), wf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: gf
}, Symbol.toStringTag, { value: "Module" }));
class Ml extends ri {
  async getHref() {
    return this.args.unique ? ti(this.args.entityType, this.args.unique) : void 0;
  }
}
const $f = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRenameFontFamilyEntityAction: Ml,
  api: Ml
}, Symbol.toStringTag, { value: "Module" }));
class Ll extends ri {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await w(this, (n) => $h(t, n));
    if (a || !i) throw a ?? new Error("The font could not be refreshed.");
    Xy(t);
    const o = await this.getContext(j);
    o == null || o.peek("positive", { data: { message: `'${i.familyName}' refreshed` } });
    const s = await this.getContext(ot).catch(() => {
    });
    s == null || s.dispatchEvent(new vn({ unique: t, entityType: this.args.entityType }));
  }
}
const Tf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRefreshFontEntityAction: Ll,
  api: Ll
}, Symbol.toStringTag, { value: "Module" }));
class zl extends fn {
  constructor(t) {
    super(t, {
      workspaceAlias: To,
      entityType: H,
      detailRepositoryAlias: Cn
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => qv),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const xf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFamilyWorkspaceContext: zl,
  api: zl
}, Symbol.toStringTag, { value: "Module" }));
class Wl extends Lp {
  constructor(t) {
    super(t, {
      workspaceAlias: Ja,
      entityType: Xe,
      detailRepositoryAlias: On
    }), this.current = this._data.current, this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Xv),
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
    this._data.updateCurrent({ weight: t, name: ko(t, (i == null ? void 0 : i.isItalic) ?? !1) });
  }
  setItalic(t) {
    const i = this._data.getCurrent();
    this._data.updateCurrent({ isItalic: t, name: ko((i == null ? void 0 : i.weight) ?? 400, t) });
  }
}
const Vn = new at(
  Mp.contextAlias,
  void 0,
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === Xe;
  }
), kf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_WORKSPACE_CONTEXT: Vn,
  DiFontWorkspaceContext: Wl,
  api: Wl
}, Symbol.toStringTag, { value: "Module" }));
var Df = Object.defineProperty, Sf = Object.getOwnPropertyDescriptor, yu = (e) => {
  throw TypeError(e);
}, Fa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Sf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Df(t, i, o), o;
}, qn = (e, t, i) => t.has(e) || yu("Cannot " + i), oi = (e, t, i) => (qn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ya = (e, t, i) => t.has(e) ? yu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), zs = (e, t, i, a) => (qn(e, t, "write to private field"), t.set(e, i), i), qe = (e, t, i) => (qn(e, t, "access private method"), i), $t, Oo, Co, De, Ws, fu, eo, gu, vu, bu;
const Ef = ["Regular", "Bold", "Italic", "BoldItalic"];
function If(e) {
  switch (e.sourceKind) {
    case "path":
      return `wwwroot: ${e.path ?? ""}`;
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : e.sourceUrl ?? "Web";
    default:
      return "Media library";
  }
}
let Je = class extends F {
  constructor() {
    super(), Ya(this, De), this._sampleLoaded = !1, this._usedBy = [], this._usedByTotal = 0, Ya(this, $t), Ya(this, Oo), Ya(this, Co), this.consumeContext(Ce, (e) => {
      zs(this, Oo, () => e == null ? void 0 : e.getLatestToken()), qe(this, De, Ws).call(this);
    }), this.consumeContext(Vn, (e) => {
      zs(this, $t, e), this.observe(e == null ? void 0 : e.current, (t) => {
        this._data = t, qe(this, De, Ws).call(this);
      });
    });
  }
  render() {
    const e = this._data;
    return e ? r`
      <uui-box headline="Sample">
        <p class="specimen" style=${this._sampleLoaded ? `font-family: ${Aa(e.unique)}, serif` : ""}>
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
      return (i = oi(this, $t)) == null ? void 0 : i.setWeight(Number(t.target.value) || 400);
    }}>
          </uui-input>
          <uui-toggle
            id="italic"
            label="Italic"
            ?checked=${e.isItalic}
            @change=${(t) => {
      var i;
      return (i = oi(this, $t)) == null ? void 0 : i.setItalic(t.target.checked);
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
        ${qe(this, De, bu).call(this, e.styles)}
        <uui-button look="secondary" label="Add a named style" @click=${qe(this, De, gu)}>Add a style</uui-button>
      </uui-box>

      <uui-box headline="Source">
        <dl>
          <dt>Family</dt>
          <dd>
            ${e.font.familyKey ? r`<a href=${ti(H, e.font.familyKey)}>${e.font.familyName}</a>` : e.font.familyName}
          </dd>
          <dt>File</dt>
          <dd>${If(e.font)}</dd>
        </dl>
      </uui-box>

      <uui-box headline="Used by">
        ${this._usedByTotal === 0 ? r`<p class="hint">No template uses this font.</p>` : r`<ul class="used-by">
              ${se(
      this._usedBy,
      (t) => t.key,
      (t) => r`<li>
                  <uui-ref-node name=${t.name} href=${Ca(t.key)}>
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
$t = /* @__PURE__ */ new WeakMap();
Oo = /* @__PURE__ */ new WeakMap();
Co = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakSet();
Ws = async function() {
  var o;
  const e = (o = this._data) == null ? void 0 : o.unique, t = oi(this, Oo);
  if (!e || !t || oi(this, Co) === e) return;
  zs(this, Co, e);
  const [i, a] = await Promise.all([
    jn(e, t),
    fc(e, 0, 50, t).catch(() => {
    })
  ]);
  this._sampleLoaded = !!i, this._usedBy = (a == null ? void 0 : a.items) ?? [], this._usedByTotal = (a == null ? void 0 : a.total) ?? 0;
};
fu = async function() {
  var a;
  await this.updateComplete, await new Promise((o) => requestAnimationFrame(o));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
eo = function(e, t) {
  var a, o;
  const i = [...((a = this._data) == null ? void 0 : a.styles) ?? []];
  i[e] = { ...i[e], ...t }, (o = oi(this, $t)) == null || o.setStyles(i);
};
gu = function() {
  var e, t;
  (t = oi(this, $t)) == null || t.setStyles([...((e = this._data) == null ? void 0 : e.styles) ?? [], { name: "New style", size: 32, fontStyle: "Regular" }]), qe(this, De, fu).call(this);
};
vu = function(e) {
  var i, a;
  const t = [...((i = this._data) == null ? void 0 : i.styles) ?? []];
  t.splice(e, 1), (a = oi(this, $t)) == null || a.setStyles(t);
};
bu = function(e) {
  return e.length === 0 ? h : r`
      <uui-table>
        <uui-table-head>
          <uui-table-head-cell>Name</uui-table-head-cell>
          <uui-table-head-cell>Size</uui-table-head-cell>
          <uui-table-head-cell>Face</uui-table-head-cell>
          <uui-table-head-cell></uui-table-head-cell>
        </uui-table-head>
        ${se(
    e,
    (t, i) => i,
    (t, i) => r`
            <uui-table-row>
              <uui-table-cell>
                <uui-input
                  class="style-name"
                  label="Style name"
                  .value=${t.name}
                  @change=${(a) => qe(this, De, eo).call(this, i, { name: a.target.value })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-input
                  type="number"
                  label="Size"
                  .value=${String(t.size)}
                  @change=${(a) => qe(this, De, eo).call(this, i, { size: Number(a.target.value) })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-select
                  label="Face"
                  .options=${Ef.map((a) => ({ name: a, value: a, selected: a === t.fontStyle }))}
                  @change=${(a) => qe(this, De, eo).call(this, i, { fontStyle: a.target.value })}>
                </uui-select>
              </uui-table-cell>
              <uui-table-cell>
                <uui-button
                  compact
                  look="secondary"
                  color="danger"
                  label="Remove ${t.name}"
                  @click=${() => qe(this, De, vu).call(this, i)}>
                  <uui-icon name="icon-trash"></uui-icon>
                </uui-button>
              </uui-table-cell>
            </uui-table-row>
          `
  )}
      </uui-table>
    `;
};
Je.styles = R`
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
Fa([
  m()
], Je.prototype, "_data", 2);
Fa([
  m()
], Je.prototype, "_sampleLoaded", 2);
Fa([
  m()
], Je.prototype, "_usedBy", 2);
Fa([
  m()
], Je.prototype, "_usedByTotal", 2);
Je = Fa([
  C("di-font-workspace-view")
], Je);
const Of = Je, Cf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontWorkspaceViewElement() {
    return Je;
  },
  default: Of
}, Symbol.toStringTag, { value: "Module" }));
var Af = Object.defineProperty, Ff = Object.getOwnPropertyDescriptor, _u = (e) => {
  throw TypeError(e);
}, Pa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ff(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Af(t, i, o), o;
}, Yn = (e, t, i) => t.has(e) || _u("Cannot " + i), Tt = (e, t, i) => (Yn(e, t, "read from private field"), t.get(e)), ji = (e, t, i) => t.has(e) ? _u("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ul = (e, t, i, a) => (Yn(e, t, "write to private field"), t.set(e, i), i), Ye = (e, t, i) => (Yn(e, t, "access private method"), i), Yi, Ao, to, oa, Se, Us, wu, $u, Gi, Tu;
let Ze = class extends F {
  constructor() {
    super(), ji(this, Se), ji(this, Yi), ji(this, Ao), this._templates = [], this._fonts = [], this._loading = !0, ji(this, to, () => {
      Tt(this, Yi) && Ye(this, Se, Us).call(this);
    }), ji(this, oa, () => {
      var e;
      return (e = Tt(this, Yi)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(j, (e) => {
      Ul(this, Ao, e);
    }), this.consumeContext(Ce, (e) => {
      Ul(this, Yi, e), e && Ye(this, Se, Us).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Ts, Tt(this, to));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Ts, Tt(this, to));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${Ye(this, Se, $u).call(this)} ${Ye(this, Se, Tu).call(this)}
      </umb-body-layout>
    `;
  }
};
Yi = /* @__PURE__ */ new WeakMap();
Ao = /* @__PURE__ */ new WeakMap();
to = /* @__PURE__ */ new WeakMap();
oa = /* @__PURE__ */ new WeakMap();
Se = /* @__PURE__ */ new WeakSet();
Us = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Zp(Tt(this, oa)),
      xs(Tt(this, oa)).catch(() => []),
      xc(Tt(this, oa)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    Ye(this, Se, wu).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
wu = function(e, t, i) {
  var o;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (o = Tt(this, Ao)) == null || o.peek(e, { data: { headline: t, message: a } });
};
$u = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((o) => o.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${Ye(this, Se, Gi).call(this, "Templates", this._templates.length, "icon-brush", !1, ti(He))}
        ${Ye(this, Se, Gi).call(this, "Fonts", this._fonts.length, "icon-font", !1, ti(Dt))}
        ${Ye(this, Se, Gi).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${Ye(this, Se, Gi).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
Gi = function(e, t, i, a = !1, o) {
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
Tu = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? h : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${se(
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
        <uui-button look="secondary" href=${Yh("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Ze.styles = R`
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
Pa([
  m()
], Ze.prototype, "_templates", 2);
Pa([
  m()
], Ze.prototype, "_fonts", 2);
Pa([
  m()
], Ze.prototype, "_health", 2);
Pa([
  m()
], Ze.prototype, "_loading", 2);
Ze = Pa([
  C("di-overview-dashboard")
], Ze);
const Pf = Ze, Rf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return Ze;
  },
  default: Pf
}, Symbol.toStringTag, { value: "Module" }));
var Mf = Object.getOwnPropertyDescriptor, Lf = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Mf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let Fo = class extends F {
  connectedCallback() {
    super.connectedCallback(), window.history.replaceState(null, "", ti(Dt));
  }
};
Fo = Lf([
  C("di-fonts-redirect")
], Fo);
const zf = Fo, Wf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsRedirectElement() {
    return Fo;
  },
  default: zf
}, Symbol.toStringTag, { value: "Module" }));
var Uf = Object.defineProperty, Nf = Object.getOwnPropertyDescriptor, xu = (e) => {
  throw TypeError(e);
}, Ra = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Nf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Uf(t, i, o), o;
}, Gn = (e, t, i) => t.has(e) || xu("Cannot " + i), mt = (e, t, i) => (Gn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ga = (e, t, i) => t.has(e) ? xu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Nl = (e, t, i, a) => (Gn(e, t, "write to private field"), t.set(e, i), i), vi = (e, t, i) => (Gn(e, t, "access private method"), i), io, bi, Li, xt, Po, Ns, ku;
let Qe = class extends F {
  constructor() {
    super(), Ga(this, xt), Ga(this, io), Ga(this, bi), this._loading = !0, this._busy = !1, Ga(this, Li, () => {
      var e;
      return (e = mt(this, io)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(j, (e) => {
      Nl(this, bi, e);
    }), this.consumeContext(Ce, (e) => {
      Nl(this, io, e), e && vi(this, xt, Po).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => vi(this, xt, Po).call(this)}>Re-check</uui-button>
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
                ${se(
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
                        ${a.templateKey ? r`<a href=${Ca(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${vi(this, xt, ku).call(this)}
      </umb-body-layout>
    `;
  }
};
io = /* @__PURE__ */ new WeakMap();
bi = /* @__PURE__ */ new WeakMap();
Li = /* @__PURE__ */ new WeakMap();
xt = /* @__PURE__ */ new WeakSet();
Po = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      xc(mt(this, Li)),
      jh(mt(this, Li)).catch(() => {
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
    const o = e === "export" ? await Kh(mt(this, Li)) : await Vh(mt(this, Li));
    (t = mt(this, bi)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${o.written} file(s) written.` : `${o.imported} template(s) imported.`
      }
    });
    for (const s of o.messages.slice(0, 3))
      (i = mt(this, bi)) == null || i.peek("warning", { data: { message: s } });
    await vi(this, xt, Po).call(this);
  } catch (o) {
    (a = mt(this, bi)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: o instanceof Error ? o.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
ku = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => vi(this, xt, Ns).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => vi(this, xt, Ns).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : h;
};
Qe.styles = R`
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
Ra([
  m()
], Qe.prototype, "_health", 2);
Ra([
  m()
], Qe.prototype, "_sync", 2);
Ra([
  m()
], Qe.prototype, "_loading", 2);
Ra([
  m()
], Qe.prototype, "_busy", 2);
Qe = Ra([
  C("di-health-dashboard")
], Qe);
const Bf = Qe, jf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Qe;
  },
  default: Bf
}, Symbol.toStringTag, { value: "Module" })), Du = 3, Su = 12, Eu = 0.1, Iu = 0.9;
function Kf(e) {
  return Math.max(Du, Math.min(Su, e));
}
function Vf(e) {
  return Math.max(Eu, Math.min(Iu, e));
}
function qf(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Kf(t), o = 0.5 * Vf(i), s = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let p = 0; p < s; p++) {
    const y = (-90 + p * n) * Math.PI / 180, D = e === "star" && p % 2 === 1 ? o : 0.5;
    l.push({ x: 0.5 + D * Math.cos(y), y: 0.5 + D * Math.sin(y) });
  }
  return l;
}
function Yf(e, t, i) {
  const a = qf(e, t, i);
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
  sides: { min: Du, max: Su },
  innerRatio: { min: Eu, max: Iu }
}, Ro = { min: 0.1, max: 4 };
function Gf(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let o = a;
  return t !== void 0 && (o = Math.max(t, o)), i !== void 0 && (o = Math.min(i, o)), o;
}
function Ou(e) {
  const t = e.composedPath()[0];
  return t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) ? !0 : (t == null ? void 0 : t.isContentEditable) === !0;
}
function Hn(e) {
  const t = e.kind ?? "linear", i = Math.round(Bs(e.centreX ?? 0.5) * 100), a = Math.round(Bs(e.centreY ?? 0.5) * 100);
  switch (t) {
    case "radial":
      return `radial-gradient(${e.shape ?? "ellipse"} ${Xf(e.extent)} at ${i}% ${a}%, ${ys(e)})`;
    case "angular":
      return `conic-gradient(from ${e.angle}deg at ${i}% ${a}%, ${ys(e)})`;
    case "reflected":
      return `linear-gradient(${e.angle}deg, ${js(Jf(St(e)))})`;
    case "diamond": {
      const o = js(St(e).map((s) => ({ ...s, position: s.position / 2 })));
      return [
        `linear-gradient(to top left, ${o}) left top / ${i}% ${a}% no-repeat`,
        `linear-gradient(to top right, ${o}) right top / ${100 - i}% ${a}% no-repeat`,
        `linear-gradient(to bottom left, ${o}) left bottom / ${i}% ${100 - a}% no-repeat`,
        `linear-gradient(to bottom right, ${o}) right bottom / ${100 - i}% ${100 - a}% no-repeat`
      ].join(", ");
    }
    default:
      return `linear-gradient(${e.angle}deg, ${ys(e)})`;
  }
}
function Bs(e) {
  return Math.min(1, Math.max(0, e));
}
const Hf = {
  farthestCorner: "farthest-corner",
  farthestSide: "farthest-side",
  closestCorner: "closest-corner",
  closestSide: "closest-side"
};
function Xf(e) {
  return Hf[e ?? "farthestCorner"] ?? "farthest-corner";
}
function St(e) {
  const t = e.stops;
  return !t || t.length < 2 ? [{ colour: e.from, position: 0 }, { colour: e.to, position: 1 }] : t.map((i, a) => ({ stop: { colour: i.colour, position: Bs(i.position) }, index: a })).sort((i, a) => i.stop.position - a.stop.position || i.index - a.index).map(({ stop: i }) => i);
}
function Jf(e) {
  return [
    ...[...e].reverse().map((t) => ({ colour: t.colour, position: 0.5 - t.position / 2 })),
    ...e.map((t) => ({ colour: t.colour, position: 0.5 + t.position / 2 }))
  ];
}
function ys(e) {
  const t = e.stops;
  return t && t.length >= 2 ? js(St(e)) : `${e.from}, ${e.to}`;
}
function js(e) {
  return e.map((t) => `${t.colour} ${Xn(t.position * 100)}%`).join(", ");
}
const Xn = (e) => Math.round(e * 100) / 100;
function ha(e, t) {
  const i = St({ ...e, stops: t });
  return { ...e, stops: t, from: i[0].colour, to: i[i.length - 1].colour };
}
function Zf(e) {
  const t = [...St(e)].reverse().map((i) => ({ colour: i.colour, position: Xn(1 - i.position) }));
  return ha(e, t);
}
function Qf(e) {
  const t = St(e);
  let i = 0;
  for (let n = 1; n < t.length; n++)
    t[n].position - t[n - 1].position > t[i + 1].position - t[i].position && (i = n - 1);
  const a = t[i], o = t[i + 1], s = Xn((a.position + o.position) / 2);
  return ha(e, [...t, { colour: tg(a.colour, o.colour, 0.5), position: s }]);
}
function eg(e, t) {
  const i = St(e);
  return i.length <= 2 ? e : ha(e, i.filter((a, o) => o !== t));
}
function tg(e, t, i) {
  const a = Bl(e), o = Bl(t);
  if (!a || !o) return e;
  const s = (p) => Math.round(a[p] + (o[p] - a[p]) * i).toString(16).padStart(2, "0").toUpperCase(), n = `#${s(0)}${s(1)}${s(2)}`, l = s(3);
  return l === "FF" ? n : `${n}${l}`;
}
function Bl(e) {
  const t = (e ?? "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t) || ![3, 4, 6, 8].includes(t.length)) return;
  const i = t.length <= 4 ? [...t].map((o) => o + o).join("") : t, a = (o) => parseInt(i.slice(o * 2, o * 2 + 2), 16);
  return [a(0), a(1), a(2), i.length === 8 ? a(3) : 255];
}
const Jn = R`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function ig(e, t) {
  const i = [], a = t.lockX ? void 0 : jl(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    ag(t),
    t.threshold
  ), o = t.lockY ? void 0 : jl(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    og(t),
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
function ag(e) {
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
function og(e) {
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
function jl(e, t, i) {
  let a;
  for (const o of e)
    for (const s of t) {
      const n = Math.abs(s.at - o.value);
      n > i || (!a || n < a.distance) && (a = { at: s.at, offset: o.offset, label: s.label, distance: n });
    }
  return a;
}
var sg = Object.defineProperty, ng = Object.getOwnPropertyDescriptor, Cu = (e) => {
  throw TypeError(e);
}, nt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? ng(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && sg(t, i, o), o;
}, Zn = (e, t, i) => t.has(e) || Cu("Cannot " + i), xe = (e, t, i) => (Zn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), fs = (e, t, i) => t.has(e) ? Cu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), gs = (e, t, i, a) => (Zn(e, t, "write to private field"), t.set(e, i), i), X = (e, t, i) => (Zn(e, t, "access private method"), i), Mt, Hi, M, es, Qn, Au, Fu, Pu, Ru, er, Mo, Mu, Lu, zu, Wu, Uu, Nu, Bu, ju, Ku;
const rg = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], vs = 18;
let Ee = class extends F {
  constructor() {
    super(...arguments), fs(this, M), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, fs(this, Mt), fs(this, Hi);
  }
  willUpdate() {
    this._box = X(this, M, Au).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== xe(this, Hi) && ((t = xe(this, Mt)) == null || t.disconnect(), gs(this, Hi, e), e && (xe(this, Mt) ?? gs(this, Mt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), xe(this, Mt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = xe(this, Mt)) == null || e.disconnect(), gs(this, Hi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return h;
    const e = this._box;
    return r`
      <div
        class=${gn({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${B({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...xe(this, M, Fu) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...X(this, M, er).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      X(this, M, Mu).call(this, t), X(this, M, Mo).call(this, t);
    }}>
        ${X(this, M, Lu).call(this)}
      </div>

      ${this.selected ? X(this, M, ju).call(this, e) : h}
      ${this.showMeasured && this.measured ? X(this, M, Ku).call(this) : h}
    `;
  }
};
Mt = /* @__PURE__ */ new WeakMap();
Hi = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
es = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Qn = function() {
  return this.layer.rotation ?? 0;
};
Au = function() {
  var o;
  const e = this.layer, t = e.size.width ?? X(this, M, Pu).call(this), i = e.size.height ?? ((o = this.measured) == null ? void 0 : o.height) ?? X(this, M, Ru).call(this), a = Jo(xe(this, M, es), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
Fu = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
Pu = function() {
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
Ru = function() {
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
er = function(e) {
  const t = xe(this, M, Qn);
  if (t === 0) return {};
  const i = xe(this, M, es);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Mo = function(e, t) {
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
Mu = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Lu = function() {
  switch (this.layer.type) {
    case "text":
      return X(this, M, zu).call(this);
    case "image":
      return X(this, M, Uu).call(this);
    case "badges":
      return X(this, M, Nu).call(this);
    default:
      return X(this, M, Bu).call(this);
  }
};
zu = function() {
  if (this.layer.type !== "text") return h;
  const e = this.layer.style, t = this.resolvedText || X(this, M, Wu).call(this);
  return r`
      <div
        class="text"
        style=${B({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Aa(e.fontKey)}, sans-serif`,
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
Wu = function() {
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
Uu = function() {
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
Nu = function() {
  if (this.layer.type !== "badges") return h;
  const { badge: e, label: t, gap: i, maxItems: a, direction: o, wrap: s, rowGap: n } = this.layer, l = o === "horizontal", p = l && s, y = t.position ?? "below";
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
        ${se(
    Array.from({ length: Math.max(1, a) }, (D, E) => E),
    (D) => D,
    () => r`
            <div class=${gn({ badge: !0, right: y === "right" })}>
              <div
                class="circle"
                style=${B({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${y === "none" ? h : r`<div
                    class="badge-label"
                    style=${B({
      ...y === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${Aa(t.fontKey)}, sans-serif`,
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
Bu = function() {
  if (this.layer.type !== "rect") return h;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? Hn(i) : e.fill ?? "transparent", o = e.border, s = o ? o.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${B({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: o ? `${s}px solid ${o.colour}` : "none"
    })}>
        </div>
      `;
  const n = Yf(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${B({ clipPath: n, background: o ? o.colour : "transparent" })}>
        <div class="shape-inner" style=${B({ inset: `${s}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
ju = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, o = e.height * this.scale, s = xe(this, M, es), n = xe(this, M, Qn), l = Le(this.layer.position, "x") || Le(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${B({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${o}px`, ...X(this, M, er).call(this, e) })}>
        <span
          class="tag"
          style=${B(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : h}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? h : r`
              ${se(
    rg,
    (p) => p,
    (p) => r`
                  <span
                    class="handle ${p}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${p}"
                    @pointerdown=${(y) => X(this, M, Mo).call(this, y, p)}>
                  </span>
                `
  )}
              <span class="stalk" style=${B({ height: `${vs}px`, top: `${-vs}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${B({ top: `${-vs}px` })}
                @pointerdown=${(p) => X(this, M, Mo).call(this, p, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${s.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${B({
    left: `${(s.x - e.x) * this.scale}px`,
    top: `${(s.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
Ku = function() {
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
Ee.styles = R`
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
  f({ type: Object })
], Ee.prototype, "layer", 2);
nt([
  f({ type: Number })
], Ee.prototype, "scale", 2);
nt([
  f({ type: Boolean, reflect: !0 })
], Ee.prototype, "selected", 2);
nt([
  f({ type: Object })
], Ee.prototype, "measured", 2);
nt([
  f({ type: Boolean })
], Ee.prototype, "showMeasured", 2);
nt([
  f({ type: String })
], Ee.prototype, "resolvedText", 2);
nt([
  f({ attribute: !1 })
], Ee.prototype, "resolvedPosition", 2);
nt([
  m()
], Ee.prototype, "_box", 2);
Ee = nt([
  C("di-layer-box")
], Ee);
var lg = Object.defineProperty, cg = Object.getOwnPropertyDescriptor, Vu = (e) => {
  throw TypeError(e);
}, tr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? cg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && lg(t, i, o), o;
}, ug = (e, t, i) => t.has(e) || Vu("Cannot " + i), dg = (e, t, i) => t.has(e) ? Vu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), pg = (e, t, i) => (ug(e, t, "access private method"), i), Ks, qu;
let ma = class extends F {
  constructor() {
    super(...arguments), dg(this, Ks), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${se(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => pg(this, Ks, qu).call(this, e)
    )}`;
  }
};
Ks = /* @__PURE__ */ new WeakSet();
qu = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
ma.styles = R`
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
tr([
  f({ type: Array })
], ma.prototype, "guides", 2);
tr([
  f({ type: Number })
], ma.prototype, "scale", 2);
ma = tr([
  C("di-guides")
], ma);
var hg = Object.defineProperty, mg = Object.getOwnPropertyDescriptor, Yu = (e) => {
  throw TypeError(e);
}, Ma = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? mg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && hg(t, i, o), o;
}, yg = (e, t, i) => t.has(e) || Yu("Cannot " + i), fg = (e, t, i) => t.has(e) ? Yu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Kl = (e, t, i) => (yg(e, t, "access private method"), i), ao, Vs;
let Z = class extends F {
  constructor() {
    super(...arguments), fg(this, ao), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Kl(this, ao, Vs).call(this, "top"), Kl(this, ao, Vs).call(this, "left");
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
ao = /* @__PURE__ */ new WeakSet();
Vs = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, o = a * this.scale, s = window.devicePixelRatio || 1;
  t.width = (e === "top" ? o : Z.thickness) * s, t.height = (e === "top" ? Z.thickness : o) * s, t.style.width = `${e === "top" ? o : Z.thickness}px`, t.style.height = `${e === "top" ? Z.thickness : o}px`, i.setTransform(s, 0, 0, s, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const p = Math.round(l * this.scale) + 0.5, y = l % 100 === 0, D = y ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(p, Z.thickness - D), i.lineTo(p, Z.thickness)) : (i.moveTo(Z.thickness - D, p), i.lineTo(Z.thickness, p)), i.stroke(), y && l > 0 && (e === "top" ? i.fillText(String(l), p + 2, 9) : (i.save(), i.translate(9, p - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
Z.thickness = 20;
Z.styles = R`
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
      /* A hairline past the end of its ruler must never become the viewport's scrollable overflow. */
      overflow: hidden;
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
Ma([
  f({ type: Number })
], Z.prototype, "canvasWidth", 2);
Ma([
  f({ type: Number })
], Z.prototype, "canvasHeight", 2);
Ma([
  f({ type: Number })
], Z.prototype, "scale", 2);
Ma([
  f({ type: Object })
], Z.prototype, "pointer", 2);
Z = Ma([
  C("di-rulers")
], Z);
var gg = Object.defineProperty, vg = Object.getOwnPropertyDescriptor, Gu = (e) => {
  throw TypeError(e);
}, te = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? vg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && gg(t, i, o), o;
}, ir = (e, t, i) => t.has(e) || Gu("Cannot " + i), S = (e, t, i) => (ir(e, t, "read from private field"), i ? i.call(e) : t.get(e)), N = (e, t, i) => t.has(e) ? Gu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), pt = (e, t, i, a) => (ir(e, t, "write to private field"), t.set(e, i), i), P = (e, t, i) => (ir(e, t, "access private method"), i), Lt, zt, Xi, Ji, kt, A, ar, qs, or, ts, sr, Ys, Hu, Xu, nr, Ju, Zu, Gs, oo, Qu, ed, hi, rr, td, id, Hs, Xs, so, no, ro, Js, Zs, Qs, ad, en, tn, an, od;
const bg = 6, sd = 20, _g = 2, wg = 15, $g = 0.1;
let Y = class extends F {
  constructor() {
    super(...arguments), N(this, A), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, this._spaceHeld = !1, this._panning = !1, N(this, Lt), N(this, zt), N(this, Xi, !1), N(this, Ji), N(this, kt, /* @__PURE__ */ new Map()), N(this, Gs, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = P(this, A, sr).call(this, t), a = P(this, A, Ys).call(this, t), o = P(this, A, Hu).call(this, t), s = P(this, A, ts).call(this, e.detail.startX, e.detail.startY);
      pt(this, Lt, {
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
    }), N(this, oo, (e) => {
      var ne, dt;
      P(this, A, td).call(this, e.clientX, e.clientY);
      const t = S(this, zt);
      if (t) {
        if (e.pointerId !== t.pointerId) return;
        const Ue = P(this, A, id).call(this);
        Ue && (Ue.scrollLeft = t.scrollLeft - (e.clientX - t.startX), Ue.scrollTop = t.scrollTop - (e.clientY - t.startY));
        return;
      }
      const i = S(this, Lt);
      if (!i) return;
      const a = this.template.layers.find((Ue) => Ue.key === i.key);
      if (!a) return;
      const o = (e.clientX - i.startClientX) / this.scale, s = (e.clientY - i.startClientY) / this.scale;
      if (!i.moved && Math.abs(o) < 1 && Math.abs(s) < 1) return;
      if (i.moved = !0, i.handle === "rotate") {
        P(this, A, ed).call(this, a, i, e);
        return;
      }
      const n = Le(a.position, "x"), l = Le(a.position, "y"), p = i.startRotation, y = e.shiftKey || a.type === "rect" && a.lockAspect === !0;
      if (i.handle && p !== 0) {
        P(this, A, Qu).call(this, a, i, i.handle, o, s, y, n, l);
        return;
      }
      let D = i.handle ? P(this, A, rr).call(this, i.startBox, i.handle, o, s, y) : { ...i.startBox, x: i.startBox.x + o, y: i.startBox.y + s };
      n && (D = { ...D, x: i.startBox.x, width: (ne = i.handle) != null && ne.includes("w") ? i.startBox.width : D.width }), l && (D = { ...D, y: i.startBox.y, height: (dt = i.handle) != null && dt.includes("n") ? i.startBox.height : D.height });
      const E = { x: i.startExtent.x - i.startBox.x, y: i.startExtent.y - i.startBox.y }, L = p !== 0 ? { x: D.x + E.x, y: D.y + E.y, width: i.startExtent.width, height: i.startExtent.height } : D, ue = this.snapEnabled && !e.altKey ? ig(L, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((Ue) => Ue.key !== a.key).map((Ue) => P(this, A, Ys).call(this, Ue)),
        threshold: bg / this.scale,
        lockX: n,
        lockY: l
      }) : {
        box: {
          ...L,
          x: n ? L.x : Math.round(L.x),
          y: l ? L.y : Math.round(L.y)
        },
        guides: []
      };
      this._guides = ue.guides;
      const ve = p !== 0 ? { ...D, x: ue.box.x - E.x, y: ue.box.y - E.y } : ue.box, Ct = tm(ve, a.position);
      n && (Ct.x = a.position.x), l && (Ct.y = a.position.y);
      const Ni = { position: Ct };
      i.handle && (Ni.size = {
        width: Math.max(1, Math.round(ve.width)),
        height: Math.max(1, Math.round(ve.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: a.key, patch: Ni } })
      );
    }), N(this, hi, (e) => {
      if (S(this, zt)) {
        if (e.pointerId !== S(this, zt).pointerId) return;
        pt(this, zt, void 0), this._panning = !1;
        return;
      }
      if (!S(this, Lt)) return;
      const t = S(this, Lt).moved;
      pt(this, Lt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: t } }));
    }), N(this, Hs, {
      capture: !0,
      handleEvent: (e) => {
        var s;
        const t = e.currentTarget, i = e.composedPath()[0], a = i === t || ((s = i == null ? void 0 : i.classList) == null ? void 0 : s.contains("artboard")) === !0;
        if (e.button === 1 || e.button === 0 && (this._spaceHeld || a)) {
          e.preventDefault(), e.stopPropagation();
          try {
            t.setPointerCapture(e.pointerId);
          } catch {
          }
          pt(this, zt, {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            scrollLeft: t.scrollLeft,
            scrollTop: t.scrollTop
          }), this._panning = !0;
        }
      }
    }), N(this, Xs, (e) => {
      e.button === 1 && e.preventDefault();
    }), N(this, so, (e) => {
      e.key !== " " || !S(this, Xi) || Ou(e) || (e.preventDefault(), !e.repeat && (this._spaceHeld = !0));
    }), N(this, no, (e) => {
      e.key !== " " || !this._spaceHeld || (e.preventDefault(), this._spaceHeld = !1);
    }), N(this, ro, () => {
      this._spaceHeld = !1;
    }), N(this, Js, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), N(this, Zs, () => {
      this._dropTarget = !1;
    }), N(this, Qs, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = P(this, A, or).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: P(this, A, ad).call(this, e) }
        })
      );
    }), N(this, en, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), N(this, tn, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Ac(t.position)) && this.requestUpdate();
    }), N(this, an, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), pt(this, Ji, new ResizeObserver(() => P(this, A, qs).call(this))), S(this, Ji).observe(this), window.addEventListener("pointermove", S(this, oo)), window.addEventListener("pointerup", S(this, hi)), window.addEventListener("pointercancel", S(this, hi)), window.addEventListener("keydown", S(this, so)), window.addEventListener("keyup", S(this, no)), window.addEventListener("blur", S(this, ro));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = S(this, Ji)) == null || e.disconnect(), window.removeEventListener("pointermove", S(this, oo)), window.removeEventListener("pointerup", S(this, hi)), window.removeEventListener("pointercancel", S(this, hi)), window.removeEventListener("keydown", S(this, so)), window.removeEventListener("keyup", S(this, no)), window.removeEventListener("blur", S(this, ro));
  }
  updated(e) {
    P(this, A, qs).call(this), e.has("zoom") && P(this, A, ar).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = S(this, kt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return h;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((s) => [s.key, s]));
    P(this, A, Xu).call(this);
    const o = this.showRulers ? sd : 0;
    return r`
      <div
        class=${gn({
      viewport: !0,
      "drop-target": this._dropTarget,
      "pan-ready": this._spaceHeld,
      panning: this._panning
    })}
        @pointerdown=${S(this, Hs)}
        @mousedown=${S(this, Xs)}
        @pointerenter=${() => {
      pt(this, Xi, !0);
    }}
        @pointerleave=${() => {
      pt(this, Xi, !1);
    }}
        @wheel=${S(this, en)}
        @dragover=${S(this, Js)}
        @dragleave=${S(this, Zs)}
        @drop=${S(this, Qs)}
        @di-layer-drag-start=${S(this, Gs)}
        @di-layer-box-resize=${S(this, tn)}>
        <div
          class="artboard"
          style=${B({
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
            style=${B({
      background: e.backgroundGradient ? Hn(e.backgroundGradient) : e.background
    })}
            @pointerdown=${S(this, an)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${B({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : h}

            ${se(
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
                  .resolvedPosition=${(l = S(this, kt).get(s.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? P(this, A, od).call(this) : h}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
Lt = /* @__PURE__ */ new WeakMap();
zt = /* @__PURE__ */ new WeakMap();
Xi = /* @__PURE__ */ new WeakMap();
Ji = /* @__PURE__ */ new WeakMap();
kt = /* @__PURE__ */ new WeakMap();
A = /* @__PURE__ */ new WeakSet();
ar = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
qs = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? sd : 0) + _g, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, P(this, A, ar).call(this));
};
or = function(e, t) {
  const i = P(this, A, ts).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
ts = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
sr = function(e) {
  const t = S(this, kt).get(e.key);
  if (t) return t.box;
  const i = P(this, A, nr).call(this, e), a = Jo(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Ys = function(e) {
  const t = S(this, kt).get(e.key);
  return t ? t.extent : Cc(P(this, A, sr).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Hu = function(e) {
  var t;
  return ((t = S(this, kt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Xu = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  pt(this, kt, rm(
    this.template.layers,
    (i) => P(this, A, nr).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
nr = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? P(this, A, Ju).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? P(this, A, Zu).call(this, e, i)
  };
};
Ju = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Zu = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Gs = /* @__PURE__ */ new WeakMap();
oo = /* @__PURE__ */ new WeakMap();
Qu = function(e, t, i, a, o, s, n, l) {
  const p = t.startRotation, y = t.startPosition, D = im(a, o, 0, 0, p);
  let E = P(this, A, rr).call(this, t.startBox, i, D.x, D.y, s);
  n && (E = { ...E, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : E.width }), l && (E = { ...E, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : E.height });
  const L = Math.max(1, Math.round(E.width)), Ae = Math.max(1, Math.round(E.height)), ue = xn(E.x, E.y, L, Ae, y.anchor), ve = mi(ue.x, ue.y, y.x, y.y, p), Ct = {
    ...e.position,
    x: n ? e.position.x : Math.round(ve.x),
    y: l ? e.position.y : Math.round(ve.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Ct, size: { width: L, height: Ae } } }
    })
  );
};
ed = function(e, t, i) {
  const a = t.startPosition, o = P(this, A, ts).call(this, i.clientX, i.clientY), n = (Math.atan2(o.y - a.y, o.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, p = i.shiftKey ? wg : $g, y = Oc(Math.round(l / p) * p);
  this._guides = [], y !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: y } }
    })
  );
};
hi = /* @__PURE__ */ new WeakMap();
rr = function(e, t, i, a, o) {
  let { x: s, y: n, width: l, height: p } = e;
  if (t.includes("w") && (s = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, p = e.height - a), t.includes("s") && (p = e.height + a), o && e.width > 0 && e.height > 0) {
    const y = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(p - e.height) ? p = l / y : l = p * y, t.includes("n") && (n = e.y + e.height - p), t.includes("w") && (s = e.x + e.width - l);
  }
  return { x: s, y: n, width: Math.max(4, l), height: Math.max(4, p) };
};
td = function(e, t) {
  var s, n, l;
  const i = (s = this.template) == null ? void 0 : s.canvas, a = i ? P(this, A, or).call(this, e, t) : void 0, o = i && a && a.x >= 0 && a.y >= 0 && a.x <= i.width && a.y <= i.height ? a : void 0;
  (o == null ? void 0 : o.x) === ((n = this._pointer) == null ? void 0 : n.x) && (o == null ? void 0 : o.y) === ((l = this._pointer) == null ? void 0 : l.y) || (this._pointer = o);
};
id = function() {
  return this.renderRoot.querySelector(".viewport");
};
Hs = /* @__PURE__ */ new WeakMap();
Xs = /* @__PURE__ */ new WeakMap();
so = /* @__PURE__ */ new WeakMap();
no = /* @__PURE__ */ new WeakMap();
ro = /* @__PURE__ */ new WeakMap();
Js = /* @__PURE__ */ new WeakMap();
Zs = /* @__PURE__ */ new WeakMap();
Qs = /* @__PURE__ */ new WeakMap();
ad = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
en = /* @__PURE__ */ new WeakMap();
tn = /* @__PURE__ */ new WeakMap();
an = /* @__PURE__ */ new WeakMap();
od = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${B({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
Y.styles = R`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }

    .viewport {
      width: 100%;
      height: 100%;
      overflow: auto;
      /* Panning replaces the scrollbars; the viewport still scrolls for the wheel and trackpad. */
      scrollbar-width: none;
      display: flex;
      padding: 24px;
      box-sizing: border-box;
      /* The bare checkerboard is a handle for the view. */
      cursor: grab;
      ${Jn}
    }

    .viewport::-webkit-scrollbar {
      display: none;
    }

    .viewport.drop-target {
      outline: 2px dashed var(--uui-color-focus);
      outline-offset: -8px;
    }

    .viewport.pan-ready,
    .viewport.pan-ready * {
      cursor: grab;
    }

    .viewport.panning,
    .viewport.panning * {
      cursor: grabbing;
    }

    /* Layer boxes set their own cursors inside their shadow roots, which no rule here can reach -
       so while Space is held they stop taking the pointer and the stage's grab shows through. */
    .viewport.pan-ready .stage > *,
    .viewport.panning .stage > * {
      pointer-events: none;
    }

    .artboard {
      position: relative;
      flex: 0 0 auto;
      /* Centres the artboard while it fits. Flex centring pushed the overflow of a zoomed-in
         artboard off both edges, and only the right and bottom can be scrolled to; auto margins
         collapse to zero instead, so every edge stays reachable. */
      margin: auto;
    }

    .stage {
      cursor: default;
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
  f({ type: Object })
], Y.prototype, "template", 2);
te([
  f({ type: String })
], Y.prototype, "selectedLayerKey", 2);
te([
  f({ type: Object })
], Y.prototype, "baseImageUrl", 2);
te([
  f({ type: Array })
], Y.prototype, "serverBounds", 2);
te([
  f({ type: Boolean })
], Y.prototype, "showMeasured", 2);
te([
  f({ type: Boolean })
], Y.prototype, "snapEnabled", 2);
te([
  f({ type: Boolean })
], Y.prototype, "showRulers", 2);
te([
  f({ type: Boolean })
], Y.prototype, "showSafeArea", 2);
te([
  f({ type: Number })
], Y.prototype, "zoom", 2);
te([
  m()
], Y.prototype, "_fitScale", 2);
te([
  m()
], Y.prototype, "_guides", 2);
te([
  m()
], Y.prototype, "_pointer", 2);
te([
  m()
], Y.prototype, "_dropTarget", 2);
te([
  m()
], Y.prototype, "_spaceHeld", 2);
te([
  m()
], Y.prototype, "_panning", 2);
Y = te([
  C("di-designer-canvas")
], Y);
var Tg = Object.defineProperty, xg = Object.getOwnPropertyDescriptor, nd = (e) => {
  throw TypeError(e);
}, lr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? xg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Tg(t, i, o), o;
}, rd = (e, t, i) => t.has(e) || nd("Cannot " + i), kg = (e, t, i) => (rd(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Dg = (e, t, i) => t.has(e) ? nd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _e = (e, t, i) => (rd(e, t, "access private method"), i), ae, ld, cr, ur, cd, ud, dd, pd, sa;
const Vl = {
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
let ya = class extends F {
  constructor() {
    super(...arguments), Dg(this, ae), this.properties = [], this._search = "";
  }
  render() {
    const e = Sg(kg(this, ae, ld));
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

        ${_e(this, ae, ud).call(this)}

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : se(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => _e(this, ae, cd).call(this, t, i)
    )}
      </div>
    `;
  }
};
ae = /* @__PURE__ */ new WeakSet();
ld = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
cr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
ur = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
cd = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${se(
    t,
    (i) => i.alias,
    (i) => _e(this, ae, sa).call(
      this,
      i.name,
      Vl[i.classification] ?? Vl.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
ud = function() {
  return r`
      <div class="group">
        <h5>Elements</h5>
        ${_e(this, ae, sa).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${_e(this, ae, sa).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${_e(this, ae, sa).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${_e(this, ae, dd).call(this)}
      </div>
    `;
};
dd = function() {
  const e = { kind: "static", layerType: "rect", preset: "rectangle" };
  return r`
      <div
        class="chip other shape"
        draggable="true"
        title="Shape"
        @dragstart=${(t) => _e(this, ae, ur).call(this, t, e)}>
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
          ${Gh.map((t) => r`
            <uui-menu-item
              label=${ca[t].label}
              data-preset=${t}
              @click-label=${() => _e(this, ae, pd).call(this, t)}>
              <uui-icon slot="icon" name=${ca[t].icon}></uui-icon>
            </uui-menu-item>
          `)}
        </div>
      </uui-popover-container>
    `;
};
pd = function(e) {
  var t, i, a;
  (a = (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#shape-menu")) == null ? void 0 : i.hidePopover) == null || a.call(i), _e(this, ae, cr).call(this, { kind: "static", layerType: "rect", preset: e });
};
sa = function(e, t, i, a, o) {
  const s = o ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${s}
        @dragstart=${(n) => _e(this, ae, ur).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${s}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${o ?? `Add ${e} to the canvas`}
          @click=${() => _e(this, ae, cr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
ya.styles = R`
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
lr([
  f({ type: Array })
], ya.prototype, "properties", 2);
lr([
  m()
], ya.prototype, "_search", 2);
ya = lr([
  C("di-property-palette")
], ya);
function Sg(e) {
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
function Eg(e) {
  return e.backgroundGradient ? "gradient" : Ig(e.background) ? "transparent" : "colour";
}
function Ig(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function Og(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((o) => o + o).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var Cg = Object.defineProperty, Ag = Object.getOwnPropertyDescriptor, hd = (e) => {
  throw TypeError(e);
}, dr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ag(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Cg(t, i, o), o;
}, Fg = (e, t, i) => t.has(e) || hd("Cannot " + i), Pg = (e, t, i) => t.has(e) ? hd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ql = (e, t, i) => (Fg(e, t, "access private method"), i), lo, on;
let fa = class extends F {
  constructor() {
    super(...arguments), Pg(this, lo), this.value = "#FFFFFF", this.label = "Colour";
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
          @change=${ql(this, lo, on)}></uui-color-picker>
        <uui-input
          label="${this.label} (hex)"
          spellcheck="false"
          .value=${this.value}
          @change=${ql(this, lo, on)}></uui-input>
      </div>
    `;
  }
};
lo = /* @__PURE__ */ new WeakSet();
on = function(e) {
  e.stopPropagation();
  const t = Yl(e.target.value);
  !t || t === Yl(this.value) || (this.value = t, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: t } })));
};
fa.styles = R`
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
dr([
  f({ type: String })
], fa.prototype, "value", 2);
dr([
  f({ type: String })
], fa.prototype, "label", 2);
fa = dr([
  C("di-colour-input")
], fa);
function Yl(e) {
  const t = (e ?? "").trim(), i = t.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(i) || ![3, 4, 6, 8].includes(i.length)) return t;
  const o = (i.length <= 4 ? [...i].map((s) => s + s).join("") : i).toUpperCase();
  return o.length === 8 && o.endsWith("FF") ? `#${o.slice(0, 6)}` : `#${o}`;
}
var Rg = Object.defineProperty, Mg = Object.getOwnPropertyDescriptor, md = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Mg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Rg(t, i, o), o;
};
const Gl = {
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
let Lo = class extends F {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${se(
      Ic,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Gl[e]}
              title=${Gl[e]}
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
Lo.styles = R`
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
md([
  f({ type: String })
], Lo.prototype, "value", 2);
Lo = md([
  C("di-anchor-picker")
], Lo);
var Lg = Object.defineProperty, zg = Object.getOwnPropertyDescriptor, yd = (e) => {
  throw TypeError(e);
}, rt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? zg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Lg(t, i, o), o;
}, Wg = (e, t, i) => t.has(e) || yd("Cannot " + i), Ug = (e, t, i) => t.has(e) ? yd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ng = (e, t, i) => (Wg(e, t, "access private method"), i), sn, fd;
let Ie = class extends F {
  constructor() {
    super(...arguments), Ug(this, sn), this.label = "", this.suffix = "px", this.step = 1, this.compact = !1, this.placeholder = "Auto";
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
          @change=${Ng(this, sn, fd)} />
        ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : h}
      </span>
    `;
    return !this.label || this.compact ? e : r`<umb-property-layout orientation="vertical" label=${this.label}>${e}</umb-property-layout>`;
  }
};
sn = /* @__PURE__ */ new WeakSet();
fd = function(e) {
  const t = e.target, i = t.value, a = Gf(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const o = a === null ? "" : String(a);
  o !== i && (t.value = o), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Ie.styles = R`
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
  f({ type: Number })
], Ie.prototype, "value", 2);
rt([
  f({ type: String })
], Ie.prototype, "label", 2);
rt([
  f({ type: String })
], Ie.prototype, "suffix", 2);
rt([
  f({ type: Number })
], Ie.prototype, "step", 2);
rt([
  f({ type: Number })
], Ie.prototype, "min", 2);
rt([
  f({ type: Number })
], Ie.prototype, "max", 2);
rt([
  f({ type: Boolean, reflect: !0 })
], Ie.prototype, "compact", 2);
rt([
  f({ type: String })
], Ie.prototype, "placeholder", 2);
Ie = rt([
  C("di-number-field")
], Ie);
var Bg = Object.defineProperty, jg = Object.getOwnPropertyDescriptor, gd = (e) => {
  throw TypeError(e);
}, li = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? jg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Bg(t, i, o), o;
}, Kg = (e, t, i) => t.has(e) || gd("Cannot " + i), Vg = (e, t, i) => t.has(e) ? gd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (Kg(e, t, "access private method"), i), u, b, be, vd, bd, _d, pr, wd, $d, Td, nn, xd, kd, Dd, Sd, Ed, Id, rn, Od, Cd, ln, Ad, co, Fd, Pd, hr, ze, Wi, Rd, mr, Md;
const qg = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let et = class extends F {
  constructor() {
    super(...arguments), Vg(this, u), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? d(this, u, xd).call(this, this.layer) : d(this, u, vd).call(this)}</div>` : h;
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
vd = function() {
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

        ${d(this, u, bd).call(this, e)}

        <umb-property-layout orientation="vertical" label="Base image">

          <div slot="editor" class="editor">
          <uui-select
            label="Base image source"
            .value=${e.baseImage.kind}
            .options=${Ld(e.baseImage.kind)}
            @change=${(t) => d(this, u, be).call(this, {
    baseImage: { ...e.baseImage, kind: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.baseImage.kind === "media" ? d(this, u, ze).call(this, "Media item", d(this, u, hr).call(this, e.baseImage.mediaKey, (t) => d(this, u, be).call(this, { baseImage: { ...e.baseImage, kind: "media", mediaKey: t } }))) : h}

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
              ${d(this, u, Wi).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, be).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.baseImageFit}
            .options=${q(["cover", "contain", "stretch"], e.baseImageFit)}
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
bd = function(e) {
  const t = Eg(e);
  return r`
      <umb-property-layout orientation="vertical" label="Fill">

        <div slot="editor" class="editor">
        <uui-select
          .value=${t}
          .options=${q(["colour", "gradient", "transparent"], t)}
          @change=${(i) => d(this, u, _d).call(this, e, i.target.value)}>
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

      ${t === "gradient" && e.backgroundGradient ? d(this, u, pr).call(this, e.backgroundGradient, (i) => d(this, u, be).call(this, { backgroundGradient: i })) : h}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : h}
    `;
};
_d = function(e, t) {
  if (t === "gradient") {
    d(this, u, be).call(this, { backgroundGradient: e.backgroundGradient ?? Ec() });
    return;
  }
  d(this, u, be).call(this, {
    background: Og(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
pr = function(e, t) {
  const i = e.kind ?? "linear", a = i === "linear" || i === "reflected" || i === "angular", o = i === "radial" || i === "angular" || i === "diamond";
  return r`
      ${d(this, u, ze).call(this, "Gradient type", r`
        <uui-select
          label="Gradient type"
          .value=${i}
          .options=${q(["linear", "radial", "angular", "diamond", "reflected"], i, Yg)}
          @change=${(s) => t({ ...e, kind: s.target.value })}>
        </uui-select>
      `)}

      <div class="gradient-preview" role="img" aria-label="The gradient" style="background: ${Hn(e)}"></div>

      ${a ? d(this, u, wd).call(this, e, t) : h}
      ${i === "radial" ? d(this, u, $d).call(this, e, t) : h}
      ${o ? r`
            ${d(this, u, nn).call(this, "Centre X", e.centreX, (s) => t({ ...e, centreX: s }))}
            ${d(this, u, nn).call(this, "Centre Y", e.centreY, (s) => t({ ...e, centreY: s }))}
          ` : h}

      ${d(this, u, Td).call(this, e, t)}
    `;
};
wd = function(e, t) {
  const i = Math.round(e.angle ?? 180) % 360, a = (o) => t({ ...e, angle: (Math.round(o) % 360 + 360) % 360 });
  return d(this, u, ze).call(this, e.kind === "angular" ? "Start angle" : "Angle", r`
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
          ${Hg.map(([o, s, n]) => r`
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
$d = function(e, t) {
  const i = e.shape ?? "ellipse", a = e.extent ?? "farthestCorner";
  return r`
      ${d(this, u, ze).call(this, "Shape", r`
        <uui-select
          label="Radial shape"
          .value=${i}
          .options=${q(["ellipse", "circle"], i)}
          @change=${(o) => t({ ...e, shape: o.target.value })}>
        </uui-select>
      `)}
      ${d(this, u, ze).call(this, "Size", r`
        <uui-select
          label="Radial size"
          .value=${a}
          .options=${q(["farthestCorner", "farthestSide", "closestCorner", "closestSide"], a, Gg)}
          @change=${(o) => t({ ...e, extent: o.target.value })}>
        </uui-select>
      `, "Where the last colour lands.")}
    `;
};
Td = function(e, t) {
  const i = St(e);
  return d(this, u, ze).call(this, "Colour stops", r`
      <div class="stops">
        ${i.map((a, o) => r`
          <div class="stop">
            <di-colour-input
              label="Stop ${o + 1} colour"
              .value=${a.colour}
              @change=${(s) => t(ha(e, i.map((n, l) => l === o ? { ...n, colour: s.detail.value } : n)))}>
            </di-colour-input>
            <div class="stop-position">
              <di-number-field
                label="Position"
                suffix="%"
                .min=${0}
                .max=${100}
                .value=${Math.round(a.position * 100)}
                @change=${(s) => t(ha(e, i.map((n, l) => l === o ? { ...n, position: (s.detail.value ?? 0) / 100 } : n)))}>
              </di-number-field>
              <uui-button
                compact
                look="secondary"
                color="danger"
                label="Remove stop ${o + 1}"
                ?disabled=${i.length <= 2}
                @click=${() => t(eg(e, o))}>
                <uui-icon name="icon-trash"></uui-icon>
              </uui-button>
            </div>
          </div>
        `)}
        <div class="stop-actions">
          <uui-button look="secondary" label="Add stop" @click=${() => t(Qf(e))}>
            <uui-icon name="icon-add"></uui-icon> Add stop
          </uui-button>
          <uui-button look="secondary" label="Reverse the gradient" @click=${() => t(Zf(e))}>
            <uui-icon name="icon-sync"></uui-icon> Reverse
          </uui-button>
        </div>
      </div>
    `);
};
nn = function(e, t, i) {
  return r`<di-number-field
      .min=${v.gradientCentre.min * 100}
      .max=${v.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
xd = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, kd).call(this, e) : h}
      ${e.type === "text" ? d(this, u, Dd).call(this, e) : h}
      ${e.type === "image" ? d(this, u, Sd).call(this, e) : h}
      ${e.type === "badges" ? d(this, u, Ed).call(this, e) : h}
      ${e.type === "rect" ? d(this, u, Od).call(this, e) : h}
      ${d(this, u, Cd).call(this, e)} ${d(this, u, Pd).call(this, e)}
    `;
};
kd = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${q(
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

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? d(this, u, ze).call(this, "Property", d(this, u, Wi).call(this, t.propertyAlias ?? "", (i) => d(this, u, b).call(this, { binding: { ...t, propertyAlias: i } }))) : h}

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
Dd = function(e) {
  const t = e.style, i = (a) => d(this, u, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <umb-property-layout orientation="vertical" label="Font">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, mr).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${d(this, u, Md).call(this, t.fontKey, t.styleName ?? "", (a, o, s) => i({ styleName: a || null, fontSize: o ?? t.fontSize, fontStyle: s ?? t.fontStyle }))}

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
              .options=${q(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${q(["left", "centre", "right"], t.textAlign)}
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
              .options=${q(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${q(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
Sd = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${Ld(t.kind)}
            @change=${(a) => d(this, u, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" ? d(this, u, ze).call(this, "Property", d(this, u, Wi).call(
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

        ${t.kind === "media" ? d(this, u, ze).call(this, "Media item", d(this, u, hr).call(this, t.mediaKey, (a) => d(this, u, b).call(this, { source: { ...t, kind: "media", mediaKey: a } }))) : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.fit}
            .options=${q(["cover", "contain", "stretch"], e.fit)}
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
Ed = function(e) {
  const t = (o) => d(this, u, b).call(this, { badge: { ...e.badge, ...o } }), i = (o) => d(this, u, b).call(this, { label: { ...e.label, ...o } }), a = (o) => d(this, u, b).call(this, { icon: { ...e.icon, ...o } });
  return r`
      <uui-box headline="Badges">
        <umb-property-layout orientation="vertical" label="Items from">

          <div slot="editor" class="editor">
          ${d(this, u, Wi).call(this, e.itemsPropertyAlias, (o) => d(this, u, b).call(this, { itemsPropertyAlias: o }))}
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
            .options=${q(["horizontal", "vertical"], e.direction)}
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
            .options=${q(["below", "right", "none"], e.label.position, {
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
                  .options=${d(this, u, mr).call(this, e.label.fontKey)}
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
                  .options=${q(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(o) => i({ textTransform: o.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>
            `}
      </uui-box>
    `;
};
Id = function(e, t) {
  if (t === "circle") {
    const a = e.size.width ?? e.size.height ?? 200;
    d(this, u, b).call(this, { shape: "ellipse", lockAspect: !0, size: { ...e.size, width: a, height: a } });
    return;
  }
  const i = cn(e) === "circle";
  d(this, u, b).call(this, {
    shape: t,
    ...i ? { lockAspect: !1 } : {}
  });
};
rn = function(e, t, i) {
  const a = e.type === "rect" && e.lockAspect === !0, { width: o, height: s } = e.size;
  if (!a || i === null || !o || !s) {
    d(this, u, b).call(this, { size: { ...e.size, [t]: i } });
    return;
  }
  const n = t === "width" ? { width: i, height: Math.round(i * s / o) } : { width: Math.round(i * o / s), height: i };
  d(this, u, b).call(this, { size: n });
};
Od = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <umb-property-layout orientation="vertical" label="Shape">

          <div slot="editor" class="editor">
          <uui-select
            .value=${cn(e)}
            .options=${q(["rectangle", "circle", "ellipse", "polygon", "star"], cn(e))}
            @change=${(o) => d(this, u, Id).call(this, e, o.target.value)}>
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
    gradient: o.target.checked ? Ec() : null
  })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${e.gradient ? d(this, u, pr).call(this, e.gradient, (o) => d(this, u, b).call(this, { gradient: o })) : h}

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
Cd = function(e) {
  const t = Le(e.position, "x"), i = Le(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${d(this, u, ln).call(this, e, "x")} ${d(this, u, ln).call(this, e, "y")}

        <umb-property-layout orientation="vertical" label="Anchor">

          <div slot="editor" class="editor">
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(o) => d(this, u, Fd).call(this, e, o.detail.value)}>
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
            @change=${(o) => d(this, u, b).call(this, { rotation: Oc(o.detail.value ?? 0) })}>
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
            @change=${(o) => d(this, u, rn).call(this, e, "width", o.detail.value)}>
          </di-number-field>
          <di-number-field
            .min=${v.height.min}
            .max=${v.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(o) => d(this, u, rn).call(this, e, "height", o.detail.value)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
ln = function(e, t) {
  const i = Le(e.position, t), a = bo(e.position, t), o = this.template.layers.filter((n) => n.key !== e.key), s = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => d(this, u, Ad).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => d(this, u, co).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${q(s, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => d(this, u, co).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </div>

              </umb-property-layout>

              <di-number-field
                .min=${v.referenceGap.min}
                .max=${v.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => d(this, u, co).call(this, e, t, { gap: n.detail.value ?? 0 })}>
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
Ad = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Le(e.position, t)) return;
  const a = this.template.layers.findIndex((s) => s.key === e.key), o = this.template.layers[a - 1] ?? this.template.layers.find((s) => s.key !== e.key);
  o && d(this, u, b).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: o.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: am
      }
    }
  });
};
co = function(e, t, i) {
  const a = bo(e.position, t);
  a && d(this, u, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Fd = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, o = i > 0 && a > 0 ? em(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, b).call(this, { position: o });
};
Pd = function(e) {
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
            .options=${q(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
              ${d(this, u, Wi).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, b).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </div>

            </umb-property-layout>` : h}
      </uui-box>
    `;
};
hr = function(e, t) {
  return r`
      <umb-input-media
        max="1"
        .selection=${e ? [e] : []}
        @change=${(i) => t(i.target.selection[0] ?? null)}>
      </umb-input-media>
    `;
};
ze = function(e, t, i) {
  return r`
      <umb-property-layout orientation="vertical" label=${e} description=${la(i)}>
        <div slot="editor" class="editor">${t}</div>
      </umb-property-layout>
    `;
};
Wi = function(e, t, i = {}) {
  const a = cm(e), o = [];
  for (let s = 0; s <= Ss; s++) {
    const n = Lr(a, s), l = s === 0 ? this.properties : this.linkedProperties[n] ?? [], p = a[s] ?? "";
    if (s > 0) {
      const E = (s === 1 ? this.properties : this.linkedProperties[Lr(a, s - 1)] ?? []).some(
        (L) => L.alias === a[s - 1] && L.classification === "content"
      );
      if (!a[s - 1] || !E && !p) break;
    }
    const y = d(this, u, Rd).call(this, qg(l, s === 0 ? i.root : i.tail), p, (D) => t([...a.slice(0, s), D].filter(Boolean).join(".")));
    o.push(s === 0 ? y : r`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[n] ?? "Property on the linked item"}</span>
            ${y}
          </div>`);
  }
  return o.length === 1 ? o[0] : r`<div class="path">${o}</div>`;
};
Rd = function(e, t, i) {
  return r`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${mm(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
mr = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
Md = function(e, t, i) {
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
et.styles = R`
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
li([
  f({ type: Object })
], et.prototype, "template", 2);
li([
  f({ type: Object })
], et.prototype, "layer", 2);
li([
  f({ type: Array })
], et.prototype, "properties", 2);
li([
  f({ type: Object })
], et.prototype, "linkedProperties", 2);
li([
  f({ type: Object })
], et.prototype, "linkedCaptions", 2);
li([
  f({ type: Array })
], et.prototype, "fonts", 2);
et = li([
  C("di-layer-inspector")
], et);
function q(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
const Yg = {
  linear: "Linear",
  radial: "Radial",
  angular: "Angular (conic)",
  diamond: "Diamond",
  reflected: "Reflected"
}, Gg = {
  farthestCorner: "Farthest corner",
  farthestSide: "Farthest side",
  closestCorner: "Closest corner",
  closestSide: "Closest side"
}, Hg = [
  ["↑", 0, "Upwards (0°)"],
  ["→", 90, "To the right (90°)"],
  ["↓", 180, "Downwards (180°)"],
  ["←", 270, "To the left (270°)"]
];
function Ld(e) {
  return q(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
function cn(e) {
  const t = e.shape ?? "rectangle";
  return t === "ellipse" && e.lockAspect === !0 ? "circle" : t;
}
var Xg = Object.defineProperty, Jg = Object.getOwnPropertyDescriptor, zd = (e) => {
  throw TypeError(e);
}, Ui = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Jg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Xg(t, i, o), o;
}, Zg = (e, t, i) => t.has(e) || zd("Cannot " + i), Qg = (e, t, i) => t.has(e) ? zd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Te = (e, t, i) => (Zg(e, t, "access private method"), i), he, Ut, Wd, Ud, Nd, Bd, jd;
const ev = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Et = class extends F {
  constructor() {
    super(...arguments), Qg(this, he), this.layers = [], this.expanded = !1;
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Te(this, he, Nd)}>
        <h5>
          <button
            class="toggle"
            type="button"
            aria-expanded=${this.expanded}
            @click=${() => this.expanded = !this.expanded}>
            <uui-icon name=${this.expanded ? "icon-navigation-down" : "icon-navigation-right"}></uui-icon>
            Layers <span class="count">(${e.length})</span>
          </button>
        </h5>

        ${this.expanded ? Te(this, he, Bd).call(this, e) : h}
      </div>
    `;
  }
};
he = /* @__PURE__ */ new WeakSet();
Ut = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Wd = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Ud = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Nd = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Te(this, he, Ut).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Bd = function(e) {
  return r`
        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : se(
    e,
    (t) => t.key,
    (t, i) => Te(this, he, jd).call(this, t, i)
  )}

        <div class="row background">
          <uui-icon name="icon-picture"></uui-icon>
          <span class="name">Background</span>
          <uui-icon name="icon-lock" title="The base image and canvas fill are edited in the inspector"></uui-icon>
        </div>
    `;
};
jd = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Te(this, he, Wd).call(this, a, e.key)}
        @dragover=${(a) => Te(this, he, Ud).call(this, a, t)}
        @click=${() => Te(this, he, Ut).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${ev[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Te(this, he, Ut).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Te(this, he, Ut).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Te(this, he, Ut).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Te(this, he, Ut).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Et.styles = R`
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

    :host(:not([expanded])) h5 {
      margin-bottom: 0;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-1);
      width: 100%;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      text-transform: inherit;
      letter-spacing: inherit;
      cursor: pointer;
      padding: 0;
    }

    .count {
      text-transform: none;
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
Ui([
  f({ type: Array })
], Et.prototype, "layers", 2);
Ui([
  f({ type: String })
], Et.prototype, "selectedLayerKey", 2);
Ui([
  f({ type: Boolean, reflect: !0 })
], Et.prototype, "expanded", 2);
Ui([
  m()
], Et.prototype, "_dragKey", 2);
Ui([
  m()
], Et.prototype, "_dropIndex", 2);
Et = Ui([
  C("di-layers-panel")
], Et);
var tv = Object.defineProperty, iv = Object.getOwnPropertyDescriptor, Kd = (e) => {
  throw TypeError(e);
}, lt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? iv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && tv(t, i, o), o;
}, yr = (e, t, i) => t.has(e) || Kd("Cannot " + i), av = (e, t, i) => (yr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Hl = (e, t, i) => t.has(e) ? Kd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ov = (e, t, i, a) => (yr(e, t, "write to private field"), t.set(e, i), i), re = (e, t, i) => (yr(e, t, "access private method"), i), J, Be, zo, Vd, qd, Zi;
let Oe = class extends F {
  constructor() {
    super(...arguments), Hl(this, J), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Hl(this, zo, 100);
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
              @click=${() => re(this, J, Be).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
              <uui-icon name="icon-zoom-out"></uui-icon>
            </uui-button>
            <di-number-field
              compact
              class="value"
              label="Zoom"
              suffix="%"
              step="5"
              .min=${Ro.min * 100}
              .max=${Ro.max * 100}
              .value=${re(this, J, Vd).call(this)}
              @change=${re(this, J, qd)}>
            </di-number-field>
            <uui-button
              compact
              look="secondary"
              label="Zoom in"
              @click=${() => re(this, J, Be).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
              <uui-icon name="icon-zoom-in"></uui-icon>
            </uui-button>
          </div>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => re(this, J, Be).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${re(this, J, Zi).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${re(this, J, Zi).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${re(this, J, Zi).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${re(this, J, Zi).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => re(this, J, Be).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => re(this, J, Be).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => re(this, J, Be).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
J = /* @__PURE__ */ new WeakSet();
Be = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
zo = /* @__PURE__ */ new WeakMap();
Vd = function() {
  return this.matches(":focus-within") || ov(this, zo, Math.round(this.effectiveScale * 100)), av(this, zo);
};
qd = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && re(this, J, Be).call(this, "di-zoom-change", { zoom: t / 100 });
};
Zi = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => re(this, J, Be).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
Oe.styles = R`
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
  f({ type: Number })
], Oe.prototype, "effectiveScale", 2);
lt([
  f({ type: Boolean })
], Oe.prototype, "snapEnabled", 2);
lt([
  f({ type: Boolean })
], Oe.prototype, "showRulers", 2);
lt([
  f({ type: Boolean })
], Oe.prototype, "showSafeArea", 2);
lt([
  f({ type: Boolean })
], Oe.prototype, "showMeasured", 2);
lt([
  f({ type: Boolean })
], Oe.prototype, "canUndo", 2);
lt([
  f({ type: Boolean })
], Oe.prototype, "canRedo", 2);
lt([
  f({ type: Boolean })
], Oe.prototype, "previewing", 2);
Oe = lt([
  C("di-canvas-toolbar")
], Oe);
var sv = Object.defineProperty, nv = Object.getOwnPropertyDescriptor, Yd = (e) => {
  throw TypeError(e);
}, fr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? nv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && sv(t, i, o), o;
}, gr = (e, t, i) => t.has(e) || Yd("Cannot " + i), fi = (e, t, i) => (gr(e, t, "read from private field"), t.get(e)), Ha = (e, t, i) => t.has(e) ? Yd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), un = (e, t, i, a) => (gr(e, t, "write to private field"), t.set(e, i), i), Xl = (e, t, i) => (gr(e, t, "access private method"), i), zi, uo, na, po, Gd, Hd;
let ga = class extends F {
  constructor() {
    super(), Ha(this, po), Ha(this, zi), this._selection = [], Ha(this, uo, ""), Ha(this, na), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(It, (e) => {
      un(this, zi, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== fi(this, uo) && (un(this, uo, i), Xl(this, po, Gd).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
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
          @change=${Xl(this, po, Hd)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
zi = /* @__PURE__ */ new WeakMap();
uo = /* @__PURE__ */ new WeakMap();
na = /* @__PURE__ */ new WeakMap();
po = /* @__PURE__ */ new WeakSet();
Gd = async function(e) {
  if (!fi(this, zi)) return;
  fi(this, na) ?? un(this, na, bc(fi(this, zi).getToken).catch(() => []));
  const t = await fi(this, na), i = new Set(e), a = t.filter((o) => i.has(o.alias)).map((o) => o.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
Hd = function(e) {
  var i;
  const t = e.target.selection;
  (i = fi(this, zi)) == null || i.setSampleContentKey(t[0]);
};
ga.styles = R`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
fr([
  m()
], ga.prototype, "_selection", 2);
fr([
  m()
], ga.prototype, "_allowedContentTypeIds", 2);
ga = fr([
  C("di-preview-content-picker")
], ga);
var rv = Object.defineProperty, lv = Object.getOwnPropertyDescriptor, Xd = (e) => {
  throw TypeError(e);
}, La = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? lv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && rv(t, i, o), o;
}, vr = (e, t, i) => t.has(e) || Xd("Cannot " + i), Q = (e, t, i) => (vr(e, t, "read from private field"), t.get(e)), Pt = (e, t, i) => t.has(e) ? Xd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Jt = (e, t, i, a) => (vr(e, t, "write to private field"), t.set(e, i), i), Ve = (e, t, i) => (vr(e, t, "access private method"), i), yt, _i, wi, Zt, Wo, Uo, ke, br, ho, _r, dn;
const cv = 400;
let si = class extends F {
  constructor() {
    super(), Pt(this, ke), Pt(this, yt), Pt(this, _i), Pt(this, wi), Pt(this, Zt), Pt(this, Wo), Pt(this, Uo, !0), this._loading = !1, this._collapsed = !0, this.consumeContext(It, (e) => {
      Jt(this, yt, e), e && (this.observe(e.template, (t) => {
        t && Ve(this, ke, ho).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Jt(this, Wo, t);
        const i = (a = Q(this, yt)) == null ? void 0 : a.getData();
        i && Ve(this, ke, ho).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Jt(this, Uo, t ?? !0);
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
    const e = (t = Q(this, yt)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(Q(this, _i)), this._collapsed = !1, Ve(this, ke, _r).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(Q(this, _i)), (e = Q(this, wi)) == null || e.abort(), Ve(this, ke, br).call(this);
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
        const t = (e = Q(this, yt)) == null ? void 0 : e.getData();
        t && Ve(this, ke, ho).call(this, t);
      }
    }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed ? h : r`
              <div class="content">
                <div class="body">
                  ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : h}
                  ${this._error ? r`<span class="error" role="status">${this._error}</span>` : this._url ? r`<img src=${this._url} alt="Server-rendered preview of this template" />` : r`<span class="pending">Rendering…</span>`}
                </div>
                <di-preview-content-picker></di-preview-content-picker>
              </div>
            `}
      </div>
    `;
  }
};
yt = /* @__PURE__ */ new WeakMap();
_i = /* @__PURE__ */ new WeakMap();
wi = /* @__PURE__ */ new WeakMap();
Zt = /* @__PURE__ */ new WeakMap();
Wo = /* @__PURE__ */ new WeakMap();
Uo = /* @__PURE__ */ new WeakMap();
ke = /* @__PURE__ */ new WeakSet();
br = function() {
  Q(this, Zt) && (URL.revokeObjectURL(Q(this, Zt)), Jt(this, Zt, void 0));
};
ho = function(e) {
  this._collapsed || (window.clearTimeout(Q(this, _i)), Jt(this, _i, window.setTimeout(() => void Ve(this, ke, _r).call(this, e), cv)));
};
_r = async function(e) {
  var t;
  if (Q(this, yt)) {
    (t = Q(this, wi)) == null || t.abort(), Jt(this, wi, new AbortController()), Ve(this, ke, dn).call(this, !0), this._error = void 0;
    try {
      const i = await _c(
        e,
        {
          signal: Q(this, wi).signal,
          contentKey: Q(this, Wo),
          useSampleData: Q(this, Uo)
        },
        Q(this, yt).getToken
      );
      Ve(this, ke, br).call(this), Jt(this, Zt, URL.createObjectURL(i)), this._url = Q(this, Zt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ve(this, ke, dn).call(this, !1);
    }
  }
};
dn = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
si.styles = R`
    :host {
      display: block;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .strip {
      padding: var(--uui-size-space-2) var(--uui-size-space-3);
    }

    /* The render on the left half, the Preview content picker on the right. */
    .content {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: var(--uui-size-space-4);
      align-items: start;
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
      min-width: 0;
      min-height: var(--di-preview-strip-body-min-height, 84px);
    }

    img {
      max-width: 100%;
      max-height: var(--di-preview-strip-image-max-height, 120px);
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-2);
      /* Behind the image, so a transparent render reads as transparent rather than as white. */
      ${Jn}
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
La([
  m()
], si.prototype, "_url", 2);
La([
  m()
], si.prototype, "_loading", 2);
La([
  m()
], si.prototype, "_error", 2);
La([
  m()
], si.prototype, "_collapsed", 2);
si = La([
  C("di-preview-strip")
], si);
var uv = Object.defineProperty, dv = Object.getOwnPropertyDescriptor, Jd = (e) => {
  throw TypeError(e);
}, G = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? dv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && uv(t, i, o), o;
}, wr = (e, t, i) => t.has(e) || Jd("Cannot " + i), x = (e, t, i) => (wr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), di = (e, t, i) => t.has(e) ? Jd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), No = (e, t, i, a) => (wr(e, t, "write to private field"), t.set(e, i), i), $e = (e, t, i) => (wr(e, t, "access private method"), i), O, va, ba, $i, K, pn, $r, Zd, Qd, hn, ep, tp, ip, mn, ap, op, sp, mo;
const pv = 400;
let z = class extends F {
  constructor() {
    super(), di(this, K), di(this, O), di(this, va), di(this, ba), di(this, $i), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, di(this, mo, (e) => {
      var o;
      if (Ou(e)) return;
      const t = x(this, O);
      if (!t) return;
      const i = e.ctrlKey || e.metaKey;
      if (i && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? t.redo() : t.undo();
        return;
      }
      const a = x(this, K, pn);
      if (a) {
        if (i && e.key.toLowerCase() === "d") {
          e.preventDefault(), t.duplicateLayer(a.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), $e(this, K, hn).call(this, a.key);
            break;
          case "Escape":
            t.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const s = e.shiftKey ? 10 : 1, n = e.key === "ArrowLeft" ? -s : e.key === "ArrowRight" ? s : 0, l = e.key === "ArrowUp" ? -s : e.key === "ArrowDown" ? s : 0, p = Le(a.position, "x") ? 0 : n, y = Le(a.position, "y") ? 0 : l;
            if (p === 0 && y === 0) break;
            t.updateLayer(a.key, {
              position: { ...a.position, x: a.position.x + p, y: a.position.y + y }
            });
            break;
          }
          case "[":
          case "]": {
            const s = ((o = this._template) == null ? void 0 : o.layers.findIndex((n) => n.key === a.key)) ?? -1;
            if (s < 0) return;
            e.preventDefault(), t.moveLayer(a.key, e.key === "]" ? s + 1 : s - 1);
            break;
          }
        }
      }
    }), this.consumeContext(j, (e) => {
      No(this, va, e);
    }), this.consumeContext(It, (e) => {
      No(this, O, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && ($e(this, K, ep).call(this, t), $e(this, K, tp).call(this, t), $e(this, K, ip).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", x(this, mo));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", x(this, mo)), window.clearTimeout(x(this, ba)), (e = x(this, $i)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = x(this, O)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = x(this, O)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = x(this, O)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => $e(this, K, hn).call(this, e.detail.key)}
        @di-layer-detach=${(e) => $e(this, K, Qd).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = x(this, O)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = x(this, O)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = x(this, O)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = x(this, O)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = x(this, O)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = x(this, O)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => $e(this, K, mn).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => $e(this, K, mn).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-use-image-size=${$e(this, K, sp)}
        @di-request-preview=${() => {
      var e;
      return (e = x(this, K, Zd)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(Ro.min, Math.min(Ro.max, e.detail.zoom));
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
      return (e = x(this, O)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = x(this, O)) == null ? void 0 : e.redo();
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
            .layer=${x(this, K, pn)}
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
O = /* @__PURE__ */ new WeakMap();
va = /* @__PURE__ */ new WeakMap();
ba = /* @__PURE__ */ new WeakMap();
$i = /* @__PURE__ */ new WeakMap();
K = /* @__PURE__ */ new WeakSet();
pn = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
$r = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Zd = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Qd = function(e, t) {
  var o, s, n;
  const i = (o = this._template) == null ? void 0 : o.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (s = x(this, K, $r)) == null ? void 0 : s.resolvedPositionOf(e);
  (n = x(this, O)) == null || n.updateLayer(e, { position: Ds(i.position, t, a) });
};
hn = function(e) {
  var i, a, o;
  const t = /* @__PURE__ */ new Map();
  for (const s of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = x(this, K, $r)) == null ? void 0 : a.resolvedPositionOf(s.key);
    n && t.set(s.key, n);
  }
  (o = x(this, O)) == null || o.removeLayer(e, t);
};
ep = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && x(this, O) && await Hy(t, x(this, O).getToken);
};
tp = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !x(this, O)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await $c(t.mediaKey, x(this, O).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
ip = function() {
  window.clearTimeout(x(this, ba)), No(this, ba, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !x(this, O))) {
      (t = x(this, $i)) == null || t.abort(), No(this, $i, new AbortController());
      try {
        const i = await wc(
          e,
          { signal: x(this, $i).signal, useSampleData: !0 },
          x(this, O).getToken
        );
        x(this, O).setServerBounds(i.layers), x(this, O).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, pv));
};
mn = function(e, t, i, a) {
  const o = this._template;
  if (!o || !x(this, O)) return;
  const s = { template: o, x: t, y: i, defaultFontKey: $e(this, K, op).call(this) };
  if (e.kind === "property") {
    const l = Jh(e.property, s);
    if (l.kind === "condition") {
      $e(this, K, ap).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    x(this, O).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? Dc(s, "Image") : e.layerType === "badges" ? Sc(s, "Badges", "") : e.layerType === "rect" ? Hh(s, "Shape", e.preset) : kc(s, "Text", { kind: "static", text: "Text" });
  x(this, O).addLayer(n);
};
ap = function(e, t, i) {
  var s, n, l, p;
  const a = i ?? this._selectedKey, o = (s = this._template) == null ? void 0 : s.layers.find((y) => y.key === a);
  if (!o) {
    (n = x(this, va)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = x(this, O)) == null || l.updateLayer(o.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (p = x(this, va)) == null || p.peek("positive", {
    data: { message: `'${o.name}' now shows only when '${t}' is ticked.` }
  });
};
op = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
sp = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !x(this, O)) return;
  const t = await $c(e.mediaKey, x(this, O).getToken).catch(() => {
  });
  t && x(this, O).updateCanvas({ width: t.width, height: t.height });
};
mo = /* @__PURE__ */ new WeakMap();
z.styles = R`
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
G([
  m()
], z.prototype, "_template", 2);
G([
  m()
], z.prototype, "_selectedKey", 2);
G([
  m()
], z.prototype, "_properties", 2);
G([
  m()
], z.prototype, "_linkedProperties", 2);
G([
  m()
], z.prototype, "_linkedCaptions", 2);
G([
  m()
], z.prototype, "_fonts", 2);
G([
  m()
], z.prototype, "_serverBounds", 2);
G([
  m()
], z.prototype, "_baseImageUrl", 2);
G([
  m()
], z.prototype, "_zoom", 2);
G([
  m()
], z.prototype, "_effectiveScale", 2);
G([
  m()
], z.prototype, "_previewing", 2);
G([
  m()
], z.prototype, "_snapEnabled", 2);
G([
  m()
], z.prototype, "_showRulers", 2);
G([
  m()
], z.prototype, "_showSafeArea", 2);
G([
  m()
], z.prototype, "_showMeasured", 2);
G([
  m()
], z.prototype, "_canUndo", 2);
G([
  m()
], z.prototype, "_canRedo", 2);
z = G([
  C("di-design-view")
], z);
const hv = z, mv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return z;
  },
  default: hv
}, Symbol.toStringTag, { value: "Module" }));
var yv = Object.defineProperty, fv = Object.getOwnPropertyDescriptor, np = (e) => {
  throw TypeError(e);
}, ct = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? fv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && yv(t, i, o), o;
}, Tr = (e, t, i) => t.has(e) || np("Cannot " + i), ie = (e, t, i) => (Tr(e, t, "read from private field"), t.get(e)), Ki = (e, t, i) => t.has(e) ? np("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _a = (e, t, i, a) => (Tr(e, t, "write to private field"), t.set(e, i), i), ht = (e, t, i) => (Tr(e, t, "access private method"), i), Me, wa, Ti, Qt, Fe, xr, yo, rp, lp, cp;
let fe = class extends F {
  constructor() {
    super(), Ki(this, Fe), Ki(this, Me), Ki(this, wa), Ki(this, Ti), Ki(this, Qt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(j, (e) => {
      _a(this, wa, e);
    }), this.consumeContext(It, (e) => {
      _a(this, Me, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, ht(this, Fe, yo).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), ht(this, Fe, yo).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ie(this, Ti)) == null || e.abort(), ht(this, Fe, xr).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => ht(this, Fe, yo).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${ht(this, Fe, lp)}>
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
                ${se(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => ht(this, Fe, cp).call(this, e)
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
                @click=${ht(this, Fe, rp)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : h}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
Me = /* @__PURE__ */ new WeakMap();
wa = /* @__PURE__ */ new WeakMap();
Ti = /* @__PURE__ */ new WeakMap();
Qt = /* @__PURE__ */ new WeakMap();
Fe = /* @__PURE__ */ new WeakSet();
xr = function() {
  ie(this, Qt) && (URL.revokeObjectURL(ie(this, Qt)), _a(this, Qt, void 0));
};
yo = async function() {
  var i;
  const e = this._template;
  if (!e || !ie(this, Me)) return;
  (i = ie(this, Ti)) == null || i.abort(), _a(this, Ti, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: ie(this, Ti).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, o] = await Promise.all([
      _c(e, t, ie(this, Me).getToken),
      wc(e, t, ie(this, Me).getToken)
    ]);
    ht(this, Fe, xr).call(this), _a(this, Qt, URL.createObjectURL(a)), this._url = ie(this, Qt), this._bounds = o.layers, this._skipped = o.skipped ?? [], ie(this, Me).setServerBounds(o.layers), ie(this, Me).setIssues(o.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
rp = async function() {
  var e, t;
  if (!(!this._contentKey || !ie(this, Me))) {
    this._regenerating = !0;
    try {
      const i = await $n(this._contentKey, ie(this, Me).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = ie(this, wa)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = ie(this, wa)) == null || t.peek("danger", {
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
lp = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
cp = function(e) {
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
fe.styles = R`
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
      ${Jn}
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
  m()
], fe.prototype, "_template", 2);
ct([
  m()
], fe.prototype, "_contentKey", 2);
ct([
  m()
], fe.prototype, "_bounds", 2);
ct([
  m()
], fe.prototype, "_skipped", 2);
ct([
  m()
], fe.prototype, "_url", 2);
ct([
  m()
], fe.prototype, "_loading", 2);
ct([
  m()
], fe.prototype, "_error", 2);
ct([
  m()
], fe.prototype, "_regenerating", 2);
fe = ct([
  C("di-preview-view")
], fe);
const gv = fe, vv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return fe;
  },
  default: gv
}, Symbol.toStringTag, { value: "Module" }));
var bv = Object.defineProperty, _v = Object.getOwnPropertyDescriptor, up = (e) => {
  throw TypeError(e);
}, za = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? _v(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && bv(t, i, o), o;
}, kr = (e, t, i) => t.has(e) || up("Cannot " + i), ee = (e, t, i) => (kr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Jl = (e, t, i) => t.has(e) ? up("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), wv = (e, t, i, a) => (kr(e, t, "write to private field"), t.set(e, i), i), gi = (e, t, i) => (kr(e, t, "access private method"), i), ce, me, dp, pp, Bo, hp, mp, yp, fp, gp, vp;
let tt = class extends F {
  constructor() {
    super(), Jl(this, me), Jl(this, ce), this._properties = [], this._showAdvanced = !1, this.consumeContext(It, (e) => {
      wv(this, ce, e), e && (bc(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${gi(this, me, yp).call(this)} ${gi(this, me, fp).call(this)} ${gi(this, me, gp).call(this)} ${gi(this, me, vp).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
ce = /* @__PURE__ */ new WeakMap();
me = /* @__PURE__ */ new WeakSet();
dp = function() {
  return this._properties.filter((e) => e.classification === "media");
};
pp = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
Bo = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
hp = async function(e) {
  var o, s;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((n) => [n.key, n.alias])), a = [
    ...t.map((n) => i.get(n)).filter((n) => !!n),
    ...ee(this, me, Bo)
  ].filter((n, l, p) => p.indexOf(n) === l);
  (o = ee(this, ce)) == null || o.updateTemplateFields({ docTypeAliases: a }), await ((s = ee(this, ce)) == null ? void 0 : s.reloadProperties());
};
mp = function(e) {
  var i;
  const t = e.target.selection;
  (i = ee(this, ce)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
yp = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? r`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${ee(this, me, pp)}
                  @change=${gi(this, me, hp)}></umb-input-document-type>` : r`<uui-loader-bar></uui-loader-bar>`}
            ${ee(this, me, Bo).length > 0 ? r`<p class="note">
                  Also targets ${ee(this, me, Bo).join(", ")}, which no document type has any more.
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
    ...ee(this, me, dp).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = ee(this, ce)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = ee(this, ce)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
fp = function() {
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
            @change=${gi(this, me, mp)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = ee(this, ce)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = ee(this, ce)) == null ? void 0 : i.updateOutput({
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
    return (i = ee(this, ce)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
gp = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = ee(this, ce)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = ee(this, ce)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
vp = function() {
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
    return (i = ee(this, ce)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
tt.styles = R`
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
za([
  m()
], tt.prototype, "_template", 2);
za([
  m()
], tt.prototype, "_properties", 2);
za([
  m()
], tt.prototype, "_showAdvanced", 2);
za([
  m()
], tt.prototype, "_documentTypes", 2);
tt = za([
  C("di-settings-view")
], tt);
const $v = tt, Tv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return tt;
  },
  default: $v
}, Symbol.toStringTag, { value: "Module" }));
var xv = Object.defineProperty, kv = Object.getOwnPropertyDescriptor, bp = (e) => {
  throw TypeError(e);
}, Wa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? kv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && xv(t, i, o), o;
}, Dr = (e, t, i) => t.has(e) || bp("Cannot " + i), Zl = (e, t, i) => (Dr(e, t, "read from private field"), t.get(e)), Ql = (e, t, i) => t.has(e) ? bp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Dv = (e, t, i, a) => (Dr(e, t, "write to private field"), t.set(e, i), i), ec = (e, t, i) => (Dr(e, t, "access private method"), i), $a, fo, yn;
let it = class extends F {
  constructor() {
    super(), Ql(this, fo), Ql(this, $a), this._loading = !0, this._onlyMissing = !1, this.consumeContext(It, (e) => {
      Dv(this, $a, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && ec(this, fo, yn).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => ec(this, fo, yn).call(this)}>Reload</uui-button>
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
              ${se(
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
$a = /* @__PURE__ */ new WeakMap();
fo = /* @__PURE__ */ new WeakSet();
yn = async function() {
  const e = this._template;
  if (!(!e || !Zl(this, $a))) {
    this._loading = !0;
    try {
      this._usage = await Bh(e.key, Zl(this, $a).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
it.styles = R`
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
Wa([
  m()
], it.prototype, "_template", 2);
Wa([
  m()
], it.prototype, "_usage", 2);
Wa([
  m()
], it.prototype, "_loading", 2);
Wa([
  m()
], it.prototype, "_onlyMissing", 2);
it = Wa([
  C("di-usage-view")
], it);
const Sv = it, Ev = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return it;
  },
  default: Sv
}, Symbol.toStringTag, { value: "Module" })), Iv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ra,
  default: ra
}, Symbol.toStringTag, { value: "Module" }));
var wt, Ht;
class bs extends zp {
  constructor(i, a) {
    super(i, a);
    k(this, wt);
    k(this, Ht);
    this.consumeContext(j, (o) => {
      _(this, wt, o);
    }), this.consumeContext(It, (o) => {
      _(this, Ht, o);
    });
  }
  async execute() {
    var o, s, n;
    const i = c(this, Ht), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (o = c(this, wt)) == null || o.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await lc(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await Tc(a.key, !1, i.getToken);
        (s = c(this, wt)) == null || s.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await Zc(l, i.getToken, c(this, wt));
      } catch (l) {
        (n = c(this, wt)) == null || n.peek("danger", {
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
    c(this, Ht) && await Nh(i, c(this, Ht).getToken);
  }
}
wt = new WeakMap(), Ht = new WeakMap();
const Ov = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: bs,
  api: bs,
  default: bs
}, Symbol.toStringTag, { value: "Module" }));
var Da, Pi;
class _s extends ri {
  constructor(i, a) {
    super(i, a);
    k(this, Da);
    k(this, Pi);
    this.consumeContext(Ce, (o) => {
      _(this, Da, o);
    }), this.consumeContext(j, (o) => {
      _(this, Pi, o);
    });
  }
  async execute() {
    var a, o;
    const i = this.args.unique;
    if (i)
      try {
        const s = await $n(i, () => {
          var l;
          return (l = c(this, Da)) == null ? void 0 : l.getLatestToken();
        }), n = s.outcome === "generated" || s.outcome === "generateddraft";
        (a = c(this, Pi)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? s.message ?? "The image has been regenerated." : s.message ?? s.outcome
          }
        });
      } catch (s) {
        const n = s instanceof ei && s.status === 404;
        (o = c(this, Pi)) == null || o.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: s instanceof ei ? s.detail ?? s.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Da = new WeakMap(), Pi = new WeakMap();
const Cv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: _s,
  api: _s,
  default: _s
}, Symbol.toStringTag, { value: "Module" }));
var Sa, Xt, Ea, Ri;
class ws extends Vp {
  constructor(i, a) {
    super(i, a);
    k(this, Sa);
    k(this, Xt);
    k(this, Ea);
    k(this, Ri);
    this.consumeContext(Ce, (o) => {
      _(this, Sa, o);
    }), this.consumeContext(j, (o) => {
      _(this, Xt, o);
    }), this.consumeContext(qp, (o) => {
      _(this, Ea, o);
    }), this.consumeContext(Yp, (o) => {
      _(this, Ri, (o == null ? void 0 : o.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, o, s;
    if (!c(this, Ri)) {
      (i = c(this, Xt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await $n(c(this, Ri), () => {
        var l;
        return (l = c(this, Sa)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Ea)) == null || a.setValue(JSON.parse(n.propertyValue))), (o = c(this, Xt)) == null || o.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof ei && n.status === 404;
      (s = c(this, Xt)) == null || s.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof ei ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Sa = new WeakMap(), Xt = new WeakMap(), Ea = new WeakMap(), Ri = new WeakMap();
const Av = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: ws,
  api: ws,
  default: ws
}, Symbol.toStringTag, { value: "Module" }));
var Fv = Object.defineProperty, Pv = Object.getOwnPropertyDescriptor, _p = (e) => {
  throw TypeError(e);
}, ut = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Pv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Fv(t, i, o), o;
}, Sr = (e, t, i) => t.has(e) || _p("Cannot " + i), Ge = (e, t, i) => (Sr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $s = (e, t, i) => t.has(e) ? _p("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Rv = (e, t, i, a) => (Sr(e, t, "write to private field"), t.set(e, i), i), le = (e, t, i) => (Sr(e, t, "access private method"), i), go, Ua, W, is, vo, wp, $p, Tp, Er, xp, kp, Dp, Sp, Ep, Ip, Op, Cp;
const Mv = [100, 200, 300, 400, 500, 600, 700, 800, 900], Lv = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let ge = class extends uc {
  constructor() {
    super(), $s(this, W), $s(this, go), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", $s(this, Ua, () => {
      var e;
      return (e = Ge(this, go)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ce, (e) => {
      Rv(this, go, e);
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
      <umb-body-layout headline=${le(this, W, Dp).call(this)}>
        ${le(this, W, vo).call(this, "upload") ? le(this, W, Sp).call(this, e) : h}
        ${le(this, W, vo).call(this, "path") ? le(this, W, Ep).call(this, e) : h}
        ${le(this, W, vo).call(this, "web") ? le(this, W, Ip).call(this, e) : h}

        ${this._error ? r`<p class="error" role="alert">${this._error}</p>` : h}
        ${this._busy ? r`<uui-loader-bar></uui-loader-bar>` : h}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
go = /* @__PURE__ */ new WeakMap();
Ua = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakSet();
is = function() {
  var e, t;
  return { familyKey: ((e = this.data) == null ? void 0 : e.familyKey) ?? null, parentKey: ((t = this.data) == null ? void 0 : t.parentKey) ?? null };
};
vo = function(e) {
  var t;
  return !((t = this.data) != null && t.mode) || this.data.mode === e;
};
wp = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  le(this, W, $p).call(this, t);
};
$p = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await bh(t, Ge(this, Ua), Ge(this, W, is));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Tp = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await _h(this._path.trim(), Ge(this, Ua), Ge(this, W, is)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Er = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
xp = async function() {
  if (Ge(this, W, Er)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await wh(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        Ge(this, Ua),
        Ge(this, W, is)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
kp = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Dp = function() {
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
Sp = function(e) {
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
            @change=${le(this, W, wp)}>
          </uui-file-dropzone>
          <p class="hint">
            .ttf, .otf, .woff2 or .woff. The family name and weight are read from the file. Uploads are stored in the
            media library, so they work on Umbraco Cloud and transfer with Deploy.
          </p>
        </uui-box>
    `;
};
Ep = function(e) {
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
            @click=${le(this, W, Tp)}>
            Register
          </uui-button>
        </uui-box>
    `;
};
Ip = function(e) {
  return r`
        <uui-box headline=${e ? "Or use a web font" : "Web font"}>
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Lv.map((t) => ({
    name: t.name,
    value: t.value,
    selected: t.value === this._provider
  }))}
            ?disabled=${this._busy}
            @change=${(t) => {
    this._provider = t.target.value;
  }}>
          </uui-select>

          ${this._provider === "direct" ? le(this, W, Cp).call(this) : le(this, W, Op).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !Ge(this, W, Er)}
            @click=${le(this, W, xp)}>
            Add web font
          </uui-button>
        </uui-box>
    `;
};
Op = function() {
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
        ${se(
    Mv,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => le(this, W, kp).call(this, e, t.target.checked)}>
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
Cp = function() {
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
ge.styles = R`
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
  m()
], ge.prototype, "_busy", 2);
ut([
  m()
], ge.prototype, "_error", 2);
ut([
  m()
], ge.prototype, "_path", 2);
ut([
  m()
], ge.prototype, "_provider", 2);
ut([
  m()
], ge.prototype, "_family", 2);
ut([
  m()
], ge.prototype, "_weights", 2);
ut([
  m()
], ge.prototype, "_italic", 2);
ut([
  m()
], ge.prototype, "_url", 2);
ge = ut([
  C("di-font-upload-modal")
], ge);
const zv = ge, Wv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return ge;
  },
  default: zv
}, Symbol.toStringTag, { value: "Module" }));
var Uv = Object.getOwnPropertyDescriptor, Nv = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Uv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let jo = class extends F {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
jo = Nv([
  C("di-template-folder-editor")
], jo);
const Bv = jo, Ap = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return jo;
  },
  default: Bv
}, Symbol.toStringTag, { value: "Module" }));
var jv = Object.getOwnPropertyDescriptor, Kv = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? jv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let Ta = class extends F {
  render() {
    return r`<umb-workspace-editor>
      <umb-icon id="icon" slot="header" name="icon-font"></umb-icon>
      <umb-workspace-header-name-editable slot="header"></umb-workspace-header-name-editable>
    </umb-workspace-editor>`;
  }
};
Ta.styles = [
  Gp,
  R`
      #icon {
        display: inline-block;
        font-size: var(--uui-size-6);
        margin-right: var(--uui-size-space-4);
      }
    `
];
Ta = Kv([
  C("di-font-family-editor")
], Ta);
const Vv = Ta, qv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontFamilyEditorElement() {
    return Ta;
  },
  default: Vv
}, Symbol.toStringTag, { value: "Module" }));
var Yv = Object.defineProperty, Gv = Object.getOwnPropertyDescriptor, Fp = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Gv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Yv(t, i, o), o;
};
let xa = class extends F {
  constructor() {
    super(), this._headline = "", this.consumeContext(Vn, (e) => {
      this.observe(e == null ? void 0 : e.current, (t) => {
        this._headline = t ? `${t.font.familyName} · ${t.name}` : "";
      });
    });
  }
  render() {
    return r`<umb-workspace-editor headline=${this._headline}></umb-workspace-editor>`;
  }
};
Fp([
  m()
], xa.prototype, "_headline", 2);
xa = Fp([
  C("di-font-editor")
], xa);
const Hv = xa, Xv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontEditorElement() {
    return xa;
  },
  default: Hv
}, Symbol.toStringTag, { value: "Module" }));
export {
  ty as manifests,
  Db as onInit
};
//# sourceMappingURL=dynamic-images.js.map
