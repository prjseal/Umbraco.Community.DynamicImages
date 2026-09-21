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
        var entities = media as IReadOnlyCollection<IMedia> ?? media.ToList();

        // This fires on every media save and delete anywhere on the site - every image upload,
        // every crop - and used to query the fonts table each time. A font is only ever the
        // package's own media type or a plain File (rows registered before that media type
        // existed), so anything else cannot be one and costs a type-alias comparison to rule out.
        if (!entities.Any(CouldBeAFont)) return;

        var mediaKeys = entities.Select(m => m.Key).ToHashSet();
        if (mediaKeys.Count == 0) return;

        // Still the repository rather than a media-type filter for the match itself: a font
        // registered before the package's media type existed is an ordinary File.
        foreach (var font in fontRepository.GetAll().Where(f => f.MediaKey is { } key && mediaKeys.Contains(key)))
        {
            distributedCache.RefreshByPayload(
                DynamicImagesCacheRefresher.UniqueId,
                [new DynamicImagesCacheRefresherPayload { Kind = DynamicImagesChangeKind.Font, Key = font.Key }]);
        }
    }

    private static bool CouldBeAFont(IMedia media)
        => string.Equals(media.ContentType.Alias, DynamicImagesConstants.FontMediaTypeAlias, StringComparison.OrdinalIgnoreCase)
           || string.Equals(media.ContentType.Alias, Umbraco.Cms.Core.Constants.Conventions.MediaTypes.File, StringComparison.OrdinalIgnoreCase);
}
