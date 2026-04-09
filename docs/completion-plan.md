# Completion Plan: Multi-line Text, Avatars & Image Overlays

## Overview

The core text-on-image pipeline works end-to-end. This plan covers the three remaining features needed to ship, split into four self-contained phases that can each be committed and tested independently.

1. **Phase 1** — Multi-line / wrapping text
2. **Phase 2** — Static image overlays
3. **Phase 3** — Avatar / circular image layers
4. **Phase 4** — Dynamic image layers from content properties + cleanup

---

## Phase 1 — Multi-line / wrapping text

**Goal:** Text layers that are too wide wrap onto the next line automatically.

### 1.1 Add `MaxWidth` to `Layer`

**File:** `src/DynamicImages/Models/Layer.cs`

Add one property:

```csharp
public int? MaxWidth { get; set; }
```

### 1.2 Enable wrapping in `WriteLineAsync`

**File:** `src/DynamicImages/Services/DynamicImageService.cs`

Add a `maxWidth` parameter and set `WrappingLength` on `TextOptions`. ImageSharp handles the rest natively — no manual line-splitting needed.

```csharp
private async Task WriteLineAsync(Image image, string text, CancellationToken cancellationToken,
    Color color, Font font, int xPosition, int yPosition, int? maxWidth = null)
{
    var point = new PointF(xPosition, yPosition);
    await Task.Run(() =>
    {
        image.Mutate(x =>
        {
            var options = new TextOptions(font)
            {
                Origin = point,
                WrappingLength = maxWidth ?? -1
            };
            x.DrawText(options, text, color);
        });
    }, cancellationToken);
}
```

### 1.3 Pass `MaxWidth` through in `GenerateImageAsync`

Update the `LayerType.Text` case to pass `layer.MaxWidth`:

```csharp
await WriteLineAsync(image, text, cancellationToken,
    Color.ParseHex(layer.Colour), font, layer.xPosition, layer.yPosition, layer.MaxWidth);
```

### 1.4 Remove the unused manual line methods

Delete `WriteMultipleLinesAsync` and `WriteSingleLine` — they are superseded by `WrappingLength`.

### 1.5 Update appsettings example

Add `MaxWidth` to the title layer in `src/DynamicImages.TestSite/appsettings.Development.json`:

```json
{
  "LayerType": 0,
  "SourcePropertyAlias": "name",
  "MaxWidth": 600,
  "xPosition": 50,
  "yPosition": 60,
  "Colour": "#c13ea9",
  "Font": "OpenSans_Large"
}
```

---

## Phase 2 — Static image overlays

**Goal:** A layer can composite a static image asset (e.g. a logo) onto the base image.

### 2.1 Add image sizing properties to `Layer`

**File:** `src/DynamicImages/Models/Layer.cs`

```csharp
public int? Width { get; set; }
public int? Height { get; set; }
public float Opacity { get; set; } = 1f;
```

### 2.2 Implement `LayerType.Image` in `GenerateImageAsync`

**File:** `src/DynamicImages/Services/DynamicImageService.cs`

Add a new private method and wire it into the switch:

```csharp
case LayerType.Image:
    if (!string.IsNullOrWhiteSpace(layer.ImagePath))
    {
        await DrawImageLayerAsync(image, layer, cancellationToken);
    }
    break;
```

```csharp
private async Task DrawImageLayerAsync(Image baseImage, Layer layer, CancellationToken cancellationToken)
{
    using var stream = _fileSystem.OpenFile(_hostEnvironment.MapPathWebRoot(layer.ImagePath));
    using var overlay = await Image.LoadAsync(stream, cancellationToken);

    if (layer.Width.HasValue || layer.Height.HasValue)
    {
        var targetWidth = layer.Width ?? overlay.Width;
        var targetHeight = layer.Height ?? overlay.Height;
        overlay.Mutate(x => x.Resize(new ResizeOptions
        {
            Size = new Size(targetWidth, targetHeight),
            Mode = ResizeMode.Crop
        }));
    }

    baseImage.Mutate(x => x.DrawImage(overlay, new Point(layer.xPosition, layer.yPosition), layer.Opacity));
}
```

### 2.3 Update appsettings example

Add a static overlay layer to the instruction:

