using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

public class HealthController(IHealthService healthService, ISyncService syncService) : DynamicImagesControllerBase
{
    [HttpGet("health")]
    [ProducesResponseType(typeof(HealthReport), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
        => Ok(await healthService.CheckAsync(cancellationToken));

    [HttpGet("sync/status")]
    [ProducesResponseType(typeof(SyncStatusResponse), StatusCodes.Status200OK)]
    public IActionResult SyncStatus()
    {
        var status = syncService.GetStatus();

        return Ok(new SyncStatusResponse(
            status.Mode.ToString().ToLowerInvariant(), status.Folder, status.FileCount, status.LastWriteUtc));
    }

    [HttpPost("sync/export")]
    [ProducesResponseType(typeof(SyncRunResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> SyncExport(CancellationToken cancellationToken)
    {
        var result = await syncService.ExportAsync(cancellationToken);
        return Ok(new SyncRunResponse(result.Written, result.Imported, result.Messages));
    }

    [HttpPost("sync/import")]
    [ProducesResponseType(typeof(SyncRunResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> SyncImport(CancellationToken cancellationToken)
    {
        var result = await syncService.ImportAsync(userKey: null, cancellationToken);
        return Ok(new SyncRunResponse(result.Written, result.Imported, result.Messages));
    }
}
