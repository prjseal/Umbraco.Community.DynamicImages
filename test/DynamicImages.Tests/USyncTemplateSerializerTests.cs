using System.Text.Json;
using System.Xml.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.uSync.Serializers;
using uSync.Core.Serialization;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

public class USyncTemplateSerializerTests
{
    private static readonly Guid FontKey = Guid.Parse("6a0d0e5b-7f4a-4c4f-9b22-1d9d5a8e7c31");

    private static (DynamicImagesTemplateSerializer Serializer, FakeTemplateService Templates) Build()
        => Build(out _);

    private static (DynamicImagesTemplateSerializer Serializer, FakeTemplateService Templates) Build(out TemplateFolderService folders)
    {
        var templates = new FakeTemplateService();
        folders = new TemplateFolderService(
            new InMemoryTemplateFolderRepository(), new FakeTemplateCache(templates), new NullEventAggregator());

        var scopeFactory = new StubScopeFactory(new Dictionary<Type, object>
        {
            [typeof(ITemplateService)] = templates,
            [typeof(ITemplateFolderService)] = folders,
            [typeof(ITemplateJsonMigrator)] = new TemplateJsonMigrator()
        });

        return (new DynamicImagesTemplateSerializer(scopeFactory, NullLogger<SyncSerializerRoot<Template>>.Instance), templates);
    }

    /// <summary>Layers, a gradient canvas and a font reference - the things a naive serializer loses.</summary>
    private static Template Sample() => new()
    {
        Key = Guid.Parse("8f3a1c2d-4b5e-6f70-8192-a3b4c5d6e7f8"),
        Alias = "articleOgImage",
        Name = "Article OG image",
        IsEnabled = true,
        DocTypeAliases = ["article", "blogPost"],
        TargetPropertyAlias = "ogImage",
        Canvas = new CanvasSettings
        {
            Width = 1200,
            Height = 630,
            BackgroundGradient = new Gradient { Kind = GradientKind.Linear, From = "#101820", To = "#3a6ea5", Angle = 45 }
        },
        Layers =
        [
            new TextLayer
            {
                Key = Guid.Parse("11111111-2222-3333-4444-555555555555"),
                Name = "Title",
                Position = new Position { X = 60, Y = 160, Anchor = Anchor.TopLeft },
                Binding = new TextBinding { Kind = TextBindingKind.NodeName },
                Style = new TextStyle { FontKey = FontKey, FontSize = 56, Overflow = TextOverflow.Shrink }
            },
            new RectLayer
            {
                Key = Guid.Parse("66666666-7777-8888-9999-aaaaaaaaaaaa"),
                Name = "Bar",
                Position = new Position { X = 0, Y = 0, Anchor = Anchor.BottomLeft },
                Fill = "#ff0044"
            }
        ],
        UpdatedUtc = new DateTime(2026, 1, 2, 3, 4, 5, DateTimeKind.Utc)
    };

    [Fact]
    public async Task A_template_round_trips_to_identical_xml()
    {
        var (serializer, templates) = Build();
        var template = Sample();

        var first = await serializer.SerializeAsync(template, new SyncSerializerOptions());
        Assert.True(first.Success);

        var imported = await serializer.DeserializeAsync(first.Item!, new SyncSerializerOptions());
        Assert.True(imported.Success);

        var stored = templates.Get(template.Key);
        Assert.NotNull(stored);

        var second = await serializer.SerializeAsync(stored, new SyncSerializerOptions());

        Assert.Equal(first.Item!.ToString(), second.Item!.ToString());
    }

    [Fact]
    public async Task The_round_trip_keeps_the_layers_and_the_font_reference()
    {
        var (serializer, templates) = Build();

        var node = (await serializer.SerializeAsync(Sample(), new SyncSerializerOptions())).Item!;
        await serializer.DeserializeAsync(node, new SyncSerializerOptions());

        var stored = templates.Get(Sample().Key)!;

        Assert.Equal(2, stored.Layers.Count);
        Assert.Equal(FontKey, Assert.IsType<TextLayer>(stored.Layers[0]).Style.FontKey);
        Assert.Equal("#3a6ea5", stored.Canvas.BackgroundGradient!.To);
        Assert.Equal(["article", "blogPost"], stored.DocTypeAliases);
    }

