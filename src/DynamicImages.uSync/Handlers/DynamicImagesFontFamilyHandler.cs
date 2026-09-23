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
/// Moves the rows of DynamicImages_FontFamily in and out of
/// <c>uSync/{version}/DynamicImagesFontFamilies</c>.
/// <para>
/// Sorts after font folders and before fonts, so a family's folder exists before the family, and
/// the family before its variants. A font whose family is still missing - or an export from before
/// families, which names none - joins the family of its name.
/// </para>
/// </summary>
[SyncHandler(
    DynamicImagesUSyncConstants.Handlers.FontFamilyAlias,
    DynamicImagesUSyncConstants.Handlers.FontFamilyName,
    DynamicImagesUSyncConstants.Handlers.FontFamilyFolder,
    DynamicImagesUSyncConstants.Priorities.FontFamily,
    Icon = "icon-font",
    EntityType = DynamicImagesUSyncConstants.EntityTypes.FontFamily,
    IsTwoPass = false)]
public class DynamicImagesFontFamilyHandler(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncHandlerRoot<FontFamily, FontFamily>> logger,
    AppCaches appCaches,
    IShortStringHelper shortStringHelper,
    ISyncFileService syncFileService,
    ISyncEventService syncEventService,
    ISyncConfigService syncConfigService,
    ISyncItemFactory syncItemFactory)
    : SyncObjectHandler<FontFamily>(
        logger, appCaches, shortStringHelper, syncFileService, syncEventService, syncConfigService, syncItemFactory),
        ISyncHandler,
        INotificationAsyncHandler<DynamicImagesFontFamilySavedNotification>,
        INotificationAsyncHandler<DynamicImagesFontFamilyDeletedNotification>
{
    protected override Task<IEnumerable<FontFamily>> GetAllItems()
    {
        using var scope = scopeFactory.CreateScope();
        var families = scope.ServiceProvider.GetRequiredService<IFontService>().GetFamilies();

        return Task.FromResult<IEnumerable<FontFamily>>(families);
    }

    protected override string GetItemName(FontFamily item) => item.Name;

    // See DynamicImagesFontHandler: an upcast to the base handler, not a wrapper.
    public Task HandleAsync(DynamicImagesFontFamilySavedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);

    public Task HandleAsync(DynamicImagesFontFamilyDeletedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);
}
