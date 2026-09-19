using System.Globalization;
using System.Text.RegularExpressions;

namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

/// <summary>One <c>url(...) format(...)</c> entry in a <c>src</c> declaration.</summary>
public sealed record FontFaceSource(string Url, string? Format);

/// <summary>One <c>@font-face</c> block as a provider's CSS API returns it.</summary>
public sealed record FontFaceBlock(
    string? FontStyle,
    string? FontWeight,
    string? UnicodeRange,
    IReadOnlyList<FontFaceSource> Sources)
{
    /// <summary>
    /// True when this block has no <c>unicode-range</c> (so it is the whole font) or one of its
    /// ranges spans all of U+0000-00FF - the basic Latin subset a provider splits a family into.
    /// </summary>
    public bool CoversLatin => UnicodeRange is null || FontFaceCssParser.RangeCovers(UnicodeRange, 0x0000, 0x00FF);
}

public sealed record FontFaceCss(IReadOnlyList<FontFaceBlock> Blocks, string? Error);

/// <summary>
/// Reads the CSS that Google's and Bunny's CSS APIs return into the blocks it declares. Pure and
/// deliberately narrow - it reads the four declarations the resolver needs, not CSS in general.
/// Bunny answers an unknown family with HTTP 200 and a comment, so a leading
/// <c>/* Error: ... */</c> is surfaced as <see cref="FontFaceCss.Error"/>.
/// </summary>
public static partial class FontFaceCssParser
{
    public static FontFaceCss Parse(string? css)
    {
        if (string.IsNullOrWhiteSpace(css)) return new FontFaceCss([], null);

        var blocks = new List<FontFaceBlock>();

        foreach (Match block in FontFaceBlockPattern().Matches(css))
        {
            string? style = null, weight = null, unicodeRange = null;
            var sources = new List<FontFaceSource>();

            foreach (var declaration in SplitOutsideParentheses(block.Groups["body"].Value, ';'))
            {
                var colon = declaration.IndexOf(':');
                if (colon < 0) continue;

                var name = declaration[..colon].Trim().ToLowerInvariant();
                var value = declaration[(colon + 1)..].Trim();

                switch (name)
                {
                    case "font-style": style = value; break;
                    case "font-weight": weight = value; break;
                    case "unicode-range": unicodeRange = value; break;
                    case "src": sources.AddRange(ParseSources(value)); break;
                }
            }

            blocks.Add(new FontFaceBlock(style, weight, unicodeRange, sources));
        }

        return new FontFaceCss(blocks, blocks.Count == 0 ? LeadingError(css) : null);
    }

    /// <summary>
    /// True when one range in a <c>unicode-range</c> value spans <paramref name="from"/> to
    /// <paramref name="to"/> inclusive. Wildcards (<c>U+4??</c>) expand to their full span.
    /// </summary>
    public static bool RangeCovers(string? unicodeRange, int from, int to)
    {
        if (string.IsNullOrWhiteSpace(unicodeRange)) return false;

        foreach (var part in unicodeRange.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
        {
            if (TryParseRange(part, out var start, out var end) && start <= from && end >= to) return true;
        }

        return false;
    }

    private static bool TryParseRange(string part, out int start, out int end)
    {
        start = end = 0;

        var text = part.Trim();
        if (!text.StartsWith("U+", StringComparison.OrdinalIgnoreCase)) return false;
        text = text[2..];

        if (text.Contains('?'))
        {
            return TryParseHex(text.Replace('?', '0'), out start) && TryParseHex(text.Replace('?', 'F'), out end);
        }

        var dash = text.IndexOf('-');
        if (dash < 0)
        {
            if (!TryParseHex(text, out start)) return false;
            end = start;
            return true;
        }

        return TryParseHex(text[..dash], out start) && TryParseHex(text[(dash + 1)..], out end);
    }

    private static bool TryParseHex(string text, out int value)
        => int.TryParse(text, NumberStyles.HexNumber, CultureInfo.InvariantCulture, out value);

    private static IEnumerable<FontFaceSource> ParseSources(string src)
    {
        foreach (var entry in SplitOutsideParentheses(src, ','))
        {
            var url = UrlPattern().Match(entry);
            if (!url.Success) continue;

            var format = FormatPattern().Match(entry);
            yield return new FontFaceSource(url.Groups["url"].Value.Trim(), format.Success ? format.Groups["format"].Value : null);
        }
    }

    /// <summary>The text of a leading comment that starts with "Error:", if there is one.</summary>
    private static string? LeadingError(string css)
    {
        var comment = LeadingCommentPattern().Match(css);
        if (!comment.Success) return null;

        var lines = comment.Groups["text"].Value
            .Split('\n', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

        if (lines.Length == 0 || !lines[0].StartsWith("Error:", StringComparison.OrdinalIgnoreCase)) return null;

        // Bunny puts the readable part on a "Details:" line under a generic "Error: API Error".
        var details = lines.Skip(1).FirstOrDefault(l => l.StartsWith("Details:", StringComparison.OrdinalIgnoreCase));
        var text = details is not null ? details["Details:".Length..] : lines[0]["Error:".Length..];

        return text.Trim() is { Length: > 0 } trimmed ? trimmed : null;
    }

    /// <summary>Splits on a separator, ignoring ones inside url(...) or format(...).</summary>
    private static IEnumerable<string> SplitOutsideParentheses(string text, char separator)
    {
        var depth = 0;
        var start = 0;

        for (var i = 0; i < text.Length; i++)
        {
            switch (text[i])
            {
                case '(': depth++; break;
                case ')': depth = Math.Max(0, depth - 1); break;
                default:
                    if (text[i] == separator && depth == 0)
                    {
                        yield return text[start..i];
                        start = i + 1;
                    }
                    break;
            }
        }

        yield return text[start..];
    }

    [GeneratedRegex(@"@font-face\s*\{(?<body>[^}]*)\}", RegexOptions.IgnoreCase)]
    private static partial Regex FontFaceBlockPattern();

    [GeneratedRegex(@"url\(\s*['""]?(?<url>[^'""\)]+)['""]?\s*\)", RegexOptions.IgnoreCase)]
    private static partial Regex UrlPattern();

    [GeneratedRegex(@"format\(\s*['""]?(?<format>[^'""\)]+)['""]?\s*\)", RegexOptions.IgnoreCase)]
    private static partial Regex FormatPattern();

    [GeneratedRegex(@"^\s*/\*(?<text>.*?)\*/", RegexOptions.Singleline)]
    private static partial Regex LeadingCommentPattern();
}
