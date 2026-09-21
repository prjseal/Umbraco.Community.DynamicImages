using System.Text.Json;
using Umbraco.Community.DynamicImages.Core.Services;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class DataTypeFilterTests
{
    private const string Key = "cc07b313-0843-4aa8-bbda-871c8da728c8";
    private const string Other = "b0287f57-1f3e-4a2c-9d5b-6e7f80912a34";

    [Fact]
    public void Parse_ReadsASingleKey()
        => Assert.Equal([Key], DataTypeFilter.Parse(Key));

    [Fact]
    public void Parse_ReadsACommaSeparatedString()
        => Assert.Equal([Key, Other], DataTypeFilter.Parse($"{Key},{Other}"));

    [Fact]
    public void Parse_TrimsWhitespaceAndDropsEmptyTokens()
        => Assert.Equal([Key, Other], DataTypeFilter.Parse($" {Key} , , {Other} "));

    [Fact]
    public void Parse_ReadsAnAliasRatherThanAKey()
    {
        // Older sites wrote aliases into the same setting, so the parse stays shape-agnostic and
        // the caller decides how to resolve each token.
        Assert.Equal(["author", "editor"], DataTypeFilter.Parse("author,editor"));
    }

    [Fact]
    public void Parse_ReadsAJsonArray()
    {
        var element = JsonDocument.Parse($"""["{Key}","{Other}"]""").RootElement;

        Assert.Equal([Key, Other], DataTypeFilter.Parse(element));
    }

    [Fact]
    public void Parse_ReadsAJsonString()
        => Assert.Equal([Key], DataTypeFilter.Parse(JsonDocument.Parse($"\"{Key}\"").RootElement));

    [Fact]
    public void Parse_ReadsASequenceOfStrings()
        => Assert.Equal([Key, Other], DataTypeFilter.Parse(new List<string> { Key, $" {Other} " }));

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(",")]
    public void Parse_OnNothing_IsEmpty(object? value)
        => Assert.Empty(DataTypeFilter.Parse(value));

    [Fact]
    public void Parse_OnAnEmptyJsonArray_IsEmpty()
        => Assert.Empty(DataTypeFilter.Parse(JsonDocument.Parse("[]").RootElement));

    [Fact]
    public void Parse_OnConfiguration_ReadsTheFilterKey()
    {
        var configuration = new Dictionary<string, object>
        {
            ["ignoreUserStartNodes"] = false,
            ["filter"] = Key
        };

        Assert.Equal([Key], DataTypeFilter.Parse(configuration));
    }

    [Fact]
    public void Parse_OnConfigurationWithNoFilter_IsEmpty()
    {
        // The fixture that matters: MNTPAuthors has maxNumber and a startNode, and no filter at
        // all, so config-based inference cannot carry it and sampling is what does.
        var configuration = new Dictionary<string, object>
        {
            ["ignoreUserStartNodes"] = false,
            ["maxNumber"] = 1
        };

        Assert.Empty(DataTypeFilter.Parse(configuration));
        Assert.Empty(DataTypeFilter.Parse((IDictionary<string, object>?)null));
    }
}
