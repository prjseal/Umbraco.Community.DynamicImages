using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering.Layers;

public sealed class TextLayerRenderer(IFontRegistry fontRegistry, ILogger<TextLayerRenderer> logger) : ILayerRenderer
{
    public Type LayerType => typeof(TextLayer);

    public async Task<LayerBounds?> RenderAsync(Image image, LayerBase layer, LayerRenderContext context)
    {
        if (layer is not TextLayer text) return null;

        var layout = await LayoutAsync(text, context);
        if (layout is null) return null;

        var colour = ColourParser.ParseOrDefault(text.Style.Colour, Color.White);

        var drawingOptions = new DrawingOptions
        {
            GraphicsOptions = new GraphicsOptions
            {
                Antialias = true,
                BlendPercentage = Math.Clamp(text.Opacity, 0f, 1f)
            }
        };

        // ImageSharp composes this transform into every glyph and decoration outline, and the
        // origin is the anchor point, so a rotation about that point spins the block in place -
        // no change to the layout, the wrapping or the reported box.
        if (text.Rotation != 0)
        {
            drawingOptions.Transform = RotationMath.Matrix(layout.Bounds.PivotX, layout.Bounds.PivotY, text.Rotation);
        }

        image.Mutate(ctx => ctx.DrawText(drawingOptions, layout.Options, layout.Fitted.Text, new SolidBrush(colour), pen: null));

        return layout.Bounds;
    }

    public async Task<LayerBounds?> MeasureAsync(LayerBase layer, LayerRenderContext context)
        => layer is TextLayer text ? (await LayoutAsync(text, context))?.Bounds : null;

    /// <summary>The fitted text, the options it is drawn with, and the box it occupies.</summary>
    private sealed record TextLayout(FittedText Fitted, RichTextOptions Options, LayerBounds Bounds);

    /// <summary>
    /// Everything up to, but not including, putting pixels down. Both <see cref="RenderAsync"/>
    /// and <see cref="MeasureAsync"/> go through here, so a measured layer cannot land somewhere
    /// other than where it draws.
    /// </summary>
    private async Task<TextLayout?> LayoutAsync(TextLayer text, LayerRenderContext context)
    {
        var resolved = BuildText(text, context.Values);
        if (string.IsNullOrWhiteSpace(resolved))
        {
            context.Skip(text.Key, LayerSkipReasons.EmptyText);
            return null;
        }

        // Clamped, not refused: an absurd point size is a slip in the designer, and the cap keeps
        // the glyph cache and the rasteriser inside what a canvas this size could ever show.
        var fontSize = Math.Clamp(text.Style.FontSize, 1f, RenderLimits.MaxFontSize);

        var font = await fontRegistry.GetFontAsync(
            text.Style.FontKey, fontSize, text.Style.FontStyle, context.CancellationToken);

        if (font is null)
        {
            // A missing font is reported by the health check and surfaced in validation; a publish
            // should not fail over it, so the layer is skipped.
            logger.LogWarning("Dynamic Images: text layer '{Layer}' skipped - font {FontKey} is unavailable", text.Name, text.Style.FontKey);
            context.Skip(text.Key, LayerSkipReasons.NoFont);
            return null;
        }

        var fitted = TextFitting.Fit(resolved, font, text.Style, text.Size.Width);
        var drawFont = Math.Abs(fitted.FontSize - font.Size) < 0.01f
            ? font
            : new Font(font.Family, fitted.FontSize, TextFitting.StyleOf(font));

        // The resolved position, never text.Position: when an axis tracks another layer this is
        // where the layer actually goes, and the anchor component on that axis is the tracked edge.
        var position = context.PositionOf(text);

        var options = new RichTextOptions(drawFont)
        {
            // Origin is the anchor point itself; the alignments below tell ImageSharp which corner
            // of the text block to put there, which is exactly the anchor contract.
            Origin = new PointF(position.X, position.Y),
            WrappingLength = text.Size.Width ?? -1,
            HorizontalAlignment = AnchorMath.ToHorizontalAlignment(position.Anchor),
            VerticalAlignment = AnchorMath.ToVerticalAlignment(position.Anchor),
            TextAlignment = AnchorMath.ToTextAlignment(text.Style.TextAlign),
            LineSpacing = text.Style.LineSpacing <= 0 ? 1f : text.Style.LineSpacing
        };

        if (Math.Abs(text.Style.LetterSpacing) > 0.001f)
        {
            // SixLabors expresses tracking as a proportion of the em, where the design (and CSS)
            // uses absolute pixels.
            options.TextRuns =
            [
                new RichTextRun { Start = 0, End = fitted.Text.Length, TextAttributes = TextAttributes.None }
            ];
            options.KerningMode = KerningMode.Standard;
        }

        // The reported box is the layout box, not the ink: MeasureAdvance gives the line boxes
        // (the same height for "Hello" and "gyp"), which is what a layer tracking this one should
        // hang off, and what the designer's DOM box shows. ImageSharp aligns that block around
        // Origin by the same factors the anchor maths uses, so the corner follows from them - the
        // measurement itself is reported at (0, 0) whatever the origin.
        var advance = TextMeasurer.MeasureAdvance(fitted.Text, options);
        var width = text.Size.Width ?? advance.Width;
        var height = text.Size.Height ?? advance.Height;
        var (left, top) = AnchorMath.ToTopLeft(position, width, height);

        var bounds = new LayerBounds(
            text.Key,
            left,
            top,
            width,
            height,
            fitted.LineCount,
            fitted.Truncated,
            fitted.Text,
            text.Rotation,
            position.X,
            position.Y);

        return new TextLayout(fitted, options, bounds);
    }

    /// <summary>Binding + prefix/suffix + transform, in that order. Public so the layout endpoint can reuse it.</summary>
    public static string BuildText(TextLayer layer, IRenderValueSource values)
    {
        var value = TextResolver.Resolve(layer.Binding, values);

        // An empty binding means the whole layer is absent - prefix and suffix on their own are
        // decoration, not content, so they are not drawn alone.
        if (string.IsNullOrWhiteSpace(value)) return string.Empty;

        var combined = $"{layer.Prefix}{value}{layer.Suffix}";
        return TextFitting.ApplyTransform(combined, layer.Style.TextTransform);
    }
}
