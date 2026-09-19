using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Umbraco.Community.DynamicImages.Api.Swagger;

/// <summary>
/// Publishes the package's endpoints as their own document at /umbraco/swagger, next to
/// Umbraco's, so they can be explored and tested without reading the controllers.
/// </summary>
public class DynamicImagesSwaggerConfiguration : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
        => options.SwaggerDoc(DynamicImagesConstants.ApiName, new OpenApiInfo
        {
            Title = "Dynamic Images API",
            Version = "1.0",
            Description = "Templates, fonts, previews and regeneration for the Dynamic Images backoffice section."
        });
}
