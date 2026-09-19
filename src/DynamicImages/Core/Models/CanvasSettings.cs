using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

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

    /// <summary>Painted before the base image, so a "contain" base image sits on it.</summary>
    public string Background { get; set; } = "#0B0F19";

    public ImageSource BaseImage { get; set; } = ImageSource.None();

    public ImageFitMode BaseImageFit { get; set; } = ImageFitMode.Cover;
}
