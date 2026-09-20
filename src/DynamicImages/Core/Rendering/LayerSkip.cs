namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Why a layer produced nothing. A layer that draws nothing is simply omitted from
/// <see cref="LayerBounds"/>, with no flag and no reason - which is exactly the case where an
/// editor most needs telling, because the image is missing something and the panel is silent
/// about it.
/// <para>
/// This is a channel <i>beside</i> <c>Task&lt;LayerBounds?&gt;</c> rather than a change to it.
/// That contract is load-bearing: relative layout relies on "no bounds means did not draw" to
/// send a tracking layer on up the chain to the next reference.
/// </para>
/// </summary>
public sealed record LayerSkip(Guid LayerKey, string Reason);

/// <summary>The reasons the package itself reports. A custom renderer may supply any text.</summary>
public static class LayerSkipReasons
{
    public const string Hidden = "the layer is hidden";
    public const string Transparent = "its opacity is 0";
    public const string VisibilityRule = "its visibility rule was not met";
    public const string NoRenderer = "no renderer is registered for this layer type";
    public const string Failed = "the layer failed to render";
    public const string EmptyText = "the text resolved to nothing";
    public const string NoFont = "the font is unavailable";
    public const string NoImage = "the image could not be loaded";
    public const string ZeroSize = "the computed size is zero";
    public const string NoItems = "there is nothing to list";

    /// <summary>
    /// The catch-all for a renderer that returned null without saying why. Better than the
    /// silence it replaces, and a prompt to give that renderer a real reason.
    /// </summary>
    public const string ProducedNothing = "this layer produced nothing";
}
