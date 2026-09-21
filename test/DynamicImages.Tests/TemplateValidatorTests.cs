using System.Reflection;
using Umbraco.Cms.Core.Services;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.Persistence;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The three warnings this feature added, not a retrospective suite for the whole validator. The
/// Umbraco services the validator takes are only reached by the checks these templates avoid - no
/// media folder key, no document type aliases, no wwwroot path - so most of them can be null. The
/// content type service is the exception: KnownPropertyAliases passes its Get as a method group,
/// which binds before it is ever called.
/// </summary>
public class TemplateValidatorTests
{
    private static TemplateValidator Validator() =>
        new(new NoFonts(), null!, new NoImages(), NeverCalled<IContentTypeService>(), null!, null!);

    private static Template Template(OutputFormat format = OutputFormat.Png, string background = "#0B0F19") => new()
    {
        Alias = "test",
        Name = "Test",
        Canvas = new CanvasSettings { Width = 400, Height = 200, Background = background, BaseImage = ImageSource.None() },
        Output = new OutputSettings { Format = format },
    };

    private static async Task<IReadOnlyList<ValidationIssue>> Validate(Template template)
        => (await Validator().ValidateAsync(template)).Issues;

    [Fact]
    public async Task Jpeg_WithATransparentBackground_Warns()
    {
        var issues = await Validate(Template(OutputFormat.Jpeg, "#0B0F1900"));

        Assert.Contains(issues, i => i.Code == "TransparencyNotKept" && i.Severity == ValidationSeverity.Warning);
    }

    [Fact]
    public async Task Jpeg_WithAnEmptyBackground_Warns()
    {
        // The quiet path to transparency: an empty colour renders transparent and is deliberately
        // not a colour error, so the format warning is the only thing that can mention it.
        var issues = await Validate(Template(OutputFormat.Jpeg, ""));

        Assert.Contains(issues, i => i.Code == "TransparencyNotKept");
    }

    [Fact]
    public async Task Jpeg_WithAnOpaqueBackground_DoesNotWarn()
    {
        var issues = await Validate(Template(OutputFormat.Jpeg));

        Assert.DoesNotContain(issues, i => i.Code == "TransparencyNotKept");
    }

    [Fact]
    public async Task Png_WithATransparentBackground_DoesNotWarn()
    {
        var issues = await Validate(Template(OutputFormat.Png, "#0B0F1900"));

        Assert.DoesNotContain(issues, i => i.Code == "TransparencyNotKept");
    }

    [Theory]
    [InlineData(ImageFitMode.Cover, false)]
    [InlineData(ImageFitMode.Stretch, false)]
    [InlineData(ImageFitMode.Contain, true)]
    public async Task Jpeg_WithABaseImage_WarnsOnlyWhenTheFillStillShows(ImageFitMode fit, bool expected)
    {
        // Cover and stretch always fill the canvas, so the warning would be noise; contain pads
        // with transparency and leaves the fill showing. This is the case most likely to regress.
        var template = Template(OutputFormat.Jpeg, "#0B0F1900");
        template.Canvas.BaseImage = new ImageSource { Kind = ImageSourceKind.Media, MediaKey = Guid.NewGuid() };
        template.Canvas.BaseImageFit = fit;

        var issues = await Validate(template);

        Assert.Equal(expected, issues.Any(i => i.Code == "TransparencyNotKept"));
    }

    [Fact]
    public async Task Jpeg_WithATransparentGradientStop_Warns()
    {
        var template = Template(OutputFormat.Jpeg);
        template.Canvas.BackgroundGradient = new Gradient { From = "#000000CC", To = "#00000000" };

        var issues = await Validate(template);

        Assert.Contains(issues, i => i.Code == "TransparencyNotKept");
    }

    [Fact]
    public async Task Jpeg_WithAnOpaqueGradientOverATransparentColour_DoesNotWarn()
    {
        // The gradient is the fill, so the stale colour underneath it says nothing about what is
        // drawn.
        var template = Template(OutputFormat.Jpeg, "#0B0F1900");
        template.Canvas.BackgroundGradient = new Gradient { From = "#FF0000", To = "#0000FF" };

        var issues = await Validate(template);

        Assert.DoesNotContain(issues, i => i.Code == "TransparencyNotKept");
    }

