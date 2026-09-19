namespace Umbraco.Community.DynamicImages.Core.Services;

public enum JobStatus
{
    Queued,
    Running,
    Completed,
    Cancelled,
    Failed
}

public sealed class RegenerationJob
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public Guid TemplateKey { get; init; }

    public string TemplateName { get; init; } = string.Empty;

    public JobStatus Status { get; set; } = JobStatus.Queued;

    public int Total { get; set; }

    public int Processed { get; set; }

    public int Generated { get; set; }

    public int Skipped { get; set; }

    /// <summary>Per-item failures: the item keeps the job going, the message is shown when it ends.</summary>
    public List<string> Failures { get; } = [];

    public DateTime StartedUtc { get; init; } = DateTime.UtcNow;

    public DateTime? FinishedUtc { get; set; }

    public bool CancellationRequested { get; set; }
}

/// <summary>
/// Tracks bulk regeneration jobs. In-memory on purpose: a job is progress for the tab that
/// started it, and a restart cancelling it is the right behaviour, not lost state worth a table.
/// </summary>
public interface IRegenerationJobStore
{
    RegenerationJob Create(Guid templateKey, string templateName, int total);

    RegenerationJob? Get(Guid id);

    /// <summary>Marks a job for cancellation; the running loop stops at its next item.</summary>
    bool Cancel(Guid id);
}
