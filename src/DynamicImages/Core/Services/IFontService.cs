using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed record FontUploadResult(FontDefinition? Font, string? Error);

/// <summary>
/// What the picker sends: a provider, and either a family with weights (Google, Bunny) or a
/// file URL (direct).
/// </summary>
public sealed record WebFontRegistration(
    string? Provider,
    string? Family,
    IReadOnlyList<int>? Weights,
    bool IncludeItalic,
    string? Url);

/// <summary>The rows that were created and, per variant that was not, why.</summary>
public sealed record WebFontRegistrationResult(IReadOnlyList<FontDefinition> Fonts, IReadOnlyList<string> Errors);

/// <summary>
/// Manages the font rows and their files. Uploads become media items (blob-backed on Cloud,
/// carried by Deploy); wwwroot paths stay supported for fonts committed with the site.
/// </summary>
public interface IFontService
{
    IReadOnlyList<FontDefinition> GetAll();

    FontDefinition? Get(Guid key);

    /// <summary>
    /// Stores an uploaded font file as a media item and registers it. The family name and weight
    /// are read out of the file itself rather than asked for.
    /// </summary>
    Task<FontUploadResult> UploadAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default);

    /// <summary>Registers a font that already lives under wwwroot.</summary>
    Task<FontUploadResult> RegisterPathAsync(string path, CancellationToken cancellationToken = default);

    /// <summary>
    /// Registers one row per weight (and italic) of a Google or Bunny family, or one row for a
    /// direct file URL. Each file is fetched once here, which primes this server's cache and
    /// proves it is a font.
    /// </summary>
    Task<WebFontRegistrationResult> RegisterWebFontAsync(WebFontRegistration request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Re-resolves and re-downloads a url font, updating its URL and hash. Returns an error for a
    /// font that is not a url font; the caller checks existence for its 404.
    /// </summary>
    Task<FontUploadResult> RefreshAsync(Guid key, CancellationToken cancellationToken = default);

    /// <summary>Updates the editable parts of a font row: its display family name and named styles.</summary>
    FontDefinition? Update(Guid key, string familyName, IReadOnlyList<FontStyleDefinition> styles, int? weight = null, bool? isItalic = null);

    /// <summary>
    /// Deletes a font. Returns the templates still using it instead of deleting, when there are
    /// any - removing a font out from under a template would break its next publish.
    /// </summary>
    IReadOnlyList<Template> Delete(Guid key);

    /// <summary>The templates whose layers reference a font.</summary>
    IReadOnlyList<Template> TemplatesUsing(Guid fontKey);

    /// <summary>The font's bytes, for the client's FontFace loader.</summary>
    Task<(byte[] Bytes, string ContentType, string? ETag)?> GetFileAsync(Guid key, CancellationToken cancellationToken = default);
}
