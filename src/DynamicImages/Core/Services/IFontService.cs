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
/// Where a new variant goes in the Fonts tree: into <see cref="FamilyKey"/> when it names a
/// family, otherwise into the family of the same name in <see cref="ParentKey"/> (a folder, or the
/// root when null), which is created if there is none.
/// </summary>
public sealed record FontPlacement(Guid? FamilyKey = null, Guid? ParentKey = null);

/// <summary>A family delete's outcome, and the templates that stopped it.</summary>
public sealed record FontFamilyDeleteResult(TreeOperationOutcome Outcome, IReadOnlyList<Template> InUse);

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
    /// <param name="placement">Where it goes in the tree. Null finds a family of the same name anywhere, or makes one at the root.</param>
    Task<FontUploadResult> UploadAsync(Stream fileStream, string fileName, FontPlacement? placement = null, CancellationToken cancellationToken = default);

    /// <summary>Registers a font that already lives under wwwroot.</summary>
    Task<FontUploadResult> RegisterPathAsync(string path, FontPlacement? placement = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Registers one row per weight (and italic) of a Google or Bunny family, or one row for a
    /// direct file URL. Each file is fetched once here, which primes this server's cache and
    /// proves it is a font.
    /// </summary>
    Task<WebFontRegistrationResult> RegisterWebFontAsync(WebFontRegistration request, FontPlacement? placement = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Re-resolves and re-downloads a url font, updating its URL and hash. Returns an error for a
    /// font that is not a url font; the caller checks existence for its 404.
    /// </summary>
    Task<FontUploadResult> RefreshAsync(Guid key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates the editable parts of a font row: its named styles, weight and slant. The family
    /// name belongs to the <see cref="FontFamily"/> - <see cref="RenameFamily"/> - so
    /// <paramref name="familyName"/> is only used by a row that has no family yet.
    /// </summary>
    FontDefinition? Update(Guid key, string familyName, IReadOnlyList<FontStyleDefinition> styles, int? weight = null, bool? isItalic = null);

    /// <summary>
    /// Inserts or replaces a font row exactly as given - except its family: a row whose
    /// <see cref="FontDefinition.FamilyKey"/> names no family (an export from before families)
    /// joins the family of the same name, or a new one at the root, and its family name is always
    /// its family's. The other write methods all fetch a file
    /// first and read the family, weight and slant out of it; this one takes the row as the
    /// caller has it, which is what restoring a font from another environment needs.
    /// </summary>
    FontDefinition Upsert(FontDefinition font);

    /// <summary>
    /// Deletes a font. Returns the templates still using it instead of deleting, when there are
    /// any - removing a font out from under a template would break its next publish.
    /// </summary>
    IReadOnlyList<Template> Delete(Guid key);

    /// <summary>The templates whose layers reference a font.</summary>
    IReadOnlyList<Template> TemplatesUsing(Guid fontKey);

    /// <summary>Every family, in no particular order.</summary>
    IReadOnlyList<FontFamily> GetFamilies();

    FontFamily? GetFamily(Guid key);

    /// <summary>Renames a family and rewrites <see cref="FontDefinition.FamilyName"/> on every variant in it.</summary>
    FontFamily? RenameFamily(Guid key, string name, out TreeOperationOutcome outcome);

    /// <summary>Puts a family in a folder, or at the root when <paramref name="folderKey"/> is null. It goes last there.</summary>
    TreeOperationOutcome MoveFamily(Guid key, Guid? folderKey);

    /// <summary>
    /// Deletes a family and all its variants - or, when any variant is used by a template, deletes
    /// nothing and returns those templates, as <see cref="Delete"/> does for one variant.
    /// </summary>
    FontFamilyDeleteResult DeleteFamily(Guid key);

    /// <summary>
    /// Reorders the folders and families directly under <paramref name="parentKey"/> (null is the
    /// root) from what the backoffice's sort modal sends. See <see cref="FolderTree{TFolder,TLeaf}.ApplySort"/>.
    /// </summary>
    TreeOperationOutcome SortChildren(Guid? parentKey, IReadOnlyList<(Guid Key, int SortOrder)> sorting);

    /// <summary>The templates using any variant of a family.</summary>
    IReadOnlyList<Template> TemplatesUsingFamily(Guid familyKey);

    /// <summary>
    /// Creates or updates a family under its own key, for uSync. A parent that is missing puts it
    /// at the root. A rename carries through to its variants' family name, as <see cref="RenameFamily"/>.
    /// </summary>
    FontFamily UpsertFamily(FontFamily family);

    /// <summary>The font's bytes, for the client's FontFace loader.</summary>
    Task<(byte[] Bytes, string ContentType, string? ETag)?> GetFileAsync(Guid key, CancellationToken cancellationToken = default);
}
