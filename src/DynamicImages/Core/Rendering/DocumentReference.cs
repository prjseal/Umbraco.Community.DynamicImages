using System.Text.Json;
using Umbraco.Cms.Core;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Reads the shapes a content reference arrives in: a UDI, a comma-separated list of them, a bare
/// GUID, or a JSON array of either.
/// <para>
/// Deliberately not next to <see cref="Media.MediaSource"/> in <c>Core/Media</c>. Putting the
/// content reader beside the media reader is exactly how the two would drift into each other, and
/// the entity-type distinction between them is the bug this class exists to fix: a
/// <c>umb://document/…</c> UDI parsed by the media reader yields a document key that is then looked
/// for - and correctly not found - in the media tree.
/// </para>
/// </summary>
public static class DocumentReference
{
    /// <summary>
    /// Every document key a content-reference property value points at, in the order they were
    /// stored. Anything that is not a document reference yields an empty list rather than throwing:
    /// a publish must never fail here.
    /// </summary>
    public static IReadOnlyList<Guid> ResolveKeys(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return [];

        var trimmed = raw.Trim();

        if (trimmed.StartsWith('[') || trimmed.StartsWith('{')) return FromJson(trimmed);

        var keys = new List<Guid>();

        foreach (var token in trimmed.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            if (TryResolveToken(token, out var key)) keys.Add(key);
        }

        return keys;
    }

    /// <summary>The first key a reference points at. The first node wins when a picker holds several.</summary>
    public static Guid? ResolveFirstKey(string? raw)
    {
        var keys = ResolveKeys(raw);
        return keys.Count > 0 ? keys[0] : null;
    }

    /// <summary>
    /// Whether a value is unambiguously a content reference. Stricter than
    /// <see cref="ResolveKeys"/> on purpose: it demands every token be a <c>umb://document/</c>
    /// UDI, because this is what decides whether a bare alias in a text layer prints its value or
    /// follows it - and a bare GUID is a string somebody might legitimately want drawn.
    /// </summary>
    public static bool LooksLikeDocumentReference(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return false;

        var tokens = raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return tokens.Length > 0 && tokens.All(token => TryParseDocumentUdi(token, out _));
    }

    private static IReadOnlyList<Guid> FromJson(string json)
    {
        try
        {
            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;

            if (root.ValueKind != JsonValueKind.Array) return FromJsonElement(root) is { } single ? [single] : [];

            var keys = new List<Guid>();
            foreach (var element in root.EnumerateArray())
            {
                if (FromJsonElement(element) is { } key) keys.Add(key);
            }

            return keys;
        }
        catch (JsonException)
        {
            // Not a content reference we understand - treat it as absent rather than throwing
            // during a publish, exactly as MediaSource does.
            return [];
        }
    }

    private static Guid? FromJsonElement(JsonElement element)
    {
        if (element.ValueKind == JsonValueKind.String)
            return TryResolveToken(element.GetString(), out var key) ? key : null;

        if (element.ValueKind != JsonValueKind.Object) return null;

        if (element.TryGetProperty("key", out var keyProperty) && TryResolveToken(keyProperty.GetString(), out var fromKey))
            return fromKey;

        if (element.TryGetProperty("contentKey", out var contentKey) && TryResolveToken(contentKey.GetString(), out var fromContentKey))
            return fromContentKey;

        return null;
    }

    private static bool TryResolveToken(string? token, out Guid key)
    {
        if (TryParseDocumentUdi(token, out key)) return true;

        return Guid.TryParse(token, out key);
    }

    /// <summary>
    /// A UDI whose entity type really is <c>document</c>. That check is the whole point: without it
    /// a <c>umb://media/…</c> value parses just as happily and the caller follows a media key into
    /// the content cache.
    /// </summary>
    private static bool TryParseDocumentUdi(string? token, out Guid key)
    {
        key = Guid.Empty;

        if (string.IsNullOrWhiteSpace(token)) return false;

        if (!UdiParser.TryParse(token.Trim(), out var udi) || udi is not GuidUdi guidUdi) return false;

        if (!string.Equals(guidUdi.EntityType, Constants.UdiEntityType.Document, StringComparison.OrdinalIgnoreCase))
            return false;

        key = guidUdi.Guid;
        return true;
    }
}
