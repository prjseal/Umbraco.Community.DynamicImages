using Umbraco.Community.DynamicImages.Api.Controllers;
using Xunit;
using GroupInfo = Umbraco.Community.DynamicImages.Api.Controllers.DocumentTypesController.GroupInfo;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// Where DocumentTypesController says a property sits - its tab, group and their sort orders -
/// which the inspector turns into "Tab › Group" option groups in document type order.
/// </summary>
public class DocumentTypePlacementTests
{
    private static GroupInfo Tab(string alias, string name, int sort, params string[] properties)
        => new(alias, name, IsTab: true, sort, properties);

    private static GroupInfo Group(string alias, string name, int sort, params string[] properties)
        => new(alias, name, IsTab: false, sort, properties);

    [Fact]
    public void A_group_on_a_tab_carries_the_tabs_name_and_both_sort_orders()
    {
        var groups = new[]
        {
            Tab("content", "Content", 1),
            Tab("seo", "SEO", 2),
            Group("seo/meta", "Meta", 5, "metaTitle"),
        };

        var placement = DocumentTypesController.Place(groups, "metaTitle");

        Assert.Equal(new DocumentTypesController.Placement("Meta", "SEO", 2, 5), placement);
    }

    [Fact]
    public void A_group_with_no_tab_has_no_tab_and_sorts_first()
    {
        var groups = new[] { Group("details", "Details", 3, "title") };

        var placement = DocumentTypesController.Place(groups, "title");

        Assert.Equal(new DocumentTypesController.Placement("Details", null, -1, 3), placement);
    }

    [Fact]
    public void A_property_directly_on_a_tab_has_the_tab_as_its_group()
    {
        var groups = new[] { Tab("content", "Content", 4, "bodyText"), Group("content/extra", "Extra", 0, "note") };

        var placement = DocumentTypesController.Place(groups, "bodyText");

        // Before the tab's own groups, as the Document Type editor lists them.
        Assert.Equal(new DocumentTypesController.Placement("Content", null, 4, -1), placement);
    }

    [Fact]
    public void A_compositions_groups_are_read_like_the_types_own()
    {
        // CompositionPropertyGroups hands a composition's groups over alongside the type's own; a
        // composition's group on the type's tab resolves through the same alias prefix.
        var groups = new[]
        {
            Tab("content", "Content", 0),
            Group("content/hero", "Hero", 1, "heroTitle"),
            Group("content/seoComposition", "SEO (composed)", 9, "ogImage"),
        };

        Assert.Equal("Content", DocumentTypesController.Place(groups, "ogImage").Tab);
        Assert.Equal("SEO (composed)", DocumentTypesController.Place(groups, "ogImage").Group);
        Assert.Equal(9, DocumentTypesController.Place(groups, "ogImage").GroupSortOrder);
    }

    [Fact]
    public void A_property_in_no_group_is_other_and_sorts_last()
    {
        var placement = DocumentTypesController.Place([], "loose");

        Assert.Equal("Other", placement.Group);
        Assert.Equal(int.MaxValue, placement.TabSortOrder);
    }

    [Fact]
    public void Matching_is_by_alias_whatever_the_case()
    {
        var groups = new[] { Group("details", "Details", 3, "Title") };

        Assert.Equal("Details", DocumentTypesController.Place(groups, "title").Group);
    }
}
