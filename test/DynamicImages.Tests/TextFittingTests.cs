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

    /// <summary>
    /// A rich-text body bound to a text layer: 5,000 words, which the old one-word-at-a-time trim
    /// laid out once per word. The cap plus the bisection is what makes this affordable, and this
    /// asserts the budget rather than the algorithm - the point is the wall clock on a publish.
    /// </summary>
    [Fact]
    public void Fit_HandlesAWholeArticleQuickly()
    {
        var article = string.Join(' ', Enumerable.Range(0, 5_000).Select(i => $"word{i}"));

        var watch = System.Diagnostics.Stopwatch.StartNew();
        var result = TextFitting.Fit(article, Font(), Style(3, TextOverflow.Ellipsis), wrappingWidth: 1020);
        watch.Stop();

        Assert.True(result.Truncated);
        Assert.EndsWith("\u2026", result.Text);
        Assert.True(watch.ElapsedMilliseconds < 1_000,
            $"fitting a 5,000-word body took {watch.ElapsedMilliseconds}ms; it should be well under a second");
    }

    [Fact]
    public void Fit_CapsTheTextBeforeLayingItOut()
    {
        // Twice the cap, with no line limit to trim it: what comes back is the cap alone, which
        // is what bounds every layout underneath.
        var article = string.Join(' ', Enumerable.Range(0, 2_000).Select(i => $"word{i}"));
        Assert.True(article.Length > RenderLimits.MaxTextLength * 2);

        var result = TextFitting.Fit(article, Font(), Style(null, TextOverflow.Ellipsis), wrappingWidth: 1020);

        Assert.True(result.Text.Length <= RenderLimits.MaxTextLength);
        Assert.StartsWith("word0 word1 ", result.Text);

        // Cut on a word boundary, so the last word is whole rather than sliced.
        Assert.DoesNotContain("  ", result.Text);
        Assert.Equal(result.Text.TrimEnd(), result.Text);
    }

    [Fact]
    public void Fit_CutsAnUnbrokenRunThatHasNoWordBoundary()
    {
        var run = new string('x', RenderLimits.MaxTextLength * 2);

        var result = TextFitting.Fit(run, Font(), Style(null, TextOverflow.Ellipsis), wrappingWidth: 1020);

        Assert.Equal(RenderLimits.MaxTextLength, result.Text.Length);
    }

    /// <summary>
    /// The bisection has to land on the same string the old linear scan did: the largest word
    /// count that still fits. Checked directly - one more word must not fit.
    /// </summary>
    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    public void Fit_TrimsToTheLargestNumberOfWordsThatFits(int maxLines)
    {
        var style = Style(maxLines, TextOverflow.Ellipsis);
        var result = TextFitting.Fit(LongTitle, Font(), style, wrappingWidth: 1020);

        Assert.True(result.Truncated);
        Assert.True(TextFitting.CountLines(result.Text, Font(), style, 1020) <= maxLines);

        var kept = result.Text.TrimEnd('\u2026').Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
        var words = LongTitle.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (kept >= words.Length) return;

        var oneMore = string.Join(' ', words.Take(kept + 1)).TrimEnd(',', ';', ':', '-', '\u2013') + "\u2026";
        Assert.True(TextFitting.CountLines(oneMore, Font(), style, 1020) > maxLines,
            $"'{oneMore}' fits in {maxLines} line(s), so the trim stopped one word short");
    }
}
