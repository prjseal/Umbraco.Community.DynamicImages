using Umbraco.Cms.Core.Composing;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

public sealed class LayerRendererCollection(Func<IEnumerable<ILayerRenderer>> items)
    : BuilderCollectionBase<ILayerRenderer>(items)
{
    /// <summary>The renderer for a layer, or null when its type has none registered.</summary>
    public ILayerRenderer? For(LayerBase layer)
        => this.FirstOrDefault(renderer => renderer.LayerType.IsInstanceOfType(layer));
}

public sealed class LayerRendererCollectionBuilder
    : OrderedCollectionBuilderBase<LayerRendererCollectionBuilder, LayerRendererCollection, ILayerRenderer>
{
    protected override LayerRendererCollectionBuilder This => this;
}
