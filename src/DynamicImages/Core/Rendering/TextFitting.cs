using SixLabors.Fonts;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>Result of fitting a string into a text layer's box.</summary>
public sealed record FittedText(string Text, float FontSize, int LineCount, bool Truncated);

/// <summary>
/// Makes text fit a layer's width and <see cref="TextStyle.MaxLines"/>. ImageSharp has no
/// ellipsis or line clamp of its own, and OG titles overflow constantly, so this measures with
/// <see cref="TextMeasurer"/> and either trims words or steps the size down.
/// </summary>
public static class TextFitting
{
    /// <summary>Never shrink below this fraction of the configured size - past it the design stops reading as designed.</summary>
    public const float MinimumShrinkFactor = 0.6f;

    private const string Ellipsis = "…";

    public static FittedText Fit(string text, Font font, TextStyle style, float? wrappingWidth)
    {
        if (string.IsNullOrEmpty(text))
        {
            return new FittedText(text, font.Size, 0, false);
        }

        // A rich-text body bound to a text layer arrives whole - thousands of words, of which a
        // canvas this size can show tens. Capping here bounds every layout below it, and the
        // ellipsis path is the same one an overlong title already takes.
        text = Cap(text);

        var lines = CountLines(text, font, style, wrappingWidth);
        if (style.MaxLines is not > 0 || lines <= style.MaxLines)
        {
            return new FittedText(text, font.Size, lines, false);
        }

        var maxLines = style.MaxLines.Value;

        switch (style.Overflow)
        {
            case TextOverflow.Shrink:
                return Shrink(text, font, style, wrappingWidth, maxLines);

            case TextOverflow.Clip:
                return new FittedText(TrimToLines(text, font, style, wrappingWidth, maxLines, appendEllipsis: false), font.Size, maxLines, true);

            default:
                return new FittedText(TrimToLines(text, font, style, wrappingWidth, maxLines, appendEllipsis: true), font.Size, maxLines, true);
        }
    }

    private static FittedText Shrink(string text, Font font, TextStyle style, float? wrappingWidth, int maxLines)
    {
        var floor = font.Size * MinimumShrinkFactor;

        // One point at a time: the step is small enough that the chosen size is the largest that
        // fits, and the loop is bounded by 40% of the font size.
        for (var size = font.Size - 1f; size >= floor; size -= 1f)
        {
            var candidate = new Font(font.Family, size, StyleOf(font));
            var lines = CountLines(text, candidate, style, wrappingWidth);
            if (lines <= maxLines)
            {
                return new FittedText(text, size, lines, false);
            }
        }

        // Still too tall at the floor - shrink as far as allowed, then ellipsise the remainder.
        var smallest = new Font(font.Family, floor, StyleOf(font));
        var trimmed = TrimToLines(text, smallest, style, wrappingWidth, maxLines, appendEllipsis: true);
        return new FittedText(trimmed, floor, maxLines, true);
    }

    /// <summary>
    /// Truncates <paramref name="text"/> to <see cref="RenderLimits.MaxTextLength"/> characters on
    /// a word boundary. No ellipsis is added here - whatever survives still goes through the fit,
    /// which adds one if the layer's line limit also bites.
    /// </summary>
    private static string Cap(string text)
    {
        if (text.Length <= RenderLimits.MaxTextLength) return text;

        var cut = text.LastIndexOf(' ', RenderLimits.MaxTextLength);

        // A single unbroken run longer than the cap has no word boundary to fall back on, so it
        // is cut mid-word rather than kept whole.
        return cut <= 0 ? text[..RenderLimits.MaxTextLength] : text[..cut];
    }

    private static string TrimToLines(string text, Font font, TextStyle style, float? wrappingWidth, int maxLines, bool appendEllipsis)
    {
        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (words.Length == 0) return text;

        // Line count is monotonic in word count - adding a word never makes the block shorter -
        // so the largest word count that still fits can be found by bisection rather than by
        // dropping one word at a time. That turns O(words) full layouts into O(log words), which
        // is what makes a long body affordable. `low` is always a count known to fit (one word,
        // the floor the old loop fell through to) and `high` one known not to.
        var low = 1;
        var high = words.Length;

        while (high - low > 1)
        {
            var mid = low + (high - low) / 2;
            if (CountLines(Candidate(words, mid, appendEllipsis), font, style, wrappingWidth) <= maxLines)
            {
                low = mid;
            }
            else
            {
                high = mid;
            }
        }

        return Candidate(words, low, appendEllipsis);
    }

    /// <summary>The first <paramref name="count"/> words, ellipsised the way the caller asked.</summary>
    private static string Candidate(string[] words, int count, bool appendEllipsis)
    {
        var candidate = string.Join(' ', words.Take(count));
        return appendEllipsis ? candidate.TrimEnd(',', ';', ':', '-', '–') + Ellipsis : candidate;
    }

    /// <summary>Number of laid-out lines, honouring the same wrapping and spacing the renderer uses.</summary>
    public static int CountLines(string text, Font font, TextStyle style, float? wrappingWidth)
    {
        if (string.IsNullOrEmpty(text)) return 0;

        var options = new TextOptions(font)
        {
            WrappingLength = wrappingWidth ?? -1,
            LineSpacing = style.LineSpacing <= 0 ? 1f : style.LineSpacing
        };

        var bounds = TextMeasurer.MeasureBounds(text, options);
        var lineHeight = font.FontMetrics.HorizontalMetrics.LineHeight / (float)font.FontMetrics.UnitsPerEm
            * font.Size * (style.LineSpacing <= 0 ? 1f : style.LineSpacing);

        if (lineHeight <= 0) return 1;

        // MeasureBounds gives the ink extent; rounding up against the line height recovers the
        // line count without re-running the layout engine ourselves.
        return Math.Max(1, (int)Math.Round(bounds.Height / lineHeight, MidpointRounding.AwayFromZero));
    }

    /// <summary>The style a loaded font resolved to, for building a resized copy of it.</summary>
    public static FontStyle StyleOf(Font font) => (font.IsBold, font.IsItalic) switch
    {
        (true, true) => FontStyle.BoldItalic,
        (true, false) => FontStyle.Bold,
        (false, true) => FontStyle.Italic,
        _ => FontStyle.Regular
    };

    public static string ApplyTransform(string text, TextTransform transform) => transform switch
    {
        TextTransform.Uppercase => text.ToUpperInvariant(),
        TextTransform.Lowercase => text.ToLowerInvariant(),
        _ => text
    };
}
