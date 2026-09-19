using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Plausible stand-in values for a template, so the designer has something to lay out before any
/// content is picked - and so a new template is not an empty canvas.
/// </summary>
public static class SampleData
{
    public const string SampleTitle = "Designing social share images that actually get clicked";

    public static IRenderValueSource Build(Template template, string? title = null)
    {
        var text = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase)
        {
            ["mainContent"] = string.Join(' ', Enumerable.Repeat("word", 900)),
            ["subtitle"] = "A short standfirst that sits under the headline",
            ["summary"] = "A short standfirst that sits under the headline",
            ["createDate"] = DateTime.UtcNow.ToString("O"),
            ["updateDate"] = DateTime.UtcNow.ToString("O")
        };

        // Every alias the template reads gets a value, so no layer disappears from the preview
        // merely because the sample set did not anticipate it.
        foreach (var layer in template.Layers.OfType<TextLayer>())
        {
            foreach (var alias in AliasesOf(layer))
            {
                text.TryAdd(alias, alias.Contains("date", StringComparison.OrdinalIgnoreCase)
                    ? DateTime.UtcNow.ToString("O")
                    : "Sample value");
            }
        }

        var items = new Dictionary<string, IReadOnlyList<BadgeItem>>(StringComparer.OrdinalIgnoreCase);
        foreach (var badges in template.Layers.OfType<BadgesLayer>().Where(b => !string.IsNullOrWhiteSpace(b.ItemsPropertyAlias)))
        {
            items[badges.ItemsPropertyAlias] = SampleBadges(badges);
        }

        return new DictionaryRenderValueSource(title ?? SampleTitle, text, media: null, items: items);
    }

    private static IReadOnlyList<BadgeItem> SampleBadges(BadgesLayer badges)
    {
        var names = new[] { "Umbraco", "C#", "Front end", "DevOps" }.Take(Math.Max(1, badges.MaxItems));

        return names.Select(name => new BadgeItem(
            name,
            new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase)
            {
                ["shortName"] = name,
                ["name"] = name,
                [badges.LabelPropertyAlias ?? "name"] = name,
                [badges.Icon.PropertyAlias ?? "shortName"] = name
            })).ToList();
    }

    private static IEnumerable<string> AliasesOf(TextLayer layer)
    {
        if (!string.IsNullOrWhiteSpace(layer.Binding.PropertyAlias)) yield return layer.Binding.PropertyAlias;

        foreach (var alias in TextResolver.ReferencedAliases(layer.Binding.Text)) yield return alias;
    }
}
