using SixLabors.ImageSharp;

namespace DynamicImages.Services
{
    public interface IDynamicImageService
    {
        Task<Image> GenerateImageAsync(string title, CancellationToken cancellationToken = default);
    }
}
