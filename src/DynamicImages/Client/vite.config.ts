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
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
