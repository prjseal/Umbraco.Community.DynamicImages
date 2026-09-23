using Microsoft.Extensions.Logging.Abstractions;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.Persistence;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

public class TemplateTreeTests
{
    private static readonly Guid Social = Guid.Parse("10000000-0000-0000-0000-000000000001");
    private static readonly Guid Blog = Guid.Parse("10000000-0000-0000-0000-000000000002");
    private static readonly Guid Archive = Guid.Parse("10000000-0000-0000-0000-000000000003");

    private static TemplateFolder Folder(Guid key, string name, Guid? parent = null) => new() { Key = key, Name = name, ParentKey = parent };

    private static Template Tpl(string name, Guid? parent = null, bool enabled = true)
        => new() { Key = Guid.NewGuid(), Alias = name.ToLowerInvariant(), Name = name, ParentKey = parent, IsEnabled = enabled };

    /// <summary>Social ⊃ Blog ⊃ Archive, plus a template at each level.</summary>
    private static TemplateTree Sample(out Template atRoot, out Template inBlog)
    {
        atRoot = Tpl("Zebra");
        inBlog = Tpl("Post card", Blog);

        return new TemplateTree(
            [Folder(Blog, "Blog", Social), Folder(Social, "Social"), Folder(Archive, "Archive", Blog)],
            [atRoot, Tpl("Apple"), inBlog]);
    }

    [Fact]
    public void The_root_lists_folders_first_then_templates_each_by_name()
    {
        var tree = Sample(out _, out _);

        var names = tree.ChildrenOf(null).Select(n => n.Name).ToList();

        Assert.Equal(["Social", "Apple", "Zebra"], names);
        Assert.True(tree.ChildrenOf(null)[0].HasChildren);
    }

    [Fact]
    public void A_folders_children_are_its_own()
    {
        var tree = Sample(out _, out var inBlog);

        var children = tree.ChildrenOf(Blog);

        Assert.Equal(["Archive", "Post card"], children.Select(c => c.Name));
        Assert.Equal(inBlog.Key, children[1].Key);
        Assert.False(children[0].HasChildren);
    }

    [Fact]
    public void Folders_only_leaves_templates_out_and_counts_only_subfolders()
    {
        var tree = Sample(out _, out _);

        Assert.Equal(["Social"], tree.ChildrenOf(null, foldersOnly: true).Select(n => n.Name));

        var blog = Assert.Single(tree.ChildrenOf(Social, foldersOnly: true));
        Assert.True(blog.HasChildren);
        Assert.False(Assert.Single(tree.ChildrenOf(Blog, foldersOnly: true)).HasChildren);
    }

    [Fact]
    public void Ancestors_run_from_the_top_down_to_the_item_itself()
    {
        var tree = Sample(out _, out var inBlog);

        Assert.Equal([Social, Blog, inBlog.Key], tree.AncestorsOf(inBlog.Key).Select(a => a.Key));
        Assert.Equal(2, tree.DepthOf(inBlog.Key));
        Assert.Empty(tree.AncestorsOf(Guid.NewGuid()));
    }

    [Fact]
    public void A_template_whose_folder_is_gone_shows_at_the_root()
    {
        var orphan = Tpl("Orphan", Guid.NewGuid());
        var tree = new TemplateTree([], [orphan]);

        var root = Assert.Single(tree.ChildrenOf(null));
        Assert.Equal(orphan.Key, root.Key);
        Assert.Null(root.ParentKey);
    }

    [Theory]
    [InlineData("self", true)]
    [InlineData("child", true)]
    [InlineData("grandchild", true)]
    [InlineData("root", false)]
    [InlineData("unrelated", false)]
    public void Moving_a_folder_into_itself_or_below_it_is_a_cycle(string target, bool cycle)
    {
        var sibling = Guid.NewGuid();
        var tree = new TemplateTree(
            [Folder(Social, "Social"), Folder(Blog, "Blog", Social), Folder(Archive, "Archive", Blog), Folder(sibling, "Other")],
            []);

        Guid? targetKey = target switch
        {
            "self" => Social,
            "child" => Blog,
            "grandchild" => Archive,
            "unrelated" => sibling,
            _ => null
        };

        Assert.Equal(cycle, tree.WouldCreateCycle(Social, targetKey));
        Assert.Equal(
            cycle ? TreeOperationOutcome.WouldCreateCycle : TreeOperationOutcome.Success,
            TemplateFolderService.CheckMove(tree, Social, targetKey));
    }

    [Fact]
    public void A_move_to_a_folder_that_does_not_exist_is_refused()
    {
        var tree = new TemplateTree([Folder(Social, "Social")], []);

        Assert.Equal(TreeOperationOutcome.TargetNotFound, TemplateFolderService.CheckMove(tree, Social, Guid.NewGuid()));
    }

    // ------------------------------------------------------------ sort order

