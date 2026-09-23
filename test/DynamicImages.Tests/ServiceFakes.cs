using System.Reflection;
using System.Text.Json;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Sync;
using Umbraco.Community.DynamicImages.Core.Cache;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.Persistence;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// An interface implemented by nothing: every call returns the default of its return type, except
/// the members <see cref="Returns"/> names. Enough for the Umbraco plumbing the services reach
/// for but these tests never look at.
/// </summary>
public class Stub<T> : DispatchProxy where T : class
{
    public Dictionary<string, object?> Returns { get; } = [];

    public static T Create(Action<Stub<T>>? configure = null)
    {
        var proxy = DispatchProxy.Create<T, Stub<T>>();
        configure?.Invoke((Stub<T>)(object)proxy);
        return proxy;
    }

    protected override object? Invoke(MethodInfo? targetMethod, object?[]? args)
    {
        if (targetMethod is null) return null;
        if (Returns.TryGetValue(targetMethod.Name, out var value)) return value;

        var type = targetMethod.ReturnType;
        if (type == typeof(void)) return null;
        if (type == typeof(Task)) return Task.CompletedTask;

        return type.IsValueType ? Activator.CreateInstance(type) : null;
    }
}

internal static class ServiceFakes
{
    /// <summary>
    /// A <see cref="DistributedCache"/> that knows this package's refresher and sends nowhere, so
    /// <c>RefreshByPayload</c> finds what it looks up.
    /// </summary>
    public static DistributedCache DistributedCache()
    {
        var refresher = Stub<ICacheRefresher>.Create(s => s.Returns["get_RefresherUniqueId"] = DynamicImagesCacheRefresher.UniqueId);

        return new DistributedCache(Stub<IServerMessenger>.Create(), new CacheRefresherCollection(() => [refresher]));
    }

    public static TemplateService TemplateService(InMemoryTemplateRepository templates, ITemplateFolderRepository folders)
        => new(templates, folders, new AlwaysValid(), new RepositoryTemplateCache(templates), DistributedCache(), new NullEventAggregator());

    private sealed class AlwaysValid : ITemplateValidator
    {
        public Task<ValidationResult> ValidateAsync(Template template, CancellationToken cancellationToken = default)
            => Task.FromResult(ValidationResult.Ok);
    }
}

/// <summary>An <see cref="ITemplateCache"/> that is simply the repository.</summary>
internal sealed class RepositoryTemplateCache(ITemplateRepository repository) : ITemplateCache
{
    public IReadOnlyList<Template> GetAll() => repository.GetAll();

    public IReadOnlyList<Template> GetForDocType(string docTypeAlias)
        => repository.GetAll().Where(t => t.DocTypeAliases.Contains(docTypeAlias)).ToList();

    public Template? Get(Guid key) => repository.Get(key);

    public void Clear()
    {
        // Nothing cached.
    }
}

/// <summary>
/// An in-memory <see cref="ITemplateRepository"/>. Rows are copied in and out through the
/// template JSON, as the real one stores them, so a caller mutating what it read cannot change
/// what is stored.
/// </summary>
internal sealed class InMemoryTemplateRepository : ITemplateRepository
{
    private readonly Dictionary<Guid, Template> _rows = [];

    public IReadOnlyList<Template> GetAll() => _rows.Values.Select(Copy).OrderBy(t => t.Name).ToList();

    public Template? Get(Guid key) => _rows.TryGetValue(key, out var row) ? Copy(row) : null;

    public Template? GetByAlias(string alias) => GetAll().FirstOrDefault(t => t.Alias == alias);

    public bool AliasExists(string alias, Guid? exceptKey = null) => _rows.Values.Any(r => r.Alias == alias && r.Key != exceptKey);

    public Template Insert(Template template, Guid? userKey)
    {
        template.UpdatedUtc = DateTime.UtcNow;
        _rows[template.Key] = Copy(template);
        return template;
    }

    public Template? Update(Template template, DateTime? expectedUpdatedUtc, Guid? userKey)
    {
        if (!_rows.TryGetValue(template.Key, out var existing)) return null;

        // As the real one: only a move or a sort changes the order.
        template.SortOrder = existing.SortOrder;
        template.UpdatedUtc = DateTime.UtcNow;
        _rows[template.Key] = Copy(template);
        return template;
    }

    public bool Move(Guid key, Guid? parentKey, int sortOrder)
    {
        if (!_rows.TryGetValue(key, out var row)) return false;

        row.ParentKey = parentKey;
        row.SortOrder = sortOrder;
        return true;
    }

    public void SetSortOrders(IReadOnlyCollection<(Guid Key, int SortOrder)> sortOrders)
    {
        foreach (var (key, sortOrder) in sortOrders)
        {
            if (_rows.TryGetValue(key, out var row)) row.SortOrder = sortOrder;
        }
    }

    public bool SetEnabled(Guid key, bool isEnabled)
    {
        if (!_rows.TryGetValue(key, out var row)) return false;

        row.IsEnabled = isEnabled;
        row.UpdatedUtc = DateTime.UtcNow;
        return true;
    }

