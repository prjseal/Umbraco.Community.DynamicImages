namespace Umbraco.Community.DynamicImages.Composing;

/// <summary>
/// Whether the v1 import is still waiting for a document type to appear.
/// <para>
/// Umbraco's notification handlers are registered at composition time, so a genuinely one-shot
/// handler is not something that can be added and removed. This is the flag that makes
/// <see cref="LegacyImportRetryHandler"/> behave like one: armed only by a first boot that raced
/// uSync, disarmed the moment the import comes back clean, and a no-op on every save after that.
/// </para>
/// <para>
/// Registered as a singleton. The interlocked exchange matters because
/// <c>ContentTypeSavedNotification</c> can arrive on several threads during a uSync import of
/// nearly two hundred items.
/// </para>
/// </summary>
public sealed class LegacyImportRetryState
{
    private int _pending;

    public bool IsPending => Volatile.Read(ref _pending) == 1;

    public void Arm() => Volatile.Write(ref _pending, 1);

    /// <summary>Claims the pending retry. Returns true to exactly one caller, so it cannot double-run.</summary>
    public bool TryClaim() => Interlocked.CompareExchange(ref _pending, 0, 1) == 1;

    /// <summary>Puts the claim back, for a retry that ran but is still waiting on the document type.</summary>
    public void Rearm() => Arm();
}
