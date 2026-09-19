using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

public sealed class DynamicImageRenderer(
    LayerRendererCollection renderers,
    IImageSourceProvider imageSources,
    ILogger<DynamicImageRenderer> logger) : IDynamicImageRenderer
{
    public async Task<RenderResult> RenderAsync(Template template, IRenderValueSource values, CancellationToken cancellationToken = default)
    {
        var width = Math.Max(1, template.Canvas.Width);
        var height = Math.Max(1, template.Canvas.Height);

        var background = ColourParser.ParseOrDefault(template.Canvas.Background, Color.Transparent);
        var image = new Image<Rgba32>(width, height, background.ToPixel<Rgba32>());

        try
        {
            await DrawBaseImageAsync(image, template, values, cancellationToken);

            var bounds = new List<LayerBounds>(template.Layers.Count);
            var context = new LayerRenderContext(template, values, cancellationToken);

            if (RelativeLayout.IsUsed(template))
            {
                await MeasureReferencesAsync(template, values, context);
            }

            // Array order is z-order: index 0 is the bottom layer.
            foreach (var layer in template.Layers)
            {
                cancellationToken.ThrowIfCancellationRequested();

                if (!ShouldDraw(layer, values)) continue;

                var renderer = renderers.For(layer);
                if (renderer is null)
                {
                    logger.LogWarning("Dynamic Images: no renderer is registered for layer type '{Type}'", layer.TypeAlias);
                    continue;
                }

                try
                {
                    var layerBounds = await renderer.RenderAsync(image, layer, context);
                    if (layerBounds is not null)
                    {
                        bounds.Add(layerBounds);
                        // Later layers that track this one use the drawn result, not the measurement.
                        context.Set(layerBounds);
                    }
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    // One broken layer should cost that layer, not the whole image - a publish
                    // depends on this call.
                    logger.LogError(ex, "Dynamic Images: layer '{Layer}' ({Type}) failed to render in template '{Template}'",
                        layer.Name, layer.TypeAlias, template.Alias);
                }
            }

            return new RenderResult(image, bounds);
        }
        catch
        {
            image.Dispose();
            throw;
        }
    }

    public async Task<IReadOnlyList<LayerBounds>> MeasureAsync(Template template, IRenderValueSource values, CancellationToken cancellationToken = default)
    {
        // Measuring means laying out, and layout is what the renderers do - so this renders into a
        // throwaway surface and keeps only the bounds. Cheap enough at OG sizes, and it cannot
        // drift from what a real render produces.
        using var result = await RenderAsync(template, values, cancellationToken);
        return result.Bounds;
    }

    /// <summary>
    /// Lays out every layer another layer is positioned relative to, references first, so a
    /// reference can sit anywhere in z-order - a scrim under a label that tracks the label is the
    /// first thing people try. A reference that would not draw gets no bounds, which is what sends
    /// its trackers on up the chain.
    /// </summary>
    private async Task MeasureReferencesAsync(Template template, IRenderValueSource values, LayerRenderContext context)
    {
        foreach (var layer in RelativeLayout.MeasureOrder(template))
        {
            context.CancellationToken.ThrowIfCancellationRequested();

            if (!ShouldDraw(layer, values)) continue;

            var renderer = renderers.For(layer);
            if (renderer is null) continue;

            try
            {
                var measured = await renderer.MeasureAsync(layer, context);
                if (measured is not null) context.Set(measured);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogError(ex, "Dynamic Images: layer '{Layer}' ({Type}) failed to measure in template '{Template}'",
                    layer.Name, layer.TypeAlias, template.Alias);
            }
        }
    }

    private async Task DrawBaseImageAsync(Image canvas, Template template, IRenderValueSource values, CancellationToken cancellationToken)
    {
        using var baseImage = await imageSources.LoadAsync(template.Canvas.BaseImage, values, cancellationToken);
        if (baseImage is null) return;

        baseImage.Mutate(ctx => ctx.Resize(new ResizeOptions
        {
            Size = new Size(canvas.Width, canvas.Height),
            Mode = template.Canvas.BaseImageFit switch
            {
                ImageFitMode.Contain => ResizeMode.Pad,
                ImageFitMode.Stretch => ResizeMode.Stretch,
                _ => ResizeMode.Crop
            },
            PadColor = Color.Transparent
        }));

        canvas.Mutate(ctx => ctx.DrawImage(baseImage, new Point(0, 0), 1f));
    }

    private static bool ShouldDraw(LayerBase layer, IRenderValueSource values)
    {
        if (!layer.IsVisible || layer.Opacity <= 0) return false;

        return layer.Visibility.Rule switch
        {
            // WhenNotEmpty needs no check here: every renderer already returns null for an empty
            // value, so the rule is about being explicit in the UI rather than a second code path.
            VisibilityRuleKind.WhenPropertyTruthy =>
                !string.IsNullOrWhiteSpace(layer.Visibility.PropertyAlias) && values.IsTruthy(layer.Visibility.PropertyAlias),

            _ => true
        };
    }
}
