# Native tree actions for Templates, and a Fonts tree — plan
> nothing is implemented here.

## Context

The user wants the Dynamic Images section tree to behave like Umbraco's own content tree:

- folders under **Templates**
- a template's ⋯ menu offering **Duplicate to**, **Move** and **Delete**
- **Fonts** in the same sidebar, with the same kind of tree, folders and actions

Every action must be Umbraco's own entity-action kind, with its modal, tree picker, notifications
and tree reload, not a lookalike.

### What already exists (commit `b78c286`, PR #24)

- **Templates tree.** A native `tree`, `treeItem` and `menuItem` stack (`Client/src/tree/*`) with
  entity types `di-template-root`, `di-template-folder` and `di-template`.
- **Template folders:**
  - server: `DynamicImages_TemplateFolder`, `TemplateFolderService`, `TemplateFoldersController`
  - client: create-folder option, `folderUpdate` (rename), `folderDelete` and a folder workspace
  - uSync: a `DynamicImagesTemplateFolderSerializer`
- **Template actions** (`Client/src/entity-actions/manifests.ts`):
  - `moveTo` (templates and folders), `delete`, `duplicate` (**same folder only**)
  - Export, Regenerate, Import and Reload children
- **Collection.** Root and folder workspaces show a collection (table and card views) of
  `GET collection/templates`.
- **Fonts** are a hand-built dashboard (`dashboards/di-fonts-dashboard.element.ts`), opened from
  a *link* menu item in `umbraco-package.json`.
  - Storage is one `DynamicImages_Font` row per family, weight and italic. There is no parent and
    no sort order.
  - Templates reference a **variant row's key** (`TextStyle.FontKey`, `BadgesLayer.FontKey`).
  - `FontService.Delete` refuses (409) while templates use the font.

### Decisions made with the user

1. **Fonts appear as family → variants.** A family node, for example "Inter", has one child per
   variant ("Regular 400", "Bold 700 Italic"). Move and Delete act on the whole family; each
   variant opens its own editor.
2. **Fonts get folders**, the same as templates: create, rename, move and delete.
3. **Extra native actions**, all chosen:
   - **Sort children** on the root and on folders, in both trees
   - **Delete shows references** (`deleteWithRelation`): deleting a font lists the templates that
     use it
   - **Enable / Disable template** as two tree actions, the same way Publish and Unpublish
     appear together
   - **Bulk actions in the collections**: Move to, Duplicate to and Delete on a selection
4. **Duplicate to** replaces the same-folder `duplicate`, as it does on documents and data types.
5. **No recycle bin.** Delete stays a hard delete; the user asked for Delete, not Trash.

### What Umbraco provides (verified in `@umbraco-cms/backoffice@17.5.3`, `dist-cms/packages`)

**Entity-action kinds** (`type: "kind", matchType: "entityAction"`), with the meta fields their
actions actually read:

