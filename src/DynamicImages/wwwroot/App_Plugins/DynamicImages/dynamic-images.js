var Yn = (e) => {
  throw TypeError(e);
};
var rs = (e, t, i) => t.has(e) || Yn("Cannot " + i);
var c = (e, t, i) => (rs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), x = (e, t, i) => t.has(e) ? Yn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (rs(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), E = (e, t, i) => (rs(e, t, "access private method"), i);
var ls = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as Hc, UmbEntityWorkspaceDataManager as Yc, UmbSubmitWorkspaceAction as ws, UmbEntityNamedDetailWorkspaceContextBase as Xc, UmbWorkspaceActionBase as Jc } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Ha, UmbContextConsumerController as Zc } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as zo, UmbItemRepositoryBase as Qc, UmbItemServerDataSourceBase as eu, UmbRepositoryBase as nn } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as Fo, UmbItemStoreBase as tu } from "@umbraco-cms/backoffice/store";
import { UmbId as iu } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as au, UMB_DATE_TIME_VALUE_TYPE as su } from "@umbraco-cms/backoffice/value-type";
import { nothing as p, html as r, css as P, state as f, customElement as A, ifDefined as Xn, property as g, repeat as X, classMap as Uo, styleMap as U } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as L } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as nu, UmbTreeRepositoryBase as ou } from "@umbraco-cms/backoffice/tree";
import { UMB_NOTIFICATION_CONTEXT as he } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as ru } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UmbRequestReloadChildrenOfEntityEvent as Wo, UmbRequestReloadStructureForEntityEvent as lu, UmbEntityActionBase as Ya } from "@umbraco-cms/backoffice/entity-action";
import { UMB_AUTH_CONTEXT as Pe } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as No, UMB_DISCARD_CHANGES_MODAL as cu, umbConfirmModal as on, UmbModalToken as Bo, UmbModalBaseElement as Ko, UMB_MODAL_MANAGER_CONTEXT as jo } from "@umbraco-cms/backoffice/modal";
import { UMB_ACTION_EVENT_CONTEXT as Vo } from "@umbraco-cms/backoffice/action";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as uu } from "@umbraco-cms/backoffice/entity";
import { tryExecute as du } from "@umbraco-cms/backoffice/resources";
import { UmbDefaultCollectionContext as hu } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as pu, UmbDeselectedEvent as mu } from "@umbraco-cms/backoffice/event";
import { UMB_MEDIA_PICKER_MODAL as fu } from "@umbraco-cms/backoffice/media";
import "@umbraco-cms/backoffice/document-type";
import { UmbArrayState as fi, UmbStringState as Jn, UmbObjectState as yu, UmbBooleanState as la, UmbNumberState as gu } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as vu } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as bu } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as _u } from "@umbraco-cms/backoffice/document";
const Xa = "dynamic-images", Ja = "di-template", $s = "di:templates-changed", wu = "/umbraco/management/api/v1/dynamic-images";
class ct extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function $(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let n = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), n = JSON.stringify(i.json));
  const o = await fetch(`${wu}${e}`, { ...i, headers: s, body: n });
  if (!o.ok) throw await $u(o);
  return o;
}
async function $u(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new ct(t, e.status, i);
}
const T = async (e) => e.json();
async function xu(e) {
  const t = await $("/templates?take=500", e);
  return (await T(t)).items;
}
const rn = async (e, t) => T(await $(`/templates/${e}`, t)), ku = async (e, t) => T(await $("/templates", t, { method: "POST", json: e })), Tu = async (e, t) => T(await $(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Eu(e, t) {
  await $(`/templates/${e}`, t, { method: "DELETE" });
}
const Su = async (e, t) => T(await $(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function Du(e, t) {
  return (await $(`/templates/${e}/export`, t)).blob();
}
const Cu = async (e, t, i, a = null) => T(await $("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function qo(e, t, i, a) {
  const s = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && s.set("foldersOnly", "true"), a && s.set("parentKey", a), s.toString();
}
const Zn = async (e, t, i, a) => T(await $(`/tree/root?${qo(e, t, i)}`, a)), Iu = async (e, t, i, a, s) => T(await $(`/tree/children?${qo(t, i, a, e)}`, s)), Ou = async (e, t) => T(await $(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function Go(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return T(await $(`/item?${i}`, t));
}
async function Pu(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), T(await $(`/collection/templates?${i}`, t));
}
async function Au(e, t, i) {
  return (await $(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const Mu = async (e, t) => T(await $("/folders", t, { method: "POST", json: e })), Ru = async (e, t) => T(await $(`/folders/${e}`, t)), Lu = async (e, t, i) => T(await $(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function zu(e, t) {
  await $(`/folders/${e}`, t, { method: "DELETE" });
}
async function Fu(e, t, i) {
  await $(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Uu(e, t, i) {
  await $(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
const Oa = async (e) => T(await $("/fonts", e));
async function Wu(e, t) {
  const i = new FormData();
  return i.append("file", e), T(await $("/fonts", t, { method: "POST", body: i }));
}
const Nu = async (e, t) => T(await $("/fonts/register-path", t, { method: "POST", json: { path: e } })), Bu = async (e, t) => T(await $("/fonts/register-web", t, { method: "POST", json: e })), Ku = async (e, t) => T(await $(`/fonts/${e}/refresh`, t, { method: "POST" })), ju = async (e, t, i, a, s) => T(await $(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function Vu(e, t) {
  await $(`/fonts/${e}`, t, { method: "DELETE" });
}
async function qu(e, t) {
  return (await $(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Ho = async (e) => T(await $("/document-types", e)), Gu = async (e, t) => T(await $(`/document-types/${encodeURIComponent(e)}/properties`, t)), Hu = async (e, t, i) => T(await $(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function Yo(e, t, i) {
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
const Xo = async (e, t, i) => T(await $("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Jo = async (e, t) => T(await $(`/media/${e}/image-info`, t)), ln = async (e, t) => T(await $(`/documents/${e}/regenerate`, t, { method: "POST" })), Zo = async (e, t, i) => T(await $(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), Yu = async (e, t) => T(await $(`/jobs/${e}`, t));
async function Xu(e, t) {
  await $(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const Ju = async (e, t) => T(await $(`/templates/${e}/usage`, t)), Qo = async (e) => T(await $("/health", e)), Zu = async (e) => T(await $("/sync/status", e)), Qu = async (e) => T(await $("/sync/export", e, { method: "POST" })), ed = async (e) => T(await $("/sync/import", e, { method: "POST" }));
function cn(e) {
  const t = `section/${Xa}/workspace/${Ja}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function td(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${Xa}/workspace/${Ja}/create${t}`, document.baseURI).pathname;
}
function er(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${Xa}/workspace/${e}${i}`, document.baseURI).pathname;
}
function id(e) {
  return new URL(`section/${Xa}/dashboard/${e}`, document.baseURI).pathname;
}
function ad() {
  window.dispatchEvent(new CustomEvent($s));
}
const Za = () => crypto.randomUUID();
function Qa(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function tr(e, t, i) {
  const { x: a, y: s } = Qa(e);
  return {
    type: "text",
    key: Za(),
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
function ir(e, t, i) {
  const { x: a, y: s } = Qa(e);
  return {
    type: "image",
    key: Za(),
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
function ar(e, t, i) {
  const { x: a, y: s } = Qa(e);
  return {
    type: "badges",
    key: Za(),
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
function sd(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = Qa(e);
  return {
    type: "rect",
    key: Za(),
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
function nd(e) {
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
function od(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (nd(e.classification)) {
    case "image":
      return { kind: "layer", layer: ir(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: ar(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: tr(t, e.name, rd(e)) };
  }
}
function rd(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function sr() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function ld(e) {
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
const nr = [
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
function Mi(e) {
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
function Ri(e) {
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
function xs(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return nr[a * 3 + i];
}
function es(e, t, i) {
  return {
    x: e.x - t * Mi(e.anchor),
    y: e.y - i * Ri(e.anchor)
  };
}
function un(e, t, i, a, s) {
  return {
    x: e + i * Mi(s),
    y: t + a * Ri(s)
  };
}
function cd(e, t, i, a) {
  const s = es(e, t, i), n = un(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(n.x), y: Math.round(n.y), anchor: a };
}
function ud(e, t) {
  const i = un(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function or(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Ut(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const n = s * Math.PI / 180, o = Math.cos(n), l = Math.sin(n), u = e - i, m = t - a;
  return { x: i + u * o - m * l, y: a + u * l + m * o };
}
function dd(e, t, i, a, s) {
  return Ut(e, t, i, a, -s);
}
function rr(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Ut(e.x, e.y, t, i, a),
    Ut(e.x + e.width, e.y, t, i, a),
    Ut(e.x + e.width, e.y + e.height, t, i, a),
    Ut(e.x, e.y + e.height, t, i, a)
  ], n = Math.min(...s.map((m) => m.x)), o = Math.max(...s.map((m) => m.x)), l = Math.min(...s.map((m) => m.y)), u = Math.max(...s.map((m) => m.y));
  return { x: n, y: l, width: o - n, height: u - l };
}
const hd = 10;
function Ie(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function lr(e) {
  return !!e.relativeX || !!e.relativeY;
}
function Pa(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function Qn(e) {
  return e === "below" || e === "above";
}
function eo(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function pd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function md(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = eo(i.position).map((n) => n.layerKey);
  for (; s.length > 0; ) {
    const n = s.pop();
    if (n === e) return !0;
    if (a.has(n)) continue;
    a.add(n);
    const o = t.get(n);
    o && s.push(...eo(o.position).map((l) => l.layerKey));
  }
  return !1;
}
function fd(e, t, i) {
  const a = e.position;
  if (!lr(a)) return a;
  if (md(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, n = a.y, o = Mi(a.anchor), l = Ri(a.anchor);
  const u = to(e, a.relativeX, !1, t, i);
  u && (s = u.coordinate, o = u.factor);
  const m = to(e, a.relativeY, !0, t, i);
  return m && (n = m.coordinate, l = m.factor), { x: s, y: n, anchor: xs(o, l) };
}
function to(e, t, i, a, s) {
  if (!t || Qn(t.edge) !== i) return;
  const n = /* @__PURE__ */ new Set([e.key]);
  let o = t.layerKey;
  for (; !n.has(o); ) {
    n.add(o);
    const l = a.get(o);
    if (!l) return;
    const u = s(o);
    if (u)
      switch (t.edge) {
        case "below":
          return { coordinate: u.y + u.height + t.gap, factor: 0 };
        case "above":
          return { coordinate: u.y - t.gap, factor: 1 };
        case "rightOf":
          return { coordinate: u.x + u.width + t.gap, factor: 0 };
        default:
          return { coordinate: u.x - t.gap, factor: 1 };
      }
    const m = i ? l.position.relativeY : l.position.relativeX;
    if (!m || Qn(m.edge) !== i) return;
    o = m.layerKey;
  }
}
function yd(e, t, i) {
  const a = pd(e), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), o = (l) => {
    const u = s.get(l.key);
    if (u) return u;
    let m;
    n.has(l.key) ? m = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (n.add(l.key), m = fd(l, a, (Xe) => {
      const Me = a.get(Xe);
      return Me && !i(Me) ? o(Me).extent : void 0;
    }), n.delete(l.key));
    const S = t(l), K = es(m, S.width, S.height), $e = { x: K.x, y: K.y, width: S.width, height: S.height }, Ae = { position: m, box: $e, extent: rr($e, m.x, m.y, l.rotation ?? 0) };
    return s.set(l.key, Ae), Ae;
  };
  for (const l of e) o(l);
  return s;
}
function ks(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? xs(Mi(i.anchor), Ri(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? xs(Mi(e.anchor), Ri(i.anchor)) : e.anchor
  };
}
var ne, ze, Te, tt;
class gd {
  constructor(t = 100) {
    x(this, ne, []);
    x(this, ze, []);
    x(this, Te, 0);
    x(this, tt);
    this.limit = t;
  }
  get canUndo() {
    return c(this, ne).length > 0;
  }
  get canRedo() {
    return c(this, ze).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, Te) > 0 || (c(this, ne).push(structuredClone(t)), c(this, ne).length > this.limit && c(this, ne).shift(), _(this, ze, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, Te) === 0 && _(this, tt, structuredClone(t)), ls(this, Te)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, Te) !== 0 && (ls(this, Te)._--, !(c(this, Te) > 0) && (t && c(this, tt) !== void 0 && (c(this, ne).push(c(this, tt)), c(this, ne).length > this.limit && c(this, ne).shift(), _(this, ze, [])), _(this, tt, void 0)));
  }
  undo(t) {
    const i = c(this, ne).pop();
    if (i !== void 0)
      return c(this, ze).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, ze).pop();
    if (i !== void 0)
      return c(this, ne).push(structuredClone(t)), i;
  }
  clear() {
    _(this, ne, []), _(this, ze, []), _(this, Te, 0), _(this, tt, void 0);
  }
}
ne = new WeakMap(), ze = new WeakMap(), Te = new WeakMap(), tt = new WeakMap();
const vd = "DynamicImages.Workspace.Template", bd = 12;
var Ht, it, xt, kt, Tt, Yt, Xt, Et, at, Jt, Fe, Zt, Qt, oe, Yi, St, Ee, Dt, w, cr, ei, ti, Ts, Es, Ss, Re, gt, Ds, pa, ur, dr, hr, Cs;
class _d extends Hc {
  constructor(i) {
    super(i, vd);
    x(this, w);
    x(this, Ht);
    x(this, it);
    x(this, xt);
    x(this, kt);
    x(this, Tt);
    x(this, Yt);
    x(this, Xt);
    x(this, Et);
    x(this, at);
    x(this, Jt);
    x(this, Fe);
    x(this, Zt);
    x(this, Qt);
    x(this, oe);
    x(this, Yi);
    x(this, St);
    x(this, Ee);
    x(this, Dt);
    x(this, ei);
    x(this, ti);
    this._data = new Yc(this), this.template = this._data.current, _(this, Ht, new fi([], (a) => a.key)), this.layers = c(this, Ht).asObservable(), _(this, it, new Jn(void 0)), this.selectedLayerKey = c(this, it).asObservable(), _(this, xt, new fi([], (a) => a.alias)), this.properties = c(this, xt).asObservable(), _(this, kt, new yu({})), this.linkedProperties = c(this, kt).asObservable(), _(this, Tt, new fi([], (a) => a.key)), this.fonts = c(this, Tt).asObservable(), _(this, Yt, new fi([], (a) => a.key)), this.serverBounds = c(this, Yt).asObservable(), _(this, Xt, new fi([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, Xt).asObservable(), _(this, Et, new Jn(void 0)), this.sampleContentKey = c(this, Et).asObservable(), _(this, at, new la(!0)), this.useSampleData = c(this, at).asObservable(), _(this, Jt, new gu(1)), this.zoom = c(this, Jt).asObservable(), _(this, Fe, new la(!0)), this.loading = c(this, Fe).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, Zt, new la(!1)), this.canUndo = c(this, Zt).asObservable(), _(this, Qt, new la(!1)), this.canRedo = c(this, Qt).asObservable(), _(this, oe, new gd()), _(this, Ee, !1), _(this, Dt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, ei, async (a) => {
      const s = a.detail;
      if (c(this, Dt) || !(s != null && s.url) || !E(this, w, cr).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await No(this, cu), _(this, Dt, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, ti, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, Yi)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => us),
        setup: (a, s) => {
          const n = s.match.params.parentUnique;
          return this.createScaffold(void 0, n && n !== "null" ? n : null);
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
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Pe, (a) => {
      _(this, Yi, a);
    }), this.consumeContext(he, (a) => {
      _(this, St, a);
    }), window.addEventListener("willchangestate", c(this, ei)), window.addEventListener("beforeunload", c(this, ti)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Ee);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, Fe).setValue(!0), _(this, Ee, !1);
    try {
      const a = await rn(i, this.getToken);
      E(this, w, gt).call(this, a, { resetHistory: !0, persist: !0 }), E(this, w, dr).call(this), this.setIsNew(!1), await E(this, w, Ts).call(this, a);
    } catch (a) {
      E(this, w, Cs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, Fe).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, Fe).setValue(!0), _(this, Ee, !0), E(this, w, gt).call(this, { ...ld(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await E(this, w, Ts).call(this, this._data.getCurrent()), c(this, Fe).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await E(this, w, Ss).call(this, i.docTypeAliases);
    c(this, xt).setValue(a), c(this, kt).setValue(await E(this, w, Es).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, Tt).setValue(await Oa(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    E(this, w, Re).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    E(this, w, Re).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    E(this, w, Re).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    E(this, w, Re).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    E(this, w, Re).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    E(this, w, Re).call(this, (s) => ({
      ...s,
      layers: s.layers.map((n) => n.key === i ? { ...n, ...a } : n)
    }));
  }
  /**
   * Removes a layer, and detaches anything positioned against it in the same update - so one undo
   * restores both the layer and the links to it. `resolvedPositions` is where those layers were
   * actually drawn, which is what lets them stay put; without it they fall back to their own
   * stored coordinates.
   */
  removeLayer(i, a) {
    E(this, w, Re).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((n) => n.key !== i).map((n) => {
        var l, u;
        let o = n.position;
        return ((l = Pa(o, "x")) == null ? void 0 : l.layerKey) === i && (o = ks(o, "x", a == null ? void 0 : a.get(n.key))), ((u = Pa(o, "y")) == null ? void 0 : u.layerKey) === i && (o = ks(o, "y", a == null ? void 0 : a.get(n.key))), o === n.position ? n : { ...n, position: o };
      })
    })), c(this, it).getValue() === i && this.selectLayer(void 0);
  }
  duplicateLayer(i) {
    var n;
    const a = (n = this._data.getCurrent()) == null ? void 0 : n.layers.find((o) => o.key === i);
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
    E(this, w, Re).call(this, (s) => {
      const n = [...s.layers], o = n.findIndex((u) => u.key === i);
      if (o < 0) return s;
      const [l] = n.splice(o, 1);
      return n.splice(Math.max(0, Math.min(n.length, a)), 0, l), { ...s, layers: n };
    });
  }
  setLayerVisible(i, a) {
    this.updateLayer(i, { isVisible: a });
  }
  setLayerLocked(i, a) {
    this.updateLayer(i, { isLocked: a });
  }
  selectLayer(i) {
    c(this, it).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, it).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, oe).begin(i);
  }
  endTransaction(i = !0) {
    c(this, oe).end(i), E(this, w, Ds).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, oe).undo(i);
    a && E(this, w, gt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, oe).redo(i);
    a && E(this, w, gt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    c(this, Yt).setValue(i);
  }
  setIssues(i) {
    c(this, Xt).setValue(i);
  }
  /**
   * The page previews render against, or undefined for sample data. One value for the whole
   * workspace, so the Preview & test picker and the designer strip's picker always agree - and
   * remembered per template, so coming back to it does not mean choosing again.
   */
  setSampleContentKey(i) {
    c(this, Et).setValue(i), c(this, at).setValue(!i), E(this, w, ur).call(this, i);
  }
  setUseSampleData(i) {
    c(this, at).setValue(i);
  }
  setZoom(i) {
    c(this, Jt).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = this._data.getCurrent();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const n = c(this, Ee) ? await ku(i, this.getToken) : await Tu(i, this.getToken);
      E(this, w, gt).call(this, n.template, { resetHistory: !0, persist: !0 });
      const o = c(this, Ee);
      _(this, Ee, !1), this.setIsNew(!1), ad(), await E(this, w, hr).call(this, n.template, o), (a = c(this, St)) == null || a.peek("positive", {
        data: { message: `'${n.template.name}' saved.` }
      });
      for (const l of n.warnings)
        (s = c(this, St)) == null || s.peek("warning", { data: { message: l.message } });
      o && window.history.replaceState({}, "", cn(n.template.key));
    } catch (n) {
      throw E(this, w, Cs).call(this, "The template could not be saved", n), n;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Dt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, ei)), window.removeEventListener("beforeunload", c(this, ti)), c(this, oe).clear(), super.destroy();
  }
}
Ht = new WeakMap(), it = new WeakMap(), xt = new WeakMap(), kt = new WeakMap(), Tt = new WeakMap(), Yt = new WeakMap(), Xt = new WeakMap(), Et = new WeakMap(), at = new WeakMap(), Jt = new WeakMap(), Fe = new WeakMap(), Zt = new WeakMap(), Qt = new WeakMap(), oe = new WeakMap(), Yi = new WeakMap(), St = new WeakMap(), Ee = new WeakMap(), Dt = new WeakMap(), w = new WeakSet(), /**
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
cr = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, ei = new WeakMap(), ti = new WeakMap(), Ts = async function(i) {
  const [a, s] = await Promise.all([
    Oa(this.getToken).catch(() => []),
    E(this, w, Ss).call(this, i.docTypeAliases)
  ]);
  c(this, Tt).setValue(a), c(this, xt).setValue(s), c(this, kt).setValue(await E(this, w, Es).call(this, i.docTypeAliases, s));
}, Es = async function(i, a) {
  const s = a.filter((o) => o.classification === "content").slice(0, bd);
  if (s.length === 0 || i.length === 0) return {};
  const n = await Promise.all(
    s.map(async (o) => {
      const l = await Promise.all(
        i.map((m) => Hu(m, o.alias, this.getToken).catch(() => null))
      ), u = /* @__PURE__ */ new Map();
      for (const m of l.flatMap((S) => (S == null ? void 0 : S.properties) ?? []))
        u.has(m.alias) || u.set(m.alias, m);
      return [o.alias, [...u.values()]];
    })
  );
  return Object.fromEntries(n.filter(([, o]) => o.length > 0));
}, Ss = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((n) => Gu(n, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const n of a.flat())
    s.has(n.alias) || s.set(n.alias, n);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Re = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && c(this, oe).push(s);
  const n = i(structuredClone(s));
  E(this, w, gt).call(this, n);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
gt = function(i, a) {
  a != null && a.resetHistory && c(this, oe).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Ht).setValue(i.layers), E(this, w, Ds).call(this);
}, Ds = function() {
  c(this, Zt).setValue(c(this, oe).canUndo), c(this, Qt).setValue(c(this, oe).canRedo);
}, pa = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, ur = function(i) {
  try {
    i ? localStorage.setItem(E(this, w, pa).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(E(this, w, pa).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
dr = function() {
  let i;
  try {
    const a = localStorage.getItem(E(this, w, pa).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  c(this, Et).setValue(i), c(this, at).setValue(!i);
}, hr = async function(i, a) {
  const s = await this.getContext(Vo).catch(() => {
  });
  s && (a ? s.dispatchEvent(new Wo({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : s.dispatchEvent(new lu({ entityType: "di-template", unique: i.key })));
}, Cs = function(i, a) {
  var n;
  const s = a instanceof ct ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (n = c(this, St)) == null || n.peek("danger", { data: { headline: i, message: s } });
};
const pt = new Ha(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), ni = "di-template-root", ee = "di-template-folder", ve = Ja, Aa = "DynamicImages.Tree.Templates", Si = "DynamicImages.Repository.TemplateTree", Di = "DynamicImages.Repository.TemplateFolder", wd = "DynamicImages.Store.TemplateFolder", Ma = "DynamicImages.Workspace.TemplateFolder", pr = "DynamicImages.Workspace.TemplateRoot", io = "DynamicImages.Repository.TemplateItem", $d = "DynamicImages.Store.TemplateItem", ao = "DynamicImages.Repository.TemplateDetail", xd = "DynamicImages.Store.TemplateDetail", so = "DynamicImages.Repository.MoveTemplate", no = "DynamicImages.Repository.MoveTemplateFolder", oo = "DynamicImages.Repository.DuplicateTemplate", mr = "icon-picture", fr = "icon-picture color-grey", yr = "icon-folder", Is = "DynamicImages.Collection.Templates", ro = "DynamicImages.Repository.TemplateCollection";
async function W(e, t) {
  const i = (async () => {
    const a = await new Zc(e, Pe).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (s) {
      throw s instanceof ct ? { type: "error", title: s.message, status: s.status, detail: s.detail } : s;
    }
  })();
  return await du(e, i);
}
var st;
class kd {
  constructor(t) {
    x(this, st);
    _(this, st, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: ee,
      unique: iu.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await W(c(this, st), (s) => Ru(t, s));
    return i ? { data: { entityType: ee, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await W(c(this, st), (n) => Mu({ key: a, name: t.name, parentKey: i }, n));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await W(c(this, st), (s) => Lu(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return W(c(this, st), (i) => zu(t, i));
  }
}
st = new WeakMap();
const dn = new Ha("DiTemplateFolderStore");
class gr extends Fo {
  constructor(t) {
    super(t, dn);
  }
}
class lo extends zo {
  constructor(t) {
    super(t, kd, dn);
  }
}
const Td = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: dn,
  DiTemplateFolderRepository: lo,
  DiTemplateFolderStore: gr,
  api: lo
}, Symbol.toStringTag, { value: "Module" })), Ed = [
  {
    type: "repository",
    alias: Di,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => Td)
  },
  {
    type: "store",
    alias: wd,
    name: "Dynamic Images Template Folder Store",
    api: gr
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [ee],
    meta: { folderRepositoryAlias: Di }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [ee],
    meta: { folderRepositoryAlias: Di }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Ma,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => Nd),
    meta: { entityType: ee }
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.TemplateFolder.Submit",
    name: "Save Dynamic Images Template Folder",
    api: ws,
    meta: { label: "#buttons_save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: Ma }]
  }
], Sd = [
  {
    type: "repository",
    alias: Si,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => jd)
  },
  {
    type: "tree",
    kind: "default",
    alias: Aa,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: Si }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [ni, ee, ve]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: Aa, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: pr,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: ni, headline: "Templates" }
  },
  ...Ed
], hn = new Ha("DiTemplateItemStore");
class vr extends tu {
  constructor(t) {
    super(t, hn);
  }
}
class Dd extends eu {
  constructor(t) {
    super(t, {
      getItems: (i) => W(t, (a) => Go(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? ee : ve,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class co extends Qc {
  constructor(t) {
    super(t, Dd, hn);
  }
}
const Cd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: hn,
  DiTemplateItemRepository: co,
  DiTemplateItemStore: vr,
  api: co
}, Symbol.toStringTag, { value: "Module" })), pn = new Ha("DiTemplateDetailStore");
class br extends Fo {
  constructor(t) {
    super(t, pn);
  }
}
const cs = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var ii;
class Id {
  constructor(t) {
    x(this, ii);
    this.createScaffold = cs, this.create = cs, this.update = cs, _(this, ii, t);
  }
  async read(t) {
    const { data: i, error: a } = await W(c(this, ii), (s) => rn(t, s));
    return i ? { data: { entityType: ve, unique: i.key, name: i.name } } : { error: a };
  }
  delete(t) {
    return W(c(this, ii), (i) => Eu(t, i));
  }
}
ii = new WeakMap();
class uo extends zo {
  constructor(t) {
    super(t, Id, pn);
  }
}
const Od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: pn,
  DiTemplateDetailRepository: uo,
  DiTemplateDetailStore: br,
  api: uo
}, Symbol.toStringTag, { value: "Module" })), yi = [ni, ee], Pd = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: io,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => Cd)
  },
  {
    type: "itemStore",
    alias: $d,
    name: "Dynamic Images Template Item Store",
    api: vr
  },
  {
    type: "repository",
    alias: ao,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => Od)
  },
  {
    type: "store",
    alias: xd,
    name: "Dynamic Images Template Detail Store",
    api: br
  },
  {
    type: "repository",
    alias: so,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => Gd)
  },
  {
    type: "repository",
    alias: no,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => Hd)
  },
  {
    type: "repository",
    alias: oo,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => Yd)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: yi,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => Xd),
    forEntityTypes: yi,
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
    forEntityTypes: yi,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Di
    }
  },
  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [ve],
    meta: {
      treeRepositoryAlias: Si,
      moveRepositoryAlias: so,
      treeAlias: Aa,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicate",
    alias: "DynamicImages.EntityAction.Template.Duplicate",
    name: "Duplicate Dynamic Images Template",
    forEntityTypes: [ve],
    meta: {
      icon: "icon-documents",
      label: "Duplicate",
      duplicateRepositoryAlias: oo,
      treeRepositoryAlias: Si
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => Jd),
    forEntityTypes: [ve],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => Qd),
    forEntityTypes: [ve],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [ve],
    meta: {
      itemRepositoryAlias: io,
      detailRepositoryAlias: ao,
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
    forEntityTypes: [ee],
    meta: {
      treeRepositoryAlias: Si,
      moveRepositoryAlias: no,
      treeAlias: Aa,
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
    api: () => Promise.resolve().then(() => ih),
    forEntityTypes: yi,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON…", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: yi
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => lh)
  }
], ca = [{ alias: "Umb.Condition.CollectionAlias", match: Is }], Ad = [
  {
    type: "repository",
    alias: ro,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => ch)
  },
  {
    type: "collection",
    kind: "default",
    alias: Is,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => uh),
    meta: { repositoryAlias: ro }
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
        { field: "isEnabled", label: "Enabled", valueType: au },
        { field: "updated", label: "Last updated", valueType: su }
      ]
    },
    conditions: ca
  },
  {
    type: "collectionView",
    kind: "card",
    alias: "DynamicImages.CollectionView.Templates.Grid",
    name: "Dynamic Images Template Grid View",
    weight: 200,
    meta: { label: "Grid", icon: "icon-grid", pathName: "grid" },
    conditions: ca
  },
  {
    type: "entityCollectionItemCard",
    alias: "DynamicImages.EntityCollectionItemCard.Template",
    name: "Dynamic Images Template Card",
    element: () => Promise.resolve().then(() => mh),
    forEntityTypes: [ve]
  },
  {
    type: "collectionTextFilter",
    kind: "default",
    alias: "DynamicImages.CollectionTextFilter.Templates",
    name: "Dynamic Images Template Collection Filter",
    conditions: ca
  },
  {
    type: "collectionAction",
    kind: "create",
    alias: "DynamicImages.CollectionAction.Templates.Create",
    name: "Create in the Dynamic Images Template Collection",
    conditions: ca
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
      collectionAlias: Is
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [pr, Ma]
      }
    ]
  }
], Md = [
  ...Sd,
  ...Pd,
  ...Ad,
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
    element: () => Promise.resolve().then(() => vh),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Th),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Ch),
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
    api: _d,
    meta: { entityType: Ja }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => Vp),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Yp),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => em),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => nm),
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
    api: () => Promise.resolve().then(() => om),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => rm),
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
    api: () => Promise.resolve().then(() => lm),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => cm),
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
    element: () => Promise.resolve().then(() => ym)
  }
], Hm = (e, t) => {
  t.registerMany(Md);
};
var Rd = Object.defineProperty, Ld = Object.getOwnPropertyDescriptor, _r = (e) => {
  throw TypeError(e);
}, mn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ld(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Rd(t, i, s), s;
}, fn = (e, t, i) => t.has(e) || _r("Cannot " + i), zd = (e, t, i) => (fn(e, t, "read from private field"), t.get(e)), ho = (e, t, i) => t.has(e) ? _r("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Fd = (e, t, i, a) => (fn(e, t, "write to private field"), t.set(e, i), i), Ud = (e, t, i) => (fn(e, t, "access private method"), i), Ra, Os, wr;
let Mt = class extends L {
  constructor() {
    super(), ho(this, Os), ho(this, Ra), this._name = "", this._loading = !0, this.consumeContext(pt, (e) => {
      Fd(this, Ra, e), e && (this.observe(e.template, (t) => {
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
            @input=${Ud(this, Os, wr)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Ra = /* @__PURE__ */ new WeakMap();
Os = /* @__PURE__ */ new WeakSet();
wr = function(e) {
  var i;
  const t = e.target.value;
  (i = zd(this, Ra)) == null || i.updateTemplateFields({ name: t });
};
Mt.styles = P`
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
mn([
  f()
], Mt.prototype, "_name", 2);
mn([
  f()
], Mt.prototype, "_loading", 2);
Mt = mn([
  A("di-template-editor")
], Mt);
const Wd = Mt, us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Mt;
  },
  default: Wd
}, Symbol.toStringTag, { value: "Module" }));
class po extends Xc {
  constructor(t) {
    super(t, {
      workspaceAlias: Ma,
      entityType: ee,
      detailRepositoryAlias: Di
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => _m),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const Nd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: po,
  api: po
}, Symbol.toStringTag, { value: "Module" }));
function ds(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function Bd(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? ee : ni
    },
    name: e.name,
    entityType: t ? ee : ve,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? yr : e.isEnabled ? mr : fr,
    isEnabled: e.isEnabled
  };
}
class Kd extends nu {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = ds(i);
        return W(t, (n) => Zn(a, s, i.foldersOnly ?? !1, n));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: o, take: l } = ds(i);
          return W(t, (u) => Zn(o, l, i.foldersOnly ?? !1, u));
        }
        const a = i.parent.unique, { skip: s, take: n } = ds(i);
        return W(t, (o) => Iu(a, s, n, i.foldersOnly ?? !1, o));
      },
      getAncestorsOf: (i) => W(t, (a) => Ou(i.treeItem.unique, a)),
      mapper: Bd
    });
  }
}
class mo extends ou {
  constructor(t) {
    super(t, Kd);
  }
  async requestTreeRoot() {
    const { data: t } = await this._treeSource.getRootItems({ skip: 0, take: 0, paging: { skip: 0, take: 0 } });
    return { data: {
      unique: null,
      entityType: ni,
      name: "Templates",
      icon: "icon-folder",
      hasChildren: t ? t.total > 0 : !1,
      isFolder: !0
    } };
  }
}
const jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: mo,
  api: mo
}, Symbol.toStringTag, { value: "Module" }));
class $r extends nn {
  async requestMoveTo(t) {
    const { error: i } = await W(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(he);
      a == null || a.peek("positive", { data: { message: "Moved" } });
    }
    return { error: i };
  }
}
class Vd extends $r {
  constructor() {
    super(...arguments), this.move = Fu;
  }
}
class qd extends $r {
  constructor() {
    super(...arguments), this.move = Uu;
  }
}
const Gd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Vd
}, Symbol.toStringTag, { value: "Module" })), Hd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: qd
}, Symbol.toStringTag, { value: "Module" }));
class fo extends nn {
  async requestDuplicate(t) {
    const { data: i, error: a } = await W(this, (s) => Su(t.unique, s));
    if (i) {
      const s = await this.getContext(he);
      s == null || s.peek("positive", { data: { message: `'${i.template.name}' created` } });
    }
    return { error: a };
  }
}
const Yd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateTemplateRepository: fo,
  api: fo
}, Symbol.toStringTag, { value: "Module" }));
class yo extends ru {
  async getHref() {
    return td({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const Xd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: yo,
  api: yo
}, Symbol.toStringTag, { value: "Module" }));
class go extends Ya {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await W(this, async (o) => ({
      blob: await Du(t, o),
      alias: (await rn(t, o)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const s = URL.createObjectURL(i.blob), n = document.createElement("a");
    n.href = s, n.download = `${i.alias}.json`, n.click(), URL.revokeObjectURL(s);
  }
}
const Jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: go,
  api: go
}, Symbol.toStringTag, { value: "Module" })), Zd = 1500;
async function xr(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((s) => setTimeout(s, Zd));
    try {
      a = await Yu(a.id, t);
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
    for (const n of a.failures.slice(0, 3))
      i == null || i.peek("danger", { data: { message: n } });
  } else
    i == null || i.peek("danger", {
      data: { headline: `Regeneration ${a.status}`, message: a.failures[0] ?? "" }
    });
}
class vo extends Ya {
  async execute() {
    var u;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await W(this, (m) => Go([t], m)), a = ((u = i == null ? void 0 : i[0]) == null ? void 0 : u.name) ?? "this template";
    await on(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: s, error: n } = await W(this, (m) => Zo(t, !1, m));
    if (n || !s) throw n ?? new Error("Regeneration could not be started.");
    const o = await this.getContext(he);
    o == null || o.peek("positive", { data: { message: `Regenerating ${s.total} item(s)…` } });
    const l = await this.getContext(Pe);
    await xr(s, () => l == null ? void 0 : l.getLatestToken(), o);
  }
}
const Qd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: vo,
  api: vo
}, Symbol.toStringTag, { value: "Module" })), eh = new Bo(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), th = new Bo(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class bo extends Ya {
  async execute() {
    const { json: t } = await No(this, th, { data: {} }), i = this.args.unique ?? null, { data: a, error: s } = await W(this, (l) => Cu(t, "create", l, i));
    if (s || !a) throw s ?? new Error("The template could not be imported.");
    const n = await this.getContext(he);
    n == null || n.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) n == null || n.peek("warning", { data: { message: l.message } });
    const o = await this.getContext(Vo);
    o == null || o.dispatchEvent(new Wo({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const ih = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: bo,
  api: bo
}, Symbol.toStringTag, { value: "Module" }));
var ah = Object.defineProperty, sh = Object.getOwnPropertyDescriptor, kr = (e) => {
  throw TypeError(e);
}, Tr = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? sh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && ah(t, i, s), s;
}, nh = (e, t, i) => t.has(e) || kr("Cannot " + i), oh = (e, t, i) => t.has(e) ? kr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _o = (e, t, i) => (nh(e, t, "access private method"), i), ma, Er, Sr;
let oi = class extends Ko {
  constructor() {
    super(...arguments), oh(this, ma), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${_o(this, ma, Er)} aria-label="Choose a file" />
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
            @click=${_o(this, ma, Sr)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
ma = /* @__PURE__ */ new WeakSet();
Er = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
Sr = function() {
  this._json.trim() && (this.value = { json: this._json }, this._submitModal());
};
oi.styles = [
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
Tr([
  f()
], oi.prototype, "_json", 2);
oi = Tr([
  A("di-import-template-modal")
], oi);
const rh = oi, lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return oi;
  },
  default: rh
}, Symbol.toStringTag, { value: "Module" }));
function Dr(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? ee : ve,
    name: e.name,
    icon: t ? yr : e.isEnabled ? mr : fr,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class wo extends nn {
  async requestCollection(t = {}) {
    const i = await this.getContext(uu), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: n } = await W(this, (o) => Pu({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, o));
    return s ? { data: { total: s.total, items: s.items.map(Dr) } } : { error: n };
  }
}
const ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: wo,
  api: wo,
  mapCollectionItem: Dr
}, Symbol.toStringTag, { value: "Module" }));
class $o extends hu {
  async requestItemHref(t) {
    return t.entityType === ee ? er(ee, t.unique) : cn(t.unique);
  }
}
const uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: $o,
  api: $o
}, Symbol.toStringTag, { value: "Module" }));
var dh = Object.defineProperty, hh = Object.getOwnPropertyDescriptor, Cr = (e) => {
  throw TypeError(e);
}, Ve = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && dh(t, i, s), s;
}, yn = (e, t, i) => t.has(e) || Cr("Cannot " + i), La = (e, t, i) => (yn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ua = (e, t, i) => t.has(e) ? Cr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fa = (e, t, i, a) => (yn(e, t, "write to private field"), t.set(e, i), i), hs = (e, t, i) => (yn(e, t, "access private method"), i), za, _i, Li, wi, Ir, Or, Pr;
const ph = 400;
let ce = class extends L {
  constructor() {
    super(), ua(this, wi), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, ua(this, za), ua(this, _i), ua(this, Li), this.consumeContext(Pe, (e) => {
      fa(this, za, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), fa(this, _i, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && hs(this, wi, Ir).call(this);
    })), La(this, _i).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = La(this, _i)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, fa(this, Li, void 0);
  }
  render() {
    return this.item ? r`
      <uui-card-media
        name=${this.item.name}
        detail=${Xn(this.item.docTypes || void 0)}
        href=${Xn(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${hs(this, wi, Or)}
        @deselected=${hs(this, wi, Pr)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : p}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : p;
  }
};
za = /* @__PURE__ */ new WeakMap();
_i = /* @__PURE__ */ new WeakMap();
Li = /* @__PURE__ */ new WeakMap();
wi = /* @__PURE__ */ new WeakSet();
Ir = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || La(this, Li) === t)) {
    fa(this, Li, t);
    try {
      const i = await Au(e.unique, ph, () => {
        var a;
        return (a = La(this, za)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
Or = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new pu(this.item.unique)));
};
Pr = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new mu(this.item.unique)));
};
ce.styles = [
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
Ve([
  g({ type: Object })
], ce.prototype, "item", 2);
Ve([
  g({ type: Boolean })
], ce.prototype, "selectable", 2);
Ve([
  g({ type: Boolean })
], ce.prototype, "selected", 2);
Ve([
  g({ type: Boolean, attribute: "select-only" })
], ce.prototype, "selectOnly", 2);
Ve([
  g({ type: Boolean })
], ce.prototype, "disabled", 2);
Ve([
  g({ type: String })
], ce.prototype, "href", 2);
Ve([
  f()
], ce.prototype, "_src", 2);
Ve([
  f()
], ce.prototype, "_failed", 2);
ce = Ve([
  A("di-template-collection-card")
], ce);
const mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return ce;
  },
  get element() {
    return ce;
  }
}, Symbol.toStringTag, { value: "Module" }));
var fh = Object.defineProperty, yh = Object.getOwnPropertyDescriptor, Ar = (e) => {
  throw TypeError(e);
}, Qi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && fh(t, i, s), s;
}, gn = (e, t, i) => t.has(e) || Ar("Cannot " + i), ot = (e, t, i) => (gn(e, t, "read from private field"), t.get(e)), gi = (e, t, i) => t.has(e) ? Ar("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xo = (e, t, i, a) => (gn(e, t, "write to private field"), t.set(e, i), i), We = (e, t, i) => (gn(e, t, "access private method"), i), $i, Fa, ya, Ci, be, Ps, Mr, Rr, xi, Lr;
let Ne = class extends L {
  constructor() {
    super(), gi(this, be), gi(this, $i), gi(this, Fa), this._templates = [], this._fonts = [], this._loading = !0, gi(this, ya, () => {
      ot(this, $i) && We(this, be, Ps).call(this);
    }), gi(this, Ci, () => {
      var e;
      return (e = ot(this, $i)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(he, (e) => {
      xo(this, Fa, e);
    }), this.consumeContext(Pe, (e) => {
      xo(this, $i, e), e && We(this, be, Ps).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener($s, ot(this, ya));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener($s, ot(this, ya));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${We(this, be, Rr).call(this)} ${We(this, be, Lr).call(this)}
      </umb-body-layout>
    `;
  }
};
$i = /* @__PURE__ */ new WeakMap();
Fa = /* @__PURE__ */ new WeakMap();
ya = /* @__PURE__ */ new WeakMap();
Ci = /* @__PURE__ */ new WeakMap();
be = /* @__PURE__ */ new WeakSet();
Ps = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      xu(ot(this, Ci)),
      Oa(ot(this, Ci)).catch(() => []),
      Qo(ot(this, Ci)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    We(this, be, Mr).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Mr = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = ot(this, Fa)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Rr = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${We(this, be, xi).call(this, "Templates", this._templates.length, "icon-brush", !1, er(ni))}
        ${We(this, be, xi).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${We(this, be, xi).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${We(this, be, xi).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
xi = function(e, t, i, a = !1, s) {
  const n = r`
      <uui-icon name=${i}></uui-icon>
      <div class="stat-value">${t}</div>
      <div class="stat-label">${e}</div>
    `;
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        ${s ? r`<a class="stat-link" href=${s} aria-label="${e}: ${t}">${n}</a>` : n}
      </uui-box>
    `;
};
Lr = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${X(
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
        <uui-button look="secondary" href=${id("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Ne.styles = P`
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
Qi([
  f()
], Ne.prototype, "_templates", 2);
Qi([
  f()
], Ne.prototype, "_fonts", 2);
Qi([
  f()
], Ne.prototype, "_health", 2);
Qi([
  f()
], Ne.prototype, "_loading", 2);
Ne = Qi([
  A("di-overview-dashboard")
], Ne);
const gh = Ne, vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return Ne;
  },
  default: gh
}, Symbol.toStringTag, { value: "Module" })), As = /* @__PURE__ */ new Map(), ts = (e) => `di-${e}`;
function bh(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = As.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await qu(e, t), n = new FontFace(ts(e), s);
      return await n.load(), document.fonts.add(n), n;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return As.set(e, a), a;
}
async function zr(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => bh(a, t)));
}
function Fr(e) {
  As.delete(e);
}
var _h = Object.defineProperty, wh = Object.getOwnPropertyDescriptor, Ur = (e) => {
  throw TypeError(e);
}, is = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && _h(t, i, s), s;
}, vn = (e, t, i) => t.has(e) || Ur("Cannot " + i), Ce = (e, t, i) => (vn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vi = (e, t, i) => t.has(e) ? Ur("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ps = (e, t, i, a) => (vn(e, t, "write to private field"), t.set(e, i), i), R = (e, t, i) => (vn(e, t, "access private method"), i), ga, zi, Fi, Rt, O, Wr, di, ut, Ms, Nr, Br, va, Kr, jr, Vr;
function $h(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : xh(e.sourceUrl);
    default:
      return "Media library";
  }
}
function xh(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let dt = class extends L {
  constructor() {
    super(), vi(this, O), vi(this, ga), vi(this, zi), vi(this, Fi), this._fonts = [], this._loading = !0, vi(this, Rt, () => {
      var e;
      return (e = Ce(this, ga)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(jo, (e) => {
      ps(this, zi, e);
    }), this.consumeContext(he, (e) => {
      ps(this, Fi, e);
    }), this.consumeContext(Pe, (e) => {
      ps(this, ga, e), e && R(this, O, di).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${R(this, O, Ms)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${R(this, O, Ms)}>
                  Add your first font
                </uui-button>
              </div>` : r`${X(this._fonts, (e) => e.key, (e) => R(this, O, Kr).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
ga = /* @__PURE__ */ new WeakMap();
zi = /* @__PURE__ */ new WeakMap();
Fi = /* @__PURE__ */ new WeakMap();
Rt = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
Wr = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
di = async function() {
  this._loading = !0;
  try {
    this._fonts = await Oa(Ce(this, Rt)), await zr(this._fonts.map((e) => e.key), Ce(this, Rt));
  } catch (e) {
    R(this, O, ut).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
ut = function(e, t, i) {
  var s;
  const a = i instanceof ct ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ce(this, Fi)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Ms = async function() {
  var i, a;
  if (!Ce(this, zi)) return;
  const e = Ce(this, zi).open(this, eh, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Ce(this, Fi)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await R(this, O, di).call(this));
};
Nr = async function(e) {
  try {
    await Ku(e.key, Ce(this, Rt)), Fr(e.key), R(this, O, ut).call(this, "positive", `'${e.familyName}' refreshed`), await R(this, O, di).call(this);
  } catch (t) {
    R(this, O, ut).call(this, "danger", "That font could not be refreshed", t);
  }
};
Br = async function(e) {
  await on(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Vu(e.key, Ce(this, Rt)), Fr(e.key), R(this, O, ut).call(this, "positive", `'${e.familyName}' deleted`), await R(this, O, di).call(this);
  } catch (t) {
    R(this, O, ut).call(this, "danger", "That font could not be deleted", t);
  }
};
va = async function(e, t, i, a) {
  try {
    await ju(e.key, t, i, Ce(this, Rt), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), R(this, O, ut).call(this, "positive", `'${t}' saved`), await R(this, O, di).call(this), a != null && a.keepOpen && await R(this, O, Wr).call(this);
  } catch (s) {
    R(this, O, ut).call(this, "danger", "The font could not be saved", s);
  }
};
Kr = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${$h(e)} · weight ${e.weight}
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
                  @click=${() => R(this, O, Nr).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => R(this, O, Br).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${ts(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? R(this, O, Vr).call(this, e) : R(this, O, jr).call(this, e)}
      </div>
    `;
};
jr = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${X(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
Vr = function(e) {
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
          ${X(
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
      t.splice(a, 1), R(this, O, va).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), R(this, O, va).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    R(this, O, va).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
dt.styles = P`
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
is([
  f()
], dt.prototype, "_fonts", 2);
is([
  f()
], dt.prototype, "_loading", 2);
is([
  f()
], dt.prototype, "_editingKey", 2);
dt = is([
  A("di-fonts-dashboard")
], dt);
const kh = dt, Th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return dt;
  },
  default: kh
}, Symbol.toStringTag, { value: "Module" }));
var Eh = Object.defineProperty, Sh = Object.getOwnPropertyDescriptor, qr = (e) => {
  throw TypeError(e);
}, ea = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Sh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Eh(t, i, s), s;
}, bn = (e, t, i) => t.has(e) || qr("Cannot " + i), Ze = (e, t, i) => (bn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), da = (e, t, i) => t.has(e) ? qr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ko = (e, t, i, a) => (bn(e, t, "write to private field"), t.set(e, i), i), Bt = (e, t, i) => (bn(e, t, "access private method"), i), ba, Kt, ri, rt, Ua, Rs, Gr;
let Be = class extends L {
  constructor() {
    super(), da(this, rt), da(this, ba), da(this, Kt), this._loading = !0, this._busy = !1, da(this, ri, () => {
      var e;
      return (e = Ze(this, ba)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(he, (e) => {
      ko(this, Kt, e);
    }), this.consumeContext(Pe, (e) => {
      ko(this, ba, e), e && Bt(this, rt, Ua).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Bt(this, rt, Ua).call(this)}>Re-check</uui-button>
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
                ${X(
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
                        ${a.templateKey ? r`<a href=${cn(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Bt(this, rt, Gr).call(this)}
      </umb-body-layout>
    `;
  }
};
ba = /* @__PURE__ */ new WeakMap();
Kt = /* @__PURE__ */ new WeakMap();
ri = /* @__PURE__ */ new WeakMap();
rt = /* @__PURE__ */ new WeakSet();
Ua = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Qo(Ze(this, ri)),
      Zu(Ze(this, ri)).catch(() => {
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
    const s = e === "export" ? await Qu(Ze(this, ri)) : await ed(Ze(this, ri));
    (t = Ze(this, Kt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const n of s.messages.slice(0, 3))
      (i = Ze(this, Kt)) == null || i.peek("warning", { data: { message: n } });
    await Bt(this, rt, Ua).call(this);
  } catch (s) {
    (a = Ze(this, Kt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Gr = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Bt(this, rt, Rs).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Bt(this, rt, Rs).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
Be.styles = P`
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
ea([
  f()
], Be.prototype, "_health", 2);
ea([
  f()
], Be.prototype, "_sync", 2);
ea([
  f()
], Be.prototype, "_loading", 2);
ea([
  f()
], Be.prototype, "_busy", 2);
Be = ea([
  A("di-health-dashboard")
], Be);
const Dh = Be, Ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Be;
  },
  default: Dh
}, Symbol.toStringTag, { value: "Module" })), Hr = 3, Yr = 12, Xr = 0.1, Jr = 0.9;
function Ih(e) {
  return Math.max(Hr, Math.min(Yr, e));
}
function Oh(e) {
  return Math.max(Xr, Math.min(Jr, e));
}
function Ph(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Ih(t), s = 0.5 * Oh(i), n = e === "star" ? a * 2 : a, o = e === "star" ? 180 / a : 360 / a, l = [];
  for (let u = 0; u < n; u++) {
    const m = (-90 + u * o) * Math.PI / 180, S = e === "star" && u % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + S * Math.cos(m), y: 0.5 + S * Math.sin(m) });
  }
  return l;
}
function Ah(e, t, i) {
  const a = Ph(e, t, i);
  if (a.length !== 0)
    return `polygon(${a.map((s) => `${(s.x * 100).toFixed(3)}% ${(s.y * 100).toFixed(3)}%`).join(", ")})`;
}
const y = {
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
  sides: { min: Hr, max: Yr },
  innerRatio: { min: Xr, max: Jr }
}, Wa = { min: 0.1, max: 4 };
function Mh(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function Zr(e) {
  if (e.kind === "radial") {
    const t = Math.round(To(e.centreX ?? 0.5) * 100), i = Math.round(To(e.centreY ?? 0.5) * 100);
    return `radial-gradient(ellipse farthest-corner at ${t}% ${i}%, ${e.from}, ${e.to})`;
  }
  return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
}
function To(e) {
  return Math.min(1, Math.max(0, e));
}
const _n = P`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Rh(e, t) {
  const i = [], a = t.lockX ? void 0 : Eo(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Lh(t),
    t.threshold
  ), s = t.lockY ? void 0 : Eo(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    zh(t),
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
function Lh(e) {
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
function zh(e) {
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
function Eo(e, t, i) {
  let a;
  for (const s of e)
    for (const n of t) {
      const o = Math.abs(n.at - s.value);
      o > i || (!a || o < a.distance) && (a = { at: n.at, offset: s.offset, label: n.label, distance: o });
    }
  return a;
}
var Fh = Object.defineProperty, Uh = Object.getOwnPropertyDescriptor, Qr = (e) => {
  throw TypeError(e);
}, qe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Uh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Fh(t, i, s), s;
}, wn = (e, t, i) => t.has(e) || Qr("Cannot " + i), fe = (e, t, i) => (wn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ms = (e, t, i) => t.has(e) ? Qr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fs = (e, t, i, a) => (wn(e, t, "write to private field"), t.set(e, i), i), N = (e, t, i) => (wn(e, t, "access private method"), i), vt, ki, I, as, $n, el, tl, il, al, xn, Na, sl, nl, ol, rl, ll, cl, ul, dl, hl;
const Wh = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], ys = 18;
let _e = class extends L {
  constructor() {
    super(...arguments), ms(this, I), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, ms(this, vt), ms(this, ki);
  }
  willUpdate() {
    this._box = N(this, I, el).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== fe(this, ki) && ((t = fe(this, vt)) == null || t.disconnect(), fs(this, ki, e), e && (fe(this, vt) ?? fs(this, vt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), fe(this, vt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = fe(this, vt)) == null || e.disconnect(), fs(this, ki, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${Uo({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${U({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...fe(this, I, tl) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...N(this, I, xn).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      N(this, I, sl).call(this, t), N(this, I, Na).call(this, t);
    }}>
        ${N(this, I, nl).call(this)}
      </div>

      ${this.selected ? N(this, I, dl).call(this, e) : p}
      ${this.showMeasured && this.measured ? N(this, I, hl).call(this) : p}
    `;
  }
};
vt = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakSet();
as = function() {
  return this.resolvedPosition ?? this.layer.position;
};
$n = function() {
  return this.layer.rotation ?? 0;
};
el = function() {
  var s;
  const e = this.layer, t = e.size.width ?? N(this, I, il).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? N(this, I, al).call(this), a = es(fe(this, I, as), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
tl = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
il = function() {
  var e;
  switch (this.layer.type) {
    case "badges": {
      if ((e = this.measured) != null && e.width) return this.measured.width;
      const { badge: t, label: i, gap: a, maxItems: s, direction: n } = this.layer, o = i.position === "right" ? t.size + i.gap + i.fontSize * 0.6 * 8 : t.size;
      return n === "horizontal" ? s * o + (s - 1) * a : o;
    }
    case "text":
      return 600;
    default:
      return 240;
  }
};
al = function() {
  switch (this.layer.type) {
    case "text": {
      const { fontSize: e, lineSpacing: t, maxLines: i } = this.layer.style;
      return e * t * (i ?? 1);
    }
    case "badges": {
      const { badge: e, label: t, gap: i, maxItems: a, direction: s } = this.layer, n = t.position === "below" ? e.size + t.gap + t.fontSize * 1.2 : t.position === "right" ? Math.max(e.size, t.fontSize * 1.2) : e.size;
      return s === "horizontal" ? n : a * n + (a - 1) * i;
    }
    default:
      return 135;
  }
};
xn = function(e) {
  const t = fe(this, I, $n);
  if (t === 0) return {};
  const i = fe(this, I, as);
  return {
    transform: `rotate(${t}deg)`,
    transformOrigin: `${(i.x - e.x) * this.scale}px ${(i.y - e.y) * this.scale}px`
  };
};
Na = function(e, t) {
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
sl = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
nl = function() {
  switch (this.layer.type) {
    case "text":
      return N(this, I, ol).call(this);
    case "image":
      return N(this, I, ll).call(this);
    case "badges":
      return N(this, I, cl).call(this);
    default:
      return N(this, I, ul).call(this);
  }
};
ol = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || N(this, I, rl).call(this);
  return r`
      <div
        class="text"
        style=${U({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${ts(e.fontKey)}, sans-serif`,
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
rl = function() {
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
ll = function() {
  if (this.layer.type !== "image") return p;
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
cl = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: n, rowGap: o } = this.layer, l = s === "horizontal", u = l && n, m = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${U({
    flexDirection: l ? "row" : "column",
    flexWrap: u ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...u ? { rowGap: `${o * this.scale}px` } : {}
  })}>
        ${X(
    Array.from({ length: Math.max(1, a) }, (S, K) => K),
    (S) => S,
    () => r`
            <div class=${Uo({ badge: !0, right: m === "right" })}>
              <div
                class="circle"
                style=${U({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${m === "none" ? p : r`<div
                    class="badge-label"
                    style=${U({
      ...m === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${ts(t.fontKey)}, sans-serif`,
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
ul = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? Zr(i) : e.fill ?? "transparent", s = e.border, n = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${U({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${n}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const o = Ah(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${U({ clipPath: o, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${U({ inset: `${n}px`, clipPath: o, background: a })}></div>
      </div>
    `;
};
dl = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, n = fe(this, I, as), o = fe(this, I, $n), l = Ie(this.layer.position, "x") || Ie(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${U({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...N(this, I, xn).call(this, e) })}>
        <span
          class="tag"
          style=${U(o !== 0 ? { transform: `rotate(${-o}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${X(
    Wh,
    (u) => u,
    (u) => r`
                  <span
                    class="handle ${u}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${u}"
                    @pointerdown=${(m) => N(this, I, Na).call(this, m, u)}>
                  </span>
                `
  )}
              <span class="stalk" style=${U({ height: `${ys}px`, top: `${-ys}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${U({ top: `${-ys}px` })}
                @pointerdown=${(u) => N(this, I, Na).call(this, u, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${n.anchor}${o !== 0 ? ` - turns ${o}° here` : ""}"
          style=${U({
    left: `${(n.x - e.x) * this.scale}px`,
    top: `${(n.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
hl = function() {
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
_e.styles = P`
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
qe([
  g({ type: Object })
], _e.prototype, "layer", 2);
qe([
  g({ type: Number })
], _e.prototype, "scale", 2);
qe([
  g({ type: Boolean, reflect: !0 })
], _e.prototype, "selected", 2);
qe([
  g({ type: Object })
], _e.prototype, "measured", 2);
qe([
  g({ type: Boolean })
], _e.prototype, "showMeasured", 2);
qe([
  g({ type: String })
], _e.prototype, "resolvedText", 2);
qe([
  g({ attribute: !1 })
], _e.prototype, "resolvedPosition", 2);
qe([
  f()
], _e.prototype, "_box", 2);
_e = qe([
  A("di-layer-box")
], _e);
var Nh = Object.defineProperty, Bh = Object.getOwnPropertyDescriptor, pl = (e) => {
  throw TypeError(e);
}, kn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Nh(t, i, s), s;
}, Kh = (e, t, i) => t.has(e) || pl("Cannot " + i), jh = (e, t, i) => t.has(e) ? pl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Vh = (e, t, i) => (Kh(e, t, "access private method"), i), Ls, ml;
let Ui = class extends L {
  constructor() {
    super(...arguments), jh(this, Ls), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${X(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => Vh(this, Ls, ml).call(this, e)
    )}`;
  }
};
Ls = /* @__PURE__ */ new WeakSet();
ml = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
Ui.styles = P`
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
kn([
  g({ type: Array })
], Ui.prototype, "guides", 2);
kn([
  g({ type: Number })
], Ui.prototype, "scale", 2);
Ui = kn([
  A("di-guides")
], Ui);
var qh = Object.defineProperty, Gh = Object.getOwnPropertyDescriptor, fl = (e) => {
  throw TypeError(e);
}, ta = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && qh(t, i, s), s;
}, Hh = (e, t, i) => t.has(e) || fl("Cannot " + i), Yh = (e, t, i) => t.has(e) ? fl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), So = (e, t, i) => (Hh(e, t, "access private method"), i), _a, zs;
let V = class extends L {
  constructor() {
    super(...arguments), Yh(this, _a), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    So(this, _a, zs).call(this, "top"), So(this, _a, zs).call(this, "left");
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
_a = /* @__PURE__ */ new WeakSet();
zs = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, n = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : V.thickness) * n, t.height = (e === "top" ? V.thickness : s) * n, t.style.width = `${e === "top" ? s : V.thickness}px`, t.style.height = `${e === "top" ? V.thickness : s}px`, i.setTransform(n, 0, 0, n, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const o = getComputedStyle(this);
  i.strokeStyle = o.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = o.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const u = Math.round(l * this.scale) + 0.5, m = l % 100 === 0, S = m ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(u, V.thickness - S), i.lineTo(u, V.thickness)) : (i.moveTo(V.thickness - S, u), i.lineTo(V.thickness, u)), i.stroke(), m && l > 0 && (e === "top" ? i.fillText(String(l), u + 2, 9) : (i.save(), i.translate(9, u - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
V.thickness = 20;
V.styles = P`
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
ta([
  g({ type: Number })
], V.prototype, "canvasWidth", 2);
ta([
  g({ type: Number })
], V.prototype, "canvasHeight", 2);
ta([
  g({ type: Number })
], V.prototype, "scale", 2);
ta([
  g({ type: Object })
], V.prototype, "pointer", 2);
V = ta([
  A("di-rulers")
], V);
var Xh = Object.defineProperty, Jh = Object.getOwnPropertyDescriptor, yl = (e) => {
  throw TypeError(e);
}, ae = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jh(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Xh(t, i, s), s;
}, Tn = (e, t, i) => t.has(e) || yl("Cannot " + i), M = (e, t, i) => (Tn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), se = (e, t, i) => t.has(e) ? yl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), wa = (e, t, i, a) => (Tn(e, t, "write to private field"), t.set(e, i), i), C = (e, t, i) => (Tn(e, t, "access private method"), i), bt, Ti, lt, D, En, Fs, Us, ss, Sn, Ws, gl, vl, Dn, bl, _l, Ns, $a, wl, $l, Ft, Cn, Bs, Ks, js, xl, Vs, qs, Gs, kl;
const Zh = 6, Tl = 20, Qh = 2, ep = 15, tp = 0.1;
let Y = class extends L {
  constructor() {
    super(...arguments), se(this, D), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, se(this, bt), se(this, Ti), se(this, lt, /* @__PURE__ */ new Map()), se(this, Ns, (e) => {
      const t = this.template.layers.find((o) => o.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = C(this, D, Sn).call(this, t), a = C(this, D, Ws).call(this, t), s = C(this, D, gl).call(this, t), n = C(this, D, ss).call(this, e.detail.startX, e.detail.startY);
      wa(this, bt, {
        key: t.key,
        handle: e.detail.handle,
        startClientX: e.detail.startX,
        startClientY: e.detail.startY,
        startBox: i,
        startPosition: s,
        startRotation: t.rotation ?? 0,
        startExtent: a,
        startAngle: Math.atan2(n.y - s.y, n.x - s.x),
        moved: !1,
        shiftKey: e.detail.shiftKey,
        altKey: e.detail.altKey
      }), this.dispatchEvent(new CustomEvent("di-transaction-begin", { bubbles: !0, composed: !0 }));
    }), se(this, $a, (e) => {
      var ra, Hn;
      this._pointer = C(this, D, Us).call(this, e.clientX, e.clientY);
      const t = M(this, bt);
      if (!t) return;
      const i = this.template.layers.find((mi) => mi.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        C(this, D, $l).call(this, i, t, e);
        return;
      }
      const n = Ie(i.position, "x"), o = Ie(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        C(this, D, wl).call(this, i, t, t.handle, a, s, e.shiftKey, n, o);
        return;
      }
      let u = t.handle ? C(this, D, Cn).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      n && (u = { ...u, x: t.startBox.x, width: (ra = t.handle) != null && ra.includes("w") ? t.startBox.width : u.width }), o && (u = { ...u, y: t.startBox.y, height: (Hn = t.handle) != null && Hn.includes("n") ? t.startBox.height : u.height });
      const m = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, S = l !== 0 ? { x: u.x + m.x, y: u.y + m.y, width: t.startExtent.width, height: t.startExtent.height } : u, $e = this.snapEnabled && !e.altKey ? Rh(S, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((mi) => mi.key !== i.key).map((mi) => C(this, D, Ws).call(this, mi)),
        threshold: Zh / this.scale,
        lockX: n,
        lockY: o
      }) : {
        box: {
          ...S,
          x: n ? S.x : Math.round(S.x),
          y: o ? S.y : Math.round(S.y)
        },
        guides: []
      };
      this._guides = $e.guides;
      const Ae = l !== 0 ? { ...u, x: $e.box.x - m.x, y: $e.box.y - m.y } : $e.box, Xe = ud(Ae, i.position);
      n && (Xe.x = i.position.x), o && (Xe.y = i.position.y);
      const Me = { position: Xe };
      t.handle && (Me.size = {
        width: Math.max(1, Math.round(Ae.width)),
        height: Math.max(1, Math.round(Ae.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: Me } })
      );
    }), se(this, Ft, () => {
      if (!M(this, bt)) return;
      const e = M(this, bt).moved;
      wa(this, bt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), se(this, Bs, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), se(this, Ks, () => {
      this._dropTarget = !1;
    }), se(this, js, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = C(this, D, Us).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: C(this, D, xl).call(this, e) }
        })
      );
    }), se(this, Vs, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), se(this, qs, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => lr(t.position)) && this.requestUpdate();
    }), se(this, Gs, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), wa(this, Ti, new ResizeObserver(() => C(this, D, Fs).call(this))), M(this, Ti).observe(this), window.addEventListener("pointermove", M(this, $a)), window.addEventListener("pointerup", M(this, Ft)), window.addEventListener("pointercancel", M(this, Ft));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = M(this, Ti)) == null || e.disconnect(), window.removeEventListener("pointermove", M(this, $a)), window.removeEventListener("pointerup", M(this, Ft)), window.removeEventListener("pointercancel", M(this, Ft));
  }
  updated(e) {
    C(this, D, Fs).call(this), e.has("zoom") && C(this, D, En).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = M(this, lt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((n) => [n.key, n]));
    C(this, D, vl).call(this);
    const s = this.showRulers ? Tl : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${M(this, Vs)}
        @dragover=${M(this, Bs)}
        @dragleave=${M(this, Ks)}
        @drop=${M(this, js)}
        @di-layer-drag-start=${M(this, Ns)}
        @di-layer-box-resize=${M(this, qs)}>
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
              </di-rulers>` : p}

          <div
            class="stage"
            style=${U({
      background: e.backgroundGradient ? Zr(e.backgroundGradient) : e.background
    })}
            @pointerdown=${M(this, Gs)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${U({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${X(
      this.template.layers,
      (n) => n.key,
      (n) => {
        var o, l;
        return r`
                <di-layer-box
                  data-key=${n.key}
                  .layer=${n}
                  .scale=${this.scale}
                  .selected=${n.key === this.selectedLayerKey}
                  .measured=${a.get(n.key)}
                  .showMeasured=${this.showMeasured}
                  .resolvedText=${((o = a.get(n.key)) == null ? void 0 : o.resolvedText) ?? void 0}
                  .resolvedPosition=${(l = M(this, lt).get(n.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? C(this, D, kl).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
bt = /* @__PURE__ */ new WeakMap();
Ti = /* @__PURE__ */ new WeakMap();
lt = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakSet();
En = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
Fs = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Tl : 0) + Qh, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, C(this, D, En).call(this));
};
Us = function(e, t) {
  const i = C(this, D, ss).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
ss = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
Sn = function(e) {
  const t = M(this, lt).get(e.key);
  if (t) return t.box;
  const i = C(this, D, Dn).call(this, e), a = es(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Ws = function(e) {
  const t = M(this, lt).get(e.key);
  return t ? t.extent : rr(C(this, D, Sn).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
gl = function(e) {
  var t;
  return ((t = M(this, lt).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
vl = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  wa(this, lt, yd(
    this.template.layers,
    (i) => C(this, D, Dn).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Dn = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? C(this, D, bl).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? C(this, D, _l).call(this, e, i)
  };
};
bl = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
_l = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
Ns = /* @__PURE__ */ new WeakMap();
$a = /* @__PURE__ */ new WeakMap();
wl = function(e, t, i, a, s, n, o, l) {
  const u = t.startRotation, m = t.startPosition, S = dd(a, s, 0, 0, u);
  let K = C(this, D, Cn).call(this, t.startBox, i, S.x, S.y, n);
  o && (K = { ...K, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : K.width }), l && (K = { ...K, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : K.height });
  const $e = Math.max(1, Math.round(K.width)), Ae = Math.max(1, Math.round(K.height)), Xe = un(K.x, K.y, $e, Ae, m.anchor), Me = Ut(Xe.x, Xe.y, m.x, m.y, u), ra = {
    ...e.position,
    x: o ? e.position.x : Math.round(Me.x),
    y: l ? e.position.y : Math.round(Me.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: ra, size: { width: $e, height: Ae } } }
    })
  );
};
$l = function(e, t, i) {
  const a = t.startPosition, s = C(this, D, ss).call(this, i.clientX, i.clientY), o = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + o, u = i.shiftKey ? ep : tp, m = or(Math.round(l / u) * u);
  this._guides = [], m !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: m } }
    })
  );
};
Ft = /* @__PURE__ */ new WeakMap();
Cn = function(e, t, i, a, s) {
  let { x: n, y: o, width: l, height: u } = e;
  if (t.includes("w") && (n = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (o = e.y + a, u = e.height - a), t.includes("s") && (u = e.height + a), s && e.width > 0 && e.height > 0) {
    const m = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(u - e.height) ? u = l / m : l = u * m, t.includes("n") && (o = e.y + e.height - u), t.includes("w") && (n = e.x + e.width - l);
  }
  return { x: n, y: o, width: Math.max(4, l), height: Math.max(4, u) };
};
Bs = /* @__PURE__ */ new WeakMap();
Ks = /* @__PURE__ */ new WeakMap();
js = /* @__PURE__ */ new WeakMap();
xl = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Vs = /* @__PURE__ */ new WeakMap();
qs = /* @__PURE__ */ new WeakMap();
Gs = /* @__PURE__ */ new WeakMap();
kl = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${U({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
Y.styles = P`
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
      ${_n}
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
ae([
  g({ type: Object })
], Y.prototype, "template", 2);
ae([
  g({ type: String })
], Y.prototype, "selectedLayerKey", 2);
ae([
  g({ type: Object })
], Y.prototype, "baseImageUrl", 2);
ae([
  g({ type: Array })
], Y.prototype, "serverBounds", 2);
ae([
  g({ type: Boolean })
], Y.prototype, "showMeasured", 2);
ae([
  g({ type: Boolean })
], Y.prototype, "snapEnabled", 2);
ae([
  g({ type: Boolean })
], Y.prototype, "showRulers", 2);
ae([
  g({ type: Boolean })
], Y.prototype, "showSafeArea", 2);
ae([
  g({ type: Number })
], Y.prototype, "zoom", 2);
ae([
  f()
], Y.prototype, "_fitScale", 2);
ae([
  f()
], Y.prototype, "_guides", 2);
ae([
  f()
], Y.prototype, "_pointer", 2);
ae([
  f()
], Y.prototype, "_dropTarget", 2);
Y = ae([
  A("di-designer-canvas")
], Y);
var ip = Object.defineProperty, ap = Object.getOwnPropertyDescriptor, El = (e) => {
  throw TypeError(e);
}, In = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ap(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && ip(t, i, s), s;
}, Sl = (e, t, i) => t.has(e) || El("Cannot " + i), sp = (e, t, i) => (Sl(e, t, "read from private field"), i ? i.call(e) : t.get(e)), np = (e, t, i) => t.has(e) ? El("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Se = (e, t, i) => (Sl(e, t, "access private method"), i), re, Dl, Cl, Il, Ol, Pl, _t;
const Do = {
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
let Wi = class extends L {
  constructor() {
    super(...arguments), np(this, re), this.properties = [], this._search = "";
  }
  render() {
    const e = op(sp(this, re, Dl));
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

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : X(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => Se(this, re, Ol).call(this, t, i)
    )}

        ${Se(this, re, Pl).call(this)}
      </div>
    `;
  }
};
re = /* @__PURE__ */ new WeakSet();
Dl = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Cl = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Il = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
Ol = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${X(
    t,
    (i) => i.alias,
    (i) => Se(this, re, _t).call(
      this,
      i.name,
      Do[i.classification] ?? Do.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Pl = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Se(this, re, _t).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Se(this, re, _t).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Se(this, re, _t).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Se(this, re, _t).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Se(this, re, _t).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
_t = function(e, t, i, a, s) {
  const n = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${n}
        @dragstart=${(o) => Se(this, re, Il).call(this, o, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${n}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => Se(this, re, Cl).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Wi.styles = P`
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

    .empty {
      margin: 0;
      color: var(--uui-color-text-alt);
      font-size: 13px;
    }
  `;
In([
  g({ type: Array })
], Wi.prototype, "properties", 2);
In([
  f()
], Wi.prototype, "_search", 2);
Wi = In([
  A("di-property-palette")
], Wi);
function op(e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e) {
    const s = a.group || "Other", n = t.get(s) ?? [];
    n.push(a), t.set(s, n);
  }
  const i = /* @__PURE__ */ new Map();
  t.has("Node") && i.set("Node", t.get("Node"));
  for (const [a, s] of t)
    a !== "Node" && i.set(a, s);
  return i;
}
function rp(e) {
  return e.backgroundGradient ? "gradient" : lp(e.background) ? "transparent" : "colour";
}
function lp(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function cp(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
function up(e) {
  const t = hp(e);
  return { root: t[0] ?? "", tail: t.slice(1).join(".") };
}
function dp(e, t) {
  const i = (e ?? "").trim(), a = (t ?? "").trim();
  return i ? a ? `${i}.${a}` : i : "";
}
const hp = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0);
var pp = Object.defineProperty, mp = Object.getOwnPropertyDescriptor, Al = (e) => {
  throw TypeError(e);
}, ns = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? mp(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && pp(t, i, s), s;
}, Ml = (e, t, i) => t.has(e) || Al("Cannot " + i), Qe = (e, t, i) => (Ml(e, t, "read from private field"), i ? i.call(e) : t.get(e)), fp = (e, t, i) => t.has(e) ? Al("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ii = (e, t, i) => (Ml(e, t, "access private method"), i), Z, Ni, Oi, os, Rl, Ll;
let li = class extends L {
  constructor() {
    super(...arguments), fp(this, Z), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Qe(this, Z, Ni)};opacity:${Qe(this, Z, Oi)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Ii(this, Z, os).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Qe(this, Z, Ni)}
                  @input=${(e) => Ii(this, Z, Rl).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Qe(this, Z, Oi))}
                    @input=${(e) => Ii(this, Z, Ll).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Qe(this, Z, Oi) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
Z = /* @__PURE__ */ new WeakSet();
Ni = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
Oi = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
os = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Rl = function(e) {
  const t = Qe(this, Z, Oi);
  Ii(this, Z, os).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${zl(t)}`);
};
Ll = function(e) {
  Ii(this, Z, os).call(this, e >= 0.999 ? Qe(this, Z, Ni).toUpperCase() : `${Qe(this, Z, Ni).toUpperCase()}${zl(e)}`);
};
li.styles = P`
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
ns([
  g({ type: String })
], li.prototype, "value", 2);
ns([
  g({ type: String })
], li.prototype, "label", 2);
ns([
  f()
], li.prototype, "_open", 2);
li = ns([
  A("di-colour-input")
], li);
const zl = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var yp = Object.defineProperty, gp = Object.getOwnPropertyDescriptor, Fl = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gp(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && yp(t, i, s), s;
};
const Co = {
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
let Ba = class extends L {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${X(
      nr,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Co[e]}
              title=${Co[e]}
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
Ba.styles = P`
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
Fl([
  g({ type: String })
], Ba.prototype, "value", 2);
Ba = Fl([
  A("di-anchor-picker")
], Ba);
var vp = Object.defineProperty, bp = Object.getOwnPropertyDescriptor, Ul = (e) => {
  throw TypeError(e);
}, mt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bp(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && vp(t, i, s), s;
}, _p = (e, t, i) => t.has(e) || Ul("Cannot " + i), wp = (e, t, i) => t.has(e) ? Ul("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $p = (e, t, i) => (_p(e, t, "access private method"), i), Hs, Wl;
let Oe = class extends L {
  constructor() {
    super(...arguments), wp(this, Hs), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${$p(this, Hs, Wl)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
Hs = /* @__PURE__ */ new WeakSet();
Wl = function(e) {
  const t = e.target, i = t.value, a = Mh(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Oe.styles = P`
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
mt([
  g({ type: Number })
], Oe.prototype, "value", 2);
mt([
  g({ type: String })
], Oe.prototype, "label", 2);
mt([
  g({ type: String })
], Oe.prototype, "suffix", 2);
mt([
  g({ type: Number })
], Oe.prototype, "step", 2);
mt([
  g({ type: Number })
], Oe.prototype, "min", 2);
mt([
  g({ type: Number })
], Oe.prototype, "max", 2);
mt([
  g({ type: String })
], Oe.prototype, "placeholder", 2);
Oe = mt([
  A("di-number-field")
], Oe);
var xp = Object.defineProperty, kp = Object.getOwnPropertyDescriptor, Nl = (e) => {
  throw TypeError(e);
}, hi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kp(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && xp(t, i, s), s;
}, Tp = (e, t, i) => t.has(e) || Nl("Cannot " + i), Ep = (e, t, i) => t.has(e) ? Nl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (Tp(e, t, "access private method"), i), d, b, ye, Bl, Kl, jl, On, Ys, Vl, ql, Gl, Hl, Yl, Xl, Jl, Xs, Zl, xa, Ql, ec, pi, Js, Pn, tc;
const Io = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let ht = class extends L {
  constructor() {
    super(...arguments), Ep(this, d), this.properties = [], this.linkedProperties = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, d, Vl).call(this, this.layer) : h(this, d, Bl).call(this)}</div>` : p;
  }
};
d = /* @__PURE__ */ new WeakSet();
b = function(e) {
  this.layer && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: this.layer.key, patch: e }
    })
  );
};
ye = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Bl = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${y.width.min}
            .max=${y.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => h(this, d, ye).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${y.height.min}
            .max=${y.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => h(this, d, ye).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${h(this, d, Kl).call(this, e)}

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${ic(e.baseImage.kind)}
              @change=${(t) => h(this, d, ye).call(this, {
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
                @change=${(t) => h(this, d, ye).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${h(this, d, pi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, d, ye).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${H(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => h(this, d, ye).call(this, { baseImageFit: t.target.value })}>
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
Kl = function(e) {
  const t = rp(e);
  return r`
      <label class="field">
        <span>Fill</span>
        <uui-select
          .value=${t}
          .options=${H(["colour", "gradient", "transparent"], t)}
          @change=${(i) => h(this, d, jl).call(this, e, i.target.value)}>
        </uui-select>
      </label>

      ${t === "colour" ? r`<label class="field">
            <span>Colour</span>
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => h(this, d, ye).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </label>` : p}

      ${t === "gradient" && e.backgroundGradient ? h(this, d, On).call(this, e.backgroundGradient, (i) => h(this, d, ye).call(this, { backgroundGradient: i })) : p}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : p}
    `;
};
jl = function(e, t) {
  if (t === "gradient") {
    h(this, d, ye).call(this, { backgroundGradient: e.backgroundGradient ?? sr() });
    return;
  }
  h(this, d, ye).call(this, {
    background: cp(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
On = function(e, t) {
  return r`
      <label class="field">
        <span>Type</span>
        <uui-select
          .value=${e.kind}
          .options=${H(["linear", "radial"], e.kind)}
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
            ${h(this, d, Ys).call(this, "Centre X", e.centreX, (i) => t({ ...e, centreX: i }))}
            ${h(this, d, Ys).call(this, "Centre Y", e.centreY, (i) => t({ ...e, centreY: i }))}
          </div>` : r`<di-number-field
            .min=${y.gradientAngle.min}
            .max=${y.gradientAngle.max}
            label="Angle"
            suffix="°"
            .value=${e.angle}
            @change=${(i) => t({ ...e, angle: i.detail.value ?? 180 })}>
          </di-number-field>`}
    `;
};
Ys = function(e, t, i) {
  return r`<di-number-field
      .min=${y.gradientCentre.min * 100}
      .max=${y.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
Vl = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, d, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, d, ql).call(this, e) : p}
      ${e.type === "text" ? h(this, d, Gl).call(this, e) : p}
      ${e.type === "image" ? h(this, d, Hl).call(this, e) : p}
      ${e.type === "badges" ? h(this, d, Yl).call(this, e) : p}
      ${e.type === "rect" ? h(this, d, Xl).call(this, e) : p}
      ${h(this, d, Jl).call(this, e)} ${h(this, d, ec).call(this, e)}
    `;
};
ql = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${H(
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
            @change=${(i) => h(this, d, b).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? r`<label class="field">
              <span>Property</span>
              ${h(this, d, pi).call(this, t.propertyAlias ?? "", (i) => h(this, d, b).call(this, { binding: { ...t, propertyAlias: i } }))}
            </label>` : p}

        ${t.kind === "date" ? r`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => h(this, d, b).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "static" || t.kind === "expression" ? r`<label class="field">
              <span>${t.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => h(this, d, b).call(this, {
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
              @change=${(i) => h(this, d, b).call(this, { prefix: i.target.value })}>
            </uui-input>
          </label>
          <label class="field">
            <span>Suffix</span>
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => h(this, d, b).call(this, { suffix: i.target.value })}>
            </uui-input>
          </label>
        </div>
      </uui-box>
    `;
};
Gl = function(e) {
  const t = e.style, i = (a) => h(this, d, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, d, Pn).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, d, tc).call(this, t.fontKey, t.styleName ?? "", (a, s, n) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: n ?? t.fontStyle }))}

        <div class="pair">
          <di-number-field
            .min=${y.fontSize.min}
            .max=${y.fontSize.max}
            label="Size"
            .value=${t.fontSize}
            @change=${(a) => i({ fontSize: a.detail.value ?? t.fontSize })}>
          </di-number-field>
          <label class="field">
            <span>Weight</span>
            <uui-select
              .value=${t.fontStyle}
              .options=${H(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${H(["left", "centre", "right"], t.textAlign)}
            @change=${(a) => i({ textAlign: a.target.value })}>
          </uui-select>
        </label>

        <div class="pair">
          <di-number-field
            .min=${y.lineSpacing.min}
            .max=${y.lineSpacing.max}
            label="Line spacing"
            suffix="×"
            step="0.05"
            .value=${t.lineSpacing}
            @change=${(a) => i({ lineSpacing: a.detail.value ?? 1 })}>
          </di-number-field>
          <di-number-field
            .min=${y.letterSpacing.min}
            .max=${y.letterSpacing.max}
            label="Letter spacing"
            .value=${t.letterSpacing}
            @change=${(a) => i({ letterSpacing: a.detail.value ?? 0 })}>
          </di-number-field>
        </div>

        <div class="pair">
          <di-number-field
            .min=${y.maxLines.min}
            .max=${y.maxLines.max}
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
              .options=${H(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${H(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
Hl = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${ic(t.kind)}
            @change=${(a) => h(this, d, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${h(this, d, pi).call(
    this,
    t.propertyAlias ?? "",
    (a) => h(this, d, b).call(this, { source: { ...t, propertyAlias: a } }),
    // The root widens from media to media + content, and the media filter moves to the
    // tail: that is exactly the author.mainImage case, and it never offers a text
    // property as an image source.
    { root: ["media", "content"], tail: "media" }
  )}
            </label>` : p}

        ${t.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => h(this, d, b).call(this, {
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
            .options=${H(["cover", "contain", "stretch"], e.fit)}
            @change=${(a) => h(this, d, b).call(this, { fit: a.target.value })}>
          </uui-select>
        </label>

        <di-number-field
          .min=${y.cornerRadius.min}
          .max=${y.cornerRadius.max}
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => h(this, d, b).call(this, { cornerRadius: a.detail.value ?? 0 })}>
        </di-number-field>

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              .min=${y.borderWidth.min}
              .max=${y.borderWidth.max}
              label="Width"
              .value=${((i = e.border) == null ? void 0 : i.width) ?? 0}
              @change=${(a) => {
    var n;
    const s = a.detail.value ?? 0;
    h(this, d, b).call(this, {
      border: s > 0 ? { width: s, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => h(this, d, b).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : p}
          </div>
        </label>
      </uui-box>
    `;
};
Yl = function(e) {
  const t = (s) => h(this, d, b).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, d, b).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, d, b).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, d, pi).call(this, e.itemsPropertyAlias, (s) => h(this, d, b).call(this, { itemsPropertyAlias: s }))}
        </label>

        <div class="pair">
          <di-number-field
            .min=${y.maxItems.min}
            .max=${y.maxItems.max}
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => h(this, d, b).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            .min=${y.gap.min}
            .max=${y.gap.max}
            label="Gap"
            .value=${e.gap}
            @change=${(s) => h(this, d, b).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${e.direction}
            .options=${H(["horizontal", "vertical"], e.direction)}
            @change=${(s) => h(this, d, b).call(this, { direction: s.target.value })}>
          </uui-select>
        </label>

        ${e.direction === "horizontal" ? r`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => h(this, d, b).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </label>

              ${e.wrap ? r`
                    <di-number-field
                      .min=${y.rowGap.min}
                      .max=${y.rowGap.max}
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => h(this, d, b).call(this, { rowGap: s.detail.value ?? 20 })}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  ` : p}
            ` : p}

        <div class="pair">
          <di-number-field
            .min=${y.circleSize.min}
            .max=${y.circleSize.max}
            label="Circle size"
            .value=${e.badge.size}
            @change=${(s) => t({ size: s.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
            .min=${y.iconSize.min}
            .max=${y.iconSize.max}
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
              .min=${y.borderWidth.min}
              .max=${y.borderWidth.max}
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
            .options=${H(["below", "right", "none"], e.label.position, {
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
                  .options=${h(this, d, Pn).call(this, e.label.fontKey)}
                  @change=${(s) => i({ fontKey: s.target.value })}>
                </uui-select>
              </label>

              <div class="pair">
                <di-number-field
                  .min=${y.labelSize.min}
                  .max=${y.labelSize.max}
                  label="Label size"
                  .value=${e.label.fontSize}
                  @change=${(s) => i({ fontSize: s.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
                  .min=${y.labelGap.min}
                  .max=${y.labelGap.max}
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
                  .options=${H(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
Xl = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${H(["rectangle", "ellipse", "polygon", "star"], t)}
            @change=${(s) => h(this, d, b).call(this, { shape: s.target.value })}>
          </uui-select>
        </label>

        ${t === "polygon" || t === "star" ? r`
              <div class="pair">
                <di-number-field
                  label=${t === "star" ? "Points" : "Sides"}
                  suffix=""
                  .min=${y.sides.min}
                  .max=${y.sides.max}
                  .value=${e.sides ?? 5}
                  @change=${(s) => h(this, d, b).call(this, { sides: Math.round(s.detail.value ?? 5) })}>
                </di-number-field>
                ${t === "star" ? r`<di-number-field
                      label="Inner ratio"
                      suffix=""
                      step="0.05"
                      .min=${y.innerRatio.min}
                      .max=${y.innerRatio.max}
                      .value=${e.innerRatio ?? 0.5}
                      @change=${(s) => h(this, d, b).call(this, { innerRatio: s.detail.value ?? 0.5 })}>
                    </di-number-field>` : p}
              </div>
            ` : p}

        <label class="field inline">
          <span>Fill</span>
          <uui-toggle
            ?checked=${i}
            @change=${(s) => h(this, d, b).call(this, { fill: s.target.checked ? "#000000" : null })}>
          </uui-toggle>
        </label>

        ${i ? r`<label class="field">
              <span>Fill colour</span>
              <di-colour-input
                label="Fill colour"
                .value=${e.fill ?? "#000000"}
                @change=${(s) => h(this, d, b).call(this, { fill: s.detail.value })}>
              </di-colour-input>
            </label>` : p}

        <label class="field inline">
          <span>Gradient</span>
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(s) => h(this, d, b).call(this, {
    gradient: s.target.checked ? sr() : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? h(this, d, On).call(this, e.gradient, (s) => h(this, d, b).call(this, { gradient: s })) : p}

        ${t === "rectangle" ? r`<di-number-field
            .min=${y.cornerRadius.min}
            .max=${y.cornerRadius.max}
              label="Corner radius"
              .value=${e.cornerRadius}
              @change=${(s) => h(this, d, b).call(this, { cornerRadius: s.detail.value ?? 0 })}>
            </di-number-field>` : p}

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              .min=${y.borderWidth.min}
              .max=${y.borderWidth.max}
              label="Width"
              .value=${((a = e.border) == null ? void 0 : a.width) ?? 0}
              @change=${(s) => {
    var o;
    const n = s.detail.value ?? 0;
    h(this, d, b).call(this, {
      border: n > 0 ? { width: n, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(s) => h(this, d, b).call(this, { border: { ...e.border, colour: s.detail.value } })}>
                </di-colour-input>` : p}
          </div>
          <small class="hint">Drawn inside the box. Turn Fill off for an outline only.</small>
        </label>
      </uui-box>
    `;
};
Jl = function(e) {
  const t = Ie(e.position, "x"), i = Ie(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, d, Xs).call(this, e, "x")} ${h(this, d, Xs).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, d, Ql).call(this, e, s.detail.value)}>
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
            @change=${(s) => h(this, d, b).call(this, { rotation: or(s.detail.value ?? 0) })}>
          </di-number-field>
          <small class="hint">Clockwise, around the anchor point. Drag the handle above the selection on the canvas; hold Shift for 15° steps.</small>
        </div>

        <div class="pair">
          <di-number-field
            .min=${y.width.min}
            .max=${y.width.max}
            label="Width"
            placeholder="Auto"
            .value=${e.size.width ?? null}
            @change=${(s) => h(this, d, b).call(this, { size: { ...e.size, width: s.detail.value } })}>
          </di-number-field>
          <di-number-field
            .min=${y.height.min}
            .max=${y.height.max}
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(s) => h(this, d, b).call(this, { size: { ...e.size, height: s.detail.value } })}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
Xs = function(e, t) {
  const i = Ie(e.position, t), a = Pa(e.position, t), s = this.template.layers.filter((o) => o.key !== e.key), n = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(o) => h(this, d, Zl).call(this, e, t, o.target.value)}>
          </uui-select>
          ${!i && s.length === 0 ? r`<small class="hint">Add another layer to position this one against it.</small>` : p}
        </label>

        ${i && a ? r`
              <label class="field">
                <span>Tracks</span>
                <div class="row">
                  <uui-select
                    .value=${a.layerKey}
                    .options=${s.map((o) => ({
    name: o.name || o.type,
    value: o.key,
    selected: o.key === a.layerKey
  }))}
                    @change=${(o) => h(this, d, xa).call(this, e, t, { layerKey: o.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${H(n, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(o) => h(this, d, xa).call(this, e, t, { edge: o.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${y.referenceGap.min}
                .max=${y.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(o) => h(this, d, xa).call(this, e, t, { gap: o.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? y.x.min : y.y.min}
                .max=${t === "x" ? y.x.max : y.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(o) => h(this, d, b).call(this, {
    position: { ...e.position, [t]: o.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
Zl = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Ie(e.position, t)) return;
  const a = this.template.layers.findIndex((n) => n.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((n) => n.key !== e.key);
  s && h(this, d, b).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: hd
      }
    }
  });
};
xa = function(e, t, i) {
  const a = Pa(e.position, t);
  a && h(this, d, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Ql = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? cd(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, d, b).call(this, { position: s });
};
ec = function(e) {
  return r`
      <uui-box headline="Behaviour">
        <label class="field inline">
          <span>Visible</span>
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => h(this, d, b).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </label>

        <label class="field inline">
          <span>Locked</span>
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => h(this, d, b).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </label>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          .min=${y.opacity.min}
          .max=${y.opacity.max}
          .value=${e.opacity}
          @change=${(t) => h(this, d, b).call(this, { opacity: t.detail.value ?? 1 })}>
        </di-number-field>

        <label class="field">
          <span>Show this layer</span>
          <uui-select
            .value=${e.visibility.rule}
            .options=${H(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
    always: "Always",
    whenNotEmpty: "When it has a value",
    whenPropertyTruthy: "When another property is set"
  })}
            @change=${(t) => h(this, d, b).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </label>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<label class="field">
              <span>Controlled by</span>
              ${h(this, d, pi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, d, b).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
pi = function(e, t, i = {}) {
  const { root: a, tail: s } = up(e), n = this.linkedProperties[a] ?? [], o = this.properties.some(
    (m) => m.alias === a && m.classification === "content"
  ), l = !!a && (o || !!s), u = h(this, d, Js).call(this, Io(this.properties, i.root), a, (m) => t(m));
  return l ? r`
      <div class="path">
        ${u}
        <span class="path-hop" aria-hidden="true">›</span>
        ${h(this, d, Js).call(this, Io(n, i.tail), s, (m) => t(dp(a, m)))}
      </div>
    ` : u;
};
Js = function(e, t, i) {
  const a = [
    { name: "- none -", value: "" },
    ...e.map((s) => ({
      name: `${s.name} (${s.alias})`,
      value: s.alias,
      selected: s.alias === t
    }))
  ];
  return t && !e.some((s) => s.alias === t) && a.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), r`
      <uui-select
        .value=${t}
        .options=${a}
        @change=${(s) => i(s.target.value)}>
      </uui-select>
    `;
};
Pn = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
tc = function(e, t, i) {
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
    const n = s.target.value, o = a.styles.find((l) => l.name === n);
    i(n, o == null ? void 0 : o.size, o == null ? void 0 : o.fontStyle);
  }}>
        </uui-select>
      </label>
    `;
};
ht.styles = P`
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

    .path {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: var(--uui-size-space-1);
    }

    .path-hop {
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
hi([
  g({ type: Object })
], ht.prototype, "template", 2);
hi([
  g({ type: Object })
], ht.prototype, "layer", 2);
hi([
  g({ type: Array })
], ht.prototype, "properties", 2);
hi([
  g({ type: Object })
], ht.prototype, "linkedProperties", 2);
hi([
  g({ type: Array })
], ht.prototype, "fonts", 2);
ht = hi([
  A("di-layer-inspector")
], ht);
function H(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function ic(e) {
  return H(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var Sp = Object.defineProperty, Dp = Object.getOwnPropertyDescriptor, ac = (e) => {
  throw TypeError(e);
}, ia = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dp(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Sp(t, i, s), s;
}, Cp = (e, t, i) => t.has(e) || ac("Cannot " + i), Ip = (e, t, i) => t.has(e) ? ac("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ke = (e, t, i) => (Cp(e, t, "access private method"), i), pe, wt, sc, nc, oc, rc;
const Op = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let Lt = class extends L {
  constructor() {
    super(...arguments), Ip(this, pe), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${ke(this, pe, oc)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : X(
      e,
      (t) => t.key,
      (t, i) => ke(this, pe, rc).call(this, t, i)
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
pe = /* @__PURE__ */ new WeakSet();
wt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
sc = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
nc = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
oc = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  ke(this, pe, wt).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
rc = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => ke(this, pe, sc).call(this, a, e.key)}
        @dragover=${(a) => ke(this, pe, nc).call(this, a, t)}
        @click=${() => ke(this, pe, wt).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Op[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, pe, wt).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, pe, wt).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, pe, wt).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ke(this, pe, wt).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
Lt.styles = P`
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
ia([
  g({ type: Array })
], Lt.prototype, "layers", 2);
ia([
  g({ type: String })
], Lt.prototype, "selectedLayerKey", 2);
ia([
  f()
], Lt.prototype, "_dragKey", 2);
ia([
  f()
], Lt.prototype, "_dropIndex", 2);
Lt = ia([
  A("di-layers-panel")
], Lt);
var Pp = Object.defineProperty, Ap = Object.getOwnPropertyDescriptor, lc = (e) => {
  throw TypeError(e);
}, Ge = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ap(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Pp(t, i, s), s;
}, An = (e, t, i) => t.has(e) || lc("Cannot " + i), Mp = (e, t, i) => (An(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Oo = (e, t, i) => t.has(e) ? lc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Rp = (e, t, i, a) => (An(e, t, "write to private field"), t.set(e, i), i), te = (e, t, i) => (An(e, t, "access private method"), i), j, Le, Ka, cc, uc, Ei;
let we = class extends L {
  constructor() {
    super(...arguments), Oo(this, j), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, Oo(this, Ka, 100);
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
            @click=${() => te(this, j, Le).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${Wa.min * 100}
            .max=${Wa.max * 100}
            .value=${te(this, j, cc).call(this)}
            @change=${te(this, j, uc)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => te(this, j, Le).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => te(this, j, Le).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${te(this, j, Ei).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${te(this, j, Ei).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${te(this, j, Ei).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${te(this, j, Ei).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => te(this, j, Le).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => te(this, j, Le).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => te(this, j, Le).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
j = /* @__PURE__ */ new WeakSet();
Le = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Ka = /* @__PURE__ */ new WeakMap();
cc = function() {
  return this.matches(":focus-within") || Rp(this, Ka, Math.round(this.effectiveScale * 100)), Mp(this, Ka);
};
uc = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && te(this, j, Le).call(this, "di-zoom-change", { zoom: t / 100 });
};
Ei = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => te(this, j, Le).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
we.styles = P`
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
Ge([
  g({ type: Number })
], we.prototype, "effectiveScale", 2);
Ge([
  g({ type: Boolean })
], we.prototype, "snapEnabled", 2);
Ge([
  g({ type: Boolean })
], we.prototype, "showRulers", 2);
Ge([
  g({ type: Boolean })
], we.prototype, "showSafeArea", 2);
Ge([
  g({ type: Boolean })
], we.prototype, "showMeasured", 2);
Ge([
  g({ type: Boolean })
], we.prototype, "canUndo", 2);
Ge([
  g({ type: Boolean })
], we.prototype, "canRedo", 2);
Ge([
  g({ type: Boolean })
], we.prototype, "previewing", 2);
we = Ge([
  A("di-canvas-toolbar")
], we);
var Lp = Object.defineProperty, zp = Object.getOwnPropertyDescriptor, dc = (e) => {
  throw TypeError(e);
}, Mn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zp(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Lp(t, i, s), s;
}, Rn = (e, t, i) => t.has(e) || dc("Cannot " + i), Wt = (e, t, i) => (Rn(e, t, "read from private field"), t.get(e)), ha = (e, t, i) => t.has(e) ? dc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Zs = (e, t, i, a) => (Rn(e, t, "write to private field"), t.set(e, i), i), Po = (e, t, i) => (Rn(e, t, "access private method"), i), ci, ka, Pi, Ta, hc, pc;
let Bi = class extends L {
  constructor() {
    super(), ha(this, Ta), ha(this, ci), this._selection = [], ha(this, ka, ""), ha(this, Pi), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(pt, (e) => {
      Zs(this, ci, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== Wt(this, ka) && (Zs(this, ka, i), Po(this, Ta, hc).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
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
          @change=${Po(this, Ta, pc)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
ci = /* @__PURE__ */ new WeakMap();
ka = /* @__PURE__ */ new WeakMap();
Pi = /* @__PURE__ */ new WeakMap();
Ta = /* @__PURE__ */ new WeakSet();
hc = async function(e) {
  if (!Wt(this, ci)) return;
  Wt(this, Pi) ?? Zs(this, Pi, Ho(Wt(this, ci).getToken).catch(() => []));
  const t = await Wt(this, Pi), i = new Set(e), a = t.filter((s) => i.has(s.alias)).map((s) => s.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
pc = function(e) {
  var i;
  const t = e.target.selection;
  (i = Wt(this, ci)) == null || i.setSampleContentKey(t[0]);
};
Bi.styles = P`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
Mn([
  f()
], Bi.prototype, "_selection", 2);
Mn([
  f()
], Bi.prototype, "_allowedContentTypeIds", 2);
Bi = Mn([
  A("di-preview-content-picker")
], Bi);
var Fp = Object.defineProperty, Up = Object.getOwnPropertyDescriptor, mc = (e) => {
  throw TypeError(e);
}, aa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Up(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Fp(t, i, s), s;
}, Ln = (e, t, i) => t.has(e) || mc("Cannot " + i), q = (e, t, i) => (Ln(e, t, "read from private field"), t.get(e)), ft = (e, t, i) => t.has(e) ? mc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ot = (e, t, i, a) => (Ln(e, t, "write to private field"), t.set(e, i), i), Ue = (e, t, i) => (Ln(e, t, "access private method"), i), et, jt, Vt, Pt, ja, Va, ge, zn, Ea, Fn, Qs;
const Wp = 400;
let zt = class extends L {
  constructor() {
    super(), ft(this, ge), ft(this, et), ft(this, jt), ft(this, Vt), ft(this, Pt), ft(this, ja), ft(this, Va, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(pt, (e) => {
      Ot(this, et, e), e && (this.observe(e.template, (t) => {
        t && Ue(this, ge, Ea).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Ot(this, ja, t);
        const i = (a = q(this, et)) == null ? void 0 : a.getData();
        i && Ue(this, ge, Ea).call(this, i);
      }), this.observe(e.useSampleData, (t) => {
        Ot(this, Va, t ?? !0);
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
    const e = (t = q(this, et)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(q(this, jt)), this._collapsed = !1, Ue(this, ge, Fn).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(q(this, jt)), (e = q(this, Vt)) == null || e.abort(), Ue(this, ge, zn).call(this);
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
        const t = (e = q(this, et)) == null ? void 0 : e.getData();
        t && Ue(this, ge, Ea).call(this, t);
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
et = /* @__PURE__ */ new WeakMap();
jt = /* @__PURE__ */ new WeakMap();
Vt = /* @__PURE__ */ new WeakMap();
Pt = /* @__PURE__ */ new WeakMap();
ja = /* @__PURE__ */ new WeakMap();
Va = /* @__PURE__ */ new WeakMap();
ge = /* @__PURE__ */ new WeakSet();
zn = function() {
  q(this, Pt) && (URL.revokeObjectURL(q(this, Pt)), Ot(this, Pt, void 0));
};
Ea = function(e) {
  this._collapsed || (window.clearTimeout(q(this, jt)), Ot(this, jt, window.setTimeout(() => void Ue(this, ge, Fn).call(this, e), Wp)));
};
Fn = async function(e) {
  var t;
  if (q(this, et)) {
    (t = q(this, Vt)) == null || t.abort(), Ot(this, Vt, new AbortController()), Ue(this, ge, Qs).call(this, !0), this._error = void 0;
    try {
      const i = await Yo(
        e,
        {
          signal: q(this, Vt).signal,
          contentKey: q(this, ja),
          useSampleData: q(this, Va)
        },
        q(this, et).getToken
      );
      Ue(this, ge, zn).call(this), Ot(this, Pt, URL.createObjectURL(i)), this._url = q(this, Pt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ue(this, ge, Qs).call(this, !1);
    }
  }
};
Qs = function(e) {
  this._loading = e, this.dispatchEvent(new CustomEvent("di-preview-state", { bubbles: !0, composed: !0, detail: { busy: e } }));
};
zt.styles = P`
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
      ${_n}
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
aa([
  f()
], zt.prototype, "_url", 2);
aa([
  f()
], zt.prototype, "_loading", 2);
aa([
  f()
], zt.prototype, "_error", 2);
aa([
  f()
], zt.prototype, "_collapsed", 2);
zt = aa([
  A("di-preview-strip")
], zt);
var Np = Object.defineProperty, Bp = Object.getOwnPropertyDescriptor, fc = (e) => {
  throw TypeError(e);
}, B = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bp(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Np(t, i, s), s;
}, Un = (e, t, i) => t.has(e) || fc("Cannot " + i), v = (e, t, i) => (Un(e, t, "read from private field"), i ? i.call(e) : t.get(e)), yt = (e, t, i) => t.has(e) ? fc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ai = (e, t, i, a) => (Un(e, t, "write to private field"), t.set(e, i), i), J = (e, t, i) => (Un(e, t, "access private method"), i), k, Ki, ji, Vi, qt, z, en, Wn, yc, gc, tn, vc, bc, _c, an, wc, $c, xc, kc, Nn, Tc, Sa;
const Kp = 400;
let F = class extends L {
  constructor() {
    super(), yt(this, z), yt(this, k), yt(this, Ki), yt(this, ji), yt(this, Vi), yt(this, qt), this._properties = [], this._linkedProperties = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, yt(this, Sa, (e) => {
      var n;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = v(this, k);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = v(this, z, en);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), J(this, z, tn).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const o = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -o : e.key === "ArrowRight" ? o : 0, u = e.key === "ArrowUp" ? -o : e.key === "ArrowDown" ? o : 0, m = Ie(s.position, "x") ? 0 : l, S = Ie(s.position, "y") ? 0 : u;
            if (m === 0 && S === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + m, y: s.position.y + S }
            });
            break;
          }
          case "[":
          case "]": {
            const o = ((n = this._template) == null ? void 0 : n.layers.findIndex((l) => l.key === s.key)) ?? -1;
            if (o < 0) return;
            e.preventDefault(), i.moveLayer(s.key, e.key === "]" ? o + 1 : o - 1);
            break;
          }
        }
      }
    }), this.consumeContext(jo, (e) => {
      Ai(this, Ki, e);
    }), this.consumeContext(he, (e) => {
      Ai(this, ji, e);
    }), this.consumeContext(pt, (e) => {
      Ai(this, k, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (J(this, z, vc).call(this, t), J(this, z, bc).call(this, t), J(this, z, _c).call(this));
      }), this.observe(e.selectedLayerKey, (t) => {
        this._selectedKey = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
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
    super.connectedCallback(), window.addEventListener("keydown", v(this, Sa));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", v(this, Sa)), window.clearTimeout(v(this, Vi)), (e = v(this, qt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => J(this, z, tn).call(this, e.detail.key)}
        @di-layer-detach=${(e) => J(this, z, gc).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = v(this, k)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = v(this, k)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = v(this, k)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => J(this, z, an).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => J(this, z, an).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-pick-base-image=${J(this, z, xc)}
        @di-pick-layer-image=${(e) => J(this, z, kc).call(this, e.detail.key)}
        @di-use-image-size=${J(this, z, Tc)}
        @di-request-preview=${() => {
      var e;
      return (e = v(this, z, yc)) == null ? void 0 : e.refresh();
    }}
        @di-preview-state=${(e) => {
      this._previewing = e.detail.busy;
    }}
        @di-scale-change=${(e) => {
      this._effectiveScale = e.detail.scale;
    }}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(Wa.min, Math.min(Wa.max, e.detail.zoom));
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
      return (e = v(this, k)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = v(this, k)) == null ? void 0 : e.redo();
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
            .layer=${v(this, z, en)}
            .properties=${this._properties}
            .linkedProperties=${this._linkedProperties}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    ` : r`<div class="state"><uui-loader></uui-loader></div>`;
  }
};
k = /* @__PURE__ */ new WeakMap();
Ki = /* @__PURE__ */ new WeakMap();
ji = /* @__PURE__ */ new WeakMap();
Vi = /* @__PURE__ */ new WeakMap();
qt = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakSet();
en = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
Wn = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
yc = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
gc = function(e, t) {
  var s, n, o;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (n = v(this, z, Wn)) == null ? void 0 : n.resolvedPositionOf(e);
  (o = v(this, k)) == null || o.updateLayer(e, { position: ks(i.position, t, a) });
};
tn = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const n of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const o = (a = v(this, z, Wn)) == null ? void 0 : a.resolvedPositionOf(n.key);
    o && t.set(n.key, o);
  }
  (s = v(this, k)) == null || s.removeLayer(e, t);
};
vc = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && v(this, k) && await zr(t, v(this, k).getToken);
};
bc = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !v(this, k)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Jo(t.mediaKey, v(this, k).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
_c = function() {
  window.clearTimeout(v(this, Vi)), Ai(this, Vi, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !v(this, k))) {
      (t = v(this, qt)) == null || t.abort(), Ai(this, qt, new AbortController());
      try {
        const i = await Xo(
          e,
          { signal: v(this, qt).signal, useSampleData: !0 },
          v(this, k).getToken
        );
        v(this, k).setServerBounds(i.layers), v(this, k).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, Kp));
};
an = function(e, t, i, a) {
  const s = this._template;
  if (!s || !v(this, k)) return;
  const n = { template: s, x: t, y: i, defaultFontKey: J(this, z, $c).call(this) };
  if (e.kind === "property") {
    const l = od(e.property, n);
    if (l.kind === "condition") {
      J(this, z, wc).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    v(this, k).addLayer(l.layer);
    return;
  }
  const o = e.layerType === "image" ? ir(n, "Image") : e.layerType === "badges" ? ar(n, "Badges", "") : e.layerType === "rect" ? sd(n, "Shape", e.shape) : tr(n, "Text", { kind: "static", text: "Text" });
  v(this, k).addLayer(o);
};
wc = function(e, t, i) {
  var n, o, l, u;
  const a = i ?? this._selectedKey, s = (n = this._template) == null ? void 0 : n.layers.find((m) => m.key === a);
  if (!s) {
    (o = v(this, ji)) == null || o.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = v(this, k)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (u = v(this, ji)) == null || u.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
$c = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
xc = async function() {
  var t;
  const e = await J(this, z, Nn).call(this);
  e && ((t = v(this, k)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
kc = async function(e) {
  var i;
  const t = await J(this, z, Nn).call(this);
  t && ((i = v(this, k)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
Nn = async function() {
  if (!v(this, Ki)) return;
  const e = v(this, Ki).open(this, fu, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
Tc = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !v(this, k)) return;
  const t = await Jo(e.mediaKey, v(this, k).getToken).catch(() => {
  });
  t && v(this, k).updateCanvas({ width: t.width, height: t.height });
};
Sa = /* @__PURE__ */ new WeakMap();
F.styles = P`
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
], F.prototype, "_template", 2);
B([
  f()
], F.prototype, "_selectedKey", 2);
B([
  f()
], F.prototype, "_properties", 2);
B([
  f()
], F.prototype, "_linkedProperties", 2);
B([
  f()
], F.prototype, "_fonts", 2);
B([
  f()
], F.prototype, "_serverBounds", 2);
B([
  f()
], F.prototype, "_baseImageUrl", 2);
B([
  f()
], F.prototype, "_zoom", 2);
B([
  f()
], F.prototype, "_effectiveScale", 2);
B([
  f()
], F.prototype, "_previewing", 2);
B([
  f()
], F.prototype, "_snapEnabled", 2);
B([
  f()
], F.prototype, "_showRulers", 2);
B([
  f()
], F.prototype, "_showSafeArea", 2);
B([
  f()
], F.prototype, "_showMeasured", 2);
B([
  f()
], F.prototype, "_canUndo", 2);
B([
  f()
], F.prototype, "_canRedo", 2);
F = B([
  A("di-design-view")
], F);
const jp = F, Vp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return F;
  },
  default: jp
}, Symbol.toStringTag, { value: "Module" }));
var qp = Object.defineProperty, Gp = Object.getOwnPropertyDescriptor, Ec = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gp(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && qp(t, i, s), s;
}, Bn = (e, t, i) => t.has(e) || Ec("Cannot " + i), Q = (e, t, i) => (Bn(e, t, "read from private field"), t.get(e)), bi = (e, t, i) => t.has(e) ? Ec("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), qi = (e, t, i, a) => (Bn(e, t, "write to private field"), t.set(e, i), i), Je = (e, t, i) => (Bn(e, t, "access private method"), i), De, Gi, Gt, At, xe, Kn, Da, Sc, Dc, Cc;
let ue = class extends L {
  constructor() {
    super(), bi(this, xe), bi(this, De), bi(this, Gi), bi(this, Gt), bi(this, At), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(he, (e) => {
      qi(this, Gi, e);
    }), this.consumeContext(pt, (e) => {
      qi(this, De, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, Je(this, xe, Da).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), Je(this, xe, Da).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Q(this, Gt)) == null || e.abort(), Je(this, xe, Kn).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => Je(this, xe, Da).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${Je(this, xe, Dc)}>
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
                ${X(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => Je(this, xe, Cc).call(this, e)
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
                @click=${Je(this, xe, Sc)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
De = /* @__PURE__ */ new WeakMap();
Gi = /* @__PURE__ */ new WeakMap();
Gt = /* @__PURE__ */ new WeakMap();
At = /* @__PURE__ */ new WeakMap();
xe = /* @__PURE__ */ new WeakSet();
Kn = function() {
  Q(this, At) && (URL.revokeObjectURL(Q(this, At)), qi(this, At, void 0));
};
Da = async function() {
  var i;
  const e = this._template;
  if (!e || !Q(this, De)) return;
  (i = Q(this, Gt)) == null || i.abort(), qi(this, Gt, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: Q(this, Gt).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, s] = await Promise.all([
      Yo(e, t, Q(this, De).getToken),
      Xo(e, t, Q(this, De).getToken)
    ]);
    Je(this, xe, Kn).call(this), qi(this, At, URL.createObjectURL(a)), this._url = Q(this, At), this._bounds = s.layers, this._skipped = s.skipped ?? [], Q(this, De).setServerBounds(s.layers), Q(this, De).setIssues(s.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Sc = async function() {
  var e, t;
  if (!(!this._contentKey || !Q(this, De))) {
    this._regenerating = !0;
    try {
      const i = await ln(this._contentKey, Q(this, De).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = Q(this, Gi)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = Q(this, Gi)) == null || t.peek("danger", {
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
Dc = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Cc = function(e) {
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
ue.styles = P`
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
      ${_n}
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
He([
  f()
], ue.prototype, "_template", 2);
He([
  f()
], ue.prototype, "_contentKey", 2);
He([
  f()
], ue.prototype, "_bounds", 2);
He([
  f()
], ue.prototype, "_skipped", 2);
He([
  f()
], ue.prototype, "_url", 2);
He([
  f()
], ue.prototype, "_loading", 2);
He([
  f()
], ue.prototype, "_error", 2);
He([
  f()
], ue.prototype, "_regenerating", 2);
ue = He([
  A("di-preview-view")
], ue);
const Hp = ue, Yp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return ue;
  },
  default: Hp
}, Symbol.toStringTag, { value: "Module" }));
var Xp = Object.defineProperty, Jp = Object.getOwnPropertyDescriptor, Ic = (e) => {
  throw TypeError(e);
}, sa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jp(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && Xp(t, i, s), s;
}, jn = (e, t, i) => t.has(e) || Ic("Cannot " + i), G = (e, t, i) => (jn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ao = (e, t, i) => t.has(e) ? Ic("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Zp = (e, t, i, a) => (jn(e, t, "write to private field"), t.set(e, i), i), Nt = (e, t, i) => (jn(e, t, "access private method"), i), ie, le, Oc, Pc, qa, Ac, Mc, Rc, Lc, zc, Fc;
let Ke = class extends L {
  constructor() {
    super(), Ao(this, le), Ao(this, ie), this._properties = [], this._showAdvanced = !1, this.consumeContext(pt, (e) => {
      Zp(this, ie, e), e && (Ho(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${Nt(this, le, Rc).call(this)} ${Nt(this, le, Lc).call(this)} ${Nt(this, le, zc).call(this)} ${Nt(this, le, Fc).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
ie = /* @__PURE__ */ new WeakMap();
le = /* @__PURE__ */ new WeakSet();
Oc = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Pc = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
qa = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
Ac = async function(e) {
  var s, n;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((o) => [o.key, o.alias])), a = [
    ...t.map((o) => i.get(o)).filter((o) => !!o),
    ...G(this, le, qa)
  ].filter((o, l, u) => u.indexOf(o) === l);
  (s = G(this, ie)) == null || s.updateTemplateFields({ docTypeAliases: a }), await ((n = G(this, ie)) == null ? void 0 : n.reloadProperties());
};
Mc = function(e) {
  var i;
  const t = e.target.selection;
  (i = G(this, ie)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
Rc = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? r`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${G(this, le, Pc)}
                  @change=${Nt(this, le, Ac)}></umb-input-document-type>` : r`<uui-loader-bar></uui-loader-bar>`}
            ${G(this, le, qa).length > 0 ? r`<p class="note">
                  Also targets ${G(this, le, qa).join(", ")}, which no document type has any more.
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
    ...G(this, le, Oc).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = G(this, ie)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = G(this, ie)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Lc = function() {
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
            @change=${Nt(this, le, Mc)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = G(this, ie)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = G(this, ie)) == null ? void 0 : i.updateOutput({
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
    return (i = G(this, ie)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
zc = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = G(this, ie)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = G(this, ie)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Fc = function() {
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
    return (i = G(this, ie)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
Ke.styles = P`
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
sa([
  f()
], Ke.prototype, "_template", 2);
sa([
  f()
], Ke.prototype, "_properties", 2);
sa([
  f()
], Ke.prototype, "_showAdvanced", 2);
sa([
  f()
], Ke.prototype, "_documentTypes", 2);
Ke = sa([
  A("di-settings-view")
], Ke);
const Qp = Ke, em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return Ke;
  },
  default: Qp
}, Symbol.toStringTag, { value: "Module" }));
var tm = Object.defineProperty, im = Object.getOwnPropertyDescriptor, Uc = (e) => {
  throw TypeError(e);
}, na = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? im(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && tm(t, i, s), s;
}, Vn = (e, t, i) => t.has(e) || Uc("Cannot " + i), Mo = (e, t, i) => (Vn(e, t, "read from private field"), t.get(e)), Ro = (e, t, i) => t.has(e) ? Uc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), am = (e, t, i, a) => (Vn(e, t, "write to private field"), t.set(e, i), i), Lo = (e, t, i) => (Vn(e, t, "access private method"), i), Hi, Ca, sn;
let je = class extends L {
  constructor() {
    super(), Ro(this, Ca), Ro(this, Hi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(pt, (e) => {
      am(this, Hi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Lo(this, Ca, sn).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Lo(this, Ca, sn).call(this)}>Reload</uui-button>
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
              ${X(
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
Hi = /* @__PURE__ */ new WeakMap();
Ca = /* @__PURE__ */ new WeakSet();
sn = async function() {
  const e = this._template;
  if (!(!e || !Mo(this, Hi))) {
    this._loading = !0;
    try {
      this._usage = await Ju(e.key, Mo(this, Hi).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
je.styles = P`
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
na([
  f()
], je.prototype, "_template", 2);
na([
  f()
], je.prototype, "_usage", 2);
na([
  f()
], je.prototype, "_loading", 2);
na([
  f()
], je.prototype, "_onlyMissing", 2);
je = na([
  A("di-usage-view")
], je);
const sm = je, nm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return je;
  },
  default: sm
}, Symbol.toStringTag, { value: "Module" })), om = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: ws,
  default: ws
}, Symbol.toStringTag, { value: "Module" }));
var nt, Ct;
class gs extends Jc {
  constructor(i, a) {
    super(i, a);
    x(this, nt);
    x(this, Ct);
    this.consumeContext(he, (s) => {
      _(this, nt, s);
    }), this.consumeContext(pt, (s) => {
      _(this, Ct, s);
    });
  }
  async execute() {
    var s, n, o;
    const i = c(this, Ct), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, nt)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await on(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await Zo(a.key, !1, i.getToken);
        (n = c(this, nt)) == null || n.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await xr(l, i.getToken, c(this, nt));
      } catch (l) {
        (o = c(this, nt)) == null || o.peek("danger", {
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
    c(this, Ct) && await Xu(i, c(this, Ct).getToken);
  }
}
nt = new WeakMap(), Ct = new WeakMap();
const rm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: gs,
  api: gs,
  default: gs
}, Symbol.toStringTag, { value: "Module" }));
var Xi, ai;
class vs extends Ya {
  constructor(i, a) {
    super(i, a);
    x(this, Xi);
    x(this, ai);
    this.consumeContext(Pe, (s) => {
      _(this, Xi, s);
    }), this.consumeContext(he, (s) => {
      _(this, ai, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const n = await ln(i, () => {
          var l;
          return (l = c(this, Xi)) == null ? void 0 : l.getLatestToken();
        }), o = n.outcome === "generated" || n.outcome === "generateddraft";
        (a = c(this, ai)) == null || a.peek(o ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: o ? n.message ?? "The image has been regenerated." : n.message ?? n.outcome
          }
        });
      } catch (n) {
        const o = n instanceof ct && n.status === 404;
        (s = c(this, ai)) == null || s.peek(o ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: n instanceof ct ? n.detail ?? n.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Xi = new WeakMap(), ai = new WeakMap();
const lm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: vs,
  api: vs,
  default: vs
}, Symbol.toStringTag, { value: "Module" }));
var Ji, It, Zi, si;
class bs extends vu {
  constructor(i, a) {
    super(i, a);
    x(this, Ji);
    x(this, It);
    x(this, Zi);
    x(this, si);
    this.consumeContext(Pe, (s) => {
      _(this, Ji, s);
    }), this.consumeContext(he, (s) => {
      _(this, It, s);
    }), this.consumeContext(bu, (s) => {
      _(this, Zi, s);
    }), this.consumeContext(_u, (s) => {
      _(this, si, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, n;
    if (!c(this, si)) {
      (i = c(this, It)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const o = await ln(c(this, si), () => {
        var l;
        return (l = c(this, Ji)) == null ? void 0 : l.getLatestToken();
      });
      o.propertyValue && ((a = c(this, Zi)) == null || a.setValue(JSON.parse(o.propertyValue))), (s = c(this, It)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: o.message ?? "The image has been regenerated."
        }
      });
    } catch (o) {
      const l = o instanceof ct && o.status === 404;
      (n = c(this, It)) == null || n.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: o instanceof ct ? o.detail ?? o.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Ji = new WeakMap(), It = new WeakMap(), Zi = new WeakMap(), si = new WeakMap();
const cm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: bs,
  api: bs,
  default: bs
}, Symbol.toStringTag, { value: "Module" }));
var um = Object.defineProperty, dm = Object.getOwnPropertyDescriptor, Wc = (e) => {
  throw TypeError(e);
}, Ye = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? dm(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (a ? o(t, i, s) : o(s)) || s);
  return a && s && um(t, i, s), s;
}, qn = (e, t, i) => t.has(e) || Wc("Cannot " + i), ui = (e, t, i) => (qn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), _s = (e, t, i) => t.has(e) ? Wc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hm = (e, t, i, a) => (qn(e, t, "write to private field"), t.set(e, i), i), $t = (e, t, i) => (qn(e, t, "access private method"), i), Ia, oa, me, Nc, Bc, Kc, Gn, jc, Vc, qc, Gc;
const pm = [100, 200, 300, 400, 500, 600, 700, 800, 900], mm = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let de = class extends Ko {
  constructor() {
    super(), _s(this, me), _s(this, Ia), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", _s(this, oa, () => {
      var e;
      return (e = ui(this, Ia)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Pe, (e) => {
      hm(this, Ia, e);
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
            @change=${$t(this, me, Nc)}>
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
            @click=${$t(this, me, Kc)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${mm.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? $t(this, me, Gc).call(this) : $t(this, me, qc).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !ui(this, me, Gn)}
            @click=${$t(this, me, jc)}>
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
Ia = /* @__PURE__ */ new WeakMap();
oa = /* @__PURE__ */ new WeakMap();
me = /* @__PURE__ */ new WeakSet();
Nc = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  $t(this, me, Bc).call(this, t);
};
Bc = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await Wu(t, ui(this, oa));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Kc = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await Nu(this._path.trim(), ui(this, oa)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Gn = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
jc = async function() {
  if (ui(this, me, Gn)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await Bu(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        ui(this, oa)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
Vc = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
qc = function() {
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
        ${X(
    pm,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => $t(this, me, Vc).call(this, e, t.target.checked)}>
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
Gc = function() {
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
de.styles = P`
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
Ye([
  f()
], de.prototype, "_busy", 2);
Ye([
  f()
], de.prototype, "_error", 2);
Ye([
  f()
], de.prototype, "_path", 2);
Ye([
  f()
], de.prototype, "_provider", 2);
Ye([
  f()
], de.prototype, "_family", 2);
Ye([
  f()
], de.prototype, "_weights", 2);
Ye([
  f()
], de.prototype, "_italic", 2);
Ye([
  f()
], de.prototype, "_url", 2);
de = Ye([
  A("di-font-upload-modal")
], de);
const fm = de, ym = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return de;
  },
  default: fm
}, Symbol.toStringTag, { value: "Module" }));
var gm = Object.getOwnPropertyDescriptor, vm = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gm(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = o(s) || s);
  return s;
};
let Ga = class extends L {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Ga = vm([
  A("di-template-folder-editor")
], Ga);
const bm = Ga, _m = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Ga;
  },
  default: bm
}, Symbol.toStringTag, { value: "Module" }));
export {
  Md as manifests,
  Hm as onInit
};
//# sourceMappingURL=dynamic-images.js.map
