using System.Text.RegularExpressions;
using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering.Layers;

/// <summary>
/// A row or column of circular badges with an icon and a label - categories, tags, authors.
/// Colour alpha is applied as a blend percentage.
/// </summary>
public sealed partial class BadgesLayerRenderer(
    IFontRegistry fontRegistry,
    IWebHostEnvironment hostEnvironment,
    ILogger<BadgesLayerRenderer> logger) : ILayerRenderer
{
    public Type LayerType => typeof(BadgesLayer);

    public async Task<LayerBounds?> RenderAsync(Image image, LayerBase layer, LayerRenderContext context)
    {
        if (layer is not BadgesLayer badges) return null;

        var plan = await LayoutAsync(badges, context);
        if (plan is null) return null;

        if (badges.Rotation == 0)
        {
            // Straight onto the canvas, exactly as before rotation existed: this path is
            // deliberately pixel-identical to the unrotated rendering.
            DrawRun(image, badges, plan, plan.OriginX, plan.OriginY, context.CancellationToken);
            return plan.Bounds;
        }

        // A rotated run is drawn into its own transparent image, turned as a whole and put down
        // with its centre where the unrotated box's centre lands - the image layer's composite.
        // The padding keeps a circle's border stroke, centred on the circle's edge, inside it.
        var padding = (int)MathF.Ceiling(Math.Max(0f, badges.Badge.BorderWidth));
        using var scratch = new Image<Rgba32>(
            Math.Max(1, (int)MathF.Ceiling(plan.Layout.TotalWidth) + padding * 2),
            Math.Max(1, (int)MathF.Ceiling(plan.Layout.TotalHeight) + padding * 2));

        DrawRun(scratch, badges, plan, padding, padding, context.CancellationToken);
        scratch.Mutate(ctx => ctx.Rotate(badges.Rotation));

        var bounds = plan.Bounds;
        var (centreX, centreY) = RotationMath.RotatePoint(
            bounds.X + bounds.Width / 2f, bounds.Y + bounds.Height / 2f, bounds.PivotX, bounds.PivotY, badges.Rotation);

        image.Mutate(ctx => ctx.DrawImage(
            scratch,
            new Point((int)Math.Round(centreX - scratch.Width / 2f), (int)Math.Round(centreY - scratch.Height / 2f)),
            1f));

        return bounds;
    }

    /// <summary>Every slot of the run - circle, icon, label - with the run's top-left at the origin given.</summary>
    private void DrawRun(Image target, BadgesLayer badges, BadgesPlan plan, float originX, float originY, CancellationToken cancellationToken)
    {
        var (fillColour, fillBlend) = ColourParser.SplitAlpha(badges.Badge.FillColour, Color.FromRgba(255, 255, 255, 20));
        var (borderColour, borderBlend) = ColourParser.SplitAlpha(badges.Badge.BorderColour, Color.FromRgba(255, 255, 255, 38));
        var labelColour = ColourParser.ParseOrDefault(badges.Label.Colour, Color.Gray);

        foreach (var slot in plan.Layout.Slots)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var circleX = originX + slot.Circle.X;
            var circleY = originY + slot.Circle.Y;
            var circleSize = slot.Circle.Width;

            DrawCircle(target, circleX, circleY, circleSize, fillColour, fillBlend, borderColour, borderBlend, badges.Badge.BorderWidth, badges.Opacity);
            DrawIcon(target, badges, plan.Items[slot.Index], circleX, circleY, circleSize, badges.Opacity);

            var label = plan.Labels[slot.Index];
            if (plan.LabelFont is null || slot.Label is not { } labelRect || string.IsNullOrWhiteSpace(label)) continue;

            // Below: centred under the circle. Right: vertically centred beside it.
            var options = badges.Label.Position == BadgeLabelPosition.Right
                ? new RichTextOptions(plan.LabelFont)
                {
                    Origin = new PointF(originX + labelRect.X, originY + labelRect.Y + labelRect.Height / 2f),
                    HorizontalAlignment = HorizontalAlignment.Left,
                    VerticalAlignment = VerticalAlignment.Center
                }
                : new RichTextOptions(plan.LabelFont)
                {
                    Origin = new PointF(circleX + circleSize / 2f, originY + labelRect.Y),
                    HorizontalAlignment = HorizontalAlignment.Center,
                    VerticalAlignment = VerticalAlignment.Top
                };

            var drawingOptions = new DrawingOptions
            {
                GraphicsOptions = new GraphicsOptions { Antialias = true, BlendPercentage = Math.Clamp(badges.Opacity, 0f, 1f) }
            };

            target.Mutate(ctx => ctx.DrawText(drawingOptions, options, label, new SolidBrush(labelColour), pen: null));
        }
    }

    public async Task<LayerBounds?> MeasureAsync(LayerBase layer, LayerRenderContext context)
        => layer is BadgesLayer badges ? (await LayoutAsync(badges, context))?.Bounds : null;

    /// <summary>The items, their labels, the label font and where every slot goes on the canvas.</summary>
    private sealed record BadgesPlan(
        IReadOnlyList<BadgeItem> Items,
        IReadOnlyList<string?> Labels,
        Font? LabelFont,
        BadgesLayoutResult Layout,
        float OriginX,
        float OriginY,
        LayerBounds Bounds);

    private async Task<BadgesPlan?> LayoutAsync(BadgesLayer badges, LayerRenderContext context)
    {
        if (string.IsNullOrWhiteSpace(badges.ItemsPropertyAlias))
        {
            context.Skip(badges.Key, "no property is bound to list");
            return null;
        }

        var items = context.Values.GetItems(badges.ItemsPropertyAlias)
            .Take(Math.Clamp(badges.MaxItems, 1, RenderLimits.MaxBadgeItems))
            .ToList();
        if (items.Count == 0)
        {
            context.Skip(badges.Key, LayerSkipReasons.NoItems);
            return null;
        }

        var labelFont = badges.Label.Position == BadgeLabelPosition.None
            ? null
            : await fontRegistry.GetFontAsync(
                badges.Label.FontKey,
                Math.Clamp(badges.Label.FontSize, 1f, RenderLimits.MaxFontSize),
                "Regular",
                context.CancellationToken);

        var labels = items
            .Select(item => labelFont is null
                ? null
                : TextFitting.ApplyTransform(item.Property(badges.LabelPropertyAlias) ?? item.Name, badges.Label.TextTransform))
            .ToList();

        var layout = BadgesLayout.Compute(
            badges,
            items.Count,
            hasLabels: labelFont is not null,
            index => labelFont is null || string.IsNullOrWhiteSpace(labels[index])
                ? 0f
                : TextMeasurer.MeasureAdvance(labels[index]!, new TextOptions(labelFont)).Width);

        // The layer's box is the whole run of badges, so the anchor behaves like every other layer.
        var position = context.PositionOf(badges);
        var (originX, originY) = AnchorMath.ToTopLeft(position, layout.TotalWidth, layout.TotalHeight);

        var bounds = new LayerBounds(
            badges.Key, originX, originY, layout.TotalWidth, layout.TotalHeight, items.Count, false, null,
            badges.Rotation, position.X, position.Y);

        return new BadgesPlan(items, labels, labelFont, layout, originX, originY, bounds);
    }

    private static void DrawCircle(
        Image image, float x, float y, float size,
        Color fill, float fillBlend, Color border, float borderBlend, float borderWidth, float opacity)
    {
        var centre = new PointF(x + size / 2f, y + size / 2f);
        var ellipse = new EllipsePolygon(centre, size / 2f);
        var layerOpacity = Math.Clamp(opacity, 0f, 1f);

        image.Mutate(ctx =>
        {
            ctx.Fill(
                new DrawingOptions { GraphicsOptions = new GraphicsOptions { Antialias = true, BlendPercentage = fillBlend * layerOpacity } },
                new SolidBrush(fill),
                ellipse);

            if (borderWidth > 0)
            {
                ctx.Draw(
                    new DrawingOptions { GraphicsOptions = new GraphicsOptions { Antialias = true, BlendPercentage = borderBlend * layerOpacity } },
                    new SolidPen(border, borderWidth),
                    ellipse);
            }
        });
    }

    private void DrawIcon(Image image, BadgesLayer badges, BadgeItem item, float x, float y, float circleSize, float opacity)
    {
        if (badges.Icon.Kind != BadgeIconKind.PathPattern) return;

        var iconPath = ResolveIconPath(badges.Icon, item);
        if (iconPath is null) return;

        try
        {
            using var icon = Image.Load(iconPath);
            icon.Mutate(ctx => ctx.Resize(new ResizeOptions
            {
                Size = new Size((int)badges.Badge.InnerSize, (int)badges.Badge.InnerSize),
                Mode = ResizeMode.Max
            }));

            var iconX = (int)Math.Round(x + (circleSize - icon.Width) / 2f);
            var iconY = (int)Math.Round(y + (circleSize - icon.Height) / 2f);

            image.Mutate(ctx => ctx.DrawImage(icon, new Point(iconX, iconY), Math.Clamp(opacity, 0f, 1f)));
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Dynamic Images: badge icon '{Path}' could not be drawn", iconPath);
        }
    }

    /// <summary>
    /// Tries the item's configured icon property, then its name, as slugs under the base path;
    /// falls back to default.png. Every candidate is resolved through the web root check.
    /// </summary>
    private string? ResolveIconPath(BadgeIcon icon, BadgeItem item)
    {
        var extension = string.IsNullOrWhiteSpace(icon.Extension) ? ".png" : icon.Extension;
        var basePath = (icon.BasePath ?? string.Empty).TrimEnd('/');

        var candidates = new[] { item.Property(icon.PropertyAlias), item.Name, "default" }
            .Select(Slugify)
            .Where(s => !string.IsNullOrEmpty(s))
            .Distinct(StringComparer.Ordinal);

        foreach (var slug in candidates)
        {
            var fullPath = WebRootPath.Resolve(hostEnvironment, $"{basePath}/{slug}{extension}");
            if (fullPath is not null && File.Exists(fullPath)) return fullPath;
        }

        return null;
    }

    private static string Slugify(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        return SlugPattern().Replace(input.ToLowerInvariant(), "-").Trim('-');
    }

    [GeneratedRegex("[^a-z0-9]+")]
    private static partial Regex SlugPattern();
}
