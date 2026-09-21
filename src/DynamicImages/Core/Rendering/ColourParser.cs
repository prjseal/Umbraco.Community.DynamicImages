using System.Globalization;
using SixLabors.ImageSharp;

namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Parses the one colour format the package accepts: #RGB, #RRGGBB or #RRGGBBAA (the leading #
/// is optional). A bad colour is a validation error and a caller-supplied fallback, never an
/// exception that takes a publish down.
/// </summary>
public static class ColourParser
{
    public static bool TryParse(string? value, out Color colour)
    {
        colour = Color.Transparent;
        if (string.IsNullOrWhiteSpace(value)) return false;

        var hex = value.Trim().TrimStart('#');

        if (hex.Length == 3)
        {
            // #RGB shorthand - double each nibble.
            hex = string.Concat(hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]);
        }

        if (hex.Length != 6 && hex.Length != 8) return false;

        if (!byte.TryParse(hex.AsSpan(0, 2), NumberStyles.HexNumber, CultureInfo.InvariantCulture, out var r) ||
            !byte.TryParse(hex.AsSpan(2, 2), NumberStyles.HexNumber, CultureInfo.InvariantCulture, out var g) ||
            !byte.TryParse(hex.AsSpan(4, 2), NumberStyles.HexNumber, CultureInfo.InvariantCulture, out var b))
        {
            return false;
        }

        byte a = 255;
        if (hex.Length == 8 &&
            !byte.TryParse(hex.AsSpan(6, 2), NumberStyles.HexNumber, CultureInfo.InvariantCulture, out a))
        {
            return false;
        }

        colour = Color.FromRgba(r, g, b, a);
        return true;
    }

    public static Color ParseOrDefault(string? value, Color fallback)
        => TryParse(value, out var colour) ? colour : fallback;

    /// <summary>
    /// Splits a colour into an opaque colour plus its alpha as a 0-1 blend percentage.
    /// The badge renderer draws through <c>GraphicsOptions.BlendPercentage</c> rather than an
    /// alpha channel.
    /// </summary>
    public static (Color Colour, float BlendPercentage) SplitAlpha(string? value, Color fallback)
    {
        if (!TryParse(value, out var parsed))
        {
            var fb = fallback.ToPixel<SixLabors.ImageSharp.PixelFormats.Rgba32>();
            return (Color.FromRgba(fb.R, fb.G, fb.B, 255), fb.A / 255f);
        }

        var pixel = parsed.ToPixel<SixLabors.ImageSharp.PixelFormats.Rgba32>();
        return (Color.FromRgba(pixel.R, pixel.G, pixel.B, 255), pixel.A / 255f);
    }
}
