using System.Text.Json;
using NPoco;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Persistence.Dtos;

namespace Umbraco.Community.DynamicImages.Persistence;

public sealed class FontRepository(IScopeProvider scopeProvider) : IFontRepository
{
    public IReadOnlyList<FontDefinition> GetAll()
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        return scope.Database
            .Fetch<FontDto>(new Sql().Select("*").From(DynamicImagesConstants.FontTableName).OrderBy("familyName"))
            .Select(Map)
            .ToList();
    }

    public FontDefinition? Get(Guid key)
    {
        using var scope = scopeProvider.CreateScope(autoComplete: true);
        var dto = scope.Database.FirstOrDefault<FontDto>(
            new Sql().Select("*").From(DynamicImagesConstants.FontTableName).Where("[key] = @0", key));

        return dto is null ? null : Map(dto);
    }

    public FontDefinition Insert(FontDefinition font)
    {
        var now = DateTime.UtcNow;
        font.CreatedUtc = now;
        font.UpdatedUtc = now;

        using var scope = scopeProvider.CreateScope();
        scope.Database.Insert(ToDto(font));
        scope.Complete();

        return font;
    }

    public FontDefinition? Update(FontDefinition font)
    {
        using var scope = scopeProvider.CreateScope();
        var existing = scope.Database.FirstOrDefault<FontDto>(
            new Sql().Select("*").From(DynamicImagesConstants.FontTableName).Where("[key] = @0", font.Key));

        if (existing is null)
        {
            scope.Complete();
            return null;
        }

        font.CreatedUtc = existing.CreatedUtc;
        font.UpdatedUtc = DateTime.UtcNow;

        var dto = ToDto(font);
        dto.Id = existing.Id;

        scope.Database.Update(dto);
        scope.Complete();

        return font;
    }

    public bool Delete(Guid key)
    {
        using var scope = scopeProvider.CreateScope();
        var deleted = scope.Database.Execute(
            $"DELETE FROM {DynamicImagesConstants.FontTableName} WHERE [key] = @0", key);
        scope.Complete();

        return deleted > 0;
    }

    private static FontDto ToDto(FontDefinition font) => new()
    {
        Key = font.Key,
        FamilyName = font.FamilyName,
        SourceKind = font.SourceKind == ImageSourceKind.Path ? "path" : "media",
        MediaKey = font.MediaKey,
        Path = font.Path,
        Weight = font.Weight,
        IsItalic = font.IsItalic,
        StylesJson = JsonSerializer.Serialize(font.Styles, DynamicImagesJsonOptions.Default),
        ContentHash = font.ContentHash,
        CreatedUtc = font.CreatedUtc,
        UpdatedUtc = font.UpdatedUtc
    };

    private static FontDefinition Map(FontDto dto) => new()
    {
        Key = dto.Key,
        FamilyName = dto.FamilyName,
        SourceKind = string.Equals(dto.SourceKind, "path", StringComparison.OrdinalIgnoreCase)
            ? ImageSourceKind.Path
            : ImageSourceKind.Media,
        MediaKey = dto.MediaKey,
        Path = dto.Path,
        Weight = dto.Weight,
        IsItalic = dto.IsItalic,
        Styles = Deserialize(dto.StylesJson),
        ContentHash = dto.ContentHash,
        CreatedUtc = dto.CreatedUtc,
        UpdatedUtc = dto.UpdatedUtc
    };

    private static List<FontStyleDefinition> Deserialize(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return [];

        try
        {
            return JsonSerializer.Deserialize<List<FontStyleDefinition>>(json, DynamicImagesJsonOptions.Default) ?? [];
        }
        catch (JsonException)
        {
            // A malformed styles blob costs the named styles, not the font itself.
            return [];
        }
    }
}
