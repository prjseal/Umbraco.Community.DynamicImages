using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using Umbraco.Cms.Core.Actions;
using Umbraco.Cms.Core.Security.Authorization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Web;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Extensions;
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
    IAuthorizationService authorizationService,
    IOptionsMonitor<DynamicImagesOptions> options,
    ILogger<PreviewController> logger) : DynamicImagesControllerBase
{
    /// <summary>
    /// A template document is kilobytes of JSON - a base image is a reference, never bytes - so
    /// anything approaching this is not a template.
    /// </summary>
    internal const long MaxTemplateBytes = 2 * 1024 * 1024;

    [HttpPost("preview")]
    [RequestSizeLimit(MaxTemplateBytes)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Preview([FromBody] PreviewRequest request, CancellationToken cancellationToken)
    {
        try
        {
            using var contextRef = umbracoContextFactory.EnsureUmbracoContext();
            var values = await ResolveValuesAsync(request, contextRef);

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
            return Problem(title: "The preview could not be rendered", detail: Detail(ex),
                statusCode: StatusCodes.Status400BadRequest);
        }
    }

    /// <summary>
    /// Where each layer actually landed and what it resolved to. The canvas overlays these as the
    /// "measured" bounds, and the preview pane lists the resolved values.
    /// </summary>
    [HttpPost("preview/layout")]
    [RequestSizeLimit(MaxTemplateBytes)]
    [ProducesResponseType(typeof(LayoutResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Layout([FromBody] PreviewRequest request, CancellationToken cancellationToken)
    {
        try
        {
            using var contextRef = umbracoContextFactory.EnsureUmbracoContext();
            var values = await ResolveValuesAsync(request, contextRef);

            var layout = await renderer.MeasureLayoutAsync(request.Template, values, cancellationToken);
            var validation = await validator.ValidateAsync(request.Template, cancellationToken);

            return Ok(new LayoutResponse(
                request.Template.Canvas.Width,
                request.Template.Canvas.Height,
                layout.Bounds.Select(b => new LayerBoundsResponse(
                    b.LayerKey, b.X, b.Y, b.Width, b.Height, b.Lines, b.Truncated, b.ResolvedText,
                    b.Rotation, b.PivotX, b.PivotY)).ToList(),
                validation.Issues,
                layout.Skips.Select(s => new LayerSkipResponse(s.LayerKey, s.Reason)).ToList()));
        }
        catch (OperationCanceledException)
        {
            return new EmptyResult();
        }
        catch (Exception ex)
        {
            return Problem(title: "The layout could not be measured", detail: Detail(ex),
                statusCode: StatusCodes.Status400BadRequest);
        }
    }

    /// <summary>
    /// What to tell the caller about a failure.
    /// <para>
    /// A render limit and a complaint about the template's own data are written for an editor and
    /// name nothing but the template, so they are returned as they are. Anything else is a bug or
    /// an environment problem, and its message can carry server paths, connection strings or
    /// stack detail - so it goes to the log and the caller gets a fixed sentence.
    /// </para>
    /// </summary>
    private string Detail(Exception ex)
    {
        if (ex is RenderLimitException or ArgumentException or InvalidOperationException) return ex.Message;

        logger.LogWarning(ex, "Dynamic Images: a preview request failed");

        return "The preview could not be rendered. See the log for details.";
    }

    /// <summary>
    /// The values a preview renders against: the named node's, or the built-in sample data.
    /// <para>
    /// A preview against a real node resolves and returns that node's draft text, so the node has
    /// to be one the caller may read. Section users are trusted designers, which is why a refusal
    /// falls back to sample data rather than failing the preview - they still get a picture, just
    /// not one made of someone else's unpublished words.
    /// </para>
    /// </summary>
    private async Task<IRenderValueSource> ResolveValuesAsync(
        PreviewRequest request, UmbracoContextReference contextRef)
    {
        if (!request.UseSampleData && request.ContentKey is { } key && await CanBrowseAsync(key))
        {
            var content = contentService.GetById(key);
            if (content is not null)
            {
                return new ContentRenderValueSource(content, contextRef.UmbracoContext.Content?.GetById(key));
            }
        }

        return SampleData.Build(request.Template);
    }

    private async Task<bool> CanBrowseAsync(Guid key)
    {
        var result = await authorizationService.AuthorizeResourceAsync(
            User,
            ContentPermissionResource.WithKeys(ActionBrowse.ActionLetter, key),
            AuthorizationPolicies.ContentPermissionByResource);

        return result.Succeeded;
    }
}
