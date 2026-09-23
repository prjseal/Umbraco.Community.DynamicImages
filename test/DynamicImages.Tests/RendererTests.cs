using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging.Abstractions;
using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
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
/// End-to-end renderer tests. Everything the renderer needs beyond ImageSharp comes through
/// interfaces, so these run with a canned value source and a font loaded from disk - no database,
/// no Umbraco boot.
/// </summary>
public class RendererTests
{
    private static readonly Guid FontKey = new("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");

    private static DynamicImageRenderer Renderer() => new(
        new LayerRendererCollection(() =>
        [
            new RectLayerRenderer(),
            new ImageLayerRenderer(new NoImages()),
            new TextLayerRenderer(new FileFontRegistry(), NullLogger<TextLayerRenderer>.Instance),
            new BadgesLayerRenderer(new FileFontRegistry(), new NoWebRoot(), NullLogger<BadgesLayerRenderer>.Instance),
        ]),
        new NoImages(),
        new RenderGate(),
        NullLogger<DynamicImageRenderer>.Instance);

    private static Template Template(params LayerBase[] layers) => new()
    {
        Alias = "test",
        Name = "Test",
        Canvas = new CanvasSettings { Width = 400, Height = 200, Background = "#000000", BaseImage = ImageSource.None() },
        Layers = [.. layers],
    };

    private static TextLayer Text(string binding = "title", float x = 10, float y = 10, Anchor anchor = Anchor.TopLeft) => new()
    {
        Name = "Text",
        Position = new Position { X = x, Y = y, Anchor = anchor },
        Size = new LayerSize { Width = 380 },
        Binding = new TextBinding { Kind = TextBindingKind.Property, PropertyAlias = binding },
        Style = new TextStyle { FontKey = FontKey, FontSize = 24, Colour = "#FFFFFF" },
    };

    private static IRenderValueSource Values(string title = "Hello", string? subtitle = null) =>
        new DictionaryRenderValueSource("Node name", new Dictionary<string, string?> { ["title"] = title, ["subtitle"] = subtitle });

    private static RectLayer Rect(string name, float x, float y, float width = 100, float height = 50) => new()
    {
        Name = name,
        Fill = "#FF0000",
        Position = new Position { X = x, Y = y, Anchor = Anchor.TopLeft },
        Size = new LayerSize { Width = width, Height = height },
    };

    private static RelativeReference Ref(LayerBase target, RelativeEdge edge, float gap) => new()
    {
        LayerKey = target.Key,
        Edge = edge,
        Gap = gap,
    };

    private static BadgesLayer Badges(BadgeLabelPosition labelPosition, bool wrap = false, float? width = null) => new()
    {
        Name = "Badges",
        ItemsPropertyAlias = "categories",
        MaxItems = 3,
        Gap = 40,
        Wrap = wrap,
        Size = new LayerSize { Width = width },
        Position = new Position { X = 10, Y = 10, Anchor = Anchor.TopLeft },
        Icon = new BadgeIcon { Kind = BadgeIconKind.None },
        Badge = new BadgeCircle { Size = 40 },
        Label = new BadgeLabel { FontKey = FontKey, FontSize = 16, Gap = 6, Position = labelPosition, Colour = "#FFFFFF" },
    };

    private static IRenderValueSource BadgeValues() => new DictionaryRenderValueSource(
        "Node",
        new Dictionary<string, string?> { ["title"] = "Hello" },
        items: new Dictionary<string, IReadOnlyList<BadgeItem>>
        {
            ["categories"] =
            [
                new BadgeItem("Umbraco", new Dictionary<string, string?>()),
                new BadgeItem("Development", new Dictionary<string, string?>()),
                new BadgeItem("C#", new Dictionary<string, string?>()),
            ],
        });

    private const string LongTitle = "A title long enough that it certainly wraps onto a second line in the box";

    [Fact]
    public async Task RenderAsync_PaintsTheCanvasBackground()
    {
        var template = Template();
        template.Canvas.Background = "#112233";

        using var result = await Renderer().RenderAsync(template, Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(400, image.Width);
        Assert.Equal(200, image.Height);
        Assert.Equal(new Rgba32(0x11, 0x22, 0x33, 255), image[5, 5]);
    }

    [Fact]
    public async Task RenderAsync_DrawsTextAndReportsItsBounds()
    {
        using var result = await Renderer().RenderAsync(Template(Text()), Values());

        var bounds = Assert.Single(result.Bounds);
        Assert.Equal("Hello", bounds.ResolvedText);
        Assert.True(bounds.Width > 0 && bounds.Height > 0);

        using var image = result.Image.CloneAs<Rgba32>();
        Assert.True(HasNonBackgroundPixels(image), "the text should have marked the canvas");
    }

    [Fact]
    public async Task RenderAsync_SkipsALayerWhoseValueIsEmpty()
    {
        using var result = await Renderer().RenderAsync(Template(Text()), Values(title: string.Empty));

        // An absent value means an absent layer, not an empty box.
        Assert.Empty(result.Bounds);
    }

    [Fact]
    public async Task RenderAsync_SkipsAHiddenLayer()
    {
        var layer = Text();
        layer.IsVisible = false;

        using var result = await Renderer().RenderAsync(Template(layer), Values());

        Assert.Empty(result.Bounds);
    }

    [Fact]
    public async Task RenderAsync_HonoursAWhenPropertyTruthyRule()
    {
        var layer = Text();
        layer.Visibility = new Visibility { Rule = VisibilityRuleKind.WhenPropertyTruthy, PropertyAlias = "flag" };

        using var off = await Renderer().RenderAsync(Template(layer), Values());
        Assert.Empty(off.Bounds);

        var values = new DictionaryRenderValueSource(
            "Node", new Dictionary<string, string?> { ["title"] = "Hello", ["flag"] = "1" });

        using var on = await Renderer().RenderAsync(Template(layer), values);
        Assert.Single(on.Bounds);
    }

    [Fact]
    public async Task RenderAsync_AnchorsTextWhereTheAnchorSays()
    {
        var left = await Renderer().RenderAsync(Template(Text(x: 200, y: 100, anchor: Anchor.TopLeft)), Values());
        var right = await Renderer().RenderAsync(Template(Text(x: 200, y: 100, anchor: Anchor.TopRight)), Values());

        using (left)
        using (right)
        {
            // A right-anchored box ends where a left-anchored one begins, so it must sit further left.
            Assert.True(right.Bounds[0].X < left.Bounds[0].X,
                $"right-anchored X ({right.Bounds[0].X}) should be less than left-anchored ({left.Bounds[0].X})");
        }
    }

    [Fact]
    public async Task RenderAsync_DrawsARectangleWhereTheAnchorSays()
    {
        var rect = new RectLayer
        {
            Name = "Scrim",
            Fill = "#FF0000",
            Position = new Position { X = 0, Y = 0, Anchor = Anchor.TopLeft },
            Size = new LayerSize { Width = 100, Height = 50 },
        };

        using var result = await Renderer().RenderAsync(Template(rect), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 25]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[150, 25]);
    }

