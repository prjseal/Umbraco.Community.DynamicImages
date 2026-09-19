using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering.Layers;

/// <summary>Solid or gradient rectangles - scrims that keep text readable over a busy photo.</summary>
public sealed class RectLayerRenderer : ILayerRenderer
{
    public Type LayerType => typeof(RectLayer);

    public Task<LayerBounds?> RenderAsync(Image image, LayerBase layer, LayerRenderContext context)
    {
        if (layer is not RectLayer rect || !HasFill(rect)) return Task.FromResult<LayerBounds?>(null);

        var (x, y, width, height) = Layout(rect, context);
        if (width <= 0 || height <= 0) return Task.FromResult<LayerBounds?>(null);

        IPath shape = rect.CornerRadius > 0
            ? RoundedRectangle.Build(x, y, width, height, rect.CornerRadius)
            : new RectangularPolygon(x, y, width, height);

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
            var brush = BuildGradientBrush(rect.Gradient, x, y, width, height);
            image.Mutate(ctx => ctx.Fill(options, brush, shape));
        }
        else if (ColourParser.TryParse(rect.Fill, out var fill))
        {
            image.Mutate(ctx => ctx.Fill(options, new SolidBrush(fill), shape));
        }

        return Task.FromResult<LayerBounds?>(new LayerBounds(rect.Key, x, y, width, height, 0, false, null));
    }

    public Task<LayerBounds?> MeasureAsync(LayerBase layer, LayerRenderContext context)
    {
        if (layer is not RectLayer rect || !HasFill(rect)) return Task.FromResult<LayerBounds?>(null);

        var (x, y, width, height) = Layout(rect, context);
        if (width <= 0 || height <= 0) return Task.FromResult<LayerBounds?>(null);

        return Task.FromResult<LayerBounds?>(new LayerBounds(rect.Key, x, y, width, height, 0, false, null));
    }

    /// <summary>A shape with nothing to paint draws nothing, so it also occupies nothing.</summary>
    private static bool HasFill(RectLayer rect)
        => rect.Gradient is not null || ColourParser.TryParse(rect.Fill, out _);

    /// <summary>A missing dimension means "the whole canvas" - that is what a scrim is.</summary>
    private static (float X, float Y, float Width, float Height) Layout(RectLayer rect, LayerRenderContext context)
    {
        var width = rect.Size.Width ?? context.Template.Canvas.Width;
        var height = rect.Size.Height ?? context.Template.Canvas.Height;
        var (x, y) = AnchorMath.ToTopLeft(context.PositionOf(rect), width, height);

        return (x, y, width, height);
    }

    private static LinearGradientBrush BuildGradientBrush(Gradient gradient, float x, float y, float width, float height)
    {
        var from = ColourParser.ParseOrDefault(gradient.From, Color.Black);
        var to = ColourParser.ParseOrDefault(gradient.To, Color.Transparent);

        // CSS convention: 180 degrees runs top to bottom. Project the angle across the box so the
        // gradient spans it whatever its aspect ratio.
        var radians = (gradient.Angle - 90f) * MathF.PI / 180f;
        var centreX = x + width / 2f;
        var centreY = y + height / 2f;
        var reach = (MathF.Abs(MathF.Cos(radians)) * width + MathF.Abs(MathF.Sin(radians)) * height) / 2f;

        var start = new PointF(centreX - MathF.Cos(radians) * reach, centreY - MathF.Sin(radians) * reach);
        var end = new PointF(centreX + MathF.Cos(radians) * reach, centreY + MathF.Sin(radians) * reach);

        return new LinearGradientBrush(
            start,
            end,
            GradientRepetitionMode.None,
            new ColorStop(0f, from),
            new ColorStop(1f, to));
    }
}
