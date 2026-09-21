using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

public class SampleDataTests
{
    private static Template With(params LayerBase[] layers)
    {
        var template = new Template { Alias = "test", Name = "Test" };
        foreach (var layer in layers) template.Layers.Add(layer);
        return template;
    }

    [Fact]
    public void ADottedAliasIsSeededAsAFlatKey()
    {
        // The dictionary source does not traverse: the dotted string is the key, so seeding it
        // directly is all that is needed for the designer preview to show something.
        var layer = new TextLayer
        {
            Binding = new TextBinding { Kind = TextBindingKind.Property, PropertyAlias = "author.jobTitle" }
        };

        Assert.Equal("Sample value", SampleData.Build(With(layer)).GetText("author.jobTitle"));
    }

    [Fact]
    public void ADottedAliasInAnExpressionIsSeededToo()
    {
        var layer = new TextLayer
        {
            Binding = new TextBinding { Kind = TextBindingKind.Expression, Text = "By {prop:author.jobTitle}" }
        };

        Assert.Equal("By Sample value", TextResolver.Resolve(layer.Binding, SampleData.Build(With(layer))));
    }

    [Fact]
    public void AVisibilityAliasIsSeededTruthy()
    {
        // Without this a WhenPropertyTruthy layer vanished from the designer preview while
        // rendering perfectly on the real node.
        var layer = new RectLayer { Fill = "#000000" };
        layer.Visibility.Rule = VisibilityRuleKind.WhenPropertyTruthy;
        layer.Visibility.PropertyAlias = "showScrim";

        Assert.True(SampleData.Build(With(layer)).IsTruthy("showScrim"));
    }

    [Fact]
    public void ADottedVisibilityAliasIsSeededTruthy()
    {
        var layer = new ImageLayer();
        layer.Visibility.Rule = VisibilityRuleKind.WhenPropertyTruthy;
        layer.Visibility.PropertyAlias = "author.isFeatured";

        Assert.True(SampleData.Build(With(layer)).IsTruthy("author.isFeatured"));
    }

    [Fact]
    public void ASeededTextAliasIsNotOverwrittenByTheVisibilitySeed()
    {
        // TryAdd, not an assignment: a layer that both reads and is gated on an alias keeps the
        // more useful sample text.
        var layer = new TextLayer
        {
            Binding = new TextBinding { Kind = TextBindingKind.Property, PropertyAlias = "subtitle" }
        };
        layer.Visibility.Rule = VisibilityRuleKind.WhenPropertyTruthy;
        layer.Visibility.PropertyAlias = "subtitle";

        Assert.Equal("A short standfirst that sits under the headline", SampleData.Build(With(layer)).GetText("subtitle"));
    }
}
