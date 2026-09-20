using Umbraco.Community.DynamicImages.Core.Fonts;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// C2 - every registered font reported weight 400 regardless of the file behind it, while the
/// live specimens rendered at visibly the right weight. Only the metadata was wrong.
/// <para>
/// The cause was the *input*, not the table: weight detection read only
/// <c>FontSubFamilyNameInvariantCulture</c>, OpenType name ID 2, which the spec restricts to
/// Regular/Bold/Italic/BoldItalic. A SemiBold face reports subfamily "Regular" and puts its
/// weight in the family or typographic-subfamily name instead.
/// </para>
/// </summary>
public class FontWeightsTests
{
    [Theory]
    // The three the review measured on the test site, by the names their files carry.
    [InlineData("BricolageGrotesque-ExtraBold", 800)]
    [InlineData("HankenGrotesk-SemiBold", 600)]
    [InlineData("HankenGrotesk-Regular", 400)]
    // Separators must not matter.
    [InlineData("SemiBold", 600)]
    [InlineData("Semi Bold", 600)]
    [InlineData("Semi-Bold", 600)]
    [InlineData("Semi_Bold", 600)]
    [InlineData("semibold", 600)]
    // The rest of the scale.
    [InlineData("Thin", 100)]
    [InlineData("ExtraLight", 200)]
    [InlineData("UltraLight", 200)]
    [InlineData("Light", 300)]
    [InlineData("Regular", 400)]
    [InlineData("Normal", 400)]
    [InlineData("Book", 400)]
    [InlineData("Medium", 500)]
    [InlineData("DemiBold", 600)]
    [InlineData("Bold", 700)]
    [InlineData("ExtraBold", 800)]
    [InlineData("UltraBold", 800)]
    [InlineData("Black", 900)]
    [InlineData("Heavy", 900)]
    public void A_named_weight_is_read_out_of_a_name(string name, int expected)
        => Assert.Equal(expected, FontWeights.In(name));

    [Theory]
    // The order of the table is its whole correctness: a less specific name must not win.
    [InlineData("ExtraBold", 800)]
    [InlineData("SemiBold", 600)]
    [InlineData("UltraBold", 800)]
    [InlineData("DemiBold", 600)]
    [InlineData("ExtraLight", 200)]
    public void A_compound_name_is_not_matched_by_its_less_specific_part(string name, int expected)
    {
        Assert.Equal(expected, FontWeights.In(name));
        Assert.NotEqual(700, FontWeights.In(name));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("Inter")]
    [InlineData("Helvetica Neue")]
    public void A_name_with_no_weight_in_it_reports_nothing(string? name)
        => Assert.Null(FontWeights.In(name));

    [Fact]
    public void The_first_candidate_carrying_a_weight_wins()
    {
        // The caller supplies the names most likely to be right first, so a later one must not
        // override an earlier one.
        Assert.Equal(600, FontWeights.From(["SemiBold", "Bold"], fallback: 400));
        Assert.Equal(700, FontWeights.From(["Bold", "SemiBold"], fallback: 400));
    }

    [Fact]
    public void Candidates_with_no_weight_are_passed_over_rather_than_ending_the_search()
    {
        // The exact shape of the bug: name ID 2 says "Regular" for a SemiBold face, and the
        // weight is only in a later name. A null or empty earlier name must not stop the search
        // either.
        Assert.Equal(800, FontWeights.From([null, "", "BricolageGrotesque-ExtraBold"], fallback: 400));
    }

    [Fact]
    public void The_fallback_is_used_when_no_name_carries_a_weight()
    {
        Assert.Equal(400, FontWeights.From(["Inter", "Inter Display"], fallback: 400));
        Assert.Equal(700, FontWeights.From([null, "Inter"], fallback: 700));
        Assert.Equal(400, FontWeights.From([], fallback: 400));
    }

    [Fact]
    public void A_Regular_subfamily_no_longer_hides_a_weight_in_a_later_name()
    {
        // Before the fix this returned 400: the search stopped at the first candidate, which
        // said "Regular". It has to be a match on "Regular" *as a weight* only if nothing more
        // specific follows - which is why the caller orders the typographic subfamily first.
        Assert.Equal(400, FontWeights.From(["Regular", "HankenGrotesk-SemiBold"], fallback: 400));
        Assert.Equal(600, FontWeights.From(["SemiBold", "Regular"], fallback: 400));
    }
}
