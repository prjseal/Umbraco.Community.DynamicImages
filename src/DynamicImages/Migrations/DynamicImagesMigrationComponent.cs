using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;

namespace Umbraco.Community.DynamicImages.Migrations;

/// <summary>
/// Runs the package's migrations on startup. Follows the same shape - and the same
/// "no connection string yet" guard - as the other packages in this solution, so installing into a
/// site that has not been through the installer does not throw.
/// </summary>
public class DynamicImagesMigrationComponent(
    ICoreScopeProvider coreScopeProvider,
    IMigrationPlanExecutor migrationPlanExecutor,
    IKeyValueService keyValueService,
    ILogger<DynamicImagesMigrationComponent> logger) : IAsyncComponent
{
    public async Task InitializeAsync(bool isRestarting, CancellationToken cancellationToken)
    {
        var plan = new MigrationPlan("DynamicImages");
        plan.From(string.Empty)
            .To<CreateTemplatesTable>("dynamicimages-templates-v1")
            .To<CreateFontsTable>("dynamicimages-fonts-v1")
            .To<EnsureFontMediaType>("dynamicimages-fontmediatype-v1")
            .To<AddWebFontColumns>("dynamicimages-fonts-v2")
            .To<GrantSectionToAdministrators>("dynamicimages-adminsection-v1");

        var upgrader = new Upgrader(plan);
        try
        {
            await upgrader.ExecuteAsync(migrationPlanExecutor, coreScopeProvider, keyValueService);
        }
        catch (InvalidOperationException ex)
            when (ex.Message.Contains("connection string", StringComparison.OrdinalIgnoreCase))
        {
            logger.LogWarning("Skipping Dynamic Images migrations - the database is not configured yet.");
        }
    }

    public Task TerminateAsync(bool isRestarting, CancellationToken cancellationToken) => Task.CompletedTask;
}
