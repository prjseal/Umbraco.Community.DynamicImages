using Umbraco.Community.DynamicImages.Core.Media;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class MediaSourceTests
{
    private static readonly Guid MediaKey = new("2f1d2c3b-4a59-4e7d-9b8f-0c1d2e3f4a5b");

    [Fact]
    public void ResolveMediaKey_ReadsMediaPicker3Json()
        => Assert.Equal(MediaKey, MediaSource.ResolveMediaKey($$"""[{"key":"{{Guid.NewGuid()}}","mediaKey":"{{MediaKey}}"}]"""));

    [Fact]
    public void ResolveMediaKey_ReadsASingleObject()
        => Assert.Equal(MediaKey, MediaSource.ResolveMediaKey($$"""{"mediaKey":"{{MediaKey}}"}"""));

    [Fact]
    public void ResolveMediaKey_ReadsALegacyUdi()
        => Assert.Equal(MediaKey, MediaSource.ResolveMediaKey($"umb://media/{MediaKey:N}"));

    [Fact]
    public void ResolveMediaKey_ReadsABareGuid()
        => Assert.Equal(MediaKey, MediaSource.ResolveMediaKey(MediaKey.ToString()));

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("[]")]
    [InlineData("not json")]
    [InlineData("{ broken")]
    public void ResolveMediaKey_TreatsAnythingElseAsAbsentRatherThanThrowing(string? value)
        => Assert.Null(MediaSource.ResolveMediaKey(value));

    [Fact]
    public void ResolvePath_ReadsAnUploadFieldsJson()
        => Assert.Equal("/media/abc/og.png", MediaSource.ResolvePath("""{"src":"/media/abc/og.png"}"""));

    [Fact]
    public void ResolvePath_PassesABarePathStraightThrough()
        => Assert.Equal("/media/abc/og.png", MediaSource.ResolvePath("/media/abc/og.png"));

    [Fact]
    public void ToMediaPickerValue_RoundTrips()
    {
        var value = MediaSource.ToMediaPickerValue(MediaKey);

        Assert.Equal(MediaKey, MediaSource.ResolveMediaKey(value));
    }
}
