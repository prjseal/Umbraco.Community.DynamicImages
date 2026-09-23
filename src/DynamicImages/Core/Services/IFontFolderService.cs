using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed record FontFolderResult(TreeOperationOutcome Outcome, FontFolder? Folder = null);

/// <summary>
/// The write path for font folders, and the Fonts tree built from folders, families and variants
/// together. The same rules as <see cref="ITemplateFolderService"/>.
/// </summary>
public interface IFontFolderService
{
    IReadOnlyList<FontFolder> GetAll();

    FontFolder? Get(Guid key);

    /// <summary>Every folder, family and variant, as one tree.</summary>
    FontTree GetTree();

    /// <inheritdoc cref="ITemplateFolderService.Create"/>
    FontFolderResult Create(string name, Guid? parentKey, Guid? key = null);

    FontFolderResult Rename(Guid key, string name);

    FontFolderResult Move(Guid key, Guid? targetKey);

    /// <summary>Refused while the folder holds a folder or a family.</summary>
    FontFolderResult Delete(Guid key);

    /// <inheritdoc cref="ITemplateFolderService.Upsert"/>
    FontFolder Upsert(FontFolder folder);
}
