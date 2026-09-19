using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Umbraco.Community.DynamicImages.Persistence.Dtos;

[TableName(DynamicImagesConstants.FontTableName)]
[PrimaryKey("id", AutoIncrement = true)]
[ExplicitColumns]
public class FontDto
{
    [Column("id")]
    [PrimaryKeyColumn(AutoIncrement = true)]
    public int Id { get; set; }

    [Column("key")]
    [Index(IndexTypes.UniqueNonClustered, Name = "IX_DynamicImages_Font_key")]
    public Guid Key { get; set; }

    [Column("familyName")]
    [Length(255)]
    public string FamilyName { get; set; } = string.Empty;

    /// <summary>"media" or "path".</summary>
    [Column("sourceKind")]
    [Length(20)]
    public string SourceKind { get; set; } = "media";

    [Column("mediaKey")]
    [NullSetting(NullSetting = NullSettings.Null)]
    public Guid? MediaKey { get; set; }

    /// <summary>wwwroot-relative path, validated on save so it cannot escape the web root.</summary>
    [Column("path")]
    [Length(500)]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? Path { get; set; }

    [Column("weight")]
    public int Weight { get; set; } = 400;

    [Column("isItalic")]
    public bool IsItalic { get; set; }

    /// <summary>Named styles as JSON: [{ "name": "Title", "size": 56, "fontStyle": "Regular" }].</summary>
    [Column("stylesJson")]
    [SpecialDbType(SpecialDbTypes.NVARCHARMAX)]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? StylesJson { get; set; }

    /// <summary>Hash of the font file, used as the ETag on the client font endpoint.</summary>
    [Column("contentHash")]
    [Length(64)]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? ContentHash { get; set; }

    [Column("createdUtc")]
    public DateTime CreatedUtc { get; set; }

    [Column("updatedUtc")]
    public DateTime UpdatedUtc { get; set; }
}
