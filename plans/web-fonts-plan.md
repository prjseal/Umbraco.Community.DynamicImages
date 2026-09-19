# Web fonts (Google Fonts, Bunny Fonts, direct URL) for Dynamic Images

## Context

Today a template's text layer can only use a font that was **uploaded** (stored as a media item)
or **registered from a `wwwroot` path**. Both need a file to hand. Editors want to type
"Inter, 700" and have it work, the way they would on a web page. The package does not use
system-installed fonts anywhere (no `SystemFonts`, no fontconfig), so this is *adding a third
source kind*, not replacing an OS lookup.

Decisions already made with the user:

- **Live URL source with a per-server cache.** A new `url` font source kind. The file is fetched
  from its URL the first time a server needs it and cached on that server's disk, on top of the
  in-memory `FontFamily` cache the registry already keeps. It is *not* copied into the media
  library. (Cloud trade-off discussed and accepted: local disk is per instance and ephemeral, so
  each instance warms its own cache after a deploy, and publishes need outbound HTTPS.)
- **Three named providers:** Google Fonts, Bunny Fonts, and a direct https URL to a font file.
- **Picker UX:** type the family name, tick weights and italic. The server validates against the
  provider's CSS API. No API key, no catalogue.

### What the provider APIs actually do (verified with curl, 2026-09-19)

| | Google `fonts.googleapis.com/css2` | Bunny `fonts.bunny.net/css` |
|---|---|---|
| Request | `?family=Open+Sans:ital,wght@1,700` (one variant per call) | `?family=open-sans:700i` (slug family, `i` suffix) |
| With a **non-browser User-Agent** | ONE `@font-face`, one full **TTF** on `fonts.gstatic.com`, a static instance (no `fvar`) even for variable families; name table "Inter" / "Bold" | Always many `@font-face` blocks, one per **unicode-range subset** (latin, latin-ext, cyrillic, …), each `woff2` + `woff`. No full file exists |
| Unknown family | HTTP **400** | HTTP **200**, body is a CSS comment `/* Error: API Error … */` |
| Unavailable weight | HTTP **400** | HTTP **200**, **empty** body |
| With a browser UA | 7 subset blocks (woff2) → never send a browser UA | same |

Consequences: always send our own `User-Agent`; one CSS request per variant (also sidesteps
css2's axis-ordering rule and gives per-variant errors); for Google take the single `src`; for
Bunny pick the block whose `unicode-range` covers `U+0000-00FF` (the `latin` one) and prefer
`woff2` (SixLabors.Fonts 2.x reads woff2 - the package already accepts `.woff2` uploads); document
that a Bunny font renders the Latin subset only. Never request ranges like `wght@100..900`: one
weight per row keeps the existing "one family, one file, one weight" model.

Library facts: ImageSharp.Drawing 2.1.5 pins SixLabors.Fonts 2.x, which loads a variable TTF at
its default instance only (variable support is Fonts 3.x). So a direct URL to `Inter[wght].ttf`
renders as Regular - say "static font files only" in the hint and README, and do not bump Fonts.

## Design

### Prerequisite fix: `FontRegistry` must not cache a cancelled or failed load

`Core/Fonts/FontRegistry.cs` builds the shared `Lazy<Task>` with the *first caller's*
cancellation token (line 22-23) and caches `null` forever on any failure. Today loads are local,
so it rarely shows; with a network fetch the designer's abortable previews (`fetchPreview` passes
an `AbortSignal`) would cancel the first load and leave the font dead on that server until a
`Notify` or restart, and one DNS blip would do the same. Fix in `LoadAsync`: load with
`CancellationToken.None` (the HttpClient timeout bounds it), and on `null` or exception
`_families.TryRemove(fontKey, out _)` so the next render retries.

### Model and persistence

