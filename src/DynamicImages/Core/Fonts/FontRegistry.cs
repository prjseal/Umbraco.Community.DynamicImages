using System.Collections.Concurrent;
using SixLabors.Fonts;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Core.Fonts;

public sealed class FontRegistry(
    IServiceScopeFactory scopeFactory,
    IFontFileProvider fileProvider,
    ILogger<FontRegistry> logger) : IFontRegistry
{
    // Lazy<Task<...>> so concurrent renders of the same font wait on one load rather than each
    // parsing the file. v1 built one dictionary in the service constructor, which is why a new
    // font needed an application restart.
    private readonly ConcurrentDictionary<Guid, Lazy<Task<FontFamily?>>> _families = new();

    public Task<FontFamily?> GetFamilyAsync(Guid fontKey, CancellationToken cancellationToken = default)
    {
        if (fontKey == Guid.Empty) return Task.FromResult<FontFamily?>(null);

        // The shared load deliberately ignores the caller's token: it is one load for every
        // caller, so the first caller aborting (the designer cancels stale previews) must not
        // leave the others - and every later render - with a cancelled task. The file provider's
        // own timeouts bound how long it can take.
        var entry = _families.GetOrAdd(fontKey, key =>
            new Lazy<Task<FontFamily?>>(() => LoadAsync(key), LazyThreadSafetyMode.ExecutionAndPublication));

        return entry.Value.WaitAsync(cancellationToken);
    }

    public async Task<Font?> GetFontAsync(Guid fontKey, float size, string? fontStyle, CancellationToken cancellationToken = default)
    {
        var family = await GetFamilyAsync(fontKey, cancellationToken);
        if (family is null) return null;

        var style = Enum.TryParse<FontStyle>(fontStyle, ignoreCase: true, out var parsed) ? parsed : FontStyle.Regular;

        // A family that only ships one weight cannot synthesise bold or italic; asking for one
        // throws, so fall back to what the file actually has.
        if (!family.Value.GetAvailableStyles().Contains(style))
        {
            style = family.Value.GetAvailableStyles().FirstOrDefault();
        }

        return family.Value.CreateFont(size <= 0 ? 16f : size, style);
    }

    public void Clear() => _families.Clear();

    public void Clear(Guid fontKey) => _families.TryRemove(fontKey, out _);

    private async Task<FontFamily?> LoadAsync(Guid fontKey)
    {
        try
        {
            var family = await LoadCoreAsync(fontKey);

            // A failed load is not cached: the next render retries instead of the font staying
            // dead on this server until a refresh or a restart.
            if (family is null) _families.TryRemove(fontKey, out _);

            return family;
        }
        catch (Exception ex)
        {
            _families.TryRemove(fontKey, out _);
            logger.LogError(ex, "Dynamic Images: font {FontKey} could not be loaded", fontKey);
            return null;
        }
    }

    private async Task<FontFamily?> LoadCoreAsync(Guid fontKey)
    {
        FontDefinition? definition;
        using (var scope = scopeFactory.CreateScope())
        {
            definition = scope.ServiceProvider.GetRequiredService<IFontRepository>().Get(fontKey);
        }

        if (definition is null)
        {
            logger.LogWarning("Dynamic Images: font {FontKey} is referenced by a template but no longer exists", fontKey);
            return null;
        }

        await using var stream = await fileProvider.OpenAsync(
            definition.SourceKind, definition.MediaKey, definition.Path, CancellationToken.None);

        if (stream is null)
        {
            logger.LogWarning("Dynamic Images: the file for font '{Family}' ({FontKey}) could not be read", definition.FamilyName, fontKey);
            return null;
        }

        try
        {
            // A collection per font: SixLabors keys families by the name inside the file, so two
            // fonts sharing a family name would collide in one shared collection - the bug the v1
            // orphan copy still has.
            var collection = new FontCollection();
            return collection.Add(stream);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Dynamic Images: font '{Family}' ({FontKey}) could not be parsed", definition.FamilyName, fontKey);
            return null;
        }
    }
}
