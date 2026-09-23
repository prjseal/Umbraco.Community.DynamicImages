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
    ITemplateFolderRepository folderRepository,
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

        // A folder that is not there - deleted meanwhile, or never synced to this environment - puts
        // the template at the root rather than failing the create or orphaning it.
        if (template.ParentKey is { } parentKey && folderRepository.Get(parentKey) is null) template.ParentKey = null;

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

        // The folder only changes through MoveAsync. The designer sends back the parentKey it
        // loaded, so honouring it here would undo a move made in the tree while it was open.
        template.ParentKey = existing.ParentKey;

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

    public async Task<TreeOperationOutcome> MoveAsync(Guid key, Guid? targetKey, CancellationToken cancellationToken = default)
    {
        if (targetKey is { } target && folderRepository.Get(target) is null) return TreeOperationOutcome.TargetNotFound;
        if (!repository.Move(key, targetKey)) return TreeOperationOutcome.NotFound;

        Notify(key);

        // Published as a save, so uSync re-exports the file with its new parent.
        if (repository.Get(key) is { } moved)
        {
            await eventAggregator.PublishAsync(
                new DynamicImagesTemplateSavedNotification(moved, new EventMessages()), cancellationToken);
        }

        return TreeOperationOutcome.Success;
    }

    public async Task<SaveResult> DuplicateAsync(Guid key, Guid? targetKey, Guid? userKey, CancellationToken cancellationToken = default)
    {
        var source = repository.Get(key);
        if (source is null) return SaveResult.Failed(SaveOutcome.NotFound);

        // Checked here rather than left to CreateAsync, which roots a template whose folder is
        // missing: that is right for an import from another environment, but a duplicate asked
        // to go somewhere specific should say it could not rather than land somewhere else.
        if (targetKey is { } target && folderRepository.Get(target) is null) return SaveResult.Failed(SaveOutcome.TargetNotFound);

        source.ParentKey = targetKey;

        source.Key = Guid.NewGuid();
        source.Name = $"{source.Name} (copy)";
        source.Alias = SuggestAlias(source.Name);

        // New keys for the layers too, so undo history and selection in the designer cannot
        // confuse the copy with the original.
        foreach (var layer in source.Layers) layer.Key = Guid.NewGuid();

        return await CreateAsync(source, userKey, cancellationToken);
    }

    public async Task<EnableOutcome> SetEnabledAsync(Guid key, bool isEnabled, CancellationToken cancellationToken = default)
    {
        var existing = repository.Get(key);
        if (existing is null) return EnableOutcome.NotFound;
        if (existing.IsEnabled == isEnabled) return EnableOutcome.Unchanged;

        if (!repository.SetEnabled(key, isEnabled)) return EnableOutcome.NotFound;

        Notify(key);

        // Published as a save, so uSync and file sync re-export the template.
        if (repository.Get(key) is { } saved)
        {
            await eventAggregator.PublishAsync(
                new DynamicImagesTemplateSavedNotification(saved, new EventMessages()), cancellationToken);
        }

        return EnableOutcome.Changed;
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
