# Dynamic Images test site

An Umbraco 17 site that references the package as a project, for developing and trying it out.

## Running it

```
dotnet run --project src/DynamicImages.TestSite
```

The site listens on <https://localhost:44343>, backoffice at `/umbraco`.

To skip the setup wizard, copy `appsettings.Local.json.example` to `appsettings.Local.json` and
edit the credentials. That file is gitignored and is only loaded in `DEBUG` builds, so no
credentials are ever committed. Without it the site shows the normal installer instead.

## What you get on first boot

1. The package's migrations create `DynamicImages_Template` and `DynamicImages_Font` and install
   the font media type.
2. The v1 `DynamicImages` block in `appsettings.Development.json` is **auto-imported** into a v2
   template and font. That block is kept deliberately - booting this site is a live test of the
   v1 → v2 import path. Editing it no longer changes what renders; the template is edited in the
   designer from then on.
3. `TestContentSeeder` (in `Composing/`) creates the `issue` document type the sample template
   targets, and publishes two issues. Publishing generates their social images into the media
   library and writes them to each node's `socialImage` picker.

Everything is created only when missing, so later boots are a no-op and deleting something in the
backoffice does not bring it back. To start over, delete `umbraco/Data/` and run again.

## Seeing the backoffice section

Nobody sees the **Dynamic Images** section until it is granted, including administrators:
**Users → User Groups → (your group) → Sections → Dynamic Images**.

## Test assets

`wwwroot/assets/` holds the background, logo, avatar and `OpenSans-Regular.ttf` that the sample
template draws. The property aliases in `TestContentSeeder` and the `SourcePropertyAlias` values in
the sample block have to agree - rename one and the template stops finding it.
