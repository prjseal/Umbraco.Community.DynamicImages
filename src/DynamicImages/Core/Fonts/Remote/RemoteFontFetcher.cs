namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

public sealed class RemoteFontFetcher(
    IHttpClientFactory httpClientFactory,
    IFontCacheRoot cacheRoot,
    ILogger<RemoteFontFetcher> logger) : IRemoteFontFetcher
{
    public async Task<byte[]?> GetBytesAsync(
        Uri url, string? providerName, string? expectedHash, CancellationToken cancellationToken = default)
    {
        // Checked here rather than only at registration, because this is the one place every
        // caller goes through: a row written by a uSync import, or edited in the database, gets
        // the same treatment as one an editor typed into the backoffice.
        if (UrlProblem(url, providerName) is { } problem) throw new FontFetchException(problem);

        if (FontHash.IsValid(expectedHash))
        {
            var cached = await TryReadAsync(CachePath(expectedHash!), cancellationToken);
            if (cached is not null) return cached;
        }

        // The named client carries the timeout and MaxResponseContentBufferSize, so an oversize
        // file throws out of ReadAsByteArrayAsync rather than needing a hand-rolled streaming cap.
        using var client = httpClientFactory.CreateClient(DynamicImagesConstants.WebFontHttpClientName);

        using var response = await client.GetAsync(url, cancellationToken);

        // The handler does not follow redirects, so a 3xx arrives here as itself. Saying so beats
        // the "answered 302" a bare status check would give: the fix is to enter the final URL.
        if ((int)response.StatusCode is >= 300 and < 400)
        {
            throw new FontFetchException(
                $"'{url}' redirects somewhere else. Enter the URL of the font file itself.");
        }

        response.EnsureSuccessStatusCode();

        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);
        var hash = FontHash.Compute(bytes);

        if (expectedHash is not null && !string.Equals(hash, expectedHash, StringComparison.OrdinalIgnoreCase))
        {
            // Not served and not cached. The registered hash is what every server agreed this
            // font is; bytes that do not match it are parsed by SixLabors.Fonts on the server and
            // served to every designer's browser, so accepting them on trust is the whole
            // problem. Refresh fetches with no expected hash, and is the sanctioned way in.
            logger.LogWarning(
                "Dynamic Images: the font at {Url} no longer matches its registered hash ({Expected} -> {Actual}), so it was not used. Refresh the font to accept the new file.",
                url, expectedHash, hash);

            return null;
        }

        Write(CachePath(hash), bytes);

        return bytes;
    }

    /// <summary>
    /// Why this URL may not be fetched, or null when it may be. The scheme, host shape and
    /// user-info rules are the same ones registration applies; the provider host rule is the
    /// extra one, and it is what stops a row claiming to be a Google font pointing elsewhere.
    /// </summary>
    private static string? UrlProblem(Uri url, string? providerName)
    {
        if (WebFontProviders.ValidateDirectUrl(url.ToString(), out _) is { } problem) return problem;

        var provider = WebFontProviders.Get(providerName);
        if (provider?.FileHost is null) return null;

        return provider.AllowsFileUrl(url)
            ? null
            : $"A {provider.DisplayName} font has to be served from {provider.FileHost}, and '{url.Host}' is not.";
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
