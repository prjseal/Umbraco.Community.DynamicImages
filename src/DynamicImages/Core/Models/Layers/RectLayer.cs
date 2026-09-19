namespace Umbraco.Community.DynamicImages.Core.Models.Layers;

public class Gradient
{
    public string From { get; set; } = "#000000CC";

    public string To { get; set; } = "#00000000";

    /// <summary>Degrees clockwise from "top to bottom" = 180, matching CSS linear-gradient.</summary>
    public float Angle { get; set; } = 180f;
}

/// <summary>A solid or gradient-filled rectangle - scrims behind text, colour blocks, rules.</summary>
public class RectLayer : LayerBase
{
    public override string TypeAlias => "rect";

    public string? Fill { get; set; }

    public Gradient? Gradient { get; set; }

    public float CornerRadius { get; set; }
}
