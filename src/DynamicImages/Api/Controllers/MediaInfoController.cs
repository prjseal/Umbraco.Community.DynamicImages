using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Media;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Extensions;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// Dimensions and a URL for a media item, so the designer can seed the canvas size from the base
/// image ("Use image size") and show thumbnails without guessing.
/// </summary>
public class MediaInfoController(
    IMediaService mediaService,
    IImageSourceProvider imageSources,
    MediaUrlGeneratorCollection mediaUrlGenerators) : DynamicImagesControllerBase
{
    [HttpGet("media/{key:guid}/image-info")]
    [ProducesResponseType(typeof(ImageInfoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetImageInfo(Guid key, CancellationToken cancellationToken)
    {
        var media = mediaService.GetById(key);
        if (media is null)
        {
            return Problem(title: "Media not found", detail: $"No media item exists with the key {key}.",
                statusCode: StatusCodes.Status404NotFound);
        }

        var source = new ImageSource { Kind = ImageSourceKind.Media, MediaKey = key };
        var dimensions = await imageSources.GetDimensionsAsync(source, cancellationToken);

        if (dimensions is null)
        {
            return Problem(title: "Not a readable image",
                detail: $"'{media.Name}' could not be read as an image.", statusCode: StatusCodes.Status404NotFound);
        }

        return Ok(new ImageInfoResponse(dimensions.Value.Width, dimensions.Value.Height, MediaUrl(media)));
    }

    private string? MediaUrl(Umbraco.Cms.Core.Models.IMedia media)
        => media.GetUrl(Constants.Conventions.Media.File, mediaUrlGenerators);
}
