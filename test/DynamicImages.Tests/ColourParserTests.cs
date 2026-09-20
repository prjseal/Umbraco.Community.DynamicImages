using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class ColourParserTests
{
    [Theory]
    [InlineData("#FFFFFF", 255, 255, 255, 255)]
    [InlineData("ffffff", 255, 255, 255, 255)]
    [InlineData("#6B7280", 107, 114, 128, 255)]
    [InlineData("#FFFFFF14", 255, 255, 255, 20)]
    [InlineData("ffffff26", 255, 255, 255, 38)]
    [InlineData("#0B0F1900", 11, 15, 25, 0)]
    [InlineData("#f00", 255, 0, 0, 255)]
    public void TryParse_ReadsEveryAcceptedForm(string value, byte r, byte g, byte b, byte a)
    {
        Assert.True(ColourParser.TryParse(value, out var colour));

        var pixel = colour.ToPixel<Rgba32>();
        Assert.Equal((r, g, b, a), (pixel.R, pixel.G, pixel.B, pixel.A));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("rebeccapurple")]
    [InlineData("#12")]
    [InlineData("#1234567")]
    [InlineData("#GGGGGG")]
    public void TryParse_RejectsAnythingElseInsteadOfThrowing(string? value)
    {
        // v1 called Color.ParseHex directly, which threw on an empty or malformed value and took
        // the publish down with it.
        Assert.False(ColourParser.TryParse(value, out _));
    }

    [Fact]
    public void ParseOrDefault_FallsBackWithoutThrowing()
        => Assert.Equal(Color.Black, ColourParser.ParseOrDefault("not a colour", Color.Black));

    [Fact]
    public void SplitAlpha_SeparatesTheAlphaIntoABlendPercentage()
    {
        // The badge renderer draws through GraphicsOptions.BlendPercentage rather than an alpha
        // channel, which is how v1 produced its translucent circles.
        var (colour, blend) = ColourParser.SplitAlpha("#FFFFFF14", Color.Black);

        var pixel = colour.ToPixel<Rgba32>();
        Assert.Equal(255, pixel.A);
        Assert.Equal(20 / 255f, blend, 4);
    }

    [Fact]
    public void SplitAlpha_UsesTheFallbacksAlphaWhenTheValueIsUnreadable()
    {
        var (colour, blend) = ColourParser.SplitAlpha("nonsense", Color.FromRgba(1, 2, 3, 128));

        var pixel = colour.ToPixel<Rgba32>();
        Assert.Equal((1, 2, 3, 255), (pixel.R, pixel.G, pixel.B, pixel.A));
        Assert.Equal(128 / 255f, blend, 4);
    }
}