    public bool Delete(Guid key) => _rows.Remove(key);

    public int Count() => _rows.Count;

    private static Template Copy(Template template)
    {
        var json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);
        var copy = JsonSerializer.Deserialize<Template>(json, DynamicImagesJsonOptions.Default)!;
        // Not in the JSON, as in the real table: carried across by hand.
        copy.SortOrder = template.SortOrder;
        copy.UpdatedUtc = template.UpdatedUtc;
        return copy;
    }
}

/// <summary>An in-memory <see cref="IFontRepository"/>, copying rows in and out.</summary>
internal sealed class InMemoryFontRepository : IFontRepository
{
    private readonly Dictionary<Guid, FontDefinition> _rows = [];

    public IReadOnlyList<FontDefinition> GetAll() => _rows.Values.Select(Copy).ToList();

    public FontDefinition? Get(Guid key) => _rows.TryGetValue(key, out var row) ? Copy(row) : null;

    public FontDefinition Insert(FontDefinition font)
    {
        _rows[font.Key] = Copy(font);
        return font;
    }

    public FontDefinition? Update(FontDefinition font)
    {
        if (!_rows.ContainsKey(font.Key)) return null;

        _rows[font.Key] = Copy(font);
        return font;
    }

    public bool Delete(Guid key) => _rows.Remove(key);

    public void SetFamily(Guid familyKey, string familyName)
    {
        foreach (var row in _rows.Values.Where(r => r.FamilyKey == familyKey)) row.FamilyName = familyName;
    }

    private static FontDefinition Copy(FontDefinition font) => new()
    {
        Key = font.Key, FamilyName = font.FamilyName, FamilyKey = font.FamilyKey, SortOrder = font.SortOrder,
        SourceKind = font.SourceKind, MediaKey = font.MediaKey, Path = font.Path, SourceUrl = font.SourceUrl,
        Provider = font.Provider, ProviderFamily = font.ProviderFamily, Weight = font.Weight, IsItalic = font.IsItalic,
        Styles = font.Styles.ToList(), ContentHash = font.ContentHash
    };
}

/// <summary>An in-memory row store for folders and families, which share a shape.</summary>
internal abstract class InMemoryTreeRows<T> where T : class, ITreeEntity
{
    private readonly Dictionary<Guid, T> _rows = [];

    public IReadOnlyList<T> GetAll() => _rows.Values.Select(Copy).ToList();

    public T? Get(Guid key) => _rows.TryGetValue(key, out var row) ? Copy(row) : null;

    public T Insert(T row)
    {
        _rows[row.Key] = Copy(row);
        return row;
    }

    public T? Update(T row)
    {
        if (!_rows.ContainsKey(row.Key)) return null;

        _rows[row.Key] = Copy(row);
        return row;
    }

    public bool Delete(Guid key) => _rows.Remove(key);

    protected abstract T Copy(T row);
}

internal sealed class InMemoryFontFolderRepository : InMemoryTreeRows<FontFolder>, IFontFolderRepository
{
    protected override FontFolder Copy(FontFolder row)
        => new() { Key = row.Key, Name = row.Name, ParentKey = row.ParentKey, SortOrder = row.SortOrder };
}

internal sealed class InMemoryFontFamilyRepository : InMemoryTreeRows<FontFamily>, IFontFamilyRepository
{
    protected override FontFamily Copy(FontFamily row)
        => new() { Key = row.Key, Name = row.Name, ParentKey = row.ParentKey, SortOrder = row.SortOrder };
}

/// <summary>
/// The real <see cref="FontService"/> over in-memory rows. Everything it reaches only for files -
/// the media library, the web font fetchers, the registry - is a stub, so the tree and family
/// operations can be driven without a site.
/// </summary>
internal sealed class FontServiceFixture
{
    public InMemoryFontRepository Fonts { get; } = new();

    public InMemoryFontFamilyRepository Families { get; } = new();

    public InMemoryFontFolderRepository Folders { get; } = new();

    public InMemoryTemplateRepository Templates { get; } = new();

    public FontService Service() => new(
        Fonts, Families, Folders,
        new RepositoryTemplateCache(Templates),
        Stub<Core.Fonts.IFontRegistry>.Create(),
        Stub<Core.Fonts.IFontFileProvider>.Create(),
        Stub<Core.Fonts.Remote.IWebFontResolver>.Create(),
        Stub<Core.Fonts.Remote.IRemoteFontFetcher>.Create(),
        Stub<Umbraco.Cms.Core.Services.IMediaService>.Create(),
        Stub<Umbraco.Cms.Core.Services.IMediaTypeService>.Create(),
        null!,
        null!,
        Stub<Umbraco.Cms.Core.Strings.IShortStringHelper>.Create(),
        Stub<Umbraco.Cms.Core.Services.IContentTypeBaseServiceProvider>.Create(),
        ServiceFakes.DistributedCache(),
        new NullEventAggregator(),
        Microsoft.Extensions.Logging.Abstractions.NullLogger<FontService>.Instance);

    public FontFolderService FolderService() => new(Folders, Families, Fonts, new NullEventAggregator());
}
