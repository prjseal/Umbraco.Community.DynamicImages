using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Fonts;

/// <summary>
/// Reads a font's bytes from wherever it lives. Media items go through Umbraco's media file
/// system so they work on Cloud's blob storage; wwwroot paths keep developer-committed and
/// package-shipped fonts working.
/// </summary>
public interface IFontFileProvider
{
    /// <summary>Opens the font file, or returns null when it cannot be found.</summary>
    Task<Stream?> OpenAsync(ImageSourceKind kind, Guid? mediaKey, string? path, CancellationToken cancellationToken = default);

    /// <summary>True when the path stays inside wwwroot. A path source that escapes it is rejected.</summary>
    bool IsPathSafe(string? path);
}
