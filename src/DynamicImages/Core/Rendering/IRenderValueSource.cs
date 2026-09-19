namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>One item of a badges layer - a category, tag or author node.</summary>
public sealed record BadgeItem(string Name, IReadOnlyDictionary<string, string?> Properties)
{
    public string? Property(string? alias)
        => string.IsNullOrWhiteSpace(alias) ? null : Properties.GetValueOrDefault(alias);
}

/// <summary>
/// Everything the renderer needs to know about the thing being rendered. Keeping this behind an
/// interface is what lets the same renderer serve a real publish, a backoffice preview and a
/// golden-image test with canned values.
/// </summary>
public interface IRenderValueSource
{
    /// <summary>The node's name.</summary>
    string? Name { get; }

    /// <summary>A property value as plain text. Rich text arrives HTML-stripped.</summary>
    string? GetText(string propertyAlias);

    /// <summary>A date property, including the system createDate/updateDate.</summary>
    DateTime? GetDate(string propertyAlias);

    /// <summary>Estimated reading time of a rich text property, e.g. "4 min read".</summary>
    string GetReadingTime(string? propertyAlias);

    /// <summary>The media key a media picker property points at, if any.</summary>
    Guid? GetMediaKey(string propertyAlias);

    /// <summary>The items of a multi-node picker property, for a badges layer.</summary>
    IReadOnlyList<BadgeItem> GetItems(string propertyAlias);

    /// <summary>Whether a property holds anything that reads as "true" - drives visibility rules.</summary>
    bool IsTruthy(string propertyAlias);
}
