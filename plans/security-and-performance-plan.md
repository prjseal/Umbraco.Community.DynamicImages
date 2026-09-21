# Security and performance hardening for Dynamic Images

## Context

A review of the `src/DynamicImages` package (server and client; the test sites, uSync companion
package and their credentials were out of scope, though one uSync interaction is noted where it
weakens a server-side check). The client bundle came out clean: no `innerHTML`/`unsafeHTML`, object
URLs are revoked, previews are debounced and aborted, the bearer token is only ever sent to the
package's own `/umbraco/management/api/v1/dynamic-images` routes. Everything below is server side.

Findings, in the order the plan fixes them. Severity is relative to the package's threat model:
every endpoint already requires a signed-in backoffice user, so "attacker" means a backoffice user
with the Content section (S1, S4) or the Dynamic Images section (S2, S3), or a third party who
controls a host a font is fetched from (S2).

### Security

| # | Sev | Finding | Where |
|---|---|---|---|
| S1 | High | `POST documents/{key}/regenerate` checks only "has the Content section". Any editor can regenerate **any** document by key, ignoring start nodes and node permissions. The service then calls `contentService.Publish(content, ["*"])` as the super user: it publishes **every culture and any pending draft edits** on that node, attributed to "System" in the audit log. Bulk regeneration has the same publish side effect for administrators. | `Security/RegenerateHandler.cs`, `Api/Controllers/DocumentRegenerationController.cs`, `Core/Services/RegenerationService.cs:65-72` |
| S2 | Medium | Web-font fetching is an SSRF and supply-chain surface. (a) The named `HttpClient` follows up to 5 redirects to any scheme or host, so the `https`/host/IP checks in `WebFontProviders.ValidateDirectUrl` and `WebFontProvider.AllowsFileUrl` are bypassed by a `302`. (b) Nothing resolves the host name before connecting: `metadata.google.internal`, `169.254.169.254.nip.io` and DNS-rebinding hosts pass "has a dot, not an IP literal". (c) The checks run only at registration; `FontFileProvider.OpenUrlAsync` fetches whatever absolute URI is in the row, and `IFontService.Upsert` (uSync import) writes rows unvalidated. (d) On a hash mismatch `RemoteFontFetcher` only warns, then caches the bytes, parses them with SixLabors.Fonts on the server and serves them to every designer's browser via `fonts/{key}/file`. (e) Upstream status codes are echoed to the caller (`'{url}' answered 404`), a host/port oracle. | `Composing/DynamicImagesComposer.cs:90-97`, `Core/Fonts/Remote/RemoteFontFetcher.cs`, `Core/Fonts/Remote/WebFontProviders.cs:69-91`, `Core/Fonts/FontFileProvider.cs:61-66` |
| S3 | Medium | Unbounded render work. `POST preview` renders the posted template **without validation**; `DynamicImageRenderer` clamps the canvas only to `>= 1`. A `30000×30000` canvas is a 3.6 GB allocation and takes the process down. Layer sizes, image overlay sizes (`Resize` to any size, then `Rotate` grows it), font sizes, badge counts and layer counts are all unbounded too, and there is no cap on concurrent renders. The validator's 8000 px cap only applies on save and still allows 256 MB per render. | `Api/Controllers/PreviewController.cs`, `Core/Rendering/DynamicImageRenderer.cs:19-22`, `Core/Services/TemplateValidator.cs:57-63`, `Core/Rendering/Layers/ImageLayerRenderer.cs:25-33` |
| S4 | Medium | Regeneration overwrites **whatever image the target property points at**, in place. If an editor hand-picked a shared image (a hero, a logo) in the OG property, "Regenerate" replaces that media item's file site-wide. The only guard is "is it an Image". | `Core/Media/DynamicImageMediaWriter.cs:36-58`, `Core/Services/RegenerationService.cs:37-61`, `NotificationHandlers/DynamicImagesNotificationHandler.cs:55-57` |
| S5 | Low | Previewing with a `contentKey` resolves and returns the draft text of any node (`ResolvedText`), and `document-types/{alias}/content` lists every node of a type, regardless of the caller's start nodes. Section users are trusted designers, so this is recorded and given a cheap fix rather than treated as urgent. | `Api/Controllers/PreviewController.cs:109-121`, `Api/Controllers/DocumentTypesController.cs:79-112` |
| S6 | Low | Raw exception text reaches the client: `ex.Message` in the preview 400s, in job failure lists and in sync messages (IO exceptions carry full server paths). Also `skip < 0` on the sample-content endpoint produces a negative page index and a 500. | `PreviewController.cs:65-69,102-106`, `RegenerationController.cs:143,156`, `SyncService.cs:49,102`, `DocumentTypesController.cs:91-92` |

