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

    /// <summary>
    /// What the Templates root and a folder show as a collection: everything directly inside, in
    /// the tree's order. <paramref name="filter"/> matches names; <paramref name="orderBy"/>
    /// <c>updated</c> puts the folders first and then the templates newest first.
    /// </summary>
    [HttpGet("collection/templates")]
    [ProducesResponseType(typeof(TemplateCollectionResponse), StatusCodes.Status200OK)]
    public IActionResult Collection(
        [FromQuery] Guid? parentKey,
        [FromQuery] string? filter = null,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 100,
        [FromQuery] string? orderBy = null)
    {
        var tree = folderService.GetTree();
        var byKey = templateService.GetAll().ToDictionary(t => t.Key);

        var children = tree.ChildrenOf(parentKey)
            .Where(n => string.IsNullOrWhiteSpace(filter) || n.Name.Contains(filter.Trim(), StringComparison.OrdinalIgnoreCase))
            .ToList();

        var ordered = string.Equals(orderBy, "updated", StringComparison.OrdinalIgnoreCase)
            ? children.Where(n => n.IsFolder)
                .Concat(children.Where(n => !n.IsFolder)
                    .OrderByDescending(n => byKey.TryGetValue(n.Key, out var t) ? t.UpdatedUtc : DateTime.MinValue))
                .ToList()
            : children;

        var items = ordered
            .Skip(Math.Max(0, skip))
            .Take(Math.Clamp(take, 0, MaxTake))
            .Select(n => n.IsFolder || !byKey.TryGetValue(n.Key, out var t)
                ? new TemplateCollectionItemResponse(n.Key, "folder", n.Name, n.ParentKey, true, null, null, null, null, null, null)
                : new TemplateCollectionItemResponse(
                    n.Key, "template", n.Name, n.ParentKey, t.IsEnabled, t.DocTypeAliases, t.TargetPropertyAlias,
                    t.Layers.Count, t.Canvas.Width, t.Canvas.Height, t.UpdatedUtc))
            .ToList();

        return Ok(new TemplateCollectionResponse(ordered.Count, items));
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

    /// <summary>
    /// The collection's bulk Move to: each key, folder or template, goes through the same move as
    /// its own ⋯ action, cycle check included. The ones that could not move come back as a
    /// ValidationProblemDetails keyed by item; the rest have moved.
    /// </summary>
    [HttpPut("tree/bulk-move")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> BulkMove([FromBody] BulkRequest request, CancellationToken cancellationToken)
    {
        var tree = folderService.GetTree();
        if (request.TargetKey is { } target && !tree.FolderExists(target))
            return MoveResult(TreeOperationOutcome.TargetNotFound, "folder", target);

        var failures = new Dictionary<string, string[]>();
        foreach (var key in (request.Keys ?? []).Distinct())
        {
            var node = tree.Find(key);
            var outcome = node switch
            {
                null => TreeOperationOutcome.NotFound,
                { IsFolder: true } => folderService.Move(key, request.TargetKey).Outcome,
                _ => await templateService.MoveAsync(key, request.TargetKey, cancellationToken)
            };

            if (outcome != TreeOperationOutcome.Success)
                failures[key.ToString()] = [$"{node?.Name ?? key.ToString()}: {MoveFailure(outcome)}"];
        }

        if (failures.Count == 0) return Ok();

        return ValidationProblem(new ValidationProblemDetails(failures)
        {
            Title = failures.Count == 1 ? "One item could not be moved" : $"{failures.Count} items could not be moved",
            Detail = string.Join(" ", failures.Values.SelectMany(v => v)),
            Status = StatusCodes.Status400BadRequest
        });
    }

    private static string MoveFailure(TreeOperationOutcome outcome) => outcome switch
    {
        TreeOperationOutcome.NotFound => "it no longer exists.",
        TreeOperationOutcome.WouldCreateCycle => "a folder cannot move into itself.",
        _ => "the move failed."
    };

    /// <summary>The Sort action on the root and on folders.</summary>
    [HttpPut("tree/sort")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Sort([FromBody] SortRequest request, CancellationToken cancellationToken)
    {
        var outcome = await templateService.SortChildrenAsync(
            request.ParentKey, (request.Sorting ?? []).Select(s => (s.Key, s.SortOrder)).ToList(), cancellationToken);

        return MoveResult(outcome, "folder", request.ParentKey ?? Guid.Empty);
    }

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
