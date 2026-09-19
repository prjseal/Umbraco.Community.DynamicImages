using System.Globalization;
using System.Text.RegularExpressions;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Turns a <see cref="TextBinding"/> into the string a text layer draws. The expression kind
/// subsumes v1's "SuffixText containing {readingTime}" special case with a general token syntax.
/// </summary>
public static partial class TextResolver
{
    public const string DefaultReadingTimeProperty = "mainContent";

    public static string Resolve(TextBinding binding, IRenderValueSource source) => binding.Kind switch
    {
        TextBindingKind.NodeName => source.Name ?? string.Empty,

        TextBindingKind.ReadingTime => source.GetReadingTime(binding.PropertyAlias ?? DefaultReadingTimeProperty),

        TextBindingKind.Static => binding.Text ?? string.Empty,

        TextBindingKind.Expression => ResolveExpression(binding.Text, source),

        TextBindingKind.Date => FormatDate(
            string.IsNullOrWhiteSpace(binding.PropertyAlias) ? null : source.GetDate(binding.PropertyAlias),
            binding.Format,
            binding.Culture),

        _ => ResolveProperty(binding.PropertyAlias, source)
    };

    private static string ResolveProperty(string? alias, IRenderValueSource source)
    {
        if (string.IsNullOrWhiteSpace(alias)) return string.Empty;

        var value = source.GetText(alias);
        return HtmlText.LooksLikeHtml(value) ? HtmlText.ToPlainText(value) : value ?? string.Empty;
    }

    private static string FormatDate(DateTime? date, string? format, string? culture)
    {
        if (date is null) return string.Empty;

        var cultureInfo = string.IsNullOrWhiteSpace(culture)
            ? CultureInfo.InvariantCulture
            : CultureInfo.GetCultureInfo(culture);

        return string.IsNullOrWhiteSpace(format)
            ? date.Value.ToString(cultureInfo)
            : date.Value.ToString(format, cultureInfo);
    }

    /// <summary>
    /// Replaces {name}, {readingTime}, {prop:alias} and {date:alias:format} in a token string.
    /// An unknown token resolves to an empty string rather than being left on the image.
    /// </summary>
    public static string ResolveExpression(string? expression, IRenderValueSource source)
    {
        if (string.IsNullOrWhiteSpace(expression)) return string.Empty;

        return TokenPattern().Replace(expression, match =>
        {
            var token = match.Groups["token"].Value;
            var parts = token.Split(':', 3);

            switch (parts[0].ToLowerInvariant())
            {
                case "name":
                    return source.Name ?? string.Empty;

                case "readingtime":
                    return source.GetReadingTime(parts.Length > 1 ? parts[1] : DefaultReadingTimeProperty);

                case "prop" when parts.Length > 1:
                    return ResolveProperty(parts[1], source);

                case "date" when parts.Length > 1:
                    return FormatDate(source.GetDate(parts[1]), parts.Length > 2 ? parts[2] : null, null);

                default:
                    return string.Empty;
            }
        });
    }

    /// <summary>The property aliases an expression references, for validation and the usage view.</summary>
    public static IEnumerable<string> ReferencedAliases(string? expression)
    {
        if (string.IsNullOrWhiteSpace(expression)) yield break;

        foreach (Match match in TokenPattern().Matches(expression))
        {
            var parts = match.Groups["token"].Value.Split(':', 3);
            if (parts.Length > 1 && (parts[0].Equals("prop", StringComparison.OrdinalIgnoreCase) ||
                                     parts[0].Equals("date", StringComparison.OrdinalIgnoreCase)))
            {
                yield return parts[1];
            }
        }
    }

    [GeneratedRegex(@"\{(?<token>[^{}]+)\}")]
    private static partial Regex TokenPattern();
}
