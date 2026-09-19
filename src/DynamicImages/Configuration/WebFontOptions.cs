namespace Umbraco.Community.DynamicImages.Configuration;

/// <summary>
/// How web fonts (Google Fonts, Bunny Fonts, direct URLs) are fetched and cached. The file is
/// downloaded the first time a server needs it and kept on that server's disk; it is never
/// copied into the media library.
/// </summary>
public class WebFontOptions
{
    /// <summary>Timeout for one provider CSS or font file request.</summary>
    public int TimeoutSeconds { get; set; } = 15;

    /// <summary>Largest font file accepted - the same cap as an upload.</summary>
    public long MaxBytes { get; set; } = 10 * 1024 * 1024;

    /// <summary>
    /// Where fetched files are cached. Null means <c>umbraco/Data/TEMP/DynamicImages/Fonts</c>
    /// under Umbraco's local temp path, which is per server and disposable.
    /// </summary>
    public string? CacheFolder { get; set; }
}
