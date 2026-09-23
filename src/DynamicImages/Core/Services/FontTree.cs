using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public enum FontTreeEntityType
{
    Folder,
    Family,

    /// <summary>One weight and slant of a family: a <see cref="FontDefinition"/> row.</summary>
    Font
}

/// <summary>
/// One row of the Fonts tree. <see cref="Font"/> is set on a variant; <see cref="VariantCount"/>
/// on a family.
/// </summary>
public sealed record FontTreeNode(
    Guid Key,
    string Name,
    FontTreeEntityType EntityType,
    Guid? ParentKey,
    bool HasChildren,
    int SortOrder,
    FontDefinition? Font = null,
    int VariantCount = 0);

/// <summary>
/// The Fonts tree: folders and families as a <see cref="FolderTree{TFolder,TLeaf}"/>, with each
/// family's variants as a level below it. Variants are ordered by sort order, then weight, then
/// upright before italic.
/// </summary>
public sealed class FontTree
{
    private static readonly (int Weight, string Name)[] WeightNames =
    [
        (100, "Thin"), (200, "ExtraLight"), (300, "Light"), (400, "Regular"), (500, "Medium"),
        (600, "SemiBold"), (700, "Bold"), (800, "ExtraBold"), (900, "Black")
    ];

    private readonly FolderTree<FontFolder, FontFamily> _tree;
    private readonly Dictionary<Guid, List<FontDefinition>> _variantsByFamily;
    private readonly Dictionary<Guid, FontDefinition> _fontByKey;

    public FontTree(IEnumerable<FontFolder> folders, IEnumerable<FontFamily> families, IEnumerable<FontDefinition> fonts)
    {
        var familyList = families.ToList();
        var familyKeys = familyList.Select(f => f.Key).ToHashSet();

        // A variant whose family is missing has nowhere to show; the service gives every row a
        // family, so this only drops a row mid-import.
        var fontList = fonts.Where(f => f.FamilyKey is { } key && familyKeys.Contains(key)).ToList();

        _fontByKey = fontList.GroupBy(f => f.Key).ToDictionary(g => g.Key, g => g.First());
        _variantsByFamily = fontList
            .GroupBy(f => f.FamilyKey!.Value)
            .ToDictionary(
                g => g.Key,
                g => g.OrderBy(f => f.SortOrder).ThenBy(f => f.Weight).ThenBy(f => f.IsItalic).ToList());

        _tree = new FolderTree<FontFolder, FontFamily>(folders, familyList, family => _variantsByFamily.ContainsKey(family.Key));
    }

    public IReadOnlyList<FontFolder> Folders => _tree.Folders;

    public IReadOnlyList<FontFamily> Families => _tree.Leaves;

    public bool FolderExists(Guid key) => _tree.FolderExists(key);

    public FontFamily? Family(Guid key) => _tree.Find(key)?.Leaf;

    /// <summary>A family's variants, in the tree's order. Empty for an unknown family.</summary>
    public IReadOnlyList<FontDefinition> VariantsOf(Guid familyKey)
        => _variantsByFamily.TryGetValue(familyKey, out var variants) ? variants : [];

    /// <summary>
    /// What sits directly under <paramref name="parentKey"/>: a folder's (or the root's) folders
    /// and families, or a family's variants.
    /// </summary>
    /// <param name="foldersOnly">Only folders - what the move picker for a family or folder asks for.</param>
    public IReadOnlyList<FontTreeNode> ChildrenOf(Guid? parentKey, bool foldersOnly = false)
    {
        if (parentKey is { } key && Family(key) is { } family)
            return foldersOnly ? [] : VariantsOf(key).Select(v => VariantNode(v, family.Key)).ToList();

        return _tree.ChildrenOf(parentKey, foldersOnly).Select(Map).ToList();
    }

    /// <summary>A folder, family or variant by key, or null.</summary>
    public FontTreeNode? Find(Guid key)
    {
        if (_tree.Find(key) is { } node) return Map(node);

        return _fontByKey.TryGetValue(key, out var font) ? VariantNode(font, font.FamilyKey!.Value) : null;
    }

    /// <summary>From the top of the tree down to the item, the item itself last. Empty for an unknown key.</summary>
    public IReadOnlyList<FontTreeNode> AncestorsOf(Guid key)
    {
        if (_fontByKey.TryGetValue(key, out var font))
            return [.. AncestorsOf(font.FamilyKey!.Value), VariantNode(font, font.FamilyKey!.Value)];

        return _tree.AncestorsOf(key).Select(Map).ToList();
    }

    public int DepthOf(Guid key) => Math.Max(0, AncestorsOf(key).Count - 1);

    /// <inheritdoc cref="FolderTree{TFolder,TLeaf}.WouldCreateCycle"/>
    public bool WouldCreateCycle(Guid folderKey, Guid? targetKey) => _tree.WouldCreateCycle(folderKey, targetKey);

    /// <summary>True when nothing - no folder and no family - sits directly in the folder.</summary>
    public bool IsEmpty(Guid folderKey) => _tree.IsEmpty(folderKey);

    /// <inheritdoc cref="FolderTree{TFolder,TLeaf}.NextSortOrder"/>
    public int NextSortOrder(Guid? parentKey) => _tree.NextSortOrder(parentKey);

    /// <inheritdoc cref="FolderTree{TFolder,TLeaf}.ApplySort"/>
    public IReadOnlyList<SortOrderChange> ApplySort(Guid? parentKey, IEnumerable<(Guid Key, int SortOrder)> sorting)
        => _tree.ApplySort(parentKey, sorting);

    /// <inheritdoc cref="FolderTree{TFolder,TLeaf}.EffectiveParent"/>
    public Guid? EffectiveParent(Guid? parentKey) => _tree.EffectiveParent(parentKey);

    /// <summary>"Regular 400", "Bold 700 Italic", or just the number for a weight with no common name.</summary>
    public static string VariantName(int weight, bool isItalic)
    {
        var named = WeightNames.FirstOrDefault(w => w.Weight == weight).Name;
        var name = named is null ? weight.ToString(System.Globalization.CultureInfo.InvariantCulture) : $"{named} {weight}";

        return isItalic ? $"{name} Italic" : name;
    }

    private FontTreeNode Map(FolderTreeNode<FontFolder, FontFamily> node) => node.IsFolder
        ? new FontTreeNode(node.Key, node.Name, FontTreeEntityType.Folder, node.ParentKey, node.HasChildren, node.SortOrder)
        : new FontTreeNode(node.Key, node.Name, FontTreeEntityType.Family, node.ParentKey, node.HasChildren, node.SortOrder,
            VariantCount: VariantsOf(node.Key).Count);

    private static FontTreeNode VariantNode(FontDefinition font, Guid familyKey)
        => new(font.Key, VariantName(font.Weight, font.IsItalic), FontTreeEntityType.Font, familyKey, false, font.SortOrder, font);
}