    [Fact]
    public async Task ARadialCanvasGradientOutside0To1_Warns()
    {
        var template = Template();
        template.Canvas.BackgroundGradient = new Gradient { Kind = GradientKind.Radial, CentreX = 1.5f };

        var issues = await Validate(template);

        var issue = Assert.Single(issues, i => i.Code == "GradientCentreInvalid");
        Assert.Equal(ValidationSeverity.Warning, issue.Severity);
        Assert.Null(issue.LayerKey);
        Assert.Contains("The canvas background gradient", issue.Message);
    }

    [Fact]
    public async Task ARadialShapeGradientOutside0To1_Warns()
    {
        var template = Template();
        var shape = new RectLayer
        {
            Name = "Glow",
            Gradient = new Gradient { Kind = GradientKind.Radial, CentreY = -0.2f },
        };
        template.Layers = [shape];

        var issues = await Validate(template);

        var issue = Assert.Single(issues, i => i.Code == "GradientCentreInvalid");
        Assert.Equal(shape.Key, issue.LayerKey);
        Assert.Contains("Layer 'Glow'", issue.Message);
    }

    [Fact]
    public async Task ALinearGradientWithAnOffCentre_DoesNotWarn()
    {
        // The centre is a radial-only field; a linear gradient carrying a stale one draws exactly
        // the same thing, so there is nothing to say about it.
        var template = Template();
        template.Canvas.BackgroundGradient = new Gradient { CentreX = 4f };

        var issues = await Validate(template);

        Assert.DoesNotContain(issues, i => i.Code == "GradientCentreInvalid");
    }

    [Fact]
    public async Task AMalformedCanvasGradientStop_IsAnErrorThatNamesTheCanvas()
    {
        // The check that splitting RequireColour did not leave the canvas describing itself as a
        // layer.
        var template = Template();
        template.Canvas.BackgroundGradient = new Gradient { From = "rebeccapurple" };

        var issues = await Validate(template);

        var issue = Assert.Single(issues, i => i.Code == "ColourInvalid");
        Assert.Equal(ValidationSeverity.Error, issue.Severity);
        Assert.Equal(
            "The canvas background gradient has the colour 'rebeccapurple', which is not #RRGGBB or #RRGGBBAA.",
            issue.Message);
    }

    [Fact]
    public async Task AMalformedShapeFill_StillNamesItsLayer()
    {
        var template = Template();
        template.Layers = [new RectLayer { Name = "Scrim", Fill = "nonsense" }];

        var issues = await Validate(template);

        var issue = Assert.Single(issues, i => i.Code == "ColourInvalid");
        Assert.Equal("Layer 'Scrim' has the colour 'nonsense', which is not #RRGGBB or #RRGGBBAA.", issue.Message);
    }

    /// <summary>
    /// A stand-in for an Umbraco service these templates never reach into. Hand-writing one of
    /// those interfaces would cost more than the warnings under test are worth, and a member that
    /// does get called returns nothing rather than quietly passing.
    /// </summary>
    // ---------------------------------------------------------------- PropertyPathTooDeep

    // Validator() hands KnownPropertyAliases a content-type service that is never called, so
    // PropertyUnknown is off throughout - which is exactly what the depth check needs, since it
    // deliberately sits outside that guard and must fire with no document types resolved at all.

    private static Template WithLayer(LayerBase layer)
    {
        var template = Template();
        template.Layers.Add(layer);
        return template;
    }

    private static TextLayer Bound(string alias) => new()
    {
        Name = "Byline",
        Binding = new TextBinding { Kind = TextBindingKind.Property, PropertyAlias = alias }
    };

    [Fact]
    public async Task ATextBindingPathOverTheCap_WarnsAndNamesTheLayer()
    {
        var issues = await Validate(WithLayer(Bound("a.b.c.d.e")));

        var issue = Assert.Single(issues, i => i.Code == "PropertyPathTooDeep");
        Assert.Equal(ValidationSeverity.Warning, issue.Severity);
        Assert.Contains("Byline", issue.Message);
        Assert.Contains("a.b.c.d.e", issue.Message);
    }

