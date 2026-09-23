var nn = (e) => {
  throw TypeError(e);
};
var hs = (e, t, i) => t.has(e) || nn("Cannot " + i);
var c = (e, t, i) => (hs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), x = (e, t, i) => t.has(e) ? nn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (hs(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), E = (e, t, i) => (hs(e, t, "access private method"), i);
var ps = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as ru, UmbEntityWorkspaceDataManager as lu, UmbSubmitWorkspaceAction as Ss, UmbEntityNamedDetailWorkspaceContextBase as cu, UmbWorkspaceActionBase as uu } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Qa, UmbContextConsumerController as du } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as Hn, UmbItemRepositoryBase as hu, UmbItemServerDataSourceBase as pu, UmbRepositoryBase as po } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as Yn, UmbItemStoreBase as mu } from "@umbraco-cms/backoffice/store";
import { UmbId as fu } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as gu, UMB_DATE_TIME_VALUE_TYPE as yu } from "@umbraco-cms/backoffice/value-type";
import { nothing as p, html as r, css as A, state as f, customElement as M, ifDefined as Es, property as y, repeat as J, classMap as Xn, styleMap as W } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as L } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as vu, UmbTreeRepositoryBase as bu } from "@umbraco-cms/backoffice/tree";
import { UMB_NOTIFICATION_CONTEXT as fe } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as _u } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UmbRequestReloadChildrenOfEntityEvent as Jn, UmbRequestReloadStructureForEntityEvent as wu, UmbEntityActionBase as es } from "@umbraco-cms/backoffice/entity-action";
import { UMB_AUTH_CONTEXT as Le } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as Zn, UMB_DISCARD_CHANGES_MODAL as $u, umbConfirmModal as mo, UmbModalToken as Qn, UmbModalBaseElement as er, UMB_MODAL_MANAGER_CONTEXT as tr } from "@umbraco-cms/backoffice/modal";
import { UMB_ACTION_EVENT_CONTEXT as ir } from "@umbraco-cms/backoffice/action";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as xu } from "@umbraco-cms/backoffice/entity";
import { tryExecute as ku } from "@umbraco-cms/backoffice/resources";
import { UmbDefaultCollectionContext as Tu } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as Su, UmbDeselectedEvent as Eu } from "@umbraco-cms/backoffice/event";
import { UMB_MEDIA_PICKER_MODAL as Cu } from "@umbraco-cms/backoffice/media";
import "@umbraco-cms/backoffice/document-type";
import { UmbArrayState as bi, UmbStringState as rn, UmbObjectState as ln, UmbBooleanState as pa, UmbNumberState as Du } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as Ou } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Iu } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Pu } from "@umbraco-cms/backoffice/document";
const ts = "dynamic-images", is = "di-template", Cs = "di:templates-changed", Au = "/umbraco/management/api/v1/dynamic-images";
class ht extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function $(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${Au}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await Mu(n);
  return n;
}
async function Mu(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new ht(t, e.status, i);
}
const S = async (e) => e.json();
async function Ru(e) {
  const t = await $("/templates?take=500", e);
  return (await S(t)).items;
}
const fo = async (e, t) => S(await $(`/templates/${e}`, t)), zu = async (e, t) => S(await $("/templates", t, { method: "POST", json: e })), Lu = async (e, t) => S(await $(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Fu(e, t) {
  await $(`/templates/${e}`, t, { method: "DELETE" });
}
const Uu = async (e, t) => S(await $(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function Wu(e, t) {
  return (await $(`/templates/${e}/export`, t)).blob();
}
const Nu = async (e, t, i, a = null) => S(await $("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function ar(e, t, i, a) {
  const s = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && s.set("foldersOnly", "true"), a && s.set("parentKey", a), s.toString();
}
const cn = async (e, t, i, a) => S(await $(`/tree/root?${ar(e, t, i)}`, a)), Bu = async (e, t, i, a, s) => S(await $(`/tree/children?${ar(t, i, a, e)}`, s)), Ku = async (e, t) => S(await $(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function sr(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return S(await $(`/item?${i}`, t));
}
async function ju(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), S(await $(`/collection/templates?${i}`, t));
}
async function Vu(e, t, i) {
  return (await $(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const Gu = async (e, t) => S(await $("/folders", t, { method: "POST", json: e })), qu = async (e, t) => S(await $(`/folders/${e}`, t)), Hu = async (e, t, i) => S(await $(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function Yu(e, t) {
  await $(`/folders/${e}`, t, { method: "DELETE" });
}
async function Xu(e, t, i) {
  await $(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Ju(e, t, i) {
  await $(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
const za = async (e) => S(await $("/fonts", e));
async function Zu(e, t) {
  const i = new FormData();
  return i.append("file", e), S(await $("/fonts", t, { method: "POST", body: i }));
}
const Qu = async (e, t) => S(await $("/fonts/register-path", t, { method: "POST", json: { path: e } })), ed = async (e, t) => S(await $("/fonts/register-web", t, { method: "POST", json: e })), td = async (e, t) => S(await $(`/fonts/${e}/refresh`, t, { method: "POST" })), id = async (e, t, i, a, s) => S(await $(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function ad(e, t) {
  await $(`/fonts/${e}`, t, { method: "DELETE" });
}
async function sd(e, t) {
  return (await $(`/fonts/${e}/file`, t)).arrayBuffer();
}
const or = async (e) => S(await $("/document-types", e)), od = async (e, t) => S(await $(`/document-types/${encodeURIComponent(e)}/properties`, t)), nd = async (e, t, i) => S(await $(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function nr(e, t, i) {
  return (await $("/preview", i, {
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
const rr = async (e, t, i) => S(await $("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), lr = async (e, t) => S(await $(`/media/${e}/image-info`, t)), go = async (e, t) => S(await $(`/documents/${e}/regenerate`, t, { method: "POST" })), cr = async (e, t, i) => S(await $(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), rd = async (e, t) => S(await $(`/jobs/${e}`, t));
async function ld(e, t) {
  await $(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const cd = async (e, t) => S(await $(`/templates/${e}/usage`, t)), ur = async (e) => S(await $("/health", e)), ud = async (e) => S(await $("/sync/status", e)), dd = async (e) => S(await $("/sync/export", e, { method: "POST" })), hd = async (e) => S(await $("/sync/import", e, { method: "POST" }));
function yo(e) {
  const t = `section/${ts}/workspace/${is}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function pd(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${ts}/workspace/${is}/create${t}`, document.baseURI).pathname;
}
function dr(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${ts}/workspace/${e}${i}`, document.baseURI).pathname;
}
function md(e) {
  return new URL(`section/${ts}/dashboard/${e}`, document.baseURI).pathname;
}
function fd() {
  window.dispatchEvent(new CustomEvent(Cs));
}
const as = () => crypto.randomUUID();
function ss(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function hr(e, t, i) {
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
function pr(e, t, i) {
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
function mr(e, t, i) {
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
const Ui = {
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
}, gd = Object.keys(Ui);
function yd(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = ss(e), o = Ui[i] ?? Ui.rectangle;
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
function vd(e) {
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
function bd(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (vd(e.classification)) {
    case "image":
      return { kind: "layer", layer: pr(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: mr(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: hr(t, e.name, _d(e)) };
  }
}
function _d(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function fr() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function wd(e) {
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
const gr = [
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
function Wi(e) {
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
function Ni(e) {
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
function Ds(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return gr[a * 3 + i];
}
function os(e, t, i) {
  return {
    x: e.x - t * Wi(e.anchor),
    y: e.y - i * Ni(e.anchor)
  };
}
function vo(e, t, i, a, s) {
  return {
    x: e + i * Wi(s),
    y: t + a * Ni(s)
  };
}
function $d(e, t, i, a) {
  const s = os(e, t, i), o = vo(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function xd(e, t) {
  const i = vo(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function yr(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Kt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), h = e - i, m = t - a;
  return { x: i + h * n - m * l, y: a + h * l + m * n };
}
function kd(e, t, i, a, s) {
  return Kt(e, t, i, a, -s);
}
function vr(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Kt(e.x, e.y, t, i, a),
    Kt(e.x + e.width, e.y, t, i, a),
    Kt(e.x + e.width, e.y + e.height, t, i, a),
    Kt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((m) => m.x)), n = Math.max(...s.map((m) => m.x)), l = Math.min(...s.map((m) => m.y)), h = Math.max(...s.map((m) => m.y));
  return { x: o, y: l, width: n - o, height: h - l };
}
const Td = 10;
function Re(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function br(e) {
  return !!e.relativeX || !!e.relativeY;
}
function La(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function un(e) {
  return e === "below" || e === "above";
}
function dn(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Sd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Ed(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = dn(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...dn(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function Cd(e, t, i) {
  const a = e.position;
  if (!br(a)) return a;
  if (Ed(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Wi(a.anchor), l = Ni(a.anchor);
  const h = hn(e, a.relativeX, !1, t, i);
  h && (s = h.coordinate, n = h.factor);
  const m = hn(e, a.relativeY, !0, t, i);
  return m && (o = m.coordinate, l = m.factor), { x: s, y: o, anchor: Ds(n, l) };
}
function hn(e, t, i, a, s) {
  if (!t || un(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let n = t.layerKey;
  for (; !o.has(n); ) {
    o.add(n);
    const l = a.get(n);
    if (!l) return;
    const h = s(n);
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
    if (!m || un(m.edge) !== i) return;
    n = m.layerKey;
  }
}
function Dd(e, t, i) {
  const a = Sd(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const h = s.get(l.key);
    if (h) return h;
    let m;
    o.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), m = Cd(l, a, (ge) => {
      const ye = a.get(ge);
      return ye && !i(ye) ? n(ye).extent : void 0;
    }), o.delete(l.key));
    const C = t(l), k = os(m, C.width, C.height), K = { x: k.x, y: k.y, width: C.width, height: C.height }, ae = { position: m, box: K, extent: vr(K, m.x, m.y, l.rotation ?? 0) };
    return s.set(l.key, ae), ae;
  };
  for (const l of e) n(l);
  return s;
}
function Os(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? Ds(Wi(i.anchor), Ni(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? Ds(Wi(e.anchor), Ni(i.anchor)) : e.anchor
  };
}
var ce, We, Ie, st;
class Od {
  constructor(t = 100) {
    x(this, ce, []);
    x(this, We, []);
    x(this, Ie, 0);
    x(this, st);
    this.limit = t;
  }
  get canUndo() {
    return c(this, ce).length > 0;
  }
  get canRedo() {
    return c(this, We).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Ie) > 0 || (c(this, ce).push(structuredClone(t)), c(this, ce).length > this.limit && c(this, ce).shift(), _(this, We, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Ie) === 0 && _(this, st, structuredClone(t)), ps(this, Ie)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Ie) !== 0 && (ps(this, Ie)._--, !(c(this, Ie) > 0) && (t && c(this, st) !== void 0 && (c(this, ce).push(c(this, st)), c(this, ce).length > this.limit && c(this, ce).shift(), _(this, We, [])), _(this, st, void 0)));
  }
  undo(t) {
    const i = c(this, ce).pop();
    if (i !== void 0)
      return c(this, We).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, We).pop();
    if (i !== void 0)
      return c(this, ce).push(structuredClone(t)), i;
  }
  clear() {
    _(this, ce, []), _(this, We, []), _(this, Ie, 0), _(this, st, void 0);
  }
}
ce = new WeakMap(), We = new WeakMap(), Ie = new WeakMap(), st = new WeakMap();
const Is = 3, Id = (e) => Pd(e), pn = (e, t) => e.slice(0, Math.max(0, t)).join("."), Pd = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), Ad = "Page";
function Md(e) {
  return e.isSystem ? Ad : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const Nt = (e) => e ?? Number.MAX_SAFE_INTEGER;
function Rd(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || Nt(t.property.tabSortOrder) - Nt(i.property.tabSortOrder) || Nt(t.property.groupSortOrder) - Nt(i.property.groupSortOrder) || Nt(t.property.sortOrder) - Nt(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function zd(e, t) {
  const i = Rd(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: Md(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function Ld(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const Fd = "DynamicImages.Workspace.Template", Ud = 12, mn = 36;
var Zt, ot, kt, Tt, Qt, St, ei, ti, Et, nt, ii, Ne, ai, si, ue, ta, Ct, Pe, Dt, w, _r, oi, ni, Ps, As, Ms, Fe, bt, Rs, va, wr, $r, xr, zs;
class Wd extends ru {
  constructor(i) {
    super(i, Fd);
    x(this, w);
    x(this, Zt);
    x(this, ot);
    x(this, kt);
    x(this, Tt);
    x(this, Qt);
    x(this, St);
    x(this, ei);
    x(this, ti);
    x(this, Et);
    x(this, nt);
    x(this, ii);
    x(this, Ne);
    x(this, ai);
    x(this, si);
    x(this, ue);
    x(this, ta);
    x(this, Ct);
    x(this, Pe);
    x(this, Dt);
    x(this, oi);
    x(this, ni);
    this._data = new lu(this), this.template = this._data.current, _(this, Zt, new bi([], (a) => a.key)), this.layers = c(this, Zt).asObservable(), _(this, ot, new rn(void 0)), this.selectedLayerKey = c(this, ot).asObservable(), _(this, kt, new bi([], (a) => a.alias)), this.properties = c(this, kt).asObservable(), _(this, Tt, new ln({})), this.linkedProperties = c(this, Tt).asObservable(), _(this, Qt, new ln({})), this.linkedCaptions = c(this, Qt).asObservable(), _(this, St, new bi([], (a) => a.key)), this.fonts = c(this, St).asObservable(), _(this, ei, new bi([], (a) => a.key)), this.serverBounds = c(this, ei).asObservable(), _(this, ti, new bi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, ti).asObservable(), _(this, Et, new rn(void 0)), this.sampleContentKey = c(this, Et).asObservable(), _(this, nt, new pa(!0)), this.useSampleData = c(this, nt).asObservable(), _(this, ii, new Du(1)), this.zoom = c(this, ii).asObservable(), _(this, Ne, new pa(!0)), this.loading = c(this, Ne).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ai, new pa(!1)), this.canUndo = c(this, ai).asObservable(), _(this, si, new pa(!1)), this.canRedo = c(this, si).asObservable(), _(this, ue, new Od()), _(this, Pe, !1), _(this, Dt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, oi, async (a) => {
      const s = a.detail;
      if (c(this, Dt) || !(s != null && s.url) || !E(this, w, _r).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await Zn(this, $u), _(this, Dt, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, ni, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, ta)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => fs),
        setup: (a, s) => {
          const o = s.match.params.parentUnique;
          return this.createScaffold(void 0, o && o !== "null" ? o : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => fs),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => fs),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Le, (a) => {
      _(this, ta, a);
    }), this.consumeContext(fe, (a) => {
      _(this, Ct, a);
    }), window.addEventListener("willchangestate", c(this, oi)), window.addEventListener("beforeunload", c(this, ni)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Pe);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Ne).setValue(!0), _(this, Pe, !1);
    try {
      const a = await fo(i, this.getToken);
      E(this, w, bt).call(this, a, { resetHistory: !0, persist: !0 }), E(this, w, $r).call(this), this.setIsNew(!1), await E(this, w, Ps).call(this, a);
    } catch (a) {
      E(this, w, zs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Ne).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, Ne).setValue(!0), _(this, Pe, !0), E(this, w, bt).call(this, { ...wd(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await E(this, w, Ps).call(this, this._data.getCurrent()), c(this, Ne).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await E(this, w, Ms).call(this, i.docTypeAliases);
    c(this, kt).setValue(a), c(this, Tt).setValue(await E(this, w, As).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, St).setValue(await za(this.getToken).catch(() => []));
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
        var l, h;
        let n = o.position;
        return ((l = La(n, "x")) == null ? void 0 : l.layerKey) === i && (n = Os(n, "x", a == null ? void 0 : a.get(o.key))), ((h = La(n, "y")) == null ? void 0 : h.layerKey) === i && (n = Os(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), c(this, ot).getValue() === i && this.selectLayer(void 0);
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
    E(this, w, Fe).call(this, (s) => {
      const o = [...s.layers], n = o.findIndex((h) => h.key === i);
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
    c(this, ot).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, ot).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, ue).begin(i);
  }
  endTransaction(i = !0) {
    c(this, ue).end(i), E(this, w, Rs).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ue).undo(i);
    a && E(this, w, bt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ue).redo(i);
    a && E(this, w, bt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, ei).setValue(i);
  }
  setIssues(i) {
    c(this, ti).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    c(this, Et).setValue(i), c(this, nt).setValue(!i), E(this, w, wr).call(this, i);
  }
  setUseSampleData(i) {
    c(this, nt).setValue(i);
  }
  setZoom(i) {
    c(this, ii).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = c(this, Pe) ? await zu(i, this.getToken) : await Lu(i, this.getToken);
      E(this, w, bt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Pe);
      _(this, Pe, !1), this.setIsNew(!1), fd(), await E(this, w, xr).call(this, o.template, n), (a = c(this, Ct)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, Ct)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", yo(o.template.key));
    } catch (o) {
      throw E(this, w, zs).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Dt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, oi)), window.removeEventListener("beforeunload", c(this, ni)), c(this, ue).clear(), super.destroy();
  }
}
Zt = new WeakMap(), ot = new WeakMap(), kt = new WeakMap(), Tt = new WeakMap(), Qt = new WeakMap(), St = new WeakMap(), ei = new WeakMap(), ti = new WeakMap(), Et = new WeakMap(), nt = new WeakMap(), ii = new WeakMap(), Ne = new WeakMap(), ai = new WeakMap(), si = new WeakMap(), ue = new WeakMap(), ta = new WeakMap(), Ct = new WeakMap(), Pe = new WeakMap(), Dt = new WeakMap(), w = new WeakSet(), /**
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
_r = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, oi = new WeakMap(), ni = new WeakMap(), Ps = async function(i) {
  const [a, s] = await Promise.all([
    za(this.getToken).catch(() => []),
    E(this, w, Ms).call(this, i.docTypeAliases)
  ]);
  c(this, St).setValue(a), c(this, kt).setValue(s), c(this, Tt).setValue(await E(this, w, As).call(this, i.docTypeAliases, s));
}, As = async function(i, a) {
  const s = {}, o = {};
  if (i.length === 0) return s;
  let n = a.filter((h) => h.classification === "content").slice(0, Ud).map((h) => h.alias), l = 0;
  for (let h = 1; h <= Is && n.length > 0 && l < mn; h++) {
    const m = n.slice(0, mn - l);
    l += m.length;
    const C = await Promise.all(m.map(async (k) => {
      var vi;
      const K = await Promise.all(
        i.map((se) => nd(se, k, this.getToken).catch(() => null))
      ), ae = /* @__PURE__ */ new Map();
      for (const se of K.flatMap((_e) => (_e == null ? void 0 : _e.properties) ?? []))
        ae.has(se.alias) || ae.set(se.alias, se);
      const ge = K.filter((se) => se !== null), ye = [...new Set(ge.flatMap((se) => se.targetDocTypes.map((_e) => _e.name)))], Wt = ge.some((se) => se.inference === "all") ? "all" : (vi = ge[0]) == null ? void 0 : vi.inference;
      return { prefix: k, properties: [...ae.values()], caption: Ld(ye, Wt) };
    }));
    n = [];
    for (const k of C)
      k.properties.length !== 0 && (s[k.prefix] = k.properties, o[k.prefix] = k.caption, h < Is && n.push(...k.properties.filter((K) => K.classification === "content" && !K.isSystem).map((K) => `${k.prefix}.${K.alias}`)));
  }
  return c(this, Qt).setValue(o), s;
}, Ms = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => od(o, this.getToken).catch(() => []))
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
  a && c(this, ue).push(s);
  const o = i(structuredClone(s));
  E(this, w, bt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
bt = function(i, a) {
  a != null && a.resetHistory && c(this, ue).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Zt).setValue(i.layers), E(this, w, Rs).call(this);
}, Rs = function() {
  c(this, ai).setValue(c(this, ue).canUndo), c(this, si).setValue(c(this, ue).canRedo);
}, va = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, wr = function(i) {
  try {
    i ? localStorage.setItem(E(this, w, va).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(E(this, w, va).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
$r = function() {
  let i;
  try {
    const a = localStorage.getItem(E(this, w, va).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  c(this, Et).setValue(i), c(this, nt).setValue(!i);
}, xr = async function(i, a) {
  const s = await this.getContext(ir).catch(() => {
  });
  s && (a ? s.dispatchEvent(new Jn({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : s.dispatchEvent(new wu({ entityType: "di-template", unique: i.key })));
}, zs = function(i, a) {
  var o;
  const s = a instanceof ht ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, Ct)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const ft = new Qa(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), ui = "di-template-root", ie = "di-template-folder", Te = is, Fa = "DynamicImages.Tree.Templates", Ii = "DynamicImages.Repository.TemplateTree", Pi = "DynamicImages.Repository.TemplateFolder", Nd = "DynamicImages.Store.TemplateFolder", Ua = "DynamicImages.Workspace.TemplateFolder", kr = "DynamicImages.Workspace.TemplateRoot", fn = "DynamicImages.Repository.TemplateItem", Bd = "DynamicImages.Store.TemplateItem", gn = "DynamicImages.Repository.TemplateDetail", Kd = "DynamicImages.Store.TemplateDetail", yn = "DynamicImages.Repository.MoveTemplate", vn = "DynamicImages.Repository.MoveTemplateFolder", bn = "DynamicImages.Repository.DuplicateTemplate", Tr = "icon-picture", Sr = "icon-picture color-grey", Er = "icon-folder", Ls = "DynamicImages.Collection.Templates", _n = "DynamicImages.Repository.TemplateCollection";
async function N(e, t) {
  const i = (async () => {
    const a = await new du(e, Le).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (s) {
      throw s instanceof ht ? { type: "error", title: s.message, status: s.status, detail: s.detail } : s;
    }
  })();
  return await ku(e, i);
}
var rt;
class jd {
  constructor(t) {
    x(this, rt);
    _(this, rt, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: ie,
      unique: fu.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await N(c(this, rt), (s) => qu(t, s));
    return i ? { data: { entityType: ie, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await N(c(this, rt), (o) => Gu({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await N(c(this, rt), (s) => Hu(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return N(c(this, rt), (i) => Yu(t, i));
  }
}
rt = new WeakMap();
const bo = new Qa("DiTemplateFolderStore");
class Cr extends Yn {
  constructor(t) {
    super(t, bo);
  }
}
class wn extends Hn {
  constructor(t) {
    super(t, jd, bo);
  }
}
const Vd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: bo,
  DiTemplateFolderRepository: wn,
  DiTemplateFolderStore: Cr,
  api: wn
}, Symbol.toStringTag, { value: "Module" })), Gd = [
  {
    type: "repository",
    alias: Pi,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => Vd)
  },
  {
    type: "store",
    alias: Nd,
    name: "Dynamic Images Template Folder Store",
    api: Cr
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [ie],
    meta: { folderRepositoryAlias: Pi }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [ie],
    meta: { folderRepositoryAlias: Pi }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Ua,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => rh),
    meta: { entityType: ie }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: Ss,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Ua }]
  }
], qd = [
  {
    type: "repository",
    alias: Ii,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => uh)
  },
  {
    type: "tree",
    kind: "default",
    alias: Fa,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: Ii }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [ui, ie, Te]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: Fa, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: kr,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: ui, headline: "Templates" }
  },
  ...Gd
], _o = new Qa("DiTemplateItemStore");
class Dr extends mu {
  constructor(t) {
    super(t, _o);
  }
}
class Hd extends pu {
  constructor(t) {
    super(t, {
      getItems: (i) => N(t, (a) => sr(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? ie : Te,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class $n extends hu {
  constructor(t) {
    super(t, Hd, _o);
  }
}
const Yd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: _o,
  DiTemplateItemRepository: $n,
  DiTemplateItemStore: Dr,
  api: $n
}, Symbol.toStringTag, { value: "Module" })), wo = new Qa("DiTemplateDetailStore");
class Or extends Yn {
  constructor(t) {
    super(t, wo);
  }
}
const ms = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var ri;
class Xd {
  constructor(t) {
    x(this, ri);
    this.createScaffold = ms, this.create = ms, this.update = ms, _(this, ri, t);
  }
  async read(t) {
    const { data: i, error: a } = await N(c(this, ri), (s) => fo(t, s));
    return i ? { data: { entityType: Te, unique: i.key, name: i.name } } : { error: a };
  }
  delete(t) {
    return N(c(this, ri), (i) => Fu(t, i));
  }
}
ri = new WeakMap();
class xn extends Hn {
  constructor(t) {
    super(t, Xd, wo);
  }
}
const Jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: wo,
  DiTemplateDetailRepository: xn,
  DiTemplateDetailStore: Or,
  api: xn
}, Symbol.toStringTag, { value: "Module" })), _i = [ui, ie], Zd = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: fn,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => Yd)
  },
  {
    type: "itemStore",
    alias: Bd,
    name: "Dynamic Images Template Item Store",
    api: Dr
  },
  {
    type: "repository",
    alias: gn,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => Jd)
  },
  {
    type: "store",
    alias: Kd,
    name: "Dynamic Images Template Detail Store",
    api: Or
  },
  {
    type: "repository",
    alias: yn,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => ph)
  },
  {
    type: "repository",
    alias: vn,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => mh)
  },
  {
    type: "repository",
    alias: bn,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => fh)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: _i,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => gh),
    forEntityTypes: _i,
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
    forEntityTypes: _i,
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
    forEntityTypes: [Te],
    meta: {
      treeRepositoryAlias: Ii,
      moveRepositoryAlias: yn,
      treeAlias: Fa,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicate",
    alias: "DynamicImages.EntityAction.Template.Duplicate",
    name: "Duplicate Dynamic Images Template",
    forEntityTypes: [Te],
    meta: {
      icon: "icon-documents",
      label: "Duplicate",
      duplicateRepositoryAlias: bn,
      treeRepositoryAlias: Ii
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => yh),
    forEntityTypes: [Te],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => bh),
    forEntityTypes: [Te],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [Te],
    meta: {
      itemRepositoryAlias: fn,
      detailRepositoryAlias: gn,
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
    forEntityTypes: [ie],
    meta: {
      treeRepositoryAlias: Ii,
      moveRepositoryAlias: vn,
      treeAlias: Fa,
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
    api: () => Promise.resolve().then(() => $h),
    forEntityTypes: _i,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON…", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: _i
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => Ch)
  }
], ma = [{ alias: "Umb.Condition.CollectionAlias", match: Ls }], Qd = [
  {
    type: "repository",
    alias: _n,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => Dh)
  },
  {
    type: "collection",
    kind: "default",
    alias: Ls,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => Oh),
    meta: { repositoryAlias: _n }
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
        { field: "isEnabled", label: "Enabled", valueType: gu },
        { field: "updated", label: "Last updated", valueType: yu }
      ]
    },
    conditions: ma
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: ma
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => Mh),
    forEntityTypes: [Te]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: ma
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: ma
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
      collectionAlias: Ls
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [kr, Ua]
      }
    ]
  }
], eh = [
  ...qd,
  ...Zd,
  ...Qd,
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
    element: () => Promise.resolve().then(() => Fh),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Vh),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Yh),
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
    api: Wd,
    meta: { entityType: is }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => cm),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => pm),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => vm),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => xm),
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
    api: () => Promise.resolve().then(() => km),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Tm),
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
    api: () => Promise.resolve().then(() => Sm),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Em),
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
    element: () => Promise.resolve().then(() => Mm)
  }
], pf = (e, t) => {
  t.registerMany(eh);
};
var th = Object.defineProperty, ih = Object.getOwnPropertyDescriptor, Ir = (e) => {
  throw TypeError(e);
}, $o = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ih(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && th(t, i, s), s;
}, xo = (e, t, i) => t.has(e) || Ir("Cannot " + i), ah = (e, t, i) => (xo(e, t, "read from private field"), t.get(e)), kn = (e, t, i) => t.has(e) ? Ir("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), sh = (e, t, i, a) => (xo(e, t, "write to private field"), t.set(e, i), i), oh = (e, t, i) => (xo(e, t, "access private method"), i), Wa, Fs, Pr;
let Rt = class extends L {
  constructor() {
    super(), kn(this, Fs), kn(this, Wa), this._name = "", this._loading = !0, this.consumeContext(ft, (e) => {
      sh(this, Wa, e), e && (this.observe(e.template, (t) => {
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
            @input=${oh(this, Fs, Pr)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Wa = /* @__PURE__ */ new WeakMap();
Fs = /* @__PURE__ */ new WeakSet();
Pr = function(e) {
  var i;
  const t = e.target.value;
  (i = ah(this, Wa)) == null || i.updateTemplateFields({ name: t });
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
$o([
  f()
], Rt.prototype, "_name", 2);
$o([
  f()
], Rt.prototype, "_loading", 2);
Rt = $o([
  M("di-template-editor")
], Rt);
const nh = Rt, fs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Rt;
  },
  default: nh
}, Symbol.toStringTag, { value: "Module" }));
class Tn extends cu {
  constructor(t) {
    super(t, {
      workspaceAlias: Ua,
      entityType: ie,
      detailRepositoryAlias: Pi
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Fm),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: Tn,
  api: Tn
}, Symbol.toStringTag, { value: "Module" }));
function gs(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function lh(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? ie : ui
    },
    name: e.name,
    entityType: t ? ie : Te,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? Er : e.isEnabled ? Tr : Sr,
    isEnabled: e.isEnabled
  };
}
class ch extends vu {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = gs(i);
        return N(t, (o) => cn(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = gs(i);
          return N(t, (h) => cn(n, l, i.foldersOnly ?? !1, h));
        }
        const a = i.parent.unique, { skip: s, take: o } = gs(i);
        return N(t, (n) => Bu(a, s, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => N(t, (a) => Ku(i.treeItem.unique, a)),
      mapper: lh
    });
  }
}
class Sn extends bu {
  constructor(t) {
    super(t, ch);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: ui,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: Sn,
  api: Sn
}, Symbol.toStringTag, { value: "Module" }));
class Ar extends po {
  async requestMoveTo(t) {
    const { error: i } = await N(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(fe);
      a == null || a.peek("positive", { data: { message: "Moved" } });
    }
    return { error: i };
  }
}
class dh extends Ar {
  constructor() {
    super(...arguments), this.move = Xu;
  }
}
class hh extends Ar {
  constructor() {
    super(...arguments), this.move = Ju;
  }
}
const ph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: dh
}, Symbol.toStringTag, { value: "Module" })), mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: hh
}, Symbol.toStringTag, { value: "Module" }));
class En extends po {
  async requestDuplicate(t) {
    const { data: i, error: a } = await N(this, (s) => Uu(t.unique, s));
    if (i) {
      const s = await this.getContext(fe);
      s == null || s.peek("positive", { data: { message: `'${i.template.name}' created` } });
    }
    return { error: a };
  }
}
const fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateTemplateRepository: En,
  api: En
}, Symbol.toStringTag, { value: "Module" }));
class Cn extends _u {
  async getHref() {
    return pd({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const gh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: Cn,
  api: Cn
}, Symbol.toStringTag, { value: "Module" }));
class Dn extends es {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await N(this, async (n) => ({
      blob: await Wu(t, n),
      alias: (await fo(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const s = URL.createObjectURL(i.blob), o = document.createElement("a");
    o.href = s, o.download = `${i.alias}.json`, o.click(), URL.revokeObjectURL(s);
  }
}
const yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: Dn,
  api: Dn
}, Symbol.toStringTag, { value: "Module" })), vh = 1500;
async function Mr(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((s) => setTimeout(s, vh));
    try {
      a = await rd(a.id, t);
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
class On extends es {
  async execute() {
    var h;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await N(this, (m) => sr([t], m)), a = ((h = i == null ? void 0 : i[0]) == null ? void 0 : h.name) ?? "this template";
    await mo(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: s, error: o } = await N(this, (m) => cr(t, !1, m));
    if (o || !s) throw o ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(fe);
    n == null || n.peek("positive", { data: { message: `Regenerating ${s.total} item(s)…` } });
    const l = await this.getContext(Le);
    await Mr(s, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: On,
  api: On
}, Symbol.toStringTag, { value: "Module" })), _h = new Qn(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), wh = new Qn(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class In extends es {
  async execute() {
    const { json: t } = await Zn(this, wh, { data: {} }), i = this.args.unique ?? null, { data: a, error: s } = await N(this, (l) => Nu(t, "create", l, i));
    if (s || !a) throw s ?? new Error("The template could not be imported.");
    const o = await this.getContext(fe);
    o == null || o.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) o == null || o.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(ir);
    n == null || n.dispatchEvent(new Jn({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const $h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: In,
  api: In
}, Symbol.toStringTag, { value: "Module" }));
var xh = Object.defineProperty, kh = Object.getOwnPropertyDescriptor, Rr = (e) => {
  throw TypeError(e);
}, zr = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && xh(t, i, s), s;
}, Th = (e, t, i) => t.has(e) || Rr("Cannot " + i), Sh = (e, t, i) => t.has(e) ? Rr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pn = (e, t, i) => (Th(e, t, "access private method"), i), ba, Lr, Fr;
let di = class extends er {
  constructor() {
    super(...arguments), Sh(this, ba), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${Pn(this, ba, Lr)} aria-label="Choose a file" />
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
            @click=${Pn(this, ba, Fr)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
ba = /* @__PURE__ */ new WeakSet();
Lr = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
Fr = function() {
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
zr([
  f()
], di.prototype, "_json", 2);
di = zr([
  M("di-import-template-modal")
], di);
const Eh = di, Ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return di;
  },
  default: Eh
}, Symbol.toStringTag, { value: "Module" }));
function Ur(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? ie : Te,
    name: e.name,
    icon: t ? Er : e.isEnabled ? Tr : Sr,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class An extends po {
  async requestCollection(t = {}) {
    const i = await this.getContext(xu), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: o } = await N(this, (n) => ju({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return s ? { data: { total: s.total, items: s.items.map(Ur) } } : { error: o };
  }
}
const Dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: An,
  api: An,
  mapCollectionItem: Ur
}, Symbol.toStringTag, { value: "Module" }));
class Mn extends Tu {
  async requestItemHref(t) {
    return t.entityType === ie ? dr(ie, t.unique) : yo(t.unique);
  }
}
const Oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: Mn,
  api: Mn
}, Symbol.toStringTag, { value: "Module" }));
var Ih = Object.defineProperty, Ph = Object.getOwnPropertyDescriptor, Wr = (e) => {
  throw TypeError(e);
}, Ye = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ph(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ih(t, i, s), s;
}, ko = (e, t, i) => t.has(e) || Wr("Cannot " + i), Na = (e, t, i) => (ko(e, t, "read from private field"), i ? i.call(e) : t.get(e)), fa = (e, t, i) => t.has(e) ? Wr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _a = (e, t, i, a) => (ko(e, t, "write to private field"), t.set(e, i), i), ys = (e, t, i) => (ko(e, t, "access private method"), i), Ba, ki, Bi, Ti, Nr, Br, Kr;
const Ah = 400;
let he = class extends L {
  constructor() {
    super(), fa(this, Ti), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, fa(this, Ba), fa(this, ki), fa(this, Bi), this.consumeContext(Le, (e) => {
      _a(this, Ba, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), _a(this, ki, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && ys(this, Ti, Nr).call(this);
    })), Na(this, ki).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Na(this, ki)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, _a(this, Bi, void 0);
  }
  render() {
    return this.item ? r`
      <uui-card-media
        name=${this.item.name}
        detail=${Es(this.item.docTypes || void 0)}
        href=${Es(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${ys(this, Ti, Br)}
        @deselected=${ys(this, Ti, Kr)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : p}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : p;
  }
};
Ba = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakMap();
Bi = /* @__PURE__ */ new WeakMap();
Ti = /* @__PURE__ */ new WeakSet();
Nr = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || Na(this, Bi) === t)) {
    _a(this, Bi, t);
    try {
      const i = await Vu(e.unique, Ah, () => {
        var a;
        return (a = Na(this, Ba)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
Br = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Su(this.item.unique)));
};
Kr = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new Eu(this.item.unique)));
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
  y({ type: Object })
], he.prototype, "item", 2);
Ye([
  y({ type: Boolean })
], he.prototype, "selectable", 2);
Ye([
  y({ type: Boolean })
], he.prototype, "selected", 2);
Ye([
  y({ type: Boolean, attribute: "select-only" })
], he.prototype, "selectOnly", 2);
Ye([
  y({ type: Boolean })
], he.prototype, "disabled", 2);
Ye([
  y({ type: String })
], he.prototype, "href", 2);
Ye([
  f()
], he.prototype, "_src", 2);
Ye([
  f()
], he.prototype, "_failed", 2);
he = Ye([
  M("di-template-collection-card")
], he);
const Mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return he;
  },
  get element() {
    return he;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Rh = Object.defineProperty, zh = Object.getOwnPropertyDescriptor, jr = (e) => {
  throw TypeError(e);
}, oa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Rh(t, i, s), s;
}, To = (e, t, i) => t.has(e) || jr("Cannot " + i), ct = (e, t, i) => (To(e, t, "read from private field"), t.get(e)), wi = (e, t, i) => t.has(e) ? jr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Rn = (e, t, i, a) => (To(e, t, "write to private field"), t.set(e, i), i), Ke = (e, t, i) => (To(e, t, "access private method"), i), Si, Ka, wa, Ai, Se, Us, Vr, Gr, Ei, qr;
let je = class extends L {
  constructor() {
    super(), wi(this, Se), wi(this, Si), wi(this, Ka), this._templates = [], this._fonts = [], this._loading = !0, wi(this, wa, () => {
      ct(this, Si) && Ke(this, Se, Us).call(this);
    }), wi(this, Ai, () => {
      var e;
      return (e = ct(this, Si)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(fe, (e) => {
      Rn(this, Ka, e);
    }), this.consumeContext(Le, (e) => {
      Rn(this, Si, e), e && Ke(this, Se, Us).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Cs, ct(this, wa));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Cs, ct(this, wa));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${Ke(this, Se, Gr).call(this)} ${Ke(this, Se, qr).call(this)}
      </umb-body-layout>
    `;
  }
};
Si = /* @__PURE__ */ new WeakMap();
Ka = /* @__PURE__ */ new WeakMap();
wa = /* @__PURE__ */ new WeakMap();
Ai = /* @__PURE__ */ new WeakMap();
Se = /* @__PURE__ */ new WeakSet();
Us = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Ru(ct(this, Ai)),
      za(ct(this, Ai)).catch(() => []),
      ur(ct(this, Ai)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    Ke(this, Se, Vr).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Vr = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = ct(this, Ka)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Gr = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${Ke(this, Se, Ei).call(this, "Templates", this._templates.length, "icon-brush", !1, dr(ui))}
        ${Ke(this, Se, Ei).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${Ke(this, Se, Ei).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${Ke(this, Se, Ei).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
Ei = function(e, t, i, a = !1, s) {
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
qr = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${J(
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
        <uui-button look="secondary" href=${md("health")} label="See all issues">See all</uui-button>
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
oa([
  f()
], je.prototype, "_templates", 2);
oa([
  f()
], je.prototype, "_fonts", 2);
oa([
  f()
], je.prototype, "_health", 2);
oa([
  f()
], je.prototype, "_loading", 2);
je = oa([
  M("di-overview-dashboard")
], je);
const Lh = je, Fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return je;
  },
  default: Lh
}, Symbol.toStringTag, { value: "Module" })), Ws = /* @__PURE__ */ new Map(), ns = (e) => `di-${e}`;
function Uh(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Ws.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await sd(e, t), o = new FontFace(ns(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return Ws.set(e, a), a;
}
async function Hr(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => Uh(a, t)));
}
function Yr(e) {
  Ws.delete(e);
}
var Wh = Object.defineProperty, Nh = Object.getOwnPropertyDescriptor, Xr = (e) => {
  throw TypeError(e);
}, rs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Nh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wh(t, i, s), s;
}, So = (e, t, i) => t.has(e) || Xr("Cannot " + i), Me = (e, t, i) => (So(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $i = (e, t, i) => t.has(e) ? Xr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), vs = (e, t, i, a) => (So(e, t, "write to private field"), t.set(e, i), i), z = (e, t, i) => (So(e, t, "access private method"), i), $a, Ki, ji, zt, P, Jr, gi, pt, Ns, Zr, Qr, xa, el, tl, il;
function Bh(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : Kh(e.sourceUrl);
    default:
      return "Media library";
  }
}
function Kh(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let mt = class extends L {
  constructor() {
    super(), $i(this, P), $i(this, $a), $i(this, Ki), $i(this, ji), this._fonts = [], this._loading = !0, $i(this, zt, () => {
      var e;
      return (e = Me(this, $a)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(tr, (e) => {
      vs(this, Ki, e);
    }), this.consumeContext(fe, (e) => {
      vs(this, ji, e);
    }), this.consumeContext(Le, (e) => {
      vs(this, $a, e), e && z(this, P, gi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${z(this, P, Ns)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${z(this, P, Ns)}>
                  Add your first font
                </uui-button>
              </div>` : r`${J(this._fonts, (e) => e.key, (e) => z(this, P, el).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
$a = /* @__PURE__ */ new WeakMap();
Ki = /* @__PURE__ */ new WeakMap();
ji = /* @__PURE__ */ new WeakMap();
zt = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakSet();
Jr = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
gi = async function() {
  this._loading = !0;
  try {
    this._fonts = await za(Me(this, zt)), await Hr(this._fonts.map((e) => e.key), Me(this, zt));
  } catch (e) {
    z(this, P, pt).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
pt = function(e, t, i) {
  var s;
  const a = i instanceof ht ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Me(this, ji)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Ns = async function() {
  var i, a;
  if (!Me(this, Ki)) return;
  const e = Me(this, Ki).open(this, _h, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Me(this, ji)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await z(this, P, gi).call(this));
};
Zr = async function(e) {
  try {
    await td(e.key, Me(this, zt)), Yr(e.key), z(this, P, pt).call(this, "positive", `'${e.familyName}' refreshed`), await z(this, P, gi).call(this);
  } catch (t) {
    z(this, P, pt).call(this, "danger", "That font could not be refreshed", t);
  }
};
Qr = async function(e) {
  await mo(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await ad(e.key, Me(this, zt)), Yr(e.key), z(this, P, pt).call(this, "positive", `'${e.familyName}' deleted`), await z(this, P, gi).call(this);
  } catch (t) {
    z(this, P, pt).call(this, "danger", "That font could not be deleted", t);
  }
};
xa = async function(e, t, i, a) {
  try {
    await id(e.key, t, i, Me(this, zt), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), z(this, P, pt).call(this, "positive", `'${t}' saved`), await z(this, P, gi).call(this), a != null && a.keepOpen && await z(this, P, Jr).call(this);
  } catch (s) {
    z(this, P, pt).call(this, "danger", "The font could not be saved", s);
  }
};
el = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${Bh(e)} · weight ${e.weight}
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
                  @click=${() => z(this, P, Zr).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => z(this, P, Qr).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${ns(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? z(this, P, il).call(this, e) : z(this, P, tl).call(this, e)}
      </div>
    `;
};
tl = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${J(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
il = function(e) {
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
          ${J(
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
      t.splice(a, 1), z(this, P, xa).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), z(this, P, xa).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    z(this, P, xa).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
mt.styles = A`
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
rs([
  f()
], mt.prototype, "_fonts", 2);
rs([
  f()
], mt.prototype, "_loading", 2);
rs([
  f()
], mt.prototype, "_editingKey", 2);
mt = rs([
  M("di-fonts-dashboard")
], mt);
const jh = mt, Vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return mt;
  },
  default: jh
}, Symbol.toStringTag, { value: "Module" }));
var Gh = Object.defineProperty, qh = Object.getOwnPropertyDescriptor, al = (e) => {
  throw TypeError(e);
}, na = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Gh(t, i, s), s;
}, Eo = (e, t, i) => t.has(e) || al("Cannot " + i), tt = (e, t, i) => (Eo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ga = (e, t, i) => t.has(e) ? al("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), zn = (e, t, i, a) => (Eo(e, t, "write to private field"), t.set(e, i), i), Gt = (e, t, i) => (Eo(e, t, "access private method"), i), ka, qt, hi, ut, ja, Bs, sl;
let Ve = class extends L {
  constructor() {
    super(), ga(this, ut), ga(this, ka), ga(this, qt), this._loading = !0, this._busy = !1, ga(this, hi, () => {
      var e;
      return (e = tt(this, ka)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(fe, (e) => {
      zn(this, qt, e);
    }), this.consumeContext(Le, (e) => {
      zn(this, ka, e), e && Gt(this, ut, ja).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Gt(this, ut, ja).call(this)}>Re-check</uui-button>
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
                ${J(
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
                        ${a.templateKey ? r`<a href=${yo(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Gt(this, ut, sl).call(this)}
      </umb-body-layout>
    `;
  }
};
ka = /* @__PURE__ */ new WeakMap();
qt = /* @__PURE__ */ new WeakMap();
hi = /* @__PURE__ */ new WeakMap();
ut = /* @__PURE__ */ new WeakSet();
ja = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      ur(tt(this, hi)),
      ud(tt(this, hi)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
Bs = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await dd(tt(this, hi)) : await hd(tt(this, hi));
    (t = tt(this, qt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = tt(this, qt)) == null || i.peek("warning", { data: { message: o } });
    await Gt(this, ut, ja).call(this);
  } catch (s) {
    (a = tt(this, qt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
sl = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Gt(this, ut, Bs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Gt(this, ut, Bs).call(this, "import")}>
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
na([
  f()
], Ve.prototype, "_health", 2);
na([
  f()
], Ve.prototype, "_sync", 2);
na([
  f()
], Ve.prototype, "_loading", 2);
na([
  f()
], Ve.prototype, "_busy", 2);
Ve = na([
  M("di-health-dashboard")
], Ve);
const Hh = Ve, Yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Ve;
  },
  default: Hh
}, Symbol.toStringTag, { value: "Module" })), ol = 3, nl = 12, rl = 0.1, ll = 0.9;
function Xh(e) {
  return Math.max(ol, Math.min(nl, e));
}
function Jh(e) {
  return Math.max(rl, Math.min(ll, e));
}
function Zh(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Xh(t), s = 0.5 * Jh(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let h = 0; h < o; h++) {
    const m = (-90 + h * n) * Math.PI / 180, C = e === "star" && h % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + C * Math.cos(m), y: 0.5 + C * Math.sin(m) });
  }
  return l;
}
function Qh(e, t, i) {
  const a = Zh(e, t, i);
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
  sides: { min: ol, max: nl },
  innerRatio: { min: rl, max: ll }
}, Va = { min: 0.1, max: 4 };
function ep(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function cl(e) {
  if (e.kind === "radial") {
    const t = Math.round(Ln(e.centreX ?? 0.5) * 100), i = Math.round(Ln(e.centreY ?? 0.5) * 100);
    return `radial-gradient(ellipse farthest-corner at ${t}% ${i}%, ${e.from}, ${e.to})`;
  }
  return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
}
function Ln(e) {
  return Math.min(1, Math.max(0, e));
}
const Co = A`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function tp(e, t) {
  const i = [], a = t.lockX ? void 0 : Fn(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    ip(t),
    t.threshold
  ), s = t.lockY ? void 0 : Fn(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    ap(t),
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
function ip(e) {
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
function ap(e) {
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
function Fn(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var sp = Object.defineProperty, op = Object.getOwnPropertyDescriptor, ul = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? op(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && sp(t, i, s), s;
}, Do = (e, t, i) => t.has(e) || ul("Cannot " + i), $e = (e, t, i) => (Do(e, t, "read from private field"), i ? i.call(e) : t.get(e)), bs = (e, t, i) => t.has(e) ? ul("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _s = (e, t, i, a) => (Do(e, t, "write to private field"), t.set(e, i), i), j = (e, t, i) => (Do(e, t, "access private method"), i), _t, Ci, I, ls, Oo, dl, hl, pl, ml, Io, Ga, fl, gl, yl, vl, bl, _l, wl, $l, xl;
const np = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], ws = 18;
let Ee = class extends L {
  constructor() {
    super(...arguments), bs(this, I), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, bs(this, _t), bs(this, Ci);
  }
  willUpdate() {
    this._box = j(this, I, dl).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== $e(this, Ci) && ((t = $e(this, _t)) == null || t.disconnect(), _s(this, Ci, e), e && ($e(this, _t) ?? _s(this, _t, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), $e(this, _t).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = $e(this, _t)) == null || e.disconnect(), _s(this, Ci, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${Xn({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${W({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...$e(this, I, hl) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...j(this, I, Io).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      j(this, I, fl).call(this, t), j(this, I, Ga).call(this, t);
    }}>
        ${j(this, I, gl).call(this)}
      </div>

      ${this.selected ? j(this, I, $l).call(this, e) : p}
      ${this.showMeasured && this.measured ? j(this, I, xl).call(this) : p}
    `;
  }
};
_t = /* @__PURE__ */ new WeakMap();
Ci = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakSet();
ls = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Oo = function() {
  return this.layer.rotation ?? 0;
};
dl = function() {
  var s;
  const e = this.layer, t = e.size.width ?? j(this, I, pl).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? j(this, I, ml).call(this), a = os($e(this, I, ls), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
hl = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
pl = function() {
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
ml = function() {
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
Io = function(e) {
  const t = $e(this, I, Oo);
  if (t === 0) return {};
  const i = $e(this, I, ls);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Ga = function(e, t) {
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
fl = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
gl = function() {
  switch (this.layer.type) {
    case "text":
      return j(this, I, yl).call(this);
    case "image":
      return j(this, I, bl).call(this);
    case "badges":
      return j(this, I, _l).call(this);
    default:
      return j(this, I, wl).call(this);
  }
};
yl = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || j(this, I, vl).call(this);
  return r`
      <div
        class="text"
        style=${W({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${ns(e.fontKey)}, sans-serif`,
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
vl = function() {
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
bl = function() {
  if (this.layer.type !== "image") return p;
  const e = this.layer.border;
  return r`
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
_l = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", h = l && o, m = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${W({
    flexDirection: l ? "row" : "column",
    flexWrap: h ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...h ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${J(
    Array.from({ length: Math.max(1, a) }, (C, k) => k),
    (C) => C,
    () => r`
            <div class=${Xn({ badge: !0, right: m === "right" })}>
              <div
                class="circle"
                style=${W({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${m === "none" ? p : r`<div
                    class="badge-label"
                    style=${W({
      ...m === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${ns(t.fontKey)}, sans-serif`,
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
wl = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? cl(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${W({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${o}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const n = Qh(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${W({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${W({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
$l = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = $e(this, I, ls), n = $e(this, I, Oo), l = Re(this.layer.position, "x") || Re(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${W({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...j(this, I, Io).call(this, e) })}>
        <span
          class="tag"
          style=${W(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${J(
    np,
    (h) => h,
    (h) => r`
                  <span
                    class="handle ${h}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${h}"
                    @pointerdown=${(m) => j(this, I, Ga).call(this, m, h)}>
                  </span>
                `
  )}
              <span class="stalk" style=${W({ height: `${ws}px`, top: `${-ws}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${W({ top: `${-ws}px` })}
                @pointerdown=${(h) => j(this, I, Ga).call(this, h, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${W({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
xl = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return r`
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
Ee.styles = A`
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
  y({ type: Object })
], Ee.prototype, "layer", 2);
Xe([
  y({ type: Number })
], Ee.prototype, "scale", 2);
Xe([
  y({ type: Boolean, reflect: !0 })
], Ee.prototype, "selected", 2);
Xe([
  y({ type: Object })
], Ee.prototype, "measured", 2);
Xe([
  y({ type: Boolean })
], Ee.prototype, "showMeasured", 2);
Xe([
  y({ type: String })
], Ee.prototype, "resolvedText", 2);
Xe([
  y({ attribute: !1 })
], Ee.prototype, "resolvedPosition", 2);
Xe([
  f()
], Ee.prototype, "_box", 2);
Ee = Xe([
  M("di-layer-box")
], Ee);
var rp = Object.defineProperty, lp = Object.getOwnPropertyDescriptor, kl = (e) => {
  throw TypeError(e);
}, Po = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? lp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && rp(t, i, s), s;
}, cp = (e, t, i) => t.has(e) || kl("Cannot " + i), up = (e, t, i) => t.has(e) ? kl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), dp = (e, t, i) => (cp(e, t, "access private method"), i), Ks, Tl;
let Vi = class extends L {
  constructor() {
    super(...arguments), up(this, Ks), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${J(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => dp(this, Ks, Tl).call(this, e)
    )}`;
  }
};
Ks = /* @__PURE__ */ new WeakSet();
Tl = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Vi.styles = A`
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
Po([
  y({ type: Array })
], Vi.prototype, "guides", 2);
Po([
  y({ type: Number })
], Vi.prototype, "scale", 2);
Vi = Po([
  M("di-guides")
], Vi);
var hp = Object.defineProperty, pp = Object.getOwnPropertyDescriptor, Sl = (e) => {
  throw TypeError(e);
}, ra = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? pp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && hp(t, i, s), s;
}, mp = (e, t, i) => t.has(e) || Sl("Cannot " + i), fp = (e, t, i) => t.has(e) ? Sl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Un = (e, t, i) => (mp(e, t, "access private method"), i), Ta, js;
let G = class extends L {
  constructor() {
    super(...arguments), fp(this, Ta), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Un(this, Ta, js).call(this, "top"), Un(this, Ta, js).call(this, "left");
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
Ta = /* @__PURE__ */ new WeakSet();
js = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : G.thickness) * o, t.height = (e === "top" ? G.thickness : s) * o, t.style.width = `${e === "top" ? s : G.thickness}px`, t.style.height = `${e === "top" ? G.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const h = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, C = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(h, G.thickness - C), i.lineTo(h, G.thickness)) : (i.moveTo(G.thickness - C, h), i.lineTo(G.thickness, h)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), h + 2, 9) : (i.save(), i.translate(9, h - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
G.thickness = 20;
G.styles = A`
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
  y({ type: Number })
], G.prototype, "canvasWidth", 2);
ra([
  y({ type: Number })
], G.prototype, "canvasHeight", 2);
ra([
  y({ type: Number })
], G.prototype, "scale", 2);
ra([
  y({ type: Object })
], G.prototype, "pointer", 2);
G = ra([
  M("di-rulers")
], G);
var gp = Object.defineProperty, yp = Object.getOwnPropertyDescriptor, El = (e) => {
  throw TypeError(e);
}, re = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && gp(t, i, s), s;
}, Ao = (e, t, i) => t.has(e) || El("Cannot " + i), R = (e, t, i) => (Ao(e, t, "read from private field"), i ? i.call(e) : t.get(e)), le = (e, t, i) => t.has(e) ? El("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Sa = (e, t, i, a) => (Ao(e, t, "write to private field"), t.set(e, i), i), O = (e, t, i) => (Ao(e, t, "access private method"), i), wt, Di, dt, D, Mo, Vs, Gs, cs, Ro, qs, Cl, Dl, zo, Ol, Il, Hs, Ea, Pl, Al, Bt, Lo, Ys, Xs, Js, Ml, Zs, Qs, eo, Rl;
const vp = 6, zl = 20, bp = 2, _p = 15, wp = 0.1;
let X = class extends L {
  constructor() {
    super(...arguments), le(this, D), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, le(this, wt), le(this, Di), le(this, dt, /* @__PURE__ */ new Map()), le(this, Hs, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = O(this, D, Ro).call(this, t), a = O(this, D, qs).call(this, t), s = O(this, D, Cl).call(this, t), o = O(this, D, cs).call(this, e.detail.startX, e.detail.startY);
      Sa(this, wt, {
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
    }), le(this, Ea, (e) => {
      var vi, se;
      this._pointer = O(this, D, Gs).call(this, e.clientX, e.clientY);
      const t = R(this, wt);
      if (!t) return;
      const i = this.template.layers.find((_e) => _e.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        O(this, D, Al).call(this, i, t, e);
        return;
      }
      const o = Re(i.position, "x"), n = Re(i.position, "y"), l = t.startRotation, h = e.shiftKey || i.type === "rect" && i.lockAspect === !0;
      if (t.handle && l !== 0) {
        O(this, D, Pl).call(this, i, t, t.handle, a, s, h, o, n);
        return;
      }
      let m = t.handle ? O(this, D, Lo).call(this, t.startBox, t.handle, a, s, h) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (m = { ...m, x: t.startBox.x, width: (vi = t.handle) != null && vi.includes("w") ? t.startBox.width : m.width }), n && (m = { ...m, y: t.startBox.y, height: (se = t.handle) != null && se.includes("n") ? t.startBox.height : m.height });
      const C = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, k = l !== 0 ? { x: m.x + C.x, y: m.y + C.y, width: t.startExtent.width, height: t.startExtent.height } : m, ae = this.snapEnabled && !e.altKey ? tp(k, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((_e) => _e.key !== i.key).map((_e) => O(this, D, qs).call(this, _e)),
        threshold: vp / this.scale,
        lockX: o,
        lockY: n
      }) : {
        box: {
          ...k,
          x: o ? k.x : Math.round(k.x),
          y: n ? k.y : Math.round(k.y)
        },
        guides: []
      };
      this._guides = ae.guides;
      const ge = l !== 0 ? { ...m, x: ae.box.x - C.x, y: ae.box.y - C.y } : ae.box, ye = xd(ge, i.position);
      o && (ye.x = i.position.x), n && (ye.y = i.position.y);
      const Wt = { position: ye };
      t.handle && (Wt.size = {
        width: Math.max(1, Math.round(ge.width)),
        height: Math.max(1, Math.round(ge.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Wt } })
      );
    }), le(this, Bt, () => {
      if (!R(this, wt)) return;
      const e = R(this, wt).moved;
      Sa(this, wt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), le(this, Ys, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), le(this, Xs, () => {
      this._dropTarget = !1;
    }), le(this, Js, (e) => {
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
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: O(this, D, Ml).call(this, e) }
        })
      );
    }), le(this, Zs, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), le(this, Qs, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => br(t.position)) && this.requestUpdate();
    }), le(this, eo, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), Sa(this, Di, new ResizeObserver(() => O(this, D, Vs).call(this))), R(this, Di).observe(this), window.addEventListener("pointermove", R(this, Ea)), window.addEventListener("pointerup", R(this, Bt)), window.addEventListener("pointercancel", R(this, Bt));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = R(this, Di)) == null || e.disconnect(), window.removeEventListener("pointermove", R(this, Ea)), window.removeEventListener("pointerup", R(this, Bt)), window.removeEventListener("pointercancel", R(this, Bt));
  }
  updated(e) {
    O(this, D, Vs).call(this), e.has("zoom") && O(this, D, Mo).call(this);
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
    O(this, D, Dl).call(this);
    const s = this.showRulers ? zl : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${R(this, Zs)}
        @dragover=${R(this, Ys)}
        @dragleave=${R(this, Xs)}
        @drop=${R(this, Js)}
        @di-layer-drag-start=${R(this, Hs)}
        @di-layer-box-resize=${R(this, Qs)}>
        <div
          class="artboard"
          style=${W({
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
            style=${W({
      background: e.backgroundGradient ? cl(e.backgroundGradient) : e.background
    })}
            @pointerdown=${R(this, eo)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${W({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${J(
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
                  .resolvedPosition=${(l = R(this, dt).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? O(this, D, Rl).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
wt = /* @__PURE__ */ new WeakMap();
Di = /* @__PURE__ */ new WeakMap();
dt = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakSet();
Mo = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Vs = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? zl : 0) + bp, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, O(this, D, Mo).call(this));
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
Ro = function(e) {
  const t = R(this, dt).get(e.key);
  if (t) return t.box;
  const i = O(this, D, zo).call(this, e), a = os(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
qs = function(e) {
  const t = R(this, dt).get(e.key);
  return t ? t.extent : vr(O(this, D, Ro).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
Cl = function(e) {
  var t;
  return ((t = R(this, dt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
Dl = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  Sa(this, dt, Dd(
    this.template.layers,
    (i) => O(this, D, zo).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
zo = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? O(this, D, Ol).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? O(this, D, Il).call(this, e, i)
  };
};
Ol = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Il = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Hs = /* @__PURE__ */ new WeakMap();
Ea = /* @__PURE__ */ new WeakMap();
Pl = function(e, t, i, a, s, o, n, l) {
  const h = t.startRotation, m = t.startPosition, C = kd(a, s, 0, 0, h);
  let k = O(this, D, Lo).call(this, t.startBox, i, C.x, C.y, o);
  n && (k = { ...k, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : k.width }), l && (k = { ...k, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : k.height });
  const K = Math.max(1, Math.round(k.width)), ae = Math.max(1, Math.round(k.height)), ge = vo(k.x, k.y, K, ae, m.anchor), ye = Kt(ge.x, ge.y, m.x, m.y, h), Wt = {
    ...e.position,
    x: n ? e.position.x : Math.round(ye.x),
    y: l ? e.position.y : Math.round(ye.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Wt, size: { width: K, height: ae } } }
    })
  );
};
Al = function(e, t, i) {
  const a = t.startPosition, s = O(this, D, cs).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, h = i.shiftKey ? _p : wp, m = yr(Math.round(l / h) * h);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
Bt = /* @__PURE__ */ new WeakMap();
Lo = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: h } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, h = e.height - a), t.includes("s") && (h = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(h - e.height) ? h = l / m : l = h * m, t.includes("n") && (n = e.y + e.height - h), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, h) };
};
Ys = /* @__PURE__ */ new WeakMap();
Xs = /* @__PURE__ */ new WeakMap();
Js = /* @__PURE__ */ new WeakMap();
Ml = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Zs = /* @__PURE__ */ new WeakMap();
Qs = /* @__PURE__ */ new WeakMap();
eo = /* @__PURE__ */ new WeakMap();
Rl = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${W({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
X.styles = A`
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
      ${Co}
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
  y({ type: Object })
], X.prototype, "template", 2);
re([
  y({ type: String })
], X.prototype, "selectedLayerKey", 2);
re([
  y({ type: Object })
], X.prototype, "baseImageUrl", 2);
re([
  y({ type: Array })
], X.prototype, "serverBounds", 2);
re([
  y({ type: Boolean })
], X.prototype, "showMeasured", 2);
re([
  y({ type: Boolean })
], X.prototype, "snapEnabled", 2);
re([
  y({ type: Boolean })
], X.prototype, "showRulers", 2);
re([
  y({ type: Boolean })
], X.prototype, "showSafeArea", 2);
re([
  y({ type: Number })
], X.prototype, "zoom", 2);
re([
  f()
], X.prototype, "_fitScale", 2);
re([
  f()
], X.prototype, "_guides", 2);
re([
  f()
], X.prototype, "_pointer", 2);
re([
  f()
], X.prototype, "_dropTarget", 2);
X = re([
  M("di-designer-canvas")
], X);
var $p = Object.defineProperty, xp = Object.getOwnPropertyDescriptor, Ll = (e) => {
  throw TypeError(e);
}, Fo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? xp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && $p(t, i, s), s;
}, Fl = (e, t, i) => t.has(e) || Ll("Cannot " + i), kp = (e, t, i) => (Fl(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Tp = (e, t, i) => t.has(e) ? Ll("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), be = (e, t, i) => (Fl(e, t, "access private method"), i), te, Ul, Uo, Wo, Wl, Nl, Bl, Kl, Mi;
const Wn = {
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
let Gi = class extends L {
  constructor() {
    super(...arguments), Tp(this, te), this.properties = [], this._search = "";
  }
  render() {
    const e = Sp(kp(this, te, Ul));
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

        ${be(this, te, Nl).call(this)}

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : J(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => be(this, te, Wl).call(this, t, i)
    )}
      </div>
    `;
  }
};
te = /* @__PURE__ */ new WeakSet();
Ul = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Uo = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Wo = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Wl = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${J(
    t,
    (i) => i.alias,
    (i) => be(this, te, Mi).call(
      this,
      i.name,
      Wn[i.classification] ?? Wn.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Nl = function() {
  return r`
      <div class="group">
        <h5>Elements</h5>
        ${be(this, te, Mi).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${be(this, te, Mi).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${be(this, te, Mi).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${be(this, te, Bl).call(this)}
      </div>
    `;
};
Bl = function() {
  const e = { kind: "static", layerType: "rect", preset: "rectangle" };
  return r`
      <div
        class="chip other shape"
        draggable="true"
        title="Shape"
        @dragstart=${(t) => be(this, te, Wo).call(this, t, e)}>
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
          ${gd.map((t) => r`
            <uui-menu-item
              label=${Ui[t].label}
              data-preset=${t}
              @click-label=${() => be(this, te, Kl).call(this, t)}>
              <uui-icon slot="icon" name=${Ui[t].icon}></uui-icon>
            </uui-menu-item>
          `)}
        </div>
      </uui-popover-container>
    `;
};
Kl = function(e) {
  var t, i, a;
  (a = (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#shape-menu")) == null ? void 0 : i.hidePopover) == null || a.call(i), be(this, te, Uo).call(this, { kind: "static", layerType: "rect", preset: e });
};
Mi = function(e, t, i, a, s) {
  const o = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(n) => be(this, te, Wo).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => be(this, te, Uo).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Gi.styles = A`
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
Fo([
  y({ type: Array })
], Gi.prototype, "properties", 2);
Fo([
  f()
], Gi.prototype, "_search", 2);
Gi = Fo([
  M("di-property-palette")
], Gi);
function Sp(e) {
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
function Ep(e) {
  return e.backgroundGradient ? "gradient" : Cp(e.background) ? "transparent" : "colour";
}
function Cp(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function Dp(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var Op = Object.defineProperty, Ip = Object.getOwnPropertyDescriptor, jl = (e) => {
  throw TypeError(e);
}, us = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ip(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Op(t, i, s), s;
}, Vl = (e, t, i) => t.has(e) || jl("Cannot " + i), it = (e, t, i) => (Vl(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Pp = (e, t, i) => t.has(e) ? jl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ri = (e, t, i) => (Vl(e, t, "access private method"), i), Q, qi, zi, ds, Gl, ql;
let pi = class extends L {
  constructor() {
    super(...arguments), Pp(this, Q), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${it(this, Q, qi)};opacity:${it(this, Q, zi)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Ri(this, Q, ds).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${it(this, Q, qi)}
                  @input=${(e) => Ri(this, Q, Gl).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(it(this, Q, zi))}
                    @input=${(e) => Ri(this, Q, ql).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(it(this, Q, zi) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
Q = /* @__PURE__ */ new WeakSet();
qi = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
zi = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
ds = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Gl = function(e) {
  const t = it(this, Q, zi);
  Ri(this, Q, ds).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${Hl(t)}`);
};
ql = function(e) {
  Ri(this, Q, ds).call(this, e >= 0.999 ? it(this, Q, qi).toUpperCase() : `${it(this, Q, qi).toUpperCase()}${Hl(e)}`);
};
pi.styles = A`
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
us([
  y({ type: String })
], pi.prototype, "value", 2);
us([
  y({ type: String })
], pi.prototype, "label", 2);
us([
  f()
], pi.prototype, "_open", 2);
pi = us([
  M("di-colour-input")
], pi);
const Hl = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Ap = Object.defineProperty, Mp = Object.getOwnPropertyDescriptor, Yl = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ap(t, i, s), s;
};
const Nn = {
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
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${J(
      gr,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Nn[e]}
              title=${Nn[e]}
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
Yl([
  y({ type: String })
], qa.prototype, "value", 2);
qa = Yl([
  M("di-anchor-picker")
], qa);
var Rp = Object.defineProperty, zp = Object.getOwnPropertyDescriptor, Xl = (e) => {
  throw TypeError(e);
}, gt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Rp(t, i, s), s;
}, Lp = (e, t, i) => t.has(e) || Xl("Cannot " + i), Fp = (e, t, i) => t.has(e) ? Xl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Up = (e, t, i) => (Lp(e, t, "access private method"), i), to, Jl;
let ze = class extends L {
  constructor() {
    super(...arguments), Fp(this, to), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${Up(this, to, Jl)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
to = /* @__PURE__ */ new WeakSet();
Jl = function(e) {
  const t = e.target, i = t.value, a = ep(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
ze.styles = A`
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
gt([
  y({ type: Number })
], ze.prototype, "value", 2);
gt([
  y({ type: String })
], ze.prototype, "label", 2);
gt([
  y({ type: String })
], ze.prototype, "suffix", 2);
gt([
  y({ type: Number })
], ze.prototype, "step", 2);
gt([
  y({ type: Number })
], ze.prototype, "min", 2);
gt([
  y({ type: Number })
], ze.prototype, "max", 2);
gt([
  y({ type: String })
], ze.prototype, "placeholder", 2);
ze = gt([
  M("di-number-field")
], ze);
var Wp = Object.defineProperty, Np = Object.getOwnPropertyDescriptor, Zl = (e) => {
  throw TypeError(e);
}, Ut = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Np(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wp(t, i, s), s;
}, Bp = (e, t, i) => t.has(e) || Zl("Cannot " + i), Kp = (e, t, i) => t.has(e) ? Zl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (Bp(e, t, "access private method"), i), u, v, xe, Ql, ec, tc, No, io, ic, ac, sc, oc, nc, rc, ao, lc, cc, so, uc, Ca, dc, hc, Bo, yi, pc, Ko, mc;
const jp = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let Ge = class extends L {
  constructor() {
    super(...arguments), Kp(this, u), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? d(this, u, ic).call(this, this.layer) : d(this, u, Ql).call(this)}</div>` : p;
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
xe = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Ql = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${g.width.min}
            .max=${g.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => d(this, u, xe).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => d(this, u, xe).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${d(this, u, ec).call(this, e)}

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${fc(e.baseImage.kind)}
              @change=${(t) => d(this, u, xe).call(this, {
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
                @change=${(t) => d(this, u, xe).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${d(this, u, yi).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, xe).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${Y(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => d(this, u, xe).call(this, { baseImageFit: t.target.value })}>
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
ec = function(e) {
  const t = Ep(e);
  return r`
      <label class="field">
        <span>Fill</span>
        <uui-select
          .value=${t}
          .options=${Y(["colour", "gradient", "transparent"], t)}
          @change=${(i) => d(this, u, tc).call(this, e, i.target.value)}>
        </uui-select>
      </label>

      ${t === "colour" ? r`<label class="field">
            <span>Colour</span>
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => d(this, u, xe).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </label>` : p}

      ${t === "gradient" && e.backgroundGradient ? d(this, u, No).call(this, e.backgroundGradient, (i) => d(this, u, xe).call(this, { backgroundGradient: i })) : p}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : p}
    `;
};
tc = function(e, t) {
  if (t === "gradient") {
    d(this, u, xe).call(this, { backgroundGradient: e.backgroundGradient ?? fr() });
    return;
  }
  d(this, u, xe).call(this, {
    background: Dp(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
No = function(e, t) {
  return r`
      <label class="field">
        <span>Type</span>
        <uui-select
          .value=${e.kind}
          .options=${Y(["linear", "radial"], e.kind)}
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
            ${d(this, u, io).call(this, "Centre X", e.centreX, (i) => t({ ...e, centreX: i }))}
            ${d(this, u, io).call(this, "Centre Y", e.centreY, (i) => t({ ...e, centreY: i }))}
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
io = function(e, t, i) {
  return r`<di-number-field
      .min=${g.gradientCentre.min * 100}
      .max=${g.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
ic = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, v).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, ac).call(this, e) : p}
      ${e.type === "text" ? d(this, u, sc).call(this, e) : p}
      ${e.type === "image" ? d(this, u, oc).call(this, e) : p}
      ${e.type === "badges" ? d(this, u, nc).call(this, e) : p}
      ${e.type === "rect" ? d(this, u, lc).call(this, e) : p}
      ${d(this, u, cc).call(this, e)} ${d(this, u, hc).call(this, e)}
    `;
};
ac = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
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
            @change=${(i) => d(this, u, v).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? d(this, u, Bo).call(this, "Property", d(this, u, yi).call(this, t.propertyAlias ?? "", (i) => d(this, u, v).call(this, { binding: { ...t, propertyAlias: i } }))) : p}

        ${t.kind === "date" ? r`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => d(this, u, v).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "static" || t.kind === "expression" ? r`<label class="field">
              <span>${t.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => d(this, u, v).call(this, {
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
              @change=${(i) => d(this, u, v).call(this, { prefix: i.target.value })}>
            </uui-input>
          </label>
          <label class="field">
            <span>Suffix</span>
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => d(this, u, v).call(this, { suffix: i.target.value })}>
            </uui-input>
          </label>
        </div>
      </uui-box>
    `;
};
sc = function(e) {
  const t = e.style, i = (a) => d(this, u, v).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, Ko).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${d(this, u, mc).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
              .options=${Y(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${Y(["left", "centre", "right"], t.textAlign)}
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
              .options=${Y(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${Y(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
oc = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${fc(t.kind)}
            @change=${(a) => d(this, u, v).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? d(this, u, Bo).call(this, "Property", d(this, u, yi).call(
    this,
    t.propertyAlias ?? "",
    (a) => d(this, u, v).call(this, { source: { ...t, propertyAlias: a } }),
    // The root widens from media to media + content, and the media filter moves to the
    // tail: that is exactly the author.mainImage case, and it never offers a text
    // property as an image source.
    { root: ["media", "content"], tail: "media" }
  )) : p}

        ${t.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => d(this, u, v).call(this, {
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
            .options=${Y(["cover", "contain", "stretch"], e.fit)}
            @change=${(a) => d(this, u, v).call(this, { fit: a.target.value })}>
          </uui-select>
        </label>

        <di-number-field
          .min=${g.cornerRadius.min}
          .max=${g.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => d(this, u, v).call(this, { cornerRadius: a.detail.value ?? 0 })}>
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
    d(this, u, v).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => d(this, u, v).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : p}
          </div>
        </label>
      </uui-box>
    `;
};
nc = function(e) {
  const t = (s) => d(this, u, v).call(this, { badge: { ...e.badge, ...s } }), i = (s) => d(this, u, v).call(this, { label: { ...e.label, ...s } }), a = (s) => d(this, u, v).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${d(this, u, yi).call(this, e.itemsPropertyAlias, (s) => d(this, u, v).call(this, { itemsPropertyAlias: s }))}
        </label>

        <div class="pair">
          <di-number-field
            .min=${g.maxItems.min}
            .max=${g.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => d(this, u, v).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${g.gap.min}
            .max=${g.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => d(this, u, v).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${e.direction}
            .options=${Y(["horizontal", "vertical"], e.direction)}
            @change=${(s) => d(this, u, v).call(this, { direction: s.target.value })}>
          </uui-select>
        </label>

        ${e.direction === "horizontal" ? r`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => d(this, u, v).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </label>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${g.rowGap.min}
                      .max=${g.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => d(this, u, v).call(this, { rowGap: s.detail.value ?? 20 })}>
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
            .options=${Y(["below", "right", "none"], e.label.position, {
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
                  .options=${d(this, u, Ko).call(this, e.label.fontKey)}
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
                  .options=${Y(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
rc = function(e, t) {
  if (t === "circle") {
    const a = e.size.width ?? e.size.height ?? 200;
    d(this, u, v).call(this, { shape: "ellipse", lockAspect: !0, size: { ...e.size, width: a, height: a } });
    return;
  }
  const i = oo(e) === "circle";
  d(this, u, v).call(this, {
    shape: t,
    ...i ? { lockAspect: !1 } : {}
  });
};
ao = function(e, t, i) {
  const a = e.type === "rect" && e.lockAspect === !0, { width: s, height: o } = e.size;
  if (!a || i === null || !s || !o) {
    d(this, u, v).call(this, { size: { ...e.size, [t]: i } });
    return;
  }
  const n = t === "width" ? { width: i, height: Math.round(i * o / s) } : { width: Math.round(i * s / o), height: i };
  d(this, u, v).call(this, { size: n });
};
lc = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${oo(e)}
            .options=${Y(["rectangle", "circle", "ellipse", "polygon", "star"], oo(e))}
            @change=${(s) => d(this, u, rc).call(this, e, s.target.value)}>
          </uui-select>
        </label>

        <label class="field inline">
          <span>Lock aspect ratio</span>
          <uui-toggle
            label="Lock aspect ratio"
            ?checked=${e.lockAspect === !0}
            @change=${(s) => d(this, u, v).call(this, { lockAspect: s.target.checked })}>
          </uui-toggle>
        </label>

        ${t === "polygon" || t === "star" ? r`
              <div class="pair">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  .min=${g.sides.min}
                  .max=${g.sides.max}
                  .value=${e.sides ?? 5}
                  @change=${(s) => d(this, u, v).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${g.innerRatio.min}
                      .max=${g.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => d(this, u, v).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : p}
              </div>
            ` : p}

        <label class="field inline">
          <span>Fill</span>
          <uui-toggle
            ?checked=${i}
            @change=${(s) => d(this, u, v).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </label>

        ${i ? r`<label class="field">
              <span>Fill colour</span>
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => d(this, u, v).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </label>` : p}

        <label class="field inline">
          <span>Gradient</span>
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => d(this, u, v).call(this, {
    gradient: s.target.checked ? fr() : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? d(this, u, No).call(this, e.gradient, (s) => d(this, u, v).call(this, { gradient: s })) : p}

        ${t === "rectangle" ? r`<di-number-field
            .min=${g.cornerRadius.min}
            .max=${g.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => d(this, u, v).call(this, { cornerRadius: s.detail.value ?? 0 })}>
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
    d(this, u, v).call(this, {
      border: o > 0 ? { width: o, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => d(this, u, v).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : p}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </label>
      </uui-box>
    `;
};
cc = function(e) {
  const t = Re(e.position, "x"), i = Re(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${d(this, u, so).call(this, e, "x")} ${d(this, u, so).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => d(this, u, dc).call(this, e, s.detail.value)}>
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
            @change=${(s) => d(this, u, v).call(this, { rotation: yr(s.detail.value ?? 0) })}>
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
            @change=${(s) => d(this, u, ao).call(this, e, "width", s.detail.value)}>
          </di-number-field>
          <di-number-field
            .min=${g.height.min}
            .max=${g.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => d(this, u, ao).call(this, e, "height", s.detail.value)}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
so = function(e, t) {
  const i = Re(e.position, t), a = La(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => d(this, u, uc).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => d(this, u, Ca).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${Y(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => d(this, u, Ca).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${g.referenceGap.min}
                .max=${g.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => d(this, u, Ca).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? g.x.min : g.y.min}
                .max=${t === "x" ? g.x.max : g.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => d(this, u, v).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
uc = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Re(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && d(this, u, v).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Td
      }
    }
  });
};
Ca = function(e, t, i) {
  const a = La(e.position, t);
  a && d(this, u, v).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
dc = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? $d(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, v).call(this, { position: s });
};
hc = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <label class="field inline">
          <span>Visible</span>
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => d(this, u, v).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </label>

        <label class="field inline">
          <span>Locked</span>
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => d(this, u, v).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </label>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${g.opacity.min}
          .max=${g.opacity.max}
          .value=${e.opacity}
          @change=${(t) => d(this, u, v).call(this, { opacity: t.detail.value ?? 1 })}>
        </di-number-field>

        <label class="field">
          <span>Show this layer</span>
          <uui-select
            .value=${e.visibility.rule}
            .options=${Y(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
    always: "Always",
    whenNotEmpty: "When it has a value",
    whenPropertyTruthy: "When another property is set"
  })}
            @change=${(t) => d(this, u, v).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </label>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<label class="field">
              <span>Controlled by</span>
              ${d(this, u, yi).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, v).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
Bo = function(e, t, i) {
  return r`
      <umb-property-layout orientation="vertical" label=${e} description=${Es(i)}>
        <div slot="editor" class="editor">${t}</div>
      </umb-property-layout>
    `;
};
yi = function(e, t, i = {}) {
  const a = Id(e), s = [];
  for (let o = 0; o <= Is; o++) {
    const n = pn(a, o), l = o === 0 ? this.properties : this.linkedProperties[n] ?? [], h = a[o] ?? "";
    if (o > 0) {
      const k = (o === 1 ? this.properties : this.linkedProperties[pn(a, o - 1)] ?? []).some(
        (K) => K.alias === a[o - 1] && K.classification === "content"
      );
      if (!a[o - 1] || !k && !h) break;
    }
    const m = d(this, u, pc).call(this, jp(l, o === 0 ? i.root : i.tail), h, (C) => t([...a.slice(0, o), C].filter(Boolean).join(".")));
    s.push(o === 0 ? m : r`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[n] ?? "Property on the linked item"}</span>
            ${m}
          </div>`);
  }
  return s.length === 1 ? s[0] : r`<div class="path">${s}</div>`;
};
pc = function(e, t, i) {
  return r`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${zd(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
Ko = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
mc = function(e, t, i) {
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
Ge.styles = A`
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

    /* The same space above and below every field as the umb-property-layout ones get, so a
       dropdown never sits tight against the one before or after it. */
    .field {
      display: grid;
      gap: var(--uui-size-space-1);
      padding: var(--uui-size-space-3) 0;
    }

    /* The box already pads its top edge. */
    .field:first-child {
      padding-top: 0;
    }

    .field > span {
      font-size: 11px;
      color: var(--uui-color-text-alt);
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

    .property-select {
      width: 100%;
      min-width: 0;
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
Ut([
  y({ type: Object })
], Ge.prototype, "template", 2);
Ut([
  y({ type: Object })
], Ge.prototype, "layer", 2);
Ut([
  y({ type: Array })
], Ge.prototype, "properties", 2);
Ut([
  y({ type: Object })
], Ge.prototype, "linkedProperties", 2);
Ut([
  y({ type: Object })
], Ge.prototype, "linkedCaptions", 2);
Ut([
  y({ type: Array })
], Ge.prototype, "fonts", 2);
Ge = Ut([
  M("di-layer-inspector")
], Ge);
function Y(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function fc(e) {
  return Y(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
function oo(e) {
  const t = e.shape ?? "rectangle";
  return t === "ellipse" && e.lockAspect === !0 ? "circle" : t;
}
var Vp = Object.defineProperty, Gp = Object.getOwnPropertyDescriptor, gc = (e) => {
  throw TypeError(e);
}, la = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Vp(t, i, s), s;
}, qp = (e, t, i) => t.has(e) || gc("Cannot " + i), Hp = (e, t, i) => t.has(e) ? gc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Oe = (e, t, i) => (qp(e, t, "access private method"), i), ve, $t, yc, vc, bc, _c;
const Yp = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Lt = class extends L {
  constructor() {
    super(...arguments), Hp(this, ve), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Oe(this, ve, bc)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : J(
      e,
      (t) => t.key,
      (t, i) => Oe(this, ve, _c).call(this, t, i)
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
yc = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
vc = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
bc = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Oe(this, ve, $t).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
_c = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Oe(this, ve, yc).call(this, a, e.key)}
        @dragover=${(a) => Oe(this, ve, vc).call(this, a, t)}
        @click=${() => Oe(this, ve, $t).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Yp[e.type]}></uui-icon>
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
la([
  y({ type: Array })
], Lt.prototype, "layers", 2);
la([
  y({ type: String })
], Lt.prototype, "selectedLayerKey", 2);
la([
  f()
], Lt.prototype, "_dragKey", 2);
la([
  f()
], Lt.prototype, "_dropIndex", 2);
Lt = la([
  M("di-layers-panel")
], Lt);
var Xp = Object.defineProperty, Jp = Object.getOwnPropertyDescriptor, wc = (e) => {
  throw TypeError(e);
}, Je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Xp(t, i, s), s;
}, jo = (e, t, i) => t.has(e) || wc("Cannot " + i), Zp = (e, t, i) => (jo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Bn = (e, t, i) => t.has(e) ? wc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Qp = (e, t, i, a) => (jo(e, t, "write to private field"), t.set(e, i), i), oe = (e, t, i) => (jo(e, t, "access private method"), i), V, Ue, Ha, $c, xc, Oi;
let Ce = class extends L {
  constructor() {
    super(...arguments), Bn(this, V), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Bn(this, Ha, 100);
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
            @click=${() => oe(this, V, Ue).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${Va.min * 100}
            .max=${Va.max * 100}
            .value=${oe(this, V, $c).call(this)}
            @change=${oe(this, V, xc)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => oe(this, V, Ue).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => oe(this, V, Ue).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${oe(this, V, Oi).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${oe(this, V, Oi).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${oe(this, V, Oi).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${oe(this, V, Oi).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => oe(this, V, Ue).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => oe(this, V, Ue).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => oe(this, V, Ue).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
V = /* @__PURE__ */ new WeakSet();
Ue = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Ha = /* @__PURE__ */ new WeakMap();
$c = function() {
  return this.matches(":focus-within") || Qp(this, Ha, Math.round(this.effectiveScale * 100)), Zp(this, Ha);
};
xc = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && oe(this, V, Ue).call(this, "di-zoom-change", { zoom: t / 100 });
};
Oi = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => oe(this, V, Ue).call(this, i)}>
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
Je([
  y({ type: Number })
], Ce.prototype, "effectiveScale", 2);
Je([
  y({ type: Boolean })
], Ce.prototype, "snapEnabled", 2);
Je([
  y({ type: Boolean })
], Ce.prototype, "showRulers", 2);
Je([
  y({ type: Boolean })
], Ce.prototype, "showSafeArea", 2);
Je([
  y({ type: Boolean })
], Ce.prototype, "showMeasured", 2);
Je([
  y({ type: Boolean })
], Ce.prototype, "canUndo", 2);
Je([
  y({ type: Boolean })
], Ce.prototype, "canRedo", 2);
Je([
  y({ type: Boolean })
], Ce.prototype, "previewing", 2);
Ce = Je([
  M("di-canvas-toolbar")
], Ce);
var em = Object.defineProperty, tm = Object.getOwnPropertyDescriptor, kc = (e) => {
  throw TypeError(e);
}, Vo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? tm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && em(t, i, s), s;
}, Go = (e, t, i) => t.has(e) || kc("Cannot " + i), jt = (e, t, i) => (Go(e, t, "read from private field"), t.get(e)), ya = (e, t, i) => t.has(e) ? kc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), no = (e, t, i, a) => (Go(e, t, "write to private field"), t.set(e, i), i), Kn = (e, t, i) => (Go(e, t, "access private method"), i), mi, Da, Li, Oa, Tc, Sc;
let Hi = class extends L {
  constructor() {
    super(), ya(this, Oa), ya(this, mi), this._selection = [], ya(this, Da, ""), ya(this, Li), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(ft, (e) => {
      no(this, mi, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== jt(this, Da) && (no(this, Da, i), Kn(this, Oa, Tc).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
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
          @change=${Kn(this, Oa, Sc)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
mi = /* @__PURE__ */ new WeakMap();
Da = /* @__PURE__ */ new WeakMap();
Li = /* @__PURE__ */ new WeakMap();
Oa = /* @__PURE__ */ new WeakSet();
Tc = async function(e) {
  if (!jt(this, mi)) return;
  jt(this, Li) ?? no(this, Li, or(jt(this, mi).getToken).catch(() => []));
  const t = await jt(this, Li), i = new Set(e), a = t.filter((s) => i.has(s.alias)).map((s) => s.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
Sc = function(e) {
  var i;
  const t = e.target.selection;
  (i = jt(this, mi)) == null || i.setSampleContentKey(t[0]);
};
Hi.styles = A`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
Vo([
  f()
], Hi.prototype, "_selection", 2);
Vo([
  f()
], Hi.prototype, "_allowedContentTypeIds", 2);
Hi = Vo([
  M("di-preview-content-picker")
], Hi);
var im = Object.defineProperty, am = Object.getOwnPropertyDescriptor, Ec = (e) => {
  throw TypeError(e);
}, ca = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? am(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && im(t, i, s), s;
}, qo = (e, t, i) => t.has(e) || Ec("Cannot " + i), q = (e, t, i) => (qo(e, t, "read from private field"), t.get(e)), yt = (e, t, i) => t.has(e) ? Ec("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pt = (e, t, i, a) => (qo(e, t, "write to private field"), t.set(e, i), i), Be = (e, t, i) => (qo(e, t, "access private method"), i), at, Ht, Yt, At, Ya, Xa, ke, Ho, Ia, Yo, ro;
const sm = 400;
let Ft = class extends L {
  constructor() {
    super(), yt(this, ke), yt(this, at), yt(this, Ht), yt(this, Yt), yt(this, At), yt(this, Ya), yt(this, Xa, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(ft, (e) => {
      Pt(this, at, e), e && (this.observe(e.template, (t) => {
        t && Be(this, ke, Ia).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Pt(this, Ya, t);
        const i = (a = q(this, at)) == null ? void 0 : a.getData();
        i && Be(this, ke, Ia).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Pt(this, Xa, t ?? !0);
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
    const e = (t = q(this, at)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(q(this, Ht)), this._collapsed = !1, Be(this, ke, Yo).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(q(this, Ht)), (e = q(this, Yt)) == null || e.abort(), Be(this, ke, Ho).call(this);
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
        const t = (e = q(this, at)) == null ? void 0 : e.getData();
        t && Be(this, ke, Ia).call(this, t);
      }
    }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed ? p : r`
              <di-preview-content-picker></di-preview-content-picker>
              <div class="body">
                ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
                ${this._error ? r`<span class="error" role="status">${this._error}</span>` : this._url ? r`<img src=${this._url} alt="Server-rendered preview of this template" />` : r`<span class="pending">Rendering…</span>`}
              </div>
            `}
      </div>
    `;
  }
};
at = /* @__PURE__ */ new WeakMap();
Ht = /* @__PURE__ */ new WeakMap();
Yt = /* @__PURE__ */ new WeakMap();
At = /* @__PURE__ */ new WeakMap();
Ya = /* @__PURE__ */ new WeakMap();
Xa = /* @__PURE__ */ new WeakMap();
ke = /* @__PURE__ */ new WeakSet();
Ho = function() {
  q(this, At) && (URL.revokeObjectURL(q(this, At)), Pt(this, At, void 0));
};
Ia = function(e) {
  this._collapsed || (window.clearTimeout(q(this, Ht)), Pt(this, Ht, window.setTimeout(() => void Be(this, ke, Yo).call(this, e), sm)));
};
Yo = async function(e) {
  var t;
  if (q(this, at)) {
    (t = q(this, Yt)) == null || t.abort(), Pt(this, Yt, new AbortController()), Be(this, ke, ro).call(this, !0), this._error = void 0;
    try {
      const i = await nr(
        e,
        {
          signal: q(this, Yt).signal,
          contentKey: q(this, Ya),
          useSampleData: q(this, Xa)
        },
        q(this, at).getToken
      );
      Be(this, ke, Ho).call(this), Pt(this, At, URL.createObjectURL(i)), this._url = q(this, At);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Be(this, ke, ro).call(this, !1);
    }
  }
};
ro = function(e) {
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
      ${Co}
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
ca([
  f()
], Ft.prototype, "_url", 2);
ca([
  f()
], Ft.prototype, "_loading", 2);
ca([
  f()
], Ft.prototype, "_error", 2);
ca([
  f()
], Ft.prototype, "_collapsed", 2);
Ft = ca([
  M("di-preview-strip")
], Ft);
var om = Object.defineProperty, nm = Object.getOwnPropertyDescriptor, Cc = (e) => {
  throw TypeError(e);
}, B = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && om(t, i, s), s;
}, Xo = (e, t, i) => t.has(e) || Cc("Cannot " + i), b = (e, t, i) => (Xo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vt = (e, t, i) => t.has(e) ? Cc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Fi = (e, t, i, a) => (Xo(e, t, "write to private field"), t.set(e, i), i), Z = (e, t, i) => (Xo(e, t, "access private method"), i), T, Yi, Xi, Ji, Xt, F, lo, Jo, Dc, Oc, co, Ic, Pc, Ac, uo, Mc, Rc, zc, Lc, Zo, Fc, Pa;
const rm = 400;
let U = class extends L {
  constructor() {
    super(), vt(this, F), vt(this, T), vt(this, Yi), vt(this, Xi), vt(this, Ji), vt(this, Xt), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, vt(this, Pa, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = b(this, T);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = b(this, F, lo);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), Z(this, F, co).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, h = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, m = Re(s.position, "x") ? 0 : l, C = Re(s.position, "y") ? 0 : h;
            if (m === 0 && C === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + m, y: s.position.y + C }
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
    }), this.consumeContext(tr, (e) => {
      Fi(this, Yi, e);
    }), this.consumeContext(fe, (e) => {
      Fi(this, Xi, e);
    }), this.consumeContext(ft, (e) => {
      Fi(this, T, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (Z(this, F, Ic).call(this, t), Z(this, F, Pc).call(this, t), Z(this, F, Ac).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", b(this, Pa));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", b(this, Pa)), window.clearTimeout(b(this, Ji)), (e = b(this, Xt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = b(this, T)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = b(this, T)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = b(this, T)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => Z(this, F, co).call(this, e.detail.key)}
        @di-layer-detach=${(e) => Z(this, F, Oc).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = b(this, T)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = b(this, T)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = b(this, T)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = b(this, T)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = b(this, T)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = b(this, T)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => Z(this, F, uo).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => Z(this, F, uo).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-pick-base-image=${Z(this, F, zc)}
        @di-pick-layer-image=${(e) => Z(this, F, Lc).call(this, e.detail.key)}
        @di-use-image-size=${Z(this, F, Fc)}
        @di-request-preview=${() => {
      var e;
      return (e = b(this, F, Dc)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(Va.min, Math.min(Va.max, e.detail.zoom));
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
      return (e = b(this, T)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = b(this, T)) == null ? void 0 : e.redo();
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
            .layer=${b(this, F, lo)}
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
T = /* @__PURE__ */ new WeakMap();
Yi = /* @__PURE__ */ new WeakMap();
Xi = /* @__PURE__ */ new WeakMap();
Ji = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
F = /* @__PURE__ */ new WeakSet();
lo = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
Jo = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Dc = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
Oc = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = b(this, F, Jo)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = b(this, T)) == null || n.updateLayer(e, { position: Os(i.position, t, a) });
};
co = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = b(this, F, Jo)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = b(this, T)) == null || s.removeLayer(e, t);
};
Ic = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && b(this, T) && await Hr(t, b(this, T).getToken);
};
Pc = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !b(this, T)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await lr(t.mediaKey, b(this, T).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Ac = function() {
  window.clearTimeout(b(this, Ji)), Fi(this, Ji, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !b(this, T))) {
      (t = b(this, Xt)) == null || t.abort(), Fi(this, Xt, new AbortController());
      try {
        const i = await rr(
          e,
          { signal: b(this, Xt).signal, useSampleData: !0 },
          b(this, T).getToken
        );
        b(this, T).setServerBounds(i.layers), b(this, T).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, rm));
};
uo = function(e, t, i, a) {
  const s = this._template;
  if (!s || !b(this, T)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: Z(this, F, Rc).call(this) };
  if (e.kind === "property") {
    const l = bd(e.property, o);
    if (l.kind === "condition") {
      Z(this, F, Mc).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    b(this, T).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? pr(o, "Image") : e.layerType === "badges" ? mr(o, "Badges", "") : e.layerType === "rect" ? yd(o, "Shape", e.preset) : hr(o, "Text", { kind: "static", text: "Text" });
  b(this, T).addLayer(n);
};
Mc = function(e, t, i) {
  var o, n, l, h;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((m) => m.key === a);
  if (!s) {
    (n = b(this, Xi)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = b(this, T)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (h = b(this, Xi)) == null || h.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
Rc = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
zc = async function() {
  var t;
  const e = await Z(this, F, Zo).call(this);
  e && ((t = b(this, T)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
Lc = async function(e) {
  var i;
  const t = await Z(this, F, Zo).call(this);
  t && ((i = b(this, T)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
Zo = async function() {
  if (!b(this, Yi)) return;
  const e = b(this, Yi).open(this, Cu, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
Fc = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !b(this, T)) return;
  const t = await lr(e.mediaKey, b(this, T).getToken).catch(() => {
  });
  t && b(this, T).updateCanvas({ width: t.width, height: t.height });
};
Pa = /* @__PURE__ */ new WeakMap();
U.styles = A`
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
B([
  f()
], U.prototype, "_template", 2);
B([
  f()
], U.prototype, "_selectedKey", 2);
B([
  f()
], U.prototype, "_properties", 2);
B([
  f()
], U.prototype, "_linkedProperties", 2);
B([
  f()
], U.prototype, "_linkedCaptions", 2);
B([
  f()
], U.prototype, "_fonts", 2);
B([
  f()
], U.prototype, "_serverBounds", 2);
B([
  f()
], U.prototype, "_baseImageUrl", 2);
B([
  f()
], U.prototype, "_zoom", 2);
B([
  f()
], U.prototype, "_effectiveScale", 2);
B([
  f()
], U.prototype, "_previewing", 2);
B([
  f()
], U.prototype, "_snapEnabled", 2);
B([
  f()
], U.prototype, "_showRulers", 2);
B([
  f()
], U.prototype, "_showSafeArea", 2);
B([
  f()
], U.prototype, "_showMeasured", 2);
B([
  f()
], U.prototype, "_canUndo", 2);
B([
  f()
], U.prototype, "_canRedo", 2);
U = B([
  M("di-design-view")
], U);
const lm = U, cm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return U;
  },
  default: lm
}, Symbol.toStringTag, { value: "Module" }));
var um = Object.defineProperty, dm = Object.getOwnPropertyDescriptor, Uc = (e) => {
  throw TypeError(e);
}, Ze = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? dm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && um(t, i, s), s;
}, Qo = (e, t, i) => t.has(e) || Uc("Cannot " + i), ee = (e, t, i) => (Qo(e, t, "read from private field"), t.get(e)), xi = (e, t, i) => t.has(e) ? Uc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Zi = (e, t, i, a) => (Qo(e, t, "write to private field"), t.set(e, i), i), et = (e, t, i) => (Qo(e, t, "access private method"), i), Ae, Qi, Jt, Mt, De, en, Aa, Wc, Nc, Bc;
let pe = class extends L {
  constructor() {
    super(), xi(this, De), xi(this, Ae), xi(this, Qi), xi(this, Jt), xi(this, Mt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(fe, (e) => {
      Zi(this, Qi, e);
    }), this.consumeContext(ft, (e) => {
      Zi(this, Ae, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, et(this, De, Aa).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), et(this, De, Aa).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = ee(this, Jt)) == null || e.abort(), et(this, De, en).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => et(this, De, Aa).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${et(this, De, Nc)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
          ${this._error ? r`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? r`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : p}
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._template.layers.length === 0 ? r`<p class="empty">This template has no layers yet.</p>` : r`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${J(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => et(this, De, Bc).call(this, e)
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
                @click=${et(this, De, Wc)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
Ae = /* @__PURE__ */ new WeakMap();
Qi = /* @__PURE__ */ new WeakMap();
Jt = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakSet();
en = function() {
  ee(this, Mt) && (URL.revokeObjectURL(ee(this, Mt)), Zi(this, Mt, void 0));
};
Aa = async function() {
  var i;
  const e = this._template;
  if (!e || !ee(this, Ae)) return;
  (i = ee(this, Jt)) == null || i.abort(), Zi(this, Jt, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: ee(this, Jt).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, s] = await Promise.all([
      nr(e, t, ee(this, Ae).getToken),
      rr(e, t, ee(this, Ae).getToken)
    ]);
    et(this, De, en).call(this), Zi(this, Mt, URL.createObjectURL(a)), this._url = ee(this, Mt), this._bounds = s.layers, this._skipped = s.skipped ?? [], ee(this, Ae).setServerBounds(s.layers), ee(this, Ae).setIssues(s.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Wc = async function() {
  var e, t;
  if (!(!this._contentKey || !ee(this, Ae))) {
    this._regenerating = !0;
    try {
      const i = await go(this._contentKey, ee(this, Ae).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = ee(this, Qi)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = ee(this, Qi)) == null || t.peek("danger", {
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
Nc = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Bc = function(e) {
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
      ${Co}
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
Ze([
  f()
], pe.prototype, "_template", 2);
Ze([
  f()
], pe.prototype, "_contentKey", 2);
Ze([
  f()
], pe.prototype, "_bounds", 2);
Ze([
  f()
], pe.prototype, "_skipped", 2);
Ze([
  f()
], pe.prototype, "_url", 2);
Ze([
  f()
], pe.prototype, "_loading", 2);
Ze([
  f()
], pe.prototype, "_error", 2);
Ze([
  f()
], pe.prototype, "_regenerating", 2);
pe = Ze([
  M("di-preview-view")
], pe);
const hm = pe, pm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return pe;
  },
  default: hm
}, Symbol.toStringTag, { value: "Module" }));
var mm = Object.defineProperty, fm = Object.getOwnPropertyDescriptor, Kc = (e) => {
  throw TypeError(e);
}, ua = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? fm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && mm(t, i, s), s;
}, tn = (e, t, i) => t.has(e) || Kc("Cannot " + i), H = (e, t, i) => (tn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), jn = (e, t, i) => t.has(e) ? Kc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), gm = (e, t, i, a) => (tn(e, t, "write to private field"), t.set(e, i), i), Vt = (e, t, i) => (tn(e, t, "access private method"), i), ne, de, jc, Vc, Ja, Gc, qc, Hc, Yc, Xc, Jc;
let qe = class extends L {
  constructor() {
    super(), jn(this, de), jn(this, ne), this._properties = [], this._showAdvanced = !1, this.consumeContext(ft, (e) => {
      gm(this, ne, e), e && (or(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${Vt(this, de, Hc).call(this)} ${Vt(this, de, Yc).call(this)} ${Vt(this, de, Xc).call(this)} ${Vt(this, de, Jc).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
ne = /* @__PURE__ */ new WeakMap();
de = /* @__PURE__ */ new WeakSet();
jc = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Vc = function() {
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
Gc = async function(e) {
  var s, o;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((n) => [n.key, n.alias])), a = [
    ...t.map((n) => i.get(n)).filter((n) => !!n),
    ...H(this, de, Ja)
  ].filter((n, l, h) => h.indexOf(n) === l);
  (s = H(this, ne)) == null || s.updateTemplateFields({ docTypeAliases: a }), await ((o = H(this, ne)) == null ? void 0 : o.reloadProperties());
};
qc = function(e) {
  var i;
  const t = e.target.selection;
  (i = H(this, ne)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
Hc = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? r`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${H(this, de, Vc)}
                  @change=${Vt(this, de, Gc)}></umb-input-document-type>` : r`<uui-loader-bar></uui-loader-bar>`}
            ${H(this, de, Ja).length > 0 ? r`<p class="note">
                  Also targets ${H(this, de, Ja).join(", ")}, which no document type has any more.
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
    ...H(this, de, jc).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = H(this, ne)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = H(this, ne)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Yc = function() {
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
            @change=${Vt(this, de, qc)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = H(this, ne)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = H(this, ne)) == null ? void 0 : i.updateOutput({
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
    return (i = H(this, ne)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
Xc = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = H(this, ne)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = H(this, ne)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Jc = function() {
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
    return (i = H(this, ne)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
qe.styles = A`
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
ua([
  f()
], qe.prototype, "_template", 2);
ua([
  f()
], qe.prototype, "_properties", 2);
ua([
  f()
], qe.prototype, "_showAdvanced", 2);
ua([
  f()
], qe.prototype, "_documentTypes", 2);
qe = ua([
  M("di-settings-view")
], qe);
const ym = qe, vm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return qe;
  },
  default: ym
}, Symbol.toStringTag, { value: "Module" }));
var bm = Object.defineProperty, _m = Object.getOwnPropertyDescriptor, Zc = (e) => {
  throw TypeError(e);
}, da = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? _m(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && bm(t, i, s), s;
}, an = (e, t, i) => t.has(e) || Zc("Cannot " + i), Vn = (e, t, i) => (an(e, t, "read from private field"), t.get(e)), Gn = (e, t, i) => t.has(e) ? Zc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), wm = (e, t, i, a) => (an(e, t, "write to private field"), t.set(e, i), i), qn = (e, t, i) => (an(e, t, "access private method"), i), ea, Ma, ho;
let He = class extends L {
  constructor() {
    super(), Gn(this, Ma), Gn(this, ea), this._loading = !0, this._onlyMissing = !1, this.consumeContext(ft, (e) => {
      wm(this, ea, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && qn(this, Ma, ho).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => qn(this, Ma, ho).call(this)}>Reload</uui-button>
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
              ${J(
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
ea = /* @__PURE__ */ new WeakMap();
Ma = /* @__PURE__ */ new WeakSet();
ho = async function() {
  const e = this._template;
  if (!(!e || !Vn(this, ea))) {
    this._loading = !0;
    try {
      this._usage = await cd(e.key, Vn(this, ea).getToken);
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
da([
  f()
], He.prototype, "_template", 2);
da([
  f()
], He.prototype, "_usage", 2);
da([
  f()
], He.prototype, "_loading", 2);
da([
  f()
], He.prototype, "_onlyMissing", 2);
He = da([
  M("di-usage-view")
], He);
const $m = He, xm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return He;
  },
  default: $m
}, Symbol.toStringTag, { value: "Module" })), km = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ss,
  default: Ss
}, Symbol.toStringTag, { value: "Module" }));
var lt, Ot;
class $s extends uu {
  constructor(i, a) {
    super(i, a);
    x(this, lt);
    x(this, Ot);
    this.consumeContext(fe, (s) => {
      _(this, lt, s);
    }), this.consumeContext(ft, (s) => {
      _(this, Ot, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, Ot), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, lt)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await mo(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await cr(a.key, !1, i.getToken);
        (o = c(this, lt)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await Mr(l, i.getToken, c(this, lt));
      } catch (l) {
        (n = c(this, lt)) == null || n.peek("danger", {
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
    c(this, Ot) && await ld(i, c(this, Ot).getToken);
  }
}
lt = new WeakMap(), Ot = new WeakMap();
const Tm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: $s,
  api: $s,
  default: $s
}, Symbol.toStringTag, { value: "Module" }));
var ia, li;
class xs extends es {
  constructor(i, a) {
    super(i, a);
    x(this, ia);
    x(this, li);
    this.consumeContext(Le, (s) => {
      _(this, ia, s);
    }), this.consumeContext(fe, (s) => {
      _(this, li, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await go(i, () => {
          var l;
          return (l = c(this, ia)) == null ? void 0 : l.getLatestToken();
        }), n = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = c(this, li)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof ht && o.status === 404;
        (s = c(this, li)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof ht ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
ia = new WeakMap(), li = new WeakMap();
const Sm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: xs,
  api: xs,
  default: xs
}, Symbol.toStringTag, { value: "Module" }));
var aa, It, sa, ci;
class ks extends Ou {
  constructor(i, a) {
    super(i, a);
    x(this, aa);
    x(this, It);
    x(this, sa);
    x(this, ci);
    this.consumeContext(Le, (s) => {
      _(this, aa, s);
    }), this.consumeContext(fe, (s) => {
      _(this, It, s);
    }), this.consumeContext(Iu, (s) => {
      _(this, sa, s);
    }), this.consumeContext(Pu, (s) => {
      _(this, ci, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, ci)) {
      (i = c(this, It)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await go(c(this, ci), () => {
        var l;
        return (l = c(this, aa)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, sa)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, It)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof ht && n.status === 404;
      (o = c(this, It)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof ht ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
aa = new WeakMap(), It = new WeakMap(), sa = new WeakMap(), ci = new WeakMap();
const Em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: ks,
  api: ks,
  default: ks
}, Symbol.toStringTag, { value: "Module" }));
var Cm = Object.defineProperty, Dm = Object.getOwnPropertyDescriptor, Qc = (e) => {
  throw TypeError(e);
}, Qe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Cm(t, i, s), s;
}, sn = (e, t, i) => t.has(e) || Qc("Cannot " + i), fi = (e, t, i) => (sn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ts = (e, t, i) => t.has(e) ? Qc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Om = (e, t, i, a) => (sn(e, t, "write to private field"), t.set(e, i), i), xt = (e, t, i) => (sn(e, t, "access private method"), i), Ra, ha, we, eu, tu, iu, on, au, su, ou, nu;
const Im = [100, 200, 300, 400, 500, 600, 700, 800, 900], Pm = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let me = class extends er {
  constructor() {
    super(), Ts(this, we), Ts(this, Ra), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", Ts(this, ha, () => {
      var e;
      return (e = fi(this, Ra)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Le, (e) => {
      Om(this, Ra, e);
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
            @change=${xt(this, we, eu)}>
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
            @click=${xt(this, we, iu)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Pm.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? xt(this, we, nu).call(this) : xt(this, we, ou).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !fi(this, we, on)}
            @click=${xt(this, we, au)}>
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
Ra = /* @__PURE__ */ new WeakMap();
ha = /* @__PURE__ */ new WeakMap();
we = /* @__PURE__ */ new WeakSet();
eu = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  xt(this, we, tu).call(this, t);
};
tu = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await Zu(t, fi(this, ha));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
iu = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await Qu(this._path.trim(), fi(this, ha)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
on = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
au = async function() {
  if (fi(this, we, on)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await ed(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        fi(this, ha)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
su = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
ou = function() {
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
        ${J(
    Im,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => xt(this, we, su).call(this, e, t.target.checked)}>
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
nu = function() {
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
Qe([
  f()
], me.prototype, "_busy", 2);
Qe([
  f()
], me.prototype, "_error", 2);
Qe([
  f()
], me.prototype, "_path", 2);
Qe([
  f()
], me.prototype, "_provider", 2);
Qe([
  f()
], me.prototype, "_family", 2);
Qe([
  f()
], me.prototype, "_weights", 2);
Qe([
  f()
], me.prototype, "_italic", 2);
Qe([
  f()
], me.prototype, "_url", 2);
me = Qe([
  M("di-font-upload-modal")
], me);
const Am = me, Mm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return me;
  },
  default: Am
}, Symbol.toStringTag, { value: "Module" }));
var Rm = Object.getOwnPropertyDescriptor, zm = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = n(s) || s);
  return s;
};
let Za = class extends L {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Za = zm([
  M("di-template-folder-editor")
], Za);
const Lm = Za, Fm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Za;
  },
  default: Lm
}, Symbol.toStringTag, { value: "Module" }));
export {
  eh as manifests,
  pf as onInit
};
//# sourceMappingURL=dynamic-images.js.map
