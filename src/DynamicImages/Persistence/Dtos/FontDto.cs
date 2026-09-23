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

    /// <summary>"media", "path" or "url".</summary>
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

    // The three web-font columns are nullable on purpose: AddColumn<T> copies this definition, and
    // a NOT NULL add fails on a table that already has rows.

    /// <summary>The font file's URL for a "url" font.</summary>
    [Column("sourceUrl")]
    [Length(2000)]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? SourceUrl { get; set; }

    /// <summary>"google", "bunny" or "direct" for a "url" font.</summary>
    [Column("provider")]
    [Length(20)]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? Provider { get; set; }

    /// <summary>The family as typed into the provider picker, for re-resolving on refresh.</summary>
    [Column("providerFamily")]
    [Length(255)]
    [NullSetting(NullSetting = NullSettings.Null)]
    public string? ProviderFamily { get; set; }

    /// <summary>
    /// The DynamicImages_FontFamily row. Nullable because AddColumn&lt;T&gt; copies this definition
    /// onto a table that already has rows; the migration adding it backfills every row.
    /// </summary>
    [Column("familyKey")]
    [NullSetting(NullSetting = NullSettings.Null)]
    [Index(IndexTypes.NonClustered, Name = "IX_DynamicImages_Font_familyKey")]
    public Guid? FamilyKey { get; set; }

    [Column("sortOrder")]
    [Constraint(Default = "0")]
    public int SortOrder { get; set; }

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
