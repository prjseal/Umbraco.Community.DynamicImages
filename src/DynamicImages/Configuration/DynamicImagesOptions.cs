using Umbraco.Community.DynamicImages.Core.Models.Legacy;

namespace Umbraco.Community.DynamicImages.Configuration;

public enum SyncMode
{
    /// <summary>Templates live in the database only.</summary>
    Off,

    /// <summary>Write a JSON file beside the site on every save, for committing to source control.</summary>
    Export,

    /// <summary>Read those files on startup, so configuration-as-code environments stay authoritative.</summary>
    Import
}

public class PreviewOptions
{
    /// <summary>
    /// Scale of the images the designer's debounced preview loop requests. Half size keeps the
    /// render cost down on smaller Cloud plans; the full-size render is still one click away.
    /// </summary>
    public double Scale { get; set; } = 0.5;
}

public class SyncOptions
{
    public SyncMode Mode { get; set; } = SyncMode.Off;

    /// <summary>Folder the JSON files live in, relative to the content root.</summary>
    public string Folder { get; set; } = "umbraco/DynamicImages";
}

/// <summary>
/// The package's configuration. From v2 the templates themselves live in the database - what is
/// left here is the global kill switch, the preview and sync settings, and the v1
/// <c>Instructions</c>/<c>Fonts</c> block, which is kept purely as import input.
/// </summary>
public class DynamicImagesOptions
{
    public const string SectionName = "DynamicImages";

    /// <summary>
    /// Turns image generation on or off for the whole site. Read through
    /// <see cref="IOptionsMonitor{T}"/>, so it follows a configuration reload without a restart -
    /// v1 read it once at composition time and bailed out of registering anything at all.
    /// </summary>
    public bool Enabled { get; set; } = true;

    public PreviewOptions Preview { get; set; } = new();

    public SyncOptions Sync { get; set; } = new();

    /// <summary>Fetching and caching of Google, Bunny and direct-URL fonts.</summary>
    public WebFontOptions WebFonts { get; set; } = new();

    /// <summary>
    /// Automatically import the v1 configuration below the first time the package starts against
    /// an empty template table, so an upgrade needs no manual step.
    /// </summary>
    public bool AutoImportLegacyConfig { get; set; } = true;

    /// <summary>v1 instructions. Import input only - editing these no longer changes what renders.</summary>
    public List<LegacyInstruction> Instructions { get; set; } = [];

    /// <summary>v1 fonts. Import input only.</summary>
    public List<LegacyFontConfig> Fonts { get; set; } = [];
}
