using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class PublishedValuesTests
{
    private static readonly Guid AuthorKey = new("bd6a503a-1c34-4a1e-9f0a-6d7e8f9a0b1c");
    private static readonly Guid MediaKey = new("2f1d2c3b-4a59-4e7d-9b8f-0c1d2e3f4a5b");

    private static FakePublishedContent Node(string alias, object? value, string? name = "A node")
        => new(name, Guid.NewGuid(), new Dictionary<string, object?> { [alias] = value });

    // ---------------------------------------------------------------- FollowFirst

    [Fact]
    public void FollowFirst_FollowsASingleNode()
    {
        var author = new FakePublishedContent("Ada", AuthorKey);

        Assert.Same(author, PublishedValues.FollowFirst(Node("author", author), "author", null));
    }

    [Fact]
    public void FollowFirst_TakesTheFirstOfASequence()
    {
        var first = new FakePublishedContent("Ada", AuthorKey);
        var second = new FakePublishedContent("Grace");

        var followed = PublishedValues.FollowFirst(
            Node("author", new List<IPublishedContent> { first, second }), "author", null);

        Assert.Same(first, followed);
    }

    [Fact]
    public void FollowFirst_FollowsATypedSequenceThroughCovariance()
    {
        var author = new FakePublishedContent("Ada", AuthorKey);

        // A typed sequence - what a models-builder site hands back - is still IEnumerable<IPublishedContent>.
        var followed = PublishedValues.FollowFirst(
            Node("author", new List<FakePublishedContent> { author }), "author", null);

        Assert.Same(author, followed);
    }

    [Fact]
    public void FollowFirst_FollowsARawUdiThroughTheCache()
    {
        var author = new FakePublishedContent("Ada", AuthorKey);
        var cache = new FakeContentCache(author);

        var followed = PublishedValues.FollowFirst(Node("author", $"umb://document/{AuthorKey:N}"), "author", cache);

        Assert.Same(author, followed);
    }

    [Fact]
    public void FollowFirst_WithNoCache_IsNullRatherThanAThrow()
        => Assert.Null(PublishedValues.FollowFirst(Node("author", $"umb://document/{AuthorKey:N}"), "author", null));

    [Fact]
    public void FollowFirst_OnAMissingProperty_IsNull()
        => Assert.Null(PublishedValues.FollowFirst(new FakePublishedContent(), "author", null));

    [Fact]
    public void FollowRaw_OnAMediaUdi_IsNull()
    {
        // The entity-type guard again: a media reference must not be looked up in the content cache.
        var cache = new FakeContentCache(new FakePublishedContent("Ada", AuthorKey));

        Assert.Null(PublishedValues.FollowRaw($"umb://media/{AuthorKey:N}", cache));
    }

    // ---------------------------------------------------------------- TextOf

    [Fact]
    public void TextOf_ReadsTheNodeName()
        => Assert.Equal("Ada", PublishedValues.TextOf(new FakePublishedContent("Ada"), "name"));

    [Fact]
    public void TextOf_PassesAStringThrough()
        => Assert.Equal("Lead developer", PublishedValues.TextOf(Node("jobTitle", "Lead developer"), "jobTitle"));

    [Fact]
    public void TextOf_OnOneLinkedNode_IsItsName()
        => Assert.Equal("Ada", PublishedValues.TextOf(Node("author", new FakePublishedContent("Ada")), "author"));

    [Fact]
    public void TextOf_OnManyLinkedNodes_JoinsTheirNames()
    {
        var value = new List<IPublishedContent> { new FakePublishedContent("Ada"), new FakePublishedContent("Grace") };

        Assert.Equal("Ada, Grace", PublishedValues.TextOf(Node("authors", value), "authors"));
    }

    [Fact]
    public void TextOf_JoinsAStringList()
        => Assert.Equal("umbraco, c#", PublishedValues.TextOf(Node("tags", new[] { "umbraco", "c#" }), "tags"));

    [Fact]
    public void TextOf_RoundTripsADate()
    {
        var date = new DateTime(2024, 5, 20, 14, 30, 0, DateTimeKind.Utc);

        Assert.Equal(date.ToString("O"), PublishedValues.TextOf(Node("publishedOn", date), "publishedOn"));
    }

    [Fact]
    public void TextOf_OnNothing_IsNull()
    {
        Assert.Null(PublishedValues.TextOf(new FakePublishedContent(), "missing"));
        Assert.Null(PublishedValues.TextOf(Node("jobTitle", null), "jobTitle"));
        Assert.Null(PublishedValues.TextOf(null, "jobTitle"));
    }

    // ---------------------------------------------------------------- MediaKeyOf

    [Fact]
    public void MediaKeyOf_ReadsATypedNode()
        => Assert.Equal(MediaKey,
            PublishedValues.MediaKeyOf(Node("mainImage", new FakePublishedContent("Photo", MediaKey)), "mainImage"));

    [Fact]
    public void MediaKeyOf_ReadsASequenceOfTypedNodes()
    {
        var value = new List<IPublishedContent> { new FakePublishedContent("Photo", MediaKey) };

        Assert.Equal(MediaKey, PublishedValues.MediaKeyOf(Node("mainImage", value), "mainImage"));
    }

    [Fact]
    public void MediaKeyOf_ReadsAMediaWithCrops()
    {
        var crops = new MediaWithCrops(new FakePublishedContent("Photo", MediaKey), null!, null!);

        Assert.Equal(MediaKey, PublishedValues.MediaKeyOf(Node("mainImage", crops), "mainImage"));
    }

    [Fact]
    public void MediaKeyOf_FallsBackToTheRawMediaPickerJson()
    {
        // The site where no converter ran: the stored string is all there is.
        var raw = $$"""[{"key":"{{Guid.NewGuid()}}","mediaKey":"{{MediaKey}}"}]""";

        Assert.Equal(MediaKey, PublishedValues.MediaKeyOf(Node("mainImage", raw), "mainImage"));
    }

    [Fact]
    public void MediaKeyOf_OnNothing_IsNull()
    {
        Assert.Null(PublishedValues.MediaKeyOf(new FakePublishedContent(), "mainImage"));
        Assert.Null(PublishedValues.MediaKeyOf(Node("mainImage", "not a reference"), "mainImage"));
    }

    // ---------------------------------------------------------------- DateOf

    [Fact]
    public void DateOf_ReadsTheNodePseudoProperties()
    {
        var node = new FakePublishedContent();

        Assert.Equal(node.CreateDate, PublishedValues.DateOf(node, "createDate"));
        Assert.Equal(node.UpdateDate, PublishedValues.DateOf(node, "updateDate"));
    }

    [Fact]
    public void DateOf_ReadsATypedDate()
    {
        var date = new DateTime(2024, 5, 20, 14, 30, 0, DateTimeKind.Utc);

        Assert.Equal(date, PublishedValues.DateOf(Node("publishedOn", date), "publishedOn"));
    }

    [Fact]
    public void DateOf_ParsesAStoredString()
        => Assert.Equal(new DateTime(2024, 5, 20), PublishedValues.DateOf(Node("publishedOn", "2024-05-20"), "publishedOn"));

    [Fact]
    public void DateOf_OnAnythingElse_IsNull()
        => Assert.Null(PublishedValues.DateOf(Node("publishedOn", "not a date"), "publishedOn"));

    // ---------------------------------------------------------------- ItemsOf

    [Fact]
    public void ItemsOf_FlattensEachNodesPropertiesToStrings()
    {
        var category = new FakePublishedContent("Umbraco", Guid.NewGuid(),
            new Dictionary<string, object?> { ["shortName"] = "umb", ["count"] = 3 });

        var items = PublishedValues.ItemsOf(Node("categories", new List<IPublishedContent> { category }), "categories");

        var item = Assert.Single(items);
        Assert.Equal("Umbraco", item.Name);
        Assert.Equal("umb", item.Property("shortName"));
        Assert.Equal("3", item.Property("count"));
    }

    [Fact]
    public void ItemsOf_ReadsASinglePickedNodeAsOneItem()
    {
        var items = PublishedValues.ItemsOf(Node("category", new FakePublishedContent("Umbraco")), "category");

        Assert.Equal("Umbraco", Assert.Single(items).Name);
    }

    [Fact]
    public void ItemsOf_OnNothing_IsEmpty()
    {
        Assert.Empty(PublishedValues.ItemsOf(new FakePublishedContent(), "categories"));
        Assert.Empty(PublishedValues.ItemsOf(null, "categories"));
        Assert.Empty(PublishedValues.ItemsOf(Node("categories", "umb://document/whatever"), "categories"));
    }

    // ---------------------------------------------------------------- Truthy

    [Theory]
    [InlineData(null, false)]
    [InlineData(true, true)]
    [InlineData(false, false)]
    [InlineData("", false)]
    [InlineData("   ", false)]
    [InlineData("0", false)]
    [InlineData("false", false)]
    [InlineData("FALSE", false)]
    [InlineData("[]", false)]
    [InlineData("yes", true)]
    [InlineData(0, false)]
    [InlineData(3, true)]
    public void Truthy_ReadsTheShapesAVisibilityRuleMeets(object? value, bool expected)
        => Assert.Equal(expected, PublishedValues.Truthy(value));

    [Fact]
    public void Truthy_OnAList_IsWhetherItHasAnything()
    {
        Assert.False(PublishedValues.Truthy(Array.Empty<string>()));
        Assert.True(PublishedValues.Truthy(new[] { "one" }));
    }

    [Fact]
    public void Truthy_OnAnyOtherObject_IsTrue()
        => Assert.True(PublishedValues.Truthy(new FakePublishedContent()));
}
