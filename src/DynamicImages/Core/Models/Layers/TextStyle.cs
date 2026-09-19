using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models.Layers;

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum TextAlign
{
    [JsonStringEnumMemberName("left")]
    Left,
    [JsonStringEnumMemberName("centre")]
    Centre,
    [JsonStringEnumMemberName("right")]
    Right
}

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum TextTransform
{
    [JsonStringEnumMemberName("none")]
    None,
    [JsonStringEnumMemberName("uppercase")]
    Uppercase,
    [JsonStringEnumMemberName("lowercase")]
    Lowercase
}

/// <summary>What to do when the text does not fit <see cref="TextStyle.MaxLines"/>.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum TextOverflow
{
    /// <summary>Trim whole words and append an ellipsis.</summary>
    [JsonStringEnumMemberName("ellipsis")]
    Ellipsis,

    /// <summary>Drop the lines that do not fit.</summary>
    [JsonStringEnumMemberName("clip")]
    Clip,

    /// <summary>Step the font size down until it fits, to a floor of 60% of the configured size.</summary>
    [JsonStringEnumMemberName("shrink")]
    Shrink
}

public class TextStyle
{
    /// <summary>Key of a row in DynamicImages_Font.</summary>
    public Guid FontKey { get; set; }

    /// <summary>Optional named style on that font ("Title", "Meta", ...) supplying a default size and style.</summary>
    public string? StyleName { get; set; }

    public float FontSize { get; set; } = 32f;

    /// <summary>Regular / Bold / Italic / BoldItalic, matching SixLabors.Fonts.FontStyle.</summary>
    public string FontStyle { get; set; } = "Regular";

    /// <summary>#RRGGBB or #RRGGBBAA.</summary>
    public string Colour { get; set; } = "#FFFFFF";

    /// <summary>Alignment of the text *inside* its box. Where the box sits is <see cref="LayerBase.Position"/>'s anchor.</summary>
    public TextAlign TextAlign { get; set; } = TextAlign.Left;

    public float LineSpacing { get; set; } = 1f;

    public float LetterSpacing { get; set; }

    public TextTransform TextTransform { get; set; } = TextTransform.None;

    /// <summary>Null means no clamp.</summary>
    public int? MaxLines { get; set; }

    public TextOverflow Overflow { get; set; } = TextOverflow.Shrink;
}
