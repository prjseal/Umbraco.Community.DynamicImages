using Umbraco.Community.DynamicImages.Composing;
using Umbraco.Community.DynamicImages.Core.Services;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// Finding D - on a genuine first boot the v1 import ran before uSync had created the document
/// types, so the very first thing the log said about this package was that the document type its
/// template targets does not exist. It resolved itself, but an alarming first-run warning that
/// needs no action is worse than no warning.
/// <para>
/// The fix is ordering (an <c>UmbracoApplicationStarted</c> handler rather than a component),
/// which only a real boot can demonstrate. These cover the two decisions around it: which
/// warnings are worth deferring, and the flag that keeps the retry one-shot.
/// </para>
/// </summary>
public class LegacyImportDeferralTests
{
    private static ImportReport Report(params (string Message, string Code)[] warnings) =>
        new(
            Created: ["Article OG image"],
            Skipped: [],
            Warnings: [.. warnings.Select(w => w.Message)])
        {
            WarningCodes = [.. warnings.Select(w => w.Code)],
        };

    [Theory]
    [InlineData("DocTypeUnknown", true)]
    [InlineData("PropertyUnknown", true)]
    [InlineData("FontMissing", false)]
    [InlineData("OpacityInvalid", false)]
    [InlineData("", false)]
    public void Only_a_missing_document_type_or_property_is_worth_waiting_for(string code, bool expected)
        => Assert.Equal(expected, ImportReport.IsDeferrable(code));

    [Fact]
    public void A_report_whose_warnings_will_all_resolve_is_deferrable()
    {
        // The exact first-boot case.
        var report = Report(("Article OG image: There is no document type with the alias 'article'.", "DocTypeUnknown"));

        Assert.True(report.WarningsAreAllDeferrable);
    }

    [Fact]
    public void One_real_warning_makes_the_whole_report_worth_reporting_now()
    {
        // Mixed: deferring the lot would hide the font problem, which will never fix itself.
        var report = Report(
            ("Article OG image: There is no document type with the alias 'article'.", "DocTypeUnknown"),
            ("Article OG image: the font is missing.", "FontMissing"));

        Assert.False(report.WarningsAreAllDeferrable);
    }

    [Fact]
    public void A_clean_report_is_not_deferrable_because_there_is_nothing_to_defer()
    {
        Assert.False(Report().WarningsAreAllDeferrable);
    }

    [Fact]
    public void A_report_with_no_codes_is_not_deferrable()
    {
        // Codes are how a warning is known to be the kind that resolves itself. Without them the
        // safe answer is to report the warning rather than quietly swallow it.
        var report = new ImportReport(["Article OG image"], [], ["something went wrong"]);

        Assert.False(report.WarningsAreAllDeferrable);
    }

    [Fact]
    public void The_retry_starts_disarmed()
    {
        var state = new LegacyImportRetryState();

        Assert.False(state.IsPending);
        Assert.False(state.TryClaim());
    }

    [Fact]
    public void Exactly_one_claim_wins()
    {
        // A uSync run saves 192 items, so ContentTypeSaved can arrive many times over. Only one
        // of them may start a re-check.
        var state = new LegacyImportRetryState();
        state.Arm();

        Assert.True(state.TryClaim());
        Assert.False(state.TryClaim());
        Assert.False(state.IsPending);
    }

    [Fact]
    public void Rearming_puts_the_claim_back()
    {
        var state = new LegacyImportRetryState();
        state.Arm();
        state.TryClaim();

        state.Rearm();

        Assert.True(state.IsPending);
        Assert.True(state.TryClaim());
    }

    [Fact]
    public void Concurrent_claims_produce_exactly_one_winner()
    {
        var state = new LegacyImportRetryState();
        state.Arm();

        var wins = 0;
        Parallel.For(0, 200, _ =>
        {
            if (state.TryClaim()) Interlocked.Increment(ref wins);
        });

        Assert.Equal(1, wins);
    }
}
