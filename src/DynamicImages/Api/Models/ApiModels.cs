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

public sealed record ImportReportResponse(
    IReadOnlyList<string> Created,
    IReadOnlyList<string> Skipped,
    IReadOnlyList<string> Warnings);

// ---------------------------------------------------------------- fonts

public sealed record FontResponse(
    Guid Key,
    string FamilyName,
    string SourceKind,
    Guid? MediaKey,
    string? Path,
    int Weight,
    bool IsItalic,
    IReadOnlyList<FontStyleDefinition> Styles,
    string? ContentHash,
    int UsedByTemplateCount)
{
    public static FontResponse From(FontDefinition font, int usedBy) => new(
        font.Key,
        font.FamilyName,
        font.SourceKind == ImageSourceKind.Path ? "path" : "media",
        font.MediaKey,
        font.Path,
        font.Weight,
        font.IsItalic,
        font.Styles,
        font.ContentHash,
        usedBy);
}

public sealed record RegisterFontPathRequest(string Path);

public sealed record UpdateFontRequest(string FamilyName, List<FontStyleDefinition> Styles);

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

public sealed record LayerBoundsResponse(
    Guid Key,
    float X,
    float Y,
    float Width,
    float Height,
    int Lines,
    bool Truncated,
    string? ResolvedText);

public sealed record LayoutResponse(
    int CanvasWidth,
    int CanvasHeight,
    IReadOnlyList<LayerBoundsResponse> Layers,
    IReadOnlyList<ValidationIssue> Issues);

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
        job.Failures.ToList(),
        job.StartedUtc,
        job.FinishedUtc);
}

// ---------------------------------------------------------------- usage / sync

public sealed record UsageItem(Guid Key, string Name, bool HasImage, bool IsPublished);

public sealed record UsageResponse(int Total, int WithImage, IReadOnlyList<UsageItem> Items);

public sealed record SyncStatusResponse(string Mode, string Folder, int FileCount, DateTime? LastWriteUtc);

public sealed record SyncRunResponse(int Written, int Imported, IReadOnlyList<string> Messages);
