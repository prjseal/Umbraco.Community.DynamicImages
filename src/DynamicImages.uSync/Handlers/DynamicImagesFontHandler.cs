using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Strings;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Notifications;
using Umbraco.Community.DynamicImages.Core.Services;
using uSync.BackOffice.Configuration;
using uSync.BackOffice.Services;
using uSync.BackOffice.SyncHandlers;
using uSync.BackOffice.SyncHandlers.Interfaces;
using uSync.BackOffice.SyncHandlers.Models;
using uSync.Core;
using uSync.Extend;

namespace Umbraco.Community.DynamicImages.uSync.Handlers;

/// <summary>
/// Moves the rows of DynamicImages_Font in and out of <c>uSync/{version}/DynamicImagesFonts</c>.
/// <para>
/// Sorts before the template handler, because a text layer names its font by key and a template
/// whose font has not arrived yet fails validation on import.
/// </para>
/// <para>
/// uSync resolves handlers as singletons and <see cref="IFontService"/> is scoped, so the service
/// is taken from a scope per call rather than constructor-injected.
/// </para>
/// </summary>
[SyncHandler(
    DynamicImagesUSyncConstants.Handlers.FontAlias,
    DynamicImagesUSyncConstants.Handlers.FontName,
    DynamicImagesUSyncConstants.Handlers.FontFolder,
    DynamicImagesUSyncConstants.Priorities.Font,
    Icon = "icon-font",
    EntityType = DynamicImagesUSyncConstants.EntityTypes.Font,
    IsTwoPass = false)]
public class DynamicImagesFontHandler(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncHandlerRoot<FontDefinition, FontDefinition>> logger,
    AppCaches appCaches,
    IShortStringHelper shortStringHelper,
    ISyncFileService syncFileService,
    ISyncEventService syncEventService,
    ISyncConfigService syncConfigService,
    ISyncItemFactory syncItemFactory)
    : SyncObjectHandler<FontDefinition>(
        logger, appCaches, shortStringHelper, syncFileService, syncEventService, syncConfigService, syncItemFactory),
        ISyncHandler,
        INotificationAsyncHandler<DynamicImagesFontSavedNotification>,
        INotificationAsyncHandler<DynamicImagesFontDeletedNotification>
{
    protected override Task<IEnumerable<FontDefinition>> GetAllItems()
    {
        using var scope = scopeFactory.CreateScope();
        var fonts = scope.ServiceProvider.GetRequiredService<IFontService>().GetAll();

        return Task.FromResult<IEnumerable<FontDefinition>>(fonts);
    }

    protected override string GetItemName(FontDefinition item) => item.FamilyName;

    // The main package publishes concrete subclasses of Umbraco's abstract SavedNotification<T> /
    // DeletedNotification<T>, because the event aggregator dispatches on the published type.
    // These two forward to the base handler, which already does the ShouldProcessEvent check,
    // the export and the delete marker. It is an upcast, not a wrapper.
    public Task HandleAsync(DynamicImagesFontSavedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);

    public Task HandleAsync(DynamicImagesFontDeletedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);
}
