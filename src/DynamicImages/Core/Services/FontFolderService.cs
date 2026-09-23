using Umbraco.Cms.Core.Events;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Notifications;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Core.Services;

/// <summary>Mirrors <see cref="TemplateFolderService"/>, over the Fonts tree.</summary>
public sealed class FontFolderService(
    IFontFolderRepository repository,
    IFontFamilyRepository familyRepository,
    IFontRepository fontRepository,
    IEventAggregator eventAggregator) : IFontFolderService
{
    private const int MaxNameLength = 255;

    public IReadOnlyList<FontFolder> GetAll() => repository.GetAll();

    public FontFolder? Get(Guid key) => repository.Get(key);

    public FontTree GetTree() => new(repository.GetAll(), familyRepository.GetAll(), fontRepository.GetAll());

    public FontFolderResult Create(string name, Guid? parentKey, Guid? key = null)
    {
        var trimmed = name?.Trim() ?? string.Empty;
        if (trimmed.Length == 0 || trimmed.Length > MaxNameLength) return new FontFolderResult(TreeOperationOutcome.InvalidName);

        if (parentKey is { } parent && repository.Get(parent) is null)
            return new FontFolderResult(TreeOperationOutcome.TargetNotFound);

        var folder = repository.Insert(new FontFolder
        {
            Key = key is { } k && k != Guid.Empty ? k : Guid.NewGuid(),
            Name = trimmed,
            ParentKey = parentKey,
            SortOrder = GetTree().NextSortOrder(parentKey)
        });

        Saved(folder);
        return new FontFolderResult(TreeOperationOutcome.Success, folder);
    }

    public FontFolderResult Rename(Guid key, string name)
    {
        var trimmed = name?.Trim() ?? string.Empty;
        if (trimmed.Length == 0 || trimmed.Length > MaxNameLength) return new FontFolderResult(TreeOperationOutcome.InvalidName);

        var folder = repository.Get(key);
        if (folder is null) return new FontFolderResult(TreeOperationOutcome.NotFound);

        folder.Name = trimmed;
        var saved = repository.Update(folder);
        if (saved is null) return new FontFolderResult(TreeOperationOutcome.NotFound);

        Saved(saved);
        return new FontFolderResult(TreeOperationOutcome.Success, saved);
    }

    public FontFolderResult Move(Guid key, Guid? targetKey)
    {
        var tree = GetTree();
        var folder = repository.Get(key);
        if (folder is null) return new FontFolderResult(TreeOperationOutcome.NotFound);

        var outcome = CheckMove(tree, key, targetKey);
        if (outcome != TreeOperationOutcome.Success) return new FontFolderResult(outcome);

        folder.ParentKey = targetKey;
        folder.SortOrder = tree.NextSortOrder(targetKey);
        var saved = repository.Update(folder);
        if (saved is null) return new FontFolderResult(TreeOperationOutcome.NotFound);

        Saved(saved);
        return new FontFolderResult(TreeOperationOutcome.Success, saved);
    }

    /// <summary>An existing target, and no cycle.</summary>
    internal static TreeOperationOutcome CheckMove(FontTree tree, Guid folderKey, Guid? targetKey)
    {
        if (targetKey is { } target && !tree.FolderExists(target)) return TreeOperationOutcome.TargetNotFound;
        if (tree.WouldCreateCycle(folderKey, targetKey)) return TreeOperationOutcome.WouldCreateCycle;

        return TreeOperationOutcome.Success;
    }

    public FontFolderResult Delete(Guid key)
    {
        var folder = repository.Get(key);
        if (folder is null) return new FontFolderResult(TreeOperationOutcome.NotFound);

        if (!GetTree().IsEmpty(key)) return new FontFolderResult(TreeOperationOutcome.NotEmpty, folder);

        if (!repository.Delete(key)) return new FontFolderResult(TreeOperationOutcome.NotFound);

        eventAggregator.Publish(new DynamicImagesFontFolderDeletedNotification(folder, new EventMessages()));
        return new FontFolderResult(TreeOperationOutcome.Success, folder);
    }

    public FontFolder Upsert(FontFolder folder)
    {
        if (CheckMove(GetTree(), folder.Key, folder.ParentKey) != TreeOperationOutcome.Success) folder.ParentKey = null;

        var saved = repository.Get(folder.Key) is null ? repository.Insert(folder) : repository.Update(folder) ?? folder;

        Saved(saved);
        return saved;
    }

    private void Saved(FontFolder folder)
        => eventAggregator.Publish(new DynamicImagesFontFolderSavedNotification(folder, new EventMessages()));
}
