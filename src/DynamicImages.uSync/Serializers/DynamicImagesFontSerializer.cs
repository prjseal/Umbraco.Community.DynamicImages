using System.Globalization;
using System.Text;
using System.Xml.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using uSync.Core;
using uSync.Core.Models;
using uSync.Core.Serialization;

namespace Umbraco.Community.DynamicImages.uSync.Serializers;

/// <summary>
/// Reads and writes a row of DynamicImages_Font as a uSync <c>.config</c> file.
/// <para>
/// uSync resolves serializers as singletons and every Dynamic Images service is scoped, so
/// <see cref="IServiceScopeFactory"/> is injected and a scope is opened per operation rather than
/// the services being constructor-injected - a captive dependency here fails outright when the
/// root provider resolves the collection.
/// </para>
/// <para>
/// <c>CreatedUtc</c> and <c>UpdatedUtc</c> are deliberately absent from the file. uSync detects
/// change by hashing the serialised XML, so a timestamp in it would make every font report as
/// changed the moment it was imported, forever.
/// </para>
/// </summary>
[SyncSerializer(
    DynamicImagesUSyncConstants.SerializerIds.Font,
    "Dynamic Images Font Serializer",
    DynamicImagesUSyncConstants.ItemTypes.Font)]
public class DynamicImagesFontSerializer(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncSerializerRoot<FontDefinition>> logger)
    : SyncSerializerRoot<FontDefinition>(logger), ISyncSerializer<FontDefinition>
{
    public override string ItemAlias(FontDefinition item) => AliasFor(item);

    public override Guid ItemKey(FontDefinition item) => item.Key;

    /// <summary>
    /// <see cref="FontDefinition"/> has no alias column, but uSync needs one for the file name and
    /// for the fallback lookup on import. A slug of family, weight and slant is stable across
    /// environments and readable in a diff: <c>inter-700</c>, <c>inter-400-italic</c>.
    /// </summary>
    public static string AliasFor(FontDefinition font)
    {
        var builder = new StringBuilder();
        var pending = false;

        foreach (var character in font.FamilyName ?? string.Empty)
        {
            if (char.IsLetterOrDigit(character))
            {
                if (pending && builder.Length > 0) builder.Append('-');
                pending = false;
                builder.Append(char.ToLowerInvariant(character));
            }
            else if (builder.Length > 0)
            {
                pending = true;
            }
        }

        if (builder.Length == 0) builder.Append("font");

        builder.Append('-').Append(font.Weight.ToString(CultureInfo.InvariantCulture));
        if (font.IsItalic) builder.Append("-italic");

        return builder.ToString();
    }

    protected override Task<SyncAttempt<XElement>> SerializeCoreAsync(FontDefinition item, SyncSerializerOptions options)
    {
        var node = InitializeBaseNode(item, AliasFor(item));

        node.Add(new XElement("Info",
            new XElement("FamilyName", item.FamilyName),
            new XElement("Weight", item.Weight),
            new XElement("IsItalic", item.IsItalic)));

        node.Add(SerializeSource(item));

        node.Add(new XElement("Styles",
            item.Styles.Select(style => new XElement("Style",
                new XAttribute("Name", style.Name),
                new XAttribute("Size", style.Size.ToString("R", CultureInfo.InvariantCulture)),
                new XAttribute("FontStyle", style.FontStyle)))));

        return Task.FromResult(SyncAttempt<XElement>.Succeed(item.FamilyName, node, ChangeType.Export, []));
    }

    /// <summary>Only the elements the kind actually uses, so a diff is not full of empty tags.</summary>
    private static XElement SerializeSource(FontDefinition item)
    {
        var source = new XElement("Source", new XAttribute("Kind", item.SourceKind.ToString().ToLowerInvariant()));

        switch (item.SourceKind)
        {
            case ImageSourceKind.Media:
                source.Add(new XElement("MediaKey", item.MediaKey?.ToString() ?? string.Empty));
                break;

            case ImageSourceKind.Path:
                source.Add(new XElement("Path", item.Path ?? string.Empty));
                break;

            case ImageSourceKind.Url:
                source.Add(new XElement("Url", item.SourceUrl ?? string.Empty));
                if (!string.IsNullOrEmpty(item.Provider)) source.Add(new XElement("Provider", item.Provider));
                if (!string.IsNullOrEmpty(item.ProviderFamily)) source.Add(new XElement("ProviderFamily", item.ProviderFamily));
                break;
        }

        if (!string.IsNullOrEmpty(item.ContentHash)) source.Add(new XElement("ContentHash", item.ContentHash));

        return source;
    }

    protected override async Task<SyncAttempt<FontDefinition>> DeserializeCoreAsync(XElement node, SyncSerializerOptions options)
    {
        var key = node.Attribute("Key")?.Value is { } value && Guid.TryParse(value, out var parsed)
            ? parsed
            : Guid.Empty;

        if (key == Guid.Empty)
        {
            return SyncAttempt<FontDefinition>.Fail(
                node.Attribute("Alias")?.Value ?? ItemType, ChangeType.ImportFail, "The font node has no Key.");
        }

        var info = node.Element("Info");
        var source = node.Element("Source");

        var font = await FindItemAsync(key) ?? new FontDefinition();
        font.Key = key;
        font.FamilyName = info?.Element("FamilyName")?.Value ?? font.FamilyName;
        font.Weight = ReadInt(info?.Element("Weight")?.Value, font.Weight);
        font.IsItalic = ReadBool(info?.Element("IsItalic")?.Value, font.IsItalic);

        ApplySource(font, source);

        font.Styles = node.Element("Styles")?.Elements("Style").Select(style => new FontStyleDefinition
        {
            Name = style.Attribute("Name")?.Value ?? string.Empty,
            Size = ReadFloat(style.Attribute("Size")?.Value, 0f),
            FontStyle = style.Attribute("FontStyle")?.Value ?? "Regular"
        }).ToList() ?? [];

        using var scope = scopeFactory.CreateScope();
        var fonts = scope.ServiceProvider.GetRequiredService<IFontService>();
        var saved = fonts.Upsert(font);

        // saved: true stops SyncSerializerRoot.DeserializeAsync calling SaveItemAsync again.
        return SyncAttempt<FontDefinition>.Succeed(
            saved.FamilyName, saved, ChangeType.Import, string.Empty, true, []);
    }

    private static void ApplySource(FontDefinition font, XElement? source)
    {
        var kind = source?.Attribute("Kind")?.Value;
        font.SourceKind = kind?.ToLowerInvariant() switch
        {
            "media" => ImageSourceKind.Media,
            "path" => ImageSourceKind.Path,
            "url" => ImageSourceKind.Url,
            _ => font.SourceKind
        };

        // Each kind owns one field; the others are cleared so a font that changed kind between
        // environments does not arrive carrying both.
        font.MediaKey = Guid.TryParse(source?.Element("MediaKey")?.Value, out var mediaKey) ? mediaKey : null;
        font.Path = NullIfEmpty(source?.Element("Path")?.Value);
        font.SourceUrl = NullIfEmpty(source?.Element("Url")?.Value);
        font.Provider = NullIfEmpty(source?.Element("Provider")?.Value);
        font.ProviderFamily = NullIfEmpty(source?.Element("ProviderFamily")?.Value);
        font.ContentHash = NullIfEmpty(source?.Element("ContentHash")?.Value);
    }

    public override async Task<FontDefinition?> FindItemAsync(Guid key)
    {
        using var scope = scopeFactory.CreateScope();
        return await Task.FromResult(scope.ServiceProvider.GetRequiredService<IFontService>().Get(key));
    }

    public override async Task<FontDefinition?> FindItemAsync(string alias)
    {
        using var scope = scopeFactory.CreateScope();
        var fonts = scope.ServiceProvider.GetRequiredService<IFontService>();

        var match = fonts.GetAll().FirstOrDefault(f => string.Equals(AliasFor(f), alias, StringComparison.OrdinalIgnoreCase));
        if (match is not null) return await Task.FromResult<FontDefinition?>(match);

        return await Task.FromResult(Guid.TryParse(alias, out var key) ? fonts.Get(key) : null);
    }

    public override Task SaveItemAsync(FontDefinition item)
    {
        using var scope = scopeFactory.CreateScope();
        scope.ServiceProvider.GetRequiredService<IFontService>().Upsert(item);

        return Task.CompletedTask;
    }

    public override Task DeleteItemAsync(FontDefinition item)
    {
        using var scope = scopeFactory.CreateScope();
        var inUse = scope.ServiceProvider.GetRequiredService<IFontService>().Delete(item.Key);

        // IFontService.Delete refuses rather than breaking the templates that reference the font.
        // Throwing is the honest answer: ImportSingleElementAsync turns it into a failed action
        // in the uSync report, where the alternative is a template that cannot publish.
        if (inUse.Count > 0)
        {
            throw new InvalidOperationException(
                $"The font '{item.FamilyName}' was not deleted: it is still used by {string.Join(", ", inUse.Select(t => t.Name))}.");
        }

        return Task.CompletedTask;
    }

    private static string? NullIfEmpty(string? value) => string.IsNullOrWhiteSpace(value) ? null : value;

    private static int ReadInt(string? value, int fallback)
        => int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed) ? parsed : fallback;

    private static float ReadFloat(string? value, float fallback)
        => float.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var parsed) ? parsed : fallback;

    private static bool ReadBool(string? value, bool fallback)
        => bool.TryParse(value, out var parsed) ? parsed : fallback;
}
