using Microsoft.AspNetCore.Hosting;
using SixLabors.Fonts;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using Umbraco.Cms.Core.IO;
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

    private const string sourceImagePath = "/assets/background.jpg";

    private static string preText = DateTime.Now.ToString("dd MMMM yyyy");

    private const string communityText = "by Paul Seal";

    public DynamicImageService(
        IFontCollection fontCollection,
        IPhysicalFileSystem fileSystem,
        IWebHostEnvironment hostEnvironment)
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

        _smallFont = family.CreateFont(40, FontStyle.Bold);
        _largeFont = family.CreateFont(70, FontStyle.Bold);
        _fileSystem = fileSystem;
        _hostEnvironment = hostEnvironment;
    }

    public async Task<Image> GenerateImage(string title, CancellationToken cancellationToken = default)
    {
        using var source = _fileSystem.OpenFile(_hostEnvironment.MapPathWebRoot(sourceImagePath));

        var image = await Image.LoadAsync(source, cancellationToken);

        WriteResultText(image, title);
        return image;
    }

    private void WriteResultText(Image image, string title)
    {
        var lines = new string[]
        {
            DateTime.Now.ToString("dd MMMM yyyy"),
            title,
            "by Paul Seal"
        };

        var currentFont = _smallFont;
        var origin = new PointF(20, 20);

        image.Mutate(x => {
            for (var i = 0; i < lines.Length; i++)
            {
                var line = lines[i];

                //TODO:Need to check against long usernames once the background and positions is done
                //You can use the wrap settings in TextOptions so it wraps instead.
                var options = new TextOptions(currentFont)
                {
                    Origin = origin
                };

                x.DrawText(options, line, Color.White);

                //Or using this information, you could loader a new options with a smaller font size.
                var size = TextMeasurer.Measure(line, options);

                origin = new PointF(20, origin.Y + size.Height);
                currentFont = i % 2 != 0 ? _smallFont : _largeFont;
            }
        });
    }
}