```json
{
  "LayerType": 1,
  "ImagePath": "/assets/overlay-logo.png",
  "xPosition": 850,
  "yPosition": 20,
  "Width": 120,
  "Height": 120,
  "Opacity": 0.9
}
```

---

## Phase 3 — Avatar / circular image layers

**Goal:** An image layer can be cropped to a circle (or any rounded rectangle) before compositing.

### 3.1 Add `CornerRadius` to `Layer`

**File:** `src/DynamicImages/Models/Layer.cs`

```csharp
public float? CornerRadius { get; set; }
```

For a perfect circle, set `CornerRadius` to half the `Width` (e.g. `Width: 100, CornerRadius: 50`).

### 3.2 Apply the circular mask in `DrawImageLayerAsync`

After the resize step, add:

```csharp
if (layer.CornerRadius.HasValue)
{
    var size = new Size(layer.Width ?? overlay.Width, layer.Height ?? overlay.Height);
    var rounded = overlay.Clone(x => x.ConvertToAvatar(size, layer.CornerRadius.Value, Color.Transparent));
    // use rounded instead of overlay for the DrawImage call
}
```

`ConvertToAvatar` already exists in `ImageProcessingContextExtensions` — no new code needed there.

### 3.3 Remove `AddAvatarToImageAsync`

**File:** `src/DynamicImages/Services/DynamicImageService.cs`

Delete the `AddAvatarToImageAsync` method — it is now fully replaced by `DrawImageLayerAsync` with `CornerRadius` set.

Also remove `private const string avatarImagePath` and the unused `_smallFont` / `_largeFont` fields.

### 3.4 Update appsettings example

Add a circular avatar layer:

```json
{
  "LayerType": 1,
  "ImagePath": "/assets/paul-seal.jpg",
  "xPosition": 50,
  "yPosition": 480,
  "Width": 100,
  "Height": 100,
  "CornerRadius": 50,
  "Opacity": 1.0
}
```

---

## Phase 4 — Dynamic image layers from content properties

**Goal:** An image layer's source can be a media picker property on the content node (e.g. an author photo chosen per article), rather than a hardcoded path.

### 4.1 Resolve a media picker property to a file path

**File:** `src/DynamicImages/Services/DynamicImageService.cs`

`IMediaService` is already injected. Add a helper:

```csharp
private string? ResolveMediaPath(IContent contentNode, string propertyAlias)
{
    var rawValue = contentNode.GetValue<string>(propertyAlias);
    if (string.IsNullOrWhiteSpace(rawValue)) return null;

    if (!UdiParser.TryParse(rawValue, out var udi) || udi is not GuidUdi guidUdi)
        return null;

    var media = _mediaService.GetById(guidUdi.Guid);
    return media?.GetValue<string>(Umbraco.Cms.Core.Constants.Conventions.Media.File);
}
```

### 4.2 Use it in `DrawImageLayerAsync`

At the top of `DrawImageLayerAsync`, resolve the path before opening the file:

```csharp
var imagePath = !string.IsNullOrWhiteSpace(layer.SourcePropertyAlias)
    ? ResolveMediaPath(contentNode, layer.SourcePropertyAlias)
    : layer.ImagePath;

if (string.IsNullOrWhiteSpace(imagePath)) return;
```

This means `DrawImageLayerAsync` needs `contentNode` passed in — update the signature accordingly.

### 4.3 Final cleanup

Remove all remaining commented-out code blocks in `GenerateImageAsync`.

### 4.4 Update appsettings example

Show the dynamic avatar using a content property:

```json
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
```

---

## Summary

| Phase | Feature | Files changed |
|---|---|---|
| 1 | Multi-line / wrapping text | `Layer.cs`, `DynamicImageService.cs`, `appsettings.Development.json` |
| 2 | Static image overlays | `Layer.cs`, `DynamicImageService.cs`, `appsettings.Development.json` |
| 3 | Avatar / circular mask | `Layer.cs`, `DynamicImageService.cs`, `appsettings.Development.json` |
| 4 | Dynamic image layers from content + cleanup | `DynamicImageService.cs`, `appsettings.Development.json` |

Each phase builds on the last and can be committed, pushed, and tested independently.
