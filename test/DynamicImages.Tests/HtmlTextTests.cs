using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class HtmlTextTests
{
    [Fact]
    public void ToPlainText_RemovesTags()
        => Assert.Equal("Hello world", HtmlText.ToPlainText("<p>Hello <strong>world</strong></p>"));

    [Fact]
    public void ToPlainText_DecodesEntities()
        => Assert.Equal("Fish & chips", HtmlText.ToPlainText("<p>Fish &amp; chips</p>"));

    [Fact]
    public void ToPlainText_TurnsBlockBoundariesIntoLineBreaks()
    {
        // Without this, two paragraphs would run into one another as "onetwo".
        var text = HtmlText.ToPlainText("<p>one</p><p>two</p>");

        Assert.Contains("one", text);
        Assert.Contains("two", text);
        Assert.DoesNotContain("onetwo", text);
    }

    [Fact]
    public void ToPlainText_IsEmptyForEmptyInput()
        => Assert.Equal(string.Empty, HtmlText.ToPlainText(null));

    [Theory]
    [InlineData("<p>markup</p>", true)]
    [InlineData("plain text", false)]
    [InlineData("", false)]
    public void LooksLikeHtml_TellsMarkupFromPlainText(string value, bool expected)
        => Assert.Equal(expected, HtmlText.LooksLikeHtml(value));
}
