using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Migrations;

/// <summary>
/// Adds the three nullable web-font columns to the font table. The ColumnExists guard is not
/// defensive: on a fresh install CreateFontsTable's Create.Table&lt;FontDto&gt;() already made them.
/// </summary>
public class AddWebFontColumns(IMigrationContext context) : AsyncMigrationBase(context)
{
    private static readonly string[] Columns = ["sourceUrl", "provider", "providerFamily"];

    protected override Task MigrateAsync()
    {
        if (!TableExists(DynamicImagesConstants.FontTableName)) return Task.CompletedTask;

        foreach (var column in Columns)
        {
            if (!ColumnExists(DynamicImagesConstants.FontTableName, column))
                AddColumn<FontDto>(column);
        }

        return Task.CompletedTask;
    }
}
