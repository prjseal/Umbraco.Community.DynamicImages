using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Actions;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Security.Authorization;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Extensions;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// Regenerating the image for a single document. On its own controller so it carries only the
/// weaker Regenerate policy - which is what lets the document entity action and the media picker
/// property action work for editors who cannot open the Dynamic Images section.
/// <para>
/// That policy is only "has a section", though, so every call here is additionally authorised
/// against the node itself. Without it any editor could regenerate any document by key, start
/// nodes and node permissions included.
/// </para>
/// </summary>
public class DocumentRegenerationController(
    IRegenerationService regenerationService,
    IAuthorizationService authorizationService,
    IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
    : DynamicImagesContentControllerBase
{
    /// <summary>
    /// Regenerates one document's image, overriding the template's "only when empty" trigger -
    /// an editor asking for this explicitly means they want the image replaced.
    /// <para>
    /// Requires Update on the node, and Publish as well for the new image to go live. An editor
    /// with only Update - or a node with edits that have not been published - gets the image on
    /// the draft and the <c>generateddraft</c> outcome saying so.
    /// </para>
    /// <para>
    /// <paramref name="culture"/> is accepted and ignored: the generated image hangs off the node
    /// rather than off one culture's values, so the publish covers every culture.
    /// </para>
    /// </summary>
    [HttpPost("documents/{key:guid}/regenerate")]
    [ProducesResponseType(typeof(RegenerateDocumentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegenerateDocument(Guid key, [FromQuery] string? culture, CancellationToken cancellationToken)
    {
        // The same call Umbraco's own document controllers make, so the same rules apply: this
        // covers the user's start nodes as well as explicit per-node permissions, because the
        // handler behind it walks the node's path.
        if (!await AllowedAsync(ActionUpdate.ActionLetter, key)) return Forbidden();

        // Not a 403 when it fails: an editor who may update but not publish is still allowed to
        // put a new image on the draft, and that is a better answer than refusing them outright.
        var allowPublish = await AllowedAsync(ActionPublish.ActionLetter, key);

        var result = await regenerationService.RegenerateDocumentAsync(
            key,
            template: null,
            force: true,
            userId: CurrentUserId(),
            allowPublish: allowPublish,
            cancellationToken: cancellationToken);

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

    private async Task<bool> AllowedAsync(string permission, Guid key)
    {
        var result = await authorizationService.AuthorizeResourceAsync(
            User,
            ContentPermissionResource.WithKeys(permission, key),
            AuthorizationPolicies.ContentPermissionByResource);

        return result.Succeeded;
    }

    /// <summary>
    /// Who the save or publish is attributed to. Null only when there is somehow no signed-in
    /// user, in which case the service falls back the way a background caller does.
    /// </summary>
    private int? CurrentUserId() => backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser?.Id;
}
