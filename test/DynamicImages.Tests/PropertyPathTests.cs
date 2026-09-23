using Umbraco.Community.DynamicImages.Api.Controllers;
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

    // ------------------------------------------------------------ multi-hop linked properties
    //
    // The linked-properties endpoint walks a dotted path a reference at a time. Modelled here as a
    // tiny schema: a document type is a name, a property is "alias -> target types" (null when it
    // is not a content reference).

    private static readonly Dictionary<string, Dictionary<string, string[]?>> Schema = new()
    {
        ["article"] = new() { ["title"] = null, ["author"] = ["person"] },
        ["person"] = new() { ["name"] = null, ["employer"] = ["company"], ["pets"] = [] },
        ["company"] = new() { ["logo"] = null, ["parent"] = ["company"] },
    };

    private static Task<LinkedPathResult<string, string>> Walk(string path)
        => LinkedPath.WalkAsync<string, string>(
            ["article"],
            path.Split('.'),
            (owners, alias) => owners.FirstOrDefault(o => Schema[o].ContainsKey(alias)) is { } owner ? (owner, alias) : null,
            (owner, property) => Task.FromResult<(IReadOnlyList<string>?, string)>(
                (Schema[owner][property], Schema[owner][property] is null ? "none" : "filter")));

    [Fact]
    public async Task A_one_hop_path_lands_on_the_first_reference()
    {
        var result = await Walk("author");

        Assert.Equal(LinkedPathOutcome.Found, result.Outcome);
        Assert.Equal(("article", "author"), (result.Owner, result.Property));
    }

    [Fact]
    public async Task A_two_hop_path_follows_the_first_reference_to_the_second()
    {
        var result = await Walk("author.employer");

        Assert.Equal(LinkedPathOutcome.Found, result.Outcome);
        Assert.Equal(("person", "employer"), (result.Owner, result.Property));
        Assert.Equal("filter", result.Inference);
    }

    [Fact]
    public async Task A_three_hop_path_reaches_the_third_document_type()
    {
        var result = await Walk("author.employer.parent");

        Assert.Equal(LinkedPathOutcome.Found, result.Outcome);
        Assert.Equal(("company", "parent"), (result.Owner, result.Property));
    }

    [Fact]
    public async Task A_hop_through_something_that_is_not_a_reference_stops()
    {
        var result = await Walk("title.anything");

        Assert.Equal(LinkedPathOutcome.NotAReference, result.Outcome);
        Assert.Equal("title", result.FailedSegment);
    }

    [Fact]
    public async Task A_segment_the_reached_type_does_not_have_is_missing()
    {
        var result = await Walk("author.logo");

        Assert.Equal(LinkedPathOutcome.PropertyMissing, result.Outcome);
        Assert.Equal("logo", result.FailedSegment);
    }

    [Fact]
    public async Task A_reference_with_no_inferable_targets_says_so()
    {
        var result = await Walk("author.pets.name");

        Assert.Equal(LinkedPathOutcome.NoTargets, result.Outcome);
        Assert.Equal("pets", result.FailedSegment);
    }
}
