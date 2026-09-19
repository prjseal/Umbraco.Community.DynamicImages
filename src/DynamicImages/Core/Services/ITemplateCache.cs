using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

/// <summary>
/// The in-memory view of the template table that the publish pipeline reads. Built lazily and
/// dropped by the cache refresher, which Umbraco fans out to every server - that is what makes
/// a template edit take effect without a restart, on Cloud as well as locally.
/// </summary>
public interface ITemplateCache
{
    IReadOnlyList<Template> GetAll();

    /// <summary>Enabled templates that apply to a document type, in the order they were defined.</summary>
    IReadOnlyList<Template> GetForDocType(string docTypeAlias);

    Template? Get(Guid key);

    void Clear();
}
