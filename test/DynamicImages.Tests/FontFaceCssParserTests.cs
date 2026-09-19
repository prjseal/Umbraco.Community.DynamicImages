using Umbraco.Community.DynamicImages.Core.Fonts.Remote;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The fixtures are what the two CSS APIs returned to a non-browser User-Agent on 2026-09-19:
/// Google sends one block with one full TTF, Bunny sends one block per unicode subset.
/// </summary>
public class FontFaceCssParserTests
{
    private const string GoogleCss = """
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          src: url(https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf) format('truetype');
        }
        """;

    private const string BunnyCss = """
        /* greek */
        @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-weight: 700;
          font-stretch: 100%;
          src: url(https://fonts.bunny.net/inter/files/inter-greek-700-italic.woff2) format('woff2'), url(https://fonts.bunny.net/inter/files/inter-greek-700-italic.woff) format('woff'); 
          unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;
        }

        /* latin */
        @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-weight: 700;
          font-stretch: 100%;
          src: url(https://fonts.bunny.net/inter/files/inter-latin-700-italic.woff2) format('woff2'), url(https://fonts.bunny.net/inter/files/inter-latin-700-italic.woff) format('woff'); 
          unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
        }

        /* cyrillic */
        @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-weight: 700;
          font-stretch: 100%;
          src: url(https://fonts.bunny.net/inter/files/inter-cyrillic-700-italic.woff2) format('woff2'), url(https://fonts.bunny.net/inter/files/inter-cyrillic-700-italic.woff) format('woff'); 
          unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
        }
        """;

    private const string BunnyErrorCss = """
        /*
            Error: API Error 
            Details: Please specify a valid icon font on the 'family' parameter. 
        */
        """;

    [Fact]
    public void Parse_ReadsGoogleSingleBlock()
    {
        var css = FontFaceCssParser.Parse(GoogleCss);

        Assert.Null(css.Error);
        var block = Assert.Single(css.Blocks);

        Assert.Equal("normal", block.FontStyle);
        Assert.Equal("700", block.FontWeight);
        Assert.Null(block.UnicodeRange);
        Assert.True(block.CoversLatin);

        var source = Assert.Single(block.Sources);
        Assert.Equal("https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf", source.Url);
        Assert.Equal("truetype", source.Format);
    }

    [Fact]
    public void Parse_ReadsEveryBunnySubsetBlock()
    {
        var css = FontFaceCssParser.Parse(BunnyCss);

        Assert.Null(css.Error);
        Assert.Equal(3, css.Blocks.Count);

        var latin = Assert.Single(css.Blocks, b => b.CoversLatin);
        Assert.Equal("italic", latin.FontStyle);
        Assert.Equal(2, latin.Sources.Count);
        Assert.Equal(("https://fonts.bunny.net/inter/files/inter-latin-700-italic.woff2", "woff2"), (latin.Sources[0].Url, latin.Sources[0].Format));
        Assert.Equal(("https://fonts.bunny.net/inter/files/inter-latin-700-italic.woff", "woff"), (latin.Sources[1].Url, latin.Sources[1].Format));
    }

    [Fact]
    public void Parse_SurfacesBunnysErrorComment()
    {
        // Bunny answers an unknown family with HTTP 200 and a comment, so the comment is the only
        // thing the editor can be told.
        var css = FontFaceCssParser.Parse(BunnyErrorCss);

        Assert.Empty(css.Blocks);
        Assert.Equal("Please specify a valid icon font on the 'family' parameter.", css.Error);
    }

    [Fact]
    public void Parse_ReadsAnErrorCommentWithoutADetailsLine()
    {
        var css = FontFaceCssParser.Parse("/* Error: something went wrong */");

        Assert.Equal("something went wrong", css.Error);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("/* latin */")]
    [InlineData("body { color: red; }")]
    public void Parse_TreatsAnythingWithoutBlocksOrAnErrorAsEmpty(string? css)
    {
        var parsed = FontFaceCssParser.Parse(css);

        Assert.Empty(parsed.Blocks);
        Assert.Null(parsed.Error);
    }

    [Fact]
    public void Parse_AcceptsQuotedUrlsAndFormats()
    {
        var css = FontFaceCssParser.Parse("""
            @font-face { font-weight: 400; src: url("https://cdn.example.com/a,b.woff2") format("woff2"), url('https://cdn.example.com/a.ttf') format('truetype'); }
            """);

        var block = Assert.Single(css.Blocks);
        Assert.Equal(["https://cdn.example.com/a,b.woff2", "https://cdn.example.com/a.ttf"], block.Sources.Select(s => s.Url));
        Assert.Equal(["woff2", "truetype"], block.Sources.Select(s => s.Format));
    }

    [Fact]
    public void Parse_KeepsASourceWithoutAFormat()
    {
        var css = FontFaceCssParser.Parse("@font-face { src: url(https://cdn.example.com/a.ttf); }");

        var source = Assert.Single(Assert.Single(css.Blocks).Sources);
        Assert.Null(source.Format);
    }

    [Theory]
    [InlineData("U+0000-00FF", true)]
    [InlineData("U+0000-00FF,U+0131", true)]
    [InlineData("U+0370-0377,U+0000-00FF", true)]
    [InlineData("U+0000-007F", false)]
    [InlineData("U+0370-0377", false)]
    [InlineData("U+0???", true)]
    [InlineData("U+00??", true)]
    [InlineData("U+0041", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    public void RangeCovers_RequiresOneRangeToSpanTheWholeLatinBlock(string? range, bool expected)
        => Assert.Equal(expected, FontFaceCssParser.RangeCovers(range, 0x0000, 0x00FF));

    [Fact]
    public void RangeCovers_ReadsASingleCodePoint()
        => Assert.True(FontFaceCssParser.RangeCovers("U+0041", 0x41, 0x41));
}
