using NPoco;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Persistence;

public sealed class TemplateFolderRepository(IScopeProvider scopeProvider) : ITemplateFolderRepository
{
    public IReadOnlyList<TemplateFolder> GetAll()
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        return scope.Database
            .Fetch<TemplateFolderDto>(new Sql().Select("*").From(DynamicImagesConstants.TemplateFolderTableName).OrderBy("name"))
            .Select(Map)
            .ToList();
    }

    public TemplateFolder? Get(Guid key)
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        var dto = FetchByKey(scope.Database, key);

        return dto is null ? null : Map(dto);
    }

    public TemplateFolder Insert(TemplateFolder folder)
    {
        var now = DateTime.UtcNow;
        folder.CreatedUtc = now;
        folder.UpdatedUtc = now;

        using var scope = scopeProvider.CreateScope();
        scope.Database.Insert(ToDto(folder));
        scope.Complete();

        return folder;
    }

    public TemplateFolder? Update(TemplateFolder folder)
    {
        using var scope = scopeProvider.CreateScope();
        var existing = FetchByKey(scope.Database, folder.Key);
        if (existing is null)
        {
            scope.Complete();
            return null;
        }

        folder.CreatedUtc = existing.CreatedUtc;
        folder.UpdatedUtc = DateTime.UtcNow;

        var dto = ToDto(folder);
        dto.Id = existing.Id;

        scope.Database.Update(dto);
        scope.Complete();

        return folder;
    }

    public bool Delete(Guid key)
    {
        using var scope = scopeProvider.CreateScope();
        var deleted = scope.Database.Execute(
            $"DELETE FROM {DynamicImagesConstants.TemplateFolderTableName} WHERE [key] = @0", key);
        scope.Complete();

        return deleted > 0;
    }

    private static TemplateFolderDto? FetchByKey(Umbraco.Cms.Infrastructure.Persistence.IUmbracoDatabase database, Guid key)
        => database.FirstOrDefault<TemplateFolderDto>(
            new Sql().Select("*").From(DynamicImagesConstants.TemplateFolderTableName).Where("[key] = @0", key));

    internal static TemplateFolderDto ToDto(TemplateFolder folder) => new()
    {
        Key = folder.Key,
        Name = folder.Name,
        ParentKey = folder.ParentKey,
        SortOrder = folder.SortOrder,
        CreatedUtc = folder.CreatedUtc,
        UpdatedUtc = folder.UpdatedUtc
    };

    internal static TemplateFolder Map(TemplateFolderDto dto) => new()
    {
        Key = dto.Key,
        Name = dto.Name,
        ParentKey = dto.ParentKey,
        SortOrder = dto.SortOrder,
        CreatedUtc = dto.CreatedUtc,
        UpdatedUtc = dto.UpdatedUtc
    };
}
