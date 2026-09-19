using System.Net;
using Microsoft.Extensions.Logging;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Fonts.Remote;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The fetcher against a stub handler and a temp directory: no network, no Umbraco. The cache
/// is content-addressed, so what these mostly check is which requests reach the handler.
/// </summary>
public class RemoteFontFetcherTests : IDisposable
{
    private static readonly Uri FontUrl = new("https://fonts.gstatic.com/s/inter/v20/abc.ttf");
    private static readonly byte[] FontBytes = "not really a font, but bytes are bytes"u8.ToArray();

    private readonly string _root = Path.Combine(Path.GetTempPath(), $"di-font-cache-{Guid.NewGuid():N}");
    private readonly ListLogger<RemoteFontFetcher> _logger = new();

    public void Dispose()
    {
        if (Directory.Exists(_root)) Directory.Delete(_root, recursive: true);
        GC.SuppressFinalize(this);
    }

    private RemoteFontFetcher Fetcher(StubHandler handler, long maxBytes = 10 * 1024 * 1024)
        => new(new StubClientFactory(handler, maxBytes), new StubCacheRoot(_root), _logger);

    private static StubHandler Serving(byte[] bytes, HttpStatusCode status = HttpStatusCode.OK)
        => new(_ => new HttpResponseMessage(status) { Content = new ByteArrayContent(bytes) });

    [Fact]
    public async Task GetBytesAsync_DownloadsOnAMissAndReadsTheCacheOnAHit()
    {
        var handler = Serving(FontBytes);
        var fetcher = Fetcher(handler);

        var first = await fetcher.GetBytesAsync(FontUrl, expectedHash: null);
        var hash = FontHash.Compute(first);

        Assert.Equal(FontBytes, first);
        Assert.Equal(1, handler.Requests);
        Assert.True(File.Exists(Path.Combine(_root, $"{hash}.bin")));

        // Every url row carries a hash, so the second server (or the same one after a restart)
        // asks by hash and never touches the network.
        var second = await fetcher.GetBytesAsync(FontUrl, hash);

        Assert.Equal(FontBytes, second);
        Assert.Equal(1, handler.Requests);
    }

    [Fact]
    public async Task GetBytesAsync_DownloadsWhenTheExpectedHashIsNotCached()
    {
        var handler = Serving(FontBytes);

        var bytes = await Fetcher(handler).GetBytesAsync(FontUrl, FontHash.Compute(FontBytes));

        Assert.Equal(FontBytes, bytes);
        Assert.Equal(1, handler.Requests);
    }

    [Fact]
    public async Task GetBytesAsync_ThrowsWhenTheFileIsLargerThanTheCap()
    {
        // The cap is the client's MaxResponseContentBufferSize, so the failure is the client's
        // own rather than a hand-rolled check.
        var fetcher = Fetcher(Serving(new byte[64]), maxBytes: 16);

        await Assert.ThrowsAsync<HttpRequestException>(() => fetcher.GetBytesAsync(FontUrl, null));
        Assert.False(Directory.Exists(_root) && Directory.EnumerateFiles(_root).Any());
    }

    [Fact]
    public async Task GetBytesAsync_ThrowsOnAServerError()
    {
        var fetcher = Fetcher(Serving([], HttpStatusCode.NotFound));

        await Assert.ThrowsAsync<HttpRequestException>(() => fetcher.GetBytesAsync(FontUrl, null));
    }

    [Fact]
    public async Task GetBytesAsync_WarnsWhenTheHashDiffersButStillServes()
    {
        var fetcher = Fetcher(Serving(FontBytes));
        var stale = "0123456789ABCDEF0123456789ABCDEF";

        var bytes = await fetcher.GetBytesAsync(FontUrl, stale);

        Assert.Equal(FontBytes, bytes);
        Assert.Contains(_logger.Entries, e => e.Level == LogLevel.Warning && e.Message.Contains("no longer matches"));

        // Cached under the bytes' real hash, never the stale one - the file name is the truth.
        Assert.True(File.Exists(Path.Combine(_root, $"{FontHash.Compute(FontBytes)}.bin")));
        Assert.False(File.Exists(Path.Combine(_root, $"{stale}.bin")));
    }

    [Fact]
    public async Task GetBytesAsync_LeavesNoTempFileBehind()
    {
        await Fetcher(Serving(FontBytes)).GetBytesAsync(FontUrl, null);

        Assert.Empty(Directory.EnumerateFiles(_root, "*.tmp"));
        Assert.Single(Directory.EnumerateFiles(_root));
    }

    [Fact]
    public async Task GetBytesAsync_IgnoresAHashThatIsNotOneOfOurs()
    {
        // A hash that is not 32 hex digits is never used as a file name, so a corrupt row cannot
        // read outside the cache folder.
        var handler = Serving(FontBytes);

        await Fetcher(handler).GetBytesAsync(FontUrl, "../../etc/passwd");

        Assert.Equal(1, handler.Requests);
    }

    [Fact]
    public async Task Evict_RemovesTheCachedFile()
    {
        var handler = Serving(FontBytes);
        var fetcher = Fetcher(handler);
        var hash = FontHash.Compute(await fetcher.GetBytesAsync(FontUrl, null));

        fetcher.Evict(hash);

        Assert.False(File.Exists(Path.Combine(_root, $"{hash}.bin")));

        await fetcher.GetBytesAsync(FontUrl, hash);
        Assert.Equal(2, handler.Requests);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("nope")]
    public void Evict_IgnoresAMissingOrMalformedHash(string? hash)
        => Fetcher(Serving(FontBytes)).Evict(hash);

    private sealed class StubHandler(Func<HttpRequestMessage, HttpResponseMessage> respond) : HttpMessageHandler
    {
        public int Requests { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Requests++;
            return Task.FromResult(respond(request));
        }
    }

    private sealed class StubClientFactory(HttpMessageHandler handler, long maxBytes) : IHttpClientFactory
    {
        public HttpClient CreateClient(string name) => new(handler, disposeHandler: false) { MaxResponseContentBufferSize = maxBytes };
    }

    private sealed class StubCacheRoot(string path) : IFontCacheRoot
    {
        public string Path { get; } = path;
    }

    private sealed class ListLogger<T> : ILogger<T>
    {
        public List<(LogLevel Level, string Message)> Entries { get; } = [];

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
            => Entries.Add((logLevel, formatter(state, exception)));
    }
}
