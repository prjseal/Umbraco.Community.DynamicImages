using System.Text.Json;
using System.Text.Json.Serialization;

namespace Umbraco.Community.DynamicImages.Core.Json;

/// <summary>
/// The single serializer used for template documents on disk, in the database and over the API,
/// so the JSON the designer round-trips is byte-for-byte the JSON the renderer reads.
/// </summary>
public static class DynamicImagesJsonOptions
{
    public static JsonSerializerOptions Default { get; } = Create(writeIndented: false);

    /// <summary>Used by export and file sync, where a human reads and diffs the result.</summary>
    public static JsonSerializerOptions Indented { get; } = Create(writeIndented: true);

    private static JsonSerializerOptions Create(bool writeIndented) => new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        WriteIndented = writeIndented,
        Converters =
        {
            // Enums travel as their camelCase names ("topLeft", "ellipsis"), not as integers -
            // the v1 config's numeric LayerType is exactly the sort of thing this replaces.
            new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
        }
    };
}
