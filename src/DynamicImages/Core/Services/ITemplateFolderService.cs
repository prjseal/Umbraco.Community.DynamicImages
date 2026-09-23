using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public enum TreeOperationOutcome
{
    Success,

    NotFound,

    /// <summary>The move target is not a folder that exists.</summary>
    TargetNotFound,

    /// <summary>A folder cannot move into itself or anything below it.</summary>
    WouldCreateCycle,

    /// <summary>A folder still holding folders or templates cannot be deleted.</summary>
    NotEmpty,

    /// <summary>A folder needs a name.</summary>
    InvalidName
}

public sealed record FolderResult(TreeOperationOutcome Outcome, TemplateFolder? Folder = null);

/// <summary>
/// The write path for template folders, and the Templates tree built from folders and templates
/// together.
/// </summary>
public interface ITemplateFolderService
{
    IReadOnlyList<TemplateFolder> GetAll();

    TemplateFolder? Get(Guid key);

    /// <summary>Every folder and every template, as one tree.</summary>
    TemplateTree GetTree();

    /// <summary>
    /// A new folder. <paramref name="key"/> lets the backoffice choose it, as its folder create
    /// modal does; a parent that does not exist is refused rather than silently rooted.
    /// </summary>
    FolderResult Create(string name, Guid? parentKey, Guid? key = null);

    FolderResult Rename(Guid key, string name);

    FolderResult Move(Guid key, Guid? targetKey);

    /// <summary>Refused while the folder holds anything, as core refuses for its own folders.</summary>
    FolderResult Delete(Guid key);

    /// <summary>
    /// Creates or updates a folder under its own key, for uSync and file sync. A parent that is
    /// missing, or that would make a cycle, puts the folder at the root rather than failing.
    /// </summary>
    TemplateFolder Upsert(TemplateFolder folder);
}
