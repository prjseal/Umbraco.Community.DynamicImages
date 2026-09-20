namespace Umbraco.Community.DynamicImages.Core.Fonts;

/// <summary>
/// Reading a numeric weight out of a font's names.
/// <para>
/// SixLabors.Fonts 2.0.8 exposes no OS/2 <c>usWeightClass</c>, so the names are all there is. The
/// original implementation looked only at OpenType name ID 2 - which the spec restricts to
/// Regular/Bold/Italic/BoldItalic - and so reported every SemiBold and ExtraBold face as 400.
/// </para>
/// <para>
/// This half is pure string work and lives here so it can be tested against real-world names
/// without standing up <c>FontService</c> and its fourteen dependencies. Which names to feed it,
/// and in what order, is <c>FontService.WeightBearingNames</c>.
/// </para>
/// </summary>
public static class FontWeights
{
    /// <summary>
    /// More specific names first, so "ExtraBold" is not matched as plain "Bold" and "SemiBold"
    /// is not matched as "Bold" either. Order is the whole correctness of this table.
    /// </summary>
    private static readonly (string Name, int Weight)[] Named =
    [
        ("ExtraLight", 200),
        ("UltraLight", 200),
        ("SemiBold", 600),
        ("DemiBold", 600),
        ("ExtraBold", 800),
        ("UltraBold", 800),
        ("Thin", 100),
        ("Light", 300),
        ("Medium", 500),
        ("Black", 900),
        ("Heavy", 900),
        ("Bold", 700),
        ("Regular", 400),
        ("Normal", 400),
        ("Book", 400)
    ];

    /// <summary>
    /// The first named weight in a string, or null. Spaces, hyphens and underscores are stripped
    /// first, so "Semi-Bold", "Semi Bold" and "SemiBold" all match.
    /// </summary>
    public static int? In(string? candidate)
    {
        if (string.IsNullOrWhiteSpace(candidate)) return null;

        var normalised = candidate
            .Replace(" ", string.Empty)
            .Replace("-", string.Empty)
            .Replace("_", string.Empty);

        foreach (var (name, weight) in Named)
        {
            if (normalised.Contains(name, StringComparison.OrdinalIgnoreCase)) return weight;
        }

        return null;
    }

    /// <summary>
    /// The first named weight found across the candidates, in order, or <paramref name="fallback"/>.
    /// Order matters: the caller supplies the names most likely to carry a real weight first.
    /// </summary>
    public static int From(IEnumerable<string?> candidates, int fallback)
    {
        foreach (var candidate in candidates)
        {
            var weight = In(candidate);
            if (weight is not null) return weight.Value;
        }

        return fallback;
    }
}
