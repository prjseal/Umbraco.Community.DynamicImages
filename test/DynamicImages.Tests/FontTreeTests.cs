using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.Persistence;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class FontTreeTests
{
    private static readonly Guid Brand = Guid.Parse("20000000-0000-0000-0000-000000000001");
    private static readonly Guid Display = Guid.Parse("20000000-0000-0000-0000-000000000002");
    private static readonly Guid Inter = Guid.Parse("30000000-0000-0000-0000-000000000001");
    private static readonly Guid Lora = Guid.Parse("30000000-0000-0000-0000-000000000002");

    private static FontDefinition Font(Guid family, int weight, bool italic = false, string name = "Inter")
        => new() { Key = Guid.NewGuid(), FamilyKey = family, FamilyName = name, Weight = weight, IsItalic = italic };

    /// <summary>Brand ⊃ Display, Inter at the root with three variants, Lora in Brand with one.</summary>
    private static FontTree Sample(out FontDefinition bold)
    {
        bold = Font(Inter, 700);
        return new FontTree(
            [new FontFolder { Key = Brand, Name = "Brand" }, new FontFolder { Key = Display, Name = "Display", ParentKey = Brand }],
            [new FontFamily { Key = Inter, Name = "Inter" }, new FontFamily { Key = Lora, Name = "Lora", ParentKey = Brand }],
            [bold, Font(Inter, 400, italic: true), Font(Inter, 400), Font(Lora, 400, name: "Lora")]);
    }

    // ------------------------------------------------------------ backfill grouping

    [Fact]
    public void Rows_group_by_family_name_ignoring_case_and_surrounding_space()
    {
        var a = Guid.NewGuid();
        var b = Guid.NewGuid();
        var c = Guid.NewGuid();
        var d = Guid.NewGuid();

        var groups = FontFamilyGrouping.Group([(a, "Inter"), (b, " inter "), (c, "Lora"), (d, "INTER")]);

        Assert.Equal(2, groups.Count);
        Assert.Equal("Inter", groups[0].Name);
        Assert.Equal([a, b, d], groups[0].FontKeys);
        Assert.Equal("Lora", groups[1].Name);
        Assert.Equal([c], groups[1].FontKeys);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void A_row_without_a_family_name_goes_into_an_unnamed_family(string? name)
        => Assert.Equal("Unnamed font", Assert.Single(FontFamilyGrouping.Group([(Guid.NewGuid(), name)])).Name);

    [Fact]
    public void The_group_is_named_by_its_first_spelling_trimmed()
        => Assert.Equal("Open Sans", FontFamilyGrouping.Group([(Guid.NewGuid(), " Open Sans"), (Guid.NewGuid(), "open sans")])[0].Name);

    // ------------------------------------------------------------ the tree

    [Fact]
    public void The_root_lists_folders_first_then_families()
    {
        var tree = Sample(out _);

        var root = tree.ChildrenOf(null);

        Assert.Equal(["Brand", "Inter"], root.Select(n => n.Name));
        Assert.Equal([FontTreeEntityType.Folder, FontTreeEntityType.Family], root.Select(n => n.EntityType));
        Assert.True(root[1].HasChildren);
        Assert.Equal(3, root[1].VariantCount);
    }

    [Fact]
    public void A_familys_children_are_its_variants_by_weight_then_upright_first()
    {
        var tree = Sample(out var bold);

        var variants = tree.ChildrenOf(Inter);

        Assert.Equal(["Regular 400", "Regular 400 Italic", "Bold 700"], variants.Select(v => v.Name));
        Assert.All(variants, v => Assert.Equal(FontTreeEntityType.Font, v.EntityType));
        Assert.All(variants, v => Assert.Equal(Inter, v.ParentKey));
        Assert.Equal(bold.Key, variants[2].Key);
        Assert.Empty(tree.ChildrenOf(Inter, foldersOnly: true));
    }

    [Fact]
    public void Folders_only_leaves_families_out()
    {
        var tree = Sample(out _);

        Assert.Equal(["Brand"], tree.ChildrenOf(null, foldersOnly: true).Select(n => n.Name));
        Assert.Equal(["Display"], tree.ChildrenOf(Brand, foldersOnly: true).Select(n => n.Name));
    }

    [Fact]
    public void A_variants_ancestors_run_through_its_family_and_folders()
    {
        var tree = new FontTree(
            [new FontFolder { Key = Brand, Name = "Brand" }],
            [new FontFamily { Key = Lora, Name = "Lora", ParentKey = Brand }],
            [Font(Lora, 400, name: "Lora")]);
        var variant = tree.VariantsOf(Lora)[0];

        Assert.Equal([Brand, Lora, variant.Key], tree.AncestorsOf(variant.Key).Select(a => a.Key));
        Assert.Equal(2, tree.DepthOf(variant.Key));
        Assert.Equal(FontTreeEntityType.Font, tree.Find(variant.Key)!.EntityType);
    }

    [Theory]
    [InlineData(400, false, "Regular 400")]
    [InlineData(700, true, "Bold 700 Italic")]
    [InlineData(600, false, "SemiBold 600")]
    [InlineData(450, false, "450")]
    public void Variants_are_named_by_weight_and_slant(int weight, bool italic, string name)
        => Assert.Equal(name, FontTree.VariantName(weight, italic));

    [Fact]
    public void A_font_folder_cannot_move_into_itself_or_below_it()
    {
        var tree = Sample(out _);

        Assert.True(tree.WouldCreateCycle(Brand, Brand));
        Assert.True(tree.WouldCreateCycle(Brand, Display));
        Assert.False(tree.WouldCreateCycle(Display, null));
    }

    [Fact]
    public void A_variant_whose_family_is_missing_is_left_out_rather_than_breaking_the_tree()
    {
        var tree = new FontTree([], [], [Font(Guid.NewGuid(), 400)]);

        Assert.Empty(tree.ChildrenOf(null));
    }

    // ------------------------------------------------------------ the repository mapping

    [Fact]
    public void A_fonts_family_and_sort_order_map_to_and_from_its_row()
    {
        var font = Font(Inter, 700);
        font.SortOrder = 3;

        var round = FontRepository.Map(FontRepository.ToDto(font));

        Assert.Equal((Inter, 3), (round.FamilyKey!.Value, round.SortOrder));
    }
}
