using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>A published content cache over a dictionary - enough to follow a reference in a test.</summary>
public sealed class FakeContentCache(params IPublishedContent[] nodes) : IPublishedContentCache
{
    private readonly Dictionary<Guid, IPublishedContent> _nodes = nodes.ToDictionary(node => node.Key);

    public IPublishedContent? GetById(Guid contentId) => _nodes.GetValueOrDefault(contentId);

    public IPublishedContent? GetById(bool preview, Guid contentId) => GetById(contentId);

    public IPublishedContent? GetById(int contentId) => throw new NotSupportedException();

    public IPublishedContent? GetById(bool preview, int contentId) => throw new NotSupportedException();

    public Task<IPublishedContent?> GetByIdAsync(Guid contentId, bool? preview = null)
        => Task.FromResult(GetById(contentId));

    public Task<IPublishedContent?> GetByIdAsync(int contentId, bool? preview = null)
        => throw new NotSupportedException();
}