| Kind | Meta the action reads | Repository interface |
|---|---|---|
| `duplicateTo` (`core/tree/entity-actions/duplicate-to`) | `duplicateRepositoryAlias`, `treeRepositoryAlias`, `treeAlias`, `foldersOnly?` | `UmbDuplicateToRepository.requestDuplicateTo({ unique, destination: { unique } })` |
| `moveTo` | `treeRepositoryAlias`, `moveRepositoryAlias`, `treeAlias`, `foldersOnly?` | already implemented (`move/move.repositories.ts`) |
| `sortChildrenOf` | `sortChildrenOfRepositoryAlias`, `treeRepositoryAlias` (the action file reads these; the kind's default meta lists `itemRepositoryAlias`/`sortRepositoryAlias`, which are stale) | `UmbSortChildrenOfRepository.sortChildrenOf({ unique, sorting: [{ unique, sortOrder }] })` |
| `deleteWithRelation` (`relations/relations/entity-actions/delete`) | `itemRepositoryAlias`, `detailRepositoryAlias`, `referenceRepositoryAlias` | `UmbEntityReferenceRepository`: `requestReferencedBy(unique, skip, take)`, `requestAreReferenced(uniques, …)`, optional `requestDescendantsWithReferences` |
| `folderUpdate`, `folderDelete`, `folder` (create option) | `folderRepositoryAlias` | already implemented |
| `reloadTreeItemChildren`, `create`, `default` | — | already used |

- The confirm modal renders each reference with `umb-entity-item-ref`, which resolves an
  `entityItemRef` extension by entity type. We need one for `di-template`.
- **Entity-bulk-action kinds** (`matchType: "entityBulkAction"`):

  | Kind | Meta | Repository |
  |---|---|---|
  | `moveTo` | `bulkMoveRepositoryAlias`, `treeAlias` | `UmbBulkMoveToRepository.requestBulkMoveTo({ uniques, destination })` |
  | `duplicateTo` | `bulkDuplicateRepositoryAlias`, `treeAlias` | `UmbBulkDuplicateToRepository.requestBulkDuplicateTo({ uniques, destination })` |
  | `delete` | `itemRepositoryAlias`, `detailRepositoryAlias` | — |
  | `deleteWithRelation` | adds `referenceRepositoryAlias` | — |

  The table collection view turns on selection once any bulk action applies to the collection.
- **What documents get** (the target look and feel):
  - Create, Duplicate to, Move to, Sort children, Delete/Trash with relations, Reload children
  - plus Publish/Unpublish, Rollback, Notifications, Culture and hostnames and Create blueprint,
    none of which apply here
- **Data types** (a settings tree with folders, the closest analogue) get Create, Folder,
  Duplicate to, Move to and `deleteWithRelation`. Their folders get no duplicate.

## Design

### A. Templates tree

**Actions.** Template (`di-template`):

| Label | Kind | Notes |
|---|---|---|
| Duplicate to… | `duplicateTo` | tree picker with `foldersOnly: true`; replaces `duplicate` |
| Move to… | `moveTo` | exists |
| Enable / Disable | `default` ×2 | new |
| Export JSON / Regenerate all | `default` | exist |
| Delete | `delete` | exists; templates have no inbound references, so no `deleteWithRelation` |

Folder (`di-template-folder`):
- Create (Template, Folder)
- Import JSON
- **Sort children** (new)
- Rename (`folderUpdate`) and Move to (exist)
- Delete (`folderDelete`, still refused unless empty)
- Reload

Root (`di-template-root`): Create, Import, **Sort children** (new) and Reload.

**Duplicate to.**
- Server: `POST templates/{key}/duplicate` takes an optional body
  `DuplicateRequest(Guid? TargetKey)`. With no body it keeps the old same-folder behaviour, so
  existing callers don't break.
- `ITemplateService.DuplicateAsync(key, targetKey, userKey)` checks the target:
  - a `TargetKey` that is not a folder returns `TreeOperationOutcome.TargetNotFound`, which the
    controller maps to 400 ProblemDetails
  - otherwise the copy gets `ParentKey = targetKey`
- The name/alias/layer-key regeneration stays.
- Client: `DiDuplicateTemplateRepository` implements `UmbDuplicateToRepository`.
  - After success it dispatches `UmbRequestReloadChildrenOfEntityEvent` on the destination, the
    same trick as `move.repositories.ts`, since core reloads only the source.

**Enable / Disable.**
- `PUT templates/{key}/enabled` with body `{ isEnabled }`, backed by
  `TemplateService.SetEnabledAsync`.
  - It bumps `updatedUtc`, so an open workspace's next save gets the existing 412 instead of
    silently re-enabling.
  - It publishes Saved, so uSync and file sync re-export.
- Two `default` actions (`enable-template.action.ts`, `disable-template.action.ts`) call it and
  show a notification. Then they dispatch `UmbRequestReloadStructureForEntityEvent` so the tree
  item's icon (grey when disabled) refreshes.
- Running one on a template already in that state is a no-op with an info notification, the same
  as core's publish on a published node.

**Sort children.**
- `PUT tree/sort` with body `{ parentKey, sorting: [{ key, sortOrder }] }` writes `sortOrder` to
  whichever table each key lives in, folder or template.
- `TemplateTree.ChildrenOf` orders by `SortOrder`, then folders first, then name. Every existing
  row has `sortOrder = 0`, so today's folders-first alphabetical order holds until someone sorts.
- Create, duplicate, import and move all append: `sortOrder = max(siblings) + 1`.
- `TemplateRepository.Update` has a hand-written SET list, so `sortOrder` goes into it.
- Client: `sort-children.repository.ts` implements `UmbSortChildrenOfRepository` over a new
  `sortTreeChildren` API function.

**Bulk actions** on the Templates collection (`forEntityTypes: [di-template, di-template-folder]`
with a `Umb.Condition.CollectionAlias` condition):

| Bulk action | Endpoint | Behaviour |
|---|---|---|
| Move to (`moveTo`) | `PUT tree/bulk-move` `{ keys, targetKey }` | Resolves each key to a folder or a template and reuses `MoveAsync` and `TemplateFolderService.Move` (cycle checks included). Returns per-key failures as ProblemDetails `errors`. |
| Duplicate to (`duplicateTo`) | `POST templates/bulk-duplicate` `{ keys, targetKey }` | Duplicates templates. Folders in the selection are skipped and named in a warning; data types don't duplicate folders either. |
| Delete (`delete`) | the existing item and detail repositories, one DELETE per item | No new endpoint. Folders are deleted with the templates, and a non-empty folder's 409 surfaces as core's error notification. |

After each bulk action, `UmbRequestReloadChildrenOfEntityEvent` fires on the source and the
destination.

### B. Fonts tree

**Menu.** Remove the Fonts *link* item from `umbraco-package.json` and add a `menuItem` of kind
`tree`: "Fonts", weight 100, so it keeps its place above Templates, which is at 200. Retire
`di-fonts-dashboard.element.ts`, since its list becomes the collection and its editor becomes the
workspaces. Keep the dashboard route alias alive as a redirect to the Fonts root workspace, in
case anyone has bookmarked it.

**Entity types** (`Client/src/fonts/tree/constants.ts`):

| Entity type | Icon | Tree node |
|---|---|---|
| `di-font-root` | — | the root |
| `di-font-folder` | `icon-folder` | container |
| `di-font-family` | `icon-font` | container, with the variants as children |
| `di-font` | `icon-font color-grey`, or `icon-cloud` for web fonts | leaf, one variant row |

**Storage** (new migration `dynamicimages-font-tree-v1`, `Migrations/AddFontTree.cs`, modelled
on `AddTemplateFolders.cs`):

1. New table `DynamicImages_FontFolder`, the same shape as `TemplateFolderDto`.
2. New table `DynamicImages_FontFamily`: `id`, `key` (unique), `name`, `parentKey` (indexed,
   null means root), `sortOrder`, timestamps.
3. `DynamicImages_Font` gets `familyKey` (indexed) and `sortOrder`.
4. Backfill: group existing rows by `FamilyName` (trimmed, case-insensitive), insert one family
   per group at the root, and set `familyKey` on the rows.

`FontDefinition.FamilyName` stays, because the renderer and FontFace loader use it. Renaming a
family rewrites `FamilyName` on its variants in the same transaction.

**Server.**
- Models: `FontFolder` and `FontFamily`, plus `FamilyKey` and `SortOrder` on `FontDefinition`.
- `FontRepository` gets the new columns. New `FontFolderRepository` and `FontFamilyRepository`.
- **Generalise the tree builder.** Extract the logic of `Core/Services/TemplateTree.cs` into a
  generic `FolderTree<TLeaf>`: children, ancestors, cycle checks, effective parent, and sort
  order then folders first then name. `TemplateTree` becomes a thin wrapper, so
  `TemplateTreeTests` still passes. `FontTree` also uses it, and adds the family → variant level.
- `FontFolderService` (create, rename, move, delete-if-empty, upsert) mirrors
  `TemplateFolderService`, including the reuse of `TreeOperationOutcome`.
- `IFontService` additions:
  - `GetFamilies`, `RenameFamily`, `MoveFamily(key, folderKey)`
  - `DeleteFamily`, which refuses if any variant is in use and returns those templates, as
    `Delete` does
  - `SortChildren`
  - `TemplatesUsingFamily`
- `UploadAsync`, `RegisterPathAsync` and `RegisterWebFontAsync` take an optional `familyKey` and
  `parentKey`:
  - with a family: add variants to it
  - otherwise: find or create a family by name in `parentKey`
  
  So a Google family with five weights becomes one family node with five children.
- `FontTreeController`, modelled on `TemplateTreeController`:
  - `GET fonts/tree/root|children|ancestors`
  - `GET fonts/item?key=` (families and variants)
  - `GET fonts/collection?parentKey&filter&skip&take` (folders and families)
  - `GET fonts/{key}/references?skip&take` and `GET fonts/are-referenced?keys=`, where a family
    key rolls up its variants
  - `PUT fonts/families/{key}/move`, `PUT fonts/folders/{key}/move`
  - `PUT fonts/tree/sort`, `PUT fonts/tree/bulk-move`
- `FontFoldersController`: `POST/GET/PUT/DELETE fonts/folders[/{key}]`.
- `FontFamiliesController`: `GET/PUT/DELETE fonts/families/{key}`, where DELETE returns 409
  naming the templates.
- `FontsController`:
  - the three create endpoints accept `familyKey` and `parentKey`
  - `GET fonts` responses gain `familyKey`
  - everything else is unchanged, so the designer's font picker is unaffected

**Client** (`Client/src/fonts/`, laid out like `tree/` and `entity-actions/`):
- **Tree stack:**
  - `tree/font-tree.repository.ts`, `tree/font-tree.server.data-source.ts`, `tree/manifests.ts`
  - `folder/*`, copying the template folder files with font aliases
- **Workspaces:**
  - Root and folder workspaces: a `collection` view of folders and families, in a table
    (name, variants, used by) and cards.
  - **Family** workspace (`di-font-family-workspace`, routable):
    - editable name (header), saved through `PUT fonts/families/{key}`
    - a "Variants" collection view (preview sample, weight, style, source, used-by count)
  - **Variant** workspace (`di-font-workspace`, routable):
    - the style editor, lifted from the dashboard's `#renderStyleEditor`
    - weight, italic, source details, a live sample through `designer/fonts/font-face-loader.ts`
    - a "Used by" info list, from the references repository
- **Create options** (`entityCreateOptionAction`), all reusing `DI_FONT_UPLOAD_MODAL`. The modal
  gets an optional `familyKey`/`parentKey` in its data and one start tab per option:

  | Where | Options |
  |---|---|
  | Root and folders | Upload font file, Web font (Google/Bunny/URL), Font from path, Folder |
  | Families | Add variant (the same modal, locked to the family) |

**Font actions:**

| Entity | Actions |
|---|---|
| Family | Create (Add variant), Move to (`moveTo`, `foldersOnly: true`), Rename (open the workspace; core has no generic rename kind for non-folders), **Delete** (`deleteWithRelation`, listing the templates), Reload |
| Variant | Refresh (`default`, web fonts only; not shown for others through a condition on a `isUrlFont` tree-item flag, or hidden with a no-op notification), **Delete** (`deleteWithRelation`) |
| Folder | Create, Rename, Move to, **Sort children**, Delete (if empty), Reload |
| Root | Create, **Sort children**, Reload |

- No Duplicate to for fonts: a copy would be the same file under the same family name, and the
  renderer would treat it as a duplicate.
- **References.** Add an `entityItemRef` for `di-template` (`uui-ref-node` with name, icon, and
  an href to the template workspace) so the delete modal's list renders properly.
- **Bulk actions** on the fonts collection: Move to (folders and families) and Delete
  (`deleteWithRelation`). There is no bulk duplicate.

**uSync** (`src/DynamicImages.uSync/`):
- New handlers and serializers:
  - `DynamicImagesFontFolder` (`Info/Parent`, `Level`, `SortOrder`)
  - `DynamicImagesFontFamily` (`Parent`, `SortOrder`, `Name`)
- `DynamicImagesFontSerializer` writes `FamilyKey` and `SortOrder`. A missing family on import
  falls back to find-or-create by `FamilyName`, so old exports still import.
- Priorities:
  1. font folders
  2. font families
  3. fonts
  4. template folders
  5. templates
- New constants in `DynamicImagesUSyncConstants.cs` (folder names, aliases, entity types,
  serializer ids with new GUIDs).
- `SyncService` (file sync) is templates only today. Leave it alone.

## Files

**New (server):**
- `Core/Models/FontFolder.cs`, `Core/Models/FontFamily.cs`
- `Core/Services/FolderTree.cs`, `Core/Services/FontTree.cs`
- `Core/Services/IFontFolderService.cs` and `FontFolderService.cs`
- `Persistence/Dtos/FontFolderDto.cs`, `Persistence/Dtos/FontFamilyDto.cs`
- `Persistence/FontFolderRepository.cs`, `Persistence/FontFamilyRepository.cs` (with interfaces)
- `Migrations/AddFontTree.cs`
- `Api/Controllers/FontTreeController.cs`, `FontFoldersController.cs`, `FontFamiliesController.cs`
- uSync: 2 handlers and 2 serializers

**New (client):**
- `src/fonts/**`: tree, folder, workspaces, collection, entity-actions, repositories
- `entity-actions/duplicate-to-template.repository.ts` (replaces `duplicate-template.repository.ts`)
- `entity-actions/enable-template.action.ts`, `entity-actions/disable-template.action.ts`
- `entity-actions/sort/sort-template-children.repository.ts`
- `entity-actions/bulk/*`: bulk move and bulk duplicate repositories
- `item-ref/di-template-item-ref.element.ts`

**Modified:**
- `Core/Models/FontDefinition.cs`, `Persistence/Dtos/FontDto.cs`, `Persistence/FontRepository.cs`
- `Core/Services/IFontService.cs` and `FontService.cs`
- `Core/Services/TemplateTree.cs` (becomes a wrapper), `ITemplateService`/`TemplateService`
  (DuplicateAsync target, SetEnabledAsync, SortChildren, append sort order)
- `Persistence/TemplateRepository.cs` (`sortOrder` in the SET list)
- `Api/Controllers/TemplatesController.cs`, `TemplateTreeController.cs`, `FontsController.cs`,
  `Api/Models/ApiModels.cs`
- `Migrations/DynamicImagesMigrationComponent.cs` (new step)
- composer/DI registration
- `Client/src/api/dynamic-images-api.ts` and `types.ts`: hand-written functions for every new
  endpoint, since there is no generated client
- `Client/src/entity-actions/manifests.ts`, `Client/src/manifests.ts`
- `Client/src/modals/di-font-upload-modal.element.ts` (family and parent data)
- `wwwroot/App_Plugins/DynamicImages/umbraco-package.json` (drop the Fonts link item)
- uSync font serializer and constants
- the committed bundle under `wwwroot/App_Plugins/DynamicImages/`

**Reused as-is:**
- `move/move.repositories.ts` (`DiMoveRepositoryBase`), `api/di-execute.ts`
- the template folder data source and workspace (as the pattern to copy)
- `designer/fonts/font-face-loader.ts`, `DI_FONT_UPLOAD_MODAL`
- `TreeOperationOutcome`, `FontService.TemplatesUsing`

**Removed:** `dashboards/di-fonts-dashboard.element.ts` and its dashboard manifest, replaced by a
redirect.

## Implementation order

1. **Templates: Duplicate to.** Server body and service, the client repository, then the manifest
   swap from `duplicate` to `duplicateTo`. Test: duplicating into a folder, and into a folder
   that doesn't exist (400).
2. **Templates: Enable/Disable.** Endpoint, service and the two actions.
3. **Sort children, templates side:**
   - `FolderTree<T>` extraction (keep `TemplateTreeTests` green, and add sort-order tests)
   - `sortOrder` writes
   - the sort endpoint, repository and manifests
4. **Templates bulk actions:** the bulk-move and bulk-duplicate endpoints, the bulk
   repositories, the three `entityBulkAction` manifests, and a check that table selection
   appears.
5. **Fonts storage:** models, DTOs, repositories, migration and backfill, plus unit tests for the
   backfill grouping and `FontTree`.
6. **Fonts services and APIs:** folder service, family operations, and create endpoints that
   accept family and parent.
7. **Fonts client tree:** tree stack and menu item swap, folders, root/folder collection, and the
   create options with modal changes.
8. **Fonts workspaces:** family and variant (lift the style editor), then retire the dashboard
   and add the redirect.
9. **Fonts actions:**
   - `moveTo`
   - `deleteWithRelation` with the references repository and the `di-template` `entityItemRef`
   - Refresh, sort children, and bulk move/delete
10. **uSync:** font folder and family handlers, font serializer fields, priorities, serializer
    tests.
11. **E2E specs**, then rebuild and commit the bundle.

Each step builds and passes tests on its own and can be a separate commit.

## Verification

- **Tooling** (see `CLAUDE.md`):
  - `dotnet build src/DynamicImages.sln` and `dotnet test test/DynamicImages.Tests`
  - client: `npm ci && npm run typecheck && npm test && npm run test:browser && npm run build`
  - commit the rebuilt bundle, which `ci.yml` checks
- **Unit tests (C#):**
  - `FolderTree` ordering by sortOrder, with ties folders-first then name
  - cycle checks on font folders
  - family backfill grouping (case and whitespace)
  - `DuplicateAsync` to a target and to a missing target
  - `DeleteFamily` refused while in use
  - font folder and family serializer round trips, and an old font export with no `FamilyKey`
    importing into a found-or-created family
- **E2E** (`Client/e2e/`, against the booted Clean site, following `CLAUDE.md` "Driving the
  backoffice from a session"). Extend `tree-and-collection.spec.ts`:
  - ⋯ on a template shows **Duplicate to…**, **Move to…**, **Enable**, **Disable** and
    **Delete**
  - Duplicate to a folder puts the copy under that folder
  - Disable greys the icon
  - Sort on the root reorders the tree
  - selecting two templates in the collection shows bulk Move to, Duplicate to and Delete, and
    Move to works
- **New `fonts-tree.spec.ts`:**
  - the Fonts tree lists the uSync fixture's families with variant children
  - create a folder
  - move a family into it
  - Delete on a font used by "Article OG image" opens the references modal listing that template
    and is refused
  - Delete on an unused family removes it
  - the variant workspace's style editor saves, which replaces the old
    `fonts-and-title.spec.ts` dashboard steps; update that spec
- **By hand in the backoffice:**
  - compare each ⋯ menu against a content node's and a data type's: labels, icons, order by
    weight, the tree picker modal, success notifications, the tree refreshing in place
  - check the designer's font picker still lists every variant after the migration
