using Umbraco.Community.DynamicImages.Core.Fonts.Remote;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class WebFontProvidersTests
{
    [Theory]
    [InlineData("Inter", 400, false, "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400")]
    [InlineData("Open Sans", 700, true, "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@1,700")]
    [InlineData("  Bricolage Grotesque ", 800, false, "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:ital,wght@0,800")]
    public void Google_AsksForOneVariantPerRequest(string family, int weight, bool italic, string expected)
        => Assert.Equal(expected, WebFontProviders.Google.CssUrl!(family, weight, italic).ToString());

    [Theory]
    [InlineData("Inter", 400, false, "https://fonts.bunny.net/css?family=inter:400")]
    [InlineData("Open Sans", 700, true, "https://fonts.bunny.net/css?family=open-sans:700i")]
    public void Bunny_UsesTheSlugAndAnItalicSuffix(string family, int weight, bool italic, string expected)
        => Assert.Equal(expected, WebFontProviders.Bunny.CssUrl!(family, weight, italic).ToString());

    [Theory]
    [InlineData("Open Sans", "open-sans")]
    [InlineData("Inter", "inter")]
    [InlineData("  Hanken  Grotesk ", "hanken-grotesk")]
    [InlineData("IBM Plex Sans", "ibm-plex-sans")]
    [InlineData("Press Start 2P", "press-start-2p")]
    public void BunnySlug_LowercasesAndHyphenates(string family, string expected)
        => Assert.Equal(expected, WebFontProviders.BunnySlug(family));

    [Fact]
    public void Direct_HasNoCssApi()
    {
        Assert.Null(WebFontProviders.Direct.CssUrl);
        Assert.Null(WebFontProviders.Direct.FileHost);
    }

    [Theory]
    [InlineData("google")]
    [InlineData("Google")]
    [InlineData(" bunny ")]
    [InlineData("direct")]
    public void Get_FindsAProviderCaseInsensitively(string name)
        => Assert.NotNull(WebFontProviders.Get(name));

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("url")]
    [InlineData("adobe")]
    public void Get_ReturnsNullForAnythingElse(string? name)
        => Assert.Null(WebFontProviders.Get(name));

    [Theory]
    [InlineData("https://fonts.gstatic.com/s/inter/v20/abc.ttf", true)]
    [InlineData("https://FONTS.GSTATIC.COM/s/inter/v20/abc.ttf", true)]
    [InlineData("http://fonts.gstatic.com/s/inter/v20/abc.ttf", false)]
    [InlineData("https://fonts.bunny.net/inter/files/inter-latin-700.woff2", false)]
    [InlineData("https://evil.example.com/fonts.gstatic.com/abc.ttf", false)]
    public void Google_OnlyServesFilesFromItsOwnHost(string url, bool allowed)
        => Assert.Equal(allowed, WebFontProviders.Google.AllowsFileUrl(new Uri(url)));

    [Theory]
    [InlineData("https://fonts.bunny.net/inter/files/inter-latin-700.woff2", true)]
    [InlineData("https://fonts.gstatic.com/s/inter/v20/abc.ttf", false)]
    public void Bunny_OnlyServesFilesFromItsOwnHost(string url, bool allowed)
        => Assert.Equal(allowed, WebFontProviders.Bunny.AllowsFileUrl(new Uri(url)));

    [Theory]
    [InlineData("https://cdn.example.com/fonts/Inter-Bold.ttf", true)]
    [InlineData("http://cdn.example.com/fonts/Inter-Bold.ttf", false)]
    public void Direct_AllowsAnyHttpsHost(string url, bool allowed)
        => Assert.Equal(allowed, WebFontProviders.Direct.AllowsFileUrl(new Uri(url)));

    [Theory]
    [InlineData("https://cdn.example.com/fonts/Inter-Bold.ttf")]
    [InlineData("  https://cdn.example.com/fonts/Inter%20Bold.woff2?v=3  ")]
    [InlineData("https://fonts.gstatic.com/s/inter/v20/abc.ttf")]
    public void ValidateDirectUrl_AcceptsAPublicHttpsUrl(string url)
    {
        Assert.Null(WebFontProviders.ValidateDirectUrl(url, out var uri));
        Assert.NotNull(uri);
        Assert.Equal(Uri.UriSchemeHttps, uri.Scheme);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("not a url")]
    [InlineData("http://cdn.example.com/Inter.ttf")]
    [InlineData("ftp://cdn.example.com/Inter.ttf")]
    [InlineData("file:///etc/passwd")]
    [InlineData("https://user:secret@cdn.example.com/Inter.ttf")]
    [InlineData("https://localhost/Inter.ttf")]
    [InlineData("https://intranet/Inter.ttf")]
    [InlineData("https://10.0.0.1/Inter.ttf")]
    [InlineData("https://127.0.0.1/Inter.ttf")]
    [InlineData("https://[::1]/Inter.ttf")]
    public void ValidateDirectUrl_RejectsAnythingThatIsNotAPublicHttpsUrl(string? url)
    {
        // A template is editable by anyone with section access, so a font URL must not be able to
        // reach the server's own network or carry credentials.
        var error = WebFontProviders.ValidateDirectUrl(url, out var uri);

        Assert.NotNull(error);
        Assert.Null(uri);
    }

    [Fact]
    public void ValidateDirectUrl_RejectsAUrlLongerThanTheColumn()
    {
        var url = "https://cdn.example.com/" + new string('a', WebFontProviders.MaxUrlLength);

        Assert.NotNull(WebFontProviders.ValidateDirectUrl(url, out _));
    }
}
