namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

/// <summary>
/// Downloads a web font's file and keeps a copy on this server's disk, content-addressed by the
/// bytes' hash, so a font is fetched once per server and a refresh that changes the bytes
/// changes the file name everywhere without any cross-server invalidation.
/// </summary>
public interface IRemoteFontFetcher
{
    /// <summary>
    /// The file's bytes: from the cache when <paramref name="expectedHash"/> names a cached file,
    /// otherwise downloaded and cached. Throws <see cref="HttpRequestException"/> or
    /// <see cref="TaskCanceledException"/> when the download fails, times out or is too large.
    /// </summary>
    Task<byte[]> GetBytesAsync(Uri url, string? expectedHash, CancellationToken cancellationToken = default);

    /// <summary>Best-effort delete of this server's cached copy. The other servers' copies simply go unused.</summary>
    void Evict(string? contentHash);
}
