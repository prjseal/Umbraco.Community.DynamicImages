namespace Umbraco.Community.DynamicImages.Core.Models;

/// <summary>
/// A folder in the Templates tree. It organises templates for people and nothing else: the
/// publish handler never looks at folders, so moving a template between them changes nothing
/// about which documents it applies to.
/// </summary>
public class TemplateFolder
{
    public Guid Key { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    /// <summary>Null is the Templates root.</summary>
    public Guid? ParentKey { get; set; }

    /// <summary>Stored for a future sort action; the tree orders by name today.</summary>
    public int SortOrder { get; set; }

    public DateTime CreatedUtc { get; set; }

    public DateTime UpdatedUtc { get; set; }
}
