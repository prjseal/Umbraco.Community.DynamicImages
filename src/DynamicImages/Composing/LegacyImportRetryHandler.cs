using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Sync;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Composing;

/// <summary>
/// The second half of finding D. When the v1 import runs before the document types exist, this
/// re-runs it the first time a content type is saved and reports the outcome once.
/// <para>
/// Two things make this safe to leave registered permanently. It does nothing at all unless
/// <see cref="LegacyImportRetryState"/> was armed, which only a first boot that raced the content
/// types does. And the importer's own "only into an empty table" guard means a re-run cannot
/// duplicate anything: once the first import created a template the re-run is a no-op, so what
/// this really re-checks is whether the warnings still stand.
/// </para>
/// </summary>
public class LegacyImportRetryHandler(
    IServiceScopeFactory scopeFactory,
    IServerRoleAccessor serverRoleAccessor,
    LegacyImportRetryState retryState,
    ILogger<LegacyImportRetryHandler> logger) : INotificationAsyncHandler<ContentTypeSavedNotification>
{
    public async Task HandleAsync(ContentTypeSavedNotification notification, CancellationToken cancellationToken)
    {
        if (!retryState.IsPending) return;
        if (serverRoleAccessor.CurrentServerRole is ServerRole.Subscriber) return;

        // Exactly one caller wins, so a uSync run saving 192 items cannot start 192 re-checks.
        if (!retryState.TryClaim()) return;

        try
        {
            using var scope = scopeFactory.CreateScope();
            var services = scope.ServiceProvider;

            var importer = services.GetRequiredService<ILegacyConfigImporter>();
            if (!importer.HasLegacyConfig) return;

            var templates = services.GetRequiredService<ITemplateRepository>();
            var validator = services.GetRequiredService<ITemplateValidator>();

            // An empty table means the first import did not create anything, so this is a real
            // retry rather than a re-check.
            if (templates.Count() == 0)
            {
                var report = await importer.ImportFromConfigurationAsync(userKey: null, cancellationToken);

                logger.LogInformation(
                    "Dynamic Images: imported {Created} template(s) from the v1 configuration on retry ({Warnings} warning(s))",
                    report.Created.Count, report.Warnings.Count);

                if (report.WarningsAreAllDeferrable)
                {
                    retryState.Rearm();
                    return;
                }

                foreach (var warning in report.Warnings) logger.LogWarning("Dynamic Images: {Warning}", warning);
                return;
            }

            await ReportSurvivingWarningsAsync(templates, validator, cancellationToken);
        }
        catch (Exception ex)
        {
            // Never let this break a content type save.
            logger.LogError(ex, "Dynamic Images: re-checking the v1 import failed");
        }
    }

    /// <summary>
    /// Re-validates what the import created. Warnings that have cleared are simply not mentioned -
    /// the expected outcome, and the point of deferring them. Ones that survive are now worth
    /// saying properly, because the content types have been created and they still do not resolve.
    /// </summary>
    private async Task ReportSurvivingWarningsAsync(
        ITemplateRepository templates, ITemplateValidator validator, CancellationToken cancellationToken)
    {
        var surviving = new List<string>();

        foreach (var template in templates.GetAll())
        {
            var validation = await validator.ValidateAsync(template, cancellationToken);

            surviving.AddRange(validation.Issues
                .Where(issue => ImportReport.IsDeferrable(issue.Code))
                .Select(issue => $"{template.Name}: {issue.Message}"));
        }

        if (surviving.Count == 0)
        {
            logger.LogInformation("Dynamic Images: the v1 import's document type bindings have resolved.");
            return;
        }

        // Still armed: another content type may yet be the one this is waiting for.
        retryState.Rearm();

        foreach (var warning in surviving) logger.LogWarning("Dynamic Images: {Warning}", warning);
    }
}
