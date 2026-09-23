using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Umbraco.Community.DynamicImages.Persistence.Dtos;

/// <summary>The same shape as <see cref="TemplateFolderDto"/>.</summary>
[TableName(DynamicImagesConstants.FontFamilyTableName)]
[PrimaryKey("id", AutoIncrement = true)]
[ExplicitColumns]
public class FontFamilyDto
{
    [Column("id")]
    [PrimaryKeyColumn(AutoIncrement = true)]
    public int Id { get; set; }

    [Column("key")]
    [Index(IndexTypes.UniqueNonClustered, Name = "IX_DynamicImages_FontFamily_key")]
    public Guid Key { get; set; }

    [Column("name")]
    [Length(255)]
    public string Name { get; set; } = string.Empty;

    /// <summary>The containing folder. Null is the Fonts root.</summary>
    [Column("parentKey")]
    [NullSetting(NullSetting = NullSettings.Null)]
    [Index(IndexTypes.NonClustered, Name = "IX_DynamicImages_FontFamily_parentKey")]
    public Guid? ParentKey { get; set; }

    [Column("sortOrder")]
    [Constraint(Default = "0")]
    public int SortOrder { get; set; }

    [Column("createdUtc")]
    public DateTime CreatedUtc { get; set; }

    [Column("updatedUtc")]
    public DateTime UpdatedUtc { get; set; }
}
