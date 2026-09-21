using Umbraco.Cms.Core.Models.PublishedContent;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The handful of <see cref="IPublishedContent"/> members the renderer actually touches - a name, a
/// key, the two dates and a property bag. Everything else throws, so a test that starts reaching
/// past the contract says so loudly instead of quietly returning a default.
/// </summary>
public sealed class FakePublishedContent(
    string? name = "A node",
    Guid? key = null,
    IDictionary<string, object?>? properties = null) : IPublishedContent
{
    private readonly Dictionary<string, IPublishedProperty> _properties =
        (properties ?? new Dictionary<string, object?>())
        .ToDictionary(
            pair => pair.Key,
            pair => (IPublishedProperty)new FakePublishedProperty(pair.Key, pair.Value),
            StringComparer.OrdinalIgnoreCase);

    public string? Name { get; } = name;

    public Guid Key { get; } = key ?? Guid.NewGuid();

    public DateTime CreateDate { get; init; } = new(2024, 3, 1, 9, 0, 0, DateTimeKind.Utc);

    public DateTime UpdateDate { get; init; } = new(2024, 5, 20, 14, 30, 0, DateTimeKind.Utc);

    public IEnumerable<IPublishedProperty> Properties => _properties.Values;

    public IPublishedProperty? GetProperty(string alias) => _properties.GetValueOrDefault(alias);

    public IPublishedContentType ContentType => throw new NotSupportedException();
    public int Id => throw new NotSupportedException();
    public string? UrlSegment => throw new NotSupportedException();
    public int SortOrder => throw new NotSupportedException();
    public int Level => throw new NotSupportedException();
    public string Path => throw new NotSupportedException();
    public int? TemplateId => throw new NotSupportedException();
    public int CreatorId => throw new NotSupportedException();
    public int WriterId => throw new NotSupportedException();
    public IReadOnlyDictionary<string, PublishedCultureInfo> Cultures => throw new NotSupportedException();
    public PublishedItemType ItemType => throw new NotSupportedException();
    public IPublishedContent? Parent => throw new NotSupportedException();
    public IEnumerable<IPublishedContent> Children => throw new NotSupportedException();
    public bool IsDraft(string? culture = null) => throw new NotSupportedException();
    public bool IsPublished(string? culture = null) => throw new NotSupportedException();
}

public sealed class FakePublishedProperty(string alias, object? value) : IPublishedProperty
{
    public string Alias { get; } = alias;

    public object? GetValue(string? culture = null, string? segment = null) => value;

    public bool HasValue(string? culture = null, string? segment = null) => value is not null;

    public IPublishedPropertyType PropertyType => throw new NotSupportedException();
    public object? GetSourceValue(string? culture = null, string? segment = null) => throw new NotSupportedException();
    public object? GetDeliveryApiValue(bool expanding, string? culture = null, string? segment = null)
        => throw new NotSupportedException();
}
