using System.Xml.Linq;
using Microsoft.Extensions.Logging.Abstractions;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.uSync.Serializers;
using uSync.Core.Serialization;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class USyncFontSerializerTests
{
    private static (DynamicImagesFontSerializer Serializer, FakeFontService Fonts) Build()
    {
        var fonts = new FakeFontService();
        var scopeFactory = new StubScopeFactory(new Dictionary<Type, object> { [typeof(IFontService)] = fonts });

        return (new DynamicImagesFontSerializer(scopeFactory, NullLogger<SyncSerializerRoot<FontDefinition>>.Instance), fonts);
    }

    private static FontDefinition Web() => new()
    {
        Key = Guid.Parse("1c9e2a3b-4c5d-6e7f-8091-a2b3c4d5e6f7"),
        FamilyName = "Inter",
        SourceKind = ImageSourceKind.Url,
        SourceUrl = "https://fonts.gstatic.com/s/inter/v13/inter-700.woff2",
        Provider = "google",
        ProviderFamily = "Inter",
        Weight = 700,
        ContentHash = "abc123",
        Styles = [new FontStyleDefinition { Name = "Title", Size = 56f, FontStyle = "Regular" }],
        CreatedUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        UpdatedUtc = new DateTime(2026, 1, 2, 3, 4, 5, DateTimeKind.Utc)
    };

    [Theory]
    [InlineData("Inter", 700, false, "inter-700")]
    [InlineData("Inter", 400, true, "inter-400-italic")]
    [InlineData("Playfair Display", 900, false, "playfair-display-900")]
    [InlineData("Noto Sans JP", 400, false, "noto-sans-jp-400")]
    [InlineData("", 400, false, "font-400")]
    public void The_alias_is_a_slug_of_family_weight_and_slant(string family, int weight, bool italic, string expected)
    {
        var alias = DynamicImagesFontSerializer.AliasFor(new FontDefinition
        {
            FamilyName = family,
            Weight = weight,
            IsItalic = italic
        });

        Assert.Equal(expected, alias);
    }

    [Fact]
    public async Task A_web_font_round_trips_to_identical_xml()
    {
        var (serializer, fonts) = Build();
        var font = Web();

        var first = await serializer.SerializeAsync(font, new SyncSerializerOptions());
        Assert.True(first.Success);

        var imported = await serializer.DeserializeAsync(first.Item!, new SyncSerializerOptions());
        Assert.True(imported.Success);

        var second = await serializer.SerializeAsync(fonts.Get(font.Key)!, new SyncSerializerOptions());

        Assert.Equal(first.Item!.ToString(), second.Item!.ToString());
    }

    [Fact]
    public async Task The_styles_round_trip()
    {
        var (serializer, fonts) = Build();

        var node = (await serializer.SerializeAsync(Web(), new SyncSerializerOptions())).Item!;
        await serializer.DeserializeAsync(node, new SyncSerializerOptions());

        var style = Assert.Single(fonts.Get(Web().Key)!.Styles);

        Assert.Equal("Title", style.Name);
        Assert.Equal(56f, style.Size);
        Assert.Equal("Regular", style.FontStyle);
    }

    [Fact]
    public async Task The_file_carries_no_timestamps()
    {
        var (serializer, _) = Build();

        var xml = (await serializer.SerializeAsync(Web(), new SyncSerializerOptions())).Item!.ToString();

        Assert.DoesNotContain("Utc>", xml, StringComparison.Ordinal);
        Assert.DoesNotContain("2026-01-02", xml, StringComparison.Ordinal);
    }

    /// <summary>Only the elements the kind uses, so a diff is not full of empty tags.</summary>
    [Fact]
    public async Task A_media_font_writes_its_media_key_and_no_url()
    {
        var (serializer, _) = Build();

        var node = (await serializer.SerializeAsync(new FontDefinition
        {
            Key = Guid.Parse("2b9e2a3b-4c5d-6e7f-8091-a2b3c4d5e6f7"),
            FamilyName = "Bitter",
            SourceKind = ImageSourceKind.Media,
            MediaKey = Guid.Parse("aaaabbbb-cccc-dddd-eeee-ffff00001111"),
            Weight = 400
        }, new SyncSerializerOptions())).Item!;

        var source = node.Element("Source")!;

        Assert.Equal("media", source.Attribute("Kind")!.Value);
        Assert.Equal("aaaabbbb-cccc-dddd-eeee-ffff00001111", source.Element("MediaKey")!.Value);
        Assert.Null(source.Element("Url"));
        Assert.Null(source.Element("Path"));
    }

    [Fact]
    public async Task A_path_font_round_trips_its_path()
    {
        var (serializer, fonts) = Build();
        var key = Guid.Parse("3c9e2a3b-4c5d-6e7f-8091-a2b3c4d5e6f7");

        var node = (await serializer.SerializeAsync(new FontDefinition
        {
            Key = key,
            FamilyName = "Roboto Mono",
            SourceKind = ImageSourceKind.Path,
            Path = "/assets/fonts/roboto-mono.ttf",
            Weight = 500,
            IsItalic = true
        }, new SyncSerializerOptions())).Item!;

        Assert.Equal("roboto-mono-500-italic", node.Attribute("Alias")!.Value);

        await serializer.DeserializeAsync(node, new SyncSerializerOptions());
        var stored = fonts.Get(key)!;

        Assert.Equal(ImageSourceKind.Path, stored.SourceKind);
        Assert.Equal("/assets/fonts/roboto-mono.ttf", stored.Path);
        Assert.Null(stored.SourceUrl);
        Assert.True(stored.IsItalic);
    }

    [Fact]
    public void IsValid_rejects_another_serializers_node()
    {
        var (serializer, _) = Build();

        var wrongRoot = XElement.Parse("""<DynamicImagesTemplate Key="1c9e2a3b-4c5d-6e7f-8091-a2b3c4d5e6f7" Alias="articleOgImage" Level="0" />""");

        Assert.False(serializer.IsValid(wrongRoot));
    }

    [Fact]
    public async Task FindItem_by_alias_matches_the_computed_alias()
    {
        var (serializer, fonts) = Build();
        fonts.Upsert(Web());

        Assert.NotNull(await serializer.FindItemAsync("inter-700"));
        Assert.Null(await serializer.FindItemAsync("inter-400"));
    }

    /// <summary>
    /// IFontService.Delete refuses rather than breaking the templates using the font; a failed
    /// uSync action naming them is a better answer than a template that cannot publish.
    /// </summary>
    [Fact]
    public async Task Deleting_a_font_a_template_uses_throws_with_the_template_names()
    {
        var (serializer, fonts) = Build();
        fonts.InUse.Add(new Umbraco.Community.DynamicImages.Core.Models.Template { Name = "Article OG image" });

        var thrown = await Assert.ThrowsAsync<InvalidOperationException>(() => serializer.DeleteItemAsync(Web()));

        Assert.Contains("Article OG image", thrown.Message);
    }
}
