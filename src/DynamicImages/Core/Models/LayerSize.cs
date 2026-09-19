namespace Umbraco.Community.DynamicImages.Core.Models;

/// <summary>
/// A layer's box. Either dimension may be null, meaning "as big as the content needs":
/// for text that is no wrapping / no vertical clamp, for images the intrinsic size.
/// </summary>
public class LayerSize
{
    public float? Width { get; set; }
    public float? Height { get; set; }
}
