using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>A font family: read, rename, delete. Its variants are created through <see cref="FontsController"/>.</summary>
public class FontFamiliesController(IFontService fontService, IFontFolderService folderService) : DynamicImagesControllerBase
{
    [HttpGet("fonts/families/{key:guid}")]
    [ProducesResponseType(typeof(FontFamilyResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Get(Guid key)
        => fontService.GetFamily(key) is { } family ? Ok(Respond(family)) : FamilyNotFound(key);

    /// <summary>Renames the family, and with it every variant's family name.</summary>
    [HttpPut("fonts/families/{key:guid}")]
    [ProducesResponseType(typeof(FontFamilyResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Update(Guid key, [FromBody] UpdateFontFamilyRequest request)
    {
        var family = fontService.RenameFamily(key, request.Name, out var outcome);

        return outcome switch
        {
            TreeOperationOutcome.Success => Ok(Respond(family!)),
            TreeOperationOutcome.InvalidName => Problem(title: "The family needs a name",
                detail: "Give the family a name of up to 255 characters.", statusCode: StatusCodes.Status400BadRequest),
            _ => FamilyNotFound(key)
        };
    }

    /// <summary>The family and every variant in it; refused with the templates named while any variant is in use.</summary>
    [HttpDelete("fonts/families/{key:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Delete(Guid key)
    {
        var result = fontService.DeleteFamily(key);

        return result.Outcome switch
        {
            TreeOperationOutcome.Success => Ok(),
            TreeOperationOutcome.InUse => Problem(
                title: "That font is still in use",
                detail: $"Remove it from {string.Join(", ", result.InUse.Select(t => $"'{t.Name}'"))} first.",
                statusCode: StatusCodes.Status409Conflict),
            _ => FamilyNotFound(key)
        };
    }

    private FontFamilyResponse Respond(FontFamily family)
        => new(family.Key, family.Name, family.ParentKey,
            folderService.GetTree().VariantsOf(family.Key).Count, fontService.TemplatesUsingFamily(family.Key).Count);

    private IActionResult FamilyNotFound(Guid key)
        => Problem(title: "Font family not found", detail: $"No font family exists with the key {key}.",
            statusCode: StatusCodes.Status404NotFound);
}
