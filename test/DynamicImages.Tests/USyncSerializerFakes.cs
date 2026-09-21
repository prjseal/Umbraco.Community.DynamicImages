using Microsoft.Extensions.DependencyInjection;
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

        // The repository stamps this on every write; the serializer is meant to keep it out of
        // the file regardless of what it says.
        template.UpdatedUtc = DateTime.UtcNow;
        _templates[template.Key] = template;

        return SaveResult.Saved(template, validation);
    }

    public bool Delete(Guid key) => _templates.Remove(key);

    public Task<SaveResult> DuplicateAsync(Guid key, Guid? userKey, CancellationToken cancellationToken = default)
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
