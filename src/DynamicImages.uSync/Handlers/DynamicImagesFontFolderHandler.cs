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
/// Moves the rows of DynamicImages_FontFolder in and out of
/// <c>uSync/{version}/DynamicImagesFontFolders</c>.
/// <para>
/// Sorts first of this package's handlers, so a family's folder exists by the time the family is
/// imported. A family whose folder is still missing lands at the root rather than failing.
/// </para>
/// </summary>
[SyncHandler(
    DynamicImagesUSyncConstants.Handlers.FontFolderAlias,
    DynamicImagesUSyncConstants.Handlers.FontFolderName,
    DynamicImagesUSyncConstants.Handlers.FontFolderFolder,
    DynamicImagesUSyncConstants.Priorities.FontFolder,
    Icon = "icon-folder",
    EntityType = DynamicImagesUSyncConstants.EntityTypes.FontFolder,
    IsTwoPass = false)]
public class DynamicImagesFontFolderHandler(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncHandlerRoot<FontFolder, FontFolder>> logger,
    AppCaches appCaches,
    IShortStringHelper shortStringHelper,
    ISyncFileService syncFileService,
    ISyncEventService syncEventService,
    ISyncConfigService syncConfigService,
    ISyncItemFactory syncItemFactory)
    : SyncObjectHandler<FontFolder>(
        logger, appCaches, shortStringHelper, syncFileService, syncEventService, syncConfigService, syncItemFactory),
        ISyncHandler,
        INotificationAsyncHandler<DynamicImagesFontFolderSavedNotification>,
        INotificationAsyncHandler<DynamicImagesFontFolderDeletedNotification>
{
    protected override Task<IEnumerable<FontFolder>> GetAllItems()
    {
        using var scope = scopeFactory.CreateScope();
        var folders = scope.ServiceProvider.GetRequiredService<IFontFolderService>().GetAll();

        return Task.FromResult<IEnumerable<FontFolder>>(folders);
    }

    protected override string GetItemName(FontFolder item) => item.Name;

    // See DynamicImagesFontHandler: an upcast to the base handler, not a wrapper.
    public Task HandleAsync(DynamicImagesFontFolderSavedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);

    public Task HandleAsync(DynamicImagesFontFolderDeletedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);
}
