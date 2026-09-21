using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Community.DynamicImages.Core.Notifications;
using Umbraco.Community.DynamicImages.uSync.Handlers;

namespace Umbraco.Community.DynamicImages.uSync;

/// <summary>
/// The handlers and serializers themselves are found by Umbraco's TypeLoader - uSync's collection
/// builders scan for <c>ISyncHandler</c> and <c>ISyncSerializerBase</c>, and a newly discovered
/// handler is enabled by default. So this composer only does the two things scanning cannot: wire
/// the export-on-save notifications up, and register the UDI types that
/// <c>ExportAsync(Udi, ...)</c> and <c>FindFromNodeAsync</c> need.
/// </summary>
public class DynamicImagesUSyncComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.AddNotificationAsyncHandler<DynamicImagesTemplateSavedNotification, DynamicImagesTemplateHandler>();
        builder.AddNotificationAsyncHandler<DynamicImagesTemplateDeletedNotification, DynamicImagesTemplateHandler>();
        builder.AddNotificationAsyncHandler<DynamicImagesFontSavedNotification, DynamicImagesFontHandler>();
        builder.AddNotificationAsyncHandler<DynamicImagesFontDeletedNotification, DynamicImagesFontHandler>();

        UdiParser.RegisterUdiType(DynamicImagesUSyncConstants.EntityTypes.Template, UdiType.GuidUdi);
        UdiParser.RegisterUdiType(DynamicImagesUSyncConstants.EntityTypes.Font, UdiType.GuidUdi);
    }
}
