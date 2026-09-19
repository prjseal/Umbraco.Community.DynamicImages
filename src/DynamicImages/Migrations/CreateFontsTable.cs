using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Migrations;

public class CreateFontsTable(IMigrationContext context) : AsyncMigrationBase(context)
{
    protected override Task MigrateAsync()
    {
        if (!TableExists(DynamicImagesConstants.FontTableName))
            Create.Table<FontDto>().Do();

        return Task.CompletedTask;
    }
}
