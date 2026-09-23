using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Umbraco.Cms.Core.Security;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Services;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

public class TemplatesController(
    ITemplateService templateService,
    ITemplateJsonMigrator migrator,
    IBackOfficeSecurityAccessor backOfficeSecurityAccessor) : DynamicImagesControllerBase
{
    [HttpGet("templates")]
    [ProducesResponseType(typeof(TemplateListResponse), StatusCodes.Status200OK)]
    public IActionResult GetAll([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        var all = templateService.GetAll();

        var items = all
            .Skip(Math.Max(0, skip))
            .Take(Math.Clamp(take, 1, 500))
            .Select(Summarise)
            .ToList();

        return Ok(new TemplateListResponse(all.Count, items));
    }

    [HttpGet("templates/{key:guid}")]
    [ProducesResponseType(typeof(Template), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Get(Guid key)
        => templateService.Get(key) is { } template ? Ok(template) : TemplateNotFound(key);

    [HttpPost("templates")]
    [RequestSizeLimit(PreviewController.MaxTemplateBytes)]
    [ProducesResponseType(typeof(TemplateSaveResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] Template template, CancellationToken cancellationToken)
    {
        var result = await templateService.CreateAsync(template, CurrentUserKey(backOfficeSecurityAccessor), cancellationToken);

        return result.Outcome switch
        {
            SaveOutcome.Saved => Created(
                $"templates/{result.Template!.Key}",
                new TemplateSaveResponse(result.Template, Warnings(result))),

            SaveOutcome.AliasInUse => AliasConflict(template.Alias),

            _ => ValidationProblemFor(result)
        };
    }

    [HttpPut("templates/{key:guid}")]
    [RequestSizeLimit(PreviewController.MaxTemplateBytes)]
    [ProducesResponseType(typeof(TemplateSaveResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
    public async Task<IActionResult> Update(Guid key, [FromBody] Template template, CancellationToken cancellationToken)
    {
        template.Key = key;

        // UpdatedUtc arrives as the client last saw it; the service refuses the write when the
        // stored row has moved on since.
        var result = await templateService.UpdateAsync(
            template, template.UpdatedUtc, CurrentUserKey(backOfficeSecurityAccessor), cancellationToken);

        return result.Outcome switch
        {
            SaveOutcome.Saved => Ok(new TemplateSaveResponse(result.Template!, Warnings(result))),

            SaveOutcome.NotFound => TemplateNotFound(key),

            SaveOutcome.Conflict => Problem(
                title: "This template was changed elsewhere",
                detail: "Someone else saved this template after you opened it. Reload to see their changes before saving again.",
                statusCode: StatusCodes.Status412PreconditionFailed),

            SaveOutcome.AliasInUse => AliasConflict(template.Alias),

            _ => ValidationProblemFor(result)
        };
    }

    [HttpDelete("templates/{key:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Delete(Guid key)
        => templateService.Delete(key) ? Ok() : TemplateNotFound(key);

    /// <summary>
    /// Copies a template into the folder <see cref="DuplicateRequest.TargetKey"/> names, or the
    /// root when it is null. No body at all keeps the copy beside the original, which is what
    /// this endpoint did before Duplicate to existed.
    /// </summary>
    [HttpPost("templates/{key:guid}/duplicate")]
    [ProducesResponseType(typeof(TemplateSaveResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Duplicate(
        Guid key,
        [FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Allow)] DuplicateRequest? request,
        CancellationToken cancellationToken)
    {
        var source = templateService.Get(key);
        if (source is null) return TemplateNotFound(key);

        var targetKey = request is null ? source.ParentKey : request.TargetKey;
        var result = await templateService.DuplicateAsync(key, targetKey, CurrentUserKey(backOfficeSecurityAccessor), cancellationToken);

        return DuplicateResult(result, key);
    }

    private IActionResult DuplicateResult(SaveResult result, Guid key) => result.Outcome switch
    {
        SaveOutcome.Saved => Created($"templates/{result.Template!.Key}", new TemplateSaveResponse(result.Template, Warnings(result))),
        SaveOutcome.NotFound => TemplateNotFound(key),
        SaveOutcome.TargetNotFound => Problem(title: "The target folder was not found",
            detail: "Choose the Templates root or an existing folder.", statusCode: StatusCodes.Status400BadRequest),
        _ => ValidationProblemFor(result)
    };

    [HttpGet("templates/{key:guid}/export")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Export(Guid key)
    {
        var template = templateService.Get(key);
        if (template is null) return TemplateNotFound(key);

        // Indented, and as a download: this is the file someone commits or pastes into another
        // environment, not something the UI parses.
        var json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Indented);

        return File(System.Text.Encoding.UTF8.GetBytes(json), "application/json", $"{template.Alias}.json");
    }

    [HttpPost("templates/import")]
    [RequestSizeLimit(PreviewController.MaxTemplateBytes)]
    [ProducesResponseType(typeof(TemplateSaveResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Import([FromBody] TemplateImportRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Json))
        {
            return Problem(title: "Nothing to import", detail: "Paste a template.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        Template? template;
        try
        {
            template = migrator.Deserialize(request.Json);
        }
        catch (JsonException)
        {
            return UnreadableJson();
        }
        catch (InvalidOperationException ex)
        {
            return Problem(title: "Unsupported template", detail: ex.Message, statusCode: StatusCodes.Status400BadRequest);
        }

        if (template is null) return UnreadableJson();

        var overwrite = string.Equals(request.Mode, "overwrite", StringComparison.OrdinalIgnoreCase);
        var existing = templateService.GetByAlias(template.Alias);

        if (existing is not null && !overwrite)
        {
            // A fresh key and alias, so importing twice gives two templates rather than an error.
            template.Key = Guid.NewGuid();
            template.Alias = templateService.SuggestAlias(template.Name);
            template.Name = $"{template.Name} (imported)";
        }
        else if (existing is not null)
        {
            template.Key = existing.Key;

            var updated = await templateService.UpdateAsync(
                template, existing.UpdatedUtc, CurrentUserKey(backOfficeSecurityAccessor), cancellationToken);

            return updated.Outcome == SaveOutcome.Saved
                ? Ok(new TemplateSaveResponse(updated.Template!, Warnings(updated)))
                : ValidationProblemFor(updated);
        }
        else
        {
            template.Key = Guid.NewGuid();
        }

        // Into the folder the import was started from. Whatever parent the file carries names a
        // folder in the environment it was exported from, which may not exist here.
        template.ParentKey = request.ParentKey;

        var created = await templateService.CreateAsync(template, CurrentUserKey(backOfficeSecurityAccessor), cancellationToken);

        return created.Outcome == SaveOutcome.Saved
            ? Created($"templates/{created.Template!.Key}", new TemplateSaveResponse(created.Template, Warnings(created)))
            : ValidationProblemFor(created);
    }

    private static TemplateSummary Summarise(Template template) => new(
        template.Key,
        template.Alias,
        template.Name,
        template.IsEnabled,
        template.DocTypeAliases,
        template.TargetPropertyAlias,
        template.Layers.Count,
        template.Canvas.Width,
        template.Canvas.Height,
        template.UpdatedUtc);

    private static IReadOnlyList<ValidationIssue> Warnings(SaveResult result)
        => result.Validation.Issues.Where(i => i.Severity == ValidationSeverity.Warning).ToList();

    private IActionResult TemplateNotFound(Guid key)
        => Problem(title: "Template not found", detail: $"No template exists with the key {key}.",
            statusCode: StatusCodes.Status404NotFound);

    private IActionResult AliasConflict(string alias)
        => Problem(title: "That alias is taken", detail: $"Another template already uses the alias '{alias}'.",
            statusCode: StatusCodes.Status400BadRequest);

    private IActionResult UnreadableJson()
        => Problem(title: "Unreadable JSON", detail: "That does not look like a Dynamic Images template.",
            statusCode: StatusCodes.Status400BadRequest);

    private IActionResult ValidationProblemFor(SaveResult result)
        => Problem(
            title: "The template is not valid",
            detail: string.Join(" ", result.Validation.Errors.Select(e => e.Message)),
            statusCode: StatusCodes.Status400BadRequest);
}
