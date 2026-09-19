using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Sync;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Composing;

/// <summary>
/// Runs once the migrations have created the tables: brings a v1 configuration across on first
/// start, and applies file sync in Import mode.
/// </summary>
public class DynamicImagesStartupComponent(
    IServiceScopeFactory scopeFactory,
    IServerRoleAccessor serverRoleAccessor,
    IOptionsMonitor<DynamicImagesOptions> options,
    ILogger<DynamicImagesStartupComponent> logger) : IAsyncComponent
{
    public async Task InitializeAsync(bool isRestarting, CancellationToken cancellationToken)
    {
        // Subscribers never do this work: on a load-balanced Cloud install every instance would
        // otherwise race to import the same templates. Unknown is allowed through deliberately -
        // on a single-server install the role has not been resolved yet when components
        // initialise, and skipping it there would mean the import never runs at all.
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

    public Task TerminateAsync(bool isRestarting, CancellationToken cancellationToken) => Task.CompletedTask;

    private async Task ImportLegacyConfigIfNeededAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        if (!options.CurrentValue.AutoImportLegacyConfig) return;

        var importer = services.GetRequiredService<ILegacyConfigImporter>();
        if (!importer.HasLegacyConfig) return;

        // Only into an empty table: once there is anything in the backoffice, configuration is no
        // longer the source of truth and re-importing would duplicate.
        if (services.GetRequiredService<ITemplateRepository>().Count() > 0) return;

        var report = await importer.ImportFromConfigurationAsync(userKey: null, cancellationToken);

        logger.LogInformation(
            "Dynamic Images: imported {Created} template(s) from the v1 configuration ({Skipped} skipped, {Warnings} warning(s))",
            report.Created.Count, report.Skipped.Count, report.Warnings.Count);

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
