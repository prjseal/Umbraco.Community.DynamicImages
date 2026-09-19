using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Api.Management.Routing;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

/// <summary>
/// Shared plumbing for the package's Management API: versioned backoffice route, its own Swagger
/// document, and section-access authorisation by default. Endpoints meant for content editors
/// override the policy explicitly.
/// </summary>
[ApiVersion("1.0")]
[VersionedApiBackOfficeRoute(DynamicImagesConstants.ApiName)]
[ApiExplorerSettings(GroupName = DynamicImagesConstants.ApiName)]
[Authorize(Policy = DynamicImagesConstants.SectionAccessPolicy)]
public abstract class DynamicImagesControllerBase : ManagementApiControllerBase;

/// <summary>
/// The same route and Swagger document, but authorised for content editors rather than for people
/// who configure Dynamic Images.
/// <para>
/// This is a separate base class on purpose: ASP.NET Core combines <c>[Authorize]</c> attributes
/// rather than letting the closest one win, so an action that added the weaker policy to a
/// controller carrying the section policy would still demand both - and an editor without the
/// section would get a 403 from their own page's property action.
/// </para>
/// </summary>
[ApiVersion("1.0")]
[VersionedApiBackOfficeRoute(DynamicImagesConstants.ApiName)]
[ApiExplorerSettings(GroupName = DynamicImagesConstants.ApiName)]
[Authorize(Policy = DynamicImagesConstants.RegeneratePolicy)]
public abstract class DynamicImagesContentControllerBase : ManagementApiControllerBase;
