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
/// Reads and writes a row of DynamicImages_TemplateFolder as a uSync <c>.config</c> file.
/// <para>
/// <c>Level</c> is the folder's depth, so uSync imports a parent before its children. A parent
/// that is still missing when a folder arrives puts the folder at the root rather than failing,
/// as <see cref="ITemplateFolderService.Upsert"/> does. Timestamps are left out of the file for
/// the same reason the other serializers leave them out: uSync hashes the XML to detect change.
/// </para>
/// </summary>
[SyncSerializer(
    DynamicImagesUSyncConstants.SerializerIds.TemplateFolder,
    "Dynamic Images Template Folder Serializer",
    DynamicImagesUSyncConstants.ItemTypes.TemplateFolder)]
public class DynamicImagesTemplateFolderSerializer(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncSerializerRoot<TemplateFolder>> logger)
    : SyncSerializerRoot<TemplateFolder>(logger), ISyncSerializer<TemplateFolder>
{
    public override string ItemAlias(TemplateFolder item) => item.Key.ToString();

    public override Guid ItemKey(TemplateFolder item) => item.Key;

    protected override Task<SyncAttempt<XElement>> SerializeCoreAsync(TemplateFolder item, SyncSerializerOptions options)
    {
        using var scope = scopeFactory.CreateScope();
        var tree = scope.ServiceProvider.GetRequiredService<ITemplateFolderService>().GetTree();

        var parent = item.ParentKey is { } parentKey && tree.FolderExists(parentKey) ? parentKey : (Guid?)null;
        var node = InitializeBaseNode(item, ItemAlias(item), tree.DepthOf(item.Key));

        node.Add(new XElement("Info",
            new XElement("Name", item.Name),
            new XElement("Parent", parent?.ToString() ?? string.Empty),
            new XElement("SortOrder", item.SortOrder.ToString(CultureInfo.InvariantCulture))));

        return Task.FromResult(SyncAttempt<XElement>.Succeed(item.Name, node, ChangeType.Export, []));
    }

    protected override Task<SyncAttempt<TemplateFolder>> DeserializeCoreAsync(XElement node, SyncSerializerOptions options)
    {
        var key = node.Attribute("Key")?.Value is { } value && Guid.TryParse(value, out var parsed) ? parsed : Guid.Empty;
        var info = node.Element("Info");
        var name = info?.Element("Name")?.Value ?? string.Empty;

        if (key == Guid.Empty)
        {
            return Task.FromResult(SyncAttempt<TemplateFolder>.Fail(
                string.IsNullOrEmpty(name) ? ItemType : name, ChangeType.ImportFail, "The folder node has no Key."));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            return Task.FromResult(SyncAttempt<TemplateFolder>.Fail(ItemType, ChangeType.ImportFail, "The folder node has no Name."));
        }

        using var scope = scopeFactory.CreateScope();
        var folders = scope.ServiceProvider.GetRequiredService<ITemplateFolderService>();

        var saved = folders.Upsert(new TemplateFolder
        {
            Key = key,
            Name = name.Trim(),
            ParentKey = Guid.TryParse(info?.Element("Parent")?.Value, out var parentKey) ? parentKey : null,
            SortOrder = int.TryParse(info?.Element("SortOrder")?.Value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var sort) ? sort : 0
        });

        // saved: true stops SyncSerializerRoot.DeserializeAsync calling SaveItemAsync again.
        return Task.FromResult(SyncAttempt<TemplateFolder>.Succeed(saved.Name, saved, ChangeType.Import, string.Empty, true, []));
    }

    public override Task<TemplateFolder?> FindItemAsync(Guid key)
    {
        using var scope = scopeFactory.CreateScope();
        return Task.FromResult(scope.ServiceProvider.GetRequiredService<ITemplateFolderService>().Get(key));
    }

    /// <summary>A folder's alias is its key, so this is a key lookup.</summary>
    public override Task<TemplateFolder?> FindItemAsync(string alias)
        => Guid.TryParse(alias, out var key) ? FindItemAsync(key) : Task.FromResult<TemplateFolder?>(null);

    public override Task SaveItemAsync(TemplateFolder item)
    {
        using var scope = scopeFactory.CreateScope();
        scope.ServiceProvider.GetRequiredService<ITemplateFolderService>().Upsert(item);

        return Task.CompletedTask;
    }

    public override Task DeleteItemAsync(TemplateFolder item)
    {
        using var scope = scopeFactory.CreateScope();
        var result = scope.ServiceProvider.GetRequiredService<ITemplateFolderService>().Delete(item.Key);

        // As for fonts: refusing is the honest answer, and uSync reports the throw as a failed action.
        if (result.Outcome == TreeOperationOutcome.NotEmpty)
        {
            throw new InvalidOperationException($"The template folder '{item.Name}' was not deleted: it is not empty.");
        }

        return Task.CompletedTask;
    }
}
