using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public enum RegenerationOutcome
{
    Generated,

    /// <summary>
    /// The image was written and saved to the draft, but the node was not published - either it
    /// had edits the editor had not published yet, or they may update it but not publish it.
    /// The front end keeps the old image until someone publishes the page.
    /// </summary>
    GeneratedDraft,

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
    /// <para>
    /// <paramref name="force"/> overrides the template's "only when empty" trigger, which is what
    /// the editor's explicit "Regenerate" action means.
    /// </para>
    /// <para>
    /// <paramref name="userId"/> is who the save or publish is attributed to in the audit trail.
    /// Null falls back to Umbraco's super user, which is right for a background caller and wrong
    /// for an editor's own action - callers acting for a person pass their id.
    /// </para>
    /// <para>
    /// <paramref name="allowPublish"/> is whether this caller may publish the node. False means
    /// the image is saved to the draft and the outcome is
    /// <see cref="RegenerationOutcome.GeneratedDraft"/>. A node with unpublished edits is never
    /// published here whatever this says: publishing it would push out changes the editor had not
    /// chosen to release.
    /// </para>
    /// </summary>
    Task<RegenerationResult> RegenerateDocumentAsync(
        Guid contentKey,
        Template? template = null,
        bool force = true,
        int? userId = null,
        bool allowPublish = true,
        CancellationToken cancellationToken = default);

    /// <summary>Every document a template applies to, for the usage view and bulk regeneration.</summary>
    IReadOnlyList<Guid> FindDocuments(Template template);
}
