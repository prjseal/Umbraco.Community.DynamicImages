using DynamicImages.Extensions;
using DynamicImages.Models;

using Microsoft.AspNetCore.Hosting;
using Microsoft.IO;

using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;

using Color = SixLabors.ImageSharp.Color;
using Font = SixLabors.Fonts.Font;
using Image = SixLabors.ImageSharp.Image;
using PointF = SixLabors.ImageSharp.PointF;

namespace DynamicImages.Services;

public sealed class DynamicImageService : IDynamicImageService
{
    private readonly IFontCollection _fontCollection;

    private readonly IPhysicalFileSystem _fileSystem;

    private readonly IWebHostEnvironment _hostEnvironment;

    private readonly Font _smallFont;

    private readonly Font _largeFont;
    private readonly IMediaService _mediaService;
    private readonly MediaFileManager _mediaFileManager;
    private readonly MediaUrlGeneratorCollection _mediaUrlGeneratorCollection;
    private readonly IShortStringHelper _shortStringHelper;
    private readonly IContentTypeBaseServiceProvider _contentTypeBaseServiceProvider;

    private const string avatarImagePath = "/assets/paul-seal.jpg";

    public DynamicImageService(
        IFontCollection fontCollection,
        IPhysicalFileSystem fileSystem,
        IWebHostEnvironment hostEnvironment,
        IMediaService mediaService,
        MediaFileManager mediaFileManager,
        MediaUrlGeneratorCollection mediaUrlGeneratorCollection,
        IShortStringHelper shortStringHelper,
        IContentTypeBaseServiceProvider contentTypeBaseServiceProvider)
    {
        if (fontCollection.Families?.Any() != true)
        {
            throw new ArgumentOutOfRangeException(nameof(fontCollection), "No fonts loaded");
        }

        _fontCollection = fontCollection;
        if (_fontCollection.TryGet("Open Sans", out var family) == false)
        {
            family = _fontCollection.Families.FirstOrDefault();
        }

        _smallFont = family.CreateFont(30, FontStyle.Bold);
        _largeFont = family.CreateFont(80, FontStyle.Bold);
        _fileSystem = fileSystem;
        _hostEnvironment = hostEnvironment;
        _mediaService = mediaService;
        _mediaFileManager = mediaFileManager;
        _mediaUrlGeneratorCollection = mediaUrlGeneratorCollection;
        _shortStringHelper = shortStringHelper;
        _contentTypeBaseServiceProvider = contentTypeBaseServiceProvider;
    }

    public async Task<Image> GenerateImageAsync(Instruction instruction, IContent contentNode, IPublishedContent publishedContentNode, CancellationToken cancellationToken = default)
    {
        using var source = _fileSystem.OpenFile(_hostEnvironment.MapPathWebRoot(instruction.SourceImagePath));

        var image = await Image.LoadAsync(source, cancellationToken);

        foreach (var layer in instruction.Layers)
        {
            switch (layer.LayerType)
            {
                case LayerType.Text:
                    if (!string.IsNullOrWhiteSpace(layer.SourcePropertyAlias))
                    {
                        var text = "";
                        if (layer.SourcePropertyAlias == "name")
                        {
                            text = contentNode.Name;
                        }
                        else
                        {
                            text = contentNode.GetValue<string>(layer.SourcePropertyAlias);
                        }
                        await WriteMultipleLinesAsync(image, new[] { text }, cancellationToken, Color.ParseHex(layer.Colour), _largeFont, layer.xPosition, layer.yPosition);
                    }
                    break;
            }
        }


        //var titleLines = new string[]
        //{
        //"GENERATING DYNAMIC",
        //"IMAGES FOR THE PACKAGE",
        //"JAM AT UMBRACO SPARK"
        //};

        //await WriteMultipleLinesAsync(image, titleLines, cancellationToken, Color.White, _largeFont, 50, 60);

        //await WriteLineAsync(image, instruction.Author, cancellationToken, new Rgba32(193, 62, 169, 1), _smallFont, 178, 525);
        //await WriteLineAsync(image, "114", cancellationToken, new Rgba32(193, 62, 169, 1), _smallFont, 526, 526);
        //await WriteLineAsync(image, DateTime.Now.ToString("dd MMMM yyyy"), cancellationToken, Color.White, _smallFont, 606, 526);
        //await AddAvatarToImageAsync(image, avatarImagePath, cancellationToken, 50, 480);

        return image;
    }

