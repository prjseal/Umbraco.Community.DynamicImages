using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Umbraco.Community.DynamicImages.Persistence.Dtos;

[TableName(DynamicImagesConstants.TemplateTableName)]
[PrimaryKey("id", AutoIncrement = true)]
[ExplicitColumns]
public class TemplateDto
{
    [Column("id")]
    [PrimaryKeyColumn(AutoIncrement = true)]
    public int Id { get; set; }

    [Column("key")]
    [Index(IndexTypes.UniqueNonClustered, Name = "IX_DynamicImages_Template_key")]
    public Guid Key { get; set; }

    [Column("alias")]
    [Length(255)]
    [Index(IndexTypes.UniqueNonClustered, Name = "IX_DynamicImages_Template_alias")]
    public string Alias { get; set; } = string.Empty;

    [Column("name")]
    [Length(255)]
    public string Name { get; set; } = string.Empty;

    [Column("isEnabled")]
    public bool IsEnabled { get; set; }

    [Column("schemaVersion")]
    public int SchemaVersion { get; set; }

    /// <summary>The whole template document. One row, one JSON blob - see headline decision 1.</summary>
    [Column("json")]
    [SpecialDbType(SpecialDbTypes.NVARCHARMAX)]
    public string Json { get; set; } = string.Empty;

    /// <summary>
    /// Denormalised copy of Template.DocTypeAliases as a comma-delimited list, so the publish
    /// handler can find candidate templates without deserialising every row.
    /// </summary>
    [Column("docTypeAliases")]
    [Length(1000)]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? DocTypeAliases { get; set; }

    /// <summary>
    /// The folder the template sits in. Null is the Templates root, which is where every template
    /// that existed before folders did still is - so the migration adding this has nothing to
    /// backfill. Nullable also because AddColumn&lt;T&gt; copies this definition onto a table that
    /// already has rows.
    /// </summary>
    [Column("parentKey")]
    [NullSetting(NullSetting = NullSettings.Null)]
    [Index(IndexTypes.NonClustered, Name = "IX_DynamicImages_Template_parentKey")]
    public Guid? ParentKey { get; set; }

    /// <summary>
    /// Its place among its siblings, set by the tree's Sort action and by appending on create and
    /// move. Rows from before sorting are all 0, which orders them folders first, then by name.
    /// </summary>
    [Column("sortOrder")]
    [Constraint(Default = "0")]
    public int SortOrder { get; set; }

    [Column("createdUtc")]
    public DateTime CreatedUtc { get; set; }

    [Column("updatedUtc")]
    public DateTime UpdatedUtc { get; set; }

    [Column("updatedByUserKey")]
    [NullSetting(NullSetting = NullSettings.Null)]
    public Guid? UpdatedByUserKey { get; set; }
}
