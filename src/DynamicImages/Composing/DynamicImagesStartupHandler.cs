using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Sync;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Composing;

/// <summary>
/// Brings a v1 configuration across on first start, and applies file sync in Import mode.
/// <para>
/// This was an <c>IAsyncComponent</c>. Components initialise before the rest of the boot
/// sequence, and on a genuine first boot that put the v1 import ahead of uSync creating the
/// document types - so the very first thing the log said about this package was that the
/// document type its template targets does not exist:
/// </para>
/// <code>
/// Dynamic Images: imported 1 template(s) from the v1 configuration (0 skipped, 1 warning(s))
/// Dynamic Images: Article OG image: There is no document type with the alias 'article'.
/// </code>
/// <para>
/// It resolved itself - the template stores the alias, so the binding came good once uSync
/// created the type - but an alarming first-run warning that needs no action is worse than no
/// warning at all. Running from <see cref="UmbracoApplicationStartedNotification"/> instead puts
/// this after every component has initialised, and
/// <see cref="LegacyImportRetryHandler"/> covers the case where the type still is not there.
/// </para>
/// </summary>
public class DynamicImagesStartupHandler(
    IServiceScopeFactory scopeFactory,
    IServerRoleAccessor serverRoleAccessor,
    IOptionsMonitor<DynamicImagesOptions> options,
    LegacyImportRetryState retryState,
    ILogger<DynamicImagesStartupHandler> logger) : INotificationAsyncHandler<UmbracoApplicationStartedNotification>
{
    public async Task HandleAsync(UmbracoApplicationStartedNotification notification, CancellationToken cancellationToken)
    {
        // Subscribers never do this work: on a load-balanced Cloud install every instance would
        // otherwise race to import the same templates. Unknown is allowed through deliberately -
        // on a single-server install the role has not been resolved yet this early, and skipping
        // it there would mean the import never runs at all.
        if (serverRoleAccessor.CurrentServerRole is ServerRole.Subscriber) return;

        try
        {
            using var scope = scopeFactory.CreateScope();

            await ImportLegacyConfigIfNeededAsync(scope.ServiceProvider, cancellationToken);
            await ImportSyncedFilesAsync(scope.ServiceProvider, cancellationToken);
        }
        catch (Exception ex)
        {
            // Startup work must never take the site down with it.
            logger.LogError(ex, "Dynamic Images: start-up import failed");
        }
    }

    private async Task ImportLegacyConfigIfNeededAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        if (!options.CurrentValue.AutoImportLegacyConfig) return;

        var importer = services.GetRequiredService<ILegacyConfigImporter>();
        if (!importer.HasLegacyConfig) return;

        // Only into an empty table: once there is anything in the backoffice, configuration is no
        // longer the source of truth and re-importing would duplicate. This is also what makes
        // the retry below safe to run as often as it likes.
        if (services.GetRequiredService<ITemplateRepository>().Count() > 0) return;

        var report = await importer.ImportFromConfigurationAsync(userKey: null, cancellationToken);

        logger.LogInformation(
            "Dynamic Images: imported {Created} template(s) from the v1 configuration ({Skipped} skipped, {Warnings} warning(s))",
            report.Created.Count, report.Skipped.Count, report.Warnings.Count);

        LogWarnings(report);
    }

    /// <summary>
    /// A warning naming a document type or property that does not exist yet is not the same kind
    /// of thing as a warning about a missing font file: on a first boot the content types may
    /// simply not have been imported yet. Those are reported at Information and re-checked;
    /// everything else stays a warning.
    /// </summary>
    private void LogWarnings(ImportReport report)
    {
        if (report.WarningsAreAllDeferrable)
        {
            foreach (var warning in report.Warnings)
            {
                logger.LogInformation(
                    "Dynamic Images: {Warning} This is expected on a first boot - the content types may not have been " +
                    "imported yet - and will be re-checked when one is saved.",
                    warning);
            }

            retryState.Arm();
            return;
        }

        foreach (var warning in report.Warnings) logger.LogWarning("Dynamic Images: {Warning}", warning);
    }

    private async Task ImportSyncedFilesAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        if (options.CurrentValue.Sync.Mode != SyncMode.Import) return;

        var result = await services.GetRequiredService<ISyncService>().ImportAsync(userKey: null, cancellationToken);

        logger.LogInformation("Dynamic Images: imported {Imported} template(s) from disk", result.Imported);
        foreach (var message in result.Messages) logger.LogWarning("Dynamic Images: {Message}", message);
    }
}
