import type { UmbEntryPointOnInit } from "@umbraco-cms/backoffice/extension-api";
import { manifests } from "./manifests.js";

/**
 * The bundle's entry point, loaded once the backoffice has booted and authenticated. Registering
 * from here rather than from umbraco-package.json keeps every element and api reference a real
 * import, so a rename fails the build instead of silently producing an empty panel.
 */
export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
  extensionRegistry.registerMany(manifests);
};

export { manifests };
