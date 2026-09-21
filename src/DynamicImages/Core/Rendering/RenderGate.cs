namespace Umbraco.Community.DynamicImages.Core.Rendering;

/// <summary>
/// Caps how many renders run at once. Registered as a singleton, so the cap is per process: a
/// designer holding down a drag, a bulk regeneration job and a publish all queue against the same
/// gate rather than each allocating its own canvas.
/// <para>
/// Queueing rather than rejecting is deliberate. A publish must not fail because someone else was
/// previewing, and the waits are short - a render is milliseconds, not seconds.
/// </para>
/// </summary>
public sealed class RenderGate : IDisposable
{
    private readonly SemaphoreSlim _semaphore;

    public RenderGate() : this(RenderLimits.MaxConcurrentRenders)
    {
    }

    public RenderGate(int maxConcurrent)
    {
        var permits = Math.Max(1, maxConcurrent);
        _semaphore = new SemaphoreSlim(permits, permits);
    }

    /// <summary>Permits not currently held - for tests and diagnostics.</summary>
    public int Available => _semaphore.CurrentCount;

    /// <summary>Waits for a slot and returns the handle that releases it.</summary>
    public async Task<IDisposable> EnterAsync(CancellationToken cancellationToken = default)
    {
        await _semaphore.WaitAsync(cancellationToken);
        return new Slot(_semaphore);
    }

    public void Dispose() => _semaphore.Dispose();

    private sealed class Slot(SemaphoreSlim semaphore) : IDisposable
    {
        private int _released;

        public void Dispose()
        {
            // Interlocked because a slot handed to a `using` in a method that also disposes it on
            // a failure path would otherwise release two permits and widen the gate for good.
            if (Interlocked.Exchange(ref _released, 1) == 0) semaphore.Release();
        }
    }
}
