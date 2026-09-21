# Remove the legacy v1 config import

## Context

v1 of Dynamic Images was never released, so the package carries an import path for a config format nobody has. It costs code, a health-check issue, a dashboard banner, an API endpoint, docs and a test site fixture. Remove all of it. The package, docs and repo should read as if v1 never existed. E2E does not depend on the import: the specs open "Article OG image", which comes from uSync (`uSync/v17/DynamicImagesTemplates/articleogimage.config`).

Decisions made with the user:
- No migration path or docs for v1 anywhere.
- Keep the two `Media Picker (legacy)` uSync data types in the test site. They are Clean's own data types and are unrelated.
- Keep the "legacy" comments in `DynamicImageMediaWriter.cs` (pre-Relation generated images) and `MediaSource.cs` (old `umb://` UDI format). Both describe real behaviour.

Branch: `cleanup/ps/preparing-for-rc01`.

## Design

Pure deletion. The only shared code is `ImportReport`, which lives in `LegacyConfigImporter.cs` and is used only by legacy paths. Breaking changes are acceptable pre-release: the `HealthReport` shape, the removed options (`AutoImportLegacyConfig`, `Instructions`, `Fonts`) and one API endpoint. A leftover v1 `Instructions` block in someone's config is silently ignored. `WebFonts` is a separate option and stays.

## Files

### Delete
- `src/DynamicImages/Core/Services/LegacyConfigImporter.cs` (includes `ImportReport`)
- `src/DynamicImages/Core/Models/Legacy/LegacyModels.cs` (and the empty folder)
- `src/DynamicImages/Composing/LegacyImportRetry.cs`
- `src/DynamicImages/Composing/LegacyImportRetryHandler.cs`
- `test/DynamicImages.Tests/LegacyImportDeferralTests.cs`

### Server edits (`src/DynamicImages`)
- `Composing/DynamicImagesComposer.cs`: remove the two v1 comment blocks (about lines 36-45), the `LegacyImportRetryState` singleton, the `ContentTypeSavedNotification` handler registration and `AddScoped<ILegacyConfigImporter, ...>` (about line 174). Drop any now-unused `using`.
- `Composing/DynamicImagesStartupHandler.cs`: rewrite the class summary to describe only file sync in Import mode. Remove the `retryState` constructor parameter, the `ImportLegacyConfigIfNeededAsync` call and method and `LogWarnings(ImportReport)`. Reword the "the import" comment (lines 40-44). Drop unused usings (`Persistence`, possibly).
- `Configuration/DynamicImagesOptions.cs`: remove `AutoImportLegacyConfig`, `Instructions`, `Fonts` and the `Legacy` using.
- `Core/Services/IHealthService.cs`: remove `LegacyConfigPresent` from `HealthReport`.
- `Core/Services/HealthService.cs`: remove the `ILegacyConfigImporter` constructor parameter, the `LegacyConfigNotImported` issue block and the argument to `new HealthReport(...)`.
- `Api/Controllers/TemplatesController.cs`: remove the `ILegacyConfigImporter` parameter, the `LooksLikeLegacyConfig` branch in `Import`, the `ImportReportResponse` `ProducesResponseType`, the `POST templates/import/appsettings` endpoint (`ImportFromAppSettings`) and `LooksLikeLegacyConfig`. Reword the "Paste a template or a v1 configuration block" and "template or configuration block" messages to say "template".
- `Api/Models/ApiModels.cs`: delete `ImportReportResponse`; keep `TemplateImportRequest`.

### Client edits (`src/DynamicImages/Client/src`)
- `api/types.ts`: remove `legacyConfigPresent` from `DiHealthReport` and delete `DiImportReport`.
- `api/dynamic-images-api.ts`: `importTemplate` returns `DiTemplateSaveResponse` only; delete `importFromAppSettings`; fix imports.
- `dashboards/di-overview-dashboard.element.ts`: remove the `importFromAppSettings` import, `#importLegacy()`, `#renderLegacyBanner()` and its call (about line 183). Reword the "v1 configuration" label, placeholder and hint text (about lines 281-303). Remove the `.banner` CSS and any unused imports if the banner was the only user; keep `_importing`.
- `e2e/helpers.ts` line 20: reword the comment to say the template comes from the uSync fixture.
- Rebuild the committed bundle: `npm run build` in `Client`, commit `wwwroot/App_Plugins/DynamicImages/dynamic-images.js` and `.js.map`. `ci.yml` fails otherwise.
- No OpenAPI generation config exists (`types.ts` is hand-written), so nothing to regenerate.

