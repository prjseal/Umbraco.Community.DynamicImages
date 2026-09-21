using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Extensions;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class RegenerationService(
    ITemplateCache templateCache,
    IDynamicImageRenderer renderer,
    IDynamicImageMediaWriter mediaWriter,
    IContentService contentService,
    IContentTypeService contentTypeService,
    IMediaService mediaService,
    IUmbracoContextFactory umbracoContextFactory,
    ICoreScopeProvider scopeProvider,
    ILogger<RegenerationService> logger) : IRegenerationService
{
    public async Task<RegenerationResult> RegenerateDocumentAsync(
        Guid contentKey,
        Template? template = null,
        bool force = true,
        int? userId = null,
        bool allowPublish = true,
        CancellationToken cancellationToken = default)
    {
        var content = contentService.GetById(contentKey);
        if (content is null) return new RegenerationResult(RegenerationOutcome.NotFound);

        template ??= templateCache.GetForDocType(content.ContentType.Alias).FirstOrDefault();
        if (template is null)
        {
            return new RegenerationResult(RegenerationOutcome.NoTemplate,
                Message: $"No template is configured for '{content.ContentType.Alias}'.");
        }

        var existingMediaKey = MediaSource.ResolveMediaKey(content.GetValue<string>(template.TargetPropertyAlias));
        var existingIsValid = existingMediaKey is not null && mediaService.GetById(existingMediaKey.Value) is not null;

        if (!force && template.Trigger.OnlyWhenEmpty && existingIsValid)
        {
            return new RegenerationResult(RegenerationOutcome.SkippedExisting, existingMediaKey);
        }

        try
        {
            using var contextRef = umbracoContextFactory.EnsureUmbracoContext();
            var published = contextRef.UmbracoContext.Content?.GetById(contentKey);

            var values = new ContentRenderValueSource(content, published);

            using var render = await renderer.RenderAsync(template, values, cancellationToken);

            // Replacing the existing item in place keeps the media key, so the picker reference on
            // the content - and any URL already out in the world - keeps resolving.
            var mediaKey = await mediaWriter.WriteAsync(
                render.Image,
                template,
                content,
                existingIsValid ? existingMediaKey : null,
                cancellationToken);

            var propertyValue = MediaSource.ToMediaPickerValue(mediaKey);

            if (string.IsNullOrWhiteSpace(template.TargetPropertyAlias))
            {
                return new RegenerationResult(RegenerationOutcome.Generated, mediaKey, propertyValue);
            }

            content.SetValue(template.TargetPropertyAlias, propertyValue);

            // Publishing is only safe when the image is the ONLY thing that changed. A node with
            // unpublished edits carries whatever the editor has been working on, and publishing it
            // to get an image out would push all of that live - a decision that is theirs, not
            // this package's. Same when the caller may update the node but not publish it.
            var publish = content.Published && !content.Edited && allowPublish;

            // The scope is what stops this publish being rendered a second time: it raises
            // ContentPublishingNotification, and the handler's whole job is to render on publish.
            // Without it every manual regeneration cost two renders and two media saves, and a
            // bulk run over N documents cost 2N of each.
            using (RegenerationScope.Begin())
            {
                // Culture "*" because the endpoint has no culture of its own: the image hangs off
                // the node, and publishing one culture's worth of it would leave the others stale.
                if (publish) contentService.Publish(content, ["*"], userId ?? Constants.Security.SuperUserId);
                else contentService.Save(content, userId);
            }

            return publish
                ? new RegenerationResult(RegenerationOutcome.Generated, mediaKey, propertyValue)
                : new RegenerationResult(
                    content.Published ? RegenerationOutcome.GeneratedDraft : RegenerationOutcome.Generated,
                    mediaKey,
                    propertyValue,
                    content.Published
                        ? "The image was saved to the draft. Publish the page to make it live."
                        : null);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Dynamic Images: regeneration failed for {ContentKey} ({ContentName})", contentKey, content.Name);
            return new RegenerationResult(RegenerationOutcome.Failed, Message: ex.Message);
        }
    }

    public IReadOnlyList<Guid> FindDocuments(Template template)
    {
        var keys = new List<Guid>();

        foreach (var alias in template.DocTypeAliases)
        {
            var contentType = contentTypeService.Get(alias);
            if (contentType is null) continue;

            var page = 0;
            long total;
            do
            {
                var batch = contentService.GetPagedOfType(contentType.Id, page++, 200, out total, scopeProvider.CreateQuery<IContent>());
                keys.AddRange(batch.Select(c => c.Key));
            }
            while (page * 200 < total);
        }

        return keys.Distinct().ToList();
    }
}
