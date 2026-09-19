namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

/// <summary>Where a provider serves one variant from, or why it could not say.</summary>
public sealed record WebFontResolution(Uri? FileUrl, string? Error)
{
    public static WebFontResolution Found(Uri url) => new(url, null);

    public static WebFontResolution Failed(string error) => new(null, error);
}

/// <summary>
/// Asks Google's or Bunny's CSS API for one family/weight/italic variant and picks the file URL
/// out of the answer. No API key and no catalogue: the CSS API is the lookup.
/// </summary>
public interface IWebFontResolver
{
    Task<WebFontResolution> ResolveAsync(WebFontProvider provider, string family, int weight, bool italic, CancellationToken cancellationToken = default);
}
