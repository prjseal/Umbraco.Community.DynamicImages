using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Fonts;

/// <summary>
/// Reads a font's bytes from wherever it lives. Media items go through Umbraco's media file
/// system so they work on Cloud's blob storage; wwwroot paths keep developer-committed and
/// package-shipped fonts working; url fonts are fetched once per server and cached on its disk.
/// </summary>
public interface IFontFileProvider
{
    /// <summary>Opens the font file, or returns null when it cannot be found, fetched or read.</summary>
    Task<Stream?> OpenAsync(FontDefinition font, CancellationToken cancellationToken = default);

    /// <summary>True when the path stays inside wwwroot. A path source that escapes it is rejected.</summary>
    bool IsPathSafe(string? path);
}
