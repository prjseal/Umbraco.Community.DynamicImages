using System.Globalization;
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
/// Reads and writes a row of DynamicImages_FontFamily as a uSync <c>.config</c> file: its name,
/// folder and place there. Its variants are font rows, each in its own file naming the family by
/// key. <c>Level</c> is the family's depth, so its folders come first; a folder that is still
/// missing puts the family at the root, as <see cref="IFontService.UpsertFamily"/> does.
/// </summary>
[SyncSerializer(
    DynamicImagesUSyncConstants.SerializerIds.FontFamily,
    "Dynamic Images Font Family Serializer",
    DynamicImagesUSyncConstants.ItemTypes.FontFamily)]
public class DynamicImagesFontFamilySerializer(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncSerializerRoot<FontFamily>> logger)
    : SyncSerializerRoot<FontFamily>(logger), ISyncSerializer<FontFamily>
{
    public override string ItemAlias(FontFamily item) => item.Key.ToString();

    public override Guid ItemKey(FontFamily item) => item.Key;

    protected override Task<SyncAttempt<XElement>> SerializeCoreAsync(FontFamily item, SyncSerializerOptions options)
    {
        using var scope = scopeFactory.CreateScope();
        var tree = scope.ServiceProvider.GetRequiredService<IFontFolderService>().GetTree();

        var parent = item.ParentKey is { } parentKey && tree.FolderExists(parentKey) ? parentKey : (Guid?)null;
        var node = InitializeBaseNode(item, ItemAlias(item), tree.DepthOf(item.Key));

        node.Add(new XElement("Info",
            new XElement("Name", item.Name),
            new XElement("Parent", parent?.ToString() ?? string.Empty),
            new XElement("SortOrder", item.SortOrder.ToString(CultureInfo.InvariantCulture))));

        return Task.FromResult(SyncAttempt<XElement>.Succeed(item.Name, node, ChangeType.Export, []));
    }

    protected override Task<SyncAttempt<FontFamily>> DeserializeCoreAsync(XElement node, SyncSerializerOptions options)
    {
        var key = node.Attribute("Key")?.Value is { } value && Guid.TryParse(value, out var parsed) ? parsed : Guid.Empty;
        var info = node.Element("Info");
        var name = info?.Element("Name")?.Value ?? string.Empty;

        if (key == Guid.Empty)
        {
            return Task.FromResult(SyncAttempt<FontFamily>.Fail(
                string.IsNullOrEmpty(name) ? ItemType : name, ChangeType.ImportFail, "The font family node has no Key."));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            return Task.FromResult(SyncAttempt<FontFamily>.Fail(ItemType, ChangeType.ImportFail, "The font family node has no Name."));
        }

        using var scope = scopeFactory.CreateScope();
        var saved = scope.ServiceProvider.GetRequiredService<IFontService>().UpsertFamily(new FontFamily
        {
            Key = key,
            Name = name.Trim(),
            ParentKey = Guid.TryParse(info?.Element("Parent")?.Value, out var parentKey) ? parentKey : null,
            SortOrder = int.TryParse(info?.Element("SortOrder")?.Value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var sort) ? sort : 0
        });

        // saved: true stops SyncSerializerRoot.DeserializeAsync calling SaveItemAsync again.
        return Task.FromResult(SyncAttempt<FontFamily>.Succeed(saved.Name, saved, ChangeType.Import, string.Empty, true, []));
    }

    public override Task<FontFamily?> FindItemAsync(Guid key)
    {
        using var scope = scopeFactory.CreateScope();
        return Task.FromResult(scope.ServiceProvider.GetRequiredService<IFontService>().GetFamily(key));
    }

    /// <summary>A family's alias is its key, so this is a key lookup.</summary>
    public override Task<FontFamily?> FindItemAsync(string alias)
        => Guid.TryParse(alias, out var key) ? FindItemAsync(key) : Task.FromResult<FontFamily?>(null);

    public override Task SaveItemAsync(FontFamily item)
    {
        using var scope = scopeFactory.CreateScope();
        scope.ServiceProvider.GetRequiredService<IFontService>().UpsertFamily(item);

        return Task.CompletedTask;
    }

    public override Task DeleteItemAsync(FontFamily item)
    {
        using var scope = scopeFactory.CreateScope();
        var result = scope.ServiceProvider.GetRequiredService<IFontService>().DeleteFamily(item.Key);

        // As for a single font: refusing is the honest answer, and uSync reports the throw as a failed action.
        if (result.Outcome == TreeOperationOutcome.InUse)
        {
            throw new InvalidOperationException(
                $"The font family '{item.Name}' was not deleted: {string.Join(", ", result.InUse.Select(t => $"'{t.Name}'"))} still use it.");
        }

        return Task.CompletedTask;
    }
}
