using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Sync;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Core.Cache;

/// <summary>
/// Invalidates the template cache and the font registry across every server in the installation.
/// </summary>
public sealed class DynamicImagesCacheRefresher(
    AppCaches appCaches,
    IJsonSerializer jsonSerializer,
    IEventAggregator eventAggregator,
    ICacheRefresherNotificationFactory factory,
    ITemplateCache templateCache,
    IFontRegistry fontRegistry)
    : PayloadCacheRefresherBase<DynamicImagesCacheRefresherNotification, DynamicImagesCacheRefresherPayload>(
        appCaches, jsonSerializer, eventAggregator, factory)
{
    public static readonly Guid UniqueId = new("5b2ea0c6-3d54-4f18-9f7c-2ad6a4f4f2b1");

    public override Guid RefresherUniqueId => UniqueId;

    public override string Name => "Dynamic Images template cache refresher";

    public override void Refresh(DynamicImagesCacheRefresherPayload[] payloads)
    {
        foreach (var payload in payloads)
        {
            switch (payload.Kind)
            {
                case DynamicImagesChangeKind.Font:
                    // A font's file or named styles changed; only that family needs reloading, but
                    // templates keep their cached copy of the font key so they stay valid.
                    if (payload.Key == Guid.Empty) fontRegistry.Clear();
                    else fontRegistry.Clear(payload.Key);
                    break;

                case DynamicImagesChangeKind.All:
                    templateCache.Clear();
                    fontRegistry.Clear();
                    break;

                default:
                    templateCache.Clear();
                    break;
            }
        }

        base.Refresh(payloads);
    }

    public override void RefreshAll()
    {
        templateCache.Clear();
        fontRegistry.Clear();
        base.RefreshAll();
    }
}
