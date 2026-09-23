using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Services;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>The real <see cref="FontService"/>'s family and tree operations, over in-memory rows.</summary>
public class FontServiceTests
{
    private readonly FontServiceFixture _fixture = new();

    private FontFamily Family(string name, Guid? parent = null)
        => _fixture.Families.Insert(new FontFamily { Key = Guid.NewGuid(), Name = name, ParentKey = parent });

    private FontDefinition Variant(FontFamily family, int weight = 400)
        => _fixture.Fonts.Insert(new FontDefinition { Key = Guid.NewGuid(), FamilyKey = family.Key, FamilyName = family.Name, Weight = weight });

    private void UsedBy(string templateName, FontDefinition font)
        => _fixture.Templates.Insert(new Template
        {
            Key = Guid.NewGuid(),
            Alias = templateName,
            Name = templateName,
            Layers = [new TextLayer { Key = Guid.NewGuid(), Style = new TextStyle { FontKey = font.Key } }]
        }, null);

    [Fact]
    public void Deleting_a_family_is_refused_while_any_variant_is_in_use_and_deletes_nothing()
    {
        var inter = Family("Inter");
        Variant(inter);
        var bold = Variant(inter, 700);
        UsedBy("Article OG image", bold);

        var result = _fixture.Service().DeleteFamily(inter.Key);

        Assert.Equal(TreeOperationOutcome.InUse, result.Outcome);
        Assert.Equal("Article OG image", Assert.Single(result.InUse).Name);
        Assert.NotNull(_fixture.Families.Get(inter.Key));
        Assert.Equal(2, _fixture.Fonts.GetAll().Count);
    }

    [Fact]
    public void Deleting_an_unused_family_deletes_it_and_its_variants()
    {
        var inter = Family("Inter");
        Variant(inter);
        Variant(inter, 700);
        var lora = Family("Lora");
        var loraRegular = Variant(lora);

        Assert.Equal(TreeOperationOutcome.Success, _fixture.Service().DeleteFamily(inter.Key).Outcome);

        Assert.Null(_fixture.Families.Get(inter.Key));
        Assert.Equal(loraRegular.Key, Assert.Single(_fixture.Fonts.GetAll()).Key);
    }

    [Fact]
    public void Renaming_a_family_rewrites_every_variants_family_name()
    {
        var inter = Family("Inter");
        Variant(inter);
        Variant(inter, 700);

        var renamed = _fixture.Service().RenameFamily(inter.Key, "  Inter Display ", out var outcome);

        Assert.Equal(TreeOperationOutcome.Success, outcome);
        Assert.Equal("Inter Display", renamed!.Name);
        Assert.All(_fixture.Fonts.GetAll(), f => Assert.Equal("Inter Display", f.FamilyName));

        _fixture.Service().RenameFamily(inter.Key, " ", out outcome);
        Assert.Equal(TreeOperationOutcome.InvalidName, outcome);
    }

    [Fact]
    public void A_family_moves_into_a_folder_and_goes_last_there()
    {
        var brand = _fixture.FolderService().Create("Brand", null).Folder!;
        var lora = Family("Lora", brand.Key);
        var inter = Family("Inter");

        Assert.Equal(TreeOperationOutcome.Success, _fixture.Service().MoveFamily(inter.Key, brand.Key));

        Assert.Equal(["Lora", "Inter"], _fixture.FolderService().GetTree().ChildrenOf(brand.Key).Select(n => n.Name));
        Assert.Equal(TreeOperationOutcome.TargetNotFound, _fixture.Service().MoveFamily(lora.Key, Guid.NewGuid()));
    }

    [Fact]
    public void A_font_folder_holding_a_family_cannot_be_deleted_or_moved_into_its_own_child()
    {
        var folders = _fixture.FolderService();
        var brand = folders.Create("Brand", null).Folder!;
        var display = folders.Create("Display", brand.Key).Folder!;
        Family("Inter", display.Key);

        Assert.Equal(TreeOperationOutcome.NotEmpty, folders.Delete(display.Key).Outcome);
        Assert.Equal(TreeOperationOutcome.WouldCreateCycle, folders.Move(brand.Key, display.Key).Outcome);
    }

    [Fact]
    public void Sorting_the_root_orders_folders_and_families_together()
    {
        var brand = _fixture.FolderService().Create("Brand", null).Folder!;
        var inter = Family("Inter");
        var lora = Family("Lora");

        _fixture.Service().SortChildren(null, [(lora.Key, 0), (brand.Key, 2)]);

        Assert.Equal(["Lora", "Inter", "Brand"], _fixture.FolderService().GetTree().ChildrenOf(null).Select(n => n.Name));
        Assert.NotEqual(inter.Key, lora.Key);
    }

    /// <summary>An export from before families: no FamilyKey. It joins the family of its name.</summary>
    [Fact]
    public void An_upserted_row_without_a_family_joins_the_family_of_its_name_or_a_new_one()
    {
        var inter = Family("Inter");

        var joined = _fixture.Service().Upsert(new FontDefinition { Key = Guid.NewGuid(), FamilyName = " inter", Weight = 700 });
        var created = _fixture.Service().Upsert(new FontDefinition { Key = Guid.NewGuid(), FamilyName = "Lora" });

        Assert.Equal(inter.Key, joined.FamilyKey);
        Assert.Equal("Inter", joined.FamilyName);
        Assert.Equal("Lora", _fixture.Families.Get(created.FamilyKey!.Value)!.Name);
        Assert.Null(_fixture.Families.Get(created.FamilyKey!.Value)!.ParentKey);
    }

    [Fact]
    public void Templates_using_a_family_roll_up_its_variants()
    {
        var inter = Family("Inter");
        UsedBy("One", Variant(inter));
        UsedBy("Two", Variant(inter, 700));

        Assert.Equal(["One", "Two"], _fixture.Service().TemplatesUsingFamily(inter.Key).Select(t => t.Name).Order());
    }
}