### Performance

| # | Sev | Finding | Where |
|---|---|---|---|
| P1 | High | **Every manual regeneration renders twice.** `RegenerationService` sets the property then calls `Publish`, which raises `ContentPublishingNotification`, which `DynamicImagesNotificationHandler` handles by rendering and writing the media again (whenever the template has `OnPublish` and not `OnlyWhenEmpty`). Bulk regeneration of N documents is 2N renders and 2N media saves. | `Core/Services/RegenerationService.cs:63-73`, `NotificationHandlers/DynamicImagesNotificationHandler.cs:36-63` |
| P2 | Medium | `TextFitting.TrimToLines` drops one word at a time and re-lays-out the whole string each step: O(words²) glyph layout. A rich-text body bound to a text layer with `MaxLines` (a 5,000-word article) costs tens of millions of glyph placements per render, on every publish and every designer keystroke. `Shrink` re-measures the full text once per point of size on top. | `Core/Rendering/TextFitting.cs:49-88` |
| P3 | Medium | `GET templates/{key}/usage` walks **every** document the template covers and does `contentService.GetById` + `mediaService.GetById` per document (2N queries), even though it returns at most `take`. 5,000 articles is 10,000 queries per open of the Usage tab. | `Api/Controllers/RegenerationController.cs:68-95` |
| P4 | Medium | `POST preview/layout` renders a full canvas (allocation, base image decode, every layer drawn) just to read the bounds, and the designer calls it alongside `preview` on every debounced change: two full renders per edit. Every built-in renderer already implements a pixel-free `MeasureAsync`. | `Core/Rendering/DynamicImageRenderer.cs:95-102` |
| P5 | Low | `FontMediaChangedHandler` queries the fonts table on **every** media save and delete anywhere in the site (each image upload, each crop). | `NotificationHandlers/FontMediaChangedHandler.cs:23-36` |
| P6 | Low | Sync-over-async in request paths: `dataTypeService.GetAsync(...).GetAwaiter().GetResult()` once per property in `document-types/{alias}/properties` and per doc type in `TemplateValidator.IsMediaPicker` (which runs on every save, every layout call and every health check). Blocks thread-pool threads and issues N sequential queries. | `Api/Controllers/DocumentTypesController.cs:51`, `Core/Services/TemplateValidator.cs:212-217` |
| P7 | Low | Bulk regeneration jobs are unbounded: two clicks start two full-site jobs on the thread pool. `RegenerationJob.Failures` is a plain `List<string>` appended from the job thread and `ToList()`-ed from the polling request, so a poll can throw mid-run; counters are unsynchronised. | `Api/Controllers/RegenerationController.cs:26-47,97-162`, `Core/Services/IRegenerationJobStore.cs` |
| P8 | Low | Optimistic concurrency on template save is a read-then-write with no database condition, so two saves carrying the same `UpdatedUtc` can both succeed. | `Persistence/TemplateRepository.cs:66-97` |

Not findings (checked and fine): `WebRootPath` traversal handling and its tests; the alias regex that keeps sync file names safe; NPoco parameterised SQL throughout; `JsonUnknownDerivedTypeHandling.FailSerialization` on the layer union; the 10 MB upload cap and magic-byte content type; media type fallback on upload; `ColourParser`; `HtmlText` and `ReadingTime` regexes (linear); relative-layout cycle detection.

## Design

### S1 — authorise per node, publish only what the editor could publish

