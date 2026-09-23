using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// What the backoffice's Fonts tree reads - a level at a time, the path to an item, items by key,
/// the collections, a font's references - and its moves and sort. Modelled on
/// <see cref="TemplateTreeController"/>.
/// </summary>
public class FontTreeController(IFontFolderService folderService, IFontService fontService) : DynamicImagesControllerBase
{
    private const int MaxTake = 500;

    [HttpGet("fonts/tree/root")]
    [ProducesResponseType(typeof(FontTreeResponse), StatusCodes.Status200OK)]
    public IActionResult Root([FromQuery] int skip = 0, [FromQuery] int take = 100, [FromQuery] bool foldersOnly = false)
        => Ok(Page(folderService.GetTree().ChildrenOf(null, foldersOnly), skip, take));

    /// <summary>A folder's folders and families, or a family's variants.</summary>
    [HttpGet("fonts/tree/children")]
    [ProducesResponseType(typeof(FontTreeResponse), StatusCodes.Status200OK)]
    public IActionResult Children(
        [FromQuery] Guid? parentKey, [FromQuery] int skip = 0, [FromQuery] int take = 100, [FromQuery] bool foldersOnly = false)
        => Ok(Page(folderService.GetTree().ChildrenOf(parentKey, foldersOnly), skip, take));

    /// <summary>From the top of the tree down to the item, the item itself last.</summary>
    [HttpGet("fonts/tree/ancestors")]
    [ProducesResponseType(typeof(IReadOnlyList<FontTreeItemResponse>), StatusCodes.Status200OK)]
    public IActionResult Ancestors([FromQuery] Guid descendantKey)
        => Ok(folderService.GetTree().AncestorsOf(descendantKey).Select(FontTreeItemResponse.From).ToList());

    /// <summary>Folders, families and variants by key. Unknown keys are left out rather than failing the batch.</summary>
    [HttpGet("fonts/item")]
    [ProducesResponseType(typeof(IReadOnlyList<FontTreeItemResponse>), StatusCodes.Status200OK)]
    public IActionResult Items([FromQuery(Name = "key")] Guid[] keys)
    {
        var tree = folderService.GetTree();

        return Ok(keys.Distinct()
            .Select(tree.Find)
            .Where(node => node is not null)
            .Select(node => FontTreeItemResponse.From(node!))
            .ToList());
    }

    /// <summary>
    /// What the root, a folder and a family show as a collection: a level's folders and families
    /// in the tree's order, or a family's variants. <paramref name="filter"/> matches names.
    /// </summary>
    [HttpGet("fonts/collection")]
    [ProducesResponseType(typeof(FontCollectionResponse), StatusCodes.Status200OK)]
    public IActionResult Collection(
        [FromQuery] Guid? parentKey, [FromQuery] string? filter = null, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        var tree = folderService.GetTree();
        var usedBy = UsageCounts(tree);

        var children = tree.ChildrenOf(parentKey)
            .Where(n => string.IsNullOrWhiteSpace(filter) || n.Name.Contains(filter.Trim(), StringComparison.OrdinalIgnoreCase))
            .ToList();

        var items = children
            .Skip(Math.Max(0, skip))
            .Take(Math.Clamp(take, 0, MaxTake))
            .Select(n => n.EntityType switch
            {
                FontTreeEntityType.Folder => new FontCollectionItemResponse(
                    n.Key, "folder", n.Name, n.ParentKey, null, null, null, null, null, null, null),

                FontTreeEntityType.Family => new FontCollectionItemResponse(
                    n.Key, "family", n.Name, n.ParentKey, n.VariantCount,
                    tree.VariantsOf(n.Key).SelectMany(v => usedBy.GetValueOrDefault(v.Key, [])).Distinct().Count(),
                    n.Name, null, null, null, null),

                _ => new FontCollectionItemResponse(
                    n.Key, "font", n.Name, n.ParentKey, null, usedBy.GetValueOrDefault(n.Key, []).Count,
                    n.Font!.FamilyName, n.Font.Weight, n.Font.IsItalic, SourceKindOf(n.Font), n.Font.Provider)
            })
            .ToList();

        return Ok(new FontCollectionResponse(children.Count, items));
    }

    /// <summary>
    /// The templates using a font - a variant, or any variant of a family - for the delete modal's
    /// reference list.
    /// </summary>
    [HttpGet("fonts/{key:guid}/references")]
    [ProducesResponseType(typeof(FontReferencesResponse), StatusCodes.Status200OK)]
    public IActionResult References(Guid key, [FromQuery] int skip = 0, [FromQuery] int take = 20)
    {
        var templates = UsingAny(key);

        return Ok(new FontReferencesResponse(templates.Count, templates
            .OrderBy(t => t.Name, StringComparer.OrdinalIgnoreCase)
            .Skip(Math.Max(0, skip))
            .Take(Math.Clamp(take, 0, MaxTake))
            .Select(t => new FontReferenceResponse(t.Key, t.Name, t.IsEnabled))
            .ToList()));
    }

