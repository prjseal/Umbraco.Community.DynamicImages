namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

/// <summary>
/// A font could not be fetched, for a reason written for the editor who asked. Distinct from
/// <see cref="HttpRequestException"/> because these are refusals by this package's own rules -
/// a URL that is not allowed, a file that does not match its registered hash - rather than
/// anything the network said.
/// </summary>
public sealed class FontFetchException(string message) : Exception(message);

/// <summary>
/// Downloads a web font's file and keeps a copy on this server's disk, content-addressed by the
/// bytes' hash, so a font is fetched once per server and a refresh that changes the bytes
/// changes the file name everywhere without any cross-server invalidation.
/// <para>
/// It is also the single choke point where a font URL is checked. Validating only at registration
/// left <c>fonts/{key}/file</c> serving whatever absolute URI happened to be in the row - and a
/// row can arrive from a uSync import rather than from the backoffice.
/// </para>
/// </summary>
public interface IRemoteFontFetcher
{
    /// <summary>
    /// The file's bytes: from the cache when <paramref name="expectedHash"/> names a cached file,
    /// otherwise downloaded, checked and cached.
    /// <para>
    /// Null when <paramref name="expectedHash"/> is set and the downloaded bytes do not match it.
    /// A changed file is not served and not cached: the registered hash is what every server
    /// agreed this font is, and the only sanctioned way to accept new bytes is a refresh, which
    /// fetches with no expected hash. The health check reports the mismatch.
    /// </para>
    /// <para>
    /// Throws <see cref="FontFetchException"/> when the URL is not one this package may fetch,
    /// or <see cref="HttpRequestException"/> / <see cref="TaskCanceledException"/> when the
    /// download itself fails, times out or is too large.
    /// </para>
    /// </summary>
    /// <param name="providerName">
    /// The row's provider - google, bunny or direct. A provider with a fixed file host is held to
    /// it, so a row claiming to be a Google font cannot point somewhere else.
    /// </param>
    Task<byte[]?> GetBytesAsync(Uri url, string? providerName, string? expectedHash, CancellationToken cancellationToken = default);

    /// <summary>Best-effort delete of this server's cached copy. The other servers' copies simply go unused.</summary>
    void Evict(string? contentHash);
}