`Api/Controllers/DocumentRegenerationController.cs`
- Inject `IAuthorizationService` and `IBackOfficeSecurityAccessor`.
- Before calling the service: `await authorizationService.AuthorizeResourceAsync(User, ContentPermissionResource.WithKeys(ActionUpdate.ActionLetter, key), AuthorizationPolicies.ContentPermissionByResource)`; on failure return the base class's `Forbidden()`. This also covers start nodes because Umbraco's `ContentPermissionHandler` checks the node path. It is the same call Umbraco's own `UpdateDocumentControllerBase` makes.
  API facts, verified against Umbraco 17.0.0 (NuGet XML docs in this container and the `release-17.0.0` source): `ContentPermissionResource` is in `Umbraco.Cms.Core.Security.Authorization` (Umbraco.Core), its factories take **`string`** permissions (`WithKeys(string, Guid)`, `WithKeys(ISet<string>, IEnumerable<Guid>)`); `ActionUpdate.ActionLetter`/`ActionPublish.ActionLetter`/`ActionBrowse.ActionLetter` are the strings `"Umb.Document.Update"`, `"Umb.Document.Publish"`, `"Umb.Document.Read"` (`Umbraco.Cms.Core.Actions`); `AuthorizeResourceAsync(this IAuthorizationService, ClaimsPrincipal, IPermissionResource, string)` is in `Umbraco.Extensions` (Umbraco.Cms.Api.Management); the policy constant is `Umbraco.Cms.Web.Common.Authorization.AuthorizationPolicies.ContentPermissionByResource`; `ManagementApiControllerBase` provides `Forbidden()`, `CurrentUserKey(...)` and `CurrentUser(...)`.
- Pass the current user's id into the service (`RegenerateDocumentAsync(key, template: null, force: true, userId, ct)`).

`Core/Services/RegenerationService.cs` (+ `IRegenerationService`)
- New optional `int? userId` parameter; forwarded to `contentService.Save(content, userId)` (`Save(IContent, int? userId = null, ContentScheduleCollection? = null)`) / `Publish(content, cultures, userId)` (`Publish(IContent, string[] cultures, int userId = SuperUserId)`) so the audit trail names the editor (`CurrentUser(backOfficeSecurityAccessor).Id`). Bulk jobs pass the user who started the job (captured in the controller before `Task.Run`). There is no `SavePublished` in 17; save-then-publish is the API.
- **Never publish pending edits.** Replace the `Published ? Publish : Save` branch with:
  - `!content.Published` → `Save` (unchanged).
  - `content.Published && !content.Edited` → `Publish` (the only change on the node is the image; this is the current behaviour for the common case).
  - `content.Published && content.Edited` → `Save` only, and return outcome `GeneratedDraft` with message "The image was saved to the draft. Publish the page to make it live." The controller maps it to 200 like `Generated`; the client shows the message (it already displays `message`).
- For the publish branch, the single-document endpoint additionally requires `ActionPublish.ActionLetter` on the node (second `AuthorizeResourceAsync` in the controller when `content.Published`); if the editor has Update but not Publish, fall through to the save-only branch rather than 403 — the deliverable is a draft they are allowed to make. Implement by passing an `allowPublish: bool` into the service call.
- Culture: keep `["*"]` (the endpoint already ignores `culture`); note it in the API doc comment.

`Api/Models/ApiModels.cs`: nothing new; `RegenerateDocumentResponse.Outcome` already carries the enum name.

`Client/src/property-actions/regenerate.property-action.ts` and `entity-actions/regenerate-document.action.ts`: surface `message` for the `generateddraft` outcome (they already surface `message` on other outcomes — confirm and reuse).

README `## Permissions`: document that regeneration now requires Update permission on the node (and Publish to go live), and the draft behaviour.

### S2 — make font fetching safe by construction

`Composing/DynamicImagesComposer.cs`
- Replace `HttpClientHandler { MaxAutomaticRedirections = 5 }` with a `SocketsHttpHandler`:
  - `AllowAutoRedirect = false` — a redirect is an error ("`{url}` redirects; enter the final file URL"). Google and Bunny serve files without redirects (verified in `plans/web-fonts-plan.md`); a direct URL has to be the file.
  - `ConnectCallback` that resolves the host with `Dns.GetHostAddressesAsync`, rejects any address that is loopback, link-local, multicast, `0.0.0.0`, `::`, RFC 1918 or `fc00::/7` (new `Core/Fonts/Remote/PublicAddressGuard.cs`, pure and unit-tested), then connects to the first acceptable address. Resolving inside the connect callback is what closes the rebinding window: the address that was checked is the address that is dialled.
  - Keep `MaxResponseContentBufferSize` and the timeout as they are.

