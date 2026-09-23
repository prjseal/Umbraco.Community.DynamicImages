using System.Text.Json;
using System.Text.Json.Nodes;
using System.Xml.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using uSync.Core;
using uSync.Core.Models;
using uSync.Core.Serialization;

namespace Umbraco.Community.DynamicImages.uSync.Serializers;

/// <summary>
/// Reads and writes a row of DynamicImages_Template as a uSync <c>.config</c> file: an
/// <c>&lt;Info&gt;</c> block for the columns a human reads in a diff, and the template document
/// itself as a CDATA blob.
/// <para>
/// uSync resolves serializers as singletons and every Dynamic Images service is scoped, so
/// <see cref="IServiceScopeFactory"/> is injected and a scope is opened per operation.
/// </para>
/// </summary>
[SyncSerializer(
    DynamicImagesUSyncConstants.SerializerIds.Template,
    "Dynamic Images Template Serializer",
    DynamicImagesUSyncConstants.ItemTypes.Template)]
public class DynamicImagesTemplateSerializer(
    IServiceScopeFactory scopeFactory,
    ILogger<SyncSerializerRoot<Template>> logger)
    : SyncSerializerRoot<Template>(logger), ISyncSerializer<Template>
{
    private const string UpdatedUtcProperty = "updatedUtc";

    /// <summary>Written once, as <c>Info/Parent</c>, rather than twice with the two able to disagree.</summary>
    private const string ParentKeyProperty = "parentKey";

    public override string ItemAlias(Template item) => item.Alias;

    public override Guid ItemKey(Template item) => item.Key;

    protected override Task<SyncAttempt<XElement>> SerializeCoreAsync(Template item, SyncSerializerOptions options)
    {
        // Level is the folder depth, so uSync's report and its level-ordered import read the same
        // way the tree does. Folders have their own handler, which runs first.
        using var scope = scopeFactory.CreateScope();
        var tree = scope.ServiceProvider.GetService<ITemplateFolderService>()?.GetTree();
        var parent = tree is not null && item.ParentKey is { } parentKey && tree.FolderExists(parentKey) ? parentKey : (Guid?)null;

        // 0 at the root, which is where every template exported before folders sits - so those
        // files do not change.
        var level = parent is { } folderKey ? tree!.DepthOf(folderKey) + 1 : 0;

        var node = InitializeBaseNode(item, item.Alias, level);

        node.Add(new XElement("Info",
            new XElement("Name", item.Name),
            new XElement("Parent", parent?.ToString() ?? string.Empty),
            new XElement("Enabled", item.IsEnabled),
            new XElement("SchemaVersion", item.SchemaVersion),
            new XElement("DocTypeAliases", string.Join(',', item.DocTypeAliases))));

        node.Add(new XElement("Design", new XCData(DesignJson(item))));

        return Task.FromResult(SyncAttempt<XElement>.Succeed(item.Name, node, ChangeType.Export, []));
    }

    /// <summary>
    /// The template document, without its <c>updatedUtc</c>.
    /// <para>
    /// uSync detects change by hashing the serialised XML, so a timestamp in the file would make
    /// every template report as changed the moment it was imported, forever. The strip is done on
    /// a <see cref="JsonNode"/> round-trip rather than on the object, because
    /// <c>ITemplateService.GetAll()</c> returns the instances held by the template cache and the
    /// handler hands those straight to this serializer - mutating one would clear the timestamp
    /// for everything else running on the server.
    /// </para>
    /// </summary>
    private static string DesignJson(Template item)
    {
        var node = JsonNode.Parse(JsonSerializer.Serialize(item, DynamicImagesJsonOptions.Default));
        if (node is JsonObject document)
        {
            document.Remove(UpdatedUtcProperty);
            document.Remove(ParentKeyProperty);
        }

        return node?.ToJsonString(DynamicImagesJsonOptions.Indented) ?? "{}";
    }

    protected override async Task<SyncAttempt<Template>> DeserializeCoreAsync(XElement node, SyncSerializerOptions options)
    {
        var (key, alias) = FindKeyAndAlias(node);
        var info = node.Element("Info");
        var name = info?.Element("Name")?.Value ?? alias;

        if (key == Guid.Empty)
        {
            return SyncAttempt<Template>.Fail(name, ChangeType.ImportFail, "The template node has no Key.");
        }

        var design = node.Element("Design")?.Value;
        if (string.IsNullOrWhiteSpace(design))
        {
            return SyncAttempt<Template>.Fail(name, ChangeType.ImportFail, "The template node has no Design.");
        }

        using var scope = scopeFactory.CreateScope();
        var templates = scope.ServiceProvider.GetRequiredService<ITemplateService>();

        Template? template;
        try
        {
            // Through the migrator, so an older-schema document in a file is upgraded on the way in exactly
            // as one in the database is upgraded on the way out.
            template = scope.ServiceProvider.GetRequiredService<ITemplateJsonMigrator>().Deserialize(design);
        }
        catch (JsonException ex)
        {
            return SyncAttempt<Template>.Fail(name, ChangeType.ImportFail, $"The template document could not be read: {ex.Message}");
        }

        if (template is null)
        {
            return SyncAttempt<Template>.Fail(name, ChangeType.ImportFail, "The template document could not be read.");
        }

        // The same rule TemplateRepository.Map applies on the way out: the columns are
        // authoritative over the copy of them inside the JSON document.
        template.Key = key;
        template.Alias = alias;
        template.Name = name;
        template.IsEnabled = ReadBool(info?.Element("Enabled")?.Value, template.IsEnabled);
        template.DocTypeAliases = SplitAliases(info?.Element("DocTypeAliases")?.Value);

        // A parent that has not arrived in this environment puts the template at the root rather
        // than failing the import: the folder is organisation, not behaviour.
        var folders = scope.ServiceProvider.GetService<ITemplateFolderService>();
        Guid? parent = Guid.TryParse(info?.Element("Parent")?.Value, out var parentKey)
            && folders?.Get(parentKey) is not null
                ? parentKey
                : null;
        template.ParentKey = parent;

        var result = await SaveAsync(templates, template);
        if (result.Outcome != SaveOutcome.Saved)
        {
            return SyncAttempt<Template>.Fail(name, ChangeType.ImportFail, Describe(result));
        }

        // An update keeps the stored folder by design, so the file's folder is applied as a move.
        // (The save may have reset template.ParentKey to the stored one, hence the local.)
        if (templates.Get(key) is { } stored && stored.ParentKey != parent)
        {
            await templates.MoveAsync(key, parent);
        }

        // saved: true stops SyncSerializerRoot.DeserializeAsync calling SaveItemAsync again.
        return SyncAttempt<Template>.Succeed(
            name, result.Template ?? template, ChangeType.Import, string.Empty, true, []);
    }

    /// <summary>
    /// Create or update by whether the key is already there. The expected-timestamp argument is
    /// null on purpose: an import is authoritative and must skip the optimistic-concurrency check
    /// the designer relies on.
    /// </summary>
    private static async Task<SaveResult> SaveAsync(ITemplateService templates, Template template)
        => templates.Get(template.Key) is null
            ? await templates.CreateAsync(template, userKey: null)
            : await templates.UpdateAsync(template, expectedUpdatedUtc: null, userKey: null);

    /// <summary>The validator's own messages, so the uSync report says what is actually wrong.</summary>
    private static string Describe(SaveResult result) => result.Outcome switch
    {
        SaveOutcome.Invalid => $"The template did not validate: {string.Join("; ", result.Validation.Errors.Select(e => e.Message))}",
        SaveOutcome.AliasInUse => "Another template already uses that alias.",
        SaveOutcome.NotFound => "The template no longer exists.",
        SaveOutcome.Conflict => "The template was changed by something else while it was importing.",
        _ => "The template could not be saved."
    };

    public override Task<Template?> FindItemAsync(Guid key)
    {
        using var scope = scopeFactory.CreateScope();
        return Task.FromResult(scope.ServiceProvider.GetRequiredService<ITemplateService>().Get(key));
    }

    /// <summary>By alias, then by a key written where an alias was expected.</summary>
    public override Task<Template?> FindItemAsync(string alias)
    {
        using var scope = scopeFactory.CreateScope();
        var templates = scope.ServiceProvider.GetRequiredService<ITemplateService>();

        return Task.FromResult(templates.GetByAlias(alias)
            ?? (Guid.TryParse(alias, out var key) ? templates.Get(key) : null));
    }

    public override async Task SaveItemAsync(Template item)
    {
        using var scope = scopeFactory.CreateScope();
        await SaveAsync(scope.ServiceProvider.GetRequiredService<ITemplateService>(), item);
    }

    public override Task DeleteItemAsync(Template item)
    {
        using var scope = scopeFactory.CreateScope();
        scope.ServiceProvider.GetRequiredService<ITemplateService>().Delete(item.Key);

        return Task.CompletedTask;
    }

    private static List<string> SplitAliases(string? value)
        => string.IsNullOrWhiteSpace(value)
            ? []
            : value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();

    private static bool ReadBool(string? value, bool fallback)
        => bool.TryParse(value, out var parsed) ? parsed : fallback;
}
