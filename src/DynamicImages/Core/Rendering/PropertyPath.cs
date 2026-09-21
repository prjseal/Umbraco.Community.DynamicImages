namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// A dotted property alias - <c>author.mainImage</c> - split into the hops that follow a content
/// reference and the alias that is finally read.
/// <para>
/// The dotted string rides in the existing <c>propertyAlias</c> fields, so uSync serialisation,
/// the template JSON and <c>{prop:author.jobTitle}</c> expressions all carry it unchanged.
/// </para>
/// </summary>
/// <param name="First">The first segment - the property read on the node being rendered.</param>
/// <param name="Hops">Every segment except the last: the references that are followed.</param>
/// <param name="Last">The alias read on the node the hops land on. Equals <paramref name="First"/> for a bare alias.</param>
/// <param name="IsTooDeep">The path follows more references than <see cref="MaxHops"/> allows.</param>
public readonly record struct PropertyPath(string First, IReadOnlyList<string> Hops, string Last, bool IsTooDeep)
{
    /// <summary>
    /// How many content references a path may follow. An over-cap path resolves to nothing rather
    /// than being truncated: truncating would quietly read the wrong property, and the validator's
    /// <c>PropertyPathTooDeep</c> warning is how the editor finds out instead.
    /// </summary>
    public const int MaxHops = 3;

    /// <summary>The number of segments: one more than the number of hops.</summary>
    public int SegmentCount => Hops.Count + 1;

    /// <summary>Whether the alias names a property on a linked node rather than on this one.</summary>
    public static bool IsPath(string? alias) => Parse(alias).Hops.Count > 0;

    /// <summary>
    /// Splits a dotted alias. Empty segments are dropped, so <c>"author."</c> degrades to the bare
    /// alias - defensive, not a feature.
    /// </summary>
    public static PropertyPath Parse(string? alias)
    {
        if (string.IsNullOrWhiteSpace(alias)) return new PropertyPath(string.Empty, [], string.Empty, false);

        var segments = alias
            .Split('.', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .ToArray();

        if (segments.Length == 0) return new PropertyPath(string.Empty, [], string.Empty, false);

        var hops = segments[..^1];

        return new PropertyPath(segments[0], hops, segments[^1], hops.Length > MaxHops);
    }
}
