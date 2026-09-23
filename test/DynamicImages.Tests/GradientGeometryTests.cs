using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The arithmetic behind both gradient kinds, against hand-computed numbers. These pin the CSS
/// conventions the designer's own preview relies on: if the render and the artboard ever disagree
/// about where a gradient's stops sit, it is one of these numbers that moved.
/// </summary>
public class GradientGeometryTests
{
    private const float Tolerance = 0.001f;

    [Fact]
    public void LinearAxis_At180Degrees_RunsTopToBottom()
    {
        var (start, end) = GradientGeometry.LinearAxis(0, 0, 400, 200, 180f);

        AssertPoint((200f, 0f), start);
        AssertPoint((200f, 200f), end);
    }

    [Fact]
    public void LinearAxis_At90Degrees_RunsLeftToRight()
    {
        var (start, end) = GradientGeometry.LinearAxis(0, 0, 400, 200, 90f);

        AssertPoint((0f, 100f), start);
        AssertPoint((400f, 100f), end);
    }

    [Fact]
    public void LinearAxis_At0Degrees_RunsBottomToTop()
    {
        var (start, end) = GradientGeometry.LinearAxis(0, 0, 400, 200, 0f);

        AssertPoint((200f, 200f), start);
        AssertPoint((200f, 0f), end);
    }

    [Fact]
    public void LinearAxis_IsRelativeToTheBoxNotTheCanvas()
    {
        var (start, end) = GradientGeometry.LinearAxis(100, 50, 400, 200, 180f);

        AssertPoint((300f, 50f), start);
        AssertPoint((300f, 250f), end);
    }

    [Fact]
    public void RadialSemiAxes_Centred_ReachTheFarthestCorner()
    {
        var (centreX, centreY) = GradientGeometry.RadialCentre(0, 0, 400, 200, 0.5f, 0.5f);
        var (a, b) = GradientGeometry.RadialSemiAxes(0, 0, 400, 200, centreX, centreY);

        // farthest-corner, not farthest-side: the ellipse through (200, 100) with the box's own
        // proportions has semi-axes sqrt(2) times each distance.
        Assert.Equal(MathF.Sqrt(2f) * 200f, a, Tolerance);
        Assert.Equal(MathF.Sqrt(2f) * 100f, b, Tolerance);
    }

    [Fact]
    public void RadialSemiAxes_OffCentre_TakeTheFarSide()
    {
        var (centreX, centreY) = GradientGeometry.RadialCentre(0, 0, 400, 200, 0.25f, 0.5f);
        var (a, b) = GradientGeometry.RadialSemiAxes(0, 0, 400, 200, centreX, centreY);

        Assert.Equal(100f, centreX, Tolerance);
        Assert.Equal(MathF.Sqrt(2f) * 300f, a, Tolerance);
        Assert.Equal(MathF.Sqrt(2f) * 100f, b, Tolerance);
    }

    [Theory]
    [InlineData(-1f, 0f)]
    [InlineData(1.5f, 1f)]
    [InlineData(0.25f, 0.25f)]
    public void RadialCentre_ClampsTheFractionToTheBox(float fraction, float expected)
    {
        var (centreX, _) = GradientGeometry.RadialCentre(0, 0, 400, 200, fraction, 0.5f);

        Assert.Equal(400f * expected, centreX, Tolerance);
    }

    [Fact]
    public void RadialSemiAxes_AtTheEdge_StayPositive()
    {
        // A centre dragged to an edge is the degenerate case; it must still describe an ellipse
        // the brush can draw rather than a zero or negative axis.
        var (centreX, centreY) = GradientGeometry.RadialCentre(0, 0, 400, 200, 2f, -2f);
        var (a, b) = GradientGeometry.RadialSemiAxes(0, 0, 400, 200, centreX, centreY);

        Assert.True(a > 0f && b > 0f, $"semi-axes {a} x {b} should both be positive");
        Assert.Equal(MathF.Sqrt(2f) * 400f, a, Tolerance);
        Assert.Equal(MathF.Sqrt(2f) * 200f, b, Tolerance);
    }

    private static void AssertPoint((float X, float Y) expected, (float X, float Y) actual)
    {
        Assert.Equal(expected.X, actual.X, Tolerance);
        Assert.Equal(expected.Y, actual.Y, Tolerance);
    }

    // ------------------------------------------------------------ extents, shapes and new kinds
    //
    // A 400 x 200 box with its centre at (100, 50): 100 to the left side, 300 to the right,
    // 50 to the top, 150 to the bottom.

