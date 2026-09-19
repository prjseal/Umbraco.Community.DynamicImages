using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Migrations;

public class CreateTemplatesTable(IMigrationContext context) : AsyncMigrationBase(context)
{
    protected override Task MigrateAsync()
    {
        if (!TableExists(DynamicImagesConstants.TemplateTableName))
            Create.Table<TemplateDto>().Do();

        return Task.CompletedTask;
    }
}
