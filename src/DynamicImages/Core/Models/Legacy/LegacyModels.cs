using SixLabors.Fonts;

namespace Umbraco.Community.DynamicImages.Core.Models.Legacy;

// The v1 appsettings shape, kept verbatim so LegacyConfigImporter can bind the existing
// "DynamicImages" configuration block (and pasted v1 JSON) without anyone rewriting it by hand.
// Nothing outside the importer should use these types.

public enum LegacyLayerType
{
    Text = 0,
    Image = 1,
    CategoryBadges = 2
}

public class LegacySizeAndStyle
{
    public string Name { get; set; } = string.Empty;
    public float Size { get; set; }
    public FontStyle Style { get; set; }
}

public class LegacyFontConfig
{
    public string FamilyName { get; set; } = string.Empty;
    public string? Path { get; set; }
    public List<string>? Paths { get; set; }
    public List<LegacySizeAndStyle> Styles { get; set; } = [];
}

public class LegacyLayer
{
    public LegacyLayerType LayerType { get; set; }
    public string? ImagePath { get; set; }
    public string? SourcePropertyAlias { get; set; }
    public string? DateFormat { get; set; }
    public int xPosition { get; set; }
    public int yPosition { get; set; }
    public string Colour { get; set; } = string.Empty;
    public string Font { get; set; } = string.Empty;
    public int? MaxWidth { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public float Opacity { get; set; } = 1f;
    public float? CornerRadius { get; set; }

    // Text layer extras
    public string? SuffixText { get; set; }
    public string? Alignment { get; set; } // "left" | "right" | "centre"
    public float? LineSpacing { get; set; }

    // CategoryBadges layer
    public int? IconSize { get; set; }
    public int? BadgeGap { get; set; }
    public int? LabelGap { get; set; }
    public string? LabelFont { get; set; }
    public string? LabelColour { get; set; }
    public string? CircleFillColour { get; set; }
    public string? CircleBorderColour { get; set; }
    public float? CircleBorderWidth { get; set; }
    public int? MaxBadges { get; set; }
    public bool LabelUppercase { get; set; }
    public string? IconBasePath { get; set; }
    public string? IconNameProperty { get; set; }
    public int? IconInnerSize { get; set; }
}

public class LegacyInstruction
{
    public string MediaFolder { get; set; } = string.Empty;
    public List<string> DocTypeAliases { get; set; } = [];
    public string Author { get; set; } = string.Empty;
    public string TargetPropertyAlias { get; set; } = string.Empty;
    public string SourceImagePath { get; set; } = string.Empty;
    public List<LegacyLayer> Layers { get; set; } = [];
}

/// <summary>The v1 "DynamicImages" appsettings block, as a whole.</summary>
public class LegacyConfig
{
    public List<LegacyInstruction> Instructions { get; set; } = [];
    public List<LegacyFontConfig> Fonts { get; set; } = [];
}
