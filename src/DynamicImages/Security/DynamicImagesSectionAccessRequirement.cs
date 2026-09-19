using Microsoft.AspNetCore.Authorization;

namespace Umbraco.Community.DynamicImages.Security;

public class DynamicImagesSectionAccessRequirement(string sectionAlias) : IAuthorizationRequirement
{
    public string SectionAlias { get; } = sectionAlias;
}
