using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Persistence;

public interface IFontRepository
{
    IReadOnlyList<FontDefinition> GetAll();

    FontDefinition? Get(Guid key);

    FontDefinition Insert(FontDefinition font);

    FontDefinition? Update(FontDefinition font);

    bool Delete(Guid key);
}
