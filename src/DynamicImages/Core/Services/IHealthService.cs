namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed record HealthIssue(
    string Severity,
    string Code,
    string Message,
    Guid? TemplateKey = null,
    string? TemplateName = null,
    Guid? LayerKey = null);

public sealed record HealthReport(
    bool IsEnabled,
    int TemplateCount,
    int FontCount,
    IReadOnlyList<HealthIssue> Issues);

/// <summary>
/// Answers "is this set up correctly?" across every template at once - the missing fonts, base
/// images and mis-typed properties that would otherwise only show up as a blank layer on a
/// published page.
/// </summary>
public interface IHealthService
{
    Task<HealthReport> CheckAsync(CancellationToken cancellationToken = default);
}