`Core/Fonts/Remote/RemoteFontFetcher.cs`
- Validate the URL at fetch time, for every caller: `https` only, no user-info, DNS host with a dot (reuse `WebFontProviders.ValidateDirectUrl`), and for a row whose `Provider` is google/bunny the host must be that provider's `FileHost`. `GetBytesAsync` gains the `FontDefinition` (or provider name) so it can apply the host rule. A failing URL returns `null`/throws a typed `FontFetchException` that `FontFileProvider` maps to null as today.
- **Integrity:** when `expectedHash` is set and the downloaded bytes do not match, do **not** cache and do **not** return them; log a warning and return null. `RefreshAsync` is the only path that fetches with `expectedHash: null` and is therefore the only way a changed file gets in, which is what the existing comment says the intent is. `HealthService` reports the mismatch as a new `FontChanged` warning ("the file at … has changed since it was registered; refresh the font to accept the new file").
- Error messages: `FontService.FetchAsync` stops echoing the upstream status code for direct URLs; say "could not be downloaded" and log the status server-side. Keep the provider-specific 400 message for Google/Bunny (their hosts are fixed, so it leaks nothing).

`Core/Services/FontService.Upsert`: run `ValidateDirectUrl` / `IsPathSafe` on the incoming row and reject (throw `ArgumentException`) rather than insert — the uSync serializer already surfaces exceptions per item.

`Core/Fonts/Remote/WebFontProviders.ValidateDirectUrl`: also reject a `.local`/`.internal`/`.localhost` suffix host and a port other than 443. Cheap, and it gives a readable error before the connect callback would refuse anyway.

### S3 — bound every render

New `Core/Rendering/RenderLimits.cs` (static, documented constants; a later change can make them options):
- `MaxCanvasSide = 4096`, `MaxCanvasPixels = 8_000_000` (a 4096×1953 or 2828×2828 canvas; OG images are 1200×630).
- `MaxLayers = 100`, `MaxFontSize = 512`, `MaxBadgeItems = 50`, `MaxOverlaySide = 2 × canvas side` (an image layer larger than that is clamped, not rejected), `MaxTextLength = 2_000` characters after resolution (shared with P2).
- `MaxConcurrentRenders = Environment.ProcessorCount` and a `RenderGate` (`SemaphoreSlim`) singleton.

`Core/Rendering/DynamicImageRenderer.RenderAsync`
- Check the canvas against the limits first and throw `RenderLimitException` (new, carries a readable message). `PreviewController` maps it to 400 with that message; the publish handler and regeneration already catch and log.
- Acquire the `RenderGate` for the duration of the render (`WaitAsync(cancellationToken)`), so N concurrent previews queue rather than allocate N canvases.
- `ImageLayerRenderer`: clamp the requested overlay size to `MaxOverlaySide` before `Resize`; skip the layer with a `TooLarge` reason if the source image itself is bigger than `MaxCanvasPixels × 4` after `Identify` (a decoded 20k×20k base image is the same problem as a huge canvas). `TextLayerRenderer`/`BadgesLayerRenderer`: clamp `FontSize` to `MaxFontSize` and `MaxItems` to `MaxBadgeItems`.

`Core/Services/TemplateValidator`: lower `CanvasSizeInvalid` to the same constants so the designer and the renderer agree; add `TooManyLayers` (error) and `FontSizeTooLarge`, `TooManyBadges` (warnings that say what will be clamped).

`Api/Controllers/PreviewController`: no structural change; the limits live in the renderer so every caller gets them. Add `[RequestSizeLimit(2 MB)]` on the two preview actions and on `templates` create/update/import — a template document is kilobytes.

### S4 — only replace media this package created

Use an Umbraco relation as the ownership marker; it survives renames, moves and folder changes and shows up in the media item's References.

`Migrations/EnsureGeneratedImageRelationType.cs` (new step `dynamicimages-relationtype-v1` in `DynamicImagesMigrationComponent`): if `relationService.GetRelationTypeByAlias("dynamicImagesGeneratedImage")` is null, `Save(new RelationType("Dynamic Images generated image", "dynamicImagesGeneratedImage", isBidrectional: false, Constants.ObjectTypes.Document, Constants.ObjectTypes.Media, isDependency: false))` (verified 17.0.0 constructor; the parameter really is spelt `isBidrectional`). Not a dependency, so deleting the content does not block on it.