### Docs and repo
- `.github/README.md`: drop "and - if there is a v1 block... imports it" (lines 26-27) and the "migrating from v1" mention (line 48).
- `src/DynamicImages/README.md`: same first-start sentence (lines 24-25); delete the "Migrating from v1" section (about lines 279-311, including "Behaviour that changed on purpose"); remove `AutoImportLegacyConfig` from the sample JSON (line 322) and the options table (line 333). Then grep for `#migrating-from-v1` anchors and remove links.
- `src/DynamicImages/CHANGELOG.md`: remove the v1-import bullets (about lines 212, 273-274, 320). Leave the historical line 284 unless it reads oddly.
- `CLAUDE.md` line 111: reword "auto-imported" to "the uSync-imported 'Article OG image' template".
- `src/DynamicImages.TestSite.Clean/appsettings.Development.json`: delete the `"//"` comment (lines 41-49), the `Instructions` array and the `Fonts` array; keep `"DynamicImages": { "Enabled": true }`.
- `src/DynamicImages.TestSite.Clean/README.md`: reword the "Clean Bean Cafe OG image template" section (about lines 59-82) to say the template comes from uSync, and remove the migration link.
- Before deleting the appsettings block, confirm the background image and fonts under `wwwroot/assets` are still referenced by the uSync template; do not delete assets the uSync fixture uses.
- `plans/*.md` mentions of the legacy importer are historical records; leave them.

## Implementation order

1. Server: delete files, fix `DynamicImagesComposer`, `DynamicImagesStartupHandler`, `DynamicImagesOptions`, `HealthService`/`IHealthService`, `TemplatesController`, `ApiModels`; build and fix leftovers.
2. Tests: delete `LegacyImportDeferralTests`; build and test.
3. Client: types, API, dashboard; typecheck, then rebuild the bundle.
4. Test site and docs: appsettings, READMEs, CHANGELOG, `CLAUDE.md`, e2e comment.
5. Final grep for `legacy`, `v1`, `ImportReport` and `AutoImportLegacyConfig` across the repo (excluding `plans/`, `node_modules`, `bin`, `obj`); only the kept comments and data types should remain.

## Verification

- `dotnet build src/DynamicImages.sln` and `dotnet test test/DynamicImages.Tests` pass.
- `cd src/DynamicImages/Client && npm run typecheck && npm test && npm run test:browser && npm run build`. `git status` then shows only the intended bundle changes, so `ci.yml`'s bundle check passes.
- Boot `DynamicImages.TestSite.Clean` per `CLAUDE.md` (HTTPS, Release env vars) and run `npm run test:e2e`. Confirm the "Article OG image" template still appears, the dashboard has no legacy banner, and the overview health report loads.
- Done means the changes are committed on `cleanup/ps/preparing-for-rc01`, author `Paul Seal <prjseal@gmail.com>`, with no push.

## As built

Two things beyond the plan text, both from the decision that no v1 mention may remain:
- Comments in `Core/Fonts`, `Core/Json`, `Core/Rendering`, `Core/Models/Layers`, `Extensions`, `DynamicImages.uSync/Serializers` and the matching tests described behaviour as a change from v1; they were reworded to describe the behaviour itself.
- Left alone on purpose: the migration step ids (`dynamicimages-*-v1`, persisted state), the template JSON schema version 1 in the uSync serializer test, the `/api/v1/` management API route, and Umbraco's own schema files.
- The E2E suite's login needs `UMBRACO_USER_LOGIN`/`UMBRACO_USER_PASSWORD` when the site was booted from a developer's `appsettings.Local.json` (its email differs from the config default).