- `Core/Models/ImageSource.cs`: add `Url` to `ImageSourceKind` (`[JsonStringEnumMemberName("url")]`).
  Fonts only: `TemplateValidator.ValidatePathSource` rejects `Url` on an image source with a
  `SourceKindInvalid` error; `ImageSourceProvider.OpenAsync` already returns null for it.
- `Core/Models/FontDefinition.cs`: add `SourceUrl` (file URL fetched at render time), `Provider`
  (`"google" | "bunny" | "direct"` - not `"url"`, which would collide with the source kind name),
  `ProviderFamily` (family as typed, needed to re-resolve). `Weight`/`IsItalic` stay.
- `Persistence/Dtos/FontDto.cs`: `sourceUrl` `[Length(2000)]`, `provider` `[Length(20)]`,
  `providerFamily` `[Length(255)]`, **all `[NullSetting(NullSetting = NullSettings.Null)]`** -
  `AddColumn<T>` copies the DTO definition and a NOT NULL add fails on a populated table.
- `Persistence/FontRepository.cs`: `ToDto`/`Map` currently do a path-or-media ternary; replace
  with a string↔enum switch covering `"url"`.
- New `Migrations/AddWebFontColumns.cs` (`AsyncMigrationBase`), plan step
  `dynamicimages-fonts-v2` appended after `dynamicimages-fontmediatype-v1` in
  `DynamicImagesMigrationComponent`. Uses the base-class helpers `ColumnExists(table, column)`
  and `AddColumn<FontDto>(column)`. The `ColumnExists` guard is mandatory, not defensive: on a
  fresh install `CreateFontsTable`'s `Create.Table<FontDto>()` already creates the new columns.

### Options

`DynamicImagesOptions` already has `Fonts` (the v1 legacy import list), so the new block is
**`WebFonts`**: `WebFontOptions { TimeoutSeconds = 15, MaxBytes = 10 MB (the upload cap),
CacheFolder = null }`. README config table gains the rows.

### Fetching and caching (`Core/Fonts/Remote/`)

- `FontFaceCssParser` (public static, pure, like `ColourParser`): CSS text → list of
  `FontFaceBlock(FontStyle, FontWeight, UnicodeRange?, Sources[(Url, Format)])`. Also surfaces a
  leading `/* Error: … */` comment so Bunny's unknown-family message reaches the editor.
- `WebFontProviders`: a static descriptor table, one entry per provider - name, CSS URL builder
  (Google `Open+Sans` + `ital,wght@{0|1},{w}`; Bunny slug `open-sans` + `{w}{i?}`), allowed file
  host (`fonts.gstatic.com` / `fonts.bunny.net`), and direct-URL validation (https only, no
  userinfo, host contains a dot and is not an IP literal). Three tiny pieces rather than an
  interface plus a DI collection.
- `IWebFontResolver` / `WebFontResolver` (singleton): `ResolveAsync(provider, family, weight, italic, ct)`
  → the file URL or an error string. Sends the constant User-Agent
  `Umbraco.Community.DynamicImages/<version>`; Google 400 → "'{family}' has no weight {w}{ italic}"
  (400 on the very first variant → "family not found"); Bunny zero blocks → the comment text or
  "no weight {w}". Block selection: no `unicode-range` first, else the one covering `U+0000-00FF`;
  format preference `truetype` > `woff2` > `woff`; resolved URL must be on the provider's host.
- `IRemoteFontFetcher` / `RemoteFontFetcher` (singleton): `GetBytesAsync(url, expectedHash?, ct)`.
  - Named `HttpClient` from `IHttpClientFactory` with `Timeout` and
    `MaxResponseContentBufferSize = MaxBytes` (so `GetByteArrayAsync` throws on oversize; no
    hand-rolled streaming cap), `MaxAutomaticRedirections = 5`.
  - Disk cache **content-addressed by `ContentHash` alone**: `{hash}.bin` under the cache root.
    Every `url` row has a hash, so a refresh that changes bytes changes the file name on every
    server and no cross-server disk invalidation is needed. Miss → download → hash → if it
    differs from `expectedHash` log a warning and still serve (Google URLs are versioned and
    immutable; a drifting direct URL is what Refresh is for). The registry never writes to the DB.
  - Atomic write with a unique temp name `{hash}.{Guid:N}.tmp` then `File.Move(tmp, final, overwrite: true)`,
    treating "final already exists" as success - Umbraco's `LocalTempPath` can sit on a shared
    file system on a scaled-out App Service, so two instances may write at once.
  - No pruning job: TEMP is disposable. Best-effort delete of the local file on Refresh/Delete.
