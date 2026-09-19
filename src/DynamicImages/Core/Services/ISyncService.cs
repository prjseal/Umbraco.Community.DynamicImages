using Umbraco.Community.DynamicImages.Configuration;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed record SyncStatus(SyncMode Mode, string Folder, int FileCount, DateTime? LastWriteUtc);

public sealed record SyncResult(int Written, int Imported, IReadOnlyList<string> Messages);

/// <summary>
/// Moves templates between the database and JSON files on disk, so they can be committed to
/// source control and travel between environments. The alternative - an Umbraco Deploy
/// IServiceConnector - is deferred to a later version.
/// </summary>
public interface ISyncService
{
    SyncStatus GetStatus();

    /// <summary>Writes every template to <c>{folder}/templates/{alias}.json</c>.</summary>
    Task<SyncResult> ExportAsync(CancellationToken cancellationToken = default);

    /// <summary>Upserts templates from those files, matching on alias.</summary>
    Task<SyncResult> ImportAsync(Guid? userKey, CancellationToken cancellationToken = default);
}