    [Fact]
    public async Task ATwoSegmentPath_DoesNotWarn()
        => Assert.DoesNotContain(await Validate(WithLayer(Bound("author.mainImage"))),
            i => i.Code == "PropertyPathTooDeep");

    [Fact]
    public async Task APathAtTheCap_DoesNotWarn()
        => Assert.DoesNotContain(await Validate(WithLayer(Bound("a.b.c.d"))),
            i => i.Code == "PropertyPathTooDeep");

    [Fact]
    public async Task AnImageSourcePathOverTheCap_Warns()
    {
        var layer = new ImageLayer
        {
            Name = "Author photo",
            Source = new ImageSource { Kind = ImageSourceKind.Property, PropertyAlias = "a.b.c.d.e" }
        };

        Assert.Contains(await Validate(WithLayer(layer)), i => i.Code == "PropertyPathTooDeep");
    }

    [Fact]
    public async Task AnImageFallbackPathOverTheCap_Warns()
    {
        var layer = new ImageLayer
        {
            Name = "Author photo",
            Source = new ImageSource
            {
                Kind = ImageSourceKind.Property,
                PropertyAlias = "author.mainImage",
                Fallback = new ImageSource { Kind = ImageSourceKind.Property, PropertyAlias = "a.b.c.d.e" }
            }
        };

        Assert.Contains(await Validate(WithLayer(layer)), i => i.Code == "PropertyPathTooDeep");
    }

    [Fact]
    public async Task ABadgesItemsPathOverTheCap_Warns()
    {
        // No icon: the path-pattern check reaches for a web host environment this suite does not
        // build, and it is not what this test is about.
        var layer = new BadgesLayer { Name = "Categories", ItemsPropertyAlias = "a.b.c.d.e" };
        layer.Icon.Kind = BadgeIconKind.None;

        Assert.Contains(await Validate(WithLayer(layer)), i => i.Code == "PropertyPathTooDeep");
    }

    [Fact]
    public async Task AVisibilityPathOverTheCap_Warns()
    {
        var layer = new RectLayer { Name = "Scrim", Fill = "#000000" };
        layer.Visibility.Rule = VisibilityRuleKind.WhenPropertyTruthy;
        layer.Visibility.PropertyAlias = "a.b.c.d.e";

        Assert.Contains(await Validate(WithLayer(layer)), i => i.Code == "PropertyPathTooDeep");
    }

    [Fact]
    public async Task AnExpressionTokenPathOverTheCap_Warns()
    {
        var layer = new TextLayer
        {
            Name = "Byline",
            Binding = new TextBinding { Kind = TextBindingKind.Expression, Text = "By {prop:a.b.c.d.e}" }
        };

        Assert.Contains(await Validate(WithLayer(layer)), i => i.Code == "PropertyPathTooDeep");
    }

    [Fact]
    public async Task ACanvasBaseImagePathOverTheCap_Warns()
    {
        var template = Template();
        template.Canvas.BaseImage = new ImageSource { Kind = ImageSourceKind.Property, PropertyAlias = "a.b.c.d.e" };

        var issue = Assert.Single(await Validate(template), i => i.Code == "PropertyPathTooDeep");
        Assert.Null(issue.LayerKey);
        Assert.Contains("canvas base image", issue.Message);
    }

    private static T NeverCalled<T>() where T : class => DispatchProxy.Create<T, ReturnsDefault>();

    private class ReturnsDefault : DispatchProxy
    {
        protected override object? Invoke(MethodInfo? targetMethod, object?[]? args)
            => targetMethod?.ReturnType is { IsValueType: true } type && type != typeof(void)
                ? Activator.CreateInstance(type)
                : null;
    }

    /// <summary>No fonts, which is all the validator asks of the repository for these templates.</summary>
    private sealed class NoFonts : IFontRepository
    {
        public IReadOnlyList<FontDefinition> GetAll() => [];

        public FontDefinition? Get(Guid key) => null;

        public FontDefinition Insert(FontDefinition font) => font;

        public FontDefinition? Update(FontDefinition font) => null;

        public bool Delete(Guid key) => false;
    }
}
