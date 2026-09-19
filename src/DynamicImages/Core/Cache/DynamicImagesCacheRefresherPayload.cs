namespace Umbraco.Community.DynamicImages.Core.Cache;

public enum DynamicImagesChangeKind
{
    Template,
    Font,

    /// <summary>Everything - used after an import or a sync run.</summary>
    All
}

/// <summary>
/// What changed, as it travels between servers. Umbraco serialises this into the
/// umbracoCacheInstruction table and replays it on every instance, which is how a template edit
/// on one Cloud instance reaches the others without any bespoke messaging.
/// </summary>
public sealed class DynamicImagesCacheRefresherPayload
{
    public DynamicImagesChangeKind Kind { get; set; }

    public Guid Key { get; set; }
}