`Core/Media/DynamicImageMediaWriter.WriteAsync`
- Inject `IRelationService`. Replace in place **only if** `relationService.AreRelated(content, media, "dynamicImagesGeneratedImage")` (the `(IUmbracoEntity, IUmbracoEntity, string)` overload). Otherwise create a new media item (in the output folder) and relate it. The existing type check stays.
- After a create, `relationService.Relate(content, media, "dynamicImagesGeneratedImage")` — the media item has an id only after `mediaService.Save`, so relate after the save. The writer needs the content entity: change the signature to take `IContent content` instead of `string contentName` (both callers have it). Note the publish handler runs inside the publishing scope, where the content already has an id (it is an update; a first publish of a brand-new node also has an id by the time `Publishing` fires because the save has happened).
- Upgrade path: images generated before this change have no relation. So that the first regeneration after upgrading does not orphan them, accept a legacy match as well: the existing media item's parent is the template's output folder (or root when unset) **and** its name equals `BuildName(template, content.Name)`. Relate it on that first write, after which the relation is authoritative.
- `RegenerationService` and `DynamicImagesNotificationHandler` pass the `IContent`; nothing else changes for them. `SkippedExisting`/`OnlyWhenEmpty` logic keeps using "is there a valid media item" — a hand-picked image still counts as "not empty", which is the right answer.

### S5 — cheap browse check on content lookups

`PreviewController.ResolveValues` and `DocumentTypesController.GetContent`: when a content key is supplied, `AuthorizeResourceAsync(User, ContentPermissionResource.WithKeys(ActionBrowse.ActionLetter, key), ContentPermissionByResource)`; a failure falls back to sample data (preview) or 403 (content list is a list, so filter is not practical; instead scope the paged query by the user's start nodes using `contentService` with `IUser.CalculateContentStartNodeIds` — if that turns out to be more than ~20 lines, leave the list as is and record it in the README's permissions table).

### S6 — error hygiene

- `PreviewController`: return `RenderLimitException.Message` and `OperationCanceled` as today; for any other exception log at Warning with the exception and return a fixed detail ("The preview could not be rendered. See the log for details."). `ArgumentException`/`InvalidOperationException` from bad template data keep their message (they are written for editors).
- `RegenerationController.RunJobAsync`: job failure entries use `result.Message` (already editor-facing) and, for the catch-all, a fixed string; the exception goes to the log.
- `SyncService`: messages use `Path.GetFileName(file)` and a fixed "could not be written/read"; the exception goes to the log (already does).
- `DocumentTypesController.GetContent`: `skip = Math.Max(0, skip)`.

### P1 — do not re-render inside the publish a regeneration triggers

New `Core/Services/RegenerationScope.cs`: `internal static class` with an `AsyncLocal<bool> IsActive` and a `Begin()` returning an `IDisposable` that resets it. `RegenerationService` wraps the `Save`/`Publish` call in `using (RegenerationScope.Begin())`. `DynamicImagesNotificationHandler.HandleAsync` returns immediately when `RegenerationScope.IsActive`. `AsyncLocal` is correct here because `Publish` is synchronous on the same logical call stack. Add a unit test that the handler is a no-op inside the scope.

### P2 — cap and binary-search text fitting

`Core/Rendering/TextFitting`
- `Fit`: truncate `text` to `RenderLimits.MaxTextLength` characters (on a word boundary) before anything else; nothing longer can be drawn on a canvas the size limits allow, and the ellipsis path already exists.
- `TrimToLines`: line count is monotonic in word count, so binary-search the largest `count` whose `CountLines(...) <= maxLines` (log₂ N layouts instead of N). Keep the "at least one word" floor and the ellipsis suffix rule.
- `Shrink`: unchanged in shape (bounded by 40% of the size), but it now runs on capped text.
- Tests: extend `TextFittingTests` with a 5,000-word input and assert the number of `CountLines` calls through a counting wrapper (or just a wall-clock budget under 200 ms) and identical output to the linear version on the existing cases.

### P3 — page the usage query

