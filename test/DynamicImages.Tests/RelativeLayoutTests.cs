using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

public class RelativeLayoutTests
{
    // ------------------------------------------------------------------ shared fixture

    /// <summary>
    /// The same file the client's relative-layout.test.ts asserts against. The fixture names its
    /// layers with short strings; here each becomes a stable GUID so the server model can hold it.
    /// </summary>
    public static TheoryData<string> FixtureNames()
    {
        var data = new TheoryData<string>();
        foreach (var element in Fixture().RootElement.GetProperty("cases").EnumerateArray())
        {
            data.Add(element.GetProperty("name").GetString()!);
        }

        return data;
    }

    [Theory]
    [MemberData(nameof(FixtureNames))]
    public void Resolve_MatchesTheSharedFixture(string caseName)
    {
        var element = Fixture().RootElement.GetProperty("cases").EnumerateArray()
            .Single(c => c.GetProperty("name").GetString() == caseName);

        var layers = element.GetProperty("layers").EnumerateArray().Select(ParseLayer).ToList();
        var layersByKey = layers.ToDictionary(l => l.Key);

        var bounds = new Dictionary<Guid, LayerBounds>();
        foreach (var property in element.GetProperty("bounds").EnumerateObject())
        {
            var box = property.Value;
            bounds[KeyFor(property.Name)] = new LayerBounds(
                KeyFor(property.Name),
                box.GetProperty("x").GetSingle(),
                box.GetProperty("y").GetSingle(),
                box.GetProperty("width").GetSingle(),
                box.GetProperty("height").GetSingle(),
                1, false, null);
        }

        var target = layersByKey[KeyFor(element.GetProperty("resolve").GetString()!)];
        var resolved = RelativeLayout.Resolve(target, layersByKey, key => bounds.GetValueOrDefault(key));

        var expected = element.GetProperty("expected");
        Assert.Equal(expected.GetProperty("x").GetSingle(), resolved.X, 3);
        Assert.Equal(expected.GetProperty("y").GetSingle(), resolved.Y, 3);
        Assert.Equal(Enum.Parse<Anchor>(expected.GetProperty("anchor").GetString()!, ignoreCase: true), resolved.Anchor);
    }

    [Fact]
    public void Resolve_ReturnsTheLayersOwnPositionWhenNothingIsTracked()
    {
        var layer = Rect("a", 10, 20);
        var resolved = RelativeLayout.Resolve(layer, new Dictionary<Guid, LayerBase> { [layer.Key] = layer }, _ => null);

        Assert.Same(layer.Position, resolved);
    }

    // ------------------------------------------------------------------ measure order

    [Fact]
    public void MeasureOrder_IsEmptyWhenNothingIsTracked()
    {
        var template = Template(Rect("a", 0, 0), Rect("b", 0, 0));

        Assert.False(RelativeLayout.IsUsed(template));
        Assert.Empty(RelativeLayout.MeasureOrder(template));
    }

    [Fact]
    public void MeasureOrder_IncludesAForwardReferenceButNotTheTracker()
    {
        // A scrim at the bottom of the stack tracking a label above it is the first thing people try.
        var scrim = Rect("scrim", 0, 0, relativeY: Below("label", 0));
        var label = Rect("label", 0, 0);
        var template = Template(scrim, label);

        Assert.True(RelativeLayout.IsUsed(template));
        var order = RelativeLayout.MeasureOrder(template);

        Assert.Equal([label.Key], order.Select(l => l.Key));
    }

    [Fact]
    public void MeasureOrder_PutsReferencesBeforeTheLayersThatTrackThem()
    {
        var title = Rect("title", 0, 0);
        var subtitle = Rect("subtitle", 0, 0, relativeY: Below("title", 4));
        var desc = Rect("desc", 0, 0, relativeY: Below("subtitle", 10));

        // Deliberately out of dependency order in z.
        var order = RelativeLayout.MeasureOrder(Template(desc, subtitle, title)).Select(l => l.Key).ToList();

        Assert.Equal([title.Key, subtitle.Key], order);
    }

    [Fact]
    public void MeasureOrder_TerminatesOnACycleAndStillMeasuresItsMembers()
    {
        var a = Rect("a", 0, 0, relativeY: Below("b", 0));
        var b = Rect("b", 0, 0, relativeY: Below("a", 0));
        var c = Rect("c", 0, 0, relativeY: Below("a", 0));

        var order = RelativeLayout.MeasureOrder(Template(a, b, c)).Select(l => l.Key).ToList();

        // Both members are measured (they resolve as absolute); c tracks a and is not referenced.
        Assert.Equal(2, order.Count);
        Assert.Contains(a.Key, order);
        Assert.Contains(b.Key, order);
    }

