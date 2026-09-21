using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Fonts.Remote;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class HealthService(
    ITemplateRepository templateRepository,
    IFontRepository fontRepository,
    ITemplateValidator validator,
    IFontFileProvider fontFiles,
    IRemoteFontFetcher remoteFonts,
    IOptionsMonitor<DynamicImagesOptions> options) : IHealthService
{
    public async Task<HealthReport> CheckAsync(CancellationToken cancellationToken = default)
    {
        var templates = templateRepository.GetAll();
        var fonts = fontRepository.GetAll();
        var issues = new List<HealthIssue>();

        foreach (var template in templates)
        {
            cancellationToken.ThrowIfCancellationRequested();

            // The health report is the same validation the designer runs, gathered across every
            // template - so a rule only ever has to be written once.
            var validation = await validator.ValidateAsync(template, cancellationToken);

            issues.AddRange(validation.Issues.Select(issue => new HealthIssue(
                issue.Severity == ValidationSeverity.Error ? "error" : "warning",
                issue.Code,
                issue.Message,
                template.Key,
                template.Name,
                issue.LayerKey)));
        }

        if (templates.Count == 0)
        {
            issues.Add(new HealthIssue("info", "NoTemplates", "No templates have been created yet."));
        }

        if (fonts.Count == 0)
        {
            issues.Add(new HealthIssue("warning", "NoFonts",
                "No fonts are registered, so text layers cannot render."));
        }

        // Health runs on demand from the dashboard, so a network call is acceptable here where
        // it is not in the validator. A font already in this server's cache costs no network.
        foreach (var font in fonts.Where(f => f.SourceKind == ImageSourceKind.Url))
        {
            cancellationToken.ThrowIfCancellationRequested();

            await using var stream = await fontFiles.OpenAsync(font, cancellationToken);
            if (stream is not null) continue;

            var provider = WebFontProviders.Get(font.Provider)?.DisplayName ?? "web";
            var description = $"The {provider} font '{font.FamilyName}' (weight {font.Weight}{(font.IsItalic ? ", italic" : string.Empty)})";

            // A url font opens as null for two quite different reasons, and telling them apart is
            // worth a second fetch on a check an editor asked for: the file is unreachable, or it
            // is reachable and no longer the file this font was registered as. The second is the
            // one with an action attached, so it gets its own code and its own wording.
            issues.Add(await HasChangedAsync(font, cancellationToken)
                ? new HealthIssue("warning", "FontChanged",
                    $"{description} has changed since it was registered, so it is not being used. Refresh the font to accept the new file.")
                : new HealthIssue("warning", "FontUnreachable",
                    $"{description} could not be fetched from {font.SourceUrl}. Text layers using it will not render until it can be."));
        }

        return new HealthReport(
            options.CurrentValue.Enabled,
            templates.Count,
            fonts.Count,
            issues);
    }

    /// <summary>
    /// Whether the file is reachable but no longer matches the hash the font was registered with.
    /// Fetched with no expected hash, which is the one mode that does not refuse a changed file.
    /// </summary>
    private async Task<bool> HasChangedAsync(FontDefinition font, CancellationToken cancellationToken)
    {
        if (!FontHash.IsValid(font.ContentHash)) return false;
        if (!Uri.TryCreate(font.SourceUrl, UriKind.Absolute, out var url)) return false;

        try
        {
            var bytes = await remoteFonts.GetBytesAsync(url, font.Provider, expectedHash: null, cancellationToken);

            return bytes is not null
                && !string.Equals(FontHash.Compute(bytes), font.ContentHash, StringComparison.OrdinalIgnoreCase);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            // It could not be fetched at all, which is the other message.
            return false;
        }
    }
}
