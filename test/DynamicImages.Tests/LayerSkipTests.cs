using Microsoft.Extensions.Logging.Abstractions;
using SixLabors.Fonts;
using FontFamily = SixLabors.Fonts.FontFamily;
using SixLabors.ImageSharp;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Community.DynamicImages.Core.Rendering.Layers;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// C5 - a layer that draws nothing is omitted from <see cref="LayerBounds"/> with no flag and no
/// reason, so the designer's Resolved values panel silently dropped its row. That is exactly the
/// case where an editor most needs telling: the image is missing something and nothing says why.
/// <para>
/// The <c>Task&lt;LayerBounds?&gt;</c> contract is unchanged - relative layout depends on "no
/// bounds means did not draw" - so the reason travels beside it.
/// </para>
/// </summary>
public class LayerSkipTests
{
    private static readonly Guid FontKey = new("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");

    private static DynamicImageRenderer Renderer(IImageSourceProvider? images = null)
    {
        images ??= new NoImages();

        return new DynamicImageRenderer(
            new LayerRendererCollection(() =>
            [
                new RectLayerRenderer(),
                new ImageLayerRenderer(images),
                new TextLayerRenderer(new FileFontRegistry(), NullLogger<TextLayerRenderer>.Instance),
            ]),
            images,
            new RenderGate(),
            NullLogger<DynamicImageRenderer>.Instance);
    }

    private static Template Template(params LayerBase[] layers) => new()
    {
        Alias = "test",
        Name = "Test",
        Canvas = new CanvasSettings { Width = 400, Height = 200, Background = "#000000", BaseImage = ImageSource.None() },
        Layers = [.. layers],
    };

    private static TextLayer Text(string binding = "title") => new()
    {
        Name = "Text",
        Position = new Position { X = 10, Y = 10, Anchor = Anchor.TopLeft },
        Size = new LayerSize { Width = 380 },
        Binding = new TextBinding { Kind = TextBindingKind.Property, PropertyAlias = binding },
        Style = new TextStyle { FontKey = FontKey, FontSize = 24, Colour = "#FFFFFF" },
    };

    private static IRenderValueSource Values(string? title = "Hello", bool flag = false) =>
        new DictionaryRenderValueSource("Node name", new Dictionary<string, string?>
        {
            ["title"] = title,
            ["flag"] = flag ? "1" : "0",
        });

    private static async Task<LayoutResult> Layout(Template template, IRenderValueSource values, IImageSourceProvider? images = null)
        => await Renderer(images).MeasureLayoutAsync(template, values);

    private static string ReasonFor(LayoutResult layout, LayerBase layer)
    {
        var skip = Assert.Single(layout.Skips, candidate => candidate.LayerKey == layer.Key);
        return skip.Reason;
    }

    [Fact]
    public async Task A_layer_that_drew_is_not_reported_as_skipped()
    {
        var text = Text();
        var layout = await Layout(Template(text), Values());

        Assert.Contains(layout.Bounds, bounds => bounds.LayerKey == text.Key);
        Assert.DoesNotContain(layout.Skips, skip => skip.LayerKey == text.Key);
    }

    [Fact]
    public async Task An_empty_text_layer_says_so()
    {
        var text = Text();
        var layout = await Layout(Template(text), Values(title: null));

        Assert.DoesNotContain(layout.Bounds, bounds => bounds.LayerKey == text.Key);
        Assert.Equal(LayerSkipReasons.EmptyText, ReasonFor(layout, text));
    }

    [Fact]
    public async Task A_hidden_layer_says_so()
    {
        var text = Text();
        text.IsVisible = false;

        Assert.Equal(LayerSkipReasons.Hidden, ReasonFor(await Layout(Template(text), Values()), text));
    }

    [Fact]
    public async Task A_fully_transparent_layer_says_so()
    {
        var text = Text();
        text.Opacity = 0;

        Assert.Equal(LayerSkipReasons.Transparent, ReasonFor(await Layout(Template(text), Values()), text));
    }

