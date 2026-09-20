using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Models;

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum ImageFitMode
{
    [JsonStringEnumMemberName("cover")]
    Cover,
    [JsonStringEnumMemberName("contain")]
    Contain,
    [JsonStringEnumMemberName("stretch")]
    Stretch
}

public class CanvasSettings
{
    public int Width { get; set; } = 1200;

    public int Height { get; set; } = 630;

    /// <summary>
    /// Painted before the base image, so a "contain" base image sits on it. Ignored when
    /// <see cref="BackgroundGradient"/> is set - the gradient is the fill, as on a shape layer.
    /// </summary>
    public string Background { get; set; } = "#0B0F19";

    /// <summary>When set, the canvas is filled with this instead of <see cref="Background"/>.</summary>
    public Gradient? BackgroundGradient { get; set; }

    public ImageSource BaseImage { get; set; } = ImageSource.None();

    public ImageFitMode BaseImageFit { get; set; } = ImageFitMode.Cover;
}
