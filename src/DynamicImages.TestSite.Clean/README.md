# Dynamic Images Clean test site

An Umbraco 17 site built on the [Clean Starter Kit](https://github.com/prjseal/Clean) (the `7.x`
line, which targets Umbraco 17 LTS) that references the Dynamic Images package as a project, for
trying it against a real, content-rich site instead of the minimal `issue` doc type in
[`DynamicImages.TestSite`](../DynamicImages.TestSite).

## Running it

```
dotnet run --project src/DynamicImages.TestSite.Clean
```

The site listens on <https://localhost:44344>, backoffice at `/umbraco`.

To skip the setup wizard, copy `appsettings.Local.json.example` to `appsettings.Local.json` and
edit the credentials. That file is gitignored and is only loaded in `DEBUG` builds, so no
credentials are ever committed. Without it the site shows the normal installer instead.

## What you get on first boot

This project references `Clean.Core`, not `Clean`: `Clean.Core` is Clean's compiled helper code
(extension methods, tag helpers, models support) with no install step of its own. Views
(`Views/`) and front-end assets (`wwwroot/assets`, `wwwroot/css`, `wwwroot/favicon.ico`) are
committed in this project instead - a one-time copy taken from Clean's own install, now ours to
edit, not regenerated on every restore.

Content, media and settings (document types, data types, media types, templates, dictionary
items, the language) come entirely from `uSync/v17` (also committed), imported on first boot
because `uSync:Settings:ImportOnFirstBoot` is set in `appsettings.Development.json`. `uSync/v17`
is a straight copy of the uSync export from Clean's own [Clean.Blog reference
site](https://github.com/prjseal/Clean/tree/dev/v7/template/Clean.Blog/uSync/v17). Dynamic
Images' own migrations run alongside it, creating the `DynamicImages_Template` and
`DynamicImages_Font` tables and the font media type.

Verified end to end against an empty database: uSync imports all 25 content nodes (published),
all 37 media items, all 20 dictionary items, the language, and all 11 templates - with no other
importer involved.

After first boot, per Clean's own setup instructions:

1. Log in to `/umbraco` (`admin@example.com` / `1234567890`, or your own credentials from
   `appsettings.Local.json`).
2. Publish the home page (uSync publishes content on import, so this is usually already done).
3. Save one of the dictionary items in the Translation section, to initialize translations.

To reset content back to what's committed, delete `umbraco/Data/` and run again - uSync's import
is a no-op once its target nodes already exist, but starting from an empty database re-runs it
from scratch. To pull a content/settings change made in the backoffice back into this project,
use uSync's own **Export** action from its backoffice dashboard, which writes back into
`uSync/v17` for you to commit.

## Seeing the Dynamic Images section

Nobody sees the **Dynamic Images** section until it is granted, including administrators:
**Users → User Groups → (your group) → Sections → Dynamic Images**. From there, add a font and
build a template against Clean's `Article` (or any other) document type - see the
[package README](../DynamicImages/README.md) for how templates work.

## The Clean Bean Cafe OG image template

`appsettings.Development.json` carries a v1 `DynamicImages` block that is imported into a v2
template - **Clean Bean OG Image** - the first time this site boots against an empty template
table. It targets the `article` doc type, writes to a new `socialImage` media picker property
(added to the shared `sEOControls` composition, alongside `metaName`/`metaDescription`), and is
branded for [cleanbeancafe.co.uk](https://cleanbeancafe.co.uk):

- A background image (`wwwroot/assets/img/og/clean-bean-background.png`) with the brand's ink
  gradient, cup mark, wordmark and tagline baked in - these don't change per page, so they are
  drawn once rather than as layers.
- Three layers drawn per article on top of that background: the page title, the `subtitle`
  property, and `articleDate`, in the brand's own typefaces (Bricolage Grotesque for the title,
  Hanken Grotesk for the rest - both under `wwwroot/assets/fonts/`) and colour palette.
- A fourth layer places the article's `mainImage` as a rounded photo card on the right.

`Views/Partials/metaData.cshtml` reads `socialImage` for `og:image`/`twitter:image`, falling back
to the static `/socialimage.png` for pages without one (anything that isn't an `article`, or an
`article` published before the template existed - use **Regenerate OG image** from the document's
Actions menu to backfill one).

Once imported, the template is edited in the backoffice designer, not in configuration - see
[Migrating from v1](../DynamicImages/README.md#migrating-from-v1).

## Known issue: the front end 500s

As of `Clean.Core` 7.0.7 and 7.0.8, the seeded `home.cshtml` view calls `Html.GetBlockListHtml(...)`,
which does not exist in the published `Clean.Core` 7.x assembly - confirmed by booting this site
and by inspecting the nupkgs directly. The front end 500s as a result; this is an upstream
packaging bug in Clean, not something this project can fix. It does not block Dynamic Images
work: the backoffice boots fine, content publishes fine, and templates are built entirely in the
backoffice designer, which never touches Clean's front-end views. If Clean ships a fix, bump the
`Clean.Core` version pinned in `Directory.Packages.props`.
