# Backing up the Dynamic Images tables with uSync

## Context

Dynamic Images keeps its own data in two tables it creates itself — `DynamicImages_Template`
and `DynamicImages_Font` (`src/DynamicImages/DynamicImagesConstants.cs`, created by
`Migrations/CreateTemplatesTable.cs` and `CreateFontsTable.cs`). Nothing in Umbraco knows they
exist, so nothing backs them up: uSync moves document types, media, templates and dictionary
items between environments, and Dynamic Images' own designs are simply absent from the folder.
Grepping `src/DynamicImages.TestSite.Clean/uSync/v17/` for "DynamicImages" returns nothing.

What exists today instead is `Core/Services/SyncService.cs` — a hand-rolled export/import that
writes `{ContentRoot}/umbraco/DynamicImages/templates/{alias}.json` when someone presses a button
on the Health dashboard. It covers templates only, never fonts, has no report-before-import, no
per-item change detection, and no place in the uSync dashboard. Its own interface comment says an
`IServiceConnector` was "deferred to a later version". This plan replaces that gap with the
thing the ecosystem already understands: a pair of uSync handlers.

The immediate target is `src/DynamicImages.TestSite.Clean`, which runs **uSync 17.3.5** on
**Umbraco 17.7.0 / net10.0** with `uSync:Settings:ImportOnFirstBoot: true`
(`appsettings.Development.json`) and 192 committed items under `uSync/v17/`.

### Decisions made with the user

- **A new optional package**, `Umbraco.Community.DynamicImages.uSync`, built from a new project
  in this repo. The main package keeps its two-dependency footprint; uSync (MPL-2.0) never
  becomes a transitive dependency of Dynamic Images. This is how `uSync.Forms` and
  `uSync.Umbraco.Commerce` are shipped.
