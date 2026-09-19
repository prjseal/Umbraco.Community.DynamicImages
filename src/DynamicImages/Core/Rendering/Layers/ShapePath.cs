using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering.Layers;

/// <summary>Builds the ImageSharp path for a <see cref="RectLayer"/>'s shape inside a given box.</summary>
public static class ShapePath
{
    /// <summary>
    /// The shape filling the box. <paramref name="cornerRadius"/> applies to a rectangle only; a
    /// polygon or star is <see cref="ShapeGeometry"/>'s unit-square vertices scaled to the box.
    /// </summary>
    public static IPath Build(RectLayer rect, float x, float y, float width, float height, float cornerRadius)
    {
        switch (rect.Shape)
        {
            case ShapeKind.Ellipse:
                return new EllipsePolygon(new PointF(x + width / 2f, y + height / 2f), new SizeF(width, height));

            case ShapeKind.Polygon:
            case ShapeKind.Star:
                var points = ShapeGeometry.Vertices(rect.Shape, rect.Sides, rect.InnerRatio)
                    .Select(p => new PointF(x + p.X * width, y + p.Y * height))
                    .ToArray();
                return new Polygon(points);

            default:
                // Radius 0 falls through to a plain RectangularPolygon, exactly as before shapes existed.
                return RoundedRectangle.Build(x, y, width, height, cornerRadius);
        }
    }
}
