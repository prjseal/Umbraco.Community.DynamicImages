using System.Text.Json;

namespace Umbraco.Community.DynamicImages.Core.Services;

/// <summary>
/// Reads a picker data type's <c>filter</c> setting - the content types it allows to be picked.
/// <para>
/// The setting arrives in three shapes. Umbraco 17 writes a comma-separated string of content-type
/// keys; older sites wrote aliases the same way; and read straight out of
/// <c>IDataType.ConfigurationData</c> it can still be a raw <see cref="JsonElement"/> array or an
/// already-materialised sequence. Reading it by dictionary key rather than casting to
/// <c>MultiNodePickerConfiguration</c> keeps this version-robust: the typed class has moved
/// between majors.
/// </para>
/// <para>
/// Note that <c>Umbraco.ContentPicker</c> has no type filter at all - only
/// <c>ignoreUserStartNodes</c> - so a content picker always falls through to the next inference
/// step.
/// </para>
/// </summary>
public static class DataTypeFilter
{
    /// <summary>The configuration key the filter is stored under.</summary>
    public const string Key = "filter";

    /// <summary>The filter tokens - each a content-type key or, on an older site, an alias.</summary>
    public static IReadOnlyList<string> Parse(object? value) => value switch
    {
        null => [],
        string text => Split(text),
        JsonElement element => FromJson(element),
        IEnumerable<string> list => list.Select(item => item?.Trim()).Where(NotEmpty).Select(item => item!).ToList(),
        System.Collections.IEnumerable list => list.Cast<object?>()
            .Select(item => item?.ToString()?.Trim()).Where(NotEmpty).Select(item => item!).ToList(),
        _ => Split(value.ToString())
    };

    /// <summary>The filter on a data type's configuration, or an empty list when it has none.</summary>
    public static IReadOnlyList<string> Parse(IDictionary<string, object>? configuration)
        => configuration is not null && configuration.TryGetValue(Key, out var value) ? Parse(value) : [];

    private static IReadOnlyList<string> FromJson(JsonElement element) => element.ValueKind switch
    {
        JsonValueKind.String => Split(element.GetString()),
        JsonValueKind.Array => element.EnumerateArray()
            .Select(item => item.ValueKind == JsonValueKind.String ? item.GetString()?.Trim() : item.ToString().Trim())
            .Where(NotEmpty)
            .Select(item => item!)
            .ToList(),
        _ => []
    };

    private static IReadOnlyList<string> Split(string? text)
        => string.IsNullOrWhiteSpace(text)
            ? []
            : text.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();

    private static bool NotEmpty(string? value) => !string.IsNullOrWhiteSpace(value);
}