    /// <summary>Which of <paramref name="keys"/> - families or variants - any template uses.</summary>
    [HttpGet("fonts/are-referenced")]
    [ProducesResponseType(typeof(FontTreeResponse), StatusCodes.Status200OK)]
    public IActionResult AreReferenced([FromQuery(Name = "key")] Guid[] keys, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        var tree = folderService.GetTree();
        var referenced = keys.Distinct()
            .Where(k => UsingAny(k).Count > 0)
            .Select(tree.Find)
            .Where(n => n is not null)
            .Select(n => FontTreeItemResponse.From(n!))
            .ToList();

        return Ok(new FontTreeResponse(referenced.Count, referenced.Skip(Math.Max(0, skip)).Take(Math.Clamp(take, 0, MaxTake)).ToList()));
    }

    [HttpPut("fonts/families/{key:guid}/move")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult MoveFamily(Guid key, [FromBody] MoveRequest request)
        => MoveResult(fontService.MoveFamily(key, request.TargetKey), "font family", key);

    [HttpPut("fonts/folders/{key:guid}/move")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult MoveFolder(Guid key, [FromBody] MoveRequest request)
        => MoveResult(folderService.Move(key, request.TargetKey).Outcome, "folder", key);

    /// <summary>The Sort action on the Fonts root and on folders.</summary>
    [HttpPut("fonts/tree/sort")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Sort([FromBody] SortRequest request)
        => MoveResult(
            fontService.SortChildren(request.ParentKey, (request.Sorting ?? []).Select(s => (s.Key, s.SortOrder)).ToList()),
            "folder", request.ParentKey ?? Guid.Empty);

    /// <summary>
    /// The collection's bulk Move to: folders and families, each through its own move. The ones
    /// that could not move come back as a ValidationProblemDetails keyed by item.
    /// </summary>
    [HttpPut("fonts/tree/bulk-move")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult BulkMove([FromBody] BulkRequest request)
    {
        var tree = folderService.GetTree();
        if (request.TargetKey is { } target && !tree.FolderExists(target))
            return MoveResult(TreeOperationOutcome.TargetNotFound, "folder", target);

        var failures = new Dictionary<string, string[]>();
        foreach (var key in (request.Keys ?? []).Distinct())
        {
            var node = tree.Find(key);
            var outcome = node?.EntityType switch
            {
                FontTreeEntityType.Folder => folderService.Move(key, request.TargetKey).Outcome,
                FontTreeEntityType.Family => fontService.MoveFamily(key, request.TargetKey),
                _ => TreeOperationOutcome.NotFound
            };

            if (outcome == TreeOperationOutcome.Success) continue;

            var why = outcome switch
            {
                TreeOperationOutcome.WouldCreateCycle => "a folder cannot move into itself.",
                _ when node?.EntityType == FontTreeEntityType.Font => "a variant moves with its family.",
                TreeOperationOutcome.NotFound => "it no longer exists.",
                _ => "the move failed."
            };
            failures[key.ToString()] = [$"{node?.Name ?? key.ToString()}: {why}"];
        }

        if (failures.Count == 0) return Ok();

        return ValidationProblem(new ValidationProblemDetails(failures)
        {
            Title = failures.Count == 1 ? "One item could not be moved" : $"{failures.Count} items could not be moved",
            Detail = string.Join(" ", failures.Values.SelectMany(v => v)),
            Status = StatusCodes.Status400BadRequest
        });
    }

    private IReadOnlyList<Template> UsingAny(Guid key)
        => fontService.GetFamily(key) is not null ? fontService.TemplatesUsingFamily(key) : fontService.TemplatesUsing(key);

    /// <summary>Per variant, the templates using it - worked out once for a whole collection page.</summary>
    private Dictionary<Guid, List<Guid>> UsageCounts(FontTree tree)
        => tree.Families
            .SelectMany(f => tree.VariantsOf(f.Key))
            .ToDictionary(v => v.Key, v => fontService.TemplatesUsing(v.Key).Select(t => t.Key).ToList());

    private static string SourceKindOf(FontDefinition font) => font.SourceKind switch
    {
        ImageSourceKind.Path => "path",
        ImageSourceKind.Url => "url",
        _ => "media"
    };

    private IActionResult MoveResult(TreeOperationOutcome outcome, string what, Guid key) => outcome switch
    {
        TreeOperationOutcome.Success => Ok(),
        TreeOperationOutcome.NotFound => Problem(title: $"The {what} was not found",
            detail: $"No {what} exists with the key {key}.", statusCode: StatusCodes.Status404NotFound),
        TreeOperationOutcome.TargetNotFound => Problem(title: "The target folder was not found",
            detail: "Choose the Fonts root or an existing folder.", statusCode: StatusCodes.Status400BadRequest),
        TreeOperationOutcome.WouldCreateCycle => Problem(title: "A folder cannot move into itself",
            detail: "Choose a folder that is not this one or inside it.", statusCode: StatusCodes.Status400BadRequest),
        _ => Problem(title: "The move failed", statusCode: StatusCodes.Status400BadRequest)
    };

    private static FontTreeResponse Page(IReadOnlyList<FontTreeNode> nodes, int skip, int take)
        => new(nodes.Count, nodes
            .Skip(Math.Max(0, skip))
            .Take(Math.Clamp(take, 0, MaxTake))
            .Select(FontTreeItemResponse.From)
            .ToList());
}
