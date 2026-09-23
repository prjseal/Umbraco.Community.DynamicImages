using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Umbraco.Community.DynamicImages.Persistence.Dtos;

[TableName(DynamicImagesConstants.TemplateFolderTableName)]
[PrimaryKey("id", AutoIncrement = true)]
[ExplicitColumns]
public class TemplateFolderDto
{
    [Column("id")]
    [PrimaryKeyColumn(AutoIncrement = true)]
    public int Id { get; set; }

    [Column("key")]
    [Index(IndexTypes.UniqueNonClustered, Name = "IX_DynamicImages_TemplateFolder_key")]
    public Guid Key { get; set; }

    [Column("name")]
    [Length(255)]
    public string Name { get; set; } = string.Empty;

    /// <summary>The containing folder. Null is the Templates root.</summary>
    [Column("parentKey")]
    [NullSetting(NullSetting = NullSettings.Null)]
    [Index(IndexTypes.NonClustered, Name = "IX_DynamicImages_TemplateFolder_parentKey")]
    public Guid? ParentKey { get; set; }

    [Column("sortOrder")]
    [Constraint(Default = "0")]
    public int SortOrder { get; set; }

    [Column("createdUtc")]
    public DateTime CreatedUtc { get; set; }

    [Column("updatedUtc")]
    public DateTime UpdatedUtc { get; set; }
}
