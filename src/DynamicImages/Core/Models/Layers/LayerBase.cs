using System.Text.Json.Serialization;

namespace Umbraco.Community.DynamicImages.Core.Models.Layers;

/// <summary>
/// Base of the layer discriminated union. The <c>type</c> discriminator is what the designer,
/// the JSON document and <c>LayerRendererCollection</c> all key off.
/// </summary>
[JsonPolymorphic(TypeDiscriminatorPropertyName = "type", UnknownDerivedTypeHandling = JsonUnknownDerivedTypeHandling.FailSerialization)]
[JsonDerivedType(typeof(TextLayer), "text")]
[JsonDerivedType(typeof(ImageLayer), "image")]
[JsonDerivedType(typeof(BadgesLayer), "badges")]
[JsonDerivedType(typeof(RectLayer), "rect")]
public abstract class LayerBase
{
    public Guid Key { get; set; } = Guid.NewGuid();

    /// <summary>Editor-facing name, shown in the layers panel.</summary>
    public string Name { get; set; } = string.Empty;

    public bool IsVisible { get; set; } = true;

    /// <summary>Locked layers are skipped by pointer interaction in the designer. They still render.</summary>
    public bool IsLocked { get; set; }

    public float Opacity { get; set; } = 1f;

    public Position Position { get; set; } = new();

    public LayerSize Size { get; set; } = new();

    public Visibility Visibility { get; set; } = new();

    /// <summary>The discriminator value, for code that needs it without pattern matching.</summary>
    [JsonIgnore]
    public abstract string TypeAlias { get; }
}
