namespace Umbraco.Community.DynamicImages.Core.Services;

/// <summary>
/// Marks the stretch of a call where this package is itself saving or publishing a node, so the
/// publish handler can tell its own work apart from an editor's.
/// <para>
/// Without it every manual regeneration rendered twice: <see cref="RegenerationService"/> set the
/// property and published, the publish raised <c>ContentPublishingNotification</c>, and the
/// handler rendered and wrote the media all over again. A bulk run over N documents was 2N renders
/// and 2N media saves.
/// </para>
/// <para>
/// <see cref="AsyncLocal{T}"/> rather than a field or a thread-static: the flow is what needs to
/// carry the flag, because the publish is raised on the same logical call stack (it is
/// synchronous) while the regeneration around it is not, and a bulk job runs several of these on
/// thread-pool threads at once. The value flows into the notification and no further, so one
/// document's regeneration cannot suppress another's publish.
/// </para>
/// </summary>
internal static class RegenerationScope
{
    private static readonly AsyncLocal<bool> Active = new();

    /// <summary>Whether the current flow is inside a regeneration's own save or publish.</summary>
    public static bool IsActive => Active.Value;

    /// <summary>Opens the scope; disposing it closes it again.</summary>
    public static IDisposable Begin()
    {
        var previous = Active.Value;
        Active.Value = true;
        return new Handle(previous);
    }

    private sealed class Handle(bool previous) : IDisposable
    {
        private int _restored;

        public void Dispose()
        {
            // The previous value rather than false, so nesting - a regeneration inside a
            // regeneration - closes back to where it started rather than opening a hole.
            if (Interlocked.Exchange(ref _restored, 1) == 0) Active.Value = previous;
        }
    }
}
