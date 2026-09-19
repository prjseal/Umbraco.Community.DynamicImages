var oo = (e) => {
  throw TypeError(e);
};
var Ua = (e, t, i) => t.has(e) || oo("Cannot " + i);
var l = (e, t, i) => (Ua(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? oo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), v = (e, t, i, a) => (Ua(e, t, "write to private field"), a ? a.call(e, i) : t.set(e, i), i), T = (e, t, i) => (Ua(e, t, "access private method"), i);
var Na = (e, t, i, a) => ({
  set _(s) {
    v(e, t, s, i);
  },
  get _() {
    return l(e, t, a);
  }
});
import { nothing as p, html as r, css as D, state as h, customElement as E, repeat as A, property as m, classMap as So, styleMap as J } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as z } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT as Oe } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT as et } from "@umbraco-cms/backoffice/notification";
import { umbConfirmModal as Ss, UmbModalToken as To, UMB_MODAL_MANAGER_CONTEXT as ka, UmbModalBaseElement as Co } from "@umbraco-cms/backoffice/modal";
import { UMB_MEDIA_PICKER_MODAL as Do } from "@umbraco-cms/backoffice/media";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL as vl } from "@umbraco-cms/backoffice/document-type";
import { UmbSubmittableWorkspaceContextBase as bl, UmbSubmitWorkspaceAction as no, UmbWorkspaceActionBase as _l } from "@umbraco-cms/backoffice/workspace";
import { UmbContextToken as wl } from "@umbraco-cms/backoffice/context-api";
import { UmbObjectState as $l, UmbArrayState as si, UmbStringState as ro, UmbBooleanState as Bi, UmbNumberState as xl } from "@umbraco-cms/backoffice/observable-api";
import { UmbEntityActionBase as kl } from "@umbraco-cms/backoffice/entity-action";
import { UmbPropertyActionBase as Sl } from "@umbraco-cms/backoffice/property-action";
import { UMB_PROPERTY_CONTEXT as Tl } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Cl } from "@umbraco-cms/backoffice/document";
const Gt = "dynamic-images", Ii = "di-template", ha = "di:templates-changed", Dl = "/umbraco/management/api/v1/dynamic-images";
class Xe extends Error {
  constructor(t, i, a) {
    super(t), this.status = i, this.detail = a, this.name = "DiApiError";
  }
}
async function S(e, t, i) {
  const a = await t(), s = new Headers(i == null ? void 0 : i.headers);
  a && s.set("Authorization", `Bearer ${a}`);
  let o = i == null ? void 0 : i.body;
  (i == null ? void 0 : i.json) !== void 0 && (s.set("Content-Type", "application/json"), o = JSON.stringify(i.json));
  const n = await fetch(`${Dl}${e}`, { ...i, headers: s, body: o });
  if (!n.ok) throw await El(n);
  return n;
}
async function El(e) {
  let t = `Request failed (${e.status})`, i;
  try {
    const a = await e.json();
    a != null && a.title && (t = a.title), a != null && a.detail && (i = a.detail);
  } catch {
  }
  return new Xe(t, e.status, i);
}
const C = async (e) => e.json();
async function Ts(e) {
  const t = await S("/templates?take=500", e);
  return (await C(t)).items;
}
const Eo = async (e, t) => C(await S(`/templates/${e}`, t)), Po = async (e, t) => C(await S("/templates", t, { method: "POST", json: e })), zo = async (e, t) => C(await S(`/templates/${e.key}`, t, { method: "PUT", json: e }));
async function Mo(e, t) {
  await S(`/templates/${e}`, t, { method: "DELETE" });
}
const Oo = async (e, t) => C(await S(`/templates/${e}/duplicate`, t, { method: "POST" }));
async function Io(e, t) {
  return (await S(`/templates/${e}/export`, t)).blob();
}
const Ao = async (e, t, i) => C(await S("/templates/import", i, { method: "POST", json: { json: e, mode: t } })), Lo = async (e) => C(await S("/templates/import/appsettings", e, { method: "POST" })), mi = async (e) => C(await S("/fonts", e));
async function Wo(e, t) {
  const i = new FormData();
  return i.append("file", e), C(await S("/fonts", t, { method: "POST", body: i }));
}
const Ro = async (e, t) => C(await S("/fonts/register-path", t, { method: "POST", json: { path: e } })), Uo = async (e, t, i, a) => C(await S(`/fonts/${e}`, a, { method: "PUT", json: { familyName: t, styles: i } }));
async function No(e, t) {
  await S(`/fonts/${e}`, t, { method: "DELETE" });
}
async function Fo(e, t) {
  return (await S(`/fonts/${e}/file`, t)).arrayBuffer();
}
const Pl = async (e) => C(await S("/document-types", e)), Ko = async (e, t) => C(await S(`/document-types/${encodeURIComponent(e)}/properties`, t));
async function Bo(e, t, i, a, s) {
  const o = new URLSearchParams({ skip: String(i), take: String(a) });
  return t && o.set("query", t), C(await S(`/document-types/${encodeURIComponent(e)}/content?${o}`, s));
}
async function Cs(e, t, i) {
  return (await S("/preview", i, {
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
const Ds = async (e, t, i) => C(await S("/preview/layout", i, {
  method: "POST",
  signal: t.signal,
  json: {
    template: e,
    contentKey: t.contentKey ?? null,
    useSampleData: t.useSampleData ?? !1
  }
})), Es = async (e, t) => C(await S(`/media/${e}/image-info`, t)), Sa = async (e, t) => C(await S(`/documents/${e}/regenerate`, t, { method: "POST" })), Vo = async (e, t, i) => C(await S(`/templates/${e}/regenerate`, i, { method: "POST", json: { onlyMissing: t } })), Ho = async (e, t) => C(await S(`/jobs/${e}`, t));
async function jo(e, t) {
  await S(`/jobs/${e}/cancel`, t, { method: "POST" });
}
const Go = async (e, t) => C(await S(`/templates/${e}/usage`, t)), Ta = async (e) => C(await S("/health", e)), Xo = async (e) => C(await S("/sync/status", e)), Yo = async (e) => C(await S("/sync/export", e, { method: "POST" })), qo = async (e) => C(await S("/sync/import", e, { method: "POST" }));
function Xt(e) {
  const t = `section/${Gt}/workspace/${Ii}/edit/${e}`;
  return new URL(t, document.baseURI).pathname;
}
function Ca() {
  return new URL(`section/${Gt}/workspace/${Ii}/create`, document.baseURI).pathname;
}
function Jo(e) {
  return new URL(`section/${Gt}/dashboard/${e}`, document.baseURI).pathname;
}
function Ya() {
  const e = window.location.pathname.split(`/workspace/${Ii}/edit/`)[1];
  return e ? decodeURIComponent(e.split("/")[0]) : "";
}
function Qt() {
  window.dispatchEvent(new CustomEvent(ha));
}
const zl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiApiError: Xe,
  SECTION_PATHNAME: Gt,
  TEMPLATES_CHANGED_EVENT: ha,
  TEMPLATE_ENTITY_TYPE: Ii,
  cancelJob: jo,
  createTemplate: Po,
  deleteFont: No,
  deleteTemplate: Mo,
  duplicateTemplate: Oo,
  exportTemplate: Io,
  fetchDocumentTypes: Pl,
  fetchFontFile: Fo,
  fetchFonts: mi,
  fetchHealth: Ta,
  fetchImageInfo: Es,
  fetchJob: Ho,
  fetchLayout: Ds,
  fetchPreview: Cs,
  fetchProperties: Ko,
  fetchSampleContent: Bo,
  fetchSyncStatus: Xo,
  fetchTemplate: Eo,
  fetchTemplates: Ts,
  fetchUsage: Go,
  hrefForCreate: Ca,
  hrefForDashboard: Jo,
  hrefForTemplate: Xt,
  importFromAppSettings: Lo,
  importTemplate: Ao,
  notifyTemplatesChanged: Qt,
  regenerateDocument: Sa,
  regenerateTemplate: Vo,
  registerFontPath: Ro,
  runSyncExport: Yo,
  runSyncImport: qo,
  templateKeyFromLocation: Ya,
  updateFont: Uo,
  updateTemplate: zo,
  uploadFont: Wo
}, Symbol.toStringTag, { value: "Module" })), Da = () => crypto.randomUUID();
function Ea(e) {
  return {
    x: Math.round(e.x ?? e.template.canvas.width / 2),
    y: Math.round(e.y ?? e.template.canvas.height / 2)
  };
}
function Zo(e, t, i) {
  const { x: a, y: s } = Ea(e);
  return {
    type: "text",
    key: Da(),
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
function Qo(e, t, i) {
  const { x: a, y: s } = Ea(e);
  return {
    type: "image",
    key: Da(),
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
function en(e, t, i) {
  const { x: a, y: s } = Ea(e);
  return {
    type: "badges",
    key: Da(),
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
function Ml(e, t = "Shape") {
  const { x: i, y: a } = Ea(e);
  return {
    type: "rect",
    key: Da(),
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
function Ol(e) {
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
function Il(e, t) {
  switch (Ol(e.classification)) {
    case "image":
      return Qo(t, e.name, e.alias);
    case "badges":
      return en(t, e.name, e.alias);
    default:
      return Zo(t, e.name, Al(e));
  }
}
function Al(e) {
  return e.alias === "name" ? { kind: "nodeName" } : e.alias === "readingTime" ? { kind: "readingTime", propertyAlias: "mainContent" } : e.classification === "date" ? { kind: "date", propertyAlias: e.alias, format: "d MMMM yyyy" } : { kind: "property", propertyAlias: e.alias };
}
function Ll(e) {
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
const tn = [
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
function fi(e) {
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
function gi(e) {
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
function qa(e, t) {
  const i = e < 0.25 ? 0 : e < 0.75 ? 1 : 2, a = t < 0.25 ? 0 : t < 0.75 ? 1 : 2;
  return tn[a * 3 + i];
}
function Pa(e, t, i) {
  return {
    x: e.x - t * fi(e.anchor),
    y: e.y - i * gi(e.anchor)
  };
}
function an(e, t, i, a, s) {
  return {
    x: e + i * fi(s),
    y: t + a * gi(s)
  };
}
function Wl(e, t, i, a) {
  const s = Pa(e, t, i), o = an(s.x, s.y, t, i, a);
  return { ...e, x: Math.round(o.x), y: Math.round(o.y), anchor: a };
}
function Rl(e, t) {
  const i = an(e.x, e.y, e.width, e.height, t.anchor);
  return { ...t, x: Math.round(i.x), y: Math.round(i.y) };
}
const Ul = 10;
function xe(e, t) {
  return t === "x" ? !!e.relativeX : !!e.relativeY;
}
function sn(e) {
  return !!e.relativeX || !!e.relativeY;
}
function pa(e, t) {
  return t === "x" ? e.relativeX : e.relativeY;
}
function lo(e) {
  return e === "below" || e === "above";
}
function co(e) {
  const t = [];
  return e.relativeX && t.push(e.relativeX), e.relativeY && t.push(e.relativeY), t;
}
function Nl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.has(i.key) || t.set(i.key, i);
  return t;
}
function Fl(e, t) {
  const i = t.get(e);
  if (!i) return !1;
  const a = /* @__PURE__ */ new Set(), s = co(i.position).map((o) => o.layerKey);
  for (; s.length > 0; ) {
    const o = s.pop();
    if (o === e) return !0;
    if (a.has(o)) continue;
    a.add(o);
    const n = t.get(o);
    n && s.push(...co(n.position).map((c) => c.layerKey));
  }
  return !1;
}
function Kl(e, t, i) {
  const a = e.position;
  if (!sn(a)) return a;
  if (Fl(e.key, t))
    return { x: a.x, y: a.y, anchor: a.anchor };
  let s = a.x, o = a.y, n = fi(a.anchor), c = gi(a.anchor);
  const f = uo(e, a.relativeX, !1, t, i);
  f && (s = f.coordinate, n = f.factor);
  const b = uo(e, a.relativeY, !0, t, i);
  return b && (o = b.coordinate, c = b.factor), { x: s, y: o, anchor: qa(n, c) };
}
function uo(e, t, i, a, s) {
  if (!t || lo(t.edge) !== i) return;
  const o = /* @__PURE__ */ new Set([e.key]);
  let n = t.layerKey;
  for (; !o.has(n); ) {
    o.add(n);
    const c = a.get(n);
    if (!c) return;
    const f = s(n);
    if (f)
      switch (t.edge) {
        case "below":
          return { coordinate: f.y + f.height + t.gap, factor: 0 };
        case "above":
          return { coordinate: f.y - t.gap, factor: 1 };
        case "rightOf":
          return { coordinate: f.x + f.width + t.gap, factor: 0 };
        default:
          return { coordinate: f.x - t.gap, factor: 1 };
      }
    const b = i ? c.position.relativeY : c.position.relativeX;
    if (!b || lo(b.edge) !== i) return;
    n = b.layerKey;
  }
}
function Bl(e, t, i) {
  const a = Nl(e), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), n = (c) => {
    const f = s.get(c.key);
    if (f) return f;
    let b;
    o.has(c.key) ? b = { x: c.position.x, y: c.position.y, anchor: c.position.anchor } : (o.add(c.key), b = Kl(c, a, (Ki) => {
      const Te = a.get(Ki);
      return Te && !i(Te) ? n(Te).box : void 0;
    }), o.delete(c.key));
    const L = t(c), st = Pa(b, L.width, L.height), ai = { position: b, box: { x: st.x, y: st.y, width: L.width, height: L.height } };
    return s.set(c.key, ai), ai;
  };
  for (const c of e) n(c);
  return s;
}
function Ja(e, t, i) {
  return t === "x" ? {
    ...e,
    relativeX: null,
    x: i ? Math.round(i.x) : e.x,
    anchor: i ? qa(fi(i.anchor), gi(e.anchor)) : e.anchor
  } : {
    ...e,
    relativeY: null,
    y: i ? Math.round(i.y) : e.y,
    anchor: i ? qa(fi(e.anchor), gi(i.anchor)) : e.anchor
  };
}
var ie, De, be, Be;
class Vl {
  constructor(t = 100) {
    w(this, ie, []);
    w(this, De, []);
    w(this, be, 0);
    w(this, Be);
    this.limit = t;
  }
  get canUndo() {
    return l(this, ie).length > 0;
  }
  get canRedo() {
    return l(this, De).length > 0;
  }
  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(t) {
    l(this, be) > 0 || (l(this, ie).push(structuredClone(t)), l(this, ie).length > this.limit && l(this, ie).shift(), v(this, De, []));
  }
  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(t) {
    l(this, be) === 0 && v(this, Be, structuredClone(t)), Na(this, be)._++;
  }
  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(t = !0) {
    l(this, be) !== 0 && (Na(this, be)._--, !(l(this, be) > 0) && (t && l(this, Be) !== void 0 && (l(this, ie).push(l(this, Be)), l(this, ie).length > this.limit && l(this, ie).shift(), v(this, De, [])), v(this, Be, void 0)));
  }
  undo(t) {
    const i = l(this, ie).pop();
    if (i !== void 0)
      return l(this, De).push(structuredClone(t)), i;
  }
  redo(t) {
    const i = l(this, De).pop();
    if (i !== void 0)
      return l(this, ie).push(structuredClone(t)), i;
  }
  clear() {
    v(this, ie, []), v(this, De, []), v(this, be, 0), v(this, Be, void 0);
  }
}
ie = new WeakMap(), De = new WeakMap(), be = new WeakMap(), Be = new WeakMap();
const Hl = "DynamicImages.Workspace.Template";
var U, Rt, Ve, ut, dt, Ut, Nt, Ft, ht, Kt, Ee, Bt, Vt, ae, Pi, pt, _e, k, Za, Qa, Ce, ot, es, ts;
class jl extends bl {
  constructor(i) {
    super(i, Hl);
    w(this, k);
    w(this, U);
    w(this, Rt);
    w(this, Ve);
    w(this, ut);
    w(this, dt);
    w(this, Ut);
    w(this, Nt);
    w(this, Ft);
    w(this, ht);
    w(this, Kt);
    w(this, Ee);
    w(this, Bt);
    w(this, Vt);
    w(this, ae);
    w(this, Pi);
    w(this, pt);
    w(this, _e);
    v(this, U, new $l(void 0)), this.template = l(this, U).asObservable(), v(this, Rt, new si([], (a) => a.key)), this.layers = l(this, Rt).asObservable(), v(this, Ve, new ro(void 0)), this.selectedLayerKey = l(this, Ve).asObservable(), v(this, ut, new si([], (a) => a.alias)), this.properties = l(this, ut).asObservable(), v(this, dt, new si([], (a) => a.key)), this.fonts = l(this, dt).asObservable(), v(this, Ut, new si([], (a) => a.key)), this.serverBounds = l(this, Ut).asObservable(), v(this, Nt, new si([], (a) => `${a.code}:${a.layerKey ?? ""}:${a.message}`)), this.issues = l(this, Nt).asObservable(), v(this, Ft, new ro(void 0)), this.sampleContentKey = l(this, Ft).asObservable(), v(this, ht, new Bi(!0)), this.useSampleData = l(this, ht).asObservable(), v(this, Kt, new xl(1)), this.zoom = l(this, Kt).asObservable(), v(this, Ee, new Bi(!0)), this.loading = l(this, Ee).asObservable(), this.unique = l(this, U).asObservablePart((a) => a == null ? void 0 : a.key), v(this, Bt, new Bi(!1)), this.canUndo = l(this, Bt).asObservable(), v(this, Vt, new Bi(!1)), this.canRedo = l(this, Vt).asObservable(), v(this, ae, new Vl()), v(this, _e, !1), this.getToken = () => {
      var a;
      return (a = l(this, Pi)) == null ? void 0 : a.getLatestToken();
    }, this.getEntityType = () => "di-template", this.getUnique = () => {
      var a;
      return (a = l(this, U).getValue()) == null ? void 0 : a.key;
    }, this.getData = () => l(this, U).getValue(), this.routes.setRoutes([
      {
        path: "create",
        component: () => Promise.resolve().then(() => po),
        setup: () => this.createScaffold()
      },
      {
        path: "edit/:key",
        component: () => Promise.resolve().then(() => po),
        setup: (a, s) => this.load(s.match.params.key)
      },
      {
        path: "",
        redirectTo: "create"
      }
    ]), this.consumeContext(Oe, (a) => {
      v(this, Pi, a);
    }), this.consumeContext(et, (a) => {
      v(this, pt, a);
    });
  }
  /** True until the first successful save. `isNew` itself is an observable on the base class. */
  get isUnsaved() {
    return l(this, _e);
  }
  // ------------------------------------------------------------------ loading
  async load(i) {
    l(this, Ee).setValue(!0), v(this, _e, !1);
    try {
      const a = await Eo(i, this.getToken);
      T(this, k, ot).call(this, a, { resetHistory: !0 }), this.setIsNew(!1), await T(this, k, Za).call(this, a);
    } catch (a) {
      T(this, k, ts).call(this, "This template could not be loaded", a);
    } finally {
      l(this, Ee).setValue(!1);
    }
  }
  async createScaffold(i = "New template") {
    l(this, Ee).setValue(!0), v(this, _e, !0), T(this, k, ot).call(this, Ll(i), { resetHistory: !0 }), this.setIsNew(!0), await T(this, k, Za).call(this, l(this, U).getValue()), l(this, Ee).setValue(!1);
  }
  async reloadProperties() {
    const i = l(this, U).getValue();
    i && l(this, ut).setValue(await T(this, k, Qa).call(this, i.docTypeAliases));
  }
  async reloadFonts() {
    l(this, dt).setValue(await mi(this.getToken).catch(() => []));
  }
  updateTemplateFields(i) {
    T(this, k, Ce).call(this, (a) => ({ ...a, ...i }));
  }
  updateCanvas(i) {
    T(this, k, Ce).call(this, (a) => ({ ...a, canvas: { ...a.canvas, ...i } }));
  }
  updateOutput(i) {
    T(this, k, Ce).call(this, (a) => ({ ...a, output: { ...a.output, ...i } }));
  }
  updateTrigger(i) {
    T(this, k, Ce).call(this, (a) => ({ ...a, trigger: { ...a.trigger, ...i } }));
  }
  addLayer(i, a = !0) {
    T(this, k, Ce).call(this, (s) => ({ ...s, layers: [...s.layers, i] })), a && this.selectLayer(i.key);
  }
  /** A shallow merge onto one layer. Nested objects are replaced wholesale by design. */
  updateLayer(i, a) {
    T(this, k, Ce).call(this, (s) => ({
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
    T(this, k, Ce).call(this, (s) => ({
      ...s,
      layers: s.layers.filter((o) => o.key !== i).map((o) => {
        var c, f;
        let n = o.position;
        return ((c = pa(n, "x")) == null ? void 0 : c.layerKey) === i && (n = Ja(n, "x", a == null ? void 0 : a.get(o.key))), ((f = pa(n, "y")) == null ? void 0 : f.layerKey) === i && (n = Ja(n, "y", a == null ? void 0 : a.get(o.key))), n === o.position ? o : { ...o, position: n };
      })
    })), l(this, Ve).getValue() === i && this.selectLayer(void 0);
  }
  duplicateLayer(i) {
    var o;
    const a = (o = l(this, U).getValue()) == null ? void 0 : o.layers.find((n) => n.key === i);
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
    T(this, k, Ce).call(this, (s) => {
      const o = [...s.layers], n = o.findIndex((f) => f.key === i);
      if (n < 0) return s;
      const [c] = o.splice(n, 1);
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
    l(this, Ve).setValue(i);
  }
  getSelectedLayer() {
    var a;
    const i = l(this, Ve).getValue();
    return i ? (a = l(this, U).getValue()) == null ? void 0 : a.layers.find((s) => s.key === i) : void 0;
  }
  // ------------------------------------------------------------------ transactions and history
  /** Opens a coalesced change - a whole drag becomes one undo entry rather than hundreds. */
  beginTransaction() {
    const i = l(this, U).getValue();
    i && l(this, ae).begin(i);
  }
  endTransaction(i = !0) {
    l(this, ae).end(i), T(this, k, es).call(this);
  }
  undo() {
    const i = l(this, U).getValue();
    if (!i) return;
    const a = l(this, ae).undo(i);
    a && T(this, k, ot).call(this, a);
  }
  redo() {
    const i = l(this, U).getValue();
    if (!i) return;
    const a = l(this, ae).redo(i);
    a && T(this, k, ot).call(this, a);
  }
  // ------------------------------------------------------------------ preview state
  setServerBounds(i) {
    l(this, Ut).setValue(i);
  }
  setIssues(i) {
    l(this, Nt).setValue(i);
  }
  setSampleContentKey(i) {
    l(this, Ft).setValue(i), l(this, ht).setValue(!i);
  }
  setUseSampleData(i) {
    l(this, ht).setValue(i);
  }
  setZoom(i) {
    l(this, Kt).setValue(Math.max(0.1, Math.min(4, i)));
  }
  // ------------------------------------------------------------------ saving
  async submit() {
    var a, s;
    const i = l(this, U).getValue();
    if (!i) throw new Error("There is nothing to save.");
    try {
      const o = l(this, _e) ? await Po(i, this.getToken) : await zo(i, this.getToken);
      T(this, k, ot).call(this, o.template, { resetHistory: !0 });
      const n = l(this, _e);
      v(this, _e, !1), this.setIsNew(!1), Qt(), (a = l(this, pt)) == null || a.peek("positive", {
        data: { message: `'${o.template.name}' saved.` }
      });
      for (const c of o.warnings)
        (s = l(this, pt)) == null || s.peek("warning", { data: { message: c.message } });
      n && window.history.replaceState({}, "", Xt(o.template.key));
    } catch (o) {
      throw T(this, k, ts).call(this, "The template could not be saved", o), o;
    }
  }
  destroy() {
    l(this, ae).clear(), super.destroy();
  }
}
U = new WeakMap(), Rt = new WeakMap(), Ve = new WeakMap(), ut = new WeakMap(), dt = new WeakMap(), Ut = new WeakMap(), Nt = new WeakMap(), Ft = new WeakMap(), ht = new WeakMap(), Kt = new WeakMap(), Ee = new WeakMap(), Bt = new WeakMap(), Vt = new WeakMap(), ae = new WeakMap(), Pi = new WeakMap(), pt = new WeakMap(), _e = new WeakMap(), k = new WeakSet(), Za = async function(i) {
  const [a, s] = await Promise.all([
    mi(this.getToken).catch(() => []),
    T(this, k, Qa).call(this, i.docTypeAliases)
  ]);
  l(this, dt).setValue(a), l(this, ut).setValue(s);
}, Qa = async function(i) {
  if (i.length === 0) return [];
  const a = await Promise.all(
    i.map((o) => Ko(o, this.getToken).catch(() => []))
  ), s = /* @__PURE__ */ new Map();
  for (const o of a.flat())
    s.has(o.alias) || s.set(o.alias, o);
  return [...s.values()];
}, // ------------------------------------------------------------------ mutation
/**
 * The single write path. Everything the designer changes goes through here, which is what makes
 * the undo stack, the dirty flag and the derived observables consistent by construction.
 */
Ce = function(i, a = !0) {
  const s = l(this, U).getValue();
  if (!s) return;
  a && l(this, ae).push(s);
  const o = i(structuredClone(s));
  T(this, k, ot).call(this, o);
}, ot = function(i, a) {
  a != null && a.resetHistory && l(this, ae).clear(), l(this, U).setValue(i), l(this, Rt).setValue(i.layers), T(this, k, es).call(this);
}, es = function() {
  l(this, Bt).setValue(l(this, ae).canUndo), l(this, Vt).setValue(l(this, ae).canRedo);
}, ts = function(i, a) {
  var o;
  const s = a instanceof Xe ? a.detail ?? a.message : a instanceof Error ? a.message : i;
  console.error("[DynamicImages]", i, a), (o = l(this, pt)) == null || o.peek("danger", { data: { headline: i, message: s } });
};
const xt = new wl(
  "UmbWorkspaceContext",
  void 0,
  // Discriminated on the workspace alias, so consuming it inside a document workspace (where the
  // property action lives) cannot accidentally resolve this one.
  (e) => {
    var t;
    return ((t = e.getEntityType) == null ? void 0 : t.call(e)) === "di-template";
  }
), Gl = [
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
    element: () => Promise.resolve().then(() => oc),
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
      href: `section/${Gt}/dashboard/fonts`
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
      href: `section/${Gt}/dashboard/health`
    }
  },
  // ---------------------------------------------------------------- dashboards
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Overview",
    name: "Dynamic Images Overview",
    element: () => Promise.resolve().then(() => cc),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => Promise.resolve().then(() => yc),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }]
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => Promise.resolve().then(() => wc),
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
    api: jl,
    meta: { entityType: Ii }
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => Promise.resolve().then(() => wu),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => Promise.resolve().then(() => Tu),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => Promise.resolve().then(() => Pu),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => Promise.resolve().then(() => Au),
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
    api: () => Promise.resolve().then(() => Lu),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }]
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => Promise.resolve().then(() => Ru),
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
    api: () => Promise.resolve().then(() => Uu),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" }
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => Promise.resolve().then(() => Nu),
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
    element: () => Promise.resolve().then(() => Vu)
  },
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => Promise.resolve().then(() => Yu)
  }
], dd = (e, t) => {
  t.registerMany(Gl);
};
var Xl = Object.defineProperty, Yl = Object.getOwnPropertyDescriptor, on = (e) => {
  throw TypeError(e);
}, Ps = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Yl(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Xl(t, i, s), s;
}, zs = (e, t, i) => t.has(e) || on("Cannot " + i), ql = (e, t, i) => (zs(e, t, "read from private field"), t.get(e)), ho = (e, t, i) => t.has(e) ? on("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Jl = (e, t, i, a) => (zs(e, t, "write to private field"), t.set(e, i), i), Zl = (e, t, i) => (zs(e, t, "access private method"), i), ma, is, nn;
let vt = class extends z {
  constructor() {
    super(), ho(this, is), ho(this, ma), this._name = "", this._loading = !0, this.consumeContext(xt, (e) => {
      Jl(this, ma, e), e && (this.observe(e.template, (t) => {
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
            @input=${Zl(this, is, nn)}>
          </uui-input>
        </div>
      </umb-workspace-editor>
      ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
    `;
  }
};
ma = /* @__PURE__ */ new WeakMap();
is = /* @__PURE__ */ new WeakSet();
nn = function(e) {
  var i;
  const t = e.target.value;
  (i = ql(this, ma)) == null || i.updateTemplateFields({ name: t });
};
vt.styles = D`
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
Ps([
  h()
], vt.prototype, "_name", 2);
Ps([
  h()
], vt.prototype, "_loading", 2);
vt = Ps([
  E("di-template-editor")
], vt);
const Ql = vt, po = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplateEditorElement() {
    return vt;
  },
  default: Ql
}, Symbol.toStringTag, { value: "Module" }));
var ec = Object.defineProperty, tc = Object.getOwnPropertyDescriptor, rn = (e) => {
  throw TypeError(e);
}, ei = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? tc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ec(t, i, s), s;
}, Ms = (e, t, i) => t.has(e) || rn("Cannot " + i), lt = (e, t, i) => (Ms(e, t, "read from private field"), t.get(e)), oi = (e, t, i) => t.has(e) ? rn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ic = (e, t, i, a) => (Ms(e, t, "write to private field"), t.set(e, i), i), Gi = (e, t, i) => (Ms(e, t, "access private method"), i), Xi, fa, Yi, qi, Dt, as, ln, cn;
let ke = class extends z {
  constructor() {
    super(), oi(this, Dt), oi(this, Xi), this._templates = [], this._issuesByTemplate = /* @__PURE__ */ new Map(), this._loading = !0, this._activeKey = Ya(), this._expanded = !0, oi(this, fa, () => {
      var e;
      return (e = lt(this, Xi)) == null ? void 0 : e.getLatestToken();
    }), oi(this, Yi, () => {
      this._activeKey = Ya();
    }), oi(this, qi, () => {
      Gi(this, Dt, as).call(this);
    }), this.consumeContext(Oe, (e) => {
      ic(this, Xi, e), e && Gi(this, Dt, as).call(this);
    }), window.addEventListener("changestate", lt(this, Yi)), window.addEventListener(ha, lt(this, qi));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("changestate", lt(this, Yi)), window.removeEventListener(ha, lt(this, qi));
  }
  render() {
    return r`
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
        ${Gi(this, Dt, ln).call(this)}
      </uui-menu-item>
    `;
  }
};
Xi = /* @__PURE__ */ new WeakMap();
fa = /* @__PURE__ */ new WeakMap();
Yi = /* @__PURE__ */ new WeakMap();
qi = /* @__PURE__ */ new WeakMap();
Dt = /* @__PURE__ */ new WeakSet();
as = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Ts(lt(this, fa)),
      Ta(lt(this, fa)).catch(() => {
      })
    ]);
    this._templates = e, this._issuesByTemplate = ac((t == null ? void 0 : t.issues) ?? []);
  } catch (e) {
    console.error("[DynamicImages] Failed to load the template list", e), this._templates = [];
  } finally {
    this._loading = !1;
  }
};
ln = function() {
  return this._loading ? r`<uui-loader></uui-loader>` : r`
      ${A(
    this._templates,
    (e) => e.key,
    (e) => Gi(this, Dt, cn).call(this, e)
  )}
      <uui-menu-item label="Create template" href=${Ca()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
};
cn = function(e) {
  const t = this._issuesByTemplate.get(e.key) ?? 0;
  return r`
      <uui-menu-item
        label=${e.name}
        href=${Xt(e.key)}
        ?active=${e.key === this._activeKey}>
        <uui-icon
          slot="icon"
          name=${e.isEnabled ? "icon-picture" : "icon-block"}
          class=${e.isEnabled ? "enabled" : "disabled"}>
        </uui-icon>
        ${t > 0 ? r`<uui-badge slot="badge" color="warning" look="primary" title="${t} issue(s)">${t}</uui-badge>` : p}
      </uui-menu-item>
    `;
};
ke.styles = D`
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
ei([
  h()
], ke.prototype, "_templates", 2);
ei([
  h()
], ke.prototype, "_issuesByTemplate", 2);
ei([
  h()
], ke.prototype, "_loading", 2);
ei([
  h()
], ke.prototype, "_activeKey", 2);
ei([
  h()
], ke.prototype, "_expanded", 2);
ke = ei([
  E("di-templates-menu-item")
], ke);
function ac(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    !i.templateKey || i.severity === "info" || t.set(i.templateKey, (t.get(i.templateKey) ?? 0) + 1);
  return t;
}
const sc = ke, oc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiTemplatesMenuItemElement() {
    return ke;
  },
  default: sc
}, Symbol.toStringTag, { value: "Module" }));
var nc = Object.defineProperty, rc = Object.getOwnPropertyDescriptor, un = (e) => {
  throw TypeError(e);
}, tt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? rc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && nc(t, i, s), s;
}, Os = (e, t, i) => t.has(e) || un("Cannot " + i), we = (e, t, i) => (Os(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Vi = (e, t, i) => t.has(e) ? un("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), mo = (e, t, i, a) => (Os(e, t, "write to private field"), t.set(e, i), i), x = (e, t, i) => (Os(e, t, "access private method"), i), Ji, ga, $e, _, ti, ce, dn, hn, pn, mn, fn, gn, yn, li, vn, bn, _n, wn, $n;
let ue = class extends z {
  constructor() {
    super(), Vi(this, _), Vi(this, Ji), Vi(this, ga), this._templates = [], this._fonts = [], this._loading = !0, this._importing = !1, this._pasteJson = "", this._showPaste = !1, Vi(this, $e, () => {
      var e;
      return (e = we(this, Ji)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(et, (e) => {
      mo(this, ga, e);
    }), this.consumeContext(Oe, (e) => {
      mo(this, Ji, e), e && x(this, _, ti).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Dynamic Images">
        ${x(this, _, gn).call(this)} ${x(this, _, yn).call(this)} ${x(this, _, vn).call(this)} ${x(this, _, bn).call(this)}
      </umb-body-layout>
    `;
  }
};
Ji = /* @__PURE__ */ new WeakMap();
ga = /* @__PURE__ */ new WeakMap();
$e = /* @__PURE__ */ new WeakMap();
_ = /* @__PURE__ */ new WeakSet();
ti = async function() {
  this._loading = !0;
  try {
    const [e, t, i] = await Promise.all([
      Ts(we(this, $e)),
      mi(we(this, $e)).catch(() => []),
      Ta(we(this, $e)).catch(() => {
      })
    ]);
    this._templates = e, this._fonts = t, this._health = i;
  } catch (e) {
    x(this, _, ce).call(this, "danger", "The dashboard could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
ce = function(e, t, i) {
  var s;
  const a = i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = we(this, ga)) == null || s.peek(e, { data: { headline: t, message: a } });
};
dn = async function() {
  this._importing = !0;
  try {
    const e = await Lo(we(this, $e));
    x(this, _, ce).call(this, e.created.length > 0 ? "positive" : "warning", e.created.length > 0 ? `Imported ${e.created.length} template(s)` : "Nothing was imported");
    for (const t of e.warnings.slice(0, 5)) x(this, _, ce).call(this, "warning", t);
    Qt(), await x(this, _, ti).call(this);
  } catch (e) {
    x(this, _, ce).call(this, "danger", "The import failed", e);
  } finally {
    this._importing = !1;
  }
};
hn = async function() {
  if (this._pasteJson.trim()) {
    this._importing = !0;
    try {
      await Ao(this._pasteJson, "create", we(this, $e)), x(this, _, ce).call(this, "positive", "Imported"), this._pasteJson = "", this._showPaste = !1, Qt(), await x(this, _, ti).call(this);
    } catch (e) {
      x(this, _, ce).call(this, "danger", "That could not be imported", e);
    } finally {
      this._importing = !1;
    }
  }
};
pn = async function(e) {
  try {
    await Oo(e.key, we(this, $e)), x(this, _, ce).call(this, "positive", `'${e.name}' duplicated`), Qt(), await x(this, _, ti).call(this);
  } catch (t) {
    x(this, _, ce).call(this, "danger", "The template could not be duplicated", t);
  }
};
mn = async function(e) {
  await Ss(this, {
    headline: `Delete '${e.name}'?`,
    content: "Images already generated by it stay in the media library; nothing new will be generated.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await Mo(e.key, we(this, $e)), x(this, _, ce).call(this, "positive", `'${e.name}' deleted`), Qt(), await x(this, _, ti).call(this);
  } catch (t) {
    x(this, _, ce).call(this, "danger", "The template could not be deleted", t);
  }
};
fn = async function(e) {
  try {
    const t = await Io(e.key, we(this, $e)), i = URL.createObjectURL(t), a = document.createElement("a");
    a.href = i, a.download = `${e.alias}.json`, a.click(), URL.revokeObjectURL(i);
  } catch (t) {
    x(this, _, ce).call(this, "danger", "The template could not be exported", t);
  }
};
gn = function() {
  var t;
  if (!((t = this._health) != null && t.legacyConfigPresent)) return p;
  const e = this._templates.length > 0;
  return r`
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
            @click=${x(this, _, dn)}>
            Import from appsettings
          </uui-button>
        </div>
      </uui-box>
    `;
};
yn = function() {
  var t, i, a;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((s) => s.severity !== "info").length) ?? 0;
  return r`
      <div class="stats">
        ${x(this, _, li).call(this, "Templates", this._templates.length, "icon-brush")}
        ${x(this, _, li).call(this, "Fonts", this._fonts.length, "icon-font")}
        ${x(this, _, li).call(this, "Issues", e, e > 0 ? "icon-alert" : "icon-check", e > 0)}
        ${x(this, _, li).call(this, "Generation", ((i = this._health) == null ? void 0 : i.isEnabled) === !1 ? "Off" : "On", "icon-power", ((a = this._health) == null ? void 0 : a.isEnabled) === !1)}
      </div>
    `;
};
li = function(e, t, i, a = !1) {
  return r`
      <uui-box class="stat ${a ? "warn" : ""}">
        <uui-icon name=${i}></uui-icon>
        <div class="stat-value">${t}</div>
        <div class="stat-label">${e}</div>
      </uui-box>
    `;
};
vn = function() {
  var t;
  const e = ((t = this._health) == null ? void 0 : t.issues.filter((i) => i.severity !== "info")) ?? [];
  return e.length === 0 ? p : r`
      <uui-box headline="Needs attention">
        <uui-table>
          ${A(
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
        <uui-button look="secondary" href=${Jo("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
};
bn = function() {
  return r`
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
          <uui-button look="primary" color="positive" href=${Ca()} label="Create a template">
            Create
          </uui-button>
        </div>

        ${this._showPaste ? x(this, _, _n).call(this) : p}
        ${this._templates.length === 0 ? x(this, _, wn).call(this) : x(this, _, $n).call(this)}
      </uui-box>
    `;
};
_n = function() {
  return r`
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
          @click=${x(this, _, hn)}>
          Import
        </uui-button>
      </div>
    `;
};
wn = function() {
  return r`
      <div class="empty">
        <uui-icon name="icon-brush"></uui-icon>
        <h4>No templates yet</h4>
        <p>A template says which document types get a generated image, and what it looks like.</p>
        <uui-button look="primary" color="positive" href=${Ca()} label="Create your first template">
          Create your first template
        </uui-button>
      </div>
    `;
};
$n = function() {
  return r`
      <div class="cards">
        ${A(
    this._templates,
    (e) => e.key,
    (e) => r`
            <uui-box class="card ${e.isEnabled ? "" : "disabled"}">
              <div slot="headline">
                <a href=${Xt(e.key)}>${e.name}</a>
                ${e.isEnabled ? p : r`<uui-tag look="secondary">Disabled</uui-tag>`}
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
                <uui-button look="secondary" href=${Xt(e.key)} label="Design ${e.name}">
                  Design
                </uui-button>
                <uui-button look="secondary" label="Duplicate ${e.name}" @click=${() => x(this, _, pn).call(this, e)}>
                  Duplicate
                </uui-button>
                <uui-button look="secondary" label="Export ${e.name}" @click=${() => x(this, _, fn).call(this, e)}>
                  Export
                </uui-button>
                <uui-button
                  look="secondary"
                  color="danger"
                  label="Delete ${e.name}"
                  @click=${() => x(this, _, mn).call(this, e)}>
                  Delete
                </uui-button>
              </div>
            </uui-box>
          `
  )}
      </div>
    `;
};
ue.styles = D`
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
tt([
  h()
], ue.prototype, "_templates", 2);
tt([
  h()
], ue.prototype, "_fonts", 2);
tt([
  h()
], ue.prototype, "_health", 2);
tt([
  h()
], ue.prototype, "_loading", 2);
tt([
  h()
], ue.prototype, "_importing", 2);
tt([
  h()
], ue.prototype, "_pasteJson", 2);
tt([
  h()
], ue.prototype, "_showPaste", 2);
ue = tt([
  E("di-overview-dashboard")
], ue);
const lc = ue, cc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiOverviewDashboardElement() {
    return ue;
  },
  default: lc
}, Symbol.toStringTag, { value: "Module" })), ss = /* @__PURE__ */ new Map(), za = (e) => `di-${e}`;
function uc(e, t) {
  if (!e) return Promise.resolve(void 0);
  const i = ss.get(e);
  if (i) return i;
  const a = (async () => {
    try {
      const s = await Fo(e, t), o = new FontFace(za(e), s);
      return await o.load(), document.fonts.add(o), o;
    } catch (s) {
      console.warn("[DynamicImages] Could not load font", e, s);
      return;
    }
  })();
  return ss.set(e, a), a;
}
async function xn(e, t) {
  const i = [...new Set([...e].filter(Boolean))];
  await Promise.all(i.map((a) => uc(a, t)));
}
function dc(e) {
  ss.delete(e);
}
const hc = new To(
  "DynamicImages.Modal.SampleNodePicker",
  { modal: { type: "sidebar", size: "small" } }
), pc = new To(
  "DynamicImages.Modal.FontUpload",
  { modal: { type: "dialog", size: "small" } }
);
var mc = Object.defineProperty, fc = Object.getOwnPropertyDescriptor, kn = (e) => {
  throw TypeError(e);
}, Ma = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? fc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && mc(t, i, s), s;
}, Is = (e, t, i) => t.has(e) || kn("Cannot " + i), Ye = (e, t, i) => (Is(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ni = (e, t, i) => t.has(e) ? kn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Fa = (e, t, i, a) => (Is(e, t, "write to private field"), t.set(e, i), i), F = (e, t, i) => (Is(e, t, "access private method"), i), Zi, yi, ya, Yt, O, Ai, qt, os, Sn, Qi, Tn, Cn, Dn;
let qe = class extends z {
  constructor() {
    super(), ni(this, O), ni(this, Zi), ni(this, yi), ni(this, ya), this._fonts = [], this._loading = !0, ni(this, Yt, () => {
      var e;
      return (e = Ye(this, Zi)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(ka, (e) => {
      Fa(this, yi, e);
    }), this.consumeContext(et, (e) => {
      Fa(this, ya, e);
    }), this.consumeContext(Oe, (e) => {
      Fa(this, Zi, e), e && F(this, O, Ai).call(this);
    });
  }
  render() {
    return this._loading ? r`<div class="state"><uui-loader></uui-loader></div>` : r`
      <umb-body-layout headline="Fonts">
        <uui-box headline="Installed fonts">
          <div slot="header-actions">
            <uui-button look="primary" color="positive" label="Add a font" @click=${F(this, O, os)}>Add a font</uui-button>
          </div>

          ${this._fonts.length === 0 ? r`<div class="empty">
                <uui-icon name="icon-font"></uui-icon>
                <h4>No fonts yet</h4>
                <p>Text layers need a font. Upload a .ttf, .otf or .woff2, or point at one already in wwwroot.</p>
                <uui-button look="primary" color="positive" label="Add your first font" @click=${F(this, O, os)}>
                  Add your first font
                </uui-button>
              </div>` : r`${A(this._fonts, (e) => e.key, (e) => F(this, O, Tn).call(this, e))}`}
        </uui-box>
      </umb-body-layout>
    `;
  }
};
Zi = /* @__PURE__ */ new WeakMap();
yi = /* @__PURE__ */ new WeakMap();
ya = /* @__PURE__ */ new WeakMap();
Yt = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakSet();
Ai = async function() {
  this._loading = !0;
  try {
    this._fonts = await mi(Ye(this, Yt)), await xn(this._fonts.map((e) => e.key), Ye(this, Yt));
  } catch (e) {
    F(this, O, qt).call(this, "danger", "The fonts could not be loaded", e);
  } finally {
    this._loading = !1;
  }
};
qt = function(e, t, i) {
  var s;
  const a = i instanceof Xe ? i.detail ?? i.message : i instanceof Error ? i.message : "";
  i && console.error("[DynamicImages]", t, i), (s = Ye(this, ya)) == null || s.peek(e, { data: { headline: t, message: a } });
};
os = async function() {
  if (!Ye(this, yi)) return;
  const e = Ye(this, yi).open(this, pc, {}), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t != null && t.uploaded && await F(this, O, Ai).call(this);
};
Sn = async function(e) {
  await Ss(this, {
    headline: `Delete '${e.familyName}'?`,
    content: "Templates using it will stop rendering their text until another font is chosen.",
    confirmLabel: "Delete",
    color: "danger"
  });
  try {
    await No(e.key, Ye(this, Yt)), dc(e.key), F(this, O, qt).call(this, "positive", `'${e.familyName}' deleted`), await F(this, O, Ai).call(this);
  } catch (t) {
    F(this, O, qt).call(this, "danger", "That font could not be deleted", t);
  }
};
Qi = async function(e, t, i) {
  try {
    await Uo(e.key, t, i, Ye(this, Yt)), this._editingKey = void 0, F(this, O, qt).call(this, "positive", `'${t}' saved`), await F(this, O, Ai).call(this);
  } catch (a) {
    F(this, O, qt).call(this, "danger", "The font could not be saved", a);
  }
};
Tn = function(e) {
  const t = this._editingKey === e.key;
  return r`
      <div class="font">
        <div class="head">
          <div>
            <strong>${e.familyName}</strong>
            <span class="meta">
              ${e.sourceKind === "path" ? e.path : "Media library"} · weight ${e.weight}
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
            <uui-button look="secondary" color="danger" label="Delete ${e.familyName}" @click=${() => F(this, O, Sn).call(this, e)}>
              Delete
            </uui-button>
          </div>
        </div>

        <p class="specimen" style="font-family: ${za(e.key)}, serif">
          Designing social share images that actually get clicked
        </p>

        ${t ? F(this, O, Dn).call(this, e) : F(this, O, Cn).call(this, e)}
      </div>
    `;
};
Cn = function(e) {
  return e.styles.length === 0 ? p : r`<div class="tags">
      ${A(
    e.styles,
    (t) => t.name,
    (t) => r`<uui-tag look="secondary">${t.name} · ${t.size}px · ${t.fontStyle}</uui-tag>`
  )}
    </div>`;
};
Dn = function(e) {
  const t = [...e.styles];
  return r`
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
          ${A(
    t,
    (i, a) => a,
    (i, a) => r`
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
      t.splice(a, 1), F(this, O, Qi).call(this, e, e.familyName, t);
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
    t.push({ name: "New style", size: 32, fontStyle: "Regular" }), F(this, O, Qi).call(this, e, e.familyName, t);
  }}>
            Add a style
          </uui-button>
          <uui-button
            look="primary"
            color="positive"
            label="Save the styles for ${e.familyName}"
            @click=${() => {
    const i = this.renderRoot.querySelector(`#family-${e.key}`);
    F(this, O, Qi).call(this, e, (i == null ? void 0 : i.value) || e.familyName, t);
  }}>
            Save
          </uui-button>
        </div>
      </div>
    `;
};
qe.styles = D`
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
Ma([
  h()
], qe.prototype, "_fonts", 2);
Ma([
  h()
], qe.prototype, "_loading", 2);
Ma([
  h()
], qe.prototype, "_editingKey", 2);
qe = Ma([
  E("di-fonts-dashboard")
], qe);
const gc = qe, yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontsDashboardElement() {
    return qe;
  },
  default: gc
}, Symbol.toStringTag, { value: "Module" }));
var vc = Object.defineProperty, bc = Object.getOwnPropertyDescriptor, En = (e) => {
  throw TypeError(e);
}, Li = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && vc(t, i, s), s;
}, As = (e, t, i) => t.has(e) || En("Cannot " + i), Ne = (e, t, i) => (As(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Hi = (e, t, i) => t.has(e) ? En("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fo = (e, t, i, a) => (As(e, t, "write to private field"), t.set(e, i), i), zt = (e, t, i) => (As(e, t, "access private method"), i), ea, Mt, Jt, He, va, ns, Pn;
let ze = class extends z {
  constructor() {
    super(), Hi(this, He), Hi(this, ea), Hi(this, Mt), this._loading = !0, this._busy = !1, Hi(this, Jt, () => {
      var e;
      return (e = Ne(this, ea)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(et, (e) => {
      fo(this, Mt, e);
    }), this.consumeContext(Oe, (e) => {
      fo(this, ea, e), e && zt(this, He, va).call(this);
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
            <uui-button look="secondary" label="Re-check" @click=${() => zt(this, He, va).call(this)}>Re-check</uui-button>
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
                ${A(
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
                        ${a.templateKey ? r`<a href=${Xt(a.templateKey)}>${a.templateName}</a>` : r`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${a.message}</uui-table-cell>
                      <uui-table-cell><code>${a.code}</code></uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${zt(this, He, Pn).call(this)}
      </umb-body-layout>
    `;
  }
};
ea = /* @__PURE__ */ new WeakMap();
Mt = /* @__PURE__ */ new WeakMap();
Jt = /* @__PURE__ */ new WeakMap();
He = /* @__PURE__ */ new WeakSet();
va = async function() {
  this._loading = !0;
  try {
    const [e, t] = await Promise.all([
      Ta(Ne(this, Jt)),
      Xo(Ne(this, Jt)).catch(() => {
      })
    ]);
    this._health = e, this._sync = t;
  } catch (e) {
    console.error("[DynamicImages] Failed to load health", e);
  } finally {
    this._loading = !1;
  }
};
ns = async function(e) {
  var t, i, a;
  this._busy = !0;
  try {
    const s = e === "export" ? await Yo(Ne(this, Jt)) : await qo(Ne(this, Jt));
    (t = Ne(this, Mt)) == null || t.peek("positive", {
      data: {
        headline: e === "export" ? "Exported" : "Imported",
        message: e === "export" ? `${s.written} file(s) written.` : `${s.imported} template(s) imported.`
      }
    });
    for (const o of s.messages.slice(0, 3))
      (i = Ne(this, Mt)) == null || i.peek("warning", { data: { message: o } });
    await zt(this, He, va).call(this);
  } catch (s) {
    (a = Ne(this, Mt)) == null || a.peek("danger", {
      data: { headline: "That did not work", message: s instanceof Error ? s.message : "" }
    });
  } finally {
    this._busy = !1;
  }
};
Pn = function() {
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
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => zt(this, He, ns).call(this, "export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => zt(this, He, ns).call(this, "import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    ` : p;
};
ze.styles = D`
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
Li([
  h()
], ze.prototype, "_health", 2);
Li([
  h()
], ze.prototype, "_sync", 2);
Li([
  h()
], ze.prototype, "_loading", 2);
Li([
  h()
], ze.prototype, "_busy", 2);
ze = Li([
  E("di-health-dashboard")
], ze);
const _c = ze, wc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiHealthDashboardElement() {
    return ze;
  },
  default: _c
}, Symbol.toStringTag, { value: "Module" }));
function $c(e, t) {
  const i = [], a = t.lockX ? void 0 : go(
    [
      { value: e.x, offset: 0 },
      { value: e.x + e.width / 2, offset: e.width / 2 },
      { value: e.x + e.width, offset: e.width }
    ],
    xc(t),
    t.threshold
  ), s = t.lockY ? void 0 : go(
    [
      { value: e.y, offset: 0 },
      { value: e.y + e.height / 2, offset: e.height / 2 },
      { value: e.y + e.height, offset: e.height }
    ],
    kc(t),
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
function xc(e) {
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
function kc(e) {
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
function go(e, t, i) {
  let a;
  for (const s of e)
    for (const o of t) {
      const n = Math.abs(o.at - s.value);
      n > i || (!a || n < a.distance) && (a = { at: o.at, offset: s.offset, label: o.label, distance: n });
    }
  return a;
}
var Sc = Object.defineProperty, Tc = Object.getOwnPropertyDescriptor, zn = (e) => {
  throw TypeError(e);
}, Ie = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Tc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Sc(t, i, s), s;
}, Ls = (e, t, i) => t.has(e) || zn("Cannot " + i), We = (e, t, i) => (Ls(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ka = (e, t, i) => t.has(e) ? zn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ba = (e, t, i, a) => (Ls(e, t, "write to private field"), t.set(e, i), i), q = (e, t, i) => (Ls(e, t, "access private method"), i), nt, ci, R, Ws, Mn, On, In, An, Rs, Ln, Wn, Rn, Un, Nn, Fn, Kn, Bn, Vn;
const Cc = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
let ge = class extends z {
  constructor() {
    super(...arguments), Ka(this, R), this.scale = 1, this.selected = !1, this.showMeasured = !1, this._box = { x: 0, y: 0, width: 0, height: 0 }, Ka(this, nt), Ka(this, ci);
  }
  willUpdate() {
    this._box = q(this, R, Mn).call(this);
  }
  updated() {
    var t;
    const e = this.renderRoot.querySelector(".box") ?? void 0;
    e !== We(this, ci) && ((t = We(this, nt)) == null || t.disconnect(), Ba(this, ci, e), e && (We(this, nt) ?? Ba(this, nt, new ResizeObserver(
      () => this.dispatchEvent(new CustomEvent("di-layer-box-resize", { bubbles: !0, composed: !0 }))
    )), We(this, nt).observe(e)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = We(this, nt)) == null || e.disconnect(), Ba(this, ci, void 0);
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.layer.isVisible) return p;
    const e = this._box;
    return r`
      <div
        class=${So({ box: !0, selected: this.selected, locked: this.layer.isLocked })}
        style=${J({
      left: `${e.x * this.scale}px`,
      top: `${e.y * this.scale}px`,
      width: `${e.width * this.scale}px`,
      // An auto-height layer grows downward from its anchored top instead of being cut off at
      // an estimated height - a wrapped two-line title would otherwise lose its second line.
      ...We(this, R, On) ? { minHeight: `${e.height * this.scale}px`, overflow: "visible" } : { height: `${e.height * this.scale}px` },
      opacity: String(this.layer.opacity)
    })}
        role="button"
        tabindex=${this.layer.isLocked ? -1 : 0}
        aria-label="${this.layer.name || this.layer.type} layer"
        aria-pressed=${this.selected}
        @pointerdown=${(t) => {
      q(this, R, Ln).call(this, t), q(this, R, Rs).call(this, t);
    }}>
        ${q(this, R, Wn).call(this)}
      </div>

      ${this.selected ? q(this, R, Bn).call(this, e) : p}
      ${this.showMeasured && this.measured ? q(this, R, Vn).call(this) : p}
    `;
  }
};
nt = /* @__PURE__ */ new WeakMap();
ci = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakSet();
Ws = function() {
  return this.resolvedPosition ?? this.layer.position;
};
Mn = function() {
  var s;
  const e = this.layer, t = e.size.width ?? q(this, R, In).call(this), i = e.size.height ?? ((s = this.measured) == null ? void 0 : s.height) ?? q(this, R, An).call(this), a = Pa(We(this, R, Ws), t, i);
  return { x: a.x, y: a.y, width: t, height: i };
};
On = function() {
  return this.layer.size.height === null || this.layer.size.height === void 0;
};
In = function() {
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
An = function() {
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
Rs = function(e, t) {
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
Ln = function(e) {
  e.stopPropagation(), this.dispatchEvent(
    new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: this.layer.key } })
  );
};
Wn = function() {
  switch (this.layer.type) {
    case "text":
      return q(this, R, Rn).call(this);
    case "image":
      return q(this, R, Nn).call(this);
    case "badges":
      return q(this, R, Fn).call(this);
    default:
      return q(this, R, Kn).call(this);
  }
};
Rn = function() {
  if (this.layer.type !== "text") return p;
  const e = this.layer.style, t = this.resolvedText || q(this, R, Un).call(this);
  return r`
      <div
        class="text"
        style=${J({
    // The real font, loaded through the FontFace API - that is what makes the wrapping in
    // the designer match the wrapping in the render.
    fontFamily: `${za(e.fontKey)}, sans-serif`,
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
Un = function() {
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
Nn = function() {
  if (this.layer.type !== "image") return p;
  const e = this.layer.border;
  return r`
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
Fn = function() {
  if (this.layer.type !== "badges") return p;
  const { badge: e, label: t, gap: i, maxItems: a, direction: s, wrap: o, rowGap: n } = this.layer, c = s === "horizontal", f = c && o, b = t.position ?? "below";
  return r`
      <div
        class="badges"
        style=${J({
    flexDirection: c ? "row" : "column",
    flexWrap: f ? "wrap" : "nowrap",
    gap: `${i * this.scale}px`,
    // Wrapped rows are a row gap apart; the item gap stays between items in a row.
    ...f ? { rowGap: `${n * this.scale}px` } : {}
  })}>
        ${A(
    Array.from({ length: Math.max(1, a) }, (L, st) => st),
    (L) => L,
    () => r`
            <div class=${So({ badge: !0, right: b === "right" })}>
              <div
                class="circle"
                style=${J({
      width: `${e.size * this.scale}px`,
      height: `${e.size * this.scale}px`,
      background: e.fillColour,
      border: `${e.borderWidth * this.scale}px solid ${e.borderColour}`
    })}>
              </div>
              ${b === "none" ? p : r`<div
                    class="badge-label"
                    style=${J({
      ...b === "right" ? { marginLeft: `${t.gap * this.scale}px` } : { marginTop: `${t.gap * this.scale}px` },
      fontFamily: `${za(t.fontKey)}, sans-serif`,
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
Kn = function() {
  if (this.layer.type !== "rect") return p;
  const e = this.layer.gradient;
  return r`
      <div
        class="rect"
        style=${J({
    background: e ? `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})` : this.layer.fill ?? "transparent",
    borderRadius: `${this.layer.cornerRadius * this.scale}px`
  })}>
      </div>
    `;
};
Bn = function(e) {
  const t = e.x * this.scale, i = e.y * this.scale, a = e.width * this.scale, s = e.height * this.scale, o = We(this, R, Ws), n = xe(this.layer.position, "x") || xe(this.layer.position, "y");
  return r`
      <div class="chrome" style=${J({ left: `${t}px`, top: `${i}px`, width: `${a}px`, height: `${s}px` })}>
        <span class="tag">
          ${n ? r`<uui-icon name="icon-link" title="Positioned relative to another layer"></uui-icon>` : p}
          ${this.layer.name || this.layer.type}
        </span>

        ${this.layer.isLocked ? p : A(
    Cc,
    (c) => c,
    (c) => r`
                <span
                  class="handle ${c}"
                  role="button"
                  tabindex="-1"
                  aria-label="Resize ${c}"
                  @pointerdown=${(f) => q(this, R, Rs).call(this, f, c)}>
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
Vn = function() {
  const e = this.measured;
  return r`
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
ge.styles = D`
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
Ie([
  m({ type: Object })
], ge.prototype, "layer", 2);
Ie([
  m({ type: Number })
], ge.prototype, "scale", 2);
Ie([
  m({ type: Boolean, reflect: !0 })
], ge.prototype, "selected", 2);
Ie([
  m({ type: Object })
], ge.prototype, "measured", 2);
Ie([
  m({ type: Boolean })
], ge.prototype, "showMeasured", 2);
Ie([
  m({ type: String })
], ge.prototype, "resolvedText", 2);
Ie([
  m({ attribute: !1 })
], ge.prototype, "resolvedPosition", 2);
Ie([
  h()
], ge.prototype, "_box", 2);
ge = Ie([
  E("di-layer-box")
], ge);
var Dc = Object.defineProperty, Ec = Object.getOwnPropertyDescriptor, Hn = (e) => {
  throw TypeError(e);
}, Us = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ec(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Dc(t, i, s), s;
}, Pc = (e, t, i) => t.has(e) || Hn("Cannot " + i), zc = (e, t, i) => t.has(e) ? Hn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Mc = (e, t, i) => (Pc(e, t, "access private method"), i), rs, jn;
let vi = class extends z {
  constructor() {
    super(...arguments), zc(this, rs), this.guides = [], this.scale = 1;
  }
  render() {
    return r`${A(
      this.guides,
      (e, t) => `${e.orientation}-${e.at}-${t}`,
      (e) => Mc(this, rs, jn).call(this, e)
    )}`;
  }
};
rs = /* @__PURE__ */ new WeakSet();
jn = function(e) {
  const t = `${e.at * this.scale}px`;
  return e.orientation === "vertical" ? r`<div class="guide vertical" style="left:${t}"><span class="label">${e.label}</span></div>` : r`<div class="guide horizontal" style="top:${t}"><span class="label">${e.label}</span></div>`;
};
vi.styles = D`
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
Us([
  m({ type: Array })
], vi.prototype, "guides", 2);
Us([
  m({ type: Number })
], vi.prototype, "scale", 2);
vi = Us([
  E("di-guides")
], vi);
var Oc = Object.defineProperty, Ic = Object.getOwnPropertyDescriptor, Gn = (e) => {
  throw TypeError(e);
}, Wi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ic(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Oc(t, i, s), s;
}, Ac = (e, t, i) => t.has(e) || Gn("Cannot " + i), Lc = (e, t, i) => t.has(e) ? Gn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), yo = (e, t, i) => (Ac(e, t, "access private method"), i), ta, ls;
let H = class extends z {
  constructor() {
    super(...arguments), Lc(this, ta), this.canvasWidth = 1200, this.canvasHeight = 630, this.scale = 1;
  }
  updated() {
    yo(this, ta, ls).call(this, "top"), yo(this, ta, ls).call(this, "left");
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
ta = /* @__PURE__ */ new WeakSet();
ls = function(e) {
  const t = this.renderRoot.querySelector(`#${e}`), i = t == null ? void 0 : t.getContext("2d");
  if (!t || !i) return;
  const a = e === "top" ? this.canvasWidth : this.canvasHeight, s = a * this.scale, o = window.devicePixelRatio || 1;
  t.width = (e === "top" ? s : H.thickness) * o, t.height = (e === "top" ? H.thickness : s) * o, t.style.width = `${e === "top" ? s : H.thickness}px`, t.style.height = `${e === "top" ? H.thickness : s}px`, i.setTransform(o, 0, 0, o, 0, 0), i.clearRect(0, 0, t.width, t.height);
  const n = getComputedStyle(this);
  i.strokeStyle = n.getPropertyValue("--uui-color-border").trim() || "#c4c4c4", i.fillStyle = n.getPropertyValue("--uui-color-text-alt").trim() || "#8a8a8a", i.font = "9px sans-serif", i.lineWidth = 1;
  for (let c = 0; c <= a; c += 50) {
    const f = Math.round(c * this.scale) + 0.5, b = c % 100 === 0, L = b ? 8 : 4;
    i.beginPath(), e === "top" ? (i.moveTo(f, H.thickness - L), i.lineTo(f, H.thickness)) : (i.moveTo(H.thickness - L, f), i.lineTo(H.thickness, f)), i.stroke(), b && c > 0 && (e === "top" ? i.fillText(String(c), f + 2, 9) : (i.save(), i.translate(9, f - 2), i.rotate(-Math.PI / 2), i.fillText(String(c), 0, 0), i.restore()));
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
Wi([
  m({ type: Number })
], H.prototype, "canvasWidth", 2);
Wi([
  m({ type: Number })
], H.prototype, "canvasHeight", 2);
Wi([
  m({ type: Number })
], H.prototype, "scale", 2);
Wi([
  m({ type: Object })
], H.prototype, "pointer", 2);
H = Wi([
  E("di-rulers")
], H);
var Wc = Object.defineProperty, Rc = Object.getOwnPropertyDescriptor, Xn = (e) => {
  throw TypeError(e);
}, Z = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Rc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Wc(t, i, s), s;
}, Ns = (e, t, i) => t.has(e) || Xn("Cannot " + i), P = (e, t, i) => (Ns(e, t, "read from private field"), i ? i.call(e) : t.get(e)), ee = (e, t, i) => t.has(e) ? Xn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ia = (e, t, i, a) => (Ns(e, t, "write to private field"), t.set(e, i), i), se = (e, t, i) => (Ns(e, t, "access private method"), i), rt, ui, Ot, G, cs, us, ds, Yn, Fs, qn, Jn, hs, aa, Tt, Zn, ps, ms, fs, gs, ys, vs, Qn;
const Uc = 6, er = 20;
let j = class extends z {
  constructor() {
    super(...arguments), ee(this, G), this.serverBounds = [], this.showMeasured = !1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this._fitScale = 1, this._guides = [], this._dropTarget = !1, ee(this, rt), ee(this, ui), ee(this, Ot, /* @__PURE__ */ new Map()), ee(this, hs, (e) => {
      const t = this.template.layers.find((i) => i.key === e.detail.key);
      !t || t.isLocked || (ia(this, rt, {
        key: t.key,
        handle: e.detail.handle,
        startClientX: e.detail.startX,
        startClientY: e.detail.startY,
        startBox: se(this, G, ds).call(this, t),
        moved: !1,
        shiftKey: e.detail.shiftKey,
        altKey: e.detail.altKey
      }), this.dispatchEvent(new CustomEvent("di-transaction-begin", { bubbles: !0, composed: !0 })));
    }), ee(this, aa, (e) => {
      var ai, Ki;
      this._pointer = se(this, G, us).call(this, e.clientX, e.clientY);
      const t = P(this, rt);
      if (!t) return;
      const i = this.template.layers.find((Te) => Te.key === t.key);
      if (!i) return;
      const a = (e.clientX - t.startClientX) / this.scale, s = (e.clientY - t.startClientY) / this.scale;
      if (!t.moved && Math.abs(a) < 1 && Math.abs(s) < 1) return;
      t.moved = !0;
      let o = t.handle ? se(this, G, Zn).call(this, t.startBox, t.handle, a, s, e.shiftKey) : { ...t.startBox, x: t.startBox.x + a, y: t.startBox.y + s };
      const n = xe(i.position, "x"), c = xe(i.position, "y");
      n && (o = { ...o, x: t.startBox.x, width: (ai = t.handle) != null && ai.includes("w") ? t.startBox.width : o.width }), c && (o = { ...o, y: t.startBox.y, height: (Ki = t.handle) != null && Ki.includes("n") ? t.startBox.height : o.height });
      const b = this.snapEnabled && !e.altKey ? $c(o, {
        canvasWidth: this.template.canvas.width,
        canvasHeight: this.template.canvas.height,
        others: this.template.layers.filter((Te) => Te.key !== i.key).map((Te) => se(this, G, ds).call(this, Te)),
        threshold: Uc / this.scale,
        lockX: n,
        lockY: c
      }) : {
        box: { ...o, x: n ? o.x : Math.round(o.x), y: c ? o.y : Math.round(o.y) },
        guides: []
      };
      this._guides = b.guides;
      const L = Rl(b.box, i.position);
      n && (L.x = i.position.x), c && (L.y = i.position.y);
      const st = { position: L };
      t.handle && (st.size = {
        width: Math.max(1, Math.round(b.box.width)),
        height: Math.max(1, Math.round(b.box.height))
      }), this.dispatchEvent(
        new CustomEvent("di-layer-change", { bubbles: !0, composed: !0, detail: { key: i.key, patch: st } })
      );
    }), ee(this, Tt, () => {
      if (!P(this, rt)) return;
      const e = P(this, rt).moved;
      ia(this, rt, void 0), this._guides = [], this.dispatchEvent(new CustomEvent("di-transaction-end", { bubbles: !0, composed: !0, detail: { moved: e } }));
    }), ee(this, ps, (e) => {
      var t;
      (t = e.dataTransfer) != null && t.types.includes("application/x-di-palette-item") && (e.preventDefault(), e.dataTransfer.dropEffect = "copy", this._dropTarget = !0);
    }), ee(this, ms, () => {
      this._dropTarget = !1;
    }), ee(this, fs, (e) => {
      var a;
      this._dropTarget = !1;
      const t = (a = e.dataTransfer) == null ? void 0 : a.getData("application/x-di-palette-item");
      if (!t) return;
      e.preventDefault();
      const i = se(this, G, us).call(this, e.clientX, e.clientY);
      this.dispatchEvent(
        new CustomEvent("di-palette-drop", {
          bubbles: !0,
          composed: !0,
          detail: { payload: JSON.parse(t), x: i.x, y: i.y }
        })
      );
    }), ee(this, gs, (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = this.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      this.dispatchEvent(new CustomEvent("di-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: t } }));
    }), ee(this, ys, () => {
      var e;
      (e = this.template) != null && e.layers.some((t) => sn(t.position)) && this.requestUpdate();
    }), ee(this, vs, (e) => {
      e.target === e.currentTarget && this.dispatchEvent(new CustomEvent("di-layer-select", { bubbles: !0, composed: !0, detail: { key: void 0 } }));
    });
  }
  get scale() {
    return this.zoom ?? this._fitScale;
  }
  connectedCallback() {
    super.connectedCallback(), ia(this, ui, new ResizeObserver(() => se(this, G, cs).call(this))), P(this, ui).observe(this), window.addEventListener("pointermove", P(this, aa)), window.addEventListener("pointerup", P(this, Tt)), window.addEventListener("pointercancel", P(this, Tt));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = P(this, ui)) == null || e.disconnect(), window.removeEventListener("pointermove", P(this, aa)), window.removeEventListener("pointerup", P(this, Tt)), window.removeEventListener("pointercancel", P(this, Tt));
  }
  updated() {
    se(this, G, cs).call(this);
  }
  /**
   * Where a layer ends up once any tracked axis is resolved, as of the last render. The inspector
   * uses this to bake a position in when a link is removed, and the design view when nudging
   * or deleting.
   */
  resolvedPositionOf(e) {
    var t;
    return (t = P(this, Ot).get(e)) == null ? void 0 : t.position;
  }
  // ------------------------------------------------------------------ rendering
  render() {
    if (!this.template) return p;
    const e = this.template.canvas, t = e.width * this.scale, i = e.height * this.scale, a = new Map(this.serverBounds.map((o) => [o.key, o]));
    se(this, G, Yn).call(this);
    const s = this.showRulers ? er : 0;
    return r`
      <div
        class="viewport ${this._dropTarget ? "drop-target" : ""}"
        @wheel=${P(this, gs)}
        @dragover=${P(this, ps)}
        @dragleave=${P(this, ms)}
        @drop=${P(this, fs)}
        @di-layer-drag-start=${P(this, hs)}
        @di-layer-box-resize=${P(this, ys)}>
        <div
          class="artboard"
          style=${J({
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
            style=${J({ background: e.background })}
            @pointerdown=${P(this, vs)}
            @pointerleave=${() => {
      this._pointer = void 0;
    }}>
            ${this.baseImageUrl ? r`<img
                  class="base"
                  src=${this.baseImageUrl}
                  alt=""
                  style=${J({ objectFit: e.baseImageFit === "stretch" ? "fill" : e.baseImageFit })} />` : p}

            ${A(
      this.template.layers,
      (o) => o.key,
      (o) => {
        var n, c;
        return r`
                <di-layer-box
                  data-key=${o.key}
                  .layer=${o}
                  .scale=${this.scale}
                  .selected=${o.key === this.selectedLayerKey}
                  .measured=${a.get(o.key)}
                  .showMeasured=${this.showMeasured}
                  .resolvedText=${((n = a.get(o.key)) == null ? void 0 : n.resolvedText) ?? void 0}
                  .resolvedPosition=${(c = P(this, Ot).get(o.key)) == null ? void 0 : c.position}>
                </di-layer-box>
              `;
      }
    )}

            ${this.showSafeArea ? se(this, G, Qn).call(this) : p}

            <di-guides .guides=${this._guides} .scale=${this.scale}></di-guides>
          </div>
        </div>
      </div>
    `;
  }
};
rt = /* @__PURE__ */ new WeakMap();
ui = /* @__PURE__ */ new WeakMap();
Ot = /* @__PURE__ */ new WeakMap();
G = /* @__PURE__ */ new WeakSet();
cs = function() {
  const e = this.renderRoot.querySelector(".viewport");
  if (!e || !this.template) return;
  const t = 48 + (this.showRulers ? er : 0), i = {
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
us = function(e, t) {
  const i = this.renderRoot.querySelector(".stage");
  if (!i) return { x: 0, y: 0 };
  const a = i.getBoundingClientRect();
  return {
    x: Math.round((e - a.left) / this.scale),
    y: Math.round((t - a.top) / this.scale)
  };
};
ds = function(e) {
  const t = P(this, Ot).get(e.key);
  if (t) return t.box;
  const i = se(this, G, Fs).call(this, e), a = Pa(e.position, i.width, i.height);
  return { x: a.x, y: a.y, ...i };
};
Yn = function() {
  const e = new Map(this.serverBounds.map((i) => [i.key, i])), t = this.serverBounds.length > 0;
  ia(this, Ot, Bl(
    this.template.layers,
    (i) => se(this, G, Fs).call(this, i, e.get(i.key)),
    (i) => !i.isVisible || t && !e.has(i.key)
  ));
};
Fs = function(e, t) {
  const i = this.renderRoot.querySelector(`di-layer-box[data-key="${e.key}"]`), a = e.type === "badges" && (t != null && t.width) ? t.width : void 0;
  return {
    width: e.size.width ?? a ?? se(this, G, qn).call(this, e, i),
    height: e.size.height ?? (t == null ? void 0 : t.height) ?? se(this, G, Jn).call(this, e, i)
  };
};
qn = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetWidth;
  return i ? i / this.scale : e.type === "text" ? 600 : 240;
};
Jn = function(e, t) {
  var a;
  const i = (a = t == null ? void 0 : t.querySelector(".box")) == null ? void 0 : a.offsetHeight;
  return i ? i / this.scale : e.type === "text" ? 80 : 135;
};
hs = /* @__PURE__ */ new WeakMap();
aa = /* @__PURE__ */ new WeakMap();
Tt = /* @__PURE__ */ new WeakMap();
Zn = function(e, t, i, a, s) {
  let { x: o, y: n, width: c, height: f } = e;
  if (t.includes("w") && (o = e.x + i, c = e.width - i), t.includes("e") && (c = e.width + i), t.includes("n") && (n = e.y + a, f = e.height - a), t.includes("s") && (f = e.height + a), s && e.width > 0 && e.height > 0) {
    const b = e.width / e.height;
    Math.abs(c - e.width) >= Math.abs(f - e.height) ? f = c / b : c = f * b, t.includes("n") && (n = e.y + e.height - f), t.includes("w") && (o = e.x + e.width - c);
  }
  return { x: o, y: n, width: Math.max(4, c), height: Math.max(4, f) };
};
ps = /* @__PURE__ */ new WeakMap();
ms = /* @__PURE__ */ new WeakMap();
fs = /* @__PURE__ */ new WeakMap();
gs = /* @__PURE__ */ new WeakMap();
ys = /* @__PURE__ */ new WeakMap();
vs = /* @__PURE__ */ new WeakMap();
Qn = function() {
  const e = this.template.canvas, t = e.width / 1.91, i = Math.max(0, (e.height - t) / 2) * this.scale;
  return r`<div class="safe-area" style=${J({ top: `${i}px`, bottom: `${i}px` })}></div>`;
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
  m({ type: Object })
], j.prototype, "template", 2);
Z([
  m({ type: String })
], j.prototype, "selectedLayerKey", 2);
Z([
  m({ type: Object })
], j.prototype, "baseImageUrl", 2);
Z([
  m({ type: Array })
], j.prototype, "serverBounds", 2);
Z([
  m({ type: Boolean })
], j.prototype, "showMeasured", 2);
Z([
  m({ type: Boolean })
], j.prototype, "snapEnabled", 2);
Z([
  m({ type: Boolean })
], j.prototype, "showRulers", 2);
Z([
  m({ type: Boolean })
], j.prototype, "showSafeArea", 2);
Z([
  m({ type: Number })
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
  E("di-designer-canvas")
], j);
var Nc = Object.defineProperty, Fc = Object.getOwnPropertyDescriptor, tr = (e) => {
  throw TypeError(e);
}, Ks = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Nc(t, i, s), s;
}, ir = (e, t, i) => t.has(e) || tr("Cannot " + i), Kc = (e, t, i) => (ir(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Bc = (e, t, i) => t.has(e) ? tr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pe = (e, t, i) => (ir(e, t, "access private method"), i), le, ar, sr, or, nr, rr, Et;
const vo = {
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
let bi = class extends z {
  constructor() {
    super(...arguments), Bc(this, le), this.properties = [], this._search = "";
  }
  render() {
    const e = Vc(Kc(this, le, ar));
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

        ${this.properties.length === 0 ? r`<p class="empty">Pick one or more document types in Settings to see their properties here.</p>` : A(
      [...e.entries()],
      ([t]) => t,
      ([t, i]) => Pe(this, le, nr).call(this, t, i)
    )}

        ${Pe(this, le, rr).call(this)}
      </div>
    `;
  }
};
le = /* @__PURE__ */ new WeakSet();
ar = function() {
  const e = this._search.trim().toLowerCase();
  return e ? this.properties.filter(
    (t) => t.name.toLowerCase().includes(e) || t.alias.toLowerCase().includes(e)
  ) : this.properties;
};
sr = function(e) {
  this.dispatchEvent(new CustomEvent("di-palette-add", { bubbles: !0, composed: !0, detail: { payload: e } }));
};
or = function(e, t) {
  var i;
  (i = e.dataTransfer) == null || i.setData("application/x-di-palette-item", JSON.stringify(t)), e.dataTransfer && (e.dataTransfer.effectAllowed = "copy");
};
nr = function(e, t) {
  return r`
      <div class="group">
        <h5>${e}</h5>
        ${A(
    t,
    (i) => i.alias,
    (i) => Pe(this, le, Et).call(this, i.name, vo[i.classification] ?? vo.other, i.classification, { kind: "property", property: i })
  )}
      </div>
    `;
};
rr = function() {
  return r`
      <div class="group">
        <h5>Static</h5>
        ${Pe(this, le, Et).call(this, "Text", "icon-font", "text", { kind: "static", layerType: "text" })}
        ${Pe(this, le, Et).call(this, "Image", "icon-picture", "media", { kind: "static", layerType: "image" })}
        ${Pe(this, le, Et).call(this, "Badge row", "icon-tags", "list", { kind: "static", layerType: "badges" })}
        ${Pe(this, le, Et).call(this, "Shape", "icon-layers", "other", { kind: "static", layerType: "rect" })}
      </div>
    `;
};
Et = function(e, t, i, a) {
  return r`
      <div
        class="chip ${i}"
        draggable="true"
        @dragstart=${(s) => Pe(this, le, or).call(this, s, a)}>
        <uui-icon name=${t}></uui-icon>
        <span class="label" title=${e}>${e}</span>
        <uui-button
          compact
          look="secondary"
          label="Add ${e} to the canvas"
          @click=${() => Pe(this, le, sr).call(this, a)}>
          <uui-icon name="icon-add"></uui-icon>
        </uui-button>
      </div>
    `;
};
bi.styles = D`
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
Ks([
  m({ type: Array })
], bi.prototype, "properties", 2);
Ks([
  h()
], bi.prototype, "_search", 2);
bi = Ks([
  E("di-property-palette")
], bi);
function Vc(e) {
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
var Hc = Object.defineProperty, jc = Object.getOwnPropertyDescriptor, lr = (e) => {
  throw TypeError(e);
}, Oa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? jc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Hc(t, i, s), s;
}, cr = (e, t, i) => t.has(e) || lr("Cannot " + i), Fe = (e, t, i) => (cr(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Gc = (e, t, i) => t.has(e) ? lr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), hi = (e, t, i) => (cr(e, t, "access private method"), i), X, _i, pi, Ia, ur, dr;
let Zt = class extends z {
  constructor() {
    super(...arguments), Gc(this, X), this.value = "#FFFFFF", this.label = "Colour", this._open = !1;
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
          <span class="chip" style="background:${Fe(this, X, _i)};opacity:${Fe(this, X, pi)}"></span>
        </button>

        <uui-input
          label=${this.label}
          .value=${this.value}
          spellcheck="false"
          @change=${(e) => hi(this, X, Ia).call(this, e.target.value)}>
        </uui-input>

        ${this._open ? r`
              <div class="popover">
                <input
                  type="color"
                  aria-label="${this.label} colour"
                  .value=${Fe(this, X, _i)}
                  @input=${(e) => hi(this, X, ur).call(this, e.target.value)} />
                <label class="alpha">
                  <span>Alpha</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${String(Fe(this, X, pi))}
                    @input=${(e) => hi(this, X, dr).call(this, Number(e.target.value))} />
                  <span class="alpha-value">${Math.round(Fe(this, X, pi) * 100)}%</span>
                </label>
              </div>
            ` : ""}
      </div>
    `;
  }
};
X = /* @__PURE__ */ new WeakSet();
_i = function() {
  return `#${(this.value || "").replace("#", "").slice(0, 6).padEnd(6, "0")}`;
};
pi = function() {
  const e = (this.value || "").replace("#", "");
  return e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
};
Ia = function(e) {
  this.value = e, this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: e } }));
};
ur = function(e) {
  const t = Fe(this, X, pi);
  hi(this, X, Ia).call(this, t >= 0.999 ? e.toUpperCase() : `${e.toUpperCase()}${hr(t)}`);
};
dr = function(e) {
  hi(this, X, Ia).call(this, e >= 0.999 ? Fe(this, X, _i).toUpperCase() : `${Fe(this, X, _i).toUpperCase()}${hr(e)}`);
};
Zt.styles = D`
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
Oa([
  m({ type: String })
], Zt.prototype, "value", 2);
Oa([
  m({ type: String })
], Zt.prototype, "label", 2);
Oa([
  h()
], Zt.prototype, "_open", 2);
Zt = Oa([
  E("di-colour-input")
], Zt);
const hr = (e) => Math.round(Math.max(0, Math.min(1, e)) * 255).toString(16).padStart(2, "0").toUpperCase();
var Xc = Object.defineProperty, Yc = Object.getOwnPropertyDescriptor, pr = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Yc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Xc(t, i, s), s;
};
const bo = {
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
let ba = class extends z {
  constructor() {
    super(...arguments), this.value = "topLeft";
  }
  render() {
    return r`
      <div class="grid" role="radiogroup" aria-label="Anchor point">
        ${A(
      tn,
      (e) => e,
      (e) => r`
            <button
              type="button"
              role="radio"
              class=${e === this.value ? "cell active" : "cell"}
              aria-checked=${e === this.value}
              aria-label=${bo[e]}
              title=${bo[e]}
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
ba.styles = D`
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
pr([
  m({ type: String })
], ba.prototype, "value", 2);
ba = pr([
  E("di-anchor-picker")
], ba);
var qc = Object.defineProperty, Jc = Object.getOwnPropertyDescriptor, mr = (e) => {
  throw TypeError(e);
}, it = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Jc(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && qc(t, i, s), s;
}, Zc = (e, t, i) => t.has(e) || mr("Cannot " + i), Qc = (e, t, i) => t.has(e) ? mr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), eu = (e, t, i) => (Zc(e, t, "access private method"), i), bs, fr;
let Se = class extends z {
  constructor() {
    super(...arguments), Qc(this, bs), this.label = "", this.suffix = "px", this.step = 1, this.placeholder = "Auto";
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
            @change=${eu(this, bs, fr)} />
          ${this.suffix ? r`<span class="suffix">${this.suffix}</span>` : p}
        </span>
      </label>
    `;
  }
};
bs = /* @__PURE__ */ new WeakSet();
fr = function(e) {
  const t = e.target.value, i = t === "" ? null : Number(t);
  this.dispatchEvent(new CustomEvent("change", { bubbles: !0, composed: !0, detail: { value: i } }));
};
Se.styles = D`
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
it([
  m({ type: Number })
], Se.prototype, "value", 2);
it([
  m({ type: String })
], Se.prototype, "label", 2);
it([
  m({ type: String })
], Se.prototype, "suffix", 2);
it([
  m({ type: Number })
], Se.prototype, "step", 2);
it([
  m({ type: Number })
], Se.prototype, "min", 2);
it([
  m({ type: Number })
], Se.prototype, "max", 2);
it([
  m({ type: String })
], Se.prototype, "placeholder", 2);
Se = it([
  E("di-number-field")
], Se);
var tu = Object.defineProperty, iu = Object.getOwnPropertyDescriptor, gr = (e) => {
  throw TypeError(e);
}, Ri = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? iu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && tu(t, i, s), s;
}, au = (e, t, i) => t.has(e) || gr("Cannot " + i), su = (e, t, i) => t.has(e) ? gr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (au(e, t, "access private method"), i), u, y, Le, yr, vr, br, _r, wr, $r, xr, kr, _s, Sr, sa, Tr, Cr, ii, Bs, Dr;
let bt = class extends z {
  constructor() {
    super(...arguments), su(this, u), this.properties = [], this.fonts = [];
  }
  render() {
    return this.template ? r`<div class="inspector">${this.layer ? d(this, u, vr).call(this, this.layer) : d(this, u, yr).call(this)}</div>` : p;
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
Le = function(e) {
  this.dispatchEvent(new CustomEvent("di-canvas-change", { bubbles: !0, composed: !0, detail: { patch: e } }));
};
yr = function() {
  const e = this.template.canvas;
  return r`
      <uui-box headline="Canvas">
        <div class="pair">
          <di-number-field
            label="Width"
            .value=${e.width}
            @change=${(t) => d(this, u, Le).call(this, { width: t.detail.value ?? 1200 })}>
          </di-number-field>
          <di-number-field
            label="Height"
            .value=${e.height}
            @change=${(t) => d(this, u, Le).call(this, { height: t.detail.value ?? 630 })}>
          </di-number-field>
        </div>

        <label class="field">
          <span>Background</span>
          <di-colour-input
            label="Canvas background"
            .value=${e.background}
            @change=${(t) => d(this, u, Le).call(this, { background: t.detail.value })}>
          </di-colour-input>
        </label>

        <label class="field">
          <span>Base image</span>
          <div class="row">
            <uui-select
              .value=${e.baseImage.kind}
              .options=${Er(e.baseImage.kind)}
              @change=${(t) => d(this, u, Le).call(this, {
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
                @change=${(t) => d(this, u, Le).call(this, {
    baseImage: { ...e.baseImage, path: t.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${e.baseImage.kind === "property" ? r`<label class="field">
              <span>From property</span>
              ${d(this, u, ii).call(this, e.baseImage.propertyAlias ?? "", (t) => d(this, u, Le).call(this, { baseImage: { ...e.baseImage, propertyAlias: t } }), "media")}
            </label>` : p}

        <label class="field">
          <span>Fit</span>
          <uui-select
            .value=${e.baseImageFit}
            .options=${ne(["cover", "contain", "stretch"], e.baseImageFit)}
            @change=${(t) => d(this, u, Le).call(this, { baseImageFit: t.target.value })}>
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
vr = function(e) {
  return r`
      <div class="head">
        <uui-input
          label="Layer name"
          .value=${e.name}
          @change=${(t) => d(this, u, y).call(this, { name: t.target.value })}>
        </uui-input>
        <uui-tag look="secondary">${e.type}</uui-tag>
      </div>

      ${e.type === "text" ? d(this, u, br).call(this, e) : p}
      ${e.type === "text" ? d(this, u, _r).call(this, e) : p}
      ${e.type === "image" ? d(this, u, wr).call(this, e) : p}
      ${e.type === "badges" ? d(this, u, $r).call(this, e) : p}
      ${e.type === "rect" ? d(this, u, xr).call(this, e) : p}
      ${d(this, u, kr).call(this, e)} ${d(this, u, Cr).call(this, e)}
    `;
};
br = function(e) {
  const t = e.binding;
  return r`
      <uui-box headline="Content">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${ne(
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

        ${t.kind === "property" || t.kind === "date" || t.kind === "readingTime" ? r`<label class="field">
              <span>Property</span>
              ${d(this, u, ii).call(this, t.propertyAlias ?? "", (i) => d(this, u, y).call(this, { binding: { ...t, propertyAlias: i } }))}
            </label>` : p}

        ${t.kind === "date" ? r`<label class="field">
              <span>Date format</span>
              <uui-input
                .value=${t.format ?? ""}
                placeholder="d MMMM yyyy"
                @change=${(i) => d(this, u, y).call(this, {
    binding: { ...t, format: i.target.value }
  })}>
              </uui-input>
            </label>` : p}

        ${t.kind === "static" || t.kind === "expression" ? r`<label class="field">
              <span>${t.kind === "static" ? "Text" : "Expression"}</span>
              <uui-textarea
                rows="2"
                .value=${t.text ?? ""}
                @change=${(i) => d(this, u, y).call(this, {
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
_r = function(e) {
  const t = e.style, i = (a) => d(this, u, y).call(this, { style: { ...t, ...a } });
  return r`
      <uui-box headline="Typography">
        <label class="field">
          <span>Font</span>
          <uui-select
            .value=${t.fontKey}
            .options=${d(this, u, Bs).call(this, t.fontKey)}
            @change=${(a) => i({ fontKey: a.target.value })}>
          </uui-select>
        </label>

        ${d(this, u, Dr).call(this, t.fontKey, t.styleName ?? "", (a, s, o) => i({ styleName: a || null, fontSize: s ?? t.fontSize, fontStyle: o ?? t.fontStyle }))}

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
              .options=${ne(["Regular", "Bold", "Italic", "BoldItalic"], t.fontStyle)}
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
            .options=${ne(["left", "centre", "right"], t.textAlign)}
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
              .options=${ne(["shrink", "ellipsis", "clip"], t.overflow, {
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
            .options=${ne(["none", "uppercase", "lowercase"], t.textTransform)}
            @change=${(a) => i({ textTransform: a.target.value })}>
          </uui-select>
        </label>
      </uui-box>
    `;
};
wr = function(e) {
  var i;
  const t = e.source;
  return r`
      <uui-box headline="Image">
        <label class="field">
          <span>Source</span>
          <uui-select
            .value=${t.kind}
            .options=${Er(t.kind)}
            @change=${(a) => d(this, u, y).call(this, {
    source: { ...t, kind: a.target.value }
  })}>
          </uui-select>
        </label>

        ${t.kind === "property" ? r`<label class="field">
              <span>Property</span>
              ${d(this, u, ii).call(this, t.propertyAlias ?? "", (a) => d(this, u, y).call(this, { source: { ...t, propertyAlias: a } }), "media")}
            </label>` : p}

        ${t.kind === "path" ? r`<label class="field">
              <span>Path</span>
              <uui-input
                .value=${t.path ?? ""}
                placeholder="/assets/logo.png"
                @change=${(a) => d(this, u, y).call(this, {
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
            .options=${ne(["cover", "contain", "stretch"], e.fit)}
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
            ${e.border ? r`<di-colour-input
                  label="Border colour"
                  .value=${e.border.colour}
                  @change=${(a) => d(this, u, y).call(this, { border: { ...e.border, colour: a.detail.value } })}>
                </di-colour-input>` : p}
          </div>
        </label>
      </uui-box>
    `;
};
$r = function(e) {
  const t = (s) => d(this, u, y).call(this, { badge: { ...e.badge, ...s } }), i = (s) => d(this, u, y).call(this, { label: { ...e.label, ...s } }), a = (s) => d(this, u, y).call(this, { icon: { ...e.icon, ...s } });
  return r`
      <uui-box headline="Badges">
        <label class="field">
          <span>Items from</span>
          ${d(this, u, ii).call(this, e.itemsPropertyAlias, (s) => d(this, u, y).call(this, { itemsPropertyAlias: s }))}
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
            .options=${ne(["horizontal", "vertical"], e.direction)}
            @change=${(s) => d(this, u, y).call(this, { direction: s.target.value })}>
          </uui-select>
        </label>

        ${e.direction === "horizontal" ? r`
              <label class="field inline">
                <span>Wrap onto new rows</span>
                <uui-toggle
                  ?checked=${e.wrap}
                  @change=${(s) => d(this, u, y).call(this, { wrap: s.target.checked })}>
                </uui-toggle>
              </label>

              ${e.wrap ? r`
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
            .options=${ne(["below", "right", "none"], e.label.position, {
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
                  .options=${d(this, u, Bs).call(this, e.label.fontKey)}
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
                  .options=${ne(["none", "uppercase", "lowercase"], e.label.textTransform)}
                  @change=${(s) => i({ textTransform: s.target.value })}>
                </uui-select>
              </label>
            `}
      </uui-box>
    `;
};
xr = function(e) {
  return r`
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

        ${e.gradient ? r`
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
kr = function(e) {
  const t = xe(e.position, "x"), i = xe(e.position, "y");
  return r`
      <uui-box headline="Layout">
        ${d(this, u, _s).call(this, e, "x")} ${d(this, u, _s).call(this, e, "y")}

        <label class="field">
          <span>Anchor</span>
          <di-anchor-picker
            .value=${e.position.anchor}
            @change=${(a) => d(this, u, Tr).call(this, e, a.detail.value)}>
          </di-anchor-picker>
          <small class="hint">
            Where X and Y sit on the layer's box.
            ${t || i ? r`The ${t && i ? "horizontal and vertical" : t ? "horizontal" : "vertical"}
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
_s = function(e, t) {
  const i = xe(e.position, t), a = pa(e.position, t), s = this.template.layers.filter((n) => n.key !== e.key), o = t === "x" ? ["rightOf", "leftOf"] : ["below", "above"];
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
            @change=${(n) => d(this, u, Sr).call(this, e, t, n.target.value)}>
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
                    @change=${(n) => d(this, u, sa).call(this, e, t, { layerKey: n.target.value })}>
                  </uui-select>
                  <uui-select
                    .value=${a.edge}
                    .options=${ne(o, a.edge, {
    below: "Below it",
    above: "Above it",
    rightOf: "Right of it",
    leftOf: "Left of it"
  })}
                    @change=${(n) => d(this, u, sa).call(this, e, t, { edge: n.target.value })}>
                  </uui-select>
                </div>
              </label>

              <di-number-field
                label="Gap"
                .value=${a.gap}
                @change=${(n) => d(this, u, sa).call(this, e, t, { gap: n.detail.value ?? 0 })}>
              </di-number-field>
            ` : r`
              <di-number-field
                label=${t === "x" ? "X" : "Y"}
                .value=${t === "x" ? e.position.x : e.position.y}
                @change=${(n) => d(this, u, y).call(this, {
    position: { ...e.position, [t]: n.detail.value ?? 0 }
  })}>
              </di-number-field>
            `}
      </div>
    `;
};
Sr = function(e, t, i) {
  if (i === "absolute") {
    this.dispatchEvent(
      new CustomEvent("di-layer-detach", { bubbles: !0, composed: !0, detail: { key: e.key, axis: t } })
    );
    return;
  }
  if (xe(e.position, t)) return;
  const a = this.template.layers.findIndex((o) => o.key === e.key), s = this.template.layers[a - 1] ?? this.template.layers.find((o) => o.key !== e.key);
  s && d(this, u, y).call(this, {
    position: {
      ...e.position,
      [t === "x" ? "relativeX" : "relativeY"]: {
        layerKey: s.key,
        edge: t === "x" ? "rightOf" : "below",
        gap: Ul
      }
    }
  });
};
sa = function(e, t, i) {
  const a = pa(e.position, t);
  a && d(this, u, y).call(this, {
    position: { ...e.position, [t === "x" ? "relativeX" : "relativeY"]: { ...a, ...i } }
  });
};
Tr = function(e, t) {
  const i = e.size.width ?? 0, a = e.size.height ?? 0, s = i > 0 && a > 0 ? Wl(e.position, i, a, t) : { ...e.position, anchor: t };
  d(this, u, y).call(this, { position: s });
};
Cr = function(e) {
  return r`
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
            .options=${ne(["always", "whenNotEmpty", "whenPropertyTruthy"], e.visibility.rule, {
    always: "Always",
    whenNotEmpty: "When it has a value",
    whenPropertyTruthy: "When another property is set"
  })}
            @change=${(t) => d(this, u, y).call(this, {
    visibility: { ...e.visibility, rule: t.target.value }
  })}>
          </uui-select>
        </label>

        ${e.visibility.rule === "whenPropertyTruthy" ? r`<label class="field">
              <span>Controlled by</span>
              ${d(this, u, ii).call(this, e.visibility.propertyAlias ?? "", (t) => d(this, u, y).call(this, { visibility: { ...e.visibility, propertyAlias: t } }))}
            </label>` : p}
      </uui-box>
    `;
};
ii = function(e, t, i) {
  const a = i ? this.properties.filter((s) => s.classification === i) : this.properties;
  return r`
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
Bs = function(e) {
  return [
    { name: "- none -", value: "" },
    ...this.fonts.map((t) => ({
      name: t.familyName,
      value: t.key,
      selected: t.key === e
    }))
  ];
};
Dr = function(e, t, i) {
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
    const o = s.target.value, n = a.styles.find((c) => c.name === o);
    i(o, n == null ? void 0 : n.size, n == null ? void 0 : n.fontStyle);
  }}>
        </uui-select>
      </label>
    `;
};
bt.styles = D`
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
Ri([
  m({ type: Object })
], bt.prototype, "template", 2);
Ri([
  m({ type: Object })
], bt.prototype, "layer", 2);
Ri([
  m({ type: Array })
], bt.prototype, "properties", 2);
Ri([
  m({ type: Array })
], bt.prototype, "fonts", 2);
bt = Ri([
  E("di-layer-inspector")
], bt);
function ne(e, t, i = {}) {
  return e.map((a) => ({
    name: i[a] ?? a.charAt(0).toUpperCase() + a.slice(1),
    value: a,
    selected: a === t
  }));
}
function Er(e) {
  return ne(["none", "media", "path", "property"], e, {
    none: "Nothing",
    media: "A media item",
    path: "A file in wwwroot",
    property: "A property on the page"
  });
}
var ou = Object.defineProperty, nu = Object.getOwnPropertyDescriptor, Pr = (e) => {
  throw TypeError(e);
}, Ui = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? nu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && ou(t, i, s), s;
}, ru = (e, t, i) => t.has(e) || Pr("Cannot " + i), lu = (e, t, i) => t.has(e) ? Pr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ve = (e, t, i) => (ru(e, t, "access private method"), i), re, ct, zr, Mr, Or, Ir;
const cu = {
  text: "icon-font",
  image: "icon-picture",
  badges: "icon-tags",
  rect: "icon-layers"
};
let _t = class extends z {
  constructor() {
    super(...arguments), lu(this, re), this.layers = [];
  }
  render() {
    const e = [...this.layers].reverse();
    return r`
      <div class="panel" @drop=${ve(this, re, Or)}>
        <h5>Layers</h5>

        ${e.length === 0 ? r`<p class="empty">No layers yet. Drag a property from the left onto the canvas.</p>` : A(
      e,
      (t) => t.key,
      (t, i) => ve(this, re, Ir).call(this, t, i)
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
re = /* @__PURE__ */ new WeakSet();
ct = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
zr = function(e, t) {
  this._dragKey = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
};
Mr = function(e, t) {
  this._dragKey && (e.preventDefault(), this._dropIndex = t);
};
Or = function(e) {
  if (!this._dragKey || this._dropIndex === void 0) return;
  e.preventDefault();
  const t = this.layers.length - 1 - this._dropIndex;
  ve(this, re, ct).call(this, "di-layer-move", { key: this._dragKey, toIndex: Math.max(0, t) }), this._dragKey = void 0, this._dropIndex = void 0;
};
Ir = function(e, t) {
  const i = e.key === this.selectedLayerKey;
  return r`
      <div
        class="row ${i ? "selected" : ""} ${this._dropIndex === t ? "drop" : ""}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-pressed=${i}
        @dragstart=${(a) => ve(this, re, zr).call(this, a, e.key)}
        @dragover=${(a) => ve(this, re, Mr).call(this, a, t)}
        @click=${() => ve(this, re, ct).call(this, "di-layer-select", { key: e.key })}>
        <uui-icon name=${cu[e.type]}></uui-icon>
        <span class="name" title=${e.name}>${e.name || e.type}</span>

        <uui-button
          compact
          look="secondary"
          label="${e.isVisible ? "Hide" : "Show"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ve(this, re, ct).call(this, "di-layer-visibility", { key: e.key, isVisible: !e.isVisible });
  }}>
          <uui-icon name=${e.isVisible ? "icon-eye" : "icon-eye-off"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="${e.isLocked ? "Unlock" : "Lock"} ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ve(this, re, ct).call(this, "di-layer-lock", { key: e.key, isLocked: !e.isLocked });
  }}>
          <uui-icon name=${e.isLocked ? "icon-lock" : "icon-unlocked"}></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          label="Duplicate ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ve(this, re, ct).call(this, "di-layer-duplicate", { key: e.key });
  }}>
          <uui-icon name="icon-documents"></uui-icon>
        </uui-button>

        <uui-button
          compact
          look="secondary"
          color="danger"
          label="Delete ${e.name}"
          @click=${(a) => {
    a.stopPropagation(), ve(this, re, ct).call(this, "di-layer-delete", { key: e.key });
  }}>
          <uui-icon name="icon-trash"></uui-icon>
        </uui-button>
      </div>
    `;
};
_t.styles = D`
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
Ui([
  m({ type: Array })
], _t.prototype, "layers", 2);
Ui([
  m({ type: String })
], _t.prototype, "selectedLayerKey", 2);
Ui([
  h()
], _t.prototype, "_dragKey", 2);
Ui([
  h()
], _t.prototype, "_dropIndex", 2);
_t = Ui([
  E("di-layers-panel")
], _t);
var uu = Object.defineProperty, du = Object.getOwnPropertyDescriptor, Ar = (e) => {
  throw TypeError(e);
}, Ae = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? du(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && uu(t, i, s), s;
}, hu = (e, t, i) => t.has(e) || Ar("Cannot " + i), pu = (e, t, i) => t.has(e) ? Ar("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), he = (e, t, i) => (hu(e, t, "access private method"), i), te, Re, di;
let ye = class extends z {
  constructor() {
    super(...arguments), pu(this, te), this.zoom = 1, this.snapEnabled = !0, this.showRulers = !0, this.showSafeArea = !1, this.showMeasured = !1, this.canUndo = !1, this.canRedo = !1, this.previewing = !1;
  }
  render() {
    return r`
      <div class="toolbar">
        <div class="zoom">
          <uui-button compact look="secondary" label="Zoom out" @click=${() => he(this, te, Re).call(this, "di-zoom-change", { zoom: this.zoom / 1.25 })}>
            <uui-icon name="icon-remove"></uui-icon>
          </uui-button>
          <span class="value">${Math.round(this.zoom * 100)}%</span>
          <uui-button compact look="secondary" label="Zoom in" @click=${() => he(this, te, Re).call(this, "di-zoom-change", { zoom: this.zoom * 1.25 })}>
            <uui-icon name="icon-add"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Fit to the window" @click=${() => he(this, te, Re).call(this, "di-zoom-fit")}>
            Fit
          </uui-button>
        </div>

        <div class="toggles">
          ${he(this, te, di).call(this, "Snap", this.snapEnabled, "di-toggle-snap")}
          ${he(this, te, di).call(this, "Rulers", this.showRulers, "di-toggle-rulers")}
          ${he(this, te, di).call(this, "Safe area", this.showSafeArea, "di-toggle-safe-area")}
          ${he(this, te, di).call(this, "Layer bounds", this.showMeasured, "di-toggle-measured")}
        </div>

        <div class="actions">
          <uui-button compact look="secondary" label="Undo" ?disabled=${!this.canUndo} @click=${() => he(this, te, Re).call(this, "di-undo")}>
            <uui-icon name="icon-undo"></uui-icon>
          </uui-button>
          <uui-button compact look="secondary" label="Redo" ?disabled=${!this.canRedo} @click=${() => he(this, te, Re).call(this, "di-redo")}>
            <uui-icon name="icon-redo"></uui-icon>
          </uui-button>
          <uui-button
            look="secondary"
            label="Render this template on the server"
            ?disabled=${this.previewing}
            @click=${() => he(this, te, Re).call(this, "di-request-preview")}>
            <uui-icon name="icon-sync"></uui-icon> Server preview
          </uui-button>
        </div>
      </div>
    `;
  }
};
te = /* @__PURE__ */ new WeakSet();
Re = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
di = function(e, t, i) {
  return r`
      <uui-button
        compact
        look=${t ? "primary" : "secondary"}
        label="${e}: ${t ? "on" : "off"}"
        @click=${() => he(this, te, Re).call(this, i)}>
        ${e}
      </uui-button>
    `;
};
ye.styles = D`
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
Ae([
  m({ type: Number })
], ye.prototype, "zoom", 2);
Ae([
  m({ type: Boolean })
], ye.prototype, "snapEnabled", 2);
Ae([
  m({ type: Boolean })
], ye.prototype, "showRulers", 2);
Ae([
  m({ type: Boolean })
], ye.prototype, "showSafeArea", 2);
Ae([
  m({ type: Boolean })
], ye.prototype, "showMeasured", 2);
Ae([
  m({ type: Boolean })
], ye.prototype, "canUndo", 2);
Ae([
  m({ type: Boolean })
], ye.prototype, "canRedo", 2);
Ae([
  m({ type: Boolean })
], ye.prototype, "previewing", 2);
ye = Ae([
  E("di-canvas-toolbar")
], ye);
var mu = Object.defineProperty, fu = Object.getOwnPropertyDescriptor, Lr = (e) => {
  throw TypeError(e);
}, Ni = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? fu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && mu(t, i, s), s;
}, Vs = (e, t, i) => t.has(e) || Lr("Cannot " + i), oe = (e, t, i) => (Vs(e, t, "read from private field"), t.get(e)), ri = (e, t, i) => t.has(e) ? Lr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), wi = (e, t, i, a) => (Vs(e, t, "write to private field"), t.set(e, i), i), Pt = (e, t, i) => (Vs(e, t, "access private method"), i), je, $i, It, gt, Ke, Hs, oa, Wr;
const gu = 400;
let wt = class extends z {
  constructor() {
    super(), ri(this, Ke), ri(this, je), ri(this, $i), ri(this, It), ri(this, gt), this._loading = !1, this._collapsed = !1, this.consumeContext(xt, (e) => {
      wi(this, je, e), e && (this.observe(e.template, (t) => {
        t && Pt(this, Ke, oa).call(this, t);
      }), this.observe(e.sampleContentKey, () => {
        var i;
        const t = (i = oe(this, je)) == null ? void 0 : i.getData();
        t && Pt(this, Ke, oa).call(this, t);
      }));
    });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.clearTimeout(oe(this, $i)), (e = oe(this, It)) == null || e.abort(), Pt(this, Ke, Hs).call(this);
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
        const t = (e = oe(this, je)) == null ? void 0 : e.getData();
        t && Pt(this, Ke, oa).call(this, t);
      }
    }}>
          <uui-icon name=${this._collapsed ? "icon-navigation-up" : "icon-navigation-down"}></uui-icon>
          Server preview
        </button>

        ${this._collapsed ? p : r`
              <div class="body">
                ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
                ${this._error ? r`<span class="error" role="status">${this._error}</span>` : this._url ? r`<img src=${this._url} alt="Server-rendered preview of this template" />` : r`<span class="pending">Rendering…</span>`}
              </div>
            `}
      </div>
    `;
  }
};
je = /* @__PURE__ */ new WeakMap();
$i = /* @__PURE__ */ new WeakMap();
It = /* @__PURE__ */ new WeakMap();
gt = /* @__PURE__ */ new WeakMap();
Ke = /* @__PURE__ */ new WeakSet();
Hs = function() {
  oe(this, gt) && (URL.revokeObjectURL(oe(this, gt)), wi(this, gt, void 0));
};
oa = function(e) {
  this._collapsed || (window.clearTimeout(oe(this, $i)), wi(this, $i, window.setTimeout(() => void Pt(this, Ke, Wr).call(this, e), gu)));
};
Wr = async function(e) {
  var t;
  if (oe(this, je)) {
    (t = oe(this, It)) == null || t.abort(), wi(this, It, new AbortController()), this._loading = !0, this._error = void 0;
    try {
      const i = (oe(this, je).getData(), void 0), a = await Cs(
        e,
        { signal: oe(this, It).signal, useSampleData: !0, contentKey: i },
        oe(this, je).getToken
      );
      Pt(this, Ke, Hs).call(this), wi(this, gt, URL.createObjectURL(a)), this._url = oe(this, gt);
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError") return;
      this._error = i instanceof Error ? i.message : "The preview could not be rendered.";
    } finally {
      this._loading = !1;
    }
  }
};
wt.styles = D`
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
Ni([
  h()
], wt.prototype, "_url", 2);
Ni([
  h()
], wt.prototype, "_loading", 2);
Ni([
  h()
], wt.prototype, "_error", 2);
Ni([
  h()
], wt.prototype, "_collapsed", 2);
wt = Ni([
  E("di-preview-strip")
], wt);
var yu = Object.defineProperty, vu = Object.getOwnPropertyDescriptor, Rr = (e) => {
  throw TypeError(e);
}, Q = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? vu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && yu(t, i, s), s;
}, js = (e, t, i) => t.has(e) || Rr("Cannot " + i), g = (e, t, i) => (js(e, t, "read from private field"), i ? i.call(e) : t.get(e)), kt = (e, t, i) => t.has(e) ? Rr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _a = (e, t, i, a) => (js(e, t, "write to private field"), t.set(e, i), i), Y = (e, t, i) => (js(e, t, "access private method"), i), $, xi, ki, At, M, ws, Gs, Ur, $s, Nr, Fr, Kr, xs, Br, Vr, Hr, Xs, jr, na;
const bu = 400;
let B = class extends z {
  constructor() {
    super(), kt(this, M), kt(this, $), kt(this, xi), kt(this, ki), kt(this, At), this._properties = [], this._fonts = [], this._serverBounds = [], this._snapEnabled = !0, this._showRulers = !0, this._showSafeArea = !1, this._showMeasured = !1, this._canUndo = !1, this._canRedo = !1, kt(this, na, (e) => {
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
      const s = g(this, M, ws);
      if (s) {
        if (a && e.key.toLowerCase() === "d") {
          e.preventDefault(), i.duplicateLayer(s.key);
          return;
        }
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault(), Y(this, M, $s).call(this, s.key);
            break;
          case "Escape":
            i.selectLayer(void 0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault();
            const n = e.shiftKey ? 10 : 1, c = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0, f = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0, b = xe(s.position, "x") ? 0 : c, L = xe(s.position, "y") ? 0 : f;
            if (b === 0 && L === 0) break;
            i.updateLayer(s.key, {
              position: { ...s.position, x: s.position.x + b, y: s.position.y + L }
            });
            break;
          }
          case "[":
          case "]": {
            const n = ((o = this._template) == null ? void 0 : o.layers.findIndex((c) => c.key === s.key)) ?? -1;
            if (n < 0) return;
            e.preventDefault(), i.moveLayer(s.key, e.key === "]" ? n + 1 : n - 1);
            break;
          }
        }
      }
    }), this.consumeContext(ka, (e) => {
      _a(this, xi, e);
    }), this.consumeContext(xt, (e) => {
      _a(this, $, e), e && (this.observe(e.template, (t) => {
        this._template = t, t && (Y(this, M, Nr).call(this, t), Y(this, M, Fr).call(this, t), Y(this, M, Kr).call(this));
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
    super.connectedCallback(), window.addEventListener("keydown", g(this, na));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), window.removeEventListener("keydown", g(this, na)), window.clearTimeout(g(this, ki)), (e = g(this, At)) == null || e.abort();
  }
  // ------------------------------------------------------------------ rendering
  render() {
    return this._template ? r`
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
        @di-layer-delete=${(e) => Y(this, M, $s).call(this, e.detail.key)}
        @di-layer-detach=${(e) => Y(this, M, Ur).call(this, e.detail.key, e.detail.axis)}
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
        @di-palette-add=${(e) => Y(this, M, xs).call(this, e.detail.payload)}
        @di-palette-drop=${(e) => Y(this, M, xs).call(this, e.detail.payload, e.detail.x, e.detail.y)}
        @di-pick-base-image=${Y(this, M, Vr)}
        @di-pick-layer-image=${(e) => Y(this, M, Hr).call(this, e.detail.key)}
        @di-use-image-size=${Y(this, M, jr)}
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
            .layer=${g(this, M, ws)}
            .properties=${this._properties}
            .fonts=${this._fonts}>
          </di-layer-inspector>

          <di-layers-panel .layers=${this._template.layers} .selectedLayerKey=${this._selectedKey}></di-layers-panel>
        </div>
      </div>
    ` : r`<div class="state"><uui-loader></uui-loader></div>`;
  }
};
$ = /* @__PURE__ */ new WeakMap();
xi = /* @__PURE__ */ new WeakMap();
ki = /* @__PURE__ */ new WeakMap();
At = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
ws = function() {
  var e;
  return (e = this._template) == null ? void 0 : e.layers.find((t) => t.key === this._selectedKey);
};
Gs = function() {
  return this.renderRoot.querySelector("di-designer-canvas");
};
Ur = function(e, t) {
  var s, o, n;
  const i = (s = this._template) == null ? void 0 : s.layers.find((c) => c.key === e);
  if (!i) return;
  const a = (o = g(this, M, Gs)) == null ? void 0 : o.resolvedPositionOf(e);
  (n = g(this, $)) == null || n.updateLayer(e, { position: Ja(i.position, t, a) });
};
$s = function(e) {
  var i, a, s;
  const t = /* @__PURE__ */ new Map();
  for (const o of ((i = this._template) == null ? void 0 : i.layers) ?? []) {
    const n = (a = g(this, M, Gs)) == null ? void 0 : a.resolvedPositionOf(o.key);
    n && t.set(o.key, n);
  }
  (s = g(this, $)) == null || s.removeLayer(e, t);
};
Nr = async function(e) {
  const t = e.layers.flatMap(
    (i) => i.type === "text" ? [i.style.fontKey] : i.type === "badges" ? [i.label.fontKey] : []
  );
  t.length > 0 && g(this, $) && await xn(t, g(this, $).getToken);
};
Fr = async function(e) {
  const t = e.canvas.baseImage;
  if (t.kind === "path" && t.path) {
    this._baseImageUrl = t.path;
    return;
  }
  if (t.kind !== "media" || !t.mediaKey || !g(this, $)) {
    this._baseImageUrl = void 0;
    return;
  }
  const i = await Es(t.mediaKey, g(this, $).getToken).catch(() => {
  });
  this._baseImageUrl = i == null ? void 0 : i.url;
};
Kr = function() {
  window.clearTimeout(g(this, ki)), _a(this, ki, window.setTimeout(async () => {
    var t;
    const e = this._template;
    if (!(!e || !g(this, $))) {
      (t = g(this, At)) == null || t.abort(), _a(this, At, new AbortController());
      try {
        const i = await Ds(
          e,
          { signal: g(this, At).signal, useSampleData: !0 },
          g(this, $).getToken
        );
        g(this, $).setServerBounds(i.layers), g(this, $).setIssues(i.issues);
      } catch (i) {
        (i == null ? void 0 : i.name) !== "AbortError" && console.warn("[DynamicImages] Layout measurement failed", i);
      }
    }
  }, bu));
};
xs = function(e, t, i) {
  const a = this._template;
  if (!a || !g(this, $)) return;
  const s = { template: a, x: t, y: i, defaultFontKey: Y(this, M, Br).call(this) }, o = e.kind === "property" ? Il(e.property, s) : e.layerType === "image" ? Qo(s, "Image") : e.layerType === "badges" ? en(s, "Badges", "") : e.layerType === "rect" ? Ml(s) : Zo(s, "Text", { kind: "static", text: "Text" });
  g(this, $).addLayer(o);
};
Br = function() {
  var t, i;
  const e = (t = this._template) == null ? void 0 : t.layers.flatMap(
    (a) => a.type === "text" ? [a.style.fontKey] : a.type === "badges" ? [a.label.fontKey] : []
  ).filter(Boolean);
  return (e == null ? void 0 : e[0]) ?? ((i = this._fonts[0]) == null ? void 0 : i.key);
};
Vr = async function() {
  var t;
  const e = await Y(this, M, Xs).call(this);
  e && ((t = g(this, $)) == null || t.updateCanvas({ baseImage: { kind: "media", mediaKey: e } }));
};
Hr = async function(e) {
  var i;
  const t = await Y(this, M, Xs).call(this);
  t && ((i = g(this, $)) == null || i.updateLayer(e, { source: { kind: "media", mediaKey: t } }));
};
Xs = async function() {
  if (!g(this, xi)) return;
  const e = g(this, xi).open(this, Do, { data: { multiple: !1 } }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  return (t == null ? void 0 : t.selection[0]) ?? void 0;
};
jr = async function() {
  var i;
  const e = (i = this._template) == null ? void 0 : i.canvas.baseImage;
  if ((e == null ? void 0 : e.kind) !== "media" || !e.mediaKey || !g(this, $)) return;
  const t = await Es(e.mediaKey, g(this, $).getToken).catch(() => {
  });
  t && g(this, $).updateCanvas({ width: t.width, height: t.height });
};
na = /* @__PURE__ */ new WeakMap();
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
  E("di-design-view")
], B);
const _u = B, wu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiDesignViewElement() {
    return B;
  },
  default: _u
}, Symbol.toStringTag, { value: "Module" }));
var $u = Object.defineProperty, xu = Object.getOwnPropertyDescriptor, Gr = (e) => {
  throw TypeError(e);
}, at = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? xu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && $u(t, i, s), s;
}, Ys = (e, t, i) => t.has(e) || Gr("Cannot " + i), N = (e, t, i) => (Ys(e, t, "read from private field"), t.get(e)), St = (e, t, i) => t.has(e) ? Gr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Lt = (e, t, i, a) => (Ys(e, t, "write to private field"), t.set(e, i), i), V = (e, t, i) => (Ys(e, t, "access private method"), i), me, Si, Ti, Wt, yt, W, wa, Xr, qs, Js, Yr, qr, Ci, Jr, Zr, Qr;
const ku = [
  { label: "Short", value: "Ship it" },
  { label: "Typical", value: "Designing social share images that actually get clicked" },
  {
    label: "Very long",
    value: "Everything you ever wanted to know about generating Open Graph images from your content, and rather more besides"
  }
];
let de = class extends z {
  constructor() {
    super(), St(this, W), St(this, me), St(this, Si), St(this, Ti), St(this, Wt), St(this, yt), this._bounds = [], this._loading = !1, this._regenerating = !1, this.consumeContext(ka, (e) => {
      Lt(this, Si, e);
    }), this.consumeContext(et, (e) => {
      Lt(this, Ti, e);
    }), this.consumeContext(xt, (e) => {
      Lt(this, me, e), e && this.observe(e.template, (t) => {
        this._template = t;
      });
    });
  }
  connectedCallback() {
    super.connectedCallback();
    const e = V(this, W, Xr).call(this);
    e && (this._sampleNode = e), V(this, W, Ci).call(this);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = N(this, Wt)) == null || e.abort(), V(this, W, Js).call(this);
  }
  render() {
    return this._template ? r`
      <div class="grid">
        <uui-box headline="Preview">
          <div slot="header-actions" class="actions">
            <uui-button look="secondary" label="Choose content to preview against" @click=${V(this, W, Yr)}>
              ${this._sampleNode ? this._sampleNode.name : "Sample data"}
            </uui-button>
            <uui-button look="secondary" label="Re-render" ?disabled=${this._loading} @click=${() => V(this, W, Ci).call(this)}>
              Re-render
            </uui-button>
            <uui-button look="secondary" label="Download this image" ?disabled=${!this._url} @click=${V(this, W, Zr)}>
              Download
            </uui-button>
          </div>

          ${this._loading ? r`<uui-loader-bar></uui-loader-bar>` : p}
          ${this._error ? r`<div class="error" role="alert"><uui-icon name="icon-alert"></uui-icon> ${this._error}</div>` : this._url ? r`<img class="render" src=${this._url} alt="Rendered preview of this template" />` : p}

          <div class="presets">
            <span>Try a title length:</span>
            ${A(
      ku,
      (e) => e.label,
      (e) => r`
                <uui-button
                  compact
                  look="secondary"
                  label="Preview with a ${e.label.toLowerCase()} title"
                  @click=${() => V(this, W, qr).call(this, e.value)}>
                  ${e.label}
                </uui-button>
              `
    )}
          </div>
        </uui-box>

        <uui-box headline="Resolved values">
          ${this._bounds.length === 0 ? r`<p class="empty">Nothing was drawn. Check the layers are visible and have values.</p>` : r`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Layer</uui-table-head-cell>
                  <uui-table-head-cell>Value</uui-table-head-cell>
                  <uui-table-head-cell>Position</uui-table-head-cell>
                  <uui-table-head-cell>Size</uui-table-head-cell>
                </uui-table-head>
                ${A(
      this._bounds,
      (e) => e.key,
      (e) => r`
                    <uui-table-row>
                      <uui-table-cell>${V(this, W, Qr).call(this, e.key)}</uui-table-cell>
                      <uui-table-cell>
                        ${e.resolvedText ?? r`<em>—</em>`}
                        ${e.truncated ? r`<uui-tag color="warning" look="secondary">truncated</uui-tag>` : p}
                      </uui-table-cell>
                      <uui-table-cell>${Math.round(e.x)}, ${Math.round(e.y)}</uui-table-cell>
                      <uui-table-cell>${Math.round(e.width)} × ${Math.round(e.height)}</uui-table-cell>
                    </uui-table-row>
                  `
    )}
              </uui-table>`}
        </uui-box>

        ${this._sampleNode ? r`<uui-box headline="This node">
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
                @click=${V(this, W, Jr)}>
                Regenerate this node
              </uui-button>
            </uui-box>` : p}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
me = /* @__PURE__ */ new WeakMap();
Si = /* @__PURE__ */ new WeakMap();
Ti = /* @__PURE__ */ new WeakMap();
Wt = /* @__PURE__ */ new WeakMap();
yt = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakSet();
wa = function() {
  var e;
  return `di:sample-node:${((e = this._template) == null ? void 0 : e.key) ?? "new"}`;
};
Xr = function() {
  try {
    const e = localStorage.getItem(V(this, W, wa).call(this));
    return e ? JSON.parse(e) : void 0;
  } catch {
    return;
  }
};
qs = function(e) {
  try {
    e ? localStorage.setItem(V(this, W, wa).call(this), JSON.stringify(e)) : localStorage.removeItem(V(this, W, wa).call(this));
  } catch {
  }
};
Js = function() {
  N(this, yt) && (URL.revokeObjectURL(N(this, yt)), Lt(this, yt, void 0));
};
Yr = async function() {
  var i, a, s;
  if (!N(this, Si) || !this._template) return;
  const e = N(this, Si).open(this, hc, {
    data: { docTypeAliases: this._template.docTypeAliases, selectedKey: (i = this._sampleNode) == null ? void 0 : i.key }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && (this._sampleNode = t.item, V(this, W, qs).call(this, t.item), (s = N(this, me)) == null || s.setSampleContentKey((a = t.item) == null ? void 0 : a.key), await V(this, W, Ci).call(this));
};
qr = async function(e) {
  this._template && (this._sampleNode = void 0, V(this, W, qs).call(this, void 0), await V(this, W, Ci).call(this, e));
};
Ci = async function(e) {
  var a, s;
  const t = this._template;
  if (!t || !N(this, me)) return;
  (a = N(this, Wt)) == null || a.abort(), Lt(this, Wt, new AbortController()), this._loading = !0, this._error = void 0;
  const i = {
    signal: N(this, Wt).signal,
    contentKey: (s = this._sampleNode) == null ? void 0 : s.key,
    useSampleData: !this._sampleNode,
    // Full size here - this view is where fidelity matters.
    scale: 1
  };
  try {
    const [o, n] = await Promise.all([
      Cs(t, i, N(this, me).getToken),
      Ds(t, i, N(this, me).getToken)
    ]);
    V(this, W, Js).call(this), Lt(this, yt, URL.createObjectURL(o)), this._url = N(this, yt), this._bounds = n.layers, N(this, me).setServerBounds(n.layers), N(this, me).setIssues(n.issues);
  } catch (o) {
    if ((o == null ? void 0 : o.name) === "AbortError") return;
    this._error = o instanceof Error ? o.message : "The preview could not be rendered.";
  } finally {
    this._loading = !1;
  }
};
Jr = async function() {
  var e, t;
  if (!(!this._sampleNode || !N(this, me))) {
    this._regenerating = !0;
    try {
      const i = await Sa(this._sampleNode.key, N(this, me).getToken);
      (e = N(this, Ti)) == null || e.peek(i.outcome === "generated" ? "positive" : "warning", {
        data: { message: `'${this._sampleNode.name}': ${i.outcome}` }
      });
    } catch (i) {
      (t = N(this, Ti)) == null || t.peek("danger", {
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
Zr = function() {
  if (!this._url || !this._template) return;
  const e = document.createElement("a");
  e.href = this._url, e.download = `${this._template.alias || "preview"}.${this._template.output.format}`, e.click();
};
Qr = function(e) {
  var i;
  const t = (i = this._template) == null ? void 0 : i.layers.find((a) => a.key === e);
  return (t == null ? void 0 : t.name) || (t == null ? void 0 : t.type) || e.slice(0, 8);
};
de.styles = D`
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
at([
  h()
], de.prototype, "_template", 2);
at([
  h()
], de.prototype, "_sampleNode", 2);
at([
  h()
], de.prototype, "_bounds", 2);
at([
  h()
], de.prototype, "_url", 2);
at([
  h()
], de.prototype, "_loading", 2);
at([
  h()
], de.prototype, "_error", 2);
at([
  h()
], de.prototype, "_regenerating", 2);
de = at([
  E("di-preview-view")
], de);
const Su = de, Tu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiPreviewViewElement() {
    return de;
  },
  default: Su
}, Symbol.toStringTag, { value: "Module" }));
var Cu = Object.defineProperty, Du = Object.getOwnPropertyDescriptor, el = (e) => {
  throw TypeError(e);
}, Aa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Du(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Cu(t, i, s), s;
}, Zs = (e, t, i) => t.has(e) || el("Cannot " + i), I = (e, t, i) => (Zs(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Va = (e, t, i) => t.has(e) ? el("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), _o = (e, t, i, a) => (Zs(e, t, "write to private field"), t.set(e, i), i), Ge = (e, t, i) => (Zs(e, t, "access private method"), i), K, $t, fe, tl, il, al, sl, ol, nl, rl, ll, cl;
let Je = class extends z {
  constructor() {
    super(), Va(this, fe), Va(this, K), Va(this, $t), this._properties = [], this._showAdvanced = !1, this.consumeContext(ka, (e) => {
      _o(this, $t, e);
    }), this.consumeContext(xt, (e) => {
      _o(this, K, e), e && (this.observe(e.template, (t) => {
        this._template = t;
      }), this.observe(e.properties, (t) => {
        this._properties = t ?? [];
      }));
    });
  }
  render() {
    return this._template ? r`
      <div class="grid">
        ${Ge(this, fe, nl).call(this)} ${Ge(this, fe, rl).call(this)} ${Ge(this, fe, ll).call(this)} ${Ge(this, fe, cl).call(this)}
      </div>
    ` : r`<uui-loader></uui-loader>`;
  }
};
K = /* @__PURE__ */ new WeakMap();
$t = /* @__PURE__ */ new WeakMap();
fe = /* @__PURE__ */ new WeakSet();
tl = function() {
  return this._properties.filter((e) => e.classification === "media");
};
il = async function() {
  var a, s;
  if (!I(this, $t) || !this._template) return;
  const e = I(this, $t).open(this, vl, {
    data: {
      multiple: !0,
      // Element types are never published on their own, so nothing would trigger the template.
      pickableFilter: (o) => !o.isElement
    }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  if (!t) return;
  const i = await Ge(this, fe, al).call(this, t.selection.filter((o) => !!o));
  (a = I(this, K)) == null || a.updateTemplateFields({ docTypeAliases: i }), await ((s = I(this, K)) == null ? void 0 : s.reloadProperties());
};
al = async function(e) {
  const { fetchDocumentTypes: t } = await Promise.resolve().then(() => zl), i = await t(I(this, K).getToken).catch(() => []), a = new Map(i.map((s) => [s.key, s.alias]));
  return e.map((s) => a.get(s)).filter((s) => !!s).filter((s, o, n) => n.indexOf(s) === o);
};
sl = function(e) {
  var i, a, s;
  const t = (((i = this._template) == null ? void 0 : i.docTypeAliases) ?? []).filter((o) => o !== e);
  (a = I(this, K)) == null || a.updateTemplateFields({ docTypeAliases: t }), (s = I(this, K)) == null || s.reloadProperties();
};
ol = async function() {
  var i;
  if (!I(this, $t)) return;
  const e = I(this, $t).open(this, Do, {
    // Not filtered to folders here: the media tree item carries its media type as a key, not
    // an alias, so there is nothing reliable to match on. The server checks the chosen item is
    // a folder and the validator warns when it is not.
    data: { multiple: !1 }
  }), t = await (e == null ? void 0 : e.onSubmit().catch(() => {
  }));
  t && ((i = I(this, K)) == null || i.updateOutput({ mediaFolderKey: t.selection[0] ?? null }));
};
nl = function() {
  const e = this._template;
  return r`
      <uui-box headline="Applies to">
        <umb-property-layout label="Document types" description="Publishing one of these generates the image.">
          <div slot="editor">
            ${e.docTypeAliases.length === 0 ? r`<p class="empty">No document types yet - nothing will trigger this template.</p>` : r`<div class="tags">
                  ${A(
    e.docTypeAliases,
    (t) => t,
    (t) => r`
                      <uui-tag look="secondary">
                        ${t}
                        <uui-button
                          compact
                          label="Remove ${t}"
                          @click=${() => Ge(this, fe, sl).call(this, t)}>
                          <uui-icon name="icon-trash"></uui-icon>
                        </uui-button>
                      </uui-tag>
                    `
  )}
                </div>`}
            <uui-button look="secondary" label="Choose document types" @click=${Ge(this, fe, il)}>
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
    ...I(this, fe, tl).map((t) => ({
      name: `${t.name} (${t.alias})`,
      value: t.alias,
      selected: t.alias === e.targetPropertyAlias
    }))
  ]}
            @change=${(t) => {
    var i;
    return (i = I(this, K)) == null ? void 0 : i.updateTemplateFields({
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
    return (i = I(this, K)) == null ? void 0 : i.updateTemplateFields({ isEnabled: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
rl = function() {
  const e = this._template;
  return r`
      <uui-box headline="Output">
        <umb-property-layout label="Media folder" description="Where generated images are saved.">
          <div slot="editor" class="row">
            <uui-input readonly .value=${e.output.mediaFolderKey ?? "Media root"}></uui-input>
            <uui-button look="secondary" label="Choose folder" @click=${Ge(this, fe, ol)}>Choose</uui-button>
            ${e.output.mediaFolderKey ? r`<uui-button
                  look="secondary"
                  label="Use the media root"
                  @click=${() => {
    var t;
    return (t = I(this, K)) == null ? void 0 : t.updateOutput({ mediaFolderKey: null });
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
    return (i = I(this, K)) == null ? void 0 : i.updateOutput({ fileNamePattern: t.target.value });
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
    return (i = I(this, K)) == null ? void 0 : i.updateOutput({
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
    return (i = I(this, K)) == null ? void 0 : i.updateOutput({ quality: Number(t.target.value) });
  }}>
              </uui-input>
            </umb-property-layout>`}
      </uui-box>
    `;
};
ll = function() {
  const e = this._template;
  return r`
      <uui-box headline="When to run">
        <umb-property-layout label="On publish" description="Generate the image as the content is published.">
          <uui-toggle
            slot="editor"
            ?checked=${e.trigger.onPublish}
            @change=${(t) => {
    var i;
    return (i = I(this, K)) == null ? void 0 : i.updateTrigger({ onPublish: t.target.checked });
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
    return (i = I(this, K)) == null ? void 0 : i.updateTrigger({ onlyWhenEmpty: t.target.checked });
  }}>
          </uui-toggle>
        </umb-property-layout>
      </uui-box>
    `;
};
cl = function() {
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
    return (i = I(this, K)) == null ? void 0 : i.updateTemplateFields({ alias: t.target.value });
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
Je.styles = D`
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
Aa([
  h()
], Je.prototype, "_template", 2);
Aa([
  h()
], Je.prototype, "_properties", 2);
Aa([
  h()
], Je.prototype, "_showAdvanced", 2);
Je = Aa([
  E("di-settings-view")
], Je);
const Eu = Je, Pu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSettingsViewElement() {
    return Je;
  },
  default: Eu
}, Symbol.toStringTag, { value: "Module" }));
var zu = Object.defineProperty, Mu = Object.getOwnPropertyDescriptor, ul = (e) => {
  throw TypeError(e);
}, Fi = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mu(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && zu(t, i, s), s;
}, Qs = (e, t, i) => t.has(e) || ul("Cannot " + i), wo = (e, t, i) => (Qs(e, t, "read from private field"), t.get(e)), $o = (e, t, i) => t.has(e) ? ul("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ou = (e, t, i, a) => (Qs(e, t, "write to private field"), t.set(e, i), i), xo = (e, t, i) => (Qs(e, t, "access private method"), i), Di, ra, ks;
let Me = class extends z {
  constructor() {
    super(), $o(this, ra), $o(this, Di), this._loading = !0, this._onlyMissing = !1, this.consumeContext(xt, (e) => {
      Ou(this, Di, e), e && this.observe(e.template, (t) => {
        const i = !this._template;
        this._template = t, t && i && xo(this, ra, ks).call(this);
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
          <uui-button look="secondary" label="Reload" @click=${() => xo(this, ra, ks).call(this)}>Reload</uui-button>
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

        ${e.length === 0 ? r`<p class="empty">Nothing to show.</p>` : r`<uui-table>
              <uui-table-head>
                <uui-table-head-cell>Name</uui-table-head-cell>
                <uui-table-head-cell>Image</uui-table-head-cell>
                <uui-table-head-cell>State</uui-table-head-cell>
              </uui-table-head>
              ${A(
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
Di = /* @__PURE__ */ new WeakMap();
ra = /* @__PURE__ */ new WeakSet();
ks = async function() {
  const e = this._template;
  if (!(!e || !wo(this, Di))) {
    this._loading = !0;
    try {
      this._usage = await Go(e.key, wo(this, Di).getToken);
    } catch (t) {
      console.error("[DynamicImages] Failed to load usage", t), this._usage = void 0;
    } finally {
      this._loading = !1;
    }
  }
};
Me.styles = D`
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
Fi([
  h()
], Me.prototype, "_template", 2);
Fi([
  h()
], Me.prototype, "_usage", 2);
Fi([
  h()
], Me.prototype, "_loading", 2);
Fi([
  h()
], Me.prototype, "_onlyMissing", 2);
Me = Fi([
  E("di-usage-view")
], Me);
const Iu = Me, Au = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiUsageViewElement() {
    return Me;
  },
  default: Iu
}, Symbol.toStringTag, { value: "Module" })), Lu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api: no,
  default: no
}, Symbol.toStringTag, { value: "Module" })), Wu = 1500;
var pe, mt, xa, dl;
class Ha extends _l {
  constructor(i, a) {
    super(i, a);
    w(this, xa);
    w(this, pe);
    w(this, mt);
    this.consumeContext(et, (s) => {
      v(this, pe, s);
    }), this.consumeContext(xt, (s) => {
      v(this, mt, s);
    });
  }
  async execute() {
    var s, o, n;
    const i = l(this, mt), a = i == null ? void 0 : i.getData();
    if (!(!i || !a)) {
      if (i.getIsNew()) {
        (s = l(this, pe)) == null || s.peek("warning", { data: { message: "Save the template before regenerating." } });
        return;
      }
      await Ss(this._host, {
        headline: `Regenerate every image for '${a.name}'?`,
        content: "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
        confirmLabel: "Regenerate",
        color: "warning"
      });
      try {
        const c = await Vo(a.key, !1, i.getToken);
        (o = l(this, pe)) == null || o.peek("positive", {
          data: { message: `Regenerating ${c.total} item(s)…` }
        }), await T(this, xa, dl).call(this, c, i);
      } catch (c) {
        (n = l(this, pe)) == null || n.peek("danger", {
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
    l(this, mt) && await jo(i, l(this, mt).getToken);
  }
}
pe = new WeakMap(), mt = new WeakMap(), xa = new WeakSet(), dl = async function(i, a) {
  var o, n, c, f;
  let s = i;
  for (; s.status === "queued" || s.status === "running"; ) {
    await new Promise((b) => setTimeout(b, Wu));
    try {
      s = await Ho(s.id, a.getToken);
    } catch {
      (o = l(this, pe)) == null || o.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }
  if (s.status === "completed") {
    const b = s.failures.length;
    (n = l(this, pe)) == null || n.peek(b > 0 ? "warning" : "positive", {
      data: {
        headline: "Regeneration finished",
        message: `${s.generated} generated, ${s.skipped} skipped${b > 0 ? `, ${b} failed` : ""}.`
      }
    });
    for (const L of s.failures.slice(0, 3))
      (c = l(this, pe)) == null || c.peek("danger", { data: { message: L } });
  } else
    (f = l(this, pe)) == null || f.peek("danger", {
      data: { headline: `Regeneration ${s.status}`, message: s.failures[0] ?? "" }
    });
};
const Ru = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateWorkspaceAction: Ha,
  api: Ha,
  default: Ha
}, Symbol.toStringTag, { value: "Module" }));
var zi, Ht;
class ja extends kl {
  constructor(i, a) {
    super(i, a);
    w(this, zi);
    w(this, Ht);
    this.consumeContext(Oe, (s) => {
      v(this, zi, s);
    }), this.consumeContext(et, (s) => {
      v(this, Ht, s);
    });
  }
  async execute() {
    var a, s;
    const i = this.args.unique;
    if (i)
      try {
        const o = await Sa(i, () => {
          var n;
          return (n = l(this, zi)) == null ? void 0 : n.getLatestToken();
        });
        (a = l(this, Ht)) == null || a.peek(o.outcome === "generated" ? "positive" : "warning", {
          data: {
            headline: "Dynamic Images",
            message: o.outcome === "generated" ? "The image has been regenerated." : o.message ?? o.outcome
          }
        });
      } catch (o) {
        const n = o instanceof Xe && o.status === 404;
        (s = l(this, Ht)) == null || s.peek(n ? "warning" : "danger", {
          data: {
            headline: "Dynamic Images",
            message: o instanceof Xe ? o.detail ?? o.message : "The image could not be regenerated."
          }
        });
      }
  }
}
zi = new WeakMap(), Ht = new WeakMap();
const Uu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegenerateDocumentEntityAction: ja,
  api: ja,
  default: ja
}, Symbol.toStringTag, { value: "Module" }));
var Mi, ft, Oi, jt;
class Ga extends Sl {
  constructor(i, a) {
    super(i, a);
    w(this, Mi);
    w(this, ft);
    w(this, Oi);
    w(this, jt);
    this.consumeContext(Oe, (s) => {
      v(this, Mi, s);
    }), this.consumeContext(et, (s) => {
      v(this, ft, s);
    }), this.consumeContext(Tl, (s) => {
      v(this, Oi, s);
    }), this.consumeContext(Cl, (s) => {
      v(this, jt, (s == null ? void 0 : s.getUnique()) ?? void 0);
    });
  }
  async execute() {
    var i, a, s, o;
    if (!l(this, jt)) {
      (i = l(this, ft)) == null || i.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }
    try {
      const n = await Sa(l(this, jt), () => {
        var c;
        return (c = l(this, Mi)) == null ? void 0 : c.getLatestToken();
      });
      n.propertyValue && ((a = l(this, Oi)) == null || a.setValue(JSON.parse(n.propertyValue))), (s = l(this, ft)) == null || s.peek("positive", {
        data: { headline: "Dynamic Images", message: "The image has been regenerated." }
      });
    } catch (n) {
      const c = n instanceof Xe && n.status === 404;
      (o = l(this, ft)) == null || o.peek(c ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message: n instanceof Xe ? n.detail ?? n.message : "The image could not be regenerated."
        }
      });
    }
  }
}
Mi = new WeakMap(), ft = new WeakMap(), Oi = new WeakMap(), jt = new WeakMap();
const Nu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DiRegeneratePropertyAction: Ga,
  api: Ga,
  default: Ga
}, Symbol.toStringTag, { value: "Module" }));
var Fu = Object.defineProperty, Ku = Object.getOwnPropertyDescriptor, hl = (e) => {
  throw TypeError(e);
}, La = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ku(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Fu(t, i, s), s;
}, eo = (e, t, i) => t.has(e) || hl("Cannot " + i), $a = (e, t, i) => (eo(e, t, "read from private field"), t.get(e)), ji = (e, t, i) => t.has(e) ? hl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), pl = (e, t, i, a) => (eo(e, t, "write to private field"), t.set(e, i), i), Ct = (e, t, i) => (eo(e, t, "access private method"), i), la, Ei, to, Ue, io, ml, ca;
let Ze = class extends Co {
  constructor() {
    super(), ji(this, Ue), ji(this, la), ji(this, Ei), this._items = [], this._loading = !0, this._search = "", ji(this, to, () => {
      var e;
      return (e = $a(this, la)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Oe, (e) => {
      pl(this, la, e), e && Ct(this, Ue, io).call(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout($a(this, Ei));
  }
  render() {
    return r`
      <umb-body-layout headline="Preview against">
        <uui-input
          type="search"
          label="Search content"
          placeholder="Search"
          .value=${this._search}
          @input=${Ct(this, Ue, ml)}>
        </uui-input>

        <uui-button look="secondary" label="Use sample data instead" @click=${() => Ct(this, Ue, ca).call(this, void 0)}>
          Use sample data
        </uui-button>

        ${this._loading ? r`<uui-loader></uui-loader>` : this._items.length === 0 ? r`<p class="empty">No content of the selected document types was found.</p>` : r`<uui-ref-list>
                ${A(
      this._items,
      (e) => e.key,
      (e) => {
        var t;
        return r`
                    <uui-ref-node
                      name=${e.name}
                      detail=${e.isPublished ? "Published" : "Draft"}
                      ?selected=${e.key === ((t = this.data) == null ? void 0 : t.selectedKey)}
                      @open=${() => Ct(this, Ue, ca).call(this, e)}
                      @click=${() => Ct(this, Ue, ca).call(this, e)}>
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
la = /* @__PURE__ */ new WeakMap();
Ei = /* @__PURE__ */ new WeakMap();
to = /* @__PURE__ */ new WeakMap();
Ue = /* @__PURE__ */ new WeakSet();
io = async function() {
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
        (a) => Bo(a, this._search, 0, 30, $a(this, to)).catch(() => ({ total: 0, items: [] }))
      )
    );
    this._items = i.flatMap((a) => a.items);
  } finally {
    this._loading = !1;
  }
};
ml = function(e) {
  this._search = e.target.value, window.clearTimeout($a(this, Ei)), pl(this, Ei, window.setTimeout(() => void Ct(this, Ue, io).call(this), 300));
};
ca = function(e) {
  this.value = { item: e }, this._submitModal();
};
Ze.styles = D`
    uui-input {
      width: 100%;
      margin-bottom: var(--uui-size-space-3);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }
  `;
La([
  h()
], Ze.prototype, "_items", 2);
La([
  h()
], Ze.prototype, "_loading", 2);
La([
  h()
], Ze.prototype, "_search", 2);
Ze = La([
  E("di-sample-node-picker-modal")
], Ze);
const Bu = Ze, Vu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiSampleNodePickerModalElement() {
    return Ze;
  },
  default: Bu
}, Symbol.toStringTag, { value: "Module" }));
var Hu = Object.defineProperty, ju = Object.getOwnPropertyDescriptor, fl = (e) => {
  throw TypeError(e);
}, Wa = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ju(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Hu(t, i, s), s;
}, ao = (e, t, i) => t.has(e) || fl("Cannot " + i), so = (e, t, i) => (ao(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Xa = (e, t, i) => t.has(e) ? fl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Gu = (e, t, i, a) => (ao(e, t, "write to private field"), t.set(e, i), i), ko = (e, t, i) => (ao(e, t, "access private method"), i), ua, Ra, da, gl, yl;
let Qe = class extends Co {
  constructor() {
    super(), Xa(this, da), Xa(this, ua), this._busy = !1, this._path = "", Xa(this, Ra, () => {
      var e;
      return (e = so(this, ua)) == null ? void 0 : e.getLatestToken();
    }), this.consumeContext(Oe, (e) => {
      Gu(this, ua, e);
    });
  }
  render() {
    return r`
      <umb-body-layout headline="Add a font">
        <uui-box headline="Upload a file">
          <input
            type="file"
            accept=".ttf,.otf,.woff2,.woff"
            multiple
            aria-label="Font files"
            ?disabled=${this._busy}
            @change=${ko(this, da, gl)} />
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
            @click=${ko(this, da, yl)}>
            Register
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
ua = /* @__PURE__ */ new WeakMap();
Ra = /* @__PURE__ */ new WeakMap();
da = /* @__PURE__ */ new WeakSet();
gl = async function(e) {
  const t = e.target.files;
  if (!(!t || t.length === 0)) {
    this._busy = !0, this._error = void 0;
    try {
      for (const i of Array.from(t))
        await Wo(i, so(this, Ra));
      this.value = { uploaded: !0 }, this._submitModal();
    } catch (i) {
      this._error = i instanceof Error ? i.message : "The font could not be uploaded.";
    } finally {
      this._busy = !1;
    }
  }
};
yl = async function() {
  if (this._path.trim()) {
    this._busy = !0, this._error = void 0;
    try {
      await Ro(this._path.trim(), so(this, Ra)), this.value = { uploaded: !0 }, this._submitModal();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "That path could not be registered.";
    } finally {
      this._busy = !1;
    }
  }
};
Qe.styles = D`
    uui-box {
      margin-bottom: var(--uui-size-space-4);
    }

    uui-input {
      width: 100%;
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
Wa([
  h()
], Qe.prototype, "_busy", 2);
Wa([
  h()
], Qe.prototype, "_error", 2);
Wa([
  h()
], Qe.prototype, "_path", 2);
Qe = Wa([
  E("di-font-upload-modal")
], Qe);
const Xu = Qe, Yu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DiFontUploadModalElement() {
    return Qe;
  },
  default: Xu
}, Symbol.toStringTag, { value: "Module" }));
export {
  Gl as manifests,
  dd as onInit
};
//# sourceMappingURL=dynamic-images.js.map
