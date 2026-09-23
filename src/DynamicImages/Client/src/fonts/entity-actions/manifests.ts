import {
  DI_FONT_FAMILY_ENTITY_TYPE, DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_FOLDER_REPOSITORY_ALIAS, DI_FONT_ROOT_ENTITY_TYPE,
} from "../constants.js";

/** The root and folders: what holds folders and families. */
const CONTAINERS = [DI_FONT_ROOT_ENTITY_TYPE, DI_FONT_FOLDER_ENTITY_TYPE];

/**
 * Every ⋯ action in the Fonts tree and its collections. Core kinds wherever one exists, as in
 * the Templates tree; the Create… options are this package's own because adding a font is.
 */
export const manifests: Array<UmbExtensionManifest> = [
  // ---------------------------------------------------------------- create
  {
    type: "entityAction",
    kind: "create",
    alias: "DynamicImages.EntityAction.Font.Create",
    name: "Create Dynamic Images Font",
    weight: 1200,
    forEntityTypes: [...CONTAINERS, DI_FONT_FAMILY_ENTITY_TYPE],
    meta: { icon: "icon-add", label: "#actions_createFor", additionalOptions: true, headline: "Add to Fonts" },
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Upload",
    name: "Upload a Dynamic Images Font File",
    weight: 100,
    api: () => import("./upload-font.option-action.js"),
    forEntityTypes: CONTAINERS,
    meta: {
      icon: "icon-cloud-upload",
      label: "Upload font file",
      description: "A .ttf, .otf, .woff2 or .woff, stored in the media library",
    },
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Web",
    name: "Add a Dynamic Images Web Font",
    weight: 90,
    api: () => import("./web-font.option-action.js"),
    forEntityTypes: CONTAINERS,
    meta: { icon: "icon-cloud", label: "Web font", description: "From Google Fonts, Bunny Fonts or a file URL" },
  },
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.Path",
    name: "Register a Dynamic Images Font Path",
    weight: 80,
    api: () => import("./path-font.option-action.js"),
    forEntityTypes: CONTAINERS,
    meta: { icon: "icon-font", label: "Font from path", description: "A font file already in the site's wwwroot" },
  },
  // Cast for the same reason as the template folder option in entity-actions/manifests.ts.
  {
    type: "entityCreateOptionAction",
    kind: "folder",
    alias: "DynamicImages.EntityCreateOptionAction.FontFolder",
    name: "Dynamic Images Font Folder Create Option",
    weight: 70,
    forEntityTypes: CONTAINERS,
    meta: {
      icon: "icon-folder",
      label: "#create_folder",
      additionalOptions: true,
      folderRepositoryAlias: DI_FONT_FOLDER_REPOSITORY_ALIAS,
    },
  } as unknown as UmbExtensionManifest,
  {
    type: "entityCreateOptionAction",
    alias: "DynamicImages.EntityCreateOptionAction.Font.AddVariant",
    name: "Add a Variant to a Dynamic Images Font Family",
    weight: 100,
    api: () => import("./add-variant.option-action.js"),
    forEntityTypes: [DI_FONT_FAMILY_ENTITY_TYPE],
    meta: { icon: "icon-add", label: "Add variant", description: "Another weight or slant of this family" },
  },

  // ---------------------------------------------------------------- reload
  {
    type: "entityAction",
    kind: "reloadTreeItemChildren",
    alias: "DynamicImages.EntityAction.Font.ReloadChildren",
    name: "Reload Dynamic Images Fonts",
    forEntityTypes: [...CONTAINERS, DI_FONT_FAMILY_ENTITY_TYPE],
  },
];
