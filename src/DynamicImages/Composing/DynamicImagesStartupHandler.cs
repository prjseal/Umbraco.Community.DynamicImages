using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Sync;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Composing;

/// <summary>
/// Applies file sync in Import mode on start-up. Runs from
/// <see cref="UmbracoApplicationStartedNotification"/> rather than as a component so that it
/// happens after every component has initialised, and after uSync has created the document types
/// the imported templates target.
/// </summary>
public class DynamicImagesStartupHandler(
    IServiceScopeFactory scopeFactory,
    IServerRoleAccessor serverRoleAccessor,
    IOptionsMonitor<DynamicImagesOptions> options,
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

            await ImportSyncedFilesAsync(scope.ServiceProvider, cancellationToken);
        }
        catch (Exception ex)
        {
            // Startup work must never take the site down with it.
            logger.LogError(ex, "Dynamic Images: start-up import failed");
        }
    }

    private async Task ImportSyncedFilesAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        if (options.CurrentValue.Sync.Mode != SyncMode.Import) return;

        var result = await services.GetRequiredService<ISyncService>().ImportAsync(userKey: null, cancellationToken);

        logger.LogInformation("Dynamic Images: imported {Imported} template(s) from disk", result.Imported);
        foreach (var message in result.Messages) logger.LogWarning("Dynamic Images: {Message}", message);
    }
}
