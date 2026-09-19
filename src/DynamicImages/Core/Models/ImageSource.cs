using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models;

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum ImageSourceKind
{
    /// <summary>A media item, referenced by key. Blob-backed on Umbraco Cloud.</summary>
    [JsonStringEnumMemberName("media")]
    Media,

    /// <summary>A wwwroot-relative path, for assets committed alongside the site.</summary>
    [JsonStringEnumMemberName("path")]
    Path,

    /// <summary>A media picker property on the content being rendered.</summary>
    [JsonStringEnumMemberName("property")]
    Property,

    /// <summary>
    /// A file fetched from a URL and cached on each server. Fonts only: an image source of this
    /// kind is rejected by validation and opens as nothing.
    /// </summary>
    [JsonStringEnumMemberName("url")]
    Url,

    /// <summary>Nothing - draw no image.</summary>
    [JsonStringEnumMemberName("none")]
    None
}

public class ImageSource
{
    public ImageSourceKind Kind { get; set; } = ImageSourceKind.None;

    public Guid? MediaKey { get; set; }

    public string? Path { get; set; }

    public string? PropertyAlias { get; set; }

    /// <summary>Used when <see cref="Kind"/> is <see cref="ImageSourceKind.Property"/> and the property is empty.</summary>
    public ImageSource? Fallback { get; set; }

    public static ImageSource None() => new() { Kind = ImageSourceKind.None };
}
