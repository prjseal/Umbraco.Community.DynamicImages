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

        // The header first: decoding a 20000x20000 source costs as much as allocating a canvas
        // that size, so the ceiling has to be applied before the bytes are turned into pixels.
        var natural = await imageSources.GetDimensionsAsync(imageLayer.Source, context.Values, context.CancellationToken);
        if (natural is { } size && (long)size.Width * size.Height > RenderLimits.MaxSourcePixels)
        {
            context.Skip(imageLayer.Key, LayerSkipReasons.TooLarge);
            return null;
        }

        using var overlay = await imageSources.LoadAsync(imageLayer.Source, context.Values, context.CancellationToken);
        if (overlay is null)
        {
            context.Skip(imageLayer.Key, LayerSkipReasons.NoImage);
            return null;
        }

        var requested = Size(imageLayer, overlay.Width, overlay.Height, context);
        if (requested is null)
        {
            context.Skip(imageLayer.Key, LayerSkipReasons.ZeroSize);
            return null;
        }

        var (width, height) = requested.Value;

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

        var position = context.PositionOf(imageLayer);
        var (x, y) = AnchorMath.ToTopLeft(position, width, height);

        // A rotated overlay is turned as a whole - corners and border included - and its centre
        // put where the unrotated box's centre lands once turned about the pivot. Rotate grows
        // the overlay to the rotated bounding box, which is what makes "place the centre" right.
        var (drawX, drawY) = (x, y);
        if (imageLayer.Rotation != 0)
        {
            overlay.Mutate(ctx => ctx.Rotate(imageLayer.Rotation));
            var (centreX, centreY) = RotationMath.RotatePoint(x + width / 2f, y + height / 2f, position.X, position.Y, imageLayer.Rotation);
            drawX = centreX - overlay.Width / 2f;
            drawY = centreY - overlay.Height / 2f;
        }

        image.Mutate(ctx => ctx.DrawImage(
            overlay,
            new Point((int)Math.Round(drawX), (int)Math.Round(drawY)),
            Math.Clamp(imageLayer.Opacity, 0f, 1f)));

        return new LayerBounds(imageLayer.Key, x, y, width, height, 0, false, null, imageLayer.Rotation, position.X, position.Y);
    }

    public async Task<LayerBounds?> MeasureAsync(LayerBase layer, LayerRenderContext context)
    {
        if (layer is not ImageLayer imageLayer) return null;

        // Reading the header is enough for the size, and it doubles as the existence check that
        // makes a missing image measure as nothing, exactly as it renders as nothing.
        var natural = await imageSources.GetDimensionsAsync(imageLayer.Source, context.Values, context.CancellationToken);
        if (natural is null)
        {
            context.Skip(imageLayer.Key, LayerSkipReasons.NoImage);
            return null;
        }

        if ((long)natural.Value.Width * natural.Value.Height > RenderLimits.MaxSourcePixels)
        {
            context.Skip(imageLayer.Key, LayerSkipReasons.TooLarge);
            return null;
        }

        var requested = Size(imageLayer, natural.Value.Width, natural.Value.Height, context);
        if (requested is null)
        {
            context.Skip(imageLayer.Key, LayerSkipReasons.ZeroSize);
            return null;
        }

        var (width, height) = requested.Value;

        var position = context.PositionOf(imageLayer);
        var (x, y) = AnchorMath.ToTopLeft(position, width, height);

        return new LayerBounds(imageLayer.Key, x, y, width, height, 0, false, null, imageLayer.Rotation, position.X, position.Y);
    }

    /// <summary>
    /// The size the overlay is drawn at: the layer's own, falling back to the image's natural
    /// size, clamped to <see cref="RenderLimits.MaxOverlaySide"/>. Null when it comes out at zero.
    /// <para>
    /// Clamped rather than refused, because an overlay larger than twice the canvas is off the
    /// edge in every direction: the drawn result is the same and the allocation is not. It is
    /// applied here, shared by both entry points, so that what is measured stays what is drawn -
    /// a clamped layer reports the clamped box, not the one that was asked for.
    /// </para>
    /// </summary>
    private static (int Width, int Height)? Size(ImageLayer layer, int naturalWidth, int naturalHeight, LayerRenderContext context)
    {
        var width = (int)Math.Round(layer.Size.Width ?? naturalWidth);
        var height = (int)Math.Round(layer.Size.Height ?? naturalHeight);
        if (width <= 0 || height <= 0) return null;

        var maxSide = RenderLimits.MaxOverlaySide(context.Template.Canvas.Width, context.Template.Canvas.Height);
        return (Math.Min(width, maxSide), Math.Min(height, maxSide));
    }
}
