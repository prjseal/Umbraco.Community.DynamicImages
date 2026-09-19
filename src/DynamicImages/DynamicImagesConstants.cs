namespace Umbraco.Community.DynamicImages;

public static class DynamicImagesConstants
{
    /// <summary>Alias of the backoffice section, as it appears in a user group's allowed sections.</summary>
    public const string SectionAlias = "DynamicImages.Section";

    /// <summary>Entity type of the routable template workspace.</summary>
    public const string TemplateEntityType = "di-template";

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

    public const string TemplateTableName = "DynamicImages_Template";
    public const string FontTableName = "DynamicImages_Font";

    /// <summary>Current template JSON schema version.</summary>
    public const int CurrentSchemaVersion = 2;
}
