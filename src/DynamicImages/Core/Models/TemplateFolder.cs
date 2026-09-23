using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Core.Models;

/// <summary>
/// A folder in the Templates tree. It organises templates for people and nothing else: the
/// publish handler never looks at folders, so moving a template between them changes nothing
/// about which documents it applies to.
/// </summary>
public class TemplateFolder : ITreeEntity
{
    public Guid Key { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    /// <summary>Null is the Templates root.</summary>
    public Guid? ParentKey { get; set; }

    /// <summary>Its place among its siblings, folders and templates together. Ties order by name.</summary>
    public int SortOrder { get; set; }

    public DateTime CreatedUtc { get; set; }

    public DateTime UpdatedUtc { get; set; }
}
