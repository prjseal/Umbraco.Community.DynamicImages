namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Where a gradient's stops sit inside a box, in the conventions CSS uses - so the designer's
/// preview, which is CSS, and the render, which is a brush, describe the same gradient. Free of
/// ImageSharp brushes so it can be asserted against hand-computed numbers, the way
/// <see cref="Layers.ShapeGeometry"/>, <see cref="AnchorMath"/> and <see cref="RotationMath"/> are;
/// <see cref="GradientBrushes"/> is the thin adapter that wraps these numbers in a brush.
/// </summary>
public static class GradientGeometry
{
    /// <summary>
    /// The axis a linear gradient runs along, from its first stop to its last. The angle is CSS's:
    /// 180 degrees runs top to bottom. The axis is projected across the box so the gradient spans
    /// it whatever its aspect ratio.
    /// </summary>
    public static ((float X, float Y) Start, (float X, float Y) End) LinearAxis(
        float x, float y, float width, float height, float angle)
    {
        var radians = (angle - 90f) * MathF.PI / 180f;
        var centreX = x + width / 2f;
        var centreY = y + height / 2f;
        var reach = (MathF.Abs(MathF.Cos(radians)) * width + MathF.Abs(MathF.Sin(radians)) * height) / 2f;

        var dx = MathF.Cos(radians) * reach;
        var dy = MathF.Sin(radians) * reach;

        return ((centreX - dx, centreY - dy), (centreX + dx, centreY + dy));
    }

    /// <summary>
    /// A radial gradient's centre in pixels, from CSS-style fractions of the box (<c>at 50% 50%</c>).
    /// Out-of-range fractions clamp to the box's edges rather than throwing the ellipse outside it.
    /// </summary>
    public static (float X, float Y) RadialCentre(
        float x, float y, float width, float height, float centreX, float centreY)
        => (x + width * ClampFraction(centreX), y + height * ClampFraction(centreY));

    /// <summary>
    /// The semi-axes of the ellipse a radial gradient's last stop sits on, for CSS's default
    /// <c>ellipse farthest-corner</c>: an ellipse with the box's own proportions, grown until it
    /// passes through the corner furthest from the centre. That corner sits at the two
    /// farthest-side distances <c>dx</c> and <c>dy</c>, and the ellipse through it with ratio
    /// <c>dy/dx</c> has semi-axes <c>sqrt(2)</c> times each of them - so an off-centre gradient
    /// stays an ellipse rather than skewing.
    /// </summary>
    public static (float SemiMajor, float SemiMinor) RadialSemiAxes(
        float x, float y, float width, float height, float centreX, float centreY)
    {
        var dx = MathF.Max(centreX - x, x + width - centreX);
        var dy = MathF.Max(centreY - y, y + height - centreY);

        var root2 = MathF.Sqrt(2f);
        return (root2 * dx, root2 * dy);
    }

    /// <summary>A centre fraction as the renderer will actually use it.</summary>
    public static float ClampFraction(float value) => Math.Clamp(value, 0f, 1f);
}
