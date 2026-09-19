using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Extensions;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Core.Media;

public sealed class DynamicImageMediaWriter(
    IMediaService mediaService,
    MediaFileManager mediaFileManager,
    MediaUrlGeneratorCollection mediaUrlGenerators,
    IShortStringHelper shortStringHelper,
    IContentTypeBaseServiceProvider contentTypeBaseServiceProvider,
    ILogger<DynamicImageMediaWriter> logger) : IDynamicImageMediaWriter
{
    public async Task<Guid> WriteAsync(
        Image image,
        Template template,
        string contentName,
        Guid? existingMediaKey,
        CancellationToken cancellationToken = default)
    {
        var bytes = await EncodeAsync(image, template.Output, cancellationToken);
        var mediaName = BuildName(template, contentName);
        var fileName = $"{mediaName.ToSafeFileName(shortStringHelper)}{ExtensionFor(template.Output.Format)}";

        // Replacing in place keeps the media key, and therefore every MediaPicker reference and
        // shared URL pointing at it, valid across regenerations.
        var media = existingMediaKey is null ? null : mediaService.GetById(existingMediaKey.Value);

        if (media is null)
        {
            var parentId = ResolveFolderId(template.Output.MediaFolderKey);
            media = mediaService.CreateMedia(mediaName, parentId, Constants.Conventions.MediaTypes.Image);
        }
        else if (!string.Equals(media.ContentType.Alias, Constants.Conventions.MediaTypes.Image, StringComparison.OrdinalIgnoreCase))
        {
            // Whatever that key points at, it is not something we may overwrite.
            logger.LogWarning(
                "Dynamic Images: media {MediaKey} is a '{Alias}', not an image, so a new media item was created instead",
                existingMediaKey, media.ContentType.Alias);

            var parentId = ResolveFolderId(template.Output.MediaFolderKey);
            media = mediaService.CreateMedia(mediaName, parentId, Constants.Conventions.MediaTypes.Image);
        }
        else
        {
            media.Name = mediaName;
        }

        using var stream = new MemoryStream(bytes);
        media.SetValue(
            mediaFileManager,
            mediaUrlGenerators,
            shortStringHelper,
            contentTypeBaseServiceProvider,
            Constants.Conventions.Media.File,
            fileName,
            stream);

        mediaService.Save(media);

        return media.Key;
    }

    public async Task<byte[]> EncodeAsync(Image image, OutputSettings output, CancellationToken cancellationToken = default)
    {
        using var stream = new MemoryStream();
        var quality = Math.Clamp(output.Quality, 1, 100);

        // v1 always encoded JPEG but named the file .png, so every generated image was served
        // with the wrong type. The encoder and the extension now come from the same setting.
        switch (output.Format)
        {
            case OutputFormat.Jpeg:
                await image.SaveAsJpegAsync(stream, new JpegEncoder { Quality = quality }, cancellationToken);
                break;

            case OutputFormat.Webp:
                await image.SaveAsWebpAsync(stream, new WebpEncoder { Quality = quality }, cancellationToken);
                break;

            default:
                await image.SaveAsPngAsync(stream, new PngEncoder(), cancellationToken);
                break;
        }

        return stream.ToArray();
    }

    public string ExtensionFor(OutputFormat format) => format switch
    {
        OutputFormat.Jpeg => ".jpg",
        OutputFormat.Webp => ".webp",
        _ => ".png"
    };

    public string ContentTypeFor(OutputFormat format) => format switch
    {
        OutputFormat.Jpeg => "image/jpeg",
        OutputFormat.Webp => "image/webp",
        _ => "image/png"
    };

    /// <summary>Applies the template's file name pattern: {name}, {template}.</summary>
    private static string BuildName(Template template, string contentName)
    {
        var pattern = string.IsNullOrWhiteSpace(template.Output.FileNamePattern) ? "{name}" : template.Output.FileNamePattern;

        var name = pattern
            .Replace("{name}", contentName, StringComparison.OrdinalIgnoreCase)
            .Replace("{template}", template.Alias, StringComparison.OrdinalIgnoreCase)
            .Trim();

        return string.IsNullOrWhiteSpace(name) ? contentName : name;
    }

    private int ResolveFolderId(Guid? folderKey)
    {
        if (folderKey is null) return Constants.System.Root;

        var folder = mediaService.GetById(folderKey.Value);

        if (folder is null)
        {
            logger.LogWarning("Dynamic Images: output folder {FolderKey} no longer exists; saving to the media root", folderKey);
            return Constants.System.Root;
        }

        // Creating an image under another image is not valid media structure, and the backoffice
        // media picker cannot filter to folders reliably - so it is checked here instead.
        if (!string.Equals(folder.ContentType.Alias, Constants.Conventions.MediaTypes.Folder, StringComparison.OrdinalIgnoreCase))
        {
            logger.LogWarning(
                "Dynamic Images: output folder {FolderKey} is a '{Alias}', not a folder; saving to the media root",
                folderKey, folder.ContentType.Alias);

            return Constants.System.Root;
        }

        return folder.Id;
    }
}
