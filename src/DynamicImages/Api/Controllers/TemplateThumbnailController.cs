using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp.Processing;
using Umbraco.Cms.Core.Cache;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Extensions;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// A small rendering of a saved template against sample data, for the grid view's cards.
/// <para>
/// The same render path as a preview, so the same <see cref="RenderLimits"/> and the same render
/// gate. The PNG is cached per key, save and width, so a grid costs one render per template per
/// save rather than one per page view; the ETag lets the browser skip even the cache lookup.
/// </para>
/// </summary>
public class TemplateThumbnailController(
    ITemplateService templateService,
    IDynamicImageRenderer renderer,
    IDynamicImageMediaWriter mediaWriter,
    AppCaches appCaches,
    ILogger<TemplateThumbnailController> logger) : DynamicImagesControllerBase
{
    private const int MinWidth = 40;
    private const int MaxWidth = 800;

    [HttpGet("templates/{key:guid}/thumbnail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status304NotModified)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Thumbnail(Guid key, [FromQuery] int width = 400, CancellationToken cancellationToken = default)
    {
        var template = templateService.Get(key);
        if (template is null)
        {
            return Problem(title: "Template not found", detail: $"No template exists with the key {key}.",
                statusCode: StatusCodes.Status404NotFound);
        }

        width = Math.Clamp(width, MinWidth, MaxWidth);
        var version = template.UpdatedUtc.Ticks.ToString(CultureInfo.InvariantCulture);
        var etag = $"\"{version}-{width}\"";

        if (Request.Headers.IfNoneMatch.Any(value => value == etag)) return StatusCode(StatusCodes.Status304NotModified);

        var cacheKey = $"DynamicImages.Thumbnail.{key}.{version}.{width}";

        byte[]? bytes;
        try
        {
            bytes = await appCaches.RuntimeCache.GetCacheItemAsync(
                cacheKey, () => RenderAsync(template, width, cancellationToken), TimeSpan.FromHours(12));
        }
        catch (OperationCanceledException)
        {
            return new EmptyResult();
        }
        catch (Exception ex)
        {
            // A template that cannot render (a missing font, a limit) is shown as a card without a
            // picture; the designer is where the reason is explained.
            logger.LogDebug(ex, "Dynamic Images: no thumbnail for template {Key}", key);
            return Problem(title: "The thumbnail could not be rendered", statusCode: StatusCodes.Status400BadRequest);
        }

        if (bytes is null) return Problem(title: "The thumbnail could not be rendered", statusCode: StatusCodes.Status400BadRequest);

        Response.Headers.ETag = etag;
        Response.Headers.CacheControl = "private, no-cache";
        return File(bytes, "image/png");
    }

    private async Task<byte[]?> RenderAsync(Template template, int width, CancellationToken cancellationToken)
    {
        using var result = await renderer.RenderAsync(template, SampleData.Build(template), cancellationToken);

        var height = Math.Max(1, (int)Math.Round(result.Image.Height * (width / (double)result.Image.Width)));
        result.Image.Mutate(ctx => ctx.Resize(width, height));

        return await mediaWriter.EncodeAsync(result.Image, new OutputSettings { Format = OutputFormat.Png }, cancellationToken);
    }
}
