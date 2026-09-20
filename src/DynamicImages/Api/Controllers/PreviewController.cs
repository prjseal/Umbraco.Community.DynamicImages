using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Web;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Community.DynamicImages.Core.Services;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// Renders a candidate template without saving anything. This is the ground truth the designer
/// canvas approximates - nothing here writes to the media library.
/// </summary>
public class PreviewController(
    IDynamicImageRenderer renderer,
    IDynamicImageMediaWriter mediaWriter,
    ITemplateValidator validator,
    IContentService contentService,
    IUmbracoContextFactory umbracoContextFactory,
    IOptionsMonitor<DynamicImagesOptions> options) : DynamicImagesControllerBase
{
    [HttpPost("preview")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Preview([FromBody] PreviewRequest request, CancellationToken cancellationToken)
    {
        try
        {
            using var contextRef = umbracoContextFactory.EnsureUmbracoContext();
            var values = ResolveValues(request, contextRef);

            using var result = await renderer.RenderAsync(request.Template, values, cancellationToken);

            var scale = Math.Clamp(request.Scale ?? options.CurrentValue.Preview.Scale, 0.05, 1.0);
            if (scale < 0.999)
            {
                // Half-size webp by default keeps the debounced drag loop cheap on smaller Cloud
                // plans; the full-size render is one button away in the preview pane.
                var width = Math.Max(1, (int)Math.Round(result.Image.Width * scale));
                var height = Math.Max(1, (int)Math.Round(result.Image.Height * scale));
                result.Image.Mutate(ctx => ctx.Resize(width, height));

                var scaled = await mediaWriter.EncodeAsync(
                    result.Image, new OutputSettings { Format = OutputFormat.Webp, Quality = 82 }, cancellationToken);

                return File(scaled, "image/webp");
            }

            var bytes = await mediaWriter.EncodeAsync(result.Image, request.Template.Output, cancellationToken);
            return File(bytes, mediaWriter.ContentTypeFor(request.Template.Output.Format));
        }
        catch (OperationCanceledException)
        {
            // The designer aborts in-flight previews as the editor keeps dragging; that is normal.
            return new EmptyResult();
        }
        catch (Exception ex)
        {
            return Problem(title: "The preview could not be rendered", detail: ex.Message,
                statusCode: StatusCodes.Status400BadRequest);
        }
    }

    /// <summary>
    /// Where each layer actually landed and what it resolved to. The canvas overlays these as the
    /// "measured" bounds, and the preview pane lists the resolved values.
    /// </summary>
    [HttpPost("preview/layout")]
    [ProducesResponseType(typeof(LayoutResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Layout([FromBody] PreviewRequest request, CancellationToken cancellationToken)
    {
        try
        {
            using var contextRef = umbracoContextFactory.EnsureUmbracoContext();
            var values = ResolveValues(request, contextRef);

            var bounds = await renderer.MeasureAsync(request.Template, values, cancellationToken);
            var validation = await validator.ValidateAsync(request.Template, cancellationToken);

            return Ok(new LayoutResponse(
                request.Template.Canvas.Width,
                request.Template.Canvas.Height,
                bounds.Select(b => new LayerBoundsResponse(
                    b.LayerKey, b.X, b.Y, b.Width, b.Height, b.Lines, b.Truncated, b.ResolvedText,
                    b.Rotation, b.PivotX, b.PivotY)).ToList(),
                validation.Issues));
        }
        catch (OperationCanceledException)
        {
            return new EmptyResult();
        }
        catch (Exception ex)
        {
            return Problem(title: "The layout could not be measured", detail: ex.Message,
                statusCode: StatusCodes.Status400BadRequest);
        }
    }

    private IRenderValueSource ResolveValues(PreviewRequest request, UmbracoContextReference contextRef)
    {
        if (!request.UseSampleData && request.ContentKey is { } key)
        {
            var content = contentService.GetById(key);
            if (content is not null)
            {
                return new ContentRenderValueSource(content, contextRef.UmbracoContext.Content?.GetById(key));
            }
        }

        return SampleData.Build(request.Template);
    }
}
