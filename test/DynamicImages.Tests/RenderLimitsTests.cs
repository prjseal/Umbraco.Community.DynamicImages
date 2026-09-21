using Microsoft.Extensions.Logging.Abstractions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Community.DynamicImages.Core.Rendering.Layers;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The ceilings the renderer holds every template to. The point of these is that they bite
/// <i>before</i> the allocation: a preview endpoint takes a template body that was never saved,
/// so the validator cannot be the guard and the renderer has to be.
/// </summary>
public class RenderLimitsTests
{
    // The fake goes to the image layer only; the renderer's own provider stays NoImages, because
    // these templates have no base image and a fake standing in for one would be answering a
    // question the test is not asking.
    private static DynamicImageRenderer Renderer(IImageSourceProvider? images = null) => new(
        new LayerRendererCollection(() => [new RectLayerRenderer(), new ImageLayerRenderer(images ?? new NoImages())]),
        new NoImages(),
        new RenderGate(),
        NullLogger<DynamicImageRenderer>.Instance);

    private static Template Template(int width, int height, params LayerBase[] layers) => new()
    {
        Alias = "test",
        Name = "Test",
        Canvas = new CanvasSettings { Width = width, Height = height, Background = "#000000", BaseImage = ImageSource.None() },
        Layers = [.. layers],
    };

    private static IRenderValueSource Values() =>
        new DictionaryRenderValueSource("Node name", new Dictionary<string, string?>());

    [Theory]
    [InlineData(30000, 30000)]
    [InlineData(4097, 10)]
    [InlineData(10, 4097)]
    public async Task RenderAsync_RefusesACanvasLongerThanTheLimit(int width, int height)
    {
        var renderer = Renderer();

        var ex = await Assert.ThrowsAsync<RenderLimitException>(
            () => renderer.RenderAsync(Template(width, height), Values()));

        Assert.Contains("4096", ex.Message);
    }

    [Fact]
    public async Task RenderAsync_RefusesACanvasOverTheAreaLimitEvenWhenBothSidesFit()
    {
        // 4096x4096 is inside the per-side cap and well past the 8 megapixel area cap - 67 MB of
        // RGBA. The area limit is the one that actually bounds the allocation.
        var ex = await Assert.ThrowsAsync<RenderLimitException>(
            () => Renderer().RenderAsync(Template(4096, 4096), Values()));

        Assert.Contains("megapixel", ex.Message);
    }

    [Fact]
    public async Task RenderAsync_AllowsTheLargestCanvasTheLimitsPermit()
    {
        // 4096 x 1953 is 7,999,488 pixels: the corner of the allowed region, and it must render.
        using var result = await Renderer().RenderAsync(Template(4096, 1953), Values());

        Assert.Equal(4096, result.Image.Width);
        Assert.Equal(1953, result.Image.Height);
    }

    [Fact]
    public async Task RenderAsync_RefusesMoreLayersThanTheLimit()
    {
        var layers = Enumerable.Range(0, RenderLimits.MaxLayers + 1)
            .Select(i => (LayerBase)new RectLayer
            {
                Name = $"Rect {i}",
                Position = new Position { X = 0, Y = 0 },
                Size = new LayerSize { Width = 10, Height = 10 },
                Fill = "#FFFFFF",
            })
            .ToArray();

        var ex = await Assert.ThrowsAsync<RenderLimitException>(
            () => Renderer().RenderAsync(Template(400, 200, layers), Values()));

        Assert.Contains($"{RenderLimits.MaxLayers}", ex.Message);
    }

    [Fact]
    public async Task RenderAsync_ClampsAnOversizeOverlayToTwiceTheCanvas()
    {
        // The layer asks for 100,000 px on a 400x200 canvas. Clamped to 2 x 400 = 800, which is
        // what is reported - a measured box that lied about the drawn one would break every layer
        // positioned relative to this one.
        var layer = new ImageLayer
        {
            Name = "Photo",
            Position = new Position { X = 0, Y = 0 },
            Size = new LayerSize { Width = 100_000, Height = 100_000 },
            Source = new ImageSource { Kind = ImageSourceKind.Path, Path = "/photo.png" },
        };

        using var result = await Renderer(new OnePixel()).RenderAsync(Template(400, 200, layer), Values());

        var bounds = Assert.Single(result.Bounds);
        Assert.Equal(800, bounds.Width);
        Assert.Equal(800, bounds.Height);
    }

    [Fact]
    public async Task RenderAsync_SkipsASourceImageBiggerThanTheDecodeLimit()
    {
        var layer = new ImageLayer
        {
            Name = "Photo",
            Position = new Position { X = 0, Y = 0 },
            Source = new ImageSource { Kind = ImageSourceKind.Path, Path = "/huge.png" },
        };

        using var result = await Renderer(new HugeHeader()).RenderAsync(Template(400, 200, layer), Values());

        Assert.Empty(result.Bounds);
        var skip = Assert.Single(result.Skips);
        Assert.Equal(LayerSkipReasons.TooLarge, skip.Reason);
    }

    [Fact]
    public void CanvasProblem_AcceptsTheSizesRealTemplatesUse()
    {
        Assert.Null(RenderLimits.CanvasProblem(1200, 630));   // Open Graph
        Assert.Null(RenderLimits.CanvasProblem(1500, 500));   // Twitter header
        Assert.Null(RenderLimits.CanvasProblem(1080, 1080));  // Square
        Assert.NotNull(RenderLimits.CanvasProblem(0, 100));
    }

    [Fact]
    public async Task RenderGate_LetsOnlyAsManyThroughAsItHasPermits()
    {
        using var gate = new RenderGate(1);

        using var first = await gate.EnterAsync();
        Assert.Equal(0, gate.Available);

        var second = gate.EnterAsync();
        Assert.False(second.IsCompleted);

        first.Dispose();
        (await second).Dispose();

        Assert.Equal(1, gate.Available);
    }

    [Fact]
    public async Task RenderGate_ReleasesOnePermitHoweverOftenTheSlotIsDisposed()
    {
        using var gate = new RenderGate(1);

        var slot = await gate.EnterAsync();
        slot.Dispose();
        slot.Dispose();

        Assert.Equal(1, gate.Available);
    }

    /// <summary>A 1x1 source, so the size the layer asks for is the only thing under test.</summary>
    private sealed class OnePixel : IImageSourceProvider
    {
        public Task<Image?> LoadAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
            => Task.FromResult<Image?>(new Image<Rgba32>(1, 1, new Rgba32(255, 0, 0)));

        public Task<bool> ExistsAsync(ImageSource? source, CancellationToken cancellationToken = default)
            => Task.FromResult(true);

        public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, CancellationToken cancellationToken = default)
            => Task.FromResult<(int, int)?>((1, 1));

        public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
            => Task.FromResult<(int, int)?>((1, 1));
    }

    /// <summary>
    /// A header claiming 20000x20000. Nothing is ever decoded: the whole point of the limit is
    /// that <c>LoadAsync</c> is not reached, which is why this throws if it is.
    /// </summary>
    private sealed class HugeHeader : IImageSourceProvider
    {
        public Task<Image?> LoadAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
            => throw new InvalidOperationException("The oversize source must be refused from its header, without decoding it.");

        public Task<bool> ExistsAsync(ImageSource? source, CancellationToken cancellationToken = default)
            => Task.FromResult(true);

        public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, CancellationToken cancellationToken = default)
            => Task.FromResult<(int, int)?>((20_000, 20_000));

        public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
            => Task.FromResult<(int, int)?>((20_000, 20_000));
    }
}
