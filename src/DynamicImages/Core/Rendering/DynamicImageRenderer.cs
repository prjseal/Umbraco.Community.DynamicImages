using System.Numerics;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

public sealed class DynamicImageRenderer(
    LayerRendererCollection renderers,
    IImageSourceProvider imageSources,
    RenderGate gate,
    ILogger<DynamicImageRenderer> logger) : IDynamicImageRenderer
{
    public async Task<RenderResult> RenderAsync(Template template, IRenderValueSource values, CancellationToken cancellationToken = default)
    {
        // Checked before the gate is taken and before a single byte is allocated: a template
        // asking for a 30000x30000 canvas should cost a comparison, not a queue slot.
        EnforceLimits(template);

        var width = template.Canvas.Width;
        var height = template.Canvas.Height;

        // Held for the whole render, so N concurrent previews queue instead of allocating N
        // canvases. Released by the outer using even when a layer throws.
        using var slot = await gate.EnterAsync(cancellationToken);

        var image = CreateCanvas(template.Canvas, width, height);

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

                var blocked = NotDrawnReason(layer, values);
                if (blocked is not null)
                {
                    context.Skip(layer.Key, blocked);
                    continue;
                }

                var renderer = renderers.For(layer);
                if (renderer is null)
                {
                    logger.LogWarning("Dynamic Images: no renderer is registered for layer type '{Type}'", layer.TypeAlias);
                    context.Skip(layer.Key, LayerSkipReasons.NoRenderer);
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
                    else
                    {
                        // The renderer usually knows better and has already said so; this is the
                        // fallback for one that returned null without a reason.
                        context.Skip(layer.Key, LayerSkipReasons.ProducedNothing);
                    }
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    // One broken layer should cost that layer, not the whole image - a publish
                    // depends on this call.
                    logger.LogError(ex, "Dynamic Images: layer '{Layer}' ({Type}) failed to render in template '{Template}'",
                        layer.Name, layer.TypeAlias, template.Alias);

                    context.Skip(layer.Key, LayerSkipReasons.Failed);
                }
            }

            return new RenderResult(image, bounds, context.Skips);
        }
        catch
        {
            image.Dispose();
            throw;
        }
    }

    public async Task<IReadOnlyList<LayerBounds>> MeasureAsync(Template template, IRenderValueSource values, CancellationToken cancellationToken = default)
        => (await MeasureLayoutAsync(template, values, cancellationToken)).Bounds;

    public async Task<LayoutResult> MeasureLayoutAsync(Template template, IRenderValueSource values, CancellationToken cancellationToken = default)
    {
        // Measuring means laying out, and layout is what the renderers do - so this renders into a
        // throwaway surface and keeps only the bounds. Cheap enough at OG sizes, and it cannot
        // drift from what a real render produces.
        using var result = await RenderAsync(template, values, cancellationToken);
        return new LayoutResult(result.Bounds, result.Skips);
    }

    /// <summary>
    /// The hard ceilings, applied to every caller alike. The validator reports the same limits
    /// when a template is saved, but a preview is rendered from a posted body that was never
    /// saved, so the renderer is the only place that can actually enforce them.
    /// </summary>
    private static void EnforceLimits(Template template)
    {
        if (RenderLimits.CanvasProblem(template.Canvas.Width, template.Canvas.Height) is { } problem)
        {
            throw new RenderLimitException(problem);
        }

        if (template.Layers.Count > RenderLimits.MaxLayers)
        {
            throw new RenderLimitException(
                $"A template may have at most {RenderLimits.MaxLayers} layers; this one has {template.Layers.Count}.");
        }
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

    /// <summary>
    /// A solid background is still the pixel the buffer is created with - it is one allocation and
    /// no pass. A gradient has no single pixel to seed with, so the buffer starts transparent and
    /// takes a fill. The brush spans the whole canvas, untransformed: the canvas never rotates.
    /// </summary>
    private static Image<Rgba32> CreateCanvas(CanvasSettings canvas, int width, int height)
    {
        if (canvas.BackgroundGradient is null)
        {
            var background = ColourParser.ParseOrDefault(canvas.Background, Color.Transparent);
            return new Image<Rgba32>(width, height, background.ToPixel<Rgba32>());
        }

        var image = new Image<Rgba32>(width, height);
        var brush = GradientBrushes.Build(canvas.BackgroundGradient, 0, 0, width, height, Matrix3x2.Identity);
        image.Mutate(ctx => ctx.Fill(brush));
        return image;
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
        => NotDrawnReason(layer, values) is null;

    /// <summary>
    /// Why this layer will not be drawn at all, or null when it will be attempted. Returning the
    /// reason rather than a bool is what lets the designer explain a missing layer instead of
    /// silently omitting its row.
    /// </summary>
    private static string? NotDrawnReason(LayerBase layer, IRenderValueSource values)
    {
        if (!layer.IsVisible) return LayerSkipReasons.Hidden;
        if (layer.Opacity <= 0) return LayerSkipReasons.Transparent;

        return layer.Visibility.Rule switch
        {
            // WhenNotEmpty needs no check here: every renderer already returns null for an empty
            // value, so the rule is about being explicit in the UI rather than a second code path.
            VisibilityRuleKind.WhenPropertyTruthy when
                string.IsNullOrWhiteSpace(layer.Visibility.PropertyAlias) || !values.IsTruthy(layer.Visibility.PropertyAlias)
                => LayerSkipReasons.VisibilityRule,

            _ => null
        };
    }
}
