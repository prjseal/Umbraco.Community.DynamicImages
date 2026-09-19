namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

public sealed class RemoteFontFetcher(
    IHttpClientFactory httpClientFactory,
    IFontCacheRoot cacheRoot,
    ILogger<RemoteFontFetcher> logger) : IRemoteFontFetcher
{
    public async Task<byte[]> GetBytesAsync(Uri url, string? expectedHash, CancellationToken cancellationToken = default)
    {
        if (FontHash.IsValid(expectedHash))
        {
            var cached = await TryReadAsync(CachePath(expectedHash!), cancellationToken);
            if (cached is not null) return cached;
        }

        // The named client carries the timeout and MaxResponseContentBufferSize, so an oversize
        // file throws out of GetByteArrayAsync rather than needing a hand-rolled streaming cap.
        using var client = httpClientFactory.CreateClient(DynamicImagesConstants.WebFontHttpClientName);
        var bytes = await client.GetByteArrayAsync(url, cancellationToken);
        var hash = FontHash.Compute(bytes);

        if (expectedHash is not null && !string.Equals(hash, expectedHash, StringComparison.OrdinalIgnoreCase))
        {
            // Google's file URLs are versioned and immutable, so this is a direct URL whose file
            // changed underneath the row. It still renders; Refresh is what updates the hash.
            logger.LogWarning(
                "Dynamic Images: the font at {Url} no longer matches its registered hash ({Expected} → {Actual}). Refresh the font to update it.",
                url, expectedHash, hash);
        }

        Write(CachePath(hash), bytes);

        return bytes;
    }

    public void Evict(string? contentHash)
    {
        if (!FontHash.IsValid(contentHash)) return;

        try
        {
            File.Delete(CachePath(contentHash!));
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException)
        {
            logger.LogDebug(ex, "Dynamic Images: the cached font {Hash} could not be deleted", contentHash);
        }
    }

    private string CachePath(string hash) => Path.Combine(cacheRoot.Path, $"{hash.ToUpperInvariant()}.bin");

    private static async Task<byte[]?> TryReadAsync(string path, CancellationToken cancellationToken)
    {
        try
        {
            return File.Exists(path) ? await File.ReadAllBytesAsync(path, cancellationToken) : null;
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException)
        {
            // A half-written or vanished file is a miss, not a failure.
            return null;
        }
    }

    /// <summary>
    /// Writes through a uniquely named temp file and a move, so a reader never sees a partial
    /// file. Umbraco's temp path can sit on a shared file system on a scaled-out App Service, so
    /// two servers may write the same hash at once: "it already exists" is success.
    /// </summary>
    private void Write(string finalPath, byte[] bytes)
    {
        var tempPath = $"{finalPath[..^".bin".Length]}.{Guid.NewGuid():N}.tmp";

        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(finalPath)!);
            File.WriteAllBytes(tempPath, bytes);
            File.Move(tempPath, finalPath, overwrite: true);
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException)
        {
            if (!File.Exists(finalPath))
            {
                // The bytes are still served; only the next cold start pays for the download again.
                logger.LogWarning(ex, "Dynamic Images: the fetched font could not be cached at {Path}", finalPath);
            }
        }
        finally
        {
            try { if (File.Exists(tempPath)) File.Delete(tempPath); }
            catch (Exception ex) when (ex is IOException or UnauthorizedAccessException) { /* leftover temp file, harmless */ }
        }
    }
}
