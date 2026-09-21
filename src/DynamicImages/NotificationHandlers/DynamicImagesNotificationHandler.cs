using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Extensions;

namespace Umbraco.Community.DynamicImages.NotificationHandlers;

/// <summary>
/// Generates the image as content is published, writing the media reference onto the in-flight
/// node so it is persisted by the publish that is already running.
/// </summary>
public class DynamicImagesNotificationHandler(
    ITemplateCache templateCache,
    IDynamicImageRenderer renderer,
    IDynamicImageMediaWriter mediaWriter,
    IMediaService mediaService,
    IUmbracoContextFactory umbracoContextFactory,
    IOptionsMonitor<DynamicImagesOptions> options,
    ILogger<DynamicImagesNotificationHandler> logger)
    : INotificationAsyncHandler<ContentPublishingNotification>
{
    public async Task HandleAsync(ContentPublishingNotification notification, CancellationToken cancellationToken)
    {
        // This package's own regeneration publishes the node it just wrote an image onto, which
        // raises this notification. Rendering again here would redo the work that publish exists
        // to persist - so the regeneration marks its own publish and this stands down. Checked
        // before anything else, so the stand-down costs one read.
        if (RegenerationScope.IsActive) return;

        // Read per-notification rather than once at composition, so toggling the switch takes
        // effect on the next publish instead of the next restart.
        if (!options.CurrentValue.Enabled) return;

        using var contextRef = umbracoContextFactory.EnsureUmbracoContext();

        foreach (var node in notification.PublishedEntities)
        {
            Template? template = null;
            try
            {
                template = templateCache
                    .GetForDocType(node.ContentType.Alias)
                    .FirstOrDefault(t => t.Trigger.OnPublish);

                if (template is null || string.IsNullOrWhiteSpace(template.TargetPropertyAlias)) continue;

                var published = contextRef.UmbracoContext.Content?.GetById(node.Key);

                if (!ShouldGenerate(template, node, published)) continue;

                var values = new ContentRenderValueSource(node, published);

                using var render = await renderer.RenderAsync(template, values, cancellationToken);

                var existingMediaKey = ExistingMediaKey(template, node);
                var mediaKey = await mediaWriter.WriteAsync(
                    render.Image, template, node, existingMediaKey, cancellationToken);

                // Set the value on the in-flight content so the publish persists it. Do not call
                // IContentService.Save here - the publish pipeline rejects a save from inside it
                // ("use the dedicated SavePublished method"), and the mutation is picked up anyway.
                node.SetValue(template.TargetPropertyAlias, MediaSource.ToMediaPickerValue(mediaKey));
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                // A failed image must never block an editor's publish - including when the template
                // lookup itself fails, e.g. another package's startup migration publishes content
                // before this package's own migration (which creates its tables) has run.
                logger.LogError(ex, "Dynamic Images: generation failed for {ContentKey} ({ContentName}) using template '{Template}'",
                    node.Key, node.Name, template?.Alias);
            }
        }
    }

    private bool ShouldGenerate(Template template, Umbraco.Cms.Core.Models.IContent node, Umbraco.Cms.Core.Models.PublishedContent.IPublishedContent? published)
    {
        if (!template.Trigger.OnlyWhenEmpty) return true;

        // The published value goes through the value converter and comes back null when the media
        // item was deleted, while the draft value is raw JSON that may still name it. Checking
        // both is what stops a stale reference blocking regeneration forever.
        if (published?.Value(template.TargetPropertyAlias) is not null) return false;

        var existingMediaKey = ExistingMediaKey(template, node);
        return existingMediaKey is null || mediaService.GetById(existingMediaKey.Value) is null;
    }

    private static Guid? ExistingMediaKey(Template template, Umbraco.Cms.Core.Models.IContent node)
        => MediaSource.ResolveMediaKey(node.GetValue<string>(template.TargetPropertyAlias));
}
