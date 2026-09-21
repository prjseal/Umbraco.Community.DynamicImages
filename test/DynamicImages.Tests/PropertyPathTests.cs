using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class PropertyPathTests
{
    [Theory]
    [InlineData("author.mainImage", true)]
    [InlineData("a.b.c", true)]
    [InlineData("title", false)]
    [InlineData("author.", false)]
    [InlineData(".author", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    public void IsPath_IsTrueOnlyWhenSomethingIsFollowed(string? alias, bool expected)
        => Assert.Equal(expected, PropertyPath.IsPath(alias));

    [Fact]
    public void Parse_OnABareAlias_ReadsItOnThisNode()
    {
        var path = PropertyPath.Parse("title");

        Assert.Equal("title", path.First);
        Assert.Empty(path.Hops);
        Assert.Equal("title", path.Last);
        Assert.Equal(1, path.SegmentCount);
        Assert.False(path.IsTooDeep);
    }

    [Fact]
    public void Parse_OnTwoSegments_FollowsTheFirstAndReadsTheSecond()
    {
        var path = PropertyPath.Parse("author.mainImage");

        Assert.Equal("author", path.First);
        Assert.Equal(["author"], path.Hops);
        Assert.Equal("mainImage", path.Last);
        Assert.Equal(2, path.SegmentCount);
        Assert.False(path.IsTooDeep);
    }

    [Fact]
    public void Parse_OnThreeSegments_FollowsBoth()
    {
        var path = PropertyPath.Parse("author.employer.logo");

        Assert.Equal("author", path.First);
        Assert.Equal(["author", "employer"], path.Hops);
        Assert.Equal("logo", path.Last);
        Assert.Equal(3, path.SegmentCount);
    }

    [Theory]
    [InlineData("author.")]
    [InlineData(".author")]
    [InlineData("author..")]
    public void Parse_DropsEmptySegments(string alias)
    {
        var path = PropertyPath.Parse(alias);

        Assert.Equal("author", path.First);
        Assert.Equal("author", path.Last);
        Assert.Empty(path.Hops);
    }

    [Fact]
    public void Parse_DropsADoubledDotRatherThanCountingItAsAHop()
    {
        var path = PropertyPath.Parse("author..mainImage");

        Assert.Equal(["author"], path.Hops);
        Assert.Equal("mainImage", path.Last);
    }

    [Fact]
    public void Parse_TrimsWhitespaceAroundEachSegment()
    {
        var path = PropertyPath.Parse(" author . mainImage ");

        Assert.Equal("author", path.First);
        Assert.Equal("mainImage", path.Last);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(".")]
    public void Parse_OnNothing_IsEmptyRatherThanThrowing(string? alias)
    {
        var path = PropertyPath.Parse(alias);

        Assert.Equal(string.Empty, path.First);
        Assert.Equal(string.Empty, path.Last);
        Assert.Empty(path.Hops);
        Assert.False(path.IsTooDeep);
    }

    [Fact]
    public void Parse_AtTheHopCap_IsNotTooDeep()
    {
        var path = PropertyPath.Parse("a.b.c.d");

        Assert.Equal(PropertyPath.MaxHops, path.Hops.Count);
        Assert.False(path.IsTooDeep);
    }

    [Fact]
    public void Parse_OverTheHopCap_IsTooDeepRatherThanTruncated()
    {
        var path = PropertyPath.Parse("a.b.c.d.e");

        Assert.True(path.IsTooDeep);

        // Still parsed in full: truncating would quietly read the wrong property, so the caller
        // resolves the whole path to nothing instead.
        Assert.Equal(5, path.SegmentCount);
        Assert.Equal("e", path.Last);
    }

    [Fact]
    public void Parse_First_IsWhatTheValidatorChecksAgainstTheDocumentType()
    {
        // The validator's PropertyUnknown check only ever looks at the first segment, because the
        // tail lives on a document type it would have to guess at.
        Assert.Equal("author", PropertyPath.Parse("author.employer.logo").First);
        Assert.Equal("title", PropertyPath.Parse("title").First);
    }
}