- `IFontCacheRoot` (`string Path`) with `HostingFontCacheRoot` wrapping
  `Umbraco.Cms.Core.Hosting.IHostingEnvironment.LocalTempPath` + `DynamicImages/Fonts`, or
  `WebFonts.CacheFolder` when set. Fully qualify the Umbraco `IHostingEnvironment`:
  `GlobalUsings.cs` imports `Microsoft.AspNetCore.Hosting`, which has an obsolete type of the
  same name. The one-method interface is the test seam (temp dir in tests).

### File provider and registry

- `IFontFileProvider.OpenAsync(FontDefinition font, ct)` replaces the positional
  `(kind, mediaKey, path)` signature - every caller already holds a definition
  (`RegisterPathAsync` builds a throwaway one). `IsPathSafe` unchanged and never consulted for
  `url` rows.
- `FontFileProvider`: make it a real `async` method with the `Url` branch awaited **inside** the
  existing `try`, so `HttpRequestException`/`TaskCanceledException` map to `null` like other
  failures (the registry's `OpenAsync` call sits outside its own `try`).
- `FontRegistry.LoadAsync` passes the definition. Nothing else in the render path changes.

### Service and API

- `IFontService` / `FontService`:
  - `RegisterWebFontAsync(RegisterWebFontRequest, ct)` → `WebFontRegistrationResult(Fonts, Errors)`.
    Validate provider, family (`^[A-Za-z0-9 \-]{1,80}$`), weights ⊂ {100..900 step 100}, cap at
    18 variants. For Google/Bunny, per weight (× italic when ticked): resolve → dedup on
    `(Provider, ProviderFamily, Weight, IsItalic)` *or* identical `SourceUrl` → `GetBytesAsync`
    (primes the cache) → existing `Describe(bytes)` used only as "is this really a font" →
    `Insert` with **`FamilyName = ProviderFamily`, `Weight`/`IsItalic` as requested** (Google's
    instanced files name themselves inconsistently, so `WeightOf` is not trusted here),
    `SourceKind = Url`, `ContentHash = Hash(bytes)` → `Notify(key)`. For `direct`: one row,
    family/weight/italic from `Describe` exactly as uploads do; no weight checkboxes offered.
  - `RefreshAsync(key, ct)`: 404 if unknown, error if not a `url` row; google/bunny re-resolve
    (gstatic paths carry a version segment), re-download, update `SourceUrl`/`ContentHash`,
    delete the old local cache file, `Notify(key)`. The existing `DynamicImagesCacheRefresher`
    clears the key on every server; their next load misses the new hash and downloads.
  - `GetFileAsync`: replace the hard-coded `font/ttf` with a magic-byte sniff (`wOF2`, `wOFF`,
    `OTTO`, else ttf) since Bunny rows serve woff2 bytes to the designer.
- `Api/Models/ApiModels.cs`: `FontResponse` gains `Provider`, `SourceUrl`, `ProviderFamily`;
  `SourceKind` via a switch including `"url"`. New records `RegisterWebFontRequest(Provider, Family, Weights, IncludeItalic, Url)`
  and `RegisterWebFontResponse(Fonts, Errors)`.
- `FontsController`: `POST fonts/register-web` → 200 with the response when at least one row
  was created, 400 (ProblemDetails listing the errors) when none; `POST fonts/{key}/refresh` →
  200 `FontResponse` / 404 / 400.
- `Composing/DynamicImagesComposer.cs`: `AddHttpClient(name, (sp, client) => …)` reading
  `IOptionsMonitor<DynamicImagesOptions>` for timeout and buffer cap; singletons for
  `IFontCacheRoot`, `IRemoteFontFetcher`, `IWebFontResolver`. Client name in `DynamicImagesConstants`.
- `HealthService`: for each `url` font, `fileProvider.OpenAsync` (a cached font costs no
  network) → `FontUnreachable` warning naming family, provider and URL. Health is on-demand from
  the dashboard, so a network call is acceptable there; `TemplateValidator` stays key-only.

### Backoffice client (`src/DynamicImages/Client`)

- `api/types.ts`: `DiFont.sourceKind: "media" | "path" | "url"`, `provider?`, `sourceUrl?`,
  `providerFamily?`; `DiWebFontProvider = "google" | "bunny" | "direct"`; request/response shapes.
- `api/dynamic-images-api.ts`: `registerWebFont(request, getToken)`, `refreshFont(key, getToken)`.
- `modals/di-font-upload-modal.element.ts`: third `uui-box` "Use a web font": provider
  `uui-select`; Google/Bunny → family `uui-input`, weight checkbox row 100–900 (400 pre-ticked),
  "include italic" toggle; Direct → URL input only, hint "static .ttf/.otf/.woff2 files only".
  Submit → `registerWebFont`; per-variant errors shown in the error line; the modal closes as
  `uploaded: true` when at least one row was created. Bunny hint: Latin subset only.
- `dashboards/di-fonts-dashboard.element.ts`: meta line `Google Fonts · Inter` /
  `Bunny Fonts · Inter` / the direct host; a **Refresh** button for `url` fonts calling
  `refreshFont`, then `forgetFont(key)` (the loader is keyed by font key, not hash) and reload;
  empty-state copy mentions web fonts.
- Rebuild (`npm run build`) so the committed `wwwroot/App_Plugins/DynamicImages/dynamic-images.js`
  is updated; the release workflow has no npm step.

### Docs

- `README.md`: "Add a font" step (line ~27) mentions web fonts; new **Web fonts** subsection
  (providers, per-variant rows, Bunny Latin-only, static files only for direct URLs, cache
  location `umbraco/Data/TEMP/DynamicImages/Fonts`, the `WebFonts` options, Cloud caveat:
  per-instance cache and outbound HTTPS at publish time); config table + Umbraco Cloud section.
- `CHANGELOG.md` → Unreleased / Added (web fonts) and Fixed (registry caching a cancelled load).

## Files

New:
- `src/DynamicImages/Core/Fonts/Remote/FontFaceCssParser.cs`, `WebFontProviders.cs`,
  `IWebFontResolver.cs`, `WebFontResolver.cs`, `IRemoteFontFetcher.cs`, `RemoteFontFetcher.cs`,
  `IFontCacheRoot.cs`, `HostingFontCacheRoot.cs`
- `src/DynamicImages/Configuration/WebFontOptions.cs` (or inside `DynamicImagesOptions.cs`)
- `src/DynamicImages/Migrations/AddWebFontColumns.cs`
- `test/DynamicImages.Tests/FontFaceCssParserTests.cs`, `WebFontProvidersTests.cs`, `RemoteFontFetcherTests.cs`

Modified:
- `src/DynamicImages/Core/Fonts/FontRegistry.cs`, `IFontFileProvider.cs`, `FontFileProvider.cs`
- `src/DynamicImages/Core/Models/ImageSource.cs`, `FontDefinition.cs`
- `src/DynamicImages/Persistence/Dtos/FontDto.cs`, `Persistence/FontRepository.cs`
- `src/DynamicImages/Migrations/DynamicImagesMigrationComponent.cs`
- `src/DynamicImages/Configuration/DynamicImagesOptions.cs`, `DynamicImagesConstants.cs`
- `src/DynamicImages/Core/Services/IFontService.cs`, `FontService.cs`, `HealthService.cs`, `TemplateValidator.cs`
- `src/DynamicImages/Api/Controllers/FontsController.cs`, `Api/Models/ApiModels.cs`
- `src/DynamicImages/Composing/DynamicImagesComposer.cs`
- `src/DynamicImages/Client/src/api/types.ts`, `api/dynamic-images-api.ts`,
  `modals/di-font-upload-modal.element.ts`, `dashboards/di-fonts-dashboard.element.ts`
- `src/DynamicImages/README.md`, `CHANGELOG.md`

Reused as-is: `FontService.Describe`/`Hash`/`Notify`, `FontRegistry`'s `Lazy<Task>` cache and
`Clear(key)`, `DynamicImagesCacheRefresher` (font payloads already clear one key everywhere),
`GET fonts/{key}/file` + `font-face-loader.ts`, `WebRootPathTests`' stub-environment test style.

## Implementation order

1. `FontRegistry` cancellation/failure fix (independent, ships even alone).
2. Model + DTO (nullable columns) + repository mapping + migration step; validator guard.
3. `WebFontOptions`; `FontFaceCssParser` + `WebFontProviders` with tests (Google fixture, Bunny
   multi-subset fixture, Bunny error comment, URL building, slugging, host allowlist,
   direct-URL rejections).
4. `IFontCacheRoot`, `RemoteFontFetcher` + tests with a stub `HttpMessageHandler` and a temp
   dir (miss then hit, oversize, hash-mismatch warning, atomic write); `WebFontResolver`.
5. `IFontFileProvider.OpenAsync(FontDefinition)` + true-async `Url` branch; update callers.
6. `FontService.RegisterWebFontAsync`/`RefreshAsync`, content-type sniff, API models,
   controller, composer wiring.
7. Health `FontUnreachable`.
8. Client types, API helpers, modal, dashboard; `npm run typecheck && npm test && npm run build`.
9. README + CHANGELOG.

## Verification

`dotnet` is not installed in this session's container, so the .NET steps run on the user's
machine or CI:

- `dotnet build src/DynamicImages.sln` and `dotnet test test/DynamicImages.Tests` (new parser,
  provider and fetcher tests plus the existing suite).
- `cd src/DynamicImages/Client && npm ci && npm run typecheck && npm test && npm run build`.
- Manual, against `src/DynamicImages.TestSite.Clean` (`dotnet run`, grant the section). Its
  three families (Bricolage Grotesque, Hanken Grotesk) and Inter are all on Google Fonts:
  1. Fonts → Add a font → Web font → Google Fonts, `Inter`, tick 400 + 700 → two rows,
     specimens render in Inter, meta reads "Google Fonts · Inter · weight 700".
  2. Unknown family → clear error; Google `Lobster` 700 → "no weight 700"; Bunny
     `notarealfont` → the API's own error text; Bunny `inter` 700 → renders (woff2).
  3. Put a Google font on the Clean Bean Cafe template's title layer, Preview & test → renders;
     publish an article → the generated image uses it; `umbraco/Data/TEMP/DynamicImages/Fonts/`
     holds one `{hash}.bin` per fetched font.
  4. Delete the cache folder, publish again → re-fetched transparently.
  5. Start a preview and abort it immediately (drag while a fresh font loads) → the next
     preview still renders the font (the registry no longer caches the cancelled load).
  6. Refresh on a row → specimen still renders, old cache file gone, hash updated if the
     provider changed the file.
  7. Health dashboard with a bogus direct URL font (and `WebFonts:TimeoutSeconds` = 1) →
     `FontUnreachable` warning.
  8. Existing uploaded and `wwwroot` fonts still list, render, refresh-disabled and delete as
     before; a template JSON export/import round-trips a `url` font key unchanged.