    [Theory]
    [InlineData(GradientExtent.ClosestSide, 100f, 50f)]
    [InlineData(GradientExtent.FarthestSide, 300f, 150f)]
    [InlineData(GradientExtent.ClosestCorner, 141.421f, 70.711f)]
    [InlineData(GradientExtent.FarthestCorner, 424.264f, 212.132f)]
    public void RadialSemiAxes_FollowEachCssExtent(GradientExtent extent, float semiMajor, float semiMinor)
    {
        var (a, b) = GradientGeometry.RadialSemiAxes(0, 0, 400, 200, 100, 50, extent);

        Assert.Equal(semiMajor, a, 0.01f);
        Assert.Equal(semiMinor, b, 0.01f);
    }

    [Theory]
    [InlineData(GradientExtent.ClosestSide, 50f)]
    [InlineData(GradientExtent.FarthestSide, 300f)]
    [InlineData(GradientExtent.ClosestCorner, 111.803f)]
    [InlineData(GradientExtent.FarthestCorner, 335.410f)]
    public void RadialCircleRadius_FollowsEachCssExtent(GradientExtent extent, float radius)
        => Assert.Equal(radius, GradientGeometry.RadialCircleRadius(0, 0, 400, 200, 100, 50, extent), 0.01f);

    [Fact]
    public void RadialSemiAxes_OnAnEdge_KeepAHalfPixelFloor()
    {
        var (a, _) = GradientGeometry.RadialSemiAxes(0, 0, 400, 200, 0, 100, GradientExtent.ClosestSide);

        Assert.Equal(0.5f, a);
    }

    [Theory]
    [InlineData(0f, -10f, 0f, 0f)]      // straight up is where a sweep from 0 starts
    [InlineData(10f, 0f, 0f, 0.25f)]    // right is a quarter turn clockwise
    [InlineData(0f, 10f, 0f, 0.5f)]
    [InlineData(-10f, 0f, 0f, 0.75f)]
    [InlineData(10f, 0f, 90f, 0f)]      // starting at 90 degrees moves the seam to the right
    [InlineData(0f, -10f, 90f, 0.75f)]
    public void AngularPosition_IsTheBearingClockwiseFromTheStartAngle(float dx, float dy, float start, float expected)
        => Assert.Equal(expected, GradientGeometry.AngularPosition(100 + dx, 50 + dy, 100, 50, start), Tolerance);

    [Theory]
    [InlineData(100f, 50f, 0f)]    // the centre
    [InlineData(0f, 50f, 1f)]      // the left side, 100 away
    [InlineData(400f, 50f, 1f)]    // the right side, 300 away: each quadrant scales to its own reach
    [InlineData(100f, 0f, 1f)]     // the top
    [InlineData(250f, 125f, 1f)]   // half way to the right and half way down: on the diamond's edge
    [InlineData(175f, 50f, 0.25f)]
    [InlineData(0f, 0f, 2f)]       // a corner is past the last stop
    public void DiamondPosition_ReachesOneOnTheDiamondThroughTheFourSides(float px, float py, float expected)
        => Assert.Equal(expected, GradientGeometry.DiamondPosition(px, py, 0, 0, 400, 200, 100, 50), Tolerance);

    [Fact]
    public void ReflectedStops_MirrorAboutTheMiddle()
    {
        var stops = GradientGeometry.ReflectedStops([("#A", 0f), ("#B", 0.4f), ("#C", 1f)]);

        Assert.Equal(
            [("#C", 0f), ("#B", 0.3f), ("#A", 0.5f), ("#A", 0.5f), ("#B", 0.7f), ("#C", 1f)],
            stops.Select(s => (s.Colour, MathF.Round(s.Position, 3))));
    }

    [Fact]
    public void EffectiveStops_WithoutStops_AreFromAndTo()
    {
        var stops = GradientGeometry.EffectiveStops(new Gradient { From = "#FF0000", To = "#0000FF" });

        Assert.Equal([("#FF0000", 0f), ("#0000FF", 1f)], stops);
    }

    [Fact]
    public void EffectiveStops_WithStops_AreSortedAndClamped()
    {
        var gradient = new Gradient
        {
            From = "#IGNORED",
            Stops = [new GradientStop { Colour = "#C", Position = 1.5f }, new GradientStop { Colour = "#A", Position = -1f }, new GradientStop { Colour = "#B", Position = 0.5f }]
        };

        Assert.Equal([("#A", 0f), ("#B", 0.5f), ("#C", 1f)], GradientGeometry.EffectiveStops(gradient));
    }

    [Fact]
    public void EffectiveStops_WithASingleStop_FallBackToFromAndTo()
    {
        var gradient = new Gradient { From = "#FF0000", To = "#0000FF", Stops = [new GradientStop { Colour = "#00FF00" }] };

        Assert.Equal(2, GradientGeometry.EffectiveStops(gradient).Count);
        Assert.Equal("#FF0000", GradientGeometry.EffectiveStops(gradient)[0].Colour);
    }
}
