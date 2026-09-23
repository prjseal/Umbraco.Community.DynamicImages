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
/// Moves the rows of DynamicImages_TemplateFolder in and out of
/// <c>uSync/{version}/DynamicImagesTemplateFolders</c>.
/// <para>
/// Sorts before the template handler, so a template's folder exists by the time the template is
/// imported. A template whose folder is still missing lands at the root rather than failing.
/// </para>
/// </summary>
[SyncHandler(
    DynamicImagesUSyncConstants.Handlers.TemplateFolderAlias,
    DynamicImagesUSyncConstants.Handlers.TemplateFolderName,
    DynamicImagesUSyncConstants.Handlers.TemplateFolderFolder,
    DynamicImagesUSyncConstants.Priorities.TemplateFolder,
    Icon = "icon-folder",
    EntityType = DynamicImagesUSyncConstants.EntityTypes.TemplateFolder,
    IsTwoPass = false)]
public class DynamicImagesTemplateFolderHandler(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncHandlerRoot<TemplateFolder, TemplateFolder>> logger,
    AppCaches appCaches,
    IShortStringHelper shortStringHelper,
    ISyncFileService syncFileService,
    ISyncEventService syncEventService,
    ISyncConfigService syncConfigService,
    ISyncItemFactory syncItemFactory)
    : SyncObjectHandler<TemplateFolder>(
        logger, appCaches, shortStringHelper, syncFileService, syncEventService, syncConfigService, syncItemFactory),
        ISyncHandler,
        INotificationAsyncHandler<DynamicImagesTemplateFolderSavedNotification>,
        INotificationAsyncHandler<DynamicImagesTemplateFolderDeletedNotification>
{
    protected override Task<IEnumerable<TemplateFolder>> GetAllItems()
    {
        using var scope = scopeFactory.CreateScope();
        var folders = scope.ServiceProvider.GetRequiredService<ITemplateFolderService>().GetAll();

        return Task.FromResult<IEnumerable<TemplateFolder>>(folders);
    }

    protected override string GetItemName(TemplateFolder item) => item.Name;

    // See DynamicImagesFontHandler: an upcast to the base handler, not a wrapper.
    public Task HandleAsync(DynamicImagesTemplateFolderSavedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);

    public Task HandleAsync(DynamicImagesTemplateFolderDeletedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);
}
