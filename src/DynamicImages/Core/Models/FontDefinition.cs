using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Models;

/// <summary>A reusable named size/weight combination on a font, e.g. "Title" = 56pt regular.</summary>
public class FontStyleDefinition
{
    public string Name { get; set; } = string.Empty;

    public float Size { get; set; }

    /// <summary>Regular / Bold / Italic / BoldItalic.</summary>
    public string FontStyle { get; set; } = "Regular";
}

/// <summary>
/// A font available to templates: one weight and slant of a family, from one file, plus its named
/// styles. In the Fonts tree it is a variant under its <see cref="FontFamily"/>.
/// </summary>
public class FontDefinition
{
    public Guid Key { get; set; } = Guid.NewGuid();

    /// <summary>The same as the family's name; see <see cref="FontFamily"/>.</summary>
    public string FamilyName { get; set; } = string.Empty;

    /// <summary>
    /// The <see cref="FontFamily"/> it belongs to. Null only for a row written before families
    /// existed and not yet given one - the service finds or creates one by name.
    /// </summary>
    public Guid? FamilyKey { get; set; }

    /// <summary>Its place among the family's variants. Ties order by weight, then upright first.</summary>
    public int SortOrder { get; set; }

    /// <summary>
    /// Only <see cref="ImageSourceKind.Media"/>, <see cref="ImageSourceKind.Path"/> and
    /// <see cref="ImageSourceKind.Url"/> are valid here.
    /// </summary>
    public ImageSourceKind SourceKind { get; set; } = ImageSourceKind.Media;

    public Guid? MediaKey { get; set; }

    public string? Path { get; set; }

    /// <summary>For a <see cref="ImageSourceKind.Url"/> font: the font file's URL, fetched at render time.</summary>
    public string? SourceUrl { get; set; }

    /// <summary>
    /// For a <see cref="ImageSourceKind.Url"/> font: "google", "bunny" or "direct". Not "url" - that
    /// is the source kind's name and would read as the same thing twice.
    /// </summary>
    public string? Provider { get; set; }

    /// <summary>The family name as typed into the provider picker, kept so the row can be re-resolved on refresh.</summary>
    public string? ProviderFamily { get; set; }

    public int Weight { get; set; } = 400;

    public bool IsItalic { get; set; }

    public List<FontStyleDefinition> Styles { get; set; } = [];

    public string? ContentHash { get; set; }

    public DateTime CreatedUtc { get; set; }

    public DateTime UpdatedUtc { get; set; }
}
