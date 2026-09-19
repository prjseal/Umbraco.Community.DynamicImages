using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Extensions;
using ITemplateService = Umbraco.Community.DynamicImages.Core.Services.ITemplateService;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

public class RegenerationController(
    IRegenerationService regenerationService,
    IRegenerationJobStore jobStore,
    ITemplateService templateService,
    IContentService contentService,
    IMediaService mediaService,
    IServiceScopeFactory scopeFactory,
    ILogger<RegenerationController> logger) : DynamicImagesControllerBase
{
    /// <summary>
    /// Regenerates every document a template applies to. Returns immediately with a job id; the
    /// UI polls <c>jobs/{id}</c> for progress, because a few hundred renders is far longer than a
    /// request should hold open.
    /// </summary>
    [HttpPost("templates/{key:guid}/regenerate")]
    [ProducesResponseType(typeof(JobResponse), StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult RegenerateTemplate(Guid key, [FromBody] BulkRegenerateRequest? request)
    {
        var template = templateService.Get(key);
        if (template is null)
        {
            return Problem(title: "Template not found", detail: $"No template exists with the key {key}.",
                statusCode: StatusCodes.Status404NotFound);
        }

        var documents = regenerationService.FindDocuments(template);
        var job = jobStore.Create(template.Key, template.Name, documents.Count);
        var onlyMissing = request?.OnlyMissing ?? false;

        // Fire and forget onto the thread pool with its own scope: the request's scope - and its
        // database connection - are gone the moment this returns the 202.
        _ = Task.Run(() => RunJobAsync(job.Id, template.Key, documents, onlyMissing));

        return Accepted(JobResponse.From(job));
    }

    [HttpGet("jobs/{id:guid}")]
    [ProducesResponseType(typeof(JobResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetJob(Guid id)
        => jobStore.Get(id) is { } job
            ? Ok(JobResponse.From(job))
            : Problem(title: "Job not found", detail: "That job has finished and been cleared, or never existed.",
                statusCode: StatusCodes.Status404NotFound);

    [HttpPost("jobs/{id:guid}/cancel")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult CancelJob(Guid id)
        => jobStore.Cancel(id) ? Ok() : Problem(title: "Job not found", statusCode: StatusCodes.Status404NotFound);

    /// <summary>Which documents a template covers, and which of them already have an image.</summary>
    [HttpGet("templates/{key:guid}/usage")]
    [ProducesResponseType(typeof(UsageResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetUsage(Guid key, [FromQuery] int take = 200)
    {
        var template = templateService.Get(key);
        if (template is null)
        {
            return Problem(title: "Template not found", statusCode: StatusCodes.Status404NotFound);
        }

        var items = new List<UsageItem>();
        var withImage = 0;

        foreach (var contentKey in regenerationService.FindDocuments(template))
        {
            var content = contentService.GetById(contentKey);
            if (content is null) continue;

            var mediaKey = MediaSource.ResolveMediaKey(content.GetValue<string>(template.TargetPropertyAlias));
            var hasImage = mediaKey is not null && mediaService.GetById(mediaKey.Value) is not null;
            if (hasImage) withImage++;

            if (items.Count < Math.Clamp(take, 1, 1000))
            {
                items.Add(new UsageItem(content.Key, content.Name ?? "(unnamed)", hasImage, content.Published));
            }
        }

        return Ok(new UsageResponse(items.Count, withImage, items));
    }

    private async Task RunJobAsync(Guid jobId, Guid templateKey, IReadOnlyList<Guid> documents, bool onlyMissing)
    {
        var job = jobStore.Get(jobId);
        if (job is null) return;

        job.Status = JobStatus.Running;

        try
        {
            using var scope = scopeFactory.CreateScope();
            var templates = scope.ServiceProvider.GetRequiredService<ITemplateService>();
            var regeneration = scope.ServiceProvider.GetRequiredService<IRegenerationService>();

            var template = templates.Get(templateKey);
            if (template is null)
            {
                job.Status = JobStatus.Failed;
                job.Failures.Add("The template was deleted while the job was running.");
                return;
            }

            foreach (var contentKey in documents)
            {
                if (job.CancellationRequested)
                {
                    job.Status = JobStatus.Cancelled;
                    return;
                }

                // force: false with onlyMissing honours the template's "only when empty" trigger,
                // so "fill in the gaps" does not overwrite hand-picked images.
                var result = await regeneration.RegenerateDocumentAsync(contentKey, template, force: !onlyMissing);

                switch (result.Outcome)
                {
                    case RegenerationOutcome.Generated:
                        job.Generated++;
                        break;

                    case RegenerationOutcome.SkippedExisting:
                    case RegenerationOutcome.NoTemplate:
                        job.Skipped++;
                        break;

                    default:
                        // One bad node must not abandon the rest of the run.
                        job.Failures.Add($"{contentKey}: {result.Message ?? result.Outcome.ToString()}");
                        break;
                }

                job.Processed++;
            }

            job.Status = JobStatus.Completed;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Dynamic Images: bulk regeneration job {JobId} failed", jobId);
            job.Status = JobStatus.Failed;
            job.Failures.Add(ex.Message);
        }
        finally
        {
            job.FinishedUtc = DateTime.UtcNow;
        }
    }
}
