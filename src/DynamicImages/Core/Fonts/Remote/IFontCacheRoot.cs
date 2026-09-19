namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

/// <summary>
/// The folder fetched web fonts are cached in on this server. One property, so tests can point
/// the fetcher at a temp directory.
/// </summary>
public interface IFontCacheRoot
{
    string Path { get; }
}
