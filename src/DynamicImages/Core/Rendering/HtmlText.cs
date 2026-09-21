using System.Net;
using System.Text.RegularExpressions;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Turns a rich text value into the plain text a text layer can draw, rather than
/// handing the raw markup to ImageSharp, which would render the tags.
/// </summary>
public static partial class HtmlText
{
    public static string ToPlainText(string? html)
    {
        if (string.IsNullOrWhiteSpace(html)) return string.Empty;

        // Block-level boundaries become line breaks before the tags go, so paragraphs do not run
        // into one another.
        var withBreaks = BlockBoundaryPattern().Replace(html, "\n");
        var withoutTags = TagPattern().Replace(withBreaks, string.Empty);
        var decoded = WebUtility.HtmlDecode(withoutTags);

        return WhitespacePattern().Replace(decoded, " ").Trim();
    }

    /// <summary>True when the value looks like markup rather than a plain string.</summary>
    public static bool LooksLikeHtml(string? value)
        => !string.IsNullOrWhiteSpace(value) && TagPattern().IsMatch(value);

    [GeneratedRegex(@"</\s*(p|div|h[1-6]|li|br|tr)\s*>|<\s*br\s*/?\s*>", RegexOptions.IgnoreCase)]
    private static partial Regex BlockBoundaryPattern();

    [GeneratedRegex("<[^>]+>")]
    private static partial Regex TagPattern();

    [GeneratedRegex(@"[ \t\f\v]+")]
    private static partial Regex WhitespacePattern();
}
