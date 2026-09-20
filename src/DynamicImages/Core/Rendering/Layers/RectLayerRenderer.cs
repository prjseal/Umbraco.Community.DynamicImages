using System.Numerics;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering.Layers;

/// <summary>
/// Shapes - rectangles, ellipses, polygons and stars - with a solid or gradient fill and an
/// optional border drawn inside the box: scrims that keep text readable, rules, circles behind icons.
/// </summary>
public sealed class RectLayerRenderer : ILayerRenderer
{
    public Type LayerType => typeof(RectLayer);

    public Task<LayerBounds?> RenderAsync(Image image, LayerBase layer, LayerRenderContext context)
    {
        if (layer is not RectLayer rect || !HasPaint(rect)) return Task.FromResult<LayerBounds?>(null);

        var (x, y, width, height, pivot) = Layout(rect, context);
        if (width <= 0 || height <= 0) return Task.FromResult<LayerBounds?>(null);

        // Paths are built unrotated and turned about the pivot afterwards; the gradient's stops
        // go through the same matrix by hand, because filling a transformed region does not
        // transform the brush.
        var matrix = rect.Rotation != 0 ? RotationMath.Matrix(pivot.X, pivot.Y, rect.Rotation) : Matrix3x2.Identity;
        var fillPath = ShapePath.Build(rect, x, y, width, height, rect.CornerRadius);
        if (rect.Rotation != 0) fillPath = fillPath.Transform(matrix);

        var options = new DrawingOptions
        {
            GraphicsOptions = new GraphicsOptions
            {
                Antialias = true,
                BlendPercentage = Math.Clamp(rect.Opacity, 0f, 1f)
            }
        };

        if (rect.Gradient is not null)
        {
            var brush = BuildGradientBrush(rect.Gradient, x, y, width, height, matrix);
            image.Mutate(ctx => ctx.Fill(options, brush, fillPath));
        }
        else if (ColourParser.TryParse(rect.Fill, out var fill))
        {
            image.Mutate(ctx => ctx.Fill(options, new SolidBrush(fill), fillPath));
        }

        if (TryGetBorder(rect, out var borderWidth, out var borderColour) && width > borderWidth && height > borderWidth)
        {
            // The stroke is centred on its path, so a path deflated by half the width on every
            // side keeps the whole stroke inside the box - the image layer's inset trick,
            // generalised. A rectangle's corner radius is the box's outer radius, as in CSS, so
            // the path's own radius is half a stroke smaller.
            var inset = borderWidth / 2f;
            var borderPath = ShapePath.Build(
                rect, x + inset, y + inset, width - borderWidth, height - borderWidth, MathF.Max(0f, rect.CornerRadius - inset));
            if (rect.Rotation != 0) borderPath = borderPath.Transform(matrix);

            var pen = new SolidPen(new PenOptions(borderColour, borderWidth) { JointStyle = JointStyle.Round });
            image.Mutate(ctx => ctx.Draw(options, pen, borderPath));
        }

        return Task.FromResult<LayerBounds?>(
            new LayerBounds(rect.Key, x, y, width, height, 0, false, null, rect.Rotation, pivot.X, pivot.Y));
    }

    public Task<LayerBounds?> MeasureAsync(LayerBase layer, LayerRenderContext context)
    {
        if (layer is not RectLayer rect || !HasPaint(rect)) return Task.FromResult<LayerBounds?>(null);

        var (x, y, width, height, pivot) = Layout(rect, context);
        if (width <= 0 || height <= 0) return Task.FromResult<LayerBounds?>(null);

        return Task.FromResult<LayerBounds?>(
            new LayerBounds(rect.Key, x, y, width, height, 0, false, null, rect.Rotation, pivot.X, pivot.Y));
    }

    /// <summary>
    /// A shape with nothing to paint - no gradient, no parseable fill and no border - draws
    /// nothing, so it also occupies nothing. A border alone is enough: an outlined box is a shape.
    /// </summary>
    private static bool HasPaint(RectLayer rect)
        => rect.Gradient is not null || ColourParser.TryParse(rect.Fill, out _) || TryGetBorder(rect, out _, out _);

    private static bool TryGetBorder(RectLayer rect, out float width, out Color colour)
    {
        width = 0f;
        colour = default;

        if (rect.Border is not { Width: > 0 } border || !ColourParser.TryParse(border.Colour, out colour)) return false;

        width = border.Width;
        return true;
    }

    /// <summary>
    /// A missing dimension means "the whole canvas" - that is what a scrim is. The pivot is the
    /// resolved position: the one point whose place the anchor fixes.
    /// </summary>
    private static (float X, float Y, float Width, float Height, PointF Pivot) Layout(RectLayer rect, LayerRenderContext context)
    {
        var width = rect.Size.Width ?? context.Template.Canvas.Width;
        var height = rect.Size.Height ?? context.Template.Canvas.Height;
        var position = context.PositionOf(rect);
        var (x, y) = AnchorMath.ToTopLeft(position, width, height);

        return (x, y, width, height, new PointF(position.X, position.Y));
    }

    private static LinearGradientBrush BuildGradientBrush(
        Gradient gradient, float x, float y, float width, float height, Matrix3x2 transform)
    {
        var from = ColourParser.ParseOrDefault(gradient.From, Color.Black);
        var to = ColourParser.ParseOrDefault(gradient.To, Color.Transparent);

        // CSS convention: 180 degrees runs top to bottom. Project the angle across the box so the
        // gradient spans it whatever its aspect ratio.
        var radians = (gradient.Angle - 90f) * MathF.PI / 180f;
        var centreX = x + width / 2f;
        var centreY = y + height / 2f;
        var reach = (MathF.Abs(MathF.Cos(radians)) * width + MathF.Abs(MathF.Sin(radians)) * height) / 2f;

        var start = new Vector2(centreX - MathF.Cos(radians) * reach, centreY - MathF.Sin(radians) * reach);
        var end = new Vector2(centreX + MathF.Cos(radians) * reach, centreY + MathF.Sin(radians) * reach);

        // The gradient turns with the shape: its axis is fixed to the box, not to the canvas.
        start = Vector2.Transform(start, transform);
        end = Vector2.Transform(end, transform);

        return new LinearGradientBrush(
            new PointF(start.X, start.Y),
            new PointF(end.X, end.Y),
            GradientRepetitionMode.None,
            new ColorStop(0f, from),
            new ColorStop(1f, to));
    }
}
