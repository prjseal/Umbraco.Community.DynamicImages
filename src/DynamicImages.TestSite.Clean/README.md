# Dynamic Images Clean test site

An Umbraco 17 site built from the [Clean Starter Kit](https://github.com/prjseal/Clean) (the
`7.x` line, which targets Umbraco 17 LTS) that references the package as a project, for trying
Dynamic Images against a real, content-rich site instead of the minimal `issue` doc type in
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

Clean's own migration installs its document types, views and assets, and imports its sample
content (a home page and a few blog articles) - see the [Clean docs](https://github.com/prjseal/Clean)
for the full list. Dynamic Images' own migrations run alongside it, creating the
`DynamicImages_Template` and `DynamicImages_Font` tables and the font media type.

After first boot, per Clean's own setup instructions:

1. Log in to `/umbraco` (`admin@example.com` / `1234567890`, or your own credentials from
   `appsettings.Local.json`).
2. Publish the home page.
3. Save one of the dictionary items in the Translation section, to initialize translations.

## Seeing the Dynamic Images section

Nobody sees the **Dynamic Images** section until it is granted, including administrators:
**Users → User Groups → (your group) → Sections → Dynamic Images**. From there, add a font and
build a template against Clean's `Article` (or any other) document type - see the
[package README](../DynamicImages/README.md) for how templates work.

## Keeping Clean up to date

This project references the `Clean` NuGet package directly (rather than `Clean.Core`), which
means every start re-imports Clean's views and assets. That matches Clean's own guidance for a
site that's still being set up. If this site is later used for anything beyond exercising Dynamic
Images against Clean's content types, switch to `Clean.Core` first - see
["Important" in the Clean README](https://github.com/prjseal/Clean#umbraco-17-lts).

The copied-in `Views/` and `wwwroot/assets|css|favicon.ico` are gitignored on purpose - they are
Clean's, regenerated on every restore, and not this repo's to diff or maintain.

## Known issue: the front end 500s

As of `Clean` 7.0.7 and 7.0.8, the sample `home.cshtml` view Clean seeds calls
`Html.GetBlockListHtml(...)`, which does not exist in the published `Clean.Core` 7.x assembly -
confirmed by booting this site and by inspecting both nupkgs directly. The front end 500s as a
result; this is an upstream packaging bug in Clean, not something this project can fix. It does
not block Dynamic Images work: the backoffice boots fine, content publishes fine (Clean's sample
content imports and publishes on first boot), and templates are built entirely in the backoffice
designer, which never touches Clean's front-end views. If Clean ships a fix, bump the version
pinned in `Directory.Packages.props`.
