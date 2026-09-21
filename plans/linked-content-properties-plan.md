# Following content references into linked nodes

## Context

Bind a layer to a content-reference property and nothing useful comes out. On the Clean test site,
`articleControls.author` is an `Umbraco.MultiNodeTreePicker` whose stored value is
`umb://document/bd6a503a…` (or a comma-separated list of those). A text layer bound to it prints the
raw UDI; an image layer bound to it draws nothing, because
`ContentRenderValueSource.GetMediaKey` (`src/DynamicImages/Core/Rendering/ContentRenderValueSource.cs:56-57`)
hands the string to `MediaSource.ResolveMediaKey`, `UdiParser.TryParse` does not care that the entity
type is `document`, and the resulting document key is then looked up in `IMediaService` — where it
is, correctly, absent.

What an editor wants is the property *on the linked node*: the author's `mainImage`, the author's
`jobTitle`. Nothing in the package can express that today. There is no dotted-path support anywhere
in the C# (`GetText`/`GetDate`/`GetMediaKey` pass the alias straight to `HasProperty`/`GetValue`), no
`IPublishedContentCache` or `IPublishedContentQuery` usage at all, and the only "one level down"
behaviour is the badges layer, whose `LabelPropertyAlias` reads a property off each picked item via a
dictionary that `ContentRenderValueSource.GetItems` flattens up front.

This plan adds dotted property paths — `author.mainImage` — to every alias-bearing binding, and gives
the designer a second dropdown that knows what the linked node actually offers.

### Decisions made with the user

- **The path is a dotted string in the existing `propertyAlias` fields.** `author.mainImage`. No new
  wire-contract field, so uSync serialisation, the template JSON and `{prop:author.jobTitle}`
  expressions all work unchanged.
- **Arbitrary depth, capped at 3 hops. The first node wins** when a picker holds several. No index
  syntax (`authors[1].name` is explicitly out).
- **Scope is all four binding sites**: text layers, image layers, visibility rules and badges layers.
- **The designer infers the target types server-side** — from the data type's `filter` when it has
  one, otherwise by sampling existing content, otherwise offering every document type — and returns
  the union of those types' properties for a second dropdown.
- **A bare content reference in a text layer resolves to the linked node's name** (comma-joined for
  several) instead of printing a UDI.

Branch: `feature/ps/linked-content-properties`.

### Facts verified against the pinned packages and the fixtures (2026-09-21)

Read from `Umbraco.Cms.Core` / `Umbraco.Cms.Web.Common` **17.5.3** (the version
`src/DynamicImages/Umbraco.Community.DynamicImages.csproj` pins) and from the Clean test site's uSync
files:

- **`published.Value<string>(alias)` — the one-argument form the current code uses — is
  `Umbraco.Extensions.FriendlyPublishedContentExtensions.Value<T>`, which lives in
  Umbraco.Cms.Web.Common.** Its signature takes no `IPublishedValueFallback`; the Core overload
  `Umbraco.Extensions.PublishedContentExtensions.Value<T>` requires one. The friendly form therefore
  resolves that service itself and throws in a unit test with no container. **Every new read in this
  feature must use `node.GetProperty(alias)?.GetValue()`** — the pure `IPublishedElement` /
  `IPublishedProperty` members, which is already what `GetItems` does for badge properties. Same
  behaviour (the friendly overload defaults to `Fallback.NoFallback`, no culture), and the whole
  target-node reader becomes unit-testable.
- **`MultiNodePickerConfiguration` has `Filter`** ("content type filter for allowed selections"),
  plus `TreeSource` (`MultiNodePickerConfigurationTreeSource`: `ObjectType`, `StartNodeId`,
  `StartNodeQuery`, `DynamicRoot`), `MinNumber`, `MaxNumber`, `IgnoreUserStartNodes`.
  **`ContentPickerConfiguration` has only `IgnoreUserStartNodes` — no type filter at all.**
- **`filter` stores a content-type key.** `uSync/v17/DataTypes/ImageMediaPicker.config:9` is
  `"filter": "cc07b313-0843-4aa8-bbda-871c8da728c8"`. Older sites wrote aliases, so the parse must
  accept both.
- **The fixture that matters has no `filter` at all.** `uSync/v17/DataTypes/MNTPAuthors.config` is
  `{ "ignoreUserStartNodes": false, "maxNumber": 1, "minNumber": 0, "startNode": { "type": "content",
  "query": null, "dynamicRoot": { "originAlias": "ByKey", "originKey": "dcf18a51-…", "querySteps":
  [{ "alias": "NearestDescendantOrSelf", "anyOfDocTypeKeys": ["b0287f57-…"] }] }, "id": null } }`.
  That `anyOfDocTypeKeys` names `authorList` — the **container**, not the picked item's type. So
  config-based inference cannot carry this very fixture; the sampling step is what will.
