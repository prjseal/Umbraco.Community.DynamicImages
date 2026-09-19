using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering.Layers;

/// <summary>
/// The vertices of a polygon or star in the unit square, scaled to the layer's box by the caller
/// - so a polygon fills a non-square box by stretching, as CSS <c>clip-path: polygon(%)</c> does.
/// <para>
/// Mirrored exactly by <c>Client/src/models/shape-geometry.ts</c>; both are tested against the
/// shared fixture in <c>shape-fixtures.json</c>, so the designer's clip path and the render's
/// path are the same shape. Rectangles and ellipses have no vertex list: they are primitives on
/// both sides.
/// </para>
/// </summary>
public static class ShapeGeometry
{
    public const int MinSides = 3;
    public const int MaxSides = 12;
    public const float MinInnerRatio = 0.1f;
    public const float MaxInnerRatio = 0.9f;

    public static int ClampSides(int sides) => Math.Clamp(sides, MinSides, MaxSides);

    public static float ClampInnerRatio(float innerRatio) => Math.Clamp(innerRatio, MinInnerRatio, MaxInnerRatio);

    /// <summary>
    /// Points around the centre <c>(0.5, 0.5)</c> at radius <c>0.5</c>. A polygon's point
    /// <c>i</c> sits at <c>-90° + i·360°/n</c> (the first at the top); a star has <c>2n</c>
    /// points at <c>-90° + i·180°/n</c>, alternating the outer radius and the inner one.
    /// </summary>
    public static IReadOnlyList<(float X, float Y)> Vertices(ShapeKind kind, int sides, float innerRatio)
    {
        if (kind is not (ShapeKind.Polygon or ShapeKind.Star)) return [];

        var n = ClampSides(sides);
        var inner = 0.5f * ClampInnerRatio(innerRatio);
        var count = kind == ShapeKind.Star ? n * 2 : n;
        var step = kind == ShapeKind.Star ? 180f / n : 360f / n;
        var points = new (float X, float Y)[count];

        for (var i = 0; i < count; i++)
        {
            var radians = (-90f + i * step) * MathF.PI / 180f;
            var radius = kind == ShapeKind.Star && i % 2 == 1 ? inner : 0.5f;
            points[i] = (0.5f + radius * MathF.Cos(radians), 0.5f + radius * MathF.Sin(radians));
        }

        return points;
    }
}
