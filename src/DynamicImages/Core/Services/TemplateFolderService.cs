using Umbraco.Cms.Core.Events;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Notifications;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class TemplateFolderService(
    ITemplateFolderRepository repository,
    ITemplateCache templateCache,
    IEventAggregator eventAggregator) : ITemplateFolderService
{
    private const int MaxNameLength = 255;

    public IReadOnlyList<TemplateFolder> GetAll() => repository.GetAll();

    public TemplateFolder? Get(Guid key) => repository.Get(key);

    public TemplateTree GetTree() => new(repository.GetAll(), templateCache.GetAll());

    public FolderResult Create(string name, Guid? parentKey, Guid? key = null)
    {
        var trimmed = name?.Trim() ?? string.Empty;
        if (trimmed.Length == 0 || trimmed.Length > MaxNameLength) return new FolderResult(TreeOperationOutcome.InvalidName);

        if (parentKey is { } parent && repository.Get(parent) is null)
            return new FolderResult(TreeOperationOutcome.TargetNotFound);

        var folder = repository.Insert(new TemplateFolder
        {
            Key = key is { } k && k != Guid.Empty ? k : Guid.NewGuid(),
            Name = trimmed,
            ParentKey = parentKey,
            SortOrder = GetTree().NextSortOrder(parentKey)
        });

        Saved(folder);
        return new FolderResult(TreeOperationOutcome.Success, folder);
    }

    public FolderResult Rename(Guid key, string name)
    {
        var trimmed = name?.Trim() ?? string.Empty;
        if (trimmed.Length == 0 || trimmed.Length > MaxNameLength) return new FolderResult(TreeOperationOutcome.InvalidName);

        var folder = repository.Get(key);
        if (folder is null) return new FolderResult(TreeOperationOutcome.NotFound);

        folder.Name = trimmed;
        var saved = repository.Update(folder);
        if (saved is null) return new FolderResult(TreeOperationOutcome.NotFound);

        Saved(saved);
        return new FolderResult(TreeOperationOutcome.Success, saved);
    }

    public FolderResult Move(Guid key, Guid? targetKey)
    {
        var tree = GetTree();
        var folder = repository.Get(key);
        if (folder is null) return new FolderResult(TreeOperationOutcome.NotFound);

        var outcome = CheckMove(tree, key, targetKey);
        if (outcome != TreeOperationOutcome.Success) return new FolderResult(outcome);

        folder.ParentKey = targetKey;
        folder.SortOrder = tree.NextSortOrder(targetKey);
        var saved = repository.Update(folder);
        if (saved is null) return new FolderResult(TreeOperationOutcome.NotFound);

        Saved(saved);
        return new FolderResult(TreeOperationOutcome.Success, saved);
    }

    /// <summary>The rule both the API and the tests go through: an existing target, and no cycle.</summary>
    internal static TreeOperationOutcome CheckMove(TemplateTree tree, Guid folderKey, Guid? targetKey)
    {
        if (targetKey is { } target && !tree.FolderExists(target)) return TreeOperationOutcome.TargetNotFound;
        if (tree.WouldCreateCycle(folderKey, targetKey)) return TreeOperationOutcome.WouldCreateCycle;

        return TreeOperationOutcome.Success;
    }

    public FolderResult Delete(Guid key)
    {
        var folder = repository.Get(key);
        if (folder is null) return new FolderResult(TreeOperationOutcome.NotFound);

        if (!GetTree().IsEmpty(key)) return new FolderResult(TreeOperationOutcome.NotEmpty, folder);

        if (!repository.Delete(key)) return new FolderResult(TreeOperationOutcome.NotFound);

        eventAggregator.Publish(new DynamicImagesTemplateFolderDeletedNotification(folder, new EventMessages()));
        return new FolderResult(TreeOperationOutcome.Success, folder);
    }

    public TemplateFolder Upsert(TemplateFolder folder)
    {
        var tree = GetTree();
        if (CheckMove(tree, folder.Key, folder.ParentKey) != TreeOperationOutcome.Success) folder.ParentKey = null;

        var saved = repository.Get(folder.Key) is null ? repository.Insert(folder) : repository.Update(folder) ?? folder;

        Saved(saved);
        return saved;
    }

    private void Saved(TemplateFolder folder)
        => eventAggregator.Publish(new DynamicImagesTemplateFolderSavedNotification(folder, new EventMessages()));
}
