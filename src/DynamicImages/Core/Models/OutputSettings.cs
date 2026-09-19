using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models;

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum OutputFormat
{
    [JsonStringEnumMemberName("png")]
    Png,
    [JsonStringEnumMemberName("jpeg")]
    Jpeg,
    [JsonStringEnumMemberName("webp")]
    Webp
}

public class OutputSettings
{
    /// <summary>Media folder the generated images are saved into. Null = the media root.</summary>
    public Guid? MediaFolderKey { get; set; }

    /// <summary>
    /// Name of the generated media item. Tokens: {name}, {id}, {template}.
    /// The file extension follows <see cref="Format"/>.
    /// </summary>
    public string FileNamePattern { get; set; } = "{name}";

    public OutputFormat Format { get; set; } = OutputFormat.Png;

    /// <summary>1-100, used by the JPEG and WebP encoders. Ignored for PNG.</summary>
    public int Quality { get; set; } = 90;
}
