using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Extensions;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Reads values off a real content node. Both the draft <see cref="IContent"/> and the published
/// <see cref="IPublishedContent"/> are used: the draft carries the in-flight values during a
/// publish, while the published node is what resolves picker properties into nodes.
/// </summary>
public sealed class ContentRenderValueSource(IContent content, IPublishedContent? published) : IRenderValueSource
{
    public string? Name => content.Name;

    public string? GetText(string propertyAlias)
    {
        if (string.IsNullOrWhiteSpace(propertyAlias)) return null;

        if (string.Equals(propertyAlias, "name", StringComparison.OrdinalIgnoreCase)) return content.Name;

        // The draft first: during a publish it holds what is about to be saved, which is what the
        // generated image should reflect.
        return content.HasProperty(propertyAlias)
            ? content.GetValue<string>(propertyAlias)
            : published?.Value<string>(propertyAlias);
    }

    public DateTime? GetDate(string propertyAlias)
    {
        if (string.IsNullOrWhiteSpace(propertyAlias)) return null;

        switch (propertyAlias.ToLowerInvariant())
        {
            case "createdate":
                return content.CreateDate;
            case "updatedate":
                return content.UpdateDate;
        }

        if (!content.HasProperty(propertyAlias)) return published?.Value<DateTime?>(propertyAlias);

        var value = content.GetValue(propertyAlias);
        return value switch
        {
            DateTime date => date,
            string text when DateTime.TryParse(text, out var parsed) => parsed,
            _ => null
        };
    }

    public string GetReadingTime(string? propertyAlias)
        => ReadingTime.Estimate(GetText(propertyAlias ?? TextResolver.DefaultReadingTimeProperty));

    public Guid? GetMediaKey(string propertyAlias)
        => string.IsNullOrWhiteSpace(propertyAlias) ? null : MediaSource.ResolveMediaKey(GetText(propertyAlias));

    public IReadOnlyList<BadgeItem> GetItems(string propertyAlias)
    {
        if (published is null || string.IsNullOrWhiteSpace(propertyAlias)) return [];

        var nodes = published.Value<IEnumerable<IPublishedContent>>(propertyAlias);
        if (nodes is null) return [];

        return nodes.Select(node => new BadgeItem(
            node.Name,
            // Flattened to strings up front: the badge renderer only ever wants a label or an icon
            // slug, and this keeps IPublishedContent out of the rendering contract.
            node.Properties.ToDictionary(
                property => property.Alias,
                property => property.GetValue()?.ToString(),
                StringComparer.OrdinalIgnoreCase)))
            .ToList();
    }

    public bool IsTruthy(string propertyAlias)
    {
        if (string.IsNullOrWhiteSpace(propertyAlias)) return false;

        var value = content.HasProperty(propertyAlias) ? content.GetValue(propertyAlias) : published?.Value(propertyAlias);

        return value switch
        {
            null => false,
            bool flag => flag,
            string text => !string.IsNullOrWhiteSpace(text)
                && !string.Equals(text, "0", StringComparison.Ordinal)
                && !string.Equals(text, "false", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(text, "[]", StringComparison.Ordinal),
            int number => number != 0,
            System.Collections.IEnumerable list => list.GetEnumerator().MoveNext(),
            _ => true
        };
    }
}
