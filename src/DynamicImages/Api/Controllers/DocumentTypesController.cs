using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Persistence;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Persistence.Querying;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Extensions;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// Feeds the designer's property palette and sample-content picker. Read-only views over
/// Umbraco's own services - nothing here is Dynamic Images state.
/// </summary>
public class DocumentTypesController(
    IContentTypeService contentTypeService,
    IDataTypeService dataTypeService,
    IContentService contentService,
    IEntityService entityService,
    IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
    AppCaches appCaches,
    ICoreScopeProvider scopeProvider) : DynamicImagesControllerBase
{
    [HttpGet("document-types")]
    [ProducesResponseType(typeof(IReadOnlyList<DocumentTypeResponse>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
        => Ok(contentTypeService.GetAll()
            // Element types cannot be published on their own, so nothing would ever trigger a
            // template attached to one.
            .Where(contentType => !contentType.IsElement)
            .OrderBy(contentType => contentType.Name)
            .Select(contentType => new DocumentTypeResponse(
                contentType.Key,
                contentType.Alias,
                contentType.Name ?? contentType.Alias,
                contentType.Icon ?? "icon-document"))
            .ToList());

    [HttpGet("document-types/{alias}/properties")]
    [ProducesResponseType(typeof(IReadOnlyList<DocumentTypePropertyResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProperties(string alias)
    {
        var contentType = contentTypeService.Get(alias);
        if (contentType is null)
        {
            return Problem(title: "Document type not found", detail: $"No document type has the alias '{alias}'.",
                statusCode: StatusCodes.Status404NotFound);
        }

        var properties = await PropertiesOfAsync([contentType]);

        // The pseudo-properties the bindings understand. They are not on the document type, but
        // they are exactly what an editor reaches for first, so the palette offers them.
        properties.InsertRange(0,
        [
            NameProperty,
            CreateDateProperty,
            UpdateDateProperty,
            new DocumentTypePropertyResponse("readingTime", "Reading time", "Node", "Umbraco.TextBox", "readingTime", IsSystem: true)
        ]);

        return Ok(properties);
    }

    /// <summary>
    /// The union of the real properties across some document types, de-duplicated by alias with
    /// the first winning - the same rule the client's own union uses.
    /// </summary>
    private async Task<List<DocumentTypePropertyResponse>> PropertiesOfAsync(IReadOnlyList<IContentType> contentTypes)
    {
        // One lookup for every document type at once rather than a blocking one per property: this
        // used to be a `.GetAwaiter().GetResult()` inside a Select, so a 40-property document
        // type was 40 sequential queries, each holding a thread-pool thread.
        var dataTypeKeys = contentTypes
            .SelectMany(contentType => contentType.CompositionPropertyTypes)
            .Select(property => property.DataTypeKey)
            .Distinct()
            .ToArray();

        var editorAliases = (await dataTypeService.GetAllAsync(dataTypeKeys))
            .GroupBy(dataType => dataType.Key)
            .ToDictionary(group => group.Key, group => group.First().EditorAlias);

        return contentTypes
            .SelectMany(contentType => contentType.CompositionPropertyTypes
                .Select(property =>
                {
                    var editorAlias = editorAliases.GetValueOrDefault(property.DataTypeKey)
                                      ?? property.PropertyEditorAlias;

                    return new DocumentTypePropertyResponse(
                        property.Alias,
                        property.Name ?? property.Alias,
                        GroupName(contentType, property),
                        editorAlias,
                        Classify(editorAlias),
                        IsSystem: false);
                }))
            .GroupBy(property => property.Alias, StringComparer.OrdinalIgnoreCase)
            .Select(group => group.First())
            .OrderBy(property => property.Group)
            .ThenBy(property => property.Name)
            .ToList();
    }

    private static readonly DocumentTypePropertyResponse NameProperty =
        new("name", "Name", "Node", "Umbraco.TextBox", "text", IsSystem: true);

    private static readonly DocumentTypePropertyResponse CreateDateProperty =
        new("createDate", "Publish date", "Node", "Umbraco.DateTime", "date", IsSystem: true);

    private static readonly DocumentTypePropertyResponse UpdateDateProperty =
        new("updateDate", "Last updated", "Node", "Umbraco.DateTime", "date", IsSystem: true);

    /// <summary>
    /// What a content-reference property on <paramref name="alias"/> points at, and the properties
    /// available on the far side of it - the designer's second dropdown.
    /// </summary>
    [HttpGet("document-types/{alias}/properties/{propertyAlias}/linked")]
    [ProducesResponseType(typeof(LinkedPropertiesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLinkedProperties(string alias, string propertyAlias)
    {
        var contentType = contentTypeService.Get(alias);
        if (contentType is null)
        {
            return Problem(title: "Document type not found", detail: $"No document type has the alias '{alias}'.",
                statusCode: StatusCodes.Status404NotFound);
        }

        var property = contentType.CompositionPropertyTypes
            .FirstOrDefault(p => string.Equals(p.Alias, propertyAlias, StringComparison.OrdinalIgnoreCase));

        if (property is null)
        {
            return Problem(title: "Property not found",
                detail: $"'{alias}' has no property called '{propertyAlias}'.",
                statusCode: StatusCodes.Status404NotFound);
        }

        // The "all" fallback is the expensive case on a large site. The key carries the caller's
        // start-node signature because two users with different start nodes can legitimately sample
        // different nodes, and a shared entry would leak one user's narrowing to the other.
        var cacheKey = $"DynamicImages.LinkedProperties.{contentType.Key}.{property.Alias}.{StartNodeSignature()}";

        if (appCaches.RuntimeCache.Get(cacheKey) is LinkedPropertiesResponse cached) return Ok(cached);

        var response = await BuildLinkedPropertiesAsync(contentType, property);

        appCaches.RuntimeCache.Insert(cacheKey, () => response, TimeSpan.FromSeconds(60));

        return Ok(response);
    }

    private async Task<LinkedPropertiesResponse> BuildLinkedPropertiesAsync(IContentType contentType, IPropertyType property)
    {
        var dataType = await dataTypeService.GetAsync(property.DataTypeKey);
        var editorAlias = dataType?.EditorAlias ?? property.PropertyEditorAlias;

        // Not a content reference: an empty 200 rather than a 400. The designer asks speculatively
        // every time the first dropdown changes, so an error toast per keystroke would be noise -
        // it simply does not render a second dropdown. Umbraco.MultiUrlPicker classifies as "other"
        // and is deliberately out of scope: its value mixes UDIs with external URLs.
        if (Classify(editorAlias) != "content") return Empty(property, "none");

        var (targets, inference) = InferTargets(contentType, property, dataType);

        if (targets.Count == 0) return Empty(property, inference);

        var properties = await PropertiesOfAsync(targets);

        // The pseudo-properties that are readable on a linked node. Deliberately not readingTime:
        // it is a binding kind rather than a property, and would be read here as a literal alias.
        properties.InsertRange(0, [NameProperty, CreateDateProperty, UpdateDateProperty]);

        return new LinkedPropertiesResponse(property.Alias, inference, targets.Select(Describe).ToList(), properties);
    }

    private (IReadOnlyList<IContentType> Targets, string Inference) InferTargets(
        IContentType contentType, IPropertyType property, IDataType? dataType)
    {
        // 1. What the picker itself allows. Read by dictionary key rather than by casting to
        //    MultiNodePickerConfiguration: the dictionary read is version-robust and the typed
        //    class has moved between majors. Note Umbraco.ContentPicker has no filter at all.
        var filtered = DataTypeFilter.Parse(dataType?.ConfigurationData)
            .Select(token => Guid.TryParse(token, out var key)
                // 17 writes content-type keys; older sites wrote aliases.
                ? contentTypeService.Get(key)
                : contentTypeService.Get(token))
            .Where(target => target is not null)
            .Select(target => target!)
            .DistinctBy(target => target.Key)
            .ToList();

        if (filtered.Count > 0) return (filtered, "filter");

        // 2. What existing content actually picks. This is the step that carries a picker with no
        //    filter at all, which is the common case.
        var sampled = SampleTargets(contentType, property);
        if (sampled.Count > 0) return (sampled, "sampled");

        // 3. Nothing could narrow it, so offer everything that can be picked.
        var all = contentTypeService.GetAll().Where(target => !target.IsElement).ToList();

        return (all, "all");
    }

    /// <summary>
    /// The document types a page of existing nodes actually point at through this property.
    /// <para>
    /// One paged query, then one batched entity lookup: the slim row already carries the content
    /// type key, so this is one query rather than one content load per key. The page is of drafts,
    /// which is right - they carry the picker value, and it matches the draft-first rendering rule.
    /// Parsing with the renderer's own <see cref="DocumentReference"/> means the endpoint and the
    /// render agree by construction about what a reference is.
    /// </para>
    /// <para>
    /// Deliberately not used: <c>startNode.dynamicRoot.querySteps[].anyOfDocTypeKeys</c>. In the
    /// fixtures it names the list container, not the picked item's type, so taking that container's
    /// allowed types would be right only by coincidence of how one site models its content - and a
    /// confidently wrong narrowing is worse than the honest fallback. Please do not "improve" this.
    /// </para>
    /// </summary>
    private IReadOnlyList<IContentType> SampleTargets(IContentType owner, IPropertyType property)
    {
        // Mandatory, not optional. The response is metadata rather than node values, so nothing
        // leaks, but scoping keeps the inference consistent with what this user can see and stops a
        // narrow-start-node user driving an unscoped query across the whole tree.
        var filter = ScopeToStartNodes(scopeProvider.CreateQuery<IContent>());

        var keys = contentService.GetPagedOfType(owner.Id, 0, SampleSize, out _, filter)
            .SelectMany(node => DocumentReference.ResolveKeys(node.GetValue<string>(property.Alias)))
            .Distinct()
            .Take(SampleSize)
            .ToArray();

        if (keys.Length == 0) return [];

        return entityService.GetAll(UmbracoObjectTypes.Document, keys)
            .OfType<IContentEntitySlim>()
            .Select(slim => slim.ContentTypeKey)
            .Distinct()
            .Select(contentTypeService.Get)
            .Where(target => target is not null)
            .Select(target => target!)
            .ToList();
    }

    /// <summary>How many nodes are sampled, and how many keys are followed out of them.</summary>
    private const int SampleSize = 20;

    private static LinkedPropertiesResponse Empty(IPropertyType property, string inference)
        => new(property.Alias, inference, [], []);

    private static DocumentTypeResponse Describe(IContentType contentType)
        => new(contentType.Key, contentType.Alias, contentType.Name ?? contentType.Alias,
            contentType.Icon ?? "icon-document");

    /// <summary>
    /// A stable string for the caller's start nodes, so two users with different ones do not share
    /// a cached inference.
    /// </summary>
    private string StartNodeSignature()
    {
        var user = backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser;
        var startNodeIds = user?.CalculateContentStartNodeIds(entityService, appCaches);

        return startNodeIds is null or [] ? "root" : string.Join('-', startNodeIds.Order());
    }

    [HttpGet("document-types/{alias}/content")]
    [ProducesResponseType(typeof(SampleContentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetContent(string alias, [FromQuery] string? query = null, [FromQuery] int skip = 0, [FromQuery] int take = 50)
    {
        var contentType = contentTypeService.Get(alias);
        if (contentType is null)
        {
            return Problem(title: "Document type not found", detail: $"No document type has the alias '{alias}'.",
                statusCode: StatusCodes.Status404NotFound);
        }

        var pageSize = Math.Clamp(take, 1, 200);

        // A negative skip made a negative page index, which the paged query answered with a 500.
        var page = Math.Max(0, skip) / pageSize;

        // An empty query matches everything; the overload's filter parameter is not nullable.
        var filter = scopeProvider.CreateQuery<IContent>();
        if (!string.IsNullOrWhiteSpace(query))
        {
            filter = filter.Where(content => content.Name != null && content.Name.Contains(query));
        }

        filter = ScopeToStartNodes(filter);

        var items = contentService
            .GetPagedOfType(contentType.Id, page, pageSize, out var total, filter)
            .Select(content => new SampleContentItem(
                content.Key,
                content.Name ?? "(unnamed)",
                alias,
                content.Published,
                content.UpdateDate))
            .ToList();

        return Ok(new SampleContentResponse(total, items));
    }

    /// <summary>
    /// Narrows a content query to the subtrees the signed-in user is allowed to see.
    /// <para>
    /// This list names real nodes, and it used to name every node of a document type whatever the
    /// caller's start nodes were. The condition goes into the query rather than filtering the page
    /// afterwards, so the reported total stays true - a count that did not match the rows would be
    /// its own kind of wrong.
    /// </para>
    /// <para>
    /// A start node covers itself and everything under it, which is "id = n OR path starts with
    /// the node's path + a comma". The comma matters: without it <c>-1,1050</c> would also match
    /// <c>-1,10501</c>.
    /// </para>
    /// </summary>
    private IQuery<IContent> ScopeToStartNodes(IQuery<IContent> filter)
    {
        var user = backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser;
        if (user is null) return filter;

        var startNodeIds = user.CalculateContentStartNodeIds(entityService, appCaches);

        // Null means no start nodes are configured, and the root means the whole tree; either way
        // there is nothing to narrow.
        if (startNodeIds is null || startNodeIds.Length == 0) return filter;
        if (startNodeIds.Contains(Constants.System.Root)) return filter;

        var conditions = new List<Expression<Func<IContent, bool>>>();

        foreach (var startNodeId in startNodeIds)
        {
            var path = entityService.Get(startNodeId, UmbracoObjectTypes.Document)?.Path;
            if (string.IsNullOrEmpty(path)) continue;

            var id = startNodeId;
            var prefix = path + ",";

            conditions.Add(content => content.Id == id);
            conditions.Add(content => content.Path.SqlStartsWith(prefix, TextColumnType.NVarchar));
        }

        // Start nodes that resolve to nothing leave no condition to apply, and "no condition"
        // must not mean "everything": a user whose start nodes have all been deleted can see
        // nothing, which is what an impossible condition gives.
        return conditions.Count == 0
            ? filter.Where(content => content.Id == Constants.System.Root)
            : filter.WhereAny(conditions);
    }

    private static string GroupName(IContentType contentType, IPropertyType property)
        => contentType.CompositionPropertyGroups
               .FirstOrDefault(group => group.PropertyTypes?.Any(p => p.Alias == property.Alias) == true)
               ?.Name
           ?? "Other";

    /// <summary>
    /// Buckets an editor alias into the handful of kinds the palette cares about. The chip's
    /// colour, its icon and - most importantly - which layer type dragging it creates all come
    /// from this, so an unrecognised editor falls back to text rather than to nothing.
    /// </summary>
    private static string Classify(string editorAlias) => editorAlias switch
    {
        "Umbraco.MediaPicker3" or "Umbraco.ImageCropper" or "Umbraco.UploadField" => "media",
        "Umbraco.RichText" or "Umbraco.TinyMCE" or "Umbraco.MarkdownEditor" => "richtext",
        "Umbraco.DateTime" => "date",
        "Umbraco.MultiNodeTreePicker" or "Umbraco.ContentPicker" => "content",
        "Umbraco.Tags" or "Umbraco.CheckBoxList" or "Umbraco.DropDown.Flexible" => "list",
        "Umbraco.TextBox" or "Umbraco.TextArea" or "Umbraco.Label" => "text",
        "Umbraco.TrueFalse" => "boolean",
        "Umbraco.Integer" or "Umbraco.Decimal" => "number",
        _ => "other"
    };
}
