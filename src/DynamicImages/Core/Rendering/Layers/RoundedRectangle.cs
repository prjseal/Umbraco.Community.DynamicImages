using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;

namespace Umbraco.Community.DynamicImages.Core.Rendering.Layers;

/// <summary>Builds a rounded-rectangle path, since ImageSharp.Drawing has no primitive for one.</summary>
public static class RoundedRectangle
{
    public static IPath Build(float x, float y, float width, float height, float radius)
    {
        // A radius larger than half the shortest side would make the arcs overlap and the path
        // self-intersect, so clamp it - the result is a stadium/circle, which is what a caller
        // asking for "very round" means anyway.
        radius = MathF.Min(radius, MathF.Min(width, height) / 2f);
        if (radius <= 0) return new RectangularPolygon(x, y, width, height);

        var builder = new PathBuilder();
        builder.StartFigure();

        builder.AddLine(new PointF(x + radius, y), new PointF(x + width - radius, y));
        builder.AddArc(new RectangleF(x + width - radius * 2, y, radius * 2, radius * 2), 0, 270, 90);

        builder.AddLine(new PointF(x + width, y + radius), new PointF(x + width, y + height - radius));
        builder.AddArc(new RectangleF(x + width - radius * 2, y + height - radius * 2, radius * 2, radius * 2), 0, 0, 90);

        builder.AddLine(new PointF(x + width - radius, y + height), new PointF(x + radius, y + height));
        builder.AddArc(new RectangleF(x, y + height - radius * 2, radius * 2, radius * 2), 0, 90, 90);

        builder.AddLine(new PointF(x, y + height - radius), new PointF(x, y + radius));
        builder.AddArc(new RectangleF(x, y, radius * 2, radius * 2), 0, 180, 90);

        builder.CloseFigure();
        return builder.Build();
    }
}
