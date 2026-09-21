using System.Text.RegularExpressions;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Events;
using Umbraco.Community.DynamicImages.Core.Cache;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Notifications;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed partial class TemplateService(
    ITemplateRepository repository,
    ITemplateValidator validator,
    ITemplateCache cache,
    DistributedCache distributedCache,
    IEventAggregator eventAggregator) : ITemplateService
{
    public IReadOnlyList<Template> GetAll() => cache.GetAll();

    public Template? Get(Guid key) => repository.Get(key);

    public Template? GetByAlias(string alias) => repository.GetByAlias(alias);

    public async Task<SaveResult> CreateAsync(Template template, Guid? userKey, CancellationToken cancellationToken = default)
    {
        if (template.Key == Guid.Empty) template.Key = Guid.NewGuid();
        if (string.IsNullOrWhiteSpace(template.Alias)) template.Alias = SuggestAlias(template.Name);

        var validation = await validator.ValidateAsync(template, cancellationToken);
        if (!validation.IsValid) return SaveResult.Failed(SaveOutcome.Invalid, validation);

        if (repository.AliasExists(template.Alias)) return SaveResult.Failed(SaveOutcome.AliasInUse, validation);

        var saved = repository.Insert(template, userKey);
        Notify(saved.Key);
        await eventAggregator.PublishAsync(
            new DynamicImagesTemplateSavedNotification(saved, new EventMessages()), cancellationToken);

        return SaveResult.Saved(saved, validation);
    }

    public async Task<SaveResult> UpdateAsync(Template template, DateTime? expectedUpdatedUtc, Guid? userKey, CancellationToken cancellationToken = default)
    {
        var existing = repository.Get(template.Key);
        if (existing is null) return SaveResult.Failed(SaveOutcome.NotFound);

        var validation = await validator.ValidateAsync(template, cancellationToken);
        if (!validation.IsValid) return SaveResult.Failed(SaveOutcome.Invalid, validation);

        if (repository.AliasExists(template.Alias, exceptKey: template.Key))
            return SaveResult.Failed(SaveOutcome.AliasInUse, validation);

        var saved = repository.Update(template, expectedUpdatedUtc, userKey);
        if (saved is null) return SaveResult.Failed(SaveOutcome.Conflict, validation);

        Notify(saved.Key);
        await eventAggregator.PublishAsync(
            new DynamicImagesTemplateSavedNotification(saved, new EventMessages()), cancellationToken);

        return SaveResult.Saved(saved, validation);
    }

    public bool Delete(Guid key)
    {
        // Read before deleting, so the notification can carry the row that went.
        var existing = repository.Get(key);

        var deleted = repository.Delete(key);
        if (!deleted) return false;

        Notify(key);
        if (existing is not null)
        {
            eventAggregator.Publish(new DynamicImagesTemplateDeletedNotification(existing, new EventMessages()));
        }

        return true;
    }

    public async Task<SaveResult> DuplicateAsync(Guid key, Guid? userKey, CancellationToken cancellationToken = default)
    {
        var source = repository.Get(key);
        if (source is null) return SaveResult.Failed(SaveOutcome.NotFound);

        source.Key = Guid.NewGuid();
        source.Name = $"{source.Name} (copy)";
        source.Alias = SuggestAlias(source.Name);

        // New keys for the layers too, so undo history and selection in the designer cannot
        // confuse the copy with the original.
        foreach (var layer in source.Layers) layer.Key = Guid.NewGuid();

        return await CreateAsync(source, userKey, cancellationToken);
    }

    public string SuggestAlias(string name, Guid? exceptKey = null)
    {
        var candidate = ToCamelCase(name);
        if (string.IsNullOrWhiteSpace(candidate)) candidate = "template";

        if (!repository.AliasExists(candidate, exceptKey)) return candidate;

        for (var suffix = 2; suffix < 1000; suffix++)
        {
            var numbered = $"{candidate}{suffix}";
            if (!repository.AliasExists(numbered, exceptKey)) return numbered;
        }

        return $"{candidate}{Guid.NewGuid():N}"[..40];
    }

    /// <summary>
    /// Drops the local cache immediately and asks every other server to do the same. Umbraco
    /// delivers this through umbracoCacheInstruction, which is what already fans out across
    /// load-balanced Cloud instances.
    /// </summary>
    private void Notify(Guid key)
    {
        cache.Clear();
        distributedCache.RefreshByPayload(
            DynamicImagesCacheRefresher.UniqueId,
            [new DynamicImagesCacheRefresherPayload { Kind = DynamicImagesChangeKind.Template, Key = key }]);
    }

    private static string ToCamelCase(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return string.Empty;

        var words = NonAlphanumericPattern().Split(value).Where(w => w.Length > 0).ToArray();
        if (words.Length == 0) return string.Empty;

        var first = char.ToLowerInvariant(words[0][0]) + words[0][1..].ToLowerInvariant();
        var rest = words.Skip(1).Select(w => char.ToUpperInvariant(w[0]) + w[1..].ToLowerInvariant());

        var alias = string.Concat([first, .. rest]);

        // The alias must start with a letter, so a name beginning with a digit gets a prefix.
        return char.IsLetter(alias[0]) ? alias : $"t{alias}";
    }

    [GeneratedRegex("[^a-zA-Z0-9]+")]
    private static partial Regex NonAlphanumericPattern();
}
