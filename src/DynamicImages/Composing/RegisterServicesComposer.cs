using DynamicImages.Services;
using Microsoft.AspNetCore.Hosting;
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
        builder.Services
            .AddSingleton<IFontCollection>(sp => {
                FontCollection collection = new();

                var host = sp.GetRequiredService<IWebHostEnvironment>();
                var path = host.MapPathWebRoot("/assets/fonts/OpenSans-Regular.ttf");
                collection.Add(path);
                return collection;
            });

        builder.Services.AddSingleton<IDynamicImageService, DynamicImageService>();
    }
}
