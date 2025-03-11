using Umbraco.Cms.Core.Manifest;

namespace DynamicImages;

internal class DynamicImagesManifestFilter : IManifestFilter
{
    public void Filter(List<PackageManifest> manifests)
    {
        var assembly = typeof(DynamicImagesManifestFilter).Assembly;

        manifests.Add(new PackageManifest
        {
            PackageName = "Umbraco.Community.DynamicImages ",
            Version = assembly.GetName()?.Version?.ToString(3) ?? "0.1.0",
            AllowPackageTelemetry = true,
            Scripts = new string[] {
                // List any Script files
                // Urls should start '/App_Plugins/DynamicImages/' not '/wwwroot/DynamicImages/', e.g.
                // "/App_Plugins/DynamicImages/Scripts/scripts.js"
            },
            Stylesheets = new string[]
            {
                // List any Stylesheet files
                // Urls should start '/App_Plugins/DynamicImages/' not '/wwwroot/DynamicImages/', e.g.
                // "/App_Plugins/DynamicImages/Styles/styles.css"
            }
        });
    }
}