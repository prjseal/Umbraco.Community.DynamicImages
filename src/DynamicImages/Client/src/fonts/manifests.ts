import { manifests as treeManifests } from "./tree/manifests.js";
import { manifests as folderManifests } from "./folder/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";
import { manifests as entityActionManifests } from "./entity-actions/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";

/** The Fonts tree: laid out as the Templates tree is, under `fonts/`. */
export const manifests: Array<UmbExtensionManifest> = [
  ...treeManifests,
  ...folderManifests,
  ...collectionManifests,
  ...entityActionManifests,
  ...workspaceManifests,
];
