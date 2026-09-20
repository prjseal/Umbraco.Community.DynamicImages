import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "dynamic-images.js",
    },
    outDir: "../wwwroot/App_Plugins/DynamicImages",
    // Don't wipe umbraco-package.json, lang/ or defaults/ - they are committed, not built.
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      // The backoffice host supplies these at runtime.
      external: [/^@umbraco/],
      output: {
        // One file, not a tree of hash-named chunks. The build output is committed, and hashed
        // chunk names would leave stale files behind in wwwroot on every rebuild. The manifest's
        // `() => import(...)` loaders still work - they resolve inside this bundle.
        inlineDynamicImports: true,
      },
    },
  },
  test: {
    // Two projects, because the two kinds of spec cost wildly different amounts. The node project
    // is the fast one that runs on every save; the browser project pays for a real Chromium so
    // that `getBoundingClientRect()` means something. jsdom does no layout at all, so the layout
    // defects this suite exists to pin cannot be expressed there.
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.browser.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.ts"],
          browser: {
            enabled: true,
            provider: "playwright",
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
