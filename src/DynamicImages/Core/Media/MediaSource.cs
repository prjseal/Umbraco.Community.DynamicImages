using System.Text.Json;

namespace Umbraco.Community.DynamicImages.Core.Media;

/// <summary>
/// Reads the shapes an Umbraco media reference arrives in: a bare path, an upload field's
/// <c>{ "src": ... }</c> JSON, a UDI, or MediaPicker3's array of <c>{ key, mediaKey }</c>.
/// </summary>
public static class MediaSource
{
    /// <summary>The stored file path from an umbracoFile value.</summary>
    public static string? ResolvePath(string? fileValue)
    {
        if (string.IsNullOrWhiteSpace(fileValue)) return null;

        if (!fileValue.TrimStart().StartsWith('{')) return fileValue;

        try
        {
            using var document = JsonDocument.Parse(fileValue);
            return document.RootElement.TryGetProperty("src", out var src) ? src.GetString() : null;
        }
        catch (JsonException)
        {
            return null;
        }
    }

    /// <summary>The media key a MediaPicker3 (or legacy UDI) property value points at.</summary>
    public static Guid? ResolveMediaKey(string? rawPropertyValue)
    {
        if (string.IsNullOrWhiteSpace(rawPropertyValue)) return null;

        var trimmed = rawPropertyValue.Trim();

        if (Umbraco.Cms.Core.UdiParser.TryParse(trimmed, out var udi) && udi is Umbraco.Cms.Core.GuidUdi guidUdi)
        {
            return guidUdi.Guid;
        }

        if (Guid.TryParse(trimmed, out var bare)) return bare;

        if (!trimmed.StartsWith('{') && !trimmed.StartsWith('[')) return null;

        try
        {
            using var document = JsonDocument.Parse(trimmed);
            var root = document.RootElement;

            if (root.ValueKind == JsonValueKind.Array)
            {
                if (root.GetArrayLength() == 0) return null;
                root = root[0];
            }

            if (root.TryGetProperty("mediaKey", out var mediaKey) && Guid.TryParse(mediaKey.GetString(), out var parsed))
                return parsed;

            if (root.TryGetProperty("key", out var key) && Guid.TryParse(key.GetString(), out var parsedKey))
                return parsedKey;
        }
        catch (JsonException)
        {
            // Not a media reference we understand - treat it as absent rather than throwing
            // during a publish.
        }

        return null;
    }

    /// <summary>A MediaPicker3 property value referencing one media item.</summary>
    public static string ToMediaPickerValue(Guid mediaKey)
        => JsonSerializer.Serialize(new[] { new { key = Guid.NewGuid(), mediaKey } });
}
