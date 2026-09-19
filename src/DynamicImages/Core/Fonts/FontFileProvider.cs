using Umbraco.Cms.Core;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Core.Fonts.Remote;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Fonts;

public sealed class FontFileProvider(
    MediaFileManager mediaFileManager,
    IMediaService mediaService,
    IWebHostEnvironment hostEnvironment,
    IRemoteFontFetcher remoteFonts,
    ILogger<FontFileProvider> logger) : IFontFileProvider
{
    public async Task<Stream?> OpenAsync(FontDefinition font, CancellationToken cancellationToken = default)
    {
        try
        {
            // The url branch is awaited inside the try on purpose: a failed or timed-out fetch
            // maps to null like every other unreadable font, and the registry's caller sits
            // outside its own try.
            return font.SourceKind switch
            {
                ImageSourceKind.Media => OpenMedia(font.MediaKey),
                ImageSourceKind.Path => OpenPath(font.Path),
                ImageSourceKind.Url => await OpenUrlAsync(font, cancellationToken),
                _ => null
            };
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Dynamic Images: could not open font '{Family}' ({Kind} {Key}{Path}{Url})",
                font.FamilyName, font.SourceKind, font.MediaKey, font.Path, font.SourceUrl);
            return null;
        }
    }

    public bool IsPathSafe(string? path) => WebRootPath.IsSafe(hostEnvironment, path);

    private Stream? OpenMedia(Guid? mediaKey)
    {
        if (mediaKey is null) return null;

        var media = mediaService.GetById(mediaKey.Value);
        var src = MediaSource.ResolvePath(media?.GetValue<string>(Constants.Conventions.Media.File));
        if (string.IsNullOrWhiteSpace(src)) return null;

        // Through MediaFileManager rather than the physical file system, so this works against
        // Azure Blob storage on Umbraco Cloud.
        return mediaFileManager.FileSystem.FileExists(src) ? mediaFileManager.FileSystem.OpenFile(src) : null;
    }

    private Stream? OpenPath(string? path)
    {
        var fullPath = WebRootPath.Resolve(hostEnvironment, path);
        return fullPath is not null && File.Exists(fullPath) ? File.OpenRead(fullPath) : null;
    }

    private async Task<Stream?> OpenUrlAsync(FontDefinition font, CancellationToken cancellationToken)
    {
        if (!Uri.TryCreate(font.SourceUrl, UriKind.Absolute, out var url)) return null;

        return new MemoryStream(await remoteFonts.GetBytesAsync(url, font.ContentHash, cancellationToken), writable: false);
    }
}
