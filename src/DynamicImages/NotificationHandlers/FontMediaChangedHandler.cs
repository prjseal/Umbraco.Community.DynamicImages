using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Community.DynamicImages.Core.Cache;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.NotificationHandlers;

/// <summary>
/// Reloads a font when its media item is replaced or deleted. Without this, swapping the file
/// behind a registered font would leave every server drawing with the old one until a restart.
/// </summary>
public class FontMediaChangedHandler(
    IFontRepository fontRepository,
    DistributedCache distributedCache)
    : INotificationHandler<MediaSavedNotification>, INotificationHandler<MediaDeletedNotification>
{
    public void Handle(MediaSavedNotification notification) => Invalidate(notification.SavedEntities);

    public void Handle(MediaDeletedNotification notification) => Invalidate(notification.DeletedEntities);

    private void Invalidate(IEnumerable<IMedia> media)
    {
        var mediaKeys = media.Select(m => m.Key).ToHashSet();
        if (mediaKeys.Count == 0) return;

        // Cheaper to ask the repository which fonts these are than to filter on media type: a font
        // registered before the package's media type existed is an ordinary File.
        foreach (var font in fontRepository.GetAll().Where(f => f.MediaKey is { } key && mediaKeys.Contains(key)))
        {
            distributedCache.RefreshByPayload(
                DynamicImagesCacheRefresher.UniqueId,
                [new DynamicImagesCacheRefresherPayload { Kind = DynamicImagesChangeKind.Font, Key = font.Key }]);
        }
    }
}
