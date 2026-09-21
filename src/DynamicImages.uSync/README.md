# Dynamic Images for uSync

Moves [Dynamic Images](https://www.nuget.org/packages/Umbraco.Community.DynamicImages) templates
and fonts between environments with [uSync](https://usync.org).

Dynamic Images keeps its own data in two tables it creates itself, `DynamicImages_Template` and
`DynamicImages_Font`. Nothing in Umbraco knows they exist, so uSync on its own moves your document
types and data types and leaves the designs behind. This package adds the two handlers that were
missing.

## Installing

```bash
dotnet add package Umbraco.Community.DynamicImages.uSync
```

Nothing to configure. The handlers are found by Umbraco's type loader and a newly discovered
handler is enabled by default, so they appear in the uSync dashboard on the next boot.

## What it does

| | Templates | Fonts |
|---|---|---|
| Folder | `uSync/{version}/DynamicImagesTemplates` | `uSync/{version}/DynamicImagesFonts` |
| Handler alias | `dynamicImagesTemplateHandler` | `dynamicImagesFontHandler` |
| Group | Settings | Settings |
| Priority | 2020 | 2010 |

One `.config` file per row, named after the item's alias. A template's alias is its own; a font
has no alias column, so it gets a slug of its family, weight and slant — `inter-700`,
`inter-400-italic`.

**Fonts import before templates.** A text layer names its font by key, and a template whose font
has not arrived yet fails validation on the way in.

**Export on save.** Saving a template in the designer, or a font on the Fonts dashboard, writes
its file straight away — the same `ExportOnSave` behaviour uSync gives a document type. It honours
`uSync:Settings:ExportOnSave`, and is suppressed while an import is running, so an import does not
trigger an export of what it just read.

## The one thing it cannot do

> uSync moves the template and font **rows**, and Umbraco's own Media handler moves the media
> **nodes** an uploaded font lives in — but uSync does not move media **files**. A `url` or `path`
> font travels completely; an uploaded font arrives as a row pointing at a media item whose binary
> the target environment must already have (Deploy, uSync.Complete, or a re-upload).

A template whose import fails validation — usually a missing font — is reported as a failed action
with the validator's own message, rather than being written in a state that cannot publish.
Deleting a font that a template still uses is refused the same way, naming the templates.

## Versions

This package tracks the uSync **17** line. uSync 18 exists, and NuGet would unify a uSync 18 site
onto uSync 18 assemblies; the handler and serializer base classes are not guaranteed across a
uSync major, so a uSync 18 site needs an 18.x build of this package.

| This package | Dynamic Images | uSync | Umbraco |
|---|---|---|---|
| 1.x | 1.x | 17.3.1+ | 17 |

## What the files look like

```xml
<?xml version="1.0" encoding="utf-8"?>
<DynamicImagesTemplate Key="8f3a1c2d-4b5e-6f70-8192-a3b4c5d6e7f8" Alias="articleOgImage" Level="0">
  <Info>
    <Name>Article OG image</Name>
    <Enabled>true</Enabled>
    <SchemaVersion>2</SchemaVersion>
    <DocTypeAliases>article,blogPost</DocTypeAliases>
  </Info>
  <Design><![CDATA[{ "schemaVersion": 2, "canvas": { ... }, "layers": [ ... ] }]]></Design>
</DynamicImagesTemplate>
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<DynamicImagesFont Key="1c9e2a3b-4c5d-6e7f-8091-a2b3c4d5e6f7" Alias="inter-700" Level="0">
  <Info>
    <FamilyName>Inter</FamilyName>
    <Weight>700</Weight>
    <IsItalic>false</IsItalic>
  </Info>
  <Source Kind="url">
    <Url>https://fonts.gstatic.com/...</Url>
    <Provider>google</Provider>
    <ProviderFamily>Inter</ProviderFamily>
    <ContentHash>...</ContentHash>
  </Source>
  <Styles>
    <Style Name="Title" Size="56" FontStyle="Regular" />
  </Styles>
</DynamicImagesFont>
```

Neither file carries a timestamp. uSync detects change by hashing the serialised XML, so a
`updatedUtc` in there would make every item report as changed immediately after every import.

## Licence

MIT, as Dynamic Images is. uSync itself is MPL-2.0, which is why these handlers ship as a separate
package rather than inside Dynamic Images.
