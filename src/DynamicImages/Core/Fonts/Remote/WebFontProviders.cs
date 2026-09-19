using System.Net;
using System.Text.RegularExpressions;

namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

/// <summary>
/// One web font provider: how to ask its CSS API for a variant and which host its files live on.
/// <see cref="CssUrl"/> and <see cref="FileHost"/> are null for the direct-URL provider, which
/// has no API - the editor supplies the file URL.
/// </summary>
public sealed record WebFontProvider(
    string Name,
    string DisplayName,
    Func<string, int, bool, Uri>? CssUrl,
    string? FileHost)
{
    /// <summary>True when a resolved file URL is on the host this provider serves files from.</summary>
    public bool AllowsFileUrl(Uri url)
        => FileHost is null
            ? url.Scheme == Uri.UriSchemeHttps
            : url.Scheme == Uri.UriSchemeHttps && string.Equals(url.Host, FileHost, StringComparison.OrdinalIgnoreCase);
}

/// <summary>
/// The three providers as a static table. Three tiny descriptors are simpler than an interface
/// and a DI collection for something that is not meant to be extended.
/// </summary>
public static partial class WebFontProviders
{
    public const string GoogleName = "google";
    public const string BunnyName = "bunny";
    public const string DirectName = "direct";

    /// <summary>Longest URL a font row stores; the column is 2000 characters.</summary>
    public const int MaxUrlLength = 2000;

    public static readonly WebFontProvider Google = new(
        GoogleName,
        "Google Fonts",
        // One variant per request: css2 wants its axes in a fixed order and answers a bad one
        // with a 400 for the whole request, so asking per variant gives per-variant errors.
        (family, weight, italic) => new Uri(
            $"https://fonts.googleapis.com/css2?family={Uri.EscapeDataString(family.Trim()).Replace("%20", "+")}:ital,wght@{(italic ? 1 : 0)},{weight}"),
        "fonts.gstatic.com");

    public static readonly WebFontProvider Bunny = new(
        BunnyName,
        "Bunny Fonts",
        (family, weight, italic) => new Uri(
            $"https://fonts.bunny.net/css?family={BunnySlug(family)}:{weight}{(italic ? "i" : string.Empty)}"),
        "fonts.bunny.net");

    public static readonly WebFontProvider Direct = new(DirectName, "Direct URL", null, null);

    public static readonly IReadOnlyList<WebFontProvider> All = [Google, Bunny, Direct];

    public static WebFontProvider? Get(string? name)
        => All.FirstOrDefault(p => string.Equals(p.Name, name?.Trim(), StringComparison.OrdinalIgnoreCase));

    /// <summary>Bunny keys families by slug: "Open Sans" is <c>open-sans</c>.</summary>
    public static string BunnySlug(string family)
        => SlugSeparators().Replace(family.Trim().ToLowerInvariant(), "-").Trim('-');

    /// <summary>
    /// Checks a direct font URL before it is stored or fetched. Returns the problem, or null when
    /// it is acceptable. Rejections: not https, a user:password@ part, a bare host with no dot
    /// (which would resolve on the server's own network), or an IP literal.
    /// </summary>
    public static string? ValidateDirectUrl(string? url, out Uri? uri)
    {
        uri = null;
        var text = url?.Trim();

        if (string.IsNullOrEmpty(text)) return "Enter the URL of a font file.";
        if (text.Length > MaxUrlLength) return $"The URL is longer than {MaxUrlLength} characters.";

        if (!Uri.TryCreate(text, UriKind.Absolute, out var parsed) || parsed.Scheme != Uri.UriSchemeHttps)
        {
            return "The URL must start with https://.";
        }

        if (!string.IsNullOrEmpty(parsed.UserInfo)) return "The URL must not contain a username or password.";

        if (parsed.HostNameType != UriHostNameType.Dns || !parsed.Host.Contains('.') || IPAddress.TryParse(parsed.Host, out _))
        {
            return "The URL must use a public host name, not an IP address or a bare host.";
        }

        uri = parsed;
        return null;
    }

    [GeneratedRegex("[^a-z0-9]+")]
    private static partial Regex SlugSeparators();
}
