using System.Text.Json;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering.Layers;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class ShapeGeometryTests
{
    /// <summary>
    /// The same file the client's shape-geometry.test.ts asserts against. If either side of the
    /// shape contract drifts, one of the two suites fails - which is the whole point.
    /// </summary>
    private static JsonDocument Fixture() => JsonDocument.Parse(File.ReadAllText("shape-fixtures.json"));

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
    public void Vertices_MatchTheSharedFixture(string name)
    {
        var element = Fixture().RootElement.GetProperty("cases").EnumerateArray()
            .Single(c => c.GetProperty("name").GetString() == name);

        var kind = ParseKind(element.GetProperty("kind").GetString()!);
        var expected = element.GetProperty("expected").EnumerateArray()
            .Select(p => (X: p[0].GetSingle(), Y: p[1].GetSingle()))
            .ToList();

        var points = ShapeGeometry.Vertices(kind, element.GetProperty("sides").GetInt32(), element.GetProperty("innerRatio").GetSingle());

        Assert.Equal(expected.Count, points.Count);
        for (var i = 0; i < expected.Count; i++)
        {
            Assert.True(Math.Abs(expected[i].X - points[i].X) < 0.001f, $"point {i} x {points[i].X} should be {expected[i].X}");
            Assert.True(Math.Abs(expected[i].Y - points[i].Y) < 0.001f, $"point {i} y {points[i].Y} should be {expected[i].Y}");
        }
    }

    [Fact]
    public void Clamps_MatchTheSharedRange()
    {
        Assert.Equal(3, ShapeGeometry.ClampSides(2));
        Assert.Equal(12, ShapeGeometry.ClampSides(13));
        Assert.Equal(7, ShapeGeometry.ClampSides(7));
        Assert.Equal(0.1f, ShapeGeometry.ClampInnerRatio(0f));
        Assert.Equal(0.9f, ShapeGeometry.ClampInnerRatio(1f));
        Assert.Equal(0.4f, ShapeGeometry.ClampInnerRatio(0.4f));
    }

    private static ShapeKind ParseKind(string name) => Enum.Parse<ShapeKind>(name, ignoreCase: true);
}
