using Microsoft.AspNetCore.Authorization;
using Umbraco.Cms.Core.Security;

namespace Umbraco.Community.DynamicImages.Security;

/// <summary>
/// Grants access when the signed-in backoffice user has the section in their
/// <c>AllowedSections</c> - i.e. an administrator granted it under Users &gt; User Groups.
/// </summary>
public class DynamicImagesSectionAccessHandler(IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
    : AuthorizationHandler<DynamicImagesSectionAccessRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        DynamicImagesSectionAccessRequirement requirement)
    {
        var user = backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser;

        if (user is not null && user.AllowedSections.Contains(requirement.SectionAlias))
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
}
