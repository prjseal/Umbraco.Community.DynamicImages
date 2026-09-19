using System.Text.Json.Serialization;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

[JsonConverter(typeof(CamelCaseJsonStringEnumConverter))]
public enum ValidationSeverity
{
    /// <summary>The template is saveable but something will not render as intended.</summary>
    [JsonStringEnumMemberName("warning")]
    Warning,

    /// <summary>The template cannot be saved.</summary>
    [JsonStringEnumMemberName("error")]
    Error
}

public sealed record ValidationIssue(
    ValidationSeverity Severity,
    string Code,
    string Message,
    Guid? LayerKey = null);

public sealed record ValidationResult(IReadOnlyList<ValidationIssue> Issues)
{
    public bool IsValid => Issues.All(i => i.Severity != ValidationSeverity.Error);

    public IEnumerable<ValidationIssue> Errors => Issues.Where(i => i.Severity == ValidationSeverity.Error);

    public static ValidationResult Ok { get; } = new([]);
}

/// <summary>
/// Checks a template before it is saved or previewed. Errors block the save; warnings are shown
/// in the designer and the health dashboard but do not.
/// </summary>
public interface ITemplateValidator
{
    Task<ValidationResult> ValidateAsync(Template template, CancellationToken cancellationToken = default);
}
