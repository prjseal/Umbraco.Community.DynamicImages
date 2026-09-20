using System.Numerics;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Turns points and boxes about a pivot. Degrees are clockwise-positive on the y-down canvas,
/// which is what CSS <c>rotate()</c> and ImageSharp's rotation both mean, so the designer and the
/// render agree without a sign flip anywhere.
/// <para>
/// Mirrored exactly by <c>Client/src/models/rotation.ts</c>; both are tested against the shared
/// fixture in <c>rotation-fixtures.json</c>, because a drift between them means a rotated layer
/// sits in one place in the designer and another in the render.
/// </para>
/// </summary>
public static class RotationMath
{
    /// <summary>The equivalent angle in (-180, 180], so 270 reads as -90 and 360 as 0.</summary>
    public static float Normalise(float degrees)
    {
        var result = degrees % 360f;
        if (result > 180f) result -= 360f;
        else if (result <= -180f) result += 360f;
        return result;
    }

    /// <summary>
    /// The point <c>(px, py)</c> turned <paramref name="degrees"/> clockwise about the pivot. A
    /// positive angle takes a point right of the pivot to below it.
    /// </summary>
    public static (float X, float Y) RotatePoint(float px, float py, float pivotX, float pivotY, float degrees)
    {
        if (degrees == 0f) return (px, py);

        var radians = degrees * MathF.PI / 180f;
        var cos = MathF.Cos(radians);
        var sin = MathF.Sin(radians);
        var dx = px - pivotX;
        var dy = py - pivotY;

        return (pivotX + dx * cos - dy * sin, pivotY + dx * sin + dy * cos);
    }

    /// <summary>The inverse of <see cref="RotatePoint"/>: a canvas point expressed in the layer's own unrotated frame.</summary>
    public static (float X, float Y) ToLocal(float px, float py, float pivotX, float pivotY, float degrees)
        => RotatePoint(px, py, pivotX, pivotY, -degrees);

    /// <summary>
    /// The axis-aligned box covering the four corners of the box once it is rotated - the
    /// footprint on the canvas. An unrotated box comes back unchanged, bit for bit, so nothing
    /// about today's layouts picks up float noise.
    /// </summary>
    public static (float X, float Y, float Width, float Height) Extent(
        float left, float top, float width, float height, float pivotX, float pivotY, float degrees)
    {
        if (degrees == 0f) return (left, top, width, height);

        var corners = new[]
        {
            RotatePoint(left, top, pivotX, pivotY, degrees),
            RotatePoint(left + width, top, pivotX, pivotY, degrees),
            RotatePoint(left + width, top + height, pivotX, pivotY, degrees),
            RotatePoint(left, top + height, pivotX, pivotY, degrees),
        };

        var minX = corners.Min(c => c.X);
        var maxX = corners.Max(c => c.X);
        var minY = corners.Min(c => c.Y);
        var maxY = corners.Max(c => c.Y);

        return (minX, minY, maxX - minX, maxY - minY);
    }

    /// <summary>
    /// The same rotation as a matrix, for ImageSharp's path and text transforms. A test asserts
    /// that <see cref="Vector2.Transform(Vector2, Matrix3x2)"/> through it agrees with
    /// <see cref="RotatePoint"/>, which is what lets the renderers use the matrix while the layout
    /// code uses the point maths.
    /// </summary>
    public static Matrix3x2 Matrix(float pivotX, float pivotY, float degrees)
        => Matrix3x2.CreateRotation(degrees * MathF.PI / 180f, new Vector2(pivotX, pivotY));
}
