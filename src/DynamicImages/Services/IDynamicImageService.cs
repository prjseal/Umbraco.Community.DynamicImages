using SixLabors.ImageSharp;

namespace DynamicImages.Services
{
    public interface IDynamicImageService
    {
        Task<Image> GenerateImage(string title, CancellationToken cancellationToken = default);
    }
}
