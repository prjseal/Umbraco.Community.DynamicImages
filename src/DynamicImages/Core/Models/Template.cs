using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Models;

/// <summary>
/// One generated-image design: which document types it applies to, where the result goes, the
/// canvas and its stack of layers. Persisted as a JSON document in DynamicImages_Template.
/// </summary>
public class Template
{
    public int SchemaVersion { get; set; } = DynamicImagesConstants.CurrentSchemaVersion;

    public Guid Key { get; set; } = Guid.NewGuid();

    /// <summary>Stable, unique, code-friendly identifier. Used by export/import and file sync.</summary>
    public string Alias { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public bool IsEnabled { get; set; } = true;

    /// <summary>
    /// The folder the template sits in, or null for the Templates root. Carried in the JSON so an
    /// exported file keeps its place, but the <c>parentKey</c> column is authoritative - and it
    /// only changes through a move, never through an ordinary save.
    /// </summary>
    public Guid? ParentKey { get; set; }

    public List<string> DocTypeAliases { get; set; } = [];

    /// <summary>Media picker property the generated image is written to.</summary>
    public string TargetPropertyAlias { get; set; } = string.Empty;

    public TriggerSettings Trigger { get; set; } = new();

    public OutputSettings Output { get; set; } = new();

    public CanvasSettings Canvas { get; set; } = new();

    /// <summary>Bottom to top. Array order is z-order.</summary>
    public List<LayerBase> Layers { get; set; } = [];

    /// <summary>
    /// Set by the server on every save and echoed back by the client on update, for optimistic
    /// concurrency (a mismatch is a 412).
    /// </summary>
    public DateTime UpdatedUtc { get; set; }
}
