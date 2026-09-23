namespace Umbraco.Community.DynamicImages.Core.Services;

/// <summary>What a tree needs to know about a folder or an item to place and order it.</summary>
public interface ITreeEntity
{
    Guid Key { get; }

    string Name { get; }

    /// <summary>The containing folder. Null is the tree's root.</summary>
    Guid? ParentKey { get; }

    int SortOrder { get; }
}

/// <summary>One row of a <see cref="FolderTree{TFolder,TLeaf}"/>: exactly one of the two is set.</summary>
public sealed record FolderTreeNode<TFolder, TLeaf>(Guid? ParentKey, bool HasChildren, TFolder? Folder, TLeaf? Leaf)
    where TFolder : class, ITreeEntity
    where TLeaf : class, ITreeEntity
{
    public bool IsFolder => Folder is not null;

    public ITreeEntity Entity => (ITreeEntity?)Folder ?? Leaf!;

    public Guid Key => Entity.Key;

    public string Name => Entity.Name;

    public int SortOrder => Entity.SortOrder;
}

/// <summary>A new sort order for one child of a parent, folder or leaf.</summary>
public sealed record SortOrderChange(Guid Key, bool IsFolder, int SortOrder);

/// <summary>
/// A tree of folders with leaves in them, worked out in memory: the shape the Templates tree and
/// the Fonts tree share.
/// <para>
/// Both lists are small - a site has tens of templates and fonts, not thousands - so a query per
/// level would cost more than it saves. Keeping this pure is also what lets the cycle guard and
/// the ordering be tested without a database.
/// </para>
/// </summary>
public sealed class FolderTree<TFolder, TLeaf>
    where TFolder : class, ITreeEntity
    where TLeaf : class, ITreeEntity
{
    private readonly IReadOnlyList<TFolder> _folders;
    private readonly IReadOnlyList<TLeaf> _leaves;
    private readonly Dictionary<Guid, TFolder> _folderByKey;
    private readonly Func<TLeaf, bool> _leafHasChildren;

    /// <param name="folders">Every folder.</param>
    /// <param name="leaves">Every item that sits in a folder.</param>
    /// <param name="leafHasChildren">
    /// Whether a leaf has children of its own, below this tree's level - a font family's variants.
    /// Leaves have none by default.
    /// </param>
    public FolderTree(IEnumerable<TFolder> folders, IEnumerable<TLeaf> leaves, Func<TLeaf, bool>? leafHasChildren = null)
    {
        _folders = folders.ToList();
        _leaves = leaves.ToList();
        _folderByKey = _folders.GroupBy(f => f.Key).ToDictionary(g => g.Key, g => g.First());
        _leafHasChildren = leafHasChildren ?? (_ => false);
    }

    public IReadOnlyList<TFolder> Folders => _folders;

    public IReadOnlyList<TLeaf> Leaves => _leaves;

    public bool FolderExists(Guid key) => _folderByKey.ContainsKey(key);

    /// <summary>
    /// The direct children of a folder, or of the root when <paramref name="parentKey"/> is null,
    /// by sort order; ties go folders first, then by name. Every row predating sorting has sort
    /// order 0, so until someone sorts a level it reads folders-first and alphabetical - the order
    /// Settings → Document Types uses. A parent that points at a folder which no longer exists is
    /// treated as the root, so nothing can become unreachable.
    /// </summary>
    /// <param name="parentKey">The folder, or null for the root.</param>
    /// <param name="foldersOnly">
    /// Only folders, and <c>HasChildren</c> counting only folders - what a move picker asks for,
    /// since a leaf is never a move target.
    /// </param>
    public IReadOnlyList<FolderTreeNode<TFolder, TLeaf>> ChildrenOf(Guid? parentKey, bool foldersOnly = false)
    {
        var folders = _folders
            .Where(f => EffectiveParent(f.ParentKey) == parentKey)
            .Select(f => new FolderTreeNode<TFolder, TLeaf>(
                EffectiveParent(f.ParentKey),
                foldersOnly ? _folders.Any(c => c.ParentKey == f.Key) : HasChildren(f.Key),
                f,
                null));

        var leaves = foldersOnly
            ? []
            : _leaves
                .Where(l => EffectiveParent(l.ParentKey) == parentKey)
                .Select(l => new FolderTreeNode<TFolder, TLeaf>(EffectiveParent(l.ParentKey), _leafHasChildren(l), null, l));

        return folders.Concat(leaves)
            .OrderBy(n => n.SortOrder)
            .ThenBy(n => n.IsFolder ? 0 : 1)
            .ThenBy(n => n.Name, StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    /// <summary>Whether anything - a folder or a leaf - sits directly in the folder.</summary>
    public bool HasChildren(Guid folderKey)
        => _folders.Any(f => f.ParentKey == folderKey) || _leaves.Any(l => l.ParentKey == folderKey);

    /// <summary>A folder or leaf by key, or null.</summary>
    public FolderTreeNode<TFolder, TLeaf>? Find(Guid key)
    {
        if (_folderByKey.TryGetValue(key, out var folder))
            return new FolderTreeNode<TFolder, TLeaf>(EffectiveParent(folder.ParentKey), HasChildren(folder.Key), folder, null);

        var leaf = _leaves.FirstOrDefault(l => l.Key == key);
        return leaf is null
            ? null
            : new FolderTreeNode<TFolder, TLeaf>(EffectiveParent(leaf.ParentKey), _leafHasChildren(leaf), null, leaf);
    }

    /// <summary>
    /// The path from the top of the tree down to <paramref name="key"/>, the item itself last - the
    /// shape the backoffice's tree ancestors endpoints return. Empty when the key is unknown.
    /// </summary>
    public IReadOnlyList<FolderTreeNode<TFolder, TLeaf>> AncestorsOf(Guid key)
    {
        var self = Find(key);
        if (self is null) return [];

        var path = new List<FolderTreeNode<TFolder, TLeaf>> { self };
        var seen = new HashSet<Guid> { key };
        var parent = self.ParentKey;

        // The seen set is a belt-and-braces stop: moves refuse cycles, but a hand-edited row
        // should give a short path rather than a hung request.
        while (parent is { } parentKey && seen.Add(parentKey) && Find(parentKey) is { } node)
        {
            path.Add(node);
            parent = node.ParentKey;
        }

        path.Reverse();
        return path;
    }

    /// <summary>How deep an item sits: 0 directly under the root.</summary>
    public int DepthOf(Guid key) => Math.Max(0, AncestorsOf(key).Count - 1);

    /// <summary>
    /// Whether moving <paramref name="folderKey"/> into <paramref name="targetKey"/> would make a
    /// folder its own ancestor: the target is the folder itself or anything below it.
    /// </summary>
    public bool WouldCreateCycle(Guid folderKey, Guid? targetKey)
    {
        if (targetKey is null) return false;
        if (targetKey == folderKey) return true;

        return AncestorsOf(targetKey.Value).Any(a => a.Key == folderKey);
    }

    /// <summary>True when nothing - no folder and no leaf - sits directly in the folder.</summary>
    public bool IsEmpty(Guid folderKey) => !HasChildren(folderKey);

    /// <summary>
    /// The sort order that puts a new child last under <paramref name="parentKey"/>: one past the
    /// highest there, or 0 for an empty level. Create, duplicate, import and move all append.
    /// </summary>
    public int NextSortOrder(Guid? parentKey)
    {
        var siblings = ChildrenOf(parentKey);
        return siblings.Count == 0 ? 0 : siblings.Max(s => s.SortOrder) + 1;
    }

    /// <summary>
    /// A new sort order for every child of <paramref name="parentKey"/>, from what the backoffice's
    /// sort modal sends.
    /// <para>
    /// The modal sends only the children that were dragged, each with its index in the final list.
    /// So the dragged ones go to those indexes, and everything else fills the remaining places in
    /// the order it already had - which reproduces the list the editor was looking at. Then every
    /// child is numbered 0..n-1, so the result does not depend on the zeros the rows started with.
    /// </para>
    /// Keys that are not children of the parent are ignored.
    /// </summary>
    public IReadOnlyList<SortOrderChange> ApplySort(Guid? parentKey, IEnumerable<(Guid Key, int SortOrder)> sorting)
    {
        var current = ChildrenOf(parentKey);
        var byKey = current.ToDictionary(n => n.Key);

        var placed = new FolderTreeNode<TFolder, TLeaf>?[current.Count];
        var moved = new HashSet<Guid>();

        foreach (var (key, sortOrder) in sorting.OrderBy(s => s.SortOrder))
        {
            if (!byKey.TryGetValue(key, out var node) || !moved.Add(key)) continue;

            // A clash or an index past the end - a stale modal - takes the next free place.
            var index = Math.Clamp(sortOrder, 0, placed.Length - 1);
            while (index < placed.Length && placed[index] is not null) index++;
            if (index == placed.Length) index = Array.FindIndex(placed, p => p is null);

            placed[index] = node;
        }

        using var rest = current.Where(n => !moved.Contains(n.Key)).GetEnumerator();
        for (var i = 0; i < placed.Length; i++)
        {
            if (placed[i] is not null) continue;

            rest.MoveNext();
            placed[i] = rest.Current;
        }

        return placed.Select((n, i) => new SortOrderChange(n!.Key, n.IsFolder, i)).ToList();
    }

    /// <summary>The parent as the tree places it: a missing folder is the root.</summary>
    public Guid? EffectiveParent(Guid? parentKey)
        => parentKey is { } key && _folderByKey.ContainsKey(key) ? key : null;
}
