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
        => PublishedValues.ItemsOf(published, propertyAlias);

    public bool IsTruthy(string propertyAlias)
    {
        if (string.IsNullOrWhiteSpace(propertyAlias)) return false;

        var value = content.HasProperty(propertyAlias)
            ? content.GetValue(propertyAlias)
            : PublishedValues.ValueOf(published, propertyAlias);

        return PublishedValues.Truthy(value);
    }
}
