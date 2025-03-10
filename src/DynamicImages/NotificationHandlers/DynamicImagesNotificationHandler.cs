using DynamicImages.Config;
using DynamicImages.Services;
using Microsoft.Extensions.Configuration;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace DynamicImages.NotificationHandlers
{
    public class DynamicImagesNotificationHandler : INotificationHandler<ContentPublishingNotification>
    {

        private readonly IDynamicImageService _imageService;
        private readonly IContentService _contentService;
        private readonly DynamicImagesConfig? _config;
        public DynamicImagesNotificationHandler(IDynamicImageService imageService, IContentService contentService, IConfiguration config)
        {
            _imageService = imageService;
            _contentService = contentService;
            _config = config.GetRequiredSection("DynamicImages").Get<DynamicImagesConfig>();
        }

        public async void Handle(ContentPublishingNotification notification)
        {
            if (_config == null || !_config.Enabled)
            {
                return;
            }

            foreach (var node in notification.PublishedEntities)
            {
                var instructionAliases = _config.Instructions.Select(x => x.DocTypeAlias).ToList();

                if (instructionAliases.Contains(node.ContentType.Alias))
                {
                    var instruction = _config.Instructions.Where(x => x.DocTypeAlias == node.ContentType.Alias).FirstOrDefault();

                    if(string.IsNullOrWhiteSpace(instruction?.TargetPropertyAlias)
                        || node.GetValue(instruction.TargetPropertyAlias) == null)
                    {
                        return;
                    }

                    if (instruction == null) { return; }
                    var imageName = node.Name;
                    var mediaKey = await _imageService.CreateMediaItemAsync(instruction);
                    if (mediaKey != null)
                    {
                        var udi = Udi.Create(Constants.UdiEntityType.Media, mediaKey);

                        // Set the value of the property with alias 'featuredBanner'. 
                        node.SetValue(instruction.TargetPropertyAlias, udi.ToString());
                        _contentService.Save(node);
                    }
                }
            }
        }
    }
}
