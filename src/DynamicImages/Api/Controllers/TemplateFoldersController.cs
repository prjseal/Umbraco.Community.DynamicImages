using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>Folder CRUD for the Templates tree. Moves are on <see cref="TemplateTreeController"/>.</summary>
public class TemplateFoldersController(ITemplateFolderService folderService) : DynamicImagesControllerBase
{
    [HttpPost("folders")]
    [ProducesResponseType(typeof(TemplateFolderResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Create([FromBody] CreateTemplateFolderRequest request)
    {
        if (request.Key is { } key && folderService.Get(key) is not null)
        {
            return Problem(title: "That folder already exists", detail: $"A folder already has the key {key}.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var result = folderService.Create(request.Name, request.ParentKey, request.Key);

        return result.Outcome == TreeOperationOutcome.Success
            ? Created($"folders/{result.Folder!.Key}", TemplateFolderResponse.From(result.Folder))
            : Failure(result.Outcome, request.Key ?? Guid.Empty);
    }

    [HttpGet("folders/{key:guid}")]
    [ProducesResponseType(typeof(TemplateFolderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Get(Guid key)
        => folderService.Get(key) is { } folder
            ? Ok(TemplateFolderResponse.From(folder))
            : Failure(TreeOperationOutcome.NotFound, key);

    [HttpPut("folders/{key:guid}")]
    [ProducesResponseType(typeof(TemplateFolderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Update(Guid key, [FromBody] UpdateTemplateFolderRequest request)
    {
        var result = folderService.Rename(key, request.Name);

        return result.Outcome == TreeOperationOutcome.Success
            ? Ok(TemplateFolderResponse.From(result.Folder!))
            : Failure(result.Outcome, key);
    }

    [HttpDelete("folders/{key:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Delete(Guid key)
    {
        var result = folderService.Delete(key);

        return result.Outcome == TreeOperationOutcome.Success ? Ok() : Failure(result.Outcome, key);
    }

    private IActionResult Failure(TreeOperationOutcome outcome, Guid key) => outcome switch
    {
        TreeOperationOutcome.NotFound => Problem(title: "Folder not found",
            detail: $"No folder exists with the key {key}.", statusCode: StatusCodes.Status404NotFound),
        TreeOperationOutcome.NotEmpty => Problem(title: "The folder is not empty",
            detail: "Move or delete the templates and folders inside it first.", statusCode: StatusCodes.Status409Conflict),
        TreeOperationOutcome.InvalidName => Problem(title: "The folder needs a name",
            detail: "Give the folder a name of up to 255 characters.", statusCode: StatusCodes.Status400BadRequest),
        TreeOperationOutcome.TargetNotFound => Problem(title: "The parent folder was not found",
            detail: "Choose the Templates root or an existing folder.", statusCode: StatusCodes.Status400BadRequest),
        _ => Problem(title: "The folder could not be saved", statusCode: StatusCodes.Status400BadRequest)
    };
}
