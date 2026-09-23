using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Persistence;

/// <summary>Row-level access to DynamicImages_FontFamily.</summary>
public interface IFontFamilyRepository
{
    IReadOnlyList<FontFamily> GetAll();

    FontFamily? Get(Guid key);

    FontFamily Insert(FontFamily family);

    /// <summary>Writes the name, parent and sort order. Null when the family does not exist.</summary>
    FontFamily? Update(FontFamily family);

    bool Delete(Guid key);
}

public sealed class FontFamilyRepository(IScopeProvider scopeProvider)
    : TreeRowRepository<FontFamily, FontFamilyDto>(scopeProvider, DynamicImagesConstants.FontFamilyTableName), IFontFamilyRepository
{
    protected override FontFamily Map(FontFamilyDto dto) => new()
    {
        Key = dto.Key, Name = dto.Name, ParentKey = dto.ParentKey, SortOrder = dto.SortOrder,
        CreatedUtc = dto.CreatedUtc, UpdatedUtc = dto.UpdatedUtc
    };

    protected override FontFamilyDto ToDto(FontFamily model, int id) => new()
    {
        Id = id, Key = model.Key, Name = model.Name, ParentKey = model.ParentKey, SortOrder = model.SortOrder,
        CreatedUtc = model.CreatedUtc, UpdatedUtc = model.UpdatedUtc
    };

    protected override Guid KeyOf(FontFamily model) => model.Key;

    protected override int IdOf(FontFamilyDto dto) => dto.Id;

    protected override DateTime CreatedOf(FontFamilyDto dto) => dto.CreatedUtc;

    protected override void Stamp(FontFamily model, DateTime createdUtc, DateTime updatedUtc)
    {
        model.CreatedUtc = createdUtc;
        model.UpdatedUtc = updatedUtc;
    }
}
