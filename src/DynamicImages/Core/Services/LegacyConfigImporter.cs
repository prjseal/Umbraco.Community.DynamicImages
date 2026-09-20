using SixLabors.ImageSharp;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Models.Legacy;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed record ImportReport(
    IReadOnlyList<string> Created,
    IReadOnlyList<string> Skipped,
    IReadOnlyList<string> Warnings)
{
    /// <summary>
    /// The validation codes behind <see cref="Warnings"/>, which the messages themselves lose.
    /// Startup needs them to tell a warning that will resolve itself - a document type uSync has
    /// not created yet - from one that will not.
    /// </summary>
    public IReadOnlyList<string> WarningCodes { get; init; } = [];

    /// <summary>
    /// True when every warning is one that a document type appearing later would clear. A first
    /// boot races uSync, so these are expected rather than alarming - see
    /// DynamicImagesStartupHandler.
    /// </summary>
    public bool WarningsAreAllDeferrable
        => Warnings.Count > 0 && WarningCodes.Count == Warnings.Count && WarningCodes.All(IsDeferrable);

    public static bool IsDeferrable(string code) => code is "DocTypeUnknown" or "PropertyUnknown";
}

public interface ILegacyConfigImporter
{
    /// <summary>True when a v1 "DynamicImages" block with instructions is still present in configuration.</summary>
    bool HasLegacyConfig { get; }

    /// <summary>Imports the v1 configuration from appsettings.</summary>
    Task<ImportReport> ImportFromConfigurationAsync(Guid? userKey, CancellationToken cancellationToken = default);

    /// <summary>Imports a v1 configuration block supplied as JSON, for pasting an old config in.</summary>
    Task<ImportReport> ImportAsync(LegacyConfig config, Guid? userKey, CancellationToken cancellationToken = default);
}