    [Fact]
    public async Task RenderAsync_KeepsGoingWhenALayerHasNoRenderer()
    {
        // A badges layer with no registered renderer must not abandon the rest of the image.
        var renderer = new DynamicImageRenderer(
            new LayerRendererCollection(() => [new RectLayerRenderer()]),
            new NoImages(),
            new RenderGate(),
            NullLogger<DynamicImageRenderer>.Instance);

        var template = Template(
            new BadgesLayer { Name = "Badges", ItemsPropertyAlias = "categories" },
            new RectLayer { Name = "Scrim", Fill = "#00FF00", Size = new LayerSize { Width = 10, Height = 10 } });

        using var result = await renderer.RenderAsync(template, Values());

        Assert.Single(result.Bounds);
    }

    [Fact]
    public async Task MeasureAsync_AgreesWithRenderAsync()
    {
        var template = Template(Text());

        using var rendered = await Renderer().RenderAsync(template, Values());
        var measured = await Renderer().MeasureAsync(template, Values());

        Assert.Equal(rendered.Bounds.Count, measured.Count);
        Assert.Equal(rendered.Bounds[0].X, measured[0].X, 3);
        Assert.Equal(rendered.Bounds[0].Y, measured[0].Y, 3);
    }

    [Fact]
    public async Task MeasureLayoutAsync_ProducesNoPixels()
    {
        // The designer calls the layout endpoint alongside the preview on every debounced change.
        // Measuring by rendering into a throwaway surface made that two full renders per
        // keystroke - so nothing here may decode an image or allocate a canvas.
        var images = new RefusesToDecode();
        var renderer = new DynamicImageRenderer(
            new LayerRendererCollection(() =>
            [
                new RectLayerRenderer(),
                new ImageLayerRenderer(images),
                new TextLayerRenderer(new FileFontRegistry(), NullLogger<TextLayerRenderer>.Instance),
            ]),
            images,
            new RenderGate(),
            NullLogger<DynamicImageRenderer>.Instance);

        var photo = new ImageLayer
        {
            Name = "Photo",
            Position = new Position { X = 10, Y = 10 },
            Source = new ImageSource { Kind = ImageSourceKind.Path, Path = "/photo.png" },
        };

        var template = Template(Text(), photo);
        template.Canvas.BaseImage = new ImageSource { Kind = ImageSourceKind.Path, Path = "/base.png" };

        var layout = await renderer.MeasureLayoutAsync(template, Values());

        Assert.Equal(2, layout.Bounds.Count);
    }

    [Fact]
    public async Task MeasureLayoutAsync_ReportsTheSameSkipsAsARender()
    {
        var hidden = Rect("Hidden", 0, 0);
        hidden.IsVisible = false;

        var template = Template(Text(), hidden);

        using var rendered = await Renderer().RenderAsync(template, Values());
        var layout = await Renderer().MeasureLayoutAsync(template, Values());

        Assert.Equal(
            rendered.Skips.Select(s => (s.LayerKey, s.Reason)).OrderBy(s => s.LayerKey),
            layout.Skips.Select(s => (s.LayerKey, s.Reason)).OrderBy(s => s.LayerKey));
    }

    /// <summary>
    /// Answers header questions and throws if anything asks it to decode. Measuring must only
    /// ever need the former.
    /// </summary>
    private sealed class RefusesToDecode : IImageSourceProvider
    {
        public Task<Image?> LoadAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
            => throw new InvalidOperationException("Measuring a layout must not decode an image.");

        public Task<bool> ExistsAsync(ImageSource? source, CancellationToken cancellationToken = default)
            => Task.FromResult(true);

        public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, CancellationToken cancellationToken = default)
            => Task.FromResult<(int, int)?>((120, 80));

