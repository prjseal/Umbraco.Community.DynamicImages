using System.Collections.Concurrent;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class RegenerationJobStore : IRegenerationJobStore
{
    /// <summary>
    /// Bulk jobs allowed to run at once, site-wide. Each one walks every document a template
    /// covers and renders an image per document, so a third concurrent run is not throughput -
    /// it is three jobs contending for the same render gate and the same database.
    /// </summary>
    public const int MaxConcurrentJobs = 2;

    private readonly ConcurrentDictionary<Guid, RegenerationJob> _jobs = new();

    // Create is the only compound check-then-act in here, and two editors clicking Regenerate at
    // the same moment is exactly the case it exists for, so it is done under a lock rather than
    // with a concurrent dictionary's atomics. Everything else on the store stays lock-free.
    private readonly Lock _createLock = new();

    public JobCreateResult Create(Guid templateKey, string templateName, int total, int? startedByUserId = null)
    {
        lock (_createLock)
        {
            PruneFinished();

            var active = _jobs.Values.Where(j => j.IsActive).ToList();

            if (active.Any(j => j.TemplateKey == templateKey))
            {
                return new JobCreateResult(null, JobRefusal.TemplateBusy);
            }

            if (active.Count >= MaxConcurrentJobs)
            {
                return new JobCreateResult(null, JobRefusal.TooManyRunning);
            }

            var job = new RegenerationJob
            {
                TemplateKey = templateKey,
                TemplateName = templateName,
                Total = total,
                StartedByUserId = startedByUserId,
            };

            _jobs[job.Id] = job;

            return new JobCreateResult(job);
        }
    }

    public RegenerationJob? Get(Guid id) => _jobs.GetValueOrDefault(id);

    public bool Cancel(Guid id)
    {
        if (!_jobs.TryGetValue(id, out var job)) return false;

        job.CancellationRequested = true;
        return true;
    }

    /// <summary>Drops jobs that finished over an hour ago, so a long-running site does not accumulate them.</summary>
    private void PruneFinished()
    {
        var cutoff = DateTime.UtcNow.AddHours(-1);

        foreach (var (id, job) in _jobs)
        {
            if (job.FinishedUtc is { } finished && finished < cutoff) _jobs.TryRemove(id, out _);
        }
    }
}
