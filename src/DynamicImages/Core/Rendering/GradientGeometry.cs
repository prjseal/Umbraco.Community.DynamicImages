using Umbraco.Community.DynamicImages.Core.Models.Layers;

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
    /// The semi-axes of the ellipse a radial gradient's last stop sits on, for CSS's
    /// <c>ellipse &lt;extent&gt;</c>.
    /// <list type="bullet">
    /// <item><c>closest-side</c> / <c>farthest-side</c>: the ellipse touches the nearest / furthest
    /// side in each direction, so its semi-axes are those distances, <c>dx</c> and <c>dy</c>.</item>
    /// <item><c>closest-corner</c> / <c>farthest-corner</c> (the default): the same-proportioned
    /// ellipse grown until it passes through that corner, which sits at <c>(dx, dy)</c> - and the
    /// ellipse through it with ratio <c>dy/dx</c> has semi-axes <c>sqrt(2)</c> times each.</item>
    /// </list>
    /// An off-centre gradient therefore stays an ellipse rather than skewing. A centre on an edge
    /// makes a closest distance zero; half a pixel is the floor, so the brush always has a size.
    /// </summary>
    public static (float SemiMajor, float SemiMinor) RadialSemiAxes(
        float x, float y, float width, float height, float centreX, float centreY,
        GradientExtent extent = GradientExtent.FarthestCorner)
    {
        var farthest = extent is GradientExtent.FarthestCorner or GradientExtent.FarthestSide;

        var dx = farthest
            ? MathF.Max(centreX - x, x + width - centreX)
            : MathF.Min(centreX - x, x + width - centreX);
        var dy = farthest
            ? MathF.Max(centreY - y, y + height - centreY)
            : MathF.Min(centreY - y, y + height - centreY);

        var scale = extent is GradientExtent.FarthestCorner or GradientExtent.ClosestCorner ? MathF.Sqrt(2f) : 1f;
        return (MathF.Max(0.5f, scale * dx), MathF.Max(0.5f, scale * dy));
    }

    /// <summary>
    /// A circular radial gradient's radius for an extent, as CSS's <c>circle &lt;extent&gt;</c>:
    /// the nearest or furthest side over both directions, or the distance to the nearest or
    /// furthest corner.
    /// </summary>
    public static float RadialCircleRadius(
        float x, float y, float width, float height, float centreX, float centreY,
        GradientExtent extent = GradientExtent.FarthestCorner)
    {
        var nearX = MathF.Min(centreX - x, x + width - centreX);
        var farX = MathF.Max(centreX - x, x + width - centreX);
        var nearY = MathF.Min(centreY - y, y + height - centreY);
        var farY = MathF.Max(centreY - y, y + height - centreY);

        var radius = extent switch
        {
            GradientExtent.ClosestSide => MathF.Min(nearX, nearY),
            GradientExtent.FarthestSide => MathF.Max(farX, farY),
            GradientExtent.ClosestCorner => MathF.Sqrt(nearX * nearX + nearY * nearY),
            _ => MathF.Sqrt(farX * farX + farY * farY)
        };

        return MathF.Max(0.5f, radius);
    }

    /// <summary>
    /// Where a point sits on an angular (conic) gradient, 0..1: its bearing from the centre,
    /// clockwise from straight up, less the start angle - CSS's <c>conic-gradient(from a at …)</c>.
    /// </summary>
    public static float AngularPosition(float pointX, float pointY, float centreX, float centreY, float startAngle)
    {
        // atan2 with (dx, -dy) is the bearing clockwise from up, in -pi..pi.
        var bearing = MathF.Atan2(pointX - centreX, -(pointY - centreY)) * 180f / MathF.PI;
        var turned = (bearing - startAngle) % 360f;
        if (turned < 0f) turned += 360f;

        return turned / 360f;
    }

    /// <summary>
    /// Where a point sits on a diamond gradient, 0 at the centre and 1 on the diamond that touches
    /// the box's four sides; beyond it, past 1, the last stop continues. Each quadrant is scaled to
    /// its own distance from the centre to the sides, so an off-centre diamond still reaches every
    /// side - the same lines CSS draws with a <c>to corner</c> gradient in each quadrant.
    /// </summary>
    public static float DiamondPosition(
        float pointX, float pointY, float x, float y, float width, float height, float centreX, float centreY)
    {
        var dx = pointX - centreX;
        var dy = pointY - centreY;
        var reachX = dx < 0f ? centreX - x : x + width - centreX;
        var reachY = dy < 0f ? centreY - y : y + height - centreY;

        return (reachX > 0f ? MathF.Abs(dx) / reachX : 0f) + (reachY > 0f ? MathF.Abs(dy) / reachY : 0f);
    }

    /// <summary>
    /// A reflected gradient's stops as an ordinary linear gradient's: the first stop at the
    /// middle, running out to the last at both ends. What the CSS preview writes too, so the two
    /// agree by construction.
    /// </summary>
    public static IReadOnlyList<(string Colour, float Position)> ReflectedStops(IReadOnlyList<(string Colour, float Position)> stops)
    {
        var mirrored = stops.Reverse().Select(stop => (stop.Colour, 0.5f - stop.Position / 2f));
        var forward = stops.Select(stop => (stop.Colour, 0.5f + stop.Position / 2f));

        return [.. mirrored, .. forward];
    }

    /// <summary>
    /// The stops a gradient is drawn with: its own when it has two or more, sorted by position
    /// and clamped to 0..1; otherwise <see cref="Gradient.From"/> at 0 and <see cref="Gradient.To"/>
    /// at 1, which is every gradient stored before stops existed.
    /// </summary>
    public static IReadOnlyList<(string Colour, float Position)> EffectiveStops(Gradient gradient)
    {
        if (gradient.Stops is not { Count: >= 2 } stops) return [(gradient.From, 0f), (gradient.To, 1f)];

        return stops
            .Select((stop, index) => (stop.Colour, Position: ClampFraction(stop.Position), index))
            .OrderBy(stop => stop.Position)
            .ThenBy(stop => stop.index)
            .Select(stop => (stop.Colour, stop.Position))
            .ToList();
    }

    /// <summary>A centre fraction as the renderer will actually use it.</summary>
    public static float ClampFraction(float value) => Math.Clamp(value, 0f, 1f);
}
