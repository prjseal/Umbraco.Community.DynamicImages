using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Community.DynamicImages.Persistence;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The whole fixture the uSync serializers need. They are constructed with an
/// <see cref="IServiceScopeFactory"/> rather than the services themselves - uSync resolves them as
/// singletons and the real services are scoped - so a stub factory over a dictionary of instances
/// is enough to drive <c>SerializeAsync</c> and <c>DeserializeAsync</c> directly.
/// </summary>
internal sealed class StubScopeFactory(Dictionary<Type, object> services)
    : IServiceScopeFactory, IServiceScope, IServiceProvider
{
    public IServiceScope CreateScope() => this;

    public IServiceProvider ServiceProvider => this;

    public object? GetService(Type serviceType) => services.GetValueOrDefault(serviceType);

    public void Dispose()
    {
        // Nothing to release: the stub scope is the container.
    }
}

/// <summary>An in-memory <see cref="ITemplateService"/>, with the validator as a hook.</summary>
internal sealed class FakeTemplateService : ITemplateService
{
    private readonly Dictionary<Guid, Template> _templates = [];

    /// <summary>Null means everything validates.</summary>
    public Func<Template, ValidationResult>? Validator { get; set; }

    public IReadOnlyList<Template> GetAll() => _templates.Values.OrderBy(t => t.Name).ToList();

    public Template? Get(Guid key) => _templates.GetValueOrDefault(key);

    public Template? GetByAlias(string alias)
        => _templates.Values.FirstOrDefault(t => string.Equals(t.Alias, alias, StringComparison.OrdinalIgnoreCase));

    public Task<SaveResult> CreateAsync(Template template, Guid? userKey, CancellationToken cancellationToken = default)
        => Task.FromResult(Save(template));

    public Task<SaveResult> UpdateAsync(Template template, DateTime? expectedUpdatedUtc, Guid? userKey, CancellationToken cancellationToken = default)
        => Task.FromResult(Save(template));

    private SaveResult Save(Template template)
    {
        var validation = Validator?.Invoke(template) ?? ValidationResult.Ok;
        if (!validation.IsValid) return SaveResult.Failed(SaveOutcome.Invalid, validation);

        // As the real service: an update keeps the stored folder, which only a move changes.
        if (_templates.TryGetValue(template.Key, out var existing)) template.ParentKey = existing.ParentKey;

        // The repository stamps this on every write; the serializer is meant to keep it out of
        // the file regardless of what it says.
        template.UpdatedUtc = DateTime.UtcNow;
        _templates[template.Key] = template;

        return SaveResult.Saved(template, validation);
    }

    public bool Delete(Guid key) => _templates.Remove(key);

    /// <summary>How many times a move was asked for - the serializer should only move when the parent changed.</summary>
    public int Moves { get; private set; }

    public Task<TreeOperationOutcome> MoveAsync(Guid key, Guid? targetKey, CancellationToken cancellationToken = default)
    {
        if (!_templates.TryGetValue(key, out var template)) return Task.FromResult(TreeOperationOutcome.NotFound);

        Moves++;
        template.ParentKey = targetKey;
        return Task.FromResult(TreeOperationOutcome.Success);
    }

    public Task<SaveResult> DuplicateAsync(Guid key, Guid? targetKey, Guid? userKey, CancellationToken cancellationToken = default)
        => throw new NotSupportedException();

    public string SuggestAlias(string name, Guid? exceptKey = null) => name;
}

/// <summary>An in-memory <see cref="IFontService"/>. Only the members the serializer uses do anything.</summary>
internal sealed class FakeFontService : IFontService
{
    private readonly Dictionary<Guid, FontDefinition> _fonts = [];

    /// <summary>The templates <see cref="Delete"/> should refuse over, if any.</summary>
    public List<Template> InUse { get; } = [];

    public IReadOnlyList<FontDefinition> GetAll() => _fonts.Values.ToList();

    public FontDefinition? Get(Guid key) => _fonts.GetValueOrDefault(key);

    public FontDefinition Upsert(FontDefinition font)
    {
        font.UpdatedUtc = DateTime.UtcNow;
        _fonts[font.Key] = font;

        return font;
    }

