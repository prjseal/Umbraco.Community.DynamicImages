using DynamicImages.Config;
using DynamicImages.Services;

using MailKit.Search;

using Microsoft.Extensions.Options;

using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Web.Common.UmbracoContext;
using Umbraco.Extensions;

namespace DynamicImages.NotificationHandlers;

public class DynamicImagesNotificationHandler : INotificationHandler<ContentPublishingNotification>
{

    private readonly IDynamicImageService _imageService;
    private readonly IContentService _contentService;
    private readonly DynamicImagesConfig? _config;
    private readonly IUmbracoContextFactory _umbracoContextFactory;

    public DynamicImagesNotificationHandler(IDynamicImageService imageService, IContentService contentService, IOptions<DynamicImagesConfig> config, IUmbracoContextFactory umbracoContextFactory)
    {
        _imageService = imageService;
        _contentService = contentService;
        _config = config.Value;
        _umbracoContextFactory = umbracoContextFactory;
    }

    public async void Handle(ContentPublishingNotification notification)
    {
        if (_config == null || !_config.Enabled)
        {
            return;
        }

        using var context = _umbracoContextFactory.EnsureUmbracoContext();

        foreach (var node in notification.PublishedEntities)
        {
            var publishedNode = context.UmbracoContext.Content.GetById(node.Id);
            var instructionAliases = _config.Instructions.Select(x => x.DocTypeAlias).ToList();

            if (instructionAliases.Contains(node.ContentType.Alias))
            {
                var instruction = _config.Instructions.Where(x => x.DocTypeAlias == node.ContentType.Alias).FirstOrDefault();
                if (instruction == null) { return; }

                var canBeSet = !string.IsNullOrWhiteSpace(instruction?.TargetPropertyAlias)
                    && publishedNode.Value(instruction.TargetPropertyAlias) == null
                    && (node.GetValue(instruction.TargetPropertyAlias) == null
                    || node.GetValue(instruction.TargetPropertyAlias)?.ToString() == "[]");

                if (!canBeSet)
                {
                    return;
                }

                var imageName = node.Name;
                var mediaKey = await _imageService.CreateMediaItemAsync(instruction);
                if (mediaKey != null)
                {
                    var udi = Udi.Create(Constants.UdiEntityType.Media, mediaKey);

                    // Set the value of the property with alias 'featuredBanner'. 
                    node.SetValue(instruction.TargetPropertyAlias, udi.ToString());
                    _contentService.SaveAndPublish(node);
                }
            }
        }


    }
}