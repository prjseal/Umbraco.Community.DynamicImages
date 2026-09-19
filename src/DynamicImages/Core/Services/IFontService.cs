using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed record FontUploadResult(FontDefinition? Font, string? Error);

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

    /// <summary>Updates the editable parts of a font row: its display family name and named styles.</summary>
    FontDefinition? Update(Guid key, string familyName, IReadOnlyList<FontStyleDefinition> styles);

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
