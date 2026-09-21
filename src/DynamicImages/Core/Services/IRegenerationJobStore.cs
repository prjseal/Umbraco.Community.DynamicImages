using System.Collections.Concurrent;

namespace Umbraco.Community.DynamicImages.Core.Services;

public enum JobStatus
{
    Queued,
    Running,
    Completed,
    Cancelled,
    Failed
}

/// <summary>
/// A bulk regeneration in progress.
/// <para>
/// The counters are written from the job's own thread and read from every poll of
/// <c>jobs/{id}</c>, so they are interlocked rather than plain fields, and the failure list is a
/// concurrent queue: a plain <see cref="List{T}"/> appended from one thread and enumerated from
/// another can throw mid-run, which turned a poll into a 500 while the job itself was fine.
/// </para>
/// </summary>
public sealed class RegenerationJob
{
    private int _processed;
    private int _generated;
    private int _skipped;

    public Guid Id { get; init; } = Guid.NewGuid();

    public Guid TemplateKey { get; init; }

    public string TemplateName { get; init; } = string.Empty;

    /// <summary>The backoffice user who started the job; their id is what the saves are attributed to.</summary>
    public int? StartedByUserId { get; init; }

    public JobStatus Status { get; set; } = JobStatus.Queued;

    public int Total { get; set; }

    public int Processed => Volatile.Read(ref _processed);

    public int Generated => Volatile.Read(ref _generated);

    public int Skipped => Volatile.Read(ref _skipped);

    public void CountProcessed() => Interlocked.Increment(ref _processed);

    public void CountGenerated() => Interlocked.Increment(ref _generated);

    public void CountSkipped() => Interlocked.Increment(ref _skipped);

    /// <summary>Per-item failures: the item keeps the job going, the message is shown when it ends.</summary>
    private readonly ConcurrentQueue<string> _failures = new();

    public void Fail(string message) => _failures.Enqueue(message);

    /// <summary>A snapshot safe to serialise while the job is still running.</summary>
    public IReadOnlyList<string> Failures => [.. _failures];

    public DateTime StartedUtc { get; init; } = DateTime.UtcNow;

    public DateTime? FinishedUtc { get; set; }

    public bool CancellationRequested { get; set; }

    /// <summary>Whether this job is still occupying a slot - queued or running, not finished.</summary>
    public bool IsActive => Status is JobStatus.Queued or JobStatus.Running;
}

/// <summary>Why <see cref="IRegenerationJobStore.Create"/> refused to start a job.</summary>
public enum JobRefusal
{
    None,

    /// <summary>A job for this same template is already queued or running.</summary>
    TemplateBusy,

    /// <summary>Too many bulk jobs are already running site-wide.</summary>
    TooManyRunning
}

public sealed record JobCreateResult(RegenerationJob? Job, JobRefusal Refusal = JobRefusal.None);

/// <summary>
/// Tracks bulk regeneration jobs. In-memory on purpose: a job is progress for the tab that
/// started it, and a restart cancelling it is the right behaviour, not lost state worth a table.
/// </summary>
public interface IRegenerationJobStore
{
    /// <summary>
    /// Starts tracking a job, or refuses when one is already running for this template or the
    /// site is already running as many as it allows. Two clicks on Regenerate used to start two
    /// full-site runs over the same documents, each undoing the other's work.
    /// </summary>
    JobCreateResult Create(Guid templateKey, string templateName, int total, int? startedByUserId = null);

    RegenerationJob? Get(Guid id);

    /// <summary>Marks a job for cancellation; the running loop stops at its next item.</summary>
    bool Cancel(Guid id);
}
