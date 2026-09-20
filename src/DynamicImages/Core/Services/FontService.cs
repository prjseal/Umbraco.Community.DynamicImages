using System.Globalization;
using System.Text.RegularExpressions;
using SixLabors.Fonts;
using SixLabors.Fonts.WellKnownIds;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Community.DynamicImages.Core.Cache;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Fonts.Remote;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Persistence;
using Umbraco.Extensions;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed partial class FontService(
    IFontRepository repository,
    ITemplateCache templateCache,
    IFontRegistry registry,
    IFontFileProvider fileProvider,
    IWebFontResolver webFonts,
    IRemoteFontFetcher remoteFonts,
    IMediaService mediaService,
    IMediaTypeService mediaTypeService,
    MediaFileManager mediaFileManager,
    MediaUrlGeneratorCollection mediaUrlGenerators,
    IShortStringHelper shortStringHelper,
    IContentTypeBaseServiceProvider contentTypeBaseServiceProvider,
    DistributedCache distributedCache,
    ILogger<FontService> logger) : IFontService
{
    private const string FontFolderName = "Dynamic Images Fonts";

    private static readonly string[] AllowedExtensions = [".ttf", ".otf", ".woff2", ".woff"];

    /// <summary>Weights × italic; 9 weights, both slants. Anything beyond that is a typo, not a request.</summary>
    private const int MaxWebFontVariants = 18;

    public IReadOnlyList<FontDefinition> GetAll() => repository.GetAll();

    public FontDefinition? Get(Guid key) => repository.Get(key);

    public async Task<FontUploadResult> UploadAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            return new FontUploadResult(null, $"'{extension}' is not a font file. Upload a .ttf, .otf, .woff2 or .woff.");
        }

        using var buffer = new MemoryStream();
        await fileStream.CopyToAsync(buffer, cancellationToken);
        var bytes = buffer.ToArray();

        var described = Describe(bytes);
        if (described is null)
        {
            return new FontUploadResult(null, "That file could not be read as a font.");
        }

        var mediaTypeAlias = mediaTypeService.Get(DynamicImagesConstants.FontMediaTypeAlias) is not null
            ? DynamicImagesConstants.FontMediaTypeAlias
            // The media type is installed by a migration; falling back to File means an upload
            // still works on a site where that migration has not run yet.
            : Constants.Conventions.MediaTypes.File;

        var folderId = EnsureFontFolder();
        var media = mediaService.CreateMedia(described.Value.Family, folderId, mediaTypeAlias);

        using (var mediaStream = new MemoryStream(bytes))
        {
            media.SetValue(
                mediaFileManager, mediaUrlGenerators, shortStringHelper, contentTypeBaseServiceProvider,
                Constants.Conventions.Media.File,
                $"{described.Value.Family.ToSafeFileName(shortStringHelper)}{extension}",
                mediaStream);
        }

        var saveResult = mediaService.Save(media);
        if (!saveResult.Success)
        {
            return new FontUploadResult(null,
                $"The font file could not be saved to the media library. Check that '{extension.TrimStart('.')}' is in Umbraco:CMS:Content:AllowedUploadedFileExtensions.");
        }

        var font = repository.Insert(new FontDefinition
        {
            FamilyName = described.Value.Family,
            SourceKind = ImageSourceKind.Media,
            MediaKey = media.Key,
            Weight = described.Value.Weight,
            IsItalic = described.Value.IsItalic,
            ContentHash = Hash(bytes)
        });

        Notify(font.Key);

        return new FontUploadResult(font, null);
    }

    public async Task<FontUploadResult> RegisterPathAsync(string path, CancellationToken cancellationToken = default)
    {
        if (!fileProvider.IsPathSafe(path))
        {
            return new FontUploadResult(null, $"'{path}' is outside the site's wwwroot folder.");
        }

        await using var stream = await fileProvider.OpenAsync(
            new FontDefinition { SourceKind = ImageSourceKind.Path, Path = path }, cancellationToken);
        if (stream is null)
        {
            return new FontUploadResult(null, $"No font file was found at '{path}'.");
        }

        using var buffer = new MemoryStream();
        await stream.CopyToAsync(buffer, cancellationToken);
        var bytes = buffer.ToArray();

        var described = Describe(bytes);
        if (described is null)
        {
            return new FontUploadResult(null, $"The file at '{path}' could not be read as a font.");
        }

        var font = repository.Insert(new FontDefinition
        {
            FamilyName = described.Value.Family,
            SourceKind = ImageSourceKind.Path,
            Path = path,
            Weight = described.Value.Weight,
            IsItalic = described.Value.IsItalic,
            ContentHash = Hash(bytes)
        });

        Notify(font.Key);

        return new FontUploadResult(font, null);
    }

    public async Task<WebFontRegistrationResult> RegisterWebFontAsync(WebFontRegistration request, CancellationToken cancellationToken = default)
    {
        var provider = WebFontProviders.Get(request.Provider);
        if (provider is null)
        {
            return new WebFontRegistrationResult([], [$"'{request.Provider}' is not a font provider. Use google, bunny or direct."]);
        }

        return provider.CssUrl is null
            ? await RegisterDirectAsync(provider, request.Url, cancellationToken)
            : await RegisterFromProviderAsync(provider, request, cancellationToken);
    }

    private async Task<WebFontRegistrationResult> RegisterDirectAsync(WebFontProvider provider, string? url, CancellationToken cancellationToken)
    {
        var problem = WebFontProviders.ValidateDirectUrl(url, out var uri);
        if (problem is not null || uri is null) return new WebFontRegistrationResult([], [problem ?? "Enter the URL of a font file."]);

        if (repository.GetAll().Any(f => f.SourceKind == ImageSourceKind.Url && string.Equals(f.SourceUrl, uri.ToString(), StringComparison.OrdinalIgnoreCase)))
        {
            return new WebFontRegistrationResult([], [$"'{uri}' is already registered."]);
        }

        var fetched = await FetchAsync(uri, cancellationToken);
        if (fetched.Error is not null || fetched.Bytes is null) return new WebFontRegistrationResult([], [fetched.Error ?? "The font could not be downloaded."]);

        // A direct file is described the way an upload is: family, weight and slant come from
        // the file, since nothing else knows them.
        var described = Describe(fetched.Bytes);
        if (described is null) return new WebFontRegistrationResult([], [$"The file at '{uri}' could not be read as a font. Static .ttf, .otf, .woff2 or .woff files only."]);

        var font = repository.Insert(new FontDefinition
        {
            FamilyName = described.Value.Family,
            SourceKind = ImageSourceKind.Url,
            SourceUrl = uri.ToString(),
            Provider = provider.Name,
            ProviderFamily = described.Value.Family,
            Weight = described.Value.Weight,
            IsItalic = described.Value.IsItalic,
            ContentHash = Hash(fetched.Bytes)
        });

        Notify(font.Key);

        return new WebFontRegistrationResult([font], []);
    }

    private async Task<WebFontRegistrationResult> RegisterFromProviderAsync(WebFontProvider provider, WebFontRegistration request, CancellationToken cancellationToken)
    {
        var family = request.Family?.Trim() ?? string.Empty;
        if (!FamilyPattern().IsMatch(family))
        {
            return new WebFontRegistrationResult([], ["Enter a family name: letters, numbers, spaces and hyphens, up to 80 characters."]);
        }

        var weights = (request.Weights ?? []).Distinct().OrderBy(w => w).ToList();
        if (weights.Count == 0) return new WebFontRegistrationResult([], ["Tick at least one weight."]);

        if (weights.Any(w => w is < 100 or > 900 || w % 100 != 0))
        {
            return new WebFontRegistrationResult([], ["Weights are 100 to 900 in steps of 100."]);
        }

        var variants = weights
            .SelectMany(w => request.IncludeItalic ? new[] { (Weight: w, Italic: false), (Weight: w, Italic: true) } : [(Weight: w, Italic: false)])
            .ToList();
        if (variants.Count > MaxWebFontVariants)
        {
            return new WebFontRegistrationResult([], [$"That is {variants.Count} variants; the most one request can add is {MaxWebFontVariants}."]);
        }

        var existing = repository.GetAll().Where(f => f.SourceKind == ImageSourceKind.Url).ToList();
        var fonts = new List<FontDefinition>();
        var errors = new List<string>();
        var notFound = 0;

        foreach (var (weight, italic) in variants)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var label = $"{family} {weight}{(italic ? " italic" : string.Empty)}";

            if (existing.Any(f => IsSameVariant(f, provider, family, weight, italic)))
            {
                errors.Add($"{label} is already registered.");
                continue;
            }

            var resolved = await webFonts.ResolveAsync(provider, family, weight, italic, cancellationToken);
            if (resolved.FileUrl is null)
            {
                if (resolved.Error?.Contains("has no weight", StringComparison.Ordinal) == true) notFound++;
                errors.Add(resolved.Error ?? $"{label} could not be resolved.");
                continue;
            }

            // Two variants can resolve to one file (a family that only ships one weight); the
            // second would be the same font twice.
            var url = resolved.FileUrl.ToString();
            if (existing.Concat(fonts).Any(f => string.Equals(f.SourceUrl, url, StringComparison.OrdinalIgnoreCase)))
            {
                errors.Add($"{label} is the same file as a font that is already registered.");
                continue;
            }

            var fetched = await FetchAsync(resolved.FileUrl, cancellationToken);
            if (fetched.Bytes is null)
            {
                errors.Add($"{label}: {fetched.Error}");
                continue;
            }

            // Describe only as "is this really a font": Google's instanced files name their
            // sub-family inconsistently, so the weight and slant are what was asked for.
            if (Describe(fetched.Bytes) is null)
            {
                errors.Add($"{label}: the file {provider.DisplayName} served could not be read as a font.");
                continue;
            }

            var font = repository.Insert(new FontDefinition
            {
                FamilyName = family,
                SourceKind = ImageSourceKind.Url,
                SourceUrl = url,
                Provider = provider.Name,
                ProviderFamily = family,
                Weight = weight,
                IsItalic = italic,
                ContentHash = Hash(fetched.Bytes)
            });

            Notify(font.Key);
            fonts.Add(font);
        }

        // Google's 400 reads the same for an unknown family and an unavailable weight; when
        // every variant got it, the family is the likelier problem.
        if (fonts.Count == 0 && notFound == variants.Count)
        {
            errors = [$"'{family}' was not found on {provider.DisplayName}, or none of the chosen weights are available."];
        }

        return new WebFontRegistrationResult(fonts, errors);
    }

    public async Task<FontUploadResult> RefreshAsync(Guid key, CancellationToken cancellationToken = default)
    {
        var font = repository.Get(key);
        if (font is null) return new FontUploadResult(null, $"No font exists with the key {key}.");

        var provider = font.SourceKind == ImageSourceKind.Url ? WebFontProviders.Get(font.Provider) : null;
        if (provider is null) return new FontUploadResult(null, "Only web fonts can be refreshed. Re-upload a file to replace it.");

        Uri? url;
        if (provider.CssUrl is null)
        {
            var problem = WebFontProviders.ValidateDirectUrl(font.SourceUrl, out url);
            if (problem is not null || url is null) return new FontUploadResult(null, problem ?? "The font has no URL.");
        }
        else
        {
            // Re-resolve rather than re-fetch: Google's file paths carry a version segment, so
            // the URL itself moves when the provider updates a family.
            var resolved = await webFonts.ResolveAsync(provider, font.ProviderFamily ?? font.FamilyName, font.Weight, font.IsItalic, cancellationToken);
            if (resolved.FileUrl is null) return new FontUploadResult(null, resolved.Error);
            url = resolved.FileUrl;
        }

        // No expected hash, so this is always a download rather than a cache hit.
        var fetched = await FetchAsync(url, cancellationToken);
        if (fetched.Bytes is null) return new FontUploadResult(null, fetched.Error);

        if (Describe(fetched.Bytes) is null)
        {
            return new FontUploadResult(null, $"The file at '{url}' could not be read as a font, so the registered one was kept.");
        }

        var previousHash = font.ContentHash;
        font.SourceUrl = url.ToString();
        font.ContentHash = Hash(fetched.Bytes);

        var updated = repository.Update(font);
        if (updated is null) return new FontUploadResult(null, $"No font exists with the key {key}.");

        if (!string.Equals(previousHash, font.ContentHash, StringComparison.OrdinalIgnoreCase)) remoteFonts.Evict(previousHash);

        // Every server drops the family; their next load misses the new hash and downloads it.
        Notify(key);

        return new FontUploadResult(updated, null);
    }

    public FontDefinition? Update(Guid key, string familyName, IReadOnlyList<FontStyleDefinition> styles, int? weight = null, bool? isItalic = null)
    {
        var font = repository.Get(key);
        if (font is null) return null;

        if (!string.IsNullOrWhiteSpace(familyName)) font.FamilyName = familyName;
        font.Styles = styles.ToList();

        // A detected weight is a guess read out of the file's names; this is how it is corrected.
        if (weight is not null) font.Weight = Math.Clamp(weight.Value, 1, 1000);
        if (isItalic is not null) font.IsItalic = isItalic.Value;

        var updated = repository.Update(font);
        if (updated is not null) Notify(key);

        return updated;
    }

    public IReadOnlyList<Template> Delete(Guid key)
    {
        var inUse = TemplatesUsing(key);
        if (inUse.Count > 0) return inUse;

        var font = repository.Get(key);

        if (repository.Delete(key))
        {
            if (font?.SourceKind == ImageSourceKind.Url) remoteFonts.Evict(font.ContentHash);
            Notify(key);
        }

        return [];
    }

    public IReadOnlyList<Template> TemplatesUsing(Guid fontKey)
        => templateCache.GetAll().Where(template => template.Layers.Any(layer => UsesFont(layer, fontKey))).ToList();

    public async Task<(byte[] Bytes, string ContentType, string? ETag)?> GetFileAsync(Guid key, CancellationToken cancellationToken = default)
    {
        var font = repository.Get(key);
        if (font is null) return null;

        await using var stream = await fileProvider.OpenAsync(font, cancellationToken);
        if (stream is null) return null;

        using var buffer = new MemoryStream();
        await stream.CopyToAsync(buffer, cancellationToken);
        var bytes = buffer.ToArray();

        return (bytes, ContentTypeOf(bytes), font.ContentHash);
    }

    /// <summary>
    /// From the file's magic bytes rather than a fixed font/ttf: a Bunny row serves woff2 bytes
    /// to the designer's FontFace loader.
    /// </summary>
    private static string ContentTypeOf(byte[] bytes)
    {
        if (bytes.Length < 4) return "font/ttf";

        return bytes.AsSpan(0, 4) switch
        {
            [(byte)'w', (byte)'O', (byte)'F', (byte)'2'] => "font/woff2",
            [(byte)'w', (byte)'O', (byte)'F', (byte)'F'] => "font/woff",
            [(byte)'O', (byte)'T', (byte)'T', (byte)'O'] => "font/otf",
            _ => "font/ttf"
        };
    }

    private static bool IsSameVariant(FontDefinition font, WebFontProvider provider, string family, int weight, bool italic)
        => string.Equals(font.Provider, provider.Name, StringComparison.OrdinalIgnoreCase)
           && string.Equals(font.ProviderFamily, family, StringComparison.OrdinalIgnoreCase)
           && font.Weight == weight
           && font.IsItalic == italic;

    /// <summary>A download as an outcome rather than an exception, with the reason an editor can act on.</summary>
    private async Task<(byte[]? Bytes, string? Error)> FetchAsync(Uri url, CancellationToken cancellationToken)
    {
        try
        {
            return (await remoteFonts.GetBytesAsync(url, expectedHash: null, cancellationToken), null);
        }
        catch (HttpRequestException ex)
        {
            logger.LogWarning(ex, "Dynamic Images: the font at {Url} could not be downloaded", url);
            return (null, ex.StatusCode is { } status
                ? $"'{url}' answered {(int)status}."
                : $"'{url}' could not be downloaded. Check the site has outbound HTTPS access and the file is under the size limit.");
        }
        catch (TaskCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            return (null, $"'{url}' did not answer in time.");
        }
    }

    private static bool UsesFont(LayerBase layer, Guid fontKey) => layer switch
    {
        TextLayer text => text.Style.FontKey == fontKey,
        BadgesLayer badges => badges.Label.FontKey == fontKey,
        _ => false
    };

    /// <summary>Reads the family, weight and slant out of the font file so the editor does not have to type them.</summary>
    private (string Family, int Weight, bool IsItalic)? Describe(byte[] bytes)
    {
        try
        {
            using var stream = new MemoryStream(bytes);
            var description = FontDescription.LoadDescription(stream);

            return (
                description.FontFamilyInvariantCulture ?? description.FontNameInvariantCulture ?? "Unnamed font",
                WeightOf(description),
                description.Style is FontStyle.Italic or FontStyle.BoldItalic);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Dynamic Images: a font file could not be described");
            return null;
        }
    }

    /// <summary>
    /// The weight the file reports, read out of its names.
    /// <para>
    /// This used to look only at <c>FontSubFamilyNameInvariantCulture</c> - OpenType name ID 2,
    /// which the spec restricts to Regular/Bold/Italic/BoldItalic. So a face like
    /// Inter-SemiBold.ttf, which puts its weight in the family name and reports subfamily
    /// "Regular", came back as 400 - and every font on the test site reported weight 400
    /// regardless of the file behind it, while rendering at visibly the right weight.
    /// </para>
    /// <para>
    /// SixLabors.Fonts 2.0.8 exposes no OS/2 <c>usWeightClass</c>, but the name table is public,
    /// so the weight is looked for in the names most likely to carry it, most specific first:
    /// the typographic subfamily (ID 17, which is not restricted the way ID 2 is), then ID 2,
    /// then the full font name, the PostScript name and finally the family name. The style is
    /// still the fallback.
    /// </para>
    /// </summary>
    private static int WeightOf(FontDescription description)
        => FontWeights.From(
            WeightBearingNames(description),
            description.Style is FontStyle.Bold or FontStyle.BoldItalic ? 700 : 400);

    /// <summary>
    /// The names to search, in the order they should be trusted. The typographic subfamily comes
    /// first because it is the one the spec lets carry "SemiBold"; the family name comes last
    /// because a family called "Bold Type Co" would otherwise out-vote a real subfamily.
    /// </summary>
    private static IEnumerable<string?> WeightBearingNames(FontDescription description)
    {
        yield return Name(description, KnownNameIds.TypographicSubfamilyName);
        yield return description.FontSubFamilyNameInvariantCulture;
        yield return Name(description, KnownNameIds.FullFontName);
        yield return Name(description, KnownNameIds.PostscriptName);
        yield return Name(description, KnownNameIds.TypographicFamilyName);
        yield return description.FontFamilyInvariantCulture;
    }

    private static string? Name(FontDescription description, KnownNameIds nameId)
    {
        try
        {
            return description.GetNameById(CultureInfo.InvariantCulture, nameId);
        }
        catch
        {
            // A font need not carry every name; a missing one is not a problem worth reporting.
            return null;
        }
    }

    private int EnsureFontFolder()
    {
        var existing = mediaService.GetRootMedia()
            ?.FirstOrDefault(m => m.ContentType.Alias == Constants.Conventions.MediaTypes.Folder && m.Name == FontFolderName);

        if (existing is not null) return existing.Id;

        var folder = mediaService.CreateMedia(FontFolderName, Constants.System.Root, Constants.Conventions.MediaTypes.Folder);
        mediaService.Save(folder);

        return folder.Id;
    }

    private static string Hash(byte[] bytes) => FontHash.Compute(bytes);

    [GeneratedRegex(@"^[A-Za-z0-9 \-]{1,80}$")]
    private static partial Regex FamilyPattern();

    private void Notify(Guid fontKey)
    {
        registry.Clear(fontKey);
        distributedCache.RefreshByPayload(
            DynamicImagesCacheRefresher.UniqueId,
            [new DynamicImagesCacheRefresherPayload { Kind = DynamicImagesChangeKind.Font, Key = fontKey }]);
    }
}
