using System.Security.Cryptography;

namespace Umbraco.Community.DynamicImages.Core.Fonts;

/// <summary>
/// The one hash a font's bytes get: it is the row's ContentHash, the ETag on the client font
/// endpoint, and the file name in the web font cache, so it lives in one place.
/// </summary>
public static class FontHash
{
    public static string Compute(byte[] bytes) => Convert.ToHexString(SHA256.HashData(bytes))[..32];

    /// <summary>True for a value this class produced - 32 hex digits - so a hash is safe to use as a file name.</summary>
    public static bool IsValid(string? hash) => hash is { Length: 32 } && hash.All(char.IsAsciiHexDigit);
}
