using System.Text.Json;
using SixLabors.Fonts;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class AnchorMathTests
{
    private sealed record Fixture(string Anchor, float X, float Y, float Width, float Height, float ExpectedLeft, float ExpectedTop);

    /// <summary>
    /// The same file the client's anchor.test.ts asserts against. If either side of the anchor
    /// contract drifts, one of the two suites fails - which is the whole point of sharing it.
    /// </summary>
    public static TheoryData<string, float, float, float, float, float, float> Fixtures()
    {
        var json = File.ReadAllText("anchor-fixtures.json");
        using var document = JsonDocument.Parse(json);

        var data = new TheoryData<string, float, float, float, float, float, float>();

        foreach (var element in document.RootElement.GetProperty("cases").EnumerateArray())
        {
            data.Add(
                element.GetProperty("anchor").GetString()!,
                element.GetProperty("x").GetSingle(),
                element.GetProperty("y").GetSingle(),
                element.GetProperty("width").GetSingle(),
                element.GetProperty("height").GetSingle(),
                element.GetProperty("expectedLeft").GetSingle(),
                element.GetProperty("expectedTop").GetSingle());
        }

        return data;
    }

    [Theory]
    [MemberData(nameof(Fixtures))]
    public void ToTopLeft_MatchesTheSharedFixture(
        string anchorName, float x, float y, float width, float height, float expectedLeft, float expectedTop)
    {
        var anchor = ParseAnchor(anchorName);
        var (left, top) = AnchorMath.ToTopLeft(new Position { X = x, Y = y, Anchor = anchor }, width, height);

        Assert.Equal(expectedLeft, left, 3);
        Assert.Equal(expectedTop, top, 3);
    }

    [Theory]
    [MemberData(nameof(Fixtures))]
    public void FromTopLeft_IsTheInverseOfToTopLeft(
        string anchorName, float x, float y, float width, float height, float expectedLeft, float expectedTop)
    {
        var anchor = ParseAnchor(anchorName);
        var (backX, backY) = AnchorMath.FromTopLeft(expectedLeft, expectedTop, width, height, anchor);

        Assert.Equal(x, backX, 3);
        Assert.Equal(y, backY, 3);
    }

    [Theory]
    [InlineData(Anchor.TopLeft, HorizontalAlignment.Left, VerticalAlignment.Top)]
    [InlineData(Anchor.TopCentre, HorizontalAlignment.Center, VerticalAlignment.Top)]
    [InlineData(Anchor.TopRight, HorizontalAlignment.Right, VerticalAlignment.Top)]
    [InlineData(Anchor.MiddleLeft, HorizontalAlignment.Left, VerticalAlignment.Center)]
    [InlineData(Anchor.MiddleCentre, HorizontalAlignment.Center, VerticalAlignment.Center)]
    [InlineData(Anchor.BottomRight, HorizontalAlignment.Right, VerticalAlignment.Bottom)]
    public void Alignments_FollowTheAnchor(Anchor anchor, HorizontalAlignment horizontal, VerticalAlignment vertical)
    {
        // The renderer relies on these matching the axis factors: ImageSharp aligns the text block
        // around Origin using exactly the same proportion the anchor maths subtracts.
        Assert.Equal(horizontal, AnchorMath.ToHorizontalAlignment(anchor));
        Assert.Equal(vertical, AnchorMath.ToVerticalAlignment(anchor));
    }

    [Fact]
    public void AxisFactors_AreZeroHalfOne()
    {
        Assert.Equal(0f, AnchorMath.AxisX(Anchor.BottomLeft));
        Assert.Equal(0.5f, AnchorMath.AxisX(Anchor.TopCentre));
        Assert.Equal(1f, AnchorMath.AxisX(Anchor.MiddleRight));

        Assert.Equal(0f, AnchorMath.AxisY(Anchor.TopRight));
        Assert.Equal(0.5f, AnchorMath.AxisY(Anchor.MiddleCentre));
        Assert.Equal(1f, AnchorMath.AxisY(Anchor.BottomLeft));
    }

    [Fact]
    public void Compose_IsTheInverseOfTheAxisFactors()
    {
        // Relative positioning splits an anchor into its two factors, forces one, and puts them
        // back together - so every anchor has to survive the round trip.
        foreach (var anchor in Enum.GetValues<Anchor>())
        {
            Assert.Equal(anchor, AnchorMath.Compose(AnchorMath.AxisX(anchor), AnchorMath.AxisY(anchor)));
        }
    }

    [Theory]
    [InlineData(0f, 1f, Anchor.BottomLeft)]
    [InlineData(1f, 0f, Anchor.TopRight)]
    [InlineData(0.5f, 0f, Anchor.TopCentre)]
    [InlineData(0f, 0.5f, Anchor.MiddleLeft)]
    public void Compose_BuildsTheAnchorFromForcedFactors(float axisX, float axisY, Anchor expected)
        => Assert.Equal(expected, AnchorMath.Compose(axisX, axisY));

    private static Anchor ParseAnchor(string name)
        => Enum.Parse<Anchor>(name, ignoreCase: true);
}
