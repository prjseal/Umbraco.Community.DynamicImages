using SixLabors.ImageSharp;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// No image sources, so a test needs no media library and no web root. Shared: three suites want
/// the same nothing, and a third copy is where the copies start to disagree.
/// </summary>
internal sealed class NoImages : IImageSourceProvider
{
    public Task<Image?> LoadAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
        => Task.FromResult<Image?>(null);

    public Task<bool> ExistsAsync(ImageSource? source, CancellationToken cancellationToken = default)
        => Task.FromResult(false);

    public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, CancellationToken cancellationToken = default)
        => Task.FromResult<(int, int)?>(null);

    public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
        => Task.FromResult<(int, int)?>(null);
}
