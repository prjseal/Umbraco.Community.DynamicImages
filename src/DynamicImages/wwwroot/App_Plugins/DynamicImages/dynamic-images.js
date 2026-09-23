var en = (e) => {
  throw TypeError(e);
};
var ds = (e, t, i) => t.has(e) || en("Cannot " + i);
var c = (e, t, i) => (ds(e, t, "read from private field"), i ? i.call(e) : t.get(e)), x = (e, t, i) => t.has(e) ? en("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _ = (e, t, i, a) => (ds(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), S = (e, t, i) => (ds(e, t, "access private method"), i);
var hs = (e, t, i, a) => ({
  set _(s) {
    _(e, t, s, i);
  },
  get _() {
    return c(e, t, a);
  }
});
import { UmbSubmittableWorkspaceContextBase as tu, UmbEntityWorkspaceDataManager as iu, UmbSubmitWorkspaceAction as Ts, UmbEntityNamedDetailWorkspaceContextBase as au, UmbWorkspaceActionBase as su } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Za, UmbContextConsumerController as ou } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailRepositoryBase as Kn, UmbItemRepositoryBase as nu, UmbItemServerDataSourceBase as ru, UmbRepositoryBase as co } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase as jn, UmbItemStoreBase as lu } from "@umbraco-cms/backoffice/store";
import { UmbId as cu } from "@umbraco-cms/backoffice/id";
import { UMB_BOOLEAN_VALUE_TYPE as uu, UMB_DATE_TIME_VALUE_TYPE as du } from "@umbraco-cms/backoffice/value-type";
import { nothing as p, html as r, css as A, state as m, customElement as M, ifDefined as Ss, property as g, repeat as Z, classMap as Vn, styleMap as N } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as z } from "@umbraco-cms/backoffice/lit-element";
import { UmbTreeServerDataSourceBase as hu, UmbTreeRepositoryBase as pu } from "@umbraco-cms/backoffice/tree";
import { UMB_NOTIFICATION_CONTEXT as fe } from "@umbraco-cms/backoffice/notification";
import { UmbEntityCreateOptionActionBase as mu } from "@umbraco-cms/backoffice/entity-create-option-action";
import { UmbRequestReloadChildrenOfEntityEvent as Gn, UmbRequestReloadStructureForEntityEvent as fu, UmbEntityActionBase as Qa } from "@umbraco-cms/backoffice/entity-action";
import { UMB_AUTH_CONTEXT as Le } from "@umbraco-cms/backoffice/auth";
import { umbOpenModal as qn, UMB_DISCARD_CHANGES_MODAL as yu, umbConfirmModal as uo, UmbModalToken as Hn, UmbModalBaseElement as Yn, UMB_MODAL_MANAGER_CONTEXT as Xn } from "@umbraco-cms/backoffice/modal";
import { UMB_ACTION_EVENT_CONTEXT as Jn } from "@umbraco-cms/backoffice/action";
import "@umbraco-cms/backoffice/external/uui";
import { UMB_ENTITY_CONTEXT as gu } from "@umbraco-cms/backoffice/entity";
import { tryExecute as vu } from "@umbraco-cms/backoffice/resources";
import { UmbDefaultCollectionContext as bu } from "@umbraco-cms/backoffice/collection";
import { UmbSelectedEvent as _u, UmbDeselectedEvent as wu } from "@umbraco-cms/backoffice/event";
import { UMB_MEDIA_PICKER_MODAL as $u } from "@umbraco-cms/backoffice/media";
import "@umbraco-cms/backoffice/document-type";
import { UmbArrayState as _i, UmbStringState as tn, UmbObjectState as an, UmbBooleanState as ha, UmbNumberState as xu } from "@umbraco-cms/backoffice/observable-api";
import { UmbPropertyActionBase as ku } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Tu } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Su } from "@umbraco-cms/backoffice/document";
const es = "dynamic-images", ts = "di-template", Es = "di:templates-changed", Eu = "/umbraco/management/api/v1/dynamic-images";
class dt extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function $(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${Eu}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await Cu(n);
  return n;
}
async function Cu(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new dt(t, e.status, i);
}
const T = async (e) => e.json();
async function Du(e) {
  const t = await $("/templates?take=500", e);
  return (await T(t)).items;
}
const ho = async (e, t) => T(await $(`/templates/${e}`, t)), Iu = async (e, t) => T(await $("/templates", t, { method: "POST", json: e })), Ou = async (e, t) => T(await $(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Pu(e, t) {
  await $(`/templates/${e}`, t, { method: "DELETE" });
}
const Au = async (e, t) => T(await $(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function Mu(e, t) {
  return (await $(`/templates/${e}/export`, t)).blob();
}
const Ru = async (e, t, i, a = null) => T(await $("/templates/import", i, { method: "POST", json: { json: e, mode: t, parentKey: a } }));
function Zn(e, t, i, a) {
  const s = new URLSearchParams({ skip: String(e), take: String(t) });
  return i && s.set("foldersOnly", "true"), a && s.set("parentKey", a), s.toString();
}
const sn = async (e, t, i, a) => T(await $(`/tree/root?${Zn(e, t, i)}`, a)), Lu = async (e, t, i, a, s) => T(await $(`/tree/children?${Zn(t, i, a, e)}`, s)), zu = async (e, t) => T(await $(`/tree/ancestors?descendantKey=${encodeURIComponent(e)}`, t));
async function Qn(e, t) {
  if (e.length === 0) return [];
  const i = new URLSearchParams();
  for (const a of e) i.append("key", a);
  return T(await $(`/item?${i}`, t));
}
async function Fu(e, t) {
  const i = new URLSearchParams({ skip: String(e.skip ?? 0), take: String(e.take ?? 100) });
  return e.parentKey && i.set("parentKey", e.parentKey), e.filter && i.set("filter", e.filter), e.orderBy && i.set("orderBy", e.orderBy), T(await $(`/collection/templates?${i}`, t));
}
async function Uu(e, t, i) {
  return (await $(`/templates/${e}/thumbnail?width=${t}`, i)).blob();
}
const Wu = async (e, t) => T(await $("/folders", t, { method: "POST", json: e })), Nu = async (e, t) => T(await $(`/folders/${e}`, t)), Bu = async (e, t, i) => T(await $(`/folders/${e}`, i, { method: "PUT", json: { name: t } }));
async function Ku(e, t) {
  await $(`/folders/${e}`, t, { method: "DELETE" });
}
async function ju(e, t, i) {
  await $(`/templates/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
async function Vu(e, t, i) {
  await $(`/folders/${e}/move`, i, { method: "PUT", json: { targetKey: t } });
}
const Ra = async (e) => T(await $("/fonts", e));
async function Gu(e, t) {
  const i = new FormData();
  return i.append("file", e), T(await $("/fonts", t, { method: "POST", body: i }));
}
const qu = async (e, t) => T(await $("/fonts/register-path", t, { method: "POST", json: { path: e } })), Hu = async (e, t) => T(await $("/fonts/register-web", t, { method: "POST", json: e })), Yu = async (e, t) => T(await $(`/fonts/${e}/refresh`, t, { method: "POST" })), Xu = async (e, t, i, a, s) => T(await $(`/fonts/${e}`, a, {
  method: "PUT",
  json: { familyName: t, styles: i, weight: (s == null ? void 0 : s.weight) ?? null, isItalic: (s == null ? void 0 : s.isItalic) ?? null }
}));
async function Ju(e, t) {
  await $(`/fonts/${e}`, t, { method: "DELETE" });
}
async function Zu(e, t) {
  return (await $(`/fonts/${e}/file`, t)).arrayBuffer();
}
const er = async (e) => T(await $("/document-types", e)), Qu = async (e, t) => T(await $(`/document-types/${encodeURIComponent(e)}/properties`, t)), ed = async (e, t, i) => T(await $(
  `/document-types/${encodeURIComponent(e)}/properties/${encodeURIComponent(t)}/linked`,
  i
));
async function tr(e, t, i) {
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
const ir = async (e, t, i) => T(await $("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), ar = async (e, t) => T(await $(`/media/${e}/image-info`, t)), po = async (e, t) => T(await $(`/documents/${e}/regenerate`, t, { method: "POST" })), sr = async (e, t, i) => T(await $(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), td = async (e, t) => T(await $(`/jobs/${e}`, t));
async function id(e, t) {
  await $(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const ad = async (e, t) => T(await $(`/templates/${e}/usage`, t)), or = async (e) => T(await $("/health", e)), sd = async (e) => T(await $("/sync/status", e)), od = async (e) => T(await $("/sync/export", e, { method: "POST" })), nd = async (e) => T(await $("/sync/import", e, { method: "POST" }));
function mo(e) {
  const t = `section/${es}/workspace/${ts}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function rd(e) {
  const t = e ? `/parent/${e.entityType}/${e.unique ?? "null"}` : "";
  return new URL(`section/${es}/workspace/${ts}/create${t}`, document.baseURI).pathname;
}
function nr(e, t) {
  const i = t ? `/edit/${t}` : "";
  return new URL(`section/${es}/workspace/${e}${i}`, document.baseURI).pathname;
}
function ld(e) {
  return new URL(`section/${es}/dashboard/${e}`, document.baseURI).pathname;
}
function cd() {
  window.dispatchEvent(new CustomEvent(Es));
}
const is = () => crypto.randomUUID();
function as(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function rr(e, t, i) {
  const { x: a, y: s } = as(e);
  return {
    type: "text",
    key: is(),
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
function lr(e, t, i) {
  const { x: a, y: s } = as(e);
  return {
    type: "image",
    key: is(),
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
function cr(e, t, i) {
  const { x: a, y: s } = as(e);
  return {
    type: "badges",
    key: is(),
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
function ud(e, t = "Shape", i = "rectangle") {
  const { x: a, y: s } = as(e);
  return {
    type: "rect",
    key: is(),
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
function dd(e) {
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
function hd(e, t) {
  if (e.classification === "boolean")
    return { kind: "condition", propertyAlias: e.alias, propertyName: e.name };
  switch (dd(e.classification)) {
    case "image":
      return { kind: "layer", layer: lr(t, e.name, e.alias) };
    case "badges":
      return { kind: "layer", layer: cr(t, e.name, e.alias) };
    default:
      return { kind: "layer", layer: rr(t, e.name, pd(e)) };
  }
}
function pd(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function ur() {
  return { kind: "linear", from: "#000000CC", to: "#00000000", angle: 180, centreX: 0.5, centreY: 0.5 };
}
function md(e) {
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
const dr = [
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
function Ui(e) {
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
function Wi(e) {
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
  return dr[a * 3 + i];
}
function ss(e, t, i) {
  return {
    x: e.x - t * Ui(e.anchor),
    y: e.y - i * Wi(e.anchor)
  };
}
function fo(e, t, i, a, s) {
  return {
    x: e + i * Ui(s),
    y: t + a * Wi(s)
  };
}
function fd(e, t, i, a) {
  const s = ss(e, t, i), o = fo(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function yd(e, t) {
  const i = fo(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
function hr(e) {
  let t = e % 360;
  return t > 180 ? t -= 360 : t <= -180 && (t += 360), t === 0 ? 0 : t;
}
function Kt(e, t, i, a, s) {
  if (s === 0) return { x: e, y: t };
  const o = s * Math.PI / 180, n = Math.cos(o), l = Math.sin(o), u = e - i, f = t - a;
  return { x: i + u * n - f * l, y: a + u * l + f * n };
}
function gd(e, t, i, a, s) {
  return Kt(e, t, i, a, -s);
}
function pr(e, t, i, a) {
  if (a === 0) return e;
  const s = [
    Kt(e.x, e.y, t, i, a),
    Kt(e.x + e.width, e.y, t, i, a),
    Kt(e.x + e.width, e.y + e.height, t, i, a),
    Kt(e.x, e.y + e.height, t, i, a)
  ], o = Math.min(...s.map((f) => f.x)), n = Math.max(...s.map((f) => f.x)), l = Math.min(...s.map((f) => f.y)), u = Math.max(...s.map((f) => f.y));
  return { x: o, y: l, width: n - o, height: u - l };
}
const vd = 10;
function Me(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function mr(e) {
  return !!e.relativeX || !!e.relativeY;
}
function La(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function on(e) {
  return e === "below" || e === "above";
}
function nn(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function bd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function _d(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = nn(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...nn(n.position).map((l) => l.layerKey));
  }
  return !1;
}
function wd(e, t, i) {
  const a = e.position;
  if (!mr(a)) return a;
  if (_d(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = Ui(a.anchor), l = Wi(a.anchor);
  const u = rn(e, a.relativeX, !1, t, i);
  u && (s = u.coordinate, n = u.factor);
  const f = rn(e, a.relativeY, !0, t, i);
  return f && (o = f.coordinate, l = f.factor), { x: s, y: o, anchor: Cs(n, l) };
}
function rn(e, t, i, a, s) {
  if (!t || on(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let n = t.layerKey;
  for (; !o.has(n); ) {
    o.add(n);
    const l = a.get(n);
    if (!l) return;
    const u = s(n);
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
    const f = i ? l.position.relativeY : l.position.relativeX;
    if (!f || on(f.edge) !== i) return;
    n = f.layerKey;
  }
}
function $d(e, t, i) {
  const a = bd(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (l) => {
    const u = s.get(l.key);
    if (u) return u;
    let f;
    o.has(l.key) ? f = { x: l.position.x, y: l.position.y, anchor: l.position.anchor } : (o.add(l.key), f = wd(l, a, (ye) => {
      const ve = a.get(ye);
      return ve && !i(ve) ? n(ve).extent : void 0;
    }), o.delete(l.key));
    const E = t(l), C = ss(f, E.width, E.height), W = { x: C.x, y: C.y, width: E.width, height: E.height }, ne = { position: f, box: W, extent: pr(W, f.x, f.y, l.rotation ?? 0) };
    return s.set(l.key, ne), ne;
  };
  for (const l of e) n(l);
  return s;
}
function Ds(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? Cs(Ui(i.anchor), Wi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? Cs(Ui(e.anchor), Wi(i.anchor)) : e.anchor
  };
}
var le, Ue, De, at;
class xd {
  constructor(t = 100) {
    x(this, le, []);
    x(this, Ue, []);
    x(this, De, 0);
    x(this, at);
    this.limit = t;
  }
  get canUndo() {
    return c(this, le).length > 0;
  }
  get canRedo() {
    return c(this, Ue).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    c(this, De) > 0 || (c(this, le).push(structuredClone(t)), c(this, le).length > this.limit && c(this, le).shift(), _(this, Ue, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    c(this, De) === 0 && _(this, at, structuredClone(t)), hs(this, De)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    c(this, De) !== 0 && (hs(this, De)._--, !(c(this, De) > 0) && (t && c(this, at) !== void 0 && (c(this, le).push(c(this, at)), c(this, le).length > this.limit && c(this, le).shift(), _(this, Ue, [])), _(this, at, void 0)));
  }
  undo(t) {
    const i = c(this, le).pop();
    if (i !== void 0)
      return c(this, Ue).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = c(this, Ue).pop();
    if (i !== void 0)
      return c(this, le).push(structuredClone(t)), i;
  }
  clear() {
    _(this, le, []), _(this, Ue, []), _(this, De, 0), _(this, at, void 0);
  }
}
le = new WeakMap(), Ue = new WeakMap(), De = new WeakMap(), at = new WeakMap();
const Is = 3, kd = (e) => Td(e), ln = (e, t) => e.slice(0, Math.max(0, t)).join("."), Td = (e) => (e ?? "").split(".").map((t) => t.trim()).filter((t) => t.length > 0), Sd = "Page";
function Ed(e) {
  return e.isSystem ? Sd : e.tab ? `${e.tab} › ${e.group}` : e.group;
}
const Nt = (e) => e ?? Number.MAX_SAFE_INTEGER;
function Cd(e) {
  return e.map((t, i) => ({ property: t, index: i })).sort((t, i) => Number(i.property.isSystem) - Number(t.property.isSystem) || Nt(t.property.tabSortOrder) - Nt(i.property.tabSortOrder) || Nt(t.property.groupSortOrder) - Nt(i.property.groupSortOrder) || Nt(t.property.sortOrder) - Nt(i.property.sortOrder) || t.index - i.index).map(({ property: t }) => t);
}
function Dd(e, t) {
  const i = Cd(e).map((a) => ({
    name: a.name,
    value: a.alias,
    group: Ed(a),
    selected: a.alias === t
  }));
  return i.push({ name: "- none -", value: "", selected: !t }), t && !e.some((a) => a.alias === t) && i.push({ name: `${t} (not in this list)`, value: t, selected: !0 }), i;
}
function Id(e, t) {
  return t === "all" || e.length === 0 ? "Property on the linked item" : `Property on the linked ${e.join(" or ")}`;
}
const Od = "DynamicImages.Workspace.Template", Pd = 12, cn = 36;
var Zt, st, kt, Tt, Qt, St, ei, ti, Et, ot, ii, We, ai, si, ce, ea, Ct, Ie, Dt, w, fr, oi, ni, Os, Ps, As, ze, vt, Ms, ga, yr, gr, vr, Rs;
class Ad extends tu {
  constructor(i) {
    super(i, Od);
    x(this, w);
    x(this, Zt);
    x(this, st);
    x(this, kt);
    x(this, Tt);
    x(this, Qt);
    x(this, St);
    x(this, ei);
    x(this, ti);
    x(this, Et);
    x(this, ot);
    x(this, ii);
    x(this, We);
    x(this, ai);
    x(this, si);
    x(this, ce);
    x(this, ea);
    x(this, Ct);
    x(this, Ie);
    x(this, Dt);
    x(this, oi);
    x(this, ni);
    this._data = new iu(this), this.template = this._data.current, _(this, Zt, new _i([], (a) => a.key)), this.layers = c(this, Zt).asObservable(), _(this, st, new tn(void 0)), this.selectedLayerKey = c(this, st).asObservable(), _(this, kt, new _i([], (a) => a.alias)), this.properties = c(this, kt).asObservable(), _(this, Tt, new an({})), this.linkedProperties = c(this, Tt).asObservable(), _(this, Qt, new an({})), this.linkedCaptions = c(this, Qt).asObservable(), _(this, St, new _i([], (a) => a.key)), this.fonts = c(this, St).asObservable(), _(this, ei, new _i([], (a) => a.key)), this.serverBounds = c(this, ei).asObservable(), _(this, ti, new _i([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = c(this, ti).asObservable(), _(this, Et, new tn(void 0)), this.sampleContentKey = c(this, Et).asObservable(), _(this, ot, new ha(!0)), this.useSampleData = c(this, ot).asObservable(), _(this, ii, new xu(1)), this.zoom = c(this, ii).asObservable(), _(this, We, new ha(!0)), this.loading = c(this, We).asObservable(), this.unique = this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.key), _(this, ai, new ha(!1)), this.canUndo = c(this, ai).asObservable(), _(this, si, new ha(!1)), this.canRedo = c(this, si).asObservable(), _(this, ce, new xd()), _(this, Ie, !1), _(this, Dt, !1), this.getHasUnpersistedChanges = () => this._data.getHasUnpersistedChanges(), _(this, oi, async (a) => {
      const s = a.detail;
      if (c(this, Dt) || !(s != null && s.url) || !S(this, w, fr).call(this, s.url) || !this.getHasUnpersistedChanges()) return !0;
      a.preventDefault();
      try {
        return await qn(this, yu), _(this, Dt, !0), window.history.pushState({}, "", s.url instanceof URL ? s.url.href : s.url), !0;
      } catch {
        return !1;
      }
    }), _(this, ni, (a) => {
      this.getHasUnpersistedChanges() && (a.preventDefault(), a.returnValue = "");
    }), this.getToken = () => {
      var a;
      return (a = c(this, ea)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = this._data.getCurrent()) == null ? void 0 : a.key;
    }, this.getData = () => this._data.getCurrent(), this.routes.setRoutes([
      {
        // Create… on a folder in the tree: the same shape as core's create routes, so the new
        // template is saved into the folder it was started from.
        path: "create/parent/:parentEntityType/:parentUnique",
        component: () => Promise.resolve().then(() => ms),
        setup: (a, s) => {
          const o = s.match.params.parentUnique;
          return this.createScaffold(void 0, o && o !== "null" ? o : null);
        }
      },
      {
        path: "create",
        component: () => Promise.resolve().then(() => ms),
        setup: () => this.createScaffold()
      },
      {
        // `:unique` rather than `:key` so this workspace's route reads like every other one in
        // the backoffice, and so anything matching on the conventional param name finds it.
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => ms),
        setup: (a, s) => this.load(s.match.params.unique)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Le, (a) => {
      _(this, ea, a);
    }), this.consumeContext(fe, (a) => {
      _(this, Ct, a);
    }), window.addEventListener("willchangestate", c(this, oi)), window.addEventListener("beforeunload", c(this, ni)), this.observe(this._data.createObservablePartOfCurrent((a) => a == null ? void 0 : a.name), (a) => {
      this.view.setTitle(a || "New template");
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return c(this, Ie);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    c(this, We).setValue(!0), _(this, Ie, !1);
    try {
      const a = await ho(i, this.getToken);
      S(this, w, vt).call(this, a, { resetHistory: !0, persist: !0 }), S(this, w, gr).call(this), this.setIsNew(!1), await S(this, w, Os).call(this, a);
    } catch (a) {
      S(this, w, Rs).call(this, "This template could not be loaded", a);
    } finally {
      c(this, We).setValue(!1);
    }
  }
  async createScaffold(i = "New template", a = null) {
    c(this, We).setValue(!0), _(this, Ie, !0), S(this, w, vt).call(this, { ...md(i), parentKey: a }, { resetHistory: !0, persist: !0 }), this.setIsNew(!0), await S(this, w, Os).call(this, this._data.getCurrent()), c(this, We).setValue(!1);
  }
  async reloadProperties() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = await S(this, w, As).call(this, i.docTypeAliases);
    c(this, kt).setValue(a), c(this, Tt).setValue(await S(this, w, Ps).call(this, i.docTypeAliases, a));
  }
  async reloadFonts() {
    c(this, St).setValue(await Ra(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    S(this, w, ze).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    S(this, w, ze).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    S(this, w, ze).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    S(this, w, ze).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    S(this, w, ze).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    S(this, w, ze).call(this, (s) => ({
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
    S(this, w, ze).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var l, u;
        let n = o.position;
        return ((l = La(n, "x")) == null ? void 0 : l.layerKey) === i && (n = Ds(n, "x", a == null ? void 0 : a.get(o.key))), ((u = La(n, "y")) == null ? void 0 : u.layerKey) === i && (n = Ds(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), c(this, st).getValue() === i && this.selectLayer(void 0);
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
    S(this, w, ze).call(this, (s) => {
      const o = [...s.layers], n = o.findIndex((u) => u.key === i);
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
    c(this, st).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = c(this, st).getValue();
    return i ? (a = this._data.getCurrent()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = this._data.getCurrent();
    i && c(this, ce).begin(i);
  }
  endTransaction(i = !0) {
    c(this, ce).end(i), S(this, w, Ms).call(this);
  }
  undo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ce).undo(i);
    a && S(this, w, vt).call(this, a);
  }
  redo() {
    const i = this._data.getCurrent();
    if (!i) return;
    const a = c(this, ce).redo(i);
    a && S(this, w, vt).call(this, a);
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
    c(this, Et).setValue(i), c(this, ot).setValue(!i), S(this, w, yr).call(this, i);
  }
  setUseSampleData(i) {
    c(this, ot).setValue(i);
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
      const o = c(this, Ie) ? await Iu(i, this.getToken) : await Ou(i, this.getToken);
      S(this, w, vt).call(this, o.template, { resetHistory: !0, persist: !0 });
      const n = c(this, Ie);
      _(this, Ie, !1), this.setIsNew(!1), cd(), await S(this, w, vr).call(this, o.template, n), (a = c(this, Ct)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const l of o.warnings)
        (s = c(this, Ct)) == null || s.peek("warning", { data: { message: l.message } });
      n && window.history.replaceState({}, "", mo(o.template.key));
    } catch (o) {
      throw S(this, w, Rs).call(this, "The template could not be saved", o), o;
    }
  }
  resetState() {
    super.resetState(), this._data.clear(), _(this, Dt, !1);
  }
  destroy() {
    window.removeEventListener("willchangestate", c(this, oi)), window.removeEventListener("beforeunload", c(this, ni)), c(this, ce).clear(), super.destroy();
  }
}
Zt = new WeakMap(), st = new WeakMap(), kt = new WeakMap(), Tt = new WeakMap(), Qt = new WeakMap(), St = new WeakMap(), ei = new WeakMap(), ti = new WeakMap(), Et = new WeakMap(), ot = new WeakMap(), ii = new WeakMap(), We = new WeakMap(), ai = new WeakMap(), si = new WeakMap(), ce = new WeakMap(), ea = new WeakMap(), Ct = new WeakMap(), Ie = new WeakMap(), Dt = new WeakMap(), w = new WeakSet(), /**
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
fr = function(i) {
  return !(i instanceof URL ? i.href : i).includes(this.routes.getActiveLocalPath());
}, oi = new WeakMap(), ni = new WeakMap(), Os = async function(i) {
  const [a, s] = await Promise.all([
    Ra(this.getToken).catch(() => []),
    S(this, w, As).call(this, i.docTypeAliases)
  ]);
  c(this, St).setValue(a), c(this, kt).setValue(s), c(this, Tt).setValue(await S(this, w, Ps).call(this, i.docTypeAliases, s));
}, Ps = async function(i, a) {
  const s = {}, o = {};
  if (i.length === 0) return s;
  let n = a.filter((u) => u.classification === "content").slice(0, Pd).map((u) => u.alias), l = 0;
  for (let u = 1; u <= Is && n.length > 0 && l < cn; u++) {
    const f = n.slice(0, cn - l);
    l += f.length;
    const E = await Promise.all(f.map(async (C) => {
      var vi;
      const W = await Promise.all(
        i.map((j) => ed(j, C, this.getToken).catch(() => null))
      ), ne = /* @__PURE__ */ new Map();
      for (const j of W.flatMap((bi) => (bi == null ? void 0 : bi.properties) ?? []))
        ne.has(j.alias) || ne.set(j.alias, j);
      const ye = W.filter((j) => j !== null), ve = [...new Set(ye.flatMap((j) => j.targetDocTypes.map((bi) => bi.name)))], Wt = ye.some((j) => j.inference === "all") ? "all" : (vi = ye[0]) == null ? void 0 : vi.inference;
      return { prefix: C, properties: [...ne.values()], caption: Id(ve, Wt) };
    }));
    n = [];
    for (const C of E)
      C.properties.length !== 0 && (s[C.prefix] = C.properties, o[C.prefix] = C.caption, u < Is && n.push(...C.properties.filter((W) => W.classification === "content" && !W.isSystem).map((W) => `${C.prefix}.${W.alias}`)));
  }
  return c(this, Qt).setValue(o), s;
}, As = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => Qu(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
ze = function(i, a = !0) {
  const s = this._data.getCurrent();
  if (!s) return;
  a && c(this, ce).push(s);
  const o = i(structuredClone(s));
  S(this, w, vt).call(this, o);
}, /**
 * `persist` marks this template as the saved state too. Both halves get the *same* object, so
 * the JSON comparison behind `getHasUnpersistedChanges()` cannot report a false positive.
 */
vt = function(i, a) {
  a != null && a.resetHistory && c(this, ce).clear(), this._data.setCurrent(i), a != null && a.persist && this._data.setPersisted(i), c(this, Zt).setValue(i.layers), S(this, w, Ms).call(this);
}, Ms = function() {
  c(this, ai).setValue(c(this, ce).canUndo), c(this, si).setValue(c(this, ce).canRedo);
}, ga = function() {
  var i;
  return `di:sample-node:${((i = this._data.getCurrent()) == null ? void 0 : i.key) ?? "new"}`;
}, yr = function(i) {
  try {
    i ? localStorage.setItem(S(this, w, ga).call(this), JSON.stringify({ key: i })) : localStorage.removeItem(S(this, w, ga).call(this));
  } catch {
  }
}, /** Accepts the older remembered shape too, which stored the whole picked item. */
gr = function() {
  let i;
  try {
    const a = localStorage.getItem(S(this, w, ga).call(this));
    i = a ? JSON.parse(a).key : void 0;
  } catch {
    i = void 0;
  }
  c(this, Et).setValue(i), c(this, ot).setValue(!i);
}, vr = async function(i, a) {
  const s = await this.getContext(Jn).catch(() => {
  });
  s && (a ? s.dispatchEvent(new Gn({
    entityType: i.parentKey ? "di-template-folder" : "di-template-root",
    unique: i.parentKey ?? null
  })) : s.dispatchEvent(new fu({ entityType: "di-template", unique: i.key })));
}, Rs = function(i, a) {
  var o;
  const s = a instanceof dt ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = c(this, Ct)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const mt = new Za(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), ui = "di-template-root", ie = "di-template-folder", xe = ts, za = "DynamicImages.Tree.Templates", Pi = "DynamicImages.Repository.TemplateTree", Ai = "DynamicImages.Repository.TemplateFolder", Md = "DynamicImages.Store.TemplateFolder", Fa = "DynamicImages.Workspace.TemplateFolder", br = "DynamicImages.Workspace.TemplateRoot", un = "DynamicImages.Repository.TemplateItem", Rd = "DynamicImages.Store.TemplateItem", dn = "DynamicImages.Repository.TemplateDetail", Ld = "DynamicImages.Store.TemplateDetail", hn = "DynamicImages.Repository.MoveTemplate", pn = "DynamicImages.Repository.MoveTemplateFolder", mn = "DynamicImages.Repository.DuplicateTemplate", _r = "icon-picture", wr = "icon-picture color-grey", $r = "icon-folder", Ls = "DynamicImages.Collection.Templates", fn = "DynamicImages.Repository.TemplateCollection";
async function B(e, t) {
  const i = (async () => {
    const a = await new ou(e, Le).asPromise().catch(() => {
    });
    try {
      return { data: await t(() => a == null ? void 0 : a.getLatestToken()) };
    } catch (s) {
      throw s instanceof dt ? { type: "error", title: s.message, status: s.status, detail: s.detail } : s;
    }
  })();
  return await vu(e, i);
}
var nt;
class zd {
  constructor(t) {
    x(this, nt);
    _(this, nt, t);
  }
  async createScaffold(t) {
    return { data: {
      entityType: ie,
      unique: cu.new(),
      name: "",
      ...t
    } };
  }
  async read(t) {
    if (!t) throw new Error("Unique is missing");
    const { data: i, error: a } = await B(c(this, nt), (s) => Nu(t, s));
    return i ? { data: { entityType: ie, unique: i.key, name: i.name } } : { error: a };
  }
  async create(t, i) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Name is missing");
    const a = t.unique, { error: s } = await B(c(this, nt), (o) => Wu({ key: a, name: t.name, parentKey: i }, o));
    return s ? { error: s } : this.read(a);
  }
  async update(t) {
    if (!t.unique) throw new Error("Unique is missing");
    if (!t.name) throw new Error("Folder name is missing");
    const i = t.unique, { error: a } = await B(c(this, nt), (s) => Bu(i, t.name, s));
    return a ? { error: a } : this.read(i);
  }
  async delete(t) {
    if (!t) throw new Error("Unique is missing");
    return B(c(this, nt), (i) => Ku(t, i));
  }
}
nt = new WeakMap();
const yo = new Za("DiTemplateFolderStore");
class xr extends jn {
  constructor(t) {
    super(t, yo);
  }
}
class yn extends Kn {
  constructor(t) {
    super(t, zd, yo);
  }
}
const Fd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_FOLDER_STORE_CONTEXT: yo,
  DiTemplateFolderRepository: yn,
  DiTemplateFolderStore: xr,
  api: yn
}, Symbol.toStringTag, { value: "Module" })), Ud = [
  {
    type: "repository",
    alias: Ai,
    name: "Dynamic Images Template Folder Repository",
    api: () => Promise.resolve().then(() => Fd)
  },
  {
    type: "store",
    alias: Md,
    name: "Dynamic Images Template Folder Store",
    api: xr
  },
  {
    type: "entityAction",
    kind: "folderUpdate",
    alias: "DynamicImages.EntityAction.TemplateFolder.Rename",
    name: "Rename Dynamic Images Template Folder",
    forEntityTypes: [ie],
    meta: { folderRepositoryAlias: Ai }
  },
  {
    type: "entityAction",
    kind: "folderDelete",
    alias: "DynamicImages.EntityAction.TemplateFolder.Delete",
    name: "Delete Dynamic Images Template Folder",
    forEntityTypes: [ie],
    meta: { folderRepositoryAlias: Ai }
  },
  {
    type: "workspace",
    kind: "routable",
    alias: Fa,
    name: "Dynamic Images Template Folder Workspace",
    api: () => Promise.resolve().then(() => eh),
    meta: { entityType: ie }
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
], Wd = [
  {
    type: "repository",
    alias: Pi,
    name: "Dynamic Images Template Tree Repository",
    api: () => Promise.resolve().then(() => ah)
  },
  {
    type: "tree",
    kind: "default",
    alias: za,
    name: "Dynamic Images Template Tree",
    meta: { repositoryAlias: Pi }
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "DynamicImages.TreeItem.Templates",
    name: "Dynamic Images Template Tree Item",
    forEntityTypes: [ui, ie, xe]
  },
  {
    type: "menuItem",
    kind: "tree",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    weight: 200,
    meta: { label: "Templates", treeAlias: za, menus: ["DynamicImages.Menu"] }
  },
  {
    // Selecting the root shows the collection of everything directly under it (collection/manifests.ts).
    type: "workspace",
    kind: "default",
    alias: br,
    name: "Dynamic Images Templates Root Workspace",
    meta: { entityType: ui, headline: "Templates" }
  },
  ...Ud
], go = new Za("DiTemplateItemStore");
class kr extends lu {
  constructor(t) {
    super(t, go);
  }
}
class Nd extends ru {
  constructor(t) {
    super(t, {
      getItems: (i) => B(t, (a) => Qn(i, a)),
      mapper: (i) => ({
        unique: i.key,
        entityType: i.entityType === "folder" ? ie : xe,
        name: i.name,
        isFolder: i.entityType === "folder",
        isEnabled: i.isEnabled
      })
    });
  }
}
class gn extends nu {
  constructor(t) {
    super(t, Nd, go);
  }
}
const Bd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_ITEM_STORE_CONTEXT: go,
  DiTemplateItemRepository: gn,
  DiTemplateItemStore: kr,
  api: gn
}, Symbol.toStringTag, { value: "Module" })), vo = new Za("DiTemplateDetailStore");
class Tr extends jn {
  constructor(t) {
    super(t, vo);
  }
}
const ps = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });
var ri;
class Kd {
  constructor(t) {
    x(this, ri);
    this.createScaffold = ps, this.create = ps, this.update = ps, _(this, ri, t);
  }
  async read(t) {
    const { data: i, error: a } = await B(c(this, ri), (s) => ho(t, s));
    return i ? { data: { entityType: xe, unique: i.key, name: i.name } } : { error: a };
  }
  delete(t) {
    return B(c(this, ri), (i) => Pu(t, i));
  }
}
ri = new WeakMap();
class vn extends Kn {
  constructor(t) {
    super(t, Kd, vo);
  }
}
const jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DI_TEMPLATE_DETAIL_STORE_CONTEXT: vo,
  DiTemplateDetailRepository: vn,
  DiTemplateDetailStore: Tr,
  api: vn
}, Symbol.toStringTag, { value: "Module" })), wi = [ui, ie], Vd = [
  // ---------------------------------------------------------------- repositories
  {
    type: "repository",
    alias: un,
    name: "Dynamic Images Template Item Repository",
    api: () => Promise.resolve().then(() => Bd)
  },
  {
    type: "itemStore",
    alias: Rd,
    name: "Dynamic Images Template Item Store",
    api: kr
  },
  {
    type: "repository",
    alias: dn,
    name: "Dynamic Images Template Detail Repository",
    api: () => Promise.resolve().then(() => jd)
  },
  {
    type: "store",
    alias: Ld,
    name: "Dynamic Images Template Detail Store",
    api: Tr
  },
  {
    type: "repository",
    alias: hn,
    name: "Dynamic Images Move Template Repository",
    api: () => Promise.resolve().then(() => nh)
  },
  {
    type: "repository",
    alias: pn,
    name: "Dynamic Images Move Template Folder Repository",
    api: () => Promise.resolve().then(() => rh)
  },
  {
    type: "repository",
    alias: mn,
    name: "Dynamic Images Duplicate Template Repository",
    api: () => Promise.resolve().then(() => lh)
  },
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Template.Create",
    name: "Create Dynamic Images Template",
    weight: 1200,
    forEntityTypes: wi,
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: !0, headline: "Create under Templates" }
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Template",
    name: "Dynamic Images Template Create Option",
    weight: 100,
    api: () => Promise.resolve().then(() => ch),
    forEntityTypes: wi,
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
    forEntityTypes: wi,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: !0,
      folderRepositoryAlias: Ai
    }
  },
  // ---------------------------------------------------------------- template
  {
    type: "entityAction",
    kind: "moveTo",
    alias: "DynamicImages.EntityAction.Template.MoveTo",
    name: "Move Dynamic Images Template",
    forEntityTypes: [xe],
    meta: {
      treeRepositoryAlias: Pi,
      moveRepositoryAlias: hn,
      treeAlias: za,
      foldersOnly: !0,
      additionalOptions: !0
    }
  },
  {
    type: "entityAction",
    kind: "duplicate",
    alias: "DynamicImages.EntityAction.Template.Duplicate",
    name: "Duplicate Dynamic Images Template",
    forEntityTypes: [xe],
    meta: {
      icon: "icon-documents",
      label: "Duplicate",
      duplicateRepositoryAlias: mn,
      treeRepositoryAlias: Pi
    }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Export",
    name: "Export Dynamic Images Template",
    api: () => Promise.resolve().then(() => uh),
    forEntityTypes: [xe],
    weight: 500,
    meta: { icon: "icon-download-alt", label: "Export JSON", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.Template.Regenerate",
    name: "Regenerate every image for a Dynamic Images Template",
    api: () => Promise.resolve().then(() => hh),
    forEntityTypes: [xe],
    weight: 400,
    meta: { icon: "icon-sync", label: "Regenerate all", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "delete",
    alias: "DynamicImages.EntityAction.Template.Delete",
    name: "Delete Dynamic Images Template",
    forEntityTypes: [xe],
    meta: {
      itemRepositoryAlias: un,
      detailRepositoryAlias: dn,
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
      treeRepositoryAlias: Pi,
      moveRepositoryAlias: pn,
      treeAlias: za,
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
    api: () => Promise.resolve().then(() => fh),
    forEntityTypes: wi,
    weight: 300,
    meta: { icon: "icon-page-up", label: "Import JSON…", additionalOptions: !0 }
  },
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Template.ReloadChildren",
    name: "Reload Dynamic Images Templates",
    forEntityTypes: wi
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.ImportTemplate",
    name: "Dynamic Images Import Template",
    element: () => Promise.resolve().then(() => wh)
  }
], pa = [{ alias: "Umb.Condition.CollectionAlias", match: Ls }], Gd = [
  {
    type: "repository",
    alias: fn,
    name: "Dynamic Images Template Collection Repository",
    api: () => Promise.resolve().then(() => $h)
  },
  {
    type: "collection",
    kind: "default",
    alias: Ls,
    name: "Dynamic Images Template Collection",
    api: () => Promise.resolve().then(() => xh),
    meta: { repositoryAlias: fn }
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
        { field: "isEnabled", label: "Enabled", valueType: uu },
        { field: "updated", label: "Last updated", valueType: du }
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
    element: () => Promise.resolve().then(() => Eh),
    forEntityTypes: [xe]
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
      collectionAlias: Ls
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        oneOf: [br, Fa]
      }
    ]
  }
], qd = [
  ...Wd,
  ...Vd,
  ...Gd,
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
    element: () => Promise.resolve().then(() => Oh),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Fh),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => Bh),
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
    api: Ad,
    meta: { entityType: ts }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => im),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => nm),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => dm),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => ym),
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
    api: () => Promise.resolve().then(() => gm),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => vm),
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
    api: () => Promise.resolve().then(() => bm),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => _m),
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
    element: () => Promise.resolve().then(() => Em)
  }
], nf = (e, t) => {
  t.registerMany(qd);
};
var Hd = Object.defineProperty, Yd = Object.getOwnPropertyDescriptor, Sr = (e) => {
  throw TypeError(e);
}, bo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Yd(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Hd(t, i, s), s;
}, _o = (e, t, i) => t.has(e) || Sr("Cannot " + i), Xd = (e, t, i) => (_o(e, t, "read from private field"), t.get(e)), bn = (e, t, i) => t.has(e) ? Sr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Jd = (e, t, i, a) => (_o(e, t, "write to private field"), t.set(e, i), i), Zd = (e, t, i) => (_o(e, t, "access private method"), i), Ua, zs, Er;
let Rt = class extends z {
  constructor() {
    super(), bn(this, zs), bn(this, Ua), this._name = "", this._loading = !0, this.consumeContext(mt, (e) => {
      Jd(this, Ua, e), e && (this.observe(e.template, (t) => {
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
            @input=${Zd(this, zs, Er)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
Ua = /* @__PURE__ */ new WeakMap();
zs = /* @__PURE__ */ new WeakSet();
Er = function(e) {
  var i;
  const t = e.target.value;
  (i = Xd(this, Ua)) == null || i.updateTemplateFields({ name: t });
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
bo([
  m()
], Rt.prototype, "_name", 2);
bo([
  m()
], Rt.prototype, "_loading", 2);
Rt = bo([
  M("di-template-editor")
], Rt);
const Qd = Rt, ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return Rt;
  },
  default: Qd
}, Symbol.toStringTag, { value: "Module" }));
class _n extends au {
  constructor(t) {
    super(t, {
      workspaceAlias: Fa,
      entityType: ie,
      detailRepositoryAlias: Ai
    }), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => Promise.resolve().then(() => Om),
        setup: (i, a) => {
          this.load(a.match.params.unique);
        }
      }
    ]);
  }
}
const eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateFolderWorkspaceContext: _n,
  api: _n
}, Symbol.toStringTag, { value: "Module" }));
function fs(e) {
  const t = e.paging;
  return { skip: (t == null ? void 0 : t.skip) ?? e.skip ?? 0, take: (t == null ? void 0 : t.take) ?? e.take ?? 100 };
}
function th(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    parent: {
      unique: e.parentKey,
      entityType: e.parentKey ? ie : ui
    },
    name: e.name,
    entityType: t ? ie : xe,
    hasChildren: e.hasChildren,
    isFolder: t,
    icon: t ? $r : e.isEnabled ? _r : wr,
    isEnabled: e.isEnabled
  };
}
class ih extends hu {
  constructor(t) {
    super(t, {
      getRootItems: (i) => {
        const { skip: a, take: s } = fs(i);
        return B(t, (o) => sn(a, s, i.foldersOnly ?? !1, o));
      },
      getChildrenOf: (i) => {
        if (i.parent.unique === null) {
          const { skip: n, take: l } = fs(i);
          return B(t, (u) => sn(n, l, i.foldersOnly ?? !1, u));
        }
        const a = i.parent.unique, { skip: s, take: o } = fs(i);
        return B(t, (n) => Lu(a, s, o, i.foldersOnly ?? !1, n));
      },
      getAncestorsOf: (i) => B(t, (a) => zu(i.treeItem.unique, a)),
      mapper: th
    });
  }
}
class wn extends pu {
  constructor(t) {
    super(t, ih);
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
const ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateTreeRepository: wn,
  api: wn
}, Symbol.toStringTag, { value: "Module" }));
class Cr extends co {
  async requestMoveTo(t) {
    const { error: i } = await B(this, (a) => this.move(t.unique, t.destination.unique, a));
    if (!i) {
      const a = await this.getContext(fe);
      a == null || a.peek("positive", { data: { message: "Moved" } });
    }
    return { error: i };
  }
}
class sh extends Cr {
  constructor() {
    super(...arguments), this.move = ju;
  }
}
class oh extends Cr {
  constructor() {
    super(...arguments), this.move = Vu;
  }
}
const nh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: sh
}, Symbol.toStringTag, { value: "Module" })), rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: oh
}, Symbol.toStringTag, { value: "Module" }));
class $n extends co {
  async requestDuplicate(t) {
    const { data: i, error: a } = await B(this, (s) => Au(t.unique, s));
    if (i) {
      const s = await this.getContext(fe);
      s == null || s.peek("positive", { data: { message: `'${i.template.name}' created` } });
    }
    return { error: a };
  }
}
const lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiDuplicateTemplateRepository: $n,
  api: $n
}, Symbol.toStringTag, { value: "Module" }));
class xn extends mu {
  async getHref() {
    return rd({ entityType: this.args.entityType, unique: this.args.unique ?? null });
  }
}
const ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiCreateTemplateOptionAction: xn,
  api: xn
}, Symbol.toStringTag, { value: "Module" }));
class kn extends Qa {
  async execute() {
    const t = this.args.unique;
    if (!t) return;
    const { data: i, error: a } = await B(this, async (n) => ({
      blob: await Mu(t, n),
      alias: (await ho(t, n)).alias
    }));
    if (a || !i) throw a ?? new Error("The template could not be exported.");
    const s = URL.createObjectURL(i.blob), o = document.createElement("a");
    o.href = s, o.download = `${i.alias}.json`, o.click(), URL.revokeObjectURL(s);
  }
}
const uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiExportTemplateEntityAction: kn,
  api: kn
}, Symbol.toStringTag, { value: "Module" })), dh = 1500;
async function Dr(e, t, i) {
  let a = e;
  for (; a.status === "queued" || a.status === "running"; ) {
    await new Promise((s) => setTimeout(s, dh));
    try {
      a = await td(a.id, t);
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
class Tn extends Qa {
  async execute() {
    var u;
    const t = this.args.unique;
    if (!t) return;
    const { data: i } = await B(this, (f) => Qn([t], f)), a = ((u = i == null ? void 0 : i[0]) == null ? void 0 : u.name) ?? "this template";
    await uo(this, {
      headline: `Regenerate every image for '${a}'?`,
      content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning"
    });
    const { data: s, error: o } = await B(this, (f) => sr(t, !1, f));
    if (o || !s) throw o ?? new Error("Regeneration could not be started.");
    const n = await this.getContext(fe);
    n == null || n.peek("positive", { data: { message: `Regenerating ${s.total} item(s)…` } });
    const l = await this.getContext(Le);
    await Dr(s, () => l == null ? void 0 : l.getLatestToken(), n);
  }
}
const hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateTemplateEntityAction: Tn,
  api: Tn
}, Symbol.toStringTag, { value: "Module" })), ph = new Hn(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
), mh = new Hn(
  "DynamicImages.Modal.ImportTemplate",
  { modal: { type: "sidebar", size: "small" } }
);
class Sn extends Qa {
  async execute() {
    const { json: t } = await qn(this, mh, { data: {} }), i = this.args.unique ?? null, { data: a, error: s } = await B(this, (l) => Ru(t, "create", l, i));
    if (s || !a) throw s ?? new Error("The template could not be imported.");
    const o = await this.getContext(fe);
    o == null || o.peek("positive", { data: { message: `'${a.template.name}' imported` } });
    for (const l of a.warnings) o == null || o.peek("warning", { data: { message: l.message } });
    const n = await this.getContext(Jn);
    n == null || n.dispatchEvent(new Gn({
      entityType: this.args.entityType,
      unique: this.args.unique
    }));
  }
}
const fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiImportTemplateEntityAction: Sn,
  api: Sn
}, Symbol.toStringTag, { value: "Module" }));
var yh = Object.defineProperty, gh = Object.getOwnPropertyDescriptor, Ir = (e) => {
  throw TypeError(e);
}, Or = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && yh(t, i, s), s;
}, vh = (e, t, i) => t.has(e) || Ir("Cannot " + i), bh = (e, t, i) => t.has(e) ? Ir("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), En = (e, t, i) => (vh(e, t, "access private method"), i), va, Pr, Ar;
let di = class extends Yn {
  constructor() {
    super(...arguments), bh(this, va), this._json = "";
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
              <input type="file" accept=".json,application/json" @change=${En(this, va, Pr)} aria-label="Choose a file" />
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
            @click=${En(this, va, Ar)}></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
va = /* @__PURE__ */ new WeakSet();
Pr = async function(e) {
  var i;
  const t = (i = e.target.files) == null ? void 0 : i[0];
  t && (this._json = await t.text());
};
Ar = function() {
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
Or([
  m()
], di.prototype, "_json", 2);
di = Or([
  M("di-import-template-modal")
], di);
const _h = di, wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiImportTemplateModalElement() {
    return di;
  },
  default: _h
}, Symbol.toStringTag, { value: "Module" }));
function Mr(e) {
  const t = e.entityType === "folder";
  return {
    unique: e.key,
    entityType: t ? ie : xe,
    name: e.name,
    icon: t ? $r : e.isEnabled ? _r : wr,
    isFolder: t,
    docTypes: (e.docTypeAliases ?? []).join(", "),
    targetProperty: e.targetPropertyAlias ?? "",
    canvas: e.canvasWidth && e.canvasHeight ? `${e.canvasWidth} × ${e.canvasHeight}` : "",
    layers: e.layerCount === null ? "" : String(e.layerCount),
    isEnabled: t ? void 0 : e.isEnabled,
    updated: e.updatedUtc ?? void 0
  };
}
class Cn extends co {
  async requestCollection(t = {}) {
    const i = await this.getContext(gu), a = (i == null ? void 0 : i.getUnique()) ?? null, { data: s, error: o } = await B(this, (n) => Fu({ parentKey: a, filter: t.filter, skip: t.skip, take: t.take }, n));
    return s ? { data: { total: s.total, items: s.items.map(Mr) } } : { error: o };
  }
}
const $h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionRepository: Cn,
  api: Cn,
  mapCollectionItem: Mr
}, Symbol.toStringTag, { value: "Module" }));
class Dn extends bu {
  async requestItemHref(t) {
    return t.entityType === ie ? nr(ie, t.unique) : mo(t.unique);
  }
}
const xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiTemplateCollectionContext: Dn,
  api: Dn
}, Symbol.toStringTag, { value: "Module" }));
var kh = Object.defineProperty, Th = Object.getOwnPropertyDescriptor, Rr = (e) => {
  throw TypeError(e);
}, He = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Th(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && kh(t, i, s), s;
}, wo = (e, t, i) => t.has(e) || Rr("Cannot " + i), Wa = (e, t, i) => (wo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ma = (e, t, i) => t.has(e) ? Rr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ba = (e, t, i, a) => (wo(e, t, "write to private field"), t.set(e, i), i), ys = (e, t, i) => (wo(e, t, "access private method"), i), Na, Ti, Ni, Si, Lr, zr, Fr;
const Sh = 400;
let he = class extends z {
  constructor() {
    super(), ma(this, Si), this.selectable = !1, this.selected = !1, this.selectOnly = !1, this.disabled = !1, this._failed = !1, ma(this, Na), ma(this, Ti), ma(this, Ni), this.consumeContext(Le, (e) => {
      ba(this, Na, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), ba(this, Ti, new IntersectionObserver((e) => {
      e.some((t) => t.isIntersecting) && ys(this, Si, Lr).call(this);
    })), Wa(this, Ti).observe(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Wa(this, Ti)) == null || e.disconnect(), this._src && URL.revokeObjectURL(this._src), this._src = void 0, ba(this, Ni, void 0);
  }
  render() {
    return this.item ? r`
      <uui-card-media
        name=${this.item.name}
        detail=${Ss(this.item.docTypes || void 0)}
        href=${Ss(this.href)}
        data-mark="${this.item.entityType}:${this.item.unique}"
        ?selectable=${this.selectable}
        ?select-only=${this.selectOnly}
        ?selected=${this.selected}
        ?disabled=${this.disabled}
        @selected=${ys(this, Si, zr)}
        @deselected=${ys(this, Si, Fr)}>
        ${this._src ? r`<img src=${this._src} alt=${this.item.name} />` : r`<umb-icon name=${this._failed ? "icon-picture" : this.item.icon}></umb-icon>`}
        ${this.item.isEnabled === !1 ? r`<uui-tag slot="tag" look="secondary">Disabled</uui-tag>` : p}
        <slot name="actions" slot="actions"></slot>
      </uui-card-media>
    ` : p;
  }
};
Na = /* @__PURE__ */ new WeakMap();
Ti = /* @__PURE__ */ new WeakMap();
Ni = /* @__PURE__ */ new WeakMap();
Si = /* @__PURE__ */ new WeakSet();
Lr = async function() {
  const e = this.item, t = e ? `${e.unique}:${e.updated ?? ""}` : void 0;
  if (!(!e || e.isFolder || !t || Wa(this, Ni) === t)) {
    ba(this, Ni, t);
    try {
      const i = await Uu(e.unique, Sh, () => {
        var a;
        return (a = Wa(this, Na)) == null ? void 0 : a.getLatestToken();
      });
      this._src && URL.revokeObjectURL(this._src), this._src = URL.createObjectURL(i), this._failed = !1;
    } catch {
      this._failed = !0;
    }
  }
};
zr = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new _u(this.item.unique)));
};
Fr = function(e) {
  this.item && (e.stopPropagation(), this.dispatchEvent(new wu(this.item.unique)));
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
He([
  g({ type: Object })
], he.prototype, "item", 2);
He([
  g({ type: Boolean })
], he.prototype, "selectable", 2);
He([
  g({ type: Boolean })
], he.prototype, "selected", 2);
He([
  g({ type: Boolean, attribute: "select-only" })
], he.prototype, "selectOnly", 2);
He([
  g({ type: Boolean })
], he.prototype, "disabled", 2);
He([
  g({ type: String })
], he.prototype, "href", 2);
He([
  m()
], he.prototype, "_src", 2);
He([
  m()
], he.prototype, "_failed", 2);
he = He([
  M("di-template-collection-card")
], he);
const Eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateCollectionCardElement() {
    return he;
  },
  get element() {
    return he;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Ch = Object.defineProperty, Dh = Object.getOwnPropertyDescriptor, Ur = (e) => {
  throw TypeError(e);
}, sa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ch(t, i, s), s;
}, $o = (e, t, i) => t.has(e) || Ur("Cannot " + i), lt = (e, t, i) => ($o(e, t, "read from private field"), t.get(e)), $i = (e, t, i) => t.has(e) ? Ur("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), In = (e, t, i, a) => ($o(e, t, "write to private field"), t.set(e, i), i), Be = (e, t, i) => ($o(e, t, "access private method"), i), Ei, Ba, _a, Mi, ke, Fs, Wr, Nr, Ci, Br;
let Ke = class extends z {
  constructor() {
    super(), $i(this, ke), $i(this, Ei), $i(this, Ba), this._templates = [], this._fonts = [], this._loading = !0, $i(this, _a, () => {
      lt(this, Ei) && Be(this, ke, Fs).call(this);
    }), $i(this, Mi, () => {
      var e;
      return (e = lt(this, Ei)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(fe, (e) => {
      In(this, Ba, e);
    }), this.consumeContext(Le, (e) => {
      In(this, Ei, e), e && Be(this, ke, Fs).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Es, lt(this, _a));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Es, lt(this, _a));
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${Be(this, ke, Nr).call(this)} ${Be(this, ke, Br).call(this)}
      </umb-body-layout>
    `;
  }
};
Ei = /* @__PURE__ */ new WeakMap();
Ba = /* @__PURE__ */ new WeakMap();
_a = /* @__PURE__ */ new WeakMap();
Mi = /* @__PURE__ */ new WeakMap();
ke = /* @__PURE__ */ new WeakSet();
Fs = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Du(lt(this, Mi)),
      Ra(lt(this, Mi)).catch(() => []),
      or(lt(this, Mi)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    Be(this, ke, Wr).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Wr = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = lt(this, Ba)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Nr = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${Be(this, ke, Ci).call(this, "Templates", this._templates.length, "icon-brush", !1, nr(ui))}
        ${Be(this, ke, Ci).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${Be(this, ke, Ci).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${Be(this, ke, Ci).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
Ci = function(e, t, i, a = !1, s) {
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
Br = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${Z(
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
        <uui-button look="secondary" href=${ld("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
Ke.styles = A`
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
  m()
], Ke.prototype, "_templates", 2);
sa([
  m()
], Ke.prototype, "_fonts", 2);
sa([
  m()
], Ke.prototype, "_health", 2);
sa([
  m()
], Ke.prototype, "_loading", 2);
Ke = sa([
  M("di-overview-dashboard")
], Ke);
const Ih = Ke, Oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return Ke;
  },
  default: Ih
}, Symbol.toStringTag, { value: "Module" })), Us = /* @__PURE__ */ new Map(), os = (e) => `di-${e}`;
function Ph(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = Us.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await Zu(e, t), o = new FontFace(os(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return Us.set(e, a), a;
}
async function Kr(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => Ph(a, t)));
}
function jr(e) {
  Us.delete(e);
}
var Ah = Object.defineProperty, Mh = Object.getOwnPropertyDescriptor, Vr = (e) => {
  throw TypeError(e);
}, ns = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ah(t, i, s), s;
}, xo = (e, t, i) => t.has(e) || Vr("Cannot " + i), Ae = (e, t, i) => (xo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), xi = (e, t, i) => t.has(e) ? Vr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), gs = (e, t, i, a) => (xo(e, t, "write to private field"), t.set(e, i), i), L = (e, t, i) => (xo(e, t, "access private method"), i), wa, Bi, Ki, Lt, P, Gr, yi, ht, Ws, qr, Hr, $a, Yr, Xr, Jr;
function Rh(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : Lh(e.sourceUrl);
    default:
      return "Media library";
  }
}
function Lh(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let pt = class extends z {
  constructor() {
    super(), xi(this, P), xi(this, wa), xi(this, Bi), xi(this, Ki), this._fonts = [], this._loading = !0, xi(this, Lt, () => {
      var e;
      return (e = Ae(this, wa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Xn, (e) => {
      gs(this, Bi, e);
    }), this.consumeContext(fe, (e) => {
      gs(this, Ki, e);
    }), this.consumeContext(Le, (e) => {
      gs(this, wa, e), e && L(this, P, yi).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${L(this, P, Ws)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf, .woff2 or .woff, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${L(this, P, Ws)}>
                  Add your first font
                </uui-button>
              </div>` : r`${Z(this._fonts, (e) => e.key, (e) => L(this, P, Yr).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
wa = /* @__PURE__ */ new WeakMap();
Bi = /* @__PURE__ */ new WeakMap();
Ki = /* @__PURE__ */ new WeakMap();
Lt = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakSet();
Gr = async function() {
  var a;
  await this.updateComplete, await new Promise((s) => requestAnimationFrame(s));
  const e = this.renderRoot.querySelectorAll(".style-name"), t = e[e.length - 1];
  if (!t) return;
  await t.updateComplete, (((a = t.shadowRoot) == null ? void 0 : a.querySelector("input")) ?? t).focus();
};
yi = async function() {
  this._loading = !0;
  try {
    this._fonts = await Ra(Ae(this, Lt)), await Kr(this._fonts.map((e) => e.key), Ae(this, Lt));
  } catch (e) {
    L(this, P, ht).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
ht = function(e, t, i) {
  var s;
  const a = i instanceof dt ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ae(this, Ki)) == null || s.peek(e, { data: { headline: t, message: a } });
};
Ws = async function() {
  var i, a;
  if (!Ae(this, Bi)) return;
  const e = Ae(this, Bi).open(this, ph, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Ae(this, Ki)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await L(this, P, yi).call(this));
};
qr = async function(e) {
  try {
    await Yu(e.key, Ae(this, Lt)), jr(e.key), L(this, P, ht).call(this, "positive", `'${e.familyName}' refreshed`), await L(this, P, yi).call(this);
  } catch (t) {
    L(this, P, ht).call(this, "danger", "That font could not be refreshed", t);
  }
};
Hr = async function(e) {
  await uo(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Ju(e.key, Ae(this, Lt)), jr(e.key), L(this, P, ht).call(this, "positive", `'${e.familyName}' deleted`), await L(this, P, yi).call(this);
  } catch (t) {
    L(this, P, ht).call(this, "danger", "That font could not be deleted", t);
  }
};
$a = async function(e, t, i, a) {
  try {
    await Xu(e.key, t, i, Ae(this, Lt), {
      weight: a == null ? void 0 : a.weight,
      isItalic: a == null ? void 0 : a.isItalic
    }), a != null && a.keepOpen || (this._editingKey = void 0), L(this, P, ht).call(this, "positive", `'${t}' saved`), await L(this, P, yi).call(this), a != null && a.keepOpen && await L(this, P, Gr).call(this);
  } catch (s) {
    L(this, P, ht).call(this, "danger", "The font could not be saved", s);
  }
};
Yr = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${Rh(e)} · weight ${e.weight}
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
                  @click=${() => L(this, P, qr).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => L(this, P, Hr).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${os(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? L(this, P, Jr).call(this, e) : L(this, P, Xr).call(this, e)}
      </div>
    `;
};
Xr = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${Z(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
Jr = function(e) {
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
          ${Z(
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
      t.splice(a, 1), L(this, P, $a).call(this, e, e.familyName, t, { keepOpen: !0 });
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), L(this, P, $a).call(this, e, e.familyName, t, { keepOpen: !0 });
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`), a = this.renderRoot.querySelector(`#weight-${e.key}`), s = this.renderRoot.querySelector(`#italic-${e.key}`);
    L(this, P, $a).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t, {
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
pt.styles = A`
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
  m()
], pt.prototype, "_fonts", 2);
ns([
  m()
], pt.prototype, "_loading", 2);
ns([
  m()
], pt.prototype, "_editingKey", 2);
pt = ns([
  M("di-fonts-dashboard")
], pt);
const zh = pt, Fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return pt;
  },
  default: zh
}, Symbol.toStringTag, { value: "Module" }));
var Uh = Object.defineProperty, Wh = Object.getOwnPropertyDescriptor, Zr = (e) => {
  throw TypeError(e);
}, oa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Wh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Uh(t, i, s), s;
}, ko = (e, t, i) => t.has(e) || Zr("Cannot " + i), et = (e, t, i) => (ko(e, t, "read from private field"), i ? i.call(e) : t.get(e)), fa = (e, t, i) => t.has(e) ? Zr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), On = (e, t, i, a) => (ko(e, t, "write to private field"), t.set(e, i), i), Gt = (e, t, i) => (ko(e, t, "access private method"), i), xa, qt, hi, ct, Ka, Ns, Qr;
let je = class extends z {
  constructor() {
    super(), fa(this, ct), fa(this, xa), fa(this, qt), this._loading = !0, this._busy = !1, fa(this, hi, () => {
      var e;
      return (e = et(this, xa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(fe, (e) => {
      On(this, qt, e);
    }), this.consumeContext(Le, (e) => {
      On(this, xa, e), e && Gt(this, ct, Ka).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Gt(this, ct, Ka).call(this)}>Re-check</uui-button>
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
                ${Z(
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
                        ${a.templateKey ? r`<a href=${mo(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Gt(this, ct, Qr).call(this)}
      </umb-body-layout>
    `;
  }
};
xa = /* @__PURE__ */ new WeakMap();
qt = /* @__PURE__ */ new WeakMap();
hi = /* @__PURE__ */ new WeakMap();
ct = /* @__PURE__ */ new WeakSet();
Ka = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      or(et(this, hi)),
      sd(et(this, hi)).catch(() => {
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
    const s = e === "export" ? await od(et(this, hi)) : await nd(et(this, hi));
    (t = et(this, qt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = et(this, qt)) == null || i.peek("warning", { data: { message: o } });
    await Gt(this, ct, Ka).call(this);
  } catch (s) {
    (a = et(this, qt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Qr = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Gt(this, ct, Ns).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Gt(this, ct, Ns).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
je.styles = A`
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
  m()
], je.prototype, "_health", 2);
oa([
  m()
], je.prototype, "_sync", 2);
oa([
  m()
], je.prototype, "_loading", 2);
oa([
  m()
], je.prototype, "_busy", 2);
je = oa([
  M("di-health-dashboard")
], je);
const Nh = je, Bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return je;
  },
  default: Nh
}, Symbol.toStringTag, { value: "Module" })), el = 3, tl = 12, il = 0.1, al = 0.9;
function Kh(e) {
  return Math.max(el, Math.min(tl, e));
}
function jh(e) {
  return Math.max(il, Math.min(al, e));
}
function Vh(e, t, i) {
  if (e !== "polygon" && e !== "star") return [];
  const a = Kh(t), s = 0.5 * jh(i), o = e === "star" ? a * 2 : a, n = e === "star" ? 180 / a : 360 / a, l = [];
  for (let u = 0; u < o; u++) {
    const f = (-90 + u * n) * Math.PI / 180, E = e === "star" && u % 2 === 1 ? s : 0.5;
    l.push({ x: 0.5 + E * Math.cos(f), y: 0.5 + E * Math.sin(f) });
  }
  return l;
}
function Gh(e, t, i) {
  const a = Vh(e, t, i);
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
  sides: { min: el, max: tl },
  innerRatio: { min: il, max: al }
}, ja = { min: 0.1, max: 4 };
function qh(e, t, i) {
  if (typeof e == "string" && e.trim() === "") return null;
  const a = Number(e);
  if (!Number.isFinite(a)) return;
  let s = a;
  return t !== void 0 && (s = Math.max(t, s)), i !== void 0 && (s = Math.min(i, s)), s;
}
function sl(e) {
  if (e.kind === "radial") {
    const t = Math.round(Pn(e.centreX ?? 0.5) * 100), i = Math.round(Pn(e.centreY ?? 0.5) * 100);
    return `radial-gradient(ellipse farthest-corner at ${t}% ${i}%, ${e.from}, ${e.to})`;
  }
  return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
}
function Pn(e) {
  return Math.min(1, Math.max(0, e));
}
const To = A`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
function Hh(e, t) {
  const i = [], a = t.lockX ? void 0 : An(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Yh(t),
    t.threshold
  ), s = t.lockY ? void 0 : An(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    Xh(t),
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
function Yh(e) {
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
function Xh(e) {
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
function An(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var Jh = Object.defineProperty, Zh = Object.getOwnPropertyDescriptor, ol = (e) => {
  throw TypeError(e);
}, Ye = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zh(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Jh(t, i, s), s;
}, So = (e, t, i) => t.has(e) || ol("Cannot " + i), _e = (e, t, i) => (So(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vs = (e, t, i) => t.has(e) ? ol("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), bs = (e, t, i, a) => (So(e, t, "write to private field"), t.set(e, i), i), V = (e, t, i) => (So(e, t, "access private method"), i), bt, Di, O, rs, Eo, nl, rl, ll, cl, Co, Va, ul, dl, hl, pl, ml, fl, yl, gl, vl;
const Qh = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], _s = 18;
let Te = class extends z {
  constructor() {
    super(...arguments), vs(this, O), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, vs(this, bt), vs(this, Di);
  }
  willUpdate() {
    this._box = V(this, O, nl).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== _e(this, Di) && ((t = _e(this, bt)) == null || t.disconnect(), bs(this, Di, e), e && (_e(this, bt) ?? bs(this, bt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), _e(this, bt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = _e(this, bt)) == null || e.disconnect(), bs(this, Di, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${Vn({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${N({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ..._e(this, O, rl) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity),
      ...V(this, O, Co).call(this, e)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      V(this, O, ul).call(this, t), V(this, O, Va).call(this, t);
    }}>
        ${V(this, O, dl).call(this)}
      </div>

      ${this.selected ? V(this, O, gl).call(this, e) : p}
      ${this.showMeasured && this.measured ? V(this, O, vl).call(this) : p}
    `;
  }
};
bt = /* @__PURE__ */ new WeakMap();
Di = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
rs = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Eo = function() {
  return this.layer.rotation ?? 0;
};
nl = function() {
  var s;
  const e = this.layer, t = e.size.width ?? V(this, O, ll).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? V(this, O, cl).call(this), a = ss(_e(this, O, rs), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
rl = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
ll = function() {
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
cl = function() {
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
Co = function(e) {
  const t = _e(this, O, Eo);
  if (t === 0) return {};
  const i = _e(this, O, rs);
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
ul = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
dl = function() {
  switch (this.layer.type) {
    case "text":
      return V(this, O, hl).call(this);
    case "image":
      return V(this, O, ml).call(this);
    case "badges":
      return V(this, O, fl).call(this);
    default:
      return V(this, O, yl).call(this);
  }
};
hl = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || V(this, O, pl).call(this);
  return r`
      <div
        class="text"
        style=${N({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${os(e.fontKey)}, sans-serif`,
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
pl = function() {
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
ml = function() {
  if (this.layer.type !== "image") return p;
  const e = this.layer.border;
  return r`
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
fl = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, l = s === "horizontal", u = l && o, f = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${N({
    flexDirection: l ? "row" : "column",
    flexWrap: u ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...u ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${Z(
    Array.from({ length: Math.max(1, a) }, (E, C) => C),
    (E) => E,
    () => r`
            <div class=${Vn({ badge: !0, right: f === "right" })}>
              <div
                class="circle"
                style=${N({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${f === "none" ? p : r`<div
                    class="badge-label"
                    style=${N({
      ...f === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${os(t.fontKey)}, sans-serif`,
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
yl = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer, t = e.shape ?? "rectangle", i = e.gradient, a = i ? sl(i) : e.fill ?? "transparent", s = e.border, o = s ? s.width * this.scale : 0;
  if (t === "rectangle" || t === "ellipse")
    return r`
        <div
          class="shape"
          style=${N({
      background: a,
      borderRadius: t === "ellipse" ? "50%" : `${e.cornerRadius * this.scale}px`,
      border: s ? `${o}px solid ${s.colour}` : "none"
    })}>
        </div>
      `;
  const n = Gh(t, e.sides ?? 5, e.innerRatio ?? 0.5) ?? "none";
  return r`
      <div class="shape" style=${N({ clipPath: n, background: s ? s.colour : "transparent" })}>
        <div class="shape-inner" style=${N({ inset: `${o}px`, clipPath: n, background: a })}></div>
      </div>
    `;
};
gl = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = _e(this, O, rs), n = _e(this, O, Eo), l = Me(this.layer.position, "x") || Me(this.layer.position, "y");
  return r`
      <div
        class="chrome"
        style=${N({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px`, ...V(this, O, Co).call(this, e) })}>
        <span
          class="tag"
          style=${N(n !== 0 ? { transform: `rotate(${-n}deg)` } : {})}>
          ${l ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : r`
              ${Z(
    Qh,
    (u) => u,
    (u) => r`
                  <span
                    class="handle ${u}"
                    role="button"
                    tabindex="-1"
                    aria-label="Resize ${u}"
                    @pointerdown=${(f) => V(this, O, Va).call(this, f, u)}>
                  </span>
                `
  )}
              <span class="stalk" style=${N({ height: `${_s}px`, top: `${-_s}px` })}></span>
              <span
                class="handle rotate"
                role="button"
                tabindex="-1"
                aria-label="Rotate"
                title="Drag to rotate - hold Shift for 15° steps"
                style=${N({ top: `${-_s}px` })}
                @pointerdown=${(u) => V(this, O, Va).call(this, u, "rotate")}>
              </span>
            `}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}${n !== 0 ? ` - turns ${n}° here` : ""}"
          style=${N({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
vl = function() {
  const e = this.measured, t = e.rotation ?? 0;
  return r`
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
Te.styles = A`
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
Ye([
  g({ type: Object })
], Te.prototype, "layer", 2);
Ye([
  g({ type: Number })
], Te.prototype, "scale", 2);
Ye([
  g({ type: Boolean, reflect: !0 })
], Te.prototype, "selected", 2);
Ye([
  g({ type: Object })
], Te.prototype, "measured", 2);
Ye([
  g({ type: Boolean })
], Te.prototype, "showMeasured", 2);
Ye([
  g({ type: String })
], Te.prototype, "resolvedText", 2);
Ye([
  g({ attribute: !1 })
], Te.prototype, "resolvedPosition", 2);
Ye([
  m()
], Te.prototype, "_box", 2);
Te = Ye([
  M("di-layer-box")
], Te);
var ep = Object.defineProperty, tp = Object.getOwnPropertyDescriptor, bl = (e) => {
  throw TypeError(e);
}, Do = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? tp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ep(t, i, s), s;
}, ip = (e, t, i) => t.has(e) || bl("Cannot " + i), ap = (e, t, i) => t.has(e) ? bl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), sp = (e, t, i) => (ip(e, t, "access private method"), i), Bs, _l;
let ji = class extends z {
  constructor() {
    super(...arguments), ap(this, Bs), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${Z(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => sp(this, Bs, _l).call(this, e)
    )}`;
  }
};
Bs = /* @__PURE__ */ new WeakSet();
_l = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
ji.styles = A`
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
Do([
  g({ type: Array })
], ji.prototype, "guides", 2);
Do([
  g({ type: Number })
], ji.prototype, "scale", 2);
ji = Do([
  M("di-guides")
], ji);
var op = Object.defineProperty, np = Object.getOwnPropertyDescriptor, wl = (e) => {
  throw TypeError(e);
}, na = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? np(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && op(t, i, s), s;
}, rp = (e, t, i) => t.has(e) || wl("Cannot " + i), lp = (e, t, i) => t.has(e) ? wl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mn = (e, t, i) => (rp(e, t, "access private method"), i), ka, Ks;
let q = class extends z {
  constructor() {
    super(...arguments), lp(this, ka), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    Mn(this, ka, Ks).call(this, "top"), Mn(this, ka, Ks).call(this, "left");
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
ka = /* @__PURE__ */ new WeakSet();
Ks = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : q.thickness) * o, t.height = (e === "top" ? q.thickness : s) * o, t.style.width = `${e === "top" ? s : q.thickness}px`, t.style.height = `${e === "top" ? q.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let l = 0; l <= a; l += 50) {
    const u = Math.round(l * this.scale) + 0.5, f = l % 100 === 0, E = f ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(u, q.thickness - E), i.lineTo(u, q.thickness)) : (i.moveTo(q.thickness - E, u), i.lineTo(q.thickness, u)), i.stroke(), f && l > 0 && (e === "top" ? i.fillText(String(l), u + 2, 9) : (i.save(), i.translate(9, u - 2), i.rotate(-Math.PI / 2), i.fillText(String(l), 0, 0), i.restore()));
  }
};
q.thickness = 20;
q.styles = A`
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
na([
  g({ type: Number })
], q.prototype, "canvasWidth", 2);
na([
  g({ type: Number })
], q.prototype, "canvasHeight", 2);
na([
  g({ type: Number })
], q.prototype, "scale", 2);
na([
  g({ type: Object })
], q.prototype, "pointer", 2);
q = na([
  M("di-rulers")
], q);
var cp = Object.defineProperty, up = Object.getOwnPropertyDescriptor, $l = (e) => {
  throw TypeError(e);
}, oe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? up(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && cp(t, i, s), s;
}, Io = (e, t, i) => t.has(e) || $l("Cannot " + i), R = (e, t, i) => (Io(e, t, "read from private field"), i ? i.call(e) : t.get(e)), re = (e, t, i) => t.has(e) ? $l("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ta = (e, t, i, a) => (Io(e, t, "write to private field"), t.set(e, i), i), I = (e, t, i) => (Io(e, t, "access private method"), i), _t, Ii, ut, D, Oo, js, Vs, ls, Po, Gs, xl, kl, Ao, Tl, Sl, qs, Sa, El, Cl, Bt, Mo, Hs, Ys, Xs, Dl, Js, Zs, Qs, Il;
const dp = 6, Ol = 20, hp = 2, pp = 15, mp = 0.1;
let J = class extends z {
  constructor() {
    super(...arguments), re(this, D), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, re(this, _t), re(this, Ii), re(this, ut, /* @__PURE__ */ new Map()), re(this, qs, (e) => {
      const t = this.template.layers.find((n) => n.key === e.detail.key);
      if (!t || t.isLocked) return;
      const i = I(this, D, Po).call(this, t), a = I(this, D, Gs).call(this, t), s = I(this, D, xl).call(this, t), o = I(this, D, ls).call(this, e.detail.startX, e.detail.startY);
      Ta(this, _t, {
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
    }), re(this, Sa, (e) => {
      var Wt, vi;
      this._pointer = I(this, D, Vs).call(this, e.clientX, e.clientY);
      const t = R(this, _t);
      if (!t) return;
      const i = this.template.layers.find((j) => j.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      if (t.moved = !0, t.handle === "rotate") {
        I(this, D, Cl).call(this, i, t, e);
        return;
      }
      const o = Me(i.position, "x"), n = Me(i.position, "y"), l = t.startRotation;
      if (t.handle && l !== 0) {
        I(this, D, El).call(this, i, t, t.handle, a, s, e.shiftKey, o, n);
        return;
      }
      let u = t.handle ? I(this, D, Mo).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      o && (u = { ...u, x: t.startBox.x, width: (Wt = t.handle) != null && Wt.includes("w") ? t.startBox.width : u.width }), n && (u = { ...u, y: t.startBox.y, height: (vi = t.handle) != null && vi.includes("n") ? t.startBox.height : u.height });
      const f = { x: t.startExtent.x - t.startBox.x, y: t.startExtent.y - t.startBox.y }, E = l !== 0 ? { x: u.x + f.x, y: u.y + f.y, width: t.startExtent.width, height: t.startExtent.height } : u, W = this.snapEnabled && !e.altKey ? Hh(E, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((j) => j.key !== i.key).map((j) => I(this, D, Gs).call(this, j)),
        threshold: dp / this.scale,
        lockX: o,
        lockY: n
      }) : {
        box: {
          ...E,
          x: o ? E.x : Math.round(E.x),
          y: n ? E.y : Math.round(E.y)
        },
        guides: []
      };
      this._guides = W.guides;
      const ne = l !== 0 ? { ...u, x: W.box.x - f.x, y: W.box.y - f.y } : W.box, ye = yd(ne, i.position);
      o && (ye.x = i.position.x), n && (ye.y = i.position.y);
      const ve = { position: ye };
      t.handle && (ve.size = {
        width: Math.max(1, Math.round(ne.width)),
        height: Math.max(1, Math.round(ne.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: ve } })
      );
    }), re(this, Bt, () => {
      if (!R(this, _t)) return;
      const e = R(this, _t).moved;
      Ta(this, _t, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), re(this, Hs, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), re(this, Ys, () => {
      this._dropTarget = !1;
    }), re(this, Xs, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = I(this, D, Vs).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y, targetKey: I(this, D, Dl).call(this, e) }
        })
      );
    }), re(this, Js, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), re(this, Zs, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => mr(t.position)) && this.requestUpdate();
    }), re(this, Qs, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), Ta(this, Ii, new ResizeObserver(() => I(this, D, js).call(this))), R(this, Ii).observe(this), window.addEventListener("pointermove", R(this, Sa)), window.addEventListener("pointerup", R(this, Bt)), window.addEventListener("pointercancel", R(this, Bt));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = R(this, Ii)) == null || e.disconnect(), window.removeEventListener("pointermove", R(this, Sa)), window.removeEventListener("pointerup", R(this, Bt)), window.removeEventListener("pointercancel", R(this, Bt));
  }
  updated(e) {
    I(this, D, js).call(this), e.has("zoom") && I(this, D, Oo).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = R(this, ut).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    I(this, D, kl).call(this);
    const s = this.showRulers ? Ol : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${R(this, Js)}
        @dragover=${R(this, Hs)}
        @dragleave=${R(this, Ys)}
        @drop=${R(this, Xs)}
        @di-layer-drag-start=${R(this, qs)}
        @di-layer-box-resize=${R(this, Zs)}>
        <div
          class="artboard"
          style=${N({
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
            style=${N({
      background: e.backgroundGradient ? sl(e.backgroundGradient) : e.background
    })}
            @pointerdown=${R(this, Qs)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${N({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${Z(
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
                  .resolvedPosition=${(l = R(this, ut).get(o.key)) == null ? void 0 : l.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? I(this, D, Il).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
_t = /* @__PURE__ */ new WeakMap();
Ii = /* @__PURE__ */ new WeakMap();
ut = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakSet();
Oo = function() {
  this.dispatchEvent(
    new CustomEvent("di-scale-change", { bubbles: !0, composed: !0, detail: { scale: this.scale } })
  );
};
js = function() {
  if (!this.template) return;
  const e = 48 + (this.showRulers ? Ol : 0) + hp, t = {
    width: Math.max(1, this.clientWidth - e),
    height: Math.max(1, this.clientHeight - e)
  }, i = Math.min(
    t.width / this.template.canvas.width,
    t.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(i - this._fitScale) > 1e-3 && (this._fitScale = i, I(this, D, Oo).call(this));
};
Vs = function(e, t) {
  const i = I(this, D, ls).call(this, e, t);
  return { x: Math.round(i.x), y: Math.round(i.y) };
};
ls = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return { x: (e - a.left) / this.scale, y: (t - a.top) / this.scale };
};
Po = function(e) {
  const t = R(this, ut).get(e.key);
  if (t) return t.box;
  const i = I(this, D, Ao).call(this, e), a = ss(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Gs = function(e) {
  const t = R(this, ut).get(e.key);
  return t ? t.extent : pr(I(this, D, Po).call(this, e), e.position.x, e.position.y, e.rotation ?? 0);
};
xl = function(e) {
  var t;
  return ((t = R(this, ut).get(e.key)) == null ? void 0 : t.position) ?? e.position;
};
kl = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  Ta(this, ut, $d(
    this.template.layers,
    (i) => I(this, D, Ao).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Ao = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? I(this, D, Tl).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? I(this, D, Sl).call(this, e, i)
  };
};
Tl = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Sl = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
qs = /* @__PURE__ */ new WeakMap();
Sa = /* @__PURE__ */ new WeakMap();
El = function(e, t, i, a, s, o, n, l) {
  const u = t.startRotation, f = t.startPosition, E = gd(a, s, 0, 0, u);
  let C = I(this, D, Mo).call(this, t.startBox, i, E.x, E.y, o);
  n && (C = { ...C, x: t.startBox.x, width: i.includes("w") ? t.startBox.width : C.width }), l && (C = { ...C, y: t.startBox.y, height: i.includes("n") ? t.startBox.height : C.height });
  const W = Math.max(1, Math.round(C.width)), ne = Math.max(1, Math.round(C.height)), ye = fo(C.x, C.y, W, ne, f.anchor), ve = Kt(ye.x, ye.y, f.x, f.y, u), Wt = {
    ...e.position,
    x: n ? e.position.x : Math.round(ve.x),
    y: l ? e.position.y : Math.round(ve.y)
  };
  this._guides = [], this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { position: Wt, size: { width: W, height: ne } } }
    })
  );
};
Cl = function(e, t, i) {
  const a = t.startPosition, s = I(this, D, ls).call(this, i.clientX, i.clientY), n = (Math.atan2(s.y - a.y, s.x - a.x) - t.startAngle) * 180 / Math.PI, l = t.startRotation + n, u = i.shiftKey ? pp : mp, f = hr(Math.round(l / u) * u);
  this._guides = [], f !== (e.rotation ?? 0) && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: e.key, patch: { rotation: f } }
    })
  );
};
Bt = /* @__PURE__ */ new WeakMap();
Mo = function(e, t, i, a, s) {
  let { x: o, y: n, width: l, height: u } = e;
  if (t.includes("w") && (o = e.x + i, l = e.width - i), t.includes("e") && (l = e.width + i), t.includes("n") && (n = e.y + a, u = e.height - a), t.includes("s") && (u = e.height + a), s && e.width > 0 && e.height > 0) {
    const f = e.width / e.height;
    Math.abs(l - e.width) >= Math.abs(u - e.height) ? u = l / f : l = u * f, t.includes("n") && (n = e.y + e.height - u), t.includes("w") && (o = e.x + e.width - l);
  }
  return { x: o, y: n, width: Math.max(4, l), height: Math.max(4, u) };
};
Hs = /* @__PURE__ */ new WeakMap();
Ys = /* @__PURE__ */ new WeakMap();
Xs = /* @__PURE__ */ new WeakMap();
Dl = function(e) {
  const t = e.composedPath().find(
    (i) => i.tagName === "DI-LAYER-BOX"
  );
  return t == null ? void 0 : t.dataset.key;
};
Js = /* @__PURE__ */ new WeakMap();
Zs = /* @__PURE__ */ new WeakMap();
Qs = /* @__PURE__ */ new WeakMap();
Il = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${N({ top: `${i}px`, bottom: `${i}px` })}></div>`;
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
      ${To}
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
oe([
  g({ type: Object })
], J.prototype, "template", 2);
oe([
  g({ type: String })
], J.prototype, "selectedLayerKey", 2);
oe([
  g({ type: Object })
], J.prototype, "baseImageUrl", 2);
oe([
  g({ type: Array })
], J.prototype, "serverBounds", 2);
oe([
  g({ type: Boolean })
], J.prototype, "showMeasured", 2);
oe([
  g({ type: Boolean })
], J.prototype, "snapEnabled", 2);
oe([
  g({ type: Boolean })
], J.prototype, "showRulers", 2);
oe([
  g({ type: Boolean })
], J.prototype, "showSafeArea", 2);
oe([
  g({ type: Number })
], J.prototype, "zoom", 2);
oe([
  m()
], J.prototype, "_fitScale", 2);
oe([
  m()
], J.prototype, "_guides", 2);
oe([
  m()
], J.prototype, "_pointer", 2);
oe([
  m()
], J.prototype, "_dropTarget", 2);
J = oe([
  M("di-designer-canvas")
], J);
var fp = Object.defineProperty, yp = Object.getOwnPropertyDescriptor, Pl = (e) => {
  throw TypeError(e);
}, Ro = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && fp(t, i, s), s;
}, Al = (e, t, i) => t.has(e) || Pl("Cannot " + i), gp = (e, t, i) => (Al(e, t, "read from private field"), i ? i.call(e) : t.get(e)), vp = (e, t, i) => t.has(e) ? Pl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Oe = (e, t, i) => (Al(e, t, "access private method"), i), ue, Ml, Rl, Ll, zl, Fl, wt;
const Rn = {
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
let Vi = class extends z {
  constructor() {
    super(...arguments), vp(this, ue), this.properties = [], this._search = "";
  }
  render() {
    const e = bp(gp(this, ue, Ml));
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

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : Z(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => Oe(this, ue, zl).call(this, t, i)
    )}

        ${Oe(this, ue, Fl).call(this)}
      </div>
    `;
  }
};
ue = /* @__PURE__ */ new WeakSet();
Ml = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
Rl = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
Ll = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
zl = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${Z(
    t,
    (i) => i.alias,
    (i) => Oe(this, ue, wt).call(
      this,
      i.name,
      Rn[i.classification] ?? Rn.other,
      i.classification,
      { kind: "property", property: i },
      // A Yes/No chip does not add a layer, so the button must not claim it does.
      i.classification === "boolean" ? `Use ${i.name} as a show/hide condition` : void 0
    )
  )}
      </div>
    `;
};
Fl = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Oe(this, ue, wt).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Oe(this, ue, wt).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Oe(this, ue, wt).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Oe(this, ue, wt).call(this, "Rectangle", "icon-stop", "other", { kind: "static", layerType: "rect", shape: "rectangle" })}
        ${Oe(this, ue, wt).call(this, "Ellipse", "icon-record", "other", { kind: "static", layerType: "rect", shape: "ellipse" })}
      </div>
    `;
};
wt = function(e, t, i, a, s) {
  const o = s ?? e;
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        title=${o}
        @dragstart=${(n) => Oe(this, ue, Ll).call(this, n, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${o}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label=${s ?? `Add ${e} to the canvas`}
          @click=${() => Oe(this, ue, Rl).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Vi.styles = A`
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
Ro([
  g({ type: Array })
], Vi.prototype, "properties", 2);
Ro([
  m()
], Vi.prototype, "_search", 2);
Vi = Ro([
  M("di-property-palette")
], Vi);
function bp(e) {
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
function _p(e) {
  return e.backgroundGradient ? "gradient" : wp(e.background) ? "transparent" : "colour";
}
function wp(e) {
  if (!e || e.trim() === "") return !0;
  const t = e.trim().replace(/^#/, "");
  return t.length === 8 && t.slice(6).toUpperCase() === "00";
}
function $p(e, t) {
  const i = (e ?? "").trim().replace(/^#/, ""), a = i.length === 3 ? [...i].map((s) => s + s).join("") : i.length === 6 || i.length === 8 ? i.slice(0, 6) : "000000";
  return t === "FF" ? `#${a.toUpperCase()}` : `#${a.toUpperCase()}00`;
}
var xp = Object.defineProperty, kp = Object.getOwnPropertyDescriptor, Ul = (e) => {
  throw TypeError(e);
}, cs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && xp(t, i, s), s;
}, Wl = (e, t, i) => t.has(e) || Ul("Cannot " + i), tt = (e, t, i) => (Wl(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Tp = (e, t, i) => t.has(e) ? Ul("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ri = (e, t, i) => (Wl(e, t, "access private method"), i), ee, Gi, Li, us, Nl, Bl;
let pi = class extends z {
  constructor() {
    super(...arguments), Tp(this, ee), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${tt(this, ee, Gi)};opacity:${tt(this, ee, Li)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => Ri(this, ee, us).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${tt(this, ee, Gi)}
                  @input=${(e) => Ri(this, ee, Nl).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(tt(this, ee, Li))}
                    @input=${(e) => Ri(this, ee, Bl).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(tt(this, ee, Li) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
ee = /* @__PURE__ */ new WeakSet();
Gi = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
Li = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
us = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
Nl = function(e) {
  const t = tt(this, ee, Li);
  Ri(this, ee, us).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${Kl(t)}`);
};
Bl = function(e) {
  Ri(this, ee, us).call(this, e >= 0.999 ? tt(this, ee, Gi).toUpperCase() : `${tt(this, ee, Gi).toUpperCase()}${Kl(e)}`);
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
cs([
  g({ type: String })
], pi.prototype, "value", 2);
cs([
  g({ type: String })
], pi.prototype, "label", 2);
cs([
  m()
], pi.prototype, "_open", 2);
pi = cs([
  M("di-colour-input")
], pi);
const Kl = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Sp = Object.defineProperty, Ep = Object.getOwnPropertyDescriptor, jl = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ep(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Sp(t, i, s), s;
};
const Ln = {
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
let Ga = class extends z {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${Z(
      dr,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${Ln[e]}
              title=${Ln[e]}
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
Ga.styles = A`
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
jl([
  g({ type: String })
], Ga.prototype, "value", 2);
Ga = jl([
  M("di-anchor-picker")
], Ga);
var Cp = Object.defineProperty, Dp = Object.getOwnPropertyDescriptor, Vl = (e) => {
  throw TypeError(e);
}, ft = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Cp(t, i, s), s;
}, Ip = (e, t, i) => t.has(e) || Vl("Cannot " + i), Op = (e, t, i) => t.has(e) ? Vl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pp = (e, t, i) => (Ip(e, t, "access private method"), i), eo, Gl;
let Re = class extends z {
  constructor() {
    super(...arguments), Op(this, eo), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${Pp(this, eo, Gl)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
eo = /* @__PURE__ */ new WeakSet();
Gl = function(e) {
  const t = e.target, i = t.value, a = qh(i, this.min, this.max);
  if (a === void 0) {
    t.value = this.value === null || this.value === void 0 ? "" : String(this.value);
    return;
  }
  const s = a === null ? "" : String(a);
  s !== i && (t.value = s), this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: a } }));
};
Re.styles = A`
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
ft([
  g({ type: Number })
], Re.prototype, "value", 2);
ft([
  g({ type: String })
], Re.prototype, "label", 2);
ft([
  g({ type: String })
], Re.prototype, "suffix", 2);
ft([
  g({ type: Number })
], Re.prototype, "step", 2);
ft([
  g({ type: Number })
], Re.prototype, "min", 2);
ft([
  g({ type: Number })
], Re.prototype, "max", 2);
ft([
  g({ type: String })
], Re.prototype, "placeholder", 2);
Re = ft([
  M("di-number-field")
], Re);
var Ap = Object.defineProperty, Mp = Object.getOwnPropertyDescriptor, ql = (e) => {
  throw TypeError(e);
}, Ut = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ap(t, i, s), s;
}, Rp = (e, t, i) => t.has(e) || ql("Cannot " + i), Lp = (e, t, i) => t.has(e) ? ql("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), h = (e, t, i) => (Rp(e, t, "access private method"), i), d, b, we, Hl, Yl, Xl, Lo, to, Jl, Zl, Ql, ec, tc, ic, ac, io, sc, Ea, oc, nc, zo, gi, rc, Fo, lc;
const zp = (e, t) => {
  if (!t) return e;
  const i = Array.isArray(t) ? t : [t];
  return e.filter((a) => i.includes(a.classification));
};
let Ve = class extends z {
  constructor() {
    super(...arguments), Lp(this, d), this.properties = [], this.linkedProperties = {}, this.linkedCaptions = {}, this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? h(this, d, Jl).call(this, this.layer) : h(this, d, Hl).call(this)}</div>` : p;
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
we = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
Hl = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            .min=${y.width.min}
            .max=${y.width.max}
            label="Width"
            .value=${e.width}
            @change=${(t) => h(this, d, we).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            .min=${y.height.min}
            .max=${y.height.max}
            label="Height"
            .value=${e.height}
            @change=${(t) => h(this, d, we).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        ${h(this, d, Yl).call(this, e)}

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${cc(e.baseImage.kind)}
              @change=${(t) => h(this, d, we).call(this, {
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
                @change=${(t) => h(this, d, we).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${h(this, d, gi).call(this, e.baseImage.propertyAlias ?? "", (t) => h(this, d, we).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), { root: ["media", "content"], tail: "media" })}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${X(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => h(this, d, we).call(this, { baseImageFit: t.target.value })}>
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
Yl = function(e) {
  const t = _p(e);
  return r`
      <label class="field">
        <span>Fill</span>
        <uui-select
          .value=${t}
          .options=${X(["colour", "gradient", "transparent"], t)}
          @change=${(i) => h(this, d, Xl).call(this, e, i.target.value)}>
        </uui-select>
      </label>

      ${t === "colour" ? r`<label class="field">
            <span>Colour</span>
            <di-colour-input
              label="Canvas background"
              .value=${e.background}
              @change=${(i) => h(this, d, we).call(this, { background: i.detail.value })}>
            </di-colour-input>
          </label>` : p}

      ${t === "gradient" && e.backgroundGradient ? h(this, d, Lo).call(this, e.backgroundGradient, (i) => h(this, d, we).call(this, { backgroundGradient: i })) : p}

      ${t === "transparent" ? r`<p class="hint">
            The canvas is transparent. PNG and WebP keep transparency; JPEG does not, and will flatten it.
          </p>` : p}
    `;
};
Xl = function(e, t) {
  if (t === "gradient") {
    h(this, d, we).call(this, { backgroundGradient: e.backgroundGradient ?? ur() });
    return;
  }
  h(this, d, we).call(this, {
    background: $p(e.background, t === "transparent" ? "00" : "FF"),
    backgroundGradient: null
  });
};
Lo = function(e, t) {
  return r`
      <label class="field">
        <span>Type</span>
        <uui-select
          .value=${e.kind}
          .options=${X(["linear", "radial"], e.kind)}
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
            ${h(this, d, to).call(this, "Centre X", e.centreX, (i) => t({ ...e, centreX: i }))}
            ${h(this, d, to).call(this, "Centre Y", e.centreY, (i) => t({ ...e, centreY: i }))}
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
to = function(e, t, i) {
  return r`<di-number-field
      .min=${y.gradientCentre.min * 100}
      .max=${y.gradientCentre.max * 100}
      label=${e}
      suffix="%"
      .value=${Math.round((t ?? 0.5) * 100)}
      @change=${(a) => i((a.detail.value ?? 50) / 100)}>
    </di-number-field>`;
};
Jl = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => h(this, d, b).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? h(this, d, Zl).call(this, e) : p}
      ${e.type === "text" ? h(this, d, Ql).call(this, e) : p}
      ${e.type === "image" ? h(this, d, ec).call(this, e) : p}
      ${e.type === "badges" ? h(this, d, tc).call(this, e) : p}
      ${e.type === "rect" ? h(this, d, ic).call(this, e) : p}
      ${h(this, d, ac).call(this, e)} ${h(this, d, nc).call(this, e)}
    `;
};
Zl = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${X(
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

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? h(this, d, zo).call(this, "Property", h(this, d, gi).call(this, t.propertyAlias ?? "", (i) => h(this, d, b).call(this, { binding: { ...t, propertyAlias: i } }))) : p}

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
Ql = function(e) {
  const t = e.style, i = (a) => h(this, d, b).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${h(this, d, Fo).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${h(this, d, lc).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
              .options=${X(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${X(["left", "centre", "right"], t.textAlign)}
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
              .options=${X(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${X(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
ec = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${cc(t.kind)}
            @change=${(a) => h(this, d, b).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? h(this, d, zo).call(this, "Property", h(this, d, gi).call(
    this,
    t.propertyAlias ?? "",
    (a) => h(this, d, b).call(this, { source: { ...t, propertyAlias: a } }),
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
            .options=${X(["cover", "contain", "stretch"], e.fit)}
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
    var o;
    const s = a.detail.value ?? 0;
    h(this, d, b).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
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
tc = function(e) {
  const t = (s) => h(this, d, b).call(this, { badge: { ...e.badge, ...s } }), i = (s) => h(this, d, b).call(this, { label: { ...e.label, ...s } }), a = (s) => h(this, d, b).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${h(this, d, gi).call(this, e.itemsPropertyAlias, (s) => h(this, d, b).call(this, { itemsPropertyAlias: s }))}
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
            .options=${X(["horizontal", "vertical"], e.direction)}
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
            .options=${X(["below", "right", "none"], e.label.position, {
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
                  .options=${h(this, d, Fo).call(this, e.label.fontKey)}
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
                  .options=${X(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
ic = function(e) {
  var a;
  const t = e.shape ?? "rectangle", i = e.fill !== null && e.fill !== void 0;
  return r`
      <uui-box headline="Shape">
        <label class="field">
          <span>Shape</span>
          <uui-select
            .value=${t}
            .options=${X(["rectangle", "ellipse", "polygon", "star"], t)}
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
    gradient: s.target.checked ? ur() : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? h(this, d, Lo).call(this, e.gradient, (s) => h(this, d, b).call(this, { gradient: s })) : p}

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
    var n;
    const o = s.detail.value ?? 0;
    h(this, d, b).call(this, {
      border: o > 0 ? { width: o, colour: ((n = e.border) == null ? void 0 : n.colour) ?? "#FFFFFF" } : null
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
ac = function(e) {
  const t = Me(e.position, "x"), i = Me(e.position, "y"), a = e.rotation ?? 0;
  return r`
      <uui-box headline="Layout">
        ${h(this, d, io).call(this, e, "x")} ${h(this, d, io).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(s) => h(this, d, oc).call(this, e, s.detail.value)}>
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
            @change=${(s) => h(this, d, b).call(this, { rotation: hr(s.detail.value ?? 0) })}>
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
io = function(e, t) {
  const i = Me(e.position, t), a = La(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => h(this, d, sc).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => h(this, d, Ea).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${X(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => h(this, d, Ea).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                .min=${y.referenceGap.min}
                .max=${y.referenceGap.max}
                label="Gap"
                .value=${a.gap}
                @change=${(n) => h(this, d, Ea).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                .min=${t === "x" ? y.x.min : y.y.min}
                .max=${t === "x" ? y.x.max : y.y.max}
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => h(this, d, b).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
sc = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Me(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && h(this, d, b).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: vd
      }
    }
  });
};
Ea = function(e, t, i) {
  const a = La(e.position, t);
  a && h(this, d, b).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
oc = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? fd(e.position, i, a, t) : { ...e.position, anchor: t };
  h(this, d, b).call(this, { position: s });
};
nc = function(e) {
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
            .options=${X(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
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
              ${h(this, d, gi).call(this, e.visibility.propertyAlias ?? "", (t) => h(this, d, b).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
zo = function(e, t, i) {
  return r`
      <umb-property-layout orientation="vertical" label=${e} description=${Ss(i)}>
        <div slot="editor" class="editor">${t}</div>
      </umb-property-layout>
    `;
};
gi = function(e, t, i = {}) {
  const a = kd(e), s = [];
  for (let o = 0; o <= Is; o++) {
    const n = ln(a, o), l = o === 0 ? this.properties : this.linkedProperties[n] ?? [], u = a[o] ?? "";
    if (o > 0) {
      const C = (o === 1 ? this.properties : this.linkedProperties[ln(a, o - 1)] ?? []).some(
        (W) => W.alias === a[o - 1] && W.classification === "content"
      );
      if (!a[o - 1] || !C && !u) break;
    }
    const f = h(this, d, rc).call(this, zp(l, o === 0 ? i.root : i.tail), u, (E) => t([...a.slice(0, o), E].filter(Boolean).join(".")));
    s.push(o === 0 ? f : r`<div class="hop">
            <span class="hop-caption">${this.linkedCaptions[n] ?? "Property on the linked item"}</span>
            ${f}
          </div>`);
  }
  return s.length === 1 ? s[0] : r`<div class="path">${s}</div>`;
};
rc = function(e, t, i) {
  return r`
      <uui-select
        class="property-select"
        label="Property"
        title=${t || "No property"}
        .value=${t}
        .options=${Dd(e, t)}
        @change=${(a) => i(a.target.value)}>
      </uui-select>
    `;
};
Fo = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
lc = function(e, t, i) {
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
Ve.styles = A`
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

    /* One hop per line, each full width; every hop after the first sits behind a 2px rule, as
       the relative-position axes do. */
    .path {
      display: flex;
      flex-direction: column;
      gap: var(--uui-size-space-4);
      min-width: 0;
    }

    .hop {
      display: flex;
      flex-direction: column;
      gap: var(--uui-size-space-1);
      padding-left: var(--uui-size-space-3);
      border-left: 2px solid var(--uui-color-border);
      min-width: 0;
    }

    .hop-caption {
      color: var(--uui-color-text-alt);
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
  g({ type: Object })
], Ve.prototype, "template", 2);
Ut([
  g({ type: Object })
], Ve.prototype, "layer", 2);
Ut([
  g({ type: Array })
], Ve.prototype, "properties", 2);
Ut([
  g({ type: Object })
], Ve.prototype, "linkedProperties", 2);
Ut([
  g({ type: Object })
], Ve.prototype, "linkedCaptions", 2);
Ut([
  g({ type: Array })
], Ve.prototype, "fonts", 2);
Ve = Ut([
  M("di-layer-inspector")
], Ve);
function X(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function cc(e) {
  return X(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var Fp = Object.defineProperty, Up = Object.getOwnPropertyDescriptor, uc = (e) => {
  throw TypeError(e);
}, ra = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Up(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Fp(t, i, s), s;
}, Wp = (e, t, i) => t.has(e) || uc("Cannot " + i), Np = (e, t, i) => t.has(e) ? uc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ce = (e, t, i) => (Wp(e, t, "access private method"), i), ge, $t, dc, hc, pc, mc;
const Bp = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let zt = class extends z {
  constructor() {
    super(...arguments), Np(this, ge), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${Ce(this, ge, pc)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : Z(
      e,
      (t) => t.key,
      (t, i) => Ce(this, ge, mc).call(this, t, i)
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
ge = /* @__PURE__ */ new WeakSet();
$t = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
dc = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
hc = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
pc = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  Ce(this, ge, $t).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
mc = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => Ce(this, ge, dc).call(this, a, e.key)}
        @dragover=${(a) => Ce(this, ge, hc).call(this, a, t)}
        @click=${() => Ce(this, ge, $t).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${Bp[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          class="visibility ${e.isVisible ? "" : "off"}"
          look=${e.isVisible ? "primary" : "secondary"}
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ce(this, ge, $t).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name="icon-eye"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ce(this, ge, $t).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ce(this, ge, $t).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), Ce(this, ge, $t).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
zt.styles = A`
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
ra([
  g({ type: Array })
], zt.prototype, "layers", 2);
ra([
  g({ type: String })
], zt.prototype, "selectedLayerKey", 2);
ra([
  m()
], zt.prototype, "_dragKey", 2);
ra([
  m()
], zt.prototype, "_dropIndex", 2);
zt = ra([
  M("di-layers-panel")
], zt);
var Kp = Object.defineProperty, jp = Object.getOwnPropertyDescriptor, fc = (e) => {
  throw TypeError(e);
}, Xe = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? jp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Kp(t, i, s), s;
}, Uo = (e, t, i) => t.has(e) || fc("Cannot " + i), Vp = (e, t, i) => (Uo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), zn = (e, t, i) => t.has(e) ? fc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gp = (e, t, i, a) => (Uo(e, t, "write to private field"), t.set(e, i), i), ae = (e, t, i) => (Uo(e, t, "access private method"), i), G, Fe, qa, yc, gc, Oi;
let Se = class extends z {
  constructor() {
    super(...arguments), zn(this, G), this.effectiveScale = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1, zn(this, qa, 100);
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
            @click=${() => ae(this, G, Fe).call(this, "di-zoom-change", { zoom: this.effectiveScale / 1.25 })}>
            <uui-icon name="icon-zoom-out"></uui-icon>
          </uui-button>
          <di-number-field
            class="value"
            label="Zoom"
            suffix="%"
            step="5"
            .min=${ja.min * 100}
            .max=${ja.max * 100}
            .value=${ae(this, G, yc).call(this)}
            @change=${ae(this, G, gc)}>
          </di-number-field>
          <uui-button
            compact
            look="secondary"
            label="Zoom in"
            @click=${() => ae(this, G, Fe).call(this, "di-zoom-change", { zoom: this.effectiveScale * 1.25 })}>
            <uui-icon name="icon-zoom-in"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => ae(this, G, Fe).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${ae(this, G, Oi).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${ae(this, G, Oi).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${ae(this, G, Oi).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${ae(this, G, Oi).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => ae(this, G, Fe).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => ae(this, G, Fe).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => ae(this, G, Fe).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
G = /* @__PURE__ */ new WeakSet();
Fe = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
qa = /* @__PURE__ */ new WeakMap();
yc = function() {
  return this.matches(":focus-within") || Gp(this, qa, Math.round(this.effectiveScale * 100)), Vp(this, qa);
};
gc = function(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value;
  t != null && ae(this, G, Fe).call(this, "di-zoom-change", { zoom: t / 100 });
};
Oi = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => ae(this, G, Fe).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
Se.styles = A`
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
Xe([
  g({ type: Number })
], Se.prototype, "effectiveScale", 2);
Xe([
  g({ type: Boolean })
], Se.prototype, "snapEnabled", 2);
Xe([
  g({ type: Boolean })
], Se.prototype, "showRulers", 2);
Xe([
  g({ type: Boolean })
], Se.prototype, "showSafeArea", 2);
Xe([
  g({ type: Boolean })
], Se.prototype, "showMeasured", 2);
Xe([
  g({ type: Boolean })
], Se.prototype, "canUndo", 2);
Xe([
  g({ type: Boolean })
], Se.prototype, "canRedo", 2);
Xe([
  g({ type: Boolean })
], Se.prototype, "previewing", 2);
Se = Xe([
  M("di-canvas-toolbar")
], Se);
var qp = Object.defineProperty, Hp = Object.getOwnPropertyDescriptor, vc = (e) => {
  throw TypeError(e);
}, Wo = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Hp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && qp(t, i, s), s;
}, No = (e, t, i) => t.has(e) || vc("Cannot " + i), jt = (e, t, i) => (No(e, t, "read from private field"), t.get(e)), ya = (e, t, i) => t.has(e) ? vc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ao = (e, t, i, a) => (No(e, t, "write to private field"), t.set(e, i), i), Fn = (e, t, i) => (No(e, t, "access private method"), i), mi, Ca, zi, Da, bc, _c;
let qi = class extends z {
  constructor() {
    super(), ya(this, Da), ya(this, mi), this._selection = [], ya(this, Ca, ""), ya(this, zi), customElements.get("umb-input-document") || import("@umbraco-cms/backoffice/document").catch(() => {
    }), this.consumeContext(mt, (e) => {
      ao(this, mi, e), e && (this.observe(e.sampleContentKey, (t) => {
        this._selection = t ? [t] : [];
      }), this.observe(e.template, (t) => {
        const i = ((t == null ? void 0 : t.docTypeAliases) ?? []).join(",");
        i !== jt(this, Ca) && (ao(this, Ca, i), Fn(this, Da, bc).call(this, (t == null ? void 0 : t.docTypeAliases) ?? []));
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
          @change=${Fn(this, Da, _c)}></umb-input-document>
      </umb-property-layout>
    `;
  }
};
mi = /* @__PURE__ */ new WeakMap();
Ca = /* @__PURE__ */ new WeakMap();
zi = /* @__PURE__ */ new WeakMap();
Da = /* @__PURE__ */ new WeakSet();
bc = async function(e) {
  if (!jt(this, mi)) return;
  jt(this, zi) ?? ao(this, zi, er(jt(this, mi).getToken).catch(() => []));
  const t = await jt(this, zi), i = new Set(e), a = t.filter((s) => i.has(s.alias)).map((s) => s.key);
  this._allowedContentTypeIds = a.length > 0 ? a : void 0;
};
_c = function(e) {
  var i;
  const t = e.target.selection;
  (i = jt(this, mi)) == null || i.setSampleContentKey(t[0]);
};
qi.styles = A`
    :host {
      display: block;
    }

    umb-property-layout {
      padding: 0;
    }
  `;
Wo([
  m()
], qi.prototype, "_selection", 2);
Wo([
  m()
], qi.prototype, "_allowedContentTypeIds", 2);
qi = Wo([
  M("di-preview-content-picker")
], qi);
var Yp = Object.defineProperty, Xp = Object.getOwnPropertyDescriptor, wc = (e) => {
  throw TypeError(e);
}, la = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Xp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Yp(t, i, s), s;
}, Bo = (e, t, i) => t.has(e) || wc("Cannot " + i), H = (e, t, i) => (Bo(e, t, "read from private field"), t.get(e)), yt = (e, t, i) => t.has(e) ? wc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pt = (e, t, i, a) => (Bo(e, t, "write to private field"), t.set(e, i), i), Ne = (e, t, i) => (Bo(e, t, "access private method"), i), it, Ht, Yt, At, Ha, Ya, $e, Ko, Ia, jo, so;
const Jp = 400;
let Ft = class extends z {
  constructor() {
    super(), yt(this, $e), yt(this, it), yt(this, Ht), yt(this, Yt), yt(this, At), yt(this, Ha), yt(this, Ya, !0), this._loading = !1, this._collapsed = !1, this.consumeContext(mt, (e) => {
      Pt(this, it, e), e && (this.observe(e.template, (t) => {
        t && Ne(this, $e, Ia).call(this, t);
      }), this.observe(e.sampleContentKey, (t) => {
        var a;
        Pt(this, Ha, t);
        const i = (a = H(this, it)) == null ? void 0 : a.getData();
        i && Ne(this, $e, Ia).call(this, i);
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
    const e = (t = H(this, it)) == null ? void 0 : t.getData();
    e && (window.clearTimeout(H(this, Ht)), this._collapsed = !1, Ne(this, $e, jo).call(this, e));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(H(this, Ht)), (e = H(this, Yt)) == null || e.abort(), Ne(this, $e, Ko).call(this);
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
        const t = (e = H(this, it)) == null ? void 0 : e.getData();
        t && Ne(this, $e, Ia).call(this, t);
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
it = /* @__PURE__ */ new WeakMap();
Ht = /* @__PURE__ */ new WeakMap();
Yt = /* @__PURE__ */ new WeakMap();
At = /* @__PURE__ */ new WeakMap();
Ha = /* @__PURE__ */ new WeakMap();
Ya = /* @__PURE__ */ new WeakMap();
$e = /* @__PURE__ */ new WeakSet();
Ko = function() {
  H(this, At) && (URL.revokeObjectURL(H(this, At)), Pt(this, At, void 0));
};
Ia = function(e) {
  this._collapsed || (window.clearTimeout(H(this, Ht)), Pt(this, Ht, window.setTimeout(() => void Ne(this, $e, jo).call(this, e), Jp)));
};
jo = async function(e) {
  var t;
  if (H(this, it)) {
    (t = H(this, Yt)) == null || t.abort(), Pt(this, Yt, new AbortController()), Ne(this, $e, so).call(this, !0), this._error = void 0;
    try {
      const i = await tr(
        e,
        {
          signal: H(this, Yt).signal,
          contentKey: H(this, Ha),
          useSampleData: H(this, Ya)
        },
        H(this, it).getToken
      );
      Ne(this, $e, Ko).call(this), Pt(this, At, URL.createObjectURL(i)), this._url = H(this, At);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      Ne(this, $e, so).call(this, !1);
    }
  }
};
so = function(e) {
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
      ${To}
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
  m()
], Ft.prototype, "_url", 2);
la([
  m()
], Ft.prototype, "_loading", 2);
la([
  m()
], Ft.prototype, "_error", 2);
la([
  m()
], Ft.prototype, "_collapsed", 2);
Ft = la([
  M("di-preview-strip")
], Ft);
var Zp = Object.defineProperty, Qp = Object.getOwnPropertyDescriptor, $c = (e) => {
  throw TypeError(e);
}, K = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Qp(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Zp(t, i, s), s;
}, Vo = (e, t, i) => t.has(e) || $c("Cannot " + i), v = (e, t, i) => (Vo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), gt = (e, t, i) => t.has(e) ? $c("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Fi = (e, t, i, a) => (Vo(e, t, "write to private field"), t.set(e, i), i), Q = (e, t, i) => (Vo(e, t, "access private method"), i), k, Hi, Yi, Xi, Xt, F, oo, Go, xc, kc, no, Tc, Sc, Ec, ro, Cc, Dc, Ic, Oc, qo, Pc, Oa;
const em = 400;
let U = class extends z {
  constructor() {
    super(), gt(this, F), gt(this, k), gt(this, Hi), gt(this, Yi), gt(this, Xi), gt(this, Xt), this._properties = [], this._linkedProperties = {}, this._linkedCaptions = {}, this._fonts = [], this._serverBounds = [], this._effectiveScale = 1, this._previewing = !1, this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, gt(this, Oa, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = v(this, k);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = v(this, F, oo);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), Q(this, F, no).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, l = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, u = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, f = Me(s.position, "x") ? 0 : l, E = Me(s.position, "y") ? 0 : u;
            if (f === 0 && E === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + f, y: s.position.y + E }
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
    }), this.consumeContext(Xn, (e) => {
      Fi(this, Hi, e);
    }), this.consumeContext(fe, (e) => {
      Fi(this, Yi, e);
    }), this.consumeContext(mt, (e) => {
      Fi(this, k, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (Q(this, F, Tc).call(this, t), Q(this, F, Sc).call(this, t), Q(this, F, Ec).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", v(this, Oa));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", v(this, Oa)), window.clearTimeout(v(this, Xi)), (e = v(this, Xt)) == null || e.abort();
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
        @di-layer-delete=${(e) => Q(this, F, no).call(this, e.detail.key)}
        @di-layer-detach=${(e) => Q(this, F, kc).call(this, e.detail.key, e.detail.axis)}
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
        @di-palette-add=${(e) => Q(this, F, ro).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => Q(this, F, ro).call(this, e.detail.payload, e.detail.x, e.detail.y, e.detail.targetKey)}
        @di-pick-base-image=${Q(this, F, Ic)}
        @di-pick-layer-image=${(e) => Q(this, F, Oc).call(this, e.detail.key)}
        @di-use-image-size=${Q(this, F, Pc)}
        @di-request-preview=${() => {
      var e;
      return (e = v(this, F, xc)) == null ? void 0 : e.refresh();
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
            .layer=${v(this, F, oo)}
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
k = /* @__PURE__ */ new WeakMap();
Hi = /* @__PURE__ */ new WeakMap();
Yi = /* @__PURE__ */ new WeakMap();
Xi = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
F = /* @__PURE__ */ new WeakSet();
oo = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
Go = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
xc = function() {
  return this.renderRoot.querySelector("di-preview-strip");
};
kc = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((l) => l.key === e);
  if (!i) return;
  const a = (o = v(this, F, Go)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = v(this, k)) == null || n.updateLayer(e, { position: Ds(i.position, t, a) });
};
no = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = v(this, F, Go)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = v(this, k)) == null || s.removeLayer(e, t);
};
Tc = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && v(this, k) && await Kr(t, v(this, k).getToken);
};
Sc = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !v(this, k)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await ar(t.mediaKey, v(this, k).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Ec = function() {
  window.clearTimeout(v(this, Xi)), Fi(this, Xi, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !v(this, k))) {
      (t = v(this, Xt)) == null || t.abort(), Fi(this, Xt, new AbortController());
      try {
        const i = await ir(
          e,
          { signal: v(this, Xt).signal, useSampleData: !0 },
          v(this, k).getToken
        );
        v(this, k).setServerBounds(i.layers), v(this, k).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, em));
};
ro = function(e, t, i, a) {
  const s = this._template;
  if (!s || !v(this, k)) return;
  const o = { template: s, x: t, y: i, defaultFontKey: Q(this, F, Dc).call(this) };
  if (e.kind === "property") {
    const l = hd(e.property, o);
    if (l.kind === "condition") {
      Q(this, F, Cc).call(this, l.propertyAlias, l.propertyName, a);
      return;
    }
    v(this, k).addLayer(l.layer);
    return;
  }
  const n = e.layerType === "image" ? lr(o, "Image") : e.layerType === "badges" ? cr(o, "Badges", "") : e.layerType === "rect" ? ud(o, "Shape", e.shape) : rr(o, "Text", { kind: "static", text: "Text" });
  v(this, k).addLayer(n);
};
Cc = function(e, t, i) {
  var o, n, l, u;
  const a = i ?? this._selectedKey, s = (o = this._template) == null ? void 0 : o.layers.find((f) => f.key === a);
  if (!s) {
    (n = v(this, Yi)) == null || n.peek("warning", {
      data: {
        headline: "Nothing to apply that to",
        message: "Drop a Yes/No property onto a layer, or select one first - it controls when that layer is shown."
      }
    });
    return;
  }
  (l = v(this, k)) == null || l.updateLayer(s.key, {
    visibility: { rule: "whenPropertyTruthy", propertyAlias: e }
  }), (u = v(this, Yi)) == null || u.peek("positive", {
    data: { message: `'${s.name}' now shows only when '${t}' is ticked.` }
  });
};
Dc = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Ic = async function() {
  var t;
  const e = await Q(this, F, qo).call(this);
  e && ((t = v(this, k)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
Oc = async function(e) {
  var i;
  const t = await Q(this, F, qo).call(this);
  t && ((i = v(this, k)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
qo = async function() {
  if (!v(this, Hi)) return;
  const e = v(this, Hi).open(this, $u, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
Pc = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !v(this, k)) return;
  const t = await ar(e.mediaKey, v(this, k).getToken).catch(() => {
  });
  t && v(this, k).updateCanvas({ width: t.width, height: t.height });
};
Oa = /* @__PURE__ */ new WeakMap();
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
K([
  m()
], U.prototype, "_template", 2);
K([
  m()
], U.prototype, "_selectedKey", 2);
K([
  m()
], U.prototype, "_properties", 2);
K([
  m()
], U.prototype, "_linkedProperties", 2);
K([
  m()
], U.prototype, "_linkedCaptions", 2);
K([
  m()
], U.prototype, "_fonts", 2);
K([
  m()
], U.prototype, "_serverBounds", 2);
K([
  m()
], U.prototype, "_baseImageUrl", 2);
K([
  m()
], U.prototype, "_zoom", 2);
K([
  m()
], U.prototype, "_effectiveScale", 2);
K([
  m()
], U.prototype, "_previewing", 2);
K([
  m()
], U.prototype, "_snapEnabled", 2);
K([
  m()
], U.prototype, "_showRulers", 2);
K([
  m()
], U.prototype, "_showSafeArea", 2);
K([
  m()
], U.prototype, "_showMeasured", 2);
K([
  m()
], U.prototype, "_canUndo", 2);
K([
  m()
], U.prototype, "_canRedo", 2);
U = K([
  M("di-design-view")
], U);
const tm = U, im = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return U;
  },
  default: tm
}, Symbol.toStringTag, { value: "Module" }));
var am = Object.defineProperty, sm = Object.getOwnPropertyDescriptor, Ac = (e) => {
  throw TypeError(e);
}, Je = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? sm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && am(t, i, s), s;
}, Ho = (e, t, i) => t.has(e) || Ac("Cannot " + i), te = (e, t, i) => (Ho(e, t, "read from private field"), t.get(e)), ki = (e, t, i) => t.has(e) ? Ac("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ji = (e, t, i, a) => (Ho(e, t, "write to private field"), t.set(e, i), i), Qe = (e, t, i) => (Ho(e, t, "access private method"), i), Pe, Zi, Jt, Mt, Ee, Yo, Pa, Mc, Rc, Lc;
let pe = class extends z {
  constructor() {
    super(), ki(this, Ee), ki(this, Pe), ki(this, Zi), ki(this, Jt), ki(this, Mt), this._bounds = [], this._skipped = [], this._loading = !1, this._regenerating = !1, this.consumeContext(fe, (e) => {
      Ji(this, Zi, e);
    }), this.consumeContext(mt, (e) => {
      Ji(this, Pe, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.sampleContentKey, (t) => {
        t !== this._contentKey && (this._contentKey = t, Qe(this, Ee, Pa).call(this));
      }));
    });
  }
  connectedCallback() {
    super.connectedCallback(), Qe(this, Ee, Pa).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = te(this, Jt)) == null || e.abort(), Qe(this, Ee, Yo).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box>
          <di-preview-content-picker></di-preview-content-picker>
        </uui-box>

        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => Qe(this, Ee, Pa).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${Qe(this, Ee, Rc)}>
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
                ${Z(
      // A row per *template layer*, not per bounds. A layer that resolved to nothing
      // used to be dropped from this table entirely - no row, no note, no reason -
      // which is exactly when an editor most needs telling.
      this._template.layers,
      (e) => e.key,
      (e) => Qe(this, Ee, Lc).call(this, e)
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
                @click=${Qe(this, Ee, Mc)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
Pe = /* @__PURE__ */ new WeakMap();
Zi = /* @__PURE__ */ new WeakMap();
Jt = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
Ee = /* @__PURE__ */ new WeakSet();
Yo = function() {
  te(this, Mt) && (URL.revokeObjectURL(te(this, Mt)), Ji(this, Mt, void 0));
};
Pa = async function() {
  var i;
  const e = this._template;
  if (!e || !te(this, Pe)) return;
  (i = te(this, Jt)) == null || i.abort(), Ji(this, Jt, new AbortController()), this._loading = !0, this._error = void 0;
  const t = {
    signal: te(this, Jt).signal,
    contentKey: this._contentKey,
    useSampleData: !this._contentKey,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [a, s] = await Promise.all([
      tr(e, t, te(this, Pe).getToken),
      ir(e, t, te(this, Pe).getToken)
    ]);
    Qe(this, Ee, Yo).call(this), Ji(this, Mt, URL.createObjectURL(a)), this._url = te(this, Mt), this._bounds = s.layers, this._skipped = s.skipped ?? [], te(this, Pe).setServerBounds(s.layers), te(this, Pe).setIssues(s.issues);
  } catch (a) {
    if ((a == null ? void 0 : a.name) === "AbortError") return;
    this._error = a instanceof Error ? a.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Mc = async function() {
  var e, t;
  if (!(!this._contentKey || !te(this, Pe))) {
    this._regenerating = !0;
    try {
      const i = await po(this._contentKey, te(this, Pe).getToken), a = i.outcome === "generated" || i.outcome === "generateddraft";
      (e = te(this, Zi)) == null || e.peek(a ? "positive" : "warning", {
        data: { message: i.message ?? i.outcome }
      });
    } catch (i) {
      (t = te(this, Zi)) == null || t.peek("danger", {
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
Rc = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Lc = function(e) {
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
      ${To}
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
Je([
  m()
], pe.prototype, "_template", 2);
Je([
  m()
], pe.prototype, "_contentKey", 2);
Je([
  m()
], pe.prototype, "_bounds", 2);
Je([
  m()
], pe.prototype, "_skipped", 2);
Je([
  m()
], pe.prototype, "_url", 2);
Je([
  m()
], pe.prototype, "_loading", 2);
Je([
  m()
], pe.prototype, "_error", 2);
Je([
  m()
], pe.prototype, "_regenerating", 2);
pe = Je([
  M("di-preview-view")
], pe);
const om = pe, nm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return pe;
  },
  default: om
}, Symbol.toStringTag, { value: "Module" }));
var rm = Object.defineProperty, lm = Object.getOwnPropertyDescriptor, zc = (e) => {
  throw TypeError(e);
}, ca = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? lm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && rm(t, i, s), s;
}, Xo = (e, t, i) => t.has(e) || zc("Cannot " + i), Y = (e, t, i) => (Xo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Un = (e, t, i) => t.has(e) ? zc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), cm = (e, t, i, a) => (Xo(e, t, "write to private field"), t.set(e, i), i), Vt = (e, t, i) => (Xo(e, t, "access private method"), i), se, de, Fc, Uc, Xa, Wc, Nc, Bc, Kc, jc, Vc;
let Ge = class extends z {
  constructor() {
    super(), Un(this, de), Un(this, se), this._properties = [], this._showAdvanced = !1, this.consumeContext(mt, (e) => {
      cm(this, se, e), e && (er(e.getToken).then((t) => this._documentTypes = t).catch(() => this._documentTypes = []), this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${Vt(this, de, Bc).call(this)} ${Vt(this, de, Kc).call(this)} ${Vt(this, de, jc).call(this)} ${Vt(this, de, Vc).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
se = /* @__PURE__ */ new WeakMap();
de = /* @__PURE__ */ new WeakSet();
Fc = function() {
  return this._properties.filter((e) => e.classification === "media");
};
Uc = function() {
  var t;
  const e = new Map((this._documentTypes ?? []).map((i) => [i.alias, i.key]));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).map((i) => e.get(i)).filter((i) => !!i);
};
Xa = function() {
  var t;
  if (!this._documentTypes) return [];
  const e = new Set(this._documentTypes.map((i) => i.alias));
  return (((t = this._template) == null ? void 0 : t.docTypeAliases) ?? []).filter((i) => !e.has(i));
};
Wc = async function(e) {
  var s, o;
  const t = e.target.selection, i = new Map((this._documentTypes ?? []).map((n) => [n.key, n.alias])), a = [
    ...t.map((n) => i.get(n)).filter((n) => !!n),
    ...Y(this, de, Xa)
  ].filter((n, l, u) => u.indexOf(n) === l);
  (s = Y(this, se)) == null || s.updateTemplateFields({ docTypeAliases: a }), await ((o = Y(this, se)) == null ? void 0 : o.reloadProperties());
};
Nc = function(e) {
  var i;
  const t = e.target.selection;
  (i = Y(this, se)) == null || i.updateOutput({ mediaFolderKey: t[0] ?? null });
};
Bc = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${this._documentTypes ? r`<umb-input-document-type
                  .documentTypesOnly=${!0}
                  .selection=${Y(this, de, Uc)}
                  @change=${Vt(this, de, Wc)}></umb-input-document-type>` : r`<uui-loader-bar></uui-loader-bar>`}
            ${Y(this, de, Xa).length > 0 ? r`<p class="note">
                  Also targets ${Y(this, de, Xa).join(", ")}, which no document type has any more.
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
    ...Y(this, de, Fc).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = Y(this, se)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = Y(this, se)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Kc = function() {
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
            @change=${Vt(this, de, Nc)}></umb-input-media>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = Y(this, se)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = Y(this, se)) == null ? void 0 : i.updateOutput({
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
    return (i = Y(this, se)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
jc = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = Y(this, se)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = Y(this, se)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
Vc = function() {
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
    return (i = Y(this, se)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
  m()
], Ge.prototype, "_template", 2);
ca([
  m()
], Ge.prototype, "_properties", 2);
ca([
  m()
], Ge.prototype, "_showAdvanced", 2);
ca([
  m()
], Ge.prototype, "_documentTypes", 2);
Ge = ca([
  M("di-settings-view")
], Ge);
const um = Ge, dm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return Ge;
  },
  default: um
}, Symbol.toStringTag, { value: "Module" }));
var hm = Object.defineProperty, pm = Object.getOwnPropertyDescriptor, Gc = (e) => {
  throw TypeError(e);
}, ua = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? pm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && hm(t, i, s), s;
}, Jo = (e, t, i) => t.has(e) || Gc("Cannot " + i), Wn = (e, t, i) => (Jo(e, t, "read from private field"), t.get(e)), Nn = (e, t, i) => t.has(e) ? Gc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), mm = (e, t, i, a) => (Jo(e, t, "write to private field"), t.set(e, i), i), Bn = (e, t, i) => (Jo(e, t, "access private method"), i), Qi, Aa, lo;
let qe = class extends z {
  constructor() {
    super(), Nn(this, Aa), Nn(this, Qi), this._loading = !0, this._onlyMissing = !1, this.consumeContext(mt, (e) => {
      mm(this, Qi, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && Bn(this, Aa, lo).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => Bn(this, Aa, lo).call(this)}>Reload</uui-button>
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
              ${Z(
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
Qi = /* @__PURE__ */ new WeakMap();
Aa = /* @__PURE__ */ new WeakSet();
lo = async function() {
  const e = this._template;
  if (!(!e || !Wn(this, Qi))) {
    this._loading = !0;
    try {
      this._usage = await ad(e.key, Wn(this, Qi).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
qe.styles = A`
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
  m()
], qe.prototype, "_template", 2);
ua([
  m()
], qe.prototype, "_usage", 2);
ua([
  m()
], qe.prototype, "_loading", 2);
ua([
  m()
], qe.prototype, "_onlyMissing", 2);
qe = ua([
  M("di-usage-view")
], qe);
const fm = qe, ym = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return qe;
  },
  default: fm
}, Symbol.toStringTag, { value: "Module" })), gm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: Ts,
  default: Ts
}, Symbol.toStringTag, { value: "Module" }));
var rt, It;
class ws extends su {
  constructor(i, a) {
    super(i, a);
    x(this, rt);
    x(this, It);
    this.consumeContext(fe, (s) => {
      _(this, rt, s);
    }), this.consumeContext(mt, (s) => {
      _(this, It, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = c(this, It), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = c(this, rt)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await uo(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const l = await sr(a.key, !1, i.getToken);
        (o = c(this, rt)) == null || o.peek("positive", {
          data: { message: `Regenerating ${l.total} item(s)…` }
        }), await Dr(l, i.getToken, c(this, rt));
      } catch (l) {
        (n = c(this, rt)) == null || n.peek("danger", {
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
    c(this, It) && await id(i, c(this, It).getToken);
  }
}
rt = new WeakMap(), It = new WeakMap();
const vm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: ws,
  api: ws,
  default: ws
}, Symbol.toStringTag, { value: "Module" }));
var ta, li;
class $s extends Qa {
  constructor(i, a) {
    super(i, a);
    x(this, ta);
    x(this, li);
    this.consumeContext(Le, (s) => {
      _(this, ta, s);
    }), this.consumeContext(fe, (s) => {
      _(this, li, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await po(i, () => {
          var l;
          return (l = c(this, ta)) == null ? void 0 : l.getLatestToken();
        }), n = o.outcome === "generated" || o.outcome === "generateddraft";
        (a = c(this, li)) == null || a.peek(n ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: n ? o.message ?? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof dt && o.status === 404;
        (s = c(this, li)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof dt ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
ta = new WeakMap(), li = new WeakMap();
const bm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: $s,
  api: $s,
  default: $s
}, Symbol.toStringTag, { value: "Module" }));
var ia, Ot, aa, ci;
class xs extends ku {
  constructor(i, a) {
    super(i, a);
    x(this, ia);
    x(this, Ot);
    x(this, aa);
    x(this, ci);
    this.consumeContext(Le, (s) => {
      _(this, ia, s);
    }), this.consumeContext(fe, (s) => {
      _(this, Ot, s);
    }), this.consumeContext(Tu, (s) => {
      _(this, aa, s);
    }), this.consumeContext(Su, (s) => {
      _(this, ci, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!c(this, ci)) {
      (i = c(this, Ot)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await po(c(this, ci), () => {
        var l;
        return (l = c(this, ia)) == null ? void 0 : l.getLatestToken();
      });
      n.propertyValue && ((a = c(this, aa)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = c(this, Ot)) == null || s.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: n.message ?? "The image has been regenerated."
        }
      });
    } catch (n) {
      const l = n instanceof dt && n.status === 404;
      (o = c(this, Ot)) == null || o.peek(l ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof dt ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
ia = new WeakMap(), Ot = new WeakMap(), aa = new WeakMap(), ci = new WeakMap();
const _m = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: xs,
  api: xs,
  default: xs
}, Symbol.toStringTag, { value: "Module" }));
var wm = Object.defineProperty, $m = Object.getOwnPropertyDescriptor, qc = (e) => {
  throw TypeError(e);
}, Ze = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $m(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && wm(t, i, s), s;
}, Zo = (e, t, i) => t.has(e) || qc("Cannot " + i), fi = (e, t, i) => (Zo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ks = (e, t, i) => t.has(e) ? qc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xm = (e, t, i, a) => (Zo(e, t, "write to private field"), t.set(e, i), i), xt = (e, t, i) => (Zo(e, t, "access private method"), i), Ma, da, be, Hc, Yc, Xc, Qo, Jc, Zc, Qc, eu;
const km = [100, 200, 300, 400, 500, 600, 700, 800, 900], Tm = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let me = class extends Yn {
  constructor() {
    super(), ks(this, be), ks(this, Ma), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", ks(this, da, () => {
      var e;
      return (e = fi(this, Ma)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Le, (e) => {
      xm(this, Ma, e);
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
            @change=${xt(this, be, Hc)}>
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
            @click=${xt(this, be, Xc)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${Tm.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? xt(this, be, eu).call(this) : xt(this, be, Qc).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !fi(this, be, Qo)}
            @click=${xt(this, be, Jc)}>
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
Ma = /* @__PURE__ */ new WeakMap();
da = /* @__PURE__ */ new WeakMap();
be = /* @__PURE__ */ new WeakSet();
Hc = function(e) {
  var i;
  const t = ((i = e.detail) == null ? void 0 : i.files) ?? [];
  xt(this, be, Yc).call(this, t);
};
Yc = async function(e) {
  if (e.length !== 0) {
    this._busy = !0, this._error = void 0;
    try {
      for (const t of e)
        await Gu(t, fi(this, da));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (t) {
      this._error = t instanceof Error ? t.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
Xc = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await qu(this._path.trim(), fi(this, da)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Qo = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
Jc = async function() {
  if (fi(this, be, Qo)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await Hu(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        fi(this, da)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
Zc = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Qc = function() {
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
        ${Z(
    km,
    (e) => e,
    (e) => r`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => xt(this, be, Zc).call(this, e, t.target.checked)}>
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
eu = function() {
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
Ze([
  m()
], me.prototype, "_busy", 2);
Ze([
  m()
], me.prototype, "_error", 2);
Ze([
  m()
], me.prototype, "_path", 2);
Ze([
  m()
], me.prototype, "_provider", 2);
Ze([
  m()
], me.prototype, "_family", 2);
Ze([
  m()
], me.prototype, "_weights", 2);
Ze([
  m()
], me.prototype, "_italic", 2);
Ze([
  m()
], me.prototype, "_url", 2);
me = Ze([
  M("di-font-upload-modal")
], me);
const Sm = me, Em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return me;
  },
  default: Sm
}, Symbol.toStringTag, { value: "Module" }));
var Cm = Object.getOwnPropertyDescriptor, Dm = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Cm(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = n(s) || s);
  return s;
};
let Ja = class extends z {
  render() {
    return r`<umb-folder-workspace-editor></umb-folder-workspace-editor>`;
  }
};
Ja = Dm([
  M("di-template-folder-editor")
], Ja);
const Im = Ja, Om = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateFolderEditorElement() {
    return Ja;
  },
  default: Im
}, Symbol.toStringTag, { value: "Module" }));
export {
  qd as manifests,
  nf as onInit
};
//# sourceMappingURL=dynamic-images.js.map
