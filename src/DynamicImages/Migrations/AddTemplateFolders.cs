using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Migrations;

/// <summary>
/// Folders for the Templates tree: a folder table, and a parent and sort order on every template.
/// <para>
/// Nothing is backfilled. A null <c>parentKey</c> is "directly under the Templates root", which is
/// exactly where every existing template already appears. The ColumnExists guards are not
/// defensive: on a fresh install CreateTemplatesTable's Create.Table&lt;TemplateDto&gt;() has already
/// made both columns and the index.
/// </para>
/// </summary>
public class AddTemplateFolders(IMigrationContext context) : AsyncMigrationBase(context)
{
    private const string ParentIndexName = "IX_DynamicImages_Template_parentKey";

    protected override Task MigrateAsync()
    {
        if (!TableExists(DynamicImagesConstants.TemplateFolderTableName))
            Create.Table<TemplateFolderDto>().Do();

        if (!TableExists(DynamicImagesConstants.TemplateTableName)) return Task.CompletedTask;

        if (!ColumnExists(DynamicImagesConstants.TemplateTableName, "parentKey"))
            AddColumn<TemplateDto>("parentKey");

        if (!ColumnExists(DynamicImagesConstants.TemplateTableName, "sortOrder"))
            AddColumn<TemplateDto>("sortOrder");

        if (!IndexExists(ParentIndexName))
        {
            Create.Index(ParentIndexName)
                .OnTable(DynamicImagesConstants.TemplateTableName)
                .OnColumn("parentKey").Ascending()
                .WithOptions().NonClustered()
                .Do();
        }

        return Task.CompletedTask;
    }
}
