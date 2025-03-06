using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace DynamicImages
{
    internal class DynamicImagesComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.ManifestFilters().Append<DynamicImagesManifestFilter>();
        }
    }
}
