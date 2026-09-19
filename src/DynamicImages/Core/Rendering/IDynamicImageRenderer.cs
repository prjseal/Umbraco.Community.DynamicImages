using SixLabors.ImageSharp;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>A render, plus what each layer occupied.</summary>
public sealed record RenderResult(Image Image, IReadOnlyList<LayerBounds> Bounds) : IDisposable
{
    public void Dispose() => Image.Dispose();
}

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
}
