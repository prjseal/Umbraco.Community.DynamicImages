using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class HealthService(
    ITemplateRepository templateRepository,
    IFontRepository fontRepository,
    ITemplateValidator validator,
    ILegacyConfigImporter legacyImporter,
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

        return new HealthReport(
            options.CurrentValue.Enabled,
            legacyImporter.HasLegacyConfig,
            templates.Count,
            fonts.Count,
            issues);
    }
}
