using DynamicImages.NotificationHandlers;

using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;

namespace DynamicImages;

public class DynamicImagesComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.ManifestFilters().Append<DynamicImagesManifestFilter>();
        builder.AddNotificationHandler<ContentPublishingNotification, DynamicImagesNotificationHandler>();
    }
}