/// <summary>
/// Converts the v1 appsettings shape into v2 templates and fonts, one instruction at a time, so
/// an existing installation lands in the designer with its layers exactly where they were.
/// </summary>
public sealed class LegacyConfigImporter(
    IOptionsMonitor<DynamicImagesOptions> options,
    ITemplateService templateService,
    IFontService fontService,
    IFontRepository fontRepository,
    IMediaService mediaService,
    IImageSourceProvider imageSources,
    ILogger<LegacyConfigImporter> logger) : ILegacyConfigImporter
{
    public bool HasLegacyConfig => options.CurrentValue.Instructions.Count > 0;

    public Task<ImportReport> ImportFromConfigurationAsync(Guid? userKey, CancellationToken cancellationToken = default)
        => ImportAsync(
            new LegacyConfig
            {
                Instructions = options.CurrentValue.Instructions,
                Fonts = options.CurrentValue.Fonts
            },
            userKey,
            cancellationToken);

    public async Task<ImportReport> ImportAsync(LegacyConfig config, Guid? userKey, CancellationToken cancellationToken = default)
    {
        var created = new List<string>();
        var skipped = new List<string>();
        var warnings = new List<string>();
        // Kept alongside `warnings` and in step with it, because the message loses the code.
        var warningCodes = new List<string>();

        // Fonts first: the v1 "{Family}_{Style}" keys on the layers resolve against what this
        // registers, so a template import with no fonts imported would lose every text layer.
        var fontKeysByLegacyKey = await ImportFontsAsync(config.Fonts, warnings, cancellationToken);

        foreach (var instruction in config.Instructions)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var name = BuildTemplateName(instruction);
            var alias = templateService.SuggestAlias(name);

            if (templateService.GetByAlias(alias) is not null)
            {
                skipped.Add($"{name} (a template with the alias '{alias}' already exists)");
                continue;
            }

            var template = await ConvertAsync(instruction, name, alias, fontKeysByLegacyKey, warnings, cancellationToken);

            var result = await templateService.CreateAsync(template, userKey, cancellationToken);
            if (result.Outcome == SaveOutcome.Saved)
            {
                created.Add(name);
                foreach (var issue in result.Validation.Issues)
                {
                    warnings.Add($"{name}: {issue.Message}");
                    warningCodes.Add(issue.Code);
                }
            }
            else
            {
                skipped.Add($"{name} ({result.Outcome})");
                foreach (var issue in result.Validation.Errors)
                {
                    warnings.Add($"{name}: {issue.Message}");
                    warningCodes.Add(issue.Code);
                }
            }
        }

        return new ImportReport(created, skipped, warnings) { WarningCodes = warningCodes };
    }

    /// <summary>Registers each v1 font file and maps its "{Family}_{StyleName}" keys to (font key, size, style).</summary>
    private async Task<Dictionary<string, LegacyFontMapping>> ImportFontsAsync(
        List<LegacyFontConfig> fonts, List<string> warnings, CancellationToken cancellationToken)
    {
        var map = new Dictionary<string, LegacyFontMapping>(StringComparer.OrdinalIgnoreCase);
        var existing = fontRepository.GetAll();

        foreach (var font in fonts)
        {
            var path = font.Path ?? font.Paths?.FirstOrDefault();
            if (string.IsNullOrWhiteSpace(path))
            {
                warnings.Add($"Font '{font.FamilyName}' has no path and was not imported.");
                continue;
            }

            // Re-registering the same file would give the designer two identical fonts to choose
            // between, so an existing row for this path is reused.
            var registered = existing.FirstOrDefault(f =>
                f.SourceKind == ImageSourceKind.Path &&
                string.Equals(f.Path, path, StringComparison.OrdinalIgnoreCase));

            if (registered is null)
            {
                var result = await fontService.RegisterPathAsync(path, cancellationToken);
                if (result.Font is null)
                {
                    warnings.Add($"Font '{font.FamilyName}': {result.Error}");
                    continue;
                }

                registered = result.Font;
            }

            // v1's "FamilyName" was a config-only label, not the name inside the file, and the
            // layer keys use it - so it is carried over verbatim along with the named styles.
            var styles = font.Styles
                .Select(style => new FontStyleDefinition
                {
                    Name = style.Name,
                    Size = style.Size,
                    FontStyle = style.Style.ToString()
                })
                .ToList();

            fontService.Update(registered.Key, font.FamilyName, styles);

            foreach (var style in font.Styles)
            {
                map[$"{font.FamilyName}_{style.Name}"] = new LegacyFontMapping(registered.Key, style.Name, style.Size, style.Style.ToString());
            }
        }

        return map;
    }

    private async Task<Template> ConvertAsync(
        LegacyInstruction instruction,
        string name,
        string alias,
        Dictionary<string, LegacyFontMapping> fonts,
        List<string> warnings,
        CancellationToken cancellationToken)
    {
        var baseImage = string.IsNullOrWhiteSpace(instruction.SourceImagePath)
            ? ImageSource.None()
            : new ImageSource { Kind = ImageSourceKind.Path, Path = instruction.SourceImagePath };

        // v1 had no canvas size - the output was whatever the source image happened to be, so the
        // dimensions come from the file itself.
        var (width, height) = await ResolveCanvasSizeAsync(baseImage, name, warnings, cancellationToken);

        var template = new Template
        {
            Key = Guid.NewGuid(),
            Alias = alias,
            Name = name,
            IsEnabled = true,
            DocTypeAliases = [.. instruction.DocTypeAliases],
            TargetPropertyAlias = instruction.TargetPropertyAlias,
            Trigger = new TriggerSettings { OnPublish = true, OnlyWhenEmpty = true },
            Output = new OutputSettings
            {
                MediaFolderKey = ResolveMediaFolderKey(instruction.MediaFolder, name, warnings),
                FileNamePattern = "{name}",
                // v1 encoded JPEG under a .png name; PNG matches what everything downstream
                // (and the file extension) already assumed.
                Format = OutputFormat.Png
            },
            Canvas = new CanvasSettings
            {
                Width = width,
                Height = height,
                Background = "#0B0F19",
                BaseImage = baseImage,
                BaseImageFit = ImageFitMode.Cover
            }
        };

        if (!string.IsNullOrWhiteSpace(instruction.Author))
        {
            // v1 read Author nowhere; saying so beats silently dropping a configured value.
            warnings.Add($"{name}: the v1 'Author' setting was never used when rendering and has not been carried over.");
        }

        foreach (var legacyLayer in instruction.Layers)
        {
            var layer = ConvertLayer(legacyLayer, fonts, name, warnings);
            if (layer is not null) template.Layers.Add(layer);
        }

        return template;
    }

    private LayerBase? ConvertLayer(LegacyLayer legacy, Dictionary<string, LegacyFontMapping> fonts, string templateName, List<string> warnings)
        => legacy.LayerType switch
        {
            LegacyLayerType.Text => ConvertTextLayer(legacy, fonts, templateName, warnings),
            LegacyLayerType.Image => ConvertImageLayer(legacy),
            LegacyLayerType.CategoryBadges => ConvertBadgesLayer(legacy, fonts, templateName, warnings),
            _ => null
        };

    private TextLayer ConvertTextLayer(LegacyLayer legacy, Dictionary<string, LegacyFontMapping> fonts, string templateName, List<string> warnings)
    {
        var font = LookupFont(legacy.Font, fonts, templateName, warnings);

        // v1 anchored text at the top and expressed left/right/centre through HorizontalAlignment,
        // which doubled as both "where the origin is" and "how the text aligns". The v2 anchor
        // captures the former, textAlign the latter - set to match so the render is unchanged.
        var horizontal = legacy.Alignment?.ToLowerInvariant() switch
        {
            "right" => (Anchor.TopRight, TextAlign.Right),
            "centre" or "center" => (Anchor.TopCentre, TextAlign.Centre),
            _ => (Anchor.TopLeft, TextAlign.Left)
        };

        var (binding, suffix) = ConvertBinding(legacy);

        return new TextLayer
        {
            Key = Guid.NewGuid(),
            Name = DescribeTextLayer(legacy),
            Position = new Position { X = legacy.xPosition, Y = legacy.yPosition, Anchor = horizontal.Item1 },
            Size = new LayerSize { Width = legacy.MaxWidth },
            Opacity = legacy.Opacity,
            Binding = binding,
            Suffix = suffix,
            Style = new TextStyle
            {
                FontKey = font.Key,
                StyleName = font.StyleName,
                FontSize = font.Size,
                FontStyle = font.FontStyle,
                Colour = NormaliseColour(legacy.Colour, "#FFFFFF"),
                TextAlign = horizontal.Item2,
                LineSpacing = legacy.LineSpacing ?? 1f,
                Overflow = TextOverflow.Shrink
            }
        };
    }

    /// <summary>
    /// Maps v1's SourcePropertyAlias/DateFormat/SuffixText trio onto a binding. A suffix holding
    /// a {readingTime} token becomes an expression, which is the general form of that hack.
    /// </summary>
    private static (TextBinding Binding, string? Suffix) ConvertBinding(LegacyLayer legacy)
    {
        var alias = legacy.SourcePropertyAlias ?? string.Empty;

        TextBinding binding = alias.ToLowerInvariant() switch
        {
            "name" => new TextBinding { Kind = TextBindingKind.NodeName },
            "readingtime" => new TextBinding { Kind = TextBindingKind.ReadingTime, PropertyAlias = "mainContent" },
            _ when !string.IsNullOrWhiteSpace(legacy.DateFormat) =>
                new TextBinding { Kind = TextBindingKind.Date, PropertyAlias = alias, Format = legacy.DateFormat },
            _ => new TextBinding { Kind = TextBindingKind.Property, PropertyAlias = alias }
        };

        var suffix = legacy.SuffixText;
        if (!string.IsNullOrWhiteSpace(suffix) && suffix.Contains("{readingTime}", StringComparison.OrdinalIgnoreCase))
        {
            var prefixToken = binding.Kind switch
            {
                TextBindingKind.NodeName => "{name}",
                TextBindingKind.Date => $"{{date:{binding.PropertyAlias}:{binding.Format}}}",
                TextBindingKind.ReadingTime => "{readingTime}",
                _ => $"{{prop:{binding.PropertyAlias}}}"
            };

            return (new TextBinding { Kind = TextBindingKind.Expression, Text = prefixToken + suffix }, null);
        }

        return (binding, suffix);
    }

    private static ImageLayer ConvertImageLayer(LegacyLayer legacy) => new()
    {
        Key = Guid.NewGuid(),
        Name = "Image",
        Position = new Position { X = legacy.xPosition, Y = legacy.yPosition, Anchor = Anchor.TopLeft },
        Size = new LayerSize { Width = legacy.Width, Height = legacy.Height },
        Opacity = legacy.Opacity,
        CornerRadius = legacy.CornerRadius ?? 0f,
        Fit = ImageFit.Cover,
        Source = !string.IsNullOrWhiteSpace(legacy.SourcePropertyAlias)
            ? new ImageSource { Kind = ImageSourceKind.Property, PropertyAlias = legacy.SourcePropertyAlias }
            : new ImageSource { Kind = ImageSourceKind.Path, Path = legacy.ImagePath }
    };

    private BadgesLayer ConvertBadgesLayer(LegacyLayer legacy, Dictionary<string, LegacyFontMapping> fonts, string templateName, List<string> warnings)
    {
        var labelFont = LookupFont(legacy.LabelFont ?? legacy.Font, fonts, templateName, warnings);

        return new BadgesLayer
        {
            Key = Guid.NewGuid(),
            Name = "Badges",
            Position = new Position { X = legacy.xPosition, Y = legacy.yPosition, Anchor = Anchor.TopLeft },
            Opacity = legacy.Opacity,
            ItemsPropertyAlias = legacy.SourcePropertyAlias ?? string.Empty,
            MaxItems = legacy.MaxBadges ?? 2,
            Gap = legacy.BadgeGap ?? 40f,
            Direction = BadgeDirection.Horizontal,
            Icon = new BadgeIcon
            {
                Kind = BadgeIconKind.PathPattern,
                BasePath = legacy.IconBasePath ?? "/assets/og-icons",
                PropertyAlias = legacy.IconNameProperty ?? "shortName",
                Extension = ".png"
            },
            Badge = new BadgeCircle
            {
                Size = legacy.IconSize ?? 88f,
                InnerSize = legacy.IconInnerSize ?? 44f,
                FillColour = NormaliseColour(legacy.CircleFillColour, "#FFFFFF14"),
                BorderColour = NormaliseColour(legacy.CircleBorderColour, "#FFFFFF26"),
                BorderWidth = legacy.CircleBorderWidth ?? 1.5f
            },
            Label = new BadgeLabel
            {
                FontKey = labelFont.Key,
                StyleName = labelFont.StyleName,
                FontSize = labelFont.Size,
                Colour = NormaliseColour(legacy.LabelColour, "#6B7280"),
                TextTransform = legacy.LabelUppercase ? TextTransform.Uppercase : TextTransform.None,
                Gap = legacy.LabelGap ?? 10f
            }
        };
    }

    private LegacyFontMapping LookupFont(string? key, Dictionary<string, LegacyFontMapping> fonts, string templateName, List<string> warnings)
    {
        if (!string.IsNullOrWhiteSpace(key) && fonts.TryGetValue(key, out var mapping)) return mapping;

        // The first imported font is a better landing place than an empty key: the layer stays
        // selectable in the designer, and validation flags it.
        var fallback = fonts.Values.Select(v => (LegacyFontMapping?)v).FirstOrDefault();
        warnings.Add(string.IsNullOrWhiteSpace(key)
            ? $"{templateName}: a layer had no font configured."
            : $"{templateName}: no imported font matched the key '{key}'.");

        return fallback ?? new LegacyFontMapping(Guid.Empty, null, 32f, "Regular");
    }

    private async Task<(int Width, int Height)> ResolveCanvasSizeAsync(
        ImageSource baseImage, string templateName, List<string> warnings, CancellationToken cancellationToken)
    {
        if (baseImage.Kind == ImageSourceKind.None) return (1200, 630);

        var dimensions = await imageSources.GetDimensionsAsync(baseImage, cancellationToken);
        if (dimensions is not null) return dimensions.Value;

        warnings.Add($"{templateName}: the base image '{baseImage.Path}' could not be read, so the canvas was set to 1200x630.");
        return (1200, 630);
    }

    /// <summary>v1 named its output folder; v2 references it by key, creating it if it is missing.</summary>
    private Guid? ResolveMediaFolderKey(string folderName, string templateName, List<string> warnings)
    {
        if (string.IsNullOrWhiteSpace(folderName)) return null;

        var existing = mediaService.GetRootMedia()
            ?.FirstOrDefault(m => m.ContentType.Alias == Constants.Conventions.MediaTypes.Folder && m.Name == folderName);

        if (existing is not null) return existing.Key;

        try
        {
            var folder = mediaService.CreateMedia(folderName, Constants.System.Root, Constants.Conventions.MediaTypes.Folder);
            mediaService.Save(folder);
            return folder.Key;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Dynamic Images: could not create the media folder '{Folder}'", folderName);
            warnings.Add($"{templateName}: the media folder '{folderName}' could not be created, so images will go to the media root.");
            return null;
        }
    }

    private static string BuildTemplateName(LegacyInstruction instruction)
    {
        var first = instruction.DocTypeAliases.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(first)) return "Imported template";

        var spaced = string.Concat(first.Select((c, i) => i > 0 && char.IsUpper(c) ? $" {c}" : c.ToString()));
        return char.ToUpperInvariant(spaced[0]) + spaced[1..] + " OG image";
    }

    private static string DescribeTextLayer(LegacyLayer legacy) => legacy.SourcePropertyAlias?.ToLowerInvariant() switch
    {
        "name" => "Title",
        "readingtime" => "Reading time",
        null or "" => "Text",
        _ => char.ToUpperInvariant(legacy.SourcePropertyAlias[0]) + legacy.SourcePropertyAlias[1..]
    };

    /// <summary>v1 accepted bare hex without a leading #; v2 normalises everything to #RRGGBB(AA).</summary>
    private static string NormaliseColour(string? value, string fallback)
    {
        if (string.IsNullOrWhiteSpace(value)) return fallback;

        var trimmed = value.Trim();
        return trimmed.StartsWith('#') ? trimmed : $"#{trimmed}";
    }

    private readonly record struct LegacyFontMapping(Guid Key, string? StyleName, float Size, string FontStyle);
}
