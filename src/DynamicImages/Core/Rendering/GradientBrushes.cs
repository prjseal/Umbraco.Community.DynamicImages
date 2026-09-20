using System.Numerics;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Turns a <see cref="Gradient"/> into an ImageSharp brush over a given box. Shared by the canvas
/// background and by shape layers, so the two cannot drift - and both follow the CSS conventions
/// the designer paints its preview with, so the preview and the render agree.
/// </summary>
public static class GradientBrushes
{
    public static Brush Build(Gradient gradient, float x, float y, float width, float height, Matrix3x2 transform)
    {
        var from = ColourParser.ParseOrDefault(gradient.From, Color.Black);
        var to = ColourParser.ParseOrDefault(gradient.To, Color.Transparent);

        return gradient.Kind == GradientKind.Radial
            ? Radial(gradient, from, to, x, y, width, height, transform)
            : Linear(gradient, from, to, x, y, width, height, transform);
    }

    private static Brush Linear(
        Gradient gradient, Color from, Color to,
        float x, float y, float width, float height, Matrix3x2 transform)
    {
        var (start, end) = GradientGeometry.LinearAxis(x, y, width, height, gradient.Angle);

        // The gradient turns with the shape: its axis is fixed to the box, not to the canvas.
        var startPoint = Vector2.Transform(new Vector2(start.X, start.Y), transform);
        var endPoint = Vector2.Transform(new Vector2(end.X, end.Y), transform);

        return new LinearGradientBrush(
            new PointF(startPoint.X, startPoint.Y),
            new PointF(endPoint.X, endPoint.Y),
            GradientRepetitionMode.None,
            new ColorStop(0f, from),
            new ColorStop(1f, to));
    }

    private static Brush Radial(
        Gradient gradient, Color from, Color to,
        float x, float y, float width, float height, Matrix3x2 transform)
    {
        // An ellipse rather than a circle, because a circular gradient on a 1200x630 canvas is not
        // what radial-gradient means to anyone who has used CSS. GradientGeometry has the shape of
        // it; this only has to hand it to a brush.
        var (centreX, centreY) = GradientGeometry.RadialCentre(x, y, width, height, gradient.CentreX, gradient.CentreY);
        var (a, b) = GradientGeometry.RadialSemiAxes(x, y, width, height, centreX, centreY);

        // The gradient turns with the shape: the reference axis goes through the same matrix, and
        // rotation preserves the ratio between the axes.
        var centre = Vector2.Transform(new Vector2(centreX, centreY), transform);
        var axisEnd = Vector2.Transform(new Vector2(centreX + a, centreY), transform);

        return new EllipticGradientBrush(
            new PointF(centre.X, centre.Y),
            new PointF(axisEnd.X, axisEnd.Y),
            a > 0f ? b / a : 1f,
            GradientRepetitionMode.None,
            new ColorStop(0f, from),
            new ColorStop(1f, to));
    }
}
