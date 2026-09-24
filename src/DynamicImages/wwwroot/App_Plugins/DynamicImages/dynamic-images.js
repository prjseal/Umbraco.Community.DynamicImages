var Cr = (e) => {
  throw TypeError(e);
};
var ss = (e, t, i) => t.has(e) || Cr("Cannot " + i);
var c = (e, t, i) => (ss(e, t, "read from private field"), i ? i.call(e) : t.get(e)), k = (e, t, i) => t.has(e) ? Cr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (ss(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), I = (e, t, i) => (ss(e, t, "access private method"), i);
var ns = (e, t, i, a) => ({
  set _(o) {
    _(e, t, o, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as Lp, UmbEntityWorkspaceDataManager as zp, UmbSubmitWorkspaceAction as ra, UmbEntityNamedDetailWorkspaceContextBase as bn, UMB_WORKSPACE_CONTEXT as Wp, UmbEntityDetailWorkspaceContextBase as Up, UmbWorkspaceActionBase as Np } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as at, UmbContextConsumerController as Bp } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as Oa, UmbItemRepositoryBase as oc, UmbItemServerDataSourceBase as sc, UmbRepositoryBase as We } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as Ca, UmbItemStoreBase as nc } from "@umbraco-cms/backoffice/store";
import { UmbId as rc } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as jp, UMB_DATE_TIME_VALUE_TYPE as Kp } from "@umbraco-cms/backoffice/value-type";
import { nothing as h, html as r, css as R, state as m, customElement as A, ifDefined as la, property as f, repeat as se, classMap as _n, styleMap as j } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as P } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as lc, UmbTreeRepositoryBase as cc } from "@umbraco-cms/backoffice/tree";
import { UMB_ACTION_EVENT_CONTEXT as ot } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent as si, UmbRequestReloadStructureForEntityEvent as wn, UmbEntityActionBase as ni } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT as V } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as uc } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UMB_AUTH_CONTEXT as Ce } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as $n, UMB_DISCARD_CHANGES_MODAL as Vp, umbConfirmModal as dc, UmbModalToken as pc, UmbModalBaseElement as hc } from "@umbraco-cms/backoffice/modal";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as Tn } from "@umbraco-cms/backoffice/entity";
import { UmbDefaultCollectionContext as mc } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as yc, UmbDeselectedEvent as fc } from "@umbraco-cms/backoffice/event";
import { UmbConditionBase as qp } from "@umbraco-cms/backoffice/extension-registry";
import "@umbraco-cms/backoffice/document-type";
import "@umbraco-cms/backoffice/media";
import { UmbArrayState as Bi, UmbStringState as Ar, UmbObjectState as Fr, UmbBooleanState as Ba, UmbNumberState as Yp } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as Gp } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Hp } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Xp } from "@umbraco-cms/backoffice/document";
import { UmbTextStyles as Jp } from "@umbraco-cms/backoffice/style";
import { tryExecute as Zp } from "@umbraco-cms/backoffice/resources";
const Vo = "dynamic-images", qo = "di-template", ks = "di:templates-changed", Qp = "/umbraco/management/api/v1/dynamic-images";
class Qt extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function g(e, t, i) {
  const a = await t(), o = new Headers(i == null ? void 0 : i.headers);
  a && o.set("Authorization", `Bearer ${a}`);
  let s = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (o.set("Content-Type", "application/json"), s = JSON.stringify(i.json));
  const n = await fetch(`${Qp}${e}`, { ...i, headers: o, body: s });
  if (!n.ok) throw await eh(n);
  return n;
}
async function eh(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new Qt(t, e.status, i);
}
const $ = async (e) => e.json();
async function th(e) {
  const t = await g("/templates?take=500", e);
  return (await $(t)).items;
}
const xn = async (e, t) => $(await g(`/templates/${e}`, t)), ih = async (e, t) => $(await g("/templates", t, { method: "POST", json: e })), ah = async (e, t) => $(await g(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function oh(e, t) {
  await g(`/templates/${e}`, t, { method: "DELETE" });
}
const sh = async (e, t, i) => $(await g(`/templates/${e}/duplicate`, i, { method: "POST", json: { targetKey: t } })), nh = async (e, t, i) => $(await g(`/templates/${e}/enabled`, i, { method: "PUT", json: { isEnabled: t } }));
async function rh(e, t) {
  return (await g(`/templates/${e}/export`, t)).blob();
}
const lh = async (e, t, i, a = null) => $(await g("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function Yo(e, t, i, a) {
  const o = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && o.set("foldersOnly", "true"), a && o.set("parentKey", a), o.toString();
}
const Pr = async (e, t, i, a) => $(await g(`/tree/root?${Yo(e, t, i)}`, a)), ch = async (e, t, i, a, o) => $(await g(`/tree/children?${Yo(t, i, a, e)}`, o)), uh = async (e, t) => $(await g(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function Go(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return $(await g(`/item?${i}`, t));
}
async function dh(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), $(await g(`/collection/templates?${i}`, t));
}
async function ph(e, t, i) {
  return (await g(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const hh = async (e, t) => $(await g("/folders", t, { method: "POST", json: e })), mh = async (e, t) => $(await g(`/folders/${e}`, t)), yh = async (e, t, i) => $(await g(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function gc(e, t) {
  await g(`/folders/${e}`, t, { method: "DELETE" });
}
async function fh(e, t, i) {
  await g(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function gh(e, t, i) {
  await g(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function vh(e, t, i) {
  await g("/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const bh = async (e, t, i) => $(await g("/templates/bulk-duplicate", i, { method: "POST", json: { keys: e, targetKey: t } }));
async function _h(e, t, i) {
  await g("/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
const Ds = async (e) => $(await g("/fonts", e)), wh = async (e, t) => $(await g(`/fonts/${e}`, t));
async function $h(e, t, i = {}) {
  const a = new FormData();
  return a.append("file", e), i.familyKey && a.append("familyKey", i.familyKey), i.parentKey && a.append("parentKey", i.parentKey), $(await g("/fonts", t, { method: "POST", body: a }));
}
const Th = async (e, t, i = {}) => $(await g("/fonts/register-path", t, { method: "POST", json: { path: e, ...i } })), xh = async (e, t, i = {}) => $(await g("/fonts/register-web", t, { method: "POST", json: { ...e, ...i } })), kh = async (e, t) => $(await g(`/fonts/${e}/refresh`, t, { method: "POST" })), Dh = async (e, t, i, a, o) => $(await g(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (o == null ? void 0 : o.weight) ?? null, isItalic: (o == null ? void 0 : o.isItalic) ?? null }
}));
async function vc(e, t) {
  await g(`/fonts/${e}`, t, { method: "DELETE" });
}
async function Sh(e, t) {
  return (await g(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Rr = async (e, t, i, a) => $(await g(`/fonts/tree/root?${Yo(e, t, i)}`, a)), Eh = async (e, t, i, a, o) => $(await g(`/fonts/tree/children?${Yo(t, i, a, e)}`, o)), Ih = async (e, t) => $(await g(`/fonts/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function Ho(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return $(await g(`/fonts/item?${i}`, t));
}
async function Oh(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), $(await g(`/fonts/collection?${i}`, t));
}
const bc = async (e, t, i, a) => $(await g(`/fonts/${e}/references?skip=${t}&take=${i}`, a));
async function Ch(e, t, i, a) {
  const o = new URLSearchParams({ skip: String(t), take: String(i) });
  for (const s of e) o.append("key", s);
  return $(await g(`/fonts/are-referenced?${o}`, a));
}
const Ah = async (e, t) => $(await g("/fonts/folders", t, { method: "POST", json: e })), Fh = async (e, t) => $(await g(`/fonts/folders/${e}`, t)), Ph = async (e, t, i) => $(await g(`/fonts/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function _c(e, t) {
  await g(`/fonts/folders/${e}`, t, { method: "DELETE" });
}
const Rh = async (e, t) => $(await g(`/fonts/families/${e}`, t)), Mh = async (e, t, i) => $(await g(`/fonts/families/${e}`, i, { method: "PUT", json: { name: t } }));
async function wc(e, t) {
  await g(`/fonts/families/${e}`, t, { method: "DELETE" });
}
async function Lh(e, t, i) {
  await g(`/fonts/families/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function zh(e, t, i) {
  await g(`/fonts/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Wh(e, t, i) {
  await g("/fonts/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
async function Uh(e, t, i) {
  await g("/fonts/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const $c = async (e) => $(await g("/document-types", e)), Nh = async (e, t) => $(await g(`/document-types/${encodeURIComponent(e)}/properties`, t)), Bh = async (e, t, i) => $(await g(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function Tc(e, t, i) {
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
const xc = async (e, t, i) => $(await g("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), kc = async (e, t) => $(await g(`/media/${e}/image-info`, t)), kn = async (e, t) => $(await g(`/documents/${e}/regenerate`, t, { method: "POST" })), Dc = async (e, t, i) => $(await g(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), jh = async (e, t) => $(await g(`/jobs/${e}`, t));
async function Kh(e, t) {
  await g(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const Vh = async (e, t) => $(await g(`/templates/${e}/usage`, t)), Sc = async (e) => $(await g("/health", e)), qh = async (e) => $(await g("/sync/status", e)), Yh = async (e) => $(await g("/sync/export", e, { method: "POST" })), Gh = async (e) => $(await g("/sync/import", e, { method: "POST" }));
function Aa(e) {
  const t = `section/${Vo}/workspace/${qo}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Hh(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${Vo}/workspace/${qo}/create${t}`, document.baseURI).pathname;
}
function ei(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${Vo}/workspace/${e}${i}`, document.baseURI).pathname;
}
function Xh(e) {
  return new URL(`section/${Vo}/dashboard/${e}`, document.baseURI).pathname;
}
function Dn() {
  window.dispatchEvent(new CustomEvent(ks));
}
const Xo = () => crypto.randomUUID();
function Jo(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function Ec(e, t, i) {
  const { x: a, y: o } = Jo(e);
  return {
    type: "text",
    key: Xo(),
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
function Ic(e, t, i) {
  const { x: a, y: o } = Jo(e);
  return {
    type: "image",
    key: Xo(),
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
function Oc(e, t, i) {
  const { x: a, y: o } = Jo(e);
  return {
    type: "badges",
    key: Xo(),
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
}, Jh = Object.keys(ca);
function Zh(e, t = "Shape", i = "rectangle") {
  const { x: a, y: o } = Jo(e), s = ca[i] ?? ca.rectangle;
  return {
    type: "rect",
    key: Xo(),
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
function Qh(e) {
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
function em(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (Qh(e.classification)) {
    case "image":
      return { kind: "layer", layer: Ic(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: Oc(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: Ec(t, e.name, tm(e)) };
  }
}
function tm(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Cc() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function im(e) {
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
const Ac = [
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
function Ss(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return Ac[a * 3 + i];
}
function Zo(e, t, i) {
  return {
    x: e.x - t * ua(e.anchor),
    y: e.y - i * da(e.anchor)
  };
}
function Sn(e, t, i, a, o) {
  return {
    x: e + i * ua(o),
    y: t + a * da(o)
  };
}
function am(e, t, i, a) {
  const o = Zo(e, t, i), s = Sn(o.x, o.y, t, i, a);
  return { ...e, x: Math.round(s.x), y: Math.round(s.y), anchor: a };
}
function om(e, t) {
  const i = Sn(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Fc(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function hi(e, t, i, a, o) {
  if (o === 0) return { x: e, y: t };
  const s = o * Math.PI / 180, n = Math.cos(s), l = Math.sin(s), p = e - i, y = t - a;
  return { x: i + p * n - y * l, y: a + p * l + y * n };
}
function sm(e, t, i, a, o) {
  return hi(e, t, i, a, -o);
}
function Pc(e, t, i, a) {
  if (a === 0) return e;
  const o = [
    hi(e.x, e.y, t, i, a),
    hi(e.x + e.width, e.y, t, i, a),
    hi(e.x + e.width, e.y + e.height, t, i, a),
    hi(e.x, e.y + e.height, t, i, a)
  ], s = Math.min(...o.map((y) => y.x)), n = Math.max(...o.map((y) => y.x)), l = Math.min(...o.map((y) => y.y)), p = Math.max(...o.map((y) => y.y));
  return { x: s, y: l, width: n - s, height: p - l };
}
const nm = 10;
function Le(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Rc(e) {
  return !!e.relativeX || !!e.relativeY;
}
function _o(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Mr(e) {
  return e === "below" || e === "above";
}
function Lr(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function rm(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function lm(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), o = Lr(i.position).map((s) => s.layerKey);
  for (; o.length > 0; ) {
    const s = o.pop();
    if (s === e) return !0;
    if (a.has(s)) continue;
    a.add(s);
    const n = t.get(s);
    n && o.push(...Lr(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function cm(e, t, i) {
  const a = e.position;
  if (!Rc(a)) return a;
  if (lm(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let o = a.x, s = a.y, n = ua(a.anchor), l = da(a.anchor);
  const p = zr(e, a.relativeX, !1, t, i);
  p && (o = p.coordinate, n = p.factor);
  const y = zr(e, a.relativeY, !0, t, i);
  return y && (s = y.coordinate, l = y.factor), { x: o, y: s, anchor: Ss(n, l) };
}
function zr(e, t, i, a, o) {
  if (!t || Mr(t.edge) !== i) return;
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
    if (!y || Mr(y.edge) !== i) return;
    n = y.layerKey;
  }
}
function um(e, t, i) {
  const a = rm(e), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set(), n = (l) => {
    const p = o.get(l.key);
    if (p) return p;
    let y;
    s.has(l.key) ? y = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (s.add(l.key), y = cm(l, a, (ue) => {
      const ve = a.get(ue);
      return ve && !i(ve) ? n(ve).extent : void 0;
    }), s.delete(l.key));
    const S = t(l), E = Zo(y, S.width, S.height), L = { x: E.x, y: E.y, width: S.width, height: S.height }, Ae = { position: y, box: L, extent: Pc(L, y.x, y.y, l.rotation ?? 0) };
    return o.set(l.key, Ae), Ae;
  };
  for (const l of e) n(l);
  return o;
}
function Es(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? Ss(ua(i.anchor), da(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? Ss(ua(e.anchor), da(i.anchor)) : e.anchor
  };
}
var de, je, Pe, yt;
class dm {
  constructor(t = 100) {
    k(this, de, []);
    k(this, je, []);
    k(this, Pe, 0);
    k(this, yt);
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
    c(this, Pe) === 0 && _(this, yt, structuredClone(t)), ns(this, Pe)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Pe) !== 0 && (ns(this, Pe)._--, !(c(this, Pe) > 0) && (t && c(this, yt) !== void 0 && (c(this, de).push(c(this, yt)), c(this, de).length > this.limit && c(this, de).shift(), _(this, je, [])), _(this, yt, void 0)));
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
    _(this, de, []), _(this, je, []), _(this, Pe, 0), _(this, yt, void 0);
  }
}
de = new WeakMap(), je = new WeakMap(), Pe = new WeakMap(), yt = new WeakMap();
const Is = 3, pm = (e) => hm(e), Wr = (e, t) => e.slice(0, Math.max(0, t)).join("."), hm = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), mm = "Page";
function ym(e) {
  return e.isSystem ? mm : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const li = (e) => e ?? Number.MAX_SAFE_INTEGER;
function fm(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || li(t.property.tabSortOrder) - li(i.property.tabSortOrder) || li(t.property.groupSortOrder) - li(i.property.groupSortOrder) || li(t.property.sortOrder) - li(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function gm(e, t) {
  const i = fm(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: ym(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function vm(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const bm = "DynamicImages.Workspace.Template", _m = 12, Ur = 36;
var Ti, ft, Ut, Nt, xi, Bt, ki, Di, jt, gt, Si, Ke, Ei, Ii, pe, Da, Kt, Re, Vt, T, Mc, Oi, Ci, Os, Cs, As, Ue, Pt, Fs, Ja, Lc, zc, Wc, Ps;
class wm extends Lp {
  constructor(i) {
    super(i, bm);
    k(this, T);
    k(this, Ti);
    k(this, ft);
    k(this, Ut);
    k(this, Nt);
    k(this, xi);
    k(this, Bt);
    k(this, ki);
    k(this, Di);
    k(this, jt);
    k(this, gt);
    k(this, Si);
    k(this, Ke);
    k(this, Ei);
    k(this, Ii);
    k(this, pe);
    k(this, Da);
    k(this, Kt);
    k(this, Re);
    k(this, Vt);
    k(this, Oi);
    k(this, Ci);
    this._data = new zp(this), this.template = this._data.current, _(this, Ti, new Bi([], (a) => a.key)), this.layers = c(this, Ti).asObservable(), _(this, ft, new Ar(void 0)), this.selectedLayerKey = c(this, ft).asObservable(), _(this, Ut, new Bi([], (a) => a.alias)), this.properties = c(this, Ut).asObservable(), _(this, Nt, new Fr({})), this.linkedProperties = c(this, Nt).asObservable(), _(this, xi, new Fr({})), this.linkedCaptions = c(this, xi).asObservable(), _(this, Bt, new Bi([], (a) => a.key)), this.fonts = c(this, Bt).asObservable(), _(this, ki, new Bi([], (a) => a.key)), this.serverBounds = c(this, ki).asObservable(), _(this, Di, new Bi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, Di).asObservable(), _(this, jt, new Ar(void 0)), this.sampleContentKey = c(this, jt).asObservable(), _(this, gt, new Ba(!0)), this.useSampleData = c(this, gt).asObservable(), _(this, Si, new Yp(1)), this.zoom = c(this, Si).asObservable(), _(this, Ke, new Ba(!0)), this.loading = c(this, Ke).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, Ei, new Ba(!1)), this.canUndo = c(this, Ei).asObservable(), _(this, Ii, new Ba(!1)), this.canRedo = c(this, Ii).asObservable(), _(this, pe, new dm()), _(this, Re, !1), _(this, Vt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, Oi, async (a) => {
      const o = a.detail;
      if (c(this, Vt) || !(o != null && o.url) || !I(this, T, Mc).call(this, o.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await $n(this, Vp), _(this, Vt, !0), window.history.pushState({}, "", o.url instanceof URL ? o.url.href : o.url), !0;
      } catch {
        return !1;
      }
    }), _(this, Ci, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, Da)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => ps),
        setup: (a, o) => {
          const s = o.match.params.parentUnique;
          return this.createScaffold(void 0, s && s !== "null" ? s : null);
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
        setup: (a, o) => this.load(o.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Ce, (a) => {
      _(this, Da, a);
    }), this.consumeContext(V, (a) => {
      _(this, Kt, a);
    }), window.addEventListener("willchangestate", c(this, Oi)), window.addEventListener("beforeunload", c(this, Ci)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
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
      const a = await xn(i, this.getToken);
      I(this, T, Pt).call(this, a, { resetHistory: !0, persist: !0 }), I(this, T, zc).call(this), this.setIsNew(!1), await I(this, T, Os).call(this, a);
    } catch (a) {
      I(this, T, Ps).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Ke).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, Ke).setValue(!0), _(this, Re, !0), I(this, T, Pt).call(this, { ...im(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await I(this, T, Os).call(this, this._data.getCurrent()), c(this, Ke).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await I(this, T, As).call(this, i.docTypeAliases);
    c(this, Ut).setValue(a), c(this, Nt).setValue(await I(this, T, Cs).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, Bt).setValue(await Ds(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    I(this, T, Ue).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    I(this, T, Ue).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    I(this, T, Ue).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    I(this, T, Ue).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    I(this, T, Ue).call(this, (o) => ({ ...o, layers: [...o.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    I(this, T, Ue).call(this, (o) => ({
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
    I(this, T, Ue).call(this, (o) => ({
      ...o,
      layers: o.layers.filter((s) => s.key !== i).map((s) => {
        var l, p;
        let n = s.position;
        return ((l = _o(n, "x")) == null ? void 0 : l.layerKey) === i && (n = Es(n, "x", a == null ? void 0 : a.get(s.key))), ((p = _o(n, "y")) == null ? void 0 : p.layerKey) === i && (n = Es(n, "y", a == null ? void 0 : a.get(s.key))), n === s.position ? s : { ...s, position: n };
      })
    })), c(this, ft).getValue() === i && this.selectLayer(void 0);
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
    I(this, T, Ue).call(this, (o) => {
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
    c(this, ft).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, ft).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((o) => o.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, pe).begin(i);
  }
  endTransaction(i = !0) {
    c(this, pe).end(i), I(this, T, Fs).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, pe).undo(i);
    a && I(this, T, Pt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, pe).redo(i);
    a && I(this, T, Pt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, ki).setValue(i);
  }
  setIssues(i) {
    c(this, Di).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    c(this, jt).setValue(i), c(this, gt).setValue(!i), I(this, T, Lc).call(this, i);
  }
  setUseSampleData(i) {
    c(this, gt).setValue(i);
  }
  setZoom(i) {
    c(this, Si).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, o;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const s = c(this, Re) ? await ih(i, this.getToken) : await ah(i, this.getToken);
      I(this, T, Pt).call(this, s.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Re);
      _(this, Re, !1), this.setIsNew(!1), Dn(), await I(this, T, Wc).call(this, s.template, n), (a = c(this, Kt)) == null || a.peek("positive", {
        data: { message: `'${s.template.name}' saved.` }
      });
      for (const l of s.warnings)
        (o = c(this, Kt)) == null || o.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", Aa(s.template.key));
    } catch (s) {
      throw I(this, T, Ps).call(this, "The template could not be saved", s), s;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Vt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, Oi)), window.removeEventListener("beforeunload", c(this, Ci)), c(this, pe).clear(), super.destroy();
  }
}
Ti = new WeakMap(), ft = new WeakMap(), Ut = new WeakMap(), Nt = new WeakMap(), xi = new WeakMap(), Bt = new WeakMap(), ki = new WeakMap(), Di = new WeakMap(), jt = new WeakMap(), gt = new WeakMap(), Si = new WeakMap(), Ke = new WeakMap(), Ei = new WeakMap(), Ii = new WeakMap(), pe = new WeakMap(), Da = new WeakMap(), Kt = new WeakMap(), Re = new WeakMap(), Vt = new WeakMap(), T = new WeakSet(), /**
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
Mc = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, Oi = new WeakMap(), Ci = new WeakMap(), Os = async function(i) {
  const [a, o] = await Promise.all([
    Ds(this.getToken).catch(() => []),
    I(this, T, As).call(this, i.docTypeAliases)
  ]);
  c(this, Bt).setValue(a), c(this, Ut).setValue(o), c(this, Nt).setValue(await I(this, T, Cs).call(this, i.docTypeAliases, o));
}, Cs = async function(i, a) {
  const o = {}, s = {};
  if (i.length === 0) return o;
  let n = a.filter((p) => p.classification === "content").slice(0, _m).map((p) => p.alias), l = 0;
  for (let p = 1; p <= Is && n.length > 0 && l < Ur; p++) {
    const y = n.slice(0, Ur - l);
    l += y.length;
    const S = await Promise.all(y.map(async (E) => {
      var Ui;
      const L = await Promise.all(
        i.map((ne) => Bh(ne, E, this.getToken).catch(() => null))
      ), Ae = /* @__PURE__ */ new Map();
      for (const ne of L.flatMap((dt) => (dt == null ? void 0 : dt.properties) ?? []))
        Ae.has(ne.alias) || Ae.set(ne.alias, ne);
      const ue = L.filter((ne) => ne !== null), ve = [...new Set(ue.flatMap((ne) => ne.targetDocTypes.map((dt) => dt.name)))], Ot = ue.some((ne) => ne.inference === "all") ? "all" : (Ui = ue[0]) == null ? void 0 : Ui.inference;
      return { prefix: E, properties: [...Ae.values()], caption: vm(ve, Ot) };
    }));
    n = [];
    for (const E of S)
      E.properties.length !== 0 && (o[E.prefix] = E.properties, s[E.prefix] = E.caption, p < Is && n.push(...E.properties.filter((L) => L.classification === "content" && !L.isSystem).map((L) => `${E.prefix}.${L.alias}`)));
  }
  return c(this, xi).setValue(s), o;
}, As = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((s) => Nh(s, this.getToken).catch(() => []))
  ), o = /* @__PURE__ */ new Map();
  for (const s of a.flat())
    o.has(s.alias) || o.set(s.alias, s);
  return [...o.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Ue = function(i, a = !0) {
  const o = this._data.getCurrent();
  if (!o) return;
  a && c(this, pe).push(o);
  const s = i(structuredClone(o));
  I(this, T, Pt).call(this, s);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
Pt = function(i, a) {
  a != null && a.resetHistory && c(this, pe).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Ti).setValue(i.layers), I(this, T, Fs).call(this);
}, Fs = function() {
  c(this, Ei).setValue(c(this, pe).canUndo), c(this, Ii).setValue(c(this, pe).canRedo);
}, Ja = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, Lc = function(i) {
  try {
    i ? localStorage.setItem(I(this, T, Ja).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(I(this, T, Ja).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
zc = function() {
  let i;
  try {
    const a = localStorage.getItem(I(this, T, Ja).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  c(this, jt).setValue(i), c(this, gt).setValue(!i);
}, Wc = async function(i, a) {
  const o = await this.getContext(ot).catch(() => {
  });
  o && (a ? o.dispatchEvent(new si({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : o.dispatchEvent(new wn({ entityType: "di-template", unique: i.key })));
}, Ps = function(i, a) {
  var s;
  const o = a instanceof Qt ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (s = c(this, Kt)) == null || s.peek("danger", { data: { headline: i, message: o } });
};
const Et = new at(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), He = "di-template-root", N = "di-template-folder", q = qo, zt = "DynamicImages.Tree.Templates", mi = "DynamicImages.Repository.TemplateTree", Qi = "DynamicImages.Repository.TemplateFolder", $m = "DynamicImages.Store.TemplateFolder", wo = "DynamicImages.Workspace.TemplateFolder", Uc = "DynamicImages.Workspace.TemplateRoot", rs = "DynamicImages.Repository.TemplateItem", Tm = "DynamicImages.Store.TemplateItem", ls = "DynamicImages.Repository.TemplateDetail", xm = "DynamicImages.Store.TemplateDetail", Nr = "DynamicImages.Repository.MoveTemplate", Br = "DynamicImages.Repository.MoveTemplateFolder", jr = "DynamicImages.Repository.DuplicateTemplate", Kr = "DynamicImages.Repository.BulkMoveTemplates", Vr = "DynamicImages.Repository.BulkDuplicateTemplates", qr = "DynamicImages.Repository.SortTemplateChildren", En = "icon-picture", In = "icon-picture color-grey", Nc = "icon-folder", $o = "DynamicImages.Collection.Templates", Yr = "DynamicImages.Repository.TemplateCollection";
async function w(e, t) {
  const i = (async () => {
    const a = await new Bp(e, Ce).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (o) {
      throw o instanceof Qt ? { type: "error", title: o.message, status: o.status, detail: o.detail } : o;
    }
  })();
  return await Zp(e, i);
}
var vt;
class km {
  constructor(t) {
    k(this, vt);
    _(this, vt, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: N,
      unique: rc.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await w(c(this, vt), (o) => mh(t, o));
    return i ? { data: { entityType: N, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: o } = await w(c(this, vt), (s) => hh({ key: a, name: t.name, parentKey: i }, s));
    return o ? { error: o } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await w(c(this, vt), (o) => yh(i, t.name, o));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return w(c(this, vt), (i) => gc(t, i));
  }
}
vt = new WeakMap();
const On = new at("DiTemplateFolderStore");
class Bc extends Ca {
  constructor(t) {
    super(t, On);
  }
}
class Gr extends Oa {
  constructor(t) {
    super(t, km, On);
  }
}
const Dm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: On,
  DiTemplateFolderRepository: Gr,
  DiTemplateFolderStore: Bc,
  api: Gr
}, Symbol.toStringTag, { value: "Module" })), Sm = [
  {
    type: "repository",
    alias: Qi,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => Dm)
  },
  {
    type: "store",
    alias: $m,
    name: "Dynamic Images Template Folder Store",
    api: Bc
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [N],
    meta: { folderRepositoryAlias: Qi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [N],
    meta: { folderRepositoryAlias: Qi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: wo,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => dy),
    meta: { entityType: N }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: ra,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: wo }]
  }
], Em = [
  {
    type: "repository",
    alias: mi,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => my)
  },
  {
    type: "tree",
    kind: "default",
    alias: zt,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: mi }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [He, N, q]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: zt, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: Uc,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: He, headline: "Templates" }
  },
  ...Sm
], Cn = new at("DiTemplateItemStore");
class jc extends nc {
  constructor(t) {
    super(t, Cn);
  }
}
class Im extends sc {
  constructor(t) {
    super(t, {
      getItems: (i) => w(t, (a) => Go(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? N : q,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class Hr extends oc {
  constructor(t) {
    super(t, Im, Cn);
  }
}
const Om = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: Cn,
  DiTemplateItemRepository: Hr,
  DiTemplateItemStore: jc,
  api: Hr
}, Symbol.toStringTag, { value: "Module" })), An = new at("DiTemplateDetailStore");
class Kc extends Ca {
  constructor(t) {
    super(t, An);
  }
}
const cs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var Ai;
class Cm {
  constructor(t) {
    k(this, Ai);
    this.createScaffold = cs, this.create = cs, this.update = cs, _(this, Ai, t);
  }
  async read(t) {
    const { data: i, error: a } = await w(c(this, Ai), (o) => xn(t, o));
    return i ? { data: { entityType: q, unique: i.key, name: i.name } } : { error: a };
  }
  /**
   * A template, or a folder: the collection's bulk Delete sends every selected key here, and a
   * selection can hold both. A folder that is not empty is refused by the server with a 409, which
   * core's bulk action shows as that item's error.
   */
  delete(t) {
    return w(c(this, Ai), async (i) => {
      const [a] = await Go([t], i);
      return (a == null ? void 0 : a.entityType) === "folder" ? gc(t, i) : oh(t, i);
    });
  }
}
Ai = new WeakMap();
class Xr extends Oa {
  constructor(t) {
    super(t, Cm, An);
  }
}
const Am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: An,
  DiTemplateDetailRepository: Xr,
  DiTemplateDetailStore: Kc,
  api: Xr
}, Symbol.toStringTag, { value: "Module" })), ci = [He, N], us = [{ alias: "Umb.Condition.CollectionAlias", match: $o }], Fm = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: rs,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => Om)
  },
  {
    type: "itemStore",
    alias: Tm,
    name: "Dynamic Images Template Item Store",
    api: jc
  },
  {
    type: "repository",
    alias: ls,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => Am)
  },
  {
    type: "store",
    alias: xm,
    name: "Dynamic Images Template Detail Store",
    api: Kc
  },
  {
    type: "repository",
    alias: Nr,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => gy)
  },
  {
    type: "repository",
    alias: Br,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => vy)
  },
  {
    type: "repository",
    alias: jr,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => by)
  },
  {
    type: "repository",
    alias: qr,
    name: "Dynamic Images Sort Template Children Repository",
    api: () => Promise.resolve().then(() => _y)
  },
  {
    type: "repository",
    alias: Kr,
    name: "Dynamic Images Bulk Move Templates Repository",
    api: () => Promise.resolve().then(() => Ty)
  },
  {
    type: "repository",
    alias: Vr,
    name: "Dynamic Images Bulk Duplicate Templates Repository",
    api: () => Promise.resolve().then(() => xy)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: ci,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => ky),
    forEntityTypes: ci,
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
    forEntityTypes: ci,
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
    forEntityTypes: [q],
    meta: {
      treeRepositoryAlias: mi,
      moveRepositoryAlias: Nr,
      treeAlias: zt,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Template To",
    forEntityTypes: [q],
    meta: {
      duplicateRepositoryAlias: jr,
      treeRepositoryAlias: mi,
      treeAlias: zt,
      foldersOnly: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Enable",
    name: "Enable Dynamic Images Template",
    api: () => Promise.resolve().then(() => Dy),
    forEntityTypes: [q],
    weight: 560,
    meta: { icon: "icon-check", label: "Enable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Disable",
    name: "Disable Dynamic Images Template",
    api: () => Promise.resolve().then(() => Sy),
    forEntityTypes: [q],
    weight: 550,
    meta: { icon: "icon-block", label: "Disable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => Ey),
    forEntityTypes: [q],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => Oy),
    forEntityTypes: [q],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [q],
    meta: {
      itemRepositoryAlias: rs,
      detailRepositoryAlias: ls,
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
      treeRepositoryAlias: mi,
      moveRepositoryAlias: Br,
      treeAlias: zt,
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
    api: () => Promise.resolve().then(() => Fy),
    forEntityTypes: ci,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "sortChildrenOf",
    alias: "DynamicImages.EntityAction.Template.SortChildren",
    name: "Sort Dynamic Images Templates",
    forEntityTypes: ci,
    meta: {
      sortChildrenOfRepositoryAlias: qr,
      treeRepositoryAlias: mi
    }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: ci
  },
  // ---------------------------------------------------------------- collection selection
  // Any of these applying is what turns on the collection's checkboxes.
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Template.MoveTo",
    name: "Move Dynamic Images Templates",
    forEntityTypes: [q, N],
    meta: {
      bulkMoveRepositoryAlias: Kr,
      treeAlias: zt,
      foldersOnly: !0
    },
    conditions: us
  },
  {
    type: "entityBulkAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityBulkAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Templates To",
    forEntityTypes: [q, N],
    meta: {
      bulkDuplicateRepositoryAlias: Vr,
      treeAlias: zt,
      foldersOnly: !0
    },
    conditions: us
  },
  {
    type: "entityBulkAction",
    kind: "delete",
    alias: "DynamicImages.EntityBulkAction.Template.Delete",
    name: "Delete Dynamic Images Templates",
    forEntityTypes: [q, N],
    meta: {
      itemRepositoryAlias: rs,
      detailRepositoryAlias: ls
    },
    conditions: us
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => Wy)
  }
], ja = [{ alias: "Umb.Condition.CollectionAlias", match: $o }], Pm = [
  {
    type: "repository",
    alias: Yr,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => Uy)
  },
  {
    type: "collection",
    kind: "default",
    alias: $o,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => Ny),
    meta: { repositoryAlias: Yr }
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
        { field: "isEnabled", label: "Enabled", valueType: jp },
        { field: "updated", label: "Last updated", valueType: Kp }
      ]
    },
    conditions: ja
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: ja
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => Vy),
    forEntityTypes: [q]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: ja
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: ja
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
      collectionAlias: $o
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [Uc, wo]
      }
    ]
  }
], kt = "di-font-root", oe = "di-font-folder", H = "di-font-family", Xe = "di-font", ea = "DynamicImages.Tree.Fonts", ta = "DynamicImages.Repository.FontTree", ia = "DynamicImages.Repository.FontFolder", Rm = "DynamicImages.Store.FontFolder", To = "DynamicImages.Workspace.FontFolder", Vc = "DynamicImages.Workspace.FontRoot", xo = "DynamicImages.Workspace.FontFamily", Za = "DynamicImages.Workspace.Font", Ka = "DynamicImages.Repository.FontItem", Mm = "DynamicImages.Store.FontItem", Fn = "DynamicImages.Repository.FontDetail", Lm = "DynamicImages.Store.FontDetail", Pn = "DynamicImages.Repository.FontFamilyDetail", zm = "DynamicImages.Store.FontFamilyDetail", Va = "DynamicImages.Repository.FontReference", Jr = "DynamicImages.Repository.MoveFontFamily", Zr = "DynamicImages.Repository.MoveFontFolder", Qr = "DynamicImages.Repository.BulkMoveFonts", el = "DynamicImages.Repository.SortFontChildren", tl = "DynamicImages.Repository.FontBulkDelete", il = "DynamicImages.Condition.IsWebFont", ko = "DynamicImages.Collection.Fonts", ds = "DynamicImages.Repository.FontCollection", Rs = "DynamicImages.Collection.FontVariants", Wm = "icon-folder", Um = "icon-font", Nm = "icon-font color-grey", Bm = "icon-cloud";
function Rn(e) {
  switch (e) {
    case "folder":
      return oe;
    case "family":
      return H;
    default:
      return Xe;
  }
}
function Mn(e, t) {
  switch (e) {
    case "folder":
      return Wm;
    case "family":
      return Um;
    default:
      return t ? Bm : Nm;
  }
}
const jm = [
  {
    type: "repository",
    alias: ta,
    name: "Dynamic Images Font Tree Repository",
    api: () => Promise.resolve().then(() => Gy)
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
    forEntityTypes: [kt, oe, H, Xe]
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
    alias: Vc,
    name: "Dynamic Images Fonts Root Workspace",
    meta: { entityType: kt, headline: "Fonts" }
  }
];
var bt;
class Km {
  constructor(t) {
    k(this, bt);
    _(this, bt, t);
  }
  async createScaffold(t) {
    return { data: { entityType: oe, unique: rc.new(), name: "", ...t } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await w(c(this, bt), (o) => Fh(t, o));
    return i ? { data: { entityType: oe, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: o } = await w(c(this, bt), (s) => Ah({ key: a, name: t.name, parentKey: i }, s));
    return o ? { error: o } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await w(c(this, bt), (o) => Ph(i, t.name, o));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return w(c(this, bt), (i) => _c(t, i));
  }
}
bt = new WeakMap();
const Ln = new at("DiFontFolderStore");
class qc extends Ca {
  constructor(t) {
    super(t, Ln);
  }
}
class al extends Oa {
  constructor(t) {
    super(t, Km, Ln);
  }
}
const Vm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FOLDER_STORE_CONTEXT: Ln,
  DiFontFolderRepository: al,
  DiFontFolderStore: qc,
  api: al
}, Symbol.toStringTag, { value: "Module" })), qm = [
  {
    type: "repository",
    alias: ia,
    name: "Dynamic Images Font Folder Repository",
    api: () => Promise.resolve().then(() => Vm)
  },
  {
    type: "store",
    alias: Rm,
    name: "Dynamic Images Font Folder Store",
    api: qc
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
    alias: To,
    name: "Dynamic Images Font Folder Workspace",
    api: () => Promise.resolve().then(() => Hy),
    meta: { entityType: oe }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.FontFolder.Submit",
    name: "Save Dynamic Images Font Folder",
    api: ra,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: To }]
  }
], ol = [{ alias: "Umb.Condition.CollectionAlias", match: ko }], sl = [{ alias: "Umb.Condition.CollectionAlias", match: Rs }], nl = (e, t) => [
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
], Ym = [
  {
    type: "repository",
    alias: ds,
    name: "Dynamic Images Font Collection Repository",
    api: () => Promise.resolve().then(() => Jy)
  },
  {
    type: "collection",
    kind: "default",
    alias: ko,
    name: "Dynamic Images Font Collection",
    api: () => Promise.resolve().then(() => Fl),
    meta: { repositoryAlias: ds }
  },
  {
    type: "collection",
    kind: "default",
    alias: Rs,
    name: "Dynamic Images Font Variant Collection",
    api: () => Promise.resolve().then(() => Fl),
    meta: { repositoryAlias: ds }
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
    conditions: ol
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
    conditions: sl
  },
  ...nl("Fonts", ol),
  ...nl("FontVariants", sl),
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Font",
    name: "Dynamic Images Font Card",
    element: () => Promise.resolve().then(() => af),
    forEntityTypes: [oe, H, Xe]
  },
  // ---------------------------------------------------------------- where they show
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Fonts.Collection",
    name: "Dynamic Images Fonts Collection Workspace View",
    meta: { label: "Fonts", pathname: "fonts", icon: "icon-grid", collectionAlias: ko },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", oneOf: [Vc, To] }]
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.FontVariants.Collection",
    name: "Dynamic Images Font Variants Collection Workspace View",
    meta: { label: "Variants", pathname: "variants", icon: "icon-font", collectionAlias: Rs },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: xo }]
  }
];
function zn(e) {
  return {
    unique: e.key,
    entityType: Rn(e.entityType),
    name: e.name,
    icon: Mn(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
const Wn = new at("DiFontItemStore");
class Yc extends nc {
  constructor(t) {
    super(t, Wn);
  }
}
class Gm extends sc {
  constructor(t) {
    super(t, {
      getItems: (i) => w(t, (a) => Ho(i, a)),
      mapper: zn
    });
  }
}
class rl extends oc {
  constructor(t) {
    super(t, Gm, Wn);
  }
}
const Hm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_ITEM_STORE_CONTEXT: Wn,
  DiFontItemRepository: rl,
  DiFontItemStore: Yc,
  api: rl,
  mapFontItem: zn
}, Symbol.toStringTag, { value: "Module" })), Ct = [kt, oe], ll = [{ alias: "Umb.Condition.CollectionAlias", match: ko }], At = (e, t, i) => ({ type: "repository", alias: e, name: t, api: i }), Xm = [
  // ---------------------------------------------------------------- repositories
  At(Ka, "Dynamic Images Font Item Repository", () => Promise.resolve().then(() => Hm)),
  { type: "itemStore", alias: Mm, name: "Dynamic Images Font Item Store", api: Yc },
  At(
    Va,
    "Dynamic Images Font Reference Repository",
    () => Promise.resolve().then(() => of)
  ),
  At(
    tl,
    "Dynamic Images Font Bulk Delete Repository",
    () => Promise.resolve().then(() => sf)
  ),
  At(
    Jr,
    "Dynamic Images Move Font Family Repository",
    () => Promise.resolve().then(() => cf)
  ),
  At(
    Zr,
    "Dynamic Images Move Font Folder Repository",
    () => Promise.resolve().then(() => uf)
  ),
  At(
    Qr,
    "Dynamic Images Bulk Move Fonts Repository",
    () => Promise.resolve().then(() => df)
  ),
  At(
    el,
    "Dynamic Images Sort Font Children Repository",
    () => Promise.resolve().then(() => pf)
  ),
  {
    type: "condition",
    alias: il,
    name: "Dynamic Images Is Web Font Condition",
    api: () => Promise.resolve().then(() => hf)
  },
  // How the delete modal draws each template still using a font. Cast because 17.5 declares the
  // entityItemRef manifest type in a file no public entry point imports - the folder create
  // option's problem again. The extension type itself is registered and resolved by entity type.
  {
    type: "entityItemRef",
    alias: "DynamicImages.EntityItemRef.Template",
    name: "Dynamic Images Template Item Ref",
    element: () => Promise.resolve().then(() => ff),
    forEntityTypes: [q]
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Font.Create",
    name: "Create Dynamic Images Font",
    weight: 1200,
    forEntityTypes: [...Ct, H],
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Add to Fonts" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Upload",
    name: "Upload a Dynamic Images Font File",
    weight: 100,
    api: () => Promise.resolve().then(() => wf),
    forEntityTypes: Ct,
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
    api: () => Promise.resolve().then(() => $f),
    forEntityTypes: Ct,
    meta: { icon: "icon-cloud", label: "Web font", description: "From Google Fonts, Bunny Fonts or a file URL" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Path",
    name: "Register a Dynamic Images Font Path",
    weight: 80,
    api: () => Promise.resolve().then(() => Tf),
    forEntityTypes: Ct,
    meta: { icon: "icon-font", label: "Font from path", description: "A font file already in the site's wwwroot" }
  },
  // Cast for the same reason as the template folder option in entity-actions/manifests.ts.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.FontFolder",
    name: "Dynamic Images Font Folder Create Option",
    weight: 70,
    forEntityTypes: Ct,
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
    api: () => Promise.resolve().then(() => xf),
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
      moveRepositoryAlias: Jr,
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
    api: () => Promise.resolve().then(() => kf),
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
      itemRepositoryAlias: Ka,
      detailRepositoryAlias: Pn,
      referenceRepositoryAlias: Va
    }
  },
  // ---------------------------------------------------------------- variant
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Font.Refresh",
    name: "Refresh a Dynamic Images Web Font",
    api: () => Promise.resolve().then(() => Df),
    forEntityTypes: [Xe],
    weight: 500,
    meta: { icon: "icon-sync", label: "Refresh", additionalOptions: !0 },
    conditions: [{ alias: il }]
  },
  {
    type: "entityAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityAction.Font.Delete",
    name: "Delete a Dynamic Images Font",
    forEntityTypes: [Xe],
    meta: {
      itemRepositoryAlias: Ka,
      detailRepositoryAlias: Fn,
      referenceRepositoryAlias: Va
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
      moveRepositoryAlias: Zr,
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
    forEntityTypes: Ct,
    meta: {
      sortChildrenOfRepositoryAlias: el,
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
    meta: { bulkMoveRepositoryAlias: Qr, treeAlias: ea, foldersOnly: !0 },
    conditions: ll
  },
  {
    type: "entityBulkAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityBulkAction.Font.Delete",
    name: "Delete Dynamic Images Fonts",
    forEntityTypes: [oe, H],
    meta: {
      itemRepositoryAlias: Ka,
      detailRepositoryAlias: tl,
      referenceRepositoryAlias: Va
    },
    conditions: ll
  },
  // ---------------------------------------------------------------- reload
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Font.ReloadChildren",
    name: "Reload Dynamic Images Fonts",
    forEntityTypes: [...Ct, H]
  }
], Un = new at("DiFontFamilyDetailStore");
class Gc extends Ca {
  constructor(t) {
    super(t, Un);
  }
}
const cl = () => Promise.resolve({ error: new Error("A font family is created by adding a font.") });
var qt;
class Jm {
  constructor(t) {
    k(this, qt);
    this.createScaffold = cl, this.create = cl, _(this, qt, t);
  }
  async read(t) {
    const { data: i, error: a } = await w(c(this, qt), (o) => Rh(t, o));
    return i ? { data: { entityType: H, unique: i.key, name: i.name } } : { error: a };
  }
  /** A rename: the server carries it onto every variant's family name. */
  async update(t) {
    const { error: i } = await w(c(this, qt), (a) => Mh(t.unique, t.name, a));
    return i ? { error: i } : this.read(t.unique);
  }
  delete(t) {
    return w(c(this, qt), (i) => wc(t, i));
  }
}
qt = new WeakMap();
class ul extends Oa {
  constructor(t) {
    super(t, Jm, Un);
  }
}
const Zm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FAMILY_DETAIL_STORE_CONTEXT: Un,
  DiFontFamilyDetailRepository: ul,
  DiFontFamilyDetailStore: Gc,
  api: ul
}, Symbol.toStringTag, { value: "Module" })), Qm = {
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
function Do(e, t) {
  const i = Qm[e], a = i ? `${i} ${e}` : String(e);
  return t ? `${a} Italic` : a;
}
const Nn = new at("DiFontDetailStore");
class Hc extends Ca {
  constructor(t) {
    super(t, Nn);
  }
}
const dl = () => Promise.resolve({ error: new Error("A font is added from the Fonts tree's Create….") });
function Ms(e) {
  return {
    entityType: Xe,
    unique: e.key,
    name: Do(e.weight, e.isItalic),
    font: e,
    weight: e.weight,
    isItalic: e.isItalic,
    styles: e.styles
  };
}
var Yt;
class ey {
  constructor(t) {
    k(this, Yt);
    this.createScaffold = dl, this.create = dl, _(this, Yt, t);
  }
  async read(t) {
    const { data: i, error: a } = await w(c(this, Yt), (o) => wh(t, o));
    return i ? { data: Ms(i) } : { error: a };
  }
  /** The named styles, weight and slant. The family name is the family's, so it goes back unchanged. */
  async update(t) {
    const { data: i, error: a } = await w(c(this, Yt), (o) => Dh(t.unique, t.font.familyName, t.styles, o, { weight: t.weight, isItalic: t.isItalic }));
    return i ? { data: Ms(i) } : { error: a };
  }
  delete(t) {
    return w(c(this, Yt), (i) => vc(t, i));
  }
}
Yt = new WeakMap();
class pl extends Oa {
  constructor(t) {
    super(t, ey, Nn);
  }
}
const ty = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_DETAIL_STORE_CONTEXT: Nn,
  DiFontDetailRepository: pl,
  DiFontDetailStore: Hc,
  api: pl,
  toDetail: Ms,
  variantName: Do
}, Symbol.toStringTag, { value: "Module" })), hl = (e, t) => ({
  type: "workspaceAction",
  kind: "default",
  alias: e,
  name: `Save ${t}`,
  api: ra,
  meta: { label: "#buttons_save", look: "primary", color: "positive" },
  conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: t }]
}), iy = [
  // ---------------------------------------------------------------- family
  {
    type: "repository",
    alias: Pn,
    name: "Dynamic Images Font Family Detail Repository",
    api: () => Promise.resolve().then(() => Zm)
  },
  {
    type: "store",
    alias: zm,
    name: "Dynamic Images Font Family Detail Store",
    api: Gc
  },
  {
    type: "workspace",
    kind: "routable",
    alias: xo,
    name: "Dynamic Images Font Family Workspace",
    api: () => Promise.resolve().then(() => Sf),
    meta: { entityType: H }
  },
  hl("DynamicImages.WorkspaceAction.FontFamily.Submit", xo),
  // ---------------------------------------------------------------- variant
  {
    type: "repository",
    alias: Fn,
    name: "Dynamic Images Font Detail Repository",
    api: () => Promise.resolve().then(() => ty)
  },
  {
    type: "store",
    alias: Lm,
    name: "Dynamic Images Font Detail Store",
    api: Hc
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Za,
    name: "Dynamic Images Font Workspace",
    api: () => Promise.resolve().then(() => Ef),
    meta: { entityType: Xe }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Font",
    name: "Dynamic Images Font View",
    element: () => Promise.resolve().then(() => Pf),
    weight: 100,
    meta: { label: "Font", pathname: "font", icon: "icon-font" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Za }]
  },
  hl("DynamicImages.WorkspaceAction.Font.Submit", Za)
], ay = [
  ...jm,
  ...qm,
  ...Ym,
  ...Xm,
  ...iy
], oy = [
  ...Em,
  ...Fm,
  ...Pm,
  ...ay,
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
    element: () => Promise.resolve().then(() => zf),
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
    element: () => Promise.resolve().then(() => Bf),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => qf),
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
    api: wm,
    meta: { entityType: qo }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => vv),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => $v),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Sv),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Av),
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
    api: () => Promise.resolve().then(() => Fv),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Pv),
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
    api: () => Promise.resolve().then(() => Rv),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Mv),
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
    element: () => Promise.resolve().then(() => jv)
  }
], Ob = (e, t) => {
  t.registerMany(oy);
};
var sy = Object.defineProperty, ny = Object.getOwnPropertyDescriptor, Xc = (e) => {
  throw TypeError(e);
}, Bn = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? ny(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && sy(t, i, o), o;
}, jn = (e, t, i) => t.has(e) || Xc("Cannot " + i), ry = (e, t, i) => (jn(e, t, "read from private field"), t.get(e)), ml = (e, t, i) => t.has(e) ? Xc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ly = (e, t, i, a) => (jn(e, t, "write to private field"), t.set(e, i), i), cy = (e, t, i) => (jn(e, t, "access private method"), i), So, Ls, Jc;
let ti = class extends P {
  constructor() {
    super(), ml(this, Ls), ml(this, So), this._name = "", this._loading = !0, this.consumeContext(Et, (e) => {
      ly(this, So, e), e && (this.observe(e.template, (t) => {
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
            @input=${cy(this, Ls, Jc)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : h}
    `;
  }
};
So = /* @__PURE__ */ new WeakMap();
Ls = /* @__PURE__ */ new WeakSet();
Jc = function(e) {
  var i;
  const t = e.target.value;
  (i = ry(this, So)) == null || i.updateTemplateFields({ name: t });
};
ti.styles = R`
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
Bn([
  m()
], ti.prototype, "_name", 2);
Bn([
  m()
], ti.prototype, "_loading", 2);
ti = Bn([
  A("di-template-editor")
], ti);
const uy = ti, ps = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return ti;
  },
  default: uy
}, Symbol.toStringTag, { value: "Module" }));
class yl extends bn {
  constructor(t) {
    super(t, {
      workspaceAlias: wo,
      entityType: N,
      detailRepositoryAlias: Qi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Rp),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const dy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: yl,
  api: yl
}, Symbol.toStringTag, { value: "Module" }));
function hs(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function py(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? N : He
    },
    name: e.name,
    entityType: t ? N : q,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? Nc : e.isEnabled ? En : In,
    isEnabled: e.isEnabled
  };
}
class hy extends lc {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: o } = hs(i);
        return w(t, (s) => Pr(a, o, i.foldersOnly ?? !1, s));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = hs(i);
          return w(t, (p) => Pr(n, l, i.foldersOnly ?? !1, p));
        }
        const a = i.parent.unique, { skip: o, take: s } = hs(i);
        return w(t, (n) => ch(a, o, s, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => w(t, (a) => uh(i.treeItem.unique, a)),
      mapper: py
    });
  }
}
class fl extends cc {
  constructor(t) {
    super(t, hy);
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
const my = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: fl,
  api: fl
}, Symbol.toStringTag, { value: "Module" }));
class Zc extends We {
  async requestMoveTo(t) {
    const { error: i } = await w(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(V);
      a == null || a.peek("positive", { data: { message: "Moved" } });
      const o = await this.getContext(ot).catch(() => {
      }), s = t.destination.unique;
      o == null || o.dispatchEvent(new si({
        entityType: s ? N : He,
        unique: s
      }));
    }
    return { error: i };
  }
}
class yy extends Zc {
  constructor() {
    super(...arguments), this.move = fh;
  }
}
class fy extends Zc {
  constructor() {
    super(...arguments), this.move = gh;
  }
}
const gy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: yy
}, Symbol.toStringTag, { value: "Module" })), vy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: fy
}, Symbol.toStringTag, { value: "Module" }));
class gl extends We {
  async requestDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: o } = await w(this, (s) => sh(t.unique, i, s));
    if (a) {
      const s = await this.getContext(V);
      s == null || s.peek("positive", { data: { message: `'${a.template.name}' created` } });
      const n = await this.getContext(ot).catch(() => {
      });
      n == null || n.dispatchEvent(new si({
        entityType: i ? N : He,
        unique: i
      }));
    }
    return { error: o };
  }
}
const by = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateToTemplateRepository: gl,
  api: gl
}, Symbol.toStringTag, { value: "Module" }));
class vl extends We {
  async sortChildrenOf(t) {
    const i = t.sorting.map((o) => ({ key: o.unique, sortOrder: o.sortOrder })), { error: a } = await w(this, (o) => _h(t.unique, i, o));
    if (!a) {
      const o = await this.getContext(V);
      o == null || o.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const _y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortTemplateChildrenRepository: vl,
  api: vl
}, Symbol.toStringTag, { value: "Module" })), Qc = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
class eu extends We {
  async reloadDestination(t) {
    const i = await this.getContext(ot).catch(() => {
    });
    i == null || i.dispatchEvent(new si({
      entityType: t ? N : He,
      unique: t
    }));
  }
  async notify(t, i) {
    const a = await this.getContext(V);
    a == null || a.peek(t, { data: { message: i } });
  }
}
class wy extends eu {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await w(this, (o) => vh(t.uniques, i, o));
    return await this.reloadDestination(i), a || await this.notify("positive", `Moved ${Qc(t.uniques.length, "item")}`), { error: a };
  }
}
class $y extends eu {
  async requestBulkDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: o } = await w(this, (s) => bh(t.uniques, i, s));
    return a ? (await this.reloadDestination(i), a.created.length > 0 && await this.notify("positive", `Copied ${Qc(a.created.length, "template")}`), a.skippedFolders.length > 0 && await this.notify("warning", `Folders are not copied: ${a.skippedFolders.join(", ")}`), a.errors.length > 0 && await this.notify("warning", a.errors.join(" ")), {}) : { error: o };
  }
}
const Ty = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: wy
}, Symbol.toStringTag, { value: "Module" })), xy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: $y
}, Symbol.toStringTag, { value: "Module" }));
class bl extends uc {
  async getHref() {
    return Hh({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const ky = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: bl,
  api: bl
}, Symbol.toStringTag, { value: "Module" }));
class Kn extends ni {
  async execute() {
    var y;
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await w(this, (S) => nh(t, this.enable, S));
    if (a || !i) throw a ?? new Error("The template could not be changed.");
    const { data: o } = await w(this, (S) => Go([t], S)), s = ((y = o == null ? void 0 : o[0]) == null ? void 0 : y.name) ?? "The template", n = this.enable ? "enabled" : "disabled", l = await this.getContext(V);
    if (!i.changed) {
      l == null || l.peek("default", { data: { message: `'${s}' is already ${n}` } });
      return;
    }
    l == null || l.peek("positive", { data: { message: `'${s}' ${n}` } });
    const p = await this.getContext(ot).catch(() => {
    });
    p == null || p.dispatchEvent(new wn({ unique: t, entityType: this.args.entityType })), Dn();
  }
}
class _l extends Kn {
  constructor() {
    super(...arguments), this.enable = !0;
  }
}
const Dy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiEnableTemplateEntityAction: _l,
  DiSetTemplateEnabledEntityAction: Kn,
  api: _l
}, Symbol.toStringTag, { value: "Module" }));
class wl extends Kn {
  constructor() {
    super(...arguments), this.enable = !1;
  }
}
const Sy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDisableTemplateEntityAction: wl,
  api: wl
}, Symbol.toStringTag, { value: "Module" }));
class $l extends ni {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await w(this, async (n) => ({
      blob: await rh(t, n),
      alias: (await xn(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const o = URL.createObjectURL(i.blob), s = document.createElement("a");
    s.href = o, s.download = `${i.alias}.json`, s.click(), URL.revokeObjectURL(o);
  }
}
const Ey = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: $l,
  api: $l
}, Symbol.toStringTag, { value: "Module" })), Iy = 1500;
async function tu(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((o) => setTimeout(o, Iy));
    try {
      a = await jh(a.id, t);
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
class Tl extends ni {
  async execute() {
    var p;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await w(this, (y) => Go([t], y)), a = ((p = i == null ? void 0 : i[0]) == null ? void 0 : p.name) ?? "this template";
    await dc(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: o, error: s } = await w(this, (y) => Dc(t, !1, y));
    if (s || !o) throw s ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(V);
    n == null || n.peek("positive", { data: { message: `Regenerating ${o.total} item(s)…` } });
    const l = await this.getContext(Ce);
    await tu(o, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const Oy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: Tl,
  api: Tl
}, Symbol.toStringTag, { value: "Module" })), Cy = new pc(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), Ay = new pc(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class xl extends ni {
  async execute() {
    const { json: t } = await $n(this, Ay, { data: {} }), i = this.args.unique ?? null, { data: a, error: o } = await w(this, (l) => lh(t, "create", l, i));
    if (o || !a) throw o ?? new Error("The template could not be imported.");
    const s = await this.getContext(V);
    s == null || s.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) s == null || s.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(ot);
    n == null || n.dispatchEvent(new si({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const Fy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: xl,
  api: xl
}, Symbol.toStringTag, { value: "Module" }));
var Py = Object.defineProperty, Ry = Object.getOwnPropertyDescriptor, iu = (e) => {
  throw TypeError(e);
}, au = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ry(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Py(t, i, o), o;
}, My = (e, t, i) => t.has(e) || iu("Cannot " + i), Ly = (e, t, i) => t.has(e) ? iu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), kl = (e, t, i) => (My(e, t, "access private method"), i), Qa, ou, su;
let Ri = class extends hc {
  constructor() {
    super(...arguments), Ly(this, Qa), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${kl(this, Qa, ou)} aria-label="Choose a file" />
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
            @click=${kl(this, Qa, su)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Qa = /* @__PURE__ */ new WeakSet();
ou = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
su = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
Ri.styles = [
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
au([
  m()
], Ri.prototype, "_json", 2);
Ri = au([
  A("di-import-template-modal")
], Ri);
const zy = Ri, Wy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return Ri;
  },
  default: zy
}, Symbol.toStringTag, { value: "Module" }));
function nu(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? N : q,
    name: e.name,
    icon: t ? Nc : e.isEnabled ? En : In,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class Dl extends We {
  async requestCollection(t = {}) {
    const i = await this.getContext(Tn), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: o, error: s } = await w(this, (n) => dh({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return o ? { data: { total: o.total, items: o.items.map(nu) } } : { error: s };
  }
}
const Uy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: Dl,
  api: Dl,
  mapCollectionItem: nu
}, Symbol.toStringTag, { value: "Module" }));
class Sl extends mc {
  async requestItemHref(t) {
    return t.entityType === N ? ei(N, t.unique) : Aa(t.unique);
  }
}
const Ny = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: Sl,
  api: Sl
}, Symbol.toStringTag, { value: "Module" }));
var By = Object.defineProperty, jy = Object.getOwnPropertyDescriptor, ru = (e) => {
  throw TypeError(e);
}, st = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? jy(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && By(t, i, o), o;
}, Vn = (e, t, i) => t.has(e) || ru("Cannot " + i), Eo = (e, t, i) => (Vn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), qa = (e, t, i) => t.has(e) ? ru("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), eo = (e, t, i, a) => (Vn(e, t, "write to private field"), t.set(e, i), i), ms = (e, t, i) => (Vn(e, t, "access private method"), i), Io, Vi, pa, qi, lu, cu, uu;
const Ky = 400;
let ye = class extends P {
  constructor() {
    super(), qa(this, qi), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, qa(this, Io), qa(this, Vi), qa(this, pa), this.consumeContext(Ce, (e) => {
      eo(this, Io, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), eo(this, Vi, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && ms(this, qi, lu).call(this);
    })), Eo(this, Vi).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Eo(this, Vi)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, eo(this, pa, void 0);
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
        @selected=${ms(this, qi, cu)}
        @deselected=${ms(this, qi, uu)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : h}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : h;
  }
};
Io = /* @__PURE__ */ new WeakMap();
Vi = /* @__PURE__ */ new WeakMap();
pa = /* @__PURE__ */ new WeakMap();
qi = /* @__PURE__ */ new WeakSet();
lu = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || Eo(this, pa) === t)) {
    eo(this, pa, t);
    try {
      const i = await ph(e.unique, Ky, () => {
        var a;
        return (a = Eo(this, Io)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
cu = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new yc(this.item.unique)));
};
uu = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new fc(this.item.unique)));
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
  A("di-template-collection-card")
], ye);
const Vy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return ye;
  },
  get element() {
    return ye;
  }
}, Symbol.toStringTag, { value: "Module" }));
function El(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function qy(e) {
  const t = e.parentKey ? e.entityType === "font" ? H : oe : kt;
  return {
    unique: e.key,
    parent: { unique: e.parentKey, entityType: t },
    name: e.name,
    entityType: Rn(e.entityType),
    hasChildren: e.hasChildren,
    isFolder: e.entityType !== "font",
    icon: Mn(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
class Yy extends lc {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: o } = El(i);
        return w(t, (s) => Rr(a, o, i.foldersOnly ?? !1, s));
      },
      getChildrenOf: (i) => {
        const { skip: a, take: o } = El(i);
        if (i.parent.unique === null)
          return w(t, (n) => Rr(a, o, i.foldersOnly ?? !1, n));
        const s = i.parent.unique;
        return w(t, (n) => Eh(s, a, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => w(t, (a) => Ih(i.treeItem.unique, a)),
      mapper: qy
    });
  }
}
class Il extends cc {
  constructor(t) {
    super(t, Yy);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: kt,
      name: "Fonts",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const Gy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontTreeRepository: Il,
  api: Il
}, Symbol.toStringTag, { value: "Module" }));
class Ol extends bn {
  constructor(t) {
    super(t, {
      workspaceAlias: To,
      entityType: oe,
      detailRepositoryAlias: ia
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        // The same element as a template folder's: core's editable folder header, nothing more.
        component: () => Promise.resolve().then(() => Rp),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Hy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFolderWorkspaceContext: Ol,
  api: Ol
}, Symbol.toStringTag, { value: "Module" }));
function Xy(e) {
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
function du(e) {
  return {
    unique: e.key,
    entityType: Rn(e.entityType),
    name: e.name,
    icon: Mn(e.entityType, e.sourceKind === "url"),
    isFolder: e.entityType === "folder",
    variants: e.variantCount === null ? "" : String(e.variantCount),
    usedBy: e.usedByTemplateCount === null ? "" : String(e.usedByTemplateCount),
    weight: e.weight === null ? "" : String(e.weight),
    style: e.isItalic === null ? "" : e.isItalic ? "Italic" : "Upright",
    source: Xy(e),
    sampleFontKey: e.sampleFontKey
  };
}
class Cl extends We {
  async requestCollection(t = {}) {
    const i = await this.getContext(Tn), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: o, error: s } = await w(this, (n) => Oh({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return o ? { data: { total: o.total, items: o.items.map(du) } } : { error: s };
  }
}
const Jy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionRepository: Cl,
  api: Cl,
  mapFontCollectionItem: du
}, Symbol.toStringTag, { value: "Module" }));
class Al extends mc {
  async requestItemHref(t) {
    return ei(t.entityType, t.unique);
  }
}
const Fl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionContext: Al,
  api: Al
}, Symbol.toStringTag, { value: "Module" })), zs = /* @__PURE__ */ new Map(), Fa = (e) => `di-${e}`;
function qn(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = zs.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const o = await Sh(e, t), s = new FontFace(Fa(e), o);
      return await s.load(), document.fonts.add(s), s;
    } catch (o) {
      console.warn("[DynamicImages] Could not load font", e, o);
      return;
    }
  })();
  return zs.set(e, a), a;
}
async function Zy(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => qn(a, t)));
}
function Qy(e) {
  zs.delete(e);
}
var ef = Object.defineProperty, tf = Object.getOwnPropertyDescriptor, pu = (e) => {
  throw TypeError(e);
}, It = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? tf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && ef(t, i, o), o;
}, Yn = (e, t, i) => t.has(e) || pu("Cannot " + i), ys = (e, t, i) => (Yn(e, t, "read from private field"), t.get(e)), fs = (e, t, i) => t.has(e) ? pu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hu = (e, t, i, a) => (Yn(e, t, "write to private field"), t.set(e, i), i), Ya = (e, t, i) => (Yn(e, t, "access private method"), i), Oo, aa, di, Ws, mu, yu;
let we = class extends P {
  constructor() {
    super(), fs(this, di), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._loaded = !1, fs(this, Oo), fs(this, aa), this.consumeContext(Ce, (e) => {
      hu(this, Oo, e), Ya(this, di, Ws).call(this);
    });
  }
  willUpdate(e) {
    super.willUpdate(e), e.has("item") && Ya(this, di, Ws).call(this);
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
        @selected=${Ya(this, di, mu)}
        @deselected=${Ya(this, di, yu)}>
        ${this.item.sampleFontKey && this._loaded ? r`<div class="specimen" style="font-family: ${Fa(this.item.sampleFontKey)}, serif">Aa Bb</div>` : r`<umb-icon name=${this.item.icon}></umb-icon>`}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    `;
  }
};
Oo = /* @__PURE__ */ new WeakMap();
aa = /* @__PURE__ */ new WeakMap();
di = /* @__PURE__ */ new WeakSet();
Ws = function() {
  var i;
  const e = (i = this.item) == null ? void 0 : i.sampleFontKey, t = ys(this, Oo);
  !t || !e || ys(this, aa) === e || (hu(this, aa, e), this._loaded = !1, qn(e, () => t.getLatestToken()).then((a) => {
    ys(this, aa) === e && (this._loaded = !!a);
  }));
};
mu = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new yc(this.item.unique)));
};
yu = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new fc(this.item.unique)));
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
It([
  f({ type: Object })
], we.prototype, "item", 2);
It([
  f({ type: Boolean })
], we.prototype, "selectable", 2);
It([
  f({ type: Boolean })
], we.prototype, "selected", 2);
It([
  f({ type: Boolean, attribute: "select-only" })
], we.prototype, "selectOnly", 2);
It([
  f({ type: Boolean })
], we.prototype, "disabled", 2);
It([
  f({ type: String })
], we.prototype, "href", 2);
It([
  m()
], we.prototype, "_loaded", 2);
we = It([
  A("di-font-collection-card")
], we);
const af = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontCollectionCardElement() {
    return we;
  },
  get element() {
    return we;
  }
}, Symbol.toStringTag, { value: "Module" }));
class Pl extends We {
  async requestReferencedBy(t, i = 0, a = 20) {
    const { data: o, error: s } = await w(this, (l) => bc(t, i, a, l));
    if (!o) return { error: s };
    const n = o.items.map((l) => ({
      entityType: q,
      unique: l.key,
      name: l.name,
      isEnabled: l.isEnabled
    }));
    return { data: { total: o.total, items: n } };
  }
  /** Which of a bulk selection is in use - the fonts themselves, which the bulk modal names. */
  async requestAreReferenced(t, i = 0, a = 20) {
    const { data: o, error: s } = await w(this, (n) => Ch(t, i, a, n));
    return o ? { data: { total: o.total, items: o.items.map(zn) } } : { error: s };
  }
}
const of = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontReferenceRepository: Pl,
  api: Pl
}, Symbol.toStringTag, { value: "Module" }));
class Rl extends We {
  delete(t) {
    return w(this, async (i) => {
      const [a] = await Ho([t], i);
      switch (a == null ? void 0 : a.entityType) {
        case "folder":
          return _c(t, i);
        case "family":
          return wc(t, i);
        default:
          return vc(t, i);
      }
    });
  }
}
const sf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontBulkDeleteRepository: Rl,
  api: Rl
}, Symbol.toStringTag, { value: "Module" }));
class fu extends We {
  async moved(t, i) {
    if (i) {
      const o = await this.getContext(V);
      o == null || o.peek("positive", { data: { message: i } });
    }
    const a = await this.getContext(ot).catch(() => {
    });
    a == null || a.dispatchEvent(new si({
      entityType: t ? oe : kt,
      unique: t
    }));
  }
}
class gu extends fu {
  async requestMoveTo(t) {
    const i = t.destination.unique, { error: a } = await w(this, (o) => this.move(t.unique, i, o));
    return a || await this.moved(i, "Moved"), { error: a };
  }
}
class nf extends gu {
  constructor() {
    super(...arguments), this.move = Lh;
  }
}
class rf extends gu {
  constructor() {
    super(...arguments), this.move = zh;
  }
}
class lf extends fu {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await w(this, (o) => Uh(t.uniques, i, o));
    return await this.moved(i, a ? void 0 : `Moved ${t.uniques.length} item${t.uniques.length === 1 ? "" : "s"}`), { error: a };
  }
}
const cf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: nf
}, Symbol.toStringTag, { value: "Module" })), uf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: rf
}, Symbol.toStringTag, { value: "Module" })), df = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: lf
}, Symbol.toStringTag, { value: "Module" }));
class Ml extends We {
  async sortChildrenOf(t) {
    const i = t.sorting.map((o) => ({ key: o.unique, sortOrder: o.sortOrder })), { error: a } = await w(this, (o) => Wh(t.unique, i, o));
    if (!a) {
      const o = await this.getContext(V);
      o == null || o.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const pf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortFontChildrenRepository: Ml,
  api: Ml
}, Symbol.toStringTag, { value: "Module" }));
class Ll extends qp {
  constructor(t, i) {
    super(t, i), this.consumeContext(Tn, (a) => {
      this.observe(a == null ? void 0 : a.unique, async (o) => {
        var n;
        if (!o) {
          this.permitted = !1;
          return;
        }
        const { data: s } = await w(this, (l) => Ho([o], l));
        this.permitted = ((n = s == null ? void 0 : s[0]) == null ? void 0 : n.isUrlFont) ?? !1;
      });
    });
  }
}
const hf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiIsWebFontCondition: Ll,
  api: Ll
}, Symbol.toStringTag, { value: "Module" }));
var mf = Object.defineProperty, yf = Object.getOwnPropertyDescriptor, Qo = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? yf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && mf(t, i, o), o;
};
let ii = class extends P {
  constructor() {
    super(...arguments), this.readonly = !1, this.standalone = !1;
  }
  render() {
    return this.item ? r`
      <uui-ref-node
        name=${this.item.name ?? "Template"}
        href=${Aa(this.item.unique)}
        ?readonly=${this.readonly}
        ?standalone=${this.standalone}>
        <umb-icon slot="icon" name=${this.item.isEnabled === !1 ? In : En}></umb-icon>
        <slot name="actions" slot="actions"></slot>
      </uui-ref-node>
    ` : h;
  }
};
Qo([
  f({ type: Object })
], ii.prototype, "item", 2);
Qo([
  f({ type: Boolean })
], ii.prototype, "readonly", 2);
Qo([
  f({ type: Boolean })
], ii.prototype, "standalone", 2);
ii = Qo([
  A("di-template-item-ref")
], ii);
const ff = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateItemRefElement() {
    return ii;
  },
  get element() {
    return ii;
  }
}, Symbol.toStringTag, { value: "Module" }));
class es extends uc {
  async execute() {
    var n, l;
    const t = this.args.unique ?? null, i = { mode: this.mode };
    if (this.args.entityType === H && t) {
      const { data: p } = await w(this, (y) => Ho([t], y));
      i.familyKey = t, i.familyName = (n = p == null ? void 0 : p[0]) == null ? void 0 : n.name;
    } else
      i.parentKey = t;
    const a = await $n(this, Cy, { data: i });
    if (!(a != null && a.uploaded)) return;
    const o = await this.getContext(V);
    o == null || o.peek("positive", { data: { message: "Font added" } }), (l = a.warnings) != null && l.length && (o == null || o.peek("warning", { data: { headline: "Some variants were not added", message: a.warnings.join(" ") } }));
    const s = await this.getContext(ot);
    s == null || s.dispatchEvent(new si({ entityType: this.args.entityType, unique: t })), Dn();
  }
}
class gf extends es {
  constructor() {
    super(...arguments), this.mode = "upload";
  }
}
class vf extends es {
  constructor() {
    super(...arguments), this.mode = "web";
  }
}
class bf extends es {
  constructor() {
    super(...arguments), this.mode = "path";
  }
}
class _f extends es {
  constructor() {
    super(...arguments), this.mode = void 0;
  }
}
const wf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: gf
}, Symbol.toStringTag, { value: "Module" })), $f = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: vf
}, Symbol.toStringTag, { value: "Module" })), Tf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: bf
}, Symbol.toStringTag, { value: "Module" })), xf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: _f
}, Symbol.toStringTag, { value: "Module" }));
class zl extends ni {
  async getHref() {
    return this.args.unique ? ei(this.args.entityType, this.args.unique) : void 0;
  }
}
const kf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRenameFontFamilyEntityAction: zl,
  api: zl
}, Symbol.toStringTag, { value: "Module" }));
class Wl extends ni {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await w(this, (n) => kh(t, n));
    if (a || !i) throw a ?? new Error("The font could not be refreshed.");
    Qy(t);
    const o = await this.getContext(V);
    o == null || o.peek("positive", { data: { message: `'${i.familyName}' refreshed` } });
    const s = await this.getContext(ot).catch(() => {
    });
    s == null || s.dispatchEvent(new wn({ unique: t, entityType: this.args.entityType }));
  }
}
const Df = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRefreshFontEntityAction: Wl,
  api: Wl
}, Symbol.toStringTag, { value: "Module" }));
class Ul extends bn {
  constructor(t) {
    super(t, {
      workspaceAlias: xo,
      entityType: H,
      detailRepositoryAlias: Pn
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Xv),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Sf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFamilyWorkspaceContext: Ul,
  api: Ul
}, Symbol.toStringTag, { value: "Module" }));
class Nl extends Up {
  constructor(t) {
    super(t, {
      workspaceAlias: Za,
      entityType: Xe,
      detailRepositoryAlias: Fn
    }), this.current = this._data.current, this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => eb),
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
    this._data.updateCurrent({ weight: t, name: Do(t, (i == null ? void 0 : i.isItalic) ?? !1) });
  }
  setItalic(t) {
    const i = this._data.getCurrent();
    this._data.updateCurrent({ isItalic: t, name: Do((i == null ? void 0 : i.weight) ?? 400, t) });
  }
}
const Gn = new at(
  Wp.contextAlias,
  void 0,
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === Xe;
  }
), Ef = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_WORKSPACE_CONTEXT: Gn,
  DiFontWorkspaceContext: Nl,
  api: Nl
}, Symbol.toStringTag, { value: "Module" }));
var If = Object.defineProperty, Of = Object.getOwnPropertyDescriptor, vu = (e) => {
  throw TypeError(e);
}, Pa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Of(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && If(t, i, o), o;
}, Hn = (e, t, i) => t.has(e) || vu("Cannot " + i), ai = (e, t, i) => (Hn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ga = (e, t, i) => t.has(e) ? vu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Us = (e, t, i, a) => (Hn(e, t, "write to private field"), t.set(e, i), i), qe = (e, t, i) => (Hn(e, t, "access private method"), i), wt, Co, Ao, De, Ns, bu, to, _u, wu, $u;
const Cf = ["Regular", "Bold", "Italic", "BoldItalic"];
function Af(e) {
  switch (e.sourceKind) {
    case "path":
      return `wwwroot: ${e.path ?? ""}`;
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : e.sourceUrl ?? "Web";
    default:
      return "Media library";
  }
}
let Je = class extends P {
  constructor() {
    super(), Ga(this, De), this._sampleLoaded = !1, this._usedBy = [], this._usedByTotal = 0, Ga(this, wt), Ga(this, Co), Ga(this, Ao), this.consumeContext(Ce, (e) => {
      Us(this, Co, () => e == null ? void 0 : e.getLatestToken()), qe(this, De, Ns).call(this);
    }), this.consumeContext(Gn, (e) => {
      Us(this, wt, e), this.observe(e == null ? void 0 : e.current, (t) => {
        this._data = t, qe(this, De, Ns).call(this);
      });
    });
  }
  render() {
    const e = this._data;
    return e ? r`
      <uui-box headline="Sample">
        <p class="specimen" style=${this._sampleLoaded ? `font-family: ${Fa(e.unique)}, serif` : ""}>
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
      return (i = ai(this, wt)) == null ? void 0 : i.setWeight(Number(t.target.value) || 400);
    }}>
          </uui-input>
          <uui-toggle
            id="italic"
            label="Italic"
            ?checked=${e.isItalic}
            @change=${(t) => {
      var i;
      return (i = ai(this, wt)) == null ? void 0 : i.setItalic(t.target.checked);
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
        ${qe(this, De, $u).call(this, e.styles)}
        <uui-button look="secondary" label="Add a named style" @click=${qe(this, De, _u)}>Add a style</uui-button>
      </uui-box>

      <uui-box headline="Source">
        <dl>
          <dt>Family</dt>
          <dd>
            ${e.font.familyKey ? r`<a href=${ei(H, e.font.familyKey)}>${e.font.familyName}</a>` : e.font.familyName}
          </dd>
          <dt>File</dt>
          <dd>${Af(e.font)}</dd>
        </dl>
      </uui-box>

      <uui-box headline="Used by">
        ${this._usedByTotal === 0 ? r`<p class="hint">No template uses this font.</p>` : r`<ul class="used-by">
              ${se(
      this._usedBy,
      (t) => t.key,
      (t) => r`<li>
                  <uui-ref-node name=${t.name} href=${Aa(t.key)}>
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
wt = /* @__PURE__ */ new WeakMap();
Co = /* @__PURE__ */ new WeakMap();
Ao = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakSet();
Ns = async function() {
  var o;
  const e = (o = this._data) == null ? void 0 : o.unique, t = ai(this, Co);
  if (!e || !t || ai(this, Ao) === e) return;
  Us(this, Ao, e);
  const [i, a] = await Promise.all([
    qn(e, t),
    bc(e, 0, 50, t).catch(() => {
    })
  ]);
  this._sampleLoaded = !!i, this._usedBy = (a == null ? void 0 : a.items) ?? [], this._usedByTotal = (a == null ? void 0 : a.total) ?? 0;
};
bu = async function() {
  var a;
  await this.updateComplete, await new Promise((o) => requestAnimationFrame(o));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
to = function(e, t) {
  var a, o;
  const i = [...((a = this._data) == null ? void 0 : a.styles) ?? []];
  i[e] = { ...i[e], ...t }, (o = ai(this, wt)) == null || o.setStyles(i);
};
_u = function() {
  var e, t;
  (t = ai(this, wt)) == null || t.setStyles([...((e = this._data) == null ? void 0 : e.styles) ?? [], { name: "New style", size: 32, fontStyle: "Regular" }]), qe(this, De, bu).call(this);
};
wu = function(e) {
  var i, a;
  const t = [...((i = this._data) == null ? void 0 : i.styles) ?? []];
  t.splice(e, 1), (a = ai(this, wt)) == null || a.setStyles(t);
};
$u = function(e) {
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
                  @change=${(a) => qe(this, De, to).call(this, i, { name: a.target.value })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-input
                  type="number"
                  label="Size"
                  .value=${String(t.size)}
                  @change=${(a) => qe(this, De, to).call(this, i, { size: Number(a.target.value) })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-select
                  label="Face"
                  .options=${Cf.map((a) => ({ name: a, value: a, selected: a === t.fontStyle }))}
                  @change=${(a) => qe(this, De, to).call(this, i, { fontStyle: a.target.value })}>
                </uui-select>
              </uui-table-cell>
              <uui-table-cell>
                <uui-button
                  compact
                  look="secondary"
                  color="danger"
                  label="Remove ${t.name}"
                  @click=${() => qe(this, De, wu).call(this, i)}>
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
Pa([
  m()
], Je.prototype, "_data", 2);
Pa([
  m()
], Je.prototype, "_sampleLoaded", 2);
Pa([
  m()
], Je.prototype, "_usedBy", 2);
Pa([
  m()
], Je.prototype, "_usedByTotal", 2);
Je = Pa([
  A("di-font-workspace-view")
], Je);
const Ff = Je, Pf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontWorkspaceViewElement() {
    return Je;
  },
  default: Ff
}, Symbol.toStringTag, { value: "Module" }));
var Rf = Object.defineProperty, Mf = Object.getOwnPropertyDescriptor, Tu = (e) => {
  throw TypeError(e);
}, Ra = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Mf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Rf(t, i, o), o;
}, Xn = (e, t, i) => t.has(e) || Tu("Cannot " + i), $t = (e, t, i) => (Xn(e, t, "read from private field"), t.get(e)), ji = (e, t, i) => t.has(e) ? Tu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Bl = (e, t, i, a) => (Xn(e, t, "write to private field"), t.set(e, i), i), Ye = (e, t, i) => (Xn(e, t, "access private method"), i), Yi, Fo, io, oa, Se, Bs, xu, ku, Gi, Du;
let Ze = class extends P {
  constructor() {
    super(), ji(this, Se), ji(this, Yi), ji(this, Fo), this._templates = [], this._fonts = [], this._loading = !0, ji(this, io, () => {
      $t(this, Yi) && Ye(this, Se, Bs).call(this);
    }), ji(this, oa, () => {
      var e;
      return (e = $t(this, Yi)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(V, (e) => {
      Bl(this, Fo, e);
    }), this.consumeContext(Ce, (e) => {
      Bl(this, Yi, e), e && Ye(this, Se, Bs).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(ks, $t(this, io));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(ks, $t(this, io));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${Ye(this, Se, ku).call(this)} ${Ye(this, Se, Du).call(this)}
      </umb-body-layout>
    `;
  }
};
Yi = /* @__PURE__ */ new WeakMap();
Fo = /* @__PURE__ */ new WeakMap();
io = /* @__PURE__ */ new WeakMap();
oa = /* @__PURE__ */ new WeakMap();
Se = /* @__PURE__ */ new WeakSet();
Bs = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      th($t(this, oa)),
      Ds($t(this, oa)).catch(() => []),
      Sc($t(this, oa)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    Ye(this, Se, xu).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
xu = function(e, t, i) {
  var o;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (o = $t(this, Fo)) == null || o.peek(e, { data: { headline: t, message: a } });
};
ku = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((o) => o.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${Ye(this, Se, Gi).call(this, "Templates", this._templates.length, "icon-brush", !1, ei(He))}
        ${Ye(this, Se, Gi).call(this, "Fonts", this._fonts.length, "icon-font", !1, ei(kt))}
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
Du = function() {
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
        <uui-button look="secondary" href=${Xh("health")} label="See all issues">See all</uui-button>
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
Ra([
  m()
], Ze.prototype, "_templates", 2);
Ra([
  m()
], Ze.prototype, "_fonts", 2);
Ra([
  m()
], Ze.prototype, "_health", 2);
Ra([
  m()
], Ze.prototype, "_loading", 2);
Ze = Ra([
  A("di-overview-dashboard")
], Ze);
const Lf = Ze, zf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return Ze;
  },
  default: Lf
}, Symbol.toStringTag, { value: "Module" }));
var Wf = Object.getOwnPropertyDescriptor, Uf = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Wf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let Po = class extends P {
  connectedCallback() {
    super.connectedCallback(), window.history.replaceState(null, "", ei(kt));
  }
};
Po = Uf([
  A("di-fonts-redirect")
], Po);
const Nf = Po, Bf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsRedirectElement() {
    return Po;
  },
  default: Nf
}, Symbol.toStringTag, { value: "Module" }));
var jf = Object.defineProperty, Kf = Object.getOwnPropertyDescriptor, Su = (e) => {
  throw TypeError(e);
}, Ma = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Kf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && jf(t, i, o), o;
}, Jn = (e, t, i) => t.has(e) || Su("Cannot " + i), ht = (e, t, i) => (Jn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ha = (e, t, i) => t.has(e) ? Su("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), jl = (e, t, i, a) => (Jn(e, t, "write to private field"), t.set(e, i), i), gi = (e, t, i) => (Jn(e, t, "access private method"), i), ao, vi, Mi, Tt, Ro, js, Eu;
let Qe = class extends P {
  constructor() {
    super(), Ha(this, Tt), Ha(this, ao), Ha(this, vi), this._loading = !0, this._busy = !1, Ha(this, Mi, () => {
      var e;
      return (e = ht(this, ao)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(V, (e) => {
      jl(this, vi, e);
    }), this.consumeContext(Ce, (e) => {
      jl(this, ao, e), e && gi(this, Tt, Ro).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => gi(this, Tt, Ro).call(this)}>Re-check</uui-button>
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
                        ${a.templateKey ? r`<a href=${Aa(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${gi(this, Tt, Eu).call(this)}
      </umb-body-layout>
    `;
  }
};
ao = /* @__PURE__ */ new WeakMap();
vi = /* @__PURE__ */ new WeakMap();
Mi = /* @__PURE__ */ new WeakMap();
Tt = /* @__PURE__ */ new WeakSet();
Ro = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Sc(ht(this, Mi)),
      qh(ht(this, Mi)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
js = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const o = e === "export" ? await Yh(ht(this, Mi)) : await Gh(ht(this, Mi));
    (t = ht(this, vi)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${o.written} file(s) written.` : `${o.imported} template(s) imported.`
      }
    });
    for (const s of o.messages.slice(0, 3))
      (i = ht(this, vi)) == null || i.peek("warning", { data: { message: s } });
    await gi(this, Tt, Ro).call(this);
  } catch (o) {
    (a = ht(this, vi)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: o instanceof Error ? o.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Eu = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => gi(this, Tt, js).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => gi(this, Tt, js).call(this, "import")}>
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
Ma([
  m()
], Qe.prototype, "_health", 2);
Ma([
  m()
], Qe.prototype, "_sync", 2);
Ma([
  m()
], Qe.prototype, "_loading", 2);
Ma([
  m()
], Qe.prototype, "_busy", 2);
Qe = Ma([
  A("di-health-dashboard")
], Qe);
const Vf = Qe, qf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Qe;
  },
  default: Vf
}, Symbol.toStringTag, { value: "Module" })), Iu = 3, Ou = 12, Cu = 0.1, Au = 0.9;
function Yf(e) {
  return Math.max(Iu, Math.min(Ou, e));
}
function Gf(e) {
  return Math.max(Cu, Math.min(Au, e));
}
function Hf(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Yf(t), o = 0.5 * Gf(i), s = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let p = 0; p < s; p++) {
    const y = (-90 + p * n) * Math.PI / 180, S = e === "star" && p % 2 === 1 ? o : 0.5;
    l.push({ x: 0.5 + S * Math.cos(y), y: 0.5 + S * Math.sin(y) });
  }
  return l;
}
function Xf(e, t, i) {
  const a = Hf(e, t, i);
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
  sides: { min: Iu, max: Ou },
  innerRatio: { min: Cu, max: Au }
}, Mo = { min: 0.1, max: 4 };
function Jf(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let o = a;
  return t !== void 0 && (o = Math.max(t, o)), i !== void 0 && (o = Math.min(i, o)), o;
}
function Fu(e) {
  const t = e.composedPath()[0];
  return t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) ? !0 : (t == null ? void 0 : t.isContentEditable) === !0;
}
function Zn(e) {
  const t = e.kind ?? "linear", i = Math.round(Ks(e.centreX ?? 0.5) * 100), a = Math.round(Ks(e.centreY ?? 0.5) * 100);
  switch (t) {
    case "radial":
      return `radial-gradient(${e.shape ?? "ellipse"} ${Qf(e.extent)} at ${i}% ${a}%, ${gs(e)})`;
    case "angular":
      return `conic-gradient(from ${e.angle}deg at ${i}% ${a}%, ${gs(e)})`;
    case "reflected":
      return `linear-gradient(${e.angle}deg, ${Vs(eg(Dt(e)))})`;
    case "diamond": {
      const o = Vs(Dt(e).map((s) => ({ ...s, position: s.position / 2 })));
      return [
        `linear-gradient(to top left, ${o}) left top / ${i}% ${a}% no-repeat`,
        `linear-gradient(to top right, ${o}) right top / ${100 - i}% ${a}% no-repeat`,
        `linear-gradient(to bottom left, ${o}) left bottom / ${i}% ${100 - a}% no-repeat`,
        `linear-gradient(to bottom right, ${o}) right bottom / ${100 - i}% ${100 - a}% no-repeat`
      ].join(", ");
    }
    default:
      return `linear-gradient(${e.angle}deg, ${gs(e)})`;
  }
}
function Ks(e) {
  return Math.min(1, Math.max(0, e));
}
const Zf = {
  farthestCorner: "farthest-corner",
  farthestSide: "farthest-side",
  closestCorner: "closest-corner",
  closestSide: "closest-side"
};
function Qf(e) {
  return Zf[e ?? "farthestCorner"] ?? "farthest-corner";
}
function Dt(e) {
  const t = e.stops;
  return !t || t.length < 2 ? [{ colour: e.from, position: 0 }, { colour: e.to, position: 1 }] : t.map((i, a) => ({ stop: { colour: i.colour, position: Ks(i.position) }, index: a })).sort((i, a) => i.stop.position - a.stop.position || i.index - a.index).map(({ stop: i }) => i);
}
function eg(e) {
  return [
    ...[...e].reverse().map((t) => ({ colour: t.colour, position: 0.5 - t.position / 2 })),
    ...e.map((t) => ({ colour: t.colour, position: 0.5 + t.position / 2 }))
  ];
}
function gs(e) {
  const t = e.stops;
  return t && t.length >= 2 ? Vs(Dt(e)) : `${e.from}, ${e.to}`;
}
function Vs(e) {
  return e.map((t) => `${t.colour} ${Qn(t.position * 100)}%`).join(", ");
}
const Qn = (e) => Math.round(e * 100) / 100;
function ha(e, t) {
  const i = Dt({ ...e, stops: t });
  return { ...e, stops: t, from: i[0].colour, to: i[i.length - 1].colour };
}
function tg(e) {
  const t = [...Dt(e)].reverse().map((i) => ({ colour: i.colour, position: Qn(1 - i.position) }));
  return ha(e, t);
}
function ig(e) {
  const t = Dt(e);
  let i = 0;
  for (let n = 1; n < t.length; n++)
    t[n].position - t[n - 1].position > t[i + 1].position - t[i].position && (i = n - 1);
  const a = t[i], o = t[i + 1], s = Qn((a.position + o.position) / 2);
  return ha(e, [...t, { colour: og(a.colour, o.colour, 0.5), position: s }]);
}
function ag(e, t) {
  const i = Dt(e);
  return i.length <= 2 ? e : ha(e, i.filter((a, o) => o !== t));
}
function og(e, t, i) {
  const a = Kl(e), o = Kl(t);
  if (!a || !o) return e;
  const s = (p) => Math.round(a[p] + (o[p] - a[p]) * i).toString(16).padStart(2, "0").toUpperCase(), n = `#${s(0)}${s(1)}${s(2)}`, l = s(3);
  return l === "FF" ? n : `${n}${l}`;
}
function Kl(e) {
  const t = (e ?? "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t) || ![3, 4, 6, 8].includes(t.length)) return;
  const i = t.length <= 4 ? [...t].map((o) => o + o).join("") : t, a = (o) => parseInt(i.slice(o * 2, o * 2 + 2), 16);
  return [a(0), a(1), a(2), i.length === 8 ? a(3) : 255];
}
const er = R`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function sg(e, t) {
  const i = [], a = t.lockX ? void 0 : Vl(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    ng(t),
    t.threshold
  ), o = t.lockY ? void 0 : Vl(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    rg(t),
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
function ng(e) {
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
function rg(e) {
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
function Vl(e, t, i) {
  let a;
  for (const o of e)
    for (const s of t) {
      const n = Math.abs(s.at - o.value);
      n > i || (!a || n < a.distance) && (a = { at: s.at, offset: o.offset, label: s.label, distance: n });
    }
  return a;
}
var lg = Object.defineProperty, cg = Object.getOwnPropertyDescriptor, Pu = (e) => {
  throw TypeError(e);
}, nt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? cg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && lg(t, i, o), o;
}, tr = (e, t, i) => t.has(e) || Pu("Cannot " + i), xe = (e, t, i) => (tr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vs = (e, t, i) => t.has(e) ? Pu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), bs = (e, t, i, a) => (tr(e, t, "write to private field"), t.set(e, i), i), X = (e, t, i) => (tr(e, t, "access private method"), i), Rt, Hi, M, ts, ir, Ru, Mu, Lu, zu, ar, Lo, Wu, Uu, Nu, Bu, ju, Ku, Vu, qu, Yu;
const ug = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], _s = 18;
let Ee = class extends P {
  constructor() {
    super(...arguments), vs(this, M), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, vs(this, Rt), vs(this, Hi);
  }
  willUpdate() {
    this._box = X(this, M, Ru).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== xe(this, Hi) && ((t = xe(this, Rt)) == null || t.disconnect(), bs(this, Hi, e), e && (xe(this, Rt) ?? bs(this, Rt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), xe(this, Rt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = xe(this, Rt)) == null || e.disconnect(), bs(this, Hi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return h;
    const e = this._box;
    return r`
      <div
        class=${_n({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${j({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...xe(this, M, Mu) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...X(this, M, ar).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      X(this, M, Wu).call(this, t), X(this, M, Lo).call(this, t);
    }}>
        ${X(this, M, Uu).call(this)}
      </div>

      ${this.selected ? X(this, M, qu).call(this, e) : h}
      ${this.showMeasured && this.measured ? X(this, M, Yu).call(this) : h}
    `;
  }
};
Rt = /* @__PURE__ */ new WeakMap();
Hi = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
ts = function() {
  return this.resolvedPosition ?? this.layer.position;
};
ir = function() {
  return this.layer.rotation ?? 0;
};
Ru = function() {
  var o;
  const e = this.layer, t = e.size.width ?? X(this, M, Lu).call(this), i = e.size.height ?? ((o = this.measured) == null ? void 0 : o.height) ?? X(this, M, zu).call(this), a = Zo(xe(this, M, ts), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
Mu = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
Lu = function() {
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
zu = function() {
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
ar = function(e) {
  const t = xe(this, M, ir);
  if (t === 0) return {};
  const i = xe(this, M, ts);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Lo = function(e, t) {
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
Wu = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Uu = function() {
  switch (this.layer.type) {
    case "text":
      return X(this, M, Nu).call(this);
    case "image":
      return X(this, M, ju).call(this);
    case "badges":
      return X(this, M, Ku).call(this);
    default:
      return X(this, M, Vu).call(this);
  }
};
Nu = function() {
  if (this.layer.type !== "text") return h;
  const e = this.layer.style, t = this.resolvedText || X(this, M, Bu).call(this);
  return r`
      <div
        class="text"
        style=${j({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${Fa(e.fontKey)}, sans-serif`,
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
Bu = function() {
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
ju = function() {
  if (this.layer.type !== "image") return h;
  const e = this.layer.border;
  return r`
      <div
        class="image"
        style=${j({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
Ku = function() {
  if (this.layer.type !== "badges") return h;
  const { badge: e, label: t, gap: i, maxItems: a, direction: o, wrap: s, rowGap: n } = this.layer, l = o === "horizontal", p = l && s, y = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${j({
    flexDirection: l ? "row" : "column",
    flexWrap: p ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...p ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${se(
    Array.from({ length: Math.max(1, a) }, (S, E) => E),
    (S) => S,
    () => r`
            <div class=${_n({ badge: !0, right: y === "right" })}>
              <div
                class="circle"
                style=${j({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${y === "none" ? h : r`<div
                    class="badge-label"
                    style=${j({
      ...y === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${Fa(t.fontKey)}, sans-serif`,
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
Vu = function() {
  if (this.layer.type !== "rect") return h;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? Zn(i) : e.fill ?? "transparent", o = e.border, s = o ? o.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${j({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: o ? `${s}px solid ${o.colour}` : "none"
    })}>
        </div>
      `;
  const n = Xf(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${j({ clipPath: n, background: o ? o.colour : "transparent" })}>
        <div class="shape-inner" style=${j({ inset: `${s}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
qu = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, o = e.height * this.scale, s = xe(this, M, ts), n = xe(this, M, ir), l = Le(this.layer.position, "x") || Le(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${j({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${o}px`, ...X(this, M, ar).call(this, e) })}>
        <span
          class="tag"
          style=${j(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : h}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? h : r`
              ${se(
    ug,
    (p) => p,
    (p) => r`
                  <span
                    class="handle ${p}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${p}"
                    @pointerdown=${(y) => X(this, M, Lo).call(this, y, p)}>
                  </span>
                `
  )}
              <span class="stalk" style=${j({ height: `${_s}px`, top: `${-_s}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${j({ top: `${-_s}px` })}
                @pointerdown=${(p) => X(this, M, Lo).call(this, p, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${s.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${j({
    left: `${(s.x - e.x) * this.scale}px`,
    top: `${(s.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
Yu = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return r`
      <div
        class="measured"
        style=${j({
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
  A("di-layer-box")
], Ee);
var dg = Object.defineProperty, pg = Object.getOwnPropertyDescriptor, Gu = (e) => {
  throw TypeError(e);
}, or = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? pg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && dg(t, i, o), o;
}, hg = (e, t, i) => t.has(e) || Gu("Cannot " + i), mg = (e, t, i) => t.has(e) ? Gu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), yg = (e, t, i) => (hg(e, t, "access private method"), i), qs, Hu;
let ma = class extends P {
  constructor() {
    super(...arguments), mg(this, qs), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${se(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => yg(this, qs, Hu).call(this, e)
    )}`;
  }
};
qs = /* @__PURE__ */ new WeakSet();
Hu = function(e) {
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
or([
  f({ type: Array })
], ma.prototype, "guides", 2);
or([
  f({ type: Number })
], ma.prototype, "scale", 2);
ma = or([
  A("di-guides")
], ma);
var fg = Object.defineProperty, gg = Object.getOwnPropertyDescriptor, Xu = (e) => {
  throw TypeError(e);
}, La = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? gg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && fg(t, i, o), o;
}, vg = (e, t, i) => t.has(e) || Xu("Cannot " + i), bg = (e, t, i) => t.has(e) ? Xu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ql = (e, t, i) => (vg(e, t, "access private method"), i), oo, Ys;
let Q = class extends P {
  constructor() {
    super(...arguments), bg(this, oo), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    ql(this, oo, Ys).call(this, "top"), ql(this, oo, Ys).call(this, "left");
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
oo = /* @__PURE__ */ new WeakSet();
Ys = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, o = a * this.scale, s = window.devicePixelRatio || 1;
  t.width = (e === "top" ? o : Q.thickness) * s, t.height = (e === "top" ? Q.thickness : o) * s, t.style.width = `${e === "top" ? o : Q.thickness}px`, t.style.height = `${e === "top" ? Q.thickness : o}px`, i.setTransform(s, 0, 0, s, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const p = Math.round(l * this.scale) + 0.5, y = l % 100 === 0, S = y ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(p, Q.thickness - S), i.lineTo(p, Q.thickness)) : (i.moveTo(Q.thickness - S, p), i.lineTo(Q.thickness, p)), i.stroke(), y && l > 0 && (e === "top" ? i.fillText(String(l), p + 2, 9) : (i.save(), i.translate(9, p - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
Q.thickness = 20;
Q.styles = R`
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
La([
  f({ type: Number })
], Q.prototype, "canvasWidth", 2);
La([
  f({ type: Number })
], Q.prototype, "canvasHeight", 2);
La([
  f({ type: Number })
], Q.prototype, "scale", 2);
La([
  f({ type: Object })
], Q.prototype, "pointer", 2);
Q = La([
  A("di-rulers")
], Q);
var _g = Object.defineProperty, wg = Object.getOwnPropertyDescriptor, Ju = (e) => {
  throw TypeError(e);
}, J = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? wg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && _g(t, i, o), o;
}, sr = (e, t, i) => t.has(e) || Ju("Cannot " + i), D = (e, t, i) => (sr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), W = (e, t, i) => t.has(e) ? Ju("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ne = (e, t, i, a) => (sr(e, t, "write to private field"), t.set(e, i), i), F = (e, t, i) => (sr(e, t, "access private method"), i), Mt, Lt, Xi, ya, Ji, xt, C, nr, Gs, rr, is, lr, Hs, Zu, Qu, cr, ed, td, Xs, so, id, ad, pi, ur, od, sd, Js, Zs, Qs, no, ro, lo, en, tn, an, nd, on, sn, nn, rd;
const $g = 6, ld = 20, Tg = 2, xg = 15, kg = 0.1, Yl = 48, Dg = 16;
let K = class extends P {
  constructor() {
    super(...arguments), W(this, C), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, this._spaceHeld = !1, this._panning = !1, this._offset = { x: 0, y: 0 }, W(this, Mt), W(this, Lt), W(this, Xi, !1), W(this, ya, { x: 0, y: 0 }), W(this, Ji), W(this, xt, /* @__PURE__ */ new Map()), W(this, Xs, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = F(this, C, lr).call(this, t), a = F(this, C, Hs).call(this, t), o = F(this, C, Zu).call(this, t), s = F(this, C, is).call(this, e.detail.startX, e.detail.startY);
      Ne(this, Mt, {
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
    }), W(this, so, (e) => {
      var ne, dt;
      F(this, C, od).call(this, e.clientX, e.clientY);
      const t = D(this, Lt);
      if (t) {
        if (e.pointerId !== t.pointerId) return;
        F(this, C, Zs).call(this, t.startOffset.x + e.clientX - t.startX, t.startOffset.y + e.clientY - t.startY);
        return;
      }
      const i = D(this, Mt);
      if (!i) return;
      const a = this.template.layers.find((Ni) => Ni.key === i.key);
      if (!a) return;
      const o = (e.clientX - i.startClientX) / this.scale, s = (e.clientY - i.startClientY) / this.scale;
      if (!i.moved && Math.abs(o) < 1 && Math.abs(s) < 1) return;
      if (i.moved = !0, i.handle === "rotate") {
        F(this, C, ad).call(this, a, i, e);
        return;
      }
      const n = Le(a.position, "x"), l = Le(a.position, "y"), p = i.startRotation, y = e.shiftKey || a.type === "rect" && a.lockAspect === !0;
      if (i.handle && p !== 0) {
        F(this, C, id).call(this, a, i, i.handle, o, s, y, n, l);
        return;
      }
      let S = i.handle ? F(this, C, ur).call(this, i.startBox, i.handle, o, s, y) : { ...i.startBox, x: i.startBox.x + o, y: i.startBox.y + s };
      n && (S = { ...S, x: i.startBox.x, width: (ne = i.handle) != null && ne.includes("w") ? i.startBox.width : S.width }), l && (S = { ...S, y: i.startBox.y, height: (dt = i.handle) != null && dt.includes("n") ? i.startBox.height : S.height });
      const E = { x: i.startExtent.x - i.startBox.x, y: i.startExtent.y - i.startBox.y }, L = p !== 0 ? { x: S.x + E.x, y: S.y + E.y, width: i.startExtent.width, height: i.startExtent.height } : S, ue = this.snapEnabled && !e.altKey ? sg(L, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((Ni) => Ni.key !== a.key).map((Ni) => F(this, C, Hs).call(this, Ni)),
        threshold: $g / this.scale,
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
      const ve = p !== 0 ? { ...S, x: ue.box.x - E.x, y: ue.box.y - E.y } : ue.box, Ot = om(ve, a.position);
      n && (Ot.x = a.position.x), l && (Ot.y = a.position.y);
      const Ui = { position: Ot };
      i.handle && (Ui.size = {
        width: Math.max(1, Math.round(ve.width)),
        height: Math.max(1, Math.round(ve.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: a.key, patch: Ui } })
      );
    }), W(this, pi, (e) => {
      if (D(this, Lt)) {
        if (e.pointerId !== D(this, Lt).pointerId) return;
        Ne(this, Lt, void 0), this._panning = !1;
        return;
      }
      if (!D(this, Mt)) return;
      const t = D(this, Mt).moved;
      Ne(this, Mt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: t } }));
    }), W(this, Js, {
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
          Ne(this, Lt, {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            startOffset: { ...this._offset }
          }), this._panning = !0;
        }
      }
    }), W(this, Qs, (e) => {
      e.button === 1 && e.preventDefault();
    }), W(this, no, (e) => {
      e.key !== " " || !D(this, Xi) || Fu(e) || (e.preventDefault(), !e.repeat && (this._spaceHeld = !0));
    }), W(this, ro, (e) => {
      e.key !== " " || !this._spaceHeld || (e.preventDefault(), this._spaceHeld = !1);
    }), W(this, lo, () => {
      this._spaceHeld = !1;
    }), W(this, en, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), W(this, tn, () => {
      this._dropTarget = !1;
    }), W(this, an, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = F(this, C, rr).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: F(this, C, nd).call(this, e) }
        })
      );
    }), W(this, on, (e) => {
      if (e.preventDefault(), !e.ctrlKey && !e.metaKey) {
        const i = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? Dg : 1;
        let a = e.deltaX * i, o = e.deltaY * i;
        e.shiftKey && a === 0 && ([a, o] = [o, 0]), F(this, C, Zs).call(this, this._offset.x - a, this._offset.y - o);
        return;
      }
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), W(this, sn, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Rc(t.position)) && this.requestUpdate();
    }), W(this, nn, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), Ne(this, Ji, new ResizeObserver(() => F(this, C, Gs).call(this))), D(this, Ji).observe(this), window.addEventListener("pointermove", D(this, so)), window.addEventListener("pointerup", D(this, pi)), window.addEventListener("pointercancel", D(this, pi)), window.addEventListener("keydown", D(this, no)), window.addEventListener("keyup", D(this, ro)), window.addEventListener("blur", D(this, lo));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = D(this, Ji)) == null || e.disconnect(), window.removeEventListener("pointermove", D(this, so)), window.removeEventListener("pointerup", D(this, pi)), window.removeEventListener("pointercancel", D(this, pi)), window.removeEventListener("keydown", D(this, no)), window.removeEventListener("keyup", D(this, ro)), window.removeEventListener("blur", D(this, lo));
  }
  willUpdate(e) {
    if (!e.has("zoom") && !e.has("_fitScale")) return;
    if (e.has("zoom") && this.zoom === void 0) {
      this._offset = { x: 0, y: 0 };
      return;
    }
    const t = e.has("zoom") ? e.get("zoom") : this.zoom, i = e.has("_fitScale") ? e.get("_fitScale") : this._fitScale, a = t ?? i;
    if (!a || a === this.scale) return;
    const o = this.scale / a;
    this._offset = { x: this._offset.x * o, y: this._offset.y * o };
  }
  /** Puts the canvas back in the middle of the view, for Fit when it is already at fit. */
  recentre() {
    this._offset = { x: 0, y: 0 };
  }
  updated(e) {
    F(this, C, Gs).call(this), e.has("zoom") && F(this, C, nr).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = D(this, xt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return h;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((s) => [s.key, s]));
    F(this, C, Qu).call(this);
    const o = this.showRulers ? ld : 0;
    return Ne(this, ya, this._offset), r`
      <div
        class=${_n({
      viewport: !0,
      "drop-target": this._dropTarget,
      "pan-ready": this._spaceHeld,
      panning: this._panning
    })}
        @pointerdown=${D(this, Js)}
        @mousedown=${D(this, Qs)}
        @pointerenter=${() => {
      Ne(this, Xi, !0);
    }}
        @pointerleave=${() => {
      Ne(this, Xi, !1);
    }}
        @wheel=${D(this, on)}
        @dragover=${D(this, en)}
        @dragleave=${D(this, tn)}
        @drop=${D(this, an)}
        @di-layer-drag-start=${D(this, Xs)}
        @di-layer-box-resize=${D(this, sn)}>
        <div
          class="artboard"
          style=${j({
      width: `${t + o}px`,
      height: `${i + o}px`,
      "--di-gutter": `${o}px`,
      transform: `translate(${this._offset.x}px, ${this._offset.y}px)`
    })}>
          ${this.showRulers ? r`<di-rulers
                .canvasWidth=${e.width}
                .canvasHeight=${e.height}
                .scale=${this.scale}
                .pointer=${this._pointer}>
              </di-rulers>` : h}

          <div
            class="stage"
            style=${j({
      background: e.backgroundGradient ? Zn(e.backgroundGradient) : e.background
    })}
            @pointerdown=${D(this, nn)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${j({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : h}

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
                  .resolvedPosition=${(l = D(this, xt).get(s.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? F(this, C, rd).call(this) : h}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
Mt = /* @__PURE__ */ new WeakMap();
Lt = /* @__PURE__ */ new WeakMap();
Xi = /* @__PURE__ */ new WeakMap();
ya = /* @__PURE__ */ new WeakMap();
Ji = /* @__PURE__ */ new WeakMap();
xt = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakSet();
nr = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Gs = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? ld : 0) + Tg, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, F(this, C, nr).call(this));
};
rr = function(e, t) {
  const i = F(this, C, is).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
is = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
lr = function(e) {
  const t = D(this, xt).get(e.key);
  if (t) return t.box;
  const i = F(this, C, cr).call(this, e), a = Zo(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Hs = function(e) {
  const t = D(this, xt).get(e.key);
  return t ? t.extent : Pc(F(this, C, lr).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Zu = function(e) {
  var t;
  return ((t = D(this, xt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Qu = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  Ne(this, xt, um(
    this.template.layers,
    (i) => F(this, C, cr).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
cr = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? F(this, C, ed).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? F(this, C, td).call(this, e, i)
  };
};
ed = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
td = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Xs = /* @__PURE__ */ new WeakMap();
so = /* @__PURE__ */ new WeakMap();
id = function(e, t, i, a, o, s, n, l) {
  const p = t.startRotation, y = t.startPosition, S = sm(a, o, 0, 0, p);
  let E = F(this, C, ur).call(this, t.startBox, i, S.x, S.y, s);
  n && (E = { ...E, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : E.width }), l && (E = { ...E, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : E.height });
  const L = Math.max(1, Math.round(E.width)), Ae = Math.max(1, Math.round(E.height)), ue = Sn(E.x, E.y, L, Ae, y.anchor), ve = hi(ue.x, ue.y, y.x, y.y, p), Ot = {
    ...e.position,
    x: n ? e.position.x : Math.round(ve.x),
    y: l ? e.position.y : Math.round(ve.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Ot, size: { width: L, height: Ae } } }
    })
  );
};
ad = function(e, t, i) {
  const a = t.startPosition, o = F(this, C, is).call(this, i.clientX, i.clientY), n = (Math.atan2(o.y - a.y, o.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, p = i.shiftKey ? xg : kg, y = Fc(Math.round(l / p) * p);
  this._guides = [], y !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: y } }
    })
  );
};
pi = /* @__PURE__ */ new WeakMap();
ur = function(e, t, i, a, o) {
  let { x: s, y: n, width: l, height: p } = e;
  if (t.includes("w") && (s = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, p = e.height - a), t.includes("s") && (p = e.height + a), o && e.width > 0 && e.height > 0) {
    const y = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(p - e.height) ? p = l / y : l = p * y, t.includes("n") && (n = e.y + e.height - p), t.includes("w") && (s = e.x + e.width - l);
  }
  return { x: s, y: n, width: Math.max(4, l), height: Math.max(4, p) };
};
od = function(e, t) {
  var s, n, l;
  const i = (s = this.template) == null ? void 0 : s.canvas, a = i ? F(this, C, rr).call(this, e, t) : void 0, o = i && a && a.x >= 0 && a.y >= 0 && a.x <= i.width && a.y <= i.height ? a : void 0;
  (o == null ? void 0 : o.x) === ((n = this._pointer) == null ? void 0 : n.x) && (o == null ? void 0 : o.y) === ((l = this._pointer) == null ? void 0 : l.y) || (this._pointer = o);
};
sd = function() {
  return this.renderRoot.querySelector(".viewport");
};
Js = /* @__PURE__ */ new WeakMap();
Zs = function(e, t) {
  var o, s;
  const i = (o = F(this, C, sd).call(this)) == null ? void 0 : o.getBoundingClientRect(), a = (s = this.renderRoot.querySelector(".artboard")) == null ? void 0 : s.getBoundingClientRect();
  if (i && a) {
    const n = a.left - D(this, ya).x, l = a.top - D(this, ya).y, p = Math.min(Yl, a.width), y = Math.min(Yl, a.height);
    e = Math.min(Math.max(e, i.left + p - (n + a.width)), i.right - p - n), t = Math.min(Math.max(t, i.top + y - (l + a.height)), i.bottom - y - l);
  }
  e === this._offset.x && t === this._offset.y || (this._offset = { x: e, y: t });
};
Qs = /* @__PURE__ */ new WeakMap();
no = /* @__PURE__ */ new WeakMap();
ro = /* @__PURE__ */ new WeakMap();
lo = /* @__PURE__ */ new WeakMap();
en = /* @__PURE__ */ new WeakMap();
tn = /* @__PURE__ */ new WeakMap();
an = /* @__PURE__ */ new WeakMap();
nd = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
on = /* @__PURE__ */ new WeakMap();
sn = /* @__PURE__ */ new WeakMap();
nn = /* @__PURE__ */ new WeakMap();
rd = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${j({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
K.styles = R`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }

    .viewport {
      width: 100%;
      height: 100%;
      /* Not a scroll container at all: the view moves by the artboard's translate, so there are
         no scrollbars to flicker and no edge a pan stops at. Clip rather than hidden, so nothing
         (a focused layer box, say) can scroll it behind the translate's back either. */
      overflow: clip;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      /* The bare checkerboard is a handle for the view. */
      cursor: grab;
      ${er}
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
J([
  f({ type: Object })
], K.prototype, "template", 2);
J([
  f({ type: String })
], K.prototype, "selectedLayerKey", 2);
J([
  f({ type: Object })
], K.prototype, "baseImageUrl", 2);
J([
  f({ type: Array })
], K.prototype, "serverBounds", 2);
J([
  f({ type: Boolean })
], K.prototype, "showMeasured", 2);
J([
  f({ type: Boolean })
], K.prototype, "snapEnabled", 2);
J([
  f({ type: Boolean })
], K.prototype, "showRulers", 2);
J([
  f({ type: Boolean })
], K.prototype, "showSafeArea", 2);
J([
  f({ type: Number })
], K.prototype, "zoom", 2);
J([
  m()
], K.prototype, "_fitScale", 2);
J([
  m()
], K.prototype, "_guides", 2);
J([
  m()
], K.prototype, "_pointer", 2);
J([
  m()
], K.prototype, "_dropTarget", 2);
J([
  m()
], K.prototype, "_spaceHeld", 2);
J([
  m()
], K.prototype, "_panning", 2);
J([
  m()
], K.prototype, "_offset", 2);
K = J([
  A("di-designer-canvas")
], K);
var Sg = Object.defineProperty, Eg = Object.getOwnPropertyDescriptor, cd = (e) => {
  throw TypeError(e);
}, dr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Eg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Sg(t, i, o), o;
}, ud = (e, t, i) => t.has(e) || cd("Cannot " + i), Ig = (e, t, i) => (ud(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Og = (e, t, i) => t.has(e) ? cd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _e = (e, t, i) => (ud(e, t, "access private method"), i), ae, dd, pr, hr, pd, hd, md, yd, sa;
const Gl = {
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
let fa = class extends P {
  constructor() {
    super(...arguments), Og(this, ae), this.properties = [], this._search = "";
  }
  render() {
    const e = Cg(Ig(this, ae, dd));
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

        ${_e(this, ae, hd).call(this)}

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : se(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => _e(this, ae, pd).call(this, t, i)
    )}
      </div>
    `;
  }
};
ae = /* @__PURE__ */ new WeakSet();
dd = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
pr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
hr = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
pd = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${se(
    t,
    (i) => i.alias,
    (i) => _e(this, ae, sa).call(
      this,
      i.name,
      Gl[i.classification] ?? Gl.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
hd = function() {
  return r`
      <div class="group">
        <h5>Elements</h5>
        ${_e(this, ae, sa).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${_e(this, ae, sa).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${_e(this, ae, sa).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${_e(this, ae, md).call(this)}
      </div>
    `;
};
md = function() {
  const e = { kind: "static", layerType: "rect", preset: "rectangle" };
  return r`
      <div
        class="chip other shape"
        draggable="true"
        title="Shape"
        @dragstart=${(t) => _e(this, ae, hr).call(this, t, e)}>
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
          ${Jh.map((t) => r`
            <uui-menu-item
              label=${ca[t].label}
              data-preset=${t}
              @click-label=${() => _e(this, ae, yd).call(this, t)}>
              <uui-icon slot="icon" name=${ca[t].icon}></uui-icon>
            </uui-menu-item>
          `)}
        </div>
      </uui-popover-container>
    `;
};
yd = function(e) {
  var t, i, a;
  (a = (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#shape-menu")) == null ? void 0 : i.hidePopover) == null || a.call(i), _e(this, ae, pr).call(this, { kind: "static", layerType: "rect", preset: e });
};
sa = function(e, t, i, a, o) {
  const s = o ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${s}
        @dragstart=${(n) => _e(this, ae, hr).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${s}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${o ?? `Add ${e} to the canvas`}
          @click=${() => _e(this, ae, pr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
fa.styles = R`
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
dr([
  f({ type: Array })
], fa.prototype, "properties", 2);
dr([
  m()
], fa.prototype, "_search", 2);
fa = dr([
  A("di-property-palette")
], fa);
function Cg(e) {
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
function Ag(e) {
  return e.backgroundGradient ? "gradient" : Fg(e.background) ? "transparent" : "colour";
}
function Fg(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function Pg(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((o) => o + o).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var Rg = Object.defineProperty, Mg = Object.getOwnPropertyDescriptor, fd = (e) => {
  throw TypeError(e);
}, mr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Mg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Rg(t, i, o), o;
}, Lg = (e, t, i) => t.has(e) || fd("Cannot " + i), zg = (e, t, i) => t.has(e) ? fd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Hl = (e, t, i) => (Lg(e, t, "access private method"), i), co, rn;
let ga = class extends P {
  constructor() {
    super(...arguments), zg(this, co), this.value = "#FFFFFF", this.label = "Colour";
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
          @change=${Hl(this, co, rn)}></uui-color-picker>
        <uui-input
          label="${this.label} (hex)"
          spellcheck="false"
          .value=${this.value}
          @change=${Hl(this, co, rn)}></uui-input>
      </div>
    `;
  }
};
co = /* @__PURE__ */ new WeakSet();
rn = function(e) {
  e.stopPropagation();
  const t = Xl(e.target.value);
  !t || t === Xl(this.value) || (this.value = t, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: t } })));
};
ga.styles = R`
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
mr([
  f({ type: String })
], ga.prototype, "value", 2);
mr([
  f({ type: String })
], ga.prototype, "label", 2);
ga = mr([
  A("di-colour-input")
], ga);
function Xl(e) {
  const t = (e ?? "").trim(), i = t.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(i) || ![3, 4, 6, 8].includes(i.length)) return t;
  const o = (i.length <= 4 ? [...i].map((s) => s + s).join("") : i).toUpperCase();
  return o.length === 8 && o.endsWith("FF") ? `#${o.slice(0, 6)}` : `#${o}`;
}
var Wg = Object.defineProperty, Ug = Object.getOwnPropertyDescriptor, gd = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ug(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Wg(t, i, o), o;
};
const Jl = {
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
let zo = class extends P {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${se(
      Ac,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Jl[e]}
              title=${Jl[e]}
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
zo.styles = R`
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
gd([
  f({ type: String })
], zo.prototype, "value", 2);
zo = gd([
  A("di-anchor-picker")
], zo);
var Ng = Object.defineProperty, Bg = Object.getOwnPropertyDescriptor, vd = (e) => {
  throw TypeError(e);
}, rt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Bg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Ng(t, i, o), o;
}, jg = (e, t, i) => t.has(e) || vd("Cannot " + i), Kg = (e, t, i) => t.has(e) ? vd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Vg = (e, t, i) => (jg(e, t, "access private method"), i), ln, bd;
let Ie = class extends P {
  constructor() {
    super(...arguments), Kg(this, ln), this.label = "", this.suffix = "px", this.step = 1, this.compact = !1, this.placeholder = "Auto";
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
          @change=${Vg(this, ln, bd)} />
        ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : h}
      </span>
    `;
    return !this.label || this.compact ? e : r`<umb-property-layout orientation="vertical" label=${this.label}>${e}</umb-property-layout>`;
  }
};
ln = /* @__PURE__ */ new WeakSet();
bd = function(e) {
  const t = e.target, i = t.value, a = Jf(i, this.min, this.max);
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
  A("di-number-field")
], Ie);
var qg = Object.defineProperty, Yg = Object.getOwnPropertyDescriptor, _d = (e) => {
  throw TypeError(e);
}, ri = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Yg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && qg(t, i, o), o;
}, Gg = (e, t, i) => t.has(e) || _d("Cannot " + i), Hg = (e, t, i) => t.has(e) ? _d("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (Gg(e, t, "access private method"), i), u, b, be, wd, $d, Td, yr, xd, kd, Dd, cn, Sd, Ed, Id, Od, Cd, Ad, un, Fd, Pd, dn, Rd, uo, Md, Ld, fr, ze, zi, zd, gr, Wd;
const Xg = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let et = class extends P {
  constructor() {
    super(...arguments), Hg(this, u), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? d(this, u, Sd).call(this, this.layer) : d(this, u, wd).call(this)}</div>` : h;
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
wd = function() {
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

        ${d(this, u, $d).call(this, e)}

        <umb-property-layout orientation="vertical" label="Base image">

          <div slot="editor" class="editor">
          <uui-select
            label="Base image source"
            .value=${e.baseImage.kind}
            .options=${Ud(e.baseImage.kind)}
            @change=${(t) => d(this, u, be).call(this, {
    baseImage: { ...e.baseImage, kind: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.baseImage.kind === "media" ? d(this, u, ze).call(this, "Media item", d(this, u, fr).call(this, e.baseImage.mediaKey, (t) => d(this, u, be).call(this, { baseImage: { ...e.baseImage, kind: "media", mediaKey: t } }))) : h}

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
              ${d(this, u, zi).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, be).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.baseImageFit}
            .options=${Y(["cover", "contain", "stretch"], e.baseImageFit)}
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
$d = function(e) {
  const t = Ag(e);
  return r`
      <umb-property-layout orientation="vertical" label="Fill">

        <div slot="editor" class="editor">
        <uui-select
          .value=${t}
          .options=${Y(["colour", "gradient", "transparent"], t)}
          @change=${(i) => d(this, u, Td).call(this, e, i.target.value)}>
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

      ${t === "gradient" && e.backgroundGradient ? d(this, u, yr).call(this, e.backgroundGradient, (i) => d(this, u, be).call(this, { backgroundGradient: i })) : h}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : h}
    `;
};
Td = function(e, t) {
  if (t === "gradient") {
    d(this, u, be).call(this, { backgroundGradient: e.backgroundGradient ?? Cc() });
    return;
  }
  d(this, u, be).call(this, {
    background: Pg(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
yr = function(e, t) {
  const i = e.kind ?? "linear", a = i === "linear" || i === "reflected" || i === "angular", o = i === "radial" || i === "angular" || i === "diamond";
  return r`
      ${d(this, u, ze).call(this, "Gradient type", r`
        <uui-select
          label="Gradient type"
          .value=${i}
          .options=${Y(["linear", "radial", "angular", "diamond", "reflected"], i, Jg)}
          @change=${(s) => t({ ...e, kind: s.target.value })}>
        </uui-select>
      `)}

      <div class="gradient-preview" role="img" aria-label="The gradient" style="background: ${Zn(e)}"></div>

      ${a ? d(this, u, xd).call(this, e, t) : h}
      ${i === "radial" ? d(this, u, kd).call(this, e, t) : h}
      ${o ? r`
            ${d(this, u, cn).call(this, "Centre X", e.centreX, (s) => t({ ...e, centreX: s }))}
            ${d(this, u, cn).call(this, "Centre Y", e.centreY, (s) => t({ ...e, centreY: s }))}
          ` : h}

      ${d(this, u, Dd).call(this, e, t)}
    `;
};
xd = function(e, t) {
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
          ${Qg.map(([o, s, n]) => r`
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
kd = function(e, t) {
  const i = e.shape ?? "ellipse", a = e.extent ?? "farthestCorner";
  return r`
      ${d(this, u, ze).call(this, "Shape", r`
        <uui-select
          label="Radial shape"
          .value=${i}
          .options=${Y(["ellipse", "circle"], i)}
          @change=${(o) => t({ ...e, shape: o.target.value })}>
        </uui-select>
      `)}
      ${d(this, u, ze).call(this, "Size", r`
        <uui-select
          label="Radial size"
          .value=${a}
          .options=${Y(["farthestCorner", "farthestSide", "closestCorner", "closestSide"], a, Zg)}
          @change=${(o) => t({ ...e, extent: o.target.value })}>
        </uui-select>
      `, "Where the last colour lands.")}
    `;
};
Dd = function(e, t) {
  const i = Dt(e);
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
                @click=${() => t(ag(e, o))}>
                <uui-icon name="icon-trash"></uui-icon>
              </uui-button>
            </div>
          </div>
        `)}
        <div class="stop-actions">
          <uui-button look="secondary" label="Add stop" @click=${() => t(ig(e))}>
            <uui-icon name="icon-add"></uui-icon> Add stop
          </uui-button>
          <uui-button look="secondary" label="Reverse the gradient" @click=${() => t(tg(e))}>
            <uui-icon name="icon-sync"></uui-icon> Reverse
          </uui-button>
        </div>
      </div>
    `);
};
cn = function(e, t, i) {
  return r`<di-number-field
      .min=${v.gradientCentre.min * 100}
      .max=${v.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
Sd = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, Ed).call(this, e) : h}
      ${e.type === "text" ? d(this, u, Id).call(this, e) : h}
      ${e.type === "image" ? d(this, u, Od).call(this, e) : h}
      ${e.type === "badges" ? d(this, u, Cd).call(this, e) : h}
      ${e.type === "rect" ? d(this, u, Fd).call(this, e) : h}
      ${d(this, u, Pd).call(this, e)} ${d(this, u, Ld).call(this, e)}
    `;
};
Ed = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${Y(
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

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? d(this, u, ze).call(this, "Property", d(this, u, zi).call(this, t.propertyAlias ?? "", (i) => d(this, u, b).call(this, { binding: { ...t, propertyAlias: i } }))) : h}

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
Id = function(e) {
  const t = e.style, i = (a) => d(this, u, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <umb-property-layout orientation="vertical" label="Font">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, gr).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${d(this, u, Wd).call(this, t.fontKey, t.styleName ?? "", (a, o, s) => i({ styleName: a || null, fontSize: o ?? t.fontSize, fontStyle: s ?? t.fontStyle }))}

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
              .options=${Y(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${Y(["left", "centre", "right"], t.textAlign)}
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
              .options=${Y(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${Y(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
Od = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${Ud(t.kind)}
            @change=${(a) => d(this, u, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" ? d(this, u, ze).call(this, "Property", d(this, u, zi).call(
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

        ${t.kind === "media" ? d(this, u, ze).call(this, "Media item", d(this, u, fr).call(this, t.mediaKey, (a) => d(this, u, b).call(this, { source: { ...t, kind: "media", mediaKey: a } }))) : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.fit}
            .options=${Y(["cover", "contain", "stretch"], e.fit)}
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
Cd = function(e) {
  const t = (o) => d(this, u, b).call(this, { badge: { ...e.badge, ...o } }), i = (o) => d(this, u, b).call(this, { label: { ...e.label, ...o } }), a = (o) => d(this, u, b).call(this, { icon: { ...e.icon, ...o } });
  return r`
      <uui-box headline="Badges">
        <umb-property-layout orientation="vertical" label="Items from">

          <div slot="editor" class="editor">
          ${d(this, u, zi).call(this, e.itemsPropertyAlias, (o) => d(this, u, b).call(this, { itemsPropertyAlias: o }))}
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
            .options=${Y(["horizontal", "vertical"], e.direction)}
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
            .options=${Y(["below", "right", "none"], e.label.position, {
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
                  .options=${d(this, u, gr).call(this, e.label.fontKey)}
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
                  .options=${Y(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(o) => i({ textTransform: o.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>
            `}
      </uui-box>
    `;
};
Ad = function(e, t) {
  if (t === "circle") {
    const a = e.size.width ?? e.size.height ?? 200;
    d(this, u, b).call(this, { shape: "ellipse", lockAspect: !0, size: { ...e.size, width: a, height: a } });
    return;
  }
  const i = pn(e) === "circle";
  d(this, u, b).call(this, {
    shape: t,
    ...i ? { lockAspect: !1 } : {}
  });
};
un = function(e, t, i) {
  const a = e.type === "rect" && e.lockAspect === !0, { width: o, height: s } = e.size;
  if (!a || i === null || !o || !s) {
    d(this, u, b).call(this, { size: { ...e.size, [t]: i } });
    return;
  }
  const n = t === "width" ? { width: i, height: Math.round(i * s / o) } : { width: Math.round(i * o / s), height: i };
  d(this, u, b).call(this, { size: n });
};
Fd = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <umb-property-layout orientation="vertical" label="Shape">

          <div slot="editor" class="editor">
          <uui-select
            .value=${pn(e)}
            .options=${Y(["rectangle", "circle", "ellipse", "polygon", "star"], pn(e))}
            @change=${(o) => d(this, u, Ad).call(this, e, o.target.value)}>
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
    gradient: o.target.checked ? Cc() : null
  })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${e.gradient ? d(this, u, yr).call(this, e.gradient, (o) => d(this, u, b).call(this, { gradient: o })) : h}

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
Pd = function(e) {
  const t = Le(e.position, "x"), i = Le(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${d(this, u, dn).call(this, e, "x")} ${d(this, u, dn).call(this, e, "y")}

        <umb-property-layout orientation="vertical" label="Anchor">

          <div slot="editor" class="editor">
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(o) => d(this, u, Md).call(this, e, o.detail.value)}>
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
            @change=${(o) => d(this, u, b).call(this, { rotation: Fc(o.detail.value ?? 0) })}>
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
            @change=${(o) => d(this, u, un).call(this, e, "width", o.detail.value)}>
          </di-number-field>
          <di-number-field
            .min=${v.height.min}
            .max=${v.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(o) => d(this, u, un).call(this, e, "height", o.detail.value)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
dn = function(e, t) {
  const i = Le(e.position, t), a = _o(e.position, t), o = this.template.layers.filter((n) => n.key !== e.key), s = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => d(this, u, Rd).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => d(this, u, uo).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${Y(s, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => d(this, u, uo).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </div>

              </umb-property-layout>

              <di-number-field
                .min=${v.referenceGap.min}
                .max=${v.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => d(this, u, uo).call(this, e, t, { gap: n.detail.value ?? 0 })}>
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
Rd = function(e, t, i) {
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
        gap: nm
      }
    }
  });
};
uo = function(e, t, i) {
  const a = _o(e.position, t);
  a && d(this, u, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Md = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, o = i > 0 && a > 0 ? am(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, b).call(this, { position: o });
};
Ld = function(e) {
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
            .options=${Y(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
              ${d(this, u, zi).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, b).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </div>

            </umb-property-layout>` : h}
      </uui-box>
    `;
};
fr = function(e, t) {
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
zi = function(e, t, i = {}) {
  const a = pm(e), o = [];
  for (let s = 0; s <= Is; s++) {
    const n = Wr(a, s), l = s === 0 ? this.properties : this.linkedProperties[n] ?? [], p = a[s] ?? "";
    if (s > 0) {
      const E = (s === 1 ? this.properties : this.linkedProperties[Wr(a, s - 1)] ?? []).some(
        (L) => L.alias === a[s - 1] && L.classification === "content"
      );
      if (!a[s - 1] || !E && !p) break;
    }
    const y = d(this, u, zd).call(this, Xg(l, s === 0 ? i.root : i.tail), p, (S) => t([...a.slice(0, s), S].filter(Boolean).join(".")));
    o.push(s === 0 ? y : r`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[n] ?? "Property on the linked item"}</span>
            ${y}
          </div>`);
  }
  return o.length === 1 ? o[0] : r`<div class="path">${o}</div>`;
};
zd = function(e, t, i) {
  return r`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${gm(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
gr = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
Wd = function(e, t, i) {
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
ri([
  f({ type: Object })
], et.prototype, "template", 2);
ri([
  f({ type: Object })
], et.prototype, "layer", 2);
ri([
  f({ type: Array })
], et.prototype, "properties", 2);
ri([
  f({ type: Object })
], et.prototype, "linkedProperties", 2);
ri([
  f({ type: Object })
], et.prototype, "linkedCaptions", 2);
ri([
  f({ type: Array })
], et.prototype, "fonts", 2);
et = ri([
  A("di-layer-inspector")
], et);
function Y(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
const Jg = {
  linear: "Linear",
  radial: "Radial",
  angular: "Angular (conic)",
  diamond: "Diamond",
  reflected: "Reflected"
}, Zg = {
  farthestCorner: "Farthest corner",
  farthestSide: "Farthest side",
  closestCorner: "Closest corner",
  closestSide: "Closest side"
}, Qg = [
  ["↑", 0, "Upwards (0°)"],
  ["→", 90, "To the right (90°)"],
  ["↓", 180, "Downwards (180°)"],
  ["←", 270, "To the left (270°)"]
];
function Ud(e) {
  return Y(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
function pn(e) {
  const t = e.shape ?? "rectangle";
  return t === "ellipse" && e.lockAspect === !0 ? "circle" : t;
}
var ev = Object.defineProperty, tv = Object.getOwnPropertyDescriptor, Nd = (e) => {
  throw TypeError(e);
}, Wi = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? tv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && ev(t, i, o), o;
}, iv = (e, t, i) => t.has(e) || Nd("Cannot " + i), av = (e, t, i) => t.has(e) ? Nd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Te = (e, t, i) => (iv(e, t, "access private method"), i), he, Wt, Bd, jd, Kd, Vd, qd;
const ov = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let St = class extends P {
  constructor() {
    super(...arguments), av(this, he), this.layers = [], this.expanded = !1;
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Te(this, he, Kd)}>
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

        ${this.expanded ? Te(this, he, Vd).call(this, e) : h}
      </div>
    `;
  }
};
he = /* @__PURE__ */ new WeakSet();
Wt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Bd = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
jd = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Kd = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Te(this, he, Wt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Vd = function(e) {
  return r`
        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : se(
    e,
    (t) => t.key,
    (t, i) => Te(this, he, qd).call(this, t, i)
  )}

        <div class="row background">
          <uui-icon name="icon-picture"></uui-icon>
          <span class="name">Background</span>
          <uui-icon name="icon-lock" title="The base image and canvas fill are edited in the inspector"></uui-icon>
        </div>
    `;
};
qd = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Te(this, he, Bd).call(this, a, e.key)}
        @dragover=${(a) => Te(this, he, jd).call(this, a, t)}
        @click=${() => Te(this, he, Wt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${ov[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Te(this, he, Wt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Te(this, he, Wt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Te(this, he, Wt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Te(this, he, Wt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
St.styles = R`
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
Wi([
  f({ type: Array })
], St.prototype, "layers", 2);
Wi([
  f({ type: String })
], St.prototype, "selectedLayerKey", 2);
Wi([
  f({ type: Boolean, reflect: !0 })
], St.prototype, "expanded", 2);
Wi([
  m()
], St.prototype, "_dragKey", 2);
Wi([
  m()
], St.prototype, "_dropIndex", 2);
St = Wi([
  A("di-layers-panel")
], St);
var sv = Object.defineProperty, nv = Object.getOwnPropertyDescriptor, Yd = (e) => {
  throw TypeError(e);
}, lt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? nv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && sv(t, i, o), o;
}, vr = (e, t, i) => t.has(e) || Yd("Cannot " + i), rv = (e, t, i) => (vr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Zl = (e, t, i) => t.has(e) ? Yd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), lv = (e, t, i, a) => (vr(e, t, "write to private field"), t.set(e, i), i), re = (e, t, i) => (vr(e, t, "access private method"), i), Z, Be, Wo, Gd, Hd, Zi;
let Oe = class extends P {
  constructor() {
    super(...arguments), Zl(this, Z), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Zl(this, Wo, 100);
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
              @click=${() => re(this, Z, Be).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
              <uui-icon name="icon-zoom-out"></uui-icon>
            </uui-button>
            <di-number-field
              compact
              class="value"
              label="Zoom"
              suffix="%"
              step="5"
              .min=${Mo.min * 100}
              .max=${Mo.max * 100}
              .value=${re(this, Z, Gd).call(this)}
              @change=${re(this, Z, Hd)}>
            </di-number-field>
            <uui-button
              compact
              look="secondary"
              label="Zoom in"
              @click=${() => re(this, Z, Be).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
              <uui-icon name="icon-zoom-in"></uui-icon>
            </uui-button>
          </div>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => re(this, Z, Be).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${re(this, Z, Zi).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${re(this, Z, Zi).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${re(this, Z, Zi).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${re(this, Z, Zi).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => re(this, Z, Be).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => re(this, Z, Be).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => re(this, Z, Be).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
Z = /* @__PURE__ */ new WeakSet();
Be = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Wo = /* @__PURE__ */ new WeakMap();
Gd = function() {
  return this.matches(":focus-within") || lv(this, Wo, Math.round(this.effectiveScale * 100)), rv(this, Wo);
};
Hd = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && re(this, Z, Be).call(this, "di-zoom-change", { zoom: t / 100 });
};
Zi = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => re(this, Z, Be).call(this, i)}>
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
  A("di-canvas-toolbar")
], Oe);
var cv = Object.defineProperty, uv = Object.getOwnPropertyDescriptor, Xd = (e) => {
  throw TypeError(e);
}, br = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? uv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && cv(t, i, o), o;
}, _r = (e, t, i) => t.has(e) || Xd("Cannot " + i), yi = (e, t, i) => (_r(e, t, "read from private field"), t.get(e)), Xa = (e, t, i) => t.has(e) ? Xd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hn = (e, t, i, a) => (_r(e, t, "write to private field"), t.set(e, i), i), Ql = (e, t, i) => (_r(e, t, "access private method"), i), Li, po, na, ho, Jd, Zd;
let va = class extends P {
  constructor() {
    super(), Xa(this, ho), Xa(this, Li), this._selection = [], Xa(this, po, ""), Xa(this, na), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(Et, (e) => {
      hn(this, Li, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== yi(this, po) && (hn(this, po, i), Ql(this, ho, Jd).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
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
          @change=${Ql(this, ho, Zd)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
Li = /* @__PURE__ */ new WeakMap();
po = /* @__PURE__ */ new WeakMap();
na = /* @__PURE__ */ new WeakMap();
ho = /* @__PURE__ */ new WeakSet();
Jd = async function(e) {
  if (!yi(this, Li)) return;
  yi(this, na) ?? hn(this, na, $c(yi(this, Li).getToken).catch(() => []));
  const t = await yi(this, na), i = new Set(e), a = t.filter((o) => i.has(o.alias)).map((o) => o.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
Zd = function(e) {
  var i;
  const t = e.target.selection;
  (i = yi(this, Li)) == null || i.setSampleContentKey(t[0]);
};
va.styles = R`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
br([
  m()
], va.prototype, "_selection", 2);
br([
  m()
], va.prototype, "_allowedContentTypeIds", 2);
va = br([
  A("di-preview-content-picker")
], va);
var dv = Object.defineProperty, pv = Object.getOwnPropertyDescriptor, Qd = (e) => {
  throw TypeError(e);
}, za = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? pv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && dv(t, i, o), o;
}, wr = (e, t, i) => t.has(e) || Qd("Cannot " + i), ee = (e, t, i) => (wr(e, t, "read from private field"), t.get(e)), Ft = (e, t, i) => t.has(e) ? Qd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Xt = (e, t, i, a) => (wr(e, t, "write to private field"), t.set(e, i), i), Ve = (e, t, i) => (wr(e, t, "access private method"), i), mt, bi, _i, Jt, Uo, No, ke, $r, mo, Tr, mn;
const hv = 400;
let oi = class extends P {
  constructor() {
    super(), Ft(this, ke), Ft(this, mt), Ft(this, bi), Ft(this, _i), Ft(this, Jt), Ft(this, Uo), Ft(this, No, !0), this._loading = !1, this._collapsed = !0, this.consumeContext(Et, (e) => {
      Xt(this, mt, e), e && (this.observe(e.template, (t) => {
        t && Ve(this, ke, mo).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Xt(this, Uo, t);
        const i = (a = ee(this, mt)) == null ? void 0 : a.getData();
        i && Ve(this, ke, mo).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Xt(this, No, t ?? !0);
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
    const e = (t = ee(this, mt)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(ee(this, bi)), this._collapsed = !1, Ve(this, ke, Tr).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(ee(this, bi)), (e = ee(this, _i)) == null || e.abort(), Ve(this, ke, $r).call(this);
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
        const t = (e = ee(this, mt)) == null ? void 0 : e.getData();
        t && Ve(this, ke, mo).call(this, t);
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
mt = /* @__PURE__ */ new WeakMap();
bi = /* @__PURE__ */ new WeakMap();
_i = /* @__PURE__ */ new WeakMap();
Jt = /* @__PURE__ */ new WeakMap();
Uo = /* @__PURE__ */ new WeakMap();
No = /* @__PURE__ */ new WeakMap();
ke = /* @__PURE__ */ new WeakSet();
$r = function() {
  ee(this, Jt) && (URL.revokeObjectURL(ee(this, Jt)), Xt(this, Jt, void 0));
};
mo = function(e) {
  this._collapsed || (window.clearTimeout(ee(this, bi)), Xt(this, bi, window.setTimeout(() => void Ve(this, ke, Tr).call(this, e), hv)));
};
Tr = async function(e) {
  var t;
  if (ee(this, mt)) {
    (t = ee(this, _i)) == null || t.abort(), Xt(this, _i, new AbortController()), Ve(this, ke, mn).call(this, !0), this._error = void 0;
    try {
      const i = await Tc(
        e,
        {
          signal: ee(this, _i).signal,
          contentKey: ee(this, Uo),
          useSampleData: ee(this, No)
        },
        ee(this, mt).getToken
      );
      Ve(this, ke, $r).call(this), Xt(this, Jt, URL.createObjectURL(i)), this._url = ee(this, Jt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ve(this, ke, mn).call(this, !1);
    }
  }
};
mn = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
oi.styles = R`
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
      ${er}
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
za([
  m()
], oi.prototype, "_url", 2);
za([
  m()
], oi.prototype, "_loading", 2);
za([
  m()
], oi.prototype, "_error", 2);
za([
  m()
], oi.prototype, "_collapsed", 2);
oi = za([
  A("di-preview-strip")
], oi);
var mv = Object.defineProperty, yv = Object.getOwnPropertyDescriptor, ep = (e) => {
  throw TypeError(e);
}, G = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? yv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && mv(t, i, o), o;
}, xr = (e, t, i) => t.has(e) || ep("Cannot " + i), x = (e, t, i) => (xr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ui = (e, t, i) => t.has(e) ? ep("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Bo = (e, t, i, a) => (xr(e, t, "write to private field"), t.set(e, i), i), $e = (e, t, i) => (xr(e, t, "access private method"), i), O, ba, _a, wi, B, yn, as, tp, ip, fn, ap, op, sp, gn, np, rp, lp, yo;
const fv = 400;
let z = class extends P {
  constructor() {
    super(), ui(this, B), ui(this, O), ui(this, ba), ui(this, _a), ui(this, wi), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, ui(this, yo, (e) => {
      var o;
      if (Fu(e)) return;
      const t = x(this, O);
      if (!t) return;
      const i = e.ctrlKey || e.metaKey;
      if (i && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? t.redo() : t.undo();
        return;
      }
      const a = x(this, B, yn);
      if (a) {
        if (i && e.key.toLowerCase() === "d") {
          e.preventDefault(), t.duplicateLayer(a.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), $e(this, B, fn).call(this, a.key);
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
    }), this.consumeContext(V, (e) => {
      Bo(this, ba, e);
    }), this.consumeContext(Et, (e) => {
      Bo(this, O, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && ($e(this, B, ap).call(this, t), $e(this, B, op).call(this, t), $e(this, B, sp).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", x(this, yo));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", x(this, yo)), window.clearTimeout(x(this, _a)), (e = x(this, wi)) == null || e.abort();
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
        @di-layer-delete=${(e) => $e(this, B, fn).call(this, e.detail.key)}
        @di-layer-detach=${(e) => $e(this, B, ip).call(this, e.detail.key, e.detail.axis)}
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
        @di-palette-add=${(e) => $e(this, B, gn).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => $e(this, B, gn).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-use-image-size=${$e(this, B, lp)}
        @di-request-preview=${() => {
      var e;
      return (e = x(this, B, tp)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(Mo.min, Math.min(Mo.max, e.detail.zoom));
    }}
        @di-zoom-fit=${() => {
      var e;
      (e = x(this, B, as)) == null || e.recentre(), this._zoom = void 0;
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
            .layer=${x(this, B, yn)}
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
ba = /* @__PURE__ */ new WeakMap();
_a = /* @__PURE__ */ new WeakMap();
wi = /* @__PURE__ */ new WeakMap();
B = /* @__PURE__ */ new WeakSet();
yn = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
as = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
tp = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
ip = function(e, t) {
  var o, s, n;
  const i = (o = this._template) == null ? void 0 : o.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (s = x(this, B, as)) == null ? void 0 : s.resolvedPositionOf(e);
  (n = x(this, O)) == null || n.updateLayer(e, { position: Es(i.position, t, a) });
};
fn = function(e) {
  var i, a, o;
  const t = /* @__PURE__ */ new Map();
  for (const s of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = x(this, B, as)) == null ? void 0 : a.resolvedPositionOf(s.key);
    n && t.set(s.key, n);
  }
  (o = x(this, O)) == null || o.removeLayer(e, t);
};
ap = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && x(this, O) && await Zy(t, x(this, O).getToken);
};
op = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !x(this, O)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await kc(t.mediaKey, x(this, O).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
sp = function() {
  window.clearTimeout(x(this, _a)), Bo(this, _a, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !x(this, O))) {
      (t = x(this, wi)) == null || t.abort(), Bo(this, wi, new AbortController());
      try {
        const i = await xc(
          e,
          { signal: x(this, wi).signal, useSampleData: !0 },
          x(this, O).getToken
        );
        x(this, O).setServerBounds(i.layers), x(this, O).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, fv));
};
gn = function(e, t, i, a) {
  const o = this._template;
  if (!o || !x(this, O)) return;
  const s = { template: o, x: t, y: i, defaultFontKey: $e(this, B, rp).call(this) };
  if (e.kind === "property") {
    const l = em(e.property, s);
    if (l.kind === "condition") {
      $e(this, B, np).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    x(this, O).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? Ic(s, "Image") : e.layerType === "badges" ? Oc(s, "Badges", "") : e.layerType === "rect" ? Zh(s, "Shape", e.preset) : Ec(s, "Text", { kind: "static", text: "Text" });
  x(this, O).addLayer(n);
};
np = function(e, t, i) {
  var s, n, l, p;
  const a = i ?? this._selectedKey, o = (s = this._template) == null ? void 0 : s.layers.find((y) => y.key === a);
  if (!o) {
    (n = x(this, ba)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = x(this, O)) == null || l.updateLayer(o.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (p = x(this, ba)) == null || p.peek("positive", {
    data: { message: `'${o.name}' now shows only when '${t}' is ticked.` }
  });
};
rp = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
lp = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !x(this, O)) return;
  const t = await kc(e.mediaKey, x(this, O).getToken).catch(() => {
  });
  t && x(this, O).updateCanvas({ width: t.width, height: t.height });
};
yo = /* @__PURE__ */ new WeakMap();
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
  A("di-design-view")
], z);
const gv = z, vv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return z;
  },
  default: gv
}, Symbol.toStringTag, { value: "Module" }));
var bv = Object.defineProperty, _v = Object.getOwnPropertyDescriptor, cp = (e) => {
  throw TypeError(e);
}, ct = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? _v(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && bv(t, i, o), o;
}, kr = (e, t, i) => t.has(e) || cp("Cannot " + i), ie = (e, t, i) => (kr(e, t, "read from private field"), t.get(e)), Ki = (e, t, i) => t.has(e) ? cp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), wa = (e, t, i, a) => (kr(e, t, "write to private field"), t.set(e, i), i), pt = (e, t, i) => (kr(e, t, "access private method"), i), Me, $a, $i, Zt, Fe, Dr, fo, up, dp, pp;
let fe = class extends P {
  constructor() {
    super(), Ki(this, Fe), Ki(this, Me), Ki(this, $a), Ki(this, $i), Ki(this, Zt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(V, (e) => {
      wa(this, $a, e);
    }), this.consumeContext(Et, (e) => {
      wa(this, Me, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, pt(this, Fe, fo).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), pt(this, Fe, fo).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ie(this, $i)) == null || e.abort(), pt(this, Fe, Dr).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => pt(this, Fe, fo).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${pt(this, Fe, dp)}>
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
      (e) => pt(this, Fe, pp).call(this, e)
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
                @click=${pt(this, Fe, up)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : h}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
Me = /* @__PURE__ */ new WeakMap();
$a = /* @__PURE__ */ new WeakMap();
$i = /* @__PURE__ */ new WeakMap();
Zt = /* @__PURE__ */ new WeakMap();
Fe = /* @__PURE__ */ new WeakSet();
Dr = function() {
  ie(this, Zt) && (URL.revokeObjectURL(ie(this, Zt)), wa(this, Zt, void 0));
};
fo = async function() {
  var i;
  const e = this._template;
  if (!e || !ie(this, Me)) return;
  (i = ie(this, $i)) == null || i.abort(), wa(this, $i, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: ie(this, $i).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, o] = await Promise.all([
      Tc(e, t, ie(this, Me).getToken),
      xc(e, t, ie(this, Me).getToken)
    ]);
    pt(this, Fe, Dr).call(this), wa(this, Zt, URL.createObjectURL(a)), this._url = ie(this, Zt), this._bounds = o.layers, this._skipped = o.skipped ?? [], ie(this, Me).setServerBounds(o.layers), ie(this, Me).setIssues(o.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
up = async function() {
  var e, t;
  if (!(!this._contentKey || !ie(this, Me))) {
    this._regenerating = !0;
    try {
      const i = await kn(this._contentKey, ie(this, Me).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = ie(this, $a)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = ie(this, $a)) == null || t.peek("danger", {
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
dp = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
pp = function(e) {
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
      ${er}
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
  A("di-preview-view")
], fe);
const wv = fe, $v = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return fe;
  },
  default: wv
}, Symbol.toStringTag, { value: "Module" }));
var Tv = Object.defineProperty, xv = Object.getOwnPropertyDescriptor, hp = (e) => {
  throw TypeError(e);
}, Wa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? xv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Tv(t, i, o), o;
}, Sr = (e, t, i) => t.has(e) || hp("Cannot " + i), te = (e, t, i) => (Sr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ec = (e, t, i) => t.has(e) ? hp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), kv = (e, t, i, a) => (Sr(e, t, "write to private field"), t.set(e, i), i), fi = (e, t, i) => (Sr(e, t, "access private method"), i), ce, me, mp, yp, jo, fp, gp, vp, bp, _p, wp;
let tt = class extends P {
  constructor() {
    super(), ec(this, me), ec(this, ce), this._properties = [], this._showAdvanced = !1, this.consumeContext(Et, (e) => {
      kv(this, ce, e), e && ($c(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${fi(this, me, vp).call(this)} ${fi(this, me, bp).call(this)} ${fi(this, me, _p).call(this)} ${fi(this, me, wp).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
ce = /* @__PURE__ */ new WeakMap();
me = /* @__PURE__ */ new WeakSet();
mp = function() {
  return this._properties.filter((e) => e.classification === "media");
};
yp = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
jo = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
fp = async function(e) {
  var o, s;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((n) => [n.key, n.alias])), a = [
    ...t.map((n) => i.get(n)).filter((n) => !!n),
    ...te(this, me, jo)
  ].filter((n, l, p) => p.indexOf(n) === l);
  (o = te(this, ce)) == null || o.updateTemplateFields({ docTypeAliases: a }), await ((s = te(this, ce)) == null ? void 0 : s.reloadProperties());
};
gp = function(e) {
  var i;
  const t = e.target.selection;
  (i = te(this, ce)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
vp = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? r`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${te(this, me, yp)}
                  @change=${fi(this, me, fp)}></umb-input-document-type>` : r`<uui-loader-bar></uui-loader-bar>`}
            ${te(this, me, jo).length > 0 ? r`<p class="note">
                  Also targets ${te(this, me, jo).join(", ")}, which no document type has any more.
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
    ...te(this, me, mp).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = te(this, ce)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = te(this, ce)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
bp = function() {
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
            @change=${fi(this, me, gp)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = te(this, ce)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = te(this, ce)) == null ? void 0 : i.updateOutput({
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
    return (i = te(this, ce)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
_p = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = te(this, ce)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = te(this, ce)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
wp = function() {
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
    return (i = te(this, ce)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
Wa([
  m()
], tt.prototype, "_template", 2);
Wa([
  m()
], tt.prototype, "_properties", 2);
Wa([
  m()
], tt.prototype, "_showAdvanced", 2);
Wa([
  m()
], tt.prototype, "_documentTypes", 2);
tt = Wa([
  A("di-settings-view")
], tt);
const Dv = tt, Sv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return tt;
  },
  default: Dv
}, Symbol.toStringTag, { value: "Module" }));
var Ev = Object.defineProperty, Iv = Object.getOwnPropertyDescriptor, $p = (e) => {
  throw TypeError(e);
}, Ua = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Iv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Ev(t, i, o), o;
}, Er = (e, t, i) => t.has(e) || $p("Cannot " + i), tc = (e, t, i) => (Er(e, t, "read from private field"), t.get(e)), ic = (e, t, i) => t.has(e) ? $p("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ov = (e, t, i, a) => (Er(e, t, "write to private field"), t.set(e, i), i), ac = (e, t, i) => (Er(e, t, "access private method"), i), Ta, go, vn;
let it = class extends P {
  constructor() {
    super(), ic(this, go), ic(this, Ta), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Et, (e) => {
      Ov(this, Ta, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && ac(this, go, vn).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => ac(this, go, vn).call(this)}>Reload</uui-button>
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
Ta = /* @__PURE__ */ new WeakMap();
go = /* @__PURE__ */ new WeakSet();
vn = async function() {
  const e = this._template;
  if (!(!e || !tc(this, Ta))) {
    this._loading = !0;
    try {
      this._usage = await Vh(e.key, tc(this, Ta).getToken);
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
Ua([
  m()
], it.prototype, "_template", 2);
Ua([
  m()
], it.prototype, "_usage", 2);
Ua([
  m()
], it.prototype, "_loading", 2);
Ua([
  m()
], it.prototype, "_onlyMissing", 2);
it = Ua([
  A("di-usage-view")
], it);
const Cv = it, Av = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return it;
  },
  default: Cv
}, Symbol.toStringTag, { value: "Module" })), Fv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ra,
  default: ra
}, Symbol.toStringTag, { value: "Module" }));
var _t, Gt;
class ws extends Np {
  constructor(i, a) {
    super(i, a);
    k(this, _t);
    k(this, Gt);
    this.consumeContext(V, (o) => {
      _(this, _t, o);
    }), this.consumeContext(Et, (o) => {
      _(this, Gt, o);
    });
  }
  async execute() {
    var o, s, n;
    const i = c(this, Gt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (o = c(this, _t)) == null || o.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await dc(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await Dc(a.key, !1, i.getToken);
        (s = c(this, _t)) == null || s.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await tu(l, i.getToken, c(this, _t));
      } catch (l) {
        (n = c(this, _t)) == null || n.peek("danger", {
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
    c(this, Gt) && await Kh(i, c(this, Gt).getToken);
  }
}
_t = new WeakMap(), Gt = new WeakMap();
const Pv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: ws,
  api: ws,
  default: ws
}, Symbol.toStringTag, { value: "Module" }));
var Sa, Fi;
class $s extends ni {
  constructor(i, a) {
    super(i, a);
    k(this, Sa);
    k(this, Fi);
    this.consumeContext(Ce, (o) => {
      _(this, Sa, o);
    }), this.consumeContext(V, (o) => {
      _(this, Fi, o);
    });
  }
  async execute() {
    var a, o;
    const i = this.args.unique;
    if (i)
      try {
        const s = await kn(i, () => {
          var l;
          return (l = c(this, Sa)) == null ? void 0 : l.getLatestToken();
        }), n = s.outcome === "generated" || s.outcome === "generateddraft";
        (a = c(this, Fi)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? s.message ?? "The image has been regenerated." : s.message ?? s.outcome
          }
        });
      } catch (s) {
        const n = s instanceof Qt && s.status === 404;
        (o = c(this, Fi)) == null || o.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: s instanceof Qt ? s.detail ?? s.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Sa = new WeakMap(), Fi = new WeakMap();
const Rv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: $s,
  api: $s,
  default: $s
}, Symbol.toStringTag, { value: "Module" }));
var Ea, Ht, Ia, Pi;
class Ts extends Gp {
  constructor(i, a) {
    super(i, a);
    k(this, Ea);
    k(this, Ht);
    k(this, Ia);
    k(this, Pi);
    this.consumeContext(Ce, (o) => {
      _(this, Ea, o);
    }), this.consumeContext(V, (o) => {
      _(this, Ht, o);
    }), this.consumeContext(Hp, (o) => {
      _(this, Ia, o);
    }), this.consumeContext(Xp, (o) => {
      _(this, Pi, (o == null ? void 0 : o.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, o, s;
    if (!c(this, Pi)) {
      (i = c(this, Ht)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await kn(c(this, Pi), () => {
        var l;
        return (l = c(this, Ea)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Ia)) == null || a.setValue(JSON.parse(n.propertyValue))), (o = c(this, Ht)) == null || o.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof Qt && n.status === 404;
      (s = c(this, Ht)) == null || s.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof Qt ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Ea = new WeakMap(), Ht = new WeakMap(), Ia = new WeakMap(), Pi = new WeakMap();
const Mv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: Ts,
  api: Ts,
  default: Ts
}, Symbol.toStringTag, { value: "Module" }));
var Lv = Object.defineProperty, zv = Object.getOwnPropertyDescriptor, Tp = (e) => {
  throw TypeError(e);
}, ut = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? zv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Lv(t, i, o), o;
}, Ir = (e, t, i) => t.has(e) || Tp("Cannot " + i), Ge = (e, t, i) => (Ir(e, t, "read from private field"), i ? i.call(e) : t.get(e)), xs = (e, t, i) => t.has(e) ? Tp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Wv = (e, t, i, a) => (Ir(e, t, "write to private field"), t.set(e, i), i), le = (e, t, i) => (Ir(e, t, "access private method"), i), vo, Na, U, os, bo, xp, kp, Dp, Or, Sp, Ep, Ip, Op, Cp, Ap, Fp, Pp;
const Uv = [100, 200, 300, 400, 500, 600, 700, 800, 900], Nv = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let ge = class extends hc {
  constructor() {
    super(), xs(this, U), xs(this, vo), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", xs(this, Na, () => {
      var e;
      return (e = Ge(this, vo)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ce, (e) => {
      Wv(this, vo, e);
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
      <umb-body-layout headline=${le(this, U, Ip).call(this)}>
        ${le(this, U, bo).call(this, "upload") ? le(this, U, Op).call(this, e) : h}
        ${le(this, U, bo).call(this, "path") ? le(this, U, Cp).call(this, e) : h}
        ${le(this, U, bo).call(this, "web") ? le(this, U, Ap).call(this, e) : h}

        ${this._error ? r`<p class="error" role="alert">${this._error}</p>` : h}
        ${this._busy ? r`<uui-loader-bar></uui-loader-bar>` : h}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
vo = /* @__PURE__ */ new WeakMap();
Na = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakSet();
os = function() {
  var e, t;
  return { familyKey: ((e = this.data) == null ? void 0 : e.familyKey) ?? null, parentKey: ((t = this.data) == null ? void 0 : t.parentKey) ?? null };
};
bo = function(e) {
  var t;
  return !((t = this.data) != null && t.mode) || this.data.mode === e;
};
xp = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  le(this, U, kp).call(this, t);
};
kp = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await $h(t, Ge(this, Na), Ge(this, U, os));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Dp = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await Th(this._path.trim(), Ge(this, Na), Ge(this, U, os)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Or = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
Sp = async function() {
  if (Ge(this, U, Or)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await xh(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        Ge(this, Na),
        Ge(this, U, os)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
Ep = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Ip = function() {
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
Op = function(e) {
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
            @change=${le(this, U, xp)}>
          </uui-file-dropzone>
          <p class="hint">
            .ttf, .otf, .woff2 or .woff. The family name and weight are read from the file. Uploads are stored in the
            media library, so they work on Umbraco Cloud and transfer with Deploy.
          </p>
        </uui-box>
    `;
};
Cp = function(e) {
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
            @click=${le(this, U, Dp)}>
            Register
          </uui-button>
        </uui-box>
    `;
};
Ap = function(e) {
  return r`
        <uui-box headline=${e ? "Or use a web font" : "Web font"}>
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Nv.map((t) => ({
    name: t.name,
    value: t.value,
    selected: t.value === this._provider
  }))}
            ?disabled=${this._busy}
            @change=${(t) => {
    this._provider = t.target.value;
  }}>
          </uui-select>

          ${this._provider === "direct" ? le(this, U, Pp).call(this) : le(this, U, Fp).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !Ge(this, U, Or)}
            @click=${le(this, U, Sp)}>
            Add web font
          </uui-button>
        </uui-box>
    `;
};
Fp = function() {
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
    Uv,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => le(this, U, Ep).call(this, e, t.target.checked)}>
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
Pp = function() {
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
  A("di-font-upload-modal")
], ge);
const Bv = ge, jv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return ge;
  },
  default: Bv
}, Symbol.toStringTag, { value: "Module" }));
var Kv = Object.getOwnPropertyDescriptor, Vv = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Kv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let Ko = class extends P {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Ko = Vv([
  A("di-template-folder-editor")
], Ko);
const qv = Ko, Rp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Ko;
  },
  default: qv
}, Symbol.toStringTag, { value: "Module" }));
var Yv = Object.getOwnPropertyDescriptor, Gv = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Yv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let xa = class extends P {
  render() {
    return r`<umb-workspace-editor>
      <umb-icon id="icon" slot="header" name="icon-font"></umb-icon>
      <umb-workspace-header-name-editable slot="header"></umb-workspace-header-name-editable>
    </umb-workspace-editor>`;
  }
};
xa.styles = [
  Jp,
  R`
      #icon {
        display: inline-block;
        font-size: var(--uui-size-6);
        margin-right: var(--uui-size-space-4);
      }
    `
];
xa = Gv([
  A("di-font-family-editor")
], xa);
const Hv = xa, Xv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontFamilyEditorElement() {
    return xa;
  },
  default: Hv
}, Symbol.toStringTag, { value: "Module" }));
var Jv = Object.defineProperty, Zv = Object.getOwnPropertyDescriptor, Mp = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Zv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Jv(t, i, o), o;
};
let ka = class extends P {
  constructor() {
    super(), this._headline = "", this.consumeContext(Gn, (e) => {
      this.observe(e == null ? void 0 : e.current, (t) => {
        this._headline = t ? `${t.font.familyName} · ${t.name}` : "";
      });
    });
  }
  render() {
    return r`<umb-workspace-editor headline=${this._headline}></umb-workspace-editor>`;
  }
};
Mp([
  m()
], ka.prototype, "_headline", 2);
ka = Mp([
  A("di-font-editor")
], ka);
const Qv = ka, eb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontEditorElement() {
    return ka;
  },
  default: Qv
}, Symbol.toStringTag, { value: "Module" }));
export {
  oy as manifests,
  Ob as onInit
};
//# sourceMappingURL=dynamic-images.js.map
