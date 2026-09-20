using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models.Layers;

public class Gradient
{
    public string From { get; set; } = "#000000CC";

    public string To { get; set; } = "#00000000";

    /// <summary>Degrees clockwise from "top to bottom" = 180, matching CSS linear-gradient.</summary>
    public float Angle { get; set; } = 180f;
}

/// <summary>What a <see cref="RectLayer"/> draws inside its box.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum ShapeKind
{
    /// <summary>The box itself, with optional rounded corners.</summary>
    [JsonStringEnumMemberName("rectangle")]
    Rectangle,

    /// <summary>The ellipse inscribed in the box - a circle when the box is square.</summary>
    [JsonStringEnumMemberName("ellipse")]
    Ellipse,

    /// <summary>A regular polygon with <see cref="RectLayer.Sides"/> sides, the first point at the top.</summary>
    [JsonStringEnumMemberName("polygon")]
    Polygon,

    /// <summary>A star with <see cref="RectLayer.Sides"/> points and <see cref="RectLayer.InnerRatio"/> for the notches.</summary>
    [JsonStringEnumMemberName("star")]
    Star
}

/// <summary>
/// An outline drawn inside the shape's box, the way an image layer's border and a CSS border
/// are. Its own class rather than <see cref="ImageBorder"/>, whose name would mislead on a shape.
/// </summary>
public class ShapeBorder
{
    public float Width { get; set; }

    public string Colour { get; set; } = "#FFFFFF";
}

/// <summary>
/// A filled and/or outlined shape - scrims, colour blocks, rules, circles behind icons. The
/// discriminator stays <c>rect</c> whatever the <see cref="Shape"/>: an older package reading a
/// newer document draws a rectangle, and every stored template stays valid.
/// </summary>
public class RectLayer : LayerBase
{
    public override string TypeAlias => "rect";

    public ShapeKind Shape { get; set; } = ShapeKind.Rectangle;

    /// <summary>Solid fill colour; null (with no gradient) means the shape is outline-only.</summary>
    public string? Fill { get; set; }

    public Gradient? Gradient { get; set; }

    /// <summary><see cref="ShapeKind.Rectangle"/> only.</summary>
    public float CornerRadius { get; set; }

    /// <summary>Sides of a polygon, or points of a star; the renderer clamps to 3..12.</summary>
    public int Sides { get; set; } = 5;

    /// <summary>A star's inner radius as a proportion of the outer, clamped to 0.1..0.9.</summary>
    public float InnerRatio { get; set; } = 0.5f;

    public ShapeBorder? Border { get; set; }
}
