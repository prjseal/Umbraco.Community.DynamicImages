using Microsoft.Extensions.Logging.Abstractions;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.uSync.Serializers;
using uSync.Core.Serialization;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class USyncTemplateFolderSerializerTests
{
    private static (DynamicImagesTemplateFolderSerializer Serializer, TemplateFolderService Folders) Build()
    {
        var folders = new TemplateFolderService(
            new InMemoryTemplateFolderRepository(), new FakeTemplateCache(new FakeTemplateService()), new NullEventAggregator());

        var scopeFactory = new StubScopeFactory(new Dictionary<Type, object> { [typeof(ITemplateFolderService)] = folders });

        return (new DynamicImagesTemplateFolderSerializer(scopeFactory, NullLogger<SyncSerializerRoot<TemplateFolder>>.Instance), folders);
    }

    [Fact]
    public async Task A_nested_folder_round_trips_to_identical_xml()
    {
        var (serializer, folders) = Build();
        var outer = folders.Create("Social", null).Folder!;
        var inner = folders.Create("Articles", outer.Key).Folder!;

        var first = (await serializer.SerializeAsync(inner, new SyncSerializerOptions())).Item!;
        Assert.Equal("1", first.Attribute("Level")!.Value);
        Assert.Equal(outer.Key.ToString(), first.Element("Info")!.Element("Parent")!.Value);

        folders.Rename(inner.Key, "Renamed elsewhere");
        var imported = await serializer.DeserializeAsync(first, new SyncSerializerOptions());
        Assert.True(imported.Success);

        var second = (await serializer.SerializeAsync(folders.Get(inner.Key)!, new SyncSerializerOptions())).Item!;
        Assert.Equal(first.ToString(), second.ToString());
    }

    [Fact]
    public async Task A_folder_whose_parent_is_missing_imports_to_the_root()
    {
        var (serializer, folders) = Build();
        var key = Guid.NewGuid();

        var node = new System.Xml.Linq.XElement("DynamicImagesTemplateFolder",
            new System.Xml.Linq.XAttribute("Key", key),
            new System.Xml.Linq.XAttribute("Alias", key.ToString()),
            new System.Xml.Linq.XAttribute("Level", 1),
            new System.Xml.Linq.XElement("Info",
                new System.Xml.Linq.XElement("Name", "Orphan"),
                new System.Xml.Linq.XElement("Parent", Guid.NewGuid()),
                new System.Xml.Linq.XElement("SortOrder", 0)));

        var imported = await serializer.DeserializeAsync(node, new SyncSerializerOptions());

        Assert.True(imported.Success);
        Assert.Null(folders.Get(key)!.ParentKey);
    }
}