        public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
            => Task.FromResult<(int, int)?>((120, 80));
    }

    [Fact]
    public async Task RenderAsync_ReportsATruncatedLayerAsTruncated()
    {
        var layer = Text(binding: "title");
        layer.Style.MaxLines = 1;
        layer.Style.Overflow = TextOverflow.Ellipsis;

        var values = new DictionaryRenderValueSource(
            "Node",
            new Dictionary<string, string?>
            {
                ["title"] = string.Join(' ', Enumerable.Repeat("words", 60)),
            });

        using var result = await Renderer().RenderAsync(Template(layer), values);

        Assert.True(result.Bounds[0].Truncated);
        Assert.EndsWith("…", result.Bounds[0].ResolvedText);
    }

    // ------------------------------------------------------------------ relative positioning

    [Fact]
    public async Task RenderAsync_PlacesADescriptionBelowTheTitleWhateverItsHeight()
    {
        var title = Text(binding: "title", x: 10, y: 10);
        var description = Text(binding: "subtitle", x: 10, y: 150);
        description.Position.RelativeY = Ref(title, RelativeEdge.Below, 10);

        using var oneLine = await Renderer().RenderAsync(Template(title, description), Values("Hello", "Body"));
        using var wrapped = await Renderer().RenderAsync(Template(title, description), Values(LongTitle, "Body"));

        var (shortTitle, shortDesc) = (oneLine.Bounds[0], oneLine.Bounds[1]);
        var (longTitle, longDesc) = (wrapped.Bounds[0], wrapped.Bounds[1]);

        Assert.Equal(shortTitle.Y + shortTitle.Height + 10, shortDesc.Y, 2);
        Assert.Equal(longTitle.Y + longTitle.Height + 10, longDesc.Y, 2);
        Assert.True(longTitle.Lines > 1);
        Assert.True(longDesc.Y > shortDesc.Y, "the description should move down with a taller title");
        Assert.Equal(10, shortDesc.X, 2);
    }

    [Fact]
    public async Task RenderAsync_ResolvesAForwardReferenceToALayerHigherInTheStack()
    {
        // The scrim is drawn first (index 0) but tracks the text drawn after it.
        var label = Text(x: 10, y: 20);
        var scrim = Rect("Scrim", 0, 0);
        scrim.Position.RelativeY = Ref(label, RelativeEdge.Below, 4);

        using var result = await Renderer().RenderAsync(Template(scrim, label), Values());

        var scrimBounds = result.Bounds.Single(b => b.LayerKey == scrim.Key);
        var labelBounds = result.Bounds.Single(b => b.LayerKey == label.Key);

        Assert.Equal(labelBounds.Y + labelBounds.Height + 4, scrimBounds.Y, 2);
    }

    [Fact]
    public async Task RenderAsync_FallsBackUpTheChainWhenTheReferenceIsEmpty()
    {
        var title = Text(binding: "title", x: 10, y: 10);
        var subtitle = Text(binding: "subtitle", x: 10, y: 60);
        subtitle.Position.RelativeY = Ref(title, RelativeEdge.Below, 4);
        var description = Text(binding: "title", x: 10, y: 150);
        description.Position.RelativeY = Ref(subtitle, RelativeEdge.Below, 10);

        // No subtitle value, so the description hangs off the title - with its own gap of 10, not 4.
        using var result = await Renderer().RenderAsync(Template(title, subtitle, description), Values("Hello", subtitle: null));

        Assert.Equal(2, result.Bounds.Count);
        var titleBounds = result.Bounds.Single(b => b.LayerKey == title.Key);
        var descBounds = result.Bounds.Single(b => b.LayerKey == description.Key);
        Assert.Equal(titleBounds.Y + titleBounds.Height + 10, descBounds.Y, 2);
    }

    [Fact]
    public async Task RenderAsync_FallsBackUpTheChainWhenTheReferenceIsHidden()
    {
        var title = Text(binding: "title", x: 10, y: 10);
        var subtitle = Text(binding: "subtitle", x: 10, y: 60);
        subtitle.IsVisible = false;
        subtitle.Position.RelativeY = Ref(title, RelativeEdge.Below, 4);
        var description = Text(binding: "title", x: 10, y: 150);
        description.Position.RelativeY = Ref(subtitle, RelativeEdge.Below, 10);

        using var result = await Renderer().RenderAsync(Template(title, subtitle, description), Values("Hello", "Sub"));

        var titleBounds = result.Bounds.Single(b => b.LayerKey == title.Key);
        var descBounds = result.Bounds.Single(b => b.LayerKey == description.Key);
        Assert.Equal(titleBounds.Y + titleBounds.Height + 10, descBounds.Y, 2);
    }

    [Fact]
    public async Task RenderAsync_UsesTheLayersOwnCoordinateWhenNothingOnTheChainDraws()
    {
        var subtitle = Text(binding: "subtitle", x: 10, y: 60);
        var description = Text(binding: "title", x: 10, y: 150);
        description.Position.RelativeY = Ref(subtitle, RelativeEdge.Below, 10);

        using var result = await Renderer().RenderAsync(Template(subtitle, description), Values("Hello", subtitle: null));

        var descBounds = Assert.Single(result.Bounds);
        Assert.Equal(150, descBounds.Y, 2);
    }

    [Fact]
    public async Task RenderAsync_TracksAboveByTheBottomEdge()
    {
        var title = Text(x: 10, y: 100);
        var kicker = Text(binding: "subtitle", x: 10, y: 0);
        kicker.Position.RelativeY = Ref(title, RelativeEdge.Above, 10);

        using var result = await Renderer().RenderAsync(Template(title, kicker), Values("Hello", "Kicker"));

        var titleBounds = result.Bounds.Single(b => b.LayerKey == title.Key);
        var kickerBounds = result.Bounds.Single(b => b.LayerKey == kicker.Key);
        Assert.Equal(titleBounds.Y - 10, kickerBounds.Y + kickerBounds.Height, 2);
    }

    [Fact]
    public async Task RenderAsync_TracksRightOfByTheLeftEdge()
    {
        var date = Text(x: 10, y: 10);
        date.Size.Width = null; // as wide as the text, so "right of" hugs it
        var dot = Rect("Dot", 300, 10, 8, 8);
        dot.Position.RelativeX = Ref(date, RelativeEdge.RightOf, 16);

        using var result = await Renderer().RenderAsync(Template(date, dot), Values());

        var dateBounds = result.Bounds.Single(b => b.LayerKey == date.Key);
        var dotBounds = result.Bounds.Single(b => b.LayerKey == dot.Key);
        Assert.Equal(dateBounds.X + dateBounds.Width + 16, dotBounds.X, 2);
        Assert.Equal(10, dotBounds.Y, 2);
    }

    [Fact]
    public async Task RenderAsync_RendersACycleAtTheLayersOwnCoordinates()
    {
        var a = Rect("A", 10, 20);
        var b = Rect("B", 30, 120);
        a.Position.RelativeY = Ref(b, RelativeEdge.Below, 10);
        b.Position.RelativeY = Ref(a, RelativeEdge.Below, 10);

        using var result = await Renderer().RenderAsync(Template(a, b), Values());

        Assert.Equal(20, result.Bounds.Single(x => x.LayerKey == a.Key).Y, 2);
        Assert.Equal(120, result.Bounds.Single(x => x.LayerKey == b.Key).Y, 2);
    }

    [Fact]
    public async Task MeasureAsync_AgreesWithRenderAsyncForRelativeLayers()
    {
        var title = Text(x: 10, y: 10);
        var description = Text(binding: "subtitle", x: 10, y: 150);
        description.Position.RelativeY = Ref(title, RelativeEdge.Below, 10);
        var badges = Badges(BadgeLabelPosition.Right);
        badges.Position.RelativeY = Ref(description, RelativeEdge.Below, 12);
        var template = Template(title, description, badges);

        var values = new DictionaryRenderValueSource(
            "Node",
            new Dictionary<string, string?> { ["title"] = LongTitle, ["subtitle"] = "Body" },
            items: new Dictionary<string, IReadOnlyList<BadgeItem>> { ["categories"] = [new BadgeItem("Umbraco", new Dictionary<string, string?>())] });

        using var rendered = await Renderer().RenderAsync(template, values);
        var measured = await Renderer().MeasureAsync(template, values);

        Assert.Equal(3, rendered.Bounds.Count);
        Assert.Equal(rendered.Bounds.Count, measured.Count);
        for (var i = 0; i < measured.Count; i++)
        {
            Assert.Equal(rendered.Bounds[i].X, measured[i].X, 3);
            Assert.Equal(rendered.Bounds[i].Y, measured[i].Y, 3);
            Assert.Equal(rendered.Bounds[i].Width, measured[i].Width, 3);
            Assert.Equal(rendered.Bounds[i].Height, measured[i].Height, 3);
        }

        var badgeBounds = rendered.Bounds[2];
        var descBounds = rendered.Bounds[1];
        Assert.Equal(descBounds.Y + descBounds.Height + 12, badgeBounds.Y, 2);
    }

    [Fact]
    public async Task RenderAsync_ReportsTextBoundsAsTheLineBoxNotTheInk()
    {
        // A gap below "Hello" and below "gyp" must be the same gap, so the reported height cannot
        // depend on which glyphs happen to be in the string.
        using var caps = await Renderer().RenderAsync(Template(Text()), Values("Hello"));
        using var descenders = await Renderer().RenderAsync(Template(Text()), Values("gyp"));

        Assert.Equal(caps.Bounds[0].Height, descenders.Bounds[0].Height, 3);
        Assert.Equal(caps.Bounds[0].Y, descenders.Bounds[0].Y, 3);
        Assert.Equal(10, caps.Bounds[0].Y, 3);
    }

    // ------------------------------------------------------------------ badges layout options

    [Fact]
    public async Task RenderAsync_BadgesWithRightHandLabelsAreWiderThanIconOnly()
    {
        using var right = await Renderer().RenderAsync(Template(Badges(BadgeLabelPosition.Right)), BadgeValues());
        using var none = await Renderer().RenderAsync(Template(Badges(BadgeLabelPosition.None)), BadgeValues());
        using var below = await Renderer().RenderAsync(Template(Badges(BadgeLabelPosition.Below)), BadgeValues());

        Assert.Equal(3, right.Bounds[0].Lines);
        Assert.True(right.Bounds[0].Width > none.Bounds[0].Width);
        Assert.Equal(3 * 40 + 2 * 40, none.Bounds[0].Width, 2);
        Assert.Equal(40, none.Bounds[0].Height, 2);

        // Labels below keep the fixed-width run and add the label height under the circles.
        Assert.Equal(3 * 40 + 2 * 40, below.Bounds[0].Width, 2);
        Assert.Equal(40 + 6 + 16 * 1.2f, below.Bounds[0].Height, 2);
        Assert.Equal(40, right.Bounds[0].Height, 2);
    }

    [Fact]
    public async Task RenderAsync_WrappedBadgesAreTallerThanOneRow()
    {
        using var oneRow = await Renderer().RenderAsync(Template(Badges(BadgeLabelPosition.Right)), BadgeValues());

        var width = oneRow.Bounds[0].Width * 0.6f;
        using var wrapped = await Renderer().RenderAsync(Template(Badges(BadgeLabelPosition.Right, wrap: true, width: width)), BadgeValues());

        Assert.Equal(width, wrapped.Bounds[0].Width, 2);
        Assert.True(wrapped.Bounds[0].Height > oneRow.Bounds[0].Height,
            $"wrapped height {wrapped.Bounds[0].Height} should exceed one row {oneRow.Bounds[0].Height}");
    }

    // ------------------------------------------------------------------ shapes

    [Fact]
    public async Task RenderAsync_DrawsAnEllipseInsideItsBox()
    {
        var ellipse = Rect("Ellipse", 0, 0, 100, 50);
        ellipse.Shape = ShapeKind.Ellipse;

        using var result = await Renderer().RenderAsync(Template(ellipse), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 25]);
        Assert.Equal(new Rgba32(255, 0, 0, 255), image[5, 25]);
        // The box's corner lies outside the inscribed ellipse.
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[2, 2]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[97, 47]);
        Assert.Equal((0f, 0f, 100f, 50f), (result.Bounds[0].X, result.Bounds[0].Y, result.Bounds[0].Width, result.Bounds[0].Height));
    }

    [Fact]
    public async Task RenderAsync_DrawsAFivePointStarWithItsTipAtTheTop()
    {
        var star = Rect("Star", 0, 0, 100, 100);
        star.Shape = ShapeKind.Star;
        star.Sides = 5;
        star.InnerRatio = 0.5f;

        using var result = await Renderer().RenderAsync(Template(star), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 50]);
        // The top point sits on the box's top-centre; the corners and the notch under the
        // bottom two arms are inside the box but outside the star.
        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 8]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[10, 10]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[90, 10]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[50, 90]);
    }

    [Fact]
    public async Task RenderAsync_DrawsAPolygonStretchedToItsBox()
    {
        // A diamond in a 100x50 box: its points touch the middle of each edge.
        var diamond = Rect("Diamond", 0, 0, 100, 50);
        diamond.Shape = ShapeKind.Polygon;
        diamond.Sides = 4;

        using var result = await Renderer().RenderAsync(Template(diamond), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 25]);
        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 3]);
        Assert.Equal(new Rgba32(255, 0, 0, 255), image[95, 25]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[5, 5]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[95, 45]);
    }

    [Fact]
    public async Task RenderAsync_DrawsABorderOnlyRectangleInsideItsBox()
    {
        var frame = Rect("Frame", 0, 0, 100, 50);
        frame.Fill = null;
        frame.Border = new ShapeBorder { Width = 4, Colour = "#FFFFFF" };

        using var result = await Renderer().RenderAsync(Template(frame), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        // The stroke lies inside the box: the edge pixel is white, the centre untouched, and
        // nothing spills past the box.
        Assert.Equal(new Rgba32(255, 255, 255, 255), image[1, 25]);
        Assert.Equal(new Rgba32(255, 255, 255, 255), image[98, 25]);
        Assert.Equal(new Rgba32(255, 255, 255, 255), image[50, 1]);
        Assert.Equal(new Rgba32(255, 255, 255, 255), image[50, 48]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[50, 25]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[50, 6]);
        Assert.Equal(0, CountNonBackgroundOutside(image, (0, 0, 100, 50), margin: 0));

        var bounds = Assert.Single(result.Bounds);
        Assert.Equal((0f, 0f, 100f, 50f), (bounds.X, bounds.Y, bounds.Width, bounds.Height));

        var measured = await Renderer().MeasureAsync(Template(frame), Values());
        Assert.Equal(bounds, Assert.Single(measured));
    }

    [Fact]
    public async Task RenderAsync_DrawsABorderAroundAFilledEllipse()
    {
        var ring = Rect("Ring", 0, 0, 100, 100);
        ring.Shape = ShapeKind.Ellipse;
        ring.Border = new ShapeBorder { Width = 6, Colour = "#00FF00" };

        using var result = await Renderer().RenderAsync(Template(ring), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(0, 255, 0, 255), image[2, 50]);
        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 50]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[2, 2]);
    }

    [Fact]
    public async Task RenderAsync_SkipsAShapeWithNothingToPaint()
    {
        var empty = Rect("Nothing", 0, 0);
        empty.Fill = null;
        empty.Gradient = null;
        empty.Border = new ShapeBorder { Width = 0, Colour = "#FFFFFF" };

        using var result = await Renderer().RenderAsync(Template(empty), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Empty(result.Bounds);
        Assert.Empty(await Renderer().MeasureAsync(Template(empty), Values()));
        Assert.False(HasNonBackgroundPixels(image));
    }

    [Fact]
    public async Task RenderAsync_ClampsAPolygonsSides()
    {
        // 20 sides is drawn with 12; both are so nearly a circle that the corner is untouched
        // and the centre and the edge midpoints are painted.
        var polygon = Rect("Polygon", 0, 0, 100, 100);
        polygon.Shape = ShapeKind.Polygon;
        polygon.Sides = 20;

        using var result = await Renderer().RenderAsync(Template(polygon), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 50]);
        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 3]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[3, 3]);
    }

    [Fact]
    public async Task RenderAsync_RotatesAnEllipseAboutItsAnchor()
    {
        // A 100x20 ellipse centred at (200, 100) turned 90 degrees stands upright: painted above
        // and below the centre, not left and right of it.
        var pill = new RectLayer
        {
            Name = "Pill",
            Shape = ShapeKind.Ellipse,
            Fill = "#FF0000",
            Rotation = 90,
            Position = new Position { X = 200, Y = 100, Anchor = Anchor.MiddleCentre },
            Size = new LayerSize { Width = 100, Height = 20 },
        };

        using var result = await Renderer().RenderAsync(Template(pill), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(255, 0, 0, 255), image[200, 100]);
        Assert.Equal(new Rgba32(255, 0, 0, 255), image[200, 60]);
        Assert.Equal(new Rgba32(255, 0, 0, 255), image[200, 140]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[160, 100]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[240, 100]);
    }

    // ------------------------------------------------------------------ rotation

    [Fact]
    public async Task RenderAsync_RotatesARectangleAboutItsAnchor()
    {
        // 100x20 at (100, 100), top-left anchor, turned 90 degrees clockwise about that corner:
        // the bar now hangs down and to the left, covering x 80..100 and y 100..200.
        var rect = Rect("Bar", 100, 100, 100, 20);
        rect.Rotation = 90;

        using var result = await Renderer().RenderAsync(Template(rect), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(255, 0, 0, 255), image[90, 150]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[150, 110]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[90, 90]);

        var bounds = Assert.Single(result.Bounds);
        Assert.Equal(90, bounds.Rotation);
        Assert.Equal(100, bounds.PivotX, 3);
        Assert.Equal(100, bounds.PivotY, 3);
        Assert.Equal((100, 100, 100, 20), (bounds.X, bounds.Y, bounds.Width, bounds.Height));

        var (x, y, width, height) = bounds.Extent();
        Assert.Equal(80, x, 2);
        Assert.Equal(100, y, 2);
        Assert.Equal(20, width, 2);
        Assert.Equal(100, height, 2);
    }

    [Fact]
    public async Task RenderAsync_AnUnrotatedRectangleDrawsExactlyAsBefore()
    {
        // Rotation 0 must not go anywhere near a transform: every one of the 100x50 pixels is
        // solid red and nothing outside the box is touched, as the pre-rotation test asserts.
        var rect = new RectLayer
        {
            Name = "Scrim",
            Fill = "#FF0000",
            Rotation = 0,
            Position = new Position { X = 0, Y = 0, Anchor = Anchor.TopLeft },
            Size = new LayerSize { Width = 100, Height = 50 },
        };

        using var result = await Renderer().RenderAsync(Template(rect), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(255, 0, 0, 255), image[50, 25]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[150, 25]);
        Assert.Equal(100 * 50, CountPixels(image, new Rgba32(255, 0, 0, 255)));
        Assert.Equal(400 * 200 - 100 * 50, CountPixels(image, new Rgba32(0, 0, 0, 255)));
        Assert.Equal(0, result.Bounds[0].Rotation);
        Assert.Equal((0f, 0f, 100f, 50f), result.Bounds[0].Extent());
    }

    [Fact]
    public async Task RenderAsync_RotatedTextReportsTheUnrotatedBoxAndATallerExtent()
    {
        var text = Text(x: 200, y: 100, anchor: Anchor.MiddleCentre);
        text.Size.Width = null;
        text.Rotation = 90;

        using var result = await Renderer().RenderAsync(Template(text), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        var bounds = Assert.Single(result.Bounds);
        Assert.Equal(90, bounds.Rotation);
        Assert.Equal(200, bounds.PivotX, 3);
        Assert.Equal(100, bounds.PivotY, 3);
        Assert.True(bounds.Width > bounds.Height, "a one-line 'Hello' is wider than it is tall");

        var extent = bounds.Extent();
        Assert.True(extent.Height > bounds.Height, $"extent height {extent.Height} should exceed the line box {bounds.Height}");
        Assert.Equal(bounds.Width, extent.Height, 2);
        Assert.Equal(bounds.Height, extent.Width, 2);

        // Ink lands inside the rotated footprint, and only there.
        Assert.True(HasNonBackgroundPixels(image), "the text should have marked the canvas");
        Assert.Equal(0, CountNonBackgroundOutside(image, extent, margin: 2));
    }

    [Fact]
    public async Task MeasureAsync_AgreesWithRenderAsyncForRotatedLayers()
    {
        var title = Text(x: 200, y: 40, anchor: Anchor.TopCentre);
        title.Rotation = -15;
        var badges = Badges(BadgeLabelPosition.Below);
        badges.Position = new Position { X = 200, Y = 120, Anchor = Anchor.MiddleCentre };
        badges.Rotation = 30;
        var photo = new ImageLayer { Name = "Photo", Source = ImageSource.None(), Rotation = 45, Size = new LayerSize { Width = 50, Height = 50 } };
        var template = Template(title, badges, photo);

        var values = new DictionaryRenderValueSource(
            "Node",
            new Dictionary<string, string?> { ["title"] = "Hello" },
            items: new Dictionary<string, IReadOnlyList<BadgeItem>> { ["categories"] = [new BadgeItem("Umbraco", new Dictionary<string, string?>())] });

        using var rendered = await Renderer().RenderAsync(template, values);
        var measured = await Renderer().MeasureAsync(template, values);

        // The image draws nothing (no source), so it is absent from both.
        Assert.Equal(2, rendered.Bounds.Count);
        Assert.Equal(rendered.Bounds.Count, measured.Count);

        for (var i = 0; i < measured.Count; i++)
        {
            Assert.Equal(rendered.Bounds[i].X, measured[i].X, 3);
            Assert.Equal(rendered.Bounds[i].Y, measured[i].Y, 3);
            Assert.Equal(rendered.Bounds[i].Width, measured[i].Width, 3);
            Assert.Equal(rendered.Bounds[i].Height, measured[i].Height, 3);
            Assert.Equal(rendered.Bounds[i].Rotation, measured[i].Rotation);
            Assert.Equal(rendered.Bounds[i].PivotX, measured[i].PivotX, 3);
            Assert.Equal(rendered.Bounds[i].PivotY, measured[i].PivotY, 3);
        }

        Assert.Equal(-15, rendered.Bounds[0].Rotation);
        Assert.Equal(30, rendered.Bounds[1].Rotation);
        Assert.Equal(200, rendered.Bounds[1].PivotX, 3);
        Assert.Equal(120, rendered.Bounds[1].PivotY, 3);
    }

    [Fact]
    public async Task RenderAsync_DrawsARotatedBadgeRowInsideItsExtent()
    {
        var badges = Badges(BadgeLabelPosition.None);
        badges.Position = new Position { X = 200, Y = 100, Anchor = Anchor.MiddleCentre };
        badges.Badge.FillColour = "#FFFFFF";
        badges.Badge.BorderWidth = 0;
        badges.Rotation = 90;

        using var result = await Renderer().RenderAsync(Template(badges), BadgeValues());
        using var image = result.Image.CloneAs<Rgba32>();

        var bounds = Assert.Single(result.Bounds);
        var extent = bounds.Extent();

        // Three 40px circles 40px apart, turned upright: a column 40 wide and 200 tall centred on
        // the pivot. The middle circle's centre is the pivot itself.
        Assert.Equal(40, extent.Width, 2);
        Assert.Equal(200, extent.Height, 2);
        Assert.Equal(new Rgba32(255, 255, 255, 255), image[200, 100]);
        Assert.Equal(new Rgba32(255, 255, 255, 255), image[200, 20]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[120, 100]);
        Assert.Equal(0, CountNonBackgroundOutside(image, extent, margin: 2));
    }

    [Fact]
    public async Task RenderAsync_RotatesAnImageTheSameWayAsARectangle()
    {
        // A 100x20 strip, red on the left and blue on the right, turned 90 degrees clockwise about
        // its top-left corner at (100, 100): it now hangs down the x 80..100 column with red at
        // the top - exactly where the rectangle test puts its bar.
        var renderer = new DynamicImageRenderer(
            new LayerRendererCollection(() => [new ImageLayerRenderer(new StripeImages())]),
            new NoImages(),
            new RenderGate(),
            NullLogger<DynamicImageRenderer>.Instance);

        var photo = new ImageLayer
        {
            Name = "Strip",
            Source = new ImageSource { Kind = ImageSourceKind.Path, Path = "/strip.png" },
            Position = new Position { X = 100, Y = 100, Anchor = Anchor.TopLeft },
            Size = new LayerSize { Width = 100, Height = 20 },
            Rotation = 90,
        };

        using var result = await renderer.RenderAsync(Template(photo), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(255, 0, 0, 255), image[90, 125]);
        Assert.Equal(new Rgba32(0, 0, 255, 255), image[90, 175]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[150, 110]);
        Assert.Equal(new Rgba32(0, 0, 0, 255), image[90, 90]);

        var bounds = Assert.Single(result.Bounds);
        Assert.Equal((100f, 100f, 100f, 20f), (bounds.X, bounds.Y, bounds.Width, bounds.Height));
        Assert.Equal(90, bounds.Rotation);

        var measured = await renderer.MeasureAsync(Template(photo), Values());
        Assert.Equal(bounds, Assert.Single(measured));
    }

    [Fact]
    public async Task RenderAsync_TracksBelowARotatedRectanglesFootprint()
    {
        var bar = Rect("Bar", 100, 100, 100, 20);
        bar.Rotation = 90;
        var description = Text(binding: "subtitle", x: 100, y: 0);
        description.Position.RelativeY = Ref(bar, RelativeEdge.Below, 10);

        using var result = await Renderer().RenderAsync(Template(bar, description), Values("Hello", "Body"));

        var descBounds = result.Bounds.Single(b => b.LayerKey == description.Key);

        // The bar's footprint reaches y = 200 once turned; its unrotated box would end at 120.
        Assert.Equal(210, descBounds.Y, 2);
    }

    [Fact]
    public async Task RenderAsync_FillsTheCanvasWithAGradient()
    {
        var template = Template();
        template.Canvas.BackgroundGradient = new Gradient { From = "#FF0000", To = "#0000FF", Angle = 180f };

        using var result = await Renderer().RenderAsync(template, Values());
        using var image = result.Image.CloneAs<Rgba32>();

        AssertNear(new Rgba32(255, 0, 0, 255), image[200, 2]);
        AssertNear(new Rgba32(0, 0, 255, 255), image[200, 197]);
    }

    [Fact]
    public async Task RenderAsync_PrefersTheCanvasGradientOverTheBackgroundColour()
    {
        var template = Template();
        template.Canvas.Background = "#00FF00";
        template.Canvas.BackgroundGradient = new Gradient { From = "#FF0000", To = "#0000FF", Angle = 180f };

        using var result = await Renderer().RenderAsync(template, Values());
        using var image = result.Image.CloneAs<Rgba32>();

        for (var y = 0; y < image.Height; y++)
        {
            for (var x = 0; x < image.Width; x++)
            {
                Assert.True(image[x, y].G < 64, $"the background colour should not show at {x},{y}: {image[x, y]}");
            }
        }
    }

    [Fact]
    public async Task RenderAsync_FillsTheCanvasWithARadialGradient()
    {
        var template = Template();
        template.Canvas.BackgroundGradient = new Gradient { Kind = GradientKind.Radial, From = "#FF0000", To = "#0000FF" };

        using var result = await Renderer().RenderAsync(template, Values());
        using var image = result.Image.CloneAs<Rgba32>();

        AssertNear(new Rgba32(255, 0, 0, 255), image[200, 100]);
        foreach (var (x, y) in new[] { (2, 2), (397, 2), (2, 197), (397, 197) })
        {
            AssertNear(new Rgba32(0, 0, 255, 255), image[x, y], tolerance: 24);
        }
    }

    [Fact]
    public async Task RenderAsync_LeavesTheBackgroundColourAloneWithoutAGradient()
    {
        // The guard that the gradient path did not capture the solid one.
        var template = Template();
        template.Canvas.Background = "#112233";

        using var result = await Renderer().RenderAsync(template, Values());
        using var image = result.Image.CloneAs<Rgba32>();

        Assert.Equal(new Rgba32(0x11, 0x22, 0x33, 255), image[5, 5]);
        Assert.Equal(new Rgba32(0x11, 0x22, 0x33, 255), image[395, 195]);
    }

    [Theory]
    [InlineData("#0B0F1900")]
    [InlineData("")]
    public async Task RenderAsync_LeavesTheCanvasTransparent(string background)
    {
        // Zero alpha is the chosen way to say it; an empty string is the unwarned way, because
        // ParseOrDefault's fallback here is Color.Transparent and the validator skips empty
        // values. Both render the same thing, and both are pinned so neither quietly changes.
        var template = Template();
        template.Canvas.Background = background;

        using var result = await Renderer().RenderAsync(template, Values());
        using var image = result.Image.CloneAs<Rgba32>();

        foreach (var (x, y) in new[] { (0, 0), (200, 100), (399, 199) })
        {
            Assert.Equal(0, image[x, y].A);
        }
    }

    [Fact]
    public async Task RenderAsync_DrawsAShapeGradient()
    {
        // The first coverage the gradient brush has ever had: it was a private method on this
        // renderer and no test reached it.
        var shape = GradientRect(new Gradient { From = "#FF0000", To = "#0000FF", Angle = 180f });

        using var result = await Renderer().RenderAsync(Template(shape), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        AssertNear(new Rgba32(255, 0, 0, 255), image[200, 2]);
        AssertNear(new Rgba32(0, 0, 255, 255), image[200, 197]);
    }

    [Fact]
    public async Task RenderAsync_DrawsARadialShapeGradient()
    {
        var shape = GradientRect(new Gradient { Kind = GradientKind.Radial, From = "#FF0000", To = "#0000FF" });

        using var result = await Renderer().RenderAsync(Template(shape), Values());
        using var image = result.Image.CloneAs<Rgba32>();

        AssertNear(new Rgba32(255, 0, 0, 255), image[200, 100]);
        foreach (var (x, y) in new[] { (2, 2), (397, 2), (2, 197), (397, 197) })
        {
            AssertNear(new Rgba32(0, 0, 255, 255), image[x, y], tolerance: 24);
        }
    }

    /// <summary>A shape filling the whole canvas, so a gradient can be probed at known pixels.</summary>
    private static RectLayer GradientRect(Gradient gradient) => new()
    {
        Name = "Gradient",
        Gradient = gradient,
        Position = new Position { X = 0, Y = 0, Anchor = Anchor.TopLeft },
        Size = new LayerSize(),
    };

    /// <summary>
    /// A gradient interpolates, so exact equality is the wrong assertion near either stop; and
    /// CountNonBackgroundOutside and HasNonBackgroundPixels both hard-code opaque black as "the
    /// background", which on a gradient would silently mean something else.
    /// </summary>
    private static async Task<Image<Rgba32>> RenderGradient(Gradient gradient)
    {
        var template = Template();
        template.Canvas.BackgroundGradient = gradient;

        using var result = await Renderer().RenderAsync(template, Values());
        return result.Image.CloneAs<Rgba32>();
    }

    private static List<GradientStop> RedGreenBlue() =>
    [
        new() { Colour = "#FF0000", Position = 0f },
        new() { Colour = "#00FF00", Position = 0.5f },
        new() { Colour = "#0000FF", Position = 1f },
    ];

    [Fact]
    public async Task RenderAsync_DrawsEveryStopOfAThreeStopLinearGradient()
    {
        // A two-stop red-to-blue would be purple in the middle; the third stop makes it green.
        using var image = await RenderGradient(new Gradient { Angle = 180f, From = "#FF0000", To = "#0000FF", Stops = RedGreenBlue() });

        AssertNear(new Rgba32(0, 255, 0, 255), image[200, 100], tolerance: 24);
        AssertNear(new Rgba32(255, 0, 0, 255), image[200, 1], tolerance: 24);
        AssertNear(new Rgba32(0, 0, 255, 255), image[200, 198], tolerance: 24);
    }

    [Fact]
    public async Task RenderAsync_SweepsAnAngularGradientClockwiseFromItsStartAngle()
    {
        using var image = await RenderGradient(new Gradient
        {
            Kind = GradientKind.Angular, Angle = 0f, Stops = RedGreenBlue(),
        });

        // Just clockwise of straight up is the start; straight down is half way round; just
        // anticlockwise of straight up is the end.
        AssertNear(new Rgba32(255, 0, 0, 255), image[203, 5], tolerance: 40);
        AssertNear(new Rgba32(0, 255, 0, 255), image[200, 195], tolerance: 24);
        AssertNear(new Rgba32(0, 0, 255, 255), image[196, 5], tolerance: 40);
    }

    [Fact]
    public async Task RenderAsync_DrawsADiamondGradientOutToTheSides()
    {
        using var image = await RenderGradient(new Gradient { Kind = GradientKind.Diamond, From = "#FF0000", To = "#0000FF" });

        AssertNear(new Rgba32(255, 0, 0, 255), image[200, 100], tolerance: 24);
        // Half way to the right side and half way to the bottom is on the last stop's diamond.
        AssertNear(new Rgba32(0, 0, 255, 255), image[300, 150], tolerance: 24);
        // A quarter of the way to the side is a quarter of the way along.
        var quarter = image[250, 100];
        Assert.InRange(quarter.R, 170, 210);
        Assert.InRange(quarter.B, 45, 85);
    }

    [Fact]
    public async Task RenderAsync_DrawsACircularRadialGradientTheSameDistanceEveryWay()
    {
        using var image = await RenderGradient(new Gradient
        {
            Kind = GradientKind.Radial, Shape = GradientShape.Circle, From = "#FF0000", To = "#0000FF",
        });

        // 90px right and 90px down are the same distance from the centre, so the same colour; an
        // ellipse on this 2:1 box would be twice as far along going down.
        var across = image[290, 100];
        var down = image[200, 190];
        AssertNear(across, down, tolerance: 12);
    }

    [Fact]
    public async Task RenderAsync_ReflectsAReflectedGradientAboutTheMiddle()
    {
        using var image = await RenderGradient(new Gradient { Kind = GradientKind.Reflected, Angle = 180f, From = "#FF0000", To = "#0000FF" });

        AssertNear(new Rgba32(255, 0, 0, 255), image[200, 100], tolerance: 24);
        AssertNear(new Rgba32(0, 0, 255, 255), image[200, 1], tolerance: 24);
        AssertNear(new Rgba32(0, 0, 255, 255), image[200, 198], tolerance: 24);
    }

    private static void AssertNear(Rgba32 expected, Rgba32 actual, int tolerance = 12)
    {
        var off = Math.Abs(expected.R - actual.R) + Math.Abs(expected.G - actual.G)
            + Math.Abs(expected.B - actual.B) + Math.Abs(expected.A - actual.A);

        Assert.True(off <= tolerance, $"{actual} should be within {tolerance} of {expected}");
    }

    private static int CountPixels(Image<Rgba32> image, Rgba32 colour)
    {
        var count = 0;
        for (var y = 0; y < image.Height; y++)
        {
            for (var x = 0; x < image.Width; x++)
            {
                if (image[x, y] == colour) count++;
            }
        }

        return count;
    }

    /// <summary>Pixels that are not the black background and lie outside the box (grown by the margin).</summary>
    private static int CountNonBackgroundOutside(Image<Rgba32> image, (float X, float Y, float Width, float Height) box, float margin)
    {
        var count = 0;
        for (var y = 0; y < image.Height; y++)
        {
            for (var x = 0; x < image.Width; x++)
            {
                var inside = x >= box.X - margin && x <= box.X + box.Width + margin
                    && y >= box.Y - margin && y <= box.Y + box.Height + margin;
                if (!inside && image[x, y] != new Rgba32(0, 0, 0, 255)) count++;
            }
        }

        return count;
    }

    private static bool HasNonBackgroundPixels(Image<Rgba32> image)
    {
        for (var y = 0; y < image.Height; y++)
        {
            for (var x = 0; x < image.Width; x++)
            {
                if (image[x, y] != new Rgba32(0, 0, 0, 255)) return true;
            }
        }

        return false;
    }

    /// <summary>Loads the one test font from disk, whatever key is asked for.</summary>
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

    /// <summary>One 100x20 image, red on the left half and blue on the right, for every source asked for.</summary>
    private sealed class StripeImages : IImageSourceProvider
    {
        private static Image Strip()
        {
            var image = new Image<Rgba32>(100, 20);
            for (var y = 0; y < 20; y++)
            {
                for (var x = 0; x < 100; x++) image[x, y] = x < 50 ? new Rgba32(255, 0, 0, 255) : new Rgba32(0, 0, 255, 255);
            }

            return image;
        }

        public Task<Image?> LoadAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
            => Task.FromResult<Image?>(Strip());

        public Task<bool> ExistsAsync(ImageSource? source, CancellationToken cancellationToken = default)
            => Task.FromResult(true);

        public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, CancellationToken cancellationToken = default)
            => Task.FromResult<(int, int)?>((100, 20));

        public Task<(int Width, int Height)?> GetDimensionsAsync(ImageSource? source, IRenderValueSource? values, CancellationToken cancellationToken = default)
            => Task.FromResult<(int, int)?>((100, 20));
    }

    /// <summary>No web root, so badge icons are never found - the tests turn icons off anyway.</summary>
    private sealed class NoWebRoot : IWebHostEnvironment
    {
        public string WebRootPath { get; set; } = Path.GetTempPath();
        public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
        public string ApplicationName { get; set; } = "Tests";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
        public string ContentRootPath { get; set; } = Path.GetTempPath();
        public string EnvironmentName { get; set; } = "Test";
    }
}
