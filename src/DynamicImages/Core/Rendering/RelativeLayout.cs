using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Models.Layers;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Resolves positions that track another layer (<see cref="Position.RelativeX"/> and
/// <see cref="Position.RelativeY"/>) into absolute ones.
/// <para>
/// The rules, mirrored exactly by <c>Client/src/models/relative-layout.ts</c> and tested on both
/// sides against <c>relative-layout-fixtures.json</c>:
/// </para>
/// <list type="bullet">
/// <item>A tracked axis becomes an edge coordinate with the anchor forced on that axis: below =
/// top edge at the reference's bottom plus the gap, above = bottom edge at its top minus the gap,
/// rightOf = left edge at its right plus the gap, leftOf = right edge at its left minus the gap.
/// The other axis keeps the layer's own coordinate and anchor component.</item>
/// <item>A reference that drew nothing (empty value, hidden, visibility rule) is skipped and the
/// chain moves on to whatever that layer tracks on the same axis, keeping this layer's own gap.
/// With nothing left, the axis uses the layer's own coordinate.</item>
/// <item>A layer on a reference cycle resolves as absolute on both axes, so the result never
/// depends on z-order or evaluation order.</item>
/// <item>An edge that belongs to the other axis, or a reference to a layer that no longer exists,
/// leaves the axis absolute; both are reported by <see cref="Problems"/>.</item>
/// </list>
/// Pure and static, so it needs no Umbraco services to test.
/// </summary>
public static class RelativeLayout
{
    /// <summary>Whether any layer in the template tracks another, which is what turns the measure pass on.</summary>
    public static bool IsUsed(Template template)
        => template.Layers.Any(layer => layer.Position.IsRelative);

    /// <summary>Layers by key, first occurrence winning should a document ever carry a duplicate.</summary>
    public static IReadOnlyDictionary<Guid, LayerBase> Index(Template template)
    {
        var index = new Dictionary<Guid, LayerBase>(template.Layers.Count);
        foreach (var layer in template.Layers) index.TryAdd(layer.Key, layer);
        return index;
    }

    /// <summary>
    /// Every layer some other layer references, directly or through a chain, ordered so that a
    /// layer comes after everything it references. That is the order the renderer measures them
    /// in before drawing, so a reference can sit anywhere in z-order. Layers on a cycle are still
    /// included - they resolve as absolute, so their order among themselves does not matter.
    /// </summary>
    public static IReadOnlyList<LayerBase> MeasureOrder(Template template)
    {
        var layersByKey = Index(template);
        var referenced = new HashSet<Guid>();

        foreach (var layer in template.Layers)
        {
            foreach (var reference in References(layer)) referenced.Add(reference.LayerKey);
        }

        var order = new List<LayerBase>();
        var state = new Dictionary<Guid, bool>(); // false = visiting, true = done

        void Visit(Guid key)
        {
            if (state.ContainsKey(key)) return; // done, or a back-edge inside a cycle
            if (!layersByKey.TryGetValue(key, out var layer)) return;

            state[key] = false;
            foreach (var reference in References(layer)) Visit(reference.LayerKey);
            state[key] = true;
            order.Add(layer);
        }

        // Walk in z-order so the result is stable for a given document.
        foreach (var layer in template.Layers)
        {
            if (referenced.Contains(layer.Key)) Visit(layer.Key);
        }

        return order;
    }

    /// <summary>
    /// The absolute position of <paramref name="layer"/> given where its references landed.
    /// <paramref name="boundsOf"/> returns null for a layer that drew nothing (or has not been
    /// measured), which is what sends the chain on to the next reference.
    /// </summary>
    public static Position Resolve(
        LayerBase layer,
        IReadOnlyDictionary<Guid, LayerBase> layersByKey,
        Func<Guid, LayerBounds?> boundsOf)
    {
        var position = layer.Position;
        if (!position.IsRelative) return position;

        // A layer on a cycle has no well-defined answer, so it keeps its own coordinates - on
        // both axes, so the outcome cannot depend on which member happened to draw first.
        if (IsOnCycle(layer.Key, layersByKey))
        {
            return new Position { X = position.X, Y = position.Y, Anchor = position.Anchor };
        }

        var x = position.X;
        var y = position.Y;
        var axisX = AnchorMath.AxisX(position.Anchor);
        var axisY = AnchorMath.AxisY(position.Anchor);

        var horizontal = ResolveAxis(layer, position.RelativeX, isVertical: false, layersByKey, boundsOf);
        if (horizontal is { } h)
        {
            x = h.Coordinate;
            axisX = h.Factor;
        }

        var vertical = ResolveAxis(layer, position.RelativeY, isVertical: true, layersByKey, boundsOf);
        if (vertical is { } v)
        {
            y = v.Coordinate;
            axisY = v.Factor;
        }

        return new Position { X = x, Y = y, Anchor = AnchorMath.Compose(axisX, axisY) };
    }

    private static (float Coordinate, float Factor)? ResolveAxis(
        LayerBase layer,
        RelativeReference? reference,
        bool isVertical,
        IReadOnlyDictionary<Guid, LayerBase> layersByKey,
        Func<Guid, LayerBounds?> boundsOf)
    {
        if (reference is null || IsVerticalEdge(reference.Edge) != isVertical) return null;

        var visited = new HashSet<Guid> { layer.Key };
        var current = reference.LayerKey;

        while (visited.Add(current))
        {
            if (!layersByKey.TryGetValue(current, out var target)) return null;

            var bounds = boundsOf(current);
            if (bounds is not null)
            {
                // What the reference covered on the canvas: its rotated footprint, or the box
                // itself when it is not rotated. The gap is always this layer's own, however far
                // up the chain the answer came from.
                var extent = bounds.Extent();

                return reference.Edge switch
                {
                    RelativeEdge.Below => (extent.Y + extent.Height + reference.Gap, 0f),
                    RelativeEdge.Above => (extent.Y - reference.Gap, 1f),
                    RelativeEdge.RightOf => (extent.X + extent.Width + reference.Gap, 0f),
                    _ => (extent.X - reference.Gap, 1f)
                };
            }

            // The reference drew nothing: track whatever it tracks on this axis instead.
            var next = isVertical ? target.Position.RelativeY : target.Position.RelativeX;
            if (next is null || IsVerticalEdge(next.Edge) != isVertical) return null;
            current = next.LayerKey;
        }

        return null;
    }

    /// <summary>
    /// Whether following references out of <paramref name="key"/> (on either axis) leads back to
    /// it. Small templates make the direct walk cheaper than anything cleverer, and it is easy to
    /// mirror on the client.
    /// </summary>
    public static bool IsOnCycle(Guid key, IReadOnlyDictionary<Guid, LayerBase> layersByKey)
    {
        if (!layersByKey.TryGetValue(key, out var start)) return false;

        var visited = new HashSet<Guid>();
        var pending = new Stack<Guid>(References(start).Select(r => r.LayerKey));

        while (pending.Count > 0)
        {
            var current = pending.Pop();
            if (current == key) return true;
            if (!visited.Add(current) || !layersByKey.TryGetValue(current, out var layer)) continue;

            foreach (var reference in References(layer)) pending.Push(reference.LayerKey);
        }

        return false;
    }

    /// <summary>Validation warnings for references that cannot do what they say.</summary>
    public static IEnumerable<ValidationIssue> Problems(Template template)
    {
        var layersByKey = Index(template);

        foreach (var layer in template.Layers)
        {
            var name = string.IsNullOrWhiteSpace(layer.Name) ? layer.TypeAlias : layer.Name;
            var selfReference = false;

            foreach (var (reference, isVertical) in new[] { (layer.Position.RelativeX, false), (layer.Position.RelativeY, true) })
            {
                if (reference is null) continue;

                var axis = isVertical ? "Y" : "X";

                if (reference.LayerKey == layer.Key)
                {
                    selfReference = true;
                    yield return new ValidationIssue(ValidationSeverity.Warning, "RelativeSelf",
                        $"Layer '{name}' is positioned relative to itself on {axis}, so that axis stays where it is.", layer.Key);
                }
                else if (!layersByKey.ContainsKey(reference.LayerKey))
                {
                    yield return new ValidationIssue(ValidationSeverity.Warning, "RelativeMissing",
                        $"Layer '{name}' is positioned relative to a layer that no longer exists on {axis}, so that axis stays where it is.", layer.Key);
                }

                if (IsVerticalEdge(reference.Edge) != isVertical)
                {
                    yield return new ValidationIssue(ValidationSeverity.Warning, "RelativeEdgeMismatch",
                        $"Layer '{name}' uses the '{EdgeName(reference.Edge)}' edge on {axis}, which is the other axis, so that axis stays where it is.", layer.Key);
                }
            }

            if (!selfReference && layer.Position.IsRelative && IsOnCycle(layer.Key, layersByKey))
            {
                yield return new ValidationIssue(ValidationSeverity.Warning, "RelativeCycle",
                    $"Layer '{name}' is part of a loop of relative positions, so it is placed at its own coordinates.", layer.Key);
            }
        }
    }

    private static IEnumerable<RelativeReference> References(LayerBase layer)
    {
        if (layer.Position.RelativeX is { } x) yield return x;
        if (layer.Position.RelativeY is { } y) yield return y;
    }

    private static bool IsVerticalEdge(RelativeEdge edge) => edge is RelativeEdge.Below or RelativeEdge.Above;

    private static string EdgeName(RelativeEdge edge) => edge switch
    {
        RelativeEdge.Below => "below",
        RelativeEdge.Above => "above",
        RelativeEdge.RightOf => "rightOf",
        _ => "leftOf"
    };
}
