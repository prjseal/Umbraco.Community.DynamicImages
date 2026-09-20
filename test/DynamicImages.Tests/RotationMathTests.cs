using System.Numerics;
using System.Text.Json;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class RotationMathTests
{
    /// <summary>
    /// The same file the client's rotation.test.ts asserts against. If either side of the
    /// rotation contract drifts, one of the two suites fails - which is the whole point.
    /// </summary>
    private static JsonDocument Fixture() => JsonDocument.Parse(File.ReadAllText("rotation-fixtures.json"));

    public static TheoryData<string, float, float, float, float, float, float, float> PointFixtures()
    {
        var data = new TheoryData<string, float, float, float, float, float, float, float>();

        foreach (var element in Fixture().RootElement.GetProperty("rotatePoint").EnumerateArray())
        {
            data.Add(
                element.GetProperty("name").GetString()!,
                element.GetProperty("px").GetSingle(),
                element.GetProperty("py").GetSingle(),
                element.GetProperty("pivotX").GetSingle(),
                element.GetProperty("pivotY").GetSingle(),
                element.GetProperty("degrees").GetSingle(),
                element.GetProperty("expectedX").GetSingle(),
                element.GetProperty("expectedY").GetSingle());
        }

        return data;
    }

    public static TheoryData<string> ExtentFixtureNames()
    {
        var data = new TheoryData<string>();

        foreach (var element in Fixture().RootElement.GetProperty("extent").EnumerateArray())
        {
            data.Add(element.GetProperty("name").GetString()!);
        }

        return data;
    }

    public static TheoryData<float, float> NormaliseFixtures()
    {
        var data = new TheoryData<float, float>();

        foreach (var element in Fixture().RootElement.GetProperty("normalise").EnumerateArray())
        {
            data.Add(element.GetProperty("degrees").GetSingle(), element.GetProperty("expected").GetSingle());
        }

        return data;
    }

    [Theory]
    [MemberData(nameof(PointFixtures))]
    public void RotatePoint_MatchesTheSharedFixture(
        string name, float px, float py, float pivotX, float pivotY, float degrees, float expectedX, float expectedY)
    {
        var (x, y) = RotationMath.RotatePoint(px, py, pivotX, pivotY, degrees);

        Assert.True(Math.Abs(expectedX - x) < 0.001f, $"{name}: x {x} should be {expectedX}");
        Assert.True(Math.Abs(expectedY - y) < 0.001f, $"{name}: y {y} should be {expectedY}");
    }

    [Theory]
    [MemberData(nameof(PointFixtures))]
    public void ToLocal_IsTheInverseOfRotatePoint(
        string name, float px, float py, float pivotX, float pivotY, float degrees, float expectedX, float expectedY)
    {
        _ = (expectedX, expectedY);
        var (rx, ry) = RotationMath.RotatePoint(px, py, pivotX, pivotY, degrees);
        var (x, y) = RotationMath.ToLocal(rx, ry, pivotX, pivotY, degrees);

        Assert.True(Math.Abs(px - x) < 0.001f, $"{name}: x {x} should be back at {px}");
        Assert.True(Math.Abs(py - y) < 0.001f, $"{name}: y {y} should be back at {py}");
    }

    [Theory]
    [MemberData(nameof(PointFixtures))]
    public void Matrix_AgreesWithRotatePoint(
        string name, float px, float py, float pivotX, float pivotY, float degrees, float expectedX, float expectedY)
    {
        // The renderers transform paths, glyphs and gradient stops through the matrix while the
        // layout code uses the point maths; the two must be the same rotation.
        var transformed = Vector2.Transform(new Vector2(px, py), RotationMath.Matrix(pivotX, pivotY, degrees));

        Assert.True(Math.Abs(expectedX - transformed.X) < 0.001f, $"{name}: matrix x {transformed.X} should be {expectedX}");
        Assert.True(Math.Abs(expectedY - transformed.Y) < 0.001f, $"{name}: matrix y {transformed.Y} should be {expectedY}");
    }

    [Theory]
    [MemberData(nameof(ExtentFixtureNames))]
    public void Extent_MatchesTheSharedFixture(string name)
    {
        var element = Fixture().RootElement.GetProperty("extent").EnumerateArray()
            .Single(c => c.GetProperty("name").GetString() == name);
        var expected = element.GetProperty("expected");

        var (x, y, w, h) = RotationMath.Extent(
            element.GetProperty("left").GetSingle(),
            element.GetProperty("top").GetSingle(),
            element.GetProperty("width").GetSingle(),
            element.GetProperty("height").GetSingle(),
            element.GetProperty("pivotX").GetSingle(),
            element.GetProperty("pivotY").GetSingle(),
            element.GetProperty("degrees").GetSingle());

        Assert.Equal(expected.GetProperty("x").GetSingle(), x, 3);
        Assert.Equal(expected.GetProperty("y").GetSingle(), y, 3);
        Assert.Equal(expected.GetProperty("width").GetSingle(), w, 3);
        Assert.Equal(expected.GetProperty("height").GetSingle(), h, 3);
    }

    [Fact]
    public void Extent_ReturnsTheInputExactlyWhenUnrotated()
    {
        // Bit-identical, so an unrotated layer's relative layout is exactly what it was before
        // rotation existed.
        var (x, y, w, h) = RotationMath.Extent(1.1f, 2.2f, 3.3f, 4.4f, 99f, 99f, 0f);

        Assert.Equal(1.1f, x);
        Assert.Equal(2.2f, y);
        Assert.Equal(3.3f, w);
        Assert.Equal(4.4f, h);
    }

    [Theory]
    [MemberData(nameof(NormaliseFixtures))]
    public void Normalise_MatchesTheSharedFixture(float degrees, float expected)
        => Assert.Equal(expected, RotationMath.Normalise(degrees), 4);

    [Fact]
    public void LayerBounds_ExtentIsTheRotatedFootprint()
    {
        var unrotated = new LayerBounds(Guid.NewGuid(), 100, 100, 100, 20, 0, false, null);
        Assert.Equal((100f, 100f, 100f, 20f), unrotated.Extent());
        Assert.Equal(0f, unrotated.Rotation);

        var rotated = new LayerBounds(Guid.NewGuid(), 100, 100, 100, 20, 0, false, null, Rotation: 90, PivotX: 100, PivotY: 100);
        var (x, y, w, h) = rotated.Extent();

        Assert.Equal(80f, x, 3);
        Assert.Equal(100f, y, 3);
        Assert.Equal(20f, w, 3);
        Assert.Equal(100f, h, 3);
    }
}