    private static TemplateFolder Folder(Guid key, string name, int sortOrder, Guid? parent = null)
        => new() { Key = key, Name = name, ParentKey = parent, SortOrder = sortOrder };

    private static Template Tpl(string name, int sortOrder)
    {
        var template = Tpl(name);
        template.SortOrder = sortOrder;
        return template;
    }

    [Fact]
    public void Sort_order_comes_first_and_ties_go_folders_first_then_by_name()
    {
        var tree = new TemplateTree(
            [Folder(Social, "Social", 1), Folder(Blog, "Blog", 0), Folder(Archive, "Archive", 1)],
            [Tpl("Zebra", 0), Tpl("Apple", 0), Tpl("First", -1), Tpl("Mango", 1)]);

        Assert.Equal(
            ["First", "Blog", "Apple", "Zebra", "Archive", "Social", "Mango"],
            tree.ChildrenOf(null).Select(n => n.Name));
    }

    [Fact]
    public void The_next_sort_order_is_one_past_the_highest_sibling()
    {
        var tree = new TemplateTree([Folder(Social, "Social", 4), Folder(Blog, "Blog", 0, Social)], [Tpl("Card", 7)]);

        Assert.Equal(8, tree.NextSortOrder(null));
        Assert.Equal(1, tree.NextSortOrder(Social));
        Assert.Equal(0, tree.NextSortOrder(Blog));
    }

    /// <summary>
    /// The sort modal sends only what was dragged, at its final index. Here the list was
    /// Social, Apple, Zebra (all zeros) and Zebra was dragged to the top.
    /// </summary>
    [Fact]
    public void Sorting_places_the_dragged_children_and_the_rest_keep_their_order()
    {
        var apple = Tpl("Apple");
        var zebra = Tpl("Zebra");
        var tree = new TemplateTree([Folder(Social, "Social")], [apple, zebra]);

        var changes = tree.ApplySort(null, [(zebra.Key, 0)]);

        Assert.Equal([zebra.Key, Social, apple.Key], changes.OrderBy(c => c.SortOrder).Select(c => c.Key));
        Assert.Equal([0, 1, 2], changes.Select(c => c.SortOrder));
        Assert.True(changes.Single(c => c.Key == Social).IsFolder);
    }

    [Fact]
    public void Sorting_ignores_keys_that_are_not_children_and_clamps_stale_indexes()
    {
        var apple = Tpl("Apple");
        var zebra = Tpl("Zebra");
        var tree = new TemplateTree([], [apple, zebra]);

        var changes = tree.ApplySort(null, [(Guid.NewGuid(), 0), (apple.Key, 9)]);

        Assert.Equal([zebra.Key, apple.Key], changes.OrderBy(c => c.SortOrder).Select(c => c.Key));
    }

    [Fact]
    public async Task Sorting_through_the_service_writes_folders_and_templates_and_the_tree_follows()
    {
        var templateRows = new InMemoryTemplateRepository();
        var folderRows = new InMemoryTemplateFolderRepository();
        var templates = ServiceFakes.TemplateService(templateRows, folderRows);
        var folders = new TemplateFolderService(folderRows, new RepositoryTemplateCache(templateRows), new NullEventAggregator());

        var social = folders.Create("Social", null).Folder!;
        var card = (await templates.CreateAsync(new Template { Name = "Card" }, null)).Template!;
        var banner = (await templates.CreateAsync(new Template { Name = "Banner" }, null)).Template!;

        // Appended in creation order: Social 0, Card 1, Banner 2.
        Assert.Equal(["Social", "Card", "Banner"], folders.GetTree().ChildrenOf(null).Select(n => n.Name));

        Assert.Equal(TreeOperationOutcome.Success, await templates.SortChildrenAsync(null, [(banner.Key, 0), (social.Key, 2)]));

        Assert.Equal(["Banner", "Card", "Social"], folders.GetTree().ChildrenOf(null).Select(n => n.Name));
        Assert.Equal(2, folderRows.Get(social.Key)!.SortOrder);
        Assert.Equal(TreeOperationOutcome.NotFound, await templates.SortChildrenAsync(Guid.NewGuid(), []));
    }

    [Fact]
    public async Task A_moved_template_goes_last_in_its_new_folder()
    {
        var templateRows = new InMemoryTemplateRepository();
        var folderRows = new InMemoryTemplateFolderRepository();
        var templates = ServiceFakes.TemplateService(templateRows, folderRows);
        var folders = new TemplateFolderService(folderRows, new RepositoryTemplateCache(templateRows), new NullEventAggregator());

        var social = folders.Create("Social", null).Folder!;
        await templates.CreateAsync(new Template { Name = "Zebra", ParentKey = social.Key }, null);
        var apple = (await templates.CreateAsync(new Template { Name = "Apple" }, null)).Template!;

        await templates.MoveAsync(apple.Key, social.Key);

        Assert.Equal(["Zebra", "Apple"], folders.GetTree().ChildrenOf(social.Key).Select(n => n.Name));
    }

