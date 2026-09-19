using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Sync;

namespace Umbraco.Community.DynamicImages.Core.Cache;

public sealed class DynamicImagesCacheRefresherNotification(object messageObject, MessageType messageType)
    : CacheRefresherNotification(messageObject, messageType);
