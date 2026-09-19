using System.Text.RegularExpressions;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering;
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
        await ValidateBaseImageAsync(template, issues, cancellationToken);
        ValidateDocTypesAndTarget(template, issues);
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

    private static void ValidateCanvas(Template template, List<ValidationIssue> issues)
    {
        if (template.Canvas.Width is < 1 or > 8000 || template.Canvas.Height is < 1 or > 8000)
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "CanvasSizeInvalid",
                "The canvas must be between 1 and 8000 pixels in each direction."));
        }

        if (!string.IsNullOrWhiteSpace(template.Canvas.Background) &&
            !ColourParser.TryParse(template.Canvas.Background, out _))
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "ColourInvalid",
                $"'{template.Canvas.Background}' is not a valid canvas background colour. Use #RRGGBB or #RRGGBBAA."));
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

    private void ValidateDocTypesAndTarget(Template template, List<ValidationIssue> issues)
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
            else if (!IsMediaPicker(property.DataTypeKey))
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

    private bool IsMediaPicker(Guid dataTypeKey)
    {
        var dataType = dataTypeService.GetAsync(dataTypeKey).GetAwaiter().GetResult();
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

                foreach (var alias in BoundAliases(text))
                {
                    if (propertyAliases.Count > 0 && !propertyAliases.Contains(alias))
                    {
                        issues.Add(new ValidationIssue(ValidationSeverity.Warning, "PropertyUnknown",
                            $"Layer '{Describe(layer)}' reads '{alias}', which none of the selected document types have.", layer.Key));
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
                if (rect.Gradient is null && string.IsNullOrWhiteSpace(rect.Fill))
                {
                    issues.Add(new ValidationIssue(ValidationSeverity.Warning, "NoFill",
                        $"Layer '{Describe(layer)}' has neither a fill nor a gradient.", layer.Key));
                }

                if (rect.Fill is not null) RequireColour(rect.Fill, layer, issues);
                if (rect.Gradient is not null)
                {
                    RequireColour(rect.Gradient.From, layer, issues);
                    RequireColour(rect.Gradient.To, layer, issues);
                }
                break;
        }

        if (layer.Opacity is < 0 or > 1)
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "OpacityInvalid",
                $"Layer '{Describe(layer)}' has an opacity outside 0-1.", layer.Key));
        }
    }

    private bool ValidatePathSource(ImageSource source, Guid? layerKey, List<ValidationIssue> issues)
    {
        if (source.Kind == ImageSourceKind.Path && !WebRootPath.IsSafe(hostEnvironment, source.Path))
        {
            issues.Add(new ValidationIssue(ValidationSeverity.Error, "PathInvalid",
                $"'{source.Path}' is outside the site's wwwroot folder.", layerKey));
            return false;
        }

        return source.Fallback is null || ValidatePathSource(source.Fallback, layerKey, issues);
    }

    private static void RequireColour(string? value, LayerBase layer, List<ValidationIssue> issues)
    {
        if (string.IsNullOrWhiteSpace(value) || ColourParser.TryParse(value, out _)) return;

        issues.Add(new ValidationIssue(ValidationSeverity.Error, "ColourInvalid",
            $"Layer '{Describe(layer)}' has the colour '{value}', which is not #RRGGBB or #RRGGBBAA.", layer.Key));
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
