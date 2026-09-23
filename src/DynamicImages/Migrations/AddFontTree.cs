using NPoco;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Migrations;

/// <summary>
/// The Fonts tree: a folder table, a family table, and a family and sort order on every font row.
/// <para>
/// Every existing row is given a family: rows are grouped by family name (trimmed, ignoring case)
/// and one family per group is created at the root. Templates reference font rows, not families,
/// so nothing that renders changes. The guards are not defensive: on a fresh install
/// CreateFontsTable's Create.Table&lt;FontDto&gt;() has already made the columns and the index.
/// </para>
/// </summary>
public class AddFontTree(IMigrationContext context) : AsyncMigrationBase(context)
{
    private const string FamilyIndexName = "IX_DynamicImages_Font_familyKey";

    protected override Task MigrateAsync()
    {
        if (!TableExists(DynamicImagesConstants.FontFolderTableName))
            Create.Table<FontFolderDto>().Do();

        if (!TableExists(DynamicImagesConstants.FontFamilyTableName))
            Create.Table<FontFamilyDto>().Do();

        if (!TableExists(DynamicImagesConstants.FontTableName)) return Task.CompletedTask;

        if (!ColumnExists(DynamicImagesConstants.FontTableName, "familyKey"))
            AddColumn<FontDto>("familyKey");

        if (!ColumnExists(DynamicImagesConstants.FontTableName, "sortOrder"))
            AddColumn<FontDto>("sortOrder");

        if (!IndexExists(FamilyIndexName))
        {
            Create.Index(FamilyIndexName)
                .OnTable(DynamicImagesConstants.FontTableName)
                .OnColumn("familyKey").Ascending()
                .WithOptions().NonClustered()
                .Do();
        }

        Backfill();

        return Task.CompletedTask;
    }

    private void Backfill()
    {
        var orphans = Database.Fetch<FontDto>(
            new Sql().Select("*").From(DynamicImagesConstants.FontTableName).Where("familyKey IS NULL").OrderBy("id"));
        if (orphans.Count == 0) return;

        var now = DateTime.UtcNow;

        foreach (var group in FontFamilyGrouping.Group(orphans.Select(o => (o.Key, (string?)o.FamilyName))))
        {
            var family = new FontFamilyDto
            {
                Key = Guid.NewGuid(),
                Name = group.Name,
                // All 0, so the backfilled families read alphabetically until someone sorts them.
                SortOrder = 0,
                CreatedUtc = now,
                UpdatedUtc = now
            };
            Database.Insert(family);

            // One statement per row rather than an IN list: a site has a handful of fonts, and
            // this keeps clear of every provider's parameter limit.
            foreach (var fontKey in group.FontKeys)
            {
                Database.Execute(
                    $"UPDATE {DynamicImagesConstants.FontTableName} SET familyKey = @0, familyName = @1 WHERE [key] = @2",
                    family.Key, family.Name, fontKey);
            }
        }
    }
}
