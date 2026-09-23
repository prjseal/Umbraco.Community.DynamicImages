namespace Umbraco.Community.DynamicImages;

public static class DynamicImagesConstants
{
    /// <summary>Alias of the backoffice section, as it appears in a user group's allowed sections.</summary>
    public const string SectionAlias = "DynamicImages.Section";

    /// <summary>Entity type of the routable template workspace.</summary>
    public const string TemplateEntityType = "di-template";

    /// <summary>Entity type of a folder in the Templates tree.</summary>
    public const string TemplateFolderEntityType = "di-template-folder";

    /// <summary>Entity type of the Templates tree's root.</summary>
    public const string TemplateRootEntityType = "di-template-root";

    /// <summary>Full access to the Dynamic Images section and everything it configures.</summary>
    public const string SectionAccessPolicy = "DynamicImages.SectionAccess";

    /// <summary>
    /// Regenerate an image for a single document. Deliberately weaker than
    /// <see cref="SectionAccessPolicy"/> so content editors can use the property and entity actions.
    /// </summary>
    public const string RegeneratePolicy = "DynamicImages.Regenerate";

    /// <summary>Swagger document / API group name.</summary>
    public const string ApiName = "dynamic-images";

    /// <summary>Media type installed by the package to hold uploaded font files.</summary>
    public const string FontMediaTypeAlias = "dynamicImagesFont";

    /// <summary>
    /// Relation type marking a media item as one this package generated, and the document it was
    /// generated for. It is what tells a regeneration which images it may overwrite: an editor's
    /// hand-picked hero in the same property is not one of them.
    /// </summary>
    public const string GeneratedImageRelationAlias = "dynamicImagesGeneratedImage";

    /// <summary>The named HttpClient web fonts are fetched with; the composer sets its timeout, size cap and User-Agent.</summary>
    public const string WebFontHttpClientName = "DynamicImages.WebFonts";

    /// <summary>
    /// Sent to the font providers. Never a browser UA: Google answers a browser with seven
    /// unicode-range subsets, and a non-browser with one full file.
    /// </summary>
    public static readonly string UserAgent =
        $"Umbraco.Community.DynamicImages/{typeof(DynamicImagesConstants).Assembly.GetName().Version?.ToString(3) ?? "2.0.0"}";

    public const string TemplateTableName = "DynamicImages_Template";
    public const string FontTableName = "DynamicImages_Font";
    public const string TemplateFolderTableName = "DynamicImages_TemplateFolder";
    public const string FontFolderTableName = "DynamicImages_FontFolder";
    public const string FontFamilyTableName = "DynamicImages_FontFamily";

    /// <summary>Current template JSON schema version.</summary>
    public const int CurrentSchemaVersion = 2;
}
