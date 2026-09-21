namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// A template asked for more than <see cref="RenderLimits"/> allows. The message is written for
/// an editor and is safe to return: it says what the limit is and what was asked for, and nothing
/// about the server.
/// </summary>
public sealed class RenderLimitException(string message) : Exception(message);
