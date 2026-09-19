var no = (e) => {
  throw TypeError(e);
};
var Fa = (e, t, i) => t.has(e) || no("Cannot " + i);
var l = (e, t, i) => (Fa(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? no("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), v = (e, t, i, a) => (Fa(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), C = (e, t, i) => (Fa(e, t, "access private method"), i);
var Ka = (e, t, i, a) => ({
  set _(s) {
    v(e, t, s, i);
  },
  get _() {
    return l(e, t, a);
  }
});
import { nothing as p, html as n, css as D, state as h, customElement as P, repeat as O, property as f, classMap as To, styleMap as J } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as I } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Le } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as at } from "@umbraco-cms/backoffice/notification";
import { umbConfirmModal as Cs, UmbModalToken as Co, UMB_MODAL_MANAGER_CONTEXT as Ea, UmbModalBaseElement as Eo } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as Do } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as Cl } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as El, UmbSubmitWorkspaceAction as lo, UmbWorkspaceActionBase as Dl } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as Pl } from "@umbraco-cms/backoffice/context-api";
import { UmbObjectState as zl, UmbArrayState as ci, UmbStringState as co, UmbBooleanState as Yi, UmbNumberState as Ml } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as Ol } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as Il } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Al } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Ll } from "@umbraco-cms/backoffice/document";
const Zt = "dynamic-images", Ni = "di-template", ya = "di:templates-changed", Wl = "/umbraco/management/api/v1/dynamic-images";
class Ze extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function k(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const r = await fetch(`${Wl}${e}`, { ...i, headers: s, body: o });
  if (!r.ok) throw await Rl(r);
  return r;
}
async function Rl(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new Ze(t, e.status, i);
}
const T = async (e) => e.json();
async function Es(e) {
  const t = await k("/templates?take=500", e);
  return (await T(t)).items;
}
const Po = async (e, t) => T(await k(`/templates/${e}`, t)), zo = async (e, t) => T(await k("/templates", t, { method: "POST", json: e })), Mo = async (e, t) => T(await k(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Oo(e, t) {
  await k(`/templates/${e}`, t, { method: "DELETE" });
}
const Io = async (e, t) => T(await k(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function Ao(e, t) {
  return (await k(`/templates/${e}/export`, t)).blob();
}
const Lo = async (e, t, i) => T(await k("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), Wo = async (e) => T(await k("/templates/import/appsettings", e, { method: "POST" })), bi = async (e) => T(await k("/fonts", e));
async function Ro(e, t) {
  const i = new FormData();
  return i.append("file", e), T(await k("/fonts", t, { method: "POST", body: i }));
}
const Uo = async (e, t) => T(await k("/fonts/register-path", t, { method: "POST", json: { path: e } })), No = async (e, t) => T(await k("/fonts/register-web", t, { method: "POST", json: e })), Fo = async (e, t) => T(await k(`/fonts/${e}/refresh`, t, { method: "POST" })), Ko = async (e, t, i, a) => T(await k(`/fonts/${e}`, a, { method: "PUT", json: { familyName: t, styles: i } }));
async function Bo(e, t) {
  await k(`/fonts/${e}`, t, { method: "DELETE" });
}
async function Vo(e, t) {
  return (await k(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Ul = async (e) => T(await k("/document-types", e)), Ho = async (e, t) => T(await k(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function jo(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), T(await k(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function Ds(e, t, i) {
  return (await k("/preview", i, {
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
const Ps = async (e, t, i) => T(await k("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), zs = async (e, t) => T(await k(`/media/${e}/image-info`, t)), Da = async (e, t) => T(await k(`/documents/${e}/regenerate`, t, { method: "POST" })), Go = async (e, t, i) => T(await k(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), Xo = async (e, t) => T(await k(`/jobs/${e}`, t));
async function Yo(e, t) {
  await k(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const qo = async (e, t) => T(await k(`/templates/${e}/usage`, t)), Pa = async (e) => T(await k("/health", e)), Jo = async (e) => T(await k("/sync/status", e)), Zo = async (e) => T(await k("/sync/export", e, { method: "POST" })), Qo = async (e) => T(await k("/sync/import", e, { method: "POST" }));
function Qt(e) {
  const t = `section/${Zt}/workspace/${Ni}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function za() {
  return new URL(`section/${Zt}/workspace/${Ni}/create`, document.baseURI).pathname;
}
function er(e) {
  return new URL(`section/${Zt}/dashboard/${e}`, document.baseURI).pathname;
}
function Ja() {
  const e = window.location.pathname.split(`/workspace/${Ni}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function ai() {
  window.dispatchEvent(new CustomEvent(ya));
}
const Nl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: Ze,
  SECTION_PATHNAME: Zt,
  TEMPLATES_CHANGED_EVENT: ya,
  TEMPLATE_ENTITY_TYPE: Ni,
  cancelJob: Yo,
  createTemplate: zo,
  deleteFont: Bo,
  deleteTemplate: Oo,
  duplicateTemplate: Io,
  exportTemplate: Ao,
  fetchDocumentTypes: Ul,
  fetchFontFile: Vo,
  fetchFonts: bi,
  fetchHealth: Pa,
  fetchImageInfo: zs,
  fetchJob: Xo,
  fetchLayout: Ps,
  fetchPreview: Ds,
  fetchProperties: Ho,
  fetchSampleContent: jo,
  fetchSyncStatus: Jo,
  fetchTemplate: Po,
  fetchTemplates: Es,
  fetchUsage: qo,
  hrefForCreate: za,
  hrefForDashboard: er,
  hrefForTemplate: Qt,
  importFromAppSettings: Wo,
  importTemplate: Lo,
  notifyTemplatesChanged: ai,
  refreshFont: Fo,
  regenerateDocument: Da,
  regenerateTemplate: Go,
  registerFontPath: Uo,
  registerWebFont: No,
  runSyncExport: Zo,
  runSyncImport: Qo,
  templateKeyFromLocation: Ja,
  updateFont: Ko,
  updateTemplate: Mo,
  uploadFont: Ro
}, Symbol.toStringTag, { value: "Module" })), Ma = () => crypto.randomUUID();
function Oa(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function tr(e, t, i) {
  const { x: a, y: s } = Oa(e);
  return {
    type: "text",
    key: Ma(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    // Dropped layers are centred on the pointer, which is what "I put it there" means.
    position: { x: a, y: s, anchor: "middleCentre" },
    size: { width: Math.round(e.template.canvas.width * 0.8), height: null },
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
  const { x: a, y: s } = Oa(e);
  return {
    type: "image",
    key: Ma(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: a, y: s, anchor: "middleCentre" },
    size: { width: 320, height: 180 },
    visibility: { rule: "always" },
    source: i ? { kind: "property", propertyAlias: i, fallback: null } : { kind: "none" },
    fit: "cover",
    cornerRadius: 16,
    border: null
  };
}
function ar(e, t, i) {
  const { x: a, y: s } = Oa(e);
  return {
    type: "badges",
    key: Ma(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: a, y: s, anchor: "middleCentre" },
    size: {},
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
function Fl(e, t = "Shape") {
  const { x: i, y: a } = Oa(e);
  return {
    type: "rect",
    key: Ma(),
    name: t,
    isVisible: !0,
    isLocked: !1,
    opacity: 1,
    position: { x: i, y: a, anchor: "middleCentre" },
    size: { width: 400, height: 200 },
    visibility: { rule: "always" },
    fill: "#00000099",
    gradient: null,
    cornerRadius: 0
  };
}
function Kl(e) {
  switch (e) {
    case "media":
      return "image";
    case "content":
    case "list":
      return "badges";
    default:
      return "text";
  }
}
function Bl(e, t) {
  switch (Kl(e.classification)) {
    case "image":
      return ir(t, e.name, e.alias);
    case "badges":
      return ar(t, e.name, e.alias);
    default:
      return tr(t, e.name, Vl(e));
  }
}
function Vl(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Hl(e) {
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
const sr = [
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
function _i(e) {
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
function wi(e) {
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
function Za(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return sr[a * 3 + i];
}
function Ia(e, t, i) {
  return {
    x: e.x - t * _i(e.anchor),
    y: e.y - i * wi(e.anchor)
  };
}
function or(e, t, i, a, s) {
  return {
    x: e + i * _i(s),
    y: t + a * wi(s)
  };
}
function jl(e, t, i, a) {
  const s = Ia(e, t, i), o = or(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function Gl(e, t) {
  const i = or(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
const Xl = 10;
function Te(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function rr(e) {
  return !!e.relativeX || !!e.relativeY;
}
function va(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function uo(e) {
  return e === "below" || e === "above";
}
function ho(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Yl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function ql(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = ho(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const r = t.get(o);
    r && s.push(...ho(r.position).map((c) => c.layerKey));
  }
  return !1;
}
function Jl(e, t, i) {
  const a = e.position;
  if (!rr(a)) return a;
  if (ql(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, r = _i(a.anchor), c = wi(a.anchor);
  const m = po(e, a.relativeX, !1, t, i);
  m && (s = m.coordinate, r = m.factor);
  const b = po(e, a.relativeY, !0, t, i);
  return b && (o = b.coordinate, c = b.factor), { x: s, y: o, anchor: Za(r, c) };
}
function po(e, t, i, a, s) {
  if (!t || uo(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let r = t.layerKey;
  for (; !o.has(r); ) {
    o.add(r);
    const c = a.get(r);
    if (!c) return;
    const m = s(r);
    if (m)
      switch (t.edge) {
        case "below":
          return { coordinate: m.y + m.height + t.gap, factor: 0 };
        case "above":
          return { coordinate: m.y - t.gap, factor: 1 };
        case "rightOf":
          return { coordinate: m.x + m.width + t.gap, factor: 0 };
        default:
          return { coordinate: m.x - t.gap, factor: 1 };
      }
    const b = i ? c.position.relativeY : c.position.relativeX;
    if (!b || uo(b.edge) !== i) return;
    r = b.layerKey;
  }
}
function Zl(e, t, i) {
  const a = Yl(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), r = (c) => {
    const m = s.get(c.key);
    if (m) return m;
    let b;
    o.has(c.key) ? b = { x: c.position.x, y: c.position.y, anchor: c.position.anchor } : (o.add(c.key), b = Jl(c, a, (Xi) => {
      const De = a.get(Xi);
      return De && !i(De) ? r(De).box : void 0;
    }), o.delete(c.key));
    const W = t(c), nt = Ia(b, W.width, W.height), li = { position: b, box: { x: nt.x, y: nt.y, width: W.width, height: W.height } };
    return s.set(c.key, li), li;
  };
  for (const c of e) r(c);
  return s;
}
function Qa(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? Za(_i(i.anchor), wi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? Za(_i(e.anchor), wi(i.anchor)) : e.anchor
  };
}
var ie, ze, we, Ge;
class Ql {
  constructor(t = 100) {
    w(this, ie, []);
    w(this, ze, []);
    w(this, we, 0);
    w(this, Ge);
    this.limit = t;
  }
  get canUndo() {
    return l(this, ie).length > 0;
  }
  get canRedo() {
    return l(this, ze).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    l(this, we) > 0 || (l(this, ie).push(structuredClone(t)), l(this, ie).length > this.limit && l(this, ie).shift(), v(this, ze, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    l(this, we) === 0 && v(this, Ge, structuredClone(t)), Ka(this, we)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    l(this, we) !== 0 && (Ka(this, we)._--, !(l(this, we) > 0) && (t && l(this, Ge) !== void 0 && (l(this, ie).push(l(this, Ge)), l(this, ie).length > this.limit && l(this, ie).shift(), v(this, ze, [])), v(this, Ge, void 0)));
  }
  undo(t) {
    const i = l(this, ie).pop();
    if (i !== void 0)
      return l(this, ze).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = l(this, ze).pop();
    if (i !== void 0)
      return l(this, ie).push(structuredClone(t)), i;
  }
  clear() {
    v(this, ie, []), v(this, ze, []), v(this, we, 0), v(this, Ge, void 0);
  }
}
ie = new WeakMap(), ze = new WeakMap(), we = new WeakMap(), Ge = new WeakMap();
const ec = "DynamicImages.Workspace.Template";
var N, Bt, Xe, pt, ft, Vt, Ht, jt, mt, Gt, Me, Xt, Yt, ae, Li, gt, $e, S, es, ts, Pe, lt, is, as;
class tc extends El {
  constructor(i) {
    super(i, ec);
    w(this, S);
    w(this, N);
    w(this, Bt);
    w(this, Xe);
    w(this, pt);
    w(this, ft);
    w(this, Vt);
    w(this, Ht);
    w(this, jt);
    w(this, mt);
    w(this, Gt);
    w(this, Me);
    w(this, Xt);
    w(this, Yt);
    w(this, ae);
    w(this, Li);
    w(this, gt);
    w(this, $e);
    v(this, N, new zl(void 0)), this.template = l(this, N).asObservable(), v(this, Bt, new ci([], (a) => a.key)), this.layers = l(this, Bt).asObservable(), v(this, Xe, new co(void 0)), this.selectedLayerKey = l(this, Xe).asObservable(), v(this, pt, new ci([], (a) => a.alias)), this.properties = l(this, pt).asObservable(), v(this, ft, new ci([], (a) => a.key)), this.fonts = l(this, ft).asObservable(), v(this, Vt, new ci([], (a) => a.key)), this.serverBounds = l(this, Vt).asObservable(), v(this, Ht, new ci([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = l(this, Ht).asObservable(), v(this, jt, new co(void 0)), this.sampleContentKey = l(this, jt).asObservable(), v(this, mt, new Yi(!0)), this.useSampleData = l(this, mt).asObservable(), v(this, Gt, new Ml(1)), this.zoom = l(this, Gt).asObservable(), v(this, Me, new Yi(!0)), this.loading = l(this, Me).asObservable(), this.unique = l(this, N).asObservablePart((a) => a == null ? void 0 : a.key), v(this, Xt, new Yi(!1)), this.canUndo = l(this, Xt).asObservable(), v(this, Yt, new Yi(!1)), this.canRedo = l(this, Yt).asObservable(), v(this, ae, new Ql()), v(this, $e, !1), this.getToken = () => {
      var a;
      return (a = l(this, Li)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = l(this, N).getValue()) == null ? void 0 : a.key;
    }, this.getData = () => l(this, N).getValue(), this.routes.setRoutes([
      {
        path: "create",
        component: () => Promise.resolve().then(() => mo),
        setup: () => this.createScaffold()
      },
      {
        path: "edit/:key",
        component: () => Promise.resolve().then(() => mo),
        setup: (a, s) => this.load(s.match.params.key)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Le, (a) => {
      v(this, Li, a);
    }), this.consumeContext(at, (a) => {
      v(this, gt, a);
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return l(this, $e);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    l(this, Me).setValue(!0), v(this, $e, !1);
    try {
      const a = await Po(i, this.getToken);
      C(this, S, lt).call(this, a, { resetHistory: !0 }), this.setIsNew(!1), await C(this, S, es).call(this, a);
    } catch (a) {
      C(this, S, as).call(this, "This template could not be loaded", a);
    } finally {
      l(this, Me).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    l(this, Me).setValue(!0), v(this, $e, !0), C(this, S, lt).call(this, Hl(i), { resetHistory: !0 }), this.setIsNew(!0), await C(this, S, es).call(this, l(this, N).getValue()), l(this, Me).setValue(!1);
  }
  async reloadProperties() {
    const i = l(this, N).getValue();
    i && l(this, pt).setValue(await C(this, S, ts).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    l(this, ft).setValue(await bi(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    C(this, S, Pe).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    C(this, S, Pe).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    C(this, S, Pe).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    C(this, S, Pe).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    C(this, S, Pe).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    C(this, S, Pe).call(this, (s) => ({
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
    C(this, S, Pe).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var c, m;
        let r = o.position;
        return ((c = va(r, "x")) == null ? void 0 : c.layerKey) === i && (r = Qa(r, "x", a == null ? void 0 : a.get(o.key))), ((m = va(r, "y")) == null ? void 0 : m.layerKey) === i && (r = Qa(r, "y", a == null ? void 0 : a.get(o.key))), r === o.position ? o : { ...o, position: r };
      })
    })), l(this, Xe).getValue() === i && this.selectLayer(void 0);
  }
  duplicateLayer(i) {
    var o;
    const a = (o = l(this, N).getValue()) == null ? void 0 : o.layers.find((r) => r.key === i);
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
    C(this, S, Pe).call(this, (s) => {
      const o = [...s.layers], r = o.findIndex((m) => m.key === i);
      if (r < 0) return s;
      const [c] = o.splice(r, 1);
      return o.splice(Math.max(0, Math.min(o.length, a)), 0, c), { ...s, layers: o };
    });
  }
  setLayerVisible(i, a) {
    this.updateLayer(i, { isVisible: a });
  }
  setLayerLocked(i, a) {
    this.updateLayer(i, { isLocked: a });
  }
  selectLayer(i) {
    l(this, Xe).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = l(this, Xe).getValue();
    return i ? (a = l(this, N).getValue()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = l(this, N).getValue();
    i && l(this, ae).begin(i);
  }
  endTransaction(i = !0) {
    l(this, ae).end(i), C(this, S, is).call(this);
  }
  undo() {
    const i = l(this, N).getValue();
    if (!i) return;
    const a = l(this, ae).undo(i);
    a && C(this, S, lt).call(this, a);
  }
  redo() {
    const i = l(this, N).getValue();
    if (!i) return;
    const a = l(this, ae).redo(i);
    a && C(this, S, lt).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    l(this, Vt).setValue(i);
  }
  setIssues(i) {
    l(this, Ht).setValue(i);
  }
  setSampleContentKey(i) {
    l(this, jt).setValue(i), l(this, mt).setValue(!i);
  }
  setUseSampleData(i) {
    l(this, mt).setValue(i);
  }
  setZoom(i) {
    l(this, Gt).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = l(this, N).getValue();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = l(this, $e) ? await zo(i, this.getToken) : await Mo(i, this.getToken);
      C(this, S, lt).call(this, o.template, { resetHistory: !0 });
      const r = l(this, $e);
      v(this, $e, !1), this.setIsNew(!1), ai(), (a = l(this, gt)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const c of o.warnings)
        (s = l(this, gt)) == null || s.peek("warning", { data: { message: c.message } });
      r && window.history.replaceState({}, "", Qt(o.template.key));
    } catch (o) {
      throw C(this, S, as).call(this, "The template could not be saved", o), o;
    }
  }
  destroy() {
    l(this, ae).clear(), super.destroy();
  }
}
N = new WeakMap(), Bt = new WeakMap(), Xe = new WeakMap(), pt = new WeakMap(), ft = new WeakMap(), Vt = new WeakMap(), Ht = new WeakMap(), jt = new WeakMap(), mt = new WeakMap(), Gt = new WeakMap(), Me = new WeakMap(), Xt = new WeakMap(), Yt = new WeakMap(), ae = new WeakMap(), Li = new WeakMap(), gt = new WeakMap(), $e = new WeakMap(), S = new WeakSet(), es = async function(i) {
  const [a, s] = await Promise.all([
    bi(this.getToken).catch(() => []),
    C(this, S, ts).call(this, i.docTypeAliases)
  ]);
  l(this, ft).setValue(a), l(this, pt).setValue(s);
}, ts = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => Ho(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Pe = function(i, a = !0) {
  const s = l(this, N).getValue();
  if (!s) return;
  a && l(this, ae).push(s);
  const o = i(structuredClone(s));
  C(this, S, lt).call(this, o);
}, lt = function(i, a) {
  a != null && a.resetHistory && l(this, ae).clear(), l(this, N).setValue(i), l(this, Bt).setValue(i.layers), C(this, S, is).call(this);
}, is = function() {
  l(this, Xt).setValue(l(this, ae).canUndo), l(this, Yt).setValue(l(this, ae).canRedo);
}, as = function(i, a) {
  var o;
  const s = a instanceof Ze ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = l(this, gt)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const Ct = new Pl(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), ic = [
  // ---------------------------------------------------------------- sidebar
  {
    type: "sectionSidebarApp",
    kind: "menu",
    alias: "DynamicImages.SidebarApp",
    name: "Dynamic Images Sidebar",
    meta: {
      label: "#dynamicImages_sectionName",
      menu: "DynamicImages.Menu"
    },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "menu",
    alias: "DynamicImages.Menu",
    name: "Dynamic Images Menu"
  },
  {
    type: "menuItem",
    alias: "DynamicImages.MenuItem.Templates",
    name: "Dynamic Images Templates Menu Item",
    element: () => Promise.resolve().then(() => fc),
    weight: 200,
    meta: { label: "Templates", menus: ["DynamicImages.Menu"] }
  },
  {
    type: "menuItem",
    kind: "link",
    alias: "DynamicImages.MenuItem.Fonts",
    name: "Dynamic Images Fonts Menu Item",
    weight: 100,
    meta: {
      label: "Fonts",
      icon: "icon-font",
      menus: ["DynamicImages.Menu"],
      href: `section/${Zt}/dashboard/fonts`
    }
  },
  {
    type: "menuItem",
    kind: "link",
    alias: "DynamicImages.MenuItem.Health",
    name: "Dynamic Images Health Menu Item",
    weight: 90,
    meta: {
      label: "Health",
      icon: "icon-stethoscope",
      menus: ["DynamicImages.Menu"],
      href: `section/${Zt}/dashboard/health`
    }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => vc),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => Cc),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => zc),
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
    api: tc,
    meta: { entityType: Ni }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => zu),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Lu),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Nu),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Hu),
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
    api: () => Promise.resolve().then(() => ju),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Xu),
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
    api: () => Promise.resolve().then(() => Yu),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => qu),
    // A property action rather than a custom property editor UI, so adopting the package needs no
    // data type changes on anyone's existing document types.
    forPropertyEditorUis: ["Umb.PropertyEditorUi.MediaPicker"],
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  // ---------------------------------------------------------------- modals
  {
    type: "modal",
    alias: "DynamicImages.Modal.SampleNodePicker",
    name: "Dynamic Images Sample Node Picker",
    element: () => Promise.resolve().then(() => ed)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => nd)
  }
], xd = (e, t) => {
  t.registerMany(ic);
};
var ac = Object.defineProperty, sc = Object.getOwnPropertyDescriptor, nr = (e) => {
  throw TypeError(e);
}, Ms = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? sc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && ac(t, i, s), s;
}, Os = (e, t, i) => t.has(e) || nr("Cannot " + i), oc = (e, t, i) => (Os(e, t, "read from private field"), t.get(e)), fo = (e, t, i) => t.has(e) ? nr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), rc = (e, t, i, a) => (Os(e, t, "write to private field"), t.set(e, i), i), nc = (e, t, i) => (Os(e, t, "access private method"), i), ba, ss, lr;
let wt = class extends I {
  constructor() {
    super(), fo(this, ss), fo(this, ba), this._name = "", this._loading = !0, this.consumeContext(Ct, (e) => {
      rc(this, ba, e), e && (this.observe(e.template, (t) => {
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
            @input=${nc(this, ss, lr)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
ba = /* @__PURE__ */ new WeakMap();
ss = /* @__PURE__ */ new WeakSet();
lr = function(e) {
  var i;
  const t = e.target.value;
  (i = oc(this, ba)) == null || i.updateTemplateFields({ name: t });
};
wt.styles = D`
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
Ms([
  h()
], wt.prototype, "_name", 2);
Ms([
  h()
], wt.prototype, "_loading", 2);
wt = Ms([
  P("di-template-editor")
], wt);
const lc = wt, mo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return wt;
  },
  default: lc
}, Symbol.toStringTag, { value: "Module" }));
var cc = Object.defineProperty, uc = Object.getOwnPropertyDescriptor, cr = (e) => {
  throw TypeError(e);
}, si = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? uc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && cc(t, i, s), s;
}, Is = (e, t, i) => t.has(e) || cr("Cannot " + i), dt = (e, t, i) => (Is(e, t, "read from private field"), t.get(e)), ui = (e, t, i) => t.has(e) ? cr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), dc = (e, t, i, a) => (Is(e, t, "write to private field"), t.set(e, i), i), Qi = (e, t, i) => (Is(e, t, "access private method"), i), ea, _a, ta, ia, Ot, os, ur, dr;
let Ce = class extends I {
  constructor() {
    super(), ui(this, Ot), ui(this, ea), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = Ja(), this._expanded = !0, ui(this, _a, () => {
      var e;
      return (e = dt(this, ea)) == null ? void 0 : e.getLatestToken();
    }), ui(this, ta, () => {
      this._activeKey = Ja();
    }), ui(this, ia, () => {
      Qi(this, Ot, os).call(this);
    }), this.consumeContext(Le, (e) => {
      dc(this, ea, e), e && Qi(this, Ot, os).call(this);
    }), window.addEventListener("changestate", dt(this, ta)), window.addEventListener(ya, dt(this, ia));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("changestate", dt(this, ta)), window.removeEventListener(ya, dt(this, ia));
  }
  render() {
    return n`
      <uui-menu-item
        label="Templates"
        has-children
        ?show-children=${this._expanded}
        @show-children=${() => {
      this._expanded = !0;
    }}
        @hide-children=${() => {
      this._expanded = !1;
    }}>
        <uui-icon slot="icon" name="icon-brush"></uui-icon>
        ${Qi(this, Ot, ur).call(this)}
      </uui-menu-item>
    `;
  }
};
ea = /* @__PURE__ */ new WeakMap();
_a = /* @__PURE__ */ new WeakMap();
ta = /* @__PURE__ */ new WeakMap();
ia = /* @__PURE__ */ new WeakMap();
Ot = /* @__PURE__ */ new WeakSet();
os = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Es(dt(this, _a)),
      Pa(dt(this, _a)).catch(() => {
      })
    ]);
    this._templates = e, this._issuesByTemplate = hc((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
ur = function() {
  return this._loading ? n`<uui-loader></uui-loader>` : n`
      ${O(
    this._templates,
    (e) => e.key,
    (e) => Qi(this, Ot, dr).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${za()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
dr = function(e) {
  const t = this._issuesByTemplate.get(e.key) ?? 0;
  return n`
      <uui-menu-item
        label=${e.name}
        href=${Qt(e.key)}
        ?active=${e.key === this._activeKey}>
        <uui-icon
          slot="icon"
          name=${e.isEnabled ? "icon-picture" : "icon-block"}
          class=${e.isEnabled ? "enabled" : "disabled"}>
        </uui-icon>
        ${t > 0 ? n`<uui-badge slot="badge" color="warning" look="primary" title="${t} issue(s)">${t}</uui-badge>` : p}
      </uui-menu-item>
    `;
};
Ce.styles = D`
    :host {
      display: block;
    }

    .disabled {
      opacity: 0.5;
    }

    .enabled {
      color: var(--uui-color-positive);
    }
  `;
si([
  h()
], Ce.prototype, "_templates", 2);
si([
  h()
], Ce.prototype, "_issuesByTemplate", 2);
si([
  h()
], Ce.prototype, "_loading", 2);
si([
  h()
], Ce.prototype, "_activeKey", 2);
si([
  h()
], Ce.prototype, "_expanded", 2);
Ce = si([
  P("di-templates-menu-item")
], Ce);
function hc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const pc = Ce, fc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return Ce;
  },
  default: pc
}, Symbol.toStringTag, { value: "Module" }));
var mc = Object.defineProperty, gc = Object.getOwnPropertyDescriptor, hr = (e) => {
  throw TypeError(e);
}, st = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && mc(t, i, s), s;
}, As = (e, t, i) => t.has(e) || hr("Cannot " + i), xe = (e, t, i) => (As(e, t, "read from private field"), i ? i.call(e) : t.get(e)), qi = (e, t, i) => t.has(e) ? hr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), go = (e, t, i, a) => (As(e, t, "write to private field"), t.set(e, i), i), x = (e, t, i) => (As(e, t, "access private method"), i), aa, wa, ke, _, oi, ue, pr, fr, mr, gr, yr, vr, br, pi, _r, wr, $r, xr, kr;
let de = class extends I {
  constructor() {
    super(), qi(this, _), qi(this, aa), qi(this, wa), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, qi(this, ke, () => {
      var e;
      return (e = xe(this, aa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(at, (e) => {
      go(this, wa, e);
    }), this.consumeContext(Le, (e) => {
      go(this, aa, e), e && x(this, _, oi).call(this);
    });
  }
  render() {
    return this._loading ? n`<div class="state"><uui-loader></uui-loader></div>` : n`
      <umb-body-layout headline="Dynamic Images">
        ${x(this, _, vr).call(this)} ${x(this, _, br).call(this)} ${x(this, _, _r).call(this)} ${x(this, _, wr).call(this)}
      </umb-body-layout>
    `;
  }
};
aa = /* @__PURE__ */ new WeakMap();
wa = /* @__PURE__ */ new WeakMap();
ke = /* @__PURE__ */ new WeakMap();
_ = /* @__PURE__ */ new WeakSet();
oi = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Es(xe(this, ke)),
      bi(xe(this, ke)).catch(() => []),
      Pa(xe(this, ke)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    x(this, _, ue).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
ue = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = xe(this, wa)) == null || s.peek(e, { data: { headline: t, message: a } });
};
pr = async function() {
  this._importing = !0;
  try {
    const e = await Wo(xe(this, ke));
    x(this, _, ue).call(this, e.created.length > 0 ? "positive" : "warning", e.created.length > 0 ? `Imported ${e.created.length} template(s)` : "Nothing was imported");
    for (const t of e.warnings.slice(0, 5)) x(this, _, ue).call(this, "warning", t);
    ai(), await x(this, _, oi).call(this);
  } catch (e) {
    x(this, _, ue).call(this, "danger", "The import failed", e);
  } finally {
    this._importing = !1;
  }
};
fr = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await Lo(this._pasteJson, "create", xe(this, ke)), x(this, _, ue).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, ai(), await x(this, _, oi).call(this);
    } catch (e) {
      x(this, _, ue).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
mr = async function(e) {
  try {
    await Io(e.key, xe(this, ke)), x(this, _, ue).call(this, "positive", `'${e.name}' duplicated`), ai(), await x(this, _, oi).call(this);
  } catch (t) {
    x(this, _, ue).call(this, "danger", "The template could not be duplicated", t);
  }
};
gr = async function(e) {
  await Cs(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Oo(e.key, xe(this, ke)), x(this, _, ue).call(this, "positive", `'${e.name}' deleted`), ai(), await x(this, _, oi).call(this);
  } catch (t) {
    x(this, _, ue).call(this, "danger", "The template could not be deleted", t);
  }
};
yr = async function(e) {
  try {
    const t = await Ao(e.key, xe(this, ke)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    x(this, _, ue).call(this, "danger", "The template could not be exported", t);
  }
};
vr = function() {
  var t;
  if (!((t = this._health) != null && t.legacyConfigPresent)) return p;
  const e = this._templates.length > 0;
  return n`
      <uui-box class="banner">
        <div class="banner-inner">
          <uui-icon name="icon-alert"></uui-icon>
          <div>
            <strong>There is still a v1 configuration block in appsettings.</strong>
            <p>
              ${e ? "Templates already exist here, so it is no longer read. You can import it again if you need to." : "Import it to bring your existing designs into the backoffice."}
            </p>
          </div>
          <uui-button
            look="primary"
            color="positive"
            label="Import from appsettings"
            ?disabled=${this._importing}
            @click=${x(this, _, pr)}>
            Import from appsettings
          </uui-button>
        </div>
      </uui-box>
    `;
};
br = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return n`
      <div class="stats">
        ${x(this, _, pi).call(this, "Templates", this._templates.length, "icon-brush")}
        ${x(this, _, pi).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${x(this, _, pi).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${x(this, _, pi).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
pi = function(e, t, i, a = !1) {
  return n`
      <uui-box class="stat ${a ? "warn" : ""}">
        <uui-icon name=${i}></uui-icon>
        <div class="stat-value">${t}</div>
        <div class="stat-label">${e}</div>
      </uui-box>
    `;
};
_r = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : n`
      <uui-box headline="Needs attention">
        <uui-table>
          ${O(
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
        <uui-button look="secondary" href=${er("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
wr = function() {
  return n`
      <uui-box headline="Templates">
        <div slot="header-actions" class="header-actions">
          <uui-button
            look="secondary"
            label="Paste a template or a v1 configuration"
            @click=${() => {
    this._showPaste = !this._showPaste;
  }}>
            Import JSON
          </uui-button>
          <uui-button look="primary" color="positive" href=${za()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? x(this, _, $r).call(this) : p}
        ${this._templates.length === 0 ? x(this, _, xr).call(this) : x(this, _, kr).call(this)}
      </uui-box>
    `;
};
$r = function() {
  return n`
      <div class="paste">
        <uui-textarea
          label="Template or v1 configuration JSON"
          placeholder="Paste an exported template, or a v1 DynamicImages configuration block"
          rows="6"
          .value=${this._pasteJson}
          @input=${(e) => {
    this._pasteJson = e.target.value;
  }}>
        </uui-textarea>
        <uui-button
          look="primary"
          label="Import the pasted JSON"
          ?disabled=${this._importing || !this._pasteJson.trim()}
          @click=${x(this, _, fr)}>
          Import
        </uui-button>
      </div>
    `;
};
xr = function() {
  return n`
      <div class="empty">
        <uui-icon name="icon-brush"></uui-icon>
        <h4>No templates yet</h4>
        <p>A template says which document types get a generated image, and what it looks like.</p>
        <uui-button look="primary" color="positive" href=${za()} label="Create your first template">
          Create your first template
        </uui-button>
      </div>
    `;
};
kr = function() {
  return n`
      <div class="cards">
        ${O(
    this._templates,
    (e) => e.key,
    (e) => n`
            <uui-box class="card ${e.isEnabled ? "" : "disabled"}">
              <div slot="headline">
                <a href=${Qt(e.key)}>${e.name}</a>
                ${e.isEnabled ? p : n`<uui-tag look="secondary">Disabled</uui-tag>`}
              </div>

              <dl>
                <dt>Applies to</dt>
                <dd>${e.docTypeAliases.join(", ") || "Nothing yet"}</dd>
                <dt>Writes to</dt>
                <dd>${e.targetPropertyAlias || "Nothing yet"}</dd>
                <dt>Canvas</dt>
                <dd>${e.canvasWidth} × ${e.canvasHeight}, ${e.layerCount} layer(s)</dd>
              </dl>

              <div class="card-actions">
                <uui-button look="secondary" href=${Qt(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => x(this, _, mr).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => x(this, _, yr).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => x(this, _, gr).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
de.styles = D`
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

    .banner {
      border-left: 4px solid var(--uui-color-warning);
    }

    .banner-inner {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-4);
      flex-wrap: wrap;
    }

    .banner-inner p {
      margin: var(--uui-size-space-1) 0 0;
      color: var(--uui-color-text-alt);
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

    .header-actions {
      display: flex;
      gap: var(--uui-size-space-3);
    }

    .paste {
      display: grid;
      gap: var(--uui-size-space-3);
      margin-bottom: var(--uui-size-layout-1);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--uui-size-space-4);
    }

    .card.disabled {
      opacity: 0.7;
    }

    .card a {
      color: inherit;
      text-decoration: none;
    }

    .card a:hover {
      text-decoration: underline;
    }

    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--uui-size-space-1) var(--uui-size-space-4);
      margin: 0 0 var(--uui-size-space-4);
      font-size: 0.9rem;
    }

    dt {
      color: var(--uui-color-text-alt);
    }

    dd {
      margin: 0;
    }

    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--uui-size-space-2);
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

    @media (max-width: 720px) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `;
st([
  h()
], de.prototype, "_templates", 2);
st([
  h()
], de.prototype, "_fonts", 2);
st([
  h()
], de.prototype, "_health", 2);
st([
  h()
], de.prototype, "_loading", 2);
st([
  h()
], de.prototype, "_importing", 2);
st([
  h()
], de.prototype, "_pasteJson", 2);
st([
  h()
], de.prototype, "_showPaste", 2);
de = st([
  P("di-overview-dashboard")
], de);
const yc = de, vc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return de;
  },
  default: yc
}, Symbol.toStringTag, { value: "Module" })), rs = /* @__PURE__ */ new Map(), Aa = (e) => `di-${e}`;
function bc(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = rs.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await Vo(e, t), o = new FontFace(Aa(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return rs.set(e, a), a;
}
async function Sr(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => bc(a, t)));
}
function Tr(e) {
  rs.delete(e);
}
const _c = new Co(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), wc = new Co(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var $c = Object.defineProperty, xc = Object.getOwnPropertyDescriptor, Cr = (e) => {
  throw TypeError(e);
}, La = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? xc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && $c(t, i, s), s;
}, Ls = (e, t, i) => t.has(e) || Cr("Cannot " + i), Se = (e, t, i) => (Ls(e, t, "read from private field"), i ? i.call(e) : t.get(e)), di = (e, t, i) => t.has(e) ? Cr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ba = (e, t, i, a) => (Ls(e, t, "write to private field"), t.set(e, i), i), z = (e, t, i) => (Ls(e, t, "access private method"), i), sa, $i, xi, $t, E, ri, Qe, ns, Er, Dr, oa, Pr, zr, Mr;
function kc(e) {
  switch (e.sourceKind) {
    case "path":
      return e.path ?? "wwwroot";
    case "url":
      return e.provider === "google" ? `Google Fonts · ${e.providerFamily ?? e.familyName}` : e.provider === "bunny" ? `Bunny Fonts · ${e.providerFamily ?? e.familyName}` : Sc(e.sourceUrl);
    default:
      return "Media library";
  }
}
function Sc(e) {
  try {
    return e ? new URL(e).host : "Web";
  } catch {
    return e ?? "Web";
  }
}
let et = class extends I {
  constructor() {
    super(), di(this, E), di(this, sa), di(this, $i), di(this, xi), this._fonts = [], this._loading = !0, di(this, $t, () => {
      var e;
      return (e = Se(this, sa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Ea, (e) => {
      Ba(this, $i, e);
    }), this.consumeContext(at, (e) => {
      Ba(this, xi, e);
    }), this.consumeContext(Le, (e) => {
      Ba(this, sa, e), e && z(this, E, ri).call(this);
    });
  }
  render() {
    return this._loading ? n`<div class="state"><uui-loader></uui-loader></div>` : n`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${z(this, E, ns)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? n`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>
                  Text layers need a font. Upload a .ttf, .otf or .woff2, point at one already in wwwroot, or use a
                  Google or Bunny web font.
                </p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${z(this, E, ns)}>
                  Add your first font
                </uui-button>
              </div>` : n`${O(this._fonts, (e) => e.key, (e) => z(this, E, Pr).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
sa = /* @__PURE__ */ new WeakMap();
$i = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
$t = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
ri = async function() {
  this._loading = !0;
  try {
    this._fonts = await bi(Se(this, $t)), await Sr(this._fonts.map((e) => e.key), Se(this, $t));
  } catch (e) {
    z(this, E, Qe).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
Qe = function(e, t, i) {
  var s;
  const a = i instanceof Ze ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Se(this, xi)) == null || s.peek(e, { data: { headline: t, message: a } });
};
ns = async function() {
  var i, a;
  if (!Se(this, $i)) return;
  const e = Se(this, $i).open(this, wc, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && ((i = t.warnings) != null && i.length && ((a = Se(this, xi)) == null || a.peek("warning", {
    data: { headline: "Some variants were not added", message: t.warnings.join(" ") }
  })), await z(this, E, ri).call(this));
};
Er = async function(e) {
  try {
    await Fo(e.key, Se(this, $t)), Tr(e.key), z(this, E, Qe).call(this, "positive", `'${e.familyName}' refreshed`), await z(this, E, ri).call(this);
  } catch (t) {
    z(this, E, Qe).call(this, "danger", "That font could not be refreshed", t);
  }
};
Dr = async function(e) {
  await Cs(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Bo(e.key, Se(this, $t)), Tr(e.key), z(this, E, Qe).call(this, "positive", `'${e.familyName}' deleted`), await z(this, E, ri).call(this);
  } catch (t) {
    z(this, E, Qe).call(this, "danger", "That font could not be deleted", t);
  }
};
oa = async function(e, t, i) {
  try {
    await Ko(e.key, t, i, Se(this, $t)), this._editingKey = void 0, z(this, E, Qe).call(this, "positive", `'${t}' saved`), await z(this, E, ri).call(this);
  } catch (a) {
    z(this, E, Qe).call(this, "danger", "The font could not be saved", a);
  }
};
Pr = function(e) {
  const t = this._editingKey === e.key;
  return n`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${kc(e)} · weight ${e.weight}
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
                  @click=${() => z(this, E, Er).call(this, e)}>
                  Refresh
                </uui-button>` : p}
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => z(this, E, Dr).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${Aa(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? z(this, E, Mr).call(this, e) : z(this, E, zr).call(this, e)}
      </div>
    `;
};
zr = function(e) {
  return e.styles.length === 0 ? p : n`<div class="tags">
      ${O(
    e.styles,
    (t) => t.name,
    (t) => n`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
Mr = function(e) {
  const t = [...e.styles];
  return n`
      <div class="editor">
        <uui-input
          label="Family name"
          .value=${e.familyName}
          id="family-${e.key}">
        </uui-input>

        <uui-table>
          <uui-table-head>
            <uui-table-head-cell>Name</uui-table-head-cell>
            <uui-table-head-cell>Size</uui-table-head-cell>
            <uui-table-head-cell>Weight</uui-table-head-cell>
            <uui-table-head-cell></uui-table-head-cell>
          </uui-table-head>
          ${O(
    t,
    (i, a) => a,
    (i, a) => n`
              <uui-table-row>
                <uui-table-cell>
                  <uui-input
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
      t.splice(a, 1), z(this, E, oa).call(this, e, e.familyName, t);
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), z(this, E, oa).call(this, e, e.familyName, t);
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`);
    z(this, E, oa).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t);
  }}>
            Save
          </uui-button>
        </div>
      </div>
    `;
};
et.styles = D`
    :host {
      display: block;
    }

    .state {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-layout-3);
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
La([
  h()
], et.prototype, "_fonts", 2);
La([
  h()
], et.prototype, "_loading", 2);
La([
  h()
], et.prototype, "_editingKey", 2);
et = La([
  P("di-fonts-dashboard")
], et);
const Tc = et, Cc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return et;
  },
  default: Tc
}, Symbol.toStringTag, { value: "Module" }));
var Ec = Object.defineProperty, Dc = Object.getOwnPropertyDescriptor, Or = (e) => {
  throw TypeError(e);
}, Fi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Ec(t, i, s), s;
}, Ws = (e, t, i) => t.has(e) || Or("Cannot " + i), Ve = (e, t, i) => (Ws(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ji = (e, t, i) => t.has(e) ? Or("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), yo = (e, t, i, a) => (Ws(e, t, "write to private field"), t.set(e, i), i), Lt = (e, t, i) => (Ws(e, t, "access private method"), i), ra, Wt, ei, Ye, $a, ls, Ir;
let Ie = class extends I {
  constructor() {
    super(), Ji(this, Ye), Ji(this, ra), Ji(this, Wt), this._loading = !0, this._busy = !1, Ji(this, ei, () => {
      var e;
      return (e = Ve(this, ra)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(at, (e) => {
      yo(this, Wt, e);
    }), this.consumeContext(Le, (e) => {
      yo(this, ra, e), e && Lt(this, Ye, $a).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => Lt(this, Ye, $a).call(this)}>Re-check</uui-button>
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
                ${O(
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
                        ${a.templateKey ? n`<a href=${Qt(a.templateKey)}>${a.templateName}</a>` : n`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${Lt(this, Ye, Ir).call(this)}
      </umb-body-layout>
    `;
  }
};
ra = /* @__PURE__ */ new WeakMap();
Wt = /* @__PURE__ */ new WeakMap();
ei = /* @__PURE__ */ new WeakMap();
Ye = /* @__PURE__ */ new WeakSet();
$a = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Pa(Ve(this, ei)),
      Jo(Ve(this, ei)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
ls = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await Zo(Ve(this, ei)) : await Qo(Ve(this, ei));
    (t = Ve(this, Wt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Ve(this, Wt)) == null || i.peek("warning", { data: { message: o } });
    await Lt(this, Ye, $a).call(this);
  } catch (s) {
    (a = Ve(this, Wt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Ir = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => Lt(this, Ye, ls).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => Lt(this, Ye, ls).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
Ie.styles = D`
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
Fi([
  h()
], Ie.prototype, "_health", 2);
Fi([
  h()
], Ie.prototype, "_sync", 2);
Fi([
  h()
], Ie.prototype, "_loading", 2);
Fi([
  h()
], Ie.prototype, "_busy", 2);
Ie = Fi([
  P("di-health-dashboard")
], Ie);
const Pc = Ie, zc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return Ie;
  },
  default: Pc
}, Symbol.toStringTag, { value: "Module" }));
function Mc(e, t) {
  const i = [], a = t.lockX ? void 0 : vo(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    Oc(t),
    t.threshold
  ), s = t.lockY ? void 0 : vo(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    Ic(t),
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
function Oc(e) {
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
function Ic(e) {
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
function vo(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const r = Math.abs(o.at - s.value);
      r > i || (!a || r < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: r });
    }
  return a;
}
var Ac = Object.defineProperty, Lc = Object.getOwnPropertyDescriptor, Ar = (e) => {
  throw TypeError(e);
}, We = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Lc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Ac(t, i, s), s;
}, Rs = (e, t, i) => t.has(e) || Ar("Cannot " + i), Fe = (e, t, i) => (Rs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Va = (e, t, i) => t.has(e) ? Ar("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ha = (e, t, i, a) => (Rs(e, t, "write to private field"), t.set(e, i), i), q = (e, t, i) => (Rs(e, t, "access private method"), i), ct, fi, U, Us, Lr, Wr, Rr, Ur, Ns, Nr, Fr, Kr, Br, Vr, Hr, jr, Gr, Xr;
const Wc = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
let ye = class extends I {
  constructor() {
    super(...arguments), Va(this, U), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, Va(this, ct), Va(this, fi);
  }
  willUpdate() {
    this._box = q(this, U, Lr).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== Fe(this, fi) && ((t = Fe(this, ct)) == null || t.disconnect(), Ha(this, fi, e), e && (Fe(this, ct) ?? Ha(this, ct, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), Fe(this, ct).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = Fe(this, ct)) == null || e.disconnect(), Ha(this, fi, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return n`
      <div
        class=${To({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${J({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...Fe(this, U, Wr) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      q(this, U, Nr).call(this, t), q(this, U, Ns).call(this, t);
    }}>
        ${q(this, U, Fr).call(this)}
      </div>

      ${this.selected ? q(this, U, Gr).call(this, e) : p}
      ${this.showMeasured && this.measured ? q(this, U, Xr).call(this) : p}
    `;
  }
};
ct = /* @__PURE__ */ new WeakMap();
fi = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakSet();
Us = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Lr = function() {
  var s;
  const e = this.layer, t = e.size.width ?? q(this, U, Rr).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? q(this, U, Ur).call(this), a = Ia(Fe(this, U, Us), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
Wr = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
Rr = function() {
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
Ur = function() {
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
Ns = function(e, t) {
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
Nr = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Fr = function() {
  switch (this.layer.type) {
    case "text":
      return q(this, U, Kr).call(this);
    case "image":
      return q(this, U, Vr).call(this);
    case "badges":
      return q(this, U, Hr).call(this);
    default:
      return q(this, U, jr).call(this);
  }
};
Kr = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || q(this, U, Br).call(this);
  return n`
      <div
        class="text"
        style=${J({
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
Br = function() {
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
Vr = function() {
  if (this.layer.type !== "image") return p;
  const e = this.layer.border;
  return n`
      <div
        class="image"
        style=${J({
    borderRadius: `${this.layer.cornerRadius * this.scale}px`,
    border: e ? `${e.width * this.scale}px solid ${e.colour}` : "none"
  })}>
        <uui-icon name="icon-picture"></uui-icon>
        <span>${this.layer.source.kind === "property" ? this.layer.source.propertyAlias : this.layer.source.kind}</span>
      </div>
    `;
};
Hr = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: r } = this.layer, c = s === "horizontal", m = c && o, b = t.position ?? "below";
  return n`
      <div
        class="badges"
        style=${J({
    flexDirection: c ? "row" : "column",
    flexWrap: m ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...m ? { rowGap: `${r * this.scale}px` } : {}
  })}>
        ${O(
    Array.from({ length: Math.max(1, a) }, (W, nt) => nt),
    (W) => W,
    () => n`
            <div class=${To({ badge: !0, right: b === "right" })}>
              <div
                class="circle"
                style=${J({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${b === "none" ? p : n`<div
                    class="badge-label"
                    style=${J({
      ...b === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
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
jr = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer.gradient;
  return n`
      <div
        class="rect"
        style=${J({
    background: e ? `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})` : this.layer.fill ?? "transparent",
    borderRadius: `${this.layer.cornerRadius * this.scale}px`
  })}>
      </div>
    `;
};
Gr = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = Fe(this, U, Us), r = Te(this.layer.position, "x") || Te(this.layer.position, "y");
  return n`
      <div class="chrome" style=${J({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px` })}>
        <span class="tag">
          ${r ? n`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : O(
    Wc,
    (c) => c,
    (c) => n`
                <span
                  class="handle ${c}"
                  role="button"
                  tabindex="-1"
                  aria-label="Resize ${c}"
                  @pointerdown=${(m) => q(this, U, Ns).call(this, m, c)}>
                </span>
              `
  )}

        <span
          class="anchor"
          title="Anchor: ${o.anchor}"
          style=${J({
    left: `${(o.x - e.x) * this.scale}px`,
    top: `${(o.y - e.y) * this.scale}px`
  })}>
        </span>
      </div>
    `;
};
Xr = function() {
  const e = this.measured;
  return n`
      <div
        class="measured"
        style=${J({
    left: `${e.x * this.scale}px`,
    top: `${e.y * this.scale}px`,
    width: `${e.width * this.scale}px`,
    height: `${e.height * this.scale}px`
  })}>
      </div>
    `;
};
ye.styles = D`
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

    .rect {
      width: 100%;
      height: 100%;
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
We([
  f({ type: Object })
], ye.prototype, "layer", 2);
We([
  f({ type: Number })
], ye.prototype, "scale", 2);
We([
  f({ type: Boolean, reflect: !0 })
], ye.prototype, "selected", 2);
We([
  f({ type: Object })
], ye.prototype, "measured", 2);
We([
  f({ type: Boolean })
], ye.prototype, "showMeasured", 2);
We([
  f({ type: String })
], ye.prototype, "resolvedText", 2);
We([
  f({ attribute: !1 })
], ye.prototype, "resolvedPosition", 2);
We([
  h()
], ye.prototype, "_box", 2);
ye = We([
  P("di-layer-box")
], ye);
var Rc = Object.defineProperty, Uc = Object.getOwnPropertyDescriptor, Yr = (e) => {
  throw TypeError(e);
}, Fs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Uc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Rc(t, i, s), s;
}, Nc = (e, t, i) => t.has(e) || Yr("Cannot " + i), Fc = (e, t, i) => t.has(e) ? Yr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Kc = (e, t, i) => (Nc(e, t, "access private method"), i), cs, qr;
let ki = class extends I {
  constructor() {
    super(...arguments), Fc(this, cs), this.guides = [], this.scale = 1;
  }
  render() {
    return n`${O(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => Kc(this, cs, qr).call(this, e)
    )}`;
  }
};
cs = /* @__PURE__ */ new WeakSet();
qr = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? n`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : n`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
ki.styles = D`
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
Fs([
  f({ type: Array })
], ki.prototype, "guides", 2);
Fs([
  f({ type: Number })
], ki.prototype, "scale", 2);
ki = Fs([
  P("di-guides")
], ki);
var Bc = Object.defineProperty, Vc = Object.getOwnPropertyDescriptor, Jr = (e) => {
  throw TypeError(e);
}, Ki = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Vc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Bc(t, i, s), s;
}, Hc = (e, t, i) => t.has(e) || Jr("Cannot " + i), jc = (e, t, i) => t.has(e) ? Jr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), bo = (e, t, i) => (Hc(e, t, "access private method"), i), na, us;
let H = class extends I {
  constructor() {
    super(...arguments), jc(this, na), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    bo(this, na, us).call(this, "top"), bo(this, na, us).call(this, "left");
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
na = /* @__PURE__ */ new WeakSet();
us = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : H.thickness) * o, t.height = (e === "top" ? H.thickness : s) * o, t.style.width = `${e === "top" ? s : H.thickness}px`, t.style.height = `${e === "top" ? H.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const r = getComputedStyle(this);
  i.strokeStyle = r.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = r.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let c = 0; c <= a; c += 50) {
    const m = Math.round(c * this.scale) + 0.5, b = c % 100 === 0, W = b ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(m, H.thickness - W), i.lineTo(m, H.thickness)) : (i.moveTo(H.thickness - W, m), i.lineTo(H.thickness, m)), i.stroke(), b && c > 0 && (e === "top" ? i.fillText(String(c), m + 2, 9) : (i.save(), i.translate(9, m - 2), i.rotate(-Math.PI / 2), i.fillText(String(c), 0, 0), i.restore()));
  }
};
H.thickness = 20;
H.styles = D`
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
Ki([
  f({ type: Number })
], H.prototype, "canvasWidth", 2);
Ki([
  f({ type: Number })
], H.prototype, "canvasHeight", 2);
Ki([
  f({ type: Number })
], H.prototype, "scale", 2);
Ki([
  f({ type: Object })
], H.prototype, "pointer", 2);
H = Ki([
  P("di-rulers")
], H);
var Gc = Object.defineProperty, Xc = Object.getOwnPropertyDescriptor, Zr = (e) => {
  throw TypeError(e);
}, Z = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Xc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Gc(t, i, s), s;
}, Ks = (e, t, i) => t.has(e) || Zr("Cannot " + i), M = (e, t, i) => (Ks(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ee = (e, t, i) => t.has(e) ? Zr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), la = (e, t, i, a) => (Ks(e, t, "write to private field"), t.set(e, i), i), se = (e, t, i) => (Ks(e, t, "access private method"), i), ut, mi, Rt, G, ds, hs, ps, Qr, Bs, en, tn, fs, ca, Pt, an, ms, gs, ys, vs, bs, _s, sn;
const Yc = 6, on = 20;
let j = class extends I {
  constructor() {
    super(...arguments), ee(this, G), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ee(this, ut), ee(this, mi), ee(this, Rt, /* @__PURE__ */ new Map()), ee(this, fs, (e) => {
      const t = this.template.layers.find((i) => i.key === e.detail.key);
      !t || t.isLocked || (la(this, ut, {
        key: t.key,
        handle: e.detail.handle,
        startClientX: e.detail.startX,
        startClientY: e.detail.startY,
        startBox: se(this, G, ps).call(this, t),
        moved: !1,
        shiftKey: e.detail.shiftKey,
        altKey: e.detail.altKey
      }), this.dispatchEvent(new CustomEvent("di-transaction-begin", { bubbles: !0, composed: !0 })));
    }), ee(this, ca, (e) => {
      var li, Xi;
      this._pointer = se(this, G, hs).call(this, e.clientX, e.clientY);
      const t = M(this, ut);
      if (!t) return;
      const i = this.template.layers.find((De) => De.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      t.moved = !0;
      let o = t.handle ? se(this, G, an).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      const r = Te(i.position, "x"), c = Te(i.position, "y");
      r && (o = { ...o, x: t.startBox.x, width: (li = t.handle) != null && li.includes("w") ? t.startBox.width : o.width }), c && (o = { ...o, y: t.startBox.y, height: (Xi = t.handle) != null && Xi.includes("n") ? t.startBox.height : o.height });
      const b = this.snapEnabled && !e.altKey ? Mc(o, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((De) => De.key !== i.key).map((De) => se(this, G, ps).call(this, De)),
        threshold: Yc / this.scale,
        lockX: r,
        lockY: c
      }) : {
        box: { ...o, x: r ? o.x : Math.round(o.x), y: c ? o.y : Math.round(o.y) },
        guides: []
      };
      this._guides = b.guides;
      const W = Gl(b.box, i.position);
      r && (W.x = i.position.x), c && (W.y = i.position.y);
      const nt = { position: W };
      t.handle && (nt.size = {
        width: Math.max(1, Math.round(b.box.width)),
        height: Math.max(1, Math.round(b.box.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: nt } })
      );
    }), ee(this, Pt, () => {
      if (!M(this, ut)) return;
      const e = M(this, ut).moved;
      la(this, ut, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ee(this, ms, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ee(this, gs, () => {
      this._dropTarget = !1;
    }), ee(this, ys, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = se(this, G, hs).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y }
        })
      );
    }), ee(this, vs, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ee(this, bs, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => rr(t.position)) && this.requestUpdate();
    }), ee(this, _s, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), la(this, mi, new ResizeObserver(() => se(this, G, ds).call(this))), M(this, mi).observe(this), window.addEventListener("pointermove", M(this, ca)), window.addEventListener("pointerup", M(this, Pt)), window.addEventListener("pointercancel", M(this, Pt));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = M(this, mi)) == null || e.disconnect(), window.removeEventListener("pointermove", M(this, ca)), window.removeEventListener("pointerup", M(this, Pt)), window.removeEventListener("pointercancel", M(this, Pt));
  }
  updated() {
    se(this, G, ds).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = M(this, Rt).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    se(this, G, Qr).call(this);
    const s = this.showRulers ? on : 0;
    return n`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${M(this, vs)}
        @dragover=${M(this, ms)}
        @dragleave=${M(this, gs)}
        @drop=${M(this, ys)}
        @di-layer-drag-start=${M(this, fs)}
        @di-layer-box-resize=${M(this, bs)}>
        <div
          class="artboard"
          style=${J({
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
            style=${J({ background: e.background })}
            @pointerdown=${M(this, _s)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? n`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${J({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${O(
      this.template.layers,
      (o) => o.key,
      (o) => {
        var r, c;
        return n`
                <di-layer-box
                  data-key=${o.key}
                  .layer=${o}
                  .scale=${this.scale}
                  .selected=${o.key === this.selectedLayerKey}
                  .measured=${a.get(o.key)}
                  .showMeasured=${this.showMeasured}
                  .resolvedText=${((r = a.get(o.key)) == null ? void 0 : r.resolvedText) ?? void 0}
                  .resolvedPosition=${(c = M(this, Rt).get(o.key)) == null ? void 0 : c.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? se(this, G, sn).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
ut = /* @__PURE__ */ new WeakMap();
mi = /* @__PURE__ */ new WeakMap();
Rt = /* @__PURE__ */ new WeakMap();
G = /* @__PURE__ */ new WeakSet();
ds = function() {
  const e = this.renderRoot.querySelector(".viewport");
  if (!e || !this.template) return;
  const t = 48 + (this.showRulers ? on : 0), i = {
    width: Math.max(1, e.clientWidth - t),
    height: Math.max(1, e.clientHeight - t)
  }, a = Math.min(
    i.width / this.template.canvas.width,
    i.height / this.template.canvas.height,
    // Never scale a small canvas up past 1:1 by default - it would look soft for no reason.
    1
  );
  Math.abs(a - this._fitScale) > 1e-3 && (this._fitScale = a);
};
hs = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return {
    x: Math.round((e - a.left) / this.scale),
    y: Math.round((t - a.top) / this.scale)
  };
};
ps = function(e) {
  const t = M(this, Rt).get(e.key);
  if (t) return t.box;
  const i = se(this, G, Bs).call(this, e), a = Ia(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Qr = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  la(this, Rt, Zl(
    this.template.layers,
    (i) => se(this, G, Bs).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Bs = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? se(this, G, en).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? se(this, G, tn).call(this, e, i)
  };
};
en = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
tn = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
fs = /* @__PURE__ */ new WeakMap();
ca = /* @__PURE__ */ new WeakMap();
Pt = /* @__PURE__ */ new WeakMap();
an = function(e, t, i, a, s) {
  let { x: o, y: r, width: c, height: m } = e;
  if (t.includes("w") && (o = e.x + i, c = e.width - i), t.includes("e") && (c = e.width + i), t.includes("n") && (r = e.y + a, m = e.height - a), t.includes("s") && (m = e.height + a), s && e.width > 0 && e.height > 0) {
    const b = e.width / e.height;
    Math.abs(c - e.width) >= Math.abs(m - e.height) ? m = c / b : c = m * b, t.includes("n") && (r = e.y + e.height - m), t.includes("w") && (o = e.x + e.width - c);
  }
  return { x: o, y: r, width: Math.max(4, c), height: Math.max(4, m) };
};
ms = /* @__PURE__ */ new WeakMap();
gs = /* @__PURE__ */ new WeakMap();
ys = /* @__PURE__ */ new WeakMap();
vs = /* @__PURE__ */ new WeakMap();
bs = /* @__PURE__ */ new WeakMap();
_s = /* @__PURE__ */ new WeakMap();
sn = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return n`<div class="safe-area" style=${J({ top: `${i}px`, bottom: `${i}px` })}></div>`;
};
j.styles = D`
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
      /* Hard-coded: a checkerboard has to read as "nothing here" in both light and dark
         backoffice themes, and no UUI token means that. */
      background-color: #26262b;
      background-image:
        linear-gradient(45deg, #303036 25%, transparent 25%),
        linear-gradient(-45deg, #303036 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #303036 75%),
        linear-gradient(-45deg, transparent 75%, #303036 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0;
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
Z([
  f({ type: Object })
], j.prototype, "template", 2);
Z([
  f({ type: String })
], j.prototype, "selectedLayerKey", 2);
Z([
  f({ type: Object })
], j.prototype, "baseImageUrl", 2);
Z([
  f({ type: Array })
], j.prototype, "serverBounds", 2);
Z([
  f({ type: Boolean })
], j.prototype, "showMeasured", 2);
Z([
  f({ type: Boolean })
], j.prototype, "snapEnabled", 2);
Z([
  f({ type: Boolean })
], j.prototype, "showRulers", 2);
Z([
  f({ type: Boolean })
], j.prototype, "showSafeArea", 2);
Z([
  f({ type: Number })
], j.prototype, "zoom", 2);
Z([
  h()
], j.prototype, "_fitScale", 2);
Z([
  h()
], j.prototype, "_guides", 2);
Z([
  h()
], j.prototype, "_pointer", 2);
Z([
  h()
], j.prototype, "_dropTarget", 2);
j = Z([
  P("di-designer-canvas")
], j);
var qc = Object.defineProperty, Jc = Object.getOwnPropertyDescriptor, rn = (e) => {
  throw TypeError(e);
}, Vs = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jc(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && qc(t, i, s), s;
}, nn = (e, t, i) => t.has(e) || rn("Cannot " + i), Zc = (e, t, i) => (nn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Qc = (e, t, i) => t.has(e) ? rn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Oe = (e, t, i) => (nn(e, t, "access private method"), i), ce, ln, cn, un, dn, hn, It;
const _o = {
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
let Si = class extends I {
  constructor() {
    super(...arguments), Qc(this, ce), this.properties = [], this._search = "";
  }
  render() {
    const e = eu(Zc(this, ce, ln));
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

        ${this.properties.length === 0 ? n`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : O(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => Oe(this, ce, dn).call(this, t, i)
    )}

        ${Oe(this, ce, hn).call(this)}
      </div>
    `;
  }
};
ce = /* @__PURE__ */ new WeakSet();
ln = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
cn = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
un = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
dn = function(e, t) {
  return n`
      <div class="group">
        <h5>${e}</h5>
        ${O(
    t,
    (i) => i.alias,
    (i) => Oe(this, ce, It).call(this, i.name, _o[i.classification] ?? _o.other, i.classification, { kind: "property", property: i })
  )}
      </div>
    `;
};
hn = function() {
  return n`
      <div class="group">
        <h5>Static</h5>
        ${Oe(this, ce, It).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Oe(this, ce, It).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Oe(this, ce, It).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Oe(this, ce, It).call(this, "Shape", "icon-layers", "other", { kind: "static", layerType: "rect" })}
      </div>
    `;
};
It = function(e, t, i, a) {
  return n`
      <div
        class="chip ${i}"
        draggable="true"
        @dragstart=${(s) => Oe(this, ce, un).call(this, s, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${e}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label="Add ${e} to the canvas"
          @click=${() => Oe(this, ce, cn).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
Si.styles = D`
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

    .empty {
      margin: 0;
      color: var(--uui-color-text-alt);
      font-size: 13px;
    }
  `;
Vs([
  f({ type: Array })
], Si.prototype, "properties", 2);
Vs([
  h()
], Si.prototype, "_search", 2);
Si = Vs([
  P("di-property-palette")
], Si);
function eu(e) {
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
var tu = Object.defineProperty, iu = Object.getOwnPropertyDescriptor, pn = (e) => {
  throw TypeError(e);
}, Wa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? iu(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && tu(t, i, s), s;
}, fn = (e, t, i) => t.has(e) || pn("Cannot " + i), He = (e, t, i) => (fn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), au = (e, t, i) => t.has(e) ? pn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), yi = (e, t, i) => (fn(e, t, "access private method"), i), X, Ti, vi, Ra, mn, gn;
let ti = class extends I {
  constructor() {
    super(...arguments), au(this, X), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
  }
  render() {
    return n`
      <div class="wrap">
        <button
          class="swatch"
          type="button"
          aria-label="${this.label}: ${this.value}"
          aria-expanded=${this._open}
          @click=${() => {
      this._open = !this._open;
    }}>
          <span class="chip" style="background:${He(this, X, Ti)};opacity:${He(this, X, vi)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => yi(this, X, Ra).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? n`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${He(this, X, Ti)}
                  @input=${(e) => yi(this, X, mn).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(He(this, X, vi))}
                    @input=${(e) => yi(this, X, gn).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(He(this, X, vi) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
X = /* @__PURE__ */ new WeakSet();
Ti = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
vi = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
Ra = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
mn = function(e) {
  const t = He(this, X, vi);
  yi(this, X, Ra).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${yn(t)}`);
};
gn = function(e) {
  yi(this, X, Ra).call(this, e >= 0.999 ? He(this, X, Ti).toUpperCase() : `${He(this, X, Ti).toUpperCase()}${yn(e)}`);
};
ti.styles = D`
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
Wa([
  f({ type: String })
], ti.prototype, "value", 2);
Wa([
  f({ type: String })
], ti.prototype, "label", 2);
Wa([
  h()
], ti.prototype, "_open", 2);
ti = Wa([
  P("di-colour-input")
], ti);
const yn = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var su = Object.defineProperty, ou = Object.getOwnPropertyDescriptor, vn = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ou(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && su(t, i, s), s;
};
const wo = {
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
let xa = class extends I {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return n`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${O(
      sr,
      (e) => e,
      (e) => n`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${wo[e]}
              title=${wo[e]}
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
xa.styles = D`
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
vn([
  f({ type: String })
], xa.prototype, "value", 2);
xa = vn([
  P("di-anchor-picker")
], xa);
var ru = Object.defineProperty, nu = Object.getOwnPropertyDescriptor, bn = (e) => {
  throw TypeError(e);
}, ot = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nu(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && ru(t, i, s), s;
}, lu = (e, t, i) => t.has(e) || bn("Cannot " + i), cu = (e, t, i) => t.has(e) ? bn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), uu = (e, t, i) => (lu(e, t, "access private method"), i), ws, _n;
let Ee = class extends I {
  constructor() {
    super(...arguments), cu(this, ws), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
  }
  render() {
    return n`
      <label class="field">
        ${this.label ? n`<span class="label">${this.label}</span>` : p}
        <span class="input">
          <input
            type="number"
            aria-label=${this.label}
            .value=${this.value === null || this.value === void 0 ? "" : String(this.value)}
            placeholder=${this.placeholder}
            step=${this.step}
            min=${this.min ?? p}
            max=${this.max ?? p}
            @change=${uu(this, ws, _n)} />
          ${this.suffix ? n`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
ws = /* @__PURE__ */ new WeakSet();
_n = function(e) {
  const t = e.target.value, i = t === "" ? null : Number(t);
  this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: i } }));
};
Ee.styles = D`
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
ot([
  f({ type: Number })
], Ee.prototype, "value", 2);
ot([
  f({ type: String })
], Ee.prototype, "label", 2);
ot([
  f({ type: String })
], Ee.prototype, "suffix", 2);
ot([
  f({ type: Number })
], Ee.prototype, "step", 2);
ot([
  f({ type: Number })
], Ee.prototype, "min", 2);
ot([
  f({ type: Number })
], Ee.prototype, "max", 2);
ot([
  f({ type: String })
], Ee.prototype, "placeholder", 2);
Ee = ot([
  P("di-number-field")
], Ee);
var du = Object.defineProperty, hu = Object.getOwnPropertyDescriptor, wn = (e) => {
  throw TypeError(e);
}, Bi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hu(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && du(t, i, s), s;
}, pu = (e, t, i) => t.has(e) || wn("Cannot " + i), fu = (e, t, i) => t.has(e) ? wn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (pu(e, t, "access private method"), i), u, y, Ne, $n, xn, kn, Sn, Tn, Cn, En, Dn, $s, Pn, ua, zn, Mn, ni, Hs, On;
let xt = class extends I {
  constructor() {
    super(...arguments), fu(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? n`<div class="inspector">${this.layer ? d(this, u, xn).call(this, this.layer) : d(this, u, $n).call(this)}</div>` : p;
  }
};
u = /* @__PURE__ */ new WeakSet();
y = function(e) {
  this.layer && this.dispatchEvent(
    new CustomEvent("di-layer-change", {
      bubbles: !0,
      composed: !0,
      detail: { key: this.layer.key, patch: e }
    })
  );
};
Ne = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
$n = function() {
  const e = this.template.canvas;
  return n`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            label="Width"
            .value=${e.width}
            @change=${(t) => d(this, u, Ne).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            label="Height"
            .value=${e.height}
            @change=${(t) => d(this, u, Ne).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Background</span>
          <di-colour-input
            label="Canvas background"
            .value=${e.background}
            @change=${(t) => d(this, u, Ne).call(this, { background: t.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${In(e.baseImage.kind)}
              @change=${(t) => d(this, u, Ne).call(this, {
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

        ${e.baseImage.kind === "path" ? n`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${e.baseImage.path ?? ""}
                placeholder="/assets/og-background.png"
                @change=${(t) => d(this, u, Ne).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? n`<label class="field">
              <span>From property</span>
              ${d(this, u, ni).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, Ne).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${re(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => d(this, u, Ne).call(this, { baseImageFit: t.target.value })}>
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
xn = function(e) {
  return n`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, y).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, kn).call(this, e) : p}
      ${e.type === "text" ? d(this, u, Sn).call(this, e) : p}
      ${e.type === "image" ? d(this, u, Tn).call(this, e) : p}
      ${e.type === "badges" ? d(this, u, Cn).call(this, e) : p}
      ${e.type === "rect" ? d(this, u, En).call(this, e) : p}
      ${d(this, u, Dn).call(this, e)} ${d(this, u, Mn).call(this, e)}
    `;
};
kn = function(e) {
  const t = e.binding;
  return n`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${re(
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
            @change=${(i) => d(this, u, y).call(this, {
    binding: { ...t, kind: i.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? n`<label class="field">
              <span>Property</span>
              ${d(this, u, ni).call(this, t.propertyAlias ?? "", (i) => d(this, u, y).call(this, { binding: { ...t, propertyAlias: i } }))}
            </label>` : p}

        ${t.kind === "date" ? n`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => d(this, u, y).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "static" || t.kind === "expression" ? n`<label class="field">
              <span>${t.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => d(this, u, y).call(this, {
    binding: { ...t, text: i.target.value }
  })}>
              </uui-textarea>
              ${t.kind === "expression" ? n`<small class="hint">
                    Tokens: <code>{name}</code>, <code>{readingTime}</code>, <code>{prop:alias}</code>,
                    <code>{date:alias:format}</code>
                  </small>` : p}
            </label>` : p}

        <div class="pair">
          <label class="field">
            <span>Prefix</span>
            <uui-input
              .value=${e.prefix ?? ""}
              @change=${(i) => d(this, u, y).call(this, { prefix: i.target.value })}>
            </uui-input>
          </label>
          <label class="field">
            <span>Suffix</span>
            <uui-input
              .value=${e.suffix ?? ""}
              @change=${(i) => d(this, u, y).call(this, { suffix: i.target.value })}>
            </uui-input>
          </label>
        </div>
      </uui-box>
    `;
};
Sn = function(e) {
  const t = e.style, i = (a) => d(this, u, y).call(this, { style: { ...t, ...a } });
  return n`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, Hs).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${d(this, u, On).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

        <div class="pair">
          <di-number-field
            label="Size"
            .value=${t.fontSize}
            @change=${(a) => i({ fontSize: a.detail.value ?? t.fontSize })}>
          </di-number-field>
          <label class="field">
            <span>Weight</span>
            <uui-select
              .value=${t.fontStyle}
              .options=${re(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${re(["left", "centre", "right"], t.textAlign)}
            @change=${(a) => i({ textAlign: a.target.value })}>
          </uui-select>
        </label>

        <div class="pair">
          <di-number-field
            label="Line spacing"
            suffix="×"
            step="0.05"
            .value=${t.lineSpacing}
            @change=${(a) => i({ lineSpacing: a.detail.value ?? 1 })}>
          </di-number-field>
          <di-number-field
            label="Letter spacing"
            .value=${t.letterSpacing}
            @change=${(a) => i({ letterSpacing: a.detail.value ?? 0 })}>
          </di-number-field>
        </div>

        <div class="pair">
          <di-number-field
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
              .options=${re(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${re(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
Tn = function(e) {
  var i;
  const t = e.source;
  return n`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${In(t.kind)}
            @change=${(a) => d(this, u, y).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? n`<label class="field">
              <span>Property</span>
              ${d(this, u, ni).call(this, t.propertyAlias ?? "", (a) => d(this, u, y).call(this, { source: { ...t, propertyAlias: a } }), "media")}
            </label>` : p}

        ${t.kind === "path" ? n`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => d(this, u, y).call(this, {
    source: { ...t, path: a.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "media" ? n`<uui-button
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
            .options=${re(["cover", "contain", "stretch"], e.fit)}
            @change=${(a) => d(this, u, y).call(this, { fit: a.target.value })}>
          </uui-select>
        </label>

        <di-number-field
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(a) => d(this, u, y).call(this, { cornerRadius: a.detail.value ?? 0 })}>
        </di-number-field>

        <label class="field">
          <span>Border</span>
          <div class="row">
            <di-number-field
              label="Width"
              .value=${((i = e.border) == null ? void 0 : i.width) ?? 0}
              @change=${(a) => {
    var o;
    const s = a.detail.value ?? 0;
    d(this, u, y).call(this, {
      border: s > 0 ? { width: s, colour: ((o = e.border) == null ? void 0 : o.colour) ?? "#FFFFFF" } : null
    });
  }}>
            </di-number-field>
            ${e.border ? n`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => d(this, u, y).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : p}
          </div>
        </label>
      </uui-box>
    `;
};
Cn = function(e) {
  const t = (s) => d(this, u, y).call(this, { badge: { ...e.badge, ...s } }), i = (s) => d(this, u, y).call(this, { label: { ...e.label, ...s } }), a = (s) => d(this, u, y).call(this, { icon: { ...e.icon, ...s } });
  return n`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${d(this, u, ni).call(this, e.itemsPropertyAlias, (s) => d(this, u, y).call(this, { itemsPropertyAlias: s }))}
        </label>

        <div class="pair">
          <di-number-field
            label="Max items"
            suffix=""
            .value=${e.maxItems}
            @change=${(s) => d(this, u, y).call(this, { maxItems: s.detail.value ?? 2 })}>
          </di-number-field>
          <di-number-field
            label="Gap"
            .value=${e.gap}
            @change=${(s) => d(this, u, y).call(this, { gap: s.detail.value ?? 40 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Direction</span>
          <uui-select
            .value=${e.direction}
            .options=${re(["horizontal", "vertical"], e.direction)}
            @change=${(s) => d(this, u, y).call(this, { direction: s.target.value })}>
          </uui-select>
        </label>

        ${e.direction === "horizontal" ? n`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => d(this, u, y).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </label>

              ${e.wrap ? n`
                    <di-number-field
                      label="Row gap"
                      .value=${e.rowGap}
                      @change=${(s) => d(this, u, y).call(this, { rowGap: s.detail.value ?? 20 })}>
                    </di-number-field>
                    <small class="hint">Rows are wrapped against the Width in the Layout box below.</small>
                  ` : p}
            ` : p}

        <div class="pair">
          <di-number-field
            label="Circle size"
            .value=${e.badge.size}
            @change=${(s) => t({ size: s.detail.value ?? 88 })}>
          </di-number-field>
          <di-number-field
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
            .options=${re(["below", "right", "none"], e.label.position, {
    below: "Below the icon",
    right: "Beside the icon",
    none: "Icon only"
  })}
            @change=${(s) => i({ position: s.target.value })}>
          </uui-select>
          ${e.label.position === "right" ? n`<small class="hint">Each badge is as wide as its own label.</small>` : p}
        </label>

        ${e.label.position === "none" ? p : n`
              <label class="field">
                <span>Label font</span>
                <uui-select
                  .value=${e.label.fontKey}
                  .options=${d(this, u, Hs).call(this, e.label.fontKey)}
                  @change=${(s) => i({ fontKey: s.target.value })}>
                </uui-select>
              </label>

              <div class="pair">
                <di-number-field
                  label="Label size"
                  .value=${e.label.fontSize}
                  @change=${(s) => i({ fontSize: s.detail.value ?? 22 })}>
                </di-number-field>
                <di-number-field
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
                  .options=${re(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
En = function(e) {
  return n`
      <uui-box headline="Shape">
        <label class="field">
          <span>Fill</span>
          <di-colour-input
            label="Fill colour"
            .value=${e.fill ?? "#000000"}
            @change=${(t) => d(this, u, y).call(this, { fill: t.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Gradient</span>
          <uui-toggle
            ?checked=${!!e.gradient}
            @change=${(t) => d(this, u, y).call(this, {
    gradient: t.target.checked ? { from: "#000000CC", to: "#00000000", angle: 180 } : null
  })}>
          </uui-toggle>
        </label>

        ${e.gradient ? n`
              <div class="pair">
                <di-colour-input
                  label="From"
                  .value=${e.gradient.from}
                  @change=${(t) => d(this, u, y).call(this, { gradient: { ...e.gradient, from: t.detail.value } })}>
                </di-colour-input>
                <di-colour-input
                  label="To"
                  .value=${e.gradient.to}
                  @change=${(t) => d(this, u, y).call(this, { gradient: { ...e.gradient, to: t.detail.value } })}>
                </di-colour-input>
              </div>
              <di-number-field
                label="Angle"
                suffix="°"
                .value=${e.gradient.angle}
                @change=${(t) => d(this, u, y).call(this, { gradient: { ...e.gradient, angle: t.detail.value ?? 180 } })}>
              </di-number-field>
            ` : p}

        <di-number-field
          label="Corner radius"
          .value=${e.cornerRadius}
          @change=${(t) => d(this, u, y).call(this, { cornerRadius: t.detail.value ?? 0 })}>
        </di-number-field>
      </uui-box>
    `;
};
Dn = function(e) {
  const t = Te(e.position, "x"), i = Te(e.position, "y");
  return n`
      <uui-box headline="Layout">
        ${d(this, u, $s).call(this, e, "x")} ${d(this, u, $s).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(a) => d(this, u, zn).call(this, e, a.detail.value)}>
          </di-anchor-picker>
          <small class="hint">
            Where X and Y sit on the layer's box.
            ${t || i ? n`The ${t && i ? "horizontal and vertical" : t ? "horizontal" : "vertical"}
                  ${t && i ? "components are" : "component is"} set by the edge
                  ${t && i ? "each axis tracks" : "that axis tracks"}.` : p}
          </small>
        </label>

        <div class="pair">
          <di-number-field
            label="Width"
            placeholder="Auto"
            .value=${e.size.width ?? null}
            @change=${(a) => d(this, u, y).call(this, { size: { ...e.size, width: a.detail.value } })}>
          </di-number-field>
          <di-number-field
            label="Height"
            placeholder="Auto"
            .value=${e.size.height ?? null}
            @change=${(a) => d(this, u, y).call(this, { size: { ...e.size, height: a.detail.value } })}>
          </di-number-field>
        </div>
      </uui-box>
    `;
};
$s = function(e, t) {
  const i = Te(e.position, t), a = va(e.position, t), s = this.template.layers.filter((r) => r.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
  return n`
      <div class="axis">
        <label class="field">
          <span>${t === "x" ? "Horizontal position" : "Vertical position"}</span>
          <uui-select
            .value=${i ? "relative" : "absolute"}
            .options=${[
    { name: "Absolute", value: "absolute", selected: !i },
    { name: "Relative to a layer", value: "relative", selected: i }
  ]}
            @change=${(r) => d(this, u, Pn).call(this, e, t, r.target.value)}>
          </uui-select>
          ${!i && s.length === 0 ? n`<small class="hint">Add another layer to position this one against it.</small>` : p}
        </label>

        ${i && a ? n`
              <label class="field">
                <span>Tracks</span>
                <div class="row">
                  <uui-select
                    .value=${a.layerKey}
                    .options=${s.map((r) => ({
    name: r.name || r.type,
    value: r.key,
    selected: r.key === a.layerKey
  }))}
                    @change=${(r) => d(this, u, ua).call(this, e, t, { layerKey: r.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${re(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(r) => d(this, u, ua).call(this, e, t, { edge: r.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                label="Gap"
                .value=${a.gap}
                @change=${(r) => d(this, u, ua).call(this, e, t, { gap: r.detail.value ?? 0 })}>
              </di-number-field>
            ` : n`
              <di-number-field
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(r) => d(this, u, y).call(this, {
    position: { ...e.position, [t]: r.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
Pn = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (Te(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && d(this, u, y).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Xl
      }
    }
  });
};
ua = function(e, t, i) {
  const a = va(e.position, t);
  a && d(this, u, y).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
zn = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? jl(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, y).call(this, { position: s });
};
Mn = function(e) {
  return n`
      <uui-box headline="Behaviour">
        <label class="field inline">
          <span>Visible</span>
          <uui-toggle
            ?checked=${e.isVisible}
            @change=${(t) => d(this, u, y).call(this, { isVisible: t.target.checked })}>
          </uui-toggle>
        </label>

        <label class="field inline">
          <span>Locked</span>
          <uui-toggle
            ?checked=${e.isLocked}
            @change=${(t) => d(this, u, y).call(this, { isLocked: t.target.checked })}>
          </uui-toggle>
        </label>

        <di-number-field
          label="Opacity"
          suffix=""
          step="0.05"
          min="0"
          max="1"
          .value=${e.opacity}
          @change=${(t) => d(this, u, y).call(this, { opacity: t.detail.value ?? 1 })}>
        </di-number-field>

        <label class="field">
          <span>Show this layer</span>
          <uui-select
            .value=${e.visibility.rule}
            .options=${re(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
    always: "Always",
    whenNotEmpty: "When it has a value",
    whenPropertyTruthy: "When another property is set"
  })}
            @change=${(t) => d(this, u, y).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </label>

        ${e.visibility.rule === "whenPropertyTruthy" ? n`<label class="field">
              <span>Controlled by</span>
              ${d(this, u, ni).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, y).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
ni = function(e, t, i) {
  const a = i ? this.properties.filter((s) => s.classification === i) : this.properties;
  return n`
      <uui-select
        .value=${e}
        .options=${[
    { name: "- none -", value: "" },
    ...a.map((s) => ({
      name: `${s.name} (${s.alias})`,
      value: s.alias,
      selected: s.alias === e
    }))
  ]}
        @change=${(s) => t(s.target.value)}>
      </uui-select>
    `;
};
Hs = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
On = function(e, t, i) {
  const a = this.fonts.find((s) => s.key === e);
  return !a || a.styles.length === 0 ? p : n`
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
    const o = s.target.value, r = a.styles.find((c) => c.name === o);
    i(o, r == null ? void 0 : r.size, r == null ? void 0 : r.fontStyle);
  }}>
        </uui-select>
      </label>
    `;
};
xt.styles = D`
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
Bi([
  f({ type: Object })
], xt.prototype, "template", 2);
Bi([
  f({ type: Object })
], xt.prototype, "layer", 2);
Bi([
  f({ type: Array })
], xt.prototype, "properties", 2);
Bi([
  f({ type: Array })
], xt.prototype, "fonts", 2);
xt = Bi([
  P("di-layer-inspector")
], xt);
function re(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function In(e) {
  return re(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var mu = Object.defineProperty, gu = Object.getOwnPropertyDescriptor, An = (e) => {
  throw TypeError(e);
}, Vi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gu(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && mu(t, i, s), s;
}, yu = (e, t, i) => t.has(e) || An("Cannot " + i), vu = (e, t, i) => t.has(e) ? An("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), be = (e, t, i) => (yu(e, t, "access private method"), i), le, ht, Ln, Wn, Rn, Un;
const bu = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let kt = class extends I {
  constructor() {
    super(...arguments), vu(this, le), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return n`
      <div class="panel" @drop=${be(this, le, Rn)}>
        <h5>Layers</h5>

        ${e.length === 0 ? n`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : O(
      e,
      (t) => t.key,
      (t, i) => be(this, le, Un).call(this, t, i)
    )}

        <div class="row background">
          <uui-icon name="icon-picture"></uui-icon>
          <span class="name">Background</span>
          <uui-icon name="icon-lock" title="The base image and canvas colour are edited in the inspector"></uui-icon>
        </div>
      </div>
    `;
  }
};
le = /* @__PURE__ */ new WeakSet();
ht = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
Ln = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Wn = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Rn = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  be(this, le, ht).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Un = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return n`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => be(this, le, Ln).call(this, a, e.key)}
        @dragover=${(a) => be(this, le, Wn).call(this, a, t)}
        @click=${() => be(this, le, ht).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${bu[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          look="secondary"
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), be(this, le, ht).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name=${e.isVisible ? "icon-eye" : "icon-eye-off"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), be(this, le, ht).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), be(this, le, ht).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), be(this, le, ht).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
kt.styles = D`
    :host {
      display: block;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
      max-height: 40%;
      overflow: auto;
    }

    .panel {
      padding: var(--uui-size-space-3);
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
Vi([
  f({ type: Array })
], kt.prototype, "layers", 2);
Vi([
  f({ type: String })
], kt.prototype, "selectedLayerKey", 2);
Vi([
  h()
], kt.prototype, "_dragKey", 2);
Vi([
  h()
], kt.prototype, "_dropIndex", 2);
kt = Vi([
  P("di-layers-panel")
], kt);
var _u = Object.defineProperty, wu = Object.getOwnPropertyDescriptor, Nn = (e) => {
  throw TypeError(e);
}, Re = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wu(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && _u(t, i, s), s;
}, $u = (e, t, i) => t.has(e) || Nn("Cannot " + i), xu = (e, t, i) => t.has(e) ? Nn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), pe = (e, t, i) => ($u(e, t, "access private method"), i), te, Ke, gi;
let ve = class extends I {
  constructor() {
    super(...arguments), xu(this, te), this.zoom = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1;
  }
  render() {
    return n`
      <div class="toolbar">
        <div class="zoom">
          <uui-button compact look="secondary" label="Zoom out" @click=${() => pe(this, te, Ke).call(this, "di-zoom-change", { zoom: this.zoom / 1.25 })}>
            <uui-icon name="icon-remove"></uui-icon>
          </uui-button>
          <span class="value">${Math.round(this.zoom * 100)}%</span>
          <uui-button compact look="secondary" label="Zoom in" @click=${() => pe(this, te, Ke).call(this, "di-zoom-change", { zoom: this.zoom * 1.25 })}>
            <uui-icon name="icon-add"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => pe(this, te, Ke).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${pe(this, te, gi).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${pe(this, te, gi).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${pe(this, te, gi).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${pe(this, te, gi).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => pe(this, te, Ke).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => pe(this, te, Ke).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => pe(this, te, Ke).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
te = /* @__PURE__ */ new WeakSet();
Ke = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
gi = function(e, t, i) {
  return n`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => pe(this, te, Ke).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
ve.styles = D`
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

    .value {
      min-width: 44px;
      text-align: center;
      font-variant-numeric: tabular-nums;
      font-size: 12px;
    }
  `;
Re([
  f({ type: Number })
], ve.prototype, "zoom", 2);
Re([
  f({ type: Boolean })
], ve.prototype, "snapEnabled", 2);
Re([
  f({ type: Boolean })
], ve.prototype, "showRulers", 2);
Re([
  f({ type: Boolean })
], ve.prototype, "showSafeArea", 2);
Re([
  f({ type: Boolean })
], ve.prototype, "showMeasured", 2);
Re([
  f({ type: Boolean })
], ve.prototype, "canUndo", 2);
Re([
  f({ type: Boolean })
], ve.prototype, "canRedo", 2);
Re([
  f({ type: Boolean })
], ve.prototype, "previewing", 2);
ve = Re([
  P("di-canvas-toolbar")
], ve);
var ku = Object.defineProperty, Su = Object.getOwnPropertyDescriptor, Fn = (e) => {
  throw TypeError(e);
}, Hi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Su(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && ku(t, i, s), s;
}, js = (e, t, i) => t.has(e) || Fn("Cannot " + i), oe = (e, t, i) => (js(e, t, "read from private field"), t.get(e)), hi = (e, t, i) => t.has(e) ? Fn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ci = (e, t, i, a) => (js(e, t, "write to private field"), t.set(e, i), i), At = (e, t, i) => (js(e, t, "access private method"), i), qe, Ei, Ut, bt, je, Gs, da, Kn;
const Tu = 400;
let St = class extends I {
  constructor() {
    super(), hi(this, je), hi(this, qe), hi(this, Ei), hi(this, Ut), hi(this, bt), this._loading = !1, this._collapsed = !1, this.consumeContext(Ct, (e) => {
      Ci(this, qe, e), e && (this.observe(e.template, (t) => {
        t && At(this, je, da).call(this, t);
      }), this.observe(e.sampleContentKey, () => {
        var i;
        const t = (i = oe(this, qe)) == null ? void 0 : i.getData();
        t && At(this, je, da).call(this, t);
      }));
    });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(oe(this, Ei)), (e = oe(this, Ut)) == null || e.abort(), At(this, je, Gs).call(this);
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
        const t = (e = oe(this, qe)) == null ? void 0 : e.getData();
        t && At(this, je, da).call(this, t);
      }
    }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed ? p : n`
              <div class="body">
                ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : p}
                ${this._error ? n`<span class="error" role="status">${this._error}</span>` : this._url ? n`<img src=${this._url} alt="Server-rendered preview of this template" />` : n`<span class="pending">Rendering…</span>`}
              </div>
            `}
      </div>
    `;
  }
};
qe = /* @__PURE__ */ new WeakMap();
Ei = /* @__PURE__ */ new WeakMap();
Ut = /* @__PURE__ */ new WeakMap();
bt = /* @__PURE__ */ new WeakMap();
je = /* @__PURE__ */ new WeakSet();
Gs = function() {
  oe(this, bt) && (URL.revokeObjectURL(oe(this, bt)), Ci(this, bt, void 0));
};
da = function(e) {
  this._collapsed || (window.clearTimeout(oe(this, Ei)), Ci(this, Ei, window.setTimeout(() => void At(this, je, Kn).call(this, e), Tu)));
};
Kn = async function(e) {
  var t;
  if (oe(this, qe)) {
    (t = oe(this, Ut)) == null || t.abort(), Ci(this, Ut, new AbortController()), this._loading = !0, this._error = void 0;
    try {
      const i = (oe(this, qe).getData(), void 0), a = await Ds(
        e,
        { signal: oe(this, Ut).signal, useSampleData: !0, contentKey: i },
        oe(this, qe).getToken
      );
      At(this, je, Gs).call(this), Ci(this, bt, URL.createObjectURL(a)), this._url = oe(this, bt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      this._loading = !1;
    }
  }
};
St.styles = D`
    :host {
      display: block;
      border-top: 1px solid var(--uui-color-border);
      background: var(--uui-color-surface);
    }

    .strip {
      padding: var(--uui-size-space-2) var(--uui-size-space-3);
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

    .body {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3);
      margin-top: var(--uui-size-space-2);
      min-height: 84px;
    }

    img {
      max-height: 120px;
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-2);
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
Hi([
  h()
], St.prototype, "_url", 2);
Hi([
  h()
], St.prototype, "_loading", 2);
Hi([
  h()
], St.prototype, "_error", 2);
Hi([
  h()
], St.prototype, "_collapsed", 2);
St = Hi([
  P("di-preview-strip")
], St);
var Cu = Object.defineProperty, Eu = Object.getOwnPropertyDescriptor, Bn = (e) => {
  throw TypeError(e);
}, Q = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Eu(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Cu(t, i, s), s;
}, Xs = (e, t, i) => t.has(e) || Bn("Cannot " + i), g = (e, t, i) => (Xs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Et = (e, t, i) => t.has(e) ? Bn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ka = (e, t, i, a) => (Xs(e, t, "write to private field"), t.set(e, i), i), Y = (e, t, i) => (Xs(e, t, "access private method"), i), $, Di, Pi, Nt, A, xs, Ys, Vn, ks, Hn, jn, Gn, Ss, Xn, Yn, qn, qs, Jn, ha;
const Du = 400;
let B = class extends I {
  constructor() {
    super(), Et(this, A), Et(this, $), Et(this, Di), Et(this, Pi), Et(this, Nt), this._properties = [], this._fonts = [], this._serverBounds = [], this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, Et(this, ha, (e) => {
      var o;
      const t = e.composedPath()[0];
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t != null && t.isContentEditable) return;
      const i = g(this, $);
      if (!i) return;
      const a = e.ctrlKey || e.metaKey;
      if (a && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? i.redo() : i.undo();
        return;
      }
      const s = g(this, A, xs);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), Y(this, A, ks).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const r = e.shiftKey ? 10 : 1, c = e.key === "ArrowLeft" ? -r : e.key === "ArrowRight" ? r : 0, m = e.key === "ArrowUp" ? -r : e.key === "ArrowDown" ? r : 0, b = Te(s.position, "x") ? 0 : c, W = Te(s.position, "y") ? 0 : m;
            if (b === 0 && W === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + b, y: s.position.y + W }
            });
            break;
          }
          case "[":
          case "]": {
            const r = ((o = this._template) == null ? void 0 : o.layers.findIndex((c) => c.key === s.key)) ?? -1;
            if (r < 0) return;
            e.preventDefault(), i.moveLayer(s.key, e.key === "]" ? r + 1 : r - 1);
            break;
          }
        }
      }
    }), this.consumeContext(Ea, (e) => {
      ka(this, Di, e);
    }), this.consumeContext(Ct, (e) => {
      ka(this, $, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (Y(this, A, Hn).call(this, t), Y(this, A, jn).call(this, t), Y(this, A, Gn).call(this));
      }), this.observe(e.selectedLayerKey, (t) => {
        this._selectedKey = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
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
    super.connectedCallback(), window.addEventListener("keydown", g(this, ha));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", g(this, ha)), window.clearTimeout(g(this, Pi)), (e = g(this, Nt)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? n`
      <div
        class="layout"
        @di-layer-change=${(e) => {
      var t;
      return (t = g(this, $)) == null ? void 0 : t.updateLayer(e.detail.key, e.detail.patch);
    }}
        @di-canvas-change=${(e) => {
      var t;
      return (t = g(this, $)) == null ? void 0 : t.updateCanvas(e.detail.patch);
    }}
        @di-layer-select=${(e) => {
      var t;
      return (t = g(this, $)) == null ? void 0 : t.selectLayer(e.detail.key);
    }}
        @di-layer-delete=${(e) => Y(this, A, ks).call(this, e.detail.key)}
        @di-layer-detach=${(e) => Y(this, A, Vn).call(this, e.detail.key, e.detail.axis)}
        @di-layer-duplicate=${(e) => {
      var t;
      return (t = g(this, $)) == null ? void 0 : t.duplicateLayer(e.detail.key);
    }}
        @di-layer-move=${(e) => {
      var t;
      return (t = g(this, $)) == null ? void 0 : t.moveLayer(e.detail.key, e.detail.toIndex);
    }}
        @di-layer-visibility=${(e) => {
      var t;
      return (t = g(this, $)) == null ? void 0 : t.setLayerVisible(e.detail.key, e.detail.isVisible);
    }}
        @di-layer-lock=${(e) => {
      var t;
      return (t = g(this, $)) == null ? void 0 : t.setLayerLocked(e.detail.key, e.detail.isLocked);
    }}
        @di-transaction-begin=${() => {
      var e;
      return (e = g(this, $)) == null ? void 0 : e.beginTransaction();
    }}
        @di-transaction-end=${(e) => {
      var t, i;
      return (i = g(this, $)) == null ? void 0 : i.endTransaction(((t = e.detail) == null ? void 0 : t.moved) ?? !0);
    }}
        @di-palette-add=${(e) => Y(this, A, Ss).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => Y(this, A, Ss).call(this, e.detail.payload, e.detail.x, e.detail.y)}
        @di-pick-base-image=${Y(this, A, Yn)}
        @di-pick-layer-image=${(e) => Y(this, A, qn).call(this, e.detail.key)}
        @di-use-image-size=${Y(this, A, Jn)}
        @di-zoom-change=${(e) => {
      this._zoom = Math.max(0.1, Math.min(4, e.detail.zoom));
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
      return (e = g(this, $)) == null ? void 0 : e.undo();
    }}
        @di-redo=${() => {
      var e;
      return (e = g(this, $)) == null ? void 0 : e.redo();
    }}>
        <di-property-palette class="palette" .properties=${this._properties}></di-property-palette>

        <div class="centre">
          <di-canvas-toolbar
            .zoom=${this._zoom ?? 1}
            .snapEnabled=${this._snapEnabled}
            .showRulers=${this._showRulers}
            .showSafeArea=${this._showSafeArea}
            .showMeasured=${this._showMeasured}
            .canUndo=${this._canUndo}
            .canRedo=${this._canRedo}>
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
            .layer=${g(this, A, xs)}
            .properties=${this._properties}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    ` : n`<div class="state"><uui-loader></uui-loader></div>`;
  }
};
$ = /* @__PURE__ */ new WeakMap();
Di = /* @__PURE__ */ new WeakMap();
Pi = /* @__PURE__ */ new WeakMap();
Nt = /* @__PURE__ */ new WeakMap();
A = /* @__PURE__ */ new WeakSet();
xs = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
Ys = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Vn = function(e, t) {
  var s, o, r;
  const i = (s = this._template) == null ? void 0 : s.layers.find((c) => c.key === e);
  if (!i) return;
  const a = (o = g(this, A, Ys)) == null ? void 0 : o.resolvedPositionOf(e);
  (r = g(this, $)) == null || r.updateLayer(e, { position: Qa(i.position, t, a) });
};
ks = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const r = (a = g(this, A, Ys)) == null ? void 0 : a.resolvedPositionOf(o.key);
    r && t.set(o.key, r);
  }
  (s = g(this, $)) == null || s.removeLayer(e, t);
};
Hn = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && g(this, $) && await Sr(t, g(this, $).getToken);
};
jn = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !g(this, $)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await zs(t.mediaKey, g(this, $).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Gn = function() {
  window.clearTimeout(g(this, Pi)), ka(this, Pi, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !g(this, $))) {
      (t = g(this, Nt)) == null || t.abort(), ka(this, Nt, new AbortController());
      try {
        const i = await Ps(
          e,
          { signal: g(this, Nt).signal, useSampleData: !0 },
          g(this, $).getToken
        );
        g(this, $).setServerBounds(i.layers), g(this, $).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, Du));
};
Ss = function(e, t, i) {
  const a = this._template;
  if (!a || !g(this, $)) return;
  const s = { template: a, x: t, y: i, defaultFontKey: Y(this, A, Xn).call(this) }, o = e.kind === "property" ? Bl(e.property, s) : e.layerType === "image" ? ir(s, "Image") : e.layerType === "badges" ? ar(s, "Badges", "") : e.layerType === "rect" ? Fl(s) : tr(s, "Text", { kind: "static", text: "Text" });
  g(this, $).addLayer(o);
};
Xn = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Yn = async function() {
  var t;
  const e = await Y(this, A, qs).call(this);
  e && ((t = g(this, $)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
qn = async function(e) {
  var i;
  const t = await Y(this, A, qs).call(this);
  t && ((i = g(this, $)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
qs = async function() {
  if (!g(this, Di)) return;
  const e = g(this, Di).open(this, Do, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
Jn = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !g(this, $)) return;
  const t = await zs(e.mediaKey, g(this, $).getToken).catch(() => {
  });
  t && g(this, $).updateCanvas({ width: t.width, height: t.height });
};
ha = /* @__PURE__ */ new WeakMap();
B.styles = D`
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

    .centre {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-width: 0;
      min-height: 0;
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
        grid-template-rows: 1fr auto;
      }

      .side {
        grid-column: 1 / -1;
        grid-template-rows: auto auto;
        max-height: 45vh;
        overflow: auto;
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
Q([
  h()
], B.prototype, "_template", 2);
Q([
  h()
], B.prototype, "_selectedKey", 2);
Q([
  h()
], B.prototype, "_properties", 2);
Q([
  h()
], B.prototype, "_fonts", 2);
Q([
  h()
], B.prototype, "_serverBounds", 2);
Q([
  h()
], B.prototype, "_baseImageUrl", 2);
Q([
  h()
], B.prototype, "_zoom", 2);
Q([
  h()
], B.prototype, "_snapEnabled", 2);
Q([
  h()
], B.prototype, "_showRulers", 2);
Q([
  h()
], B.prototype, "_showSafeArea", 2);
Q([
  h()
], B.prototype, "_showMeasured", 2);
Q([
  h()
], B.prototype, "_canUndo", 2);
Q([
  h()
], B.prototype, "_canRedo", 2);
B = Q([
  P("di-design-view")
], B);
const Pu = B, zu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return B;
  },
  default: Pu
}, Symbol.toStringTag, { value: "Module" }));
var Mu = Object.defineProperty, Ou = Object.getOwnPropertyDescriptor, Zn = (e) => {
  throw TypeError(e);
}, rt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ou(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Mu(t, i, s), s;
}, Js = (e, t, i) => t.has(e) || Zn("Cannot " + i), F = (e, t, i) => (Js(e, t, "read from private field"), t.get(e)), Dt = (e, t, i) => t.has(e) ? Zn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ft = (e, t, i, a) => (Js(e, t, "write to private field"), t.set(e, i), i), V = (e, t, i) => (Js(e, t, "access private method"), i), me, zi, Mi, Kt, _t, R, Sa, Qn, Zs, Qs, el, tl, Oi, il, al, sl;
const Iu = [
  { label: "Short", value: "Ship it" },
  { label: "Typical", value: "Designing social share images that actually get clicked" },
  {
    label: "Very long",
    value: "Everything you ever wanted to know about generating Open Graph images from your content, and rather more besides"
  }
];
let he = class extends I {
  constructor() {
    super(), Dt(this, R), Dt(this, me), Dt(this, zi), Dt(this, Mi), Dt(this, Kt), Dt(this, _t), this._bounds = [], this._loading = !1, this._regenerating = !1, this.consumeContext(Ea, (e) => {
      Ft(this, zi, e);
    }), this.consumeContext(at, (e) => {
      Ft(this, Mi, e);
    }), this.consumeContext(Ct, (e) => {
      Ft(this, me, e), e && this.observe(e.template, (t) => {
        this._template = t;
      });
    });
  }
  connectedCallback() {
    super.connectedCallback();
    const e = V(this, R, Qn).call(this);
    e && (this._sampleNode = e), V(this, R, Oi).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = F(this, Kt)) == null || e.abort(), V(this, R, Qs).call(this);
  }
  render() {
    return this._template ? n`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${V(this, R, el)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => V(this, R, Oi).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${V(this, R, al)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? n`<uui-loader-bar></uui-loader-bar>` : p}
          ${this._error ? n`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? n`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : p}

          <div class="presets">
            <span>Try a title length:</span>
            ${O(
      Iu,
      (e) => e.label,
      (e) => n`
                <uui-button
                  compact
                  look="secondary"
                  label="Preview with a ${e.label.toLowerCase()} title"
                  @click=${() => V(this, R, tl).call(this, e.value)}>
                  ${e.label}
                </uui-button>
              `
    )}
          </div>
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._bounds.length === 0 ? n`<p class="empty">Nothing was drawn. Check the layers are visible and have values.</p>` : n`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${O(
      this._bounds,
      (e) => e.key,
      (e) => n`
                    <uui-table-row>
                      <uui-table-cell>${V(this, R, sl).call(this, e.key)}</uui-table-cell>
                      <uui-table-cell>
                        ${e.resolvedText ?? n`<em>—</em>`}
                        ${e.truncated ? n`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : p}
                      </uui-table-cell>
                      <uui-table-cell>${Math.round(e.x)}, ${Math.round(e.y)}</uui-table-cell>
                      <uui-table-cell>${Math.round(e.width)} × ${Math.round(e.height)}</uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${this._sampleNode ? n`<uui-box headline="This node">
              <p>
                Regenerating writes a new image into
                <code>${this._template.targetPropertyAlias || "the target property"}</code> on
                <strong>${this._sampleNode.name}</strong>, replacing the existing media file in place.
              </p>
              <uui-button
                look="primary"
                color="positive"
                label="Regenerate the image for ${this._sampleNode.name}"
                ?disabled=${this._regenerating}
                @click=${V(this, R, il)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : n`<uui-loader></uui-loader>`;
  }
};
me = /* @__PURE__ */ new WeakMap();
zi = /* @__PURE__ */ new WeakMap();
Mi = /* @__PURE__ */ new WeakMap();
Kt = /* @__PURE__ */ new WeakMap();
_t = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakSet();
Sa = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
Qn = function() {
  try {
    const e = localStorage.getItem(V(this, R, Sa).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
Zs = function(e) {
  try {
    e ? localStorage.setItem(V(this, R, Sa).call(this), JSON.stringify(e)) : localStorage.removeItem(V(this, R, Sa).call(this));
  } catch {
  }
};
Qs = function() {
  F(this, _t) && (URL.revokeObjectURL(F(this, _t)), Ft(this, _t, void 0));
};
el = async function() {
  var i, a, s;
  if (!F(this, zi) || !this._template) return;
  const e = F(this, zi).open(this, _c, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, V(this, R, Zs).call(this, t.item), (s = F(this, me)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await V(this, R, Oi).call(this));
};
tl = async function(e) {
  this._template && (this._sampleNode = void 0, V(this, R, Zs).call(this, void 0), await V(this, R, Oi).call(this, e));
};
Oi = async function(e) {
  var a, s;
  const t = this._template;
  if (!t || !F(this, me)) return;
  (a = F(this, Kt)) == null || a.abort(), Ft(this, Kt, new AbortController()), this._loading = !0, this._error = void 0;
  const i = {
    signal: F(this, Kt).signal,
    contentKey: (s = this._sampleNode) == null ? void 0 : s.key,
    useSampleData: !this._sampleNode,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [o, r] = await Promise.all([
      Ds(t, i, F(this, me).getToken),
      Ps(t, i, F(this, me).getToken)
    ]);
    V(this, R, Qs).call(this), Ft(this, _t, URL.createObjectURL(o)), this._url = F(this, _t), this._bounds = r.layers, F(this, me).setServerBounds(r.layers), F(this, me).setIssues(r.issues);
  } catch (o) {
    if ((o == null ? void 0 : o.name) === "AbortError") return;
    this._error = o instanceof Error ? o.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
il = async function() {
  var e, t;
  if (!(!this._sampleNode || !F(this, me))) {
    this._regenerating = !0;
    try {
      const i = await Da(this._sampleNode.key, F(this, me).getToken);
      (e = F(this, Mi)) == null || e.peek(i.outcome === "generated" ? "positive" : "warning", {
        data: { message: `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = F(this, Mi)) == null || t.peek("danger", {
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
al = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
sl = function(e) {
  var i;
  const t = (i = this._template) == null ? void 0 : i.layers.find((a) => a.key === e);
  return (t == null ? void 0 : t.name) || (t == null ? void 0 : t.type) || e.slice(0, 8);
};
he.styles = D`
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
    }

    .presets {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-2);
      margin-top: var(--uui-size-space-4);
      font-size: 12px;
      color: var(--uui-color-text-alt);
      flex-wrap: wrap;
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

    code {
      background: var(--uui-color-surface-alt);
      padding: 0 4px;
      border-radius: 2px;
    }
  `;
rt([
  h()
], he.prototype, "_template", 2);
rt([
  h()
], he.prototype, "_sampleNode", 2);
rt([
  h()
], he.prototype, "_bounds", 2);
rt([
  h()
], he.prototype, "_url", 2);
rt([
  h()
], he.prototype, "_loading", 2);
rt([
  h()
], he.prototype, "_error", 2);
rt([
  h()
], he.prototype, "_regenerating", 2);
he = rt([
  P("di-preview-view")
], he);
const Au = he, Lu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return he;
  },
  default: Au
}, Symbol.toStringTag, { value: "Module" }));
var Wu = Object.defineProperty, Ru = Object.getOwnPropertyDescriptor, ol = (e) => {
  throw TypeError(e);
}, Ua = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ru(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Wu(t, i, s), s;
}, eo = (e, t, i) => t.has(e) || ol("Cannot " + i), L = (e, t, i) => (eo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ja = (e, t, i) => t.has(e) ? ol("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $o = (e, t, i, a) => (eo(e, t, "write to private field"), t.set(e, i), i), Je = (e, t, i) => (eo(e, t, "access private method"), i), K, Tt, ge, rl, nl, ll, cl, ul, dl, hl, pl, fl;
let tt = class extends I {
  constructor() {
    super(), ja(this, ge), ja(this, K), ja(this, Tt), this._properties = [], this._showAdvanced = !1, this.consumeContext(Ea, (e) => {
      $o(this, Tt, e);
    }), this.consumeContext(Ct, (e) => {
      $o(this, K, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? n`
      <div class="grid">
        ${Je(this, ge, dl).call(this)} ${Je(this, ge, hl).call(this)} ${Je(this, ge, pl).call(this)} ${Je(this, ge, fl).call(this)}
      </div>
    ` : n`<uui-loader></uui-loader>`;
  }
};
K = /* @__PURE__ */ new WeakMap();
Tt = /* @__PURE__ */ new WeakMap();
ge = /* @__PURE__ */ new WeakSet();
rl = function() {
  return this._properties.filter((e) => e.classification === "media");
};
nl = async function() {
  var a, s;
  if (!L(this, Tt) || !this._template) return;
  const e = L(this, Tt).open(this, Cl, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await Je(this, ge, ll).call(this, t.selection.filter((o) => !!o));
  (a = L(this, K)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = L(this, K)) == null ? void 0 : s.reloadProperties());
};
ll = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => Nl), i = await t(L(this, K).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, r) => r.indexOf(s) === o);
};
cl = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = L(this, K)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = L(this, K)) == null || s.reloadProperties();
};
ul = async function() {
  var i;
  if (!L(this, Tt)) return;
  const e = L(this, Tt).open(this, Do, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = L(this, K)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
dl = function() {
  const e = this._template;
  return n`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${e.docTypeAliases.length === 0 ? n`<p class="empty">No document types yet - nothing will trigger this template.</p>` : n`<div class="tags">
                  ${O(
    e.docTypeAliases,
    (t) => t,
    (t) => n`
                      <uui-tag look="secondary">
                        ${t}
                        <uui-button
                          compact
                          label="Remove ${t}"
                          @click=${() => Je(this, ge, cl).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${Je(this, ge, nl)}>
              Choose document types
            </uui-button>
          </div>
        </umb-property-layout>

        <umb-property-layout
          label="Target property"
          description="The media picker the generated image is written to.">
          <uui-select
            slot="editor"
            .value=${e.targetPropertyAlias}
            .options=${[
    { name: "- none -", value: "" },
    ...L(this, ge, rl).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = L(this, K)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = L(this, K)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
hl = function() {
  const e = this._template;
  return n`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${Je(this, ge, ul)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? n`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = L(this, K)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
  }}>
                  Clear
                </uui-button>` : p}
          </div>
        </umb-property-layout>

        <umb-property-layout label="File name" description="Tokens: {name}, {template}.">
          <uui-input
            slot="editor"
            .value=${e.output.fileNamePattern}
            @change=${(t) => {
    var i;
    return (i = L(this, K)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = L(this, K)) == null ? void 0 : i.updateOutput({
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
    return (i = L(this, K)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
pl = function() {
  const e = this._template;
  return n`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = L(this, K)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = L(this, K)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
fl = function() {
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
    return (i = L(this, K)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
tt.styles = D`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
    }

    .grid {
      display: grid;
      gap: var(--uui-size-layout-1);
      max-width: 1100px;
    }

    .row {
      display: flex;
      gap: var(--uui-size-space-3);
      align-items: center;
      flex-wrap: wrap;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--uui-size-space-2);
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      margin: 0 0 var(--uui-size-space-3);
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
Ua([
  h()
], tt.prototype, "_template", 2);
Ua([
  h()
], tt.prototype, "_properties", 2);
Ua([
  h()
], tt.prototype, "_showAdvanced", 2);
tt = Ua([
  P("di-settings-view")
], tt);
const Uu = tt, Nu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return tt;
  },
  default: Uu
}, Symbol.toStringTag, { value: "Module" }));
var Fu = Object.defineProperty, Ku = Object.getOwnPropertyDescriptor, ml = (e) => {
  throw TypeError(e);
}, ji = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ku(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Fu(t, i, s), s;
}, to = (e, t, i) => t.has(e) || ml("Cannot " + i), xo = (e, t, i) => (to(e, t, "read from private field"), t.get(e)), ko = (e, t, i) => t.has(e) ? ml("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Bu = (e, t, i, a) => (to(e, t, "write to private field"), t.set(e, i), i), So = (e, t, i) => (to(e, t, "access private method"), i), Ii, pa, Ts;
let Ae = class extends I {
  constructor() {
    super(), ko(this, pa), ko(this, Ii), this._loading = !0, this._onlyMissing = !1, this.consumeContext(Ct, (e) => {
      Bu(this, Ii, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && So(this, pa, Ts).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => So(this, pa, Ts).call(this)}>Reload</uui-button>
        </div>

        <p class="summary">
          <strong>${this._usage.withImage}</strong> of <strong>${this._usage.total}</strong> have an image.
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
              ${O(
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
Ii = /* @__PURE__ */ new WeakMap();
pa = /* @__PURE__ */ new WeakSet();
Ts = async function() {
  const e = this._template;
  if (!(!e || !xo(this, Ii))) {
    this._loading = !0;
    try {
      this._usage = await qo(e.key, xo(this, Ii).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Ae.styles = D`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
      overflow: auto;
    }

    .summary {
      margin: 0 0 var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
ji([
  h()
], Ae.prototype, "_template", 2);
ji([
  h()
], Ae.prototype, "_usage", 2);
ji([
  h()
], Ae.prototype, "_loading", 2);
ji([
  h()
], Ae.prototype, "_onlyMissing", 2);
Ae = ji([
  P("di-usage-view")
], Ae);
const Vu = Ae, Hu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Ae;
  },
  default: Vu
}, Symbol.toStringTag, { value: "Module" })), ju = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: lo,
  default: lo
}, Symbol.toStringTag, { value: "Module" })), Gu = 1500;
var fe, yt, Ca, gl;
class Ga extends Dl {
  constructor(i, a) {
    super(i, a);
    w(this, Ca);
    w(this, fe);
    w(this, yt);
    this.consumeContext(at, (s) => {
      v(this, fe, s);
    }), this.consumeContext(Ct, (s) => {
      v(this, yt, s);
    });
  }
  async execute() {
    var s, o, r;
    const i = l(this, yt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = l(this, fe)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await Cs(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const c = await Go(a.key, !1, i.getToken);
        (o = l(this, fe)) == null || o.peek("positive", {
          data: { message: `Regenerating ${c.total} item(s)…` }
        }), await C(this, Ca, gl).call(this, c, i);
      } catch (c) {
        (r = l(this, fe)) == null || r.peek("danger", {
          data: {
            headline: "Regeneration could not be started",
            message: c instanceof Error ? c.message : ""
          }
        });
      }
    }
  }
  /** Exposed so a future progress UI can stop a long run; the endpoint already supports it. */
  async cancel(i) {
    l(this, yt) && await Yo(i, l(this, yt).getToken);
  }
}
fe = new WeakMap(), yt = new WeakMap(), Ca = new WeakSet(), gl = async function(i, a) {
  var o, r, c, m;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((b) => setTimeout(b, Gu));
    try {
      s = await Xo(s.id, a.getToken);
    } catch {
      (o = l(this, fe)) == null || o.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }
  if (s.status === "completed") {
    const b = s.failures.length;
    (r = l(this, fe)) == null || r.peek(b > 0 ? "warning" : "positive", {
      data: {
        headline: "Regeneration finished",
        message: `${s.generated} generated, ${s.skipped} skipped${b > 0 ? `, ${b} failed` : ""}.`
      }
    });
    for (const W of s.failures.slice(0, 3))
      (c = l(this, fe)) == null || c.peek("danger", { data: { message: W } });
  } else
    (m = l(this, fe)) == null || m.peek("danger", {
      data: { headline: `Regeneration ${s.status}`, message: s.failures[0] ?? "" }
    });
};
const Xu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: Ga,
  api: Ga,
  default: Ga
}, Symbol.toStringTag, { value: "Module" }));
var Wi, qt;
class Xa extends Ol {
  constructor(i, a) {
    super(i, a);
    w(this, Wi);
    w(this, qt);
    this.consumeContext(Le, (s) => {
      v(this, Wi, s);
    }), this.consumeContext(at, (s) => {
      v(this, qt, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Da(i, () => {
          var r;
          return (r = l(this, Wi)) == null ? void 0 : r.getLatestToken();
        });
        (a = l(this, qt)) == null || a.peek(o.outcome === "generated" ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: o.outcome === "generated" ? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const r = o instanceof Ze && o.status === 404;
        (s = l(this, qt)) == null || s.peek(r ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof Ze ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
Wi = new WeakMap(), qt = new WeakMap();
const Yu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: Xa,
  api: Xa,
  default: Xa
}, Symbol.toStringTag, { value: "Module" }));
var Ri, vt, Ui, Jt;
class Ya extends Il {
  constructor(i, a) {
    super(i, a);
    w(this, Ri);
    w(this, vt);
    w(this, Ui);
    w(this, Jt);
    this.consumeContext(Le, (s) => {
      v(this, Ri, s);
    }), this.consumeContext(at, (s) => {
      v(this, vt, s);
    }), this.consumeContext(Al, (s) => {
      v(this, Ui, s);
    }), this.consumeContext(Ll, (s) => {
      v(this, Jt, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!l(this, Jt)) {
      (i = l(this, vt)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const r = await Da(l(this, Jt), () => {
        var c;
        return (c = l(this, Ri)) == null ? void 0 : c.getLatestToken();
      });
      r.propertyValue && ((a = l(this, Ui)) == null || a.setValue(JSON.parse(r.propertyValue))), (s = l(this, vt)) == null || s.peek("positive", {
        data: { headline: "Dynamic Images", message: "The image has been regenerated." }
      });
    } catch (r) {
      const c = r instanceof Ze && r.status === 404;
      (o = l(this, vt)) == null || o.peek(c ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: r instanceof Ze ? r.detail ?? r.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Ri = new WeakMap(), vt = new WeakMap(), Ui = new WeakMap(), Jt = new WeakMap();
const qu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: Ya,
  api: Ya,
  default: Ya
}, Symbol.toStringTag, { value: "Module" }));
var Ju = Object.defineProperty, Zu = Object.getOwnPropertyDescriptor, yl = (e) => {
  throw TypeError(e);
}, Na = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zu(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && Ju(t, i, s), s;
}, io = (e, t, i) => t.has(e) || yl("Cannot " + i), Ta = (e, t, i) => (io(e, t, "read from private field"), t.get(e)), Zi = (e, t, i) => t.has(e) ? yl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), vl = (e, t, i, a) => (io(e, t, "write to private field"), t.set(e, i), i), zt = (e, t, i) => (io(e, t, "access private method"), i), fa, Ai, ao, Be, so, bl, ma;
let it = class extends Eo {
  constructor() {
    super(), Zi(this, Be), Zi(this, fa), Zi(this, Ai), this._items = [], this._loading = !0, this._search = "", Zi(this, ao, () => {
      var e;
      return (e = Ta(this, fa)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Le, (e) => {
      vl(this, fa, e), e && zt(this, Be, so).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(Ta(this, Ai));
  }
  render() {
    return n`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${zt(this, Be, bl)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => zt(this, Be, ma).call(this, void 0)}>
          Use sample data
        </uui-button>

        ${this._loading ? n`<uui-loader></uui-loader>` : this._items.length === 0 ? n`<p class="empty">No content of the selected document types was found.</p>` : n`<uui-ref-list>
                ${O(
      this._items,
      (e) => e.key,
      (e) => {
        var t;
        return n`
                    <uui-ref-node
                      name=${e.name}
                      detail=${e.isPublished ? "Published" : "Draft"}
                      ?selected=${e.key === ((t = this.data) == null ? void 0 : t.selectedKey)}
                      @open=${() => zt(this, Be, ma).call(this, e)}
                      @click=${() => zt(this, Be, ma).call(this, e)}>
                    </uui-ref-node>
                  `;
      }
    )}
              </uui-ref-list>`}

        <div slot="actions">
          <uui-button look="secondary" label="Cancel" @click=${() => this._rejectModal()}>Cancel</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
fa = /* @__PURE__ */ new WeakMap();
Ai = /* @__PURE__ */ new WeakMap();
ao = /* @__PURE__ */ new WeakMap();
Be = /* @__PURE__ */ new WeakSet();
so = async function() {
  var t;
  const e = ((t = this.data) == null ? void 0 : t.docTypeAliases) ?? [];
  if (e.length === 0) {
    this._items = [], this._loading = !1;
    return;
  }
  this._loading = !0;
  try {
    const i = await Promise.all(
      e.map(
        (a) => jo(a, this._search, 0, 30, Ta(this, ao)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
bl = function(e) {
  this._search = e.target.value, window.clearTimeout(Ta(this, Ai)), vl(this, Ai, window.setTimeout(() => void zt(this, Be, so).call(this), 300));
};
ma = function(e) {
  this.value = { item: e }, this._submitModal();
};
it.styles = D`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
Na([
  h()
], it.prototype, "_items", 2);
Na([
  h()
], it.prototype, "_loading", 2);
Na([
  h()
], it.prototype, "_search", 2);
it = Na([
  P("di-sample-node-picker-modal")
], it);
const Qu = it, ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return it;
  },
  default: Qu
}, Symbol.toStringTag, { value: "Module" }));
var td = Object.defineProperty, id = Object.getOwnPropertyDescriptor, _l = (e) => {
  throw TypeError(e);
}, Ue = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? id(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (a ? r(t, i, s) : r(s)) || s);
  return a && s && td(t, i, s), s;
}, oo = (e, t, i) => t.has(e) || _l("Cannot " + i), ii = (e, t, i) => (oo(e, t, "read from private field"), i ? i.call(e) : t.get(e)), qa = (e, t, i) => t.has(e) ? _l("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ad = (e, t, i, a) => (oo(e, t, "write to private field"), t.set(e, i), i), Mt = (e, t, i) => (oo(e, t, "access private method"), i), ga, Gi, _e, wl, $l, ro, xl, kl, Sl, Tl;
const sd = [100, 200, 300, 400, 500, 600, 700, 800, 900], od = [
  { value: "google", name: "Google Fonts" },
  { value: "bunny", name: "Bunny Fonts" },
  { value: "direct", name: "A direct URL to a font file" }
];
let ne = class extends Eo {
  constructor() {
    super(), qa(this, _e), qa(this, ga), this._busy = !1, this._path = "", this._provider = "google", this._family = "", this._weights = /* @__PURE__ */ new Set([400]), this._italic = !1, this._url = "", qa(this, Gi, () => {
      var e;
      return (e = ii(this, ga)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Le, (e) => {
      ad(this, ga, e);
    });
  }
  render() {
    return n`
      <umb-body-layout headline="Add a font">
        <uui-box headline="Upload a file">
          <input
            type="file"
            accept=".ttf,.otf,.woff2,.woff"
            multiple
            aria-label="Font files"
            ?disabled=${this._busy}
            @change=${Mt(this, _e, wl)} />
          <p class="hint">
            .ttf, .otf or .woff2. The family name and weight are read from the file. Uploads are stored in the media
            library, so they work on Umbraco Cloud and transfer with Deploy.
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
            @click=${Mt(this, _e, $l)}>
            Register
          </uui-button>
        </uui-box>

        <uui-box headline="Or use a web font">
          <uui-select
            label="Provider"
            .value=${this._provider}
            .options=${od.map((e) => ({
      name: e.name,
      value: e.value,
      selected: e.value === this._provider
    }))}
            ?disabled=${this._busy}
            @change=${(e) => {
      this._provider = e.target.value;
    }}>
          </uui-select>

          ${this._provider === "direct" ? Mt(this, _e, Tl).call(this) : Mt(this, _e, Sl).call(this)}

          <uui-button
            look="secondary"
            label="Add this web font"
            ?disabled=${this._busy || !ii(this, _e, ro)}
            @click=${Mt(this, _e, xl)}>
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
ga = /* @__PURE__ */ new WeakMap();
Gi = /* @__PURE__ */ new WeakMap();
_e = /* @__PURE__ */ new WeakSet();
wl = async function(e) {
  const t = e.target.files;
  if (!(!t || t.length === 0)) {
    this._busy = !0, this._error = void 0;
    try {
      for (const i of Array.from(t))
        await Ro(i, ii(this, Gi));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (i) {
      this._error = i instanceof Error ? i.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
$l = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await Uo(this._path.trim(), ii(this, Gi)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
ro = function() {
  return this._provider === "direct" ? this._url.trim().length > 0 : this._family.trim().length > 0 && this._weights.size > 0;
};
xl = async function() {
  if (ii(this, _e, ro)) {
    this._busy = !0, this._error = void 0;
    try {
      const e = await No(
        this._provider === "direct" ? { provider: "direct", includeItalic: !1, url: this._url.trim() } : {
          provider: this._provider,
          family: this._family.trim(),
          weights: [...this._weights].sort((t, i) => t - i),
          includeItalic: this._italic
        },
        ii(this, Gi)
      );
      this.value = { uploaded: !0, warnings: e.errors }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error && "detail" in e && typeof e.detail == "string" ? e.detail : e instanceof Error ? e.message : "That web font could not be added.";
    } finally {
      this._busy = !1;
    }
  }
};
kl = function(e, t) {
  const i = new Set(this._weights);
  t ? i.add(e) : i.delete(e), this._weights = i;
};
Sl = function() {
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
        ${O(
    sd,
    (e) => e,
    (e) => n`
            <uui-checkbox
              label=${String(e)}
              ?checked=${this._weights.has(e)}
              ?disabled=${this._busy}
              @change=${(t) => Mt(this, _e, kl).call(this, e, t.target.checked)}>
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
Tl = function() {
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
ne.styles = D`
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
Ue([
  h()
], ne.prototype, "_busy", 2);
Ue([
  h()
], ne.prototype, "_error", 2);
Ue([
  h()
], ne.prototype, "_path", 2);
Ue([
  h()
], ne.prototype, "_provider", 2);
Ue([
  h()
], ne.prototype, "_family", 2);
Ue([
  h()
], ne.prototype, "_weights", 2);
Ue([
  h()
], ne.prototype, "_italic", 2);
Ue([
  h()
], ne.prototype, "_url", 2);
ne = Ue([
  P("di-font-upload-modal")
], ne);
const rd = ne, nd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return ne;
  },
  default: rd
}, Symbol.toStringTag, { value: "Module" }));
export {
  ic as manifests,
  xd as onInit
};
//# sourceMappingURL=dynamic-images.js.map
