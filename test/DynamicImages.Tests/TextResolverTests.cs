using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class TextResolverTests
{
    private static readonly DictionaryRenderValueSource Source = new(
        name: "Ten things about Umbraco",
        text: new Dictionary<string, string?>
        {
            ["subtitle"] = "A standfirst",
            ["body"] = "<p>Hello <strong>world</strong></p>",
            ["articleDate"] = "2026-03-04T09:30:00",
            ["mainContent"] = string.Join(' ', Enumerable.Repeat("word", 600)),
            ["featured"] = "1",
            ["notFeatured"] = "0",
        });

    [Fact]
    public void NodeName_ReturnsTheName()
        => Assert.Equal("Ten things about Umbraco",
            TextResolver.Resolve(new TextBinding { Kind = TextBindingKind.NodeName }, Source));

    [Fact]
    public void Property_ReturnsTheValue()
        => Assert.Equal("A standfirst",
            TextResolver.Resolve(new TextBinding { Kind = TextBindingKind.Property, PropertyAlias = "subtitle" }, Source));

    [Fact]
    public void Property_StripsRichTextToPlainText()
        => Assert.Equal("Hello world",
            TextResolver.Resolve(new TextBinding { Kind = TextBindingKind.Property, PropertyAlias = "body" }, Source));

    [Fact]
    public void Property_IsEmptyWhenTheAliasIsUnknown()
        => Assert.Equal(string.Empty,
            TextResolver.Resolve(new TextBinding { Kind = TextBindingKind.Property, PropertyAlias = "nope" }, Source));

    [Fact]
    public void Date_FormatsWithTheGivenFormat()
        => Assert.Equal("4 March 2026",
            TextResolver.Resolve(
                new TextBinding { Kind = TextBindingKind.Date, PropertyAlias = "articleDate", Format = "d MMMM yyyy" },
                Source));

    [Fact]
    public void ReadingTime_RoundsUpAtTwoHundredWordsAMinute()
        => Assert.Equal("3 min read",
            TextResolver.Resolve(new TextBinding { Kind = TextBindingKind.ReadingTime, PropertyAlias = "mainContent" }, Source));

    [Fact]
    public void Static_ReturnsTheLiteralText()
        => Assert.Equal("Fixed",
            TextResolver.Resolve(new TextBinding { Kind = TextBindingKind.Static, Text = "Fixed" }, Source));

    [Fact]
    public void Expression_SubstitutesEveryToken()
    {
        // This is the general form of v1's "SuffixText containing {readingTime}" special case.
        var binding = new TextBinding
        {
            Kind = TextBindingKind.Expression,
            Text = "{name} · {readingTime:mainContent} · {prop:subtitle} · {date:articleDate:yyyy}",
        };

        Assert.Equal("Ten things about Umbraco · 3 min read · A standfirst · 2026", TextResolver.Resolve(binding, Source));
    }

    [Fact]
    public void Expression_LeavesNoUnknownTokenOnTheImage()
        => Assert.Equal("before  after",
            TextResolver.Resolve(new TextBinding { Kind = TextBindingKind.Expression, Text = "before {nonsense} after" }, Source));

    [Fact]
    public void ReferencedAliases_FindsWhatAnExpressionReads()
    {
        var aliases = TextResolver.ReferencedAliases("{name} {prop:subtitle} {date:articleDate:yyyy} {readingTime}").ToList();

        Assert.Equal(["subtitle", "articleDate"], aliases);
    }

    [Theory]
    [InlineData("featured", true)]
    [InlineData("notFeatured", false)]
    [InlineData("subtitle", true)]
    [InlineData("missing", false)]
    public void IsTruthy_DrivesTheVisibilityRule(string alias, bool expected)
        => Assert.Equal(expected, Source.IsTruthy(alias));
}
