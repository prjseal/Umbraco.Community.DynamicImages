using SixLabors.Fonts;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Converts between a layer's anchored position and the top-left corner ImageSharp draws from.
/// <para>
/// Mirrored exactly by <c>Client/src/models/anchor.ts</c>; both are tested against the shared
/// fixture in <c>anchor-fixtures.json</c>, because a drift between them means a layer lands in a
/// different place in the designer than it does in the render.
/// </para>
/// </summary>
public static class AnchorMath
{
    /// <summary>Horizontal factor of the anchor: 0 at the left edge, 0.5 centred, 1 at the right.</summary>
    public static float AxisX(Anchor anchor) => anchor switch
    {
        Anchor.TopLeft or Anchor.MiddleLeft or Anchor.BottomLeft => 0f,
        Anchor.TopCentre or Anchor.MiddleCentre or Anchor.BottomCentre => 0.5f,
        _ => 1f
    };

    /// <summary>Vertical factor of the anchor: 0 at the top edge, 0.5 middle, 1 at the bottom.</summary>
    public static float AxisY(Anchor anchor) => anchor switch
    {
        Anchor.TopLeft or Anchor.TopCentre or Anchor.TopRight => 0f,
        Anchor.MiddleLeft or Anchor.MiddleCentre or Anchor.MiddleRight => 0.5f,
        _ => 1f
    };

    /// <summary>
    /// The anchor whose factors are <paramref name="axisX"/> and <paramref name="axisY"/> - the
    /// inverse of <see cref="AxisX"/> and <see cref="AxisY"/>. Relative positioning forces one
    /// axis to an edge and keeps the other, and this is how the two halves become an anchor again.
    /// </summary>
    public static Anchor Compose(float axisX, float axisY)
    {
        var column = axisX < 0.25f ? 0 : axisX < 0.75f ? 1 : 2;
        var row = axisY < 0.25f ? 0 : axisY < 0.75f ? 1 : 2;

        return (Anchor)(row * 3 + column);
    }

    /// <summary>Top-left corner of a box of <paramref name="width"/> x <paramref name="height"/> anchored at <paramref name="position"/>.</summary>
    public static (float X, float Y) ToTopLeft(Position position, float width, float height)
        => (position.X - width * AxisX(position.Anchor), position.Y - height * AxisY(position.Anchor));

    /// <summary>Inverse of <see cref="ToTopLeft"/>: where the anchor point of that box sits.</summary>
    public static (float X, float Y) FromTopLeft(float left, float top, float width, float height, Anchor anchor)
        => (left + width * AxisX(anchor), top + height * AxisY(anchor));

    /// <summary>
    /// The ImageSharp horizontal alignment matching the anchor. ImageSharp aligns the text block
    /// around <c>Origin</c> using exactly this factor, so the two stay consistent by construction.
    /// </summary>
    public static HorizontalAlignment ToHorizontalAlignment(Anchor anchor) => AxisX(anchor) switch
    {
        0f => HorizontalAlignment.Left,
        0.5f => HorizontalAlignment.Center,
        _ => HorizontalAlignment.Right
    };

    public static VerticalAlignment ToVerticalAlignment(Anchor anchor) => AxisY(anchor) switch
    {
        0f => VerticalAlignment.Top,
        0.5f => VerticalAlignment.Center,
        _ => VerticalAlignment.Bottom
    };

    /// <summary>Alignment of text within its own box - independent of where that box is anchored.</summary>
    public static TextAlignment ToTextAlignment(Models.Layers.TextAlign align) => align switch
    {
        Models.Layers.TextAlign.Centre => TextAlignment.Center,
        Models.Layers.TextAlign.Right => TextAlignment.End,
        _ => TextAlignment.Start
    };
}
