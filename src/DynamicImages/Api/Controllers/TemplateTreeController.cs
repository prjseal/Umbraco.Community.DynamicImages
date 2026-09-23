using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// What the backoffice's Templates tree reads: a level at a time, the path to an item, items by
/// key (for the delete and move entity actions), and moves.
/// </summary>
public class TemplateTreeController(
    ITemplateFolderService folderService,
    ITemplateService templateService) : DynamicImagesControllerBase
{
    private const int MaxTake = 500;

    [HttpGet("tree/root")]
    [ProducesResponseType(typeof(TemplateTreeResponse), StatusCodes.Status200OK)]
    public IActionResult Root([FromQuery] int skip = 0, [FromQuery] int take = 100, [FromQuery] bool foldersOnly = false)
        => Ok(Page(folderService.GetTree().ChildrenOf(null, foldersOnly), skip, take));

    [HttpGet("tree/children")]
    [ProducesResponseType(typeof(TemplateTreeResponse), StatusCodes.Status200OK)]
    public IActionResult Children(
        [FromQuery] Guid? parentKey, [FromQuery] int skip = 0, [FromQuery] int take = 100, [FromQuery] bool foldersOnly = false)
        => Ok(Page(folderService.GetTree().ChildrenOf(parentKey, foldersOnly), skip, take));

    /// <summary>From the top of the tree down to the item, the item itself last.</summary>
    [HttpGet("tree/ancestors")]
    [ProducesResponseType(typeof(IReadOnlyList<TemplateTreeItemResponse>), StatusCodes.Status200OK)]
    public IActionResult Ancestors([FromQuery] Guid descendantKey)
        => Ok(folderService.GetTree().AncestorsOf(descendantKey).Select(TemplateTreeItemResponse.From).ToList());

    /// <summary>Folders and templates by key. Unknown keys are left out rather than failing the batch.</summary>
    [HttpGet("item")]
    [ProducesResponseType(typeof(IReadOnlyList<TemplateTreeItemResponse>), StatusCodes.Status200OK)]
    public IActionResult Items([FromQuery(Name = "key")] Guid[] keys)
    {
        var tree = folderService.GetTree();

        return Ok(keys.Distinct()
            .Select(tree.Find)
            .Where(node => node is not null)
            .Select(node => TemplateTreeItemResponse.From(node!))
            .ToList());
    }

    [HttpPut("templates/{key:guid}/move")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MoveTemplate(Guid key, [FromBody] MoveRequest request, CancellationToken cancellationToken)
        => MoveResult(await templateService.MoveAsync(key, request.TargetKey, cancellationToken), "template", key);

    [HttpPut("folders/{key:guid}/move")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult MoveFolder(Guid key, [FromBody] MoveRequest request)
        => MoveResult(folderService.Move(key, request.TargetKey).Outcome, "folder", key);

    private IActionResult MoveResult(TreeOperationOutcome outcome, string what, Guid key) => outcome switch
    {
        TreeOperationOutcome.Success => Ok(),
        TreeOperationOutcome.NotFound => Problem(title: $"The {what} was not found",
            detail: $"No {what} exists with the key {key}.", statusCode: StatusCodes.Status404NotFound),
        TreeOperationOutcome.TargetNotFound => Problem(title: "The target folder was not found",
            detail: "Choose the Templates root or an existing folder.", statusCode: StatusCodes.Status400BadRequest),
        TreeOperationOutcome.WouldCreateCycle => Problem(title: "A folder cannot move into itself",
            detail: "Choose a folder that is not this one or inside it.", statusCode: StatusCodes.Status400BadRequest),
        _ => Problem(title: "The move failed", statusCode: StatusCodes.Status400BadRequest)
    };

    private static TemplateTreeResponse Page(IReadOnlyList<TemplateTreeNode> nodes, int skip, int take)
        => new(nodes.Count, nodes
            .Skip(Math.Max(0, skip))
            // take=0 is how the backoffice asks "is there anything?" for the root's hasChildren.
            .Take(Math.Clamp(take, 0, MaxTake))
            .Select(TemplateTreeItemResponse.From)
            .ToList());
}