    private async Task WriteMultipleLinesAsync(Image image, string[] lines, CancellationToken cancellationToken, Color color, Font font, int xPosition, int yPosition)
    {
        var currentFont = font;
        var origin = new PointF(xPosition, yPosition);

        await Task.Run(() =>
        {
            image.Mutate(x =>
            {
                for (var i = 0; i < lines.Length; i++)
                {
                    var line = lines[i];
                    var newOrigin = origin;
                    WriteSingleLine(x, line, ref newOrigin, currentFont, color);
                    origin = newOrigin;
                }
            });
        }, cancellationToken);
    }

    private void WriteSingleLine(IImageProcessingContext context, string line, ref PointF origin, Font currentFont, Color color)
    {
        var options = new TextOptions(currentFont)
        {
            Origin = origin
        };

        context.DrawText(options, line, color);

        var size = TextMeasurer.Measure(line, options);
        origin = new PointF(50, origin.Y + (size.Height * 0.8f));
    }

    private async Task WriteLineAsync(Image image, string text, CancellationToken cancellationToken, Color color, Font font, int xPosition, int yPosition)
    {
        var point = new PointF(xPosition, yPosition);
        var currentFont = font;
        await Task.Run(() =>
        {
            image.Mutate(x =>
            {
                var options = new TextOptions(currentFont)
                {
                    Origin = point
                };

                x.DrawText(options, text, color);
            });
        }, cancellationToken);
    }

    private async Task AddAvatarToImageAsync(Image image, string avatarImagePath, CancellationToken cancellationToken, int xPosition, int yPosition)
    {
        using var avatar = _fileSystem.OpenFile(_hostEnvironment.MapPathWebRoot(avatarImagePath));
        var avatarImage = await Image.LoadAsync(avatar, cancellationToken);

        var roundedAvatar = avatarImage.Clone(x =>
        x.ConvertToAvatar(new SixLabors.ImageSharp.Size(100, 100), 50, new Rgba32(0, 0, 0, 1)));


        image.Mutate(x => x.DrawImage(roundedAvatar, new SixLabors.ImageSharp.Point(xPosition, yPosition), 1f));
    }

    public async Task<Guid> CreateMediaItemAsync(Instruction instruction, IContent contentNode, IPublishedContent publishedContentNode)
    {
        using var image = await GenerateImageAsync(instruction, contentNode, publishedContentNode);

        var manager = new RecyclableMemoryStreamManager();
        var stream = manager.GetStream();
        image.SaveAsJpeg(stream);

        stream.Position = 0;

        byte[]? byteArray = null;

        using (var memoryStream = new MemoryStream())
        {
            stream.CopyTo(memoryStream);
            byteArray = memoryStream.ToArray();
        }

        //var imageBytes = await DownloadImageAsync(url);

        using var imageStream = new MemoryStream(byteArray);

        var parentFolder = _mediaService.GetByLevel(1)
            ?.FirstOrDefault(m => m.ContentType.Alias == "Folder" && m.Name == "Demo");

        if (parentFolder == null)
        {
            parentFolder = _mediaService.CreateMedia("Demo", -1, "Folder");
            _mediaService.Save(parentFolder);
        }

        var folderId = HandleMediaWithTheSameNames(instruction.ImageName, parentFolder.Id) ?? parentFolder.Id;
        var media = _mediaService.CreateMedia(instruction.ImageName, folderId, "Image");
        media.SetValue(_mediaFileManager, _mediaUrlGeneratorCollection, _shortStringHelper, _contentTypeBaseServiceProvider, Umbraco.Cms.Core.Constants.Conventions.Media.File, $"{instruction.ImageName}.png", imageStream);
        _mediaService.Save(media);
        return media.Key;
    }

    private int? HandleMediaWithTheSameNames(string mediaItemName, int parentFolderId)
    {
        var mediaFromFolder = _mediaService.GetPagedChildren(parentFolderId, 0, int.MaxValue, out _).ToList();
        var mediaWithTheSameName =
            mediaFromFolder.Where(m => m.Name == mediaItemName && m.ContentType.Alias == "Image").ToList();

        var folderForMediaWithTheSameName = mediaFromFolder.FirstOrDefault(f => f.Name == $"{mediaItemName} images" && f.ContentType.Alias == "Folder");

        if (!mediaWithTheSameName.Any() && folderForMediaWithTheSameName == null)
        {
            return null;
        }

        if (folderForMediaWithTheSameName == null)
        {
            folderForMediaWithTheSameName = _mediaService.CreateMedia($"{mediaItemName} images", parentFolderId, "Folder");
            _mediaService.Save(folderForMediaWithTheSameName);
        }

        foreach (var m in mediaWithTheSameName)
        {
            _mediaService.Move(m, folderForMediaWithTheSameName.Id);
        }

        return folderForMediaWithTheSameName.Id;
    }
}