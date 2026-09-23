using System.Text.Json;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Services;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

public class TemplateJsonTests
{
    private static readonly TemplateJsonMigrator Migrator = new();

    private static Template Sample() => new()
    {
        Key = Guid.NewGuid(),
        Alias = "articleOg",
        Name = "Article OG image",
        DocTypeAliases = ["article"],
        TargetPropertyAlias = "ogImage",
        Canvas = new CanvasSettings
        {
            Width = 1200,
            Height = 630,
            BaseImage = new ImageSource { Kind = ImageSourceKind.Path, Path = "/assets/og-background.png" },
            BaseImageFit = ImageFitMode.Cover,
        },
        Layers =
        [
            new TextLayer
            {
                Name = "Title",
                Position = new Position { X = 60, Y = 160, Anchor = Anchor.TopLeft },
                Binding = new TextBinding { Kind = TextBindingKind.NodeName },
                Style = new TextStyle { FontSize = 56, Overflow = TextOverflow.Shrink, TextAlign = TextAlign.Left },
            },
            new BadgesLayer
            {
                Name = "Badges",
                ItemsPropertyAlias = "categories",
                Direction = BadgeDirection.Horizontal,
            },
            new ImageLayer { Name = "Photo", Fit = ImageFit.Cover },
            new RectLayer { Name = "Scrim", Fill = "#00000099" },
        ],
    };

    [Fact]
    public void RoundTrip_PreservesEveryLayerType()
    {
        var json = JsonSerializer.Serialize(Sample(), DynamicImagesJsonOptions.Default);
        var back = Migrator.Deserialize(json);

        Assert.NotNull(back);
        Assert.Collection(back!.Layers,
            layer => Assert.IsType<TextLayer>(layer),
            layer => Assert.IsType<BadgesLayer>(layer),
            layer => Assert.IsType<ImageLayer>(layer),
            layer => Assert.IsType<RectLayer>(layer));
    }

    [Fact]
    public void RoundTrip_PreservesAnchorsAndEnums()
    {
        var json = JsonSerializer.Serialize(Sample(), DynamicImagesJsonOptions.Default);
        var back = Migrator.Deserialize(json)!;

        var text = Assert.IsType<TextLayer>(back.Layers[0]);
        Assert.Equal(Anchor.TopLeft, text.Position.Anchor);
        Assert.Equal(TextOverflow.Shrink, text.Style.Overflow);
        Assert.Equal(ImageSourceKind.Path, back.Canvas.BaseImage.Kind);
        Assert.Equal(ImageFitMode.Cover, back.Canvas.BaseImageFit);
    }

    [Fact]
    public void Serialize_WritesEnumsAsCamelCaseNames()
    {
        // The designer reads these names; an integer or a PascalCase name would be read as the
        // enum's default without any error, which is exactly the bug this pins down.
        var json = JsonSerializer.Serialize(Sample(), DynamicImagesJsonOptions.Default);

        Assert.Contains("\"anchor\":\"topLeft\"", json);
        Assert.Contains("\"kind\":\"path\"", json);
        Assert.Contains("\"direction\":\"horizontal\"", json);
        Assert.Contains("\"type\":\"text\"", json);
    }

    [Fact]
    public void Serialize_UsesTheSameNamesUnderTheHostsOwnOptions()
    {
        // The Management API serialises with ASP.NET Core's options, not ours. Pinning each
        // member's name is what makes the two agree.
        var hostLike = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        var json = JsonSerializer.Serialize(Sample(), hostLike);

        Assert.Contains("\"anchor\":\"topLeft\"", json);
        Assert.Contains("\"direction\":\"horizontal\"", json);
    }

    [Fact]
    public void RoundTrip_PreservesRelativeReferences()
    {
        var template = Sample();
        var title = template.Layers[0];
        var desc = new TextLayer
        {
            Name = "Description",
            Position = new Position
            {
                X = 60,
                Y = 300,
                Anchor = Anchor.TopLeft,
                RelativeY = new RelativeReference { LayerKey = title.Key, Edge = RelativeEdge.Below, Gap = 10 },
                RelativeX = new RelativeReference { LayerKey = title.Key, Edge = RelativeEdge.LeftOf, Gap = 4.5f },
            },
        };
        template.Layers.Add(desc);

        var json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);
        var back = Migrator.Deserialize(json)!;

