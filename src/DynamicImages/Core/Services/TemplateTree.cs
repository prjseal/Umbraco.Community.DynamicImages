using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

/// <summary>One row of the Templates tree: a folder or a template.</summary>
public sealed record TemplateTreeNode(
    Guid Key,
    string Name,
    bool IsFolder,
    Guid? ParentKey,
    bool HasChildren,
    bool IsEnabled);

/// <summary>
/// The Templates tree, worked out in memory from every folder and every template. The placing,
/// ordering and cycle rules are <see cref="FolderTree{TFolder,TLeaf}"/>'s, shared with the Fonts
/// tree; this only adds what a template row shows.
/// </summary>
public sealed class TemplateTree
{
    private readonly FolderTree<TemplateFolder, Template> _tree;

    public TemplateTree(IEnumerable<TemplateFolder> folders, IEnumerable<Template> templates)
        => _tree = new FolderTree<TemplateFolder, Template>(folders, templates);

    public bool FolderExists(Guid key) => _tree.FolderExists(key);

    /// <inheritdoc cref="FolderTree{TFolder,TLeaf}.ChildrenOf"/>
    public IReadOnlyList<TemplateTreeNode> ChildrenOf(Guid? parentKey, bool foldersOnly = false)
        => _tree.ChildrenOf(parentKey, foldersOnly).Select(Map).ToList();

    public bool HasChildren(Guid folderKey) => _tree.HasChildren(folderKey);

    /// <summary>A folder or template by key, or null.</summary>
    public TemplateTreeNode? Find(Guid key) => _tree.Find(key) is { } node ? Map(node) : null;

    /// <inheritdoc cref="FolderTree{TFolder,TLeaf}.AncestorsOf"/>
    public IReadOnlyList<TemplateTreeNode> AncestorsOf(Guid key) => _tree.AncestorsOf(key).Select(Map).ToList();

    /// <summary>How deep an item sits: 0 directly under the root.</summary>
    public int DepthOf(Guid key) => _tree.DepthOf(key);

    /// <inheritdoc cref="FolderTree{TFolder,TLeaf}.WouldCreateCycle"/>
    public bool WouldCreateCycle(Guid folderKey, Guid? targetKey) => _tree.WouldCreateCycle(folderKey, targetKey);

    /// <summary>True when nothing - no folder and no template - sits directly in the folder.</summary>
    public bool IsEmpty(Guid folderKey) => _tree.IsEmpty(folderKey);

    /// <inheritdoc cref="FolderTree{TFolder,TLeaf}.NextSortOrder"/>
    public int NextSortOrder(Guid? parentKey) => _tree.NextSortOrder(parentKey);

    /// <inheritdoc cref="FolderTree{TFolder,TLeaf}.ApplySort"/>
    public IReadOnlyList<SortOrderChange> ApplySort(Guid? parentKey, IEnumerable<(Guid Key, int SortOrder)> sorting)
        => _tree.ApplySort(parentKey, sorting);

    private static TemplateTreeNode Map(FolderTreeNode<TemplateFolder, Template> node)
        => new(node.Key, node.Name, node.IsFolder, node.ParentKey, node.HasChildren, node.Leaf?.IsEnabled ?? true);
}
