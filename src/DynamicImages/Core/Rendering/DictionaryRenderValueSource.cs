namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// A value source backed by a plain dictionary. Used for the designer's "sample data" mode and by
/// the renderer tests, so neither needs a database or a published content cache.
/// </summary>
public sealed class DictionaryRenderValueSource : IRenderValueSource
{
    private readonly Dictionary<string, string?> _text;
    private readonly Dictionary<string, Guid> _media;
    private readonly Dictionary<string, IReadOnlyList<BadgeItem>> _items;

    public DictionaryRenderValueSource(
        string? name = null,
        IDictionary<string, string?>? text = null,
        IDictionary<string, Guid>? media = null,
        IDictionary<string, IReadOnlyList<BadgeItem>>? items = null)
    {
        Name = name;
        _text = new Dictionary<string, string?>(text ?? new Dictionary<string, string?>(), StringComparer.OrdinalIgnoreCase);
        _media = new Dictionary<string, Guid>(media ?? new Dictionary<string, Guid>(), StringComparer.OrdinalIgnoreCase);
        _items = new Dictionary<string, IReadOnlyList<BadgeItem>>(items ?? new Dictionary<string, IReadOnlyList<BadgeItem>>(), StringComparer.OrdinalIgnoreCase);
    }

    public string? Name { get; }

    public string? GetText(string propertyAlias) => _text.GetValueOrDefault(propertyAlias);

    public DateTime? GetDate(string propertyAlias)
        => DateTime.TryParse(_text.GetValueOrDefault(propertyAlias), out var date) ? date : null;

    public string GetReadingTime(string? propertyAlias)
        => ReadingTime.Estimate(_text.GetValueOrDefault(propertyAlias ?? "mainContent"));

    public Guid? GetMediaKey(string propertyAlias)
        => _media.TryGetValue(propertyAlias, out var key) ? key : null;

    public IReadOnlyList<BadgeItem> GetItems(string propertyAlias)
        => _items.GetValueOrDefault(propertyAlias, []);

    public bool IsTruthy(string propertyAlias)
    {
        var value = _text.GetValueOrDefault(propertyAlias);
        if (!string.IsNullOrWhiteSpace(value))
        {
            return !string.Equals(value, "0", StringComparison.Ordinal)
                && !string.Equals(value, "false", StringComparison.OrdinalIgnoreCase);
        }

        return _media.ContainsKey(propertyAlias) || _items.GetValueOrDefault(propertyAlias, []).Count > 0;
    }
}
