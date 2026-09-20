using SixLabors.ImageSharp;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>A render, plus what each layer occupied - and why the others did not.</summary>
public sealed record RenderResult(Image Image, IReadOnlyList<LayerBounds> Bounds, IReadOnlyList<LayerSkip> Skips) : IDisposable
{
    public RenderResult(Image image, IReadOnlyList<LayerBounds> bounds) : this(image, bounds, []) { }

    public void Dispose() => Image.Dispose();
}

/// <summary>What a measure pass found: the bounds that drew, and the reasons the rest did not.</summary>
public sealed record LayoutResult(IReadOnlyList<LayerBounds> Bounds, IReadOnlyList<LayerSkip> Skips);

/// <summary>
/// Composites a template into an image. The template is a parameter rather than a lookup, which
/// is what lets the designer preview a candidate that has not been saved.
/// </summary>
public interface IDynamicImageRenderer
{
    Task<RenderResult> RenderAsync(Template template, IRenderValueSource values, CancellationToken cancellationToken = default);

    /// <summary>
    /// Measures the layers without producing an image, for the designer's ground-truth overlay
    /// and resolved-values table.
    /// </summary>
    Task<IReadOnlyList<LayerBounds>> MeasureAsync(Template template, IRenderValueSource values, CancellationToken cancellationToken = default);

    /// <summary>
    /// The same measure pass, but also reporting why each layer that drew nothing did not - which
    /// is what lets the designer render a row per layer rather than silently dropping the ones
    /// that resolved to nothing.
    /// </summary>
    Task<LayoutResult> MeasureLayoutAsync(Template template, IRenderValueSource values, CancellationToken cancellationToken = default);
}
