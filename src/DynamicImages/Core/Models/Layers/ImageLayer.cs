using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models.Layers;

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum ImageFit
{
    /// <summary>Fill the box, cropping the overflow.</summary>
    [JsonStringEnumMemberName("cover")]
    Cover,

    /// <summary>Fit inside the box, leaving space.</summary>
    [JsonStringEnumMemberName("contain")]
    Contain,

    /// <summary>Stretch to the box, ignoring aspect ratio.</summary>
    [JsonStringEnumMemberName("stretch")]
    Stretch
}

public class ImageBorder
{
    public float Width { get; set; }
    public string Colour { get; set; } = "#FFFFFF";
}

public class ImageLayer : LayerBase
{
    public override string TypeAlias => "image";

    public ImageSource Source { get; set; } = ImageSource.None();

    public ImageFit Fit { get; set; } = ImageFit.Cover;

    public float CornerRadius { get; set; }

    public ImageBorder? Border { get; set; }
}