    [Fact]
    public async Task The_design_carries_no_updated_timestamp()
    {
        var (serializer, _) = Build();

        var node = (await serializer.SerializeAsync(Sample(), new SyncSerializerOptions())).Item!;
        var design = node.Element("Design")!.Value;

        Assert.DoesNotContain("updatedUtc", design, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("2026-01-02", node.ToString(), StringComparison.Ordinal);
    }

    /// <summary>
    /// The property that makes uSync's change detection stable: it hashes the serialised XML, so
    /// a template whose only difference is when it was last saved must serialise the same.
    /// </summary>
    [Fact]
    public async Task Two_saves_of_the_same_template_serialize_identically()
    {
        var (serializer, _) = Build();

        var earlier = Sample();
        var later = Sample();
        later.UpdatedUtc = DateTime.UtcNow;

        var first = await serializer.SerializeAsync(earlier, new SyncSerializerOptions());
        var second = await serializer.SerializeAsync(later, new SyncSerializerOptions());

        Assert.Equal(first.Item!.ToString(), second.Item!.ToString());
    }

    /// <summary>Serializing must not clear the timestamp on the object: GetAll returns the cached instances.</summary>
    [Fact]
    public async Task Serializing_does_not_touch_the_template()
    {
        var (serializer, _) = Build();
        var template = Sample();

        await serializer.SerializeAsync(template, new SyncSerializerOptions());

        Assert.Equal(new DateTime(2026, 1, 2, 3, 4, 5, DateTimeKind.Utc), template.UpdatedUtc);
    }

    [Fact]
    public void IsValid_rejects_another_serializers_node()
    {
        var (serializer, _) = Build();

        var wrongRoot = XElement.Parse("""<DynamicImagesFont Key="8f3a1c2d-4b5e-6f70-8192-a3b4c5d6e7f8" Alias="inter-700" Level="0" />""");

        Assert.False(serializer.IsValid(wrongRoot));
    }

    [Fact]
    public void IsValid_rejects_a_node_with_an_empty_key()
    {
        var (serializer, _) = Build();

        var noKey = XElement.Parse("""<DynamicImagesTemplate Key="00000000-0000-0000-0000-000000000000" Alias="articleOgImage" Level="0" />""");

        Assert.False(serializer.IsValid(noKey));
    }

    [Fact]
    public async Task A_v1_document_in_the_file_imports_as_the_current_schema()
    {
        var (serializer, templates) = Build();

        var template = Sample();
        var v1 = JsonNodeWithSchemaVersion(template, 1);

        var node = new XElement("DynamicImagesTemplate",
            new XAttribute("Key", template.Key),
            new XAttribute("Alias", template.Alias),
            new XAttribute("Level", 0),
            new XElement("Info",
                new XElement("Name", template.Name),
                new XElement("Enabled", true),
                new XElement("SchemaVersion", 1),
                new XElement("DocTypeAliases", "article,blogPost")),
            new XElement("Design", new XCData(v1)));

        var imported = await serializer.DeserializeAsync(node, new SyncSerializerOptions());

        Assert.True(imported.Success);
        Assert.Equal(DynamicImagesConstants.CurrentSchemaVersion, templates.Get(template.Key)!.SchemaVersion);
    }

    [Fact]
    public async Task A_template_that_does_not_validate_fails_with_the_validators_message()
    {
        var (serializer, templates) = Build();
        templates.Validator = _ => new ValidationResult(
            [new ValidationIssue(ValidationSeverity.Error, "TextLayerHasNoFont", "The Title layer has no font.")]);

        var node = (await serializer.SerializeAsync(Sample(), new SyncSerializerOptions())).Item!;

        var imported = await serializer.DeserializeAsync(node, new SyncSerializerOptions());

        Assert.False(imported.Success);
        Assert.Contains("The Title layer has no font.", imported.Message);
    }

    [Fact]
    public async Task A_template_in_a_folder_round_trips_with_its_parent_and_level()
    {
        var (serializer, templates) = Build(out var folders);
        var outer = folders.Create("Social", null).Folder!;
        var inner = folders.Create("Articles", outer.Key).Folder!;

        var template = Sample();
        template.ParentKey = inner.Key;

        var node = (await serializer.SerializeAsync(template, new SyncSerializerOptions())).Item!;

        Assert.Equal(inner.Key.ToString(), node.Element("Info")!.Element("Parent")!.Value);
        Assert.Equal("2", node.Attribute("Level")!.Value);
        Assert.DoesNotContain("parentKey", node.Element("Design")!.Value, StringComparison.Ordinal);

        var imported = await serializer.DeserializeAsync(node, new SyncSerializerOptions());

        Assert.True(imported.Success);
        Assert.Equal(inner.Key, templates.Get(template.Key)!.ParentKey);
    }

    [Fact]
    public async Task A_template_whose_folder_is_missing_imports_to_the_root()
    {
        var (serializer, templates) = Build();
        var node = (await serializer.SerializeAsync(Sample(), new SyncSerializerOptions())).Item!;
        node.Element("Info")!.Add(new XElement("Parent", Guid.NewGuid()));

        var imported = await serializer.DeserializeAsync(node, new SyncSerializerOptions());

        Assert.True(imported.Success);
        Assert.Null(templates.Get(Sample().Key)!.ParentKey);
    }

    [Fact]
    public async Task Reimporting_into_another_folder_moves_the_template()
    {
        var (serializer, templates) = Build(out var folders);
        var folder = folders.Create("Social", null).Folder!;

        var node = (await serializer.SerializeAsync(Sample(), new SyncSerializerOptions())).Item!;
        await serializer.DeserializeAsync(node, new SyncSerializerOptions());
        Assert.Null(templates.Get(Sample().Key)!.ParentKey);

        node.Element("Info")!.Add(new XElement("Parent", folder.Key));
        await serializer.DeserializeAsync(node, new SyncSerializerOptions());

        Assert.Equal(folder.Key, templates.Get(Sample().Key)!.ParentKey);
        Assert.Equal(1, templates.Moves);
    }

    [Fact]
    public async Task A_template_at_the_root_writes_no_parent_and_no_new_defaults()
    {
        // Every template exported before folders, shapes presets and gradient options existed is
        // at the root with none of them set: its file must not change just because this did.
        var (serializer, _) = Build();

        var node = (await serializer.SerializeAsync(Sample(), new SyncSerializerOptions())).Item!;

        Assert.Null(node.Element("Info")!.Element("Parent"));
        var design = node.Element("Design")!.Value;
        Assert.DoesNotContain("lockAspect", design, StringComparison.Ordinal);
        Assert.DoesNotContain("extent", design, StringComparison.Ordinal);
        Assert.DoesNotContain("\"shape\": \"ellipse\"", design, StringComparison.Ordinal);
    }

    private static string JsonNodeWithSchemaVersion(Template template, int version)
    {
        var json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);
        var document = System.Text.Json.Nodes.JsonNode.Parse(json)!.AsObject();
        document["schemaVersion"] = version;

        return document.ToJsonString(DynamicImagesJsonOptions.Default);
    }
}
