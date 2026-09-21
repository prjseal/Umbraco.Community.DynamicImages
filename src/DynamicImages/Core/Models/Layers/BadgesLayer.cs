using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models.Layers;

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum BadgeDirection
{
    [JsonStringEnumMemberName("horizontal")]
    Horizontal,
    [JsonStringEnumMemberName("vertical")]
    Vertical
}

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum BadgeIconKind
{
    [JsonStringEnumMemberName("none")]
    None,

    /// <summary>
    /// Look an icon up by slug under <see cref="BadgeIcon.BasePath"/>, using a property of the
    /// badge item (falling back to its name).
    /// </summary>
    [JsonStringEnumMemberName("pathPattern")]
    PathPattern
}

/// <summary>Where each badge's label goes in relation to its circle.</summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum BadgeLabelPosition
{
    /// <summary>Centred under the circle; every item is as wide as the circle.</summary>
    [JsonStringEnumMemberName("below")]
    Below,

    /// <summary>Beside the circle, vertically centred; every item is as wide as its own label.</summary>
    [JsonStringEnumMemberName("right")]
    Right,

    /// <summary>Icon only, no label.</summary>
    [JsonStringEnumMemberName("none")]
    None
}

public class BadgeIcon
{
    public BadgeIconKind Kind { get; set; } = BadgeIconKind.PathPattern;

    /// <summary>wwwroot-relative folder holding the icon files.</summary>
    public string BasePath { get; set; } = "/assets/og-icons";

    /// <summary>Property of the badge item whose value is slugified into the file name.</summary>
    public string? PropertyAlias { get; set; }

    public string Extension { get; set; } = ".png";
}

public class BadgeCircle
{
    /// <summary>Diameter of the circle, in image pixels.</summary>
    public float Size { get; set; } = 88f;

    /// <summary>Longest edge of the icon drawn inside the circle.</summary>
    public float InnerSize { get; set; } = 44f;

    public string FillColour { get; set; } = "#FFFFFF14";

    public string BorderColour { get; set; } = "#FFFFFF26";

    public float BorderWidth { get; set; } = 1.5f;
}

public class BadgeLabel
{
    public Guid FontKey { get; set; }

    public string? StyleName { get; set; }

    public float FontSize { get; set; } = 22f;

    public string Colour { get; set; } = "#6B7280";

    public TextTransform TextTransform { get; set; } = TextTransform.Uppercase;

    public float LetterSpacing { get; set; }

    /// <summary>Distance between the circle and the label - below it or beside it.</summary>
    public float Gap { get; set; } = 10f;

    public BadgeLabelPosition Position { get; set; } = BadgeLabelPosition.Below;
}

/// <summary>
/// A row (or column) of circular badges built from a multi-node picker property - categories,
/// tags, authors.
/// </summary>
public class BadgesLayer : LayerBase
{
    public override string TypeAlias => "badges";

    /// <summary>Multi-node picker property holding the items to draw.</summary>
    public string ItemsPropertyAlias { get; set; } = string.Empty;

    /// <summary>Property of each item to use as its label. Falls back to the item's name.</summary>
    public string? LabelPropertyAlias { get; set; }

    public int MaxItems { get; set; } = 2;

    /// <summary>Space between one badge and the next.</summary>
    public float Gap { get; set; } = 40f;

    public BadgeDirection Direction { get; set; } = BadgeDirection.Horizontal;

    /// <summary>
    /// Horizontal only: items that would pass the layer's <c>Size.Width</c> start a new row.
    /// Without a width nothing wraps, which the validator points out.
    /// </summary>
    public bool Wrap { get; set; }

    /// <summary>Space between wrapped rows.</summary>
    public float RowGap { get; set; } = 20f;

    public BadgeIcon Icon { get; set; } = new();

    public BadgeCircle Badge { get; set; } = new();

    public BadgeLabel Label { get; set; } = new();
}
