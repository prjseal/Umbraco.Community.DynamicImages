using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>What a layer occupied once it was drawn, for the designer's ground-truth overlay.</summary>
public sealed record LayerBounds(
    Guid LayerKey,
    float X,
    float Y,
    float Width,
    float Height,
    int Lines,
    bool Truncated,
    string? ResolvedText);

/// <summary>Everything a layer renderer needs that is not the layer itself.</summary>
public sealed class LayerRenderContext
{
    private readonly Dictionary<Guid, LayerBounds> _bounds = [];
    private readonly IReadOnlyDictionary<Guid, LayerBase> _layersByKey;

    public LayerRenderContext(Template template, IRenderValueSource values, CancellationToken cancellationToken)
    {
        Template = template;
        Values = values;
        CancellationToken = cancellationToken;
        _layersByKey = RelativeLayout.Index(template);
    }

    public Template Template { get; }

    public IRenderValueSource Values { get; }

    public CancellationToken CancellationToken { get; }

    /// <summary>The bounds known so far, by layer key - measured before the draw pass or drawn during it.</summary>
    public IReadOnlyDictionary<Guid, LayerBounds> Bounds => _bounds;

    /// <summary>Records where a layer landed, so layers that track it can be resolved.</summary>
    public void Set(LayerBounds bounds) => _bounds[bounds.LayerKey] = bounds;

    /// <summary>The bounds of a layer, or null when it has not drawn (or been measured) yet.</summary>
    public LayerBounds? BoundsOf(Guid layerKey) => _bounds.GetValueOrDefault(layerKey);

    /// <summary>
    /// Where the layer goes: its own position, or - when an axis tracks another layer - the
    /// position resolved from that layer's bounds. Renderers read this instead of
    /// <c>layer.Position</c>, which is the only change relative positioning asks of them.
    /// </summary>
    public Position PositionOf(LayerBase layer)
        => layer.Position.IsRelative ? RelativeLayout.Resolve(layer, _layersByKey, BoundsOf) : layer.Position;
}

/// <summary>
/// Draws one kind of layer. Adding a layer type is implementing this and registering it in the
/// <see cref="LayerRendererCollection"/> - which is also how a consuming site can add its own.
/// </summary>
public interface ILayerRenderer
{
    /// <summary>The layer type this renderer handles.</summary>
    Type LayerType { get; }

    /// <summary>
    /// Draws the layer onto the image and reports what it covered. Returning null means nothing
    /// was drawn (an empty value, a visibility rule, a missing asset) - never an exception.
    /// </summary>
    Task<LayerBounds?> RenderAsync(Image image, LayerBase layer, LayerRenderContext context);

    /// <summary>
    /// Reports what <see cref="RenderAsync"/> would cover without producing pixels. The renderer
    /// calls this for every layer another layer is positioned relative to, before the draw pass.
    /// The default renders into a scratch image and keeps the bounds, so an existing renderer
    /// keeps working unchanged; the built-in renderers override it with the size maths alone.
    /// </summary>
    async Task<LayerBounds?> MeasureAsync(LayerBase layer, LayerRenderContext context)
    {
        using var scratch = new Image<Rgba32>(
            Math.Max(1, context.Template.Canvas.Width),
            Math.Max(1, context.Template.Canvas.Height));

        return await RenderAsync(scratch, layer, context);
    }
}
