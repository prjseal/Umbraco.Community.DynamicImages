using System.Numerics;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// A gradient brush whose position on the gradient is any function of the point, worked out in
/// the box's own coordinates. ImageSharp ships linear, radial and elliptic brushes; the angular
/// and diamond gradients art programs offer are this, with <see cref="GradientGeometry"/>'s
/// formulas - the same ones the designer's CSS preview is built from.
/// <para>
/// The point arrives in canvas pixels, so it is taken back through the inverse of the layer's
/// transform first: the gradient turns with the shape, exactly as the linear and radial ones do.
/// Colours are interpolated between the neighbouring stops the way ImageSharp's own gradient
/// brushes do it, and blended through the options' blender, so a shape's opacity and the layer
/// compositing behave as they do for every other brush.
/// </para>
/// </summary>
internal sealed class PositionGradientBrush(
    Func<float, float, float> positionInBox,
    Matrix3x2 inverseTransform,
    ColorStop[] stops) : Brush
{
    private readonly (float Position, Vector4 Colour)[] _stops = stops
        .OrderBy(stop => stop.Ratio)
        .Select(stop => (stop.Ratio, stop.Color.ToPixel<RgbaVector>().ToVector4()))
        .ToArray();

    public override BrushApplicator<TPixel> CreateApplicator<TPixel>(
        SixLabors.ImageSharp.Configuration configuration, GraphicsOptions options, ImageFrame<TPixel> source, RectangleF region)
        => new Applicator<TPixel>(configuration, options, source, this);

    public override bool Equals(Brush? other) => ReferenceEquals(this, other);

    public override int GetHashCode() => System.Runtime.CompilerServices.RuntimeHelpers.GetHashCode(this);

    /// <summary>The colour at a position on the gradient: the last stop past either end.</summary>
    internal Vector4 ColourAt(float position)
    {
        if (_stops.Length == 0) return Vector4.Zero;
        if (position <= _stops[0].Position) return _stops[0].Colour;

        for (var index = 1; index < _stops.Length; index++)
        {
            var (to, toColour) = _stops[index];
            if (position > to) continue;

            var (from, fromColour) = _stops[index - 1];
            var span = to - from;
            return span <= 0f ? toColour : Vector4.Lerp(fromColour, toColour, (position - from) / span);
        }

        return _stops[^1].Colour;
    }

    internal float PositionAt(float x, float y)
    {
        // Pixel centres, as the built-in brushes sample them.
        var point = Vector2.Transform(new Vector2(x + 0.5f, y + 0.5f), inverseTransform);
        return Math.Clamp(positionInBox(point.X, point.Y), 0f, 1f);
    }

    private sealed class Applicator<TPixel>(
        SixLabors.ImageSharp.Configuration configuration, GraphicsOptions options, ImageFrame<TPixel> target,
        PositionGradientBrush brush)
        : BrushApplicator<TPixel>(configuration, options, target)
        where TPixel : unmanaged, IPixel<TPixel>
    {
        public override void Apply(Span<float> scanline, int x, int y)
        {
            var length = Math.Min(scanline.Length, Target.Width - x);
            if (length <= 0 || y < 0 || y >= Target.Height) return;

            var overlays = new TPixel[length];
            var amounts = new float[length];

            for (var index = 0; index < length; index++)
            {
                var pixel = default(TPixel);
                pixel.FromVector4(brush.ColourAt(brush.PositionAt(x + index, y)));
                overlays[index] = pixel;
                amounts[index] = Math.Clamp(scanline[index] * Options.BlendPercentage, 0f, 1f);
            }

            var blender = PixelOperations<TPixel>.Instance.GetPixelBlender(Options);

            Target.ProcessPixelRows(accessor =>
            {
                var row = accessor.GetRowSpan(y).Slice(x, length);
                blender.Blend(Configuration, row, row, overlays, amounts);
            });
        }
    }
}