    [Fact]
    public async Task An_unmet_visibility_rule_says_so()
    {
        var text = Text();
        text.Visibility = new Visibility { Rule = VisibilityRuleKind.WhenPropertyTruthy, PropertyAlias = "flag" };

        var layout = await Layout(Template(text), Values(flag: false));

        Assert.Equal(LayerSkipReasons.VisibilityRule, ReasonFor(layout, text));
    }

    [Fact]
    public async Task A_met_visibility_rule_draws()
    {
        var text = Text();
        text.Visibility = new Visibility { Rule = VisibilityRuleKind.WhenPropertyTruthy, PropertyAlias = "flag" };

        var layout = await Layout(Template(text), Values(flag: true));

        Assert.Contains(layout.Bounds, bounds => bounds.LayerKey == text.Key);
        Assert.Empty(layout.Skips);
    }

    /// <summary>The finding's own case: the site was missing its media files, so the Image row vanished.</summary>
    [Fact]
    public async Task An_image_that_could_not_be_loaded_says_so()
    {
        var image = new ImageLayer
        {
            Name = "Image",
            Position = new Position { X = 10, Y = 10, Anchor = Anchor.TopLeft },
            Size = new LayerSize { Width = 100, Height = 100 },
            Source = ImageSource.None(),
        };

        var layout = await Layout(Template(image), Values());

        Assert.DoesNotContain(layout.Bounds, bounds => bounds.LayerKey == image.Key);
        Assert.Equal(LayerSkipReasons.NoImage, ReasonFor(layout, image));
    }

    [Fact]
    public async Task A_missing_font_says_so()
    {
        var text = Text();
        text.Style.FontKey = Guid.Empty;

        var layout = await Layout(Template(text), Values());

        Assert.Equal(LayerSkipReasons.NoFont, ReasonFor(layout, text));
    }

    [Fact]
    public async Task A_shape_with_no_paint_says_so()
    {
        var rect = new RectLayer
        {
            Name = "Shape",
            Fill = null,
            Border = null,
            Position = new Position { X = 0, Y = 0, Anchor = Anchor.TopLeft },
            Size = new LayerSize { Width = 100, Height = 50 },
        };

        var layout = await Layout(Template(rect), Values());

        Assert.NotEmpty(ReasonFor(layout, rect));
    }

    [Fact]
    public async Task Every_layer_is_either_drawn_or_explained()
    {
        // The property the panel now relies on: for any template, bounds and skips together
        // account for every layer, so a row can always be rendered with something in it.
        var drew = Text();
        var empty = Text("missing");
        var hidden = Text();
        hidden.IsVisible = false;

        var layout = await Layout(Template(drew, empty, hidden), Values());

        foreach (var layer in new LayerBase[] { drew, empty, hidden })
        {
            var drawn = layout.Bounds.Any(bounds => bounds.LayerKey == layer.Key);
            var explained = layout.Skips.Any(skip => skip.LayerKey == layer.Key);

            Assert.True(drawn ^ explained, $"layer '{layer.Name}' was neither drawn nor explained");
        }
    }

    [Fact]
    public async Task A_render_reports_the_same_skips_as_a_measure()
    {
        var text = Text();
        text.IsVisible = false;

        using var result = await Renderer().RenderAsync(Template(text), Values());

        Assert.Equal(LayerSkipReasons.Hidden, Assert.Single(result.Skips).Reason);
    }

    /// <summary>A real font off disk, so text genuinely lays out. Guid.Empty means "no such font".</summary>
    private sealed class FileFontRegistry : IFontRegistry
    {
        private readonly FontFamily _family;

        public FileFontRegistry()
        {
            var collection = new FontCollection();
            _family = collection.Add(Path.Combine("Assets", "Inter-Regular.ttf"));
        }

        public Task<FontFamily?> GetFamilyAsync(Guid fontKey, CancellationToken cancellationToken = default)
            => Task.FromResult<FontFamily?>(fontKey == Guid.Empty ? null : _family);

        public Task<Font?> GetFontAsync(Guid fontKey, float size, string? fontStyle, CancellationToken cancellationToken = default)
            => Task.FromResult<Font?>(fontKey == Guid.Empty ? null : _family.CreateFont(size, FontStyle.Regular));

        public void Clear() { }

        public void Clear(Guid fontKey) { }
    }
}
