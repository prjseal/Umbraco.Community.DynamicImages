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
/// Moves the rows of DynamicImages_Template in and out of
/// <c>uSync/{version}/DynamicImagesTemplates</c>.
/// <para>
/// uSync resolves handlers as singletons and <see cref="ITemplateService"/> is scoped, so the
/// service is taken from a scope per call rather than constructor-injected.
/// </para>
/// </summary>
[SyncHandler(
    DynamicImagesUSyncConstants.Handlers.TemplateAlias,
    DynamicImagesUSyncConstants.Handlers.TemplateName,
    DynamicImagesUSyncConstants.Handlers.TemplateFolder,
    DynamicImagesUSyncConstants.Priorities.Template,
    Icon = "icon-picture",
    EntityType = DynamicImagesUSyncConstants.EntityTypes.Template,
    IsTwoPass = false)]
public class DynamicImagesTemplateHandler(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncHandlerRoot<Template, Template>> logger,
    AppCaches appCaches,
    IShortStringHelper shortStringHelper,
    ISyncFileService syncFileService,
    ISyncEventService syncEventService,
    ISyncConfigService syncConfigService,
    ISyncItemFactory syncItemFactory)
    : SyncObjectHandler<Template>(
        logger, appCaches, shortStringHelper, syncFileService, syncEventService, syncConfigService, syncItemFactory),
        ISyncHandler,
        INotificationAsyncHandler<DynamicImagesTemplateSavedNotification>,
        INotificationAsyncHandler<DynamicImagesTemplateDeletedNotification>
{
    protected override Task<IEnumerable<Template>> GetAllItems()
    {
        using var scope = scopeFactory.CreateScope();
        var templates = scope.ServiceProvider.GetRequiredService<ITemplateService>().GetAll();

        return Task.FromResult<IEnumerable<Template>>(templates);
    }

    protected override string GetItemName(Template item) => item.Name;

    // See DynamicImagesFontHandler: the main package publishes concrete subclasses of Umbraco's
    // abstract notifications, and these forward to the base handler as an upcast.
    public Task HandleAsync(DynamicImagesTemplateSavedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);

    public Task HandleAsync(DynamicImagesTemplateDeletedNotification notification, CancellationToken cancellationToken)
        => base.HandleAsync(notification, cancellationToken);
}
