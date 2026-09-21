namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// The ceilings every render is held to, wherever the template came from. A template arrives over
/// the preview endpoint without ever being saved, so the validator's own caps are advice rather
/// than a guard: these are the guard, and they are applied inside the renderer so that the
/// preview endpoint, the publish handler and regeneration all inherit them.
/// <para>
/// The numbers are deliberately generous against real use - an Open Graph image is 1200x630, a
/// Twitter card 1500x500 - and deliberately mean against abuse: a 30000x30000 canvas is a 3.6 GB
/// allocation, which is a single request taking the site down.
/// </para>
/// </summary>
public static class RenderLimits
{
    /// <summary>Longest a canvas may be on either edge.</summary>
    public const int MaxCanvasSide = 4096;

    /// <summary>
    /// Total canvas area, which is what actually costs memory - 8 megapixels is 32 MB of RGBA.
    /// A canvas may be 4096 wide or 4096 tall, but not both.
    /// </summary>
    public const int MaxCanvasPixels = 8_000_000;

    /// <summary>Layers in one template. Past this the template is a mistake, not a design.</summary>
    public const int MaxLayers = 100;

    /// <summary>Point size a text or badge label is clamped to.</summary>
    public const float MaxFontSize = 512f;

    /// <summary>Badges drawn from a picker property, however many nodes it holds.</summary>
    public const int MaxBadgeItems = 50;

    /// <summary>
    /// Characters of resolved text laid out for one layer. Beyond this nothing legible can appear
    /// on a canvas this size anyway, and the glyph layout is what the cost is in.
    /// </summary>
    public const int MaxTextLength = 2_000;

    /// <summary>
    /// How many renders may be in flight at once. Each one owns a full canvas, so the cap is what
    /// stops N concurrent previews from allocating N canvases.
    /// </summary>
    public static readonly int MaxConcurrentRenders = Environment.ProcessorCount;

    /// <summary>Longest edge an image overlay is resized to, given the canvas it is drawn on.</summary>
    public static int MaxOverlaySide(int canvasWidth, int canvasHeight)
        => 2 * Math.Max(1, Math.Max(canvasWidth, canvasHeight));

    /// <summary>
    /// Pixels an image may hold before it is refused as a source. Decoding a 20000x20000 JPEG
    /// costs the same as allocating a canvas that size, so the ceiling has to sit on both.
    /// </summary>
    public const long MaxSourcePixels = (long)MaxCanvasPixels * 4;

    /// <summary>Why <paramref name="width"/> x <paramref name="height"/> is refused, or null when it is allowed.</summary>
    public static string? CanvasProblem(int width, int height)
    {
        if (width < 1 || height < 1) return "The canvas must be at least 1 pixel in each direction.";

        if (width > MaxCanvasSide || height > MaxCanvasSide)
            return $"The canvas may be at most {MaxCanvasSide} pixels in each direction; this one is {width}x{height}.";

        if ((long)width * height > MaxCanvasPixels)
            return $"The canvas may cover at most {MaxCanvasPixels / 1_000_000} megapixels; {width}x{height} is {(long)width * height / 1_000_000} megapixels.";

        return null;
    }
}
