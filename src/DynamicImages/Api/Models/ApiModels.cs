using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Api.Models;

// ---------------------------------------------------------------- templates

/// <summary>A template as the menu and the overview list show it, without its layer document.</summary>
public sealed record TemplateSummary(
    Guid Key,
    string Alias,
    string Name,
    bool IsEnabled,
    IReadOnlyList<string> DocTypeAliases,
    string TargetPropertyAlias,
    int LayerCount,
    int CanvasWidth,
    int CanvasHeight,
    DateTime UpdatedUtc);

public sealed record TemplateListResponse(int Total, IReadOnlyList<TemplateSummary> Items);

/// <summary>A save's outcome, so the designer can show validation warnings on a successful save too.</summary>
public sealed record TemplateSaveResponse(Template Template, IReadOnlyList<ValidationIssue> Warnings);

public sealed record TemplateImportRequest(string Json, string Mode = "create");

// ---------------------------------------------------------------- fonts

public sealed record FontResponse(
    Guid Key,
    string FamilyName,
    string SourceKind,
    Guid? MediaKey,
    string? Path,
    string? Provider,
    string? SourceUrl,
    string? ProviderFamily,
    int Weight,
    bool IsItalic,
    IReadOnlyList<FontStyleDefinition> Styles,
    string? ContentHash,
    int UsedByTemplateCount)
{
    public static FontResponse From(FontDefinition font, int usedBy) => new(
        font.Key,
        font.FamilyName,
        font.SourceKind switch
        {
            ImageSourceKind.Path => "path",
            ImageSourceKind.Url => "url",
            _ => "media"
        },
        font.MediaKey,
        font.Path,
        font.Provider,
        font.SourceUrl,
        font.ProviderFamily,
        font.Weight,
        font.IsItalic,
        font.Styles,
        font.ContentHash,
        usedBy);
}

public sealed record RegisterFontPathRequest(string Path);

/// <summary>
/// <c>Provider</c> is google, bunny or direct. Google and Bunny take <c>Family</c>, <c>Weights</c>
/// and <c>IncludeItalic</c>; direct takes <c>Url</c>.
/// </summary>
public sealed record RegisterWebFontRequest(
    string Provider,
    string? Family,
    List<int>? Weights,
    bool IncludeItalic,
    string? Url);

/// <summary>The rows created, and one message per variant that was not.</summary>
public sealed record RegisterWebFontResponse(IReadOnlyList<FontResponse> Fonts, IReadOnlyList<string> Errors);

/// <summary>
/// Weight and IsItalic are here because a detected weight is a guess - the file's own names are
/// the only source, and a family that puts its weight nowhere a name can carry it is not
/// recoverable automatically. An editor has to be able to overrule it. Null leaves the stored
/// value alone.
/// </summary>
public sealed record UpdateFontRequest(
    string FamilyName,
    List<FontStyleDefinition> Styles,
    int? Weight = null,
    bool? IsItalic = null);

// ---------------------------------------------------------------- document types

/// <summary>
/// A property as the designer's palette shows it. <see cref="Classification"/> is what decides
/// which layer type a dragged chip creates.
/// </summary>
public sealed record DocumentTypePropertyResponse(
    string Alias,
    string Name,
    string Group,
    string EditorAlias,
    string Classification,
    bool IsSystem);

public sealed record DocumentTypeResponse(Guid Key, string Alias, string Name, string Icon);

/// <summary>
/// What a content-reference property points at: the document types it can hold, and the union of
/// their properties, for the designer's second dropdown.
/// <para>
/// <see cref="Inference"/> says how the target types were arrived at - <c>"filter"</c> from the
/// picker's own configuration, <c>"sampled"</c> from what existing content actually picks,
/// <c>"all"</c> when neither could narrow it, and <c>"none"</c> when the property is not a content
/// reference at all. The designer can then tell "the picker says so" from a best-effort guess.
/// </para>
/// </summary>
public sealed record LinkedPropertiesResponse(
    string PropertyAlias,
    string Inference,
    IReadOnlyList<DocumentTypeResponse> TargetDocTypes,
    IReadOnlyList<DocumentTypePropertyResponse> Properties);

