using Microsoft.AspNetCore.Authorization;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Security;

namespace Umbraco.Community.DynamicImages.Security;

/// <summary>
/// Regenerating one document's image is a content operation, not a configuration one - so it is
/// granted to anyone with the Content section (or the Dynamic Images section), letting the
/// property and entity actions work for editors who cannot open the designer.
/// </summary>
public class RegenerateHandler(IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
    : AuthorizationHandler<RegenerateRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RegenerateRequirement requirement)
    {
        var user = backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser;

        if (user is not null &&
            (user.AllowedSections.Contains(Constants.Applications.Content) ||
             user.AllowedSections.Contains(DynamicImagesConstants.SectionAlias)))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
