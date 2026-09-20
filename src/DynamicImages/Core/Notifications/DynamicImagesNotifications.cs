using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Notifications;

// Umbraco's SavedNotification<T>/DeletedNotification<T> are abstract with protected constructors,
// and the event aggregator dispatches on the *published* type - so a subscriber can only ever see
// a concrete subclass. These four are that subclass. They are inert with no subscriber: publishing
// one costs a dictionary lookup.
//
// They exist so uSync's SyncHandlerRoot, which already subscribes to SavedNotification<T> and
// DeletedNotification<T>, can be wired up by an optional companion package without the main
// package taking a dependency on uSync. Anything else that wants to react to a template or font
// changing can use the same seam.

/// <summary>Published after a template row is inserted or updated.</summary>
public sealed class DynamicImagesTemplateSavedNotification(Template target, EventMessages messages)
    : SavedNotification<Template>(target, messages);

/// <summary>Published after a template row is deleted. The target is the row as it was before.</summary>
public sealed class DynamicImagesTemplateDeletedNotification(Template target, EventMessages messages)
    : DeletedNotification<Template>(target, messages);

/// <summary>Published after a font row is inserted or updated.</summary>
public sealed class DynamicImagesFontSavedNotification(FontDefinition target, EventMessages messages)
    : SavedNotification<FontDefinition>(target, messages);

/// <summary>Published after a font row is deleted. The target is the row as it was before.</summary>
public sealed class DynamicImagesFontDeletedNotification(FontDefinition target, EventMessages messages)
    : DeletedNotification<FontDefinition>(target, messages);
