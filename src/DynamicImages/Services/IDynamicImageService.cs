using DynamicImages.Models;

using SixLabors.ImageSharp;

using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace DynamicImages.Services;

public interface IDynamicImageService
{
    Task<Image> GenerateImageAsync(Instruction instruction, IContent contentNode, IPublishedContent publishedContentNode, CancellationToken cancellationToken = default);
    Task<Guid> CreateMediaItemAsync(Instruction instruction, IContent contentNode, IPublishedContent publishedContent);
}