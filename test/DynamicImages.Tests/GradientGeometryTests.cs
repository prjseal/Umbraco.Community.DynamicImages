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
}