- **Templates and fonts both.** A text layer names its font by key (`TextStyle.FontKey`, "Key of
  a row in DynamicImages_Font"), so templates restored without fonts fail `TemplateValidator` on
  the next publish. The font handler gets the lower priority so its rows land first.
- **Export-on-save.** The main package publishes Umbraco `SavedNotification<T>` /
  `DeletedNotification<T>` for its own rows, which is precisely what uSync's base handler already
  subscribes to.

### What uSync actually does — verified against uSync 17.3.5 source and the cached assemblies

Read from `KevinJump/uSync` branch `v17/main` and from
`~/.nuget/packages/usync.backoffice/17.3.5/lib/net10.0/uSync.BackOffice.xml`.

- **There is an official helper library for exactly this: `uSync.Extend`.** It ships
  `SyncObjectHandler<TObject>` and `SyncObjectSerializer<TObject>` plus a worked `Example/`
  folder, and is on NuGet from **17.3.1** onwards (17.3.5 is the version matching the test site;
  it depends on `uSync.BackOffice` and `uSync.Core` 17.3.5, net10.0, MPL-2.0). It did not exist
  before 17.3.1, so most blog material predates it.
- `SyncHandlerRoot<TObject, TContainer>` has **no generic constraint**.
  `SyncHandlerBase<T>` / `SyncHandlerLevelBase<T>` both require `where TObject : IEntity` and are
  therefore unusable here. For a flat table the idiom is `SyncHandlerRoot<T, T>` — see
  `uSync.BackOffice/SyncHandlers/Handlers/WebhookHandler.cs`, a complete handler in five
  overrides. `SyncObjectHandler<T>` is that shape pre-written; it leaves `GetAllItems()` and
  `GetItemName()` for us.
- `SyncSerializerBase<T>` requires `IEntity` too, so serializers derive from
  **`SyncSerializerRoot<T>`** (`uSync.Core.Serialization`, unconstrained). Its abstract surface is
  `SerializeCoreAsync`, `DeserializeCoreAsync`, `FindItemAsync(Guid)`, `FindItemAsync(string)`,
  `SaveItemAsync`, `DeleteItemAsync`, `ItemAlias`, `ItemKey` — **all async in v15+**; the old
  synchronous `SerializeCore`/`Deserialize`/`FindItem(int)` names are gone.
- **`uSync.Extend`'s `SyncObjectSerializer<T>` is the wrong tool for our objects.** Its
  `SerializeCoreAsync` reflects over every property and writes `property.ToString()`, and
  `DeserializeCoreAsync` reads them back with `Convert.ChangeType`. `Template` carries
  `List<LayerBase> Layers`, `CanvasSettings`, `List<string> DocTypeAliases`; `FontDefinition`
  carries `List<FontStyleDefinition> Styles`. Those round-trip to type names and throw on import.
  We use its **handler** base and write our **own** serializers.
- **Both are auto-discovered.** `uSyncCoreBuilderExtensions` does
  `WithCollectionBuilder<SyncSerializerCollectionBuilder>().Add(builder.TypeLoader.GetTypes<ISyncSerializerBase>())`
  and `uSyncBackOfficeBuilderExtensions` the same for `ISyncHandler`. No composer registration.
  `SyncHandlerRoot`'s constructor throws `KeyNotFoundException("No Serializer found for handler …")`
  at boot if the matching serializer was not found.
- **Both attributes are mandatory and are read by reflection in the base constructors.**
  `[SyncHandler(alias, name, folder, priority)]` with named `Icon`, `EntityType`, `IsTwoPass`;
  `[SyncSerializer(guidString, name, itemType)]` where **`itemType` is the XML root element name**
  (`InitializeBaseNode` does `new XElement(ItemType, …)` and the default `IsValid` checks
  `node.Name.LocalName == ItemType`). The GUID is fixed forever once shipped.
- **A newly discovered handler is enabled by default.** `uSyncHandlerSetSettings.GetHandlerSettings(alias)`
  falls back to `HandlerDefaults` when the alias is absent from `Handlers`, and
  `HandlerDefaults.Enabled` is `true`. No configuration is needed in the test site.
- **`uSyncSettings.ExportOnSave` defaults to `"All"`**, and `SyncHandlerRoot.ShouldProcessEvent()`
  returns false unless `ExportOnSave` contains `"All"` or the handler's `Group`. It also returns
  false while `ISyncEventService.IsPaused`, **which is what stops an import from re-triggering an
  export** — no manual pause handling is needed.
- **Change detection is a hash of the XML.** `SyncSerializerRoot.IsCurrentAsync` re-serialises the
  live item, runs `CleanseNode` over both and compares `MakePlatformSafeHashAsync`. Any volatile
  field in the XML means every item reports as changed forever. `CreatedUtc`/`UpdatedUtc` must
  not reach the file — see "Timestamps" below.
- File naming: `UseFlatStructure` true and `GuidNames` false by default, so the file is
  `{ItemAlias(item).ToSafeFileName()}.config` under `{RootFolder}{Folder}/`. `RootFolder` is
  `uSync/v17/` on this line. Name clashes get a short key appended automatically.
- `uSyncConstants.Priorites.USYNC_RESERVED_UPPER` is **2000** (note uSync's own spelling,
  `Priorites`); core handlers occupy 1005–1250. Third parties go above 2000.

### The two gotchas that will cost a day each if they are not planned for

1. **Handlers and serializers are resolved as singletons.** Umbraco's `CollectionBuilderBase`
   registers every collection item `with the same lifetime as the collection`, and
   `CollectionLifetime` is `ServiceLifetime.Singleton`. Dynamic Images registers
   `ITemplateService`, `IFontService`, `ITemplateRepository`, `IFontRepository` and
   `ITemplateValidator` as **`AddScoped`** (`Composing/DynamicImagesComposer.cs`). Constructor-
   injecting any of them into a handler or serializer is a captive dependency and fails outright
   when the root provider resolves it. **Every handler and serializer takes
   `IServiceScopeFactory` and opens a scope per operation.**
2. **`SavedNotification<T>` and `DeletedNotification<T>` are `abstract` with `protected`
   constructors**, and Umbraco's event aggregator dispatches on the *published* type. So the main
   package declares concrete subclasses and publishes those; the uSync handler subscribes to the
   concrete type and forwards to the inherited base handler, which is an upcast, not a wrapper.

## Design

### 1. The new project

`src/DynamicImages.uSync/Umbraco.Community.DynamicImages.uSync.csproj` — `net10.0`, `IsPackable`,
`PackageId` `Umbraco.Community.DynamicImages.uSync`, same authorship/licence/icon/SourceLink
block as the main csproj, `Version` kept in step with it.

```xml
<PackageReference Include="uSync.Extend" Version="17.3.5" />
<ProjectReference Include="..\DynamicImages\Umbraco.Community.DynamicImages.csproj" />
```

`uSync.Extend` brings `uSync.BackOffice` and `uSync.Core` transitively; the `ProjectReference`
packs as a NuGet dependency on the main package. Added to `src/DynamicImages.sln`, and
`src/DynamicImages.TestSite.Clean` gains a `ProjectReference` to it (its
`Directory.Packages.props` does not reach up into `src/`, so this project pins its own versions).

**Version line caveat, to go in the README:** this package tracks the uSync **17** line. uSync 18
exists; NuGet would unify a uSync 18 site onto uSync 18 assemblies and the handler surface is not
guaranteed across a major. A uSync 18 consumer needs an 18.x build of this package.

### 2. Two objects, two handlers, two serializers

| | Templates | Fonts |
|---|---|---|
| Object | `Core.Models.Template` | `Core.Models.FontDefinition` |
| Handler alias | `dynamicImagesTemplateHandler` | `dynamicImagesFontHandler` |
| Folder | `DynamicImagesTemplates` | `DynamicImagesFonts` |
| Priority | `USYNC_RESERVED_UPPER + 20` (2020) | `USYNC_RESERVED_UPPER + 10` (2010) |
| Root element / `itemType` | `DynamicImagesTemplate` | `DynamicImagesFont` |
| `EntityType` | `dynamic-images-template` | `dynamic-images-font` |
| Icon | `icon-picture` | `icon-font` |

Both keep the inherited `Group` (`uSyncConstants.Groups.Settings`). A bespoke group reads better
in the dashboard but silently disables export-on-save on any site that has narrowed
`uSync:Settings:ExportOnSave` away from `"All"` — not worth it. Both are `IsTwoPass = false`.

Fonts sort before templates so a template's `FontKey` resolves during its own import.

### 3. The XML

Modelled on `uSync/v17/DataTypes/*.config`: an `<Info>` block for the human-readable columns and
a CDATA blob for the opaque document.

```xml
<?xml version="1.0" encoding="utf-8"?>
<DynamicImagesTemplate Key="8f3a…" Alias="articleOgImage" Level="0">
  <Info>
    <Name>Article OG image</Name>
    <Enabled>true</Enabled>
    <SchemaVersion>2</SchemaVersion>
    <DocTypeAliases>article,blogPost</DocTypeAliases>
  </Info>
  <Design><![CDATA[{ "schemaVersion": 2, "canvas": { … }, "layers": [ … ] }]]></Design>
</DynamicImagesTemplate>
```

```xml
<DynamicImagesFont Key="1c9e…" Alias="inter-700" Level="0">
  <Info>
    <FamilyName>Inter</FamilyName>
    <Weight>700</Weight>
    <IsItalic>false</IsItalic>
  </Info>
  <Source Kind="url">
    <Url>https://fonts.gstatic.com/…</Url>
    <Provider>google</Provider>
    <ProviderFamily>Inter</ProviderFamily>
    <ContentHash>…</ContentHash>
  </Source>
  <Styles>
    <Style Name="Title" Size="56" FontStyle="Regular" />
  </Styles>
</DynamicImagesFont>
```

`<Source>` writes only the elements the kind uses (`MediaKey` for `media`, `Path` for `path`,
`Url`/`Provider`/`ProviderFamily` for `url`), so a diff is not full of empty tags.

**Timestamps.** `CreatedUtc` and `UpdatedUtc` appear in neither file. For fonts we choose the
elements, so they are simply not written. For templates the `Design` CDATA is the serialised
`Template`, which *does* carry `UpdatedUtc` — so the serializer serialises the object, parses it
with `JsonNode`, removes `updatedUtc`, and writes the result. Without that every export reports a
change immediately after every import, forever.

**Do not mutate the object to strip the timestamp.** `ITemplateService.GetAll()` returns instances
held by `ITemplateCache`; the handler's `GetAllItems()` hands those straight to the serializer.
The `JsonNode` round-trip leaves the cached object untouched.

**Font alias.** `FontDefinition` has no alias column, and the alias is both the file name and the
fallback import lookup. `ItemAlias` returns a slug of `{familyName}-{weight}[-italic]`
(`inter-700`, `inter-400-italic`), lower-cased, non-alphanumerics collapsed to `-`. Two rows can
in principle share that (a media-backed Inter 700 and a Google Inter 700); uSync appends a short
key to the clashing *file* name automatically, and `FindItemAsync(XElement)` tries `Key` before
alias, so the correct row still wins on import. `FindItemAsync(string alias)` scans
`GetAll()` comparing computed aliases and falls back to `Guid.TryParse`.

### 4. The serializers

`SyncSerializerRoot<T>`, not `SyncObjectSerializer<T>` (reason above), each holding an
`IServiceScopeFactory` and a `ILogger<SyncSerializerRoot<T>>`.

`DynamicImagesTemplateSerializer`:

- `SerializeCoreAsync` → `InitializeBaseNode(item, item.Alias)` for the `Key`/`Alias`/`Level`
  attributes, then `<Info>` and `<Design>`; returns `SyncAttempt<XElement>.Succeed(item.Name, node,
  ChangeType.Export, [])`.
- `DeserializeCoreAsync` → read the CDATA through the existing
  `ITemplateJsonMigrator.Deserialize` (so a v1 document in a file is upgraded on import exactly as
  one in the database is), overwrite `Key`/`Alias`/`Name`/`IsEnabled`/`DocTypeAliases` from the
  attributes and `<Info>` — the same "columns are authoritative over the JSON copy" rule
  `TemplateRepository.Map` already applies — then call `ITemplateService.CreateAsync` or
  `UpdateAsync(template, expectedUpdatedUtc: null, userKey: null)` inside a scope. `null` skips
  the optimistic-concurrency check, which an import must.
  Return `SyncAttempt<Template>.Succeed(name, item, ChangeType.Import, message, saved: true, [])` —
  **`saved: true` stops `SyncSerializerRoot.DeserializeAsync` calling `SaveItemAsync` a second
  time.** A `SaveOutcome.Invalid` or `AliasInUse` becomes `SyncAttempt<Template>.Fail` carrying
  the validator messages, which is what surfaces in the uSync report.
- `FindItemAsync(Guid)`/`FindItemAsync(string)` → `ITemplateService.Get` / `GetByAlias`.
  `SaveItemAsync` → `UpdateAsync(…, null, null)`. `DeleteItemAsync` → `ITemplateService.Delete`.
  `ItemAlias` → `item.Alias`; `ItemKey` → `item.Key`.

`DynamicImagesFontSerializer` mirrors it over `IFontService`/`IFontRepository`, with two wrinkles:

- **There is no "insert this font row as given" API.** `UploadAsync`/`RegisterPathAsync`/
  `RegisterWebFontAsync` all fetch a file first, and `IFontService.Update` only edits family name
  and styles on an existing row. Add `FontDefinition Upsert(FontDefinition font)` to
  `IFontService`/`FontService` in the **main** package: insert or update through `IFontRepository`
  and then call the existing private `Notify`, so the font registry is cleared on every server
  the way a normal edit does. The serializer's `SaveItemAsync` calls it.
- `DeleteItemAsync` calls `IFontService.Delete(key)`, which **refuses** and returns the templates
  still using the font rather than deleting. If that list is non-empty the serializer throws with
  those template names; `ImportSingleElementAsync` catches it and reports a failed action, which
  is the honest answer — the alternative is silently breaking a template.

### 5. The handlers

`SyncObjectHandler<Template>` / `SyncObjectHandler<FontDefinition>` from `uSync.Extend` —
`GetChildItemsAsync`, `GetFoldersAsync`, `GetFromServiceAsync` and `DeleteMissingItemsAsync` are
already written there, leaving:

```csharp
protected override async Task<IEnumerable<Template>> GetAllItems()      // scope → ITemplateService.GetAll()
protected override string GetItemName(Template item) => item.Name;
```

Each also implements `INotificationAsyncHandler<DynamicImagesTemplateSavedNotification>` and
`…DeletedNotification`, forwarding to the base:

```csharp
public Task HandleAsync(DynamicImagesTemplateSavedNotification notification, CancellationToken ct)
    => base.HandleAsync(notification, ct);   // upcast to SavedNotification<Template>
```

`SyncHandlerRoot.HandleAsync(SavedNotification<T>, …)` already calls `ShouldProcessEvent()`,
`ExportAsync` and the duplicate-file cleanup; the delete overload writes uSync's "empty" delete
marker. Nothing else is needed.

One composer, `DynamicImagesUSyncComposer`, registers **only** the notification handlers and the
UDI types — the handler and serializer classes themselves are found by the `TypeLoader`:

```csharp
builder.AddNotificationAsyncHandler<DynamicImagesTemplateSavedNotification, DynamicImagesTemplateHandler>();
builder.AddNotificationAsyncHandler<DynamicImagesTemplateDeletedNotification, DynamicImagesTemplateHandler>();
// … the two font equivalents …
UdiParser.RegisterUdiType("dynamic-images-template", UdiType.GuidUdi);
UdiParser.RegisterUdiType("dynamic-images-font", UdiType.GuidUdi);
```

The UDI registration is what makes `ExportAsync(Udi, …)` and `FindFromNodeAsync` work; the
`uSync.Extend` example omits it, uSync.Forms and uSync.Umbraco.Commerce both do it.

### 6. Notifications in the main package

New `Core/Notifications/DynamicImagesNotifications.cs`, four sealed classes:

```csharp
public sealed class DynamicImagesTemplateSavedNotification(Template target, EventMessages messages)
    : SavedNotification<Template>(target, messages);
```

plus the `Deleted` one and the two `FontDefinition` equivalents. `TemplateService.CreateAsync`,
`UpdateAsync` and `Delete`, and `FontService`'s save/refresh/update/delete paths and the new
`Upsert`, publish them through `IEventAggregator` alongside the existing `Notify(key)` cache
refresh. `Delete` must read the row **before** deleting so the notification carries the object.

This is additive and inert on its own: with no subscriber, publishing costs a dictionary lookup.
It is also the right seam for anything else that wants to react to a template changing.

### 7. Retiring nothing, documenting the overlap

`ISyncService`/`SyncService` and the Health dashboard's Export/Import stay exactly as they are —
they work without uSync and some sites will keep using them. The README's "Umbraco Cloud" section
already says "A Deploy connector is not included in this version"; it gains a short **uSync**
subsection naming the optional package, the two folders, and one caveat that matters:

> uSync moves the template and font **rows**, and Umbraco's own Media handler moves the media
> **nodes** an uploaded font lives in — but uSync does not move media **files**. A `url` or
> `path` font travels completely; an uploaded font arrives as a row pointing at a media item
> whose binary the target environment must already have (Deploy, uSync.Complete, or a re-upload).

## Files

New:
- `src/DynamicImages.uSync/Umbraco.Community.DynamicImages.uSync.csproj`, `README.md`
- `src/DynamicImages.uSync/Handlers/DynamicImagesTemplateHandler.cs`, `DynamicImagesFontHandler.cs`
- `src/DynamicImages.uSync/Serializers/DynamicImagesTemplateSerializer.cs`, `DynamicImagesFontSerializer.cs`
- `src/DynamicImages.uSync/DynamicImagesUSyncComposer.cs`, `DynamicImagesUSyncConstants.cs`
  (handler aliases, folders, entity types, the two serializer GUIDs)
- `src/DynamicImages/Core/Notifications/DynamicImagesNotifications.cs`
- `test/DynamicImages.Tests/USyncTemplateSerializerTests.cs`, `USyncFontSerializerTests.cs`

Modified:
- `src/DynamicImages/Core/Services/TemplateService.cs`, `FontService.cs`, `IFontService.cs`
  (publish notifications; add `Upsert`)
- `src/DynamicImages/README.md`, `CHANGELOG.md`
- `src/DynamicImages.sln`, `src/DynamicImages.TestSite.Clean/DynamicImages.TestSite.Clean.csproj`
- `test/DynamicImages.Tests/DynamicImages.Tests.csproj` (ProjectReference to the uSync project)
- `.github/workflows/release.yml` — pack and push the second project, and extend the
  "Resolve and check the version" step to check its csproj too
- `.github/workflows/ci.yml` — no change needed; `dotnet test test/DynamicImages.Tests` now
  restores uSync.Extend as well, which is small beside the Umbraco.Cms.Api.Management it already
  restores

Reused as-is: `ITemplateService`, `ITemplateJsonMigrator` (the v1→v2 upgrade on import comes free),
`ITemplateValidator` via `CreateAsync`/`UpdateAsync`, `IFontRepository`, `DynamicImagesJsonOptions`,
`FontService.Notify`'s cache-refresher fan-out, `uSync.Extend`'s `SyncObjectHandler<T>`.

## Implementation order

1. Main package: the four notification classes, published from `TemplateService` and `FontService`;
   `IFontService.Upsert`. Builds and ships alone, changes no behaviour.
2. The new project, csproj, solution entry, constants. Reference it from TestSite.Clean.
3. `DynamicImagesFontSerializer` + `DynamicImagesFontHandler` + composer — fonts first, because
   they are the simpler shape and templates depend on them.
4. `DynamicImagesTemplateSerializer` + `DynamicImagesTemplateHandler`, including the `JsonNode`
   `updatedUtc` strip.
5. Serializer unit tests (see below).
6. README sections in both packages; CHANGELOG; release workflow.

## Verification

Unit tests, in `test/DynamicImages.Tests`, driving the serializers directly — `SerializeAsync` and
`DeserializeAsync` are public on `SyncSerializerRoot<T>`, so a `NullLogger` and a stub
`IServiceScopeFactory` over an in-memory fake service is the whole fixture:

- A template with layers, a gradient canvas and a font reference round-trips: serialize →
  deserialize → serialize gives byte-identical XML.
- The `Design` CDATA contains no `updatedUtc`, and serializing the *same* template twice with a
  different `UpdatedUtc` produces identical XML — the property that makes `IsCurrentAsync` stable.
- `IsValid` rejects a node whose root element is not `DynamicImagesTemplate`, and one with an
  empty `Key`.
- A v1 template document in the CDATA imports as v2 (proves the `ITemplateJsonMigrator` path).
- A template whose validation fails returns `SyncAttempt.Fail` with the validator's message, not
  an exception.
- Font aliases: `Inter`/700/italic → `inter-700-italic`; a `media` font writes `<MediaKey>` and no
  `<Url>`; styles round-trip.

End to end, against `src/DynamicImages.TestSite.Clean` (HTTPS, and probe `/umbraco` not `/` —
`plans/ui-review-method.md` section 6):

1. Boot, log in, open **Settings → uSync**. The two handlers appear in the Settings group with
   their icons — if they do not, the serializer was not discovered and the boot log carries
   `No Serializer found for handler …`.
2. **Export**. `uSync/v17/DynamicImagesTemplates/articleOgImage.config` and
   `uSync/v17/DynamicImagesFonts/*.config` exist, one file per row, and the fixture's three
   families are all present.
3. **Report** immediately after Export reports *no changes*. This is the timestamp check; if
   everything reports as changed, `updatedUtc` reached the file.
4. Edit the Article OG image template's title text in the designer and save. The `.config` file
   changes on disk within the request — export-on-save through the notification. Delete a
   duplicated template; its file becomes a uSync delete marker.
5. Delete `umbraco/Data/` and reboot so uSync's first-boot import runs against an empty database.
   The templates and fonts come back, fonts before templates, and the Dynamic Images dashboard
   lists them. Publish an article → the OG image generates with the right font, which proves the
   `FontKey` survived.
6. Change a template's alias in the file, Report → a Create plus a Delete, not a silent rename
   (uSync's documented behaviour for aliased items; worth confirming, not fixing).
7. `cd src/DynamicImages/Client && E2E_BASE_URL=https://localhost:44344 npm run test:e2e` still
   passes — the notification publishing is the only main-package change that touches a code path
   the designer uses.

`dotnet build src/DynamicImages.sln` and `dotnet test test/DynamicImages.Tests` throughout. The
client bundle is untouched, so no npm step beyond the E2E run.
