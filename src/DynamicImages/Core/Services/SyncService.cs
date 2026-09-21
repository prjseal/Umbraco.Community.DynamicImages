using System.Text.Json;
using Umbraco.Extensions;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class SyncService(
    ITemplateService templateService,
    ITemplateJsonMigrator migrator,
    IWebHostEnvironment hostEnvironment,
    IOptionsMonitor<DynamicImagesOptions> options,
    ILogger<SyncService> logger) : ISyncService
{
    public SyncStatus GetStatus()
    {
        var folder = TemplateFolder();
        var files = Directory.Exists(folder) ? Directory.GetFiles(folder, "*.json") : [];

        return new SyncStatus(
            options.CurrentValue.Sync.Mode,
            options.CurrentValue.Sync.Folder,
            files.Length,
            files.Length == 0 ? null : files.Max(File.GetLastWriteTimeUtc));
    }

    public async Task<SyncResult> ExportAsync(CancellationToken cancellationToken = default)
    {
        var folder = TemplateFolder();
        Directory.CreateDirectory(folder);

        var messages = new List<string>();
        var written = 0;

        foreach (var template in templateService.GetAll())
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                var path = Path.Combine(folder, $"{template.Alias}.json");
                await File.WriteAllTextAsync(path, JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Indented), cancellationToken);
                written++;
            }
            catch (Exception ex)
            {
                // The exception text carries full server paths on an IO failure, and this list is
                // shown in the backoffice. The log has the detail.
                logger.LogError(ex, "Dynamic Images: could not export template '{Alias}'", template.Alias);
                messages.Add($"{template.Alias}: the file could not be written. See the log for details.");
            }
        }

        return new SyncResult(written, 0, messages);
    }

    public async Task<SyncResult> ImportAsync(Guid? userKey, CancellationToken cancellationToken = default)
    {
        var folder = TemplateFolder();
        if (!Directory.Exists(folder)) return new SyncResult(0, 0, ["No template folder to import from."]);

        var messages = new List<string>();
        var imported = 0;

        foreach (var file in Directory.GetFiles(folder, "*.json"))
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                var template = migrator.Deserialize(await File.ReadAllTextAsync(file, cancellationToken));
                if (template is null)
                {
                    messages.Add($"{Path.GetFileName(file)}: not a readable template.");
                    continue;
                }

                var existing = templateService.GetByAlias(template.Alias);
                if (existing is null)
                {
                    var created = await templateService.CreateAsync(template, userKey, cancellationToken);
                    if (created.Outcome == SaveOutcome.Saved) imported++;
                    else messages.Add($"{template.Alias}: {Describe(created)}");

                    continue;
                }

                // Only newer files win, so importing on every startup does not undo an edit made
                // in the backoffice since the file was written.
                if (template.UpdatedUtc <= existing.UpdatedUtc)
                {
                    continue;
                }

                template.Key = existing.Key;
                var updated = await templateService.UpdateAsync(template, existing.UpdatedUtc, userKey, cancellationToken);
                if (updated.Outcome == SaveOutcome.Saved) imported++;
                else messages.Add($"{template.Alias}: {Describe(updated)}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Dynamic Images: could not import '{File}'", file);
                messages.Add($"{Path.GetFileName(file)}: the file could not be read. See the log for details.");
            }
        }

        return new SyncResult(0, imported, messages);
    }

    private static string Describe(SaveResult result)
        => result.Outcome == SaveOutcome.Invalid
            ? string.Join("; ", result.Validation.Errors.Select(e => e.Message))
            : result.Outcome.ToString();

    private string TemplateFolder()
        => Path.Combine(hostEnvironment.ContentRootPath, options.CurrentValue.Sync.Folder, "templates");
}
