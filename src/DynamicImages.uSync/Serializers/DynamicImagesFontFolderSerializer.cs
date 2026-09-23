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
/// Reads and writes a row of DynamicImages_FontFolder as a uSync <c>.config</c> file.
/// <para>
/// <c>Level</c> is the folder's depth, so uSync imports a parent before its children. A parent
/// that is still missing when a folder arrives puts the folder at the root rather than failing,
/// as <see cref="IFontFolderService.Upsert"/> does. Timestamps are left out of the file for
/// the same reason the other serializers leave them out: uSync hashes the XML to detect change.
/// </para>
/// </summary>
[SyncSerializer(
    DynamicImagesUSyncConstants.SerializerIds.FontFolder,
    "Dynamic Images Font Folder Serializer",
    DynamicImagesUSyncConstants.ItemTypes.FontFolder)]
public class DynamicImagesFontFolderSerializer(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncSerializerRoot<FontFolder>> logger)
    : SyncSerializerRoot<FontFolder>(logger), ISyncSerializer<FontFolder>
{
    public override string ItemAlias(FontFolder item) => item.Key.ToString();

    public override Guid ItemKey(FontFolder item) => item.Key;

    protected override Task<SyncAttempt<XElement>> SerializeCoreAsync(FontFolder item, SyncSerializerOptions options)
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

    protected override Task<SyncAttempt<FontFolder>> DeserializeCoreAsync(XElement node, SyncSerializerOptions options)
    {
        var key = node.Attribute("Key")?.Value is { } value && Guid.TryParse(value, out var parsed) ? parsed : Guid.Empty;
        var info = node.Element("Info");
        var name = info?.Element("Name")?.Value ?? string.Empty;

        if (key == Guid.Empty)
        {
            return Task.FromResult(SyncAttempt<FontFolder>.Fail(
                string.IsNullOrEmpty(name) ? ItemType : name, ChangeType.ImportFail, "The folder node has no Key."));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            return Task.FromResult(SyncAttempt<FontFolder>.Fail(ItemType, ChangeType.ImportFail, "The folder node has no Name."));
        }

        using var scope = scopeFactory.CreateScope();
        var folders = scope.ServiceProvider.GetRequiredService<IFontFolderService>();

        var saved = folders.Upsert(new FontFolder
        {
            Key = key,
            Name = name.Trim(),
            ParentKey = Guid.TryParse(info?.Element("Parent")?.Value, out var parentKey) ? parentKey : null,
            SortOrder = int.TryParse(info?.Element("SortOrder")?.Value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var sort) ? sort : 0
        });

        // saved: true stops SyncSerializerRoot.DeserializeAsync calling SaveItemAsync again.
        return Task.FromResult(SyncAttempt<FontFolder>.Succeed(saved.Name, saved, ChangeType.Import, string.Empty, true, []));
    }

    public override Task<FontFolder?> FindItemAsync(Guid key)
    {
        using var scope = scopeFactory.CreateScope();
        return Task.FromResult(scope.ServiceProvider.GetRequiredService<IFontFolderService>().Get(key));
    }

    /// <summary>A folder's alias is its key, so this is a key lookup.</summary>
    public override Task<FontFolder?> FindItemAsync(string alias)
        => Guid.TryParse(alias, out var key) ? FindItemAsync(key) : Task.FromResult<FontFolder?>(null);

    public override Task SaveItemAsync(FontFolder item)
    {
        using var scope = scopeFactory.CreateScope();
        scope.ServiceProvider.GetRequiredService<IFontFolderService>().Upsert(item);

        return Task.CompletedTask;
    }

    public override Task DeleteItemAsync(FontFolder item)
    {
        using var scope = scopeFactory.CreateScope();
        var result = scope.ServiceProvider.GetRequiredService<IFontFolderService>().Delete(item.Key);

        // As for fonts: refusing is the honest answer, and uSync reports the throw as a failed action.
        if (result.Outcome == TreeOperationOutcome.NotEmpty)
        {
            throw new InvalidOperationException($"The font folder '{item.Name}' was not deleted: it is not empty.");
        }

        return Task.CompletedTask;
    }
}
