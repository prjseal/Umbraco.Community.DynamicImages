using System.Collections.Concurrent;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class RegenerationJobStore : IRegenerationJobStore
{
    private readonly ConcurrentDictionary<Guid, RegenerationJob> _jobs = new();

    public RegenerationJob Create(Guid templateKey, string templateName, int total)
    {
        PruneFinished();

        var job = new RegenerationJob { TemplateKey = templateKey, TemplateName = templateName, Total = total };
        _jobs[job.Id] = job;

        return job;
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
