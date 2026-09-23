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

        var now = DateTime.UtcNow;
        template.UpdatedUtc = now;

        var dto = ToDto(template, userKey);
        dto.Id = existing.Id;
        dto.CreatedUtc = existing.CreatedUtc;

        // Only a sort or a move changes the order; an ordinary save keeps the row's. The designer
        // cannot send one anyway - SortOrder is not in the JSON.
        dto.SortOrder = existing.SortOrder;
        template.SortOrder = existing.SortOrder;
        dto.UpdatedUtc = now;

        // Optimistic concurrency as a condition on the write itself, not a comparison against the
        // row read above: a read-then-write lets two saves carrying the same UpdatedUtc both pass
        // the check and both succeed, with the later one silently discarding the earlier.
        //
        // Compared to the second, because the timestamp round-trips through JSON and anything
        // finer would fail on formatting alone - which is also why this is a range and not an
        // equality.
        var updated = expectedUpdatedUtc.HasValue
            ? scope.Database.Execute(
                $"UPDATE {DynamicImagesConstants.TemplateTableName} " +
                "SET alias = @0, name = @1, isEnabled = @2, schemaVersion = @3, json = @4, " +
                "docTypeAliases = @5, updatedUtc = @6, updatedByUserKey = @7, parentKey = @8 " +
                "WHERE [key] = @9 AND updatedUtc BETWEEN @10 AND @11",
                dto.Alias, dto.Name, dto.IsEnabled, dto.SchemaVersion, dto.Json,
                dto.DocTypeAliases, dto.UpdatedUtc, dto.UpdatedByUserKey, dto.ParentKey,
                dto.Key, expectedUpdatedUtc.Value.AddSeconds(-1), expectedUpdatedUtc.Value.AddSeconds(1))
            : scope.Database.Update(dto);

        scope.Complete();

        // Zero rows means someone else saved between this caller's read and this write. Null is
        // the conflict, exactly as it was when the check was a comparison.
        return updated > 0 ? template : null;
    }

    public bool Move(Guid key, Guid? parentKey, int sortOrder)
    {
        // Only the columns. The JSON copy of parentKey is refreshed on the next save and is
        // overruled by the column on every read in the meantime. updatedUtc is deliberately left
        // alone: a move is not an edit, and bumping it would give anyone with the template open
        // in the designer a 412 on their next save for something they cannot see.
        using var scope = scopeProvider.CreateScope();
        var moved = scope.Database.Execute(
            $"UPDATE {DynamicImagesConstants.TemplateTableName} SET parentKey = @0, sortOrder = @1 WHERE [key] = @2",
            parentKey, sortOrder, key);
        scope.Complete();

        return moved > 0;
    }

    public void SetSortOrders(IReadOnlyCollection<(Guid Key, int SortOrder)> sortOrders)
    {
        // Like a move, not an edit: updatedUtc stays, so an open designer can still save.
        using var scope = scopeProvider.CreateScope();
        foreach (var (key, sortOrder) in sortOrders)
        {
            scope.Database.Execute(
                $"UPDATE {DynamicImagesConstants.TemplateTableName} SET sortOrder = @0 WHERE [key] = @1", sortOrder, key);
        }

        scope.Complete();
    }

    public bool SetEnabled(Guid key, bool isEnabled)
    {
        // Unlike a move, this does stamp updatedUtc: enabling is an edit, and a designer holding
        // the old value must not be able to save it back over the change without a 412.
        using var scope = scopeProvider.CreateScope();
        var updated = scope.Database.Execute(
            $"UPDATE {DynamicImagesConstants.TemplateTableName} SET isEnabled = @0, updatedUtc = @1 WHERE [key] = @2",
            isEnabled, DateTime.UtcNow, key);
        scope.Complete();

        return updated > 0;
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

    internal static TemplateDto ToDto(Template template, Guid? userKey) => new()
    {
        Key = template.Key,
        ParentKey = template.ParentKey,
        Alias = template.Alias,
        Name = template.Name,
        IsEnabled = template.IsEnabled,
        SchemaVersion = template.SchemaVersion,
        Json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default),
        DocTypeAliases = string.Join(',', template.DocTypeAliases),
        SortOrder = template.SortOrder,
        UpdatedByUserKey = userKey
    };

    internal Template? Map(TemplateDto? dto)
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
            template.ParentKey = dto.ParentKey;
            template.SortOrder = dto.SortOrder;
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
