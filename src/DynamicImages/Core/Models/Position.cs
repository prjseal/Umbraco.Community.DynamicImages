using System.Text.Json.Serialization;

namespace Umbraco.Community.DynamicImages.Core.Models;

public class Position
{
    public float X { get; set; }
    public float Y { get; set; }
    public Anchor Anchor { get; set; } = Anchor.TopLeft;

    /// <summary>
    /// When set, the horizontal coordinate follows another layer and <see cref="X"/> is only
    /// the fallback used when nothing on the reference chain draws.
    /// </summary>
    public RelativeReference? RelativeX { get; set; }

    /// <summary>
    /// When set, the vertical coordinate follows another layer and <see cref="Y"/> is only the
    /// fallback used when nothing on the reference chain draws.
    /// </summary>
    public RelativeReference? RelativeY { get; set; }

    /// <summary>True when either axis tracks another layer.</summary>
    [JsonIgnore]
    public bool IsRelative => RelativeX is not null || RelativeY is not null;
}
