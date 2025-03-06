using DynamicImages.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using Umbraco.Cms.Web.Common.Controllers;

namespace DynamicImages.Controllers
{
    [ApiController]
    [Route("api/img")]
    public class DynamicImageController : UmbracoApiController
    {
        private readonly IDynamicImageService _imageService;

        public DynamicImageController(IDynamicImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpGet]
        [Route("{title}")]
        public async Task<FileResult> GetResultImage(string title)
        {
            using var image = await _imageService.GenerateImage(title);

            var manager = new RecyclableMemoryStreamManager();
            var stream = manager.GetStream();
            image.SaveAsJpeg(stream);

            stream.Position = 0;
            return File(stream, JpegFormat.Instance.DefaultMimeType);
        }
    }
}
