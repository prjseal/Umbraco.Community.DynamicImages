using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Community.DynamicImages.Core.Media;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Reads a property off a published node, and follows a content reference to the next one.
/// <para>
/// Every read here goes through <see cref="IPublishedElement.GetProperty"/> and
/// <see cref="IPublishedProperty.GetValue"/> rather than the one-argument
/// <c>Umbraco.Extensions.FriendlyPublishedContentExtensions.Value&lt;T&gt;</c>. That friendly
/// overload lives in Umbraco.Cms.Web.Common and resolves an <c>IPublishedValueFallback</c> out of
/// the container itself, so it throws in a test with no container. The behaviour is the same - the
/// friendly form defaults to <c>Fallback.NoFallback</c> with no culture - and this way the whole
/// target-node reader is unit-testable.
/// </para>
/// </summary>
internal static class PublishedValues
{
    /// <summary>The raw converted value of a property, or null when the node has no such property.</summary>
    public static object? ValueOf(IPublishedContent? node, string alias)
        => node?.GetProperty(alias)?.GetValue();

    /// <summary>
    /// Follows a content-reference property to the node it points at. The first node wins when a
    /// picker holds several.
    /// </summary>
    public static IPublishedContent? FollowFirst(IPublishedContent? node, string alias, IPublishedContentCache? cache)
    {
        if (node is null || string.IsNullOrWhiteSpace(alias)) return null;

        return ValueOf(node, alias) switch
        {
            // A ContentPicker's converter hands back the node itself.
            IPublishedContent linked => linked,

            // An MNTP's hands back a sequence. Covariance means any typed sequence lands here too.
            IEnumerable<IPublishedContent> linked => linked.FirstOrDefault(),

            // No converter ran - the stored string is all there is.
            var value => FollowRaw(value?.ToString(), cache)
        };
    }

    /// <summary>The node a raw content-reference value points at, or null without a cache to look it up in.</summary>
    public static IPublishedContent? FollowRaw(string? raw, IPublishedContentCache? cache)
    {
        if (cache is null) return null;

        return DocumentReference.ResolveFirstKey(raw) is { } key ? cache.GetById(key) : null;
    }

    /// <summary>
    /// A property as text. A content reference resolves to the linked node's name rather than to a
    /// UDI, which is what an editor means by binding a text layer to a picker.
    /// </summary>
    public static string? TextOf(IPublishedContent? node, string alias)
    {
        if (node is null || string.IsNullOrWhiteSpace(alias)) return null;

        if (string.Equals(alias, "name", StringComparison.OrdinalIgnoreCase)) return node.Name;

        return Stringify(ValueOf(node, alias));
    }

    /// <summary>
    /// The shape-aware stringifier. Rich-text stripping is deliberately not here - it stays in
    /// <c>TextResolver.ResolveProperty</c>, which is the single place that decides it.
    /// </summary>
    private static string? Stringify(object? value) => value switch
    {
        null => null,
        string text => text,
        IPublishedContent linked => linked.Name,
        IEnumerable<IPublishedContent> linked => string.Join(", ", linked.Select(item => item.Name)),
        IEnumerable<string> list => string.Join(", ", list),
        DateTime date => date.ToString("O"),
        _ => value.ToString()
    };

    /// <summary>A property as a date, including the two node pseudo-properties.</summary>
    public static DateTime? DateOf(IPublishedContent? node, string alias)
    {
        if (node is null || string.IsNullOrWhiteSpace(alias)) return null;

        switch (alias.ToLowerInvariant())
        {
            case "createdate":
                return node.CreateDate;
            case "updatedate":
                return node.UpdateDate;
        }

        return ValueOf(node, alias) switch
        {
            DateTime date => date,
            string text when DateTime.TryParse(text, out var parsed) => parsed,
            _ => null
        };
    }

    /// <summary>
    /// A property as a media key. The typed value is preferred - a converter has already done the
    /// work - and the raw-string parse is the fallback for a site where none ran.
    /// </summary>
    public static Guid? MediaKeyOf(IPublishedContent? node, string alias)
    {
        if (node is null || string.IsNullOrWhiteSpace(alias)) return null;

        return ValueOf(node, alias) switch
        {
            // Take the wrapped node's key explicitly rather than trusting MediaWithCrops to
            // forward Key across a minor version.
            MediaWithCrops crops => crops.Content?.Key,
            IEnumerable<MediaWithCrops> crops => crops.FirstOrDefault()?.Content?.Key,
            IPublishedContent media => media.Key,
            IEnumerable<IPublishedContent> media => media.FirstOrDefault()?.Key,
            var value => MediaSource.ResolveMediaKey(value?.ToString())
        };
    }

    /// <summary>
    /// A picker property as badge items, flattened to strings up front: the badge renderer only
    /// ever wants a label or an icon slug, and this keeps <see cref="IPublishedContent"/> out of
    /// the rendering contract.
    /// <para>
    /// Known limitation: a badge item's own picker property still stringifies to a UDI here, so
    /// badge label and icon aliases stay single-segment reads.
    /// </para>
    /// </summary>
    public static IReadOnlyList<BadgeItem> ItemsOf(IPublishedContent? node, string alias)
    {
        if (node is null || string.IsNullOrWhiteSpace(alias)) return [];

        IEnumerable<IPublishedContent> nodes = ValueOf(node, alias) switch
        {
            IEnumerable<IPublishedContent> many => many,
            IPublishedContent one => [one],
            _ => []
        };

        return nodes.Select(item => new BadgeItem(
            item.Name,
            item.Properties.ToDictionary(
                property => property.Alias,
                property => property.GetValue()?.ToString(),
                StringComparer.OrdinalIgnoreCase)))
            .ToList();
    }

    /// <summary>Whether a property value counts as "set" for a visibility rule.</summary>
    public static bool Truthy(object? value) => value switch
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
