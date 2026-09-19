using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class ReadingTimeTests
{
    [Theory]
    [InlineData(null, 1)]
    [InlineData("", 1)]
    [InlineData("one two three", 1)]
    [InlineData("200 words", 1)]
    public void Minutes_IsNeverLessThanOne(string? raw, int expected)
        => Assert.Equal(expected, ReadingTime.Minutes(raw));

    [Theory]
    [InlineData(200, 1)]
    [InlineData(201, 2)]
    [InlineData(600, 3)]
    [InlineData(601, 4)]
    public void Minutes_RoundsUpAtTwoHundredWordsAMinute(int words, int expected)
        => Assert.Equal(expected, ReadingTime.Minutes(string.Join(' ', Enumerable.Repeat("word", words))));

    [Fact]
    public void Minutes_IgnoresMarkupAndPunctuation()
    {
        // Rich text and block-list JSON both arrive here, so neither's syntax should count as words.
        var html = string.Join(string.Empty, Enumerable.Repeat("<p class=\"x\">word, word.</p>", 100));

        Assert.Equal(1, ReadingTime.Minutes(html));
    }

    [Fact]
    public void Estimate_FormatsTheWayV1Did()
        => Assert.Equal("1 min read", ReadingTime.Estimate("a few words"));
}