    public IReadOnlyList<Template> Delete(Guid key)
    {
        if (InUse.Count > 0) return InUse;

        _fonts.Remove(key);
        return [];
    }

    public Task<FontUploadResult> UploadAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
        => throw new NotSupportedException();

    public Task<FontUploadResult> RegisterPathAsync(string path, CancellationToken cancellationToken = default)
        => throw new NotSupportedException();

    public Task<WebFontRegistrationResult> RegisterWebFontAsync(WebFontRegistration request, CancellationToken cancellationToken = default)
        => throw new NotSupportedException();

    public Task<FontUploadResult> RefreshAsync(Guid key, CancellationToken cancellationToken = default)
        => throw new NotSupportedException();

    public FontDefinition? Update(Guid key, string familyName, IReadOnlyList<FontStyleDefinition> styles, int? weight = null, bool? isItalic = null)
        => throw new NotSupportedException();

    public IReadOnlyList<Template> TemplatesUsing(Guid fontKey) => InUse;

    public Task<(byte[] Bytes, string ContentType, string? ETag)?> GetFileAsync(Guid key, CancellationToken cancellationToken = default)
        => throw new NotSupportedException();
}

/// <summary>An in-memory <see cref="ITemplateFolderRepository"/>, so the real folder service can be driven without a database.</summary>
internal sealed class InMemoryTemplateFolderRepository : ITemplateFolderRepository
{
    private readonly Dictionary<Guid, TemplateFolder> _folders = [];

    public IReadOnlyList<TemplateFolder> GetAll() => _folders.Values.OrderBy(f => f.Name).Select(Copy).ToList();

    public TemplateFolder? Get(Guid key) => _folders.TryGetValue(key, out var folder) ? Copy(folder) : null;

    public TemplateFolder Insert(TemplateFolder folder)
    {
        _folders[folder.Key] = Copy(folder);
        return folder;
    }

    public TemplateFolder? Update(TemplateFolder folder)
    {
        if (!_folders.ContainsKey(folder.Key)) return null;

        _folders[folder.Key] = Copy(folder);
        return folder;
    }

    public bool Delete(Guid key) => _folders.Remove(key);

    private static TemplateFolder Copy(TemplateFolder folder) => new()
    {
        Key = folder.Key, Name = folder.Name, ParentKey = folder.ParentKey, SortOrder = folder.SortOrder
    };
}

/// <summary>A template cache over whatever the fake template service holds.</summary>
internal sealed class FakeTemplateCache(FakeTemplateService templates) : ITemplateCache
{
    public IReadOnlyList<Template> GetAll() => templates.GetAll();

    public IReadOnlyList<Template> GetForDocType(string docTypeAlias)
        => templates.GetAll().Where(t => t.DocTypeAliases.Contains(docTypeAlias)).ToList();

    public Template? Get(Guid key) => templates.Get(key);

    public void Clear()
    {
        // Nothing cached.
    }
}

/// <summary>Swallows every notification.</summary>
internal sealed class NullEventAggregator : IEventAggregator
{
    public Task PublishAsync<TNotification>(TNotification notification, CancellationToken cancellationToken = default)
        where TNotification : INotification => Task.CompletedTask;

    public Task PublishAsync<TNotification, TNotificationHandler>(IEnumerable<TNotification> notifications, CancellationToken cancellationToken = default)
        where TNotification : INotification
        where TNotificationHandler : INotificationHandler => Task.CompletedTask;

    public void Publish<TNotification>(TNotification notification)
        where TNotification : INotification
    {
    }

    public void Publish<TNotification, TNotificationHandler>(IEnumerable<TNotification> notifications)
        where TNotification : INotification
        where TNotificationHandler : INotificationHandler
    {
    }

    public bool PublishCancelable<TCancelableNotification>(TCancelableNotification notification)
        where TCancelableNotification : ICancelableNotification => false;

    public Task<bool> PublishCancelableAsync<TCancelableNotification>(TCancelableNotification notification)
        where TCancelableNotification : ICancelableNotification => Task.FromResult(false);
}
