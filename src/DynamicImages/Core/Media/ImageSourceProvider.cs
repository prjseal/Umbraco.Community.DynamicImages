using SixLabors.ImageSharp;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;

namespace Umbraco.Community.DynamicImages.Core.Media;

public sealed class ImageSourceProvider(
    MediaFileManager mediaFileManager,
    IMediaService mediaService,
    IWebHostEnvironment hostEnvironment,
    ILogger<ImageSourceProvider> logger) : IImageSourceProvider
{
    public async Task<Image?> LoadAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
    {
        await using var stream = await OpenAsync(source, values, cancellationToken);
        if (stream is null) return null;

        try
        {
            return await Image.LoadAsync(stream, cancellationToken);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Dynamic Images: an image source could not be decoded ({Kind})", source?.Kind);
            return null;
        }
    }

    public async Task<bool> ExistsAsync(ImageSource? source, CancellationToken cancellationToken = default)
    {
        await using var stream = await OpenAsync(source, values: null, cancellationToken);
        return stream is not null;
    }

    public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, CancellationToken cancellationToken = default)
        => GetDimensionsAsync(source, values: null, cancellationToken);

    public async Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
    {
        await using var stream = await OpenAsync(source, values, cancellationToken);
        if (stream is null) return null;

        try
        {
            // Identify reads the header only - cheap enough to call when seeding a canvas size.
            var info = await Image.IdentifyAsync(stream, cancellationToken);
            return (info.Width, info.Height);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Dynamic Images: could not read the dimensions of an image source ({Kind})", source?.Kind);
            return null;
        }
    }

    private async Task<Stream?> OpenAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken)
    {
        if (source is null || source.Kind == ImageSourceKind.None) return null;

        switch (source.Kind)
        {
            case ImageSourceKind.Media:
                return OpenMedia(source.MediaKey);

            case ImageSourceKind.Path:
                var fullPath = WebRootPath.Resolve(hostEnvironment, source.Path);
                return fullPath is not null && File.Exists(fullPath) ? File.OpenRead(fullPath) : null;

            case ImageSourceKind.Property:
                var mediaKey = values is not null && !string.IsNullOrWhiteSpace(source.PropertyAlias)
                    ? values.GetMediaKey(source.PropertyAlias)
                    : null;

                var stream = mediaKey is null ? null : OpenMedia(mediaKey);

                // An empty picker on this node is normal, not an error - that is what the fallback
                // source is for.
                return stream ?? await OpenAsync(source.Fallback, values, cancellationToken);

            default:
                return null;
        }
    }

    private Stream? OpenMedia(Guid? mediaKey)
    {
        if (mediaKey is null) return null;

        var media = mediaService.GetById(mediaKey.Value);
        var src = MediaSource.ResolvePath(media?.GetValue<string>(Constants.Conventions.Media.File));
        if (string.IsNullOrWhiteSpace(src)) return null;

        return mediaFileManager.FileSystem.FileExists(src) ? mediaFileManager.FileSystem.OpenFile(src) : null;
    }
}
