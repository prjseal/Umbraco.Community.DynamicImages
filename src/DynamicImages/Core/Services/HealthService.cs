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
    ILegacyConfigImporter legacyImporter,
    IFontFileProvider fontFiles,
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

        if (legacyImporter.HasLegacyConfig && templates.Count == 0)
        {
            issues.Add(new HealthIssue("warning", "LegacyConfigNotImported",
                "There is still a v1 DynamicImages block in configuration that has not been imported."));
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
            issues.Add(new HealthIssue("warning", "FontUnreachable",
                $"The {provider} font '{font.FamilyName}' (weight {font.Weight}{(font.IsItalic ? ", italic" : string.Empty)}) could not be fetched from {font.SourceUrl}. Text layers using it will not render until it can be."));
        }

        return new HealthReport(
            options.CurrentValue.Enabled,
            legacyImporter.HasLegacyConfig,
            templates.Count,
            fonts.Count,
            issues);
    }
}