    [Fact]
    public void IsOnCycle_FindsCyclesAcrossAxes()
    {
        var a = Rect("a", 0, 0, relativeX: RightOf("b", 0));
        var b = Rect("b", 0, 0, relativeY: Below("a", 0));
        var c = Rect("c", 0, 0, relativeY: Below("a", 0));
        var index = RelativeLayout.Index(Template(a, b, c));

        Assert.True(RelativeLayout.IsOnCycle(a.Key, index));
        Assert.True(RelativeLayout.IsOnCycle(b.Key, index));
        Assert.False(RelativeLayout.IsOnCycle(c.Key, index));
    }

    // ------------------------------------------------------------------ problems

    [Fact]
    public void Problems_IsEmptyForAWellFormedTemplate()
    {
        var title = Rect("title", 0, 0);
        var desc = Rect("desc", 0, 0, relativeY: Below("title", 10), relativeX: RightOf("title", 4));

        Assert.Empty(RelativeLayout.Problems(Template(title, desc)));
    }

    [Fact]
    public void Problems_ReportsAMissingReference()
    {
        var desc = Rect("desc", 0, 0, relativeY: Below("gone", 10));

        var issue = Assert.Single(RelativeLayout.Problems(Template(desc)));
        Assert.Equal("RelativeMissing", issue.Code);
        Assert.Equal(desc.Key, issue.LayerKey);
    }

    [Fact]
    public void Problems_ReportsASelfReferenceOnceNotAsACycle()
    {
        var desc = Rect("desc", 0, 0, relativeY: Below("desc", 10));

        var issue = Assert.Single(RelativeLayout.Problems(Template(desc)));
        Assert.Equal("RelativeSelf", issue.Code);
    }

    [Fact]
    public void Problems_ReportsEveryMemberOfACycle()
    {
        var a = Rect("a", 0, 0, relativeY: Below("b", 0));
        var b = Rect("b", 0, 0, relativeY: Below("a", 0));

        var issues = RelativeLayout.Problems(Template(a, b)).ToList();

        Assert.Equal(2, issues.Count);
        Assert.All(issues, issue => Assert.Equal("RelativeCycle", issue.Code));
        Assert.Equal(new[] { a.Key, b.Key }, issues.Select(i => i.LayerKey!.Value));
    }

    [Fact]
    public void Problems_ReportsAnEdgeOnTheWrongAxis()
    {
        var title = Rect("title", 0, 0);
        var desc = Rect("desc", 0, 0, relativeX: Below("title", 10));

        var issue = Assert.Single(RelativeLayout.Problems(Template(title, desc)));
        Assert.Equal("RelativeEdgeMismatch", issue.Code);
    }

    // ------------------------------------------------------------------ helpers

    private static JsonDocument Fixture() => JsonDocument.Parse(File.ReadAllText("relative-layout-fixtures.json"));

    /// <summary>A stable GUID for a fixture layer name, so references between layers line up.</summary>
    private static Guid KeyFor(string name) => new(MD5.HashData(Encoding.UTF8.GetBytes(name)));

    private static LayerBase ParseLayer(JsonElement element)
    {
        var position = new Position
        {
            X = element.GetProperty("x").GetSingle(),
            Y = element.GetProperty("y").GetSingle(),
            Anchor = Enum.Parse<Anchor>(element.GetProperty("anchor").GetString()!, ignoreCase: true),
            RelativeX = element.TryGetProperty("relativeX", out var rx) ? ParseReference(rx) : null,
            RelativeY = element.TryGetProperty("relativeY", out var ry) ? ParseReference(ry) : null,
        };

        return new RectLayer { Key = KeyFor(element.GetProperty("key").GetString()!), Name = element.GetProperty("key").GetString()!, Position = position };
    }

    private static RelativeReference ParseReference(JsonElement element) => new()
    {
        LayerKey = KeyFor(element.GetProperty("layerKey").GetString()!),
        Edge = Enum.Parse<RelativeEdge>(element.GetProperty("edge").GetString()!, ignoreCase: true),
        Gap = element.GetProperty("gap").GetSingle(),
    };

    private static RectLayer Rect(string name, float x, float y, RelativeReference? relativeX = null, RelativeReference? relativeY = null) => new()
    {
        Key = KeyFor(name),
        Name = name,
        Fill = "#FFFFFF",
        Position = new Position { X = x, Y = y, RelativeX = relativeX, RelativeY = relativeY },
        Size = new LayerSize { Width = 10, Height = 10 },
    };

    private static RelativeReference Below(string name, float gap) => new() { LayerKey = KeyFor(name), Edge = RelativeEdge.Below, Gap = gap };

    private static RelativeReference RightOf(string name, float gap) => new() { LayerKey = KeyFor(name), Edge = RelativeEdge.RightOf, Gap = gap };

    private static Template Template(params LayerBase[] layers) => new() { Alias = "t", Name = "T", Layers = [.. layers] };
}
