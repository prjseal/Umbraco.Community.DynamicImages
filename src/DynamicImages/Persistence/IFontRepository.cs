using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Persistence;

public interface IFontRepository
{
    IReadOnlyList<FontDefinition> GetAll();

    FontDefinition? Get(Guid key);

    FontDefinition Insert(FontDefinition font);

    FontDefinition? Update(FontDefinition font);

    bool Delete(Guid key);

    /// <summary>Writes a family's name onto every variant in it: what a family rename does.</summary>
    void SetFamily(Guid familyKey, string familyName);
}
