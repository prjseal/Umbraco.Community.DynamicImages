using SixLabors.ImageSharp;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering.Layers;

/// <summary>One badge's place in the run, all offsets from the run's top-left corner.</summary>
public readonly record struct BadgeSlot(int Index, RectangleF Item, RectangleF Circle, RectangleF? Label);

public sealed record BadgesLayoutResult(float TotalWidth, float TotalHeight, IReadOnlyList<BadgeSlot> Slots);

/// <summary>
/// The geometry of a badges layer: how big each item is, where it sits in the row or column, and
/// how big the whole run is. Pure, so the renderer's draw and measure paths and the tests share
/// one set of numbers. A label below its circle keeps v1's fixed-width items exactly; a label to
/// the right makes each item as wide as its text, and wrapping packs rows against the layer's width.
/// </summary>
public static class BadgesLayout
{
    /// <summary>Line box of a label relative to its font size - the same 1.2 the designer's DOM uses.</summary>
    public const float LabelLineFactor = 1.2f;

    /// <param name="badges">The layer.</param>
    /// <param name="itemCount">How many badges will be drawn.</param>
    /// <param name="hasLabels">Whether labels are drawn at all - false without a font or when the position is none.</param>
    /// <param name="labelWidthOf">Measured width of an item's label; only consulted for labels to the right.</param>
    public static BadgesLayoutResult Compute(BadgesLayer badges, int itemCount, bool hasLabels, Func<int, float> labelWidthOf)
    {
        var circle = badges.Badge.Size;
        var labelLine = badges.Label.FontSize * LabelLineFactor;
        var labelGap = badges.Label.Gap;
        var position = hasLabels ? badges.Label.Position : BadgeLabelPosition.None;
        var horizontal = badges.Direction == BadgeDirection.Horizontal;
        var wrapWidth = horizontal && badges.Wrap ? badges.Size.Width : null;

        var slots = new List<BadgeSlot>(itemCount);
        float x = 0, y = 0, rowHeight = 0, maxRight = 0, maxBottom = 0;

        for (var index = 0; index < itemCount; index++)
        {
            var (itemWidth, itemHeight, labelWidth) = position switch
            {
                BadgeLabelPosition.Below => (circle, circle + labelGap + labelLine, circle),
                BadgeLabelPosition.Right => RightOfItem(circle, labelGap, labelLine, labelWidthOf(index)),
                _ => (circle, circle, 0f)
            };

            if (horizontal && wrapWidth is { } limit && x > 0 && x + itemWidth > limit)
            {
                // Start a new row. A single item wider than the whole width still gets its own row.
                y += rowHeight + badges.RowGap;
                x = 0;
                rowHeight = 0;
            }

            var item = new RectangleF(x, y, itemWidth, itemHeight);

            // A label below hangs off the circle's bottom, so the circle sits at the top; a label
            // to the right is centred on the circle, so the two share a middle.
            var circleY = position == BadgeLabelPosition.Right ? y + (itemHeight - circle) / 2f : y;
            var circleRect = new RectangleF(x, circleY, circle, circle);

            RectangleF? label = position switch
            {
                BadgeLabelPosition.Below => new RectangleF(x, y + circle + labelGap, circle, labelLine),
                BadgeLabelPosition.Right when labelWidth > 0 =>
                    new RectangleF(x + circle + labelGap, y + (itemHeight - labelLine) / 2f, labelWidth, labelLine),
                _ => null
            };

            slots.Add(new BadgeSlot(index, item, circleRect, label));

            maxRight = Math.Max(maxRight, x + itemWidth);
            maxBottom = Math.Max(maxBottom, y + itemHeight);

            if (horizontal)
            {
                x += itemWidth + badges.Gap;
                rowHeight = Math.Max(rowHeight, itemHeight);
            }
            else
            {
                y += itemHeight + badges.Gap;
            }
        }

        // When wrapping, the layer's width is the box - that is what the rows were packed against
        // and what the designer shows. Otherwise the run is exactly as big as its items.
        var totalWidth = wrapWidth ?? maxRight;

        return new BadgesLayoutResult(totalWidth, maxBottom, slots);
    }

    private static (float Width, float Height, float LabelWidth) RightOfItem(float circle, float gap, float labelLine, float labelWidth)
        => labelWidth > 0
            ? (circle + gap + labelWidth, Math.Max(circle, labelLine), labelWidth)
            : (circle, circle, 0f);
}
