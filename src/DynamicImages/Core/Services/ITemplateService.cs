using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public enum SaveOutcome
{
    Saved,

    /// <summary>The template did not validate. <see cref="SaveResult.Validation"/> says why.</summary>
    Invalid,

    /// <summary>Someone else saved the template since it was loaded.</summary>
    Conflict,

    NotFound,

    /// <summary>Another template already uses the alias.</summary>
    AliasInUse
}

public sealed record SaveResult(SaveOutcome Outcome, Template? Template, ValidationResult Validation)
{
    public static SaveResult Saved(Template template, ValidationResult validation) => new(SaveOutcome.Saved, template, validation);

    public static SaveResult Failed(SaveOutcome outcome, ValidationResult? validation = null)
        => new(outcome, null, validation ?? ValidationResult.Ok);
}

/// <summary>
/// The write path for templates: validate, persist, then tell every server to drop its cache.
/// Everything that changes a template goes through here rather than the repository.
/// </summary>
public interface ITemplateService
{
    IReadOnlyList<Template> GetAll();

    Template? Get(Guid key);

    Template? GetByAlias(string alias);

    Task<SaveResult> CreateAsync(Template template, Guid? userKey, CancellationToken cancellationToken = default);

    Task<SaveResult> UpdateAsync(Template template, DateTime? expectedUpdatedUtc, Guid? userKey, CancellationToken cancellationToken = default);

    bool Delete(Guid key);

    /// <summary>
    /// Puts a template in a folder, or at the root when <paramref name="targetKey"/> is null. The
    /// only way a template's folder changes: an ordinary update keeps the stored one.
    /// </summary>
    Task<TreeOperationOutcome> MoveAsync(Guid key, Guid? targetKey, CancellationToken cancellationToken = default);

    /// <summary>Copies a template under a new key, alias and name.</summary>
    Task<SaveResult> DuplicateAsync(Guid key, Guid? userKey, CancellationToken cancellationToken = default);

    /// <summary>An alias derived from a name that no existing template is using.</summary>
    string SuggestAlias(string name, Guid? exceptKey = null);
}
