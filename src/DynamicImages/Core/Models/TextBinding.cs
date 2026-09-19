using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;

namespace Umbraco.Community.DynamicImages.Core.Models;

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum TextBindingKind
{
    /// <summary>A property on the content node. Rich text is stripped to plain text.</summary>
    [JsonStringEnumMemberName("property")]
    Property,

    /// <summary>The node's name.</summary>
    [JsonStringEnumMemberName("nodeName")]
    NodeName,

    /// <summary>Estimated reading time of <see cref="TextBinding.PropertyAlias"/> (default "mainContent").</summary>
    [JsonStringEnumMemberName("readingTime")]
    ReadingTime,

    /// <summary>A date property (including the system createDate/updateDate) formatted with <see cref="TextBinding.Format"/>.</summary>
    [JsonStringEnumMemberName("date")]
    Date,

    /// <summary>Fixed text that never varies by node.</summary>
    [JsonStringEnumMemberName("static")]
    Static,

    /// <summary>
    /// A token string, e.g. <c>"{name} · {readingTime}"</c>. Supported tokens: {name},
    /// {readingTime}, {prop:alias}, {date:alias:format}.
    /// </summary>
    [JsonStringEnumMemberName("expression")]
    Expression
}

public class TextBinding
{
    public TextBindingKind Kind { get; set; } = TextBindingKind.NodeName;

    public string? PropertyAlias { get; set; }

    /// <summary>.NET date format string, for <see cref="TextBindingKind.Date"/>.</summary>
    public string? Format { get; set; }

    /// <summary>Culture used to format dates. Invariant when empty.</summary>
    public string? Culture { get; set; }

    /// <summary>The literal text for <see cref="TextBindingKind.Static"/>, or the token string for <see cref="TextBindingKind.Expression"/>.</summary>
    public string? Text { get; set; }
}
