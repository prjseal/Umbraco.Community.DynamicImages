using DynamicImages.Config;
using SixLabors.ImageSharp;

namespace DynamicImages.Services
{
    public interface IDynamicImageService
    {
        Task<Image> GenerateImageAsync(Instruction instruction, CancellationToken cancellationToken = default);
        Task<Guid> CreateMediaItemAsync(Instruction instruction);
    }
}
