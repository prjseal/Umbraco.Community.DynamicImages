using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Infrastructure.Migrations;

namespace Umbraco.Community.DynamicImages.Migrations;

/// <summary>
/// Installs the media type that holds uploaded font files, so fonts are blob-backed on Cloud,
/// travel with Deploy/uSync and are shared across load-balanced instances.
/// </summary>
public class EnsureFontMediaType(
    IMigrationContext context,
    IMediaTypeService mediaTypeService,
    IDataTypeService dataTypeService,
    IShortStringHelper shortStringHelper) : AsyncMigrationBase(context)
{
    protected override async Task MigrateAsync()
    {
        if (mediaTypeService.Get(DynamicImagesConstants.FontMediaTypeAlias) is not null)
        {
            return;
        }

        var uploadDataType = await dataTypeService.GetAsync(Umbraco.Cms.Core.Constants.DataTypes.Guids.UploadGuid);

        if (uploadDataType is null)
        {
            Logger.LogWarning("Dynamic Images: the Upload data type is missing, so the font media type was not created.");
            return;
        }

        var mediaType = new MediaType(shortStringHelper, -1)
        {
            Alias = DynamicImagesConstants.FontMediaTypeAlias,
            Name = "Dynamic Images Font",
            Description = "A font file (ttf, otf or woff2) used by Dynamic Images templates.",
            Icon = "icon-font color-blue",
            AllowedAsRoot = false
        };

        mediaType.AddPropertyType(new PropertyType(shortStringHelper, uploadDataType)
        {
            Alias = Umbraco.Cms.Core.Constants.Conventions.Media.File,
            Name = "Font file",
            Description = "The .ttf, .otf or .woff2 file.",
            Mandatory = true,
            SortOrder = 1
        });

        // CreateAsync rather than the obsolete Save; the media type is created by the package
        // itself, so there is no user to attribute it to.
        await mediaTypeService.CreateAsync(mediaType, Umbraco.Cms.Core.Constants.Security.SuperUserKey);
    }
}
