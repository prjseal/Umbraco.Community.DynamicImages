using System.Text.RegularExpressions;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Estimates reading time from rich text or block JSON, at 200 words per minute.
/// </summary>
public static partial class ReadingTime
{
    public const int WordsPerMinute = 200;

    public static string Estimate(string? raw)
    {
        var minutes = Minutes(raw);
        return $"{minutes} min read";
    }

    public static int Minutes(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return 1;

        // Strip markup, then punctuation, then count anything containing a letter. Crude, but it
        // copes with both rich text HTML and the JSON of a block list without parsing either.
        var withoutTags = TagPattern().Replace(raw, " ");
        var withoutPunctuation = NonWordPattern().Replace(withoutTags, " ");
        var words = withoutPunctuation
            .Split([' ', '\t', '\n', '\r'], StringSplitOptions.RemoveEmptyEntries)
            .Count(w => w.Any(char.IsLetter));

        return Math.Max(1, (int)Math.Ceiling(words / (double)WordsPerMinute));
    }

    [GeneratedRegex("<[^>]+>")]
    private static partial Regex TagPattern();

    [GeneratedRegex(@"[^\w\s]")]
    private static partial Regex NonWordPattern();
}
