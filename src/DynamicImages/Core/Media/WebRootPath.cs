namespace Umbraco.Community.DynamicImages.Core.Media;

/// <summary>
/// Resolves and validates wwwroot-relative paths. Every "path" source in a template goes through
/// here: a template is editable in the backoffice, so a path that escapes the web root would be
/// an arbitrary file read for anyone with section access.
/// </summary>
public static class WebRootPath
{
    /// <summary>The absolute path, or null when it is empty, rooted elsewhere, or escapes wwwroot.</summary>
    public static string? Resolve(IWebHostEnvironment hostEnvironment, string? relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath)) return null;

        var webRoot = hostEnvironment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot)) return null;

        var trimmed = relativePath.Replace('\\', '/').TrimStart('~').TrimStart('/');
        if (Path.IsPathRooted(trimmed)) return null;

        var candidate = Path.GetFullPath(Path.Combine(webRoot, trimmed));
        var root = Path.GetFullPath(webRoot);

        // Compare against the root *with* a trailing separator, so "/wwwroot-evil" does not pass
        // as being inside "/wwwroot".
        if (!root.EndsWith(Path.DirectorySeparatorChar)) root += Path.DirectorySeparatorChar;

        return candidate.StartsWith(root, StringComparison.OrdinalIgnoreCase) ? candidate : null;
    }

    public static bool IsSafe(IWebHostEnvironment hostEnvironment, string? relativePath)
        => Resolve(hostEnvironment, relativePath) is not null;
}
