using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public enum RegenerationOutcome
{
    Generated,

    /// <summary>The node already had an image and the template only fills empty properties.</summary>
    SkippedExisting,

    /// <summary>No enabled template covers this node's document type.</summary>
    NoTemplate,

    NotFound,

    Failed
}

public sealed record RegenerationResult(
    RegenerationOutcome Outcome,
    Guid? MediaKey = null,
    string? PropertyValue = null,
    string? Message = null);

/// <summary>Regenerates images for content that already exists, outside the publish pipeline.</summary>
public interface IRegenerationService
{
    /// <summary>
    /// Regenerates one document's image and saves it onto the node.
    /// <paramref name="force"/> overrides the template's "only when empty" trigger, which is what
    /// the editor's explicit "Regenerate" action means.
    /// </summary>
    Task<RegenerationResult> RegenerateDocumentAsync(
        Guid contentKey, Template? template = null, bool force = true, CancellationToken cancellationToken = default);

    /// <summary>Every document a template applies to, for the usage view and bulk regeneration.</summary>
    IReadOnlyList<Guid> FindDocuments(Template template);
}