public sealed record SampleContentItem(Guid Key, string Name, string DocTypeAlias, bool IsPublished, DateTime UpdateDate);

public sealed record SampleContentResponse(long Total, IReadOnlyList<SampleContentItem> Items);

// ---------------------------------------------------------------- preview

public sealed record PreviewRequest
{
    /// <summary>The candidate template - not necessarily the saved one, which is the point.</summary>
    public Template Template { get; init; } = new();

    /// <summary>The node to resolve values from. Omitted or unknown means sample data.</summary>
    public Guid? ContentKey { get; init; }

    public string? Culture { get; init; }

    /// <summary>Render against built-in sample values instead of real content.</summary>
    public bool UseSampleData { get; init; }

    /// <summary>
    /// 0-1. The designer's debounce loop asks for a half-size render; the full size is a click
    /// away. Null follows the configured default.
    /// </summary>
    public double? Scale { get; init; }
}

/// <summary>
/// The unrotated box a layer occupied, plus - when it is rotated - the degrees and the pivot it
/// turned about, so the designer can lay its overlay over exactly where the server drew.
/// </summary>
public sealed record LayerBoundsResponse(
    Guid Key,
    float X,
    float Y,
    float Width,
    float Height,
    int Lines,
    bool Truncated,
    string? ResolvedText,
    float Rotation,
    float PivotX,
    float PivotY);

/// <summary>
/// A layer that produced nothing, and why. A layer that draws nothing is simply absent from
/// <see cref="LayoutResponse.Layers"/>, which is precisely the case where an editor most needs
/// telling - the image is missing something and the resolved-values panel was silent about it.
/// </summary>
public sealed record LayerSkipResponse(Guid Key, string Reason);

public sealed record LayoutResponse(
    int CanvasWidth,
    int CanvasHeight,
    IReadOnlyList<LayerBoundsResponse> Layers,
    IReadOnlyList<ValidationIssue> Issues,
    IReadOnlyList<LayerSkipResponse> Skipped);

public sealed record ImageInfoResponse(int Width, int Height, string? Url);

// ---------------------------------------------------------------- regeneration

public sealed record RegenerateDocumentResponse(string Outcome, Guid? MediaKey, string? PropertyValue, string? Message);

public sealed record BulkRegenerateRequest(bool OnlyMissing = false);

public sealed record JobResponse(
    Guid Id,
    Guid TemplateKey,
    string TemplateName,
    string Status,
    int Total,
    int Processed,
    int Generated,
    int Skipped,
    IReadOnlyList<string> Failures,
    DateTime StartedUtc,
    DateTime? FinishedUtc)
{
    public static JobResponse From(RegenerationJob job) => new(
        job.Id,
        job.TemplateKey,
        job.TemplateName,
        job.Status.ToString().ToLowerInvariant(),
        job.Total,
        job.Processed,
        job.Generated,
        job.Skipped,
        job.Failures,
        job.StartedUtc,
        job.FinishedUtc);
}

// ---------------------------------------------------------------- usage / sync

public sealed record UsageItem(Guid Key, string Name, bool HasImage, bool IsPublished);

/// <summary>
/// <paramref name="Total"/> is every document the template covers.
/// <paramref name="WithImageOnPage"/> counts only the rows in <paramref name="Items"/>: counting
/// the rest would mean loading the rest, which is what this endpoint stopped doing.
/// </summary>
public sealed record UsageResponse(long Total, int WithImageOnPage, IReadOnlyList<UsageItem> Items);

public sealed record SyncStatusResponse(string Mode, string Folder, int FileCount, DateTime? LastWriteUtc);

public sealed record SyncRunResponse(int Written, int Imported, IReadOnlyList<string> Messages);
