using Umbraco.Community.DynamicImages.Configuration;

namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

/// <summary>
/// <c>umbraco/Data/TEMP/DynamicImages/Fonts</c> by default - Umbraco's local temp path is per
/// server and disposable, which is exactly what a cache of re-fetchable files wants - or the
/// configured <c>WebFonts:CacheFolder</c>.
/// </summary>
public sealed class HostingFontCacheRoot(
    // Fully qualified: GlobalUsings imports Microsoft.AspNetCore.Hosting, which has an obsolete
    // IHostingEnvironment of the same name.
    Umbraco.Cms.Core.Hosting.IHostingEnvironment hostingEnvironment,
    IOptionsMonitor<DynamicImagesOptions> options) : IFontCacheRoot
{
    public string Path
    {
        get
        {
            var configured = options.CurrentValue.WebFonts.CacheFolder;
            if (!string.IsNullOrWhiteSpace(configured))
            {
                return System.IO.Path.IsPathRooted(configured)
                    ? System.IO.Path.GetFullPath(configured)
                    : hostingEnvironment.MapPathContentRoot(configured);
            }

            return System.IO.Path.Combine(hostingEnvironment.LocalTempPath, "DynamicImages", "Fonts");
        }
    }
}
