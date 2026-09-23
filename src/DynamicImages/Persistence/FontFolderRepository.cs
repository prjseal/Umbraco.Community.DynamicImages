using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Persistence;

/// <summary>Row-level access to DynamicImages_FontFolder.</summary>
public interface IFontFolderRepository
{
    IReadOnlyList<FontFolder> GetAll();

    FontFolder? Get(Guid key);

    FontFolder Insert(FontFolder folder);

    /// <summary>Writes the name, parent and sort order. Null when the folder does not exist.</summary>
    FontFolder? Update(FontFolder folder);

    bool Delete(Guid key);
}

public sealed class FontFolderRepository(IScopeProvider scopeProvider)
    : TreeRowRepository<FontFolder, FontFolderDto>(scopeProvider, DynamicImagesConstants.FontFolderTableName), IFontFolderRepository
{
    protected override FontFolder Map(FontFolderDto dto) => new()
    {
        Key = dto.Key, Name = dto.Name, ParentKey = dto.ParentKey, SortOrder = dto.SortOrder,
        CreatedUtc = dto.CreatedUtc, UpdatedUtc = dto.UpdatedUtc
    };

    protected override FontFolderDto ToDto(FontFolder model, int id) => new()
    {
        Id = id, Key = model.Key, Name = model.Name, ParentKey = model.ParentKey, SortOrder = model.SortOrder,
        CreatedUtc = model.CreatedUtc, UpdatedUtc = model.UpdatedUtc
    };

    protected override Guid KeyOf(FontFolder model) => model.Key;

    protected override int IdOf(FontFolderDto dto) => dto.Id;

    protected override DateTime CreatedOf(FontFolderDto dto) => dto.CreatedUtc;

    protected override void Stamp(FontFolder model, DateTime createdUtc, DateTime updatedUtc)
    {
        model.CreatedUtc = createdUtc;
        model.UpdatedUtc = updatedUtc;
    }
}
