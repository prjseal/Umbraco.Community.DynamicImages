using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Persistence;

/// <summary>Row-level access to DynamicImages_TemplateFolder.</summary>
public interface ITemplateFolderRepository
{
    IReadOnlyList<TemplateFolder> GetAll();

    TemplateFolder? Get(Guid key);

    TemplateFolder Insert(TemplateFolder folder);

    /// <summary>Writes the name, parent and sort order. Null when the folder does not exist.</summary>
    TemplateFolder? Update(TemplateFolder folder);

    bool Delete(Guid key);
}
