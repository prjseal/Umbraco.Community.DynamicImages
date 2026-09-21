using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;

namespace Umbraco.Community.DynamicImages.Migrations;

/// <summary>
/// Installs the relation type that records which media items this package generated, and for
/// which document.
/// <para>
/// The marker is a relation rather than a naming convention or a property because it survives
/// renames, moves and folder changes, and because it shows up in the media item's References tab -
/// so an editor looking at a generated image can see what generated it.
/// </para>
/// </summary>
public class EnsureGeneratedImageRelationType(IMigrationContext context, IRelationService relationService)
    : AsyncMigrationBase(context)
{
    protected override Task MigrateAsync()
    {
        if (relationService.GetRelationTypeByAlias(DynamicImagesConstants.GeneratedImageRelationAlias) is not null)
        {
            return Task.CompletedTask;
        }

        // Not a dependency: deleting the content must not be blocked by the image it generated.
        var relationType = new RelationType(
            "Dynamic Images generated image",
            DynamicImagesConstants.GeneratedImageRelationAlias,
            isBidrectional: false,
            Constants.ObjectTypes.Document,
            Constants.ObjectTypes.Media,
            isDependency: false);

        relationService.Save(relationType);

        return Task.CompletedTask;
    }
}
