using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models;

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum VisibilityRuleKind
{
    [JsonStringEnumMemberName("always")]
    Always,

    /// <summary>Draw only when the layer resolves to a non-empty value.</summary>
    [JsonStringEnumMemberName("whenNotEmpty")]
    WhenNotEmpty,

    /// <summary>Draw only when <see cref="Visibility.PropertyAlias"/> has a truthy value on the node.</summary>
    [JsonStringEnumMemberName("whenPropertyTruthy")]
    WhenPropertyTruthy
}

public class Visibility
{
    public VisibilityRuleKind Rule { get; set; } = VisibilityRuleKind.Always;

    public string? PropertyAlias { get; set; }
}
