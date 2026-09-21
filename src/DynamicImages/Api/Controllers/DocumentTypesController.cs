using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Persistence.Querying;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Api.Models;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// Feeds the designer's property palette and sample-content picker. Read-only views over
/// Umbraco's own services - nothing here is Dynamic Images state.
/// </summary>
public class DocumentTypesController(
    IContentTypeService contentTypeService,
    IDataTypeService dataTypeService,
    IContentService contentService,
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

        // One lookup for the whole document type rather than a blocking one per property: this
        // used to be a `.GetAwaiter().GetResult()` inside a Select, so a 40-property document
        // type was 40 sequential queries, each holding a thread-pool thread.
        var dataTypeKeys = contentType.CompositionPropertyTypes
            .Select(property => property.DataTypeKey)
            .Distinct()
            .ToArray();

        var editorAliases = (await dataTypeService.GetAllAsync(dataTypeKeys))
            .GroupBy(dataType => dataType.Key)
            .ToDictionary(group => group.Key, group => group.First().EditorAlias);

        var properties = contentType.CompositionPropertyTypes
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
            })
            .OrderBy(property => property.Group)
            .ThenBy(property => property.Name)
            .ToList();

        // The pseudo-properties the bindings understand. They are not on the document type, but
        // they are exactly what an editor reaches for first, so the palette offers them.
        properties.InsertRange(0,
        [
            new DocumentTypePropertyResponse("name", "Name", "Node", "Umbraco.TextBox", "text", IsSystem: true),
            new DocumentTypePropertyResponse("createDate", "Publish date", "Node", "Umbraco.DateTime", "date", IsSystem: true),
            new DocumentTypePropertyResponse("updateDate", "Last updated", "Node", "Umbraco.DateTime", "date", IsSystem: true),
            new DocumentTypePropertyResponse("readingTime", "Reading time", "Node", "Umbraco.TextBox", "readingTime", IsSystem: true)
        ]);

        return Ok(properties);
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
        var page = skip / pageSize;

        // An empty query matches everything; the overload's filter parameter is not nullable.
        var filter = scopeProvider.CreateQuery<IContent>();
        if (!string.IsNullOrWhiteSpace(query))
        {
            filter = filter.Where(content => content.Name != null && content.Name.Contains(query));
        }

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
