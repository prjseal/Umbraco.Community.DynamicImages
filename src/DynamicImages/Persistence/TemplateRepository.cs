using System.Text.Json;
using NPoco;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Persistence;

public sealed class TemplateRepository(
    IScopeProvider scopeProvider,
    ITemplateJsonMigrator migrator,
    ILogger<TemplateRepository> logger) : ITemplateRepository
{
    public IReadOnlyList<Template> GetAll()
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        var dtos = scope.Database.Fetch<TemplateDto>(
            new Sql().Select("*").From(DynamicImagesConstants.TemplateTableName).OrderBy("name"));

        return dtos.Select(Map).Where(x => x is not null).Select(x => x!).ToList();
    }

    public Template? Get(Guid key)
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        return Map(FetchByKey(scope.Database, key));
    }

    public Template? GetByAlias(string alias)
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        var dto = scope.Database.FirstOrDefault<TemplateDto>(
            new Sql().Select("*").From(DynamicImagesConstants.TemplateTableName).Where("alias = @0", alias));

        return Map(dto);
    }

    public bool AliasExists(string alias, Guid? exceptKey = null)
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        var sql = new Sql().Select("COUNT(*)").From(DynamicImagesConstants.TemplateTableName).Where("alias = @0", alias);
        if (exceptKey.HasValue) sql = sql.Where("[key] <> @0", exceptKey.Value);

        return scope.Database.ExecuteScalar<int>(sql) > 0;
    }

    public Template Insert(Template template, Guid? userKey)
    {
        var now = DateTime.UtcNow;
        template.UpdatedUtc = now;

        var dto = ToDto(template, userKey);
        dto.CreatedUtc = now;
        dto.UpdatedUtc = now;

        using var scope = scopeProvider.CreateScope();
        scope.Database.Insert(dto);
        scope.Complete();

        return template;
    }

    public Template? Update(Template template, DateTime? expectedUpdatedUtc, Guid? userKey)
    {
        using var scope = scopeProvider.CreateScope();
        var existing = FetchByKey(scope.Database, template.Key);
        if (existing is null)
        {
            scope.Complete();
            return null;
        }

        // Optimistic concurrency: compare to the second. The timestamp round-trips through JSON,
        // so anything finer than that would fail on formatting alone.
        if (expectedUpdatedUtc.HasValue &&
            Math.Abs((existing.UpdatedUtc - expectedUpdatedUtc.Value).TotalSeconds) > 1)
        {
            scope.Complete();
            return null;
        }

        var now = DateTime.UtcNow;
        template.UpdatedUtc = now;

        var dto = ToDto(template, userKey);
        dto.Id = existing.Id;
        dto.CreatedUtc = existing.CreatedUtc;
        dto.UpdatedUtc = now;

        scope.Database.Update(dto);
        scope.Complete();

        return template;
    }

    public bool Delete(Guid key)
    {
        using var scope = scopeProvider.CreateScope();
        var deleted = scope.Database.Execute(
            $"DELETE FROM {DynamicImagesConstants.TemplateTableName} WHERE [key] = @0", key);
        scope.Complete();

        return deleted > 0;
    }

    public int Count()
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        return scope.Database.ExecuteScalar<int>(
            new Sql().Select("COUNT(*)").From(DynamicImagesConstants.TemplateTableName));
    }

    private static TemplateDto? FetchByKey(IUmbracoDatabase database, Guid key)
        => database.FirstOrDefault<TemplateDto>(
            new Sql().Select("*").From(DynamicImagesConstants.TemplateTableName).Where("[key] = @0", key));

    private static TemplateDto ToDto(Template template, Guid? userKey) => new()
    {
        Key = template.Key,
        Alias = template.Alias,
        Name = template.Name,
        IsEnabled = template.IsEnabled,
        SchemaVersion = template.SchemaVersion,
        Json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default),
        DocTypeAliases = string.Join(',', template.DocTypeAliases),
        UpdatedByUserKey = userKey
    };

    private Template? Map(TemplateDto? dto)
    {
        if (dto is null) return null;

        try
        {
            // Older documents are brought up to the current schema on read; the upgraded shape is
            // written back the next time the template is saved.
            var template = migrator.Deserialize(dto.Json);
            if (template is null) return null;

            // The row's columns are authoritative for the fields it denormalises - the JSON copy
            // can lag behind a rename done directly in the database.
            template.Key = dto.Key;
            template.Alias = dto.Alias;
            template.Name = dto.Name;
            template.IsEnabled = dto.IsEnabled;
            template.UpdatedUtc = dto.UpdatedUtc;

            return template;
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Dynamic Images: template {Alias} ({Key}) has unreadable JSON and was skipped", dto.Alias, dto.Key);
            return null;
        }
    }
}