    [Fact]
    public void The_sort_order_is_a_column_and_not_in_the_json()
    {
        var repository = new TemplateRepository(null!, new TemplateJsonMigrator(), NullLogger<TemplateRepository>.Instance);
        var template = Tpl("Card", 5);

        var dto = TemplateRepository.ToDto(template, null);

        Assert.Equal(5, dto.SortOrder);
        Assert.DoesNotContain("sortOrder", dto.Json, StringComparison.OrdinalIgnoreCase);
        Assert.Equal(5, repository.Map(dto)!.SortOrder);
    }

    // ------------------------------------------------------------ the service

    private static (TemplateFolderService Service, FakeTemplateService Templates, InMemoryTemplateFolderRepository Folders) Service()
    {
        var templates = new FakeTemplateService();
        var folders = new InMemoryTemplateFolderRepository();

        return (new TemplateFolderService(folders, new FakeTemplateCache(templates), new NullEventAggregator()), templates, folders);
    }

    [Fact]
    public async Task A_folder_holding_a_template_cannot_be_deleted()
    {
        var (service, templates, _) = Service();
        var folder = service.Create("Social", null).Folder!;
        await templates.CreateAsync(Tpl("Card", folder.Key), null);

        Assert.Equal(TreeOperationOutcome.NotEmpty, service.Delete(folder.Key).Outcome);
        Assert.NotNull(service.Get(folder.Key));
    }

    [Fact]
    public void A_folder_holding_a_folder_cannot_be_deleted_but_an_empty_one_can()
    {
        var (service, _, _) = Service();
        var outer = service.Create("Outer", null).Folder!;
        var inner = service.Create("Inner", outer.Key).Folder!;

        Assert.Equal(TreeOperationOutcome.NotEmpty, service.Delete(outer.Key).Outcome);
        Assert.Equal(TreeOperationOutcome.Success, service.Delete(inner.Key).Outcome);
        Assert.Equal(TreeOperationOutcome.Success, service.Delete(outer.Key).Outcome);
    }

    [Fact]
    public void The_service_refuses_a_move_into_a_descendant()
    {
        var (service, _, _) = Service();
        var outer = service.Create("Outer", null).Folder!;
        var inner = service.Create("Inner", outer.Key).Folder!;

        Assert.Equal(TreeOperationOutcome.WouldCreateCycle, service.Move(outer.Key, inner.Key).Outcome);
        Assert.Null(service.Get(outer.Key)!.ParentKey);
        Assert.Equal(TreeOperationOutcome.Success, service.Move(inner.Key, null).Outcome);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void A_folder_needs_a_name(string name)
    {
        var (service, _, _) = Service();

        Assert.Equal(TreeOperationOutcome.InvalidName, service.Create(name, null).Outcome);
    }

    [Fact]
    public void Upsert_puts_a_folder_whose_parent_is_missing_at_the_root()
    {
        var (service, _, _) = Service();

        var saved = service.Upsert(new TemplateFolder { Key = Social, Name = "Social", ParentKey = Guid.NewGuid() });

        Assert.Null(saved.ParentKey);
    }

    // ------------------------------------------------------------ the repository mapping

    [Fact]
    public void The_parent_key_is_written_to_its_column()
    {
        var dto = TemplateRepository.ToDto(Tpl("Card", Social), null);

        Assert.Equal(Social, dto.ParentKey);
        Assert.Contains($"\"parentKey\":\"{Social}\"", dto.Json);
    }

    [Fact]
    public void The_parent_key_column_is_authoritative_over_the_json()
    {
        var repository = new TemplateRepository(null!, new TemplateJsonMigrator(), NullLogger<TemplateRepository>.Instance);

        // The JSON still says Social - as it does after a move, which only writes the column.
        var dto = TemplateRepository.ToDto(Tpl("Card", Social), null);
        dto.ParentKey = Blog;

        Assert.Equal(Blog, repository.Map(dto)!.ParentKey);

        dto.ParentKey = null;
        Assert.Null(repository.Map(dto)!.ParentKey);
    }

    [Fact]
    public void A_template_saved_before_folders_existed_reads_as_at_the_root()
    {
        var repository = new TemplateRepository(null!, new TemplateJsonMigrator(), NullLogger<TemplateRepository>.Instance);

        var dto = TemplateRepository.ToDto(Tpl("Card"), null);
        dto.Json = dto.Json.Replace("\"parentKey\":null,", string.Empty);

        Assert.DoesNotContain("parentKey", dto.Json);
        Assert.Null(repository.Map(dto)!.ParentKey);
    }

    [Fact]
    public void A_folder_maps_to_and_from_its_row()
    {
        var folder = Folder(Blog, "Blog", Social);

        var round = TemplateFolderRepository.Map(TemplateFolderRepository.ToDto(folder));

        Assert.Equal((folder.Key, folder.Name, folder.ParentKey), (round.Key, round.Name, round.ParentKey));
    }
}
