using Umbraco.Cms.Core;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Fonts;

public sealed class FontFileProvider(
    MediaFileManager mediaFileManager,
    IMediaService mediaService,
    IWebHostEnvironment hostEnvironment,
    ILogger<FontFileProvider> logger) : IFontFileProvider
{
    public Task<Stream?> OpenAsync(ImageSourceKind kind, Guid? mediaKey, string? path, CancellationToken cancellationToken = default)
    {
        try
        {
            return Task.FromResult(kind switch
            {
                ImageSourceKind.Media => OpenMedia(mediaKey),
                ImageSourceKind.Path => OpenPath(path),
                _ => null
            });
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Dynamic Images: could not open font ({Kind} {Key}{Path})", kind, mediaKey, path);
            return Task.FromResult<Stream?>(null);
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
}
