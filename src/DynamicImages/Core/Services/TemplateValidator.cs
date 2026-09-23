using System.Text.RegularExpressions;
using SixLabors.ImageSharp.PixelFormats;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Community.DynamicImages.Core.Rendering.Layers;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed partial class TemplateValidator(
    IFontRepository fontRepository,
    IMediaService mediaService,
    IImageSourceProvider imageSources,
    IContentTypeService contentTypeService,
    IDataTypeService dataTypeService,
    IWebHostEnvironment hostEnvironment) : ITemplateValidator
{
    public async Task<ValidationResult> ValidateAsync(Template template, CancellationToken cancellationToken = default)
    {
        var issues = new List<ValidationIssue>();

        ValidateIdentity(template, issues);
        ValidateCanvas(template, issues);
        ValidateLayerCount(template, issues);
        ValidateTransparency(template, issues);
        await ValidateBaseImageAsync(template, issues, cancellationToken);
        await ValidateDocTypesAndTargetAsync(template, issues);
        ValidateOutputFolder(template, issues);

        var fontKeys = fontRepository.GetAll().Select(f => f.Key).ToHashSet();
        var propertyAliases = KnownPropertyAliases(template);

        foreach (var layer in template.Layers)
        {
            ValidateLayer(template, layer, fontKeys, propertyAliases, issues);
        }

        issues.AddRange(RelativeLayout.Problems(template));

        return new ValidationResult(issues);
    }

    private static void ValidateIdentity(Template template, List<ValidationIssue> issues)
    {
        if (string.IsNullOrWhiteSpace(template.Name))
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "NameRequired", "The template needs a name."));

        if (string.IsNullOrWhiteSpace(template.Alias))
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "AliasRequired", "The template needs an alias."));
        else if (!AliasPattern().IsMatch(template.Alias))
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "AliasInvalid",
                "The alias may only contain letters, numbers, hyphens and underscores, and must start with a letter."));
    }

    private static void ValidateLayerCount(Template template, List<ValidationIssue> issues)
    {
        if (template.Layers.Count > RenderLimits.MaxLayers)
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "TooManyLayers",
                $"A template may have at most {RenderLimits.MaxLayers} layers; this one has {template.Layers.Count}."));
        }
    }

    private static void ValidateCanvas(Template template, List<ValidationIssue> issues)
    {
        // The same numbers the renderer enforces, so the designer cannot save a template that
        // then refuses to render. RenderLimits is the single source; this only reports it.
        if (RenderLimits.CanvasProblem(template.Canvas.Width, template.Canvas.Height) is { } canvasProblem)
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "CanvasSizeInvalid", canvasProblem));
        }

        foreach (var alias in PropertyAliasesOf(template.Canvas.BaseImage))
        {
            WarnIfTooDeep(alias, "The canvas base image", null, issues);
        }

        if (!string.IsNullOrWhiteSpace(template.Canvas.Background) &&
            !ColourParser.TryParse(template.Canvas.Background, out _))
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "ColourInvalid",
                $"'{template.Canvas.Background}' is not a valid canvas background colour. Use #RRGGBB or #RRGGBBAA."));
        }

        // A stale colour under a gradient is still worth reporting: the gradient may be switched
        // off again, and the colour is what comes back.
        if (template.Canvas.BackgroundGradient is { } gradient)
        {
            ValidateGradient(gradient, "The canvas background gradient", null, issues);
        }
    }

    /// <summary>
    /// JPEG has no alpha channel, so anything transparent is flattened to whatever hex happened to
    /// be under the zero alpha - which is not a choice anyone made. A warning rather than an error:
    /// flattening is a legitimate thing to want, and this says what will actually be drawn.
    /// </summary>
    private static void ValidateTransparency(Template template, List<ValidationIssue> issues)
    {
        if (template.Output.Format != OutputFormat.Jpeg || !FillCarriesAlpha(template.Canvas)) return;

        // Cover and stretch always fill the canvas, so a warning there would be noise; contain
        // pads with transparency, and a property source that resolves to nothing covers nothing.
        var covered = template.Canvas.BaseImage.Kind != ImageSourceKind.None
            && template.Canvas.BaseImageFit is ImageFitMode.Cover or ImageFitMode.Stretch;

        if (covered) return;

        issues.Add(new ValidationIssue(ValidationSeverity.Warning, "TransparencyNotKept",
            "The output format is JPEG, which has no transparency, so the transparent parts of this template will be flattened to whatever colour is underneath them. Use PNG or WebP to keep it."));
    }

    private static bool FillCarriesAlpha(CanvasSettings canvas)
    {
        // The gradient is the fill when it is set, as on a shape layer, so the colour beneath it
        // says nothing about what is drawn.
        if (canvas.BackgroundGradient is { } gradient) return GradientGeometry.EffectiveStops(gradient).Any(stop => HasAlpha(stop.Colour));

        // An empty background is the quiet path to transparency: ParseOrDefault falls back to
        // Color.Transparent and the validator deliberately skips empty colours.
        return string.IsNullOrWhiteSpace(canvas.Background) || HasAlpha(canvas.Background);
    }

    private static bool HasAlpha(string? value)
        => ColourParser.TryParse(value, out var colour) && colour.ToPixel<Rgba32>().A < 255;

    /// <summary>
    /// A gradient's stops and, for a radial one, its centre - shared by the canvas and by a shape
    /// layer, so the two report the same problems in the same words.
    /// </summary>
    /// <summary>More stops than this is a mistake, or a paste from somewhere else.</summary>
    internal const int MaxGradientStops = 16;

    private static void ValidateGradient(Gradient gradient, string what, Guid? layerKey, List<ValidationIssue> issues)
    {
        RequireColour(gradient.From, what, layerKey, issues);
        RequireColour(gradient.To, what, layerKey, issues);

        if (gradient.Stops is { } stops)
        {
            if (stops.Count > MaxGradientStops)
            {
                issues.Add(new ValidationIssue(ValidationSeverity.Warning, "GradientTooManyStops",
                    $"{what} has {stops.Count} colour stops; more than {MaxGradientStops} is more than anyone can tell apart.", layerKey));
            }

            // A warning, not an error: an unreadable stop is drawn as black or transparent, as an
            // unreadable From/To always has been, rather than failing the render.
            foreach (var stop in stops.Where(stop => !ColourParser.TryParse(stop.Colour, out _)))
            {
                issues.Add(new ValidationIssue(ValidationSeverity.Warning, "GradientStopColourInvalid",
                    $"{what} has a stop with the colour '{stop.Colour}', which is not #RRGGBB or #RRGGBBAA.", layerKey));
            }
        }

        if (gradient.Kind != GradientKind.Radial) return;

        // The renderer clamps either way; the warning says what will actually be drawn.
        var x = GradientGeometry.ClampFraction(gradient.CentreX);
        var y = GradientGeometry.ClampFraction(gradient.CentreY);

        if (x != gradient.CentreX || y != gradient.CentreY)
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Warning, "GradientCentreInvalid",
                $"{what} is centred at {gradient.CentreX}, {gradient.CentreY}; a centre is a fraction of the box between 0 and 1, so it will be drawn at {x}, {y}.", layerKey));
        }
    }

    private async Task ValidateBaseImageAsync(Template template, List<ValidationIssue> issues, CancellationToken cancellationToken)
    {
        var baseImage = template.Canvas.BaseImage;
        if (baseImage.Kind == ImageSourceKind.None) return;

        if (!ValidatePathSource(baseImage, null, issues) ) return;

        if (baseImage.Kind is ImageSourceKind.Media or ImageSourceKind.Path &&
            !await imageSources.ExistsAsync(baseImage, cancellationToken))
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Warning, "BaseImageMissing",
                "The base image could not be found, so the canvas will render on its background colour alone."));
        }
    }

    private void ValidateOutputFolder(Template template, List<ValidationIssue> issues)
    {
        if (template.Output.MediaFolderKey is not { } folderKey) return;

        var folder = mediaService.GetById(folderKey);

        if (folder is null)
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Warning, "MediaFolderMissing",
                "The output media folder no longer exists, so images will be saved to the media root."));
        }
        else if (!string.Equals(folder.ContentType.Alias, Umbraco.Cms.Core.Constants.Conventions.MediaTypes.Folder, StringComparison.OrdinalIgnoreCase))
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Warning, "MediaFolderMissing",
                $"'{folder.Name}' is a {folder.ContentType.Alias}, not a folder, so images will be saved to the media root."));
        }
    }

    private async Task ValidateDocTypesAndTargetAsync(Template template, List<ValidationIssue> issues)
    {
        if (template.DocTypeAliases.Count == 0)
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Warning, "NoDocTypes",
                "This template is not attached to any document type, so nothing will trigger it."));
            return;
        }

        foreach (var alias in template.DocTypeAliases)
        {
            var contentType = contentTypeService.Get(alias);
            if (contentType is null)
            {
                issues.Add(new ValidationIssue(ValidationSeverity.Warning, "DocTypeUnknown",
                    $"There is no document type with the alias '{alias}'."));
                continue;
            }

            if (string.IsNullOrWhiteSpace(template.TargetPropertyAlias)) continue;

            var property = contentType.CompositionPropertyTypes
                .FirstOrDefault(p => string.Equals(p.Alias, template.TargetPropertyAlias, StringComparison.OrdinalIgnoreCase));

            if (property is null)
            {
                issues.Add(new ValidationIssue(ValidationSeverity.Warning, "PropertyUnknown",
                    $"'{alias}' has no property called '{template.TargetPropertyAlias}' to write the image to."));
            }
            else if (!await IsMediaPickerAsync(property.DataTypeKey))
            {
                issues.Add(new ValidationIssue(ValidationSeverity.Warning, "TargetPropertyNotMediaPicker",
                    $"'{template.TargetPropertyAlias}' on '{alias}' is not a media picker, so the generated image cannot be stored in it."));
            }
        }

        if (string.IsNullOrWhiteSpace(template.TargetPropertyAlias))
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Warning, "NoTargetProperty",
                "Without a target property the image is generated but never attached to the content."));
        }
    }

    /// <summary>
    /// Awaited rather than blocked on. This runs on every save, every layout call and every
    /// health check, and <c>.GetAwaiter().GetResult()</c> held a thread-pool thread for the
    /// duration of a database query each time.
    /// </summary>
    private async Task<bool> IsMediaPickerAsync(Guid dataTypeKey)
    {
        var dataType = await dataTypeService.GetAsync(dataTypeKey);
        return dataType?.EditorAlias is Umbraco.Cms.Core.Constants.PropertyEditors.Aliases.MediaPicker3
            or Umbraco.Cms.Core.Constants.PropertyEditors.Aliases.ImageCropper;
    }

    private void ValidateLayer(
        Template template,
        LayerBase layer,
        IReadOnlySet<Guid> fontKeys,
        IReadOnlySet<string> propertyAliases,
        List<ValidationIssue> issues)
    {
        switch (layer)
        {
            case TextLayer text:
                if (text.Style.FontKey == Guid.Empty || !fontKeys.Contains(text.Style.FontKey))
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Error, "FontMissing",
                        $"Layer '{Describe(layer)}' uses a font that no longer exists.", layer.Key));
                }

                RequireColour(text.Style.Colour, layer, issues);
                WarnIfFontTooLarge(text.Style.FontSize, layer, issues);

                foreach (var alias in BoundAliases(text))
                {
                    // The first segment only. Checking the tail would mean inferring the linked
                    // document types - the same best-effort guess the linked-properties endpoint
                    // makes - and a warning built on a guess is worse than silence.
                    var first = PropertyPath.Parse(alias).First;

                    if (propertyAliases.Count > 0 && !propertyAliases.Contains(first))
                    {
                        issues.Add(new ValidationIssue(ValidationSeverity.Warning, "PropertyUnknown",
                            PropertyPath.IsPath(alias)
                                ? $"Layer '{Describe(layer)}' reads '{alias}', and none of the selected document types have a property called '{first}' to follow."
                                : $"Layer '{Describe(layer)}' reads '{alias}', which none of the selected document types have.", layer.Key));
                    }
                }
                break;

            case ImageLayer image:
                ValidatePathSource(image.Source, layer.Key, issues);
                if (image.Border is not null) RequireColour(image.Border.Colour, layer, issues);
                break;

            case BadgesLayer badges:
                if (badges.Label.FontKey != Guid.Empty && !fontKeys.Contains(badges.Label.FontKey))
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Error, "FontMissing",
                        $"Layer '{Describe(layer)}' uses a label font that no longer exists.", layer.Key));
                }

                if (string.IsNullOrWhiteSpace(badges.ItemsPropertyAlias))
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Warning, "NoItemsProperty",
                        $"Layer '{Describe(layer)}' has no items property, so no badges will be drawn.", layer.Key));
                }

                WarnIfFontTooLarge(badges.Label.FontSize, layer, issues);

                if (badges.MaxItems > RenderLimits.MaxBadgeItems)
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Warning, "TooManyBadges",
                        $"Layer '{Describe(layer)}' asks for {badges.MaxItems} badges; at most {RenderLimits.MaxBadgeItems} will be drawn.", layer.Key));
                }

                RequireColour(badges.Label.Colour, layer, issues);
                RequireColour(badges.Badge.FillColour, layer, issues);
                RequireColour(badges.Badge.BorderColour, layer, issues);

                if (badges.Icon.Kind == BadgeIconKind.PathPattern &&
                    !WebRootPath.IsSafe(hostEnvironment, badges.Icon.BasePath))
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Error, "PathInvalid",
                        $"Layer '{Describe(layer)}' has an icon folder outside the site's wwwroot.", layer.Key));
                }

                if (badges.Wrap && badges.Direction != BadgeDirection.Horizontal)
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Warning, "BadgesWrapHorizontalOnly",
                        $"Layer '{Describe(layer)}' has wrapping on, which only applies to a horizontal row.", layer.Key));
                }
                else if (badges.Wrap && badges.Size.Width is null)
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Warning, "BadgesWrapNeedsWidth",
                        $"Layer '{Describe(layer)}' has wrapping on but no width, so nothing will wrap.", layer.Key));
                }
                break;

            case RectLayer rect:
                if (rect.Gradient is null && string.IsNullOrWhiteSpace(rect.Fill) && rect.Border is not { Width: > 0 })
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Warning, "NoFill",
                        $"Layer '{Describe(layer)}' has no fill, gradient or border, so nothing is drawn.", layer.Key));
                }

                if (rect.Fill is not null) RequireColour(rect.Fill, layer, issues);
                if (rect.Gradient is not null) ValidateGradient(rect.Gradient, $"Layer '{Describe(layer)}'", layer.Key, issues);
                if (rect.Border is not null) RequireColour(rect.Border.Colour, layer, issues);

                // The renderer clamps either way; the warning says what will actually be drawn.
                if (rect.Shape is ShapeKind.Polygon or ShapeKind.Star && rect.Sides != ShapeGeometry.ClampSides(rect.Sides))
                {
                    var what = rect.Shape == ShapeKind.Star ? "points" : "sides";
                    issues.Add(new ValidationIssue(ValidationSeverity.Warning, "ShapeSidesInvalid",
                        $"Layer '{Describe(layer)}' asks for {rect.Sides} {what}; a shape has between {ShapeGeometry.MinSides} and {ShapeGeometry.MaxSides}, so it will be drawn with {ShapeGeometry.ClampSides(rect.Sides)}.", layer.Key));
                }

                // Only reachable through JSON: the designer keeps a locked circle square.
                if (rect.LockAspect && rect.Shape == ShapeKind.Ellipse &&
                    rect.Size.Width is { } width && rect.Size.Height is { } height && Math.Abs(width - height) > 0.5f)
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Warning, "LockAspectNotSquare",
                        $"Layer '{Describe(layer)}' is a circle with its aspect locked, but is {width} × {height}, so it draws an ellipse.", layer.Key));
                }

                if (rect.Shape == ShapeKind.Star && rect.InnerRatio != ShapeGeometry.ClampInnerRatio(rect.InnerRatio))
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Warning, "ShapeInnerRatioInvalid",
                        $"Layer '{Describe(layer)}' has an inner ratio of {rect.InnerRatio}; a star's is between {ShapeGeometry.MinInnerRatio} and {ShapeGeometry.MaxInnerRatio}, so it will be drawn with {ShapeGeometry.ClampInnerRatio(rect.InnerRatio)}.", layer.Key));
                }
                break;
        }

        // Deliberately outside the propertyAliases guard above: a path being too deep to follow
        // needs no document types to be true. It covers every binding site on the layer, while
        // PropertyUnknown stays on text layers alone - extending that to the other fields would be
        // correct and would fire on templates that have worked for months. Noted as a follow-up.
        foreach (var alias in AliasesOf(layer))
        {
            WarnIfTooDeep(alias, $"Layer '{Describe(layer)}'", layer.Key, issues);
        }

        if (layer.Opacity is < 0 or > 1)
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "OpacityInvalid",
                $"Layer '{Describe(layer)}' has an opacity outside 0-1.", layer.Key));
        }
    }

    private bool ValidatePathSource(ImageSource source, Guid? layerKey, List<ValidationIssue> issues)
    {
        // "url" is a font source kind only; an image source never fetches from the network.
        if (source.Kind == ImageSourceKind.Url)
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "SourceKindInvalid",
                "An image cannot be loaded from a URL. Use a media item, a wwwroot path or a property.", layerKey));
            return false;
        }

        if (source.Kind == ImageSourceKind.Path && !WebRootPath.IsSafe(hostEnvironment, source.Path))
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "PathInvalid",
                $"'{source.Path}' is outside the site's wwwroot folder.", layerKey));
            return false;
        }

        return source.Fallback is null || ValidatePathSource(source.Fallback, layerKey, issues);
    }

    /// <summary>
    /// A warning, not an error: the renderer clamps an oversize point size rather than refusing
    /// it, so the template still produces an image - this says what will actually be drawn.
    /// </summary>
    private static void WarnIfFontTooLarge(float fontSize, LayerBase layer, List<ValidationIssue> issues)
    {
        if (fontSize <= RenderLimits.MaxFontSize) return;

        issues.Add(new ValidationIssue(ValidationSeverity.Warning, "FontSizeTooLarge",
            $"Layer '{Describe(layer)}' asks for {fontSize:0.##}pt; it will be drawn at {RenderLimits.MaxFontSize:0.##}pt, the largest supported.", layer.Key));
    }

    private static void RequireColour(string? value, LayerBase layer, List<ValidationIssue> issues)
        => RequireColour(value, $"Layer '{Describe(layer)}'", layer.Key, issues);

    /// <summary><paramref name="what"/> is the phrase that names the thing: "Layer 'Title'", or
    /// "The canvas background gradient".</summary>
    private static void RequireColour(string? value, string what, Guid? layerKey, List<ValidationIssue> issues)
    {
        if (string.IsNullOrWhiteSpace(value) || ColourParser.TryParse(value, out _)) return;

        issues.Add(new ValidationIssue(ValidationSeverity.Error, "ColourInvalid",
            $"{what} has the colour '{value}', which is not #RRGGBB or #RRGGBBAA.", layerKey));
    }

    private static string Describe(LayerBase layer)
        => string.IsNullOrWhiteSpace(layer.Name) ? layer.TypeAlias : layer.Name;

    /// <summary>The aliases a text layer reads, across all of its binding kinds.</summary>
    private static IEnumerable<string> BoundAliases(TextLayer text)
    {
        switch (text.Binding.Kind)
        {
            case TextBindingKind.Property:
            case TextBindingKind.Date:
                if (!string.IsNullOrWhiteSpace(text.Binding.PropertyAlias)) yield return text.Binding.PropertyAlias;
                break;

            case TextBindingKind.Expression:
                foreach (var alias in TextResolver.ReferencedAliases(text.Binding.Text)) yield return alias;
                break;
        }
    }

    /// <summary>
    /// Every alias a layer reads, across all four binding sites: the text bindings, an image
    /// source and its fallback chain, a badges layer's items, and the visibility rule.
    /// </summary>
    private static IEnumerable<string> AliasesOf(LayerBase layer)
    {
        if (layer is TextLayer text)
        {
            foreach (var alias in BoundAliases(text)) yield return alias;
        }

        if (layer is ImageLayer image)
        {
            foreach (var alias in PropertyAliasesOf(image.Source)) yield return alias;
        }

        if (layer is BadgesLayer badges && !string.IsNullOrWhiteSpace(badges.ItemsPropertyAlias))
        {
            yield return badges.ItemsPropertyAlias;
        }

        if (!string.IsNullOrWhiteSpace(layer.Visibility.PropertyAlias)) yield return layer.Visibility.PropertyAlias;
    }

    /// <summary>An image source's property alias, and every one down its fallback chain.</summary>
    private static IEnumerable<string> PropertyAliasesOf(ImageSource? source)
    {
        while (source is not null)
        {
            if (!string.IsNullOrWhiteSpace(source.PropertyAlias)) yield return source.PropertyAlias;

            source = source.Fallback;
        }
    }

    /// <summary>
    /// A path that follows more references than the renderer follows resolves to nothing rather
    /// than being truncated, so this is the only way the editor finds out. <paramref name="what"/>
    /// is the phrase that names the thing, as in <see cref="RequireColour(string?, string, Guid?, List{ValidationIssue})"/>.
    /// </summary>
    private static void WarnIfTooDeep(string alias, string what, Guid? layerKey, List<ValidationIssue> issues)
    {
        var path = PropertyPath.Parse(alias);
        if (!path.IsTooDeep) return;

        issues.Add(new ValidationIssue(ValidationSeverity.Warning, "PropertyPathTooDeep",
            $"{what} reads '{alias}', which follows {path.Hops.Count} content references; at most {PropertyPath.MaxHops} are followed, so it will be empty.", layerKey));
    }

    /// <summary>
    /// Every property alias available across the selected document types, plus the system
    /// pseudo-properties the bindings understand. Empty when no document type resolves, which
    /// turns the unknown-property warning off rather than flooding it.
    /// </summary>
    private HashSet<string> KnownPropertyAliases(Template template)
    {
        var aliases = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var anyResolved = false;

        foreach (var contentType in template.DocTypeAliases.Select(contentTypeService.Get).Where(x => x is not null))
        {
            anyResolved = true;
            foreach (var property in contentType!.CompositionPropertyTypes) aliases.Add(property.Alias);
        }

        if (!anyResolved) return [];

        aliases.Add("name");
        aliases.Add("createDate");
        aliases.Add("updateDate");

        return aliases;
    }

    [GeneratedRegex("^[a-zA-Z][a-zA-Z0-9_-]*$")]
    private static partial Regex AliasPattern();
}
