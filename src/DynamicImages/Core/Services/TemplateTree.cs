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
/// The Templates tree, worked out in memory from every folder and every template.
/// <para>
/// Both lists are small - a site has tens of templates, not thousands - and templates already
/// come from the in-memory cache, so a query per level would cost more than it saves. Keeping
/// this pure is also what lets the cycle guard and the ordering be tested without a database.
/// </para>
/// </summary>
public sealed class TemplateTree
{
    private readonly IReadOnlyList<TemplateFolder> _folders;
    private readonly IReadOnlyList<Template> _templates;
    private readonly Dictionary<Guid, TemplateFolder> _folderByKey;

    public TemplateTree(IEnumerable<TemplateFolder> folders, IEnumerable<Template> templates)
    {
        _folders = folders.ToList();
        _templates = templates.ToList();
        _folderByKey = _folders.GroupBy(f => f.Key).ToDictionary(g => g.Key, g => g.First());
    }

    public bool FolderExists(Guid key) => _folderByKey.ContainsKey(key);

    /// <summary>
    /// The direct children of a folder, or of the root when <paramref name="parentKey"/> is null:
    /// folders first, then templates, each by name - the order Settings → Document Types uses.
    /// A parent that points at a folder which no longer exists is treated as the root, so nothing
    /// can become unreachable.
    /// </summary>
    /// <param name="parentKey">The folder, or null for the root.</param>
    /// <param name="foldersOnly">
    /// Only folders, and <c>HasChildren</c> counting only folders - what the move picker asks for,
    /// since a template is never a move target.
    /// </param>
    public IReadOnlyList<TemplateTreeNode> ChildrenOf(Guid? parentKey, bool foldersOnly = false)
    {
        var folders = _folders
            .Where(f => EffectiveParent(f.ParentKey) == parentKey)
            .OrderBy(f => f.Name, StringComparer.OrdinalIgnoreCase)
            .Select(f => new TemplateTreeNode(
                f.Key, f.Name, true, EffectiveParent(f.ParentKey),
                foldersOnly ? _folders.Any(c => c.ParentKey == f.Key) : HasChildren(f.Key), true));

        if (foldersOnly) return folders.ToList();

        var templates = _templates
            .Where(t => EffectiveParent(t.ParentKey) == parentKey)
            .OrderBy(t => t.Name, StringComparer.OrdinalIgnoreCase)
            .Select(t => new TemplateTreeNode(t.Key, t.Name, false, EffectiveParent(t.ParentKey), false, t.IsEnabled));

        return [.. folders, .. templates];
    }

    public bool HasChildren(Guid folderKey)
        => _folders.Any(f => f.ParentKey == folderKey) || _templates.Any(t => t.ParentKey == folderKey);

    /// <summary>A folder or template by key, or null.</summary>
    public TemplateTreeNode? Find(Guid key)
    {
        if (_folderByKey.TryGetValue(key, out var folder))
            return new TemplateTreeNode(folder.Key, folder.Name, true, EffectiveParent(folder.ParentKey), HasChildren(folder.Key), true);

        var template = _templates.FirstOrDefault(t => t.Key == key);
        return template is null
            ? null
            : new TemplateTreeNode(template.Key, template.Name, false, EffectiveParent(template.ParentKey), false, template.IsEnabled);
    }

    /// <summary>
    /// The path from the top of the tree down to <paramref name="key"/>, the item itself last - the
    /// shape the backoffice's tree ancestors endpoints return. Empty when the key is unknown.
    /// </summary>
    public IReadOnlyList<TemplateTreeNode> AncestorsOf(Guid key)
    {
        var self = Find(key);
        if (self is null) return [];

        var path = new List<TemplateTreeNode> { self };
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

    /// <summary>True when nothing - no folder and no template - sits directly in the folder.</summary>
    public bool IsEmpty(Guid folderKey) => !HasChildren(folderKey);

    private Guid? EffectiveParent(Guid? parentKey)
        => parentKey is { } key && _folderByKey.ContainsKey(key) ? key : null;
}
