using System.Text.Json;
using Umbraco.Extensions;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class SyncService(
    ITemplateService templateService,
    ITemplateFolderService folderService,
    ITemplateJsonMigrator migrator,
    IWebHostEnvironment hostEnvironment,
    IOptionsMonitor<DynamicImagesOptions> options,
    ILogger<SyncService> logger) : ISyncService
{
    public SyncStatus GetStatus()
    {
        var folder = TemplateFolder();
        var files = Directory.Exists(folder)
            ? Directory.GetFiles(folder, "*.json")
                .Where(f => !string.Equals(Path.GetFileName(f), FoldersFileName, StringComparison.OrdinalIgnoreCase))
                .ToArray()
            : [];

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

        // Folders are one file beside the templates: they are few, and a template's parentKey
        // (which rides in its own JSON) means nothing without them.
        try
        {
            var folders = folderService.GetAll()
                .Select(f => new FolderFile(f.Key, f.Name, f.ParentKey, f.SortOrder))
                .ToList();
            await File.WriteAllTextAsync(Path.Combine(folder, FoldersFileName),
                JsonSerializer.Serialize(folders, DynamicImagesJsonOptions.Indented), cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Dynamic Images: could not export the template folders");
            messages.Add($"{FoldersFileName}: the file could not be written. See the log for details.");
        }

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

        await ImportFoldersAsync(folder, messages, cancellationToken);

        foreach (var file in Directory.GetFiles(folder, "*.json"))
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (string.Equals(Path.GetFileName(file), FoldersFileName, StringComparison.OrdinalIgnoreCase)) continue;

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
                var fileParent = template.ParentKey;
                var updated = await templateService.UpdateAsync(template, existing.UpdatedUtc, userKey, cancellationToken);
                if (updated.Outcome == SaveOutcome.Saved)
                {
                    imported++;

                    // An update keeps the stored folder, so a file that moved has to be moved.
                    if (fileParent != existing.ParentKey)
                    {
                        var target = fileParent is { } parent && folderService.Get(parent) is not null ? parent : (Guid?)null;
                        await templateService.MoveAsync(existing.Key, target, cancellationToken);
                    }
                }
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

    private const string FoldersFileName = "folders.json";

    private sealed record FolderFile(Guid Key, string Name, Guid? ParentKey, int SortOrder);

    /// <summary>
    /// Upserts every folder in <c>folders.json</c>, parents before children so a nested folder's
    /// parent exists by the time it arrives. One the file places under a missing parent lands at
    /// the root, as <see cref="ITemplateFolderService.Upsert"/> does.
    /// </summary>
    private async Task ImportFoldersAsync(string folder, List<string> messages, CancellationToken cancellationToken)
    {
        var path = Path.Combine(folder, FoldersFileName);
        if (!File.Exists(path)) return;

        try
        {
            var folders = JsonSerializer.Deserialize<List<FolderFile>>(
                await File.ReadAllTextAsync(path, cancellationToken), DynamicImagesJsonOptions.Default) ?? [];

            var byKey = folders.ToDictionary(f => f.Key);
            int Depth(FolderFile f)
            {
                var depth = 0;
                var seen = new HashSet<Guid>();
                for (var p = f.ParentKey; p is { } k && seen.Add(k) && byKey.TryGetValue(k, out var next); p = next.ParentKey) depth++;
                return depth;
            }

            foreach (var file in folders.OrderBy(Depth))
            {
                folderService.Upsert(new TemplateFolder
                {
                    Key = file.Key, Name = file.Name, ParentKey = file.ParentKey, SortOrder = file.SortOrder
                });
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Dynamic Images: could not import the template folders");
            messages.Add($"{FoldersFileName}: the file could not be read. See the log for details.");
        }
    }

    private static string Describe(SaveResult result)
        => result.Outcome == SaveOutcome.Invalid
            ? string.Join("; ", result.Validation.Errors.Select(e => e.Message))
            : result.Outcome.ToString();

    private string TemplateFolder()
        => Path.Combine(hostEnvironment.ContentRootPath, options.CurrentValue.Sync.Folder, "templates");
}
