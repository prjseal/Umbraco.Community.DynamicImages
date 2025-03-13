using DynamicImages.Config;
using DynamicImages.Services;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using SixLabors.Fonts;

using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Extensions;

namespace DynamicImages.Composing
{
    internal class RegisterServicesComposer
    {
    }
}
public class RegisterServicesComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        ConfigureDynamicImageService(builder);
    }

    private static void ConfigureDynamicImageService(IUmbracoBuilder builder)
    {
        var dynamicImagesConfig = builder.Config.GetSection("DynamicImages");
        builder.Services.AddOptions<DynamicImagesConfig>().Bind(dynamicImagesConfig);

        var config = dynamicImagesConfig.Get<DynamicImagesConfig>();
        if (config != null && config.Enabled && config.Fonts != null && config.Fonts.Any())
        {
            builder.Services
                .AddSingleton<IFontCollection>(sp =>
                {
                    FontCollection collection = new();

                    var host = sp.GetRequiredService<IWebHostEnvironment>();

                    foreach (var fontConfig in config.Fonts)
                    {
                        var path = host.MapPathWebRoot(fontConfig.Path);
                        collection.Add(path);
                    }

                    return collection;
                });

            builder.Services.AddSingleton<IDynamicImageService, DynamicImageService>();
        }


    }
}