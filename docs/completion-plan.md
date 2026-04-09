# Completion Plan: Multi-line Text, Avatars & Image Overlays

## Overview

The core text-on-image pipeline works end-to-end. This plan covers the three remaining features needed to ship:

1. Multi-line / wrapping text
2. Image overlay layers (static assets)
3. Avatar layers (circular-cropped images, optionally from a content property)

---

## Step 1 — Extend the `Layer` model

**File:** `src/DynamicImages/Models/Layer.cs`

Add the following properties:

| Property | Type | Purpose |
|---|---|---|
| `MaxWidth` | `int?` | If set, text wraps at this pixel width |
| `Width` | `int?` | Resize an image layer to this width |
| `Height` | `int?` | Resize an image layer to this height |
| `CornerRadius` | `float?` | Rounds image corners. Set to `Width / 2` for a circle |
| `Opacity` | `float` | Image layer opacity. Default `1f` (currently hardcoded) |

No new `LayerType` enum values are needed. `LayerType.Image` covers both flat overlays and avatars — a circular avatar is just an image layer where `CornerRadius >= Width / 2`.

---

## Step 2 — Multi-line text

**File:** `src/DynamicImages/Services/DynamicImageService.cs`

ImageSharp's `TextOptions` has a `WrappingLength` property that handles auto-wrapping natively. No manual line-splitting is needed.

Update `WriteLineAsync` to accept an optional `maxWidth` parameter and set it on `TextOptions`:

```csharp
var options = new TextOptions(font)
{
    Origin = point,
    WrappingLength = maxWidth ?? -1  // -1 = no wrapping
};
```

In `GenerateImageAsync`, pass `layer.MaxWidth` through to `WriteLineAsync`.

The existing `WriteMultipleLinesAsync` and `WriteSingleLine` methods can be removed since ImageSharp's native wrapping replaces them.

---

## Step 3 — Image layer handler

**File:** `src/DynamicImages/Services/DynamicImageService.cs`

Add a `case LayerType.Image:` block to the switch in `GenerateImageAsync`. The sequence is:

1. **Resolve path** — if `layer.SourcePropertyAlias` is set, read the path from the content property (see Step 4); otherwise use `layer.ImagePath` directly.
2. **Load** — open with `_fileSystem.OpenFile(...)`, same pattern as the base image.
3. **Resize** — if `layer.Width` or `layer.Height` is set, apply `ResizeOptions` with `ResizeMode.Crop`.
4. **Circular mask** — if `layer.CornerRadius` is set, call `overlayImage.Clone(x => x.ConvertToAvatar(new Size(width, height), cornerRadius, Color.Transparent))`. The extension already exists in `ImageProcessingContextExtensions`.
5. **Composite** — `image.Mutate(x => x.DrawImage(overlayImage, new Point(layer.xPosition, layer.yPosition), layer.Opacity))`.

---

## Step 4 — Resolve media picker paths

For image layers driven by a content property (e.g. an author avatar stored as a media picker), the physical path needs to be resolved from the media item.

`IMediaService` is already injected into `DynamicImageService`. The approach:

1. Get the raw value from the content node — it will be a `Udi`.
2. Parse to a `GuidUdi` and look up the media item via `_mediaService.GetById(guid)`.
3. Read the file path from the media item's `umbracoFile` property.
4. Map to a physical path via `_hostEnvironment.MapPathWebRoot(...)`.

---

## Step 5 — Clean up dead code

**File:** `src/DynamicImages/Services/DynamicImageService.cs`

- Remove `private const string avatarImagePath` (hardcoded path, no longer needed).
- Remove unused private fields `_smallFont` and `_largeFont` (declared but never assigned).
- Remove `AddAvatarToImageAsync` (replaced by the generic image layer handler).
- Remove `WriteMultipleLinesAsync` and `WriteSingleLine` (replaced by `WrappingLength`).
- Delete all commented-out code blocks in `GenerateImageAsync`.

---

## Step 6 — Update test site configuration

**File:** `src/DynamicImages.TestSite/appsettings.Development.json`

Update the example instruction to demonstrate all three layer types:

```json
{
  "Layers": [
    {
      "LayerType": 0,
      "Font": "OpenSans_large",
      "SourcePropertyAlias": "title",
      "MaxWidth": 600,
      "xPosition": 50,
      "yPosition": 60,
      "Colour": "FFFFFF"
    },
    {
      "LayerType": 1,
      "ImagePath": "/assets/overlay-logo.png",
      "xPosition": 850,
      "yPosition": 20,
      "Width": 120,
      "Height": 120,
      "Opacity": 0.9
    },
    {
      "LayerType": 1,
      "SourcePropertyAlias": "authorPhoto",
      "xPosition": 50,
      "yPosition": 480,
      "Width": 100,
      "Height": 100,
      "CornerRadius": 50,
      "Opacity": 1.0
    }
  ]
}
```

---

## Order of work

| # | Task | File(s) |
|---|---|---|
| 1 | Add 5 properties to `Layer` | `Models/Layer.cs` |
| 2 | Add `maxWidth` param to `WriteLineAsync`, set `WrappingLength` | `Services/DynamicImageService.cs` |
| 3 | Pass `layer.MaxWidth` through in the Text case | `Services/DynamicImageService.cs` |
| 4 | Implement `LayerType.Image` case (load, resize, mask, composite) | `Services/DynamicImageService.cs` |
| 5 | Add media picker path resolution helper | `Services/DynamicImageService.cs` |
| 6 | Remove dead code and unused fields | `Services/DynamicImageService.cs` |
| 7 | Update appsettings example | `appsettings.Development.json` |

Roughly 100–150 lines of real changes across 3 files.
