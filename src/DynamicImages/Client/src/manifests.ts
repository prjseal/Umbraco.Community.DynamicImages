import { DiTemplateWorkspaceContext } from "./workspace/di-template-workspace.context.js";
import { TEMPLATE_ENTITY_TYPE } from "./api/dynamic-images-api.js";
import { manifests as treeManifests } from "./tree/manifests.js";
import { manifests as entityActionManifests } from "./entity-actions/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";

/**
 * Every extension that references an element or the workspace context is registered here rather
 * than in umbraco-package.json, so it is a real class: a renamed export becomes a build error
 * instead of a blank panel at runtime.
 *
 * The extensions that reference neither - the section, the sidebar app, the menu, and the
 * Fonts/Health link items - are in umbraco-package.json instead, because Umbraco reads that file
 * before this bundle loads and they can therefore paint straight away.
 */
export const manifests: Array<UmbExtensionManifest> = [
  ...treeManifests,
  ...entityActionManifests,
  ...collectionManifests,

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
    element: () => import("./dashboards/di-overview-dashboard.element.js"),
    weight: 100,
    meta: { label: "Overview", pathname: "overview" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }],
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Fonts",
    name: "Dynamic Images Fonts",
    element: () => import("./dashboards/di-fonts-dashboard.element.js"),
    weight: 90,
    meta: { label: "Fonts", pathname: "fonts" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }],
  },
  {
    type: "dashboard",
    alias: "DynamicImages.Dashboard.Health",
    name: "Dynamic Images Health",
    element: () => import("./dashboards/di-health-dashboard.element.js"),
    weight: 80,
    meta: { label: "Health", pathname: "health" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "DynamicImages.Section" }],
  },

  // ---------------------------------------------------------------- workspace
  {
    type: "workspace",
    kind: "routable",
    alias: "DynamicImages.Workspace.Template",
    name: "Dynamic Images Template Workspace",
    api: DiTemplateWorkspaceContext,
    meta: { entityType: TEMPLATE_ENTITY_TYPE },
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Design",
    name: "Dynamic Images Design View",
    element: () => import("./workspace/views/di-design-view.element.js"),
    weight: 300,
    meta: { label: "Design", pathname: "design", icon: "icon-brush" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }],
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Preview",
    name: "Dynamic Images Preview View",
    element: () => import("./workspace/views/di-preview-view.element.js"),
    weight: 200,
    meta: { label: "Preview & test", pathname: "preview", icon: "icon-eye" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }],
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Settings",
    name: "Dynamic Images Settings View",
    element: () => import("./workspace/views/di-settings-view.element.js"),
    weight: 100,
    meta: { label: "Settings", pathname: "settings", icon: "icon-settings" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }],
  },
  {
    type: "workspaceView",
    alias: "DynamicImages.WorkspaceView.Usage",
    name: "Dynamic Images Usage View",
    element: () => import("./workspace/views/di-usage-view.element.js"),
    weight: 50,
    meta: { label: "Usage", pathname: "usage", icon: "icon-documents" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }],
  },

  // ---------------------------------------------------------------- workspace actions
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Save",
    name: "Dynamic Images Save",
    api: () => import("./workspace/actions/save.action.js"),
    weight: 100,
    meta: { label: "Save", look: "primary", color: "positive" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "DynamicImages.WorkspaceAction.Regenerate",
    name: "Dynamic Images Regenerate",
    api: () => import("./workspace/actions/regenerate.action.js"),
    weight: 90,
    meta: { label: "Regenerate all", look: "secondary", color: "default" },
    conditions: [{ alias: "Umb.Condition.WorkspaceAlias", match: "DynamicImages.Workspace.Template" }],
  },

  // ---------------------------------------------------------------- content integration
  {
    type: "entityAction",
    kind: "default",
    alias: "DynamicImages.EntityAction.RegenerateDocument",
    name: "Regenerate OG image",
    api: () => import("./entity-actions/regenerate-document.action.js"),
    forEntityTypes: ["document"],
    weight: 100,
    meta: { icon: "icon-picture", label: "Regenerate OG image" },
  },
  {
    type: "propertyAction",
    kind: "default",
    alias: "DynamicImages.PropertyAction.Regenerate",
    name: "Regenerate OG image",
    api: () => import("./property-actions/regenerate.property-action.js"),
    // A property action rather than a custom property editor UI, so adopting the package needs no
    // data type changes on anyone's existing document types.
    forPropertyEditorUis: ["Umb.PropertyEditorUi.MediaPicker"],
    meta: { icon: "icon-picture", label: "Regenerate OG image" },
  },

  // ---------------------------------------------------------------- modals
  {
    type: "modal",
    alias: "DynamicImages.Modal.FontUpload",
    name: "Dynamic Images Font Upload",
    element: () => import("./modals/di-font-upload-modal.element.js"),
  },
];
