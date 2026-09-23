using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Core.Models;

/// <summary>
/// A font family in the Fonts tree - "Inter" - holding one <see cref="FontDefinition"/> per
/// weight and slant. Moves and deletes act on the family; templates still reference a variant.
/// <para>
/// <see cref="Name"/> is also written to every variant's <see cref="FontDefinition.FamilyName"/>,
/// which is what the renderer and the designer's FontFace loader match on. Renaming a family
/// rewrites its variants in the same transaction, so the two never disagree.
/// </para>
/// </summary>
public class FontFamily : ITreeEntity
{
    public Guid Key { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    /// <summary>The folder it sits in. Null is the Fonts root.</summary>
    public Guid? ParentKey { get; set; }

    public int SortOrder { get; set; }

    public DateTime CreatedUtc { get; set; }

    public DateTime UpdatedUtc { get; set; }
}