- **`IPublishedContentCache` exposes `GetById` and `GetByIdAsync`**, and all three
  `ContentRenderValueSource` construction sites already hold one as
  `contextRef.UmbracoContext.Content`.
- **`IDataType` exposes `ConfigurationObject` and `ConfigurationData`.**
- **`InternalsVisibleTo Include="DynamicImages.Tests"` is already in the csproj** (line 42), so new
  helpers can be `internal` and still be tested directly.
- Content values are stored as
  `<Value><![CDATA[umb://document/bd6a503a…,umb://document/13ea3528…]]></Value>`
  (`uSync/v17/Content/popular-blogs.config:23` and siblings), confirming the comma-separated shape.
- `uSync/v17/ContentTypes/author.config` composes `mainImageControls`, so the `author` document type
  really does have a `mainImage` — the end-to-end fixture already exists.

---

## Design

### 1. `PropertyPath` — parsing the alias

New `src/DynamicImages/Core/Rendering/PropertyPath.cs`, pure:

```csharp
public readonly record struct PropertyPath(string First, IReadOnlyList<string> Hops, string Last, bool IsTooDeep)
{
    public const int MaxHops = 3;
    public static bool IsPath(string? alias);       // contains '.' after trimming
    public static PropertyPath Parse(string alias); // splits, trims, drops empty segments
    public int SegmentCount { get; }
}
```

`Parse("author.mainImage")` gives `First = "author"`, `Hops = ["author"]`, `Last = "mainImage"`.
Empty segments are dropped, so `"author."` degrades to the bare alias — defensive, not a feature.

**An over-cap path resolves to nothing rather than being truncated.** Truncating would quietly read
the wrong property; the new validator warning is how the editor finds out instead.

### 2. `DocumentReference` — parsing a content reference

New `src/DynamicImages/Core/Rendering/DocumentReference.cs`. Deliberately *not* next to
`MediaSource` in `Core/Media` — putting the content reader beside the media reader is exactly how
the two would drift into each other, and the entity-type distinction between them is the bug this
feature exists to fix.

```csharp
public static IReadOnlyList<Guid> ResolveKeys(string? raw);
public static Guid? ResolveFirstKey(string? raw);
public static bool LooksLikeDocumentReference(string? raw);
```

