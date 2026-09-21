using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering.Layers;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class BadgesLayoutTests
{
    private static BadgesLayer Badges(
        BadgeLabelPosition position = BadgeLabelPosition.Below,
        BadgeDirection direction = BadgeDirection.Horizontal,
        bool wrap = false,
        float? width = null) => new()
    {
        Name = "Badges",
        ItemsPropertyAlias = "categories",
        Gap = 40,
        RowGap = 20,
        Direction = direction,
        Wrap = wrap,
        Size = new LayerSize { Width = width },
        Badge = new BadgeCircle { Size = 88 },
        Label = new BadgeLabel { FontSize = 22, Gap = 10, Position = position },
    };

    private static readonly float[] LabelWidths = [100f, 50f, 80f];

    [Fact]
    public void LabelsBelow_ReproduceTheFixedWidthRunExactly()
    {
        // The fixed-width layout: every item is one circle wide, and
        // the label height is gap + 1.2 x font size.
        var result = BadgesLayout.Compute(Badges(), 3, hasLabels: true, i => LabelWidths[i]);

        Assert.Equal(3 * 88 + 2 * 40, result.TotalWidth);
        Assert.Equal(88 + 10 + 22 * 1.2f, result.TotalHeight, 3);

        Assert.Equal([0f, 128f, 256f], result.Slots.Select(s => s.Item.X));
        Assert.All(result.Slots, slot =>
        {
            Assert.Equal(88, slot.Item.Width);
            Assert.Equal(0, slot.Circle.Y);
            Assert.NotNull(slot.Label);
            Assert.Equal(98, slot.Label!.Value.Y);
            Assert.Equal(88, slot.Label.Value.Width);
        });
    }

    [Fact]
    public void LabelsBelow_Vertical_StacksItemsWithTheGap()
    {
        var result = BadgesLayout.Compute(Badges(direction: BadgeDirection.Vertical), 3, hasLabels: true, i => LabelWidths[i]);
        var one = 88 + 10 + 22 * 1.2f;

        Assert.Equal(88, result.TotalWidth);
        Assert.Equal(3 * one + 2 * 40, result.TotalHeight, 3);
        Assert.Equal([0f, one + 40, 2 * (one + 40)], result.Slots.Select(s => s.Item.Y));
    }

    [Fact]
    public void NoFont_MeasuresLikeIconOnly()
    {
        var withLabels = BadgesLayout.Compute(Badges(), 2, hasLabels: false, _ => 100);
        var none = BadgesLayout.Compute(Badges(BadgeLabelPosition.None), 2, hasLabels: true, _ => 100);

        Assert.Equal(none.TotalWidth, withLabels.TotalWidth);
        Assert.Equal(none.TotalHeight, withLabels.TotalHeight);
        Assert.Equal(88, none.TotalHeight);
        Assert.All(none.Slots, slot => Assert.Null(slot.Label));
    }

    [Fact]
    public void LabelsRight_MakeEachItemAsWideAsItsLabel()
    {
        var result = BadgesLayout.Compute(Badges(BadgeLabelPosition.Right), 3, hasLabels: true, i => LabelWidths[i]);

        Assert.Equal([88 + 10 + 100f, 88 + 10 + 50f, 88 + 10 + 80f], result.Slots.Select(s => s.Item.Width));
        Assert.Equal(198 + 148 + 178 + 2 * 40, result.TotalWidth);
        Assert.Equal(88, result.TotalHeight);

        var first = result.Slots[0];
        Assert.Equal(98, first.Label!.Value.X);
        Assert.Equal((88 - 22 * 1.2f) / 2, first.Label.Value.Y, 3);
        Assert.Equal(100, first.Label.Value.Width);

        // Items genuinely track the one before them.
        Assert.Equal(198 + 40, result.Slots[1].Item.X);
        Assert.Equal(198 + 40 + 148 + 40, result.Slots[2].Item.X);
    }

    [Fact]
    public void LabelsRight_WithAnEmptyLabel_IsJustTheCircle()
    {
        var result = BadgesLayout.Compute(Badges(BadgeLabelPosition.Right), 1, hasLabels: true, _ => 0);

        var slot = Assert.Single(result.Slots);
        Assert.Equal(88, slot.Item.Width);
        Assert.Null(slot.Label);
    }

    [Fact]
    public void Wrap_PacksRowsAgainstTheWidth()
    {
        // 198, 148 and 178 wide with a 40 gap: the first two fit in 400, the third starts a row.
        var result = BadgesLayout.Compute(Badges(BadgeLabelPosition.Right, wrap: true, width: 400), 3, hasLabels: true, i => LabelWidths[i]);

        Assert.Equal([0f, 0f, 88 + 20f], result.Slots.Select(s => s.Item.Y));
        Assert.Equal([0f, 238f, 0f], result.Slots.Select(s => s.Item.X));

        // The box is the layer's width - what the rows were packed against - and the rows' union in height.
        Assert.Equal(400, result.TotalWidth);
        Assert.Equal(88 + 20 + 88, result.TotalHeight);
    }

    [Fact]
    public void Wrap_WithoutAWidth_StaysOnOneRow()
    {
        var result = BadgesLayout.Compute(Badges(BadgeLabelPosition.Right, wrap: true), 3, hasLabels: true, i => LabelWidths[i]);

        Assert.All(result.Slots, slot => Assert.Equal(0, slot.Item.Y));
        Assert.Equal(198 + 148 + 178 + 2 * 40, result.TotalWidth);
    }

    [Fact]
    public void Wrap_AnItemWiderThanTheRowStillGetsARowOfItsOwn()
    {
        var result = BadgesLayout.Compute(Badges(BadgeLabelPosition.Right, wrap: true, width: 150), 2, hasLabels: true, _ => 300);

        Assert.Equal(0, result.Slots[0].Item.Y);
        Assert.Equal(88 + 20, result.Slots[1].Item.Y);
        Assert.Equal(0, result.Slots[1].Item.X);
    }

    [Fact]
    public void Wrap_IsIgnoredForAColumn()
    {
        var result = BadgesLayout.Compute(Badges(direction: BadgeDirection.Vertical, wrap: true, width: 50), 2, hasLabels: true, _ => 100);

        Assert.Equal(88, result.TotalWidth);
        Assert.Equal([0f, 88 + 10 + 22 * 1.2f + 40], result.Slots.Select(s => s.Item.Y).Select(y => (float)Math.Round(y, 3)));
    }
}
