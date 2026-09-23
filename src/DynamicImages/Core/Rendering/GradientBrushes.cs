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
        var effective = GradientGeometry.EffectiveStops(gradient);
        if (gradient.Kind == GradientKind.Reflected) effective = GradientGeometry.ReflectedStops(effective);

        // Every effective stop, in order - two for a gradient stored before stops existed.
        var stops = effective
            .Select((stop, index) => new ColorStop(
                stop.Position,
                ColourParser.ParseOrDefault(stop.Colour, index == 0 ? Color.Black : Color.Transparent)))
            .ToArray();

        return gradient.Kind switch
        {
            GradientKind.Radial => Radial(gradient, stops, x, y, width, height, transform),
            GradientKind.Angular => Angular(gradient, stops, x, y, width, height, transform),
            GradientKind.Diamond => Diamond(gradient, stops, x, y, width, height, transform),
            _ => Linear(gradient, stops, x, y, width, height, transform)
        };
    }

    private static Brush Angular(
        Gradient gradient, ColorStop[] stops,
        float x, float y, float width, float height, Matrix3x2 transform)
    {
        var (centreX, centreY) = GradientGeometry.RadialCentre(x, y, width, height, gradient.CentreX, gradient.CentreY);

        return new PositionGradientBrush(
            (px, py) => GradientGeometry.AngularPosition(px, py, centreX, centreY, gradient.Angle),
            Invert(transform),
            stops);
    }

    private static Brush Diamond(
        Gradient gradient, ColorStop[] stops,
        float x, float y, float width, float height, Matrix3x2 transform)
    {
        var (centreX, centreY) = GradientGeometry.RadialCentre(x, y, width, height, gradient.CentreX, gradient.CentreY);

        return new PositionGradientBrush(
            (px, py) => GradientGeometry.DiamondPosition(px, py, x, y, width, height, centreX, centreY),
            Invert(transform),
            stops);
    }

    private static Matrix3x2 Invert(Matrix3x2 transform)
        => Matrix3x2.Invert(transform, out var inverse) ? inverse : Matrix3x2.Identity;

    private static Brush Linear(
        Gradient gradient, ColorStop[] stops,
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
            stops);
    }

    private static Brush Radial(
        Gradient gradient, ColorStop[] stops,
        float x, float y, float width, float height, Matrix3x2 transform)
    {
        // An ellipse rather than a circle, because a circular gradient on a 1200x630 canvas is not
        // what radial-gradient means to anyone who has used CSS. GradientGeometry has the shape of
        // it; this only has to hand it to a brush.
        var (centreX, centreY) = GradientGeometry.RadialCentre(x, y, width, height, gradient.CentreX, gradient.CentreY);
        if (gradient.Shape == GradientShape.Circle)
        {
            var radius = GradientGeometry.RadialCircleRadius(x, y, width, height, centreX, centreY, gradient.Extent);
            var circleCentre = Vector2.Transform(new Vector2(centreX, centreY), transform);

            // A circle is a circle under any rotation, so only the centre goes through the matrix.
            return new RadialGradientBrush(new PointF(circleCentre.X, circleCentre.Y), radius, GradientRepetitionMode.None, stops);
        }

        var (a, b) = GradientGeometry.RadialSemiAxes(x, y, width, height, centreX, centreY, gradient.Extent);

        // The gradient turns with the shape: the reference axis goes through the same matrix, and
        // rotation preserves the ratio between the axes.
        var centre = Vector2.Transform(new Vector2(centreX, centreY), transform);
        var axisEnd = Vector2.Transform(new Vector2(centreX + a, centreY), transform);

        return new EllipticGradientBrush(
            new PointF(centre.X, centre.Y),
            new PointF(axisEnd.X, axisEnd.Y),
            a > 0f ? b / a : 1f,
            GradientRepetitionMode.None,
            stops);
    }
}
