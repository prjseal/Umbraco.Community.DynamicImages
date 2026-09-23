using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models.Layers;

/// <summary>How a <see cref="Gradient"/> spreads across its box.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum GradientKind
{
    /// <summary>Along an axis, at <see cref="Gradient.Angle"/>.</summary>
    [JsonStringEnumMemberName("linear")]
    Linear,

    /// <summary>Out from <see cref="Gradient.CentreX"/>, <see cref="Gradient.CentreY"/>.</summary>
    [JsonStringEnumMemberName("radial")]
    Radial,

    /// <summary>
    /// Around the centre, sweeping clockwise from <see cref="Gradient.Angle"/> - an art program's
    /// angle gradient, CSS's <c>conic-gradient</c>.
    /// </summary>
    [JsonStringEnumMemberName("angular")]
    Angular,

    /// <summary>Out from the centre in a diamond that touches the box's four sides at the last stop.</summary>
    [JsonStringEnumMemberName("diamond")]
    Diamond,

    /// <summary>A linear gradient mirrored about the box's centre line: first stop in the middle, last at both ends.</summary>
    [JsonStringEnumMemberName("reflected")]
    Reflected
}

/// <summary>A radial gradient's ending shape.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum GradientShape
{
    /// <summary>With the box's proportions. What every radial gradient was before this option.</summary>
    [JsonStringEnumMemberName("ellipse")]
    Ellipse,

    [JsonStringEnumMemberName("circle")]
    Circle
}

/// <summary>How far a radial gradient's last stop reaches - CSS's ending-shape size keywords.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum GradientExtent
{
    /// <summary>The ellipse through the box's corner farthest from the centre. CSS's default.</summary>
    [JsonStringEnumMemberName("farthestCorner")]
    FarthestCorner,

    [JsonStringEnumMemberName("farthestSide")]
    FarthestSide,

    [JsonStringEnumMemberName("closestCorner")]
    ClosestCorner,

    [JsonStringEnumMemberName("closestSide")]
    ClosestSide
}

/// <summary>One colour stop along a gradient.</summary>
public class GradientStop
{
    public string Colour { get; set; } = "#000000";

    /// <summary>Where the stop sits along the gradient, 0..1. The renderer clamps.</summary>
    public float Position { get; set; }
}

/// <summary>
/// A gradient, on a shape layer or as the canvas's fill. Shared by both, so the two cannot drift
/// apart.
/// <para>
/// <see cref="Stops"/> is optional. Without at least two, the gradient is <see cref="From"/> at 0
/// and <see cref="To"/> at 1 - which is every template stored before stops existed, so they render
/// exactly as they did with no migration. With stops, the stops win, and the designer also writes
/// the first and last into <see cref="From"/> and <see cref="To"/> so an older package still draws
/// something close.
/// </para>
/// </summary>
public class Gradient
{
    /// <summary>Absent in a v2 document, which is exactly the linear gradient it used to be.</summary>
    public GradientKind Kind { get; set; } = GradientKind.Linear;

    public string From { get; set; } = "#000000CC";

    public string To { get; set; } = "#00000000";

    /// <summary>
    /// Linear and reflected: degrees clockwise from "top to bottom" = 180, matching CSS
    /// linear-gradient. Angular: where the sweep starts, degrees clockwise from straight up,
    /// matching CSS <c>conic-gradient(from …)</c>.
    /// </summary>
    public float Angle { get; set; } = 180f;

    /// <summary>Radial, angular and diamond. The centre as a fraction of the box, as in CSS's
    /// <c>at 50% 50%</c>. The renderer clamps to 0..1.</summary>
    public float CentreX { get; set; } = 0.5f;

    /// <summary>See <see cref="CentreX"/>.</summary>
    public float CentreY { get; set; } = 0.5f;

    /// <summary><see cref="GradientKind.Radial"/> only. Absent means an ellipse, as before.</summary>
    public GradientShape Shape { get; set; } = GradientShape.Ellipse;

    /// <summary>Two or more stops, or null for <see cref="From"/> to <see cref="To"/>.</summary>
    public List<GradientStop>? Stops { get; set; }

    /// <summary><see cref="GradientKind.Radial"/> only. Absent means farthest-corner, as before.</summary>
    public GradientExtent Extent { get; set; } = GradientExtent.FarthestCorner;
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

    /// <summary>
    /// Keep the box's width:height ratio when it is resized in the designer - what makes a circle
    /// stay a circle. A designer-side rule only: the renderer draws the box it is given, and a
    /// square box already draws a circle. An older package ignores the property.
    /// </summary>
    public bool LockAspect { get; set; }
}
