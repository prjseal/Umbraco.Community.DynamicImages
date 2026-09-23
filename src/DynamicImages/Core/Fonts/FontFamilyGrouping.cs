namespace Umbraco.Community.DynamicImages.Core.Fonts;

/// <summary>A family to create, and the font rows that go in it.</summary>
public sealed record FontFamilyGroup(string Name, IReadOnlyList<Guid> FontKeys);

/// <summary>
/// How font rows become families: by family name, trimmed and compared ignoring case, so
/// "Inter", "inter" and " Inter " are one family. What the migration's backfill does, and what
/// finding a family for a new variant by name does.
/// </summary>
public static class FontFamilyGrouping
{
    /// <summary>The key two family names are compared on.</summary>
    public static string Normalise(string? name) => (name ?? string.Empty).Trim().ToUpperInvariant();

    /// <summary>
    /// One group per distinct name, in the order each name first appears. The group is named by
    /// its first row's trimmed spelling; a blank name becomes "Unnamed font", as an unreadable
    /// file's family does.
    /// </summary>
    public static IReadOnlyList<FontFamilyGroup> Group(IEnumerable<(Guid Key, string? FamilyName)> fonts)
        => fonts
            .GroupBy(f => Normalise(f.FamilyName))
            .Select(g => new FontFamilyGroup(
                g.First().FamilyName?.Trim() is { Length: > 0 } name ? name : "Unnamed font",
                g.Select(f => f.Key).ToList()))
            .ToList();
}
