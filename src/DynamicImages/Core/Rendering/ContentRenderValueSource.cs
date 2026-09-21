using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Extensions;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Reads values off a real content node. Both the draft <see cref="IContent"/> and the published
/// <see cref="IPublishedContent"/> are used: the draft carries the in-flight values during a
/// publish, while the published node is what resolves picker properties into nodes.
/// <para>
/// A property alias may be a dotted path - <c>author.mainImage</c> - which follows a content
/// reference and reads the property on the node it lands on. The first node wins when a picker
/// holds several, and a path over <see cref="PropertyPath.MaxHops"/> hops resolves to nothing.
/// </para>
/// </summary>
/// <param name="contentCache">
/// Optional so every existing call site keeps compiling. Without it a dotted path can only follow
/// a reference a converter has already resolved into nodes, not a raw stored UDI.
/// </param>
public sealed class ContentRenderValueSource(
    IContent content,
    IPublishedContent? published,
    IPublishedContentCache? contentCache = null) : IRenderValueSource
{
    public string? Name => content.Name;

    public string? GetText(string propertyAlias)
    {
        if (string.IsNullOrWhiteSpace(propertyAlias)) return null;

        if (PropertyPath.IsPath(propertyAlias))
        {
            return ResolveTarget(propertyAlias) is { } target ? PublishedValues.TextOf(target.Node, target.Alias) : null;
        }

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

        if (PropertyPath.IsPath(propertyAlias))
        {
            return ResolveTarget(propertyAlias) is { } target ? PublishedValues.DateOf(target.Node, target.Alias) : null;
        }

        switch (propertyAlias.ToLowerInvariant())
        {
            case "createdate":
                return content.CreateDate;
            case "updatedate":
                return content.UpdateDate;
        }

        if (!content.HasProperty(propertyAlias)) return PublishedValues.DateOf(published, propertyAlias);

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
    {
        if (string.IsNullOrWhiteSpace(propertyAlias)) return null;

        if (PropertyPath.IsPath(propertyAlias))
        {
            return ResolveTarget(propertyAlias) is { } target ? PublishedValues.MediaKeyOf(target.Node, target.Alias) : null;
        }

        // A non-dotted read keeps its draft-first raw-string behaviour, where only the final hop of
        // a path uses the typed reader. The asymmetry is deliberate: the draft's raw JSON is the
        // authority during a publish, and there is no draft for a linked node.
        return MediaSource.ResolveMediaKey(GetText(propertyAlias));
    }

    public IReadOnlyList<BadgeItem> GetItems(string propertyAlias)
    {
        if (string.IsNullOrWhiteSpace(propertyAlias)) return [];

        if (PropertyPath.IsPath(propertyAlias))
        {
            return ResolveTarget(propertyAlias) is { } target ? PublishedValues.ItemsOf(target.Node, target.Alias) : [];
        }

        return PublishedValues.ItemsOf(published, propertyAlias);
    }

    public bool IsTruthy(string propertyAlias)
    {
        if (string.IsNullOrWhiteSpace(propertyAlias)) return false;

        if (PropertyPath.IsPath(propertyAlias))
        {
            return ResolveTarget(propertyAlias) is { } target
                && PublishedValues.Truthy(PublishedValues.ValueOf(target.Node, target.Alias));
        }

        var value = content.HasProperty(propertyAlias)
            ? content.GetValue(propertyAlias)
            : PublishedValues.ValueOf(published, propertyAlias);

        return PublishedValues.Truthy(value);
    }

    /// <summary>
    /// Walks a dotted path to the node its last segment should be read on. Null when the path is
    /// too deep to follow or any hop resolves to nothing - the caller then reports the same empty
    /// value it would for a property that is simply not set.
    /// </summary>
    private (IPublishedContent Node, string Alias)? ResolveTarget(string propertyAlias)
    {
        var path = PropertyPath.Parse(propertyAlias);

        // Over the cap the whole path resolves to nothing rather than being truncated: truncating
        // would quietly read the wrong property. TemplateValidator's PropertyPathTooDeep warning is
        // how the editor finds out instead.
        if (path.IsTooDeep) return null;

        var node = FollowFirstHop(path.First);

        foreach (var hop in path.Hops.Skip(1))
        {
            if (node is null) return null;

            // Later hops are pure published content: there is no draft for a node that is not
            // itself being published.
            node = PublishedValues.FollowFirst(node, hop, contentCache);
        }

        return node is null ? null : (node, path.Last);
    }

    /// <summary>
    /// The first hop is special. It reads the draft's raw value first, because during a publish the
    /// draft holds the node the editor just picked while the published node still names the old one
    /// - the same reason <see cref="GetText"/> is draft-first.
    /// </summary>
    private IPublishedContent? FollowFirstHop(string alias)
    {
        if (content.HasProperty(alias) &&
            PublishedValues.FollowRaw(content.GetValue<string>(alias), contentCache) is { } fromDraft)
        {
            return fromDraft;
        }

        // A draft miss, an unparseable draft value or no cache all fall back to the published node
        // rather than to nothing.
        return PublishedValues.FollowFirst(published, alias, contentCache);
    }
}
