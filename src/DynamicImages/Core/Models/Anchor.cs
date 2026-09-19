using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models;

/// <summary>
/// Which point of a layer's box sits at <see cref="Position.X"/>/<see cref="Position.Y"/>.
/// Mirrored on the client in <c>models/anchor.ts</c>; both are verified against
/// <c>anchor-fixtures.json</c>.
/// </summary>
[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum Anchor
{
    [JsonStringEnumMemberName("topLeft")]
    TopLeft,
    [JsonStringEnumMemberName("topCentre")]
    TopCentre,
    [JsonStringEnumMemberName("topRight")]
    TopRight,
    [JsonStringEnumMemberName("middleLeft")]
    MiddleLeft,
    [JsonStringEnumMemberName("middleCentre")]
    MiddleCentre,
    [JsonStringEnumMemberName("middleRight")]
    MiddleRight,
    [JsonStringEnumMemberName("bottomLeft")]
    BottomLeft,
    [JsonStringEnumMemberName("bottomCentre")]
    BottomCentre,
    [JsonStringEnumMemberName("bottomRight")]
    BottomRight
}
