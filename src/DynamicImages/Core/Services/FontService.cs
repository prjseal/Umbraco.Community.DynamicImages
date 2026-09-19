using System.Security.Cryptography;
using SixLabors.Fonts;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Community.DynamicImages.Core.Cache;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Persistence;
using Umbraco.Extensions;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class FontService(
    IFontRepository repository,
    ITemplateCache templateCache,
    IFontRegistry registry,
    IFontFileProvider fileProvider,
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

    public IReadOnlyList<FontDefinition> GetAll() => repository.GetAll();

    public FontDefinition? Get(Guid key) => repository.Get(key);

    public async Task<FontUploadResult> UploadAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            return new FontUploadResult(null, $"'{extension}' is not a font file. Upload a .ttf, .otf or .woff2.");
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

        await using var stream = await fileProvider.OpenAsync(ImageSourceKind.Path, null, path, cancellationToken);
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

    public FontDefinition? Update(Guid key, string familyName, IReadOnlyList<FontStyleDefinition> styles)
    {
        var font = repository.Get(key);
        if (font is null) return null;

        if (!string.IsNullOrWhiteSpace(familyName)) font.FamilyName = familyName;
        font.Styles = styles.ToList();

        var updated = repository.Update(font);
        if (updated is not null) Notify(key);

        return updated;
    }

    public IReadOnlyList<Template> Delete(Guid key)
    {
        var inUse = TemplatesUsing(key);
        if (inUse.Count > 0) return inUse;

        if (repository.Delete(key)) Notify(key);

        return [];
    }

    public IReadOnlyList<Template> TemplatesUsing(Guid fontKey)
        => templateCache.GetAll().Where(template => template.Layers.Any(layer => UsesFont(layer, fontKey))).ToList();

    public async Task<(byte[] Bytes, string ContentType, string? ETag)?> GetFileAsync(Guid key, CancellationToken cancellationToken = default)
    {
        var font = repository.Get(key);
        if (font is null) return null;

        await using var stream = await fileProvider.OpenAsync(font.SourceKind, font.MediaKey, font.Path, cancellationToken);
        if (stream is null) return null;

        using var buffer = new MemoryStream();
        await stream.CopyToAsync(buffer, cancellationToken);
        var bytes = buffer.ToArray();

        return (bytes, "font/ttf", font.ContentHash);
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
    /// FontDescription exposes only a regular/bold/italic style, which would report a SemiBold or
    /// ExtraBold face as weight 400. The sub-family name ("SemiBold", "ExtraBold", "Light") is the
    /// one piece of weight information the file does give us, so it is mapped to the usual
    /// CSS numbers, falling back to the style.
    /// </summary>
    private static int WeightOf(FontDescription description)
    {
        var subFamily = (description.FontSubFamilyNameInvariantCulture ?? string.Empty)
            .Replace(" ", string.Empty)
            .Replace("-", string.Empty);

        foreach (var (name, weight) in NamedWeights)
        {
            if (subFamily.Contains(name, StringComparison.OrdinalIgnoreCase)) return weight;
        }

        return description.Style is FontStyle.Bold or FontStyle.BoldItalic ? 700 : 400;
    }

    /// <summary>More specific names first, so "ExtraBold" is not matched as plain "Bold".</summary>
    private static readonly (string Name, int Weight)[] NamedWeights =
    [
        ("ExtraLight", 200),
        ("UltraLight", 200),
        ("SemiBold", 600),
        ("DemiBold", 600),
        ("ExtraBold", 800),
        ("UltraBold", 800),
        ("Thin", 100),
        ("Light", 300),
        ("Medium", 500),
        ("Black", 900),
        ("Heavy", 900),
        ("Bold", 700),
        ("Regular", 400),
        ("Normal", 400),
        ("Book", 400)
    ];

    private int EnsureFontFolder()
    {
        var existing = mediaService.GetRootMedia()
            ?.FirstOrDefault(m => m.ContentType.Alias == Constants.Conventions.MediaTypes.Folder && m.Name == FontFolderName);

        if (existing is not null) return existing.Id;

        var folder = mediaService.CreateMedia(FontFolderName, Constants.System.Root, Constants.Conventions.MediaTypes.Folder);
        mediaService.Save(folder);

        return folder.Id;
    }

    private static string Hash(byte[] bytes) => Convert.ToHexString(SHA256.HashData(bytes))[..32];

    private void Notify(Guid fontKey)
    {
        registry.Clear(fontKey);
        distributedCache.RefreshByPayload(
            DynamicImagesCacheRefresher.UniqueId,
            [new DynamicImagesCacheRefresherPayload { Kind = DynamicImagesChangeKind.Font, Key = fontKey }]);
    }
}
