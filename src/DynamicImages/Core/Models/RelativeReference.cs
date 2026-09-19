using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models;

/// <summary>
/// Which edge of the referenced layer this layer's own edge follows. The vertical edges belong on
/// <see cref="Position.RelativeY"/> and the horizontal ones on <see cref="Position.RelativeX"/>;
/// a mismatch is a validation warning and the axis stays absolute.
/// </summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum RelativeEdge
{
    /// <summary>This layer's top edge sits <c>Gap</c> below the reference's bottom edge.</summary>
    [JsonStringEnumMemberName("below")]
    Below,

    /// <summary>This layer's bottom edge sits <c>Gap</c> above the reference's top edge.</summary>
    [JsonStringEnumMemberName("above")]
    Above,

    /// <summary>This layer's left edge sits <c>Gap</c> right of the reference's right edge.</summary>
    [JsonStringEnumMemberName("rightOf")]
    RightOf,

    /// <summary>This layer's right edge sits <c>Gap</c> left of the reference's left edge.</summary>
    [JsonStringEnumMemberName("leftOf")]
    LeftOf
}

/// <summary>
/// Makes one axis of a layer's position follow another layer instead of a fixed coordinate:
/// "the description starts 10px below the title, wherever the title ends up". Resolved by
/// <c>Core/Rendering/RelativeLayout.cs</c> and mirrored on the client in
/// <c>models/relative-layout.ts</c>; both are verified against <c>relative-layout-fixtures.json</c>.
/// </summary>
public class RelativeReference
{
    public Guid LayerKey { get; set; }

    public RelativeEdge Edge { get; set; }

    /// <summary>Distance between the two edges, in image pixels.</summary>
    public float Gap { get; set; }
}
