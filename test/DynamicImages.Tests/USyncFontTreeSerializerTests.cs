using System.Xml.Linq;
using Microsoft.Extensions.Logging.Abstractions;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.uSync.Serializers;
using uSync.Core.Serialization;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The Fonts tree's uSync files - font folders, font families, and a font naming its family - over
/// the real <see cref="FontService"/> and <see cref="FontFolderService"/> on in-memory rows.
/// </summary>
public class USyncFontTreeSerializerTests
{
    private readonly FontServiceFixture _fixture = new();

    private StubScopeFactory Scope() => new(new Dictionary<Type, object>
    {
        [typeof(IFontService)] = _fixture.Service(),
        [typeof(IFontFolderService)] = _fixture.FolderService()
    });

    private DynamicImagesFontFolderSerializer FolderSerializer()
        => new(Scope(), NullLogger<SyncSerializerRoot<FontFolder>>.Instance);

    private DynamicImagesFontFamilySerializer FamilySerializer()
        => new(Scope(), NullLogger<SyncSerializerRoot<FontFamily>>.Instance);

    private DynamicImagesFontSerializer FontSerializer()
        => new(Scope(), NullLogger<SyncSerializerRoot<FontDefinition>>.Instance);

    [Fact]
    public async Task A_nested_font_folder_round_trips_to_identical_xml()
    {
        var folders = _fixture.FolderService();
        var outer = folders.Create("Brand", null).Folder!;
        var inner = folders.Create("Display", outer.Key).Folder!;

        var first = (await FolderSerializer().SerializeAsync(inner, new SyncSerializerOptions())).Item!;
        Assert.Equal("DynamicImagesFontFolder", first.Name.LocalName);
        Assert.Equal("1", first.Attribute("Level")!.Value);
        Assert.Equal(outer.Key.ToString(), first.Element("Info")!.Element("Parent")!.Value);

        folders.Rename(inner.Key, "Renamed elsewhere");
        Assert.True((await FolderSerializer().DeserializeAsync(first, new SyncSerializerOptions())).Success);

        var second = (await FolderSerializer().SerializeAsync(folders.Get(inner.Key)!, new SyncSerializerOptions())).Item!;
        Assert.Equal(first.ToString(), second.ToString());
    }

    [Fact]
    public async Task A_family_in_a_folder_round_trips_to_identical_xml_and_a_rename_reaches_its_variants()
    {
        var brand = _fixture.FolderService().Create("Brand", null).Folder!;
        var inter = _fixture.Families.Insert(new FontFamily { Key = Guid.NewGuid(), Name = "Inter", ParentKey = brand.Key, SortOrder = 3 });
        _fixture.Fonts.Insert(new FontDefinition { Key = Guid.NewGuid(), FamilyKey = inter.Key, FamilyName = "Inter" });

        var first = (await FamilySerializer().SerializeAsync(inter, new SyncSerializerOptions())).Item!;
        Assert.Equal("DynamicImagesFontFamily", first.Name.LocalName);
        Assert.Equal("1", first.Attribute("Level")!.Value);
        Assert.Equal(brand.Key.ToString(), first.Element("Info")!.Element("Parent")!.Value);
        Assert.Equal("3", first.Element("Info")!.Element("SortOrder")!.Value);

        // Another environment renamed it; importing puts this one's name back, onto the variants too.
        _fixture.Service().RenameFamily(inter.Key, "Inter Display", out _);
        Assert.True((await FamilySerializer().DeserializeAsync(first, new SyncSerializerOptions())).Success);

        var second = (await FamilySerializer().SerializeAsync(_fixture.Families.Get(inter.Key)!, new SyncSerializerOptions())).Item!;
        Assert.Equal(first.ToString(), second.ToString());
        Assert.Equal("Inter", Assert.Single(_fixture.Fonts.GetAll()).FamilyName);
    }

    [Fact]
    public async Task A_family_whose_folder_is_missing_imports_to_the_root()
    {
        var key = Guid.NewGuid();
        var node = new XElement("DynamicImagesFontFamily",
            new XAttribute("Key", key), new XAttribute("Alias", key.ToString()), new XAttribute("Level", 1),
            new XElement("Info", new XElement("Name", "Lora"), new XElement("Parent", Guid.NewGuid()), new XElement("SortOrder", 0)));

        Assert.True((await FamilySerializer().DeserializeAsync(node, new SyncSerializerOptions())).Success);
        Assert.Null(_fixture.Families.Get(key)!.ParentKey);
    }

    [Fact]
    public async Task A_font_writes_its_family_key_and_imports_back_into_that_family()
    {
        var inter = _fixture.Families.Insert(new FontFamily { Key = Guid.NewGuid(), Name = "Inter" });
        var font = _fixture.Fonts.Insert(new FontDefinition
        {
            Key = Guid.NewGuid(), FamilyKey = inter.Key, FamilyName = "Inter", Weight = 700, SortOrder = 2,
            SourceKind = ImageSourceKind.Media, MediaKey = Guid.NewGuid()
        });

        var xml = (await FontSerializer().SerializeAsync(font, new SyncSerializerOptions())).Item!;
        Assert.Equal(inter.Key.ToString(), xml.Element("Info")!.Element("FamilyKey")!.Value);

        _fixture.Fonts.Delete(font.Key);
        Assert.True((await FontSerializer().DeserializeAsync(xml, new SyncSerializerOptions())).Success);

        var imported = _fixture.Fonts.Get(font.Key)!;
        Assert.Equal((inter.Key, 2), (imported.FamilyKey!.Value, imported.SortOrder));
    }

    /// <summary>
    /// A file exported before families existed - as the Clean test site's fixture fonts are - has
    /// no FamilyKey. It joins the family of its name, or a new one.
    /// </summary>
    [Fact]
    public async Task An_old_font_export_with_no_family_key_imports_into_a_found_or_created_family()
    {
        var inter = _fixture.Families.Insert(new FontFamily { Key = Guid.NewGuid(), Name = "Inter" });

        static XElement OldExport(Guid key, string family) => new("DynamicImagesFont",
            new XAttribute("Key", key), new XAttribute("Alias", $"{family.ToLowerInvariant()}-400"), new XAttribute("Level", 0),
            new XElement("Info", new XElement("FamilyName", family), new XElement("Weight", 400), new XElement("IsItalic", false)),
            new XElement("Source", new XAttribute("Kind", "media"), new XElement("MediaKey", Guid.NewGuid())),
            new XElement("Styles"));

        var joining = Guid.NewGuid();
        var creating = Guid.NewGuid();
        Assert.True((await FontSerializer().DeserializeAsync(OldExport(joining, "inter"), new SyncSerializerOptions())).Success);
        Assert.True((await FontSerializer().DeserializeAsync(OldExport(creating, "Lora"), new SyncSerializerOptions())).Success);

        Assert.Equal(inter.Key, _fixture.Fonts.Get(joining)!.FamilyKey);
        Assert.Equal("Inter", _fixture.Fonts.Get(joining)!.FamilyName);

        var lora = _fixture.Families.Get(_fixture.Fonts.Get(creating)!.FamilyKey!.Value)!;
        Assert.Equal("Lora", lora.Name);
    }
}