`ResolveKeys` accepts, in order: a single UDI (`UdiParser.TryParse`, **and the `GuidUdi.EntityType`
must be `Constants.UdiEntityType.Document`** — this is the guard `MediaSource` lacks); a
comma-separated list of UDIs (the fixture's actual shape, which `MediaSource` does not handle); a
bare GUID or comma-separated GUIDs; a JSON array of UDI strings; a JSON array of objects, trying
`key` then `contentKey`. Anything else gives an empty list, and `JsonException` is swallowed exactly
as `MediaSource` does — a publish must never fail here.

`LooksLikeDocumentReference` is **stricter on purpose**: it demands that every token be an
`umb://document/` UDI. It is what decides whether a *bare* alias in a text layer prints its value or
follows it, and a bare GUID is a string somebody might legitimately want drawn.

### 3. `PublishedValues` — reading off a target node

New `internal static class` at `src/DynamicImages/Core/Rendering/PublishedValues.cs`. Everything
takes an `IPublishedContent` and an optional `IPublishedContentCache?`, so it is stubbable in a
couple of dozen lines.

```csharp
public static IPublishedContent? FollowFirst(IPublishedContent node, string alias, IPublishedContentCache? cache);
public static IPublishedContent? FollowRaw(string? raw, IPublishedContentCache? cache);
public static string? TextOf(IPublishedContent node, string alias);
public static DateTime? DateOf(IPublishedContent node, string alias);
public static Guid? MediaKeyOf(IPublishedContent node, string alias);
public static IReadOnlyList<BadgeItem> ItemsOf(IPublishedContent node, string alias);
public static bool Truthy(object? value);
```

`FollowFirst` switches on `node.GetProperty(alias)?.GetValue()`: an `IPublishedContent` (ContentPicker's
converter), an `IEnumerable<IPublishedContent>` (MNTP's — covariance means any typed sequence lands
here), else `FollowRaw(value?.ToString(), cache)` for the case where no converter ran.

`TextOf` is the shape-aware stringifier and is where decision 5 lives at depth: `name` → `node.Name`;
a `string` as-is; a single `IPublishedContent` → its `Name`; many → names comma-joined; an
`IEnumerable<string>` joined; a `DateTime` round-tripped; anything else `ToString()`. Rich-text
stripping stays where it is, in `TextResolver.ResolveProperty`.

`MediaKeyOf` prefers the typed value — `MediaWithCrops` (take `crops.Content.Key` explicitly rather
than trusting the wrapper's forwarding across a minor version), `IEnumerable<MediaWithCrops>`,
`IPublishedContent`, `IEnumerable<IPublishedContent>` — and falls back to
`MediaSource.ResolveMediaKey(value?.ToString())`, which keeps a site with no converter working.

`ItemsOf` and `Truthy` are the existing `GetItems` and `IsTruthy` bodies **moved here verbatim**, so
commit 2 is a pure refactor the existing tests already prove — and `Truthy` becomes directly
unit-testable for the first time.

### 4. `ContentRenderValueSource` — the orchestrator

The constructor gains an optional third parameter, so every existing call site and test keeps
compiling:

```csharp
public sealed class ContentRenderValueSource(
    IContent content,
    IPublishedContent? published,
    IPublishedContentCache? contentCache = null) : IRenderValueSource
```

The three real sites then pass `contextRef.UmbracoContext.Content`:
`NotificationHandlers/DynamicImagesNotificationHandler.cs:57`,
`Core/Services/RegenerationService.cs:56`, `Api/Controllers/PreviewController.cs:159`.

One private seam does the walking:

```csharp
private (IPublishedContent Node, string Alias)? ResolveTarget(string propertyAlias)
```

— `PropertyPath.Parse`, bail on `IsTooDeep`, resolve the first hop, then `PublishedValues.FollowFirst`
for each remaining hop.

**The first hop is special and must stay that way.** It reads the draft's raw value first, because
during a publish the draft holds the author the editor just chose while the published node still
names the old one — the same reason `GetText` is draft-first today. Later hops are pure published
content; there is no draft for a node that is not being published. On a draft miss, an unparseable
draft value, or no cache, it falls back to `PublishedValues.FollowFirst(published, alias, cache)`
rather than to nothing.

Each member then becomes "dotted? delegate to `PublishedValues` : today's code, untouched".
`GetReadingTime` needs no change at all — it already routes through `GetText`, so `author.bio` works
for free.

Non-dotted `GetMediaKey` keeps its draft-first raw-string behaviour; only the final hop of a *path*
uses the typed reader. That asymmetry is deliberate and wants a comment: the draft's raw JSON is the
authority during a publish, and there is no draft for a linked node.

### 5. A bare content reference in a text layer

Slots into the **non-dotted** branch of `GetText` only. After reading the draft value, if
`DocumentReference.LooksLikeDocumentReference(raw)` and the keys resolve through the cache to at
least one name, return the names comma-joined; otherwise return the raw value exactly as today. The
`published` fallback changes from `published?.Value<string>(alias)` to
`PublishedValues.TextOf(published, alias)`.

Three properties of that placement are load-bearing:

1. **The draft-first rule is untouched** — this only reinterprets what an unambiguous reference
   *means*.
2. **Falling through on failure is the safety net.** No cache injected, or the nodes are unpublished
   or deleted, and the raw value is returned — today's behaviour, so nothing regresses and no
   existing test moves.
3. **Badges are untouched.** `GetItems` never goes through `GetText`, and badge labels read
   `BadgeItem.Property(alias)` out of the pre-flattened dictionary
   (`BadgesLayerRenderer.cs:149`).

Known limitation to note in a comment rather than fix: `ItemsOf` flattens each badge node's
properties with `GetValue()?.ToString()`, so a *badge item's own* picker property still stringifies
to a UDI. Badge label and icon aliases stay single-segment reads.

### 6. Sample data and the dictionary source

**`DictionaryRenderValueSource` does not traverse.** A dotted alias is an opaque flat key, and its
dictionaries are already `OrdinalIgnoreCase`, so `GetText("author.jobTitle")` is a plain hit.
Teaching it to traverse would be a second implementation of the resolver that could quietly disagree
with the real one — the worst possible outcome for a preview whose job is to predict the server.
Worth saying so in the class comment.

**`SampleData` needs no change for dotted paths, which is worth proving rather than assuming.**
`AliasesOf` already yields `layer.Binding.PropertyAlias` and
`TextResolver.ReferencedAliases(binding.Text)`, both of which now yield dotted strings, and
`text.TryAdd("author.jobTitle", "Sample value")` seeds the dotted key directly. Badges key by the
dotted string too. Image layers were never seeded (`media: null`), so a property-bound image layer
already shows nothing in sample mode and dotted paths do not make that worse.

**One adjacent fix rides along, and the implementer may drop it without affecting anything else.**
`IsTruthy` in sample mode returns false for any alias nobody seeded, so every `WhenPropertyTruthy`
layer currently vanishes from the designer preview — the designer showing *less* than the real
render, which is the one direction it must not err in. Seed every visibility alias with `"1"` in
`SampleData.Build`. It predates this feature; dotted paths just make it much easier to hit.

**`TextResolver` needs no change but does need a test.** `token.Split(':', 3)` on
`prop:author.mainImage` gives two parts and on `date:author.publishedOn:d MMMM yyyy` gives three.
Dots and colons do not collide — lock that in explicitly rather than leaving it to luck.

### 7. `TemplateValidator`

`KnownPropertyAliases` is unchanged; what changes is what the caller feeds it.

- **`PropertyUnknown` checks the first segment only.** Checking the tail would mean inferring the
  linked document types — the same best-effort guess the new endpoint makes — and a warning built on
  a guess is worse than silence. The message gains a dotted variant naming which segment failed.
- **A new code, `PropertyPathTooDeep`**, warns that a path follows more references than are followed
  so it will be empty. It is a distinct failure with a distinct fix, and it must sit **outside** the
  `propertyAliases.Count > 0` guard that switches `PropertyUnknown` off, because it needs no content
  types to be true.
- **Widen alias collection** from `BoundAliases(TextLayer)` to an `AliasesOf(LayerBase)` yielding the
  text binding aliases, `ImageLayer.Source` and its `Fallback` chain's `PropertyAlias`,
  `BadgesLayer.ItemsPropertyAlias` and `layer.Visibility.PropertyAlias`, plus the canvas base image's
  — but **apply only the depth check to the newly covered fields**. Extending `PropertyUnknown` to
  them would be correct and would fire on templates that have existed happily for months, turning a
  bug fix into a warning flood. Note it as a follow-up.
- **No new `LayerSkipReason`.** `EmptyText` and `NoImage` remain accurate for an unresolvable path;
  reporting *why* would mean giving `IRenderValueSource` a failure channel, a far larger contract
  change than this justifies.

### 8. The new endpoint

```
GET /umbraco/management/api/v1/dynamic-images/document-types/{alias}/properties/{propertyAlias}/linked
```

On `DocumentTypesController`, which already injects every service needed and already owns
`ScopeToStartNodes` and `Classify`. New DTO in `Api/Models/ApiModels.cs`:

```csharp
public sealed record LinkedPropertiesResponse(
    string PropertyAlias,
    string Inference,                                   // "filter" | "sampled" | "all" | "none"
    IReadOnlyList<DocumentTypeResponse> TargetDocTypes,
    IReadOnlyList<DocumentTypePropertyResponse> Properties);
```

Reusing `DocumentTypePropertyResponse` is the point — the client already has `DiProperty` and
`#propertySelect` consumes it unchanged. `Inference` lets the designer distinguish "the picker says
so" from "we looked at what is actually picked" from "we had to offer everything".

The algorithm, in order:

0. Resolve the content type and the property, or 404.
1. **Not content-classified → an empty 200, not a 400.** The designer asks speculatively every time
   the first dropdown changes; an error toast per keystroke would be noise, and the client can simply
   not render a second dropdown. `Umbraco.MultiUrlPicker` classifies as `other` and is explicitly out
   of scope — its value mixes UDIs with external URLs and following it is a different feature.
2. **The data type's `filter`.** Read it out of `IDataType.ConfigurationData` by key rather than
   casting to `MultiNodePickerConfiguration` — the dictionary read is version-robust and the typed
   class has moved between majors. Parse via a new pure
   `src/DynamicImages/Core/Services/DataTypeFilter.cs` handling a comma-separated `string`, a
   `JsonElement` array, an `IEnumerable<string>` and null. Resolve each token as
   `Guid.TryParse(t, out var key) ? contentTypeService.Get(key) : contentTypeService.Get(t)`, since
   17 writes keys and older sites wrote aliases. Any hits → `Inference = "filter"`.
3. **Sample existing nodes** — the step that carries the `MNTPAuthors` fixture. One
   `contentService.GetPagedOfType(contentType.Id, 0, 20, out _, ScopeToStartNodes(...))`, then
   `DocumentReference.ResolveKeys(node.GetValue<string>(propertyAlias))` across the page, distinct,
   capped at 20 keys, then one batched
   `entityService.GetAll(UmbracoObjectTypes.Document, keys).OfType<IContentEntitySlim>()` and take
   the distinct `ContentTypeKey` — the slim row already carries the only thing needed, so this is one
   query rather than one content load per key. `GetPagedOfType` returns drafts, which is right: they
   carry the picker value, and it matches the draft-first rendering rule. Using the *same*
   `DocumentReference` parser as the renderer means the endpoint and the render agree by construction
   about what a reference is. Any hits → `Inference = "sampled"`.
   - **`ScopeToStartNodes` is mandatory here.** The response is metadata rather than node values, so
     nothing leaks, but scoping keeps the inference consistent with what this user can see and stops
     a narrow-start-node user driving an unscoped query across the whole tree. Reuse the existing
     method verbatim, including its "no resolvable start node means see nothing" fallback.
   - **Deliberately not used:** `startNode.dynamicRoot.querySteps[].anyOfDocTypeKeys`. In the fixture
     it names the `authorList` container, not the picked item's type. Taking that container's
     `AllowedContentTypes` would be right here by coincidence of how one site models authors, and a
     confidently wrong narrowing is worse than the honest fallback. Say so in a comment so the next
     person does not "improve" it.
4. **Every non-element document type**, `Inference = "all"`.
5. **Union the properties** exactly as `GetProperties` already batches: distinct `DataTypeKey` across
   every target type, one `dataTypeService.GetAllAsync`, de-dup by alias (first wins, matching the
   client's existing union rule), order by group then name. Prepend **three** pseudo-properties —
   `name`, `createDate`, `updateDate`, all readable on a linked node — and **not `readingTime`**,
   which is a binding kind rather than a property and would be read as a literal alias.

**Cost.** One cached content-type read, one data-type read, at most one 20-row paged query, one
batched slim lookup, one batched data-type lookup. The `"all"` fallback is the expensive case on a
large site, so cache the response in the already-injected `AppCaches.RuntimeCache` for 60 seconds
under a key that **includes the caller's start-node signature** — two users with different start
nodes can legitimately sample different nodes, and a shared entry would leak one user's narrowing to
the other.

### 9. The client

**`api/types.ts`** — no shape change to the four binding interfaces, since the dotted string rides in
the existing `propertyAlias` fields. But this file *is* the contract, so each of
`DiTextBinding.propertyAlias`, `DiImageSource.propertyAlias`, `DiVisibility.propertyAlias` and
`DiBadgesLayer.itemsPropertyAlias` gets a comment stating the dotted form, the first-node rule and
the 3-hop cap. Add `LinkedInference` and `DiLinkedProperties`.

**`api/dynamic-images-api.ts`** — `fetchLinkedProperties(alias, propertyAlias, getToken)` beside
`fetchProperties`.

**New `models/property-path.ts`** — `splitPath`, `joinPath`, `isPath`, `hopCount`, `MAX_HOPS`.
`splitPath("a.b.c")` gives `{ root: "a", tail: "b.c" }`: keeping the whole remainder in the tail is
the correct decode for a two-dropdown UI, because a three-segment path typed by hand or imported from
JSON then survives a round trip through the inspector untouched.

**`designer/di-layer-inspector.element.ts`** — widen the existing shared helper `#propertySelect`
(line 1156) rather than adding a parallel one:

- `classification` accepts a single value **or an array**, so `"media"` keeps compiling at every
  existing call site.
- **A stored alias that is not in the list must still render as a selected option.** A `uui-select`
  whose value is not among its options renders blank, and the next change event writes that blank
  back over the editor's binding. This is a real bug today for stale templates, and it is a
  prerequisite for the second dropdown.
- Factor the body into a shared `#selectFrom(list, value, onChange, classification)` so the new
  linked dropdown is the same implementation over a different list.

New `#propertyPathSelect(value, onChange, { root, tail })` composes two of them. The tail dropdown
appears when the root is `content`-classified **or when a tail is already stored** — so an existing
path is never silently flattened by a palette that has not finished loading. Composition rules:

- Changing the **root** calls `onChange(newRoot)` and **clears the tail** — the new root's properties
  are a different set, and carrying the old tail over would produce a path that resolves to nothing.
- Changing the **tail** calls `onChange(joinPath(root, newTail))`.
- `- none -` in the tail gives the bare reference, which section 5 makes meaningful for text.
- Decoding on open is `splitPath(...)` on every render — no stored state in the element, so it
  survives layer-selection changes for free.

Call sites, and the filters each passes:

| Where | root filter | tail filter |
|---|---|---|
| `#renderTextContent` property dropdown (~L318) | none, as today | none |
| `#renderImage` `source.propertyAlias` (~L507) | `["media", "content"]` | `"media"` |
| Canvas base image (~L121) | `["media", "content"]` | `"media"` |
| `#renderBadges` `itemsPropertyAlias` (~L599) | none, as today | none |
| Visibility "Controlled by" (~L1146) | none, as today | none |

For image layers the root list **widens** from `media` to `media` + `content` and the `media` filter
**moves to the tail**. That is exactly the `author.mainImage` case, and it never offers a text
property as an image source. The canvas base image is included rather than left out because
server-side it is the same `ImageSource` through the same `ImageSourceProvider`, so excluding it
would be an arbitrary hole an editor finds within a day.

**`workspace/di-template-workspace.context.ts`** — a `#linkedProperties` object state beside
`#properties`, loaded **eagerly** in `#loadSupportingData` once `#loadProperties` resolves: every
`content`-classified property in the union, capped at 12, one request per `(docTypeAlias, rootAlias)`
pair with `.catch(() => [])` each, flattened and de-duped by alias — mirroring `#loadProperties`
exactly. Lazy loading would leave the second dropdown empty for the moment right after the editor
picks a root, which is the exact moment they are looking at it, and would need event plumbing back
from the inspector for no gain. Call it from `reloadProperties()` too.

**`workspace/views/di-design-view.element.ts`** — a `_linkedProperties` field beside `_properties`
(L51), an `observe` beside L116, and `.linkedProperties=${...}` on the `<di-layer-inspector>` at
L511-516.

**`di-property-palette` and `layer-factories` are deliberately unchanged.**
`layerTypeFor("content") → badges` stays, so dropping `author` still makes a badges layer — right for
`categories`, which is the common case, and a sensible starting point for `author`. The editor then
adds the tail or switches layer type in the inspector. `di-layer-box`'s `{alias}` placeholder renders
`{author.jobTitle}`, which is informative as-is.

---

## The tests

### C# — `test/DynamicImages.Tests` (xunit 2.9.2, no mocking library, stubs at the bottom of the file)

- **`PropertyPathTests.cs`** (new) — `IsPath`; `Parse` on one, two and three segments; trailing,
  leading and doubled dots; whitespace; `IsTooDeep` false at 3 hops and true at 4; `SegmentCount`.
- **`DocumentReferenceTests.cs`** (new) — mirrors `MediaSourceTests`' shape. `ResolveKeys` reads a
  single UDI, **a comma-separated pair in order** (the fixture shape, and the assertion that matters
  most), a bare GUID, a JSON array of UDI strings, a JSON array of `{key}` objects; returns empty for
  null, `""`, `"[]"`, `"not json"`, `"{ broken"` **and for `umb://media/…`** — the entity-type guard
  is the whole point. `LooksLikeDocumentReference` is true for one and many document UDIs and
  **false for a bare GUID, a media UDI and `"Hello world"`**: those three are what stop the
  bare-reference behaviour rewriting ordinary text.
- **`PublishedValuesTests.cs`** (new), with two shared doubles in their own files so later tests can
  reach them: `FakePublishedContent.cs` (name, key, dates and a property dictionary real; every other
  member `throw new NotSupportedException()`) and `FakeContentCache.cs` (a dozen lines over a
  dictionary). Covers `FollowFirst` for a single node, a sequence, a raw UDI with a cache and a raw
  UDI with **no** cache (null, not a throw); `TextOf` for `name`, a string, one node, many nodes, a
  string list and null; `MediaKeyOf` for a typed node, a `MediaWithCrops`, a raw MediaPicker3 JSON
  string and nothing; `DateOf` for `createDate`, a `DateTime` and a parsable string; `ItemsOf`; and
  `Truthy` across every arm.
- **`TemplateValidatorTests.cs`** (extend) — the existing `Validator()` uses
  `NeverCalled<IContentTypeService>()`, so `PropertyUnknown` is off, which is exactly right for
  testing `PropertyPathTooDeep` in isolation: an over-deep text binding warns and names the layer; a
  two-segment one does not; an over-deep image `Source.PropertyAlias` warns; an over-deep
  `{prop:…}` expression warns. **Do not build an `IContentTypeService` stub** for the first-segment
  `PropertyUnknown` case — assert `PropertyPath.Parse(alias).First` in `PropertyPathTests` instead
  and keep the fat-interface cost out.
- **`TextResolverTests.cs`** (extend) — a dotted key in the shared source dictionary; `Property`
  binding resolves it; `{prop:author.jobTitle}` resolves it; `{date:author.publishedOn:d MMMM yyyy}`
  splits into three parts correctly; `ReferencedAliases` yields the dotted string whole.
- **`DataTypeFilterTests.cs`** (new) — comma-separated string, a single key, empty and null,
  whitespace trimming, a `JsonElement` array, an `IEnumerable<string>`.

**Not attempted, and the plan says so rather than pretending:** a unit test of
`ContentRenderValueSource`'s draft path. `content.HasProperty` and `content.GetValue<T>` are
extensions over `IPropertyCollection`, so faking `IContent` means building a real `ContentType` with
an `IShortStringHelper` — an integration test wearing a unit test's clothes. The draft-first first
hop is covered by the e2e instead.

### Client

- **`src/models/property-path.test.ts`** (new, node) — `splitPath`/`joinPath`/`isPath`/`hopCount`
  round trips, `"a.b.c"` keeping `"b.c"` in the tail, `""`, `"author."`, and `joinPath(root, "")`
  giving the bare root.
- **`src/designer/property-path-select.browser.test.ts`** (new, browser) — mount
  `<di-layer-inspector>` with a `content`-classified `author` and a `linkedProperties` map. One
  dropdown with no path; two once `author` is the value; the second's options come from
  `linkedProperties.author`; selecting `jobTitle` fires `di-layer-change` with
  `binding.propertyAlias === "author.jobTitle"`; **changing the root clears the tail**; opening a
  layer already bound to `author.jobTitle` shows both dropdowns correctly selected; and an alias not
  in `properties` still renders rather than blanking — that last one its own `it`, as the regression
  guard for the `uui-select` blanking bug.

### E2E — warranted, because the fixture already exists

**`src/DynamicImages/Client/e2e/linked-property.spec.ts`** (new). `article` composes both
`articleControls` (the `author` MNTP) and `mainImageControls`; `author` composes `mainImageControls`
so it has a `mainImage`; `MNTPAuthors` has **no `filter`**; and `articleogimage` is already what
`helpers.ts`'s `TEMPLATE_NAME` opens. So this spec exercises the one thing no unit test can: that
sampling real content through `ScopeToStartNodes` really does infer `author` as the target type on a
real site. Using the existing `login` / `openSection` / `openTemplate` / `openView` helpers: open the
Design view, select a text layer, choose `author`, assert a second dropdown appears containing an
option whose value is `mainImage` — **that option existing is the proof the inference worked** —
then pick a real node in Preview & test and assert on what the server actually drew.

*As built:* the Clean `author` document type has **no `jobTitle`** (its properties are `mainImage`,
`subtitle`, `title` and the SEO/visibility compositions), so the tail the spec chooses is `name`.
That turns out to be the stronger assertion anyway: `author.name` and a bare `author` reference
must resolve to the same node, so they must draw the same string, and it needs no fixture data to
be populated. And rather than eyeballing the image for a `umb://` substring, the spec reads
`resolvedText` off the `/preview/layout` response — the text the server says it drew — filtered to
renders where `useSampleData` is false, since switching to Preview & test renders against samples
before a node is picked.

---

## Files

**New (server)**

- `src/DynamicImages/Core/Rendering/PropertyPath.cs` — dotted-alias parsing and the hop cap.
- `src/DynamicImages/Core/Rendering/DocumentReference.cs` — content-reference parsing, with the
  entity-type guard `MediaSource` lacks.
- `src/DynamicImages/Core/Rendering/PublishedValues.cs` — reading a property off a target node
  without the Web.Common friendly extensions.
- `src/DynamicImages/Core/Services/DataTypeFilter.cs` — the picker `filter` setting's three shapes.

**New (client)**

- `src/DynamicImages/Client/src/models/property-path.ts` — `splitPath` / `joinPath` / `isPath`.

**New (tests)** — `PropertyPathTests.cs`, `DocumentReferenceTests.cs`, `PublishedValuesTests.cs`,
`DataTypeFilterTests.cs`, `FakePublishedContent.cs`, `FakeContentCache.cs`,
`src/models/property-path.test.ts`, `src/designer/property-path-select.browser.test.ts`,
`e2e/linked-property.spec.ts`.

**Modified (server)**

- `Core/Rendering/ContentRenderValueSource.cs` — the cache parameter, `ResolveTarget`, dotted
  dispatch, the bare-reference names.
- `Core/Rendering/DictionaryRenderValueSource.cs` — comment only, on why it does not traverse.
- `Core/Rendering/SampleData.cs` — visibility-alias seeding (the adjacent fix).
- `Core/Services/TemplateValidator.cs` — `AliasesOf(LayerBase)`, first-segment `PropertyUnknown`,
  `PropertyPathTooDeep`.
- `Api/Controllers/DocumentTypesController.cs` — `GetLinkedProperties`.
- `Api/Models/ApiModels.cs` — `LinkedPropertiesResponse`.
- `NotificationHandlers/DynamicImagesNotificationHandler.cs:57`,
  `Core/Services/RegenerationService.cs:56`, `Api/Controllers/PreviewController.cs:159` — pass the
  cache.

**Modified (client)** — `api/types.ts`, `api/dynamic-images-api.ts`,
`designer/di-layer-inspector.element.ts`, `workspace/di-template-workspace.context.ts`,
`workspace/views/di-design-view.element.ts`, and the committed bundle under
`wwwroot/App_Plugins/DynamicImages/`.

**Reused as-is** — `MediaSource` (still the media parser; `DocumentReference` is its mirror),
`ImageSourceProvider` (unchanged: it already asks the value source for a media key, and now gets a
real one), `TextResolver` (the `:` split already tolerates dots), `HtmlText`, `LayerSkip`,
`ScopeToStartNodes` and `Classify` on `DocumentTypesController`, `#propertySelect`'s option shape,
and `layer-factories` / `di-property-palette`.

---

## Implementation order

Each step is its own commit and lands green. Steps 1-7 ship the whole feature on the server, testable
with curl before any UI depends on it.

1. **The pure parsers** — `PropertyPath`, `DocumentReference`, and their tests. Nothing calls them
   yet.
2. **The target-node reader** — `PublishedValues`, with `Truthy` and `ItemsOf` *moved* out of
   `ContentRenderValueSource`, which now delegates. A pure refactor, so the existing tests prove it.
   Add `FakePublishedContent`, `FakeContentCache`, `PublishedValuesTests`.
3. **Wire the resolver** — the optional cache parameter, `ResolveTarget`, dotted dispatch in all six
   members, and the three construction sites. Non-dotted behaviour is byte-identical.
4. **The bare-reference names.** Separate from step 3 deliberately: it is the one change that alters
   *existing* templates' output, so it must be revertible on its own.
5. **Validator** — `AliasesOf(LayerBase)`, the first-segment `PropertyUnknown` message, and
   `PropertyPathTooDeep`.
6. **Sample data** — the visibility-alias seeding, and the `TextResolver` tests that confirm dotted
   aliases and tokens already work.
7. **The endpoint** — `DataTypeFilter`, `LinkedPropertiesResponse`, `GetLinkedProperties` with the
   `AppCaches` wrapper. Verify against the Clean site with curl before moving on.
8. **Client contract and pure model** — `types.ts`, `fetchLinkedProperties`, `models/property-path.ts`
   and its test.
9. **Client wiring** — the context state and eager load, the design-view observe and pass-down. No UI
   change, so nothing can regress.
10. **Client UI** — the `#selectFrom` extraction, the stale-value guard, `#propertyPathSelect`, the
    five call sites, and the browser test.
11. **E2E and docs** — `linked-property.spec.ts`, plus a README section on the dotted syntax, the
    first-node rule and the 3-hop cap.

Steps 1-2 and 8-10 can each be squashed if a tighter history is wanted. **3 and 4 stay apart**, and
**7 stays apart from the client work.**

---

## As built

Everything above shipped. Eleven commits, in the plan's order, each green. What the code forced
differently, and why:

- **`PublishedValues`' node parameters are nullable** (`IPublishedContent?`). Section 5's own call
  site — `PublishedValues.TextOf(published, alias)` against the nullable `published` field — needs
  it, and returning null for a null node is what every caller already wanted.
- **`ItemsOf` also reads a single picked node** as a one-item list. The old
  `Value<IEnumerable<IPublishedContent>>` silently returned nothing for a ContentPicker; both
  shapes are now covered and tested.
- **`PublishedValues.ValueOf`** was added, unlisted in the design. `IsTruthy` needs the raw
  converted value, and it was the one read still going through the friendly `Value(alias)`
  extension.
- **`#propertySelect` is gone rather than widened.** All five call sites take the path variant, so
  the single-dropdown helper had no callers left. `#selectFrom` is the shared body, as planned.
- **`DataTypeFilter` has a second overload**, `Parse(IDictionary<string, object>?)`, so the
  controller reads the `filter` key without repeating the lookup.
- **`DocumentTypesController.PropertiesOfAsync`** was extracted from `GetProperties` — that is what
  lets the new endpoint union several target types under the same de-dup rule, and it keeps the
  batched data-type lookup in one place.
- **The client caps the eager load at 12 roots** (`MAX_LINKED_ROOTS`), a module constant in the
  workspace context.
- **`SampleDataTests.cs`** was added, unlisted in the test plan, to prove section 6's claim that a
  dotted alias already seeds as a flat key rather than assuming it.
- **The browser spec has eight cases, not six** — the extra two are a stored tail whose root has no
  linked list loaded, and the "another root's properties must not leak in" check.

Nothing in the design was dropped. The section 6 SampleData visibility-alias seeding rode along as
planned and stayed a one-commit change.

## Verification

- `dotnet build src/DynamicImages.sln`
- `dotnet test test/DynamicImages.Tests`
- `cd src/DynamicImages/Client && npm ci && npm run typecheck && npm test && npm run test:browser && npm run build`
  - Then `git diff --exit-code src/DynamicImages/wwwroot` — `ci.yml` fails if the committed bundle
    does not match its source.
- The endpoint, against a booted `src/DynamicImages.TestSite.Clean` (see CLAUDE.md for the unattended
  boot; probe `/umbraco`, never `/`):
  - `GET …/document-types/article/properties/author/linked` returns `inference: "sampled"`,
    `targetDocTypes` containing `author`, and `properties` containing `mainImage`. **`"filter"` here
    would mean the config step matched something it should not have** — `MNTPAuthors` has no filter.
  - `GET …/document-types/article/properties/title/linked` returns `inference: "none"` and empty
    lists, with a 200.
- `E2E_BASE_URL=https://localhost:44344 npx playwright test linked-property --reporter=list`
- By hand in the backoffice, on the Article OG image template:
  - Select a text layer, choose **Author** → a second dropdown appears → choose a property on the
    author (**Subtitle** or **Title**; the fixture has no *Job title*) → the preview shows that
    value, not a `umb://document/…` string.
  - Choose **Author** and leave the second dropdown on `- none -` → the preview shows the author's
    *name*.
  - Change an image layer's source to **Property**, choose **Author**, then **Main image** → the
    author's photo renders.
  - Type `a.b.c.d.e` into a binding → a `PropertyPathTooDeep` warning appears in the issues panel and
    the layer is skipped, not truncated.
  - Reopen the template → both dropdowns come back populated from the stored `author.mainImage`.

Done means the changes are committed on `feature/ps/linked-content-properties`, author
`Paul Seal <prjseal@gmail.com>`, with no push.
