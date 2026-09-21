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
    }

    /// <summary>
    /// uSync's own handlers occupy 1005-1250 and USYNC_RESERVED_UPPER is 2000, so third parties
    /// sort above that. Fonts import before templates, because a text layer names its font by
    /// key and a template whose font is missing fails validation on the way in.
    /// </summary>
    public static class Priorities
    {
        public const int Font = uSyncConstants.Priorites.USYNC_RESERVED_UPPER + 10;
        public const int Template = uSyncConstants.Priorites.USYNC_RESERVED_UPPER + 20;
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
    }

    /// <summary>
    /// The XML root element each serializer writes, and the name its <c>IsValid</c> checks a file
    /// against. Changing one orphans every file already exported.
    /// </summary>
    public static class ItemTypes
    {
        public const string Template = "DynamicImagesTemplate";
        public const string Font = "DynamicImagesFont";
    }

    /// <summary>Fixed forever: uSync looks a handler's serializer up by this GUID.</summary>
    public static class SerializerIds
    {
        public const string Template = "0A0C6D3F-3F0B-4B7E-9C2B-4E1D6A5C7B21";
        public const string Font = "5E8B1C47-2D9A-4F63-8A15-C3B79D0E4F82";
    }
}
