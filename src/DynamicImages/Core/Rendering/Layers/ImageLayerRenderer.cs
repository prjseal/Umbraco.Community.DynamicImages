using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Extensions;

namespace Umbraco.Community.DynamicImages.Core.Rendering.Layers;

public sealed class ImageLayerRenderer(IImageSourceProvider imageSources) : ILayerRenderer
{
    public Type LayerType => typeof(ImageLayer);

    public async Task<LayerBounds?> RenderAsync(Image image, LayerBase layer, LayerRenderContext context)
    {
        if (layer is not ImageLayer imageLayer) return null;

        using var overlay = await imageSources.LoadAsync(imageLayer.Source, context.Values, context.CancellationToken);
        if (overlay is null) return null;

        var width = (int)Math.Round(imageLayer.Size.Width ?? overlay.Width);
        var height = (int)Math.Round(imageLayer.Size.Height ?? overlay.Height);
        if (width <= 0 || height <= 0) return null;

        overlay.Mutate(ctx => ctx.Resize(new ResizeOptions
        {
            Size = new Size(width, height),
            Mode = imageLayer.Fit switch
            {
                ImageFit.Contain => ResizeMode.Pad,
                ImageFit.Stretch => ResizeMode.Stretch,
                _ => ResizeMode.Crop
            },
            PadColor = Color.Transparent
        }));

        if (imageLayer.CornerRadius > 0)
        {
            overlay.Mutate(ctx => ctx.ApplyRoundedCorners(imageLayer.CornerRadius));
        }

        if (imageLayer.Border is { Width: > 0 } border && ColourParser.TryParse(border.Colour, out var borderColour))
        {
            var inset = border.Width / 2f;
            var outline = imageLayer.CornerRadius > 0
                ? RoundedRectangle.Build(inset, inset, overlay.Width - border.Width, overlay.Height - border.Width, imageLayer.CornerRadius)
                : RoundedRectangle.Build(inset, inset, overlay.Width - border.Width, overlay.Height - border.Width, 0);

            overlay.Mutate(ctx => ctx.Draw(new SolidPen(borderColour, border.Width), outline));
        }

        var (x, y) = AnchorMath.ToTopLeft(context.PositionOf(imageLayer), width, height);

        image.Mutate(ctx => ctx.DrawImage(
            overlay,
            new Point((int)Math.Round(x), (int)Math.Round(y)),
            Math.Clamp(imageLayer.Opacity, 0f, 1f)));

        return new LayerBounds(imageLayer.Key, x, y, width, height, 0, false, null);
    }

    public async Task<LayerBounds?> MeasureAsync(LayerBase layer, LayerRenderContext context)
    {
        if (layer is not ImageLayer imageLayer) return null;

        // Reading the header is enough for the size, and it doubles as the existence check that
        // makes a missing image measure as nothing, exactly as it renders as nothing.
        var natural = await imageSources.GetDimensionsAsync(imageLayer.Source, context.Values, context.CancellationToken);
        if (natural is null) return null;

        var width = (int)Math.Round(imageLayer.Size.Width ?? natural.Value.Width);
        var height = (int)Math.Round(imageLayer.Size.Height ?? natural.Value.Height);
        if (width <= 0 || height <= 0) return null;

        var (x, y) = AnchorMath.ToTopLeft(context.PositionOf(imageLayer), width, height);

        return new LayerBounds(imageLayer.Key, x, y, width, height, 0, false, null);
    }
}
