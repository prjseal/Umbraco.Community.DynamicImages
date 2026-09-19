using SixLabors.ImageSharp;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;

namespace Umbraco.Community.DynamicImages.Core.Media;

/// <summary>Loads the bitmap behind an <see cref="ImageSource"/>, whatever kind it is.</summary>
public interface IImageSourceProvider
{
    /// <summary>The image, or null when the source is empty or cannot be read. The caller disposes it.</summary>
    Task<Image?> LoadAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default);

    /// <summary>Whether the source points at something that exists - used by the health check.</summary>
    Task<bool> ExistsAsync(ImageSource? source, CancellationToken cancellationToken = default);

    /// <summary>The pixel dimensions of a source, without decoding the whole image.</summary>
    Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, CancellationToken cancellationToken = default);

    /// <summary>
    /// The pixel dimensions of a source that may read a property of the node being rendered,
    /// so a layer's natural size can be measured without loading the whole image.
    /// </summary>
    Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default);
}
