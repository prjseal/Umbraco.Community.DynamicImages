using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Persistence;

/// <summary>Row-level access to DynamicImages_Template. Serialisation lives here; validation does not.</summary>
public interface ITemplateRepository
{
    IReadOnlyList<Template> GetAll();

    Template? Get(Guid key);

    Template? GetByAlias(string alias);

    bool AliasExists(string alias, Guid? exceptKey = null);

    /// <summary>Inserts the template and returns it with its server-assigned timestamps.</summary>
    Template Insert(Template template, Guid? userKey);

    /// <summary>
    /// Updates the row only when its stored <c>updatedUtc</c> still matches
    /// <paramref name="expectedUpdatedUtc"/>. Returns null when it does not, which the API turns
    /// into a 412 rather than silently overwriting a concurrent edit.
    /// </summary>
    Template? Update(Template template, DateTime? expectedUpdatedUtc, Guid? userKey);

    /// <summary>
    /// Sets the template's folder (null for the root) and its place there, without touching
    /// anything else.
    /// </summary>
    bool Move(Guid key, Guid? parentKey, int sortOrder);

    /// <summary>Writes sort orders from the tree's Sort action, in one transaction.</summary>
    void SetSortOrders(IReadOnlyCollection<(Guid Key, int SortOrder)> sortOrders);

    /// <summary>
    /// Sets the enabled column and stamps <c>updatedUtc</c>, leaving everything else alone. The
    /// JSON copy of the flag catches up on the next save; the column overrules it on every read.
    /// </summary>
    bool SetEnabled(Guid key, bool isEnabled);

    bool Delete(Guid key);

    int Count();
}
