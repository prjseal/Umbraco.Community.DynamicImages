namespace Umbraco.Community.DynamicImages.Core.Models.Layers;

public class TextLayer : LayerBase
{
    public override string TypeAlias => "text";

    public TextBinding Binding { get; set; } = new();

    public string? Prefix { get; set; }

    public string? Suffix { get; set; }

    public TextStyle Style { get; set; } = new();
}
