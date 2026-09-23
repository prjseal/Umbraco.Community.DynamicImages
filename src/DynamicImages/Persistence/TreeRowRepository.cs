using NPoco;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Infrastructure.Scoping;

namespace Umbraco.Community.DynamicImages.Persistence;

/// <summary>
/// Row access for a table of named, parented, sortable rows - a folder or a font family. The
/// derived classes supply the table and the mapping.
/// </summary>
public abstract class TreeRowRepository<TModel, TDto>(IScopeProvider scopeProvider, string tableName)
    where TModel : class
    where TDto : class
{
    public IReadOnlyList<TModel> GetAll()
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        return scope.Database.Fetch<TDto>(new Sql().Select("*").From(tableName).OrderBy("name")).Select(Map).ToList();
    }

    public TModel? Get(Guid key)
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        return FetchByKey(scope.Database, key) is { } dto ? Map(dto) : null;
    }

    public TModel Insert(TModel model)
    {
        var now = DateTime.UtcNow;
        Stamp(model, now, now);

        using var scope = scopeProvider.CreateScope();
        scope.Database.Insert(ToDto(model, 0));
        scope.Complete();

        return model;
    }

    /// <summary>Writes the name, parent and sort order. Null when the row does not exist.</summary>
    public TModel? Update(TModel model)
    {
        using var scope = scopeProvider.CreateScope();
        var existing = FetchByKey(scope.Database, KeyOf(model));
        if (existing is null)
        {
            scope.Complete();
            return null;
        }

        Stamp(model, CreatedOf(existing), DateTime.UtcNow);
        scope.Database.Update(ToDto(model, IdOf(existing)));
        scope.Complete();

        return model;
    }

    public bool Delete(Guid key)
    {
        using var scope = scopeProvider.CreateScope();
        var deleted = scope.Database.Execute($"DELETE FROM {tableName} WHERE [key] = @0", key);
        scope.Complete();

        return deleted > 0;
    }

    private TDto? FetchByKey(IUmbracoDatabase database, Guid key)
        => database.FirstOrDefault<TDto>(new Sql().Select("*").From(tableName).Where("[key] = @0", key));

    protected abstract TModel Map(TDto dto);

    protected abstract TDto ToDto(TModel model, int id);

    protected abstract Guid KeyOf(TModel model);

    protected abstract int IdOf(TDto dto);

    protected abstract DateTime CreatedOf(TDto dto);

    protected abstract void Stamp(TModel model, DateTime createdUtc, DateTime updatedUtc);
}
