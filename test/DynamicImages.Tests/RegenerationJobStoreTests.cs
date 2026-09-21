using Umbraco.Community.DynamicImages.Core.Services;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// Two clicks on Regenerate used to start two full-site runs over the same documents, each
/// undoing the other's work; and the progress counters were written from the job thread and read
/// from every poll, so a poll could throw while the job itself was fine.
/// </summary>
public class RegenerationJobStoreTests
{
    private static readonly Guid TemplateKey = new("11111111-2222-3333-4444-555555555555");

    [Fact]
    public void Create_StartsAJob()
    {
        var created = new RegenerationJobStore().Create(TemplateKey, "Article OG image", 12, startedByUserId: 7);

        Assert.Equal(JobRefusal.None, created.Refusal);
        Assert.NotNull(created.Job);
        Assert.Equal(TemplateKey, created.Job.TemplateKey);
        Assert.Equal(12, created.Job.Total);
        Assert.Equal(7, created.Job.StartedByUserId);
        Assert.True(created.Job.IsActive);
    }

    [Fact]
    public void Create_RefusesASecondJobForTheSameTemplate()
    {
        var store = new RegenerationJobStore();
        store.Create(TemplateKey, "Article OG image", 12);

        var second = store.Create(TemplateKey, "Article OG image", 12);

        Assert.Null(second.Job);
        Assert.Equal(JobRefusal.TemplateBusy, second.Refusal);
    }

    [Fact]
    public void Create_AllowsASecondJobForTheSameTemplateOnceTheFirstHasFinished()
    {
        var store = new RegenerationJobStore();
        var first = store.Create(TemplateKey, "Article OG image", 12).Job!;

        first.Status = JobStatus.Completed;
        first.FinishedUtc = DateTime.UtcNow;

        Assert.NotNull(store.Create(TemplateKey, "Article OG image", 12).Job);
    }

    [Fact]
    public void Create_RefusesMoreThanTheConcurrentLimitAcrossTemplates()
    {
        var store = new RegenerationJobStore();

        for (var i = 0; i < RegenerationJobStore.MaxConcurrentJobs; i++)
        {
            Assert.NotNull(store.Create(Guid.NewGuid(), $"Template {i}", 1).Job);
        }

        var refused = store.Create(Guid.NewGuid(), "One too many", 1);

        Assert.Null(refused.Job);
        Assert.Equal(JobRefusal.TooManyRunning, refused.Refusal);
    }

    [Fact]
    public void Create_LetsOnlyOneOfTwoSimultaneousClicksThrough()
    {
        var store = new RegenerationJobStore();

        // The race the 409 exists for: two editors (or one editor's double click) hitting the
        // endpoint at the same moment, on the same template.
        var results = new JobCreateResult[2];
        Parallel.For(0, 2, i => results[i] = store.Create(TemplateKey, "Article OG image", 12));

        Assert.Equal(1, results.Count(r => r.Job is not null));
        Assert.Equal(1, results.Count(r => r.Refusal == JobRefusal.TemplateBusy));
    }

    [Fact]
    public void Cancel_MarksTheJobAndReportsAnUnknownOne()
    {
        var store = new RegenerationJobStore();
        var job = store.Create(TemplateKey, "Article OG image", 1).Job!;

        Assert.True(store.Cancel(job.Id));
        Assert.True(job.CancellationRequested);
        Assert.False(store.Cancel(Guid.NewGuid()));
    }

    [Fact]
    public void Counters_AddUpUnderConcurrentWriters()
    {
        var job = new RegenerationJobStore().Create(TemplateKey, "Article OG image", 1_000).Job!;

        Parallel.For(0, 1_000, _ =>
        {
            job.CountProcessed();
            job.CountGenerated();
        });

        Assert.Equal(1_000, job.Processed);
        Assert.Equal(1_000, job.Generated);
    }

    [Fact]
    public void Failures_CanBeReadWhileTheJobIsStillWritingThem()
    {
        // The poll endpoint snapshots Failures while the job thread is appending to it. A plain
        // List<string> threw here; the point of the concurrent queue is that this does not.
        var job = new RegenerationJobStore().Create(TemplateKey, "Article OG image", 500).Job!;

        var writer = Task.Run(() =>
        {
            for (var i = 0; i < 500; i++) job.Fail($"{i}: failed");
        });

        while (!writer.IsCompleted)
        {
            _ = job.Failures.Count;
        }

        writer.GetAwaiter().GetResult();
        Assert.Equal(500, job.Failures.Count);
    }
}
