using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// Regenerating the image for a single document. On its own controller so it carries only the
/// weaker Regenerate policy - which is what lets the document entity action and the media picker
/// property action work for editors who cannot open the Dynamic Images section.
/// </summary>
public class DocumentRegenerationController(IRegenerationService regenerationService)
    : DynamicImagesContentControllerBase
{
    /// <summary>
    /// Regenerates one document's image, overriding the template's "only when empty" trigger -
    /// an editor asking for this explicitly means they want the image replaced.
    /// </summary>
    [HttpPost("documents/{key:guid}/regenerate")]
    [ProducesResponseType(typeof(RegenerateDocumentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegenerateDocument(Guid key, [FromQuery] string? culture, CancellationToken cancellationToken)
    {
        var result = await regenerationService.RegenerateDocumentAsync(key, template: null, force: true, cancellationToken);

        return result.Outcome switch
        {
            RegenerationOutcome.NotFound => Problem(
                title: "Content not found", detail: $"No content exists with the key {key}.",
                statusCode: StatusCodes.Status404NotFound),

            RegenerationOutcome.NoTemplate => Problem(
                title: "No template for this document type", detail: result.Message,
                statusCode: StatusCodes.Status404NotFound),

            RegenerationOutcome.Failed => Problem(
                title: "The image could not be generated", detail: result.Message,
                statusCode: StatusCodes.Status400BadRequest),

            _ => Ok(new RegenerateDocumentResponse(
                result.Outcome.ToString().ToLowerInvariant(), result.MediaKey, result.PropertyValue, result.Message))
        };
    }
}
