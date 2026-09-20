using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;

namespace Umbraco.Community.DynamicImages.Migrations;

/// <summary>
/// Adds the Dynamic Images section to the Administrators group's allowed sections.
/// <para>
/// A section declared in <c>umbraco-package.json</c> is registered but not <i>granted</i>: a
/// user group's allowed sections are explicit, and a freshly installed site's Administrators
/// group lists only the core ones. So installing the package left the section invisible to
/// everyone, including the admin, with nothing in the UI to suggest what was wrong - it simply
/// was not in the section nav.
/// </para>
/// <para>
/// Only Administrators, and only once. Every other group stays as it is, because which editors
/// should be able to design social images is a decision for the site, not for this package; and
/// because the migration runs once, an administrator who later removes the section keeps it
/// removed.
/// </para>
/// </summary>
public class GrantSectionToAdministrators(
    IMigrationContext context,
    IUserGroupService userGroupService) : AsyncMigrationBase(context)
{
    protected override async Task MigrateAsync()
    {
        var administrators = await userGroupService.GetAsync(Umbraco.Cms.Core.Constants.Security.AdminGroupAlias);

        if (administrators is null)
        {
            // A site that has not been through the installer yet has no groups. The section is
            // still registered; it just has to be granted by hand.
            Logger.LogWarning(
                "Dynamic Images: the Administrators group was not found, so the section was not granted to it. " +
                "Add '{Section}' to a user group's sections to see it.",
                DynamicImagesConstants.SectionAlias);
            return;
        }

        if (administrators.AllowedSections.Contains(DynamicImagesConstants.SectionAlias)) return;

        administrators.AddAllowedSection(DynamicImagesConstants.SectionAlias);

        var result = await userGroupService.UpdateAsync(administrators, Umbraco.Cms.Core.Constants.Security.SuperUserKey);

        if (result.Success)
        {
            Logger.LogInformation(
                "Dynamic Images: granted the '{Section}' section to the Administrators group.",
                DynamicImagesConstants.SectionAlias);
        }
        else
        {
            Logger.LogWarning(
                "Dynamic Images: could not grant the '{Section}' section to the Administrators group ({Status}). " +
                "Add it to a user group's sections by hand.",
                DynamicImagesConstants.SectionAlias, result.Status);
        }
    }
}
