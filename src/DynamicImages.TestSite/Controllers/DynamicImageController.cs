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

        //[HttpGet]
        //[Route("{title}")]
        //public async Task<FileResult> GetResultImage(string title)
        //{
        //    using var image = await _imageService.GenerateImageAsync(title);

        //    var manager = new RecyclableMemoryStreamManager();
        //    var stream = manager.GetStream();
        //    image.SaveAsJpeg(stream);

        //    stream.Position = 0;

        //    //https://github.com/prjseal/CWContentCreator/blob/aadf40a4219f46a6e91c57648362cd2b2b471fc6/src/CWContentCreator.Core/Services/ImagesGenerationService.cs#L67
        //    return File(stream, JpegFormat.Instance.DefaultMimeType);
        //}
    }
}
