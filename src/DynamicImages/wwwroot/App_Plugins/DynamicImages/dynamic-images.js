var Br = (e) => {
  throw TypeError(e);
};
var ys = (e, t, i) => t.has(e) || Br("Cannot " + i);
var c = (e, t, i) => (ys(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $ = (e, t, i) => t.has(e) ? Br("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), v = (e, t, i, a) => (ys(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), I = (e, t, i) => (ys(e, t, "access private method"), i);
var fs = (e, t, i, a) => ({
  set _(o) {
    v(e, t, o, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as ih, UmbEntityWorkspaceDataManager as ah, UmbSubmitWorkspaceAction as ya, UmbEntityNamedDetailWorkspaceContextBase as On, UMB_WORKSPACE_CONTEXT as oh, UmbEntityDetailWorkspaceContextBase as sh, UmbWorkspaceActionBase as nh } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as st, UmbContextConsumerController as rh } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as Ua, UmbItemRepositoryBase as _c, UmbItemServerDataSourceBase as wc, UmbRepositoryBase as Be } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as Na, UmbItemStoreBase as $c } from "@umbraco-cms/backoffice/store";
import { UmbId as Tc } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as lh, UMB_DATE_TIME_VALUE_TYPE as ch } from "@umbraco-cms/backoffice/value-type";
import { nothing as h, html as r, css as R, state as m, customElement as A, ifDefined as fa, property as f, repeat as re, classMap as An, styleMap as K } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as P } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as xc, UmbTreeRepositoryBase as kc } from "@umbraco-cms/backoffice/tree";
import { UMB_ACTION_EVENT_CONTEXT as nt } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent as ci, UmbRequestReloadStructureForEntityEvent as Fn, UmbEntityActionBase as ui } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT as q } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as Dc } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UMB_AUTH_CONTEXT as Oe } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as Pn, UMB_DISCARD_CHANGES_MODAL as uh, umbConfirmModal as Sc, UmbModalToken as Ec, UmbModalBaseElement as Ic } from "@umbraco-cms/backoffice/modal";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as Rn } from "@umbraco-cms/backoffice/entity";
import { UmbDefaultCollectionContext as Cc } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as Oc, UmbDeselectedEvent as Ac } from "@umbraco-cms/backoffice/event";
import { UmbConditionBase as dh } from "@umbraco-cms/backoffice/extension-registry";
import { UMB_SECTION_CONTEXT as ph } from "@umbraco-cms/backoffice/section";
import "@umbraco-cms/backoffice/document-type";
import "@umbraco-cms/backoffice/media";
import { UmbArrayState as Gi, UmbStringState as jr, UmbObjectState as Kr, UmbBooleanState as Za, UmbNumberState as hh } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as mh } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as yh } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as fh } from "@umbraco-cms/backoffice/document";
import { UmbTextStyles as gh } from "@umbraco-cms/backoffice/style";
import { tryExecute as vh } from "@umbraco-cms/backoffice/resources";
const es = "dynamic-images", ts = "di-template", Rs = "di:templates-changed", bh = "/umbraco/management/api/v1/dynamic-images";
class ai extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function g(e, t, i) {
  const a = await t(), o = new Headers(i == null ? void 0 : i.headers);
  a && o.set("Authorization", `Bearer ${a}`);
  let s = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (o.set("Content-Type", "application/json"), s = JSON.stringify(i.json));
  const n = await fetch(`${bh}${e}`, { ...i, headers: o, body: s });
  if (!n.ok) throw await _h(n);
  return n;
}
async function _h(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new ai(t, e.status, i);
}
const x = async (e) => e.json();
async function wh(e) {
  const t = await g("/templates?take=500", e);
  return (await x(t)).items;
}
const Mn = async (e, t) => x(await g(`/templates/${e}`, t)), $h = async (e, t) => x(await g("/templates", t, { method: "POST", json: e })), Th = async (e, t) => x(await g(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function xh(e, t) {
  await g(`/templates/${e}`, t, { method: "DELETE" });
}
const kh = async (e, t, i) => x(await g(`/templates/${e}/duplicate`, i, { method: "POST", json: { targetKey: t } })), Dh = async (e, t, i) => x(await g(`/templates/${e}/enabled`, i, { method: "PUT", json: { isEnabled: t } }));
async function Sh(e, t) {
  return (await g(`/templates/${e}/export`, t)).blob();
}
const Eh = async (e, t, i, a = null) => x(await g("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function is(e, t, i, a) {
  const o = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && o.set("foldersOnly", "true"), a && o.set("parentKey", a), o.toString();
}
const Vr = async (e, t, i, a) => x(await g(`/tree/root?${is(e, t, i)}`, a)), Ih = async (e, t, i, a, o) => x(await g(`/tree/children?${is(t, i, a, e)}`, o)), Ch = async (e, t) => x(await g(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function as(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return x(await g(`/item?${i}`, t));
}
async function Oh(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), x(await g(`/collection/templates?${i}`, t));
}
async function Ah(e, t, i) {
  return (await g(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const Fh = async (e, t) => x(await g("/folders", t, { method: "POST", json: e })), Ph = async (e, t) => x(await g(`/folders/${e}`, t)), Rh = async (e, t, i) => x(await g(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function Fc(e, t) {
  await g(`/folders/${e}`, t, { method: "DELETE" });
}
async function Mh(e, t, i) {
  await g(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Lh(e, t, i) {
  await g(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function zh(e, t, i) {
  await g("/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const Wh = async (e, t, i) => x(await g("/templates/bulk-duplicate", i, { method: "POST", json: { keys: e, targetKey: t } }));
async function Uh(e, t, i) {
  await g("/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
const Ms = async (e) => x(await g("/fonts", e)), Nh = async (e, t) => x(await g(`/fonts/${e}`, t));
async function Bh(e, t, i = {}) {
  const a = new FormData();
  return a.append("file", e), i.familyKey && a.append("familyKey", i.familyKey), i.parentKey && a.append("parentKey", i.parentKey), x(await g("/fonts", t, { method: "POST", body: a }));
}
const jh = async (e, t, i = {}) => x(await g("/fonts/register-path", t, { method: "POST", json: { path: e, ...i } })), Kh = async (e, t, i = {}) => x(await g("/fonts/register-web", t, { method: "POST", json: { ...e, ...i } })), Vh = async (e, t) => x(await g(`/fonts/${e}/refresh`, t, { method: "POST" })), qh = async (e, t, i, a, o) => x(await g(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (o == null ? void 0 : o.weight) ?? null, isItalic: (o == null ? void 0 : o.isItalic) ?? null }
}));
async function Pc(e, t) {
  await g(`/fonts/${e}`, t, { method: "DELETE" });
}
async function Yh(e, t) {
  return (await g(`/fonts/${e}/file`, t)).arrayBuffer();
}
const qr = async (e, t, i, a) => x(await g(`/fonts/tree/root?${is(e, t, i)}`, a)), Hh = async (e, t, i, a, o) => x(await g(`/fonts/tree/children?${is(t, i, a, e)}`, o)), Gh = async (e, t) => x(await g(`/fonts/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function os(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return x(await g(`/fonts/item?${i}`, t));
}
async function Xh(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), x(await g(`/fonts/collection?${i}`, t));
}
const Rc = async (e, t, i, a) => x(await g(`/fonts/${e}/references?skip=${t}&take=${i}`, a));
async function Jh(e, t, i, a) {
  const o = new URLSearchParams({ skip: String(t), take: String(i) });
  for (const s of e) o.append("key", s);
  return x(await g(`/fonts/are-referenced?${o}`, a));
}
const Zh = async (e, t) => x(await g("/fonts/folders", t, { method: "POST", json: e })), Qh = async (e, t) => x(await g(`/fonts/folders/${e}`, t)), em = async (e, t, i) => x(await g(`/fonts/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function Mc(e, t) {
  await g(`/fonts/folders/${e}`, t, { method: "DELETE" });
}
const tm = async (e, t) => x(await g(`/fonts/families/${e}`, t)), im = async (e, t, i) => x(await g(`/fonts/families/${e}`, i, { method: "PUT", json: { name: t } }));
async function Lc(e, t) {
  await g(`/fonts/families/${e}`, t, { method: "DELETE" });
}
async function am(e, t, i) {
  await g(`/fonts/families/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function om(e, t, i) {
  await g(`/fonts/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function sm(e, t, i) {
  await g("/fonts/tree/sort", i, { method: "PUT", json: { parentKey: e, sorting: t } });
}
async function nm(e, t, i) {
  await g("/fonts/tree/bulk-move", i, { method: "PUT", json: { keys: e, targetKey: t } });
}
const zc = async (e) => x(await g("/document-types", e)), rm = async (e, t) => x(await g(`/document-types/${encodeURIComponent(e)}/properties`, t)), lm = async (e, t, i) => x(await g(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function Wc(e, t, i) {
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
const Uc = async (e, t, i) => x(await g("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Nc = async (e, t) => x(await g(`/media/${e}/image-info`, t)), Ln = async (e, t) => x(await g(`/documents/${e}/regenerate`, t, { method: "POST" })), Bc = async (e, t, i) => x(await g(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), cm = async (e, t) => x(await g(`/jobs/${e}`, t));
async function um(e, t) {
  await g(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const dm = async (e, t) => x(await g(`/templates/${e}/usage`, t)), jc = async (e) => x(await g("/health", e)), pm = async (e) => x(await g("/sync/status", e)), hm = async (e) => x(await g("/sync/export", e, { method: "POST" })), mm = async (e) => x(await g("/sync/import", e, { method: "POST" }));
function Ba(e) {
  const t = `section/${es}/workspace/${ts}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function ym(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${es}/workspace/${ts}/create${t}`, document.baseURI).pathname;
}
function oi(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${es}/workspace/${e}${i}`, document.baseURI).pathname;
}
function fm(e) {
  return new URL(`section/${es}/dashboard/${e}`, document.baseURI).pathname;
}
function zn() {
  window.dispatchEvent(new CustomEvent(Rs));
}
const ss = () => crypto.randomUUID();
function ns(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function Kc(e, t, i) {
  const { x: a, y: o } = ns(e);
  return {
    type: "text",
    key: ss(),
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
function Vc(e, t, i) {
  const { x: a, y: o } = ns(e);
  return {
    type: "image",
    key: ss(),
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
function qc(e, t, i) {
  const { x: a, y: o } = ns(e);
  return {
    type: "badges",
    key: ss(),
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
const ga = {
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
}, gm = Object.keys(ga);
function vm(e, t = "Shape", i = "rectangle") {
  const { x: a, y: o } = ns(e), s = ga[i] ?? ga.rectangle;
  return {
    type: "rect",
    key: ss(),
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
function bm(e) {
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
function _m(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (bm(e.classification)) {
    case "image":
      return { kind: "layer", layer: Vc(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: qc(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: Kc(t, e.name, wm(e)) };
  }
}
function wm(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Yc() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function $m(e) {
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
const Hc = [
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
function va(e) {
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
function ba(e) {
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
function Ls(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return Hc[a * 3 + i];
}
function rs(e, t, i) {
  return {
    x: e.x - t * va(e.anchor),
    y: e.y - i * ba(e.anchor)
  };
}
function Wn(e, t, i, a, o) {
  return {
    x: e + i * va(o),
    y: t + a * ba(o)
  };
}
function Tm(e, t, i, a) {
  const o = rs(e, t, i), s = Wn(o.x, o.y, t, i, a);
  return { ...e, x: Math.round(s.x), y: Math.round(s.y), anchor: a };
}
function xm(e, t) {
  const i = Wn(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function Gc(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function fi(e, t, i, a, o) {
  if (o === 0) return { x: e, y: t };
  const s = o * Math.PI / 180, n = Math.cos(s), l = Math.sin(s), p = e - i, y = t - a;
  return { x: i + p * n - y * l, y: a + p * l + y * n };
}
function km(e, t, i, a, o) {
  return fi(e, t, i, a, -o);
}
function Xc(e, t, i, a) {
  if (a === 0) return e;
  const o = [
    fi(e.x, e.y, t, i, a),
    fi(e.x + e.width, e.y, t, i, a),
    fi(e.x + e.width, e.y + e.height, t, i, a),
    fi(e.x, e.y + e.height, t, i, a)
  ], s = Math.min(...o.map((y) => y.x)), n = Math.max(...o.map((y) => y.x)), l = Math.min(...o.map((y) => y.y)), p = Math.max(...o.map((y) => y.y));
  return { x: s, y: l, width: n - s, height: p - l };
}
const Dm = 10;
function Ue(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function Jc(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Co(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Yr(e) {
  return e === "below" || e === "above";
}
function Hr(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Sm(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Em(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), o = Hr(i.position).map((s) => s.layerKey);
  for (; o.length > 0; ) {
    const s = o.pop();
    if (s === e) return !0;
    if (a.has(s)) continue;
    a.add(s);
    const n = t.get(s);
    n && o.push(...Hr(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Im(e, t, i) {
  const a = e.position;
  if (!Jc(a)) return a;
  if (Em(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let o = a.x, s = a.y, n = va(a.anchor), l = ba(a.anchor);
  const p = Gr(e, a.relativeX, !1, t, i);
  p && (o = p.coordinate, n = p.factor);
  const y = Gr(e, a.relativeY, !0, t, i);
  return y && (s = y.coordinate, l = y.factor), { x: o, y: s, anchor: Ls(n, l) };
}
function Gr(e, t, i, a, o) {
  if (!t || Yr(t.edge) !== i) return;
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
    if (!y || Yr(y.edge) !== i) return;
    n = y.layerKey;
  }
}
function Cm(e, t, i) {
  const a = Sm(e), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set(), n = (l) => {
    const p = o.get(l.key);
    if (p) return p;
    let y;
    s.has(l.key) ? y = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (s.add(l.key), y = Im(l, a, (pe) => {
      const we = a.get(pe);
      return we && !i(we) ? n(we).extent : void 0;
    }), s.delete(l.key));
    const S = t(l), E = rs(y, S.width, S.height), z = { x: E.x, y: E.y, width: S.width, height: S.height }, Fe = { position: y, box: z, extent: Xc(z, y.x, y.y, l.rotation ?? 0) };
    return o.set(l.key, Fe), Fe;
  };
  for (const l of e) n(l);
  return o;
}
function zs(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? Ls(va(i.anchor), ba(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? Ls(va(e.anchor), ba(i.anchor)) : e.anchor
  };
}
var he, Ve, Me, gt;
class Om {
  constructor(t = 100) {
    $(this, he, []);
    $(this, Ve, []);
    $(this, Me, 0);
    $(this, gt);
    this.limit = t;
  }
  get canUndo() {
    return c(this, he).length > 0;
  }
  get canRedo() {
    return c(this, Ve).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Me) > 0 || (c(this, he).push(structuredClone(t)), c(this, he).length > this.limit && c(this, he).shift(), v(this, Ve, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Me) === 0 && v(this, gt, structuredClone(t)), fs(this, Me)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Me) !== 0 && (fs(this, Me)._--, !(c(this, Me) > 0) && (t && c(this, gt) !== void 0 && (c(this, he).push(c(this, gt)), c(this, he).length > this.limit && c(this, he).shift(), v(this, Ve, [])), v(this, gt, void 0)));
  }
  undo(t) {
    const i = c(this, he).pop();
    if (i !== void 0)
      return c(this, Ve).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Ve).pop();
    if (i !== void 0)
      return c(this, he).push(structuredClone(t)), i;
  }
  clear() {
    v(this, he, []), v(this, Ve, []), v(this, Me, 0), v(this, gt, void 0);
  }
}
he = new WeakMap(), Ve = new WeakMap(), Me = new WeakMap(), gt = new WeakMap();
const Ws = 3, Am = (e) => Fm(e), Xr = (e, t) => e.slice(0, Math.max(0, t)).join("."), Fm = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), Pm = "Page";
function Rm(e) {
  return e.isSystem ? Pm : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const pi = (e) => e ?? Number.MAX_SAFE_INTEGER;
function Mm(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || pi(t.property.tabSortOrder) - pi(i.property.tabSortOrder) || pi(t.property.groupSortOrder) - pi(i.property.groupSortOrder) || pi(t.property.sortOrder) - pi(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function Lm(e, t) {
  const i = Mm(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: Rm(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function zm(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const Wm = "DynamicImages.Workspace.Template", Um = 12, Jr = 36;
var Di, vt, Kt, Vt, Si, qt, Ei, Ii, Yt, bt, Ci, qe, Oi, Ai, me, Fa, Ht, Le, Gt, k, Zc, Fi, Pi, Us, Ns, Bs, je, Wt, js, ro, Qc, eu, tu, Ks;
class Nm extends ih {
  constructor(i) {
    super(i, Wm);
    $(this, k);
    $(this, Di);
    $(this, vt);
    $(this, Kt);
    $(this, Vt);
    $(this, Si);
    $(this, qt);
    $(this, Ei);
    $(this, Ii);
    $(this, Yt);
    $(this, bt);
    $(this, Ci);
    $(this, qe);
    $(this, Oi);
    $(this, Ai);
    $(this, me);
    $(this, Fa);
    $(this, Ht);
    $(this, Le);
    $(this, Gt);
    $(this, Fi);
    $(this, Pi);
    this._data = new ah(this), this.template = this._data.current, v(this, Di, new Gi([], (a) => a.key)), this.layers = c(this, Di).asObservable(), v(this, vt, new jr(void 0)), this.selectedLayerKey = c(this, vt).asObservable(), v(this, Kt, new Gi([], (a) => a.alias)), this.properties = c(this, Kt).asObservable(), v(this, Vt, new Kr({})), this.linkedProperties = c(this, Vt).asObservable(), v(this, Si, new Kr({})), this.linkedCaptions = c(this, Si).asObservable(), v(this, qt, new Gi([], (a) => a.key)), this.fonts = c(this, qt).asObservable(), v(this, Ei, new Gi([], (a) => a.key)), this.serverBounds = c(this, Ei).asObservable(), v(this, Ii, new Gi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, Ii).asObservable(), v(this, Yt, new jr(void 0)), this.sampleContentKey = c(this, Yt).asObservable(), v(this, bt, new Za(!0)), this.useSampleData = c(this, bt).asObservable(), v(this, Ci, new hh(1)), this.zoom = c(this, Ci).asObservable(), v(this, qe, new Za(!0)), this.loading = c(this, qe).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), v(this, Oi, new Za(!1)), this.canUndo = c(this, Oi).asObservable(), v(this, Ai, new Za(!1)), this.canRedo = c(this, Ai).asObservable(), v(this, me, new Om()), v(this, Le, !1), v(this, Gt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), v(this, Fi, async (a) => {
      const o = a.detail;
      if (c(this, Gt) || !(o != null && o.url) || !I(this, k, Zc).call(this, o.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await Pn(this, uh), v(this, Gt, !0), window.history.pushState({}, "", o.url instanceof URL ? o.url.href : o.url), !0;
      } catch {
        return !1;
      }
    }), v(this, Pi, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, Fa)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => $s),
        setup: (a, o) => {
          const s = o.match.params.parentUnique;
          return this.createScaffold(void 0, s && s !== "null" ? s : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => $s),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => $s),
        setup: (a, o) => this.load(o.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Oe, (a) => {
      v(this, Fa, a);
    }), this.consumeContext(q, (a) => {
      v(this, Ht, a);
    }), window.addEventListener("willchangestate", c(this, Fi)), window.addEventListener("beforeunload", c(this, Pi)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Le);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, qe).setValue(!0), v(this, Le, !1);
    try {
      const a = await Mn(i, this.getToken);
      I(this, k, Wt).call(this, a, { resetHistory: !0, persist: !0 }), I(this, k, eu).call(this), this.setIsNew(!1), await I(this, k, Us).call(this, a);
    } catch (a) {
      I(this, k, Ks).call(this, "This template could not be loaded", a);
    } finally {
      c(this, qe).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, qe).setValue(!0), v(this, Le, !0), I(this, k, Wt).call(this, { ...$m(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await I(this, k, Us).call(this, this._data.getCurrent()), c(this, qe).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await I(this, k, Bs).call(this, i.docTypeAliases);
    c(this, Kt).setValue(a), c(this, Vt).setValue(await I(this, k, Ns).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, qt).setValue(await Ms(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    I(this, k, je).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    I(this, k, je).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    I(this, k, je).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    I(this, k, je).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    I(this, k, je).call(this, (o) => ({ ...o, layers: [...o.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    I(this, k, je).call(this, (o) => ({
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
    I(this, k, je).call(this, (o) => ({
      ...o,
      layers: o.layers.filter((s) => s.key !== i).map((s) => {
        var l, p;
        let n = s.position;
        return ((l = Co(n, "x")) == null ? void 0 : l.layerKey) === i && (n = zs(n, "x", a == null ? void 0 : a.get(s.key))), ((p = Co(n, "y")) == null ? void 0 : p.layerKey) === i && (n = zs(n, "y", a == null ? void 0 : a.get(s.key))), n === s.position ? s : { ...s, position: n };
      })
    })), c(this, vt).getValue() === i && this.selectLayer(void 0);
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
    I(this, k, je).call(this, (o) => {
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
    c(this, vt).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, vt).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((o) => o.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, me).begin(i);
  }
  endTransaction(i = !0) {
    c(this, me).end(i), I(this, k, js).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, me).undo(i);
    a && I(this, k, Wt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, me).redo(i);
    a && I(this, k, Wt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Ei).setValue(i);
  }
  setIssues(i) {
    c(this, Ii).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    c(this, Yt).setValue(i), c(this, bt).setValue(!i), I(this, k, Qc).call(this, i);
  }
  setUseSampleData(i) {
    c(this, bt).setValue(i);
  }
  setZoom(i) {
    c(this, Ci).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, o;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const s = c(this, Le) ? await $h(i, this.getToken) : await Th(i, this.getToken);
      I(this, k, Wt).call(this, s.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Le);
      v(this, Le, !1), this.setIsNew(!1), zn(), await I(this, k, tu).call(this, s.template, n), (a = c(this, Ht)) == null || a.peek("positive", {
        data: { message: `'${s.template.name}' saved.` }
      });
      for (const l of s.warnings)
        (o = c(this, Ht)) == null || o.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", Ba(s.template.key));
    } catch (s) {
      throw I(this, k, Ks).call(this, "The template could not be saved", s), s;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), v(this, Gt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, Fi)), window.removeEventListener("beforeunload", c(this, Pi)), c(this, me).clear(), super.destroy();
  }
}
Di = new WeakMap(), vt = new WeakMap(), Kt = new WeakMap(), Vt = new WeakMap(), Si = new WeakMap(), qt = new WeakMap(), Ei = new WeakMap(), Ii = new WeakMap(), Yt = new WeakMap(), bt = new WeakMap(), Ci = new WeakMap(), qe = new WeakMap(), Oi = new WeakMap(), Ai = new WeakMap(), me = new WeakMap(), Fa = new WeakMap(), Ht = new WeakMap(), Le = new WeakMap(), Gt = new WeakMap(), k = new WeakSet(), /**
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
Zc = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, Fi = new WeakMap(), Pi = new WeakMap(), Us = async function(i) {
  const [a, o] = await Promise.all([
    Ms(this.getToken).catch(() => []),
    I(this, k, Bs).call(this, i.docTypeAliases)
  ]);
  c(this, qt).setValue(a), c(this, Kt).setValue(o), c(this, Vt).setValue(await I(this, k, Ns).call(this, i.docTypeAliases, o));
}, Ns = async function(i, a) {
  const o = {}, s = {};
  if (i.length === 0) return o;
  let n = a.filter((p) => p.classification === "content").slice(0, Um).map((p) => p.alias), l = 0;
  for (let p = 1; p <= Ws && n.length > 0 && l < Jr; p++) {
    const y = n.slice(0, Jr - l);
    l += y.length;
    const S = await Promise.all(y.map(async (E) => {
      var Yi;
      const z = await Promise.all(
        i.map((le) => lm(le, E, this.getToken).catch(() => null))
      ), Fe = /* @__PURE__ */ new Map();
      for (const le of z.flatMap((pt) => (pt == null ? void 0 : pt.properties) ?? []))
        Fe.has(le.alias) || Fe.set(le.alias, le);
      const pe = z.filter((le) => le !== null), we = [...new Set(pe.flatMap((le) => le.targetDocTypes.map((pt) => pt.name)))], Pt = pe.some((le) => le.inference === "all") ? "all" : (Yi = pe[0]) == null ? void 0 : Yi.inference;
      return { prefix: E, properties: [...Fe.values()], caption: zm(we, Pt) };
    }));
    n = [];
    for (const E of S)
      E.properties.length !== 0 && (o[E.prefix] = E.properties, s[E.prefix] = E.caption, p < Ws && n.push(...E.properties.filter((z) => z.classification === "content" && !z.isSystem).map((z) => `${E.prefix}.${z.alias}`)));
  }
  return c(this, Si).setValue(s), o;
}, Bs = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((s) => rm(s, this.getToken).catch(() => []))
  ), o = /* @__PURE__ */ new Map();
  for (const s of a.flat())
    o.has(s.alias) || o.set(s.alias, s);
  return [...o.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
je = function(i, a = !0) {
  const o = this._data.getCurrent();
  if (!o) return;
  a && c(this, me).push(o);
  const s = i(structuredClone(o));
  I(this, k, Wt).call(this, s);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
Wt = function(i, a) {
  a != null && a.resetHistory && c(this, me).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Di).setValue(i.layers), I(this, k, js).call(this);
}, js = function() {
  c(this, Oi).setValue(c(this, me).canUndo), c(this, Ai).setValue(c(this, me).canRedo);
}, ro = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, Qc = function(i) {
  try {
    i ? localStorage.setItem(I(this, k, ro).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(I(this, k, ro).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
eu = function() {
  let i;
  try {
    const a = localStorage.getItem(I(this, k, ro).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  c(this, Yt).setValue(i), c(this, bt).setValue(!i);
}, tu = async function(i, a) {
  const o = await this.getContext(nt).catch(() => {
  });
  o && (a ? o.dispatchEvent(new ci({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : o.dispatchEvent(new Fn({ entityType: "di-template", unique: i.key })));
}, Ks = function(i, a) {
  var s;
  const o = a instanceof ai ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (s = c(this, Ht)) == null || s.peek("danger", { data: { headline: i, message: o } });
};
const At = new st(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Je = "di-template-root", N = "di-template-folder", H = ts, jt = "DynamicImages.Tree.Templates", gi = "DynamicImages.Repository.TemplateTree", na = "DynamicImages.Repository.TemplateFolder", Bm = "DynamicImages.Store.TemplateFolder", Oo = "DynamicImages.Workspace.TemplateFolder", iu = "DynamicImages.Workspace.TemplateRoot", gs = "DynamicImages.Repository.TemplateItem", jm = "DynamicImages.Store.TemplateItem", vs = "DynamicImages.Repository.TemplateDetail", Km = "DynamicImages.Store.TemplateDetail", Zr = "DynamicImages.Repository.MoveTemplate", Qr = "DynamicImages.Repository.MoveTemplateFolder", el = "DynamicImages.Repository.DuplicateTemplate", tl = "DynamicImages.Repository.BulkMoveTemplates", il = "DynamicImages.Repository.BulkDuplicateTemplates", al = "DynamicImages.Repository.SortTemplateChildren", Un = "icon-picture", Nn = "icon-picture color-grey", au = "icon-folder", Ao = "DynamicImages.Collection.Templates", ol = "DynamicImages.Repository.TemplateCollection";
async function T(e, t) {
  const i = (async () => {
    const a = await new rh(e, Oe).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (o) {
      throw o instanceof ai ? { type: "error", title: o.message, status: o.status, detail: o.detail } : o;
    }
  })();
  return await vh(e, i);
}
var _t;
class Vm {
  constructor(t) {
    $(this, _t);
    v(this, _t, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: N,
      unique: Tc.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await T(c(this, _t), (o) => Ph(t, o));
    return i ? { data: { entityType: N, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: o } = await T(c(this, _t), (s) => Fh({ key: a, name: t.name, parentKey: i }, s));
    return o ? { error: o } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await T(c(this, _t), (o) => Rh(i, t.name, o));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return T(c(this, _t), (i) => Fc(t, i));
  }
}
_t = new WeakMap();
const Bn = new st("DiTemplateFolderStore");
class ou extends Na {
  constructor(t) {
    super(t, Bn);
  }
}
class sl extends Ua {
  constructor(t) {
    super(t, Vm, Bn);
  }
}
const qm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: Bn,
  DiTemplateFolderRepository: sl,
  DiTemplateFolderStore: ou,
  api: sl
}, Symbol.toStringTag, { value: "Module" })), Ym = [
  {
    type: "repository",
    alias: na,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => qm)
  },
  {
    type: "store",
    alias: Bm,
    name: "Dynamic Images Template Folder Store",
    api: ou
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [N],
    meta: { folderRepositoryAlias: na }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [N],
    meta: { folderRepositoryAlias: na }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Oo,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => Oy),
    meta: { entityType: N }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: ya,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Oo }]
  }
], Hm = [
  {
    type: "repository",
    alias: gi,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => Py)
  },
  {
    type: "tree",
    kind: "default",
    alias: jt,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: gi }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [Je, N, H]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: jt, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: iu,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: Je, headline: "Templates" }
  },
  ...Ym
], jn = new st("DiTemplateItemStore");
class su extends $c {
  constructor(t) {
    super(t, jn);
  }
}
class Gm extends wc {
  constructor(t) {
    super(t, {
      getItems: (i) => T(t, (a) => as(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? N : H,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class nl extends _c {
  constructor(t) {
    super(t, Gm, jn);
  }
}
const Xm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: jn,
  DiTemplateItemRepository: nl,
  DiTemplateItemStore: su,
  api: nl
}, Symbol.toStringTag, { value: "Module" })), Kn = new st("DiTemplateDetailStore");
class nu extends Na {
  constructor(t) {
    super(t, Kn);
  }
}
const bs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var Ri;
class Jm {
  constructor(t) {
    $(this, Ri);
    this.createScaffold = bs, this.create = bs, this.update = bs, v(this, Ri, t);
  }
  async read(t) {
    const { data: i, error: a } = await T(c(this, Ri), (o) => Mn(t, o));
    return i ? { data: { entityType: H, unique: i.key, name: i.name } } : { error: a };
  }
  /**
   * A template, or a folder: the collection's bulk Delete sends every selected key here, and a
   * selection can hold both. A folder that is not empty is refused by the server with a 409, which
   * core's bulk action shows as that item's error.
   */
  delete(t) {
    return T(c(this, Ri), async (i) => {
      const [a] = await as([t], i);
      return (a == null ? void 0 : a.entityType) === "folder" ? Fc(t, i) : xh(t, i);
    });
  }
}
Ri = new WeakMap();
class rl extends Ua {
  constructor(t) {
    super(t, Jm, Kn);
  }
}
const Zm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: Kn,
  DiTemplateDetailRepository: rl,
  DiTemplateDetailStore: nu,
  api: rl
}, Symbol.toStringTag, { value: "Module" })), hi = [Je, N], _s = [{ alias: "Umb.Condition.CollectionAlias", match: Ao }], Qm = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: gs,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => Xm)
  },
  {
    type: "itemStore",
    alias: jm,
    name: "Dynamic Images Template Item Store",
    api: su
  },
  {
    type: "repository",
    alias: vs,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => Zm)
  },
  {
    type: "store",
    alias: Km,
    name: "Dynamic Images Template Detail Store",
    api: nu
  },
  {
    type: "repository",
    alias: Zr,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => Ly)
  },
  {
    type: "repository",
    alias: Qr,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => zy)
  },
  {
    type: "repository",
    alias: el,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => Wy)
  },
  {
    type: "repository",
    alias: al,
    name: "Dynamic Images Sort Template Children Repository",
    api: () => Promise.resolve().then(() => Uy)
  },
  {
    type: "repository",
    alias: tl,
    name: "Dynamic Images Bulk Move Templates Repository",
    api: () => Promise.resolve().then(() => jy)
  },
  {
    type: "repository",
    alias: il,
    name: "Dynamic Images Bulk Duplicate Templates Repository",
    api: () => Promise.resolve().then(() => Ky)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: hi,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => Vy),
    forEntityTypes: hi,
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
    forEntityTypes: hi,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: na
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
      treeRepositoryAlias: gi,
      moveRepositoryAlias: Zr,
      treeAlias: jt,
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
      duplicateRepositoryAlias: el,
      treeRepositoryAlias: gi,
      treeAlias: jt,
      foldersOnly: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Enable",
    name: "Enable Dynamic Images Template",
    api: () => Promise.resolve().then(() => qy),
    forEntityTypes: [H],
    weight: 560,
    meta: { icon: "icon-check", label: "Enable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Disable",
    name: "Disable Dynamic Images Template",
    api: () => Promise.resolve().then(() => Yy),
    forEntityTypes: [H],
    weight: 550,
    meta: { icon: "icon-block", label: "Disable", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => Hy),
    forEntityTypes: [H],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => Xy),
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
      itemRepositoryAlias: gs,
      detailRepositoryAlias: vs,
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
      treeRepositoryAlias: gi,
      moveRepositoryAlias: Qr,
      treeAlias: jt,
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
    api: () => Promise.resolve().then(() => Qy),
    forEntityTypes: hi,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "sortChildrenOf",
    alias: "DynamicImages.EntityAction.Template.SortChildren",
    name: "Sort Dynamic Images Templates",
    forEntityTypes: hi,
    meta: {
      sortChildrenOfRepositoryAlias: al,
      treeRepositoryAlias: gi
    }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: hi
  },
  // ---------------------------------------------------------------- collection selection
  // Any of these applying is what turns on the collection's checkboxes.
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Template.MoveTo",
    name: "Move Dynamic Images Templates",
    forEntityTypes: [H, N],
    meta: {
      bulkMoveRepositoryAlias: tl,
      treeAlias: jt,
      foldersOnly: !0
    },
    conditions: _s
  },
  {
    type: "entityBulkAction",
    kind: "duplicateTo",
    alias: "DynamicImages.EntityBulkAction.Template.DuplicateTo",
    name: "Duplicate Dynamic Images Templates To",
    forEntityTypes: [H, N],
    meta: {
      bulkDuplicateRepositoryAlias: il,
      treeAlias: jt,
      foldersOnly: !0
    },
    conditions: _s
  },
  {
    type: "entityBulkAction",
    kind: "delete",
    alias: "DynamicImages.EntityBulkAction.Template.Delete",
    name: "Delete Dynamic Images Templates",
    forEntityTypes: [H, N],
    meta: {
      itemRepositoryAlias: gs,
      detailRepositoryAlias: vs
    },
    conditions: _s
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => nf)
  }
], Qa = [{ alias: "Umb.Condition.CollectionAlias", match: Ao }], ey = [
  {
    type: "repository",
    alias: ol,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => rf)
  },
  {
    type: "collection",
    kind: "default",
    alias: Ao,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => lf),
    meta: { repositoryAlias: ol }
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
        { field: "isEnabled", label: "Enabled", valueType: lh },
        { field: "updated", label: "Last updated", valueType: ch }
      ]
    },
    conditions: Qa
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: Qa
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => pf),
    forEntityTypes: [H]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: Qa
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: Qa
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
      collectionAlias: Ao
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [iu, Oo]
      }
    ]
  }
], It = "di-font-root", ne = "di-font-folder", X = "di-font-family", Ze = "di-font", ra = "DynamicImages.Tree.Fonts", la = "DynamicImages.Repository.FontTree", ca = "DynamicImages.Repository.FontFolder", ty = "DynamicImages.Store.FontFolder", Fo = "DynamicImages.Workspace.FontFolder", ru = "DynamicImages.Workspace.FontRoot", Po = "DynamicImages.Workspace.FontFamily", lo = "DynamicImages.Workspace.Font", eo = "DynamicImages.Repository.FontItem", iy = "DynamicImages.Store.FontItem", Vn = "DynamicImages.Repository.FontDetail", ay = "DynamicImages.Store.FontDetail", qn = "DynamicImages.Repository.FontFamilyDetail", oy = "DynamicImages.Store.FontFamilyDetail", to = "DynamicImages.Repository.FontReference", ll = "DynamicImages.Repository.MoveFontFamily", cl = "DynamicImages.Repository.MoveFontFolder", ul = "DynamicImages.Repository.BulkMoveFonts", dl = "DynamicImages.Repository.SortFontChildren", pl = "DynamicImages.Repository.FontBulkDelete", hl = "DynamicImages.Condition.IsWebFont", Ro = "DynamicImages.Collection.Fonts", ws = "DynamicImages.Repository.FontCollection", Vs = "DynamicImages.Collection.FontVariants", sy = "icon-folder", ny = "icon-font", ry = "icon-font color-grey", ly = "icon-cloud";
function Yn(e) {
  switch (e) {
    case "folder":
      return ne;
    case "family":
      return X;
    default:
      return Ze;
  }
}
function Hn(e, t) {
  switch (e) {
    case "folder":
      return sy;
    case "family":
      return ny;
    default:
      return t ? ly : ry;
  }
}
const cy = [
  {
    type: "repository",
    alias: la,
    name: "Dynamic Images Font Tree Repository",
    api: () => Promise.resolve().then(() => yf)
  },
  {
    type: "tree",
    kind: "default",
    alias: ra,
    name: "Dynamic Images Font Tree",
    meta: { repositoryAlias: la }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Fonts",
    name: "Dynamic Images Font Tree Item",
    forEntityTypes: [It, ne, X, Ze]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Fonts",
    name: "Dynamic Images Fonts Menu Item",
    weight: 100,
    meta: { label: "Fonts", treeAlias: ra, menus: ["DynamicImages.Menu"] }
  },
  {
    type: "workspace",
    kind: "default",
    alias: ru,
    name: "Dynamic Images Fonts Root Workspace",
    meta: { entityType: It, headline: "Fonts" }
  }
];
var wt;
class uy {
  constructor(t) {
    $(this, wt);
    v(this, wt, t);
  }
  async createScaffold(t) {
    return { data: { entityType: ne, unique: Tc.new(), name: "", ...t } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await T(c(this, wt), (o) => Qh(t, o));
    return i ? { data: { entityType: ne, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: o } = await T(c(this, wt), (s) => Zh({ key: a, name: t.name, parentKey: i }, s));
    return o ? { error: o } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await T(c(this, wt), (o) => em(i, t.name, o));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return T(c(this, wt), (i) => Mc(t, i));
  }
}
wt = new WeakMap();
const Gn = new st("DiFontFolderStore");
class lu extends Na {
  constructor(t) {
    super(t, Gn);
  }
}
class ml extends Ua {
  constructor(t) {
    super(t, uy, Gn);
  }
}
const dy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FOLDER_STORE_CONTEXT: Gn,
  DiFontFolderRepository: ml,
  DiFontFolderStore: lu,
  api: ml
}, Symbol.toStringTag, { value: "Module" })), py = [
  {
    type: "repository",
    alias: ca,
    name: "Dynamic Images Font Folder Repository",
    api: () => Promise.resolve().then(() => dy)
  },
  {
    type: "store",
    alias: ty,
    name: "Dynamic Images Font Folder Store",
    api: lu
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.FontFolder.Rename",
    name: "Rename Dynamic Images Font Folder",
    forEntityTypes: [ne],
    meta: { folderRepositoryAlias: ca }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.FontFolder.Delete",
    name: "Delete Dynamic Images Font Folder",
    forEntityTypes: [ne],
    meta: { folderRepositoryAlias: ca }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Fo,
    name: "Dynamic Images Font Folder Workspace",
    api: () => Promise.resolve().then(() => ff),
    meta: { entityType: ne }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.FontFolder.Submit",
    name: "Save Dynamic Images Font Folder",
    api: ya,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Fo }]
  }
], yl = [{ alias: "Umb.Condition.CollectionAlias", match: Ro }], fl = [{ alias: "Umb.Condition.CollectionAlias", match: Vs }], gl = (e, t) => [
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
], hy = [
  {
    type: "repository",
    alias: ws,
    name: "Dynamic Images Font Collection Repository",
    api: () => Promise.resolve().then(() => vf)
  },
  {
    type: "collection",
    kind: "default",
    alias: Ro,
    name: "Dynamic Images Font Collection",
    api: () => Promise.resolve().then(() => Kl),
    meta: { repositoryAlias: ws }
  },
  {
    type: "collection",
    kind: "default",
    alias: Vs,
    name: "Dynamic Images Font Variant Collection",
    api: () => Promise.resolve().then(() => Kl),
    meta: { repositoryAlias: ws }
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
    conditions: yl
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
    conditions: fl
  },
  ...gl("Fonts", yl),
  ...gl("FontVariants", fl),
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Font",
    name: "Dynamic Images Font Card",
    element: () => Promise.resolve().then(() => Tf),
    forEntityTypes: [ne, X, Ze]
  },
  // ---------------------------------------------------------------- where they show
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.Fonts.Collection",
    name: "Dynamic Images Fonts Collection Workspace View",
    meta: { label: "Fonts", pathname: "fonts", icon: "icon-grid", collectionAlias: Ro },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", oneOf: [ru, Fo] }]
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "DynamicImages.WorkspaceView.FontVariants.Collection",
    name: "Dynamic Images Font Variants Collection Workspace View",
    meta: { label: "Variants", pathname: "variants", icon: "icon-font", collectionAlias: Vs },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Po }]
  }
];
function Xn(e) {
  return {
    unique: e.key,
    entityType: Yn(e.entityType),
    name: e.name,
    icon: Hn(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
const Jn = new st("DiFontItemStore");
class cu extends $c {
  constructor(t) {
    super(t, Jn);
  }
}
class my extends wc {
  constructor(t) {
    super(t, {
      getItems: (i) => T(t, (a) => os(i, a)),
      mapper: Xn
    });
  }
}
class vl extends _c {
  constructor(t) {
    super(t, my, Jn);
  }
}
const yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_ITEM_STORE_CONTEXT: Jn,
  DiFontItemRepository: vl,
  DiFontItemStore: cu,
  api: vl,
  mapFontItem: Xn
}, Symbol.toStringTag, { value: "Module" })), Rt = [It, ne], bl = [{ alias: "Umb.Condition.CollectionAlias", match: Ro }], Mt = (e, t, i) => ({ type: "repository", alias: e, name: t, api: i }), fy = [
  // ---------------------------------------------------------------- repositories
  Mt(eo, "Dynamic Images Font Item Repository", () => Promise.resolve().then(() => yy)),
  { type: "itemStore", alias: iy, name: "Dynamic Images Font Item Store", api: cu },
  Mt(
    to,
    "Dynamic Images Font Reference Repository",
    () => Promise.resolve().then(() => xf)
  ),
  Mt(
    pl,
    "Dynamic Images Font Bulk Delete Repository",
    () => Promise.resolve().then(() => kf)
  ),
  Mt(
    ll,
    "Dynamic Images Move Font Family Repository",
    () => Promise.resolve().then(() => If)
  ),
  Mt(
    cl,
    "Dynamic Images Move Font Folder Repository",
    () => Promise.resolve().then(() => Cf)
  ),
  Mt(
    ul,
    "Dynamic Images Bulk Move Fonts Repository",
    () => Promise.resolve().then(() => Of)
  ),
  Mt(
    dl,
    "Dynamic Images Sort Font Children Repository",
    () => Promise.resolve().then(() => Af)
  ),
  {
    type: "condition",
    alias: hl,
    name: "Dynamic Images Is Web Font Condition",
    api: () => Promise.resolve().then(() => Ff)
  },
  // How the delete modal draws each template still using a font. Cast because 17.5 declares the
  // entityItemRef manifest type in a file no public entry point imports - the folder create
  // option's problem again. The extension type itself is registered and resolved by entity type.
  {
    type: "entityItemRef",
    alias: "DynamicImages.EntityItemRef.Template",
    name: "Dynamic Images Template Item Ref",
    element: () => Promise.resolve().then(() => Mf),
    forEntityTypes: [H]
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Font.Create",
    name: "Create Dynamic Images Font",
    weight: 1200,
    forEntityTypes: [...Rt, X],
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Add to Fonts" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Upload",
    name: "Upload a Dynamic Images Font File",
    weight: 100,
    api: () => Promise.resolve().then(() => Nf),
    forEntityTypes: Rt,
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
    api: () => Promise.resolve().then(() => Bf),
    forEntityTypes: Rt,
    meta: { icon: "icon-cloud", label: "Web font", description: "From Google Fonts, Bunny Fonts or a file URL" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Path",
    name: "Register a Dynamic Images Font Path",
    weight: 80,
    api: () => Promise.resolve().then(() => jf),
    forEntityTypes: Rt,
    meta: { icon: "icon-font", label: "Font from path", description: "A font file already in the site's wwwroot" }
  },
  // Cast for the same reason as the template folder option in entity-actions/manifests.ts.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.FontFolder",
    name: "Dynamic Images Font Folder Create Option",
    weight: 70,
    forEntityTypes: Rt,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: ca
    }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.AddVariant",
    name: "Add a Variant to a Dynamic Images Font Family",
    weight: 100,
    api: () => Promise.resolve().then(() => Kf),
    forEntityTypes: [X],
    meta: { icon: "icon-add", label: "Add variant", description: "Another weight or slant of this family" }
  },
  // ---------------------------------------------------------------- family
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.FontFamily.MoveTo",
    name: "Move Dynamic Images Font Family",
    forEntityTypes: [X],
    meta: {
      treeRepositoryAlias: la,
      moveRepositoryAlias: ll,
      treeAlias: ra,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.FontFamily.Rename",
    name: "Rename Dynamic Images Font Family",
    api: () => Promise.resolve().then(() => Vf),
    forEntityTypes: [X],
    weight: 650,
    meta: { icon: "icon-edit", label: "#actions_rename", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityAction.FontFamily.Delete",
    name: "Delete Dynamic Images Font Family",
    forEntityTypes: [X],
    meta: {
      itemRepositoryAlias: eo,
      detailRepositoryAlias: qn,
      referenceRepositoryAlias: to
    }
  },
  // ---------------------------------------------------------------- variant
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Font.Refresh",
    name: "Refresh a Dynamic Images Web Font",
    api: () => Promise.resolve().then(() => qf),
    forEntityTypes: [Ze],
    weight: 500,
    meta: { icon: "icon-sync", label: "Refresh", additionalOptions: !0 },
    conditions: [{ alias: hl }]
  },
  {
    type: "entityAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityAction.Font.Delete",
    name: "Delete a Dynamic Images Font",
    forEntityTypes: [Ze],
    meta: {
      itemRepositoryAlias: eo,
      detailRepositoryAlias: Vn,
      referenceRepositoryAlias: to
    }
  },
  // ---------------------------------------------------------------- folder
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.FontFolder.MoveTo",
    name: "Move Dynamic Images Font Folder",
    forEntityTypes: [ne],
    meta: {
      treeRepositoryAlias: la,
      moveRepositoryAlias: cl,
      treeAlias: ra,
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
    forEntityTypes: Rt,
    meta: {
      sortChildrenOfRepositoryAlias: dl,
      treeRepositoryAlias: la
    }
  },
  // ---------------------------------------------------------------- collection selection
  {
    type: "entityBulkAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityBulkAction.Font.MoveTo",
    name: "Move Dynamic Images Fonts",
    forEntityTypes: [ne, X],
    meta: { bulkMoveRepositoryAlias: ul, treeAlias: ra, foldersOnly: !0 },
    conditions: bl
  },
  {
    type: "entityBulkAction",
    kind: "deleteWithRelation",
    alias: "DynamicImages.EntityBulkAction.Font.Delete",
    name: "Delete Dynamic Images Fonts",
    forEntityTypes: [ne, X],
    meta: {
      itemRepositoryAlias: eo,
      detailRepositoryAlias: pl,
      referenceRepositoryAlias: to
    },
    conditions: bl
  },
  // ---------------------------------------------------------------- reload
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Font.ReloadChildren",
    name: "Reload Dynamic Images Fonts",
    forEntityTypes: [...Rt, X]
  }
], Zn = new st("DiFontFamilyDetailStore");
class uu extends Na {
  constructor(t) {
    super(t, Zn);
  }
}
const _l = () => Promise.resolve({ error: new Error("A font family is created by adding a font.") });
var Xt;
class gy {
  constructor(t) {
    $(this, Xt);
    this.createScaffold = _l, this.create = _l, v(this, Xt, t);
  }
  async read(t) {
    const { data: i, error: a } = await T(c(this, Xt), (o) => tm(t, o));
    return i ? { data: { entityType: X, unique: i.key, name: i.name } } : { error: a };
  }
  /** A rename: the server carries it onto every variant's family name. */
  async update(t) {
    const { error: i } = await T(c(this, Xt), (a) => im(t.unique, t.name, a));
    return i ? { error: i } : this.read(t.unique);
  }
  delete(t) {
    return T(c(this, Xt), (i) => Lc(t, i));
  }
}
Xt = new WeakMap();
class wl extends Ua {
  constructor(t) {
    super(t, gy, Zn);
  }
}
const vy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_FAMILY_DETAIL_STORE_CONTEXT: Zn,
  DiFontFamilyDetailRepository: wl,
  DiFontFamilyDetailStore: uu,
  api: wl
}, Symbol.toStringTag, { value: "Module" })), by = {
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
function Mo(e, t) {
  const i = by[e], a = i ? `${i} ${e}` : String(e);
  return t ? `${a} Italic` : a;
}
const Qn = new st("DiFontDetailStore");
class du extends Na {
  constructor(t) {
    super(t, Qn);
  }
}
const $l = () => Promise.resolve({ error: new Error("A font is added from the Fonts tree's Create….") });
function qs(e) {
  return {
    entityType: Ze,
    unique: e.key,
    name: Mo(e.weight, e.isItalic),
    font: e,
    weight: e.weight,
    isItalic: e.isItalic,
    styles: e.styles
  };
}
var Jt;
class _y {
  constructor(t) {
    $(this, Jt);
    this.createScaffold = $l, this.create = $l, v(this, Jt, t);
  }
  async read(t) {
    const { data: i, error: a } = await T(c(this, Jt), (o) => Nh(t, o));
    return i ? { data: qs(i) } : { error: a };
  }
  /** The named styles, weight and slant. The family name is the family's, so it goes back unchanged. */
  async update(t) {
    const { data: i, error: a } = await T(c(this, Jt), (o) => qh(t.unique, t.font.familyName, t.styles, o, { weight: t.weight, isItalic: t.isItalic }));
    return i ? { data: qs(i) } : { error: a };
  }
  delete(t) {
    return T(c(this, Jt), (i) => Pc(t, i));
  }
}
Jt = new WeakMap();
class Tl extends Ua {
  constructor(t) {
    super(t, _y, Qn);
  }
}
const wy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_DETAIL_STORE_CONTEXT: Qn,
  DiFontDetailRepository: Tl,
  DiFontDetailStore: du,
  api: Tl,
  toDetail: qs,
  variantName: Mo
}, Symbol.toStringTag, { value: "Module" })), xl = (e, t) => ({
  type: "workspaceAction",
  kind: "default",
  alias: e,
  name: `Save ${t}`,
  api: ya,
  meta: { label: "#buttons_save", look: "primary", color: "positive" },
  conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: t }]
}), $y = [
  // ---------------------------------------------------------------- family
  {
    type: "repository",
    alias: qn,
    name: "Dynamic Images Font Family Detail Repository",
    api: () => Promise.resolve().then(() => vy)
  },
  {
    type: "store",
    alias: oy,
    name: "Dynamic Images Font Family Detail Store",
    api: uu
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Po,
    name: "Dynamic Images Font Family Workspace",
    api: () => Promise.resolve().then(() => Yf),
    meta: { entityType: X }
  },
  xl("DynamicImages.WorkspaceAction.FontFamily.Submit", Po),
  // ---------------------------------------------------------------- variant
  {
    type: "repository",
    alias: Vn,
    name: "Dynamic Images Font Detail Repository",
    api: () => Promise.resolve().then(() => wy)
  },
  {
    type: "store",
    alias: ay,
    name: "Dynamic Images Font Detail Store",
    api: du
  },
  {
    type: "workspace",
    kind: "routable",
    alias: lo,
    name: "Dynamic Images Font Workspace",
    api: () => Promise.resolve().then(() => Hf),
    meta: { entityType: Ze }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Font",
    name: "Dynamic Images Font View",
    element: () => Promise.resolve().then(() => eg),
    weight: 100,
    meta: { label: "Font", pathname: "font", icon: "icon-font" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: lo }]
  },
  xl("DynamicImages.WorkspaceAction.Font.Submit", lo)
], Ty = [
  ...cy,
  ...py,
  ...hy,
  ...fy,
  ...$y
], xy = [
  ...Hm,
  ...Qm,
  ...ey,
  ...Ty,
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
    element: () => Promise.resolve().then(() => og),
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
    element: () => Promise.resolve().then(() => lg),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => pg),
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
    api: Nm,
    meta: { entityType: ts }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => Nv),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Vv),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Xv),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => tb),
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
    api: () => Promise.resolve().then(() => ib),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => ab),
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
    api: () => Promise.resolve().then(() => ob),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => sb),
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
    element: () => Promise.resolve().then(() => pb)
  }
], e_ = (e, t) => {
  t.registerMany(xy);
};
var ky = Object.defineProperty, Dy = Object.getOwnPropertyDescriptor, pu = (e) => {
  throw TypeError(e);
}, er = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Dy(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && ky(t, i, o), o;
}, tr = (e, t, i) => t.has(e) || pu("Cannot " + i), Sy = (e, t, i) => (tr(e, t, "read from private field"), t.get(e)), kl = (e, t, i) => t.has(e) ? pu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ey = (e, t, i, a) => (tr(e, t, "write to private field"), t.set(e, i), i), Iy = (e, t, i) => (tr(e, t, "access private method"), i), Lo, Ys, hu;
let si = class extends P {
  constructor() {
    super(), kl(this, Ys), kl(this, Lo), this._name = "", this._loading = !0, this.consumeContext(At, (e) => {
      Ey(this, Lo, e), e && (this.observe(e.template, (t) => {
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
            @input=${Iy(this, Ys, hu)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : h}
    `;
  }
};
Lo = /* @__PURE__ */ new WeakMap();
Ys = /* @__PURE__ */ new WeakSet();
hu = function(e) {
  var i;
  const t = e.target.value;
  (i = Sy(this, Lo)) == null || i.updateTemplateFields({ name: t });
};
si.styles = R`
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
er([
  m()
], si.prototype, "_name", 2);
er([
  m()
], si.prototype, "_loading", 2);
si = er([
  A("di-template-editor")
], si);
const Cy = si, $s = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return si;
  },
  default: Cy
}, Symbol.toStringTag, { value: "Module" }));
class Dl extends On {
  constructor(t) {
    super(t, {
      workspaceAlias: Oo,
      entityType: N,
      detailRepositoryAlias: na
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => eh),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Oy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: Dl,
  api: Dl
}, Symbol.toStringTag, { value: "Module" }));
function Ts(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function Ay(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? N : Je
    },
    name: e.name,
    entityType: t ? N : H,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? au : e.isEnabled ? Un : Nn,
    isEnabled: e.isEnabled
  };
}
class Fy extends xc {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: o } = Ts(i);
        return T(t, (s) => Vr(a, o, i.foldersOnly ?? !1, s));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = Ts(i);
          return T(t, (p) => Vr(n, l, i.foldersOnly ?? !1, p));
        }
        const a = i.parent.unique, { skip: o, take: s } = Ts(i);
        return T(t, (n) => Ih(a, o, s, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => T(t, (a) => Ch(i.treeItem.unique, a)),
      mapper: Ay
    });
  }
}
class Sl extends kc {
  constructor(t) {
    super(t, Fy);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: Je,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const Py = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: Sl,
  api: Sl
}, Symbol.toStringTag, { value: "Module" }));
class mu extends Be {
  async requestMoveTo(t) {
    const { error: i } = await T(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(q);
      a == null || a.peek("positive", { data: { message: "Moved" } });
      const o = await this.getContext(nt).catch(() => {
      }), s = t.destination.unique;
      o == null || o.dispatchEvent(new ci({
        entityType: s ? N : Je,
        unique: s
      }));
    }
    return { error: i };
  }
}
class Ry extends mu {
  constructor() {
    super(...arguments), this.move = Mh;
  }
}
class My extends mu {
  constructor() {
    super(...arguments), this.move = Lh;
  }
}
const Ly = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ry
}, Symbol.toStringTag, { value: "Module" })), zy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: My
}, Symbol.toStringTag, { value: "Module" }));
class El extends Be {
  async requestDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: o } = await T(this, (s) => kh(t.unique, i, s));
    if (a) {
      const s = await this.getContext(q);
      s == null || s.peek("positive", { data: { message: `'${a.template.name}' created` } });
      const n = await this.getContext(nt).catch(() => {
      });
      n == null || n.dispatchEvent(new ci({
        entityType: i ? N : Je,
        unique: i
      }));
    }
    return { error: o };
  }
}
const Wy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateToTemplateRepository: El,
  api: El
}, Symbol.toStringTag, { value: "Module" }));
class Il extends Be {
  async sortChildrenOf(t) {
    const i = t.sorting.map((o) => ({ key: o.unique, sortOrder: o.sortOrder })), { error: a } = await T(this, (o) => Uh(t.unique, i, o));
    if (!a) {
      const o = await this.getContext(q);
      o == null || o.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const Uy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortTemplateChildrenRepository: Il,
  api: Il
}, Symbol.toStringTag, { value: "Module" })), yu = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
class fu extends Be {
  async reloadDestination(t) {
    const i = await this.getContext(nt).catch(() => {
    });
    i == null || i.dispatchEvent(new ci({
      entityType: t ? N : Je,
      unique: t
    }));
  }
  async notify(t, i) {
    const a = await this.getContext(q);
    a == null || a.peek(t, { data: { message: i } });
  }
}
class Ny extends fu {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await T(this, (o) => zh(t.uniques, i, o));
    return await this.reloadDestination(i), a || await this.notify("positive", `Moved ${yu(t.uniques.length, "item")}`), { error: a };
  }
}
class By extends fu {
  async requestBulkDuplicateTo(t) {
    const i = t.destination.unique, { data: a, error: o } = await T(this, (s) => Wh(t.uniques, i, s));
    return a ? (await this.reloadDestination(i), a.created.length > 0 && await this.notify("positive", `Copied ${yu(a.created.length, "template")}`), a.skippedFolders.length > 0 && await this.notify("warning", `Folders are not copied: ${a.skippedFolders.join(", ")}`), a.errors.length > 0 && await this.notify("warning", a.errors.join(" ")), {}) : { error: o };
  }
}
const jy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ny
}, Symbol.toStringTag, { value: "Module" })), Ky = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: By
}, Symbol.toStringTag, { value: "Module" }));
class Cl extends Dc {
  async getHref() {
    return ym({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const Vy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: Cl,
  api: Cl
}, Symbol.toStringTag, { value: "Module" }));
class ir extends ui {
  async execute() {
    var y;
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await T(this, (S) => Dh(t, this.enable, S));
    if (a || !i) throw a ?? new Error("The template could not be changed.");
    const { data: o } = await T(this, (S) => as([t], S)), s = ((y = o == null ? void 0 : o[0]) == null ? void 0 : y.name) ?? "The template", n = this.enable ? "enabled" : "disabled", l = await this.getContext(q);
    if (!i.changed) {
      l == null || l.peek("default", { data: { message: `'${s}' is already ${n}` } });
      return;
    }
    l == null || l.peek("positive", { data: { message: `'${s}' ${n}` } });
    const p = await this.getContext(nt).catch(() => {
    });
    p == null || p.dispatchEvent(new Fn({ unique: t, entityType: this.args.entityType })), zn();
  }
}
class Ol extends ir {
  constructor() {
    super(...arguments), this.enable = !0;
  }
}
const qy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiEnableTemplateEntityAction: Ol,
  DiSetTemplateEnabledEntityAction: ir,
  api: Ol
}, Symbol.toStringTag, { value: "Module" }));
class Al extends ir {
  constructor() {
    super(...arguments), this.enable = !1;
  }
}
const Yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDisableTemplateEntityAction: Al,
  api: Al
}, Symbol.toStringTag, { value: "Module" }));
class Fl extends ui {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await T(this, async (n) => ({
      blob: await Sh(t, n),
      alias: (await Mn(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const o = URL.createObjectURL(i.blob), s = document.createElement("a");
    s.href = o, s.download = `${i.alias}.json`, s.click(), URL.revokeObjectURL(o);
  }
}
const Hy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: Fl,
  api: Fl
}, Symbol.toStringTag, { value: "Module" })), Gy = 1500;
async function gu(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((o) => setTimeout(o, Gy));
    try {
      a = await cm(a.id, t);
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
class Pl extends ui {
  async execute() {
    var p;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await T(this, (y) => as([t], y)), a = ((p = i == null ? void 0 : i[0]) == null ? void 0 : p.name) ?? "this template";
    await Sc(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: o, error: s } = await T(this, (y) => Bc(t, !1, y));
    if (s || !o) throw s ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(q);
    n == null || n.peek("positive", { data: { message: `Regenerating ${o.total} item(s)…` } });
    const l = await this.getContext(Oe);
    await gu(o, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const Xy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: Pl,
  api: Pl
}, Symbol.toStringTag, { value: "Module" })), Jy = new Ec(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), Zy = new Ec(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class Rl extends ui {
  async execute() {
    const { json: t } = await Pn(this, Zy, { data: {} }), i = this.args.unique ?? null, { data: a, error: o } = await T(this, (l) => Eh(t, "create", l, i));
    if (o || !a) throw o ?? new Error("The template could not be imported.");
    const s = await this.getContext(q);
    s == null || s.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) s == null || s.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(nt);
    n == null || n.dispatchEvent(new ci({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const Qy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: Rl,
  api: Rl
}, Symbol.toStringTag, { value: "Module" }));
var ef = Object.defineProperty, tf = Object.getOwnPropertyDescriptor, vu = (e) => {
  throw TypeError(e);
}, bu = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? tf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && ef(t, i, o), o;
}, af = (e, t, i) => t.has(e) || vu("Cannot " + i), of = (e, t, i) => t.has(e) ? vu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ml = (e, t, i) => (af(e, t, "access private method"), i), co, _u, wu;
let Ni = class extends Ic {
  constructor() {
    super(...arguments), of(this, co), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${Ml(this, co, _u)} aria-label="Choose a file" />
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
            @click=${Ml(this, co, wu)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
co = /* @__PURE__ */ new WeakSet();
_u = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
wu = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
Ni.styles = [
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
bu([
  m()
], Ni.prototype, "_json", 2);
Ni = bu([
  A("di-import-template-modal")
], Ni);
const sf = Ni, nf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return Ni;
  },
  default: sf
}, Symbol.toStringTag, { value: "Module" }));
function $u(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? N : H,
    name: e.name,
    icon: t ? au : e.isEnabled ? Un : Nn,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class Ll extends Be {
  async requestCollection(t = {}) {
    const i = await this.getContext(Rn), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: o, error: s } = await T(this, (n) => Oh({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return o ? { data: { total: o.total, items: o.items.map($u) } } : { error: s };
  }
}
const rf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: Ll,
  api: Ll,
  mapCollectionItem: $u
}, Symbol.toStringTag, { value: "Module" }));
class zl extends Cc {
  async requestItemHref(t) {
    return t.entityType === N ? oi(N, t.unique) : Ba(t.unique);
  }
}
const lf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: zl,
  api: zl
}, Symbol.toStringTag, { value: "Module" }));
var cf = Object.defineProperty, uf = Object.getOwnPropertyDescriptor, Tu = (e) => {
  throw TypeError(e);
}, rt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? uf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && cf(t, i, o), o;
}, ar = (e, t, i) => t.has(e) || Tu("Cannot " + i), zo = (e, t, i) => (ar(e, t, "read from private field"), i ? i.call(e) : t.get(e)), io = (e, t, i) => t.has(e) ? Tu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), uo = (e, t, i, a) => (ar(e, t, "write to private field"), t.set(e, i), i), xs = (e, t, i) => (ar(e, t, "access private method"), i), Wo, Zi, _a, Qi, xu, ku, Du;
const df = 400;
let ge = class extends P {
  constructor() {
    super(), io(this, Qi), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, io(this, Wo), io(this, Zi), io(this, _a), this.consumeContext(Oe, (e) => {
      uo(this, Wo, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), uo(this, Zi, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && xs(this, Qi, xu).call(this);
    })), zo(this, Zi).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = zo(this, Zi)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, uo(this, _a, void 0);
  }
  render() {
    return this.item ? r`
      <uui-card-media
        name=${this.item.name}
        detail=${fa(this.item.docTypes || void 0)}
        href=${fa(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${xs(this, Qi, ku)}
        @deselected=${xs(this, Qi, Du)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : h}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : h;
  }
};
Wo = /* @__PURE__ */ new WeakMap();
Zi = /* @__PURE__ */ new WeakMap();
_a = /* @__PURE__ */ new WeakMap();
Qi = /* @__PURE__ */ new WeakSet();
xu = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || zo(this, _a) === t)) {
    uo(this, _a, t);
    try {
      const i = await Ah(e.unique, df, () => {
        var a;
        return (a = zo(this, Wo)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
ku = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Oc(this.item.unique)));
};
Du = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Ac(this.item.unique)));
};
ge.styles = [
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
rt([
  f({ type: Object })
], ge.prototype, "item", 2);
rt([
  f({ type: Boolean })
], ge.prototype, "selectable", 2);
rt([
  f({ type: Boolean })
], ge.prototype, "selected", 2);
rt([
  f({ type: Boolean, attribute: "select-only" })
], ge.prototype, "selectOnly", 2);
rt([
  f({ type: Boolean })
], ge.prototype, "disabled", 2);
rt([
  f({ type: String })
], ge.prototype, "href", 2);
rt([
  m()
], ge.prototype, "_src", 2);
rt([
  m()
], ge.prototype, "_failed", 2);
ge = rt([
  A("di-template-collection-card")
], ge);
const pf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return ge;
  },
  get element() {
    return ge;
  }
}, Symbol.toStringTag, { value: "Module" }));
function Wl(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function hf(e) {
  const t = e.parentKey ? e.entityType === "font" ? X : ne : It;
  return {
    unique: e.key,
    parent: { unique: e.parentKey, entityType: t },
    name: e.name,
    entityType: Yn(e.entityType),
    hasChildren: e.hasChildren,
    isFolder: e.entityType !== "font",
    icon: Hn(e.entityType, e.isUrlFont),
    isUrlFont: e.isUrlFont
  };
}
class mf extends xc {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: o } = Wl(i);
        return T(t, (s) => qr(a, o, i.foldersOnly ?? !1, s));
      },
      getChildrenOf: (i) => {
        const { skip: a, take: o } = Wl(i);
        if (i.parent.unique === null)
          return T(t, (n) => qr(a, o, i.foldersOnly ?? !1, n));
        const s = i.parent.unique;
        return T(t, (n) => Hh(s, a, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => T(t, (a) => Gh(i.treeItem.unique, a)),
      mapper: hf
    });
  }
}
class Ul extends kc {
  constructor(t) {
    super(t, mf);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: It,
      name: "Fonts",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const yf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontTreeRepository: Ul,
  api: Ul
}, Symbol.toStringTag, { value: "Module" }));
class Nl extends On {
  constructor(t) {
    super(t, {
      workspaceAlias: Fo,
      entityType: ne,
      detailRepositoryAlias: ca
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        // The same element as a template folder's: core's editable folder header, nothing more.
        component: () => Promise.resolve().then(() => eh),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const ff = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFolderWorkspaceContext: Nl,
  api: Nl
}, Symbol.toStringTag, { value: "Module" }));
function gf(e) {
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
function Su(e) {
  return {
    unique: e.key,
    entityType: Yn(e.entityType),
    name: e.name,
    icon: Hn(e.entityType, e.sourceKind === "url"),
    isFolder: e.entityType === "folder",
    variants: e.variantCount === null ? "" : String(e.variantCount),
    usedBy: e.usedByTemplateCount === null ? "" : String(e.usedByTemplateCount),
    weight: e.weight === null ? "" : String(e.weight),
    style: e.isItalic === null ? "" : e.isItalic ? "Italic" : "Upright",
    source: gf(e),
    sampleFontKey: e.sampleFontKey
  };
}
class Bl extends Be {
  async requestCollection(t = {}) {
    const i = await this.getContext(Rn), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: o, error: s } = await T(this, (n) => Xh({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return o ? { data: { total: o.total, items: o.items.map(Su) } } : { error: s };
  }
}
const vf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionRepository: Bl,
  api: Bl,
  mapFontCollectionItem: Su
}, Symbol.toStringTag, { value: "Module" }));
class jl extends Cc {
  async requestItemHref(t) {
    return oi(t.entityType, t.unique);
  }
}
const Kl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontCollectionContext: jl,
  api: jl
}, Symbol.toStringTag, { value: "Module" })), Hs = /* @__PURE__ */ new Map(), ja = (e) => `di-${e}`;
function or(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Hs.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const o = await Yh(e, t), s = new FontFace(ja(e), o);
      return await s.load(), document.fonts.add(s), s;
    } catch (o) {
      console.warn("[DynamicImages] Could not load font", e, o);
      return;
    }
  })();
  return Hs.set(e, a), a;
}
async function bf(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => or(a, t)));
}
function _f(e) {
  Hs.delete(e);
}
var wf = Object.defineProperty, $f = Object.getOwnPropertyDescriptor, Eu = (e) => {
  throw TypeError(e);
}, Ft = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? $f(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && wf(t, i, o), o;
}, sr = (e, t, i) => t.has(e) || Eu("Cannot " + i), ks = (e, t, i) => (sr(e, t, "read from private field"), t.get(e)), Ds = (e, t, i) => t.has(e) ? Eu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Iu = (e, t, i, a) => (sr(e, t, "write to private field"), t.set(e, i), i), ao = (e, t, i) => (sr(e, t, "access private method"), i), Uo, ua, mi, Gs, Cu, Ou;
let Te = class extends P {
  constructor() {
    super(), Ds(this, mi), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._loaded = !1, Ds(this, Uo), Ds(this, ua), this.consumeContext(Oe, (e) => {
      Iu(this, Uo, e), ao(this, mi, Gs).call(this);
    });
  }
  willUpdate(e) {
    super.willUpdate(e), e.has("item") && ao(this, mi, Gs).call(this);
  }
  render() {
    if (!this.item) return h;
    const e = this.item.isFolder ? void 0 : this.item.variants ? `${this.item.variants} variant${this.item.variants === "1" ? "" : "s"}` : [this.item.style, this.item.source].filter(Boolean).join(" · ");
    return r`
      <uui-card-media
        name=${this.item.name}
        detail=${fa(e)}
        href=${fa(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${ao(this, mi, Cu)}
        @deselected=${ao(this, mi, Ou)}>
        ${this.item.sampleFontKey && this._loaded ? r`<div class="specimen" style="font-family: ${ja(this.item.sampleFontKey)}, serif">Aa Bb</div>` : r`<umb-icon name=${this.item.icon}></umb-icon>`}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    `;
  }
};
Uo = /* @__PURE__ */ new WeakMap();
ua = /* @__PURE__ */ new WeakMap();
mi = /* @__PURE__ */ new WeakSet();
Gs = function() {
  var i;
  const e = (i = this.item) == null ? void 0 : i.sampleFontKey, t = ks(this, Uo);
  !t || !e || ks(this, ua) === e || (Iu(this, ua, e), this._loaded = !1, or(e, () => t.getLatestToken()).then((a) => {
    ks(this, ua) === e && (this._loaded = !!a);
  }));
};
Cu = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Oc(this.item.unique)));
};
Ou = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Ac(this.item.unique)));
};
Te.styles = [
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
Ft([
  f({ type: Object })
], Te.prototype, "item", 2);
Ft([
  f({ type: Boolean })
], Te.prototype, "selectable", 2);
Ft([
  f({ type: Boolean })
], Te.prototype, "selected", 2);
Ft([
  f({ type: Boolean, attribute: "select-only" })
], Te.prototype, "selectOnly", 2);
Ft([
  f({ type: Boolean })
], Te.prototype, "disabled", 2);
Ft([
  f({ type: String })
], Te.prototype, "href", 2);
Ft([
  m()
], Te.prototype, "_loaded", 2);
Te = Ft([
  A("di-font-collection-card")
], Te);
const Tf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontCollectionCardElement() {
    return Te;
  },
  get element() {
    return Te;
  }
}, Symbol.toStringTag, { value: "Module" }));
class Vl extends Be {
  async requestReferencedBy(t, i = 0, a = 20) {
    const { data: o, error: s } = await T(this, (l) => Rc(t, i, a, l));
    if (!o) return { error: s };
    const n = o.items.map((l) => ({
      entityType: H,
      unique: l.key,
      name: l.name,
      isEnabled: l.isEnabled
    }));
    return { data: { total: o.total, items: n } };
  }
  /** Which of a bulk selection is in use - the fonts themselves, which the bulk modal names. */
  async requestAreReferenced(t, i = 0, a = 20) {
    const { data: o, error: s } = await T(this, (n) => Jh(t, i, a, n));
    return o ? { data: { total: o.total, items: o.items.map(Xn) } } : { error: s };
  }
}
const xf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontReferenceRepository: Vl,
  api: Vl
}, Symbol.toStringTag, { value: "Module" }));
class ql extends Be {
  delete(t) {
    return T(this, async (i) => {
      const [a] = await os([t], i);
      switch (a == null ? void 0 : a.entityType) {
        case "folder":
          return Mc(t, i);
        case "family":
          return Lc(t, i);
        default:
          return Pc(t, i);
      }
    });
  }
}
const kf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontBulkDeleteRepository: ql,
  api: ql
}, Symbol.toStringTag, { value: "Module" }));
class Au extends Be {
  async moved(t, i) {
    if (i) {
      const o = await this.getContext(q);
      o == null || o.peek("positive", { data: { message: i } });
    }
    const a = await this.getContext(nt).catch(() => {
    });
    a == null || a.dispatchEvent(new ci({
      entityType: t ? ne : It,
      unique: t
    }));
  }
}
class Fu extends Au {
  async requestMoveTo(t) {
    const i = t.destination.unique, { error: a } = await T(this, (o) => this.move(t.unique, i, o));
    return a || await this.moved(i, "Moved"), { error: a };
  }
}
class Df extends Fu {
  constructor() {
    super(...arguments), this.move = am;
  }
}
class Sf extends Fu {
  constructor() {
    super(...arguments), this.move = om;
  }
}
class Ef extends Au {
  async requestBulkMoveTo(t) {
    const i = t.destination.unique, { error: a } = await T(this, (o) => nm(t.uniques, i, o));
    return await this.moved(i, a ? void 0 : `Moved ${t.uniques.length} item${t.uniques.length === 1 ? "" : "s"}`), { error: a };
  }
}
const If = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Df
}, Symbol.toStringTag, { value: "Module" })), Cf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Sf
}, Symbol.toStringTag, { value: "Module" })), Of = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ef
}, Symbol.toStringTag, { value: "Module" }));
class Yl extends Be {
  async sortChildrenOf(t) {
    const i = t.sorting.map((o) => ({ key: o.unique, sortOrder: o.sortOrder })), { error: a } = await T(this, (o) => sm(t.unique, i, o));
    if (!a) {
      const o = await this.getContext(q);
      o == null || o.peek("positive", { data: { message: "Sorted" } });
    }
    return { error: a };
  }
}
const Af = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiSortFontChildrenRepository: Yl,
  api: Yl
}, Symbol.toStringTag, { value: "Module" }));
class Hl extends dh {
  constructor(t, i) {
    super(t, i), this.consumeContext(Rn, (a) => {
      this.observe(a == null ? void 0 : a.unique, async (o) => {
        var n;
        if (!o) {
          this.permitted = !1;
          return;
        }
        const { data: s } = await T(this, (l) => os([o], l));
        this.permitted = ((n = s == null ? void 0 : s[0]) == null ? void 0 : n.isUrlFont) ?? !1;
      });
    });
  }
}
const Ff = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiIsWebFontCondition: Hl,
  api: Hl
}, Symbol.toStringTag, { value: "Module" }));
var Pf = Object.defineProperty, Rf = Object.getOwnPropertyDescriptor, ls = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Rf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Pf(t, i, o), o;
};
let ni = class extends P {
  constructor() {
    super(...arguments), this.readonly = !1, this.standalone = !1;
  }
  render() {
    return this.item ? r`
      <uui-ref-node
        name=${this.item.name ?? "Template"}
        href=${Ba(this.item.unique)}
        ?readonly=${this.readonly}
        ?standalone=${this.standalone}>
        <umb-icon slot="icon" name=${this.item.isEnabled === !1 ? Nn : Un}></umb-icon>
        <slot name="actions" slot="actions"></slot>
      </uui-ref-node>
    ` : h;
  }
};
ls([
  f({ type: Object })
], ni.prototype, "item", 2);
ls([
  f({ type: Boolean })
], ni.prototype, "readonly", 2);
ls([
  f({ type: Boolean })
], ni.prototype, "standalone", 2);
ni = ls([
  A("di-template-item-ref")
], ni);
const Mf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateItemRefElement() {
    return ni;
  },
  get element() {
    return ni;
  }
}, Symbol.toStringTag, { value: "Module" }));
class cs extends Dc {
  async execute() {
    var n, l;
    const t = this.args.unique ?? null, i = { mode: this.mode };
    if (this.args.entityType === X && t) {
      const { data: p } = await T(this, (y) => os([t], y));
      i.familyKey = t, i.familyName = (n = p == null ? void 0 : p[0]) == null ? void 0 : n.name;
    } else
      i.parentKey = t;
    const a = await Pn(this, Jy, { data: i });
    if (!(a != null && a.uploaded)) return;
    const o = await this.getContext(q);
    o == null || o.peek("positive", { data: { message: "Font added" } }), (l = a.warnings) != null && l.length && (o == null || o.peek("warning", { data: { headline: "Some variants were not added", message: a.warnings.join(" ") } }));
    const s = await this.getContext(nt);
    s == null || s.dispatchEvent(new ci({ entityType: this.args.entityType, unique: t })), zn();
  }
}
class Lf extends cs {
  constructor() {
    super(...arguments), this.mode = "upload";
  }
}
class zf extends cs {
  constructor() {
    super(...arguments), this.mode = "web";
  }
}
class Wf extends cs {
  constructor() {
    super(...arguments), this.mode = "path";
  }
}
class Uf extends cs {
  constructor() {
    super(...arguments), this.mode = void 0;
  }
}
const Nf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Lf
}, Symbol.toStringTag, { value: "Module" })), Bf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: zf
}, Symbol.toStringTag, { value: "Module" })), jf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Wf
}, Symbol.toStringTag, { value: "Module" })), Kf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Uf
}, Symbol.toStringTag, { value: "Module" }));
class Gl extends ui {
  async getHref() {
    return this.args.unique ? oi(this.args.entityType, this.args.unique) : void 0;
  }
}
const Vf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRenameFontFamilyEntityAction: Gl,
  api: Gl
}, Symbol.toStringTag, { value: "Module" }));
class Xl extends ui {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await T(this, (n) => Vh(t, n));
    if (a || !i) throw a ?? new Error("The font could not be refreshed.");
    _f(t);
    const o = await this.getContext(q);
    o == null || o.peek("positive", { data: { message: `'${i.familyName}' refreshed` } });
    const s = await this.getContext(nt).catch(() => {
    });
    s == null || s.dispatchEvent(new Fn({ unique: t, entityType: this.args.entityType }));
  }
}
const qf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRefreshFontEntityAction: Xl,
  api: Xl
}, Symbol.toStringTag, { value: "Module" }));
class Jl extends On {
  constructor(t) {
    super(t, {
      workspaceAlias: Po,
      entityType: X,
      detailRepositoryAlias: qn
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => bb),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Yf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiFontFamilyWorkspaceContext: Jl,
  api: Jl
}, Symbol.toStringTag, { value: "Module" }));
class Zl extends sh {
  constructor(t) {
    super(t, {
      workspaceAlias: lo,
      entityType: Ze,
      detailRepositoryAlias: Vn
    }), this.current = this._data.current, this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Tb),
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
    this._data.updateCurrent({ weight: t, name: Mo(t, (i == null ? void 0 : i.isItalic) ?? !1) });
  }
  setItalic(t) {
    const i = this._data.getCurrent();
    this._data.updateCurrent({ isItalic: t, name: Mo((i == null ? void 0 : i.weight) ?? 400, t) });
  }
}
const nr = new st(
  oh.contextAlias,
  void 0,
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === Ze;
  }
), Hf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_FONT_WORKSPACE_CONTEXT: nr,
  DiFontWorkspaceContext: Zl,
  api: Zl
}, Symbol.toStringTag, { value: "Module" }));
var Gf = Object.defineProperty, Xf = Object.getOwnPropertyDescriptor, Pu = (e) => {
  throw TypeError(e);
}, Ka = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Xf(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Gf(t, i, o), o;
}, rr = (e, t, i) => t.has(e) || Pu("Cannot " + i), ri = (e, t, i) => (rr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), oo = (e, t, i) => t.has(e) ? Pu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Xs = (e, t, i, a) => (rr(e, t, "write to private field"), t.set(e, i), i), He = (e, t, i) => (rr(e, t, "access private method"), i), kt, No, Bo, Se, Js, Ru, po, Mu, Lu, zu;
const Jf = ["Regular", "Bold", "Italic", "BoldItalic"];
function Zf(e) {
  switch (e.sourceKind) {
    case "path":
      return `wwwroot: ${e.path ?? ""}`;
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : e.sourceUrl ?? "Web";
    default:
      return "Media library";
  }
}
let Qe = class extends P {
  constructor() {
    super(), oo(this, Se), this._sampleLoaded = !1, this._usedBy = [], this._usedByTotal = 0, oo(this, kt), oo(this, No), oo(this, Bo), this.consumeContext(Oe, (e) => {
      Xs(this, No, () => e == null ? void 0 : e.getLatestToken()), He(this, Se, Js).call(this);
    }), this.consumeContext(nr, (e) => {
      Xs(this, kt, e), this.observe(e == null ? void 0 : e.current, (t) => {
        this._data = t, He(this, Se, Js).call(this);
      });
    });
  }
  render() {
    const e = this._data;
    return e ? r`
      <uui-box headline="Sample">
        <p class="specimen" style=${this._sampleLoaded ? `font-family: ${ja(e.unique)}, serif` : ""}>
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
      return (i = ri(this, kt)) == null ? void 0 : i.setWeight(Number(t.target.value) || 400);
    }}>
          </uui-input>
          <uui-toggle
            id="italic"
            label="Italic"
            ?checked=${e.isItalic}
            @change=${(t) => {
      var i;
      return (i = ri(this, kt)) == null ? void 0 : i.setItalic(t.target.checked);
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
        ${He(this, Se, zu).call(this, e.styles)}
        <uui-button look="secondary" label="Add a named style" @click=${He(this, Se, Mu)}>Add a style</uui-button>
      </uui-box>

      <uui-box headline="Source">
        <dl>
          <dt>Family</dt>
          <dd>
            ${e.font.familyKey ? r`<a href=${oi(X, e.font.familyKey)}>${e.font.familyName}</a>` : e.font.familyName}
          </dd>
          <dt>File</dt>
          <dd>${Zf(e.font)}</dd>
        </dl>
      </uui-box>

      <uui-box headline="Used by">
        ${this._usedByTotal === 0 ? r`<p class="hint">No template uses this font.</p>` : r`<ul class="used-by">
              ${re(
      this._usedBy,
      (t) => t.key,
      (t) => r`<li>
                  <uui-ref-node name=${t.name} href=${Ba(t.key)}>
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
kt = /* @__PURE__ */ new WeakMap();
No = /* @__PURE__ */ new WeakMap();
Bo = /* @__PURE__ */ new WeakMap();
Se = /* @__PURE__ */ new WeakSet();
Js = async function() {
  var o;
  const e = (o = this._data) == null ? void 0 : o.unique, t = ri(this, No);
  if (!e || !t || ri(this, Bo) === e) return;
  Xs(this, Bo, e);
  const [i, a] = await Promise.all([
    or(e, t),
    Rc(e, 0, 50, t).catch(() => {
    })
  ]);
  this._sampleLoaded = !!i, this._usedBy = (a == null ? void 0 : a.items) ?? [], this._usedByTotal = (a == null ? void 0 : a.total) ?? 0;
};
Ru = async function() {
  var a;
  await this.updateComplete, await new Promise((o) => requestAnimationFrame(o));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
po = function(e, t) {
  var a, o;
  const i = [...((a = this._data) == null ? void 0 : a.styles) ?? []];
  i[e] = { ...i[e], ...t }, (o = ri(this, kt)) == null || o.setStyles(i);
};
Mu = function() {
  var e, t;
  (t = ri(this, kt)) == null || t.setStyles([...((e = this._data) == null ? void 0 : e.styles) ?? [], { name: "New style", size: 32, fontStyle: "Regular" }]), He(this, Se, Ru).call(this);
};
Lu = function(e) {
  var i, a;
  const t = [...((i = this._data) == null ? void 0 : i.styles) ?? []];
  t.splice(e, 1), (a = ri(this, kt)) == null || a.setStyles(t);
};
zu = function(e) {
  return e.length === 0 ? h : r`
      <uui-table>
        <uui-table-head>
          <uui-table-head-cell>Name</uui-table-head-cell>
          <uui-table-head-cell>Size</uui-table-head-cell>
          <uui-table-head-cell>Face</uui-table-head-cell>
          <uui-table-head-cell></uui-table-head-cell>
        </uui-table-head>
        ${re(
    e,
    (t, i) => i,
    (t, i) => r`
            <uui-table-row>
              <uui-table-cell>
                <uui-input
                  class="style-name"
                  label="Style name"
                  .value=${t.name}
                  @change=${(a) => He(this, Se, po).call(this, i, { name: a.target.value })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-input
                  type="number"
                  label="Size"
                  .value=${String(t.size)}
                  @change=${(a) => He(this, Se, po).call(this, i, { size: Number(a.target.value) })}>
                </uui-input>
              </uui-table-cell>
              <uui-table-cell>
                <uui-select
                  label="Face"
                  .options=${Jf.map((a) => ({ name: a, value: a, selected: a === t.fontStyle }))}
                  @change=${(a) => He(this, Se, po).call(this, i, { fontStyle: a.target.value })}>
                </uui-select>
              </uui-table-cell>
              <uui-table-cell>
                <uui-button
                  compact
                  look="secondary"
                  color="danger"
                  label="Remove ${t.name}"
                  @click=${() => He(this, Se, Lu).call(this, i)}>
                  <uui-icon name="icon-trash"></uui-icon>
                </uui-button>
              </uui-table-cell>
            </uui-table-row>
          `
  )}
      </uui-table>
    `;
};
Qe.styles = R`
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
Ka([
  m()
], Qe.prototype, "_data", 2);
Ka([
  m()
], Qe.prototype, "_sampleLoaded", 2);
Ka([
  m()
], Qe.prototype, "_usedBy", 2);
Ka([
  m()
], Qe.prototype, "_usedByTotal", 2);
Qe = Ka([
  A("di-font-workspace-view")
], Qe);
const Qf = Qe, eg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontWorkspaceViewElement() {
    return Qe;
  },
  default: Qf
}, Symbol.toStringTag, { value: "Module" }));
var tg = Object.defineProperty, ig = Object.getOwnPropertyDescriptor, Wu = (e) => {
  throw TypeError(e);
}, Va = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? ig(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && tg(t, i, o), o;
}, lr = (e, t, i) => t.has(e) || Wu("Cannot " + i), Dt = (e, t, i) => (lr(e, t, "read from private field"), t.get(e)), Xi = (e, t, i) => t.has(e) ? Wu("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ql = (e, t, i, a) => (lr(e, t, "write to private field"), t.set(e, i), i), Ge = (e, t, i) => (lr(e, t, "access private method"), i), ea, jo, ho, da, Ee, Zs, Uu, Nu, ta, Bu;
let et = class extends P {
  constructor() {
    super(), Xi(this, Ee), Xi(this, ea), Xi(this, jo), this._templates = [], this._fonts = [], this._loading = !0, Xi(this, ho, () => {
      Dt(this, ea) && Ge(this, Ee, Zs).call(this);
    }), Xi(this, da, () => {
      var e;
      return (e = Dt(this, ea)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(q, (e) => {
      Ql(this, jo, e);
    }), this.consumeContext(Oe, (e) => {
      Ql(this, ea, e), e && Ge(this, Ee, Zs).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Rs, Dt(this, ho));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Rs, Dt(this, ho));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${Ge(this, Ee, Nu).call(this)} ${Ge(this, Ee, Bu).call(this)}
      </umb-body-layout>
    `;
  }
};
ea = /* @__PURE__ */ new WeakMap();
jo = /* @__PURE__ */ new WeakMap();
ho = /* @__PURE__ */ new WeakMap();
da = /* @__PURE__ */ new WeakMap();
Ee = /* @__PURE__ */ new WeakSet();
Zs = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      wh(Dt(this, da)),
      Ms(Dt(this, da)).catch(() => []),
      jc(Dt(this, da)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    Ge(this, Ee, Uu).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Uu = function(e, t, i) {
  var o;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (o = Dt(this, jo)) == null || o.peek(e, { data: { headline: t, message: a } });
};
Nu = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((o) => o.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${Ge(this, Ee, ta).call(this, "Templates", this._templates.length, "icon-brush", !1, oi(Je))}
        ${Ge(this, Ee, ta).call(this, "Fonts", this._fonts.length, "icon-font", !1, oi(It))}
        ${Ge(this, Ee, ta).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${Ge(this, Ee, ta).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
ta = function(e, t, i, a = !1, o) {
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
Bu = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? h : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${re(
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
        <uui-button look="secondary" href=${fm("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
et.styles = R`
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
Va([
  m()
], et.prototype, "_templates", 2);
Va([
  m()
], et.prototype, "_fonts", 2);
Va([
  m()
], et.prototype, "_health", 2);
Va([
  m()
], et.prototype, "_loading", 2);
et = Va([
  A("di-overview-dashboard")
], et);
const ag = et, og = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return et;
  },
  default: ag
}, Symbol.toStringTag, { value: "Module" }));
var sg = Object.getOwnPropertyDescriptor, ng = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? sg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let Ko = class extends P {
  connectedCallback() {
    super.connectedCallback(), window.history.replaceState(null, "", oi(It));
  }
};
Ko = ng([
  A("di-fonts-redirect")
], Ko);
const rg = Ko, lg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsRedirectElement() {
    return Ko;
  },
  default: rg
}, Symbol.toStringTag, { value: "Module" }));
var cg = Object.defineProperty, ug = Object.getOwnPropertyDescriptor, ju = (e) => {
  throw TypeError(e);
}, qa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? ug(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && cg(t, i, o), o;
}, cr = (e, t, i) => t.has(e) || ju("Cannot " + i), mt = (e, t, i) => (cr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), so = (e, t, i) => t.has(e) ? ju("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ec = (e, t, i, a) => (cr(e, t, "write to private field"), t.set(e, i), i), _i = (e, t, i) => (cr(e, t, "access private method"), i), mo, wi, Bi, St, Vo, Qs, Ku;
let tt = class extends P {
  constructor() {
    super(), so(this, St), so(this, mo), so(this, wi), this._loading = !0, this._busy = !1, so(this, Bi, () => {
      var e;
      return (e = mt(this, mo)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(q, (e) => {
      ec(this, wi, e);
    }), this.consumeContext(Oe, (e) => {
      ec(this, mo, e), e && _i(this, St, Vo).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => _i(this, St, Vo).call(this)}>Re-check</uui-button>
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
                ${re(
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
                        ${a.templateKey ? r`<a href=${Ba(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${_i(this, St, Ku).call(this)}
      </umb-body-layout>
    `;
  }
};
mo = /* @__PURE__ */ new WeakMap();
wi = /* @__PURE__ */ new WeakMap();
Bi = /* @__PURE__ */ new WeakMap();
St = /* @__PURE__ */ new WeakSet();
Vo = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      jc(mt(this, Bi)),
      pm(mt(this, Bi)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
Qs = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const o = e === "export" ? await hm(mt(this, Bi)) : await mm(mt(this, Bi));
    (t = mt(this, wi)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${o.written} file(s) written.` : `${o.imported} template(s) imported.`
      }
    });
    for (const s of o.messages.slice(0, 3))
      (i = mt(this, wi)) == null || i.peek("warning", { data: { message: s } });
    await _i(this, St, Vo).call(this);
  } catch (o) {
    (a = mt(this, wi)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: o instanceof Error ? o.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Ku = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => _i(this, St, Qs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => _i(this, St, Qs).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : h;
};
tt.styles = R`
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
qa([
  m()
], tt.prototype, "_health", 2);
qa([
  m()
], tt.prototype, "_sync", 2);
qa([
  m()
], tt.prototype, "_loading", 2);
qa([
  m()
], tt.prototype, "_busy", 2);
tt = qa([
  A("di-health-dashboard")
], tt);
const dg = tt, pg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return tt;
  },
  default: dg
}, Symbol.toStringTag, { value: "Module" })), Vu = 3, qu = 12, Yu = 0.1, Hu = 0.9;
function hg(e) {
  return Math.max(Vu, Math.min(qu, e));
}
function mg(e) {
  return Math.max(Yu, Math.min(Hu, e));
}
function yg(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = hg(t), o = 0.5 * mg(i), s = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let p = 0; p < s; p++) {
    const y = (-90 + p * n) * Math.PI / 180, S = e === "star" && p % 2 === 1 ? o : 0.5;
    l.push({ x: 0.5 + S * Math.cos(y), y: 0.5 + S * Math.sin(y) });
  }
  return l;
}
function fg(e, t, i) {
  const a = yg(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((o) => `${(o.x * 100).toFixed(3)}% ${(o.y * 100).toFixed(3)}%`).join(", ")})`;
}
const b = {
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
  sides: { min: Vu, max: qu },
  innerRatio: { min: Yu, max: Hu }
}, qo = { min: 0.1, max: 4 };
function gg(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let o = a;
  return t !== void 0 && (o = Math.max(t, o)), i !== void 0 && (o = Math.min(i, o)), o;
}
function Gu(e) {
  const t = e.composedPath()[0];
  return t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) ? !0 : (t == null ? void 0 : t.isContentEditable) === !0;
}
const tc = "di:designer:palette-collapsed", ic = "di:designer:tree-collapsed";
function ac(e) {
  try {
    return localStorage.getItem(e) === "true";
  } catch {
    return !1;
  }
}
function oc(e, t) {
  try {
    t ? localStorage.setItem(e, "true") : localStorage.removeItem(e);
  } catch {
  }
}
const vg = "umb-split-panel-position", sc = "300px";
var $t, Mi, Tt, Li, zi, Pa, Ra, Ma, en;
class bg {
  constructor(t) {
    $(this, Ma);
    $(this, $t);
    $(this, Mi);
    $(this, Tt, !1);
    $(this, Li, "");
    $(this, zi, "");
    $(this, Pa, "");
    $(this, Ra, "");
    const i = t == null ? void 0 : t.shadowRoot, a = (i == null ? void 0 : i.querySelector("umb-split-panel")) ?? void 0, o = (i == null ? void 0 : i.querySelector("umb-section-sidebar")) ?? void 0;
    a && o && (v(this, $t, a), v(this, Mi, o));
  }
  get available() {
    return c(this, $t) !== void 0;
  }
  get collapsed() {
    return c(this, Tt);
  }
  collapse() {
    const t = c(this, $t), i = c(this, Mi);
    if (!t || !i || c(this, Tt)) return;
    v(this, Tt, !0), v(this, Li, t.position);
    const a = c(this, Ma, en);
    v(this, zi, t.style.getPropertyValue("--umb-split-panel-start-min-width")), v(this, Pa, i.style.display), v(this, Ra, (a == null ? void 0 : a.style.visibility) ?? ""), t.style.setProperty("--umb-split-panel-start-min-width", "0px"), i.style.display = "none", a && (a.style.visibility = "hidden"), t.position = "0px";
  }
  restore() {
    const t = c(this, $t), i = c(this, Mi);
    if (!t || !i || !c(this, Tt)) return;
    v(this, Tt, !1), c(this, zi) ? t.style.setProperty("--umb-split-panel-start-min-width", c(this, zi)) : t.style.removeProperty("--umb-split-panel-start-min-width"), i.style.display = c(this, Pa);
    const a = c(this, Ma, en);
    a && (a.style.visibility = c(this, Ra)), t.position = Xu(c(this, Li)) ? _g() : c(this, Li);
  }
}
$t = new WeakMap(), Mi = new WeakMap(), Tt = new WeakMap(), Li = new WeakMap(), zi = new WeakMap(), Pa = new WeakMap(), Ra = new WeakMap(), Ma = new WeakSet(), en = function() {
  var t, i;
  return ((i = (t = c(this, $t)) == null ? void 0 : t.shadowRoot) == null ? void 0 : i.querySelector("#divider")) ?? null;
};
function Xu(e) {
  return !e || parseFloat(e) === 0;
}
function _g() {
  try {
    const e = localStorage.getItem(vg);
    return e && !Xu(e) ? e : sc;
  } catch {
    return sc;
  }
}
function ur(e) {
  const t = e.kind ?? "linear", i = Math.round(tn(e.centreX ?? 0.5) * 100), a = Math.round(tn(e.centreY ?? 0.5) * 100);
  switch (t) {
    case "radial":
      return `radial-gradient(${e.shape ?? "ellipse"} ${$g(e.extent)} at ${i}% ${a}%, ${Ss(e)})`;
    case "angular":
      return `conic-gradient(from ${e.angle}deg at ${i}% ${a}%, ${Ss(e)})`;
    case "reflected":
      return `linear-gradient(${e.angle}deg, ${an(Tg(Ct(e)))})`;
    case "diamond": {
      const o = an(Ct(e).map((s) => ({ ...s, position: s.position / 2 })));
      return [
        `linear-gradient(to top left, ${o}) left top / ${i}% ${a}% no-repeat`,
        `linear-gradient(to top right, ${o}) right top / ${100 - i}% ${a}% no-repeat`,
        `linear-gradient(to bottom left, ${o}) left bottom / ${i}% ${100 - a}% no-repeat`,
        `linear-gradient(to bottom right, ${o}) right bottom / ${100 - i}% ${100 - a}% no-repeat`
      ].join(", ");
    }
    default:
      return `linear-gradient(${e.angle}deg, ${Ss(e)})`;
  }
}
function tn(e) {
  return Math.min(1, Math.max(0, e));
}
const wg = {
  farthestCorner: "farthest-corner",
  farthestSide: "farthest-side",
  closestCorner: "closest-corner",
  closestSide: "closest-side"
};
function $g(e) {
  return wg[e ?? "farthestCorner"] ?? "farthest-corner";
}
function Ct(e) {
  const t = e.stops;
  return !t || t.length < 2 ? [{ colour: e.from, position: 0 }, { colour: e.to, position: 1 }] : t.map((i, a) => ({ stop: { colour: i.colour, position: tn(i.position) }, index: a })).sort((i, a) => i.stop.position - a.stop.position || i.index - a.index).map(({ stop: i }) => i);
}
function Tg(e) {
  return [
    ...[...e].reverse().map((t) => ({ colour: t.colour, position: 0.5 - t.position / 2 })),
    ...e.map((t) => ({ colour: t.colour, position: 0.5 + t.position / 2 }))
  ];
}
function Ss(e) {
  const t = e.stops;
  return t && t.length >= 2 ? an(Ct(e)) : `${e.from}, ${e.to}`;
}
function an(e) {
  return e.map((t) => `${t.colour} ${dr(t.position * 100)}%`).join(", ");
}
const dr = (e) => Math.round(e * 100) / 100;
function wa(e, t) {
  const i = Ct({ ...e, stops: t });
  return { ...e, stops: t, from: i[0].colour, to: i[i.length - 1].colour };
}
function xg(e) {
  const t = [...Ct(e)].reverse().map((i) => ({ colour: i.colour, position: dr(1 - i.position) }));
  return wa(e, t);
}
function kg(e) {
  const t = Ct(e);
  let i = 0;
  for (let n = 1; n < t.length; n++)
    t[n].position - t[n - 1].position > t[i + 1].position - t[i].position && (i = n - 1);
  const a = t[i], o = t[i + 1], s = dr((a.position + o.position) / 2);
  return wa(e, [...t, { colour: Sg(a.colour, o.colour, 0.5), position: s }]);
}
function Dg(e, t) {
  const i = Ct(e);
  return i.length <= 2 ? e : wa(e, i.filter((a, o) => o !== t));
}
function Sg(e, t, i) {
  const a = nc(e), o = nc(t);
  if (!a || !o) return e;
  const s = (p) => Math.round(a[p] + (o[p] - a[p]) * i).toString(16).padStart(2, "0").toUpperCase(), n = `#${s(0)}${s(1)}${s(2)}`, l = s(3);
  return l === "FF" ? n : `${n}${l}`;
}
function nc(e) {
  const t = (e ?? "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t) || ![3, 4, 6, 8].includes(t.length)) return;
  const i = t.length <= 4 ? [...t].map((o) => o + o).join("") : t, a = (o) => parseInt(i.slice(o * 2, o * 2 + 2), 16);
  return [a(0), a(1), a(2), i.length === 8 ? a(3) : 255];
}
const pr = R`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Eg(e, t) {
  const i = [], a = t.lockX ? void 0 : rc(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Ig(t),
    t.threshold
  ), o = t.lockY ? void 0 : rc(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    Cg(t),
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
function Ig(e) {
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
function Cg(e) {
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
function rc(e, t, i) {
  let a;
  for (const o of e)
    for (const s of t) {
      const n = Math.abs(s.at - o.value);
      n > i || (!a || n < a.distance) && (a = { at: s.at, offset: o.offset, label: s.label, distance: n });
    }
  return a;
}
var Og = Object.defineProperty, Ag = Object.getOwnPropertyDescriptor, Ju = (e) => {
  throw TypeError(e);
}, lt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ag(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Og(t, i, o), o;
}, hr = (e, t, i) => t.has(e) || Ju("Cannot " + i), ke = (e, t, i) => (hr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Es = (e, t, i) => t.has(e) ? Ju("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Is = (e, t, i, a) => (hr(e, t, "write to private field"), t.set(e, i), i), J = (e, t, i) => (hr(e, t, "access private method"), i), Ut, ia, M, us, mr, Zu, Qu, ed, td, yr, Yo, id, ad, od, sd, nd, rd, ld, cd, ud;
const Fg = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], Cs = 18;
let Ie = class extends P {
  constructor() {
    super(...arguments), Es(this, M), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, Es(this, Ut), Es(this, ia);
  }
  willUpdate() {
    this._box = J(this, M, Zu).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== ke(this, ia) && ((t = ke(this, Ut)) == null || t.disconnect(), Is(this, ia, e), e && (ke(this, Ut) ?? Is(this, Ut, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), ke(this, Ut).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ke(this, Ut)) == null || e.disconnect(), Is(this, ia, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return h;
    const e = this._box;
    return r`
      <div
        class=${An({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${K({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...ke(this, M, Qu) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...J(this, M, yr).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      J(this, M, id).call(this, t), J(this, M, Yo).call(this, t);
    }}>
        ${J(this, M, ad).call(this)}
      </div>

      ${this.selected ? J(this, M, cd).call(this, e) : h}
      ${this.showMeasured && this.measured ? J(this, M, ud).call(this) : h}
    `;
  }
};
Ut = /* @__PURE__ */ new WeakMap();
ia = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
us = function() {
  return this.resolvedPosition ?? this.layer.position;
};
mr = function() {
  return this.layer.rotation ?? 0;
};
Zu = function() {
  var o;
  const e = this.layer, t = e.size.width ?? J(this, M, ed).call(this), i = e.size.height ?? ((o = this.measured) == null ? void 0 : o.height) ?? J(this, M, td).call(this), a = rs(ke(this, M, us), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
Qu = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
ed = function() {
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
td = function() {
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
yr = function(e) {
  const t = ke(this, M, mr);
  if (t === 0) return {};
  const i = ke(this, M, us);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Yo = function(e, t) {
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
id = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
ad = function() {
  switch (this.layer.type) {
    case "text":
      return J(this, M, od).call(this);
    case "image":
      return J(this, M, nd).call(this);
    case "badges":
      return J(this, M, rd).call(this);
    default:
      return J(this, M, ld).call(this);
  }
};
od = function() {
  if (this.layer.type !== "text") return h;
  const e = this.layer.style, t = this.resolvedText || J(this, M, sd).call(this);
  return r`
      <div
        class="text"
        style=${K({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${ja(e.fontKey)}, sans-serif`,
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
sd = function() {
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
nd = function() {
  if (this.layer.type !== "image") return h;
  const e = this.layer.border;
  return r`
      <div
        class="image"
        style=${K({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
rd = function() {
  if (this.layer.type !== "badges") return h;
  const { badge: e, label: t, gap: i, maxItems: a, direction: o, wrap: s, rowGap: n } = this.layer, l = o === "horizontal", p = l && s, y = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${K({
    flexDirection: l ? "row" : "column",
    flexWrap: p ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...p ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${re(
    Array.from({ length: Math.max(1, a) }, (S, E) => E),
    (S) => S,
    () => r`
            <div class=${An({ badge: !0, right: y === "right" })}>
              <div
                class="circle"
                style=${K({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${y === "none" ? h : r`<div
                    class="badge-label"
                    style=${K({
      ...y === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${ja(t.fontKey)}, sans-serif`,
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
ld = function() {
  if (this.layer.type !== "rect") return h;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? ur(i) : e.fill ?? "transparent", o = e.border, s = o ? o.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${K({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: o ? `${s}px solid ${o.colour}` : "none"
    })}>
        </div>
      `;
  const n = fg(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${K({ clipPath: n, background: o ? o.colour : "transparent" })}>
        <div class="shape-inner" style=${K({ inset: `${s}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
cd = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, o = e.height * this.scale, s = ke(this, M, us), n = ke(this, M, mr), l = Ue(this.layer.position, "x") || Ue(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${K({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${o}px`, ...J(this, M, yr).call(this, e) })}>
        <span
          class="tag"
          style=${K(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : h}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? h : r`
              ${re(
    Fg,
    (p) => p,
    (p) => r`
                  <span
                    class="handle ${p}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${p}"
                    @pointerdown=${(y) => J(this, M, Yo).call(this, y, p)}>
                  </span>
                `
  )}
              <span class="stalk" style=${K({ height: `${Cs}px`, top: `${-Cs}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${K({ top: `${-Cs}px` })}
                @pointerdown=${(p) => J(this, M, Yo).call(this, p, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${s.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${K({
    left: `${(s.x - e.x) * this.scale}px`,
    top: `${(s.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
ud = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return r`
      <div
        class="measured"
        style=${K({
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
Ie.styles = R`
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
lt([
  f({ type: Object })
], Ie.prototype, "layer", 2);
lt([
  f({ type: Number })
], Ie.prototype, "scale", 2);
lt([
  f({ type: Boolean, reflect: !0 })
], Ie.prototype, "selected", 2);
lt([
  f({ type: Object })
], Ie.prototype, "measured", 2);
lt([
  f({ type: Boolean })
], Ie.prototype, "showMeasured", 2);
lt([
  f({ type: String })
], Ie.prototype, "resolvedText", 2);
lt([
  f({ attribute: !1 })
], Ie.prototype, "resolvedPosition", 2);
lt([
  m()
], Ie.prototype, "_box", 2);
Ie = lt([
  A("di-layer-box")
], Ie);
var Pg = Object.defineProperty, Rg = Object.getOwnPropertyDescriptor, dd = (e) => {
  throw TypeError(e);
}, fr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Rg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Pg(t, i, o), o;
}, Mg = (e, t, i) => t.has(e) || dd("Cannot " + i), Lg = (e, t, i) => t.has(e) ? dd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), zg = (e, t, i) => (Mg(e, t, "access private method"), i), on, pd;
let $a = class extends P {
  constructor() {
    super(...arguments), Lg(this, on), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${re(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => zg(this, on, pd).call(this, e)
    )}`;
  }
};
on = /* @__PURE__ */ new WeakSet();
pd = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
$a.styles = R`
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
fr([
  f({ type: Array })
], $a.prototype, "guides", 2);
fr([
  f({ type: Number })
], $a.prototype, "scale", 2);
$a = fr([
  A("di-guides")
], $a);
var Wg = Object.defineProperty, Ug = Object.getOwnPropertyDescriptor, hd = (e) => {
  throw TypeError(e);
}, Ya = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ug(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Wg(t, i, o), o;
}, Ng = (e, t, i) => t.has(e) || hd("Cannot " + i), Bg = (e, t, i) => t.has(e) ? hd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), lc = (e, t, i) => (Ng(e, t, "access private method"), i), yo, sn;
let te = class extends P {
  constructor() {
    super(...arguments), Bg(this, yo), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    lc(this, yo, sn).call(this, "top"), lc(this, yo, sn).call(this, "left");
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
yo = /* @__PURE__ */ new WeakSet();
sn = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, o = a * this.scale, s = window.devicePixelRatio || 1;
  t.width = (e === "top" ? o : te.thickness) * s, t.height = (e === "top" ? te.thickness : o) * s, t.style.width = `${e === "top" ? o : te.thickness}px`, t.style.height = `${e === "top" ? te.thickness : o}px`, i.setTransform(s, 0, 0, s, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const p = Math.round(l * this.scale) + 0.5, y = l % 100 === 0, S = y ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(p, te.thickness - S), i.lineTo(p, te.thickness)) : (i.moveTo(te.thickness - S, p), i.lineTo(te.thickness, p)), i.stroke(), y && l > 0 && (e === "top" ? i.fillText(String(l), p + 2, 9) : (i.save(), i.translate(9, p - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
te.thickness = 20;
te.styles = R`
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
Ya([
  f({ type: Number })
], te.prototype, "canvasWidth", 2);
Ya([
  f({ type: Number })
], te.prototype, "canvasHeight", 2);
Ya([
  f({ type: Number })
], te.prototype, "scale", 2);
Ya([
  f({ type: Object })
], te.prototype, "pointer", 2);
te = Ya([
  A("di-rulers")
], te);
var jg = Object.defineProperty, Kg = Object.getOwnPropertyDescriptor, md = (e) => {
  throw TypeError(e);
}, Q = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Kg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && jg(t, i, o), o;
}, gr = (e, t, i) => t.has(e) || md("Cannot " + i), D = (e, t, i) => (gr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), W = (e, t, i) => t.has(e) ? md("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ke = (e, t, i, a) => (gr(e, t, "write to private field"), t.set(e, i), i), F = (e, t, i) => (gr(e, t, "access private method"), i), Nt, Bt, aa, Ta, oa, Et, O, vr, nn, br, ds, _r, rn, yd, fd, wr, gd, vd, ln, fo, bd, _d, yi, $r, wd, $d, cn, un, dn, go, vo, bo, pn, hn, mn, Td, yn, fn, gn, xd;
const Vg = 6, kd = 20, qg = 2, Yg = 15, Hg = 0.1, cc = 48, Gg = 16;
let V = class extends P {
  constructor() {
    super(...arguments), W(this, O), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, this._spaceHeld = !1, this._panning = !1, this._offset = { x: 0, y: 0 }, W(this, Nt), W(this, Bt), W(this, aa, !1), W(this, Ta, { x: 0, y: 0 }), W(this, oa), W(this, Et, /* @__PURE__ */ new Map()), W(this, ln, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = F(this, O, _r).call(this, t), a = F(this, O, rn).call(this, t), o = F(this, O, yd).call(this, t), s = F(this, O, ds).call(this, e.detail.startX, e.detail.startY);
      Ke(this, Nt, {
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
    }), W(this, fo, (e) => {
      var le, pt;
      F(this, O, wd).call(this, e.clientX, e.clientY);
      const t = D(this, Bt);
      if (t) {
        if (e.pointerId !== t.pointerId) return;
        F(this, O, un).call(this, t.startOffset.x + e.clientX - t.startX, t.startOffset.y + e.clientY - t.startY);
        return;
      }
      const i = D(this, Nt);
      if (!i) return;
      const a = this.template.layers.find((Hi) => Hi.key === i.key);
      if (!a) return;
      const o = (e.clientX - i.startClientX) / this.scale, s = (e.clientY - i.startClientY) / this.scale;
      if (!i.moved && Math.abs(o) < 1 && Math.abs(s) < 1) return;
      if (i.moved = !0, i.handle === "rotate") {
        F(this, O, _d).call(this, a, i, e);
        return;
      }
      const n = Ue(a.position, "x"), l = Ue(a.position, "y"), p = i.startRotation, y = e.shiftKey || a.type === "rect" && a.lockAspect === !0;
      if (i.handle && p !== 0) {
        F(this, O, bd).call(this, a, i, i.handle, o, s, y, n, l);
        return;
      }
      let S = i.handle ? F(this, O, $r).call(this, i.startBox, i.handle, o, s, y) : { ...i.startBox, x: i.startBox.x + o, y: i.startBox.y + s };
      n && (S = { ...S, x: i.startBox.x, width: (le = i.handle) != null && le.includes("w") ? i.startBox.width : S.width }), l && (S = { ...S, y: i.startBox.y, height: (pt = i.handle) != null && pt.includes("n") ? i.startBox.height : S.height });
      const E = { x: i.startExtent.x - i.startBox.x, y: i.startExtent.y - i.startBox.y }, z = p !== 0 ? { x: S.x + E.x, y: S.y + E.y, width: i.startExtent.width, height: i.startExtent.height } : S, pe = this.snapEnabled && !e.altKey ? Eg(z, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((Hi) => Hi.key !== a.key).map((Hi) => F(this, O, rn).call(this, Hi)),
        threshold: Vg / this.scale,
        lockX: n,
        lockY: l
      }) : {
        box: {
          ...z,
          x: n ? z.x : Math.round(z.x),
          y: l ? z.y : Math.round(z.y)
        },
        guides: []
      };
      this._guides = pe.guides;
      const we = p !== 0 ? { ...S, x: pe.box.x - E.x, y: pe.box.y - E.y } : pe.box, Pt = xm(we, a.position);
      n && (Pt.x = a.position.x), l && (Pt.y = a.position.y);
      const Yi = { position: Pt };
      i.handle && (Yi.size = {
        width: Math.max(1, Math.round(we.width)),
        height: Math.max(1, Math.round(we.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: a.key, patch: Yi } })
      );
    }), W(this, yi, (e) => {
      if (D(this, Bt)) {
        if (e.pointerId !== D(this, Bt).pointerId) return;
        Ke(this, Bt, void 0), this._panning = !1;
        return;
      }
      if (!D(this, Nt)) return;
      const t = D(this, Nt).moved;
      Ke(this, Nt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: t } }));
    }), W(this, cn, {
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
          Ke(this, Bt, {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            startOffset: { ...this._offset }
          }), this._panning = !0;
        }
      }
    }), W(this, dn, (e) => {
      e.button === 1 && e.preventDefault();
    }), W(this, go, (e) => {
      e.key !== " " || !D(this, aa) || Gu(e) || (e.preventDefault(), !e.repeat && (this._spaceHeld = !0));
    }), W(this, vo, (e) => {
      e.key !== " " || !this._spaceHeld || (e.preventDefault(), this._spaceHeld = !1);
    }), W(this, bo, () => {
      this._spaceHeld = !1;
    }), W(this, pn, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), W(this, hn, () => {
      this._dropTarget = !1;
    }), W(this, mn, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = F(this, O, br).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: F(this, O, Td).call(this, e) }
        })
      );
    }), W(this, yn, (e) => {
      if (e.preventDefault(), !e.ctrlKey && !e.metaKey) {
        const i = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? Gg : 1;
        let a = e.deltaX * i, o = e.deltaY * i;
        e.shiftKey && a === 0 && ([a, o] = [o, 0]), F(this, O, un).call(this, this._offset.x - a, this._offset.y - o);
        return;
      }
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), W(this, fn, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => Jc(t.position)) && this.requestUpdate();
    }), W(this, gn, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), Ke(this, oa, new ResizeObserver(() => F(this, O, nn).call(this))), D(this, oa).observe(this), window.addEventListener("pointermove", D(this, fo)), window.addEventListener("pointerup", D(this, yi)), window.addEventListener("pointercancel", D(this, yi)), window.addEventListener("keydown", D(this, go)), window.addEventListener("keyup", D(this, vo)), window.addEventListener("blur", D(this, bo));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = D(this, oa)) == null || e.disconnect(), window.removeEventListener("pointermove", D(this, fo)), window.removeEventListener("pointerup", D(this, yi)), window.removeEventListener("pointercancel", D(this, yi)), window.removeEventListener("keydown", D(this, go)), window.removeEventListener("keyup", D(this, vo)), window.removeEventListener("blur", D(this, bo));
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
    F(this, O, nn).call(this), e.has("zoom") && F(this, O, vr).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = D(this, Et).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return h;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((s) => [s.key, s]));
    F(this, O, fd).call(this);
    const o = this.showRulers ? kd : 0;
    return Ke(this, Ta, this._offset), r`
      <div
        class=${An({
      viewport: !0,
      "drop-target": this._dropTarget,
      "pan-ready": this._spaceHeld,
      panning: this._panning
    })}
        @pointerdown=${D(this, cn)}
        @mousedown=${D(this, dn)}
        @pointerenter=${() => {
      Ke(this, aa, !0);
    }}
        @pointerleave=${() => {
      Ke(this, aa, !1);
    }}
        @wheel=${D(this, yn)}
        @dragover=${D(this, pn)}
        @dragleave=${D(this, hn)}
        @drop=${D(this, mn)}
        @di-layer-drag-start=${D(this, ln)}
        @di-layer-box-resize=${D(this, fn)}>
        <div
          class="artboard"
          style=${K({
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
            style=${K({
      background: e.backgroundGradient ? ur(e.backgroundGradient) : e.background
    })}
            @pointerdown=${D(this, gn)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${K({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : h}

            ${re(
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
                  .resolvedPosition=${(l = D(this, Et).get(s.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? F(this, O, xd).call(this) : h}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
Nt = /* @__PURE__ */ new WeakMap();
Bt = /* @__PURE__ */ new WeakMap();
aa = /* @__PURE__ */ new WeakMap();
Ta = /* @__PURE__ */ new WeakMap();
oa = /* @__PURE__ */ new WeakMap();
Et = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
vr = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
nn = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? kd : 0) + qg, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, F(this, O, vr).call(this));
};
br = function(e, t) {
  const i = F(this, O, ds).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
ds = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
_r = function(e) {
  const t = D(this, Et).get(e.key);
  if (t) return t.box;
  const i = F(this, O, wr).call(this, e), a = rs(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
rn = function(e) {
  const t = D(this, Et).get(e.key);
  return t ? t.extent : Xc(F(this, O, _r).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
yd = function(e) {
  var t;
  return ((t = D(this, Et).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
fd = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  Ke(this, Et, Cm(
    this.template.layers,
    (i) => F(this, O, wr).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
wr = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? F(this, O, gd).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? F(this, O, vd).call(this, e, i)
  };
};
gd = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
vd = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
ln = /* @__PURE__ */ new WeakMap();
fo = /* @__PURE__ */ new WeakMap();
bd = function(e, t, i, a, o, s, n, l) {
  const p = t.startRotation, y = t.startPosition, S = km(a, o, 0, 0, p);
  let E = F(this, O, $r).call(this, t.startBox, i, S.x, S.y, s);
  n && (E = { ...E, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : E.width }), l && (E = { ...E, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : E.height });
  const z = Math.max(1, Math.round(E.width)), Fe = Math.max(1, Math.round(E.height)), pe = Wn(E.x, E.y, z, Fe, y.anchor), we = fi(pe.x, pe.y, y.x, y.y, p), Pt = {
    ...e.position,
    x: n ? e.position.x : Math.round(we.x),
    y: l ? e.position.y : Math.round(we.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Pt, size: { width: z, height: Fe } } }
    })
  );
};
_d = function(e, t, i) {
  const a = t.startPosition, o = F(this, O, ds).call(this, i.clientX, i.clientY), n = (Math.atan2(o.y - a.y, o.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, p = i.shiftKey ? Yg : Hg, y = Gc(Math.round(l / p) * p);
  this._guides = [], y !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: y } }
    })
  );
};
yi = /* @__PURE__ */ new WeakMap();
$r = function(e, t, i, a, o) {
  let { x: s, y: n, width: l, height: p } = e;
  if (t.includes("w") && (s = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, p = e.height - a), t.includes("s") && (p = e.height + a), o && e.width > 0 && e.height > 0) {
    const y = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(p - e.height) ? p = l / y : l = p * y, t.includes("n") && (n = e.y + e.height - p), t.includes("w") && (s = e.x + e.width - l);
  }
  return { x: s, y: n, width: Math.max(4, l), height: Math.max(4, p) };
};
wd = function(e, t) {
  var s, n, l;
  const i = (s = this.template) == null ? void 0 : s.canvas, a = i ? F(this, O, br).call(this, e, t) : void 0, o = i && a && a.x >= 0 && a.y >= 0 && a.x <= i.width && a.y <= i.height ? a : void 0;
  (o == null ? void 0 : o.x) === ((n = this._pointer) == null ? void 0 : n.x) && (o == null ? void 0 : o.y) === ((l = this._pointer) == null ? void 0 : l.y) || (this._pointer = o);
};
$d = function() {
  return this.renderRoot.querySelector(".viewport");
};
cn = /* @__PURE__ */ new WeakMap();
un = function(e, t) {
  var o, s;
  const i = (o = F(this, O, $d).call(this)) == null ? void 0 : o.getBoundingClientRect(), a = (s = this.renderRoot.querySelector(".artboard")) == null ? void 0 : s.getBoundingClientRect();
  if (i && a) {
    const n = a.left - D(this, Ta).x, l = a.top - D(this, Ta).y, p = Math.min(cc, a.width), y = Math.min(cc, a.height);
    e = Math.min(Math.max(e, i.left + p - (n + a.width)), i.right - p - n), t = Math.min(Math.max(t, i.top + y - (l + a.height)), i.bottom - y - l);
  }
  e === this._offset.x && t === this._offset.y || (this._offset = { x: e, y: t });
};
dn = /* @__PURE__ */ new WeakMap();
go = /* @__PURE__ */ new WeakMap();
vo = /* @__PURE__ */ new WeakMap();
bo = /* @__PURE__ */ new WeakMap();
pn = /* @__PURE__ */ new WeakMap();
hn = /* @__PURE__ */ new WeakMap();
mn = /* @__PURE__ */ new WeakMap();
Td = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
yn = /* @__PURE__ */ new WeakMap();
fn = /* @__PURE__ */ new WeakMap();
gn = /* @__PURE__ */ new WeakMap();
xd = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${K({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
V.styles = R`
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
      ${pr}
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
Q([
  f({ type: Object })
], V.prototype, "template", 2);
Q([
  f({ type: String })
], V.prototype, "selectedLayerKey", 2);
Q([
  f({ type: Object })
], V.prototype, "baseImageUrl", 2);
Q([
  f({ type: Array })
], V.prototype, "serverBounds", 2);
Q([
  f({ type: Boolean })
], V.prototype, "showMeasured", 2);
Q([
  f({ type: Boolean })
], V.prototype, "snapEnabled", 2);
Q([
  f({ type: Boolean })
], V.prototype, "showRulers", 2);
Q([
  f({ type: Boolean })
], V.prototype, "showSafeArea", 2);
Q([
  f({ type: Number })
], V.prototype, "zoom", 2);
Q([
  m()
], V.prototype, "_fitScale", 2);
Q([
  m()
], V.prototype, "_guides", 2);
Q([
  m()
], V.prototype, "_pointer", 2);
Q([
  m()
], V.prototype, "_dropTarget", 2);
Q([
  m()
], V.prototype, "_spaceHeld", 2);
Q([
  m()
], V.prototype, "_panning", 2);
Q([
  m()
], V.prototype, "_offset", 2);
V = Q([
  A("di-designer-canvas")
], V);
var Xg = Object.defineProperty, Jg = Object.getOwnPropertyDescriptor, Dd = (e) => {
  throw TypeError(e);
}, ps = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Jg(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Xg(t, i, o), o;
}, Sd = (e, t, i) => t.has(e) || Dd("Cannot " + i), Zg = (e, t, i) => (Sd(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Qg = (e, t, i) => t.has(e) ? Dd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ue = (e, t, i) => (Sd(e, t, "access private method"), i), Z, Ed, Tr, xr, vn, Id, Cd, Od, Ad, pa;
const uc = {
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
let ji = class extends P {
  constructor() {
    super(...arguments), Qg(this, Z), this.properties = [], this.collapsed = !1, this._search = "";
  }
  render() {
    if (this.collapsed)
      return r`
        <div class="rail">
          <uui-button compact look="secondary" label="Expand the elements panel" @click=${ue(this, Z, vn)}>
            <uui-icon name="icon-navigation-right"></uui-icon>
          </uui-button>
        </div>
      `;
    const e = ev(Zg(this, Z, Ed));
    return r`
      <div class="palette">
        <div class="top">
          <uui-input
            type="search"
            label="Search properties"
            placeholder="Search"
            .value=${this._search}
            @input=${(t) => {
      this._search = t.target.value;
    }}>
          </uui-input>
          <uui-button compact look="secondary" label="Collapse the elements panel" @click=${ue(this, Z, vn)}>
            <uui-icon name="icon-navigation-left"></uui-icon>
          </uui-button>
        </div>

        ${ue(this, Z, Cd).call(this)}

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : re(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => ue(this, Z, Id).call(this, t, i)
    )}
      </div>
    `;
  }
};
Z = /* @__PURE__ */ new WeakSet();
Ed = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Tr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
xr = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
vn = function() {
  this.dispatchEvent(
    new CustomEvent("di-palette-toggle", { bubbles: !0, composed: !0, detail: { collapsed: !this.collapsed } })
  );
};
Id = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${re(
    t,
    (i) => i.alias,
    (i) => ue(this, Z, pa).call(
      this,
      i.name,
      uc[i.classification] ?? uc.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Cd = function() {
  return r`
      <div class="group">
        <h5>Elements</h5>
        ${ue(this, Z, pa).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${ue(this, Z, pa).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${ue(this, Z, pa).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${ue(this, Z, Od).call(this)}
      </div>
    `;
};
Od = function() {
  const e = { kind: "static", layerType: "rect", preset: "rectangle" };
  return r`
      <div
        class="chip other shape"
        draggable="true"
        title="Shape"
        @dragstart=${(t) => ue(this, Z, xr).call(this, t, e)}>
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
          ${gm.map((t) => r`
            <uui-menu-item
              label=${ga[t].label}
              data-preset=${t}
              @click-label=${() => ue(this, Z, Ad).call(this, t)}>
              <uui-icon slot="icon" name=${ga[t].icon}></uui-icon>
            </uui-menu-item>
          `)}
        </div>
      </uui-popover-container>
    `;
};
Ad = function(e) {
  var t, i, a;
  (a = (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#shape-menu")) == null ? void 0 : i.hidePopover) == null || a.call(i), ue(this, Z, Tr).call(this, { kind: "static", layerType: "rect", preset: e });
};
pa = function(e, t, i, a, o) {
  const s = o ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${s}
        @dragstart=${(n) => ue(this, Z, xr).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${s}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${o ?? `Add ${e} to the canvas`}
          @click=${() => ue(this, Z, Tr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
ji.styles = R`
    :host {
      display: block;
      height: 100%;
      overflow: auto;
      border-right: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    :host([collapsed]) {
      overflow: hidden;
    }

    .palette {
      padding: var(--uui-size-space-3);
      display: grid;
      gap: var(--uui-size-space-4);
    }

    .top {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
    }

    .top uui-input {
      flex: 1 1 auto;
      min-width: 0;
    }

    .rail {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-space-2) 0;
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
ps([
  f({ type: Array })
], ji.prototype, "properties", 2);
ps([
  f({ type: Boolean, reflect: !0 })
], ji.prototype, "collapsed", 2);
ps([
  m()
], ji.prototype, "_search", 2);
ji = ps([
  A("di-property-palette")
], ji);
function ev(e) {
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
function tv(e) {
  return e.backgroundGradient ? "gradient" : iv(e.background) ? "transparent" : "colour";
}
function iv(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function av(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((o) => o + o).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var ov = Object.defineProperty, sv = Object.getOwnPropertyDescriptor, Fd = (e) => {
  throw TypeError(e);
}, kr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? sv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && ov(t, i, o), o;
}, nv = (e, t, i) => t.has(e) || Fd("Cannot " + i), rv = (e, t, i) => t.has(e) ? Fd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), dc = (e, t, i) => (nv(e, t, "access private method"), i), _o, bn;
let xa = class extends P {
  constructor() {
    super(...arguments), rv(this, _o), this.value = "#FFFFFF", this.label = "Colour";
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
          @change=${dc(this, _o, bn)}></uui-color-picker>
        <uui-input
          label="${this.label} (hex)"
          spellcheck="false"
          .value=${this.value}
          @change=${dc(this, _o, bn)}></uui-input>
      </div>
    `;
  }
};
_o = /* @__PURE__ */ new WeakSet();
bn = function(e) {
  e.stopPropagation();
  const t = pc(e.target.value);
  !t || t === pc(this.value) || (this.value = t, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: t } })));
};
xa.styles = R`
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
kr([
  f({ type: String })
], xa.prototype, "value", 2);
kr([
  f({ type: String })
], xa.prototype, "label", 2);
xa = kr([
  A("di-colour-input")
], xa);
function pc(e) {
  const t = (e ?? "").trim(), i = t.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(i) || ![3, 4, 6, 8].includes(i.length)) return t;
  const o = (i.length <= 4 ? [...i].map((s) => s + s).join("") : i).toUpperCase();
  return o.length === 8 && o.endsWith("FF") ? `#${o.slice(0, 6)}` : `#${o}`;
}
var lv = Object.defineProperty, cv = Object.getOwnPropertyDescriptor, Pd = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? cv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && lv(t, i, o), o;
};
const hc = {
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
let Ho = class extends P {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${re(
      Hc,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${hc[e]}
              title=${hc[e]}
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
Ho.styles = R`
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
Pd([
  f({ type: String })
], Ho.prototype, "value", 2);
Ho = Pd([
  A("di-anchor-picker")
], Ho);
var uv = Object.defineProperty, dv = Object.getOwnPropertyDescriptor, Rd = (e) => {
  throw TypeError(e);
}, ct = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? dv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && uv(t, i, o), o;
}, pv = (e, t, i) => t.has(e) || Rd("Cannot " + i), hv = (e, t, i) => t.has(e) ? Rd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), mv = (e, t, i) => (pv(e, t, "access private method"), i), _n, Md;
let Ce = class extends P {
  constructor() {
    super(...arguments), hv(this, _n), this.label = "", this.suffix = "px", this.step = 1, this.compact = !1, this.placeholder = "Auto";
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
          @change=${mv(this, _n, Md)} />
        ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : h}
      </span>
    `;
    return !this.label || this.compact ? e : r`<umb-property-layout orientation="vertical" label=${this.label}>${e}</umb-property-layout>`;
  }
};
_n = /* @__PURE__ */ new WeakSet();
Md = function(e) {
  const t = e.target, i = t.value, a = gg(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const o = a === null ? "" : String(a);
  o !== i && (t.value = o), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Ce.styles = R`
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
ct([
  f({ type: Number })
], Ce.prototype, "value", 2);
ct([
  f({ type: String })
], Ce.prototype, "label", 2);
ct([
  f({ type: String })
], Ce.prototype, "suffix", 2);
ct([
  f({ type: Number })
], Ce.prototype, "step", 2);
ct([
  f({ type: Number })
], Ce.prototype, "min", 2);
ct([
  f({ type: Number })
], Ce.prototype, "max", 2);
ct([
  f({ type: Boolean, reflect: !0 })
], Ce.prototype, "compact", 2);
ct([
  f({ type: String })
], Ce.prototype, "placeholder", 2);
Ce = ct([
  A("di-number-field")
], Ce);
var yv = Object.defineProperty, fv = Object.getOwnPropertyDescriptor, Ld = (e) => {
  throw TypeError(e);
}, di = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? fv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && yv(t, i, o), o;
}, gv = (e, t, i) => t.has(e) || Ld("Cannot " + i), vv = (e, t, i) => t.has(e) ? Ld("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (gv(e, t, "access private method"), i), u, w, $e, zd, Wd, Ud, Dr, Nd, Bd, jd, wn, Kd, Vd, qd, Yd, Hd, Gd, $n, Xd, Jd, Tn, Zd, wo, Qd, ep, Sr, Ne, Vi, tp, Er, ip;
const bv = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let it = class extends P {
  constructor() {
    super(...arguments), vv(this, u), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? d(this, u, Kd).call(this, this.layer) : d(this, u, zd).call(this)}</div>` : h;
  }
};
u = /* @__PURE__ */ new WeakSet();
w = function(e) {
  this.layer && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: this.layer.key, patch: e }
    })
  );
};
$e = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
zd = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="stack">
          <di-number-field
            .min=${b.width.min}
            .max=${b.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => d(this, u, $e).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${b.height.min}
            .max=${b.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => d(this, u, $e).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${d(this, u, Wd).call(this, e)}

        <umb-property-layout orientation="vertical" label="Base image">

          <div slot="editor" class="editor">
          <uui-select
            label="Base image source"
            .value=${e.baseImage.kind}
            .options=${ap(e.baseImage.kind)}
            @change=${(t) => d(this, u, $e).call(this, {
    baseImage: { ...e.baseImage, kind: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.baseImage.kind === "media" ? d(this, u, Ne).call(this, "Media item", d(this, u, Sr).call(this, e.baseImage.mediaKey, (t) => d(this, u, $e).call(this, { baseImage: { ...e.baseImage, kind: "media", mediaKey: t } }))) : h}

        ${e.baseImage.kind === "path" ? r`<umb-property-layout orientation="vertical" label="Path">

              <div slot="editor" class="editor">
              <uui-input
                .value=${e.baseImage.path ?? ""}
                placeholder="/assets/og-background.png"
                @change=${(t) => d(this, u, $e).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : h}

        ${e.baseImage.kind === "property" ? r`<umb-property-layout orientation="vertical" label="From property">

              <div slot="editor" class="editor">
              ${d(this, u, Vi).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, $e).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.baseImageFit}
            .options=${G(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => d(this, u, $e).call(this, { baseImageFit: t.target.value })}>
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
Wd = function(e) {
  const t = tv(e);
  return r`
      <umb-property-layout orientation="vertical" label="Fill">

        <div slot="editor" class="editor">
        <uui-select
          .value=${t}
          .options=${G(["colour", "gradient", "transparent"], t)}
          @change=${(i) => d(this, u, Ud).call(this, e, i.target.value)}>
        </uui-select>
      </div>

      </umb-property-layout>

      ${t === "colour" ? r`<umb-property-layout orientation="vertical" label="Colour">

            <div slot="editor" class="editor">
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => d(this, u, $e).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </div>

          </umb-property-layout>` : h}

      ${t === "gradient" && e.backgroundGradient ? d(this, u, Dr).call(this, e.backgroundGradient, (i) => d(this, u, $e).call(this, { backgroundGradient: i })) : h}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : h}
    `;
};
Ud = function(e, t) {
  if (t === "gradient") {
    d(this, u, $e).call(this, { backgroundGradient: e.backgroundGradient ?? Yc() });
    return;
  }
  d(this, u, $e).call(this, {
    background: av(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
Dr = function(e, t) {
  const i = e.kind ?? "linear", a = i === "linear" || i === "reflected" || i === "angular", o = i === "radial" || i === "angular" || i === "diamond";
  return r`
      ${d(this, u, Ne).call(this, "Gradient type", r`
        <uui-select
          label="Gradient type"
          .value=${i}
          .options=${G(["linear", "radial", "angular", "diamond", "reflected"], i, _v)}
          @change=${(s) => t({ ...e, kind: s.target.value })}>
        </uui-select>
      `)}

      <div class="gradient-preview" role="img" aria-label="The gradient" style="background: ${ur(e)}"></div>

      ${a ? d(this, u, Nd).call(this, e, t) : h}
      ${i === "radial" ? d(this, u, Bd).call(this, e, t) : h}
      ${o ? r`
            ${d(this, u, wn).call(this, "Centre X", e.centreX, (s) => t({ ...e, centreX: s }))}
            ${d(this, u, wn).call(this, "Centre Y", e.centreY, (s) => t({ ...e, centreY: s }))}
          ` : h}

      ${d(this, u, jd).call(this, e, t)}
    `;
};
Nd = function(e, t) {
  const i = Math.round(e.angle ?? 180) % 360, a = (o) => t({ ...e, angle: (Math.round(o) % 360 + 360) % 360 });
  return d(this, u, Ne).call(this, e.kind === "angular" ? "Start angle" : "Angle", r`
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
          .min=${b.gradientAngle.min}
          .max=${b.gradientAngle.max}
          .value=${i}
          @change=${(o) => a(o.detail.value ?? 180)}>
        </di-number-field>
        <uui-button-group>
          ${$v.map(([o, s, n]) => r`
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
Bd = function(e, t) {
  const i = e.shape ?? "ellipse", a = e.extent ?? "farthestCorner";
  return r`
      ${d(this, u, Ne).call(this, "Shape", r`
        <uui-select
          label="Radial shape"
          .value=${i}
          .options=${G(["ellipse", "circle"], i)}
          @change=${(o) => t({ ...e, shape: o.target.value })}>
        </uui-select>
      `)}
      ${d(this, u, Ne).call(this, "Size", r`
        <uui-select
          label="Radial size"
          .value=${a}
          .options=${G(["farthestCorner", "farthestSide", "closestCorner", "closestSide"], a, wv)}
          @change=${(o) => t({ ...e, extent: o.target.value })}>
        </uui-select>
      `, "Where the last colour lands.")}
    `;
};
jd = function(e, t) {
  const i = Ct(e);
  return d(this, u, Ne).call(this, "Colour stops", r`
      <div class="stops">
        ${i.map((a, o) => r`
          <div class="stop">
            <di-colour-input
              label="Stop ${o + 1} colour"
              .value=${a.colour}
              @change=${(s) => t(wa(e, i.map((n, l) => l === o ? { ...n, colour: s.detail.value } : n)))}>
            </di-colour-input>
            <div class="stop-position">
              <di-number-field
                label="Position"
                suffix="%"
                .min=${0}
                .max=${100}
                .value=${Math.round(a.position * 100)}
                @change=${(s) => t(wa(e, i.map((n, l) => l === o ? { ...n, position: (s.detail.value ?? 0) / 100 } : n)))}>
              </di-number-field>
              <uui-button
                compact
                look="secondary"
                color="danger"
                label="Remove stop ${o + 1}"
                ?disabled=${i.length <= 2}
                @click=${() => t(Dg(e, o))}>
                <uui-icon name="icon-trash"></uui-icon>
              </uui-button>
            </div>
          </div>
        `)}
        <div class="stop-actions">
          <uui-button look="secondary" label="Add stop" @click=${() => t(kg(e))}>
            <uui-icon name="icon-add"></uui-icon> Add stop
          </uui-button>
          <uui-button look="secondary" label="Reverse the gradient" @click=${() => t(xg(e))}>
            <uui-icon name="icon-sync"></uui-icon> Reverse
          </uui-button>
        </div>
      </div>
    `);
};
wn = function(e, t, i) {
  return r`<di-number-field
      .min=${b.gradientCentre.min * 100}
      .max=${b.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
Kd = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, w).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, Vd).call(this, e) : h}
      ${e.type === "text" ? d(this, u, qd).call(this, e) : h}
      ${e.type === "image" ? d(this, u, Yd).call(this, e) : h}
      ${e.type === "badges" ? d(this, u, Hd).call(this, e) : h}
      ${e.type === "rect" ? d(this, u, Xd).call(this, e) : h}
      ${d(this, u, Jd).call(this, e)} ${d(this, u, ep).call(this, e)}
    `;
};
Vd = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${G(
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
            @change=${(i) => d(this, u, w).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? d(this, u, Ne).call(this, "Property", d(this, u, Vi).call(this, t.propertyAlias ?? "", (i) => d(this, u, w).call(this, { binding: { ...t, propertyAlias: i } }))) : h}

        ${t.kind === "date" ? r`<umb-property-layout orientation="vertical" label="Date format">

              <div slot="editor" class="editor">
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => d(this, u, w).call(this, {
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
                @change=${(i) => d(this, u, w).call(this, {
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
              @change=${(i) => d(this, u, w).call(this, { prefix: i.target.value })}>
            </uui-input>
          </div>

          </umb-property-layout>
          <umb-property-layout orientation="vertical" label="Suffix">

            <div slot="editor" class="editor">
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => d(this, u, w).call(this, { suffix: i.target.value })}>
            </uui-input>
          </div>

          </umb-property-layout>
        </div>
      </uui-box>
    `;
};
qd = function(e) {
  const t = e.style, i = (a) => d(this, u, w).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <umb-property-layout orientation="vertical" label="Font">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, Er).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${d(this, u, ip).call(this, t.fontKey, t.styleName ?? "", (a, o, s) => i({ styleName: a || null, fontSize: o ?? t.fontSize, fontStyle: s ?? t.fontStyle }))}

        <div class="stack">
          <di-number-field
            .min=${b.fontSize.min}
            .max=${b.fontSize.max}
            label="Size"
            .value=${t.fontSize}
            @change=${(a) => i({ fontSize: a.detail.value ?? t.fontSize })}>
          </di-number-field>
          <umb-property-layout orientation="vertical" label="Weight">

            <div slot="editor" class="editor">
            <uui-select
              .value=${t.fontStyle}
              .options=${G(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${G(["left", "centre", "right"], t.textAlign)}
            @change=${(a) => i({ textAlign: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        <div class="stack">
          <di-number-field
            .min=${b.lineSpacing.min}
            .max=${b.lineSpacing.max}
            label="Line spacing"
            suffix="×"
            step="0.05"
            .value=${t.lineSpacing}
            @change=${(a) => i({ lineSpacing: a.detail.value ?? 1 })}>
          </di-number-field>
          <di-number-field
            .min=${b.letterSpacing.min}
            .max=${b.letterSpacing.max}
            label="Letter spacing"
            .value=${t.letterSpacing}
            @change=${(a) => i({ letterSpacing: a.detail.value ?? 0 })}>
          </di-number-field>
        </div>

        <div class="stack">
          <di-number-field
            .min=${b.maxLines.min}
            .max=${b.maxLines.max}
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
              .options=${G(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${G(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
Yd = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <umb-property-layout orientation="vertical" label="Source">

          <div slot="editor" class="editor">
          <uui-select
            .value=${t.kind}
            .options=${ap(t.kind)}
            @change=${(a) => d(this, u, w).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${t.kind === "property" ? d(this, u, Ne).call(this, "Property", d(this, u, Vi).call(
    this,
    t.propertyAlias ?? "",
    (a) => d(this, u, w).call(this, { source: { ...t, propertyAlias: a } }),
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
                @change=${(a) => d(this, u, w).call(this, {
    source: { ...t, path: a.target.value }
  })}>
              </uui-input>
            </div>

            </umb-property-layout>` : h}

        ${t.kind === "media" ? d(this, u, Ne).call(this, "Media item", d(this, u, Sr).call(this, t.mediaKey, (a) => d(this, u, w).call(this, { source: { ...t, kind: "media", mediaKey: a } }))) : h}

        <umb-property-layout orientation="vertical" label="Fit">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.fit}
            .options=${G(["cover", "contain", "stretch"], e.fit)}
            @change=${(a) => d(this, u, w).call(this, { fit: a.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        <di-number-field
          .min=${b.cornerRadius.min}
          .max=${b.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => d(this, u, w).call(this, { cornerRadius: a.detail.value ?? 0 })}>
        </di-number-field>

        <umb-property-layout orientation="vertical" label="Border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-number-field
              .min=${b.borderWidth.min}
              .max=${b.borderWidth.max}
              label="Width"
              .value=${((i = e.border) == null ? void 0 : i.width) ?? 0}
              @change=${(a) => {
    var s;
    const o = a.detail.value ?? 0;
    d(this, u, w).call(this, {
      border: o > 0 ? { width: o, colour: ((s = e.border) == null ? void 0 : s.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => d(this, u, w).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : h}
          </div>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
Hd = function(e) {
  const t = (o) => d(this, u, w).call(this, { badge: { ...e.badge, ...o } }), i = (o) => d(this, u, w).call(this, { label: { ...e.label, ...o } }), a = (o) => d(this, u, w).call(this, { icon: { ...e.icon, ...o } });
  return r`
      <uui-box headline="Badges">
        <umb-property-layout orientation="vertical" label="Items from">

          <div slot="editor" class="editor">
          ${d(this, u, Vi).call(this, e.itemsPropertyAlias, (o) => d(this, u, w).call(this, { itemsPropertyAlias: o }))}
        </div>

        </umb-property-layout>

        <div class="stack">
          <di-number-field
            .min=${b.maxItems.min}
            .max=${b.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(o) => d(this, u, w).call(this, { maxItems: o.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${b.gap.min}
            .max=${b.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(o) => d(this, u, w).call(this, { gap: o.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <umb-property-layout orientation="vertical" label="Direction">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.direction}
            .options=${G(["horizontal", "vertical"], e.direction)}
            @change=${(o) => d(this, u, w).call(this, { direction: o.target.value })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.direction === "horizontal" ? r`
              <umb-property-layout orientation="vertical" label="Wrap onto new rows">

                <div slot="editor" class="editor">
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(o) => d(this, u, w).call(this, { wrap: o.target.checked })}>
                </uui-toggle>
              </div>

              </umb-property-layout>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${b.rowGap.min}
                      .max=${b.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(o) => d(this, u, w).call(this, { rowGap: o.detail.value ?? 20 })}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  ` : h}
            ` : h}

        <div class="stack">
          <di-number-field
            .min=${b.circleSize.min}
            .max=${b.circleSize.max}
            label="Circle size"
            .value=${e.badge.size}
            @change=${(o) => t({ size: o.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
            .min=${b.iconSize.min}
            .max=${b.iconSize.max}
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
              .min=${b.borderWidth.min}
              .max=${b.borderWidth.max}
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
            .options=${G(["below", "right", "none"], e.label.position, {
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
                  .options=${d(this, u, Er).call(this, e.label.fontKey)}
                  @change=${(o) => i({ fontKey: o.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>

              <div class="stack">
                <di-number-field
                  .min=${b.labelSize.min}
                  .max=${b.labelSize.max}
                  label="Label size"
                  .value=${e.label.fontSize}
                  @change=${(o) => i({ fontSize: o.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
                  .min=${b.labelGap.min}
                  .max=${b.labelGap.max}
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
                  .options=${G(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(o) => i({ textTransform: o.target.value })}>
                </uui-select>
              </div>

              </umb-property-layout>
            `}
      </uui-box>
    `;
};
Gd = function(e, t) {
  if (t === "circle") {
    const a = e.size.width ?? e.size.height ?? 200;
    d(this, u, w).call(this, { shape: "ellipse", lockAspect: !0, size: { ...e.size, width: a, height: a } });
    return;
  }
  const i = xn(e) === "circle";
  d(this, u, w).call(this, {
    shape: t,
    ...i ? { lockAspect: !1 } : {}
  });
};
$n = function(e, t, i) {
  const a = e.type === "rect" && e.lockAspect === !0, { width: o, height: s } = e.size;
  if (!a || i === null || !o || !s) {
    d(this, u, w).call(this, { size: { ...e.size, [t]: i } });
    return;
  }
  const n = t === "width" ? { width: i, height: Math.round(i * s / o) } : { width: Math.round(i * o / s), height: i };
  d(this, u, w).call(this, { size: n });
};
Xd = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <umb-property-layout orientation="vertical" label="Shape">

          <div slot="editor" class="editor">
          <uui-select
            .value=${xn(e)}
            .options=${G(["rectangle", "circle", "ellipse", "polygon", "star"], xn(e))}
            @change=${(o) => d(this, u, Gd).call(this, e, o.target.value)}>
          </uui-select>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Lock aspect ratio">

          <div slot="editor" class="editor">
          <uui-toggle
            label="Lock aspect ratio"
            ?checked=${e.lockAspect === !0}
            @change=${(o) => d(this, u, w).call(this, { lockAspect: o.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${t === "polygon" || t === "star" ? r`
              <div class="stack">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  .min=${b.sides.min}
                  .max=${b.sides.max}
                  .value=${e.sides ?? 5}
                  @change=${(o) => d(this, u, w).call(this, { sides: Math.round(o.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${b.innerRatio.min}
                      .max=${b.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(o) => d(this, u, w).call(this, { innerRatio: o.detail.value ?? 0.5 })}>
                    </di-number-field>` : h}
              </div>
            ` : h}

        <umb-property-layout orientation="vertical" label="Fill">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${i}
            @change=${(o) => d(this, u, w).call(this, { fill: o.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${i ? r`<umb-property-layout orientation="vertical" label="Fill colour">

              <div slot="editor" class="editor">
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(o) => d(this, u, w).call(this, { fill: o.detail.value })}>
              </di-colour-input>
            </div>

            </umb-property-layout>` : h}

        <umb-property-layout orientation="vertical" label="Gradient">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(o) => d(this, u, w).call(this, {
    gradient: o.target.checked ? Yc() : null
  })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        ${e.gradient ? d(this, u, Dr).call(this, e.gradient, (o) => d(this, u, w).call(this, { gradient: o })) : h}

        ${t === "rectangle" ? r`<di-number-field
            .min=${b.cornerRadius.min}
            .max=${b.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(o) => d(this, u, w).call(this, { cornerRadius: o.detail.value ?? 0 })}>
            </di-number-field>` : h}

        <umb-property-layout orientation="vertical" label="Border">

          <div slot="editor" class="editor">
          <div class="stack">
            <di-number-field
              .min=${b.borderWidth.min}
              .max=${b.borderWidth.max}
              label="Width"
              .value=${((a = e.border) == null ? void 0 : a.width) ?? 0}
              @change=${(o) => {
    var n;
    const s = o.detail.value ?? 0;
    d(this, u, w).call(this, {
      border: s > 0 ? { width: s, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(o) => d(this, u, w).call(this, { border: { ...e.border, colour: o.detail.value } })}>
                </di-colour-input>` : h}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </div>

        </umb-property-layout>
      </uui-box>
    `;
};
Jd = function(e) {
  const t = Ue(e.position, "x"), i = Ue(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${d(this, u, Tn).call(this, e, "x")} ${d(this, u, Tn).call(this, e, "y")}

        <umb-property-layout orientation="vertical" label="Anchor">

          <div slot="editor" class="editor">
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(o) => d(this, u, Qd).call(this, e, o.detail.value)}>
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
            @change=${(o) => d(this, u, w).call(this, { rotation: Gc(o.detail.value ?? 0) })}>
          </di-number-field>
          <small class="hint">Clockwise, around the anchor point. Drag the handle above the selection on the canvas; hold Shift for 15° steps.</small>
        </div>

        <div class="stack">
          <di-number-field
            .min=${b.width.min}
            .max=${b.width.max}
            label="Width"
            placeholder="Auto"
            .value=${e.size.width ?? null}
            @change=${(o) => d(this, u, $n).call(this, e, "width", o.detail.value)}>
          </di-number-field>
          <di-number-field
            .min=${b.height.min}
            .max=${b.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(o) => d(this, u, $n).call(this, e, "height", o.detail.value)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
Tn = function(e, t) {
  const i = Ue(e.position, t), a = Co(e.position, t), o = this.template.layers.filter((n) => n.key !== e.key), s = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => d(this, u, Zd).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => d(this, u, wo).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${G(s, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => d(this, u, wo).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </div>

              </umb-property-layout>

              <di-number-field
                .min=${b.referenceGap.min}
                .max=${b.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => d(this, u, wo).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? b.x.min : b.y.min}
                .max=${t === "x" ? b.x.max : b.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => d(this, u, w).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
Zd = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Ue(e.position, t)) return;
  const a = this.template.layers.findIndex((s) => s.key === e.key), o = this.template.layers[a - 1] ?? this.template.layers.find((s) => s.key !== e.key);
  o && d(this, u, w).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: o.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Dm
      }
    }
  });
};
wo = function(e, t, i) {
  const a = Co(e.position, t);
  a && d(this, u, w).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Qd = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, o = i > 0 && a > 0 ? Tm(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, w).call(this, { position: o });
};
ep = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <umb-property-layout orientation="vertical" label="Visible">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => d(this, u, w).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        <umb-property-layout orientation="vertical" label="Locked">

          <div slot="editor" class="editor">
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => d(this, u, w).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </div>

        </umb-property-layout>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${b.opacity.min}
          .max=${b.opacity.max}
          .value=${e.opacity}
          @change=${(t) => d(this, u, w).call(this, { opacity: t.detail.value ?? 1 })}>
        </di-number-field>

        <umb-property-layout orientation="vertical" label="Show this layer">

          <div slot="editor" class="editor">
          <uui-select
            .value=${e.visibility.rule}
            .options=${G(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
    always: "Always",
    whenNotEmpty: "When it has a value",
    whenPropertyTruthy: "When another property is set"
  })}
            @change=${(t) => d(this, u, w).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </div>

        </umb-property-layout>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<umb-property-layout orientation="vertical" label="Controlled by">

              <div slot="editor" class="editor">
              ${d(this, u, Vi).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, w).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </div>

            </umb-property-layout>` : h}
      </uui-box>
    `;
};
Sr = function(e, t) {
  return r`
      <umb-input-media
        max="1"
        .selection=${e ? [e] : []}
        @change=${(i) => t(i.target.selection[0] ?? null)}>
      </umb-input-media>
    `;
};
Ne = function(e, t, i) {
  return r`
      <umb-property-layout orientation="vertical" label=${e} description=${fa(i)}>
        <div slot="editor" class="editor">${t}</div>
      </umb-property-layout>
    `;
};
Vi = function(e, t, i = {}) {
  const a = Am(e), o = [];
  for (let s = 0; s <= Ws; s++) {
    const n = Xr(a, s), l = s === 0 ? this.properties : this.linkedProperties[n] ?? [], p = a[s] ?? "";
    if (s > 0) {
      const E = (s === 1 ? this.properties : this.linkedProperties[Xr(a, s - 1)] ?? []).some(
        (z) => z.alias === a[s - 1] && z.classification === "content"
      );
      if (!a[s - 1] || !E && !p) break;
    }
    const y = d(this, u, tp).call(this, bv(l, s === 0 ? i.root : i.tail), p, (S) => t([...a.slice(0, s), S].filter(Boolean).join(".")));
    o.push(s === 0 ? y : r`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[n] ?? "Property on the linked item"}</span>
            ${y}
          </div>`);
  }
  return o.length === 1 ? o[0] : r`<div class="path">${o}</div>`;
};
tp = function(e, t, i) {
  return r`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${Lm(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
Er = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
ip = function(e, t, i) {
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
it.styles = R`
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
di([
  f({ type: Object })
], it.prototype, "template", 2);
di([
  f({ type: Object })
], it.prototype, "layer", 2);
di([
  f({ type: Array })
], it.prototype, "properties", 2);
di([
  f({ type: Object })
], it.prototype, "linkedProperties", 2);
di([
  f({ type: Object })
], it.prototype, "linkedCaptions", 2);
di([
  f({ type: Array })
], it.prototype, "fonts", 2);
it = di([
  A("di-layer-inspector")
], it);
function G(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
const _v = {
  linear: "Linear",
  radial: "Radial",
  angular: "Angular (conic)",
  diamond: "Diamond",
  reflected: "Reflected"
}, wv = {
  farthestCorner: "Farthest corner",
  farthestSide: "Farthest side",
  closestCorner: "Closest corner",
  closestSide: "Closest side"
}, $v = [
  ["↑", 0, "Upwards (0°)"],
  ["→", 90, "To the right (90°)"],
  ["↓", 180, "Downwards (180°)"],
  ["←", 270, "To the left (270°)"]
];
function ap(e) {
  return G(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
function xn(e) {
  const t = e.shape ?? "rectangle";
  return t === "ellipse" && e.lockAspect === !0 ? "circle" : t;
}
var Tv = Object.defineProperty, xv = Object.getOwnPropertyDescriptor, op = (e) => {
  throw TypeError(e);
}, qi = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? xv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Tv(t, i, o), o;
}, kv = (e, t, i) => t.has(e) || op("Cannot " + i), Dv = (e, t, i) => t.has(e) ? op("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ye = (e, t, i) => (kv(e, t, "access private method"), i), se, yt, sp, np, rp, lp, cp, up;
const Sv = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Ot = class extends P {
  constructor() {
    super(...arguments), Dv(this, se), this.layers = [], this.expanded = !1;
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${ye(this, se, rp)}>
        <h5>
          <!-- The panel is docked at the bottom and grows upwards, so the chevron points where the
               header is about to move: up to open, down to close - the same as the preview strip. -->
          <button
            class="toggle"
            type="button"
            aria-expanded=${this.expanded}
            @click=${() => this.expanded = !this.expanded}>
            <uui-icon name=${this.expanded ? "icon-navigation-down" : "icon-navigation-up"}></uui-icon>
            Layers <span class="count">(${e.length})</span>
          </button>
        </h5>

        ${this.expanded ? ye(this, se, lp).call(this, e) : h}
      </div>
    `;
  }
};
se = /* @__PURE__ */ new WeakSet();
yt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
sp = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
np = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
rp = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  ye(this, se, yt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
lp = function(e) {
  return r`
        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : re(
    e,
    (t) => t.key,
    (t, i) => ye(this, se, up).call(this, t, i)
  )}

        ${ye(this, se, cp).call(this)}
    `;
};
cp = function() {
  const e = !this.selectedLayerKey, t = () => ye(this, se, yt).call(this, "di-layer-select", { key: void 0 });
  return r`
      <div
        class="row background ${e ? "selected" : ""}"
        role="button"
        tabindex="0"
        aria-pressed=${e}
        title="Canvas settings: size, fill and base image"
        @click=${t}
        @keydown=${(i) => {
    i.key !== "Enter" && i.key !== " " || (i.preventDefault(), t());
  }}>
        <uui-icon name="icon-picture"></uui-icon>
        <span class="name">Background</span>
      </div>
    `;
};
up = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => ye(this, se, sp).call(this, a, e.key)}
        @dragover=${(a) => ye(this, se, np).call(this, a, t)}
        @click=${() => ye(this, se, yt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Sv[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ye(this, se, yt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ye(this, se, yt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ye(this, se, yt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ye(this, se, yt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Ot.styles = R`
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
qi([
  f({ type: Array })
], Ot.prototype, "layers", 2);
qi([
  f({ type: String })
], Ot.prototype, "selectedLayerKey", 2);
qi([
  f({ type: Boolean, reflect: !0 })
], Ot.prototype, "expanded", 2);
qi([
  m()
], Ot.prototype, "_dragKey", 2);
qi([
  m()
], Ot.prototype, "_dropIndex", 2);
Ot = qi([
  A("di-layers-panel")
], Ot);
var Ev = Object.defineProperty, Iv = Object.getOwnPropertyDescriptor, dp = (e) => {
  throw TypeError(e);
}, Ae = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Iv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Ev(t, i, o), o;
}, Ir = (e, t, i) => t.has(e) || dp("Cannot " + i), Cv = (e, t, i) => (Ir(e, t, "read from private field"), i ? i.call(e) : t.get(e)), mc = (e, t, i) => t.has(e) ? dp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ov = (e, t, i, a) => (Ir(e, t, "write to private field"), t.set(e, i), i), ee = (e, t, i) => (Ir(e, t, "access private method"), i), Y, ze, Go, pp, hp, mp, sa;
let ve = class extends P {
  constructor() {
    super(...arguments), mc(this, Y), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, this.treeAvailable = !1, this.treeCollapsed = !1, mc(this, Go, 100);
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
        ${ee(this, Y, mp).call(this)}

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
              @click=${() => ee(this, Y, ze).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
              <uui-icon name="icon-zoom-out"></uui-icon>
            </uui-button>
            <di-number-field
              compact
              class="value"
              label="Zoom"
              suffix="%"
              step="5"
              .min=${qo.min * 100}
              .max=${qo.max * 100}
              .value=${ee(this, Y, pp).call(this)}
              @change=${ee(this, Y, hp)}>
            </di-number-field>
            <uui-button
              compact
              look="secondary"
              label="Zoom in"
              @click=${() => ee(this, Y, ze).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
              <uui-icon name="icon-zoom-in"></uui-icon>
            </uui-button>
          </div>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => ee(this, Y, ze).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${ee(this, Y, sa).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${ee(this, Y, sa).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${ee(this, Y, sa).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${ee(this, Y, sa).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => ee(this, Y, ze).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => ee(this, Y, ze).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => ee(this, Y, ze).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
Y = /* @__PURE__ */ new WeakSet();
ze = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Go = /* @__PURE__ */ new WeakMap();
pp = function() {
  return this.matches(":focus-within") || Ov(this, Go, Math.round(this.effectiveScale * 100)), Cv(this, Go);
};
hp = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && ee(this, Y, ze).call(this, "di-zoom-change", { zoom: t / 100 });
};
mp = function() {
  return this.treeAvailable ? r`
      <uui-button
        compact
        class="tree"
        look="secondary"
        label=${this.treeCollapsed ? "Show tree" : "Hide tree"}
        @click=${() => ee(this, Y, ze).call(this, "di-toggle-tree")}>
        <uui-icon name=${this.treeCollapsed ? "icon-navigation-right" : "icon-navigation-left"}></uui-icon>
        ${this.treeCollapsed ? "Show tree" : "Hide tree"}
      </uui-button>
    ` : h;
};
sa = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => ee(this, Y, ze).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
ve.styles = R`
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
Ae([
  f({ type: Number })
], ve.prototype, "effectiveScale", 2);
Ae([
  f({ type: Boolean })
], ve.prototype, "snapEnabled", 2);
Ae([
  f({ type: Boolean })
], ve.prototype, "showRulers", 2);
Ae([
  f({ type: Boolean })
], ve.prototype, "showSafeArea", 2);
Ae([
  f({ type: Boolean })
], ve.prototype, "showMeasured", 2);
Ae([
  f({ type: Boolean })
], ve.prototype, "canUndo", 2);
Ae([
  f({ type: Boolean })
], ve.prototype, "canRedo", 2);
Ae([
  f({ type: Boolean })
], ve.prototype, "previewing", 2);
Ae([
  f({ type: Boolean })
], ve.prototype, "treeAvailable", 2);
Ae([
  f({ type: Boolean })
], ve.prototype, "treeCollapsed", 2);
ve = Ae([
  A("di-canvas-toolbar")
], ve);
var Av = Object.defineProperty, Fv = Object.getOwnPropertyDescriptor, yp = (e) => {
  throw TypeError(e);
}, Cr = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Fv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Av(t, i, o), o;
}, Or = (e, t, i) => t.has(e) || yp("Cannot " + i), vi = (e, t, i) => (Or(e, t, "read from private field"), t.get(e)), no = (e, t, i) => t.has(e) ? yp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), kn = (e, t, i, a) => (Or(e, t, "write to private field"), t.set(e, i), i), yc = (e, t, i) => (Or(e, t, "access private method"), i), Ki, $o, ha, To, fp, gp;
let ka = class extends P {
  constructor() {
    super(), no(this, To), no(this, Ki), this._selection = [], no(this, $o, ""), no(this, ha), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(At, (e) => {
      kn(this, Ki, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== vi(this, $o) && (kn(this, $o, i), yc(this, To, fp).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
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
          @change=${yc(this, To, gp)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
Ki = /* @__PURE__ */ new WeakMap();
$o = /* @__PURE__ */ new WeakMap();
ha = /* @__PURE__ */ new WeakMap();
To = /* @__PURE__ */ new WeakSet();
fp = async function(e) {
  if (!vi(this, Ki)) return;
  vi(this, ha) ?? kn(this, ha, zc(vi(this, Ki).getToken).catch(() => []));
  const t = await vi(this, ha), i = new Set(e), a = t.filter((o) => i.has(o.alias)).map((o) => o.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
gp = function(e) {
  var i;
  const t = e.target.selection;
  (i = vi(this, Ki)) == null || i.setSampleContentKey(t[0]);
};
ka.styles = R`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
Cr([
  m()
], ka.prototype, "_selection", 2);
Cr([
  m()
], ka.prototype, "_allowedContentTypeIds", 2);
ka = Cr([
  A("di-preview-content-picker")
], ka);
var Pv = Object.defineProperty, Rv = Object.getOwnPropertyDescriptor, vp = (e) => {
  throw TypeError(e);
}, Ha = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Rv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Pv(t, i, o), o;
}, Ar = (e, t, i) => t.has(e) || vp("Cannot " + i), ie = (e, t, i) => (Ar(e, t, "read from private field"), t.get(e)), Lt = (e, t, i) => t.has(e) ? vp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ei = (e, t, i, a) => (Ar(e, t, "write to private field"), t.set(e, i), i), Ye = (e, t, i) => (Ar(e, t, "access private method"), i), ft, $i, Ti, ti, Xo, Jo, De, Fr, xo, Pr, Dn;
const Mv = 400;
let li = class extends P {
  constructor() {
    super(), Lt(this, De), Lt(this, ft), Lt(this, $i), Lt(this, Ti), Lt(this, ti), Lt(this, Xo), Lt(this, Jo, !0), this._loading = !1, this._collapsed = !0, this.consumeContext(At, (e) => {
      ei(this, ft, e), e && (this.observe(e.template, (t) => {
        t && Ye(this, De, xo).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        ei(this, Xo, t);
        const i = (a = ie(this, ft)) == null ? void 0 : a.getData();
        i && Ye(this, De, xo).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        ei(this, Jo, t ?? !0);
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
    const e = (t = ie(this, ft)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(ie(this, $i)), this._collapsed = !1, Ye(this, De, Pr).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(ie(this, $i)), (e = ie(this, Ti)) == null || e.abort(), Ye(this, De, Fr).call(this);
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
        const t = (e = ie(this, ft)) == null ? void 0 : e.getData();
        t && Ye(this, De, xo).call(this, t);
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
ft = /* @__PURE__ */ new WeakMap();
$i = /* @__PURE__ */ new WeakMap();
Ti = /* @__PURE__ */ new WeakMap();
ti = /* @__PURE__ */ new WeakMap();
Xo = /* @__PURE__ */ new WeakMap();
Jo = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakSet();
Fr = function() {
  ie(this, ti) && (URL.revokeObjectURL(ie(this, ti)), ei(this, ti, void 0));
};
xo = function(e) {
  this._collapsed || (window.clearTimeout(ie(this, $i)), ei(this, $i, window.setTimeout(() => void Ye(this, De, Pr).call(this, e), Mv)));
};
Pr = async function(e) {
  var t;
  if (ie(this, ft)) {
    (t = ie(this, Ti)) == null || t.abort(), ei(this, Ti, new AbortController()), Ye(this, De, Dn).call(this, !0), this._error = void 0;
    try {
      const i = await Wc(
        e,
        {
          signal: ie(this, Ti).signal,
          contentKey: ie(this, Xo),
          useSampleData: ie(this, Jo)
        },
        ie(this, ft).getToken
      );
      Ye(this, De, Fr).call(this), ei(this, ti, URL.createObjectURL(i)), this._url = ie(this, ti);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ye(this, De, Dn).call(this, !1);
    }
  }
};
Dn = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
li.styles = R`
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
      ${pr}
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
Ha([
  m()
], li.prototype, "_url", 2);
Ha([
  m()
], li.prototype, "_loading", 2);
Ha([
  m()
], li.prototype, "_error", 2);
Ha([
  m()
], li.prototype, "_collapsed", 2);
li = Ha([
  A("di-preview-strip")
], li);
var Lv = Object.defineProperty, zv = Object.getOwnPropertyDescriptor, bp = (e) => {
  throw TypeError(e);
}, B = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? zv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Lv(t, i, o), o;
}, Rr = (e, t, i) => t.has(e) || bp("Cannot " + i), _ = (e, t, i) => (Rr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), zt = (e, t, i) => t.has(e) ? bp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ma = (e, t, i, a) => (Rr(e, t, "write to private field"), t.set(e, i), i), xe = (e, t, i) => (Rr(e, t, "access private method"), i), C, Da, Sa, xi, Pe, j, Sn, hs, _p, wp, En, $p, Tp, xp, In, kp, Dp, Sp, ko;
const Wv = 400;
let L = class extends P {
  constructor() {
    super(), zt(this, j), zt(this, C), zt(this, Da), zt(this, Sa), zt(this, xi), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, this._paletteCollapsed = ac(tc), zt(this, Pe), this._treeAvailable = !1, this._treeCollapsed = ac(ic), zt(this, ko, (e) => {
      var o;
      if (Gu(e)) return;
      const t = _(this, C);
      if (!t) return;
      const i = e.ctrlKey || e.metaKey;
      if (i && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? t.redo() : t.undo();
        return;
      }
      const a = _(this, j, Sn);
      if (a) {
        if (i && e.key.toLowerCase() === "d") {
          e.preventDefault(), t.duplicateLayer(a.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), xe(this, j, En).call(this, a.key);
            break;
          case "Escape":
            t.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const s = e.shiftKey ? 10 : 1, n = e.key === "ArrowLeft" ? -s : e.key === "ArrowRight" ? s : 0, l = e.key === "ArrowUp" ? -s : e.key === "ArrowDown" ? s : 0, p = Ue(a.position, "x") ? 0 : n, y = Ue(a.position, "y") ? 0 : l;
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
    }), this.consumeContext(q, (e) => {
      ma(this, Da, e);
    }), this.consumeContext(ph, (e) => {
      var t;
      (t = _(this, Pe)) == null || t.restore(), ma(this, Pe, new bg(e == null ? void 0 : e.getHostElement())), this._treeAvailable = _(this, Pe).available, this._treeCollapsed && this.isConnected && _(this, Pe).collapse();
    }), this.consumeContext(At, (e) => {
      ma(this, C, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (xe(this, j, $p).call(this, t), xe(this, j, Tp).call(this, t), xe(this, j, xp).call(this));
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
    var e;
    super.connectedCallback(), window.addEventListener("keydown", _(this, ko)), this._treeCollapsed && ((e = _(this, Pe)) == null || e.collapse());
  }
  disconnectedCallback() {
    var e, t;
    super.disconnectedCallback(), window.removeEventListener("keydown", _(this, ko)), (e = _(this, Pe)) == null || e.restore(), window.clearTimeout(_(this, Sa)), (t = _(this, xi)) == null || t.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout ${this._paletteCollapsed ? "palette-collapsed" : ""}"
        @di-palette-toggle=${(e) => {
      this._paletteCollapsed = e.detail.collapsed, oc(tc, this._paletteCollapsed);
    }}
        @di-layer-change=${(e) => {
      var t;
      return (t = _(this, C)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = _(this, C)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = _(this, C)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => xe(this, j, En).call(this, e.detail.key)}
        @di-layer-detach=${(e) => xe(this, j, wp).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = _(this, C)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = _(this, C)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = _(this, C)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = _(this, C)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = _(this, C)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = _(this, C)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => xe(this, j, In).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => xe(this, j, In).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-use-image-size=${xe(this, j, Sp)}
        @di-request-preview=${() => {
      var e;
      return (e = _(this, j, _p)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(qo.min, Math.min(qo.max, e.detail.zoom));
    }}
        @di-zoom-fit=${() => {
      var e;
      (e = _(this, j, hs)) == null || e.recentre(), this._zoom = void 0;
    }}
        @di-toggle-tree=${() => {
      var e, t;
      this._treeCollapsed = !this._treeCollapsed, this._treeCollapsed ? (e = _(this, Pe)) == null || e.collapse() : (t = _(this, Pe)) == null || t.restore(), oc(ic, this._treeCollapsed);
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
      return (e = _(this, C)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = _(this, C)) == null ? void 0 : e.redo();
    }}>
        <di-property-palette
          class="palette"
          .properties=${this._properties}
          .collapsed=${this._paletteCollapsed}>
        </di-property-palette>

        <div class="centre">
          <di-canvas-toolbar
            .effectiveScale=${this._effectiveScale}
            .snapEnabled=${this._snapEnabled}
            .showRulers=${this._showRulers}
            .showSafeArea=${this._showSafeArea}
            .showMeasured=${this._showMeasured}
            .canUndo=${this._canUndo}
            .canRedo=${this._canRedo}
            .previewing=${this._previewing}
            .treeAvailable=${this._treeAvailable}
            .treeCollapsed=${this._treeCollapsed}>
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
            .layer=${_(this, j, Sn)}
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
Da = /* @__PURE__ */ new WeakMap();
Sa = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
Pe = /* @__PURE__ */ new WeakMap();
j = /* @__PURE__ */ new WeakSet();
Sn = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
hs = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
_p = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
wp = function(e, t) {
  var o, s, n;
  const i = (o = this._template) == null ? void 0 : o.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (s = _(this, j, hs)) == null ? void 0 : s.resolvedPositionOf(e);
  (n = _(this, C)) == null || n.updateLayer(e, { position: zs(i.position, t, a) });
};
En = function(e) {
  var i, a, o;
  const t = /* @__PURE__ */ new Map();
  for (const s of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = _(this, j, hs)) == null ? void 0 : a.resolvedPositionOf(s.key);
    n && t.set(s.key, n);
  }
  (o = _(this, C)) == null || o.removeLayer(e, t);
};
$p = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && _(this, C) && await bf(t, _(this, C).getToken);
};
Tp = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !_(this, C)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Nc(t.mediaKey, _(this, C).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
xp = function() {
  window.clearTimeout(_(this, Sa)), ma(this, Sa, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !_(this, C))) {
      (t = _(this, xi)) == null || t.abort(), ma(this, xi, new AbortController());
      try {
        const i = await Uc(
          e,
          { signal: _(this, xi).signal, useSampleData: !0 },
          _(this, C).getToken
        );
        _(this, C).setServerBounds(i.layers), _(this, C).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, Wv));
};
In = function(e, t, i, a) {
  const o = this._template;
  if (!o || !_(this, C)) return;
  const s = { template: o, x: t, y: i, defaultFontKey: xe(this, j, Dp).call(this) };
  if (e.kind === "property") {
    const l = _m(e.property, s);
    if (l.kind === "condition") {
      xe(this, j, kp).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    _(this, C).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? Vc(s, "Image") : e.layerType === "badges" ? qc(s, "Badges", "") : e.layerType === "rect" ? vm(s, "Shape", e.preset) : Kc(s, "Text", { kind: "static", text: "Text" });
  _(this, C).addLayer(n);
};
kp = function(e, t, i) {
  var s, n, l, p;
  const a = i ?? this._selectedKey, o = (s = this._template) == null ? void 0 : s.layers.find((y) => y.key === a);
  if (!o) {
    (n = _(this, Da)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = _(this, C)) == null || l.updateLayer(o.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (p = _(this, Da)) == null || p.peek("positive", {
    data: { message: `'${o.name}' now shows only when '${t}' is ticked.` }
  });
};
Dp = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Sp = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !_(this, C)) return;
  const t = await Nc(e.mediaKey, _(this, C).getToken).catch(() => {
  });
  t && _(this, C).updateCanvas({ width: t.width, height: t.height });
};
ko = /* @__PURE__ */ new WeakMap();
L.styles = R`
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

    /* A collapsed palette is a rail wide enough for its one expand button. */
    .layout.palette-collapsed {
      grid-template-columns: 40px 1fr 340px;
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

      .layout.palette-collapsed {
        grid-template-columns: 40px 1fr;
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

      /* One column, so the palette sits above the canvas in the row that has the canvas' floor.
         Folded away it is only as tall as its rail, and the floor moves down to the canvas. */
      .layout.palette-collapsed {
        grid-template-columns: 1fr;
        grid-template-rows: auto minmax(320px, 1fr) auto;
      }

      .layout.palette-collapsed .palette {
        height: auto;
      }
    }
  `;
B([
  m()
], L.prototype, "_template", 2);
B([
  m()
], L.prototype, "_selectedKey", 2);
B([
  m()
], L.prototype, "_properties", 2);
B([
  m()
], L.prototype, "_linkedProperties", 2);
B([
  m()
], L.prototype, "_linkedCaptions", 2);
B([
  m()
], L.prototype, "_fonts", 2);
B([
  m()
], L.prototype, "_serverBounds", 2);
B([
  m()
], L.prototype, "_baseImageUrl", 2);
B([
  m()
], L.prototype, "_zoom", 2);
B([
  m()
], L.prototype, "_effectiveScale", 2);
B([
  m()
], L.prototype, "_previewing", 2);
B([
  m()
], L.prototype, "_snapEnabled", 2);
B([
  m()
], L.prototype, "_showRulers", 2);
B([
  m()
], L.prototype, "_showSafeArea", 2);
B([
  m()
], L.prototype, "_showMeasured", 2);
B([
  m()
], L.prototype, "_canUndo", 2);
B([
  m()
], L.prototype, "_canRedo", 2);
B([
  m()
], L.prototype, "_paletteCollapsed", 2);
B([
  m()
], L.prototype, "_treeAvailable", 2);
B([
  m()
], L.prototype, "_treeCollapsed", 2);
L = B([
  A("di-design-view")
], L);
const Uv = L, Nv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return L;
  },
  default: Uv
}, Symbol.toStringTag, { value: "Module" }));
var Bv = Object.defineProperty, jv = Object.getOwnPropertyDescriptor, Ep = (e) => {
  throw TypeError(e);
}, ut = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? jv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Bv(t, i, o), o;
}, Mr = (e, t, i) => t.has(e) || Ep("Cannot " + i), oe = (e, t, i) => (Mr(e, t, "read from private field"), t.get(e)), Ji = (e, t, i) => t.has(e) ? Ep("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ea = (e, t, i, a) => (Mr(e, t, "write to private field"), t.set(e, i), i), ht = (e, t, i) => (Mr(e, t, "access private method"), i), We, Ia, ki, ii, Re, Lr, Do, Ip, Cp, Op;
let be = class extends P {
  constructor() {
    super(), Ji(this, Re), Ji(this, We), Ji(this, Ia), Ji(this, ki), Ji(this, ii), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(q, (e) => {
      Ea(this, Ia, e);
    }), this.consumeContext(At, (e) => {
      Ea(this, We, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, ht(this, Re, Do).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), ht(this, Re, Do).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = oe(this, ki)) == null || e.abort(), ht(this, Re, Lr).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => ht(this, Re, Do).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${ht(this, Re, Cp)}>
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
                ${re(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => ht(this, Re, Op).call(this, e)
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
                @click=${ht(this, Re, Ip)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : h}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
We = /* @__PURE__ */ new WeakMap();
Ia = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakMap();
ii = /* @__PURE__ */ new WeakMap();
Re = /* @__PURE__ */ new WeakSet();
Lr = function() {
  oe(this, ii) && (URL.revokeObjectURL(oe(this, ii)), Ea(this, ii, void 0));
};
Do = async function() {
  var i;
  const e = this._template;
  if (!e || !oe(this, We)) return;
  (i = oe(this, ki)) == null || i.abort(), Ea(this, ki, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: oe(this, ki).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, o] = await Promise.all([
      Wc(e, t, oe(this, We).getToken),
      Uc(e, t, oe(this, We).getToken)
    ]);
    ht(this, Re, Lr).call(this), Ea(this, ii, URL.createObjectURL(a)), this._url = oe(this, ii), this._bounds = o.layers, this._skipped = o.skipped ?? [], oe(this, We).setServerBounds(o.layers), oe(this, We).setIssues(o.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Ip = async function() {
  var e, t;
  if (!(!this._contentKey || !oe(this, We))) {
    this._regenerating = !0;
    try {
      const i = await Ln(this._contentKey, oe(this, We).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = oe(this, Ia)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = oe(this, Ia)) == null || t.peek("danger", {
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
Cp = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Op = function(e) {
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
be.styles = R`
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
      ${pr}
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
ut([
  m()
], be.prototype, "_template", 2);
ut([
  m()
], be.prototype, "_contentKey", 2);
ut([
  m()
], be.prototype, "_bounds", 2);
ut([
  m()
], be.prototype, "_skipped", 2);
ut([
  m()
], be.prototype, "_url", 2);
ut([
  m()
], be.prototype, "_loading", 2);
ut([
  m()
], be.prototype, "_error", 2);
ut([
  m()
], be.prototype, "_regenerating", 2);
be = ut([
  A("di-preview-view")
], be);
const Kv = be, Vv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return be;
  },
  default: Kv
}, Symbol.toStringTag, { value: "Module" }));
var qv = Object.defineProperty, Yv = Object.getOwnPropertyDescriptor, Ap = (e) => {
  throw TypeError(e);
}, Ga = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Yv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && qv(t, i, o), o;
}, zr = (e, t, i) => t.has(e) || Ap("Cannot " + i), ae = (e, t, i) => (zr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), fc = (e, t, i) => t.has(e) ? Ap("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Hv = (e, t, i, a) => (zr(e, t, "write to private field"), t.set(e, i), i), bi = (e, t, i) => (zr(e, t, "access private method"), i), de, fe, Fp, Pp, Zo, Rp, Mp, Lp, zp, Wp, Up;
let at = class extends P {
  constructor() {
    super(), fc(this, fe), fc(this, de), this._properties = [], this._showAdvanced = !1, this.consumeContext(At, (e) => {
      Hv(this, de, e), e && (zc(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${bi(this, fe, Lp).call(this)} ${bi(this, fe, zp).call(this)} ${bi(this, fe, Wp).call(this)} ${bi(this, fe, Up).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
de = /* @__PURE__ */ new WeakMap();
fe = /* @__PURE__ */ new WeakSet();
Fp = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Pp = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
Zo = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
Rp = async function(e) {
  var o, s;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((n) => [n.key, n.alias])), a = [
    ...t.map((n) => i.get(n)).filter((n) => !!n),
    ...ae(this, fe, Zo)
  ].filter((n, l, p) => p.indexOf(n) === l);
  (o = ae(this, de)) == null || o.updateTemplateFields({ docTypeAliases: a }), await ((s = ae(this, de)) == null ? void 0 : s.reloadProperties());
};
Mp = function(e) {
  var i;
  const t = e.target.selection;
  (i = ae(this, de)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
Lp = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? r`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${ae(this, fe, Pp)}
                  @change=${bi(this, fe, Rp)}></umb-input-document-type>` : r`<uui-loader-bar></uui-loader-bar>`}
            ${ae(this, fe, Zo).length > 0 ? r`<p class="note">
                  Also targets ${ae(this, fe, Zo).join(", ")}, which no document type has any more.
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
    ...ae(this, fe, Fp).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = ae(this, de)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = ae(this, de)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
zp = function() {
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
            @change=${bi(this, fe, Mp)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = ae(this, de)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = ae(this, de)) == null ? void 0 : i.updateOutput({
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
    return (i = ae(this, de)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
Wp = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = ae(this, de)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = ae(this, de)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Up = function() {
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
    return (i = ae(this, de)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
at.styles = R`
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
Ga([
  m()
], at.prototype, "_template", 2);
Ga([
  m()
], at.prototype, "_properties", 2);
Ga([
  m()
], at.prototype, "_showAdvanced", 2);
Ga([
  m()
], at.prototype, "_documentTypes", 2);
at = Ga([
  A("di-settings-view")
], at);
const Gv = at, Xv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return at;
  },
  default: Gv
}, Symbol.toStringTag, { value: "Module" }));
var Jv = Object.defineProperty, Zv = Object.getOwnPropertyDescriptor, Np = (e) => {
  throw TypeError(e);
}, Xa = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Zv(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Jv(t, i, o), o;
}, Wr = (e, t, i) => t.has(e) || Np("Cannot " + i), gc = (e, t, i) => (Wr(e, t, "read from private field"), t.get(e)), vc = (e, t, i) => t.has(e) ? Np("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Qv = (e, t, i, a) => (Wr(e, t, "write to private field"), t.set(e, i), i), bc = (e, t, i) => (Wr(e, t, "access private method"), i), Ca, So, Cn;
let ot = class extends P {
  constructor() {
    super(), vc(this, So), vc(this, Ca), this._loading = !0, this._onlyMissing = !1, this.consumeContext(At, (e) => {
      Qv(this, Ca, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && bc(this, So, Cn).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => bc(this, So, Cn).call(this)}>Reload</uui-button>
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
              ${re(
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
Ca = /* @__PURE__ */ new WeakMap();
So = /* @__PURE__ */ new WeakSet();
Cn = async function() {
  const e = this._template;
  if (!(!e || !gc(this, Ca))) {
    this._loading = !0;
    try {
      this._usage = await dm(e.key, gc(this, Ca).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
ot.styles = R`
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
Xa([
  m()
], ot.prototype, "_template", 2);
Xa([
  m()
], ot.prototype, "_usage", 2);
Xa([
  m()
], ot.prototype, "_loading", 2);
Xa([
  m()
], ot.prototype, "_onlyMissing", 2);
ot = Xa([
  A("di-usage-view")
], ot);
const eb = ot, tb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return ot;
  },
  default: eb
}, Symbol.toStringTag, { value: "Module" })), ib = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ya,
  default: ya
}, Symbol.toStringTag, { value: "Module" }));
var xt, Zt;
class Os extends nh {
  constructor(i, a) {
    super(i, a);
    $(this, xt);
    $(this, Zt);
    this.consumeContext(q, (o) => {
      v(this, xt, o);
    }), this.consumeContext(At, (o) => {
      v(this, Zt, o);
    });
  }
  async execute() {
    var o, s, n;
    const i = c(this, Zt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (o = c(this, xt)) == null || o.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await Sc(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await Bc(a.key, !1, i.getToken);
        (s = c(this, xt)) == null || s.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await gu(l, i.getToken, c(this, xt));
      } catch (l) {
        (n = c(this, xt)) == null || n.peek("danger", {
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
    c(this, Zt) && await um(i, c(this, Zt).getToken);
  }
}
xt = new WeakMap(), Zt = new WeakMap();
const ab = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: Os,
  api: Os,
  default: Os
}, Symbol.toStringTag, { value: "Module" }));
var La, Wi;
class As extends ui {
  constructor(i, a) {
    super(i, a);
    $(this, La);
    $(this, Wi);
    this.consumeContext(Oe, (o) => {
      v(this, La, o);
    }), this.consumeContext(q, (o) => {
      v(this, Wi, o);
    });
  }
  async execute() {
    var a, o;
    const i = this.args.unique;
    if (i)
      try {
        const s = await Ln(i, () => {
          var l;
          return (l = c(this, La)) == null ? void 0 : l.getLatestToken();
        }), n = s.outcome === "generated" || s.outcome === "generateddraft";
        (a = c(this, Wi)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? s.message ?? "The image has been regenerated." : s.message ?? s.outcome
          }
        });
      } catch (s) {
        const n = s instanceof ai && s.status === 404;
        (o = c(this, Wi)) == null || o.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: s instanceof ai ? s.detail ?? s.message : "The image could not be regenerated."
          }
        });
      }
  }
}
La = new WeakMap(), Wi = new WeakMap();
const ob = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: As,
  api: As,
  default: As
}, Symbol.toStringTag, { value: "Module" }));
var za, Qt, Wa, Ui;
class Fs extends mh {
  constructor(i, a) {
    super(i, a);
    $(this, za);
    $(this, Qt);
    $(this, Wa);
    $(this, Ui);
    this.consumeContext(Oe, (o) => {
      v(this, za, o);
    }), this.consumeContext(q, (o) => {
      v(this, Qt, o);
    }), this.consumeContext(yh, (o) => {
      v(this, Wa, o);
    }), this.consumeContext(fh, (o) => {
      v(this, Ui, (o == null ? void 0 : o.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, o, s;
    if (!c(this, Ui)) {
      (i = c(this, Qt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Ln(c(this, Ui), () => {
        var l;
        return (l = c(this, za)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, Wa)) == null || a.setValue(JSON.parse(n.propertyValue))), (o = c(this, Qt)) == null || o.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof ai && n.status === 404;
      (s = c(this, Qt)) == null || s.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof ai ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
za = new WeakMap(), Qt = new WeakMap(), Wa = new WeakMap(), Ui = new WeakMap();
const sb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: Fs,
  api: Fs,
  default: Fs
}, Symbol.toStringTag, { value: "Module" }));
var nb = Object.defineProperty, rb = Object.getOwnPropertyDescriptor, Bp = (e) => {
  throw TypeError(e);
}, dt = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? rb(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && nb(t, i, o), o;
}, Ur = (e, t, i) => t.has(e) || Bp("Cannot " + i), Xe = (e, t, i) => (Ur(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ps = (e, t, i) => t.has(e) ? Bp("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), lb = (e, t, i, a) => (Ur(e, t, "write to private field"), t.set(e, i), i), ce = (e, t, i) => (Ur(e, t, "access private method"), i), Eo, Ja, U, ms, Io, jp, Kp, Vp, Nr, qp, Yp, Hp, Gp, Xp, Jp, Zp, Qp;
const cb = [100, 200, 300, 400, 500, 600, 700, 800, 900], ub = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let _e = class extends Ic {
  constructor() {
    super(), Ps(this, U), Ps(this, Eo), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", Ps(this, Ja, () => {
      var e;
      return (e = Xe(this, Eo)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Oe, (e) => {
      lb(this, Eo, e);
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
      <umb-body-layout headline=${ce(this, U, Hp).call(this)}>
        ${ce(this, U, Io).call(this, "upload") ? ce(this, U, Gp).call(this, e) : h}
        ${ce(this, U, Io).call(this, "path") ? ce(this, U, Xp).call(this, e) : h}
        ${ce(this, U, Io).call(this, "web") ? ce(this, U, Jp).call(this, e) : h}

        ${this._error ? r`<p class="error" role="alert">${this._error}</p>` : h}
        ${this._busy ? r`<uui-loader-bar></uui-loader-bar>` : h}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
Eo = /* @__PURE__ */ new WeakMap();
Ja = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakSet();
ms = function() {
  var e, t;
  return { familyKey: ((e = this.data) == null ? void 0 : e.familyKey) ?? null, parentKey: ((t = this.data) == null ? void 0 : t.parentKey) ?? null };
};
Io = function(e) {
  var t;
  return !((t = this.data) != null && t.mode) || this.data.mode === e;
};
jp = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  ce(this, U, Kp).call(this, t);
};
Kp = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await Bh(t, Xe(this, Ja), Xe(this, U, ms));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Vp = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await jh(this._path.trim(), Xe(this, Ja), Xe(this, U, ms)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Nr = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
qp = async function() {
  if (Xe(this, U, Nr)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await Kh(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        Xe(this, Ja),
        Xe(this, U, ms)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
Yp = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Hp = function() {
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
Gp = function(e) {
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
            @change=${ce(this, U, jp)}>
          </uui-file-dropzone>
          <p class="hint">
            .ttf, .otf, .woff2 or .woff. The family name and weight are read from the file. Uploads are stored in the
            media library, so they work on Umbraco Cloud and transfer with Deploy.
          </p>
        </uui-box>
    `;
};
Xp = function(e) {
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
            @click=${ce(this, U, Vp)}>
            Register
          </uui-button>
        </uui-box>
    `;
};
Jp = function(e) {
  return r`
        <uui-box headline=${e ? "Or use a web font" : "Web font"}>
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${ub.map((t) => ({
    name: t.name,
    value: t.value,
    selected: t.value === this._provider
  }))}
            ?disabled=${this._busy}
            @change=${(t) => {
    this._provider = t.target.value;
  }}>
          </uui-select>

          ${this._provider === "direct" ? ce(this, U, Qp).call(this) : ce(this, U, Zp).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !Xe(this, U, Nr)}
            @click=${ce(this, U, qp)}>
            Add web font
          </uui-button>
        </uui-box>
    `;
};
Zp = function() {
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
        ${re(
    cb,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => ce(this, U, Yp).call(this, e, t.target.checked)}>
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
Qp = function() {
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
_e.styles = R`
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
dt([
  m()
], _e.prototype, "_busy", 2);
dt([
  m()
], _e.prototype, "_error", 2);
dt([
  m()
], _e.prototype, "_path", 2);
dt([
  m()
], _e.prototype, "_provider", 2);
dt([
  m()
], _e.prototype, "_family", 2);
dt([
  m()
], _e.prototype, "_weights", 2);
dt([
  m()
], _e.prototype, "_italic", 2);
dt([
  m()
], _e.prototype, "_url", 2);
_e = dt([
  A("di-font-upload-modal")
], _e);
const db = _e, pb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return _e;
  },
  default: db
}, Symbol.toStringTag, { value: "Module" }));
var hb = Object.getOwnPropertyDescriptor, mb = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? hb(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let Qo = class extends P {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Qo = mb([
  A("di-template-folder-editor")
], Qo);
const yb = Qo, eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Qo;
  },
  default: yb
}, Symbol.toStringTag, { value: "Module" }));
var fb = Object.getOwnPropertyDescriptor, gb = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? fb(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = n(o) || o);
  return o;
};
let Oa = class extends P {
  render() {
    return r`<umb-workspace-editor>
      <umb-icon id="icon" slot="header" name="icon-font"></umb-icon>
      <umb-workspace-header-name-editable slot="header"></umb-workspace-header-name-editable>
    </umb-workspace-editor>`;
  }
};
Oa.styles = [
  gh,
  R`
      #icon {
        display: inline-block;
        font-size: var(--uui-size-6);
        margin-right: var(--uui-size-space-4);
      }
    `
];
Oa = gb([
  A("di-font-family-editor")
], Oa);
const vb = Oa, bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontFamilyEditorElement() {
    return Oa;
  },
  default: vb
}, Symbol.toStringTag, { value: "Module" }));
var _b = Object.defineProperty, wb = Object.getOwnPropertyDescriptor, th = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? wb(t, i) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && _b(t, i, o), o;
};
let Aa = class extends P {
  constructor() {
    super(), this._headline = "", this.consumeContext(nr, (e) => {
      this.observe(e == null ? void 0 : e.current, (t) => {
        this._headline = t ? `${t.font.familyName} · ${t.name}` : "";
      });
    });
  }
  render() {
    return r`<umb-workspace-editor headline=${this._headline}></umb-workspace-editor>`;
  }
};
th([
  m()
], Aa.prototype, "_headline", 2);
Aa = th([
  A("di-font-editor")
], Aa);
const $b = Aa, Tb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontEditorElement() {
    return Aa;
  },
  default: $b
}, Symbol.toStringTag, { value: "Module" }));
export {
  xy as manifests,
  e_ as onInit
};
//# sourceMappingURL=dynamic-images.js.map
