using Microsoft.Extensions.Logging.Abstractions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// What the encoder does with transparency, which is the one thing about the output format an
/// editor can get wrong without being told. Only EncodeAsync is exercised, so the writer's Umbraco
/// dependencies are never touched.
/// </summary>
public class EncodingTests
{
    private static DynamicImageMediaWriter Writer() =>
        new(null!, null!, null!, null!, null!, null!, NullLogger<DynamicImageMediaWriter>.Instance);

    /// <summary>A buffer created without a seed pixel is transparent, which is what CreateCanvas
    /// hands the encoder for a gradient or a zero-alpha background.</summary>
    private static Image<Rgba32> Transparent() => new(4, 4);

    [Theory]
    [InlineData(OutputFormat.Png)]
    [InlineData(OutputFormat.Webp)]
    public async Task EncodeAsync_KeepsTransparency(OutputFormat format)
    {
        using var image = Transparent();

        var bytes = await Writer().EncodeAsync(image, new OutputSettings { Format = format });

        using var decoded = Image.Load<Rgba32>(bytes);
        Assert.Equal(0, decoded[2, 2].A);
    }

    [Fact]
    public async Task EncodeAsync_FlattensTransparencyToJpeg()
    {
        // JPEG has no alpha channel, so a transparent canvas comes back as whatever hex happened
        // to be under the zero alpha. This is the behaviour TransparencyNotKept warns about - the
        // warning should not be left asserting its own premise.
        using var image = Transparent();

        var bytes = await Writer().EncodeAsync(image, new OutputSettings { Format = OutputFormat.Jpeg });

        using var decoded = Image.Load<Rgba32>(bytes);
        Assert.Equal(255, decoded[2, 2].A);
    }

    [Fact]
    public async Task EncodeAsync_KeepsAPartlyTransparentPixelOnPng()
    {
        using var image = new Image<Rgba32>(4, 4, new Rgba32(0, 0, 0, 0x99));

        var bytes = await Writer().EncodeAsync(image, new OutputSettings { Format = OutputFormat.Png });

        using var decoded = Image.Load<Rgba32>(bytes);
        Assert.Equal(0x99, decoded[2, 2].A);
    }
}
