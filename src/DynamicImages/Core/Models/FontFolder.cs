using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Core.Models;

/// <summary>
/// A folder in the Fonts tree. Like a template folder it organises things for people and nothing
/// else: templates reference a font variant by key, so moving a family between folders changes
/// nothing a render sees.
/// </summary>
public class FontFolder : ITreeEntity
{
    public Guid Key { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    /// <summary>Null is the Fonts root.</summary>
    public Guid? ParentKey { get; set; }

    /// <summary>Its place among its siblings, folders and families together. Ties order by name.</summary>
    public int SortOrder { get; set; }

    public DateTime CreatedUtc { get; set; }

    public DateTime UpdatedUtc { get; set; }
}