`RegenerationController.GetUsage`: replace the "collect every key, then GetById each" loop with a direct `contentService.GetPagedOfType(contentType.Id, page, pageSize, out total, filter)` per doc type (the same call `FindDocuments` uses; the `filter` parameter is non-nullable in 17.0.0, so pass `scopeProvider.CreateQuery<IContent>()` as the existing code does), read `content.GetValue<string>(template.TargetPropertyAlias)` off the paged entity (no second load), collect the media keys of the page and resolve their existence with one `mediaService.GetByIds(IEnumerable<Guid>)`. `withImage` becomes "with image on this page"; rename the field to `WithImageOnPage` (the client's usage view shows the count — update `di-usage-view.element.ts` and `types.ts`) or keep the total by a single `COUNT` over the property value — the paged approach is enough and honest. Accept `skip`/`take` like the sample-content endpoint. `FindDocuments` (bulk jobs) keeps its full walk; it needs every key.

### P4 — measure without pixels

`DynamicImageRenderer.MeasureLayoutAsync`: build the `LayerRenderContext`, run `MeasureReferencesAsync` as now, then for each layer in z-order apply `NotDrawnReason`, call `renderer.MeasureAsync(layer, context)` and record bounds/skips — no `CreateCanvas`, no base image. The default `ILayerRenderer.MeasureAsync` (scratch render) still covers third-party renderers. `RendererTests` already compare `MeasureAsync` bounds against `RenderAsync` bounds for the built-ins; extend to the layout entry point so the two cannot drift.

### P5 — cheap filter before the fonts query

`FontMediaChangedHandler.Invalidate`: return early unless at least one entity's `ContentType.Alias` is `dynamicImagesFont` or `File`. Fonts are only ever those two types (upload picks the package type or falls back to File).

### P6 — no sync-over-async, one data-type lookup

- `DocumentTypesController.GetProperties` becomes `async Task<IActionResult>`; collect the distinct `DataTypeKey`s and resolve them once with `dataTypeService.GetAllAsync(params Guid[] keys)` (confirmed in 17.0.0), then map from a dictionary.
- `TemplateValidator.IsMediaPicker` becomes `IsMediaPickerAsync`, called from an `async` `ValidateDocTypesAndTarget`; `ValidateAsync` is already async.

### P7 — one job per template, thread-safe progress

- `IRegenerationJobStore.Create` returns null (controller → 409 "A regeneration of this template is already running") when a job for the same template is `Queued`/`Running`; cap total running jobs at 2 (409 beyond that).
- `RegenerationJob`: counters via `Interlocked`; `Failures` becomes a `ConcurrentQueue<string>` (or lock) and `JobResponse.From` snapshots it.
- `RunJobAsync`: replace `Task.Run` with the same but pass the user id (S1) and wrap in the `RenderGate` per document (S3 already does this inside the renderer).

### P8 — conditional update

`TemplateRepository.Update`: when `expectedUpdatedUtc` is given, issue `UPDATE … WHERE [key] = @0 AND updatedUtc BETWEEN @expected-1s AND @expected+1s` and treat 0 rows as the conflict; drop the read-then-compare.

## Files

New
- `src/DynamicImages/Core/Fonts/Remote/PublicAddressGuard.cs` — IP-range rules used by the connect callback (S2)
- `src/DynamicImages/Core/Rendering/RenderLimits.cs`, `RenderLimitException.cs`, `RenderGate.cs` (S3)
- `src/DynamicImages/Migrations/EnsureGeneratedImageRelationType.cs` (S4)
- `src/DynamicImages/Core/Services/RegenerationScope.cs` (P1)
- Tests: `PublicAddressGuardTests.cs`, `RenderLimitsTests.cs` (renderer rejects an oversize canvas, clamps an oversize overlay), `RegenerationScopeTests.cs`, `RemoteFontFetcherTests` additions (redirect refused, mismatch not served/cached, non-https/provider-host refused), `TextFittingTests` additions (P2), `TemplateRepository` conflict test if the in-memory scope fakes in `USyncSerializerFakes.cs` stretch to it (otherwise skip; P8 is verified by E2E)

Modified
- `Composing/DynamicImagesComposer.cs` (S2 handler, S3 gate registration, S4 relation service is core)
- `Core/Fonts/Remote/RemoteFontFetcher.cs`, `IRemoteFontFetcher.cs`, `WebFontProviders.cs`, `Core/Fonts/FontFileProvider.cs`, `Core/Services/FontService.cs` (S2)
- `Core/Services/HealthService.cs` (S2 `FontChanged`)
- `Core/Rendering/DynamicImageRenderer.cs`, `Layers/ImageLayerRenderer.cs`, `Layers/TextLayerRenderer.cs`, `Layers/BadgesLayerRenderer.cs`, `TextFitting.cs` (S3, P2, P4)
- `Core/Services/TemplateValidator.cs` (S3 limits, P6)
- `Core/Services/RegenerationService.cs`, `IRegenerationService.cs`, `IRegenerationJobStore.cs`, `RegenerationJobStore.cs` (S1, P1, P7)
- `Core/Media/DynamicImageMediaWriter.cs`, `IDynamicImageMediaWriter.cs` (S4)
- `NotificationHandlers/DynamicImagesNotificationHandler.cs` (S4 signature, P1), `FontMediaChangedHandler.cs` (P5)
- `Api/Controllers/DocumentRegenerationController.cs`, `RegenerationController.cs`, `PreviewController.cs`, `DocumentTypesController.cs`, `TemplatesController.cs` (S1, S3, S5, S6, P3, P6, P7)
- `Api/Models/ApiModels.cs` (usage response shape, P3)
- `Persistence/TemplateRepository.cs` (P8)
- `Migrations/DynamicImagesMigrationComponent.cs` (S4 step)
- `Client/src/api/types.ts`, `Client/src/workspace/views/di-usage-view.element.ts` (P3), regenerate actions (S1 message) — then rebuild the bundle
- `src/DynamicImages/README.md` — permissions table (S1), web font security notes (S2: no redirects, public hosts only, refresh accepts a changed file), render limits (S3), "images this package created are the only ones it overwrites" (S4)
- `src/DynamicImages/CHANGELOG.md`

Reused as-is
- `WebRootPath` (path checks), `FontHash`, `WebFontProviders.ValidateDirectUrl` (extended, not replaced), `RelativeLayout`, `MediaSource`, the `RemoteFontFetcherTests` stub handler/factory/cache-root, `TemplateValidatorTests.NeverCalled` proxy.

## What was built differently

The plan was followed as written except for the points below, each of which the code forced. They
are recorded here so this document still describes what exists.

- **S1** — `RegenerateDocumentAsync` gained `userId` *and* `allowPublish`, both optional, rather
  than only `userId`. The publish permission is evaluated in the controller for every call rather
  than only when the node is published, which avoids loading the content twice.
- **S2** — `IRemoteFontFetcher.GetBytesAsync` returns `byte[]?` and takes the row's provider name
  rather than the whole `FontDefinition`: a changed file is the font being *unavailable*, not an
  error a render should fail on, and the provider name is all the host rule needs. The refusals
  that are this package's own (a URL it may not fetch, a redirect) throw `FontFetchException`.
  The health check tells `FontUnreachable` from `FontChanged` with a second fetch, which is
  affordable on a check an editor explicitly asked for.
- **S3** — the overlay clamp is shared by `RenderAsync` and `MeasureAsync`, and the **clamped**
  box is what gets reported. Reporting the requested size would make a measured layer land
  somewhere other than where it draws, which relative positioning hangs off.
  `DynamicImageRenderer` takes the `RenderGate` as a constructor parameter rather than reaching
  for a static, so a test can supply its own.
- **S4** — reading the ownership relation is wrapped: a site part-way through the migration keeps
  generating images, falling back to "not ours" (a new media item) and never to someone else's
  file. A failure to *write* the marker after the image is saved is logged rather than thrown — it
  costs a new media item next time, where throwing would cost the editor their image.
- **S5** — done in full, but it moved the package's minimum Umbraco version.
  `IUser.CalculateContentStartNodeIds` is not part of the 17.0.0 surface the package was pinned
  to, and the fallbacks the plan allowed for were both bad: filtering the page in memory makes the
  reported total disagree with the rows, and leaving it meant the list kept naming nodes the
  caller cannot see. The user's call was to raise the floor to **17.5.3**, since everything below
  it has published security advisories anyway. On 17.5.3 the scoping is a single query:
  `IQuery<IContent>.WhereAny` ORs one "is this node, or under it" condition per start node, so the
  total stays exact. A user whose start nodes have all been deleted gets an impossible condition
  rather than no condition - "nothing to filter by" must not mean "show everything".
- **P1** — testing that the publish handler stands down inside `RegenerationScope` needs the test
  assembly to see an internal type, so the package has an `InternalsVisibleTo` for it rather than
  `RegenerationScope` becoming public API.
- **P3** — `IMediaService` has `GetByIds(IEnumerable<Guid>)`, as the plan expected. Paging across
  several document types is done by taking `skip + take` from each type and windowing the result,
  rather than by offsetting into each type, which would cost an extra query per type to learn its
  total. `WithImage` became `WithImageOnPage`, and the client's usage view says "of the N shown".
- **P7** — `IRegenerationJobStore.Create` returns a `JobCreateResult` carrying *why* it refused,
  rather than a bare null, so the controller can say whether the template is busy or the site is.
  The counters became methods (`CountProcessed`, `CountGenerated`, `CountSkipped`) over interlocked
  fields, since a property cannot be incremented atomically from outside.
- **P8** — the read above the update is kept. It supplies the row's id and `createdUtc`, and
  answers "no such template" separately from "someone else saved first"; the conditional `WHERE`
  is what makes the check atomic.

## Implementation order

1. Read this plan (`plans/security-and-performance-plan.md`); update it where the code forces a different choice.
2. S3 + P2 (limits, gate, text cap) — self-contained, unit-testable, and P1/S1 tests render.
3. P1 (`RegenerationScope`) — tiny, unblocks correct counts in later manual testing.
4. S1 (authorisation, draft-safe publish, user ids) with P7 (job store).
5. S4 (relations) — touches the same writer/service seams as S1; do it while they are open.
6. S2 (fetcher hardening) — independent of the above.
7. P3, P4, P5, P6, P8, S5, S6 — small, independent; one commit each.
8. README, CHANGELOG, client rebuild, full test run.

Each step is its own commit. (Implemented on `claude/security-performance-plan-hstcbj`, branched
from `main`; this plan file was brought onto it as step 1.)

## Verification

The .NET 10 SDK is already installed in this container at `$HOME/.dotnet` and the test project is restored (done during planning to verify the Umbraco 17 API surface); a fresh session installs it as CLAUDE.md describes. Then:

- `dotnet test test/DynamicImages.Tests` — all existing tests plus the new ones above. The key new assertions: an oversize canvas throws `RenderLimitException` before allocation; the fetcher refuses a 302, a non-https URL, a provider row pointing off-host, and a hash mismatch (and leaves no cache file); `PublicAddressGuard` rejects `127.0.0.1`, `10.0.0.1`, `169.254.169.254`, `::1`, `fd00::1` and accepts a public address; the publish handler is a no-op inside `RegenerationScope`; `TrimToLines` output is unchanged on existing cases and a 5,000-word input fits in well under a second; `MeasureLayoutAsync` bounds equal `RenderAsync` bounds for every built-in layer type.
- `cd src/DynamicImages/Client && npm ci && npm run typecheck && npm test && npm run test:browser && npm run build`, then `git diff --exit-code src/DynamicImages/wwwroot` is clean after committing the rebuilt bundle.
- E2E against the booted clean test site (CLAUDE.md §"Driving the backoffice"): `E2E_BASE_URL=https://localhost:44344 npm run test:e2e` still passes; then by hand or a new spec:
  - Regenerate a published article with no pending edits → media replaced in place, page still published, audit log names the editor.
  - Edit the article without publishing, regenerate → response outcome `generateddraft`, front end unchanged until publish.
  - Create a user group with Content section restricted to one start node; regenerate a node outside it → 403.
  - Hand-pick a shared image in the OG property, regenerate → a **new** media item is created and the shared image is untouched; regenerate again → that new item is replaced in place.
  - Post a preview with a 20000×20000 canvas → 400 with the limit message, memory flat.
  - Register a direct-URL font behind a local `302` → readable error; register one on a private host name → refused.
  - Bulk regenerate 20 articles with the template set to "on publish, always" → server log shows 20 renders, not 40; starting a second run while one is running → 409.
