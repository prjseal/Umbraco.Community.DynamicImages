// Rounded-corner masking adapted from the Six Labors sample:
// https://github.com/SixLabors/Samples/blob/main/ImageSharp/AvatarWithRoundedCorner/Program.cs
// Licensed under the Apache License, Version 2.0.

using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Umbraco.Community.DynamicImages.Extensions;

public static class ImageProcessingContextExtensions
{
    /// <summary>
    /// Cuts rounded corners out of the current image by erasing the four corner wedges.
    /// Unlike v1's ConvertToAvatar this does not also resize or fill with a colour - the image
    /// layer renderer has already sized the overlay, and filling meant the corners came back
    /// opaque black over anything but a black background.
    /// </summary>
    public static IImageProcessingContext ApplyRoundedCorners(this IImageProcessingContext ctx, float cornerRadius)
    {
        var size = ctx.GetCurrentSize();
        var corners = BuildCorners(size.Width, size.Height, cornerRadius);

        return ctx.Fill(
            new DrawingOptions
            {
                GraphicsOptions = new GraphicsOptions
                {
                    Antialias = true,
                    // Erase rather than paint: the corners become transparent, so whatever the
                    // layer is drawn over shows through.
                    AlphaCompositionMode = PixelAlphaCompositionMode.DestOut
                }
            },
            Color.Black,
            corners);
    }

    private static IPathCollection BuildCorners(int imageWidth, int imageHeight, float cornerRadius)
    {
        cornerRadius = MathF.Min(cornerRadius, MathF.Min(imageWidth, imageHeight) / 2f);

        var rect = new RectangularPolygon(-0.5f, -0.5f, cornerRadius, cornerRadius);
        var cornerTopLeft = rect.Clip(new EllipsePolygon(cornerRadius - 0.5f, cornerRadius - 0.5f, cornerRadius));

        var rightPos = imageWidth - cornerTopLeft.Bounds.Width + 1;
        var bottomPos = imageHeight - cornerTopLeft.Bounds.Height + 1;

        return new PathCollection(
            cornerTopLeft,
            cornerTopLeft.RotateDegree(-90).Translate(0, bottomPos),
            cornerTopLeft.RotateDegree(90).Translate(rightPos, 0),
            cornerTopLeft.RotateDegree(180).Translate(rightPos, bottomPos));
    }
}
