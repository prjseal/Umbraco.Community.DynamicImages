using SixLabors.Fonts;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class TextFittingTests
{
    private const string LongTitle =
        "Everything you ever wanted to know about generating Open Graph images from your content, and rather more besides";

    private static Font Font(float size = 56f)
    {
        var collection = new FontCollection();
        var family = collection.Add(Path.Combine("Assets", "Inter-Regular.ttf"));

        return family.CreateFont(size, FontStyle.Regular);
    }

    private static TextStyle Style(int? maxLines, TextOverflow overflow) => new()
    {
        FontSize = 56f,
        LineSpacing = 1.1f,
        MaxLines = maxLines,
        Overflow = overflow,
    };

    [Fact]
    public void Fit_LeavesTextThatAlreadyFitsAlone()
    {
        var result = TextFitting.Fit("Short title", Font(), Style(3, TextOverflow.Shrink), wrappingWidth: 1020);

        Assert.Equal("Short title", result.Text);
        Assert.False(result.Truncated);
        Assert.Equal(56f, result.FontSize);
    }

    [Fact]
    public void Fit_LeavesTextAloneWhenThereIsNoLineLimit()
    {
        var result = TextFitting.Fit(LongTitle, Font(), Style(null, TextOverflow.Ellipsis), wrappingWidth: 400);

        Assert.Equal(LongTitle, result.Text);
        Assert.False(result.Truncated);
    }

    [Fact]
    public void Fit_ShrinksTheFontUntilItFits()
    {
        var style = Style(2, TextOverflow.Shrink);
        var result = TextFitting.Fit(LongTitle, Font(), style, wrappingWidth: 1020);

        // Shrink keeps every word; it is the size that gives.
        Assert.Equal(LongTitle, result.Text);
        Assert.True(result.FontSize < 56f, "the font should have been stepped down");
        Assert.True(result.FontSize >= 56f * TextFitting.MinimumShrinkFactor, "it should not shrink past the floor");
        Assert.True(result.LineCount <= 2);
    }

    [Fact]
    public void Fit_EllipsisTrimsWholeWordsAndMarksItTruncated()
    {
        var result = TextFitting.Fit(LongTitle, Font(), Style(2, TextOverflow.Ellipsis), wrappingWidth: 1020);

        Assert.True(result.Truncated);
        Assert.EndsWith("…", result.Text);
        Assert.True(result.Text.Length < LongTitle.Length);
        Assert.Equal(56f, result.FontSize);
    }

    [Fact]
    public void Fit_ClipTrimsWithoutAnEllipsis()
    {
        var result = TextFitting.Fit(LongTitle, Font(), Style(2, TextOverflow.Clip), wrappingWidth: 1020);

        Assert.True(result.Truncated);
        Assert.DoesNotContain('…', result.Text);
    }

    [Fact]
    public void Fit_HandlesAnEmptyString()
    {
        var result = TextFitting.Fit(string.Empty, Font(), Style(2, TextOverflow.Shrink), wrappingWidth: 1020);

        Assert.Equal(string.Empty, result.Text);
        Assert.Equal(0, result.LineCount);
    }

    [Fact]
    public void CountLines_GrowsAsTheWrappingWidthShrinks()
    {
        var style = Style(null, TextOverflow.Shrink);

        var wide = TextFitting.CountLines(LongTitle, Font(), style, wrappingWidth: 2000);
        var narrow = TextFitting.CountLines(LongTitle, Font(), style, wrappingWidth: 400);

        Assert.True(narrow > wide, $"expected more lines at 400px than at 2000px, got {narrow} and {wide}");
    }

    [Theory]
    [InlineData(TextTransform.None, "Mixed Case")]
    [InlineData(TextTransform.Uppercase, "MIXED CASE")]
    [InlineData(TextTransform.Lowercase, "mixed case")]
    public void ApplyTransform_Transforms(TextTransform transform, string expected)
        => Assert.Equal(expected, TextFitting.ApplyTransform("Mixed Case", transform));

    [Fact]
    public void StyleOf_RecoversTheStyleOfALoadedFont()
        => Assert.Equal(FontStyle.Regular, TextFitting.StyleOf(Font()));
}
