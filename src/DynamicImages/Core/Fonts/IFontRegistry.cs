using SixLabors.Fonts;

namespace Umbraco.Community.DynamicImages.Core.Fonts;

/// <summary>
/// Resolves a font key from a template to a loaded <see cref="FontFamily"/>. Replaces v1's
/// constructor-built dictionary, which meant a new font needed an application restart and a
/// mistyped key threw out of an indexer mid-publish.
/// </summary>
public interface IFontRegistry
{
    /// <summary>The family for a font row, or null when the row or its file is missing.</summary>
    Task<FontFamily?> GetFamilyAsync(Guid fontKey, CancellationToken cancellationToken = default);

    /// <summary>
    /// A ready-to-draw font. <paramref name="styleName"/> names a style on the font row, whose
    /// size and weight are used when the layer does not override them.
    /// </summary>
    Task<Font?> GetFontAsync(Guid fontKey, float size, string? fontStyle, CancellationToken cancellationToken = default);

    /// <summary>Drops cached families so the next render reloads them. Called by the cache refresher.</summary>
    void Clear();

    /// <summary>Drops one cached family - a font's file changed or the row was deleted.</summary>
    void Clear(Guid fontKey);
}
