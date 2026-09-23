using uSync.BackOffice;

namespace Umbraco.Community.DynamicImages.uSync;

/// <summary>
/// The fixed identities of this package's uSync handlers and serializers. None of these can
/// change once shipped: the aliases are what a site's uSync:Sets configuration names, the folders
/// are what is committed under uSync/, and the serializer GUIDs are how uSync matches a
/// serializer to a handler.
/// </summary>
public static class DynamicImagesUSyncConstants
{
    public static class Handlers
    {
        public const string TemplateAlias = "dynamicImagesTemplateHandler";
        public const string TemplateName = "Dynamic Images Templates";
        public const string TemplateFolder = "DynamicImagesTemplates";

        public const string FontAlias = "dynamicImagesFontHandler";
        public const string FontName = "Dynamic Images Fonts";
        public const string FontFolder = "DynamicImagesFonts";

        public const string TemplateFolderAlias = "dynamicImagesTemplateFolderHandler";
        public const string TemplateFolderName = "Dynamic Images Template Folders";
        public const string TemplateFolderFolder = "DynamicImagesTemplateFolders";

        public const string FontFolderAlias = "dynamicImagesFontFolderHandler";
        public const string FontFolderName = "Dynamic Images Font Folders";
        public const string FontFolderFolder = "DynamicImagesFontFolders";

        public const string FontFamilyAlias = "dynamicImagesFontFamilyHandler";
        public const string FontFamilyName = "Dynamic Images Font Families";
        public const string FontFamilyFolder = "DynamicImagesFontFamilies";
    }

    /// <summary>
    /// uSync's own handlers occupy 1005-1250 and USYNC_RESERVED_UPPER is 2000, so third parties
    /// sort above that. The order is font folders, font families, fonts, template folders,
    /// templates: each thing's container first, and fonts before templates, because a text layer
    /// names its font by key and a template whose font is missing fails validation on the way in.
    /// </summary>
    public static class Priorities
    {
        public const int FontFolder = uSyncConstants.Priorites.USYNC_RESERVED_UPPER + 6;

        /// <summary>After font folders and before fonts: a family sits in a folder and holds fonts.</summary>
        public const int FontFamily = uSyncConstants.Priorites.USYNC_RESERVED_UPPER + 8;

        public const int Font = uSyncConstants.Priorites.USYNC_RESERVED_UPPER + 10;
        public const int Template = uSyncConstants.Priorites.USYNC_RESERVED_UPPER + 20;

        /// <summary>Before templates, so a template's folder exists by the time the template arrives.</summary>
        public const int TemplateFolder = uSyncConstants.Priorites.USYNC_RESERVED_UPPER + 15;
    }

    /// <summary>
    /// The entity types the handlers export under, and the UDI types registered for them. Not the
    /// same strings as <see cref="DynamicImagesConstants.TemplateEntityType"/>, which names the
    /// backoffice workspace rather than a syncable entity.
    /// </summary>
    public static class EntityTypes
    {
        public const string Template = "dynamic-images-template";
        public const string Font = "dynamic-images-font";
        public const string TemplateFolder = "dynamic-images-template-folder";
        public const string FontFolder = "dynamic-images-font-folder";
        public const string FontFamily = "dynamic-images-font-family";
    }

    /// <summary>
    /// The XML root element each serializer writes, and the name its <c>IsValid</c> checks a file
    /// against. Changing one orphans every file already exported.
    /// </summary>
    public static class ItemTypes
    {
        public const string Template = "DynamicImagesTemplate";
        public const string Font = "DynamicImagesFont";
        public const string TemplateFolder = "DynamicImagesTemplateFolder";
        public const string FontFolder = "DynamicImagesFontFolder";
        public const string FontFamily = "DynamicImagesFontFamily";
    }

    /// <summary>Fixed forever: uSync looks a handler's serializer up by this GUID.</summary>
    public static class SerializerIds
    {
        public const string Template = "0A0C6D3F-3F0B-4B7E-9C2B-4E1D6A5C7B21";
        public const string Font = "5E8B1C47-2D9A-4F63-8A15-C3B79D0E4F82";
        public const string TemplateFolder = "B7D2E4A1-6C3F-4E58-9A0D-2F1B8C5E7D93";
        public const string FontFolder = "3F6A9C21-8B4D-4E7A-B5C2-1D9E0F7A6B48";
        public const string FontFamily = "C82E5B17-4A9F-4D36-8E01-7B3C6D2F9A54";
    }
}
