using System.Net;

namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

public sealed class WebFontResolver(IHttpClientFactory httpClientFactory, ILogger<WebFontResolver> logger) : IWebFontResolver
{
    /// <summary>
    /// SixLabors.Fonts reads all of these; a full TrueType/OpenType file is preferred because it
    /// is the whole font, then woff2 (what Bunny serves) over the larger woff.
    /// </summary>
    private static readonly string[] FormatPreference = ["truetype", "opentype", "woff2", "woff"];

    public async Task<WebFontResolution> ResolveAsync(WebFontProvider provider, string family, int weight, bool italic, CancellationToken cancellationToken = default)
    {
        if (provider.CssUrl is null)
        {
            return WebFontResolution.Failed($"{provider.DisplayName} fonts are registered by their file URL, not looked up.");
        }

        var variant = $"weight {weight}{(italic ? " italic" : string.Empty)}";
        var cssUrl = provider.CssUrl(family, weight, italic);

        string css;
        try
        {
            using var client = httpClientFactory.CreateClient(DynamicImagesConstants.WebFontHttpClientName);
            using var response = await client.GetAsync(cssUrl, cancellationToken);

            // Google answers an unknown family or an unavailable weight with a 400 and an HTML
            // page; the request itself is the only readable thing about it.
            if (response.StatusCode == HttpStatusCode.BadRequest)
            {
                return WebFontResolution.Failed($"'{family}' has no {variant} on {provider.DisplayName}.");
            }

            if (!response.IsSuccessStatusCode)
            {
                return WebFontResolution.Failed($"{provider.DisplayName} answered {(int)response.StatusCode} for '{family}' {variant}.");
            }

            css = await response.Content.ReadAsStringAsync(cancellationToken);
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
        {
            logger.LogWarning(ex, "Dynamic Images: {Provider} could not be reached at {Url}", provider.DisplayName, cssUrl);
            return WebFontResolution.Failed($"{provider.DisplayName} could not be reached. Check the site has outbound HTTPS access.");
        }

        var parsed = FontFaceCssParser.Parse(css);

        if (parsed.Blocks.Count == 0)
        {
            // Bunny: HTTP 200 with an error comment for an unknown family or weight, or an empty
            // body - in either case there is nothing to serve.
            return WebFontResolution.Failed(parsed.Error is not null
                ? $"{provider.DisplayName} rejected '{family}' {variant}: {parsed.Error}"
                : $"'{family}' has no {variant} on {provider.DisplayName}.");
        }

        // A block with no unicode-range is the whole font (Google); otherwise the Latin subset
        // (Bunny), which is documented as the only one a Bunny font renders.
        var block = parsed.Blocks.FirstOrDefault(b => b.UnicodeRange is null)
            ?? parsed.Blocks.FirstOrDefault(b => b.CoversLatin);

        if (block is null)
        {
            return WebFontResolution.Failed($"'{family}' {variant} on {provider.DisplayName} has no Latin subset.");
        }

        var source = block.Sources
            .OrderBy(s => Array.IndexOf(FormatPreference, s.Format?.ToLowerInvariant()) is var i and >= 0 ? i : int.MaxValue)
            .FirstOrDefault();

        if (source is null || !Uri.TryCreate(source.Url, UriKind.Absolute, out var fileUrl))
        {
            return WebFontResolution.Failed($"{provider.DisplayName} returned no usable file for '{family}' {variant}.");
        }

        // The file must come from the provider's own host - the CSS is trusted only that far.
        if (!provider.AllowsFileUrl(fileUrl))
        {
            return WebFontResolution.Failed($"{provider.DisplayName} pointed '{family}' at an unexpected host ({fileUrl.Host}).");
        }

        return WebFontResolution.Found(fileUrl);
    }
}