        var position = back.Layers[^1].Position;
        Assert.NotNull(position.RelativeY);
        Assert.Equal(title.Key, position.RelativeY!.LayerKey);
        Assert.Equal(RelativeEdge.Below, position.RelativeY.Edge);
        Assert.Equal(10, position.RelativeY.Gap);
        Assert.Equal(RelativeEdge.LeftOf, position.RelativeX!.Edge);
        Assert.Equal(4.5f, position.RelativeX.Gap);
    }

    [Fact]
    public void Serialize_WritesRelativeEdgesAsPinnedNamesUnderBothOptionSets()
    {
        var template = Sample();
        template.Layers[0].Position.RelativeY = new RelativeReference { LayerKey = Guid.NewGuid(), Edge = RelativeEdge.Below, Gap = 10 };
        template.Layers[1].Position.RelativeX = new RelativeReference { LayerKey = Guid.NewGuid(), Edge = RelativeEdge.RightOf, Gap = 10 };

        var ours = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);
        var hostLike = JsonSerializer.Serialize(template, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        foreach (var json in new[] { ours, hostLike })
        {
            Assert.Contains("\"edge\":\"below\"", json);
            Assert.Contains("\"edge\":\"rightOf\"", json);
        }
    }

    [Fact]
    public void Serialize_OmitsAbsentRelativeReferences()
    {
        // Fixed-position templates must serialise exactly as they did before the feature existed.
        var json = JsonSerializer.Serialize(Sample(), DynamicImagesJsonOptions.Default);

        Assert.DoesNotContain("relativeX", json);
        Assert.DoesNotContain("relativeY", json);
        Assert.DoesNotContain("isRelative", json);
    }

    [Fact]
    public void Deserialize_ReadsAPositionWithoutRelativeReferencesAsAbsolute()
    {
        var back = Migrator.Deserialize("""
            {"schemaVersion":2,"alias":"x","name":"X","layers":[
              {"type":"text","name":"T","position":{"x":1,"y":2,"anchor":"topRight"}}
            ]}
            """)!;

        var position = back.Layers[0].Position;
        Assert.Null(position.RelativeX);
        Assert.Null(position.RelativeY);
        Assert.False(position.IsRelative);
        Assert.Equal(Anchor.TopRight, position.Anchor);
    }

    [Fact]
    public void Deserialize_DefaultsTheBadgeLayoutOptionsForOlderDocuments()
    {
        var back = Migrator.Deserialize("""
            {"schemaVersion":2,"alias":"x","name":"X","layers":[
              {"type":"badges","name":"B","itemsPropertyAlias":"categories","direction":"horizontal",
               "label":{"fontKey":"00000000-0000-0000-0000-000000000000","fontSize":22,"gap":10}}
            ]}
            """)!;

        var badges = Assert.IsType<BadgesLayer>(back.Layers[0]);
        Assert.Equal(BadgeLabelPosition.Below, badges.Label.Position);
        Assert.False(badges.Wrap);
        Assert.Equal(20, badges.RowGap);
        Assert.Equal(10, badges.Label.Gap);
    }

    [Fact]
    public void Serialize_WritesBadgeLabelPositionsAsCamelCaseNames()
    {
        var template = Sample();
        ((BadgesLayer)template.Layers[1]).Label.Position = BadgeLabelPosition.Right;

        var json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);

        Assert.Contains("\"position\":\"right\"", json);
        Assert.Contains("\"wrap\":false", json);
    }

    [Fact]
    public void RoundTrip_PreservesRotation()
    {
        var template = Sample();
        template.Layers[0].Rotation = -12.5f;
        template.Layers[3].Rotation = 90;

        var json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);
        var back = Migrator.Deserialize(json)!;

        Assert.Contains("\"rotation\":-12.5", json);
        Assert.Equal(-12.5f, back.Layers[0].Rotation);
        Assert.Equal(90f, back.Layers[3].Rotation);
        Assert.Equal(0f, back.Layers[1].Rotation);
    }

    [Fact]
    public void Deserialize_ReadsALayerWithoutRotationAsUnrotated()
    {
        // A document saved before rotation existed must draw exactly as it did.
        var back = Migrator.Deserialize("""
            {"schemaVersion":2,"alias":"x","name":"X","layers":[
              {"type":"text","name":"T","position":{"x":1,"y":2,"anchor":"topLeft"}},
              {"type":"rect","name":"R","fill":"#FFFFFF"}
            ]}
            """)!;

        Assert.All(back.Layers, layer => Assert.Equal(0f, layer.Rotation));
    }

    [Fact]
    public void Serialize_WritesShapeKindsAsPinnedNamesUnderBothOptionSets()
    {
        var template = Sample();
        ((RectLayer)template.Layers[3]).Shape = ShapeKind.Ellipse;

        var ours = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);
        var hostLike = JsonSerializer.Serialize(template, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        foreach (var json in new[] { ours, hostLike })
        {
            Assert.Contains("\"shape\":\"ellipse\"", json);
            // The discriminator does not change with the shape.
            Assert.Contains("\"type\":\"rect\"", json);
        }
    }

    [Fact]
    public void RoundTrip_PreservesShapeSidesRatioAndBorder()
    {
        var template = Sample();
        var star = (RectLayer)template.Layers[3];
        star.Shape = ShapeKind.Star;
        star.Sides = 6;
        star.InnerRatio = 0.4f;
        star.Fill = null;
        star.Border = new ShapeBorder { Width = 3, Colour = "#FF00FF" };

        var json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);
        var back = (RectLayer)Migrator.Deserialize(json)!.Layers[3];

        Assert.Equal(ShapeKind.Star, back.Shape);
        Assert.Equal(6, back.Sides);
        Assert.Equal(0.4f, back.InnerRatio);
        Assert.Null(back.Fill);
        Assert.NotNull(back.Border);
        Assert.Equal(3, back.Border!.Width);
        Assert.Equal("#FF00FF", back.Border.Colour);
    }

    [Fact]
    public void Deserialize_ReadsARectWithoutAShapeAsARectangle()
    {
        // A document saved before shapes existed draws exactly the rectangle it always did.
        var back = Migrator.Deserialize("""
            {"schemaVersion":2,"alias":"x","name":"X","layers":[
              {"type":"rect","name":"Scrim","fill":"#00000099","cornerRadius":8}
            ]}
            """)!;

        var rect = Assert.IsType<RectLayer>(back.Layers[0]);
        Assert.Equal(ShapeKind.Rectangle, rect.Shape);
        Assert.Equal(5, rect.Sides);
        Assert.Equal(0.5f, rect.InnerRatio);
        Assert.Null(rect.Border);
        Assert.Equal(8, rect.CornerRadius);
        Assert.Equal(0f, rect.Rotation);
    }

    [Fact]
    public void ReadSchemaVersion_DefaultsToOneWhenAbsent()
        => Assert.Equal(1, Migrator.ReadSchemaVersion("""{"alias":"x"}"""));

    [Fact]
    public void ReadSchemaVersion_ReadsTheDeclaredVersion()
        => Assert.Equal(2, Migrator.ReadSchemaVersion("""{"schemaVersion":2}"""));

    [Fact]
    public void ReadSchemaVersion_IsZeroForUnreadableJson()
        => Assert.Equal(0, Migrator.ReadSchemaVersion("{ not json"));

    [Fact]
    public void Deserialize_StampsTheCurrentSchemaVersion()
    {
        var back = Migrator.Deserialize("""{"schemaVersion":2,"alias":"x","name":"X"}""");

        Assert.Equal(DynamicImagesConstants.CurrentSchemaVersion, back!.SchemaVersion);
    }

    [Fact]
    public void Deserialize_RefusesADocumentFromANewerVersion()
    {
        var exception = Assert.Throws<InvalidOperationException>(
            () => Migrator.Deserialize("""{"schemaVersion":99,"alias":"x"}"""));

        Assert.Contains("newer version", exception.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Deserialize_ReturnsNullForNothing(string? json)
        => Assert.Null(Migrator.Deserialize(json!));

    [Fact]
    public void RoundTrip_PreservesACanvasGradientAndARadialShapeGradient()
    {
        var template = Sample();
        template.Canvas.BackgroundGradient = new Gradient
        {
            Kind = GradientKind.Radial,
            From = "#112233",
            To = "#00000000",
            CentreX = 0.25f,
            CentreY = 0.75f,
        };
        ((RectLayer)template.Layers[3]).Gradient = new Gradient { From = "#FF0000", To = "#0000FF", Angle = 45f };

        var json = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);
        var back = Migrator.Deserialize(json)!;

        var canvas = back.Canvas.BackgroundGradient;
        Assert.NotNull(canvas);
        Assert.Equal(GradientKind.Radial, canvas!.Kind);
        Assert.Equal("#112233", canvas.From);
        Assert.Equal(0.25f, canvas.CentreX);
        Assert.Equal(0.75f, canvas.CentreY);

        var shape = Assert.IsType<RectLayer>(back.Layers[3]).Gradient;
        Assert.NotNull(shape);
        Assert.Equal(GradientKind.Linear, shape!.Kind);
        Assert.Equal(45f, shape.Angle);
    }

    [Fact]
    public void Serialize_WritesGradientKindsAsPinnedNamesUnderBothOptionSets()
    {
        var template = Sample();
        template.Canvas.BackgroundGradient = new Gradient { Kind = GradientKind.Radial };
        ((RectLayer)template.Layers[3]).Gradient = new Gradient { Kind = GradientKind.Linear };

        var ours = JsonSerializer.Serialize(template, DynamicImagesJsonOptions.Default);
        var hostLike = JsonSerializer.Serialize(template, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        foreach (var json in new[] { ours, hostLike })
        {
            Assert.Contains("\"kind\":\"radial\"", json);
            Assert.Contains("\"kind\":\"linear\"", json);
        }
    }

    [Fact]
    public void Deserialize_ReadsAGradientWithoutAKindAsTheLinearOneItAlwaysWas()
    {
        // The exact shape a v2 document stores. If this string ever has to change to pass, the
        // change is not backwards compatible.
        var back = Migrator.Deserialize("""
            {"schemaVersion":2,"alias":"x","name":"X","layers":[
              {"type":"rect","name":"R","gradient":{"from":"#000000CC","to":"#00000000","angle":180}}
            ]}
            """)!;

        var gradient = Assert.IsType<RectLayer>(back.Layers[0]).Gradient;
        Assert.NotNull(gradient);
        Assert.Equal(GradientKind.Linear, gradient!.Kind);
        Assert.Equal(180f, gradient.Angle);
        Assert.Equal(0.5f, gradient.CentreX);
        Assert.Equal(0.5f, gradient.CentreY);
    }

    [Fact]
    public void Deserialize_ReadsACanvasWithoutAGradientAsASolidBackground()
    {
        var back = Migrator.Deserialize("""
            {"schemaVersion":2,"alias":"x","name":"X","canvas":{"width":800,"height":800,"background":"#0B0F19"}}
            """)!;

        Assert.Null(back.Canvas.BackgroundGradient);
        Assert.Equal("#0B0F19", back.Canvas.Background);
    }

    [Fact]
    public void A_gradient_with_only_from_and_to_reads_as_two_stops()
    {
        const string json = """{"kind":"radial","from":"#FF0000","to":"#0000FF","angle":180,"centreX":0.5,"centreY":0.5}""";

        var gradient = JsonSerializer.Deserialize<Gradient>(json, DynamicImagesJsonOptions.Default)!;

        Assert.Null(gradient.Stops);
        Assert.Equal(GradientExtent.FarthestCorner, gradient.Extent);
        Assert.Equal(GradientShape.Ellipse, gradient.Shape);
        Assert.Equal([("#FF0000", 0f), ("#0000FF", 1f)], Umbraco.Community.DynamicImages.Core.Rendering.GradientGeometry.EffectiveStops(gradient));
    }

    [Fact]
    public void The_new_gradient_options_round_trip_as_camel_case()
    {
        var gradient = new Gradient
        {
            Kind = GradientKind.Angular,
            Shape = GradientShape.Circle,
            Extent = GradientExtent.ClosestSide,
            Stops = [new GradientStop { Colour = "#FF0000", Position = 0 }, new GradientStop { Colour = "#0000FF", Position = 0.75f }],
        };

        var json = JsonSerializer.Serialize(gradient, DynamicImagesJsonOptions.Default);
        var back = JsonSerializer.Deserialize<Gradient>(json, DynamicImagesJsonOptions.Default)!;

        Assert.Contains("\"kind\":\"angular\"", json);
        Assert.Contains("\"extent\":\"closestSide\"", json);
        Assert.Contains("\"shape\":\"circle\"", json);
        Assert.Equal(0.75f, back.Stops![1].Position);
        Assert.Equal(GradientKind.Angular, back.Kind);
    }
}
